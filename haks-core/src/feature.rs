use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FeatureManifest {
    pub id: String,
    #[serde(rename = "displayName")]
    pub display_name: String,
    #[serde(rename = "defaultSettings")]
    pub default_settings: serde_json::Value,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FeatureState {
    pub running: std::collections::HashMap<String, FeatureProcessState>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FeatureProcessState {
    pub pid: u32,
    pub port: u16,
}

impl Default for FeatureState {
    fn default() -> Self {
        Self {
            running: std::collections::HashMap::new(),
        }
    }
}

impl FeatureState {
    pub fn load() -> Self {
        let path = crate::config::features_dir().join("state.json");
        if path.exists() {
            let contents = std::fs::read_to_string(&path).unwrap_or_default();
            serde_json::from_str(&contents).unwrap_or_default()
        } else {
            Self::default()
        }
    }

    pub fn save(&self) -> Result<(), String> {
        let dir = crate::config::features_dir();
        std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
        let path = dir.join("state.json");
        let json = serde_json::to_string_pretty(self).map_err(|e| e.to_string())?;
        std::fs::write(&path, json).map_err(|e| e.to_string())?;
        Ok(())
    }
}
