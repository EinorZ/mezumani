# Current application architecture

This map describes the post-audit boundaries. It is intentionally small: Google
Sheets remains the persistence system and no API, authentication, or database
contract was changed.

```text
src/app/** page + layout (server-rendered routes)
          │
          ▼
src/server/queries.ts (read orchestration / page view-model assembly)
          │
          ├──────────────► src/lib/*-dashboard.ts (domain calculations)
          │
          ▼
src/lib/google-sheets.ts + src/lib/pension-sheets.ts (persistence adapters)
          │
          ▼
src/server/persistence/google-sheets-client.ts (credentials, workbook IDs, client)
          │
          ▼
Google Sheets API

Client components ──► src/lib/actions.ts (validated mutation boundary)
                              │
                              └──► persistence adapters
```

## Boundary rules

- Routes and client components do not import persistence adapters directly.
- Server-rendered reads enter through `src/server/queries.ts`.
- Client mutations enter through `src/lib/actions.ts`, which validates all
  untrusted arguments before invoking an adapter.
- Spreadsheet credentials and workbook selection stay in the server-only
  persistence client.
- Domain calculations should remain pure and covered by focused unit tests.
- Sheet names, columns, formulas, authentication, and workbook selection are
  compatibility contracts documented in `persistence-contracts.md`.

## UI structure

- `src/app/layout.tsx` owns the shared application shell.
- `src/components/sidebar.tsx` provides the expandable desktop navigation,
  mobile app bar, RTL drawer, and mobile bottom navigation.
- `.page-shell` is the shared responsive content container.
- `src/components/ui/route-state.tsx` provides route-level loading and error
  states.
- Feature dashboards remain client components only where interaction or chart
  libraries require them; route data loading remains server-side.

## Quality gate

`npm run check` runs unit tests, TypeScript, and ESLint with a zero-warning
ceiling. `npm run build` is the production integration check. Formatting remains
a separate legacy cleanup concern so it cannot hide correctness regressions.
