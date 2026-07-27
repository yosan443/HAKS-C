use serde::{Deserialize, Serialize};
use std::path::Path;

use crate::gemini;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct KnowledgeSource {
    pub id: String,
    pub source_type: String,
    pub name: String,
    pub path_or_url: String,
    pub content: String,
    pub file_uri: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Knowledge {
    pub id: String,
    pub name: String,
    pub system_prompt: String,
    pub sources: Vec<KnowledgeSource>,
    pub cache_name: Option<String>,
}

fn knowledge_path() -> std::path::PathBuf {
    crate::config::data_dir().join("knowledge-bases.json")
}

pub fn list_knowledge() -> Vec<Knowledge> {
    let path = knowledge_path();
    if path.exists() {
        let contents = std::fs::read_to_string(&path).unwrap_or_default();
        serde_json::from_str(&contents).unwrap_or_default()
    } else {
        Vec::new()
    }
}

pub fn save_knowledge(knowledge: Vec<Knowledge>) -> Result<(), String> {
    let path = knowledge_path();
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    let json = serde_json::to_string_pretty(&knowledge).map_err(|e| e.to_string())?;
    std::fs::write(&path, json).map_err(|e| e.to_string())?;
    Ok(())
}

pub async fn process_and_add_source(
    api_key: &str,
    path_or_url: &str,
) -> Result<KnowledgeSource, String> {
    let source_id = uuid::Uuid::new_v4().to_string();
    let name: String;
    let content: String;
    let source_type: String;
    let mut file_uri = None;

    if path_or_url.starts_with("http") {
        source_type = "url".to_string();
        name = path_or_url.to_string();
        content = fetch_text_from_url(path_or_url).await?;
    } else {
        source_type = "file".to_string();
        let path = Path::new(path_or_url);
        name = path.file_name().and_then(|n| n.to_str()).unwrap_or("Unknown File").to_string();

        let ext = path.extension().and_then(|s| s.to_str()).unwrap_or("").to_lowercase();
        match ext.as_str() {
            "pdf" | "mp3" | "wav" | "m4a" | "ogg" => {
                let mime = match ext.as_str() {
                    "pdf" => "application/pdf",
                    "mp3" => "audio/mpeg",
                    "wav" => "audio/wav",
                    "m4a" => "audio/mp4",
                    "ogg" => "audio/ogg",
                    _ => "application/octet-stream",
                };
                let uri = gemini::upload_file_to_gemini(api_key, path, mime).await?;
                file_uri = Some(uri.clone());

                let prompt = if ext == "pdf" {
                    "このPDFファイルの内容を、ナレッジベースとして活用できるように重要な情報を全てテキスト形式で詳細に書き出してください。表やリストもテキストで表現してください。"
                } else {
                    "この音声ファイルの内容を正確に全て文字起こししてください。"
                };
                content = gemini::analyze_uploaded_file(api_key, &uri, mime, prompt).await
                    .unwrap_or_else(|e| format!("[Extraction Failed: {}]", e));
            }
            "md" | "txt" => {
                content = std::fs::read_to_string(path).map_err(|e| e.to_string())?;
            }
            _ => {
                content = std::fs::read_to_string(path)
                    .map_err(|e| format!("Support for .{} is not yet implemented or failed to read: {}", ext, e))?;
            }
        }
    }

    Ok(KnowledgeSource {
        id: source_id,
        source_type,
        name,
        path_or_url: path_or_url.to_string(),
        content,
        file_uri,
    })
}

pub async fn update_knowledge_cache(
    api_key: &str,
    knowledge_id: &str,
) -> Result<String, String> {
    let mut knowledge = list_knowledge();
    let kb_index = knowledge.iter().position(|k| k.id == knowledge_id)
        .ok_or("Knowledge Base not found")?;
    let kb = &knowledge[kb_index];

    let mut messages = Vec::new();
    let mut parts = Vec::new();

    parts.push(gemini::GeminiPart {
        text: Some(kb.system_prompt.clone()),
        inline_data: None,
        file_data: None,
    });

    for source in &kb.sources {
        if let Some(uri) = &source.file_uri {
            parts.push(gemini::GeminiPart {
                text: None,
                inline_data: None,
                file_data: Some(gemini::GeminiFileData {
                    mime_type: match Path::new(&source.path_or_url)
                        .extension()
                        .and_then(|s| s.to_str())
                        .unwrap_or("")
                    {
                        "pdf" => "application/pdf".to_string(),
                        _ => "application/octet-stream".to_string(),
                    },
                    file_uri: uri.clone(),
                }),
            });
        }
        if !source.content.is_empty() && !source.content.starts_with("[File Uploaded:") {
            parts.push(gemini::GeminiPart {
                text: Some(format!("\n--- Source: {} ---\n{}\n", source.name, source.content)),
                inline_data: None,
                file_data: None,
            });
        }
    }

    messages.push(gemini::GeminiMessage {
        role: "user".to_string(),
        parts,
    });

    let cache_name = gemini::create_cached_content(api_key, messages, "604800s").await?;

    knowledge[kb_index].cache_name = Some(cache_name.clone());
    save_knowledge(knowledge)?;

    Ok(cache_name)
}

async fn fetch_text_from_url(url: &str) -> Result<String, String> {
    let client = reqwest::Client::new();
    let html = client.get(url).send().await.map_err(|e| e.to_string())?.text().await.map_err(|e| e.to_string())?;

    let re_script = regex::Regex::new(r"(?s)<script.*?>.*?</script>").unwrap();
    let re_style = regex::Regex::new(r"(?s)<style.*?>.*?</style>").unwrap();

    let no_script = re_script.replace_all(&html, "");
    let no_style = re_style.replace_all(&no_script, "");

    let re_tags = regex::Regex::new(r"<[^>]*>").unwrap();
    let text = re_tags.replace_all(&no_style, " ");
    Ok(text.to_string())
}
