import type { Metadata } from "next";
import { getCanonicalRoute } from "@/lib/routing/canonical-routes";
import { pageMetadata } from "./metadata";
import { SITE_URL } from "./site-url";

type ToolSeoEntry = {
  slug: string;
  title: string;
  description: string;
};

type StructuredData = Record<string, unknown>;

// This registry is deliberately separate from calculator implementation. It keeps the
// indexable promise, canonical URL, and schema output aligned for all public tools.
export const toolSeoEntries: readonly ToolSeoEntry[] = [
  { slug: "formulation", title: "Soap Formulation Safety Status | SoapCraft Pro", description: "Review the current verification status for SoapCraft Pro's formulation calculator and why live formulation quantities remain safety-gated." },
  { slug: "mold-volume", title: "Soap Mold Volume Calculator | SoapCraft Pro", description: "Calculate rectangular and cylindrical soap mold capacity, planned fill volume, and fresh batter mass." },
  { slug: "recipe-scaling", title: "Soap Recipe Scaling Calculator | SoapCraft Pro", description: "Scale a soap recipe to a new batch size while keeping every ingredient on an explicit basis." },
  { slug: "batch-cost", title: "Soap Batch Cost Calculator | SoapCraft Pro", description: "Calculate soap batch cost, cost per saleable bar, and a price from either gross margin or markup." },
  { slug: "wholesale-pricing", title: "Soap Wholesale Pricing Calculator | SoapCraft Pro", description: "Compare wholesale and retail pricing from a known soap unit cost." },
  { slug: "craft-fair-break-even", title: "Craft Fair Break-Even Calculator for Soap Makers | SoapCraft Pro", description: "Calculate the number of soap bars needed to cover craft-fair costs before you commit to a show." },
  { slug: "ready-by-planner", title: "Soap Ready-By Planner | SoapCraft Pro", description: "Plan a soap production date backward from a ready-by date, cure interval, and buffer." },
  { slug: "ingredient-purchase-planner", title: "Soap Ingredient Purchase Planner | SoapCraft Pro", description: "Calculate ingredient shortages and the pack quantities needed for a planned soap batch." },
] as const;

function entryFor(slug: string): ToolSeoEntry {
  const entry = toolSeoEntries.find((candidate) => candidate.slug === slug);
  if (!entry) throw new Error(`Missing SEO entry for tool: ${slug}`);
  return entry;
}

export function getToolMetadata(slug: string): Metadata {
  const route = getCanonicalRoute(slug);
  if (!route) throw new Error(`Unknown canonical tool: ${slug}`);
  const entry = entryFor(slug);
  return pageMetadata({ title: entry.title, description: entry.description, path: route.path });
}

export function getToolStructuredData(slug: string): StructuredData[] {
  const route = getCanonicalRoute(slug);
  if (!route) throw new Error(`Unknown canonical tool: ${slug}`);
  const entry = entryFor(slug);
  const url = `${SITE_URL}${route.path}`;

  const page: StructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name: entry.title,
    description: entry.description,
    url,
    isPartOf: { "@id": `${SITE_URL}#website` },
  };
  const breadcrumb: StructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
      { "@type": "ListItem", position: 3, name: route.title, item: url },
    ],
  };

  if (route.isGated) return [page, breadcrumb];

  return [
    page,
    breadcrumb,
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: route.title,
      description: entry.description,
      url,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ];
}
