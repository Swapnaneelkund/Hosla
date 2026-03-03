# Compliance & Privacy

This project handles mental health data. All assessment responses and scores are sensitive.

## Data Collected

**User-provided (optional except gender/age):** name, email, phone, address, gender, age range, 24 assessment answers.

**System-generated:** section scores, overall percentage, category, recommendations, timestamp.

## Storage

| Location | Data | Encrypted |
|----------|------|-----------|
| MongoDB Atlas | Results, scores, user info | AES-256 at rest |
| Browser localStorage | Current session result | No |
| Server memory | LLM cache | Volatile |
| Log files | Request/error logs | No |

All transit is HTTPS/TLS (Vercel->Render, Render->Atlas, Render->OpenRouter, SMTP).

## Third Parties

**OpenRouter (LLM scoring):** Receives question text + user answer + criteria only. No PII sent (no name, email, phone). Disabled without API key -- keyword fallback used instead.

**Gmail:** Results emailed via SMTP if user requests it.

## What's Missing

| Gap | Priority |
|-----|----------|
| Explicit consent screen | High |
| Data retention/purge | High |
| User authentication | High |
| Self-service data deletion | High |
| Audit logging | Medium |
| App-level encryption | Medium |

India DPDPA 2023: needs explicit consent UI, purpose limitation (met), retention limits (not implemented).

GDPR (best practice): data minimization (met -- identity optional), purpose limitation (met), right to erasure (missing), portability (PDF download -- partial).

## Security

Helmet (headers), rate limit (100/15min/IP), Zod validation, CORS whitelist, UUID request tracking, Docker non-root, CI lint+test.

## Clinical Disclaimer

Screening tool only. Based on PHQ-2/GAD-2 patterns + custom dimensions. Does not diagnose. Does not replace clinical evaluation.

## Crisis Protocol

Score < 55%: "seek professional counseling" flagged as high priority.

All results pages show: Hosla helpline (+91 7811-009-309, 24/7), mental health resources, therapist directory. Emphasized for low scores.

## Incident Response

If compromised: notify lead, rotate all credentials (MongoDB, OpenRouter, Gmail, JWT, Render/Vercel env vars), document scope, notify affected users, post-mortem.

## Retention Policy (not yet implemented)

| Data | Keep | Then |
|------|------|------|
| Results | 12 months | Delete |
| User identity | 12 months | Delete |
| Server logs | 90 days | Delete |
| localStorage | User-controlled | -- |
