#!/bin/bash
# seo-opportunities.sh — Pull high-impression, low-CTR queries from Search Console
# Schedule: Weekly
# Output: gtm/seo-opportunities.json
# Token cost: 0 (shell script, no LLM calls)
# Requires: gcloud CLI configured with Search Console API access
# Falls back to placeholder if gcloud is not configured

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT_DIR="$ROOT/gtm"
OUTPUT_FILE="$OUTPUT_DIR/seo-opportunities.json"

mkdir -p "$OUTPUT_DIR"

echo "Pulling SEO opportunities from Search Console..." >&2

# Check if gcloud is configured
if ! command -v gcloud &>/dev/null; then
  echo "gcloud not found — writing placeholder" >&2
  python3 -c "
import json
data = {
    'source': 'search-console',
    'collectedAt': '$(date -u +%Y-%m-%dT%H:%M:%SZ)',
    'opportunities': [],
    'note': 'gcloud CLI not configured — install and authenticate with Search Console API'
}
with open('$OUTPUT_FILE', 'w') as f:
    json.dump(data, f, indent=2)
"
  exit 0
fi

# Pull top queries with impressions > 100 and CTR < 5%
# These are high-impression, low-CTR queries that need better landing pages
gcloud searchanalytics query \
  --site-url="soapcraft-pro.vercel.app" \
  --start-date="30daysAgo" \
  --dimensions=query,page \
  --row-limit=200 \
  --output-format=json 2>/dev/null | python3 -c "
import sys, json

data = json.load(sys.stdin)
rows = data.get('rows', [])

opportunities = []
for row in rows:
    query = row.get('keys', [''])[0]
    page = row.get('keys', [''])[1]
    clicks = int(row.get('clicks', 0))
    impressions = int(row.get('impressions', 0))
    ctr = float(row.get('ctr', 0)) * 100
    position = float(row.get('position', 0))

    # High impressions + low CTR = opportunity
    # OR high impressions + low rank = opportunity
    if (impressions >= 100 and ctr < 5.0) or (impressions >= 200 and position > 10):
        opportunities.append({
            'query': query,
            'page': page,
            'impressions': impressions,
            'clicks': clicks,
            'ctr': round(ctr, 2),
            'position': position,
            'opportunity': 'low_ctr' if ctr < 5.0 else 'low_rank',
        })

# Sort by impressions descending
opportunities.sort(key=lambda x: x['impressions'], reverse=True)

output = {
    'source': 'search-console',
    'collectedAt': '$(date -u +%Y-%m-%dT%H:%M:%SZ)',
    'opportunities': opportunities,
}

with open('$OUTPUT_FILE', 'w') as f:
    json.dump(output, f, indent=2)

print(f'Found {len(opportunities)} SEO opportunities')
" 2>/dev/null || {
  # gcloud query failed — write placeholder
  python3 -c "
import json
data = {
    'source': 'search-console',
    'collectedAt': '$(date -u +%Y-%m-%dT%H:%M:%SZ)',
    'opportunities': [],
    'note': 'Search Console query failed — check gcloud configuration'
}
with open('$OUTPUT_FILE', 'w') as f:
    json.dump(data, f, indent=2)
"
  echo "Search Console query failed — wrote placeholder" >&2
}

echo "SEO opportunities collected: $OUTPUT_FILE"