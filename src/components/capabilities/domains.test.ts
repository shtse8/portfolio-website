/**
 * Regression coverage for the Capabilities grouping/curation logic.
 *
 * No test framework is wired into this project, so these are lightweight
 * executable assertions (node:assert) runnable with `bun` or `node`:
 *
 *     bun src/components/capabilities/domains.test.ts
 *
 * They guard the rules that `tsc` cannot: category→domain mapping, the
 * language override, featured/demoted ordering, honest totals, the curated
 * core row, and year formatting — plus a smoke check against live skill data.
 */
import assert from "node:assert/strict";
import type { TechSkill } from "@/data/types";
import { getSkills } from "@/data/skills";
import { buildCapabilities, domainForSkill, formatYears } from "./domains";

let failed = 0;
function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ok  ${name}`);
  } catch (err) {
    failed++;
    console.error(`FAIL  ${name}\n      ${(err as Error).message}`);
  }
}

const skill = (over: Partial<TechSkill> & Pick<TechSkill, "id" | "category">): TechSkill => ({
  name: over.id,
  description: "",
  yearsOfExperience: 0,
  color: "",
  bgColor: "",
  keywords: [],
  icon: "FaCode",
  ...over,
});

// ── domainForSkill ─────────────────────────────────────────────────────────
test("language ids override their raw category", () => {
  // typescript is tagged `frontend` in the data but must live in Languages.
  assert.equal(domainForSkill(skill({ id: "typescript", category: "frontend" })), "languages");
  assert.equal(domainForSkill(skill({ id: "solidity", category: "blockchain" })), "languages");
});

test("category map folds infra/practice into backend", () => {
  for (const c of ["backend", "devops", "database", "api", "qa", "tools"]) {
    assert.equal(domainForSkill(skill({ id: `x-${c}`, category: c })), "backend");
  }
});

test("frontend / ai / games map straight through", () => {
  assert.equal(domainForSkill(skill({ id: "react", category: "frontend" })), "frontend");
  assert.equal(domainForSkill(skill({ id: "mcp", category: "ai" })), "ai");
  assert.equal(domainForSkill(skill({ id: "unity", category: "game" })), "games");
  assert.equal(domainForSkill(skill({ id: "ios", category: "mobile" })), "games");
});

test("unmapped categories fall into specialist", () => {
  for (const c of ["blockchain", "finance", "marketing", "management", "security", "legacy"]) {
    assert.equal(domainForSkill(skill({ id: `x-${c}`, category: c })), "specialist");
  }
});

// ── buildCapabilities: ordering + honesty ───────────────────────────────────
test("featured leads, demoted trails, totals stay honest", () => {
  const fixtures: TechSkill[] = [
    skill({ id: "ajax", category: "frontend", yearsOfExperience: 25 }), // demoted
    skill({ id: "css", category: "frontend", yearsOfExperience: 20 }), // normal, high years
    skill({ id: "react", category: "frontend", yearsOfExperience: 5 }), // featured, low years
    skill({ id: "tailwindcss", category: "frontend", yearsOfExperience: 4 }),
  ];
  const { domains, total } = buildCapabilities(fixtures, { headliners: 4 });
  const fe = domains.find((d) => d.key === "frontend")!;
  assert.equal(total, 4);
  assert.equal(fe.count, 4);
  // react (featured) leads despite the fewest years; css beats demoted ajax.
  assert.deepEqual(
    fe.headliners.map((s) => s.id),
    ["react", "css", "tailwindcss", "ajax"],
  );
});

test("remainder counts the hidden tail, breadth preserved", () => {
  const fixtures: TechSkill[] = Array.from({ length: 10 }, (_, i) =>
    skill({ id: `ai-${i}`, category: "ai", yearsOfExperience: i }),
  );
  const { domains } = buildCapabilities(fixtures, { headliners: 7 });
  const ai = domains.find((d) => d.key === "ai")!;
  assert.equal(ai.count, 10);
  assert.equal(ai.headliners.length, 7);
  assert.equal(ai.rest.length, 3);
  assert.equal(ai.remainder, ai.rest.length);
  // the hidden tail is the disclosed remainder, and nothing is dropped
  assert.equal(ai.headliners.length + ai.rest.length, ai.count);
  assert.deepEqual([...ai.headliners, ...ai.rest].map((s) => s.id).sort(), fixtures.map((s) => s.id).sort());
});

test("core = curated featured order, only real (>0y) skills", () => {
  const fixtures: TechSkill[] = [
    skill({ id: "typescript", category: "frontend", yearsOfExperience: 12 }),
    skill({ id: "react", category: "frontend", yearsOfExperience: 10 }),
    skill({ id: "mcp", category: "ai", yearsOfExperience: 0 }), // featured but 0y → excluded
    skill({ id: "html", category: "frontend", yearsOfExperience: 25 }), // not featured
  ];
  const { core } = buildCapabilities(fixtures);
  assert.deepEqual(core.map((s) => s.id), ["typescript", "react"]);
});

// ── formatYears ─────────────────────────────────────────────────────────────
test("formatYears keeps whole numbers clean and halves honest", () => {
  assert.equal(formatYears(12), "12y");
  assert.equal(formatYears(12.5), "12.5y");
  assert.equal(formatYears(0.5), "0.5y");
});

// ── smoke test against live data ────────────────────────────────────────────
test("live skill data groups into 142 across the six domains", () => {
  const { domains, total, core } = buildCapabilities(getSkills());
  assert.equal(total, 142);
  const counts = Object.fromEntries(domains.map((d) => [d.key, d.count]));
  assert.deepEqual(counts, {
    languages: 10,
    frontend: 25,
    backend: 45,
    ai: 18,
    games: 21,
    specialist: 23,
  });
  // every domain's headliners + disclosed rest reconcile to its count
  for (const d of domains) {
    assert.equal(d.remainder, d.rest.length);
    assert.equal(d.headliners.length + d.rest.length, d.count);
  }
  // counts sum back to the honest total; core is curated + non-empty
  assert.equal(
    domains.reduce((n, d) => n + d.count, 0),
    total,
  );
  assert.ok(core.length > 0 && core.every((s) => s.yearsOfExperience > 0));
});

console.log(failed === 0 ? "\nAll capability checks passed." : `\n${failed} check(s) failed.`);
if (failed > 0 && typeof process !== "undefined") process.exit(1);
