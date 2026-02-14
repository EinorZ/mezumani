import YahooFinance from "yahoo-finance2";
import type { StockDefinition } from "./types";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

// ── In-memory cache ──

interface CacheEntry {
  value: number;
  timestamp: number;
}

const priceCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCached(key: string): number | null {
  const entry = priceCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    priceCache.delete(key);
    return null;
  }
  return entry.value;
}

function setCache(key: string, value: number): void {
  priceCache.set(key, { value, timestamp: Date.now() });
}

// ── Price fetchers ──

export async function fetchUSStockPrice(symbol: string): Promise<number> {
  const cached = getCached(`yahoo:${symbol}`);
  if (cached !== null) return cached;

  const quote = await yahooFinance.quote(symbol);
  const price = quote.regularMarketPrice ?? 0;
  setCache(`yahoo:${symbol}`, price);
  return price;
}

export async function fetchIsraeliStockPrice(id: string): Promise<number> {
  const cached = getCached(`funder:${id}`);
  if (cached !== null) return cached;

  // Try ETF page first, then fund page
  for (const type of ["etf", "fund"] as const) {
    const res = await fetch(`https://www.funder.co.il/${type}/${id}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) continue;
    const html = await res.text();

    // Extract the latest price from fundGraphData JSON embedded in the page
    // All prices on funder are in agorot, divide by 100 to get shekels
    const graphMatch = html.match(/fundGraphData\s*=\s*([\[{][\s\S]*?\}]\s*\}?);/);
    if (graphMatch) {
      const raw = JSON.parse(graphMatch[1]);
      const entries: { p: number }[] = Array.isArray(raw) ? raw : raw.x ?? [];
      if (entries.length > 0) {
        const price = entries[entries.length - 1].p / 100;
        setCache(`funder:${id}`, price);
        return price;
      }
    }

    // Fallback: buyPrice/sellPrice (also in agorot)
    const priceMatch = html.match(/"(?:buyPrice|sellPrice)"\s*:\s*([0-9.]+)/);
    if (priceMatch) {
      const price = parseFloat(priceMatch[1]) / 100;
      setCache(`funder:${id}`, price);
      return price;
    }
  }

  // Don't cache 0 — allow retry on next request
  return 0;
}

export async function fetchUsdToIls(): Promise<number> {
  const cached = getCached("usdils");
  if (cached !== null) return cached;

  try {
    const quote = await yahooFinance.quote("USDILS=X");
    const rate = quote.regularMarketPrice ?? 0;
    if (rate > 0) {
      setCache("usdils", rate);
      return rate;
    }
  } catch {
    // fallback below
  }

  const res = await fetch(
    "https://api.frankfurter.dev/v1/latest?base=USD&symbols=ILS",
  );
  const data = await res.json();
  const rate = data.rates?.ILS ?? 3.6;
  setCache("usdils", rate);
  return rate;
}

export async function fetchAllPrices(
  stocks: StockDefinition[],
): Promise<Map<string, number>> {
  const prices = new Map<string, number>();

  const results = await Promise.allSettled(
    stocks.map(async (stock) => {
      let price: number;
      if (stock.source === "yahoo") {
        price = await fetchUSStockPrice(stock.symbol);
      } else {
        price = await fetchIsraeliStockPrice(stock.symbol);
      }
      return { symbol: stock.symbol, price };
    }),
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      prices.set(result.value.symbol, result.value.price);
    }
  }

  return prices;
}

/**
 * Clear the price cache (for manual refresh).
 */
export function clearPriceCache(): void {
  priceCache.clear();
}
