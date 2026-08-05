#!/bin/bash
# content-health.sh — Check all published pages for broken links, missing metadata, index status
# Schedule: Weekly (Monday)
# Output: gtm/health-weekly.md
# Token cost: 0 (shell script, no LLM)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT_DIR="$ROOT/gtm"
OUTPUT_FILE="$OUTPUT_DIR/health-weekly.md"
SITE_URL="https://soapcraft-pro.vercel.app"

mkdir -p "$OUTPUT_DIR"

echo "# Content Health Report" > "$OUTPUT_FILE"
echo "Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# ── Sitemap ──
echo "## Sitemap" >> "$OUTPUT_FILE"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${SITE_URL}/sitemap.xml" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
  echo "- sitemap.xml: OK (HTTP $HTTP_CODE)" >> "$OUTPUT_FILE"
else
  echo "- sitemap.xml: MISSING or error (HTTP $HTTP_CODE)" >> "$OUTPUT_FILE"
fi
echo "" >> "$OUTPUT_FILE"

# ── robots.txt ──
echo "## robots.txt" >> "$OUTPUT_FILE"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${SITE_URL}/robots.txt" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
  echo "- robots.txt: OK (HTTP $HTTP_CODE)" >> "$OUTPUT_FILE"
else
  echo "- robots.txt: MISSING or error (HTTP $HTTP_CODE)" >> "$OUTPUT_FILE"
fi
echo "" >> "$OUTPUT_FILE"

# ── Canonical URLs ──
echo "## Canonical URLs" >> "$OUTPUT_FILE"
for path in "/" "/marketing/pricing" "/marketing/blog" "/blog" \
  "/calculators/soap-cost-calculator" \
  "/compare/soapcalc-alternative" \
  "/soap-recipe-management-software" \
  "/soap-batch-tracking-software"; do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${SITE_URL}${path}" 2>/dev/null || echo "000")
  CANONICAL=$(curl -s "${SITE_URL}${path}" 2>/dev/null | grep -oP 'rel="canonical" content="[^"]*"' | head -1 || echo "")
  if [ "$HTTP_CODE" = "200" ]; then
    if [ -n "$CANONICAL" ]; then
      echo "- ${path}: OK (HTTP $HTTP_CODE, canonical present)" >> "$OUTPUT_FILE"
    else
      echo "- ${path}: OK (HTTP $HTTP_CODE, NO canonical found)" >> "$OUTPUT_FILE"
    fi
  else
    echo "- ${path}: ERROR (HTTP $HTTP_CODE)" >> "$OUTPUT_FILE"
  fi
done
echo "" >> "$OUTPUT_FILE"

# ── Index Status ──
echo "## Index Status (Search Console)" >> "$OUTPUT_FILE"
echo "- Check Google Search Console for coverage report" >> "$OUTPUT_FILE"
echo "- Verify all SEO pages are submitted in sitemap.xml" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# ── Broken Internal Links ──
echo "## Internal Links" >> "$OUTPUT_FILE"
echo "- Run a crawl audit (e.g., Screaming Frog or site:soapcraft-pro.vercel.app in Google) to detect broken links" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# ── Metadata ──
echo "## Page Metadata" >> "$OUTPUT_FILE"
for path in "/" "/marketing/pricing" "/marketing/blog" "/blog" \
  "/calculators/soap-cost-calculator" \
  "/compare/soapcalc-alternative" \
  "/soap-recipe-management-software" \
  "/soap-batch-tracking-software"; do
  TITLE=$(curl -s "${SITE_URL}${path}" 2>/dev/null | grep -oP '<title>[^<]*</title>' | sed 's/<[^>]*>//g' || echo "NO TITLE")
  DESC=$(curl -s "${SITE_URL}${path}" 2>/dev/null | grep -oP 'name="description" content="[^"]*"' | sed 's/.*content="//;s/"$//' || echo "NO DESCRIPTION")
  echo "- ${path}: title=\"${TITLE}\" description=\"${DESC}\"" >> "$OUTPUT_FILE"
done

echo "" >> "$OUTPUT_FILE"
echo "Content health check complete." >> "$OUTPUT_FILE"
echo "[content-health] Complete: $OUTPUT_FILE"