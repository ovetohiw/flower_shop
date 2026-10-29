# template_for_ai

Шаблон процесса AI-разработки: одна активная фича, exec plans, доказательства готовности, оценка закрытой работы.

Карта документов ниже. Команды запуска и проверки — в [AGENTS.md](AGENTS.md), когда заполнены.

## Карта документов

| Путь | Роль |
|------|------|
| [AGENTS.md](AGENTS.md) | Операционка агента: sync на старте, автономный цикл этапа (soft/hard, commit+push по DoD этапа), DoD (схема + жёсткие гейты), слоты verify |
| [PROGRESS.md](PROGRESS.md) | Handoff сессии: блокер, следующий шаг, лог |
| [FEATURE.md](FEATURE.md) | Контракт одной активной фичи + структурированные доказательства DoD |
| [PLANS.md](PLANS.md) | Политика: когда нужен exec plan, где живёт, как закрывать |
| [STACK.md](STACK.md) | Выбранный стэк технологий |
| [docs/exec-plans/](docs/exec-plans/index.md) | Шаблоны планов, старт исполнения, архив completed |
| [docs/exec-plans/ranking/](docs/exec-plans/ranking/index.md) | Оценка A–D каждой закрытой работы |
| [refs/](refs/README.md) | Визуальные референсы UI (пусто допустимо) |
| [docs/convention/](docs/convention/index.md) | Доменные ограничения для AI-агента (хаб + SECURITY, TEST, DEVELOPMENT, UI, …) |

## Старт

1. Для агента — чеклист в [AGENTS.md](AGENTS.md).
2. Для человека — заполните STACK, команды в AGENTS, затем работайте через FEATURE / PLANS.
