import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getOrderForUser } from "@/lib/domain/orders";
import { formatRub } from "@/lib/money";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ paid?: string }>;
};

const statusLabel: Record<string, string> = {
  pending_payment: "Ожидает оплаты",
  paid: "Оплачен",
  ready_for_pickup: "Готов к выдаче",
  completed: "Завершён",
  cancelled: "Отменён",
};

export default async function OrderDetailPage({ params, searchParams }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const { paid } = await searchParams;
  const order = await getOrderForUser(session.user.id, id);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/account" className="text-sm text-ink-muted hover:text-leaf">
        ← К истории
      </Link>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl">
        Заказ {order.id.slice(-8)}
      </h1>
      {paid === "1" ? (
        <p className="mt-3 rounded-xl bg-bg-deep px-4 py-3 text-leaf">Оплата подтверждена</p>
      ) : null}
      <p className="mt-2 text-ink-muted">
        Статус: {statusLabel[order.status] ?? order.status} ·{" "}
        {new Date(order.createdAt).toLocaleString("ru-RU")}
      </p>

      {order.pickupAddress ? (
        <section className="mt-8 rounded-2xl border border-line bg-cream p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl">Пункт выдачи</h2>
          <p className="mt-2">{order.pickupName}</p>
          <p className="text-ink-muted">{order.pickupAddress}</p>
          {order.pickupCode ? (
            <p className="mt-1 text-sm text-ink-muted">Код ПВЗ: {order.pickupCode}</p>
          ) : null}
        </section>
      ) : null}

      <section className="mt-8">
        <h2 className="font-[family-name:var(--font-display)] text-xl">Состав</h2>
        <ul className="mt-4 space-y-3">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between border-b border-line py-3"
            >
              <span>
                {item.productName} × {item.quantity}
              </span>
              <span>{formatRub(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-lg font-medium">Итого: {formatRub(order.totalRub)}</p>
      </section>

      {order.status === "pending_payment" && order.payment?.confirmationUrl ? (
        <a
          href={order.payment.confirmationUrl}
          className="mt-8 inline-flex rounded-full bg-leaf px-6 py-3 text-sm text-cream hover:bg-leaf-deep"
        >
          Перейти к оплате
        </a>
      ) : null}
    </div>
  );
}
