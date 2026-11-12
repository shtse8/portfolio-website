//! Thin constructors over keel-ui nodes for this site.
//!
//! Each node is styled as a surface role of the site's theme
//! (`theme.rs`): keel-web draws the role from one class rule.

use keel_ui::{
    box_node, footer, header, heading, link, list, list_item, main, nav, paragraph, section,
    text, Component,
};

/// A block (`div`).
pub fn div(id: impl Into<String>, surface: &str) -> Component {
    box_node(id.into()).surface(surface)
}

/// A `section` landmark.
pub fn sect(id: impl Into<String>, surface: &str) -> Component {
    section(id.into()).surface(surface)
}

pub fn head_el(id: impl Into<String>, surface: &str) -> Component {
    header(id.into()).surface(surface)
}

pub fn foot_el(id: impl Into<String>, surface: &str) -> Component {
    footer(id.into()).surface(surface)
}

pub fn nav_el(id: impl Into<String>, surface: &str) -> Component {
    nav(id.into()).surface(surface)
}

pub fn main_el(id: impl Into<String>, surface: &str) -> Component {
    main(id.into()).surface(surface)
}

/// A run of text (`span`).
pub fn t(id: impl Into<String>, value: impl Into<String>, surface: &str) -> Component {
    text(value.into()).id(id.into()).surface(surface)
}

/// A run of text that takes its parent's look.
pub fn run(id: impl Into<String>, value: impl Into<String>) -> Component {
    text(value.into()).id(id.into())
}

/// A heading.
pub fn h(id: impl Into<String>, level: u8, value: impl Into<String>, surface: &str) -> Component {
    heading(value.into()).level(level).id(id.into()).surface(surface)
}

/// A paragraph of text.
pub fn p(id: impl Into<String>, value: impl Into<String>, surface: &str) -> Component {
    let id = id.into();
    paragraph(id.clone(), vec![run(format!("{id}-t"), value)]).surface(surface)
}

/// A link.
pub fn a(id: impl Into<String>, label: impl Into<String>, href: &str, surface: &str) -> Component {
    link(id.into(), label, href).surface(surface)
}

/// An unordered list of already built items; each item is styled as
/// `<surface>-item`.
pub fn ul(id: impl Into<String>, surface: &str, items: Vec<Component>) -> Component {
    let id = id.into();
    let mut l = list(id.clone()).surface(surface);
    for (i, item) in items.into_iter().enumerate() {
        l = l.child(list_item(format!("{id}-{i}")).surface(format!("{surface}-item")).child(item));
    }
    l
}

/// A link whose content is other nodes (a card or a list row), named by
/// that content.
pub fn a_block(id: impl Into<String>, href: &str, surface: &str) -> Component {
    link(id.into(), "", href).surface(surface)
}

/// A decorative node: hidden from assistive technology.
pub fn deco(id: impl Into<String>, value: impl Into<String>, surface: &str) -> Component {
    t(id, value, surface).aria_hidden(true)
}
