#!/usr/bin/env python3
"""Strictly validate an agent-authored SoapCraft Pro blog record."""

import json
import re
import sys
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse

BANNED_PHRASES = ["map pin", "i run web align", "googling"]
BANNED_PATTERNS = [
    re.compile(r"—"),
    re.compile(r"in today's world", re.IGNORECASE),
    re.compile(r"it's not just \w+, it's \w+", re.IGNORECASE),
    re.compile(r"hope this finds you well", re.IGNORECASE),
    re.compile(r"i am an AI", re.IGNORECASE),
    re.compile(r"as an AI language model", re.IGNORECASE),
]
VALID_CATEGORIES = [
    "Soap Calculators", "Soap Recipes", "Soap Making Guides",
    "Troubleshooting", "Soap Business", "Ingredients",
]
VALID_REVIEW_STATUSES = {"draft", "review", "approved", "published"}
MIN_WORD_COUNT = 800
SLUG_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
ISO_PATTERN = re.compile(
    r"^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})?)?$"
)


def _nonempty_string(value: object) -> bool:
    return isinstance(value, str) and bool(value.strip())


def _string_array(value: object, *, nonempty: bool = False) -> bool:
    return isinstance(value, list) and (not nonempty or bool(value)) and all(
        _nonempty_string(item) for item in value
    )


def _is_iso_date(value: object) -> bool:
    if not isinstance(value, str) or not value.strip() or not ISO_PATTERN.fullmatch(value):
        return False
    try:
        datetime.fromisoformat(value.replace("Z", "+00:00"))
        return True
    except ValueError:
        return False


def _valid_source(source: object) -> bool:
    if not isinstance(source, dict):
        return False
    if not _nonempty_string(source.get("title")) or not _is_iso_date(source.get("accessedAt")):
        return False
    url = source.get("url")
    if not _nonempty_string(url):
        return False
    try:
        parsed = urlparse(url)
        return parsed.scheme in {"http", "https"} and bool(parsed.hostname)
    except ValueError:
        return False


def validate_post(post: object) -> dict:
    """Return deterministic contract errors and warnings for one post."""
    errors: list[str] = []
    warnings: list[str] = []
    if not isinstance(post, dict):
        return {"valid": False, "errors": ["Invalid post: expected an object"],
                "warnings": [], "wordCount": 0}

    string_fields = ["slug", "title", "description", "content", "category",
                     "publishedAt", "author", "reviewStatus"]
    for field in string_fields:
        if field not in post:
            errors.append(f"Missing required field: {field}")
        elif not _nonempty_string(post[field]):
            errors.append(f"Invalid {field}: expected a non-empty string")

    slug = post.get("slug")
    if isinstance(slug, str) and not SLUG_PATTERN.fullmatch(slug):
        errors.append("Invalid slug: use lowercase letters, numbers, and single hyphens")

    published_at = post.get("publishedAt")
    if published_at is not None and not _is_iso_date(published_at):
        errors.append("Invalid publishedAt: expected an ISO 8601 date")

    tags = post.get("tags")
    if "tags" not in post:
        errors.append("Missing required field: tags")
    elif not _string_array(tags, nonempty=True):
        errors.append("Invalid tags: expected a non-empty array of strings")

    reading_time = post.get("readingTime")
    if "readingTime" not in post:
        errors.append("Missing required field: readingTime")
    elif isinstance(reading_time, bool) or not isinstance(reading_time, int) or reading_time <= 0:
        errors.append("Invalid readingTime: expected a positive integer")

    seo = post.get("seo")
    if "seo" not in post:
        errors.append("Missing required field: seo")
    elif not isinstance(seo, dict):
        errors.append("Invalid seo: expected an object")
    else:
        for field in ("title", "description"):
            if not _nonempty_string(seo.get(field)):
                errors.append(f"Invalid seo.{field}: expected a non-empty string")
        if not _string_array(seo.get("keywords"), nonempty=True):
            errors.append("Invalid seo.keywords: expected a non-empty array of strings")

    status = post.get("reviewStatus")
    if status is not None and status not in VALID_REVIEW_STATUSES:
        errors.append(f"Invalid reviewStatus: {status}")
    publishable = status in {"approved", "published"}

    for field in ("source", "sourceRevision", "image", "imageAlt", "reviewer"):
        if field in post and post[field] is not None and not _nonempty_string(post[field]):
            errors.append(f"Invalid {field}: expected a non-empty string")
    if "relatedSlugs" in post and not _string_array(post["relatedSlugs"]):
        errors.append("Invalid relatedSlugs: expected an array of strings")
    if "lastReviewed" in post and post["lastReviewed"] is not None and not _is_iso_date(post["lastReviewed"]):
        errors.append("Invalid lastReviewed: expected an ISO 8601 date")

    sources = post.get("sources")
    if sources is not None:
        if not isinstance(sources, list):
            errors.append("Invalid sources: expected an array")
        else:
            for index, source in enumerate(sources):
                if not _valid_source(source):
                    errors.append(f"Invalid source at index {index}: require title, http(s) URL, and accessedAt")
    if publishable:
        if not _nonempty_string(post.get("reviewer")):
            errors.append("Approved or published posts require reviewer")
        if not _is_iso_date(post.get("lastReviewed")):
            errors.append("Approved or published posts require valid lastReviewed")
        if not isinstance(sources, list) or not sources:
            errors.append("Approved or published posts require at least one source")

    cta = post.get("contextualCTA")
    if cta is not None:
        if not isinstance(cta, dict) or not _nonempty_string(cta.get("text")) or not _nonempty_string(cta.get("href")):
            errors.append("Invalid contextualCTA: require string text and href")
    if publishable and not isinstance(cta, dict):
        errors.append("Approved or published posts require a contextual product bridge")

    content = post.get("content")
    word_count = len(content.split()) if isinstance(content, str) else 0
    if isinstance(content, str) and content and word_count < MIN_WORD_COUNT:
        errors.append(f"Content is {word_count} words; minimum is {MIN_WORD_COUNT}")
    if isinstance(content, str):
        lowered = content.lower()
        for phrase in BANNED_PHRASES:
            if phrase in lowered:
                errors.append(f'Contains banned phrase: "{phrase}"')
        for pattern in BANNED_PATTERNS:
            if pattern.search(content):
                errors.append(f"Contains banned pattern: {pattern.pattern}")

    category = post.get("category")
    if category is not None and category not in VALID_CATEGORIES:
        errors.append(f'Invalid category "{category}". Must be one of: {", ".join(VALID_CATEGORIES)}')
    if isinstance(tags, list) and all(isinstance(tag, str) for tag in tags) and len(tags) < 2:
        warnings.append("Add at least two specific tags")

    return {"valid": not errors, "errors": errors, "warnings": warnings, "wordCount": word_count}


def main() -> int:
    if "--stdin" in sys.argv:
        post = json.load(sys.stdin)
    elif len(sys.argv) > 1:
        path = Path(sys.argv[1])
        if not path.exists():
            print(f"Error: file not found: {path}", file=sys.stderr)
            return 1
        post = json.loads(path.read_text())
    else:
        print("Usage: validate-seo-content.py <post.json> | --stdin", file=sys.stderr)
        return 1
    result = validate_post(post)
    print(json.dumps(result, indent=2))
    return 0 if result["valid"] else 1


if __name__ == "__main__":
    sys.exit(main())
