export interface IntentEntry {
  path: string;
  primaryKeyword: string;
  intentStage: "product" | "problem" | "informational" | "commercial";
  contentMode: "editorial" | "programmatic";
  productPage?: string;
  reviewStatus: "draft" | "review" | "approved" | "published";
  source?: string;
  lastReviewed?: string;
  internalLinks?: string[];
}

export const intentRegistry: IntentEntry[] = [
  {
    path: "/tools/formulation",
    primaryKeyword: "soap formulation calculator",
    intentStage: "product",
    contentMode: "programmatic",
    productPage: "/tools/formulation",
    reviewStatus: "published",
    internalLinks: ["/", "/tools", "/methodology"],
  },
  {
    path: "/tools/mold-volume",
    primaryKeyword: "mold volume calculator",
    intentStage: "product",
    contentMode: "programmatic",
    productPage: "/tools/mold-volume",
    reviewStatus: "published",
    internalLinks: ["/", "/tools", "/methodology"],
  },
  {
    path: "/tools/recipe-scaling",
    primaryKeyword: "recipe scaling calculator",
    intentStage: "product",
    contentMode: "programmatic",
    productPage: "/tools/recipe-scaling",
    reviewStatus: "published",
    internalLinks: ["/", "/tools", "/methodology"],
  },
  {
    path: "/tools/batch-cost",
    primaryKeyword: "batch cost calculator",
    intentStage: "product",
    contentMode: "programmatic",
    productPage: "/tools/batch-cost",
    reviewStatus: "published",
    internalLinks: ["/", "/tools", "/methodology"],
  },
  {
    path: "/tools/wholesale-pricing",
    primaryKeyword: "wholesale pricing calculator",
    intentStage: "product",
    contentMode: "programmatic",
    productPage: "/tools/wholesale-pricing",
    reviewStatus: "published",
    internalLinks: ["/", "/tools", "/methodology"],
  },
  {
    path: "/tools/craft-fair-break-even",
    primaryKeyword: "craft fair break even calculator",
    intentStage: "product",
    contentMode: "programmatic",
    productPage: "/tools/craft-fair-break-even",
    reviewStatus: "published",
    internalLinks: ["/", "/tools", "/methodology"],
  },
  {
    path: "/tools/ready-by-planner",
    primaryKeyword: "ready by planner",
    intentStage: "product",
    contentMode: "programmatic",
    productPage: "/tools/ready-by-planner",
    reviewStatus: "published",
    internalLinks: ["/", "/tools", "/methodology"],
  },
  {
    path: "/tools/ingredient-purchase-planner",
    primaryKeyword: "ingredient purchase planner",
    intentStage: "product",
    contentMode: "programmatic",
    productPage: "/tools/ingredient-purchase-planner",
    reviewStatus: "published",
    internalLinks: ["/", "/tools", "/methodology"],
  },
  {
    path: "/methodology",
    primaryKeyword: "soap making methodology",
    intentStage: "informational",
    contentMode: "editorial",
    productPage: "/tools",
    reviewStatus: "published",
    internalLinks: ["/", "/tools"],
  },
];

export function getIntentEntry(path: string): IntentEntry | undefined {
  return intentRegistry.find((entry) => entry.path === path);
}

export function getPublishedEntries(): IntentEntry[] {
  return intentRegistry.filter(
    (entry) => entry.reviewStatus === "published"
  );
}
