# PROGRESS.md

Handoff между сессиями: проверенное состояние, блокер, следующий шаг, краткий лог.
Не дублируйте контракт фичи ([FEATURE.md](FEATURE.md)), этапы плана (`docs/exec-plans/`) и оценки качества ([ranking](docs/exec-plans/ranking/index.md)).

## Текущее проверенное состояние

- Корень репозитория: Next.js приложение Flora (монолит)
- Стандартный путь старта: по AGENTS.md (sync remote → PROGRESS → FEATURE → exec plan при наличии → автономный цикл; commit+push по DoD этапа); доменные ограничения агента — [docs/convention/index.md](docs/convention/index.md)
- Стандартный путь верификации: `npm run lint` && `npm run build` && `npm run test`; поднять: docker compose + db:push/seed + `npm run dev`
- Текущая незавершённая фича с наивысшим приоритетом: нет (flower-shop-mvp статус `готово` в FEATURE)
- Текущий блокер: нет (ключи ЮKassa/СДЭК/Яндекс опциональны — mock/seed)
- Remote: origin/main; ветка main; push выполнен (`6268180`)

## Лог сессий

### Сессия 001

- Дата: 2026-10-29
- Цель: реализовать MVP сайта продажи цветов по плану (E1–E7)
- Сделано:
  - Scaffold Next.js + Tailwind + Prisma + Postgres (Docker Compose)
  - Auth.js регистрация/вход/ЛК
  - Каталог + карточки (8 seed-букетов)
  - Корзина, checkout с ПВЗ (СДЭК API / seed + Яндекс.Карты)
  - ЮKassa + mock harness + webhook
  - История заказов, florist UI
- Запущенная верификация: lint OK; build OK; vitest 3/3; smoke-order.ts ok; HTTP 200 home/catalog/product; pickup-points API
- Известный риск: без реальных ключей — mock оплата и seed ПВЗ; карта без `NEXT_PUBLIC_YANDEX_MAPS_API_KEY` — список
- Следующий лучший шаг: выдать ключи ЮKassa/СДЭК/Яндекс для боевого режима; при желании перенести plan в completed/ranking; UI-полировка по refs
