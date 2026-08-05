#!/usr/bin/env python3
"""topic-ranker.py — Rank blog topics by demand and product fit.

Reads:
  - gtm/forum-topics.json (from forum-collector.sh)
  - gtm/seo-opportunities.json (from seo-opportunities.sh)
  - lib/content/records.ts (curated records)

Produces:
  - gtm/topic-rankings.json (ranked topics with scores)

The ranking considers:
  1. Recurrence (how many times the topic appeared in research)
  2. Intent stage (commercial > problem > informational)
  3. Product fit (does the topic connect to a SoapCraft Pro feature?)
  4. Search Console demand (impressions for related queries)

Usage:
  python3 scripts/topic-ranker.py
"""

import json
import os
import sys
from datetime import datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(ROOT, "gtm")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "topic-rankings.json")

# Intent stage priority (higher = more valuable)
INTENT_SCORE = {
    "commercial": 4,
    "problem": 3,
    "informational": 2,
    "product": 1,
}

# Product fit score (does the topic connect to a SoapCraft Pro feature?)
PRODUCT_FIT_SCORE = {
    "calculator": 3,
    "batch": 3,
    "cure": 3,
    "cost": 3,
    "recipe": 3,
    "lye": 2,
    "ingredient": 2,
    "mold": 2,
    "yield": 2,
    "safety": 1,
    "beginner": 1,
}


def load_forum_topics():
    """Load forum topics from the collector output."""
    path = os.path.join(OUTPUT_DIR, "forum-topics.json")
    if not os.path.exists(path):
        return []
    try:
        with open(path) as f:
            data = json.load(f)
        return data.get("topics", [])
    except (json.JSONDecodeError, KeyError):
        return []


def load_seo_opportunities():
    """Load SEO opportunities from Search Console."""
    path = os.path.join(OUTPUT_DIR, "seo-opportunities.json")
    if not os.path.exists(path):
        return []
    try:
        with open(path) as f:
            data = json.load(f)
        return data.get("opportunities", [])
    except (json.JSONDecodeError, KeyError):
        return []


def compute_product_fit(topic: str) -> int:
    """Score how well a topic connects to a SoapCraft Pro feature."""
    topic_lower = topic.lower()
    score = 0
    for keyword, fit_score in PRODUCT_FIT_SCORE.items():
        if keyword in topic_lower:
            score = max(score, fit_score)
    return score


def rank_topics(topics: list[dict]) -> list[dict]:
    """Rank topics by a composite score."""
    scored = []
    for topic in topics:
        query = topic.get("query", topic.get("title", ""))
        recurrence = topic.get("recurrence", 1)
        intent_stage = topic.get("intentStage", "informational")
        product_fit = compute_product_fit(query)

        # Composite score
        score = (
            recurrence * 2  # Demand
            + INTENT_SCORE.get(intent_stage, 1) * 3  # Intent value
            + product_fit * 2  # Product fit
            + topic.get("impressions", 0) / 100  # Search demand
        )

        scored.append({
            "query": query,
            "score": round(score, 2),
            "recurrence": recurrence,
            "intentStage": intent_stage,
            "productFit": product_fit,
            "impressions": topic.get("impressions", 0),
            "source": topic.get("source", "unknown"),
            "opportunity": topic.get("opportunity", "new-topic"),
        })

    # Sort by score descending
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored


def main():
    # Load all topic sources
    forum_topics = load_forum_topics()
    seo_opps = load_seo_opportunities()

    # Combine and rank
    all_topics = []

    # Add forum topics (with recurrence from the collector)
    for topic in forum_topics:
        all_topics.append({
            "query": topic.get("title", topic.get("query", "")),
            "recurrence": topic.get("recurrence", 1),
            "intentStage": "problem",  # Forum questions are usually problem-intent
            "source": "forum",
            "impressions": 0,
        })

    # Add SEO opportunities (with search demand data)
    for opp in seo_opps:
        all_topics.append({
            "query": opp.get("query", ""),
            "recurrence": 1,  # Single data point from Search Console
            "intentStage": "commercial" if opp.get("opportunity") == "low_ctr" else "problem",
            "source": "search-console",
            "impressions": opp.get("impressions", 0),
            "opportunity": opp.get("opportunity", "new-topic"),
        })

    # Rank
    ranked = rank_topics(all_topics)

    # Output
    output = {
        "generatedAt": datetime.utcnow().isoformat(),
        "totalTopics": len(ranked),
        "topTopics": ranked[:20],
    }

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    with open(OUTPUT_FILE, "w") as f:
        json.dump(output, f, indent=2)

    print(f"Ranked {len(ranked)} topics → {OUTPUT_FILE}")
    if ranked:
        print(f"Top topic: {ranked[0]['query']} (score: {ranked[0]['score']})")


if __name__ == "__main__":
    main()