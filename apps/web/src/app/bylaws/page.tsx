import Link from "next/link";
import { Download, FileText, Users, ChevronRight } from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { PublicShell } from "@/components/public/public-shell";
import { strings, type Lang } from "@/lib/i18n/strings";

export const metadata = {
  title: "Bylaws",
  description: "Official bylaws of Hamsa Lomi Ethiopian Association, a Tennessee Nonprofit Corporation. Adopted January 30, 2024."
};

const articles = [
  { num: "I",    title: "Purposes",                    summary: "The Corporation operates exclusively for charitable purposes under Section 501(c)(12) of the Internal Revenue Code." },
  { num: "II",   title: "Offices",                     summary: "Registered office in Nashville, Tennessee; additional offices as determined by the Board of Directors." },
  { num: "III",  title: "Members",                     summary: "Membership classes, qualifications, voting rights, quorum rules, and conditions for membership termination." },
  { num: "IV",   title: "Directors",                   summary: "Powers, qualifications, election terms (3 years), quorum (2/3), compensation, and evaluation requirements." },
  { num: "V",    title: "Officers",                    summary: "President, Vice President, Secretary, Chief Accountant, and Treasurer — elected for 3-year terms at the annual meeting." },
  { num: "VI",   title: "Committees",                  summary: "Establishment, appointment, and authority of board committees and advisory boards." },
  { num: "VII",  title: "Resignations and Vacancies",  summary: "How members, directors, or officers may resign and how vacancies on the Board are filled." },
  { num: "VIII", title: "Meetings and Notice",         summary: "Place of meetings, required written notice, waiver of notice, and electronic mail communications." },
  { num: "IX",   title: "Liability and Indemnification", summary: "Director liability limitations, indemnification of officers and directors, advancement of expenses." },
  { num: "X",    title: "Amendments / Dissolution",    summary: "Procedures for amending the Articles of Incorporation or Bylaws, and rules for dissolution of the Corporation." },
  { num: "XI",   title: "Miscellaneous",               summary: "Fiscal year (January–December), conflict-of-interest policies, whistleblower protection, and corporate seal." },
];

export default function BylawsPage({ searchParams }: { searchParams: { lang?: string } }) {
  const lang: Lang = searchParams.lang === "am" ? "am" : "en";
  const t = strings[lang].bylaws;

  return (
    <PublicShell lang={lang}>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.heroTitle}
        body={t.heroBody}
      />

      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-14">

        {/* Download banner */}
        <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl bg-green-700 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-display text-base font-bold text-white">Bylaws — Official Document</p>
              <p className="text-sm text-green-100">PDF · 10 pages · Signed January 30, 2024</p>
            </div>
          </div>
          <a
            href="/bylaws.pdf"
            download="Hamsa_Lomi_Bylaws.pdf"
            className="flex shrink-0 items-center gap-2 rounded-md bg-gold-500 px-5 py-2.5 text-sm font-bold text-ink hover:bg-gold-400 transition-colors"
          >
            <Download className="h-4 w-4" />
            {t.download}
          </a>
        </div>

        {/* Article index */}
        <div className="mb-4">
          <h2 className="font-display text-lg font-bold text-ink">{t.toc}</h2>
          <p className="mt-1 text-sm text-ink-muted">{t.tocSub}</p>
        </div>

        <dl className="space-y-3">
          {articles.map((article) => (
            <div key={article.num} className="flex gap-4 rounded-lg border border-gray-200 bg-white px-5 py-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-700 text-xs font-bold text-white mt-0.5">
                {article.num}
              </div>
              <div>
                <dt className="font-display text-sm font-bold text-ink">Article {article.num} — {article.title}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink-muted">{article.summary}</dd>
              </div>
            </div>
          ))}
        </dl>

        {/* Signed by */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-ink-muted">
          <p>{t.adopted} <strong className="text-ink">January 30, 2024</strong>.</p>
          <div className="mt-2 flex flex-wrap gap-6">
            <span><strong className="text-ink">President:</strong> Abdul Boulett</span>
            <span><strong className="text-ink">Secretary:</strong> Behabtu Wolde Senbet</span>
          </div>
        </div>

        {/* Secondary cards */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <article className="card-accent border-l-gold-500 p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gold-50">
              <Users className="h-5 w-5 text-gold-600" />
            </div>
            <h2 className="font-display text-xl font-bold text-ink">{t.proxyTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {t.proxyBody}
            </p>
            <Link
              className="mt-5 inline-flex items-center gap-1 rounded-md border border-gray-300 px-4 py-2.5 text-sm font-semibold text-ink hover:bg-gray-50 transition-colors"
              href={lang === "am" ? "/contact?lang=am" : "/contact"}
            >
              {t.requestProxy} <ChevronRight className="h-4 w-4" />
            </Link>
          </article>

          <article className="card-accent border-l-green-700 p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <Download className="h-5 w-5 text-green-700" />
            </div>
            <h2 className="font-display text-xl font-bold text-ink">{t.downloadTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {t.downloadBody}
            </p>
            <a
              href="/bylaws.pdf"
              download="Hamsa_Lomi_Bylaws.pdf"
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800 transition-colors"
            >
              <Download className="h-4 w-4" />
              {t.download}
            </a>
          </article>
        </div>
      </section>
    </PublicShell>
  );
}
