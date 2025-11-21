import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "@/constants/pagination";
import { CatalogFilters } from "@/types";

type SearchParamSource =
  | URLSearchParams
  | Record<string, string | string[] | undefined>;

function getValue(source: SearchParamSource, key: string): string | null {
  if (source instanceof URLSearchParams) {
    return source.get(key);
  }

  const raw = source[key];
  if (Array.isArray(raw)) {
    return raw[0] ?? null;
  }

  return raw ?? null;
}

export function parseCatalogFilters(source: SearchParamSource): CatalogFilters {
  const filters: CatalogFilters = {};

  const query = getValue(source, "query");
  if (query) filters.query = query;

  const category = getValue(source, "category");
  if (category) filters.category = category;

  const subtype = getValue(source, "subtype");
  if (subtype) filters.subtype = subtype;

  const providerId = getValue(source, "providerId");
  if (providerId) filters.providerId = providerId;

  const onlyExhibition = getValue(source, "onlyExhibition");
  if (onlyExhibition === "true") filters.onlyExhibition = true;

  const minVal = getValue(source, "minPrice");
  if (minVal !== null) {
    const minPrice = Number(minVal);
    if (!Number.isNaN(minPrice)) filters.minPrice = minPrice;
  }

  const maxVal = getValue(source, "maxPrice");
  if (maxVal !== null) {
    const maxPrice = Number(maxVal);
    if (!Number.isNaN(maxPrice)) filters.maxPrice = maxPrice;
  }

  return filters;
}

export function parsePaginationParams(
  source: SearchParamSource
): { page: number; pageSize: number } {
  const page = Math.max(1, Number(getValue(source, "page")) || 1);
  const requestedPageSize = Number(getValue(source, "pageSize")) || DEFAULT_PAGE_SIZE;
  const pageSize = Math.max(1, Math.min(MAX_PAGE_SIZE, requestedPageSize));
  return { page, pageSize };
}

export function buildCatalogSearchParams(
  filters: CatalogFilters,
  page: number,
  pageSize: number
): URLSearchParams {
  const params = new URLSearchParams();
  
  if (page > 1) params.set("page", String(page));
  if (pageSize !== DEFAULT_PAGE_SIZE) params.set("pageSize", String(pageSize));

  if (filters.query) params.set("query", filters.query);
  if (filters.category) params.set("category", filters.category);
  if (filters.subtype) params.set("subtype", filters.subtype);
  if (filters.providerId) params.set("providerId", filters.providerId);
  if (filters.onlyExhibition) params.set("onlyExhibition", "true");
  if (typeof filters.minPrice === "number")
    params.set("minPrice", String(filters.minPrice));
  if (typeof filters.maxPrice === "number")
    params.set("maxPrice", String(filters.maxPrice));

  return params;
}
