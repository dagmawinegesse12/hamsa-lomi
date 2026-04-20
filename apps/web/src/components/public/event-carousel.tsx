"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

type Props = {
  photos: string[];
  eventName: string;
};

export function EventCarousel({ photos, eventName }: Props) {
  const autoplay = Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", skipSnaps: false },
    [autoplay]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") setLightboxIndex((i) => i === null ? null : (i + 1) % photos.length);
      if (e.key === "ArrowLeft") setLightboxIndex((i) => i === null ? null : (i - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, photos.length]);

  return (
    <>
      {/* ── Carousel ── */}
      <div className="relative group/carousel">
        <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {photos.map((src, i) => (
              <div
                key={i}
                className="relative min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 lg:basis-1/3 pl-3 first:pl-0"
              >
                <div
                  className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 shadow-warm-md cursor-zoom-in"
                  onClick={() => setLightboxIndex(i)}
                >
                  <Image
                    src={src}
                    alt={`${eventName} — photo ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Hover overlay hint */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors duration-200">
                    <ZoomIn className="h-8 w-8 text-white opacity-0 hover:opacity-100 drop-shadow transition-opacity duration-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prev */}
        <button
          onClick={scrollPrev}
          aria-label="Previous photo"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10
            flex h-10 w-10 items-center justify-center rounded-full
            bg-white/90 shadow-warm-md backdrop-blur-sm text-ink
            transition-all duration-200 hover:bg-white hover:shadow-warm
            opacity-0 group-hover/carousel:opacity-100 focus:opacity-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Next */}
        <button
          onClick={scrollNext}
          aria-label="Next photo"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10
            flex h-10 w-10 items-center justify-center rounded-full
            bg-white/90 shadow-warm-md backdrop-blur-sm text-ink
            transition-all duration-200 hover:bg-white hover:shadow-warm
            opacity-0 group-hover/carousel:opacity-100 focus:opacity-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots + counter */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="flex gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Go to photo ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === selectedIndex ? "w-6 bg-green-700" : "w-1.5 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-ink-muted tabular-nums">{selectedIndex + 1} / {photos.length}</p>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Image */}
          <div
            className="relative max-h-[90vh] max-w-[90vw] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full max-w-5xl max-h-[85vh]">
              <Image
                src={photos[lightboxIndex]!}
                alt={`${eventName} — photo ${lightboxIndex + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>
          </div>

          {/* Close */}
          <button
            onClick={() => setLightboxIndex(null)}
            aria-label="Close"
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length); }}
            aria-label="Previous"
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % photos.length); }}
            aria-label="Next"
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Counter */}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70 tabular-nums">
            {lightboxIndex + 1} / {photos.length}
          </p>
        </div>
      )}
    </>
  );
}
