import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { cartTotalRub, getOrCreateCart } from "@/lib/domain/cart";
import { formatRub } from "@/lib/money";
import { CartQuantityControls } from "@/components/CartQuantityControls";

export const metadata = { title: "Корзина" };

export default async function CartPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const cart = await getOrCreateCart(session.user.id);
  const total = cartTotalRub(cart.items);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl">Корзина</h1>

      {cart.items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-line bg-cream p-8">
          <p className="text-ink-muted">Корзина пуста.</p>
          <Link href="/catalog" className="mt-4 inline-block text-leaf hover:underline">
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <ul className="space-y-4">
            {cart.items.map((item) => {
              const image = item.product.images[0];
              return (
                <li
                  key={item.id}
                  className="flex flex-col gap-4 rounded-2xl border border-line bg-cream/80 p-4 sm:flex-row sm:items-center"
                >
                  <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-bg-deep">
                    {image ? (
                      <Image src={image.url} alt={image.alt} fill className="object-cover" />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="font-[family-name:var(--font-display)] text-xl hover:text-leaf"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-ink-muted">{formatRub(item.product.priceRub)}</p>
                  </div>
                  <CartQuantityControls productId={item.productId} quantity={item.quantity} />
                  <p className="font-medium">
                    {formatRub(item.quantity * item.product.priceRub)}
                  </p>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-col items-start justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
            <p className="text-lg">
              Итого: <span className="font-medium">{formatRub(total)}</span>
            </p>
            <Link
              href="/checkout"
              className="rounded-full bg-leaf px-6 py-3 text-sm font-medium text-cream hover:bg-leaf-deep"
            >
              Оформить заказ
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
