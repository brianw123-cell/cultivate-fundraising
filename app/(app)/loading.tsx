export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-56 animate-pulse rounded-lg bg-ink/8" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-ink/5" />
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="h-72 animate-pulse rounded-2xl bg-ink/5 lg:col-span-2" />
        <div className="h-72 animate-pulse rounded-2xl bg-ink/5" />
      </div>
    </div>
  );
}
