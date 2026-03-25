"use client";
import React, { useState } from "react";
import Image from "next/image";
import Slider from "@/components/main/slider";
import Menu from "@/components/main/menu";

// Example icon import (replace with your actual icon)
import { FaUser } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import CardButton from "@/components/main/card_button";
import { OptionCard } from "@/components/ui/option-card"; // Using  option-card from the UI components
import { CirclePlus, Grid2X2Plus, FileBarChart, TriangleAlert, CalendarDays, } from "lucide-react"; // Icons from RF-03
const UserIcon = FaUser;

export default function Home() {

  const [activeTab, setActiveTab] = useState("Materiais");

  return (
    <>
      {/* Header kept the same*/}
      <div className="overflow-x-hidden max-w-full flex items-center gap-4 px-4 border-b border-gray overflow-x-hidden">
        <div className="flex w-full items-center justify-between py-4">
          <div className="flex overflow-hidden cursor pointer rounded-full bg-[#8A38F5] w-12 h-12">
            <UserIcon className="text-white w-6 h-6 m-auto" />
          </div>
          <div className="overflow-x-hidden flex flex-col justify-center mx-md py-8">
            <h1 className="text-xl">
              Olá,{" "}
              <span className="font-semibold">
                Daniele!
              </span>
            </h1>
            <span className="overflow-x-hidden text-sm font-semibold text-[#8A38F5] ">
              Por onde quer começar hoje?
            </span>
          </div>
          <Menu className="" />
        </div>
      </div>

      <div className="max-w-full border-b border-gray overflow-h-hidden overflow-x-hidden">
        <Slider active={activeTab} onSelect={setActiveTab} />
      </div>

      {/* Standard buttons */}
      <div className="flex w-full justify-center gap-4 p-4">
        <CardButton icon={FaArrowDown} title="Entradas" />
        <CardButton icon={FaArrowUp} title="Saídas" />
      </div>

      {/* 4. RF03: Conditional rendering of the View*/}
      {activeTab === "Materiais" && (
        <div className="flex flex-col gap-4 p-4 animate-in fade-in duration-300">
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
      )}

      {activeTab === "Relatórios" && (
        <div className="flex flex-col gap-4 p-4 animate-in fade-in duration-300">
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
      )}
    </>
  );
}