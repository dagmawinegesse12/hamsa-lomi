"use client";

import { useRouter, usePathname } from "next/navigation";
import type { Lang } from "@/lib/i18n/strings";

export function LanguageToggle({ lang }: { lang: Lang }) {
  const router = useRouter();
  const pathname = usePathname();

  function toggle() {
    router.push(lang === "en" ? `${pathname}?lang=am` : pathname);
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 rounded-md border border-gray-300 px-2.5 py-1 text-xs font-semibold text-ink-soft hover:border-green-600 hover:text-green-700 transition-colors"
      title={lang === "en" ? "Switch to Amharic" : "Switch to English"}
    >
      <span className="text-sm leading-none">{lang === "en" ? "🇪🇹" : "🇺🇸"}</span>
      {lang === "en" ? "አማርኛ" : "English"}
    </button>
  );
}
