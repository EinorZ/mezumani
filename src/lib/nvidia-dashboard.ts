import { getRsuTransactions, getRsuGrossData } from "./google-sheets";
import { fetchUSStockPrice, fetchUsdToIls } from "./stock-prices";
import { calcRsuNet } from "./israeli-tax";
import type {
  RsuVest,
  RsuGrant,
  NvidiaCompensationData,
} from "./types";

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  // DD/MM/YY or DD/MM/YYYY
  const parts = dateStr.split("/");
  if (parts.length < 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  let year = parseInt(parts[2], 10);
  if (year < 100) year += 2000;
  return new Date(year, month, day);
}

function isFutureDate(dateStr: string): boolean {
  const d = parseDate(dateStr);
  if (!d) return false;
  return d > new Date();
}

function isGrantMatured(grantDate: string): boolean {
  const d = parseDate(grantDate);
  if (!d) return false;
  const matDate = new Date(d);
  matDate.setMonth(matDate.getMonth() + 24);
  return new Date() >= matDate;
}

/**
 * Group RSU vests by grant date into grant objects.
 */
function groupIntoGrants(vests: RsuVest[]): RsuGrant[] {
  const grantMap = new Map<string, RsuVest[]>();

  for (const vest of vests) {
    const key = vest.grantDate;
    if (!grantMap.has(key)) grantMap.set(key, []);
    grantMap.get(key)!.push(vest);
  }

  const grants: RsuGrant[] = [];
  for (const [grantDate, grantVests] of grantMap) {
    const totalShares = grantVests[0]?.totalSharesInGrant ?? 0;

    const vestedShares = grantVests
      .filter((v) => !isFutureDate(v.vestDate))
      .reduce((s, v) => s + v.shares, 0);

    const unvestedShares = grantVests
      .filter((v) => isFutureDate(v.vestDate))
      .reduce((s, v) => s + v.shares, 0);

    // Sort vests by date
    grantVests.sort((a, b) => {
      const da = parseDate(a.vestDate);
      const db = parseDate(b.vestDate);
      if (!da || !db) return 0;
      return da.getTime() - db.getTime();
    });

    grants.push({
      grantDate,
      grantName: grantVests[0]?.grantName ?? "",
      totalShares,
      vests: grantVests,
      vestedShares,
      unvestedShares,
    });
  }

  // Sort grants by date
  grants.sort((a, b) => {
    const da = parseDate(a.grantDate);
    const db = parseDate(b.grantDate);
    if (!da || !db) return 0;
    return da.getTime() - db.getTime();
  });

  return grants;
}

export async function getNvidiaCompensationData(): Promise<NvidiaCompensationData> {
  const [rsuVests, nvdaPrice, usdToIls, grossData] = await Promise.all([
    getRsuTransactions(),
    fetchUSStockPrice("NVDA"),
    fetchUsdToIls(),
    getRsuGrossData(),
  ]);

  const grants = groupIntoGrants(rsuVests);

  // Calculate summary values
  let unvestedValueIls = 0;
  let vestedValueIls = 0;
  let holdableValueIls = 0;
  let estimatedTaxIfSoldToday = 0;

  const today = new Date();
  const todayStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear() % 100}`;

  for (const vest of rsuVests) {
    if (!isFutureDate(vest.vestDate)) {
      const valueIls = vest.shares * nvdaPrice * usdToIls;
      if (!vest.sold) {
        // vested & not sold
        vestedValueIls += valueIls;

        if (isGrantMatured(vest.grantDate)) {
          // matured (הבשלה passed) & vested & not sold → can sell
          holdableValueIls += valueIls;

          if (vest.vestPriceUsd !== null) {
            const result = calcRsuNet({
              shares: vest.shares,
              vestPriceUsd: vest.vestPriceUsd,
              usdRate: usdToIls,
              feesIls: 0,
              yearlyGross: 0,
              sellPriceUsd: nvdaPrice,
              grantDate: vest.grantDate,
              sellDate: todayStr,
            });
            estimatedTaxIfSoldToday += result.totalTax;
          }
        }
      }
    } else {
      // Unvested (future vest date)
      unvestedValueIls += vest.shares * nvdaPrice * usdToIls;
    }
  }

  const totalValueIls = unvestedValueIls + vestedValueIls;

  return {
    grants,
    currentNvdaPriceUsd: nvdaPrice,
    usdToIls,
    summary: {
      unvestedValueIls,
      vestedValueIls,
      holdableValueIls,
      totalValueIls,
      estimatedTaxIfSoldToday,
    },
    grossSoFar: grossData.grossSoFar,
    monthlySalary: grossData.monthlySalary,
    esppMonthlyContribution: grossData.esppMonthlyContribution,
    esppPurchasePrice: grossData.esppPurchasePrice,
    lastUpdated: new Date().toISOString(),
  };
}
