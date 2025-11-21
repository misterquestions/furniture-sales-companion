import { ManageConsole } from "@/components/management/manage-console";

export default function GestionPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/60 bg-white/80 p-5 shadow-[0_12px_35px_rgba(15,118,110,0.12)]">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Centro de gestión
        </p>
        <h1 className="text-2xl font-semibold text-gray-900">Administra tu catálogo</h1>
        <p className="mt-1 text-sm text-gray-600">
          Captura cambios antes de pasarlos al equipo técnico o a Prisma. Usa los formularios rápidos y exporta los
          borradores al finalizar tu jornada.
        </p>
      </section>

      <ManageConsole />
    </div>
  );
}
