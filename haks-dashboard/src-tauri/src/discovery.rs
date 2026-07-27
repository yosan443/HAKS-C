use haks_core::feature::{FeatureManifest, FeatureState, FeatureProcessState};
use std::path::PathBuf;
use std::process::{Command, Child};
use std::sync::Mutex;
use std::collections::HashMap;
use tauri::{AppHandle, Emitter};

static MANAGED_PROCESSES: std::sync::LazyLock<Mutex<HashMap<String, Child>>> =
    std::sync::LazyLock::new(|| Mutex::new(HashMap::new()));

pub fn scan_features() -> Vec<FeatureManifest> {
    let features_dir = features_dir_path();
    let mut manifests = Vec::new();

    if !features_dir.exists() {
        return manifests;
    }

    if let Ok(entries) = std::fs::read_dir(&features_dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.extension().and_then(|s| s.to_str()) == Some("exe") {
                if let Some(manifest) = run_manifest(&path) {
                    manifests.push(manifest);
                }
            }
        }
    }

    manifests
}

fn run_manifest(exe_path: &PathBuf) -> Option<FeatureManifest> {
    match Command::new(exe_path).arg("--manifest").output() {
        Ok(output) => {
            if output.status.success() {
                let stdout = String::from_utf8_lossy(&output.stdout);
                serde_json::from_str(stdout.trim()).ok()
            } else {
                None
            }
        }
        Err(_) => None,
    }
}

pub async fn launch_feature(app: &AppHandle, feature_id: &str) -> Result<(), String> {
    let features_dir = features_dir_path();
    let exe_path = features_dir.join(format!("haks-{}.exe", feature_id));

    if !exe_path.exists() {
        return Err(format!("Feature binary not found: {}", exe_path.display()));
    }

    let mut state = FeatureState::load();
    if state.running.contains_key(feature_id) {
        return Ok(());
    }

    let child = Command::new(&exe_path)
        .spawn()
        .map_err(|e| format!("Failed to launch {}: {}", feature_id, e))?;

    let pid = child.id();

    let port = match feature_id {
        "chat" => 19001u16,
        "vision" => 19002u16,
        "voice" => 19003u16,
        _ => 19000u16,
    };

    state.running.insert(feature_id.to_string(), FeatureProcessState { pid, port });
    state.save()?;

    MANAGED_PROCESSES.lock().unwrap().insert(feature_id.to_string(), child);

    let _ = app.emit("feature-state-changed", serde_json::json!({
        "feature_id": feature_id,
        "running": true,
    }));

    Ok(())
}

pub async fn kill_feature(app: &AppHandle, feature_id: &str) -> Result<(), String> {
    let mut procs = MANAGED_PROCESSES.lock().unwrap();
    if let Some(mut child) = procs.remove(feature_id) {
        let _ = child.kill();
        let _ = child.wait();
    }

    let mut state = FeatureState::load();
    state.running.remove(feature_id);
    state.save()?;

    let _ = app.emit("feature-state-changed", serde_json::json!({
        "feature_id": feature_id,
        "running": false,
    }));

    Ok(())
}

pub fn kill_all_features() {
    let mut procs = MANAGED_PROCESSES.lock().unwrap();
    for (_, mut child) in procs.drain() {
        let _ = child.kill();
        let _ = child.wait();
    }
}

fn features_dir_path() -> PathBuf {
    let current_exe = std::env::current_exe().unwrap_or_default();
    let exe_dir = current_exe.parent().unwrap_or_else(|| std::path::Path::new("."));
    exe_dir.join("features")
}
