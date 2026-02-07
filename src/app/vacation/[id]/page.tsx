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
  getCardOwner,
  CARD_OWNER_COLORS,
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
  // Also color cards found in transactions (may not be in config)
  for (const t of data.transactions) {
    if (t.card && !cardColorMap[t.card]) {
      const owner = getCardOwner(t.card, config);
      cardColorMap[t.card] = CARD_OWNER_COLORS[owner];
    }
  }

  return (
    <div className="container-fluid px-4 py-3">
      <div className="page-header mb-4">
        <h1 className="h4 fw-bold mb-0">{title}</h1>
      </div>

      {/* Summary cards */}
      <div className="row g-3 mb-4">
        <div className="col-6">
          <div className="card card-green-gradient rounded-3 p-3">
            <div className="small opacity-75">סה&quot;כ הוצאות</div>
            <div className="h4 fw-bold mb-1">{formatCurrency(data.total)}</div>
            <div className="small opacity-75">
              {data.transactions.length} הוצאות
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="card card-blue-gradient rounded-3 p-3">
            <div className="small opacity-75">ללא טיסות</div>
            <div className="h4 fw-bold mb-1">
              {formatCurrency(data.totalWithoutFlights)}
            </div>
            <div className="small opacity-75">
              {data.countWithoutFlights} הוצאות
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
