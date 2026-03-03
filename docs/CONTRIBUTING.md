# Contributing

## Branches

```
main               production
  └── improvements     dev branch -- branch from here
        ├── feature/
        ├── fix/
        └── refactor/
```

Examples: `feature/add-user-auth`, `fix/cors-mismatch`, `docs/update-api`

1. Branch from `improvements`
2. Work, commit, push
3. PR to `improvements`, get one review
4. `improvements` -> `main` when stable

## Code Style

- ES Modules, no CommonJS
- 2-space indent, double quotes (Prettier)
- `camelCase` vars/functions, `PascalCase` classes, `UPPER_SNAKE_CASE` constants
- One export per file. Controllers thin, logic in `services/`.

Before committing: `npm run lint && npm run format`

## Commits

Conventional Commits format:

```
feat: Add Bengali language support
fix: Resolve CORS error on different port
refactor: Extract scoring into service module
test: Add scoring edge case tests
chore: Update Express to v5.1.0
```

## Pull Requests

Before opening: `npm run lint && npm test`

Include: what it does, how to test, screenshots if UI. One feature/fix per PR.

Checklist: lint passes, tests pass, no secrets, new env vars in `.env.example`.

One review required. Don't force-push during review.

## Tests

```bash
npm test    # Jest + Supertest, SKIP_DB=true
```

Files in `tests/`, named `*.test.js`. Focus on scoring logic, API responses, validation, edge cases.

## Env Vars

New variable? Add to `.env.example`, add Zod validation in `config/env.js` if required. Never commit values.

## Security

Don't commit secrets. Validate inputs with Zod. Sanitize before rendering. Run `npm audit` periodically. Only whitelist needed CORS origins.
