export const dynamic = "force-dynamic";

import { getStockDashboardData, getPortfolioHistory } from "@/lib/stock-dashboard";
import { getStockConfig } from "@/lib/google-sheets";
import { StockDashboard } from "@/components/stock-dashboard";

export default async function StocksPage() {
  const [dashboardData, stockConfig, chartData] = await Promise.all([
    getStockDashboardData(),
    getStockConfig(),
    getPortfolioHistory("YTD"),
  ]);

  return (
    <div className="container-fluid px-4 py-3">
      <StockDashboard
        data={dashboardData}
        config={stockConfig}
        initialChartData={chartData}
        initialChartRange="YTD"
      />
    </div>
  );
}
