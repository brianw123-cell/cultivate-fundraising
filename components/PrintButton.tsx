"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label = "Print / Save as PDF" }: { label?: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-xl bg-forest-800 px-4 py-2 text-sm font-semibold text-cream hover:bg-forest-900 transition-colors"
    >
      <Printer size={16} />
      {label}
    </button>
  );
}
