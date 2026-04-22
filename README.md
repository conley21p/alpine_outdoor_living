# KML Seamless Gutters - Static Website

A premium, static Next.js website for KML Seamless Gutters, showcasing expert gutter, soffit, fascia, and siding solutions.

## Features

- **Responsive Design**: Mobile-first layout optimized for all devices.
- **Dynamic Hero Images**: Automatic switching between vertical and wide hero images based on screen size.
- **Service Showcase**: Detailed grid of services and outdoor offerings.
- **Gallery**: Photo gallery populated from local static assets.
- **Contact Form**: Integrated with **Web3Forms** for direct email notifications without a backend database.

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Submission**: Web3Forms (Public Key Integration)
- **Host**: Vercel (Recommended)

## Project Structure

```text
.
├── public/                 # Static assets (images, icons)
│   └── images/
│       ├── hero/           # Hero images (wide/vert folders)
│       └── gallery/        # Gallery source images
└── src/
    ├── app/                # Next.js pages and layouts
    ├── components/         # Reusable UI components
    └── lib/                # Shared utilities and site config
```

## Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Create a `.env.local` file with your site metadata:
   ```text
   NEXT_PUBLIC_BUSINESS_NAME="KML Seamless Gutters"
   NEXT_PUBLIC_SITE_URL="your-site-url.com"
   ```

3. **Development Mode**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

## Development Guidelines

- **Adding Hero Images**: Place vertical versions in `public/images/hero/vert/` and wide versions in `public/images/hero/wide/`.
- **Updating Gallery**: Simply add or remove images from `public/images/gallery/`. The page will update automatically on next build.
- **Branding**: Colors and fonts are managed via tailwind.config.js and CSS variables in `src/app/globals.css`.
