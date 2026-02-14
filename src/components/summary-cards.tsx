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
    <div className={`row g-3 ${compact ? "mb-4" : "mb-3"}`}>
      {cards.map((card) => {
        const Icon = getSummaryCardIcon(card.label);
        return (
          <div key={card.label} className="col">
            <div
              className={`card ${card.gradient} rounded-3 ${compact ? "px-3 py-2" : "p-3"} h-100`}
            >
              {compact ? (
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <span className="summary-card-icon">
                      <Icon size={18} />
                    </span>
                    <span className="small opacity-75">{card.label}</span>
                  </div>
                  <div className="fw-bold" style={{ fontSize: "1.1rem" }}>
                    {formatCurrency(card.amount)}
                  </div>
                </div>
              ) : (
                <>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="summary-card-icon">
                      <Icon size={18} />
                    </span>
                    <span className="small opacity-75">{card.label}</span>
                  </div>
                  <div className="h5 fw-bold mb-0 text-center">
                    {formatCurrency(card.amount)}
                  </div>
                  {card.subtitle && (
                    <div className="small opacity-75 text-center">
                      {card.subtitle}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
