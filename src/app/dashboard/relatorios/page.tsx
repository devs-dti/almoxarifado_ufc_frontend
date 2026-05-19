"use client";
import React from "react";
import { OptionCard } from "@/components/ui/option-card";
import { FileBarChart, TriangleAlert, CalendarDays } from "lucide-react";

export default function RelatoriosPage() {
  return (
    <div className="flex flex-col gap-4 p-4 animate-in fade-in duration-300">
      {/* Specific Cards from the Reports Tab */}
      <OptionCard
        title="Relatório Geral de Materiais"
        icon={FileBarChart}
        iconColor="text-[#8A38F5]"
      />
      <OptionCard
        title="Materiais em Falta"
        icon={TriangleAlert}
        iconColor="text-[#8A38F5]"
      />
      <OptionCard
        title="Vencimento de Materiais"
        icon={CalendarDays}
        iconColor="text-[#8A38F5]"
        titleColor="text-[#8A38F5]"
      />
    </div>
  );
}
