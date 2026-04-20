import Link from "next/link";
import { DollarSign, Clock, Shield, Heart, MessageSquare, Users } from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { PublicShell } from "@/components/public/public-shell";
import { publicSite } from "@/lib/content/public-site";

export const metadata = {
  title: "Benefits",
  description: "Learn about the $20,000 death benefit, contribution model, and community support provided by Hamsa Lomi."
};

const benefitIcons = [DollarSign, Clock, Shield, Heart, MessageSquare, Users];

export default function BenefitsPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Member benefits"
        title="Support that reaches beyond a payment."
        body="The association combines financial support, organized communication, and cultural care when a family experiences the death of a loved one."
      />

      {/* Key benefit numbers */}
      <section className="py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Headline benefit */}
            <div className="sm:col-span-3 rounded-xl bg-green-700 p-6 sm:p-8 text-white">
              <div className="grid gap-6 sm:grid-cols-3 sm:items-center">
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-gold-400 mb-2">Family benefit</p>
                  <p className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">$20,000</p>
                  <p className="text-sm leading-relaxed text-green-100 max-w-lg">
                    {publicSite.membership.benefitAmount} This benefit is paid to the family of a deceased member to help cover funeral services, transportation, and immediate family needs.
                  </p>
                </div>
                <div className="flex items-center justify-start sm:justify-end">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-gold-500/40 bg-gold-500/20">
                    <DollarSign className="h-10 w-10 text-gold-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Contribution model */}
            <div className="card-accent border-l-gold-500 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-2">Contribution model</p>
              <p className="font-display text-lg font-bold text-ink mb-2">Event-based, not monthly</p>
              <p className="text-sm leading-relaxed text-ink-muted">{publicSite.membership.contributionModel}</p>
            </div>

            {/* Payment timing */}
            <div className="card-accent border-l-green-700 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-green-700 mb-2">Payment timing</p>
              <p className="font-display text-lg font-bold text-ink mb-2">7-day window</p>
              <p className="text-sm leading-relaxed text-ink-muted">{publicSite.membership.paymentTiming}</p>
            </div>

            {/* Waiting period */}
            <div className="card-accent border-l-red-600 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">Waiting period</p>
              <p className="font-display text-lg font-bold text-ink mb-2">6 months</p>
              <p className="text-sm leading-relaxed text-ink-muted">{publicSite.membership.waitingPeriod}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community responsibilities */}
      <section className="border-t border-gray-200 bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-600">What we provide</p>
            <h2 className="font-display mt-1.5 text-2xl font-bold text-ink sm:text-3xl">Community responsibilities</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {publicSite.principles.map((principle, i) => {
              const Icon = benefitIcons[i % benefitIcons.length];
              return (
                <article key={principle.title} className="card-warm p-5">
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

      {/* Apply CTA */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-xl bg-green-700 p-7 sm:p-10 text-center">
            <p className="font-display text-2xl font-bold text-white mb-3 sm:text-3xl">
              Ready to become a member?
            </p>
            <p className="text-sm leading-relaxed text-green-100 mb-6 max-w-lg mx-auto">
              {publicSite.membership.registrationWindows} Applications take 10 minutes to complete.
            </p>
            <Link
              href="/apply"
              className="inline-flex rounded-md bg-gold-500 px-8 py-3 text-sm font-bold text-ink hover:bg-gold-400 transition-colors shadow-warm"
            >
              Apply for membership
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
