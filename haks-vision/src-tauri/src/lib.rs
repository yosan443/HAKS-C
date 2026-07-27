use axum::{
    routing::{get, post},
    Json, Router,
};
use haks_core::{
    config,
    gemini::{GeminiMessage, GeminiContent, GeminiPart, GeminiResponse, GeminiInlineData},
    ipc,
    knowledge,
    feature::FeatureManifest,
};
use serde::{Deserialize, Serialize};
use tauri::{Emitter, Manager};
use std::sync::Mutex;

static CONTEXT_SENDER: std::sync::LazyLock<Mutex<Option<tokio::sync::broadcast::Sender<serde_json::Value>>>> =
    std::sync::LazyLock::new(|| Mutex::new(None));

#[derive(Debug, Serialize, Deserialize, Clone)]
struct VisionConfig {
    screenshot_dir: String,
}

impl Default for VisionConfig {
    fn default() -> Self {
        Self {
            screenshot_dir: String::new(),
        }
    }
}

fn load_config() -> VisionConfig {
    let v = config::read_feature_config("vision");
    serde_json::from_value(v).unwrap_or_default()
}

#[derive(Debug, Serialize, Clone)]
struct ChatChunkEvent {
    text: String,
    done: bool,
    error: Option<String>,
}

#[derive(Debug, Serialize, Clone)]
struct ScreenshotInfo {
    path: String,
    data_url: String,
}

#[tauri::command]
fn get_vision_config() -> VisionConfig {
    load_config()
}

#[tauri::command]
fn get_global_config() -> config::GlobalConfig {
    config::read_global_config()
}

#[tauri::command]
fn list_knowledge() -> Vec<knowledge::Knowledge> {
    knowledge::list_knowledge()
}

#[tauri::command]
fn get_latest_screenshot() -> Result<ScreenshotInfo, String> {
    let cfg = load_config();
    let dir_path = cfg.screenshot_dir;

    if dir_path.is_empty() {
        return Err("Screenshot directory is not configured.".to_string());
    }

    let path = std::path::PathBuf::from(&dir_path);
    if !path.exists() || !path.is_dir() {
        return Err(format!("Directory does not exist: {}", dir_path));
    }

    let mut latest_file: Option<(std::path::PathBuf, std::time::SystemTime)> = None;

    if let Ok(entries) = std::fs::read_dir(&path) {
        for entry in entries.flatten() {
            let entry_path = entry.path();
            if entry_path.is_file() {
                if let Some(ext) = entry_path.extension().and_then(|s| s.to_str()) {
                    let ext_lower = ext.to_lowercase();
                    if matches!(ext_lower.as_str(), "png" | "jpg" | "jpeg" | "webp") {
                        if let Ok(metadata) = std::fs::metadata(&entry_path) {
                            if let Ok(modified) = metadata.modified() {
                                match latest_file {
                                    Some((_, time)) => {
                                        if modified > time {
                                            latest_file = Some((entry_path, modified));
                                        }
                                    }
                                    None => {
                                        latest_file = Some((entry_path, modified));
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    match latest_file {
        Some((file_path, _)) => {
            let data = std::fs::read(&file_path).map_err(|e| e.to_string())?;
            let mime = if let Some(ext) = file_path.extension().and_then(|s| s.to_str()) {
                match ext.to_lowercase().as_str() {
                    "png" => "image/png",
                    "jpg" | "jpeg" => "image/jpeg",
                    "webp" => "image/webp",
                    _ => "application/octet-stream",
                }
            } else { "application/octet-stream" };

            let b64 = base64::Engine::encode(&base64::engine::general_purpose::STANDARD, &data);
            let data_url = format!("data:{};base64,{}", mime, b64);

            Ok(ScreenshotInfo {
                path: file_path.to_string_lossy().to_string(),
                data_url,
            })
        }
        None => Err("No images found in the directory.".to_string()),
    }
}

#[tauri::command]
async fn chat_with_gemini(
    app: tauri::AppHandle,
    messages: Vec<GeminiMessage>,
    system_prompt: Option<String>,
    knowledge_id: Option<String>,
    image_path: Option<String>,
) -> Result<(), String> {
    let window = app.get_webview_window("vision").ok_or("Window not found")?;
    let cfg = config::read_global_config();
    let api_key = cfg.gemini_api_key.trim();
    if api_key.is_empty() {
        return Err("APIキーが設定されていません".to_string());
    }

    let knowledge = knowledge::list_knowledge();
    let mut knowledge_context = String::new();
    let mut cached_content_name: Option<String> = None;

    if let Some(id) = &knowledge_id {
        if let Some(kb) = knowledge.into_iter().find(|k| k.id == *id) {
            cached_content_name = kb.cache_name.clone();
            knowledge_context.push_str(&format!("### Knowledge Base: {}\n", kb.name));
            knowledge_context.push_str(&kb.system_prompt);
            knowledge_context.push_str("\n\nBelow are relevant document snippets:\n");
            for source in kb.sources {
                knowledge_context.push_str(&format!("--- Source: {} ---\n", source.name));
                knowledge_context.push_str(&source.content);
                knowledge_context.push_str("\n\n");
            }
        }
    }

    let default_prompt = "You are HAKS Vision Scanner. Analyze this screenshot and answer user questions.".to_string();
    let base_prompt = system_prompt.unwrap_or(default_prompt);
    let final_prompt = if knowledge_context.is_empty() {
        base_prompt
    } else {
        format!("{}\n\n{}", base_prompt, knowledge_context)
    };

    let model = "gemini-3.5-flash-lite";
    let url = format!(
        "https://generativelanguage.googleapis.com/v1beta/models/{}:streamGenerateContent?alt=sse&key={}",
        model, api_key
    );

    let mut user_messages = messages.clone();

    if let Some(path) = image_path {
        let path_buf = std::path::PathBuf::from(&path);
        if path_buf.exists() {
            let file_data = std::fs::read(&path_buf).map_err(|e| e.to_string())?;
            let base64_data = base64::Engine::encode(&base64::engine::general_purpose::STANDARD, &file_data);
            if let Some(last_msg) = user_messages.last_mut() {
                last_msg.parts.push(GeminiPart {
                    text: None,
                    inline_data: Some(GeminiInlineData {
                        mime_type: "image/png".to_string(),
                        data: base64_data,
                    }),
                    file_data: None,
                });
            }
        }
    }

    let payload = GeminiContent {
        contents: user_messages,
        system_instruction: if cached_content_name.is_some() {
            None
        } else {
            Some(GeminiMessage {
                role: "system".to_string(),
                parts: vec![GeminiPart {
                    text: Some(final_prompt),
                    inline_data: None,
                    file_data: None,
                }],
            })
        },
        cached_content: cached_content_name,
    };

    let client = reqwest::Client::new();
    let response = client
        .post(&url)
        .header("Content-Type", "application/json")
        .json(&payload)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !response.status().is_success() {
        let status = response.status();
        let err_body = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
        let _ = window.emit("chat-chunk", ChatChunkEvent {
            text: String::new(),
            done: true,
            error: Some(format!("Gemini API Error ({}): {}", status, err_body)),
        });
        return Ok(());
    }

    use futures_util::StreamExt;
    let mut stream = response.bytes_stream();
    let mut buffer = String::new();
    let mut total_text = String::new();

    while let Some(item) = stream.next().await {
        let chunk = match item {
            Ok(c) => c,
            Err(e) => {
                let _ = window.emit("chat-chunk", ChatChunkEvent {
                    text: String::new(),
                    done: true,
                    error: Some(e.to_string()),
                });
                return Ok(());
            }
        };
        let text = String::from_utf8_lossy(&chunk);
        buffer.push_str(&text);

        while let Some(pos) = buffer.find('\n') {
            let line = buffer[..pos].to_string();
            buffer = buffer[pos + 1..].to_string();
            let trimmed = line.trim();
            if trimmed.is_empty() { continue; }

            if trimmed.starts_with("data:") {
                let json_str = trimmed[5..].trim();
                match serde_json::from_str::<GeminiResponse>(json_str) {
                    Ok(resp) => {
                        if let Some(candidates) = resp.candidates {
                            for candidate in candidates {
                                if let Some(content) = candidate.content {
                                    for part in content.parts {
                                        if let Some(t) = part.text {
                                            total_text.push_str(&t);
                                            let _ = window.emit("chat-chunk", ChatChunkEvent {
                                                text: t,
                                                done: false,
                                                error: None,
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                    Err(e) => {
                        eprintln!("Failed to parse Gemini chunk: {} | JSON: {}", e, json_str);
                    }
                }
            }
        }
    }

    let _ = window.emit("chat-chunk", ChatChunkEvent {
        text: String::new(),
        done: true,
        error: if total_text.is_empty() {
            Some("Gemini returned an empty response.".to_string())
        } else {
            None
        },
    });

    Ok(())
}

async fn start_axum_server(app: tauri::AppHandle) -> Result<(), String> {
    let state = app.clone();
    let app_router = Router::new()
        .route("/health", get(|| async { "OK" }))
        .route("/command", post(handle_command))
        .with_state(state.clone());

    let listener = tokio::net::TcpListener::bind("127.0.0.1:19002")
        .await
        .map_err(|e| format!("Failed to bind vision server: {}", e))?;

    axum::serve(listener, app_router)
        .await
        .map_err(|e| format!("Vision server error: {}", e))?;

    Ok(())
}

async fn handle_command(
    axum::extract::State(app): axum::extract::State<tauri::AppHandle>,
    Json(cmd): Json<ipc::CommandPayload>,
) -> &'static str {
    if cmd.cmd_type == "inject-context" {
        let payload = cmd.payload.clone();
        if let Some(tx) = CONTEXT_SENDER.lock().unwrap().as_ref() {
            let _ = tx.send(cmd.payload);
        }
        let _ = app.emit("inject-context", payload);
    }
    "OK"
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let args: Vec<String> = std::env::args().collect();

    if args.contains(&"--manifest".to_string()) {
        let manifest = FeatureManifest {
            id: "vision".to_string(),
            display_name: "Vision Scanner".to_string(),
            default_settings: serde_json::json!({
                "screenshotDir": "",
                "window": { "width": 400, "height": 600 }
            }),
        };
        println!("{}", serde_json::to_string(&manifest).unwrap());
        return;
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            get_vision_config,
            get_global_config,
            list_knowledge,
            get_latest_screenshot,
            chat_with_gemini,
        ])
        .setup(|app| {
            let handle = app.handle().clone();
            let (tx, _rx) = tokio::sync::broadcast::channel::<serde_json::Value>(32);
            *CONTEXT_SENDER.lock().unwrap() = Some(tx);

            tauri::async_runtime::spawn(async move {
                if let Err(e) = start_axum_server(handle).await {
                    eprintln!("Vision axum server error: {}", e);
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
