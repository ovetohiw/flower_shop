import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { listOrdersForUser } from "@/lib/domain/orders";
import { formatRub } from "@/lib/money";

export const metadata = { title: "Кабинет" };

const statusLabel: Record<string, string> = {
  pending_payment: "Ожидает оплаты",
  paid: "Оплачен",
  ready_for_pickup: "Готов к выдаче",
  completed: "Завершён",
  cancelled: "Отменён",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const orders = await listOrdersForUser(session.user.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl">Личный кабинет</h1>
          <p className="mt-2 text-ink-muted">
            {session.user.name || "Клиент"} · {session.user.email}
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="rounded-full border border-line px-4 py-2 text-sm hover:border-leaf"
          >
            Выйти
          </button>
        </form>
      </div>

      <section className="mt-12">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">История покупок</h2>
        {orders.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-line bg-cream p-6 text-ink-muted">
            Заказов пока нет.{" "}
            <Link href="/catalog" className="text-leaf hover:underline">
              Выбрать букет
            </Link>
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="flex flex-col gap-2 rounded-2xl border border-line bg-cream/80 px-5 py-4 transition hover:border-leaf sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">Заказ {order.id.slice(-8)}</p>
                    <p className="text-sm text-ink-muted">
                      {new Date(order.createdAt).toLocaleString("ru-RU")}
                      {order.pickupAddress ? ` · ${order.pickupAddress}` : ""}
                    </p>
                  </div>
                  <div className="text-sm sm:text-right">
                    <p>{formatRub(order.totalRub)}</p>
                    <p className="text-leaf">{statusLabel[order.status] ?? order.status}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
