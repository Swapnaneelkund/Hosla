# Local Setup

## Prerequisites

- Node.js 20.x
- Git
- VS Code + Live Server extension (recommended)
- Docker (optional)

## 1. Clone & Branch

```bash
git clone https://github.com/<org>/hosla-mentalHealth-project.git
cd hosla-mentalHealth-project
git checkout improvements
```

## 2. Backend

```bash
cd backend/mentalhealth-api
npm install
cp .env.example .env
```

Edit `.env`:

```env
PORT=8000
NODE_ENV=development
mongodbURI=mongodb+srv://<USER>:<PASS>@<CLUSTER>.mongodb.net/hosla_db?retryWrites=true&w=majority
CORS_ORIGIN=http://127.0.0.1:5500
SKIP_DB=false
```

Optional env vars:
- `OPENROUTER_API_KEY` -- free at openrouter.ai. Without it, scoring falls back to keyword matching.
- `EMAIL_USER` / `EMAIL_PASS` -- Gmail + App Password for email feature.

Seed and start:

```bash
npm run seed   # loads 24 questions into MongoDB
npm run dev    # http://localhost:8000
```

Verify: `curl http://localhost:8000/health` should return `{"status":"OK",...}`

## 3. Frontend

New terminal:

```bash
cd frontend/mentalhealth
npm install
```

Open `mentalHealth.html` with Live Server. It runs on `http://127.0.0.1:5500`.

Fill in the form, click "Start Assessment" -- if questions load, you're connected.

## 4. Docker (alternative)

Runs API + MongoDB locally without Atlas:

```bash
cd backend/mentalhealth-api
docker compose -f docker-compose.dev.yml up --build
```

API on :8000, MongoDB on :27017.

## 5. Tests

```bash
cd backend/mentalhealth-api
npm test       # Jest, runs with SKIP_DB=true
npm run lint   # ESLint
```

## Troubleshooting

**CORS error:** `CORS_ORIGIN` must match your frontend URL exactly. `localhost` != `127.0.0.1`.

**MongoDB won't connect:** Check Atlas IP whitelist, credentials, cluster URL. Set `SKIP_DB=true` to run without DB.

**Questions don't load:** Backend running? CORS correct? Did you `npm run seed`?

**LLM scoring not working:** Expected without `OPENROUTER_API_KEY`. Keyword fallback works fine.

## Commands

| Command | Where | What |
|---------|-------|------|
| `npm run dev` | backend | Dev server (nodemon) |
| `npm run seed` | backend | Seed questions |
| `npm test` | backend | Run tests |
| `npm run lint` | backend | Lint |
| `npm run format` | backend | Prettier |
| `npm run build:css` | frontend | Compile Tailwind |
| `npm run build:js` | frontend | Minify JS |
