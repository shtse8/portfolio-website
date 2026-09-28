# kylet.se design

Status (2026-09-28): built with Keel Engine (#86). kylet.se is the second
Stage 1 pilot of websites on Keel, after keelengine.dev.

| File | What it holds |
| --- | --- |
| [content.md](content.md) | Every line of copy, its source, and what is left out on purpose |
| [tokens.json](tokens.json) | Colour, type, space, radius, elevation and motion tokens (light and dark); `site/src/theme.rs` implements them |
| [brand/](brand/) | Design sources: wordmark and lockup SVGs (and `wordmark.py`), the square and maskable icon SVGs |
| `site/assets/` | What ships: `mark.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192/512.png`, `icon-maskable-512.png`, `og.png`, the scene poster |
| [screens/](screens/) | Screenshots of the built site: every page at 390, 820 and 1440 px, light and dark (`tests/shots.mjs`) |

## Brand

- **Positioning:** Kyle Tse has shipped consumer software to millions of
  people for twenty years, and now builds Sylphx, a software company that runs
  on AI agents. The site says it plainly: his name, one line, the track record,
  the work, the story, the contact.
- **Personality:** precise, calm, hands-on.
- **References:**
  - rauchg.com, leerob.com and paco.me: founder and engineer sites that lead with type and keep chrome to a minimum.
  - iOS Settings: the inset grouped lists.
  - keelengine.dev: this site's sibling. It shares the ember accent and the live Keel scene.
- **Mark:** a white "K" with an ember dot on an ink rounded square
  (`site/assets/mark.svg`). The dot is the Keel family accent. The mark reads
  at 16 px.
- **Wordmark:** "Kyle Tse." outlined from Geist 620 (SIL OFL 1.1), with the
  same ember dot (`brand/wordmark-*.svg`, rebuilt by `brand/wordmark.py`). The
  home page hero sets the name in type with the same dot.
- **The domain:** kylet.se reads as "Kyle Tse". The colophon says so once, in
  a quiet note; nowhere else makes a point of it.
- **Imagery:** no photos of people and no product logos. Products appear as
  letter tiles, and the only picture is the live Keel scene. The scene is
  keelengine.dev's hero scene (`scenes/`), so its poster, a `keel shot`
  capture from that site, shows exactly what starts.

## Design system

- **Type:** system fonts only: SF on Apple devices, Segoe UI on Windows,
  Roboto on Android. Nothing downloads, so text never shifts.
- **Colour:** warm neutral canvas, white cards, and ink text. The ember accent
  is used for links, and the ember colour itself only as decoration.
- **Dark mode:** a designed palette, not an inversion. Cards separate with
  hairlines instead of shadows. The contact card sits on a raised surface
  instead of inverting. The Keel stage stays dark in both modes.
- **Feel:**
  - iOS-style inset grouped lists for apps, companies and links;
  - a translucent sticky header;
  - press states that scale slightly;
  - 44 px minimum touch targets (links inside sentences excepted, WCAG 2.5.8);
  - safe-area insets;
  - `prefers-reduced-motion` removes every transform.
- **Track record:** each company's figures beside its name, in the card type
  of the page: no counters, no animation, no adjectives.

## How the design maps onto Keel

- `site/src/theme.rs` holds the tokens and one `SurfaceStyle` per surface
  role, built by one function over a palette. The pages are drawn with the
  light theme.
- **Dark:** a `Site` takes one theme, and surface colours are literal in their
  class rules, so the dark scheme is the same theme on the dark palette,
  emitted by `keel_web::theme_stylesheet` into `site/assets/dark.css` under
  `prefers-color-scheme: dark`. A test fails when the file is stale. It goes
  when Keel emits a scheme pair (keel#4060).
- `site/assets/site.css` holds only what the theme cannot say yet. Each block
  names the Keel issue that replaces it: system font families (keel#3821),
  shadows and hairlines (keel#3871), stacking (keel#3941), positions and
  safe-area insets (keel#3942, keel#4060), the engine view poster (keel#3911),
  decoration layers (keel#3817) and hover, focus and pressed states
  (keel#3816).
- The content security policy is served by nginx (`hosting/headers.conf`)
  until keel-pack emits one (keel#3808). It allows no inline script; styles
  need `'unsafe-inline'` until then, because each page's styles are one inline
  `<style>` element.

## Pages

| Route | Job | Sections |
| --- | --- | --- |
| `/` | Who is this, what has he done, what does he build, how do I reach him | Hero (name, one line, the live scene) · Track record · Building now (Sylphx, Keel Engine) · Apps · Open source · Companies · Contact |
| `/about` | The longer story | Intro · timeline since 2006, with each company's scale · how we build · elsewhere |
| `/colophon` | How the site is made, and privacy | The name · Built with Keel · live scene · hosting · type · Privacy (`#privacy`) |
| 404 | Recover | Short message, Home, About |

Scene states: poster, starting, live, paused (reduced motion, with a Play
button), and failed or no GPU, where the poster stays. The caption's dot turns
green when the scene is live. The site is static and has no forms, sign-in,
loading or empty states.

**Redirects (301):** `/story` → `/about`, `/work` → `/#work`, `/contact` →
`/#contact` (`Route::redirect`; nginx serves the pack's `_redirects`).

**Gone (410):** the retired API's paths (`/stats`, `/activity`, `/projects`,
`/recent`, `/repo`, `/downloads`, `/claims`, `/chat`, `/healthz` and below),
in `nginx.conf`.

## API and on-site agent: retired

See [ADR-170](../adr/ADR-170-keel-site-api-retired.md). The API was
stateless, so nothing was lost.

## Hosting

kylet.se stays on Sylphx Hosting (org `shtse8`, project `curl-nod-67h1zf`).
The image build runs `keel pack` and serves the pack with nginx. It reads the
private Keel repository through the `keel_git_token` build secret declared in
`sylphx.toml` (SylphxAI/cloud#9149).
