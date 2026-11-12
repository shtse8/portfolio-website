//! The four pages: `/`, `/about`, `/colophon` and the not-found page.
//! Copy and sources: docs/design/content.md.

use keel_ui::{ordered_list, list_item, paragraph, Component};
use keel_web::{engine_view, EngineView};

use crate::content::{self, APPS, COMPANIES, ERAS, RECORD, TOOLS};
use crate::islands;
use crate::ui::*;

fn eyebrow(id: &str, label: &str) -> Component {
    div(id, "eyebrow").child(deco(format!("{id}-dot"), "", "eyebrow-dot")).child(run(format!("{id}-t"), label))
}

fn band_head(id: &str, kicker: &str, title: &str, lede: Option<&str>) -> Component {
    let mut head = div(format!("{id}-head"), "band-head")
        .child(eyebrow(&format!("{id}-kicker"), kicker))
        .child(h(format!("{id}-title"), 2, title, "section-title"));
    if let Some(lede) = lede {
        head = head.child(p(format!("{id}-lede"), lede, "section-lede"));
    }
    head
}

/// A full-width band of the page with its content column.
fn band(id: &str, surface: &str, content: Component) -> Component {
    sect(id, surface).child(div(format!("{id}-wrap"), "wrap").child(content))
}

/// An inset grouped list row: letter tile, title and meta, a line of text,
/// and a chevron.
fn row(id: &str, letter: &str, title: &str, meta: &str, text: &str, href: &str) -> Component {
    a_block(id, href, "row")
        .child(deco(format!("{id}-tile"), letter, "tile"))
        .child(
            div(format!("{id}-text"), "row-text")
                .child(
                    div(format!("{id}-title"), "row-title")
                        .child(run(format!("{id}-name"), title))
                        .child(t(format!("{id}-meta"), meta, "row-meta")),
                )
                .child(t(format!("{id}-sub"), text, "row-sub")),
        )
        .child(deco(format!("{id}-chev"), "›", "chev"))
}

/// A grouped list of rows.
fn group(id: &str, surface: &str, rows: Vec<Component>) -> Component {
    ul(id, surface, rows)
}

// ---------------------------------------------------------------- home

fn hero() -> Component {
    let view = engine_view(
        "hero-scene",
        &EngineView {
            scene: "hero".into(),
            poster: "/assets/scenes/hero.webp".into(),
            alt: "Glowing metal shapes orbiting a core, rendered by Keel Engine".into(),
            ratio: 4.0 / 3.0,
            priority: true,
        },
    )
    // The engine view's own role, restyled by the site theme (keel#3911).
    .surface("engine-view");
    let stage = div("stage", "stage").child(view).child(
        div("stage-bar", "stage-bar")
            .backdrop_blur(14.0)
            .child(deco("stage-dot", "", "stage-dot"))
            .child(t("stage-text", "Rendered live in your browser by Keel Engine", "stage-text").flex(1.0))
            .child(a("stage-how", "How it's built", "/colophon", "stage-link")),
    );
    sect("hero", "hero").child(
        div("hero-wrap", "wrap").child(
            div("hero-grid", "hero-grid")
                .child(
                    div("hero-copy", "hero-copy")
                        .child(eyebrow("hero-kicker", "Founder of Sylphx"))
                        .child(
                            div("hero-name", "hero-name")
                                .child(h("hero-title", 1, "Kyle Tse", "hero-title"))
                                .child(deco("hero-dot", "", "name-dot")),
                        )
                        .child(p(
                            "hero-line",
                            "I've shipped consumer software to millions of people for twenty years. Now I'm building Sylphx, a software company that runs on AI agents.",
                            "statement",
                        ))
                        .child(p(
                            "hero-lede",
                            "Sylphx makes one platform for hosting, data, auth and AI; Keel Engine, a Rust engine for games, apps and websites; and the apps and open-source tools that run on them.",
                            "lede",
                        ))
                        .child(
                            div("hero-actions", "actions")
                                .child(a("hero-work", "See the work", "#work", "button-primary"))
                                .child(a("hero-contact", "Get in touch", "#contact", "button-secondary")),
                        ),
                )
                .child(stage),
        ),
    )
}

/// Each company's scale beside its name: quiet type, no counters.
fn track_record() -> Component {
    let items = RECORD.iter().enumerate().map(|(i, r)| {
        let id = format!("record-{i}");
        let figures = r.figures.iter().enumerate().fold(ul(format!("{id}-figures"), "figures", vec![]), |l, (j, (value, label))| {
            l.child(
                keel_ui::list_item(format!("{id}-fig-{j}"))
                    .surface("figure")
                    .child(t(format!("{id}-fig-{j}-v"), *value, "figure-value"))
                    .child(t(format!("{id}-fig-{j}-l"), *label, "figure-label")),
            )
        });
        div(id.clone(), "record")
            .child(
                div(format!("{id}-head"), "record-head")
                    .child(h(format!("{id}-name"), 3, r.company, "record-name"))
                    .child(t(format!("{id}-years"), r.years, "era-year")),
            )
            .child(t(format!("{id}-what"), r.what, "record-what"))
            .child(figures)
    });
    band(
        "record",
        "band",
        div("record-body", "site-main")
            .child(band_head("record", "Track record", "Twenty years of consumer software.", Some("The scale each company reached.")))
            .child(items.fold(div("records", "records"), |d, c| d.child(c))),
    )
}

struct Feature {
    id: &'static str,
    letter: &'static str,
    tile: &'static str,
    name: &'static str,
    domain: &'static str,
    url: &'static str,
    text: &'static str,
    chips: &'static [&'static str],
}

const FEATURES: [Feature; 2] = [
    Feature {
        id: "sylphx",
        letter: "S",
        tile: "tile-lg",
        name: "Sylphx",
        domain: "sylphx.com",
        url: "https://sylphx.com",
        text: "One platform for hosting, databases, auth, AI, workflows and sandboxes: one account, one API key, one SDK and one bill.",
        chips: &["Hosting", "Data", "Auth", "AI", "Workflows", "Sandboxes"],
    },
    Feature {
        id: "keel",
        letter: "K",
        tile: "tile-keel",
        name: "Keel Engine",
        domain: "keelengine.dev",
        url: "https://keelengine.dev",
        text: "One Rust engine for games, apps and websites. It renders natively on desktop, web, Android and iOS, and agents drive it from the command line. This site is built with it.",
        chips: &["Games", "Apps", "Websites", "iOS · Android · Web · Desktop"],
    },
];

fn feature(f: &Feature) -> Component {
    let id = f.id;
    let chips = f.chips.iter().enumerate().map(|(i, c)| t(format!("{id}-chip-{i}"), *c, "chip"));
    a_block(format!("{id}-card"), f.url, "feature")
        .child(
            div(format!("{id}-top"), "feature-top")
                .child(deco(format!("{id}-tile"), f.letter, f.tile))
                .child(
                    div(format!("{id}-id"), "feature-id")
                        .child(h(format!("{id}-name"), 3, f.name, "feature-name"))
                        .child(t(format!("{id}-domain"), f.domain, "domain")),
                ),
        )
        .child(p(format!("{id}-text"), f.text, "feature-text"))
        .child(chips.fold(div(format!("{id}-chips"), "chips"), |d, c| d.child(c)).flex(1.0))
        .child(t(format!("{id}-go"), format!("Visit {}", f.domain), "go"))
}

fn building() -> Component {
    band(
        "work",
        "band-ruled",
        div("work-body", "site-main")
            .child(band_head("work", "Building now", "One platform, one engine.", Some("Everything we ship runs on these two. Both are built mostly in Rust.")))
            .child(FEATURES.iter().fold(div("features", "features"), |d, f| d.child(feature(f)))),
    )
}

fn apps() -> Component {
    let rows = |apps: &[content::App]| {
        apps.iter().map(|app| row(&format!("app-{}", app.name.to_lowercase()), app.letter, app.name, app.domain, app.text, app.url)).collect::<Vec<_>>()
    };
    band(
        "apps",
        "band-ruled",
        div("apps-body", "site-main")
            .child(band_head("apps", "Apps", "Products on the platform.", Some("Each app has its own name and site. Sylphx builds and publishes them.")))
            .child(
                div("apps-cols", "group-cols")
                    .child(group("apps-a", "group", rows(&APPS[..3])))
                    .child(group("apps-b", "group", rows(&APPS[3..]))),
            ),
    )
}

fn open_source() -> Component {
    let cards = TOOLS.iter().enumerate().map(|(i, tool)| {
        let id = format!("tool-{i}");
        a_block(id.clone(), tool.url, "tool")
            .child(h(format!("{id}-name"), 3, tool.name, "tool-name"))
            .child(p(format!("{id}-text"), tool.text, "tool-text").flex(1.0))
            .child(
                div(format!("{id}-foot"), "tool-foot")
                    .child(
                        div(format!("{id}-lang"), tool.lang.surface())
                            .child(deco(format!("{id}-dot"), "", "lang-dot"))
                            .child(run(format!("{id}-lang-t"), tool.lang.name())),
                    )
                    .child(t(format!("{id}-repo"), tool.repo, "repo")),
            )
    });
    band(
        "open-source",
        "band-ruled",
        div("oss-body", "site-main")
            .child(band_head("oss", "Open source", "Tools anyone can use.", Some("MIT-licensed, local-first, and built for people and AI agents alike.")))
            .child(cards.fold(div("tools", "tools"), |d, c| d.child(c))),
    )
}

fn companies() -> Component {
    let rows = COMPANIES
        .iter()
        .map(|c| row(&format!("co-{}", c.name.to_lowercase()), c.letter, c.name, c.meta, c.text, c.url))
        .collect();
    band(
        "companies",
        "band-ruled",
        div("companies-body", "site-main")
            .child(band_head("companies", "Companies", "Where the work happens.", None))
            .child(group("companies-list", "group-narrow", rows))
            .child(div("companies-more", "more").child(a("companies-story", "The full story since 2006", "/about", "go-link"))),
    )
}

fn contact() -> Component {
    band(
        "contact",
        "band-ruled",
        div("contact-card", "contact")
            .child(
                div("contact-copy", "contact-copy")
                    .child(h("contact-title", 2, "Get in touch.", "contact-title"))
                    .child(p(
                        "contact-text",
                        "Building something on Sylphx or Keel, or want to work together? Email is the fastest way to reach me.",
                        "contact-text",
                    )),
            )
            .child(
                div("contact-side", "contact-side")
                    .child(islands::email())
                    .child(
                        nav_el("elsewhere", "elsewhere")
                            .aria_label("Elsewhere")
                            .child(a("elsewhere-github", "GitHub", content::GITHUB, "elsewhere-link").rel("me"))
                            .child(a("elsewhere-linkedin", "LinkedIn", content::LINKEDIN, "elsewhere-link").rel("me")),
                    ),
            ),
    )
}

pub fn home() -> Component {
    div("home", "site-main")
        .child(hero())
        .child(track_record())
        .child(building())
        .child(apps())
        .child(open_source())
        .child(companies())
        .child(contact())
}

// ---------------------------------------------------------------- about

fn page_head(id: &str, kicker: &str, title: &str, lede: Component) -> Component {
    div(format!("{id}-head"), "page-head")
        .child(eyebrow(&format!("{id}-kicker"), kicker))
        .child(h(format!("{id}-title"), 1, title, "hero-title"))
        .child(div(format!("{id}-prose"), "prose").child(lede))
}

/// A paragraph of plain runs, bold runs and links: `("text", None)` is plain,
/// `("text", Some("strong"))` is bold, `("label", Some(url))` a link.
fn rich(id: &str, surface: &str, parts: &[(&str, Option<&str>)]) -> Component {
    let children = parts
        .iter()
        .enumerate()
        .map(|(i, (text, kind))| match kind {
            None => run(format!("{id}-{i}"), *text),
            Some("strong") => t(format!("{id}-{i}"), *text, "strong"),
            // The engine's own link in running text: the theme's link colour, underlined.
            Some(href) => keel_ui::link(format!("{id}-{i}"), *text, *href),
        })
        .collect();
    paragraph(id.to_string(), children).surface(surface)
}

fn era(i: usize, e: &content::Era) -> Component {
    let id = format!("era-{i}");
    let mut name = div(format!("{id}-name-row"), "era-name-row").child(h(format!("{id}-name"), 2, e.name, "era-name"));
    if e.now {
        name = name.child(t(format!("{id}-now"), "Now", "status"));
    }
    // The space goes with the text, so a wrapped link starts its line flush.
    let lead = format!("{} ", e.text);
    let mut body = vec![(if e.site.is_some() { lead.as_str() } else { e.text }, None)];
    if let Some((label, url)) = e.site {
        body.push((label, Some(url)));
    }
    list_item(id.clone()).surface("era")
        .child(t(format!("{id}-years"), e.years, "era-year"))
        .child(
            e.record
                .iter()
                .fold(div(format!("{id}-head"), "era-head").child(name).child(t(format!("{id}-role"), e.role, "era-role")), |d, r| {
                    d.child(t(format!("{id}-record"), *r, "era-record"))
                }),
        )
        .child(rich(&format!("{id}-body"), "era-body", &body))
}

pub fn about() -> Component {
    let timeline = ERAS.iter().enumerate().fold(ordered_list("timeline".to_string(), 1).surface("timeline"), |l, (i, e)| l.child(era(i, e)));
    let elsewhere = vec![
        row("else-email", "@", "Email", content::EMAIL, "The fastest way to reach me.", &format!("mailto:{}", content::EMAIL)),
        row("else-github", "G", "GitHub", "shtse8", "Personal projects, and the SylphxAI, Cubeage and EpiowAI organisations.", content::GITHUB).rel("me"),
        row("else-linkedin", "in", "LinkedIn", "shtse8", "Career history.", content::LINKEDIN).rel("me"),
    ];
    div("about", "wrap")
        .child(page_head(
            "about",
            "About",
            "Twenty years of starting things.",
            p(
                "about-lede",
                "I'm Kyle Tse. I have been starting and building internet companies since 2006: a gaming community in Hong Kong, then social and mobile games, and now Sylphx.",
                "lede",
            ),
        ))
        .child(sect("timeline-band", "band-tight").aria_label("Timeline").child(timeline))
        .child(
            sect("how", "band-ruled")
                .aria_label("How we build")
                .child(band_head("how", "How we build", "Rust, on our own platform.", None))
                .child(
                    div("how-prose", "prose")
                        .child(rich("how-1", "prose-p", &[("Most of our code is ", None), ("Rust", Some("strong")), (": the Sylphx platform, Keel Engine and the open-source tools.", None)]))
                        .child(rich("how-2", "prose-p", &[("Every product runs on ", None), ("Sylphx", Some("strong")), (" itself, so the platform gets used every day by the people who build it.", None)]))
                        .child(rich(
                            "how-3",
                            "prose-p",
                            &[("Keel Engine is ", None), ("proprietary", Some("strong")), (" and licensed to teams by agreement. The developer tools are ", None), ("open source", Some("strong")), (" under the MIT licence.", None)],
                        )),
                ),
        )
        .child(
            sect("elsewhere-band", "band-ruled")
                .aria_label("Elsewhere")
                .child(band_head("else", "Elsewhere", "Find me online.", None))
                .child(group("else-list", "group-narrow", elsewhere)),
        )
}

// ---------------------------------------------------------------- colophon

const FACTS: [(&str, &str); 4] = [
    ("Built with Keel Engine", "Every page is a tree of Rust components that Keel renders to plain HTML ahead of time. Search engines and screen readers get real HTML, and the page works before any script runs."),
    ("A live scene, not a video", "The scene on the home page is Keel rendering in your browser, through WebGPU or WebGL2. It shows a still image until you interact with the page, and stays still if your device asks for reduced motion."),
    ("Hosted on Sylphx", "The site is a set of static files served by Sylphx Hosting, the same platform our products run on."),
    ("Type and colour", "System fonts: San Francisco on Apple devices, Segoe UI on Windows and Roboto on Android. Light and dark follow your device."),
];

pub fn colophon() -> Component {
    let facts = FACTS.iter().enumerate().fold(div("facts", "facts"), |d, (i, (title, text))| {
        d.child(
            div(format!("fact-{i}"), "fact")
                .child(h(format!("fact-{i}-title"), 2, *title, "fact-title"))
                .child(p(format!("fact-{i}-text"), *text, "fact-text")),
        )
    });
    div("colophon", "wrap")
        .child(page_head(
            "colophon",
            "Colophon",
            "How this site is built.",
            rich(
                "colophon-lede",
                "lede",
                &[
                    ("kylet.se is built with Keel Engine, the Rust engine we make at Sylphx. So is ", None),
                    ("keelengine.dev", Some("https://keelengine.dev")),
                    (", the engine's own site.", None),
                ],
            ),
        ))
        .child(div("name-note", "name-note").child(p(
            "name-note-text",
            "About the name: say kylet.se out loud and you get Kyle Tse. The .se is Sweden's domain, chosen for the way it reads.",
            "name-note-text",
        )))
        .child(sect("made", "band-tight").aria_label("How it's made").child(facts))
        .child(
            sect("privacy", "band-ruled")
                .child(band_head("privacy", "Privacy", "No cookies, no tracking.", None))
                .child(
                    div("privacy-prose", "prose")
                        .child(p(
                            "privacy-1",
                            "This site sets no cookies and runs no analytics, forms or tracking. If you email me, the message goes from your mail app to my inbox and nowhere else.",
                            "prose-p",
                        ))
                        .child(p(
                            "privacy-2",
                            "Like any website, the servers that deliver it (Sylphx Hosting, with Cloudflare in front) process technical request data, such as your IP address, browser details and the pages you request, to deliver the site and protect it from abuse.",
                            "prose-p",
                        ))
                        .child(rich(
                            "privacy-3",
                            "prose-p",
                            &[("The source is public at ", None), ("github.com/shtse8/portfolio-website", Some(content::SOURCE)), (".", None)],
                        )),
                ),
        )
}

// ---------------------------------------------------------------- 404

pub fn not_found() -> Component {
    div("nf-wrap", "wrap").child(
        div("nf", "nf")
            .child(t("nf-code", "404", "nf-code"))
            .child(h("nf-title", 1, "This page isn't here.", "hero-title"))
            .child(p("nf-lede", "It may have moved when the site was rebuilt. Everything is on the home page or the about page.", "lede"))
            .child(
                div("nf-actions", "actions")
                    .child(a("nf-home", "Go home", "/", "button-primary"))
                    .child(a("nf-about", "About", "/about", "button-secondary")),
            ),
    )
}
