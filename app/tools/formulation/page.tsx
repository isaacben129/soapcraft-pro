// ── SLICE-001: Canonical /tools/formulation (GATED) ──
// Formulation is GATED for verification. Not a functional calculator.
// Shows gated status, not a fake clickable route.

import Link from "next/link";

export default function FormulationPage() {
  return (
    <main className="min-h-screen">
      <section className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          Formulation calculator
        </h1>
        <p className="mt-4 text-lg leading-7 text-muted-foreground">
          This tool is currently gated for verification.
        </p>
        <div className="mt-6 rounded-lg border border-warning/40 bg-warning/5 p-6">
          <p className="font-semibold text-warning">Gated for verification</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            The formulation calculator is not publicly available while its ingredient
            source manifest is independently reviewed. No real formulation output is
            advertised as usable or considered released.
          </p>
        </div>
        <div className="mt-6">
          <Link href="/tools" className="text-action hover:underline">
            Back to all tools
          </Link>
        </div>
      </section>
    </main>
  );
}
