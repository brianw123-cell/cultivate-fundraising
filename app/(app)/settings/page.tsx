import { getOrg, getTeam } from "@/lib/data";
import { Card, Badge, SectionHeading, avatarColor } from "@/components/ui";
import { initials, titleCase, dateLabel } from "@/lib/format";
import { Building2, Palette, Users } from "lucide-react";

export const dynamic = "force-dynamic";

const roleColor: Record<string, any> = { admin: "green", manager: "gold", viewer: "gray" };

export default async function SettingsPage() {
  const [org, team] = await Promise.all([getOrg(), getTeam()]);
  const field =
    "w-full rounded-xl border border-forest-900/12 bg-cream/40 px-3.5 py-2.5 text-sm text-ink/80";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-forest-900">Settings</h1>
        <p className="text-sm text-ink/55">Organization profile, team, and branding</p>
      </div>

      {/* org profile */}
      <Card className="p-6">
        <SectionHeading
          title="Organization"
          subtitle="Appears on receipts and donation pages"
          action={<Badge color="sage"><Building2 size={13} /> 501(c)(3)</Badge>}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Labeled label="Organization name">
            <input className={field} defaultValue={org?.name} readOnly />
          </Labeled>
          <Labeled label="EIN">
            <input className={field} defaultValue={org?.ein} readOnly />
          </Labeled>
          <Labeled label="Email">
            <input className={field} defaultValue={org?.email} readOnly />
          </Labeled>
          <Labeled label="Phone">
            <input className={field} defaultValue={org?.phone} readOnly />
          </Labeled>
          <Labeled label="Address" full>
            <input
              className={field}
              defaultValue={`${org?.address_line1}, ${org?.city}, ${org?.state} ${org?.zip}`}
              readOnly
            />
          </Labeled>
          <Labeled label="Mission" full>
            <textarea className={field} rows={2} defaultValue={org?.mission} readOnly />
          </Labeled>
        </div>
      </Card>

      {/* branding */}
      <Card className="p-6">
        <SectionHeading title="Branding" subtitle="Colors used across your donation pages" />
        <div className="flex items-center gap-3">
          <Palette size={18} className="text-ink/40" />
          {["#1B4332", "#2D6A4F", "#40916C", "#52B788", "#D4A017", "#B0830F"].map((c) => (
            <span
              key={c}
              className="h-9 w-9 rounded-lg ring-2 ring-white shadow-sm"
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
          <span className="ml-2 text-sm text-ink/55">Forest & Gold theme</span>
        </div>
      </Card>

      {/* team */}
      <Card className="p-6">
        <SectionHeading
          title="Team & roles"
          subtitle={`${team.length} members`}
          action={<Badge color="gray"><Users size={13} /> Role-based access</Badge>}
        />
        <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-forest-900/8 text-left text-xs uppercase tracking-wide text-ink/45">
              <th className="py-2 font-medium">Member</th>
              <th className="py-2 font-medium">Email</th>
              <th className="py-2 font-medium">Role</th>
              <th className="py-2 font-medium">Last active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-900/6">
            {team.map((m: any) => (
              <tr key={m.id}>
                <td className="py-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: avatarColor(m.name) }}
                    >
                      {initials(m.name)}
                    </span>
                    <span className="font-medium text-forest-900">{m.name}</span>
                  </div>
                </td>
                <td className="py-3 text-ink/60">{m.email}</td>
                <td className="py-3">
                  <Badge color={roleColor[m.role] || "gray"}>{titleCase(m.role)}</Badge>
                </td>
                <td className="py-3 text-ink/55">
                  {m.last_active ? dateLabel(m.last_active, "MMM d, yyyy") : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>

      <p className="text-center text-xs text-ink/40">
        This is a demo workspace. Fields are read-only.
      </p>
    </div>
  );
}

function Labeled({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-xs font-medium text-ink/55">{label}</label>
      {children}
    </div>
  );
}
