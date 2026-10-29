# PROGRESS.md

Handoff между сессиями: проверенное состояние, блокер, следующий шаг, краткий лог.
Не дублируйте контракт фичи ([FEATURE.md](FEATURE.md)), этапы плана (`docs/exec-plans/`) и оценки качества ([ranking](docs/exec-plans/ranking/index.md)).

## Текущее проверенное состояние

- Корень репозитория: Next.js приложение Flora (монолит)
- Стандартный путь старта: `docker compose up --build -d` (см. README / AGENTS); хост-dev опционален
- Стандартный путь верификации: `npm run lint` && `npm run build` && `npm run test`
- Текущая незавершённая фича с наивысшим приоритетом: нет (`docker-full-stack` статус `готово`)
- Текущий блокер: нет
- Remote: origin/main; ветка main; E3 закрыт — SHA после push в логе сессии 005

## Лог сессий

### Сессия 005

- Дата: 2026-10-29
- Цель: E3 — документация и закрытие DoD docker-full-stack
- Сделано:
  - README: канон `docker compose up --build -d`; хост-dev отдельно
  - `.env.example`: host vs compose `db`; `SEED_ON_START`
  - AGENTS / STACK слоты старта
  - FEATURE доказательства DoD; статус `готово`
  - completed + ranking B; inprogress task снят
- Запущенная верификация: `npm run lint` OK; `npm run build` OK; Compose HTTP 200 `/`
- Доставка: commit+push (SHA после push)
- Известный риск: `/prisma-tools` увеличивает образ; :3000 должен быть свободен
- Следующий лучший шаг: по желанию — slim Prisma в образе / боевые ключи интеграций / UI по refs

### Сессия 004

- Дата: 2026-10-29
- Цель: E2 Compose app + entrypoint
- Сделано: app+db; entrypoint; HTTP 200; push `e2b2d15` / `e3882c3`

### Сессия 003

- Дата: 2026-10-29
- Цель: E1 standalone + Dockerfile
- Сделано: standalone; Dockerfile; push `5ba1b83` / `dcc2e42`

### Сессия 002

- Дата: 2026-10-29
- Цель: регистрация docker-full-stack; архив MVP
- Сделано: FEATURE/plan; MVP completed B

### Сессия 001

- Дата: 2026-10-29
- Цель: MVP Flora
- Сделано: полный MVP
