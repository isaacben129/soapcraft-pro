import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "@/db/schema";
import { recipes, batches, cureObservations, batchCosts } from "@/db/schema";
import { desc } from "drizzle-orm";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

type AttentionItem =
  | { kind: "observation"; id: string; batchId: string; day: number }
  | { kind: "cost"; id: string; batchId: string };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard");
  }

  let userRecipes: Array<{ id: string; name: string; createdAt: string }> = [];
  let userBatches: Array<{ id: string; recipeVersionId: string; status: string; batchName: string; startedAt: string | null; completedAt: string | null; createdAt: string }> = [];
  let userObservations: Array<{ id: string; batchId: string; day: number; createdAt: string }> = [];
  let userCosts: Array<{ id: string; batchId: string; totalCost: number; batchYieldBars: number; costPerBar: number }> = [];

  try {
    userRecipes = await db.select().from(recipes).orderBy(desc(recipes.createdAt)).limit(10);
    userBatches = await db.select().from(batches).orderBy(desc(batches.createdAt)).limit(10);
    userObservations = await db.select().from(cureObservations).orderBy(desc(cureObservations.createdAt)).limit(20);
    userCosts = await db.select().from(batchCosts).orderBy(desc(batchCosts.createdAt)).limit(10);
  } catch {
    // Database unavailable — render empty states below
  }

  const recentRecipes = userRecipes.slice(0, 5);
  const activeBatches = userBatches.filter((b) => b.status === "making" || b.status === "curing");
  const dueObservations = userObservations.filter((o) => o.day <= 3);
  const batchesWithoutCost = userBatches.filter(
    (b) => b.status === "ready" && !userCosts.some((c) => c.batchId === b.id)
  );
  const needsAttention: AttentionItem[] = [
    ...dueObservations.map((o) => ({ kind: "observation" as const, id: o.id, batchId: o.batchId, day: o.day })),
    ...batchesWithoutCost.map((b) => ({ kind: "cost" as const, id: b.id, batchId: b.id })),
  ].slice(0, 5);

  const displayName = session.user?.name ?? session.user?.email ?? "there";

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 py-4">
      {/* Workspace header */}
      <section className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Workspace</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Welcome back, {displayName}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground md:text-base">
            Your active production, recent recipes, and anything that needs attention next.
          </p>
        </div>
        <Link
          href="/recipes/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          New recipe
        </Link>
      </section>

      {/* Needs attention */}
      <section aria-labelledby="attention-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="attention-heading" className="text-lg font-semibold text-foreground">
            Needs attention
          </h2>
          {needsAttention.length > 0 && (
            <span className="text-xs font-medium text-destructive">
              {needsAttention.length} item{needsAttention.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {needsAttention.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface-warm p-6 text-center">
            <p className="text-sm text-muted-foreground">Nothing needs attention right now.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Start a recipe or batch to see active items here.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {needsAttention.map((item) => {
              const batch = userBatches.find((b) => b.id === item.batchId);
              const recipe = userRecipes.find((r) => r.id === batch?.recipeVersionId);
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-lg border border-border bg-surface-warm p-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {batch?.batchName ?? recipe?.name ?? "Item"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {batch ? `Batch · ${batch.status}` : recipe ? `Recipe · ${recipe.name}` : "Unknown"}
                    </p>
                  </div>
                  <Link
                    href={batch ? `/batches/${batch.id}` : `/recipes/${recipe?.id ?? "#"}`}
                    className="shrink-0 text-sm font-medium text-primary hover:underline"
                  >
                    View →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Active production pipeline */}
      <section aria-labelledby="pipeline-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="pipeline-heading" className="text-lg font-semibold text-foreground">
            Active production
          </h2>
          {activeBatches.length === 0 && (
            <span className="text-xs text-muted-foreground">No active batches</span>
          )}
        </div>

        {activeBatches.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface-warm p-6 text-center">
            <p className="text-sm text-muted-foreground">No batches in progress.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Start a batch from a saved recipe to begin production.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {activeBatches.map((batch) => {
              const version = userRecipes.find((r) => r.id === batch.recipeVersionId);
              const obsCount = userObservations.filter((o) => o.batchId === batch.id).length;
              const hasCost = userCosts.some((c) => c.batchId === batch.id);
              return (
                <div key={batch.id} className="rounded-lg border border-border bg-surface-warm p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">{batch.batchName}</h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        batch.status === "making"
                          ? "bg-primary/10 text-primary"
                          : "bg-info/10 text-info"
                      }`}
                    >
                      {batch.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {version?.name ?? "Recipe version"}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>
                      {obsCount} observation{obsCount !== 1 ? "s" : ""}
                    </span>
                    <span>{hasCost ? "Cost recorded" : "No cost yet"}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/batches/${batch.id}`}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Open batch →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Recent recipes and outcomes */}
      <section aria-labelledby="recent-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="recent-heading" className="text-lg font-semibold text-foreground">
            Recent recipes
          </h2>
          <Link href="/recipes" className="text-sm font-medium text-primary hover:underline">
            View all →
          </Link>
        </div>

        {recentRecipes.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface-warm p-6 text-center">
            <p className="text-sm text-muted-foreground">No recipes yet.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Create your first recipe to start building batches.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {recentRecipes.map((recipe) => {
              const recipeBatches = userBatches.filter((b) => b.recipeVersionId === recipe.id);
              const latestBatch = recipeBatches[0];
              return (
                <div key={recipe.id} className="rounded-lg border border-border bg-surface-warm p-4">
                  <h3 className="text-sm font-semibold text-foreground">{recipe.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {recipeBatches.length} batch{recipeBatches.length !== 1 ? "es" : ""}
                    {latestBatch ? ` · latest: ${latestBatch.status}` : ""}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/recipes/${recipe.id}`}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Open recipe →
                    </Link>
                    {latestBatch && (
                      <Link
                        href={`/batches/${latestBatch.id}`}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Open batch →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Activity ledger */}
      <section aria-labelledby="activity-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="activity-heading" className="text-lg font-semibold text-foreground">
            Activity
          </h2>
        </div>

        {userBatches.length === 0 && userRecipes.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface-warm p-6 text-center">
            <p className="text-sm text-muted-foreground">No activity yet.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Create a recipe or batch to see your activity here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {userBatches.slice(0, 5).map((batch) => (
              <div
                key={batch.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface-warm p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{batch.batchName}</p>
                  <p className="text-xs text-muted-foreground">
                    Batch · {batch.status} · {new Date(batch.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  href={`/batches/${batch.id}`}
                  className="shrink-0 text-xs font-medium text-primary hover:underline"
                >
                  View →
                </Link>
              </div>
            ))}
            {userRecipes.slice(0, 3).map((recipe) => (
              <div
                key={recipe.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface-warm p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{recipe.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Recipe · {new Date(recipe.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  href={`/recipes/${recipe.id}`}
                  className="shrink-0 text-xs font-medium text-primary hover:underline"
                >
                  View →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
