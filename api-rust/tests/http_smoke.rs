use std::process::{Command, Stdio};
use std::time::Duration;

#[test]
fn healthz_returns_ok_on_real_binary() {
    let bin = env!("CARGO_BIN_EXE_kylet-api-rust");
    let mut child = Command::new(bin)
        .env("PORT", "39081")
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .expect("spawn kylet-api-rust");

    std::thread::sleep(Duration::from_millis(400));

    let output = Command::new("curl")
        .args(["-sf", "http://127.0.0.1:39081/healthz"])
        .output()
        .expect("curl healthz");

    let _ = child.kill();
    assert!(output.status.success(), "curl failed: {:?}", output);
    assert_eq!(String::from_utf8_lossy(&output.stdout).trim(), "ok");
}