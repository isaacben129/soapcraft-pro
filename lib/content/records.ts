// ── Curated Records for Programmatic Blog Posts ──────────
// These are the data sources that drive the blog content production pipeline.
// Each record has a unique slug, a situation framing, and follow-up advice.
// The template renders the structure; the agent provides the editorial content.
// Records should be curated or reviewed independently of the template.

import { BlogCategory } from "@/lib/blog-contract";

export interface BlogRecord {
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  tags: string[];
  // The primary search query this page targets
  primaryKeyword: string;
  // The intent stage this page serves
  intentStage: "product" | "problem" | "informational" | "commercial";
  // The SoapCraft Pro feature this page bridges to
  productPage: string;
  // Source of the record (forum thread, Search Console query, competitor gap)
  source: string;
  // Recurrence count (how many times this topic appeared in research)
  recurrence: number;
  // Whether this record has been reviewed and approved for content production
  approved: boolean;
}

// ── Forum-derived records ────────────────────
// Topics extracted from recurring SoapMakingForum and Reddit questions.

export const forumRecords: BlogRecord[] = [
  {
    slug: "why-does-my-soap-separate",
    title: "Why Does My Soap Separate — and How to Fix It",
    description:
      "Soap separation is one of the most common soapmaking problems. This guide explains the causes, how to diagnose the specific type of separation, and the exact steps to prevent it in future batches.",
    category: "Troubleshooting",
    tags: ["troubleshooting", "soap separation", "cold process", "safety"],
    primaryKeyword: "why does my soap separate",
    intentStage: "problem",
    productPage: "/batches/[id]",
    source: "SoapMakingForum recurring thread",
    recurrence: 12,
    approved: false,
  },
  {
    slug: "soap-lye-discrepancy-between-calculators",
    title: "Lye Calculator Discrepancies — Why Results Differ",
    description:
      "Different lye calculators produce different results for the same recipe. This guide explains why, which calculator to trust, and how to verify your lye amount before mixing.",
    category: "Soap Calculators",
    tags: ["lye calculator", "safety", "troubleshooting", "calculation"],
    primaryKeyword: "lye calculator discrepancies",
    intentStage: "problem",
    productPage: "/calculators/lye-calculator",
    source: "SoapMakingForum recurring thread",
    recurrence: 8,
    approved: false,
  },
  {
    slug: "how-to-price-soap-for-sale",
    title: "How to Price Handmade Soap for Sale — A Cost-Per-Bar Guide",
    description:
      "Pricing soap for sale is harder than it looks. This guide walks through ingredient cost, yield, packaging, time, and target margin to arrive at a defensible selling price per bar.",
    category: "Soap Business",
    tags: ["pricing", "soap business", "cost per bar", "selling soap"],
    primaryKeyword: "how to price handmade soap",
    intentStage: "commercial",
    productPage: "/calculators/soap-cost-calculator",
    source: "Reddit r/soapmaking and SoapMakingForum",
    recurrence: 15,
    approved: false,
  },
  {
    slug: "soap-cure-time-how-long-to-wait",
    title: "How Long to Cure Soap — and What Happens If You Use It Early",
    description:
      "Cure time affects bar hardness, lather quality, and safety. This guide explains the science behind curing, what to expect at each stage, and how to tell when a bar is ready to use.",
    category: "Soap Making Guides",
    tags: ["cure time", "curing", "cold process", "beginner"],
    primaryKeyword: "how long to cure soap",
    intentStage: "informational",
    productPage: "/batches/[id]",
    source: "SoapMakingForum recurring thread",
    recurrence: 10,
    approved: false,
  },
  {
    slug: "best-oils-for-dry-skin-soap",
    title: "Best Oils for Dry-Skin Soap — A Formulation Guide",
    description:
      "Not all oils are equal in cold-process soap. This guide compares the most common oils for dry-skin formulations, explains their SAP values and lather characteristics, and warns against overuse of drying oils.",
    category: "Ingredients",
    tags: ["oils", "formulation", "dry skin", "SAP values"],
    primaryKeyword: "best oils for dry skin soap",
    intentStage: "informational",
    productPage: "/ingredients/coconut-oil",
    source: "SoapMakingForum and Reddit r/soapmaking",
    recurrence: 7,
    approved: false,
  },
  {
    slug: "soap-batch-record-template",
    title: "Soap Batch Record Template — What to Track for Every Batch",
    description:
      "A batch record captures everything that happened during a soapmaking session. This guide provides a template and explains why tracking planned vs actual measurements makes the next batch better.",
    category: "Soap Making Guides",
    tags: ["batch record", "tracking", "documentation", "production"],
    primaryKeyword: "soap batch record template",
    intentStage: "informational",
    productPage: "/soap-batch-tracking-software",
    source: "SoapMakingForum recurring thread",
    recurrence: 6,
    approved: false,
  },
  {
    slug: "soapmaking-for-beginners-complete-guide",
    title: "Soapmaking for Beginners — The Complete Guide",
    description:
      "Everything a new soapmaker needs to know: equipment, ingredients, safety, lye calculations, trace, mold, cure, and troubleshooting. This guide connects each step to the SoapCraft Pro workflow.",
    category: "Soap Making Guides",
    tags: ["beginner", "soapmaking", "cold process", "safety", "getting started"],
    primaryKeyword: "soapmaking for beginners",
    intentStage: "informational",
    productPage: "/soap-recipe-management-software",
    source: "Reddit r/soapmaking and SoapMakingForum",
    recurrence: 20,
    approved: false,
  },
  {
    slug: "how-to-calculate-soap-yield",
    title: "How to Calculate Soap Yield — From Recipe to Finished Bars",
    description:
      "Yield is the number of bars you actually get from a batch. This guide explains how to calculate expected yield, track actual yield, and understand why planned and actual numbers differ.",
    category: "Soap Calculators",
    tags: ["yield", "calculation", "batch", "cost per bar"],
    primaryKeyword: "how to calculate soap yield",
    intentStage: "problem",
    productPage: "/calculators/soap-cost-calculator",
    source: "SoapMakingForum recurring thread",
    recurrence: 5,
    approved: false,
  },
];

// ── Search Console-derived records ───────────
// Topics from high-impression, low-CTR queries in Search Console.
// These should be populated from actual Search Console data.

export const searchConsoleRecords: BlogRecord[] = [
  // Placeholder — populated by seo-audit.sh from Search Console data
  // Each record follows the same structure as forumRecords
];

// ── Competitor gap records ───────────────────
// Topics that competitors rank for but SoapCraft Pro could serve better.
// These should be populated from SERP analysis.

export const competitorGapRecords: BlogRecord[] = [
  // Placeholder — populated by the SEO audit process
  // Each record follows the same structure as forumRecords
];

// ── Combined record source ───────────────────

export const allBlogRecords: BlogRecord[] = [
  ...forumRecords,
  ...searchConsoleRecords,
  ...competitorGapRecords,
];

// ── Topic ranking ────────────────────────────
// Rank records by recurrence and product fit.
// Higher scores = higher priority for content production.

export function rankTopics(records: BlogRecord[]): BlogRecord[] {
  return records
    .filter((r) => r.approved === false)
    .sort((a, b) => {
      // Primary sort: recurrence (higher = more demand)
      const recurrenceDiff = b.recurrence - a.recurrence;
      if (recurrenceDiff !== 0) return recurrenceDiff;
      // Secondary sort: intent stage (commercial > problem > informational)
      const stageOrder = { commercial: 0, problem: 1, informational: 2, product: 3 };
      return stageOrder[a.intentStage] - stageOrder[b.intentStage];
    });
}

// ── Get top N topics for content production ──

export function getTopTopics(limit: number = 5): BlogRecord[] {
  return rankTopics(allBlogRecords).slice(0, limit);
}
