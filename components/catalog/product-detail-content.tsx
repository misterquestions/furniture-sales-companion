"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { CatalogProduct, Fabric, PriceBreakdown } from "@/types";
import { formatCurrency } from "@/lib/pricing";
import { CATALOG_IMAGE_PLACEHOLDER } from "@/lib/media";
import { pluralizeWord } from "@/lib/strings";
import { cn } from "@/lib/classnames";
import { FabricSwatch } from "./fabric-swatch";
import { PriceBlock } from "./price-block";

export type ProductDetailContentProps = {
  product: CatalogProduct;
  fabrics: Fabric[];
  priceBreakdown: PriceBreakdown;
  mode?: "modal" | "page";
  onClose?: () => void;
  backHref?: string;
};

export function ProductDetailContent({
  product,
  fabrics,
  priceBreakdown,
  mode = "modal",
  onClose,
  backHref = "/",
}: ProductDetailContentProps) {
  const fabricMap = useMemo(
    () => new Map(fabrics.map((fabric) => [fabric.id, fabric] as const)),
    [fabrics]
  );
  const defaultFabric = product.fabrics[0] ?? fabrics[0]?.id ?? null;
  const [selectedFabricId, setSelectedFabricId] = useState<string | null>(
    defaultFabric
  );

  useEffect(() => {
    setSelectedFabricId(defaultFabric);
  }, [defaultFabric]);

  const selectedFabric = selectedFabricId
    ? fabricMap.get(selectedFabricId) ?? null
    : null;
  const fabricOptions = product.fabrics
    .map((fabricId) => fabricMap.get(fabricId))
    .filter((fabric): fabric is Fabric => Boolean(fabric));

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
        <div className="flex flex-col">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
            Ficha del modelo
          </p>
          <p className="text-base font-semibold text-gray-900">
            {product.name}
          </p>
        </div>
        {mode === "modal" && onClose ? (
          <button
            onClick={onClose}
            className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            Cerrar
          </button>
        ) : (
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
              <path
                d="M8 11L4 6l4-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Volver
          </Link>
        )}
      </div>

      <div className="grid flex-1 grid-cols-1 sm:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-4 overflow-y-auto bg-gray-50/70 p-4">
          <div className="relative h-64 w-full overflow-hidden rounded-3xl">
            <Image
              src={product.imageUrl || CATALOG_IMAGE_PLACEHOLDER}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 50vw"
              className="object-cover"
              onError={(event) => {
                if (event.currentTarget.src !== CATALOG_IMAGE_PLACEHOLDER) {
                  event.currentTarget.src = CATALOG_IMAGE_PLACEHOLDER;
                }
              }}
            />
            {!product.imageUrl && (
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700 shadow">
                Foto en camino
              </span>
            )}
            <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-center justify-between rounded-2xl bg-white/90 px-3 py-2 text-[11px] shadow-lg backdrop-blur">
              <span className="font-semibold text-gray-900">
                {product.category} · {product.subtype}
              </span>
              <span className="text-gray-500">
                {product.fabrics.length}{" "}
                {pluralizeWord(
                  product.fabrics.length,
                  "opción de tela",
                  "opciones de tela"
                )}
              </span>
            </div>
            {selectedFabric && (
              <div className="absolute left-3 top-3 rounded-2xl bg-white/90 p-2 shadow-md">
                <div className="flex items-center gap-2">
                  <span
                    className="h-7 w-7 rounded-full border"
                    style={{ backgroundColor: selectedFabric.colorHex }}
                  />
                  <div className="text-xs">
                    <div className="font-semibold text-gray-900">
                      {selectedFabric.name}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Vista aproximada
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">
              Notas para la conversación
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-gray-600">
              <li>Arranca mostrando la foto general del modelo.</li>
              <li>
                Explora las telas usando el panel lateral y comenta tiempos.
              </li>
              <li>Usa los niveles de precio para explicar contado y descuentos.</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto p-4 sm:p-5">
          <div className="rounded-3xl border border-gray-100 p-4">
            <p className="text-sm font-semibold text-gray-900">Descripción</p>
            <p className="mt-2 text-sm text-gray-600">{product.description}</p>
          </div>

          {product.provider && (
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-4 text-xs text-emerald-900">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                Proveedor asignado
              </div>
              <p className="mt-1 text-sm font-semibold text-emerald-900">
                {product.provider.name}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-3 text-[11px]">
                {product.provider.leadTimeWeeks && (
                  <div>
                    <p className="uppercase tracking-wide text-emerald-700/70">
                      Lead time
                    </p>
                    <p className="text-base font-semibold">
                      {product.provider.leadTimeWeeks} semanas
                    </p>
                  </div>
                )}
                {product.provider.contactName && (
                  <div>
                    <p className="uppercase tracking-wide text-emerald-700/70">
                      Contacto
                    </p>
                    <p className="text-sm font-semibold">
                      {product.provider.contactName}
                    </p>
                  </div>
                )}
                {product.provider.email && (
                  <div>
                    <p className="uppercase tracking-wide text-emerald-700/70">
                      Email
                    </p>
                    <p className="font-mono text-[11px]">
                      {product.provider.email}
                    </p>
                  </div>
                )}
                {product.provider.phone && (
                  <div>
                    <p className="uppercase tracking-wide text-emerald-700/70">
                      Teléfono
                    </p>
                    <p className="font-semibold">{product.provider.phone}</p>
                  </div>
                )}
              </div>
              {product.provider.notes && (
                <p className="mt-2 text-[11px] text-emerald-800">
                  {product.provider.notes}
                </p>
              )}
              {(product.provider.email || product.provider.phone) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.provider.email && (
                    <a
                      href={`mailto:${product.provider.email}`}
                      className="inline-flex items-center justify-center rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm"
                    >
                      Enviar correo
                    </a>
                  )}
                  {product.provider.phone && (
                    <a
                      href={`tel:${product.provider.phone}`}
                      className="inline-flex items-center justify-center rounded-full border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700"
                    >
                      Llamar proveedor
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="rounded-3xl bg-emerald-50 p-4 text-xs shadow-inner">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
              Precios proyectados
            </div>
            <PriceBlock breakdown={priceBreakdown} />
            <p className="mt-2 text-[11px] text-emerald-700/80">
              Ajusta las reglas en configuración y se recalcularán automáticamente.
            </p>
          </div>

          {product.inventory && (
            <div className="rounded-3xl border border-gray-100 p-4 text-xs text-gray-600">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                Inventario
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center text-gray-900">
                <div className="rounded-2xl bg-gray-50 p-3">
                  <p className="text-2xl font-semibold">
                    {product.inventory.onHand}
                  </p>
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">
                    En piso
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-3">
                  <p className="text-2xl font-semibold">
                    {product.inventory.incoming ?? 0}
                  </p>
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">
                    En producción
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-3">
                  <p className="text-2xl font-semibold">
                    {product.inventory.leadTimeWeeks ?? 0}w
                  </p>
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">
                    Lead time
                  </p>
                </div>
              </div>
              {product.inventory.notes && (
                <p className="mt-2 text-[11px] text-gray-500">
                  {product.inventory.notes}
                </p>
              )}
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                Telas disponibles
              </h3>
              <span className="text-[11px] text-gray-500">
                Toca una tela para mostrarla al cliente
              </span>
            </div>
            <div className="flex max-h-56 flex-col gap-2 overflow-y-auto pr-1">
              {fabricOptions.map((fabric: Fabric) => (
                <FabricSwatch
                  key={fabric.id}
                  fabric={fabric}
                  selected={selectedFabricId === fabric.id}
                  onSelect={setSelectedFabricId}
                />
              ))}
            </div>
          </div>

          <div className="mt-auto rounded-3xl border border-dashed border-gray-200 p-4 text-[11px] text-gray-500">
            Próximamente podrás editar precios, agregar variantes y subir fotos desde aquí.
          </div>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col gap-2 border-t border-gray-100 bg-white/95 px-5 py-3 text-sm sm:flex-row sm:items-center sm:justify-between",
          mode === "page" && "sticky bottom-0"
        )}
      >
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Precio objetivo
          </p>
          <p className="text-base font-semibold text-emerald-700">
            {formatCurrency(
              priceBreakdown.tiers.at(-1)?.amount ?? priceBreakdown.baseAmount
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {mode === "modal" && onClose ? (
            <button
              onClick={onClose}
              className="h-10 rounded-full border border-gray-200 px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cerrar
            </button>
          ) : (
            <Link
              href={backHref}
              className="h-10 rounded-full border border-gray-200 px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Regresar
            </Link>
          )}
          <button className="h-10 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
            Agregar a cotización
          </button>
        </div>
      </div>
    </div>
  );
}
