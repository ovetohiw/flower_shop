import { prisma } from "@/lib/db/prisma";

export async function getOrCreateCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: {
      items: {
        include: {
          product: {
            include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
          },
        },
      },
    },
  });
}

export async function addToCart(userId: string, productId: string, quantity = 1) {
  const cart = await getOrCreateCart(userId);
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.inStock) {
    throw new Error("Товар недоступен");
  }

  await prisma.cartItem.upsert({
    where: {
      cartId_productId: { cartId: cart.id, productId },
    },
    update: { quantity: { increment: quantity } },
    create: { cartId: cart.id, productId, quantity },
  });

  return getOrCreateCart(userId);
}

export async function updateCartItem(userId: string, productId: string, quantity: number) {
  const cart = await getOrCreateCart(userId);
  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
  } else {
    await prisma.cartItem.update({
      where: { cartId_productId: { cartId: cart.id, productId } },
      data: { quantity },
    });
  }
  return getOrCreateCart(userId);
}

export async function clearCart(userId: string) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return;
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
}

export function cartTotalRub(
  items: { quantity: number; product: { priceRub: number } }[],
): number {
  return items.reduce((sum, item) => sum + item.quantity * item.product.priceRub, 0);
}
