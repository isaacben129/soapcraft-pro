import blogData from "./blog-data.json";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  publishedAt: string;
  author: string;
  readingTime: number;
  image: string;
  imageAlt?: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  // Editorial quality fields
  reviewStatus: "draft" | "review" | "approved" | "published";
  source?: string;
  sourceRevision?: string;
  lastReviewed?: string;
  reviewer?: string;
}

export const blogPosts: BlogPost[] = blogData as BlogPost[];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((post) => post.category === category);
}

export function getPublishedPosts(): BlogPost[] {
  return blogPosts.filter((post) => post.reviewStatus === "published");
}

// ── Related posts ──────────────────────
// Returns posts that share at least one tag, excluding the current post.

export function getRelatedPosts(
  currentSlug: string,
  limit: number = 3
): BlogPost[] {
  const current = blogPosts.find((p) => p.slug === currentSlug);
  if (!current) return blogPosts.slice(0, limit);

  const currentTags = new Set(current.tags);

  const scored = blogPosts
    .filter((p) => p.slug !== currentSlug)
    .map((post) => {
      const sharedTags = post.tags.filter((t) => currentTags.has(t)).length;
      return { post, score: sharedTags };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.post);
}

export const blogCategories = [
  "Soap Calculators",
  "Soap Recipes",
  "Soap Making Guides",
  "Troubleshooting",
];
