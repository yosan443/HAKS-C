use axum::{
    routing::{get, post},
    Json, Router,
};
use haks_core::{
    config,
    ipc,
    feature::FeatureManifest,
};
use notify::{Watcher, Config};
use serde::{Deserialize, Serialize};
use tauri::Emitter;
use std::sync::Mutex;

static CONTEXT_SENDER: std::sync::LazyLock<Mutex<Option<tokio::sync::broadcast::Sender<serde_json::Value>>>> =
    std::sync::LazyLock::new(|| Mutex::new(None));

#[derive(Debug, Serialize, Deserialize, Clone)]
struct VoiceConfig {
    voice_dir: String,
}

impl Default for VoiceConfig {
    fn default() -> Self {
        Self {
            voice_dir: String::new(),
        }
    }
}

fn load_config() -> VoiceConfig {
    let v = config::read_feature_config("voice");
    serde_json::from_value(v).unwrap_or_default()
}

#[derive(Debug, Serialize, Clone)]
struct VoiceUpdate {
    file_path: String,
    transcript: String,
}

#[tauri::command]
fn get_voice_config() -> VoiceConfig {
    load_config()
}

#[tauri::command]
fn get_global_config() -> config::GlobalConfig {
    config::read_global_config()
}

fn start_monitoring_voice(app: tauri::AppHandle) {
    tauri::async_runtime::spawn(async move {
        let (tx, rx) = std::sync::mpsc::channel();
        let mut watcher = notify::RecommendedWatcher::new(tx, Config::default()).unwrap();
        let mut watching_path: Option<std::path::PathBuf> = None;

        loop {
            let cfg = load_config();
            let path_str = cfg.voice_dir.clone();

            let new_path = if !path_str.is_empty() {
                Some(std::path::PathBuf::from(&path_str))
            } else {
                None
            };

            if new_path != watching_path {
                if let Some(old_path) = &watching_path {
                    let _ = watcher.unwatch(old_path);
                }

                if let Some(p) = &new_path {
                    if p.exists() {
                        if let Err(e) = watcher.watch(p, notify::RecursiveMode::NonRecursive) {
                            eprintln!("Voice Watch Error: {}", e);
                            watching_path = None;
                        } else {
                            watching_path = new_path.clone();
                            println!("Started watching voice dir: {:?}", p);
                        }
                    }
                }
            }

            if let Ok(res) = rx.recv_timeout(std::time::Duration::from_secs(2)) {
                if let Ok(event) = res {
                    if let notify::EventKind::Create(_) = event.kind {
                        for path in &event.paths {
                            let path_buf = path.to_owned();
                            if is_audio(&path_buf) {
                                let app_clone = app.clone();
                                tauri::async_runtime::spawn(async move {
                                    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;

                                    let mime_type = match path_buf.extension().and_then(|s| s.to_str()).unwrap_or("").to_lowercase().as_str() {
                                        "mp3" => "audio/mpeg",
                                        "wav" => "audio/wav",
                                        "m4a" => "audio/mp4",
                                        "ogg" => "audio/ogg",
                                        "aac" => "audio/aac",
                                        _ => "application/octet-stream",
                                    };

                                    let cfg = config::read_global_config();
                                    let api_key = cfg.gemini_api_key.trim();
                                    if api_key.is_empty() {
                                        eprintln!("Voice: API key not configured");
                                        return;
                                    }

                                    match haks_core::gemini::upload_file_to_gemini(api_key, &path_buf, mime_type).await {
                                        Ok(uri) => {
                                            match haks_core::gemini::analyze_uploaded_file(api_key, &uri, mime_type, "この音声ファイルの内容を正確に文字起こししてください。").await {
                                                Ok(transcript) => {
                                                    let _ = app_clone.emit("voice-update", VoiceUpdate {
                                                        file_path: path_buf.to_string_lossy().to_string(),
                                                        transcript,
                                                    });
                                                }
                                                Err(e) => eprintln!("Voice Analyze Error: {}", e),
                                            }
                                        }
                                        Err(e) => eprintln!("Voice Upload Error: {}", e),
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
    });
}

fn is_audio(path: &std::path::Path) -> bool {
    let ext = path.extension().and_then(|s| s.to_str()).unwrap_or("").to_lowercase();
    matches!(ext.as_str(), "mp3" | "wav" | "m4a" | "aac")
}

async fn start_axum_server(app: tauri::AppHandle) -> Result<(), String> {
    let state = app.clone();
    let app_router = Router::new()
        .route("/health", get(|| async { "OK" }))
        .route("/command", post(handle_command))
        .with_state(state.clone());

    let listener = tokio::net::TcpListener::bind("127.0.0.1:19003")
        .await
        .map_err(|e| format!("Failed to bind voice server: {}", e))?;

    axum::serve(listener, app_router)
        .await
        .map_err(|e| format!("Voice server error: {}", e))?;

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
            id: "voice".to_string(),
            display_name: "Voice Transcriber".to_string(),
            default_settings: serde_json::json!({
                "voiceDir": "",
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
            get_voice_config,
            get_global_config,
        ])
        .setup(|app| {
            let handle = app.handle();
            let (tx, _rx) = tokio::sync::broadcast::channel::<serde_json::Value>(32);
            *CONTEXT_SENDER.lock().unwrap() = Some(tx);

            start_monitoring_voice(handle.clone());

            let h = handle.clone();
            tauri::async_runtime::spawn(async move {
                if let Err(e) = start_axum_server(h).await {
                    eprintln!("Voice axum server error: {}", e);
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
