import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { prisma } from "@/lib/db";
import { EventEditForm } from "./event-edit-form";
import { PhotoUploader } from "./photo-uploader";
import { PhotoGrid } from "./photo-grid";

export const dynamic = "force-dynamic";

async function getEvent(id: string) {
  return prisma.galleryEvent.findUnique({
    where: { id },
    include: { photos: { orderBy: { sortOrder: "asc" } } },
  });
}

export default async function EventDetailPage({ params }: { params: { eventId: string } }) {
  const event = await getEvent(params.eventId);
  if (!event) notFound();

  return (
    <AdminShell title={event.title}>
      <div className="mb-6">
        <Link href="/admin/gallery" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors">
          <ArrowLeft className="h-4 w-4" />
          All event albums
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">

        {/* Sidebar — edit & upload */}
        <div className="space-y-5">
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-warm">
            <h2 className="text-base font-bold text-ink mb-4">Event details</h2>
            <EventEditForm event={event} />
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-warm">
            <h2 className="text-base font-bold text-ink mb-1">Upload photos</h2>
            <p className="text-sm text-ink-muted mb-4">Select multiple files at once. JPG, PNG, WebP accepted.</p>
            <PhotoUploader eventId={event.id} />
          </section>
        </div>

        {/* Photo grid */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-warm overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-base font-bold text-ink">
              Photos
              <span className="ml-2 rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                {event.photos.length}
              </span>
            </h2>
            <p className="mt-0.5 text-xs text-ink-muted">Click the trash icon to remove a photo.</p>
          </div>
          <div className="p-4">
            <PhotoGrid photos={event.photos} />
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
