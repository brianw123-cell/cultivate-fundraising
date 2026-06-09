import { getDonorsPageData } from "@/lib/data";
import { toCsv } from "@/lib/csv";

export const dynamic = "force-dynamic";

export async function GET() {
  const donors = await getDonorsPageData();
  const csv = toCsv(
    ["Name", "Type", "Email", "Phone", "City", "State", "Lifetime Giving", "Gifts", "Last Gift", "Donor Since"],
    donors.map((d) => [
      d.name,
      d.type,
      d.email,
      d.phone,
      d.city,
      d.state,
      d.lifetime,
      d.giftCount,
      d.lastGift || "",
      d.donor_since || "",
    ])
  );
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="cultivate-donors.csv"',
    },
  });
}
