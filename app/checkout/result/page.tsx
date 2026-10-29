import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getOrderForUser, markOrderPaid } from "@/lib/domain/orders";
import { isYooKassaMockMode } from "@/lib/integrations/yookassa";

type Props = {
  searchParams: Promise<{ orderId?: string; mockPay?: string; paymentId?: string }>;
};

export default async function CheckoutResultPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const params = await searchParams;
  const orderId = params.orderId;
  if (!orderId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Нет данных заказа</h1>
        <Link href="/account" className="mt-4 inline-block text-leaf">
          В кабинет
        </Link>
      </div>
    );
  }

  if (params.mockPay === "1" && params.paymentId && isYooKassaMockMode()) {
    await markOrderPaid(orderId, params.paymentId);
    redirect(`/account/orders/${orderId}?paid=1`);
  }

  const order = await getOrderForUser(session.user.id, orderId);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-3xl">
        {order?.status === "paid" ? "Оплата прошла успешно" : "Ожидаем подтверждение оплаты"}
      </h1>
      <p className="mt-3 text-ink-muted">
        {order?.status === "paid"
          ? "Заказ появится в истории покупок."
          : "Если вы уже оплатили, статус обновится после уведомления от ЮKassa."}
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href={`/account/orders/${orderId}`} className="rounded-full bg-leaf px-5 py-2.5 text-cream">
          К заказу
        </Link>
        <Link href="/account" className="rounded-full border border-line px-5 py-2.5">
          Кабинет
        </Link>
      </div>
    </div>
  );
}
