# Performance Monitoring Quick Start Guide

**For Developers** | **White Cross Healthcare Platform**

---

## Overview

This guide provides quick copy-paste examples for implementing performance monitoring and optimization in your pages.

---

## 1. Web Vitals Monitoring

**Already Active!** ✅

Web Vitals monitoring is automatically active on all pages via the root layout.

**Check Console (Development):**
```
🚀 Web Vitals Monitoring Active
[Web Vitals] LCP: 1850ms (good)
[Web Vitals] FID: 45ms (good)
[Web Vitals] CLS: 0.05 (good)
```

**No action needed** - metrics are automatically collected and can be sent to your analytics platform.

---

## 2. Add Auto-Refresh to Your Page

### Basic Pattern (Most Common)

```tsx
'use client'; // Required for hooks

import { useRefresh } from '@/hooks/utilities/useRefresh';

export default function YourPage() {
  const { refresh, isRefreshing, lastRefreshed } = useRefresh({
    interval: 60000, // Refresh every 60 seconds
    refreshWhenVisible: true, // Pause when tab hidden
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Your Page Title</h1>
        <div className="flex items-center gap-2">
          {lastRefreshed && (
            <span className="text-sm text-gray-500">
              Last updated: {lastRefreshed.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={refresh}
            disabled={isRefreshing}
            className="btn btn-primary"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      {/* Your content here */}
    </div>
  );
}
```

### With Pause/Resume Controls

```tsx
'use client';

import { useRefresh } from '@/hooks/utilities/useRefresh';

export default function YourPage() {
  const { refresh, isRefreshing, isPaused, pause, resume } = useRefresh({
    interval: 30000, // 30 seconds
  });

  return (
    <div>
      <div className="flex gap-2">
        <button onClick={isPaused ? resume : pause}>
          {isPaused ? '▶️ Resume' : '⏸️ Pause'} Auto-Refresh
        </button>
        <button onClick={refresh} disabled={isRefreshing}>
          🔄 Refresh Now
        </button>
      </div>
      {/* Your content */}
    </div>
  );
}
```

### Manual Refresh Only (No Auto-Refresh)

```tsx
'use client';

import { useSimpleRefresh } from '@/hooks/utilities/useRefresh';

export default function YourPage() {
  const refresh = useSimpleRefresh();

  return (
    <button onClick={refresh}>Refresh</button>
  );
}
```

---

## 3. Recommended Refresh Intervals

Use these guidelines to choose appropriate refresh intervals:

| Page Type | Interval | Rationale |
|-----------|----------|-----------|
| **Medication Administration** | 60 seconds | Critical patient safety data |
| **Emergency Notifications** | 30 seconds | Time-sensitive alerts |
| **Appointment Calendar** | 2 minutes | Multi-user scheduling coordination |
| **Dashboard/Analytics** | 5 minutes | Balance freshness with server load |
| **Admin Monitoring** | 15 seconds | Real-time system health |
| **Reports/Archives** | Manual only | Historical data doesn't change |

---

## 4. Optimistic Updates Pattern

Use this pattern for better UX when creating/updating data:

```tsx
'use client';

import { useState } from 'react';
import { useRefresh } from '@/hooks/utilities/useRefresh';
import { toast } from 'react-hot-toast';

export default function YourPage({ initialData }) {
  const { refresh } = useRefresh();
  const [data, setData] = useState(initialData);

  const handleCreate = async (newItem) => {
    // 1. Optimistic update (instant UI feedback)
    setData([...data, newItem]);

    try {
      // 2. Send to server
      await createItemAPI(newItem);

      // 3. Revalidate server data
      await refresh();

      toast.success('Item created!');
    } catch (error) {
      // 4. Rollback on error
      setData(data);
      toast.error('Failed to create item');
    }
  };

  return (
    <div>
      <button onClick={() => handleCreate({ name: 'New Item' })}>
        Add Item
      </button>
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 5. Custom Performance Metrics

Track custom timing metrics in your application:

```tsx
import { reportCustomMetric } from '@/components/monitoring/WebVitalsReporter';

// Example: Track API response time
const handleFetchData = async () => {
  const startTime = performance.now();

  const data = await fetchAPI('/api/students');

  const duration = performance.now() - startTime;
  reportCustomMetric('api_students_fetch', duration, 'ms');

  return data;
};

// Example: Track expensive computation
const handleComplexCalculation = () => {
  const startTime = performance.now();

  const result = performComplexCalculation();

  const duration = performance.now() - startTime;
  reportCustomMetric('complex_calculation', duration, 'ms');

  return result;
};
```

---

## 6. Performance Checklist

### Before Deploying Your Page

- [ ] Images are optimized (WebP/AVIF, proper sizes)
- [ ] Large components are code-split with `lazy()`
- [ ] Lists use virtual scrolling if > 100 items
- [ ] Expensive calculations use `useMemo()`
- [ ] Event handlers use `useCallback()`
- [ ] Forms are debounced/throttled
- [ ] Data refresh interval is appropriate
- [ ] Loading states are implemented
- [ ] Error boundaries are in place

### Testing Your Page

```bash
# 1. Build production bundle
npm run build

# 2. Test production server
npm run start

# 3. Run Lighthouse audit
# Chrome DevTools → Lighthouse → Generate Report
# Target: 90+ performance score

# 4. Check Web Vitals in console
# Look for [Web Vitals] logs
# Ensure all metrics are "good"
```

---

## 7. Common Issues & Solutions

### Issue: Page Re-renders Too Often

**Solution:** Use `React.memo` and `useCallback`

```tsx
import { memo, useCallback } from 'react';

const ExpensiveComponent = memo(({ data, onUpdate }) => {
  // Component will only re-render if data or onUpdate changes
  return <div>{data.name}</div>;
});

function ParentComponent() {
  // Memoize callback to prevent re-renders
  const handleUpdate = useCallback((id) => {
    updateData(id);
  }, []); // Dependencies array

  return <ExpensiveComponent data={data} onUpdate={handleUpdate} />;
}
```

### Issue: Slow Initial Load

**Solution:** Code splitting with lazy loading

```tsx
import { lazy, Suspense } from 'react';

// Split heavy components
const HeavyChart = lazy(() => import('./components/HeavyChart'));

export default function Dashboard() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyChart />
    </Suspense>
  );
}
```

### Issue: Auto-Refresh Causing Performance Issues

**Solution:** Use visibility detection (already built-in!)

```tsx
const { refresh } = useRefresh({
  interval: 30000,
  refreshWhenVisible: true, // ✅ Pauses when tab hidden
});
```

---

## 8. Quick Reference

### useRefresh Options

```typescript
interface UseRefreshOptions {
  interval?: number;              // Auto-refresh interval (ms)
  refreshWhenVisible?: boolean;   // Pause when tab hidden (default: true)
  onRefreshSuccess?: () => void;  // Success callback
  onRefreshError?: (err) => void; // Error callback
  debug?: boolean;                // Enable console logging
}
```

### useRefresh Return Value

```typescript
interface UseRefreshReturn {
  refresh: () => Promise<void>;  // Manual refresh function
  isRefreshing: boolean;         // Refresh in progress
  lastRefreshed: Date | null;    // Last refresh timestamp
  refreshCount: number;          // Total refresh count
  pause: () => void;             // Pause auto-refresh
  resume: () => void;            // Resume auto-refresh
  isPaused: boolean;             // Auto-refresh paused
}
```

---

## 9. Need Help?

### Documentation

- **Full Report:** `/docs/PERFORMANCE_MONITORING_REPORT.md`
- **Implementation Summary:** `/docs/AGENT_6_IMPLEMENTATION_SUMMARY.md`
- **Component Code:** `/src/components/monitoring/WebVitalsReporter.tsx`
- **Hook Code:** `/src/hooks/utilities/useRefresh.ts`

### External Resources

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web Vitals](https://web.dev/vitals/)
- [React Performance](https://react.dev/learn/render-and-commit)

---

**Quick Start Guide** | **Agent 6 - Performance and Monitoring** | **2025-10-31**
