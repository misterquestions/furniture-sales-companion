import { NextResponse } from "next/server";

import { getCatalogPayload } from "@/lib/services/catalog-service";
import {
  parseCatalogFilters,
  parsePaginationParams,
} from "@/lib/catalog/search-params";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = url.searchParams;

  const { page, pageSize } = parsePaginationParams(params);
  const filters = parseCatalogFilters(params);
  const payload = await getCatalogPayload({ filters, page, pageSize });

  return NextResponse.json({
    products: payload.products,
    total: payload.total,
    page: payload.page,
    pageSize: payload.pageSize,
    priceRange: payload.priceRange,
  });
}
