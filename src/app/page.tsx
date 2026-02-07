import { redirect } from "next/navigation";
import { listSheets } from "@/lib/google-sheets";
import { getCurrentMonthTitle } from "@/lib/utils";

export default async function Home() {
  const currentMonthTitle = getCurrentMonthTitle();
  const sheets = await listSheets();
  const currentSheet = sheets.find((s) => s.title === currentMonthTitle);

  if (currentSheet) {
    redirect(`/month/${currentSheet.sheetId}`);
  }

  // Fallback: redirect to the most recent monthly sheet available
  const monthlySheets = sheets
    .filter((s) => s.type === "monthly")
    .sort(
      (a, b) =>
        (b.year ?? 0) - (a.year ?? 0) ||
        (b.monthIndex ?? 0) - (a.monthIndex ?? 0),
    );
  if (monthlySheets.length > 0) {
    redirect(`/month/${monthlySheets[0].sheetId}`);
  }

  // No monthly sheets at all — stay on home
  redirect("/settings");
}
