"use client";

import { useMemo, useState } from "react";

const formConfigs = {
  product: {
    title: "Alta de modelo",
    description: "Captura referencias básicas antes de subirlas a Prisma.",
    fields: [
      { name: "name", label: "Nombre", placeholder: "Sala Aura modular" },
      { name: "category", label: "Categoría", placeholder: "Sala" },
      { name: "price", label: "Precio lista", placeholder: "34999" },
    ],
  },
  provider: {
    title: "Registrar proveedor",
    description: "Agrega contactos y tiempos para coordinar pedidos.",
    fields: [
      { name: "name", label: "Proveedor", placeholder: "Atelier Tapiceros" },
      { name: "contact", label: "Contacto", placeholder: "Marco Ruiz" },
      { name: "lead", label: "Lead time (semanas)", placeholder: "4" },
    ],
  },
  fabric: {
    title: "Cargar tela",
    description: "Documenta swatches pendientes para el showroom.",
    fields: [
      { name: "name", label: "Tela", placeholder: "Lino arena" },
      { name: "hex", label: "Color HEX", placeholder: "#E4D5C7" },
      { name: "stock", label: "Rollos disponibles", placeholder: "5" },
    ],
  },
} as const;

type DraftType = keyof typeof formConfigs;

type DraftEntry = {
  id: string;
  type: DraftType;
  payload: Record<string, string>;
  createdAt: number;
};

export function ManageConsole() {
  const [activeType, setActiveType] = useState<DraftType>("product");
  const [drafts, setDrafts] = useState<DraftEntry[]>([]);
  const [formState, setFormState] = useState<Record<string, string>>({});

  const config = formConfigs[activeType];

  const handleChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const snapshot = config.fields.reduce<Record<string, string>>((acc, field) => {
      acc[field.name] = formState[field.name]?.trim() ?? "";
      return acc;
    }, {});
    if (Object.values(snapshot).every((value) => !value)) return;

    setDrafts((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: activeType,
        payload: snapshot,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
    setFormState({});
  };

  const groupedDrafts = useMemo(() => {
    return drafts.reduce<Record<DraftType, DraftEntry[]>>(
      (acc, draft) => {
        acc[draft.type].push(draft);
        return acc;
      },
      { product: [], provider: [], fabric: [] }
    );
  }, [drafts]);

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-[32px] border border-white/60 bg-white/90 p-5 shadow-[0_12px_45px_rgba(15,118,110,0.12)]">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(formConfigs) as DraftType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setActiveType(type)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeType === type
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {formConfigs[type].title}
            </button>
          ))}
        </div>

        <form className="mt-4 grid gap-4" onSubmit={handleSubmit}>
          <div>
            <p className="text-base font-semibold text-gray-900">{config.title}</p>
            <p className="text-sm text-gray-500">{config.description}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {config.fields.map((field) => (
              <label key={field.name} className="text-sm text-gray-600">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {field.label}
                </span>
                <input
                  value={formState[field.name] ?? ""}
                  onChange={(event) => handleChange(field.name, event.target.value)}
                  placeholder={field.placeholder}
                  className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring"
                />
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Guardar borrador
            </button>
            <button
              type="button"
              onClick={() => setFormState({})}
              className="rounded-full border border-transparent px-5 py-2 text-sm font-semibold text-emerald-600"
            >
              Limpiar
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-[32px] border border-dashed border-emerald-100 bg-white/70 p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">Borradores capturados</p>
            <p className="text-xs text-gray-500">Usa estos datos para actualizar Prisma manualmente.</p>
          </div>
          <button
            type="button"
            onClick={() => setDrafts([])}
            className="text-[11px] font-semibold text-emerald-700"
          >
            Vaciar lista
          </button>
        </div>

        {drafts.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">
            Aún no capturas nada. Usa el formulario para generar el brief del equipo técnico.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {(Object.keys(groupedDrafts) as DraftType[]).map((type) => (
              <div key={type} className="rounded-2xl border border-white/60 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {formConfigs[type].title}
                </p>
                {groupedDrafts[type].length === 0 ? (
                  <p className="mt-2 text-sm text-gray-500">Sin capturas.</p>
                ) : (
                  <ul className="mt-3 space-y-2 text-sm text-gray-700">
                    {groupedDrafts[type].map((draft) => (
                      <li key={draft.id} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                        <p className="font-semibold text-gray-900">
                          {draft.payload.name || "Sin título"}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {new Date(draft.createdAt).toLocaleString()}
                        </p>
                        <div className="mt-2 text-[12px] text-gray-600">
                          {Object.entries(draft.payload).map(([key, value]) => (
                            <div key={key}>
                              <span className="uppercase tracking-wide text-[10px] text-gray-400">
                                {key}
                              </span>
                              : {value || "—"}
                            </div>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
