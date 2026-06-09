"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SortableTable, type SortColumn } from "@/components/SortableTable";
import { Badge, avatarColor } from "@/components/ui";
import { money, dateLabel, initials } from "@/lib/format";
import { SEGMENT_DEFS } from "@/lib/analytics";

type Row = {
  id: string;
  name: string;
  email: string | null;
  city: string | null;
  state: string | null;
  lifetime: number;
  giftCount: number;
  lastGift: string | null;
  tags: string[] | null;
  segKeys?: string[];
};

const sel =
  "rounded-lg border border-forest-900/12 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-forest-500";

export function DonorsTable({ rows }: { rows: Row[] }) {
  const [seg, setSeg] = useState("all");
  const [state, setState] = useState("all");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const states = useMemo(
    () => Array.from(new Set(rows.map((r) => r.state).filter(Boolean))).sort() as string[],
    [rows]
  );

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        if (seg !== "all" && !r.segKeys?.includes(seg)) return false;
        if (state !== "all" && r.state !== state) return false;
        if (min && r.lifetime < Number(min)) return false;
        if (max && r.lifetime > Number(max)) return false;
        return true;
      }),
    [rows, seg, state, min, max]
  );

  const columns: SortColumn<Row>[] = [
    {
      key: "donor",
      header: "Donor",
      value: (r) => r.name,
      cell: (r) => (
        <Link href={`/donors/${r.id}`} className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: avatarColor(r.name) }}
          >
            {initials(r.name)}
          </span>
          <span>
            <span className="block font-medium text-forest-900 hover:underline">{r.name}</span>
            <span className="block text-xs text-ink/45">{r.email}</span>
          </span>
        </Link>
      ),
    },
    {
      key: "location",
      header: "Location",
      value: (r) => `${r.state || ""} ${r.city || ""}`,
      cell: (r) => <span className="text-ink/65">{r.city ? `${r.city}, ${r.state}` : "—"}</span>,
    },
    {
      key: "lifetime",
      header: "Lifetime",
      align: "right",
      value: (r) => r.lifetime,
      cell: (r) => <span className="font-semibold text-forest-900">{money(r.lifetime)}</span>,
    },
    {
      key: "gifts",
      header: "Gifts",
      align: "right",
      value: (r) => r.giftCount,
      cell: (r) => <span className="text-ink/65">{r.giftCount}</span>,
    },
    {
      key: "last",
      header: "Last gift",
      value: (r) => r.lastGift || "",
      cell: (r) => (
        <span className="flex items-center gap-2">
          {dateLabel(r.lastGift, "MMM d, yyyy")}
          {r.tags?.includes("major") && <Badge color="gold">Major</Badge>}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 border-b border-forest-900/8 px-5 py-3">
        <select value={seg} onChange={(e) => setSeg(e.target.value)} className={sel}>
          <option value="all">All segments</option>
          {SEGMENT_DEFS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
        <select value={state} onChange={(e) => setState(e.target.value)} className={sel}>
          <option value="all">All states</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          inputMode="numeric"
          placeholder="Min $"
          value={min}
          onChange={(e) => setMin(e.target.value.replace(/[^0-9.]/g, ""))}
          className={sel + " w-24"}
        />
        <input
          inputMode="numeric"
          placeholder="Max $"
          value={max}
          onChange={(e) => setMax(e.target.value.replace(/[^0-9.]/g, ""))}
          className={sel + " w-24"}
        />
        <span className="ml-auto text-xs text-ink/50">{filtered.length} donors</span>
      </div>
      <SortableTable columns={columns} rows={filtered} rowKey={(r) => r.id} minWidth={680} />
    </div>
  );
}
