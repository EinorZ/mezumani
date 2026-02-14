# UI Component Architect Memory

## Project Stack
- Next.js App Router (v16+), React 19, TypeScript strict
- Bootstrap 5 RTL (not Tailwind) - `bootstrap/dist/css/bootstrap.rtl.min.css`
- Font: Rubik (Hebrew/RTL app)
- Custom CSS in `src/app/globals.css` (no CSS modules, no Tailwind)
- No shadcn/ui - uses Bootstrap classes (`form-control`, `btn`, `badge`, etc.)
- Custom `SearchableSelect` and `MultiSearchableSelect` components
- `recharts` v3.7.0 installed for charts
- `lucide-react` for icons

## Key Patterns
- Transaction table uses flex layout with `COL` constants for column sizing
- Optimistic UI pattern with `pendingAdds`, `pendingEdits`, `pendingDeletes`
- Undo stack for add/edit/delete operations
- RTL: use `inset-inline-start`, `padding-inline-start` for directional positioning
- P&L values wrapped in `dir="ltr"` spans to prevent RTL sign issues

## Design Decisions
- Checkbox overlay pattern (Gmail-style): checkboxes hidden by default, shown on hover and when any row is selected
- Overlay uses `position: absolute` + `inset-inline-start: 0` for RTL compatibility
- Row padding shifts smoothly with `transition: padding-inline-start 120ms ease`
- Settings page: grouped collapsible sections with accent colors (blue/purple/green per group)
- CollapsibleSection: icon, description, accentColor, defaultOpen props; CSS max-height animation
- CSS custom property `--section-accent` for per-section border color via `border-inline-start`
- Card gradients: `.card-green-gradient`, `.card-blue-gradient`, `.card-red-gradient`, etc.

## File Structure
- Components: `src/components/`
- Pages: `src/app/` (App Router)
- Utilities: `src/lib/utils.ts`, `src/lib/constants.ts`
- Actions: `src/lib/actions.ts` (server actions)
- Stock data: `src/lib/stock-dashboard.ts`, `src/lib/stock-prices.ts`

## Recharts v3 Notes (see [recharts-v3.md](./recharts-v3.md))
- `activeIndex` prop removed from `Pie` in v3
- Use `shape` prop with `PieSectorShapeProps` type (has `isActive`, `index`)
- Import `PieSectorShapeProps` from `recharts`
- `activeShape` deprecated; prefer `shape` with `isActive` check

## Color Palette
- Green: #198754, Teal: #20c997
- Blue: #0d6efd, Cyan: #0dcaf0
- Purple: #6f42c1, Pink: #d63384
- Red: #dc3545, Orange: #fd7e14
- Amber: #ffc107, Gray: #adb5bd
- Term accents: short=#ffc107, medium=#0dcaf0, long=#198754

## Stock Types
- `StockHolding`: symbol, displayName, term, currentValueILS, profitLoss, etc.
- `StockGoal`: term + label + targetAmount (goals are per-term, not per-stock)
- Holdings have no built-in category/label field; label-based charts need a mapping
