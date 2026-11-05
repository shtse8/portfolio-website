//! The site's theme: every design token (docs/design/tokens.json) and the
//! style of every surface, for the light and the dark palette.
//!
//! Keel exports both palettes from Site::theme and Site::theme_dark. The page
//! uses the light theme; the device's dark preference selects the engine's
//! emitted dark rules. Remaining site.css blocks each name an engine gap.

use keel::math::Srgba;
use keel::paint::BoxShadow;
use keel::text::{FontFamilyList, FontSource, GenericFamily};
use crate::roles::SiteSurface;
use keel::ui::{Axis, BoxSize, CrossAxisAlignment, DocumentStyle, Ease, EaseRole, EdgeInsets, ElevationLevel, ElevationShadows, FluidSize, FontSmoothing, FontWeight, GridPlacement, GridSpan, GridSpec, InteractionSource, Length, ListMarker, MainAxisAlignment, Margin, MotionRole, Overflow, PointerEvents, Position, SafeEdge, SelectionColors, Sides, SurfaceLayout, SurfaceState, SurfaceStates, SurfaceStyle, SurfaceText, TextProperties, TextRendering, TextWrap, Theme, ThemeToken, TrackSize, TypeRole, TypeStyle, WhiteSpace, WidthClass, WidthClasses};

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

/// System faces in priority order; no font asset is downloaded.
fn system_font(display: bool) -> FontFamilyList {
    use FontSource::{Generic, Installed};
    use GenericFamily::{AppleSystem, BlinkMacSystemFont, SansSerif};
    FontFamilyList::new([
        Generic(AppleSystem), Generic(BlinkMacSystemFont),
        Installed(if display { "SF Pro Display" } else { "SF Pro Text" }.into()),
        Installed(if display { "Segoe UI Variable Display" } else { "Segoe UI Variable Text" }.into()),
        Installed("Segoe UI".into()), Installed("Roboto".into()),
        Installed("Helvetica Neue".into()), Installed("Arial".into()),
        Installed("Noto Sans".into()), Generic(SansSerif),
    ])
}

fn mono_font() -> FontFamilyList {
    use FontSource::{Generic, Installed};
    FontFamilyList::new([
        Generic(GenericFamily::UiMonospace), Installed("SF Mono".into()),
        Installed("Cascadia Code".into()), Installed("Roboto Mono".into()),
        Installed("Menlo".into()), Installed("Consolas".into()),
        Generic(GenericFamily::Monospace),
    ])
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

// keel-migrate: Length adds Rem(f32): handle it in exhaustive matches using the root font size (16px by default), not a local type role; existing variants retain their meaning. See docs/MIGRATING.md#root-lengths-and-shadow-stacks.
fn space(name: &str) -> Length {
    Length::Space(name.into())
}

// keel-migrate: SurfaceStyle has an optional backdrop_blur field: add backdrop_blur: None or ..SurfaceStyle::default() to literals; with_backdrop_blur(radius) declares the role's blur (docs/MIGRATING.md#surface-backdrop-blur); `SurfaceStyle` also adds `pointer_events`: inspect complete literals and add `pointer_events: None` (or `..SurfaceStyle::default()`) to retain inherited targeting (docs/MIGRATING.md#interaction-input-and-pointer-policy). SurfaceStyle literals also add box_shadows: Vec::new(); builders or ..SurfaceStyle::default() preserve an empty explicit stack. See docs/MIGRATING.md#root-lengths-and-shadow-stacks.
fn ink(fg: Srgba) -> SurfaceStyle {
    SurfaceStyle::new(Srgba::TRANSPARENT, fg)
}

fn on(fill: Srgba, style: SurfaceStyle) -> SurfaceStyle {
    SurfaceStyle { fill, ..style }
}

fn text(role: impl Into<keel::ui::RoleId>) -> SurfaceText {
    SurfaceText::role(role)
}

fn weighted(role: impl Into<keel::ui::RoleId>, weight: u16) -> SurfaceText {
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
            columns: keel::ui::GridColumns::Tracks(columns.iter().map(|f| TrackSize::Fr(*f)).collect()),
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
    style.with_border_sides(0.5, color, Sides { top: true, ..Sides::default() })
}

/// A square of `size` px with its content centred: letter tiles and marks.
fn square(style: SurfaceStyle, size: f32) -> SurfaceStyle {
    centre(style).with_width(BoxSize::Length(Length::Px(size))).with_min_width(size).with_min_height(size)
}

/// Hover, keyboard focus and press, on the theme's motion tokens.
// keel-migrate: `SurfaceStates` adds `source`: inspect complete literals and add `source: InteractionSource::SelfNode` (or `..SurfaceStates::default()`) to retain local input; opt into Parent or Ancestor only deliberately (docs/MIGRATING.md#interaction-input-and-pointer-policy). Complete literals also add `selected: None` (or retain intentional defaults) for the optional selected look (docs/MIGRATING.md#selected-surface-states).
fn states(hover: SurfaceState, active: SurfaceState) -> SurfaceStates {
    SurfaceStates { hover: Some(hover), active: Some(active), ..SurfaceStates::default() }
}

/// A chrome link: its text darkens and a tint fills behind it.
fn tinted(style: SurfaceStyle, p: &Palette) -> SurfaceStyle {
    let hover = SurfaceState { fg: Some(p.ink), fill: Some(p.surface_2), ..SurfaceState::default() };
    style.with_states(SurfaceStates { hover: Some(hover), motion: MotionRole::Normal, ..SurfaceStates::default() })
}

/// A button: it presses in.
fn pressable(style: SurfaceStyle, hover: SurfaceState) -> SurfaceStyle {
    style.with_states(states(hover, SurfaceState { scale: Some(0.97), ..SurfaceState::default() }))
}

/// A card link: it lifts on hover and gives slightly when pressed.
fn liftable(style: SurfaceStyle, press: f32) -> SurfaceStyle {
    let hover = SurfaceState { elevation: Some(ElevationLevel::E2), translate: Some([0.0, -2.0]), ..SurfaceState::default() };
    style.with_states(SurfaceStates {
        motion: MotionRole::Normal,
        ..states(hover, SurfaceState { scale: Some(press), ..SurfaceState::default() })
    })
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
        .with_padding(Sides::new(
            0.0,
            Length::safe_area(SafeEdge::Right, space("gutter")),
            0.0,
            Length::safe_area(SafeEdge::Left, space("gutter")),
        ))
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

fn shadow(y: f32, blur: f32, spread: f32, color: Srgba, inset: bool) -> BoxShadow {
    BoxShadow { offset: [0.0, y], blur, spread, color, inset }
}

fn elevation_shadows(p: &Palette) -> ElevationShadows {
    let ring = shadow(0.0, 0.0, 1.0, p.line, false);
    let dark = p.canvas == hex("#0a0a0b");
    let mut e1 = vec![ring];
    let mut e2 = vec![ring];
    if dark {
        e2.push(shadow(16.0, 40.0, -16.0, rgba(0, 0, 0, 0.8), false));
    } else {
        let soft = shadow(1.0, 2.0, 0.0, rgba(17, 17, 19, 0.04), false);
        e1.insert(0, soft);
        e2.insert(0, shadow(12.0, 32.0, -12.0, rgba(17, 17, 19, 0.18), false));
        e2.insert(0, soft);
    }
    ElevationShadows { e1: Some(e1), e2: Some(e2), ..ElevationShadows::default() }
}

/// Every surface role the site's components use, on palette `p`.
fn surface(p: &Palette, role: SiteSurface) -> SurfaceStyle {
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
    match role {
        SiteSurface::Shell => on(p.canvas, column(p.ink, 0.0)).with_text(text(TypeRole::Body)).with_min_height(BoxSize::ViewportHeight { percent: 100.0, max: None }),
        SiteSurface::SiteMain => ink(p.ink),
        SiteSurface::Top => on(p.material, ink(p.ink))
                .with_border_sides(0.5, p.line, Sides { bottom: true, ..Sides::default() })
                .with_padding(Sides::new(Length::safe_area(SafeEdge::Top, 0.0), 0.0, 0.0, 0.0))
                .with_z_index(50)
                .with_sticky_top(0.0),
        SiteSurface::TopBar => wrap(p).with_layout(flex(Axis::Horizontal, MainAxisAlignment::Start, Center, false)).with_gap(rem(1.0)).with_min_height(56.0),
        SiteSurface::MarkLink => row(p.ink, 10.0, Center, false).with_min_height(44.0).with_text(text("brand")),
        SiteSurface::MarkIcon => square(ink(p.ink), 28.0).with_height(28.0),
        SiteSurface::MarkName => ink(p.ink).with_variant(WidthClass::Compact, |s| s.hidden()),
        SiteSurface::Menu => row(p.ink, 2.0, Center, false).with_margin(Sides::new(0.0, 0.0, 0.0, Margin::Auto)),
        SiteSurface::MenuLink => tinted(pill(centre(ink(p.ink_2))).with_min_height(44.0).with_padding(pad_vh(0.0, 12.0)).with_text(weighted("subhead", 500)), p),
        SiteSurface::MenuLinkCurrent => pill(centre(ink(p.ink))).with_min_height(44.0).with_padding(pad_vh(0.0, 12.0)).with_text(weighted("subhead", 600)),
        SiteSurface::Foot => top_rule(ink(p.ink), p.line)
                .with_margin(Sides::new(rem(3.5), 0.0, 0.0, 0.0))
                .with_padding(Sides::new(rem(2.5), 0.0, rem(2.5), 0.0)),
        SiteSurface::FootInner => wrap(p),
        SiteSurface::FootRow => row(p.ink, rem(1.0), Center, true),
        SiteSurface::Built => pill(on(p.surface, row(p.ink_2, 8.0, Center, false)))
                .with_elevation(ElevationLevel::E1)
                .with_min_height(44.0)
                .with_padding(pad(0.0, 12.0, 0.0, 8.0))
                .with_text(weighted("footnote", 600)),
        SiteSurface::BuiltMark => square(on(stage(), ink(p.ink)), 18.0).with_radius(5.0),
        SiteSurface::BuiltDot => on(ember(), ink(p.ink)).with_width(BoxSize::Length(Length::Px(6.0))).with_min_height(6.0).with_radius(1.5),
        SiteSurface::FootLinks => from_medium(row(p.ink, 4.0, Center, true).with_margin(Sides::new(0.0, 0.0, 0.0, -10.0)), |s| {
                s.with_margin(Sides::new(0.0, 0.0, 0.0, Margin::Auto))
            }),
        SiteSurface::FootLink => tinted(pill(centre(ink(p.ink_2))).with_min_height(44.0).with_padding(pad_vh(0.0, 10.0)).with_text(text("subhead")), p),
        SiteSurface::FootCopy => flush(muted("footnote")).with_margin(Sides::new(rem(1.0), 0.0, 0.0, 0.0)),
        SiteSurface::Eyebrow => row(p.ink_3, 8.0, Center, false).with_text(SurfaceText { tracking_em: Some(0.01), ..weighted("footnote", 600) }),
        SiteSurface::EyebrowDot => on(ember(), ink(p.ink)).with_width(BoxSize::Length(Length::Px(7.0))).with_min_height(7.0).with_radius(2.0),
        SiteSurface::HeroTitle => flush(ink(p.ink)).with_text(wrapped(text("hero"), TextWrap::Balance)),
        SiteSurface::HeroName => row(p.ink, 0.0, Baseline, false),
        SiteSurface::NameDot => on(ember(), ink(p.ink))
                .with_width(BoxSize::Length(Length::Fluid(clamp(0.4, 0.25, 0.55, 0.75))))
                .with_min_width(Length::Fluid(clamp(0.4, 0.25, 0.55, 0.75)))
                .with_min_height(BoxSize::Length(Length::Fluid(clamp(0.4, 0.25, 0.55, 0.75))))
                .with_margin(Sides::new(0.0, 0.0, 0.0, 3.0))
                .with_radius(3.0),
        SiteSurface::Statement => flush(ink(p.ink)).with_max_width(rem(36.0)).with_text(wrapped(text("statement"), TextWrap::Pretty)),
        SiteSurface::Lede => flush(ink(p.ink_2)).with_max_width(rem(40.0)).with_text(wrapped(text("lede"), TextWrap::Pretty)),
        SiteSurface::SectionTitle => flush(ink(p.ink)).with_text(wrapped(text("title"), TextWrap::Balance)),
        SiteSurface::SectionLede => flush(ink(p.ink_2)).with_max_width(rem(40.0)).with_text(wrapped(text(TypeRole::Body), TextWrap::Pretty)),
        SiteSurface::Records => from_medium(grid(p.ink, &[1.0], 12.0, None), |s| cols(s, &[1.0, 1.0, 1.0]).with_gap(rem(1.0))),
        SiteSurface::Record => card(p, 16.0).with_gap(4.0).with_padding(EdgeInsets::all(rem(1.25))),
        SiteSurface::RecordHead => ink(p.ink).with_layout(flex(Axis::Horizontal, MainAxisAlignment::SpaceBetween, Baseline, true)).with_gap(8.0),
        SiteSurface::RecordName => flush(ink(p.ink)).with_text(weighted("headline", 650)),
        SiteSurface::RecordWhat => muted("subhead"),
        SiteSurface::Figures => list(column(p.ink, 4.0)).with_margin(Sides::new(12.0, 0.0, 0.0, 0.0)),
        SiteSurface::Figure => row(p.ink_2, 8.0, Baseline, true),
        SiteSurface::FigureValue => ink(p.ink).with_text(SurfaceText {
                properties: TextProperties { tabular_figures: true, ..TextProperties::default() },
                ..text("title-3")
            }),
        SiteSurface::FigureLabel => ink(p.ink_2).with_text(text("subhead")),
        SiteSurface::Actions => row(p.ink, 12.0, Center, true),
        SiteSurface::ButtonPrimary => pressable(button(p.ink, p.canvas), SurfaceState { elevation: Some(ElevationLevel::E2), ..SurfaceState::default() }),
        SiteSurface::ButtonSecondary => pressable(button(p.surface, p.ink).with_elevation(ElevationLevel::E1), SurfaceState { fill: Some(p.surface_2), ..SurfaceState::default() }),
        SiteSurface::Hero => band(2.5, 5.0, false),
        SiteSurface::HeroGrid => expanded(grid(p.ink, &[1.0], rem(2.0), Some(Center)), |s| cols(s, &[1.05, 1.0]).with_gap(rem(3.5))),
        SiteSurface::HeroCopy => column(p.ink, rem(1.25)).with_min_width(0.0),
        SiteSurface::Stage => SurfaceStyle { isolate: true, ..on(stage(), ink(hex("#e8e8ec"))) }
                .with_box_shadows([
                    shadow(0.0, 0.0, 1.0, rgba(255, 255, 255, 0.06), true),
                    shadow(30.0, 60.0, -30.0, rgba(7, 8, 11, 0.55), false),
                ])
                .with_radius(24.0)
                .with_overflow(Overflow::Hidden)
                .with_position(Position::Relative)
                .with_min_width(0.0),
        SiteSurface::EngineView => on(stage(), ink(hex("#e8e8ec"))).with_width(BoxSize::Percent(100.0)),
        SiteSurface::StageOverlay => column(p.ink, 0.0)
                .with_position(Position::Cover)
                .with_layout(flex(Axis::Vertical, MainAxisAlignment::End, CrossAxisAlignment::Stretch, false))
                .with_padding(EdgeInsets::all(12.0))
                .with_z_index(2)
                .with_pointer_events(PointerEvents::None),
        SiteSurface::StageBar => on(rgba(12, 13, 17, 0.62), row(hex("#d7d7de"), 10.0, Center, false))
                .with_pointer_events(PointerEvents::Auto)
                .with_box_shadows([shadow(0.0, 0.0, 1.0, rgba(255, 255, 255, 0.08), true)])
                .with_radius(14.0)
                .with_padding(pad(8.0, 8.0, 8.0, 14.0))
                .with_text(text("footnote")),
        SiteSurface::StageDot => on(hex("#8d8d96"), ink(p.ink)).with_width(BoxSize::Length(Length::Px(8.0))).with_min_width(8.0).with_min_height(8.0).with_radius(4.0),
        SiteSurface::StageDotLive => on(hex("#3ddc84"), ink(p.ink))
                .with_width(BoxSize::Length(Length::Px(8.0))).with_min_width(8.0)
                .with_min_height(8.0).with_radius(4.0)
                .with_box_shadows([shadow(0.0, 0.0, 3.0, rgba(61, 220, 132, 0.18), false)]),
        SiteSurface::StageText => ink(hex("#d7d7de")).with_min_width(0.0),
        SiteSurface::StageLink => centre(on(rgba(255, 255, 255, 0.1), ink(hex("#ffffff"))))
                .with_radius(10.0)
                .with_min_height(44.0)
                .with_padding(pad_vh(0.0, 14.0))
                .with_text(SurfaceText {
                    properties: TextProperties { white_space: Some(WhiteSpace::NoWrap), ..TextProperties::default() },
                    ..weighted("footnote", 600)
                })
                .with_states(SurfaceStates {
                    hover: Some(SurfaceState { fill: Some(rgba(255, 255, 255, 0.16)), ..SurfaceState::default() }),
                    ..SurfaceStates::default()
                }),
        SiteSurface::Band => band(3.5, 5.0, false),
        SiteSurface::BandRuled => band(3.5, 5.0, true),
        SiteSurface::Wrap => wrap(p),
        SiteSurface::BandHead => column(p.ink, 12.0).with_margin(Sides::new(0.0, 0.0, rem(2.0), 0.0)),
        SiteSurface::Features => from_medium(grid(p.ink, &[1.0], rem(1.0), None), |s| cols(s, &[1.0, 1.0]).with_gap(rem(1.25))),
        SiteSurface::Feature => from_medium(liftable(card(p, 24.0).with_gap(rem(1.0)).with_padding(EdgeInsets::all(rem(1.5))), 0.99), |s| {
                s.with_padding(EdgeInsets::all(rem(2.0)))
            }),
        SiteSurface::FeatureTop => row(p.ink, 12.0, Center, false),
        SiteSurface::FeatureId => column(p.ink, 0.0),
        SiteSurface::TileLg => square(on(p.ink, ink(p.canvas)), 44.0).with_radius(11.0).with_text(text("tile-lg")),
        SiteSurface::TileKeel => square(on(stage(), ink(hex("#ff8a4c"))), 44.0).with_box_shadows([shadow(0.0, 0.0, 1.0, rgba(255, 255, 255, 0.12), true)]).with_radius(11.0).with_text(text("tile-lg")),
        SiteSurface::FeatureName => flush(ink(p.ink)).with_text(text("title-3")),
        SiteSurface::Domain => muted("footnote"),
        SiteSurface::FeatureText => flush(ink(p.ink_2)).with_text(text(TypeRole::Body)),
        SiteSurface::Chips => row(p.ink, 6.0, Center, true).with_padding(Sides::new(8.0, 0.0, 0.0, 0.0)),
        SiteSurface::Chip => pill(centre(on(p.surface_2, ink(p.ink_2)))).with_min_height(28.0).with_padding(pad_vh(0.0, 10.0)).with_text(weighted("footnote", 500)),
        SiteSurface::Go => row(p.accent, 6.0, Center, false).with_text(weighted("subhead", 600)),
        SiteSurface::GoArrow | SiteSurface::GoArrowFromLink => ink(p.accent)
                .with_states(SurfaceStates {
                    source: if matches!(role, SiteSurface::GoArrow) { InteractionSource::Parent } else { InteractionSource::Ancestor(2) },
                    hover: Some(SurfaceState { translate: Some([3.0, 0.0]), ..SurfaceState::default() }),
                    motion: MotionRole::Normal,
                    ..SurfaceStates::default()
                }),
        SiteSurface::GoLink => row(p.accent, 6.0, Center, false).with_min_height(44.0).with_text(weighted("subhead", 600)),
        SiteSurface::GroupCols => expanded(grid(p.ink, &[1.0], rem(1.0), Some(Start)), |s| cols(s, &[1.0, 1.0]).with_gap(rem(1.25))),
        SiteSurface::Group => list(card(p, 16.0).with_overflow(Overflow::Hidden)),
        SiteSurface::GroupNarrow => list(card(p, 16.0).with_overflow(Overflow::Hidden).with_max_width(760.0)),
        SiteSurface::GroupItem => ink(p.ink),
        SiteSurface::GroupNarrowItem => ink(p.ink),
        SiteSurface::Row => row_link(p).with_states(states(
                SurfaceState { fill: Some(p.surface_2), ..SurfaceState::default() },
                SurfaceState { fill: Some(p.line), ..SurfaceState::default() },
            )),
        SiteSurface::RowDivider => top_rule(ink(p.ink).with_position(Position::Cover).with_height(0.0).with_margin(Sides::new(0.0, 0.0, 0.0, 72.0)), p.line_strong),
        SiteSurface::Tile => square(on(p.ink, ink(p.canvas)), 40.0).with_radius(10.0).with_text(text("tile")),
        SiteSurface::RowText => column(p.ink, 2.0).with_min_width(0.0),
        SiteSurface::RowTitle => row(p.ink, 8.0, Baseline, true).with_text(weighted(TypeRole::Body, 600)),
        SiteSurface::RowMeta => muted("footnote"),
        SiteSurface::RowSub => ink(p.ink_2).with_text(SurfaceText { leading: Some(1.4), ..text("subhead") }),
        SiteSurface::Chev => ink(p.ink_3).with_text(text("chev")),
        SiteSurface::Tools => expanded(from_medium(grid(p.ink, &[1.0], 12.0, None), |s| cols(s, &[1.0, 1.0])), |s| cols(s, &[1.0, 1.0, 1.0]).with_gap(rem(1.0))),
        SiteSurface::Tool => liftable(card(p, 16.0).with_gap(8.0).with_min_height(148.0).with_padding(EdgeInsets::all(rem(1.25))), 0.985),
        SiteSurface::ToolName => flush(ink(p.ink)).with_text(weighted("headline", 650)),
        SiteSurface::ToolText => flush(ink(p.ink_2)).with_text(SurfaceText { leading: Some(1.45), ..text("subhead") }),
        SiteSurface::ToolFoot => row(p.ink_3, 8.0, Center, false).with_padding(Sides::new(8.0, 0.0, 0.0, 0.0)).with_text(text("footnote")),
        SiteSurface::LangRust => row(p.ink_3, 6.0, Center, false),
        SiteSurface::LangDart => row(p.ink_3, 6.0, Center, false),
        SiteSurface::LangTs => row(p.ink_3, 6.0, Center, false),
        SiteSurface::LangRustDot => square(on(hex("#dea584"), ink(p.ink)), 8.0).with_height(8.0).with_radius(4.0),
        SiteSurface::LangDartDot => square(on(hex("#00b4ab"), ink(p.ink)), 8.0).with_height(8.0).with_radius(4.0),
        SiteSurface::LangTsDot => square(on(hex("#3178c6"), ink(p.ink)), 8.0).with_height(8.0).with_radius(4.0),
        SiteSurface::Repo => muted("repo").with_margin(Sides::new(0.0, 0.0, 0.0, Margin::Auto)),
        SiteSurface::More => flush(ink(p.ink)).with_margin(Sides::new(rem(1.0), 0.0, 0.0, 0.0)),
        SiteSurface::Contact => from_medium(
                on(p.contact, grid(p.on_contact, &[1.0], rem(1.5), None))
                    .with_radius(24.0)
                    .with_padding(pad_vh(rem(2.0), rem(1.5)))
                    .with_elevation(ElevationLevel::E1),
                |s| cols(s, &[1.2, 1.0]).with_padding(EdgeInsets::all(rem(3.5))),
            ),
        SiteSurface::ContactCopy => column(p.on_contact, 12.0),
        SiteSurface::ContactTitle => flush(ink(p.on_contact)).with_text(wrapped(text("title"), TextWrap::Balance)),
        SiteSurface::ContactText => flush(ink(p.on_contact_2)).with_max_width(rem(32.0)),
        SiteSurface::ContactSide => column(p.on_contact, rem(1.0)).with_min_width(0.0),
        SiteSurface::EmailRow => row(p.on_contact, 12.0, Center, true),
        SiteSurface::EmailAddress => centre(ink(p.on_contact))
                .with_border_sides(2.0, ember(), Sides { bottom: true, ..Sides::default() })
                .with_min_height(44.0)
                .with_text(text("email")),
        SiteSurface::Copy => pressable(
                pill(centre(on(p.contact_control, ink(p.on_contact)))).with_min_height(44.0).with_padding(pad_vh(0.0, 16.0)).with_border(0.0, Srgba::TRANSPARENT).with_text(weighted("subhead", 600)),
                SurfaceState::default(),
            ),
        SiteSurface::EmailStatus => ink(p.on_contact_2).with_text(text("footnote")),
        SiteSurface::Elsewhere => row(p.on_contact, 8.0, Center, true),
        SiteSurface::ElsewhereLink => pill(centre(ink(p.on_contact)))
                .with_border(1.0, p.contact_line)
                .with_min_height(44.0)
                .with_padding(pad_vh(0.0, 14.0))
                .with_text(weighted("subhead", 500))
                .with_states(SurfaceStates {
                    hover: Some(SurfaceState { fill: Some(p.contact_control), ..SurfaceState::default() }),
                    ..SurfaceStates::default()
                }),
        SiteSurface::PageHead => expanded(column(p.ink, rem(1.0)).with_padding(pad(rem(3.5), 0.0, rem(2.0), 0.0)), |s| s.with_padding(pad(rem(5.0), 0.0, rem(2.5), 0.0))),
        SiteSurface::BandTight => ink(p.ink).with_padding(pad(8.0, 0.0, rem(3.5), 0.0)),
        SiteSurface::Prose => column(p.ink_2, rem(1.0)).with_max_width(rem(40.0)),
        SiteSurface::ProseP => flush(ink(p.ink_2)),
        SiteSurface::Strong => ink(p.ink).with_text(weighted(TypeRole::Body, 600)),
        SiteSurface::Timeline => list(column(p.ink, 0.0)),
        SiteSurface::Era => from_medium(
                top_rule(ink(p.ink), p.line_strong)
                    .with_layout(SurfaceLayout::Grid(GridSpec {
                        columns: keel::ui::GridColumns::Tracks(vec![TrackSize::Px(76.0), TrackSize::Fr(1.0)]),
                        ..GridSpec::default()
                    }))
                    .with_gap(rem(1.0))
                    .with_padding(pad_vh(rem(1.25), 0.0)),
                |s| {
                    s.with_layout(SurfaceLayout::Grid(GridSpec {
                        columns: keel::ui::GridColumns::Tracks(vec![TrackSize::Px(140.0), TrackSize::Fr(1.0), TrackSize::Fr(1.2)]),
                        ..GridSpec::default()
                    }))
                    .with_gap(rem(1.5))
                    .with_padding(pad_vh(rem(1.5), 0.0))
                },
            ),
        SiteSurface::EraYear => ink(p.ink_3).with_padding(Sides::new(2.0, 0.0, 0.0, 0.0)).with_text(text("year")),
        SiteSurface::EraHead => column(p.ink, 2.0).with_min_width(0.0),
        SiteSurface::EraNameRow => row(p.ink, 6.0, Center, true),
        SiteSurface::EraName => flush(ink(p.ink)).with_text(text("title-3")),
        SiteSurface::EraRole => muted("subhead"),
        SiteSurface::EraRecord => ink(p.ink_2).with_text(text("footnote")).with_margin(Sides::new(4.0, 0.0, 0.0, 0.0)),
        SiteSurface::NameNote => on(p.surface_2, ink(p.ink_2)).with_radius(16.0).with_padding(pad_vh(rem(1.0), rem(1.25))).with_max_width(rem(40.0)).with_margin(Sides::new(0.0, 0.0, rem(1.5), 0.0)),
        SiteSurface::NameNoteText => flush(ink(p.ink_2)).with_text(text("subhead")),
        SiteSurface::Status => pill(centre(on(rgba(255, 107, 44, 0.14), ink(p.accent_strong)))).with_min_height(22.0).with_padding(pad_vh(0.0, 8.0)).with_text(weighted("caption", 600)),
        SiteSurface::EraBody => from_medium(
                flush(ink(p.ink_2)).with_text(text("subhead")).with_grid_item(GridPlacement { column: GridSpan { start: 2, span: 1 }, ..GridPlacement::default() }),
                |s| s.with_text(text(TypeRole::Body)).with_grid_item(GridPlacement { column: GridSpan { start: 3, span: 1 }, ..GridPlacement::default() }),
            ),
        SiteSurface::Facts => from_medium(grid(p.ink, &[1.0], 12.0, None), |s| cols(s, &[1.0, 1.0]).with_gap(rem(1.0))),
        SiteSurface::Fact => card(p, 16.0).with_gap(6.0).with_padding(EdgeInsets::all(rem(1.25))),
        SiteSurface::FactTitle => flush(ink(p.ink)).with_text(weighted("headline", 650)),
        SiteSurface::FactText => flush(ink(p.ink_2)).with_text(text("subhead")),
        SiteSurface::Nf => flex_column_centred(p).with_min_height(BoxSize::ViewportHeight { percent: 60.0, max: None }).with_padding(pad_vh(rem(3.5), 0.0)),
        SiteSurface::NfCode => ink(p.accent).with_text(text("year")),
    }
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
    let theme = Theme {
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
        canvas: Some(p.canvas),
        link: Some(p.accent),
        link_hover: Some(p.accent_strong),
        focus_ring_width: 2.0,
        // System fonts only: nothing downloads, so text never shifts.
        font_ui: system_font(false),
        radius_sm: 10.0,
        radius_md: 16.0,
        radius_lg: 24.0,
        document: document(p),
        // Compact up to 700 px, medium up to 960 px.
        width_classes: WidthClasses { medium: 700.0, expanded: 960.0 },
        ..base
    }
    .with_elevation_shadows(elevation_shadows(p))
    .with_font_family_stack("display", system_font(true))
    .with_font_family_stack("mono", mono_font())
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
    // repositories, bound by the typed family stacks above.
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
    theme
        .with_surface(keel::ui::SurfaceRole::NavLink, ink(p.accent).with_padding(EdgeInsets::all(0.0)))
        .with_surface_roles(|role| surface(p, role))
}

/// The theme the pages are drawn with: the light palette.
pub fn theme() -> Theme {
    themed(&light(), Theme::light())
}

/// The dark scheme, emitted with the light theme by Site::theme_dark.
pub fn dark_theme() -> Theme {
    themed(&dark(), Theme::dark())
}
