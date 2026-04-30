# Future Client Structure

## Current State

The project currently uses a single template-based architecture:
- **Template**: `beauty-master` (located in `src/templates/beauty-master/`)
- **Config**: `_default.config.js` imports from `master.defaults.js`
- **Assets**: `public/templates/beauty-master/`

## Future Multi-Client Architecture

When the project scales to support multiple clients, the following structure will be used:

### Client Assets

```
public/clients/
├── <client-slug-1>/
│   ├── hero/
│   │   └── hero.webp
│   ├── gallery/
│   │   ├── work-1.webp
│   │   ├── work-2.webp
│   │   └── ...
│   ├── services/
│   │   ├── service-1.webp
│   │   └── ...
│   ├── team/
│   │   ├── master-1.webp
│   │   └── ...
│   └── about/
│       └── interior.webp
└── <client-slug-2>/
    └── ...
```

### Generated Client Configs

```
data/generated-configs/
├── <client-slug-1>.json
├── <client-slug-2>.json
└── ...
```

Each generated config will contain:
- `meta`: client-specific metadata (name, slug, city, etc.)
- `contacts`: client contact information
- `social`: client social media links
- `sections`: section-specific content and asset paths
- `content`: promotional text, etc.

### Template Resolution

The `lib/templateResolver.js` will:
1. Accept a client slug
2. Load the client's generated config from `data/generated-configs/<slug>.json`
3. Merge with the base template defaults from `src/templates/beauty-master/master.defaults.js`
4. Apply global UI config from `src/configs/_default.config.js` (tokens, features, legal)

### URL Routing

Future routing will support:
- `/` → default demo (beauty-master)
- `/:slug` → client-specific site (e.g., `/picasso`, `/kalinka`)

### Asset Path Resolution

Generated configs will use client-specific asset paths:
- Template defaults: `/templates/beauty-master/...`
- Client overrides: `/clients/<slug>/...`

This allows clients to:
1. Use template defaults for common assets
2. Override specific assets with their own
3. Add custom assets without touching the template
