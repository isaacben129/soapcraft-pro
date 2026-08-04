import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {
  ClipboardList,
  FlaskConical,
  Library,
  Plus,
  Timer,
  WalletCards,
} from "lucide-react";
import { authOptions } from "@/lib/auth";

const tools = [
  {
    title: "Build a Recipe",
    description: "Create a formula with lye, water, fragrance, and property checks.",
    href: "/recipes/new",
    icon: FlaskConical,
    cta: "Open builder",
  },
  {
    title: "Recipe Library",
    description: "Find saved formulas and jump back into earlier work.",
    href: "/recipes",
    icon: Library,
    cta: "View recipes",
  },
  {
    title: "Batch Log",
    description: "Move from formula to production with structured batch notes.",
    href: "/batches",
    icon: ClipboardList,
    cta: "Open batches",
  },
  {
    title: "Cure Tracker",
    description: "Track cure windows, observations, and completion status.",
    href: "/cure",
    icon: Timer,
    cta: "Track cure",
  },
  {
    title: "Costing",
    description: "Calculate batch cost, cost per bar, and target pricing.",
    href: "/costing",
    icon: WalletCards,
    cta: "Open costing",
  },
];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard");
  }

  const displayName = session.user?.name || session.user?.email || "there";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 py-4">
      <section className="flex flex-col gap-5 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Workspace</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Welcome back, {displayName}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
            Start with a recipe, move it into a batch, then track cure and cost
            without hunting through disconnected pages.
          </p>
        </div>
        <Link
          href="/recipes/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New recipe
        </Link>
      </section>

      <section aria-labelledby="workspace-tools">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="workspace-tools" className="text-xl font-semibold">
            Tools
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon;

            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-lg border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/50 hover:bg-muted/40"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-background text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground">
                      {tool.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {tool.description}
                    </p>
                    <p className="mt-4 text-sm font-medium text-primary">
                      {tool.cta}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
