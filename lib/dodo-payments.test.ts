import { afterEach, describe, expect, it } from "vitest";
import { Webhook } from "standardwebhooks";
import { dodoVerifyWebhook } from "./dodo-payments";

const originalSecret = process.env.DODO_WEBHOOK_SECRET;
const testSecret = `whsec_${Buffer.from("soapcraft-pro-webhook-test-secret").toString("base64")}`;

function signedFixture(payload: string) {
  const webhook = new Webhook(testSecret);
  const id = "evt_test_123";
  const timestamp = new Date();
  return {
    "webhook-id": id,
    "webhook-timestamp": Math.floor(timestamp.getTime() / 1000).toString(),
    "webhook-signature": webhook.sign(id, timestamp, payload),
  };
}

afterEach(() => {
  if (originalSecret === undefined) delete process.env.DODO_WEBHOOK_SECRET;
  else process.env.DODO_WEBHOOK_SECRET = originalSecret;
});

describe("Dodo Standard Webhooks verification", () => {
  it("fails closed when the signing secret is absent", () => {
    delete process.env.DODO_WEBHOOK_SECRET;
    expect(
      dodoVerifyWebhook("{}", {
        "webhook-id": "evt_test_123",
        "webhook-timestamp": "0",
        "webhook-signature": "v1,invalid",
      }),
    ).toBe(false);
  });

  it("accepts a valid id.timestamp.raw-body signature", () => {
    process.env.DODO_WEBHOOK_SECRET = testSecret;
    const payload = JSON.stringify({ type: "payment.succeeded", data: { id: "pay_1" } });
    expect(dodoVerifyWebhook(payload, signedFixture(payload))).toBe(true);
  });

  it("rejects payload tampering", () => {
    process.env.DODO_WEBHOOK_SECRET = testSecret;
    const payload = JSON.stringify({ type: "payment.succeeded", data: { id: "pay_1" } });
    expect(dodoVerifyWebhook(`${payload} `, signedFixture(payload))).toBe(false);
  });
});
