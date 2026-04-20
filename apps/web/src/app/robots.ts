import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hamsalomi.org";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/benefits", "/bylaws", "/contact", "/membership", "/apply"],
        disallow: ["/admin/", "/dashboard/", "/profile/", "/payments/", "/claims/", "/notifications/", "/sign-in"]
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
