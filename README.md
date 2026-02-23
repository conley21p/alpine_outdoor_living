# OpenClaw Base Platform

Reusable base template for local business deployments with:

- Public website (home/services/gallery/contact/reviews)
- Supabase PostgreSQL backend
- CRM dashboard at `/admin`
- Agent API under `/api/agent/*`
- Email queue + payment approval flow

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS with CSS variable branding
- Supabase (Postgres, Auth, Storage)
- Nodemailer / Resend email providers
- Optional Google Calendar + Twilio integrations

## Quick Start

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Then open `http://localhost:3000`.

## Project Structure

```text
.
├── .env.local.example
├── next.config.js
├── tailwind.config.js
├── supabase/
│   ├── schema.sql
│   └── seed.sql
├── public/
│   ├── logo.png
│   ├── favicon.ico
│   └── og-image.jpg
└── src/
    ├── app/
    │   ├── page.tsx
    │   ├── services/page.tsx
    │   ├── gallery/page.tsx
    │   ├── contact/page.tsx
    │   ├── reviews/page.tsx
    │   ├── admin/...
    │   └── api/...
    ├── components/
    ├── lib/
    └── types/index.ts
```

## Responsive Support (Desktop to Phone)

The public website is implemented mobile-first and scales through standard breakpoints:

- Mobile-first layouts (`px-4`, stacked sections, vertical flow)
- Tablet/desktop expansion via `sm`, `md`, `lg` grid breakpoints
- Responsive navigation with hamburger menu on small screens
- Overflow-safe data tables in CRM via horizontal scrolling containers
- Responsive image handling using separate desktop and mobile hero assets

If you run `npm run dev`, you can verify across viewports in browser dev tools (iPhone, iPad, laptop, widescreen).

## Image Upload Setup (Desktop + Mobile)

A straightforward image slot convention is included under `public/site-images/`.

### Folder Pattern

Each page hero has two folders:

- `desktop/` → wide landscape images
- `mobile/` → vertical portrait images (expected)

Current slots:

- `public/site-images/home-hero/desktop/default.jpg`
- `public/site-images/home-hero/mobile/default.jpg`
- `public/site-images/services-hero/desktop/default.jpg`
- `public/site-images/services-hero/mobile/default.jpg`
- `public/site-images/gallery-hero/desktop/default.jpg`
- `public/site-images/gallery-hero/mobile/default.jpg`
- `public/site-images/contact-hero/desktop/default.jpg`
- `public/site-images/contact-hero/mobile/default.jpg`
- `public/site-images/reviews-hero/desktop/default.jpg`
- `public/site-images/reviews-hero/mobile/default.jpg`

### Replace Process

1. Open the slot folder for the section you want to change.
2. Replace `default.jpg` in `desktop/` with your desktop image.
3. Replace `default.jpg` in `mobile/` with a **vertical** mobile image.
4. Keep the file name as `default.jpg` (no code changes needed).
5. Refresh the page and test on mobile + desktop viewports.

### Recommended Sizes

- Desktop hero images: `2400 x 1200` (landscape)
- Mobile hero images: `1080 x 1350` or `1080 x 1440` (portrait)

Slot mappings are defined in `src/lib/site-images.ts`, and rendered with responsive components in `src/components/website/ResponsiveSlotImage.tsx`.

## Environment

All client-specific values come from `.env.local`.  
Never hardcode business name, phone, branding, or credentials in source.

Copy `.env.local.example` and configure:

- Business identity (`NEXT_PUBLIC_BUSINESS_*`)
- Branding (`NEXT_PUBLIC_BRAND_*`)
- Domain (`NEXT_PUBLIC_SITE_URL`, `NEXTAUTH_URL`)
- Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
- Email provider (`EMAIL_PROVIDER` + corresponding provider vars)
- Agent API key (`OPENCLAW_AGENT_API_KEY`)
- Admin settings (`ADMIN_EMAIL`, `NEXTAUTH_SECRET`)
- Payment + optional Twilio + optional Google Calendar

## Supabase Setup

1. Create a Supabase project
2. Run `supabase/schema.sql` in SQL editor
3. Optionally run `supabase/seed.sql`
4. Ensure Storage bucket `gallery` exists and is public
5. Invite the business owner in Supabase Auth

## API Routes

### Public

- `POST /api/contact`

### Agent (requires `x-agent-key`)

- `GET/POST /api/agent/contacts`
- `GET/POST/PATCH /api/agent/leads`
- `GET/POST/PATCH /api/agent/appointments`
- `GET/POST/PATCH /api/agent/jobs`
- `POST /api/agent/emails`
- `POST /api/agent/payments`
- `POST /api/agent/log`

### Payment Approval Webhook

- `GET /api/webhooks/payment-approval?token=...&action=approve|deny`

## CRM Routes

- `/admin` dashboard
- `/admin/login`
- `/admin/leads`
- `/admin/contacts`
- `/admin/appointments`
- `/admin/jobs`
- `/admin/employees`
- `/admin/emails`
- `/admin/payments`
- `/admin/agent-log`

## Email Templates

Implemented in `src/lib/email.ts`:

- `newLeadNotificationTemplate`
- `leadAutoResponseTemplate`
- `appointmentConfirmationTemplate`
- `appointmentReminderTemplate`
- `paymentApprovalRequestTemplate`

## Deployment (Vercel)

1. Push repository to GitHub
2. Import into Vercel
3. Add all environment variables
4. Deploy and smoke test:
   - contact form
   - admin login
   - agent routes with `x-agent-key`
   - payment approval flow
