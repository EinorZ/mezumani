import { redirect } from "next/navigation";
import { listSheets, batchGetMonthsDone } from "@/lib/google-sheets";

export default async function Home() {
  const sheets = await listSheets();

  // Sort monthly sheets from oldest to newest
  const monthlySheets = sheets
    .filter((s) => s.type === "monthly")
    .sort(
      (a, b) =>
        (a.year ?? 0) - (b.year ?? 0) ||
        (a.monthIndex ?? 0) - (b.monthIndex ?? 0),
    );

  if (monthlySheets.length > 0) {
    // Find the oldest month not marked as done
    const doneFlags = await batchGetMonthsDone(monthlySheets);
    const target = monthlySheets.find((s) => !doneFlags.get(s.sheetId));
    // If all are done, fall back to the most recent month
    redirect(`/month/${(target ?? monthlySheets[monthlySheets.length - 1]).sheetId}`);
  }

  redirect("/settings");
}
