import { PageHero } from "@/components/public/page-hero";
import { PublicShell } from "@/components/public/public-shell";
import { InfoCard } from "@/components/public/info-card";
import { publicSite } from "@/lib/content/public-site";
import { publicSiteAm } from "@/lib/content/public-site.am";
import { strings, type Lang } from "@/lib/i18n/strings";

export const metadata = {
  title: "About",
  description: "Learn about Hamsa Lomi Ethiopian Association — a Nashville mutual aid community rooted in the Edir tradition."
};

export default function AboutPage({ searchParams }: { searchParams: { lang?: string } }) {
  const lang: Lang = searchParams.lang === "am" ? "am" : "en";
  const site = lang === "am" ? publicSiteAm : publicSite;
  const t = strings[lang].about;

  return (
    <PublicShell lang={lang}>
      <PageHero eyebrow={t.eyebrow} title={t.heroTitle} body={t.heroBody} />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr] items-start">
          <div className="rounded-xl border border-gold-200 bg-gold-50 p-6 lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-3">{t.ourMotto}</p>
            <p className="font-display text-xl font-semibold text-ink leading-snug">{publicSite.mottoAmharic}</p>
            <div className="my-4 h-px bg-gold-200" />
            <p className="text-sm leading-relaxed text-ink-muted italic">{site.meaning}</p>
            <div className="mt-5 rounded-lg bg-green-700 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-gold-400 mb-1">{t.founded}</p>
              <p className="font-display text-2xl font-bold text-white">2014</p>
              <p className="mt-1 text-xs text-green-200">Nashville, Tennessee</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-5 w-1 rounded-full bg-green-600" />
              <p className="text-xs font-bold uppercase tracking-widest text-green-700">{t.ourStory}</p>
            </div>
            {site.about.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-ink-soft">{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-600">{t.whatGuidesUs}</p>
            <h2 className="font-display mt-1.5 text-2xl font-bold text-ink sm:text-3xl">{t.guiding}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {site.principles.map((principle, i) => (
              <InfoCard key={i} title={principle.title} body={principle.description} accent={i % 3 === 0 ? "green" : i % 3 === 1 ? "gold" : "red"} />
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
