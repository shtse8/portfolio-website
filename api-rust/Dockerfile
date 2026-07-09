# kylet-api-rust — Rust drop-in authority for kylet.se live API
FROM rust:1.85-bookworm AS builder
WORKDIR /app
COPY Cargo.toml Cargo.lock* ./
COPY src ./src
RUN cargo build --release

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=builder /app/target/release/kylet-api-rust /usr/local/bin/kylet-api-rust
ENV PORT=3001
EXPOSE 3001
CMD ["kylet-api-rust"]