# kylet.se identity graph

**Scope:** kylet.se. **Vision:** [`vision.md`](vision.md). Cite the **ID** column.

| ID | Identity | Fate | Status | Code | Done when |
| --- | --- | --- | --- | --- | --- |
| WEB-SITE | The four pages (`/`, `/about`, `/colophon`, not found), the redirects and 410s | live | Built and checked (#86); deploy waits on SylphxAI/cloud#9149 | `site/`, `nginx.conf`, `hosting/` | https://kylet.se serves the Keel pages; every fact matches `design/content.md`; axe finds nothing and nothing scrolls sideways at 320 px, in light and dark; Lighthouse mobile is 95 or better. |
| WEB-SCENE | The live Keel scene in the home page hero | live | Built (#86) | `scenes/`, `site/src/pages.rs` | The poster shows at once; the scene starts on the first interaction and keeps its box; reduced motion keeps the poster with a Play button. |
| WEB-CONTACT | The contact island: the address and a Copy button | live | Built (#86) | `site/src/islands.rs` | The island loads near the viewport; Copy puts hi@kylet.se on the clipboard and says so. |
| WEB-STATS | Live GitHub and npm figures (`api-rust`) | dead | Retired 2026-09-28 ([ADR-170](adr/ADR-170-keel-site-api-retired.md)) | — | Its paths answer 410. |
| WEB-CHAT | The on-site AI agent | dead | Retired 2026-09-28 ([ADR-170](adr/ADR-170-keel-site-api-retired.md)) | — | Its paths answer 410. |
