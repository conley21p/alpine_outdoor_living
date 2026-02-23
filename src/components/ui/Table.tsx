import type { ReactNode } from "react";

interface TableProps {
  headers: string[];
  rows: ReactNode[][];
  emptyMessage?: string;
}

export function Table({
  headers,
  rows,
  emptyMessage = "No records found.",
}: TableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-600 shadow-card">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {rows.map((cells, rowIndex) => (
              <tr key={`row-${rowIndex}`} className="transition-colors hover:bg-gray-50">
                {cells.map((cell, cellIndex) => (
                  <td key={`cell-${rowIndex}-${cellIndex}`} className="px-5 py-4">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
