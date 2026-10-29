# FEATURE.md

Форма ТЗ на **одну** активную фичу и место доказательств готовности.

## Текущая фича

### Мета

- ID: docker-full-stack
- Название: Полный запуск приложения через Docker Compose
- Приоритет: P1
- Статус: в работе
- Дата: 2026-10-29
- Exec plan: docs/exec-plans/inprogress/task/2026-10-29-docker-full-stack/

### Проблема и цель

- Проблема: Compose поднимает только Postgres; Next.js и схема БД требуют ручного `npm` на хосте.
- Цель: одной командой `docker compose up --build` поднять приложение + БД; сайт отвечает; схема и seed применяются в контейнере.
- Что должно измениться: Dockerfile (standalone), сервис `app` в Compose, entrypoint, документация запуска.

### Скоуп

В скоупе:

- Multi-stage Dockerfile и `.dockerignore` для Next.js standalone
- Сервис `app` в Docker Compose рядом с `db`
- Entrypoint: ожидание БД → `prisma db push` → seed → `node server.js`
- Обновление `.env.example`, README/STACK/AGENTS при смене пути старта

Вне скоупа:

- Kubernetes, облачный PaaS, push в registry/CI
- Реальные ключи ЮKassa/СДЭК/Яндекс
- Смена доменной логики магазина / UI

### Поведение и контракт

- Счастливый путь: `docker compose up --build` → Postgres healthy → app стартует → HTTP 200 на `/`
- Ошибки и отказы: без `AUTH_SECRET` / `DATABASE_URL` контейнер не должен молча «успешно» отдавать сломанный рантайм; сбой БД — app не поднимается
- Границы и контракт: секреты только через env/compose; код не монтируется volume’ом в prod-like запуске

### Критерии приёмки

- [ ] Есть Dockerfile (standalone) и `.dockerignore`; локальный `npm run build` на хосте не сломан
- [ ] `docker compose up --build` поднимает `db` + `app`; главная отдаёт HTTP 200
- [ ] При старте app схема Prisma применена и seed каталога выполнен (или явно задокументирован флаг)
- [ ] Документация быстрого старта описывает Docker-полный путь; `.env.example` согласован с Compose

### Верификация

- [ ] Unit
- [ ] Интеграция
- [x] Сквозной путь
- [ ] Health-check
- [x] Базовая верификация из AGENTS.md зелёная

Команды:

- Поднять приложение: `docker compose up --build -d` (после реализации); до этого — слоты AGENTS для хост-dev
- Прогнать тесты: `npm run test`
- Верификация: `npm run lint` ; `npm run build` ; curl HTTP 200 `/` через Compose

### Ограничения

- [docs/convention/index.md](docs/convention/index.md)
- [STACK.md](STACK.md) — Docker / Docker Compose уже в стэке
- Без K8s/PaaS в скоупе

### Риски и открытые решения

- Миграции через `prisma db push` (папки `prisma/migrations` нет) — зафиксировано для entrypoint
- Seed при каждом старте должен быть идемпотентным или управляться флагом

### Доказательства DoD

#### Гейты

- [ ] Все критерии приёмки отмечены; у каждого заполнены все поля схемы
- [ ] У каждого отмеченного уровня верификации заполнены все поля схемы; результат не fail
- [ ] Слоты AGENTS зелёные **или** в доказательствах явно «слоты пусты» + что проверено вместо этого
- [ ] Нет открытого блокера в PROGRESS, отменяющего заявленный прогон
- [ ] При Exec plan: этапы до закрытия фичи `готово` с DoD этапа (или фича снята / сужена с записью)

#### По критериям приёмки

-

#### По уровням верификации

-

#### Остаточный риск

-

## Лог завершённых

### flower-shop-mvp (2026-10-29)

- Название: MVP сайта продажи цветов (РФ/СНГ)
- Статус: готово
- Exec plan (архив): [docs/exec-plans/completed/2026-10-29-flower-shop/](docs/exec-plans/completed/2026-10-29-flower-shop/)
- Ranking: B
- Кратко: каталог, auth, корзина, ПВЗ СДЭК (seed), ЮKassa mock, ЛК, florist UI; Compose только для БД
