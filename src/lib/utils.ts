import { HEBREW_MONTHS, SETTINGS_SHEET_NAME } from "./constants";
import type { SheetInfo, YearGroup } from "./types";
import {
  CreditCard,
  Home,
  Plane,
  ShoppingCart,
  Car,
  Utensils,
  Heart,
  Gift,
  Briefcase,
  GraduationCap,
  Dumbbell,
  Baby,
  type LucideIcon,
  Wallet,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  'סה"כ': CreditCard,
  סהכ: CreditCard,
  דיור: Home,
  חופשות: Plane,
  חופשה: Plane,
  קניות: ShoppingCart,
  סופר: ShoppingCart,
  רכב: Car,
  אוכל: Utensils,
  מסעדות: Utensils,
  בריאות: Heart,
  מתנות: Gift,
  עבודה: Briefcase,
  לימודים: GraduationCap,
  ספורט: Dumbbell,
  תינוק: Baby,
};

export function getSummaryCardIcon(label: string): LucideIcon {
  return ICON_MAP[label] ?? Wallet;
}

const currencyFormatter = new Intl.NumberFormat("he-IL", {
  style: "currency",
  currency: "ILS",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

export function classifySheet(sheetId: number, title: string): SheetInfo {
  // Settings sheet
  if (title === SETTINGS_SHEET_NAME) {
    return { sheetId, title, type: "settings" };
  }

  // Annual sheet: "שנתי XX"
  const annualMatch = title.match(/^שנתי\s+(\d+)$/);
  if (annualMatch) {
    return {
      sheetId,
      title,
      type: "annual",
      year: parseInt(annualMatch[1], 10),
    };
  }

  // Monthly sheet: "{HebrewMonth} XX"
  for (let i = 0; i < HEBREW_MONTHS.length; i++) {
    const monthMatch = title.match(
      new RegExp(`^${HEBREW_MONTHS[i]}\\s+(\\d+)$`),
    );
    if (monthMatch) {
      return {
        sheetId,
        title,
        type: "monthly",
        monthIndex: i,
        year: parseInt(monthMatch[1], 10),
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
      year: parseInt(vacationMatch[2], 10),
    };
  }

  return { sheetId, title, type: "other" };
}

export function getCurrentMonthTitle(): string {
  const now = new Date();
  const monthName = HEBREW_MONTHS[now.getMonth()];
  const yearSuffix = now.getFullYear() % 100;
  return `${monthName} ${yearSuffix}`;
}

/**
 * Find the adjacent month sheet from the sheets list.
 * Returns the SheetInfo or null if not found.
 */
export function getAdjacentMonth(
  currentTitle: string,
  direction: -1 | 1,
  sheets: SheetInfo[],
): SheetInfo | null {
  const info = classifySheet(0, currentTitle);
  if (info.type !== "monthly" || info.monthIndex === undefined || !info.year)
    return null;

  let newMonth = info.monthIndex + direction;
  let newYear = info.year;

  if (newMonth < 0) {
    newMonth = 11;
    newYear -= 1;
  } else if (newMonth > 11) {
    newMonth = 0;
    newYear += 1;
  }

  const targetTitle = `${HEBREW_MONTHS[newMonth]} ${newYear}`;
  return sheets.find((s) => s.title === targetTitle) ?? null;
}

/**
 * Strip the year suffix from a sheet title for display.
 * e.g., "ינואר 26" -> "ינואר", "קפריסין 26" -> "קפריסין"
 */
export function stripYearSuffix(title: string): string {
  return title.replace(/\s+\d+$/, "");
}

export function parseNumber(value: string | undefined | null): number {
  if (!value) return 0;
  const cleaned = value.replace(/[^\d.-]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

import type { AppConfig, CategoryItem } from "./types";

/**
 * Get all cards combined from the grouped config.
 */
export function getAllCards(config: AppConfig): string[] {
  return [...config.cardsEinor, ...config.cardsZiv, ...config.cardsShared];
}

/**
 * Card owner group colors for differentiation.
 */
export const CARD_OWNER_COLORS = {
  einor: "#7abaff", // pastel blue
  ziv: "#b49fdc", // pastel purple
  shared: "#77d9a0", // pastel green
} as const;

export const OWNER_LABELS: Record<string, string> = {
  einor: "עינור",
  ziv: "זיו",
  shared: "משותף",
};

/**
 * Determine which owner group a card belongs to based on the config lists.
 */
export function getCardOwner(
  cardName: string,
  config?: AppConfig,
): "einor" | "ziv" | "shared" {
  if (config) {
    // Strip owner suffix (e.g. "one zero - עינור" → "one zero") for matching
    const baseName = cardName.replace(/ - (עינור|זיו)$/, "");
    if (config.cardsShared.includes(baseName)) return "shared";
    if (config.cardsEinor.includes(baseName)) return "einor";
    if (config.cardsZiv.includes(baseName)) return "ziv";
  }
  // Fallback: text matching for cards with owner suffix
  if (cardName.includes("עינור")) return "einor";
  if (cardName.includes("זיו")) return "ziv";
  return "shared";
}

/**
 * Build a card list with owner name suffix and matching color map.
 * Returns cards like "דיסקונט - עינור" with correct colors.
 */
export function buildCardsWithOwner(config: AppConfig): {
  cards: string[];
  cardColorMap: Record<string, string>;
} {
  const cards: string[] = [];
  const cardColorMap: Record<string, string> = {};

  const groups: { items: string[]; owner: "einor" | "ziv" | "shared" }[] = [
    { items: config.cardsShared, owner: "shared" },
    { items: config.cardsEinor, owner: "einor" },
    { items: config.cardsZiv, owner: "ziv" },
  ];

  for (const group of groups) {
    for (const card of group.items) {
      // Shared cards keep plain name, others get owner suffix
      const label =
        group.owner === "shared"
          ? card
          : `${card} - ${OWNER_LABELS[group.owner]}`;
      cards.push(label);
      cardColorMap[label] = CARD_OWNER_COLORS[group.owner];
    }
  }

  return { cards, cardColorMap };
}

/**
 * Build a color lookup map from CategoryItem arrays.
 */
export function buildCategoryColorMap(
  ...categoryLists: CategoryItem[][]
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const list of categoryLists) {
    for (const item of list) {
      map[item.name] = item.color;
    }
  }
  return map;
}

/**
 * Extract just the names from a CategoryItem array.
 */
export function getCategoryNames(items: CategoryItem[]): string[] {
  return items.map((item) => item.name);
}

/**
 * Build year groups from a list of sheets for the sidebar.
 */
export function buildYearGroups(sheets: SheetInfo[]): YearGroup[] {
  const yearMap = new Map<
    number,
    { months: SheetInfo[]; vacations: SheetInfo[]; hasAnnual: boolean }
  >();

  for (const sheet of sheets) {
    if (
      sheet.type === "settings" ||
      sheet.type === "other" ||
      sheet.year === undefined
    )
      continue;

    if (!yearMap.has(sheet.year)) {
      yearMap.set(sheet.year, { months: [], vacations: [], hasAnnual: false });
    }
    const group = yearMap.get(sheet.year)!;

    if (sheet.type === "monthly") {
      group.months.push(sheet);
    } else if (sheet.type === "vacation") {
      group.vacations.push(sheet);
    } else if (sheet.type === "annual") {
      group.hasAnnual = true;
    }
  }

  const groups: YearGroup[] = [];
  for (const [year, data] of yearMap) {
    data.months.sort((a, b) => (b.monthIndex ?? 0) - (a.monthIndex ?? 0));
    // vacations keep their original Google Sheets tab order
    groups.push({
      year,
      fullYear: 2000 + year,
      months: data.months,
      vacations: data.vacations,
      hasAnnual: data.hasAnnual,
    });
  }

  // Sort years descending
  groups.sort((a, b) => b.year - a.year);
  return groups;
}
