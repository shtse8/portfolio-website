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

Vision fixes the destination as **four visitor-visible surfaces, one live data plane, and no form**
(vision.md:13-18). What ships is four sections of one page plus three anchor routes (§2), which is
the same count of surfaces but a different shape.

| # | Vision surface | Vision requirement (cite) | Shipped artifact | Shipped name / route | Verdict |
| --- | --- | --- | --- | --- | --- |
| 1 | Promise (hero) | one repeatable line + live GitHub/npm instruments with `live`/`stale`/`absent` ladder; career numbers excluded (vision.md:15) | Hero.tsx:98-101, HeroProofGrid, LiveTicker, lib/proof-board.ts | `hero`, `/`, "Home" | structure True; instruments cannot be live (§5.1) |
| 2 | Story | five eras Nakuz→MiniMax→Cubeage→Epiow→Sylphx as career context, self-attested pedigree, never `freshness=live` (vision.md:16) | StoryArc.tsx (441 ln) + data/roles.ts + organizations.ts | `story`, `/story`, "Story" | True, one labeling gap (W-1) |
| 3 | Work | explicit-public GitHub facts via `api-rust`; no curated overlay; no second content authority (vision.md:17) | WorkGraph.tsx (542 ln), ProjectCover, context/WorkGraphContext.tsx | `work`, `/work`, "Work" | source True; live False (§5.1) |
| 4 | Act | mailto `hi@kylet.se` + GitHub + LinkedIn + on-site agent; no form; mailto is the no-form Correctness fallback (vision.md:18) | Contact.tsx:19-26, ClaimPack, FloatingAgent.tsx | `contact`, `/contact`, "Contact" | substance True; **name mismatch** (M-1) |

**3.1 Promise.** The live `<h1>` is exactly the repeatable line — "I build the infrastructure AI
agents run on." — which matches vision.md:15 and the `promise` field of the live claim pack
(`"promise":"I build the infrastructure AI agents run on."`). The honesty ladder is implemented in
source: `ProofFreshness = "live" | "stale" | "unavailable"` (lib/proof-board.ts:9), consumed by
LiveTicker (`data-freshness`, stale dot, :87-96, :139-147) and by the baked stats fallback
(lib/stats.ts:8-18, `verifiedAt`). So the vocabulary exists; what is missing is a live producer
(§5.1).

**3.2 Story.** Five roles ship in data/roles.ts — `sylphx-founder` (:9), `epiow-cto` (:43),
`cubeage-founder` (:74), `minimax-ceo` (:121), `nakuz-cto` (:167) — matching the five eras in
vision.md:16, and the live section heading is "Five eras. One builder." Career-scale figures carry
`honesty: "self-attested"` on four entries (roles.ts:100, 148, 193, 201). **Gap W-1:** the Cubeage
entry (roles.ts:74-120) carries no `honesty` label, so one era's pedigree is not marked.

**3.3 Work.** The graph's own policy comment says "GitHub traction, not a curated overlay"
(WorkGraph.tsx:53), the primary grid is "active projects with real GitHub traction (3+ stars)"
(:126) with under-3★/archived repos one click away (:177), and the snapshot it reads is generated
from the sync script (context/WorkGraphContext.tsx:51: "Source of truth: `bun scripts/sync-github-portfolio.mjs`
→ github-portfolio.json"). That is the single-authority shape vision.md:17 asks for; the live
projection is empty (§6), so the surface has nothing live to show.

**3.4 Act.** Contact.tsx ships GitHub (:19), LinkedIn (:20), and `mailto:` (:26), declares "Contact —
AI-native. No form." (:30), and prefers the agent while "always keep[ing] mailto as Correctness
fallback" (:41). FloatingAgent probes `/chat/ready` (:111-114), renders nothing while probing rather
than a false-ready button (:265), and falls back to mailto on failure (:143, :254). Vision calls this
surface **Act**; the code names it `contact` / "Contact" / `/contact` (sections.ts:23). The name is
the only structural disagreement, and it is observable: `https://kylet.se/act` returns 404.

**3.5 Invariant clauses.** *One live data plane:* `api-rust` implements the single JSON REST contract
with 11 routes (api-rust/src/app.rs:246-256), reached on the customer path through the nginx BFF
(nginx.conf:27-106) and the manifest's `path_prefixes` (sylphx.toml). *No form:* the only `<form>` in
`src/` is the agent's text input (FloatingAgent.tsx:439), which is WEB-CHAT, not a contact form.
*No second content authority:* enforced by scripts/check-no-ts-backend.sh and CI (.github/workflows/ci.yml:47).

## 4. Missing Pages & Features

Judged against the destination, not taste. The list is deliberately short: most "missing" pages are
pages the destination forbids.

**M-1 — `/act` has no URL.** vision.md:18 names the fourth surface "Act"; the shipped deep link is
`/contact` (sections.ts:23) and `https://kylet.se/act` is a 404. Because section routes are the
shareable entry points ([...section]/page.tsx:34-36), the canonical surface name and the shipped URL
disagree. This is a decision, not a defect to silently patch — see D-1.

**M-2 — Nothing else is missing by vision text.** `/story`, `/work`, `/contact` all exist live
(§2). A blog, notes, resume, or privacy page is not in the destination; vision.md:29-36 explicitly
rules out "an archive or screenshot catalog as a product path" and any "second content authority",
and WEB-LEGACY records the prior residual 29-screenshot catalog and 2.3k-line `projects.ts` as
`dead` (capabilities.md:28). Adding those paths would move away from the destination.

**M-3 — Candidate, needs an owner call (D-3): a per-repo Work page.** vision.md:27 requires OSS
adopters to be able to "deep-link to the real flagged repo". Today a Work row deep-links off-site to
GitHub and no on-site route renders a single repo; baked art exists for ~48 repos
(`public/art/projects/*`) but no route consumes it. The vision text does not require an on-site repo
page, so this is **not** counted as a missing page — it is flagged because it is the one path a
visitor could reasonably expect and the one that would make the work graph verifiable on-site.

**Feature-level absences (not pages).** No analytics or event instrument of any kind
(`grep -rniE 'gtag|plausible|umami|posthog|vercel/analytics'` over `src/`, `public/`, `next.config.ts`
returns no analytics integration; only a word inside docs/data), no site search, no error-monitoring
client, no `/privacy` page (defensible while nothing is collected), and no structured-data type for
the work graph itself (only Person + WebSite, layout.tsx:101-147).

## 5. Gap Register vs North-Star Oracles

Verdicts are per capability, at both layers. "Source" = this branch's files; "Live" = §6 responses.

### 5.1 WEB-STATS — **False (live)**, True (source, unobserved)

| Requirement (capabilities.md:25) | Live evidence | Verdict |
| --- | --- | --- |
| `/stats` returns live-measured stars/downloads/repos/commits with `freshness=live`+`verifiedAt` | `GET /stats` → `502 error code: 502` (16 B) | **False** |
| `/activity` same, attesting `projectionRevision=github-public-only/v1` | `GET /activity` → `502 error code: 502` | **False** |
| `/projects` / `/recent` carry explicit-public repo facts | `{"projects":[],"updatedAt":"…13:24:46Z"}` / `{"recent":[],…}` | **False** (empty) |
| `/repo` resolves a repo | `/repo?owner=shtse8&name=pdf-reader-mcp` → 404 `{"error":"repo not found"}`; `/repo?name=x` → 504 after 5.06 s | **False** |
| `/downloads` npm series | `{"pkg":"","series":[],"total":0, …}` | **False** (empty) |
| `/claims` snapshot of live instruments | `"metrics":null,"activity":null,"flagship":null` | **False** (no instruments) |
| stats attest `repositoryVisibility=public-only/v1` | source: api-rust/src/rest_projection.rs:26 | True (source) — unreachable live |
| activity attests `projectionRevision=github-public-only/v1` | source: rest_projection.rs:62 + contract.rs:242 | True (source) — unreachable live |
| single JSON REST authority (ADR-169) | app.rs:246-256; no `api/` (scripts/check-no-ts-backend.sh) | **True** |
| stale-on-fail, never-fabricated zeros | empty arrays / `null` are returned rather than invented numbers — but `/stats` returns an edge 502 page, not a stale snapshot | **Unknown** |

Root-cause note: every repository-dependent response is either an edge 5xx or an empty projection,
and `/repo` cannot resolve the site's own flagship `pdf-reader-mcp`. That is consistent with the
GitHub upstream (credential/visibility) failing closed, but Phase 0 did not read api logs, so the
cause is **Unknown** and the impact is what is recorded.

### 5.2 WEB-CHAT — **False (live)**

- `GET /chat/ready` → `{"host":"api.sylphx.ai","model":"sylphx/auto","ready":false,"reason":"missing_or_invalid_gateway_key"}`.
  Fail-closed is the designed behaviour (FloatingAgent.tsx:94, :126), but the oracle's grounded
  `POST /chat` turn cannot pass, so WEB-CHAT is not delivered at `https://kylet.se` (vision.md:46).
- **Manifest drift (evidence-backed):** the same live response reports host `api.sylphx.ai` and model
  `sylphx/auto`, while `sylphx.toml` declares `AI_GATEWAY_BASE_URL = "https://api.models.sylphx.ai/v1"`
  and `AI_MODEL = "deepseek/deepseek-v4.1-flash"`, with comments saying the predecessor host "must not
  come back" and that the `sylphx/auto` router was "retired". The live `/claims` repeats the same
  stale `chat` block. Either the api service is running an older revision or a shadowed secret
  overrides the manifest plain value.
- Source-side oracle parts are present: 5 tools (api-rust/src/tools.rs:212, :224, :249, :261, and
  `npm_downloads` in the same module), rate limits 12/3 min + 60/day + global 500/day
  (contract.rs:20-23), and the gateway credential contract in PROJECT.md/AGENTS.md:4.

### 5.3 WEB-SITE — True (source), **False (live)**

| Requirement (capabilities.md:27) | Evidence | Verdict |
| --- | --- | --- |
| Four surfaces, one page, no form | §3; Contact.tsx:30; only `<form>` is the chat input (FloatingAgent.tsx:439) | **True** |
| Promise states the one line | live `<h1>` = "I build the infrastructure AI agents run on." | **True** |
| …beside live GitHub/npm instruments only | no live instrument exists (§5.1); hero falls back to baked snapshot | **False** |
| Story labelled self-attested, never `freshness=live` | 4 of 5 roles labelled (roles.ts:100,148,193,201); Cubeage unlabelled | **True with W-1** |
| Work is explicit-public GitHub/`api-rust`, no overlay catalog | WorkGraph.tsx:53, :126, :177; WorkGraphContext.tsx:51 | **True (source)** |
| mailto as no-form Correctness fallback | Contact.tsx:26, :41, :78; FloatingAgent.tsx:143, :254 | **True** |

### 5.4 WEB-LEGACY — **True (dead)**

No `api/` authority directory can return without failing the build (scripts/check-no-ts-backend.sh,
run by CI at .github/workflows/ci.yml:47); `api-rust` is the sole API tree; no residual
`projects.ts` or screenshot catalog exists in `src/data/` or `public/`. The nginx BFF proxy blocks
(nginx.conf:27-106) are declared transitional in sylphx.toml ("become dead and can be removed
(ADR-169 follow-up)") — a known cleanup, not a live second authority.

### 5.5 Protected-canary / explicit-public-control oracle — **Unknown**

`grep -rni canary` over the repo returns only prose — vision.md:43, capabilities.md:19,
ADR-169:103, and this document. There is no fixture, test, or code path in this repo that exercises
the redacted protected canary or the paired explicit-public control, and an anonymous client cannot
probe a canary it is not told about. Phase 0 therefore records **Unknown**, not False: the oracle may
be owned outside this repo. It must be closed before WEB-STATS can be called green
(capabilities.md:19).

### 5.6 Gap headline

**The code is ahead of the product.** Source-level structure matches the destination (four surfaces,
single authority, no form, honest vocabulary, a11y basics), while the live layer fails the two oracles
that carry the whole promise: **WEB-STATS is down or empty** (`/stats` 502, `/activity` 502,
`/repo` 404/504, empty `/projects`, `/recent`, `/downloads`, null `/claims` metrics) and **WEB-CHAT
is fail-closed** (`ready:false`), on a deployment whose reported gateway host/model contradict the
manifest on this branch. A visitor can read the promise and cannot verify it (§6).

## 6. Live Checks at kylet.se

Measured from this host on 2026-09-18 ~14:30 BST. `/stats`, `/activity` and `/repo` were each
re-tested twice with identical results. Cloudflare fronts the domain (`server: cloudflare`).

**Pages**

```text
/         => 200 106130 0.323s | <title>Kyle Tse — AI infrastructure builder</title> | robots index, follow | canonical https://kylet.se/
/story    => 200 105881 0.183s | <title>Story — Kyle Tse</title> | robots noindex, follow | canonical https://kylet.se/
/work     => 200 105873 0.194s | <title>Work — Kyle Tse</title> | robots noindex, follow | canonical https://kylet.se/
/contact  => 200 105897 0.093s | <title>Contact — Kyle Tse</title> | robots noindex, follow | canonical https://kylet.se/
/act      => 404  17042 0.088s | <title>Kyle Tse — AI infrastructure builder</title> (404 shell)
/resume /blog /notes /console /login /privacy => 404, 17042 B (404 shell)
/does-not-exist => 403, 15 B (no body) — edge-level refusal, not the 404 shell
```

**API**

```text
/healthz   => 200 | ok
/stats     => 502 | error code: 502
/activity  => 502 | error code: 502
/projects  => 200 | {"projects":[],"updatedAt":"2026-09-18T13:24:46.662410966Z"}
/recent    => 200 | {"recent":[],"updatedAt":"2026-09-18T13:24:47.444254045Z"}
/downloads => 200 | {"pkg":"","series":[],"total":0,"updatedAt":"2026-09-18T13:24:47.602037884Z"}
/repo?name=x => 504 after 5.06s | error code: 504
/repo?owner=shtse8&name=pdf-reader-mcp => 404 | {"error":"repo not found"}
/claims    => 200 | {"activity":null,…,"chat":{"host":"api.sylphx.ai","model":"sylphx/auto","ready":false,"reason":"missing_or_invalid_gateway_key"},"flagship":null,"metrics":null,…}
/chat/ready=> 200 | {"host":"api.sylphx.ai","model":"sylphx/auto","ready":false,"reason":"missing_or_invalid_gateway_key"}
```

**Edge / head**

```text
robots.txt => 200, 62 B: "User-agent: *\nAllow: /\n\nSitemap: https://kylet.se/sitemap.xml"
sitemap.xml => 200, ONE <url>: https://kylet.se/ , lastmod 2026-08-09, changefreq monthly, priority 1.0
headers: content-security-policy (default-src 'self' …), strict-transport-security max-age=31536000,
         x-frame-options DENY, x-content-type-options nosniff, referrer-policy strict-origin-when-cross-origin,
         permissions-policy camera=(), microphone=(), geolocation=(); last-modified Fri, 11 Sep 2026 22:39:01 GMT
no content-encoding advertised on / (HTML served uncompressed); 1 CSS chunk; 15 JS chunks + theme-init.js;
30 <script> tags; 3 woff2 preloads + 5 low-priority script preloads
```

**Note on the single-URL sitemap.** This is **by design, not drift**: the section routes set
`robots: { index: false }` and canonical `/` (src/app/[...section]/page.tsx:34-42), and the
committed `public/sitemap.xml` intentionally lists only `/`. It becomes a defect only if the
rebuild decides those surfaces should be indexable (D-2).

## 7. Visual / UX Critique (grounded in markup and CSS)

Three of the four owner complaints (dull visuals, over-systematic/inhuman UX, too little
information per page) map onto decisions the code states as doctrine. The critique therefore names
the doctrine first — otherwise a redesign fights the design system.

**7.1 "Dull visuals" is written policy, not an accident.**
- The design-system header is literal: `SIGNAL & CRAFT — design system · Balanced type · one accent ·
  quiet depth · no gimmicks` (src/app/globals.css:5-9).
- The hero says `no generative AI art` and builds its whole atmosphere from a CSS grid plus two
  blurred accent circles (Hero.tsx:62-67).
- Imagery is explicitly forbidden in cells: "Ambient art is blended via absolute layers + gradients
  in components. No framed thumbnail cells — art dissolves into surfaces." (globals.css:177-178).
- The type scale is capped modestly: `.text-display` is `clamp(2.25rem, 5.2vw, 3.5rem)`
  (globals.css:168-172); one accent colour, OKLCH `0.52 0.19 268` (globals.css:19); card and button
  treatments are quiet (globals.css:190-205).
- Consequence: "make the visuals less dull" is a **doctrine change** (D-4), not a CSS pass. It also
  explains the "over-systematic" feel: every surface is the same card + chip + mono-eyebrow grammar.

**7.2 The shipped HTML has no chrome.**
`Header` returns `null` until mounted (Header.tsx:43). Measured on the live document: **zero
`<header>` elements, no `aria-label="Primary"`, no "Toggle menu"** — the fixed header, nav, GitHub
link, theme switch and hamburger exist only after hydration. `AppShell` does ship the skip link and
`<main>` in static HTML (AppShell.tsx:18-27), so a keyboard visitor can skip to content but cannot
navigate; a no-JS visitor gets a hero and no wayfinding. The 404 shell (17 KB) ships without any of
the nine sections, so recovery is visually a different site.

**7.3 Copy and affordances that the live layer cannot honour.**
- **Four hero CTAs of near-equal weight** — "Explore the work" (primary), GitHub (secondary),
  "Ask my AI" (ghost), "Get in touch" (ghost) (Hero.tsx:121-151). With WEB-CHAT fail-closed,
  "Ask my AI" is a dead affordance: FloatingAgent renders nothing rather than a false-ready button
  (FloatingAgent.tsx:265), so the primary Act path silently disappears.
- **A hover-worded instruction on a touch device:** "Hover a number to see what it's made of."
  (Hero.tsx:214-216). The cards are real buttons and focus does raise the highlight
  (HeroProofGrid.tsx:64-72: `onMouseEnter`/`onFocus` → `onHover`, `onBlur` resets), so keyboard
  parity exists — but on touch, `onClick` jumps to Work (Hero.tsx:186-190) and the explanation is
  never revealed. The hint describes an interaction the device cannot perform.
- **A live claim with no live source:** when no recent event exists the board footer reads
  "actively shipping — live GitHub activity on this board" (Hero.tsx:209) while `/recent` is empty
  and `/stats` returns 502. The freshness chip itself is honest and cannot claim `live` unless the
  graph is live *and* the stats may claim live (lib/proof-board.ts:41-71) — the sentence is the
  dishonest part.
- **An agent promise the live site cannot keep:** "No forms to fill — just tell my AI what you
  need. It'll ask the right questions and draft the email for you." (Contact.tsx:59).
- **The visitor never sees the product's own nouns:** nav labels ship as Home/Story/Work/Contact
  (sections.ts:20-23) while the destination names the surfaces Promise/Story/Work/Act (vision.md:15-18).

**7.4 "Pages show too little information" is structural.**
Live document structure is 1 `<h1>`, 4 `<h2>` ("Let's build something.", "Five eras. One builder.",
"Tools with proof — open a product.", "Let's talk.") and 23 `<h3>` — but depth lives in dialogs
(WorkGraph.tsx:361-363, StoryArc.tsx:304-306), and there are only three extra URLs, all anchors of
the same 106 KB document (§2). There is nowhere to put more information that a visitor can link to,
share, or have indexed. That is the IA gap behind the complaint (M-3, D-2, D-3).

**7.5 One wording tension with the work graph's authority.** The Work section heading is "Tools with
proof — open a product." (live `<h2>`), while vision.md:17 defines Work as explicit-public GitHub
facts and forbids a curated overlay. "Open a product" reads as curated-catalog language; it should
match the graph's actual authority.

## 8. SEO, Metadata, Structured Data

**Present and correct (source + live).** `<title>`, meta description, keywords, authors, creator,
`robots: index, follow`, canonical `/`, full OpenGraph block (type/locale/url/title/description/
siteName + 1200×630 image with alt) and Twitter `summary_large_image` with `creator: @kyletse`
(layout.tsx:51-99); `lang="en"` (:156); manifest, icons, per-scheme theme-color (:41-49, :161-163);
Person and WebSite JSON-LD (:101-147).

**Correction to the brief's live facts.** The document contains **2** `<script type="application/ld+json">`
elements (Person, WebSite), not 4: `grep -o 'application/ld+json' | wc -l` returns 4 because the same
two scripts also appear escaped inside the RSC flight payload. Verified:
`grep -o '<script type="application/ld+json"' | wc -l` → 2.

**Findings.**
- S-1 **One indexable URL, by design.** `/story`, `/work`, `/contact` ship `noindex, follow` with
  canonical `https://kylet.se/` (source: [...section]/page.tsx:34-42; verified live). `public/sitemap.xml`
  is a static file listing only `/` (lastmod 2026-08-09); there is no `src/app/sitemap.ts` or
  `robots.ts` generator. `public/robots.txt` (62 B) allows everything and declares the sitemap. So the
  single-URL sitemap is **not drift** — it is the current IA decision, and it caps discoverability at
  one document (D-2).
- S-2 **404s inherit the site title.** `/resume`, `/blog`, `/act` etc. return
  `<title>Kyle Tse — AI infrastructure builder</title>`, `noindex`, canonical `/`, and the 404 shell
  (17,042 B, measured). `not-found.tsx` is a client component with its own copy ("This page drifted
  off.") but no metadata export, so the title and description a crawler or screen reader reports are
  the home page's.
- S-3 **The work graph is invisible to structured data.** Only Person and WebSite ship; there is no
  `ItemList`/`SoftwareSourceCode`/`CreativeWork` for the repos the site already has art and data for
  (`public/art/projects/*`, ~48 covers; `src/data/github-portfolio.json`).
- S-4 **No hreflang** (0 occurrences live) on an English-only site — acceptable today, relevant if D-7
  adds a Chinese surface (a common cohort for this audience).
- S-5 **Anomalous edge response:** `GET /does-not-exist` → `403` with a 15-byte body and no HTML,
  while `/resume` → the styled 404. Two different not-found behaviours on the same host (Cloudflare
  rule vs nginx `try_files … =404`, nginx.conf:117) — worth confirming during Phase 5.
- S-6 `og-image.jpeg` is 116,623 B in `public/` (fine for crawlers, irrelevant to page weight).

## 9. Performance & Core Web Vitals Signals

No field data was available in Phase 0, so real CWV are **Unknown**; these are transfer-shape
measurements.

| Measurement | Value |
| --- | --- |
| `GET /` | 200, 105,892 B HTML uncompressed, br-encoded (`content-encoding: br`, `vary: accept-encoding`), 0.32 s total |
| `/story` `/work` `/contact` | 200, 105,881 / 105,873 / 105,897 B, 0.18 / 0.19 / 0.09 s |
| JS chunk requests on `/` | 19, 329,727 B compressed transfer total |
| CSS | 1 chunk, 11,817 B compressed |
| Fonts | 3 woff2 preloads, 123,472 B total |
| Other hints | 5 additional low-priority script preloads; 30 `<script>` tags; immutable 1-year caching for hashed assets (nginx.conf:120-122) |

- Cold load is roughly **0.45 MB of assets + 106 KB HTML** before the app is interactive.
- Client dependency weight (package.json:26-38): `framer-motion`, `@ai-sdk/react`, `ai`,
  `react-markdown`, `remark-gfm`, `zustand`, `date-fns`, `react-icons` — all shipped to the browser
  for a site whose stated shape is "the least system" (vision.md:13). No bundle analysis was run, so
  per-package attribution is a **hypothesis**, not a measurement.
- LCP candidate is text: the hero has no image (Hero.tsx:63-67 is CSS gradients plus `bg-grid`), which
  is favourable. The header mounting after hydration (Header.tsx:43) is a paint/layout event rather
  than a network cost, but it means first paint has no nav.
- Unknown: real LCP/CLS/INP, mobile network behaviour, CrUX field data, and whether the four
  near-identical 106 KB documents are ever re-fetched (client-side DeepLink navigation should prevent
  it; not verified in a browser).

## 10. Accessibility (WCAG 2.2 AA basics)

**Source-level positives (evidence).** Skip link + `<main tabIndex={-1}>` (AppShell.tsx:18-27); global
`:focus-visible` outline (globals.css:133-137); `prefers-reduced-motion` override (globals.css:74-88)
plus per-component reduce paths (Hero.tsx:20,25-40; hooks/useCountUp.ts:22-24; components/ui/Reveal.tsx:8);
dialogs with `role="dialog"`, `aria-modal="true"`, `aria-labelledby` (StoryArc.tsx:304-306,
WorkGraph.tsx:361-363) and Escape-to-close (StoryArc.tsx:48-53, WorkGraph.tsx:94-101); `sr-only` text
(ThemeSwitch.tsx:121, StoryArc.tsx:274); `aria-label`s on icon-only controls (Header.tsx:103,114,
ThemeSwitch.tsx:181); pinch-zoom explicitly allowed (layout.tsx:41-44); 28/28 images carry `alt`
(measured on the live document).

**Gaps.**
- **A-1 Theme chooser exposes no state.** The three options render selection only through colour
  classes (ThemeSwitch.tsx:132-169) — no `aria-pressed`/`role="radiogroup"`/`aria-checked`
  (WCAG 4.1.2, 1.4.1).
- **A-2 Touch parity on the proof board.** The reveal is mouse/focus only; touch taps navigate away
  (§7.3). The on-screen hint asks for a hover.
- **A-3 Inconsistent announcement of instrument updates.** `role="status"` appears on the ticker
  (LiveTicker.tsx:80) but there is no `aria-live` anywhere in `src/` (grep: 0 hits), and the hero
  freshness chip is a plain `<span>` (Hero.tsx:162-183).
- **A-4 404 has the wrong accessible name** (§8, S-2).
- **A-5 Contrast — estimate, needs measurement.** `--text-tertiary` is OKLCH L 0.58 on L 0.985 (light)
  and L 0.54 on L 0.14 (dark) (globals.css:20-22, :49-51) and is used at 10.5-11px
  (globals.css:158; Hero.tsx:159,163,201,214). Treating OKLab L as ≈ cube root of relative luminance,
  light ≈ 4.1:1 and dark ≈ 3.9:1 — both under AA 4.5:1 for normal text. **This is arithmetic from
  tokens, not a rendered measurement**; confirm with a contrast tool before treating it as a defect.
- **Unknown:** no axe/Lighthouse run, no keyboard-only walkthrough, no screen-reader pass was
  performed in Phase 0, so nothing above is a substitute for an audit run.

## 11. Analytics, Events, Search, Error Monitoring

- **No analytics of any kind.** `grep -rniE 'gtag|googletagmanager|plausible|umami|posthog|vercel/analytics'`
  over `src/`, `public/`, `next.config.ts` returns no integration (one incidental word match in
  `src/data/roles.ts` prose).
- **No product-oracle instrument.** The destination's oracle is behavioural — state, verify, act in one
  short session (vision.md:40-48) — yet nothing measures a mailto click, a work-graph open, or a chat
  turn. There is no way to tell whether the promise lands.
- **No site search** and **no client error monitoring**: `ErrorBoundary` catches render errors in
  sections (app/page.tsx:13-17,55) but reports nowhere — it renders a fallback and stops.
- **CSP constrains any future instrument:** `connect-src 'self'` and `script-src 'self' 'unsafe-inline'`
  (nginx.conf:15), so a third-party analytics script is blocked by policy today. Any instrument must be
  same-origin or the CSP must change deliberately.
- No `/privacy` page exists, which is defensible while nothing is collected — and becomes a
  compliance task the moment an instrument lands (D-6).

## 12. Design-System & IA Decisions Required First

| ID | Decision | Evidence / why it blocks |
| --- | --- | --- |
| **D-1** | Is the fourth surface named **Act** (vision.md:18) or **Contact** (sections.ts:23)? Rename the route, alias it, or amend the vision. | `https://kylet.se/act` is a 404 today; the visitor-facing nav never says "Act". |
| **D-2** | Keep a single indexable page, or make Story/Work/Act indexable with their own titles, canonicals and sitemap entries? | Live `noindex, follow` + canonical `/` (§8 S-1); IA is frozen by this choice. |
| **D-3** | May the Work surface have an on-site per-repo page? vision.md:27 wants an adopter to "deep-link to the real flagged repo"; vision.md:35 forbids "an archive or screenshot catalog as a product path". | Determines whether `public/art/projects/*` (~48 covers) ever has a consumer, and whether the graph is verifiable on-site (M-3). |
| **D-4** | How far may the rebuild revise the design doctrine ("Balanced type · one accent · quiet depth · no gimmicks", globals.css:5-9; "no generative AI art", Hero.tsx:62)? | The "dull visuals" complaint contradicts written doctrine; without this call, visual work is fought by the system. |
| **D-5** | Who restores the live data plane (GitHub upstream + gateway credential) and resolves the manifest/live drift? | `src/` cannot fix §5.1/§5.2; `/stats` 502, `/activity` 502, `/repo` 404/504, `/chat/ready` `ready:false` on host `api.sylphx.ai`/model `sylphx/auto` against a manifest that declares `api.models.sylphx.ai`/`deepseek/deepseek-v4.1-flash`. |
| **D-6** | Adopt a (CSP-compatible, cookieless) instrument and, if so, ship `/privacy`? | §11; otherwise the product oracle stays unmeasurable. |
| **D-7** | Is a Chinese-language surface in scope? | `lang="en"`, 0 hreflang; audience is HK + London (personal.ts:11; LinkedIn/GitHub). Affects IA before freeze. |

## 13. Phased Implementation Plan

## 14. Blockers & Owning Authority

## 15. Appendix — Raw Evidence

