# Mezumani

Mezumani is a private Hebrew, right-to-left household finance application built
with Next.js. Google Sheets is the persistence layer for monthly spending,
vacations, investments, RSUs, and pensions.

## Local development

Required environment variables:

- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SPREADSHEET_ID`
- `GOOGLE_STOCKS_SPREADSHEET_ID`

Never commit the values. The service account must have access to the configured
spreadsheets.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality commands

```bash
npm test
npm run typecheck
npm run lint
npm run check
npm run build
```

ESLint is the correctness gate. Prettier is intentionally separate through
`npm run format:check` and `npm run format` so formatting does not obscure logic
errors.

## Architecture notes

- [Current application architecture](docs/architecture/current-architecture.md)
- [Google Sheets persistence contracts](docs/architecture/persistence-contracts.md)

The public mutation boundary is `src/lib/actions.ts`. Runtime guards live in
`src/lib/action-validation.ts`; lower-level Sheets modules assume inputs have
already passed those guards.
