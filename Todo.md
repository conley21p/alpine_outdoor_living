# Go-Live Checklist — Springfield Bathroom Remodel

Everything below is stubbed in the code and needs the real value before launch.

## Business details (`src/lib/config.ts`)
- [ ] `businessPhone` — replace the placeholder `(217) 555-0142`; it renders as a live `tel:` link
- [ ] `siteUrl` / `defaultDomain` — confirm `springfieldbathremodel.com` is live
- [ ] `serviceArea` — confirm the towns listed are the ones actually served

## Lead capture
- [ ] Create a Web3Forms key for Kirk@springfieldbathremodel.com and set `web3formsAccessKey`
      (until then the form asks visitors to call instead of dropping the lead)
- [ ] Send a test submission and confirm it lands in the inbox

## Brand assets
- [ ] Add a logo to `public/`, swap the navbar wordmark, and wire `icons` +
      an OG image back into `src/app/layout.tsx`
- [ ] Add hero photography under `public/fallback/Website/Hero/` and return it
      from `getHeroPair()` in `src/lib/public-data.ts`
- [ ] Add per-package project photos to each package's `media` array

## Content review
- [ ] Confirm the four package price ranges and timelines are current
- [ ] Confirm licensing/insurance claim in the home page trust row
- [ ] Add real customer reviews via `getPublishedReviews()` once available
