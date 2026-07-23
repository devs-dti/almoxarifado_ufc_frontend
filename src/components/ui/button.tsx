"use client";
import React from "react";

type ButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "ghost" | "outline" | "destructive";
    size?: "sm" | "md" | "lg";
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 select-none active:scale-[0.97]";

    const sizeClass =
      size === "sm"
        ? "h-8 px-3 text-xs rounded-lg gap-1.5"
        : size === "lg"
        ? "h-11 px-6 text-sm rounded-xl gap-2"
        : "h-9 px-4 text-sm rounded-lg gap-2";

    const variantClass =
      variant === "ghost"
        ? "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        : variant === "outline"
        ? "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
        : variant === "destructive"
        ? "bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-200"
        : "bg-brand text-white hover:bg-brand-hover hover:shadow-md hover:shadow-violet-300/50 shadow-sm shadow-violet-200";

    const stateClass = props.disabled
      ? "pointer-events-none opacity-50 cursor-not-allowed"
      : "cursor-pointer";

    const combined = [base, sizeClass, variantClass, className, stateClass]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} className={combined} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export default Button;
