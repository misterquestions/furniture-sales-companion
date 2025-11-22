import { CatalogExperience } from "@/components/catalog/catalog-experience";
import { parseCatalogFilters, parsePaginationParams } from "@/lib/catalog/search-params";
import { getCatalogPayload } from "@/lib/services/catalog-service";

type CatalogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CatalogPage({
  searchParams,
}: CatalogPageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseCatalogFilters(resolvedSearchParams);
  const { page, pageSize } = parsePaginationParams(resolvedSearchParams);
  const catalog = await getCatalogPayload({ filters, page, pageSize });

  return (
    <CatalogExperience
      initialProducts={catalog.products}
      fabrics={catalog.fabrics}
      providers={catalog.providers}
      discountRules={catalog.discountRules}
      initialTotal={catalog.total}
      initialPage={catalog.page}
      pageSize={catalog.pageSize}
      categories={catalog.categories}
      subtypes={catalog.subtypes}
      initialFilters={filters}
      priceRange={catalog.priceRange}
    />
  );
}
