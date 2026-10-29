import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { markOrderPaid } from "@/lib/domain/orders";
import { isYooKassaMockMode } from "@/lib/integrations/yookassa";

/** Test harness for local DoD when YOOKASSA_MOCK=1 */
export async function POST(request: NextRequest) {
  if (!isYooKassaMockMode()) {
    return NextResponse.json({ error: "mock disabled" }, { status: 403 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { orderId?: string; paymentId?: string };
  if (!body.orderId || !body.paymentId) {
    return NextResponse.json({ error: "orderId and paymentId required" }, { status: 400 });
  }

  const order = await markOrderPaid(body.orderId, body.paymentId);
  return NextResponse.json({ ok: true, status: order.status });
}
