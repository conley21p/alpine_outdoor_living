# Mobile Performance Optimization Report

**Branch:** `lincoln-land-exteriors`
**Site:** Lincoln Land Exteriors landing page
**Stack:** Next.js 14 (App Router) → static export (`output: 'export'`, `images.unoptimized: true`) → Cloudflare Pages
**Commits (chronological):** `5dc31d0`, `f63ad0c`, `d758fcf`, `3320804`

This report documents the mobile performance work done on the Lincoln Land
Exteriors site. The work was split into three rounds. Round 1 fixed the
high-impact, low-effort issues. Round 2 layered on modern image formats,
JS code splitting, and preload hints. Round 3 targeted **iOS Safari** for
the service-card deck (paint + gesture) and then made cards **fully opaque**
for readability and simpler paint paths.

---

## TL;DR

| Metric | Before | After |
|---|---|---|
| Total photo bytes shipped on home page (JPEG only) | ~50 MB | **~3.4 MB JPEG / ~2.2 MB AVIF** |
| Hero image bytes (mobile) | 6.2 MB JPEG | **~255 KB AVIF** |
| Page-level animated blurred layers on mobile | 9 (each ~80vw) | **0** |
| Glass cards using `backdrop-filter: blur()` on mobile | 5 | **0** |
| Route `/` JS (App Router stat) | 47.2 kB | **4.17 kB** |
| First Load JS | 149 kB | **106 kB** |
| Hero variants downloaded per device | 2 (mobile + desktop) | **1** (correct one only) |
| Hero LCP fetch starts | After CSS/JS parse | **From `<link rel="preload">` immediately** |
| Service card swipe on iOS Safari | Janky (paint + gesture arbitration) | **Smooth** — see Round 3 |
| Service card backgrounds | Semi-transparent + blur accents | **Fully opaque** gradients (Round 3) |

The single biggest win was image weight: the home page used to ship
roughly **50 MB of photos to a phone**. After two rounds of image work it
ships about **600 KB on a modern AVIF-capable phone**.

---

## Round 1 — Foundational fixes

### 1. Image source files

Photos in `public/lincoln-land-exteriors/` were untouched 6–10 MB camera
JPEGs (and one 9.5 MB PNG). Because the project uses static export with
`images: { unoptimized: true }`, Next.js cannot resize or recompress at
request time — the file on disk **is** the file the browser receives.

Action taken with macOS `sips`:

- **Hero pass** (Green House, Brick House): `-Z 1600 -s formatOptions 60`
- **Card/section pass**: `-Z 1280 -s formatOptions 58`
- **Owner portrait**: `-Z 800 -s formatOptions 65`
- **Soffit-and-Fascia.png** (9.5 MB) → converted to JPEG, reference in
  `src/lib/public-data.ts` updated.
- **Logo.png**: 202 KB → 64 KB (rendered at 40×40, no need for ~800px source).

Total photo footprint went from **~50 MB → ~3.4 MB** (~93% reduction).

### 2. Hero — only fetch one variant per device

Previously `ResponsiveSlotImage` rendered two `<Image>` components — one
mobile portrait, one desktop wide — and hid one with CSS. The browser
still downloaded **both**, so phones paid the desktop hero cost too.

Refactored to a single `<picture>` with a media-queried `<source>`:

```typescript
<picture>
  <source media="(min-width: 768px)" srcSet={wideUrl} />
  <img src={vertUrl} ... />
</picture>
```

The aspect-ratio container changes at the `md:` breakpoint via Tailwind
classes so the layout still adapts without rendering a second image.

Verified in the built `out/index.html`: the hero now contains exactly one
`<picture>` element. Mobile downloads only the portrait, desktop only the
widescreen.

Also dropped the `backdrop-blur-2xl` loading shimmer (which composited a
viewport-sized blurred copy of the page on every paint) in favor of a
plain opacity fade.

### 3. Page-level lava-lamp ambient layer

`src/app/page.tsx` had 9 large blurred (`blur-[140px]+`) elements rendered
on every device, each up to ~80vw wide. Compositing those layers per
scroll/resize frame was the dominant non-image render cost on phones.

Wrapped the entire layer in `hidden lg:block`. On mobile, replaced it
with a single cheap CSS `radial-gradient` that hits the same red/yellow
brand mood at near-zero paint cost. Also fixed an obvious typo
(`blur-[1200px]` → `blur-[200px]` on desktop).

### 4. Glass card backdrop-filter on mobile

`backdrop-filter: blur()` is one of the most expensive paint operations
on mobile because the GPU has to composite a blurred copy of everything
behind the element on every frame. The site uses the helper classes
`.glass-card`, `.glass-card-warm`, and `.glass-card-green` in several
places (contact form, owner card, etc.).

Updated `src/app/globals.css` so each variant gates its
`backdrop-blur-xl` behind the `lg:` breakpoint and uses a slightly more
opaque solid gradient on smaller screens. Visual difference is minimal,
performance gain is large.

Same treatment applied to the `Navbar` (sticky on every page) and the
mobile menu overlay/trigger.

### 5. Service card paint (initial pass)

Inside each card in `ServicesGrid.tsx`:

- A JS `isMobile` flag was driving how many lava blobs to render and
  whether to apply the desktop-only frosted overlay. That caused a
  post-hydration repaint as the client decided.
- Replaced with Tailwind responsive classes — the right version is
  rendered immediately on the server, no flicker.
- Reduced per-card blurred layers from **3 → 1** on mobile.

**Note:** Round 3 removed blur blobs and transparency on cards entirely
for mobile Safari and then site-wide opacity; see **Round 3** below.

### 6. Code-split `ContactForm`

The contact form lives below the fold and contains form state +
validation logic. New `ContactFormLazy.tsx` wraps it in `next/dynamic`:
the form HTML is still pre-rendered (good for SEO and immediate visual),
but its JS now ships in a separate chunk loaded after the main bundle.
While the chunk is loading, a shimmer skeleton occupies the same space.

### 7. Viewport / theme color

Added the `viewport` export to `src/app/layout.tsx` with the brand
`themeColor` so mobile browser chrome matches the site, and explicit
viewport meta values for safety.

---

## Round 2 — Modern formats + code splitting + preload

### 1. AVIF and WebP variants

Generated optimized variants for every photo. macOS `sips` only writes
AVIF; Homebrew `cwebp` writes WebP. Both encoded into the same folder so
existing JPEG paths still work as the universal fallback.

| Variant | Total size | vs JPEG |
|---|---|---|
| JPEG | 3,436 KB | baseline |
| WebP (q=78) | 2,416 KB | ~30% smaller |
| AVIF (q=58) | 2,208 KB | ~36% smaller |

Per-image hero example:

| Format | Bytes |
|---|---|
| Brick House (mobile portrait) JPEG | 410 KB |
| Brick House WebP | 275 KB |
| Brick House **AVIF** | **255 KB** |

### 2. `<picture>` wrapper component

New `src/components/website/PicturePhoto.tsx` is a small, server-friendly
component that takes a JPEG `src` and emits:

```html
<picture>
  <source type="image/avif" srcSet="...avif" />
  <source type="image/webp" srcSet="...webp" />
  <img src="...jpeg" loading="..." decoding="..." />
</picture>
```

Browsers walk `<source>` top-down and use the first format they support.
Used in:

- `ServicesGrid` — service card thumbnails.
- `app/page.tsx` — Owner Operated portrait, Team Photo.

The hero's `ResponsiveSlotImage` was extended with the same idea, plus
the existing per-viewport `<source media>` logic, producing a six-source
`<picture>` (desktop AVIF/WebP/JPEG + mobile AVIF/WebP/JPEG).

### 3. Code-split `ServicesGrid` (framer-motion)

Framer-motion was the largest single dependency on the page (~127 KB
chunk). Wrapping `ServicesGrid` in `next/dynamic` via
`ServicesGridLazy.tsx` keeps `ssr: true` (so the deck still pre-renders
into the static HTML — no LCP regression) but defers the framer-motion JS
to its own async chunk.

Bundle effect:

| | Before | After |
|---|---|---|
| Route `/` route-specific JS | 47.2 kB | **4.17 kB** |
| First Load JS | 149 kB | **106 kB** |

Verified the chunk shipping the deck (`chunks/247.*.js`, ~127 KB) is
**not** in the eagerly-loaded `<script>` set in `out/index.html`.

### 4. Hero preload hints

Added per-viewport `<link rel="preload" as="image" type="image/avif">`
tags to the home page so the browser starts the LCP fetch before CSS/JS
finishes parsing. The `type` attribute makes browsers without AVIF skip
the preload (they still get the WebP/JPEG via the hero `<picture>`).

```html
<link rel="preload" as="image" type="image/avif"
      href="/lincoln-land-exteriors/Green House New Roof Hero Image.avif"
      media="(min-width: 768px)" fetchPriority="high"/>
<link rel="preload" as="image" type="image/avif"
      href="/lincoln-land-exteriors/Brick House New Roof Street View.avif"
      media="(max-width: 767px)" fetchPriority="high"/>
```

These live in `app/page.tsx` (not the layout) so `/featured-projects`
doesn't fire a wasted preload. The preload-link tags are placed as a
sibling fragment outside `<SiteShell>` so they don't end up nested in
`<main>`.

---

## Round 3 — iOS Safari deck + opaque cards

After Round 1–2, the hand-of-cards swipe still felt laggy on **Mobile
Safari**. That was not “phones are too slow” — it was a stack of paint and
gesture behaviors iOS handles poorly when they move every frame.

### 1. Paint cost inside a transforming layer (`d758fcf`)

Safari tends to **re-rasterize** large layers when anything inside them
forces expensive repaints during `transform` updates (drag / spring).

Changes on **mobile (`< lg`)** for each `motion.div` card in **`d758fcf`**:

| Before | After |
|---|---|
| Radial `rgba(...)` gradient + heavy paint on the same layer as drag | **Radial only at `lg:`** — below `lg`, flat `bg-white/80` plus a cheap **linear tint** overlay (no `blur()` inside the moving card) |
| Large outer `box-shadow` | **Light** shadow (few px, low alpha) |
| `ring-1` + inset highlight | **Hidden** on mobile (`lg:` only) |
| One `blur-[24px]` “lava” blob inside the card | **Removed** on mobile — blur under a moving parent is a classic iOS jank source |
| `touch-action: pan-y` on the dragged card | **`touch-action: none`** on the center card so Safari does not arbitrate vertical scroll vs horizontal drag every frame |
| iOS long-press / image preview competing with drag | **`-webkit-touch-callout: none`**, **`-webkit-user-select: none`**, **`userSelect: none`** on the card; **`PicturePhoto` `noDrag`** → `draggable={false}` + pointer-events none on `<img>` |
| Autoplay `setInterval` could call `setIndex` mid-swipe | **`isDraggingRef`** — timer skips ticks while a drag is active |
| `resize` listener for mobile detection | **`matchMedia('(max-width: 1023px)')`** — fewer spurious updates |
| Mobile tween duration `0.35s` | **`0.28s`** + `backfaceVisibility: 'hidden'` for layer stability |

Desktop (`lg+`) still used the semi-transparent radial gradient, frosted
overlay, inner ring, and animated lava blobs until **`3320804`**.

### 2. Fully opaque cards (`3320804`)

Follow-up request: cards should **not** look transparent. **`d758fcf`**
mobile still used `bg-white/80` (20% see-through). Desktop still used
`rgba(...)` gradient stops and a frosted `backdrop-blur` stack.

- **Mobile:** `bg-gradient-to-br from-[#fbe9ea] to-white` — fully opaque
  warm wash → white.
- **Desktop:** solid radial `rgb(234,174,179)` → white (same perceived
  tint as the old semi-transparent stops blended over white).
- **Removed:** frosted `backdrop-blur-3xl` overlay on cards, all three
  lava-lamp blobs, and the extra mobile tint overlay.
- **Kept (desktop only):** subtle inner highlight ring for a lifted-card
  bevel.

Result: cards read as solid panels (no see-through to the page behind),
fewer composited layers, and slightly less paint work on desktop too.

---

## File-by-file change log

### Changed
- `public/lincoln-land-exteriors/*.jpeg` / `*.JPG` — recompressed/resized.
- `public/lincoln-land-exteriors/Soffit-and-Fascia.png` → `.jpeg`.
- `public/Logo.png` — resized 202 KB → 64 KB.
- `src/lib/public-data.ts` — Soffit reference updated to `.jpeg`.
- `src/app/globals.css` — `glass-card*` classes gate `backdrop-filter`
  behind `lg:`.
- `src/app/layout.tsx` — explicit `viewport` export with `themeColor`.
- `src/app/page.tsx` — replaced ambient layer for mobile, dropped heavy
  blurs from inline glass surfaces, switched to `ServicesGridLazy` and
  `ContactFormLazy`, switched portraits to `PicturePhoto`, added hero
  preload `<link>` tags.
- `src/components/website/Navbar.tsx` — removed `backdrop-blur-xl` on
  mobile (sticky bar + mobile menu overlay + floating trigger).
- `src/components/website/ResponsiveSlotImage.tsx` — single `<picture>`
  with AVIF/WebP/JPEG sources per breakpoint; lightweight loader.
- `src/components/website/ServicesGrid.tsx` — `PicturePhoto` for card
  thumbnails; blob count CSS-gated rather than JS-gated; exported
  `ServicesGridProps`. **Round 3:** iOS swipe paint/gesture fixes; then
  opaque gradients, removal of card-level `backdrop-blur` and lava blobs.
- `src/components/website/PicturePhoto.tsx` — **Round 3:** optional
  `noDrag` prop for images inside the swipe deck (Safari long-press).

### Added
- `public/lincoln-land-exteriors/*.avif` (10 files)
- `public/lincoln-land-exteriors/*.webp` (10 files)
- `src/components/website/PicturePhoto.tsx`
- `src/components/website/ContactFormLazy.tsx`
- `src/components/website/ServicesGridLazy.tsx`

---

## Verification

All checks pass on the final state:

- `npm run lint` — clean.
- `npx tsc --noEmit` — clean.
- `npm run build` — successful, route table:

```
Route (app)                              Size     First Load JS
┌ ○ /                                    4.17 kB         106 kB
├ ○ /_not-found                          875 B          88.4 kB
├ ○ /featured-projects                   16.3 kB         119 kB
└ ○ /icon.png                            0 B                0 B
+ First Load JS shared by all            87.5 kB
```

HTML output spot checks (against `out/index.html`):

- 6 unique AVIF references / 6 WebP / 7 JPEG (the extra JPEG is bundled
  hydration JSON for non-initially-rendered cards, not a real fetch).
- Hero `<picture>` contains the full AVIF → WebP → JPEG fallback chain
  for both desktop and mobile.
- Two `<link rel="preload" type="image/avif">` tags target the correct
  per-viewport hero variant with `fetchPriority="high"`.
- Eagerly-loaded `<script>` set does **not** include the framer-motion
  chunk or the contact-form chunk.

---

## Why each change matters (quick reference)

| Change | Symptom it fixes |
|---|---|
| Image recompression / resize | "Photos taking forever to show up on phone" |
| AVIF + WebP variants | "Page still feels heavy on slower connections" |
| Single `<picture>` for hero | Phones were silently downloading the desktop hero too |
| `<link rel="preload">` for hero AVIF | LCP fetch was blocked behind CSS/JS parse |
| Hide page-level lava blobs on mobile | "Page is laggy when scrolling" |
| Disable `backdrop-filter` on mobile | "Scrolling stutters near the contact form / nav" |
| CSS-gated blob count in service cards | Hand-of-cards animation was dropping frames |
| Round 3: lighter mobile card paint + `touch-action: none` + no long-press on images | "Swipe still janky on iPhone Safari" |
| Round 3: opaque card surfaces (no rgba glass stack) | "Cards look too transparent" + fewer layers to composite |
| Code-split `ServicesGrid` (framer-motion) | "Time-to-interactive feels slow" |
| Code-split `ContactForm` | Same — JS budget bloat from below-the-fold code |
| Resized Logo.png | Eager priority logo was 202 KB for a 40×40 render |
| `viewport` + `themeColor` | Mobile browser chrome / pinch-zoom defaults |

---

## Possible future work

These were intentionally **not** done (or deferred) but remain candidates:

- **Native pointer events + `translate3d` on mobile** — Framer Motion’s
  drag path is fine after Round 3; if a future iOS version regresses, a
  50-line hand-rolled carousel on `< lg` only would be the nuclear option.
- **Responsive `srcset` per format** — currently each format has one
  fixed-resolution variant. Generating ~640w / ~1024w / ~1600w sizes per
  format and using `srcset`/`sizes` would let phones download even
  smaller-resolution AVIFs.
- **Self-host fonts** — the site currently relies on system fonts
  (Inter family with `-apple-system` fallback). If a custom webfont is
  ever added, it should be self-hosted with `font-display: swap` and
  preloaded.
- **Lighthouse run on mobile profile** — would give a concrete number to
  ship to the customer once the site is live on the production domain.
- **Service Worker / cache-first for photos** — would make repeat visits
  near-instant. Worthwhile if Cloudflare's edge cache isn't deemed
  enough.
- **`content-visibility: auto`** on far-below-the-fold sections (Facebook
  CTA, Footer) — small additional render-time savings.
