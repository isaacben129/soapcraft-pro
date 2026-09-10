// ── SLICE-001: Canonical /tools catalogue ──
// Only real, shipped tools appear here. Gated tools are labelled as unavailable.
// Every direct action points to an existing /tools/<tool-slug> canonical route.

import Link from "next/link";

interface Tool {
  slug: string;
  title: string;
  description: string;
  status: string;
  href: string;
  isGated: boolean;
}

const tools: Tool[] = [
  {
    slug: "batch-cost",
    title: "Batch Cost Calculator",
    description: "Calculate true cost per batch with ingredient, packaging, labor, and overhead breakdowns.",
    status: "Working",
    href: "/tools/batch-cost",
    isGated: false,
  },
  {
    slug: "recipe-scaling",
    title: "Recipe Scaling",
    description: "Scale recipes to target batch weights proportionally.",
    status: "Working",
    href: "/tools/recipe-scaling",
    isGated: false,
  },
  {
    slug: "mold-volume",
    title: "Mold Volume",
    description: "Calculate mold capacity from volume or dimensions.",
    status: "Working",
    href: "/tools/mold-volume",
    isGated: false,
  },
  {
    slug: "craft-fair-break-even",
    title: "Craft-Fair Break-Even",
    description: "Calculate break-even units for a craft fair.",
    status: "Working",
    href: "/tools/craft-fair-break-even",
    isGated: false,
  },
  {
    slug: "formulation",
    title: "Formulation",
    description: "Calculate lye required for NaOH, KOH, and mixed-alkali formulations.",
    status: "Gated for verification",
    href: "/tools/formulation",
    isGated: true,
  },
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen">
      <section className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          SoapCraft tools
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-7 text-muted-foreground">
          Every tool works without authentication. Open a tool, enter your inputs, and receive a
          complete deterministic result immediately.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <article
              key={tool.slug}
              className="rounded-xl border border-border bg-card p-6 hover:border-action/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-lg font-semibold text-foreground">
                  {tool.isGated ? (
                    tool.title
                  ) : (
                    <Link href={tool.href} className="hover:text-action transition-colors">
                      {tool.title}
                    </Link>
                  )}
                </h2>
                <span
                  className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                    tool.isGated
                      ? "border-warning/40 bg-warning/5 text-warning"
                      : "border-green-500/40 bg-green-50 text-green-700"
                  }`}
                >
                  {tool.status}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{tool.description}</p>
              {tool.isGated ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  This tool is gated for verification and is not publicly available. No real
                  formulation output is advertised as usable.
                </p>
              ) : (
                <Link
                  href={tool.href}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-action px-4 py-2.5 text-sm font-medium text-action-text hover:opacity-90 transition-opacity"
                >
                  Open tool
                </Link>
              )}
            </article>
          ))}
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          Pricing, subscriptions, and marketing pages are not part of the current launch.
          All tools above work without an account, email, or payment.
        </p>
      </section>
    </main>
  );
}
