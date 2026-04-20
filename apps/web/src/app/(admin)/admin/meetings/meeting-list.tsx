"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2, ChevronUp, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateMeeting, deleteMeeting } from "./actions";

const TYPE_LABELS: Record<string, string> = {
  BOARD:     "Board Meeting",
  EMERGENCY: "Emergency Meeting",
  GENERAL:   "General Assembly",
};

type Meeting = {
  id: string;
  type: string;
  date: Date;
  agenda: string;
  isPublic: boolean;
  publishedAt: Date | null;
};

function formatLocalDatetime(date: Date): string {
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function getPublishLabel(meeting: Meeting) {
  if (!meeting.isPublic) return { text: "Private", cls: "bg-gray-100 text-gray-600" };
  if (!meeting.publishedAt || meeting.publishedAt <= new Date())
    return { text: "Public now", cls: "bg-green-50 text-green-800" };
  return { text: "Scheduled", cls: "bg-gold-50 text-gold-800" };
}

function MeetingItem({ meeting }: { meeting: Meeting }) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  const publishInfo = getPublishLabel(meeting);

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await updateMeeting(fd);
      setEditing(false);
    });
  }

  function handleDelete() {
    const fd = new FormData();
    fd.set("id", meeting.id);
    startTransition(async () => {
      await deleteMeeting(fd);
    });
  }

  return (
    <article className="border-b border-gray-100 last:border-0">
      {/* ── View mode ── */}
      {!editing && (
        <div className="px-6 py-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50">
                <Calendar className="h-4 w-4 text-green-700" />
              </div>
              <div>
                <p className="text-sm font-bold text-ink">
                  {TYPE_LABELS[meeting.type] ?? meeting.type}
                </p>
                <p className="mt-0.5 text-xs text-ink-muted">
                  {new Date(meeting.date).toLocaleString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                    hour: "numeric", minute: "2-digit"
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${publishInfo.cls}`}>
                {publishInfo.text}
              </span>
              <button
                onClick={() => setEditing(true)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted hover:bg-green-50 hover:text-green-700 transition-colors"
                aria-label="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              {confirming ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-red-600 font-medium">Delete?</span>
                  <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="rounded px-2 py-0.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setConfirming(false)}
                    className="rounded px-2 py-0.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirming(true)}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted hover:bg-red-50 hover:text-red-600 transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{meeting.agenda}</p>
        </div>
      )}

      {/* ── Edit mode ── */}
      {editing && (
        <form onSubmit={handleSave} className="px-6 py-5 bg-green-50/40 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-bold text-ink">Edit meeting</p>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="flex items-center gap-1 text-xs text-ink-muted hover:text-ink"
            >
              <ChevronUp className="h-3.5 w-3.5" /> Cancel
            </button>
          </div>

          <input type="hidden" name="id" value={meeting.id} />

          {/* Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1">
              Meeting type
            </label>
            <select
              name="type"
              defaultValue={meeting.type}
              required
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-ink focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="GENERAL">General assembly</option>
              <option value="BOARD">Board meeting</option>
              <option value="EMERGENCY">Emergency meeting</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1">
              Date & time
            </label>
            <Input
              name="date"
              type="datetime-local"
              required
              defaultValue={formatLocalDatetime(meeting.date)}
            />
          </div>

          {/* Agenda */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1">
              Agenda
            </label>
            <textarea
              name="agenda"
              required
              rows={3}
              defaultValue={meeting.agenda}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-ink focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Public toggle */}
          <label className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 text-sm cursor-pointer">
            <input
              className="mt-0.5"
              name="isPublic"
              type="checkbox"
              defaultChecked={meeting.isPublic}
            />
            <span className="font-semibold text-ink">Post on homepage</span>
          </label>

          {/* Scheduled date */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1">
              Homepage post date <span className="normal-case font-normal">(blank = now)</span>
            </label>
            <Input
              name="publishedAt"
              type="datetime-local"
              defaultValue={meeting.publishedAt ? formatLocalDatetime(meeting.publishedAt) : ""}
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? "Saving…" : "Save changes"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </article>
  );
}

export function MeetingList({ meetings }: { meetings: Meeting[] }) {
  if (meetings.length === 0) {
    return (
      <p className="px-6 py-10 text-sm text-ink-muted text-center">No meetings yet.</p>
    );
  }

  return (
    <div>
      {meetings.map((m) => (
        <MeetingItem key={m.id} meeting={m} />
      ))}
    </div>
  );
}
