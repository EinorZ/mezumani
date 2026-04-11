export const dynamic = "force-dynamic";

import { getPensionData } from "@/lib/actions";
import { PensionDashboard } from "@/components/pension-dashboard";

export default async function PensionPage() {
  const data = await getPensionData();
  return (
    <div className="container-fluid px-4 py-3">
      <PensionDashboard data={data} />
    </div>
  );
}
