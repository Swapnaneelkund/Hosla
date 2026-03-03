# Integration Guide

For integrating the Shraddha mental health app into the Hosla website.

## Setup

```
shraddha.hosla.in  (InfinityFree)  -- Hosla landing page
Shraddha App       (Vercel)        -- mental health assessment
hosla-api          (Render)        -- backend API
                   (MongoDB Atlas) -- database
```

Mental health app is on Vercel, not InfinityFree. InfinityFree is too slow for interactive assessments (2-5s loads, no Node.js). Vercel: CDN, auto-deploy, auto-HTTPS.

## Integration Approach

**Current:** Link/button from Hosla site to the Vercel-hosted app. Simple redirect.

**After React migration:** Subdomain (`mentalhealth.hosla.in` -> Vercel) recommended. Shared components later when both apps are React.

## Data Flow

```
GET  /api/mentalhealth/questions  --> 24 questions
POST /api/mentalhealth/           --> scored results
Results stored in localStorage, rendered on results page
```

| Data | Where | Persistence |
|------|-------|-------------|
| Questions | MongoDB | Permanent |
| Results | MongoDB + localStorage | Permanent / until cleared |
| LLM cache | Server memory | Until restart |

No cross-site data access yet. Past results from Hosla site would need a new endpoint + auth.

## Authentication

None. Name/email are optional form fields. No login.

Future: JWT passthrough from Hosla, shared auth service, or anonymous + optional login.

## Styling

```css
/* Gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);

--primary: #667eea;  --secondary: #764ba2;  --accent: #f093fb;
--success: #10b981;  --warning: #fbbf24;    --danger: #ef4444;
--text-primary: #374151;  --text-secondary: #64748b;  --border: #e2e8f0;

/* Cards: 16px radius, blur(20px), rgba(255,255,255,0.9), shadow 0 20px 60px rgba(0,0,0,0.1) */
/* Font: 'Segoe UI', system-ui, -apple-system, sans-serif */
```

Logo: `frontend/mentalhealth/assets/logo.png`

## Getting Started

1. Get Contributor access to the repo
2. Follow [LOCAL-SETUP.md](LOCAL-SETUP.md) to run locally
3. Read these files first:

| File | What |
|------|------|
| `frontend/mentalhealth/src/js/mentalHealth.js` | Form logic, API calls |
| `frontend/mentalhealth/src/js/mentalHealthResult.js` | Results, charts, PDF |
| `backend/mentalhealth-api/app.js` | Express setup |
| `backend/mentalhealth-api/services/scoring/aggregator.js` | Scoring engine |
| `backend/mentalhealth-api/data/question.js` | Questionnaire data |

4. Initial integration -- just a link:
```html
<a href="https://<vercel-app>.vercel.app/mentalhealth/mentalHealth.html">
  Take Mental Health Assessment
</a>
```

5. Subdomain setup:
   - CNAME: `mentalhealth -> cname.vercel-dns.com`
   - Add `mentalhealth.hosla.in` in Vercel project settings

## React Migration

Backend API, scoring, DB, hosting -- all stay the same.

Frontend changes: HTML -> React components, localStorage -> React state, CSS -> Tailwind/modules, Vite build, React Router.

```
App.jsx
  /assessment --> AssessmentPage (UserDetailsForm, QuestionCard, ProgressBar)
  /results    --> ResultsPage (ScoreChart, SectionBreakdown, Recommendations, CrisisResources)
```

## API URL in Frontend

```javascript
const BASE_API_URL = window.location.hostname === "127.0.0.1"
    ? "http://localhost:8000"
    : "https://hosla-api.onrender.com";
```

## URLs

| What | URL |
|------|-----|
| API | `https://hosla-api.onrender.com` |
| Health | `https://hosla-api.onrender.com/health` |
| Site | `https://shraddha.hosla.in` |

## Meeting Prep -- React Discussion

1. Vite vs Next.js
2. State: Context vs Zustand
3. UI: custom vs MUI/Chakra
4. Subdomain vs shared components
5. Auth: when and what
6. Phased migration vs rewrite
