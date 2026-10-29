"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { updateCartItemAction } from "@/lib/actions/cart";

export function CartQuantityControls({
  productId,
  quantity,
}: {
  productId: string;
  quantity: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function change(next: number) {
    startTransition(async () => {
      await updateCartItemAction(productId, next);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => change(quantity - 1)}
        className="h-9 w-9 rounded-full border border-line bg-cream hover:border-leaf"
        aria-label="Уменьшить"
      >
        −
      </button>
      <span className="w-8 text-center">{quantity}</span>
      <button
        type="button"
        disabled={pending}
        onClick={() => change(quantity + 1)}
        className="h-9 w-9 rounded-full border border-line bg-cream hover:border-leaf"
        aria-label="Увеличить"
      >
        +
      </button>
    </div>
  );
}
