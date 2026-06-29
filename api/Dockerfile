# kylet-api — tiny Bun server (stats + AI chat) for kylet.se.
# Built with context = "api"; copies just this directory.
FROM oven/bun:1.2-alpine

WORKDIR /app

# Install deps first (cached layer) — the AI SDK lives in node_modules now.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Then the source. Bun runs the TypeScript entrypoint directly — no build step.
COPY . ./

ENV PORT=3001
EXPOSE 3001

CMD ["bun", "run", "index.ts"]
