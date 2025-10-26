# Performance Optimization Implementation Guide

This guide provides step-by-step instructions for implementing the performance optimizations in the White Cross application.

---

## Quick Start (30 minutes)

### Step 1: Integrate Performance Monitoring (5 minutes)

Add to `src/bootstrap.ts` or `src/App.tsx`:

```typescript
import { initPerformanceMetrics } from '@/lib/performance';

// In initialization function
initPerformanceMetrics({
  debug: import.meta.env.DEV,
  analytics: {
    sendEvent: (eventName, params) => {
      // Send to your analytics platform
      if (window.gtag) {
        window.gtag('event', eventName, params);
      }
    }
  }
});
```

### Step 2: Lazy Load Sentry (5 minutes)

Replace direct Sentry import with lazy loading:

```typescript
// ❌ Before (in App.tsx or bootstrap.ts)
import * as Sentry from '@sentry/browser';
Sentry.init({ /* config */ });

// ✅ After
if (import.meta.env.PROD) {
  import('@sentry/browser').then((Sentry) => {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      tracesSampleRate: 0.1,
    });
  });
}
```

**Impact:** Saves 474 KB (151 KB gzipped), improves FCP by 200-300ms

### Step 3: Remove Moment.js (10 minutes)

1. Find all moment usages:
```bash
cd frontend
grep -r "from 'moment'" src/
grep -r "import moment" src/
```

2. Replace with date-fns:
```typescript
// ❌ Before
import moment from 'moment';
const formatted = moment(date).format('YYYY-MM-DD');

// ✅ After
import { format } from 'date-fns';
const formatted = format(date, 'yyyy-MM-dd');
```

3. Remove from package.json:
```bash
npm uninstall moment
```

**Impact:** Saves 82 KB (25 KB gzipped)

### Step 4: Update Routes to Lazy Load (10 minutes)

Replace route imports in `src/routes/index.tsx`:

```typescript
// ❌ Before
import Dashboard from '../pages/dashboard/Dashboard';
import HealthRecords from '../pages/health/HealthRecords';

// ✅ After
import {
  Dashboard,
  HealthRecords,
  // ... other routes
} from './lazyRoutes';
```

The `lazyRoutes.ts` file is already created with all routes properly lazy-loaded.

---

## Medium Priority (1-2 hours)

### Step 5: Add Route Prefetching

In navigation components (sidebar, header):

```typescript
import { HealthRecords, Dashboard } from '@/routes/lazyRoutes';

<Link
  to="/health-records"
  onMouseEnter={() => {
    if ('preload' in HealthRecords) {
      (HealthRecords as any).preload();
    }
  }}
>
  Health Records
</Link>
```

### Step 6: Optimize List Components

For large lists (students, health records, medications):

```typescript
import { optimizedMemo, shallowCompareProps } from '@/lib/performance/componentOptimization';

const StudentListItem = optimizedMemo(
  ({ student }) => {
    return (
      <div className="student-item">
        <h3>{student.name}</h3>
        <p>{student.grade}</p>
      </div>
    );
  },
  {
    compareProps: (prev, next) => prev.student.id === next.student.id,
    displayName: 'StudentListItem'
  }
);
```

### Step 7: Add Virtual Scrolling for Long Lists

For lists with 1000+ items:

```typescript
import { VirtualList } from '@/lib/performance/componentOptimization';

function StudentsList({ students }) {
  return (
    <VirtualList
      items={students}
      itemHeight={60}
      containerHeight={600}
      renderItem={(student) => (
        <StudentListItem student={student} />
      )}
    />
  );
}
```

### Step 8: Implement Image Lazy Loading

```typescript
import { useIntersectionObserver } from '@/lib/performance/componentOptimization';

function LazyImage({ src, alt }) {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <div ref={ref}>
      {isVisible ? (
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      ) : (
        <div className="placeholder" />
      )}
    </div>
  );
}
```

---

## Advanced Optimizations (2-4 hours)

### Step 9: Fix Dynamic Import Warnings

Edit these files to remove static imports:

**`src/stores/domains/core/index.ts`:**
```typescript
// ❌ Before
import { coreSlice } from './slice';
export { coreSlice };
export const loadCore = () => import('./slice');

// ✅ After
export const loadCoreSlice = () => import('./slice');

// If you need to export types
export type { CoreState } from './types';
```

Repeat for:
- `src/stores/domains/healthcare/index.ts`
- `src/stores/domains/administration/index.ts`
- `src/stores/domains/communication/index.ts`

### Step 10: Optimize Dashboard Charts

```typescript
import { optimizedMemo } from '@/lib/performance/componentOptimization';
import { useMemo } from 'react';

const DashboardChart = optimizedMemo(({ data, type }) => {
  // Memoize chart data processing
  const chartData = useMemo(() => {
    return processChartData(data, type);
  }, [data, type]);

  return <Chart data={chartData} />;
}, {
  compareProps: (prev, next) => {
    return prev.type === next.type &&
           prev.data.length === next.data.length;
  }
});
```

### Step 11: Add Render Time Monitoring

For critical components:

```typescript
import { useSlowRenderDetection } from '@/lib/performance/componentOptimization';

function DashboardPage() {
  useSlowRenderDetection('DashboardPage', 50, (duration) => {
    console.warn(`Dashboard took ${duration}ms to render`);
    // Send to analytics
  });

  return <div>Dashboard content</div>;
}
```

### Step 12: Implement Intelligent Prefetching

```typescript
import { intelligentPrefetcher } from '@/lib/performance';

// In your navigation component
useEffect(() => {
  // Prefetch visible links automatically
  intelligentPrefetcher.prefetchVisibleLinks({
    rootMargin: '50px'
  });
}, []);
```

---

## Testing and Validation

### Lighthouse Audit

```bash
# Build production version
npm run build

# Serve production build
npm run preview

# Run Lighthouse (in Chrome DevTools)
# 1. Open http://localhost:4173
# 2. Open DevTools (F12)
# 3. Go to Lighthouse tab
# 4. Click "Analyze page load"
```

**Target Scores:**
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

### Bundle Size Analysis

```bash
# Analyze bundle with visualizer
ANALYZE=true npm run build

# Check bundle sizes
ls -lh dist/assets/js/
```

**Targets:**
- Initial bundle: < 350 KB gzipped
- Vendor chunks: < 100 KB each gzipped
- Route chunks: < 50 KB each gzipped

### Performance Metrics

Check in production (with real users):

```typescript
// View metrics in browser console
import { getMetricsInstance } from '@/lib/performance';

const metrics = getMetricsInstance();
console.log(metrics?.getSummary());
```

Expected output:
```javascript
{
  LCP: { value: 2100, rating: 'good', unit: 'ms' },
  FID: { value: 45, rating: 'good', unit: 'ms' },
  CLS: { value: 0.05, rating: 'good', unit: 'score' },
  // ...
}
```

---

## Common Issues and Solutions

### Issue 1: "Module not found" after lazy loading

**Solution:** Ensure all lazy-loaded modules exist and paths are correct.

```typescript
// Check the path
const Dashboard = lazyWithRetry(
  () => import('@/pages/dashboard/Dashboard') // ✅ Correct
  // () => import('./Dashboard') // ❌ Wrong if not in same directory
);
```

### Issue 2: Lazy loading breaks on development hot reload

**Solution:** This is normal. Use retry logic to handle temporary failures.

```typescript
const Component = lazyWithRetry(
  () => import('./Component'),
  { maxRetries: 3, retryDelay: 1000 }
);
```

### Issue 3: Performance metrics not showing

**Solution:** Ensure Web Vitals is properly initialized.

```typescript
// Check browser console for errors
import { initPerformanceMetrics } from '@/lib/performance';

initPerformanceMetrics({ debug: true }); // Enable debug mode
```

### Issue 4: Bundle size not decreasing after optimizations

**Solution:** Clear dist folder and rebuild.

```bash
rm -rf dist/
npm run build
```

Check actual gzipped sizes:
```bash
gzip -k dist/assets/js/*.js
ls -lh dist/assets/js/*.gz
```

---

## Monitoring in Production

### Setup Analytics

```typescript
// In App.tsx or bootstrap.ts
initPerformanceMetrics({
  analytics: {
    sendEvent: (eventName, params) => {
      // Google Analytics
      if (window.gtag) {
        window.gtag('event', eventName, {
          event_category: 'Performance',
          event_label: params.metric_name,
          value: Math.round(params.metric_value),
          metric_rating: params.metric_rating,
        });
      }

      // Custom analytics endpoint
      fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: eventName, params }),
      });
    }
  }
});
```

### Setup Alerts

Create alerts for performance degradation:

```typescript
// In performance monitoring
const ALERT_THRESHOLDS = {
  LCP: 3000, // Alert if LCP > 3s
  FID: 150,  // Alert if FID > 150ms
  CLS: 0.15, // Alert if CLS > 0.15
};

function checkPerformanceAlerts(metrics) {
  Object.entries(metrics).forEach(([name, data]) => {
    if (data.value > ALERT_THRESHOLDS[name]) {
      sendAlert({
        type: 'performance_degradation',
        metric: name,
        value: data.value,
        threshold: ALERT_THRESHOLDS[name],
      });
    }
  });
}
```

---

## Next Steps

1. ✅ Implement Quick Start items (30 min)
2. ✅ Run Lighthouse audit to establish baseline
3. ✅ Implement Medium Priority items (1-2 hours)
4. ✅ Run Lighthouse audit again to measure improvement
5. ✅ Implement Advanced optimizations as needed
6. ✅ Setup continuous monitoring
7. ✅ Document performance budgets in CI/CD

---

## Resources

- [Web Vitals Documentation](https://web.dev/vitals/)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Vite Build Optimizations](https://vitejs.dev/guide/build.html)
- [Bundle Size Optimization](https://web.dev/reduce-javascript-payloads-with-code-splitting/)

---

**Last Updated:** 2025-10-26
**Owner:** Performance Optimization Specialist (Agent 14)
