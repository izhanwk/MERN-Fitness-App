# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json

RUN npm ci --omit=dev --workspace backend

FROM node:20-bookworm-slim AS runner
WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=5000

COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/package.json /app/package.json
COPY --from=deps /app/package-lock.json /app/package-lock.json
COPY --from=deps /app/backend/package.json ./package.json
COPY backend ./

EXPOSE 5000

CMD ["node", "server.js"]
