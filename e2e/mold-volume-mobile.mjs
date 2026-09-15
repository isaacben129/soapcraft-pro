/* eslint-disable no-undef */
import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = globalThis.process.env.BASE_URL;
if (!baseUrl) throw new Error("BASE_URL must point to the deployed preview under test.");

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

try {
  await page.goto(`${baseUrl}/tools/mold-volume`, { waitUntil: "networkidle", timeout: 30_000 });
  await page.getByLabel("Unit").selectOption("in");
  await page.getByLabel("Length").fill("12");
  await page.getByLabel("Width").fill("3");
  await page.getByLabel("Height").fill("3");
  await page.getByLabel("Fill percentage").fill("100");
  await page.getByRole("button", { name: "Calculate mold capacity" }).click();
  await page.getByText("1769.8 cm³", { exact: true }).first().waitFor({ state: "visible" });
  await page.getByText("1592.8 g", { exact: true }).waitFor({ state: "visible" });

  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  assert.ok(
    dimensions.scrollWidth <= dimensions.innerWidth,
    `Mold Volume overflows at 390px: ${dimensions.scrollWidth}px > ${dimensions.innerWidth}px`,
  );
} finally {
  await browser.close();
}
