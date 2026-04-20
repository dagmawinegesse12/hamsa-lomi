import Link from "next/link";
import { CheckCircle, XCircle, Calendar, DollarSign, Clock } from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { PublicShell } from "@/components/public/public-shell";
import { publicSite } from "@/lib/content/public-site";
import { publicSiteAm } from "@/lib/content/public-site.am";
import { strings, type Lang } from "@/lib/i18n/strings";

export const metadata = {
  title: "Membership",
  description: "Learn about Hamsa Lomi membership eligibility, registration windows, fees, and requirements."
};

export default function MembershipPage({ searchParams }: { searchParams: { lang?: string } }) {
  const lang: Lang = searchParams.lang === "am" ? "am" : "en";
  const site = lang === "am" ? publicSiteAm : publicSite;
  const t = strings[lang].membership;

  return (
    <PublicShell lang={lang}>
      <PageHero eyebrow={t.eyebrow} title={t.heroTitle} body={t.heroBody} />

      <section className="py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card-warm p-5 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                <Calendar className="h-5 w-5 text-green-700" />
              </div>
              <p className="font-display text-base font-bold text-ink">{t.regWindows}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{site.membership.registrationWindows}</p>
            </div>
            <div className="card-warm p-5 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gold-50">
                <DollarSign className="h-5 w-5 text-gold-600" />
              </div>
              <p className="font-display text-base font-bold text-ink">{t.regFee}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{site.membership.registrationFee}</p>
            </div>
            <div className="card-warm p-5 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                <Clock className="h-5 w-5 text-red-600" />
              </div>
              <p className="font-display text-base font-bold text-ink">{t.waitingPeriod}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{site.membership.waitingPeriod}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-green-200 bg-green-50 p-6">
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-4 w-4 text-green-700" />
                </div>
                <h2 className="font-display text-lg font-bold text-ink">{t.eligibilityTitle}</h2>
              </div>
              <ul className="space-y-3">
                {site.membership.eligibility.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
                <h2 className="font-display text-lg font-bold text-ink">{t.terminationTitle}</h2>
              </div>
              <ul className="space-y-3">
                {site.membership.termination.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-xl bg-green-700 p-7 text-white">
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h2 className="font-display text-2xl font-bold">{t.readyToApply}</h2>
                <p className="mt-2 text-sm leading-relaxed text-green-100 max-w-lg">{t.applyBody}</p>
              </div>
              <Link href="/apply" className="inline-flex items-center justify-center rounded-md bg-gold-500 px-7 py-3 text-sm font-bold text-ink hover:bg-gold-400 transition-colors shadow-warm whitespace-nowrap">
                {t.startApp}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
