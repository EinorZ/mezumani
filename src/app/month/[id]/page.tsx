import {
  getMonthlyData,
  listSheets,
  getAppConfig,
  getVacationRowsForMonth,
  syncVacationRowsToMonthSheet,
} from "@/lib/google-sheets";
import {
  formatCurrency,
  getCardOwner,
  getCategoryNames,
  buildCategoryColorMap,
  buildCardsWithOwner,
  CARD_OWNER_COLORS,
  OWNER_LABELS,
  getSummaryCardIcon,
} from "@/lib/utils";
import { TransactionTable } from "@/components/transaction-table";
import { CategoryChart } from "@/components/category-chart";
import { CardBreakdown, type OwnerGroup } from "@/components/card-breakdown";
import { ExcelImportButton } from "@/components/excel-import-button";

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

  const { cards: allCards, cardColorMap } = buildCardsWithOwner(config);
  const categoryNames = getCategoryNames(config.monthlyCategories);
  const colorMap = buildCategoryColorMap(
    config.monthlyCategories,
    config.vacationCategories,
  );

  // Sync vacation rows into the monthly sheet, then fetch data (includes synced rows)
  const vacationSheets = sheets.filter((s) => s.type === "vacation");
  const vacationRows = await getVacationRowsForMonth(title, vacationSheets);
  await syncVacationRowsToMonthSheet(title, vacationRows);

  const data = await getMonthlyData(title, config.summaryCards);

  // Also color cards found in transactions (may not be in config)
  for (const t of data.transactions) {
    if (t.card && !cardColorMap[t.card]) {
      const owner = getCardOwner(t.card, config);
      cardColorMap[t.card] = CARD_OWNER_COLORS[owner];
    }
  }

  // Group card breakdown by owner
  const cardsByOwner = new Map<string, { card: string; amount: number }[]>();
  for (const c of data.cards) {
    const owner = getCardOwner(c.card, config);
    if (!cardsByOwner.has(owner)) cardsByOwner.set(owner, []);
    cardsByOwner.get(owner)!.push(c);
  }

  return (
    <div className="container-fluid px-4 py-3">
      <div className="page-header mb-4">
        <h1 className="h4 fw-bold mb-0">{title}</h1>
      </div>

      {/* Summary cards */}
      <div className="row g-3 mb-4">
        {[
          {
            label: 'סה"כ',
            amount: data.summary.total,
            count: data.transactions.length,
            gradient: "card-green-gradient",
          },
          ...data.summary.cards.map((card, i) => {
            const gradients = [
              "card-blue-gradient",
              "card-purple-gradient",
              "card-orange-gradient",
            ];
            return {
              label: card.label,
              amount: card.amount,
              count: card.count,
              gradient: gradients[i % gradients.length],
            };
          }),
        ].map((card) => {
          const Icon = getSummaryCardIcon(card.label);
          return (
            <div key={card.label} className="col">
              <div className={`card ${card.gradient} rounded-3 p-3`}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="summary-card-icon">
                    <Icon size={18} />
                  </span>
                  <span className="small opacity-75">{card.label}</span>
                </div>
                <div className="h5 fw-bold mb-0 text-center">
                  {formatCurrency(card.amount)}
                </div>
                <div className="small opacity-75 text-center">
                  {card.count} הוצאות
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table + Chart + Card breakdown */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card rounded-3 border p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="h6 fw-bold mb-0">הוצאות החודש</h3>
              <ExcelImportButton
                sheetTitle={title}
                cards={allCards}
                cardColorMap={cardColorMap}
                pagePath={`/month/${id}`}
                categoryMappings={config.categoryMappings}
                expenseRenameRules={config.expenseRenameRules}
                recurringExpenses={config.recurringExpenses}
              />
            </div>
            <TransactionTable
              transactions={data.transactions.filter(
                (t) => !t.notes.startsWith("auto:vacation:"),
              )}
              sheetTitle={title}
              pagePath={`/month/${id}`}
              categories={categoryNames}
              cards={allCards}
              colorMap={colorMap}
              cardColorMap={cardColorMap}
              vacationRows={vacationRows}
              categoryMappings={config.categoryMappings}
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
