# Next.js Performance Audit Report

**Project:** White Cross Healthcare Platform
**Next.js Version:** 16.0.0
**React Version:** 19.2.0
**Audit Date:** 2025-10-27
**Total Files Analyzed:** 2,528 TypeScript files
**Total Pages:** 173 page components

---

## Executive Summary

### Overall Performance Score: 6.5/10

**Strengths:**
- Modern Next.js 16 with App Router
- Excellent server/client component ratio (163:10 pages)
- Good webpack chunking strategy
- Web Vitals monitoring implemented
- Strong security headers (HIPAA compliant)
- Lighthouse CI with strict thresholds

**Critical Issues:**
- No font optimization (next/font disabled)
- Heavy libraries (FullCalendar ~200KB, Recharts ~100KB) not code-split
- Over-use of client components (101 'use client' directives)
- Minimal dynamic imports and code splitting
- Limited Suspense and streaming usage
- Few loading states across application

---

## 1. Next.js 15+ Features Analysis

### ✅ GOOD: App Router Adoption
- **Status:** Fully implemented
- **Details:** Using App Router with proper route groups `(auth)` and `(dashboard)`
- **File Structure:** `/home/user/white-cross/nextjs/src/app/`

### ⚠️ MIXED: Server vs Client Components
**Server Components (Good):**
- 163 out of 173 page components are server components
- Excellent ratio for SSR benefits

**Client Components (Over-used):**
- 101 total files with `'use client'` directive
- Many components could be server components
- Dashboard layout is client component unnecessarily

**Impact:**
- Increased JavaScript bundle size
- Reduced performance benefits of React Server Components
- Missed opportunities for server-side data fetching

**Recommendations:**
```typescript
// ❌ BAD: /src/app/(dashboard)/layout.tsx
'use client';
export default function DashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // ...
}

// ✅ GOOD: Split into server/client
// layout.tsx (Server Component)
export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Header />
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}

// Header.tsx (Client Component) - only what needs interactivity
'use client';
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // ...
}
```

### ❌ POOR: Limited Suspense & Streaming
**Current State:**
- Only 10 files use Suspense
- No streaming patterns found
- Only 4 loading.tsx files (root + students)

**Missing Files:**
```
/app/(dashboard)/medications/loading.tsx
/app/(dashboard)/appointments/loading.tsx
/app/(dashboard)/incidents/loading.tsx
/app/(dashboard)/analytics/loading.tsx
/app/(dashboard)/communications/loading.tsx
```

**Recommendation:**
```typescript
// Add loading.tsx to every route segment
// /app/(dashboard)/medications/loading.tsx
export default function MedicationsLoading() {
  return (
    <div className="space-y-6">
      <SkeletonHeader />
      <SkeletonTable rows={10} />
    </div>
  );
}
```

### ⚠️ MIXED: ISR & Revalidation
**Good Example Found:**
```typescript
// /app/students/page.enhanced.tsx
export const revalidate = 300; // 5 minutes
export const dynamic = 'force-static';
```

**Issues:**
- Only 1 page implements ISR properly
- Most pages use `force-dynamic` without clear reason
- 15 pages have `force-dynamic` or `force-static`
- Dashboard page has `force-dynamic` with hardcoded data

**Recommendation:**
```typescript
// ✅ Implement ISR for stable data
export const revalidate = 300; // 5 minutes

// ✅ Use on-demand revalidation
import { revalidateTag } from 'next/cache';

async function getStudents() {
  const data = await fetch('/api/students', {
    next: { tags: ['students'], revalidate: 300 }
  });
  return data;
}

// Revalidate on mutation
revalidateTag('students');
```

### ❌ CRITICAL: No Parallel Routes or Intercepting Routes
**Missing Features:**
- No parallel routes (`@modal`, `@sidebar`)
- No intercepting routes for modals
- Using client-side modals instead

**Impact:**
- Heavier JavaScript bundle
- Missed SSR opportunities for modal content
- Worse perceived performance

---

## 2. Image Optimization

### ❌ CRITICAL: Minimal next/image Usage
**Current State:**
- Only 1 file imports from 'next/image' (in Storybook)
- No `<img>` tags found (good - not using unoptimized images)
- Likely using icon libraries or SVGs

**Issues:**
```typescript
// /home/user/white-cross/nextjs/src/app/layout.tsx
// No metadata icons optimized with next/image
```

**next.config.ts Image Configuration (Good):**
```typescript
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60,
  dangerouslyAllowSVG: false,
}
```

**Recommendations:**
1. **Audit all image usage:**
```bash
# Find any potential image references
grep -r "src=\"" src/ --include="*.tsx" | grep -E "\.(jpg|jpeg|png|gif|webp)"
```

2. **Use next/image for all raster images:**
```typescript
import Image from 'next/image';

// ✅ GOOD: Optimized with next/image
<Image
  src="/hero-image.jpg"
  alt="Healthcare dashboard"
  width={1200}
  height={630}
  priority
  placeholder="blur"
  blurDataURL="data:image/..."
/>
```

3. **Create image components:**
```typescript
// components/OptimizedImage.tsx
import Image from 'next/image';

export function StudentAvatar({ src, alt, size = 40 }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="rounded-full"
      loading="lazy"
    />
  );
}
```

### ✅ GOOD: SVG Usage
- Using SVG icons from lucide-react (optimal)
- SVGs disabled in image loader for security

---

## 3. Bundle Size Optimization

### ❌ CRITICAL: Heavy Libraries Not Code-Split

#### FullCalendar (~200KB gzipped)
**Current Implementation:**
```typescript
// /components/appointments/AppointmentCalendar.tsx
'use client';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
```

**Impact:**
- ~200KB added to every bundle that imports this component
- Loaded immediately, not on-demand

**Recommendation:**
```typescript
// ✅ GOOD: Dynamic import with loading state
// components/appointments/AppointmentCalendarLazy.tsx
import dynamic from 'next/dynamic';

const AppointmentCalendar = dynamic(
  () => import('./AppointmentCalendar'),
  {
    loading: () => <CalendarSkeleton />,
    ssr: false, // FullCalendar uses window
  }
);

export default AppointmentCalendar;
```

#### Recharts (~100KB gzipped)
**Current Implementation:**
```typescript
// /components/ui/charts/LineChart.tsx
'use client';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
```

**Impact:**
- ~100KB added to analytics/dashboard bundles
- Loaded upfront even if charts not immediately visible

**Recommendation:**
```typescript
// ✅ GOOD: Lazy load charts
const LineChart = dynamic(() => import('@/components/ui/charts/LineChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

const BarChart = dynamic(() => import('@/components/ui/charts/BarChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});
```

### ⚠️ MEDIUM: Other Heavy Dependencies
**Potentially Large Imports:**
```javascript
// package.json
"@apollo/client": "^4.0.7",          // ~100KB
"@fullcalendar/react": "^6.1.19",    // ~200KB
"recharts": "^3.3.0",                 // ~100KB
"socket.io-client": "^4.8.1",        // ~50KB
"framer-motion": "^12.23.24",        // ~100KB
```

**Recommendation:**
```typescript
// Dynamic import for non-critical features
const SocketProvider = dynamic(
  () => import('@/providers/SocketProvider'),
  { ssr: false }
);

const AnimatedComponent = dynamic(
  () => import('@/components/AnimatedCard'),
  { ssr: false }
);
```

### ✅ GOOD: webpack Configuration
```typescript
// next.config.ts
webpack: (config, { isServer, dev }) => {
  if (!dev) {
    config.optimization = {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: { name: 'vendor', test: /node_modules/, priority: 20 },
          react: { test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/, name: 'react', priority: 30 },
          dataFetching: { test: /[\\/]node_modules[\\/](@tanstack|@apollo|axios)[\\/]/, name: 'data-fetching', priority: 28 },
          charts: { test: /[\\/]node_modules[\\/](recharts|d3)[\\/]/, name: 'charts', chunks: 'async', priority: 24 },
        },
      },
    };
  }
  return config;
}
```

### ⚠️ MISSING: Bundle Analysis
**Current State:**
- Bundle analyzer configured but requires `ANALYZE=true`
- No automated bundle size tracking in CI

**Recommendation:**
```json
// package.json
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build",
    "analyze:server": "BUNDLE_ANALYZE=server npm run build",
    "analyze:browser": "BUNDLE_ANALYZE=browser npm run build"
  }
}
```

### ✅ GOOD: optimizePackageImports
```typescript
experimental: {
  optimizePackageImports: [
    'lucide-react',
    '@headlessui/react',
    'recharts',
    'date-fns',
    'lodash',
    '@tanstack/react-query',
    'react-hook-form',
  ],
}
```

---

## 4. Data Fetching Optimization

### ✅ GOOD: Server-Side Data Fetching
**Good Example:**
```typescript
// /app/students/page.enhanced.tsx
export const revalidate = 300;
export const dynamic = 'force-static';

async function getStudents(searchParams) {
  return serverGet<PaginatedStudentsResponse>('/students', params, {
    revalidate: 300,
    tags: ['students'],
  });
}

export default async function StudentsPage({ searchParams }) {
  const initialData = await getStudents(searchParams);
  return <StudentsTable initialData={initialData} />;
}
```

### ⚠️ MIXED: Caching Strategy
**TanStack Query Configuration (Good):**
```typescript
// /config/queryClient.ts
const defaultOptions = {
  queries: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000,   // 30 minutes
    refetchOnWindowFocus: true,
    retry: (failureCount, error) => {
      // Smart retry logic
    },
  },
};
```

**Issues:**
- Most pages don't utilize ISR/SSG
- Over-reliance on client-side fetching
- Hardcoded data in dashboard

### ❌ POOR: Dashboard Page
```typescript
// /app/(dashboard)/dashboard/page.tsx
export const dynamic = "force-dynamic"; // ❌ Why?

export default function DashboardPage() {
  const stats = [
    { name: 'Total Students', value: '1,234', change: '+12%' }, // ❌ Hardcoded!
    // ...
  ];
  // No actual data fetching!
}
```

**Recommendation:**
```typescript
// ✅ GOOD: Server-side data fetching
export const revalidate = 60; // 1 minute

async function getDashboardStats() {
  const data = await fetch('/api/dashboard/stats', {
    next: { revalidate: 60, tags: ['dashboard'] }
  });
  return data.json();
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  return <DashboardContent stats={stats} />;
}
```

### ⚠️ MISSING: Prefetching
**Current State:**
- Only 3 instances of preload/prefetch in app directory
- No Link component prefetching optimization
- No route prefetching strategy

**Recommendation:**
```typescript
// Prefetch critical routes
import Link from 'next/link';

<Link href="/students" prefetch={true}>
  Students
</Link>

// Prefetch on hover
<Link
  href="/medications"
  prefetch={true}
  onMouseEnter={() => {
    router.prefetch('/medications');
  }}
>
  Medications
</Link>
```

### ✅ GOOD: API Route Handlers
**Found in:**
- `/app/api/v1/students/route.ts`
- `/app/api/v1/medications/route.ts`
- With revalidation tags

---

## 5. Core Web Vitals Assessment

### ✅ EXCELLENT: Web Vitals Monitoring
**Implementation:**
```typescript
// /lib/performance/web-vitals.ts
export async function initWebVitals(options) {
  const webVitals = await import('web-vitals'); // ✅ Lazy loaded!
  webVitals.onLCP((metric) => handleMetric(metric));
  webVitals.onFID((metric) => handleMetric(metric));
  webVitals.onCLS((metric) => handleMetric(metric));
  webVitals.onFCP((metric) => handleMetric(metric));
  webVitals.onTTFB((metric) => handleMetric(metric));
  webVitals.onINP((metric) => handleMetric(metric));
}
```

### ✅ GOOD: Lighthouse CI Configuration
```json
// lighthouserc.json
{
  "assertions": {
    "categories:performance": ["error", { "minScore": 0.9 }],
    "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
    "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
    "total-blocking-time": ["warn", { "maxNumericValue": 300 }]
  }
}
```

### ⚠️ LCP Optimization Opportunities

#### Issue 1: Heavy Client Components
**Impact:** Large JavaScript bundles delay LCP
**Solution:**
- Convert layouts to server components
- Code-split heavy libraries
- Reduce client-side JavaScript

#### Issue 2: No Font Optimization
**Impact:** FOIT (Flash of Invisible Text) or FOUT (Flash of Unstyled Text)
**Current State:**
```typescript
// /app/layout.tsx
// Temporarily disabled Google Fonts due to build environment TLS restrictions
// import { Inter } from "next/font/google";
```

**Solution:**
```typescript
// ✅ GOOD: Use next/font with system font fallback
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap', // FOUT instead of FOIT
  fallback: ['system-ui', 'arial'],
  preload: true,
  adjustFontFallback: true, // Reduce CLS
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

#### Issue 3: No Priority Loading
**Missing:**
- No `priority` prop on critical images
- No resource hints for critical assets

**Solution:**
```typescript
// Add to layout.tsx
<link rel="preconnect" href={process.env.NEXT_PUBLIC_API_BASE_URL} />
<link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_BASE_URL} />
```

### ⚠️ CLS Optimization Opportunities

#### Issue 1: Missing Skeleton Loaders
**Current State:** Only 4 loading.tsx files
**Impact:** Content jumps when data loads

**Solution:**
```typescript
// Add skeleton loaders everywhere
// /components/ui/loading/SkeletonCard.tsx
export function SkeletonCard() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  );
}
```

#### Issue 2: Dynamic Content Without Placeholders
**Solution:**
- Reserve space for async content
- Use Suspense boundaries with skeleton loaders

### ⚠️ FID/INP Optimization

#### Issue 1: Large JavaScript Bundles
**Current State:**
- FullCalendar ~200KB
- Recharts ~100KB
- Many client components

**Solution:**
- Code-split heavy libraries
- Use dynamic imports
- Defer non-critical scripts

#### Issue 2: No Request Idle Callback
**Missing:** Long tasks not broken up
**Solution:**
```typescript
// Break up long tasks
function processLargeDataset(data) {
  const chunks = chunkArray(data, 100);

  function processChunk(index) {
    if (index >= chunks.length) return;

    // Process chunk
    processData(chunks[index]);

    // Schedule next chunk
    requestIdleCallback(() => processChunk(index + 1));
  }

  processChunk(0);
}
```

---

## 6. Font Optimization

### ❌ CRITICAL: No Font Optimization

**Current State:**
```typescript
// /app/layout.tsx
// Temporarily disabled Google Fonts due to build environment TLS restrictions
// import { Inter } from "next/font/google";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased"> {/* Using system fonts */}
        {children}
      </body>
    </html>
  );
}
```

**Issues:**
1. No custom font loading
2. Relying on system fonts (inconsistent across platforms)
3. Missing font-display strategy
4. No preloading of critical fonts

**Impact:**
- Inconsistent typography across devices
- No brand consistency
- Missed opportunity for optimized font loading

### ✅ SOLUTION 1: Use next/font with Google Fonts
```typescript
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Arial'],
  adjustFontFallback: true, // Reduces CLS
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: true,
  fallback: ['Courier New', 'monospace'],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

### ✅ SOLUTION 2: Self-Host Fonts (TLS issue workaround)
```typescript
// app/layout.tsx
import localFont from 'next/font/local';

const inter = localFont({
  src: [
    {
      path: '../public/fonts/Inter-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Inter-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Inter-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});
```

**Benefits:**
- No external requests (faster)
- Works with TLS restrictions
- Better privacy (HIPAA compliant)
- Consistent across all environments

### ✅ Tailwind Configuration Update
```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'Courier New', 'monospace'],
      },
    },
  },
};
```

---

## 7. Metadata & SEO

### ✅ GOOD: Metadata Configuration
```typescript
// /app/layout.tsx
export const metadata = {
  title: "White Cross Healthcare Platform",
  description: "Enterprise healthcare platform...",
  keywords: ["healthcare", "school nursing", ...],
  authors: [{ name: "White Cross Healthcare" }],
  robots: { index: false, follow: false }, // ✅ HIPAA compliant
};
```

### ✅ GOOD: Dynamic Metadata
```typescript
// /app/students/page.enhanced.tsx
export async function generateMetadata() {
  return {
    title: 'Students | White Cross Healthcare',
    description: 'Manage student records and health information',
  };
}
```

### ✅ GOOD: OpenGraph Images
**Files Found:**
- `/app/opengraph-image.tsx` - Dynamic OG image
- `/app/icon.tsx` - Dynamic favicon
- `/app/apple-icon.tsx` - Apple touch icon

### ✅ EXCELLENT: Sitemap
```typescript
// /app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/dashboard`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    // ... comprehensive route list
  ];
}
```

### ✅ EXCELLENT: Robots.txt
```
# /public/robots.txt
User-agent: *
Disallow: /
# HIPAA-compliant - no public indexing
```

### ⚠️ MISSING: JSON-LD Structured Data
**Recommendation:**
```typescript
// Add structured data for organization
export const metadata = {
  other: {
    'application/ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'HealthAndBeautyBusiness',
      name: 'White Cross Healthcare',
      description: 'School healthcare management platform',
      url: process.env.NEXT_PUBLIC_APP_URL,
    }),
  },
};
```

### ⚠️ IMPROVEMENT: Viewport Configuration
**Current:**
```typescript
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // ❌ Accessibility issue - prevents zoom
};
```

**Better:**
```typescript
export const viewport = {
  width: "device-width",
  initialScale: 1,
  // Remove maximumScale to allow zoom (WCAG AA requirement)
};
```

---

## 8. Performance Improvement Roadmap

### 🔴 CRITICAL PRIORITY (Week 1)

#### 1. Code-Split Heavy Libraries
**Files to Update:**
- `/components/appointments/AppointmentCalendar.tsx`
- `/components/ui/charts/LineChart.tsx`
- All chart components

**Implementation:**
```typescript
// Create lazy wrappers
// components/appointments/index.ts
import dynamic from 'next/dynamic';

export const AppointmentCalendar = dynamic(
  () => import('./AppointmentCalendar'),
  {
    loading: () => <CalendarSkeleton />,
    ssr: false,
  }
);
```

**Expected Impact:**
- Reduce initial bundle by ~300KB
- Improve FCP by 500-1000ms
- Improve TTI by 800-1200ms

#### 2. Implement Font Optimization
**Action:** Self-host Inter font (TLS workaround)
**Files:**
- `/app/layout.tsx`
- `/public/fonts/` (create directory)

**Expected Impact:**
- Eliminate FOIT/FOUT
- Reduce CLS by 0.05-0.1
- Consistent typography

#### 3. Convert Dashboard Layout to Server Component
**File:** `/app/(dashboard)/layout.tsx`
**Action:** Split into server layout + client components

**Expected Impact:**
- Reduce JavaScript by ~20KB
- Improve FCP by 200-400ms

### 🟡 HIGH PRIORITY (Week 2-3)

#### 4. Add Loading States Across Application
**Files to Create:**
```
/app/(dashboard)/medications/loading.tsx
/app/(dashboard)/appointments/loading.tsx
/app/(dashboard)/incidents/loading.tsx
/app/(dashboard)/analytics/loading.tsx
/app/(dashboard)/communications/loading.tsx
/app/(dashboard)/inventory/loading.tsx
/app/(dashboard)/compliance/loading.tsx
```

**Expected Impact:**
- Reduce CLS significantly
- Better perceived performance
- Improved user experience

#### 5. Implement ISR for Stable Routes
**Routes to Update:**
- Dashboard stats
- Medication schedules
- Appointment calendars
- Reports

**Pattern:**
```typescript
export const revalidate = 300; // 5 minutes

async function getData() {
  return fetch(url, {
    next: { tags: ['tag'], revalidate: 300 }
  });
}
```

**Expected Impact:**
- Faster page loads
- Reduced API load
- Better caching

#### 6. Optimize Client Component Usage
**Audit and Refactor:**
- Review 101 'use client' files
- Convert unnecessary ones to server components
- Split large client components

**Target:** Reduce to ~50 client component files

**Expected Impact:**
- Smaller bundles
- Better SEO
- Faster initial loads

### 🟢 MEDIUM PRIORITY (Week 4)

#### 7. Add Suspense Boundaries
**Pattern:**
```typescript
<Suspense fallback={<Skeleton />}>
  <SlowComponent />
</Suspense>
```

**Target:** 50+ Suspense boundaries

#### 8. Implement Prefetching Strategy
**Actions:**
- Enable prefetch on all Link components
- Add hover prefetch for critical routes
- Preload critical resources

#### 9. Add Resource Hints
```typescript
// app/layout.tsx
<link rel="preconnect" href={process.env.NEXT_PUBLIC_API_BASE_URL} />
<link rel="dns-prefetch" href="https://fonts.googleapis.com" />
```

### 🔵 LOW PRIORITY (Ongoing)

#### 10. Bundle Analysis in CI
```yaml
# .github/workflows/bundle-analysis.yml
- name: Analyze Bundle
  run: ANALYZE=true npm run build
- name: Upload Bundle Stats
  uses: actions/upload-artifact@v3
```

#### 11. Performance Budgets
```javascript
// next.config.ts
performance: {
  maxAssetSize: 244000, // 244 KiB
  maxEntrypointSize: 244000,
  hints: 'error',
}
```

#### 12. Image Audit and Optimization
- Audit all image usage
- Ensure all use next/image
- Add blur placeholders

---

## 9. Caching & Revalidation Strategy

### Current State Analysis

#### ✅ GOOD: TanStack Query Configuration
```typescript
staleTime: 5 * 60 * 1000,  // 5 minutes
gcTime: 30 * 60 * 1000,    // 30 minutes
```

#### ⚠️ MIXED: Server Caching
- Only 1 page uses ISR properly
- Most API routes don't specify cache headers
- Inconsistent revalidation strategies

### Recommended Caching Matrix

| Route Type | Strategy | Revalidate | Tags |
|------------|----------|------------|------|
| Dashboard Stats | ISR | 60s | dashboard, stats |
| Student List | ISR | 300s | students |
| Student Details | SSR | - | students |
| Medication Schedule | ISR | 300s | medications |
| Appointments | ISR | 60s | appointments |
| Incidents | SSR | - | incidents |
| Analytics | ISR | 600s | analytics |
| Reports | ISR | 3600s | reports |
| Settings | Static | - | - |

### Implementation Pattern

```typescript
// Static routes (rarely change)
export const dynamic = 'force-static';

// ISR routes (periodic updates)
export const revalidate = 300;
async function getData() {
  return fetch(url, {
    next: { revalidate: 300, tags: ['students'] }
  });
}

// Dynamic routes (always fresh)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// On-demand revalidation
import { revalidateTag, revalidatePath } from 'next/cache';

// After data mutation
revalidateTag('students');
revalidatePath('/students');
```

---

## 10. Bundle Analysis Results

### Current Bundle Estimates

**Major Dependencies (Unoptimized):**
```
@fullcalendar/react     ~200KB (gzipped)
recharts                ~100KB (gzipped)
@apollo/client          ~100KB (gzipped)
framer-motion           ~100KB (gzipped)
socket.io-client        ~50KB  (gzipped)
```

**Total Estimated Initial Bundle:** ~800KB-1.2MB (before optimizations)

### Target Bundle Sizes (After Optimizations)

```
Initial JS Bundle:      < 200KB (gzipped)
Vendor Bundle:          < 150KB (gzipped)
React Bundle:           < 50KB  (gzipped)
Route Bundles:          < 50KB each (gzipped)
```

### How to Analyze

```bash
# 1. Enable bundle analyzer
ANALYZE=true npm run build

# 2. Check bundle sizes
npm run build
# Look for: .next/static/chunks/

# 3. Lighthouse CI
npm run lighthouse

# 4. Check bundle composition
npx -y @next/bundle-analyzer
```

---

## 11. Monitoring & Metrics

### ✅ GOOD: Web Vitals Tracking
- Implemented with lazy loading
- Tracks all Core Web Vitals
- Configurable analytics integration

### ⚠️ MISSING: Real User Monitoring
**Recommendations:**
1. **Sentry Performance Monitoring**
```typescript
// Already installed: @sentry/nextjs
// Configure transaction monitoring
```

2. **Datadog RUM**
```typescript
// Already installed: @datadog/browser-rum
// Enable performance monitoring
```

### Target Metrics

| Metric | Current | Target | Priority |
|--------|---------|--------|----------|
| FCP | Unknown | < 1.5s | High |
| LCP | Unknown | < 2.5s | Critical |
| CLS | Unknown | < 0.1 | Critical |
| FID/INP | Unknown | < 100ms | High |
| TTI | Unknown | < 3.5s | Medium |
| TTFB | Unknown | < 600ms | Medium |

---

## 12. Quick Wins (Can Implement Today)

### 1. Enable Font Optimization (30 minutes)
```bash
# Download Inter font
mkdir -p public/fonts
# Add to layout.tsx (shown in section 6)
```

### 2. Add Loading States for Top Routes (2 hours)
```typescript
// Create reusable skeletons
// Add loading.tsx to top 5 routes
```

### 3. Dynamic Import Charts (1 hour)
```typescript
// Wrap chart components in dynamic()
```

### 4. Add Prefetch to Navigation (30 minutes)
```typescript
// Update Link components with prefetch={true}
```

### 5. Optimize Providers (1 hour)
```typescript
// Split providers into separate components
// Only include what's needed per route
```

---

## 13. Testing Performance Improvements

### Before/After Checklist

#### Measure Baseline
```bash
# 1. Lighthouse
npm run lighthouse

# 2. Bundle size
npm run build
ls -lh .next/static/chunks/

# 3. Web Vitals
# Visit app and check console
```

#### Measure After Each Optimization
```bash
# Run same tests
# Compare metrics
# Document improvements
```

### Performance Testing Matrix

| Test | Tool | Frequency |
|------|------|-----------|
| Lighthouse | lighthouse CI | Every PR |
| Bundle Size | next build | Every PR |
| Web Vitals | Real users | Continuous |
| Load Testing | k6/artillery | Weekly |

---

## 14. Summary of Files to Modify

### Critical Files (Week 1)
```
✏️  /app/layout.tsx                           - Add font optimization
✏️  /app/(dashboard)/layout.tsx               - Convert to server component
✏️  /components/appointments/AppointmentCalendar.tsx - Dynamic import
✏️  /components/ui/charts/LineChart.tsx       - Dynamic import
✏️  /components/ui/charts/BarChart.tsx        - Dynamic import
✏️  /components/ui/charts/PieChart.tsx        - Dynamic import
```

### High Priority Files (Week 2-3)
```
➕  /app/(dashboard)/medications/loading.tsx
➕  /app/(dashboard)/appointments/loading.tsx
➕  /app/(dashboard)/incidents/loading.tsx
➕  /app/(dashboard)/analytics/loading.tsx
➕  /app/(dashboard)/communications/loading.tsx
✏️  /app/(dashboard)/dashboard/page.tsx       - Fix hardcoded data
✏️  All page.tsx files                         - Add ISR where appropriate
```

### Configuration Files
```
✏️  /next.config.ts                           - Add performance budgets
✏️  /package.json                             - Add bundle analysis scripts
➕  /.github/workflows/performance.yml         - Add CI performance checks
```

---

## 15. Expected Performance Improvements

### Before Optimizations (Estimated)
```
Lighthouse Performance Score: ~65-75
FCP:                         ~2.5-3.0s
LCP:                         ~3.5-4.5s
CLS:                         ~0.15-0.25
TTI:                         ~4.5-5.5s
Bundle Size (Initial):       ~800KB-1.2MB
```

### After Optimizations (Target)
```
Lighthouse Performance Score: 90+
FCP:                         < 1.5s    (↓ ~40%)
LCP:                         < 2.5s    (↓ ~45%)
CLS:                         < 0.1     (↓ ~50%)
TTI:                         < 3.5s    (↓ ~35%)
Bundle Size (Initial):       < 200KB   (↓ ~75%)
```

---

## 16. Resources & Documentation

### Internal Documentation
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [App Router Caching](https://nextjs.org/docs/app/building-your-application/caching)

### External Tools
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Web Vitals Chrome Extension](https://chrome.google.com/webstore/detail/web-vitals/)

### Performance Best Practices
- [web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [React Performance](https://react.dev/learn/render-and-commit#optimizing-performance)

---

## Conclusion

The White Cross Healthcare Platform is built on a strong foundation with Next.js 16 and React 19, but there are significant performance optimization opportunities. The most critical issues are:

1. **No font optimization** - Currently using system fonts
2. **Heavy libraries not code-split** - FullCalendar and Recharts adding ~300KB
3. **Over-use of client components** - 101 files with 'use client'
4. **Limited streaming and Suspense** - Only 10 Suspense boundaries
5. **Minimal ISR/SSG usage** - Most pages dynamically rendered

By implementing the recommendations in this report, especially the critical and high-priority items, we can expect to:
- Reduce initial bundle size by ~75%
- Improve Core Web Vitals significantly (LCP < 2.5s, CLS < 0.1)
- Achieve Lighthouse Performance Score of 90+
- Deliver a significantly better user experience

**Recommended Implementation Timeline:** 4 weeks
**Estimated Development Effort:** 60-80 hours
**Expected ROI:** Significant improvement in user satisfaction and perceived performance

---

**Report Generated:** 2025-10-27
**Next Review:** After implementing critical priority items (Week 1)
