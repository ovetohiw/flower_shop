"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { attachConfirmationUrl, createOrderFromCart, markOrderPaid } from "@/lib/domain/orders";
import { createYooKassaPayment } from "@/lib/integrations/yookassa";

const pickupSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  address: z.string().min(1),
  lat: z.coerce.number(),
  lng: z.coerce.number(),
});

export async function checkoutAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const pickup = pickupSchema.parse({
    code: formData.get("code"),
    name: formData.get("name"),
    address: formData.get("address"),
    lat: formData.get("lat"),
    lng: formData.get("lng"),
  });

  const order = await createOrderFromCart(session.user.id, pickup);
  const returnUrl =
    process.env.YOOKASSA_RETURN_URL || "http://localhost:3000/checkout/result";

  const payment = await createYooKassaPayment({
    orderId: order.id,
    amountRub: order.totalRub,
    description: `Заказ цветов ${order.id}`,
    returnUrl,
  });

  await attachConfirmationUrl(order.id, payment.confirmationUrl, payment.id);
  redirect(payment.confirmationUrl);
}

export async function mockCompletePaymentAction(orderId: string, paymentId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  await markOrderPaid(orderId, paymentId);
  redirect(`/account/orders/${orderId}?paid=1`);
}
