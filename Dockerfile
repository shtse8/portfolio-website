FROM oven/bun:1-alpine AS builder
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

# nginxinc unprivileged: uid 101, no chown on start, works with capabilities.drop=ALL.
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runner
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template
ENV PORT=3000
# BFF upstream is hardcoded to the api ksvc :80 in nginx.conf. Do not
# envsubst Platform API_INTERNAL_URL (:3001 container port) into proxy_pass.
ENV NGINX_ENVSUBST_FILTER=PORT
EXPOSE 3000
