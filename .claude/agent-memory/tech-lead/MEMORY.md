# Tech Lead Memory - mezumani

## Architecture
- URLs use numeric `sheetId` (from Google Sheets API) instead of encoded Hebrew titles
- Routes: `/month/[id]`, `/vacation/[id]`, `/year/[year]`
- `SheetInfo` includes `sheetId: number` field
- `classifySheet(sheetId, title)` takes two params
- `getSheetTitle(sheetId)` in google-sheets.ts resolves id to title
- `getAdjacentMonth(title, direction, sheets)` returns `SheetInfo | null`
- `stripYearSuffix(title)` strips " XX" suffix for sidebar display
- Google Sheets API still uses titles for range references internally
- `VacationMonthRow` has `vacationSheetId` for linking

## Key Patterns
- Server actions resolve sheetId via `getSheetIdByTitle()` for revalidation
- `listSheets()` fetches both `sheetId` and `title` from API
- Sidebar shows stripped names (no year suffix) since year is the group header
- `AnnualTable` receives `sheets` prop to resolve month titles to sheetIds for links
