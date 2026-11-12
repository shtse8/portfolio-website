//! The site's server and exporter: `serve` renders pages per request,
//! `export DIR` writes the static site (`keel pack` runs it).

#[cfg(not(target_arch = "wasm32"))]
fn main() -> std::process::ExitCode {
    keel_web::cli(kylet_site::site())
}

#[cfg(target_arch = "wasm32")]
fn main() {}
