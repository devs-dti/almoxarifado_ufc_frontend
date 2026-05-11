"use client";

import React from "react";
import CardButton from "@/components/main/card_button";
import { OptionCard } from "@/components/ui/option-card";
import { CirclePlus, Grid2X2Plus } from "lucide-react";

export default function MateriaisPage() {
  return (
    <div className="animate-in fade-in duration-300">
      {/* 1. Specific Cards from the Materials Tab*/}
      <div className="flex flex-col gap-4 p-4">
        <OptionCard
          title="Cadastrar novos"
          icon={CirclePlus}
          iconColor="text-[#8A38F5]"
        />
        <OptionCard
          title="Grupos de Materiais"
          icon={Grid2X2Plus}
          iconColor="text-gray-900"
        />
      </div>
    </div>
  );
}
