/* eslint-disable no-undef */
import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = globalThis.process.env.BASE_URL;

if (!baseUrl) {
  throw new Error("BASE_URL must point to the deployed preview under test.");
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

try {
  await page.goto(`${baseUrl}/tools/batch-cost`, { waitUntil: "networkidle", timeout: 30_000 });

  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  assert.ok(
    dimensions.scrollWidth <= dimensions.innerWidth,
    `Batch Cost overflows at 390px: ${dimensions.scrollWidth}px > ${dimensions.innerWidth}px`,
  );

  const labelContrast = await page.locator("label[for='batch-yield-bars']").evaluate((label) => {
    const rgb = (value) => value.match(/\d+/g).slice(0, 3).map(Number);
    const luminance = (channels) => channels.map((channel) => {
      const normalized = channel / 255;
      return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
    }).reduce((total, channel, index) => total + channel * [0.2126, 0.7152, 0.0722][index], 0);
    const foreground = luminance(rgb(getComputedStyle(label).color));
    const panel = label.closest(".bg-canvas");
    const background = luminance(rgb(getComputedStyle(panel).backgroundColor));
    return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
  });
  assert.ok(labelContrast >= 4.5, `Batch Cost labels need WCAG AA contrast; received ${labelContrast.toFixed(2)}:1`);

  await assert.doesNotReject(async () => {
    await page.getByRole("combobox").last().selectOption("gross_margin");
  });
  await page.getByPlaceholder("Ingredient name").fill("Olive oil");
  await page.getByPlaceholder("Cost").fill("1");
  await page.getByPlaceholder("Qty").fill("1");
  await page.getByLabel("Batch yield (bars)").fill("1");
  await page.getByLabel("Target gross margin (%)").fill("40");
  await page.getByRole("button", { name: "Calculate Cost Per Bar" }).click();

  await page.getByText("Suggested selling price").waitFor({ state: "visible" });
  await assert.doesNotReject(async () => page.getByText("$1.67", { exact: true }).waitFor({ state: "visible" }));
} finally {
  await browser.close();
}
