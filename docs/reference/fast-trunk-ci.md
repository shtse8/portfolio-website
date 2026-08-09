# Fast Trunk CI

## Authority split

| Concern | Owner |
| --- | --- |
| Work / claim / review | Native agent coordination (Codex); Enact retired |
| Source history | Git |
| Source correctness | This repository CI (`source-ci/pass`) |
| Production artifact build | Sylphx Platform (once) |
| Deploy / health / rollback | Sylphx Platform |

## Paths

- **Internal agents:** small-batch non-force direct-trunk to default branch.
- **External contributors:** Pull Request presubmit feedback.
- **Merge Queue:** default off (no `merge_group` trigger).

## CI scope (source-ci/pass)

Blocking: biome lint, `tsc`, `bun test`, static export build, `cargo clippy -D warnings`,
`cargo test --locked`, design-marker gate, no-TS-backend gate.

Not in source CI: production Docker/release image builds, disposable ship binaries for ordinary tips.

## Concurrency

```yaml
concurrency:
  group: ci-${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true
```
