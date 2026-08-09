# kylet-api-rust — Rust sole authority for kylet.se live API (ADR-169).
# Build context is the repository root (api-rust/ only).
FROM rust:1-bookworm AS builder
WORKDIR /workspace/api-rust
COPY api-rust/Cargo.toml api-rust/Cargo.lock ./
COPY api-rust/src ./src
ENV CARGO_BUILD_JOBS=2
RUN cargo build --locked --release

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=builder /workspace/api-rust/target/release/kylet-api-rust /usr/local/bin/kylet-api-rust
ENV PORT=3001
EXPOSE 3001
USER 65532:65532
CMD ["kylet-api-rust"]
