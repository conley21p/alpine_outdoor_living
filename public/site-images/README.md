# Website Image Slots (Desktop + Mobile)

This folder provides a simple upload convention for replacing website section images.

## Rules

- **Desktop images** go in `desktop/` folders.
- **Mobile images** go in `mobile/` folders.
- **Mobile images should be vertical** (portrait orientation).
- Keep the filename as `default.jpg` unless you also update code references.

## Slot Directory Map

- `home-hero/desktop/default.jpg`
- `home-hero/mobile/default.jpg` *(vertical)*
- `services-hero/desktop/default.jpg`
- `services-hero/mobile/default.jpg` *(vertical)*
- `gallery-hero/desktop/default.jpg`
- `gallery-hero/mobile/default.jpg` *(vertical)*
- `contact-hero/desktop/default.jpg`
- `contact-hero/mobile/default.jpg` *(vertical)*
- `reviews-hero/desktop/default.jpg`
- `reviews-hero/mobile/default.jpg` *(vertical)*

## Recommended Sizes

- Desktop hero images: `2400 x 1200` (landscape)
- Mobile hero images: `1080 x 1350` or `1080 x 1440` (portrait)

## How It Works

`src/lib/site-images.ts` maps each page section to these file paths.
The responsive component automatically serves mobile images on small screens
and desktop images on larger screens.
