import { CatalogFilters, CatalogProduct, Fabric } from "@/types";
import { calculatePriceBreakdown, defaultDiscountRules } from "@/lib/pricing";

export function filterProducts(
  products: CatalogProduct[],
  filters: CatalogFilters,
  options?: { pricingRules?: typeof defaultDiscountRules }
) {
  const { pricingRules = defaultDiscountRules } = options ?? {};
  const queryText = filters.query?.trim().toLowerCase();

  return products.filter((product) => {
    if (queryText) {
      const haystack = `${product.name} ${product.category} ${product.subtype} ${product.description} ${product.provider?.name ?? ""}`.toLowerCase();
      if (!haystack.includes(queryText)) return false;
    }

    if (filters.category && product.category !== filters.category) return false;
    if (filters.subtype && product.subtype !== filters.subtype) return false;
    if (filters.providerId && product.providerId !== filters.providerId)
      return false;
    if (filters.onlyExhibition && !product.isExhibition) return false;

    const breakdown = calculatePriceBreakdown(product.priceList, pricingRules);
    const comparable = breakdown.tiers.at(-1)?.amount ?? product.priceList;

    if (
      typeof filters.minPrice === "number" &&
      !Number.isNaN(filters.minPrice) &&
      comparable < filters.minPrice
    ) {
      return false;
    }

    if (
      typeof filters.maxPrice === "number" &&
      !Number.isNaN(filters.maxPrice) &&
      comparable > filters.maxPrice
    ) {
      return false;
    }

    return true;
  });
}

export function fabricsById(list: Fabric[]) {
  return new Map(list.map((fabric) => [fabric.id, fabric] as const));
}
