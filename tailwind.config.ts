// ── Tailwind v4 theme mapping ──
// DESIGN.md §4.2 color tokens mapped through the Tailwind theme system.
// Semantic surface tokens (rail/canvas/ledger/sheet/clay/sage/brass)
// provide the craft-ledger visual identity.

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "Times New Roman", "serif"],
        display: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "SF Mono", "Menlo", "Consolas", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // ── Base palette (mapped from DESIGN.md §4.2) ──
      colors: {
        // Base surfaces
        background: { DEFAULT: "hsl(var(--background))", foreground: "hsl(var(--foreground))" },
        foreground: "hsl(var(--foreground))",
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // Brand — craft-oriented amber-brown, not generic blue
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },

        // Semantic fills
        success: { DEFAULT: "hsl(var(--success))", foreground: "hsl(var(--success-foreground))" },
        warning: { DEFAULT: "hsl(var(--warning))", foreground: "hsl(var(--warning-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        info: { DEFAULT: "hsl(var(--info))", foreground: "hsl(var(--info-foreground))" },

        // DESIGN.md §4.2 named tokens
        ink: { DEFAULT: "var(--color-ink)", muted: "var(--color-ink-muted)" },
        action: { DEFAULT: "var(--color-action)", hover: "var(--color-action-hover)", text: "var(--color-action-text)" },
        rule: "var(--color-rule)",
        focus: "var(--color-focus)",

        // Semantic surface tokens (rail/canvas/ledger/sheet/clay/sage/brass)
        // Aligned to DESIGN.md §4.1 surface architecture
        rail: { DEFAULT: "hsl(var(--rail))", foreground: "hsl(var(--rail-foreground))" },
        canvas: { DEFAULT: "hsl(var(--canvas))", foreground: "hsl(var(--canvas-foreground))" },
        ledger: { DEFAULT: "hsl(var(--ledger))", foreground: "hsl(var(--ledger-foreground))" },
        sheet: { DEFAULT: "hsl(var(--sheet))", foreground: "hsl(var(--sheet-foreground))" },
        clay: { DEFAULT: "hsl(var(--clay))", foreground: "hsl(var(--clay-foreground))" },
        sage: { DEFAULT: "hsl(var(--sage))", foreground: "hsl(var(--sage-foreground))" },
        brass: { DEFAULT: "hsl(var(--brass))", foreground: "hsl(var(--brass-foreground))" },
      },
      // Elevation tokens
      shadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        elevation: {
          1: "var(--shadow-elevation-1)",
          2: "var(--shadow-elevation-2)",
          3: "var(--shadow-elevation-3)",
        },
      },
      // Spacing tokens
      spacing: {
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
      },
      // Typography tokens
      fontSize: {
        display: { value: "2.5rem", lineHeight: "1.1", letterSpacing: "-0.03em" },
        section: { value: "1.5rem", lineHeight: "1.3", letterSpacing: "-0.01em" },
        body: { value: "1rem", lineHeight: "1.6" },
        label: { value: "0.875rem", lineHeight: "1.4", fontWeight: "500" },
        meta: { value: "0.75rem", lineHeight: "1.4" },
      },
    },
  },
  plugins: [],
};

export default config;
