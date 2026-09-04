# syntax=docker/dockerfile:1
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
# Stage the binary at /out: #65 compiled kylet-api-rust (~97s) then
# runtime `COPY --from=builder .../target/release/kylet-api-rust` was
# CACHED and the pushed digest stayed sha256:1de4ea600a9f… (same as the
# stale 3646fb2 tag). A path that never existed in that cache cannot hit.
RUN cargo build --locked --release \
    && mkdir -p /out \
    && cp target/release/kylet-api-rust /out/kylet-api-rust

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
# Do not COPY --from the binary: #67 compiled then CACHED
# `COPY --from=builder /out/kylet-api-rust` to /usr/local/bin/kylet-api-rust
# and reused cache layers 146ce355/581dba8a/a8ac7f6c/f588acd2 (config-only
# digest sha256:29d192fa…). Install via RUN --mount so this layer cannot
# be that destination-keyed COPY.
RUN --mount=from=builder,source=/out,target=/mnt \
    cp /mnt/kylet-api-rust /usr/local/bin/kylet-api-rust \
    && chmod 0755 /usr/local/bin/kylet-api-rust
ENV PORT=3001
EXPOSE 3001
USER 65532:65532
CMD ["kylet-api-rust"]
