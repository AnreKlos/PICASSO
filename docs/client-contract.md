# Client Contract

## Mandatory Structure for Every New Client

### DATA STRUCTURE

Every client must have a corresponding data folder:

```
data/clients/<slug>/
  raw.json              ← Raw export from parser (HTML dumps, JSON)
  normalized.json       ← After mapper normalization
  assembled.config.json ← Final config for rendering (merged with master defaults)
```

### ASSET STRUCTURE

Every client must have a corresponding assets folder:

```
public/clients/<slug>/
  hero/
    hero.webp           ← Hero section background
  gallery/
    work-1.webp
    work-2.webp
    ...                 ← Gallery/portfolio images
  team/
    master-1.webp
    master-2.webp
    ...                 ← Team member photos
  services/
    service-1.webp
    service-2.webp
    ...                 ← Service images
  about/
    interior-1.webp
    interior-2.webp
    ...                 ← About section interior photos
```

### RULES

1. **One slug = one data folder + one assets folder**
   - Slug must be URL-safe (lowercase, hyphens only)
   - Example: `picasso`, `beauty-studio-moscow`

2. **Template NEVER reads from data/clients/**
   - Template only reads from `src/templates/beauty-master/master.defaults.js`
   - Template resolver merges client config with master defaults at runtime
   - No direct file system access to client data in template code

3. **Assembler NEVER writes to src/templates/**
   - Assembler only writes to `data/clients/<slug>/assembled.config.json`
   - Assembler never modifies template source code
   - Template is immutable, clients are generated

4. **Clients NEVER share assets with each other**
   - Each client has isolated asset folder
   - No cross-client asset references
   - Asset paths in config must use `/clients/<slug>/...`

5. **Section fallback rules**
   - If client data is missing for a section → use master.defaults.js
   - If client has no team photos → hide Team section (no fallback)
   - If client has no gallery items → hide Gallery section (no fallback)
   - Contacts, Booking, Map → always shown (data always exists or uses defaults)

### CONFIG STRUCTURE (assembled.config.json)

```json
{
  "meta": {
    "slug": "client-slug",
    "name": "Client Name",
    "brand": {
      "name": "Brand Name",
      "slug": "client-slug",
      "shortName": "Brand"
    },
    "fullName": "Full Business Name",
    "tagline": "Tagline",
    "city": "City Name",
    "cityPrepositional": "в Городе"
  },
  "contacts": {
    "phone": "+7 (XXX) XXX-XX-XX",
    "phoneRaw": "+7XXXXXXXXXX",
    "address": "Full address",
    "addressNote": "Entrance details",
    "hours": "Working hours",
    "hoursNote": "Additional notes",
    "whatsapp": "+7XXXXXXXXXX",
    "coordinates": { "lat": 00.000, "lng": 00.000 }
  },
  "social": [
    { "href": "https://vk.com/...", "label": "ВКонтакте", "short": "VK" },
    { "href": "https://instagram.com/...", "label": "Instagram", "short": "IG" }
  ],
  "sections": {
    "hero": {
      "enabled": true,
      "photo": "/clients/<slug>/hero/hero.webp",
      "titleLine1": "Headline",
      "cityLine": "in City",
      "lead": "Lead text",
      "ctaLabel": "CTA Button"
    },
    "advantages": { "enabled": true },
    "promotion": { "enabled": true },
    "serviceCarousel": {
      "enabled": true,
      "title": "Services Title",
      "items": [...]
    },
    "services": {
      "enabled": true,
      "items": [...]
    },
    "gallery": {
      "enabled": true,
      "items": ["/clients/<slug>/gallery/..."]
    },
    "beforeAfter": {
      "enabled": false,
      "items": []
    },
    "team": {
      "enabled": true,
      "items": [...]
    },
    "reviews": {
      "enabled": true,
      "items": [...]
    },
    "about": {
      "enabled": true,
      "text": "About text",
      "images": ["/clients/<slug>/about/..."]
    },
    "faq": {
      "enabled": true,
      "items": [...]
    },
    "bookingContacts": { "enabled": true }
  },
  "sectionsOrder": ["hero", "promotion", "advantages", "services", "gallery", "beforeAfter", "team", "reels", "reviews", "about", "faq", "bookingContacts"],
  "block_flags": {
    "hero": true,
    "about": true,
    "services": true,
    "team": true,
    "gallery": true,
    "beforeAfter": true,
    "reviews": true,
    "faq": true,
    "promotions": true,
    "contacts": true
  }
}
```

### ASSET PATH RULES

- Template defaults: `/templates/beauty-master/...`
- Client overrides: `/clients/<slug>/...`
- Never mix paths between clients
- Never reference other clients' assets

### MERGE STRATEGY (templateResolver)

1. Load client config from `data/clients/<slug>/assembled.config.json`
2. Load master defaults from `src/templates/beauty-master/master.defaults.js`
3. Load global UI config from `src/configs/_default.config.js`
4. Merge order (last wins):
   - Master defaults (base)
   - Client config (overrides master)
   - Global UI config (tokens, legal, features - final layer)

### VALIDATION CHECKLIST

Before deploying a client:
- [ ] Slug is URL-safe
- [ ] `data/clients/<slug>/` folder exists
- [ ] `public/clients/<slug>/` folder exists
- [ ] `assembled.config.json` is valid JSON
- [ ] All asset paths start with `/clients/<slug>/`
- [ ] No references to other clients' assets
- [ ] Required fields present (meta, contacts, sections)
- [ ] Section enable flags set correctly
- [ ] Asset files exist at specified paths
