import { getCategoryNames, getCardOwner, CARD_OWNER_COLORS } from "@/lib/utils";
import type { Transaction, AppConfig } from "@/lib/types";

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
