import { getCatalogPayload } from "@/lib/services/catalog-service";
import { pluralizeWord } from "@/lib/strings";
import type { Fabric } from "@/types";

export default async function FabricsPage() {
  const { fabrics, products } = await getCatalogPayload();

  const usage = fabrics.reduce<Record<string, number>>((acc, fabric) => {
    acc[fabric.id] = products.filter((product) => product.fabrics.includes(fabric.id)).length;
    return acc;
  }, {});

  const mostUsed = [...fabrics]
    .sort((a, b) => (usage[b.id] ?? 0) - (usage[a.id] ?? 0))[0];
  const coverage = products.length
    ? Math.round(
        (products.filter((product) => product.fabrics.length > 0).length / products.length) * 100
      )
    : 0;

  return (
    <div className="space-y-6">
      <section className="grid gap-3 sm:grid-cols-3">
        <SummaryCard label="Telas activas" value={fabrics.length} hint="Disponibles para modelos" />
        <SummaryCard
          label="Más usada"
          value={mostUsed ? mostUsed.name : "—"}
          hint={
            mostUsed
              ? `${usage[mostUsed.id] ?? 0} ${pluralizeWord(usage[mostUsed.id] ?? 0, "modelo")}`
              : "Carga telas"
          }
        />
        <SummaryCard
          label="Cobertura"
          value={`${coverage}%`}
          hint="Modelos con al menos una tela"
        />
      </section>

      {fabrics.length === 0 ? (
        <EmptyFabricsState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fabrics.map((fabric) => (
            <FabricCard key={fabric.id} fabric={fabric} assigned={usage[fabric.id] ?? 0} />
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

function FabricCard({ fabric, assigned }: { fabric: Fabric; assigned: number }) {
  return (
    <article className="flex flex-col gap-3 rounded-3xl border border-gray-100 bg-white/80 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className="h-12 w-12 rounded-2xl border"
          style={{ backgroundColor: fabric.colorHex }}
        />
        <div>
          <p className="text-sm font-semibold text-gray-900">{fabric.name}</p>
          {fabric.description && <p className="text-xs text-gray-500">{fabric.description}</p>}
        </div>
      </div>
      <div className="flex items-center justify-between text-[11px] text-gray-600">
        <span>
          {assigned} {pluralizeWord(assigned, "modelo")} usan esta tela
        </span>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
          {assigned ? "Activa" : "Pendiente"}
        </span>
      </div>
    </article>
  );
}

function EmptyFabricsState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-emerald-200 bg-white/70 p-8 text-center text-sm text-gray-500">
      <p className="text-base font-semibold text-gray-700">No has cargado telas</p>
      <p className="mt-1 text-xs">
        Agrega telas en la base de datos o extiende el seed de Prisma para visualizar los swatches aquí.
      </p>
    </div>
  );
}
