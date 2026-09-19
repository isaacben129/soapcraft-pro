import importlib.util
import json
import tempfile
import unittest
from unittest import mock
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def load_script(name: str):
    path = ROOT / "scripts" / name
    spec = importlib.util.spec_from_file_location(name.replace("-", "_"), path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


validator = load_script("validate-seo-content.py")
publisher = load_script("publish-blog-post.py")


def approved_post(**overrides):
    post = {
        "slug": "evidence-backed-soap-costing",
        "title": "Evidence-backed soap costing",
        "description": "A practical guide to calculating production costs without hiding assumptions.",
        "content": " ".join(["Evidence-backed soap costing guidance."] * 1500),
        "category": "Soap Business",
        "tags": ["soap costing", "profitability"],
        "publishedAt": "2026-08-11",
        "author": "SoapCraft Pro",
        "readingTime": 8,
        "image": "/blog/soap-costing.jpg",
        "seo": {
            "title": "Soap Costing Guide for Small-Batch Makers",
            "description": "Calculate soap costs using explicit inputs and reproducible formulas.",
            "keywords": ["soap costing", "soap cost per bar"],
        },
        "reviewStatus": "approved",
        "riskClass": "GREEN",
        "articleFamily": "commercial-operations",
        "reviewer": "independent-reviewer",
        "lastReviewed": "2026-08-11T00:00:00Z",
        "contextualCTA": {
            "text": "Calculate your real batch cost",
            "href": "/calculators/soap-cost-calculator",
        },
        "sources": [
            {"id": "product-fixture", "title": "SoapCraft costing fixture", "publisher": "SoapCraft Pro", "tier": "product", "url": "https://soapcraftpro.com/methodology", "accessedAt": "2026-08-11"},
            {"id": "primary-record", "title": "Primary record", "publisher": "Example Authority", "tier": "primary", "url": "https://example.org/record", "accessedAt": "2026-08-11"},
        ],
        "claims": [{"id": "cost-model", "text": "Cost decisions need explicit inputs.", "sourceIds": ["product-fixture", "primary-record"], "consequential": True, "status": "supported"}],
        "editorialBrief": {"readerSituation": "A seller knows ingredient spend but not saleable-bar cost.", "decision": "Set a defensible price.", "primaryQuestion": "How should I price handmade soap?", "tension": "A multiplier can hide costs.", "primaryIntent": "price handmade soap by cost per bar", "originalValue": "A reproducible decision model.", "limitations": "Illustrative inputs are not universal advice."},
        "reviewManifest": {"claimAudit": "pass", "contradictionAudit": "pass", "utilityAudit": "pass", "copyAudit": "pass", "seoAudit": "pass", "conversionAudit": "pass", "renderedQa": "pass"},
    }
    post.update(overrides)
    return post


class ValidationTests(unittest.TestCase):
    def test_rejects_wrong_types_without_crashing(self):
        mutations = {
            "title": True,
            "tags": "soap, costing",
            "readingTime": True,
            "seo": {"title": "Title", "description": "Description", "keywords": "soap"},
            "sources": ["not an object"],
            "contextualCTA": {"text": True, "href": "/calculator"},
        }
        for field, value in mutations.items():
            with self.subTest(field=field):
                result = validator.validate_post(approved_post(**{field: value}))
                self.assertFalse(result["valid"], result)

    def test_rejects_invalid_status_slug_dates_and_url_without_crashing(self):
        mutations = {
            "slug": "Not--A-Slug",
            "reviewStatus": "true",
            "publishedAt": "2026-02-30",
            "lastReviewed": "yesterday",
            "sources": [{"title": "Broken", "url": "https://[", "accessedAt": "2026-08-11"}],
        }
        for field, value in mutations.items():
            with self.subTest(field=field):
                result = validator.validate_post(approved_post(**{field: value}))
                self.assertFalse(result["valid"], result)

    def test_rejects_non_object_input(self):
        self.assertFalse(validator.validate_post([])["valid"])

    def test_rejects_short_content(self):
        result = validator.validate_post(approved_post(content="Too short."))
        self.assertFalse(result["valid"])
        self.assertTrue(any("minimum" in error.lower() for error in result["errors"]))

    def test_rejects_missing_product_bridge(self):
        post = approved_post()
        post.pop("contextualCTA")
        result = validator.validate_post(post)
        self.assertFalse(result["valid"])
        self.assertTrue(any("product bridge" in error.lower() for error in result["errors"]))

    def test_rejects_approved_post_without_review_evidence(self):
        post = approved_post(reviewer=None, lastReviewed=None)
        result = validator.validate_post(post)
        self.assertFalse(result["valid"])
        self.assertTrue(any("reviewer" in error.lower() for error in result["errors"]))
        self.assertTrue(any("lastreviewed" in error.lower() for error in result["errors"]))

    def test_rejects_publishable_post_without_sources(self):
        result = validator.validate_post(approved_post(sources=[]))
        self.assertFalse(result["valid"])
        self.assertTrue(any("source" in error.lower() for error in result["errors"]))

    def test_accepts_complete_approved_post(self):
        result = validator.validate_post(approved_post())
        self.assertTrue(result["valid"], result)


class PublishingTests(unittest.TestCase):
    def test_rejects_store_that_is_not_a_list_of_objects(self):
        for existing in ({"slug": "old"}, ["not an object"]):
            with self.subTest(existing=existing), tempfile.TemporaryDirectory() as tmp:
                tmp_path = Path(tmp)
                post_path = tmp_path / "approved.json"
                store_path = tmp_path / "blog-data.json"
                post_path.write_text(json.dumps(approved_post()))
                store_path.write_text(json.dumps(existing))
                with self.assertRaises(ValueError):
                    publisher.publish_post(post_path, confirm=True, blog_data_path=store_path,
                                           audit_path=tmp_path / "audit.jsonl")
                self.assertEqual(json.loads(store_path.read_text()), existing)

    def test_audit_write_failure_leaves_store_and_persistent_lock_unchanged(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            post_path = tmp_path / "approved.json"
            store_path = tmp_path / "blog-data.json"
            audit_path = tmp_path / "audit.jsonl"
            post_path.write_text(json.dumps(approved_post()))
            store_path.write_text("[]")

            with mock.patch.object(publisher, "_stage_audit", side_effect=OSError("disk full")):
                with self.assertRaises(OSError):
                    publisher.publish_post(post_path, confirm=True, blog_data_path=store_path,
                                           audit_path=audit_path)

            self.assertEqual(json.loads(store_path.read_text()), [])
            self.assertTrue(Path(str(store_path) + ".lock").exists())

    def test_dry_run_rejects_unapproved_post(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "draft.json"
            path.write_text(json.dumps(approved_post(reviewStatus="draft")))
            with self.assertRaises(ValueError):
                publisher.publish_post(path, dry_run=True)

    def test_confirm_publishes_exactly_once_to_supplied_store(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            post_path = tmp_path / "approved.json"
            store_path = tmp_path / "blog-data.json"
            audit_path = tmp_path / "publish-audit.jsonl"
            post_path.write_text(json.dumps(approved_post()))
            store_path.write_text("[]")

            publisher.publish_post(
                post_path,
                confirm=True,
                blog_data_path=store_path,
                audit_path=audit_path,
            )
            published = json.loads(store_path.read_text())
            self.assertEqual(len(published), 1)
            self.assertEqual(published[0]["reviewStatus"], "published")
            self.assertEqual(published[0]["reviewer"], "independent-reviewer")
            self.assertEqual(len(audit_path.read_text().strip().splitlines()), 1)

            with self.assertRaises(ValueError):
                publisher.publish_post(
                    post_path,
                    confirm=True,
                    blog_data_path=store_path,
                    audit_path=audit_path,
                )


if __name__ == "__main__":
    unittest.main()
