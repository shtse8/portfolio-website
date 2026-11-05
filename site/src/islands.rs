//! The one interactive part of the site, a keel-web island: the contact
//! address with a button that copies it. The rest of every page is static
//! HTML.

use keel::platform::system_clipboard;
use keel::ui::{button, load_on, Component, LoadSpec, LoadState, text};
use keel::web::Island;
use serde::{Deserialize, Serialize};

use crate::content;
use crate::ui::*;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct EmailProps {
    pub address: String,
}

/// The address as a mail link, and a Copy button that reports what it did.
pub const EMAIL: Island<EmailProps> = Island::new("email", email_view);

pub fn email() -> Component {
    EMAIL.render("email", &EmailProps { address: content::EMAIL.into() })
}

fn email_view(props: &EmailProps) -> Component {
    let address = props.address.clone();
    let copy = load_on(LoadSpec::local().on_demand(), move |_| {
        // Begin in the trusted press; observe actual host completion.
        system_clipboard().begin_write_text(&address)
    });
    let state = copy.state();
    div("email-row", SiteSurface::EmailRow)
        .child(a("email-address", props.address.clone(), &format!("mailto:{}", props.address), SiteSurface::EmailAddress))
        .child(
            button("Copy")
                .id("email-copy")
                .typed_surface(SiteSurface::Copy)
                .aria_label("Copy the email address")
                .on_press(move |_| {
                    if !matches!(copy.state().get(), LoadState::Pending) {
                        copy.retry();
                    }
                }),
        )
        .child(text(move || match state.get() {
            LoadState::Idle => "",
            LoadState::Pending => "Copying…",
            LoadState::Ready(()) => "Copied",
            _ => "Copy failed",
        }.to_string()).id("email-status").typed_surface(SiteSurface::EmailStatus).aria_live("polite"))
}

