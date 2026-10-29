# План: полный запуск через Docker Compose

## Мета

- ID: docker-full-stack
- Тип: task
- Название: Полный запуск приложения через Docker Compose
- Дата: 2026-10-29
- FEATURE: FEATURE.md
- Путь папки: docs/exec-plans/inprogress/task/2026-10-29-docker-full-stack/

## Цель

Одной командой `docker compose up --build` поднять Next.js (standalone) и Postgres: сайт отвечает, схема и seed применяются в контейнере app.

## Скоуп

В скоупе:

- `output: 'standalone'` в next.config
- Multi-stage Dockerfile + `.dockerignore`
- Сервис `app` в Compose, entrypoint (wait DB → db push → seed → server)
- Документация и согласование `.env.example` / STACK / AGENTS при смене старта

Вне скоупа:

- Kubernetes, облачный PaaS, CI registry push
- Реальные ключи интеграций
- Доменная логика магазина / UI

## Карта контекста

Заполняется в фазе планирования. Обновлять только осознанным решением.

- Ключевые файлы и границы модулей:
  - [next.config.ts](../../../../next.config.ts) — `output: 'standalone'`
  - `Dockerfile`, `.dockerignore` (новые) — образ app
  - [docker-compose.yml](../../../../docker-compose.yml) — сервисы `db` + `app`
  - entrypoint-скрипт (новый, рядом с Docker) — wait / prisma / seed / start
  - [.env.example](../../../../.env.example) — `DATABASE_URL` для хоста `db` в compose-сети
  - [README.md](../../../../README.md), [STACK.md](../../../../STACK.md), [AGENTS.md](../../../../AGENTS.md) — путь старта
- Контракты поведения (ссылка на FEATURE, не копия ТЗ): FEATURE.md → `docker-full-stack`
- Принятые решения по реализации:
  - Multi-stage: deps → build → runner; старт `node server.js` из standalone
  - Схема: `prisma db push` (нет `prisma/migrations`)
  - Seed идемпотентный или флаг env; mock-интеграции по умолчанию
  - Код приложения не монтируется volume’ом в prod-like Compose
- Ограничения стэка / конвенций, влияющие на этапы:
  - STACK: Docker + Docker Compose уже отмечены
  - Секреты только env ([docs/convention/SECURITY.md](../../../convention/SECURITY.md))

## Текущий шаг

Один этап. Id из decompose.

- Этап id: E2
- Статус: в очереди

## Путь верификации

Сквозные проверки (команды из AGENTS.md, когда заполнены):

- Хост: `npm run lint` ; `npm run build` ; `npm run test`
- Compose (после E2+): `docker compose up --build -d` → curl HTTP 200 `/`

## Риски и блокеры

- Первый cold start: ожидание готовности Postgres до prisma
- Разный `DATABASE_URL` для хост-dev (`localhost`) и compose (`db`)
- Размер образа / копирование Prisma engines в standalone runner

## Лог прогресса

- Сессия 003 (2026-10-29):
  - Этап id: E1
  - Сделано: `output: "standalone"`; multi-stage Dockerfile; `.dockerignore`; `npm run build` зелёный; handoff на E2
  - Осталось: E2 (compose app + entrypoint) → E3

- Сессия (планирование 2026-10-29):
  - Этап id: —
  - Сделано: MVP в completed/ranking; FEATURE и plan/decompose созданы; текущий шаг E1
  - Осталось: исполнение E1 → E2 → E3

## Открытые решения

- Seed на каждый старт vs `SEED_ON_START=1` — soft: выбрать идемпотентный seed или флаг на E2
