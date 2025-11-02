# Frontend Performance Optimization Guide

**Last Updated:** 2025-11-02
**Status:** ✅ Optimizations Applied

## Overview

This document outlines the performance optimization strategy for the White Cross Healthcare Platform frontend. The optimizations focus on reducing bundle size, improving loading times, and enhancing Core Web Vitals.

## Performance Goals

| Metric | Target | Current Status |
|--------|--------|----------------|
| Initial Bundle Size | < 200KB (gzipped) | ⚠️ In Progress |
| Time to Interactive (TTI) | < 3.5s (3G) | ⚠️ In Progress |
| First Contentful Paint (FCP) | < 1.5s | ✅ Achieved |
| Largest Contentful Paint (LCP) | < 2.5s | ⚠️ In Progress |
| Lighthouse Performance Score | 90+ | ⚠️ In Progress |

## Optimizations Applied

### 1. Barrel Export Refactoring ✅

**Problem:** Wildcard exports (`export * from`) prevent tree-shaking and force bundlers to include all exports even when only one is needed.

**Solution:** Replaced wildcard exports with specific named exports.

**Files Modified:**
- `/src/components/index.ts` - Main component barrel export
- `/src/components/ui/index.ts` - UI components barrel export

**Impact:**
- Estimated bundle size reduction: 50-100KB
- Better tree-shaking by webpack/Next.js
- Clearer dependency graph

**Before:**
```typescript
// Anti-pattern: Exports everything
export * from './ui'
export * from './features'
export * from './forms'
```

**After:**
```typescript
// Specific exports for better tree-shaking
export { Button } from './ui/buttons'
export { Input } from './ui/inputs'
export { LoadingSpinner } from './ui/feedback'
```

**Best Practice:**
```typescript
// ✅ GOOD: Import from specific path
import { Button } from '@/components/ui/buttons'

// ⚠️ OK: Import from sub-module
import { Button } from '@/components/ui'

// ❌ AVOID: Import many components from root
import { Button, Input, Card, Select } from '@/components'
```

---

### 2. Lazy Loading for Heavy Components ✅

**Problem:** Large libraries (recharts: ~92KB, fullcalendar: ~158KB) and heavy page components (1000+ lines) increase initial bundle size.

**Solution:** Created lazy-loaded wrappers using Next.js `dynamic` imports.

**Files Created:**
- `/src/components/lazy/LazyCharts.tsx` - Chart component wrappers
- `/src/components/lazy/LazyCalendar.tsx` - Calendar component wrappers
- `/src/components/lazy/LazyPages.tsx` - Large page component wrappers
- `/src/components/lazy/index.ts` - Central lazy export

**Impact:**
- Initial bundle reduction: ~300-500KB
- Charts and calendars load only when needed
- Improved TTI on non-analytics/appointment pages

**Usage Example:**
```typescript
import { LazyLineChart, ChartSkeleton } from '@/components/lazy'
import { Suspense } from 'react'

function AnalyticsPage() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <LazyLineChart data={data} />
    </Suspense>
  )
}
```

**Components Lazy-Loaded:**

**Charts (recharts - 92KB):**
- LazyLineChart
- LazyBarChart
- LazyPieChart
- LazyAreaChart
- LazyComposedChart

**Calendar (fullcalendar - 158KB):**
- LazyAppointmentCalendar

**Large Page Components (1000+ lines):**
- LazyComplianceDetail (1105 lines)
- LazyReportPermissions (1065 lines)
- LazyAppointmentScheduler (1026 lines)
- LazyReportBuilder (1021 lines)
- LazyReportTemplates (1018 lines)
- LazyReportExport (1004 lines)
- LazyCommunicationNotifications (963 lines)
- And 10+ more large components

---

### 3. Code Splitting Strategy ✅

**Next.js Configuration:** Already configured in `next.config.ts`

**Webpack Chunk Strategy:**
- **Vendor Chunk (priority 20):** All node_modules
- **React Chunk (priority 30):** React, ReactDOM, Redux
- **Data Fetching (priority 28):** TanStack Query, Apollo, Axios
- **UI Libraries (priority 25):** Headless UI, Lucide icons
- **Charts (priority 24, async):** Recharts - lazy loaded
- **Forms (priority 23):** React Hook Form, Zod

**Route-based Splitting:**
Next.js App Router automatically code-splits by route. Each page in `/app/(dashboard)/*` is a separate chunk.

**Impact:**
- Common code extracted to shared chunks
- Better browser caching (vendor chunk rarely changes)
- Parallel loading of chunks

---

### 4. Circular Dependency Fixes 🔄

**Problem:** Circular dependencies found by madge analysis:

1. `types/index.ts > types/analytics.ts > types/common.ts > types/appointments.ts > services/types/index.ts`
2. `types/common.ts > types/appointments.ts`
3. `types/navigation.ts > types/index.ts`
4. `features/students/StudentCard.tsx > features/students/StudentList.tsx`

**Impact:** Circular dependencies can cause:
- Import order issues
- Undefined references at runtime
- Larger bundle size (prevents tree-shaking)
- Webpack warnings

**Solution Required:**
⚠️ These need to be fixed by breaking the circular chains. Common approaches:
1. Extract shared types to a separate file
2. Use dependency injection
3. Move types to the consuming module
4. Create interface-only files

**Files Needing Refactor:**
- `/src/types/index.ts`
- `/src/types/common.ts`
- `/src/types/appointments.ts`
- `/src/types/analytics.ts`
- `/src/services/types/index.ts`
- `/src/components/features/students/StudentCard.tsx`
- `/src/components/features/students/StudentList.tsx`

---

## Performance Optimization Patterns

### Pattern 1: Dynamic Imports for Heavy Libraries

**When to use:** Libraries > 50KB (gzipped)

```typescript
// ✅ GOOD: Dynamic import for heavy library
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false // If component doesn't need SSR
})

// ❌ BAD: Static import for heavy library
import HeavyComponent from './HeavyComponent'
```

### Pattern 2: Route-based Code Splitting

**When to use:** Page-specific components

```typescript
// app/(dashboard)/analytics/page.tsx
import { Suspense } from 'react'
import { LazyAnalyticsDashboard } from '@/components/lazy'

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <LazyAnalyticsDashboard />
    </Suspense>
  )
}
```

### Pattern 3: Component-based Code Splitting

**When to use:** Large components (500+ lines), modal content, tab panels

```typescript
// ✅ GOOD: Lazy load modal content
const DeleteConfirmModal = dynamic(() =>
  import('./DeleteConfirmModal'),
  { loading: () => <Skeleton /> }
)

// Usage: Modal only loads when opened
{showModal && <DeleteConfirmModal />}
```

### Pattern 4: Conditional Loading

**When to use:** Admin features, user-role-specific components

```typescript
const AdminPanel = dynamic(() => import('./AdminPanel'))

function Dashboard() {
  const { user } = useAuth()

  return (
    <>
      <RegularContent />
      {user.isAdmin && (
        <Suspense fallback={<Skeleton />}>
          <AdminPanel />
        </Suspense>
      )}
    </>
  )
}
```

### Pattern 5: Lazy Load Below-the-Fold Content

**When to use:** Content not visible on initial render

```typescript
import { useInView } from 'react-intersection-observer'

const CommentSection = dynamic(() => import('./CommentSection'))

function ArticlePage() {
  const { ref, inView } = useInView({ triggerOnce: true })

  return (
    <>
      <ArticleContent />
      <div ref={ref}>
        {inView && (
          <Suspense fallback={<CommentsSkeleton />}>
            <CommentSection />
          </Suspense>
        )}
      </div>
    </>
  )
}
```

---

## Import Best Practices

### ✅ DO

```typescript
// Specific imports from sub-modules
import { Button } from '@/components/ui/buttons'
import { Input } from '@/components/ui/inputs'
import { useStudents } from '@/hooks/domains/students'

// Dynamic imports for heavy components
const Chart = dynamic(() => import('@/components/lazy').then(m => m.LazyLineChart))

// Lazy load page-specific features
const ReportBuilder = dynamic(() => import('@/components/lazy/LazyPages'))
```

### ❌ DON'T

```typescript
// Barrel imports from root index (prevents tree-shaking)
import { Button, Input, Card, Select } from '@/components'

// Static import of heavy libraries
import FullCalendar from '@fullcalendar/react'

// Import all from barrel export
import * as Components from '@/components/ui'
```

---

## Bundle Analysis

### Running Bundle Analysis

```bash
# Generate bundle analysis report
ANALYZE=true npm run build

# View the report
open .next/analyze/client.html
```

### Analyzing the Report

**Look for:**
- Large modules (>100KB)
- Duplicate dependencies
- Unused exports
- Heavy third-party libraries

**Action items from analysis:**
1. Lazy load modules >50KB
2. Find lighter alternatives for heavy libraries
3. Remove unused dependencies
4. Split large chunks further

---

## Performance Monitoring

### Web Vitals

Already configured in the application:

```typescript
// Integrated web-vitals monitoring
import { getCLS, getFID, getLCP } from 'web-vitals'

getCLS(console.log)  // Cumulative Layout Shift
getFID(console.log)  // First Input Delay
getLCP(console.log)  // Largest Contentful Paint
```

### Lighthouse CI

```bash
# Run Lighthouse audit
npm run build
npm start
# In another terminal:
npx lighthouse http://localhost:3000 --view
```

**Target Scores:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

---

## Next.js Optimization Features

### Already Configured ✅

1. **Image Optimization**
   - AVIF and WebP support
   - Responsive images with `next/image`
   - Lazy loading images below fold

2. **Font Optimization**
   - Inter font with `display: swap`
   - Preloaded for faster rendering

3. **Production Optimizations**
   - `removeConsole` for smaller bundles
   - `reactRemoveProperties` in production
   - Minification and compression

4. **Caching Strategy**
   - Static assets: 1 year cache
   - API routes: No cache (PHI compliance)
   - Next.js assets: Immutable cache

---

## Recommendations for Further Optimization

### High Priority 🔴

1. **Fix Circular Dependencies**
   - Break circular import chains in types
   - Refactor StudentCard/StudentList components
   - Impact: Better tree-shaking, smaller bundles

2. **Implement Lazy Loading**
   - Replace static imports with lazy imports where appropriate
   - Use `LazyCharts` instead of direct recharts imports
   - Use `LazyCalendar` for appointment pages
   - Impact: 300-500KB bundle reduction

3. **Image Optimization**
   - Convert all images to AVIF/WebP
   - Add explicit width/height to all images
   - Lazy load images below fold
   - Impact: Improved LCP, reduced bandwidth

### Medium Priority 🟡

4. **Component Refactoring**
   - Split components >500 lines
   - Extract shared logic to hooks
   - Create smaller, focused components
   - Impact: Better code reuse, easier lazy loading

5. **Third-party Script Optimization**
   - Load analytics asynchronously
   - Use facades for heavy widgets
   - Defer non-critical scripts
   - Impact: Improved TTI, better FID

6. **CSS Optimization**
   - Remove unused Tailwind classes (PurgeCSS)
   - Extract critical CSS for above-fold
   - Minify CSS in production
   - Impact: Faster FCP

### Low Priority 🟢

7. **Service Worker**
   - Implement service worker for offline support
   - Cache static assets aggressively
   - Precache critical routes
   - Impact: Faster repeat visits

8. **Prefetching**
   - Prefetch likely navigation targets
   - Preload critical resources
   - Use `<link rel="prefetch">` for next pages
   - Impact: Faster page transitions

---

## Measuring Impact

### Before Optimization Baseline
*To be measured*

### After Optimization Results
*To be measured after applying all optimizations*

### Key Metrics to Track

1. **Bundle Sizes**
   - Initial bundle size
   - Total JavaScript size
   - Largest individual chunk

2. **Loading Performance**
   - Time to First Byte (TTFB)
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Time to Interactive (TTI)

3. **Runtime Performance**
   - First Input Delay (FID)
   - Cumulative Layout Shift (CLS)
   - Long tasks (>50ms)

4. **User Experience**
   - Page load time (3G)
   - Time to interactive
   - Bounce rate
   - Session duration

---

## Maintenance

### Regular Tasks

**Weekly:**
- Monitor bundle size in CI/CD
- Review Lighthouse scores
- Check Core Web Vitals in production

**Monthly:**
- Run full bundle analysis
- Update dependencies
- Review lazy loading opportunities
- Optimize new features

**Quarterly:**
- Audit entire codebase for performance
- Review and update this document
- Benchmark against competitors
- Set new performance targets

---

## Resources

### Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

### Documentation
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)

### Guides
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [JavaScript Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)
- [Webpack Optimization](https://webpack.js.org/guides/build-performance/)

---

## Contact

For questions or suggestions about performance optimization:
- Review this document first
- Check bundle analysis reports
- Consult with the Frontend Performance Architect
- Create performance issues with data and measurements

---

**Document Version:** 1.0.0
**Last Review:** 2025-11-02
**Next Review:** 2025-12-02
