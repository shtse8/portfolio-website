//! Checks on the rendered site and its generated dark theme.

use crate::theme;

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
