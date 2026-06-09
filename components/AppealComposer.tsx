"use client";

import { useState } from "react";
import { Send, Loader2, Check, Mail, Users } from "lucide-react";

const DEFAULT_BODY =
  "Hi {{first_name}},\n\nBecause of supporters like you, Riverside Hope Foundation served more families this year than ever before. As we head into our spring push, your continued generosity will help us reach even further.\n\nWould you consider a gift today to keep this momentum going?\n\nWith gratitude,\nDana Whitfield\nRiverside Hope Foundation";

export function AppealComposer({
  segments,
  defaultSeg,
}: {
  segments: { key: string; label: string; count: number }[];
  defaultSeg?: string;
}) {
  const initial =
    segments.find((s) => s.key === defaultSeg)?.key || segments[0]?.key || "";
  const [segKey, setSegKey] = useState(initial);
  const [name, setName] = useState("Spring Momentum Appeal");
  const [subject, setSubject] = useState("Your impact this spring 🌱");
  const [body, setBody] = useState(DEFAULT_BODY);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<{ count: number; label: string } | null>(null);

  const seg = segments.find((s) => s.key === segKey);
  const field =
    "w-full rounded-xl border border-forest-900/12 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/15";

  const preview = body.replace(/\{\{\s*first_name\s*\}\}/g, "Maria");

  async function send() {
    if (!seg) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 1400));
    setSending(false);
    setSent({ count: seg.count, label: seg.label });
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-forest-900/8 bg-white p-8 text-center shadow-card">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest-100 text-forest-700">
          <Check size={28} />
        </span>
        <h2 className="mt-4 font-display text-2xl font-semibold text-forest-900">
          Appeal queued
        </h2>
        <p className="mt-1 text-ink/60">
          “{subject}” is scheduled to send to{" "}
          <strong className="text-forest-800">{sent.count} donors</strong> in the{" "}
          {sent.label} segment.
        </p>
        <button
          onClick={() => setSent(null)}
          className="mt-6 rounded-xl bg-forest-800 px-5 py-2.5 text-sm font-semibold text-cream hover:bg-forest-900"
        >
          Compose another
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* composer */}
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-forest-900">
            Appeal name
          </label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={field} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-forest-900">
            Send to segment
          </label>
          <select value={segKey} onChange={(e) => setSegKey(e.target.value)} className={field}>
            {segments.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label} ({s.count})
              </option>
            ))}
          </select>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink/50">
            <Users size={13} /> {seg?.count ?? 0} recipients in this segment
          </p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-forest-900">Subject</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} className={field} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-forest-900">
            Message
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={11}
            className={field + " font-mono text-xs leading-relaxed"}
          />
          <p className="mt-1.5 text-xs text-ink/50">
            Use <code className="rounded bg-ink/8 px-1">{"{{first_name}}"}</code> to
            personalize each email.
          </p>
        </div>
        <button
          onClick={send}
          disabled={sending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest-800 py-3 text-sm font-semibold text-cream hover:bg-forest-900 disabled:opacity-70"
        >
          {sending ? (
            <>
              <Loader2 size={16} className="animate-spin-slow" /> Sending…
            </>
          ) : (
            <>
              <Send size={16} /> Send to {seg?.count ?? 0} donors
            </>
          )}
        </button>
      </div>

      {/* live preview */}
      <div>
        <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-forest-900">
          <Mail size={15} /> Live preview
        </div>
        <div className="overflow-hidden rounded-2xl border border-forest-900/8 bg-white shadow-card">
          <div className="border-b border-forest-900/8 bg-cream/60 px-5 py-3 text-xs text-ink/55">
            <div>
              <span className="font-semibold text-forest-900">From:</span> Riverside Hope
              Foundation
            </div>
            <div>
              <span className="font-semibold text-forest-900">To:</span> Maria Sample
            </div>
            <div className="mt-1 text-sm font-semibold text-forest-900">{subject}</div>
          </div>
          <div className="whitespace-pre-wrap px-5 py-5 text-sm leading-relaxed text-ink/80">
            {preview}
          </div>
          <div className="border-t border-forest-900/8 px-5 py-4">
            <span className="inline-block rounded-xl bg-forest-800 px-4 py-2 text-sm font-semibold text-cream">
              Donate now
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
