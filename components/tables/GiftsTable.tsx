"use client";

import Link from "next/link";
import { SortableTable, type SortColumn } from "@/components/SortableTable";
import { Badge } from "@/components/ui";
import { money, dateLabel } from "@/lib/format";

type Row = {
  id: string;
  gift_date: string;
  donor_id: string;
  donorName: string;
  campaignName: string;
  payment_method: string;
  is_recurring?: boolean | null;
  receipt_number: string | null;
  amount: number;
};

export function GiftsTable({ rows }: { rows: Row[] }) {
  const columns: SortColumn<Row>[] = [
    {
      key: "date",
      header: "Date",
      value: (r) => r.gift_date,
      cell: (r) => <span className="text-ink/70">{dateLabel(r.gift_date, "MMM d, yyyy")}</span>,
    },
    {
      key: "donor",
      header: "Donor",
      value: (r) => r.donorName,
      cell: (r) => (
        <Link href={`/donors/${r.donor_id}`} className="font-medium text-forest-900 hover:underline">
          {r.donorName}
        </Link>
      ),
    },
    {
      key: "campaign",
      header: "Campaign",
      value: (r) => r.campaignName,
      cell: (r) => <span className="text-ink/65">{r.campaignName}</span>,
    },
    {
      key: "method",
      header: "Method",
      value: (r) => r.payment_method,
      cell: (r) => (
        <>
          <span className="capitalize text-ink/65">{r.payment_method}</span>
          {r.is_recurring && (
            <Badge color="gold" className="ml-1.5">
              Recurring
            </Badge>
          )}
        </>
      ),
    },
    {
      key: "receipt",
      header: "Receipt #",
      value: (r) => r.receipt_number || "",
      cell: (r) => (
        <Link href={`/receipt/${r.id}`} className="text-xs font-medium text-forest-700 hover:underline">
          {r.receipt_number}
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
  ];
  return <SortableTable columns={columns} rows={rows} rowKey={(r) => r.id} minWidth={700} />;
}
