"use client";
import React from "react"; // Remova o useState daqui

// 1. Define Contract
interface SliderProps {
  active: string | null;
  onSelect: (label: string) => void;
}

// 2. Use Contract in Component
export default function Slider({ active, onSelect }: SliderProps) {
  const items = [
    { label: "Materiais" },
    { label: "Relatórios" },
    { label: "Setores" },
    { label: "Unidades" },
    { label: "Usuários" },
  ];

  return (
    <div className="flex items-center overflow-y-hidden overflow-x-auto px-4 py-4">
      <ul className="flex items-center flex-row flex-nowrap gap-x-4 w-max">
        {items.map((item) => {
          const isActive = active === item.label;
          return (
            <li
              key={item.label}
              
              onClick={() => onSelect(item.label)} 
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-100 ease-in-out cursor-pointer ${
                isActive
                  ? "text-white bg-[#4A0E98]"
                  : "text-[#938F8F]"
              }`}
            >
              {item.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}