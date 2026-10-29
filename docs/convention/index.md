# Конвенции (для агента)

Обязательные **доменные ограничения AI-агента**. Не адресованы человеку: контракт фичи — [FEATURE.md](../../FEATURE.md), стэк — [STACK.md](../../STACK.md), референсы UI — [refs/](../../refs/).
Процесс сессии (sync, soft/hard, DoD, commit+push) — только [AGENTS.md](../../AGENTS.md). Здесь его не дублируй.
Каждая тема — **один** канон; соседний файл только ссылайся, не пересказывай.

## Файлы

| Файл | Читай, когда задача затрагивает |
|------|----------------------------------|
| [SECURITY.md](./SECURITY.md) | Секреты, authz, недоверие клиенту, ответы наружу |
| [TEST.md](./TEST.md) | Тесты, моки, изоляция, прогон |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | Diff, имена, одна задача, стек-гейт кода |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Слои, границы модулей, Монолит / Микросервис |
| [LOGGING.md](./LOGGING.md) | Логи, уровни, print, маскирование |
| [NETWORK.md](./NETWORK.md) | TLS, таймауты, ретраи, API |
| [DB.md](./DB.md) | Схема, миграции, SQL, транзакции |
| [UIDESIGN.md](./UIDESIGN.md) | UI-композиция, визуал, a11y |

## Матрица канонов

| Тема | Канон |
|------|-------|
| Sync / soft-hard / DoD / commit+push | [AGENTS.md](../../AGENTS.md) |
| Секреты, authz, недоверие клиенту | [SECURITY.md](./SECURITY.md) |
| Параметризованный SQL, миграции | [DB.md](./DB.md) |
| TLS / таймауты / ретраи | [NETWORK.md](./NETWORK.md) |
| Уровни логов, print, маскирование | [LOGGING.md](./LOGGING.md) |
| Слои, Mono/Micro | [ARCHITECTURE.md](./ARCHITECTURE.md) + STACK «Архитектура» |
| Как тестировать | [TEST.md](./TEST.md); доказательства — AGENTS / FEATURE |
| Diff, имена, одна задача, стек-гейт кода | [DEVELOPMENT.md](./DEVELOPMENT.md) |
| UI-композиция / a11y | [UIDESIGN.md](./UIDESIGN.md); референсы — [refs/](../../refs/) |

## Порядок чтения

1. Процесс всегда: [AGENTS.md](../../AGENTS.md).
2. UI: [refs/](../../refs/) → [UIDESIGN.md](./UIDESIGN.md) → при необходимости ARCHITECTURE / SECURITY → STACK.
3. Иначе: [DEVELOPMENT.md](./DEVELOPMENT.md) + домены по матрице выше.
4. Не дублируй канон соседа — ссылайся.

## Связи вне папки

- [AGENTS.md](../../AGENTS.md) — операционка
- [FEATURE.md](../../FEATURE.md) — контракт и DoD
- [STACK.md](../../STACK.md) — технологии
- [refs/README.md](../../refs/README.md) — визуальные референсы
- [PLANS.md](../../PLANS.md) — exec plan
