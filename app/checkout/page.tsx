import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/CheckoutForm";
import { auth } from "@/lib/auth";
import { cartTotalRub, getOrCreateCart } from "@/lib/domain/cart";
import { listPickupPoints } from "@/lib/integrations/cdek";

export const metadata = { title: "Оформление" };

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const cart = await getOrCreateCart(session.user.id);
  if (cart.items.length === 0) redirect("/cart");

  const points = await listPickupPoints("Москва");
  const total = cartTotalRub(cart.items);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 font-[family-name:var(--font-display)] text-4xl">Оформление заказа</h1>
      <CheckoutForm points={points} totalRub={total} />
    </div>
  );
}
