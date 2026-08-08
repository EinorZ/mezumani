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

  const fullYear = 2000 + yearSuffix;
  const hasSavedIrregularCategories = Object.prototype.hasOwnProperty.call(
    config.irregularExpenseCategoriesByYear,
    String(fullYear),
  );
  const savedIrregularCategories =
    config.irregularExpenseCategoriesByYear[String(fullYear)];
  const previousIrregularYear = Object.keys(
    config.irregularExpenseCategoriesByYear,
  )
    .map(Number)
    .filter((candidateYear) => candidateYear < fullYear)
    .sort((a, b) => b - a)[0];
  const initialIrregularCategories =
    savedIrregularCategories ??
    (previousIrregularYear
      ? config.irregularExpenseCategoriesByYear[String(previousIrregularYear)]
      : vacationCategories);
  const goalForYear =
    config.annualGoals[String(fullYear)] ??
    config.annualGoals["default"] ??
    0;

  return (
    <AnnualDashboard
      data={data}
      colorMap={colorMap}
      categories={categories}
      vacationCategories={vacationCategories}
      yearSuffix={yearSuffix}
      annualSavingsGoal={goalForYear}
      initialIrregularCategories={initialIrregularCategories}
      hasSavedIrregularCategories={hasSavedIrregularCategories}
    />
  );
}
