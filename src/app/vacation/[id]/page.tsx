import { loadVacationPage } from "@/server/queries";
import { TransactionTable } from "@/components/transaction-table";
import { CategoryChart } from "@/components/category-chart";
import { SummaryCards } from "@/components/summary-cards";
import { PageConfigProvider } from "@/contexts/page-config-context";
import { VacationTitleEditor } from "@/components/vacation-title-editor";

interface VacationPageProps {
  params: Promise<{ id: string }>;
}

export default async function VacationPage({ params }: VacationPageProps) {
  const { id } = await params;
  const sheetId = parseInt(id, 10);
  const {
    allCards,
    cardColorMap,
    categoryNames,
    colorMap,
    config,
    data,
    title,
  } = await loadVacationPage(sheetId);

  return (
    <PageConfigProvider
      config={config}
      allCards={allCards}
      colorMap={colorMap}
      cardColorMap={cardColorMap}
      categoryNames={categoryNames}
    >
      <div className="page-shell">
        <div className="page-header mb-4">
          <VacationTitleEditor sheetId={sheetId} title={title} pagePath={`/vacation/${id}`} />
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
    </PageConfigProvider>
  );
}
