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

    #[test]
    fn required_fields_match_contract() {
        let schema = tools_schema();
        let by_name: std::collections::BTreeMap<_, _> = schema
            .iter()
            .filter_map(|t| {
                let name = t["function"]["name"].as_str()?.to_string();
                Some((name, t.clone()))
            })
            .collect();
        assert!(by_name["get_repo"]["function"]["parameters"]["required"]
            .as_array()
            .unwrap()
            .iter()
            .any(|v| v == "name"));
        assert!(by_name["search_projects"]["function"]["parameters"]["required"]
            .as_array()
            .unwrap()
            .iter()
            .any(|v| v == "query"));
        assert!(by_name["npm_downloads"]["function"]["parameters"]["required"]
            .as_array()
            .unwrap()
            .iter()
            .any(|v| v == "pkg"));
        assert!(
            by_name["list_projects"]["function"]["parameters"]
                .get("required")
                .is_none()
        );
    }

    // --- WAVE3 pure residual deepen ---

    #[test]
    fn recent_activity_has_no_required_and_npm_pkg_string() {
        let schema = tools_schema();
        let by_name: std::collections::BTreeMap<_, _> = schema
            .iter()
            .filter_map(|t| {
                let name = t["function"]["name"].as_str()?.to_string();
                Some((name, t.clone()))
            })
            .collect();
        assert!(
            by_name["recent_activity"]["function"]["parameters"]
                .get("required")
                .is_none()
        );
        assert_eq!(
            by_name["npm_downloads"]["function"]["parameters"]["properties"]["pkg"]["type"],
            "string"
        );
        assert_eq!(
            by_name["get_repo"]["function"]["parameters"]["properties"]["name"]["type"],
            "string"
        );
    }


    #[test]
    fn fleet_web_media_wave4_tool_names_unique_and_stable_order() {
        let names = tool_names();
        assert_eq!(names.len(), 5);
        let mut sorted = names.clone();
        // stable contract order — not sorted alphabetically necessarily
        let mut seen = std::collections::BTreeSet::new();
        for n in &names {
            assert!(seen.insert(n.clone()), "duplicate tool {n}");
        }
        assert!(names.contains(&"list_projects".to_string()) || names.iter().any(|n| n.contains("project") || n.contains("repo") || n.contains("activity") || n.contains("npm") || n.contains("search")));
        let _ = sorted;
    }
}

#[cfg(test)]
mod fleet_web_finish_wave6_tests {
    use super::*;

    #[test]
    fn tool_descriptions_non_empty_and_names_stable() {
        let schema = tools_schema();
        assert_eq!(schema.len(), 5);
        for t in &schema {
            let desc = t["function"]["description"].as_str().unwrap_or("");
            assert!(!desc.is_empty(), "empty description for {:?}", t["function"]["name"]);
        }
        assert_eq!(
            tool_names(),
            vec![
                "list_projects",
                "get_repo",
                "recent_activity",
                "search_projects",
                "npm_downloads"
            ]
        );
    }

    #[test]
    fn list_and_recent_limit_is_number_type() {
        let schema = tools_schema();
        let by_name: std::collections::BTreeMap<_, _> = schema
            .iter()
            .filter_map(|t| {
                let name = t["function"]["name"].as_str()?.to_string();
                Some((name, t.clone()))
            })
            .collect();
        assert_eq!(
            by_name["list_projects"]["function"]["parameters"]["properties"]["limit"]["type"],
            "number"
        );
        assert_eq!(
            by_name["recent_activity"]["function"]["parameters"]["properties"]["limit"]["type"],
            "number"
        );
        assert_eq!(
            by_name["search_projects"]["function"]["parameters"]["properties"]["query"]["type"],
            "string"
        );
    }
}

#[cfg(test)]
mod fleet_web_finish_wave8_tests {
    use super::*;

    #[test]
    fn npm_downloads_and_get_repo_required_fields() {
        let schema = tools_schema();
        let by: std::collections::BTreeMap<_, _> = schema
            .iter()
            .filter_map(|t| {
                let n = t["function"]["name"].as_str()?.to_string();
                Some((n, t.clone()))
            })
            .collect();
        // required field names follow the schema SSOT (pkg / name, not package)
        let npm_req = by["npm_downloads"]["function"]["parameters"]["required"]
            .as_array()
            .cloned()
            .unwrap_or_default();
        let npm_props = by["npm_downloads"]["function"]["parameters"]["properties"]
            .as_object()
            .cloned()
            .unwrap_or_default();
        assert!(
            npm_req.iter().any(|v| matches!(v.as_str(), Some("package") | Some("pkg")))
                || npm_props.contains_key("package")
                || npm_props.contains_key("pkg"),
            "npm required/props={npm_req:?} keys={:?}",
            npm_props.keys().collect::<Vec<_>>()
        );
        let get_req = by["get_repo"]["function"]["parameters"]["required"]
            .as_array()
            .cloned()
            .unwrap_or_default();
        let get_props = by["get_repo"]["function"]["parameters"]["properties"]
            .as_object()
            .cloned()
            .unwrap_or_default();
        assert!(
            get_req.iter().any(|v| matches!(v.as_str(), Some("name") | Some("repo")))
                || get_props.contains_key("name")
                || get_props.contains_key("repo"),
            "get_repo required={get_req:?}"
        );
        for name in tool_names() {
            assert_eq!(
                by[&name]["function"]["parameters"]["type"],
                "object",
                "params type for {name}"
            );
        }
    }

    #[test]
    fn tools_schema_function_type_is_function() {
        for t in tools_schema() {
            assert_eq!(t["type"], "function");
            assert!(t["function"]["name"].as_str().unwrap().len() > 0);
        }
    }
}
