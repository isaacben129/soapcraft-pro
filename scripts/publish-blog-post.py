#!/usr/bin/env python3
"""Confirmation-gated, atomic publishing for agent-authored blog records."""

import argparse
import fcntl
import importlib.util
import json
import os
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_STORE = ROOT / "lib" / "blog-data.json"
DEFAULT_AUDIT = ROOT / "gtm" / "publish-audit.jsonl"


def _load_validator():
    path = ROOT / "scripts" / "validate-seo-content.py"
    spec = importlib.util.spec_from_file_location("validate_seo_content", path)
    assert spec is not None
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module.validate_post


validate_post = _load_validator()


def _atomic_write_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, temp_name = tempfile.mkstemp(prefix=f".{path.name}.", dir=path.parent)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            json.dump(value, handle, indent=2)
            handle.write("\n")
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temp_name, path)
    except Exception:
        try:
            os.unlink(temp_name)
        except FileNotFoundError:
            pass
        raise


def _stage_audit(path: Path, event: dict) -> str:
    """Durably stage the complete next audit file without touching the store."""
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists() and not path.is_file():
        raise OSError(f"Audit destination is not a file: {path}")
    fd, temp_name = tempfile.mkstemp(prefix=f".{path.name}.", dir=path.parent)
    try:
        with os.fdopen(fd, "wb") as staged:
            if path.exists():
                with path.open("rb") as current:
                    while chunk := current.read(1024 * 1024):
                        staged.write(chunk)
            staged.write((json.dumps(event) + "\n").encode("utf-8"))
            staged.flush()
            os.fsync(staged.fileno())
        return temp_name
    except Exception:
        try:
            os.unlink(temp_name)
        except FileNotFoundError:
            pass
        raise


def publish_post(
    post_path: Path,
    confirm: bool = False,
    dry_run: bool = False,
    blog_data_path: Path = DEFAULT_STORE,
    audit_path: Path = DEFAULT_AUDIT,
) -> bool:
    """Validate and optionally publish exactly one approved record."""
    if not post_path.exists():
        raise ValueError(f"File not found: {post_path}")

    post = json.loads(post_path.read_text())
    if not isinstance(post, dict):
        raise ValueError("Post must be a JSON object")
    if post.get("reviewStatus") != "approved":
        raise ValueError("Publication requires reviewStatus: approved")

    final_post = dict(post)
    final_post["reviewStatus"] = "published"
    final_post["publishedAt"] = final_post.get("publishedAt") or datetime.now(
        timezone.utc
    ).date().isoformat()

    result = validate_post(final_post)
    if not result["valid"]:
        raise ValueError(f"Validation failed: {'; '.join(result['errors'])}")

    if dry_run:
        print(json.dumps({"valid": True, "dryRun": True, "slug": final_post["slug"],
                          "title": final_post["title"], "wordCount": result["wordCount"]}, indent=2))
        return True
    if not confirm:
        print("Validated. Use --confirm to publish, or --dry-run to inspect.")
        return True

    blog_data_path.parent.mkdir(parents=True, exist_ok=True)
    lock_path = Path(str(blog_data_path) + ".lock")
    # Keep the lock inode persistent. Unlinking it allows another publisher to
    # lock a new inode while a process still owns the old inode's flock.
    with lock_path.open("a+") as lock_handle:
        fcntl.flock(lock_handle, fcntl.LOCK_EX)
        blog_data = json.loads(blog_data_path.read_text()) if blog_data_path.exists() else []
        if not isinstance(blog_data, list) or not all(isinstance(item, dict) for item in blog_data):
            raise ValueError("Blog store must be a JSON array of objects")
        if any(item.get("slug") == final_post["slug"] for item in blog_data):
            raise ValueError(f"Slug already exists: {final_post['slug']}")

        blog_data.append(final_post)
        event = {
            "event": "blog_post_published",
            "slug": final_post["slug"],
            "reviewer": final_post["reviewer"],
            "publishedAt": final_post["publishedAt"],
            "recordedAt": datetime.now(timezone.utc).isoformat(),
        }
        staged_audit = _stage_audit(audit_path, event)
        try:
            # Complete the fallible audit write before replacing the content store.
            os.replace(staged_audit, audit_path)
            _atomic_write_json(blog_data_path, blog_data)
        finally:
            try:
                os.unlink(staged_audit)
            except FileNotFoundError:
                pass

    print(f"Published {final_post['slug']} to {blog_data_path}")
    return True


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("post", type=Path)
    action = parser.add_mutually_exclusive_group()
    action.add_argument("--confirm", action="store_true")
    action.add_argument("--dry-run", action="store_true")
    parser.add_argument("--store", type=Path, default=DEFAULT_STORE)
    parser.add_argument("--audit", type=Path, default=DEFAULT_AUDIT)
    args = parser.parse_args()
    try:
        publish_post(args.post, confirm=args.confirm, dry_run=args.dry_run,
                     blog_data_path=args.store, audit_path=args.audit)
        return 0
    except (ValueError, json.JSONDecodeError, OSError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
