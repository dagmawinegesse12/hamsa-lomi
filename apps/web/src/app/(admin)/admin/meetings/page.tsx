import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/db";
import { createMeeting } from "./actions";
import { MeetingList } from "./meeting-list";

export const dynamic = "force-dynamic";

async function getMeetings() {
  return prisma.meeting.findMany({
    orderBy: { date: "desc" },
    take: 30
  });
}

export default async function MeetingsPage() {
  const meetings = await getMeetings();

  return (
    <AdminShell title="Meetings">
      <div className="grid gap-6 lg:grid-cols-[440px_minmax(0,1fr)]">

        {/* ── Create form ── */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-warm">
          <h2 className="text-lg font-bold text-ink">New meeting</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
            Create a board, general, or emergency meeting. Public meetings appear on the homepage.
          </p>
          <form action={createMeeting} className="mt-6 space-y-4">
            {/* Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">
                Meeting type
              </label>
              <select
                name="type"
                required
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-ink focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="GENERAL">General assembly</option>
                <option value="BOARD">Board meeting</option>
                <option value="EMERGENCY">Emergency meeting</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">
                Date & time
              </label>
              <Input name="date" required type="datetime-local" />
            </div>

            {/* Agenda */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">
                Agenda
              </label>
              <textarea
                name="agenda"
                required
                rows={4}
                placeholder="Describe the meeting agenda…"
                className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-ink placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            {/* Public toggle */}
            <label className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm cursor-pointer hover:bg-gray-100 transition-colors">
              <input className="mt-0.5" name="isPublic" type="checkbox" />
              <span>
                <span className="block font-semibold text-ink">Post on homepage</span>
                <span className="text-ink-muted">Visible to members and the public.</span>
              </span>
            </label>

            {/* Scheduled date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">
                Scheduled date <span className="normal-case font-normal">(blank = publish now)</span>
              </label>
              <Input name="publishedAt" type="datetime-local" />
            </div>

            <Button className="w-full" type="submit">Add meeting</Button>
          </form>
        </section>

        {/* ── Meeting list ── */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-warm overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-bold text-ink">Meeting history</h2>
            <p className="mt-0.5 text-sm text-ink-muted">Click the pencil icon to edit or delete any meeting.</p>
          </div>
          <MeetingList meetings={meetings} />
        </section>

      </div>
    </AdminShell>
  );
}
