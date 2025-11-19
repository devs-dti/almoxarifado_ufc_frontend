"use client";
import React from "react";

type ButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "ghost";
  };

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      className = "",
      variant = "default",
      children,
      ...props
    },
    ref
  ) => {
    const base =
      "w-full inline-flex items-center justify-center rounded-full shadow-sm shadow-gray-300 px-4 py-2 text-sm font-medium";
    const variantClass =
      variant === "ghost"
        ? "bg-transparent hover:bg-slate-100"
        : "bg-[#8A38F5] text-white hover:bg-indigo-700";
    const stateClass = props.disabled
      ? "pointer-events-none opacity-50 cursor-not-allowed"
      : "cursor-pointer relative z-50";

    const combined = [
      base,
      variantClass,
      className,
      stateClass,
    ]
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
