"use client";

import { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";

import { Card } from "@/components/ui/card";
import { InputField } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { Slider } from "@/components/ui/slider";
import { CatalogFilters, Provider } from "@/types";

import { MAX_PRICE_DEFAULT } from "@/constants/catalog";

type FiltersBarProps = {
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
  categories: string[];
  subtypes: string[];
  providers?: Provider[];
  showSearch?: boolean;
  priceRange?: { min: number; max: number };
};

export function FiltersBar({
  filters,
  onChange,
  categories,
  subtypes,
  providers,
  showSearch = true,
  priceRange,
}: FiltersBarProps) {
  const update = (partial: Partial<CatalogFilters>) =>
    onChange({ ...filters, ...partial });

  const maxPriceLimit = priceRange?.max ?? MAX_PRICE_DEFAULT;
  const minPriceLimit = priceRange?.min ?? 0;

  const [range, setRange] = useState([minPriceLimit, maxPriceLimit]);

  useEffect(() => {
    setRange([
      filters.minPrice ?? minPriceLimit,
      filters.maxPrice ?? maxPriceLimit,
    ]);
  }, [filters.minPrice, filters.maxPrice, minPriceLimit, maxPriceLimit]);

  return (
    <Card className="flex flex-col gap-4" padding="md">
      {showSearch && (
        <InputField
          label="Buscar modelo"
          placeholder="Ej. sala L, nórdica, sillón..."
          value={filters.query ?? ""}
          onChange={(event) => update({ query: event.target.value })}
          type="search"
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Categoría"
          value={filters.category}
          onChange={(category) => update({ category })}
          options={categories.map((category) => ({
            label: category,
            value: category,
          }))}
          nullableOptionLabel="Todas"
        />
        <SelectField
          label="Tipo"
          value={filters.subtype}
          onChange={(subtype) => update({ subtype })}
          options={subtypes.map((subtype) => ({
            label: subtype,
            value: subtype,
          }))}
          nullableOptionLabel="Todos"
        />
      </div>

      {providers?.length ? (
        <SelectField
          label="Proveedor"
          value={filters.providerId}
          onChange={(providerId) => update({ providerId })}
          options={providers.map((provider) => ({
            label: provider.name,
            value: provider.id,
          }))}
        />
      ) : null}

      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">Rango de precio</span>
          <span className="font-mono text-emerald-700">
            ${range[0].toLocaleString()} - ${range[1].toLocaleString()}
          </span>
        </div>
        <Slider
          min={minPriceLimit}
          max={maxPriceLimit}
          step={500}
          value={range}
          onValueChange={setRange}
          onValueCommit={([min, max]) => {
            update({
              minPrice: min > minPriceLimit ? min : undefined,
              maxPrice: max < maxPriceLimit ? max : undefined,
            });
          }}
        />
      </div>

      <Card padding="sm" className="flex items-center justify-between gap-4 bg-gray-50">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
            Mostrar sólo exhibición
          </p>
          <p className="text-[11px] text-gray-500">
            Reduce resultados a piezas que tienes en piso.
          </p>
        </div>
        <Switch
          checked={Boolean(filters.onlyExhibition)}
          onChange={(value) => update({ onlyExhibition: value || undefined })}
          className={`${
            filters.onlyExhibition ? "bg-emerald-600" : "bg-gray-300"
          } relative inline-flex h-6 w-11 items-center rounded-full transition`}
        >
          <span
            className={`${
              filters.onlyExhibition ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
      </Card>
    </Card>
  );
}
