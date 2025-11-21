"use client";

import { useState } from "react";
import Image from "next/image";

import { CatalogProduct, PriceBreakdown } from "@/types";
import { formatCurrency } from "@/lib/pricing";
import { CATALOG_IMAGE_PLACEHOLDER } from "@/lib/media";
import { pluralizeWord } from "@/lib/strings";

type ProductCardProps = {
  product: CatalogProduct;
  priceBreakdown: PriceBreakdown;
  fabricCount: number;
  onOpenDetail: (product: CatalogProduct) => void;
};

export function ProductCard({
  product,
  priceBreakdown,
  fabricCount,
  onOpenDetail,
}: ProductCardProps) {
  const highlightTier = priceBreakdown.tiers.at(-1);
  const [failedImageId, setFailedImageId] = useState<string | null>(null);
  const imageError = failedImageId === product.id;
  const hasCustomImage = Boolean(product.imageUrl);
  const imageSrc = hasCustomImage && !imageError ? product.imageUrl! : CATALOG_IMAGE_PLACEHOLDER;

  return (
    <button
      onClick={() => onOpenDetail(product)}
      className="group flex flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/90 text-left shadow-[0_12px_40px_rgba(15,118,110,0.08)] ring-1 ring-white/60 transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(16,185,129,0.18)]"
    >
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
          onError={() => setFailedImageId(product.id)}
        />
        {(!hasCustomImage || imageError) && (
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold shadow ${
              imageError
                ? "bg-rose-600/90 text-white"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {imageError ? "Fallo al cargar la imagen" : "Sin foto"}
          </span>
        )}
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-2xl bg-white/90 px-3 py-1 text-[11px] shadow">
          <span className="font-semibold text-gray-900">
            {product.category}
          </span>
          <span className="text-gray-500">{product.subtype}</span>
        </div>
        {product.isExhibition && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-500/95 px-3 py-1 text-[11px] font-semibold text-white shadow">
            Exhibición
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">
            {product.description}
          </p>
          {product.provider && (
            <div className="flex items-center justify-between text-[11px] text-gray-500">
              <span className="font-semibold text-gray-700">
                {product.provider.name}
              </span>
              {typeof product.provider.leadTimeWeeks === "number" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                  {product.provider.leadTimeWeeks}w
                  <span className="text-[10px] uppercase tracking-wide">
                    Lead
                  </span>
                </span>
              )}
            </div>
          )}
          {!product.provider && (
            <div className="flex items-center justify-between text-[11px] text-amber-700">
              <span className="font-semibold">Sin proveedor asignado</span>
              <span className="rounded-full border border-amber-200 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                Revisar
              </span>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-emerald-50/60 p-3 text-[12px]">
          <div className="flex items-baseline justify-between text-gray-600">
            <span>Lista</span>
            <span className="text-sm font-semibold text-gray-900">
              {formatCurrency(priceBreakdown.baseAmount)}
            </span>
          </div>
          <div className="mt-2 space-y-1">
            {priceBreakdown.tiers.map(
              (tier: PriceBreakdown["tiers"][number]) => (
                <div
                  key={tier.id}
                  className="flex items-center justify-between text-emerald-700"
                >
                  <span>{tier.label}</span>
                  <span className="font-semibold">
                    {formatCurrency(tier.amount)}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-1 text-[12px]">
          <span className="text-gray-500">
            {fabricCount} {pluralizeWord(fabricCount, "tela")}{" "}
            {pluralizeWord(fabricCount, "disponible", "disponibles")}
          </span>
          {highlightTier && (
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
              Ver detalle
              <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 1l4 5-4 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
