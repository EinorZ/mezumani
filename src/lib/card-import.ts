import type { CardLastFourMapping } from "./types";

/** Extract the four-digit card suffix from names such as 0494_09_2026.xlsx. */
export function extractCardLastFour(fileName: string): string | null {
  const baseName = fileName.split(/[\\/]/).at(-1) ?? fileName;
  const leadingDigits = baseName.match(/^(\d{4})(?=[_. -]|$)/)?.[1];
  if (leadingDigits) return leadingDigits;

  return (
    baseName.match(
      /(?:ויזה|visa|mastercard|מאסטרקארד|אמקס)\s+(\d{4})(?=\s*[-_.])/iu,
    )?.[1] ?? null
  );
}

/** Return a card only when the filename maps to one valid, unambiguous card. */
export function detectCardFromFileName(
  fileName: string,
  mappings: CardLastFourMapping[],
  availableCards: string[],
): string | null {
  const lastFour = extractCardLastFour(fileName);
  if (!lastFour) return null;

  const available = new Set(availableCards);
  const matches = new Set(
    mappings
      .filter(
        (mapping) =>
          mapping.lastFour === lastFour && available.has(mapping.card),
      )
      .map((mapping) => mapping.card),
  );

  return matches.size === 1 ? [...matches][0] : null;
}
