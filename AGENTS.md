# AGENTS.md — Инструкция для AI-агентов в проекте Picasso/Neuralsync

> Этот файл читают все AI-агенты при старте работы в проекте: Claude (Code/Cursor/Windsurf/Desktop), Codex, Kimi (через Devin), Gemini и другие. Не удалять. При изменении архитектуры — обновлять.
>
> **Если в этом файле что-то противоречит конкретному промпту от Андрея — приоритет у промпта**, но об этом расхождении нужно сообщить ему в ответе.

---

## 1. ЧТО ЭТО ЗА ПРОЕКТ

**SaaS для автогенерации сайтов салонам красоты** с встроенным AI-консьержем по имени Коля. Бизнес-модель — продавать готовые сайты салонам через автоматизированную воронку: радар парсит салоны с Google Maps → автогенератор создаёт конфиг под каждый салон → выкатывается персонализированная демо-витрина → владелец салона покупает за 70 000 ₽ или 13 000 ₽/мес подписки.

Проект состоит из двух репозиториев:
- **`neuralsync`** (этот репо, `D:\2 Clode Proj\1\neuralsync`) — фронтенд-шаблоны и серверные API. Это то, с чем работают агенты-кодеры.
- **`PARSER`** (`D:\1 KURSOR_PROJ\11 PARSER`) — Python-бэкенд парсера/радара/ассемблера, отдельный репо. На него ссылаются папки-плейсхолдеры `radar/` и `assembler/`.

**Текущая стадия:** разработка первого шаблона `beauty-master` на примере салона PICASSO (г. Брянск) и тестового демо «Калинка-Малинка». Шаблон должен:
- Эмоционально продавать салон клиенткам этого салона
- Демонстрировать владельцу, насколько круче может выглядеть его сайт
- Записывать диалоги Коли с посетительницами в БД для последующей аналитики
- Слать лиды владельцу в Telegram

---

## 2. ТЕХНИЧЕСКИЙ СТЕК

| Слой | Технология | Заметки |
|------|-----------|---------|
| Frontend | React 19 + Vite 8 | Чистый JS, без TypeScript |
| Стили | Tailwind CSS 4 | Через `@tailwindcss/vite`, токены темы в `src/index.css` |
| Анимации | Framer Motion | + Lenis (smooth scroll) |
| Карусели | Embla Carousel | В Gallery, ServiceCarousel, Reels |
| Иконки | lucide-react | |
| Роутинг | react-router-dom v7 | `/` → демо, `/:slug` → клиент |
| API/Serverless | Vercel Functions | `api/*.js` |
| БД | Supabase Postgres 17 | Регион eu-west-1, transaction pooler |
| ORM | postgres.js | **НЕ supabase-js!** см. правило 3.1 |
| Email | nodemailer | (Только в legacy. К удалению.) |
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
- Коля не просит телефон в чате — он рендерит **inline-кнопку** «Оставить заявку»
- В диалогах в БД (`dialogues.messages_json`) ПДн в принципе не должно быть

### 3.3. localStorage для session_id, не cookies
Идентификация анонимного посетителя — UUID, генерируется на клиенте через `crypto.randomUUID()`, хранится в localStorage с TTL 30 дней. Утилита `src/shared/lib/session.js` — единый источник.

Причины: cookies на Vercel требуют race-condition обработки, а localStorage даёт мгновенный ID без roundtrip к серверу.

### 3.4. Изолированные шаблоны, изолированные клиенты
Архитектура мульти-шаблонная и мульти-клиентская. Два уровня изоляции:

**Шаблоны** (`src/templates/<template-slug>/`) — каждый шаблон это самодостаточный визуальный язык со своими секциями, своими template-specific компонентами и анимациями, своим набором цветовых токенов и шрифтов. Шаблоны **не знают друг о друге**. Сейчас активный шаблон один — `beauty-master`. Будущий, например `modern-minimal`, — отдельная папка с нуля, без расшаривания секций.

**Клиенты** — данные конкретного салона лежат в `data/clients/<slug>.json` (формат описан в `assembler/schema.client.json`), ассеты — в `public/clients/<slug>/`. Никакого хардкода клиентских данных в шаблонах. Дефолт-демо — `src/configs/_default.config.js`.

### 3.5. Что shared, что template-specific
В `src/shared/` живёт **только то, что не привязано к визуальному языку конкретного шаблона**: ErrorBoundary, страница 404, ConfigContext, резолвер клиентских JSON, генерация session_id, утилиты порядка секций и скролла к якорю. Никаких компонентов с цветами, тенями, easing-кривыми и шрифтовыми токенами в shared нет — такие компоненты живут внутри шаблона, даже если визуально похожи между шаблонами.

Антипаттерн: вынести FadeIn в shared «потому что анимация-то одинаковая». Кривая и длительность — часть визуального языка. У второго шаблона своя FadeIn под свой ритм.

### 3.6. Каждая секция в своём файле и обёрнута в SectionBoundary
В `src/templates/<template>/sections/<Имя>/<Имя>.jsx`. ErrorBoundary `SectionBoundary` (общий, лежит в `src/shared/components/`) ловит ошибки секции и показывает плейсхолдер вместо чёрного экрана.

### 3.7. Secret_token для Telegram webhook
`api/telegram-webhook.js` обязательно проверяет заголовок `X-Telegram-Bot-Api-Secret-Token` против `process.env.TELEGRAM_WEBHOOK_SECRET`. Без этого любой может вытянуть переписку.

### 3.8. parse_mode: 'HTML' + escapeHtml
В Telegram-сообщениях используем только HTML-режим. Markdown ломается на спецсимволах в именах. Утилита `escapeHtml` в `lib/notifyError.js` (бэкенд `lib/`, не `src/`).

### 3.9. Дедупликация Telegram updates
`api/telegram-webhook.js` пишет каждый `update_id` в таблицу `telegram_updates` через `INSERT ... ON CONFLICT DO NOTHING`. Если ничего не вставилось — это дубль, тихо отвечаем 200 OK.

### 3.10. Идемпотентность уведомлений о лидах
Поле `leads.telegram_notified_at` — null до отправки, заполняется после. Защита от двойных уведомлений при ретраях.

### 3.11. Tool-call `show_lead_button` — единственный путь к контактам
Коля никогда не просит телефон в чате. Когда чувствует готовность клиента — вызывает функцию `show_lead_button(service_name?)`. ChatWidget рендерит кнопку «Оставить заявку», по клику открывается форма BookingContacts с предзаполненной услугой через CustomEvent `open-booking-form`.

### 3.12. Codex не двигает файлы за рамки явной инструкции
Прошлый инцидент: Codex самовольно перенёс 8 компонентов между папками во время Фазы 1 рефакторинга. Windows заблокировал из-за пробелов в пути — пронесло. На будущее: в каждом промпте по перемещению файлов явно перечисляются пути, остальные не трогать. Для путей с пробелами (`D:\2 Clode Proj\1\neuralsync`) PowerShell `Move-Item` ломается — использовать `git mv` или Node-инструменты.

---

## 4. СТРУКТУРА ПРОЕКТА

```
neuralsync/
├── api/                          # Vercel Functions (бэк)
│   ├── chat.js                   # Прокси к OpenRouter + tools + запись диалогов в БД
│   ├── booking.js                # Приём заявок + Telegram-уведомление с inline-кнопкой
│   └── telegram-webhook.js       # Обработка callback_query (история диалогов)
├── lib/                          # Бэкенд-утилиты (НЕ путать с src/shared/lib/)
│   ├── db.js                     # Подключение к Postgres через postgres.js
│   ├── notifyError.js            # Отправка ошибок в Telegram + escapeHtml
│   ├── clientResolver.js         # getClientBySlug с in-memory кешем (бэк, по slug → запись из clients)
│   └── dialogue.js               # getOrCreateDialogue, appendMessage
├── radar/                        # Placeholder для парсера. Реальный парсер в D:\1 KURSOR_PROJ\11 PARSER
│   └── README.md
├── assembler/                    # Контракт между парсером и фронтом
│   ├── schema.client.json        # JSON Schema клиентского конфига
│   └── README.md
├── data/
│   └── clients/                  # Клиентские конфиги, формат по schema.client.json
│       └── .gitkeep              # пустая, заполняется парсером (по одному <slug>.json на салон)
├── docs/                         # Архив отчётов рефакторинга, audit, agent-log
├── plans/
├── public/
│   ├── templates/
│   │   └── beauty-master/        # Демо-ассеты шаблона (hero/, gallery/, services/, about/, team/)
│   └── clients/
│       └── .gitkeep              # Сюда парсер кладёт public/clients/<slug>/ с фотками
├── src/
│   ├── App.jsx                   # Корень: Routes / → BeautyTemplate, /:slug → ClientSiteRoute
│   ├── main.jsx                  # Entry point
│   ├── index.css                 # Глобальные стили + Tailwind тема (@theme)
│   │
│   ├── shared/                   # Переиспользуемое между шаблонами (см. правило 3.5)
│   │   ├── components/
│   │   │   ├── SectionBoundary.jsx   # ErrorBoundary для секций
│   │   │   └── NotFound.jsx          # Страница 404 (нейтральная, без брендинга)
│   │   ├── contexts/
│   │   │   └── ConfigContext.js      # Контекст с конфигом текущего салона
│   │   ├── lib/
│   │   │   ├── clientConfigResolver.js  # getClientConfig(slug) — читает data/clients/*.json
│   │   │   └── session.js               # getOrCreateSessionId — UUID, localStorage, TTL 30д
│   │   └── utils/
│   │       ├── getSectionOrder.js       # Источник правды для порядка секций (config.sectionsOrder)
│   │       ├── getAvailableSections.js  # Метаданные секций для Nav (label, anchorId, inNav)
│   │       └── scrollToBooking.js       # scroll → #bookingContacts-section
│   │
│   ├── configs/
│   │   └── _default.config.js    # Дефолтный конфиг для главной/демо. ВСЕ данные демо-салона.
│   │
│   ├── prompts/
│   │   └── salesSalonPrompt.js   # Системный промпт Коли v2 («устраиваюсь на работу»)
│   │
│   └── templates/
│       └── beauty-master/        # Активный шаблон — салон-премиум, тёмная палитра + золото
│           ├── BeautyTemplate.jsx    # Layout: Lenis + scrollTo + рендер секций по конфигу
│           ├── components/           # Template-specific компоненты (визуальный язык beauty-master)
│           │   ├── DirectionCard.jsx
│           │   ├── DustParticles.jsx
│           │   ├── FadeIn.jsx        # анимация на токенах шаблона (EASE из конфига)
│           │   ├── FAQItem.jsx
│           │   ├── GoldSpan.jsx      # золотой акцент на токенах шаблона
│           │   ├── Lightbox.jsx      # лайтбокс на токенах шаблона
│           │   ├── MagneticButton.jsx
│           │   ├── MasterModal.jsx
│           │   ├── ServiceCard.jsx
│           │   ├── StickyBar.jsx
│           │   ├── TiltGlare.jsx
│           │   └── TiltHeading.jsx   # 3D-tilt заголовок
│           ├── sections/             # 16 секций beauty-master, каждая в своей папке
│           │   ├── Nav/Nav.jsx
│           │   ├── Hero/Hero.jsx
│           │   ├── Advantages/Advantages.jsx
│           │   ├── Promotion/Promotion.jsx
│           │   ├── About/About.jsx
│           │   ├── Services/Services.jsx
│           │   ├── ServiceCarousel/ServiceCarousel.jsx  # карусель услуг (3D-эффект)
│           │   ├── ServiceGrid/ServiceGrid.jsx          # альтернатива карусели — сетка 4×N
│           │   ├── Gallery/Gallery.jsx
│           │   ├── BeforeAfter/BeforeAfter.jsx
│           │   ├── Team/Team.jsx
│           │   ├── Reels/Reels.jsx
│           │   ├── Reviews/Reviews.jsx
│           │   ├── FAQ/FAQ.jsx
│           │   ├── BookingContacts/BookingContacts.jsx  # форма + контакты + Yandex карта
│           │   └── Footer/Footer.jsx
│           └── widgets/
│               └── Kolya/
│                   └── ChatWidget.jsx  # Виджет AI-консьержа, рендерит lead-кнопку при tool-call
│
├── public/                       # Статика, не трогать
├── .env                          # Локальные секреты (не в git)
├── .env.example                  # Образец списка переменных
├── package.json
├── vite.config.js                # host: 127.0.0.1 — фикс Windows IPv6 + proxy /api для vercel dev
└── vercel.json
```

**Канонический порядок секций beauty-master** (зафиксирован в `_default.config.js → sectionsOrder`):
```
Hero → Promotion → Advantages → ServiceCarousel → Services →
Gallery → BeforeAfter → Team → Reels → Reviews → About →
FAQ → BookingContacts → Footer
```

`ServiceGrid` — альтернативная вёрстка для блока «услуги», взаимозаменяема с `ServiceCarousel`. Какую из двух подключать — решается на уровне sectionsOrder. По умолчанию активна `ServiceCarousel`.

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
- Запись Пикассо: `slug='picasso'`, `id='2516ec94-b58c-4782-89af-853d440cdb26'`, `telegram_chat_id='5068385066'`

### `dialogues`
`id`, `client_id` (FK→clients), `session_id` (UUID из localStorage), `messages_json` (JSONB массив `{role, content, model?, timestamp}`), `became_lead`, `started_at`, `last_at`
- Уникальный constraint: `(client_id, session_id)`
- При каждом сообщении: `messages_json || новое + last_at = now()`
- Tool-call сохраняется как content вида `[tool_call:show_lead_button] {"service_name":"..."}`

### `leads`
`id`, `client_id` (FK), `dialogue_id` (FK, NULLABLE — лид без диалога допустим), `name`, `phone`, `service`, `status` ('new'|'contacted'|'converted'|'rejected'), `telegram_notified_at`, `created_at`

### `telegram_updates`
`update_id` (BIGINT PK), `processed_at` — для дедупликации webhook-ов

---

## 7. ВИЗУАЛЬНЫЙ ЯЗЫК beauty-master

В `src/configs/_default.config.js → tokens`:
- `GOLD: '#C9A87A'` — основной акцент
- `BG: '#0E0C0B'` — фон страницы (почти чёрный с тёплым подтоном)
- `CHOCOLATE: '#151210'` — фон секций для перебивки
- `TEXT: '#F0EBE3'` — основной текст
- `TEXT_SOFT: '#B5AFA7'` — приглушённый текст
- `EASE` — кубическая кривая для анимаций (часть визуального языка, не общая утилита)

В `src/index.css → @theme` дублируются как CSS-переменные `--color-wow-*`, `--font-wow-display`, `--font-wow-body`. Шрифты: `font-wow-display` (Playfair Display, italic для GoldSpan, обычный для заголовков), `font-wow-body` (Inter, uppercase tracking для overlines).

> Префиксы CSS-токенов исторически `--color-wow-*` — это сохраняется как есть, не переименовывать.

Для **будущих** шаблонов токены будут жить в их собственных конфигах и иметь свои названия — между шаблонами токены не шарятся.

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
- **Claude (Desktop/Code) НЕ пишет код напрямую** — только архитектура, аудит, промпты для Codex, оценка рисков. Код пишут Codex/Devin. Исключения — мелкие правки служебных файлов (AGENTS.md, заметки) по явному запросу Андрея.

---

## 9. ТЕКУЩАЯ ФАЗА

**Phase 3 ЗАКРЫТА (25.04.2026).** MVP функционально готов:
- Диалоги Коли пишутся в БД (Supabase, 30-дневная сессия через localStorage)
- Лиды летят в Telegram владельца с inline-кнопкой «📄 Прочитать диалог»
- Webhook зарегистрирован, кнопка отдаёт историю в человекочитаемом формате
- Tool-call `show_lead_button` в OpenRouter работает
- Идемпотентность лидов и Telegram updates через ON CONFLICT
- Промпт Коли v2 с концепцией «устраиваюсь на работу»

**Архитектурный рефакторинг (30.04–01.05.2026):**
- Завершены Фазы 0–8 + Brand System: единый шаблон `beauty-master`, нейтральный `_default.config.js`, конфигурируемый бренд через `meta.brand.text`. Теги `v8-refactor-complete`, `v8.1-brand-system`.
- Завершён shared-layer рефакторинг: создана папка `src/shared/`, FadeIn/GoldSpan/Lightbox/TiltHeading и ServiceGrid перенесены внутрь шаблона, NotFound зачищен от хардкода «Picasso Demo». Тег `v9-shared-layer` (ставится Андреем после проверки билда).

**Параллельно:** бэкенд парсера (репо `PARSER`) переведён с локальной Gemma 4 на Google Gemini через Vertex AI (модель `gemini-2.5-flash-lite`, проект `leadparser-491719`, регион `us-central1`, авторизация через ADC). Тестовый прогон на lead_id=58 — все 6 контентных блоков сгенерированы без fallback. В `config_builder.py` добавлены хелперы `_hero_brand_name()`, `_hero_line1()`, `_hero_line1_small()` и `download_hero_photo()`.

**Открытые мелкие хвосты Phase 3:**
- Ужать промпт Коли (~16 KB → ~6 KB) — длинный промпт усугубляет залипания дешёвых моделей.
- Подобрать оптимальную модель — Gemini 3 Flash Preview vs gpt-4.1-mini vs Haiku.
- Заменить `@kolya_picasso_demo` плейсхолдер на реальный Telegram владельца перед первой продажей.

**Top of mind (демо «Калинка-Малинка», `D:\2 Clode Proj\1\neuralsync`):**
- Hero: восстановить `titleLine2Size: 'small'` (в конце последней сессии было ошибочно изменено на `'medium'`).
- Интеллектуальная сортировка фото через Gemini Vision (вертикальная ориентация, наличие людей, отсутствие сторонних логотипов).
- Очистка ServiceCarousel от мусора (телефоны, технические инструкции).
- Заполнение пустых блоков страницы.

**Дальше идут:**
- **Phase 4 — полировка (визуальная)** — карта в BookingContacts (Яндекс iframe), фото в Advantages через Nano Banana / ComfyUI, sticky bottom-bar на мобильном, Schema.org JSON-LD, /privacy страница, cookie-consent
- **Phase 5 — дашборд** — веб + Telegram Mini App с аналитикой диалогов
- **Phase 6 — переезд БД** — Yandex Managed Postgres перед первой продажей (152-ФЗ)
- **Phase 7 — радар + автогенератор** — парсинг с Google Maps, нейросетевой отбор отзывов, автогенерация `data/clients/<slug>.json`, выкатка демо-витрин под каждый таргет

---

## 10. ВНЕШНИЕ ИНСТРУМЕНТЫ И ПОДКЛЮЧЕНИЯ

- **Supabase MCP** — подключён в Claude.ai, проект `picasso_bot_chat_dialogi`. Можно делать SQL-миграции, читать данные.
- **Filesystem MCP** — Claude (Desktop) имеет доступ к папкам `D:\2 Clode Proj\1\neuralsync`, `F:\Holman_Obsidian\Holman` и `D:\1 KURSOR_PROJ\11 PARSER`.
- **Devin/Windsurf** — основной кодинг-агент Андрея, через app.devin.ai. Модели: GPT-5.3 Codex Medium, Kimi K2.5.
- **Cursor / Claude Code** — резервные среды на случай окончания триала Devin.
- **Obsidian** (`F:\Holman_Obsidian\Holman`) — проектная база знаний. Заметки по сессиям и архитектуре в `01_Проекты/Пикассо-NeuralSync/`.

---

## 11. ВАЖНЫЕ КОНТАКТЫ И ССЫЛКИ

- Сайт (продакшн): https://picasso-alpha.vercel.app/
- Supabase Dashboard: https://supabase.com/dashboard/project/qycbkiqrfcrapomvbhuw
- Git: локальный репозиторий, push через GitHub Desktop вручную
- Папка проекта (фронт): `D:\2 Clode Proj\1\neuralsync`
- Папка проекта (парсер): `D:\1 KURSOR_PROJ\11 PARSER`
- Obsidian: `F:\Holman_Obsidian\Holman`

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
- Ты вынес template-specific код в `src/shared/` (см. правило 3.5)
- Ты импортировал что-то из одного шаблона в другой (правило 3.4)

Если делаешь что-то из этого списка — **остановись и спроси сначала**.
