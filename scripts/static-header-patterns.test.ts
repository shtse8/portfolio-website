import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { findMountGate } from "./static-header-patterns.mjs";

const root = join(import.meta.dir, "..");

/**
 * Mutation-style self-check for the source half of the static-shell gate.
 *
 * N3 widened `MOUNT_GATE_PATTERNS` to cover gates that return an empty fragment
 * (`return <></>;`) or nothing at all (`return;`) — previously only a literal
 * `return null` was caught. Reverting that widening leaves `findMountGate`
 * undefined for those cases and fails this test.
 */
describe("static-header source gate", () => {
  const gated = [
    "if (!mounted) return null;",
    "if (!hydrated) { return null; }",
    "if (!this.mounted) return null;",
    'if (typeof window === "undefined") return null;',
    'if (typeof window == "undefined") return null;',
    // N3: the widened forms — an empty fragment or a bare return.
    "if (!mounted) { return <></>; }",
    'if (typeof window === "undefined") { return <></>; }',
    "if (!mounted) return;",
    "const tree = mounted && <header/>;",
    "const gate = mounted ? <nav/> : null;",
  ];

  for (const source of gated) {
    test(`flags a mount gate: ${source}`, () => {
      expect(findMountGate(source)).toBeDefined();
    });
  }

  // Benign early returns and ordinary conditional markup must not trip the
  // gate: a false positive would break `bun run build`.
  const benign = [
    "if (!menuOpen) return;",
    "if (!open) { setOpen(true); }",
    "useEffect(() => { if (!menuOpen) return; }, [menuOpen]);",
  ];

  for (const source of benign) {
    test(`ignores non-mount code: ${source}`, () => {
      expect(findMountGate(source)).toBeUndefined();
    });
  }

  test("the pristine header renders its markup without a mount gate", () => {
    const header = readFileSync(
      join(root, "src/components/Header.tsx"),
      "utf8",
    );
    expect(findMountGate(header)).toBeUndefined();
  });
});
