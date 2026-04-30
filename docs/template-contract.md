# Template Architecture

## Single Template Structure

**Template**: `beauty-master` (the only template)

**Locations**:
- Template code: `src/templates/beauty-master/`
- Template assets: `public/templates/beauty-master/`
- Default config: `src/configs/_default.config.js`

## Default Config

`src/configs/_default.config.js` exports `defaultConfig` with:
- Demo salon data (Beauty Master)
- All section configurations
- Image paths pointing to `/templates/beauty-master/<category>/...`

## Template Components

### Code (`src/templates/beauty-master/`)
- `BeautyTemplate.jsx` - Main template component
- `sections/` - All section components (15 sections)
- `components/` - Template-specific components (8 components)
- `widgets/Kolya/` - Chat widget

### Assets (`public/templates/beauty-master/`)
- `hero/` - Demo hero photo
- `gallery/` - Demo gallery photos (6)
- `services/` - Demo service photos (5)
- `team/` - Demo team photos (2)
- `about/` - Demo interior photos (2)

## Shared Components

`src/components/` contains reusable components:
- FadeIn, GoldSpan, TiltHeading, Lightbox, SectionBoundary, NotFound

## Config Loading

App.jsx uses:
- Static import: `import { defaultConfig } from './configs/_default.config.js'`
- Route `/` → renders `<BeautyTemplate config={defaultConfig} />`
- Route `/:slug` → calls `getClientConfig(slug)` from `lib/clientResolver.js`, falls back to `defaultConfig`

## Client Configs (Future)

When adding clients:
- Config file: `data/clients/<slug>.json`
- Assets: `public/clients/<slug>/`
- `getClientConfig(slug)` loads JSON via `import.meta.glob('../data/clients/*.json', { eager: true })`
- Missing client → fallback to `defaultConfig`
