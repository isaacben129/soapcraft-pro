#!/bin/bash
# blog-production-pipeline.sh — Orchestrate the blog content production workflow.
#
# This script is PLUMBING ONLY. It collects data, ranks topics, and presents
# them to the agent. The agent writes the actual blog content in-session.
# The agent validates and publishes on explicit --confirm.
#
# Workflow:
#   1. Collect forum topics (forum-collector.sh)
#   2. Collect SEO opportunities (seo-opportunities.sh)
#   3. Rank topics by demand and product fit (topic-ranker.py)
#   4. Output the top topics for the agent to write about
#   5. Agent writes content in-session
#   6. Agent validates (validate-seo-content.py)
#   7. Agent publishes on --confirm (publish-blog-post.py)
#
# Schedule: Weekly (Monday morning)
# Output: gtm/blog-production-report.md

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT_DIR="$ROOT/gtm"
REPORT_FILE="$OUTPUT_DIR/blog-production-report.md"

mkdir -p "$OUTPUT_DIR"

echo "┌─────────────────────────────────────────────┐"
echo "│  SoapCraft Pro — Blog Production Pipeline  │"
echo "└─────────────────────────────────────────────┘"
echo ""

# Step 1: Collect forum topics
echo "Step 1/4: Collecting forum topics..."
bash "$ROOT/scripts/forum-collector.sh"

# Step 2: Collect SEO opportunities
echo "Step 2/4: Pulling SEO opportunities from Search Console..."
bash "$ROOT/scripts/seo-opportunities.sh"

# Step 3: Rank topics
echo "Step 3/4: Ranking topics by demand and product fit..."
python3 "$ROOT/scripts/topic-ranker.py"

# Step 4: Generate the production report
echo "Step 4/4: Generating production report..."

python3 - <<'PY'
import json, os
from datetime import datetime

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
output_dir = os.path.join(root, "gtm")

# Load rankings
rankings_path = os.path.join(output_dir, "topic-rankings.json")
if not os.path.exists(rankings_path):
    print("No rankings found — run topic-ranker.py first")
    exit(1)

with open(rankings_path) as f:
    rankings = json.load(f)

# Load curated records for reference
records_path = os.path.join(root, "lib", "content", "records.py")
# We can't import Python modules directly, so we'll just reference them

# Load forum topics for context
forum_path = os.path.join(output_dir, "forum-topics.json")
forum_topics = []
if os.path.exists(forum_path):
    try:
        with open(forum_path) as f:
            forum_data = json.load(f)
        forum_topics = forum_data.get("topics", [])
    except (json.JSONDecodeError, KeyError):
        pass

# Load SEO opportunities for context
seo_path = os.path.join(output_dir, "seo-opportunities.json")
seo_opps = []
if os.path.exists(seo_path):
    try:
        with open(seo_path) as f:
            seo_data = json.load(f)
        seo_opps = seo_data.get("opportunities", [])
    except (json.JSONDecodeError, KeyError):
        pass

# Generate the report
today = datetime.utcnow().strftime("%Y-%m-%d")
lines = []
lines.append(f"# Blog Production Report — {today}")
lines.append("")
lines.append("## Top Topics (ranked by demand + product fit)")
lines.append("")

if rankings.get("topTopics"):
    for i, topic in enumerate(rankings["topTopics"][:10], 1):
        score = topic.get("score", 0)
        query = topic.get("query", "unknown")
        source = topic.get("source", "unknown")
        impressions = topic.get("impressions", 0)
        opportunity = topic.get("opportunity", "new-topic")
        intent_stage = topic.get("intentStage", "unknown")

        lines.append(f"{i}. **{query}** (score: {score})")
        lines.append(f"   - Source: {source} | Intent: {intent_stage} | Impressions: {impressions}")
        lines.append(f"   - Opportunity type: {opportunity}")
        lines.append("")
else:
    lines.append("No topics found. Run forum-collector.sh and seo-opportunities.sh first.")
    lines.append("")

lines.append("## Production Workflow")
lines.append("")
lines.append("1. Agent selects a topic from the ranked list")
lines.append("2. Agent writes the blog post in-session (NOT in a script)")
lines.append("3. Agent validates the post with `validate-seo-content.py`")
lines.append("4. Agent publishes with `publish-blog-post.py --confirm`")
lines.append("")
lines.append("## Data Sources")
lines.append("")
lines.append(f"- Forum topics: {len(forum_topics)} collected")
lines.append(f"- SEO opportunities: {len(seo_opps)} from Search Console")
lines.append(f"- Total ranked topics: {rankings.get('totalTopics', 0)}")
lines.append("")
lines.append("## Next Steps")
lines.append("")
lines.append("1. Review the top-ranked topics above")
lines.append("2. Select the highest-priority topic")
lines.append("3. Write the blog post in-session using the SEO content template")
lines.append("4. Validate with `python3 scripts/validate-seo-content.py`")
lines.append("5. Publish with `python3 scripts/publish-blog-post.py <post.json> --confirm`")
lines.append("")

report = "\n".join(lines)
print(report)

with open(os.path.join(output_dir, "blog-production-report.md"), "w") as f:
    f.write(report)

print(f"Report written to {os.path.join(output_dir, 'blog-production-report.md')}")
PY

echo ""
echo "Blog production pipeline complete: $REPORT_FILE"