"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createAnnouncement } from "./actions";

export function AnnouncementForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setPreview(null);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createAnnouncement(formData);
    } finally {
      setPending(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-4">
      {/* Type */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">
          Type
        </label>
        <select
          name="announcementType"
          defaultValue="GENERAL"
          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-ink focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        >
          <option value="GENERAL">General</option>
          <option value="DEATH_NOTICE">Death Notice</option>
          <option value="EVENT">Event</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      {/* Title */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">
          Title
        </label>
        <Input name="title" required placeholder="Announcement title" />
      </div>

      {/* Body */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">
          Message
        </label>
        <textarea
          name="body"
          required
          rows={4}
          placeholder="Write your announcement here…"
          className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-ink placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
      </div>

      {/* Image upload */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">
          Photo <span className="normal-case font-normal text-ink-muted">(optional)</span>
        </label>

        {/* Hidden real file input */}
        <input
          ref={fileInputRef}
          name="image"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
        />

        {preview ? (
          /* Preview state */
          <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            <div className="relative h-40 w-full">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
                sizes="400px"
              />
            </div>
            <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 bg-white">
              <span className="text-xs text-ink-muted truncate max-w-[200px]">{fileName}</span>
              <button
                type="button"
                onClick={clearImage}
                className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium"
              >
                <X className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          </div>
        ) : (
          /* Upload trigger */
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center hover:border-green-400 hover:bg-green-50 transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <ImagePlus className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Browse your device</p>
              <p className="mt-0.5 text-xs text-ink-muted">PNG, JPG, or WEBP — max 5 MB</p>
            </div>
          </button>
        )}
      </div>

      {/* Public toggle */}
      <label className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors">
        <input className="mt-0.5" name="isPublic" type="checkbox" />
        <span>
          <span className="block font-semibold text-ink">Post on homepage</span>
          <span className="text-ink-muted">Make this announcement visible to all visitors.</span>
        </span>
      </label>

      {/* Scheduled date */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">
          Scheduled date <span className="normal-case font-normal">(leave blank to publish now)</span>
        </label>
        <Input name="publishedAt" type="datetime-local" />
      </div>

      <Button className="w-full" type="submit" disabled={pending}>
        {pending ? "Posting…" : "Post announcement"}
      </Button>
    </form>
  );
}
