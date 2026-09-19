// Quick connectivity test
import { test, expect } from "@playwright/test";

test("dev server is reachable", async ({ page }) => {
  const response = await page.goto("http://localhost:3001/tools", { waitUntil: "domcontentloaded", timeout: 30000 });
  console.log("STATUS:", response?.status());
  console.log("TITLE:", await page.title());
  const html = await page.content();
  console.log("HTML_LENGTH:", html.length);
});
