// Runtime contract for evidence-first SoapCraft editorial records.
export type ReviewStatus = "draft" | "review" | "approved" | "published";
export type RiskClass = "GREEN" | "AMBER" | "RED";
export type ArticleFamily = "tool-support" | "diagnostic" | "commercial-operations" | "foundational" | "buying-comparison";
export type SourceTier = "official" | "primary" | "product" | "supplier" | "practitioner" | "community";
export type BlogCategory = "Soap Calculators" | "Soap Recipes" | "Soap Making Guides" | "Troubleshooting" | "Soap Business" | "Ingredients" | "Production" | "Safety" | "Formulation" | "Business";
export interface ContentSource { id: string; title: string; url: string; publisher: string; tier: SourceTier; accessedAt: string; limitations?: string }
export interface EditorialClaim { id: string; text: string; sourceIds: string[]; consequential: boolean; status: "supported" | "unresolved" }
export interface EditorialBrief { readerSituation: string; decision: string; primaryQuestion: string; tension: string; primaryIntent: string; originalValue: string; limitations: string }
export interface ReviewManifest { claimAudit: "pass" | "fail"; contradictionAudit: "pass" | "fail"; utilityAudit: "pass" | "fail"; copyAudit: "pass" | "fail"; seoAudit: "pass" | "fail"; conversionAudit: "pass" | "fail"; renderedQa: "pass" | "fail"; independentEvidenceReview?: "pass" | "fail" }
export interface BlogContentContract {
  slug: string; title: string; description: string; content: string; category: BlogCategory; tags: string[]; publishedAt: string; author: string; readingTime: number;
  seo: { title: string; description: string; keywords: string[] }; reviewStatus: ReviewStatus; riskClass?: RiskClass; articleFamily?: ArticleFamily;
  sources?: ContentSource[]; claims?: EditorialClaim[]; editorialBrief?: EditorialBrief; reviewManifest?: ReviewManifest; lastReviewed?: string; reviewer?: string;
  image?: string; imageAlt?: string; relatedSlugs?: string[]; contextualCTA?: { text: string; href: string };
}
export const VALID_CATEGORIES: BlogCategory[] = ["Soap Calculators", "Soap Recipes", "Soap Making Guides", "Troubleshooting", "Soap Business", "Ingredients", "Production", "Safety", "Formulation", "Business"];
export const DRAFT_MIN_WORD_COUNT = 800;
export const PUBLISHED_MIN_WORD_COUNT = 1500;
const statuses = new Set<ReviewStatus>(["draft", "review", "approved", "published"]);
const riskClasses = new Set<RiskClass>(["GREEN", "AMBER", "RED"]);
const articleFamilies = new Set<ArticleFamily>(["tool-support", "diagnostic", "commercial-operations", "foundational", "buying-comparison"]);
const sourceTiers = new Set<SourceTier>(["official", "primary", "product", "supplier", "practitioner", "community"]);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const bannedPatterns = [/in today's world/i, /it's not just \w+, it's \w+/i, /hope this finds you well/i, /i am an AI/i, /as an AI language model/i, /in conclusion/i, /in the ever-evolving/i];
function record(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function text(value: unknown): value is string { return typeof value === "string" && Boolean(value.trim()); }
function strings(value: unknown, nonempty = false): value is string[] { return Array.isArray(value) && (!nonempty || value.length > 0) && value.every(text); }
function date(value: unknown): boolean { return text(value) && /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value) && !Number.isNaN(Date.parse(value)); }
function source(value: unknown): boolean {
  if (!record(value) || !text(value.id) || !slugPattern.test(value.id) || !text(value.title) || !text(value.publisher) || !date(value.accessedAt) || !text(value.tier) || !sourceTiers.has(value.tier as SourceTier)) return false;
  try { return new URL(String(value.url)).protocol === "https:"; } catch { return false; }
}
function brief(value: unknown): boolean { return record(value) && ["readerSituation", "decision", "primaryQuestion", "tension", "primaryIntent", "originalValue", "limitations"].every((field) => text(value[field])); }
function manifest(value: unknown, risk: unknown): boolean {
  if (!record(value)) return false;
  const required = ["claimAudit", "contradictionAudit", "utilityAudit", "copyAudit", "seoAudit", "conversionAudit", "renderedQa"];
  return required.every((field) => value[field] === "pass") && (risk !== "AMBER" || value.independentEvidenceReview === "pass");
}
export function validateBlogContract(post: unknown): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []; const warnings: string[] = [];
  if (!record(post)) return { valid: false, errors: ["Invalid post: expected an object"], warnings };
  for (const field of ["slug", "title", "description", "content", "category", "publishedAt", "author", "reviewStatus"] as const) if (!text(post[field])) errors.push(`Missing or invalid ${field}`);
  if (text(post.slug) && !slugPattern.test(post.slug)) errors.push("Invalid slug");
  if (!date(post.publishedAt)) errors.push("Invalid publishedAt");
  if (!strings(post.tags, true)) errors.push("Invalid tags");
  if (!Number.isInteger(post.readingTime) || Number(post.readingTime) <= 0) errors.push("Invalid readingTime");
  if (!record(post.seo) || !text(post.seo.title) || !text(post.seo.description) || !strings(post.seo.keywords, true)) errors.push("Invalid seo");
  if (!text(post.reviewStatus) || !statuses.has(post.reviewStatus as ReviewStatus)) errors.push("Invalid reviewStatus");
  if (!text(post.category) || !VALID_CATEGORIES.includes(post.category as BlogCategory)) errors.push("Invalid category");
  if (post.contextualCTA !== undefined && (!record(post.contextualCTA) || !text(post.contextualCTA.text) || !text(post.contextualCTA.href) || !post.contextualCTA.href.startsWith("/") || post.contextualCTA.href.startsWith("//"))) errors.push("Invalid contextualCTA");
  if (post.sources !== undefined && (!Array.isArray(post.sources) || !post.sources.every(source))) errors.push("Invalid sources");
  const publishable = post.reviewStatus === "approved" || post.reviewStatus === "published";
  const words = text(post.content) ? post.content.trim().split(/\s+/).length : 0;
  if (words < (publishable ? PUBLISHED_MIN_WORD_COUNT : DRAFT_MIN_WORD_COUNT)) errors.push(`Content is ${words} words; minimum is ${publishable ? PUBLISHED_MIN_WORD_COUNT : DRAFT_MIN_WORD_COUNT}`);
  if (text(post.content)) for (const pattern of bannedPatterns) if (pattern.test(post.content)) errors.push(`Contains banned pattern: ${pattern}`);
  if (publishable) {
    if (!text(post.riskClass) || !riskClasses.has(post.riskClass as RiskClass)) errors.push("Published content requires riskClass");
    if (!text(post.articleFamily) || !articleFamilies.has(post.articleFamily as ArticleFamily)) errors.push("Published content requires articleFamily");
    if (post.riskClass === "RED") errors.push("RED content cannot enter the AI-only publication lane");
    if (!text(post.reviewer) || post.reviewer === post.author) errors.push("Published content requires an independent reviewer");
    if (!date(post.lastReviewed)) errors.push("Published content requires lastReviewed");
    if (!Array.isArray(post.sources) || post.sources.length < 2) errors.push("Published content requires at least two sources");
    if (!brief(post.editorialBrief)) errors.push("Published content requires editorialBrief");
    if (!manifest(post.reviewManifest, post.riskClass)) errors.push("Published content requires a passing reviewManifest");
    if (!record(post.contextualCTA)) errors.push("Published content requires a contextual CTA");
    if (!Array.isArray(post.claims) || !post.claims.length) errors.push("Published content requires a claim registry");
    else {
      const sourceIds = new Set((post.sources as Array<Record<string, unknown>>).map((item) => item.id));
      for (const claim of post.claims) {
        if (!record(claim) || !text(claim.id) || !text(claim.text) || !strings(claim.sourceIds, true)) errors.push("Invalid claim");
        else if ((claim.sourceIds as string[]).some((id) => !sourceIds.has(id)) || (claim.consequential === true && claim.status !== "supported")) errors.push(`Unsupported claim: ${claim.id}`);
      }
    }
  }
  return { valid: errors.length === 0, errors, warnings };
}
