import { getRequestConfig } from "next-intl/server";

const supportedLocales = ["en", "am"] as const;

function normalizeLocale(locale: string | undefined) {
  return supportedLocales.includes(locale as (typeof supportedLocales)[number]) ? locale : "en";
}

export default getRequestConfig(async ({ locale }) => {
  const normalizedLocale = normalizeLocale(locale);
  return {
    locale: normalizedLocale,
    messages: (await import(`../../messages/${normalizedLocale}.json`)).default
  };
});
