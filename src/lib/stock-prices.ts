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
const YTD_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour (start-of-year prices don't change)

function getCached(key: string, ttl: number = CACHE_TTL_MS): number | null {
  const entry = priceCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > ttl) {
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

// ── YTD start-of-year price fetchers ──

async function fetchYahooYTDStartPrice(symbol: string): Promise<number> {
  const cacheKey = `ytd-start:${symbol}`;
  const cached = getCached(cacheKey, YTD_CACHE_TTL_MS);
  if (cached !== null) return cached;

  try {
    const year = new Date().getFullYear();
    const results = await yahooFinance.historical(symbol, {
      period1: `${year}-01-01`,
      period2: `${year}-01-07`,
    });
    if (results.length > 0) {
      const price = results[0].close;
      console.log(`[ytd] yahoo ${symbol}: start-of-year price $${price}`);
      setCache(cacheKey, price);
      return price;
    }
    console.log(`[ytd] yahoo ${symbol}: no historical data for start of year`);
  } catch (err) {
    console.error(`[ytd] yahoo ${symbol} historical failed:`, err);
  }
  return 0;
}

async function fetchFunderYTDStartPrice(id: string): Promise<number> {
  const cacheKey = `ytd-start:${id}`;
  const cached = getCached(cacheKey, YTD_CACHE_TTL_MS);
  if (cached !== null) return cached;

  try {
    for (const type of ["etf", "fund"] as const) {
      const url = `https://www.funder.co.il/${type}/${id}`;
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      if (!res.ok) continue;
      const html = await res.text();

      const graphMatch = html.match(
        /fundGraphData\s*=\s*([\[{][\s\S]*?\}]\s*\}?);/,
      );
      if (!graphMatch) continue;

      try {
        const raw = JSON.parse(graphMatch[1]);
        const entries: { c?: string; p: number }[] = Array.isArray(raw)
          ? raw
          : raw.x ?? [];
        if (entries.length === 0) continue;

        // Check if entries have date field (field name is "c")
        if (entries[0].c) {
          const year = new Date().getFullYear();
          const jan1 = new Date(year, 0, 1).getTime();
          let closest = entries[0];
          let closestDiff = Infinity;

          for (const entry of entries) {
            if (!entry.c) continue;
            const entryDate = new Date(entry.c).getTime();
            const diff = Math.abs(entryDate - jan1);
            if (diff < closestDiff) {
              closestDiff = diff;
              closest = entry;
            }
          }

          // Only use if within 14 days of Jan 1
          if (closestDiff <= 14 * 24 * 60 * 60 * 1000) {
            const price = closest.p / 100; // agorot to shekels
            console.log(
              `[ytd] funder ${id}: start-of-year price ₪${price} (date: ${closest.c})`,
            );
            setCache(cacheKey, price);
            return price;
          }
        }

        // No date field or no close entry — can't determine YTD
        console.log(`[ytd] funder ${id}: graph data has no usable date info`);
      } catch (err) {
        console.error(`[ytd] funder ${id}: graph JSON parse failed:`, err);
      }
    }
  } catch (err) {
    console.error(`[ytd] funder ${id} fetch failed:`, err);
  }
  return 0;
}

export async function fetchYTDStartPrices(
  stocks: StockDefinition[],
): Promise<Map<string, number>> {
  const prices = new Map<string, number>();

  const results = await Promise.allSettled(
    stocks.map(async (stock) => {
      let price: number;
      if (stock.source === "yahoo") {
        price = await fetchYahooYTDStartPrice(stock.symbol);
      } else {
        price = await fetchFunderYTDStartPrice(stock.symbol);
      }
      return { symbol: stock.symbol, price };
    }),
  );

  for (const result of results) {
    if (result.status === "fulfilled" && result.value.price > 0) {
      prices.set(result.value.symbol, result.value.price);
    }
  }

  console.log(
    `[ytd] fetchYTDStartPrices done: ${prices.size}/${stocks.length} prices fetched`,
  );
  return prices;
}

export async function fetchAllPrices(
  stocks: StockDefinition[],
): Promise<Map<string, number>> {
  const prices = new Map<string, number>();

  const results = await Promise.allSettled(
    stocks
      .filter((s) => s.source !== "manual")
      .map(async (stock) => {
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

// ── Historical price cache ──

interface HistoricalCacheEntry {
  data: { date: string; price: number }[];
  timestamp: number;
}

const historicalCache = new Map<string, HistoricalCacheEntry>();
const HISTORICAL_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getHistoricalCached(key: string): { date: string; price: number }[] | null {
  const entry = historicalCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > HISTORICAL_CACHE_TTL_MS) {
    historicalCache.delete(key);
    return null;
  }
  return entry.data;
}

function setHistoricalCache(key: string, data: { date: string; price: number }[]): void {
  historicalCache.set(key, { data, timestamp: Date.now() });
}

// ── Historical price fetchers ──

async function fetchYahooHistorical(
  symbol: string,
  period1: string,
  period2: string,
): Promise<{ date: string; price: number }[]> {
  const cacheKey = `hist:yahoo:${symbol}:${period1}:${period2}`;
  const cached = getHistoricalCached(cacheKey);
  if (cached) return cached;

  try {
    const results = await yahooFinance.historical(symbol, { period1, period2 });
    const data = results.map((r) => ({
      date: r.date.toISOString().split("T")[0],
      price: r.close,
    }));
    console.log(`[hist] yahoo ${symbol}: ${data.length} points`);
    if (data.length > 0) setHistoricalCache(cacheKey, data);
    return data;
  } catch (err) {
    console.error(`[hist] yahoo ${symbol} failed:`, err);
    return [];
  }
}

async function fetchFunderHistorical(
  id: string,
  period1: string,
  period2: string,
): Promise<{ date: string; price: number }[]> {
  const cacheKey = `hist:funder:${id}:${period1}:${period2}`;
  const cached = getHistoricalCached(cacheKey);
  if (cached) return cached;

  try {
    for (const type of ["etf", "fund"] as const) {
      const url = `https://www.funder.co.il/${type}/${id}`;
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) continue;
      const html = await res.text();

      const graphMatch = html.match(
        /fundGraphData\s*=\s*([\[{][\s\S]*?\}]\s*\}?);/,
      );
      if (!graphMatch) continue;

      try {
        const raw = JSON.parse(graphMatch[1]);
        const entries: { c?: string; p: number }[] = Array.isArray(raw)
          ? raw
          : raw.x ?? [];

        const data = entries
          .filter((e) => e.c)
          .map((e) => ({ date: e.c!, price: e.p / 100 })) // agorot → shekels
          .filter((e) => e.date >= period1 && e.date <= period2);

        console.log(`[hist] funder ${id}: ${data.length} points (filtered from ${entries.length})`);
        if (data.length > 0) {
          setHistoricalCache(cacheKey, data);
          return data;
        }
      } catch (err) {
        console.error(`[hist] funder ${id}: JSON parse failed:`, err);
      }
    }
  } catch (err) {
    console.error(`[hist] funder ${id} fetch failed:`, err);
  }
  return [];
}

export async function fetchHistoricalPrices(
  stocks: StockDefinition[],
  period1: string,
  period2: string,
): Promise<{
  prices: Map<string, { date: string; price: number }[]>;
  usdIls: { date: string; price: number }[];
}> {
  const hasUsdStocks = stocks.some((s) => s.currency === "USD");

  const results = await Promise.allSettled([
    ...stocks.map(async (stock) => {
      const data =
        stock.source === "yahoo"
          ? await fetchYahooHistorical(stock.symbol, period1, period2)
          : await fetchFunderHistorical(stock.symbol, period1, period2);
      return { symbol: stock.symbol, data };
    }),
    hasUsdStocks
      ? fetchYahooHistorical("USDILS=X", period1, period2)
      : Promise.resolve([]),
  ]);

  const prices = new Map<string, { date: string; price: number }[]>();
  for (let i = 0; i < stocks.length; i++) {
    const result = results[i];
    if (result.status === "fulfilled") {
      const r = result.value as { symbol: string; data: { date: string; price: number }[] };
      prices.set(r.symbol, r.data);
    }
  }

  const usdIlsResult = results[stocks.length];
  const usdIls =
    usdIlsResult.status === "fulfilled"
      ? (usdIlsResult.value as { date: string; price: number }[])
      : [];

  console.log(
    `[hist] fetchHistoricalPrices done: ${prices.size} stocks, ${usdIls.length} USD/ILS points`,
  );

  return { prices, usdIls };
}

/**
 * Clear the price cache (for manual refresh).
 */
export function clearPriceCache(): void {
  priceCache.clear();
  historicalCache.clear();
}
