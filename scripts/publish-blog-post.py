#!/usr/bin/env python3
"""publish-blog-post.py — Publish a validated blog post to the content store.

This script is PLUMBING ONLY — it moves data and posts on confirm.
All creative/editorial judgment is the AGENT's job, done in-session.

Usage:
  # Validate first
  python3 scripts/validate-seo-content.py gtm/draft-post.json

  # Publish on explicit confirm
  python3 scripts/publish-blog-post.py gtm/draft-post.json --confirm

  # Dry run (validate only, don't publish)
  python3 scripts/publish-blog-post.py gtm/draft-post.json --dry-run

The --confirm flag is required for actual publishing. Without it, the script
only validates and reports what would happen.
"""

import json
import sys
import os
import shutil
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parent.parent

# ── Publish ────────────────────────────────────────────────────

def publish_post(post_path: Path, confirm: bool = False, dry_run: bool = False):
    """Publish a blog post to the content store."""

    # Load the post
    if not post_path.exists():
        print(f"Error: file not found: {post_path}", file=sys.stderr)
        sys.exit(1)

    with open(post_path) as f:
        post = json.load(f)

    # Validate first
    print(f"Validating {post_path}...")
    result = validate_post(post)

    if not result["valid"]:
        print("VALIDATION FAILED — not publishing:")
        for error in result["errors"]:
            print(f"  ERROR: {error}")
        for warning in result["warnings"]:
            print(f"  WARNING: {warning}")
        sys.exit(1)

    print(f"Validation passed ({result['wordCount']} words)")

    if dry_run:
        print("DRY RUN — would publish:")
        print(f"  slug: {post.get('slug')}")
        print(f"  title: {post.get('title')}")
        print(f"  category: {post.get('category')}")
        print(f"  reviewStatus: published")
        return

    if not confirm:
        print("Use --confirm to publish, or --dry-run to see what would happen.")
        sys.exit(0)

    # ── ACTUAL PUBLISH ──────────────────────────────────────
    # 1. Update reviewStatus to "published"
    post["reviewStatus"] = "published"
    post["lastReviewed"] = datetime.utcnow().isoformat()

    # 2. Write to the blog data file
    blog_data_path = ROOT / "lib" / "blog-data.json"

    with open(blog_data_path) as f:
        blog_data = json.load(f)

    # Check for duplicate slug
    existing_slugs = {p.get("slug") for p in blog_data}
    if post.get("slug") in existing_slugs:
        print(f"WARNING: slug '{post['slug']}' already exists — overwriting")

    # Add or replace the post
    blog_data = [p for p in blog_data if p.get("slug") != post.get("slug")]
    blog_data.append(post)

    with open(blog_data_path, "w") as f:
        json.dump(blog_data, f, indent=2)

    # 3. Log the publication
    print(f"Published: {post.get('slug')} → lib/blog-data.json")
    print(f"  Title: {post.get('title')}")
    print(f"  Words: {result['wordCount']}")
    print(f"  Category: {post.get('category')}")

    # 4. Track the publication event
    # (The analytics route will receive this via the SEO funnel)

    return True


def validate_post(post: dict) -> dict:
    """Run the same validation as validate-seo-content.py."""
    import subprocess

    # Write post to temp file for validation
    temp_path = ROOT / "gtm" / "_temp_validate.json"
    os.makedirs(ROOT / "gtm", exist_ok=True)
    with open(temp_path, "w") as f:
        json.dump(post, f, indent=2)

    result = subprocess.run(
        [sys.executable, str(ROOT / "scripts" / "validate-seo-content.py"), str(temp_path)],
        capture_output=True,
        text=True,
    )

    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError:
        return {"valid": False, "errors": [f"Validation output parse error: {result.stdout}"], "warnings": [], "wordCount": 0}


def main():
    if len(sys.argv) < 2:
        print("Usage: publish-blog-post.py <path-to-post.json> [--confirm] [--dry-run]", file=sys.stderr)
        sys.exit(1)

    post_path = Path(sys.argv[1])
    confirm = "--confirm" in sys.argv
    dry_run = "--dry-run" in sys.argv

    publish_post(post_path, confirm=confirm, dry_run=dry_run)


if __name__ == "__main__":
    main()