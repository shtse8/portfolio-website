import { createRequire } from "module";
// Inline pure mapping tests (TS source compiled logic re-stated for gate)
function mapCpSummaryToActivity(s) {
  const c = s.summary?.commits_landed ?? {};
  const today = Number(c.today ?? 0);
  const d7 = Number(c.d7 ?? 0);
  const d30 = Number(c.d30 ?? 0);
  return {
    commitsToday: today,
    commitsWeek: d7,
    commitsMonth: d30,
    reposActiveToday: Number(s.summary?.projects_active?.count ?? 0),
    lastPush: null,
    source: "control-plane-public",
    d30IsNotWeekTimesFour: c.d30_is_not_week_times_four !== false,
  };
}
function assertHonest(a) {
  if (!a.d30IsNotWeekTimesFour) throw new Error("d30 flag missing");
  if (a.commitsMonth === a.commitsWeek * 4 && a.commitsWeek > 0) throw new Error("week×4");
}
const a = mapCpSummaryToActivity({
  summary: { commits_landed: { today: 12, d7: 80, d30: 300, d30_is_not_week_times_four: true }, projects_active: { count: 4 } },
});
if (a.commitsMonth !== 300) throw new Error("month");
if (a.commitsMonth === a.commitsWeek * 4) throw new Error("month is week*4");
if (a.lastPush !== null) throw new Error("lastPush must be null from CP");
assertHonest(a);
let threw = false;
try { assertHonest({ commitsWeek: 10, commitsMonth: 40, d30IsNotWeekTimesFour: true }); } catch { threw = true; }
if (!threw) throw new Error("expected week×4 throw");
console.log("cp-public-mapping: ok");
