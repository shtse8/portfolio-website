---
version: alpha
name: Kyle Tse
description: Personal site of Kyle Tse, founder and engineer. Warm paper, black ink and one signal-orange accent taken from the K mark.
colors:
  primary: "#FF6B2C"
  primary-hover: "#FF8248"
  on-primary: "#141413"
  secondary: "#141413"
  on-secondary: "#FAF8F4"
  surface: "#FAF8F4"
  on-surface: "#141413"
  surface-container: "#F0EDE6"
  on-surface-variant: "#55534E"
  outline: "#D9D5CC"
  link: "#B5400F"
  error: "#B3261E"
  on-error: "#FFFFFF"
  surface-dark: "#121211"
  on-surface-dark: "#EDEAE3"
  surface-container-dark: "#1C1C1A"
  on-surface-variant-dark: "#A3A097"
  outline-dark: "#34332F"
  link-dark: "#FF8A55"
  error-dark: "#F2B8B5"
typography:
  display:
    fontFamily: Newsreader
    fontSize: 64px
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 40px
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.01em
  stat:
    fontFamily: Newsreader
    fontSize: 56px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.02em
    fontFeature: '"lnum", "tnum"'
  title:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 19px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  label-md:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.2
  mono-sm:
    fontFamily: Geist Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.02em
  eyebrow:
    fontFamily: Geist Mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.08em
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 14px
  full: 9999px
spacing:
  unit: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  section: 120px
  measure: 680px
  content: 1120px
  gutter: 24px
  margin: 24px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: 14px 22px
    height: 48px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: 13px 21px
    height: 48px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 12px 14px
    height: 48px
  card:
    backgroundColor: "{colors.surface-container}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: 32px
  nav:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    height: 64px
  stat-block:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.stat}"
    padding: 24px
  work-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.title}"
    padding: 24px 0px
  work-row-hover:
    backgroundColor: "{colors.surface-container}"
  text-link:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.link}"
    typography: "{typography.body-md}"
  page-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-surface-dark}"
    typography: "{typography.body-md}"
  card-dark:
    backgroundColor: "{colors.surface-container-dark}"
    textColor: "{colors.on-surface-variant-dark}"
    rounded: "{rounded.lg}"
    padding: 32px
  text-link-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.link-dark}"
  input-error-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.error-dark}"
    typography: "{typography.mono-sm}"
  divider-dark:
    backgroundColor: "{colors.outline-dark}"
    height: 1px
---

# Kyle Tse

## Overview

kylet.se is Kyle Tse's personal site: a founder and engineer who has shipped consumer software to millions of people for twenty years and now builds Sylphx, a software company that runs on AI agents. Readers are investors, partners, engineers and press who arrive from a link, decide in under a minute whether he is serious, and either open the work or get in touch. The site's job is credibility, a clear map of what he builds, and one obvious way to reach him.

The look is an **engineer's editorial page**: warm paper, black ink, a serif for the human voice, a mono for facts, and a single orange signal borrowed from the square dot in the K mark. It reads like a well-set magazine profile written by someone who also writes Rust. Calm, dense with real numbers, no decoration that doesn't carry information.

**Name and mark.** The name is always "Kyle Tse"; the domain is written `kylet.se` in lowercase. The mark is the existing K monogram: an Ink rounded tile, a Paper K and a Signal Orange square at the lower right. The wordmark is "Kyle Tse." in Geist with the same orange square as its full stop. Keep both exactly as drawn. The orange dot is the one accent kylet.se shares with Keel Engine; everything else here (paper, serif, mono annotations) is the personal brand's own. kylet.se is personal and outside the company namespace: it links to Sylphx, Keel Engine and the apps but never adopts their logos, palettes or type.

**Voice.** First person, plain, specific. Short declarative sentences with a number or a name in them ("Twenty years of consumer software." "10M+ downloads."). No hype words, no "passionate", no "revolutionising", no emoji. Claims are verifiable and already public.

**Images and social posts.** Typographic first: Paper (#FAF8F4) or Ink (#141413) background, a Newsreader headline, one Geist Mono eyebrow line, the K mark in a corner, and at most one Signal Orange element. Products appear as letter tiles or as real screenshots in a plain frame, never as borrowed logos. The only photograph allowed is a natural-light portrait Kyle supplies; no stock, no generated people. No gradients, 3D blobs, neon, glowing circuits, robots or AI-brain clichés, and no anime or game-character art.

## Colors

Two neutrals and one accent. Orange is a signal, not a theme: it appears at most once or twice per view.

- **Signal Orange (#FF6B2C):** `primary`. The dot in the K mark. Primary button fill, the active nav marker, a single highlight in a chart or image. Text on it is always Ink (#141413), never white.
- **Ink (#141413):** `on-surface`, `secondary`, `on-primary`. All body text and headings; fill for the logo tile and for ink-background social cards, with Paper (#FAF8F4) text as `on-secondary`.
- **Paper (#FAF8F4):** `surface`. The page. Warmer than white so long reading feels like print.
- **Stone (#F0EDE6):** `surface-container`. Cards, hover rows, code blocks.
- **Graphite (#55534E):** `on-surface-variant`. Captions, dates, metadata, secondary copy.
- **Rule (#D9D5CC):** `outline`. Hairline dividers and input borders; never used for text.
- **Rust Link (#B5400F):** `link`. Inline links and orange text on paper; passes AA where Signal Orange text would not.
- **Error (#B3261E)** with **on-error (#FFFFFF)** for form errors only.

Dark mode follows the system setting and keeps the same roles: **Night (#121211)** `surface-dark`, **Charcoal (#1C1C1A)** `surface-container-dark`, **Bone (#EDEAE3)** `on-surface-dark`, **Ash (#A3A097)** `on-surface-variant-dark`, **Night Rule (#34332F)** `outline-dark`, **Ember Link (#FF8A55)** `link-dark`, **Error Dark (#F2B8B5)** `error-dark`. Signal Orange stays #FF6B2C with Ink text in both modes.

## Typography

Three families, each with one job. All are free under the SIL Open Font License and cover Latin Extended; the site ships in English.

- **Newsreader** (display, headlines, stats): the human voice. Medium 500 for headlines, Regular 400 for big numbers with lining tabular figures. Fallback: `Georgia, "Times New Roman", serif`.
- **Geist** (body, UI, titles): neutral and precise. 19px body on article pages, 16px elsewhere. Fallback: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- **Geist Mono** (eyebrows, years, domains, repo slugs, languages): the engineer's annotation layer. Eyebrows are uppercase with 0.08em tracking. Fallback: `ui-monospace, "SF Mono", Menlo, Consolas, monospace`.

If a Chinese name ever appears (for example a product's Chinese title), set it in **Noto Serif TC** next to Newsreader or **Noto Sans TC** next to Geist. Never set a heading in Geist or body copy in Newsreader. Two weights per family per view at most.

## Layout

A single editorial column on a 12-column grid. Prose holds to a 680px measure (`spacing.measure`); grids of cards, stats and work rows widen to 1120px (`spacing.content`). On mobile, one column with 24px side margins.

Spacing is an 8px scale (4px half-step for icon alignment). Sections are separated by 120px on desktop and 72px on mobile, each opened by a mono eyebrow and a Newsreader headline. Page order: hero (name, one-sentence role, two buttons), track record stats, what he builds now, apps, open source, contact. Generous whitespace is the luxury here; never fill it with decoration.

## Elevation & Depth

Flat, like print. Hierarchy comes from type size, the paper-to-stone tonal step and 1px Rule (#D9D5CC) hairlines, not shadows. Cards sit on Stone (#F0EDE6) with no shadow. The one permitted shadow is for menus and dialogs: `0 8px 24px rgba(20, 20, 19, 0.12)`. In dark mode, depth is Night to Charcoal, no shadows.

## Shapes

Mostly square with a small, consistent softness echoing the rounded K tile. Buttons and inputs use 8px (`rounded.md`), cards 14px (`rounded.lg`), tags and code chips 4px (`rounded.sm`). `rounded.full` is only for avatars and the active nav dot. Dividers are full-width 1px hairlines. The Signal Orange square from the mark (with its 1.6/7.5 corner ratio) may be reused as a bullet or section marker.

## Components

- **button-primary:** Signal Orange (#FF6B2C) fill, Ink label, 48px tall. One per view ("Get in touch"). Hover lightens to Signal Light (#FF8248, `primary-hover`); focus shows a 2px Ink outline offset 2px.
- **button-secondary:** Paper fill, Ink label, 1px Ink border. For "See the work" and other secondary actions.
- **input:** The site has no forms today; this governs any future field such as search. Paper fill, 1px Rule border, darkening to Ink on focus; label above in `label-md`, helper and error text below in `mono-sm`, errors in Error (#B3261E).
- **card:** Stone (#F0EDE6), 14px radius, 32px padding. Mono eyebrow (domain, e.g. `sylphx.com`), Geist `title`, Graphite description, then tags. Used for Sylphx, Keel Engine and the open-source tools.
- **nav:** 64px bar on Paper with the K mark and "Kyle Tse" on the left, Work / About / Contact on the right in `label-md`. The current page gets a 6px Signal Orange dot under it. A Rule hairline appears only after scrolling.
- **stat-block:** the track record. Newsreader `stat` number (10M+, 500K+), a Geist label underneath, a mono year range above (2010–2016). Arranged in a row of three or four separated by Rule hairlines, never inside boxes.
- **text-link:** Rust Link on Paper, underlined at 0.18em offset with a 1px line.
- **Dark variants** (`page-dark`, `card-dark`, `text-link-dark`, `input-error-dark`, `divider-dark`): same geometry, dark-mode tokens swapped in by role.
- **work-row:** the list of apps and companies. One row per item: name in `title`, one-line description in Graphite, domain in `mono-sm` on the right, a chevron that shifts 4px on hover. Rows are divided by hairlines; hover fills Stone.

## Do's and Don'ts

- Do lead every section with a fact or number, not an adjective.
- Do keep Signal Orange to one or two elements per view and always put Ink text on it.
- Do use Rust Link (#B5400F) or Ember Link (#FF8A55) for orange text; never set body text in #FF6B2C.
- Do set every year, domain, repo slug and language tag in Geist Mono.
- Do keep the K mark exactly as drawn: ink tile, paper K, orange square.
- Don't add gradients, glassmorphism, glow, drop shadows on cards or stock photography.
- Don't borrow the Sylphx, Keel Engine, Cubeage or any app's colours, logos or type for the personal brand.
- Don't use more than three families or more than two weights of one family in a view.
- Don't centre long paragraphs or let prose exceed the 680px measure.
- Don't publish any personal fact that is not already on the public site.
