//! The four pages: `/`, `/about`, `/colophon` and the not-found page.
//! Copy and sources: docs/design/content.md.

use keel::ui::{Component, list_item, ordered_list, paragraph};
use keel::web::{engine_view, EngineView};

use crate::content::{self, APPS, COMPANIES, ERAS, RECORD, TOOLS};
use crate::islands;
use crate::ui::*;

fn eyebrow(id: &str, label: &str) -> Component {
    div(id, SiteSurface::Eyebrow).child(deco(format!("{id}-dot"), "", SiteSurface::EyebrowDot)).child(run(format!("{id}-t"), label))
}

fn band_head(id: &str, kicker: &str, title: &str, lede: Option<&str>) -> Component {
    let mut head = div(format!("{id}-head"), SiteSurface::BandHead)
        .child(eyebrow(&format!("{id}-kicker"), kicker))
        .child(h(format!("{id}-title"), 2, title, SiteSurface::SectionTitle));
    if let Some(lede) = lede {
        head = head.child(p(format!("{id}-lede"), lede, SiteSurface::SectionLede));
    }
    head
}

/// A full-width band of the page with its content column.
fn band(id: &str, surface: SiteSurface, content: Component) -> Component {
    sect(id, surface).child(div(format!("{id}-wrap"), SiteSurface::Wrap).child(content))
}

/// An inset grouped list row: letter tile, title and meta, a line of text,
/// and a chevron.
fn row(id: &str, letter: &str, title: &str, meta: &str, text: &str, href: &str) -> Component {
    a_block(id, href, SiteSurface::Row)
        .child(deco(format!("{id}-tile"), letter, SiteSurface::Tile))
        .child(
            div(format!("{id}-text"), SiteSurface::RowText)
                .child(
                    div(format!("{id}-title"), SiteSurface::RowTitle)
                        .child(run(format!("{id}-name"), title))
                        .child(t(format!("{id}-meta"), meta, SiteSurface::RowMeta)),
                )
                .child(t(format!("{id}-sub"), text, SiteSurface::RowSub)),
        )
        .child(deco(format!("{id}-chev"), "›", SiteSurface::Chev))
}

/// A grouped list of rows.
fn group(id: &str, surface: GroupSurface, rows: Vec<Component>) -> Component {
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
            ..Default::default()
        },
    )
    // The engine view's own role, restyled by the site theme (keel#3911).
    .typed_surface(SiteSurface::EngineView);
    let stage = div("stage", SiteSurface::Stage).child(view).child(
        div("stage-bar", SiteSurface::StageBar)
            .backdrop_blur(14.0)
            .child(deco("stage-dot", "", SiteSurface::StageDot))
            .child(t("stage-text", "Rendered live in your browser by Keel Engine", SiteSurface::StageText).flex(1.0))
            .child(a("stage-how", "How it's built", "/colophon", SiteSurface::StageLink)),
    );
    sect("hero", SiteSurface::Hero).child(
        div("hero-wrap", SiteSurface::Wrap).child(
            div("hero-grid", SiteSurface::HeroGrid)
                .child(
                    div("hero-copy", SiteSurface::HeroCopy)
                        .child(eyebrow("hero-kicker", "Founder of Sylphx"))
                        .child(
                            div("hero-name", SiteSurface::HeroName)
                                .child(h("hero-title", 1, "Kyle Tse", SiteSurface::HeroTitle))
                                .child(deco("hero-dot", "", SiteSurface::NameDot)),
                        )
                        .child(p(
                            "hero-line",
                            "I've shipped consumer software to millions of people for twenty years. Now I'm building Sylphx, a software company that runs on AI agents.",
                            SiteSurface::Statement,
                        ))
                        .child(p(
                            "hero-lede",
                            "Sylphx makes one platform for hosting, data, auth and AI; Keel Engine, a Rust engine for games, apps and websites; and the apps and open-source tools that run on them.",
                            SiteSurface::Lede,
                        ))
                        .child(
                            div("hero-actions", SiteSurface::Actions)
                                .child(a("hero-work", "See the work", "#work", SiteSurface::ButtonPrimary))
                                .child(a("hero-contact", "Get in touch", "#contact", SiteSurface::ButtonSecondary)),
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
        let figures = r.figures.iter().enumerate().fold(keel::ui::list(format!("{id}-figures")).typed_surface(SiteSurface::Figures), |l, (j, (value, label))| {
            l.child(
                keel::ui::list_item(format!("{id}-fig-{j}"))
                    .typed_surface(SiteSurface::Figure)
                    .child(t(format!("{id}-fig-{j}-v"), *value, SiteSurface::FigureValue))
                    .child(t(format!("{id}-fig-{j}-l"), *label, SiteSurface::FigureLabel)),
            )
        });
        div(id.clone(), SiteSurface::Record)
            .child(
                div(format!("{id}-head"), SiteSurface::RecordHead)
                    .child(h(format!("{id}-name"), 3, r.company, SiteSurface::RecordName))
                    .child(t(format!("{id}-years"), r.years, SiteSurface::EraYear)),
            )
            .child(t(format!("{id}-what"), r.what, SiteSurface::RecordWhat))
            .child(figures)
    });
    band(
        "record",
        SiteSurface::Band,
        div("record-body", SiteSurface::SiteMain)
            .child(band_head("record", "Track record", "Twenty years of consumer software.", Some("The scale each company reached.")))
            .child(items.fold(div("records", SiteSurface::Records), |d, c| d.child(c))),
    )
}

struct Feature {
    id: &'static str,
    letter: &'static str,
    tile: SiteSurface,
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
        tile: SiteSurface::TileLg,
        name: "Sylphx",
        domain: "sylphx.com",
        url: "https://sylphx.com",
        text: "One platform for hosting, databases, auth, AI, workflows and sandboxes: one account, one API key, one SDK and one bill.",
        chips: &["Hosting", "Data", "Auth", "AI", "Workflows", "Sandboxes"],
    },
    Feature {
        id: "keel",
        letter: "K",
        tile: SiteSurface::TileKeel,
        name: "Keel Engine",
        domain: "keelengine.dev",
        url: "https://keelengine.dev",
        text: "One Rust engine for games, apps and websites. It renders natively on desktop, web, Android and iOS, and agents drive it from the command line. This site is built with it.",
        chips: &["Games", "Apps", "Websites", "iOS · Android · Web · Desktop"],
    },
];

fn feature(f: &Feature) -> Component {
    let id = f.id;
    let chips = f.chips.iter().enumerate().map(|(i, c)| t(format!("{id}-chip-{i}"), *c, SiteSurface::Chip));
    a_block(format!("{id}-card"), f.url, SiteSurface::Feature)
        .child(
            div(format!("{id}-top"), SiteSurface::FeatureTop)
                .child(deco(format!("{id}-tile"), f.letter, f.tile))
                .child(
                    div(format!("{id}-id"), SiteSurface::FeatureId)
                        .child(h(format!("{id}-name"), 3, f.name, SiteSurface::FeatureName))
                        .child(t(format!("{id}-domain"), f.domain, SiteSurface::Domain)),
                ),
        )
        .child(p(format!("{id}-text"), f.text, SiteSurface::FeatureText))
        .child(chips.fold(div(format!("{id}-chips"), SiteSurface::Chips), |d, c| d.child(c)).flex(1.0))
        .child(t(format!("{id}-go"), format!("Visit {}", f.domain), SiteSurface::Go))
}

fn building() -> Component {
    band(
        "work",
        SiteSurface::BandRuled,
        div("work-body", SiteSurface::SiteMain)
            .child(band_head("work", "Building now", "One platform, one engine.", Some("Everything we ship runs on these two. Both are built mostly in Rust.")))
            .child(FEATURES.iter().fold(div("features", SiteSurface::Features), |d, f| d.child(feature(f)))),
    )
}

fn apps() -> Component {
    let rows = |apps: &[content::App]| {
        apps.iter().map(|app| row(&format!("app-{}", app.name.to_lowercase()), app.letter, app.name, app.domain, app.text, app.url)).collect::<Vec<_>>()
    };
    band(
        "apps",
        SiteSurface::BandRuled,
        div("apps-body", SiteSurface::SiteMain)
            .child(band_head("apps", "Apps", "Products on the platform.", Some("Each app has its own name and site. Sylphx builds and publishes them.")))
            .child(
                div("apps-cols", SiteSurface::GroupCols)
                    .child(group("apps-a", GroupSurface::Standard, rows(&APPS[..3])))
                    .child(group("apps-b", GroupSurface::Standard, rows(&APPS[3..]))),
            ),
    )
}

fn open_source() -> Component {
    let cards = TOOLS.iter().enumerate().map(|(i, tool)| {
        let id = format!("tool-{i}");
        a_block(id.clone(), tool.url, SiteSurface::Tool)
            .child(h(format!("{id}-name"), 3, tool.name, SiteSurface::ToolName))
            .child(p(format!("{id}-text"), tool.text, SiteSurface::ToolText).flex(1.0))
            .child(
                div(format!("{id}-foot"), SiteSurface::ToolFoot)
                    .child(
                        div(format!("{id}-lang"), match tool.lang {
                            content::Lang::Rust => SiteSurface::LangRust,
                            content::Lang::Dart => SiteSurface::LangDart,
                            content::Lang::TypeScript => SiteSurface::LangTs,
                        })
                            .child(run(format!("{id}-dot"), "").aria_hidden(true))
                            .child(run(format!("{id}-lang-t"), tool.lang.name())),
                    )
                    .child(t(format!("{id}-repo"), tool.repo, SiteSurface::Repo)),
            )
    });
    band(
        "open-source",
        SiteSurface::BandRuled,
        div("oss-body", SiteSurface::SiteMain)
            .child(band_head("oss", "Open source", "Tools anyone can use.", Some("MIT-licensed, local-first, and built for people and AI agents alike.")))
            .child(cards.fold(div("tools", SiteSurface::Tools), |d, c| d.child(c))),
    )
}

fn companies() -> Component {
    let rows = COMPANIES
        .iter()
        .map(|c| row(&format!("co-{}", c.name.to_lowercase()), c.letter, c.name, c.meta, c.text, c.url))
        .collect();
    band(
        "companies",
        SiteSurface::BandRuled,
        div("companies-body", SiteSurface::SiteMain)
            .child(band_head("companies", "Companies", "Where the work happens.", None))
            .child(group("companies-list", GroupSurface::Narrow, rows))
            .child(div("companies-more", SiteSurface::More).child(a("companies-story", "The full story since 2006", "/about", SiteSurface::GoLink))),
    )
}

fn contact() -> Component {
    band(
        "contact",
        SiteSurface::BandRuled,
        div("contact-card", SiteSurface::Contact)
            .child(
                div("contact-copy", SiteSurface::ContactCopy)
                    .child(h("contact-title", 2, "Get in touch.", SiteSurface::ContactTitle))
                    .child(p(
                        "contact-text",
                        "Building something on Sylphx or Keel, or want to work together? Email is the fastest way to reach me.",
                        SiteSurface::ContactText,
                    )),
            )
            .child(
                div("contact-side", SiteSurface::ContactSide)
                    .child(islands::email())
                    .child(
                        nav_el("elsewhere", SiteSurface::Elsewhere)
                            .aria_label("Elsewhere")
                            .child(a("elsewhere-github", "GitHub", content::GITHUB, SiteSurface::ElsewhereLink).rel("me"))
                            .child(a("elsewhere-linkedin", "LinkedIn", content::LINKEDIN, SiteSurface::ElsewhereLink).rel("me")),
                    ),
            ),
    )
}

pub fn home() -> Component {
    div("home", SiteSurface::SiteMain)
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
    div(format!("{id}-head"), SiteSurface::PageHead)
        .child(eyebrow(&format!("{id}-kicker"), kicker))
        .child(h(format!("{id}-title"), 1, title, SiteSurface::HeroTitle))
        .child(div(format!("{id}-prose"), SiteSurface::Prose).child(lede))
}

/// A paragraph of plain runs, bold runs and links: `("text", None)` is plain,
/// `("text", Some("strong"))` is bold, `("label", Some(url))` a link.
fn rich(id: &str, surface: SiteSurface, parts: &[(&str, Option<&str>)]) -> Component {
    let children = parts
        .iter()
        .enumerate()
        .map(|(i, (text, kind))| match kind {
            None => run(format!("{id}-{i}"), *text),
            Some("strong") => t(format!("{id}-{i}"), *text, SiteSurface::Strong),
            // The engine's own link in running text: the theme's link colour, underlined.
            Some(href) => keel::ui::link(format!("{id}-{i}"), *text, *href),
        })
        .collect();
    paragraph(id.to_string(), children).typed_surface(surface)
}

fn era(i: usize, e: &content::Era) -> Component {
    let id = format!("era-{i}");
    let mut name = div(format!("{id}-name-row"), SiteSurface::EraNameRow).child(h(format!("{id}-name"), 2, e.name, SiteSurface::EraName));
    if e.now {
        name = name.child(t(format!("{id}-now"), "Now", SiteSurface::Status));
    }
    // The space goes with the text, so a wrapped link starts its line flush.
    let lead = format!("{} ", e.text);
    let mut body = vec![(if e.site.is_some() { lead.as_str() } else { e.text }, None)];
    if let Some((label, url)) = e.site {
        body.push((label, Some(url)));
    }
    list_item(id.clone()).typed_surface(SiteSurface::Era)
        .child(t(format!("{id}-years"), e.years, SiteSurface::EraYear))
        .child(
            e.record
                .iter()
                .fold(div(format!("{id}-head"), SiteSurface::EraHead).child(name).child(t(format!("{id}-role"), e.role, SiteSurface::EraRole)), |d, r| {
                    d.child(t(format!("{id}-record"), *r, SiteSurface::EraRecord))
                }),
        )
        .child(rich(&format!("{id}-body"), SiteSurface::EraBody, &body))
}

pub fn about() -> Component {
    let timeline = ERAS.iter().enumerate().fold(ordered_list("timeline".to_string(), 1).typed_surface(SiteSurface::Timeline), |l, (i, e)| l.child(era(i, e)));
    let elsewhere = vec![
        row("else-email", "@", "Email", content::EMAIL, "The fastest way to reach me.", &format!("mailto:{}", content::EMAIL)),
        row("else-github", "G", "GitHub", "shtse8", "Personal projects, and the SylphxAI, Cubeage and EpiowAI organisations.", content::GITHUB).rel("me"),
        row("else-linkedin", "in", "LinkedIn", "shtse8", "Career history.", content::LINKEDIN).rel("me"),
    ];
    div("about", SiteSurface::Wrap)
        .child(page_head(
            "about",
            "About",
            "Twenty years of starting things.",
            p(
                "about-lede",
                "I'm Kyle Tse. I have been starting and building internet companies since 2006: a gaming community in Hong Kong, then social and mobile games, and now Sylphx.",
                SiteSurface::Lede,
            ),
        ))
        .child(sect("timeline-band", SiteSurface::BandTight).aria_label("Timeline").child(timeline))
        .child(
            sect("how", SiteSurface::BandRuled)
                .aria_label("How we build")
                .child(band_head("how", "How we build", "Rust, on our own platform.", None))
                .child(
                    div("how-prose", SiteSurface::Prose)
                        .child(rich("how-1", SiteSurface::ProseP, &[("Most of our code is ", None), ("Rust", Some("strong")), (": the Sylphx platform, Keel Engine and the open-source tools.", None)]))
                        .child(rich("how-2", SiteSurface::ProseP, &[("Every product runs on ", None), ("Sylphx", Some("strong")), (" itself, so the platform gets used every day by the people who build it.", None)]))
                        .child(rich(
                            "how-3",
                            SiteSurface::ProseP,
                            &[("Keel Engine is ", None), ("proprietary", Some("strong")), (" and licensed to teams by agreement. The developer tools are ", None), ("open source", Some("strong")), (" under the MIT licence.", None)],
                        )),
                ),
        )
        .child(
            sect("elsewhere-band", SiteSurface::BandRuled)
                .aria_label("Elsewhere")
                .child(band_head("else", "Elsewhere", "Find me online.", None))
                .child(group("else-list", GroupSurface::Narrow, elsewhere)),
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
    let facts = FACTS.iter().enumerate().fold(div("facts", SiteSurface::Facts), |d, (i, (title, text))| {
        d.child(
            div(format!("fact-{i}"), SiteSurface::Fact)
                .child(h(format!("fact-{i}-title"), 2, *title, SiteSurface::FactTitle))
                .child(p(format!("fact-{i}-text"), *text, SiteSurface::FactText)),
        )
    });
    div("colophon", SiteSurface::Wrap)
        .child(page_head(
            "colophon",
            "Colophon",
            "How this site is built.",
            rich(
                "colophon-lede",
                SiteSurface::Lede,
                &[
                    ("kylet.se is built with Keel Engine, the Rust engine we make at Sylphx. So is ", None),
                    ("keelengine.dev", Some("https://keelengine.dev")),
                    (", the engine's own site.", None),
                ],
            ),
        ))
        .child(div("name-note", SiteSurface::NameNote).child(p(
            "name-note-text",
            "About the name: say kylet.se out loud and you get Kyle Tse. The .se is Sweden's domain, chosen for the way it reads.",
            SiteSurface::NameNoteText,
        )))
        .child(sect("made", SiteSurface::BandTight).aria_label("How it's made").child(facts))
        .child(
            sect("privacy", SiteSurface::BandRuled)
                .child(band_head("privacy", "Privacy", "No cookies, no tracking.", None))
                .child(
                    div("privacy-prose", SiteSurface::Prose)
                        .child(p(
                            "privacy-1",
                            "This site sets no cookies and runs no analytics, forms or tracking. If you email me, the message goes from your mail app to my inbox and nowhere else.",
                            SiteSurface::ProseP,
                        ))
                        .child(p(
                            "privacy-2",
                            "Like any website, the servers that deliver it (Sylphx Hosting, with Cloudflare in front) process technical request data, such as your IP address, browser details and the pages you request, to deliver the site and protect it from abuse.",
                            SiteSurface::ProseP,
                        ))
                        .child(rich(
                            "privacy-3",
                            SiteSurface::ProseP,
                            &[("The source is public at ", None), ("github.com/shtse8/portfolio-website", Some(content::SOURCE)), (".", None)],
                        )),
                ),
        )
}

// ---------------------------------------------------------------- 404

pub fn not_found() -> Component {
    div("nf-wrap", SiteSurface::Wrap).child(
        div("nf", SiteSurface::Nf)
            .child(t("nf-code", "404", SiteSurface::NfCode))
            .child(h("nf-title", 1, "This page isn't here.", SiteSurface::HeroTitle))
            .child(p("nf-lede", "It may have moved when the site was rebuilt. Everything is on the home page or the about page.", SiteSurface::Lede))
            .child(
                div("nf-actions", SiteSurface::Actions)
                    .child(a("nf-home", "Go home", "/", SiteSurface::ButtonPrimary))
                    .child(a("nf-about", "About", "/about", SiteSurface::ButtonSecondary)),
            ),
    )
}
