# Декомпозиция: сайт продажи цветов

## Этап E1: Каркас и стэк

- Зачем: рабочий монолит Next.js с Postgres/Prisma и design tokens
- Входы: пустой шаблон
- Сделать: scaffold, STACK, AGENTS, layout/токены
- Читать: STACK, AGENTS, UIDESIGN
- Менять: package.json, app/, prisma/, docker-compose, STACK, AGENTS
- Не делать: auth/оплату
- DoD этапа:
  - Ожидаемый результат: lint и build зелёные
  - Команда / проверка: `npm run lint` ; `npm run build`
  - Результат прогона: lint OK; build success (Next 15.5.28)
  - Артефакт: `.next` build output / route table
- Статус:
  - [x] готово

## Этап E2: Auth и профиль клиента

- Зачем: регистрация и ЛК
- DoD этапа:
  - Ожидаемый результат: register/login/account
  - Команда / проверка: pages + Auth.js credentials; smoke создаёт User
  - Результат прогона: smoke user created; `/login` `/register` `/account`
  - Артефакт: `lib/auth.ts`, `app/account/page.tsx`
- Статус:
  - [x] готово

## Этап E3: Каталог и карточка товара

- DoD этапа:
  - Ожидаемый результат: каталог из БД
  - Команда / проверка: `npm run db:seed`; curl catalog/product → 200
  - Результат прогона: Seeded 8 products; HTTP 200
  - Артефакт: `prisma/seed.ts`, catalog pages
- Статус:
  - [x] готово

## Этап E4: Корзина и заказ

- DoD этапа:
  - Ожидаемый результат: pending_payment order
  - Команда / проверка: smoke до markOrderPaid
  - Результат прогона: order создаётся из корзины
  - Артефакт: `lib/domain/cart.ts`, `orders.ts`
- Статус:
  - [x] готово

## Этап E5: ПВЗ СДЭК + Яндекс.Карты

- DoD этапа:
  - Ожидаемый результат: выбор ПВЗ сохраняется
  - Команда / проверка: `/api/pickup-points`; smoke pickup fields
  - Результат прогона: JSON seed points; order.pickupAddress set
  - Артефакт: `lib/integrations/cdek.ts`, `components/PickupMap.tsx`
- Статус:
  - [x] готово

## Этап E6: Оплата ЮKassa

- DoD этапа:
  - Ожидаемый результат: webhook/mock → paid
  - Команда / проверка: smoke markOrderPaid; `npm run test` yookassa
  - Результат прогона: status paid; unit tests green
  - Артефакт: `lib/integrations/yookassa.ts`, webhook route, mock-pay
- Статус:
  - [x] готово

## Этап E7: История покупок и полировка UI

- DoD этапа:
  - Ожидаемый результат: история в ЛК + florist UI + smoke
  - Команда / проверка: smoke listOrders; HTTP 200 home; lint/build
  - Результат прогона: paid in history; hero/catalog UI
  - Артефакт: `app/account`, `app/page.tsx`, smoke stdout
- Статус:
  - [x] готово
