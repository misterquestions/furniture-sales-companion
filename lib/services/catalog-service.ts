import { prisma } from "@/lib/prisma";
import {
  fabrics as mockFabrics,
  products as mockProducts,
  providers as mockProviders,
} from "@/data/mockCatalog";
import { defaultDiscountRules } from "@/lib/pricing";
import { filterProducts } from "@/lib/catalog";
import {
  CatalogFilters,
  CatalogProduct,
  DiscountRule,
  Fabric,
  InventoryInfo,
  Provider,
} from "@/types/catalog";

import type {
  DiscountApplyOn,
  DiscountMode,
  Fabric as FabricModel,
  InventorySnapshot,
  Prisma,
  Product,
  ProductFabric,
  ProductTag,
  Provider as ProviderModel,
} from "@/prisma/generated/client";

export type CatalogPayload = {
  products: CatalogProduct[];
  fabrics: Fabric[];
  providers: Provider[];
  discountRules: DiscountRule[];
  total: number;
  page: number;
  pageSize: number;
  categories: string[];
  subtypes: string[];
  priceRange: { min: number; max: number };
};

type CatalogPayloadOptions = {
  filters?: CatalogFilters;
  page?: number;
  pageSize?: number;
};

const DEFAULT_PAGE_SIZE = 9;

const applyOnMap: Record<DiscountApplyOn, DiscountRule["applyOn"]> = {
  BASE: "base",
  RUNNING: "running",
};

const discountModeMap: Record<
  DiscountMode,
  NonNullable<DiscountRule["mode"]>
> = {
  DISCOUNT: "discount",
  MARKUP: "markup",
};

function mapInventory(
  snapshot?: InventorySnapshot | null
): InventoryInfo | undefined {
  if (!snapshot) return undefined;
  return {
    onHand: snapshot.onHand,
    incoming: snapshot.incoming ?? undefined,
    leadTimeWeeks: snapshot.leadTimeWeeks ?? undefined,
    notes: snapshot.notes ?? undefined,
  };
}

function mapProvider(record: ProviderModel): Provider {
  return {
    id: record.id,
    name: record.name,
    contactName: record.contactName ?? undefined,
    email: record.email ?? undefined,
    phone: record.phone ?? undefined,
    leadTimeWeeks: record.leadTimeWeeks ?? undefined,
    notes: record.notes ?? undefined,
    rating: record.rating ?? undefined,
  };
}

function mapProduct(
  record: Product & {
    fabrics: ProductFabric[];
    inventory: InventorySnapshot | null;
    tags: ProductTag[];
    provider: ProviderModel | null;
  }
): CatalogProduct {
  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    category: record.category,
    subtype: record.subtype,
    description: record.description,
    priceList: record.priceList,
    isExhibition: record.isExhibition,
    fabrics: record.fabrics.map((pf) => pf.fabricId),
    imageUrl: record.imageUrl,
    inventory: mapInventory(record.inventory),
    tags: record.tags.map((tag) => tag.value),
    providerId: record.providerId ?? undefined,
    provider: record.provider ? mapProvider(record.provider) : undefined,
  };
}

function mapFabric(record: FabricModel): Fabric {
  return {
    id: record.id,
    name: record.name,
    colorHex: record.colorHex,
    description: record.description ?? undefined,
  };
}

function mapDiscounts(
  rules: Awaited<ReturnType<typeof prisma.discountRule.findMany>>
): DiscountRule[] {
  if (!rules.length) return defaultDiscountRules;
  return rules.map((rule) => ({
    id: rule.id,
    label: rule.label,
    percentage: Number(rule.percentage),
    applyOn: applyOnMap[rule.applyOn],
    mode: discountModeMap[rule.mode],
    description: rule.description ?? undefined,
  }));
}

const useMockData = process.env.USE_MOCK_DATA === "true";

function buildWhere(filters: CatalogFilters = {}): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};
  const andConditions: Prisma.ProductWhereInput[] = [];

  if (filters.category) where.category = filters.category;
  if (filters.subtype) where.subtype = filters.subtype;
  if (filters.providerId) where.providerId = filters.providerId;
  if (filters.onlyExhibition) where.isExhibition = true;

  const priceFilter: Prisma.IntFilter = {};
  if (
    typeof filters.minPrice === "number" &&
    !Number.isNaN(filters.minPrice)
  ) {
    priceFilter.gte = Math.floor(filters.minPrice);
  }
  if (
    typeof filters.maxPrice === "number" &&
    !Number.isNaN(filters.maxPrice)
  ) {
    priceFilter.lte = Math.ceil(filters.maxPrice);
  }
  if (Object.keys(priceFilter).length) {
    where.priceList = priceFilter;
  }

  if (filters.query?.trim()) {
    const query = filters.query.trim();
    andConditions.push({
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { category: { contains: query, mode: "insensitive" } },
        { subtype: { contains: query, mode: "insensitive" } },
        { provider: { name: { contains: query, mode: "insensitive" } } },
      ],
    });
  }

  if (andConditions.length) {
    where.AND = andConditions;
  }

  return where;
}

const sortStrings = (list: Array<string | null>): string[] =>
  Array.from(
    new Set(list.filter((value): value is string => Boolean(value)))
  ).sort((a, b) => a.localeCompare(b));

import { MAX_PRICE_DEFAULT } from "@/constants/catalog";

export async function getCatalogPayload(
  options: CatalogPayloadOptions = {}
): Promise<CatalogPayload> {
  const { filters = {}, page = 1, pageSize = DEFAULT_PAGE_SIZE } = options;

  if (useMockData) {
    // Calculate price range from the filtered set (ignoring price filters for the range itself)
    const { minPrice, maxPrice, ...otherFilters } = filters;
    const rangeCandidates = filterProducts(mockProducts, otherFilters);
    const prices = rangeCandidates.map((p) => p.priceList);
    const min = prices.length ? Math.min(...prices) : 0;
    const max = prices.length ? Math.max(...prices) : MAX_PRICE_DEFAULT;

    const filtered = filterProducts(mockProducts, filters);
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const products = filtered.slice(start, start + pageSize);

    return {
      products,
      fabrics: mockFabrics,
      providers: mockProviders,
      discountRules: defaultDiscountRules,
      total,
      page,
      pageSize,
      categories: sortStrings(mockProducts.map((product) => product.category)),
      subtypes: sortStrings(mockProducts.map((product) => product.subtype)),
      priceRange: { min, max },
    };
  }

  const where = buildWhere(filters);
  const skip = (page - 1) * pageSize;

  // Build where clause for price range (ignoring price filters)
  const { minPrice, maxPrice, ...otherFilters } = filters;
  const rangeWhere = buildWhere(otherFilters);

  try {
    const [
      dbProducts,
      total,
      dbFabrics,
      dbProviders,
      dbDiscounts,
      categoryRows,
      subtypeRows,
      priceAgg,
    ] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          fabrics: true,
          inventory: true,
          tags: true,
          provider: true,
        },
        orderBy: { name: "asc" },
        skip,
        take: pageSize,
      }),
      prisma.product.count({ where }),
      prisma.fabric.findMany({ orderBy: { name: "asc" } }),
      prisma.provider.findMany({ orderBy: { name: "asc" } }),
      prisma.discountRule.findMany({
        where: { isActive: true, productId: null },
        orderBy: { priority: "asc" },
      }),
      prisma.product.findMany({
        distinct: ["category"],
        select: { category: true },
        orderBy: { category: "asc" },
      }),
      prisma.product.findMany({
        distinct: ["subtype"],
        select: { subtype: true },
        orderBy: { subtype: "asc" },
      }),
      prisma.product.aggregate({
        where: rangeWhere,
        _min: { priceList: true },
        _max: { priceList: true },
      }),
    ]);

    return {
      products: dbProducts.map(mapProduct),
      fabrics: dbFabrics.map(mapFabric),
      providers: dbProviders.map(mapProvider),
      discountRules: mapDiscounts(dbDiscounts),
      total,
      page,
      pageSize,
      categories: sortStrings(categoryRows.map((row) => row.category)),
      subtypes: sortStrings(subtypeRows.map((row) => row.subtype)),
      priceRange: {
        min: priceAgg._min.priceList ?? 0,
        max: priceAgg._max.priceList ?? MAX_PRICE_DEFAULT,
      },
    };
  } catch (error) {
    console.warn("Falling back to mock catalog due to Prisma error", error);
  }

  const filtered = filterProducts(mockProducts, filters);
  const total = filtered.length;
  const start = (page - 1) * pageSize;

  // Calculate price range from the filtered set (ignoring price filters for the range itself)
  const { minPrice: _min, maxPrice: _max, ...fallbackFilters } = filters;
  const rangeCandidates = filterProducts(mockProducts, fallbackFilters);
  const prices = rangeCandidates.map((p) => p.priceList);
  const min = prices.length ? Math.min(...prices) : 0;
  const max = prices.length ? Math.max(...prices) : MAX_PRICE_DEFAULT;

  return {
    products: filtered.slice(start, start + pageSize),
    fabrics: mockFabrics,
    providers: mockProviders,
    discountRules: defaultDiscountRules,
    total,
    page,
    pageSize,
    categories: sortStrings(mockProducts.map((product) => product.category)),
    subtypes: sortStrings(mockProducts.map((product) => product.subtype)),
    priceRange: { min, max },
  };
}

export async function getCatalogProduct(
  identifier: string
): Promise<{
  product: CatalogProduct | null;
  fabrics: Fabric[];
  discountRules: DiscountRule[];
}> {
  if (useMockData) {
    const product =
      mockProducts.find(
        (item) => item.id === identifier || item.slug === identifier
      ) ?? null;
    return {
      product,
      fabrics: mockFabrics,
      discountRules: defaultDiscountRules,
    };
  }

  try {
    const [record, dbFabrics, dbDiscounts] = await Promise.all([
      prisma.product.findFirst({
        where: {
          OR: [{ id: identifier }, { slug: identifier }],
        },
        include: {
          fabrics: true,
          inventory: true,
          tags: true,
          provider: true,
        },
      }),
      prisma.fabric.findMany({ orderBy: { name: "asc" } }),
      prisma.discountRule.findMany({
        where: { isActive: true, productId: null },
        orderBy: { priority: "asc" },
      }),
    ]);

    return {
      product: record ? mapProduct(record) : null,
      fabrics: dbFabrics.map(mapFabric),
      discountRules: mapDiscounts(dbDiscounts),
    };
  } catch (error) {
    console.warn("Falling back to mock data for product", identifier, error);
  }

  const fallback =
    mockProducts.find(
      (item) => item.id === identifier || item.slug === identifier
    ) ?? null;
  return {
    product: fallback,
    fabrics: mockFabrics,
    discountRules: defaultDiscountRules,
  };
}
