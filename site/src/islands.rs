//! The one interactive part of the site, a keel-web island: the contact
//! address with a button that copies it. The rest of every page is static
//! HTML.

use keel_ui::{button, signal, text, Component};
use keel_web::Island;
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
    let copied = signal(false);
    let status = copied.map(|done| if *done { "Copied".to_string() } else { String::new() });
    let address = props.address.clone();
    div("email-row", "email-row")
        .child(a("email-address", props.address.clone(), &format!("mailto:{}", props.address), "email-address"))
        .child(
            button("Copy")
                .id("email-copy")
                .surface("copy")
                .aria_label("Copy the email address")
                .on_press(move |_| {
                    copy_text(&address);
                    copied.set(true);
                }),
        )
        .child(text(status).id("email-status").surface("email-status").aria_live("polite"))
}

#[cfg(target_arch = "wasm32")]
fn copy_text(text: &str) {
    if let Some(window) = web_sys::window() {
        let _ = window.navigator().clipboard().write_text(text);
    }
}

#[cfg(not(target_arch = "wasm32"))]
fn copy_text(_text: &str) {}
