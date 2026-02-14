import { getAppConfig } from "@/lib/google-sheets";
import {
  getCategoryNames,
  buildCategoryColorMap,
  buildCardsWithOwner,
  getCardOwner,
  CARD_OWNER_COLORS,
} from "@/lib/utils";
import type { Transaction, AppConfig } from "@/lib/types";

export async function loadPageConfig() {
  const config = await getAppConfig();
  const { cards: allCards, cardColorMap } = buildCardsWithOwner(config);
  const colorMap = buildCategoryColorMap(
    config.monthlyCategories,
    config.vacationCategories,
  );
  return { config, allCards, cardColorMap, colorMap };
}

export function ensureTransactionCardColors(
  transactions: Transaction[],
  cardColorMap: Record<string, string>,
  config: AppConfig,
) {
  for (const t of transactions) {
    if (t.card && !cardColorMap[t.card]) {
      const owner = getCardOwner(t.card, config);
      cardColorMap[t.card] = CARD_OWNER_COLORS[owner];
    }
  }
}

export { getCategoryNames };
