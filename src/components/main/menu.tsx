import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { useToggle } from "usehooks-ts";
import { cn } from "@/lib/utils";
import { $brand } from "zod/v4/core";
import { FaBars } from "react-icons/fa";

type CardButtonProps = {
  className?: string;
};

export default function Menu({
  className,
}: CardButtonProps) {
  const [open, toggleOpen] = useToggle(false);
  const [active, setActive] = useState<string | null>(null);
  const MenuIconComponent = FaBars;
  const menuRef = useRef<HTMLDivElement>(null);
  const links = [
    {
      label: "Perfil",
    },
    {
      label: "Configurações",
    },
    {
      label: "Sair",
    },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        toggleOpen();
      }
    }

    if (open) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    } else {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [open, toggleOpen]);

  return (
    <div
      ref={menuRef}
      className="flex flex-row align-right inline-block"
    >
      <button
        onClick={() => toggleOpen()}
        className={`flex h-10 w-10 items-center justify-center rounded  transition-colors duration-100 ease-in-out${
          open ? " bg-[#F3E8FF]" : ""
        }`}
      >
        <MenuIconComponent className="text-black" />
      </button>
      {open && (
        <div className="absolute z-50 h-sm flex flex-col align-right justify-top gap-5 right-0 mt-2 w-40 rounded-md border bg-white p-3 shadow-lg">
          <ul className="space-y-2 text-sm text-slate-700">
            {links.map((link) => {
              return (
                <li
                  key={link.label}
                  className={`rounded px-4 py-2 cursor-pointer transition-colors ${
                    active === link.label
                      ? "bg-[#8A38F5] text-white"
                      : "text-slate-700 hover:bg-[#8A38F5]/10 hover:text-[#8A38F5]"
                  }`}
                  onClick={() => setActive(link.label)}
                >
                  {link.label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
