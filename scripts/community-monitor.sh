#!/bin/bash
# community-monitor.sh — Searches target communities for mentions of SoapCraft Pro
# Schedule: Daily (aggregated weekly)
# Output: gtm/community-weekly.md
# Token cost: 0 (shell script using curl + grep, no LLM)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT_DIR="$ROOT/gtm"
OUTPUT_FILE="$OUTPUT_DIR/community-weekly.md"

mkdir -p "$OUTPUT_DIR"

echo "# Community Monitor Report" > "$OUTPUT_FILE"
echo "Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# ── Reddit: r/soapmaking ──
echo "## r/soapmaking" >> "$OUTPUT_FILE"
echo "Search: SoapCraft Pro, soapcraft, soap calculator" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Reddit search API (public, no auth required for basic search)
REDDIT_RESULTS=$(curl -s -A "SoapCraftPro/1.0" \
  "https://www.reddit.com/search.json?q=SoapCraft+Pro&limit=25&sort=new" 2>/dev/null || echo '{"data":{"children":[]}}')

echo "$REDDIT_RESULTS" | python3 -c "
import json, sys
data = json.load(sys.stdin)
children = data.get('data', {}).get('children', [])
if not children:
    print('- No recent results found (or API rate-limited)')
else
    for c in children[:10]:
        d = c.get('data', {})
        title = d.get('title', 'Untitled')
        url = d.get('url', '')
        subreddit = d.get('subreddit', 'unknown')
        print(f'- [{subreddit}] {title} ({url})')
" >> "$OUTPUT_FILE" 2>/dev/null || echo "- Reddit search unavailable or rate-limited" >> "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"

# ── SoapMakingForum ──
echo "## SoapMakingForum" >> "$OUTPUT_FILE"
echo "Search: SoapCraft Pro, soapcraft, soap calculator" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

FORUM_RESULTS=$(curl -s "https://www.soapmakingforum.com/search.php?keywords=SoapCraft+Pro&terms=all&fid%5B0%5D=0&sc=1&sf=titleonly&sr=topics&sk=t&sd=d&st=0&ch=300&t=0&submit=Search" 2>/dev/null || echo "")

if [ -n "$FORUM_RESULTS" ]; then
  echo "$FORUM_RESULTS" | grep -oP 'href="/threads/[^"]*"[^>]*>[^<]*</a>' | head -10 >> "$OUTPUT_FILE" 2>/dev/null || echo "- No results or search page changed" >> "$OUTPUT_FILE"
else
  echo "- Forum search unavailable" >> "$OUTPUT_FILE"
fi

echo "" >> "$OUTPUT_FILE"

# ── General web search ──
echo "## Web Mentions" >> "$OUTPUT_FILE"
echo "- Run a manual web search for \"SoapCraft Pro\" to check for new mentions" >> "$OUTPUT_FILE"
echo "- Check social media: Twitter/X, Instagram, Facebook soap making groups" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "Community monitor complete: $OUTPUT_FILE"
echo "[community-monitor] Complete: $OUTPUT_FILE"