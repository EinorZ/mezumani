import {
  getVacationData,
  getAppConfig,
  getSheetTitle,
} from "@/lib/google-sheets";
import {
  formatCurrency,
  getCategoryNames,
  buildCategoryColorMap,
  buildCardsWithOwner,
} from "@/lib/utils";
import { TransactionTable } from "@/components/transaction-table";
import { CategoryChart } from "@/components/category-chart";

interface VacationPageProps {
  params: Promise<{ id: string }>;
}

export default async function VacationPage({ params }: VacationPageProps) {
  const { id } = await params;
  const sheetId = parseInt(id, 10);
  const title = await getSheetTitle(sheetId);

  const [data, config] = await Promise.all([
    getVacationData(title),
    getAppConfig(),
  ]);

  const vacCategoryNames = getCategoryNames(config.vacationCategories);
  const colorMap = buildCategoryColorMap(
    config.monthlyCategories,
    config.vacationCategories,
  );
  const { cards: allCards, cardColorMap } = buildCardsWithOwner(config);

  return (
    <div className="container-fluid px-4 py-3">
      <h1 className="h4 fw-bold mb-4">{title}</h1>

      {/* Summary cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card card-green-gradient rounded-3 p-3">
            <div className="small opacity-75">סה&quot;כ הוצאות</div>
            <div className="h4 fw-bold mb-1">{formatCurrency(data.total)}</div>
            <div className="small opacity-75">
              {data.transactions.length} הוצאות
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card rounded-3 border p-3">
            <div className="small text-secondary mb-2">תשלום לפי חודש</div>
            <div className="d-flex flex-wrap gap-3">
              {data.monthBreakdown.map((mb) => (
                <div key={mb.month}>
                  <span className="small text-secondary">{mb.month}: </span>
                  <span className="fw-bold">{formatCurrency(mb.amount)}</span>
                </div>
              ))}
              {data.monthBreakdown.length === 0 && (
                <span className="small text-secondary">אין נתונים</span>
              )}
            </div>
          </div>
        </div>
      </div>

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
