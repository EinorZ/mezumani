import { formatCurrency, getSummaryCardIcon } from "@/lib/utils";

export interface SummaryCardData {
  label: string;
  amount: number;
  subtitle?: string;
  gradient: string;
}

interface Props {
  cards: SummaryCardData[];
  compact?: boolean;
}

export function SummaryCards({ cards, compact = false }: Props) {
  return (
    <div
      className={`summary-cards-grid ${compact ? "summary-cards-grid-compact mb-4" : "mb-3"}`}
    >
      {cards.map((card) => {
        const Icon = getSummaryCardIcon(card.label);
        return (
          <article
            key={card.label}
            className={`card summary-card ${card.gradient} ${compact ? "summary-card-compact" : ""}`}
          >
            {compact ? (
              <div className="d-flex align-items-center justify-content-between gap-2">
                <div className="d-flex align-items-center gap-2 min-w-0">
                  <span className="summary-card-icon-sm">
                    <Icon size={15} aria-hidden="true" />
                  </span>
                  <span className="small opacity-75 text-truncate">
                    {card.label}
                  </span>
                </div>
                <div className="fw-bold summary-card-value" dir="ltr">
                  {formatCurrency(card.amount)}
                </div>
              </div>
            ) : (
              <>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="summary-card-icon">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className="small opacity-75">{card.label}</span>
                </div>
                <div
                  className="fw-bold mb-0 text-center summary-card-value"
                  dir="ltr"
                >
                  {formatCurrency(card.amount)}
                </div>
                {card.subtitle && (
                  <div className="small opacity-75 text-center">
                    {card.subtitle}
                  </div>
                )}
              </>
            )}
          </article>
        );
      })}
    </div>
  );
}
