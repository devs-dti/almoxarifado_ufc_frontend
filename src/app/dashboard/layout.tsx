"use client";
import type { Metadata } from "next";
import Menu from "@/components/main/menu";
import Slider from "@/components/main/slider";
import CardButton from "@/components/main/card_button";
import { FaUser, FaArrowUp, FaArrowDown } from "react-icons/fa";
const UserIcon = FaUser;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col antialiased">
      <div className="overflow-x-hidden max-w-full flex items-center gap-4 px-4 border-b border-gray overflow-x-hidden">
        <div className="flex w-full items-center justify-between py-4">
          <div className="flex overflow-hidden cursor pointer rounded-full bg-[#8A38F5] w-12 h-12">
            <UserIcon className="text-white w-6 h-6 m-auto" />
          </div>
          <div className="overflow-x-hidden flex flex-col justify-center mx-md py-8">
            <h1 className="text-xl">
              Olá, <span className="font-semibold">Daniele!</span>
            </h1>
            <span className="overflow-x-hidden text-sm font-semibold text-[#8A38F5] ">
              Por onde quer começar hoje?
            </span>
          </div>
          <Menu className="" />
        </div>
      </div>

      {/* 2. NavBar from Slider */}
      <div className="bg-white border-b border-gray-100">
        <Slider />
      </div>
      <div className="flex w-full justify-center gap-4 p-4">
        <CardButton icon={FaArrowDown} title="Entradas" />
        <CardButton icon={FaArrowUp} title="Saídas" />
      </div>
      {/* 3. Where the content of the pages (Materials, Reports) will appear */}
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
