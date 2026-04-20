import Link from "next/link";
import { PageHero } from "@/components/public/page-hero";
import { PublicShell } from "@/components/public/public-shell";
import { publicSite } from "@/lib/content/public-site";

export const metadata = {
  title: "FAQ",
  description: "Common questions about Hamsa Lomi membership, benefits, contributions, and eligibility."
};

export default function FaqPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        body="Answers to common questions about membership, contributions, and how the association works."
      />

      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-14">
        <dl className="space-y-4">
          {publicSite.faq.map((item, i) => (
            <div key={item.question} className="card-accent border-l-gold-500 p-5 sm:p-6">
              <dt className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-700 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="font-display text-base font-bold text-ink">{item.question}</span>
              </dt>
              <dd className="mt-3 pl-9 text-sm leading-relaxed text-ink-muted">{item.answer}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 rounded-xl bg-green-700 p-6 text-white text-center">
          <p className="font-display text-xl font-bold mb-2">Still have questions?</p>
          <p className="text-sm leading-relaxed text-green-100 mb-5">
            Reach the office directly and we'll be happy to help.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`mailto:${publicSite.contact.email}`}
              className="rounded-md bg-gold-500 px-5 py-2.5 text-sm font-bold text-ink hover:bg-gold-400 transition-colors"
            >
              Email us
            </a>
            <Link
              href="/contact"
              className="rounded-md border border-green-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-600 transition-colors"
            >
              Contact page →
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
