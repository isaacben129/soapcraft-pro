#!/usr/bin/env python3
"""SoapCraft Pro Planning Package Verifier.

Computes: DAG acyclicity, stale-language checks, capability-to-acceptance
coverage, acceptance-to-slice coverage, slice coverage, Markdown fence checks,
and source-boundary verification. Produces a machine-readable report under
.studio/verification-report.json.

Does NOT modify source files. Read-only analysis.
"""

import json
import hashlib
import os
import re
import sys
from collections import defaultdict
from datetime import datetime, timezone

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STUDIO = os.path.join(REPO, ".studio")
PRODUCT = os.path.join(REPO, "product")

def load_json(path):
    with open(path) as f:
        return json.load(f)

def save_json(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2, default=str)

def check_dag_acyclicity(slices):
    """Check that the slice dependency graph is a DAG (no cycles)."""
    slice_map = {s["id"]: s for s in slices}
    # Build adjacency list: id -> dependencies
    adj = {s["id"]: list(s.get("dependencies", [])) for s in slices}
    
    # Detect cycles using DFS with coloring
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {sid: WHITE for sid in adj}
    cycles = []
    path = []
    
    def dfs(node):
        color[node] = GRAY
        path.append(node)
        for dep in adj.get(node, []):
            if dep not in color:
                continue  # Skip missing deps
            if color[dep] == GRAY:
                cycle_start = path.index(dep)
                cycles.append(path[cycle_start:] + [dep])
            elif color[dep] == WHITE:
                dfs(dep)
        path.pop()
        color[node] = BLACK
    
    for sid in adj:
        if color[sid] == WHITE:
            dfs(sid)
    
    is_acyclic = len(cycles) == 0
    return {
        "check": "DAG acyclicity",
        "result": "PASS" if is_acyclic else "FAIL",
        "acyclic": is_acyclic,
        "cycles_found": cycles,
        "total_slices": len(slices)
    }

def check_stale_language(slices, acceptance):
    """Scan for placeholder/TODO/stale language in slice and acceptance data."""
    banned_patterns = [
        r'\bTODO\b', r'\bFIXME\b', r'\bplaceholder\b', r'\bTBD\b',
        r'\bnot yet\b.*\bimplemented\b', r'\bwill be added\b',
        r'\bno dedicated capability\b', r'\bDEFERRED\b.*\bwithout gate\b'
    ]
    issues = []
    
    # Check slices for stale language
    for s in slices:
        text = json.dumps(s).lower()
        for pattern in banned_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                issues.append({
                    "check": "stale-language",
                    "scope": f"SLICE-{s['id']}",
                    "pattern": pattern,
                    "matches": matches
                })
    
    # Check acceptance.json for placeholder markers
    acc_text = json.dumps(acceptance).lower()
    for pattern in banned_patterns:
        matches = re.findall(pattern, acc_text, re.IGNORECASE)
        if matches and "MKT-DEFERRED-SELLER-PACK" not in pattern:
            issues.append({
                "check": "stale-language",
                "scope": "acceptance.json",
                "pattern": pattern,
                "matches": matches
            })
    
    return {
        "check": "Stale language scan",
        "result": "PASS" if not issues else "FAIL",
        "issues_found": len(issues),
        "issues": issues
    }

def check_capability_to_acceptance_coverage(acceptance):
    """Every acceptance capability must have acceptanceRows."""
    caps = acceptance.get("capabilities", [])
    missing_rows = []
    for c in caps:
        rows = c.get("acceptanceRows", [])
        if not rows:
            missing_rows.append({
                "capability_id": c["id"],
                "capability_name": c["name"],
                "issue": "No acceptanceRows defined"
            })
    
    # Also check flow-level acceptance
    flows = acceptance.get("flows", [])
    flow_issues = []
    for f in flows:
        rows = f.get("acceptanceRows", [])
        if not rows:
            flow_issues.append({
                "flow_id": f["id"],
                "flow_name": f["name"],
                "issue": "No acceptanceRows defined"
            })
    
    return {
        "check": "Capability-to-acceptance coverage",
        "result": "PASS" if not missing_rows and not flow_issues else "FAIL",
        "total_capabilities": len(caps),
        "capabilities_with_rows": len(caps) - len(missing_rows),
        "capabilities_missing_rows": missing_rows,
        "total_flows": len(flows),
        "flows_with_rows": len(flows) - len(flow_issues),
        "flows_missing_rows": flow_issues
    }

def check_acceptance_to_slice_coverage(acceptance, slices):
    """Every acceptance capability must be owned by at least one slice or explicitly blocked."""
    cap_ids = set(c["id"] for c in acceptance.get("capabilities", []))
    flow_ids = set(f["id"] for f in acceptance.get("flows", []))
    all_ids = cap_ids | flow_ids | {"MKT-DEFERRED-SELLER-PACK"}
    
    slice_cap_ids = set()
    slice_flow_ids = set()
    for s in slices:
        slice_cap_ids.update(s.get("capabilityIds", []))
        # Check if acceptanceIds reference flow IDs
        for aid in s.get("acceptanceIds", []):
            if aid.startswith("F"):
                slice_flow_ids.add(aid)
    
    covered = slice_cap_ids | slice_flow_ids | {"MKT-DEFERRED-SELLER-PACK"}
    
    missing_from_slices = all_ids - covered
    # But some might be covered via acceptanceIds that match capability IDs
    # Let me recheck: acceptanceIds in slices should cover capability IDs
    slice_acceptance_ids = set()
    for s in slices:
        slice_acceptance_ids.update(s.get("acceptanceIds", []))
    
    # Check which acceptance IDs in acceptance.json are NOT covered by any slice
    all_acceptance_ids = set()
    for c in acceptance.get("capabilities", []):
        all_acceptance_ids.add(c["id"])
    for f in acceptance.get("flows", []):
        all_acceptance_ids.add(f["id"])
    all_acceptance_ids.add("MKT-DEFERRED-SELLER-PACK")
    
    uncovered = all_acceptance_ids - slice_acceptance_ids
    
    return {
        "check": "Acceptance-to-slice coverage",
        "result": "PASS" if not uncovered else "FAIL",
        "total_acceptance_ids": len(all_acceptance_ids),
        "covered_by_slices": len(all_acceptance_ids - uncovered),
        "uncovered_ids": sorted(uncovered),
        "slice_acceptance_ids_count": len(slice_acceptance_ids)
    }

def check_slice_coverage(slices, acceptance):
    """Every slice must have capabilityIds and acceptanceIds."""
    issues = []
    for s in slices:
        sid = s["id"]
        caps = s.get("capabilityIds", [])
        acc_ids = s.get("acceptanceIds", [])
        if not caps and not acc_ids:
            issues.append({
                "slice": sid,
                "name": s["name"],
                "issue": "Both capabilityIds and acceptanceIds are empty"
            })
        elif not acc_ids and caps:
            issues.append({
                "slice": sid,
                "name": s["name"],
                "issue": "acceptanceIds empty but capabilityIds present"
            })
    
    return {
        "check": "Slice coverage",
        "result": "PASS" if not issues else "FAIL",
        "total_slices": len(slices),
        "issues": issues
    }

def check_markdown_fences(product_dir):
    """Check Markdown files for balanced fences."""
    results = []
    for fname in os.listdir(product_dir):
        if not fname.endswith(".md"):
            continue
        fpath = os.path.join(product_dir, fname)
        with open(fpath) as f:
            content = f.read()
        fences = re.findall(r'^```', content, re.MULTILINE)
        if len(fences) % 2 != 0:
            results.append({
                "file": fname,
                "issue": f"Odd number of markdown fences: {len(fences)}",
                "fence_count": len(fences)
            })
    
    return {
        "check": "Markdown fence balance",
        "result": "PASS" if not results else "FAIL",
        "files_checked": len([f for f in os.listdir(product_dir) if f.endswith(".md")]),
        "issues": results
    }

def check_gate_consistency(acceptance, skill_receipts, slice_ledger):
    """Check that Gate_C and Gate_A are consistent across artifacts."""
    issues = []
    
    acc_gates = acceptance.get("gates", {})
    receipts_gates = skill_receipts.get("gateStatus", {})
    
    # Check Gate_C
    acc_gate_c = acc_gates.get("Gate_C", "")
    receipt_gate_c = receipts_gates.get("Gate_C", "")
    
    acc_c_pass = "PASS" in str(acc_gate_c)
    receipt_c_pass = "PASS" in str(receipt_gate_c)
    slice_gate_c = slice_ledger.get("gateDefinitions", {}).get("Gate_C", {})
    slice_c_pass = slice_gate_c.get("status") == "PASS" and slice_gate_c.get("scopeApproved") is True

    if len({acc_c_pass, receipt_c_pass, slice_c_pass}) != 1:
        issues.append({
            "gate": "Gate_C",
            "issue": "Gate_C status is inconsistent across acceptance, skill receipts, and slice ledger",
            "acceptance_value": acc_gate_c,
            "receipts_value": receipt_gate_c,
            "slice_value": slice_gate_c
        })
    
    # Check Gate_A
    acc_gate_a = acc_gates.get("Gate_A", "")
    receipt_gate_a = receipts_gates.get("Gate_A", "")
    slice_gate_a = slice_ledger.get("gateDefinitions", {}).get("Gate_A", {})

    if "RELEASE_ACCEPTED" not in str(acc_gate_a) or "RELEASE_ACCEPTED" not in str(receipt_gate_a):
        issues.append({
            "gate": "Gate_A",
            "issue": "Gate_A must reserve the literal RELEASE_ACCEPTED in acceptance and skill receipts",
            "acceptance_value": acc_gate_a,
            "receipts_value": receipt_gate_a
        })
    if slice_gate_a.get("status") not in {"PENDING", "PASS"}:
        issues.append({
            "gate": "Gate_A",
            "issue": "Slice-ledger Gate_A has an invalid status",
            "slice_value": slice_gate_a
        })
    if "COMPREHENSIVE_UTILITY_HUB" in str(acc_gate_a) or "COMPREHENSIVE_UTILITY_HUB" in str(receipt_gate_a):
        issues.append({
            "gate": "Gate_A",
            "issue": "Gate_A uses COMPREHENSIVE_UTILITY_HUB instead of required literal RELEASE_ACCEPTED",
            "acceptance_value": acc_gate_a,
            "receipts_value": receipt_gate_a
        })
    
    return {
        "check": "Gate consistency",
        "result": "PASS" if not issues else "FAIL",
        "issues": issues
    }

def check_contradiction_resolution(contract_critique_path):
    """Check the current build-blocker register, not superseded critique history."""
    with open(contract_critique_path) as f:
        content = f.read()

    contradictions = re.findall(r'### Contradiction \d+: (.+?)(?=\n###|\n##|\Z)', content, re.DOTALL)
    marker = "## Current Contract Status"
    current = (
        content.split(marker, 1)[1].split("\n## ", 1)[0]
        if marker in content
        else "BUILD_BLOCKER: current status section missing"
    )
    unresolved = [
        line.strip()[:160]
        for line in current.splitlines()
        if line.strip().startswith("BUILD_BLOCKER:")
    ]

    return {
        "check": "Contradiction resolution",
        "result": "BLOCKED" if unresolved else "PASS",
        "documented_contradictions": len(contradictions),
        "unresolved_items": len(unresolved),
        "sample_unresolved": unresolved[:10]
    }

def check_source_boundary(repo_path):
    """Verify all tracked and untracked source work matches the sealed planning baseline."""
    import subprocess
    result = subprocess.run(
        ["git", "status", "--porcelain=v1", "--untracked-files=all"],
        capture_output=True, text=True, cwd=repo_path
    )
    changed_files = []
    for line in result.stdout.splitlines():
        path = line[3:]
        if " -> " in path:
            path = path.split(" -> ", 1)[1]
        changed_files.append(path)

    planning_patterns = [r'^product/', r'^\.studio/', r'^flowchart/']
    source_patterns = [
        r'^app/', r'^components/', r'^lib/', r'^db/', r'^scripts/',
        r'^node_modules', r'^tailwind.config', r'^tsconfig', r'^next.config',
        r'^vercel', r'^package', r'^middleware'
    ]
    planning_changed = []
    source_changed = []
    other_changed = []
    for f in changed_files:
        if any(re.match(p, f) for p in planning_patterns):
            planning_changed.append(f)
        elif any(re.match(p, f) for p in source_patterns):
            source_changed.append(f)
        else:
            other_changed.append(f)
    source_changed = sorted(set(source_changed))

    baseline_path = os.path.join(STUDIO, "source-boundary-baseline.json")
    baseline = load_json(baseline_path) if os.path.exists(baseline_path) else {}
    acknowledged = set(baseline.get("preExistingSourceFiles", []))
    unacknowledged = sorted(set(source_changed) - acknowledged)

    digest = hashlib.sha256()
    for relative_path in source_changed:
        digest.update(relative_path.encode() + b"\0")
        absolute_path = os.path.join(repo_path, relative_path)
        if os.path.isfile(absolute_path):
            with open(absolute_path, "rb") as source_file:
                digest.update(source_file.read())
        else:
            digest.update(b"<missing>")
        digest.update(b"\0")
    current_hash = digest.hexdigest()
    expected_hash = baseline.get("sourceWorkingTreeSha256AtReadiness")
    hash_matches = bool(expected_hash) and current_hash == expected_hash

    return {
        "check": "Source boundary verification",
        "result": "PASS" if not unacknowledged and hash_matches else "FAIL",
        "total_changed": len(changed_files),
        "planning_artifacts_changed": sorted(set(planning_changed)),
        "source_files_changed": source_changed,
        "acknowledged_pre_existing_source_files": sorted(set(source_changed) & acknowledged),
        "unacknowledged_source_files": unacknowledged,
        "source_working_tree_sha256": current_hash,
        "source_hash_matches_baseline": hash_matches,
        "other_changed": sorted(set(other_changed)),
        "note": "Tracked and untracked source paths and bytes must match the sealed planning baseline; new or altered source work fails this gate."
    }

def check_normative_contract_semantics(acceptance, slices):
    """Verify settled decisions appear in every normative interface required to start build."""
    paths = {
        "calculation": os.path.join(PRODUCT, "CALCULATION-SPEC.md"),
        "architecture": os.path.join(PRODUCT, "ARCHITECTURE.md"),
        "readiness": os.path.join(PRODUCT, "CONTRACT-READINESS.md"),
        "critique": os.path.join(PRODUCT, "CONTRACT-CRITIQUE.md"),
    }
    texts = {}
    for name, path in paths.items():
        with open(path) as f:
            texts[name] = f.read()

    required = {
        "calculation": [
            "oilWeightTotal = user-entered target oil mass",
            "retain full numeric precision",
            "KOHPercentOfAlkaliEquivalents",
            "lyeNaOH_asSupplied",
            "lyeKOH_asSupplied",
            "Mode A: Water-to-Lye Ratio",
            "Mode B: Lye Concentration",
            "Mode C: Water as % of Oils",
            "priceFromGrossMargin",
            "calibratedDensity",
            "Chemistry Source Hierarchy and Manifest",
            "PUBLIC_CHEMISTRY_ENABLED",
        ],
        "architecture": [
            "existing NextAuth",
            "Neon PostgreSQL",
            "Drizzle",
            "Dodo Payments — one-time Seller Pack only",
            "409 Conflict",
        ],
        "readiness": [
            "**Status:** `BUILD_READY`",
            "**Public release status:** `NOT_RELEASE_READY`",
            "SLICE-003 — Deterministic Formulation Engine and Source Boundary",
        ],
        "critique": [
            "**Build status:** BUILD AUTHORIZED",
            "**Current build-blocker register:** None",
            "**Fail-closed publication gates:**",
        ],
    }
    missing = []
    for artifact, tokens in required.items():
        for token in tokens:
            if token not in texts[artifact]:
                missing.append({"artifact": artifact, "required": token})

    gate_c = slices.get("gateDefinitions", {}).get("Gate_C", {})
    if gate_c.get("status") != "PASS" or gate_c.get("scopeApproved") is not True:
        missing.append({"artifact": "slices", "required": "Gate_C PASS with scopeApproved=true"})
    if "BUILD_AUTHORIZED" not in acceptance.get("approvalBoundary", ""):
        missing.append({"artifact": "acceptance", "required": "BUILD_AUTHORIZED approval boundary"})

    return {
        "check": "Normative contract semantics",
        "result": "PASS" if not missing else "FAIL",
        "requirements_checked": sum(len(v) for v in required.values()) + 2,
        "missing": missing,
        "note": "This proves contract coherence, not implementation completion. Source deltas are owned by slices and tested during delivery."
    }


def check_acceptance_gate_compatibility(acceptance):
    """Prove the planning manifest is consumable by the fail-closed evidence gate."""
    valid_boundaries = {"unit", "integration", "e2e", "device", "deployed", "manual_visual"}
    expected_ids = {
        c["id"] for c in acceptance.get("capabilities", []) if isinstance(c, dict) and c.get("id")
    } | {
        f["id"] for f in acceptance.get("flows", []) if isinstance(f, dict) and f.get("id")
    } | {"MKT-DEFERRED-SELLER-PACK"}
    requirements = [r for r in acceptance.get("requirements", []) if isinstance(r, dict)]
    seen = defaultdict(int)
    malformed = []
    for requirement in requirements:
        req_id = requirement.get("id")
        if req_id:
            seen[req_id] += 1
        if not req_id or not requirement.get("description"):
            malformed.append({"id": req_id, "issue": "id and description are required"})
        if requirement.get("boundary") not in valid_boundaries:
            malformed.append({"id": req_id, "issue": "unsupported boundary"})
        if requirement.get("scope", "in") not in {"in", "out"}:
            malformed.append({"id": req_id, "issue": "scope must be in or out"})
    missing = sorted(expected_ids - set(seen))
    duplicates = sorted(req_id for req_id, count in seen.items() if count != 1)
    core_missing = sorted(set(acceptance.get("core_flows", [])) - set(seen))
    issues = []
    if acceptance.get("schema") != 1:
        issues.append("acceptance schema must be numeric 1")
    if not acceptance.get("source_roots"):
        issues.append("source_roots required for evidence fingerprinting")
    if missing:
        issues.append("missing gate requirements: " + ", ".join(missing))
    if duplicates:
        issues.append("non-unique gate requirements: " + ", ".join(duplicates))
    if malformed:
        issues.append("malformed gate requirements")
    if core_missing:
        issues.append("core flows absent from gate requirements: " + ", ".join(core_missing))
    return {
        "check": "Acceptance-gate compatibility",
        "result": "PASS" if not issues else "FAIL",
        "requirements_expected": len(expected_ids),
        "requirements_present": len(requirements),
        "missing": missing,
        "duplicates": duplicates,
        "malformed": malformed,
        "issues": issues,
    }


def main():
    report = {
        "verifier": "soapcraft-planning-verifier",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "repo": REPO,
        "checks": []
    }
    
    try:
        acceptance = load_json(os.path.join(STUDIO, "acceptance.json"))
        slices = load_json(os.path.join(STUDIO, "slices.json"))
        skill_receipts = load_json(os.path.join(STUDIO, "skill-receipts.json"))
    except Exception as e:
        report["error"] = f"Failed to load JSON: {e}"
        save_json(os.path.join(STUDIO, "verification-report.json"), report)
        print(f"ERROR: {e}")
        sys.exit(1)
    
    # Run all checks
    report["checks"].append(check_dag_acyclicity(slices.get("slices", slices)))
    report["checks"].append(check_stale_language(slices.get("slices", slices), acceptance))
    report["checks"].append(check_capability_to_acceptance_coverage(acceptance))
    report["checks"].append(check_acceptance_to_slice_coverage(acceptance, slices.get("slices", slices)))
    report["checks"].append(check_slice_coverage(slices.get("slices", slices), acceptance))
    report["checks"].append(check_markdown_fences(PRODUCT))
    report["checks"].append(check_gate_consistency(acceptance, skill_receipts, slices))
    report["checks"].append(check_acceptance_gate_compatibility(acceptance))
    report["checks"].append(check_normative_contract_semantics(acceptance, slices))
    report["checks"].append(check_contradiction_resolution(os.path.join(PRODUCT, "CONTRACT-CRITIQUE.md")))
    report["checks"].append(check_source_boundary(REPO))
    
    # Summary
    all_results = [c["result"] for c in report["checks"]]
    report["summary"] = {
        "total_checks": len(report["checks"]),
        "passed": all_results.count("PASS"),
        "failed": all_results.count("FAIL"),
        "blocked": all_results.count("BLOCKED"),
        "overall": "PASS" if all_results.count("FAIL") == 0 and "BLOCKED" not in all_results else "NOT_READY"
    }
    
    # Save report
    output_path = os.path.join(STUDIO, "verification-report.json")
    save_json(output_path, report)
    
    # Print summary
    print(f"\n=== VERIFICATION REPORT ===")
    print(f"Timestamp: {report['timestamp']}")
    print(f"Overall: {report['summary']['overall']}")
    print(f"Checks: {report['summary']['total_checks']} total, {report['summary']['passed']} PASS, {report['summary']['failed']} FAIL, {report['summary']['blocked']} BLOCKED")
    print()
    for c in report["checks"]:
        print(f"  [{c['result']}] {c['check']}")
        if c.get("issues"):
            for issue in c["issues"][:3]:
                print(f"    - {issue.get('issue', issue)}")
    print(f"\nReport saved to: {output_path}")
    
    sys.exit(0 if report["summary"]["overall"] == "PASS" else 1)

if __name__ == "__main__":
    main()
