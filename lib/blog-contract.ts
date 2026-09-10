// Deterministic runtime contract for agent-authored SoapCraft Pro blog records.

export type ReviewStatus = "draft" | "review" | "approved" | "published";
export type BlogCategory =
  | "Soap Calculators" | "Soap Recipes" | "Soap Making Guides"
  | "Troubleshooting" | "Soap Business" | "Ingredients";

export interface ContentSource { title: string; url: string; accessedAt: string }
export interface BlogContentContract {
  slug: string; title: string; description: string; content: string;
  category: BlogCategory; tags: string[]; publishedAt: string; author: string;
  readingTime: number;
  seo: { title: string; description: string; keywords: string[] };
  reviewStatus: ReviewStatus;
  source?: string; sourceRevision?: string; sources?: ContentSource[];
  lastReviewed?: string; reviewer?: string; image?: string; imageAlt?: string;
  relatedSlugs?: string[];
  contextualCTA?: { text: string; href: string };
}

export const VALID_CATEGORIES: BlogCategory[] = [
  "Soap Calculators", "Soap Recipes", "Soap Making Guides",
  "Troubleshooting", "Soap Business", "Ingredients",
];
export const BANNED_PHRASES = ["map pin", "I run Web Align", "Googling"];
export const BANNED_PATTERNS = [
  /—/, /in today's world/i, /it's not just \w+, it's \w+/i,
  /hope this finds you well/i, /i am an AI/i, /as an AI language model/i,
];

const MIN_WORD_COUNT = 800;
const STATUSES = new Set(["draft", "review", "approved", "published"]);
const PUBLISHABLE = new Set(["approved", "published"]);
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_PATTERN = /^(\d{4})-(\d{2})-(\d{2})(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})?)?$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function nonemptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
function stringArray(value: unknown, nonempty = false): value is string[] {
  return Array.isArray(value) && (!nonempty || value.length > 0) && value.every(nonemptyString);
}
function validDate(value: unknown): boolean {
  if (!nonemptyString(value)) return false;
  const match = ISO_PATTERN.exec(value);
  if (!match || Number.isNaN(Date.parse(value))) return false;
  const [year, month, day] = match.slice(1, 4).map(Number);
  const check = new Date(Date.UTC(year, month - 1, day));
  return check.getUTCFullYear() === year && check.getUTCMonth() === month - 1 && check.getUTCDate() === day;
}
function validSource(value: unknown): boolean {
  if (!isRecord(value) || !nonemptyString(value.title) || !validDate(value.accessedAt) || !nonemptyString(value.url)) return false;
  try {
    const url = new URL(value.url);
    return (url.protocol === "http:" || url.protocol === "https:") && Boolean(url.hostname);
  } catch { return false; }
}

export function validateBlogContract(post: unknown): {
  valid: boolean; errors: string[]; warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!isRecord(post)) return { valid: false, errors: ["Invalid post: expected an object"], warnings };

  for (const field of ["slug", "title", "description", "content", "category", "publishedAt", "author", "reviewStatus"] as const) {
    if (!(field in post)) errors.push(`Missing required field: ${field}`);
    else if (!nonemptyString(post[field])) errors.push(`Invalid ${field}: expected a non-empty string`);
  }
  if (typeof post.slug === "string" && !SLUG_PATTERN.test(post.slug)) errors.push("Invalid slug: use lowercase letters, numbers, and single hyphens");
  if (post.publishedAt !== undefined && !validDate(post.publishedAt)) errors.push("Invalid publishedAt: expected an ISO 8601 date");
  if (!("tags" in post)) errors.push("Missing required field: tags");
  else if (!stringArray(post.tags, true)) errors.push("Invalid tags: expected a non-empty array of strings");
  if (!("readingTime" in post)) errors.push("Missing required field: readingTime");
  else if (!Number.isInteger(post.readingTime) || (post.readingTime as number) <= 0) errors.push("Invalid readingTime: expected a positive integer");

  if (!("seo" in post)) errors.push("Missing required field: seo");
  else if (!isRecord(post.seo)) errors.push("Invalid seo: expected an object");
  else {
    if (!nonemptyString(post.seo.title)) errors.push("Invalid seo.title: expected a non-empty string");
    if (!nonemptyString(post.seo.description)) errors.push("Invalid seo.description: expected a non-empty string");
    if (!stringArray(post.seo.keywords, true)) errors.push("Invalid seo.keywords: expected a non-empty array of strings");
  }

  if (post.reviewStatus !== undefined && (!nonemptyString(post.reviewStatus) || !STATUSES.has(post.reviewStatus))) errors.push(`Invalid reviewStatus: ${String(post.reviewStatus)}`);
  if (post.category !== undefined && (!nonemptyString(post.category) || !VALID_CATEGORIES.includes(post.category as BlogCategory))) errors.push(`Invalid category "${String(post.category)}"`);

  for (const field of ["source", "sourceRevision", "image", "imageAlt", "reviewer"] as const) {
    if (field in post && post[field] !== undefined && post[field] !== null && !nonemptyString(post[field])) errors.push(`Invalid ${field}: expected a non-empty string`);
  }
  if ("relatedSlugs" in post && !stringArray(post.relatedSlugs)) errors.push("Invalid relatedSlugs: expected an array of strings");
  if ("lastReviewed" in post && post.lastReviewed !== undefined && post.lastReviewed !== null && !validDate(post.lastReviewed)) errors.push("Invalid lastReviewed: expected an ISO 8601 date");

  if (post.sources !== undefined && (!Array.isArray(post.sources) || !post.sources.every(validSource))) errors.push("Every source requires title, http(s) URL, and accessedAt");
  if (post.contextualCTA !== undefined && (!isRecord(post.contextualCTA) || !nonemptyString(post.contextualCTA.text) || !nonemptyString(post.contextualCTA.href))) errors.push("Invalid contextualCTA: require string text and href");

  const publishable = typeof post.reviewStatus === "string" && PUBLISHABLE.has(post.reviewStatus);
  if (publishable) {
    if (!nonemptyString(post.reviewer)) errors.push("Approved or published posts require reviewer");
    if (!validDate(post.lastReviewed)) errors.push("Approved or published posts require valid lastReviewed");
    if (!Array.isArray(post.sources) || post.sources.length === 0) errors.push("Approved or published posts require at least one source");
    if (!isRecord(post.contextualCTA)) errors.push("Approved or published posts require a contextual product bridge");
  }

  const content = post.content;
  if (typeof content === "string" && content.length > 0) {
    const wordCount = content.trim().split(/\s+/).length;
    if (wordCount < MIN_WORD_COUNT) errors.push(`Content is ${wordCount} words; minimum is ${MIN_WORD_COUNT}`);
    for (const phrase of BANNED_PHRASES) if (content.toLowerCase().includes(phrase.toLowerCase())) errors.push(`Contains banned phrase: "${phrase}"`);
    for (const pattern of BANNED_PATTERNS) if (pattern.test(content)) errors.push(`Contains banned pattern: ${pattern}`);
  }
  if (Array.isArray(post.tags) && post.tags.every((tag) => typeof tag === "string") && post.tags.length < 2) warnings.push("Add at least two specific tags");
  return { valid: errors.length === 0, errors, warnings };
}
