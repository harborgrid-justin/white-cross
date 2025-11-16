# Performance Optimization Quick Reference

Quick reference guide for implementing performance best practices in the page builder.

## Component Optimization

### React.memo

```typescript
// Basic usage
export const MyComponent = React.memo(() => {
  return <div>Content</div>;
});

// With custom comparison
export const MyComponent = React.memo(
  MyComponentInternal,
  (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    return prevProps.id === nextProps.id && prevProps.data === nextProps.data;
  }
);
```

### useCallback

```typescript
// Memoize event handlers
const handleClick = useCallback((id: string) => {
  doSomething(id);
}, [/* dependencies */]);

// Memoize with dependencies
const handleUpdate = useCallback((value: string) => {
  updateComponent(componentId, { value });
}, [componentId, updateComponent]);
```

### useMemo

```typescript
// Memoize expensive computations
const filteredItems = useMemo(
  () => items.filter(item => item.active),
  [items]
);

// Memoize object creation
const style = useMemo(
  () => ({ color: isActive ? 'red' : 'blue' }),
  [isActive]
);
```

## Zustand Selectors

### Using Optimized Selectors

```typescript
import { shallow } from 'zustand/shallow';
import { usePageBuilderStore } from '@/store';
import { selectRootComponents, selectViewport } from '@/store/selectors';

// Basic selector
const zoom = usePageBuilderStore((state) => state.canvas.viewport.zoom);

// Optimized selector with shallow comparison
const viewport = usePageBuilderStore(selectViewport, shallow);

// Root components selector
const rootComponents = usePageBuilderStore(selectRootComponents, shallow);
```

### Available Selectors

| Selector | Description |
|----------|-------------|
| `selectRootComponents` | Get all root-level components |
| `selectComponentById(id)` | Get a specific component |
| `selectViewport` | Get viewport state (zoom, pan) |
| `selectGrid` | Get grid state |
| `selectCanvasSelectionState` | Get selection state |
| `selectCanUndo` | Check if undo is available |
| `selectCanRedo` | Check if redo is available |
| `selectPreview` | Get preview state |

See `/home/user/white-cross/frontend/gui/src/store/selectors.ts` for complete list.

## Lazy Loading

### Lazy Load Components

```typescript
import { LazyPreviewModal, preloadPreviewModal } from '@/components/lazy';

// In component
<button onMouseEnter={preloadPreviewModal}>
  Open Preview
</button>

<LazyPreviewModal isOpen={isOpen} onClose={handleClose} />
```

### Create Lazy Components

```typescript
import { withLazyLoad, ModalLoading } from '@/components/common/LazyLoad';

export const LazyMyComponent = withLazyLoad(
  React.lazy(() => import('./MyComponent')),
  <ModalLoading />
);
```

## Performance Monitoring

### Track Renders

```typescript
import { useRenderPerformance } from '@/utils/performance';

function MyComponent() {
  // Logs slow renders (> 16ms) in development
  const metrics = useRenderPerformance('MyComponent');

  return <div>Content</div>;
}
```

### Debug Re-renders

```typescript
import { useWhyDidYouUpdate } from '@/utils/performance';

function MyComponent(props) {
  // Logs which props changed
  useWhyDidYouUpdate('MyComponent', props);

  return <div>Content</div>;
}
```

### Measure Functions

```typescript
import { measureExecutionTime } from '@/utils/performance';

const expensiveFunction = measureExecutionTime('myFunction', (data) => {
  // expensive operation
  return result;
});
```

## Common Patterns

### Event Handler Pattern

```typescript
// ❌ Bad - creates new function every render
<button onClick={() => handleClick(id)}>Click</button>

// ✅ Good - stable reference
const onClick = useCallback(() => handleClick(id), [id, handleClick]);
<button onClick={onClick}>Click</button>
```

### Object/Array Props Pattern

```typescript
// ❌ Bad - new object every render
<MyComponent style={{ color: 'red' }} />

// ✅ Good - memoized object
const style = useMemo(() => ({ color: 'red' }), []);
<MyComponent style={style} />

// ✅ Better - defined outside if static
const style = { color: 'red' };
<MyComponent style={style} />
```

### Selector Pattern

```typescript
// ❌ Bad - no shallow comparison
const data = usePageBuilderStore((state) => ({
  zoom: state.canvas.viewport.zoom,
  pan: state.canvas.viewport.pan,
}));

// ✅ Good - with shallow comparison
const viewport = usePageBuilderStore(selectViewport, shallow);
```

### List Rendering Pattern

```typescript
// ❌ Bad - rerenders all items
items.map(item => <Item key={item.id} item={item} />)

// ✅ Good - memoized items
items.map(item => <MemoizedItem key={item.id} item={item} />)

// ✅ Better - virtualized for large lists
<VirtualList items={items} />
```

## Checklist for New Components

- [ ] Component wrapped with `React.memo`
- [ ] Event handlers use `useCallback`
- [ ] Expensive computations use `useMemo`
- [ ] Zustand selectors use shallow comparison
- [ ] Props are primitives or memoized objects/arrays
- [ ] No inline object/array creation in render
- [ ] Heavy components are lazy-loaded
- [ ] Lists use virtualization (if > 100 items)

## File Locations

### Core Files

- **Performance Utils**: `/home/user/white-cross/frontend/gui/src/utils/performance.ts`
- **Selectors**: `/home/user/white-cross/frontend/gui/src/store/selectors.ts`
- **Lazy Components**: `/home/user/white-cross/frontend/gui/src/components/lazy/index.tsx`
- **Lazy Utilities**: `/home/user/white-cross/frontend/gui/src/components/common/LazyLoad.tsx`

### Documentation

- **Full Guide**: `/home/user/white-cross/frontend/gui/PERFORMANCE.md`
- **Summary**: `/home/user/white-cross/frontend/gui/PERFORMANCE_OPTIMIZATION_SUMMARY.md`
- **Quick Reference**: `/home/user/white-cross/frontend/gui/PERFORMANCE_QUICK_REFERENCE.md` (this file)

## Testing Performance

### React DevTools Profiler

1. Install React DevTools extension
2. Open Profiler tab
3. Click Record
4. Interact with app
5. Stop recording
6. Review:
   - Render duration
   - Component re-renders
   - Unnecessary renders

### Chrome DevTools

1. Open Performance tab
2. Click Record (Ctrl+E)
3. Interact with app
4. Stop recording
5. Review:
   - Frame rate (target: 60 FPS)
   - Long tasks (avoid > 50ms)
   - Main thread activity

### Lighthouse

```bash
npm run build
npx serve -s build
# Open Chrome DevTools > Lighthouse
# Run Performance audit
```

Target: 90+ performance score

## Common Issues

### Component Re-renders Too Much

**Solution**:
1. Add `useWhyDidYouUpdate(props)` to debug
2. Memoize objects/arrays passed as props
3. Use React.memo with custom comparison

### Callback Causes Child Re-renders

**Solution**:
1. Wrap with `useCallback`
2. Ensure dependencies are stable
3. Use refs for frequently changing values

### Large List is Slow

**Solution**:
1. Use virtualization (`react-window`)
2. Memoize list items
3. Implement pagination/infinite scroll

### Bundle Size Too Large

**Solution**:
1. Lazy load heavy components
2. Code split by routes
3. Remove unused dependencies
4. Analyze with bundle analyzer

## Quick Wins

1. **Wrap components with React.memo** (5 min)
2. **Use optimized selectors** (5 min)
3. **Memoize callbacks** (5 min)
4. **Add lazy loading** (10 min)
5. **Add performance monitoring** (5 min)

Total time: ~30 minutes for significant improvements

## Support

- Check full documentation in `PERFORMANCE.md`
- Review implementation examples in existing components
- Use performance utilities for debugging
- Profile with React DevTools

---

Last Updated: 2025-11-16
