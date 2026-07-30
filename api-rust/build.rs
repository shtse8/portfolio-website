use std::path::PathBuf;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let proto_root = manifest_dir.join("../proto");

    // technology-stack-profile: connectrpc-build + buffa (not prost).
    connectrpc_build::Config::new()
        .files(&[
            proto_root.join("portfolio/v1/api.proto"),
            proto_root.join("portfolio/v1/chat.proto"),
        ])
        .includes(&[proto_root.as_path()])
        .include_file("_connectrpc.rs")
        .compile()?;

    Ok(())
}
