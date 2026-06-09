"use client";

import Link from "next/link";
import { SortableTable, type SortColumn } from "@/components/SortableTable";
import { Badge } from "@/components/ui";
import { money, dateLabel, titleCase } from "@/lib/format";

type Row = {
  id: string;
  donorId: string;
  donorName: string;
  amount: number;
  frequency: string;
  campaign: { name: string } | null;
  next_charge_date: string | null;
  card_brand: string | null;
  card_last4: string | null;
  status: string;
};

export function RecurringTable({ rows }: { rows: Row[] }) {
  const columns: SortColumn<Row>[] = [
    {
      key: "donor",
      header: "Donor",
      value: (r) => r.donorName,
      cell: (r) => (
        <Link href={`/donors/${r.donorId}`} className="font-medium text-forest-900 hover:underline">
          {r.donorName}
        </Link>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      value: (r) => r.amount,
      cell: (r) => <span className="font-semibold text-forest-900">{money(r.amount)}</span>,
    },
    {
      key: "frequency",
      header: "Frequency",
      value: (r) => r.frequency,
      cell: (r) => <span className="text-ink/65">{titleCase(r.frequency)}</span>,
    },
    {
      key: "campaign",
      header: "Campaign",
      value: (r) => r.campaign?.name || "",
      cell: (r) => <span className="text-ink/65">{r.campaign?.name || "—"}</span>,
    },
    {
      key: "next",
      header: "Next charge",
      value: (r) => r.next_charge_date || "",
      cell: (r) => <span className="text-ink/65">{dateLabel(r.next_charge_date, "MMM d, yyyy")}</span>,
    },
    {
      key: "card",
      header: "Card",
      sortable: false,
      cell: (r) => (
        <span className="text-ink/55">
          {r.card_brand} ···· {r.card_last4}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      value: (r) => r.status,
      cell: (r) => (
        <Badge color={r.status === "active" ? "green" : "gray"}>{titleCase(r.status)}</Badge>
      ),
    },
  ];
  return <SortableTable columns={columns} rows={rows} rowKey={(r) => r.id} minWidth={820} />;
}
