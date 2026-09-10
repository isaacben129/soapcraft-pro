/**
 * JSON-LD Structured Data Schemas for SoapCraft Pro
 * Implements UTIL-007 acceptance: Organization, Blog, Article, FAQ
 */

import { SITE_URL } from "./site-url";

// ── Organization Schema ──────────────────────────────────────────────

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SoapCraft Pro",
    url: SITE_URL,
    description:
      "Deterministic lye calculations, guided batch production, cure tracking, and cost-per-bar analysis for serious soap makers.",
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/images/logo.png`,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["en"],
    },
    sameAs: [],
  };
}

// ── WebSite Schema ───────────────────────────────────────────────────

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SoapCraft Pro",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

// ── Blog Schema ──────────────────────────────────────────────────────

export function blogSchema(postsCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "SoapCraft Pro Blog",
    url: `${SITE_URL}/blog`,
    description:
      "Programmatic SEO articles for soap makers: calculators, recipes, guides, and troubleshooting.",
    blogPost: postsCount,
  };
}

// ── Article Schema ───────────────────────────────────────────────────

export function articleSchema(params: {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  author: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.title,
    description: params.description,
    url: `${SITE_URL}${params.path}`,
    datePublished: params.publishedAt,
    author: {
      "@type": "Person",
      name: params.author,
    },
    ...(params.image
      ? { image: `${SITE_URL}${params.image}` }
      : {}),
    publisher: organizationSchema(),
  };
}

// ── BreadcrumbList Schema ────────────────────────────────────────────

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ── FAQ Schema ───────────────────────────────────────────────────────

export function faqSchema(questions: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

// ── Helper: build inline JSON-LD script content ──────────────────────

export function jsonLdScript(data: unknown): string {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}
