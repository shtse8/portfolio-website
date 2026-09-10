import { afterEach, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import {
  canonical,
  fresh,
  readContext,
  runProbe,
} from "./lib/product-probe-protocol";

const ids = ["one"];
const context = () => ({
  organizationId: "org",
  projectId: "project",
  environmentId: "env",
  release: {
    releaseId: "release",
    decisionId: "decision",
    selectionGeneration: "1",
    rolloutAttempt: 1,
    stage: "DELIVERY_RELEASE_EXECUTION_STAGE_POST_DEPLOYMENT_PROBE",
  },
  intent: {
    contractId: "test.v1",
    policyRevision: "v1",
    runnerImageDigest: "sha256:" + "a".repeat(64),
    requiredAssertionIds: ids,
    targets: [
      {
        memberId: "member",
        runtimeObservationDigest: "digest",
        resourceGeneration: "1",
        revisionUid: "opaque-uid",
        origin: "https://example.com",
      },
    ],
  },
});
function set(c: any) {
  process.env.APPS_PRODUCT_PROBE_CONTEXT = JSON.stringify(c);
  process.env.APPS_PRODUCT_PROBE_CONTEXT_DIGEST =
    "sha256:" + createHash("sha256").update(canonical(c)).digest("hex");
}
afterEach(() => {
  delete process.env.APPS_PRODUCT_PROBE_CONTEXT;
  delete process.env.APPS_PRODUCT_PROBE_CONTEXT_DIGEST;
});
test("canonical property order and exact context digest", () => {
  expect(canonical({ z: 0, a: { y: 2, b: 1 } })).toBe(
    '{"a":{"b":1,"y":2},"z":0}',
  );
  set(context());
  expect(readContext("test.v1", ids).target.revisionUid).toBe("opaque-uid");
  process.env.APPS_PRODUCT_PROBE_CONTEXT_DIGEST = "sha256:" + "b".repeat(64);
  expect(() => readContext("test.v1", ids)).toThrow();
});
test("wrong/duplicate assertion sets and additional target fail closed", () => {
  for (const requiredAssertionIds of [[], ["one", "one"], ["other"]]) {
    set({
      ...context(),
      intent: { ...context().intent, requiredAssertionIds },
    });
    expect(() => readContext("test.v1", ids)).toThrow();
  }
  const c = context();
  c.intent.targets.push(c.intent.targets[0]);
  set(c);
  expect(() => readContext("test.v1", ids)).toThrow();
});
test("unselected origin components fail closed", () => {
  for (const origin of [
    "http://example.com",
    "https://name:pass@example.com",
    "https://example.com/other",
    "https://example.com/?token=x",
  ]) {
    const c = context();
    c.intent.targets[0].origin = origin;
    set(c);
    expect(() => readContext("test.v1", ids)).toThrow();
  }
});
test("missing stale and future timestamps fail", () => {
  for (const timestamp of [
    undefined,
    "bad",
    new Date(Date.now() - 3600001).toISOString(),
    new Date(Date.now() + 120000).toISOString(),
  ])
    expect(() => fresh(timestamp)).toThrow();
  expect(() => fresh(new Date().toISOString())).not.toThrow();
});

test("receipt preserves every assertion exactly once including failures", async () => {
  const c = context();
  c.intent.requiredAssertionIds = ["pass", "fail"];
  set(c);
  let receipt: any;
  await runProbe(
    "test.v1",
    {
      pass: async () => {},
      fail: async () => {
        throw new Error("expected fixture failure");
      },
    },
    (raw) => {
      expect(Buffer.byteLength(raw)).toBeLessThanOrEqual(4096);
      receipt = JSON.parse(raw);
    },
  );
  expect(receipt.contextDigest).toBe(
    process.env.APPS_PRODUCT_PROBE_CONTEXT_DIGEST,
  );
  expect(receipt.assertions).toEqual([
    { id: "pass", status: "DELIVERY_PRODUCT_PROBE_ASSERTION_STATUS_PASSED" },
    { id: "fail", status: "DELIVERY_PRODUCT_PROBE_ASSERTION_STATUS_FAILED" },
  ]);
  expect(Date.parse(receipt.finishedAt)).toBeGreaterThanOrEqual(
    Date.parse(receipt.startedAt),
  );
  process.exitCode = 0;
});
test("invalid release scope executes no product request and emits failures", async () => {
  const c = context();
  c.release.releaseId = "";
  set(c);
  let called = false;
  let receipt: any;
  await runProbe(
    "test.v1",
    {
      one: async () => {
        called = true;
      },
    },
    (raw) => {
      receipt = JSON.parse(raw);
    },
  );
  expect(called).toBe(false);
  expect(receipt.assertions[0].status).toBe(
    "DELIVERY_PRODUCT_PROBE_ASSERTION_STATUS_FAILED",
  );
  process.exitCode = 0;
});
