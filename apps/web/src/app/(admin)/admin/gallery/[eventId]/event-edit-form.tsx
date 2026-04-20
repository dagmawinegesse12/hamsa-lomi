"use client";

import { useState } from "react";
type GalleryEvent = { id: string; title: string; titleAm: string | null; date: Date; location: string | null; isPublic: boolean };
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateGalleryEvent, deleteGalleryEvent } from "../actions";

export function EventEditForm({ event }: { event: GalleryEvent }) {
  const [pending, setPending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      const fd = new FormData(e.currentTarget);
      fd.set("id", event.id);
      await updateGalleryEvent(fd);
    } finally {
      setPending(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    const fd = new FormData();
    fd.set("id", event.id);
    await deleteGalleryEvent(fd);
  }

  const dateStr = event.date.toISOString().split("T")[0]!;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1">Event name (English)</label>
        <Input name="title" defaultValue={event.title} required />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1">Event name (Amharic)</label>
        <Input name="titleAm" defaultValue={event.titleAm ?? ""} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1">Date</label>
          <Input name="date" type="date" defaultValue={dateStr} required />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1">Location</label>
          <Input name="location" defaultValue={event.location ?? ""} />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" name="isPublic" defaultChecked={event.isPublic} className="h-4 w-4 rounded border-gray-300 accent-green-700" />
        <span className="text-sm text-ink">Visible on public gallery</span>
      </label>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving…" : "Save changes"}
      </Button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="w-full rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        {deleting ? "Deleting…" : confirmDelete ? "Confirm — delete this event and all photos" : "Delete event album"}
      </button>
      {confirmDelete && !deleting && (
        <button type="button" onClick={() => setConfirmDelete(false)} className="w-full text-xs text-ink-muted hover:underline">
          Cancel
        </button>
      )}
    </form>
  );
}
