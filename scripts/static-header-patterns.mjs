#!/usr/bin/env bun
/**
 * Source patterns for the static-export shell gate (see
 * `check-static-header.mjs`).
 *
 * The site is "the proof": a visitor who never hydrates must still see the
 * primary navigation. That is only true if the header markup is in the exported
 * HTML rather than rendered after mount.
 *
 * These patterns match the *intent*, not one exact spelling: an early `return`
 * behind any negated flag that yields nothing renderable — `null`,
 * `undefined`, or an empty fragment (`return <></>;` / `return (<></>);`) — a bare `return;`
 * behind a flag whose name reads as a mount/hydration gate, the canonical
 * Next.js SSR gate `if (typeof window === "undefined")`, markup
 * short-circuited behind a truthiness gate (`mounted && <header/>`), and a
 * ternary whose alternate is `null`.
 *
 * This source check is *defence in depth*: it names the regression where it is
 * introduced. The export check in `check-static-header.mjs` (real
 * `out/*.html`) is the authoritative, load-bearing guard — it catches every
 * spelling, including ones these patterns do not know about.
 */

/** A `return` that yields no renderable value: an explicit `null`,
 * `undefined`, or an empty fragment (`return <></>;` / `return (<></>);`). */
const UNRENDERABLE_RETURN = String.raw`\(?\s*(?:null\b|undefined\b|<\s*>\s*</\s*>)\s*\)?`;

/** A `return` with no value at all: `return;` or `return }`. */
const BARE_RETURN = String.raw`(?:;|(?=\}))`;

const ANY_EMPTY_RETURN = String.raw`(?:${UNRENDERABLE_RETURN}|${BARE_RETURN})`;

/**
 * A flag whose name reads as a mount/hydration gate. A bare `return;` is only
 * a mount gate when the flag is one of these; `if (!menuOpen) return;` in an
 * event handler must not be mistaken for it.
 */
const MOUNT_FLAG = String.raw`(?:this\.)?(?:is)?(?:mounted|hydrated)`;

export const MOUNT_GATE_PATTERNS = [
  {
    // `if (!mounted) return null;` · `if (!hydrated) { return null; }`
    // · `if (!this.mounted) return null;` · `if (!mounted) { return <></>; }`
    re: new RegExp(
      String.raw`if\s*\(\s*!\s*[A-Za-z_$][\w$.]*\s*\)\s*\{?\s*return\s*` +
        UNRENDERABLE_RETURN,
    ),
    label: "an early empty `return` behind a negated mount flag",
  },
  {
    // `if (!mounted) return;` · `if (!this.isHydrated) { return }`
    re: new RegExp(
      String.raw`if\s*\(\s*!\s*` +
        MOUNT_FLAG +
        String.raw`\s*\)\s*\{?\s*return\s*` +
        BARE_RETURN,
      "i",
    ),
    label: "an early bare `return` behind a negated mount flag",
  },
  {
    // The most idiomatic Next.js SSR gate — with `null`, `undefined`, an empty
    // fragment, or a bare return.
    re: new RegExp(
      String.raw`if\s*\(\s*typeof\s+[A-Za-z_$][\w$.]*\s*===?\s*["']undefined["']\s*\)\s*\{?\s*return\s*` +
        ANY_EMPTY_RETURN,
    ),
    label: "an early empty `return` behind a `typeof … === undefined` check",
  },
  {
    // `const tree = mounted && <header/>;` · `this.mounted && (<nav/>)`
    // Same-line only, so ordinary `{menuOpen && (…)}` conditionals (whose
    // markup starts on the next line) are not mistaken for a mount gate.
    re: /[A-Za-z_$][\w$.]*\s*&&[ \t]*\(?[ \t]*</,
    label: "markup short-circuited behind a truthiness gate",
  },
  {
    // `mounted ? <nav>…</nav> : null` · `{ready ? (<header/>) : null}`
    re: /[A-Za-z_$][\w$.]*\s*\?\s*[^;?]*?\s*:\s*null\b/,
    label: "a ternary that renders `null` before mount",
  },
];

/** The first mount gate found in `source`, or `undefined` when it renders. */
export function findMountGate(source) {
  return MOUNT_GATE_PATTERNS.find((pattern) => pattern.re.test(source));
}
