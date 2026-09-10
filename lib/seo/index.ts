/**
 * SoapCraft Pro SEO Module
 * Re-exports all SEO utilities for the application.
 */

export { SITE_URL } from "./site-url";
export { pageMetadata, articleMetadata } from "./metadata";
export { serializeJsonLd } from "./json-ld";
export {
  organizationSchema,
  websiteSchema,
  blogSchema,
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  jsonLdScript,
} from "./structured-data";
export { intentRegistry } from "./intent-registry";
export type { IntentEntry } from "./intent-registry";
export { validateContent } from "./content-validator";
