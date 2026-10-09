export const dynamic = "force-dynamic";

import { loadStocksPage } from "@/server/queries";
import { StockDashboard } from "@/components/stock-dashboard";

export default async function StocksPage() {
  const { dashboardData, stockConfig } = await loadStocksPage();

  return (
    <div className="page-shell">
      <StockDashboard
        data={dashboardData}
        config={stockConfig}
        initialChartData={undefined}
        initialChartRange="YTD"
        portfolioReturns={undefined}
        renderedAt={new Date().toISOString()}
      />
    </div>
  );
}
