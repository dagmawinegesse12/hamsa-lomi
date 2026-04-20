import Link from "next/link";
import { DollarSign, Clock, Shield, Heart, MessageSquare, Users } from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { PublicShell } from "@/components/public/public-shell";
import { publicSite } from "@/lib/content/public-site";
import { publicSiteAm } from "@/lib/content/public-site.am";
import { strings, type Lang } from "@/lib/i18n/strings";

export const metadata = {
  title: "Benefits",
  description: "Learn about the $20,000 death benefit, contribution model, and community support provided by Hamsa Lomi."
};

const benefitIcons = [DollarSign, Clock, Shield, Heart, MessageSquare, Users];

export default function BenefitsPage({ searchParams }: { searchParams: { lang?: string } }) {
  const lang: Lang = searchParams.lang === "am" ? "am" : "en";
  const site = lang === "am" ? publicSiteAm : publicSite;
  const t = strings[lang].benefits;

  return (
    <PublicShell lang={lang}>
      <PageHero eyebrow={t.eyebrow} title={t.heroTitle} body={t.heroBody} />

      <section className="py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-3 rounded-xl bg-green-700 p-6 sm:p-8 text-white">
              <div className="grid gap-6 sm:grid-cols-3 sm:items-center">
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-gold-400 mb-2">{t.familyBenefit}</p>
                  <p className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">$20,000</p>
                  <p className="text-sm leading-relaxed text-green-100 max-w-lg">{site.membership.benefitAmount}</p>
                </div>
                <div className="flex items-center justify-start sm:justify-end">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-gold-500/40 bg-gold-500/20">
                    <DollarSign className="h-10 w-10 text-gold-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card-accent border-l-gold-500 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-2">{t.contribModel}</p>
              <p className="font-display text-lg font-bold text-ink mb-2">{t.eventBased}</p>
              <p className="text-sm leading-relaxed text-ink-muted">{site.membership.contributionModel}</p>
            </div>
            <div className="card-accent border-l-green-700 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-green-700 mb-2">{t.paymentTiming}</p>
              <p className="font-display text-lg font-bold text-ink mb-2">{t.sevenDay}</p>
              <p className="text-sm leading-relaxed text-ink-muted">{site.membership.paymentTiming}</p>
            </div>
            <div className="card-accent border-l-red-600 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">{t.waitingPeriod}</p>
              <p className="font-display text-lg font-bold text-ink mb-2">{t.sixMonth}</p>
              <p className="text-sm leading-relaxed text-ink-muted">{site.membership.waitingPeriod}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-600">{t.whatWeProvide}</p>
            <h2 className="font-display mt-1.5 text-2xl font-bold text-ink sm:text-3xl">{t.communityResp}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {site.principles.map((principle, i) => {
              const Icon = benefitIcons[i % benefitIcons.length]!;
              return (
                <article key={i} className="card-warm p-5">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
                    <Icon className="h-4 w-4 text-green-700" />
                  </div>
                  <h3 className="font-display text-base font-bold text-ink">{principle.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{principle.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-xl bg-green-700 p-7 sm:p-10 text-center">
            <p className="font-display text-2xl font-bold text-white mb-3 sm:text-3xl">{t.readyToBecome}</p>
            <p className="text-sm leading-relaxed text-green-100 mb-6 max-w-lg mx-auto">
              {site.membership.registrationWindows}
            </p>
            <Link href="/apply" className="inline-flex rounded-md bg-gold-500 px-8 py-3 text-sm font-bold text-ink hover:bg-gold-400 transition-colors shadow-warm">
              {t.applyBtn}
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
