"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
type GalleryPhoto = { id: string; url: string; caption: string | null; sortOrder: number };
import { deletePhoto } from "../actions";

export function PhotoGrid({ photos }: { photos: GalleryPhoto[] }) {
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-ink-muted">No photos yet. Upload some using the panel on the left.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {photos.map((photo) => (
        <div key={photo.id} className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-gray-200 shadow-warm">
          <Image
            src={photo.url}
            alt={photo.caption ?? "Gallery photo"}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Delete overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors">
            <form action={deletePhoto}>
              <input type="hidden" name="id" value={photo.id} />
              <button
                type="submit"
                aria-label="Delete photo"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
