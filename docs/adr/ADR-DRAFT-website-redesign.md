---
slug: website-redesign
title: Portfolio Website Redesign — Founder-Builder Narrative + Editorial-Minimal Design System
status: Proposed (Draft)
date: 2026-06-27
deciders: Kyle Tse (direction/taste), Claude (execution/architecture)
tags: [frontend, design-system, information-architecture, ux, portfolio]
supersedes: []
---

# Portfolio Website Redesign — Founder-Builder Narrative + Editorial-Minimal Design System

> **Draft note (ADR convention):** This file is authored as `ADR-DRAFT-website-redesign.md`
> during design (doc-first). On PR open, GitHub allocates number **N**; rename to
> `ADR-N-website-redesign.md` and update the heading. The slug `website-redesign` is the
> stable, co-equal identity.

## Status

**Proposed (Draft)** — pending external GPT review (local Codex gate) and Kyle's approval.

## TL;DR

Rebuild the portfolio around **one legible story in 10 seconds**: *Kyle Tse is a serial
technical founder-builder who has repeatedly shipped products to 10M-scale across four
technology eras, and is now building in the open (AI/MCP developer tools).* The current
site mislabels him as a generic "Full Stack Developer," buries his strongest hook
(open source), leads with a 142-item skills cloud, and ships on top of a broken custom
scroll container.

We adopt an **Editorial-Minimal** design system (monochrome + one accent, a precise type
scale with a monospace "engineer signature," generous whitespace, restrained/fast motion),
re-sequence the **information architecture** into a founder-builder narrative with explicit
on-ramps for all four audiences (OSS users, recruiters, consultancy clients, peers/investors),
and **fix the technical foundation** (drop the custom scroll container, delete dead code,
make design tokens the single source of truth, establish one honest stats SSOT). Delivered as
prod-complete vertical slices, compatible with the existing static-export → nginx/Docker → Sylphx
Platform deploy path.

---

## 1. Context

### 1.1 What the project is

A personal portfolio at **kylet.se** for **Kyle Tse**. Stack: **Next.js 16 + React 19 +
TypeScript + Tailwind v3.4 + Framer Motion 12 + Zustand**. Built as a single-page scroll
narrative with per-section deep links (`/tech-stack`, `/projects`, …).

**Deploy constraint (verified, load-bearing):** `next.config.ts` sets `output: 'export'`
(static HTML to `out/`, `images.unoptimized: true`). Shipped as static files via
`nginx:alpine` in a Docker image, built by Bun, deployed on **Sylphx Platform**
(`sylphx.toml`, `Dockerfile`, `nginx.conf`). **There is no runtime server, no API routes,
no Next Image optimization.** Any dynamic data (contact form, live GitHub stats) must be
handled at **build time** or via an **external service** — this constrains several decisions
below.

### 1.2 Who Kyle actually is (the underused asset)

The data layer tells a far stronger story than the current UI surfaces:

- **20-year arc across four eras**, repeatedly shipping at scale:
  - **Nakuz** (2006–) — HK gaming media platform, **500K+ registered users**, 100+ official
    game partnerships. *Web/forum era.*
  - **MiniMax / Funimax** (2010–2016) — social gaming, **10M+ MAU**, 30+ concurrent Facebook
    games. *Social era.*
  - **Cubeage** (2014–) — mobile games, **10M+ downloads** across CN/HK/TW/SEA. *Mobile era.*
  - **Sylphx** (2025–, London) — open-source developer tools; **pdf-reader-mcp at 492★**,
    CodeRAG, Rapid, Craft. *AI/MCP era.*
  - **Epiow** (2025–, London) — co-founder & CTO, web/software consultancy.
- **Open-source body of work**: 54 catalogued projects, MCP servers + TS/Dart libraries with
  real benchmarks, npm packages, ~4.6K commits.
- **Breadth**: 142 catalogued skills across 20 domains (frontend, backend, AI, game, blockchain,
  devops, …).

**The through-line:** a builder who ships products at scale, repeatedly, solo or small-team,
across every major platform shift of the last two decades — now building in the open.

### 1.3 Current-state problems (evidence-based audit)

**A. Positioning undersells the story.**
- `layout.tsx` metadata title + schema.org `jobTitle` = **"Full Stack Developer"** — this
  flattens a serial founder with 10M-scale outcomes into a commodity label.
- The narrative arc is invisible: sections read as a disconnected list, not a story.

**B. Information architecture fights the reader.**
- Order is `Hero → TechStack(skills) → OpenSource → Philosophy → Projects → Experience → Contact`.
- A **142-item skills cloud** (`TechStack.tsx`) appears *second* — a laundry list before any
  proof or story. Open source (his strongest, most verifiable current hook) is buried at #3.
- 54 projects and 142 skills are surfaced with little curation → volume reads as noise, not signal.

**C. The design system is generic and inconsistently applied.**
- "Modern Minimal, Vercel/Linear-inspired" (`globals.css`): a tasteful skeleton (CSS-variable
  tokens, neutral scale, single blue accent) — but undermined by **hardcoded colors**
  (`bg-green-50 dark:bg-green-950/30`, `bg-blue-100`, `text-blue-600`, ad-hoc tag palettes) and
  **magic numbers** (`y > 50`, `600`, `viewport * 0.5`, `500ms` retries) scattered across
  components. Tokens exist but are not the source of truth.
- Typography has no enforced scale; each section is "slightly different."

**D. The technical foundation is partly broken.**
- `AppShell.tsx` uses `body { overflow: hidden }` + a custom `#main-content` scroll container,
  but `ProgressBar.tsx` and `BackToTop.tsx` read `window.scrollY` → **they track the wrong
  scroll source and are effectively broken.** `Header.tsx` / `SectionNavigator.tsx` each
  re-implement container-awareness with fallbacks.
- `NavigationContext.tsx` (≈280 lines) couples scroll state + URL history + IntersectionObserver
  with timing hacks (500ms retry for "missing" sections).

**E. Dead/duplicated code and debt.**
- Two Projects implementations (modern `projects/ProjectsShowcase.tsx` + legacy
  `projects/ProjectCard.tsx`), two Experience paths, an **unused** `ScrollAnimationProvider`
  (~93 lines), dead re-export wrappers (`FeaturedProjects.tsx`), and **30+ debug screenshots**
  in `.playwright-mcp/` committed to the repo — a fossil record of prior layout struggles.

**F. Content-honesty defects (doctrine: no fake/inconsistent data).**
- GitHub stats disagree across the UI: Hero says **"490+ stars"**, OpenSource says **"500+"**,
  while `GITHUB_STATS` records `totalStars: 171`, `orgStars: 597`, `featuredRepo: 492`. The
  "490+" is really *one repo* (pdf-reader-mcp). There is no single stats SSOT.
- Two distinct **"10M+"** claims (10M+ downloads at Cubeage vs 10M+ MAU at MiniMax) risk reading
  as double-counting unless framed distinctly.
- The contact form **fakes submission** (`setTimeout(resolve, 1500)`) — it does not send anything.

### 1.4 What the user explicitly asked

> Redesign the whole site to be more modern / advanced / beautiful — *but first deeply understand
> the project, think from the visitor's perspective (what will they see? what should we show?),
> analyze thoroughly, write this ADR documentation-first, and get a GPT review.*

---

## 2. User-perspective analysis (what a visitor sees, what we should show)

The redesign is driven by **jobs-to-be-done** for each audience. Kyle selected **all four**
audiences as in-scope, with **Founder & builder brand as the unifying spine**.

| # | Visitor | Arrives from | Their job-to-be-done (≤10s) | What we must show |
|---|---------|--------------|------------------------------|-------------------|
| 1 | **OSS developer / tool user** | GitHub, npm, MCP registries | "Is this person credible? What else have they built? Is it maintained? Where's the repo/docs?" | Open-source work up front; real metrics (stars/benchmarks/tests); direct repo + npm links; clear "is it alive" signals |
| 2 | **Recruiter / hiring manager** | LinkedIn, search, referral | "Senior enough? Proof of impact? Relevant tech? Available? How do I get a CV / contact?" | Headline impact numbers; current focus; availability signal; legible capabilities; one-click résumé + contact |
| 3 | **Consultancy client (Epiow)** | Referral, Epiow | "Can they deliver? Track record? Trust? How do I engage?" | Repeated shipping at scale; breadth; an explicit "work with me / Epiow" path |
| 4 | **Founder / investor / peer / press** | Twitter/X, network | "Who is this? What's the vision/story? Credible?" | The narrative arc; Sylphx vision; credibility markers |

**Key insight:** these are not four homepages. The **founder-builder brand subsumes all four** —
a builder who *demonstrably ships at scale, repeatedly* is exactly the credibility OSS users,
recruiters, clients, and peers each need. So we lead with that one story, then provide
**audience on-ramps** (targeted CTAs and a "work with me" matrix) rather than fragmenting.

**The 10-second pitch the homepage must land:** *"Technical founder & builder. 20 years.
Shipped to 10M+ users, multiple times. Now building open-source AI dev tools. Here's the proof,
and here's how to work with me."*

---

## 3. Decision drivers

1. **Kyle's direction (taste, owned by the user):**
   - Visual: **Editorial Minimal** — monochrome + one accent, precise type scale, big type,
     generous whitespace (selected over Terminal-craft / Warm-editorial / Bold-dark).
   - Positioning: **all four audiences**, with **founder-builder brand as the spine**.
   - Motion: **restrained & fast** — purposeful, light, instant; scroll-reveal + micro-interactions;
     `prefers-reduced-motion` respected (selected over "rich/immersive").
2. **Doctrine:** SOTA · Future-Proof · SSOT · SoC · 化繁為簡 (manage complexity *downward*) ·
   No Code Smell/No Tech Debt · Observability · honest reporting (no fake/inconsistent data) ·
   Design Maximal / Ship Verified Slices.
3. **Hard constraint:** must remain a **static export** compatible with the nginx/Docker/Sylphx
   Platform deploy path (no runtime server, no API routes).
4. **Truthfulness:** every number on the page must trace to a single, defensible SSOT.

---

## 4. Decision

### 4.1 Positioning & narrative

- **Reframe the identity** from "Full Stack Developer" → **"Technical Founder & Builder"**
  (with supporting sub-roles: open-source creator, framework author, ex-game-studio founder).
  Update page title, meta description, OG, and schema.org `jobTitle`/`description` accordingly.
- **One-line arc** as the hero subhead, e.g. *"20 years building products at scale — from a HK
  gaming studio to open-source AI developer tools."* (final copy TBD with Kyle).
- Frame the two "10M+" facts **distinctly** (10M+ app downloads · 10M+ monthly players) so they
  read as two achievements, not one number twice.

### 4.2 Information architecture (new sequence)

Re-sequence into a narrative with the spine first and on-ramps throughout:

| Order | Section | Why here (audience served) | Change from today |
|-------|---------|----------------------------|--------------------|
| 1 | **Hero / Identity** | The 10-second pitch + proof stats + availability + primary CTAs | Reframed; honest stats; résumé CTA added |
| 2 | **Now / Currently building** | Freshness: Sylphx (OSS) + Epiow (consultancy) (OSS users, clients, recruiters) | **New** — a focused "what I'm doing right now" band |
| 3 | **Open Source / Selected work** | Strongest verifiable hook (OSS users, peers) | **Promoted** from #3-buried to a headline act; real metrics + repo/npm links |
| 4 | **The Arc / Experience** | 20-year track record as a *story of shipping at scale* (recruiters, clients, peers) | **Promoted + reframed** from generic timeline to editorial narrative |
| 5 | **Projects** | Curated depth across eras (all audiences) | **Curated** (featured subset + "view all"), single card system |
| 6 | **Capabilities** (was "Skills") | Supporting evidence, not the lead (recruiters) | **Demoted + reframed**: 142 items → a few legible domains, curated |
| 7 | **Philosophy** | Taste/how-I-build signal (peers, clients) | Kept, tightened, secondary |
| 8 | **Work with me / Contact** | Explicit on-ramps per audience + real contact | Reframed as an audience matrix; real submission |

Per-section deep links (`/open-source`, `/experience`, …) are **retained** for shareability and SEO.

### 4.3 Design system — "Editorial Minimal"

A disciplined token layer is the **single source of truth**; components consume tokens only
(no hardcoded palette utilities).

- **Color:** monochrome neutral scale (ink → greys → paper) + **one accent**. Define in
  **OKLCH** CSS variables for perceptually-even light/dark scales and easy retuning; map into the
  Tailwind theme. Default accent = a single confident blue/cobalt (refined from today's `#2563EB`);
  exact hue is a tunable token (see Open Questions). **Dark mode is first-class**, driven entirely
  by variables — zero `dark:bg-*` hardcoding.
- **Typography:** a strict modular scale (one set of heading/body/caption steps applied everywhere).
  Display sans for headings (Inter or a grotesk such as Geist/General Sans) + a **monospace**
  (Geist Mono / JetBrains Mono / IBM Plex Mono) reserved for **metadata, stats, labels, dates** —
  the restrained "engineer signature" that makes minimal feel *crafted and technical* without
  going full terminal. Loaded via `next/font` (static-export compatible).
- **Space & grid:** 4px base; one enforced vertical rhythm; a content column (`max-w` ~1024–1100)
  with a wider editorial "bleed" for galleries. Replace the ad-hoc alternating section
  backgrounds with a small, intentional surface system (`background` / `surface` / `elevated`).
- **Motion (restrained & fast):** entrance reveals (short fade + small translate, `once: true`),
  hover micro-interactions, load stagger. **Remove** all continuous background animations (the
  20–25s blur loops). Honor `prefers-reduced-motion` globally. At most one or two light
  "signature" moments (e.g. hero stat count-up) — never blocking, never heavy.
- **Components:** one card system (kill the 3-variant Featured/Compact/Mini mess + legacy
  `ProjectCard`); token-driven badges/tags/buttons/inputs; visible focus states; consistent
  iconography.

### 4.4 Content strategy (curate volume into signal)

- **Capabilities, not a skills dump:** collapse 142 skills into a small set of **legible domains**
  (e.g. Languages · Frontend · Backend & Infra · Mobile & Games · AI & MCP), each showing a
  **curated** representative set with a years/experience signal and progressive disclosure for the
  rest. The full taxonomy stays in data; the UI shows the headline.
- **Projects:** curate a **featured** subset spanning eras (MCP/OSS flagships, a framework or two,
  a marquee game) with depth; everything else reachable via "view all / filter." Add an explicit
  `featured` flag to the data model rather than UI-side heuristics.
- **Proof SSOT (typed, provenanced — honesty gate):** create **one** typed proof model that every
  public claim reads from. A manually-curated constants file is *not* enough — it drifts and blurs
  scope (flagship-repo stars vs org-aggregate stars; downloads vs MAU). Each datum is a typed record:

  **Schema engine = Effect Schema** (doctrine SSOT — `engineering-standard.md`: "Effect Schema
  defines runtime shapes, TypeScript types, validators…"; and explicitly "Do not create … Zod
  schemas"). One schema is the sole source for the runtime validator **and** the TS type
  (`Schema.Schema.Type<typeof ProofStat>`). Designed so provenance/display cannot drift:

  ```ts
  import { Schema, ParseResult } from "effect"

  // Shared primitives. Finite EXCLUDES NaN AND Infinity (range filters allow Infinity) — every
  // numeric field derives from it, satisfying the JSON-safe encoded contract.
  const Finite = Schema.Number.pipe(Schema.finite())

  // Strict ISO date. DateFromString is lenient (bad string ⇒ Invalid Date) and `new Date()`
  // *normalizes* impossible calendar dates (2026-02-30 → Mar 2), so we: (1) pin the encoded shape
  // to YYYY-MM-DD, (2) parse as UTC, (3) reject NaN, (4) ROUND-TRIP — the parsed date must
  // re-encode to the exact input, which rejects normalized/impossible dates. Encoded side = string.
  const IsoDate = Schema.transformOrFail(
    Schema.String.pipe(Schema.pattern(/^\d{4}-\d{2}-\d{2}$/)),   // validate string BEFORE transform
    Schema.ValidDateFromSelf,                                    // target rejects Invalid Date instances
    {
      strict: true,
      decode: (s, _opts, ast) => {
        const d = new Date(`${s}T00:00:00Z`)
        return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== s
          ? ParseResult.fail(new ParseResult.Type(ast, s, "not a real YYYY-MM-DD date"))
          : ParseResult.succeed(d)
      },
      encode: (d, _opts, ast) =>                                 // guard: never throw on Invalid Date
        Number.isNaN(d.getTime())
          ? ParseResult.fail(new ParseResult.Type(ast, d, "Invalid Date"))
          : ParseResult.succeed(d.toISOString().slice(0, 10)),
    },
  )
  // Regression: decode '2026-06-27' passes; '2026-06-27T00:00:00Z' (pattern), '2026-02-30' &
  // '2026-13-40' (round-trip), 'soon' (pattern) FAIL; encode(new Date(NaN)) FAILS (no throw) —
  // for both verifiedOn and asOf.

  // XOR provenance: a tagged union of *strict* structs (excess keys ERROR on decode), so
  // `{ _tag: 'url', url, attestation }` is rejected — not silently coerced into the url arm.
  const Source = Schema.Union(
    Schema.Struct({ _tag: Schema.Literal("url"),         url: Schema.URL }),
    Schema.Struct({ _tag: Schema.Literal("attestation"), attestation: Schema.NonEmptyString }),
  )

  // CANONICAL metric vocabulary — defined ONCE here and reused everywhere (no parallel taxonomy).
  // The current TS-only `Metric` in data/types.ts is REPLACED: its `type`/`context` are re-derived
  // from these (`type MetricKind = Schema.Schema.Type<typeof MetricKind>`), so Role.metrics, public
  // stats, and proof records share one source of truth.
  const MetricKind = Schema.Literal(
    "downloads","installs","users","stars","forks","commits","repos","packages",
    "coverage","tests","bundleSizeKB","latencyMs","speedupX","rating","years",
    "partnerships","games","languages","revenue","custom")
  const MetricContext = Schema.Literal("total","monthly","daily","peak","concurrent","n/a")

  // Typed CLAIM SEMANTICS so meaning is encoded, not a free-text label. `formatProofStat` +
  // reconciliation read THESE fields, so a wrong label can't disguise the wrong number.
  const ProofStat = Schema.Struct({
    id:        Schema.NonEmptyString,   // 'pdf-reader-mcp-stars' — referenced, never a literal
    rawValue:  Finite,                  // 492 — finite (no NaN/Infinity); the only truth, display derived
    metricKind: MetricKind,             // WHAT the number measures (canonical)
    unit:      Schema.optional(Schema.String),     // 'KB','ms','x','/5','languages'…
    context:   MetricContext,           // canonical
    subjectId: Schema.NonEmptyString,   // WHO/WHAT it's about: repo/org/project/role id (or 'global')
    scope:     Schema.Literal("repo","org-aggregate","personal","lifetime","company"),
    source:    Source,                  // required XOR provenance
    verifiedOn: IsoDate,                // valid YYYY-MM-DD; invalid/missing ⇒ decode error ⇒ build fails
    owner:     Schema.NonEmptyString,
    freshness: Schema.Literal("static","build-time"),
    label:     Schema.NonEmptyString,   // human caption only — NOT used for reconciliation
    format:    Schema.Literal("plus","compact","exact"),  // display is DERIVED: formatProofStat(stat)
  })
  type ProofStat = Schema.Schema.Type<typeof ProofStat>
  // No displayValue field — formatProofStat() derives display from rawValue + metricKind + unit +
  // context + format (492 → '492'; downloads/total 10_000_000 → '10M+'; users/monthly 10_000_000 →
  // '10M+ MAU'), so display can never disagree with the typed number.
  ```

  Decode all records with `onExcessProperty: "error"` so the XOR is enforced at runtime, not just in
  types. (No Zod — satisfies the doctrine's anti-Zod stance.) **Canonical-model migration is a Slice 0
  task:** replace `data/types.ts` `Metric` with the schema-derived type, point `Role.metrics` at it,
  and migrate figure-only metric entries to `proofId` references; no second metric model survives.

  **Two registry tiers (proportionate honesty, not over-engineered).** Public figures fall into two
  honest classes; both live in one proof registry and both require provenance:
  - **Tier 1 — `ProofStat`** (above): the cross-referenced, credibility-critical headline numbers
    where drift actually happened (hero stats, OSS aggregate stars, downloads/MAU, commits, years).
    Full provenance + `verifiedOn` + reconciliation.
  - **Tier 2 — `DescriptiveFigure`:** project-local technical descriptors that appear in *one*
    project's copy and are not cross-aggregated (`"2.49 KB"`, `"sub-50ms"`, `"1.7–45x"`,
    `"15+ languages"`, `"4.7/5"`, `"94%+ coverage"`). Same Effect-Schema discipline (canonical
    `metricKind`/`unit`, strict decode). It needs a **typed value algebra** so these shapes render
    through a formatter, never a free-form display string (which would reintroduce drift):

    ```ts
    const NonNeg = Finite.pipe(Schema.nonNegative())     // Finite ⇒ excludes NaN AND Infinity
    const Pos    = Finite.pipe(Schema.positive())
    const FigureValue = Schema.Union(                    // discriminated; strict; invariants enforced
      Schema.Struct({ _tag: Schema.Literal("exact"),      value: NonNeg }),  // 2.49
      Schema.Struct({ _tag: Schema.Literal("range"),      min: NonNeg, max: NonNeg })
        .pipe(Schema.filter(r => r.min <= r.max || "range.min must be ≤ range.max")), // 1.7–45
      Schema.Struct({ _tag: Schema.Literal("upperBound"), value: NonNeg }), // sub-50ms
      Schema.Struct({ _tag: Schema.Literal("lowerBound"), value: NonNeg }), // 94%+, 15+
      Schema.Struct({ _tag: Schema.Literal("approximate"),value: NonNeg }), // ~4.7 KB
      Schema.Struct({ _tag: Schema.Literal("rating"),     value: NonNeg, outOf: Pos })
        .pipe(Schema.filter(r => r.value <= r.outOf || "rating.value must be ≤ outOf")), // 4.7/5
    )
    const DescriptiveFigure = Schema.Struct({
      id: Schema.NonEmptyString, subjectId: Schema.NonEmptyString,
      metricKind: MetricKind, unit: Schema.optional(Schema.String),
      value: FigureValue, label: Schema.NonEmptyString,
      source: Schema.Struct({ url: Schema.URL, ref: Schema.NonEmptyString,   // commit/tag/path
                              asOf: IsoDate, command: Schema.optional(Schema.String) }),
    }).pipe(Schema.filter(metricInvariants))  // metric-specific: see below
    ```

    `formatFigure(fig)` derives display from `value` + `metricKind` + `unit` (e.g. `upperBound 50` +
    `ms` → "sub-50ms"; `lowerBound 94` + `%` → "94%+"; `rating 4.7 outOf 5` → "4.7/5"). **Domain
    invariants are schema refinements** (`Schema.filter`), shared by both tiers via `metricInvariants`:
    count-like kinds (`stars`/`forks`/`downloads`/`installs`/`users`/`commits`/`repos`/`packages`/
    `tests`/`games`/`languages`/`partnerships`) are **non-negative integers**; `coverage` ∈ 0..100;
    `rating` value ≤ `outOf`; `latencyMs`/`bundleSizeKB`/`speedupX` > 0. A well-shaped-but-impossible
    record **fails decode → fails the build**; the schema test seeds these as regression cases:
    `range{45,1.7}`, `rating{7,5}`, `coverage 142`, negative stars, **`Infinity`/`-Infinity`/`NaN`
    on any numeric field**, and **invalid/ill-formatted `verifiedOn`/`asOf`** (e.g. `"2026-13-40"`,
    `"soon"`). The only relaxation vs Tier 1 is no cross-page reconciliation (local to one project)
    and `asOf` is "as measured" — but every measured number still points at a repo location + date.

  **Numbers are authored as references, not inferred from prose.** The verifier never guesses a
  number's meaning from nearby words — every public figure is *authored through the registry*, and the
  scanner is only a deny-by-default catch-all for anything that slips that rule:
  - **Authoring contract:** public claims are written as a structured **proof reference** — either a
    typed field (`{ proofId }` on a metric/achievement) or, inside rich copy, a `proof("id")` token
    (a small node, not a bare string) that **renders from registry data**. There is no semantic
    inference: a reference renders the registry's `rawValue` via `formatProofStat`, so it is correct
    by construction; reconciliation is reference→registry identity, not text→number matching.
  - **Deny-by-default scanner (the catch-all):** `verify:proof` scans every public/renderable surface
    — data modules' renderable fields (`personal.ts`, `roles.ts`, `projects.ts`, `skills.ts`,
    `organizations.ts`, `philosophy.ts`), component string literals, and `layout.tsx` metadata/JSON-LD
    — and **fails CI on any raw numeric-claim token that is not a proof reference** and not on the
    typed non-claim allowlist (calendar years, version strings). So ambiguous repeats (`10M`, `492`,
    `users`/`downloads`/`stars`) can never be "mis-associated by inference" — an unannotated claim
    simply fails until it is authored as a reference. Seeded strings (`"15+ languages"`,
    `"1000–2000 files/sec"`, `"4.7/5"`, `"129 stars"`, `"~4.7 KB"`, …) are **regression cases**, not
    the coverage guarantee.
  - The verifier asserts two things: (a) every proof reference resolves to a registry entry and
    renders from it; (b) **zero** raw unreferenced claim tokens remain. Cross-page Tier-1 reconciliation
    (typed `rawValue`+`metricKind`+`context`+`subjectId`) still catches any 490-vs-500-vs-492 split.

  **Concrete enforcement mechanism + engine decision (where it actually runs):**
  - **Decision: Effect Schema is the engine** (doctrine SSOT) — chosen here, not left open; no
    parallel hand-rolled validator is carried (carrying two would itself break SSOT). §9 only confirms
    the *dependency install* (the one gated step); if Kyle declines `effect`, that is a deliberate
    re-decision of this ADR, not a pre-blessed fallback.
  - **Encoded/decoded contract (the public model is the *Encoded* form).** The schema uses transform
    codecs (`Schema.URL`, and the custom `IsoDate` transform above) whose *decoded* types are
    `URL`/`Date` — those must **not** reach the client. So the client-facing public type is the **Encoded** side
    (`Schema.Schema.Encoded<typeof ProofStat>` / `…<typeof DescriptiveFigure>`) — plain JSON-safe
    values (`url`/`verifiedOn`/`asOf` stay strings; `rawValue` is a `number` either way). Authored
    `registry.data.ts` is typed as that `Encoded` form, so records are written as ordinary
    strings/numbers. `verify:proof` runs `decodeUnknown` purely to **validate** (bad URL/date/invariant
    ⇒ build fails); helpers (`formatProofStat`/`formatFigure`) operate on the encoded public type. No
    decoded `Date`/`URL` artifact is shipped, and `Schema.Schema.Type`/`…Encoded` of one schema remain
    the sole truth (no parallel hand-written client type).
  - **Module boundary (keeps `effect` out of the client bundle, no import cycles):**
    - *Build/validation-only* — `src/data/proof/schema.server.ts` holds the Effect schemas + the
      `decodeUnknownSync(…, { onExcessProperty: "error" })` validation. Imported **only** by
      `verify:proof` / prebuild — **never** by a component or by `data/types.ts`.
    - *Authored data* — `src/data/proof/registry.data.ts`: plain **Encoded**-typed records (no
      `effect` runtime import; may use `import type` for the `Encoded` type alias).
    - *Client-facing* — components and `data/types.ts` import only this plain Encoded data + the pure
      `formatProofStat`/`formatFigure` helpers. `MetricKind`/`MetricContext` reach `data/types.ts` as
      **type-only** aliases (`import type`), so no runtime `effect` and no `types.ts → proof-schema`
      runtime cycle.
    - *Guard* — a CI/bundle check (and an ESLint `no-restricted-imports` rule) **forbids importing
      `effect` or `*/schema.server` from any `use client` module**; the §8 bundle budget confirms
      `effect` is absent from the client bundle.
  - A `verify:proof` script (a) imports **all** data/proof modules (so decode runs even for modules
    the page tree wouldn't import), (b) runs the deny-by-default scanner + Tier-1 reconciliation,
    (c) exits non-zero on any decode error, unreferenced claim token, or drift.
  - Wire `verify:proof` into **both** `prebuild` (a broken proof set blocks the static export / Docker
    build) **and** CI. **Slice 0's verification requires `verify:proof` green** (§7).

  Default `freshness: 'static'` (curated, Kyle-attested) now; a build-time GitHub fetch (prebuild
  script emitting JSON, flipping `ProofStat`s to `freshness: 'build-time'`) is a deferred enhancement,
  not a launch blocker.

### 4.5 Technical architecture

- **Drop the custom scroll container.** Remove `body overflow-hidden` + `#main-content` and use
  **natural document scroll**. This fixes `ProgressBar`/`BackToTop`/`SectionNavigator` at the root,
  deletes all container-awareness fallbacks, and is the modern default. Scroll-progress and
  "back to top" then read the document directly.
- **Simplify navigation.** Keep deep links + active-section highlighting, but back it with **one**
  IntersectionObserver hook (no 500ms retry hacks). Slim `NavigationContext` to navigation state
  only (SoC).
- **Delete dead code:** `ScrollAnimationProvider` (unused), legacy `ProjectCard`, dead
  `FeaturedProjects` re-export wrappers, the duplicate Experience path, and the 30+ committed
  debug screenshots in `.playwright-mcp/` (add to `.gitignore`).
- **Tokens as SSOT:** all color/space/type via the token layer; eliminate hardcoded palette
  utilities. (Optional CI guard: lint rule banning raw `bg-*-NNN`/`text-*-NNN` in components.)
- **Contact form (static-export-safe):** submit via an **external form service** (e.g.
  Web3Forms/Formspree) *or* a clearly honest `mailto:` — never a fake `setTimeout`. (Choice in
  Open Questions.)
- **SEO/metadata:** corrected title/description/OG image/JSON-LD reflecting the founder-builder
  positioning; regenerate `sitemap.xml` to list **only `/`** and rewrite JSON-LD `hasPart` to use
  in-page anchors (not per-section `WebPage` URLs) per the route contract (§4.6).
  **Purge every advertised-but-nonexistent route/capability** from `layout.tsx` (honesty + matches
  the single-indexable-page contract): remove the fake `hreflang` alternates (`/en`, `/zh`), the
  JSON-LD `SearchAction` `potentialAction` (there is no `/search` route — only re-add if a real
  search ships), and the `alternates.types` section-path entries (they conflict with the
  noindex/canonical-to-root section routes). Real i18n is deferred to a future ADR (§4.7).
- **Routing/404 (static export):** stop letting nginx silently `200` every unknown path as home —
  unknown URLs must return a real `404`. See the explicit route contract in §4.6.
- **Stack:** stay on Next 16 / React 19 / Tailwind v3.4 / Framer Motion (no risky upgrades inside
  this redesign). Tailwind v4 / live-data fetching are explicitly deferred (Open Questions) so the
  redesign ships without a dependency-migration gate.

### 4.6 Routing & SEO contract (static export)

Under static export + nginx, routing is not implicit — we specify it. **Decision: the redesign keeps
the one-page narrative, so `/` is the single indexable page.** Section URLs are *deep-link / share
routes* that load the page and scroll to a section; they are `noindex`, self-canonical to `/`, and
excluded from the sitemap. Old-slug handling and the 404 are owned by **nginx** (server-grade), not
by HTML hacks.

| Route | Generated in `out/` | Purpose | Robots / canonical | Sitemap |
|-------|---------------------|---------|--------------------|---------|
| `/` | `index.html` | the single content page | **index**; self-canonical | **yes (only entry)** |
| `/now`, `/open-source`, `/experience`, `/projects`, `/capabilities`, `/philosophy`, `/contact` | `<slug>/index.html` | deep-link entry → loads `/`, scrolls to anchor | **`noindex,follow`**; `rel=canonical` → `/` | no |
| `/tech-stack`, `/tech-stack/` | — (not generated) | legacy link | **nginx 301 → `/capabilities/`** | no |
| any other path | — | invalid | **HTTP 404** (`404.html`) | no |

Rules:
- **Single indexable page (kills duplicate content):** the App Router catch-all today renders the
  *full Home* for every section URL with identical metadata — duplicate indexable pages. We resolve
  it by decision, not by adding per-section content: each generated section page carries
  `<meta name="robots" content="noindex,follow">` and `<link rel="canonical" href="https://kylet.se/">`.
  They remain useful as shareable scroll-to entry points without polluting the index. (If section
  pages ever become materially distinct content, a future ADR can flip them to self-canonical
  indexable pages — explicitly, not by accident.)
- **Sitemap & JSON-LD:** `sitemap.xml` lists **only `/`**. JSON-LD on `/` expresses sections as
  in-page anchors via `SiteNavigationElement` / `WebPageElement` (`/#open-source`, …), **not** as
  separate `WebPage` URLs (which would re-imply distinct indexable pages — the current
  `layout.tsx` `hasPart` does exactly this and is corrected here).
- **Canonical source of slugs:** `src/config/sections.ts` (`SECTIONS`) is the single list driving
  nav, `generateStaticParams`, in-page anchors, and the JSON-LD nav element. Add/rename a section =
  one-file change; nothing else hardcodes slugs.
- **Legacy slug redirect — server-owned (we control `nginx.conf`):** add an exact-match
  `location = /tech-stack` and `location = /tech-stack/` returning a real **301 → `/capabilities/`**.
  `tech-stack` is dropped from `generateStaticParams` and the sitemap. A server 301 is the
  SEO-grade, verifiable contract — and the *only* redirect mechanism here; there is **no** HTML
  meta/JS alias page. (Local non-nginx previews like `serve -s out` won't honor the redirect; that's
  fine — production is always nginx, and that's what the §4.6 checks run against. Round-1's "static
  export can't 301" conflated the export step with the deployment — nginx can and should.)
- **Invalid paths → real 404:** export `404.html` (Next `not-found`) and change `nginx.conf`
  `try_files` from the `/index.html` SPA fallback to `… =404;` with `error_page 404 /404.html;`, so
  bogus URLs return **HTTP 404**, not a `200` home page. Valid section dirs still resolve via `$uri/`.
- **Trailing slash:** `trailingSlash: true` stays; internal links + canonical use the trailing-slash
  form consistently.
- **Verification (against `out/` served by the real `nginx.conf`):**
  - `curl -sI` (status/headers): `/` → `200`; each section route → `200`; `/tech-stack` **and**
    `/tech-stack/` → `301` with `Location: /capabilities/`; `/capabilities/` → `200`; bogus
    `/nope/` → **`404`**.
  - `curl -s` (full HTML body — HEAD cannot see the head): a section route includes
    `robots: noindex` + `rel=canonical` = `/`; `sitemap.xml` lists only `/`; JSON-LD uses anchors,
    no per-section `WebPage` URLs.

### 4.7 Non-goals (this ADR)

- No CMS, blog, or i18n build-out (zh-HK). The current **fake** `alternates.languages` stubs are
  *removed* now (§4.5 — honesty); real localized routes/metadata/sitemap are a separate future ADR.
- No backend/runtime services; no analytics platform decision. A lightweight, privacy-respecting
  analytics choice and an automated visual-regression suite are recommended fast-follows, not
  blockers for this redesign.

---

## 5. Alternatives considered

**Visual direction** (Kyle chose Editorial Minimal):
- *Terminal-craft* — most differentiated for a dev-tools founder, but narrower appeal and risks
  alienating non-engineer audiences (recruiters/clients/press). Its best idea (mono metadata) is
  **absorbed** into Editorial Minimal as an accent.
- *Warm editorial / magazine* — great for the narrative but weak "advanced/technical" signal.
- *Bold dark / spotlight* — highest wow, but dates fastest and is hardest to keep professional
  across four audiences. Rejected per "restrained & fast."

**Information architecture:**
- *Keep current order, restyle only* — cheapest, but leaves the core problem (skills-first, story
  invisible, OSS buried) unsolved. Rejected.
- *Split into per-audience landing pages* — better targeting but fragments the brand, multiplies
  maintenance, and loses the single strong narrative. Rejected in favor of one spine + on-ramps.

**Scroll model:**
- *Keep the custom `#main-content` container and fix the consumers* — preserves bespoke scroll
  control but retains fragility and container-awareness sprawl for no user benefit. Rejected in
  favor of natural document scroll (化繁為簡, downward).

**Data freshness:**
- *Live GitHub fetch at runtime* — impossible under static export. *Build-time fetch* — feasible
  but adds an external dependency/secret + failure mode; deferred. *Curated static SSOT* —
  chosen now for honesty + simplicity.

**Tailwind v4 migration:** deferred — it's a dependency-upgrade gate that would expand blast radius
and risk; the redesign does not require it.

---

## 6. Consequences

**Positive**
- A visitor understands *who Kyle is and why he's credible* within ~10 seconds; each audience has a
  clear next step.
- Open source — the most verifiable, freshest asset — leads instead of hiding.
- One token SSOT + one card system + natural scroll = less code, fewer bugs, easier evolution
  (the broken progress/back-to-top are fixed by construction).
- Honest, consistent numbers everywhere (doctrine-aligned; also reduces "is this real?" friction).
- Restrained motion → fast, accessible, professional across devices.

**Negative / costs**
- Substantial component rewrite (hero, sections, cards, nav). Mitigated by **vertical slices**
  (§7), each independently shippable and verifiable.
- Curation requires editorial judgment on which projects/skills/numbers to feature → needs Kyle's
  input on copy and final stat values.
- Dropping the custom scroll container touches navigation behavior → must be verified across
  deep-link entry, in-page nav, and mobile.
- The Proof-SSOT adds machinery (an `effect` dependency for Effect Schema, a `src/data/proof/`
  registry split into build-only schema + client-facing plain data, a `verify:proof` gate) and the
  one-time work of migrating existing figures into registry entries.
  Justified by the honesty/SSOT bar (it's the defect that produced 490/500/171/597), and kept
  proportionate via the two-tier model — but it is real upfront cost, and `effect` is a new
  runtime/build dependency (gated; see §9).

**Risks & mitigations**
- *Taste is subjective* → previews + slice-by-slice review; Editorial Minimal chosen as the
  lowest-risk-yet-distinctive direction.
- *Scope creep across 54 projects / 142 skills* → curation is a decision, enforced via `featured`
  flags + explicit caps; "view all" carries the long tail.
- *Static-export gotchas* (no Image optimization, no API) → designed-in from the start (external
  form, build-time/curated data, `unoptimized` images with right-sized assets).
- *Stat honesty* → single SSOT + Kyle-verified values before launch; no number ships unverified.

---

## 7. Implementation plan — Design Maximal, Ship Verified Slices

The blueprint above is the *maximal design*; we ship **prod-complete vertical slices** (each:
types, responsive, dark mode, a11y, reduced-motion, builds clean via `bun run build` static export).

- **Slice 0 — Foundation.** OKLCH token layer as SSOT; type scale + fonts (sans + mono);
  drop the custom scroll container (natural scroll); **fix the zoom-blocking viewport** in
  `layout.tsx` (remove `maximumScale: 1` / `userScalable: false` — they fail WCAG 1.4.4 and the
  A11y=100 bar); delete dead code + debug screenshots;
  corrected metadata/OG/JSON-LD; **route contract (§4.6): `404.html` + nginx `=404` + nginx 301
  `/tech-stack` → `/capabilities/` + sections `noindex`+canonical-to-`/` + sitemap lists only `/`**;
  typed Proof-SSOT scaffold + canonical-`Metric` migration (one metric model) + `verify:proof` gate
  wired into `prebuild`/CI (§4.4). *Verify:* clean static build; **`verify:proof` green** (registry
  decodes, scanner finds no unreferenced claim token, no cross-page drift); the §4.6 checks pass (`curl -sI`: section 200s, `/tech-stack` → 301
  `Location`, bogus → **404**; `curl -s` body: section `noindex` + canonical `/`); light/dark +
  reduced-motion correct.
- **Slice 1 — Hero + Nav + Footer.** The 10-second pitch: reframed identity, honest stats,
  availability, primary/secondary CTAs (View work · GitHub · Résumé · Contact). *Verify:* renders
  on mobile/desktop, a11y pass, no layout shift.
- **Slice 2 — Now + Open Source.** "Currently building" band; promoted OSS act with real metrics
  and repo/npm links from the stats/data SSOT. *Verify:* links resolve; numbers match SSOT.
- **Slice 3 — The Arc (Experience) + Projects gallery.** Editorial career narrative; single card
  system; curated featured projects + "view all." *Verify:* timeline reads as a story; modal/detail
  works; keyboard-navigable.
- **Slice 4 — Capabilities + Philosophy.** 142 skills → legible domains with progressive
  disclosure; tightened philosophy. *Verify:* no laundry-list feel; disclosure works.
- **Slice 5 — Work-with-me / Contact + polish.** Audience on-ramp matrix; real contact submission
  (external service or honest mailto); final SEO/OG; cross-section consistency + performance pass.
  *Verify:* a real test submission arrives (or mailto opens correctly); **all §8 quality budgets
  met** (Lighthouse thresholds, image/bundle budgets, a11y/reduced-motion, screenshot matrix).

**Done = merged + deployed via the repo's normal path (Sylphx Platform static build) + verified**
with the page live, the §8 budgets met, and every public number traceable to a Proof-SSOT record.

---

## 8. Acceptance criteria & quality budgets (enforceable definition of done)

"Lighthouse pass" is not a bar — these are. Every slice must hold these before it is called done;
the full set is re-checked at Slice 5. Under `images.unoptimized`, image discipline is load-bearing
(a single oversized hero/project image silently wrecks LCP and bandwidth), so it is budgeted, not
assumed.

- **Lighthouse (mobile throttled & desktop), production static build:** Performance ≥ 90 mobile /
  ≥ 98 desktop; Accessibility = 100; Best-Practices ≥ 95; SEO = 100.
- **Core Web Vitals:** LCP ≤ 2.0s (mobile, throttled), CLS < 0.05, INP < 200ms. The hero LCP
  element is identified and its image (if any) `preload`ed; no above-the-fold lazy-load.
- **Image strategy (no Next optimization available):** every `<img>` ships explicit
  `width`/`height` (or aspect-ratio box) to reserve space (CLS); `loading="lazy"` +
  `decoding="async"` below the fold; assets pre-compressed and width-capped (e.g. ≤ 1600px,
  modern formats where the source allows); per-image budget ≤ ~200KB and a total
  initial-route image budget (e.g. ≤ 500KB above the fold). OG image ≤ 300KB.
- **Bundle budget:** initial route JS (gzipped) ≤ ~150KB; track per-slice; Framer Motion usage
  kept tree-shaken / lazy where it isn't above the fold. **`effect`/Effect-Schema stays out of the
  client bundle** — decode/validate the proof registry at `verify:proof`/prebuild time and ship the
  client only plain decoded data + the tiny `formatProofStat` helper (verified via the bundle
  budget).
- **Accessibility (manual + automated):** WCAG AA contrast for all text/UI in **both** themes
  (token scales chosen to pass); visible focus on every interactive element; full keyboard path
  through nav, cards, modals, and the contact form (Tab/Shift-Tab/Enter/Escape; focus trap +
  restore in modals); landmarks + one `<h1>`; `aria-current` on active nav; **pinch-zoom allowed**
  (no `maximum-scale` / `user-scalable=no` — WCAG 1.4.4); axe/Lighthouse a11y with zero serious
  violations.
- **Reduced motion:** with `prefers-reduced-motion: reduce`, all entrance/scroll/hover animations
  degrade to instant or none; no continuous background animation exists in any state.
- **Screenshot matrix (regression guard):** Playwright captures of every section at mobile (375px)
  and desktop (1440px) × light/dark, reviewed for overlap, clipping, and text overflow before a
  slice is done. (Automating this into CI is a recommended fast-follow.)
- **Static-route checks:** the §4.6 `curl -sI` matrix (canonical 200s, alias canonical, bogus →
  404) passes against `out/` served by the real `nginx.conf`.

## 9. Open questions (need Kyle's input)

1. **Accent hue** — keep refined cobalt blue (default) or pick a distinct signature
   (e.g. warm amber, electric indigo)? Token-tunable, low cost to change.
2. **Contact submission** — external form service (Web3Forms/Formspree, real inbox) vs honest
   `mailto:` link? (Static export rules out a Next API route.)
3. **Résumé/CV** — is there a PDF to link/download from the hero and contact on-ramp?
4. **Stat values** — confirm the verified, consistent numbers for the SSOT (flagship-repo stars
   vs aggregate; how to present the two distinct "10M+" facts).
5. **"Available for opportunities"** — keep the active-availability signal prominent, or soften to
   "open to interesting problems" given the founder framing?
6. **Confirm the `effect` dependency install (gated).** The ADR *decides* Effect Schema as the proof
   engine (§4.4, doctrine SSOT) — this question is only the dependency-install approval (build/
   validation-time only; kept out of the client bundle, §8). Declining means re-deciding §4.4, not
   selecting a pre-blessed fallback.
7. **Deferred (future ADRs):** build-time GitHub live stats; Tailwind v4; visual-regression CI;
   zh-HK i18n.

## 10. References

- Doctrine: `~/.doctrine/PRINCIPLES.md`, `~/.doctrine/standards/frontend-standard.md`,
  `~/.doctrine/standards/engineering-standard.md`, ADR convention (`~/.doctrine/ADR.md`).
- Current-state evidence: `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`,
  `tailwind.config.ts`, `src/lib/design-tokens.ts`, `src/components/{Hero,TechStack,OpenSource,
  Philosophy,Contact}.tsx`, `src/components/layout/AppShell.tsx`, `src/context/NavigationContext.tsx`,
  `src/components/{ProgressBar,BackToTop,SectionNavigator}.tsx`.
- Data SSOT: `src/data/{personal,roles,organizations,projects,skills,philosophy,types}.ts`.
- Deploy constraint: `next.config.ts`, `Dockerfile`, `nginx.conf`, `sylphx.toml`.
