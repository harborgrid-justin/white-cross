# Performance Optimization Quick Reference

One-page cheat sheet for common performance optimization patterns in White Cross.

---

## Import Performance Library

```typescript
import {
  // Monitoring
  initPerformanceMetrics,
  performanceMetrics,

  // Lazy Loading
  lazyWithRetry,
  lazyWithPreload,
  prefetchComponent,

  // Prefetching
  prefetchResource,
  preloadResource,
  intelligentPrefetcher,

  // Component Optimization
  optimizedMemo,
  useSlowRenderDetection,
  useIntersectionObserver,
  VirtualList
} from '@/lib/performance';
```

---

## Quick Wins (Copy-Paste Ready)

### 1. Initialize Performance Monitoring
```typescript
// In App.tsx or bootstrap.ts
import { initPerformanceMetrics } from '@/lib/performance';

initPerformanceMetrics({
  debug: import.meta.env.DEV,
  analytics: {
    sendEvent: (name, params) => {
      window.gtag?.('event', name, params);
    }
  }
});
```

### 2. Lazy Load Sentry (Saves 474 KB)
```typescript
// Replace direct import with lazy loading
if (import.meta.env.PROD) {
  import('@sentry/browser').then(Sentry => {
    Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN });
  });
}
```

### 3. Lazy Load Route Component
```typescript
import { lazyWithRetry } from '@/lib/performance';

const Dashboard = lazyWithRetry(
  () => import('@/pages/dashboard/Dashboard'),
  { maxRetries: 3, retryDelay: 1000 }
);
```

### 4. Preload Route on Hover
```typescript
import { HealthRecords } from '@/routes/lazyRoutes';

<Link
  to="/health-records"
  onMouseEnter={() => HealthRecords.preload?.()}
>
  Health Records
</Link>
```

### 5. Optimize List Component
```typescript
import { optimizedMemo } from '@/lib/performance';

const StudentItem = optimizedMemo(({ student }) => (
  <div>{student.name}</div>
), {
  compareProps: (prev, next) => prev.student.id === next.student.id
});
```

### 6. Virtual Scrolling for Large Lists
```typescript
import { VirtualList } from '@/lib/performance';

<VirtualList
  items={students}
  itemHeight={60}
  containerHeight={600}
  renderItem={(student) => <StudentItem student={student} />}
/>
```

### 7. Lazy Load Images
```typescript
import { useIntersectionObserver } from '@/lib/performance';

function LazyImage({ src, alt }) {
  const [ref, isVisible] = useIntersectionObserver();
  return (
    <div ref={ref}>
      {isVisible && <img src={src} alt={alt} loading="lazy" />}
    </div>
  );
}
```

### 8. Detect Slow Renders
```typescript
import { useSlowRenderDetection } from '@/lib/performance';

function ExpensiveComponent() {
  useSlowRenderDetection('ExpensiveComponent', 50);
  // Component code...
}
```

---

## Bundle Optimization Commands

```bash
# Build with bundle analysis
ANALYZE=true npm run build

# Check bundle sizes
ls -lh dist/assets/js/

# Check gzipped sizes
gzip -k dist/assets/js/*.js && ls -lh dist/assets/js/*.gz

# Find large dependencies
npm list --depth=0 --prod

# Remove moment.js (save 82 KB)
npm uninstall moment
```

---

## Performance Budget Targets

```
Initial Bundle:      < 350 KB (gzipped)
Route Chunks:        < 50 KB each (gzipped)
Vendor Chunks:       < 100 KB each (gzipped)

LCP:                 < 2.5s  (Good)
FID/INP:             < 100ms (Good)
CLS:                 < 0.1   (Good)
FCP:                 < 1.8s  (Good)
```

---

## Common Patterns

### Memoize Expensive Calculation
```typescript
const expensiveValue = useMemo(() => {
  return processData(data);
}, [data]);
```

### Memoize Callback
```typescript
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### Debounce Search Input
```typescript
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  searchAPI(debouncedSearch);
}, [debouncedSearch]);
```

### Prefetch API on Idle
```typescript
import { prefetchOnIdle } from '@/lib/performance';

useEffect(() => {
  prefetchOnIdle(() => import('./HeavyComponent'));
}, []);
```

---

## Lighthouse Audit Checklist

### Before Running Audit
- [ ] Build production version: `npm run build`
- [ ] Serve production: `npm run preview`
- [ ] Open in Incognito mode
- [ ] Disable browser extensions
- [ ] Use "Mobile" device preset

### Running Audit
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select categories: Performance, Accessibility, Best Practices, SEO
4. Choose "Mobile" device
5. Click "Analyze page load"

### Target Scores
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

---

## Troubleshooting

### Bundle too large?
```bash
# 1. Check what's in the bundle
ANALYZE=true npm run build

# 2. Look for heavy dependencies
npm list --depth=0

# 3. Check for duplicates
npm dedupe
```

### Lazy loading not working?
```typescript
// Ensure you're using dynamic import
const Component = lazy(() => import('./Component')); // ✅

// Not static import
import Component from './Component'; // ❌
```

### Performance metrics not showing?
```typescript
// Enable debug mode
initPerformanceMetrics({ debug: true });

// Check console for Web Vitals
```

---

## Critical Files

### Performance Library
- `lib/performance/metrics.ts` - Web Vitals tracking
- `lib/performance/lazy.ts` - Lazy loading utilities
- `lib/performance/prefetch.ts` - Prefetching utilities
- `lib/performance/componentOptimization.tsx` - React helpers

### Routes
- `routes/lazyRoutes.ts` - All lazy-loaded routes

### Documentation
- `PERFORMANCE_OPTIMIZATION_REPORT.md` - Full analysis
- `PERFORMANCE_IMPLEMENTATION_GUIDE.md` - Step-by-step guide
- `PERFORMANCE_SUMMARY.md` - Executive summary

---

## Priority Implementation Order

1. **5 minutes:** Lazy load Sentry → Saves 474 KB
2. **10 minutes:** Remove moment.js → Saves 82 KB
3. **5 minutes:** Add Web Vitals monitoring → Visibility
4. **10 minutes:** Update routes to lazy load → Reduce initial bundle
5. **15 minutes:** Add route prefetching → Perceived performance
6. **30 minutes:** Optimize list components → Better UX
7. **1 hour:** Virtual scrolling for tables → Handle large datasets

**Total: 2 hours for 60% performance improvement**

---

## Resources

- 📖 [Full Report](./PERFORMANCE_OPTIMIZATION_REPORT.md)
- 📖 [Implementation Guide](./PERFORMANCE_IMPLEMENTATION_GUIDE.md)
- 📖 [Summary](./PERFORMANCE_SUMMARY.md)
- 🔗 [Web Vitals](https://web.dev/vitals/)
- 🔗 [React Performance](https://react.dev/reference/react/memo)

---

**Last Updated:** 2025-10-26
**Quick Help:** See PERFORMANCE_IMPLEMENTATION_GUIDE.md for detailed instructions
