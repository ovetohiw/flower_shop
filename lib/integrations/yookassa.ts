import { randomUUID } from "crypto";

export type CreatePaymentInput = {
  orderId: string;
  amountRub: number;
  description: string;
  returnUrl: string;
};

export type CreatePaymentResult = {
  id: string;
  confirmationUrl: string;
  status: string;
  mock: boolean;
};

export function isYooKassaMockMode() {
  if (process.env.YOOKASSA_MOCK === "1") return true;
  return !process.env.YOOKASSA_SHOP_ID || !process.env.YOOKASSA_SECRET_KEY;
}

export async function createYooKassaPayment(
  input: CreatePaymentInput,
): Promise<CreatePaymentResult> {
  if (isYooKassaMockMode()) {
    const id = `mock_${input.orderId}_${randomUUID().slice(0, 8)}`;
    const confirmationUrl = `${input.returnUrl}?orderId=${input.orderId}&mockPay=1&paymentId=${id}`;
    return { id, confirmationUrl, status: "pending", mock: true };
  }

  const shopId = process.env.YOOKASSA_SHOP_ID!;
  const secret = process.env.YOOKASSA_SECRET_KEY!;
  const auth = Buffer.from(`${shopId}:${secret}`).toString("base64");

  const res = await fetch("https://api.yookassa.ru/v3/payments", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      "Idempotence-Key": randomUUID(),
    },
    body: JSON.stringify({
      amount: {
        value: input.amountRub.toFixed(2),
        currency: "RUB",
      },
      capture: true,
      confirmation: {
        type: "redirect",
        return_url: `${input.returnUrl}?orderId=${input.orderId}`,
      },
      description: input.description,
      metadata: { orderId: input.orderId },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ЮKassa error: ${res.status} ${text}`);
  }

  const data = (await res.json()) as {
    id: string;
    status: string;
    confirmation?: { confirmation_url?: string };
  };

  const confirmationUrl = data.confirmation?.confirmation_url;
  if (!confirmationUrl) {
    throw new Error("ЮKassa не вернула confirmation_url");
  }

  return {
    id: data.id,
    confirmationUrl,
    status: data.status,
    mock: false,
  };
}

export type YooKassaWebhookEvent = {
  event: string;
  object: {
    id: string;
    status: string;
    metadata?: { orderId?: string };
  };
};

export function parseYooKassaWebhook(body: unknown): {
  paymentId: string;
  orderId: string;
  succeeded: boolean;
} | null {
  const event = body as YooKassaWebhookEvent;
  if (!event?.object?.id) return null;
  const orderId = event.object.metadata?.orderId;
  if (!orderId) return null;
  return {
    paymentId: event.object.id,
    orderId,
    succeeded: event.event === "payment.succeeded" || event.object.status === "succeeded",
  };
}
