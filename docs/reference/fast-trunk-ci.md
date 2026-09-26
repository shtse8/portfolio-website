# Fast Trunk CI

## Authority split

| Concern | Owner |
| --- | --- |
| Work / claim / review | Native agent coordination (Codex); Enact retired |
| Source history | Git |
| Source correctness | Checks inside the Sylphx Hosting image build (both Dockerfiles) |
| Production artifact build | Sylphx Platform (once) |
| Deploy / health / rollback | Sylphx Platform |

## Paths

- **Internal agents:** small-batch non-force direct-trunk to default branch.
- **External contributors:** Pull Request presubmit feedback.
- **Merge Queue:** default off (no `merge_group` trigger).

## Where the checks run

This repository is on a personal GitHub account. Our CI runners serve only
SylphxAI organization repositories, and we never use GitHub-hosted runners
(owner standards/dx.md), so there is no GitHub Actions workflow. The checks run
as build steps in the Sylphx Hosting image build instead, the pattern Vercel
uses for personal repositories: a failing check fails the build, and the deploy
does not happen. This lasts until SylphxAI/cloud#9505 (webhook-driven checks
for personal-account repositories) ships.

- **Web image (`Dockerfile`):** biome, `tsc --noEmit`, `bun test`, the
  no-TS-backend gate, the BFF upstream gate, the design-marker gate, then the
  static export build.
- **API image (`api-rust/Dockerfile`):** `cargo clippy -D warnings` and
  `cargo test --locked`, then the release build.

A pull request gets no check status from these builds. Run `bun run check` and
`cd api-rust && cargo test --locked` before pushing.
