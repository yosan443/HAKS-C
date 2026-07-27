use axum::{
    routing::post,
    Json, Router,
};
use haks_core::ipc::RelayRequest;
use tauri::{AppHandle, Emitter};

pub async fn start_relay_server(app: AppHandle) -> Result<(), String> {
    let state = app.clone();

    let app_router = Router::new()
        .route("/relay", post(handle_relay))
        .route("/health", axum::routing::get(|| async { "OK" }))
        .with_state(state.clone());

    let listener = tokio::net::TcpListener::bind("127.0.0.1:18900")
        .await
        .map_err(|e| format!("Failed to bind relay server: {}", e))?;

    axum::serve(listener, app_router)
        .await
        .map_err(|e| format!("Relay server error: {}", e))?;

    Ok(())
}

async fn handle_relay(
    axum::extract::State(app): axum::extract::State<AppHandle>,
    Json(req): Json<RelayRequest>,
) -> &'static str {
    let state = haks_core::feature::FeatureState::load();

    if let Some(target) = state.running.get(&req.to) {
        let port = target.port;
        let url = format!("http://127.0.0.1:{}/command", port);

        let client = reqwest::Client::new();
        let payload = serde_json::json!({
            "type": req.msg_type,
            "payload": req.payload,
        });

        match client.post(&url).json(&payload).send().await {
            Ok(_) => {
                let _ = app.emit("relay-success", serde_json::json!({
                    "from": req.from,
                    "to": req.to,
                    "type": req.msg_type,
                }));
            }
            Err(e) => {
                let _ = app.emit("relay-error", serde_json::json!({
                    "from": req.from,
                    "to": req.to,
                    "error": e.to_string(),
                }));
            }
        }
    } else {
        let _ = app.emit("relay-error", serde_json::json!({
            "from": req.from,
            "to": req.to,
            "error": "Target feature not running",
        }));
    }

    "OK"
}
