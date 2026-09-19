import { describe, expect, it } from "vitest";
import { filterPublishedPosts, getAllBlogSlugsFrom, getBlogPostFrom, type BlogPost } from "./blog";
import { validateBlogContract } from "./blog-contract";
import { serializeJsonLd } from "./seo/json-ld";

const post: BlogPost = {
  slug: "published-post", title: "A real costing decision", description: "A reproducible costing example.", content: "Specific worked reasoning. ".repeat(1500),
  category: "Soap Business", tags: ["soap costing", "saleable bars"], publishedAt: "2026-09-19", author: "writer", readingTime: 10, image: "/blog/example.jpg",
  seo: { title: "Costing decision", description: "A decision model.", keywords: ["soap costing"] }, reviewStatus: "published", riskClass: "GREEN", articleFamily: "commercial-operations", reviewer: "reviewer", lastReviewed: "2026-09-19",
  contextualCTA: { text: "Calculate batch cost", href: "/tools/batch-cost" },
  sources: [{ id: "product-fixture", title: "Fixture", publisher: "SoapCraft Pro", tier: "product", url: "https://soapcraftpro.com/methodology", accessedAt: "2026-09-19" }, { id: "primary-record", title: "Record", publisher: "Authority", tier: "primary", url: "https://example.org/record", accessedAt: "2026-09-19" }],
  claims: [{ id: "cost-model", text: "Costs require explicit inputs.", sourceIds: ["product-fixture", "primary-record"], consequential: true, status: "supported" }],
  editorialBrief: { readerSituation: "A seller knows ingredients but not saleable-bar cost.", decision: "Set price from full-batch assumptions.", primaryQuestion: "How should I price handmade soap?", tension: "A multiplier hides costs.", primaryIntent: "price handmade soap by cost per bar", originalValue: "Reproducible decision model.", limitations: "Illustrative inputs only." },
  reviewManifest: { claimAudit: "pass", contradictionAudit: "pass", utilityAudit: "pass", copyAudit: "pass", seoAudit: "pass", conversionAudit: "pass", renderedQa: "pass" },
};
const draft: BlogPost = { ...post, slug: "draft-post", reviewStatus: "draft" };
const invalid: BlogPost = { ...post, slug: "invalid-post", sources: [] };

describe("blog publication contract", () => {
  it("exposes only contract-valid published posts", () => {
    expect(filterPublishedPosts([draft, invalid, post]).map((item) => item.slug)).toEqual(["published-post"]);
    expect(getAllBlogSlugsFrom([draft, invalid, post])).toEqual(["published-post"]);
    expect(getBlogPostFrom([draft, invalid, post], "draft-post")).toBeUndefined();
  });
  it("accepts an independently-reviewed GREEN record and rejects short copy", () => {
    expect(validateBlogContract(post).valid).toBe(true);
    expect(validateBlogContract({ ...post, content: "Too short" }).valid).toBe(false);
  });
  it("does not permit authored JSON-LD to terminate the script", () => {
    expect(serializeJsonLd({ title: "</script><script>alert('xss')</script>" })).not.toContain("<");
  });
});
