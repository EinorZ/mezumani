import { getVacationData, getSheetTitle } from "@/lib/google-sheets";
import {
  loadPageConfig,
  getCategoryNames,
  ensureTransactionCardColors,
} from "@/lib/page-helpers";
import { TransactionTable } from "@/components/transaction-table";
import { CategoryChart } from "@/components/category-chart";
import { SummaryCards } from "@/components/summary-cards";

interface VacationPageProps {
  params: Promise<{ id: string }>;
}

export default async function VacationPage({ params }: VacationPageProps) {
  const { id } = await params;
  const sheetId = parseInt(id, 10);
  const title = await getSheetTitle(sheetId);

  const [data, { config, allCards, cardColorMap, colorMap }] =
    await Promise.all([getVacationData(title), loadPageConfig()]);

  const vacCategoryNames = getCategoryNames(config.vacationCategories);
  ensureTransactionCardColors(data.transactions, cardColorMap, config);

  return (
    <div className="container-fluid px-4 py-3">
      <div className="page-header mb-4">
        <h1 className="h4 fw-bold mb-0">{title}</h1>
      </div>

      <SummaryCards
        cards={[
          {
            label: 'סה"כ הוצאות',
            amount: data.total,
            subtitle: `${data.transactions.length} הוצאות`,
            gradient: "card-red-gradient",
          },
          {
            label: "ללא טיסות",
            amount: data.totalWithoutFlights,
            subtitle: `${data.countWithoutFlights} הוצאות`,
            gradient: "card-blue-gradient",
          },
        ]}
      />

      {/* Table + Chart */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card rounded-3 border p-3">
            <h3 className="h6 fw-bold mb-3">הוצאות</h3>
            <TransactionTable
              transactions={data.transactions}
              sheetTitle={title}
              pagePath={`/vacation/${id}`}
              categories={vacCategoryNames}
              cards={allCards}
              cardColorMap={cardColorMap}
              colorMap={colorMap}
              isVacation
            />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card rounded-3 border p-3">
            <h3 className="h6 fw-bold mb-3">לפי קטגוריה</h3>
            <CategoryChart categories={data.categories} colorMap={colorMap} />
          </div>
        </div>
      </div>
    </div>
  );
}
