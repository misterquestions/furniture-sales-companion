import { getCatalogPayload } from "@/lib/services/catalog-service";
import type { Provider } from "@/types";
import { AddResourceButton } from "@/components/management/add-resource-button";

export default async function ProvidersPage() {
  const { providers, products } = await getCatalogPayload();

  const providerUsage = products.reduce<Record<string, number>>((acc, product) => {
    if (product.providerId) {
      acc[product.providerId] = (acc[product.providerId] ?? 0) + 1;
    }
    return acc;
  }, {});

  const unassignedProducts = products.filter((product) => !product.providerId).length;
  const leadTimes = providers
    .map((provider) => provider.leadTimeWeeks)
    .filter((value): value is number => typeof value === "number");
  const averageLead = leadTimes.length
    ? (leadTimes.reduce((sum, value) => sum + value, 0) / leadTimes.length).toFixed(1)
    : null;
  const fastestProvider = [...providers]
    .filter((provider) => typeof provider.leadTimeWeeks === "number")
    .sort(
      (a, b) => (a.leadTimeWeeks ?? Number.POSITIVE_INFINITY) - (b.leadTimeWeeks ?? Number.POSITIVE_INFINITY)
    )[0];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <AddResourceButton type="provider" label="+ Nuevo proveedor" />
      </div>
      <section className="grid gap-3 sm:grid-cols-3">
        <SummaryCard label="Total proveedores" value={providers.length} hint="Activos en tu catálogo" />
        <SummaryCard
          label="Lead promedio"
          value={averageLead ? `${averageLead} semanas` : "—"}
          hint={fastestProvider ? `Más rápido: ${fastestProvider.leadTimeWeeks}w (${fastestProvider.name})` : "Agrega tiempos"}
        />
        <SummaryCard
          label="Modelos sin proveedor"
          value={unassignedProducts}
          hint={unassignedProducts ? "Asigna para cotizar completo" : "Todos tienen proveedor"}
        />
      </section>

      {providers.length === 0 ? (
        <EmptyProvidersState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              assignedCount={providerUsage[provider.id] ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white/80 px-4 py-3 shadow-sm">
      <p className="text-sm font-semibold text-gray-900">{value}</p>
      <p className="text-[11px] uppercase tracking-wide text-gray-500">{label}</p>
      {hint && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}

function ProviderCard({
  provider,
  assignedCount,
}: {
  provider: Provider;
  assignedCount: number;
}) {
  return (
    <article className="flex flex-col gap-3 rounded-3xl border border-gray-100 bg-white/80 p-4 shadow-sm">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">{provider.name}</p>
          {provider.contactName && <p className="text-xs text-gray-500">{provider.contactName}</p>}
        </div>
        {typeof provider.leadTimeWeeks === "number" && (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {provider.leadTimeWeeks}w lead
          </span>
        )}
      </header>

      {provider.notes && <p className="text-sm text-gray-600">{provider.notes}</p>}

      <dl className="grid grid-cols-2 gap-3 text-[11px] text-gray-600">
        <div>
          <dt className="uppercase tracking-wide text-gray-400">Modelos</dt>
          <dd className="text-base font-semibold text-gray-900">{assignedCount}</dd>
        </div>
        {provider.rating && (
          <div>
            <dt className="uppercase tracking-wide text-gray-400">Rating</dt>
            <dd className="text-base font-semibold text-amber-600">{provider.rating.toFixed(1)}</dd>
          </div>
        )}
      </dl>

      <div className="flex flex-wrap gap-2 text-xs text-gray-600">
        {provider.email && (
          <a
            href={`mailto:${provider.email}`}
            className="inline-flex items-center gap-1 rounded-full border border-emerald-200 px-3 py-1 font-semibold text-emerald-700"
          >
            Email
          </a>
        )}
        {provider.phone && (
          <a
            href={`tel:${provider.phone}`}
            className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 font-semibold text-gray-700"
          >
            Llamar
          </a>
        )}
      </div>
    </article>
  );
}

function EmptyProvidersState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-emerald-200 bg-white/70 p-8 text-center text-sm text-gray-500">
      <p className="text-base font-semibold text-gray-700">No tienes proveedores registrados</p>
      <p className="mt-1 text-xs">
        Corre el seed o agrega proveedores desde la base de datos para comenzar a asignar modelos.
      </p>
    </div>
  );
}
