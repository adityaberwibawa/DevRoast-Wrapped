/**
 * sitemap.xml — MVP: hanya landing. Halaman /u dibuat user-per-user,
 * biarkan crawler menemukannya lewat share, bukan sitemap.
 */
import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
