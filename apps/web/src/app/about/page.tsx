import { PageHero } from "@/components/public/page-hero";
import { PublicShell } from "@/components/public/public-shell";
import { InfoCard } from "@/components/public/info-card";
import { publicSite } from "@/lib/content/public-site";

export const metadata = {
  title: "About",
  description: "Learn about Hamsa Lomi Ethiopian Association — a Nashville mutual aid community rooted in the Edir tradition."
};

export default function AboutPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="About us"
        title="Built by volunteers to protect families from facing loss alone."
        body="A Nashville-based Ethiopian mutual aid association rooted in the long-standing Edir tradition of collective care."
      />

      {/* Motto + story */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr] items-start">

          {/* Motto card */}
          <div className="rounded-xl border border-gold-200 bg-gold-50 p-6 lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-3">Our motto</p>
            <p className="font-display text-xl font-semibold text-ink leading-snug">
              {publicSite.mottoAmharic}
            </p>
            <div className="my-4 h-px bg-gold-200" />
            <p className="text-sm leading-relaxed text-ink-muted italic">
              {publicSite.meaning}
            </p>
            <div className="mt-5 rounded-lg bg-green-700 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-gold-400 mb-1">Founded</p>
              <p className="font-display text-2xl font-bold text-white">2014</p>
              <p className="mt-1 text-xs text-green-200">Nashville, Tennessee</p>
            </div>
          </div>

          {/* Story paragraphs */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-5 w-1 rounded-full bg-green-600" />
              <p className="text-xs font-bold uppercase tracking-widest text-green-700">Our story</p>
            </div>
            {publicSite.about.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-ink-soft">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Guiding principles */}
      <section className="border-t border-gray-200 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-600">What guides us</p>
            <h2 className="font-display mt-1.5 text-2xl font-bold text-ink sm:text-3xl">Guiding principles</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {publicSite.principles.map((principle, i) => (
              <InfoCard
                key={principle.title}
                title={principle.title}
                body={principle.description}
                accent={i % 3 === 0 ? "green" : i % 3 === 1 ? "gold" : "red"}
              />
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
