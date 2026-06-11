# React Expert SKILL

## When to Use This Skill
Use when building React components, managing state, or optimizing React performance.

## Core Knowledge

### Hooks Deep Dive
- `useState` — local component state
- `useEffect` — side effects (data fetching, subscriptions, DOM manipulation)
- `useCallback` — memoize functions (prevent unnecessary re-renders)
- `useMemo` — memoize computed values
- `useTransition` — non-blocking UI updates (React 18+)
- `useDeferredValue` — defer re-rendering for non-urgent updates
- `useRef` — mutable ref that doesn't trigger re-renders
- `useContext` — consume context without prop drilling

### Component Composition Patterns
- **Compound components** — Share state between parent/children via context
- **Render props** — Pass render function as prop
- **Higher-order components** — Wrap component with additional behavior
- **Children as function** — Inversion of control

### Performance Optimization
- `React.memo()` — Memoize component (shallow prop comparison)
- `React.lazy()` + `Suspense` — Code splitting
- `useTransition()` — Keep UI responsive during heavy updates
- Avoid inline object/array creation in JSX (creates new reference each render)
- Use `key` prop correctly for list reconciliation

### State Management

**Zustand (recommended for most projects):**
```typescript
import { create } from "zustand";

interface Store {
  count: number;
  increment: () => void;
}

const useStore = create<Store>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

**Jotai (atomic state, good for complex derived state):**
```typescript
import { atom, useAtom } from "jotai";

const countAtom = atom(0);
const doubledAtom = atom((get) => get(countAtom) * 2);

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  const [doubled] = useAtom(doubledAtom);
  return <button onClick={() => setCount(c => c + 1)}>{count} ({doubled})</button>;
}
```

### Common Pitfalls
1. **Stale closures** — Use `useRef` for latest value in callbacks
2. **Infinite useEffect loops** — Check dependency array carefully
3. **Unnecessary re-renders** — Memoize expensive computations
4. **Lifting state too high** — Keep state closest to where it's used
5. **Not cleaning up effects** — Return cleanup function from useEffect

## Verification Checklist
- [ ] No unnecessary re-renders (React DevTools Profiler)
- [ ] All useEffect dependencies correctly specified
- [ ] No memory leaks (cleanup functions in useEffect)
- [ ] State management chosen appropriately for complexity
