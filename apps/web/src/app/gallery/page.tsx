import Image from "next/image";
import { PageHero } from "@/components/public/page-hero";
import { PublicShell } from "@/components/public/public-shell";
import { publicSite } from "@/lib/content/public-site";
import { publicSiteAm } from "@/lib/content/public-site.am";
import { strings, type Lang } from "@/lib/i18n/strings";
import { EventCarousel } from "@/components/public/event-carousel";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gallery",
  description: "Photos and memories from Hamsa Lomi Ethiopian Association community events and gatherings in Nashville."
};

type EventGallery = {
  event: string;
  eventAm: string;
  date: string;
  location: string;
  photos: string[];
};

const communityEvents: EventGallery[] = [
  {
    event: "2nd General Assembly Meeting",
    eventAm: "2ኛ ጠቅላላ ጉባኤ ስብሰባ",
    date: "February 15, 2026",
    location: "Antioch, TN",
    photos: [
      "https://api.hamsalomi.org/uploads/1772067924926.jpg",
      "https://api.hamsalomi.org/uploads/1772067902259.jpg",
      "https://api.hamsalomi.org/uploads/1772067874290.jpg",
      "https://api.hamsalomi.org/uploads/1772067851642.jpg",
      "https://api.hamsalomi.org/uploads/1772067781990.jpg",
      "https://api.hamsalomi.org/uploads/1772067765144.jpg",
      "https://api.hamsalomi.org/uploads/1772067747793.jpg",
      "https://api.hamsalomi.org/uploads/1772067728644.jpg",
      "https://api.hamsalomi.org/uploads/1772067631009.jpg",
      "https://api.hamsalomi.org/uploads/1772067582489.jpg",
      "https://api.hamsalomi.org/uploads/1772067567099.jpg",
      "https://api.hamsalomi.org/uploads/1772067528241.jpg",
      "https://api.hamsalomi.org/uploads/1772067507837.jpg",
      "https://api.hamsalomi.org/uploads/1772067485829.jpg",
      "https://api.hamsalomi.org/uploads/1772067185758.jpg",
      "https://api.hamsalomi.org/uploads/1772067185773.jpg",
      "https://api.hamsalomi.org/uploads/1772067185779.jpg",
      "https://api.hamsalomi.org/uploads/1772067185784.jpg",
      "https://api.hamsalomi.org/uploads/1772067185789.jpg",
      "https://api.hamsalomi.org/uploads/1772067185794.jpg",
      "https://api.hamsalomi.org/uploads/1772067185799.jpg",
      "https://api.hamsalomi.org/uploads/1772067185802.jpg",
      "https://api.hamsalomi.org/uploads/1772067185807.jpg",
      "https://api.hamsalomi.org/uploads/1772067185811.jpg",
      "https://api.hamsalomi.org/uploads/1772067185820.jpg",
      "https://api.hamsalomi.org/uploads/1772067185825.jpg",
      "https://api.hamsalomi.org/uploads/1772067185864.jpg",
      "https://api.hamsalomi.org/uploads/1772067185874.jpg",
      "https://api.hamsalomi.org/uploads/1772067185880.jpg",
      "https://api.hamsalomi.org/uploads/1772067185884.jpg",
      "https://api.hamsalomi.org/uploads/1772067185892.jpg",
      "https://api.hamsalomi.org/uploads/1772067185901.jpg",
      "https://api.hamsalomi.org/uploads/1772067185910.jpg",
      "https://api.hamsalomi.org/uploads/1772067185954.jpg",
      "https://api.hamsalomi.org/uploads/1772067185960.jpg",
      "https://api.hamsalomi.org/uploads/1772067185972.jpg",
      "https://api.hamsalomi.org/uploads/1772067185974.jpg",
      "https://api.hamsalomi.org/uploads/1772067185980.jpg",
      "https://api.hamsalomi.org/uploads/1772067185986.jpg",
      "https://api.hamsalomi.org/uploads/1772067185993.jpg",
      "https://api.hamsalomi.org/uploads/1772067186001.jpg",
      "https://api.hamsalomi.org/uploads/1772067186051.jpg",
    ],
  },
  {
    event: "1st General Assembly Meeting",
    eventAm: "1ኛ ጠቅላላ ጉባኤ ስብሰባ",
    date: "March 23, 2025",
    location: "Nashville, TN",
    photos: [
      "https://api.hamsalomi.org/uploads/1743636518729.jpg",
      "https://api.hamsalomi.org/uploads/1743032995949.jpg",
      "https://api.hamsalomi.org/uploads/1743033714321.jpg",
      "https://api.hamsalomi.org/uploads/1743033669640.jpg",
      "https://api.hamsalomi.org/uploads/1743033620732.jpg",
      "https://api.hamsalomi.org/uploads/1743033448294.jpg",
      "https://api.hamsalomi.org/uploads/1743033392481.jpg",
      "https://api.hamsalomi.org/uploads/1743033366938.jpg",
      "https://api.hamsalomi.org/uploads/1743033255192.jpg",
      "https://api.hamsalomi.org/uploads/1743033160970.jpg",
      "https://api.hamsalomi.org/uploads/1743033083663.jpg",
      "https://api.hamsalomi.org/uploads/1743033018527.jpg",
      "https://api.hamsalomi.org/uploads/1743636467830.jpg",
      "https://api.hamsalomi.org/uploads/1743636447830.jpg",
      "https://api.hamsalomi.org/uploads/1743636411814.jpg",
      "https://api.hamsalomi.org/uploads/1743034391256.jpg",
      "https://api.hamsalomi.org/uploads/1743034391257.jpg",
      "https://api.hamsalomi.org/uploads/1743034391261.jpg",
      "https://api.hamsalomi.org/uploads/1743034391262.jpg",
      "https://api.hamsalomi.org/uploads/1743034391263.jpg",
      "https://api.hamsalomi.org/uploads/1743034391264.jpg",
      "https://api.hamsalomi.org/uploads/1743034391265.jpg",
      "https://api.hamsalomi.org/uploads/1743034391266.jpg",
      "https://api.hamsalomi.org/uploads/1743034391267.jpg",
      "https://api.hamsalomi.org/uploads/1743034391269.jpg",
      "https://api.hamsalomi.org/uploads/1743034391270.jpg",
      "https://api.hamsalomi.org/uploads/1743034391271.jpg",
      "https://api.hamsalomi.org/uploads/1743034391272.jpg",
      "https://api.hamsalomi.org/uploads/1743034391273.jpg",
      "https://api.hamsalomi.org/uploads/1743034391301.jpg",
      "https://api.hamsalomi.org/uploads/1743034391312.jpg",
      "https://api.hamsalomi.org/uploads/1743034391327.jpg",
      "https://api.hamsalomi.org/uploads/1743034391328.jpg",
      "https://api.hamsalomi.org/uploads/1743034391329.jpg",
      "https://api.hamsalomi.org/uploads/1743034391330.jpg",
      "https://api.hamsalomi.org/uploads/1743034391331.jpg",
      "https://api.hamsalomi.org/uploads/1743034391332.jpg",
      "https://api.hamsalomi.org/uploads/1743034391334.jpg",
      "https://api.hamsalomi.org/uploads/1743034391335.jpg",
      "https://api.hamsalomi.org/uploads/1743034391336.jpg",
      "https://api.hamsalomi.org/uploads/1743034391337.jpg",
      "https://api.hamsalomi.org/uploads/1743034391338.jpg",
      "https://api.hamsalomi.org/uploads/1743034391340.jpg",
      "https://api.hamsalomi.org/uploads/1743636387110.jpg",
      "https://api.hamsalomi.org/uploads/1743636387113.jpg",
    ],
  },
];

async function getDbEvents(): Promise<EventGallery[]> {
  try {
    const rows = await prisma.galleryEvent.findMany({
      where: { isPublic: true },
      orderBy: { date: "desc" },
      include: { photos: { orderBy: { sortOrder: "asc" } } },
    });
    return rows
      .filter((ev) => ev.photos.length > 0)
      .map((ev) => ({
        event: ev.title,
        eventAm: ev.titleAm ?? ev.title,
        date: ev.date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        location: ev.location ?? "",
        photos: ev.photos.map((p) => p.url),
      }));
  } catch {
    return [];
  }
}

export default async function GalleryPage({ searchParams }: { searchParams: { lang?: string } }) {
  const lang: Lang = searchParams.lang === "am" ? "am" : "en";
  const site = lang === "am" ? publicSiteAm : publicSite;
  const t = strings[lang].gallery;

  // Prefer DB events; fall back to hardcoded if DB is empty
  const dbEvents = await getDbEvents();
  const events = dbEvents.length > 0 ? dbEvents : communityEvents;

  return (
    <PublicShell lang={lang}>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.heroTitle}
        body={t.heroBody}
      />

      {/* Community event carousels */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-16">
          {events.map((ev) => (
            <div key={ev.event}>
              {/* Event header */}
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-4 w-1 rounded-full bg-green-700" />
                    <p className="text-xs font-bold uppercase tracking-widest text-green-700">{t.eventsLabel}</p>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-ink">
                    {lang === "am" ? ev.eventAm : ev.event}
                  </h2>
                  <p className="mt-1 text-sm text-ink-muted">{ev.date} · {ev.location}</p>
                </div>
                <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  {ev.photos.length} {lang === "am" ? "ፎቶዎች" : "photos"}
                </span>
              </div>

              <EventCarousel photos={ev.photos} eventName={lang === "am" ? ev.eventAm : ev.event} />
            </div>
          ))}
        </div>
      </section>

      {/* Tributes section */}
      <section className="border-t border-gray-200 bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-5 w-1 rounded-full bg-gold-500" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gold-600">{t.inMemoriam}</p>
              <h2 className="font-display text-2xl font-bold text-ink">{t.membersWeHonor}</h2>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {site.tributes.map((tribute) => (
              <div key={tribute.name} className="group flex flex-col items-center text-center rounded-xl border border-gray-200 bg-gray-50 p-6 hover:border-gold-300 transition-colors">
                <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full border-2 border-gold-200 shadow-warm">
                  <Image
                    alt={tribute.name}
                    className="object-cover object-top"
                    fill
                    sizes="128px"
                    src={tribute.photoUrl}
                  />
                </div>
                <p className="font-display text-sm font-bold text-ink">{tribute.name}</p>
                {tribute.dates && <p className="text-xs text-ink-muted mt-1">{tribute.dates}</p>}
                {tribute.amharic && (
                  <p className="mt-2 text-xs font-medium text-gold-700 font-display">{tribute.amharic}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
