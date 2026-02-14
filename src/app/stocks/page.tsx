export const dynamic = "force-dynamic";

import { getStockDashboardData } from "@/lib/stock-dashboard";
import { getStockConfig } from "@/lib/google-sheets";
import { StockDashboard } from "@/components/stock-dashboard";

export default async function StocksPage() {
  const [dashboardData, stockConfig] = await Promise.all([
    getStockDashboardData(),
    getStockConfig(),
  ]);

  return (
    <div className="container-fluid px-4 py-3">
      <StockDashboard data={dashboardData} config={stockConfig} />
    </div>
  );
}
