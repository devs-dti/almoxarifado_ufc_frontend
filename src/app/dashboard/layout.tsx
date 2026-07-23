import type { Metadata } from "next";
import { DashboardHeader } from "@/features/auth/components/DashboardHeader";
import { MobileNav } from "@/components/main/mobile-nav";
import { ActionButtons } from "@/components/main/action-buttons";
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
    <div className="min-h-screen bg-dashboard-bg flex antialiased">
      {/* Sidebar — desktop only */}
      <Sidebar />

      {/* Main column */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top header — mobile/tablet only */}
        <div className="relative z-10 flex items-center px-4 border-b border-gray-100 bg-white lg:hidden">
          <div className="flex w-full items-center justify-between py-3">
            <DashboardHeader />
            <MobileNav />
          </div>
        </div>

        {/* Action buttons — mobile/tablet only */}
        <div className="lg:hidden">
          <ActionButtons />
        </div>

        {/* Desktop top bar */}
        <div className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
          <div>
            <h1 className="text-base font-semibold text-gray-900">Dashboard</h1>
            <p className="text-xs text-gray-400">Gestão de almoxarifado · UFC</p>
          </div>
          <DashboardHeader />
        </div>

        <main className="flex-1 overflow-x-hidden pb-16 md:pb-0 lg:pb-0">
          <div className="max-w-5xl mx-auto w-full">
            {children}
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
