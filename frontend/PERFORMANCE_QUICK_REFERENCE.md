# Performance Optimization Quick Reference

**Quick guide for developers** - See [PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md) for detailed documentation.

## Import Patterns

### ✅ DO THIS

```typescript
// Specific imports from sub-modules
import { Button } from '@/components/ui/buttons'
import { Input } from '@/components/ui/inputs'

// Lazy load heavy components
import { LazyLineChart } from '@/components/lazy'

// Dynamic imports for conditionally rendered content
const AdminPanel = dynamic(() => import('./AdminPanel'))
```

### ❌ NOT THIS

```typescript
// Barrel imports (prevents tree-shaking)
import { Button, Input, Card } from '@/components'

// Static import of heavy libraries
import FullCalendar from '@fullcalendar/react'
import { LineChart } from 'recharts'
```

## Lazy Loading Decision Tree

```
Should this component be lazy loaded?
│
├─ Is it > 50KB? ────────────────────────────► YES → Lazy load
├─ Is it below the fold? ────────────────────► YES → Lazy load
├─ Is it in a modal/tab? ────────────────────► YES → Lazy load
├─ Is it admin/role-specific? ───────────────► YES → Lazy load
├─ Is it a chart/calendar? ──────────────────► YES → Lazy load
└─ Is it critical/above-fold? ───────────────► NO → Regular import
```

## Component Size Guidelines

| Component Type | Max Lines | Action if Exceeded |
|----------------|-----------|-------------------|
| Page Component | 300 | Split into smaller components |
| Feature Component | 200 | Extract sub-components |
| UI Component | 150 | Simplify or split |
| Hook | 100 | Break into multiple hooks |

## Heavy Dependencies (Lazy Load These)

| Library | Size (gzipped) | Lazy Load? |
|---------|----------------|------------|
| recharts | ~28KB | ✅ YES |
| @fullcalendar | ~45KB | ✅ YES |
| jspdf | ~35KB | ✅ YES |
| html2pdf | ~40KB | ✅ YES |
| framer-motion | ~30KB | ⚠️ Maybe |
| date-fns | ~15KB | ❌ NO |

## Quick Lazy Loading Templates

### Chart Component
```typescript
import { LazyLineChart, ChartSkeleton } from '@/components/lazy'
import { Suspense } from 'react'

<Suspense fallback={<ChartSkeleton />}>
  <LazyLineChart data={data} />
</Suspense>
```

### Calendar Component
```typescript
import { LazyAppointmentCalendar, CalendarSkeleton } from '@/components/lazy'
import { Suspense } from 'react'

<Suspense fallback={<CalendarSkeleton />}>
  <LazyAppointmentCalendar />
</Suspense>
```

### Large Page Component
```typescript
import dynamic from 'next/dynamic'

const ReportBuilder = dynamic(
  () => import('@/components/lazy/LazyPages').then(m => m.LazyReportBuilder),
  { loading: () => <PageSkeleton /> }
)
```

### Modal Content
```typescript
const [showModal, setShowModal] = useState(false)

const DeleteModal = dynamic(() => import('./DeleteModal'))

{showModal && (
  <Suspense fallback={<Skeleton />}>
    <DeleteModal onClose={() => setShowModal(false)} />
  </Suspense>
)}
```

## Bundle Analysis

```bash
# Run bundle analysis
ANALYZE=true npm run build

# View report
open .next/analyze/client.html
```

## Performance Checklist

- [ ] Using specific imports (not barrel imports)
- [ ] Heavy libraries lazy loaded
- [ ] Components > 500 lines split into smaller parts
- [ ] Images have explicit width/height
- [ ] Below-fold content lazy loaded
- [ ] Modal/tab content dynamically imported
- [ ] No circular dependencies
- [ ] Chart components use LazyCharts
- [ ] Calendar uses LazyCalendar
- [ ] Lighthouse score > 90

## Quick Wins

1. **Replace chart imports**
   ```typescript
   // Before
   import { LineChart } from 'recharts'

   // After
   import { LazyLineChart } from '@/components/lazy'
   ```

2. **Fix barrel imports**
   ```typescript
   // Before
   import { Button, Input } from '@/components'

   // After
   import { Button } from '@/components/ui/buttons'
   import { Input } from '@/components/ui/inputs'
   ```

3. **Lazy load page components**
   ```typescript
   // Before
   import ReportBuilder from '@/components/pages/Reports/ReportBuilder'

   // After
   import { LazyReportBuilder } from '@/components/lazy'
   ```

## Common Issues

### Issue: Large Initial Bundle
**Cause:** Static imports of heavy libraries
**Fix:** Use dynamic imports and lazy loading

### Issue: Slow Page Load
**Cause:** Too much JavaScript on initial load
**Fix:** Code split by route, lazy load below-fold

### Issue: Poor Lighthouse Score
**Cause:** Large JavaScript bundles, render-blocking resources
**Fix:** Lazy load, optimize images, split chunks

### Issue: Circular Dependencies
**Cause:** Imports create circular chains
**Fix:** Extract shared types, use dependency injection

## Resources

- **Full Guide:** [PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md)
- **Lazy Components:** `/src/components/lazy/`
- **Next.js Config:** `next.config.ts`
- **Bundle Analysis:** `ANALYZE=true npm run build`

## Getting Help

1. Read [PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md)
2. Check bundle analysis report
3. Review this quick reference
4. Ask Frontend Performance Architect

---

**Last Updated:** 2025-11-02
