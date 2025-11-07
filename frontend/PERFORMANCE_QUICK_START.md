# Performance Optimization Quick Start Guide

Quick reference for implementing performance optimizations in the White Cross Healthcare Platform.

## 🚀 Quick Reference

### Use Virtualized Lists (100+ items)

```tsx
import { VirtualizedStudentList } from '@/components/features/students/VirtualizedStudentList';

<VirtualizedStudentList
  students={students}
  height={600}
  isLoading={isLoading}
/>
```

### Use Lazy Loaded Components

```tsx
import { LazyLineChart } from '@/components/lazy';

<Suspense fallback={<ChartSkeleton />}>
  <LazyLineChart data={data} />
</Suspense>
```

### Use Optimized Queries

```tsx
import { useOptimizedQuery } from '@/hooks/performance/useOptimizedQuery';

const { data } = useOptimizedQuery({
  queryKey: ['resource', id],
  queryFn: () => fetchResource(id),
  staleTime: 5 * 60 * 1000,
});
```

### Memoize Expensive Computations

```tsx
import { useDeepMemo, useStableCallback } from '@/components/performance';

const filtered = useDeepMemo(
  () => data.filter(item => matches(item, filters)),
  [data, filters]
);

const handleClick = useStableCallback(() => {
  // Stable callback reference
});
```

## 📦 Available Components

### Virtualized Lists
- `VirtualizedList` - Generic virtualized list
- `VirtualizedTable` - Virtualized table with columns
- `VirtualizedStudentList` - Pre-configured student list
- `VirtualizedMedicationList` - Pre-configured medication list

### Lazy Components
- `LazyLineChart`, `LazyBarChart`, `LazyPieChart` - Chart components
- `LazyStudentFormModal` - Student form modal
- `LazyNotificationCenter` - Notification modal
- `LazyProfileSettings` - Settings pages
- `LazyAppointmentCalendar` - Calendar component

### Performance Hooks
- `useOptimizedQuery` - Enhanced TanStack Query
- `usePrefetchOnInteraction` - Prefetch on hover/focus
- `useDeepMemo` - Deep comparison memoization
- `useStableCallback` - Stable callback references
- `useDebouncedValue` - Debounce values
- `useThrottledValue` - Throttle updates

## 🔍 Performance Testing

```bash
# Analyze bundle size
npm run analyze

# Build and analyze
npm run analyze:build

# Run Lighthouse
npm run lighthouse
```

## ✅ Performance Checklist

Before deploying:
- [ ] Lists with 50+ items use virtualization
- [ ] Heavy modals are lazy loaded
- [ ] Charts are lazy loaded
- [ ] Bundle size analyzed
- [ ] Lighthouse score 90+
- [ ] Core Web Vitals passing

## 📊 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Initial Bundle | < 450KB | ~450KB |
| LCP | < 2.5s | ~1.6s |
| FID/INP | < 100ms | ~60ms |
| CLS | < 0.1 | ~0.04 |
| TTI | < 3.5s | ~2.1s |

## 🛠️ Common Patterns

### Pattern 1: Large Data Table
```tsx
import { VirtualizedTable } from '@/components/performance';

const columns = [
  { key: 'name', label: 'Name', width: 200 },
  { key: 'email', label: 'Email', width: 250 },
];

<VirtualizedTable
  data={largeDataset}
  columns={columns}
  height={600}
  rowHeight={60}
/>
```

### Pattern 2: Modal with Form
```tsx
import { LazyStudentFormModal } from '@/components/lazy';

const [isOpen, setIsOpen] = useState(false);

{isOpen && (
  <Suspense fallback={<ModalSkeleton />}>
    <LazyStudentFormModal
      onClose={() => setIsOpen(false)}
      onSubmit={handleSubmit}
    />
  </Suspense>
)}
```

### Pattern 3: Analytics Dashboard
```tsx
import { LazyLineChart, LazyBarChart } from '@/components/lazy';

<div className="grid grid-cols-2 gap-4">
  <Suspense fallback={<ChartSkeleton />}>
    <LazyLineChart data={timeSeriesData} />
  </Suspense>
  <Suspense fallback={<ChartSkeleton />}>
    <LazyBarChart data={categoryData} />
  </Suspense>
</div>
```

## 🐛 Troubleshooting

### Issue: Bundle too large
**Solution:** Run `npm run analyze` and identify large chunks. Consider:
- Lazy loading heavy components
- Tree-shaking unused imports
- Replacing large libraries

### Issue: List scrolling laggy
**Solution:** Use virtualization:
```tsx
<VirtualizedList
  items={items}
  height={600}
  itemHeight={80}
  renderItem={renderRow}
/>
```

### Issue: Slow initial load
**Solution:** Check:
- Are charts/modals lazy loaded?
- Is initial bundle < 500KB?
- Are images optimized?

## 📚 Further Reading

- [Full Performance Summary](/home/user/white-cross/frontend/PERFORMANCE_OPTIMIZATION_SUMMARY.md)
- [React Window Docs](https://react-window.vercel.app/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)

---

**Quick Links:**
- 📊 [Bundle Analyzer](#performance-testing)
- 📖 [Full Documentation](PERFORMANCE_OPTIMIZATION_SUMMARY.md)
- 🎯 [Performance Targets](#performance-targets)
