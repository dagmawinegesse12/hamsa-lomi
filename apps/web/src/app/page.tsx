import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { PublicShell } from "@/components/public/public-shell";
import { InfoCard } from "@/components/public/info-card";
import { publicSite } from "@/lib/content/public-site";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

async function getHomeStats() {
  const now = new Date();
  const [organization, announcements, meetings] = await Promise.all([
    prisma.organization.findFirst({ orderBy: { createdAt: "asc" } }),
    prisma.announcement.findMany({
      where: { publishedAt: { lte: now } },
      orderBy: { publishedAt: "desc" },
      take: 5
    }),
    prisma.meeting.findMany({
      where: { date: { gte: now }, isPublic: true, publishedAt: { lte: now } },
      orderBy: { date: "asc" },
      take: 3
    })
  ]);

  return {
    announcements,
    meetings,
    organizationName: organization?.name ?? publicSite.name
  };
}

export default async function HomePage() {
  const stats = await getHomeStats();

  return (
    <PublicShell>
      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section className="relative overflow-hidden bg-white">
        {/* Decorative vertical flag stripe */}
        <div className="flag-stripe-v absolute left-0 top-0 h-full w-1.5" aria-hidden="true" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_380px] items-start">

            {/* Left: copy */}
            <div className="pl-4 sm:pl-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-green-700">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                {stats.organizationName}
              </p>

              <h1 className="font-display mt-5 text-3xl font-bold leading-tight text-ink sm:text-4xl md:text-5xl lg:text-5xl">
                Ethiopian community{" "}
                <em className="not-italic text-green-700">solidarity</em>,<br className="hidden sm:block" />{" "}
                organized for Nashville.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
                {publicSite.tagline} Hamsa Lomi uses the Edir model to coordinate communication, financial assistance, funeral support, and shared cultural responsibility.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/apply"
                  className="rounded-md bg-green-700 px-6 py-3 text-sm font-semibold text-white hover:bg-green-800 transition-colors shadow-warm"
                >
                  Apply for membership
                </Link>
                <Link
                  href="/dashboard"
                  className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-ink hover:bg-gray-50 transition-colors"
                >
                  Member portal →
                </Link>
              </div>

              {/* Amharic motto card */}
              <div className="mt-8 rounded-lg border border-gold-200 bg-gold-50 p-4 max-w-lg">
                <p className="font-display text-base font-semibold text-ink leading-snug">
                  {publicSite.mottoAmharic}
                </p>
                <p className="mt-2 text-sm text-ink-muted italic leading-relaxed">
                  {publicSite.meaning}
                </p>
              </div>
            </div>

            {/* Right: membership highlights */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-warm-md overflow-hidden">
              <div className="flag-stripe h-1 w-full" aria-hidden="true" />
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-4">
                  Membership at a glance
                </p>

                <div className="divide-y divide-gray-100">
                  <div className="flex items-center justify-between py-4">
                    <span className="text-sm font-medium text-ink-muted">Founded</span>
                    <span className="font-display text-lg font-bold text-ink">2014</span>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <span className="text-sm font-medium text-ink-muted">Community size</span>
                    <span className="font-display text-lg font-bold text-ink">900+ members</span>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <span className="text-sm font-medium text-ink-muted">Registration fee</span>
                    <span className="font-display text-lg font-bold text-ink">$300</span>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <span className="text-sm font-medium text-ink-muted">Registration opens</span>
                    <span className="font-display text-sm font-bold text-ink">Feb &amp; Oct</span>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <span className="text-sm font-medium text-ink-muted">Coverage area</span>
                    <span className="font-display text-sm font-bold text-ink">60-mile radius of Nashville</span>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-green-700 p-4 text-white">
                  <p className="font-display text-2xl font-bold text-gold-400">$20,000</p>
                  <p className="mt-1 text-xs leading-relaxed text-green-100">
                    Benefit provided to the family of every deceased member
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          PRINCIPLES
      ══════════════════════════════════ */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gold-600">Our pillars</p>
              <h2 className="font-display mt-1.5 text-2xl font-bold text-ink sm:text-3xl">
                How the Edir works
              </h2>
            </div>
            <Link href="/about" className="text-sm font-semibold text-green-700 hover:text-green-800 transition-colors whitespace-nowrap">
              Learn more about us →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {publicSite.principles.map((principle, i) => (
              <InfoCard
                key={principle.title}
                title={principle.title}
                body={principle.description}
                accent={i % 3 === 0 ? "green" : i % 3 === 1 ? "gold" : "red"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          MEMBERSHIP CTA BANNER
      ══════════════════════════════════ */}
      <section className="bg-green-700 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gold-400">Join the community</p>
              <h2 className="font-display mt-2 text-2xl font-bold text-white sm:text-3xl">
                Registration opens in February & October
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-green-100 max-w-xl">
                {publicSite.membership.registrationFee} {publicSite.membership.waitingPeriod}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/apply"
                className="rounded-md bg-gold-500 px-6 py-3 text-center text-sm font-bold text-ink hover:bg-gold-400 transition-colors shadow-warm"
              >
                Apply for membership
              </Link>
              <Link
                href="/membership"
                className="rounded-md border border-green-500 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-green-600 transition-colors"
              >
                View requirements
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          ANNOUNCEMENTS + MEETINGS
      ══════════════════════════════════ */}
      <section className="py-14 sm:py-16 bg-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2">

            {/* Announcements */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-5 w-1 rounded-full bg-gold-500" />
                <p className="text-xs font-bold uppercase tracking-widest text-gold-600">Community board</p>
              </div>
              <h2 className="font-display -mt-1 text-2xl font-bold text-ink mb-5">Announcements</h2>
              <div className="space-y-3">
                {stats.announcements.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-gray-200 px-5 py-8 text-center text-sm text-ink-muted">
                    No public announcements at this time.
                  </p>
                ) : stats.announcements.map((a) => {
                  const isDeathNotice = a.announcementType === "DEATH_NOTICE";
                  const isUrgent = a.announcementType === "URGENT";
                  return (
                    <article
                      key={a.id}
                      className={`rounded-xl overflow-hidden border ${
                        isDeathNotice
                          ? "border-gray-300 bg-gray-50"
                          : isUrgent
                          ? "border-red-200 bg-red-50"
                          : "card-accent border-l-gold-500"
                      }`}
                    >
                      {/* Death notice: large photo layout */}
                      {isDeathNotice && a.imageUrl && (
                        <div className="flex items-center gap-4 border-b border-gray-200 bg-white p-4">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-gray-300 shadow">
                            <Image
                              alt={a.title}
                              className="object-cover"
                              fill
                              sizes="80px"
                              src={a.imageUrl}
                            />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">In Memoriam</p>
                            <p className="font-display text-lg font-bold text-ink leading-tight">{a.title}</p>
                          </div>
                        </div>
                      )}

                      {/* Non-death-notice image */}
                      {!isDeathNotice && a.imageUrl && (
                        <div className="relative h-44 w-full">
                          <Image
                            alt={a.title}
                            className="object-cover"
                            fill
                            sizes="(max-width: 768px) 100vw, 500px"
                            src={a.imageUrl}
                          />
                        </div>
                      )}

                      <div className="p-5">
                        {!isDeathNotice && (
                          <div className="flex items-center gap-2 mb-2">
                            {isUrgent && (
                              <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-red-700">
                                Urgent
                              </span>
                            )}
                            {a.announcementType === "EVENT" && (
                              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-blue-700">
                                Event
                              </span>
                            )}
                            <p className="font-display text-base font-bold text-ink">{a.title}</p>
                          </div>
                        )}
                        <p className="text-sm leading-relaxed text-ink-muted">{a.body}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Meetings */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-5 w-1 rounded-full bg-green-600" />
                <p className="text-xs font-bold uppercase tracking-widest text-green-700">Meeting notices</p>
              </div>
              <h2 className="font-display -mt-1 text-2xl font-bold text-ink mb-5">Upcoming meetings</h2>
              <div className="space-y-3">
                {stats.meetings.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-gray-200 px-5 py-8 text-center text-sm text-ink-muted">
                    No upcoming meetings are scheduled.
                  </p>
                ) : stats.meetings.map((m) => (
                  <article key={m.id} className="card-warm p-5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="font-display text-base font-bold text-ink capitalize">
                        {m.type.replace("_", " ").toLowerCase()} meeting
                      </p>
                      <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                        <Calendar className="h-3 w-3" />
                        {formatDate(m.date)}
                      </span>
                    </div>
                    {m.agenda && (
                      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{m.agenda}</p>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          BOARD MEMBERS PREVIEW
      ══════════════════════════════════ */}
      <section className="py-14 sm:py-16 bg-green-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gold-400">Leadership</p>
              <h2 className="font-display mt-1.5 text-2xl font-bold text-white sm:text-3xl">Board Members</h2>
              <p className="mt-2 text-sm text-green-200">Current board — serving since March 2025</p>
            </div>
            <Link href="/board" className="text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors whitespace-nowrap">
              View all board members →
            </Link>
          </div>

          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {publicSite.boardMembers.map((member) => (
              <div key={member.name} className="flex flex-col items-center text-center">
                <div className="relative h-20 w-20 overflow-hidden rounded-full border-3 border-green-500 shadow-warm mb-3">
                  <Image
                    src={member.photoUrl}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                    sizes="80px"
                  />
                </div>
                <p className="text-sm font-bold text-white leading-snug">{member.name}</p>
                <p className="mt-0.5 text-xs text-gold-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          TRIBUTES
      ══════════════════════════════════ */}
      <section className="py-14 sm:py-16 bg-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gold-600">In memoriam</p>
              <h2 className="font-display mt-1.5 text-2xl font-bold text-ink sm:text-3xl">Tributes</h2>
            </div>
            <Link href="/tributes" className="text-sm font-semibold text-green-700 hover:text-green-800 transition-colors whitespace-nowrap">
              View all tributes →
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {publicSite.tributes.map((tribute) => (
              <article key={tribute.name} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-warm">
                <div className="flex items-center gap-4 p-5">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-gray-200 shadow">
                    <Image
                      src={tribute.photoUrl}
                      alt={tribute.name}
                      fill
                      className="object-cover object-top"
                      sizes="64px"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">In Memoriam</p>
                    <p className="font-display text-base font-bold text-ink leading-snug mt-0.5">{tribute.name}</p>
                    {tribute.dates && <p className="mt-0.5 text-xs text-ink-muted">{tribute.dates}</p>}
                  </div>
                </div>
                <div className="px-5 pb-5">
                  <p className="text-sm leading-relaxed text-ink-muted italic line-clamp-2">{tribute.excerpt}</p>
                </div>
                <div className="flag-stripe h-1 w-full" />
              </article>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
