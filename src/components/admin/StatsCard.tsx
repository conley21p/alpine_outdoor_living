import type { ReactNode } from "react";

interface StatsCardProps {
  label: string;
  value: string | number;
  note?: ReactNode;
}

export function StatsCard({ label, value, note }: StatsCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-brand-textDark">{value}</p>
      {note ? <div className="mt-2 text-xs text-slate-600">{note}</div> : null}
    </article>
  );
}
