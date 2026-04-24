# Modular Website Framework

A premium, highly configurable website framework built with Next.js 14 and Tailwind CSS. This codebase allows you to deploy a professional, media-rich website for any service-based business by simply modifying a JSON configuration file.

## 🚀 Key Features

- **JSON-Driven Core**: Control business identity, branding, and contact details from `src/config/site-config.json`.
- **Modular Layouts**: Switch between different UI layouts for key sections (e.g., choose between "Stacked" or "HandOfCards" service sections).
- **Branding Engine**: Full control over color palettes, logos, and taglines directly via config.
- **Cloudinary Integration**: Dynamic image and video sourcing with local fallback support for high performance.
- **Ready-to-use Contact Form**: Integrated Web3Forms support with configurable recipient routing.
- **Luxe Aesthetics**: Modern UI with glassmorphism, ambient lava-lamp gradients, and smooth Framer Motion animations.

## 🛠️ Getting Started

### 1. Configure your site
Open [site-config.json](file:///Users/conleyprice/Documents/alpine/alpine_outdoor_living/src/config/site-config.json) and plug in your company information:

```json
{
  "business": {
    "name": "Your Company Name",
    "mission": "Your mission statement...",
    "location": "City, ST",
    ...
  },
  "branding": {
    "colors": {
      "primary": "#YOUR_COLOR",
      "secondary": "#YOUR_ACCENT"
    }
  },
  "ui": {
    "serviceSectionType": "Stacked", // "Stacked" or "HandOfCards"
    "hasServiceDetailPage": true
  }
}
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set up Media
The framework looks for images in `public/images` or your Cloudinary account. Update the `folder` references in your service definitions to match your media structure.

### 4. Development
```bash
npm run dev
```

## 📂 Project Structure

- `src/config/site-config.json`: The central source of truth for the website.
- `src/lib/config.ts`: Type-safe configuration bridge.
- `src/components/website/layouts/`: Contains interchangeable section layouts.
- `src/components/website/`: Main UI components.

## 📄 License
Custom Framework - Internal Use Only.
