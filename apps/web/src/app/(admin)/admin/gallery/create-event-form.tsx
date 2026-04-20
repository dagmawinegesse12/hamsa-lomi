"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createGalleryEvent } from "./actions";

export function CreateEventForm() {
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      await createGalleryEvent(new FormData(e.currentTarget));
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">
          Event name (English) *
        </label>
        <Input name="title" placeholder="e.g. General Assembly Meeting" required />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">
          Event name (Amharic)
        </label>
        <Input name="titleAm" placeholder="e.g. ጠቅላላ ጉባኤ ስብሰባ" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">
            Date *
          </label>
          <Input name="date" type="date" required />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">
            Location
          </label>
          <Input name="location" placeholder="e.g. Nashville, TN" />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" name="isPublic" defaultChecked className="h-4 w-4 rounded border-gray-300 accent-green-700" />
        <span className="text-sm text-ink">Visible on public gallery</span>
      </label>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creating…" : "Create event album →"}
      </Button>
    </form>
  );
}
