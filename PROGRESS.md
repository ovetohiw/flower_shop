# PROGRESS.md

Handoff между сессиями: проверенное состояние, блокер, следующий шаг, краткий лог.
Не дублируйте контракт фичи ([FEATURE.md](FEATURE.md)), этапы плана (`docs/exec-plans/`) и оценки качества ([ranking](docs/exec-plans/ranking/index.md)).

## Текущее проверенное состояние

- Корень репозитория: Next.js приложение Flora (монолит)
- Стандартный путь старта: по AGENTS.md; полный стек — `docker compose up --build` (app+db); хост-dev по-прежнему возможен
- Стандартный путь верификации: `npm run lint` && `npm run build` && `npm run test`; Compose: HTTP 200 `/`
- Текущая незавершённая фича с наивысшим приоритетом: docker-full-stack (E2 готово → E3)
- Текущий блокер: нет
- Remote: origin/main; ветка main; push E2 — см. лог сессии 004

## Лог сессий

### Сессия 004

- Дата: 2026-10-29
- Цель: исполнить E2 — Compose app + entrypoint
- Сделано:
  - `docker-compose.yml`: `app` + `db` healthcheck
  - `docker/entrypoint.sh`: wait DB → prisma db push → seed → `node server.js`
  - Dockerfile: `/prisma-tools` (полный node_modules для CLI), esbuild `seed.cjs`, `public/.gitkeep`
  - Soft: `SEED_ON_START=1` по умолчанию (upsert идемпотентен)
- Запущенная верификация: `docker compose up --build -d` → HTTP 200 `/`; логи: Seeded 8 products, Next Ready
- Доставка: commit+push (SHA в этом блоке после push)
- Известный риск: образ больше из‑за `/prisma-tools`; порт 3000 на хосте должен быть свободен
- Следующий лучший шаг: исполнить **E3** — README/`.env.example`/доказательства DoD в FEATURE

### Сессия 003

- Дата: 2026-10-29
- Цель: E1 standalone + Dockerfile
- Сделано: standalone, Dockerfile, .dockerignore; build OK; push `5ba1b83` / handoff `dcc2e42`
- Следующий лучший шаг: E2 — выполнен в 004

### Сессия 002

- Дата: 2026-10-29
- Цель: зарегистрировать docker-full-stack; архив MVP
- Сделано: completed/ranking; FEATURE; plan E1–E3

### Сессия 001

- Дата: 2026-10-29
- Цель: MVP Flora
- Сделано: полный MVP
