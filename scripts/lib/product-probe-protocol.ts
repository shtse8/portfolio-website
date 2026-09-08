import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
export function canonical(value: any): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(canonical).join(",") + "]";
  return (
    "{" +
    Object.keys(value)
      .sort()
      .map((k) => JSON.stringify(k) + ":" + canonical(value[k]))
      .join(",") +
    "}"
  );
}
export function requireValue(ok: unknown, message: string): asserts ok {
  if (!ok) throw new Error(message);
}
export function readContext(contract: string, ids: string[]) {
  const context = JSON.parse(process.env.APPS_PRODUCT_PROBE_CONTEXT ?? "null");
  const digest = process.env.APPS_PRODUCT_PROBE_CONTEXT_DIGEST ?? "";
  requireValue(
    context &&
      digest ===
        "sha256:" +
          createHash("sha256").update(canonical(context)).digest("hex"),
    "context digest mismatch",
  );
  for (const k of ["organizationId", "projectId", "environmentId"])
    requireValue(
      typeof context[k] === "string" && context[k].length > 0,
      "missing scope " + k,
    );
  const release = context.release;
  requireValue(
    release &&
      ["releaseId", "decisionId"].every(
        (k) => typeof release[k] === "string" && release[k].length > 0,
      ) &&
      /^[1-9][0-9]*$/.test(String(release.selectionGeneration)) &&
      Number.isInteger(release.rolloutAttempt) &&
      release.rolloutAttempt > 0 &&
      release.stage ===
        "DELIVERY_RELEASE_EXECUTION_STAGE_POST_DEPLOYMENT_PROBE",
    "missing release execution identity",
  );
  const intent = context.intent;
  requireValue(intent?.contractId === contract, "contract mismatch");
  requireValue(
    Array.isArray(intent.requiredAssertionIds) &&
      canonical([...intent.requiredAssertionIds].sort()) ===
        canonical([...ids].sort()),
    "assertion set mismatch",
  );
  requireValue(
    typeof intent.policyRevision === "string" &&
      intent.policyRevision.length > 0 &&
      /^sha256:[a-f0-9]{64}$/.test(intent.runnerImageDigest),
    "missing policy or runner identity",
  );
  requireValue(
    Array.isArray(intent.targets) && intent.targets.length === 1,
    "contract requires exactly one routed product target",
  );
  const target = intent.targets[0];
  for (const k of [
    "memberId",
    "runtimeObservationDigest",
    "resourceGeneration",
    "revisionUid",
  ])
    requireValue(
      target[k] !== undefined && String(target[k]).length > 0,
      "missing target " + k,
    );
  const origin = new URL(target.origin);
  requireValue(
    origin.protocol === "https:" &&
      !origin.username &&
      !origin.password &&
      !origin.search &&
      !origin.hash &&
      origin.pathname === "/",
    "target must be an HTTPS origin",
  );
  return { context, digest, target, origin: origin.origin };
}
export async function runProbe(
  contract: string,
  checks: Record<
    string,
    (input: ReturnType<typeof readContext>) => Promise<void>
  >,
  writeReceipt: (result: string) => void = (result) =>
    writeFileSync("/dev/termination-log", result),
) {
  const startedAt = new Date().toISOString();
  const ids = Object.keys(checks);
  const assertions = ids.map((id) => ({
    id,
    status: "DELIVERY_PRODUCT_PROBE_ASSERTION_STATUS_FAILED",
  }));
  try {
    const input = readContext(contract, ids);
    for (let i = 0; i < ids.length; i++) {
      try {
        await checks[ids[i]](input);
        assertions[i].status = "DELIVERY_PRODUCT_PROBE_ASSERTION_STATUS_PASSED";
      } catch (e) {
        console.error(
          ids[i] + ": " + (e instanceof Error ? e.message : String(e)),
        );
      }
    }
  } catch (e) {
    console.error(e instanceof Error ? e.message : String(e));
  }
  const result = JSON.stringify({
    contextDigest: process.env.APPS_PRODUCT_PROBE_CONTEXT_DIGEST ?? "",
    assertions,
    startedAt,
    finishedAt: new Date().toISOString(),
  });
  requireValue(Buffer.byteLength(result) <= 4096, "receipt too large");
  writeReceipt(result);
  if (
    assertions.some(
      (x) => x.status !== "DELIVERY_PRODUCT_PROBE_ASSERTION_STATUS_PASSED",
    )
  )
    process.exitCode = 1;
}
export async function getJson(origin: string, path: string) {
  const response = await fetch(origin + path, {
    redirect: "error",
    signal: AbortSignal.timeout(30000),
    headers: { Accept: "application/json" },
  });
  requireValue(response.ok, "HTTP " + response.status + " " + path);
  return response.json();
}
export function fresh(value: unknown) {
  const date = typeof value === "string" ? Date.parse(value) : NaN;
  const age = Date.now() - date;
  requireValue(
    Number.isFinite(age) && age >= -60000 && age <= 3600000,
    "data timestamp is missing, future, or older than one hour",
  );
}
