# kylet.se content

Every visible claim, and where it comes from. The site renders these facts from
`site/src/content.rs` and the page copy in `site/src/pages.rs`. It is English
only, because the site ships no zh-Hant.

Sources:
- the previous site `src/data/*.ts`, as of commit 5ef7d84;
- owner `company/portfolio.md` and `company/names.md`;
- public GitHub, as of 2026-09-26;
- each product's own site: its title and meta description, fetched 2026-09-26;
- Kyle, 2026-09-28 (relayed by the coordinator): "all true". He confirmed the
  roles and years, the scale figures, the links and the address below.

## Home

| Copy | Source |
| --- | --- |
| "Kyle Tse" (the name as the hero), "Founder of Sylphx" | previous site `roles.ts` (Sylphx, Founder, 2025-05); GitHub profile company `@SylphxAI` |
| "I've shipped consumer software to millions of people for twenty years. Now I'm building Sylphx, a software company that runs on AI agents." | the track record below (confirmed by Kyle, 2026-09-28); positioning from the coordinator, 2026-09-28 |
| "Sylphx makes one platform for hosting, data, auth and AI; Keel Engine…; and the apps and open-source tools that run on them." | portfolio.md rows 1 (Sylphx) and 3 (Keel) and the apps |
| Track record: Cubeage (2014–) 10M+ downloads; MiniMax (2010–2016) 10M+ monthly active users, 30+ games; Nakuz (2006) 500K+ users, 3K+ online at once, 100+ partners | previous site `roles.ts` (marked self-attested there); **confirmed by Kyle, 2026-09-28** |
| Sylphx: "One platform for hosting, databases, auth, AI, workflows and sandboxes: one account, one API key, one SDK and one bill." | sylphx.com meta description |
| Keel Engine: "One Rust engine for games, apps and websites… agents drive it from the command line." | keelengine.dev meta description |
| "Both are built mostly in Rust." | GitHub languages: SylphxAI/cloud is mainly Rust; Keel is a Rust engine |
| Spiron, Kalkas, Puzzled, Viszy, Luzzy, Tryit one-liners | each site's meta description (spiron.ai, kalkas.ai, puzzled.gg, viszy.ai, luzzy.chat, tryit.fun) |
| "Each app has its own name and site. Sylphx builds and publishes them." | portfolio.md positioning (2026-09-26) |
| anymd, repomap, lockdocs, Firestore ODM, Mark, Google Photos Delete Tool | GitHub repository descriptions; all MIT (GitHub licence field) |
| Companies: Sylphx (UK, Founder), Epiow (UK, Co-founder & CTO), Cubeage (Hong Kong, Founder & CEO) | previous site `roles.ts` and `organizations.ts`; confirmed by Kyle, 2026-09-28 |
| Epiow: "Business software for organisations: HR, payroll, leave, projects and records in one workspace." | epiow.com meta description (translated from zh-Hant) |
| Cubeage: "Mobile board and card games: Hong Kong mahjong, Big Two, Taiwanese mahjong and more." | cubeage.com home page |
| hi@kylet.se, github.com/shtse8, linkedin.com/in/shtse8 | previous site `personal.ts`; confirmed by Kyle, 2026-09-28 (mail for kylet.se is hosted by Migadu) |

## About

| Copy | Source |
| --- | --- |
| Timeline: Nakuz 2006 (Co-founder & CTO), MiniMax Game Entertainment 2010–2016 (Co-founder & CEO, also traded as Funimax), Cubeage 2014– (Founder & CEO), Epiow 2025– (Co-founder & CTO), Sylphx 2025– (Founder) | previous site `roles.ts` and `organizations.ts`; confirmed by Kyle, 2026-09-28 |
| The scale line under Nakuz, MiniMax and Cubeage | as the track record above; confirmed by Kyle, 2026-09-28 |
| "Twenty years of starting things." | 2006 to 2026; confirmed by Kyle, 2026-09-28 |
| MiniMax "teams in Hong Kong, Taiwan and mainland China" | previous site `roles.ts` ("offices in Hong Kong, Taiwan and China") |
| Cubeage "games are moving to Keel Engine" | portfolio.md ("Every Cubeage title moves onto it") |
| "Keel Engine is proprietary and licensed to teams by agreement." | keelengine.dev footer |
| "Every product runs on Sylphx itself" | owner standards/architecture.md (an app uses Sylphx for hosting, data, auth…) |

## Colophon

| Copy | Source |
| --- | --- |
| "Say kylet.se out loud and you get Kyle Tse. The .se is Sweden's domain, chosen for the way it reads." | Kyle, via the coordinator, 2026-09-28 |
| Built with Keel Engine; the live scene; hosted on Sylphx Hosting; system fonts; light and dark follow the device | this repository (`site/`, `sylphx.toml`, `site/assets/site.css`) |
| Privacy: no cookies, analytics, forms or tracking; Sylphx Hosting and Cloudflare process request data to deliver and protect the site | this repository (no script but the contact island and the scene; no cookies set); `kylet.se` answers `server: cloudflare` |

## Left out on purpose

- **Ozyrix.** It is Kyle's wife's company; he develops for it but it is not his (Kyle, 2026-09-28).
- **Stack Overflow.** Kyle has not used it for years (2026-09-28).
- **"20+ years" as a claim of its own.** The timeline and the about heading say it once.
- **Live star and download counts.** A static number goes stale, and the old live source served nothing.
- **Personal details:** "Open to new ventures", "Available for remote work", and a location.
- **Other products:** Tachyn (tachyn.ai not live) and Number Grove (no store listing yet); Korvana, BGCA and internal tools.

## Facts for Kyle to confirm

None open. Everything above was confirmed on 2026-09-28.
