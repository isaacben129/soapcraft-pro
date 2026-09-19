// ── Email Drip Sequence Route ────────
// Returns the next email in a drip sequence based on the user's source.
// Used by the email capture flow to determine what content to send.
// No auth required. Reads from a simple in-memory store (in production,
// this would use a database or CRM).

import { NextRequest, NextResponse } from "next/server";

// ── Drip Sequences ────────────────────
// Each source triggers a different drip sequence.
// Sequences are designed to deliver value first, then introduce the Pro offer.

const DRIP_SEQUENCES: Record<string, string[]> = {
  // User came from batch costing calculator
  "batch-costing": [
    "cost_per_bar_guide",
    "pricing_strategies_for_handmade_soap",
    "break_even_planning_for_soap_business",
    "batch_management_and_pro_features",
  ],
  // User came from craft fair calculator
  "craft-fair": [
    "craft_fair_survival_guide",
    "pricing_and_inventory_for_craft_fairs",
    "scaling_from_craft_fair_to_retail",
    "batch_management_and_pro_features",
  ],
  // User came from wholesale calculator
  "wholesale": [
    "wholesale_pricing_formulas",
    "getting_started_with_wholesale_accounts",
    "inventory_management_for_wholesale",
    "batch_management_and_pro_features",
  ],
  // Default drip
  "default": [
    "welcome_to_soapcraft_pro",
    "getting_started_with_soapmaking",
    "free_tools_and_calculators",
    "batch_costing_and_pricing",
    "upgrade_to_pro",
  ],
};

// ── Email Content Library ─────────────
// Each email ID maps to a subject and body template.
// In production, these would be rendered with a template engine.

const EMAIL_CONTENT: Record<string, { subject: string; body: string }> = {
  welcome_to_soapcraft_pro: {
    subject: "Welcome to SoapCraft Pro — Your Free Tools Are Ready",
    body: "Thanks for trying SoapCraft Pro! Here are your free tools:\n\n1. Batch Costing Calculator\n2. Craft Fair Break-Even Calculator\n3. Wholesale Pricing Calculator\n4. Recipe Scaling Calculator\n5. Mold Volume Calculator\n\nEach tool works without signup. Use them now at soapcraft-pro.vercel.app.\n\n— The SoapCraft Pro Team",
  },
  cost_per_bar_guide: {
    subject: "How to Calculate Your Real Cost Per Bar",
    body: "Your real cost per bar includes ingredients, packaging, labor, and overhead. Here is the formula:\n\nCost Per Bar = (Total Costs) / (Number of Bars)\n\nTo price for profit:\nSuggested Price = Cost Per Bar / (1 - Target Margin)\n\nExample: If your cost per bar is $2.00 and your target margin is 60%, your suggested price is $5.00.\n\nUse the Batch Costing Calculator at soapcraft-pro.vercel.app/calculators/batch-costing for automated calculations.",
  },
  pricing_strategies_for_handmade_soap: {
    subject: "Pricing Strategies That Actually Work",
    body: "Three pricing approaches work best for handmade soap:\n\n1. Cost-Plus Pricing: Add a fixed markup to your cost per bar.\n2. Target Margin Pricing: Set your margin and let the calculator suggest the price.\n3. Market-Based Pricing: Research similar products and adjust.\n\nMost soap makers use a 2-3x markup on cost per bar for retail.\n\nFor wholesale, aim for 40-50% margin.\n\nTry the Wholesale Pricing Calculator at soapcraft-pro.vercel.app/calculators/wholesale-pricing.",
  },
  break_even_planning_for_soap_business: {
    subject: "Break-Even Planning: Know Your Numbers",
    body: "Before you commit to craft fairs or wholesale accounts, know your break-even point.\n\nBreak-Even Bars = Total Expenses / Price Per Bar\n\nExample: $300 in booth fees at $6/bar = 50 bars to break even.\n\nUse the Craft Fair Break-Even Calculator at soapcraft-pro.vercel.app/calculators/craft-fair-break-even.",
  },
  batch_management_and_pro_features: {
    subject: "Ready for Batch Management and Pro Tools?",
    body: "You have been using our free calculators. Now it is time to track your full production.\n\nSoapCraft Pro includes:\n- Recipe library with versioning\n- Batch logging and cure tracking\n- Cost per batch analysis\n- Inventory management\n- Email drip sequence and resources\n\nStart your free Pro trial at soapcraft-pro.vercel.app.",
  },
  craft_fair_survival_guide: {
    subject: "Craft Fair Survival Guide",
    body: "Craft fairs are a great channel for soap sales. Here are the basics:\n\n1. Booth fees: $50-$500 depending on the fair\n2. Bring 20-30% extra inventory\n3. Price at 3-5x your cost per bar\n4. Track all expenses before the fair\n5. Set minimum revenue targets\n\nUse the Craft Fair Break-Even Calculator at soapcraft-pro.vercel.app/calculators/craft-fair-break-even.",
  },
  wholesale_pricing_formulas: {
    subject: "Wholesale Pricing Formulas for Soap Makers",
    body: "Wholesale pricing is different from retail. The key formula:\n\nWholesale Price = Cost Per Bar / (1 - Wholesale Margin)\n\nTypical wholesale margins: 30-50%.\n\nExample: $2 cost per bar at 40% margin = $3.33 wholesale price.\nRetail at 40% margin = $3.33 / (1-0.40) = $5.55.\n\nUse the Wholesale Pricing Calculator at soapcraft-pro.vercel.app/calculators/wholesale-pricing.",
  },
  getting_started_with_soapmaking: {
    subject: "Getting Started with Soapmaking",
    body: "Welcome to the world of handmade soap! Here is a quick guide:\n\n1. Choose your method: Cold process, hot process, or melt-and-pour\n2. Select your oils and build your first recipe\n3. Calculate lye and water with our lye calculator\n4. Pour, insulate, and unmold\n5. Cure for 4-6 weeks\n\nUse our free calculators at soapcraft-pro.vercel.app/calculators/",
  },
  free_tools_and_calculators: {
    subject: "Your Free Soapmaking Tools Are Ready",
    body: "Here are all the free tools available at SoapCraft Pro:\n\n1. Cold Process Lye Calculator\n2. Batch Costing Calculator\n3. Recipe Scaling Calculator\n4. Mold Volume Calculator\n5. Craft Fair Break-Even Calculator\n6. Wholesale Pricing Calculator\n\nNo signup required. Use them at soapcraft-pro.vercel.app/calculators/",
  },
  upgrade_to_pro: {
    subject: "Unlock Pro Tools for SoapCraft Pro",
    body: "Ready to take your soap business to the next level?\n\nSoapCraft Pro includes:\n- Recipe library with versioning\n- Batch logging and cure tracking\n- Cost per batch analysis\n- Inventory management\n- Email drip sequence and resources\n\nStart your free trial at soapcraft-pro.vercel.app.",
  },
};

// ── GET Handler ────────────────────────
// Returns the next email in the drip sequence based on source.
// Query param: source (e.g. "batch-costing", "craft-fair", "wholesale")

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const source = searchParams.get("source") || "default";
  const email = searchParams.get("email") || "";

  const sequence = DRIP_SEQUENCES[source] || DRIP_SEQUENCES["default"];
  const emailIndex = sequence.length % 5; // Cycle through sequence
  const emailId = sequence[emailIndex];
  const content = EMAIL_CONTENT[emailId] || EMAIL_CONTENT["welcome_to_soapcraft_pro"];

  return NextResponse.json({
    success: true,
    emailId,
    subject: content.subject,
    body: content.body,
    sequence: sequence.length,
    emailIndex,
  });
}