import { describe, expect, it } from "vitest";
import {
  filterPublishedPosts,
  getAllBlogSlugsFrom,
  getBlogPostFrom,
  type BlogPost,
} from "./blog";
import { validateBlogContract } from "./blog-contract";
import { serializeJsonLd } from "./seo/json-ld";

const basePost: BlogPost = {
  slug: "published-post",
  title: "Published post",
  description: "Description",
  content: "Content",
  category: "Soap Making Guides",
  tags: ["soap"],
  publishedAt: "2026-08-11",
  author: "SoapCraft Pro",
  readingTime: 8,
  image: "/blog/example.jpg",
  seo: {
    title: "Published post",
    description: "Description",
    keywords: ["soap"],
  },
  reviewStatus: "published",
};

const draftPost: BlogPost = {
  ...basePost,
  slug: "draft-post",
  title: "Draft post",
  reviewStatus: "draft",
};

const posts = [draftPost, basePost];

describe("published blog visibility", () => {
  it("filters drafts from public collections", () => {
    expect(filterPublishedPosts(posts).map((post) => post.slug)).toEqual([
      "published-post",
    ]);
  });

  it("excludes drafts from static route slugs", () => {
    expect(getAllBlogSlugsFrom(posts)).toEqual(["published-post"]);
  });

  it("does not resolve a draft by slug", () => {
    expect(getBlogPostFrom(posts, "draft-post")).toBeUndefined();
    expect(getBlogPostFrom(posts, "published-post")?.slug).toBe(
      "published-post"
    );
  });
});

describe("safe JSON-LD serialization", () => {
  it("cannot be terminated by an authored script payload", () => {
    const serialized = serializeJsonLd({
      title: "</script><script>alert('xss')</script>",
    });
    expect(serialized).not.toContain("<");
    expect(serialized).toContain("\\u003c/script>");
  });
});

describe("blog publication contract", () => {
  it("blocks short content instead of warning", () => {
    const result = validateBlogContract({ ...basePost, content: "Too short" });
    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.includes("minimum"))).toBe(true);
  });

  it("requires review evidence and sources for approved content", () => {
    const result = validateBlogContract({
      ...basePost,
      reviewStatus: "approved",
      content: "evidence ".repeat(800),
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.includes("reviewer"))).toBe(true);
    expect(result.errors.some((error) => error.includes("source"))).toBe(true);
  });
});
