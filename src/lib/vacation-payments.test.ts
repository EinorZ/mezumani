import assert from "node:assert/strict";
import Module, { createRequire } from "node:module";
import test, { beforeEach } from "node:test";

// Exercise the real actions and Sheets adapter against an in-memory API fixture.
// No credentials or live spreadsheet writes are involved.
type Write = { range: string; values: string[][] };
const writes: Write[] = [];
const cleared: string[] = [];
const operations: string[] = [];
let fixtureRows: string[][] = [];
let failWrite = false;
const sheets = {
  spreadsheets: {
    values: {
      get: async () => ({ data: { values: [] } }),
      batchGet: async () => ({
        data: { valueRanges: [{ values: fixtureRows }] },
      }),
      batchUpdate: async ({
        requestBody,
      }: {
        requestBody: { data: Write[] };
      }) => {
        if (failWrite) throw new Error("Destination unavailable");
        operations.push("write");
        writes.push(...requestBody.data);
        return { data: {} };
      },
      update: async ({
        range,
        requestBody,
      }: {
        range: string;
        requestBody: { values: string[][] };
      }) => {
        writes.push({ range, values: requestBody.values });
        return { data: {} };
      },
      clear: async ({ range }: { range: string }) => {
        operations.push("clear");
        cleared.push(range);
        return { data: {} };
      },
    },
  },
};

const loader = Module as unknown as {
  _load: (
    request: string,
    parent: NodeModule | undefined,
    isMain?: boolean,
  ) => unknown;
};
const originalLoad = loader._load;
const load = createRequire(__filename);
let actions: typeof import("./actions");
let adapter: typeof import("./google-sheets");
try {
  loader._load = function (request, parent, isMain) {
    if (request === "@/server/persistence/google-sheets-client") {
      return {
        getGoogleSheetsClient: () => sheets,
        householdSpreadsheetId: "fixture",
      };
    }
    if (parent?.filename.endsWith("/actions.ts")) {
      if (request === "next/cache") return { revalidatePath: () => {} };
      if (request === "./pension-sheets") return {};
    }
    return originalLoad.call(this, request, parent, isMain);
  };
  actions = load("./actions");
  adapter = load("./google-sheets");
} finally {
  loader._load = originalLoad;
}

beforeEach(() => {
  writes.length = 0;
  cleared.length = 0;
  operations.length = 0;
  fixtureRows = [];
  failWrite = false;
});

const payment = {
  date: "6.11",
  expense: "Flight deposit",
  amount: 1200,
  category: "טיסה",
  card: "Visa",
  notes: "",
};

test("moving from 2026 to a 2027 vacation stores the original payment year as text", async () => {
  await actions.bulkMoveToVacationAction(
    "נובמבר 26",
    "Italy 27",
    [2],
    [payment],
  );
  assert.deepEqual(writes, [
    {
      range: "'Italy 27'!A2:F2",
      values: [["'6/11/2026", "Flight deposit", "1200", "Visa", "טיסה", ""]],
    },
  ]);
  assert.deepEqual(cleared, ["'נובמבר 26'!A2:F2"]);
  assert.deepEqual(operations, ["write", "clear"]);
  assert.equal(payment.date, "6.11");
});

test("a failed destination write leaves the source payment intact", async () => {
  failWrite = true;
  await assert.rejects(
    actions.bulkMoveToVacationAction("נובמבר 26", "Italy 27", [2], [payment]),
    /Destination unavailable/,
  );
  assert.deepEqual(cleared, []);
});

test("yearless historical payments use the source year rather than today's year", async () => {
  await actions.bulkMoveToVacationAction(
    "נובמבר 25",
    "Italy 27",
    [2],
    [payment],
  );
  assert.equal(writes[0].values[0][0], "'6/11/2025");
});

test("a move without a source year fails before writing or clearing payments", async () => {
  await assert.rejects(
    actions.bulkMoveToVacationAction("archive", "Italy 27", [2], [payment]),
    /payment year/,
  );
  assert.deepEqual(writes, []);
  assert.deepEqual(cleared, []);
});

test("imports use the source month year and preserve explicit years", async () => {
  await actions.addTransactionsBatch(
    "Italy 27",
    [payment, { ...payment, date: "31/12/25" }],
    true,
    "נובמבר 26",
  );
  assert.deepEqual(
    writes.map((write) => write.values[0][0]),
    ["'6/11/2026", "'31/12/2025"],
  );
});

test("manual vacation additions and edits keep an explicit 2026 payment year", async () => {
  await actions.addVacationTransaction("Italy 27", {
    ...payment,
    date: "6/11/26",
  });
  await actions.editVacationTransaction("Italy 27", 2, {
    ...payment,
    date: "6.11.2026",
    amount: 1300,
  });
  assert.deepEqual(
    writes.map((write) => write.values[0][0]),
    ["'6/11/2026", "'6/11/2026"],
  );
});

test("a 2027 vacation contributes its payments to their respective 2026 and 2027 months", async () => {
  fixtureRows = [
    ["6/11/2026", "Flight deposit", "1200", "Visa", "טיסה", ""],
    ["6/11/2027", "Hotel", "800", "Visa", "מלון", ""],
  ];
  const vacations = [
    { sheetId: 27, title: "Italy 27", type: "vacation" as const, year: 27 },
  ];
  const in2026 = await adapter.getVacationRowsForMonth("נובמבר 26", vacations);
  const in2027 = await adapter.getVacationRowsForMonth("נובמבר 27", vacations);
  assert.equal(in2026[0].amount, 1200);
  assert.equal(in2027[0].amount, 800);
  assert.equal(in2026[0].vacationName, "Italy 27");
});
