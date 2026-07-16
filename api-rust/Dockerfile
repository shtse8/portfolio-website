# kylet-api-rust — Rust drop-in authority for kylet.se live API
# Build context MUST be the repository root (not api-rust alone):
#   docker build -f api-rust/Dockerfile .
# so build.rs can compile protos from ../proto (repo root/proto).
FROM rust:1-bookworm AS builder
RUN apt-get update \
  && apt-get install -y --no-install-recommends protobuf-compiler \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /workspace/api-rust
COPY api-rust/Cargo.toml api-rust/Cargo.lock ./
COPY api-rust/build.rs ./
COPY api-rust/src ./src
COPY proto /workspace/proto
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
