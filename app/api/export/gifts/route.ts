import { getAllGiftsForExport } from "@/lib/data";
import { toCsv } from "@/lib/csv";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await getAllGiftsForExport();
  const csv = toCsv(
    ["Date", "Donor", "Email", "Campaign", "Amount", "Fee", "Net", "Method", "Recurring", "FMV", "Receipt"],
    rows.map((r) => [r.date, r.donor, r.email, r.campaign, r.amount, r.fee, r.net, r.method, r.recurring, r.fmv, r.receipt])
  );
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="cultivate-gifts.csv"',
    },
  });
}
