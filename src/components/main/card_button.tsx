"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

type CardButtonProps = {
  title: string;
  icon: React.ElementType;
  className?: string;
};

export default function CardButton({
  title,
  icon: Icon,
  className,
}: CardButtonProps) {
  return (
    <button className="flex flex-col w-full items-center rounded-md border border-[#8A38F575] px-8 py-4 text-sm font-medium transition-colors duration-100 ease-in-out">
      {Icon && <Icon className="text-[#8A38F5] mb-2" />}
      {title}
    </button>
  );
}
