"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV_LINKS = [
  {
    href: "/products",
    label: "Catálogo",
    description: "Modelos, precios y existencias",
    icon: CatalogIcon,
  },
  {
    href: "/providers",
    label: "Proveedores",
    description: "Contactos, lead times y acuerdos",
    icon: ProvidersIcon,
  },
  {
    href: "/fabrics",
    label: "Telas",
    description: "Swatches y disponibilidad",
    icon: FabricsIcon,
  },
];

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const activeLink =
    NAV_LINKS.find((link) => isActive(pathname, link.href)) ?? NAV_LINKS[0];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-emerald-50/80 via-white to-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.15),_transparent_60%)]"
      />

      <header className="relative z-40 border-b border-transparent bg-transparent px-4 py-4 sm:px-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
              Mueblería Alexandra
            </p>
            <div className="hidden items-center gap-3 rounded-full border border-white/50 bg-white/70 px-4 py-2 text-xs text-gray-600 shadow-lg sm:flex">
              <div>
                <p className="font-semibold text-gray-900">Mostrador</p>
                <p className="text-[11px] uppercase tracking-wide text-emerald-500">
                  Sesión activa
                </p>
              </div>
              <span className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-inner" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {activeLink.label}
            </h1>
            <p className="text-sm text-gray-500">{activeLink.description}</p>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl gap-6 px-4 pb-28 pt-6 sm:px-6 lg:pb-12">
        <aside className="hidden w-60 flex-shrink-0 flex-col gap-3 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-3xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-emerald-200 bg-white shadow"
                    : "border-transparent bg-white/50 hover:border-emerald-100"
                }`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm ${
                    active
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <Icon />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {link.label}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {link.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </aside>

        <main className="min-h-[70vh] flex-1">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/40 bg-white/80 backdrop-blur-xl shadow-[0_-6px_24px_rgba(15,118,110,0.12)] lg:hidden">
        <div className="flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-1 flex-col items-center justify-center py-2 text-[12px] font-semibold transition ${
                  active ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                <span
                  className={`mb-1 rounded-full p-2 shadow-sm ${
                    active ? "bg-emerald-50" : "bg-gray-100"
                  }`}
                >
                  <Icon />
                </span>
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

function CatalogIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
    >
      <path
        d="M5 5h6v6H5zM13 5h6v6h-6zM5 13h6v6H5zM13 13h6v6h-6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProvidersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
    >
      <path
        d="M8 11a4 4 0 118 0 4 4 0 01-8 0zM4 20a6 6 0 0116 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FabricsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
    >
      <path
        d="M4 4h12l4 4v12H4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 4v8h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ManageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
    >
      <path
        d="M4 6h16M4 12h10M4 18h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
