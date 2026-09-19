// SLICE-001R e2e browser verification using Playwright API directly
import { chromium } from "playwright";
import * as fs from "fs";

const BASE = "http://127.0.0.1:3001";
const CANONICAL_TOOLS = [
  { slug: "formulation", path: "/tools/formulation", statusLabel: "Unavailable — chemistry safety-gated", isGated: true },
  { slug: "mold-volume", path: "/tools/mold-volume", statusLabel: "Ready to use", isGated: false },
  { slug: "recipe-scaling", path: "/tools/recipe-scaling", statusLabel: "Ready to use", isGated: false },
  { slug: "batch-cost", path: "/tools/batch-cost", statusLabel: "Ready to use", isGated: false },
  { slug: "wholesale-pricing", path: "/tools/wholesale-pricing", statusLabel: "Ready to use", isGated: false },
  { slug: "craft-fair-break-even", path: "/tools/craft-fair-break-even", statusLabel: "Ready to use", isGated: false },
  { slug: "ready-by-planner", path: "/tools/ready-by-planner", statusLabel: "Ready to use", isGated: false },
  { slug: "ingredient-purchase-planner", path: "/tools/ingredient-purchase-planner", statusLabel: "Ready to use", isGated: false },
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results: { name: string; pass: boolean; detail: string }[] = [];

  try {
    // TEST 1: /tools page has exactly 8 articles
    const page = await browser.newPage();
    await page.goto(`${BASE}/tools`, { timeout: 15000 });
    const articleCount = await page.locator("article").count();
    results.push({ name: "exactly 8 tool cards", pass: articleCount === 8, detail: `${articleCount} articles` });

    // TEST 2: each card links to canonical route (gated tools have title as text, not link)
    let allHrefsCorrect = true;
    for (const tool of CANONICAL_TOOLS) {
      const card = page.locator(`article:has-text("${tool.slug}")`).first();
      if (tool.isGated) {
        // Gated tools have title as plain text, not a link
        const title = await card.innerText();
        if (!title.includes(tool.slug)) { allHrefsCorrect = false; console.log(`FAIL: ${tool.slug} title missing`); }
      } else {
        const link = card.locator("a").first();
        const href = await link.getAttribute("href");
        if (href !== tool.path) { allHrefsCorrect = false; console.log(`FAIL: ${tool.slug} href=${href} expected=${tool.path}`); }
      }
    }
    results.push({ name: "each card links to canonical route", pass: allHrefsCorrect, detail: allHrefsCorrect ? "all correct" : "some failed" });

    // TEST 3: each card shows truthful status label
    let allStatusesCorrect = true;
    for (const tool of CANONICAL_TOOLS) {
      const card = page.locator(`article:has-text("${tool.slug}")`).first();
      const text = await card.innerText();
      if (!text.includes(tool.statusLabel)) { allStatusesCorrect = false; console.log(`FAIL: ${tool.slug} missing status "${tool.statusLabel}"`); }
    }
    results.push({ name: "each card shows truthful status", pass: allStatusesCorrect, detail: allStatusesCorrect ? "all correct" : "some failed" });

    // TEST 4: no "Working" status anywhere
    const workingCount = await page.getByText("Working").count();
    results.push({ name: "no Working states", pass: workingCount === 0, detail: `${workingCount} occurrences of "Working"` });

    // TEST 5: no retired URLs in page content
    const pageContent = await page.content();
    const retiredPatterns = ["/calculators/", "/pinterest", "/tiktok", "/campaign", "/subscription", "/crm", "/lead"];
    let noRetired = true;
    for (const pattern of retiredPatterns) {
      if (pageContent.includes(pattern)) { noRetired = false; console.log(`FAIL: found retired URL pattern "${pattern}"`); }
    }
    results.push({ name: "no retired URLs", pass: noRetired, detail: noRetired ? "none found" : "retired URLs present" });

    // TEST 6: 390px viewport no horizontal overflow
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/tools`, { timeout: 15000 });
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    const noOverflow = scrollWidth <= innerWidth;
    results.push({ name: "no mobile overflow at 390px", pass: noOverflow, detail: `${scrollWidth} <= ${innerWidth}` });

    // TEST 7: gated page returns truthful gated state
    await page.goto(`${BASE}/tools/formulation`, { timeout: 15000 });
    const gatedText = await page.getByText("Unavailable — chemistry safety-gated").count();
    const gatedWorking = await page.getByText("Working").count();
    results.push({ name: "gated page truthful", pass: gatedText > 0 && gatedWorking === 0, detail: `gated=${gatedText}, working=${gatedWorking}` });

    // TEST 8: in-build pages return truthful in-build state
    for (const tool of CANONICAL_TOOLS) {
      if (tool.statusLabel.startsWith("Ready to use")) {
        await page.goto(`${BASE}${tool.path}`, { timeout: 15000 });
        const buildText = await page.getByText(tool.statusLabel).count();
        const buildWorking = await page.getByText("Working").count();
        results.push({ name: `${tool.slug} in-build truthful`, pass: buildText > 0 && buildWorking === 0, detail: `status=${buildText > 0}, working=${buildWorking === 0}` });
      }
    }

    // Capture evidence screenshots
    fs.mkdirSync(".studio/evidence/SLICE-001R", { recursive: true });
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(`${BASE}/tools`, { timeout: 15000 });
    await page.screenshot({ path: ".studio/evidence/SLICE-001R/tools-desktop.png", fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/tools`, { timeout: 15000 });
    await page.screenshot({ path: ".studio/evidence/SLICE-001R/tools-mobile-390.png", fullPage: true });

    // Write browser-results.json
    const browserResults = {
      timestamp: new Date().toISOString(),
      browser: "chromium",
      viewport: { desktop: "1280x720", mobile: "390x844" },
      baseURL: BASE,
      tests: results,
      passed: results.filter(r => r.pass).length,
      total: results.length,
    };
    fs.writeFileSync(".studio/evidence/SLICE-001R/browser-results.json", JSON.stringify(browserResults, null, 2));

    await browser.close();

    console.log("\n=== SLICE-001R BROWSER VERIFICATION RESULTS ===");
    for (const r of results) {
      console.log(`${r.pass ? "PASS" : "FAIL"}: ${r.name} (${r.detail})`);
    }
    console.log(`\nTotal: ${results.filter(r => r.pass).length}/${results.length} passed`);
  } catch (e: any) {
    console.error("Error:", e.message);
    await browser.close();
    process.exit(1);
  }
}

main();
