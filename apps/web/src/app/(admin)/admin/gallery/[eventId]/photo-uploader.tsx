"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadPhotos } from "../actions";

export function PhotoUploader({ eventId }: { eventId: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [pending, setPending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFiles(Array.from(e.target.files ?? []));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (files.length === 0) return;
    setPending(true);
    try {
      const fd = new FormData();
      fd.set("eventId", eventId);
      files.forEach((f) => fd.append("photos", f));
      await uploadPhotos(fd);
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label
        className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 cursor-pointer transition-colors ${
          files.length > 0 ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-green-400 hover:bg-green-50"
        }`}
      >
        <ImagePlus className={`h-8 w-8 ${files.length > 0 ? "text-green-600" : "text-gray-400"}`} />
        {files.length === 0 ? (
          <span className="text-sm text-ink-muted text-center">Click to select photos<br /><span className="text-xs">or drag and drop</span></span>
        ) : (
          <span className="text-sm font-semibold text-green-700">{files.length} file{files.length !== 1 ? "s" : ""} selected</span>
        )}
        <input
          ref={inputRef}
          type="file"
          name="photos"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleChange}
        />
      </label>

      {files.length > 0 && (
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? (
            <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</span>
          ) : (
            `Upload ${files.length} photo${files.length !== 1 ? "s" : ""}`
          )}
        </Button>
      )}
    </form>
  );
}
