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
# Default matches Platform connect URL host:port (Knative private :80).
ENV API_INTERNAL_URL=http://api.portfolio-website.svc.cluster.local
# Substitute only these so nginx runtime vars ($uri, $host, $bff_upstream, …)
# survive envsubst. Platform injects API_INTERNAL_URL at runtime.
ENV NGINX_ENVSUBST_FILTER=PORT|API_INTERNAL_URL
EXPOSE 3000
