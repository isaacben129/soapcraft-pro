import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { calculateFormulation } from "@/lib/calculations/sap";
import { authOptions } from "@/lib/auth";
import { blogPosts } from "@/lib/blog";
import Link from "next/link";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  const demoResult = calculateFormulation({
    oilBlend: [
      { oilId: "olive-oil", percent: 60 },
      { oilId: "coconut-oil", percent: 30 },
      { oilId: "shea-butter", percent: 10 },
    ],
    superfatPercent: 5,
    lyeConcentrationPercent: 33,
    waterToLyeRatio: 2.03,
    fragranceLoadPercent: 3,
  });

  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const featuredPost = sortedPosts[0];
  const latestPosts = sortedPosts.slice(1, 4);

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="bg-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left: headline and subheadline */}
            <div className="max-w-xl">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
                From formulation to finished bar, in one production record.
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
                Calculate a recipe, make the batch, record the cure, and know the
                real cost without rebuilding your work in four different tools.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
                >
                  Start a recipe
                </Link>
                <Link
                  href="#workflow"
                  className="inline-flex items-center justify-center rounded-md border border-border px-8 py-3 text-base font-medium text-foreground hover:bg-muted transition-colors"
                >
                  See the workflow
                </Link>
              </div>
            </div>

            {/* Right: proof artifact */}
            <div className="max-w-md lg:ml-auto">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Example
              </p>
              <div className="rounded-md border border-border bg-surface-warm shadow-sm overflow-hidden">
                {/* Recipe header */}
                <div className="px-4 py-3 border-b border-border bg-surface-warm/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Recipe
                      </span>
                      <p className="font-display text-sm font-semibold text-foreground mt-0.5">
                        Olive-Coconut-Shea Bar
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      v3
                    </span>
                  </div>
                </div>

                {/* Batch row */}
                <div className="px-4 py-3 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Batch
                      </span>
                      <p className="font-display text-sm font-semibold text-foreground mt-0.5">
                        #024
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-warning/20 px-2.5 py-0.5 text-xs font-medium text-warning">
                      Curing
                    </span>
                  </div>
                </div>

                {/* Cure progress */}
                <div className="px-4 py-3 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Cure
                      </span>
                      <p className="font-display text-sm font-semibold text-foreground mt-0.5">
                        Day 18 of 42
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Last observed: trace set, no soda ash
                    </span>
                  </div>
                </div>

                {/* Cost */}
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Cost per bar
                      </span>
                      <p className="font-display text-lg font-bold text-foreground mt-0.5">
                        $2.14
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      at 60% target margin
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Production-shaped synthetic data. No real user records displayed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Connected Workflow Proof */}
      <section id="workflow" className="bg-muted/50 border-y border-border">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center">
              One production record, four connected stages
            </h2>
            <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto">
              A single record carries your formulation through batch creation,
              cure observation, and cost finalization. Data is inherited at each
              stage, not re-entered.
            </p>

            <div className="mt-12 space-y-6">
              {/* Stage 1: Recipe */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="font-display font-bold text-primary text-sm">1</span>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Recipe formulation
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    Select oils, set percentages, and choose lye and water
                    parameters. The engine computes exact quantities, property
                    ranges, and warnings.
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Inherited downstream: formula quantities, SAP dataset revision,
                    calculator version.
                  </p>
                </div>
              </div>

              {/* Stage 2: Batch */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="font-display font-bold text-primary text-sm">2</span>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Batch production
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    Start a batch from a recipe version. The planned measurement
                    snapshot is copied once and cannot be rewritten by later
                    recipe edits.
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Inherited from recipe: formula quantities, SAP values,
                    warnings. Planned measurements become the batch baseline.
                  </p>
                </div>
              </div>

              {/* Stage 3: Cure */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="font-display font-bold text-primary text-sm">3</span>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Cure observation
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    Log observations at each cure day. The product tracks elapsed
                    time and due dates; readiness is a user decision, not an
                    automated declaration.
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Inherited from batch: actual measurements, recipe version
                    reference, planned quantities for comparison.
                  </p>
                </div>
              </div>

              {/* Stage 4: Cost */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="font-display font-bold text-primary text-sm">4</span>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Cost finalization
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    Map actual yield and ingredient usage to your cost catalogue.
                    The system calculates cost per bar and suggests a target price
                    based on your margin.
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Inherited from batch: actual yield, actual measurements,
                    recipe version reference. Outcome feeds back into recipe
                    history for the next version.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculation Trust */}
      <section className="bg-background">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center">
              Deterministic calculation, fully visible
            </h2>
            <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto">
              Every quantity is computed from published SAP values, your selected
              assumptions, and a documented calculation method. No AI generates
              chemical quantities.
            </p>

            <div className="mt-12 rounded-md border border-border bg-surface-warm shadow-sm overflow-hidden">
              {/* Table header */}
              <div className="px-4 py-3 border-b border-border bg-surface-warm/80 flex items-center justify-between">
                <h3 className="font-display text-sm font-semibold text-foreground">
                  Formulation result
                </h3>
                <span className="text-xs text-muted-foreground">
                  1000g oil batch &middot; SAP dataset revision 2026.1
                </span>
              </div>

              {/* Calculation table */}
              <div className="divide-y divide-border">
                <div className="px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Lye NaOH
                    </span>
                    <span className="font-display text-lg font-bold text-foreground">
                      {demoResult.lyeNaOH.toFixed(2)}g
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Water
                    </span>
                    <span className="font-display text-lg font-bold text-foreground">
                      {demoResult.water.toFixed(0)}g
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Fragrance
                    </span>
                    <span className="font-display text-lg font-bold text-foreground">
                      {demoResult.fragranceLoad.toFixed(0)}g
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Total weight
                    </span>
                    <span className="font-display text-lg font-bold text-foreground">
                      {demoResult.totalWeight.toFixed(0)}g
                    </span>
                  </div>
                </div>

                {/* Assumptions row */}
                <div className="px-4 py-3 bg-muted/30">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Assumptions
                  </span>
                  <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                    <li>
                      Lye concentration: 33% &middot; Water-to-lye ratio: 2.03:1
                    </li>
                    <li>Superfat: 5% &middot; All percentages based on 1000g oil</li>
                    <li>
                      SAP values from the built-in oil database, revision 2026.1
                    </li>
                  </ul>
                </div>

                {/* Warnings row */}
                {demoResult.warnings.length > 0 && (
                  <div className="px-4 py-3">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Warnings
                    </span>
                    <ul className="mt-2 space-y-1">
                      {demoResult.warnings.map((w, i) => (
                        <li
                          key={i}
                          className={`text-sm flex items-start gap-2 ${
                            w.type === "danger"
                              ? "text-destructive"
                              : "text-warning"
                          }`}
                        >
                          <span className="font-semibold">
                            {w.type === "danger" ? "Blocking:" : "Review:"}
                          </span>
                          <span>{w.message}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Safety note */}
                <div className="px-4 py-3 bg-muted/30 border-t border-border">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Safety note:</strong> Always
                    add lye to water, never water to lye. The reaction is exothermic
                    and can splash. Wear chemical splash goggles and nitrile gloves.
                    Keep vinegar nearby for neutralization. These calculations are
                    deterministic and do not constitute a safety declaration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plan vs Actual */}
      <section className="bg-muted/50 border-y border-border">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center">
              Plan vs actual, from a single record
            </h2>
            <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto">
              Compare what you planned with what the batch produced. Every variance
              is traceable to a specific measurement or assumption.
            </p>

            <div className="mt-12 rounded-md border border-border bg-surface-warm shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-surface-warm/80 flex items-center justify-between">
                <h3 className="font-display text-sm font-semibold text-foreground">
                  Batch #024 &middot; Olive-Coconut-Shea Bar
                </h3>
                <span className="text-xs text-muted-foreground">
                  Recipe v3 &middot; Made 2026-07-28
                </span>
              </div>

              <div className="divide-y divide-border">
                {/* Oil weights */}
                <div className="px-4 py-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Oil weights (g)
                  </span>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground">Olive oil</span>
                      <span>
                        <span className="font-mono text-foreground">600.0</span>
                        <span className="text-muted-foreground ml-2">planned</span>
                      </span>
                      <span>
                        <span className="font-mono text-foreground">598.2</span>
                        <span className="text-muted-foreground ml-2">actual</span>
                      </span>
                      <span className="font-mono text-success">+0.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Coconut oil</span>
                      <span>
                        <span className="font-mono text-foreground">300.0</span>
                        <span className="text-muted-foreground ml-2">planned</span>
                      </span>
                      <span>
                        <span className="font-mono text-foreground">301.5</span>
                        <span className="text-muted-foreground ml-2">actual</span>
                      </span>
                      <span className="font-mono text-warning">+0.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Shea butter</span>
                      <span>
                        <span className="font-mono text-foreground">100.0</span>
                        <span className="text-muted-foreground ml-2">planned</span>
                      </span>
                      <span>
                        <span className="font-mono text-foreground">99.8</span>
                        <span className="text-muted-foreground ml-2">actual</span>
                      </span>
                      <span className="font-mono text-success">+0.2%</span>
                    </div>
                  </div>
                </div>

                {/* Lye and water */}
                <div className="px-4 py-3 bg-muted/30">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Lye and water
                  </span>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground">Lye NaOH</span>
                      <span>
                        <span className="font-mono text-foreground">146.80g</span>
                        <span className="text-muted-foreground ml-2">planned</span>
                      </span>
                      <span>
                        <span className="font-mono text-foreground">146.80g</span>
                        <span className="text-muted-foreground ml-2">actual</span>
                      </span>
                      <span className="font-mono text-success">0.0%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Water</span>
                      <span>
                        <span className="font-mono text-foreground">298.0g</span>
                        <span className="text-muted-foreground ml-2">planned</span>
                      </span>
                      <span>
                        <span className="font-mono text-foreground">295.4g</span>
                        <span className="text-muted-foreground ml-2">actual</span>
                      </span>
                      <span className="font-mono text-warning">+0.9%</span>
                    </div>
                  </div>
                </div>

                {/* Trace and yield */}
                <div className="px-4 py-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Trace and yield
                  </span>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground">Trace time</span>
                      <span>
                        <span className="font-mono text-foreground">12 min</span>
                        <span className="text-muted-foreground ml-2">planned</span>
                      </span>
                      <span>
                        <span className="font-mono text-foreground">14 min</span>
                        <span className="text-muted-foreground ml-2">actual</span>
                      </span>
                      <span className="font-mono text-warning">+2 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Final yield</span>
                      <span>
                        <span className="font-mono text-foreground">1080g</span>
                        <span className="text-muted-foreground ml-2">planned</span>
                      </span>
                      <span>
                        <span className="font-mono text-foreground">1062g</span>
                        <span className="text-muted-foreground ml-2">actual</span>
                      </span>
                      <span className="font-mono text-warning">-1.7%</span>
                    </div>
                  </div>
                </div>

                {/* Cost variance */}
                <div className="px-4 py-3 bg-muted/30">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Cost per bar
                  </span>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground">Ingredient cost</span>
                      <span>
                        <span className="font-mono text-foreground">$1.42</span>
                        <span className="text-muted-foreground ml-2">planned</span>
                      </span>
                      <span>
                        <span className="font-mono text-foreground">$1.48</span>
                        <span className="text-muted-foreground ml-2">actual</span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Cost per bar</span>
                      <span>
                        <span className="font-mono text-foreground">$0.71</span>
                        <span className="text-muted-foreground ml-2">planned</span>
                      </span>
                      <span>
                        <span className="font-mono text-foreground">$0.74</span>
                        <span className="text-muted-foreground ml-2">actual</span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Variance</span>
                      <span className="font-mono text-warning">+4.2%</span>
                      <span className="text-xs text-muted-foreground">
                        within acceptable range
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 border-t border-border bg-muted/30">
                <p className="text-xs text-muted-foreground">
                  Example record. Planned values from Recipe v3 calculation; actual
                  values from Batch #024 Making Mode entries. No real user data
                  displayed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured + Latest Blog */}
      <section className="bg-background">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  From the workshop
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Deterministic guides, verified recipes, and troubleshooting for
                  serious soap makers.
                </p>
              </div>
              <Link
                href="/marketing/blog"
                className="hidden sm:inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                View all articles &rarr;
              </Link>
            </div>

            {/* Featured article */}
            {featuredPost && (
              <div className="mb-12">
                <Link href={`/marketing/blog/${featuredPost.slug}`}>
                  <article className="group rounded-md border border-border bg-surface-warm overflow-hidden hover:border-primary/30 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="aspect-video md:aspect-auto bg-muted flex items-center justify-center">
                        <img
                          src={featuredPost.image}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-6 md:p-8 flex flex-col justify-center">
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                          Featured
                        </span>
                        <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mt-2 group-hover:underline">
                          {featuredPost.title}
                        </h3>
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                          {featuredPost.description}
                        </p>
                        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{featuredPost.category}</span>
                          <span aria-hidden="true">&middot;</span>
                          <time dateTime={featuredPost.publishedAt}>
                            {formatDate(featuredPost.publishedAt)}
                          </time>
                          <span aria-hidden="true">&middot;</span>
                          <span>{featuredPost.readingTime} min read</span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
            )}

            {/* Latest articles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/marketing/blog/${post.slug}`}
                  className="group block"
                >
                  <article className="rounded-md border border-border bg-surface-warm p-5 hover:border-primary/30 transition-colors h-full flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {post.category}
                    </span>
                    <h3 className="font-display text-base font-semibold text-foreground mt-2 group-hover:underline leading-snug">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                      <time dateTime={post.publishedAt}>
                        {formatDate(post.publishedAt)}
                      </time>
                      <span aria-hidden="true">&middot;</span>
                      <span>{post.readingTime} min read</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Category links */}
            <div className="mt-10 flex flex-wrap gap-2">
              <Link
                href="/marketing/blog?category=calculations"
                className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                Calculations
              </Link>
              <Link
                href="/marketing/blog?category=recipes"
                className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                Recipes
              </Link>
              <Link
                href="/marketing/blog?category=guides"
                className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                Guides
              </Link>
              <Link
                href="/marketing/blog?category=troubleshooting"
                className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                Troubleshooting
              </Link>
            </div>

            {/* Mobile view all link */}
            <div className="mt-6 sm:hidden">
              <Link
                href="/marketing/blog"
                className="inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                View all articles &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="bg-muted/50 border-y border-border">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Start free, upgrade when you are ready
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              The calculator is always free. Pro adds unlimited recipes, batches,
              cure tracking, and cost analysis.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
              >
                Get started free
              </Link>
              <Link
                href="/marketing/pricing"
                className="inline-flex items-center justify-center rounded-md border border-border px-8 py-3 text-base font-medium text-foreground hover:bg-muted transition-colors"
              >
                View pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Product */}
            <div>
              <h3 className="font-display text-sm font-semibold text-foreground mb-3">
                Product
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/marketing/pricing"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/marketing/blog"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides"
                    className="hover:text-foreground transition-colors"
                  >
                    Guides
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-display text-sm font-semibold text-foreground mb-3">
                Resources
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/marketing/blog?category=calculations"
                    className="hover:text-foreground transition-colors"
                  >
                    Calculators
                  </Link>
                </li>
                <li>
                  <Link
                    href="/marketing/blog?category=recipes"
                    className="hover:text-foreground transition-colors"
                  >
                    Recipes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/marketing/blog?category=guides"
                    className="hover:text-foreground transition-colors"
                  >
                    Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="/marketing/blog?category=troubleshooting"
                    className="hover:text-foreground transition-colors"
                  >
                    Troubleshooting
                  </Link>
                </li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h3 className="font-display text-sm font-semibold text-foreground mb-3">
                Account
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/auth/login"
                    className="hover:text-foreground transition-colors"
                  >
                    Log in
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/signup"
                    className="hover:text-foreground transition-colors"
                  >
                    Sign up
                  </Link>
                </li>
                <li>
                  <Link
                    href="/settings"
                    className="hover:text-foreground transition-colors"
                  >
                    Settings
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-display text-sm font-semibold text-foreground mb-3">
                Legal
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/legal/privacy"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/terms"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/safety"
                    className="hover:text-foreground transition-colors"
                  >
                    Safety
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Safety disclaimer */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground leading-relaxed">
              SoapCraft Pro provides deterministic lye calculations based on
              published SAP values. It does not generate chemical quantities using
              AI. All calculations are verifiable against the documented method
              and ingredient dataset revision. This tool does not declare soap
              safe, cured, or fit for use &mdash; that is the maker&apos;s
              responsibility.
            </p>
          </div>

          {/* Status */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} SoapCraft Pro
            </p>
            <p className="text-xs text-muted-foreground">
              Deterministic calculations, not AI guesswork.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}