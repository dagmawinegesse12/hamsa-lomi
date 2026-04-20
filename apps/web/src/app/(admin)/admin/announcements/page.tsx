import { AdminShell } from "@/components/admin/admin-shell";
import { prisma } from "@/lib/db";
import { AnnouncementForm } from "./announcement-form";
import { AnnouncementList } from "./announcement-list";

export const dynamic = "force-dynamic";

async function getAnnouncements() {
  return prisma.announcement.findMany({
    include: { author: true },
    orderBy: { createdAt: "desc" },
    take: 30
  });
}

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <AdminShell title="Announcements">
      <div className="grid gap-6 lg:grid-cols-[440px_minmax(0,1fr)]">

        {/* ── Create form ── */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-warm">
          <h2 className="text-lg font-bold text-ink">New announcement</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
            Publish community updates immediately or schedule them for later.
          </p>
          <AnnouncementForm />
        </section>

        {/* ── Announcement list ── */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-warm overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-bold text-ink">Announcement history</h2>
            <p className="mt-0.5 text-sm text-ink-muted">Click the pencil icon on any post to edit or delete it.</p>
          </div>
          <AnnouncementList announcements={announcements} />
        </section>

      </div>
    </AdminShell>
  );
}
