import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-primary text-white hover:bg-brand-accent hover:shadow-md focus-visible:outline-brand-primary transform active:scale-95",
  secondary:
    "bg-brand-secondary text-white hover:bg-brand-primary hover:shadow-md focus-visible:outline-brand-secondary transform active:scale-95",
  ghost:
    "bg-white text-brand-textDark border border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus-visible:outline-gray-400 transform active:scale-95",
  danger:
    "bg-red-600 text-white hover:bg-red-700 hover:shadow-md focus-visible:outline-red-600 transform active:scale-95",
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
