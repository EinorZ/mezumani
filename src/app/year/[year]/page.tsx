import { getAnnualData, getAppConfig } from "@/lib/google-sheets";
import { buildCategoryColorMap, getCategoryNames } from "@/lib/utils";
import { AnnualDashboard } from "@/components/annual-dashboard";

interface YearPageProps {
  params: Promise<{ year: string }>;
}

export default async function YearPage({ params }: YearPageProps) {
  const { year } = await params;
  const yearSuffix = parseInt(year, 10);
  const [data, config] = await Promise.all([
    getAnnualData(yearSuffix),
    getAppConfig(),
  ]);

  const colorMap = buildCategoryColorMap(
    config.monthlyCategories,
    config.vacationCategories,
  );
  const categories = getCategoryNames(config.monthlyCategories);
  const vacationCategories = ["חול", "חופשה"];

  return (
    <AnnualDashboard
      data={data}
      colorMap={colorMap}
      categories={categories}
      vacationCategories={vacationCategories}
      yearSuffix={yearSuffix}
    />
  );
}
