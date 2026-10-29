import { NextRequest, NextResponse } from "next/server";
import { markOrderPaid } from "@/lib/domain/orders";
import { parseYooKassaWebhook } from "@/lib/integrations/yookassa";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = parseYooKassaWebhook(body);
  if (!parsed) {
    return NextResponse.json({ error: "unrecognized payload" }, { status: 400 });
  }

  if (parsed.succeeded) {
    await markOrderPaid(parsed.orderId, parsed.paymentId);
  }

  return NextResponse.json({ ok: true });
}
