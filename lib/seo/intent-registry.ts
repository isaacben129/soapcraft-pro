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
    path: "/calculators/soap-cost-calculator",
    primaryKeyword: "soap cost per bar calculator",
    intentStage: "commercial",
    contentMode: "editorial",
    productPage: "/batches/[id]/cost",
    reviewStatus: "published",
    internalLinks: ["/", "/marketing/pricing", "/blog"],
  },
  {
    path: "/compare/soapcalc-alternative",
    primaryKeyword: "soapcalc alternative",
    intentStage: "commercial",
    contentMode: "editorial",
    productPage: "/recipes/new",
    reviewStatus: "published",
    internalLinks: ["/", "/marketing/pricing", "/blog"],
  },
  {
    path: "/soap-recipe-management-software",
    primaryKeyword: "soap recipe management software",
    intentStage: "commercial",
    contentMode: "editorial",
    productPage: "/recipes/new",
    reviewStatus: "published",
    internalLinks: ["/", "/marketing/pricing", "/blog"],
  },
  {
    path: "/soap-batch-tracking-software",
    primaryKeyword: "soap batch tracking software",
    intentStage: "commercial",
    contentMode: "editorial",
    productPage: "/batches/new",
    reviewStatus: "published",
    internalLinks: ["/", "/marketing/pricing", "/blog"],
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
