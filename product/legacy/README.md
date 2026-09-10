# Legacy Planning Artifacts

These files are superseded by the current StudioForge contract format. They are preserved for historical audit only and must not be used as authority for any product decision.

## Superseded files

| File | Previous version | Status | Superseded by |
|------|-----------------|--------|---------------|
| `PRD.md.v3-traffic` | v3.0 traffic-first/rescue specification | Superseded | `product/PRD.md` v1.0 anonymous-first utility hub contract |
| `FLOWS.md.v2-traffic` | v2.0 traffic-first flows | Superseded | `product/FLOWS.md` v1.0 anonymous-first flows |
| `ARCHITECTURE.md.v2-traffic` | v2.0 traffic-first architecture | Superseded | `product/ARCHITECTURE.md` v1.0 utility hub architecture |
| `DESIGN.md.v4-traffic` | v4.0 traffic-first design | Superseded | `product/DESIGN.md` v1.0 utility hub design |
|| `PRODUCT-CONTRACT-UTILITY-HUB.md` | Approved direction contract | Superseded | Incorporated into all rewritten artifacts |
|| `AI-OPERATING-CONTRACT.md.v1-traffic` | v1 traffic-first operating contract | Superseded | `product/AI-OPERATING-CONTRACT.md` v1.0 anonymous-first utility hub operating contract |

## Why these are superseded

The previous artifacts were built on a **traffic-first** model that emphasized:
- Email capture, CRM drip sequences, and subscription lifecycle as primary conversion paths
- Gated workspace as the primary product framing
- Free tier / Pro tier pricing ($12/mo, $99/yr) as the entitlement model
- `/marketing` route tree
- Pinterest/TikTok as primary distribution channels
- SaaS-first homepage framing

The current approved direction from Isaac (2026-09-09) replaces this entirely with an **anonymous-first, free, tool-first** utility hub model.

## What remains valid

Some elements from the legacy artifacts are preserved as historical audit evidence only:
- The approved direction contract (`PRODUCT-CONTRACT-UTILITY-HUB.md`) principles are incorporated into the new artifacts
- Stable capability IDs (CHEM-*, SIZE-*, COST-*, MKT-*, PROD-*, PURCH-*, UTIL-*) are retained
- Design tokens verified in `app/globals.css` are preserved as provisional pending Isaac approval
- Security and data ownership principles are carried forward

## Warning

Do not use any content from these legacy files as product authority. The legacy artifacts contain:
- Defunct pricing and subscription references
- Deprecated email capture and CRM paths
- Traffic-first IA decisions that contradict the approved direction
- `/marketing` route references that must be removed
- Gated workspace framing that is explicitly excluded from current launch
