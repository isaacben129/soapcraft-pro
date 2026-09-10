// ── Downloadable Templates Route ─────
// Generates downloadable worksheets and templates for soapmakers.
// Returns text-based content (CSV, TXT) that users can save.
// No auth required.

import { NextRequest, NextResponse } from "next/server";

// ── Template Types ────────────────────

interface TemplateResponse {
  filename: string;
  content: string;
  contentType: string;
}

// ── Batch Cost Worksheet ──────────────

function getBatchCostWorksheet(): TemplateResponse {
  let content = `Batch Cost Worksheet — SoapCraft Pro
=====================================
Date: _______________
Batch Name: _______________
Recipe: _______________

INGREDIENT COSTS
-----------------
Ingredient          | Amount   | Unit Cost | Total Cost
--------------------|----------|-----------|----------
`;
  for (let i = 0; i < 10; i++) {
    content += `____________________|__________|___________|__________\n`;
  }
  content += `
--------------------|----------|-----------|----------
SUBTOTAL: $_________
TOTAL: $____________
BARS PRODUCED: ______
COST PER BAR: $_____
`;

  return {
    filename: "batch-cost-worksheet.txt",
    content,
    contentType: "text/plain",
  };
}

// ── Craft Fair Planning Worksheet ─────

function getCraftFairWorksheet(): TemplateResponse {
  const content = `Craft Fair Planning Worksheet
=============================
Fair Name: _______________
Date: _______________
Location: _______________

EXPENSES
--------
Booth Fee: $_________
Travel: $____________
Table/Display: $_____
Signage: $___________
Supplies: $__________
Total Expenses: $____

PRICING
-------
Cost Per Bar: $______
Selling Price: $_____
Bars to Sell (BE): __
Expected Sales: ____
Expected Revenue: $__
Net Profit/Loss: $___

INVENTORY
---------
Bars to Bring: ______
Bars Sold: __________
Bars Remaining: _____
`;

  return {
    filename: "craft-fair-worksheet.txt",
    content,
    contentType: "text/plain",
  };
}

// ── Production Schedule ───────────────

function getProductionSchedule(): TemplateResponse {
  const content = `Soap Production Schedule
=======================
Week Starting: ____/__/____

BATCH 1
-------
Recipe: _______________
Mold: _______________
Pour Date: ___________
Unmold Date: _________
Cure Complete: _______
Status: _____________

BATCH 2
-------
Recipe: _______________
Mold: _______________
Pour Date: ___________
Unmold Date: _________
Cure Complete: _______
Status: _____________

INVENTORY CHECK
---------------
Raw Materials: _______
Finished Goods: ______
Reorder Point: _______
Next Purchase: ______
`;

  return {
    filename: "production-schedule.txt",
    content,
    contentType: "text/plain",
  };
}

// ── Ingredient Order List ─────────────

function getIngredientOrderList(): TemplateResponse {
  let content = `Ingredient Reorder List
=======================
Date: _______________
Supplier: ____________

ITEMS TO ORDER
--------------
Ingredient          | Amount Needed | On Hand | Order Qty | Supplier
--------------------|---------------|---------|-----------|---------
`;
  for (let i = 0; i < 8; i++) {
    content += `____________________|_______________|_________|___________|________\n`;
  }

  return {
    filename: "ingredient-order-list.txt",
    content,
    contentType: "text/plain",
  };
}

// ── GET Handler ────────────────────────
// Query param: type (batch-cost, craft-fair, production, ingredients)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "batch-cost";

  const templates: Record<string, () => TemplateResponse> = {
    "batch-cost": getBatchCostWorksheet,
    "craft-fair": getCraftFairWorksheet,
    "production": getProductionSchedule,
    "ingredients": getIngredientOrderList,
  };

  const generator = templates[type];
  if (!generator) {
    return NextResponse.json({ error: "Invalid template type" }, { status: 400 });
  }

  const result = generator();
  return new NextResponse(result.content, {
    headers: {
      "Content-Disposition": `attachment; filename="${result.filename}"`,
      "Content-Type": result.contentType,
    },
  });
}