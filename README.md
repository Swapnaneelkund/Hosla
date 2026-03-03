# Shraddha -- Hosla Mental Health Assessment

Mental health screening app for seniors (50+). Part of the Hosla ecosystem.
Multilingual (EN/HI/BN), 24 questions across 6 dimensions, scores via LLM + keyword fallback.

| | URL |
|---|---|
| Frontend | Vercel |
| API | `https://hosla-api.onrender.com` |
| Site | `https://shraddha.hosla.in` |

## Tech Stack

**Frontend:** HTML/CSS/JS, Tailwind v4, Chart.js, jsPDF, Font Awesome
**Backend:** Node 20, Express 5, MongoDB (Mongoose), Zod, Winston, Helmet, Nodemailer
**Infra:** Vercel (frontend), Render (API), MongoDB Atlas, Docker, GitHub Actions CI
**LLM:** OpenRouter / DeepSeek R1 (free tier) for subjective scoring

Frontend React migration is planned. Vite as build tool.

## Architecture

```
Browser --> Vercel (static) --> Render (Express API) --> MongoDB Atlas
                                       |
                                       +--> OpenRouter (LLM scoring)
```

1. Frontend fetches questions: `GET /api/mentalhealth/questions`
2. User completes 24 questions (12 MCQ + 12 open-text)
3. Frontend submits answers: `POST /api/mentalhealth/`
4. Backend scores, saves to MongoDB, returns results
5. Frontend renders charts + recommendations from `localStorage`

## Project Structure

```
backend/mentalhealth-api/
  config/          Database-Connection.js, env.js (Zod validation)
  controllers/     predictController.js, emailController.js
  data/            question.js (24 questions, 6 sections)
  middleware/      globalErrorHandler.js, validateAssessment.js
  models/          assessmentResultModel.js, questionModel.js
  routes/          predictRoutes.js, emailRoutes.js
  services/scoring/ aggregator.js, objectiveEvaluator.js, subjectiveEvaluator.js
  tests/           scoring.test.js, integration.assessment.test.js
  utils/           ApiError.js, ApiResponseHandler.js, AsyncHandler.js, logger.js
  app.js, index.js, seed.js, Dockerfile, docker-compose.dev.yml

frontend/mentalhealth/
  src/css/         mentalhealth.css, mentalHealthResult.css, Tailwind files
  src/js/          mentalHealth.js, mentalHealthResult.js
  mentalHealth.html, mentalHealthResult.html
  assets/logo.png
```

## Quick Start

```bash
# Backend
cd backend/mentalhealth-api
cp .env.example .env    # fill in MongoDB URI
npm install && npm run seed && npm run dev

# Frontend (new terminal)
cd frontend/mentalhealth
npm install
# Open mentalHealth.html with VS Code Live Server
```

## Docs

| Doc | What |
|-----|------|
| [docs/LOCAL-SETUP.md](docs/LOCAL-SETUP.md) | Full local dev setup |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design, scoring logic, schemas |
| [docs/API.md](docs/API.md) | API endpoints |
| [docs/INTEGRATION-GUIDE.md](docs/INTEGRATION-GUIDE.md) | Hosla site integration |
| [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) | Code standards, branching, PRs |
| [docs/COMPLIANCE-AND-PRIVACY.md](docs/COMPLIANCE-AND-PRIVACY.md) | Data privacy, compliance |
| [docs/ADR.md](docs/ADR.md) | Architecture decisions |

## Hosting

| Service | Platform | Note |
|---------|----------|------|
| Frontend | Vercel | Fast, CDN, auto-HTTPS |
| API | Render | Free tier, cold starts on idle |
| Database | MongoDB Atlas | Free M0 cluster |
| Hosla site | InfinityFree | Slow -- app hosted separately on Vercel to avoid this |

## Assessment Dimensions

| Section | Weight |
|---------|--------|
| Depression | 20% |
| Anxiety | 20% |
| Cognitive | 20% |
| Social | 15% |
| Physical Well-being | 15% |
| Purpose & Meaning | 10% |

Scoring: >= 85% Excellent, >= 70% Good, >= 55% Moderate, < 55% Needs Attention

Crisis resources (Hosla helpline +91 7811-009-309) displayed on all results pages.
