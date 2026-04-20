import Link from "next/link";
import { Calendar, ImageIcon, MapPin, Plus, Globe, EyeOff } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { prisma } from "@/lib/db";
import { CreateEventForm } from "./create-event-form";

export const dynamic = "force-dynamic";

async function getEvents() {
  return prisma.galleryEvent.findMany({
    orderBy: { date: "desc" },
    include: { _count: { select: { photos: true } } },
  });
}

export default async function GalleryAdminPage() {
  const events = await getEvents();

  return (
    <AdminShell title="Gallery">
      <div className="grid gap-6 lg:grid-cols-[400px_minmax(0,1fr)]">

        {/* Create form */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-warm">
          <h2 className="text-lg font-bold text-ink">New event</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Create an event album, then upload photos from inside it.
          </p>
          <CreateEventForm />
        </section>

        {/* Event list */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-warm overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-ink">Event albums</h2>
              <p className="mt-0.5 text-sm text-ink-muted">{events.length} album{events.length !== 1 ? "s" : ""}</p>
            </div>
            <Link href="/gallery" target="_blank" className="text-xs font-semibold text-green-700 hover:text-green-800">
              View public gallery →
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <ImageIcon className="h-7 w-7 text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-ink">No event albums yet</p>
              <p className="mt-1 text-xs text-ink-muted">Create your first event album using the form on the left.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {events.map((ev: (typeof events)[number]) => (
                <li key={ev.id}>
                  <Link
                    href={`/admin/gallery/${ev.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Photo count badge */}
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-green-50 border border-green-100">
                      <span className="font-display text-lg font-bold text-green-700 leading-none">{ev._count.photos}</span>
                      <span className="text-[10px] text-green-600 mt-0.5">photos</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-display text-sm font-bold text-ink truncate">{ev.title}</p>
                        {ev.isPublic
                          ? <Globe className="h-3.5 w-3.5 shrink-0 text-green-600" />
                          : <EyeOff className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                        }
                      </div>
                      {ev.titleAm && <p className="text-xs text-ink-muted truncate">{ev.titleAm}</p>}
                      <div className="mt-1 flex items-center gap-3 text-xs text-ink-muted">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {ev.date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                        {ev.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {ev.location}
                          </span>
                        )}
                      </div>
                    </div>

                    <Plus className="h-4 w-4 shrink-0 text-gray-400 rotate-45 opacity-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
