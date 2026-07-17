# portfolio-website

<p align="center">
  <img src="https://mark.sylphx.com/api/v1/banner?type=orbit&theme=tokyonight&text=portfolio+website&desc=Open+source+%C2%B7+Sylphx+ecosystem&height=200&animation=rise&credit=0" alt="portfolio-website — Sylphx Mark banner" width="100%" />
</p>

Kyle Tse portfolio (`kylet.se`).

## Stack (Rust-first backend, TypeScript frontend)

- **Web:** Next.js static export (TypeScript) → nginx (`Dockerfile`, port 3000).
- **API:** Rust `api-rust` (`sylphx.toml` `api` service, port 3001) — stats, terminal data, AI chat via Sylphx Gateway.
- **Contract:** Protobuf + Buf in `proto/portfolio/v1/` (REST JSON is the browser projection).

See [PROJECT.md](./PROJECT.md) and [ADR-168](./docs/adr/ADR-168-fleet-portfolio-api-rust-north-star.md).

## Dev

```bash
bun install
bun run dev          # static site dev server :4311
cd api-rust && cargo run
```

## Verify

```bash
cd api-rust && cargo test --locked
buf lint
BASE_URL=https://slim-pal-0k3stq.sylphx.app scripts/api-smoke.sh
```
