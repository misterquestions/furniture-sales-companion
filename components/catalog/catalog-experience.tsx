"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  CatalogFilters,
  CatalogProduct,
  DiscountRule,
  Fabric,
  Provider,
  PriceBreakdown,
} from "@/types";
import { calculatePriceBreakdown, defaultDiscountRules } from "@/lib/pricing";
import { pluralizeWord } from "@/lib/strings";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { buildCatalogSearchParams } from "@/lib/catalog/search-params";
import { Button } from "@/components/ui/button";
import { FiltersBar } from "./filters-bar";
import { ProductCard } from "./product-card";
import { ProductDetail } from "./product-detail";

type CatalogExperienceProps = {
  initialProducts: CatalogProduct[];
  fabrics: Fabric[];
  providers?: Provider[];
  discountRules?: DiscountRule[];
  initialTotal: number;
  initialPage?: number;
  pageSize?: number;
  categories: string[];
  subtypes: string[];
  initialFilters?: CatalogFilters;
  priceRange?: { min: number; max: number };
};

type CatalogResponsePayload = {
  products: CatalogProduct[];
  total: number;
  page: number;
  pageSize: number;
  priceRange?: { min: number; max: number };
};

export function CatalogExperience({
  initialProducts,
  fabrics,
  providers = [],
  discountRules = defaultDiscountRules,
  initialTotal,
  initialPage = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  categories,
  subtypes,
  initialFilters = {},
  priceRange: initialPriceRange,
}: CatalogExperienceProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [filters, setFilters] = useState<CatalogFilters>(initialFilters);
  const [detailProductId, setDetailProductId] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [page, setPage] = useState(initialPage);
  const [catalogState, setCatalogState] = useState<CatalogResponsePayload>({
    products: initialProducts,
    total: initialTotal,
    page: initialPage,
    pageSize,
    priceRange: initialPriceRange,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasHydratedRef = useRef(false);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobileView(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const productBreakdownMap = useMemo(() => {
    return new Map<string, PriceBreakdown>(
      catalogState.products.map((product) => [
        product.id,
        calculatePriceBreakdown(product.priceList, discountRules),
      ])
    );
  }, [catalogState.products, discountRules]);

  useEffect(() => {
    if (!hasHydratedRef.current) {
      hasHydratedRef.current = true;
      return;
    }

    const controller = new AbortController();
    const params = buildCatalogSearchParams(filters, page, pageSize);

    async function loadCatalog() {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const response = await fetch(`/api/catalog?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Catalog API error");
        const payload: CatalogResponsePayload = await response.json();
        setCatalogState(payload);
        setPage(payload.page);
        setDetailProductId(null);
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        console.error("Failed to load catalog", error);
        setErrorMessage("No pudimos cargar el catálogo. Intenta de nuevo.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadCatalog();

    return () => controller.abort();
  }, [filters, page, pageSize, requestVersion]);

  useEffect(() => {
    if (!hasHydratedRef.current) return;
    if (typeof window === "undefined" || !pathname) return;

    const params = buildCatalogSearchParams(filters, page, pageSize);
    const search = params.toString();
    const nextUrl = search ? `${pathname}?${search}` : pathname;
    const currentUrl = `${pathname}${window.location.search}`;

    if (currentUrl !== nextUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [filters, page, pageSize, pathname]);

  const totalPages = Math.max(1, Math.ceil(catalogState.total / pageSize));
  const pageRangeStart = catalogState.total ? (page - 1) * pageSize + 1 : 0;
  const pageRangeEnd = catalogState.total
    ? Math.min(page * pageSize, catalogState.total)
    : 0;
  const showPagination = catalogState.total > pageSize;
  const hasResults = catalogState.total > 0;

  const detailProduct = detailProductId
    ? catalogState.products.find((product) => product.id === detailProductId) ??
      null
    : null;
  const detailBreakdown = detailProduct
    ? productBreakdownMap.get(detailProduct.id) ?? null
    : null;

  const getProductDetailRoute = (product: CatalogProduct) =>
    `/modelos/${product.slug ?? product.id}`;

  const handleProductOpen = (product: CatalogProduct) => {
    if (isMobileView) {
      router.push(getProductDetailRoute(product));
      return;
    }
    setDetailProductId(product.id);
  };

  const updateFilters = (
    updater: (current: CatalogFilters) => CatalogFilters
  ) => {
    setFilters((current) => {
      const next = updater(current);
      setPage(1);
      return next;
    });
  };

  const handleFiltersChange = (next: CatalogFilters) => {
    setFilters(() => {
      setPage(1);
      return next;
    });
  };

  const refetch = () => setRequestVersion((value) => value + 1);

  return (
    <div className="flex flex-col gap-5 text-gray-900">
      <section className="relative rounded-[30px] border border-white/60 bg-gradient-to-b from-emerald-50/80 to-white p-5 shadow-[0_18px_60px_rgba(16,185,129,0.12)]">
        <Link
          href="/gestion"
          className="absolute right-5 top-5 inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 transition hover:text-emerald-900"
        >
          Administrar catálogo
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
            <path
              d="M3 1l4 5-4 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="search"
              value={filters.query ?? ""}
              onChange={(event) =>
                updateFilters((current) => ({
                  ...current,
                  query: event.target.value || undefined,
                }))
              }
              placeholder="Busca por modelo, proveedor o material"
              className="w-full rounded-3xl border border-transparent bg-white px-5 py-4 text-sm font-medium text-gray-700 shadow-[0_12px_30px_rgba(15,118,110,0.15)] outline-none ring-emerald-500/30 focus:ring"
            />
            {filters.query && (
              <button
                type="button"
                onClick={() =>
                  updateFilters((current) => ({
                    ...current,
                    query: undefined,
                  }))
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700"
              >
                Limpiar
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Para filtrar por proveedor, categorías o precios usa el panel de
            filtros avanzados.
          </p>
        </div>
      </section>

      <details className="rounded-[28px] border border-white/60 bg-white/80 p-4 shadow-[0_12px_35px_rgba(15,118,110,0.08)]">
        <summary className="cursor-pointer text-sm font-semibold text-gray-900">
          Filtros avanzados (opcional)
        </summary>
        <div className="mt-4">
          <FiltersBar
            filters={filters}
            onChange={setFilters}
            categories={categories}
            subtypes={subtypes}
            providers={providers}
            showSearch={false}
            priceRange={catalogState.priceRange}
          />
        </div>
      </details>

      <section className="flex-1 rounded-[32px] border border-white/60 bg-white/90 p-4 shadow-[0_10px_45px_rgba(15,118,110,0.08)] sm:p-5">
        <div className="mb-4 flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            {hasResults
              ? `Mostrando ${pageRangeStart}-${pageRangeEnd} de ${
                  catalogState.total
                } ${pluralizeWord(catalogState.total, "modelo")}`
              : "No hay modelos con los filtros actuales"}
          </span>
          <span className="text-[11px] text-gray-500">
            Tip: todo se actualiza al escribir, ideal para llamadas en vivo.
          </span>
        </div>
        {errorMessage && (
          <div className="mb-4 flex flex-col gap-2 rounded-2xl border border-red-200 bg-red-50/70 px-4 py-3 text-sm text-red-700">
            <p>{errorMessage}</p>
            <Button variant="secondary" onClick={refetch}>
              Reintentar
            </Button>
          </div>
        )}
        {!hasResults && !isLoading ? (
          <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 text-center text-sm text-gray-500">
            <p className="font-semibold text-gray-600">
              No encontramos modelos con esos filtros.
            </p>
            <p className="text-xs">
              Prueba quitando algún filtro o cambiando el rango de precios.
            </p>
          </div>
        ) : (
          <>
            <div
              className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${
                isLoading ? "pointer-events-none opacity-60" : ""
              }`}
            >
              {catalogState.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priceBreakdown={productBreakdownMap.get(product.id)!}
                  fabricCount={product.fabrics.length}
                  onOpenDetail={handleProductOpen}
                />
              ))}
            </div>
            {isLoading && (
              <p className="mt-3 text-center text-xs font-semibold text-emerald-700">
                Actualizando catálogo...
              </p>
            )}
            {showPagination && hasResults && (
              <div className="mt-6 flex flex-col gap-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Página {page} de {totalPages} · Mostrando {pageRangeStart}-
                  {pageRangeEnd} de {catalogState.total}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setPage((current) => Math.max(1, current - 1))
                    }
                    disabled={page === 1 || isLoading}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setPage((current) => Math.min(totalPages, current + 1))
                    }
                    disabled={page === totalPages || isLoading}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <ProductDetail
        product={detailProduct}
        fabrics={fabrics}
        priceBreakdown={detailBreakdown}
        open={Boolean(detailProduct)}
        onClose={() => setDetailProductId(null)}
      />
    </div>
  );
}
