//! The scene as a native title, so `keel shot` can capture its poster.

#[cfg(not(target_arch = "wasm32"))]
fn main() -> keel::Result<()> {
    kylet_scenes::spec("kylet-scenes").run_scenes(kylet_scenes::scenes())?;
    Ok(())
}

#[cfg(target_arch = "wasm32")]
fn main() {}
