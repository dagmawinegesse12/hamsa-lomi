import Image from "next/image";
import { PublicShell } from "@/components/public/public-shell";
import { publicSite } from "@/lib/content/public-site";

export const metadata = {
  title: "Board Members | Hamsa Lomi Ethiopian Association",
  description: "Meet the elected board members who guide Hamsa Lomi Ethiopian Association."
};

export default function BoardPage() {
  return (
    <PublicShell>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="flag-stripe-v absolute left-0 top-0 h-full w-1.5" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-6 py-14 sm:py-18 pl-10">
          <p className="text-xs font-bold uppercase tracking-widest text-gold-600">Leadership</p>
          <h1 className="font-display mt-2 text-3xl font-bold text-ink sm:text-4xl">Board Members</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">
            Hamsa Lomi is guided by five elected board members who serve in accordance with the association's
            bylaws to ensure the smooth functioning and mission of the organization.
          </p>
        </div>
      </section>

      {/* Board grid */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-8 rounded-full bg-green-700" />
              <p className="text-xs font-bold uppercase tracking-widest text-green-700">Current term — since March 6, 2025</p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {publicSite.boardMembers.map((member) => (
              <div
                key={member.name}
                className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 shadow-warm text-center hover:shadow-warm-md transition-shadow"
              >
                {/* Photo */}
                <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-green-100 shadow-warm mb-4">
                  <Image
                    src={member.photoUrl}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                    sizes="112px"
                  />
                </div>

                {/* Name & role */}
                <p className="font-display text-base font-bold text-ink leading-snug">{member.name}</p>
                <p className="mt-1 text-sm font-semibold text-green-700">{member.role}</p>
                <p className="mt-2 text-xs text-ink-muted">Since {member.since}</p>

                {/* Accent bar */}
                <div className="flag-stripe mt-4 h-1 w-12 rounded-full" />
              </div>
            ))}
          </div>

          {/* Info card */}
          <div className="mt-12 rounded-xl border border-green-200 bg-green-50 p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2 sm:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-green-700 mb-2">About our governance</p>
                <p className="text-sm leading-relaxed text-ink-muted">
                  Hamsa Lomi's board is elected by its General Assembly and serves in accordance with the
                  association's bylaws. Board members take on various responsibilities to ensure the smooth
                  operation and continued mission of the Edir.
                </p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-green-600" />
                  <span className="text-ink-muted">Seven board members oversee association operations</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-gold-500" />
                  <span className="text-ink-muted">Elections held by the General Assembly</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  <span className="text-ink-muted">Operations guided by written bylaws since 2014</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
