"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const fmtK = (n: number) =>
  n >= 1000 ? "$" + (n / 1000).toFixed(0) + "k" : "$" + n;

const fmtFull = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function GivingTrendChart({ data }: { data: { month: string; amount: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="giveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2D6A4F" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#2D6A4F" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "#14201a80" }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
          minTickGap={18}
        />
        <YAxis
          tickFormatter={fmtK}
          tick={{ fontSize: 11, fill: "#14201a80" }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip
          formatter={(v: number) => [fmtFull(v), "Raised"]}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #1B433215",
            fontSize: 13,
            boxShadow: "0 8px 30px rgba(20,32,26,0.10)",
          }}
        />
        <Area
          type="monotone"
          dataKey="amount"
          stroke="#2D6A4F"
          strokeWidth={2.5}
          fill="url(#giveGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function CampaignBarChart({
  data,
}: {
  data: { name: string; raised: number; accent: string }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(180, data.length * 46)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
        barCategoryGap={12}
      >
        <XAxis type="number" tickFormatter={fmtK} tick={{ fontSize: 11, fill: "#14201a80" }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          width={150}
          tick={{ fontSize: 12, fill: "#14201a" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "#1B433208" }}
          formatter={(v: number) => [fmtFull(v), "Raised"]}
          contentStyle={{ borderRadius: 12, border: "1px solid #1B433215", fontSize: 13 }}
        />
        <Bar dataKey="raised" radius={[0, 6, 6, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.accent} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

const METHOD_COLORS: Record<string, string> = {
  card: "#2D6A4F",
  ach: "#40916C",
  check: "#D4A017",
  cash: "#B0830F",
};

export function MethodDonut({ data }: { data: { method: string; amount: number }[] }) {
  const total = data.reduce((s, d) => s + d.amount, 0);
  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={150} height={150}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="method"
            innerRadius={45}
            outerRadius={70}
            paddingAngle={2}
            stroke="none"
          >
            {data.map((d, i) => (
              <Cell key={i} fill={METHOD_COLORS[d.method] || "#95D5B2"} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => fmtFull(v)} contentStyle={{ borderRadius: 12, fontSize: 13, border: "1px solid #1B433215" }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-1.5">
        {data.map((d) => (
          <div key={d.method} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: METHOD_COLORS[d.method] || "#95D5B2" }}
            />
            <span className="capitalize text-ink/70 w-12">{d.method}</span>
            <span className="font-medium text-forest-900">
              {total ? Math.round((d.amount / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
