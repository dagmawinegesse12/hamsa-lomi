"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Pencil, Trash2, ImagePlus, X, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateAnnouncement, deleteAnnouncement } from "./actions";

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  DEATH_NOTICE: { label: "Death Notice", color: "bg-gray-100 text-gray-800 border-gray-300" },
  EVENT:        { label: "Event",        color: "bg-blue-50 text-blue-800 border-blue-200" },
  GENERAL:      { label: "General",      color: "bg-green-50 text-green-800 border-green-200" },
  URGENT:       { label: "Urgent",       color: "bg-red-50 text-red-800 border-red-200" },
};

type Announcement = {
  id: string;
  title: string;
  body: string;
  announcementType: string;
  imageUrl: string | null;
  publishedAt: Date | null;
  author: { name: string | null; email: string };
};

function formatLocalDatetime(date: Date | null): string {
  if (!date) return "";
  // Convert to local datetime-local input format
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function getPublishLabel(publishedAt: Date | null) {
  if (!publishedAt) return { text: "Private", cls: "bg-gray-100 text-gray-600" };
  if (publishedAt <= new Date()) return { text: "Public now", cls: "bg-green-50 text-green-800" };
  return { text: `Scheduled`, cls: "bg-gold-50 text-gold-800" };
}

function AnnouncementItem({ announcement }: { announcement: Announcement }) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const isDeathNotice = announcement.announcementType === "DEATH_NOTICE";
  const typeInfo = TYPE_LABELS[announcement.announcementType] ?? TYPE_LABELS.GENERAL;
  const publishInfo = getPublishLabel(announcement.publishedAt);

  const currentImage = removeImage ? null : (preview ?? announcement.imageUrl);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setRemoveImage(false);
  }

  function handleCancelEdit() {
    setEditing(false);
    setPreview(null);
    setRemoveImage(false);
  }

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (removeImage) fd.set("removeImage", "true");
    startTransition(async () => {
      await updateAnnouncement(fd);
      setEditing(false);
      setPreview(null);
      setRemoveImage(false);
    });
  }

  function handleDelete() {
    const fd = new FormData();
    fd.set("id", announcement.id);
    startTransition(async () => {
      await deleteAnnouncement(fd);
    });
  }

  return (
    <article className="border-b border-gray-100 last:border-0">
      {/* ── View mode ── */}
      {!editing && (
        <div className="px-6 py-5">
          {/* Death notice image */}
          {announcement.imageUrl && isDeathNotice && (
            <div className="mb-4 flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-gray-300">
                <Image alt={announcement.title} className="object-cover" fill sizes="56px" src={announcement.imageUrl} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">In memoriam</p>
                <p className="text-sm font-semibold text-ink">{announcement.title}</p>
              </div>
            </div>
          )}

          {/* Other image */}
          {announcement.imageUrl && !isDeathNotice && (
            <div className="mb-3 relative h-36 w-full overflow-hidden rounded-lg border border-gray-200">
              <Image alt={announcement.title} className="object-cover" fill sizes="600px" src={announcement.imageUrl} />
            </div>
          )}

          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className={`shrink-0 rounded-md border px-2 py-0.5 text-xs font-semibold ${typeInfo.color}`}>
                {typeInfo.label}
              </span>
              <p className="text-sm font-bold text-ink">{announcement.title}</p>
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
          <p className="mt-1 text-xs text-ink-muted">By {announcement.author.name ?? announcement.author.email}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft line-clamp-2">{announcement.body}</p>
        </div>
      )}

      {/* ── Edit mode ── */}
      {editing && (
        <form onSubmit={handleSave} className="px-6 py-5 bg-green-50/40 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-bold text-ink">Edit announcement</p>
            <button type="button" onClick={handleCancelEdit} className="flex items-center gap-1 text-xs text-ink-muted hover:text-ink">
              <ChevronUp className="h-3.5 w-3.5" /> Cancel
            </button>
          </div>

          <input type="hidden" name="id" value={announcement.id} />

          {/* Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1">Type</label>
            <select
              name="announcementType"
              defaultValue={announcement.announcementType}
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-ink focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="GENERAL">General</option>
              <option value="DEATH_NOTICE">Death Notice</option>
              <option value="EVENT">Event</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1">Title</label>
            <Input name="title" required defaultValue={announcement.title} />
          </div>

          {/* Body */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1">Message</label>
            <textarea
              name="body"
              required
              rows={3}
              defaultValue={announcement.body}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-ink focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1">Photo</label>
            <input ref={fileRef} name="image" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
            {currentImage ? (
              <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                <div className="relative h-32 w-full">
                  <Image src={currentImage} alt="Preview" fill className="object-cover" sizes="400px" />
                </div>
                <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 bg-white">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="text-xs font-semibold text-green-700 hover:text-green-800"
                  >
                    Change photo
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRemoveImage(true); setPreview(null); }}
                    className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    <X className="h-3 w-3" /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white px-4 py-5 hover:border-green-400 hover:bg-green-50 transition-colors"
              >
                <ImagePlus className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-ink-muted">Browse your device</span>
              </button>
            )}
          </div>

          {/* Public toggle */}
          <label className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 text-sm cursor-pointer">
            <input
              className="mt-0.5"
              name="isPublic"
              type="checkbox"
              defaultChecked={announcement.publishedAt !== null}
            />
            <span className="font-semibold text-ink">Post on homepage</span>
          </label>

          {/* Scheduled date */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1">
              Scheduled date
            </label>
            <Input
              name="publishedAt"
              type="datetime-local"
              defaultValue={formatLocalDatetime(announcement.publishedAt)}
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? "Saving…" : "Save changes"}
            </Button>
            <Button type="button" variant="secondary" onClick={handleCancelEdit}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </article>
  );
}

export function AnnouncementList({ announcements }: { announcements: Announcement[] }) {
  if (announcements.length === 0) {
    return (
      <p className="px-6 py-10 text-sm text-ink-muted text-center">No announcements yet.</p>
    );
  }

  return (
    <div>
      {announcements.map((a) => (
        <AnnouncementItem key={a.id} announcement={a} />
      ))}
    </div>
  );
}
