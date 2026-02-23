import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-brand-textDark shadow-sm outline-none transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 hover:border-gray-300",
        className,
      )}
      {...props}
    />
  );
}
