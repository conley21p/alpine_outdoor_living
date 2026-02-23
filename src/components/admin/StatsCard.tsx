import type { ReactNode } from "react";

interface StatsCardProps {
  label: string;
  value: string | number;
  note?: ReactNode;
}

export function StatsCard({ label, value, note }: StatsCardProps) {
  return (
    <article className="rounded-xl border border-gray-100 bg-white p-6 shadow-card transition-all hover:shadow-card-hover">
      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</p>
      <p className="mt-3 text-3xl font-black text-brand-primary">{value}</p>
      {note ? <div className="mt-3 text-xs font-medium text-gray-600">{note}</div> : null}
    </article>
  );
}
