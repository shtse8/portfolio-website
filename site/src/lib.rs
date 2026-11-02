//! kylet.se: Kyle Tse's site, built with Keel Engine. Routes, head and the
//! page frame live here; the pages are in `pages.rs`, the facts they show in
//! `content.rs`, and the look in `theme.rs`.

pub mod content;
pub mod islands;
mod pages;
pub mod theme;
#[cfg(test)]
mod tests;
mod ui;
mod roles;

use keel::ui::Component;
use keel::web::{ClientBundle, Head, Hydration, JsonLd, Route, RouteCx, Site};

use ui::*;

pub const ORIGIN: &str = "https://kylet.se";
const NAME: &str = "Kyle Tse";
const TITLE: &str = "Kyle Tse — founder of Sylphx";
const DESCRIPTION: &str = "Kyle Tse has shipped consumer software to millions of people for twenty years. Now he is building Sylphx, a software company that runs on AI agents.";

/// The header's links: label, target and the page they mark as current.
const MENU: [(&str, &str, Option<&str>); 3] = [("Work", "/#work", None), ("About", "/about", Some("/about")), ("Contact", "/#contact", None)];

const FOOT_LINKS: [(&str, &str); 5] = [
    ("Work", "/#work"),
    ("About", "/about"),
    ("Colophon", "/colophon"),
    ("Privacy", "/colophon#privacy"),
    ("GitHub", content::GITHUB),
];

fn header(cx: &RouteCx) -> Component {
    let path = cx.path();
    let menu = MENU.iter().enumerate().fold(nav_el("menu", SiteSurface::Menu).aria_label("Primary"), |nav, (i, (label, href, page))| {
        let current = page.is_some_and(|page| path.trim_end_matches('/') == page);
        let link = a(format!("menu-{i}"), *label, href, if current { SiteSurface::MenuLinkCurrent } else { SiteSurface::MenuLink });
        nav.child(if current { link.aria_current(true) } else { link })
    });
    head_el("top", SiteSurface::Top).backdrop_blur(20.0).child(
        div("top-bar", SiteSurface::TopBar)
            .child(
                a_block("mark-link", "/", SiteSurface::MarkLink)
                    .aria_label("Kyle Tse, home")
                    .child(t("mark-name", NAME, SiteSurface::MarkName)),
            )
            .child(menu),
    )
}

fn footer() -> Component {
    let links = FOOT_LINKS
        .iter()
        .enumerate()
        .fold(nav_el("foot-links", SiteSurface::FootLinks).aria_label("Footer"), |nav, (i, (label, href))| {
            let link = a(format!("foot-{i}"), *label, href, SiteSurface::FootLink);
            nav.child(if href.starts_with("https://github.com") { link.rel("me") } else { link })
        });
    foot_el("foot", SiteSurface::Foot).child(
        div("foot-inner", SiteSurface::FootInner)
            .child(
                div("foot-row", SiteSurface::FootRow)
                    .child(
                        a_block("built", "/colophon", SiteSurface::Built)
                            .child(div("built-mark", SiteSurface::BuiltMark).aria_hidden(true).child(div("built-dot", SiteSurface::BuiltDot)))
                            .child(run("built-t", "Built with Keel Engine")),
                    )
                    .child(links),
            )
            .child(p(
                "foot-copy",
                "© 2026 Kyle Tse. Sylphx, Keel Engine and the apps named here are products of Sylphx Limited.",
                SiteSurface::FootCopy,
            )),
    )
}

fn shell(cx: &RouteCx, outlet: Component) -> Component {
    div("shell", SiteSurface::Shell)
        .child(a("skip", "Skip to content", "#main", SiteSurface::SkipLink))
        .child(header(cx))
        .child(main_el("main", SiteSurface::SiteMain).child(outlet))
        .child(footer())
}

fn head_for(title: &str, description: &str) -> Head {
    Head::new()
        .title(title)
        .description(description)
        .og_image(format!("{ORIGIN}/assets/og.png"), "Kyle Tse: I build the platform, the engine and the products on it.")
        .twitter_card("summary_large_image")
}

/// Kyle as a schema.org Person, with the profiles that are his.
fn person() -> serde_json::Value {
    serde_json::json!({
        "@context": "https://schema.org",
        "@type": "Person",
        "name": NAME,
        "url": ORIGIN,
        "jobTitle": "Founder",
        "worksFor": { "@type": "Organization", "name": "Sylphx", "url": "https://sylphx.com" },
        "sameAs": [content::GITHUB, content::LINKEDIN],
    })
}

pub fn site() -> Site {
    let root = Route::new("/")
        .hydrate(Hydration::Islands)
        .head(|cx| {
            head_for(TITLE, DESCRIPTION)
                .alternate_language("en", format!("{ORIGIN}{}", cx.path()))
                .title_template("%s · Kyle Tse")
                .site_name(NAME)
                .og_type("website")
                .link("icon", "/assets/favicon.ico")
                .link("icon", "/assets/mark.svg")
                .link("apple-touch-icon", "/assets/apple-touch-icon.png")
                .link("manifest", "/assets/site.webmanifest")
                .json_ld(JsonLd::website(NAME, ORIGIN))
                .json_ld(person())
        })
        .layout(shell)
        .page(|_| pages::home())
        .not_found(|_| pages::not_found())
        .child(
            Route::new("about")
                .head(|_| head_for("About", "Kyle Tse has been starting and building internet companies since 2006: Nakuz, MiniMax, Cubeage, Epiow and Sylphx."))
                .page(|_| pages::about()),
        )
        .child(
            Route::new("colophon")
                .head(|_| head_for("Colophon", "How kylet.se is built: Rust components rendered to static HTML by Keel Engine, a live Keel scene, and hosting on Sylphx. And what the site processes."))
                .page(|_| pages::colophon()),
        );
    // The previous site's pages land where the same content lives now, with
    // a permanent redirect.
    let root = [("story", "/about"), ("work", "/#work"), ("contact", "/#contact")]
        .into_iter()
        .fold(root, |root, (from, to)| root.child(Route::redirect(from, to)));
    Site::new(root)
        .expect("routes")
        .origin(ORIGIN)
        .lang("en")
        .theme(theme::theme())
        .theme_dark(theme::dark_theme())
        .stylesheet("/assets/site.css")
        .client(ClientBundle { module: "/_keel/client.js".into() })
        .island(islands::EMAIL)
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen::prelude::wasm_bindgen(start)]
pub fn start() {
    keel::web::hydrate(site()).expect("hydrate");
}
