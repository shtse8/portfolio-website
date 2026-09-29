# kylet.se capabilities

Vision: [vision.md](vision.md). Status is what a live check measured.

| ID | Capability | Status | Code | Depends on |
| --- | --- | --- | --- | --- |
| WEB-SITE | The four pages (`/`, `/about`, `/colophon`, not found), the redirects and the 410s. Done when kylet.se serves the Keel pages, every fact matches `design/content.md`, axe finds nothing, nothing scrolls sideways at 320 px, and Lighthouse mobile is 95 or better | blocked-on-platform: built and passing CI; the old site is still live until the image build can read the private Keel repository (SylphxAI/cloud#9149) | `site/`, `nginx.conf`, `hosting/` | Sylphx Hosting build secrets |
| WEB-SCENE | The live Keel scene in the home hero. The poster shows at once, the scene starts on first interaction and keeps its box, and reduced motion keeps the poster with a Play button | blocked-on-platform: same deploy | `scenes/`, `site/src/pages.rs` | WEB-SITE |
| WEB-CONTACT | The contact island: the address and a Copy button that puts hi@kylet.se on the clipboard and says so | blocked-on-platform: same deploy | `site/src/islands.rs` | WEB-SITE |
| WEB-STATS | Live GitHub and npm figures | retired ([ADR-170](adr/ADR-170-keel-site-api-retired.md)) | | |
| WEB-CHAT | The on-site AI agent | retired ([ADR-170](adr/ADR-170-keel-site-api-retired.md)) | | |
