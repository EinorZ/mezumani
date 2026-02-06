import Link from "next/link";
import {
  getMonthlyData,
  listSheets,
  getAppConfig,
  getVacationRowsForMonth,
} from "@/lib/google-sheets";
import {
  formatCurrency,
  getAdjacentMonth,
  getCardOwner,
  getCategoryNames,
  buildCategoryColorMap,
  buildCardsWithOwner,
  CARD_OWNER_COLORS,
  OWNER_LABELS,
} from "@/lib/utils";
import { TransactionTable } from "@/components/transaction-table";
import { CategoryChart } from "@/components/category-chart";
import { CardBreakdown, type OwnerGroup } from "@/components/card-breakdown";

interface MonthPageProps {
  params: Promise<{ id: string }>;
}

export default async function MonthPage({ params }: MonthPageProps) {
  const { id } = await params;
  const sheetId = parseInt(id, 10);

  const [sheets, config] = await Promise.all([listSheets(), getAppConfig()]);

  const sheet = sheets.find((s) => s.sheetId === sheetId);
  if (!sheet) throw new Error(`Sheet with id ${sheetId} not found`);
  const title = sheet.title;

  const data = await getMonthlyData(title, config.summaryCards);

  const { cards: allCards, cardColorMap } = buildCardsWithOwner(config);
  const categoryNames = getCategoryNames(config.monthlyCategories);
  const colorMap = buildCategoryColorMap(
    config.monthlyCategories,
    config.vacationCategories,
  );
  // Also color cards found in transactions (may not be in config)
  for (const t of data.transactions) {
    if (t.card && !cardColorMap[t.card]) {
      const owner = getCardOwner(t.card, config);
      cardColorMap[t.card] = CARD_OWNER_COLORS[owner];
    }
  }
  const vacationSheets = sheets.filter((s) => s.type === "vacation");
  const vacationRows = await getVacationRowsForMonth(title, vacationSheets);

  const prevSheet = getAdjacentMonth(title, -1, sheets);
  const nextSheet = getAdjacentMonth(title, 1, sheets);

  // Group card breakdown by owner
  const cardsByOwner = new Map<string, { card: string; amount: number }[]>();
  for (const c of data.cards) {
    const owner = getCardOwner(c.card, config);
    if (!cardsByOwner.has(owner)) cardsByOwner.set(owner, []);
    cardsByOwner.get(owner)!.push(c);
  }

  return (
    <div className="container-fluid px-4 py-3">
      {/* Month nav */}
      <div className="d-flex align-items-center gap-2 mb-4">
        {prevSheet ? (
          <Link href={`/month/${prevSheet.sheetId}`} className="month-nav-btn">
            &#8250;
          </Link>
        ) : (
          <span className="month-nav-btn disabled">&#8250;</span>
        )}
        <h1 className="h4 fw-bold mb-0 mx-1">{title}</h1>
        {nextSheet ? (
          <Link href={`/month/${nextSheet.sheetId}`} className="month-nav-btn">
            &#8249;
          </Link>
        ) : (
          <span className="month-nav-btn disabled">&#8249;</span>
        )}
      </div>

      {/* Summary cards */}
      <div className="row g-3 mb-4">
        <div className="col">
          <div className="card card-green-gradient rounded-3 p-3">
            <div className="small opacity-75">סה&quot;כ</div>
            <div className="h5 fw-bold mb-0">
              {formatCurrency(data.summary.total)}
            </div>
            <div className="small opacity-75">
              {data.transactions.length} הוצאות
            </div>
          </div>
        </div>
        {data.summary.cards.map((card) => (
          <div key={card.label} className="col">
            <div className="card rounded-3 border p-3">
              <div className="small text-secondary">{card.label}</div>
              <div className="h5 fw-bold mb-0">
                {formatCurrency(card.amount)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table + Chart + Card breakdown */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card rounded-3 border p-3">
            <h3 className="h6 fw-bold mb-3">הוצאות החודש</h3>
            <TransactionTable
              transactions={data.transactions}
              sheetTitle={title}
              pagePath={`/month/${id}`}
              categories={categoryNames}
              cards={allCards}
              colorMap={colorMap}
              cardColorMap={cardColorMap}
              vacationRows={vacationRows}
            />
          </div>
        </div>
        <div className="col-lg-4">
          {data.cards.length > 0 && (
            <div className="card rounded-3 border p-3 mb-4">
              <h3 className="h6 fw-bold mb-3">לפי כרטיס</h3>
              <CardBreakdown
                groups={(["shared", "einor", "ziv"] as const)
                  .map((owner): OwnerGroup | null => {
                    const ownerCards = cardsByOwner.get(owner);
                    if (!ownerCards?.length) return null;
                    return {
                      owner,
                      label: OWNER_LABELS[owner],
                      color: CARD_OWNER_COLORS[owner],
                      cards: ownerCards,
                      total: ownerCards.reduce((s, c) => s + c.amount, 0),
                    };
                  })
                  .filter((group): group is OwnerGroup => group !== null)}
              />
            </div>
          )}
          <div className="card rounded-3 border p-3">
            <h3 className="h6 fw-bold mb-3">לפי קטגוריה</h3>
            <CategoryChart categories={data.categories} colorMap={colorMap} />
          </div>
        </div>
      </div>
    </div>
  );
}
