# Neuralsync - Техническая документация

## Обзор проекта

**Neuralsync** — шаблон сайта для салонов красоты с встроенным AI-консьержем (Коля). Проект представляет собой многостраничный SPA (Single Page Application) на React, который может быть развернут для разных клиентов с индивидуальной конфигурацией.

### Бизнес-модель
- Автоматизированная воронка продаж: парсинг салонов с Google Maps → автогенерация конфигурации → деплой персонализированной демо-витрины → продажа владельцу (70 000 ₽ или 13 000 ₽/мес)
- Каждый клиент = отдельная конфигурация в системе
- Сбор диалогов с AI-консьержем для аналитики
- Отправка лидов владельцу в Telegram

---

## Технологический стек

| Слой | Технология | Версия | Назначение |
|------|-----------|--------|-----------|
| Frontend | React | 19 | UI framework |
| Frontend | Vite | 8 | Build tool & dev server |
| Frontend | Tailwind CSS | 4 | Стилизация через @tailwindcss/vite |
| Frontend | Framer Motion | - | Анимации |
| Frontend | Lenis | - | Smooth scroll |
| Frontend | Embla Carousel | - | Карусель в Gallery |
| Frontend | lucide-react | - | Иконки |
| Backend | Vercel Functions | - | Serverless API (api/*.js) |
| Database | Supabase Postgres | 17 | Хранилище данных (region: eu-west-1) |
| ORM | postgres.js | - | Драйвер Postgres (НЕ supabase-js!) |
| Email | nodemailer | - | Legacy email канал (к удалению) |
| LLM | OpenRouter | gpt-4o-mini | AI-консьерж Коля |
| Hosting | Vercel | - | Деплой и CI/CD |

---

## Структура проекта

```
neuralsync/
├── api/                          # Vercel Functions (backend)
│   ├── chat.js                   # Прокси к OpenRouter + tools + запись диалогов в БД
│   ├── booking.js                # Приём заявок + Telegram-уведомление
│   └── telegram-webhook.js       # Обработка callback_query от Telegram
│
├── lib/                          # Backend utilities
│   ├── db.js                     # Singleton connection к Postgres (postgres.js)
│   ├── notifyError.js            # Отправка ошибок в Telegram с HTML escaping
│   ├── clientResolver.js         # getClientBySlug с in-memory кешем
│   └── dialogue.js               # getOrCreateDialogue, appendMessage
│
├── src/
│   ├── App.jsx                   # Корень приложения (тонкий)
│   ├── main.jsx                  # Entry point
│   ├── index.css                 # Глобальные стили
│   │
│   ├── configs/                  # Конфигурации клиентов
│   │   └── _default.config.js    # Дефолтная конфигурация
│   │
│   ├── components/               # Переиспользуемые UI-компоненты
│   │   ├── SectionBoundary.jsx   # Error boundary для секций
│   │   ├── TiltHeading.jsx       # Анимированный заголовок
│   │   ├── GoldSpan.jsx          # Золотой span
│   │   ├── FadeIn.jsx            # Fade-in анимация
│   │   ├── MagneticButton.jsx    # Магнитная кнопка
│   │   ├── DustParticles.jsx     # Частицы пыли
│   │   ├── FAQItem.jsx           # Аккордеон FAQ
│   │   ├── TiltGlare.jsx         # Glare эффект
│   │   ├── ServiceCard.jsx       # Карточка услуги
│   │   ├── DirectionCard.jsx     # Карточка направления
│   │   ├── Lightbox.jsx          # Lightbox для изображений
│   │   ├── MasterModal.jsx       # Модалка мастера
│   │   └── StickyBar.jsx         # Sticky bar на мобильном
│   │
│   ├── sections/                 # Секции страницы (каждая в своей папке)
│   │   ├── Nav/                  # Навигация (dynamic menu)
│   │   ├── Hero/                 # Главный экран
│   │   ├── Advantages/           # Преимущества
│   │   ├── Promotion/            # Акция
│   │   ├── Services/             # Услуги (directions)
│   │   ├── ServiceCarousel/      # Карусель услуг
│   │   ├── Gallery/              # Галерея работ
│   │   ├── Team/                 # Команда мастеров
│   │   ├── Reviews/              # Отзывы
│   │   ├── About/                # О салоне
│   │   ├── BeforeAfter/          # До/после
│   │   ├── Reels/                # Reels
│   │   ├── FAQ/                  # FAQ
│   │   ├── BookingContacts/      # Запись + контакты
│   │   └── Footer/               # Подвал
│   │
│   ├── widgets/
│   │   └── Kolya/
│   │       └── ChatWidget.jsx    # Виджет AI-консьержа
│   │
│   ├── prompts/
│   │   └── salesSalonPrompt.js   # Системный промпт Коли
│   │
│   ├── lib/
│   │   └── session.js            # getOrCreateSessionId (localStorage, TTL 30 дней)
│   │
│   ├── utils/
│   │   ├── scrollToBooking.js    # Helper для скролла к записи
│   │   └── getAvailableSections.js # Helper для доступных секций
│   │
│   └── contexts/
│       └── ConfigContext.jsx     # React Context для глобального config
│
├── public/                       # Статика
├── .env                          # Локальные секреты (не в git)
├── .env.example                  # Образец переменных окружения
├── package.json                  # Зависимости и скрипты
├── vite.config.js                # Конфиг Vite (proxy /api, host 127.0.0.1)
├── vercel.json                   # Конфиг Vercel
└── AGENTS.md                     # Инструкция для AI-агентов
```

---

## Архитектурные правила

### 1. Только postgres.js, НЕ @supabase/supabase-js
**Причина:** Проект готовится к переезду на Яндекс Postgres (152-ФЗ — персональные данные клиентов должны храниться в РФ). Любая зависимость от Supabase-обвязки усложнит миграцию.

**Использование:**
```javascript
// lib/db.js - singleton connection
import postgres from 'postgres'

const sql = postgres(process.env.DATABASE_URL, {
  prepare: false,
  max: 1,
  idle_timeout: 20,
  ...options
})

export default sql
```

### 2. ПДн (имя, телефон) НЕ передаются в LLM
Коля общается через OpenRouter (зарубежный провайдер). Передавать туда телефоны/имена — нарушение 152-ФЗ.

**Решение:**
- Имя и телефон собираются через отдельную форму (BookingContacts)
- Коля не просит телефон в чате — рендерит inline-кнопку "Оставить заявку"
- В диалогах в БД (`dialogues.messages_json`) ПДн отсутствуют

### 3. localStorage для session_id (НЕ cookies)
Идентификация анонимного посетителя — UUID, генерируется на клиенте через `crypto.randomUUID()`, хранится в localStorage с TTL 30 дней.

**Утилита:** `src/lib/session.js`

### 4. Один шаблон — много клиентов, через config
`src/configs/<slug>.config.js` — единственное место с данными конкретного салона:
- Название
- Цвета (tokens)
- Контакты
- Услуги
- Мастера
- Отзывы
- Секции (enabled/disabled)

Каждый новый клиент = новый файл конфигурации.

### 5. Каждая секция в своём файле и обёрнута в SectionBoundary
В `src/sections/<Имя>/<Имя>.jsx`. ErrorBoundary ловит ошибки секции и показывает плейсхолдер вместо чёрного экрана.

### 6. Secret_token для Telegram webhook
`api/telegram-webhook.js` проверяет заголовок `X-Telegram-Bot-Api-Secret-Token` против `process.env.TELEGRAM_WEBHOOK_SECRET`.

### 7. parse_mode: 'HTML' + escapeHtml
В Telegram-сообщениях используется только HTML-режим. Утилита `escapeHtml` в `lib/notifyError.js`.

### 8. Дедупликация Telegram updates
`api/telegram-webhook.js` пишет каждый `update_id` в таблицу `telegram_updates` через `INSERT ... ON CONFLICT DO NOTHING`.

### 9. Идемпотентность уведомлений о лидах
Поле `leads.telegram_notified_at` — null до отправки, заполняется после.

### 10. Tool-call show_lead_button — единственный путь к контактам
Коля никогда не просит телефон в чате. Когда чувствует готовность — вызывает `show_lead_button(service_name?)`. ChatWidget рендерит кнопку "Оставить заявку", по клику открывается форма BookingContacts.

---

## Схема базы данных (Supabase Postgres 17)

**Проект:** `qycbkiqrfcrapomvbhuw` (eu-west-1, Postgres 17)
**RLS:** отключён на всех таблицах

### `clients`
| Колонка | Тип | Описание |
|---------|-----|----------|
| id | uuid | PK |
| slug | text | Уникальный slug клиента (например, 'picasso') |
| name | text | Название салона |
| telegram_chat_id | text | ID чата владельца в Telegram |
| telegram_bot_token_env | text | Название env переменной с токеном бота |
| notes | text | Заметки |
| created_at | timestamp | Время создания |

**Запись PICASSO:**
- `slug='picasso'`
- `id='2516ec94-b58c-4782-89af-853d440cdb26'`
- `telegram_chat_id='5068385066'`

### `dialogues`
| Колонка | Тип | Описание |
|---------|-----|----------|
| id | uuid | PK |
| client_id | uuid | FK → clients.id |
| session_id | text | UUID сессии (из localStorage) |
| became_lead | boolean | Стал ли диалог лидом |
| created_at | timestamp | Время создания |
| updated_at | timestamp | Время обновления |
| messages_json | jsonb | Сообщения диалога |

**Структура messages_json:**
```json
[
  {
    "role": "user",
    "content": "Хочу записаться на стрижку",
    "timestamp": "2024-01-01T12:00:00Z"
  },
  {
    "role": "assistant",
    "content": "Конечно! На какую дату?",
    "timestamp": "2024-01-01T12:00:05Z"
  }
]
`

### `leads`
| Колонка | Тип | Описание |
|---------|-----|----------|
| id | uuid | PK |
| client_id | uuid | FK → clients.id |
| session_id | text | UUID сессии |
| dialogue_id | uuid | FK → dialogues.id (nullable) |
| name | text | Имя клиента |
| phone | text | Телефон клиента |
| service | text | Услуга (опционально) |
| created_at | timestamp | Время создания |
| telegram_notified_at | timestamp | Время отправки в Telegram |

### `telegram_updates`
| Колонка | Тип | Описание |
|---------|-----|----------|
| id | uuid | PK |
| update_id | bigint | ID обновления от Telegram |
| created_at | timestamp | Время получения |

---

## Environment Variables

| Переменная | Назначение | Где |
|------------|-----------|-----|
| `OPENROUTER_API_KEY` | API-ключ OpenRouter для Коли | .env, Vercel |
| `DATABASE_URL` | Connection string Postgres (Supabase pooler:6543, `?pgbouncer=true`) | .env, Vercel |
| `TELEGRAM_BOT_TOKEN` | Токен бота владельца | .env, Vercel |
| `TELEGRAM_CHAT_ID` | ID чата Андрея (legacy fallback) | .env, Vercel |
| `TELEGRAM_WEBHOOK_SECRET` | Secret для защиты webhook'а | .env, Vercel |
| `SMTP_USER`, `SMTP_PASS`, `NOTIFY_EMAIL` | Legacy email канал (к удалению) | .env |

---

## Конфигурационная система

### Структура конфигурации клиента

```javascript
{
  // Цветовая палитра (tokens)
  tokens: {
    GOLD: '#C9A87A',
    GOLD_BRIGHT: '#D4B88A',
    GOLD_DIM: '#B89A6A',
    TEXT: '#F0EBE3',
    TEXT_SOFT: 'rgba(240, 235, 227, 0.6)',
    MUTED: 'rgba(255, 255, 255, 0.4)',
    BG: '#0E0C0B',
    SURFACE: '#1A1714',
    SURFACE_L: '#262220',
    BORDER: 'rgba(255,255,255,0.06)',
    BORDER_H: 'rgba(255,255,255,0.14)',
    EASE: [0.16, 1, 0.3, 1],
  },

  // Блок флага (какие секции включены)
  block_flags: {
    hero: true,
    about: true,
    services: true,
    team: true,
    gallery: true,
    beforeAfter: true,
    reviews: true,
    faq: true,
    promotions: true,
    contacts: true,
  },

  // Юридическая информация
  legal: {
    showInFooter: true,
    placeholder: 'Реквизиты предоставим при заключении договора',
    policyUrl: null,
  },

  // Контент
  content: {
    promotion: {
      title: 'Особое предложение',
      text: 'Текст акции...',
    },
  },

  // Мета-информация
  meta: {
    name: 'Brand',
    brand: {
      name: 'Brand',
      shortName: 'Brand',
    },
    tagline: 'Салон эстетики',
    favicon: '/favicon.ico',
  },

  // Контакты
  contacts: {
    phone: '+7 (999) 123-45-67',
    phoneRaw: '79991234567',
    whatsapp: '+79991234567',
    address: 'г. Брянск, ул. Ленина, 1',
    hours: 'Ежедневно 9:00–21:00',
    mapsUrl: 'https://maps.google.com/...',
  },

  // Социальные сети
  social: [
    { href: 'https://vk.com/...', label: 'VK' },
  ],

  // Команда мастеров
  team: [
    {
      name: 'Виктория',
      role: 'Топ-стилист',
      exp: '10 лет опыта',
      specialty: 'Сложные окрашивания',
      image: '/images/team/victoria.jpg',
      details: ['...'],
    },
  ],

  // Секции
  sections: {
    hero: { enabled: true, ... },
    advantages: { enabled: true },
    promotion: { enabled: true },
    services: { enabled: true, items: [...] },
    serviceCarousel: { enabled: true, items: [...] },
    gallery: { enabled: true, items: [...] },
    team: { enabled: true },
    beforeAfter: { enabled: false, items: [] },
    reels: { enabled: false, items: [] },
    reviews: { enabled: true, items: [...] },
    about: { enabled: true, text: '...' },
    faq: { enabled: true, items: [...] },
    bookingContacts: { enabled: true },
  },

  // Порядок секций
  sectionsOrder: [
    'hero', 'promotion', 'advantages', 'services', 'gallery',
    'beforeAfter', 'team', 'reels', 'reviews', 'about', 'faq', 'bookingContacts'
  ],

  // Год копирайта
  copyrightYear: 2026,
}
```

---

## Секционный MVP-контракт

### Обязательные секции (всегда рендерятся)
- **Nav** — навигация (dynamic menu)
- **Hero** — главный экран
- **BookingContacts** — форма записи + контакты
- **Footer** — подвал с legal/policy
- **StickyBar** — мобильный sticky bar (если контакты включены)
- **FAQ** — раздел вопросов (всегда, часть MVP)

### Обязательная секция услуг
- **ServiceCarousel** ИЛИ **Services** (минимум 3 позиции)

### Условные секции (скрываются если нет данных)
- **Gallery** — минимум 3 фото
- **Reviews** — минимум 2 отзыва
- **Team** — минимум 1 мастер
- **BeforeAfter** — если enabled и есть items
- **About** — если текст >= 20 символов
- **Promotion/Reels/Advantages** — опционально

---

## Helper-функции

### `src/utils/scrollToBooking.js`
Единая точка скролла к секции записи:
```javascript
export function scrollToBooking() {
  const target =
    document.getElementById('bookingContacts-section') ||
    document.getElementById('booking');

  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
```

### `src/utils/getAvailableSections.js`
Централизованная логика доступности секций:
```javascript
export function getAvailableSections(config) {
  // Возвращает массив секций с метаданными
  return [
    {
      key: 'services',
      label: 'Услуги',
      anchorId: 'services-section',
      enabled: true,
      inNav: true,
      hasData: true
    },
    // ...
  ]
}

export function getNavItems(config) {
  // Возвращает только секции для навигации
  return getAvailableSections(config).filter(s => s.inNav)
}
```

---

## API Endpoints

### `POST /api/chat`
Обработка сообщений с AI-консьержем (Коля).

**Request:**
```json
{
  "message": "Хочу записаться на стрижку",
  "session_id": "uuid-from-localstorage",
  "slug": "picasso"
}
```

**Response:**
```json
{
  "reply": "Конечно! На какую дату?",
  "tool_calls": [
    {
      "name": "show_lead_button",
      "arguments": "{\"service\":\"стрижка\"}"
    }
  ]
}
```

**Логика:**
1. Читает session_id из тела запроса
2. Разрешает клиента по slug (clientResolver)
3. Записывает сообщение пользователя в БД
4. Отправляет в OpenRouter с tools
5. Записывает ответ ассистента в БД
6. При ошибке БД — уведомляет в Telegram, но не блокирует ответ

### `POST /api/booking`
Приём заявок на запись.

**Request:**
```json
{
  "name": "Анна",
  "phone": "+79991234567",
  "service": "Стрижка",
  "session_id": "uuid-from-localstorage",
  "slug": "picasso"
}
```

**Response:**
```json
{
  "success": true,
  "lead_id": "uuid"
}
```

**Логика:**
1. Валидирует данные
2. Записывает lead в БД
3. Связывает с существующим диалогом по session_id
4. Отмечает dialogue.became_lead = true
5. Отправляет уведомление в Telegram (HTML режим)
6. Возврат 200 если БД или Telegram успех

### `POST /api/telegram-webhook`
Обработка callback_query от Telegram (история диалогов).

**Headers:**
- `X-Telegram-Bot-Api-Secret-Token` — проверяется против env

**Request:** Telegram webhook payload

**Логика:**
1. Проверяет secret token
2. Дедуплирует по update_id (таблица telegram_updates)
3. Проверяет доступ по clients.telegram_chat_id
4. Отправляет историю диалога через sendMessage/sendDocument
5. Отвечает answerCallbackQuery

---

## ChatWidget (AI-консьерж Коля)

### Компонент
`src/widgets/Kolya/ChatWidget.jsx`

### Функционал
- Отображает чат-виджет в правом нижнем углу
- Отправляет сообщения в `/api/chat`
- Обрабатывает tool_calls:
  - `show_lead_button` — рендерит кнопку "Оставить заявку"
- По клику на кнопку — dispatch `CustomEvent('open-booking-form', {detail:{service}})`
- Закрывает виджет после клика

### Системный промпт
`src/prompts/salesSalonPrompt.js` — промпт "устраиваюсь на работу" v2

---

## Session Management

### Утилита
`src/lib/session.js`

### Логика
```javascript
function getOrCreateSessionId() {
  const key = 'salon_session_id'
  const startedKey = 'salon_session_started'
  const ttl = 30 * 24 * 60 * 60 * 1000 // 30 дней

  let sessionId = localStorage.getItem(key)
  const started = parseInt(localStorage.getItem(startedKey) || '0')

  // Проверка TTL
  if (!sessionId || Date.now() - started > ttl) {
    sessionId = crypto.randomUUID()
    localStorage.setItem(key, sessionId)
    localStorage.setItem(startedKey, Date.now().toString())
  }

  return sessionId
}
```

---

## Development Setup

### Установка
```bash
npm install
```

### Локальная разработка
```bash
npm run dev
```
- Vite dev server на `http://127.0.0.1:5173`
- Proxy `/api` → `http://localhost:3000` (для Vercel dev)

### Vercel dev (serverless functions)
```bash
npm run dev:vercel
```

### Production build
```bash
npm run build
```

---

## Deployment

### Vercel
- Автоматический деплой из git
- Environment variables в Vercel dashboard
- Functions в `api/*.js` автоматически деплоятся как serverless

### Переменные окружения (Vercel)
- `OPENROUTER_API_KEY`
- `DATABASE_URL` (Supabase pooler с `?pgbouncer=true`)
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `TELEGRAM_WEBHOOK_SECRET`

---

## Section IDs (якоря для скролла)

| Секция | ID |
|--------|-----|
| Hero | `hero-section` |
| Advantages | `advantages-section` |
| Promotion | `promotion-section` |
| Services | `services-section` |
| ServiceCarousel | `service-carousel` |
| Gallery | `gallery-section` |
| BeforeAfter | `beforeAfter-section` |
| Team | `team-section` |
| Reels | `reels-section` |
| Reviews | `reviews-section` |
| About | `about-section` |
| FAQ | `faq-section` |
| BookingContacts | `bookingContacts-section` |

---

## MVP-критерии валидности секций

| Секция | Минимум | В навигации |
|--------|---------|-------------|
| Services | 3 позиции в ServiceCarousel ИЛИ Services | Да |
| Gallery | 3 фото | Да |
| Reviews | 2 отзыва | Да |
| FAQ | Всегда | Да |
| Team | 1 мастер | Да |
| BeforeAfter | enabled=true + 1 item | Да |
| About | текст >= 20 символов | Да |
| Hero | Всегда | Нет |
| BookingContacts | Всегда | Нет (отдельная кнопка) |
| Footer | Всегда | Нет |
| Promotion | есть title/text | Нет |
| Reels | есть items | Нет |
| Advantages | Всегда | Нет |

---

## Безопасность

### Защита webhook
- `X-Telegram-Bot-Api-Secret-Token` header
- Проверка в `api/telegram-webhook.js`

### Защита ПДн
- Имя/телефон не передаются в LLM
- Отдельная форма для контактов
- ПДн не хранятся в `dialogues.messages_json`

### SQL Injection
- Использование параметризованных запросов через postgres.js

### XSS
- React по умолчанию экранирует вывод
- HTML escaping для Telegram через `escapeHtml`

---

## TODO / Roadmap

### В ближайшее время
- [ ] Удаление legacy email канала (nodemailer)
- [ ] Переезд на Яндекс Postgres (152-ФЗ)
- [ ] Добавление аналитики по диалогам Коли
- [ ] Улучшение промпта Коли на основе данных

### В будущем
- [ ] A/B тестирование конфигураций
- [ ] Автоматический парсинг Google Maps
- [ ] Автогенерация конфигураций по данным парсера
- [ ] Панель администратора для владельцев
- [ ] CRM интеграция

---

## Контакты

**Владелец проекта:** Андрей

**Техническая документация:** `TECHNICAL_DOCUMENTATION.md`

**Инструкция для AI-агентов:** `AGENTS.md`
