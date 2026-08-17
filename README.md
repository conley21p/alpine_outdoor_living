# Springfield Bathroom Remodel — Static Website

A static Next.js website for Springfield Bathroom Remodel, covering senior-safe
bathroom remodel services and pricing in Springfield, IL.

## Features

- **Single-page layout**: hero, about, free in-home safety assessment, a swipeable
  package deck, full packages & pricing, and a lead form.
- **Package data in one place**: all four remodel packages (price, timeline,
  inclusions, "best for") live in `src/lib/public-data.ts`.
- **Photo-optional**: the hero and service cards fall back to brand-gradient and
  text-only treatments until real project photography is added, so nothing ships
  with placeholder imagery.
- **Contact Form**: integrated with **Web3Forms** for direct email notifications
  without a backend database.

## Before going live

Business contact details, the phone number, and the Web3Forms key are all set in
`src/lib/config.ts`. Still outstanding:

- `siteUrl` / `defaultDomain` — confirm `springfieldbathremodel.com` is the live
  domain.
- Send a test form submission and confirm it reaches the inbox.
- Logo artwork — `public/` has no logo; the navbar renders a text wordmark and
  `src/app/layout.tsx` has no favicon or OG image wired up.
- Project photos — add hero images under `public/fallback/Website/Hero/` and point
  `getHeroPair()` at them; add per-package photos to each package's `media` array.

## Technology Stack

- **Framework**: Next.js 14 (App Router), static export (`output: 'export'`)
- **Styling**: Tailwind CSS
- **Submission**: Web3Forms (public key integration)

## Project Structure

```text
.
├── public/                 # Static assets
│   └── fallback/Website/   # Hero and project photography
└── src/
    ├── app/                # Next.js pages and layouts
    ├── components/         # Reusable UI components
    └── lib/                # Site config, package data, utilities
```

## Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Development Mode**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build     # emits the static site to out/
   npx serve out     # "next start" does not work with output: 'export'
   ```

## Development Guidelines

- **Editing packages**: change `REMODEL_PACKAGES` in `src/lib/public-data.ts`. The
  service deck, the pricing grid, and the contact form dropdown all read from it
  (the dropdown list is `servicesOffered` in `src/lib/config.ts`).
- **Adding Hero Images**: drop wide and vertical variants under
  `public/fallback/Website/Hero/` and return their paths from `getHeroPair()`. The
  hero automatically switches from the gradient fallback to the photo treatment.
- **Branding**: colors are managed via `tailwind.config.js` and the CSS variables
  emitted from `publicConfig` in `src/app/layout.tsx`.
