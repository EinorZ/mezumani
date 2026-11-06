import assert from "node:assert/strict";
import test from "node:test";
import {
  buildFunderHistoricalChunks,
  parseFunderHistoricalResponse,
  parseFunderPrice,
  parseTheMarkerHistorical,
  parseTheMarkerPrice,
} from "./stock-prices";

test("Funder chunks overlap from the first of the ending month", () => {
  assert.deepEqual(
    buildFunderHistoricalChunks("2024-12-18", "2026-01-01"),
    [
      { start: "2024-12-18", end: "2025-11-13" },
      { start: "2025-11-01", end: "2026-01-01" },
    ],
  );
});

test("parseFunderHistoricalResponse reads exact daily JSONP prices", () => {
  const payload =
    'mezumani({"x":[{"c":"2025-12-30","p":335.23},{"c":"2025-12-31","p":332.19}]})';

  assert.deepEqual(
    parseFunderHistoricalResponse(payload, "2025-12-31", "2025-12-31"),
    [{ date: "2025-12-31", price: 3.3219 }],
  );
});

test("parseTheMarkerPrice anchors the quote to the requested security", () => {
  const html = String.raw`
    "ROOT_QUERY.assetsList.0":{"value":5682}
    "ROOT_QUERY.assets({\"ids\":\"1159250\"}).0":{"name":"S&P 500","value":259300,"assetNumber":"1159250"}
  `;

  assert.equal(parseTheMarkerPrice(html, "1159250"), 2593);
  assert.equal(parseTheMarkerPrice(html, "9999999"), null);
});

test("parseFunderPrice reads the last-price panel", () => {
  const html = `
    <div>שער אחרון</div><div class="bg-grey1">שינוי</div>
    <div class="col bg-grey2">259,300</div>
  `;

  assert.equal(parseFunderPrice(html), 2593);
});

test("parseFunderPrice falls back to the latest graph point", () => {
  const html = `
    <script>var fundGraphData = {"x":[{"c":"2026-10-14","p":258300},{"c":"2026-10-15","p":259300}]};</script>
  `;

  assert.equal(parseFunderPrice(html), 2593);
});

test("parseTheMarkerHistorical converts agorot and keeps the last point per date", () => {
  const payload = {
    data: {
      graph: {
        dataSource: [
          { time: Date.parse("2026-10-15T21:00:00Z"), value: 16200 },
          { time: Date.parse("2026-10-16T08:00:00Z"), value: 16250 },
        ],
      },
    },
  };

  assert.deepEqual(
    parseTheMarkerHistorical(payload, "2026-10-01", "2026-10-31"),
    [{ date: "2026-10-16", price: 162.5 }],
  );
});
