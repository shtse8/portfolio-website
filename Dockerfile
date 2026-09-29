# syntax=docker/dockerfile:1.27
# kylet.se image: `keel pack` builds the site, nginx serves it.
#
# Keel is a private repository. The build reads it with the `keel_git_token`
# build secret (sylphx.toml [build.secrets], SylphxAI/cloud#9149): a one-hour,
# read-only token for SylphxAI/keel, given to git through GIT_CONFIG_* inside
# the one step that fetches, so it never reaches a layer, an argument or a log.

FROM rust:1-bookworm AS build
ARG WASM_BINDGEN=0.2.126
ARG BINARYEN=version_123
RUN rustup target add wasm32-unknown-unknown \
 && curl -sSfL "https://github.com/WebAssembly/binaryen/releases/download/${BINARYEN}/binaryen-${BINARYEN}-x86_64-linux.tar.gz" | tar xz -C /opt \
 && ln -s "/opt/binaryen-${BINARYEN}/bin/wasm-opt" /usr/local/bin/wasm-opt
WORKDIR /src
COPY . .
ENV CARGO_NET_GIT_FETCH_WITH_CLI=true \
    CARGO_REGISTRIES_SYLPHX_INDEX=sparse+https://cargo.sylphx.com/index/
RUN --mount=type=secret,id=keel_git_token,required=true \
    --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/usr/local/cargo/git \
    --mount=type=cache,target=/src/target \
    export GIT_CONFIG_COUNT=1 \
      GIT_CONFIG_KEY_0="url.https://x-access-token:$(cat /run/secrets/keel_git_token)@github.com/SylphxAI/keel.insteadOf" \
      GIT_CONFIG_VALUE_0="https://github.com/SylphxAI/keel" \
 && grep -q "rev = \"$(cat KEEL_PIN)\"" Cargo.toml \
 && cargo install --locked wasm-bindgen-cli --version "${WASM_BINDGEN}" \
 && cargo install --locked --git https://github.com/SylphxAI/keel --rev "$(cat KEEL_PIN)" --target-dir target keel-cli \
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
