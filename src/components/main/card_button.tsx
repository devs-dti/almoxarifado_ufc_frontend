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
    <button className="rounded border border-[#EAEAEA] px-4 py-2 text-sm font-medium transition-colors duration-100 ease-in-out">
      {Icon && <Icon className="mr-2" />}
      {title}
    </button>
  );
}
