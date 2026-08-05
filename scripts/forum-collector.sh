#!/bin/bash
# forum-collector.sh — Pull recurring questions from SoapMakingForum and Reddit
# Schedule: Weekly
# Output: gtm/forum-topics.json
# Token cost: 0 (shell script, no LLM calls)
# Requires: curl, jq

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT_DIR="$ROOT/gtm"
OUTPUT_FILE="$OUTPUT_DIR/forum-topics.json"

mkdir -p "$OUTPUT_DIR"

echo "Collecting forum topics..." >&2

# ── SoapMakingForum: search for recurring questions ──
# Uses the public search endpoint. No API key required.

FORUM_URL="https://www.soapmakingforum.com/search"

# Search for common soapmaking problem terms
TERMS=(
  "soap separation"
  "lye calculator discrepancy"
  "soap not tracing"
  "soap soft crumbly"
  "soda ash"
  "soap cost per bar"
  "soap batch record"
  "soap cure time"
  "best oils dry skin soap"
  "soapmaking for beginners"
  "lye calculator"
  "soap recipe costing"
  "batch tracking"
  "soap mold calculator"
  "soap yield calculation"
)

echo '{"source":"forum","collectedAt":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","topics":[' > "$OUTPUT_FILE"

FIRST=true
for term in "${TERMS[@]}"; do
  # Search the forum for this term
  SEARCH_URL="${FORUM_URL}?q=$(python3 -c "import urllib.parse; print(urllib.parse.quote('${term}'))")"

  # Fetch search results page (timeout 10s)
  PAGE=$(curl -s -L --max-time 10 "$SEARCH_URL" 2>/dev/null || echo "")

  # Extract thread titles and URLs (basic HTML parsing)
  # This is a best-effort extraction — the forum HTML structure may change
  if [ -n "$PAGE" ]; then
    TITLES=$(echo "$PAGE" | python3 -c "
import sys, re, json
html = sys.stdin.read()
# Extract thread titles from search results
matches = re.findall(r'<a[^>]*href=\"([^\"]*thread[^\"]*)\"[^>]*>([^<]+)</a>', html, re.IGNORECASE)
results = []
for href, title in matches[:5]:
    results.append({'title': title.strip(), 'url': href, 'query': '$term'})
print(json.dumps(results))
" 2>/dev/null || echo "[]")

    if [ "$FIRST" = true ]; then
      FIRST=false
    else
      echo "," >> "$OUTPUT_FILE"
    fi
    echo "$TITLES" >> "$OUTPUT_FILE"
  fi
done

echo ']}' >> "$OUTPUT_FILE"

# Validate JSON
if python3 -c "import json; json.load(open('$OUTPUT_FILE'))" 2>/dev/null; then
  echo "Forum topics collected: $OUTPUT_FILE" >&2
else
  # Write a placeholder if extraction failed
  python3 -c "
import json
data = {
    'source': 'forum',
    'collectedAt': '$(date -u +%Y-%m-%dT%H:%M:%SZ)',
    'topics': [],
    'note': 'Forum extraction failed — check HTML structure or use manual curation'
}
with open('$OUTPUT_FILE', 'w') as f:
    json.dump(data, f, indent=2)
"
  echo "Forum extraction failed — wrote placeholder" >&2
fi

echo "Forum collector complete: $OUTPUT_FILE"