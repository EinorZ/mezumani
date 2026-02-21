import { getRsuTransactions, getRsuGrossData } from "./google-sheets";
import { fetchUSStockPrice, fetchUsdToIls } from "./stock-prices";
import { calcRsuNet } from "./israeli-tax";
import { parseSheetDate, isFutureDate, isMatured } from "./nvidia-utils";
import type {
  RsuVest,
  RsuGrant,
  NvidiaCompensationData,
} from "./types";

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
      const da = parseSheetDate(a.vestDate);
      const db = parseSheetDate(b.vestDate);
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
    const da = parseSheetDate(a.grantDate);
    const db = parseSheetDate(b.grantDate);
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

        if (isMatured(vest.grantDate)) {
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
