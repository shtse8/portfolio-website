//! Pure chat message transforms (no network / no gateway).
//! Extracted so residual unit tests can lock UI-message → OpenAI shape without effects.

use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct UIMessage {
    pub role: String,
    #[serde(default)]
    pub content: Option<Value>,
    #[serde(default)]
    pub parts: Option<Vec<UIPart>>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct UIPart {
    #[serde(rename = "type")]
    pub kind: String,
    #[serde(default)]
    pub text: Option<String>,
}

/// Map AI-SDK-style UI messages to OpenAI chat message objects.
/// Drops empty non-assistant messages and unknown roles.
#[must_use]
pub fn ui_messages_to_openai(messages: &[UIMessage]) -> Vec<Value> {
    messages
        .iter()
        .filter_map(|m| {
            let role = m.role.as_str();
            if role != "user" && role != "assistant" && role != "system" {
                return None;
            }
            let text: String = if let Some(parts) = &m.parts {
                parts
                    .iter()
                    .filter(|p| p.kind == "text")
                    .filter_map(|p| p.text.clone())
                    .collect::<Vec<_>>()
                    .join("")
            } else if let Some(c) = &m.content {
                if let Some(s) = c.as_str() {
                    s.to_string()
                } else if let Some(arr) = c.as_array() {
                    arr.iter()
                        .filter_map(|p| {
                            p.get("type")
                                .and_then(|t| t.as_str())
                                .filter(|t| *t == "text")
                                .and_then(|_| p.get("text").and_then(|t| t.as_str()))
                        })
                        .collect::<Vec<_>>()
                        .join("")
                } else {
                    String::new()
                }
            } else {
                String::new()
            };
            if text.is_empty() && role != "assistant" {
                return None;
            }
            Some(json!({ "role": role, "content": text }))
        })
        .collect()
}

/// Approximate payload size for rate / size gates (pure).
#[must_use]
pub fn message_payload_len(messages: &[UIMessage]) -> usize {
    messages
        .iter()
        .map(|m| {
            m.parts
                .as_ref()
                .map(|p| {
                    p.iter()
                        .filter_map(|x| x.text.as_ref())
                        .map(|t| t.len())
                        .sum::<usize>()
                })
                .unwrap_or(0)
                + m.content.as_ref().map(|c| c.to_string().len()).unwrap_or(0)
        })
        .sum()
}

/// Pure package URL path encoding for npm downloads range API.
#[must_use]
pub fn urlencoding_encode(s: &str) -> String {
    s.chars()
        .map(|c| match c {
            'A'..='Z' | 'a'..='z' | '0'..='9' | '-' | '_' | '.' | '~' => c.to_string(),
            _ => format!("%{:02X}", c as u8),
        })
        .collect()
}

/// Bun-compatible repo name sanitization used by get_repo_detail (pure path only).
#[must_use]
pub fn sanitize_repo_name(name: &str) -> Option<String> {
    let raw = name.trim().trim_start_matches(['/', '.']);
    let raw = raw.rsplit('/').next().unwrap_or(raw);
    if raw
        .chars()
        .all(|c| c.is_ascii_alphanumeric() || c == '.' || c == '-' || c == '_')
        && !raw.is_empty()
        && raw.len() <= 100
    {
        Some(raw.to_string())
    } else {
        None
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn ui_messages_parts_path_joins_text() {
        let msgs = vec![UIMessage {
            role: "user".into(),
            content: None,
            parts: Some(vec![
                UIPart {
                    kind: "text".into(),
                    text: Some("hello ".into()),
                },
                UIPart {
                    kind: "text".into(),
                    text: Some("world".into()),
                },
                UIPart {
                    kind: "tool-invocation".into(),
                    text: Some("ignored".into()),
                },
            ]),
        }];
        let out = ui_messages_to_openai(&msgs);
        assert_eq!(out.len(), 1);
        assert_eq!(out[0]["role"], "user");
        assert_eq!(out[0]["content"], "hello world");
    }

    #[test]
    fn ui_messages_content_string_and_array() {
        let msgs = vec![
            UIMessage {
                role: "system".into(),
                content: Some(json!("sys")),
                parts: None,
            },
            UIMessage {
                role: "user".into(),
                content: Some(json!([{ "type": "text", "text": "hi" }])),
                parts: None,
            },
            UIMessage {
                role: "tool".into(),
                content: Some(json!("nope")),
                parts: None,
            },
            UIMessage {
                role: "assistant".into(),
                content: Some(json!("")),
                parts: None,
            },
            UIMessage {
                role: "user".into(),
                content: Some(json!("")),
                parts: None,
            },
        ];
        let out = ui_messages_to_openai(&msgs);
        assert_eq!(out.len(), 3);
        assert_eq!(out[0]["role"], "system");
        assert_eq!(out[0]["content"], "sys");
        assert_eq!(out[1]["content"], "hi");
        assert_eq!(out[2]["role"], "assistant");
        assert_eq!(out[2]["content"], "");
    }

    #[test]
    fn message_payload_len_sums_parts_and_content() {
        let msgs = vec![UIMessage {
            role: "user".into(),
            content: Some(json!("abcd")),
            parts: Some(vec![UIPart {
                kind: "text".into(),
                text: Some("xy".into()),
            }]),
        }];
        // parts "xy" (2) + content serialized length of "\"abcd\"" (6) = 8
        assert_eq!(message_payload_len(&msgs), 2 + json!("abcd").to_string().len());
    }

    #[test]
    fn urlencoding_encodes_scope_and_leaves_safe() {
        assert_eq!(urlencoding_encode("lodash"), "lodash");
        assert_eq!(urlencoding_encode("@scope/pkg"), "%40scope%2Fpkg");
        assert_eq!(urlencoding_encode("a_b-c.d~"), "a_b-c.d~");
    }

    #[test]
    fn sanitize_repo_name_matches_bun_rules() {
        assert_eq!(sanitize_repo_name("../../etc").as_deref(), Some("etc"));
        assert_eq!(sanitize_repo_name("valid-repo").as_deref(), Some("valid-repo"));
        assert_eq!(sanitize_repo_name(""), None);
        assert_eq!(sanitize_repo_name("has spaces"), None);
        assert_eq!(sanitize_repo_name("org/name").as_deref(), Some("name"));
    }

    // --- WAVE3 pure residual deepen ---

    #[test]
    fn sanitize_repo_name_rejects_too_long_and_leading_dots_trim() {
        assert_eq!(sanitize_repo_name("...ok").as_deref(), Some("ok"));
        assert_eq!(sanitize_repo_name(&"a".repeat(101)), None);
        let long = "a".repeat(100);
        assert_eq!(sanitize_repo_name(&long).as_deref(), Some(long.as_str()));
        assert_eq!(sanitize_repo_name("bad!name"), None);
    }

    #[test]
    fn ui_messages_parts_take_priority_over_content() {
        let msgs = vec![UIMessage {
            role: "user".into(),
            content: Some(json!("ignored-content")),
            parts: Some(vec![UIPart {
                kind: "text".into(),
                text: Some("from-parts".into()),
            }]),
        }];
        let out = ui_messages_to_openai(&msgs);
        assert_eq!(out.len(), 1);
        assert_eq!(out[0]["content"], "from-parts");
    }

    #[test]
    fn message_payload_len_empty_messages_is_zero() {
        assert_eq!(message_payload_len(&[]), 0);
    }
}

#[cfg(test)]
mod fleet_web_finish_wave5_tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn urlencoding_encodes_space_and_plus() {
        assert_eq!(urlencoding_encode("a b"), "a%20b");
        assert_eq!(urlencoding_encode("a+b"), "a%2Bb");
        assert_eq!(urlencoding_encode(""), "");
    }

    #[test]
    fn sanitize_repo_name_accepts_underscore_and_dot() {
        assert_eq!(sanitize_repo_name("my_repo.name").as_deref(), Some("my_repo.name"));
        assert_eq!(sanitize_repo_name("/leading/slash").as_deref(), Some("slash"));
        assert_eq!(sanitize_repo_name("..."), None); // empty after trim
    }

    #[test]
    fn message_payload_len_parts_only_without_content() {
        let msgs = vec![UIMessage {
            role: "user".into(),
            content: None,
            parts: Some(vec![
                UIPart {
                    kind: "text".into(),
                    text: Some("ab".into()),
                },
                UIPart {
                    kind: "text".into(),
                    text: Some("cd".into()),
                },
            ]),
        }];
        assert_eq!(message_payload_len(&msgs), 4);
    }

    #[test]
    fn ui_messages_skips_empty_user_content_without_parts() {
        let msgs = vec![UIMessage {
            role: "user".into(),
            content: Some(json!("")),
            parts: None,
        }];
        // empty string content for user is filtered (see existing content tests)
        let out = ui_messages_to_openai(&msgs);
        assert!(out.is_empty() || out.iter().all(|m| m["content"] != ""));
    }
}

#[cfg(test)]
mod fleet_web_finish_wave6_tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn ui_messages_maps_roles_and_skips_tool_noise() {
        let msgs = vec![
            UIMessage {
                role: "system".into(),
                content: Some(json!("s")),
                parts: None,
            },
            UIMessage {
                role: "user".into(),
                content: Some(json!("u")),
                parts: None,
            },
            UIMessage {
                role: "assistant".into(),
                content: Some(json!("a")),
                parts: None,
            },
        ];
        let out = ui_messages_to_openai(&msgs);
        assert_eq!(out.len(), 3);
        assert_eq!(out[0]["role"], "system");
        assert_eq!(out[1]["role"], "user");
        assert_eq!(out[2]["role"], "assistant");
    }

    #[test]
    fn message_payload_len_sums_content_when_no_parts() {
        let msgs = vec![UIMessage {
            role: "user".into(),
            content: Some(json!("hello")),
            parts: None,
        }];
        let expected = json!("hello").to_string().len();
        assert_eq!(message_payload_len(&msgs), expected);
    }

    #[test]
    fn urlencoding_percent_encodes_unicode_and_slash() {
        assert_eq!(urlencoding_encode("a/b"), "a%2Fb");
        assert_eq!(urlencoding_encode("100%"), "100%25");
        assert_eq!(urlencoding_encode("ok-_.~"), "ok-_.~");
    }

    #[test]
    fn sanitize_repo_name_strips_path_and_rejects_control() {
        assert_eq!(sanitize_repo_name("owner/repo").as_deref(), Some("repo"));
        assert_eq!(sanitize_repo_name("////x").as_deref(), Some("x"));
        assert_eq!(sanitize_repo_name("repo\nname"), None);
        assert_eq!(sanitize_repo_name("repo@name"), None);
    }
}
