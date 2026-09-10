// Deterministic renderer for structured SEO records.
// The agent supplies the researched substance. This module only shapes data.

import {
  BlogContentContract,
  BlogCategory,
  ContentSource,
  validateBlogContract,
} from "@/lib/blog-contract";

export interface BlogTemplateInput {
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  tags: string[];
  author: string;
  readingTime: number;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  content: string;
  productBridge: {
    text: string;
    href: string;
  };
  relatedSlugs?: string[];
  sources: ContentSource[];
  reviewStatus: BlogContentContract["reviewStatus"];
  lastReviewed?: string;
  reviewer?: string;
}

export function renderBlogPost(input: BlogTemplateInput): BlogContentContract {
  const today = new Date().toISOString().split("T")[0];
  return {
    slug: input.slug,
    title: input.title,
    description: input.description,
    content: input.content,
    category: input.category,
    tags: input.tags,
    publishedAt: today,
    author: input.author,
    readingTime: input.readingTime,
    image: `/blog/${input.slug}.png`,
    seo: input.seo,
    reviewStatus: input.reviewStatus,
    sources: input.sources,
    lastReviewed: input.lastReviewed,
    reviewer: input.reviewer,
    relatedSlugs: input.relatedSlugs,
    contextualCTA: input.productBridge,
  };
}

export const validateRenderedPost = validateBlogContract;
