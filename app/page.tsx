import Link from "next/link";

const heroStats = [
  { label: "Modelos activos", value: "68" },
  { label: "Proveedores", value: "12" },
  { label: "Últimas demos", value: "27" },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-[32px] border border-white/80 bg-white/90 p-8 shadow-[0_25px_60px_rgba(16,185,129,0.18)]">
        <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Catálogo para vendedores
          <span className="h-1 w-1 rounded-full bg-emerald-500" />
        </p>
        <h1 className="text-3xl font-bold text-gray-900 sm:text-5xl">
          Comparte precios, descuentos y disponibilidad en segundos.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-gray-600 sm:text-lg">
          Pensado para equipos comerciales de mueblerías que necesitan
          responder en vivo. No más hojas de cálculo interminables: solo
          productos listos para filtrar, enviar y cerrar.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(16,185,129,0.35)] transition hover:bg-emerald-700"
          >
            Ir al catálogo
          </Link>
          <Link
            href="/gestion"
            className="inline-flex items-center justify-center rounded-2xl border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 hover:border-emerald-300"
          >
            Gestionar datos
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {heroStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-emerald-100 bg-white/90 px-6 py-5 text-center shadow-[0_12px_40px_rgba(16,185,129,0.12)]"
          >
            <p className="text-4xl font-bold text-emerald-700">{stat.value}</p>
            <p className="mt-1 text-sm font-semibold text-gray-500">
              {stat.label}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-[28px] border border-white/70 bg-white/90 p-8 shadow-[0_20px_50px_rgba(15,118,110,0.14)]">
        <h2 className="text-2xl font-semibold text-gray-900">
          Puntos clave
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-gray-600">
          <li>
            • Filtra por proveedor, categoría, telas y rangos de precio.
          </li>
          <li>
            • Calcula descuentos compuestos automáticamente.
          </li>
          <li>• Comparte una URL con filtros y paginación incluida.</li>
          <li>
            • Alterna entre vista modal o página dedicada para fichas.
          </li>
        </ul>
      </section>
    </div>
  );
}
