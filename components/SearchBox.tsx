"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";

export function SearchBox({
  placeholder = "Search…",
  paramName = "q",
}: {
  placeholder?: string;
  paramName?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [value, setValue] = useState(sp.get(paramName) || "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(sp.toString());
    if (value) params.set(paramName, value);
    else params.delete(paramName);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <form onSubmit={submit} className="relative w-full sm:w-auto">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
      />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-forest-900/12 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/15 sm:w-64"
      />
    </form>
  );
}
