// src/components/Slider.tsx
"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Slider() {
  const pathname = usePathname();

  const items = [
    { label: "Materiais", href: "/dashboard/materiais" },
    { label: "Relatórios", href: "/dashboard/relatorios" },
    { label: "Setores", href: "/dashboard/setores" },
    { label: "Unidades", href: "/dashboard/unidades" },
    { label: "Usuários", href: "/dashboard/usuarios" },
  ];

  return (
    <div className="flex items-center overflow-y-hidden overflow-x-auto px-4 py-4 scrollbar-hide">
      <ul className="flex items-center flex-row flex-nowrap gap-x-4 w-max">
        {items.map((item) => {
          // Checks if the current URL starts with the item's href
          const isActive = pathname.startsWith(item.href);

          return (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`block rounded-full px-4 py-2 text-sm font-medium transition-colors duration-100 ease-in-out cursor-pointer ${
                  isActive
                    ? "text-white bg-[#4A0E98]"
                    : "text-[#938F8F] hover:bg-gray-100"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
