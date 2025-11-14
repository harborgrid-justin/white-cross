# Performance Import Guide

**White Cross Healthcare Platform - Frontend Performance Optimization**

This guide documents best practices for imports and lazy loading to optimize bundle size and performance.

## Table of Contents

1. [Import Patterns](#import-patterns)
2. [Lazy Loading](#lazy-loading)
3. [Tree Shaking](#tree-shaking)
4. [Component Splitting](#component-splitting)
5. [Performance Metrics](#performance-metrics)

---

## Import Patterns

### ✅ RECOMMENDED: Direct Named Imports

Always import directly from the component file for optimal tree-shaking:

```tsx
// BEST - Direct import from specific file
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { useStudents } from '@/hooks/domains/students'

// GOOD - Import from category barrel if needed
import { Button, Input } from '@/components/ui'

// AVOID - Wildcard imports prevent tree-shaking
import * as UI from '@/components/ui'
```

### ❌ AVOID: Barrel Export Wildcards

Barrel exports with `export *` prevent tree-shaking:

```tsx
// BAD - Prevents tree-shaking
export * from './NotificationBadge'
export * from './NotificationItem'

// GOOD - Named exports enable tree-shaking
export { NotificationBadge } from './NotificationBadge'
export { NotificationItem } from './NotificationItem'
export type * from './NotificationBadge' // Types only
```

---

## Lazy Loading

### When to Use Lazy Loading

✅ **DO lazy load:**
- Heavy page components (500+ lines)
- Chart components (recharts, d3)
- Calendar components (FullCalendar)
- Modal/Dialog content
- Route-specific features
- Admin-only features
- Below-the-fold components

❌ **DON'T lazy load:**
- Above-the-fold content
- Critical path components (buttons, inputs)
- Small components (<50 lines)
- Layout components needed immediately

### Lazy Loading Patterns

#### 1. Page Components

```tsx
// src/app/(dashboard)/billing/analytics/page.tsx
'use client'

import { Suspense } from 'react'
import { LazyBillingAnalytics, PageSkeleton } from '@/components/lazy'

export default function BillingAnalyticsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <LazyBillingAnalytics {...props} />
    </Suspense>
  )
}
```

#### 2. Chart Components

```tsx
import { Suspense } from 'react'
import { LazyBarChart, ChartSkeleton } from '@/components/lazy'

function Analytics() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <LazyBarChart data={data} />
    </Suspense>
  )
}
```

#### 3. Modal Components

```tsx
import { useState, Suspense } from 'react'
import { LazyStudentFormModal, ModalSkeleton } from '@/components/lazy'

function StudentList() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add Student</Button>
      {isOpen && (
        <Suspense fallback={<ModalSkeleton />}>
          <LazyStudentFormModal onClose={() => setIsOpen(false)} />
        </Suspense>
      )}
    </>
  )
}
```

#### 4. Creating New Lazy Components

```tsx
// src/components/lazy/LazyFeatures.tsx
'use client'

import dynamic from 'next/dynamic'

export const LazyHeavyFeature = dynamic(
  () => import('@/components/features/HeavyFeature'),
  {
    loading: () => <LoadingSkeleton />,
    ssr: false, // Disable SSR for client-only features
  }
)
```

---

## Tree Shaking

### Package Imports Optimization

Next.js is configured to optimize these packages in `next.config.ts`:

```ts
experimental: {
  optimizePackageImports: [
    'lucide-react',        // Icon library
    '@headlessui/react',   // UI primitives
    'recharts',            // Charts
    'date-fns',            // Date utilities
    'lodash',              // Utilities
    '@tanstack/react-query',
    'react-hook-form',
  ],
}
```

### Icon Imports

```tsx
// BEST - Tree-shakeable
import { User, Settings, Home } from 'lucide-react'

// AVOID - Imports entire library
import * as Icons from 'lucide-react'
```

### Utility Imports

```tsx
// BEST - Import specific functions
import { format, parseISO } from 'date-fns'

// AVOID - Import entire library
import * as dateFns from 'date-fns'
```

---

## Component Splitting

### Route-Based Splitting

Next.js App Router automatically splits by route:

```
src/app/
├── (dashboard)/
│   ├── students/page.tsx    -> students.chunk.js
│   ├── medications/page.tsx -> medications.chunk.js
│   └── billing/page.tsx     -> billing.chunk.js
```

### Manual Code Splitting

For shared heavy components, use dynamic imports:

```tsx
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
})
```

### Chunk Strategy (next.config.ts)

```ts
splitChunks: {
  cacheGroups: {
    // Framework (React, Redux) - Priority 30
    react: {
      test: /[\\/]node_modules[\\/](react|react-dom|@reduxjs)[\\/]/,
      name: 'react',
      priority: 30,
    },
    // Data fetching - Priority 28
    dataFetching: {
      test: /[\\/]node_modules[\\/](@tanstack|@apollo|axios)[\\/]/,
      name: 'data-fetching',
      priority: 28,
    },
    // Charts (async) - Priority 24
    charts: {
      test: /[\\/]node_modules[\\/](recharts|d3)[\\/]/,
      name: 'charts',
      chunks: 'async', // Load only when needed
      priority: 24,
    },
  }
}
```

---

## Performance Metrics

### Bundle Size Improvements

| Optimization | Bundle Size Reduction | Notes |
|-------------|----------------------|-------|
| Lazy-loaded pages (15 components) | ~500-700 KB | 1000+ line components |
| Lazy-loaded charts | ~92 KB | Recharts library |
| Lazy-loaded calendar | ~158 KB | FullCalendar |
| Tree-shakeable barrel exports | ~100-200 KB | Estimated |
| Optimized package imports | ~50-100 KB | lucide-react, date-fns |
| **Total Estimated Savings** | **~900 KB - 1.2 MB** | Gzipped: ~300-400 KB |

### Components Currently Lazy-Loaded

#### Page Components (15)
- `LazyComplianceDetail` (1105 lines)
- `LazyReportPermissions` (1065 lines)
- `LazyAppointmentScheduler` (1026 lines)
- `LazyReportBuilder` (1021 lines)
- `LazyReportTemplates` (1018 lines)
- `LazyReportExport` (1004 lines)
- `LazyBillingDetail` (930 lines)
- `LazyCommunicationNotifications` (963 lines)
- `LazyCommunicationHistory` (920 lines)
- `LazyBillingPayment` (802 lines)
- `LazyBillingAnalytics` (717 lines)
- `LazyBillingList` (762 lines)
- `LazyMedicationAlerts` (766 lines)
- Plus 7 more billing and communication components

#### Chart Components (5)
- `LazyLineChart`
- `LazyBarChart`
- `LazyPieChart`
- `LazyAreaChart`
- `LazyComposedChart`

#### Calendar Components (1)
- `LazyAppointmentCalendar`

#### Modal Components (6)
- `LazyStudentFormModal`
- `LazyMessageComposerModal`
- `LazyBroadcastManagerModal`
- `LazyNotificationCenter`
- `LazyNotificationSettings`
- `LazyAdvancedSearch`

---

## Implementation Checklist

### For New Features

- [ ] Is the component >500 lines? → Use lazy loading
- [ ] Does it use heavy libraries (charts, editors)? → Use lazy loading
- [ ] Is it route-specific? → Already split by Next.js
- [ ] Is it a modal/dialog? → Use lazy loading
- [ ] Creating barrel exports? → Use named exports, not `export *`
- [ ] Importing icons? → Import specific icons only
- [ ] Using date utilities? → Import specific functions only

### For Existing Code

- [ ] Replace `export *` with named exports
- [ ] Update imports to use lazy components where appropriate
- [ ] Add Suspense boundaries with proper loading states
- [ ] Test that lazy loading works correctly
- [ ] Verify bundle size improvements with `ANALYZE=true npm run build`

---

## Bundle Analysis

### Run Bundle Analyzer

```bash
ANALYZE=true npm run build
```

Then open `.next/analyze/client.html` to view bundle composition.

### Key Metrics to Monitor

1. **Main Bundle** - Should be < 200 KB (gzipped)
2. **Vendor Chunks** - React, data-fetching, forms
3. **Route Chunks** - Each page should be separate
4. **Async Chunks** - Charts, modals should load on demand

### Performance Testing

```bash
# Lighthouse CI
npm run lighthouse

# Playwright performance tests
npm run test:e2e

# Build and analyze
npm run build && ls -lh .next/static/chunks/
```

---

## Common Pitfalls

### 1. Lazy Loading Too Early

```tsx
// BAD - Lazy loads before user interaction
const Modal = lazy(() => import('./Modal'))
<Modal isOpen={false} /> // Still loads immediately!

// GOOD - Conditional rendering with lazy load
{isOpen && (
  <Suspense fallback={<Skeleton />}>
    <LazyModal />
  </Suspense>
)}
```

### 2. Missing Suspense Boundaries

```tsx
// BAD - No loading state
<LazyComponent />

// GOOD - Proper Suspense boundary
<Suspense fallback={<LoadingSkeleton />}>
  <LazyComponent />
</Suspense>
```

### 3. Over-Optimization

```tsx
// BAD - Lazy loading small components
const Button = lazy(() => import('./Button')) // 20 lines

// GOOD - Direct import for small components
import { Button } from '@/components/ui/button'
```

---

## Resources

- [Next.js Code Splitting](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
- [React Suspense](https://react.dev/reference/react/Suspense)
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [Web Vitals](https://web.dev/vitals/)

---

**Last Updated:** 2025-11-02
**Maintained by:** Frontend Performance Team
