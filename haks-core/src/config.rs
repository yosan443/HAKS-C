use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GlobalConfig {
    pub gemini_api_key: String,
}

impl Default for GlobalConfig {
    fn default() -> Self {
        Self {
            gemini_api_key: String::new(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FeatureSettings {
    pub window: WindowSettings,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct WindowSettings {
    pub width: f64,
    pub height: f64,
}

impl Default for WindowSettings {
    fn default() -> Self {
        Self {
            width: 400.0,
            height: 600.0,
        }
    }
}

pub fn data_dir() -> PathBuf {
    let base = dirs_sys();
    base.join("HAKS")
}

fn dirs_sys() -> PathBuf {
    use std::env;
    if let Ok(dir) = env::var("HAKS_DATA_DIR") {
        return PathBuf::from(dir);
    }
    let local_app_data = env::var("LOCALAPPDATA")
        .or_else(|_| env::var("XDG_DATA_HOME"))
        .unwrap_or_else(|_| {
            let home = env::var("HOME").or_else(|_| env::var("USERPROFILE")).unwrap_or_default();
            format!("{}/.local/share", home)
        });
    PathBuf::from(local_app_data)
}

pub fn features_dir() -> PathBuf {
    data_dir().join("features")
}

pub fn read_global_config() -> GlobalConfig {
    let path = data_dir().join("global-config.json");
    if path.exists() {
        let contents = std::fs::read_to_string(&path).unwrap_or_default();
        serde_json::from_str(&contents).unwrap_or_default()
    } else {
        GlobalConfig::default()
    }
}

pub fn write_global_config(config: &GlobalConfig) -> Result<(), String> {
    let dir = data_dir();
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let path = dir.join("global-config.json");
    let json = serde_json::to_string_pretty(config).map_err(|e| e.to_string())?;
    std::fs::write(&path, json).map_err(|e| e.to_string())?;
    Ok(())
}

pub fn read_feature_config(feature_id: &str) -> serde_json::Value {
    let path = features_dir().join(format!("{}-config.json", feature_id));
    if path.exists() {
        let contents = std::fs::read_to_string(&path).unwrap_or_default();
        serde_json::from_str(&contents).unwrap_or(serde_json::Value::Null)
    } else {
        serde_json::Value::Null
    }
}

pub fn write_feature_config(feature_id: &str, config: &serde_json::Value) -> Result<(), String> {
    let dir = features_dir();
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let path = dir.join(format!("{}-config.json", feature_id));
    let json = serde_json::to_string_pretty(config).map_err(|e| e.to_string())?;
    std::fs::write(&path, json).map_err(|e| e.to_string())?;
    Ok(())
}
