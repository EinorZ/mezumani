async function scrapeFundPrice(id: string) {
  const res = await fetch("https://finance.themarker.com/etf/" + id, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  const html = await res.text();

  // Name from title: 'FUND NAME - קרנות סל - TheMarker Finance'
  const titleMatch = html.match(/<title[^>]*>([^<]+)/);
  const rawTitle = titleMatch?.[1]?.trim() || "";
  const name = rawTitle
    .replace(/ - (קרנות (סל|נאמנות)|TheMarker).*/, "")
    .replace(/&amp;/g, "&");

  // Price: first "value" match in embedded data
  const allValues = [...html.matchAll(/"value":\s*([0-9,.]+)/g)];
  const priceStr = allValues[0]?.[1]?.replace(",", "");
  const price = priceStr ? parseFloat(priceStr) : null;

  return { id, name, price };
}

async function main() {
  const ids = ["5128905", "1159169", "1159094", "1159250", "5124482"];

  console.log("=== Israeli ETF/Fund Prices (TheMarker) ===\n");
  console.log("ID".padEnd(10), "| Price".padEnd(14), "| Name");
  console.log("-".repeat(70));

  for (const id of ids) {
    const data = await scrapeFundPrice(id);
    const priceStr = data.price != null ? data.price.toFixed(2) : "N/A";
    console.log(data.id.padEnd(10), "|", priceStr.padStart(12), "|", data.name);
  }
}
main();
