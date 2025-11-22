"use client";

import { useState } from "react";
import { ResourceManager } from "./resource-manager";

type AddResourceButtonProps = {
  type: "product" | "provider" | "fabric";
  label: string;
  categories?: string[];
};

export function AddResourceButton({
  type,
  label,
  categories,
}: AddResourceButtonProps) {
  const [show, setShow] = useState(false);

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
      >
        {label}
      </button>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative flex flex-col w-full max-w-lg max-h-[90vh] rounded-[32px] bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-end p-4 pb-0">
              <button
                onClick={() => setShow(false)}
                className="rounded-full bg-gray-100 p-2 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
              >
                <span className="sr-only">Cerrar</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 pt-2 sm:p-8 sm:pt-2">
              <ResourceManager
                defaultType={type}
                fixedType
                existingCategories={categories}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
