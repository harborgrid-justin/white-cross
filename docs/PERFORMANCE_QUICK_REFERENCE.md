# Performance Optimization Quick Reference

**White Cross Healthcare Platform**
**Version:** 1.0
**Last Updated:** October 26, 2025

---

## Quick Links

- [Main Guide](./PERFORMANCE_OPTIMIZATION_GUIDE.md) - Comprehensive guide with all features
- [Part 2](./PERFORMANCE_OPTIMIZATION_GUIDE_PART2.md) - Features 11-15 implementation
- [Utilities](./frontend/src/utils/performance-utilities.ts) - Performance utility functions

---

## Common Performance Patterns

### 1. Code Splitting (Route-Based)

```typescript
// BAD - Everything in one bundle
import Students from './pages/students/Students';
import Medications from './pages/medications/Medications';

// GOOD - Lazy load routes
const Students = lazy(() => import('./pages/students/Students'));
const Medications = lazy(() => import('./pages/medications/Medications'));

<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/students" element={<Students />} />
  </Routes>
</Suspense>
```

**Bundle Reduction:** 60-70%

---

### 2. Memoization (Prevent Re-renders)

```typescript
// BAD - Component re-renders on every parent update
export function ExpensiveComponent({ data, onClick }) {
  return <div onClick={onClick}>{data.map(...)}</div>;
}

// GOOD - Memoized component
export const ExpensiveComponent = memo(({ data, onClick }) => {
  const processedData = useMemo(() => {
    return data.map(item => heavyProcessing(item));
  }, [data]);

  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return <div onClick={handleClick}>{processedData}</div>;
});
```

**Performance Gain:** 50-80% fewer re-renders

---

### 3. Virtual Scrolling (Large Lists)

```typescript
// BAD - Renders all 10,000 items
{items.map(item => <Row key={item.id} {...item} />)}

// GOOD - Only renders visible items
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={items.length}
  itemSize={72}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <Row {...items[index]} />
    </div>
  )}
</FixedSizeList>
```

**Performance Gain:** 95% reduction in DOM nodes

---

### 4. Debounced Search

```typescript
// BAD - API call on every keystroke
onChange={(e) => fetchResults(e.target.value)}

// GOOD - Debounced API calls
import { useDebounce } from '@/utils/performance-utilities';

const [query, setQuery] = useState('');
const debouncedQuery = useDebounce(query, 300);

useEffect(() => {
  if (debouncedQuery) {
    fetchResults(debouncedQuery);
  }
}, [debouncedQuery]);
```

**API Reduction:** 90% fewer requests

---

### 5. TanStack Query Caching

```typescript
// BAD - Fetches data on every component mount
useEffect(() => {
  fetch('/api/students').then(setStudents);
}, []);

// GOOD - Smart caching with TanStack Query
const { data, isLoading } = useQuery({
  queryKey: ['students'],
  queryFn: fetchStudents,
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  retry: 2
});
```

**Cache Hit Rate:** 80-90%

---

### 6. Web Worker (Heavy Computation)

```typescript
// BAD - Blocks UI thread
const result = expensiveCalculation(largeDataset);

// GOOD - Offload to Web Worker
import { useWebWorker } from '@/utils/performance-utilities';

const [calculate, isCalculating] = useWebWorker((data) => {
  // Complex computation here
  return data.reduce((acc, item) => acc + item.value, 0);
});

const result = await calculate(largeDataset);
```

**UI Blocking:** 0ms (no blocking)

---

### 7. Image Optimization

```typescript
// BAD - Large images, no lazy loading
<img src="large-image.jpg" alt="..." />

// GOOD - Responsive images with lazy loading
<img
  srcset="
    image-320w.webp 320w,
    image-640w.webp 640w,
    image-1024w.webp 1024w
  "
  sizes="(max-width: 640px) 100vw, 50vw"
  src="image-640w.webp"
  alt="..."
  loading="lazy"
  decoding="async"
/>
```

**Load Time:** 70% faster

---

### 8. Redux Selector Optimization

```typescript
// BAD - Recalculates on every state change
const filteredData = useSelector(state =>
  state.items.filter(item => item.active)
);

// GOOD - Memoized selector
import { createSelector } from '@reduxjs/toolkit';

const selectActiveItems = createSelector(
  [(state) => state.items],
  (items) => items.filter(item => item.active)
);

const filteredData = useSelector(selectActiveItems);
```

**Re-computation:** Only when items change

---

### 9. WebSocket Message Batching

```typescript
// BAD - Process every message immediately
socket.onmessage = (event) => {
  processMessage(JSON.parse(event.data));
};

// GOOD - Batch messages
class WebSocketService {
  private messageQueue = [];
  private batchInterval = 150; // ms

  onMessage(event) {
    this.messageQueue.push(JSON.parse(event.data));

    if (this.messageQueue.length >= 20) {
      this.processBatch();
    } else {
      this.scheduleBatch();
    }
  }

  processBatch() {
    requestAnimationFrame(() => {
      const batch = [...this.messageQueue];
      this.messageQueue = [];
      batch.forEach(msg => this.handleMessage(msg));
    });
  }
}
```

**UI Responsiveness:** 60 FPS maintained

---

### 10. PDF Generation (Non-Blocking)

```typescript
// BAD - Blocks UI while generating
const pdf = generatePDF(data);

// GOOD - Web Worker-based generation
const worker = new Worker(
  new URL('@/workers/pdfGeneratorWorker.ts', import.meta.url)
);

worker.postMessage({ type: 'GENERATE_PDF', data });

worker.onmessage = (event) => {
  const blob = event.data.blob;
  downloadBlob(blob, 'report.pdf');
  worker.terminate();
};
```

**UI Blocking:** 0ms

---

## Performance Budgets by Feature

| Feature | Initial Load | Interaction | Bundle Size |
|---------|-------------|-------------|-------------|
| Drug Interaction Checker | < 300ms | **< 50ms** | 50KB |
| Real-Time Alerts | < 200ms | **< 200ms** | 25KB |
| Immunization Dashboard | < 600ms | < 300ms | 50KB |
| PDF Reports | < 300ms | < 5s (worker) | 150KB |
| Clinic Visit Tracking | < 500ms | < 100ms | 40KB |
| PHI Disclosure Tracking | < 500ms | < 100ms | 30KB |
| Outbreak Detection | < 1s | < 2s (worker) | 60KB |

---

## Core Web Vitals Targets

| Metric | Target | Critical |
|--------|--------|----------|
| **LCP** (Largest Contentful Paint) | < 2.5s | < 3.5s |
| **FID** (First Input Delay) | < 100ms | < 200ms |
| **INP** (Interaction to Next Paint) | < 200ms | < 300ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | < 0.25 |
| **TTFB** (Time to First Byte) | < 600ms | < 1s |

---

## Checklist: Before Deploying a Feature

### Performance

- [ ] Route is lazy loaded
- [ ] Large lists use virtual scrolling
- [ ] Search inputs are debounced (300ms)
- [ ] Heavy computation uses Web Workers
- [ ] Images are optimized (WebP/AVIF, lazy loaded)
- [ ] API calls use TanStack Query caching
- [ ] Components use `memo()` where appropriate
- [ ] Expensive calculations use `useMemo()`
- [ ] Event handlers use `useCallback()`
- [ ] Bundle size < budget for feature

### Monitoring

- [ ] Performance marks added for critical operations
- [ ] Long tasks (> 50ms) are logged
- [ ] Error boundaries in place
- [ ] Analytics events added
- [ ] Web Vitals tracking enabled

### Testing

- [ ] Lighthouse score > 90
- [ ] Tested with slow 3G throttling
- [ ] Tested with 1000+ items (if applicable)
- [ ] No console errors or warnings
- [ ] Memory leaks checked (Chrome DevTools)

---

## Common Anti-Patterns to Avoid

### ❌ Anti-Pattern 1: Inline Object Creation

```typescript
// BAD - Creates new object on every render
<Component style={{ margin: 10 }} />

// GOOD - Memoize or move outside component
const styles = { margin: 10 };
<Component style={styles} />
```

### ❌ Anti-Pattern 2: Anonymous Functions in Props

```typescript
// BAD - Creates new function on every render
<Button onClick={() => handleClick(id)} />

// GOOD - Use useCallback
const handleButtonClick = useCallback(() => {
  handleClick(id);
}, [id]);

<Button onClick={handleButtonClick} />
```

### ❌ Anti-Pattern 3: Index as Key

```typescript
// BAD - Causes re-renders when list order changes
{items.map((item, index) => <Row key={index} {...item} />)}

// GOOD - Use stable ID
{items.map(item => <Row key={item.id} {...item} />)}
```

### ❌ Anti-Pattern 4: Excessive Re-fetching

```typescript
// BAD - Fetches on every render
useEffect(() => {
  fetchData();
}); // Missing dependency array!

// GOOD - Fetch once or when dependencies change
useEffect(() => {
  fetchData();
}, [param1, param2]);
```

### ❌ Anti-Pattern 5: Large Bundle Imports

```typescript
// BAD - Imports entire library
import _ from 'lodash';

// GOOD - Import only what you need
import debounce from 'lodash/debounce';

// BETTER - Use native JavaScript
const debounce = (fn, delay) => { /* ... */ };
```

---

## Performance Monitoring Commands

```bash
# Build and analyze bundle
npm run build
npx vite-bundle-visualizer

# Run Lighthouse CI
npx lighthouse http://localhost:5173 --view

# Check bundle sizes
du -h dist/assets/*.js | sort -rh

# Monitor performance in real-time
npm run dev
# Open: http://localhost:5173
# DevTools > Performance > Record
```

---

## Browser DevTools Profiling

### 1. Performance Profiling
1. Open Chrome DevTools (F12)
2. Go to **Performance** tab
3. Click **Record** (Ctrl+E)
4. Perform actions
5. Click **Stop**
6. Analyze flamegraph for long tasks (> 50ms)

### 2. Memory Profiling
1. Open Chrome DevTools
2. Go to **Memory** tab
3. Take **Heap Snapshot**
4. Perform actions
5. Take another snapshot
6. Compare snapshots for memory leaks

### 3. Coverage Analysis
1. Open Chrome DevTools
2. Press Ctrl+Shift+P
3. Type "Coverage"
4. Click **Start Instrumenting**
5. Navigate app
6. See unused code in red

---

## Performance Testing Matrix

| Scenario | Device | Network | Expected LCP | Expected FID |
|----------|--------|---------|--------------|--------------|
| **Desktop** | Fast (i7, 16GB) | 4G | < 1.5s | < 50ms |
| **Laptop** | Medium (i5, 8GB) | WiFi | < 2.0s | < 80ms |
| **Mobile** | Slow (Budget Phone) | Slow 3G | < 2.5s | < 100ms |
| **Tablet** | Medium | WiFi | < 2.0s | < 80ms |

---

## Resource Hints

```html
<!-- Preconnect to API server -->
<link rel="preconnect" href="https://api.whitecross.com" />

<!-- DNS Prefetch for external services -->
<link rel="dns-prefetch" href="https://cdn.whitecross.com" />

<!-- Preload critical resources -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />

<!-- Prefetch next page (low priority) -->
<link rel="prefetch" href="/students" />

<!-- Modulepreload for ES modules -->
<link rel="modulepreload" href="/assets/students-chunk.js" />
```

---

## Emergency Performance Fixes

### Issue: Dashboard loads slowly

**Quick Fixes:**
1. Enable code splitting for dashboard widgets
2. Add `staleTime` to TanStack Query (5 minutes)
3. Implement virtual scrolling for activity feed
4. Lazy load chart libraries

```typescript
// Before
import { BarChart } from 'recharts';

// After
const BarChart = lazy(() => import('recharts').then(m => ({ default: m.BarChart })));
```

### Issue: Search is laggy

**Quick Fixes:**
1. Add debouncing (300ms)
2. Use IndexedDB cache for frequent searches
3. Implement Trie data structure for instant suggestions
4. Limit results to 10 items

```typescript
const debouncedQuery = useDebounce(searchQuery, 300);
```

### Issue: Large list is slow

**Quick Fixes:**
1. Implement virtual scrolling
2. Add pagination (50 items per page)
3. Memoize list items with `memo()`
4. Optimize row component render

```typescript
import { FixedSizeList } from 'react-window';
```

### Issue: Form submission is slow

**Quick Fixes:**
1. Show optimistic updates
2. Debounce auto-save
3. Use Web Worker for validation
4. Implement progress indicator

```typescript
const mutation = useMutation({
  mutationFn: submitForm,
  onMutate: async (newData) => {
    // Optimistic update
    queryClient.setQueryData(['form'], newData);
  }
});
```

---

## Performance Monitoring Dashboard

### Real-Time Metrics to Track

1. **Core Web Vitals**
   - LCP, FID, CLS, INP, TTFB

2. **User-Centric Metrics**
   - Time to Interactive (TTI)
   - First Contentful Paint (FCP)
   - Speed Index

3. **Resource Metrics**
   - Bundle size (initial + lazy chunks)
   - API response times
   - Cache hit rates

4. **Error Metrics**
   - JavaScript errors
   - API failures
   - Long tasks (> 50ms)

### Implementation

```typescript
// /frontend/src/services/monitoring/webVitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function initWebVitals() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}

function sendToAnalytics(metric) {
  // Send to your analytics service
  fetch('/api/analytics/web-vitals', {
    method: 'POST',
    body: JSON.stringify(metric),
    keepalive: true
  });
}
```

---

## Performance Tips by Technology

### React

- Use `React.memo()` for expensive components
- Use `useMemo()` for expensive calculations
- Use `useCallback()` for event handlers
- Avoid inline objects/arrays in props
- Use `key` prop correctly (stable IDs, not index)

### TanStack Query

- Set appropriate `staleTime` (5-10 minutes)
- Set appropriate `gcTime` (10-15 minutes)
- Use `placeholderData` for instant UI updates
- Implement optimistic updates for mutations
- Use `refetchInterval` wisely (only when needed)

### Redux

- Use `createSelector` for memoized selectors
- Normalize state shape
- Split large slices by feature
- Use `RTK Query` for API calls
- Avoid deep nesting in state

### Vite

- Configure manual chunks in `rollupOptions`
- Use dynamic imports for large libraries
- Enable compression (Gzip + Brotli)
- Set appropriate `chunkSizeWarningLimit`
- Use `rollup-plugin-visualizer` to analyze bundle

---

## Getting Help

### Documentation
- [Main Performance Guide](./PERFORMANCE_OPTIMIZATION_GUIDE.md)
- [React Performance Docs](https://react.dev/learn/render-and-commit)
- [Web.dev Performance](https://web.dev/performance/)

### Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [Bundle Analyzer](https://www.npmjs.com/package/rollup-plugin-visualizer)

### Team Contacts
- Performance Lead: [Contact Info]
- DevOps: [Contact Info]
- Frontend Team: [Contact Info]

---

**Last Updated:** October 26, 2025
**Maintained By:** Frontend Performance Team
**Review Frequency:** Monthly
