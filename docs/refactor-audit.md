# Refactor Audit — 2026-04-30

> Аудит состояния проекта перед рефакторингом. Без правок кода — только наблюдения и план.

---

## 🟢 Что активно работает (рабочая ветка)

```
src/App.jsx
  └─ импортирует src/BeautyTemplate.jsx                    ← АКТИВЕН
       └─ импортирует src/sections/<*>/...                 ← АКТИВНЫ
       └─ импортирует src/components/<*>                   ← АКТИВНЫ
       └─ импортирует src/widgets/Kolya/ChatWidget         ← АКТИВЕН
       └─ импортирует src/configs/_default.config.js       ← АКТИВЕН
```

Всё рендерится из плоской структуры `src/sections/`, `src/components/`, `src/widgets/`.
Файлы в `src/templates/beauty-master/` — **дубликаты, не используются**.

---

## 🔴 Что нерабочее (мёртвый код / дубли)

### Дубли BeautyTemplate
- `src/BeautyTemplate.jsx` — активен
- `src/templates/beauty-master/BeautyTemplate.jsx` — мёртв

### Дубли секций (15 штук)
- `src/sections/<*>/<*>.jsx` — активны
- `src/templates/beauty-master/sections/<*>/<*>.jsx` — мёртвы, **с синтаксическими ошибками** в импортах
  Пример: `import MagneticButton from '../components/MagneticButton''` (двойная одинарная кавычка)

### Дубли компонентов
- `src/components/` — 14 файлов, активны
- `src/templates/beauty-master/components/` — 8 файлов, мёртвы (дубли из 14)

### Дубли виджетов
- `src/widgets/Kolya/` — активен
- `src/templates/beauty-master/widgets/Kolya/` — мёртв

### Мёртвые файлы вне dup-структуры
- `src/templates/beauty-master/master.defaults.js` — содержит **правильные нейтральные defaults**, но **никем не импортируется**
- `lib/templateResolver.js` — никем не импортируется

### Legacy конфиги (не удалены Perplexity несмотря на её отчёт)
- `src/configs/kalinka.config.js`
- `src/configs/kalinka-malinka-studiya-krasoty.config.js`
- `src/configs/if-studiya.config.js`
- `src/configs/picasso.config.js.bak`

### Legacy public-папки
- `public/images/` — со всеми поддиректориями (hair, hero, interior, services, team)
- `public/kalinka/`
- `public/kalinka-malinka-studiya-krasoty/`
- `public/clients/kalinka/` — внутри clients тоже Калинка осталась

### Пустые placeholder-папки
- `radar/` — структура есть, файлов нет (только `.gitkeep`)
- `assembler/builders/`, `assembler/mappers/`, `assembler/output/`, `assembler/validators/` — пустые
- `assembler/schema.client.json` — **рабочая, нужная**, описывает контракт клиентского конфига

---

## ⚠️ Конфликты содержимого между активной и templates-веткой

**Активная ветка (`src/sections/Gallery/Gallery.jsx`):**
- defaultWorks → `/images/hair/hair_*.webp`
- alt → «PICASSO» в текстах

**Templates-ветка (`src/templates/beauty-master/sections/Gallery/Gallery.jsx`):**
- defaultWorks → `/templates/beauty-master/gallery/demo-gallery-*.webp`
- alt → нейтральные

**Templates-ветка новее по контенту, но сломана импортами Hero.**

---

## ⚠️ Конфликт между _default.config.js и master.defaults.js

| Поле | `_default.config.js` (активный) | `master.defaults.js` (мёртвый) |
|------|--------------------------------|--------------------------------|
| brand.name | PICASSO | Beauty Master |
| city | Брянск | Москва |
| phone | реальный салона | демо |
| social | picasso_salon | demo |
| hero.photo | `/images/hair/hair_1.webp` | (нужно проверить) |

`master.defaults.js` — правильная нейтральная версия, должна стать `_default.config.js`.

---

## 📋 Карта рефакторинга — 8 фаз

### Фаза 1 — Удаление legacy конфигов и public-папок
- DELETE `src/configs/kalinka.config.js`
- DELETE `src/configs/kalinka-malinka-studiya-krasoty.config.js`
- DELETE `src/configs/if-studiya.config.js`
- DELETE `src/configs/picasso.config.js.bak`
- DELETE `public/images/`
- DELETE `public/kalinka/`
- DELETE `public/kalinka-malinka-studiya-krasoty/`
- DELETE `public/clients/kalinka/`

### Фаза 2 — Удаление мёртвой templates-структуры
**Решение:** удалить `src/templates/beauty-master/` целиком — там одни сломанные дубли.
- DELETE `src/templates/beauty-master/BeautyTemplate.jsx`
- DELETE `src/templates/beauty-master/sections/`
- DELETE `src/templates/beauty-master/components/`
- DELETE `src/templates/beauty-master/widgets/`
- **СОХРАНИТЬ** `src/templates/beauty-master/master.defaults.js` (перенести в нужное место)

### Фаза 3 — Перемещение файлов в правильную целевую структуру
Это ОДНА фаза, не несколько. Делается одним скриптом / одним промптом, после чего билд проверяется.

```
src/BeautyTemplate.jsx                → src/templates/beauty-master/BeautyTemplate.jsx
src/sections/                         → src/templates/beauty-master/sections/
src/widgets/                          → src/templates/beauty-master/widgets/
src/components/DirectionCard.jsx      → src/templates/beauty-master/components/
src/components/DustParticles.jsx      → src/templates/beauty-master/components/
src/components/FAQItem.jsx            → src/templates/beauty-master/components/
src/components/MagneticButton.jsx     → src/templates/beauty-master/components/
src/components/MasterModal.jsx        → src/templates/beauty-master/components/
src/components/ServiceCard.jsx        → src/templates/beauty-master/components/
src/components/StickyBar.jsx          → src/templates/beauty-master/components/
src/components/TiltGlare.jsx          → src/templates/beauty-master/components/
```

В `src/components/` остаются только **shared**:
- FadeIn, GoldSpan, TiltHeading, Lightbox, SectionBoundary, NotFound

### Фаза 4 — Обновление импортов
После Фазы 3 пересчитать все относительные пути в перемещённых файлах:
- было `from '../../components/FadeIn'` → стало `from '../../../components/FadeIn'`
- было `from '../../configs/_default.config'` → стало `from '../../../configs/_default.config'`
- и т.д.

### Фаза 5 — Перезапись _default.config.js
Взять содержимое `master.defaults.js` (нейтральные defaults), положить в `src/configs/_default.config.js`, удалить `master.defaults.js` (он больше не нужен).

Все пути в `_default.config.js` → `/templates/beauty-master/...`

### Фаза 6 — Обновление App.jsx
- Убрать `import.meta.glob('./configs/*.config.js')` — больше не нужно, нет клиентских конфигов в `src/configs/`
- `App.jsx` рендерит `<BeautyTemplate config={defaultConfig} />` для `/`
- `<SlugRoute />` для `/:slug` — читает JSON из `data/clients/<slug>.json` через `clientResolver`

### Фаза 7 — Резолверы
- `lib/clientResolver.js` — РАСШИРИТЬ: добавить функцию `getClientConfig(slug)` которая читает `data/clients/<slug>.json` из файловой системы или импортирует через Vite
- `lib/templateResolver.js` — УДАЛИТЬ (мёртв)

### Фаза 8 — Документация
- Обновить `docs/template-contract.md` под актуальную структуру
- Обновить `docs/client-contract.md` — путь `data/clients/<slug>.json` (не `generated-configs`)
- Обновить `docs/agent-log.md` — записать что сделали

---

## 🎯 Целевая структура после рефакторинга

```
neuralsync/
├── api/                              # Vercel API routes
│   ├── booking.js
│   ├── chat.js
│   └── telegram-webhook.js
│
├── lib/                              # Серверная логика
│   ├── clientResolver.js             # slug → клиентский JSON
│   ├── db.js
│   ├── dialogue.js
│   └── notifyError.js
│
├── radar/                            # Парсер (placeholder для будущей JS-интеграции)
├── assembler/
│   └── schema.client.json            # Контракт клиентского конфига
│
├── data/
│   └── clients/
│       └── .gitkeep                  # Сюда падают <slug>.json
│
├── public/
│   ├── templates/beauty-master/      # Демо-ассеты шаблона
│   │   ├── hero/
│   │   ├── gallery/
│   │   ├── services/
│   │   ├── about/
│   │   └── team/
│   ├── clients/                      # Ассеты клиентов
│   │   └── .gitkeep
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
│
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   │
│   ├── configs/
│   │   └── _default.config.js        # Единственный конфиг по умолчанию
│   │
│   ├── contexts/
│   │   └── ConfigContext.js
│   │
│   ├── components/                   # ТОЛЬКО shared
│   │   ├── FadeIn.jsx
│   │   ├── GoldSpan.jsx
│   │   ├── TiltHeading.jsx
│   │   ├── Lightbox.jsx
│   │   ├── SectionBoundary.jsx
│   │   └── NotFound.jsx
│   │
│   ├── lib/
│   │   └── session.js
│   │
│   ├── prompts/
│   │   └── salesSalonPrompt.js
│   │
│   ├── utils/
│   │   ├── getAvailableSections.js
│   │   └── scrollToBooking.js
│   │
│   └── templates/
│       └── beauty-master/            # ВСЁ что относится к шаблону
│           ├── BeautyTemplate.jsx
│           ├── components/
│           │   ├── DirectionCard.jsx
│           │   ├── DustParticles.jsx
│           │   ├── FAQItem.jsx
│           │   ├── MagneticButton.jsx
│           │   ├── MasterModal.jsx
│           │   ├── ServiceCard.jsx
│           │   ├── StickyBar.jsx
│           │   └── TiltGlare.jsx
│           ├── sections/
│           │   ├── About/
│           │   ├── Advantages/
│           │   ├── BeforeAfter/
│           │   ├── BookingContacts/
│           │   ├── FAQ/
│           │   ├── Footer/
│           │   ├── Gallery/
│           │   ├── Hero/
│           │   ├── Nav/
│           │   ├── Promotion/
│           │   ├── Reels/
│           │   ├── Reviews/
│           │   ├── ServiceCarousel/
│           │   ├── Services/
│           │   └── Team/
│           └── widgets/
│               └── Kolya/
│
└── docs/
    ├── agent-log.md
    ├── template-contract.md
    ├── client-contract.md
    ├── future-client-structure.md
    └── refactor-audit.md             # ← этот файл
```

---

## 🚧 Риски и подводные камни

1. **Гигантское обновление импортов в Фазе 4** — 15 секций × ~10 импортов = ~150 строк. Нужно делать через find-replace с проверкой.

2. **`embla-carousel-react` и другие npm-пакеты** — пути от node_modules не меняются, не трогать.

3. **Vite alias `@/`** — проверить vite.config.js, если используется alias на `src/` — он переживёт перемещение.

4. **CSS классы `font-picasso-*`** — это design system, переименование пойдёт отдельной фазой потом, не сейчас.

5. **Lenis, framer-motion, lucide-react** — должны работать как есть.

6. **`getAvailableSections.js`** использует `config.sections.*` — эти поля не меняются, должно работать.

7. **`ChatWidget`** имеет hardcoded slug `picasso` для localStorage — отдельный фикс на чистку.

---

## ✅ Готовность к Фазе 1

После аудита:
- ✅ Знаем что активно, что мёртво
- ✅ Знаем что удалять, что переносить
- ✅ Знаем целевую структуру
- ✅ Знаем порядок фаз и риски

**Готовы запускать Фазу 1.**

---

## 📌 Решение по `radar/` и `assembler/`

Реальный парсер живёт в `D:\1 KURSOR_PROJ\11 PARSER\` (Python).
В `neuralsync/radar/` и `neuralsync/assembler/` — пустые placeholder-папки.

**Решение:** оставить пустыми с README в каждой:
- `radar/README.md` → "Placeholder for future JS-based scraper. Active scraper lives in PARSER project."
- `assembler/README.md` → "JSON Schema contract for client configs. Active assembler lives in PARSER project."

`schema.client.json` остаётся — это контракт фронта с парсером, общая точка интеграции.
