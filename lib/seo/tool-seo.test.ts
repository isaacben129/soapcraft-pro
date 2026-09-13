import { describe, expect, it } from "vitest";
import { canonicalRoutes } from "@/lib/routing/canonical-routes";
import { getToolMetadata, getToolStructuredData, toolSeoEntries } from "./tool-seo";

describe("tool SEO contract", () => {
  it("provides one canonical metadata and schema record for every public tool route", () => {
    expect(toolSeoEntries.map((entry) => entry.slug).sort()).toEqual(
      canonicalRoutes.map((route) => route.slug).sort()
    );

    for (const route of canonicalRoutes) {
      const metadata = getToolMetadata(route.slug);
      expect(metadata.alternates?.canonical).toContain(route.path);
      expect(metadata.openGraph?.url).toContain(route.path);

      const schemas = getToolStructuredData(route.slug);
      expect(schemas.some((schema) => schema["@type"] === "WebPage")).toBe(true);
      expect(schemas.some((schema) => schema["@type"] === "BreadcrumbList")).toBe(true);
      expect(schemas.some((schema) => schema["@type"] === "WebApplication")).toBe(!route.isGated);
    }
  });

  it("does not describe the chemistry-gated formulation route as an available application", () => {
    const formulationSchemas = getToolStructuredData("formulation");
    expect(formulationSchemas.some((schema) => schema["@type"] === "WebApplication")).toBe(false);
  });
});
