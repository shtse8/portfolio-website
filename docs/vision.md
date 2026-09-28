# kylet.se vision

**Status:** Canonical product destination
**Identity graph:** [`capabilities.md`](capabilities.md)

## Destination

kylet.se is Kyle Tse's personal site. A visitor finds out, in one short visit,
who Kyle is, what he builds and how to reach him:

1. **Who:** his name and one plain line. He has shipped consumer software to
   millions of people for twenty years, and now builds Sylphx, a software
   company that runs on AI agents.
2. **Track record:** each company's scale beside its name, in quiet type.
3. **What he builds:** the Sylphx platform, Keel Engine, the apps Sylphx
   publishes and the open-source tools.
4. **The story:** the timeline since 2006 (`/about`).
5. **Contact:** hi@kylet.se, GitHub and LinkedIn. No form.

Every fact on the site has a source in
[`design/content.md`](design/content.md). Nothing is invented, and nothing is
a live counter that could go stale or read zero.

The site is also a Keel Engine website in production (owner#739, Stage 1
pilot 2): its pages, theme and live scene are Keel, and its bar is Lighthouse
mobile 95 or better, WCAG 2.2 AA, no sideways scroll at 320 px, and light and
dark that follow the device.

## Not doing

- A server API, live GitHub or npm counters, or an on-site agent (retired
  2026-09-28, [ADR-170](adr/ADR-170-keel-site-api-retired.md)).
- Forms, accounts, cookies, analytics or tracking.
- Claims without a source in `content.md`.

## State

2026-09-28: the Keel site is built and checked (#86). The deploy waits on the
platform's build secrets (SylphxAI/cloud#9149); until then the previous site
stays live.
