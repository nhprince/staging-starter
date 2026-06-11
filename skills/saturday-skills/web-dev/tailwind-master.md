# Tailwind Master SKILL

## When to Use This Skill
Use when styling with Tailwind CSS, configuring themes, or building component patterns.

## Core Knowledge

### Prince's UI Standards (Codified)
```css
/* Background: #0a0a0f */
/* Cards: glassmorphism */
backdrop-blur-xl bg-white/5 border border-white/10

/* Accent gradient */
from-indigo-500 to-purple-500

/* Text hierarchy */
text-white          /* Primary text */
text-white/70       /* Secondary text */
text-white/40       /* Muted text */

/* Micro-animations */
hover:-translate-y-0.5 transition-all duration-200

/* Font: Inter, 400/500/600/700 weights */
font-family: 'Inter', sans-serif;
```

### Custom Theme Config (Tailwind v3)
```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0f",
        primary: "#6366f1",
        secondary: "#8b5cf6",
        accent: "#a78bfa",
      },
      fontFamily: { sans: ["Inter", "sans-serif"] },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { transform: "translateY(10px)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
        glow: { "0%": { boxShadow: "0 0 20px rgba(99,102,241,0.3)" }, "100%": { boxShadow: "0 0 40px rgba(139,92,246,0.4)" } },
      },
      backdropBlur: { xs: "2px" },
    },
  },
  plugins: [],
};
```

### Responsive Variants
```html
<!-- Mobile-first: 1→2→3→4 cols -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

<!-- Container -->
<div class="max-w-[90rem] px-3 md:px-8 xl:px-12 mx-auto">

<!-- Hero height -->
<div class="min-h-[calc(100vh-5.5rem)] lg:min-h-[85vh]">

<!-- Spacing -->
<section class="py-6 md:py-10 lg:py-16">
```

### Dark Mode Strategy
```javascript
// tailwind.config.js
module.exports = {
  darkMode: "class", // or "media" for system preference
  // ...
};
```
```html
<html class="dark">
  <body class="bg-white dark:bg-bg">
```

### Glassmorphism Pattern
```html
<div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
  <h2 class="text-white text-xl font-semibold">Card Title</h2>
  <p class="text-white/70 mt-2">Card content with muted text</p>
</div>
```

### Component Class Extraction (@apply)
```css
@layer components {
  .btn-primary {
    @apply px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-indigo-500 to-purple-500 
           text-white font-semibold rounded-full hover:-translate-y-0.5 
           transition-all duration-200 shadow-lg hover:shadow-indigo-500/25;
  }
  
  .card-glass {
    @apply backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6;
  }
  
  .text-gradient {
    @apply bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent;
  }
}
```

### 21st.dev Component Integration
- Browse at https://21st.dev
- Install: `npx shadcn-ui@latest add [component]`
- Components are copy-paste, fully customizable
- Works with shadcn/ui + Tailwind

### shadcn/ui Dark Theme
```bash
npx shadcn-ui@latest init
# Select: Default, Slate, CSS variables
```
```css
.dark {
  --background: 240 10% 4%;
  --foreground: 0 0% 100%;
  --card: 240 10% 6%;
  --primary: 239 84% 67%;
  --secondary: 258 90% 66%;
}
```

### Common Pitfalls
1. **PurgeCSS removing styles** — Use `safelist` for dynamic classes
2. **Too many custom utilities** — Prefer component extraction with @apply
3. **Not using JIT mode** — Enabled by default in v3+
4. **Overusing arbitrary values** — Add to theme config instead
5. **Missing dark mode variants** — Always test both modes

## Verification Checklist
- [ ] Tailwind config extends theme (doesn't override defaults)
- [ ] Dark mode works correctly
- [ ] Responsive breakpoints match design (sm/md/lg/xl)
- [ ] Glassmorphism effects render correctly
- [ ] Custom animations defined in config
