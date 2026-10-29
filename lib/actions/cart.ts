"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { addToCart, updateCartItem } from "@/lib/domain/cart";

export async function addToCartAction(productId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false as const, redirectTo: "/login" };
  }
  await addToCart(session.user.id, productId, 1);
  revalidatePath("/cart");
  revalidatePath("/catalog");
  return { ok: true as const };
}

export async function updateCartItemAction(productId: string, quantity: number) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false as const, redirectTo: "/login" };
  }
  await updateCartItem(session.user.id, productId, quantity);
  revalidatePath("/cart");
  return { ok: true as const };
}
