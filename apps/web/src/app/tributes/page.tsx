import Image from "next/image";
import { Heart } from "lucide-react";
import { PublicShell } from "@/components/public/public-shell";
import { publicSite } from "@/lib/content/public-site";
import { publicSiteAm } from "@/lib/content/public-site.am";
import { strings, type Lang } from "@/lib/i18n/strings";

export const metadata = {
  title: "Tributes | Hamsa Lomi Ethiopian Association",
  description: "In loving memory of our community members."
};

export default function TributesPage({ searchParams }: { searchParams: { lang?: string } }) {
  const lang: Lang = searchParams.lang === "am" ? "am" : "en";
  const site = lang === "am" ? publicSiteAm : publicSite;
  const t = strings[lang].tributes;

  return (
    <PublicShell lang={lang}>
      <section className="relative overflow-hidden bg-white">
        <div className="flag-stripe-v absolute left-0 top-0 h-full w-1.5" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-6 py-14 pl-10">
          <p className="text-xs font-bold uppercase tracking-widest text-gold-600">{t.eyebrow}</p>
          <h1 className="font-display mt-2 text-3xl font-bold text-ink sm:text-4xl">{t.heroTitle}</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">{t.heroBody}</p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-6 space-y-8">
          {site.tributes.map((tribute) => (
            <article key={tribute.name} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-warm">
              <div className="flex items-center gap-5 border-b border-gray-100 bg-gray-50 p-6">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-warm-md">
                  <Image src={tribute.photoUrl} alt={tribute.name} fill className="object-cover object-top" sizes="96px" />
                </div>
                <div>
                  {tribute.amharic && (
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">{tribute.amharic}</p>
                  )}
                  <h2 className="font-display text-xl font-bold text-ink">{tribute.name}</h2>
                  {tribute.dates && <p className="mt-1 text-sm text-ink-muted">{tribute.dates}</p>}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-3">
                  <Heart className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  <p className="text-sm leading-relaxed text-ink-muted italic">{tribute.excerpt}</p>
                </div>
              </div>
              <div className="flag-stripe h-1 w-full" />
            </article>
          ))}

          <div className="rounded-xl border border-gold-200 bg-gold-50 p-6 text-center">
            <p className="font-display text-base font-semibold text-ink">{publicSite.mottoAmharic}</p>
            <p className="mt-2 text-sm italic text-ink-muted">{publicSite.mottoEnglish}</p>
            <p className="mt-4 text-xs text-ink-muted max-w-lg mx-auto leading-relaxed">{t.communityMsg}</p>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
