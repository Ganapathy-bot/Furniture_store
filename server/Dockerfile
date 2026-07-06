FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
COPY shared/package.json ./shared/
COPY server/package.json ./server/

RUN npm ci --workspace=shared --workspace=server

COPY shared/ ./shared/
COPY server/ ./server/

RUN npm run build -w shared && npm run build -w server

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json* ./
COPY shared/package.json ./shared/
COPY server/package.json ./server/

RUN npm ci --workspace=shared --workspace=server --omit=dev

COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/server/dist ./server/dist

RUN mkdir -p /app/server/uploads

EXPOSE 5000

CMD ["node", "server/dist/server.js"]