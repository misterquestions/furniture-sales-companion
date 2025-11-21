"use client";

import { Fragment } from "react";
import { Dialog, DialogPanel, Transition } from "@headlessui/react";

import { CatalogProduct, Fabric, PriceBreakdown } from "@/types";
import { ProductDetailContent } from "./product-detail-content";

type ProductDetailProps = {
  product: CatalogProduct | null;
  fabrics: Fabric[];
  priceBreakdown: PriceBreakdown | null;
  open: boolean;
  onClose: () => void;
};

export function ProductDetail({
  product,
  fabrics,
  priceBreakdown,
  open,
  onClose,
}: ProductDetailProps) {
  if (!product || !priceBreakdown) return null;

  return (
    <Transition show={open} as={Fragment} appear>
      <Dialog as="div" className="relative z-30" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 flex w-screen items-end justify-center overflow-y-auto px-3 py-4 sm:items-center sm:p-6">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="translate-y-6 opacity-0 sm:scale-95 sm:translate-y-0"
            enterTo="translate-y-0 opacity-100 sm:scale-100"
            leave="ease-in duration-150"
            leaveFrom="translate-y-0 opacity-100 sm:scale-100"
            leaveTo="translate-y-6 opacity-0 sm:scale-95 sm:translate-y-0"
          >
            <DialogPanel className="relative flex h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:h-auto sm:max-h-[88vh] sm:rounded-3xl">
              <ProductDetailContent
                product={product}
                fabrics={fabrics}
                priceBreakdown={priceBreakdown}
                mode="modal"
                onClose={onClose}
              />
            </DialogPanel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
