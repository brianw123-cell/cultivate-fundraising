"use client";

import React, { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

export type SortColumn<T> = {
  key: string;
  header: string;
  align?: "left" | "right";
  sortable?: boolean;
  /** value used for sorting (number → numeric, otherwise natural string compare) */
  value?: (row: T) => string | number | null | undefined;
  /** rendered cell content */
  cell: (row: T) => React.ReactNode;
};

type Dir = "asc" | "desc";

export function SortableTable<T>({
  columns,
  rows,
  rowKey,
  initialSort,
  minWidth = 680,
}: {
  columns: SortColumn<T>[];
  rows: T[];
  rowKey: (row: T, i: number) => string;
  initialSort?: { key: string; dir: Dir };
  minWidth?: number;
}) {
  const [sort, setSort] = useState<{ key: string; dir: Dir } | null>(initialSort ?? null);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.value) return rows;
    const get = col.value;
    const out = [...rows];
    out.sort((a, b) => {
      const av = get(a);
      const bv = get(b);
      let cmp: number;
      if (typeof av === "number" && typeof bv === "number") {
        cmp = av - bv;
      } else {
        cmp = String(av ?? "").localeCompare(String(bv ?? ""), undefined, {
          numeric: true,
          sensitivity: "base",
        });
      }
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return out;
  }, [rows, sort, columns]);

  function toggle(key: string) {
    setSort((s) => {
      if (!s || s.key !== key) return { key, dir: "asc" };
      if (s.dir === "asc") return { key, dir: "desc" };
      return null; // third click clears the sort
    });
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" style={{ minWidth }}>
        <thead>
          <tr className="border-b border-forest-900/8 text-left text-xs uppercase tracking-wide text-ink/45">
            {columns.map((c) => {
              const active = sort?.key === c.key;
              const right = c.align === "right";
              return (
                <th
                  key={c.key}
                  className={`px-5 py-3 font-medium ${right ? "text-right" : ""} ${
                    active ? "bg-forest-50/60 text-forest-800" : ""
                  }`}
                >
                  {c.sortable === false ? (
                    c.header
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggle(c.key)}
                      className={`group inline-flex items-center gap-1 transition-colors ${
                        right ? "flex-row-reverse" : ""
                      } ${active ? "text-forest-800" : "hover:text-ink/70"}`}
                    >
                      {c.header}
                      {active ? (
                        sort!.dir === "asc" ? (
                          <ArrowUp size={12} />
                        ) : (
                          <ArrowDown size={12} />
                        )
                      ) : (
                        <ChevronsUpDown size={12} className="opacity-0 transition-opacity group-hover:opacity-40" />
                      )}
                    </button>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-forest-900/6">
          {sorted.map((row, i) => (
            <tr key={rowKey(row, i)} className="hover:bg-forest-50/50">
              {columns.map((c) => {
                const active = sort?.key === c.key;
                return (
                  <td
                    key={c.key}
                    className={`px-5 py-3 ${c.align === "right" ? "text-right" : ""} ${
                      active ? "bg-forest-50/30" : ""
                    }`}
                  >
                    {c.cell(row)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
