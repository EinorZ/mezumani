export const dynamic = "force-dynamic";

import { loadNvidiaPage } from "@/server/queries";
import { NvidiaDashboard } from "@/components/nvidia-dashboard";

export default async function NvidiaPage() {
  const data = await loadNvidiaPage();

  return (
    <div className="page-shell">
      <NvidiaDashboard data={data} renderedAt={new Date().toISOString()} />
    </div>
  );
}
