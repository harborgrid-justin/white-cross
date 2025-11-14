# Frontend Performance Optimization Guide

**White Cross Healthcare Platform - Next.js 16 Frontend**

This guide covers all performance optimizations implemented in the frontend application to ensure fast, responsive user experience while maintaining HIPAA compliance.

---

## Table of Contents

1. [Code Splitting & Bundle Optimization](#code-splitting--bundle-optimization)
2. [Image Optimization](#image-optimization)
3. [Font Optimization](#font-optimization)
4. [Rendering Performance](#rendering-performance)
5. [Core Web Vitals](#core-web-vitals)
6. [Bundle Analysis](#bundle-analysis)
7. [Performance Monitoring](#performance-monitoring)

---

## Code Splitting & Bundle Optimization

### 1. Dynamic Imports for Heavy Components

All components over 500 lines are dynamically imported to reduce initial bundle size:

```typescript
// ✅ Good - Lazy load heavy components
import dynamic from 'next/dynamic';

const LazyComplianceDetail = dynamic(
  () => import('@/components/pages/Compliance/ComplianceDetail'),
  {
    loading: () => <PageLoadingFallback />,
    ssr: false, // Disable SSR for client-heavy components
  }
);
```

**Files:**
- `/src/components/lazy/LazyPages.tsx` - Page-level lazy loading
- `/src/components/lazy/LazyCharts.tsx` - Chart library lazy loading
- `/src/components/lazy/LazyModals.tsx` - Modal lazy loading
- `/src/components/lazy/LazyCalendar.tsx` - Calendar lazy loading

### 2. Route-Based Code Splitting

Next.js automatically splits code by route. Ensure each route is a separate page:

```
app/
├── (dashboard)/
│   ├── students/page.tsx      → students.[hash].js
│   ├── appointments/page.tsx  → appointments.[hash].js
│   └── medications/page.tsx   → medications.[hash].js
```

### 3. Vendor Chunk Configuration

Configured in `next.config.ts` for optimal caching:

```typescript
splitChunks: {
  cacheGroups: {
    vendor: {
      test: /node_modules/,
      name: 'vendor',
      chunks: 'all',
      priority: 20,
    },
    react: {
      test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
      name: 'react',
      priority: 30,
    },
    dataFetching: {
      test: /[\\/]node_modules[\\/](@tanstack|@apollo|axios)[\\/]/,
      name: 'data-fetching',
      priority: 28,
    },
    charts: {
      test: /[\\/]node_modules[\\/](recharts|d3)[\\/]/,
      name: 'charts',
      chunks: 'async', // Lazy load charts
      priority: 24,
    },
  },
}
```

---

## Image Optimization

### 1. Next.js Image Component

**Always use the Image component** instead of `<img>` tags:

```typescript
import { Image } from '@/components/ui/media';

// ✅ Good
<Image
  src="/images/student.jpg"
  alt="Student photo"
  width={200}
  height={200}
  priority={false} // Enable lazy loading
/>

// ❌ Bad
<img src="/images/student.jpg" alt="Student photo" />
```

### 2. Priority Loading

Set `priority={true}` for above-the-fold images:

```typescript
// Hero image - loads immediately
<Image
  src="/images/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  priority={true}
/>
```

### 3. Responsive Images

Use `sizes` prop for responsive images:

```typescript
<Image
  src="/images/banner.jpg"
  alt="Banner"
  width={1920}
  height={400}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### 4. Image Configuration

Configured in `next.config.ts`:

```typescript
images: {
  formats: ['image/avif', 'image/webp'], // Modern formats first
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60,
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**.amazonaws.com',
      pathname: '/whitecross/**',
    },
  ],
}
```

---

## Font Optimization

### 1. next/font Implementation

Fonts are optimized using `next/font` in `/src/lib/fonts/index.ts`:

```typescript
import { Inter } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevents FOIT
  variable: '--font-inter',
  preload: true, // Preload critical font
  weight: ['400', '500', '600', '700'], // Only needed weights
});
```

### 2. Font Preloading

Fonts are automatically preloaded by Next.js when using `next/font`.

### 3. Font Subsetting

Google Fonts automatically subsets fonts to Latin characters only (`subsets: ['latin']`), reducing file size by 60-70%.

---

## Rendering Performance

### 1. React.memo for Expensive Components

Prevent unnecessary re-renders:

```typescript
import React, { memo } from 'react';

export const StudentCard = memo(function StudentCard({ student }) {
  return <div>{student.name}</div>;
});
```

**57 components** currently use React.memo.

### 2. Virtual Scrolling

For long lists (1000+ items), use virtual scrolling:

```typescript
import { useVirtualScroll } from '@/hooks/performance';

function StudentList({ students }) {
  const { parentRef, virtualItems, totalSize } = useVirtualScroll({
    count: students.length,
    estimateSize: 80, // Each row ~80px
    overscan: 5, // Render 5 extra items
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div style={{ height: `${totalSize}px`, position: 'relative' }}>
        {virtualItems.map((item) => (
          <div
            key={item.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${item.start}px)`,
            }}
          >
            <StudentCard student={students[item.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 3. Debouncing & Throttling

For frequent events (search, scroll, resize):

```typescript
import { debounce } from '@/utils/performance';

const handleSearch = debounce((query: string) => {
  // Expensive search operation
  searchStudents(query);
}, 300);

<input onChange={(e) => handleSearch(e.target.value)} />
```

### 4. Web Workers

For CPU-intensive tasks:

```typescript
import { useWebWorker } from '@/hooks/performance';

function DataProcessor() {
  const { run, isRunning } = useWebWorker('/workers/process-data.js');

  const processData = async () => {
    const result = await run({ data: largeDataset });
    console.log('Processed:', result);
  };

  return (
    <button onClick={processData} disabled={isRunning}>
      Process
    </button>
  );
}
```

### 5. Intersection Observer

For lazy loading below-fold content:

```typescript
// OptimizedImage component uses IntersectionObserver
<OptimizedImage
  src="/images/large.jpg"
  alt="Lazy loaded"
  priority={false} // Will lazy load when in viewport
/>
```

---

## Core Web Vitals

### Target Metrics

| Metric | Target | Description |
|--------|--------|-------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Time to load largest content element |
| **FID** (First Input Delay) | < 100ms | Time from first interaction to response |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Visual stability during load |
| **INP** (Interaction to Next Paint) | < 200ms | Responsiveness to interactions |
| **FCP** (First Contentful Paint) | < 1.8s | Time to first content |
| **TTFB** (Time to First Byte) | < 800ms | Server response time |

### Monitoring

Web Vitals are monitored in `/src/lib/performance/web-vitals.ts`:

```typescript
import { initWebVitals } from '@/lib/performance/web-vitals';

// In app/layout.tsx or _app.tsx
useEffect(() => {
  initWebVitals({
    debug: process.env.NODE_ENV === 'development',
    analytics: {
      sendEvent: (name, params) => {
        // Send to Datadog, Sentry, etc.
      }
    }
  });
}, []);
```

---

## Bundle Analysis

### Run Bundle Analyzer

```bash
# Analyze bundle size
ANALYZE=true npm run build

# View reports
open .next/analyze/client.html
open .next/analyze/server.html
```

### Bundle Size Targets

| Bundle | Target Size | Description |
|--------|-------------|-------------|
| **Initial** | < 200 KB | First load JS |
| **Vendor** | < 150 KB | React, Redux, etc. |
| **Page chunks** | < 50 KB each | Individual routes |
| **Total** | < 500 KB | All JS combined |

### Optimization Checklist

- ✅ Tree shaking enabled (ES modules)
- ✅ Minification enabled (production)
- ✅ Compression enabled (gzip/brotli)
- ✅ Code splitting by route
- ✅ Lazy loading for heavy components
- ✅ Dynamic imports for charts/calendars
- ✅ Vendor chunk separation
- ✅ CSS optimization (PurgeCSS via Tailwind)

---

## Performance Monitoring

### Tools

1. **Lighthouse** - Overall performance audit
   ```bash
   npm run build && npm start
   # Then run Lighthouse in Chrome DevTools
   ```

2. **WebPageTest** - Real-world performance
   - Test URL: https://webpagetest.org
   - Location: Dulles, VA
   - Browser: Chrome
   - Connection: 3G/4G

3. **Bundle Analyzer** - Bundle composition
   ```bash
   ANALYZE=true npm run build
   ```

4. **Chrome DevTools** - Performance profiling
   - Performance tab
   - Network tab
   - Coverage tab (find unused code)

### Continuous Monitoring

Web Vitals are automatically reported to:
- **Datadog RUM** (if configured)
- **Sentry Performance** (if configured)
- **Console** (development mode)

---

## Performance Budget

### Enforced in webpack config:

```typescript
performance: {
  maxAssetSize: 244000, // 244 KB
  maxEntrypointSize: 244000,
  hints: 'error', // Fail build if exceeded
}
```

### CI/CD Integration

```yaml
# .github/workflows/performance.yml
- name: Check bundle size
  run: |
    npm run build
    npm run bundle-size:check
```

---

## Best Practices

### ✅ DO

- Use `dynamic()` for components > 500 lines
- Use `Image` component for all images
- Set `priority={true}` for above-the-fold images
- Use `React.memo` for expensive components
- Use virtual scrolling for lists > 100 items
- Debounce search/filter inputs
- Use Web Workers for heavy computations
- Lazy load chart libraries
- Preload critical fonts
- Monitor Web Vitals in production

### ❌ DON'T

- Use `<img>` tags
- Import entire libraries (`import _ from 'lodash'`)
- Load all data upfront (paginate!)
- Render 1000+ items without virtualization
- Block main thread with heavy computations
- Ignore bundle size warnings
- Skip performance testing
- Use inline styles for large components
- Load unnecessary fonts

---

## Troubleshooting

### Issue: Large bundle size

**Solution:**
1. Run bundle analyzer: `ANALYZE=true npm run build`
2. Identify large dependencies
3. Use dynamic imports for heavy components
4. Replace large libraries with lighter alternatives

### Issue: Slow page load

**Solution:**
1. Check Lighthouse score
2. Enable priority loading for critical images
3. Reduce JavaScript bundle size
4. Enable CDN for static assets

### Issue: UI freezing

**Solution:**
1. Use virtual scrolling for long lists
2. Move heavy computations to Web Workers
3. Debounce frequent operations
4. Use `React.memo` to prevent unnecessary renders

---

## Resources

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Core Web Vitals](https://web.dev/vitals/)
- [Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)
