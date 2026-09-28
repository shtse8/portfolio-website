//! Checks on the rendered site and its generated dark theme.

use crate::theme;

/// The brand home (`brand/tokens.json`) and this theme hold the same brand
/// colours. The theme's are constants, so this is what keeps the two copies
/// from drifting apart.
#[test]
fn brand_tokens_match_theme() {
    let tokens: serde_json::Value =
        serde_json::from_str(include_str!("../../brand/tokens.json")).expect("brand/tokens.json parses");
    let value = |token: &str| -> String {
        tokens["color"][token]["$value"].as_str().unwrap_or_else(|| panic!("brand token {token}")).to_owned()
    };
    let matches = |name: &str, colour: keel_math::Srgba| {
        let hex = value(name);
        assert_eq!(colour, keel_math::Srgba::from_hex(&hex).expect("token hex"), "theme {name} is not brand {hex}");
    };
    let (light, dark) = (theme::light(), theme::dark());
    matches("ink", light.ink);
    matches("ink-dark", dark.ink);
    matches("canvas", light.canvas);
    matches("canvas-dark", dark.canvas);
    matches("surface", light.surface);
    matches("surface-dark", dark.surface);
    matches("accent", light.accent);
    matches("accent-dark", dark.accent);
    matches("ember", theme::ember());
}

#[test]
fn dark_stylesheet_is_current() {
    let path = concat!(env!("CARGO_MANIFEST_DIR"), "/assets/dark.css");
    let generated = theme::dark_stylesheet();
    if std::env::var_os("KYLET_WRITE_DARK").is_some() {
        std::fs::write(path, &generated).expect("write dark.css");
    }
    let committed = std::fs::read_to_string(path).unwrap_or_default();
    assert!(committed == generated, "assets/dark.css is stale: run KYLET_WRITE_DARK=1 cargo test -p kylet-site dark_stylesheet");
}
