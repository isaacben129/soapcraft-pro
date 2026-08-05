#!/usr/bin/env python3
"""validate-seo-content.py — Validate a blog post against the content contract.

Checks:
  - Required fields present (slug, title, description, content, category, tags, etc.)
  - Banned phrases ("map pin", "I run Web Align", "Googling")
  - Banned patterns (em dashes, AI-phrasing)
  - Minimum word count (800)
  - Category must be valid
  - Product bridge present
  - Published posts must have lastReviewed date

Usage:
  python3 scripts/validate-seo-content.py <path-to-post.json>
  python3 scripts/validate-seo-content.py --stdin  # read JSON from stdin

Exit code 0 = valid, 1 = invalid.
"""

import json
import sys
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Add lib to path for imports
sys.path.insert(0, str(ROOT / "lib"))

# ── Validation rules ──────────────────────────────────────────

BANNED_PHRASES = ["map pin", "i run web align", "googling"]

BANNED_PATTERNS = [
    re.compile(r"—"),  # em dash
    re.compile(r"in today's world", re.IGNORECASE),
    re.compile(r"it's not just \w+, it's \w+", re.IGNORECASE),
    re.compile(r"hope this finds you well", re.IGNORECASE),
    re.compile(r"i am an AI", re.IGNORECASE),
    re.compile(r"as an AI language model", re.IGNORECASE),
]

VALID_CATEGORIES = [
    "Soap Calculators",
    "Soap Recipes",
    "Soap Making Guides",
    "Troubleshooting",
    "Soap Business",
    "Ingredients",
]

MIN_WORD_COUNT = 800


def validate_post(post: dict) -> dict:
    """Validate a blog post against the content contract."""
    errors = []
    warnings = []

    # Required fields
    for field in ["slug", "title", "description", "content", "category", "tags", "author", "readingTime", "seo"]:
        if field not in post or not post[field]:
            errors.append(f"Missing required field: {field}")

    # SEO sub-fields
    if "seo" in post:
        for sf in ["title", "description", "keywords"]:
            if sf not in post["seo"] or not post["seo"][sf]:
                errors.append(f"Missing seo.{sf}")

    # Review status
    if post.get("reviewStatus") == "published" and not post.get("lastReviewed"):
        warnings.append("Published post should have a lastReviewed date")

    # Content quality
    content = post.get("content", "")
    if content:
        word_count = len(content.split())
        if word_count < MIN_WORD_COUNT:
            warnings.append(f"Content is {word_count} words — minimum {MIN_WORD_COUNT} recommended")

        content_lower = content.lower()
        for phrase in BANNED_PHRASES:
            if phrase in content_lower:
                errors.append(f'Contains banned phrase: "{phrase}"')

        for pattern in BANNED_PATTERNS:
            if pattern.search(content):
                errors.append(f"Contains banned pattern: {pattern.pattern}")

    # Category validation
    if "category" in post and post["category"] not in VALID_CATEGORIES:
        errors.append(
            f'Invalid category "{post["category"]}". Must be one of: {", ".join(VALID_CATEGORIES)}'
        )

    # Product bridge
    cta = post.get("contextualCTA") or post.get("productBridge")
    if not cta:
        warnings.append("Missing product bridge — page should reference SoapCraft Pro")

    # Tags
    tags = post.get("tags", [])
    if not tags or len(tags) == 0:
        warnings.append("No tags — add at least 2 relevant tags")

    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "warnings": warnings,
        "wordCount": len(content.split()) if content else 0,
    }


def main():
    # Read input
    if "--stdin" in sys.argv:
        post = json.load(sys.stdin)
    elif len(sys.argv) > 1:
        path = Path(sys.argv[1])
        if not path.exists():
            print(f"Error: file not found: {path}", file=sys.stderr)
            sys.exit(1)
        with open(path) as f:
            post = json.load(f)
    else:
        print("Usage: validate-seo-content.py <path-to-post.json> | --stdin", file=sys.stderr)
        sys.exit(1)

    result = validate_post(post)

    # Output
    output = {
        "valid": result["valid"],
        "errors": result["errors"],
        "warnings": result["warnings"],
        "wordCount": result["wordCount"],
    }

    print(json.dumps(output, indent=2))
    sys.exit(0 if result["valid"] else 1)


if __name__ == "__main__":
    main()