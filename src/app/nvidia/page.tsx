export const dynamic = "force-dynamic";

import { getNvidiaCompensationData } from "@/lib/nvidia-dashboard";
import { NvidiaDashboard } from "@/components/nvidia-dashboard";

export default async function NvidiaPage() {
  const data = await getNvidiaCompensationData();

  return (
    <div className="container-fluid px-4 py-3">
      <NvidiaDashboard data={data} />
    </div>
  );
}
