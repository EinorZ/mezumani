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
const PRICE_REQUEST_TIMEOUT_MS = 8_000;
const PRICE_REQUEST_HEADERS = {
  Accept: "text/html,application/xhtml+xml",
  "Accept-Language": "he-IL,he;q=0.9,en;q=0.8",
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131 Safari/537.36",
};

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

async function fetchPricePage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: PRICE_REQUEST_HEADERS,
      signal: AbortSignal.timeout(PRICE_REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.warn(`[price] ${url} returned ${res.status}`);
      return null;
    }
    return await res.text();
  } catch (err) {
    console.warn(`[price] ${url} failed:`, err);
    return null;
  }
}

/** Extract a TASE quote from TheMarker's server-rendered Apollo state. */
export function parseTheMarkerPrice(html: string, id: string): number | null {
  // The page contains other asset lists, so anchor the value to the requested id.
  const markers = [
    `ROOT_QUERY.assets({\\"ids\\":\\"${id}\\"}).0":{`,
    `ROOT_QUERY.assets({"ids":"${id}"}).0":{`,
  ];

  for (const marker of markers) {
    const start = html.indexOf(marker);
    if (start === -1) continue;
    const entity = html.slice(start, start + 2_000);
    const valueMatch = entity.match(/(?:\\?"value\\?")\s*:\s*([0-9.,]+)/);
    if (!valueMatch) continue;
    const valueInAgorot = Number(valueMatch[1].replaceAll(",", ""));
    if (Number.isFinite(valueInAgorot) && valueInAgorot > 0) {
      return valueInAgorot / 100;
    }
  }

  return null;
}

/** Extract the latest quote from a Funder ETF/fund page. */
export function parseFunderPrice(html: string): number | null {
  const lastPriceMatch = html.match(
    /שער אחרון<\/div>[\s\S]*?<div[^>]*bg-grey2[^>]*>([0-9,.]+)<\/div>/,
  );
  if (lastPriceMatch) {
    const valueInAgorot = Number(lastPriceMatch[1].replaceAll(",", ""));
    if (Number.isFinite(valueInAgorot) && valueInAgorot > 0) {
      return valueInAgorot / 100;
    }
  }

  const graphMatch = html.match(
    /fundGraphData\s*=\s*([\[{][\s\S]*?\}]\s*\}?);/,
  );
  if (graphMatch) {
    try {
      const raw = JSON.parse(graphMatch[1]);
      const entries: { p?: number }[] = Array.isArray(raw)
        ? raw
        : (raw.x ?? []);
      const valueInAgorot = entries.at(-1)?.p;
      if (
        typeof valueInAgorot === "number" &&
        Number.isFinite(valueInAgorot) &&
        valueInAgorot > 0
      ) {
        return valueInAgorot / 100;
      }
    } catch {
      // Try the simpler fields below when embedded graph JSON changes.
    }
  }

  const priceMatch = html.match(/"(?:buyPrice|sellPrice)"\s*:\s*([0-9.]+)/);
  if (priceMatch) {
    const valueInAgorot = Number(priceMatch[1]);
    if (Number.isFinite(valueInAgorot) && valueInAgorot > 0) {
      return valueInAgorot / 100;
    }
  }

  return null;
}

/** Parse Funder's public JSONP graph response into daily ILS prices. */
export function parseFunderHistoricalResponse(
  payload: string,
  period1: string,
  period2: string,
): { date: string; price: number }[] {
  const trimmed = payload.trim();
  if (!trimmed) return [];
  const jsonText = trimmed.startsWith("{")
    ? trimmed
    : trimmed.match(/^[^(]+\(([\s\S]*)\)\s*;?$/)?.[1];
  if (!jsonText) return [];

  try {
    const parsed = JSON.parse(jsonText) as {
      x?: { c?: string; p?: number }[];
    };
    return (parsed.x ?? [])
      .filter(
        (point): point is { c: string; p: number } =>
          typeof point.c === "string" &&
          typeof point.p === "number" &&
          Number.isFinite(point.p) &&
          point.p > 0 &&
          point.c >= period1 &&
          point.c <= period2,
      )
      .map((point) => ({ date: point.c, price: point.p / 100 }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}

/**
 * Split long Funder requests below its range limit. Follow-up chunks overlap
 * from the first day of the ending month because the provider can return an
 * empty payload when a continuation starts mid-month.
 */
export function buildFunderHistoricalChunks(
  period1: string,
  period2: string,
): { start: string; end: string }[] {
  const chunks: { start: string; end: string }[] = [];
  let chunkStart = period1;
  while (chunkStart <= period2) {
    const startDate = new Date(`${chunkStart}T00:00:00Z`);
    const candidateEnd = new Date(startDate);
    candidateEnd.setUTCDate(candidateEnd.getUTCDate() + 330);
    const chunkEnd = [
      candidateEnd.toISOString().slice(0, 10),
      period2,
    ].sort()[0];
    chunks.push({ start: chunkStart, end: chunkEnd });
    if (chunkEnd === period2) break;

    const nextStart = new Date(`${chunkEnd}T00:00:00Z`);
    nextStart.setUTCDate(1);
    chunkStart = nextStart.toISOString().slice(0, 10);
  }
  return chunks;
}

function coversHistoricalRangeEnd(
  points: { date: string; price: number }[],
  period2: string,
): boolean {
  const lastDate = points.at(-1)?.date;
  if (!lastDate) return false;
  const endTime = new Date(`${period2}T00:00:00Z`).getTime();
  const lastTime = new Date(`${lastDate}T00:00:00Z`).getTime();
  const ageDays = (endTime - lastTime) / 86_400_000;
  return Number.isFinite(ageDays) && ageDays >= 0 && ageDays <= 7;
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
  const cacheKey = `israeli:${id}`;
  const cached = getCached(cacheKey);
  if (cached !== null) return cached;

  // TheMarker and Funder are independent fallbacks. A single HTML provider is
  // not reliable enough from serverless IP ranges.
  for (const section of ["etf", "mtf"] as const) {
    const html = await fetchPricePage(
      `https://finance.themarker.com/${section}/${id}`,
    );
    if (!html) continue;
    const price = parseTheMarkerPrice(html, id);
    if (price !== null) {
      console.log(`[price] themarker ${section}/${id}: ₪${price}`);
      setCache(cacheKey, price);
      return price;
    }
  }

  for (const type of ["etf", "fund"] as const) {
    const html = await fetchPricePage(`https://www.funder.co.il/${type}/${id}`);
    if (!html) continue;
    const price = parseFunderPrice(html);
    if (price !== null) {
      console.log(`[price] funder ${type}/${id}: ₪${price}`);
      setCache(cacheKey, price);
      return price;
    }
  }

  console.warn(`[price] Israeli security ${id}: all providers failed`);
  // Don't cache 0 — allow retry on next request
  return 0;
}

// Persist last known good rate across requests so a fetch failure never zeros out USD holdings.
// Initialize with a reasonable fallback so even the first cold-start with both APIs down is safe.
let _lastKnownUsdToIls = 3.6;

export async function fetchUsdToIls(): Promise<number | null> {
  const cached = getCached("usdils");
  if (cached !== null) {
    _lastKnownUsdToIls = cached;
    return cached;
  }

  try {
    const quote = await yahooFinance.quote("USDILS=X");
    const rate = quote.regularMarketPrice ?? 0;
    if (rate > 0) {
      console.log(`[price] USD/ILS: ${rate} (yahoo)`);
      setCache("usdils", rate);
      _lastKnownUsdToIls = rate;
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
    const rate = data.rates?.ILS ?? 0;
    if (rate > 0) {
      console.log(`[price] USD/ILS: ${rate} (frankfurter)`);
      setCache("usdils", rate);
      _lastKnownUsdToIls = rate;
      return rate;
    }
  } catch (err) {
    console.error(`[price] USD/ILS frankfurter failed:`, err);
  }

  console.warn(
    `[price] USD/ILS: all sources failed, using last known rate ${_lastKnownUsdToIls}`,
  );
  return _lastKnownUsdToIls;
}

// ── YTD start-of-year price fetchers ──

async function fetchYahooYTDStartPrice(symbol: string): Promise<number> {
  const cacheKey = `ytd-start:${symbol}`;
  const cached = getCached(cacheKey, YTD_CACHE_TTL_MS);
  if (cached !== null) return cached;

  try {
    const year = new Date().getFullYear();
    const prevYear = year - 1;
    const results = await yahooFinance.historical(
      symbol,
      { period1: `${prevYear}-12-24`, period2: `${prevYear}-12-31` },
      { validateResult: false },
    );
    const validResults = results.filter(
      (r: { close: number | null; date: Date }) => r.close != null,
    );
    if (validResults.length > 0) {
      const last = validResults[validResults.length - 1];
      const price = last.close;
      console.log(
        `[ytd] yahoo ${symbol}: last trading day of ${prevYear}: ${last.date.toISOString().split("T")[0]} $${price}`,
      );
      setCache(cacheKey, price);
      return price;
    }
    console.log(
      `[ytd] yahoo ${symbol}: no historical data for end of ${prevYear}`,
    );
  } catch (err) {
    console.error(`[ytd] yahoo ${symbol} historical failed:`, err);
  }
  return 0;
}

export async function fetchYTDStartUsdToIls(): Promise<number | null> {
  const year = new Date().getFullYear();
  const boundary = `${year}-01-01`;
  const history = await fetchFrankfurterHistoricalUsdIls(
    `${year - 1}-12-17`,
    boundary,
  );
  const rate = history
    .filter((point) => point.date < boundary)
    .sort((a, b) => a.date.localeCompare(b.date))
    .at(-1)?.price;
  if (rate && rate > 0) return rate;

  const fallback = await fetchYahooYTDStartPrice("USDILS=X");
  return fallback > 0 ? fallback : null;
}

export async function fetchYTDStartPrices(
  stocks: StockDefinition[],
): Promise<Map<string, number>> {
  const prices = new Map<string, number>();
  const year = new Date().getFullYear();
  const previousYear = year - 1;
  const boundary = `${year}-01-01`;
  // Funder may return an empty payload for a short range beginning mid-month.
  // Starting on December 1 still keeps the request small and reliably includes
  // the final trading day of the previous year.
  const period1 = `${previousYear}-12-01`;

  const results = await Promise.allSettled(
    stocks.map(async (stock) => {
      let price: number;
      if (stock.source === "yahoo") {
        price = await fetchYahooYTDStartPrice(stock.symbol);
      } else if (stock.source === "manual") {
        price = 0;
      } else {
        let history = await fetchFunderHistorical(
          stock.symbol,
          period1,
          boundary,
        );
        let lastPoint = history
          .filter((point) => point.date < boundary)
          .sort((a, b) => a.date.localeCompare(b.date))
          .at(-1);
        price = lastPoint?.price ?? 0;
        if (!(price > 0)) {
          history = await fetchTheMarkerHistorical(
            stock.symbol,
            period1,
            boundary,
          );
          lastPoint = history
            .filter((point) => point.date < boundary)
            .sort((a, b) => a.date.localeCompare(b.date))
            .at(-1);
          price = lastPoint?.price ?? 0;
        }
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

/**
 * Load the previous year-end prices and FX rate through the exact same
 * historical pipeline used by annual performance. Keeping the two together
 * guarantees that the closing value of one year is the YTD opening value of
 * the next year.
 */
export async function fetchYTDStartSnapshot(
  stocks: StockDefinition[],
): Promise<{ prices: Map<string, number>; usdToIls: number | null }> {
  const year = new Date().getFullYear();
  const boundary = `${year}-01-01`;
  const { prices: historyBySymbol, usdIls } = await fetchHistoricalPrices(
    stocks,
    `${year - 1}-12-01`,
    boundary,
  );

  function latestBeforeBoundary(
    points: { date: string; price: number }[] | undefined,
  ): number | null {
    const point = (points ?? [])
      .filter((item) => item.date < boundary && item.price > 0)
      .sort((a, b) => a.date.localeCompare(b.date))
      .at(-1);
    if (!point) return null;
    const boundaryTime = new Date(`${boundary}T00:00:00Z`).getTime();
    const pointTime = new Date(`${point.date}T00:00:00Z`).getTime();
    return (boundaryTime - pointTime) / 86_400_000 <= 7
      ? point.price
      : null;
  }

  const prices = new Map<string, number>();
  for (const stock of stocks) {
    const price = latestBeforeBoundary(historyBySymbol.get(stock.symbol));
    if (price && price > 0) prices.set(stock.symbol, price);
  }
  return {
    prices,
    usdToIls: latestBeforeBoundary(usdIls),
  };
}

// ── Historical price cache ──

interface HistoricalCacheEntry {
  data: { date: string; price: number }[];
  timestamp: number;
}

interface TheMarkerGraphPoint {
  time?: number;
  value?: number;
}

export function parseTheMarkerHistorical(
  payload: unknown,
  period1: string,
  period2: string,
): { date: string; price: number }[] {
  const points = (
    payload as {
      data?: { graph?: { dataSource?: TheMarkerGraphPoint[] } };
    }
  )?.data?.graph?.dataSource;
  if (!Array.isArray(points)) return [];

  const byDate = new Map<string, number>();
  const dateFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jerusalem",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  for (const point of points) {
    if (
      typeof point.time !== "number" ||
      typeof point.value !== "number" ||
      !Number.isFinite(point.value) ||
      point.value <= 0
    ) {
      continue;
    }
    const date = dateFormatter.format(new Date(point.time));
    if (date >= period1 && date <= period2) {
      // TheMarker returns TASE quotes in agorot. If multiple intraday points
      // share a date, the final point is the closing/latest value for that day.
      byDate.set(date, point.value / 100);
    }
  }
  return [...byDate].map(([date, price]) => ({ date, price }));
}

function theMarkerGraphPeriod(period1: string):
  | "week"
  | "month"
  | "year1"
  | "year3"
  | "year5" {
  const ageDays = Math.ceil(
    (Date.now() - new Date(`${period1}T00:00:00Z`).getTime()) / 86_400_000,
  );
  if (ageDays <= 7) return "week";
  if (ageDays <= 31) return "month";
  if (ageDays <= 366) return "year1";
  if (ageDays <= 3 * 366) return "year3";
  return "year5";
}

async function fetchTheMarkerHistorical(
  id: string,
  period1: string,
  period2: string,
): Promise<{ date: string; price: number }[]> {
  const period = theMarkerGraphPeriod(period1);
  const cacheKey = `hist:themarker:${id}:${period}:${period1}:${period2}`;
  const cached = getHistoricalCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      "https://www.themarker.com/gql?operation=FinanceGraph",
      {
        method: "POST",
        headers: {
          ...PRICE_REQUEST_HEADERS,
          "Content-Type": "application/json",
          hostname: "finance.themarker.com",
          operationname: "FinanceGraph",
        },
        signal: AbortSignal.timeout(PRICE_REQUEST_TIMEOUT_MS),
        body: JSON.stringify({
          operationName: "FinanceGraph",
          variables: { type: "line", period, assetId: id },
          query:
            "query FinanceGraph($type: GraphType!, $period: PeriodType!, $assetId: String!) { graph(type: $type, period: $period, id: $assetId) { dataSource { ... on LineGraphData { time value } } } }",
        }),
      },
    );
    if (!response.ok) return [];
    const data = parseTheMarkerHistorical(
      await response.json(),
      period1,
      period2,
    );
    console.log(
      `[hist] themarker ${id}: ${data.length} points (${period})`,
    );
    if (data.length > 0) setHistoricalCache(cacheKey, data);
    return data;
  } catch (err) {
    console.error(`[hist] themarker ${id} failed:`, err);
    return [];
  }
}

const historicalCache = new Map<string, HistoricalCacheEntry>();
const HISTORICAL_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
let funderRequestQueue: Promise<void> = Promise.resolve();

async function fetchFunderText(url: string): Promise<string | null> {
  const request = funderRequestQueue.then(async () => {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0" },
          signal: AbortSignal.timeout(PRICE_REQUEST_TIMEOUT_MS),
        });
        if (response.ok) return await response.text();
      } catch {
        // Retry once inside the serialized queue. A single provider failure
        // must not silently switch an annual boundary to sampled data.
      }
    }
    return null;
  });
  funderRequestQueue = request.then(
    () => undefined,
    () => undefined,
  );
  return request;
}

function getHistoricalCached(
  key: string,
): { date: string; price: number }[] | null {
  const entry = historicalCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > HISTORICAL_CACHE_TTL_MS) {
    historicalCache.delete(key);
    return null;
  }
  return entry.data;
}

function setHistoricalCache(
  key: string,
  data: { date: string; price: number }[],
): void {
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
    const results = await yahooFinance.historical(
      symbol,
      { period1, period2 },
      { validateResult: false },
    );
    const data = results
      .filter((r: { close: number | null; date: Date }) => r.close != null)
      .map((r: { close: number; date: Date }) => ({
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
  const cacheKey = `hist:funder:v2:${id}:${period1}:${period2}`;
  const cached = getHistoricalCached(cacheKey);
  if (cached) return cached;

  try {
    const isMutualFund = Number(id) >= 5_000_000;
    const endpoints = isMutualFund
      ? ["wsfund.asmx/GetFundTickerm", "wsUnified.asmx/GetEtfTickerm"]
      : ["wsUnified.asmx/GetEtfTickerm", "wsfund.asmx/GetFundTickerm"];

    // Funder truncates or rejects ranges slightly longer than a year. Split
    // long requests so annual boundaries always come from exact daily closes.
    const chunks = buildFunderHistoricalChunks(period1, period2);

    for (const endpoint of endpoints) {
      const byDate = new Map<string, number>();
      for (const chunk of chunks) {
        const params = new URLSearchParams({
          id,
          startDate: chunk.start,
          endDate: chunk.end,
          callback: "mezumani",
        });
        const url = `https://www.funder.co.il/${endpoint}?${params}`;
        const responseText = await fetchFunderText(url);
        if (!responseText) continue;
        for (const point of parseFunderHistoricalResponse(
          responseText,
          chunk.start,
          chunk.end,
        )) {
          byDate.set(point.date, point.price);
        }
      }
      const data = [...byDate]
        .map(([date, price]) => ({ date, price }))
        .sort((a, b) => a.date.localeCompare(b.date));
      if (data.length > 0 && coversHistoricalRangeEnd(data, period2)) {
        console.log(`[hist] funder ${id}: ${data.length} daily points`);
        setHistoricalCache(cacheKey, data);
        return data;
      }
      if (data.length > 0) {
        console.warn(
          `[hist] funder ${id}: rejected truncated range ending ${data.at(-1)?.date} (wanted ${period2})`,
        );
      }
    }
  } catch (err) {
    console.error(`[hist] funder ${id} fetch failed:`, err);
  }
  return [];
}

async function fetchFrankfurterHistoricalUsdIls(
  period1: string,
  period2: string,
): Promise<{ date: string; price: number }[]> {
  const cacheKey = `hist:frankfurter:USDILS:${period1}:${period2}`;
  const cached = getHistoricalCached(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://api.frankfurter.app/${period1}..${period2}?from=USD&to=ILS`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const json = await res.json();
    const rates: Record<string, { ILS: number }> = json.rates ?? {};
    const data = Object.entries(rates)
      .map(([date, r]) => ({ date, price: r.ILS }))
      .sort((a, b) => a.date.localeCompare(b.date));
    console.log(`[hist] frankfurter USDILS: ${data.length} points`);
    if (data.length > 0) setHistoricalCache(cacheKey, data);
    return data;
  } catch (err) {
    console.error(`[hist] frankfurter USDILS failed:`, err);
    return [];
  }
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
      let data: { date: string; price: number }[];
      if (stock.source === "yahoo") {
        data = await fetchYahooHistorical(stock.symbol, period1, period2);
      } else if (stock.source === "manual") {
        data = [];
      } else {
        // Funder's range endpoints return the exact daily close. TheMarker's
        // long-range graph is sampled weekly/monthly, so it is only a fallback.
        data = await fetchFunderHistorical(
          stock.symbol,
          period1,
          period2,
        );
        if (data.length === 0) {
          data = await fetchTheMarkerHistorical(
            stock.symbol,
            period1,
            period2,
          );
        }
      }
      return { symbol: stock.symbol, data };
    }),
    hasUsdStocks
      ? fetchFrankfurterHistoricalUsdIls(period1, period2)
      : Promise.resolve([]),
  ]);

  const prices = new Map<string, { date: string; price: number }[]>();
  for (let i = 0; i < stocks.length; i++) {
    const result = results[i];
    if (result.status === "fulfilled") {
      const r = result.value as {
        symbol: string;
        data: { date: string; price: number }[];
      };
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
