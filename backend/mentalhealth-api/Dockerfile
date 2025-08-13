# Base image
FROM node:20-alpine

WORKDIR /app

# Install dependencies first for better caching
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --no-audit --no-fund || npm install --production --no-audit --no-fund

# Copy source (filtered by .dockerignore)
COPY . .

# Ensure node user can write (logs etc.)
RUN mkdir -p logs && chown -R node:node /app

ENV NODE_ENV=production
EXPOSE 8000

USER node

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD wget -qO- http://127.0.0.1:8000/health || exit 1

CMD ["node", "index.js"]
