# Fast Trunk CI

## Authority split

| Concern | Owner |
| --- | --- |
| Work / claim / review | Native agent coordination (Codex); Enact retired |
| Source history | Git |
| Source correctness | GitHub Actions on pull requests; the same checks inside the Sylphx Hosting image build gate the deploy |
| Production artifact build | Sylphx Platform (once) |
| Deploy / health / rollback | Sylphx Platform |

## Paths

- **Internal agents:** small-batch non-force direct-trunk to default branch.
- **External contributors:** Pull Request presubmit feedback.
- **Merge Queue:** default off (no `merge_group` trigger).

## Where the checks run

The checks run in two places:

- **Pull requests and pushes to `main`:** `.github/workflows/ci.yml` runs on
  `ubuntu-latest`. That is GitHub's standard hosted runner, and it is free for a
  public repository (owner standards/dx.md). Never use a larger or GPU runner;
  those are billed even for public repositories.
- **Deploy gate:** the Sylphx Hosting image builds run the same checks as build
  steps. A failing check fails the build, and the deploy doesn't happen.
  - Web image (`Dockerfile`): biome, `tsc --noEmit`, `bun test`, the
    no-TS-backend gate, the BFF upstream gate and the design-marker gate, then
    the static export build.
  - API image (`api-rust/Dockerfile`): `cargo clippy -D warnings` and
    `cargo test --locked`, then the release build.

SylphxAI/cloud#9505 (webhook-driven checks for personal-account repositories)
is no longer needed for this repository.
