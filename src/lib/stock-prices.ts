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

  try {
    const quote = await yahooFinance.quote(symbol);
    const price = quote.regularMarketPrice ?? 0;
    console.log(`[price] yahoo ${symbol}: $${price}`);
    if (price > 0) setCache(`yahoo:${symbol}`, price);
    return price;
  } catch (err) {
    console.error(`[price] yahoo ${symbol} failed:`, err);
    return 0;
  }
}

export async function fetchIsraeliStockPrice(id: string): Promise<number> {
  const cached = getCached(`funder:${id}`);
  if (cached !== null) return cached;

  try {
    // Try ETF page first, then fund page
    for (const type of ["etf", "fund"] as const) {
      const url = `https://www.funder.co.il/${type}/${id}`;
      console.log(`[price] funder fetching ${url}`);
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      console.log(`[price] funder ${type}/${id} status: ${res.status}`);
      if (!res.ok) continue;
      const html = await res.text();
      console.log(
        `[price] funder ${type}/${id} html length: ${html.length}`,
      );

      // Extract the latest price from fundGraphData JSON embedded in the page
      // All prices on funder are in agorot, divide by 100 to get shekels
      const graphMatch = html.match(
        /fundGraphData\s*=\s*([\[{][\s\S]*?\}]\s*\}?);/,
      );
      if (graphMatch) {
        try {
          const raw = JSON.parse(graphMatch[1]);
          const entries: { p: number }[] = Array.isArray(raw)
            ? raw
            : raw.x ?? [];
          if (entries.length > 0) {
            const price = entries[entries.length - 1].p / 100;
            console.log(
              `[price] funder ${id}: ₪${price} (from graphData, ${entries.length} entries)`,
            );
            setCache(`funder:${id}`, price);
            return price;
          }
          console.log(`[price] funder ${id}: graphData found but 0 entries`);
        } catch (err) {
          console.error(
            `[price] funder ${id}: graphData JSON parse failed:`,
            err,
          );
        }
      } else {
        console.log(`[price] funder ${type}/${id}: no graphData match`);
      }

      // Fallback: buyPrice/sellPrice (also in agorot)
      const priceMatch = html.match(
        /"(?:buyPrice|sellPrice)"\s*:\s*([0-9.]+)/,
      );
      if (priceMatch) {
        const price = parseFloat(priceMatch[1]) / 100;
        console.log(
          `[price] funder ${id}: ₪${price} (from buyPrice/sellPrice)`,
        );
        setCache(`funder:${id}`, price);
        return price;
      }
      console.log(`[price] funder ${type}/${id}: no buyPrice/sellPrice match`);
    }
  } catch (err) {
    console.error(`[price] funder ${id} fetch failed:`, err);
  }

  console.warn(`[price] funder ${id}: returning 0 (all methods failed)`);
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
      console.log(`[price] USD/ILS: ${rate} (yahoo)`);
      setCache("usdils", rate);
      return rate;
    }
  } catch (err) {
    console.error(`[price] USD/ILS yahoo failed:`, err);
  }

  try {
    const res = await fetch(
      "https://api.frankfurter.dev/v1/latest?base=USD&symbols=ILS",
    );
    const data = await res.json();
    const rate = data.rates?.ILS ?? 3.6;
    console.log(`[price] USD/ILS: ${rate} (frankfurter)`);
    setCache("usdils", rate);
    return rate;
  } catch (err) {
    console.error(`[price] USD/ILS frankfurter failed:`, err);
    return 3.6;
  }
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
    } else {
      console.error(`[price] allSettled rejected:`, result.reason);
    }
  }

  console.log(
    `[price] fetchAllPrices done: ${prices.size} prices fetched`,
    Object.fromEntries(prices),
  );

  return prices;
}

/**
 * Clear the price cache (for manual refresh).
 */
export function clearPriceCache(): void {
  priceCache.clear();
}
