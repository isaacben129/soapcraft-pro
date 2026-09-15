// ── SLICE-001R: Route registry browser tests ──
// Asserts eight canonical tool entries, truthful statuses,
// no horizontal overflow at 390px.

import { test, expect } from "@playwright/test";

const BASE = "http://127.0.0.1:3001";
const CANONICAL_TOOLS = [
  { slug: "formulation", path: "/tools/formulation", statusLabel: "Unavailable — chemistry safety-gated" },
  { slug: "mold-volume", path: "/tools/mold-volume", statusLabel: "Ready to use" },
  { slug: "recipe-scaling", path: "/tools/recipe-scaling", statusLabel: "Ready to use" },
  { slug: "batch-cost", path: "/tools/batch-cost", statusLabel: "Ready to use" },
  { slug: "wholesale-pricing", path: "/tools/wholesale-pricing", statusLabel: "Ready to use" },
  { slug: "craft-fair-break-even", path: "/tools/craft-fair-break-even", statusLabel: "Ready to use" },
  { slug: "ready-by-planner", path: "/tools/ready-by-planner", statusLabel: "Ready to use" },
  { slug: "ingredient-purchase-planner", path: "/tools/ingredient-purchase-planner", statusLabel: "Ready to use" },
] as const;

test.describe("route registry — /tools directory", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/tools`);
  });

  test("displays exactly eight tool cards", async ({ page }) => {
    const cards = page.locator("article");
    await expect(cards).toHaveCount(8);
  });

  test("each card links to its canonical route", async ({ page }) => {
    for (const tool of CANONICAL_TOOLS) {
      const card = page.locator(`article:has-text("${tool.slug}")`).first();
      const link = card.locator("a").first();
      const href = await link.getAttribute("href");
      expect(href).toBe(tool.path);
    }
  });

  test("each card shows a truthful status label", async ({ page }) => {
    for (const tool of CANONICAL_TOOLS) {
      const card = page.locator(`article:has-text("${tool.slug}")`).first();
      await expect(card).toContainText(tool.statusLabel);
    }
  });

  test("no card shows Working status", async ({ page }) => {
    await expect(page.getByText("Working")).toHaveCount(0);
  });
});

test.describe("route registry — 390px mobile viewport", () => {
  test("no horizontal overflow at 390px on /tools", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/tools`);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
  });

  test("each card has canonical href and truthful visible status at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/tools`);
    for (const tool of CANONICAL_TOOLS) {
      const card = page.locator(`article:has-text("${tool.slug}")`).first();
      await expect(card).toContainText(tool.statusLabel);
    }
  });
});

test.describe("direct visits to in-build pages", () => {
  for (const tool of CANONICAL_TOOLS) {
    if (tool.statusLabel.startsWith("Ready to use")) {
      test(`direct visit to ${tool.path} returns truthful in-build state`, async ({ page }) => {
        await page.goto(`${BASE}${tool.path}`);
        await expect(page.getByText(tool.statusLabel)).toBeVisible();
        await expect(page.getByText("Working")).toHaveCount(0);
      });
    }
  }
});

test.describe("direct visit to gated page", () => {
  test("/tools/formulation returns truthful gated state", async ({ page }) => {
    await page.goto(`${BASE}/tools/formulation`);
    await expect(page.getByText("Unavailable — chemistry safety-gated")).toBeVisible();
    await expect(page.getByText("Working")).toHaveCount(0);
  });
});
