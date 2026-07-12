//! Chat agent tool-function schemas (OpenAI function-calling shape).
//! SSOT for tool names/parameters used by POST /chat (TICK038 rust_impl).

use serde_json::{json, Value};

/// Canonical tool-function definitions for the portfolio chat agent.
#[must_use]
pub fn tools_schema() -> Vec<Value> {
    vec![
        json!({
            "type": "function",
            "function": {
                "name": "list_projects",
                "description": "List Kyle's top projects by live GitHub stars.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "limit": { "type": "number" }
                    }
                }
            }
        }),
        json!({
            "type": "function",
            "function": {
                "name": "get_repo",
                "description": "Get live details for a specific repository.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "name": { "type": "string" }
                    },
                    "required": ["name"]
                }
            }
        }),
        json!({
            "type": "function",
            "function": {
                "name": "recent_activity",
                "description": "Show Kyle's most recently shipped repos.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "limit": { "type": "number" }
                    }
                }
            }
        }),
        json!({
            "type": "function",
            "function": {
                "name": "search_projects",
                "description": "Search Kyle's repos by keyword.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": { "type": "string" }
                    },
                    "required": ["query"]
                }
            }
        }),
        json!({
            "type": "function",
            "function": {
                "name": "npm_downloads",
                "description": "Get npm download counts for a package.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "pkg": { "type": "string" }
                    },
                    "required": ["pkg"]
                }
            }
        }),
    ]
}

/// Ordered tool names (stable contract for corpus assertions).
#[must_use]
pub fn tool_names() -> Vec<String> {
    tools_schema()
        .iter()
        .filter_map(|t| {
            t.get("function")
                .and_then(|f| f.get("name"))
                .and_then(|n| n.as_str())
                .map(str::to_string)
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn five_tools_with_stable_names() {
        let names = tool_names();
        assert_eq!(
            names,
            vec![
                "list_projects".to_string(),
                "get_repo".to_string(),
                "recent_activity".to_string(),
                "search_projects".to_string(),
                "npm_downloads".to_string()
            ]
        );
    }

    #[test]
    fn each_tool_is_function_type() {
        for tool in tools_schema() {
            assert_eq!(tool["type"], "function");
            assert!(tool["function"]["name"].is_string());
            assert!(tool["function"]["parameters"]["type"] == "object");
        }
    }
}
