"use client";

import React, { useState } from "react";
import {
  FaPrint,
  FaInfoCircle,
  FaUser,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

// CONTRACT SPECIFICATION: Define explicit sub-types based directly on Pablo's Swagger 200 OK schemas
export type EntryItem = {
  id: string;
  status: string;
  arrivalAt: string;
  entryType: "SUPPLIER" | string;
  responsible: string;
};

export type TransferItem = {
  id: string;
  status: string;
  createdAt: string;
  exitType: "SECTOR" | string;
  requester: string;
  sector: string;
};

// UNION TYPE: The polymorphic contract accepted by this component
export type Material = EntryItem | TransferItem;

interface MaterialItemProps {
  material: Material;
  onEditarClick: (material: Material) => void;
}

export function MaterialItem({ material, onEditarClick }: MaterialItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // TYPE NARROWING FIX: Using block scope to guarantee TypeScript understands the union discrimination
  let displayType: string;
  let displayUser: string;
  let displayDate: string;
  let userLabel: string;
  let sectorNode: React.ReactNode = null;
  const isEntry = "entryType" in material;

  if ("entryType" in material) {
    // Neste bloco, o TypeScript TEM A CERTEZA que material é um EntryItem
    displayType = material.entryType;
    displayUser = material.responsible;
    displayDate = material.arrivalAt;
    userLabel = "Responsável:";
  } else {
    // Neste bloco, o TypeScript TEM A CERTEZA que material é um TransferItem
    displayType = material.exitType;
    displayUser = material.requester;
    displayDate = material.createdAt;
    userLabel = "Solicitante:";

    // O Setor só existe nas transferências
    if (material.sector) {
      sectorNode = (
        <div className="flex items-center gap-3">
          <FaUser className="text-gray-400 text-base" />
          <span>Setor: {material.sector}</span>
        </div>
      );
    }
  }

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left flex items-center justify-between py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-xl focus:outline-none focus:ring-0"
      >
        <span className="text-sm font-semibold text-gray-800">
          {isEntry ? "Entrada" : "Transferência"} #
          {String(material.id).substring(0, 5)}
        </span>
        {isExpanded ? (
          <IoIosArrowUp className="text-[#8A38F5]" />
        ) : (
          <IoIosArrowDown className="text-[#8A38F5]" />
        )}
      </button>

      {/* EXPANDABLE BODY CONTENT */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 space-y-3 text-sm text-gray-600 animate-slide-down">
          <div className="flex items-center gap-3">
            <FaPrint className="text-gray-400 text-base" />
            <span>Tipo: {displayType}</span>
          </div>

          <div className="flex items-center gap-3">
            <FaInfoCircle className="text-gray-400 text-base" />
            <span>Status: {material.status}</span>
          </div>

          <div className="flex items-center gap-3">
            <FaUser className="text-gray-400 text-base" />
            <span>
              {userLabel} {displayUser}
            </span>
          </div>

          {/* Renderiza o setor apenas se existir (configurado no if/else acima) */}
          {sectorNode}

          <div className="flex items-center gap-3">
            <FaRegCalendarAlt className="text-gray-400 text-base" />
            <span>Data: {displayDate}</span>
          </div>

          <button
            type="button"
            onClick={() => onEditarClick(material)}
            className="text-[#8A38F5] font-medium text-sm mt-2 hover:underline focus:outline-none"
          >
            Editar
          </button>
        </div>
      )}
    </div>
  );
}
