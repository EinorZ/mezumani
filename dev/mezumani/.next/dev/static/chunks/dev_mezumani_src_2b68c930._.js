(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/dev/mezumani/src/hooks/use-local-storage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useLocalStorage",
    ()=>useLocalStorage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function useLocalStorage(key, initial) {
    _s();
    const [value, setValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initial);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useLocalStorage.useEffect": ()=>{
            try {
                const stored = localStorage.getItem(key);
                if (stored !== null) {
                    setValue(JSON.parse(stored));
                }
            } catch  {
            // ignore parse errors
            }
        }
    }["useLocalStorage.useEffect"], [
        key
    ]);
    function set(v) {
        setValue(v);
        try {
            localStorage.setItem(key, JSON.stringify(v));
        } catch  {
        // ignore quota errors
        }
    }
    return [
        value,
        set
    ];
}
_s(useLocalStorage, "DSaWmzr3uHX4Mw2Vnzer6BvFWH0=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/dev/mezumani/src/lib/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ALL_TERMS",
    ()=>ALL_TERMS,
    "CHART_COLORS",
    ()=>CHART_COLORS,
    "DEFAULT_CATEGORY_COLOR",
    ()=>DEFAULT_CATEGORY_COLOR,
    "HEBREW_MONTHS",
    ()=>HEBREW_MONTHS,
    "SETTINGS_RANGE_ALLOC_COLORS",
    ()=>SETTINGS_RANGE_ALLOC_COLORS,
    "SETTINGS_RANGE_ALLOC_LABELS",
    ()=>SETTINGS_RANGE_ALLOC_LABELS,
    "SETTINGS_RANGE_ALLOC_PERCENTS",
    ()=>SETTINGS_RANGE_ALLOC_PERCENTS,
    "SETTINGS_RANGE_ALLOC_STOCKS",
    ()=>SETTINGS_RANGE_ALLOC_STOCKS,
    "SETTINGS_RANGE_ANNUAL_GOAL",
    ()=>SETTINGS_RANGE_ANNUAL_GOAL,
    "SETTINGS_RANGE_BROKER_MGMT_FEES",
    ()=>SETTINGS_RANGE_BROKER_MGMT_FEES,
    "SETTINGS_RANGE_BROKER_NAMES",
    ()=>SETTINGS_RANGE_BROKER_NAMES,
    "SETTINGS_RANGE_BROKER_PURCHASE_FEES",
    ()=>SETTINGS_RANGE_BROKER_PURCHASE_FEES,
    "SETTINGS_RANGE_CARDS_EINOR",
    ()=>SETTINGS_RANGE_CARDS_EINOR,
    "SETTINGS_RANGE_CARDS_SHARED",
    ()=>SETTINGS_RANGE_CARDS_SHARED,
    "SETTINGS_RANGE_CARDS_ZIV",
    ()=>SETTINGS_RANGE_CARDS_ZIV,
    "SETTINGS_RANGE_CATEGORY_MAP_CATEGORIES",
    ()=>SETTINGS_RANGE_CATEGORY_MAP_CATEGORIES,
    "SETTINGS_RANGE_CATEGORY_MAP_NAMES",
    ()=>SETTINGS_RANGE_CATEGORY_MAP_NAMES,
    "SETTINGS_RANGE_GOAL_AMOUNTS",
    ()=>SETTINGS_RANGE_GOAL_AMOUNTS,
    "SETTINGS_RANGE_GOAL_LABELS",
    ()=>SETTINGS_RANGE_GOAL_LABELS,
    "SETTINGS_RANGE_GOAL_TERMS",
    ()=>SETTINGS_RANGE_GOAL_TERMS,
    "SETTINGS_RANGE_INCOME_DATA",
    ()=>SETTINGS_RANGE_INCOME_DATA,
    "SETTINGS_RANGE_INCOME_NAMES",
    ()=>SETTINGS_RANGE_INCOME_NAMES,
    "SETTINGS_RANGE_IRREGULAR_EXPENSE_CATEGORIES",
    ()=>SETTINGS_RANGE_IRREGULAR_EXPENSE_CATEGORIES,
    "SETTINGS_RANGE_IRREGULAR_EXPENSE_YEARS",
    ()=>SETTINGS_RANGE_IRREGULAR_EXPENSE_YEARS,
    "SETTINGS_RANGE_MONTHLY",
    ()=>SETTINGS_RANGE_MONTHLY,
    "SETTINGS_RANGE_RECURRING_DATA",
    ()=>SETTINGS_RANGE_RECURRING_DATA,
    "SETTINGS_RANGE_RECURRING_NAMES",
    ()=>SETTINGS_RANGE_RECURRING_NAMES,
    "SETTINGS_RANGE_RENAME_RULE_KEYWORDS",
    ()=>SETTINGS_RANGE_RENAME_RULE_KEYWORDS,
    "SETTINGS_RANGE_RENAME_RULE_NAMES",
    ()=>SETTINGS_RANGE_RENAME_RULE_NAMES,
    "SETTINGS_RANGE_STOCK_CURRENCIES",
    ()=>SETTINGS_RANGE_STOCK_CURRENCIES,
    "SETTINGS_RANGE_STOCK_LABELS",
    ()=>SETTINGS_RANGE_STOCK_LABELS,
    "SETTINGS_RANGE_STOCK_NAMES",
    ()=>SETTINGS_RANGE_STOCK_NAMES,
    "SETTINGS_RANGE_STOCK_SOURCES",
    ()=>SETTINGS_RANGE_STOCK_SOURCES,
    "SETTINGS_RANGE_STOCK_SYMBOLS",
    ()=>SETTINGS_RANGE_STOCK_SYMBOLS,
    "SETTINGS_RANGE_SUMMARY_CATEGORIES",
    ()=>SETTINGS_RANGE_SUMMARY_CATEGORIES,
    "SETTINGS_RANGE_SUMMARY_LABELS",
    ()=>SETTINGS_RANGE_SUMMARY_LABELS,
    "SETTINGS_RANGE_VACATION",
    ()=>SETTINGS_RANGE_VACATION,
    "SETTINGS_RANGE_YEAR_RETURN_PERCENTS",
    ()=>SETTINGS_RANGE_YEAR_RETURN_PERCENTS,
    "SETTINGS_RANGE_YEAR_RETURN_YEARS",
    ()=>SETTINGS_RANGE_YEAR_RETURN_YEARS,
    "SETTINGS_SHEET_NAME",
    ()=>SETTINGS_SHEET_NAME,
    "SHEET_HEADERS",
    ()=>SHEET_HEADERS,
    "STOCKS_SHEET_NAME",
    ()=>STOCKS_SHEET_NAME,
    "STOCK_SHEET_HEADERS",
    ()=>STOCK_SHEET_HEADERS,
    "TERM_COLORS",
    ()=>TERM_COLORS,
    "TERM_LABELS",
    ()=>TERM_LABELS,
    "TERM_LABELS_SHORT",
    ()=>TERM_LABELS_SHORT,
    "TERM_TEXT_COLORS",
    ()=>TERM_TEXT_COLORS,
    "getLabelColor",
    ()=>getLabelColor
]);
const HEBREW_MONTHS = [
    "ינואר",
    "פברואר",
    "מרץ",
    "אפריל",
    "מאי",
    "יוני",
    "יולי",
    "אוגוסט",
    "ספטמבר",
    "אוקטובר",
    "נובמבר",
    "דצמבר"
];
const SETTINGS_SHEET_NAME = "הגדרות";
const SETTINGS_RANGE_MONTHLY = "A2:A100";
const SETTINGS_RANGE_VACATION = "B2:B100";
const SETTINGS_RANGE_CARDS_EINOR = "C2:C100";
const SETTINGS_RANGE_CARDS_ZIV = "D2:D100";
const SETTINGS_RANGE_CARDS_SHARED = "E2:E100";
const SETTINGS_RANGE_SUMMARY_LABELS = "F2:F100";
const SETTINGS_RANGE_SUMMARY_CATEGORIES = "G2:G100";
const SETTINGS_RANGE_RECURRING_NAMES = "H2:H100";
const SETTINGS_RANGE_RECURRING_DATA = "I2:I100";
const SETTINGS_RANGE_CATEGORY_MAP_NAMES = "J2:J100";
const SETTINGS_RANGE_CATEGORY_MAP_CATEGORIES = "K2:K100";
const SETTINGS_RANGE_RENAME_RULE_NAMES = "L2:L100";
const SETTINGS_RANGE_RENAME_RULE_KEYWORDS = "M2:M100";
const SETTINGS_RANGE_INCOME_NAMES = "N2:N100";
const SETTINGS_RANGE_INCOME_DATA = "O2:O100";
const SETTINGS_RANGE_ANNUAL_GOAL = "P2:P100";
const SETTINGS_RANGE_IRREGULAR_EXPENSE_YEARS = "Q2:Q100";
const SETTINGS_RANGE_IRREGULAR_EXPENSE_CATEGORIES = "R2:R100";
const DEFAULT_CATEGORY_COLOR = "#6c757d";
const SETTINGS_RANGE_STOCK_SYMBOLS = "A2:A100";
const SETTINGS_RANGE_STOCK_NAMES = "B2:B100";
const SETTINGS_RANGE_STOCK_SOURCES = "C2:C100";
const SETTINGS_RANGE_STOCK_CURRENCIES = "D2:D100";
const SETTINGS_RANGE_STOCK_LABELS = "E2:E100";
const SETTINGS_RANGE_GOAL_TERMS = "F2:F100";
const SETTINGS_RANGE_GOAL_LABELS = "G2:G100";
const SETTINGS_RANGE_GOAL_AMOUNTS = "H2:H100";
const SETTINGS_RANGE_BROKER_NAMES = "I2:I100";
const SETTINGS_RANGE_BROKER_MGMT_FEES = "J2:J100";
const SETTINGS_RANGE_BROKER_PURCHASE_FEES = "K2:K100";
const SETTINGS_RANGE_ALLOC_LABELS = "L2:L100";
const SETTINGS_RANGE_ALLOC_PERCENTS = "M2:M100";
const SETTINGS_RANGE_ALLOC_STOCKS = "N2:N100";
const SETTINGS_RANGE_ALLOC_COLORS = "O2:O100";
const SETTINGS_RANGE_YEAR_RETURN_YEARS = "P2:P100";
const SETTINGS_RANGE_YEAR_RETURN_PERCENTS = "Q2:Q100";
const STOCKS_SHEET_NAME = "מניות";
const STOCK_SHEET_HEADERS = [
    "תאריך",
    "סוג עסקה",
    "סימול",
    "כמות",
    "מחיר יחידה",
    "מטבע",
    "סוג",
    "בנק",
    "דמי ניהול קנייה",
    "הערות"
];
const SHEET_HEADERS = [
    "תאריך",
    "הוצאה",
    "כמה",
    "קטגוריה",
    "כרטיס",
    "הערות"
];
const ALL_TERMS = [
    "קצר",
    "בינוני",
    "ארוך",
    "לימבו"
];
const TERM_LABELS = {
    קצר: "טווח קצר",
    בינוני: "טווח בינוני",
    ארוך: "טווח ארוך",
    לימבו: "לימבו"
};
const TERM_LABELS_SHORT = {
    קצר: "קצר",
    בינוני: "בינוני",
    ארוך: "ארוך",
    לימבו: "לימבו"
};
const TERM_COLORS = {
    קצר: "#ffc107",
    בינוני: "#0dcaf0",
    ארוך: "#198754",
    לימבו: "#6f42c1"
};
const TERM_TEXT_COLORS = {
    קצר: "#000",
    בינוני: "#000",
    ארוך: "#fff",
    לימבו: "#fff"
};
function getLabelColor(label) {
    if (!label) return CHART_COLORS[CHART_COLORS.length - 1];
    let hash = 0;
    for(let i = 0; i < label.length; i++){
        hash = hash * 31 + label.charCodeAt(i) | 0;
    }
    return CHART_COLORS[Math.abs(hash) % CHART_COLORS.length];
}
const CHART_COLORS = [
    "#198754",
    "#0d6efd",
    "#6f42c1",
    "#fd7e14",
    "#0dcaf0",
    "#dc3545",
    "#20c997",
    "#ffc107",
    "#d63384",
    "#6610f2",
    "#adb5bd",
    "#0a58ca"
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/dev/mezumani/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CARD_OWNER_COLORS",
    ()=>CARD_OWNER_COLORS,
    "OWNER_LABELS",
    ()=>OWNER_LABELS,
    "buildCardsWithOwner",
    ()=>buildCardsWithOwner,
    "buildCategoryColorMap",
    ()=>buildCategoryColorMap,
    "buildYearGroups",
    ()=>buildYearGroups,
    "classifySheet",
    ()=>classifySheet,
    "evalMathExpr",
    ()=>evalMathExpr,
    "formatCurrency",
    ()=>formatCurrency,
    "formatCurrencyCompact",
    ()=>formatCurrencyCompact,
    "formatCurrencyWhole",
    ()=>formatCurrencyWhole,
    "formatNumber",
    ()=>formatNumber,
    "getAdjacentMonth",
    ()=>getAdjacentMonth,
    "getAllCards",
    ()=>getAllCards,
    "getCardOwner",
    ()=>getCardOwner,
    "getCategoryNames",
    ()=>getCategoryNames,
    "getCurrentMonthTitle",
    ()=>getCurrentMonthTitle,
    "getSummaryCardIcon",
    ()=>getSummaryCardIcon,
    "parseDDMMYY",
    ()=>parseDDMMYY,
    "parseNumber",
    ()=>parseNumber,
    "pnlColor",
    ()=>pnlColor,
    "pnlPrefix",
    ()=>pnlPrefix,
    "stripYearSuffix",
    ()=>stripYearSuffix
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/mezumani/src/lib/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/lucide-react/dist/esm/icons/credit-card.js [app-client] (ecmascript) <export default as CreditCard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plane$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plane$3e$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/lucide-react/dist/esm/icons/plane.js [app-client] (ecmascript) <export default as Plane>");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-client] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Car$3e$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/lucide-react/dist/esm/icons/car.js [app-client] (ecmascript) <export default as Car>");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Utensils$3e$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/lucide-react/dist/esm/icons/utensils.js [app-client] (ecmascript) <export default as Utensils>");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gift$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gift$3e$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/lucide-react/dist/esm/icons/gift.js [app-client] (ecmascript) <export default as Gift>");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/lucide-react/dist/esm/icons/briefcase.js [app-client] (ecmascript) <export default as Briefcase>");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$graduation$2d$cap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GraduationCap$3e$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/lucide-react/dist/esm/icons/graduation-cap.js [app-client] (ecmascript) <export default as GraduationCap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dumbbell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dumbbell$3e$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/lucide-react/dist/esm/icons/dumbbell.js [app-client] (ecmascript) <export default as Dumbbell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$baby$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Baby$3e$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/lucide-react/dist/esm/icons/baby.js [app-client] (ecmascript) <export default as Baby>");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$piggy$2d$bank$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PiggyBank$3e$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/lucide-react/dist/esm/icons/piggy-bank.js [app-client] (ecmascript) <export default as PiggyBank>");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/lucide-react/dist/esm/icons/calculator.js [app-client] (ecmascript) <export default as Calculator>");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plane$2d$takeoff$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlaneTakeoff$3e$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/lucide-react/dist/esm/icons/plane-takeoff.js [app-client] (ecmascript) <export default as PlaneTakeoff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/lucide-react/dist/esm/icons/wallet.js [app-client] (ecmascript) <export default as Wallet>");
;
;
const ICON_MAP = {
    'סה"כ': __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"],
    'סה"כ הוצאות': __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"],
    סהכ: __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"],
    הכנסות: __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"],
    חיסכון: __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$piggy$2d$bank$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PiggyBank$3e$__["PiggyBank"],
    "חיסכון שנתי": __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$piggy$2d$bank$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PiggyBank$3e$__["PiggyBank"],
    "חיסכון חודשי": __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$piggy$2d$bank$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PiggyBank$3e$__["PiggyBank"],
    "ממוצע חיסכון חודשי": __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$piggy$2d$bank$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PiggyBank$3e$__["PiggyBank"],
    'סה"כ הכנסות': __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"],
    'סכ"ה הכנסות': __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"],
    'סה"כ שנתי': __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"],
    'סה"כ הכנסות שנתי': __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"],
    'סה"כ הוצאות שנתי': __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"],
    "ממוצע חודשי": __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__["Calculator"],
    "ממוצע הכנסה חודשי": __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"],
    "ממוצע הוצאות חודשי": __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"],
    "הוצאות ללא חופשות": __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plane$2d$takeoff$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlaneTakeoff$3e$__["PlaneTakeoff"],
    "ללא חופשות": __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plane$2d$takeoff$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlaneTakeoff$3e$__["PlaneTakeoff"],
    "ממוצע ללא חופשות": __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plane$2d$takeoff$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlaneTakeoff$3e$__["PlaneTakeoff"],
    דיור: __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"],
    חופשות: __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plane$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plane$3e$__["Plane"],
    חופשה: __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plane$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plane$3e$__["Plane"],
    קניות: __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"],
    סופר: __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"],
    רכב: __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Car$3e$__["Car"],
    אוכל: __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Utensils$3e$__["Utensils"],
    מסעדות: __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Utensils$3e$__["Utensils"],
    בריאות: __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"],
    מתנות: __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gift$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gift$3e$__["Gift"],
    עבודה: __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__["Briefcase"],
    לימודים: __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$graduation$2d$cap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GraduationCap$3e$__["GraduationCap"],
    ספורט: __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dumbbell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dumbbell$3e$__["Dumbbell"],
    תינוק: __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$baby$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Baby$3e$__["Baby"]
};
function getSummaryCardIcon(label) {
    return ICON_MAP[label] ?? __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__["Wallet"];
}
const currencyFormatter = new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});
function formatCurrency(amount) {
    return currencyFormatter.format(amount);
}
const currencyFormatterWhole = new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});
function formatCurrencyWhole(amount) {
    return currencyFormatterWhole.format(amount);
}
const numberFormatter = new Intl.NumberFormat("he-IL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});
function formatNumber(n) {
    return numberFormatter.format(n);
}
function formatCurrencyCompact(amount) {
    if (Math.abs(amount) >= 1_000_000) {
        return `₪${(amount / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(amount) >= 1_000) {
        return `₪${(amount / 1_000).toFixed(1)}K`;
    }
    return currencyFormatter.format(amount);
}
function classifySheet(sheetId, title) {
    // Settings sheet
    if (title === __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_SHEET_NAME"]) {
        return {
            sheetId,
            title,
            type: "settings"
        };
    }
    // Annual sheet: "שנתי XX"
    const annualMatch = title.match(/^שנתי\s+(\d+)$/);
    if (annualMatch) {
        return {
            sheetId,
            title,
            type: "annual",
            year: parseInt(annualMatch[1], 10)
        };
    }
    // Monthly sheet: "{HebrewMonth} XX"
    for(let i = 0; i < __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HEBREW_MONTHS"].length; i++){
        const monthMatch = title.match(new RegExp(`^${__TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HEBREW_MONTHS"][i]}\\s+(\\d+)$`));
        if (monthMatch) {
            return {
                sheetId,
                title,
                type: "monthly",
                monthIndex: i,
                year: parseInt(monthMatch[1], 10)
            };
        }
    }
    // Vacation sheet: any other sheet with a year suffix (e.g., "קפריסין 26")
    const vacationMatch = title.match(/^(.+)\s+(\d+)$/);
    if (vacationMatch) {
        return {
            sheetId,
            title,
            type: "vacation",
            year: parseInt(vacationMatch[2], 10)
        };
    }
    return {
        sheetId,
        title,
        type: "other"
    };
}
function getCurrentMonthTitle() {
    const now = new Date();
    const monthName = __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HEBREW_MONTHS"][now.getMonth()];
    const yearSuffix = now.getFullYear() % 100;
    return `${monthName} ${yearSuffix}`;
}
function getAdjacentMonth(currentTitle, direction, sheets) {
    const info = classifySheet(0, currentTitle);
    if (info.type !== "monthly" || info.monthIndex === undefined || !info.year) return null;
    let newMonth = info.monthIndex + direction;
    let newYear = info.year;
    if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
    } else if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
    }
    const targetTitle = `${__TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HEBREW_MONTHS"][newMonth]} ${newYear}`;
    return sheets.find((s)=>s.title === targetTitle) ?? null;
}
function stripYearSuffix(title) {
    return title.replace(/\s+\d+$/, "");
}
function parseNumber(value) {
    if (!value) return 0;
    const cleaned = value.replace(/[^\d.-]/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
}
function evalMathExpr(input) {
    const s = input.replace(/\s/g, "");
    if (!s) return 0;
    // Tokenize: negative sign only at start or after an operator
    const tokens = s.match(/(?:^|(?<=[+\-*/]))-?\d+\.?\d*|[+\-*/]|\d+\.?\d*/g);
    if (!tokens) return 0;
    // If it's a single number, fast path
    if (tokens.length === 1) return parseFloat(tokens[0]) || 0;
    // Build array of numbers applying * and / first (simple two-pass)
    const nums = [
        parseFloat(tokens[0]) || 0
    ];
    const ops = [];
    for(let i = 1; i < tokens.length; i += 2){
        const op = tokens[i];
        const num = parseFloat(tokens[i + 1]) || 0;
        if (op === "*") {
            nums[nums.length - 1] *= num;
        } else if (op === "/") {
            nums[nums.length - 1] = num !== 0 ? nums[nums.length - 1] / num : 0;
        } else {
            ops.push(op);
            nums.push(num);
        }
    }
    // Second pass: + and -
    let result = nums[0];
    for(let i = 0; i < ops.length; i++){
        result = ops[i] === "+" ? result + nums[i + 1] : result - nums[i + 1];
    }
    return isNaN(result) ? 0 : result;
}
function parseDDMMYY(str) {
    if (!str) return null;
    const parts = str.split("/");
    if (parts.length < 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    let year = parseInt(parts[2], 10);
    if (year < 100) year += 2000;
    return new Date(year, month, day);
}
function pnlColor(value) {
    return value >= 0 ? "#198754" : "#dc3545";
}
function pnlPrefix(value) {
    return value >= 0 ? "+" : "";
}
function getAllCards(config) {
    return [
        ...config.cardsEinor,
        ...config.cardsZiv,
        ...config.cardsShared
    ];
}
const CARD_OWNER_COLORS = {
    einor: "#7abaff",
    ziv: "#b49fdc",
    shared: "#77d9a0"
};
const OWNER_LABELS = {
    einor: "עינור",
    ziv: "זיו",
    shared: "משותף"
};
function getCardOwner(cardName, config) {
    // Check owner suffix first (e.g. "אמקס - זיו" → ziv)
    if (cardName.includes("זיו")) return "ziv";
    if (cardName.includes("עינור")) return "einor";
    if (config) {
        const baseName = cardName.replace(/ - (עינור|זיו)$/, "");
        if (config.cardsShared.includes(baseName)) return "shared";
        if (config.cardsEinor.includes(baseName)) return "einor";
        if (config.cardsZiv.includes(baseName)) return "ziv";
    }
    return "shared";
}
function buildCardsWithOwner(config) {
    const cards = [];
    const cardColorMap = {};
    const groups = [
        {
            items: config.cardsShared,
            owner: "shared"
        },
        {
            items: config.cardsEinor,
            owner: "einor"
        },
        {
            items: config.cardsZiv,
            owner: "ziv"
        }
    ];
    for (const group of groups){
        for (const card of group.items){
            // Shared cards keep plain name, others get owner suffix
            const label = group.owner === "shared" ? card : `${card} - ${OWNER_LABELS[group.owner]}`;
            cards.push(label);
            cardColorMap[label] = CARD_OWNER_COLORS[group.owner];
        }
    }
    return {
        cards,
        cardColorMap
    };
}
function buildCategoryColorMap(...categoryLists) {
    const map = {};
    for (const list of categoryLists){
        for (const item of list){
            map[item.name] = item.color;
        }
    }
    return map;
}
function getCategoryNames(items) {
    return items.map((item)=>item.name);
}
function buildYearGroups(sheets) {
    const yearMap = new Map();
    for (const sheet of sheets){
        if (sheet.type === "settings" || sheet.type === "other" || sheet.year === undefined) continue;
        if (!yearMap.has(sheet.year)) {
            yearMap.set(sheet.year, {
                months: [],
                vacations: [],
                hasAnnual: false
            });
        }
        const group = yearMap.get(sheet.year);
        if (sheet.type === "monthly") {
            group.months.push(sheet);
        } else if (sheet.type === "vacation") {
            group.vacations.push(sheet);
        } else if (sheet.type === "annual") {
            group.hasAnnual = true;
        }
    }
    const groups = [];
    for (const [year, data] of yearMap){
        data.months.sort((a, b)=>(b.monthIndex ?? 0) - (a.monthIndex ?? 0));
        // vacations keep their original Google Sheets tab order
        groups.push({
            year,
            fullYear: 2000 + year,
            months: data.months,
            vacations: data.vacations,
            hasAnnual: data.hasAnnual
        });
    }
    // Sort years descending
    groups.sort((a, b)=>b.year - a.year);
    return groups;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/dev/mezumani/src/lib/data:86372d [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "renameSheetAction",
    ()=>$$RSC_SERVER_ACTION_40
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"701dd32f48c3a654040354d893d82325263961fc20":"renameSheetAction"},"dev/mezumani/src/lib/actions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_40 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("701dd32f48c3a654040354d893d82325263961fc20", __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "renameSheetAction");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzZXJ2ZXJcIjtcblxuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tIFwibmV4dC9jYWNoZVwiO1xuaW1wb3J0IHtcbiAgYXBwZW5kVHJhbnNhY3Rpb24sXG4gIHVwZGF0ZVRyYW5zYWN0aW9uLFxuICBjbGVhclRyYW5zYWN0aW9uLFxuICBjcmVhdGVNb250aFNoZWV0LFxuICBhZGRDb25maWdJdGVtLFxuICByZW1vdmVDb25maWdJdGVtLFxuICBhZGRDYXRlZ29yeUNvbmZpZ0l0ZW0sXG4gIHJlbW92ZUNhdGVnb3J5Q29uZmlnSXRlbSxcbiAgcmVuYW1lQ2F0ZWdvcnlJblNoZWV0cyxcbiAgcmVuYW1lU2hlZXQsXG4gIG1vdmVTaGVldCxcbiAgY3JlYXRlVmFjYXRpb25TaGVldCxcbiAgZW5zdXJlQ3VycmVudFNoZWV0cyxcbiAgbGlzdFNoZWV0cyxcbiAgYWRkU3VtbWFyeUNhcmRJdGVtLFxuICByZW1vdmVTdW1tYXJ5Q2FyZEl0ZW0sXG4gIHVwZGF0ZVN1bW1hcnlDYXJkSXRlbSxcbiAgYWRkUmVjdXJyaW5nRXhwZW5zZSxcbiAgdXBkYXRlUmVjdXJyaW5nRXhwZW5zZSxcbiAgcmVtb3ZlUmVjdXJyaW5nRXhwZW5zZSxcbiAgcmVvcmRlclJlY3VycmluZ0V4cGVuc2VzLFxuICByZW9yZGVyU3VtbWFyeUNhcmRzIGFzIHJlb3JkZXJTdW1tYXJ5Q2FyZHNHUyxcbiAgYmF0Y2hJbXBvcnRUcmFuc2FjdGlvbnMsXG4gIGFkZENhdGVnb3J5TWFwcGluZyxcbiAgdXBkYXRlQ2F0ZWdvcnlNYXBwaW5nLFxuICByZW1vdmVDYXRlZ29yeU1hcHBpbmcsXG4gIGFkZEV4cGVuc2VSZW5hbWVSdWxlLFxuICB1cGRhdGVFeHBlbnNlUmVuYW1lUnVsZSxcbiAgcmVtb3ZlRXhwZW5zZVJlbmFtZVJ1bGUsXG4gIGJhdGNoVXBkYXRlRmllbGRzLFxuICBiYXRjaFRvZ2dsZVRlbnRhdGl2ZUZsYWcsXG4gIHNldE1vbnRoRG9uZSxcbiAgYWRkSW5jb21lU291cmNlLFxuICB1cGRhdGVJbmNvbWVTb3VyY2UsXG4gIHJlbW92ZUluY29tZVNvdXJjZSxcbiAgdXBkYXRlTW9udGhJbmNvbWUsXG4gIHVwZGF0ZU1vbnRoQWxsb2NhdGlvbnMsXG4gIGFkZFN0b2NrRGVmaW5pdGlvbixcbiAgdXBkYXRlU3RvY2tEZWZpbml0aW9uLFxuICByZW1vdmVTdG9ja0RlZmluaXRpb24sXG4gIGFkZEJyb2tlckNvbmZpZyxcbiAgdXBkYXRlQnJva2VyQ29uZmlnLFxuICByZW1vdmVCcm9rZXJDb25maWcsXG4gIGFkZFN0b2NrR29hbCxcbiAgdXBkYXRlU3RvY2tHb2FsLFxuICByZW1vdmVTdG9ja0dvYWwsXG4gIGFkZFN0b2NrVHJhbnNhY3Rpb24gYXMgYWRkU3RvY2tUeCxcbiAgdXBkYXRlU3RvY2tUcmFuc2FjdGlvbiBhcyB1cGRhdGVTdG9ja1R4LFxuICBkZWxldGVTdG9ja1RyYW5zYWN0aW9uIGFzIGRlbGV0ZVN0b2NrVHgsXG4gIHNhdmVMYWJlbEFsbG9jYXRpb25zLFxuICBhZGRSc3VWZXN0Um93cyxcbiAgdXBkYXRlUnN1Um93LFxuICBkZWxldGVSc3VSb3csXG4gIHRvZ2dsZVJzdVNvbGQsXG4gIHNldFJzdUdyb3NzRGF0YSxcbiAgc2V0QW5udWFsU2F2aW5nc0dvYWwsXG4gIHNldEFubnVhbEdvYWxGb3JZZWFyLFxuICBzZXRJcnJlZ3VsYXJFeHBlbnNlQ2F0ZWdvcmllc0ZvclllYXIsXG59IGZyb20gXCIuL2dvb2dsZS1zaGVldHNcIjtcbmltcG9ydCB7IEhFQlJFV19NT05USFMgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbmltcG9ydCB7XG4gIGVuc3VyZVBlbnNpb25TaGVldCxcbiAgZ2V0UGVuc2lvbkZ1bmRzLFxuICBhZGRQZW5zaW9uRnVuZCxcbiAgdXBkYXRlUGVuc2lvbkZ1bmQsXG4gIGRlbGV0ZVBlbnNpb25GdW5kLFxufSBmcm9tIFwiLi9wZW5zaW9uLXNoZWV0c1wiO1xuaW1wb3J0IHR5cGUge1xuICBUcmFuc2FjdGlvbklucHV0LFxuICBSZWN1cnJpbmdFeHBlbnNlLFxuICBTdW1tYXJ5Q2FyZCxcbiAgSW5jb21lU291cmNlLFxuICBNb250aEFsbG9jYXRpb24sXG4gIExhYmVsQWxsb2NhdGlvbixcbiAgUHJpY2VTb3VyY2UsXG4gIFN0b2NrQ3VycmVuY3ksXG4gIEludmVzdG1lbnRUZXJtLFxuICBUcmFuc2FjdGlvblR5cGUsXG4gIENoYXJ0UmFuZ2UsXG4gIFBvcnRmb2xpb0hpc3RvcnlQb2ludCxcbiAgUG9ydGZvbGlvUmV0dXJucyxcbiAgUGVuc2lvbk93bmVyLFxuICBQZW5zaW9uRnVuZFR5cGUsXG59IGZyb20gXCIuL3R5cGVzXCI7XG5cbmZ1bmN0aW9uIGJ1aWxkVHJhbnNhY3Rpb25WYWx1ZXMoZGF0YTogVHJhbnNhY3Rpb25JbnB1dCwgaXNWYWNhdGlvbiA9IGZhbHNlKSB7XG4gIGNvbnN0IGFtb3VudCA9IGRhdGEudGVudGF0aXZlID8gXCJcIiA6IFN0cmluZyhkYXRhLmFtb3VudCk7XG4gIGNvbnN0IHRlbnRhdGl2ZUFtb3VudCA9IGRhdGEudGVudGF0aXZlID8gU3RyaW5nKGRhdGEuYW1vdW50KSA6IFwiXCI7XG4gIGlmIChpc1ZhY2F0aW9uKSB7XG4gICAgLy8gVmFjYXRpb24gY29sdW1uczogRD1jYXJkLCBFPWNhdGVnb3J5IChzd2FwcGVkIHZzIG1vbnRobHkpXG4gICAgcmV0dXJuIFtkYXRhLmRhdGUsIGRhdGEuZXhwZW5zZSwgYW1vdW50LCBkYXRhLmNhcmQsIGRhdGEuY2F0ZWdvcnksIHRlbnRhdGl2ZUFtb3VudF07XG4gIH1cbiAgcmV0dXJuIFtkYXRhLmRhdGUsIGRhdGEuZXhwZW5zZSwgYW1vdW50LCBkYXRhLmNhdGVnb3J5LCBkYXRhLmNhcmQsIHRlbnRhdGl2ZUFtb3VudF07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRUcmFuc2FjdGlvbihcbiAgc2hlZXRUaXRsZTogc3RyaW5nLFxuICBkYXRhOiBUcmFuc2FjdGlvbklucHV0LFxuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgcmV0dXJuIGFwcGVuZFRyYW5zYWN0aW9uKHNoZWV0VGl0bGUsIGJ1aWxkVHJhbnNhY3Rpb25WYWx1ZXMoZGF0YSkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZWRpdFRyYW5zYWN0aW9uKFxuICBzaGVldFRpdGxlOiBzdHJpbmcsXG4gIHJvdzogbnVtYmVyLFxuICBkYXRhOiBUcmFuc2FjdGlvbklucHV0LFxuKSB7XG4gIGF3YWl0IHVwZGF0ZVRyYW5zYWN0aW9uKHNoZWV0VGl0bGUsIHJvdywgYnVpbGRUcmFuc2FjdGlvblZhbHVlcyhkYXRhKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVUcmFuc2FjdGlvbihzaGVldFRpdGxlOiBzdHJpbmcsIHJvdzogbnVtYmVyKSB7XG4gIGF3YWl0IGNsZWFyVHJhbnNhY3Rpb24oc2hlZXRUaXRsZSwgcm93KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZU1vbnRoKG1vbnRoSW5kZXg6IG51bWJlciwgeWVhclN1ZmZpeDogbnVtYmVyKSB7XG4gIGF3YWl0IGNyZWF0ZU1vbnRoU2hlZXQoSEVCUkVXX01PTlRIU1ttb250aEluZGV4XSwgeWVhclN1ZmZpeCk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL1wiKTtcbn1cblxuLy8gLS0tLSBTZXR0aW5ncyBhY3Rpb25zIC0tLS1cblxuY29uc3QgQ09MVU1OX01BUCA9IHtcbiAgbW9udGhseTogXCJBXCIgYXMgY29uc3QsXG4gIHZhY2F0aW9uOiBcIkJcIiBhcyBjb25zdCxcbn07XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRDYXRlZ29yeShcbiAgdHlwZTogXCJtb250aGx5XCIgfCBcInZhY2F0aW9uXCIsXG4gIG5hbWU6IHN0cmluZyxcbiAgY29sb3I6IHN0cmluZyxcbikge1xuICBhd2FpdCBhZGRDYXRlZ29yeUNvbmZpZ0l0ZW0oQ09MVU1OX01BUFt0eXBlXSwgbmFtZSwgY29sb3IpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbW92ZUNhdGVnb3J5KFxuICB0eXBlOiBcIm1vbnRobHlcIiB8IFwidmFjYXRpb25cIixcbiAgbmFtZTogc3RyaW5nLFxuKSB7XG4gIGF3YWl0IHJlbW92ZUNhdGVnb3J5Q29uZmlnSXRlbShDT0xVTU5fTUFQW3R5cGVdLCBuYW1lKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW5hbWVDYXRlZ29yeShcbiAgdHlwZTogXCJtb250aGx5XCIgfCBcInZhY2F0aW9uXCIsXG4gIG9sZE5hbWU6IHN0cmluZyxcbiAgbmV3TmFtZTogc3RyaW5nLFxuKSB7XG4gIGF3YWl0IHJlbmFtZUNhdGVnb3J5SW5TaGVldHMoQ09MVU1OX01BUFt0eXBlXSwgb2xkTmFtZSwgbmV3TmFtZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xuICByZXZhbGlkYXRlUGF0aChcIi9cIik7XG59XG5cbmNvbnN0IENBUkRfQ09MVU1OX01BUCA9IHtcbiAgZWlub3I6IFwiQ1wiIGFzIGNvbnN0LFxuICB6aXY6IFwiRFwiIGFzIGNvbnN0LFxuICBzaGFyZWQ6IFwiRVwiIGFzIGNvbnN0LFxufTtcblxuZXhwb3J0IHR5cGUgQ2FyZE93bmVyID0gXCJlaW5vclwiIHwgXCJ6aXZcIiB8IFwic2hhcmVkXCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRDYXJkKG93bmVyOiBDYXJkT3duZXIsIG5hbWU6IHN0cmluZykge1xuICBhd2FpdCBhZGRDb25maWdJdGVtKENBUkRfQ09MVU1OX01BUFtvd25lcl0sIG5hbWUpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbW92ZUNhcmQob3duZXI6IENhcmRPd25lciwgbmFtZTogc3RyaW5nKSB7XG4gIGF3YWl0IHJlbW92ZUNvbmZpZ0l0ZW0oQ0FSRF9DT0xVTU5fTUFQW293bmVyXSwgbmFtZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG4vLyAtLS0tIFN1bW1hcnkgY2FyZCBhY3Rpb25zIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZFN1bW1hcnlDYXJkKGxhYmVsOiBzdHJpbmcsIGNhdGVnb3JpZXM6IHN0cmluZykge1xuICBhd2FpdCBhZGRTdW1tYXJ5Q2FyZEl0ZW0obGFiZWwsIGNhdGVnb3JpZXMpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbW92ZVN1bW1hcnlDYXJkKGxhYmVsOiBzdHJpbmcpIHtcbiAgYXdhaXQgcmVtb3ZlU3VtbWFyeUNhcmRJdGVtKGxhYmVsKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVTdW1tYXJ5Q2FyZChcbiAgb2xkTGFiZWw6IHN0cmluZyxcbiAgbmV3TGFiZWw6IHN0cmluZyxcbiAgY2F0ZWdvcmllczogc3RyaW5nLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZVN1bW1hcnlDYXJkSXRlbShvbGRMYWJlbCwgbmV3TGFiZWwsIGNhdGVnb3JpZXMpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlb3JkZXJTdW1tYXJ5Q2FyZHMoaXRlbXM6IFN1bW1hcnlDYXJkW10pIHtcbiAgYXdhaXQgcmVvcmRlclN1bW1hcnlDYXJkc0dTKGl0ZW1zKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbi8vIC0tLS0gUmVjdXJyaW5nIGV4cGVuc2UgYWN0aW9ucyAtLS0tXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRSZWN1cnJpbmcoXG4gIG5hbWU6IHN0cmluZyxcbiAgYW1vdW50OiBudW1iZXIsXG4gIGNhdGVnb3J5OiBzdHJpbmcsXG4gIGNhcmQ6IHN0cmluZyxcbiAga2V5d29yZHM6IHN0cmluZyA9IFwiXCIsXG4gIHRlbnRhdGl2ZTogYm9vbGVhbiA9IGZhbHNlLFxuKSB7XG4gIGF3YWl0IGFkZFJlY3VycmluZ0V4cGVuc2UobmFtZSwgYW1vdW50LCBjYXRlZ29yeSwgY2FyZCwga2V5d29yZHMsIHRlbnRhdGl2ZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlUmVjdXJyaW5nKFxuICBvbGROYW1lOiBzdHJpbmcsXG4gIG5hbWU6IHN0cmluZyxcbiAgYW1vdW50OiBudW1iZXIsXG4gIGNhdGVnb3J5OiBzdHJpbmcsXG4gIGNhcmQ6IHN0cmluZyxcbiAga2V5d29yZHM6IHN0cmluZyA9IFwiXCIsXG4gIHRlbnRhdGl2ZTogYm9vbGVhbiA9IGZhbHNlLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZVJlY3VycmluZ0V4cGVuc2UoXG4gICAgb2xkTmFtZSxcbiAgICBuYW1lLFxuICAgIGFtb3VudCxcbiAgICBjYXRlZ29yeSxcbiAgICBjYXJkLFxuICAgIGtleXdvcmRzLFxuICAgIHRlbnRhdGl2ZSxcbiAgKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW1vdmVSZWN1cnJpbmcobmFtZTogc3RyaW5nKSB7XG4gIGF3YWl0IHJlbW92ZVJlY3VycmluZ0V4cGVuc2UobmFtZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVvcmRlclJlY3VycmluZyhpdGVtczogUmVjdXJyaW5nRXhwZW5zZVtdKSB7XG4gIGF3YWl0IHJlb3JkZXJSZWN1cnJpbmdFeHBlbnNlcyhpdGVtcyk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG4vLyAtLS0tIENhdGVnb3J5IG1hcHBpbmcgYWN0aW9ucyAtLS0tXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRDYXRlZ29yeU1hcHBpbmdBY3Rpb24oXG4gIGV4cGVuc2VOYW1lczogc3RyaW5nIHwgc3RyaW5nW10sXG4gIGNhdGVnb3J5OiBzdHJpbmcsXG4pIHtcbiAgYXdhaXQgYWRkQ2F0ZWdvcnlNYXBwaW5nKGV4cGVuc2VOYW1lcywgY2F0ZWdvcnkpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUNhdGVnb3J5TWFwcGluZ0FjdGlvbihcbiAgb2xkRXhwZW5zZU5hbWU6IHN0cmluZyxcbiAgZXhwZW5zZU5hbWU6IHN0cmluZyxcbiAgY2F0ZWdvcnk6IHN0cmluZyxcbikge1xuICBhd2FpdCB1cGRhdGVDYXRlZ29yeU1hcHBpbmcob2xkRXhwZW5zZU5hbWUsIGV4cGVuc2VOYW1lLCBjYXRlZ29yeSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVtb3ZlQ2F0ZWdvcnlNYXBwaW5nQWN0aW9uKGV4cGVuc2VOYW1lOiBzdHJpbmcpIHtcbiAgYXdhaXQgcmVtb3ZlQ2F0ZWdvcnlNYXBwaW5nKGV4cGVuc2VOYW1lKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbi8vIC0tLS0gRXhwZW5zZSByZW5hbWUgcnVsZSBhY3Rpb25zIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZEV4cGVuc2VSZW5hbWVSdWxlQWN0aW9uKFxuICB0YXJnZXROYW1lOiBzdHJpbmcsXG4gIGtleXdvcmRzOiBzdHJpbmcsXG4pIHtcbiAgYXdhaXQgYWRkRXhwZW5zZVJlbmFtZVJ1bGUodGFyZ2V0TmFtZSwga2V5d29yZHMpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUV4cGVuc2VSZW5hbWVSdWxlQWN0aW9uKFxuICBvbGRUYXJnZXROYW1lOiBzdHJpbmcsXG4gIHRhcmdldE5hbWU6IHN0cmluZyxcbiAga2V5d29yZHM6IHN0cmluZyxcbikge1xuICBhd2FpdCB1cGRhdGVFeHBlbnNlUmVuYW1lUnVsZShvbGRUYXJnZXROYW1lLCB0YXJnZXROYW1lLCBrZXl3b3Jkcyk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVtb3ZlRXhwZW5zZVJlbmFtZVJ1bGVBY3Rpb24odGFyZ2V0TmFtZTogc3RyaW5nKSB7XG4gIGF3YWl0IHJlbW92ZUV4cGVuc2VSZW5hbWVSdWxlKHRhcmdldE5hbWUpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuLy8gLS0tLSBBbm51YWwgc2F2aW5ncyBnb2FsIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldEFubnVhbFNhdmluZ3NHb2FsQWN0aW9uKGFtb3VudDogbnVtYmVyKSB7XG4gIGF3YWl0IHNldEFubnVhbFNhdmluZ3NHb2FsKGFtb3VudCk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xuICByZXZhbGlkYXRlUGF0aChcIi9cIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZXRBbm51YWxHb2FsRm9yWWVhckFjdGlvbihcbiAgeWVhcjogbnVtYmVyIHwgXCJkZWZhdWx0XCIsXG4gIGFtb3VudDogbnVtYmVyLFxuKSB7XG4gIGF3YWl0IHNldEFubnVhbEdvYWxGb3JZZWFyKHllYXIsIGFtb3VudCk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xuICByZXZhbGlkYXRlUGF0aChcIi9cIik7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3llYXIvW3llYXJdXCIsIFwicGFnZVwiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldElycmVndWxhckV4cGVuc2VDYXRlZ29yaWVzRm9yWWVhckFjdGlvbihcbiAgeWVhcjogbnVtYmVyLFxuICBjYXRlZ29yaWVzOiBzdHJpbmdbXSxcbikge1xuICBhd2FpdCBzZXRJcnJlZ3VsYXJFeHBlbnNlQ2F0ZWdvcmllc0ZvclllYXIoeWVhciwgY2F0ZWdvcmllcyk7XG4gIHJldmFsaWRhdGVQYXRoKGAveWVhci8ke3llYXIgJSAxMDB9YCk7XG59XG5cbi8vIC0tLS0gSW5jb21lIHNvdXJjZSBhY3Rpb25zIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZEluY29tZShuYW1lOiBzdHJpbmcsIGFtb3VudDogbnVtYmVyKSB7XG4gIGF3YWl0IGFkZEluY29tZVNvdXJjZShuYW1lLCBhbW91bnQpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUluY29tZShcbiAgb2xkTmFtZTogc3RyaW5nLFxuICBuYW1lOiBzdHJpbmcsXG4gIGFtb3VudDogbnVtYmVyLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZUluY29tZVNvdXJjZShvbGROYW1lLCBuYW1lLCBhbW91bnQpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbW92ZUluY29tZShuYW1lOiBzdHJpbmcpIHtcbiAgYXdhaXQgcmVtb3ZlSW5jb21lU291cmNlKG5hbWUpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZU1vbnRoSW5jb21lQWN0aW9uKFxuICBzaGVldFRpdGxlOiBzdHJpbmcsXG4gIGVudHJpZXM6IEluY29tZVNvdXJjZVtdLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZU1vbnRoSW5jb21lKHNoZWV0VGl0bGUsIGVudHJpZXMpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlTW9udGhBbGxvY2F0aW9uc0FjdGlvbihcbiAgc2hlZXRUaXRsZTogc3RyaW5nLFxuICB5ZWFyU3VmZml4OiBudW1iZXIsXG4gIGFsbG9jYXRpb25zOiBNb250aEFsbG9jYXRpb25bXSxcbikge1xuICBhd2FpdCB1cGRhdGVNb250aEFsbG9jYXRpb25zKHNoZWV0VGl0bGUsIGFsbG9jYXRpb25zKTtcbiAgcmV2YWxpZGF0ZVBhdGgoYC95ZWFyLyR7eWVhclN1ZmZpeH1gKTtcbn1cblxuLy8gLS0tLSBWYWNhdGlvbiBhY3Rpb25zIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVZhY2F0aW9uKG5hbWU6IHN0cmluZywgeWVhclN1ZmZpeDogbnVtYmVyKSB7XG4gIGF3YWl0IGNyZWF0ZVZhY2F0aW9uU2hlZXQobmFtZSwgeWVhclN1ZmZpeCk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL1wiKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRWYWNhdGlvblRyYW5zYWN0aW9uKFxuICBzaGVldFRpdGxlOiBzdHJpbmcsXG4gIGRhdGE6IFRyYW5zYWN0aW9uSW5wdXQsXG4pOiBQcm9taXNlPG51bWJlcj4ge1xuICByZXR1cm4gYXBwZW5kVHJhbnNhY3Rpb24oc2hlZXRUaXRsZSwgYnVpbGRUcmFuc2FjdGlvblZhbHVlcyhkYXRhLCB0cnVlKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBlZGl0VmFjYXRpb25UcmFuc2FjdGlvbihcbiAgc2hlZXRUaXRsZTogc3RyaW5nLFxuICByb3c6IG51bWJlcixcbiAgZGF0YTogVHJhbnNhY3Rpb25JbnB1dCxcbikge1xuICBhd2FpdCB1cGRhdGVUcmFuc2FjdGlvbihzaGVldFRpdGxlLCByb3csIGJ1aWxkVHJhbnNhY3Rpb25WYWx1ZXMoZGF0YSwgdHJ1ZSkpO1xufVxuXG5leHBvcnQgY29uc3QgZGVsZXRlVmFjYXRpb25UcmFuc2FjdGlvbiA9IGRlbGV0ZVRyYW5zYWN0aW9uO1xuXG4vLyAtLS0tIEJ1bGsgZWRpdCAtLS0tXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBidWxrRWRpdFRyYW5zYWN0aW9ucyhcbiAgc2hlZXRUaXRsZTogc3RyaW5nLFxuICB1cGRhdGVzOiB7IHJvdzogbnVtYmVyOyBjYXRlZ29yeT86IHN0cmluZzsgY2FyZD86IHN0cmluZyB9W10sXG4pIHtcbiAgYXdhaXQgYmF0Y2hVcGRhdGVGaWVsZHMoc2hlZXRUaXRsZSwgZmFsc2UsIHVwZGF0ZXMpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYnVsa0VkaXRWYWNhdGlvblRyYW5zYWN0aW9ucyhcbiAgc2hlZXRUaXRsZTogc3RyaW5nLFxuICB1cGRhdGVzOiB7IHJvdzogbnVtYmVyOyBjYXRlZ29yeT86IHN0cmluZzsgY2FyZD86IHN0cmluZyB9W10sXG4pIHtcbiAgYXdhaXQgYmF0Y2hVcGRhdGVGaWVsZHMoc2hlZXRUaXRsZSwgdHJ1ZSwgdXBkYXRlcyk7XG59XG5cbi8vIC0tLS0gQnVsayBkZWxldGUgLS0tLVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYnVsa0RlbGV0ZVRyYW5zYWN0aW9ucyhcbiAgc2hlZXRUaXRsZTogc3RyaW5nLFxuICByb3dzOiBudW1iZXJbXSxcbikge1xuICBhd2FpdCBQcm9taXNlLmFsbChyb3dzLm1hcCgocm93KSA9PiBjbGVhclRyYW5zYWN0aW9uKHNoZWV0VGl0bGUsIHJvdykpKTtcbn1cblxuZXhwb3J0IGNvbnN0IGJ1bGtEZWxldGVWYWNhdGlvblRyYW5zYWN0aW9ucyA9IGJ1bGtEZWxldGVUcmFuc2FjdGlvbnM7XG5cbi8vIC0tLS0gTW92ZSB0byB2YWNhdGlvbiAtLS0tXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBidWxrTW92ZVRvVmFjYXRpb25BY3Rpb24oXG4gIHNvdXJjZVRpdGxlOiBzdHJpbmcsXG4gIGRlc3RUaXRsZTogc3RyaW5nLFxuICByb3dzOiBudW1iZXJbXSxcbiAgdHJhbnNhY3Rpb25zOiBUcmFuc2FjdGlvbklucHV0W10sXG4pIHtcbiAgYXdhaXQgYmF0Y2hJbXBvcnRUcmFuc2FjdGlvbnMoZGVzdFRpdGxlLCB0cmFuc2FjdGlvbnMsIHRydWUpO1xuICBhd2FpdCBQcm9taXNlLmFsbChyb3dzLm1hcCgocm93KSA9PiBjbGVhclRyYW5zYWN0aW9uKHNvdXJjZVRpdGxlLCByb3cpKSk7XG59XG5cbi8vIC0tLS0gQmF0Y2ggaW1wb3J0IC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZFRyYW5zYWN0aW9uc0JhdGNoKFxuICBzaGVldFRpdGxlOiBzdHJpbmcsXG4gIHRyYW5zYWN0aW9uczogVHJhbnNhY3Rpb25JbnB1dFtdLFxuICBpc1ZhY2F0aW9uID0gZmFsc2UsXG4pOiBQcm9taXNlPG51bWJlcj4ge1xuICByZXR1cm4gYmF0Y2hJbXBvcnRUcmFuc2FjdGlvbnMoc2hlZXRUaXRsZSwgdHJhbnNhY3Rpb25zLCBpc1ZhY2F0aW9uKTtcbn1cblxuLy8gLS0tLSBEZWJvdW5jZWQgcmV2YWxpZGF0aW9uIChjYWxsZWQgYnkgY2xpZW50KSAtLS0tXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXZhbGlkYXRlUGFnZUFjdGlvbihwYXRoOiBzdHJpbmcpIHtcbiAgcmV2YWxpZGF0ZVBhdGgocGF0aCk7XG59XG5cbi8vIC0tLS0gU2hlZXQgcmVuYW1lIGFjdGlvbiAtLS0tXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW5hbWVTaGVldEFjdGlvbihzaGVldElkOiBudW1iZXIsIG5ld1RpdGxlOiBzdHJpbmcsIHBhZ2VQYXRoPzogc3RyaW5nKSB7XG4gIGF3YWl0IHJlbmFtZVNoZWV0KHNoZWV0SWQsIG5ld1RpdGxlKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvXCIpO1xuICBpZiAocGFnZVBhdGgpIHJldmFsaWRhdGVQYXRoKHBhZ2VQYXRoKTtcbn1cblxuLyoqIE1vdmUgc2hlZXRJZCB0byBiZSBpbW1lZGlhdGVseSBhZnRlciBhZnRlclNoZWV0SWQgKG9yIHRvIGZpcnN0IHBvc2l0aW9uIGlmIG51bGwpLlxuICogIGFmdGVyU2hlZXRJZCBpcyB0aGUgc2hlZXRJZCBvZiB0aGUgcHJlY2VkaW5nIHNpYmxpbmcgaW4gdGhlIG5ldyBvcmRlci4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtb3ZlU2hlZXRBZnRlckFjdGlvbihzaGVldElkOiBudW1iZXIsIGFmdGVyU2hlZXRJZDogbnVtYmVyIHwgbnVsbCkge1xuICBjb25zdCBhbGxTaGVldHNSYXcgPSBhd2FpdCBsaXN0U2hlZXRzKCk7XG4gIC8vIGxpc3RTaGVldHMgcmV0dXJucyBzaGVldHMgc29ydGVkIGJ5IHRoZWlyIG5hdHVyYWwgb3JkZXIgZnJvbSB0aGUgQVBJXG4gIGxldCB0YXJnZXRJbmRleDogbnVtYmVyO1xuICBpZiAoYWZ0ZXJTaGVldElkID09PSBudWxsKSB7XG4gICAgdGFyZ2V0SW5kZXggPSAwO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGFmdGVyUG9zID0gYWxsU2hlZXRzUmF3LmZpbmRJbmRleCgocykgPT4gcy5zaGVldElkID09PSBhZnRlclNoZWV0SWQpO1xuICAgIHRhcmdldEluZGV4ID0gYWZ0ZXJQb3MgPj0gMCA/IGFmdGVyUG9zICsgMSA6IGFsbFNoZWV0c1Jhdy5sZW5ndGg7XG4gIH1cbiAgYXdhaXQgbW92ZVNoZWV0KHNoZWV0SWQsIHRhcmdldEluZGV4KTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvXCIpO1xufVxuXG4vLyAtLS0tIEF1dG8tY3JlYXRpb24gYWN0aW9uIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGVuc3VyZUN1cnJlbnRTaGVldHNBY3Rpb24oKSB7XG4gIGNvbnN0IHNoZWV0cyA9IGF3YWl0IGxpc3RTaGVldHMoKTtcbiAgY29uc3QgY3JlYXRlZCA9IGF3YWl0IGVuc3VyZUN1cnJlbnRTaGVldHMoc2hlZXRzKTtcbiAgaWYgKGNyZWF0ZWQpIHtcbiAgICByZXZhbGlkYXRlUGF0aChcIi9cIik7XG4gIH1cbiAgcmV0dXJuIGNyZWF0ZWQ7XG59XG5cbi8vIC0tLS0gQnVsayB0ZW50YXRpdmUgdG9nZ2xlIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJ1bGtUb2dnbGVUZW50YXRpdmUoXG4gIHNoZWV0VGl0bGU6IHN0cmluZyxcbiAgcm93czogbnVtYmVyW10sXG4gIHRlbnRhdGl2ZTogYm9vbGVhbixcbikge1xuICBhd2FpdCBiYXRjaFRvZ2dsZVRlbnRhdGl2ZUZsYWcoc2hlZXRUaXRsZSwgcm93cywgdGVudGF0aXZlKTtcbn1cblxuZXhwb3J0IGNvbnN0IGJ1bGtUb2dnbGVWYWNhdGlvblRlbnRhdGl2ZSA9IGJ1bGtUb2dnbGVUZW50YXRpdmU7XG5cbi8vIC0tLS0gTW9udGggZG9uZSB0b2dnbGUgLS0tLVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdG9nZ2xlTW9udGhEb25lQWN0aW9uKHNoZWV0VGl0bGU6IHN0cmluZywgZG9uZTogYm9vbGVhbikge1xuICBhd2FpdCBzZXRNb250aERvbmUoc2hlZXRUaXRsZSwgZG9uZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL1wiKTtcbn1cblxuLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vLyBTdG9jayBzZXR0aW5ncyBhY3Rpb25zXG4vLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZFN0b2NrKFxuICBzeW1ib2w6IHN0cmluZyxcbiAgZGlzcGxheU5hbWU6IHN0cmluZyxcbiAgc291cmNlOiBQcmljZVNvdXJjZSxcbiAgY3VycmVuY3k6IFN0b2NrQ3VycmVuY3ksXG4gIGxhYmVsOiBzdHJpbmcgPSBcIlwiLFxuKSB7XG4gIGF3YWl0IGFkZFN0b2NrRGVmaW5pdGlvbihzeW1ib2wsIGRpc3BsYXlOYW1lLCBzb3VyY2UsIGN1cnJlbmN5LCBsYWJlbCk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlU3RvY2soXG4gIG9sZFN5bWJvbDogc3RyaW5nLFxuICBzeW1ib2w6IHN0cmluZyxcbiAgZGlzcGxheU5hbWU6IHN0cmluZyxcbiAgc291cmNlOiBQcmljZVNvdXJjZSxcbiAgY3VycmVuY3k6IFN0b2NrQ3VycmVuY3ksXG4gIGxhYmVsOiBzdHJpbmcgPSBcIlwiLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZVN0b2NrRGVmaW5pdGlvbihvbGRTeW1ib2wsIHN5bWJvbCwgZGlzcGxheU5hbWUsIHNvdXJjZSwgY3VycmVuY3ksIGxhYmVsKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW1vdmVTdG9jayhzeW1ib2w6IHN0cmluZykge1xuICBhd2FpdCByZW1vdmVTdG9ja0RlZmluaXRpb24oc3ltYm9sKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRCcm9rZXIoXG4gIG5hbWU6IHN0cmluZyxcbiAgbWdtdEZlZTogbnVtYmVyLFxuICBwdXJjaGFzZUZlZTogbnVtYmVyLFxuKSB7XG4gIGF3YWl0IGFkZEJyb2tlckNvbmZpZyhuYW1lLCBtZ210RmVlLCBwdXJjaGFzZUZlZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlQnJva2VyKFxuICBvbGROYW1lOiBzdHJpbmcsXG4gIG5hbWU6IHN0cmluZyxcbiAgbWdtdEZlZTogbnVtYmVyLFxuICBwdXJjaGFzZUZlZTogbnVtYmVyLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZUJyb2tlckNvbmZpZyhvbGROYW1lLCBuYW1lLCBtZ210RmVlLCBwdXJjaGFzZUZlZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVtb3ZlQnJva2VyKG5hbWU6IHN0cmluZykge1xuICBhd2FpdCByZW1vdmVCcm9rZXJDb25maWcobmFtZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYWRkR29hbChcbiAgdGVybTogSW52ZXN0bWVudFRlcm0sXG4gIGxhYmVsOiBzdHJpbmcsXG4gIHRhcmdldEFtb3VudDogbnVtYmVyLFxuKSB7XG4gIGF3YWl0IGFkZFN0b2NrR29hbCh0ZXJtLCBsYWJlbCwgdGFyZ2V0QW1vdW50KTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVHb2FsKFxuICBvbGRMYWJlbDogc3RyaW5nLFxuICB0ZXJtOiBJbnZlc3RtZW50VGVybSxcbiAgbGFiZWw6IHN0cmluZyxcbiAgdGFyZ2V0QW1vdW50OiBudW1iZXIsXG4pIHtcbiAgYXdhaXQgdXBkYXRlU3RvY2tHb2FsKG9sZExhYmVsLCB0ZXJtLCBsYWJlbCwgdGFyZ2V0QW1vdW50KTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW1vdmVHb2FsKGxhYmVsOiBzdHJpbmcpIHtcbiAgYXdhaXQgcmVtb3ZlU3RvY2tHb2FsKGxhYmVsKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbi8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gTGFiZWwgYWxsb2NhdGlvbiBhY3Rpb25zXG4vLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNhdmVMYWJlbEFsbG9jYXRpb25zQWN0aW9uKFxuICBhbGxvY2F0aW9uczogTGFiZWxBbGxvY2F0aW9uW10sXG4pIHtcbiAgYXdhaXQgc2F2ZUxhYmVsQWxsb2NhdGlvbnMoYWxsb2NhdGlvbnMpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zdG9ja3NcIik7XG59XG5cbi8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gU3RvY2sgdHJhbnNhY3Rpb24gYWN0aW9uc1xuLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRTdG9ja1RyYW5zYWN0aW9uQWN0aW9uKFxuICBkYXRlOiBzdHJpbmcsXG4gIHR5cGU6IFRyYW5zYWN0aW9uVHlwZSxcbiAgc3ltYm9sOiBzdHJpbmcsXG4gIHF1YW50aXR5OiBudW1iZXIsXG4gIHByaWNlUGVyVW5pdElMUzogbnVtYmVyLFxuICBjdXJyZW5jeTogU3RvY2tDdXJyZW5jeSxcbiAgdGVybTogSW52ZXN0bWVudFRlcm0sXG4gIGJhbms6IHN0cmluZyxcbiAgcHVyY2hhc2VGZWU6IG51bWJlcixcbiAgbm90ZXM6IHN0cmluZyxcbik6IFByb21pc2U8bnVtYmVyPiB7XG4gIGNvbnN0IHJvdyA9IGF3YWl0IGFkZFN0b2NrVHgoXG4gICAgZGF0ZSxcbiAgICB0eXBlLFxuICAgIHN5bWJvbCxcbiAgICBxdWFudGl0eSxcbiAgICBwcmljZVBlclVuaXRJTFMsXG4gICAgY3VycmVuY3ksXG4gICAgdGVybSxcbiAgICBiYW5rLFxuICAgIHB1cmNoYXNlRmVlLFxuICAgIG5vdGVzLFxuICApO1xuICByZXZhbGlkYXRlUGF0aChcIi9zdG9ja3NcIik7XG4gIHJldHVybiByb3c7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBlZGl0U3RvY2tUcmFuc2FjdGlvbkFjdGlvbihcbiAgcm93OiBudW1iZXIsXG4gIGRhdGU6IHN0cmluZyxcbiAgdHlwZTogVHJhbnNhY3Rpb25UeXBlLFxuICBzeW1ib2w6IHN0cmluZyxcbiAgcXVhbnRpdHk6IG51bWJlcixcbiAgcHJpY2VQZXJVbml0SUxTOiBudW1iZXIsXG4gIGN1cnJlbmN5OiBTdG9ja0N1cnJlbmN5LFxuICB0ZXJtOiBJbnZlc3RtZW50VGVybSxcbiAgYmFuazogc3RyaW5nLFxuICBwdXJjaGFzZUZlZTogbnVtYmVyLFxuICBub3Rlczogc3RyaW5nLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZVN0b2NrVHgoXG4gICAgcm93LFxuICAgIGRhdGUsXG4gICAgdHlwZSxcbiAgICBzeW1ib2wsXG4gICAgcXVhbnRpdHksXG4gICAgcHJpY2VQZXJVbml0SUxTLFxuICAgIGN1cnJlbmN5LFxuICAgIHRlcm0sXG4gICAgYmFuayxcbiAgICBwdXJjaGFzZUZlZSxcbiAgICBub3RlcyxcbiAgKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc3RvY2tzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlU3RvY2tUcmFuc2FjdGlvbkFjdGlvbihyb3c6IG51bWJlcikge1xuICBhd2FpdCBkZWxldGVTdG9ja1R4KHJvdyk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3N0b2Nrc1wiKTtcbn1cblxuLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vLyBQb3J0Zm9saW8gaGlzdG9yeSBhY3Rpb25cbi8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0UG9ydGZvbGlvSGlzdG9yeUFjdGlvbihcbiAgcmFuZ2U6IENoYXJ0UmFuZ2UsXG4gIHRlcm0/OiBJbnZlc3RtZW50VGVybSxcbik6IFByb21pc2U8UG9ydGZvbGlvSGlzdG9yeVBvaW50W10+IHtcbiAgY29uc3QgeyBnZXRQb3J0Zm9saW9IaXN0b3J5IH0gPSBhd2FpdCBpbXBvcnQoXCIuL3N0b2NrLWRhc2hib2FyZFwiKTtcbiAgcmV0dXJuIGdldFBvcnRmb2xpb0hpc3RvcnkocmFuZ2UsIHsgdGVybSB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFBvcnRmb2xpb1JldHVybnNBY3Rpb24oXG4gIHRlcm0/OiBJbnZlc3RtZW50VGVybSxcbik6IFByb21pc2U8UG9ydGZvbGlvUmV0dXJucz4ge1xuICBjb25zdCB7IGdldFBvcnRmb2xpb0hpc3RvcnksIGNvbXB1dGVQb3J0Zm9saW9SZXR1cm5zIH0gPSBhd2FpdCBpbXBvcnQoXCIuL3N0b2NrLWRhc2hib2FyZFwiKTtcbiAgY29uc3QgeyBnZXRTdG9ja0NvbmZpZywgc2F2ZVllYXJSZXR1cm5zIH0gPSBhd2FpdCBpbXBvcnQoXCIuL2dvb2dsZS1zaGVldHNcIik7XG5cbiAgY29uc3QgY29uZmlnID0gYXdhaXQgZ2V0U3RvY2tDb25maWcoKTtcbiAgY29uc3QgeyBzYXZlZFllYXJSZXR1cm5zIH0gPSBjb25maWc7XG5cbiAgLy8gT3B0aW1hbCBmZXRjaCBzdGFydDogY292ZXIgcm9sbGluZyAzeXIgcGVyaW9kcyBBTkQgYWxsIHVuY2FjaGVkIGNvbXBsZXRlIHllYXJzLlxuICAvLyBJZiBhbGwgeWVhcnMgdXAgdG8gKGN1cnJlbnRZZWFyLTEpIGFyZSBjYWNoZWQsIG9ubHkgZmV0Y2ggM3lyIG9mIGRhdGEuXG4gIGNvbnN0IGN1cnJlbnRZZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICBjb25zdCB0aHJlZVllYXJzQWdvRGF0ZSA9IG5ldyBEYXRlKCk7XG4gIHRocmVlWWVhcnNBZ29EYXRlLnNldEZ1bGxZZWFyKHRocmVlWWVhcnNBZ29EYXRlLmdldEZ1bGxZZWFyKCkgLSAzKTtcbiAgY29uc3QgdGhyZWVZZWFyc0FnbyA9IHRocmVlWWVhcnNBZ29EYXRlLnRvSVNPU3RyaW5nKCkuc3BsaXQoXCJUXCIpWzBdO1xuXG4gIC8vIEZpbmQgdGhlIGVhcmxpZXN0IGNvbXBsZXRlIHllYXIgbm90IHlldCBjYWNoZWRcbiAgbGV0IGVhcmxpZXN0VW5jYWNoZWRZZWFyOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgLy8gV2UgbG9vayBmcm9tIGEgcmVhc29uYWJsZSBtaW5pbXVtICgyMDE1KSB0byBhdm9pZCBmZXRjaGluZyB0b28gZmFyIGJhY2tcbiAgZm9yIChsZXQgeSA9IDIwMTU7IHkgPCBjdXJyZW50WWVhcjsgeSsrKSB7XG4gICAgaWYgKCEoeSBpbiBzYXZlZFllYXJSZXR1cm5zKSkge1xuICAgICAgZWFybGllc3RVbmNhY2hlZFllYXIgPSB5O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLy8gU3RhcnQgZGF0ZTogZWFybGllciBvZiAoM3lyIGFnbykgYW5kIChKYW4gMSBvZiBlYXJsaWVzdCB1bmNhY2hlZCB5ZWFyKVxuICBsZXQgc3RhcnREYXRlID0gdGhyZWVZZWFyc0FnbztcbiAgaWYgKGVhcmxpZXN0VW5jYWNoZWRZZWFyICE9PSBudWxsKSB7XG4gICAgY29uc3QgdW5jYWNoZWRTdGFydCA9IGAke2VhcmxpZXN0VW5jYWNoZWRZZWFyfS0wMS0wMWA7XG4gICAgaWYgKHVuY2FjaGVkU3RhcnQgPCBzdGFydERhdGUpIHN0YXJ0RGF0ZSA9IHVuY2FjaGVkU3RhcnQ7XG4gIH1cblxuICBjb25zdCBoaXN0b3J5ID0gYXdhaXQgZ2V0UG9ydGZvbGlvSGlzdG9yeShcIk1heFwiLCB7XG4gICAgZG93bnNhbXBsZTogZmFsc2UsXG4gICAgdGVybSxcbiAgICBzdGFydERhdGVPdmVycmlkZTogc3RhcnREYXRlLFxuICB9KTtcblxuICBjb25zdCByZXR1cm5zID0gY29tcHV0ZVBvcnRmb2xpb1JldHVybnMoaGlzdG9yeSwgc2F2ZWRZZWFyUmV0dXJucyk7XG5cbiAgLy8gU2F2ZSBuZXdseSBjb21wdXRlZCBjb21wbGV0ZSB5ZWFycyDigJQgb25seSBpZiB3ZSBoYXZlIGhpZ2gtY29uZmlkZW5jZSBkYXRhLlxuICAvLyBBIHllYXIgcXVhbGlmaWVzIHdoZW46XG4gIC8vIDEuIE5vdCBhbHJlYWR5IGNhY2hlZCAobmV2ZXIgb3ZlcndyaXRlIGV4aXN0aW5nKVxuICAvLyAyLiBDb21wdXRlZCByZXR1cm4gaXMgbm9uLW51bGxcbiAgLy8gMy4gSGlzdG9yeSBoYXMg4omlMjAwIHBvaW50cyB3aXRoaW4gdGhhdCB5ZWFyIChuZWFybHkgYWxsIHRyYWRpbmcgZGF5cylcbiAgLy8gNC4gSGlzdG9yeSBjb3ZlcnMgSmFuIDHigJMxNSBBTkQgTm92IDHigJNEZWMgMzEgb2YgdGhhdCB5ZWFyIChmdWxsIHllYXIgZmV0Y2hlZClcbiAgY29uc3QgbmV3RW50cmllczogUmVjb3JkPG51bWJlciwgbnVtYmVyPiA9IHt9O1xuICBmb3IgKGNvbnN0IHsgeWVhciwgcmV0dXJuUGVyY2VudCB9IG9mIHJldHVybnMuYW5udWFsKSB7XG4gICAgaWYgKHJldHVyblBlcmNlbnQgPT09IG51bGwpIGNvbnRpbnVlO1xuICAgIGlmICh5ZWFyIGluIHNhdmVkWWVhclJldHVybnMpIGNvbnRpbnVlOyAvLyBuZXZlciBvdmVyd3JpdGVcblxuICAgIC8vIENvdW50IHBvaW50cyBhbmQgY2hlY2sgY292ZXJhZ2VcbiAgICBjb25zdCB5ZWFyUG9pbnRzID0gaGlzdG9yeS5maWx0ZXIoKHApID0+IHAuZGF0ZS5zdGFydHNXaXRoKGAke3llYXJ9LWApKTtcbiAgICBpZiAoeWVhclBvaW50cy5sZW5ndGggPCAyMDApIGNvbnRpbnVlO1xuXG4gICAgY29uc3QgZmlyc3QgPSB5ZWFyUG9pbnRzWzBdLmRhdGU7XG4gICAgY29uc3QgbGFzdCA9IHllYXJQb2ludHNbeWVhclBvaW50cy5sZW5ndGggLSAxXS5kYXRlO1xuICAgIGNvbnN0IGNvdmVyc1N0YXJ0ID0gZmlyc3QgPD0gYCR7eWVhcn0tMDEtMTVgO1xuICAgIGNvbnN0IGNvdmVyc0VuZCA9IGxhc3QgPj0gYCR7eWVhcn0tMTEtMDFgO1xuICAgIGlmICghY292ZXJzU3RhcnQgfHwgIWNvdmVyc0VuZCkgY29udGludWU7XG5cbiAgICBuZXdFbnRyaWVzW3llYXJdID0gcmV0dXJuUGVyY2VudDtcbiAgfVxuXG4gIGlmIChPYmplY3Qua2V5cyhuZXdFbnRyaWVzKS5sZW5ndGggPiAwKSB7XG4gICAgYXdhaXQgc2F2ZVllYXJSZXR1cm5zKHsgLi4uc2F2ZWRZZWFyUmV0dXJucywgLi4ubmV3RW50cmllcyB9KTtcbiAgfVxuXG4gIHJldHVybiByZXR1cm5zO1xufVxuXG4vLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIE5WSURJQSBSU1UgYWN0aW9uc1xuLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbi8qKlxuICogQWRkIGFuIFJTVSBncmFudCB3aXRoIGF1dG8tZ2VuZXJhdGVkIHZlc3Qgcm93cyAoNy1jb2x1bW4gZm9ybWF0KS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZFJzdUdyYW50QWN0aW9uKFxuICBncmFudERhdGU6IHN0cmluZyxcbiAgdG90YWxTaGFyZXM6IG51bWJlcixcbiAgY29zdFBlclNoYXJlOiBudW1iZXIsXG4gIHZlc3RzOiB7IHZlc3REYXRlOiBzdHJpbmc7IHNoYXJlczogbnVtYmVyIH1bXSxcbiAgZ3JhbnROYW1lOiBzdHJpbmcgPSBcIlwiLFxuKSB7XG4gIGlmICh2ZXN0cy5sZW5ndGggPT09IDApIHJldHVybjtcblxuICBjb25zdCByb3dzOiBzdHJpbmdbXVtdID0gdmVzdHMubWFwKCh2KSA9PiBbXG4gICAgZ3JhbnREYXRlLFxuICAgIFN0cmluZyh0b3RhbFNoYXJlcyksXG4gICAgdi52ZXN0RGF0ZSxcbiAgICBTdHJpbmcodi5zaGFyZXMpLFxuICAgIGNvc3RQZXJTaGFyZSA+IDAgPyBTdHJpbmcoY29zdFBlclNoYXJlKSA6IFwiXCIsXG4gICAgXCJcIiwgLy8gbm90ZXNcbiAgICBncmFudE5hbWUsXG4gICAgXCJcIiwgLy8gbm90IHNvbGRcbiAgXSk7XG5cbiAgYXdhaXQgYWRkUnN1VmVzdFJvd3Mocm93cyk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL252aWRpYVwiKTtcbn1cblxuLyoqXG4gKiBVcGRhdGUgYW4gUlNVIHZlc3Qgcm93ICg3LWNvbHVtbiBmb3JtYXQpLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlUnN1VmVzdEFjdGlvbihcbiAgcm93OiBudW1iZXIsXG4gIGdyYW50RGF0ZTogc3RyaW5nLFxuICB0b3RhbFNoYXJlc0luR3JhbnQ6IG51bWJlcixcbiAgdmVzdERhdGU6IHN0cmluZyxcbiAgc2hhcmVzOiBudW1iZXIsXG4gIHZlc3RQcmljZVVzZDogbnVtYmVyLFxuICBub3Rlczogc3RyaW5nID0gXCJcIixcbiAgZ3JhbnROYW1lOiBzdHJpbmcgPSBcIlwiLFxuICBzb2xkOiBib29sZWFuID0gZmFsc2UsXG4pIHtcbiAgYXdhaXQgdXBkYXRlUnN1Um93KHJvdywgW1xuICAgIGdyYW50RGF0ZSxcbiAgICBTdHJpbmcodG90YWxTaGFyZXNJbkdyYW50KSxcbiAgICB2ZXN0RGF0ZSxcbiAgICBTdHJpbmcoc2hhcmVzKSxcbiAgICB2ZXN0UHJpY2VVc2QgPyBTdHJpbmcodmVzdFByaWNlVXNkKSA6IFwiXCIsXG4gICAgbm90ZXMsXG4gICAgZ3JhbnROYW1lLFxuICAgIHNvbGQgPyBcIlRSVUVcIiA6IFwiXCIsXG4gIF0pO1xuICByZXZhbGlkYXRlUGF0aChcIi9udmlkaWFcIik7XG59XG5cbi8qKlxuICogVG9nZ2xlIHRoZSBzb2xkIGZsYWcgb24gYW4gUlNVIHZlc3Qgcm93LlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdG9nZ2xlUnN1U29sZEFjdGlvbihyb3c6IG51bWJlciwgc29sZDogYm9vbGVhbikge1xuICBhd2FpdCB0b2dnbGVSc3VTb2xkKHJvdywgc29sZCk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL252aWRpYVwiKTtcbn1cblxuLyoqXG4gKiBEZWxldGUgYW4gUlNVIHJvdy5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVJzdVJvd0FjdGlvbihyb3c6IG51bWJlcikge1xuICBhd2FpdCBkZWxldGVSc3VSb3cocm93KTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvbnZpZGlhXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2V0UnN1R3Jvc3NEYXRhQWN0aW9uKGdyb3NzU29GYXI6IG51bWJlciwgbW9udGhseVNhbGFyeTogbnVtYmVyLCBlc3BwTW9udGhseUNvbnRyaWJ1dGlvbjogbnVtYmVyLCBlc3BwUHVyY2hhc2VQcmljZTogbnVtYmVyKSB7XG4gIGF3YWl0IHNldFJzdUdyb3NzRGF0YShncm9zc1NvRmFyLCBtb250aGx5U2FsYXJ5LCBlc3BwTW9udGhseUNvbnRyaWJ1dGlvbiwgZXNwcFB1cmNoYXNlUHJpY2UpO1xuICByZXZhbGlkYXRlUGF0aChcIi9udmlkaWFcIik7XG59XG5cbi8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gUGVuc2lvbiBhY3Rpb25zXG4vLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFBlbnNpb25EYXRhKCkge1xuICBhd2FpdCBlbnN1cmVQZW5zaW9uU2hlZXQoKTtcbiAgY29uc3QgZnVuZHMgPSBhd2FpdCBnZXRQZW5zaW9uRnVuZHMoKTtcbiAgcmV0dXJuIHsgZnVuZHMgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZFBlbnNpb25GdW5kQWN0aW9uKFxuICBvd25lcjogUGVuc2lvbk93bmVyLFxuICBuYW1lOiBzdHJpbmcsXG4gIHR5cGU6IFBlbnNpb25GdW5kVHlwZSxcbiAgdHJhY2s6IHN0cmluZyxcbiAgYmFsYW5jZTogbnVtYmVyLFxuICBjb21wYW55OiBzdHJpbmcsXG4pIHtcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5zcGxpdChcIlRcIilbMF07XG4gIGF3YWl0IGFkZFBlbnNpb25GdW5kKG93bmVyLCBuYW1lLCB0eXBlLCB0cmFjaywgYmFsYW5jZSwgZGF0ZSwgY29tcGFueSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3BlbnNpb25cIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVQZW5zaW9uRnVuZEFjdGlvbihcbiAgcm93OiBudW1iZXIsXG4gIG93bmVyOiBQZW5zaW9uT3duZXIsXG4gIG5hbWU6IHN0cmluZyxcbiAgdHlwZTogUGVuc2lvbkZ1bmRUeXBlLFxuICB0cmFjazogc3RyaW5nLFxuICBiYWxhbmNlOiBudW1iZXIsXG4gIGNvbXBhbnk6IHN0cmluZyxcbikge1xuICBjb25zdCBkYXRlID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnNwbGl0KFwiVFwiKVswXTtcbiAgYXdhaXQgdXBkYXRlUGVuc2lvbkZ1bmQocm93LCBvd25lciwgbmFtZSwgdHlwZSwgdHJhY2ssIGJhbGFuY2UsIGRhdGUsIGNvbXBhbnkpO1xuICByZXZhbGlkYXRlUGF0aChcIi9wZW5zaW9uXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlUGVuc2lvbkZ1bmRBY3Rpb24ocm93OiBudW1iZXIpIHtcbiAgYXdhaXQgZGVsZXRlUGVuc2lvbkZ1bmQocm93KTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvcGVuc2lvblwiKTtcbn1cblxuLyoqXG4gKiBTZWFyY2ggZXhwZW5zZSBuYW1lcyBhY3Jvc3MgYWxsIG1vbnRobHkgKyB2YWNhdGlvbiBzaGVldHMuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZWFyY2hBbGxTaGVldHNBY3Rpb24ocXVlcnk6IHN0cmluZykge1xuICBpZiAoIXF1ZXJ5IHx8IHF1ZXJ5LnRyaW0oKS5sZW5ndGggPCAyKSByZXR1cm4gW107XG5cbiAgY29uc3QgYWxsU2hlZXRzID0gYXdhaXQgbGlzdFNoZWV0cygpO1xuICBjb25zdCBzZWFyY2hhYmxlID0gYWxsU2hlZXRzLmZpbHRlcihcbiAgICAocykgPT4gcy50eXBlID09PSBcIm1vbnRobHlcIiB8fCBzLnR5cGUgPT09IFwidmFjYXRpb25cIixcbiAgKTtcblxuICBjb25zdCB7IHNlYXJjaEFsbFNoZWV0cyB9ID0gYXdhaXQgaW1wb3J0KFwiLi9nb29nbGUtc2hlZXRzXCIpO1xuICByZXR1cm4gc2VhcmNoQWxsU2hlZXRzKHF1ZXJ5LnRyaW0oKSwgc2VhcmNoYWJsZSk7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6InFTQXVic0IsZ01BQUEifQ==
}),
"[project]/dev/mezumani/src/lib/data:f171e7 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createVacation",
    ()=>$$RSC_SERVER_ACTION_31
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"608979807d23f4a95daa853be05c27317bf2a909bc":"createVacation"},"dev/mezumani/src/lib/actions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("608979807d23f4a95daa853be05c27317bf2a909bc", __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "createVacation");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzZXJ2ZXJcIjtcblxuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tIFwibmV4dC9jYWNoZVwiO1xuaW1wb3J0IHtcbiAgYXBwZW5kVHJhbnNhY3Rpb24sXG4gIHVwZGF0ZVRyYW5zYWN0aW9uLFxuICBjbGVhclRyYW5zYWN0aW9uLFxuICBjcmVhdGVNb250aFNoZWV0LFxuICBhZGRDb25maWdJdGVtLFxuICByZW1vdmVDb25maWdJdGVtLFxuICBhZGRDYXRlZ29yeUNvbmZpZ0l0ZW0sXG4gIHJlbW92ZUNhdGVnb3J5Q29uZmlnSXRlbSxcbiAgcmVuYW1lQ2F0ZWdvcnlJblNoZWV0cyxcbiAgcmVuYW1lU2hlZXQsXG4gIG1vdmVTaGVldCxcbiAgY3JlYXRlVmFjYXRpb25TaGVldCxcbiAgZW5zdXJlQ3VycmVudFNoZWV0cyxcbiAgbGlzdFNoZWV0cyxcbiAgYWRkU3VtbWFyeUNhcmRJdGVtLFxuICByZW1vdmVTdW1tYXJ5Q2FyZEl0ZW0sXG4gIHVwZGF0ZVN1bW1hcnlDYXJkSXRlbSxcbiAgYWRkUmVjdXJyaW5nRXhwZW5zZSxcbiAgdXBkYXRlUmVjdXJyaW5nRXhwZW5zZSxcbiAgcmVtb3ZlUmVjdXJyaW5nRXhwZW5zZSxcbiAgcmVvcmRlclJlY3VycmluZ0V4cGVuc2VzLFxuICByZW9yZGVyU3VtbWFyeUNhcmRzIGFzIHJlb3JkZXJTdW1tYXJ5Q2FyZHNHUyxcbiAgYmF0Y2hJbXBvcnRUcmFuc2FjdGlvbnMsXG4gIGFkZENhdGVnb3J5TWFwcGluZyxcbiAgdXBkYXRlQ2F0ZWdvcnlNYXBwaW5nLFxuICByZW1vdmVDYXRlZ29yeU1hcHBpbmcsXG4gIGFkZEV4cGVuc2VSZW5hbWVSdWxlLFxuICB1cGRhdGVFeHBlbnNlUmVuYW1lUnVsZSxcbiAgcmVtb3ZlRXhwZW5zZVJlbmFtZVJ1bGUsXG4gIGJhdGNoVXBkYXRlRmllbGRzLFxuICBiYXRjaFRvZ2dsZVRlbnRhdGl2ZUZsYWcsXG4gIHNldE1vbnRoRG9uZSxcbiAgYWRkSW5jb21lU291cmNlLFxuICB1cGRhdGVJbmNvbWVTb3VyY2UsXG4gIHJlbW92ZUluY29tZVNvdXJjZSxcbiAgdXBkYXRlTW9udGhJbmNvbWUsXG4gIHVwZGF0ZU1vbnRoQWxsb2NhdGlvbnMsXG4gIGFkZFN0b2NrRGVmaW5pdGlvbixcbiAgdXBkYXRlU3RvY2tEZWZpbml0aW9uLFxuICByZW1vdmVTdG9ja0RlZmluaXRpb24sXG4gIGFkZEJyb2tlckNvbmZpZyxcbiAgdXBkYXRlQnJva2VyQ29uZmlnLFxuICByZW1vdmVCcm9rZXJDb25maWcsXG4gIGFkZFN0b2NrR29hbCxcbiAgdXBkYXRlU3RvY2tHb2FsLFxuICByZW1vdmVTdG9ja0dvYWwsXG4gIGFkZFN0b2NrVHJhbnNhY3Rpb24gYXMgYWRkU3RvY2tUeCxcbiAgdXBkYXRlU3RvY2tUcmFuc2FjdGlvbiBhcyB1cGRhdGVTdG9ja1R4LFxuICBkZWxldGVTdG9ja1RyYW5zYWN0aW9uIGFzIGRlbGV0ZVN0b2NrVHgsXG4gIHNhdmVMYWJlbEFsbG9jYXRpb25zLFxuICBhZGRSc3VWZXN0Um93cyxcbiAgdXBkYXRlUnN1Um93LFxuICBkZWxldGVSc3VSb3csXG4gIHRvZ2dsZVJzdVNvbGQsXG4gIHNldFJzdUdyb3NzRGF0YSxcbiAgc2V0QW5udWFsU2F2aW5nc0dvYWwsXG4gIHNldEFubnVhbEdvYWxGb3JZZWFyLFxuICBzZXRJcnJlZ3VsYXJFeHBlbnNlQ2F0ZWdvcmllc0ZvclllYXIsXG59IGZyb20gXCIuL2dvb2dsZS1zaGVldHNcIjtcbmltcG9ydCB7IEhFQlJFV19NT05USFMgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbmltcG9ydCB7XG4gIGVuc3VyZVBlbnNpb25TaGVldCxcbiAgZ2V0UGVuc2lvbkZ1bmRzLFxuICBhZGRQZW5zaW9uRnVuZCxcbiAgdXBkYXRlUGVuc2lvbkZ1bmQsXG4gIGRlbGV0ZVBlbnNpb25GdW5kLFxufSBmcm9tIFwiLi9wZW5zaW9uLXNoZWV0c1wiO1xuaW1wb3J0IHR5cGUge1xuICBUcmFuc2FjdGlvbklucHV0LFxuICBSZWN1cnJpbmdFeHBlbnNlLFxuICBTdW1tYXJ5Q2FyZCxcbiAgSW5jb21lU291cmNlLFxuICBNb250aEFsbG9jYXRpb24sXG4gIExhYmVsQWxsb2NhdGlvbixcbiAgUHJpY2VTb3VyY2UsXG4gIFN0b2NrQ3VycmVuY3ksXG4gIEludmVzdG1lbnRUZXJtLFxuICBUcmFuc2FjdGlvblR5cGUsXG4gIENoYXJ0UmFuZ2UsXG4gIFBvcnRmb2xpb0hpc3RvcnlQb2ludCxcbiAgUG9ydGZvbGlvUmV0dXJucyxcbiAgUGVuc2lvbk93bmVyLFxuICBQZW5zaW9uRnVuZFR5cGUsXG59IGZyb20gXCIuL3R5cGVzXCI7XG5cbmZ1bmN0aW9uIGJ1aWxkVHJhbnNhY3Rpb25WYWx1ZXMoZGF0YTogVHJhbnNhY3Rpb25JbnB1dCwgaXNWYWNhdGlvbiA9IGZhbHNlKSB7XG4gIGNvbnN0IGFtb3VudCA9IGRhdGEudGVudGF0aXZlID8gXCJcIiA6IFN0cmluZyhkYXRhLmFtb3VudCk7XG4gIGNvbnN0IHRlbnRhdGl2ZUFtb3VudCA9IGRhdGEudGVudGF0aXZlID8gU3RyaW5nKGRhdGEuYW1vdW50KSA6IFwiXCI7XG4gIGlmIChpc1ZhY2F0aW9uKSB7XG4gICAgLy8gVmFjYXRpb24gY29sdW1uczogRD1jYXJkLCBFPWNhdGVnb3J5IChzd2FwcGVkIHZzIG1vbnRobHkpXG4gICAgcmV0dXJuIFtkYXRhLmRhdGUsIGRhdGEuZXhwZW5zZSwgYW1vdW50LCBkYXRhLmNhcmQsIGRhdGEuY2F0ZWdvcnksIHRlbnRhdGl2ZUFtb3VudF07XG4gIH1cbiAgcmV0dXJuIFtkYXRhLmRhdGUsIGRhdGEuZXhwZW5zZSwgYW1vdW50LCBkYXRhLmNhdGVnb3J5LCBkYXRhLmNhcmQsIHRlbnRhdGl2ZUFtb3VudF07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRUcmFuc2FjdGlvbihcbiAgc2hlZXRUaXRsZTogc3RyaW5nLFxuICBkYXRhOiBUcmFuc2FjdGlvbklucHV0LFxuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgcmV0dXJuIGFwcGVuZFRyYW5zYWN0aW9uKHNoZWV0VGl0bGUsIGJ1aWxkVHJhbnNhY3Rpb25WYWx1ZXMoZGF0YSkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZWRpdFRyYW5zYWN0aW9uKFxuICBzaGVldFRpdGxlOiBzdHJpbmcsXG4gIHJvdzogbnVtYmVyLFxuICBkYXRhOiBUcmFuc2FjdGlvbklucHV0LFxuKSB7XG4gIGF3YWl0IHVwZGF0ZVRyYW5zYWN0aW9uKHNoZWV0VGl0bGUsIHJvdywgYnVpbGRUcmFuc2FjdGlvblZhbHVlcyhkYXRhKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVUcmFuc2FjdGlvbihzaGVldFRpdGxlOiBzdHJpbmcsIHJvdzogbnVtYmVyKSB7XG4gIGF3YWl0IGNsZWFyVHJhbnNhY3Rpb24oc2hlZXRUaXRsZSwgcm93KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZU1vbnRoKG1vbnRoSW5kZXg6IG51bWJlciwgeWVhclN1ZmZpeDogbnVtYmVyKSB7XG4gIGF3YWl0IGNyZWF0ZU1vbnRoU2hlZXQoSEVCUkVXX01PTlRIU1ttb250aEluZGV4XSwgeWVhclN1ZmZpeCk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL1wiKTtcbn1cblxuLy8gLS0tLSBTZXR0aW5ncyBhY3Rpb25zIC0tLS1cblxuY29uc3QgQ09MVU1OX01BUCA9IHtcbiAgbW9udGhseTogXCJBXCIgYXMgY29uc3QsXG4gIHZhY2F0aW9uOiBcIkJcIiBhcyBjb25zdCxcbn07XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRDYXRlZ29yeShcbiAgdHlwZTogXCJtb250aGx5XCIgfCBcInZhY2F0aW9uXCIsXG4gIG5hbWU6IHN0cmluZyxcbiAgY29sb3I6IHN0cmluZyxcbikge1xuICBhd2FpdCBhZGRDYXRlZ29yeUNvbmZpZ0l0ZW0oQ09MVU1OX01BUFt0eXBlXSwgbmFtZSwgY29sb3IpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbW92ZUNhdGVnb3J5KFxuICB0eXBlOiBcIm1vbnRobHlcIiB8IFwidmFjYXRpb25cIixcbiAgbmFtZTogc3RyaW5nLFxuKSB7XG4gIGF3YWl0IHJlbW92ZUNhdGVnb3J5Q29uZmlnSXRlbShDT0xVTU5fTUFQW3R5cGVdLCBuYW1lKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW5hbWVDYXRlZ29yeShcbiAgdHlwZTogXCJtb250aGx5XCIgfCBcInZhY2F0aW9uXCIsXG4gIG9sZE5hbWU6IHN0cmluZyxcbiAgbmV3TmFtZTogc3RyaW5nLFxuKSB7XG4gIGF3YWl0IHJlbmFtZUNhdGVnb3J5SW5TaGVldHMoQ09MVU1OX01BUFt0eXBlXSwgb2xkTmFtZSwgbmV3TmFtZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xuICByZXZhbGlkYXRlUGF0aChcIi9cIik7XG59XG5cbmNvbnN0IENBUkRfQ09MVU1OX01BUCA9IHtcbiAgZWlub3I6IFwiQ1wiIGFzIGNvbnN0LFxuICB6aXY6IFwiRFwiIGFzIGNvbnN0LFxuICBzaGFyZWQ6IFwiRVwiIGFzIGNvbnN0LFxufTtcblxuZXhwb3J0IHR5cGUgQ2FyZE93bmVyID0gXCJlaW5vclwiIHwgXCJ6aXZcIiB8IFwic2hhcmVkXCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRDYXJkKG93bmVyOiBDYXJkT3duZXIsIG5hbWU6IHN0cmluZykge1xuICBhd2FpdCBhZGRDb25maWdJdGVtKENBUkRfQ09MVU1OX01BUFtvd25lcl0sIG5hbWUpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbW92ZUNhcmQob3duZXI6IENhcmRPd25lciwgbmFtZTogc3RyaW5nKSB7XG4gIGF3YWl0IHJlbW92ZUNvbmZpZ0l0ZW0oQ0FSRF9DT0xVTU5fTUFQW293bmVyXSwgbmFtZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG4vLyAtLS0tIFN1bW1hcnkgY2FyZCBhY3Rpb25zIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZFN1bW1hcnlDYXJkKGxhYmVsOiBzdHJpbmcsIGNhdGVnb3JpZXM6IHN0cmluZykge1xuICBhd2FpdCBhZGRTdW1tYXJ5Q2FyZEl0ZW0obGFiZWwsIGNhdGVnb3JpZXMpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbW92ZVN1bW1hcnlDYXJkKGxhYmVsOiBzdHJpbmcpIHtcbiAgYXdhaXQgcmVtb3ZlU3VtbWFyeUNhcmRJdGVtKGxhYmVsKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVTdW1tYXJ5Q2FyZChcbiAgb2xkTGFiZWw6IHN0cmluZyxcbiAgbmV3TGFiZWw6IHN0cmluZyxcbiAgY2F0ZWdvcmllczogc3RyaW5nLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZVN1bW1hcnlDYXJkSXRlbShvbGRMYWJlbCwgbmV3TGFiZWwsIGNhdGVnb3JpZXMpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlb3JkZXJTdW1tYXJ5Q2FyZHMoaXRlbXM6IFN1bW1hcnlDYXJkW10pIHtcbiAgYXdhaXQgcmVvcmRlclN1bW1hcnlDYXJkc0dTKGl0ZW1zKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbi8vIC0tLS0gUmVjdXJyaW5nIGV4cGVuc2UgYWN0aW9ucyAtLS0tXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRSZWN1cnJpbmcoXG4gIG5hbWU6IHN0cmluZyxcbiAgYW1vdW50OiBudW1iZXIsXG4gIGNhdGVnb3J5OiBzdHJpbmcsXG4gIGNhcmQ6IHN0cmluZyxcbiAga2V5d29yZHM6IHN0cmluZyA9IFwiXCIsXG4gIHRlbnRhdGl2ZTogYm9vbGVhbiA9IGZhbHNlLFxuKSB7XG4gIGF3YWl0IGFkZFJlY3VycmluZ0V4cGVuc2UobmFtZSwgYW1vdW50LCBjYXRlZ29yeSwgY2FyZCwga2V5d29yZHMsIHRlbnRhdGl2ZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlUmVjdXJyaW5nKFxuICBvbGROYW1lOiBzdHJpbmcsXG4gIG5hbWU6IHN0cmluZyxcbiAgYW1vdW50OiBudW1iZXIsXG4gIGNhdGVnb3J5OiBzdHJpbmcsXG4gIGNhcmQ6IHN0cmluZyxcbiAga2V5d29yZHM6IHN0cmluZyA9IFwiXCIsXG4gIHRlbnRhdGl2ZTogYm9vbGVhbiA9IGZhbHNlLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZVJlY3VycmluZ0V4cGVuc2UoXG4gICAgb2xkTmFtZSxcbiAgICBuYW1lLFxuICAgIGFtb3VudCxcbiAgICBjYXRlZ29yeSxcbiAgICBjYXJkLFxuICAgIGtleXdvcmRzLFxuICAgIHRlbnRhdGl2ZSxcbiAgKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW1vdmVSZWN1cnJpbmcobmFtZTogc3RyaW5nKSB7XG4gIGF3YWl0IHJlbW92ZVJlY3VycmluZ0V4cGVuc2UobmFtZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVvcmRlclJlY3VycmluZyhpdGVtczogUmVjdXJyaW5nRXhwZW5zZVtdKSB7XG4gIGF3YWl0IHJlb3JkZXJSZWN1cnJpbmdFeHBlbnNlcyhpdGVtcyk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG4vLyAtLS0tIENhdGVnb3J5IG1hcHBpbmcgYWN0aW9ucyAtLS0tXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRDYXRlZ29yeU1hcHBpbmdBY3Rpb24oXG4gIGV4cGVuc2VOYW1lczogc3RyaW5nIHwgc3RyaW5nW10sXG4gIGNhdGVnb3J5OiBzdHJpbmcsXG4pIHtcbiAgYXdhaXQgYWRkQ2F0ZWdvcnlNYXBwaW5nKGV4cGVuc2VOYW1lcywgY2F0ZWdvcnkpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUNhdGVnb3J5TWFwcGluZ0FjdGlvbihcbiAgb2xkRXhwZW5zZU5hbWU6IHN0cmluZyxcbiAgZXhwZW5zZU5hbWU6IHN0cmluZyxcbiAgY2F0ZWdvcnk6IHN0cmluZyxcbikge1xuICBhd2FpdCB1cGRhdGVDYXRlZ29yeU1hcHBpbmcob2xkRXhwZW5zZU5hbWUsIGV4cGVuc2VOYW1lLCBjYXRlZ29yeSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVtb3ZlQ2F0ZWdvcnlNYXBwaW5nQWN0aW9uKGV4cGVuc2VOYW1lOiBzdHJpbmcpIHtcbiAgYXdhaXQgcmVtb3ZlQ2F0ZWdvcnlNYXBwaW5nKGV4cGVuc2VOYW1lKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbi8vIC0tLS0gRXhwZW5zZSByZW5hbWUgcnVsZSBhY3Rpb25zIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZEV4cGVuc2VSZW5hbWVSdWxlQWN0aW9uKFxuICB0YXJnZXROYW1lOiBzdHJpbmcsXG4gIGtleXdvcmRzOiBzdHJpbmcsXG4pIHtcbiAgYXdhaXQgYWRkRXhwZW5zZVJlbmFtZVJ1bGUodGFyZ2V0TmFtZSwga2V5d29yZHMpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUV4cGVuc2VSZW5hbWVSdWxlQWN0aW9uKFxuICBvbGRUYXJnZXROYW1lOiBzdHJpbmcsXG4gIHRhcmdldE5hbWU6IHN0cmluZyxcbiAga2V5d29yZHM6IHN0cmluZyxcbikge1xuICBhd2FpdCB1cGRhdGVFeHBlbnNlUmVuYW1lUnVsZShvbGRUYXJnZXROYW1lLCB0YXJnZXROYW1lLCBrZXl3b3Jkcyk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVtb3ZlRXhwZW5zZVJlbmFtZVJ1bGVBY3Rpb24odGFyZ2V0TmFtZTogc3RyaW5nKSB7XG4gIGF3YWl0IHJlbW92ZUV4cGVuc2VSZW5hbWVSdWxlKHRhcmdldE5hbWUpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuLy8gLS0tLSBBbm51YWwgc2F2aW5ncyBnb2FsIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldEFubnVhbFNhdmluZ3NHb2FsQWN0aW9uKGFtb3VudDogbnVtYmVyKSB7XG4gIGF3YWl0IHNldEFubnVhbFNhdmluZ3NHb2FsKGFtb3VudCk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xuICByZXZhbGlkYXRlUGF0aChcIi9cIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZXRBbm51YWxHb2FsRm9yWWVhckFjdGlvbihcbiAgeWVhcjogbnVtYmVyIHwgXCJkZWZhdWx0XCIsXG4gIGFtb3VudDogbnVtYmVyLFxuKSB7XG4gIGF3YWl0IHNldEFubnVhbEdvYWxGb3JZZWFyKHllYXIsIGFtb3VudCk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xuICByZXZhbGlkYXRlUGF0aChcIi9cIik7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3llYXIvW3llYXJdXCIsIFwicGFnZVwiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldElycmVndWxhckV4cGVuc2VDYXRlZ29yaWVzRm9yWWVhckFjdGlvbihcbiAgeWVhcjogbnVtYmVyLFxuICBjYXRlZ29yaWVzOiBzdHJpbmdbXSxcbikge1xuICBhd2FpdCBzZXRJcnJlZ3VsYXJFeHBlbnNlQ2F0ZWdvcmllc0ZvclllYXIoeWVhciwgY2F0ZWdvcmllcyk7XG4gIHJldmFsaWRhdGVQYXRoKGAveWVhci8ke3llYXIgJSAxMDB9YCk7XG59XG5cbi8vIC0tLS0gSW5jb21lIHNvdXJjZSBhY3Rpb25zIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZEluY29tZShuYW1lOiBzdHJpbmcsIGFtb3VudDogbnVtYmVyKSB7XG4gIGF3YWl0IGFkZEluY29tZVNvdXJjZShuYW1lLCBhbW91bnQpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUluY29tZShcbiAgb2xkTmFtZTogc3RyaW5nLFxuICBuYW1lOiBzdHJpbmcsXG4gIGFtb3VudDogbnVtYmVyLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZUluY29tZVNvdXJjZShvbGROYW1lLCBuYW1lLCBhbW91bnQpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbW92ZUluY29tZShuYW1lOiBzdHJpbmcpIHtcbiAgYXdhaXQgcmVtb3ZlSW5jb21lU291cmNlKG5hbWUpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZU1vbnRoSW5jb21lQWN0aW9uKFxuICBzaGVldFRpdGxlOiBzdHJpbmcsXG4gIGVudHJpZXM6IEluY29tZVNvdXJjZVtdLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZU1vbnRoSW5jb21lKHNoZWV0VGl0bGUsIGVudHJpZXMpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlTW9udGhBbGxvY2F0aW9uc0FjdGlvbihcbiAgc2hlZXRUaXRsZTogc3RyaW5nLFxuICB5ZWFyU3VmZml4OiBudW1iZXIsXG4gIGFsbG9jYXRpb25zOiBNb250aEFsbG9jYXRpb25bXSxcbikge1xuICBhd2FpdCB1cGRhdGVNb250aEFsbG9jYXRpb25zKHNoZWV0VGl0bGUsIGFsbG9jYXRpb25zKTtcbiAgcmV2YWxpZGF0ZVBhdGgoYC95ZWFyLyR7eWVhclN1ZmZpeH1gKTtcbn1cblxuLy8gLS0tLSBWYWNhdGlvbiBhY3Rpb25zIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVZhY2F0aW9uKG5hbWU6IHN0cmluZywgeWVhclN1ZmZpeDogbnVtYmVyKSB7XG4gIGF3YWl0IGNyZWF0ZVZhY2F0aW9uU2hlZXQobmFtZSwgeWVhclN1ZmZpeCk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL1wiKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRWYWNhdGlvblRyYW5zYWN0aW9uKFxuICBzaGVldFRpdGxlOiBzdHJpbmcsXG4gIGRhdGE6IFRyYW5zYWN0aW9uSW5wdXQsXG4pOiBQcm9taXNlPG51bWJlcj4ge1xuICByZXR1cm4gYXBwZW5kVHJhbnNhY3Rpb24oc2hlZXRUaXRsZSwgYnVpbGRUcmFuc2FjdGlvblZhbHVlcyhkYXRhLCB0cnVlKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBlZGl0VmFjYXRpb25UcmFuc2FjdGlvbihcbiAgc2hlZXRUaXRsZTogc3RyaW5nLFxuICByb3c6IG51bWJlcixcbiAgZGF0YTogVHJhbnNhY3Rpb25JbnB1dCxcbikge1xuICBhd2FpdCB1cGRhdGVUcmFuc2FjdGlvbihzaGVldFRpdGxlLCByb3csIGJ1aWxkVHJhbnNhY3Rpb25WYWx1ZXMoZGF0YSwgdHJ1ZSkpO1xufVxuXG5leHBvcnQgY29uc3QgZGVsZXRlVmFjYXRpb25UcmFuc2FjdGlvbiA9IGRlbGV0ZVRyYW5zYWN0aW9uO1xuXG4vLyAtLS0tIEJ1bGsgZWRpdCAtLS0tXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBidWxrRWRpdFRyYW5zYWN0aW9ucyhcbiAgc2hlZXRUaXRsZTogc3RyaW5nLFxuICB1cGRhdGVzOiB7IHJvdzogbnVtYmVyOyBjYXRlZ29yeT86IHN0cmluZzsgY2FyZD86IHN0cmluZyB9W10sXG4pIHtcbiAgYXdhaXQgYmF0Y2hVcGRhdGVGaWVsZHMoc2hlZXRUaXRsZSwgZmFsc2UsIHVwZGF0ZXMpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYnVsa0VkaXRWYWNhdGlvblRyYW5zYWN0aW9ucyhcbiAgc2hlZXRUaXRsZTogc3RyaW5nLFxuICB1cGRhdGVzOiB7IHJvdzogbnVtYmVyOyBjYXRlZ29yeT86IHN0cmluZzsgY2FyZD86IHN0cmluZyB9W10sXG4pIHtcbiAgYXdhaXQgYmF0Y2hVcGRhdGVGaWVsZHMoc2hlZXRUaXRsZSwgdHJ1ZSwgdXBkYXRlcyk7XG59XG5cbi8vIC0tLS0gQnVsayBkZWxldGUgLS0tLVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYnVsa0RlbGV0ZVRyYW5zYWN0aW9ucyhcbiAgc2hlZXRUaXRsZTogc3RyaW5nLFxuICByb3dzOiBudW1iZXJbXSxcbikge1xuICBhd2FpdCBQcm9taXNlLmFsbChyb3dzLm1hcCgocm93KSA9PiBjbGVhclRyYW5zYWN0aW9uKHNoZWV0VGl0bGUsIHJvdykpKTtcbn1cblxuZXhwb3J0IGNvbnN0IGJ1bGtEZWxldGVWYWNhdGlvblRyYW5zYWN0aW9ucyA9IGJ1bGtEZWxldGVUcmFuc2FjdGlvbnM7XG5cbi8vIC0tLS0gTW92ZSB0byB2YWNhdGlvbiAtLS0tXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBidWxrTW92ZVRvVmFjYXRpb25BY3Rpb24oXG4gIHNvdXJjZVRpdGxlOiBzdHJpbmcsXG4gIGRlc3RUaXRsZTogc3RyaW5nLFxuICByb3dzOiBudW1iZXJbXSxcbiAgdHJhbnNhY3Rpb25zOiBUcmFuc2FjdGlvbklucHV0W10sXG4pIHtcbiAgYXdhaXQgYmF0Y2hJbXBvcnRUcmFuc2FjdGlvbnMoZGVzdFRpdGxlLCB0cmFuc2FjdGlvbnMsIHRydWUpO1xuICBhd2FpdCBQcm9taXNlLmFsbChyb3dzLm1hcCgocm93KSA9PiBjbGVhclRyYW5zYWN0aW9uKHNvdXJjZVRpdGxlLCByb3cpKSk7XG59XG5cbi8vIC0tLS0gQmF0Y2ggaW1wb3J0IC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZFRyYW5zYWN0aW9uc0JhdGNoKFxuICBzaGVldFRpdGxlOiBzdHJpbmcsXG4gIHRyYW5zYWN0aW9uczogVHJhbnNhY3Rpb25JbnB1dFtdLFxuICBpc1ZhY2F0aW9uID0gZmFsc2UsXG4pOiBQcm9taXNlPG51bWJlcj4ge1xuICByZXR1cm4gYmF0Y2hJbXBvcnRUcmFuc2FjdGlvbnMoc2hlZXRUaXRsZSwgdHJhbnNhY3Rpb25zLCBpc1ZhY2F0aW9uKTtcbn1cblxuLy8gLS0tLSBEZWJvdW5jZWQgcmV2YWxpZGF0aW9uIChjYWxsZWQgYnkgY2xpZW50KSAtLS0tXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXZhbGlkYXRlUGFnZUFjdGlvbihwYXRoOiBzdHJpbmcpIHtcbiAgcmV2YWxpZGF0ZVBhdGgocGF0aCk7XG59XG5cbi8vIC0tLS0gU2hlZXQgcmVuYW1lIGFjdGlvbiAtLS0tXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW5hbWVTaGVldEFjdGlvbihzaGVldElkOiBudW1iZXIsIG5ld1RpdGxlOiBzdHJpbmcsIHBhZ2VQYXRoPzogc3RyaW5nKSB7XG4gIGF3YWl0IHJlbmFtZVNoZWV0KHNoZWV0SWQsIG5ld1RpdGxlKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvXCIpO1xuICBpZiAocGFnZVBhdGgpIHJldmFsaWRhdGVQYXRoKHBhZ2VQYXRoKTtcbn1cblxuLyoqIE1vdmUgc2hlZXRJZCB0byBiZSBpbW1lZGlhdGVseSBhZnRlciBhZnRlclNoZWV0SWQgKG9yIHRvIGZpcnN0IHBvc2l0aW9uIGlmIG51bGwpLlxuICogIGFmdGVyU2hlZXRJZCBpcyB0aGUgc2hlZXRJZCBvZiB0aGUgcHJlY2VkaW5nIHNpYmxpbmcgaW4gdGhlIG5ldyBvcmRlci4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtb3ZlU2hlZXRBZnRlckFjdGlvbihzaGVldElkOiBudW1iZXIsIGFmdGVyU2hlZXRJZDogbnVtYmVyIHwgbnVsbCkge1xuICBjb25zdCBhbGxTaGVldHNSYXcgPSBhd2FpdCBsaXN0U2hlZXRzKCk7XG4gIC8vIGxpc3RTaGVldHMgcmV0dXJucyBzaGVldHMgc29ydGVkIGJ5IHRoZWlyIG5hdHVyYWwgb3JkZXIgZnJvbSB0aGUgQVBJXG4gIGxldCB0YXJnZXRJbmRleDogbnVtYmVyO1xuICBpZiAoYWZ0ZXJTaGVldElkID09PSBudWxsKSB7XG4gICAgdGFyZ2V0SW5kZXggPSAwO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGFmdGVyUG9zID0gYWxsU2hlZXRzUmF3LmZpbmRJbmRleCgocykgPT4gcy5zaGVldElkID09PSBhZnRlclNoZWV0SWQpO1xuICAgIHRhcmdldEluZGV4ID0gYWZ0ZXJQb3MgPj0gMCA/IGFmdGVyUG9zICsgMSA6IGFsbFNoZWV0c1Jhdy5sZW5ndGg7XG4gIH1cbiAgYXdhaXQgbW92ZVNoZWV0KHNoZWV0SWQsIHRhcmdldEluZGV4KTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvXCIpO1xufVxuXG4vLyAtLS0tIEF1dG8tY3JlYXRpb24gYWN0aW9uIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGVuc3VyZUN1cnJlbnRTaGVldHNBY3Rpb24oKSB7XG4gIGNvbnN0IHNoZWV0cyA9IGF3YWl0IGxpc3RTaGVldHMoKTtcbiAgY29uc3QgY3JlYXRlZCA9IGF3YWl0IGVuc3VyZUN1cnJlbnRTaGVldHMoc2hlZXRzKTtcbiAgaWYgKGNyZWF0ZWQpIHtcbiAgICByZXZhbGlkYXRlUGF0aChcIi9cIik7XG4gIH1cbiAgcmV0dXJuIGNyZWF0ZWQ7XG59XG5cbi8vIC0tLS0gQnVsayB0ZW50YXRpdmUgdG9nZ2xlIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJ1bGtUb2dnbGVUZW50YXRpdmUoXG4gIHNoZWV0VGl0bGU6IHN0cmluZyxcbiAgcm93czogbnVtYmVyW10sXG4gIHRlbnRhdGl2ZTogYm9vbGVhbixcbikge1xuICBhd2FpdCBiYXRjaFRvZ2dsZVRlbnRhdGl2ZUZsYWcoc2hlZXRUaXRsZSwgcm93cywgdGVudGF0aXZlKTtcbn1cblxuZXhwb3J0IGNvbnN0IGJ1bGtUb2dnbGVWYWNhdGlvblRlbnRhdGl2ZSA9IGJ1bGtUb2dnbGVUZW50YXRpdmU7XG5cbi8vIC0tLS0gTW9udGggZG9uZSB0b2dnbGUgLS0tLVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdG9nZ2xlTW9udGhEb25lQWN0aW9uKHNoZWV0VGl0bGU6IHN0cmluZywgZG9uZTogYm9vbGVhbikge1xuICBhd2FpdCBzZXRNb250aERvbmUoc2hlZXRUaXRsZSwgZG9uZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL1wiKTtcbn1cblxuLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vLyBTdG9jayBzZXR0aW5ncyBhY3Rpb25zXG4vLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZFN0b2NrKFxuICBzeW1ib2w6IHN0cmluZyxcbiAgZGlzcGxheU5hbWU6IHN0cmluZyxcbiAgc291cmNlOiBQcmljZVNvdXJjZSxcbiAgY3VycmVuY3k6IFN0b2NrQ3VycmVuY3ksXG4gIGxhYmVsOiBzdHJpbmcgPSBcIlwiLFxuKSB7XG4gIGF3YWl0IGFkZFN0b2NrRGVmaW5pdGlvbihzeW1ib2wsIGRpc3BsYXlOYW1lLCBzb3VyY2UsIGN1cnJlbmN5LCBsYWJlbCk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlU3RvY2soXG4gIG9sZFN5bWJvbDogc3RyaW5nLFxuICBzeW1ib2w6IHN0cmluZyxcbiAgZGlzcGxheU5hbWU6IHN0cmluZyxcbiAgc291cmNlOiBQcmljZVNvdXJjZSxcbiAgY3VycmVuY3k6IFN0b2NrQ3VycmVuY3ksXG4gIGxhYmVsOiBzdHJpbmcgPSBcIlwiLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZVN0b2NrRGVmaW5pdGlvbihvbGRTeW1ib2wsIHN5bWJvbCwgZGlzcGxheU5hbWUsIHNvdXJjZSwgY3VycmVuY3ksIGxhYmVsKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW1vdmVTdG9jayhzeW1ib2w6IHN0cmluZykge1xuICBhd2FpdCByZW1vdmVTdG9ja0RlZmluaXRpb24oc3ltYm9sKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRCcm9rZXIoXG4gIG5hbWU6IHN0cmluZyxcbiAgbWdtdEZlZTogbnVtYmVyLFxuICBwdXJjaGFzZUZlZTogbnVtYmVyLFxuKSB7XG4gIGF3YWl0IGFkZEJyb2tlckNvbmZpZyhuYW1lLCBtZ210RmVlLCBwdXJjaGFzZUZlZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlQnJva2VyKFxuICBvbGROYW1lOiBzdHJpbmcsXG4gIG5hbWU6IHN0cmluZyxcbiAgbWdtdEZlZTogbnVtYmVyLFxuICBwdXJjaGFzZUZlZTogbnVtYmVyLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZUJyb2tlckNvbmZpZyhvbGROYW1lLCBuYW1lLCBtZ210RmVlLCBwdXJjaGFzZUZlZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVtb3ZlQnJva2VyKG5hbWU6IHN0cmluZykge1xuICBhd2FpdCByZW1vdmVCcm9rZXJDb25maWcobmFtZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYWRkR29hbChcbiAgdGVybTogSW52ZXN0bWVudFRlcm0sXG4gIGxhYmVsOiBzdHJpbmcsXG4gIHRhcmdldEFtb3VudDogbnVtYmVyLFxuKSB7XG4gIGF3YWl0IGFkZFN0b2NrR29hbCh0ZXJtLCBsYWJlbCwgdGFyZ2V0QW1vdW50KTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVHb2FsKFxuICBvbGRMYWJlbDogc3RyaW5nLFxuICB0ZXJtOiBJbnZlc3RtZW50VGVybSxcbiAgbGFiZWw6IHN0cmluZyxcbiAgdGFyZ2V0QW1vdW50OiBudW1iZXIsXG4pIHtcbiAgYXdhaXQgdXBkYXRlU3RvY2tHb2FsKG9sZExhYmVsLCB0ZXJtLCBsYWJlbCwgdGFyZ2V0QW1vdW50KTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW1vdmVHb2FsKGxhYmVsOiBzdHJpbmcpIHtcbiAgYXdhaXQgcmVtb3ZlU3RvY2tHb2FsKGxhYmVsKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbi8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gTGFiZWwgYWxsb2NhdGlvbiBhY3Rpb25zXG4vLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNhdmVMYWJlbEFsbG9jYXRpb25zQWN0aW9uKFxuICBhbGxvY2F0aW9uczogTGFiZWxBbGxvY2F0aW9uW10sXG4pIHtcbiAgYXdhaXQgc2F2ZUxhYmVsQWxsb2NhdGlvbnMoYWxsb2NhdGlvbnMpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zdG9ja3NcIik7XG59XG5cbi8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gU3RvY2sgdHJhbnNhY3Rpb24gYWN0aW9uc1xuLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRTdG9ja1RyYW5zYWN0aW9uQWN0aW9uKFxuICBkYXRlOiBzdHJpbmcsXG4gIHR5cGU6IFRyYW5zYWN0aW9uVHlwZSxcbiAgc3ltYm9sOiBzdHJpbmcsXG4gIHF1YW50aXR5OiBudW1iZXIsXG4gIHByaWNlUGVyVW5pdElMUzogbnVtYmVyLFxuICBjdXJyZW5jeTogU3RvY2tDdXJyZW5jeSxcbiAgdGVybTogSW52ZXN0bWVudFRlcm0sXG4gIGJhbms6IHN0cmluZyxcbiAgcHVyY2hhc2VGZWU6IG51bWJlcixcbiAgbm90ZXM6IHN0cmluZyxcbik6IFByb21pc2U8bnVtYmVyPiB7XG4gIGNvbnN0IHJvdyA9IGF3YWl0IGFkZFN0b2NrVHgoXG4gICAgZGF0ZSxcbiAgICB0eXBlLFxuICAgIHN5bWJvbCxcbiAgICBxdWFudGl0eSxcbiAgICBwcmljZVBlclVuaXRJTFMsXG4gICAgY3VycmVuY3ksXG4gICAgdGVybSxcbiAgICBiYW5rLFxuICAgIHB1cmNoYXNlRmVlLFxuICAgIG5vdGVzLFxuICApO1xuICByZXZhbGlkYXRlUGF0aChcIi9zdG9ja3NcIik7XG4gIHJldHVybiByb3c7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBlZGl0U3RvY2tUcmFuc2FjdGlvbkFjdGlvbihcbiAgcm93OiBudW1iZXIsXG4gIGRhdGU6IHN0cmluZyxcbiAgdHlwZTogVHJhbnNhY3Rpb25UeXBlLFxuICBzeW1ib2w6IHN0cmluZyxcbiAgcXVhbnRpdHk6IG51bWJlcixcbiAgcHJpY2VQZXJVbml0SUxTOiBudW1iZXIsXG4gIGN1cnJlbmN5OiBTdG9ja0N1cnJlbmN5LFxuICB0ZXJtOiBJbnZlc3RtZW50VGVybSxcbiAgYmFuazogc3RyaW5nLFxuICBwdXJjaGFzZUZlZTogbnVtYmVyLFxuICBub3Rlczogc3RyaW5nLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZVN0b2NrVHgoXG4gICAgcm93LFxuICAgIGRhdGUsXG4gICAgdHlwZSxcbiAgICBzeW1ib2wsXG4gICAgcXVhbnRpdHksXG4gICAgcHJpY2VQZXJVbml0SUxTLFxuICAgIGN1cnJlbmN5LFxuICAgIHRlcm0sXG4gICAgYmFuayxcbiAgICBwdXJjaGFzZUZlZSxcbiAgICBub3RlcyxcbiAgKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc3RvY2tzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlU3RvY2tUcmFuc2FjdGlvbkFjdGlvbihyb3c6IG51bWJlcikge1xuICBhd2FpdCBkZWxldGVTdG9ja1R4KHJvdyk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3N0b2Nrc1wiKTtcbn1cblxuLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vLyBQb3J0Zm9saW8gaGlzdG9yeSBhY3Rpb25cbi8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0UG9ydGZvbGlvSGlzdG9yeUFjdGlvbihcbiAgcmFuZ2U6IENoYXJ0UmFuZ2UsXG4gIHRlcm0/OiBJbnZlc3RtZW50VGVybSxcbik6IFByb21pc2U8UG9ydGZvbGlvSGlzdG9yeVBvaW50W10+IHtcbiAgY29uc3QgeyBnZXRQb3J0Zm9saW9IaXN0b3J5IH0gPSBhd2FpdCBpbXBvcnQoXCIuL3N0b2NrLWRhc2hib2FyZFwiKTtcbiAgcmV0dXJuIGdldFBvcnRmb2xpb0hpc3RvcnkocmFuZ2UsIHsgdGVybSB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFBvcnRmb2xpb1JldHVybnNBY3Rpb24oXG4gIHRlcm0/OiBJbnZlc3RtZW50VGVybSxcbik6IFByb21pc2U8UG9ydGZvbGlvUmV0dXJucz4ge1xuICBjb25zdCB7IGdldFBvcnRmb2xpb0hpc3RvcnksIGNvbXB1dGVQb3J0Zm9saW9SZXR1cm5zIH0gPSBhd2FpdCBpbXBvcnQoXCIuL3N0b2NrLWRhc2hib2FyZFwiKTtcbiAgY29uc3QgeyBnZXRTdG9ja0NvbmZpZywgc2F2ZVllYXJSZXR1cm5zIH0gPSBhd2FpdCBpbXBvcnQoXCIuL2dvb2dsZS1zaGVldHNcIik7XG5cbiAgY29uc3QgY29uZmlnID0gYXdhaXQgZ2V0U3RvY2tDb25maWcoKTtcbiAgY29uc3QgeyBzYXZlZFllYXJSZXR1cm5zIH0gPSBjb25maWc7XG5cbiAgLy8gT3B0aW1hbCBmZXRjaCBzdGFydDogY292ZXIgcm9sbGluZyAzeXIgcGVyaW9kcyBBTkQgYWxsIHVuY2FjaGVkIGNvbXBsZXRlIHllYXJzLlxuICAvLyBJZiBhbGwgeWVhcnMgdXAgdG8gKGN1cnJlbnRZZWFyLTEpIGFyZSBjYWNoZWQsIG9ubHkgZmV0Y2ggM3lyIG9mIGRhdGEuXG4gIGNvbnN0IGN1cnJlbnRZZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICBjb25zdCB0aHJlZVllYXJzQWdvRGF0ZSA9IG5ldyBEYXRlKCk7XG4gIHRocmVlWWVhcnNBZ29EYXRlLnNldEZ1bGxZZWFyKHRocmVlWWVhcnNBZ29EYXRlLmdldEZ1bGxZZWFyKCkgLSAzKTtcbiAgY29uc3QgdGhyZWVZZWFyc0FnbyA9IHRocmVlWWVhcnNBZ29EYXRlLnRvSVNPU3RyaW5nKCkuc3BsaXQoXCJUXCIpWzBdO1xuXG4gIC8vIEZpbmQgdGhlIGVhcmxpZXN0IGNvbXBsZXRlIHllYXIgbm90IHlldCBjYWNoZWRcbiAgbGV0IGVhcmxpZXN0VW5jYWNoZWRZZWFyOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgLy8gV2UgbG9vayBmcm9tIGEgcmVhc29uYWJsZSBtaW5pbXVtICgyMDE1KSB0byBhdm9pZCBmZXRjaGluZyB0b28gZmFyIGJhY2tcbiAgZm9yIChsZXQgeSA9IDIwMTU7IHkgPCBjdXJyZW50WWVhcjsgeSsrKSB7XG4gICAgaWYgKCEoeSBpbiBzYXZlZFllYXJSZXR1cm5zKSkge1xuICAgICAgZWFybGllc3RVbmNhY2hlZFllYXIgPSB5O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLy8gU3RhcnQgZGF0ZTogZWFybGllciBvZiAoM3lyIGFnbykgYW5kIChKYW4gMSBvZiBlYXJsaWVzdCB1bmNhY2hlZCB5ZWFyKVxuICBsZXQgc3RhcnREYXRlID0gdGhyZWVZZWFyc0FnbztcbiAgaWYgKGVhcmxpZXN0VW5jYWNoZWRZZWFyICE9PSBudWxsKSB7XG4gICAgY29uc3QgdW5jYWNoZWRTdGFydCA9IGAke2VhcmxpZXN0VW5jYWNoZWRZZWFyfS0wMS0wMWA7XG4gICAgaWYgKHVuY2FjaGVkU3RhcnQgPCBzdGFydERhdGUpIHN0YXJ0RGF0ZSA9IHVuY2FjaGVkU3RhcnQ7XG4gIH1cblxuICBjb25zdCBoaXN0b3J5ID0gYXdhaXQgZ2V0UG9ydGZvbGlvSGlzdG9yeShcIk1heFwiLCB7XG4gICAgZG93bnNhbXBsZTogZmFsc2UsXG4gICAgdGVybSxcbiAgICBzdGFydERhdGVPdmVycmlkZTogc3RhcnREYXRlLFxuICB9KTtcblxuICBjb25zdCByZXR1cm5zID0gY29tcHV0ZVBvcnRmb2xpb1JldHVybnMoaGlzdG9yeSwgc2F2ZWRZZWFyUmV0dXJucyk7XG5cbiAgLy8gU2F2ZSBuZXdseSBjb21wdXRlZCBjb21wbGV0ZSB5ZWFycyDigJQgb25seSBpZiB3ZSBoYXZlIGhpZ2gtY29uZmlkZW5jZSBkYXRhLlxuICAvLyBBIHllYXIgcXVhbGlmaWVzIHdoZW46XG4gIC8vIDEuIE5vdCBhbHJlYWR5IGNhY2hlZCAobmV2ZXIgb3ZlcndyaXRlIGV4aXN0aW5nKVxuICAvLyAyLiBDb21wdXRlZCByZXR1cm4gaXMgbm9uLW51bGxcbiAgLy8gMy4gSGlzdG9yeSBoYXMg4omlMjAwIHBvaW50cyB3aXRoaW4gdGhhdCB5ZWFyIChuZWFybHkgYWxsIHRyYWRpbmcgZGF5cylcbiAgLy8gNC4gSGlzdG9yeSBjb3ZlcnMgSmFuIDHigJMxNSBBTkQgTm92IDHigJNEZWMgMzEgb2YgdGhhdCB5ZWFyIChmdWxsIHllYXIgZmV0Y2hlZClcbiAgY29uc3QgbmV3RW50cmllczogUmVjb3JkPG51bWJlciwgbnVtYmVyPiA9IHt9O1xuICBmb3IgKGNvbnN0IHsgeWVhciwgcmV0dXJuUGVyY2VudCB9IG9mIHJldHVybnMuYW5udWFsKSB7XG4gICAgaWYgKHJldHVyblBlcmNlbnQgPT09IG51bGwpIGNvbnRpbnVlO1xuICAgIGlmICh5ZWFyIGluIHNhdmVkWWVhclJldHVybnMpIGNvbnRpbnVlOyAvLyBuZXZlciBvdmVyd3JpdGVcblxuICAgIC8vIENvdW50IHBvaW50cyBhbmQgY2hlY2sgY292ZXJhZ2VcbiAgICBjb25zdCB5ZWFyUG9pbnRzID0gaGlzdG9yeS5maWx0ZXIoKHApID0+IHAuZGF0ZS5zdGFydHNXaXRoKGAke3llYXJ9LWApKTtcbiAgICBpZiAoeWVhclBvaW50cy5sZW5ndGggPCAyMDApIGNvbnRpbnVlO1xuXG4gICAgY29uc3QgZmlyc3QgPSB5ZWFyUG9pbnRzWzBdLmRhdGU7XG4gICAgY29uc3QgbGFzdCA9IHllYXJQb2ludHNbeWVhclBvaW50cy5sZW5ndGggLSAxXS5kYXRlO1xuICAgIGNvbnN0IGNvdmVyc1N0YXJ0ID0gZmlyc3QgPD0gYCR7eWVhcn0tMDEtMTVgO1xuICAgIGNvbnN0IGNvdmVyc0VuZCA9IGxhc3QgPj0gYCR7eWVhcn0tMTEtMDFgO1xuICAgIGlmICghY292ZXJzU3RhcnQgfHwgIWNvdmVyc0VuZCkgY29udGludWU7XG5cbiAgICBuZXdFbnRyaWVzW3llYXJdID0gcmV0dXJuUGVyY2VudDtcbiAgfVxuXG4gIGlmIChPYmplY3Qua2V5cyhuZXdFbnRyaWVzKS5sZW5ndGggPiAwKSB7XG4gICAgYXdhaXQgc2F2ZVllYXJSZXR1cm5zKHsgLi4uc2F2ZWRZZWFyUmV0dXJucywgLi4ubmV3RW50cmllcyB9KTtcbiAgfVxuXG4gIHJldHVybiByZXR1cm5zO1xufVxuXG4vLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIE5WSURJQSBSU1UgYWN0aW9uc1xuLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbi8qKlxuICogQWRkIGFuIFJTVSBncmFudCB3aXRoIGF1dG8tZ2VuZXJhdGVkIHZlc3Qgcm93cyAoNy1jb2x1bW4gZm9ybWF0KS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZFJzdUdyYW50QWN0aW9uKFxuICBncmFudERhdGU6IHN0cmluZyxcbiAgdG90YWxTaGFyZXM6IG51bWJlcixcbiAgY29zdFBlclNoYXJlOiBudW1iZXIsXG4gIHZlc3RzOiB7IHZlc3REYXRlOiBzdHJpbmc7IHNoYXJlczogbnVtYmVyIH1bXSxcbiAgZ3JhbnROYW1lOiBzdHJpbmcgPSBcIlwiLFxuKSB7XG4gIGlmICh2ZXN0cy5sZW5ndGggPT09IDApIHJldHVybjtcblxuICBjb25zdCByb3dzOiBzdHJpbmdbXVtdID0gdmVzdHMubWFwKCh2KSA9PiBbXG4gICAgZ3JhbnREYXRlLFxuICAgIFN0cmluZyh0b3RhbFNoYXJlcyksXG4gICAgdi52ZXN0RGF0ZSxcbiAgICBTdHJpbmcodi5zaGFyZXMpLFxuICAgIGNvc3RQZXJTaGFyZSA+IDAgPyBTdHJpbmcoY29zdFBlclNoYXJlKSA6IFwiXCIsXG4gICAgXCJcIiwgLy8gbm90ZXNcbiAgICBncmFudE5hbWUsXG4gICAgXCJcIiwgLy8gbm90IHNvbGRcbiAgXSk7XG5cbiAgYXdhaXQgYWRkUnN1VmVzdFJvd3Mocm93cyk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL252aWRpYVwiKTtcbn1cblxuLyoqXG4gKiBVcGRhdGUgYW4gUlNVIHZlc3Qgcm93ICg3LWNvbHVtbiBmb3JtYXQpLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlUnN1VmVzdEFjdGlvbihcbiAgcm93OiBudW1iZXIsXG4gIGdyYW50RGF0ZTogc3RyaW5nLFxuICB0b3RhbFNoYXJlc0luR3JhbnQ6IG51bWJlcixcbiAgdmVzdERhdGU6IHN0cmluZyxcbiAgc2hhcmVzOiBudW1iZXIsXG4gIHZlc3RQcmljZVVzZDogbnVtYmVyLFxuICBub3Rlczogc3RyaW5nID0gXCJcIixcbiAgZ3JhbnROYW1lOiBzdHJpbmcgPSBcIlwiLFxuICBzb2xkOiBib29sZWFuID0gZmFsc2UsXG4pIHtcbiAgYXdhaXQgdXBkYXRlUnN1Um93KHJvdywgW1xuICAgIGdyYW50RGF0ZSxcbiAgICBTdHJpbmcodG90YWxTaGFyZXNJbkdyYW50KSxcbiAgICB2ZXN0RGF0ZSxcbiAgICBTdHJpbmcoc2hhcmVzKSxcbiAgICB2ZXN0UHJpY2VVc2QgPyBTdHJpbmcodmVzdFByaWNlVXNkKSA6IFwiXCIsXG4gICAgbm90ZXMsXG4gICAgZ3JhbnROYW1lLFxuICAgIHNvbGQgPyBcIlRSVUVcIiA6IFwiXCIsXG4gIF0pO1xuICByZXZhbGlkYXRlUGF0aChcIi9udmlkaWFcIik7XG59XG5cbi8qKlxuICogVG9nZ2xlIHRoZSBzb2xkIGZsYWcgb24gYW4gUlNVIHZlc3Qgcm93LlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdG9nZ2xlUnN1U29sZEFjdGlvbihyb3c6IG51bWJlciwgc29sZDogYm9vbGVhbikge1xuICBhd2FpdCB0b2dnbGVSc3VTb2xkKHJvdywgc29sZCk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL252aWRpYVwiKTtcbn1cblxuLyoqXG4gKiBEZWxldGUgYW4gUlNVIHJvdy5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVJzdVJvd0FjdGlvbihyb3c6IG51bWJlcikge1xuICBhd2FpdCBkZWxldGVSc3VSb3cocm93KTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvbnZpZGlhXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2V0UnN1R3Jvc3NEYXRhQWN0aW9uKGdyb3NzU29GYXI6IG51bWJlciwgbW9udGhseVNhbGFyeTogbnVtYmVyLCBlc3BwTW9udGhseUNvbnRyaWJ1dGlvbjogbnVtYmVyLCBlc3BwUHVyY2hhc2VQcmljZTogbnVtYmVyKSB7XG4gIGF3YWl0IHNldFJzdUdyb3NzRGF0YShncm9zc1NvRmFyLCBtb250aGx5U2FsYXJ5LCBlc3BwTW9udGhseUNvbnRyaWJ1dGlvbiwgZXNwcFB1cmNoYXNlUHJpY2UpO1xuICByZXZhbGlkYXRlUGF0aChcIi9udmlkaWFcIik7XG59XG5cbi8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gUGVuc2lvbiBhY3Rpb25zXG4vLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFBlbnNpb25EYXRhKCkge1xuICBhd2FpdCBlbnN1cmVQZW5zaW9uU2hlZXQoKTtcbiAgY29uc3QgZnVuZHMgPSBhd2FpdCBnZXRQZW5zaW9uRnVuZHMoKTtcbiAgcmV0dXJuIHsgZnVuZHMgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZFBlbnNpb25GdW5kQWN0aW9uKFxuICBvd25lcjogUGVuc2lvbk93bmVyLFxuICBuYW1lOiBzdHJpbmcsXG4gIHR5cGU6IFBlbnNpb25GdW5kVHlwZSxcbiAgdHJhY2s6IHN0cmluZyxcbiAgYmFsYW5jZTogbnVtYmVyLFxuICBjb21wYW55OiBzdHJpbmcsXG4pIHtcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5zcGxpdChcIlRcIilbMF07XG4gIGF3YWl0IGFkZFBlbnNpb25GdW5kKG93bmVyLCBuYW1lLCB0eXBlLCB0cmFjaywgYmFsYW5jZSwgZGF0ZSwgY29tcGFueSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3BlbnNpb25cIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVQZW5zaW9uRnVuZEFjdGlvbihcbiAgcm93OiBudW1iZXIsXG4gIG93bmVyOiBQZW5zaW9uT3duZXIsXG4gIG5hbWU6IHN0cmluZyxcbiAgdHlwZTogUGVuc2lvbkZ1bmRUeXBlLFxuICB0cmFjazogc3RyaW5nLFxuICBiYWxhbmNlOiBudW1iZXIsXG4gIGNvbXBhbnk6IHN0cmluZyxcbikge1xuICBjb25zdCBkYXRlID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnNwbGl0KFwiVFwiKVswXTtcbiAgYXdhaXQgdXBkYXRlUGVuc2lvbkZ1bmQocm93LCBvd25lciwgbmFtZSwgdHlwZSwgdHJhY2ssIGJhbGFuY2UsIGRhdGUsIGNvbXBhbnkpO1xuICByZXZhbGlkYXRlUGF0aChcIi9wZW5zaW9uXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlUGVuc2lvbkZ1bmRBY3Rpb24ocm93OiBudW1iZXIpIHtcbiAgYXdhaXQgZGVsZXRlUGVuc2lvbkZ1bmQocm93KTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvcGVuc2lvblwiKTtcbn1cblxuLyoqXG4gKiBTZWFyY2ggZXhwZW5zZSBuYW1lcyBhY3Jvc3MgYWxsIG1vbnRobHkgKyB2YWNhdGlvbiBzaGVldHMuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZWFyY2hBbGxTaGVldHNBY3Rpb24ocXVlcnk6IHN0cmluZykge1xuICBpZiAoIXF1ZXJ5IHx8IHF1ZXJ5LnRyaW0oKS5sZW5ndGggPCAyKSByZXR1cm4gW107XG5cbiAgY29uc3QgYWxsU2hlZXRzID0gYXdhaXQgbGlzdFNoZWV0cygpO1xuICBjb25zdCBzZWFyY2hhYmxlID0gYWxsU2hlZXRzLmZpbHRlcihcbiAgICAocykgPT4gcy50eXBlID09PSBcIm1vbnRobHlcIiB8fCBzLnR5cGUgPT09IFwidmFjYXRpb25cIixcbiAgKTtcblxuICBjb25zdCB7IHNlYXJjaEFsbFNoZWV0cyB9ID0gYXdhaXQgaW1wb3J0KFwiLi9nb29nbGUtc2hlZXRzXCIpO1xuICByZXR1cm4gc2VhcmNoQWxsU2hlZXRzKHF1ZXJ5LnRyaW0oKSwgc2VhcmNoYWJsZSk7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6ImtTQXVXc0IsNkxBQUEifQ==
}),
"[project]/dev/mezumani/src/lib/data:9b492a [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "moveSheetAfterAction",
    ()=>$$RSC_SERVER_ACTION_41
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"60af88180fca59bfd2748f18e0d428114d985a580d":"moveSheetAfterAction"},"dev/mezumani/src/lib/actions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_41 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("60af88180fca59bfd2748f18e0d428114d985a580d", __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "moveSheetAfterAction");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzZXJ2ZXJcIjtcblxuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tIFwibmV4dC9jYWNoZVwiO1xuaW1wb3J0IHtcbiAgYXBwZW5kVHJhbnNhY3Rpb24sXG4gIHVwZGF0ZVRyYW5zYWN0aW9uLFxuICBjbGVhclRyYW5zYWN0aW9uLFxuICBjcmVhdGVNb250aFNoZWV0LFxuICBhZGRDb25maWdJdGVtLFxuICByZW1vdmVDb25maWdJdGVtLFxuICBhZGRDYXRlZ29yeUNvbmZpZ0l0ZW0sXG4gIHJlbW92ZUNhdGVnb3J5Q29uZmlnSXRlbSxcbiAgcmVuYW1lQ2F0ZWdvcnlJblNoZWV0cyxcbiAgcmVuYW1lU2hlZXQsXG4gIG1vdmVTaGVldCxcbiAgY3JlYXRlVmFjYXRpb25TaGVldCxcbiAgZW5zdXJlQ3VycmVudFNoZWV0cyxcbiAgbGlzdFNoZWV0cyxcbiAgYWRkU3VtbWFyeUNhcmRJdGVtLFxuICByZW1vdmVTdW1tYXJ5Q2FyZEl0ZW0sXG4gIHVwZGF0ZVN1bW1hcnlDYXJkSXRlbSxcbiAgYWRkUmVjdXJyaW5nRXhwZW5zZSxcbiAgdXBkYXRlUmVjdXJyaW5nRXhwZW5zZSxcbiAgcmVtb3ZlUmVjdXJyaW5nRXhwZW5zZSxcbiAgcmVvcmRlclJlY3VycmluZ0V4cGVuc2VzLFxuICByZW9yZGVyU3VtbWFyeUNhcmRzIGFzIHJlb3JkZXJTdW1tYXJ5Q2FyZHNHUyxcbiAgYmF0Y2hJbXBvcnRUcmFuc2FjdGlvbnMsXG4gIGFkZENhdGVnb3J5TWFwcGluZyxcbiAgdXBkYXRlQ2F0ZWdvcnlNYXBwaW5nLFxuICByZW1vdmVDYXRlZ29yeU1hcHBpbmcsXG4gIGFkZEV4cGVuc2VSZW5hbWVSdWxlLFxuICB1cGRhdGVFeHBlbnNlUmVuYW1lUnVsZSxcbiAgcmVtb3ZlRXhwZW5zZVJlbmFtZVJ1bGUsXG4gIGJhdGNoVXBkYXRlRmllbGRzLFxuICBiYXRjaFRvZ2dsZVRlbnRhdGl2ZUZsYWcsXG4gIHNldE1vbnRoRG9uZSxcbiAgYWRkSW5jb21lU291cmNlLFxuICB1cGRhdGVJbmNvbWVTb3VyY2UsXG4gIHJlbW92ZUluY29tZVNvdXJjZSxcbiAgdXBkYXRlTW9udGhJbmNvbWUsXG4gIHVwZGF0ZU1vbnRoQWxsb2NhdGlvbnMsXG4gIGFkZFN0b2NrRGVmaW5pdGlvbixcbiAgdXBkYXRlU3RvY2tEZWZpbml0aW9uLFxuICByZW1vdmVTdG9ja0RlZmluaXRpb24sXG4gIGFkZEJyb2tlckNvbmZpZyxcbiAgdXBkYXRlQnJva2VyQ29uZmlnLFxuICByZW1vdmVCcm9rZXJDb25maWcsXG4gIGFkZFN0b2NrR29hbCxcbiAgdXBkYXRlU3RvY2tHb2FsLFxuICByZW1vdmVTdG9ja0dvYWwsXG4gIGFkZFN0b2NrVHJhbnNhY3Rpb24gYXMgYWRkU3RvY2tUeCxcbiAgdXBkYXRlU3RvY2tUcmFuc2FjdGlvbiBhcyB1cGRhdGVTdG9ja1R4LFxuICBkZWxldGVTdG9ja1RyYW5zYWN0aW9uIGFzIGRlbGV0ZVN0b2NrVHgsXG4gIHNhdmVMYWJlbEFsbG9jYXRpb25zLFxuICBhZGRSc3VWZXN0Um93cyxcbiAgdXBkYXRlUnN1Um93LFxuICBkZWxldGVSc3VSb3csXG4gIHRvZ2dsZVJzdVNvbGQsXG4gIHNldFJzdUdyb3NzRGF0YSxcbiAgc2V0QW5udWFsU2F2aW5nc0dvYWwsXG4gIHNldEFubnVhbEdvYWxGb3JZZWFyLFxuICBzZXRJcnJlZ3VsYXJFeHBlbnNlQ2F0ZWdvcmllc0ZvclllYXIsXG59IGZyb20gXCIuL2dvb2dsZS1zaGVldHNcIjtcbmltcG9ydCB7IEhFQlJFV19NT05USFMgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbmltcG9ydCB7XG4gIGVuc3VyZVBlbnNpb25TaGVldCxcbiAgZ2V0UGVuc2lvbkZ1bmRzLFxuICBhZGRQZW5zaW9uRnVuZCxcbiAgdXBkYXRlUGVuc2lvbkZ1bmQsXG4gIGRlbGV0ZVBlbnNpb25GdW5kLFxufSBmcm9tIFwiLi9wZW5zaW9uLXNoZWV0c1wiO1xuaW1wb3J0IHR5cGUge1xuICBUcmFuc2FjdGlvbklucHV0LFxuICBSZWN1cnJpbmdFeHBlbnNlLFxuICBTdW1tYXJ5Q2FyZCxcbiAgSW5jb21lU291cmNlLFxuICBNb250aEFsbG9jYXRpb24sXG4gIExhYmVsQWxsb2NhdGlvbixcbiAgUHJpY2VTb3VyY2UsXG4gIFN0b2NrQ3VycmVuY3ksXG4gIEludmVzdG1lbnRUZXJtLFxuICBUcmFuc2FjdGlvblR5cGUsXG4gIENoYXJ0UmFuZ2UsXG4gIFBvcnRmb2xpb0hpc3RvcnlQb2ludCxcbiAgUG9ydGZvbGlvUmV0dXJucyxcbiAgUGVuc2lvbk93bmVyLFxuICBQZW5zaW9uRnVuZFR5cGUsXG59IGZyb20gXCIuL3R5cGVzXCI7XG5cbmZ1bmN0aW9uIGJ1aWxkVHJhbnNhY3Rpb25WYWx1ZXMoZGF0YTogVHJhbnNhY3Rpb25JbnB1dCwgaXNWYWNhdGlvbiA9IGZhbHNlKSB7XG4gIGNvbnN0IGFtb3VudCA9IGRhdGEudGVudGF0aXZlID8gXCJcIiA6IFN0cmluZyhkYXRhLmFtb3VudCk7XG4gIGNvbnN0IHRlbnRhdGl2ZUFtb3VudCA9IGRhdGEudGVudGF0aXZlID8gU3RyaW5nKGRhdGEuYW1vdW50KSA6IFwiXCI7XG4gIGlmIChpc1ZhY2F0aW9uKSB7XG4gICAgLy8gVmFjYXRpb24gY29sdW1uczogRD1jYXJkLCBFPWNhdGVnb3J5IChzd2FwcGVkIHZzIG1vbnRobHkpXG4gICAgcmV0dXJuIFtkYXRhLmRhdGUsIGRhdGEuZXhwZW5zZSwgYW1vdW50LCBkYXRhLmNhcmQsIGRhdGEuY2F0ZWdvcnksIHRlbnRhdGl2ZUFtb3VudF07XG4gIH1cbiAgcmV0dXJuIFtkYXRhLmRhdGUsIGRhdGEuZXhwZW5zZSwgYW1vdW50LCBkYXRhLmNhdGVnb3J5LCBkYXRhLmNhcmQsIHRlbnRhdGl2ZUFtb3VudF07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRUcmFuc2FjdGlvbihcbiAgc2hlZXRUaXRsZTogc3RyaW5nLFxuICBkYXRhOiBUcmFuc2FjdGlvbklucHV0LFxuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgcmV0dXJuIGFwcGVuZFRyYW5zYWN0aW9uKHNoZWV0VGl0bGUsIGJ1aWxkVHJhbnNhY3Rpb25WYWx1ZXMoZGF0YSkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZWRpdFRyYW5zYWN0aW9uKFxuICBzaGVldFRpdGxlOiBzdHJpbmcsXG4gIHJvdzogbnVtYmVyLFxuICBkYXRhOiBUcmFuc2FjdGlvbklucHV0LFxuKSB7XG4gIGF3YWl0IHVwZGF0ZVRyYW5zYWN0aW9uKHNoZWV0VGl0bGUsIHJvdywgYnVpbGRUcmFuc2FjdGlvblZhbHVlcyhkYXRhKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVUcmFuc2FjdGlvbihzaGVldFRpdGxlOiBzdHJpbmcsIHJvdzogbnVtYmVyKSB7XG4gIGF3YWl0IGNsZWFyVHJhbnNhY3Rpb24oc2hlZXRUaXRsZSwgcm93KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZU1vbnRoKG1vbnRoSW5kZXg6IG51bWJlciwgeWVhclN1ZmZpeDogbnVtYmVyKSB7XG4gIGF3YWl0IGNyZWF0ZU1vbnRoU2hlZXQoSEVCUkVXX01PTlRIU1ttb250aEluZGV4XSwgeWVhclN1ZmZpeCk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL1wiKTtcbn1cblxuLy8gLS0tLSBTZXR0aW5ncyBhY3Rpb25zIC0tLS1cblxuY29uc3QgQ09MVU1OX01BUCA9IHtcbiAgbW9udGhseTogXCJBXCIgYXMgY29uc3QsXG4gIHZhY2F0aW9uOiBcIkJcIiBhcyBjb25zdCxcbn07XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRDYXRlZ29yeShcbiAgdHlwZTogXCJtb250aGx5XCIgfCBcInZhY2F0aW9uXCIsXG4gIG5hbWU6IHN0cmluZyxcbiAgY29sb3I6IHN0cmluZyxcbikge1xuICBhd2FpdCBhZGRDYXRlZ29yeUNvbmZpZ0l0ZW0oQ09MVU1OX01BUFt0eXBlXSwgbmFtZSwgY29sb3IpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbW92ZUNhdGVnb3J5KFxuICB0eXBlOiBcIm1vbnRobHlcIiB8IFwidmFjYXRpb25cIixcbiAgbmFtZTogc3RyaW5nLFxuKSB7XG4gIGF3YWl0IHJlbW92ZUNhdGVnb3J5Q29uZmlnSXRlbShDT0xVTU5fTUFQW3R5cGVdLCBuYW1lKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW5hbWVDYXRlZ29yeShcbiAgdHlwZTogXCJtb250aGx5XCIgfCBcInZhY2F0aW9uXCIsXG4gIG9sZE5hbWU6IHN0cmluZyxcbiAgbmV3TmFtZTogc3RyaW5nLFxuKSB7XG4gIGF3YWl0IHJlbmFtZUNhdGVnb3J5SW5TaGVldHMoQ09MVU1OX01BUFt0eXBlXSwgb2xkTmFtZSwgbmV3TmFtZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xuICByZXZhbGlkYXRlUGF0aChcIi9cIik7XG59XG5cbmNvbnN0IENBUkRfQ09MVU1OX01BUCA9IHtcbiAgZWlub3I6IFwiQ1wiIGFzIGNvbnN0LFxuICB6aXY6IFwiRFwiIGFzIGNvbnN0LFxuICBzaGFyZWQ6IFwiRVwiIGFzIGNvbnN0LFxufTtcblxuZXhwb3J0IHR5cGUgQ2FyZE93bmVyID0gXCJlaW5vclwiIHwgXCJ6aXZcIiB8IFwic2hhcmVkXCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRDYXJkKG93bmVyOiBDYXJkT3duZXIsIG5hbWU6IHN0cmluZykge1xuICBhd2FpdCBhZGRDb25maWdJdGVtKENBUkRfQ09MVU1OX01BUFtvd25lcl0sIG5hbWUpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbW92ZUNhcmQob3duZXI6IENhcmRPd25lciwgbmFtZTogc3RyaW5nKSB7XG4gIGF3YWl0IHJlbW92ZUNvbmZpZ0l0ZW0oQ0FSRF9DT0xVTU5fTUFQW293bmVyXSwgbmFtZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG4vLyAtLS0tIFN1bW1hcnkgY2FyZCBhY3Rpb25zIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZFN1bW1hcnlDYXJkKGxhYmVsOiBzdHJpbmcsIGNhdGVnb3JpZXM6IHN0cmluZykge1xuICBhd2FpdCBhZGRTdW1tYXJ5Q2FyZEl0ZW0obGFiZWwsIGNhdGVnb3JpZXMpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbW92ZVN1bW1hcnlDYXJkKGxhYmVsOiBzdHJpbmcpIHtcbiAgYXdhaXQgcmVtb3ZlU3VtbWFyeUNhcmRJdGVtKGxhYmVsKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVTdW1tYXJ5Q2FyZChcbiAgb2xkTGFiZWw6IHN0cmluZyxcbiAgbmV3TGFiZWw6IHN0cmluZyxcbiAgY2F0ZWdvcmllczogc3RyaW5nLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZVN1bW1hcnlDYXJkSXRlbShvbGRMYWJlbCwgbmV3TGFiZWwsIGNhdGVnb3JpZXMpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlb3JkZXJTdW1tYXJ5Q2FyZHMoaXRlbXM6IFN1bW1hcnlDYXJkW10pIHtcbiAgYXdhaXQgcmVvcmRlclN1bW1hcnlDYXJkc0dTKGl0ZW1zKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbi8vIC0tLS0gUmVjdXJyaW5nIGV4cGVuc2UgYWN0aW9ucyAtLS0tXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRSZWN1cnJpbmcoXG4gIG5hbWU6IHN0cmluZyxcbiAgYW1vdW50OiBudW1iZXIsXG4gIGNhdGVnb3J5OiBzdHJpbmcsXG4gIGNhcmQ6IHN0cmluZyxcbiAga2V5d29yZHM6IHN0cmluZyA9IFwiXCIsXG4gIHRlbnRhdGl2ZTogYm9vbGVhbiA9IGZhbHNlLFxuKSB7XG4gIGF3YWl0IGFkZFJlY3VycmluZ0V4cGVuc2UobmFtZSwgYW1vdW50LCBjYXRlZ29yeSwgY2FyZCwga2V5d29yZHMsIHRlbnRhdGl2ZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlUmVjdXJyaW5nKFxuICBvbGROYW1lOiBzdHJpbmcsXG4gIG5hbWU6IHN0cmluZyxcbiAgYW1vdW50OiBudW1iZXIsXG4gIGNhdGVnb3J5OiBzdHJpbmcsXG4gIGNhcmQ6IHN0cmluZyxcbiAga2V5d29yZHM6IHN0cmluZyA9IFwiXCIsXG4gIHRlbnRhdGl2ZTogYm9vbGVhbiA9IGZhbHNlLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZVJlY3VycmluZ0V4cGVuc2UoXG4gICAgb2xkTmFtZSxcbiAgICBuYW1lLFxuICAgIGFtb3VudCxcbiAgICBjYXRlZ29yeSxcbiAgICBjYXJkLFxuICAgIGtleXdvcmRzLFxuICAgIHRlbnRhdGl2ZSxcbiAgKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW1vdmVSZWN1cnJpbmcobmFtZTogc3RyaW5nKSB7XG4gIGF3YWl0IHJlbW92ZVJlY3VycmluZ0V4cGVuc2UobmFtZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVvcmRlclJlY3VycmluZyhpdGVtczogUmVjdXJyaW5nRXhwZW5zZVtdKSB7XG4gIGF3YWl0IHJlb3JkZXJSZWN1cnJpbmdFeHBlbnNlcyhpdGVtcyk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG4vLyAtLS0tIENhdGVnb3J5IG1hcHBpbmcgYWN0aW9ucyAtLS0tXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRDYXRlZ29yeU1hcHBpbmdBY3Rpb24oXG4gIGV4cGVuc2VOYW1lczogc3RyaW5nIHwgc3RyaW5nW10sXG4gIGNhdGVnb3J5OiBzdHJpbmcsXG4pIHtcbiAgYXdhaXQgYWRkQ2F0ZWdvcnlNYXBwaW5nKGV4cGVuc2VOYW1lcywgY2F0ZWdvcnkpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUNhdGVnb3J5TWFwcGluZ0FjdGlvbihcbiAgb2xkRXhwZW5zZU5hbWU6IHN0cmluZyxcbiAgZXhwZW5zZU5hbWU6IHN0cmluZyxcbiAgY2F0ZWdvcnk6IHN0cmluZyxcbikge1xuICBhd2FpdCB1cGRhdGVDYXRlZ29yeU1hcHBpbmcob2xkRXhwZW5zZU5hbWUsIGV4cGVuc2VOYW1lLCBjYXRlZ29yeSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVtb3ZlQ2F0ZWdvcnlNYXBwaW5nQWN0aW9uKGV4cGVuc2VOYW1lOiBzdHJpbmcpIHtcbiAgYXdhaXQgcmVtb3ZlQ2F0ZWdvcnlNYXBwaW5nKGV4cGVuc2VOYW1lKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbi8vIC0tLS0gRXhwZW5zZSByZW5hbWUgcnVsZSBhY3Rpb25zIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZEV4cGVuc2VSZW5hbWVSdWxlQWN0aW9uKFxuICB0YXJnZXROYW1lOiBzdHJpbmcsXG4gIGtleXdvcmRzOiBzdHJpbmcsXG4pIHtcbiAgYXdhaXQgYWRkRXhwZW5zZVJlbmFtZVJ1bGUodGFyZ2V0TmFtZSwga2V5d29yZHMpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUV4cGVuc2VSZW5hbWVSdWxlQWN0aW9uKFxuICBvbGRUYXJnZXROYW1lOiBzdHJpbmcsXG4gIHRhcmdldE5hbWU6IHN0cmluZyxcbiAga2V5d29yZHM6IHN0cmluZyxcbikge1xuICBhd2FpdCB1cGRhdGVFeHBlbnNlUmVuYW1lUnVsZShvbGRUYXJnZXROYW1lLCB0YXJnZXROYW1lLCBrZXl3b3Jkcyk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVtb3ZlRXhwZW5zZVJlbmFtZVJ1bGVBY3Rpb24odGFyZ2V0TmFtZTogc3RyaW5nKSB7XG4gIGF3YWl0IHJlbW92ZUV4cGVuc2VSZW5hbWVSdWxlKHRhcmdldE5hbWUpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuLy8gLS0tLSBBbm51YWwgc2F2aW5ncyBnb2FsIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldEFubnVhbFNhdmluZ3NHb2FsQWN0aW9uKGFtb3VudDogbnVtYmVyKSB7XG4gIGF3YWl0IHNldEFubnVhbFNhdmluZ3NHb2FsKGFtb3VudCk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xuICByZXZhbGlkYXRlUGF0aChcIi9cIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZXRBbm51YWxHb2FsRm9yWWVhckFjdGlvbihcbiAgeWVhcjogbnVtYmVyIHwgXCJkZWZhdWx0XCIsXG4gIGFtb3VudDogbnVtYmVyLFxuKSB7XG4gIGF3YWl0IHNldEFubnVhbEdvYWxGb3JZZWFyKHllYXIsIGFtb3VudCk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xuICByZXZhbGlkYXRlUGF0aChcIi9cIik7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3llYXIvW3llYXJdXCIsIFwicGFnZVwiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldElycmVndWxhckV4cGVuc2VDYXRlZ29yaWVzRm9yWWVhckFjdGlvbihcbiAgeWVhcjogbnVtYmVyLFxuICBjYXRlZ29yaWVzOiBzdHJpbmdbXSxcbikge1xuICBhd2FpdCBzZXRJcnJlZ3VsYXJFeHBlbnNlQ2F0ZWdvcmllc0ZvclllYXIoeWVhciwgY2F0ZWdvcmllcyk7XG4gIHJldmFsaWRhdGVQYXRoKGAveWVhci8ke3llYXIgJSAxMDB9YCk7XG59XG5cbi8vIC0tLS0gSW5jb21lIHNvdXJjZSBhY3Rpb25zIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZEluY29tZShuYW1lOiBzdHJpbmcsIGFtb3VudDogbnVtYmVyKSB7XG4gIGF3YWl0IGFkZEluY29tZVNvdXJjZShuYW1lLCBhbW91bnQpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUluY29tZShcbiAgb2xkTmFtZTogc3RyaW5nLFxuICBuYW1lOiBzdHJpbmcsXG4gIGFtb3VudDogbnVtYmVyLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZUluY29tZVNvdXJjZShvbGROYW1lLCBuYW1lLCBhbW91bnQpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbW92ZUluY29tZShuYW1lOiBzdHJpbmcpIHtcbiAgYXdhaXQgcmVtb3ZlSW5jb21lU291cmNlKG5hbWUpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZU1vbnRoSW5jb21lQWN0aW9uKFxuICBzaGVldFRpdGxlOiBzdHJpbmcsXG4gIGVudHJpZXM6IEluY29tZVNvdXJjZVtdLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZU1vbnRoSW5jb21lKHNoZWV0VGl0bGUsIGVudHJpZXMpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlTW9udGhBbGxvY2F0aW9uc0FjdGlvbihcbiAgc2hlZXRUaXRsZTogc3RyaW5nLFxuICB5ZWFyU3VmZml4OiBudW1iZXIsXG4gIGFsbG9jYXRpb25zOiBNb250aEFsbG9jYXRpb25bXSxcbikge1xuICBhd2FpdCB1cGRhdGVNb250aEFsbG9jYXRpb25zKHNoZWV0VGl0bGUsIGFsbG9jYXRpb25zKTtcbiAgcmV2YWxpZGF0ZVBhdGgoYC95ZWFyLyR7eWVhclN1ZmZpeH1gKTtcbn1cblxuLy8gLS0tLSBWYWNhdGlvbiBhY3Rpb25zIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVZhY2F0aW9uKG5hbWU6IHN0cmluZywgeWVhclN1ZmZpeDogbnVtYmVyKSB7XG4gIGF3YWl0IGNyZWF0ZVZhY2F0aW9uU2hlZXQobmFtZSwgeWVhclN1ZmZpeCk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL1wiKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRWYWNhdGlvblRyYW5zYWN0aW9uKFxuICBzaGVldFRpdGxlOiBzdHJpbmcsXG4gIGRhdGE6IFRyYW5zYWN0aW9uSW5wdXQsXG4pOiBQcm9taXNlPG51bWJlcj4ge1xuICByZXR1cm4gYXBwZW5kVHJhbnNhY3Rpb24oc2hlZXRUaXRsZSwgYnVpbGRUcmFuc2FjdGlvblZhbHVlcyhkYXRhLCB0cnVlKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBlZGl0VmFjYXRpb25UcmFuc2FjdGlvbihcbiAgc2hlZXRUaXRsZTogc3RyaW5nLFxuICByb3c6IG51bWJlcixcbiAgZGF0YTogVHJhbnNhY3Rpb25JbnB1dCxcbikge1xuICBhd2FpdCB1cGRhdGVUcmFuc2FjdGlvbihzaGVldFRpdGxlLCByb3csIGJ1aWxkVHJhbnNhY3Rpb25WYWx1ZXMoZGF0YSwgdHJ1ZSkpO1xufVxuXG5leHBvcnQgY29uc3QgZGVsZXRlVmFjYXRpb25UcmFuc2FjdGlvbiA9IGRlbGV0ZVRyYW5zYWN0aW9uO1xuXG4vLyAtLS0tIEJ1bGsgZWRpdCAtLS0tXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBidWxrRWRpdFRyYW5zYWN0aW9ucyhcbiAgc2hlZXRUaXRsZTogc3RyaW5nLFxuICB1cGRhdGVzOiB7IHJvdzogbnVtYmVyOyBjYXRlZ29yeT86IHN0cmluZzsgY2FyZD86IHN0cmluZyB9W10sXG4pIHtcbiAgYXdhaXQgYmF0Y2hVcGRhdGVGaWVsZHMoc2hlZXRUaXRsZSwgZmFsc2UsIHVwZGF0ZXMpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYnVsa0VkaXRWYWNhdGlvblRyYW5zYWN0aW9ucyhcbiAgc2hlZXRUaXRsZTogc3RyaW5nLFxuICB1cGRhdGVzOiB7IHJvdzogbnVtYmVyOyBjYXRlZ29yeT86IHN0cmluZzsgY2FyZD86IHN0cmluZyB9W10sXG4pIHtcbiAgYXdhaXQgYmF0Y2hVcGRhdGVGaWVsZHMoc2hlZXRUaXRsZSwgdHJ1ZSwgdXBkYXRlcyk7XG59XG5cbi8vIC0tLS0gQnVsayBkZWxldGUgLS0tLVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYnVsa0RlbGV0ZVRyYW5zYWN0aW9ucyhcbiAgc2hlZXRUaXRsZTogc3RyaW5nLFxuICByb3dzOiBudW1iZXJbXSxcbikge1xuICBhd2FpdCBQcm9taXNlLmFsbChyb3dzLm1hcCgocm93KSA9PiBjbGVhclRyYW5zYWN0aW9uKHNoZWV0VGl0bGUsIHJvdykpKTtcbn1cblxuZXhwb3J0IGNvbnN0IGJ1bGtEZWxldGVWYWNhdGlvblRyYW5zYWN0aW9ucyA9IGJ1bGtEZWxldGVUcmFuc2FjdGlvbnM7XG5cbi8vIC0tLS0gTW92ZSB0byB2YWNhdGlvbiAtLS0tXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBidWxrTW92ZVRvVmFjYXRpb25BY3Rpb24oXG4gIHNvdXJjZVRpdGxlOiBzdHJpbmcsXG4gIGRlc3RUaXRsZTogc3RyaW5nLFxuICByb3dzOiBudW1iZXJbXSxcbiAgdHJhbnNhY3Rpb25zOiBUcmFuc2FjdGlvbklucHV0W10sXG4pIHtcbiAgYXdhaXQgYmF0Y2hJbXBvcnRUcmFuc2FjdGlvbnMoZGVzdFRpdGxlLCB0cmFuc2FjdGlvbnMsIHRydWUpO1xuICBhd2FpdCBQcm9taXNlLmFsbChyb3dzLm1hcCgocm93KSA9PiBjbGVhclRyYW5zYWN0aW9uKHNvdXJjZVRpdGxlLCByb3cpKSk7XG59XG5cbi8vIC0tLS0gQmF0Y2ggaW1wb3J0IC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZFRyYW5zYWN0aW9uc0JhdGNoKFxuICBzaGVldFRpdGxlOiBzdHJpbmcsXG4gIHRyYW5zYWN0aW9uczogVHJhbnNhY3Rpb25JbnB1dFtdLFxuICBpc1ZhY2F0aW9uID0gZmFsc2UsXG4pOiBQcm9taXNlPG51bWJlcj4ge1xuICByZXR1cm4gYmF0Y2hJbXBvcnRUcmFuc2FjdGlvbnMoc2hlZXRUaXRsZSwgdHJhbnNhY3Rpb25zLCBpc1ZhY2F0aW9uKTtcbn1cblxuLy8gLS0tLSBEZWJvdW5jZWQgcmV2YWxpZGF0aW9uIChjYWxsZWQgYnkgY2xpZW50KSAtLS0tXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXZhbGlkYXRlUGFnZUFjdGlvbihwYXRoOiBzdHJpbmcpIHtcbiAgcmV2YWxpZGF0ZVBhdGgocGF0aCk7XG59XG5cbi8vIC0tLS0gU2hlZXQgcmVuYW1lIGFjdGlvbiAtLS0tXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW5hbWVTaGVldEFjdGlvbihzaGVldElkOiBudW1iZXIsIG5ld1RpdGxlOiBzdHJpbmcsIHBhZ2VQYXRoPzogc3RyaW5nKSB7XG4gIGF3YWl0IHJlbmFtZVNoZWV0KHNoZWV0SWQsIG5ld1RpdGxlKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvXCIpO1xuICBpZiAocGFnZVBhdGgpIHJldmFsaWRhdGVQYXRoKHBhZ2VQYXRoKTtcbn1cblxuLyoqIE1vdmUgc2hlZXRJZCB0byBiZSBpbW1lZGlhdGVseSBhZnRlciBhZnRlclNoZWV0SWQgKG9yIHRvIGZpcnN0IHBvc2l0aW9uIGlmIG51bGwpLlxuICogIGFmdGVyU2hlZXRJZCBpcyB0aGUgc2hlZXRJZCBvZiB0aGUgcHJlY2VkaW5nIHNpYmxpbmcgaW4gdGhlIG5ldyBvcmRlci4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtb3ZlU2hlZXRBZnRlckFjdGlvbihzaGVldElkOiBudW1iZXIsIGFmdGVyU2hlZXRJZDogbnVtYmVyIHwgbnVsbCkge1xuICBjb25zdCBhbGxTaGVldHNSYXcgPSBhd2FpdCBsaXN0U2hlZXRzKCk7XG4gIC8vIGxpc3RTaGVldHMgcmV0dXJucyBzaGVldHMgc29ydGVkIGJ5IHRoZWlyIG5hdHVyYWwgb3JkZXIgZnJvbSB0aGUgQVBJXG4gIGxldCB0YXJnZXRJbmRleDogbnVtYmVyO1xuICBpZiAoYWZ0ZXJTaGVldElkID09PSBudWxsKSB7XG4gICAgdGFyZ2V0SW5kZXggPSAwO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGFmdGVyUG9zID0gYWxsU2hlZXRzUmF3LmZpbmRJbmRleCgocykgPT4gcy5zaGVldElkID09PSBhZnRlclNoZWV0SWQpO1xuICAgIHRhcmdldEluZGV4ID0gYWZ0ZXJQb3MgPj0gMCA/IGFmdGVyUG9zICsgMSA6IGFsbFNoZWV0c1Jhdy5sZW5ndGg7XG4gIH1cbiAgYXdhaXQgbW92ZVNoZWV0KHNoZWV0SWQsIHRhcmdldEluZGV4KTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvXCIpO1xufVxuXG4vLyAtLS0tIEF1dG8tY3JlYXRpb24gYWN0aW9uIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGVuc3VyZUN1cnJlbnRTaGVldHNBY3Rpb24oKSB7XG4gIGNvbnN0IHNoZWV0cyA9IGF3YWl0IGxpc3RTaGVldHMoKTtcbiAgY29uc3QgY3JlYXRlZCA9IGF3YWl0IGVuc3VyZUN1cnJlbnRTaGVldHMoc2hlZXRzKTtcbiAgaWYgKGNyZWF0ZWQpIHtcbiAgICByZXZhbGlkYXRlUGF0aChcIi9cIik7XG4gIH1cbiAgcmV0dXJuIGNyZWF0ZWQ7XG59XG5cbi8vIC0tLS0gQnVsayB0ZW50YXRpdmUgdG9nZ2xlIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJ1bGtUb2dnbGVUZW50YXRpdmUoXG4gIHNoZWV0VGl0bGU6IHN0cmluZyxcbiAgcm93czogbnVtYmVyW10sXG4gIHRlbnRhdGl2ZTogYm9vbGVhbixcbikge1xuICBhd2FpdCBiYXRjaFRvZ2dsZVRlbnRhdGl2ZUZsYWcoc2hlZXRUaXRsZSwgcm93cywgdGVudGF0aXZlKTtcbn1cblxuZXhwb3J0IGNvbnN0IGJ1bGtUb2dnbGVWYWNhdGlvblRlbnRhdGl2ZSA9IGJ1bGtUb2dnbGVUZW50YXRpdmU7XG5cbi8vIC0tLS0gTW9udGggZG9uZSB0b2dnbGUgLS0tLVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdG9nZ2xlTW9udGhEb25lQWN0aW9uKHNoZWV0VGl0bGU6IHN0cmluZywgZG9uZTogYm9vbGVhbikge1xuICBhd2FpdCBzZXRNb250aERvbmUoc2hlZXRUaXRsZSwgZG9uZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL1wiKTtcbn1cblxuLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vLyBTdG9jayBzZXR0aW5ncyBhY3Rpb25zXG4vLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZFN0b2NrKFxuICBzeW1ib2w6IHN0cmluZyxcbiAgZGlzcGxheU5hbWU6IHN0cmluZyxcbiAgc291cmNlOiBQcmljZVNvdXJjZSxcbiAgY3VycmVuY3k6IFN0b2NrQ3VycmVuY3ksXG4gIGxhYmVsOiBzdHJpbmcgPSBcIlwiLFxuKSB7XG4gIGF3YWl0IGFkZFN0b2NrRGVmaW5pdGlvbihzeW1ib2wsIGRpc3BsYXlOYW1lLCBzb3VyY2UsIGN1cnJlbmN5LCBsYWJlbCk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlU3RvY2soXG4gIG9sZFN5bWJvbDogc3RyaW5nLFxuICBzeW1ib2w6IHN0cmluZyxcbiAgZGlzcGxheU5hbWU6IHN0cmluZyxcbiAgc291cmNlOiBQcmljZVNvdXJjZSxcbiAgY3VycmVuY3k6IFN0b2NrQ3VycmVuY3ksXG4gIGxhYmVsOiBzdHJpbmcgPSBcIlwiLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZVN0b2NrRGVmaW5pdGlvbihvbGRTeW1ib2wsIHN5bWJvbCwgZGlzcGxheU5hbWUsIHNvdXJjZSwgY3VycmVuY3ksIGxhYmVsKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW1vdmVTdG9jayhzeW1ib2w6IHN0cmluZykge1xuICBhd2FpdCByZW1vdmVTdG9ja0RlZmluaXRpb24oc3ltYm9sKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRCcm9rZXIoXG4gIG5hbWU6IHN0cmluZyxcbiAgbWdtdEZlZTogbnVtYmVyLFxuICBwdXJjaGFzZUZlZTogbnVtYmVyLFxuKSB7XG4gIGF3YWl0IGFkZEJyb2tlckNvbmZpZyhuYW1lLCBtZ210RmVlLCBwdXJjaGFzZUZlZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlQnJva2VyKFxuICBvbGROYW1lOiBzdHJpbmcsXG4gIG5hbWU6IHN0cmluZyxcbiAgbWdtdEZlZTogbnVtYmVyLFxuICBwdXJjaGFzZUZlZTogbnVtYmVyLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZUJyb2tlckNvbmZpZyhvbGROYW1lLCBuYW1lLCBtZ210RmVlLCBwdXJjaGFzZUZlZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVtb3ZlQnJva2VyKG5hbWU6IHN0cmluZykge1xuICBhd2FpdCByZW1vdmVCcm9rZXJDb25maWcobmFtZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYWRkR29hbChcbiAgdGVybTogSW52ZXN0bWVudFRlcm0sXG4gIGxhYmVsOiBzdHJpbmcsXG4gIHRhcmdldEFtb3VudDogbnVtYmVyLFxuKSB7XG4gIGF3YWl0IGFkZFN0b2NrR29hbCh0ZXJtLCBsYWJlbCwgdGFyZ2V0QW1vdW50KTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVHb2FsKFxuICBvbGRMYWJlbDogc3RyaW5nLFxuICB0ZXJtOiBJbnZlc3RtZW50VGVybSxcbiAgbGFiZWw6IHN0cmluZyxcbiAgdGFyZ2V0QW1vdW50OiBudW1iZXIsXG4pIHtcbiAgYXdhaXQgdXBkYXRlU3RvY2tHb2FsKG9sZExhYmVsLCB0ZXJtLCBsYWJlbCwgdGFyZ2V0QW1vdW50KTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW1vdmVHb2FsKGxhYmVsOiBzdHJpbmcpIHtcbiAgYXdhaXQgcmVtb3ZlU3RvY2tHb2FsKGxhYmVsKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbi8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gTGFiZWwgYWxsb2NhdGlvbiBhY3Rpb25zXG4vLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNhdmVMYWJlbEFsbG9jYXRpb25zQWN0aW9uKFxuICBhbGxvY2F0aW9uczogTGFiZWxBbGxvY2F0aW9uW10sXG4pIHtcbiAgYXdhaXQgc2F2ZUxhYmVsQWxsb2NhdGlvbnMoYWxsb2NhdGlvbnMpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zdG9ja3NcIik7XG59XG5cbi8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gU3RvY2sgdHJhbnNhY3Rpb24gYWN0aW9uc1xuLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRTdG9ja1RyYW5zYWN0aW9uQWN0aW9uKFxuICBkYXRlOiBzdHJpbmcsXG4gIHR5cGU6IFRyYW5zYWN0aW9uVHlwZSxcbiAgc3ltYm9sOiBzdHJpbmcsXG4gIHF1YW50aXR5OiBudW1iZXIsXG4gIHByaWNlUGVyVW5pdElMUzogbnVtYmVyLFxuICBjdXJyZW5jeTogU3RvY2tDdXJyZW5jeSxcbiAgdGVybTogSW52ZXN0bWVudFRlcm0sXG4gIGJhbms6IHN0cmluZyxcbiAgcHVyY2hhc2VGZWU6IG51bWJlcixcbiAgbm90ZXM6IHN0cmluZyxcbik6IFByb21pc2U8bnVtYmVyPiB7XG4gIGNvbnN0IHJvdyA9IGF3YWl0IGFkZFN0b2NrVHgoXG4gICAgZGF0ZSxcbiAgICB0eXBlLFxuICAgIHN5bWJvbCxcbiAgICBxdWFudGl0eSxcbiAgICBwcmljZVBlclVuaXRJTFMsXG4gICAgY3VycmVuY3ksXG4gICAgdGVybSxcbiAgICBiYW5rLFxuICAgIHB1cmNoYXNlRmVlLFxuICAgIG5vdGVzLFxuICApO1xuICByZXZhbGlkYXRlUGF0aChcIi9zdG9ja3NcIik7XG4gIHJldHVybiByb3c7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBlZGl0U3RvY2tUcmFuc2FjdGlvbkFjdGlvbihcbiAgcm93OiBudW1iZXIsXG4gIGRhdGU6IHN0cmluZyxcbiAgdHlwZTogVHJhbnNhY3Rpb25UeXBlLFxuICBzeW1ib2w6IHN0cmluZyxcbiAgcXVhbnRpdHk6IG51bWJlcixcbiAgcHJpY2VQZXJVbml0SUxTOiBudW1iZXIsXG4gIGN1cnJlbmN5OiBTdG9ja0N1cnJlbmN5LFxuICB0ZXJtOiBJbnZlc3RtZW50VGVybSxcbiAgYmFuazogc3RyaW5nLFxuICBwdXJjaGFzZUZlZTogbnVtYmVyLFxuICBub3Rlczogc3RyaW5nLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZVN0b2NrVHgoXG4gICAgcm93LFxuICAgIGRhdGUsXG4gICAgdHlwZSxcbiAgICBzeW1ib2wsXG4gICAgcXVhbnRpdHksXG4gICAgcHJpY2VQZXJVbml0SUxTLFxuICAgIGN1cnJlbmN5LFxuICAgIHRlcm0sXG4gICAgYmFuayxcbiAgICBwdXJjaGFzZUZlZSxcbiAgICBub3RlcyxcbiAgKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc3RvY2tzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlU3RvY2tUcmFuc2FjdGlvbkFjdGlvbihyb3c6IG51bWJlcikge1xuICBhd2FpdCBkZWxldGVTdG9ja1R4KHJvdyk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3N0b2Nrc1wiKTtcbn1cblxuLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vLyBQb3J0Zm9saW8gaGlzdG9yeSBhY3Rpb25cbi8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0UG9ydGZvbGlvSGlzdG9yeUFjdGlvbihcbiAgcmFuZ2U6IENoYXJ0UmFuZ2UsXG4gIHRlcm0/OiBJbnZlc3RtZW50VGVybSxcbik6IFByb21pc2U8UG9ydGZvbGlvSGlzdG9yeVBvaW50W10+IHtcbiAgY29uc3QgeyBnZXRQb3J0Zm9saW9IaXN0b3J5IH0gPSBhd2FpdCBpbXBvcnQoXCIuL3N0b2NrLWRhc2hib2FyZFwiKTtcbiAgcmV0dXJuIGdldFBvcnRmb2xpb0hpc3RvcnkocmFuZ2UsIHsgdGVybSB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFBvcnRmb2xpb1JldHVybnNBY3Rpb24oXG4gIHRlcm0/OiBJbnZlc3RtZW50VGVybSxcbik6IFByb21pc2U8UG9ydGZvbGlvUmV0dXJucz4ge1xuICBjb25zdCB7IGdldFBvcnRmb2xpb0hpc3RvcnksIGNvbXB1dGVQb3J0Zm9saW9SZXR1cm5zIH0gPSBhd2FpdCBpbXBvcnQoXCIuL3N0b2NrLWRhc2hib2FyZFwiKTtcbiAgY29uc3QgeyBnZXRTdG9ja0NvbmZpZywgc2F2ZVllYXJSZXR1cm5zIH0gPSBhd2FpdCBpbXBvcnQoXCIuL2dvb2dsZS1zaGVldHNcIik7XG5cbiAgY29uc3QgY29uZmlnID0gYXdhaXQgZ2V0U3RvY2tDb25maWcoKTtcbiAgY29uc3QgeyBzYXZlZFllYXJSZXR1cm5zIH0gPSBjb25maWc7XG5cbiAgLy8gT3B0aW1hbCBmZXRjaCBzdGFydDogY292ZXIgcm9sbGluZyAzeXIgcGVyaW9kcyBBTkQgYWxsIHVuY2FjaGVkIGNvbXBsZXRlIHllYXJzLlxuICAvLyBJZiBhbGwgeWVhcnMgdXAgdG8gKGN1cnJlbnRZZWFyLTEpIGFyZSBjYWNoZWQsIG9ubHkgZmV0Y2ggM3lyIG9mIGRhdGEuXG4gIGNvbnN0IGN1cnJlbnRZZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICBjb25zdCB0aHJlZVllYXJzQWdvRGF0ZSA9IG5ldyBEYXRlKCk7XG4gIHRocmVlWWVhcnNBZ29EYXRlLnNldEZ1bGxZZWFyKHRocmVlWWVhcnNBZ29EYXRlLmdldEZ1bGxZZWFyKCkgLSAzKTtcbiAgY29uc3QgdGhyZWVZZWFyc0FnbyA9IHRocmVlWWVhcnNBZ29EYXRlLnRvSVNPU3RyaW5nKCkuc3BsaXQoXCJUXCIpWzBdO1xuXG4gIC8vIEZpbmQgdGhlIGVhcmxpZXN0IGNvbXBsZXRlIHllYXIgbm90IHlldCBjYWNoZWRcbiAgbGV0IGVhcmxpZXN0VW5jYWNoZWRZZWFyOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgLy8gV2UgbG9vayBmcm9tIGEgcmVhc29uYWJsZSBtaW5pbXVtICgyMDE1KSB0byBhdm9pZCBmZXRjaGluZyB0b28gZmFyIGJhY2tcbiAgZm9yIChsZXQgeSA9IDIwMTU7IHkgPCBjdXJyZW50WWVhcjsgeSsrKSB7XG4gICAgaWYgKCEoeSBpbiBzYXZlZFllYXJSZXR1cm5zKSkge1xuICAgICAgZWFybGllc3RVbmNhY2hlZFllYXIgPSB5O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLy8gU3RhcnQgZGF0ZTogZWFybGllciBvZiAoM3lyIGFnbykgYW5kIChKYW4gMSBvZiBlYXJsaWVzdCB1bmNhY2hlZCB5ZWFyKVxuICBsZXQgc3RhcnREYXRlID0gdGhyZWVZZWFyc0FnbztcbiAgaWYgKGVhcmxpZXN0VW5jYWNoZWRZZWFyICE9PSBudWxsKSB7XG4gICAgY29uc3QgdW5jYWNoZWRTdGFydCA9IGAke2VhcmxpZXN0VW5jYWNoZWRZZWFyfS0wMS0wMWA7XG4gICAgaWYgKHVuY2FjaGVkU3RhcnQgPCBzdGFydERhdGUpIHN0YXJ0RGF0ZSA9IHVuY2FjaGVkU3RhcnQ7XG4gIH1cblxuICBjb25zdCBoaXN0b3J5ID0gYXdhaXQgZ2V0UG9ydGZvbGlvSGlzdG9yeShcIk1heFwiLCB7XG4gICAgZG93bnNhbXBsZTogZmFsc2UsXG4gICAgdGVybSxcbiAgICBzdGFydERhdGVPdmVycmlkZTogc3RhcnREYXRlLFxuICB9KTtcblxuICBjb25zdCByZXR1cm5zID0gY29tcHV0ZVBvcnRmb2xpb1JldHVybnMoaGlzdG9yeSwgc2F2ZWRZZWFyUmV0dXJucyk7XG5cbiAgLy8gU2F2ZSBuZXdseSBjb21wdXRlZCBjb21wbGV0ZSB5ZWFycyDigJQgb25seSBpZiB3ZSBoYXZlIGhpZ2gtY29uZmlkZW5jZSBkYXRhLlxuICAvLyBBIHllYXIgcXVhbGlmaWVzIHdoZW46XG4gIC8vIDEuIE5vdCBhbHJlYWR5IGNhY2hlZCAobmV2ZXIgb3ZlcndyaXRlIGV4aXN0aW5nKVxuICAvLyAyLiBDb21wdXRlZCByZXR1cm4gaXMgbm9uLW51bGxcbiAgLy8gMy4gSGlzdG9yeSBoYXMg4omlMjAwIHBvaW50cyB3aXRoaW4gdGhhdCB5ZWFyIChuZWFybHkgYWxsIHRyYWRpbmcgZGF5cylcbiAgLy8gNC4gSGlzdG9yeSBjb3ZlcnMgSmFuIDHigJMxNSBBTkQgTm92IDHigJNEZWMgMzEgb2YgdGhhdCB5ZWFyIChmdWxsIHllYXIgZmV0Y2hlZClcbiAgY29uc3QgbmV3RW50cmllczogUmVjb3JkPG51bWJlciwgbnVtYmVyPiA9IHt9O1xuICBmb3IgKGNvbnN0IHsgeWVhciwgcmV0dXJuUGVyY2VudCB9IG9mIHJldHVybnMuYW5udWFsKSB7XG4gICAgaWYgKHJldHVyblBlcmNlbnQgPT09IG51bGwpIGNvbnRpbnVlO1xuICAgIGlmICh5ZWFyIGluIHNhdmVkWWVhclJldHVybnMpIGNvbnRpbnVlOyAvLyBuZXZlciBvdmVyd3JpdGVcblxuICAgIC8vIENvdW50IHBvaW50cyBhbmQgY2hlY2sgY292ZXJhZ2VcbiAgICBjb25zdCB5ZWFyUG9pbnRzID0gaGlzdG9yeS5maWx0ZXIoKHApID0+IHAuZGF0ZS5zdGFydHNXaXRoKGAke3llYXJ9LWApKTtcbiAgICBpZiAoeWVhclBvaW50cy5sZW5ndGggPCAyMDApIGNvbnRpbnVlO1xuXG4gICAgY29uc3QgZmlyc3QgPSB5ZWFyUG9pbnRzWzBdLmRhdGU7XG4gICAgY29uc3QgbGFzdCA9IHllYXJQb2ludHNbeWVhclBvaW50cy5sZW5ndGggLSAxXS5kYXRlO1xuICAgIGNvbnN0IGNvdmVyc1N0YXJ0ID0gZmlyc3QgPD0gYCR7eWVhcn0tMDEtMTVgO1xuICAgIGNvbnN0IGNvdmVyc0VuZCA9IGxhc3QgPj0gYCR7eWVhcn0tMTEtMDFgO1xuICAgIGlmICghY292ZXJzU3RhcnQgfHwgIWNvdmVyc0VuZCkgY29udGludWU7XG5cbiAgICBuZXdFbnRyaWVzW3llYXJdID0gcmV0dXJuUGVyY2VudDtcbiAgfVxuXG4gIGlmIChPYmplY3Qua2V5cyhuZXdFbnRyaWVzKS5sZW5ndGggPiAwKSB7XG4gICAgYXdhaXQgc2F2ZVllYXJSZXR1cm5zKHsgLi4uc2F2ZWRZZWFyUmV0dXJucywgLi4ubmV3RW50cmllcyB9KTtcbiAgfVxuXG4gIHJldHVybiByZXR1cm5zO1xufVxuXG4vLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIE5WSURJQSBSU1UgYWN0aW9uc1xuLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbi8qKlxuICogQWRkIGFuIFJTVSBncmFudCB3aXRoIGF1dG8tZ2VuZXJhdGVkIHZlc3Qgcm93cyAoNy1jb2x1bW4gZm9ybWF0KS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZFJzdUdyYW50QWN0aW9uKFxuICBncmFudERhdGU6IHN0cmluZyxcbiAgdG90YWxTaGFyZXM6IG51bWJlcixcbiAgY29zdFBlclNoYXJlOiBudW1iZXIsXG4gIHZlc3RzOiB7IHZlc3REYXRlOiBzdHJpbmc7IHNoYXJlczogbnVtYmVyIH1bXSxcbiAgZ3JhbnROYW1lOiBzdHJpbmcgPSBcIlwiLFxuKSB7XG4gIGlmICh2ZXN0cy5sZW5ndGggPT09IDApIHJldHVybjtcblxuICBjb25zdCByb3dzOiBzdHJpbmdbXVtdID0gdmVzdHMubWFwKCh2KSA9PiBbXG4gICAgZ3JhbnREYXRlLFxuICAgIFN0cmluZyh0b3RhbFNoYXJlcyksXG4gICAgdi52ZXN0RGF0ZSxcbiAgICBTdHJpbmcodi5zaGFyZXMpLFxuICAgIGNvc3RQZXJTaGFyZSA+IDAgPyBTdHJpbmcoY29zdFBlclNoYXJlKSA6IFwiXCIsXG4gICAgXCJcIiwgLy8gbm90ZXNcbiAgICBncmFudE5hbWUsXG4gICAgXCJcIiwgLy8gbm90IHNvbGRcbiAgXSk7XG5cbiAgYXdhaXQgYWRkUnN1VmVzdFJvd3Mocm93cyk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL252aWRpYVwiKTtcbn1cblxuLyoqXG4gKiBVcGRhdGUgYW4gUlNVIHZlc3Qgcm93ICg3LWNvbHVtbiBmb3JtYXQpLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlUnN1VmVzdEFjdGlvbihcbiAgcm93OiBudW1iZXIsXG4gIGdyYW50RGF0ZTogc3RyaW5nLFxuICB0b3RhbFNoYXJlc0luR3JhbnQ6IG51bWJlcixcbiAgdmVzdERhdGU6IHN0cmluZyxcbiAgc2hhcmVzOiBudW1iZXIsXG4gIHZlc3RQcmljZVVzZDogbnVtYmVyLFxuICBub3Rlczogc3RyaW5nID0gXCJcIixcbiAgZ3JhbnROYW1lOiBzdHJpbmcgPSBcIlwiLFxuICBzb2xkOiBib29sZWFuID0gZmFsc2UsXG4pIHtcbiAgYXdhaXQgdXBkYXRlUnN1Um93KHJvdywgW1xuICAgIGdyYW50RGF0ZSxcbiAgICBTdHJpbmcodG90YWxTaGFyZXNJbkdyYW50KSxcbiAgICB2ZXN0RGF0ZSxcbiAgICBTdHJpbmcoc2hhcmVzKSxcbiAgICB2ZXN0UHJpY2VVc2QgPyBTdHJpbmcodmVzdFByaWNlVXNkKSA6IFwiXCIsXG4gICAgbm90ZXMsXG4gICAgZ3JhbnROYW1lLFxuICAgIHNvbGQgPyBcIlRSVUVcIiA6IFwiXCIsXG4gIF0pO1xuICByZXZhbGlkYXRlUGF0aChcIi9udmlkaWFcIik7XG59XG5cbi8qKlxuICogVG9nZ2xlIHRoZSBzb2xkIGZsYWcgb24gYW4gUlNVIHZlc3Qgcm93LlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdG9nZ2xlUnN1U29sZEFjdGlvbihyb3c6IG51bWJlciwgc29sZDogYm9vbGVhbikge1xuICBhd2FpdCB0b2dnbGVSc3VTb2xkKHJvdywgc29sZCk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL252aWRpYVwiKTtcbn1cblxuLyoqXG4gKiBEZWxldGUgYW4gUlNVIHJvdy5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVJzdVJvd0FjdGlvbihyb3c6IG51bWJlcikge1xuICBhd2FpdCBkZWxldGVSc3VSb3cocm93KTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvbnZpZGlhXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2V0UnN1R3Jvc3NEYXRhQWN0aW9uKGdyb3NzU29GYXI6IG51bWJlciwgbW9udGhseVNhbGFyeTogbnVtYmVyLCBlc3BwTW9udGhseUNvbnRyaWJ1dGlvbjogbnVtYmVyLCBlc3BwUHVyY2hhc2VQcmljZTogbnVtYmVyKSB7XG4gIGF3YWl0IHNldFJzdUdyb3NzRGF0YShncm9zc1NvRmFyLCBtb250aGx5U2FsYXJ5LCBlc3BwTW9udGhseUNvbnRyaWJ1dGlvbiwgZXNwcFB1cmNoYXNlUHJpY2UpO1xuICByZXZhbGlkYXRlUGF0aChcIi9udmlkaWFcIik7XG59XG5cbi8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gUGVuc2lvbiBhY3Rpb25zXG4vLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFBlbnNpb25EYXRhKCkge1xuICBhd2FpdCBlbnN1cmVQZW5zaW9uU2hlZXQoKTtcbiAgY29uc3QgZnVuZHMgPSBhd2FpdCBnZXRQZW5zaW9uRnVuZHMoKTtcbiAgcmV0dXJuIHsgZnVuZHMgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZFBlbnNpb25GdW5kQWN0aW9uKFxuICBvd25lcjogUGVuc2lvbk93bmVyLFxuICBuYW1lOiBzdHJpbmcsXG4gIHR5cGU6IFBlbnNpb25GdW5kVHlwZSxcbiAgdHJhY2s6IHN0cmluZyxcbiAgYmFsYW5jZTogbnVtYmVyLFxuICBjb21wYW55OiBzdHJpbmcsXG4pIHtcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5zcGxpdChcIlRcIilbMF07XG4gIGF3YWl0IGFkZFBlbnNpb25GdW5kKG93bmVyLCBuYW1lLCB0eXBlLCB0cmFjaywgYmFsYW5jZSwgZGF0ZSwgY29tcGFueSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3BlbnNpb25cIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVQZW5zaW9uRnVuZEFjdGlvbihcbiAgcm93OiBudW1iZXIsXG4gIG93bmVyOiBQZW5zaW9uT3duZXIsXG4gIG5hbWU6IHN0cmluZyxcbiAgdHlwZTogUGVuc2lvbkZ1bmRUeXBlLFxuICB0cmFjazogc3RyaW5nLFxuICBiYWxhbmNlOiBudW1iZXIsXG4gIGNvbXBhbnk6IHN0cmluZyxcbikge1xuICBjb25zdCBkYXRlID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnNwbGl0KFwiVFwiKVswXTtcbiAgYXdhaXQgdXBkYXRlUGVuc2lvbkZ1bmQocm93LCBvd25lciwgbmFtZSwgdHlwZSwgdHJhY2ssIGJhbGFuY2UsIGRhdGUsIGNvbXBhbnkpO1xuICByZXZhbGlkYXRlUGF0aChcIi9wZW5zaW9uXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlUGVuc2lvbkZ1bmRBY3Rpb24ocm93OiBudW1iZXIpIHtcbiAgYXdhaXQgZGVsZXRlUGVuc2lvbkZ1bmQocm93KTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvcGVuc2lvblwiKTtcbn1cblxuLyoqXG4gKiBTZWFyY2ggZXhwZW5zZSBuYW1lcyBhY3Jvc3MgYWxsIG1vbnRobHkgKyB2YWNhdGlvbiBzaGVldHMuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZWFyY2hBbGxTaGVldHNBY3Rpb24ocXVlcnk6IHN0cmluZykge1xuICBpZiAoIXF1ZXJ5IHx8IHF1ZXJ5LnRyaW0oKS5sZW5ndGggPCAyKSByZXR1cm4gW107XG5cbiAgY29uc3QgYWxsU2hlZXRzID0gYXdhaXQgbGlzdFNoZWV0cygpO1xuICBjb25zdCBzZWFyY2hhYmxlID0gYWxsU2hlZXRzLmZpbHRlcihcbiAgICAocykgPT4gcy50eXBlID09PSBcIm1vbnRobHlcIiB8fCBzLnR5cGUgPT09IFwidmFjYXRpb25cIixcbiAgKTtcblxuICBjb25zdCB7IHNlYXJjaEFsbFNoZWV0cyB9ID0gYXdhaXQgaW1wb3J0KFwiLi9nb29nbGUtc2hlZXRzXCIpO1xuICByZXR1cm4gc2VhcmNoQWxsU2hlZXRzKHF1ZXJ5LnRyaW0oKSwgc2VhcmNoYWJsZSk7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IndTQStic0IsbU1BQUEifQ==
}),
"[project]/dev/mezumani/src/components/theme-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$hooks$2f$use$2d$local$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/mezumani/src/hooks/use-local-storage.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    theme: "light",
    toggleTheme: ()=>{}
});
function useTheme() {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
}
_s(useTheme, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
function ThemeProvider({ children }) {
    _s1();
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$hooks$2f$use$2d$local$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocalStorage"])("theme", "light");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            document.documentElement.setAttribute("data-bs-theme", theme);
        }
    }["ThemeProvider.useEffect"], [
        theme
    ]);
    function toggleTheme() {
        setTheme(theme === "light" ? "dark" : "light");
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: {
            theme,
            toggleTheme
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/dev/mezumani/src/components/theme-provider.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
_s1(ThemeProvider, "YGS+s8CVEWRviNom18nwlIGWkHI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$hooks$2f$use$2d$local$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocalStorage"]
    ];
});
_c = ThemeProvider;
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/dev/mezumani/src/components/sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$hooks$2f$use$2d$local$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/mezumani/src/hooks/use-local-storage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/mezumani/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$lib$2f$data$3a$86372d__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/dev/mezumani/src/lib/data:86372d [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$lib$2f$data$3a$f171e7__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/dev/mezumani/src/lib/data:f171e7 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$lib$2f$data$3a$9b492a__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/dev/mezumani/src/lib/data:9b492a [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$components$2f$theme$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/mezumani/src/components/theme-provider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
function EditableSheetLink({ sheet, href, isActive, yearSuffix }) {
    _s();
    const [editing, setEditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editValue, setEditValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    function startEdit() {
        setEditValue((0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stripYearSuffix"])(sheet.title));
        setEditing(true);
    }
    async function handleSave() {
        const trimmed = editValue.trim();
        if (!trimmed || trimmed === (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stripYearSuffix"])(sheet.title)) {
            setEditing(false);
            return;
        }
        setSubmitting(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$lib$2f$data$3a$86372d__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["renameSheetAction"])(sheet.sheetId, `${trimmed} ${yearSuffix}`);
            setEditing(false);
        } finally{
            setSubmitting(false);
        }
    }
    if (editing) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "sidebar-link px-2 py-1",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                className: "form-control form-control-sm",
                style: {
                    fontSize: "0.85rem"
                },
                value: editValue,
                onChange: (e)=>setEditValue(e.target.value),
                onKeyDown: (e)=>{
                    if (e.key === "Enter") handleSave();
                    if (e.key === "Escape") setEditing(false);
                },
                onBlur: handleSave,
                disabled: submitting,
                autoFocus: true
            }, void 0, false, {
                fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                lineNumber: 55,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
            lineNumber: 54,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: href,
        className: `sidebar-link ${isActive ? "active" : ""}`,
        onDoubleClick: (e)=>{
            e.preventDefault();
            startEdit();
        },
        title: "לחץ פעמיים לשינוי שם",
        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stripYearSuffix"])(sheet.title)
    }, void 0, false, {
        fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
}
_s(EditableSheetLink, "jr9VMsqXwKJXXEGflr8QOw0FBHc=");
_c = EditableSheetLink;
function Sidebar({ yearGroups }) {
    _s1();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { theme, toggleTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$components$2f$theme$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const currentYearSuffix = new Date().getFullYear() % 100;
    const [pinned, setPinned] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$hooks$2f$use$2d$local$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocalStorage"])("sidebar-pinned", false);
    const [mobileOpen, setMobileOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showVacationForm, setShowVacationForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Close sidebar on navigation
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Sidebar.useEffect": ()=>{
            setMobileOpen(false);
        }
    }["Sidebar.useEffect"], [
        pathname
    ]);
    const closeMobile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Sidebar.useCallback[closeMobile]": ()=>setMobileOpen(false)
    }["Sidebar.useCallback[closeMobile]"], []);
    // Drag-to-reorder for vacation lists (keyed by year)
    const [vacationOrders, setVacationOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "Sidebar.useState": ()=>Object.fromEntries(yearGroups.map({
                "Sidebar.useState": (g)=>[
                        g.year,
                        g.vacations
                    ]
            }["Sidebar.useState"]))
    }["Sidebar.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Sidebar.useEffect": ()=>{
            setVacationOrders(Object.fromEntries(yearGroups.map({
                "Sidebar.useEffect": (g)=>[
                        g.year,
                        g.vacations
                    ]
            }["Sidebar.useEffect"])));
        }
    }["Sidebar.useEffect"], [
        yearGroups
    ]);
    const dragItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const dragOver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [vacationName, setVacationName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [vacationSubmitting, setVacationSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    function togglePin() {
        setPinned(!pinned);
    }
    const [expandedYears, setExpandedYears] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "Sidebar.useState": ()=>{
            const initial = new Set();
            if (yearGroups.some({
                "Sidebar.useState": (g)=>g.year === currentYearSuffix
            }["Sidebar.useState"])) {
                initial.add(currentYearSuffix);
            } else if (yearGroups.length > 0) {
                initial.add(yearGroups[0].year);
            }
            return initial;
        }
    }["Sidebar.useState"]);
    const [expandedSections, setExpandedSections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "Sidebar.useState": ()=>{
            const initial = new Set();
            const activeYear = yearGroups.some({
                "Sidebar.useState": (g)=>g.year === currentYearSuffix
            }["Sidebar.useState"]) ? currentYearSuffix : yearGroups[0]?.year;
            if (activeYear !== undefined) {
                initial.add(`${activeYear}-months`);
                initial.add(`${activeYear}-vacations`);
            }
            return initial;
        }
    }["Sidebar.useState"]);
    function toggleSection(key) {
        setExpandedSections((prev)=>{
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    }
    function toggleYear(year) {
        setExpandedYears((prev)=>{
            const next = new Set(prev);
            if (next.has(year)) {
                next.delete(year);
            } else {
                next.add(year);
            }
            return next;
        });
    }
    function isActive(href) {
        return pathname === href;
    }
    async function handleCreateVacation(yearSuffix) {
        const trimmed = vacationName.trim();
        if (!trimmed) return;
        setVacationSubmitting(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$lib$2f$data$3a$f171e7__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["createVacation"])(trimmed, yearSuffix);
            setVacationName("");
            setShowVacationForm(null);
            router.refresh();
        } catch  {
        // silently fail
        } finally{
            setVacationSubmitting(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "mobile-hamburger-btn d-md-none",
                onClick: ()=>setMobileOpen(true),
                "aria-label": "תפריט",
                children: "☰"
            }, void 0, false, {
                fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                lineNumber: 186,
                columnNumber: 7
            }, this),
            mobileOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sidebar-backdrop d-md-none",
                onClick: closeMobile
            }, void 0, false, {
                fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                lineNumber: 196,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: `sidebar${pinned ? " pinned" : ""}${mobileOpen ? " mobile-open" : ""}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "sidebar-header d-flex flex-column align-items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "sidebar-hamburger",
                                style: {
                                    fontSize: "1.5rem",
                                    cursor: "pointer"
                                },
                                children: "☰"
                            }, void 0, false, {
                                fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                lineNumber: 201,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "d-md-none sidebar-expanded-only btn btn-link text-secondary p-0",
                                onClick: closeMobile,
                                style: {
                                    fontSize: "1.5rem",
                                    position: "absolute",
                                    left: "0.75rem",
                                    top: "0.75rem"
                                },
                                children: "✕"
                            }, void 0, false, {
                                fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                lineNumber: 208,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: "/mezumani_logo.png",
                                alt: "Mezumani",
                                width: 200,
                                height: 200,
                                className: "sidebar-logo sidebar-expanded-only",
                                style: {
                                    width: "100%",
                                    height: "auto"
                                }
                            }, void 0, false, {
                                fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                lineNumber: 215,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "sidebar-text fw-bold text-center",
                                style: {
                                    fontSize: "1.1rem",
                                    marginTop: "-0.75rem"
                                },
                                children: "Mezumani"
                            }, void 0, false, {
                                fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                lineNumber: 223,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `sidebar-pin-btn${pinned ? " active" : ""}`,
                                onClick: togglePin,
                                title: pinned ? "בטל הצמדה" : "הצמד סרגל צד",
                                children: pinned ? "◀" : "▶"
                            }, void 0, false, {
                                fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                lineNumber: 229,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                        lineNumber: 200,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "sidebar-nav",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sidebar-section-label",
                                style: {
                                    background: "none",
                                    border: "none",
                                    padding: "0.5rem 1.5rem 0.2rem"
                                },
                                children: "השקעות"
                            }, void 0, false, {
                                fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                lineNumber: 240,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/stocks",
                                className: `sidebar-link ${isActive("/stocks") ? "active" : ""}`,
                                children: "תיק מניות"
                            }, void 0, false, {
                                fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                lineNumber: 250,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/nvidia",
                                className: `sidebar-link ${isActive("/nvidia") ? "active" : ""}`,
                                children: "NVIDIA"
                            }, void 0, false, {
                                fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                lineNumber: 256,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/pension",
                                className: `sidebar-link ${isActive("/pension") ? "active" : ""}`,
                                children: "חיסכון פנסיוני"
                            }, void 0, false, {
                                fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                lineNumber: 262,
                                columnNumber: 9
                            }, this),
                            yearGroups.map((group)=>{
                                const expanded = expandedYears.has(group.year);
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "year-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "year-toggle",
                                            onClick: ()=>toggleYear(group.year),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "year-arrow",
                                                    children: expanded ? "▼" : "◀"
                                                }, void 0, false, {
                                                    fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                                    lineNumber: 277,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "fw-bold",
                                                    children: group.fullYear
                                                }, void 0, false, {
                                                    fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                                    lineNumber: 278,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                            lineNumber: 273,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "year-content",
                                            style: {
                                                maxHeight: expanded ? "1000px" : "0",
                                                overflow: "hidden",
                                                transition: "max-height 200ms ease"
                                            },
                                            children: [
                                                group.months.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: `/year/${group.year}`,
                                                    className: `sidebar-link ${isActive(`/year/${group.year}`) ? "active" : ""}`,
                                                    children: "סיכום שנתי"
                                                }, void 0, false, {
                                                    fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                                    lineNumber: 290,
                                                    columnNumber: 19
                                                }, this),
                                                group.months.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "sidebar-section-label",
                                                            onClick: ()=>toggleSection(`${group.year}-months`),
                                                            style: {
                                                                background: "none",
                                                                border: "none",
                                                                cursor: "pointer",
                                                                width: "100%",
                                                                textAlign: "right",
                                                                padding: "0.35rem 0.75rem"
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "year-arrow",
                                                                    style: {
                                                                        fontSize: "0.6rem",
                                                                        marginLeft: 4
                                                                    },
                                                                    children: expandedSections.has(`${group.year}-months`) ? "▼" : "◀"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                                                    lineNumber: 312,
                                                                    columnNumber: 23
                                                                }, this),
                                                                "חודשים"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                                            lineNumber: 300,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                maxHeight: expandedSections.has(`${group.year}-months`) ? "1000px" : "0",
                                                                overflow: "hidden",
                                                                transition: "max-height 200ms ease"
                                                            },
                                                            children: group.months.map((m)=>{
                                                                const href = `/month/${m.sheetId}`;
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditableSheetLink, {
                                                                    sheet: m,
                                                                    href: href,
                                                                    isActive: isActive(href),
                                                                    yearSuffix: group.year
                                                                }, m.sheetId, false, {
                                                                    fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                                                    lineNumber: 334,
                                                                    columnNumber: 27
                                                                }, this);
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                                            lineNumber: 322,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "d-flex align-items-center",
                                                    style: {
                                                        padding: "0.35rem 0.75rem"
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "sidebar-section-label p-0 m-0",
                                                            onClick: ()=>toggleSection(`${group.year}-vacations`),
                                                            style: {
                                                                background: "none",
                                                                border: "none",
                                                                cursor: "pointer",
                                                                textAlign: "right",
                                                                flex: 1
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "year-arrow",
                                                                    style: {
                                                                        fontSize: "0.6rem",
                                                                        marginLeft: 4
                                                                    },
                                                                    children: expandedSections.has(`${group.year}-vacations`) ? "▼" : "◀"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                                                    lineNumber: 362,
                                                                    columnNumber: 21
                                                                }, this),
                                                                "חופשות"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                                            lineNumber: 351,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "sidebar-add-btn",
                                                            onClick: ()=>{
                                                                setShowVacationForm((prev)=>prev === group.year ? null : group.year);
                                                                setVacationName("");
                                                                // Also expand the vacations section
                                                                setExpandedSections((prev)=>{
                                                                    const next = new Set(prev);
                                                                    next.add(`${group.year}-vacations`);
                                                                    return next;
                                                                });
                                                            },
                                                            title: "חופשה חדשה",
                                                            children: "+"
                                                        }, void 0, false, {
                                                            fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                                            lineNumber: 372,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                                    lineNumber: 347,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        maxHeight: expandedSections.has(`${group.year}-vacations`) ? "1000px" : "0",
                                                        overflow: "hidden",
                                                        transition: "max-height 200ms ease"
                                                    },
                                                    children: [
                                                        (vacationOrders[group.year] ?? group.vacations).map((v, idx)=>{
                                                            const href = `/vacation/${v.sheetId}`;
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                draggable: true,
                                                                onDragStart: ()=>{
                                                                    dragItem.current = {
                                                                        year: group.year,
                                                                        index: idx
                                                                    };
                                                                },
                                                                onDragEnter: ()=>{
                                                                    dragOver.current = idx;
                                                                },
                                                                onDragOver: (e)=>e.preventDefault(),
                                                                onDragEnd: async ()=>{
                                                                    const from = dragItem.current;
                                                                    const toIdx = dragOver.current;
                                                                    dragItem.current = null;
                                                                    dragOver.current = null;
                                                                    if (!from || toIdx === null || from.index === toIdx) return;
                                                                    const items = [
                                                                        ...vacationOrders[from.year] ?? group.vacations
                                                                    ];
                                                                    const [moved] = items.splice(from.index, 1);
                                                                    items.splice(toIdx, 0, moved);
                                                                    setVacationOrders((prev)=>({
                                                                            ...prev,
                                                                            [from.year]: items
                                                                        }));
                                                                    // Move after the preceding sibling in the new order
                                                                    const prevSibling = items[toIdx - 1] ?? null;
                                                                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$lib$2f$data$3a$9b492a__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["moveSheetAfterAction"])(moved.sheetId, prevSibling?.sheetId ?? null);
                                                                    router.refresh();
                                                                },
                                                                style: {
                                                                    cursor: "grab"
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditableSheetLink, {
                                                                    sheet: v,
                                                                    href: href,
                                                                    isActive: isActive(href),
                                                                    yearSuffix: group.year
                                                                }, void 0, false, {
                                                                    fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                                                    lineNumber: 426,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, v.sheetId, false, {
                                                                fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                                                lineNumber: 403,
                                                                columnNumber: 23
                                                            }, this);
                                                        }),
                                                        showVacationForm === group.year && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "sidebar-link px-2 py-1",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                className: "form-control form-control-sm",
                                                                style: {
                                                                    fontSize: "0.85rem"
                                                                },
                                                                placeholder: "שם החופשה...",
                                                                value: vacationName,
                                                                onChange: (e)=>setVacationName(e.target.value),
                                                                onKeyDown: (e)=>{
                                                                    if (e.key === "Enter") handleCreateVacation(group.year);
                                                                    if (e.key === "Escape") setShowVacationForm(null);
                                                                },
                                                                disabled: vacationSubmitting,
                                                                autoFocus: true
                                                            }, void 0, false, {
                                                                fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                                                lineNumber: 437,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                                            lineNumber: 436,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                                    lineNumber: 391,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                            lineNumber: 281,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, group.year, true, {
                                    fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                    lineNumber: 272,
                                    columnNumber: 13
                                }, this);
                            })
                        ]
                    }, void 0, true, {
                        fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                        lineNumber: 238,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "sidebar-footer",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "sidebar-link border-0 w-100 text-start",
                                style: {
                                    background: "none",
                                    cursor: "pointer"
                                },
                                onClick: toggleTheme,
                                title: theme === "light" ? "Dark mode" : "Light mode",
                                children: [
                                    theme === "light" ? "🌙" : "☀️",
                                    " ",
                                    theme === "light" ? "Dark mode" : "Light mode"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                lineNumber: 461,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/settings",
                                className: `sidebar-link ${isActive("/settings") ? "active" : ""}`,
                                children: "⚙ הגדרות"
                            }, void 0, false, {
                                fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                                lineNumber: 469,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                        lineNumber: 460,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/dev/mezumani/src/components/sidebar.tsx",
                lineNumber: 199,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true);
}
_s1(Sidebar, "r5l90fX8t1ulfiiMwYjHMhw+6U0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$components$2f$theme$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"],
        __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$hooks$2f$use$2d$local$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocalStorage"]
    ];
});
_c1 = Sidebar;
var _c, _c1;
__turbopack_context__.k.register(_c, "EditableSheetLink");
__turbopack_context__.k.register(_c1, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/dev/mezumani/src/components/no-number-scroll.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NoNumberScroll",
    ()=>NoNumberScroll
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function NoNumberScroll() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NoNumberScroll.useEffect": ()=>{
            function onWheel(e) {
                const el = document.activeElement;
                if (el instanceof HTMLInputElement && el.type === "number") {
                    e.preventDefault();
                }
            }
            document.addEventListener("wheel", onWheel, {
                passive: false
            });
            return ({
                "NoNumberScroll.useEffect": ()=>document.removeEventListener("wheel", onWheel)
            })["NoNumberScroll.useEffect"];
        }
    }["NoNumberScroll.useEffect"], []);
    return null;
}
_s(NoNumberScroll, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = NoNumberScroll;
var _c;
__turbopack_context__.k.register(_c, "NoNumberScroll");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/dev/mezumani/src/hooks/use-debounced-callback.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDebouncedCallback",
    ()=>useDebouncedCallback
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function useDebouncedCallback(fn, delay) {
    _s();
    const timerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fnRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(fn);
    fnRef.current = fn;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDebouncedCallback.useCallback": (...args)=>{
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout({
                "useDebouncedCallback.useCallback": ()=>{
                    fnRef.current(...args);
                    timerRef.current = null;
                }
            }["useDebouncedCallback.useCallback"], delay);
        }
    }["useDebouncedCallback.useCallback"], [
        delay
    ]);
}
_s(useDebouncedCallback, "MBnG5QdgVkGP9Rtv92PyjmIqwiU=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/dev/mezumani/src/lib/data:1e4c66 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "searchAllSheetsAction",
    ()=>$$RSC_SERVER_ACTION_69
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"409d1cbe1d23e4870f2f5505a2e3604812220b9dd1":"searchAllSheetsAction"},"dev/mezumani/src/lib/actions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_69 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("409d1cbe1d23e4870f2f5505a2e3604812220b9dd1", __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "searchAllSheetsAction");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzZXJ2ZXJcIjtcblxuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tIFwibmV4dC9jYWNoZVwiO1xuaW1wb3J0IHtcbiAgYXBwZW5kVHJhbnNhY3Rpb24sXG4gIHVwZGF0ZVRyYW5zYWN0aW9uLFxuICBjbGVhclRyYW5zYWN0aW9uLFxuICBjcmVhdGVNb250aFNoZWV0LFxuICBhZGRDb25maWdJdGVtLFxuICByZW1vdmVDb25maWdJdGVtLFxuICBhZGRDYXRlZ29yeUNvbmZpZ0l0ZW0sXG4gIHJlbW92ZUNhdGVnb3J5Q29uZmlnSXRlbSxcbiAgcmVuYW1lQ2F0ZWdvcnlJblNoZWV0cyxcbiAgcmVuYW1lU2hlZXQsXG4gIG1vdmVTaGVldCxcbiAgY3JlYXRlVmFjYXRpb25TaGVldCxcbiAgZW5zdXJlQ3VycmVudFNoZWV0cyxcbiAgbGlzdFNoZWV0cyxcbiAgYWRkU3VtbWFyeUNhcmRJdGVtLFxuICByZW1vdmVTdW1tYXJ5Q2FyZEl0ZW0sXG4gIHVwZGF0ZVN1bW1hcnlDYXJkSXRlbSxcbiAgYWRkUmVjdXJyaW5nRXhwZW5zZSxcbiAgdXBkYXRlUmVjdXJyaW5nRXhwZW5zZSxcbiAgcmVtb3ZlUmVjdXJyaW5nRXhwZW5zZSxcbiAgcmVvcmRlclJlY3VycmluZ0V4cGVuc2VzLFxuICByZW9yZGVyU3VtbWFyeUNhcmRzIGFzIHJlb3JkZXJTdW1tYXJ5Q2FyZHNHUyxcbiAgYmF0Y2hJbXBvcnRUcmFuc2FjdGlvbnMsXG4gIGFkZENhdGVnb3J5TWFwcGluZyxcbiAgdXBkYXRlQ2F0ZWdvcnlNYXBwaW5nLFxuICByZW1vdmVDYXRlZ29yeU1hcHBpbmcsXG4gIGFkZEV4cGVuc2VSZW5hbWVSdWxlLFxuICB1cGRhdGVFeHBlbnNlUmVuYW1lUnVsZSxcbiAgcmVtb3ZlRXhwZW5zZVJlbmFtZVJ1bGUsXG4gIGJhdGNoVXBkYXRlRmllbGRzLFxuICBiYXRjaFRvZ2dsZVRlbnRhdGl2ZUZsYWcsXG4gIHNldE1vbnRoRG9uZSxcbiAgYWRkSW5jb21lU291cmNlLFxuICB1cGRhdGVJbmNvbWVTb3VyY2UsXG4gIHJlbW92ZUluY29tZVNvdXJjZSxcbiAgdXBkYXRlTW9udGhJbmNvbWUsXG4gIHVwZGF0ZU1vbnRoQWxsb2NhdGlvbnMsXG4gIGFkZFN0b2NrRGVmaW5pdGlvbixcbiAgdXBkYXRlU3RvY2tEZWZpbml0aW9uLFxuICByZW1vdmVTdG9ja0RlZmluaXRpb24sXG4gIGFkZEJyb2tlckNvbmZpZyxcbiAgdXBkYXRlQnJva2VyQ29uZmlnLFxuICByZW1vdmVCcm9rZXJDb25maWcsXG4gIGFkZFN0b2NrR29hbCxcbiAgdXBkYXRlU3RvY2tHb2FsLFxuICByZW1vdmVTdG9ja0dvYWwsXG4gIGFkZFN0b2NrVHJhbnNhY3Rpb24gYXMgYWRkU3RvY2tUeCxcbiAgdXBkYXRlU3RvY2tUcmFuc2FjdGlvbiBhcyB1cGRhdGVTdG9ja1R4LFxuICBkZWxldGVTdG9ja1RyYW5zYWN0aW9uIGFzIGRlbGV0ZVN0b2NrVHgsXG4gIHNhdmVMYWJlbEFsbG9jYXRpb25zLFxuICBhZGRSc3VWZXN0Um93cyxcbiAgdXBkYXRlUnN1Um93LFxuICBkZWxldGVSc3VSb3csXG4gIHRvZ2dsZVJzdVNvbGQsXG4gIHNldFJzdUdyb3NzRGF0YSxcbiAgc2V0QW5udWFsU2F2aW5nc0dvYWwsXG4gIHNldEFubnVhbEdvYWxGb3JZZWFyLFxuICBzZXRJcnJlZ3VsYXJFeHBlbnNlQ2F0ZWdvcmllc0ZvclllYXIsXG59IGZyb20gXCIuL2dvb2dsZS1zaGVldHNcIjtcbmltcG9ydCB7IEhFQlJFV19NT05USFMgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbmltcG9ydCB7XG4gIGVuc3VyZVBlbnNpb25TaGVldCxcbiAgZ2V0UGVuc2lvbkZ1bmRzLFxuICBhZGRQZW5zaW9uRnVuZCxcbiAgdXBkYXRlUGVuc2lvbkZ1bmQsXG4gIGRlbGV0ZVBlbnNpb25GdW5kLFxufSBmcm9tIFwiLi9wZW5zaW9uLXNoZWV0c1wiO1xuaW1wb3J0IHR5cGUge1xuICBUcmFuc2FjdGlvbklucHV0LFxuICBSZWN1cnJpbmdFeHBlbnNlLFxuICBTdW1tYXJ5Q2FyZCxcbiAgSW5jb21lU291cmNlLFxuICBNb250aEFsbG9jYXRpb24sXG4gIExhYmVsQWxsb2NhdGlvbixcbiAgUHJpY2VTb3VyY2UsXG4gIFN0b2NrQ3VycmVuY3ksXG4gIEludmVzdG1lbnRUZXJtLFxuICBUcmFuc2FjdGlvblR5cGUsXG4gIENoYXJ0UmFuZ2UsXG4gIFBvcnRmb2xpb0hpc3RvcnlQb2ludCxcbiAgUG9ydGZvbGlvUmV0dXJucyxcbiAgUGVuc2lvbk93bmVyLFxuICBQZW5zaW9uRnVuZFR5cGUsXG59IGZyb20gXCIuL3R5cGVzXCI7XG5cbmZ1bmN0aW9uIGJ1aWxkVHJhbnNhY3Rpb25WYWx1ZXMoZGF0YTogVHJhbnNhY3Rpb25JbnB1dCwgaXNWYWNhdGlvbiA9IGZhbHNlKSB7XG4gIGNvbnN0IGFtb3VudCA9IGRhdGEudGVudGF0aXZlID8gXCJcIiA6IFN0cmluZyhkYXRhLmFtb3VudCk7XG4gIGNvbnN0IHRlbnRhdGl2ZUFtb3VudCA9IGRhdGEudGVudGF0aXZlID8gU3RyaW5nKGRhdGEuYW1vdW50KSA6IFwiXCI7XG4gIGlmIChpc1ZhY2F0aW9uKSB7XG4gICAgLy8gVmFjYXRpb24gY29sdW1uczogRD1jYXJkLCBFPWNhdGVnb3J5IChzd2FwcGVkIHZzIG1vbnRobHkpXG4gICAgcmV0dXJuIFtkYXRhLmRhdGUsIGRhdGEuZXhwZW5zZSwgYW1vdW50LCBkYXRhLmNhcmQsIGRhdGEuY2F0ZWdvcnksIHRlbnRhdGl2ZUFtb3VudF07XG4gIH1cbiAgcmV0dXJuIFtkYXRhLmRhdGUsIGRhdGEuZXhwZW5zZSwgYW1vdW50LCBkYXRhLmNhdGVnb3J5LCBkYXRhLmNhcmQsIHRlbnRhdGl2ZUFtb3VudF07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRUcmFuc2FjdGlvbihcbiAgc2hlZXRUaXRsZTogc3RyaW5nLFxuICBkYXRhOiBUcmFuc2FjdGlvbklucHV0LFxuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgcmV0dXJuIGFwcGVuZFRyYW5zYWN0aW9uKHNoZWV0VGl0bGUsIGJ1aWxkVHJhbnNhY3Rpb25WYWx1ZXMoZGF0YSkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZWRpdFRyYW5zYWN0aW9uKFxuICBzaGVldFRpdGxlOiBzdHJpbmcsXG4gIHJvdzogbnVtYmVyLFxuICBkYXRhOiBUcmFuc2FjdGlvbklucHV0LFxuKSB7XG4gIGF3YWl0IHVwZGF0ZVRyYW5zYWN0aW9uKHNoZWV0VGl0bGUsIHJvdywgYnVpbGRUcmFuc2FjdGlvblZhbHVlcyhkYXRhKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVUcmFuc2FjdGlvbihzaGVldFRpdGxlOiBzdHJpbmcsIHJvdzogbnVtYmVyKSB7XG4gIGF3YWl0IGNsZWFyVHJhbnNhY3Rpb24oc2hlZXRUaXRsZSwgcm93KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZU1vbnRoKG1vbnRoSW5kZXg6IG51bWJlciwgeWVhclN1ZmZpeDogbnVtYmVyKSB7XG4gIGF3YWl0IGNyZWF0ZU1vbnRoU2hlZXQoSEVCUkVXX01PTlRIU1ttb250aEluZGV4XSwgeWVhclN1ZmZpeCk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL1wiKTtcbn1cblxuLy8gLS0tLSBTZXR0aW5ncyBhY3Rpb25zIC0tLS1cblxuY29uc3QgQ09MVU1OX01BUCA9IHtcbiAgbW9udGhseTogXCJBXCIgYXMgY29uc3QsXG4gIHZhY2F0aW9uOiBcIkJcIiBhcyBjb25zdCxcbn07XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRDYXRlZ29yeShcbiAgdHlwZTogXCJtb250aGx5XCIgfCBcInZhY2F0aW9uXCIsXG4gIG5hbWU6IHN0cmluZyxcbiAgY29sb3I6IHN0cmluZyxcbikge1xuICBhd2FpdCBhZGRDYXRlZ29yeUNvbmZpZ0l0ZW0oQ09MVU1OX01BUFt0eXBlXSwgbmFtZSwgY29sb3IpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbW92ZUNhdGVnb3J5KFxuICB0eXBlOiBcIm1vbnRobHlcIiB8IFwidmFjYXRpb25cIixcbiAgbmFtZTogc3RyaW5nLFxuKSB7XG4gIGF3YWl0IHJlbW92ZUNhdGVnb3J5Q29uZmlnSXRlbShDT0xVTU5fTUFQW3R5cGVdLCBuYW1lKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW5hbWVDYXRlZ29yeShcbiAgdHlwZTogXCJtb250aGx5XCIgfCBcInZhY2F0aW9uXCIsXG4gIG9sZE5hbWU6IHN0cmluZyxcbiAgbmV3TmFtZTogc3RyaW5nLFxuKSB7XG4gIGF3YWl0IHJlbmFtZUNhdGVnb3J5SW5TaGVldHMoQ09MVU1OX01BUFt0eXBlXSwgb2xkTmFtZSwgbmV3TmFtZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xuICByZXZhbGlkYXRlUGF0aChcIi9cIik7XG59XG5cbmNvbnN0IENBUkRfQ09MVU1OX01BUCA9IHtcbiAgZWlub3I6IFwiQ1wiIGFzIGNvbnN0LFxuICB6aXY6IFwiRFwiIGFzIGNvbnN0LFxuICBzaGFyZWQ6IFwiRVwiIGFzIGNvbnN0LFxufTtcblxuZXhwb3J0IHR5cGUgQ2FyZE93bmVyID0gXCJlaW5vclwiIHwgXCJ6aXZcIiB8IFwic2hhcmVkXCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRDYXJkKG93bmVyOiBDYXJkT3duZXIsIG5hbWU6IHN0cmluZykge1xuICBhd2FpdCBhZGRDb25maWdJdGVtKENBUkRfQ09MVU1OX01BUFtvd25lcl0sIG5hbWUpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbW92ZUNhcmQob3duZXI6IENhcmRPd25lciwgbmFtZTogc3RyaW5nKSB7XG4gIGF3YWl0IHJlbW92ZUNvbmZpZ0l0ZW0oQ0FSRF9DT0xVTU5fTUFQW293bmVyXSwgbmFtZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG4vLyAtLS0tIFN1bW1hcnkgY2FyZCBhY3Rpb25zIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZFN1bW1hcnlDYXJkKGxhYmVsOiBzdHJpbmcsIGNhdGVnb3JpZXM6IHN0cmluZykge1xuICBhd2FpdCBhZGRTdW1tYXJ5Q2FyZEl0ZW0obGFiZWwsIGNhdGVnb3JpZXMpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbW92ZVN1bW1hcnlDYXJkKGxhYmVsOiBzdHJpbmcpIHtcbiAgYXdhaXQgcmVtb3ZlU3VtbWFyeUNhcmRJdGVtKGxhYmVsKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVTdW1tYXJ5Q2FyZChcbiAgb2xkTGFiZWw6IHN0cmluZyxcbiAgbmV3TGFiZWw6IHN0cmluZyxcbiAgY2F0ZWdvcmllczogc3RyaW5nLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZVN1bW1hcnlDYXJkSXRlbShvbGRMYWJlbCwgbmV3TGFiZWwsIGNhdGVnb3JpZXMpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlb3JkZXJTdW1tYXJ5Q2FyZHMoaXRlbXM6IFN1bW1hcnlDYXJkW10pIHtcbiAgYXdhaXQgcmVvcmRlclN1bW1hcnlDYXJkc0dTKGl0ZW1zKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbi8vIC0tLS0gUmVjdXJyaW5nIGV4cGVuc2UgYWN0aW9ucyAtLS0tXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRSZWN1cnJpbmcoXG4gIG5hbWU6IHN0cmluZyxcbiAgYW1vdW50OiBudW1iZXIsXG4gIGNhdGVnb3J5OiBzdHJpbmcsXG4gIGNhcmQ6IHN0cmluZyxcbiAga2V5d29yZHM6IHN0cmluZyA9IFwiXCIsXG4gIHRlbnRhdGl2ZTogYm9vbGVhbiA9IGZhbHNlLFxuKSB7XG4gIGF3YWl0IGFkZFJlY3VycmluZ0V4cGVuc2UobmFtZSwgYW1vdW50LCBjYXRlZ29yeSwgY2FyZCwga2V5d29yZHMsIHRlbnRhdGl2ZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlUmVjdXJyaW5nKFxuICBvbGROYW1lOiBzdHJpbmcsXG4gIG5hbWU6IHN0cmluZyxcbiAgYW1vdW50OiBudW1iZXIsXG4gIGNhdGVnb3J5OiBzdHJpbmcsXG4gIGNhcmQ6IHN0cmluZyxcbiAga2V5d29yZHM6IHN0cmluZyA9IFwiXCIsXG4gIHRlbnRhdGl2ZTogYm9vbGVhbiA9IGZhbHNlLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZVJlY3VycmluZ0V4cGVuc2UoXG4gICAgb2xkTmFtZSxcbiAgICBuYW1lLFxuICAgIGFtb3VudCxcbiAgICBjYXRlZ29yeSxcbiAgICBjYXJkLFxuICAgIGtleXdvcmRzLFxuICAgIHRlbnRhdGl2ZSxcbiAgKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW1vdmVSZWN1cnJpbmcobmFtZTogc3RyaW5nKSB7XG4gIGF3YWl0IHJlbW92ZVJlY3VycmluZ0V4cGVuc2UobmFtZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVvcmRlclJlY3VycmluZyhpdGVtczogUmVjdXJyaW5nRXhwZW5zZVtdKSB7XG4gIGF3YWl0IHJlb3JkZXJSZWN1cnJpbmdFeHBlbnNlcyhpdGVtcyk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG4vLyAtLS0tIENhdGVnb3J5IG1hcHBpbmcgYWN0aW9ucyAtLS0tXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRDYXRlZ29yeU1hcHBpbmdBY3Rpb24oXG4gIGV4cGVuc2VOYW1lczogc3RyaW5nIHwgc3RyaW5nW10sXG4gIGNhdGVnb3J5OiBzdHJpbmcsXG4pIHtcbiAgYXdhaXQgYWRkQ2F0ZWdvcnlNYXBwaW5nKGV4cGVuc2VOYW1lcywgY2F0ZWdvcnkpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUNhdGVnb3J5TWFwcGluZ0FjdGlvbihcbiAgb2xkRXhwZW5zZU5hbWU6IHN0cmluZyxcbiAgZXhwZW5zZU5hbWU6IHN0cmluZyxcbiAgY2F0ZWdvcnk6IHN0cmluZyxcbikge1xuICBhd2FpdCB1cGRhdGVDYXRlZ29yeU1hcHBpbmcob2xkRXhwZW5zZU5hbWUsIGV4cGVuc2VOYW1lLCBjYXRlZ29yeSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVtb3ZlQ2F0ZWdvcnlNYXBwaW5nQWN0aW9uKGV4cGVuc2VOYW1lOiBzdHJpbmcpIHtcbiAgYXdhaXQgcmVtb3ZlQ2F0ZWdvcnlNYXBwaW5nKGV4cGVuc2VOYW1lKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbi8vIC0tLS0gRXhwZW5zZSByZW5hbWUgcnVsZSBhY3Rpb25zIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZEV4cGVuc2VSZW5hbWVSdWxlQWN0aW9uKFxuICB0YXJnZXROYW1lOiBzdHJpbmcsXG4gIGtleXdvcmRzOiBzdHJpbmcsXG4pIHtcbiAgYXdhaXQgYWRkRXhwZW5zZVJlbmFtZVJ1bGUodGFyZ2V0TmFtZSwga2V5d29yZHMpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUV4cGVuc2VSZW5hbWVSdWxlQWN0aW9uKFxuICBvbGRUYXJnZXROYW1lOiBzdHJpbmcsXG4gIHRhcmdldE5hbWU6IHN0cmluZyxcbiAga2V5d29yZHM6IHN0cmluZyxcbikge1xuICBhd2FpdCB1cGRhdGVFeHBlbnNlUmVuYW1lUnVsZShvbGRUYXJnZXROYW1lLCB0YXJnZXROYW1lLCBrZXl3b3Jkcyk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVtb3ZlRXhwZW5zZVJlbmFtZVJ1bGVBY3Rpb24odGFyZ2V0TmFtZTogc3RyaW5nKSB7XG4gIGF3YWl0IHJlbW92ZUV4cGVuc2VSZW5hbWVSdWxlKHRhcmdldE5hbWUpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuLy8gLS0tLSBBbm51YWwgc2F2aW5ncyBnb2FsIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldEFubnVhbFNhdmluZ3NHb2FsQWN0aW9uKGFtb3VudDogbnVtYmVyKSB7XG4gIGF3YWl0IHNldEFubnVhbFNhdmluZ3NHb2FsKGFtb3VudCk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xuICByZXZhbGlkYXRlUGF0aChcIi9cIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZXRBbm51YWxHb2FsRm9yWWVhckFjdGlvbihcbiAgeWVhcjogbnVtYmVyIHwgXCJkZWZhdWx0XCIsXG4gIGFtb3VudDogbnVtYmVyLFxuKSB7XG4gIGF3YWl0IHNldEFubnVhbEdvYWxGb3JZZWFyKHllYXIsIGFtb3VudCk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xuICByZXZhbGlkYXRlUGF0aChcIi9cIik7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3llYXIvW3llYXJdXCIsIFwicGFnZVwiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldElycmVndWxhckV4cGVuc2VDYXRlZ29yaWVzRm9yWWVhckFjdGlvbihcbiAgeWVhcjogbnVtYmVyLFxuICBjYXRlZ29yaWVzOiBzdHJpbmdbXSxcbikge1xuICBhd2FpdCBzZXRJcnJlZ3VsYXJFeHBlbnNlQ2F0ZWdvcmllc0ZvclllYXIoeWVhciwgY2F0ZWdvcmllcyk7XG4gIHJldmFsaWRhdGVQYXRoKGAveWVhci8ke3llYXIgJSAxMDB9YCk7XG59XG5cbi8vIC0tLS0gSW5jb21lIHNvdXJjZSBhY3Rpb25zIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZEluY29tZShuYW1lOiBzdHJpbmcsIGFtb3VudDogbnVtYmVyKSB7XG4gIGF3YWl0IGFkZEluY29tZVNvdXJjZShuYW1lLCBhbW91bnQpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUluY29tZShcbiAgb2xkTmFtZTogc3RyaW5nLFxuICBuYW1lOiBzdHJpbmcsXG4gIGFtb3VudDogbnVtYmVyLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZUluY29tZVNvdXJjZShvbGROYW1lLCBuYW1lLCBhbW91bnQpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbW92ZUluY29tZShuYW1lOiBzdHJpbmcpIHtcbiAgYXdhaXQgcmVtb3ZlSW5jb21lU291cmNlKG5hbWUpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zZXR0aW5nc1wiKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZU1vbnRoSW5jb21lQWN0aW9uKFxuICBzaGVldFRpdGxlOiBzdHJpbmcsXG4gIGVudHJpZXM6IEluY29tZVNvdXJjZVtdLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZU1vbnRoSW5jb21lKHNoZWV0VGl0bGUsIGVudHJpZXMpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlTW9udGhBbGxvY2F0aW9uc0FjdGlvbihcbiAgc2hlZXRUaXRsZTogc3RyaW5nLFxuICB5ZWFyU3VmZml4OiBudW1iZXIsXG4gIGFsbG9jYXRpb25zOiBNb250aEFsbG9jYXRpb25bXSxcbikge1xuICBhd2FpdCB1cGRhdGVNb250aEFsbG9jYXRpb25zKHNoZWV0VGl0bGUsIGFsbG9jYXRpb25zKTtcbiAgcmV2YWxpZGF0ZVBhdGgoYC95ZWFyLyR7eWVhclN1ZmZpeH1gKTtcbn1cblxuLy8gLS0tLSBWYWNhdGlvbiBhY3Rpb25zIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVZhY2F0aW9uKG5hbWU6IHN0cmluZywgeWVhclN1ZmZpeDogbnVtYmVyKSB7XG4gIGF3YWl0IGNyZWF0ZVZhY2F0aW9uU2hlZXQobmFtZSwgeWVhclN1ZmZpeCk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL1wiKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRWYWNhdGlvblRyYW5zYWN0aW9uKFxuICBzaGVldFRpdGxlOiBzdHJpbmcsXG4gIGRhdGE6IFRyYW5zYWN0aW9uSW5wdXQsXG4pOiBQcm9taXNlPG51bWJlcj4ge1xuICByZXR1cm4gYXBwZW5kVHJhbnNhY3Rpb24oc2hlZXRUaXRsZSwgYnVpbGRUcmFuc2FjdGlvblZhbHVlcyhkYXRhLCB0cnVlKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBlZGl0VmFjYXRpb25UcmFuc2FjdGlvbihcbiAgc2hlZXRUaXRsZTogc3RyaW5nLFxuICByb3c6IG51bWJlcixcbiAgZGF0YTogVHJhbnNhY3Rpb25JbnB1dCxcbikge1xuICBhd2FpdCB1cGRhdGVUcmFuc2FjdGlvbihzaGVldFRpdGxlLCByb3csIGJ1aWxkVHJhbnNhY3Rpb25WYWx1ZXMoZGF0YSwgdHJ1ZSkpO1xufVxuXG5leHBvcnQgY29uc3QgZGVsZXRlVmFjYXRpb25UcmFuc2FjdGlvbiA9IGRlbGV0ZVRyYW5zYWN0aW9uO1xuXG4vLyAtLS0tIEJ1bGsgZWRpdCAtLS0tXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBidWxrRWRpdFRyYW5zYWN0aW9ucyhcbiAgc2hlZXRUaXRsZTogc3RyaW5nLFxuICB1cGRhdGVzOiB7IHJvdzogbnVtYmVyOyBjYXRlZ29yeT86IHN0cmluZzsgY2FyZD86IHN0cmluZyB9W10sXG4pIHtcbiAgYXdhaXQgYmF0Y2hVcGRhdGVGaWVsZHMoc2hlZXRUaXRsZSwgZmFsc2UsIHVwZGF0ZXMpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYnVsa0VkaXRWYWNhdGlvblRyYW5zYWN0aW9ucyhcbiAgc2hlZXRUaXRsZTogc3RyaW5nLFxuICB1cGRhdGVzOiB7IHJvdzogbnVtYmVyOyBjYXRlZ29yeT86IHN0cmluZzsgY2FyZD86IHN0cmluZyB9W10sXG4pIHtcbiAgYXdhaXQgYmF0Y2hVcGRhdGVGaWVsZHMoc2hlZXRUaXRsZSwgdHJ1ZSwgdXBkYXRlcyk7XG59XG5cbi8vIC0tLS0gQnVsayBkZWxldGUgLS0tLVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYnVsa0RlbGV0ZVRyYW5zYWN0aW9ucyhcbiAgc2hlZXRUaXRsZTogc3RyaW5nLFxuICByb3dzOiBudW1iZXJbXSxcbikge1xuICBhd2FpdCBQcm9taXNlLmFsbChyb3dzLm1hcCgocm93KSA9PiBjbGVhclRyYW5zYWN0aW9uKHNoZWV0VGl0bGUsIHJvdykpKTtcbn1cblxuZXhwb3J0IGNvbnN0IGJ1bGtEZWxldGVWYWNhdGlvblRyYW5zYWN0aW9ucyA9IGJ1bGtEZWxldGVUcmFuc2FjdGlvbnM7XG5cbi8vIC0tLS0gTW92ZSB0byB2YWNhdGlvbiAtLS0tXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBidWxrTW92ZVRvVmFjYXRpb25BY3Rpb24oXG4gIHNvdXJjZVRpdGxlOiBzdHJpbmcsXG4gIGRlc3RUaXRsZTogc3RyaW5nLFxuICByb3dzOiBudW1iZXJbXSxcbiAgdHJhbnNhY3Rpb25zOiBUcmFuc2FjdGlvbklucHV0W10sXG4pIHtcbiAgYXdhaXQgYmF0Y2hJbXBvcnRUcmFuc2FjdGlvbnMoZGVzdFRpdGxlLCB0cmFuc2FjdGlvbnMsIHRydWUpO1xuICBhd2FpdCBQcm9taXNlLmFsbChyb3dzLm1hcCgocm93KSA9PiBjbGVhclRyYW5zYWN0aW9uKHNvdXJjZVRpdGxlLCByb3cpKSk7XG59XG5cbi8vIC0tLS0gQmF0Y2ggaW1wb3J0IC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZFRyYW5zYWN0aW9uc0JhdGNoKFxuICBzaGVldFRpdGxlOiBzdHJpbmcsXG4gIHRyYW5zYWN0aW9uczogVHJhbnNhY3Rpb25JbnB1dFtdLFxuICBpc1ZhY2F0aW9uID0gZmFsc2UsXG4pOiBQcm9taXNlPG51bWJlcj4ge1xuICByZXR1cm4gYmF0Y2hJbXBvcnRUcmFuc2FjdGlvbnMoc2hlZXRUaXRsZSwgdHJhbnNhY3Rpb25zLCBpc1ZhY2F0aW9uKTtcbn1cblxuLy8gLS0tLSBEZWJvdW5jZWQgcmV2YWxpZGF0aW9uIChjYWxsZWQgYnkgY2xpZW50KSAtLS0tXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXZhbGlkYXRlUGFnZUFjdGlvbihwYXRoOiBzdHJpbmcpIHtcbiAgcmV2YWxpZGF0ZVBhdGgocGF0aCk7XG59XG5cbi8vIC0tLS0gU2hlZXQgcmVuYW1lIGFjdGlvbiAtLS0tXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW5hbWVTaGVldEFjdGlvbihzaGVldElkOiBudW1iZXIsIG5ld1RpdGxlOiBzdHJpbmcsIHBhZ2VQYXRoPzogc3RyaW5nKSB7XG4gIGF3YWl0IHJlbmFtZVNoZWV0KHNoZWV0SWQsIG5ld1RpdGxlKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvXCIpO1xuICBpZiAocGFnZVBhdGgpIHJldmFsaWRhdGVQYXRoKHBhZ2VQYXRoKTtcbn1cblxuLyoqIE1vdmUgc2hlZXRJZCB0byBiZSBpbW1lZGlhdGVseSBhZnRlciBhZnRlclNoZWV0SWQgKG9yIHRvIGZpcnN0IHBvc2l0aW9uIGlmIG51bGwpLlxuICogIGFmdGVyU2hlZXRJZCBpcyB0aGUgc2hlZXRJZCBvZiB0aGUgcHJlY2VkaW5nIHNpYmxpbmcgaW4gdGhlIG5ldyBvcmRlci4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtb3ZlU2hlZXRBZnRlckFjdGlvbihzaGVldElkOiBudW1iZXIsIGFmdGVyU2hlZXRJZDogbnVtYmVyIHwgbnVsbCkge1xuICBjb25zdCBhbGxTaGVldHNSYXcgPSBhd2FpdCBsaXN0U2hlZXRzKCk7XG4gIC8vIGxpc3RTaGVldHMgcmV0dXJucyBzaGVldHMgc29ydGVkIGJ5IHRoZWlyIG5hdHVyYWwgb3JkZXIgZnJvbSB0aGUgQVBJXG4gIGxldCB0YXJnZXRJbmRleDogbnVtYmVyO1xuICBpZiAoYWZ0ZXJTaGVldElkID09PSBudWxsKSB7XG4gICAgdGFyZ2V0SW5kZXggPSAwO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGFmdGVyUG9zID0gYWxsU2hlZXRzUmF3LmZpbmRJbmRleCgocykgPT4gcy5zaGVldElkID09PSBhZnRlclNoZWV0SWQpO1xuICAgIHRhcmdldEluZGV4ID0gYWZ0ZXJQb3MgPj0gMCA/IGFmdGVyUG9zICsgMSA6IGFsbFNoZWV0c1Jhdy5sZW5ndGg7XG4gIH1cbiAgYXdhaXQgbW92ZVNoZWV0KHNoZWV0SWQsIHRhcmdldEluZGV4KTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvXCIpO1xufVxuXG4vLyAtLS0tIEF1dG8tY3JlYXRpb24gYWN0aW9uIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGVuc3VyZUN1cnJlbnRTaGVldHNBY3Rpb24oKSB7XG4gIGNvbnN0IHNoZWV0cyA9IGF3YWl0IGxpc3RTaGVldHMoKTtcbiAgY29uc3QgY3JlYXRlZCA9IGF3YWl0IGVuc3VyZUN1cnJlbnRTaGVldHMoc2hlZXRzKTtcbiAgaWYgKGNyZWF0ZWQpIHtcbiAgICByZXZhbGlkYXRlUGF0aChcIi9cIik7XG4gIH1cbiAgcmV0dXJuIGNyZWF0ZWQ7XG59XG5cbi8vIC0tLS0gQnVsayB0ZW50YXRpdmUgdG9nZ2xlIC0tLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJ1bGtUb2dnbGVUZW50YXRpdmUoXG4gIHNoZWV0VGl0bGU6IHN0cmluZyxcbiAgcm93czogbnVtYmVyW10sXG4gIHRlbnRhdGl2ZTogYm9vbGVhbixcbikge1xuICBhd2FpdCBiYXRjaFRvZ2dsZVRlbnRhdGl2ZUZsYWcoc2hlZXRUaXRsZSwgcm93cywgdGVudGF0aXZlKTtcbn1cblxuZXhwb3J0IGNvbnN0IGJ1bGtUb2dnbGVWYWNhdGlvblRlbnRhdGl2ZSA9IGJ1bGtUb2dnbGVUZW50YXRpdmU7XG5cbi8vIC0tLS0gTW9udGggZG9uZSB0b2dnbGUgLS0tLVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdG9nZ2xlTW9udGhEb25lQWN0aW9uKHNoZWV0VGl0bGU6IHN0cmluZywgZG9uZTogYm9vbGVhbikge1xuICBhd2FpdCBzZXRNb250aERvbmUoc2hlZXRUaXRsZSwgZG9uZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL1wiKTtcbn1cblxuLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vLyBTdG9jayBzZXR0aW5ncyBhY3Rpb25zXG4vLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZFN0b2NrKFxuICBzeW1ib2w6IHN0cmluZyxcbiAgZGlzcGxheU5hbWU6IHN0cmluZyxcbiAgc291cmNlOiBQcmljZVNvdXJjZSxcbiAgY3VycmVuY3k6IFN0b2NrQ3VycmVuY3ksXG4gIGxhYmVsOiBzdHJpbmcgPSBcIlwiLFxuKSB7XG4gIGF3YWl0IGFkZFN0b2NrRGVmaW5pdGlvbihzeW1ib2wsIGRpc3BsYXlOYW1lLCBzb3VyY2UsIGN1cnJlbmN5LCBsYWJlbCk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlU3RvY2soXG4gIG9sZFN5bWJvbDogc3RyaW5nLFxuICBzeW1ib2w6IHN0cmluZyxcbiAgZGlzcGxheU5hbWU6IHN0cmluZyxcbiAgc291cmNlOiBQcmljZVNvdXJjZSxcbiAgY3VycmVuY3k6IFN0b2NrQ3VycmVuY3ksXG4gIGxhYmVsOiBzdHJpbmcgPSBcIlwiLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZVN0b2NrRGVmaW5pdGlvbihvbGRTeW1ib2wsIHN5bWJvbCwgZGlzcGxheU5hbWUsIHNvdXJjZSwgY3VycmVuY3ksIGxhYmVsKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW1vdmVTdG9jayhzeW1ib2w6IHN0cmluZykge1xuICBhd2FpdCByZW1vdmVTdG9ja0RlZmluaXRpb24oc3ltYm9sKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRCcm9rZXIoXG4gIG5hbWU6IHN0cmluZyxcbiAgbWdtdEZlZTogbnVtYmVyLFxuICBwdXJjaGFzZUZlZTogbnVtYmVyLFxuKSB7XG4gIGF3YWl0IGFkZEJyb2tlckNvbmZpZyhuYW1lLCBtZ210RmVlLCBwdXJjaGFzZUZlZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlQnJva2VyKFxuICBvbGROYW1lOiBzdHJpbmcsXG4gIG5hbWU6IHN0cmluZyxcbiAgbWdtdEZlZTogbnVtYmVyLFxuICBwdXJjaGFzZUZlZTogbnVtYmVyLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZUJyb2tlckNvbmZpZyhvbGROYW1lLCBuYW1lLCBtZ210RmVlLCBwdXJjaGFzZUZlZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVtb3ZlQnJva2VyKG5hbWU6IHN0cmluZykge1xuICBhd2FpdCByZW1vdmVCcm9rZXJDb25maWcobmFtZSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3NldHRpbmdzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYWRkR29hbChcbiAgdGVybTogSW52ZXN0bWVudFRlcm0sXG4gIGxhYmVsOiBzdHJpbmcsXG4gIHRhcmdldEFtb3VudDogbnVtYmVyLFxuKSB7XG4gIGF3YWl0IGFkZFN0b2NrR29hbCh0ZXJtLCBsYWJlbCwgdGFyZ2V0QW1vdW50KTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVHb2FsKFxuICBvbGRMYWJlbDogc3RyaW5nLFxuICB0ZXJtOiBJbnZlc3RtZW50VGVybSxcbiAgbGFiZWw6IHN0cmluZyxcbiAgdGFyZ2V0QW1vdW50OiBudW1iZXIsXG4pIHtcbiAgYXdhaXQgdXBkYXRlU3RvY2tHb2FsKG9sZExhYmVsLCB0ZXJtLCBsYWJlbCwgdGFyZ2V0QW1vdW50KTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW1vdmVHb2FsKGxhYmVsOiBzdHJpbmcpIHtcbiAgYXdhaXQgcmVtb3ZlU3RvY2tHb2FsKGxhYmVsKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc2V0dGluZ3NcIik7XG59XG5cbi8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gTGFiZWwgYWxsb2NhdGlvbiBhY3Rpb25zXG4vLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNhdmVMYWJlbEFsbG9jYXRpb25zQWN0aW9uKFxuICBhbGxvY2F0aW9uczogTGFiZWxBbGxvY2F0aW9uW10sXG4pIHtcbiAgYXdhaXQgc2F2ZUxhYmVsQWxsb2NhdGlvbnMoYWxsb2NhdGlvbnMpO1xuICByZXZhbGlkYXRlUGF0aChcIi9zdG9ja3NcIik7XG59XG5cbi8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gU3RvY2sgdHJhbnNhY3Rpb24gYWN0aW9uc1xuLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRTdG9ja1RyYW5zYWN0aW9uQWN0aW9uKFxuICBkYXRlOiBzdHJpbmcsXG4gIHR5cGU6IFRyYW5zYWN0aW9uVHlwZSxcbiAgc3ltYm9sOiBzdHJpbmcsXG4gIHF1YW50aXR5OiBudW1iZXIsXG4gIHByaWNlUGVyVW5pdElMUzogbnVtYmVyLFxuICBjdXJyZW5jeTogU3RvY2tDdXJyZW5jeSxcbiAgdGVybTogSW52ZXN0bWVudFRlcm0sXG4gIGJhbms6IHN0cmluZyxcbiAgcHVyY2hhc2VGZWU6IG51bWJlcixcbiAgbm90ZXM6IHN0cmluZyxcbik6IFByb21pc2U8bnVtYmVyPiB7XG4gIGNvbnN0IHJvdyA9IGF3YWl0IGFkZFN0b2NrVHgoXG4gICAgZGF0ZSxcbiAgICB0eXBlLFxuICAgIHN5bWJvbCxcbiAgICBxdWFudGl0eSxcbiAgICBwcmljZVBlclVuaXRJTFMsXG4gICAgY3VycmVuY3ksXG4gICAgdGVybSxcbiAgICBiYW5rLFxuICAgIHB1cmNoYXNlRmVlLFxuICAgIG5vdGVzLFxuICApO1xuICByZXZhbGlkYXRlUGF0aChcIi9zdG9ja3NcIik7XG4gIHJldHVybiByb3c7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBlZGl0U3RvY2tUcmFuc2FjdGlvbkFjdGlvbihcbiAgcm93OiBudW1iZXIsXG4gIGRhdGU6IHN0cmluZyxcbiAgdHlwZTogVHJhbnNhY3Rpb25UeXBlLFxuICBzeW1ib2w6IHN0cmluZyxcbiAgcXVhbnRpdHk6IG51bWJlcixcbiAgcHJpY2VQZXJVbml0SUxTOiBudW1iZXIsXG4gIGN1cnJlbmN5OiBTdG9ja0N1cnJlbmN5LFxuICB0ZXJtOiBJbnZlc3RtZW50VGVybSxcbiAgYmFuazogc3RyaW5nLFxuICBwdXJjaGFzZUZlZTogbnVtYmVyLFxuICBub3Rlczogc3RyaW5nLFxuKSB7XG4gIGF3YWl0IHVwZGF0ZVN0b2NrVHgoXG4gICAgcm93LFxuICAgIGRhdGUsXG4gICAgdHlwZSxcbiAgICBzeW1ib2wsXG4gICAgcXVhbnRpdHksXG4gICAgcHJpY2VQZXJVbml0SUxTLFxuICAgIGN1cnJlbmN5LFxuICAgIHRlcm0sXG4gICAgYmFuayxcbiAgICBwdXJjaGFzZUZlZSxcbiAgICBub3RlcyxcbiAgKTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvc3RvY2tzXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlU3RvY2tUcmFuc2FjdGlvbkFjdGlvbihyb3c6IG51bWJlcikge1xuICBhd2FpdCBkZWxldGVTdG9ja1R4KHJvdyk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3N0b2Nrc1wiKTtcbn1cblxuLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vLyBQb3J0Zm9saW8gaGlzdG9yeSBhY3Rpb25cbi8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0UG9ydGZvbGlvSGlzdG9yeUFjdGlvbihcbiAgcmFuZ2U6IENoYXJ0UmFuZ2UsXG4gIHRlcm0/OiBJbnZlc3RtZW50VGVybSxcbik6IFByb21pc2U8UG9ydGZvbGlvSGlzdG9yeVBvaW50W10+IHtcbiAgY29uc3QgeyBnZXRQb3J0Zm9saW9IaXN0b3J5IH0gPSBhd2FpdCBpbXBvcnQoXCIuL3N0b2NrLWRhc2hib2FyZFwiKTtcbiAgcmV0dXJuIGdldFBvcnRmb2xpb0hpc3RvcnkocmFuZ2UsIHsgdGVybSB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFBvcnRmb2xpb1JldHVybnNBY3Rpb24oXG4gIHRlcm0/OiBJbnZlc3RtZW50VGVybSxcbik6IFByb21pc2U8UG9ydGZvbGlvUmV0dXJucz4ge1xuICBjb25zdCB7IGdldFBvcnRmb2xpb0hpc3RvcnksIGNvbXB1dGVQb3J0Zm9saW9SZXR1cm5zIH0gPSBhd2FpdCBpbXBvcnQoXCIuL3N0b2NrLWRhc2hib2FyZFwiKTtcbiAgY29uc3QgeyBnZXRTdG9ja0NvbmZpZywgc2F2ZVllYXJSZXR1cm5zIH0gPSBhd2FpdCBpbXBvcnQoXCIuL2dvb2dsZS1zaGVldHNcIik7XG5cbiAgY29uc3QgY29uZmlnID0gYXdhaXQgZ2V0U3RvY2tDb25maWcoKTtcbiAgY29uc3QgeyBzYXZlZFllYXJSZXR1cm5zIH0gPSBjb25maWc7XG5cbiAgLy8gT3B0aW1hbCBmZXRjaCBzdGFydDogY292ZXIgcm9sbGluZyAzeXIgcGVyaW9kcyBBTkQgYWxsIHVuY2FjaGVkIGNvbXBsZXRlIHllYXJzLlxuICAvLyBJZiBhbGwgeWVhcnMgdXAgdG8gKGN1cnJlbnRZZWFyLTEpIGFyZSBjYWNoZWQsIG9ubHkgZmV0Y2ggM3lyIG9mIGRhdGEuXG4gIGNvbnN0IGN1cnJlbnRZZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICBjb25zdCB0aHJlZVllYXJzQWdvRGF0ZSA9IG5ldyBEYXRlKCk7XG4gIHRocmVlWWVhcnNBZ29EYXRlLnNldEZ1bGxZZWFyKHRocmVlWWVhcnNBZ29EYXRlLmdldEZ1bGxZZWFyKCkgLSAzKTtcbiAgY29uc3QgdGhyZWVZZWFyc0FnbyA9IHRocmVlWWVhcnNBZ29EYXRlLnRvSVNPU3RyaW5nKCkuc3BsaXQoXCJUXCIpWzBdO1xuXG4gIC8vIEZpbmQgdGhlIGVhcmxpZXN0IGNvbXBsZXRlIHllYXIgbm90IHlldCBjYWNoZWRcbiAgbGV0IGVhcmxpZXN0VW5jYWNoZWRZZWFyOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgLy8gV2UgbG9vayBmcm9tIGEgcmVhc29uYWJsZSBtaW5pbXVtICgyMDE1KSB0byBhdm9pZCBmZXRjaGluZyB0b28gZmFyIGJhY2tcbiAgZm9yIChsZXQgeSA9IDIwMTU7IHkgPCBjdXJyZW50WWVhcjsgeSsrKSB7XG4gICAgaWYgKCEoeSBpbiBzYXZlZFllYXJSZXR1cm5zKSkge1xuICAgICAgZWFybGllc3RVbmNhY2hlZFllYXIgPSB5O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLy8gU3RhcnQgZGF0ZTogZWFybGllciBvZiAoM3lyIGFnbykgYW5kIChKYW4gMSBvZiBlYXJsaWVzdCB1bmNhY2hlZCB5ZWFyKVxuICBsZXQgc3RhcnREYXRlID0gdGhyZWVZZWFyc0FnbztcbiAgaWYgKGVhcmxpZXN0VW5jYWNoZWRZZWFyICE9PSBudWxsKSB7XG4gICAgY29uc3QgdW5jYWNoZWRTdGFydCA9IGAke2VhcmxpZXN0VW5jYWNoZWRZZWFyfS0wMS0wMWA7XG4gICAgaWYgKHVuY2FjaGVkU3RhcnQgPCBzdGFydERhdGUpIHN0YXJ0RGF0ZSA9IHVuY2FjaGVkU3RhcnQ7XG4gIH1cblxuICBjb25zdCBoaXN0b3J5ID0gYXdhaXQgZ2V0UG9ydGZvbGlvSGlzdG9yeShcIk1heFwiLCB7XG4gICAgZG93bnNhbXBsZTogZmFsc2UsXG4gICAgdGVybSxcbiAgICBzdGFydERhdGVPdmVycmlkZTogc3RhcnREYXRlLFxuICB9KTtcblxuICBjb25zdCByZXR1cm5zID0gY29tcHV0ZVBvcnRmb2xpb1JldHVybnMoaGlzdG9yeSwgc2F2ZWRZZWFyUmV0dXJucyk7XG5cbiAgLy8gU2F2ZSBuZXdseSBjb21wdXRlZCBjb21wbGV0ZSB5ZWFycyDigJQgb25seSBpZiB3ZSBoYXZlIGhpZ2gtY29uZmlkZW5jZSBkYXRhLlxuICAvLyBBIHllYXIgcXVhbGlmaWVzIHdoZW46XG4gIC8vIDEuIE5vdCBhbHJlYWR5IGNhY2hlZCAobmV2ZXIgb3ZlcndyaXRlIGV4aXN0aW5nKVxuICAvLyAyLiBDb21wdXRlZCByZXR1cm4gaXMgbm9uLW51bGxcbiAgLy8gMy4gSGlzdG9yeSBoYXMg4omlMjAwIHBvaW50cyB3aXRoaW4gdGhhdCB5ZWFyIChuZWFybHkgYWxsIHRyYWRpbmcgZGF5cylcbiAgLy8gNC4gSGlzdG9yeSBjb3ZlcnMgSmFuIDHigJMxNSBBTkQgTm92IDHigJNEZWMgMzEgb2YgdGhhdCB5ZWFyIChmdWxsIHllYXIgZmV0Y2hlZClcbiAgY29uc3QgbmV3RW50cmllczogUmVjb3JkPG51bWJlciwgbnVtYmVyPiA9IHt9O1xuICBmb3IgKGNvbnN0IHsgeWVhciwgcmV0dXJuUGVyY2VudCB9IG9mIHJldHVybnMuYW5udWFsKSB7XG4gICAgaWYgKHJldHVyblBlcmNlbnQgPT09IG51bGwpIGNvbnRpbnVlO1xuICAgIGlmICh5ZWFyIGluIHNhdmVkWWVhclJldHVybnMpIGNvbnRpbnVlOyAvLyBuZXZlciBvdmVyd3JpdGVcblxuICAgIC8vIENvdW50IHBvaW50cyBhbmQgY2hlY2sgY292ZXJhZ2VcbiAgICBjb25zdCB5ZWFyUG9pbnRzID0gaGlzdG9yeS5maWx0ZXIoKHApID0+IHAuZGF0ZS5zdGFydHNXaXRoKGAke3llYXJ9LWApKTtcbiAgICBpZiAoeWVhclBvaW50cy5sZW5ndGggPCAyMDApIGNvbnRpbnVlO1xuXG4gICAgY29uc3QgZmlyc3QgPSB5ZWFyUG9pbnRzWzBdLmRhdGU7XG4gICAgY29uc3QgbGFzdCA9IHllYXJQb2ludHNbeWVhclBvaW50cy5sZW5ndGggLSAxXS5kYXRlO1xuICAgIGNvbnN0IGNvdmVyc1N0YXJ0ID0gZmlyc3QgPD0gYCR7eWVhcn0tMDEtMTVgO1xuICAgIGNvbnN0IGNvdmVyc0VuZCA9IGxhc3QgPj0gYCR7eWVhcn0tMTEtMDFgO1xuICAgIGlmICghY292ZXJzU3RhcnQgfHwgIWNvdmVyc0VuZCkgY29udGludWU7XG5cbiAgICBuZXdFbnRyaWVzW3llYXJdID0gcmV0dXJuUGVyY2VudDtcbiAgfVxuXG4gIGlmIChPYmplY3Qua2V5cyhuZXdFbnRyaWVzKS5sZW5ndGggPiAwKSB7XG4gICAgYXdhaXQgc2F2ZVllYXJSZXR1cm5zKHsgLi4uc2F2ZWRZZWFyUmV0dXJucywgLi4ubmV3RW50cmllcyB9KTtcbiAgfVxuXG4gIHJldHVybiByZXR1cm5zO1xufVxuXG4vLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIE5WSURJQSBSU1UgYWN0aW9uc1xuLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbi8qKlxuICogQWRkIGFuIFJTVSBncmFudCB3aXRoIGF1dG8tZ2VuZXJhdGVkIHZlc3Qgcm93cyAoNy1jb2x1bW4gZm9ybWF0KS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZFJzdUdyYW50QWN0aW9uKFxuICBncmFudERhdGU6IHN0cmluZyxcbiAgdG90YWxTaGFyZXM6IG51bWJlcixcbiAgY29zdFBlclNoYXJlOiBudW1iZXIsXG4gIHZlc3RzOiB7IHZlc3REYXRlOiBzdHJpbmc7IHNoYXJlczogbnVtYmVyIH1bXSxcbiAgZ3JhbnROYW1lOiBzdHJpbmcgPSBcIlwiLFxuKSB7XG4gIGlmICh2ZXN0cy5sZW5ndGggPT09IDApIHJldHVybjtcblxuICBjb25zdCByb3dzOiBzdHJpbmdbXVtdID0gdmVzdHMubWFwKCh2KSA9PiBbXG4gICAgZ3JhbnREYXRlLFxuICAgIFN0cmluZyh0b3RhbFNoYXJlcyksXG4gICAgdi52ZXN0RGF0ZSxcbiAgICBTdHJpbmcodi5zaGFyZXMpLFxuICAgIGNvc3RQZXJTaGFyZSA+IDAgPyBTdHJpbmcoY29zdFBlclNoYXJlKSA6IFwiXCIsXG4gICAgXCJcIiwgLy8gbm90ZXNcbiAgICBncmFudE5hbWUsXG4gICAgXCJcIiwgLy8gbm90IHNvbGRcbiAgXSk7XG5cbiAgYXdhaXQgYWRkUnN1VmVzdFJvd3Mocm93cyk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL252aWRpYVwiKTtcbn1cblxuLyoqXG4gKiBVcGRhdGUgYW4gUlNVIHZlc3Qgcm93ICg3LWNvbHVtbiBmb3JtYXQpLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlUnN1VmVzdEFjdGlvbihcbiAgcm93OiBudW1iZXIsXG4gIGdyYW50RGF0ZTogc3RyaW5nLFxuICB0b3RhbFNoYXJlc0luR3JhbnQ6IG51bWJlcixcbiAgdmVzdERhdGU6IHN0cmluZyxcbiAgc2hhcmVzOiBudW1iZXIsXG4gIHZlc3RQcmljZVVzZDogbnVtYmVyLFxuICBub3Rlczogc3RyaW5nID0gXCJcIixcbiAgZ3JhbnROYW1lOiBzdHJpbmcgPSBcIlwiLFxuICBzb2xkOiBib29sZWFuID0gZmFsc2UsXG4pIHtcbiAgYXdhaXQgdXBkYXRlUnN1Um93KHJvdywgW1xuICAgIGdyYW50RGF0ZSxcbiAgICBTdHJpbmcodG90YWxTaGFyZXNJbkdyYW50KSxcbiAgICB2ZXN0RGF0ZSxcbiAgICBTdHJpbmcoc2hhcmVzKSxcbiAgICB2ZXN0UHJpY2VVc2QgPyBTdHJpbmcodmVzdFByaWNlVXNkKSA6IFwiXCIsXG4gICAgbm90ZXMsXG4gICAgZ3JhbnROYW1lLFxuICAgIHNvbGQgPyBcIlRSVUVcIiA6IFwiXCIsXG4gIF0pO1xuICByZXZhbGlkYXRlUGF0aChcIi9udmlkaWFcIik7XG59XG5cbi8qKlxuICogVG9nZ2xlIHRoZSBzb2xkIGZsYWcgb24gYW4gUlNVIHZlc3Qgcm93LlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdG9nZ2xlUnN1U29sZEFjdGlvbihyb3c6IG51bWJlciwgc29sZDogYm9vbGVhbikge1xuICBhd2FpdCB0b2dnbGVSc3VTb2xkKHJvdywgc29sZCk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL252aWRpYVwiKTtcbn1cblxuLyoqXG4gKiBEZWxldGUgYW4gUlNVIHJvdy5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVJzdVJvd0FjdGlvbihyb3c6IG51bWJlcikge1xuICBhd2FpdCBkZWxldGVSc3VSb3cocm93KTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvbnZpZGlhXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2V0UnN1R3Jvc3NEYXRhQWN0aW9uKGdyb3NzU29GYXI6IG51bWJlciwgbW9udGhseVNhbGFyeTogbnVtYmVyLCBlc3BwTW9udGhseUNvbnRyaWJ1dGlvbjogbnVtYmVyLCBlc3BwUHVyY2hhc2VQcmljZTogbnVtYmVyKSB7XG4gIGF3YWl0IHNldFJzdUdyb3NzRGF0YShncm9zc1NvRmFyLCBtb250aGx5U2FsYXJ5LCBlc3BwTW9udGhseUNvbnRyaWJ1dGlvbiwgZXNwcFB1cmNoYXNlUHJpY2UpO1xuICByZXZhbGlkYXRlUGF0aChcIi9udmlkaWFcIik7XG59XG5cbi8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gUGVuc2lvbiBhY3Rpb25zXG4vLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFBlbnNpb25EYXRhKCkge1xuICBhd2FpdCBlbnN1cmVQZW5zaW9uU2hlZXQoKTtcbiAgY29uc3QgZnVuZHMgPSBhd2FpdCBnZXRQZW5zaW9uRnVuZHMoKTtcbiAgcmV0dXJuIHsgZnVuZHMgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZFBlbnNpb25GdW5kQWN0aW9uKFxuICBvd25lcjogUGVuc2lvbk93bmVyLFxuICBuYW1lOiBzdHJpbmcsXG4gIHR5cGU6IFBlbnNpb25GdW5kVHlwZSxcbiAgdHJhY2s6IHN0cmluZyxcbiAgYmFsYW5jZTogbnVtYmVyLFxuICBjb21wYW55OiBzdHJpbmcsXG4pIHtcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5zcGxpdChcIlRcIilbMF07XG4gIGF3YWl0IGFkZFBlbnNpb25GdW5kKG93bmVyLCBuYW1lLCB0eXBlLCB0cmFjaywgYmFsYW5jZSwgZGF0ZSwgY29tcGFueSk7XG4gIHJldmFsaWRhdGVQYXRoKFwiL3BlbnNpb25cIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVQZW5zaW9uRnVuZEFjdGlvbihcbiAgcm93OiBudW1iZXIsXG4gIG93bmVyOiBQZW5zaW9uT3duZXIsXG4gIG5hbWU6IHN0cmluZyxcbiAgdHlwZTogUGVuc2lvbkZ1bmRUeXBlLFxuICB0cmFjazogc3RyaW5nLFxuICBiYWxhbmNlOiBudW1iZXIsXG4gIGNvbXBhbnk6IHN0cmluZyxcbikge1xuICBjb25zdCBkYXRlID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnNwbGl0KFwiVFwiKVswXTtcbiAgYXdhaXQgdXBkYXRlUGVuc2lvbkZ1bmQocm93LCBvd25lciwgbmFtZSwgdHlwZSwgdHJhY2ssIGJhbGFuY2UsIGRhdGUsIGNvbXBhbnkpO1xuICByZXZhbGlkYXRlUGF0aChcIi9wZW5zaW9uXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlUGVuc2lvbkZ1bmRBY3Rpb24ocm93OiBudW1iZXIpIHtcbiAgYXdhaXQgZGVsZXRlUGVuc2lvbkZ1bmQocm93KTtcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvcGVuc2lvblwiKTtcbn1cblxuLyoqXG4gKiBTZWFyY2ggZXhwZW5zZSBuYW1lcyBhY3Jvc3MgYWxsIG1vbnRobHkgKyB2YWNhdGlvbiBzaGVldHMuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZWFyY2hBbGxTaGVldHNBY3Rpb24ocXVlcnk6IHN0cmluZykge1xuICBpZiAoIXF1ZXJ5IHx8IHF1ZXJ5LnRyaW0oKS5sZW5ndGggPCAyKSByZXR1cm4gW107XG5cbiAgY29uc3QgYWxsU2hlZXRzID0gYXdhaXQgbGlzdFNoZWV0cygpO1xuICBjb25zdCBzZWFyY2hhYmxlID0gYWxsU2hlZXRzLmZpbHRlcihcbiAgICAocykgPT4gcy50eXBlID09PSBcIm1vbnRobHlcIiB8fCBzLnR5cGUgPT09IFwidmFjYXRpb25cIixcbiAgKTtcblxuICBjb25zdCB7IHNlYXJjaEFsbFNoZWV0cyB9ID0gYXdhaXQgaW1wb3J0KFwiLi9nb29nbGUtc2hlZXRzXCIpO1xuICByZXR1cm4gc2VhcmNoQWxsU2hlZXRzKHF1ZXJ5LnRyaW0oKSwgc2VhcmNoYWJsZSk7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6InlTQXcxQnNCLG9NQUFBIn0=
}),
"[project]/dev/mezumani/src/components/global-search.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GlobalSearch",
    ()=>GlobalSearch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/mezumani/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$hooks$2f$use$2d$debounced$2d$callback$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/mezumani/src/hooks/use-debounced-callback.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$lib$2f$data$3a$1e4c66__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/dev/mezumani/src/lib/data:1e4c66 [app-client] (ecmascript) <text/javascript>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function GlobalSearch() {
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isPending, startTransition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"])();
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Cmd+K / Ctrl+K listener
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GlobalSearch.useEffect": ()=>{
            function handleKeyDown(e) {
                if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                    e.preventDefault();
                    setOpen({
                        "GlobalSearch.useEffect.handleKeyDown": (prev)=>!prev
                    }["GlobalSearch.useEffect.handleKeyDown"]);
                }
            }
            document.addEventListener("keydown", handleKeyDown);
            return ({
                "GlobalSearch.useEffect": ()=>document.removeEventListener("keydown", handleKeyDown)
            })["GlobalSearch.useEffect"];
        }
    }["GlobalSearch.useEffect"], []);
    // Focus input when modal opens
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GlobalSearch.useEffect": ()=>{
            if (open) {
                setTimeout({
                    "GlobalSearch.useEffect": ()=>inputRef.current?.focus()
                }["GlobalSearch.useEffect"], 50);
            } else {
                setQuery("");
                setResults([]);
            }
        }
    }["GlobalSearch.useEffect"], [
        open
    ]);
    const debouncedSearch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$hooks$2f$use$2d$debounced$2d$callback$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebouncedCallback"])({
        "GlobalSearch.useDebouncedCallback[debouncedSearch]": (q)=>{
            if (q.trim().length < 2) {
                setResults([]);
                return;
            }
            startTransition({
                "GlobalSearch.useDebouncedCallback[debouncedSearch]": async ()=>{
                    const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$lib$2f$data$3a$1e4c66__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["searchAllSheetsAction"])(q);
                    setResults(res);
                }
            }["GlobalSearch.useDebouncedCallback[debouncedSearch]"]);
        }
    }["GlobalSearch.useDebouncedCallback[debouncedSearch]"], 300);
    function handleInputChange(value) {
        setQuery(value);
        debouncedSearch(value);
    }
    function navigate(sheetId, type) {
        const path = type === "vacation" ? `/vacation/${sheetId}` : `/month/${sheetId}`;
        router.push(path);
        setOpen(false);
    }
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "global-search-overlay",
        onClick: ()=>setOpen(false),
        onKeyDown: (e)=>{
            if (e.key === "Escape") setOpen(false);
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "global-search-dialog",
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "global-search-input-wrapper",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            width: "18",
                            height: "18",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            className: "global-search-icon",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    cx: "11",
                                    cy: "11",
                                    r: "8"
                                }, void 0, false, {
                                    fileName: "[project]/dev/mezumani/src/components/global-search.tsx",
                                    lineNumber: 90,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "m21 21-4.3-4.3"
                                }, void 0, false, {
                                    fileName: "[project]/dev/mezumani/src/components/global-search.tsx",
                                    lineNumber: 91,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/dev/mezumani/src/components/global-search.tsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            ref: inputRef,
                            type: "text",
                            className: "global-search-input",
                            placeholder: "חיפוש הוצאות...",
                            value: query,
                            onChange: (e)=>handleInputChange(e.target.value)
                        }, void 0, false, {
                            fileName: "[project]/dev/mezumani/src/components/global-search.tsx",
                            lineNumber: 93,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                            className: "global-search-kbd",
                            children: "Esc"
                        }, void 0, false, {
                            fileName: "[project]/dev/mezumani/src/components/global-search.tsx",
                            lineNumber: 101,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/dev/mezumani/src/components/global-search.tsx",
                    lineNumber: 77,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "global-search-results",
                    children: [
                        isPending && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "global-search-loading",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "spinner-border spinner-border-sm",
                                role: "status"
                            }, void 0, false, {
                                fileName: "[project]/dev/mezumani/src/components/global-search.tsx",
                                lineNumber: 107,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/dev/mezumani/src/components/global-search.tsx",
                            lineNumber: 106,
                            columnNumber: 13
                        }, this),
                        !isPending && query.trim().length >= 2 && results.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "global-search-empty",
                            children: "לא נמצאו תוצאות"
                        }, void 0, false, {
                            fileName: "[project]/dev/mezumani/src/components/global-search.tsx",
                            lineNumber: 112,
                            columnNumber: 13
                        }, this),
                        results.map((sheet)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "global-search-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "global-search-group-title",
                                        children: sheet.sheetTitle
                                    }, void 0, false, {
                                        fileName: "[project]/dev/mezumani/src/components/global-search.tsx",
                                        lineNumber: 117,
                                        columnNumber: 15
                                    }, this),
                                    sheet.results.map((r, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "global-search-item",
                                            onClick: ()=>navigate(sheet.sheetId, sheet.type),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "global-search-item-name",
                                                    children: r.expense
                                                }, void 0, false, {
                                                    fileName: "[project]/dev/mezumani/src/components/global-search.tsx",
                                                    lineNumber: 126,
                                                    columnNumber: 19
                                                }, this),
                                                r.date && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "global-search-item-date",
                                                    children: r.date
                                                }, void 0, false, {
                                                    fileName: "[project]/dev/mezumani/src/components/global-search.tsx",
                                                    lineNumber: 128,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, `${sheet.sheetId}-${r.row}-${idx}`, true, {
                                            fileName: "[project]/dev/mezumani/src/components/global-search.tsx",
                                            lineNumber: 121,
                                            columnNumber: 17
                                        }, this))
                                ]
                            }, sheet.sheetId, true, {
                                fileName: "[project]/dev/mezumani/src/components/global-search.tsx",
                                lineNumber: 116,
                                columnNumber: 13
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/dev/mezumani/src/components/global-search.tsx",
                    lineNumber: 104,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/dev/mezumani/src/components/global-search.tsx",
            lineNumber: 73,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/dev/mezumani/src/components/global-search.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_s(GlobalSearch, "/1VkbU7jjGfthXWBSAoGHFekhYE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"],
        __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$mezumani$2f$src$2f$hooks$2f$use$2d$debounced$2d$callback$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebouncedCallback"]
    ];
});
_c = GlobalSearch;
var _c;
__turbopack_context__.k.register(_c, "GlobalSearch");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=dev_mezumani_src_2b68c930._.js.map