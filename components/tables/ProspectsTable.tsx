"use client";

import Link from "next/link";
import { SortableTable, type SortColumn } from "@/components/SortableTable";
import { Badge, avatarColor } from "@/components/ui";
import { money, compactMoney, initials, capacityTier, affinityLabel } from "@/lib/format";

type Row = {
  id: string;
  name: string;
  capacityHigh: number;
  affinity: number;
  lifetime: number;
  gap: number;
  underutilized: boolean;
  indicators: string[];
};

function AffinityPill({ score }: { score: number }) {
  const color = score >= 70 ? "green" : score >= 40 ? "gold" : "gray";
  return (
    <Badge color={color as "green" | "gold" | "gray"}>
      {score} · {affinityLabel(score)}
    </Badge>
  );
}

export function ProspectsTable({ rows }: { rows: Row[] }) {
  const columns: SortColumn<Row>[] = [
    {
      key: "donor",
      header: "Donor",
      value: (r) => r.name,
      cell: (r) => (
        <Link href={`/donors/${r.id}`} className="flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: avatarColor(r.name) }}
          >
            {initials(r.name)}
          </span>
          <span className="font-medium text-forest-900 hover:underline">{r.name}</span>
        </Link>
      ),
    },
    {
      key: "capacity",
      header: "Capacity",
      value: (r) => r.capacityHigh,
      cell: (r) => {
        const t = capacityTier(r.capacityHigh);
        return (
          <>
            <span className="font-mono font-bold text-gold-600">{t.tier}</span>
            <span className="ml-2 text-xs text-ink/50">{t.label}</span>
          </>
        );
      },
    },
    {
      key: "affinity",
      header: "Affinity",
      value: (r) => r.affinity,
      cell: (r) => <AffinityPill score={r.affinity} />,
    },
    {
      key: "given",
      header: "Given",
      align: "right",
      value: (r) => r.lifetime,
      cell: (r) => <span className="text-ink/70">{money(r.lifetime)}</span>,
    },
    {
      key: "untapped",
      header: "Untapped",
      align: "right",
      value: (r) => (r.underutilized ? r.gap : 0),
      cell: (r) => (
        <span className="font-semibold text-forest-900">
          {r.underutilized ? compactMoney(r.gap) : "—"}
        </span>
      ),
    },
    {
      key: "indicators",
      header: "Indicators",
      sortable: false,
      cell: (r) => (
        <div className="flex flex-wrap gap-1">
          {r.indicators.slice(0, 2).map((ind) => (
            <span key={ind} className="rounded-full bg-forest-50 px-2 py-0.5 text-[11px] text-forest-700">
              {ind}
            </span>
          ))}
          {r.indicators.length > 2 && (
            <span className="text-[11px] text-ink/40">+{r.indicators.length - 2}</span>
          )}
        </div>
      ),
    },
  ];
  return (
    <SortableTable
      columns={columns}
      rows={rows}
      rowKey={(r) => r.id}
      minWidth={760}
      initialSort={{ key: "capacity", dir: "desc" }}
    />
  );
}
