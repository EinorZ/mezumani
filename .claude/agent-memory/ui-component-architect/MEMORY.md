# UI Component Architect Memory

## Project Stack
- Next.js App Router, React 19, TypeScript
- Bootstrap RTL (not Tailwind) - `bootstrap/dist/css/bootstrap.rtl.min.css`
- Font: Rubik (Hebrew/RTL app)
- Custom CSS in `src/app/globals.css` (no CSS modules, no Tailwind)
- No shadcn/ui - uses Bootstrap classes (`form-control`, `btn`, `badge`, etc.)
- Custom `SearchableSelect` and `MultiSearchableSelect` components

## Key Patterns
- Transaction table uses flex layout with `COL` constants for column sizing
- Optimistic UI pattern with `pendingAdds`, `pendingEdits`, `pendingDeletes`
- Undo stack for add/edit/delete operations
- RTL: use `inset-inline-start`, `padding-inline-start` for directional positioning

## Design Decisions
- Checkbox overlay pattern (Gmail-style): checkboxes hidden by default, shown on hover and when any row is selected
- Overlay uses `position: absolute` + `inset-inline-start: 0` for RTL compatibility
- Row padding shifts smoothly with `transition: padding-inline-start 120ms ease`
- Settings page: grouped collapsible sections with accent colors (blue/purple/green per group)
- CollapsibleSection: icon, description, accentColor, defaultOpen props; CSS max-height animation
- CSS custom property `--section-accent` for per-section border color via `border-inline-start`

## File Structure
- Components: `src/components/`
- Pages: `src/app/` (App Router)
- Utilities: `src/lib/utils.ts`, `src/lib/constants.ts`
- Actions: `src/lib/actions.ts` (server actions)
