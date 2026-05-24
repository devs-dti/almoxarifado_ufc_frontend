"use client";
import React from "react";
import { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

type OptionCardProps = {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  titleColor?: string;
  description?: string;
  onClick?: () => void;
};

export function OptionCard({ title, icon: Icon, iconColor, titleColor = "text-gray-800", description, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-4 w-full px-5 py-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 hover:bg-gray-50/50 active:scale-[0.99] transition-all duration-150 cursor-pointer text-left group"
    >
      <div className="w-10 h-10 rounded-lg bg-brand-subtle flex items-center justify-center shrink-0">
        <Icon size={20} className={iconColor || "text-brand"} />
      </div>

      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className={`font-semibold text-sm ${titleColor}`}>{title}</span>
        {description && <span className="text-xs text-gray-400">{description}</span>}
      </div>

      <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-400 shrink-0 transition-colors" />
    </button>
  );
}
