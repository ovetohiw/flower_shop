import Image from "next/image";
import Link from "next/link";
import { listProducts } from "@/lib/domain/catalog";
import { formatRub } from "@/lib/money";

export const metadata = { title: "Каталог" };

export default async function CatalogPage() {
  const products = await listProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-10 max-w-2xl">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink sm:text-5xl">
          Каталог букетов
        </h1>
        <p className="mt-3 text-ink-muted">Свежая срезка и собранные вручную композиции.</p>
      </header>

      {products.length === 0 ? (
        <p className="rounded-2xl border border-line bg-cream p-8 text-ink-muted">
          Каталог пока пуст. Запустите seed базы данных.
        </p>
      ) : (
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const image = product.images[0];
            return (
              <li key={product.id}>
                <Link
                  href={`/product/${product.slug}`}
                  className="group block overflow-hidden rounded-3xl border border-transparent transition hover:border-line"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-bg-deep">
                    {image ? (
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : null}
                  </div>
                  <div className="space-y-1 px-1 py-4">
                    <h2 className="font-[family-name:var(--font-display)] text-2xl text-ink">
                      {product.name}
                    </h2>
                    <p className="text-leaf">{formatRub(product.priceRub)}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
