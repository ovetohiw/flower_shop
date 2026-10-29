import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { getProductBySlug } from "@/lib/domain/catalog";
import { formatRub } from "@/lib/money";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product?.name ?? "Товар" };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const image = product.images[0];

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-2 sm:px-6">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-bg-deep">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : null}
      </div>
      <div className="flex flex-col justify-center space-y-6">
        <Link href="/catalog" className="text-sm text-ink-muted hover:text-leaf">
          ← К каталогу
        </Link>
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink sm:text-5xl">
          {product.name}
        </h1>
        <p className="text-2xl text-leaf">{formatRub(product.priceRub)}</p>
        <p className="max-w-prose leading-relaxed text-ink-muted">{product.description}</p>
        <AddToCartButton productId={product.id} />
      </div>
    </div>
  );
}
