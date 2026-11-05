# syntax=docker/dockerfile:1.7
# kylet.se image: `keel pack` builds the site, nginx serves it.
#
# Engine and CLI come from the exact public release in KEEL_PIN.

FROM rust:1-bookworm AS build
ARG WASM_BINDGEN=0.2.126
ARG BINARYEN=version_123
# Native scene tooling and the public CLI link the Linux audio/device hosts and system font resolver.
RUN apt-get update \
 && apt-get install -y --no-install-recommends pkg-config libasound2-dev libudev-dev libfontconfig1-dev \
 && rm -rf /var/lib/apt/lists/*
RUN rustup target add wasm32-unknown-unknown \
 && curl -sSfL "https://github.com/WebAssembly/binaryen/releases/download/${BINARYEN}/binaryen-${BINARYEN}-x86_64-linux.tar.gz" | tar xz -C /opt \
 && ln -s "/opt/binaryen-${BINARYEN}/bin/wasm-opt" /usr/local/bin/wasm-opt
WORKDIR /src
COPY . .
# rust-toolchain.toml pins `stable`, which rustup installs afresh under /src without
# the wasm target added above; add it for the toolchain the build really uses.
RUN rustup target add wasm32-unknown-unknown
RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/src/target \
    sh scripts/check-keel-pin.sh \
 && cargo install --locked wasm-bindgen-cli --version "${WASM_BINDGEN}" \
 && cargo install --locked sylphx-keel-cli --version "$(cat KEEL_PIN)" --target-dir target \
 && keel pack --profile web --release --manifest-path site/Cargo.toml \
 && cp -r dist/web /site \
 && mkdir /snippets && sh hosting/pack-rules.sh /site /snippets

# nginxinc unprivileged: uid 101, no chown on start, works with capabilities.drop=ALL.
FROM nginxinc/nginx-unprivileged:1.31-alpine AS runner
COPY --from=build /site /usr/share/nginx/html
COPY --from=build /snippets/ /etc/nginx/snippets/
COPY hosting/headers.conf /etc/nginx/snippets/headers.conf
COPY nginx.conf /etc/nginx/templates/default.conf.template
ENV PORT=3000
ENV NGINX_ENVSUBST_FILTER=PORT
EXPOSE 3000
