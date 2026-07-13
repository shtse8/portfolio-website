use kylet_api_rust::rest_projection::parse_stream_chat_request;
use serde_json::json;

#[test]
fn stream_chat_request_parses_ui_message_shape() {
    let body = json!({
        "messages": [{
            "role": "user",
            "parts": [{ "type": "text", "text": "hello" }]
        }]
    });
    let parsed = parse_stream_chat_request(&body).expect("proto-backed parse");
    assert_eq!(parsed.messages.len(), 1);
    assert_eq!(parsed.messages[0].role, "user");
    assert_eq!(parsed.messages[0].parts[0].r#type, "text");
}
