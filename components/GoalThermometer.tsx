import React from "react";
import { money, compactMoney } from "@/lib/format";

export function GoalThermometer({
  raised,
  goal,
  accent = "#2D6A4F",
  donors,
}: {
  raised: number;
  goal: number;
  accent?: string;
  donors?: number;
}) {
  const pct = goal ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
  return (
    <div>
      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="font-display text-3xl font-semibold text-forest-900">
            {money(raised)}
          </div>
          <div className="text-sm text-ink/55">
            raised of {compactMoney(goal)} goal
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-2xl font-semibold" style={{ color: accent }}>
            {pct}%
          </div>
          {donors != null && (
            <div className="text-sm text-ink/55">{donors} donors</div>
          )}
        </div>
      </div>
      <div className="h-4 w-full rounded-full bg-ink/8 overflow-hidden">
        <div
          className="h-full rounded-full transition-all flex items-center justify-end"
          style={{
            width: `${Math.max(pct, 3)}%`,
            background: `linear-gradient(90deg, ${accent}cc, ${accent})`,
          }}
        />
      </div>
    </div>
  );
}
