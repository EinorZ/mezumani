import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

// ── US Stocks (Yahoo Finance) ────────────────────────────────────────

const US_TICKERS = ["QQQ", "VOO", "CHAT", "NVDA", "SPEM", "BBEU"];

async function fetchUSStock(ticker: string) {
  const quote = await yahooFinance.quote(ticker);
  return {
    symbol: ticker,
    name: quote.shortName ?? "",
    price: quote.regularMarketPrice ?? 0,
    currency: quote.currency ?? "USD",
    change: quote.regularMarketChangePercent ?? 0,
  };
}

// ── Israeli ETFs/Funds (TheMarker scrape) ────────────────────────────

const ISRAELI_IDS = ["1159169", "1159094", "1159250", "5128905", "5124482"];

async function fetchIsraeliETF(id: string) {
  const res = await fetch("https://finance.themarker.com/etf/" + id, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  const html = await res.text();

  const titleMatch = html.match(/<title[^>]*>([^<]+)/);
  const rawTitle = titleMatch?.[1]?.trim() ?? "";
  const name = rawTitle
    .replace(/ - (קרנות (סל|נאמנות)|TheMarker).*/, "")
    .replace(/&amp;/g, "&");

  const allValues = [...html.matchAll(/"value":\s*([0-9,.]+)/g)];
  const priceStr = allValues[0]?.[1]?.replace(",", "");
  const price = priceStr ? parseFloat(priceStr) : null;

  return { symbol: id, name, price, currency: "ILS" };
}

// ── USD/ILS Exchange Rate ────────────────────────────────────────────

async function fetchUsdToIls() {
  try {
    const quote = await yahooFinance.quote("USDILS=X");
    return quote.regularMarketPrice ?? null;
  } catch {
    const res = await fetch(
      "https://api.frankfurter.dev/v1/latest?base=USD&symbols=ILS",
    );
    const data = await res.json();
    return data.rates.ILS as number;
  }
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
  console.log("Stock Price PoC\n");

  // USD/ILS
  const usdToIls = await fetchUsdToIls();
  console.log(`USD/ILS: ${usdToIls?.toFixed(4)}\n`);

  // US Stocks
  console.log("=== US Stocks (Yahoo Finance) ===\n");
  console.log(
    "Symbol".padEnd(8),
    "Name".padEnd(35),
    "Price".padStart(10),
    "ILS Value".padStart(12),
    "Change".padStart(8),
  );
  console.log("-".repeat(80));

  for (const ticker of US_TICKERS) {
    try {
      const s = await fetchUSStock(ticker);
      const ilsValue = usdToIls ? s.price * usdToIls : 0;
      console.log(
        s.symbol.padEnd(8),
        s.name.padEnd(35),
        `$${s.price.toFixed(2)}`.padStart(10),
        `₪${ilsValue.toFixed(2)}`.padStart(12),
        `${s.change >= 0 ? "+" : ""}${s.change.toFixed(2)}%`.padStart(8),
      );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(ticker.padEnd(8), "ERROR:", msg.slice(0, 60));
    }
  }

  // Israeli ETFs
  console.log("\n=== Israeli ETFs/Funds (TheMarker) ===\n");
  console.log(
    "ID".padEnd(10),
    "Name".padEnd(45),
    "Price (ILS)".padStart(12),
  );
  console.log("-".repeat(70));

  for (const id of ISRAELI_IDS) {
    try {
      const s = await fetchIsraeliETF(id);
      const priceStr = s.price != null ? `₪${s.price.toFixed(2)}` : "N/A";
      console.log(s.symbol.padEnd(10), s.name.padEnd(45), priceStr.padStart(12));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(id.padEnd(10), "ERROR:", msg.slice(0, 60));
    }
  }

  console.log("\nDone!");
}

main().catch(console.error);
