export function PageHero({
  eyebrow,
  title,
  body,
  centered = false,
}: {
  body: string;
  eyebrow: string;
  title: string;
  centered?: boolean;
}) {
  return (
    <section className="bg-white border-b border-gray-200">
      {/* Gold accent line */}
      <div className="h-0.5 w-full bg-gold-500 opacity-40" />
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 ${centered ? "text-center" : ""}`}>
        <p className="inline-block rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-green-700">
          {eyebrow}
        </p>
        <h1 className="font-display mt-4 max-w-4xl text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
          {body}
        </p>
      </div>
    </section>
  );
}
