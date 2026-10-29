# Декомпозиция: полный запуск через Docker Compose

Этапы не переписывать после старта исполнения. Статусы checkbox обновлять можно. Указатель «текущий» — только в plan.

## Этап E1: Standalone и Dockerfile

- Зачем: собрать образ Next.js, пригодный для запуска без полного monorepo в runner
- Входы: MVP в completed; compose только с `db`; `next.config.ts` без standalone
- Сделать:
  - Включить `output: 'standalone'` в `next.config.ts`
  - Добавить multi-stage `Dockerfile` (deps → build → runner с `node server.js`)
  - Добавить `.dockerignore` (node_modules, .next, .git, env secrets)
  - Убедиться, что хост-сборка `npm run build` проходит
- Читать:
  - next.config.ts
  - package.json
  - prisma/schema.prisma
  - FEATURE.md (скоуп docker-full-stack)
  - docs/exec-plans/inprogress/task/2026-10-29-docker-full-stack/2026-10-29-docker-full-stack-plan.md
- Менять:
  - next.config.ts
  - Dockerfile (новый)
  - .dockerignore (новый)
- Не делать:
  - сервис `app` в compose / entrypoint runtime
  - правки UI / оплата / СДЭК
  - документацию полного compose-пути (E3)
- DoD этапа:
  - Ожидаемый результат: `npm run build` на хосте успешен со standalone; Dockerfile и .dockerignore есть в корне
  - Команда / проверка: `npm run build`
  - Результат прогона: exit 0; Next.js 15.5.28 compiled; route table; `.next/standalone/server.js` существует (во время SSG был warning «Can't reach database» — страницы dynamic, сборка не упала)
  - Артефакт: `Dockerfile`; `.dockerignore`; `next.config.ts` (`output: "standalone"`); `.next/standalone/server.js`
- Статус:
  - [ ] в очереди
  - [ ] в работе
  - [x] готово

## Этап E2: Compose app + entrypoint

- Зачем: один `docker compose up --build` поднимает БД и приложение с применением схемы
- Входы: E1 готово (образ собирается; standalone включён)
- Сделать:
  - Добавить сервис `app` в `docker-compose.yml`: build, ports `3000:3000`, `depends_on` db, env (`DATABASE_URL` на хост `db`, `AUTH_*`, `YOOKASSA_MOCK=1`)
  - Entrypoint: ждать TCP `db:5432` → `prisma db push` → seed (идемпотентно или флаг) → `node server.js`
  - Не монтировать исходники volume’ом для prod-like запуска
- Читать:
  - Dockerfile
  - docker-compose.yml
  - .env.example
  - prisma/seed.ts
  - package.json scripts
- Менять:
  - docker-compose.yml
  - entrypoint-скрипт (новый, путь зафиксировать в plan логе)
  - при необходимости минимальные правки Dockerfile (COPY entrypoint, prisma CLI в runner)
- Не делать:
  - K8s / PaaS / registry
  - переписывание доменной логики
  - финальную полировку README (E3), кроме критичных env для compose
- DoD этапа:
  - Ожидаемый результат: `docker compose up --build -d` поднимает db+app; HTTP 200 на `http://localhost:3000/`
  - Команда / проверка: `docker compose up --build -d` ; curl/Invoke-WebRequest `/`
  - Результат прогона: (заполнить при исполнении)
  - Артефакт: docker-compose.yml; entrypoint; логи контейнера app
- Статус:
  - [ ] в очереди
  - [ ] в работе
  - [ ] готово

## Этап E3: Документация и закрытие DoD фичи

- Зачем: зафиксировать канонический Docker-полный старт и доказательства приёмки
- Входы: E2 готово (compose up зелёный)
- Сделать:
  - Обновить README (быстрый старт через compose app+db)
  - Согласовать `.env.example` (комментарии host vs compose `db`)
  - При смене слотов старта — STACK / AGENTS
  - Заполнить доказательства DoD в FEATURE; критерии приёмки
- Читать:
  - README.md
  - .env.example
  - STACK.md
  - AGENTS.md
  - FEATURE.md
  - PROGRESS.md
- Менять:
  - README.md
  - .env.example
  - STACK.md / AGENTS.md (только если меняется канон старта)
  - FEATURE.md (доказательства DoD)
  - PROGRESS.md (handoff)
- Не делать:
  - новые сервисы / смену архитектуры образа
  - облачный деплой
- DoD этапа:
  - Ожидаемый результат: документация описывает `docker compose up --build`; критерии FEATURE отмечены со схемой доказательств; lint/build хоста зелёные
  - Команда / проверка: `npm run lint` ; `npm run build` ; повторный curl `/` через compose
  - Результат прогона: (заполнить при исполнении)
  - Артефакт: README; FEATURE доказательства; terminal verify
- Статус:
  - [ ] в очереди
  - [ ] в работе
  - [ ] готово
