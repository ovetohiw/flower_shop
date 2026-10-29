import { OrderStatus, PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { cartTotalRub, clearCart, getOrCreateCart } from "@/lib/domain/cart";

export type PickupSelection = {
  code: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
};

export async function createOrderFromCart(userId: string, pickup: PickupSelection) {
  const cart = await getOrCreateCart(userId);
  if (cart.items.length === 0) {
    throw new Error("Корзина пуста");
  }

  const totalRub = cartTotalRub(cart.items);

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId,
        status: OrderStatus.pending_payment,
        totalRub,
        pickupCode: pickup.code,
        pickupName: pickup.name,
        pickupAddress: pickup.address,
        pickupLat: pickup.lat,
        pickupLng: pickup.lng,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            unitPrice: item.product.priceRub,
            quantity: item.quantity,
          })),
        },
        payment: {
          create: {
            amountRub: totalRub,
            status: PaymentStatus.pending,
          },
        },
      },
      include: { items: true, payment: true },
    });

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    return created;
  });

  return order;
}

export async function listOrdersForUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true, payment: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderForUser(userId: string, orderId: string) {
  return prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: true, payment: true },
  });
}

export async function markOrderPaid(orderId: string, yookassaPaymentId: string) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });
    if (!order) {
      throw new Error("Заказ не найден");
    }
    if (order.status === OrderStatus.paid || order.status === OrderStatus.completed) {
      return order;
    }

    await tx.payment.update({
      where: { orderId },
      data: {
        status: PaymentStatus.succeeded,
        yookassaPaymentId,
      },
    });

    return tx.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.paid },
      include: { items: true, payment: true },
    });
  });
}

export async function attachConfirmationUrl(orderId: string, url: string, yookassaPaymentId: string) {
  return prisma.payment.update({
    where: { orderId },
    data: {
      confirmationUrl: url,
      yookassaPaymentId,
      status: PaymentStatus.waiting_for_capture,
    },
  });
}

export { clearCart };
