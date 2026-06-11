# UX Principles SKILL

## When to Use This Skill
Use when designing user flows, interaction patterns, or accessibility features.

## Core Knowledge

### Mobile-First Breakpoints
```css
/* Default: mobile */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1600px) { /* 4K: html{font-size:18px} */ }
@media (min-width: 2560px) { /* 4K: html{font-size:20px} */ }
@media (min-width: 3840px) { /* 4K: html{font-size:24px} */ }
```

### Touch Target Minimums
- Minimum touch target: 44x44px (Apple HIG) / 48x48dp (Material)
- Spacing between targets: 8px minimum
- Use `min-h-[44px] min-w-[44px]` in Tailwind

### Loading States
```typescript
// Skeleton screens > spinners
function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-white/5 rounded-lg h-48 mb-4" />
      <div className="bg-white/5 rounded h-4 w-3/4 mb-2" />
      <div className="bg-white/5 rounded h-4 w-1/2" />
    </div>
  );
}
```

### Error States
```typescript
// Human-readable error messages
const ERROR_MESSAGES = {
  NETWORK_ERROR: "Connection lost. Please check your internet.",
  NOT_FOUND: "We couldn't find what you're looking for.",
  UNAUTHORIZED: "Please log in to continue.",
  SERVER_ERROR: "Something went wrong. Please try again.",
};
```

### Empty States
```typescript
// Illustration + CTA
function EmptyState() {
  return (
    <div className="text-center py-12">
      <img src="/empty.svg" alt="" className="mx-auto w-48 mb-6" />
      <h3 className="text-white text-lg font-semibold mb-2">No items yet</h3>
      <p className="text-white/60 mb-6">Get started by creating your first item</p>
      <button className="btn-primary">Create Item</button>
    </div>
  );
}
```

### Accessibility
- ARIA labels on all interactive elements
- Contrast ratio: 4.5:1 minimum (text), 3:1 (large text)
- Focus rings: `focus:ring-2 focus:ring-indigo-500 focus:outline-none`
- Keyboard navigation: Tab order, Enter/Space activation
- Screen reader: `sr-only` class for hidden labels

### Performance Perception
- **Optimistic UI** — Update UI immediately, rollback on error
- **Instant feedback** — Button state changes on click, not on response
- **Progressive loading** → Load critical content first, lazy load rest
- **Skeleton screens** — Show structure while loading

## Common Pitfalls
1. **No loading state** — Users think app is broken
2. **Generic error messages** — "Error 500" is not helpful
3. **Missing empty states** — Blank screens confuse users
4. **Ignoring keyboard nav** — Not everyone uses a mouse
5. **Low contrast** — White/40 on dark is hard to read

## Verification Checklist
- [ ] All interactive elements have ARIA labels
- [ ] Contrast ratios meet WCAG AA
- [ ] Loading states for all async operations
- [ ] Error states with human-readable messages
- [ ] Empty states with CTAs
- [ ] Keyboard navigation works
