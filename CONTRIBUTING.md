# Contributing to 3A9AR.ma

Thanks for helping build the Moroccan real estate platform. All contributions are welcome.

## Getting started

1. Fork the repo
2. Clone your fork and install deps: `npm install`
3. Set up env vars (see `.env.example`)
4. Run the dev server: `npm run dev`

## Guidelines

- Keep PRs focused on one feature or fix
- Write a descriptive PR title referencing the issue number: `fix #12: translate mortgage calc`
- Follow existing code style (Prettier, ESLint)
- TypeScript only — no JS files
- Add tests when changing business logic

## Commit style

Use conventional commits:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `refactor:` code change without behavior change
- `chore:` tooling

## Review process

Every PR must:
- [ ] Pass CI (typecheck + build)
- [ ] Be reviewed by a maintainer
- [ ] Have a clear description of what changed and why

## First-time contributors

Look for issues labeled `good first issue`. Comment on the issue to get assigned, then submit your PR.
