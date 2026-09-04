# kylet-api-rust — Rust sole authority for kylet.se live API (ADR-169).
# Build context is the repository root (api-rust/ only).
FROM rust:1-bookworm AS builder
WORKDIR /workspace
# Production BuildKit mode=min registry cache served a stale
# `COPY api-rust/src` hit after #52/#58, leaving live on 9016192.
# Copy the whole crate in one instruction so cargo cannot reuse that layer.
COPY api-rust /workspace/api-rust
WORKDIR /workspace/api-rust
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
