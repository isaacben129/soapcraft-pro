// Debug test to check what the server is actually serving
import { test, expect } from "@playwright/test";

test("check /tools page full content", async ({ page }) => {
  await page.goto("/tools", { waitUntil: "networkidle" });
  const html = await page.content();
  console.log("PAGE_LENGTH:", html.length);
  console.log("PAGE_TITLE:", await page.title());
  console.log("PAGE_TEXT:", html.slice(0, 5000));
});
