//! The site's theme: every design token (docs/design/tokens.json) and the
//! style of every surface, for the light and the dark palette.
//!
//! keel-web exports the theme as custom properties, `html`/`body` rules and
//! one class rule per surface. The page is drawn with the light theme; the
//! dark theme is the same surfaces on the dark palette, written by Keel's
//! own emitter into `assets/dark.css` under `prefers-color-scheme: dark`
//! (see [`dark_stylesheet`]) until Keel emits a scheme pair itself.
//! `assets/site.css` holds only what `SurfaceStyle` cannot say yet, each part
//! marked with the Keel issue that replaces it.

use keel_math::Srgba;
use keel_ui::{
    Axis, BoxSize, CrossAxisAlignment, DocumentStyle, Ease, EaseRole, EdgeInsets, ElevationLevel,
    FluidSize, FontSmoothing, FontWeight, GridPlacement, GridSpan, GridSpec, Length,
    ListMarker, MainAxisAlignment, Margin, MotionRole, Overflow, Position, SelectionColors, Sides,
    SurfaceLayout, SurfaceStyle, SurfaceText, TextProperties, TextRendering, TextWrap, Theme,
    ThemeToken, TrackSize, TypeRole, TypeStyle, WhiteSpace, WidthClass, WidthClasses,
};

fn hex(code: &str) -> Srgba {
    Srgba::from_hex(code).expect("palette colour")
}

fn rgba(r: u8, g: u8, b: u8, a: f32) -> Srgba {
    Srgba::new(r as f32 / 255.0, g as f32 / 255.0, b as f32 / 255.0, a)
}

/// One colour scheme's palette (tokens.json `color`).
pub struct Palette {
    pub canvas: Srgba,
    pub surface: Srgba,
    pub surface_2: Srgba,
    pub ink: Srgba,
    pub ink_2: Srgba,
    pub ink_3: Srgba,
    pub line: Srgba,
    pub line_strong: Srgba,
    pub accent: Srgba,
    pub accent_strong: Srgba,
    pub focus: Srgba,
    pub material: Srgba,
    /// The contact card: ink in light mode, a raised surface in dark mode
    /// (designed, not inverted).
    pub contact: Srgba,
    pub on_contact: Srgba,
    pub on_contact_2: Srgba,
    pub contact_control: Srgba,
    pub contact_line: Srgba,
}

/// The ember of the Keel family: decoration only, never text.
pub fn ember() -> Srgba {
    hex("#ff6b2c")
}

/// The scene window, dark in both schemes.
pub fn stage() -> Srgba {
    hex("#07080b")
}

pub fn light() -> Palette {
    let ink = hex("#111113");
    let canvas = hex("#f5f5f3");
    Palette {
        canvas,
        surface: hex("#ffffff"),
        surface_2: hex("#efefec"),
        ink,
        ink_2: hex("#45454b"),
        ink_3: hex("#66666d"),
        line: rgba(17, 17, 19, 0.09),
        line_strong: rgba(17, 17, 19, 0.16),
        accent: hex("#c2410c"),
        accent_strong: hex("#9a3412"),
        focus: hex("#1d4ed8"),
        material: rgba(245, 245, 243, 0.78),
        contact: ink,
        on_contact: canvas,
        on_contact_2: hex("#c4c4c2"),
        contact_control: rgba(245, 245, 243, 0.14),
        contact_line: rgba(245, 245, 243, 0.22),
    }
}

pub fn dark() -> Palette {
    let surface = hex("#161618");
    let surface_2 = hex("#1f1f22");
    let ink = hex("#f4f4f5");
    let ink_2 = hex("#b8b8bf");
    let line_strong = rgba(255, 255, 255, 0.16);
    Palette {
        canvas: hex("#0a0a0b"),
        surface,
        surface_2,
        ink,
        ink_2,
        ink_3: hex("#9a9aa3"),
        line: rgba(255, 255, 255, 0.08),
        line_strong,
        accent: hex("#ff8a4c"),
        accent_strong: hex("#ffa36e"),
        focus: hex("#8ab4ff"),
        material: rgba(10, 10, 11, 0.72),
        contact: surface,
        on_contact: ink,
        on_contact_2: ink_2,
        contact_control: surface_2,
        contact_line: line_strong,
    }
}

/// 1rem.
const REM: f32 = 16.0;

fn rem(v: f32) -> f32 {
    v * REM
}

/// `clamp(min, base + vw, max)`, all but `vw` in rem.
fn clamp(min: f32, base: f32, vw: f32, max: f32) -> FluidSize {
    FluidSize { min: rem(min), preferred_px: rem(base), preferred_vw: vw, max: rem(max) }
}

fn fluid(size: FluidSize, weight: u16, leading: f32, tracking_em: f32) -> TypeStyle {
    TypeStyle { weight: FontWeight::new(weight), tracking_em, leading, ..TypeStyle::sized(size.max) }
        .with_fluid(size, 1440.0)
}

fn fixed(size_rem: f32, weight: u16, leading: f32, tracking_em: f32) -> TypeStyle {
    TypeStyle { weight: FontWeight::new(weight), tracking_em, leading, ..TypeStyle::sized(rem(size_rem)) }
}

fn space(name: &str) -> Length {
    Length::Space(name.into())
}

fn ink(fg: Srgba) -> SurfaceStyle {
    SurfaceStyle::new(Srgba::TRANSPARENT, fg)
}

fn on(fill: Srgba, style: SurfaceStyle) -> SurfaceStyle {
    SurfaceStyle { fill, ..style }
}

fn text(role: impl Into<keel_ui::RoleId>) -> SurfaceText {
    SurfaceText::role(role)
}

fn weighted(role: impl Into<keel_ui::RoleId>, weight: u16) -> SurfaceText {
    SurfaceText { weight: Some(FontWeight::new(weight)), ..text(role) }
}

fn wrapped(t: SurfaceText, wrap: TextWrap) -> SurfaceText {
    SurfaceText { properties: TextProperties { wrap: Some(wrap), ..t.properties }, ..t }
}

fn flex(axis: Axis, main: MainAxisAlignment, cross: CrossAxisAlignment, wrap: bool) -> SurfaceLayout {
    SurfaceLayout::Flex { axis, main, cross, wrap }
}

fn column(fg: Srgba, gap: f32) -> SurfaceStyle {
    ink(fg).with_layout(flex(Axis::Vertical, MainAxisAlignment::Start, CrossAxisAlignment::Stretch, false)).with_gap(gap)
}

fn row(fg: Srgba, gap: f32, cross: CrossAxisAlignment, wrap: bool) -> SurfaceStyle {
    ink(fg).with_layout(flex(Axis::Horizontal, MainAxisAlignment::Start, cross, wrap)).with_gap(gap)
}

/// Content centred on the flex's cross and main axis.
fn centre(style: SurfaceStyle) -> SurfaceStyle {
    style.with_layout(flex(Axis::Horizontal, MainAxisAlignment::Center, CrossAxisAlignment::Center, false))
}

fn grid(fg: Srgba, columns: &[f32], gap: f32, align: Option<CrossAxisAlignment>) -> SurfaceStyle {
    let spec = GridSpec { align_items: align, ..GridSpec::tracks(columns.iter().map(|f| TrackSize::Fr(*f))) };
    ink(fg).with_layout(SurfaceLayout::Grid(spec)).with_gap(gap)
}

fn cols(style: SurfaceStyle, columns: &[f32]) -> SurfaceStyle {
    match style.layout.clone() {
        Some(SurfaceLayout::Grid(spec)) => style.with_layout(SurfaceLayout::Grid(GridSpec {
            columns: keel_ui::GridColumns::Tracks(columns.iter().map(|f| TrackSize::Fr(*f)).collect()),
            ..spec
        })),
        _ => style,
    }
}

/// `change` from the medium width class up (700 px and wider).
fn from_medium(style: SurfaceStyle, change: impl Fn(SurfaceStyle) -> SurfaceStyle) -> SurfaceStyle {
    style.with_variant(WidthClass::Medium, &change).with_variant(WidthClass::Expanded, &change)
}

/// `change` at the expanded width class (960 px and wider).
fn expanded(style: SurfaceStyle, change: impl FnOnce(SurfaceStyle) -> SurfaceStyle) -> SurfaceStyle {
    style.with_variant(WidthClass::Expanded, change)
}

fn pad(top: f32, right: f32, bottom: f32, left: f32) -> EdgeInsets {
    EdgeInsets::only(left, top, right, bottom)
}

/// Inner spacing, CSS order: vertical then horizontal.
fn pad_vh(vertical: f32, horizontal: f32) -> EdgeInsets {
    EdgeInsets::symmetric(horizontal, vertical)
}

fn flush(style: SurfaceStyle) -> SurfaceStyle {
    style.with_margin(EdgeInsets::all(0.0))
}

fn pill(style: SurfaceStyle) -> SurfaceStyle {
    style.with_radius(999.0)
}

fn top_rule(style: SurfaceStyle, color: Srgba) -> SurfaceStyle {
    style.with_border_sides(1.0, color, Sides { top: true, ..Sides::default() })
}

/// A square of `size` px with its content centred: letter tiles and marks.
fn square(style: SurfaceStyle, size: f32) -> SurfaceStyle {
    centre(style).with_width(BoxSize::Length(Length::Px(size))).with_min_width(size).with_min_height(size)
}

/// A card: a raised surface on the canvas.
fn card(p: &Palette, radius: f32) -> SurfaceStyle {
    on(p.surface, column(p.ink, 0.0)).with_radius(radius).with_elevation(ElevationLevel::E1)
}

/// The page's content column: at most 1120 px plus the gutters, centred.
fn wrap(p: &Palette) -> SurfaceStyle {
    ink(p.ink)
        .with_width(BoxSize::Percent(100.0))
        .with_max_width(rem(70.0) + 2.0 * rem(3.0))
        .with_margin(Sides::new(0.0, Margin::Auto, 0.0, Margin::Auto))
        .with_padding(Sides::new(0.0, space("gutter"), 0.0, space("gutter")))
}

fn button(fill: Srgba, fg: Srgba) -> SurfaceStyle {
    pill(centre(SurfaceStyle::new(fill, fg)))
        .with_gap(8.0)
        .with_min_height(48.0)
        .with_padding(pad_vh(0.0, 22.0))
        .with_border(0.0, Srgba::TRANSPARENT)
        .with_text(text("button"))
}

/// A list row: letter tile, title with meta, a line of text, a chevron.
fn row_link(p: &Palette) -> SurfaceStyle {
    row(p.ink, rem(1.0), CrossAxisAlignment::Center, false)
        .with_min_height(72.0)
        .with_padding(pad(14.0, rem(1.0), 14.0, rem(1.0)))
        .with_position(Position::Relative)
}

/// Every surface role the site's components use, on palette `p`.
fn surfaces(p: &Palette) -> Vec<(&'static str, SurfaceStyle)> {
    use CrossAxisAlignment::{Baseline, Center, Start};
    // Width variants copy the style they are given, so every change a
    // variant keeps is made before it.
    let band = |v: f32, v_wide: f32, ruled: bool| {
        let base = ink(p.ink).with_padding(Sides::new(rem(v), 0.0, rem(v), 0.0));
        let base = if ruled { top_rule(base, p.line) } else { base };
        expanded(base, move |s| s.with_padding(Sides::new(rem(v_wide), 0.0, rem(v_wide), 0.0)))
    };
    let muted = |role: &str| ink(p.ink_3).with_text(text(role));
    let list = |style: SurfaceStyle| SurfaceStyle { list_marker: Some(ListMarker::None), ..flush(style).with_padding(EdgeInsets::all(0.0)) };
    vec![
        // Page frame.
        ("shell", on(p.canvas, column(p.ink, 0.0)).with_text(text(TypeRole::Body)).with_min_height(BoxSize::ViewportHeight { percent: 100.0, max: None })),
        ("skip-link", pill(on(p.ink, ink(p.canvas))).with_padding(pad_vh(10.0, 16.0)).with_text(weighted("callout", 600))),
        ("site-main", ink(p.ink)),
        (
            "top",
            on(p.material, ink(p.ink))
                .with_border_sides(1.0, p.line, Sides { bottom: true, ..Sides::default() })
                .with_sticky_top(0.0),
        ),
        ("top-bar", wrap(p).with_layout(flex(Axis::Horizontal, MainAxisAlignment::Start, Center, false)).with_gap(rem(1.0)).with_min_height(56.0)),
        ("mark-link", row(p.ink, 10.0, Center, false).with_min_height(44.0).with_text(text("brand"))),
        ("mark-name", ink(p.ink).with_variant(WidthClass::Compact, |s| s.hidden())),
        ("menu", row(p.ink, 2.0, Center, false).with_margin(Sides::new(0.0, 0.0, 0.0, Margin::Auto))),
        ("menu-link", pill(centre(ink(p.ink_2))).with_min_height(44.0).with_padding(pad_vh(0.0, 12.0)).with_text(weighted("subhead", 500))),
        ("menu-link-current", pill(centre(ink(p.ink))).with_min_height(44.0).with_padding(pad_vh(0.0, 12.0)).with_text(weighted("subhead", 600))),
        (
            "foot",
            top_rule(ink(p.ink), p.line)
                .with_margin(Sides::new(rem(3.5), 0.0, 0.0, 0.0))
                .with_padding(Sides::new(rem(2.5), 0.0, rem(2.5), 0.0)),
        ),
        ("foot-inner", wrap(p)),
        ("foot-row", row(p.ink, rem(1.0), Center, true)),
        (
            "built",
            pill(on(p.surface, row(p.ink_2, 8.0, Center, false)))
                .with_elevation(ElevationLevel::E1)
                .with_min_height(44.0)
                .with_padding(pad(0.0, 12.0, 0.0, 8.0))
                .with_text(weighted("footnote", 600)),
        ),
        ("built-mark", square(on(stage(), ink(p.ink)), 18.0).with_radius(5.0)),
        ("built-dot", on(ember(), ink(p.ink)).with_width(BoxSize::Length(Length::Px(6.0))).with_min_height(6.0).with_radius(1.5)),
        (
            "foot-links",
            from_medium(row(p.ink, 4.0, Center, true).with_margin(Sides::new(0.0, 0.0, 0.0, -10.0)), |s| {
                s.with_margin(Sides::new(0.0, 0.0, 0.0, Margin::Auto))
            }),
        ),
        ("foot-link", pill(centre(ink(p.ink_2))).with_min_height(44.0).with_padding(pad_vh(0.0, 10.0)).with_text(text("subhead"))),
        ("foot-copy", flush(muted("footnote")).with_margin(Sides::new(rem(1.0), 0.0, 0.0, 0.0))),
        // Type.
        ("eyebrow", row(p.ink_3, 8.0, Center, false).with_text(SurfaceText { tracking_em: Some(0.01), ..weighted("footnote", 600) })),
        ("eyebrow-dot", on(ember(), ink(p.ink)).with_width(BoxSize::Length(Length::Px(7.0))).with_min_height(7.0).with_radius(2.0)),
        ("hero-title", flush(ink(p.ink)).with_text(wrapped(text("hero"), TextWrap::Balance))),
        ("hero-name", row(p.ink, 0.0, Baseline, false)),
        // The wordmark's ember dot after the name, sized with it.
        (
            "name-dot",
            on(ember(), ink(p.ink))
                .with_width(BoxSize::Length(Length::Fluid(clamp(0.4, 0.25, 0.55, 0.75))))
                .with_min_width(Length::Fluid(clamp(0.4, 0.25, 0.55, 0.75)))
                .with_min_height(BoxSize::Length(Length::Fluid(clamp(0.4, 0.25, 0.55, 0.75))))
                .with_margin(Sides::new(0.0, 0.0, 0.0, 3.0))
                .with_radius(3.0),
        ),
        ("statement", flush(ink(p.ink)).with_max_width(rem(36.0)).with_text(wrapped(text("statement"), TextWrap::Pretty))),
        ("lede", flush(ink(p.ink_2)).with_max_width(rem(40.0)).with_text(wrapped(text("lede"), TextWrap::Pretty))),
        ("section-title", flush(ink(p.ink)).with_text(wrapped(text("title"), TextWrap::Balance))),
        ("section-lede", flush(ink(p.ink_2)).with_max_width(rem(40.0)).with_text(wrapped(text(TypeRole::Body), TextWrap::Pretty))),
        // Track record.
        ("records", from_medium(grid(p.ink, &[1.0], 12.0, None), |s| cols(s, &[1.0, 1.0, 1.0]).with_gap(rem(1.0)))),
        ("record", card(p, 16.0).with_gap(4.0).with_padding(EdgeInsets::all(rem(1.25)))),
        ("record-head", ink(p.ink).with_layout(flex(Axis::Horizontal, MainAxisAlignment::SpaceBetween, Baseline, true)).with_gap(8.0)),
        ("record-name", flush(ink(p.ink)).with_text(weighted("headline", 650))),
        ("record-what", muted("subhead")),
        ("figures", list(column(p.ink, 4.0)).with_margin(Sides::new(12.0, 0.0, 0.0, 0.0))),
        ("figure", row(p.ink_2, 8.0, Baseline, true)),
        (
            "figure-value",
            ink(p.ink).with_text(SurfaceText {
                properties: TextProperties { tabular_figures: true, ..TextProperties::default() },
                ..text("title-3")
            }),
        ),
        ("figure-label", ink(p.ink_2).with_text(text("subhead"))),
        // Buttons.
        ("actions", row(p.ink, 12.0, Center, true)),
        ("button-primary", button(p.ink, p.canvas)),
        ("button-secondary", button(p.surface, p.ink).with_elevation(ElevationLevel::E1)),
        // Hero.
        ("hero", band(2.5, 5.0, false)),
        (
            "hero-grid",
            expanded(grid(p.ink, &[1.0], rem(2.0), Some(Center)), |s| cols(s, &[1.05, 1.0]).with_gap(rem(3.5))),
        ),
        ("hero-copy", column(p.ink, rem(1.25)).with_min_width(0.0)),
        (
            "stage",
            SurfaceStyle { isolate: true, ..on(stage(), ink(hex("#e8e8ec"))) }
                .with_radius(24.0)
                .with_overflow(Overflow::Hidden)
                .with_position(Position::Relative)
                .with_min_width(0.0),
        ),
        ("engine-view", on(stage(), ink(hex("#e8e8ec"))).with_width(BoxSize::Percent(100.0))),
        (
            "stage-bar",
            on(rgba(12, 13, 17, 0.62), row(hex("#d7d7de"), 10.0, Center, false))
                .with_radius(14.0)
                .with_padding(pad(8.0, 8.0, 8.0, 14.0))
                .with_text(text("footnote")),
        ),
        ("stage-dot", on(hex("#8d8d96"), ink(p.ink)).with_width(BoxSize::Length(Length::Px(8.0))).with_min_width(8.0).with_min_height(8.0).with_radius(4.0)),
        ("stage-text", ink(hex("#d7d7de")).with_min_width(0.0)),
        (
            "stage-link",
            centre(on(rgba(255, 255, 255, 0.1), ink(hex("#ffffff"))))
                .with_radius(10.0)
                .with_min_height(44.0)
                .with_padding(pad_vh(0.0, 14.0))
                .with_text(SurfaceText {
                    properties: TextProperties { white_space: Some(WhiteSpace::NoWrap), ..TextProperties::default() },
                    ..weighted("footnote", 600)
                }),
        ),
        // Sections.
        ("band", band(3.5, 5.0, false)),
        ("band-ruled", band(3.5, 5.0, true)),
        ("wrap", wrap(p)),
        ("band-head", column(p.ink, 12.0).with_margin(Sides::new(0.0, 0.0, rem(2.0), 0.0))),
        ("features", from_medium(grid(p.ink, &[1.0], rem(1.0), None), |s| cols(s, &[1.0, 1.0]).with_gap(rem(1.25)))),
        (
            "feature",
            from_medium(card(p, 24.0).with_gap(rem(1.0)).with_padding(EdgeInsets::all(rem(1.5))), |s| s.with_padding(EdgeInsets::all(rem(2.0)))),
        ),
        ("feature-top", row(p.ink, 12.0, Center, false)),
        ("feature-id", column(p.ink, 0.0)),
        ("tile-lg", square(on(p.ink, ink(p.canvas)), 44.0).with_radius(11.0).with_text(text("tile-lg"))),
        ("tile-keel", square(on(stage(), ink(hex("#ff8a4c"))), 44.0).with_radius(11.0).with_text(text("tile-lg"))),
        ("feature-name", flush(ink(p.ink)).with_text(text("title-3"))),
        ("domain", muted("footnote")),
        ("feature-text", flush(ink(p.ink_2))),
        ("chips", row(p.ink, 6.0, Center, true).with_padding(Sides::new(8.0, 0.0, 0.0, 0.0))),
        ("chip", pill(centre(on(p.surface_2, ink(p.ink_2)))).with_min_height(28.0).with_padding(pad_vh(0.0, 10.0)).with_text(weighted("footnote", 500))),
        ("go", row(p.accent, 6.0, Center, false).with_text(weighted("subhead", 600))),
        ("go-link", row(p.accent, 6.0, Center, false).with_min_height(44.0).with_text(weighted("subhead", 600))),
        // Grouped lists.
        ("group-cols", expanded(grid(p.ink, &[1.0], rem(1.0), Some(Start)), |s| cols(s, &[1.0, 1.0]).with_gap(rem(1.25)))),
        ("group", list(card(p, 16.0).with_overflow(Overflow::Hidden))),
        ("group-narrow", list(card(p, 16.0).with_overflow(Overflow::Hidden).with_max_width(760.0))),
        ("group-item", ink(p.ink)),
        ("group-narrow-item", ink(p.ink)),
        ("row", row_link(p)),
        ("tile", square(on(p.ink, ink(p.canvas)), 40.0).with_radius(10.0).with_text(text("tile"))),
        ("row-text", column(p.ink, 2.0).with_min_width(0.0)),
        ("row-title", row(p.ink, 8.0, Baseline, true).with_text(weighted(TypeRole::Body, 600))),
        ("row-meta", muted("footnote")),
        ("row-sub", ink(p.ink_2).with_text(SurfaceText { leading: Some(1.4), ..text("subhead") })),
        ("chev", ink(p.ink_3).with_text(text("chev"))),
        // Open source.
        (
            "tools",
            expanded(from_medium(grid(p.ink, &[1.0], 12.0, None), |s| cols(s, &[1.0, 1.0])), |s| cols(s, &[1.0, 1.0, 1.0]).with_gap(rem(1.0))),
        ),
        ("tool", card(p, 16.0).with_gap(8.0).with_min_height(148.0).with_padding(EdgeInsets::all(rem(1.25)))),
        ("tool-name", flush(ink(p.ink)).with_text(weighted("headline", 650))),
        ("tool-text", flush(ink(p.ink_2)).with_text(SurfaceText { leading: Some(1.45), ..text("subhead") })),
        ("tool-foot", row(p.ink_3, 8.0, Center, false).with_padding(Sides::new(8.0, 0.0, 0.0, 0.0)).with_text(text("footnote"))),
        ("lang-rust", row(p.ink_3, 6.0, Center, false)),
        ("lang-dart", row(p.ink_3, 6.0, Center, false)),
        ("lang-ts", row(p.ink_3, 6.0, Center, false)),
        ("repo", muted("repo").with_margin(Sides::new(0.0, 0.0, 0.0, Margin::Auto))),
        ("more", flush(ink(p.ink)).with_margin(Sides::new(rem(1.0), 0.0, 0.0, 0.0))),
        // Contact.
        (
            "contact",
            from_medium(
                on(p.contact, grid(p.on_contact, &[1.0], rem(1.5), None))
                    .with_radius(24.0)
                    .with_padding(pad_vh(rem(2.0), rem(1.5)))
                    .with_elevation(ElevationLevel::E1),
                |s| cols(s, &[1.2, 1.0]).with_padding(EdgeInsets::all(rem(3.5))),
            ),
        ),
        ("contact-copy", column(p.on_contact, 12.0)),
        ("contact-title", flush(ink(p.on_contact)).with_text(wrapped(text("title"), TextWrap::Balance))),
        ("contact-text", flush(ink(p.on_contact_2)).with_max_width(rem(32.0))),
        ("contact-side", column(p.on_contact, rem(1.0)).with_min_width(0.0)),
        ("email-row", row(p.on_contact, 12.0, Center, true)),
        (
            "email-address",
            centre(ink(p.on_contact))
                .with_border_sides(2.0, ember(), Sides { bottom: true, ..Sides::default() })
                .with_min_height(44.0)
                .with_text(text("email")),
        ),
        ("copy", pill(centre(on(p.contact_control, ink(p.on_contact)))).with_min_height(44.0).with_padding(pad_vh(0.0, 16.0)).with_border(0.0, Srgba::TRANSPARENT).with_text(weighted("subhead", 600))),
        ("email-status", ink(p.on_contact_2).with_text(text("footnote"))),
        ("elsewhere", row(p.on_contact, 8.0, Center, true)),
        (
            "elsewhere-link",
            pill(centre(ink(p.on_contact))).with_border(1.0, p.contact_line).with_min_height(44.0).with_padding(pad_vh(0.0, 14.0)).with_text(weighted("subhead", 500)),
        ),
        // Inner pages.
        ("page-head", expanded(column(p.ink, rem(1.0)).with_padding(pad(rem(3.5), 0.0, rem(2.0), 0.0)), |s| s.with_padding(pad(rem(5.0), 0.0, rem(2.5), 0.0)))),
        ("band-tight", ink(p.ink).with_padding(pad(8.0, 0.0, rem(3.5), 0.0))),
        ("prose", column(p.ink_2, rem(1.0)).with_max_width(rem(40.0))),
        ("prose-p", flush(ink(p.ink_2))),
        ("strong", ink(p.ink).with_text(weighted(TypeRole::Body, 600))),
        // A link that sits in its sentence: no inner spacing of its own.
        ("text-link", ink(p.accent).with_padding(EdgeInsets::all(0.0))),
        ("timeline", list(column(p.ink, 0.0))),
        (
            "era",
            from_medium(
                top_rule(ink(p.ink), p.line_strong)
                    .with_layout(SurfaceLayout::Grid(GridSpec {
                        columns: keel_ui::GridColumns::Tracks(vec![TrackSize::Px(76.0), TrackSize::Fr(1.0)]),
                        ..GridSpec::default()
                    }))
                    .with_gap(rem(1.0))
                    .with_padding(pad_vh(rem(1.25), 0.0)),
                |s| {
                    s.with_layout(SurfaceLayout::Grid(GridSpec {
                        columns: keel_ui::GridColumns::Tracks(vec![TrackSize::Px(140.0), TrackSize::Fr(1.0), TrackSize::Fr(1.2)]),
                        ..GridSpec::default()
                    }))
                    .with_gap(rem(1.5))
                    .with_padding(pad_vh(rem(1.5), 0.0))
                },
            ),
        ),
        ("era-year", ink(p.ink_3).with_padding(Sides::new(2.0, 0.0, 0.0, 0.0)).with_text(text("year"))),
        ("era-head", column(p.ink, 2.0).with_min_width(0.0)),
        ("era-name-row", row(p.ink, 6.0, Center, true)),
        ("era-name", flush(ink(p.ink)).with_text(text("title-3"))),
        ("era-role", muted("subhead")),
        ("era-record", ink(p.ink_2).with_text(text("footnote")).with_margin(Sides::new(4.0, 0.0, 0.0, 0.0))),
        (
            "name-note",
            on(p.surface_2, ink(p.ink_2)).with_radius(16.0).with_padding(pad_vh(rem(1.0), rem(1.25))).with_max_width(rem(40.0)).with_margin(Sides::new(0.0, 0.0, rem(1.5), 0.0)),
        ),
        ("name-note-text", flush(ink(p.ink_2)).with_text(text("subhead"))),
        ("status", pill(centre(on(rgba(255, 107, 44, 0.14), ink(p.accent_strong)))).with_min_height(22.0).with_padding(pad_vh(0.0, 8.0)).with_text(weighted("caption", 600))),
        (
            "era-body",
            from_medium(
                flush(ink(p.ink_2)).with_text(text("subhead")).with_grid_item(GridPlacement { column: GridSpan { start: 2, span: 1 }, ..GridPlacement::default() }),
                |s| s.with_text(text(TypeRole::Body)).with_grid_item(GridPlacement { column: GridSpan { start: 3, span: 1 }, ..GridPlacement::default() }),
            ),
        ),
        ("facts", from_medium(grid(p.ink, &[1.0], 12.0, None), |s| cols(s, &[1.0, 1.0]).with_gap(rem(1.0)))),
        ("fact", card(p, 16.0).with_gap(6.0).with_padding(EdgeInsets::all(rem(1.25)))),
        ("fact-title", flush(ink(p.ink)).with_text(weighted("headline", 650))),
        ("fact-text", flush(ink(p.ink_2)).with_text(text("subhead"))),
        // Not found.
        (
            "nf",
            flex_column_centred(p).with_min_height(BoxSize::ViewportHeight { percent: 60.0, max: None }).with_padding(pad_vh(rem(3.5), 0.0)),
        ),
        ("nf-code", ink(p.accent).with_text(text("year"))),
    ]
}

fn flex_column_centred(p: &Palette) -> SurfaceStyle {
    ink(p.ink).with_layout(flex(Axis::Vertical, MainAxisAlignment::Center, CrossAxisAlignment::Start, false)).with_gap(rem(1.25))
}

fn document(p: &Palette) -> DocumentStyle {
    DocumentStyle {
        leading: Some(1.5),
        text_rendering: Some(TextRendering::OptimizeLegibility),
        font_smoothing: Some(FontSmoothing::Grayscale),
        selection: Some(SelectionColors { fill: rgba(255, 107, 44, 0.28), fg: Some(p.ink) }),
        smooth_scroll: true,
        // In-page links land clear of the sticky header.
        scroll_padding_top: Some(72.0.into()),
        overflow_x: Some(Overflow::Clip),
    }
}

/// The theme on palette `p`, over Keel's light or dark base.
pub fn themed(p: &Palette, base: Theme) -> Theme {
    let mut theme = Theme {
        name: Some("kylet".into()),
        background: p.canvas,
        surface: p.surface,
        surface_high: p.surface_2,
        primary: p.accent,
        on_primary: p.canvas,
        on_surface: p.ink,
        on_surface_variant: p.ink_2,
        outline: p.line,
        ring: p.focus,
        radius_sm: 10.0,
        radius_md: 16.0,
        radius_lg: 24.0,
        document: document(p),
        // Compact up to 700 px, medium up to 960 px.
        width_classes: WidthClasses { medium: 700.0, expanded: 960.0 },
        ..base
    }
    .with_type(TypeRole::Body, fixed(1.0625, 400, 1.5, 0.0))
    .with_type("hero", fluid(clamp(2.375, 1.55, 3.9, 4.5), 700, 1.02, -0.035))
    .with_type("title", fluid(clamp(1.75, 1.35, 1.7, 2.625), 700, 1.08, -0.028))
    .with_type("lede", fluid(clamp(1.0625, 1.0, 0.35, 1.25), 400, 1.5, 0.0))
    .with_type("statement", fluid(clamp(1.375, 1.1, 1.0, 1.875), 500, 1.28, -0.02))
    .with_type("email", fluid(clamp(1.375, 1.1, 1.2, 2.0), 650, 1.2, -0.02))
    .with_type("title-3", fixed(1.25, 650, 1.3, -0.015))
    .with_type("headline", fixed(1.0625, 600, 1.4, 0.0))
    .with_type("callout", fixed(1.0, 400, 1.4, 0.0))
    .with_type("subhead", fixed(0.9375, 400, 1.5, 0.0))
    .with_type("footnote", fixed(0.8125, 400, 1.45, 0.0))
    .with_type("caption", fixed(0.75, 400, 1.4, 0.0))
    .with_type("brand", fixed(1.0625, 650, 1.2, -0.015))
    .with_type("button", fixed(1.0, 600, 1.2, -0.01))
    .with_type("tile", fixed(1.0, 700, 1.0, -0.02))
    .with_type("tile-lg", fixed(1.1, 700, 1.0, -0.02))
    .with_type("chev", fixed(1.25, 400, 1.0, 0.0))
    .with_type("year", fixed(0.9375, 400, 1.5, 0.0))
    .with_type("repo", fixed(0.75, 400, 1.4, 0.0))
    // System fonts: the display cut for headings, monospace for years and
    // repositories (the families are named in assets/site.css, keel#3821).
    .with_type_family("hero", "display")
    .with_type_family("title", "display")
    .with_type_family("title-3", "display")
    .with_type_family("email", "display")
    .with_type_family("statement", "display")
    .with_type_family("tile", "display")
    .with_type_family("tile-lg", "display")
    .with_type_family("year", "mono")
    .with_type_family("repo", "mono")
    // The page gutter: 16 px on a phone, 48 px on a desktop.
    .with_space("gutter", clamp(1.0, 0.0, 4.2, 3.0))
    // Presses and hovers settle quickly; reveals take longer.
    .with_motion(MotionRole::Fast, 120)
    .with_motion(MotionRole::Normal, 200)
    .with_motion(MotionRole::Slow, 420)
    .with_ease(EaseRole::Standard, Ease::CubicBezier { x1: 0.22, y1: 1.0, x2: 0.36, y2: 1.0 })
    // Colours the stylesheet's remaining rules read, as `--keel-token-*`.
    .with_token("ink", ThemeToken::Color(p.ink))
    .with_token("surface-2", ThemeToken::Color(p.surface_2))
    .with_token("line", ThemeToken::Color(p.line))
    .with_token("line-strong", ThemeToken::Color(p.line_strong))
    .with_token("ember", ThemeToken::Color(ember()));
    for (role, style) in surfaces(p) {
        theme = theme.with_surface(role, style);
    }
    theme
}

/// The theme the pages are drawn with: the light palette.
pub fn theme() -> Theme {
    themed(&light(), Theme::light())
}

/// The dark scheme: the same theme on the dark palette, as Keel emits a
/// theme, applied when the reader's device prefers dark. Written to
/// `assets/dark.css`; a test fails when the file is stale. Replaced by a
/// Keel scheme pair when the engine emits one (keel#4060).
pub fn dark_stylesheet() -> String {
    format!(
        "/* Generated by `KYLET_WRITE_DARK=1 cargo test -p kylet-site dark_stylesheet`\n * from site/src/theme.rs: the dark palette, through keel_web::theme_stylesheet. Do not edit. */\n@media (prefers-color-scheme: dark){{{}}}\n",
        keel_web::theme_stylesheet(&themed(&dark(), Theme::dark()))
    )
}

