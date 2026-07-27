use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Manager,
};

mod discovery;
mod relay;

use haks_core::{config, knowledge, gemini, feature::FeatureManifest};

const TRAY_DASHBOARD: &str = "tray_dashboard";
const TRAY_CHAT: &str = "tray_chat";
const TRAY_VISION: &str = "tray_vision";
const TRAY_VOICE: &str = "tray_voice";

#[tauri::command]
fn get_config() -> config::GlobalConfig {
    config::read_global_config()
}

#[tauri::command]
fn save_config(cfg: config::GlobalConfig) -> Result<(), String> {
    config::write_global_config(&cfg)
}

#[tauri::command]
fn get_config_value(key: String) -> serde_json::Value {
    let cfg = config::read_global_config();
    match key.as_str() {
        "gemini_api_key" => serde_json::json!(cfg.gemini_api_key),
        _ => serde_json::Value::Null,
    }
}

#[tauri::command]
fn list_knowledge() -> Vec<knowledge::Knowledge> {
    knowledge::list_knowledge()
}

#[tauri::command]
fn save_knowledge(knowledge_items: Vec<knowledge::Knowledge>) -> Result<(), String> {
    knowledge::save_knowledge(knowledge_items)
}

#[tauri::command]
async fn process_and_add_source(path_or_url: String) -> Result<knowledge::KnowledgeSource, String> {
    let cfg = config::read_global_config();
    let api_key = cfg.gemini_api_key.trim();
    if api_key.is_empty() {
        return Err("APIキーが設定されていません".to_string());
    }
    knowledge::process_and_add_source(api_key, &path_or_url).await
}

#[tauri::command]
async fn update_knowledge_cache(knowledge_id: String) -> Result<String, String> {
    let cfg = config::read_global_config();
    let api_key = cfg.gemini_api_key.trim();
    if api_key.is_empty() {
        return Err("APIキーが設定されていません".to_string());
    }
    knowledge::update_knowledge_cache(api_key, &knowledge_id).await
}

#[tauri::command]
async fn chat_with_gemini(
    _app: AppHandle,
    messages: Vec<gemini::GeminiMessage>,
    system_prompt: Option<String>,
    knowledge_id: Option<String>,
    image_path: Option<String>,
) -> Result<String, String> {
    let cfg = config::read_global_config();
    let api_key = cfg.gemini_api_key.trim();
    if api_key.is_empty() {
        return Err("APIキーが設定されていません".to_string());
    }
    gemini::chat_with_gemini(api_key, messages, system_prompt, knowledge_id, image_path).await
}

#[tauri::command]
async fn get_latest_screenshot(screenshot_dir: String) -> Result<serde_json::Value, String> {
    use std::path::PathBuf;

    let path = PathBuf::from(&screenshot_dir);
    if !path.exists() || !path.is_dir() {
        return Err(format!("Directory does not exist: {}", screenshot_dir));
    }

    let mut latest_file: Option<(PathBuf, std::time::SystemTime)> = None;

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

            use base64::Engine as _;
            let b64 = base64::engine::general_purpose::STANDARD.encode(&data);
            let data_url = format!("data:{};base64,{}", mime, b64);

            Ok(serde_json::json!({
                "path": file_path.to_string_lossy().to_string(),
                "data_url": data_url,
            }))
        }
        None => Err("No images found in the directory.".to_string()),
    }
}

#[tauri::command]
fn get_features() -> Vec<FeatureManifest> {
    discovery::scan_features()
}

#[tauri::command]
async fn launch_feature(app: AppHandle, feature_id: String) -> Result<(), String> {
    discovery::launch_feature(&app, &feature_id).await
}

#[tauri::command]
async fn kill_feature(app: AppHandle, feature_id: String) -> Result<(), String> {
    discovery::kill_feature(&app, &feature_id).await
}

#[tauri::command]
fn get_feature_state() -> serde_json::Value {
    let state = haks_core::feature::FeatureState::load();
    serde_json::to_value(state).unwrap_or_default()
}

#[tauri::command]
fn read_feature_config(feature_id: String) -> serde_json::Value {
    config::read_feature_config(&feature_id)
}

#[tauri::command]
fn write_feature_config(feature_id: String, value: serde_json::Value) -> Result<(), String> {
    config::write_feature_config(&feature_id, &value)
}

fn show_dashboard_window(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("dashboard") {
        let _ = window.show();
        let _ = window.set_focus();
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            get_config,
            save_config,
            get_config_value,
            list_knowledge,
            save_knowledge,
            process_and_add_source,
            update_knowledge_cache,
            chat_with_gemini,
            get_latest_screenshot,
            get_features,
            launch_feature,
            kill_feature,
            get_feature_state,
            read_feature_config,
            write_feature_config,
        ])
        .setup(|app| {
            let handle = app.handle();

            let quit_i = MenuItem::with_id(handle, "quit", "Quit HAKS", true, None::<&str>)?;
            let show_i = MenuItem::with_id(handle, "show", "Show Dashboard", true, None::<&str>)?;
            let menu = Menu::with_items(handle, &[&show_i, &quit_i])?;

            let h_dash = handle.clone();
            let quit_id = quit_i.id().clone();
            let show_id = show_i.id().clone();
            let _tray_dashboard = TrayIconBuilder::with_id(TRAY_DASHBOARD)
                .tooltip("HAKS: Dashboard")
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .on_menu_event(move |app, event| {
                    if event.id == quit_id {
                        discovery::kill_all_features();
                        app.exit(0);
                    } else if event.id == show_id {
                        show_dashboard_window(app);
                    }
                })
                .on_tray_icon_event(move |_tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        show_dashboard_window(&h_dash);
                    }
                })
                .build(app)?;

            for (tray_id, feature_id, tooltip) in &[
                (TRAY_CHAT, "chat", "HAKS: Quick Chat"),
                (TRAY_VISION, "vision", "HAKS: Vision Scanner"),
                (TRAY_VOICE, "voice", "HAKS: Voice Transcriber"),
            ] {
                let h = handle.clone();
                let fid = feature_id.to_string();
                let _tray = TrayIconBuilder::with_id(*tray_id)
                    .tooltip(*tooltip)
                    .icon(app.default_window_icon().unwrap().clone())
                    .on_tray_icon_event(move |_tray, event| {
                        if let TrayIconEvent::Click {
                            button: MouseButton::Left,
                            button_state: MouseButtonState::Up,
                            ..
                        } = event
                        {
                            let h2 = h.clone();
                            let fid2 = fid.clone();
                            tauri::async_runtime::spawn(async move {
                                let _ = discovery::launch_feature(&h2, &fid2).await;
                            });
                        }
                    })
                    .build(app)?;
            }

            let h_relay = handle.clone();
            tauri::async_runtime::spawn(async move {
                if let Err(e) = relay::start_relay_server(h_relay).await {
                    eprintln!("Relay server error: {}", e);
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
