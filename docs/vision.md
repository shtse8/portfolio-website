# kylet.se vision

## Goal

kylet.se is Kyle Tse's personal site. In one short visit, a person learns who
Kyle is, what he builds and how to reach him, and trusts what they read because
every fact has a source.

## Who it serves

People who have just heard Kyle's name and want to size him up: prospective
partners, customers of Sylphx, engineers who found a project of his, and
recruiters. They arrive on a phone as often as a laptop, want the answer in
seconds and do not want to be tracked. There is nothing for sale here and no
account to make.

## What a visit gives

1. **Who:** his name and one plain line. He has shipped consumer software to
   millions of people for twenty years and now builds Sylphx, a software company
   that runs on AI agents.
2. **Track record:** each company's scale beside its name, in quiet type.
3. **What he builds:** the Sylphx platform, Keel Engine, the apps Sylphx
   publishes and the open-source tools.
4. **The story:** the timeline since 2006 (`/about`).
5. **Contact:** hi@kylet.se, GitHub and LinkedIn. No form, because an address
   gets a reply from a person and a form gets a queue.

The site is also a Keel Engine website in production: its pages, theme and live
scene are Keel, so it shows the engine working on a real site.

## What we won't do

- Show a claim with no source in [design/content.md](design/content.md): a
  personal site that overstates costs Kyle more than a plain one gains.
- Show live counters: a static figure goes stale and a live one can read zero.
- Run a server API or an on-site agent: both were retired because the data
  routes served nothing and the agent's answers had drifted from the facts
  ([ADR-170](adr/ADR-170-keel-site-api-retired.md)).
- Use forms, accounts, cookies, analytics or tracking: visitors come to read,
  and nothing here needs their data.

## How success is measured

- A visitor reaches the contact address or a profile link within one visit;
  judged by reading the page, since the site deliberately measures no one.
- Lighthouse mobile 95 or better on every page.
- Axe finds no violation (WCAG 2.2 AA), nothing scrolls sideways at 320 px, and
  light and dark follow the device.
- Every fact matches `design/content.md` (reviewed on each content change).
