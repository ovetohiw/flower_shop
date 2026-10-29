"use client";

import { useState } from "react";
import { checkoutAction } from "@/lib/actions/checkout";
import { PickupMap } from "@/components/PickupMap";
import type { PickupPoint } from "@/lib/integrations/cdek";
import { formatRub } from "@/lib/money";

type Props = {
  points: PickupPoint[];
  totalRub: number;
};

export function CheckoutForm({ points, totalRub }: Props) {
  const [selected, setSelected] = useState<PickupPoint | null>(points[0] ?? null);
  const [pending, setPending] = useState(false);

  return (
    <form
      action={async (formData) => {
        if (!selected) return;
        setPending(true);
        formData.set("code", selected.code);
        formData.set("name", selected.name);
        formData.set("address", selected.address);
        formData.set("lat", String(selected.lat));
        formData.set("lng", String(selected.lng));
        await checkoutAction(formData);
      }}
      className="grid gap-8 lg:grid-cols-2"
    >
      <div>
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-2xl">Пункт выдачи СДЭК</h2>
        <PickupMap points={points} selectedCode={selected?.code ?? null} onSelect={setSelected} />
      </div>
      <div className="space-y-4 rounded-3xl border border-line bg-cream/80 p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">Оплата</h2>
        <p className="text-ink-muted">
          К оплате: <span className="text-lg font-medium text-ink">{formatRub(totalRub)}</span>
        </p>
        {selected ? (
          <p className="text-sm text-ink-muted">
            Выбрано: {selected.name}, {selected.address}
          </p>
        ) : (
          <p className="text-sm text-blush">Выберите пункт выдачи</p>
        )}
        <button
          type="submit"
          disabled={!selected || pending}
          className="w-full rounded-full bg-leaf py-3 text-sm font-medium text-cream transition hover:bg-leaf-deep disabled:opacity-50"
        >
          {pending ? "Переходим к оплате…" : "Оплатить через ЮKassa"}
        </button>
      </div>
    </form>
  );
}
