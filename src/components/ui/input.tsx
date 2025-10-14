"use client";
import React from "react";

type InputProps =
  React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<
  HTMLInputElement,
  InputProps
>(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
    />
  );
});

Input.displayName = "Input";

export { Input };
export default Input;
