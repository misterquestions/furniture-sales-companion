"use client";

import { Provider } from "@/types";
import { pluralizeWord } from "@/lib/strings";

type ProviderPanelProps = {
  providers: Provider[];
  providerUsage: Map<string, number>;
  selectedProviderId?: string;
  onSelectProvider: (providerId?: string) => void;
};

export function ProviderPanel({
  providers,
  providerUsage,
  selectedProviderId,
  onSelectProvider,
}: ProviderPanelProps) {
  if (!providers.length) return null;

  const rankedProviders = [...providers].sort((a, b) => {
    const aCount = providerUsage.get(a.id) ?? 0;
    const bCount = providerUsage.get(b.id) ?? 0;
    if (bCount === aCount)
      return (a.leadTimeWeeks ?? 999) - (b.leadTimeWeeks ?? 999);
    return bCount - aCount;
  });

  return (
    <div className="rounded-[28px] border border-white/60 bg-white/80 p-4 shadow-[0_12px_35px_rgba(15,118,110,0.08)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Red de proveedores
          </p>
          <p className="text-sm text-gray-600">
            Supervisa disponibilidad y filtra por contacto.
          </p>
        </div>
        {selectedProviderId && (
          <button
            onClick={() => onSelectProvider(undefined)}
            className="text-[11px] font-semibold text-emerald-700 transition hover:text-emerald-800"
          >
            Limpiar filtro
          </button>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {rankedProviders.map((provider) => {
          const assignedCount = providerUsage.get(provider.id) ?? 0;
          const isSelected = provider.id === selectedProviderId;
          return (
            <button
              key={provider.id}
              onClick={() =>
                onSelectProvider(isSelected ? undefined : provider.id)
              }
              className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50/90 shadow"
                  : "border-white/70 bg-white/70 hover:border-emerald-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {provider.name}
                  </p>
                  {provider.contactName && (
                    <p className="text-xs text-gray-500">
                      {provider.contactName}
                    </p>
                  )}
                </div>
                {typeof provider.leadTimeWeeks === "number" && (
                  <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-emerald-700 shadow">
                    {provider.leadTimeWeeks}w
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
                <span>
                  {assignedCount} {pluralizeWord(assignedCount, "modelo")}{" "}
                  {pluralizeWord(assignedCount, "asignado")}
                </span>
                {provider.email && (
                  <span className="font-mono text-[10px]">
                    {provider.email}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-[11px] text-gray-500">
        Tip: da click en un proveedor para filtrar el catálogo y arma pedidos
        coordinados.
      </p>
    </div>
  );
}
