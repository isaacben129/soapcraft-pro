// ── Dodo Payments client ──────────────────────────────────────
// Uses the Dodo Payments API (not Stripe). Credentials are required at call time.

import { Webhook } from "standardwebhooks";

const DODO_PAYMENTS_API_URL = "https://api.dodopayments.com/v1";

function requiredDodoApiKey(): string {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  if (!apiKey) {
    throw new Error("DODO_PAYMENTS_API_KEY is not configured");
  }
  return apiKey;
}

// ── Types ─────────────────────────────────────────────────────────────

export interface DodoSubscription {
  id: string;
  customerId: string;
  tier: "free" | "pro";
  status: "active" | "past_due" | "canceled" | "trialing";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
}

export interface DodoCustomer {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export interface DodoPaymentMethod {
  id: string;
  type: "card" | "bank_account";
  last4: string;
  brand: string;
  isDefault: boolean;
}

export interface DodoPrice {
  id: string;
  productId: string;
  unitAmount: number;
  currency: string;
  interval: "month" | "year" | null;
  recurring: boolean;
}

export interface DodoProduct {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

// ── Helper ────────────────────────────────────────────────────────────

async function dodoRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${DODO_PAYMENTS_API_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${requiredDodoApiKey()}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `Dodo Payments request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

// ── Customer operations ──────────────────────────────────────────────

export async function dodoCreateCustomer(email: string, name?: string) {
  return dodoRequest<DodoCustomer>("/customers", {
    method: "POST",
    body: JSON.stringify({ email, name: name ?? null }),
  });
}

export async function dodoGetCustomer(customerId: string) {
  return dodoRequest<DodoCustomer>(`/customers/${customerId}`);
}

// ── Subscription operations ──────────────────────────────────────────

export async function dodoCreateSubscription(
  customerId: string,
  tier: "free" | "pro",
  priceId?: string
) {
  return dodoRequest<DodoSubscription>("/subscriptions", {
    method: "POST",
    body: JSON.stringify({
      customerId,
      tier,
      priceId: priceId ?? null,
    }),
  });
}

export async function dodoGetSubscription(subscriptionId: string) {
  return dodoRequest<DodoSubscription>(`/subscriptions/${subscriptionId}`);
}

export async function dodoUpdateSubscription(
  subscriptionId: string,
  updates: { tier?: "free" | "pro"; cancelAtPeriodEnd?: boolean }
) {
  return dodoRequest<DodoSubscription>(`/subscriptions/${subscriptionId}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export async function dodoCancelSubscription(subscriptionId: string) {
  return dodoRequest<DodoSubscription>(`/subscriptions/${subscriptionId}/cancel`, {
    method: "POST",
  });
}

export async function dodoReactivateSubscription(subscriptionId: string) {
  return dodoRequest<DodoSubscription>(`/subscriptions/${subscriptionId}/reactivate`, {
    method: "POST",
  });
}

// ── Price / Product operations ───────────────────────────────────────

export async function dodoListPrices() {
  return dodoRequest<{ data: DodoPrice[] }>("/prices");
}

export async function dodoListProducts() {
  return dodoRequest<{ data: DodoProduct[] }>("/products");
}

// ── Payment method operations ────────────────────────────────────────

export async function dodoListPaymentMethods(customerId: string) {
  return dodoRequest<DodoPaymentMethod[]>(`/customers/${customerId}/payment-methods`);
}

export async function dodoSetDefaultPaymentMethod(
  customerId: string,
  paymentMethodId: string
) {
  return dodoRequest<DodoPaymentMethod>(
    `/customers/${customerId}/payment-methods/${paymentMethodId}/default`,
    { method: "POST" }
  );
}

// ── Session / Checkout ───────────────────────────────────────────────

export async function dodoCreateCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  return dodoRequest<{ sessionId: string; url: string }>("/checkout/sessions", {
    method: "POST",
    body: JSON.stringify({ customerId, priceId, successUrl, cancelUrl }),
  });
}

// ── Webhook verification ─────────────────────────────────────────────

export interface DodoWebhookHeaders {
  "webhook-id": string;
  "webhook-timestamp": string;
  "webhook-signature": string;
}

/** Verify Dodo's Standard Webhooks signature over id.timestamp.raw-body. */
export function dodoVerifyWebhook(
  payload: string,
  headers: DodoWebhookHeaders,
): boolean {
  const secret = process.env.DODO_WEBHOOK_SECRET;
  if (!secret) return false;

  try {
    new Webhook(secret).verify(payload, headers, { jsonParse: false });
    return true;
  } catch {
    return false;
  }
}