"use client";
// a reusable component for the material page
import React from "react";
import { LucideIcon } from "lucide-react"; 

type OptionCardProps = {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  onClick?: () => void;
};

export function OptionCard({ title, icon: Icon, iconColor, onClick }: OptionCardProps) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between w-full p-5 bg-white rounded-2xl shadow-sm border border-gray-100 active:scale-[0.98] transition-all cursor-pointer"
    >
      <span className="text-gray-700 font-semibold text-lg">
        {title}
      </span>

      <Icon 
        size={24} 
        className={iconColor || "text-gray-400"} 
      />
    </div>
  );
}