import type { MetadataRoute } from "next";
import { canonicalRoutes } from "@/lib/routing/canonical-routes";
import { getPublishedEntries } from "@/lib/seo/intent-registry";
import { getPublishedPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/seo/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = new Map<string, MetadataRoute.Sitemap[number]>();
  const add = (path: string, lastModified?: string) => paths.set(path, {
    url: `${SITE_URL}${path}`,
    ...(lastModified ? { lastModified } : {}),
  });
  add("/");
  add("/tools");
  add("/blog");
  add("/methodology");
  for (const route of canonicalRoutes) add(route.path);
  for (const entry of getPublishedEntries()) add(entry.path);
  for (const post of getPublishedPosts()) add(`/blog/${post.slug}`, post.lastReviewed || post.publishedAt);
  return [...paths.values()];
}
