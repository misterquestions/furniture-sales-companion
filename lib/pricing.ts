import { DiscountRule, PriceBreakdown } from "@/types/catalog";

export const defaultDiscountRules: DiscountRule[] = [
  {
    id: "discount-20",
    label: "Con 20% de descuento",
    percentage: 0.2,
    mode: "discount",
    applyOn: "base",
    description: "Descuento comercial habitual del 20% sobre lista.",
  },
  {
    id: "discount-20-10",
    label: "20% + 10% adicional",
    percentage: 0.1,
    mode: "discount",
    applyOn: "running",
    description: "Aplicado sobre el precio ya descontado al 20%.",
  },
];

export function calculatePriceBreakdown(
  basePrice: number,
  rules: DiscountRule[] = defaultDiscountRules
): PriceBreakdown {
  let runningAmount = basePrice;
  const tiers = rules.map((rule) => {
    const source = rule.applyOn === "base" ? basePrice : runningAmount;
    const factor =
      rule.mode === "markup" ? 1 + rule.percentage : 1 - rule.percentage;
    runningAmount = Math.round(source * factor);

    return {
      id: `${rule.id}-tier`,
      label: rule.label,
      amount: runningAmount,
      description: rule.description,
      ruleRef: rule.id,
    };
  });

  return {
    baseAmount: basePrice,
    tiers,
  };
}

export function formatCurrency(
  value: number,
  locale = "es-MX",
  currency = "MXN"
) {
  return value.toLocaleString(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
}
