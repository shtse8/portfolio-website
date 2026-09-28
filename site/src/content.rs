//! Every fact the site shows, in one place. Each list is sourced in
//! `docs/design/content.md`; nothing here is shown without a source there.

/// An app Sylphx publishes: its letter tile, name, domain, URL and the
/// one-liner from its own site's meta description.
pub struct App {
    pub letter: &'static str,
    pub name: &'static str,
    pub domain: &'static str,
    pub url: &'static str,
    pub text: &'static str,
}

pub const APPS: [App; 6] = [
    App { letter: "S", name: "Spiron", domain: "spiron.ai", url: "https://spiron.ai", text: "An always-on AI agent for your life, family, school or work. Give it an objective and it works on its own, asking when a decision is yours." },
    App { letter: "K", name: "Kalkas", domain: "kalkas.ai", url: "https://kalkas.ai", text: "Turns any source into calibrated forecasts, commits each one before the event, and scores it in public." },
    App { letter: "P", name: "Puzzled", domain: "puzzled.gg", url: "https://puzzled.gg", text: "A daily brain game: word, logic, number and spatial puzzles. One free puzzle every day, no account needed." },
    App { letter: "V", name: "Viszy", domain: "viszy.ai", url: "https://viszy.ai", text: "Product photos and short promo videos for online sellers, made from one photo of the product." },
    App { letter: "L", name: "Luzzy", domain: "luzzy.chat", url: "https://luzzy.chat", text: "Practise real conversations with an AI partner, then get feedback that quotes what you said." },
    App { letter: "T", name: "Tryit", domain: "tryit.fun", url: "https://tryit.fun", text: "One-minute plays: a daily puzzle, quick quizzes and games, and free tries of our apps." },
];

/// The main language of an open-source project, as GitHub reports it.
#[derive(Clone, Copy)]
pub enum Lang {
    Rust,
    Dart,
    TypeScript,
}

impl Lang {
    pub fn name(self) -> &'static str {
        match self {
            Lang::Rust => "Rust",
            Lang::Dart => "Dart",
            Lang::TypeScript => "TypeScript",
        }
    }

    /// The surface whose dot carries GitHub's colour for the language.
    pub fn surface(self) -> &'static str {
        match self {
            Lang::Rust => "lang-rust",
            Lang::Dart => "lang-dart",
            Lang::TypeScript => "lang-ts",
        }
    }
}

/// An open-source project: GitHub repository description, MIT licence.
pub struct Tool {
    pub name: &'static str,
    pub repo: &'static str,
    pub url: &'static str,
    pub text: &'static str,
    pub lang: Lang,
}

pub const TOOLS: [Tool; 6] = [
    Tool { name: "anymd", repo: "SylphxAI/anymd", url: "https://sylphxai.github.io/anymd/", text: "Any file to clean Markdown for AI agents: PDF, Office, EPUB, web pages, images and video. A Rust MCP server and CLI that runs on your machine.", lang: Lang::Rust },
    Tool { name: "repomap", repo: "SylphxAI/repomap", url: "https://sylphxai.github.io/repomap/", text: "A map of your codebase for AI agents: code graph, search, call paths and change impact, with a graph view.", lang: Lang::Rust },
    Tool { name: "lockdocs", repo: "SylphxAI/lockdocs", url: "https://sylphxai.github.io/lockdocs/", text: "Library docs at the exact versions in your lockfile. Local, offline, no rate limits.", lang: Lang::Rust },
    Tool { name: "Firestore ODM", repo: "SylphxAI/firestore_odm", url: "https://sylphxai.github.io/firestore_odm/", text: "Type-safe Firestore ODM for Flutter and Dart, the maintained successor to cloud_firestore_odm.", lang: Lang::Dart },
    Tool { name: "Mark", repo: "SylphxAI/readme-mark", url: "https://mark.sylphx.com", text: "README images from one URL: banners, badges and GitHub stats cards. Free, with no token or sign-up.", lang: Lang::Rust },
    Tool { name: "Google Photos Delete Tool", repo: "shtse8/Google-Photos-Delete-Tool", url: "https://github.com/shtse8/Google-Photos-Delete-Tool", text: "Find duplicate photos and bulk-delete safely, with a dry run first. A Chrome extension and userscript.", lang: Lang::TypeScript },
];

/// A company and Kyle's role there.
pub struct Company {
    pub letter: &'static str,
    pub name: &'static str,
    pub meta: &'static str,
    pub url: &'static str,
    pub text: &'static str,
}

pub const COMPANIES: [Company; 3] = [
    Company { letter: "S", name: "Sylphx", meta: "United Kingdom · Founder", url: "https://sylphx.com", text: "Builds the Sylphx platform and Keel Engine, and publishes the apps above." },
    Company { letter: "E", name: "Epiow", meta: "United Kingdom · Co-founder & CTO", url: "https://epiow.com", text: "Business software for organisations: HR, payroll, leave, projects and records in one workspace." },
    Company { letter: "C", name: "Cubeage", meta: "Hong Kong · Founder & CEO", url: "https://cubeage.com", text: "Mobile board and card games: Hong Kong mahjong, Big Two, Taiwanese mahjong and more." },
];

/// One company in the timeline on /about.
pub struct Era {
    pub years: &'static str,
    pub name: &'static str,
    pub role: &'static str,
    pub text: &'static str,
    /// The company's site, when it still has one.
    pub site: Option<(&'static str, &'static str)>,
    pub now: bool,
    /// The company's scale, confirmed by Kyle on 2026-09-28.
    pub record: Option<&'static str>,
}

pub const ERAS: [Era; 5] = [
    Era { years: "2025–", name: "Sylphx", role: "Founder", text: "Sylphx, one platform for hosting, data, auth and AI, and Keel Engine, a Rust engine for games, apps and websites. Sylphx also publishes Spiron, Kalkas, Puzzled, Viszy, Luzzy and Tryit.", site: Some(("sylphx.com", "https://sylphx.com")), now: true, record: None },
    Era { years: "2025–", name: "Epiow", role: "Co-founder & CTO", text: "Business software for organisations: one workspace for HR, payroll, leave, projects and records.", site: Some(("epiow.com", "https://epiow.com")), now: true, record: None },
    Era { years: "2014–", name: "Cubeage", role: "Founder & CEO", text: "Mobile board and card games for players in Hong Kong and Taiwan. The games are moving to Keel Engine.", site: Some(("cubeage.com", "https://cubeage.com")), now: true, record: Some("10M+ downloads") },
    Era { years: "2010–2016", name: "MiniMax Game Entertainment", role: "Co-founder & CEO", text: "Social games on Facebook, with teams in Hong Kong, Taiwan and mainland China. Also traded as Funimax.", site: None, now: false, record: Some("10M+ monthly active users · 30+ games") },
    Era { years: "2006", name: "Nakuz", role: "Co-founder & CTO", text: "A Hong Kong gaming community and news site, where it all started.", site: None, now: false, record: Some("500K+ users · 3K+ online at once · 100+ partners") },
];

/// The track record on the home page: each company's scale beside its name,
/// confirmed by Kyle on 2026-09-28.
pub struct Record {
    pub company: &'static str,
    pub years: &'static str,
    pub what: &'static str,
    pub figures: &'static [(&'static str, &'static str)],
}

pub const RECORD: [Record; 3] = [
    Record { company: "Cubeage", years: "2014–", what: "Mobile board and card games", figures: &[("10M+", "downloads")] },
    Record { company: "MiniMax", years: "2010–2016", what: "Social games on Facebook", figures: &[("10M+", "monthly active users"), ("30+", "games")] },
    Record { company: "Nakuz", years: "2006", what: "Gaming community and news site", figures: &[("500K+", "users"), ("3K+", "online at once"), ("100+", "partners")] },
];

pub const EMAIL: &str = "hi@kylet.se";
pub const GITHUB: &str = "https://github.com/shtse8";
pub const LINKEDIN: &str = "https://www.linkedin.com/in/shtse8";
pub const SOURCE: &str = "https://github.com/shtse8/portfolio-website";
