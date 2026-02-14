import {
  getMonthlyData,
  listSheets,
  getVacationRowsForMonth,
  syncVacationRowsToMonthSheet,
} from "@/lib/google-sheets";
import {
  CARD_OWNER_COLORS,
  OWNER_LABELS,
  getCardOwner,
} from "@/lib/utils";
import {
  loadPageConfig,
  getCategoryNames,
  ensureTransactionCardColors,
} from "@/lib/page-helpers";
import { TransactionTable } from "@/components/transaction-table";
import { CategoryChart } from "@/components/category-chart";
import { CardBreakdown, type OwnerGroup } from "@/components/card-breakdown";
import { ExcelImportButton } from "@/components/excel-import-button";
import { IncomeTable } from "@/components/income-bar";
import { SummaryCards, type SummaryCardData } from "@/components/summary-cards";
import { updateMonthIncomeAction } from "@/lib/actions";

interface MonthPageProps {
  params: Promise<{ id: string }>;
}

export default async function MonthPage({ params }: MonthPageProps) {
  const { id } = await params;
  const sheetId = parseInt(id, 10);

  const [sheets, { config, allCards, cardColorMap, colorMap }] =
    await Promise.all([listSheets(), loadPageConfig()]);

  const sheet = sheets.find((s) => s.sheetId === sheetId);
  if (!sheet) throw new Error(`Sheet with id ${sheetId} not found`);
  const title = sheet.title;

  const categoryNames = getCategoryNames(config.monthlyCategories);

  // Sync vacation rows into the monthly sheet, then fetch data (includes synced rows)
  const vacationSheets = sheets.filter((s) => s.type === "vacation");
  const vacationRows = await getVacationRowsForMonth(title, vacationSheets);
  await syncVacationRowsToMonthSheet(title, vacationRows);

  const data = await getMonthlyData(title, config.summaryCards);
  ensureTransactionCardColors(data.transactions, cardColorMap, config);

  // Group card breakdown by owner
  const cardsByOwner = new Map<string, { card: string; amount: number }[]>();
  for (const c of data.cards) {
    const owner = getCardOwner(c.card, config);
    if (!cardsByOwner.has(owner)) cardsByOwner.set(owner, []);
    cardsByOwner.get(owner)!.push(c);
  }

  // Build top summary cards (income row)
  const topCards: SummaryCardData[] | null =
    data.income.length > 0
      ? [
          {
            label: 'סה"כ הוצאות',
            amount: data.summary.total,
            subtitle: `${data.transactions.length} הוצאות`,
            gradient: "card-red-gradient",
          },
          {
            label: 'סכ"ה הכנסות',
            amount: data.totalIncome,
            subtitle: `${data.income.length} מקורות`,
            gradient: "card-green-gradient",
          },
          {
            label: "חיסכון חודשי",
            amount: data.totalIncome - data.summary.total,
            gradient: "card-purple-gradient",
          },
        ]
      : null;

  // Build custom category summary cards
  const gradients = [
    "card-orange-gradient",
    "card-blue-gradient",
    "card-purple-gradient",
  ];
  const categorySummaryCards: SummaryCardData[] = [
    ...(data.income.length === 0
      ? [
          {
            label: 'סה"כ הוצאות',
            amount: data.summary.total,
            subtitle: `${data.transactions.length}`,
            gradient: "card-red-gradient",
          },
        ]
      : []),
    ...data.summary.cards.map((card, i) => ({
      label: card.label,
      amount: card.amount,
      subtitle: `${card.count}`,
      gradient: gradients[i % gradients.length],
    })),
  ];

  return (
    <div className="container-fluid px-4 py-3">
      <div className="page-header mb-4">
        <h1 className="h4 fw-bold mb-0">{title}</h1>
      </div>

      {topCards && <SummaryCards cards={topCards} />}
      {categorySummaryCards.length > 0 && (
        <SummaryCards cards={categorySummaryCards} compact />
      )}

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
          {data.income.length > 0 && (
            <div className="mb-4">
              <IncomeTable
                income={data.income}
                totalIncome={data.totalIncome}
                totalExpenses={data.summary.total}
                sheetTitle={title}
                onUpdateIncome={updateMonthIncomeAction}
              />
            </div>
          )}
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
