import { PriceBreakdown } from "@/types/catalog";
import { formatCurrency } from "@/lib/pricing";

type PriceBlockProps = {
  breakdown: PriceBreakdown;
};

export function PriceBlock({ breakdown }: PriceBlockProps) {
  const lastTierIndex = breakdown.tiers.length - 1;

  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between rounded-2xl border border-gray-200/70 bg-white px-3 py-2">
        <span className="text-gray-500">Precio lista</span>
        <span className="font-semibold text-gray-900">
          {formatCurrency(breakdown.baseAmount)}
        </span>
      </div>
      {breakdown.tiers.map((tier, index) => (
        <div
          key={tier.id}
          className={`flex items-center justify-between rounded-2xl px-3 py-2 ${
            index === lastTierIndex
              ? "bg-emerald-600/10 text-emerald-900"
              : "bg-emerald-50 text-emerald-800"
          }`}
        >
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wide">
              {tier.label}
            </span>
            {tier.description && (
              <span className="text-[11px] text-emerald-800/80">
                {tier.description}
              </span>
            )}
          </div>
          <span className="text-base font-semibold">
            {formatCurrency(tier.amount)}
          </span>
        </div>
      ))}
    </div>
  );
}
