"use client";
import React from "react";
import { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

type OptionCardProps = {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  description?: string;
  onClick?: () => void;
};

export function OptionCard({ title, icon: Icon, iconColor = "text-brand", iconBg = "bg-brand-subtle", description, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-4 w-full px-5 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-gray-200 active:scale-[0.97] active:translate-y-0 transition-all duration-200 cursor-pointer text-left group"
    >
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110`}>
        <Icon size={20} className={iconColor} />
      </div>

      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="font-semibold text-sm text-gray-800">{title}</span>
        {description && <span className="text-xs text-gray-400">{description}</span>}
      </div>

      <ChevronRight size={16} className="text-gray-300 group-hover:text-brand shrink-0 transition-colors duration-200" />
    </button>
  );
}
