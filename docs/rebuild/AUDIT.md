# kylet.se Rebuild — Phase 0 Audit & Plan

Status: in progress (Phase 0). Branch: `docs/phase0-rebuild-audit`. Do not merge.

Authority for this document: `docs/vision.md` + `docs/capabilities.md` (North Star), repo law in
`AGENTS.md` / `PROJECT.md` / ADR-168 / ADR-169, and live evidence from https://kylet.se.
Every claim carries file:line or quoted command output. Unknown is recorded as Unknown.

## 1. Method & Evidence Sources


**Authority, in priority order.** `docs/vision.md` owns the destination: four visitor-visible
surfaces (vision.md:15-18), the "no second content authority" rule (vision.md:29-36), repository
publication authority (vision.md:22), and the product oracle a visitor must be able to run
(vision.md:40-48). `docs/capabilities.md` owns the identity graph: WEB-STATS (capabilities.md:25),
WEB-CHAT (:26), WEB-SITE (:27), WEB-LEGACY (:28), publication authority (:17-19). Field law is
`src/`, `api-rust/src/contract.rs`, `sylphx.toml`, `nginx.conf` (capabilities.md:9). Repo law is
`PROJECT.md`, `AGENTS.md`, ADR-169.

**Evidence layers.** Every claim below is tagged with the layer it came from:

| Layer | How it was read | Status |
| --- | --- | --- |
| Source | worktree `kylet-se-phase0` at `0ab4cea`, branch `docs/phase0-rebuild-audit` | read |
| Live | `curl` against https://kylet.se on 2026-09-18 ~14:30 BST (Cloudflare fronted) | measured |
| Build/test | `bun run check`, `bun test`, `cargo test`, `bun run build` | **not run in Phase 0** → build-dependent claims are Unknown |

**Method.** Routes were enumerated from `src/app/` and `src/config/sections.ts`, not from the
rendered site. Each capability oracle was walked twice: once against source, once against the live
layer. A gap is recorded True / False / **Unknown**, with `file:line` or a quoted response body.
Where Phase 0 did not run a check, the gap is Unknown, never assumed.

**Method caveat.** This audit did not build the site, so nothing here depends on a local export.
Live measurements were taken from a single host and single point in time; 502/504 responses were
re-tested twice with the same result (see §6) but remain a point-in-time observation.

**Raw evidence** for every number is quoted in §6 and §15.

## 2. Actual Inventory — routes and pages as shipped

One page component tree is the whole site: `/` renders Hero → StoryArc → WorkGraph →
Contact + ClaimPack, plus Header/Footer/FloatingAgent chrome (src/app/page.tsx:83-108).

| Route | Source of truth | Live (2026-09-18) | `<title>` | Robots | User job today |
| --- | --- | --- | --- | --- | --- |
| `/` | src/app/page.tsx | 200, 106,130 B, 0.32 s | Kyle Tse — AI infrastructure builder | `index, follow` | State the promise; scan hero instruments; scroll story/work; act |
| `/story` | src/app/[...section]/page.tsx | 200, 105,881 B | Story — Kyle Tse | `noindex, follow`, canonical `/` | Deep-link to career context |
| `/work` | src/app/[...section]/page.tsx | 200, 105,873 B | Work — Kyle Tse | `noindex, follow`, canonical `/` | Deep-link to the work graph |
| `/contact` | src/app/[...section]/page.tsx | 200, 105,897 B | Contact — Kyle Tse | `noindex, follow`, canonical `/` | Deep-link to act/mailto |
| (unknown path) | src/app/not-found.tsx | 404, 17,042 B, home `<title>` | inherited | `noindex` | Recover to home |
| `/act` | — none — | 404 | inherited | `noindex` | **Does not exist** (vision calls this surface "Act") |
| `/resume` `/blog` `/notes` `/console` `/login` `/privacy` | — none — | 404 | inherited | `noindex` | Do not exist |

**Structural facts that matter for the rebuild**

1. **The route set is derived, not designed page-by-page.** `SECTIONS` (src/config/sections.ts:19-24)
   is `hero(/) · story(/story) · work(/work) · contact(/contact)`; `VALID_URL_SECTIONS` drops only
   `hero` (sections.ts:28-30 → src/lib/constants.ts:9-10). There is no route for a repo, a project,
   a write-up, or a claim.
2. **`/story`, `/work`, `/contact` are not pages — they are anchors of `/`.** They render the same
   component tree and call `window.history.replaceState` + `scrollIntoView` after 250 ms
   (src/app/page.tsx:63-80). Their HTML is a byte-for-byte near-duplicate of `/` (105.9 KB vs 106.1 KB),
   so the export ships the whole one-page app four times.
3. **Deduplication is deliberate.** The route's `generateMetadata` sets
   `robots: { index: false, follow: true }` and `alternates: { canonical: "/" }`
   (src/app/[...section]/page.tsx:34-42), and layout.tsx:74 sets `index, follow` with a root canonical
   (layout.tsx:75). Live readings confirm this is what shipped: `noindex, follow` + canonical
   `https://kylet.se/` on all three section routes.
4. **The 404 page is invisible to crawlers and carries the site title.** `/resume` returns
   `<title>Kyle Tse — AI infrastructure builder</title>` (inherited from layout), `noindex`, and the
   404 UI from src/app/not-found.tsx:6-31.
5. **Component inventory (21 files, ~3.6k LOC of `src/components`):** chrome — Header, Footer,
   AppShell, FloatingAgent (chat), ThemeSwitch, ErrorBoundary, LoadingSpinner, Reveal, SectionHeader,
   Markdown, DeepLink; hero — Hero, HeroProofGrid, LiveTicker; story — StoryArc, CompanyLogo;
   work — WorkGraph, ProjectCover; act — Contact, ClaimPack. Data comes from `src/data/*.ts` +
   `src/data/{github-portfolio,stats-baked}.json` (baked) and live calls through `src/lib/api.ts`
   (same-origin BFF, api.ts:11-20).

## 3. Target IA — Promise / Story / Work / Act

## 4. Missing Pages & Features

## 5. Gap Register vs North-Star Oracles

### 5.1 WEB-SITE

### 5.2 WEB-STATS

### 5.3 WEB-CHAT

### 5.4 WEB-LEGACY

### 5.5 Protected-canary / explicit-public-control oracle

## 6. Live Checks at kylet.se

## 7. Visual / UX Critique (grounded in markup and CSS)

## 8. SEO, Metadata, Structured Data

## 9. Performance & Core Web Vitals Signals

## 10. Accessibility (WCAG 2.2 AA basics)

## 11. Analytics, Events, Search, Error Monitoring

## 12. Design-System & IA Decisions Required First

## 13. Phased Implementation Plan

## 14. Blockers & Owning Authority

## 15. Appendix — Raw Evidence

