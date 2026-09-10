import blogData from "./blog-data.json";

export interface ContentSource {
  title: string;
  url: string;
  accessedAt: string;
}

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
  reviewStatus: "draft" | "review" | "approved" | "published";
  source?: string | null;
  sourceRevision?: string | null;
  sources?: ContentSource[];
  lastReviewed?: string;
  reviewer?: string;
  contextualCTA?: {
    text: string;
    href: string;
  };
}

const allBlogPosts: BlogPost[] = blogData as BlogPost[];

export function filterPublishedPosts(posts: BlogPost[]): BlogPost[] {
  return posts.filter((post) => post.reviewStatus === "published");
}

export function getBlogPostFrom(
  posts: BlogPost[],
  slug: string
): BlogPost | undefined {
  return filterPublishedPosts(posts).find((post) => post.slug === slug);
}

export function getAllBlogSlugsFrom(posts: BlogPost[]): string[] {
  return filterPublishedPosts(posts).map((post) => post.slug);
}

// Public consumers receive published records only. Draft and review records may live
// in the content store without becoming routable or indexable.
export const blogPosts: BlogPost[] = filterPublishedPosts(allBlogPosts);

export function getBlogPost(slug: string): BlogPost | undefined {
  return getBlogPostFrom(allBlogPosts, slug);
}

export function getAllBlogSlugs(): string[] {
  return getAllBlogSlugsFrom(allBlogPosts);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((post) => post.category === category);
}

export function getPublishedPosts(): BlogPost[] {
  return blogPosts;
}

export function getRelatedPosts(
  currentSlug: string,
  limit: number = 3
): BlogPost[] {
  const current = getBlogPost(currentSlug);
  if (!current) return blogPosts.slice(0, limit);

  const currentTags = new Set(current.tags);
  return blogPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => ({
      post,
      score: post.tags.filter((tag) => currentTags.has(tag)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}

export const blogCategories = [
  "Soap Calculators",
  "Soap Recipes",
  "Soap Making Guides",
  "Troubleshooting",
  "Soap Business",
  "Ingredients",
  "Production",
  "Safety",
  "Formulation",
];
