import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export default function ToolLanding({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 md:py-20">
        <Link href="/tools" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All tools
        </Link>
        <header className="mt-10 max-w-3xl border-b border-border pb-8">
          <h1 className="text-display text-4xl sm:text-5xl">{title}</h1>
          <p className="text-body mt-5 max-w-2xl text-muted-foreground">{description}</p>
        </header>
        <div className="mt-10">{children ?? <div className="border-t-2 border-primary bg-card p-6"><p className="text-lg font-semibold">Start with your numbers</p><p className="mt-2 text-muted-foreground">Enter your values to calculate a result. Save or share the resulting recipe context when ready.</p><Link href="/tools" className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline">Choose a working tool <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link></div>}</div>
      </section>
    </main>
  );
}
