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
    let status = signal(String::new());
    let copying = signal(false);
    let address = props.address.clone();
    div("email-row", "email-row")
        .child(a("email-address", props.address.clone(), &format!("mailto:{}", props.address), "email-address"))
        .child(
            button("Copy")
                .id("email-copy")
                .surface("copy")
                .aria_label("Copy the email address")
                .on_press(move |_| {
                    if copying.get() {
                        return;
                    }
                    copying.set(true);
                    status.set("Copying…".into());
                    copy_text(&address, move |copied| {
                        status.set(if copied { "Copied" } else { "Copy failed" }.into());
                        copying.set(false);
                    });
                }),
        )
        .child(text(status).id("email-status").surface("email-status").aria_live("polite"))
}

#[cfg(target_arch = "wasm32")]
fn copy_text(text: &str, done: impl FnOnce(bool) + 'static) {
    let Some(window) = web_sys::window() else {
        done(false);
        return;
    };
    // Start the clipboard request during the trusted press, then report its
    // result. A denied request must not announce a successful copy.
    let clipboard = window.navigator().clipboard();
    if clipboard.is_undefined() || clipboard.is_null() {
        done(false);
        return;
    }
    let result = clipboard.write_text(text);
    wasm_bindgen_futures::spawn_local(async move {
        done(wasm_bindgen_futures::JsFuture::from(result).await.is_ok());
    });
}

#[cfg(not(target_arch = "wasm32"))]
fn copy_text(_text: &str, done: impl FnOnce(bool) + 'static) {
    done(false);
}
