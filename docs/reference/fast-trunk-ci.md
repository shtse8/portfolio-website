# Checks

| Concern | Owner |
| --- | --- |
| Source history | Git |
| Source correctness | GitHub Actions (`.github/workflows/ci.yml`) on pull requests and `main`; `ci-ok` is required by the `main` ruleset |
| Production build | Sylphx Hosting (`Dockerfile`), once per push to `main` |
| Deploy, health, rollback | Sylphx Hosting |

- **Runner:** `ubuntu-latest`, GitHub's standard hosted runner, free for a
  public repository (owner standards/dx.md, owner#750). Never a larger or GPU
  runner; those are billed even for public repositories.
- **What runs:** clippy with warnings as errors, the site tests (including the
  generated dark theme being current), `keel pack`, then the browser checks and
  Lighthouse against the pack served by the production nginx config.
- **Keel access:** a one-hour, read-only token from a GitHub App
  (`vars.KEEL_READER_APP_ID`, `secrets.KEEL_READER_APP_PRIVATE_KEY`), minted per
  job. Pull requests from forks get no secrets and cannot build.
