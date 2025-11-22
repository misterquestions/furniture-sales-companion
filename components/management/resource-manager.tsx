"use client";

import { useMemo, useState } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { ToggleField } from "@/components/ui/toggle-field";

const formConfigs = {
  product: {
    title: "Alta de modelo",
    description: "Captura referencias básicas antes de subirlas a Prisma.",
    fields: [
      {
        name: "name",
        label: "Nombre",
        placeholder: "Sala Aura modular",
        type: "text",
      },
      {
        name: "category",
        label: "Categoría",
        placeholder: "Sala",
        type: "combobox",
      },
      {
        name: "price",
        label: "Precio lista",
        placeholder: "34999",
        type: "text",
      },
      {
        name: "image",
        label: "Fotografía",
        placeholder: "Capturar o subir imagen",
        type: "image",
      },
      {
        name: "status",
        label: "Visible en catálogo",
        placeholder: "",
        type: "toggle",
      },
    ],
  },
  provider: {
    title: "Registrar proveedor",
    description: "Agrega contactos y tiempos para coordinar pedidos.",
    fields: [
      {
        name: "name",
        label: "Proveedor",
        placeholder: "Atelier Tapiceros",
        type: "text",
      },
      {
        name: "contact",
        label: "Contacto",
        placeholder: "Marco Ruiz",
        type: "text",
      },
      {
        name: "lead",
        label: "Lead time (semanas)",
        placeholder: "4",
        type: "text",
      },
    ],
  },
  fabric: {
    title: "Cargar tela",
    description: "Documenta swatches pendientes para el showroom.",
    fields: [
      { name: "name", label: "Tela", placeholder: "Lino arena", type: "text" },
      { name: "hex", label: "Color HEX", placeholder: "#E4D5C7", type: "text" },
      {
        name: "stock",
        label: "Rollos disponibles",
        placeholder: "5",
        type: "text",
      },
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

type ResourceManagerProps = {
  defaultType?: DraftType;
  fixedType?: boolean;
  existingCategories?: string[];
};

export function ResourceManager({
  defaultType = "product",
  fixedType = false,
  existingCategories = [],
}: ResourceManagerProps) {
  const [activeType, setActiveType] = useState<DraftType>(defaultType);
  const [activeView, setActiveView] = useState<"create" | "drafts">("create");
  const [drafts, setDrafts] = useState<DraftEntry[]>([]);
  const [formState, setFormState] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");

  const config = formConfigs[activeType];

  const handleChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const snapshot = config.fields.reduce<Record<string, string>>(
      (acc, field) => {
        acc[field.name] = formState[field.name]?.trim() ?? "";
        return acc;
      },
      {}
    );
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
    setQuery("");
    setActiveView("drafts");
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

  const visibleDraftTypes = fixedType
    ? [activeType]
    : (Object.keys(formConfigs) as DraftType[]);

  const filteredCategories =
    query === ""
      ? existingCategories
      : existingCategories.filter((category) => {
          return category.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div className="flex flex-col gap-6">
      {fixedType && (
        <div className="flex rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => setActiveView("create")}
            className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition ${
              activeView === "create"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Nuevo
          </button>
          <button
            onClick={() => setActiveView("drafts")}
            className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition ${
              activeView === "drafts"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Borradores ({drafts.length})
          </button>
        </div>
      )}

      {activeView === "create" ? (
        <section className="rounded-[32px] border border-white/60 bg-white/90 p-5 shadow-[0_12px_45px_rgba(15,118,110,0.12)]">
          {!fixedType && (
            <div className="flex flex-wrap gap-2 mb-4">
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
          )}

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div>
              <p className="text-base font-semibold text-gray-900">
                {config.title}
              </p>
              <p className="text-sm text-gray-500">{config.description}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {config.fields.map((field) => {
              if (field.type === "toggle") {
                return (
                  <div key={field.name} className="flex items-end">
                    <ToggleField
                      label={field.label}
                      helperText={
                        formState[field.name] === "Publicado"
                          ? "Visible para todos"
                          : "Solo en borradores"
                      }
                      checked={formState[field.name] === "Publicado"}
                      onChange={(checked) =>
                        handleChange(
                          field.name,
                          checked ? "Publicado" : "Borrador"
                        )
                      }
                      className="w-full"
                    />
                  </div>
                );
              }

              return (
                <label
                  key={field.name}
                  className="text-sm text-gray-600 relative"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    {field.label}
                  </span>
                  {field.type === "combobox" ? (
                    <Combobox
                      immediate
                      value={formState[field.name] ?? ""}
                      onChange={(val) => handleChange(field.name, val ?? "")}
                      onClose={() => setQuery("")}
                    >
                      <div className="relative mt-1">
                        <ComboboxInput
                          className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring"
                          placeholder={field.placeholder}
                          onChange={(event) => setQuery(event.target.value)}
                        />
                        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </ComboboxButton>
                      </div>
                      <ComboboxOptions className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {query.length > 0 && (
                          <ComboboxOption
                            value={query}
                            className={({ focus }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                focus
                                  ? "bg-emerald-600 text-white"
                                  : "text-gray-900"
                              }`
                            }
                          >
                            Crear &quot;{query}&quot;
                          </ComboboxOption>
                        )}
                        {filteredCategories.map((category) => (
                          <ComboboxOption
                            key={category}
                            value={category}
                            className={({ focus }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                focus
                                  ? "bg-emerald-600 text-white"
                                  : "text-gray-900"
                              }`
                            }
                          >
                            {({ selected, focus }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {category}
                                </span>
                                {selected ? (
                                  <span
                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                      focus ? "text-white" : "text-emerald-600"
                                    }`}
                                  >
                                    <svg
                                      className="h-5 w-5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </span>
                                ) : null}
                              </>
                            )}
                          </ComboboxOption>
                        ))}
                      </ComboboxOptions>
                    </Combobox>
                  ) : field.type === "image" ? (
                    <div className="mt-1 flex items-center gap-3">
                      {formState[field.name] && (
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-gray-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={formState[field.name]}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <label className="flex-1 cursor-pointer">
                        <div className="flex w-full items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500 transition hover:bg-gray-100">
                          <span className="truncate">
                            {formState[field.name]
                              ? "Cambiar imagen"
                              : field.placeholder}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                handleChange(
                                  field.name,
                                  reader.result as string
                                );
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  ) : (
                    <input
                      value={formState[field.name] ?? ""}
                      onChange={(event) =>
                        handleChange(field.name, event.target.value)
                      }
                      placeholder={field.placeholder}
                      className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring"
                    />
                  )}
                </label>
              );
            })}
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Guardar
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
      ) : (
        <section className="rounded-[32px] border border-dashed border-emerald-100 bg-white/70 p-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Borradores capturados
              </p>
              <p className="text-xs text-gray-500">
                Usa estos datos para actualizar Prisma manualmente.
              </p>
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
              Aún no capturas nada. Usa el formulario para generar el brief del
              equipo técnico.
            </p>
          ) : (
            <div
              className={`mt-4 grid gap-4 ${
                fixedType ? "grid-cols-1" : "sm:grid-cols-2"
              }`}
            >
              {visibleDraftTypes.map((type) => {
                const typeDrafts = groupedDrafts[type];
                if (fixedType && typeDrafts.length === 0) return null;

                return (
                  <div
                    key={type}
                    className="rounded-2xl border border-white/60 bg-white/80 p-4"
                  >
                    {!fixedType && (
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {formConfigs[type].title}
                      </p>
                    )}
                    {typeDrafts.length === 0 ? (
                      <p className="mt-2 text-sm text-gray-500">
                        Sin capturas.
                      </p>
                    ) : (
                      <ul className="mt-3 space-y-2 text-sm text-gray-700">
                        {typeDrafts.map((draft) => (
                          <li
                            key={draft.id}
                            className="rounded-xl border border-gray-100 bg-gray-50/60 p-3"
                          >
                            <p className="font-semibold text-gray-900">
                              {draft.payload.name || "Sin título"}
                            </p>
                            <p className="text-[11px] text-gray-500">
                              {new Date(draft.createdAt).toLocaleString()}
                            </p>
                            <div className="mt-2 text-[12px] text-gray-600">
                              {Object.entries(draft.payload).map(
                                ([key, value]) => (
                                  <div key={key}>
                                    <span className="uppercase tracking-wide text-[10px] text-gray-400">
                                      {key}
                                    </span>
                                    : {value || "—"}
                                  </div>
                                )
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
