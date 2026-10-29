import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="relative min-h-[88vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=2000&q=80"
          alt="Букет цветов Flora"
          fill
          priority
          className="animate-hero-media object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/35 to-transparent" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-24">
          <p className="animate-rise font-[family-name:var(--font-display)] text-5xl text-cream sm:text-7xl md:text-8xl">
            Flora
          </p>
          <h1 className="animate-rise-delay mt-4 max-w-xl text-xl text-cream/95 sm:text-2xl">
            Свежие букеты к вашему поводу — с самовывозом из пунктов СДЭК
          </h1>
          <div className="animate-fade mt-8 flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="rounded-full bg-cream px-6 py-3 text-sm font-medium text-ink transition hover:bg-blush-soft"
            >
              Смотреть каталог
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-cream/60 px-6 py-3 text-sm font-medium text-cream transition hover:bg-cream/10"
            >
              Создать аккаунт
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-ink sm:text-4xl">
          Как это работает
        </h2>
        <p className="mt-3 max-w-2xl text-ink-muted">
          Выберите букет, оформите заказ, заберите в удобном пункте выдачи после оплаты.
        </p>
        <ol className="mt-10 grid gap-8 sm:grid-cols-3">
          {[
            { title: "Выберите букет", text: "Витрина с описаниями и актуальными ценами." },
            { title: "Оплатите онлайн", text: "Безопасная оплата через ЮKassa." },
            { title: "Заберите в ПВЗ", text: "Пункт СДЭК на карте рядом с вами." },
          ].map((step, i) => (
            <li key={step.title} className="space-y-2">
              <p className="text-sm uppercase tracking-[0.2em] text-leaf">0{i + 1}</p>
              <h3 className="font-[family-name:var(--font-display)] text-2xl">{step.title}</h3>
              <p className="text-ink-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
