"use client";

import React, { useState } from "react";
const items = [
  {
    label: "Materiais",
  },
  {
    label: "Relatórios",
  },
  {
    label: "Setores",
  },
  {
    label: "Unidades",
  },
  {
    label: "Usuários",
  },
];
export default function Slider() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      <div className="flex items-center overflow-y-hidden overflow-x-auto px-4 py-4">
        <ul className="flex items-center flex-row flex-nowrap gap-x-4 w-max">
          {items.map((item) => {
            const isActive = active === item.label;
            return (
              <li
                key={item.label}
                onClick={() => setActive(item.label)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-100 ease-in-out${
                  isActive
                    ? " text-white bg-[#4A0E98]"
                    : "text-[#938F8F] cursor-pointer"
                }`}
              >
                {item.label}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
