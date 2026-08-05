#!/bin/bash
# seo-audit.sh — Pull Search Console data for top queries, impressions, CTR, page URLs
# Schedule: Weekly (Monday morning)
# Output: gtm/seo-weekly.csv
# Token cost: 0 (shell script, no LLM)
#
# Prerequisites:
#   - gcloud CLI configured with Search Console API access
#   - site verified in Google Search Console
#   - GOOGLE_SITE_VERIFICATION_ID env var set (or use service account key)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT_DIR="$ROOT/gtm"
OUTPUT_FILE="$OUTPUT_DIR/seo-weekly.csv"
SITE_URL="https://soapcraft-pro.vercel.app"

mkdir -p "$OUTPUT_DIR"

echo "date,query,page,impressions,clicks,ctr,position" > "$OUTPUT_FILE"

# Pull Search Console data for the last 7 days
# Requires: gcloud searchanalytics query --site-url=<url> --start-date=7daysAgo --dimensions=query,page --row-limit=1000
# Falls back to a placeholder if gcloud is not configured

if command -v gcloud &>/dev/null; then
  echo "[seo-audit] Pulling Search Console data for $SITE_URL..."
  gcloud searchanalytics query \
    --site-url="$SITE_URL" \
    --start-date=7daysAgo \
    --dimensions=query,page \
    --row-limit=1000 \
    --format=csv 2>/dev/null >> "$OUTPUT_FILE" || {
      echo "[seo-audit] gcloud query failed. Writing placeholder."
      echo "$(date -u +%Y-%m-%d),NO_DATA,NO_DATA,0,0,0,0" >> "$OUTPUT_FILE"
    }
else
  echo "[seo-audit] gcloud CLI not found. Writing placeholder."
  echo "$(date -u +%Y-%m-%d),NO_DATA,NO_DATA,0,0,0,0" >> "$OUTPUT_FILE"
fi

echo "[seo-audit] Complete: $OUTPUT_FILE"
wc -l "$OUTPUT_FILE"
