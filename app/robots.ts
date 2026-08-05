import { MetadataRoute } from "next";
import { intentRegistry } from "@/lib/seo/intent-registry";
import { blogPosts } from "@/lib/blog";

const SITE_URL = "https://soapcraft-pro.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/recipes/",
          "/batches/",
          "/dashboard/",
          "/subscription/",
          "/blog/[slug]",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
