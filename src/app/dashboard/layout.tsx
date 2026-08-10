import type { Metadata } from "next";
import Link from "next/link";
import { DashboardHeader } from "@/features/auth/components/DashboardHeader";
import Menu from "@/components/main/menu";
import { BottomNav } from "@/components/main/bottom-nav";
import { Sidebar } from "@/components/main/sidebar";

export const metadata: Metadata = {
  title: "Dashboard — Almoxarifado UFC",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-dashboard-bg flex antialiased">
      {/* Sidebar — desktop only */}
      <Sidebar />

      {/* Main column */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        {/* Top header — mobile/tablet only */}
        <div className="relative z-10 flex items-center px-4 border-b border-gray-100 bg-white lg:hidden shrink-0 h-14">
          <div className="flex w-full items-center justify-between pr-1">
            <Menu className="shrink-0" />
            <DashboardHeader />
          </div>
        </div>



        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-5xl mx-auto w-full min-h-full pb-20 md:pb-6">
            {children}
          </div>
        </main>

        {/* Desktop Footer */}
        <div className="hidden lg:flex items-center justify-center gap-3 px-8 py-4 shrink-0">
          <span className="text-xs text-gray-400 font-medium">
            Desenvolvido pela <strong className="text-gray-500 font-bold">DTI-UFC</strong>
          </span>
          <span className="text-gray-300 text-[10px]">•</span>
          <Link href="/dashboard/faq" className="text-xs text-brand hover:underline font-semibold">
            Sobre
          </Link>
        </div>

        <div className="shrink-0">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
