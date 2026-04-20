import { PageHero } from "@/components/public/page-hero";
import { PublicShell } from "@/components/public/public-shell";
import { publicSite } from "@/lib/content/public-site";
import { ApplicationForm } from "./application-form";

export const metadata = {
  title: "Apply for Membership",
  description: "Apply to join the Hamsa Lomi Ethiopian Association. Membership registration opens in February and October."
};

export default function ApplyPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Apply"
        title="Membership application"
        body="Complete all four steps to submit your application. The office will review and follow up with you directly."
      />
      <section className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
          <strong>Registration windows:</strong> {publicSite.membership.registrationWindows}{" "}
          {publicSite.membership.registrationFee} {publicSite.membership.waitingPeriod}
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <ApplicationForm />
        </div>
      </section>
    </PublicShell>
  );
}
