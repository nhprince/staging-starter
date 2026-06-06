/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#0a0a0f",
        "bg-secondary": "#12121a",
        "accent-indigo": "#6366f1",
        "accent-purple": "#8b5cf6",
        "accent-cyan": "#22d3ee",
        "accent-green": "#34d399",
      },
    },
  },
  plugins: [],
};
