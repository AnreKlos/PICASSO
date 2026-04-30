# Beauty Template Architecture Contract

## Overview

The beauty salon template follows a clean 3-layer architecture to ensure separation between master template code, client configuration, and client assets. This architecture enables:

- **Immutability**: Master template code never contains client-specific data
- **Reusability**: Multiple salons can use the same master template with different configs
- **Maintainability**: Client updates don't require touching master template code
- **Isolation**: No cross-client data access or dependencies

---

## Layer 1: Master Template (Immutable)

**Location**: `src/templates/beauty-master/` and `public/templates/beauty-master/`

**Purpose**: Provides the base template code and demo assets that work out-of-the-box.

### Files

- `src/templates/beauty-master/master.defaults.js` - Default configuration with demo data
- `public/templates/beauty-master/hero/` - Demo hero photos (1 photo)
- `public/templates/beauty-master/gallery/` - Demo gallery photos (5-6 photos)
- `public/templates/beauty-master/team/` - Demo team photos (2 photos)
- `public/templates/beauty-master/services/` - Demo service photos (5-6 photos)
- `public/templates/beauty-master/about/` - Demo interior photos (2-3 photos)

**Rules**:
- Master template is **immutable** - never modify it for a specific client
- All demo assets must reference `public/templates/beauty-master/...`
- MASTER_DEFAULTS contains full demo data for all sections
- No client-specific data or paths in master template code

---

## Layer 2: Client Config (Overrides)

**Location**: `data/generated-configs/<slug>.json`

**Purpose**: Client-specific configuration that overrides master defaults.

### Example Files

- `data/generated-configs/picasso.json` - PICASSO salon config
- `data/generated-configs/kalinka-malinka.json` - Kalinka Malinka salon config

### Config Structure

Each client config contains:
- `meta` - salon metadata (slug, name, city, etc.)
- `contacts` - contact information (phone, address, hours, coordinates)
- `social` - social media links
- `tokens` - color tokens (can override master defaults)
- `sections` - section-specific overrides (items, enabled flags, titles)
- `features` - feature flags (chatWidget, etc.)

**Rules**:
- Client config **only contains overrides** - don't copy entire master defaults
- Image paths in client config must reference `public/clients/<slug>/...`
- Missing fields fall back to MASTER_DEFAULTS
- Config is loaded via ConfigContext in BeautyTemplate.jsx

---

## Layer 3: Client Assets (Media Files)

**Location**: `public/clients/<slug>/`

**Purpose**: Client-specific media files (photos, videos).

### Folder Structure

```
public/clients/<slug>/
  hero/          - Client hero photos
  gallery/       - Client gallery photos
  team/          - Client team photos
  services/      - Client service photos
  about/         - Client interior photos
  kalinka/       - Client-specific subfolders (e.g., kalinka/)
```

### Example Paths

- `public/clients/picasso/hero/` - PICASSO hero photos
- `public/clients/kalinka-malinka/kalinka/hero/` - Kalinka hero photos

**Rules**:
- All client media must live in `public/clients/<slug>/`
- No client media in `public/templates/beauty-master/`
- Image paths in client config must match this structure
- Keep subfolder structure consistent (hero/, gallery/, team/, services/, about/)

---

## Fallback Logic

### Priority Order (for each section)

1. **Client config data** (from ConfigContext)
2. **MASTER_DEFAULTS** (from master.defaults.js)
3. **Hide section** (never show empty)

### Section Rules

| Section | Behavior |
|---------|----------|
| `contacts` | ALWAYS show - no fallback needed, data always exists |
| `bookingContacts` | ALWAYS show - name + phone form is mandatory |
| `map` | ALWAYS show - embedded map is always rendered |
| `team` | Show ONLY if `items.length > 0` - no fallback, hide if empty |
| `gallery` | Show ONLY if `items.length > 0` - no fallback, hide if empty |
| `beforeAfter` | Show ONLY if `items.length > 0` - no fallback, hide if empty |
| `reviews` | Fallback to MASTER_DEFAULTS if client has none |
| `serviceCarousel` | Fallback to MASTER_DEFAULTS if client has none |
| `services` | Fallback to MASTER_DEFAULTS if client has none |
| `faq` | Fallback to MASTER_DEFAULTS if client has none |
| `about` | Fallback to MASTER_DEFAULTS if client has none |
| `promotion` | Fallback to MASTER_DEFAULTS if client has none |
| `advantages` | Fallback to MASTER_DEFAULTS if client has none |
| `hero` | Fallback to MASTER_DEFAULTS if client has none |

### Implementation

Fallback logic is implemented in `BeautyTemplate.jsx`:

```javascript
const config = configFromContext || MASTER_DEFAULTS
```

Each section checks:
```javascript
const sectionConfig = config.sections?.[sectionName] || MASTER_DEFAULTS.sections[sectionName]
```

For sections that hide when empty:
```javascript
if (!sectionConfig.items?.length) return null
```

---

## File Location Rules

### Where Each File Type Must Live

| File Type | Location |
|-----------|----------|
| Master template code | `src/templates/beauty-master/` |
| Master demo assets | `public/templates/beauty-master/` |
| Client configs | `data/generated-configs/<slug>.json` |
| Client assets | `public/clients/<slug>/` |
| Section components | `src/sections/<SectionName>/` |
| Shared components | `src/components/` |
| Config context | `src/contexts/ConfigContext.jsx` |

---

## Cross-Client Data Access

**STRICTLY FORBIDDEN**:

- Never import client-specific config from another client's config file
- Never reference another client's asset paths
- Never hardcode client data in master template code
- Never access `public/clients/<slug>/` from another client's context

**Correct Approach**:

- All client data comes from ConfigContext
- ConfigContext is set at the app level (App.jsx or router)
- Components only read from ConfigContext, never import directly
- Fallback to MASTER_DEFAULTS when client data is missing

---

## Sections Always Shown

These sections are **never hidden** regardless of data:

- **Nav** - Navigation bar (always visible)
- **Footer** - Footer with contacts (always visible)
- **bookingContacts** - Booking form (always visible, mandatory)
- **contacts** - Contact information (always visible)

These sections are **hidden if no data**:

- **team** - Hidden if `items.length === 0`
- **gallery** - Hidden if `items.length === 0`
- **beforeAfter** - Hidden if `items.length === 0`

These sections **fallback to MASTER_DEFAULTS**:

- **reviews** - Show master demo reviews if client has none
- **serviceCarousel** - Show master demo services if client has none
- **services** - Show master demo services if client has none
- **faq** - Show master demo FAQ if client has none
- **about** - Show master demo about if client has none
- **promotion** - Show master demo promotion if client has none
- **advantages** - Show master demo advantages if client has none
- **hero** - Show master demo hero if client has none

---

## Config Loading Flow

1. App starts → loads client config based on route slug
2. Config is set in ConfigContext Provider
3. BeautyTemplate.jsx reads config from ConfigContext
4. If no client config → fallback to MASTER_DEFAULTS
5. Each section reads from config with fallback to MASTER_DEFAULTS
6. Sections with no data hide (team, gallery, beforeAfter)
7. Sections with fallback show master demo data (reviews, services, etc.)

---

## Migration Checklist

When adding a new client:

- [ ] Create `data/generated-configs/<slug>.json`
- [ ] Create `public/clients/<slug>/` folder structure
- [ ] Add client assets to `public/clients/<slug>/`
- [ ] Update image paths in client config to reference client assets
- [ ] Test that client config loads correctly
- [ ] Test that fallback to MASTER_DEFAULTS works
- [ ] Test that sections hide correctly when empty
- [ ] Verify no cross-client data access

When updating master template:

- [ ] Update `src/templates/beauty-master/master.defaults.js`
- [ ] Update demo assets in `public/templates/beauty-master/`
- [ ] Test that existing clients still work (no breaking changes)
- [ ] Test that fallback logic works for new sections
- [ ] Update this documentation if architecture changes

---

## Summary

- **Master Template**: Immutable base code + demo assets
- **Client Config**: Overrides for specific salon
- **Client Assets**: Salon-specific media files
- **Fallback**: Client data → MASTER_DEFAULTS → hide
- **No Cross-Client Access**: Strict separation enforced
- **Always Shown**: Nav, Footer, booking, contacts
- **Hide If Empty**: team, gallery, beforeAfter
- **Fallback to Defaults**: reviews, services, faq, about, promotion, advantages, hero
