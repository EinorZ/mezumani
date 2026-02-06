import { getAnnualData, listSheets } from "@/lib/google-sheets";
import { AnnualTable } from "@/components/annual-table";

interface YearPageProps {
  params: Promise<{ year: string }>;
}

export default async function YearPage({ params }: YearPageProps) {
  const { year } = await params;
  const yearSuffix = parseInt(year, 10);
  const [data, sheets] = await Promise.all([
    getAnnualData(yearSuffix),
    listSheets(),
  ]);

  return (
    <div className="container-fluid px-4 py-3">
      <h1 className="h4 fw-bold mb-4">סיכום שנתי 20{yearSuffix}</h1>

      <div className="card rounded-3 border p-3">
        <AnnualTable data={data} yearSuffix={yearSuffix} sheets={sheets} />
      </div>
    </div>
  );
}
