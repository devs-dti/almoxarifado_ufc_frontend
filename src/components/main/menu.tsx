"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // 1. Importando o hook de roteamento
import { useToggle } from "usehooks-ts";
import { cn } from "@/lib/utils";
import { FaBars } from "react-icons/fa";

type CardButtonProps = {
  className?: string;
};

export default function Menu({ className }: CardButtonProps) {
  const [open, toggleOpen] = useToggle(false);
  const [active, setActive] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // 2. useRouter
  const router = useRouter();

  // 3. Add routes to the menu
  const links = [
    { label: "Login", href: "/login" }, //
    { label: "Suporte", href: "#" },
    { label: "FAC", href: "#" },
    { label: "Serviços", href: "#" },
  ];

  const handleNavigation = (label: string, href: string) => {
    setActive(label);

    // Se a rota existir e não for apenas um "#", ele navega
    if (href !== "#") {
      router.push(href);
    }

    // Fecha o menu lateral após o clique para não ficar travando a tela
    if (open) toggleOpen();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (open) toggleOpen();
      }
    }

    if (open) {
      setTimeout(
        () => document.addEventListener("mousedown", handleClickOutside),
        0,
      );
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, toggleOpen]);

  return (
    <div className={cn("flex flex-row align-right inline-block", className)}>
      <button
        onClick={() => toggleOpen()}
        className={`flex h-10 w-10 items-center justify-center rounded transition-colors duration-100 ease-in-out ${
          open ? "bg-[#F3E8FF]" : ""
        }`}
      >
        <FaBars className="text-black" />
      </button>

      {/* OVERLAY / BACKDROP */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 transition-opacity" />
      )}

      {/* Drawer */}
      <div
        ref={menuRef}
        className={`fixed inset-y-0 right-0 z-50 w-40 flex flex-col bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Menu */}
        <div className="flex flex-col px-6 pt-6 pb-2">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => toggleOpen()}
              className="p-1 -ml-1 hover:bg-gray-100 rounded"
            >
              <FaBars className="text-[#1e1b4b] text-xl" />
            </button>
            <h2 className="text-lg font-bold text-[#1e1b4b]">Menu</h2>
          </div>
          <hr className="border-gray-300" />
        </div>

        {/*Links */}
        <ul className="flex-1 space-y-1 px-4 py-2 text-sm text-[#1e1b4b] font-medium">
          {links.map((link) => {
            return (
              <li
                key={link.label}
                className={`rounded px-4 py-3 cursor-pointer transition-colors ${
                  active === link.label
                    ? "bg-[#8A38F5] text-white"
                    : "hover:bg-[#8A38F5]/10 hover:text-[#8A38F5]"
                }`}
                onClick={() => handleNavigation(link.label, link.href)}
              >
                {link.label}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
