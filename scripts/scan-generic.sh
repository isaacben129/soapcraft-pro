#!/bin/bash
# scan-generic.sh — Impeccable design quality gate
# Fails if any banned pattern is detected in the codebase.
# Run: bash scripts/scan-generic.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FAILED=0

echo "::group::Scanning for generic UI patterns..."

# Per-section eyebrows (e.g., "Features", "Benefits", "How It Works")
if grep -rnE '(Features|Benefits|How It Works|Key Features|Our Services|Why Choose)' "$ROOT/app/" "$ROOT/components/" 2>/dev/null; then
  echo "::error::Found per-section eyebrow text — use contextual headings instead"
  FAILED=1
fi

# Identical card grids (same structure repeated)
if grep -rnE 'grid-cols-\d+.*gap-4.*grid-cols-\d+' "$ROOT/app/" "$ROOT/components/" 2>/dev/null; then
  echo "::warning::Found potential identical card grid pattern — vary card layouts"
fi

# Glassmorphism (backdrop-filter: blur)
if grep -rnE 'backdrop-blur|backdrop-filter.*blur' "$ROOT/app/" "$ROOT/components/" 2>/dev/null; then
  echo "::error::Found glassmorphism (backdrop-blur) — use solid backgrounds instead"
  FAILED=1
fi

# Image hover zoom (transform: scale on hover)
if grep -rnE 'hover:scale-\d|transition.*scale' "$ROOT/app/" "$ROOT/components/" 2>/dev/null; then
  echo "::error::Found image-hover zoom pattern — use static presentation instead"
  FAILED=1
fi

# Gray-on-dark (gray text on dark backgrounds)
if grep -rnE 'text-gray-400.*bg-gray-900|text-gray-500.*bg-gray-800|text-gray-600.*bg-gray-700' "$ROOT/app/" "$ROOT/components/" 2>/dev/null; then
  echo "::error::Found gray-on-dark contrast issue — use lighter text on dark backgrounds"
  FAILED=1
fi

# Side-stripe borders (border-left or border-right as decoration)
if grep -rnE 'border-l-4|border-r-4|border-l-\[.*\]|border-r-\[.*\]' "$ROOT/app/" "$ROOT/components/" 2>/dev/null; then
  echo "::error::Found side-stripe border pattern — use subtle borders or no borders"
  FAILED=1
fi

# Pure black backgrounds
if grep -rnE 'bg-black\b|bg-\[#000000\]' "$ROOT/app/" "$ROOT/components/" 2>/dev/null; then
  echo "::error::Found pure black background — use dark gray (e.g., bg-gray-950) instead"
  FAILED=1
fi

# Hero-metric template (big number + label pattern)
if grep -rnE 'text-6xl.*font-bold|text-7xl.*font-bold|text-8xl.*font-bold' "$ROOT/app/" "$ROOT/components/" 2>/dev/null; then
  echo "::warning::Found hero-metric pattern — ensure it serves the product, not decoration"
fi

# Soft 12px radius (border-radius: 12px)
if grep -rnE 'rounded-\[12px\]|rounded-xl' "$ROOT/app/" "$ROOT/components/" 2>/dev/null; then
  echo "::error::Found soft 12px radius — use the design token (--radius) instead"
  FAILED=1
fi

echo "::endgroup::"

if [ "$FAILED" -eq 1 ]; then
  echo ""
  echo "::error::Design quality gate FAILED — banned patterns detected"
  echo "Fix the issues above and re-run this script before merging."
  exit 1
else
  echo ""
  echo "::notice::Design quality gate PASSED — no banned patterns detected"
  exit 0
fi
