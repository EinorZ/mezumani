import Link from "next/link";
import { HEBREW_MONTHS } from "@/lib/constants";
import type { AnnualData, SheetInfo } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface Props {
  data: AnnualData;
  yearSuffix: number;
  sheets: SheetInfo[];
}

function formatCell(value: number | null): string {
  if (value === null || value === 0) return "-";
  return formatCurrency(value);
}

export function AnnualTable({ data, yearSuffix, sheets }: Props) {
  return (
    <div className="table-responsive">
      <table className="table table-sm table-bordered table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th className="position-sticky start-0 bg-light">קטגוריה</th>
            {HEBREW_MONTHS.map((month) => {
              const title = `${month} ${yearSuffix}`;
              const sheet = sheets.find((s) => s.title === title);
              return (
                <th key={month} className="text-center">
                  {sheet ? (
                    <Link
                      href={`/month/${sheet.sheetId}`}
                      className="text-decoration-none text-dark"
                    >
                      {month}
                    </Link>
                  ) : (
                    month
                  )}
                </th>
              );
            })}
            <th className="text-center">ממוצע</th>
            <th className="text-center">סה&quot;כ</th>
            <th className="text-center">%</th>
          </tr>
        </thead>
        <tbody>
          {data.rows
            .filter((row) => row.category)
            .map((row) => (
              <tr key={row.category}>
                <td className="position-sticky start-0 bg-white fw-medium">
                  {row.category}
                </td>
                {row.months.map((val, i) => (
                  <td key={i} className="text-center small">
                    {formatCell(val)}
                  </td>
                ))}
                <td className="text-center small fw-medium">
                  {formatCell(row.average)}
                </td>
                <td className="text-center small fw-medium">
                  {formatCell(row.total)}
                </td>
                <td className="text-center small">
                  {row.percentage !== null
                    ? `${Math.round(row.percentage)}%`
                    : "-"}
                </td>
              </tr>
            ))}
          <tr className="fw-bold table-light">
            <td className="position-sticky start-0 bg-light">סה&quot;כ</td>
            {data.totals.months.map((val, i) => (
              <td key={i} className="text-center small">
                {formatCell(val)}
              </td>
            ))}
            <td className="text-center small">
              {formatCell(data.totals.average)}
            </td>
            <td className="text-center small">
              {formatCell(data.totals.total)}
            </td>
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
