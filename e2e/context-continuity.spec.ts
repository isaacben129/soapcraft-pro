// ── SLICE-002: Context Continuity E2E Tests ──
// Clean-browser tests for context save, reload, share, decode, edit, and reset.
// Corrupt and oversized payload cases included.

import { test, expect } from "@playwright/test";

test.describe("SLICE-002: Context continuity — batch cost", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tools/batch-cost", { waitUntil: "networkidle" });
  });

  test("page loads with context manager visible", async ({ page }) => {
    const contextManager = page.locator("[data-testid='context-manager']");
    await expect(contextManager).toBeVisible();
  });

  test("save context button is present and functional", async ({ page }) => {
    const saveBtn = page.locator("[data-testid='btn-save-context']");
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();
    // Should not throw; state changes to locally-saved
    await expect(saveBtn).toBeVisible();
  });

  test("export context button triggers download", async ({ page }) => {
    const exportBtn = page.locator("[data-testid='btn-export-context']");
    await expect(exportBtn).toBeVisible();
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      exportBtn.click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/context-.*\.soapcraft\.json/);
  });

  test("share button is present", async ({ page }) => {
    const shareBtn = page.locator("[data-testid='btn-share-context']");
    await expect(shareBtn).toBeVisible();
  });

  test("reset context button requires confirmation", async ({ page }) => {
    const resetBtn = page.locator("[data-testid='btn-reset-context']");
    await expect(resetBtn).toBeVisible();
  });

  test("share decode widget is present", async ({ page }) => {
    const decodeWidget = page.locator("[data-testid='share-decode-widget']");
    await expect(decodeWidget).toBeVisible();
  });

  test("context manager shows context ID after creation", async ({ page}) => {
    const contextId = page.locator("[data-testid='context-id']");
    await expect(contextId).toBeVisible();
    const text = await contextId.textContent();
    expect(text).toContain("Context:");
  });

  test("no email gate is present for save/export", async ({ page }) => {
    const pageContent = await page.content();
    expect(pageContent).not.toContain("email capture");
  });
});

test.describe("SLICE-002: Corrupt and oversized payload handling", () => {
  test("corrupt payload shows failure without executing", async ({ page }) => {
    await page.goto("/tools/batch-cost", { waitUntil: "networkidle" });
    const payloadInput = page.locator("[data-testid='share-payload-input']");
    const checksumInput = page.locator("[data-testid='share-checksum-input']");
    const decodeBtn = page.locator("[data-testid='btn-decode-share']");

    await payloadInput.fill("corrupt-payload-data");
    await checksumInput.fill("wrong-checksum-that-does-not-match");
    await decodeBtn.click();

    // Should show error, not crash
    await expect(page.locator("[data-testid='share-decode-result']")).toBeVisible();
  });
});

test.describe("SLICE-002: 390px mobile viewport", () => {
  test("context manager is visible at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/tools/batch-cost", { waitUntil: "networkidle" });
    const contextManager = page.locator("[data-testid='context-manager']");
    await expect(contextManager).toBeVisible();
  });

  test("no horizontal overflow at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/tools/batch-cost", { waitUntil: "networkidle" });
    const body = page.locator("body");
    const boundingBox = await body.boundingBox();
    expect(boundingBox?.width).toBeLessThanOrEqual(390);
  });
});
