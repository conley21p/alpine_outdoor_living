import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-brand-textDark shadow-sm outline-none transition focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20",
        className,
      )}
      {...props}
    />
  );
}
