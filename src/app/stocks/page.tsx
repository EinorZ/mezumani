export const dynamic = "force-dynamic";

import { getStockDashboardData, getPortfolioHistory, computePortfolioReturns } from "@/lib/stock-dashboard";
import { getStockConfig } from "@/lib/google-sheets";
import { StockDashboard } from "@/components/stock-dashboard";

export default async function StocksPage() {
  const [dashboardData, stockConfig, chartData, fullHistory] = await Promise.all([
    getStockDashboardData(),
    getStockConfig(),
    getPortfolioHistory("YTD"),
    getPortfolioHistory("Max", { downsample: false }),
  ]);

  const portfolioReturns = computePortfolioReturns(fullHistory);

  return (
    <div className="container-fluid px-4 py-3">
      <StockDashboard
        data={dashboardData}
        config={stockConfig}
        initialChartData={chartData}
        initialChartRange="YTD"
        portfolioReturns={portfolioReturns}
      />
    </div>
  );
}
