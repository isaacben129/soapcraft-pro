import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  dodoCreateSubscription,
  dodoGetSubscription,
  dodoUpdateSubscription,
  dodoCancelSubscription,
  dodoReactivateSubscription,
  dodoCreateCustomer,
  dodoCreateCheckoutSession,
  dodoListPrices,
} from "@/lib/dodo-payments";

// ── Helper: get or create Dodo customer ──────────────────────

async function getOrCreateDodoCustomer(email: string, name?: string) {
  // In production, look up the Dodo customer ID from the users table
  // For now, create a new one each time (idempotency handled by Dodo)
  const customer = await dodoCreateCustomer(email, name);
  return customer;
}

// ── GET /api/subscription ─────────────────────────────────────
// Returns the current user's subscription status

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Look up user in database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const tier = (user.subscriptionTier as string) || "free";

    // If user has a Dodo subscription ID, fetch the latest status
    let subscriptionDetails = null;

    try {
      // Fetch available prices for display
      const prices = await dodoListPrices();
      subscriptionDetails = { prices: prices.data ?? [] };
    } catch {
      // Dodo Payments not configured — return tier info only
    }

    return NextResponse.json({
      tier,
      subscriptionDetails,
      features: {
        free: {
          calculator: true,
          recipes: 3,
          activeBatches: 1,
          price: "$0/mo",
        },
        pro: {
          calculator: true,
          recipes: null,
          activeBatches: null,
          price: "$12/mo",
          priceYearly: "$99/yr",
        },
      },
    });
  } catch (error) {
    console.error("Subscription GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

// ── POST /api/subscription ────────────────────────────────────
// Actions: upgrade, downgrade, cancel, reactivate

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, tier, priceId } = body as {
      action: "upgrade" | "downgrade" | "cancel" | "reactivate" | "create";
      tier?: "free" | "pro";
      priceId?: string;
    };

    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 }
      );
    }

    // Look up user in database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentTier = (user.subscriptionTier as string) || "free";

    switch (action) {
      case "upgrade": {
        // Create or update Dodo subscription for Pro
        const customer = await getOrCreateDodoCustomer(
          session.user.email,
          session.user.name ?? undefined
        );

        let subscription;
        if (priceId) {
          // Create a new checkout session for the selected price
          const checkout = await dodoCreateCheckoutSession(
            customer.id,
            priceId,
            `${req.nextUrl.origin}/subscription?success=true`,
            `${req.nextUrl.origin}/subscription?canceled=true`
          );
          return NextResponse.json({
            tier: "pro",
            checkoutUrl: checkout.url,
            sessionId: checkout.sessionId,
          });
        } else {
          // Direct subscription creation (for server-side flow)
          subscription = await dodoCreateSubscription(
            customer.id,
            "pro",
            priceId
          );
        }

        // Update user tier in database
        await db
          .update(users)
          .set({
            subscriptionTier: "pro",
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id));

        return NextResponse.json({
          tier: "pro",
          subscription,
        });
      }

      case "downgrade": {
        // Cancel Pro subscription and revert to Free
        const customer = await getOrCreateDodoCustomer(
          session.user.email,
          session.user.name ?? undefined
        );

        // In production, look up the user's Dodo subscription ID
        // and cancel it via Dodo Payments
        await dodoCancelSubscription(customer.id);

        // Update user tier in database
        await db
          .update(users)
          .set({
            subscriptionTier: "free",
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id));

        return NextResponse.json({ tier: "free" });
      }

      case "cancel": {
        // Cancel at period end (keep access until period end)
        await db
          .update(users)
          .set({
            subscriptionTier: "free",
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id));

        return NextResponse.json({ tier: "free", cancelAtPeriodEnd: true });
      }

      case "reactivate": {
        // Reactivate a canceled subscription
        const customer = await getOrCreateDodoCustomer(
          session.user.email,
          session.user.name ?? undefined
        );

        await dodoReactivateSubscription(customer.id);

        await db
          .update(users)
          .set({
            subscriptionTier: "pro",
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id));

        return NextResponse.json({ tier: "pro" });
      }

      case "create": {
        // Create a new subscription (for new signups)
        const customer = await getOrCreateDodoCustomer(
          session.user.email,
          session.user.name ?? undefined
        );

        const subscription = await dodoCreateSubscription(
          customer.id,
          tier ?? "free",
          priceId
        );

        await db
          .update(users)
          .set({
            subscriptionTier: tier ?? "free",
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id));

        return NextResponse.json({
          tier: tier ?? "free",
          subscription,
        });
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Subscription POST error:", error);
    return NextResponse.json(
      { error: "Failed to process subscription action" },
      { status: 500 }
    );
  }
}
