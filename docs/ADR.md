# Architecture Decision Records

## ADR-001: Express.js

Express 5 on Node 20. Team knows JS, biggest middleware ecosystem, minimal boilerplate for a small API. Not Fastify (smaller community), NestJS (overkill), Flask/Go (team is JS).

## ADR-002: MongoDB Atlas

MongoDB Atlas (free M0) + Mongoose. Flexible schema for evolving assessments. Nested documents (sections, question details) are a natural fit. AES-256 at rest. Not PostgreSQL (rigid schema), Firebase (lock-in), SQLite (not cloud-ready).

## ADR-003: Zod

Zod for request + env var validation. Zero deps, detailed errors, handles nested structures. Also validates env vars at startup in `config/env.js`. Not Joi (heavier), express-validator (coupled), manual (fragile).

## ADR-004: Dual Scoring (LLM + Keyword)

LLM via OpenRouter (DeepSeek R1) when API key set, keyword fallback otherwise. LLM gives nuanced text evaluation. Fallback keeps app functional without external deps. In-memory cache avoids duplicate calls. Trade-off: LLM varies slightly between runs; fallback is less accurate but deterministic. Metadata tracks which method was used.

## ADR-005: Vanilla JS Frontend (transitioning to React)

Started vanilla for fast prototyping with 2 pages. Now migrating: `mentalHealthResult.js` hit 1600+ lines, state management is getting messy, need component reuse for Hosla integration, team prefers React.

## ADR-006: Vercel Hosting

Frontend on Vercel, separate from InfinityFree. InfinityFree adds 2-5s load times. Vercel: CDN, auto-deploy, auto-HTTPS, Vite/React support. Not Netlify (team already on Vercel), GitHub Pages (limited), VPS (unnecessary overhead).

## ADR-007: Render Backend

API on Render. Free tier, Docker support, auto-HTTPS, env var management. Known issue: free tier cold starts on idle.

## ADR-008: Winston Logging

Winston with file transports. Standard Node logger, multiple transports, log levels, JSON format, request ID correlation. Files: `logs/combined.log`, `logs/error.log`.

## ADR-009: Helmet.js

Security headers middleware. CSP, HSTS, X-Frame-Options, etc. One line. Standard practice.

## ADR-010: Rate Limiting

express-rate-limit, 100 req / 15 min / IP. Assessment uses 2-3 calls per session. 100 is generous for legit use. Configurable in `app.js`.
