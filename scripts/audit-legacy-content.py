#!/usr/bin/env python3
"""Classify legacy records without changing them."""
import importlib.util, json
from pathlib import Path
spec=importlib.util.spec_from_file_location("validator",Path(__file__).with_name("validate-seo-content.py")); module=importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
posts=json.loads(Path("lib/blog-data.json").read_text()); results=[]
for post in posts:
 result=module.validate_post(post); results.append({"slug":post.get("slug"),"valid":result["valid"],"errors":result["errors"],"wordCount":result["wordCount"]})
print(json.dumps({"total":len(results),"passing":sum(item["valid"] for item in results),"records":results},indent=2))
