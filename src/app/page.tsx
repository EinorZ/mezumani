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

  // Fallback: redirect to the first monthly sheet available
  const firstMonth = sheets.find((s) => s.type === "monthly");
  if (firstMonth) {
    redirect(`/month/${firstMonth.sheetId}`);
  }

  // No monthly sheets at all — stay on home
  redirect("/settings");
}
