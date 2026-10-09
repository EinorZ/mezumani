export const dynamic = "force-dynamic";

import { loadPensionPage } from "@/server/queries";
import { PensionDashboard } from "@/components/pension-dashboard";

export default async function PensionPage() {
  const data = await loadPensionPage();
  return (
    <div className="page-shell">
      <PensionDashboard data={data} />
    </div>
  );
}
