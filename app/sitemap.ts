import { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";
import { getPublishedEntries } from "@/lib/seo/intent-registry";
import { SITE_URL } from "@/lib/seo/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publishedEntries = getPublishedEntries();
  const blogSlugs = blogPosts.map((post) => post.slug);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date() },
    { url: `${SITE_URL}/blog`, lastModified: new Date() },
    { url: `${SITE_URL}/tools`, lastModified: new Date() },
    { url: `${SITE_URL}/tools/batch-cost`, lastModified: new Date() },
    { url: `${SITE_URL}/tools/recipe-scaling`, lastModified: new Date() },
    { url: `${SITE_URL}/tools/mold-volume`, lastModified: new Date() },
    { url: `${SITE_URL}/tools/craft-fair-break-even`, lastModified: new Date() },
    { url: `${SITE_URL}/methodology`, lastModified: new Date() },
    { url: `${SITE_URL}/safety`, lastModified: new Date() },
    { url: `${SITE_URL}/privacy`, lastModified: new Date() },
    { url: `${SITE_URL}/terms`, lastModified: new Date() },
  ];

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: new Date(),
  }));

  const seoPages: MetadataRoute.Sitemap = publishedEntries.map((entry) => ({
    url: `${SITE_URL}${entry.path}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...blogPages, ...seoPages];
}
