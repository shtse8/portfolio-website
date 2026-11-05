//! The scene as a native title, so `keel shot` can capture its poster.

#[cfg(not(target_arch = "wasm32"))]
// keel-migrate: changed: the error is `keel::Error` now (variants per domain crate, `kind()` for the class); `?` on a Keel error still works, an error type Keel does not wrap does not: return `Box<dyn std::error::Error>` from `main` or wrap it in your own type (docs/MIGRATING.md#typed-errors-keelerror-and-errorkind)
fn main() -> keel::Result<()> {
    kylet_scenes::spec("kylet-scenes").run_scenes(kylet_scenes::scenes())?;
    Ok(())
}

#[cfg(target_arch = "wasm32")]
fn main() {}
