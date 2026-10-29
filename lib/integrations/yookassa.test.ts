import { describe, expect, it } from "vitest";
import { parseYooKassaWebhook } from "@/lib/integrations/yookassa";

describe("parseYooKassaWebhook", () => {
  it("extracts succeeded payment", () => {
    const parsed = parseYooKassaWebhook({
      event: "payment.succeeded",
      object: {
        id: "pay_1",
        status: "succeeded",
        metadata: { orderId: "ord_1" },
      },
    });
    expect(parsed).toEqual({
      paymentId: "pay_1",
      orderId: "ord_1",
      succeeded: true,
    });
  });

  it("returns null without metadata", () => {
    expect(
      parseYooKassaWebhook({
        event: "payment.succeeded",
        object: { id: "pay_1", status: "succeeded" },
      }),
    ).toBeNull();
  });
});
