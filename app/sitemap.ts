import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://www.datajagers.nl/", changeFrequency: "monthly", priority: 1.0 },
    { url: "https://www.datajagers.nl/contact", changeFrequency: "yearly", priority: 0.8 },
  ];
}
