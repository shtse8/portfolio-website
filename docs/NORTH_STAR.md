# kylet.se — North Star

**Status:** Vision (design only; not an implementation plan)  
**Scope:** `shtse8/portfolio-website` · live surface `https://kylet.se`  
**Date:** 2026-08-10  
**Freedom:** No backward-compatibility obligation. Keep, cut, merge, or invent by this star alone.

---

## 1. What “powerful” means here

**Powerful** is not visual density, feature count, or “looks AI-native.”

For kylet.se, powerful means a **decision finishes with evidence**:

1. A **decision-maker** (recruiter/hiring eng, founder/partner, OSS adopter, collaborator) lands with a job: *Is this the right person / stack / builder for X?*
2. Within **one short session**, they can **state, verify, and act**:
   - **State** — a single promise they can repeat accurately.
   - **Verify** — every material claim is live-measured, stale-labeled, or absent (never marketing fog).
   - **Act** — contact, hire, partner, star, install, or deep-link into the real work without a form or a new mental model.
3. The site **is** the proof, not a brochure *about* proof: live adoption numbers, real agent tools, dogfood of the builder’s own AI stack.

**Least system** is the constraint: the fewest concepts, surfaces, services, and copy that still produce those three outcomes for every primary visitor job. Integrate rather than amputate; when depth and simplicity conflict, compose one deeper concept—do not add a second product.

---

## 2. Present system (evidence by layer)

Evidence was captured **2026-08-10**. Docs and green checks are not live proof.

### Live (`https://kylet.se`)

| Probe | Result |
| --- | --- |
| `GET /` HTML | 200 · Cloudflare edge · HSTS, CSP, nosniff, XFO DENY, Referrer-Policy, Permissions-Policy present |
| `GET /healthz` | `ok` · ~90ms |
| `GET /stats` | Live: `githubStars` 1239 · `npmDownloads` 31751 · `flagshipStars` 887 · `flagshipDownloads` 28801 · `repos` 657 · `updatedAt` present |
| `GET /activity` | Live: `source=github` · `freshness=live` · commits today/week/month · last push `portfolio-website` ~1h |
| `GET /projects` | Live: ordered by stars; flagship `SylphxAI/pdf-reader-mcp` at 887★ |
| `GET /repo?name=pdf-reader-mcp` | Live repo detail |
| `GET /downloads?pkg=@sylphx/pdf-reader-mcp` | Live daily series (scoped name works) |
| `GET /downloads?pkg=pdf-reader-mcp` | Empty series (unscoped name wrong) — tool/UI path must use scoped npm |
| `POST /chat` | **Live path exists but fails:** SSE `gateway 401 Unauthorized: unsupported_credential` |
| External flagship | GitHub `SylphxAI/pdf-reader-mcp` 887★ / 81 forks (public API); npm `@sylphx/pdf-reader-mcp` **28,801** last-month downloads (npm downloads API) |
| Portfolio company sites | `sylphx.com` 200 · `epiow.com` 200 · `cubeage.com` 301→www |

**Live verdict:** Stats/work graph data plane is real. **Agent contact plane is currently broken at the gateway credential boundary.** The product’s differentiator (“Talk to my AI” / dogfood of Sylphx AI Gateway) is not production-true until chat is green.

### Source (repo `shtse8/portfolio-website`, local main)

- **Web:** Next.js static export (`src/` → `out/`), TypeScript, Framer Motion, Tailwind, one-page narrative sections (hero, story, companies, work, products, contact) + floating agent.
- **API:** Rust `api-rust` sole live authority — single JSON REST contract (ADR-169). Routes: `/healthz`, `/stats`, `/activity`, `/projects`, `/recent`, `/repo`, `/downloads`, `/chat`.
- **Agent:** Persona (`persona.txt`) + 5 tools (`list_projects`, `get_repo`, `recent_activity`, `search_projects`, `npm_downloads`) over Sylphx AI Gateway Responses wire (`POST /v1/responses`). Rate limits: 12 / 3 min, 60 / day per trusted client IP.
- **Honesty ladder:** Baked `stats-baked.json` with `verifiedAt`; stale-on-fail for stats/activity; never fabricate zeros as “live.”
- **Deploy contract:** `sylphx.toml` two services — nginx web BFF + api; Platform owns cluster.
- **Dual data models:** Curated catalog + live GitHub overlay for OSS; separate 29-item screenshot catalog for historical shipped products; large `projects.ts` inventory still present (~2.3k lines) alongside newer WorkGraph path — residual dual content authority.
- **Static sections in DOM vs nav:** Nav declares 4 story beats (`hero|story|work|contact`); page also mounts `companies` + `products` as first-class sections without equal nav weight.

### CI (source correctness)

- Workflow: biome + tsc + bun test + static export + no-TS-backend fence + cinematic markers; Rust clippy `-D warnings` + `cargo test --locked`.
- Public Actions sample (2026-08-09): latest main CI **success** after a prior **failure** same day — CI exists and flips; not a continuous green claim.

### Deploy / platform

- Edge: Cloudflare in front of Platform/Envoy (headers evidence).
- Production proof script: `scripts/api-smoke.sh` (health, stats, projects, activity, chat SSE) — **chat smoke would fail today against live.**

### What the product already gets right (keep, with why)

| Keep | Why it belongs under the north star |
| --- | --- |
| One promise: *“I build the infrastructure AI agents run on.”* | Single memorable concept; matches flagship MCP + Sylphx stack. |
| Live stats as first-class UI (not footer vanity) | Turns résumé claims into instruments; WorkGraph linkage is real product. |
| Static export + small Rust BFF | Correct split: marketing edge is cheap/fast/cacheable; live truth is isolated. |
| Single JSON REST contract (ADR-169) | Removes proto/Connect theater with no consumer — Simplicity without amputating the browser surface. |
| Stale-labeled fallbacks + `verifiedAt` | Correctness under partial failure; honesty is the brand. |
| Agent as contact, not decoration | Highest-leverage differentiator if and only if tools + credentials are true. |
| No contact form | One conversion path; agent drafts mailto — visitor remains in control of send. |
| Security headers + trusted-IP rate limit | Security floor for a public LLM spend surface. |
| Capability taxonomy (MCP / AI infra / RAG / tooling) | Maps work to the promise without a second IA. |
| Primary vs secondary OSS visibility (stars ≥ 3, etc.) | Signal over exhaustiveness. |
| Dogfood framing (chat → Sylphx Gateway) | Portfolio *is* product proof for the builder’s platform story. |

---

## 3. World context (sourced)

### Market & users

Primary **jobs-to-be-done** for this site (not “everyone who browses portfolios”):

| Actor | Job | Success |
| --- | --- | --- |
| Hiring eng / staff+ recruiter | Decide if Kyle is credible for AI infra / platform / MCP / founder-engineer roles | Confident shortlist decision + outreach ready |
| Founder / partner / client | Decide if Kyle is the technical co-founder or integration partner | Risk reduced via live proof + fit narrative |
| OSS adopter / agent builder | Decide whether to install/star/contribute | One hop to flagship proof + docs/npm/GitHub |
| Peer engineer | Judge craft | Site itself behaves like production software |
| External agent / search / RAG | Retrieve a machine-stable identity | Structured claims, live endpoints, schema.org Person |

Industry pattern (2025–2026): personal sites remain **show, don’t tell** (site-builder and portfolio roundups still emphasize real work over skill laundry lists). The clone of Brittany Chiang’s one-page engineer narrative is saturated as a *layout*; differentiation is no longer typography—it is **verifiability and agency**.

### Competitors & adjacent patterns

| Pattern | Mechanism | Gap vs north star |
| --- | --- | --- |
| Classic one-page eng portfolio (e.g. brittanychiang.com) | About + experience + projects + writing | Strong craft/narrative; **static claims**; no live adoption instruments; no agent tools |
| “Agent portfolio” (e.g. iamomerraza.com) | Chat-first identity + demos | Correct *interaction* thesis; often **self-asserted** years/products without live npm/GitHub authority on-page |
| LinkedIn / GitHub only | Network graph / code graph | High data, **low decision packaging**; no single promise; no controlled agent persona |
| Product sites (sylphx.com, epiow.com) | Convert for a product | Right for products; wrong sole home for **person-level** multi-era proof |
| AI portfolio builders (Framer/Replit/etc.) | Generate lookalike sites fast | High volume, low trust; opposite of “proof surface” |

**Category position:** kylet.se should win **technical-founder identity with live instruments and a tool-using agent**, not “prettier static résumé” or “generic chat widget on a CV.”

### Industry standards that matter

- **MCP as agent I/O standard:** Anthropic’s Dec 2025 AAIF/Linux Foundation donation notes **10,000+ active public MCP servers**, platform adoption (ChatGPT, Cursor, Gemini, Copilot, VS Code, …), and **97M+ monthly SDK downloads** (Python + TypeScript). Building MCP servers is mainstream infrastructure work, not a hobby tag.  
  Source: [Anthropic — Donating MCP / AAIF](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation).
- **Portfolio craft bar:** real work, real screenshots/metrics, fast path to contact; accessibility and performance remain table stakes.
- **Trust for AI on public sites:** fail closed on credentials; rate limit; persona scope; no invented URLs (already in persona rules).
- **SEO / agent retrieval:** Person schema, canonical URL, honest robots/content signals — present at live edge; content must stay **agent-extractable** without depending on chat.

### What agents now make possible (and do not)

**Possible and on-mission**

- A visitor agent (or human) **interrogates** a constrained tool surface over live GitHub/npm instead of reading stale prose.
- **Contact is conversational** and still ends in user-owned mailto (no server-side CRM required for v1 of the job).
- **External agents** can call public JSON (`/stats`, `/projects`, …) as a mini identity API — portfolio as **machine interface**, not only HTML.
- Content maintenance can be **sync-from-truth** (already: `bun run sync`) rather than hand-edited vanity numbers.

**Not on-mission (even if fashionable)**

- General-purpose assistant, code generator, or research agent on Kyle’s wallet.
- Autonomous outbound email, CRM, or lead scoring as a product line.
- Multi-tenant “portfolio SaaS” inside this domain — that is a different company.

---

## 4. Design stance

### Core concept (one)

> **kylet.se is Kyle’s proof surface:** one promise, one living evidence graph, one agent that can only speak that graph, one action (engage).

Everything either **deepens** that concept or is cut.

### What “least system” looks like

| Layer | Least that still wins |
| --- | --- |
| Product concepts | Promise · Evidence · Agent · Engage |
| Human surfaces | One scroll narrative + one agent panel (Cmd+K) |
| Machine surfaces | One REST contract for evidence + chat |
| Runtime | Static edge + one API process |
| Content authorities | One live graph for *now*; one curated archive for *then*; no third inventory |
| Companies | Portals into eras of proof, not mini-sites |
| Business model | Not a product — attention → opportunity; cost is API/gateway discipline |

### Principle application (only material conflicts)

| Principle | Application |
| --- | --- |
| **Depth** | Flagship (pdf-reader-mcp) and “open to ventures” path go deep; long-tail repos stay expandable, not equal. |
| **Correctness** | Numbers and agent answers are live or labeled; broken chat is worse than no chat. |
| **Simplicity** | Integrate dual project catalogs, dual section IAs, dual stat narratives into one graph. |
| **Evolvability** | Contract in Rust remains the only public wire; static site stays disposable chrome over the graph. |
| **Observability** | Live/freshness/source fields stay first-class in UI and API. |
| **Performance & Velocity** | Static first paint; dynamic only for instruments and agent. |
| **Reliability** | Stale-on-fail; chat fail-closed; rate limits. |
| **Security** | No model keys in browser; trusted IP; CSP; persona jail. |
| **Economy** | Gateway spend only for on-mission chat; cache GitHub/npm aggressively. |

When principles conflict: **Correctness and Security win** (e.g. hide or hard-disable agent if gateway is unauthorized rather than stream errors that train distrust).

---

## 5. Planes that matter

Write only decisions that change the star. (No build order, no cost estimate.)

### Product & UX

**Exists in the destination**

- **Hero = instruments, not portrait collage.** Promise, availability, location, four live/verified stats, jump-into-graph.
- **Story = five eras as compressed credibility**, ordered so **AI is present tense**, scale history is proof of shipping, not nostalgia theater.
- **Work graph = the product.** Filter by capability pillars; primary signal set; detail drawer with live stars/downloads and “Ask AI about this.”
- **Agent = the interface for ambiguity.** Answers only from tools + persona; shows tool calls (proof of agency); contact flow drafts mailto.
- **Engage = one CTA.** “Talk to my AI” and social/mailto as escapes; **no multi-field form**.
- **Archive = optional depth** for 10M-download games and past products—reachable, not competing for first viewport attention.

**Does not exist**

- Blog/CMS as a required surface (writing can live elsewhere and link in).
- Separate “résumé PDF site” UX parallel to the graph (exportable résumé may exist as a *document*, not a second IA).
- Terminal cosplay as a second product (if kept, it is skin over the same graph/tools).
- Multiple chat personas, multi-language product shell, account system, notifications.

**Why:** Recruiters and partners do not need another medium; they need **confidence**. Games screenshots prove scale *after* AI proof lands, not instead of it.

### Developer experience (site as dogfood + open surface)

**Exists**

- Public, curl-friendly evidence API (already the REST set).
- Machine-readable Person + clear claim vocabulary (“live”, “stale”, “baked@time”).
- Repo that agents can edit safely: single contract, no TS backend authority, baked sync scripts.

**Does not exist**

- Proto/Connect/gRPC product wire without a consumer (already retired — keep retired).
- Public write APIs, webhooks, or OAuth for visitors.

### Engineering

**Exists**

- Static TS web · Rust API · nginx BFF · single contract modules (`contract.rs`, `tool_schemas.rs`).
- Gateway as sole inference path; env contract for AI credentials only.
- Honesty ladder for every instrument.

**Does not exist**

- Next.js server runtime as second API.
- Client-held secrets.
- Per-company microfrontends on this domain.
- Invented microservice split (chat vs stats) until load or failure isolation *forces* it—Economy + Simplicity.

### Operations

**Exists**

- Health, smoke against production, freshness labels in payloads, rate limits, fail-closed chat.
- Deploy as two Sylphx services (web + api) under Platform ownership.

**Does not exist**

- On-site status page product; pager theater for a personal site—minimal external status if Platform already covers it.
- Human content ops as the weekly job; **sync-from-upstream** is the ops model for numbers.

### Business model

**Exists**

- Opportunity engine: inbound fit for roles, ventures, collaboration, OSS adoption.
- Indirect: Sylphx/Epiow/Cubeage brand halo when relevant to the visitor’s job.

**Does not exist**

- Paid tiers, ads, lead-selling, affiliate mazes, “book a $X call” as the only door (calendly-style *may* exist as a secondary link if it increases engage rate; it must not replace the agent proof loop).
- Commercial ownership of products *inside* this repo (already `not-applicable` — keep).

### People & process

**Exists**

- Single human owner (Kyle) + agents maintaining content and code under the honesty contract.
- Persona and tools as the “press kit that talks.”

**Does not exist**

- Editorial team, multi-brand CMS workflow, community forum on-domain.

### Trust & governance

**Exists**

- Strict agent scope (Kyle only); refuse jailbreaks and off-topic in one line.
- No invented URLs or numbers; tools preferred over memory for traction claims.
- Security headers; CORS allowlist; trusted client IP for limits.
- Content-signal honesty at edge (search vs train) consistent with public posture.

**Does not exist**

- Training the world on private data through chat logs as a product feature.
- Shadow CRM of visitor transcripts without explicit product decision and retention policy—if chat logs exist operationally, they are **ops residue**, not a growth database, until governed.

### Portfolio (multi-company)

**Exists**

- Companies as **chapters** with one logo row + era detail, linking out to product homes (sylphx.com, epiow.com, …).
- Clear hierarchy: **AI infrastructure / Sylphx + flagship MCP** is the present identity; Epiow is co-current enterprise OS; Cubeage/MiniMax/Nakuz are scale pedigree.

**Does not exist**

- Equal billing of every legal entity on first paint.
- kylet.se as a holding-company portal or investor IR site.
- Ozyrix/accessory commerce as a first-class narrative pillar (unless it becomes material to the promise—today it dilutes).

---

## 6. Keep · Cut · Merge · Invent

### Keep (already right)

- Promise line and AI-infra positioning.
- Live `/stats` + WorkGraph linkage + baked `verifiedAt`.
- Rust-only API authority; static Next export.
- ADR-169 single JSON REST; Gateway Responses wire (when credentials correct).
- Agent contact flow (mailto user-owned send).
- Capability filters; flagship emphasis; security headers; rate limits.
- Dogfood narrative **when chat is green**.

### Cut (or hard-hide)

- **Any agent UI while gateway returns 401** — a broken differentiator destroys Correctness.
- **Third content inventory** (`projects.ts` as parallel authority where WorkGraph + catalog already cover the job).
- **Vanity complexity** that does not change the decision: extra chrome, dual terminals, decorative film grain, competing CTAs.
- **Unscoped npm tool paths** that return empty and train the agent to understate traction.
- **Stale persona/copy numbers** that lag live stats (801★ / 24K vs live 887★ / 28.8K) — persona must bind to tools or baked-with-time, not frozen boasts.
- **Noise companies** on the primary identity plane until they strengthen the promise.

### Merge

- **Story + companies** into one “eras of proof” system (one object model: Era → Role → Proof points → Outlinks).
- **Work + catalog + downloads** into one **Evidence Graph** object: Repo, Package, Metric, Capability, Era.
- **Contact + agent** into one Engage system (section is entry; panel is runtime).
- **Nav IA** with actual sections (either promote companies/products into the story model or demote them so DOM and nav share one map).

### Invent (only if it deepens the core)

1. **Claim Pack** — a single structured, copyable or machine-readable bundle: promise, live metrics with timestamps, flagship proof, open-to, contact. Serves humans (paste into hiring notes) and agents (retrieve once).
2. **Evidence Graph as the only content runtime** — UI and agent tools are projections of one graph, not sibling databases.
3. **Fit modes (not separate sites)** — soft intent: *Hiring · Partner · Adopt OSS · Curious*. Same graph, different first highlights and agent system preamble. Progressive disclosure, not five products.
4. **Public read API as intentional product** — document `/stats` `/projects` `/activity` as “Kyle’s live identity endpoints” for external agents (already de facto; make it a named capability).
5. **Archive drawer** — historical games/products compressed behind one control so scale pedigree remains available without stealing the AI present.

Do **not** invent: blog engine, auth, multiplayer, marketplace, second chatbot, company microsites-on-domain.

---

## 7. Major claims and strongest counters

| Claim | Counter | Why counter loses |
| --- | --- | --- |
| The differentiator is a **tool-using agent on live data**, not animation. | “Recruiters never open chat; they skim for 10 seconds.” | Skim path still needs instruments (hero stats + flagship). Agent is for the **high-value remainder** (fit Q&A, contact). Both share one graph—no second product. |
| **Static + small Rust API** is the right shape forever under this star. | “Just use Next server actions / one Node box.” | Separates cacheable identity chrome from credentialed spend and GitHub tokens; matches Security + Economy; already proven as deploy shape. |
| **Historical games catalog is secondary.** | “10M downloads is the strongest proof; lead with games.” | Strong pedigree, wrong category signal for 2026 AI-infra buyers; belongs as depth after present-tense proof. |
| **No contact form** is correct. | “Forms convert better; agents drop off.” | Forms collect low-quality noise; agent + mailto keeps human intent and demonstrates the builder’s stack. Fallback mailto/social always present. |
| **Cut dual content authorities.** | “More data looks more impressive.” | Unintegrated data is complexity without depth; wrong stars/npm empty series actively harm trust. |
| **Chat must be correct or absent.** | “Leave the button; 401 is temporary.” | Live probe shows failure **now**; a public 401 teaches the opposite of craft. Correctness > feature checkbox. |
| **kylet.se is not Sylphx marketing.** | “Maximize platform signups from the personal domain.” | Confuses personal trust with product conversion; sylphx.com owns product. Halo via dogfood is enough. |
| **Activity honesty matters more than large numbers.** | “Show the biggest commit count available.” | ADR already rejected over-reporting calendars; inflated instruments destroy the brand of proof. Prefer explainable metrics even if smaller. |

---

## 8. Residuals and honesty gaps (present → destination)

These are not implementation tasks; they are **truth debts** the north star forbids carrying forward as permanent state:

- Live chat **401 unsupported_credential** — differentiator offline.
- Persona and some catalog copy **lag live stats**.
- `/downloads` empty for unscoped package names — agent/tool footgun.
- Dual project inventories and section/nav mismatch — cognitive and maintenance tax.
- `/activity` magnitudes (e.g. multi-thousand weekly commits) need **human-legible interpretation** in UI (what is counted) so honesty does not look like exaggeration.
- Historical metrics (10M downloads, 10M MAU, 500K users) remain **self-attested career claims**—acceptable as pedigree if not presented with the same “live” badge as GitHub/npm instruments.

---

## 9. The North Star

### What the project should become

**kylet.se is the most trustworthy, least-noisy proof surface for Kyle Tse—an AI infrastructure builder—where humans and agents decide and engage against live evidence.**

It is a **single integrated system** with four user-facing concepts:

1. **Promise** — one sentence of present identity.  
2. **Evidence** — a living graph of work, adoption, and eras (live or time-labeled).  
3. **Agent** — a constrained representative that can only read that graph and help engage.  
4. **Engage** — contact/hire/partner/adopt without forms or a second product.

The site’s highest compliment is not “beautiful.” It is: **“I verified it in two minutes and messaged him.”**

### What exists in that world

- One domain, one narrative spine, one evidence graph, one agent, one engage path.
- Live GitHub/npm instruments with freshness; flagship MCP proof in the first screen of work.
- An agent that **works**: tools fire, numbers match public registries, contact drafts are useful.
- Eras of shipping (games, social, portal, enterprise) as **compressed credibility**, not a museum that outranks the present.
- Outlinks to Sylphx, Epiow, GitHub, npm as the real product homes.
- A curlable identity API for external agents.
- Static edge performance; Rust authority for truth and spend; fail-closed security.
- Maintenance via sync-from-upstream and graph updates—not weekly copy fiction.

### What does not exist in that world

- A second mental model (terminal product, blog product, company portal product, résumé product) competing with the proof surface.
- Broken AI theater.
- Vanity metrics without source/time.
- Contact forms, lead funnels, ads, paid tiers on this domain.
- Proto/Connect theater, TS backend authority, browser secrets.
- Exhaustive repo dumps as the primary UI.
- Equal-weight distraction brands and residual dual catalogs.
- Backward-compatibility with any past stack choice that fails Correctness or Simplicity.

### Why

The scarce resource for a technical founder in the MCP/agent era is **credible attention**. MCP is standard infrastructure (10k+ public servers, major clients, huge SDK download volume); markets are flooded with static “AI engineer” pages and chat widgets that cannot prove anything.

kylet.se wins by **least system, maximum decision quality**: integrate identity, instruments, and agent into one proof surface—then stop. Everything else is someone else’s product site, or noise.

---

*End of north star. Implementation, sequencing, and cost are a later phase and may not shrink this vision.*
