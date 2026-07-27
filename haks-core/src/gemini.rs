use serde::{Deserialize, Serialize};
use futures_util::StreamExt;
use base64::{Engine as _, engine::general_purpose};
use std::fs;
use std::path::Path;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GeminiMessage {
    pub role: String,
    pub parts: Vec<GeminiPart>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GeminiPart {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub inline_data: Option<GeminiInlineData>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub file_data: Option<GeminiFileData>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GeminiFileData {
    pub mime_type: String,
    pub file_uri: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GeminiInlineData {
    pub mime_type: String,
    pub data: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GeminiContent {
    pub contents: Vec<GeminiMessage>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub system_instruction: Option<GeminiMessage>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cached_content: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CachedContentRequest {
    pub model: String,
    pub contents: Vec<GeminiMessage>,
    pub ttl: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CachedContentResponse {
    pub name: String,
    pub expire_time: String,
}

#[derive(Debug, Deserialize)]
pub struct FileUploadResponse {
    pub file: GeminiFile,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GeminiFile {
    pub name: String,
    pub uri: String,
}

#[derive(Debug, Deserialize, Clone)]
pub struct GeminiResponse {
    pub candidates: Option<Vec<GeminiCandidate>>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct GeminiCandidate {
    pub content: Option<GeminiMessage>,
    pub finish_reason: Option<String>,
}

#[derive(Debug, Serialize, Clone)]
pub struct ChatChunk {
    pub text: String,
    pub done: bool,
    pub error: Option<String>,
}

pub async fn analyze_file(
    api_key: &str,
    file_path: &Path,
    mime_type: &str,
    prompt: &str,
) -> Result<String, String> {
    let file_data = fs::read(file_path).map_err(|e| e.to_string())?;
    let base64_data = general_purpose::STANDARD.encode(file_data);

    let model = "gemini-3.5-flash-lite";
    let url = build_url(model, api_key);

    let payload = GeminiContent {
        contents: vec![GeminiMessage {
            role: "user".to_string(),
            parts: vec![
                GeminiPart { text: Some(prompt.to_string()), inline_data: None, file_data: None },
                GeminiPart {
                    text: None,
                    inline_data: Some(GeminiInlineData {
                        mime_type: mime_type.to_string(),
                        data: base64_data,
                    }),
                    file_data: None,
                },
            ],
        }],
        system_instruction: None,
        cached_content: None,
    };

    send_request(&url, &payload).await
}

pub async fn analyze_uploaded_file(
    api_key: &str,
    file_uri: &str,
    mime_type: &str,
    prompt: &str,
) -> Result<String, String> {
    let model = "gemini-3.5-flash-lite";
    let url = build_url(model, api_key);

    let payload = GeminiContent {
        contents: vec![GeminiMessage {
            role: "user".to_string(),
            parts: vec![
                GeminiPart { text: Some(prompt.to_string()), inline_data: None, file_data: None },
                GeminiPart {
                    text: None,
                    inline_data: None,
                    file_data: Some(GeminiFileData {
                        mime_type: mime_type.to_string(),
                        file_uri: file_uri.to_string(),
                    }),
                },
            ],
        }],
        system_instruction: None,
        cached_content: None,
    };

    send_request(&url, &payload).await
}

pub async fn upload_file_to_gemini(
    api_key: &str,
    file_path: &Path,
    mime_type: &str,
) -> Result<String, String> {
    let file_data = std::fs::read(file_path).map_err(|e| e.to_string())?;

    let metadata = serde_json::json!({
        "file": {
            "displayName": file_path.file_name().unwrap_or_default().to_string_lossy()
        }
    });

    let init_url = format!(
        "https://generativelanguage.googleapis.com/upload/v1beta/files?key={}",
        api_key
    );

    let client = reqwest::Client::new();
    let init_response = client
        .post(&init_url)
        .header("X-Goog-Upload-Protocol", "resumable")
        .header("X-Goog-Upload-Command", "start")
        .header("X-Goog-Upload-Header-Content-Length", file_data.len())
        .header("X-Goog-Upload-Header-Content-Type", mime_type)
        .header("Content-Type", "application/json")
        .json(&metadata)
        .send()
        .await
        .map_err(|e| format!("Upload initiation failed: {}", e))?;

    if !init_response.status().is_success() {
        let status = init_response.status();
        let err = init_response.text().await.unwrap_or_default();
        return Err(format!("Upload initiation failed (Status {}): {}", status, err));
    }

    let upload_url = init_response
        .headers()
        .get("X-Goog-Upload-URL")
        .and_then(|v| v.to_str().ok())
        .ok_or("Failed to get upload URL from Gemini API")?;

    let upload_response = client
        .post(upload_url)
        .header("X-Goog-Upload-Protocol", "resumable")
        .header("X-Goog-Upload-Command", "upload, finalize")
        .header("X-Goog-Upload-Offset", "0")
        .body(file_data)
        .send()
        .await
        .map_err(|e| format!("File data upload failed: {}", e))?;

    if !upload_response.status().is_success() {
        let status = upload_response.status();
        let err = upload_response.text().await.unwrap_or_default();
        return Err(format!("File data upload failed (Status {}): {}", status, err));
    }

    let text = upload_response.text().await.map_err(|e| e.to_string())?;
    let resp_json: FileUploadResponse = serde_json::from_str(&text)
        .map_err(|e| format!("File Upload JSON Error: {} | Raw: {}", e, text))?;
    Ok(resp_json.file.uri)
}

pub async fn create_cached_content(
    api_key: &str,
    messages: Vec<GeminiMessage>,
    ttl: &str,
) -> Result<String, String> {
    let url = format!(
        "https://generativelanguage.googleapis.com/v1beta/cachedContents?key={}",
        api_key
    );

    let payload = CachedContentRequest {
        model: "models/gemini-3.5-flash-lite".to_string(),
        contents: messages,
        ttl: ttl.to_string(),
    };

    let client = reqwest::Client::new();
    let response = client
        .post(&url)
        .json(&payload)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !response.status().is_success() {
        let status = response.status();
        let err = response.text().await.unwrap_or_default();
        if err.contains("Cached content is too small") {
            return Err("資料の合計トークン数が不足しているため（通常1,024トークン以上必要）、キャッシュを作成できません。資料を増やすか、現在のまま（テキスト抽出方式）でご利用ください。".to_string());
        }
        return Err(format!("Caching failed (Status {}): {}", status, err));
    }

    let text = response.text().await.map_err(|e| e.to_string())?;
    let resp_json: CachedContentResponse = serde_json::from_str(&text)
        .map_err(|e| format!("Caching JSON Error: {} | Raw: {}", e, text))?;
    Ok(resp_json.name)
}

pub async fn chat_with_gemini(
    api_key: &str,
    messages: Vec<GeminiMessage>,
    system_prompt: Option<String>,
    knowledge_id: Option<String>,
    image_path: Option<String>,
) -> Result<String, String> {
    let model = "gemini-3.5-flash-lite";
    let url = format!(
        "https://generativelanguage.googleapis.com/v1beta/models/{}:streamGenerateContent?alt=sse&key={}",
        model, api_key
    );

    let knowledge = crate::knowledge::list_knowledge();
    let mut knowledge_context = String::new();
    let mut cached_content_name: Option<String> = None;

    if let Some(id) = knowledge_id {
        if let Some(kb) = knowledge.into_iter().find(|k| k.id == id) {
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

    let default_system_prompt = "You are HAKS, a helpful AI assistant.".to_string();
    let base_system_prompt = system_prompt.unwrap_or(default_system_prompt);

    let final_system_prompt = if knowledge_context.is_empty() {
        base_system_prompt
    } else {
        format!("{}\n\n{}", base_system_prompt, knowledge_context)
    };

    let mut user_messages = messages.clone();

    if let Some(path) = image_path {
        let path_buf = std::path::PathBuf::from(&path);
        if path_buf.exists() {
            let file_data = std::fs::read(&path_buf).map_err(|e| e.to_string())?;
            let base64_data = general_purpose::STANDARD.encode(file_data);

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
                parts: vec![GeminiPart { text: Some(final_system_prompt), inline_data: None, file_data: None }],
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
        return Err(format!("Gemini API Error ({}): {}", status, err_body));
    }

    let mut stream = response.bytes_stream();
    let mut buffer = String::new();
    let mut total_text = String::new();

    while let Some(item) = stream.next().await {
        let chunk = item.map_err(|e| e.to_string())?;
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
                                        }
                                    }
                                }
                            }
                        }
                    }
                    Err(e) => {
                        eprintln!("HAKS: Failed to parse Gemini chunk: {} | JSON: {}", e, json_str);
                    }
                }
            }
        }
    }

    if total_text.is_empty() {
        Err("Gemini returned an empty response.".to_string())
    } else {
        Ok(total_text)
    }
}

fn build_url(model: &str, api_key: &str) -> String {
    format!(
        "https://generativelanguage.googleapis.com/v1beta/models/{}:generateContent?key={}",
        model, api_key
    )
}

async fn send_request(url: &str, payload: &GeminiContent) -> Result<String, String> {
    let client = reqwest::Client::new();
    let response = client
        .post(url)
        .header("Content-Type", "application/json")
        .json(payload)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !response.status().is_success() {
        let status = response.status();
        let err_body = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
        return Err(format!("Gemini API Error ({}): {}", status, err_body));
    }

    let text = response.text().await.map_err(|e| e.to_string())?;
    let resp_json: GeminiResponse = serde_json::from_str(&text)
        .map_err(|e| format!("JSON Parse Error: {} | Raw: {}", e, text))?;

    let result_text = resp_json.candidates
        .and_then(|c| c.first().cloned())
        .and_then(|can| can.content)
        .and_then(|content| content.parts.first().cloned())
        .and_then(|part| part.text)
        .ok_or("分析結果を取得できませんでした".to_string())?;

    Ok(result_text)
}
