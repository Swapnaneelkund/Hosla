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

# Lightweight JS healthcheck (avoid wget flakiness)
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=5 CMD node -e "const http=require('http');const req=http.get('http://127.0.0.1:8000/health',r=>{if(r.statusCode!==200)process.exit(1);}).on('error',()=>process.exit(1)); setTimeout(()=>req.abort(),4000);"

CMD ["node", "index.js"]
