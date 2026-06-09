"use client";

import Link from "next/link";
import { SortableTable, type SortColumn } from "@/components/SortableTable";
import { Badge, avatarColor } from "@/components/ui";
import { money, dateLabel, initials } from "@/lib/format";

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
};

export function DonorsTable({ rows }: { rows: Row[] }) {
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
  return <SortableTable columns={columns} rows={rows} rowKey={(r) => r.id} minWidth={680} />;
}
