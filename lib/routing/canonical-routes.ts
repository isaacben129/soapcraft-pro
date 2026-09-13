// ── Canonical public route registry ──
// Single source of truth for the eight public tool URLs.
// Every other module (sitemap, robots, middleware, directory) reads from here.
// Retired URLs are NOT included here; they exist only for redirect handling.

export interface CanonicalRoute {
  slug: string;
  title: string;
  path: string;
  status: "available" | "in-build" | "chemistry-gated";
  statusLabel: string;
  isGated: boolean;
}

export const canonicalRoutes: readonly CanonicalRoute[] = [
  {
    slug: "formulation",
    title: "Formulation",
    path: "/tools/formulation",
    status: "chemistry-gated",
    statusLabel: "Unavailable — chemistry safety-gated",
    isGated: true,
  },
  {
    slug: "mold-volume",
    title: "Mold Volume",
    path: "/tools/mold-volume",
    status: "available",
    statusLabel: "Ready to use",
    isGated: false,
  },
  {
    slug: "recipe-scaling",
    title: "Recipe Scaling",
    path: "/tools/recipe-scaling",
    status: "available",
    statusLabel: "Ready to use",
    isGated: false,
  },
  {
    slug: "batch-cost",
    title: "Batch Cost",
    path: "/tools/batch-cost",
    status: "available",
    statusLabel: "Ready to use",
    isGated: false,
  },
  {
    slug: "wholesale-pricing",
    title: "Wholesale Pricing",
    path: "/tools/wholesale-pricing",
    status: "available",
    statusLabel: "Ready to use",
    isGated: false,
  },
  {
    slug: "craft-fair-break-even",
    title: "Craft-Fair Break-Even",
    path: "/tools/craft-fair-break-even",
    status: "available",
    statusLabel: "Ready to use",
    isGated: false,
  },
  {
    slug: "ready-by-planner",
    title: "Ready-by Planner",
    path: "/tools/ready-by-planner",
    status: "available",
    statusLabel: "Ready to use",
    isGated: false,
  },
  {
    slug: "ingredient-purchase-planner",
    title: "Ingredient Purchase Planner",
    path: "/tools/ingredient-purchase-planner",
    status: "available",
    statusLabel: "Ready to use",
    isGated: false,
  },
] as const;

export const canonicalPaths = new Set(canonicalRoutes.map((r) => r.path));

export function getCanonicalRoute(slug: string): CanonicalRoute | undefined {
  return canonicalRoutes.find((r) => r.slug === slug);
}

export function getCanonicalPath(slug: string): string | undefined {
  return getCanonicalRoute(slug)?.path;
}
