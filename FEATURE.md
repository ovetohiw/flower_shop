# FEATURE.md

Форма ТЗ на **одну** активную фичу и место доказательств готовности.

## Текущая фича

### Мета

- ID: docker-full-stack
- Название: Полный запуск приложения через Docker Compose
- Приоритет: P1
- Статус: готово
- Дата: 2026-10-29
- Exec plan: docs/exec-plans/completed/2026-10-29-docker-full-stack/

### Проблема и цель

- Проблема: Compose поднимал только Postgres; Next.js и схема БД требовали ручного `npm` на хосте.
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
- Ошибки и отказы: без БД app не поднимается; Compose задаёт `DATABASE_URL`/`AUTH_SECRET` для app
- Границы и контракт: секреты только через env/compose; код не монтируется volume’ом в prod-like запуске

### Критерии приёмки

- [x] Есть Dockerfile (standalone) и `.dockerignore`; локальный `npm run build` на хосте не сломан
- [x] `docker compose up --build` поднимает `db` + `app`; главная отдаёт HTTP 200
- [x] При старте app схема Prisma применена и seed каталога выполнен (или явно задокументирован флаг)
- [x] Документация быстрого старта описывает Docker-полный путь; `.env.example` согласован с Compose

### Верификация

- [ ] Unit
- [ ] Интеграция
- [x] Сквозной путь
- [ ] Health-check
- [x] Базовая верификация из AGENTS.md зелёная

Команды:

- Поднять приложение: `docker compose up --build -d`
- Прогнать тесты: `npm run test`
- Верификация: `npm run lint` ; `npm run build`

### Ограничения

- [docs/convention/index.md](docs/convention/index.md)
- [STACK.md](STACK.md) — Docker / Docker Compose
- Без K8s/PaaS в скоупе

### Риски и открытые решения

- Миграции через `prisma db push` (папки `prisma/migrations` нет)
- `SEED_ON_START=1` по умолчанию; seed upsert идемпотентен
- Образ тяжелее из‑за `/prisma-tools` (полный npm ci для Prisma CLI)

### Доказательства DoD

#### Гейты

- [x] Все критерии приёмки отмечены; у каждого заполнены все поля схемы
- [x] У каждого отмеченного уровня верификации заполнены все поля схемы; результат не fail
- [x] Слоты AGENTS зелёные **или** в доказательствах явно «слоты пусты» + что проверено вместо этого
- [x] Нет открытого блокера в PROGRESS, отменяющего заявленный прогон
- [x] При Exec plan: этапы до закрытия фичи `готово` с DoD этапа (или фича снята / сужена с записью)

#### По критериям приёмки

- Критерий: Dockerfile + standalone; хост build
  - Команда / действие: наличие `Dockerfile`, `.dockerignore`, `output: "standalone"`; `npm run build`
  - Результат: build success (Next 15.5.28); `.next/standalone/server.js`
  - Артефакт: `Dockerfile`; `next.config.ts`; terminal build
  - Дата / сессия: 2026-10-29 / 003–005

- Критерий: Compose db+app → HTTP 200
  - Команда / действие: `docker compose up --build -d`; `Invoke-WebRequest http://localhost:3000/`
  - Результат: app Up; status=200
  - Артефакт: `docker-compose.yml`; compose ps; HTTP response
  - Дата / сессия: 2026-10-29 / 004–005

- Критерий: schema + seed на старте
  - Команда / действие: логи `docker compose logs app`; флаг `SEED_ON_START` в compose/`.env.example`
  - Результат: db push sync; `Seeded 8 products`; Next Ready
  - Артефакт: `docker/entrypoint.sh`; app logs
  - Дата / сессия: 2026-10-29 / 004–005

- Критерий: документация и `.env.example`
  - Команда / действие: обзор README / `.env.example` / AGENTS / STACK
  - Результат: быстрый старт — `docker compose up --build -d`; host vs `db` в комментариях env; слоты AGENTS обновлены
  - Артефакт: `README.md`; `.env.example`; `AGENTS.md`; `STACK.md`
  - Дата / сессия: 2026-10-29 / 005

#### По уровням верификации

- Уровень: Сквозной путь
  - Команда / действие: `docker compose up --build -d` → HTTP GET `/`
  - Результат: status=200; seed + Ready в логах
  - Артефакт: compose logs; Invoke-WebRequest
  - Дата / сессия: 2026-10-29 / 005

- Уровень: Базовая верификация AGENTS
  - Команда / действие: `npm run lint` ; `npm run build`
  - Результат: lint clean; build success
  - Артефакт: terminal output
  - Дата / сессия: 2026-10-29 / 005

#### Остаточный риск

- Образ включает `/prisma-tools` (размер); порт 3000 на хосте должен быть свободен для publish
- Боевые ключи интеграций по-прежнему опциональны (mock/seed)

## Лог завершённых

### flower-shop-mvp (2026-10-29)

- Название: MVP сайта продажи цветов (РФ/СНГ)
- Статус: готово
- Exec plan (архив): [docs/exec-plans/completed/2026-10-29-flower-shop/](docs/exec-plans/completed/2026-10-29-flower-shop/)
- Ranking: B
- Кратко: каталог, auth, корзина, ПВЗ СДЭК (seed), ЮKassa mock, ЛК, florist UI; Compose только для БД
