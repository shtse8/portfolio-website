# kylet-api — tiny Bun server (stats + chat) for kylet.se.
# Built with context = "api"; copies just this directory.
FROM oven/bun:1.1-alpine

WORKDIR /app
COPY . ./

ENV PORT=3001
EXPOSE 3001

# Bun runs the TypeScript entrypoint directly — no build step needed.
CMD ["bun", "run", "index.ts"]
