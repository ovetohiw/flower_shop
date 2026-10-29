"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addToCartAction } from "@/lib/actions/cart";

export function AddToCartButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            const result = await addToCartAction(productId);
            if (!result.ok) {
              router.push(result.redirectTo);
              return;
            }
            setMessage("Добавлено в корзину");
            router.refresh();
          });
        }}
        className="inline-flex w-full items-center justify-center rounded-full bg-leaf px-6 py-3 text-sm font-medium text-cream transition hover:bg-leaf-deep disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Добавляем…" : "В корзину"}
      </button>
      {message ? <p className="text-sm text-leaf">{message}</p> : null}
    </div>
  );
}
