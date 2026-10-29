# Flora — магазин цветов

Интернет-магазин букетов (РФ/СНГ): витрина, регистрация клиентов, корзина, оплата ЮKassa, самовывоз в ПВЗ СДЭК на Яндекс.Картах.

## Стек

См. [STACK.md](STACK.md): Next.js (TypeScript) · Tailwind · Prisma · PostgreSQL · Auth.js.

## Быстрый старт

```bash
cp .env.example .env
docker compose up -d
npm install
npm run db:push
npm run db:seed
npm run dev
```

Откройте http://localhost:3000

Переменные окружения — `.env.example`. Без ключей ЮKassa работает mock (`YOOKASSA_MOCK=1`); без СДЭК — seed ПВЗ; без ключа Яндекс.Карт — выбор из списка.

## Документы процесса

| Путь | Роль |
|------|------|
| [AGENTS.md](AGENTS.md) | Операционка агента и слоты verify |
| [PROGRESS.md](PROGRESS.md) | Handoff сессии |
| [FEATURE.md](FEATURE.md) | Контракт активной фичи |
| [PLANS.md](PLANS.md) | Политика exec plans |
| [STACK.md](STACK.md) | Выбранный стэк |
| [docs/exec-plans/](docs/exec-plans/index.md) | Планы и архив |
| [docs/convention/](docs/convention/index.md) | Доменные ограничения агента |
| [refs/](refs/README.md) | Визуальные референсы UI |

## Команды

- `npm run dev` — разработка
- `npm run lint` / `npm run build` / `npm run test` — проверки
- `npm run db:seed` — каталог букетов
