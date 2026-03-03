# Architecture

## System Layout

```
Browser --> Vercel (static HTML/CSS/JS) --> Render (Express API) --> MongoDB Atlas
                                                   |
                                                   +--> OpenRouter (LLM, optional)
```

Frontend: static files on Vercel.
Backend: Express 5 on Render, behind Helmet + rate limiter + CORS.
Database: MongoDB Atlas (free M0).
LLM: OpenRouter/DeepSeek R1 for subjective scoring. Keyword fallback without it.

## Data Flow

1. User opens `mentalHealth.html`, fills form (name, email, language, etc.)
2. Frontend: `GET /api/mentalhealth/questions` -- fetches 24 questions
3. User answers one question at a time (progress bar tracks position)
4. Frontend: `POST /api/mentalhealth/` with all answers
5. Backend validates (Zod), scores each section, returns results
6. Frontend stores result in `localStorage`, redirects to `mentalHealthResult.html`
7. Results page renders: chart, section breakdown, recommendations, crisis resources
8. User can download PDF, email results, or share

## Scoring

### Weights

| Section | Weight |
|---------|--------|
| Depression | 20% |
| Anxiety | 20% |
| Cognitive | 20% |
| Social | 15% |
| Physical Well-being | 15% |
| Purpose & Meaning | 10% |

Each section: 2 objective + 2 subjective questions.

### Objective (MCQ)

4 options scored 0-3 (Not at all / Several days / More than half / Nearly every day).

Inverted for well-being: `score = weight * (1 - selected/max)`

"Nearly every day" (3/3) = 0 well-being. "Not at all" (0/3) = full well-being.

### Subjective (open text)

**With LLM (OpenRouter key set):** Sends question + answer + criteria to DeepSeek R1. Returns structured score, matched/missing criteria, explanation. Cached in memory.

**Without LLM (fallback):** Keyword matching against question criteria + synonym expansion. Bonuses: +5% for 20+ words, +3% for causal language, +2% for 10+ words.

### Categories

| Score | Category |
|-------|----------|
| >= 85% | Excellent Mental Resilience |
| >= 70% | Good Mental Well-being |
| >= 55% | Moderate Mental Health |
| < 55% | Needs Attention |

Sections < 55% get high-priority recommendations. < 70% get medium.

## Database Schemas

### assessmentresults

```javascript
{
  userId: String,            // optional
  userName: String,
  finalScore: Number,
  maxPossibleScore: Number,
  percentage: Number,
  mentalAgeCategory: String,
  recommendations: [String],
  sectionBreakdown: [{
    sectionName, rawScore, maxRawScore,
    sectionWeight, weightedScore, percentage,
    questionDetails: [Mixed]
  }],
  timestamp: Date,
  totalQuestions: Number,
  completionRate: Number
}
```

### questions

```javascript
{
  sectionName: String,
  type: "objective" | "subjective",
  weight: Number,
  text: { en: String, hi: String, bn: String },
  options: [{ text: { en, hi, bn }, score: Number }],  // objective only
  criteria: [String]                                    // subjective only
}
```

## Security

Helmet (headers), rate limiting (100/15min/IP), CORS whitelist, Zod validation, UUID request IDs, no stack traces in prod, Winston logging, Docker non-root Alpine, CI lint+test on push.

## Crisis Handling

Score < 55%: high-priority "seek professional counseling" recommendation.
Crisis resources (Hosla helpline, therapist directories) shown on every results page. Emphasized for low scores.
