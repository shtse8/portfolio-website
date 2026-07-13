use std::process::{Command, Stdio};
use std::time::Duration;

#[test]
fn healthz_returns_ok_on_real_binary() {
    let bin = env!("CARGO_BIN_EXE_kylet-api-rust");
    let port = 39081u16;
    let mut child = Command::new(bin)
        .env("PORT", port.to_string())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .expect("spawn kylet-api-rust");

    let url = format!("http://127.0.0.1:{port}/healthz");
    let mut last = None;
    for _ in 0..20 {
        std::thread::sleep(Duration::from_millis(100));
        let output = Command::new("curl").args(["-sf", &url]).output();
        match output {
            Ok(out) if out.status.success() => {
                let body = String::from_utf8_lossy(&out.stdout).trim().to_string();
                let _ = child.kill();
                let _ = child.wait();
                assert_eq!(body, "ok");
                return;
            }
            Ok(out) => {
                last = Some(format!(
                    "status={:?} stderr={}",
                    out.status,
                    String::from_utf8_lossy(&out.stderr)
                ))
            }
            Err(e) => last = Some(format!("curl spawn err: {e}")),
        }
    }
    let _ = child.kill();
    let _ = child.wait();
    panic!("healthz not ready after retries: {last:?}");
}
