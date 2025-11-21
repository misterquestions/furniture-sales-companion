export type DiscountRule = {
  id: string;
  label: string;
  percentage: number;
  mode?: "discount" | "markup";
  applyOn: "base" | "running";
  description?: string;
};

export type PriceTier = {
  id: string;
  label: string;
  amount: number;
  description?: string;
  ruleRef?: string;
};

export type PriceBreakdown = {
  baseAmount: number;
  tiers: PriceTier[];
};
