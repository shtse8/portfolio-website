FROM oven/bun:1-alpine AS builder
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

FROM nginx:alpine AS runner
COPY --from=builder /app/out /usr/share/nginx/html
# Provide the server config as a template so nginx's entrypoint substitutes ${PORT}
# (the platform injects PORT=3000). NGINX_ENVSUBST_FILTER limits substitution to PORT
# so nginx runtime vars ($uri, $host, …) are preserved.
COPY nginx.conf /etc/nginx/templates/default.conf.template
ENV PORT=3000
ENV NGINX_ENVSUBST_FILTER=PORT
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
