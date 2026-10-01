# kylet.se design

kylet.se is built with Keel Engine and is a sibling of keelengine.dev. This is a
personal site with nothing for sale, so the company's monetisation menu
(`standards/mechanics.md`) does not apply. Success is judged by the outcomes in
[vision.md](../vision.md): Lighthouse mobile 95 or better, WCAG 2.2 AA, no
sideways scroll at 320 px.

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
- Hover, focus and pressed states (card lift, row tint, button press) are
  `SurfaceStates` on the theme; the base text face, canvas, link colours and
  focus ring are theme fields.
- `site/assets/site.css` holds only what the theme cannot say yet. Each block
  names the Keel issue that replaces it: display and mono font families
  (keel#3821), shadows and hairlines (keel#3871), stacking (keel#3941),
  positions, the skip link and safe-area insets (keel#3942, keel#4060), the
  scene caption following the engine view's state (keel#4060) and decoration
  layers (keel#3817).
- **Content Security Policy:** `keel pack` writes it (keel#4068): each page
  carries a meta policy with the SHA-256 of its own inline styles, and the
  pack's `_headers` adds `frame-ancestors` and covers every other file. No
  `'unsafe-inline'` anywhere. nginx serves the pack's `_headers`
  (`hosting/pack-rules.sh`) and adds only HSTS and a permissions policy.

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

Defaults here are judgement, not law: change one when it serves a visitor
better, and record why beside it.

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
