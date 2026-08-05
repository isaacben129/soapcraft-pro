import { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";
import { getPublishedEntries } from "@/lib/seo/intent-registry";

const SITE_URL = "https://soapcraft-pro.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publishedEntries = getPublishedEntries();
  const blogSlugs = blogPosts.map((post) => post.slug);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date() },
    { url: `${SITE_URL}/marketing/pricing`, lastModified: new Date() },
    { url: `${SITE_URL}/marketing/blog`, lastModified: new Date() },
    { url: `${SITE_URL}/blog`, lastModified: new Date() },
    { url: `${SITE_URL}/calculators/soap-cost-calculator`, lastModified: new Date() },
    { url: `${SITE_URL}/compare/soapcalc-alternative`, lastModified: new Date() },
    { url: `${SITE_URL}/soap-recipe-management-software`, lastModified: new Date() },
    { url: `${SITE_URL}/soap-batch-tracking-software`, lastModified: new Date() },
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
