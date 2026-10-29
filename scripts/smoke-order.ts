/**
 * Skvoznoi smoke without browser: register-like user → cart → order → mock pay → history
 */
import { hash } from "bcryptjs";
import { PrismaClient, OrderStatus } from "@prisma/client";
import { addToCart, getOrCreateCart } from "../lib/domain/cart";
import { createOrderFromCart, listOrdersForUser, markOrderPaid } from "../lib/domain/orders";

const prisma = new PrismaClient();

async function main() {
  const email = `smoke_${Date.now()}@example.com`;
  const user = await prisma.user.create({
    data: {
      email,
      name: "Smoke User",
      passwordHash: await hash("secret12", 10),
    },
  });

  const product = await prisma.product.findFirst();
  if (!product) throw new Error("No products — run db:seed");

  await addToCart(user.id, product.id, 1);
  const cart = await getOrCreateCart(user.id);
  if (cart.items.length !== 1) throw new Error("Cart empty after add");

  const order = await createOrderFromCart(user.id, {
    code: "MSK1",
    name: "СДЭК — Тверская",
    address: "Москва, ул. Тверская, 12",
    lat: 55.7577,
    lng: 37.6135,
  });

  if (order.status !== OrderStatus.pending_payment) {
    throw new Error(`Expected pending_payment, got ${order.status}`);
  }

  await markOrderPaid(order.id, `mock_${order.id}`);
  const orders = await listOrdersForUser(user.id);
  const paid = orders.find((o) => o.id === order.id);
  if (!paid || paid.status !== OrderStatus.paid) {
    throw new Error("Order not paid in history");
  }
  if (paid.userId !== user.id) throw new Error("Order user mismatch");

  console.log(
    JSON.stringify({
      ok: true,
      email,
      orderId: order.id,
      status: paid.status,
      pickup: paid.pickupAddress,
      totalRub: paid.totalRub,
    }),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
