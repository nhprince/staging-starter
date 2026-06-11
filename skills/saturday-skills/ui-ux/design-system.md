# Design System SKILL

## When to Use This Skill
Use when building UI components, establishing design tokens, or implementing Prince's visual standards.

## Core Knowledge

### Prince's UI Standards (Codified)

**Colors:**
- Background: `#0a0a0f` (near-black)
- Card glass: `backdrop-blur-xl bg-white/5 border border-white/10`
- Accent gradient: `from-indigo-500 to-purple-500`
- Text primary: `text-white`
- Text secondary: `text-white/70`
- Text muted: `text-white/40`

**Typography:**
- Font: Inter (400/500/600/700 weights)
- Headings: `clamp(2rem, 5vw, 4rem)` for responsive scaling
- Body: `text-sm md:text-base` for mobile-first

**Micro-animations:**
- Hover lift: `hover:-translate-y-0.5 transition-all duration-200`
- Glow: `hover:shadow-lg hover:shadow-indigo-500/25`
- Staggered entrance: `animation-delay: calc(var(--i) * 100ms)`

**Spacing:**
- Section padding: `py-6 md:py-10 lg:py-16`
- Container: `max-w-[90rem] px-3 md:px-8 xl:px-12 mx-auto`
- Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`

### 21st.dev Component Integration
```bash
# Browse components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
```
- Components are copy-paste, fully customizable
- Works with shadcn/ui + Tailwind
- https://21st.dev for browsing

### shadcn/ui Dark Theme Config
```css
@layer base {
  .dark {
    --background: 240 10% 4%;
    --foreground: 0 0% 100%;
    --card: 240 10% 6%;
    --card-foreground: 0 0% 100%;
    --primary: 239 84% 67%;
    --primary-foreground: 0 0% 100%;
    --secondary: 258 90% 66%;
    --muted: 240 5% 15%;
    --accent: 258 90% 66%;
    --border: 240 5% 15%;
  }
}
```

### Aceternity UI (Animated Components)
```bash
npx aceternity-ui@latest init
```
- Stunning animated components (spotlight, beams, grid)
- Works with Tailwind + Framer Motion
- Free and open-source

### Magic UI (Free Stunning Effects)
```bash
npx magic-ui@latest init
```
- Border beams, shimmer buttons, animated gradients
- Copy-paste components

## Common Pitfalls
1. **Inconsistent spacing** — Use the spacing scale consistently
2. **Too many fonts** — Stick to Inter + one accent font max
3. **Overusing animations** — Subtle > flashy
4. **Ignoring dark mode** — Always design for both modes

## Verification Checklist
- [ ] Color tokens defined in Tailwind config
- [ ] Dark mode works correctly
- [ ] Components use glassmorphism pattern
- [ ] Responsive at all breakpoints
- [ ] Animations are subtle and purposeful
