import type { MetadataRoute } from "next";
import { getPublishedCases } from "@/lib/api";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cases = await getPublishedCases();
  const staticRoutes = ["", "/mapa"].map((path) => ({
    url: `${siteConfig.siteUrl}${path}`,
    lastModified: new Date(),
  }));

  return [
    ...staticRoutes,
    ...cases.map((item) => ({
      url: `${siteConfig.siteUrl}/casos/${item.slug}`,
      lastModified: new Date(),
    })),
  ];
}
