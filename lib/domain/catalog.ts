import { prisma } from "@/lib/db/prisma";

export async function listProducts() {
  return prisma.product.findMany({
    where: { inStock: true },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    orderBy: { name: "asc" },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
}
