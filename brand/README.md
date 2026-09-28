# Kyle Tse brand

This folder is the source of truth for the kylet.se brand: the SVG masters, the
colour and type tokens, and every icon the site serves. A surface copies a file
from here; it never redraws the logo or picks its own colour. Rebuild everything
from the masters with `brand/build.py`:

```bash
python3 brand/build.py            # rebuild the favicons, app icons and tokens (needs pillow, resvg-py, numpy)
python3 brand/build.py --resnap   # also redraw the 16/32 px pixel grids from the master
python3 brand/build.py --check    # verify every hash and surface copy (stdlib only; CI runs this)
```

## Name

**Kyle Tse** in running text, both words capitalised; the site never sets it in
capitals or in the lowercase. The wordmark draws the same two words and ends in
the ember dot: the dot belongs to the drawing, and is never typed after the
name. **kylet.se** reads as "Kyle Tse"; the colophon says so once (`.se` is
Sweden's domain, chosen for the way it reads) and nowhere else makes a point of
it. The site ships English only, so there is no local-script name.

- **Operator:** the footer carries the one legal line: "© 2026 Kyle Tse.
  Sylphx, Keel Engine and the apps named here are products of Sylphx Limited."
  The site is Kyle's own and Sylphx Limited is the company behind the products
  it names, never part of this brand: it does not join the mark, the wordmark,
  the domain or the page copy.

## Files

| Need | File |
| --- | --- |
| Header mark, app icon master, favicon source | `svg/kylet-symbol.svg` |
| Full-bleed square master (iOS home screen) | `svg/kylet-app-icon-square.svg` |
| Full-bleed master for Android (maskable) | `svg/kylet-maskable.svg` |
| Wordmark on light backgrounds | `svg/kylet-wordmark.svg` |
| Wordmark on dark backgrounds | `svg/kylet-wordmark-on-dark.svg` |
| The mark and the wordmark together | `svg/kylet-lockup.svg` |
| One-colour printing, engraving, stamps | `svg/kylet-symbol-black.svg`, `svg/kylet-symbol-white.svg`, `svg/kylet-lockup-black.svg`, `svg/kylet-lockup-white.svg` |
| Browser tab: the 16 and 32 px pixel grids, their SVG and the ICO | `favicon/grid-16.txt`, `favicon/grid-32.txt`, `favicon/favicon.svg`, `favicon/favicon.ico` |
| Home screen and install PNGs | `app-icon/apple-touch-icon-180.png`, `icon-192.png`, `icon-512.png`, `icon-1024.png`, `icon-maskable-192.png`, `icon-maskable-512.png` |
| Colour and type values, machine-readable | `tokens.json` (and the generated `tokens.css`) |
| Which master feeds which file, and which surface copies what | `brand.json` |
| Rebuilding the wordmark from Geist | `wordmark.py` |

The viewBoxes are tight to the artwork. Clear space is added where the logo is
placed, not inside the file.

## Colours

| Token | Hex | Use |
| --- | --- | --- |
| `ink` | `#111113` | The mark's tile; headings and primary text; light theme |
| `ink-dark` | `#F4F4F5` | Headings and primary text; dark theme |
| `paper` | `#FAFAF9` | The K on the tile, and the wordmark on dark; the drawing's white |
| `canvas` | `#F5F5F3` | Page background; light theme |
| `canvas-dark` | `#0A0A0B` | Page background; dark theme |
| `surface` | `#FFFFFF` | Cards and grouped lists; light theme |
| `surface-dark` | `#161618` | Cards and grouped lists; dark theme |
| `ember` | `#FF6B2C` | The dot: the Keel family accent; decoration only, never text |
| `accent` | `#C2410C` | Text links and arrows; light theme |
| `accent-dark` | `#FF8A4C` | Text links and arrows; dark theme |

The mark's ink tile carries its own ground, so the symbol is the same file on a
light page and a dark one. The ember is brighter than the accent on purpose: it
is a 7.5/64 of the tile dot, never body text.

## Type

System faces only, so nothing downloads and nothing shifts
(docs/design/tokens.json):

- **Text:** `-apple-system`, then Segoe UI, Roboto and the platform sans-serif.
- **Display:** the same stack with the display cuts, for the hero name and
  headlines.
- **Mono:** `ui-monospace`, SF Mono, Cascadia Code, Roboto Mono.

The **wordmark** is outlined artwork, not a live font: Geist at weight 620 (SIL
Open Font License 1.1) was drawn once and converted to paths, so no font file
ships and no licence follows a page. `wordmark.py` rebuilds it with fontTools;
it needs the Geist Sans variable font, which the repository does not carry. The
file is `Geist-Variable.woff2` from the `geist` npm package (Vercel,
`dist/fonts/geist-sans/Geist-Variable.woff2`) or from a `vercel/geist-font`
release:

```bash
python3 brand/wordmark.py 'Kyle Tse' 620 /path/to/Geist-Variable.woff2
```

It prints the path bounds on stderr and the path commands on stdout; the
committed wordmark SVGs are that path under `viewBox="40 -760 4200 940"` with
the ember dot drawn as a rect after the last glyph. Never retype the wordmark in
a font.

## Small sizes

At 16 and 32 px the mark is drawn on the pixel grid: the tile, the K and the dot
in the same places, so nothing greys out. `build.py` renders the master at 8x,
takes the nearest colour from `icon.palette` (`#111113`, `#FAFAF9`, `#FF6B2C`)
for each sample, and keeps a pixel when at least half of it is filled
(`snap_threshold`); a pixel under half filled is empty, which is what rounds the
tile's corners. The result is a character grid:

- `favicon/grid-16.txt` - 16x16
- `favicon/grid-32.txt` - 32x32, and `favicon/favicon.svg` is this grid as one
  path per colour

Both grids are hand-editable: `.` is empty and `A`, `B`, `C` index the palette in
the file header. `build.py` draws from the grid on every run, so an edit sticks
until someone runs `--resnap`, which redraws the grid from the master. The
favicon does not change in a dark browser theme (`dark_map` is unset), because
the mark's own tile is the ground.

## Clear space and minimum size

- **Clear space:** not yet specified (docs/design/README.md does not name one).
- **Minimum size:** the design doc's one edge: the mark reads at 16 px, which is
  where the favicon files take over. No printed minimum is specified.

## Do

- Use the files in this folder as they are, scaled evenly.
- Use the mark, the lockup or the wordmark; the symbol is the same file on light
  and dark pages, because the ink tile is its own ground.
- Use `svg/kylet-wordmark.svg` on light backgrounds and
  `svg/kylet-wordmark-on-dark.svg` on dark ones.
- Use the `-black` and `-white` files where only one ink is available: the tile
  is drawn in that ink and the K and the dot are knocked out of it, so the
  ground shows through the letter and the dot.
- Keep the ember dot decoration: it is the Keel family accent, never text and
  never a signal on its own (`tokens.json`).
- Keep the site's imagery rule: no photos of people and no product logos;
  products appear as letter tiles, and the only picture is the live Keel scene.

## Don't

- Don't retype the wordmark in a font: it is drawn, and no system font matches
  it. (The home page hero sets the name as page type with the same ember dot on
  purpose; that is the page's type, not the wordmark.)
- Don't recolour the mark, the wordmark or the dot, and don't add a second
  accent colour.
- Don't stretch, squash, rotate or skew the logo, and don't re-space the mark
  and the wordmark against each other: use a lockup file.
- Don't add shadows, glows, bevels, outlines or textures to the mark; the ink
  tile, its rounded corner and the dot are the whole drawing.
- Don't put "Sylphx" in or beside the logo: the operator is not part of the
  brand.

## Surfaces

Every file below is a byte copy of the brand file it names, written by
`brand/build.py`; `--check` fails if one drifts.

| Surface (URL the site already serves) | Brand file |
| --- | --- |
| `site/assets/mark.svg` (`/assets/mark.svg`) | `svg/kylet-symbol.svg` |
| `site/assets/favicon.ico` (`/assets/favicon.ico`) | `favicon/favicon.ico` |
| `site/assets/apple-touch-icon.png` (`/assets/apple-touch-icon.png`) | `app-icon/apple-touch-icon-180.png` |
| `site/assets/icon-192.png` | `app-icon/icon-192.png` |
| `site/assets/icon-512.png` | `app-icon/icon-512.png` |
| `site/assets/icon-maskable-512.png` | `app-icon/icon-maskable-512.png` |

`site/src/lib.rs` links the favicon, the mark, the apple-touch icon and the
manifest; `site/assets/site.webmanifest` lists the 192, 512 and maskable 512
icons; `site/assets/site.css` fills the header mark from `/assets/mark.svg`.
Every size the site declares matches the file here (180, 192, 512, maskable
512).

**Surfaces still to move** (each still draws or hard-codes the brand itself):

- `site/assets/og.png` - the 1200x630 social card (`site/src/lib.rs`
  `og_image`). It draws the mark, an outlined headline and a still of the Keel
  scene; the repository has no vector master of it, so this folder cannot
  rebuild it. It belongs in `og/` here as soon as someone draws that master.
- `site/assets/site.webmanifest` - `theme_color` and `background_color` are the
  canvas hex `#f5f5f3` as literals; they should read the `canvas` token.
- `site/src/theme.rs` - the palettes are Rust constants (Keel has no token-file
  import yet). A unit test in `site/src/tests.rs` reads this folder's
  `tokens.json` and fails when a constant drifts from its token, so the theme
  cannot quietly change colour on its own.

## Provenance

The masters came in with the 2026-09-28 Keel redesign of kylet.se (#86, branch
`kyle/keel-redesign`), commit `0ff7f44`:

| Was | Now |
| --- | --- |
| `docs/design/brand/icon-square.svg` | `svg/kylet-app-icon-square.svg` |
| `docs/design/brand/icon-maskable.svg` | `svg/kylet-maskable.svg` |
| `docs/design/brand/lockup-light.svg` | `svg/kylet-lockup.svg` |
| `docs/design/brand/wordmark-light.svg` | `svg/kylet-wordmark.svg` |
| `docs/design/brand/wordmark-dark.svg` | `svg/kylet-wordmark-on-dark.svg` |
| `docs/design/brand/wordmark.py` | `wordmark.py` (its `TTFont` line fixed) |
| `site/assets/mark.svg` | `svg/kylet-symbol.svg`; `site/assets/mark.svg` stays as its copy |

The `-black` and `-white` files were derived here from `svg/kylet-symbol.svg`
and `svg/kylet-lockup.svg`: every shape and viewBox kept, the tile drawn in
`#000000` / `#FFFFFF`, and the K and the dot knocked out of it with a mask so
the letter reads on any ground. The icons the site served before this folder
existed were rasterised outside the repository; from now on `build.py` draws
them from the masters (the small sizes from the pixel grids), so a redesign
lands here first and the surfaces follow.

`provenance.json` records where every file in this folder came from, and every
file's SHA-256; `build.py` refreshes the hashes.

## Trademark

Not registered. Owner decision owner#781: no trademark filings before the
product earns money. Use ™ at most, never ®.

## Similarity check

Personal site; the name is Kyle Tse's own. No check needed beyond the domain,
which he holds.
