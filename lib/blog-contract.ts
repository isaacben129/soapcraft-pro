// ── Blog Content Contract ──────────────────
// Every blog post must satisfy this contract before publishing.
// Fields marked required must be present and valid.
// Fields marked optional may be omitted but are recommended.

export interface BlogContentContract {
  // Required
  slug: string;
  title: string;
  description: string;
  content: string;
  category: BlogCategory;
  tags: string[];
  publishedAt: string; // ISO 8601 date
  author: string;
  readingTime: number; // minutes

  // Required for SEO
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };

  // Required for editorial quality
  reviewStatus: "draft" | "review" | "approved" | "published";
  source?: string; // URL or reference for any factual claim
  sourceRevision?: string; // version/date of the source
  lastReviewed?: string; // ISO 8601 date of last editorial review
  reviewer?: string; // name of the person who approved

  // Optional but recommended
  image?: string;
  imageAlt?: string;
  relatedSlugs?: string[];
  contextualCTA?: {
    text: string;
    href: string;
  };
}

export type BlogCategory =
  | "Soap Calculators"
  | "Soap Recipes"
  | "Soap Making Guides"
  | "Troubleshooting"
  | "Soap Business"
  | "Ingredients";

export const VALID_CATEGORIES: BlogCategory[] = [
  "Soap Calculators",
  "Soap Recipes",
  "Soap Making Guides",
  "Troubleshooting",
  "Soap Business",
  "Ingredients",
];

export const BANNED_PHRASES = ["map pin", "I run Web Align", "Googling"];

export const BANNED_PATTERNS = [
  /—/, // em dash
  /in today's world/i,
  /it's not just \w+, it's \w+/i,
  /hope this finds you well/i,
  /i am an AI/i,
  /as an AI language model/i,
];

export function validateBlogContract(post: Partial<BlogContentContract>): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!post.slug) errors.push("Missing slug");
  if (!post.title) errors.push("Missing title");
  if (!post.description) errors.push("Missing description");
  if (!post.content) errors.push("Missing content");
  if (!post.category) errors.push("Missing category");
  if (!post.tags || post.tags.length === 0) errors.push("Missing tags");
  if (!post.publishedAt) errors.push("Missing publishedAt");
  if (!post.author) errors.push("Missing author");
  if (post.readingTime == null) errors.push("Missing readingTime");

  // SEO required fields
  if (!post.seo?.title) errors.push("Missing seo.title");
  if (!post.seo?.description) errors.push("Missing seo.description");
  if (!post.seo?.keywords || post.seo.keywords.length === 0) {
    errors.push("Missing seo.keywords");
  }

  // Review status
  if (!post.reviewStatus) errors.push("Missing reviewStatus");
  if (post.reviewStatus === "published" && !post.lastReviewed) {
    warnings.push("Published post should have a lastReviewed date");
  }

  // Content quality
  if (post.content) {
    const wordCount = post.content.split(/\s+/).length;
    if (wordCount < 800) {
      warnings.push(`Content is ${wordCount} words — minimum 800 recommended`);
    }

    for (const phrase of BANNED_PHRASES) {
      if (post.content.toLowerCase().includes(phrase.toLowerCase())) {
        errors.push(`Contains banned phrase: "${phrase}"`);
      }
    }

    for (const pattern of BANNED_PATTERNS) {
      if (pattern.test(post.content)) {
        errors.push(`Contains banned pattern: ${pattern}`);
      }
    }
  }

  // Category validation
  if (post.category && !VALID_CATEGORIES.includes(post.category as BlogCategory)) {
    errors.push(
      `Invalid category "${post.category}". Must be one of: ${VALID_CATEGORIES.join(", ")}`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
