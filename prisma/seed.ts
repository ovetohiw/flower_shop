import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    slug: "rose-blush",
    name: "Розовый шёлк",
    description:
      "Нежный букет из пионовидных роз и эвкалипта. Идеален для признания и тёплых встреч. Стойкость в вазе — до 7 дней при ежедневной смене воды.",
    priceRub: 4900,
    images: [
      {
        url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80",
        alt: "Букет розовых роз",
        sortOrder: 0,
      },
    ],
  },
  {
    slug: "white-garden",
    name: "Белый сад",
    description:
      "Воздушная композиция из белых роз, эустомы и зелени. Сдержанная элегантность для свадеб и юбилеев.",
    priceRub: 5600,
    images: [
      {
        url: "https://images.unsplash.com/photo-1563241527-3004b7ea3fce?w=1200&q=80",
        alt: "Белый букет",
        sortOrder: 0,
      },
    ],
  },
  {
    slug: "coral-dawn",
    name: "Коралловый рассвет",
    description:
      "Яркий микс коралловых роз и альстромерий. Поднимает настроение и наполняет дом цветом.",
    priceRub: 4200,
    images: [
      {
        url: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&q=80",
        alt: "Коралловый букет",
        sortOrder: 0,
      },
    ],
  },
  {
    slug: "lavender-mist",
    name: "Лавандовый туман",
    description:
      "Сиреневые розы и веточки лаванды. Тонкий аромат и спокойная палитра для домашнего уюта.",
    priceRub: 5100,
    images: [
      {
        url: "https://images.unsplash.com/photo-1455659817273-f96807741567?w=1200&q=80",
        alt: "Лавандовый букет",
        sortOrder: 0,
      },
    ],
  },
  {
    slug: "sunny-meadow",
    name: "Солнечный луг",
    description:
      "Подсолнухи, ромашки и зелень. Летнее настроение в любой сезон — для друзей и коллег.",
    priceRub: 3800,
    images: [
      {
        url: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=1200&q=80",
        alt: "Солнечный букет",
        sortOrder: 0,
      },
    ],
  },
  {
    slug: "scarlet-heart",
    name: "Алое сердце",
    description:
      "Классика: красные розы премиум-класса. Глубокий цвет и бархатистые лепестки.",
    priceRub: 6500,
    images: [
      {
        url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80",
        alt: "Красные розы",
        sortOrder: 0,
      },
    ],
  },
  {
    slug: "peony-cloud",
    name: "Пионовый облак",
    description:
      "Пышные пионы сезонной срезки. Объёмная шапка цветков — акцент любого интерьера.",
    priceRub: 7200,
    images: [
      {
        url: "https://images.unsplash.com/photo-1496062031456-07b21f836cc7?w=1200&q=80",
        alt: "Пионы",
        sortOrder: 0,
      },
    ],
  },
  {
    slug: "forest-breath",
    name: "Дыхание леса",
    description:
      "Авторская композиция с зеленью, ягодами и акцентами сезонных цветов. Для тех, кто любит природный стиль.",
    priceRub: 4500,
    images: [
      {
        url: "https://images.unsplash.com/photo-1468327768560-75b630cfd0a7?w=1200&q=80",
        alt: "Зелёная композиция",
        sortOrder: 0,
      },
    ],
  },
];

async function main() {
  for (const product of products) {
    const { images, ...data } = product;
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: {
        name: data.name,
        description: data.description,
        priceRub: data.priceRub,
        images: {
          deleteMany: {},
          create: images,
        },
      },
      create: {
        ...data,
        images: { create: images },
      },
    });
  }

  console.log(`Seeded ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
