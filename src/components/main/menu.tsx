"use client";

import React, { useState } from "react";
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
  const MenuIconComponent = FaBars;

  return (
    <>
      <button
        onClick={() => toggleOpen()}
        className={`flex h-10 w-10 items-center justify-center rounded  transition-colors duration-100 ease-in-out${
          open ? " bg-[#F3E8FF]" : ""
        }`}
      >
        <MenuIconComponent className="text-black" />
      </button>
      {open && (
        <div className="absolute h-[100%] flex flex-col align-right justify-center gap-5 right-0 mt-2 w-40 rounded-md border bg-white p-3 shadow-lg">
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="cursor-pointer hover:text-[#8A38F5]">
              Perfil
            </li>
            <li className="cursor-pointer hover:text-[#8A38F5]">
              Configurações
            </li>
            <li className="cursor-pointer hover:text-[#8A38F5]">
              Sair
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
