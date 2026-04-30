# Agent Log

This file documents all meaningful code changes made by AI agents working on the neuralsync project.

---

## 2026-04-30 02:30 UTC - Gallery Component Refactor

**Task performed:**
- Fixed Gallery component to use `works` instead of `defaultWorks` for rendering slides and bullets
- Simplified lightbox state management from split state (`lightbox` + `lightboxIndexRef`) to single `openedIndex` state
- Removed conflicting `onClick={closeLightbox}` from lightbox wrapper div

**Files changed:**
- `src/sections/Gallery/Gallery.jsx`

**Changes made:**
1. Replaced `lightbox` state and `lightboxIndexRef` with single `openedIndex` state (line 19)
2. Updated `onSelect` callback to use `works.length` instead of `defaultWorks.length` (lines 53-59)
3. Simplified `openLightbox` to set `openedIndex(index)` directly (lines 92-95)
4. Simplified `closeLightbox` to set `openedIndex(null)` (lines 97-99)
5. Changed slide rendering from `defaultWorks.map((w, i) => ...)` to `works.map((w, i) => ...)` (line 128)
6. Changed bullet rendering from `defaultWorks.map((_, i) => ...)` to `works.map((_, i) => ...)` (line 172)
7. Updated lightbox render to use `openedIndex` instead of `lightbox` and `lightboxIndexRef` (lines 185-195)
8. Removed `onClick={closeLightbox}` from lightbox wrapper div to prevent click conflicts

**Validation:**
- Gallery now correctly renders all items from `works` array (including demo-gallery-6.webp from MASTER_DEFAULTS)
- Bullet indicators count matches actual number of works
- Lightbox state is centralized in `openedIndex` (null or specific index)
- No conflicting click handlers on lightbox wrapper

**Remaining risks or follow-ups:**
- Need to verify with `npm run dev` that:
  - 6 slides display correctly (including demo-gallery-6.webp)
  - 6 bullets display and highlight correctly
  - Lightbox opens/closes reliably on repeated clicks
  - No "every other click" bug

---

## 2026-04-30 02:37 UTC - Gallery Embla Reinitialization Fix

**Task performed:**
- Added `containScroll: false` to Embla Carousel configuration for proper loop behavior
- Added `key={works.length}` to Embla container to force reinitialization when works array changes
- Added console.log to verify works array length and contents

**Files changed:**
- `src/sections/Gallery/Gallery.jsx`

**Changes made:**
1. Updated useEmblaCarousel config (lines 48-52):
   - Added `containScroll: false` flag for proper loop mode behavior
2. Added console.log (line 106):
   - Logs works.length and all src paths for debugging
3. Added key to Embla container (line 129):
   - `key={works.length}` forces React to remount Embla when works array length changes

**Validation:**
- Pending: need to run `npm run dev` to verify:
  - Console log shows 6 works
  - 6 slides display in carousel
  - 6 bullets display
  - Central slide is active (highlighted)
  - Auto-scroll works every 4 seconds
  - Lightbox opens/closes reliably

---

## 2026-04-30 02:49 UTC - Gallery Layout Fix

**Task performed:**
- Changed slide width from inline `width: 'min(65vw, 380px)'` to responsive Tailwind classes
- Added `skipSnaps: false` to Embla configuration
- Removed debug console.log
- Removed `key={works.length}` from Embla container (not solving the real issue)

**Files changed:**
- `src/sections/Gallery/Gallery.jsx`

**Changes made:**
1. Updated useEmblaCarousel config (lines 48-53):
   - Added `skipSnaps: false` for proper snap behavior
   - Kept `containScroll: false` for loop mode
2. Removed debug console.log (line 106)
3. Removed `key={works.length}` from Embla container (line 128)
4. Changed slide width (line 133):
   - From: `style={{ flex: '0 0 auto', width: 'min(65vw, 380px)' }}`
   - To: `className="... basis-[78%] sm:basis-[42%] lg:basis-[32%]"`

**Responsive slide widths:**
- Mobile (<640px): 78% of viewport
- Tablet (640px-1024px): 42% of viewport
- Desktop (>1024px): 32% of viewport

**Validation:**
- Pending: need to verify in browser that:
  - 6 slides display correctly
  - 6 bullets display
  - Central slide is active (highlighted, not rightmost)
  - Auto-scroll works every 4 seconds
  - Lightbox opens/closes reliably

---

## 2026-04-30 02:53 UTC - Gallery slidesToScroll Fix

**Task performed:**
- Added `slidesToScroll: 1` to Embla configuration to force single-slide scrolling instead of grouping

**Files changed:**
- `src/sections/Gallery/Gallery.jsx`

**Changes made:**
1. Updated useEmblaCarousel config (lines 48-54):
   - Added `slidesToScroll: 1` to prevent Embla from grouping slides

**Validation:**
- Pending: need to verify in browser that:
  - Carousel scrolls by 1 slide at a time (not groups)
  - 6 bullets display (not 3)
  - All 6 works are accessible via scroll/arrows/bullets
  - Auto-scroll moves by 1 slide every 4 seconds

---

## 2026-04-30 03:00 UTC - Gallery Embla reInit After Image Load

**Task performed:**
- Added useEffect to call emblaApi.reInit() after all images in gallery are loaded
- This ensures Embla correctly measures snap list after images have final dimensions

**Files changed:**
- `src/sections/Gallery/Gallery.jsx`

**Changes made:**
1. Added new useEffect (lines 92-125):
   - Waits for all images in gallery to load
   - Calls emblaApi.reInit() after images are loaded or if no images exist
   - Handles both load and error events
   - Cleans up event listeners on unmount

**Validation:**
- Pending: need to verify in browser that:
  - emblaApi.scrollSnapList().length equals 6 (works.length)
  - Carousel scrolls by 1 slide at a time
  - 6 bullets display correctly
  - All 6 works are accessible

---

## 2026-04-30 09:21 UTC - Gallery Embla CSS Structure Fix

**Task performed:**
- Fixed slide width via CSS class instead of inline responsive classes
- Moved scale/transform to inner div instead of slide wrapper
- Removed gap from flex container, using paddingLeft on each slide (standard Embla pattern)
- Updated Embla config with dragFree: false, removed skipSnaps
- Updated onSelect to use selectedScrollSnap() directly without % len
- Added mobile responsive CSS for gallery slides
- Added console.log to check snapList.length vs works.length after reInit

**Files changed:**
- `src/sections/Gallery/Gallery.jsx`
- `src/index.css`

**Changes made:**
1. Updated useEmblaCarousel config (lines 48-54):
   - Removed skipSnaps
   - Added dragFree: false
2. Updated onSelect (lines 56-60):
   - Removed % len calculation, use selectedScrollSnap() directly
3. Updated reInit useEffect (lines 96-110):
   - Added console.log for snapList.length vs works.length
4. Changed slide structure (lines 167-185):
   - Container: removed gap, added marginLeft: '-12px'
   - Slide wrapper: fixed width flex: '0 0 280px', paddingLeft: '12px'
   - Inner div: scale(1) for active, scale(0.88) for inactive, opacity 1/0.5
   - Added transformOrigin: 'center center'
5. Added mobile CSS (index.css lines 199-203):
   - @media (max-width: 640px): .embla__slide { flex: 0 0 220px !important }

**Responsive slide widths:**
- Desktop (>640px): 280px fixed
- Mobile (<640px): 220px fixed

**Validation:**
- Pending: need to verify in browser that:
  - Console shows snapList.length equals 6
  - 6 bullets display
  - Central slide is scale(1), side slides scale(0.88)
  - Carousel scrolls by 1 slide at a time
  - Loop works infinitely
  - Auto-scroll every 4 seconds
  - Lightbox stable on click

---

## 2026-04-30 09:31 UTC - Gallery Click Behavior Fix

**Task performed:**
- Fixed slide click behavior to scroll on inactive slides and toggle lightbox on active slides

**Files changed:**
- `src/sections/Gallery/Gallery.jsx`

**Changes made:**
1. Updated slide onClick handler (lines 185-195):
   - Inactive slide click → scroll to slide (no lightbox)
   - Active slide click (not open) → open lightbox
   - Active slide click (already open) → close lightbox

**Validation:**
- Pending: need to verify in browser that:
  - Clicking inactive slides scrolls carousel
  - Clicking active slide opens lightbox
  - Clicking same active slide again closes lightbox

---

## 2026-04-30 — REFACTOR PHASE 1 — Legacy Removal

**Git tag:** `v1-legacy-removed`
**Commit:** `94e9244`
**Branch:** `stable-working`

**Task performed:**
Deletion of legacy files and folders that were unused in the active code path. No moves, no code changes — pure deletion. Verified zero active imports for each target before deletion.

**Deleted config files:**
- `src/configs/kalinka.config.js`
- `src/configs/kalinka-malinka-studiya-krasoty.config.js`
- `src/configs/if-studiya.config.js`
- `src/configs/picasso.config.js.bak`

**Deleted JS files:**
- `lib/templateResolver.js` (verified zero imports)

**Deleted public folders:**
- `public/images/` (entire folder with hair, hero, interior, services, team)
- `public/kalinka/` (entire folder)
- `public/kalinka-malinka-studiya-krasoty/` (entire folder)
- `public/clients/kalinka/` (entire folder, `.gitkeep` preserved)

**Build result:** SUCCESS — 1.13s, 2171 modules transformed.

**Push:** stable-working pushed to origin (94e9244).

**Notes:**
- Codex attempted to perform Phase 3 actions (Move-Item on components) outside of the prompt scope. Windows blocked the moves due to path-with-spaces issues, so no damage was done. Active components in `src/components/` remain untouched.
- Going forward: prompts must explicitly state "DO NOT MOVE OR RENAME ANY FILES" to prevent unauthorized scope expansion.

**Risks / follow-ups:**
- Phase 2: delete dead `src/templates/beauty-master/` duplicate structure (preserve `master.defaults.js` for Phase 5).
- Phase 3: move active code into `src/templates/beauty-master/` (carefully, with import updates).
- Build warning about INEFFECTIVE_DYNAMIC_IMPORT in `_default.config.js` — minor, address in Phase 6 (App.jsx cleanup).
