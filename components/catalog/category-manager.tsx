"use client";

import { useMemo } from "react";
import { CatalogProduct } from "@/types";
import { pluralizeWord } from "@/lib/strings";

type CategoryManagerProps = {
  categories: string[];
  products: CatalogProduct[];
};

export function CategoryManager({
  categories,
  products,
}: CategoryManagerProps) {
  const categoryStats = useMemo(() => {
    const stats = new Map<string, number>();
    categories.forEach((cat) => stats.set(cat, 0));

    products.forEach((product) => {
      if (product.category) {
        const current = stats.get(product.category) ?? 0;
        stats.set(product.category, current + 1);
      }
    });

    return Array.from(stats.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [categories, products]);

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-white/60 bg-white/90 p-6 shadow-[0_12px_45px_rgba(15,118,110,0.12)]">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Categorías activas
          </h2>
          <p className="text-sm text-gray-500">
            Gestiona las categorías disponibles para organizar tu catálogo.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryStats.map((stat) => (
            <div
              key={stat.name}
              className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/30 px-5 py-4 transition hover:border-emerald-200 hover:bg-emerald-50/50"
            >
              <div>
                <p className="font-semibold text-gray-900">{stat.name}</p>
                <p className="text-xs text-gray-500">
                  {stat.count} {pluralizeWord(stat.count, "modelo")}
                </p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
                <span className="text-xs font-bold">
                  {stat.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          ))}

          <button className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-4 text-sm font-medium text-gray-500 transition hover:border-emerald-300 hover:bg-emerald-50/30 hover:text-emerald-700">
            <span className="text-lg">+</span>
            <span>Nueva categoría</span>
          </button>
        </div>
      </div>
    </div>
  );
}
