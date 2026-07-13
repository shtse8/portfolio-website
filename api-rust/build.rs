fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut config = prost_build::Config::new();
    config.type_attribute(".", "#[derive(serde::Serialize, serde::Deserialize)]");
    config.type_attribute(".", r#"#[serde(rename_all = "camelCase")]"#);
    config.compile_protos(
        &["portfolio/v1/api.proto", "portfolio/v1/chat.proto"],
        &["../proto"],
    )?;
    Ok(())
}
