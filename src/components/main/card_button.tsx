"use client";

import React from "react";

type CardButtonProps = {
  title: string;
  icon: React.ElementType;
  onClick?: () => void;
};

export default function CardButton({ title, icon: Icon, onClick }: CardButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col flex-1 items-center gap-1.5 rounded-xl border border-brand/20 bg-brand-subtle/50 px-6 py-3.5 text-sm font-semibold text-brand hover:bg-brand-subtle hover:border-brand/40 transition-all duration-150 cursor-pointer"
    >
      {Icon && <Icon size={18} className="text-brand" />}
      {title}
    </button>
  );
}
