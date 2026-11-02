//! The engine emits both device palettes; the site needs no generated dark file.

use keel::web::{block_on, Request};

#[test]
fn every_page_carries_the_device_scheme_pair() {
    let site = crate::site();
    for path in ["/", "/about", "/colophon", "/no-such-page"] {
        let page = block_on(block_on(site.handle(Request::get(path))).into_text());
        assert!(
            page.contains("@media (prefers-color-scheme:dark){"),
            "{path}: no dark rules"
        );
        assert!(
            page.contains(":root{color-scheme:light dark}"),
            "{path}: no device scheme declaration"
        );
        assert!(
            !page.contains("/assets/dark.css"),
            "{path}: legacy stylesheet still requested"
        );
    }
}
