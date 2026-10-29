# PROGRESS.md

Handoff между сессиями: проверенное состояние, блокер, следующий шаг, краткий лог.
Не дублируйте контракт фичи ([FEATURE.md](FEATURE.md)), этапы плана (`docs/exec-plans/`) и оценки качества ([ranking](docs/exec-plans/ranking/index.md)).

## Текущее проверенное состояние

- Корень репозитория: Next.js приложение Flora (монолит)
- Стандартный путь старта: по AGENTS.md (sync remote → PROGRESS → FEATURE → exec plan при наличии → автономный цикл; commit+push по DoD этапа); доменные ограничения агента — [docs/convention/index.md](docs/convention/index.md)
- Стандартный путь верификации: `npm run lint` && `npm run build` && `npm run test`; поднять: docker compose + db:push/seed + `npm run dev` (полный Compose app — этап E2)
- Текущая незавершённая фича с наивысшим приоритетом: docker-full-stack
- Текущий блокер: нет
- Remote: origin/main; ветка main; push выполнен (`5ba1b83`)

## Лог сессий

### Сессия 003

- Дата: 2026-10-29
- Цель: исполнить E1 docker-full-stack (standalone + Dockerfile)
- Сделано:
  - `next.config.ts`: `output: "standalone"`
  - Multi-stage `Dockerfile` (deps → build → runner, `node server.js`)
  - `.dockerignore`
  - DoD: `npm run build` OK; `.next/standalone/server.js` на месте
  - Заодно в коммите: архив MVP + регистрация task (сессия 002 без push)
- Запущенная верификация: `npm run build` — success (Next 15.5.28); standalone `server.js` exists
- Доставка: commit+push `5ba1b83` на origin/main
- Известный риск: при SSG без живой БД Prisma warning на findMany; маршруты dynamic, build не падает. Compose app ещё нет (E2)
- Следующий лучший шаг: исполнить **E2** — сервис `app` в Compose + entrypoint (wait DB → db push → seed → start)

### Сессия 002

- Дата: 2026-10-29
- Цель: зарегистрировать задачу полного Docker-развёртывания; закрыть MVP в архиве
- Сделано: completed/ranking MVP; FEATURE `docker-full-stack`; plan E1–E3
- Следующий лучший шаг: E1 — выполнен в сессии 003

### Сессия 001

- Дата: 2026-10-29
- Цель: MVP сайта продажи цветов (E1–E7)
- Сделано: полный MVP
- Следующий лучший шаг: архив / Docker — см. 002–003
