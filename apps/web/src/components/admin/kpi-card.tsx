export function KpiCard({
  helper,
  label,
  value,
  accent = "green",
}: {
  helper: string;
  label: string;
  value: string;
  accent?: "green" | "gold" | "red" | "neutral";
}) {
  const accentBar = {
    green:   "bg-green-700",
    gold:    "bg-gold-500",
    red:     "bg-red-600",
    neutral: "bg-gray-300",
  };

  return (
    <div className="card-warm overflow-hidden">
      <div className={`h-1 w-full ${accentBar[accent]}`} />
      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-muted">{label}</p>
        <p className="font-display mt-2 text-3xl font-bold tracking-tight text-ink truncate" title={value}>{value}</p>
        <p className="mt-2 text-xs leading-relaxed text-ink-muted">{helper}</p>
      </div>
    </div>
  );
}
