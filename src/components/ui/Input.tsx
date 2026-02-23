import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[15px] text-brand-textDark outline-none transition-all focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 hover:border-black/20",
        className,
      )}
      {...props}
    />
  );
}
