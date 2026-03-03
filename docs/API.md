# API

Base: `http://localhost:8000` (dev) | `https://hosla-api.onrender.com` (prod)

Rate limit: 100 req / 15 min / IP. All responses include `X-Request-Id` header.

## `GET /health`

```json
{ "status": "OK", "uptime": 12345, "database": "connected", "memory": {...} }
```

## `GET /api/mentalhealth/questions`

Returns all 24 questions grouped by section.

```json
{
  "success": true,
  "data": [{
    "sectionName": "Depression",
    "weight": 0.20,
    "questions": [
      {
        "_id": "...", "type": "subjective", "weight": 5,
        "text": { "en": "...", "hi": "...", "bn": "..." },
        "criteria": ["stable mood", "positive outlook"]
      },
      {
        "_id": "...", "type": "objective", "weight": 5,
        "text": { "en": "...", "hi": "...", "bn": "..." },
        "options": [
          { "text": { "en": "Not at all" }, "score": 0 },
          { "text": { "en": "Several days" }, "score": 1 },
          { "text": { "en": "More than half the days" }, "score": 2 },
          { "text": { "en": "Nearly every day" }, "score": 3 }
        ]
      }
    ]
  }]
}
```

6 sections: Depression (0.20), Anxiety (0.20), Cognitive (0.20), Social (0.15), PhysicalWellbeing (0.15), PurposeAndMeaning (0.10). 4 questions each.

## `POST /api/mentalhealth/`

Submit answers, get scored results.

**Request:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "gender": "male",
  "address": "Mumbai",
  "phone": "9876543210",
  "ageRange": "60-69",
  "answers": [
    { "questionId": "...", "sectionName": "Depression", "type": "objective", "selectedOption": "B" },
    { "questionId": "...", "sectionName": "Depression", "type": "subjective", "answer": "I have been feeling..." }
  ]
}
```

**Validation:** `answers` non-empty array, each needs `questionId` + `sectionName`. Objective: `selectedOption` (A/B/C/D). Subjective: `answer` (min 3 chars).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "percentage": 72.5,
    "mentalAgeCategory": "Good Mental Well-being",
    "totalQuestions": 24,
    "completionRate": 100,
    "sectionBreakdown": [{
      "sectionName": "Depression",
      "rawScore": 7.2, "maxRawScore": 10,
      "sectionWeight": 0.20, "weightedScore": 14.4, "percentage": 72,
      "recommendations": [{ "text": "...", "priority": "medium" }],
      "questionDetails": [...]
    }],
    "recommendations": ["..."],
    "metadata": { "llmEvaluations": 12, "fallbackEvaluations": 0, "evaluationMethod": "llm" }
  }
}
```

## `POST /api/email/send-results`

Requires `EMAIL_USER` + `EMAIL_PASS` env vars.

```json
{ "to": "user@example.com", "subject": "Your Results", "results": {...} }
```

Returns `{ "success": true, "message": "Results sent successfully" }`

## Errors

```json
{ "success": false, "message": "...", "statusCode": 400 }
```

400 = validation, 404 = not found, 429 = rate limited, 500 = server error. Dev includes `stack`, prod does not.

## CORS

`CORS_ORIGIN` env var, comma-separated: `http://127.0.0.1:5500,https://your-app.vercel.app`
