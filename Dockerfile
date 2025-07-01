# ---------- Stage 1: deps for backend ----------
FROM node:23-alpine AS deps-api
WORKDIR /api
COPY api/package*.json ./
RUN npm ci

# ---------- Stage 2: deps for frontend ----------
FROM node:23-alpine AS deps-app
WORKDIR /app
COPY app/package*.json ./
RUN npm ci

# ---------- Stage 3: build backend ----------
FROM deps-api AS build-api
COPY api/ ./
RUN npm run build

# ---------- Stage 4: build frontend ----------
FROM deps-app AS build-app
COPY app/ ./
RUN npm run build

# ---------- Stage 5: Final runtime ----------
FROM node:23-alpine AS runner

# Install tini & pm2
RUN apk add --no-cache tini
RUN npm install -g pm2

# Create workspace
WORKDIR /workspace

# Copy frontend build, SSR server, and runtime deps
COPY --from=build-app /app/dist ./app/dist
COPY --from=build-app /app/dist/server ./app/dist/server
COPY --from=build-app /app/index.html ./app/index.html
COPY --from=build-app /app/server.js ./app/server.js
COPY --from=build-app /app/node_modules ./app/node_modules
COPY --from=build-app /app/package.json ./app/package.json

# Copy backend build
COPY --from=build-api /api ./api

# Copy PM2 config and logs folder
COPY ecosystem.config.js ./
RUN mkdir -p ./logs

# Expose ports
EXPOSE 3000 5000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
