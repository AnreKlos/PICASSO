# Client Contract

## Client Structure

Each client consists of:
- Config: `data/clients/<slug>.json`
- Assets: `public/clients/<slug>/`

## Config File

`data/clients/<slug>.json` contains client-specific configuration:
- `meta` - salon metadata (slug, name, city, etc.)
- `contacts` - contact information
- `social` - social media links
- `tokens` - color overrides
- `sections` - section-specific data and overrides
- `features` - feature flags

Image paths must reference `/clients/<slug>/...`

## Assets Folder

`public/clients/<slug>/` contains:
- `hero/` - hero photos
- `gallery/` - gallery photos
- `services/` - service photos
- `team/` - team photos
- `about/` - interior photos

## Config Loading

URL slug → `getClientConfig(slug)` from `lib/clientResolver.js`:
- Loads `data/clients/<slug>.json` via `import.meta.glob('../data/clients/*.json', { eager: true })`
- Returns config if found, otherwise `null`
- App.jsx falls back to `defaultConfig` from `src/configs/_default.config.js`

## Rules

- Slug must be URL-safe (lowercase, hyphens only)
- Asset paths in config must use `/clients/<slug>/...`
- No cross-client asset references
- Missing client → fallback to `defaultConfig`
