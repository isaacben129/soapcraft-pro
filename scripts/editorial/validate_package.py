#!/usr/bin/env python3
"""Validate the release metadata for a versioned editorial package."""
import json, sys
from pathlib import Path
FAMILIES={"tool-support","diagnostic","commercial-operations","foundational","buying-comparison"}
RISKS={"GREEN","AMBER","RED"}
def main():
 p=Path(sys.argv[1] if len(sys.argv)>1 else "content/editorial/packages/price-handmade-soap-by-saleable-bar/package.json")
 data=json.loads(p.read_text()); errors=[]
 for key in ("packageId","state","riskClass","articleFamily","author","brief"):
  if not data.get(key): errors.append(f"Missing {key}")
 if data.get("riskClass") not in RISKS: errors.append("Invalid riskClass")
 if data.get("articleFamily") not in FAMILIES: errors.append("Invalid articleFamily")
 if data.get("riskClass")=="RED": errors.append("RED package requires human-only release path")
 review=data.get("review",{})
 if data.get("state") in {"approved","published"} and not all(review.get(k)=="pass" for k in ("claimAudit","utilityAudit","copyAudit","renderedQa")): errors.append("Approved package requires passing review evidence")
 print(json.dumps({"valid":not errors,"errors":errors},indent=2)); return 0 if not errors else 1
if __name__=="__main__": sys.exit(main())
