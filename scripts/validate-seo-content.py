#!/usr/bin/env python3
"""Validate evidence-first SoapCraft editorial records. Never generates copy."""
import json, re, sys
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse

CATEGORIES = {"Soap Calculators", "Soap Recipes", "Soap Making Guides", "Troubleshooting", "Soap Business", "Ingredients", "Production", "Safety", "Formulation", "Business"}
RISKS = {"GREEN", "AMBER", "RED"}
FAMILIES = {"tool-support", "diagnostic", "commercial-operations", "foundational", "buying-comparison"}
TIERS = {"official", "primary", "product", "supplier", "practitioner", "community"}
STATUSES = {"draft", "review", "approved", "published"}
SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
BANNED = [re.compile(pattern, re.I) for pattern in [r"in today's world", r"it's not just \w+, it's \w+", r"hope this finds you well", r"i am an ai", r"as an ai language model", r"in conclusion", r"in the ever-evolving"]]

def nonempty(value): return isinstance(value, str) and bool(value.strip())
def iso(value):
    if not nonempty(value): return False
    try: datetime.fromisoformat(value.replace("Z", "+00:00")); return True
    except ValueError: return False
def strings(value, nonempty_list=False): return isinstance(value, list) and (not nonempty_list or bool(value)) and all(nonempty(item) for item in value)
def source(value):
    if not isinstance(value, dict) or not all(nonempty(value.get(key)) for key in ("id", "title", "publisher", "tier", "accessedAt")): return False
    if not SLUG.fullmatch(value["id"]) or value["tier"] not in TIERS or not iso(value["accessedAt"]): return False
    try: return urlparse(value.get("url", "")).scheme == "https" and bool(urlparse(value["url"]).hostname)
    except ValueError: return False
def brief(value): return isinstance(value, dict) and all(nonempty(value.get(key)) for key in ("readerSituation", "decision", "primaryQuestion", "tension", "primaryIntent", "originalValue", "limitations"))
def manifest(value, risk):
    required = ("claimAudit", "contradictionAudit", "utilityAudit", "copyAudit", "seoAudit", "conversionAudit", "renderedQa")
    return isinstance(value, dict) and all(value.get(key) == "pass" for key in required) and (risk != "AMBER" or value.get("independentEvidenceReview") == "pass")

def validate_post(post):
    errors, warnings = [], []
    if not isinstance(post, dict): return {"valid": False, "errors": ["Invalid post: expected object"], "warnings": [], "wordCount": 0}
    for key in ("slug", "title", "description", "content", "category", "publishedAt", "author", "reviewStatus"):
        if not nonempty(post.get(key)): errors.append(f"Missing or invalid {key}")
    if nonempty(post.get("slug")) and not SLUG.fullmatch(post["slug"]): errors.append("Invalid slug")
    if not iso(post.get("publishedAt")): errors.append("Invalid publishedAt")
    if post.get("category") not in CATEGORIES: errors.append("Invalid category")
    if post.get("reviewStatus") not in STATUSES: errors.append("Invalid reviewStatus")
    if not strings(post.get("tags"), True): errors.append("Invalid tags")
    if isinstance(post.get("readingTime"), bool) or not isinstance(post.get("readingTime"), int) or post.get("readingTime", 0) <= 0: errors.append("Invalid readingTime")
    seo = post.get("seo")
    if not isinstance(seo, dict) or not nonempty(seo.get("title")) or not nonempty(seo.get("description")) or not strings(seo.get("keywords"), True): errors.append("Invalid seo")
    cta = post.get("contextualCTA")
    if cta is not None and (not isinstance(cta, dict) or not nonempty(cta.get("text")) or not nonempty(cta.get("href")) or not cta["href"].startswith("/") or cta["href"].startswith("//")): errors.append("Invalid contextualCTA")
    sources = post.get("sources")
    if sources is not None and (not isinstance(sources, list) or not all(source(item) for item in sources)): errors.append("Invalid sources")
    publishable = post.get("reviewStatus") in {"approved", "published"}
    content = post.get("content", ""); word_count = len(content.split()) if isinstance(content, str) else 0
    minimum = 1500 if publishable else 800
    if word_count < minimum: errors.append(f"Content is {word_count} words; minimum is {minimum}")
    if isinstance(content, str):
        for pattern in BANNED:
            if pattern.search(content): errors.append(f"Contains banned pattern: {pattern.pattern}")
    if publishable:
        risk = post.get("riskClass")
        if risk not in RISKS: errors.append("Published content requires riskClass")
        if post.get("articleFamily") not in FAMILIES: errors.append("Published content requires articleFamily")
        if risk == "RED": errors.append("RED content cannot enter the AI-only publication lane")
        if not nonempty(post.get("reviewer")) or post.get("reviewer") == post.get("author"): errors.append("Published content requires an independent reviewer")
        if not iso(post.get("lastReviewed")): errors.append("Published content requires lastReviewed")
        if not isinstance(sources, list) or len(sources) < 2: errors.append("Published content requires at least two sources")
        if not brief(post.get("editorialBrief")): errors.append("Published content requires editorialBrief")
        if not manifest(post.get("reviewManifest"), risk): errors.append("Published content requires a passing reviewManifest")
        if not isinstance(cta, dict): errors.append("Published content requires a product bridge (contextualCTA)")
        claims = post.get("claims")
        if not isinstance(claims, list) or not claims: errors.append("Published content requires a claim registry")
        else:
            ids = {item.get("id") for item in sources if isinstance(item, dict)}
            for claim in claims:
                if not isinstance(claim, dict) or not nonempty(claim.get("id")) or not nonempty(claim.get("text")) or not strings(claim.get("sourceIds"), True): errors.append("Invalid claim")
                elif any(item not in ids for item in claim["sourceIds"]) or (claim.get("consequential") is True and claim.get("status") != "supported"): errors.append(f"Unsupported claim: {claim['id']}")
    return {"valid": not errors, "errors": errors, "warnings": warnings, "wordCount": word_count}

def main():
    if "--stdin" in sys.argv: post = json.load(sys.stdin)
    elif len(sys.argv) == 2: post = json.loads(Path(sys.argv[1]).read_text())
    else: print("Usage: validate-seo-content.py <post.json> | --stdin", file=sys.stderr); return 1
    result = validate_post(post); print(json.dumps(result, indent=2)); return 0 if result["valid"] else 1
if __name__ == "__main__": sys.exit(main())
