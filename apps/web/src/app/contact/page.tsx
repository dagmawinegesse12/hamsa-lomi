import { PageHero } from "@/components/public/page-hero";
import { PublicShell } from "@/components/public/public-shell";
import { publicSite } from "@/lib/content/public-site";
import { strings, type Lang } from "@/lib/i18n/strings";
import { ContactForm } from "./contact-form";

export const metadata = {
  title: "Contact",
  description: "Contact the Hamsa Lomi Ethiopian Association office for membership, payments, claims, or meeting information."
};

export default function ContactPage({ searchParams }: { searchParams: { lang?: string } }) {
  const lang: Lang = searchParams.lang === "am" ? "am" : "en";
  const t = strings[lang].contact;

  return (
    <PublicShell lang={lang}>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.heroTitle}
        body={t.heroBody}
      />
      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1fr_420px]">
        {/* Form */}
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-gray-950">{t.sendMessage}</h2>
          <ContactForm />
        </div>

        {/* Contact details */}
        <div className="space-y-4">
          <a
            className="block rounded-md border border-gray-200 bg-white p-5 shadow-sm hover:border-teal-300"
            href={publicSite.contact.mapsUrl}
            rel="noreferrer"
            target="_blank"
          >
            <h3 className="text-sm font-bold text-gray-950">{t.officeLocation}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              {publicSite.contact.addressLine1}<br />
              {publicSite.contact.addressLine2}<br />
              <span className="text-gray-400">{publicSite.contact.locationNote}</span>
            </p>
            <p className="mt-3 text-xs font-semibold text-teal-700">{t.viewMaps}</p>
          </a>
          <a
            className="block rounded-md border border-gray-200 bg-white p-5 shadow-sm hover:border-teal-300"
            href={`mailto:${publicSite.contact.email}`}
          >
            <h3 className="text-sm font-bold text-gray-950">{t.email}</h3>
            <p className="mt-2 text-sm text-teal-700">{publicSite.contact.email}</p>
          </a>
          <a
            className="block rounded-md border border-gray-200 bg-white p-5 shadow-sm hover:border-teal-300"
            href={`tel:+1${publicSite.contact.phone.replace(/\D/g, "")}`}
          >
            <h3 className="text-sm font-bold text-gray-950">{t.phone}</h3>
            <p className="mt-2 text-sm text-teal-700">{publicSite.contact.phone}</p>
          </a>
          <div className="rounded-md border border-teal-200 bg-teal-50 p-5">
            <p className="text-sm font-bold text-teal-900">{t.regWindows}</p>
            <p className="mt-2 text-sm leading-6 text-teal-800">{publicSite.membership.registrationWindows}</p>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
