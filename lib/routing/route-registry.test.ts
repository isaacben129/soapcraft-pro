// ── Route registry tests for SLICE-001R ──
// Asserts exactly eight canonical tool URLs and that retired URL fragments
// are absent from the generated intent registry.

import { describe, expect, it } from "vitest";
import { canonicalRoutes, canonicalPaths } from "./canonical-routes";
import { getPublishedEntries } from "@/lib/seo/intent-registry";

describe("canonical route registry", () => {
  it("exposes exactly eight canonical tool routes", () => {
    expect(canonicalRoutes).toHaveLength(8);
  });

  it("each canonical route has a path, slug, title, and truthful status label", () => {
    for (const route of canonicalRoutes) {
      expect(route.path).toMatch(/^\/tools\//);
      expect(route.slug).toBeTruthy();
      expect(route.title).toBeTruthy();
      expect(route.statusLabel).toBeTruthy();
    }
  });

  it("canonical paths match the eight literal URLs from PUBLIC-TOOL-CONTRACT.md §2", () => {
    const expected = [
      "/tools/formulation",
      "/tools/mold-volume",
      "/tools/recipe-scaling",
      "/tools/batch-cost",
      "/tools/wholesale-pricing",
      "/tools/craft-fair-break-even",
      "/tools/ready-by-planner",
      "/tools/ingredient-purchase-planner",
    ];
    for (const url of expected) {
      expect(canonicalPaths.has(url)).toBe(true);
    }
  });

  it("no retired URL fragments appear in the intent registry", () => {
    const entries = getPublishedEntries();
    const retiredFragments = [
      "/calculators/",
      "/marketing/",
      "/pinterest/",
      "/tiktok/",
      "/subscription",
      "/pricing",
      "/retired",
      "/privacy-pinterest",
      "/terms-pinterest",
    ];
    for (const entry of entries) {
      for (const fragment of retiredFragments) {
        expect(entry.path).not.toContain(fragment);
      }
    }
  });

  it("intent registry entries all point to canonical tool paths", () => {
    const entries = getPublishedEntries();
    for (const entry of entries) {
      expect(canonicalPaths.has(entry.path) || entry.path === "/methodology").toBe(true);
    }
  });

  it("sitemap-related code does not emit retired URLs from canonical routes", () => {
    const canonicalPathsArray = Array.from(canonicalPaths);
    const retiredFragments = [
      "/pricing",
      "/subscription",
      "/marketing/",
      "/pinterest/",
      "/tiktok/",
      "/calculators/",
      "/privacy-pinterest",
      "/terms-pinterest",
    ];
    for (const path of canonicalPathsArray) {
      for (const fragment of retiredFragments) {
        expect(path).not.toContain(fragment);
      }
    }
  });
});
