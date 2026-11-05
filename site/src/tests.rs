//! The engine emits both device palettes; the site needs no generated dark file.

use keel::web::{block_on, Request};

#[test]
fn every_page_carries_the_device_scheme_pair() {
    let site = crate::site();
    for path in ["/", "/about", "/colophon", "/no-such-page"] {
        // keel-migrate: URL/form decoding now returns Result; propagate invalid escapes or UTF-8 instead of accepting partial fields (docs/MIGRATING.md#strict-url-and-form-decoding).
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

#[test]
fn indexable_pages_advertise_their_own_english_url() {
    let site = crate::site();
    for (request, path) in [
        ("/", "/"),
        ("/about", "/about"),
        ("/colophon", "/colophon"),
        ("/about?from=home", "/about"),
    ] {
        let page = block_on(block_on(site.handle(Request::get(request))).into_text());
        let head = page.split("</head>").next().expect("document head");
        assert!(
            head.contains(&format!(
                "<link rel=\"alternate\" href=\"{}{path}\" hreflang=\"en\">",
                crate::ORIGIN
            )),
            "{request}: no English alternate for this page"
        );
        assert_eq!(
            head.matches("hreflang=\"en\"").count(),
            1,
            "{request}: conflicting English alternates"
        );
    }
}
