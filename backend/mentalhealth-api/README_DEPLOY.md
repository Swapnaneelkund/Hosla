# Mental Health API Deployment

## Prerequisites
- Docker
- (Optional) MongoDB instance / connection string
- OpenRouter API key for subjective LLM scoring (optional; without it fallback heuristic is used)

## Environment Variables
Create a `.env` file (or pass via your platform):
```
PORT=8000
mongodbURI=mongodb+srv://<user>:<pass>@cluster/db
OPENROUTER_API_KEY=sk-xxx
OPENROUTER_MODEL=deepseek/deepseek-r1-0528:free
CORS_ORIGIN=http://localhost:5500
```

## Build & Run (Docker)
```
docker build -t mentalhealth-api .
docker run -p 8000:8000 --env-file .env mentalhealth-api
```

## Health Check
GET http://localhost:8000/health

Response example:
```
{
	"status": "ok",
	"time": "2025-01-01T12:00:00.000Z",
	"uptimeSeconds": 1234,
	"db": "connected",
	"memory": { "rss": 50999296, "heapUsed": 18358240 }
}
```

## Testing Locally
```
npm install
npm test
```

## Notes
- Subjective scoring batches multiple answers per section when more than one subjective question exists.
- Without `OPENROUTER_API_KEY`, heuristic fallback scoring is applied.
- Rate limiting, Helmet, validation (Zod) included by default.

## Next Steps
- Add proper /health endpoint.
- Add CI pipeline for lint + test + docker build.
- Secrets management via your platform (GitHub Actions / Docker secrets).
