# AGENTS.md — Инструкция для AI-агентов в проекте Picasso/Neuralsync

> Этот файл читают все AI-агенты при старте работы в проекте: Claude (Code/Cursor/Windsurf), Codex, Kimi (через Devin), Gemini и другие. Не удалять. При изменении архитектуры — обновлять.

---

## 1. ЧТО ЭТО ЗА ПРОЕКТ

**Шаблон сайта для салонов красоты** с встроенным AI-консьержем по имени Коля. Конечная бизнес-модель — продавать готовые сайты салонам через автоматизированную воронку: радар парсит салоны с Google Maps → автогенератор создаёт конфиг под каждый салон → выкатывается персонализированная демо-витрина → владелец салона покупает за 70 000 ₽ или 13 000 ₽/мес подписки.

**Текущая стадия:** разработка первого шаблона на примере салона PICASSO (г. Брянск). Шаблон должен:
- Эмоционально продавать салон клиенткам этого салона
- Демонстрировать владельцу, насколько круче может выглядеть его сайт
- Записывать диалоги Коли с посетительницами в БД для последующей аналитики
- Слать лиды владельцу в Telegram

---

## 2. ТЕХНИЧЕСКИЙ СТЕК

| Слой | Технология | Заметки |
|------|-----------|---------|
| Frontend | React 19 + Vite 8 | Чистый JS, без TypeScript |
| Стили | Tailwind CSS 4 | Через @tailwindcss/vite |
| Анимации | Framer Motion | + Lenis (smooth scroll) |
| Карусели | Embla Carousel | В Gallery |
| Иконки | lucide-react | |
| API/Serverless | Vercel Functions | `api/*.js` |
| БД | Supabase Postgres 17 | Регион eu-west-1, transaction pooler |
| ORM | postgres.js | **НЕ supabase-js!** см. правила ниже |
| Email | nodemailer | (Используется ТОЛЬКО в legacy. К удалению.) |
| LLM | OpenRouter, model gpt-4o-mini | Тестируем разные через playground |
| Хостинг | Vercel | Деплой автоматический из git |

---

## 3. КРИТИЧЕСКИЕ АРХИТЕКТУРНЫЕ ПРАВИЛА

Эти правила нельзя нарушать без согласования с владельцем (Андрей).

### 3.1. Только postgres.js, никогда @supabase/supabase-js
Причина: проект готовится к переезду на Яндекс Postgres перед первой реальной продажей (152-ФЗ — персональные данные клиентов салонов должны храниться в РФ). Любая зависимость от Supabase-обвязки усложнит миграцию. Используем чистый Postgres-драйвер.

### 3.2. ПДн (имя, телефон) НЕ передаются в LLM
Сейчас Коля общается через OpenRouter (зарубежный провайдер). Передавать туда телефоны/имена клиенток — нарушение 152-ФЗ. Поэтому:
- Имя и телефон собираются через **отдельную форму** (BookingContacts), которая шлёт данные напрямую в `api/booking.js`, минуя любой контакт с OpenRouter
- Коля не просит телефон в чате — он рендерит **inline-кнопку** "Оставить заявку"
- В диалогах в БД (`dialogues.messages_json`) ПДн в принципе не должно быть

### 3.3. localStorage для session_id, не cookies
Идентификация анонимного посетителя — UUID, генерируется на клиенте через `crypto.randomUUID()`, хранится в localStorage с TTL 30 дней. Утилита `src/lib/session.js` — единый источник.

Причины: cookies на Vercel требуют race-condition обработки, а localStorage даёт мгновенный ID без roundtrip к серверу.

### 3.4. Один шаблон — много клиентов, через config
`src/config/picasso.config.js` — единственное место, где живут данные конкретного салона: название, цвета, контакты, услуги, мастера, отзывы. Каждый новый клиент = новый файл `config/<slug>.config.js`. **Никакого хардкода данных в секциях.**

### 3.5. Каждая секция в своём файле и обёрнута в SectionBoundary
В `src/sections/<Имя>/<Имя>.jsx`. ErrorBoundary ловит ошибки секции и показывает плейсхолдер вместо чёрного экрана.

### 3.6. Secret_token для Telegram webhook
`api/telegram-webhook.js` обязательно проверяет заголовок `X-Telegram-Bot-Api-Secret-Token` против `process.env.TELEGRAM_WEBHOOK_SECRET`. Без этого любой может вытянуть переписку.

### 3.7. parse_mode: 'HTML' + escapeHtml
В Telegram-сообщениях используем только HTML-режим. Markdown ломается на спецсимволах в именах. Утилита `escapeHtml` в `lib/notifyError.js`.

### 3.8. Дедупликация Telegram updates
`api/telegram-webhook.js` пишет каждый `update_id` в таблицу `telegram_updates` через `INSERT ... ON CONFLICT DO NOTHING`. Если ничего не вставилось — это дубль, тихо отвечаем 200 OK.

### 3.9. Идемпотентность уведомлений о лидах
Поле `leads.telegram_notified_at` — null до отправки, заполняется после. Защита от двойных уведомлений при ретраях.

### 3.10. Tool-call show_lead_button — единственный путь к контактам
Коля никогда не просит телефон в чате. Когда чувствует готовность клиента — вызывает функцию `show_lead_button(service_name?)`. ChatWidget рендерит кнопку «Оставить заявку», по клику открывается форма BookingContacts с предзаполненной услугой через CustomEvent `open-booking-form`.

---

## 4. СТРУКТУРА ПРОЕКТА

```
neuralsync/
├── api/                          # Vercel Functions (бэк)
│   ├── chat.js                   # Прокси к OpenRouter + tools + запись диалогов в БД
│   ├── booking.js                # Приём заявок + Telegram-уведомление с inline-кнопкой
│   └── telegram-webhook.js       # Обработка callback_query (история диалогов)
├── lib/                          # Бэкенд-утилиты
│   ├── db.js                     # Подключение к Postgres через postgres.js
│   ├── notifyError.js            # Отправка ошибок в Telegram + escapeHtml
│   ├── clientResolver.js         # getClientBySlug с in-memory кешем
│   └── dialogue.js               # getOrCreateDialogue, appendMessage
├── src/
│   ├── App.jsx                   # Корень приложения (тонкий)
│   ├── main.jsx                  # Entry point
│   ├── Picasso.jsx               # Layout: Lenis + scrollTo + рендер секций по конфигу
│   ├── index.css                 # Глобальные стили
│   ├── config/
│   │   └── picasso.config.js     # ВСЕ данные клиента: название, цвета, контакты, контент
│   ├── components/               # Переиспользуемые UI-компоненты
│   │   ├── SectionBoundary.jsx
│   │   ├── TiltHeading.jsx
│   │   ├── GoldSpan.jsx
│   │   ├── FadeIn.jsx
│   │   ├── MagneticButton.jsx
│   │   ├── DustParticles.jsx
│   │   ├── FAQItem.jsx
│   │   ├── TiltGlare.jsx
│   │   ├── ServiceCard.jsx
│   │   ├── DirectionCard.jsx
│   │   ├── Lightbox.jsx
│   │   └── MasterModal.jsx
│   ├── sections/                 # Секции страницы (каждая в своей папке)
│   │   ├── Nav/
│   │   ├── Hero/
│   │   ├── Advantages/           # Новая (вынесена из About)
│   │   ├── Promotion/            # Новая (нейтральная акция)
│   │   ├── Services/             # Объединённая Services + Prices
│   │   ├── Gallery/
│   │   ├── Team/
│   │   ├── Reviews/
│   │   ├── About/                # Перенесена ниже Reviews
│   │   ├── FAQ/
│   │   ├── BookingContacts/      # Объединённая Booking + Contacts, слушает open-booking-form
│   │   └── Footer/
│   ├── widgets/
│   │   └── Kolya/
│   │       └── ChatWidget.jsx    # Виджет AI-консьержа, рендерит lead-кнопку при tool-call
│   ├── prompts/
│   │   └── salesSalonPrompt.js   # Системный промпт Коли v2 («устраиваюсь на работу»)
│   └── lib/
│       └── session.js            # getOrCreateSessionId (фронт, localStorage, TTL 30 дней)
├── public/                       # Статика, не трогать
├── .env                          # Локальные секреты (не в git)
├── .env.example                  # Образец списка переменных
├── package.json
├── vite.config.js                # host: 127.0.0.1 — фикс для Windows IPv6 + proxy /api для vercel dev
└── vercel.json
```

---

## 5. ENVIRONMENT VARIABLES

| Имя | Назначение | Где |
|-----|-----------|-----|
| `OPENROUTER_API_KEY` | API-ключ OpenRouter для Коли | .env, Vercel |
| `DATABASE_URL` | Postgres connection string (Supabase pooler:6543, `?pgbouncer=true`) | .env, Vercel |
| `TELEGRAM_BOT_TOKEN` | Токен бота владельца | .env, Vercel |
| `TELEGRAM_CHAT_ID` | ID чата Андрея (legacy fallback, источник правды — БД) | .env, Vercel |
| `TELEGRAM_WEBHOOK_SECRET` | Secret для защиты webhook'а | .env, Vercel |
| `SMTP_USER`, `SMTP_PASS`, `NOTIFY_EMAIL` | Legacy email-канал | .env, к удалению |

---

## 6. СХЕМА БД

В Supabase проекте `qycbkiqrfcrapomvbhuw` (eu-west-1, Postgres 17). RLS отключён на всех таблицах.

### `clients`
`id`, `slug`, `name`, `telegram_chat_id`, `telegram_bot_token_env`, `notes`, `created_at`
- Один клиент = один салон
- Запись Пикассо: `slug='picasso'`, id=`2516ec94-b58c-4782-89af-853d440cdb26`, `telegram_chat_id='5068385066'`

### `dialogues`
`id`, `client_id` (FK→clients), `session_id` (UUID из localStorage), `messages_json` (JSONB массив `{role, content, model?, timestamp}`), `became_lead`, `started_at`, `last_at`
- Уникальный constraint: (client_id, session_id)
- При каждом сообщении: `messages_json || новое + last_at = now()`
- Tool-call сохраняется как content вида `[tool_call:show_lead_button] {"service_name":"..."}`

### `leads`
`id`, `client_id` (FK), `dialogue_id` (FK, NULLABLE — лид без диалога допустим), `name`, `phone`, `service`, `status` ('new'|'contacted'|'converted'|'rejected'), `telegram_notified_at`, `created_at`

### `telegram_updates`
`update_id` (BIGINT PK), `processed_at` — для дедупликации webhook-ов

---

## 7. ЦВЕТОВАЯ ПАЛИТРА (PICASSO)

В `src/config/picasso.config.js → tokens`:
- `GOLD: '#C9A87A'` — основной акцент
- `BG: '#0E0C0B'` — фон страницы (почти чёрный с тёплым подтоном)
- `CHOCOLATE: '#151210'` — фон секций для перебивки
- `TEXT: '#F0EBE3'` — основной текст
- `TEXT_SOFT: '#B5AFA7'` — приглушённый текст

Шрифты: `font-picasso-display` (для заголовков, italic), `font-picasso-body` (uppercase tracking для overlines, обычный для прозы).

---

## 8. ИДЕОЛОГИЯ КОДА — КАК Я (АНДРЕЙ) ЛЮБЛЮ

- **Простота важнее «правильности».** Если что-то можно сделать проще без потери качества — делать проще.
- **Не «улучшать» сверх ТЗ.** Если в задаче не сказано «измени X» — X не трогать. Особенно стили, отступы, анимации существующих секций.
- **Не использовать PowerShell `Set-Content`** при записи файлов. Это ломает кодировки и добавляет BOM. Использовать обычные file-tools.
- **Не оставлять BOM в .jsx/.js файлах.** Vite проглатывает, но другие тулы могут запнуться.
- **Не ставить новые npm-пакеты без явного запроса.** Список зависимостей выверен.
- **Кириллица должна остаться кириллицей.** Никаких "?" вместо "ё".
- **Никаких README/CHANGELOG автоматически.** Я их не использую.
- **Не выкладывать секреты (токены, пароли) в чат.** При запросах с командами, требующими секрет — оставлять плейсхолдеры типа `ТВОЙ_TOKEN`, ничего реального.

---

## 9. ТЕКУЩАЯ ФАЗА

**Phase 3 ЗАКРЫТА (25.04.2026).** MVP функционально готов:
- Диалоги Коли пишутся в БД (Supabase, 30-дневная сессия через localStorage)
- Лиды летят в Telegram владельца с inline-кнопкой «📄 Прочитать диалог»
- Webhook зарегистрирован, кнопка отдаёт историю в человекочитаемом формате (👤 Гость / 🤖 Коля, время МСК, разделители пауз > 30 мин, маркер `👉 показал кнопку «Оставить заявку»` для tool-call)
- Tool-call `show_lead_button` в OpenRouter работает — Коля сам предлагает кнопку, по клику открывается форма BookingContacts со скрытым предзаполнением `service`
- Идемпотентность: `leads.telegram_notified_at`, `telegram_updates.update_id` через ON CONFLICT
- Промпт Коли v2 с концепцией «устраиваюсь на работу», арсеналом инсайтов и лестницей Ханта
- Текущая модель: `openai/gpt-4o-mini` (под вопросом — gpt-4o-mini залипает на длинном промпте, gpt-4.1-mini выглядит лучше по тестам, Gemini 3 Flash Preview — тоже хороший кандидат)

**Открытые мелкие хвосты Phase 3 (не критично, можно полировать):**
- Ужать промпт Коли — ~16 KB сейчас, можно до ~6 KB без потери смысла. Длинный промпт усугубляет залипания на дешёвых моделях.
- Подобрать оптимальную модель — субъективное тестирование Gemini 3 Flash Preview vs gpt-4.1-mini vs Haiku
- Заменить `@kolya_picasso_demo` плейсхолдер в промпте на реальный Telegram владельца перед первой продажей

**Дальше идут:**
- **Phase 4 — полировка (визуальная)** — карта в BookingContacts (Яндекс iframe), фото в Advantages через Nano Banana / ComfyUI, sticky bottom-bar на мобильном (Записаться/Позвонить/WhatsApp), Schema.org JSON-LD, /privacy страница, cookie-consent
- **Phase 5 — дашборд** — веб + Telegram Mini App с аналитикой диалогов (топ-вопросов, тепловая карта активности, воронка диалог→лид)
- **Phase 6 — переезд БД** — Yandex Managed Postgres перед первой продажей (152-ФЗ)
- **Phase 7 — радар + автогенератор** — парсинг салонов с Google Maps, нейросетевой отбор лучших отзывов, автогенерация `<slug>.config.js` для каждого нового салона, выкатывание персонализированных демо-витрин под каждый таргет

---

## 10. ВНЕШНИЕ ИНСТРУМЕНТЫ И ПОДКЛЮЧЕНИЯ

- **Supabase MCP** — подключён в Claude.ai, проект `picasso_bot_chat_dialogi`. Можно делать SQL-миграции, читать данные.
- **Filesystem MCP** — Claude (Desktop) имеет доступ к папкам `D:\2 Clode Proj\1\neuralsync` и `F:\Holman_Obsidian\Holman`.
- **Devin/Windsurf** — основной кодинг-агент Андрея, через app.devin.ai. Модели: GPT-5.3 Codex Medium, Kimi K2.5.
- **Cursor / Claude Code** — резервные среды на случай окончания триала Devin.

---

## 11. ВАЖНЫЕ КОНТАКТЫ И ССЫЛКИ

- Сайт (продакшн): https://picasso-alpha.vercel.app/
- Supabase Dashboard: https://supabase.com/dashboard/project/qycbkiqrfcrapomvbhuw
- Git: локальный репозиторий, push через GitHub Desktop вручную
- Папка проекта: `D:\2 Clode Proj\1\neuralsync`

---

## 12. КАК ПОНЯТЬ, ЧТО Я (АНДРЕЙ) НЕДОВОЛЕН РАБОТОЙ АГЕНТА

- Ты переписал то, что я не просил
- Ты не выверил кодировку и в файле появились битые символы
- Ты «улучшил» код без согласования
- Ты решил поставить новый пакет
- Ты использовал supabase-js или nodemailer для новых задач
- Ты создал README/CHANGELOG/документацию по своей инициативе
- Ты записал файл через PowerShell и в нём появился BOM
- Ты выложил секреты или токены в логи/чат

Если делаешь что-то из этого списка — **остановись и спроси сначала**.
