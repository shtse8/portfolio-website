//! Thin constructors over keel-ui nodes for this site.
//!
//! Each node is styled as a surface role of the site's theme
//! (`theme.rs`): keel-web draws the role from one class rule.

pub use crate::roles::SiteSurface;

use keel::ui::{box_node, Component, footer, header, heading, link, list, list_item, main, nav, paragraph, section, text};

/// A block (`div`).
pub fn div(id: impl Into<String>, surface: SiteSurface) -> Component {
    box_node(id.into()).typed_surface(surface)
}

/// A `section` landmark.
pub fn sect(id: impl Into<String>, surface: SiteSurface) -> Component {
    section(id.into()).typed_surface(surface)
}

pub fn head_el(id: impl Into<String>, surface: SiteSurface) -> Component {
    header(id.into()).typed_surface(surface)
}

pub fn foot_el(id: impl Into<String>, surface: SiteSurface) -> Component {
    footer(id.into()).typed_surface(surface)
}

pub fn nav_el(id: impl Into<String>, surface: SiteSurface) -> Component {
    nav(id.into()).typed_surface(surface)
}

pub fn main_el(id: impl Into<String>, surface: SiteSurface) -> Component {
    main(id.into()).typed_surface(surface)
}

/// A run of text (`span`).
pub fn t(id: impl Into<String>, value: impl Into<String>, surface: SiteSurface) -> Component {
    let id = id.into();
    let node = text(value.into()).id(id.clone()).typed_surface(surface);
    if matches!(surface, SiteSurface::Go) {
        node.child(deco(format!("{id}-arrow"), "→", SiteSurface::GoArrowFromLink))
    } else {
        node
    }
}

/// A run of text that takes its parent's look.
pub fn run(id: impl Into<String>, value: impl Into<String>) -> Component {
    text(value.into()).id(id.into())
}

/// A heading.
pub fn h(id: impl Into<String>, level: u8, value: impl Into<String>, surface: SiteSurface) -> Component {
    heading(value.into()).level(level).id(id.into()).typed_surface(surface)
}

/// A paragraph of text.
pub fn p(id: impl Into<String>, value: impl Into<String>, surface: SiteSurface) -> Component {
    let id = id.into();
    paragraph(id.clone(), vec![run(format!("{id}-t"), value)]).typed_surface(surface)
}

/// A link.
pub fn a(id: impl Into<String>, label: impl Into<String>, href: &str, surface: SiteSurface) -> Component {
    let id = id.into();
    let node = link(id.clone(), label, href).typed_surface(surface);
    if matches!(surface, SiteSurface::GoLink) {
        node.child(deco(format!("{id}-arrow"), "→", SiteSurface::GoArrow))
    } else {
        node
    }
}

/// A grouped list, with a checked style for its container and each row.
pub fn ul(id: impl Into<String>, surface: GroupSurface, items: Vec<Component>) -> Component {
    let id = id.into();
    let (container, item_surface) = match surface {
        GroupSurface::Standard => (SiteSurface::Group, SiteSurface::GroupItem),
        GroupSurface::Narrow => (SiteSurface::GroupNarrow, SiteSurface::GroupNarrowItem),
    };
    let mut l = list(id.clone()).typed_surface(container);
    for (i, item) in items.into_iter().enumerate() {
        let item = if i == 0 {
            item
        } else {
            item.child(deco(format!("{id}-{i}-divider"), "", SiteSurface::RowDivider))
        };
        l = l.child(list_item(format!("{id}-{i}")).typed_surface(item_surface).child(item));
    }
    l
}

/// A link whose content is other nodes (a card or a list row), named by
/// that content.
pub fn a_block(id: impl Into<String>, href: &str, surface: SiteSurface) -> Component {
    link(id.into(), "", href).typed_surface(surface)
}

/// A decorative node: hidden from assistive technology.
pub fn deco(id: impl Into<String>, value: impl Into<String>, surface: SiteSurface) -> Component {
    t(id, value, surface).aria_hidden(true)
}

/// The grouped list styles, including their checked row roles.
#[derive(Clone, Copy)]
pub enum GroupSurface { Standard, Narrow }
