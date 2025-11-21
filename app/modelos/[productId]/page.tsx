import { notFound } from "next/navigation";

import { ProductDetailContent } from "@/components/catalog/product-detail-content";
import { calculatePriceBreakdown } from "@/lib/pricing";
import { getCatalogProduct } from "@/lib/services/catalog-service";

type ProductPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;
  const { product, fabrics, discountRules } = await getCatalogProduct(
    productId
  );

  if (!product) {
    notFound();
  }

  const priceBreakdown = calculatePriceBreakdown(
    product.priceList,
    discountRules
  );

  return (
    <div className="min-h-screen bg-emerald-50/40 py-4 sm:py-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-white/60 bg-white shadow-[0_18px_60px_rgba(16,185,129,0.15)]">
        <ProductDetailContent
          product={product}
          fabrics={fabrics}
          priceBreakdown={priceBreakdown}
          mode="page"
          backHref="/catalog"
        />
      </div>
    </div>
  );
}
