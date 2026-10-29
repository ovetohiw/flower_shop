# Результат: полный запуск через Docker Compose

## Мета

- Дата завершения: 2026-10-29
- Тип: task
- ID: docker-full-stack
- Название: Полный запуск приложения через Docker Compose

## Цель

Одной командой `docker compose up --build` поднять Next.js standalone и Postgres: HTTP 200, schema/seed в контейнере.

## Принятые решения

- `output: "standalone"`; multi-stage Dockerfile
- Compose: `db` (healthcheck) + `app`; без volume с исходниками
- Entrypoint: wait TCP → `prisma db push` → seed (`SEED_ON_START=1`) → `node server.js`
- `/prisma-tools` с полным npm ci для Prisma CLI (standalone не содержит transitive deps CLI)
- Seed: esbuild → `prisma/seed.cjs`; upsert идемпотентен
- Канон старта в README/AGENTS: полный Compose; хост-dev опционален

## Hot-fixes

- нет

## Верификация

- Гейты AGENTS пройдены: да
- Источник доказательств FEATURE: FEATURE.md (docker-full-stack)

- Критерий / уровень: Dockerfile + хост build
  - Команда / действие: `npm run build`
  - Результат: success; standalone `server.js`
  - Артефакт: Dockerfile; next.config.ts
  - Дата / сессия: 2026-10-29 / 003–005

- Критерий / уровень: Compose HTTP 200
  - Команда / действие: `docker compose up --build -d`; Invoke-WebRequest `/`
  - Результат: status=200
  - Артефакт: docker-compose.yml; compose logs
  - Дата / сессия: 2026-10-29 / 004–005

- Критерий / уровень: schema + seed
  - Команда / действие: logs entrypoint
  - Результат: db push; Seeded 8 products
  - Артефакт: docker/entrypoint.sh
  - Дата / сессия: 2026-10-29 / 004–005

- Критерий / уровень: документация
  - Команда / действие: README / .env.example / AGENTS / STACK
  - Результат: Docker-полный путь описан
  - Артефакт: README.md; .env.example
  - Дата / сессия: 2026-10-29 / 005

- Критерий / уровень: Базовая AGENTS
  - Команда / действие: `npm run lint` ; `npm run build`
  - Результат: lint clean; build success
  - Артефакт: terminal
  - Дата / сессия: 2026-10-29 / 005

- Критерий / уровень: Сквозной путь
  - Команда / действие: compose up → GET `/`
  - Результат: 200
  - Артефакт: Invoke-WebRequest
  - Дата / сессия: 2026-10-29 / 005

## Оценка качества

- Итог: B
- Верификация: сквозной Compose + lint/build; unit/health-check не отмечались
- Архитектура / границы: в рамках STACK Docker Compose; `/prisma-tools` увеличивает образ
- Читаемость для агента: plan/FEATURE/README достаточны
- Стабильность тестов: host lint/build стабильны; compose зависит от свободного :3000
- Ключевые пробелы: нет slim Prisma CLI; нет CI registry
- Запись в ranking: docs/exec-plans/ranking/index.md

## Остаточные риски

- Размер образа из‑за `/prisma-tools`
- Конфликт порта 3000 на хосте

## Источники inprogress

- docs/exec-plans/inprogress/task/2026-10-29-docker-full-stack/2026-10-29-docker-full-stack-plan.md
- docs/exec-plans/inprogress/task/2026-10-29-docker-full-stack/2026-10-29-docker-full-stack-decompose.md
