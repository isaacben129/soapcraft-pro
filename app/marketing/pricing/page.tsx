import { Metadata } from "next";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing — SoapCraft Pro",
  description:
    "Start free with the calculator. Pro adds unlimited recipes, batches, cure tracking, and cost analysis. $12/month or $99/year.",
  openGraph: {
    title: "Pricing — SoapCraft Pro",
    description:
      "Start free with the calculator. Pro adds unlimited recipes, batches, cure tracking, and cost analysis.",
    type: "website",
    url: "https://soapcraft-pro.vercel.app/marketing/pricing",
  },
  robots: { index: true, follow: true },
};

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "month",
    description: "Everything you need to get started.",
    features: [
      "Lye calculator (NaOH + KOH)",
      "3 recipes",
      "1 active batch",
      "Curated recipe library",
      "SAP calculations",
      "Property ranges",
    ],
    cta: "Get started free",
    href: "/auth/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "month",
    annualPrice: "$99",
    description: "For serious soap makers who want the full workspace.",
    features: [
      "Everything in Free",
      "Unlimited recipes",
      "Unlimited batches",
      "Cure Tracker with observations",
      "Cost per batch + per bar",
      "Target margin pricing",
      "Mold volume calculator",
      "Making Mode (guided CP production)",
      "Template recipes",
      "Recipe Intelligence (AI suggestions)",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    href: "/api/subscription/upgrade",
    highlighted: true,
  },
];

export default function PricingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free. Upgrade when you need the full workspace. No credit
            card required for the Free tier.
          </p>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-lg border p-8 ${
                  tier.highlighted
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-background shadow-sm"
                }`}
              >
                <h2 className="font-display text-2xl font-bold text-foreground">
                  {tier.name}
                </h2>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    {tier.price}
                  </span>
                  <span className="text-muted-foreground">
                    /{tier.period}
                  </span>
                </div>
                {tier.annualPrice && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Or {tier.annualPrice}/year — save 25%
                  </p>
                )}
                <p className="mt-4 text-sm text-muted-foreground">
                  {tier.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check
                        className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                          tier.highlighted
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                        aria-hidden="true"
                      />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={tier.href}
                  className={`mt-8 block rounded-md px-6 py-3 text-center text-base font-medium transition-opacity hover:opacity-90 ${
                    tier.highlighted
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}