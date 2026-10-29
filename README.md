# Flora — магазин цветов

Интернет-магазин букетов (РФ/СНГ): витрина, регистрация клиентов, корзина, оплата ЮKassa, самовывоз в ПВЗ СДЭК на Яндекс.Картах.

## Стек

См. [STACK.md](STACK.md): Next.js (TypeScript) · Tailwind · Prisma · PostgreSQL · Auth.js · Docker Compose.

## Быстрый старт (Docker, app + БД)

```bash
cp .env.example .env
# при необходимости задайте AUTH_SECRET в .env — Compose подхватит его для сервиса app
docker compose up --build -d
```

Откройте http://localhost:3000

При старте контейнер `app`: ждёт Postgres → `prisma db push` → seed каталога (`SEED_ON_START=1` по умолчанию) → Next.js standalone.

Остановка: `docker compose down`

Переменные — [`.env.example`](.env.example). Без ключей ЮKassa работает mock (`YOOKASSA_MOCK=1`); без СДЭК — seed ПВЗ; без ключа Яндекс.Карт — выбор из списка.

## Разработка на хосте (опционально)

Нужны Node.js и поднятая БД (можно только `docker compose up -d db`):

```bash
cp .env.example .env
docker compose up -d db
npm install
npm run db:push
npm run db:seed
npm run dev
```

В `.env` для хоста: `DATABASE_URL` с хостом `localhost` (не `db`).

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

- `docker compose up --build -d` — полный стек (app + Postgres)
- `npm run dev` — разработка на хосте
- `npm run lint` / `npm run build` / `npm run test` — проверки на хосте
- `npm run db:seed` — каталог букетов (хост)
