# Future Client Structure

## Client Configs

`data/clients/<slug>.json` - client-specific configuration files

## Client Assets

`public/clients/<slug>/` - client-specific media folders

```
public/clients/
├── picasso/
│   ├── hero/
│   │   └── hero.webp
│   ├── gallery/
│   │   ├── work-1.webp
│   │   └── ...
│   ├── services/
│   │   └── service-1.webp
│   ├── team/
│   │   └── master-1.webp
│   └── about/
│       └── interior.webp
└── kalinka-malinka/
    └── ...
```

## Config Loading

URL slug → `getClientConfig(slug)` from `lib/clientResolver.js`:
- Loads `data/clients/<slug>.json` via `import.meta.glob('../data/clients/*.json', { eager: true })`
- Returns config if found, otherwise `null`
- App.jsx falls back to `defaultConfig` from `src/configs/_default.config.js`

## Routing

- `/` → renders with `defaultConfig` (beauty-master demo)
- `/:slug` → renders with client config if found, otherwise `defaultConfig`

## Asset Paths

- Template defaults: `/templates/beauty-master/<category>/...`
- Client overrides: `/clients/<slug>/<category>/...`
