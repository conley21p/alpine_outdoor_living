/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "var(--brand-primary)",
          secondary: "var(--brand-secondary)",
          textLight: "var(--brand-text-light)",
          textDark: "var(--brand-text-dark)",
          bgLight: "var(--brand-bg-light)",
        },
      },
      boxShadow: {
        card: "0 10px 25px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};
