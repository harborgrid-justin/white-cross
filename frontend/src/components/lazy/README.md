# Lazy-Loaded Components

This directory contains lazy-loaded wrappers for heavy components and libraries. These components use Next.js `dynamic()` imports to reduce the initial bundle size and improve application performance.

## Purpose

Lazy loading allows us to:
- Reduce initial bundle size by 300-500KB
- Improve Time to Interactive (TTI)
- Load heavy components only when needed
- Better Core Web Vitals (LCP, FID, CLS)
- Optimize route-based code splitting

## Structure

```
lazy/
├── index.ts              # Central export point
├── LazyCharts.tsx        # Chart components (recharts)
├── LazyCalendar.tsx      # Calendar components (fullcalendar)
├── LazyPages.tsx         # Large page components (1000+ lines)
└── README.md            # This file
```

## Available Components

### Charts (LazyCharts.tsx)
Recharts library components (~92KB minified, ~28KB gzipped)

- `LazyLineChart` - Line chart visualization
- `LazyBarChart` - Bar chart visualization
- `LazyPieChart` - Pie/donut chart
- `LazyAreaChart` - Area chart visualization
- `LazyComposedChart` - Multi-series complex charts
- `ChartSkeleton` - Loading placeholder

**Usage:**
```typescript
import { LazyLineChart, ChartSkeleton } from '@/components/lazy'
import { Suspense } from 'react'

function AnalyticsPage() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <LazyLineChart
        data={data}
        xDataKey="date"
        yDataKey="value"
      />
    </Suspense>
  )
}
```

### Calendar (LazyCalendar.tsx)
FullCalendar library components (~158KB minified, ~45KB gzipped)

- `LazyAppointmentCalendar` - Full appointment calendar
- `CalendarSkeleton` - Loading placeholder

**Usage:**
```typescript
import { LazyAppointmentCalendar, CalendarSkeleton } from '@/components/lazy'
import { Suspense } from 'react'

function AppointmentsPage() {
  return (
    <Suspense fallback={<CalendarSkeleton />}>
      <LazyAppointmentCalendar
        appointments={appointments}
        onEventClick={handleEventClick}
      />
    </Suspense>
  )
}
```

### Large Pages (LazyPages.tsx)
Heavy page components (1000+ lines each)

**Compliance:**
- `LazyComplianceDetail`
- `LazyComplianceAudit`
- `LazyComplianceWorkflow`

**Reports:**
- `LazyReportPermissions`
- `LazyReportBuilder`
- `LazyReportTemplates`
- `LazyReportExport`
- `LazyReportScheduler`
- `LazyReportAnalytics`

**Appointments:**
- `LazyAppointmentScheduler`
- `LazyAppointmentCalendar`

**Communications:**
- `LazyCommunicationNotifications`
- `LazyCommunicationHistory`
- `LazyCommunicationThreads`
- `LazyCommunicationComposer`
- `LazyCommunicationAnalytics`

**Billing:**
- `LazyBillingDetail`
- `LazyBillingPayment`
- `LazyBillingAnalytics`

**Medications:**
- `LazyMedicationAlerts`

**Usage:**
```typescript
import { LazyReportBuilder, PageSkeleton } from '@/components/lazy'
import { Suspense } from 'react'

function ReportsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <LazyReportBuilder reportId={reportId} />
    </Suspense>
  )
}
```

## When to Use Lazy Loading

### ✅ DO use lazy loading for:

1. **Heavy Libraries** (> 50KB)
   - Charts (recharts, d3)
   - Calendars (fullcalendar)
   - PDF viewers/generators
   - Rich text editors

2. **Large Components** (> 500 lines)
   - Complex page components
   - Feature-rich modules
   - Admin panels

3. **Conditionally Rendered Content**
   - Modal dialogs
   - Tab panels
   - Accordion content
   - Role-based features

4. **Below-the-Fold Content**
   - Comment sections
   - Related items
   - Footer content

### ❌ DON'T use lazy loading for:

1. **Critical Path Components**
   - Above-the-fold content
   - Navigation
   - Authentication guards
   - Error boundaries

2. **Small Components** (< 50 lines)
   - UI primitives (buttons, inputs)
   - Icons
   - Simple layouts

3. **Frequently Used Components**
   - Common UI components
   - Shared layouts
   - App-wide providers

## Creating New Lazy Components

### Step 1: Identify the Component

Check if component meets criteria:
- Size > 500 lines OR dependency > 50KB
- Not needed on initial render
- Route-specific or conditionally rendered

### Step 2: Create Lazy Wrapper

```typescript
// In appropriate LazyXXX.tsx file
export const LazyMyComponent = dynamic(
  () => import('@/components/path/MyComponent').then((mod) => mod.MyComponent),
  {
    loading: () => <MyComponentSkeleton />,
    ssr: false, // Set to true if SSR needed
  }
);
```

### Step 3: Create Loading Skeleton

```typescript
const MyComponentSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-64" />
    <Skeleton className="h-48 w-full" />
  </div>
);

export { MyComponentSkeleton };
```

### Step 4: Export from index.ts

```typescript
// In lazy/index.ts
export * from './LazyXXX';
```

### Step 5: Update Documentation

Add component to this README and to PERFORMANCE_OPTIMIZATION.md

## Migration Guide

### Before (Static Import)
```typescript
import FullCalendar from '@fullcalendar/react'
import { LineChart, BarChart } from 'recharts'
import ReportBuilder from '@/components/pages/Reports/ReportBuilder'

function MyPage() {
  return (
    <div>
      <FullCalendar {...props} />
      <LineChart data={data} />
      <ReportBuilder />
    </div>
  )
}
```

### After (Lazy Import)
```typescript
import { Suspense } from 'react'
import {
  LazyAppointmentCalendar,
  LazyLineChart,
  LazyReportBuilder,
  CalendarSkeleton,
  ChartSkeleton,
  PageSkeleton
} from '@/components/lazy'

function MyPage() {
  return (
    <div>
      <Suspense fallback={<CalendarSkeleton />}>
        <LazyAppointmentCalendar {...props} />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <LazyLineChart data={data} />
      </Suspense>

      <Suspense fallback={<PageSkeleton />}>
        <LazyReportBuilder />
      </Suspense>
    </div>
  )
}
```

## Performance Impact

### Before Optimization
- Initial bundle: ~800KB (gzipped: ~250KB)
- Time to Interactive: ~4.5s (3G)
- Lighthouse Performance: 75

### After Optimization (Projected)
- Initial bundle: ~500KB (gzipped: ~150KB)
- Time to Interactive: ~3.0s (3G)
- Lighthouse Performance: 90+

### Bundle Size Savings
- Charts (recharts): -92KB (-28KB gzipped)
- Calendar (fullcalendar): -158KB (-45KB gzipped)
- Large page components: -50-150KB each
- **Total savings: 300-500KB**

## Troubleshooting

### Issue: "Component not rendering"
**Cause:** Missing Suspense boundary
**Fix:** Wrap lazy component with `<Suspense>`

### Issue: "SSR hydration mismatch"
**Cause:** Component needs SSR
**Fix:** Set `ssr: true` in dynamic() options

### Issue: "Flash of loading state"
**Cause:** Component loading too fast
**Fix:** Add minimum delay or use better skeleton

### Issue: "Bundle still large"
**Cause:** Not all heavy imports lazy loaded
**Fix:** Run bundle analysis, identify remaining heavy imports

## Best Practices

1. **Always use Suspense**
   ```typescript
   <Suspense fallback={<Skeleton />}>
     <LazyComponent />
   </Suspense>
   ```

2. **Provide meaningful loading states**
   ```typescript
   // ✅ Good - matches layout
   <Suspense fallback={<ChartSkeleton />}>
     <LazyChart />
   </Suspense>

   // ❌ Bad - generic spinner
   <Suspense fallback={<Spinner />}>
     <LazyChart />
   </Suspense>
   ```

3. **Group related lazy imports**
   ```typescript
   // ✅ Good - single suspense boundary
   <Suspense fallback={<AnalyticsSkeleton />}>
     <LazyLineChart data={data1} />
     <LazyBarChart data={data2} />
   </Suspense>

   // ❌ Bad - multiple suspense boundaries
   <Suspense fallback={<Skeleton />}>
     <LazyLineChart data={data1} />
   </Suspense>
   <Suspense fallback={<Skeleton />}>
     <LazyBarChart data={data2} />
   </Suspense>
   ```

4. **Don't lazy load critical path**
   ```typescript
   // ❌ Bad - authentication is critical
   const LazyAuthGuard = dynamic(() => import('./AuthGuard'))

   // ✅ Good - regular import
   import { AuthGuard } from './AuthGuard'
   ```

## Testing

### Unit Tests
```typescript
import { render, screen } from '@testing-library/react'
import { LazyLineChart } from '@/components/lazy'

test('renders chart with suspense', async () => {
  render(
    <Suspense fallback={<div>Loading...</div>}>
      <LazyLineChart data={mockData} />
    </Suspense>
  )

  expect(screen.getByText('Loading...')).toBeInTheDocument()

  // Wait for chart to load
  await waitFor(() => {
    expect(screen.getByRole('chart')).toBeInTheDocument()
  })
})
```

### E2E Tests
```typescript
test('loads analytics page with lazy charts', async () => {
  await page.goto('/analytics')

  // Should show loading skeleton initially
  await expect(page.locator('[data-testid="chart-skeleton"]')).toBeVisible()

  // Chart should load
  await expect(page.locator('[data-testid="line-chart"]')).toBeVisible()
})
```

## Monitoring

Track lazy loading impact:
- Bundle size in CI/CD
- Lighthouse scores
- Core Web Vitals
- User perceived performance

## Resources

- [Next.js Dynamic Imports](https://nextjs.org/docs/advanced-features/dynamic-import)
- [React.lazy()](https://react.dev/reference/react/lazy)
- [Code Splitting](https://react.dev/learn/code-splitting)
- [Performance Optimization Guide](../../PERFORMANCE_OPTIMIZATION.md)

## Maintenance

- **Weekly:** Review new heavy components
- **Monthly:** Analyze bundle size impact
- **Quarterly:** Refactor large components

---

**Created:** 2025-11-02
**Last Updated:** 2025-11-02
**Maintainer:** Frontend Performance Team
