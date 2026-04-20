export function InfoCard({
  body,
  title,
  accent = "gold",
  icon,
}: {
  body: string;
  title: string;
  accent?: "gold" | "green" | "red";
  icon?: React.ReactNode;
}) {
  const borderColors = {
    gold:  "border-l-gold-500",
    green: "border-l-green-700",
    red:   "border-l-red-600",
  };

  return (
    <article className={`card-accent ${borderColors[accent]} p-5`}>
      {icon && (
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-green-50 text-green-700">
          {icon}
        </div>
      )}
      <h2 className="font-display text-base font-bold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>
    </article>
  );
}
