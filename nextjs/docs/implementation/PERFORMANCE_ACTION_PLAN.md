# Performance Optimization Action Plan

**Priority:** Critical → High → Medium → Low
**Timeline:** 4 weeks total
**Expected Performance Gain:** 75% bundle reduction, 90+ Lighthouse score

---

## Week 1: Critical Fixes (Must Do)

### 🔴 Priority 1: Code-Split Heavy Libraries (8 hours)

**Problem:** FullCalendar (~200KB) and Recharts (~100KB) loaded synchronously

**Files to Update:**
```bash
components/appointments/AppointmentCalendar.tsx
components/ui/charts/LineChart.tsx
components/ui/charts/BarChart.tsx
components/ui/charts/PieChart.tsx
components/ui/charts/StackedBarChart.tsx
```

**Implementation:**
```typescript
// components/appointments/index.ts
import dynamic from 'next/dynamic';

export const AppointmentCalendar = dynamic(
  () => import('./AppointmentCalendar'),
  {
    loading: () => <CalendarSkeleton />,
    ssr: false,
  }
);

// components/ui/charts/index.ts
export const LineChart = dynamic(() => import('./LineChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});
```

**Testing:**
```bash
# Before
npm run build
# Check bundle size in .next/static/chunks/

# After
npm run build
# Verify ~300KB reduction
```

**Expected Impact:**
- Initial bundle: -300KB
- FCP: -500-1000ms
- TTI: -800-1200ms

---

### 🔴 Priority 2: Font Optimization (2 hours)

**Problem:** No font optimization, commented out due to TLS issues

**Solution:** Self-host Inter font

**Steps:**

1. **Download fonts:**
```bash
mkdir -p public/fonts
cd public/fonts
# Download Inter from https://github.com/rsms/inter/releases
# Get Inter-Regular.woff2, Inter-Medium.woff2, Inter-Bold.woff2
```

2. **Update layout:**
```typescript
// app/layout.tsx
import localFont from 'next/font/local';

const inter = localFont({
  src: [
    { path: '../public/fonts/Inter-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/Inter-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/Inter-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

3. **Update Tailwind:**
```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
};
```

**Testing:**
```bash
npm run dev
# Check Network tab: fonts should load from /fonts/
# Check Layout Shift: should be minimal
```

**Expected Impact:**
- CLS: -0.05-0.1
- Consistent typography
- No FOIT/FOUT

---

### 🔴 Priority 3: Convert Dashboard Layout to Server Component (4 hours)

**Problem:** Dashboard layout is 'use client' unnecessarily

**File:** `app/(dashboard)/layout.tsx`

**Solution:**

1. **Split layout:**
```typescript
// app/(dashboard)/layout.tsx (Server Component)
import { DashboardShell } from './DashboardShell';

export default function DashboardLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>;
}

// app/(dashboard)/DashboardShell.tsx (Client Component)
'use client';
import { useState } from 'react';
import { Header } from '@/components/layouts/Header';
import { Sidebar } from '@/components/layouts/Sidebar';

export function DashboardShell({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Header onMenuClick={() => setMobileMenuOpen(true)} />
      <div className="flex">
        <Sidebar />
        <main>{children}</main>
      </div>
    </div>
  );
}
```

2. **Further split Header/Sidebar:**
```typescript
// components/layouts/Header.tsx (Server Component)
import { HeaderClient } from './HeaderClient';

export function Header() {
  // Server-side logic
  return <HeaderClient />;
}

// components/layouts/HeaderClient.tsx (Client Component)
'use client';
export function HeaderClient() {
  const [open, setOpen] = useState(false);
  // Interactive logic only
}
```

**Testing:**
```bash
# Check component tree
npm run dev
# Open React DevTools
# Verify layout is server component
```

**Expected Impact:**
- JavaScript: -20KB
- FCP: -200-400ms

---

### 🔴 Priority 4: Fix Dashboard Hardcoded Data (2 hours)

**Problem:** Dashboard uses force-dynamic with hardcoded data

**File:** `app/(dashboard)/dashboard/page.tsx`

**Solution:**
```typescript
// Remove: export const dynamic = "force-dynamic";
// Add ISR
export const revalidate = 60; // 1 minute

async function getDashboardStats() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/dashboard/stats`, {
    next: { revalidate: 60, tags: ['dashboard'] },
  });
  return res.json();
}

async function getRecentActivity() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/dashboard/activity`, {
    next: { revalidate: 30, tags: ['activity'] },
  });
  return res.json();
}

export default async function DashboardPage() {
  const [stats, activity] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(),
  ]);

  return (
    <Container>
      <DashboardStats stats={stats} />
      <RecentActivity items={activity} />
    </Container>
  );
}
```

**Testing:**
```bash
# Test with backend running
npm run dev
# Verify data loads from API
# Check Network tab for caching
```

**Expected Impact:**
- Real data instead of hardcoded
- Better caching
- Reduced server load

---

## Week 2: High Priority (Important)

### 🟡 Priority 5: Add Loading States (6 hours)

**Problem:** Only 4 loading.tsx files cause layout shifts

**Files to Create:**
```bash
app/(dashboard)/medications/loading.tsx
app/(dashboard)/appointments/loading.tsx
app/(dashboard)/incidents/loading.tsx
app/(dashboard)/analytics/loading.tsx
app/(dashboard)/communications/loading.tsx
app/(dashboard)/inventory/loading.tsx
app/(dashboard)/compliance/loading.tsx
app/(dashboard)/forms/loading.tsx
app/(dashboard)/documents/loading.tsx
```

**Template:**
```typescript
// app/(dashboard)/medications/loading.tsx
import { Container } from '@/components/layouts/Container';
import { SkeletonTable } from '@/components/ui/loading/SkeletonCard';

export default function MedicationsLoading() {
  return (
    <Container>
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-64 bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded" />
        </div>

        {/* Table skeleton */}
        <SkeletonTable rows={10} />
      </div>
    </Container>
  );
}
```

**Create Reusable Skeletons:**
```typescript
// components/ui/loading/SkeletonCard.tsx
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4" />
      </div>
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex gap-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded flex-1" />
            <div className="h-4 bg-gray-200 rounded flex-1" />
            <div className="h-4 bg-gray-200 rounded flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Expected Impact:**
- CLS: -0.1-0.15
- Better perceived performance
- Professional loading experience

---

### 🟡 Priority 6: Implement ISR for Key Routes (8 hours)

**Problem:** Most pages use force-dynamic unnecessarily

**Routes to Update:**

1. **Medications Schedule** (`app/(dashboard)/medications/schedule/page.tsx`):
```typescript
export const revalidate = 300; // 5 minutes

async function getMedicationSchedule() {
  const res = await fetch(`${API_URL}/medications/schedule`, {
    next: { revalidate: 300, tags: ['medications', 'schedule'] },
  });
  return res.json();
}

export default async function SchedulePage() {
  const schedule = await getMedicationSchedule();
  return <ScheduleView data={schedule} />;
}
```

2. **Appointments Calendar** (`app/(dashboard)/appointments/calendar/page.tsx`):
```typescript
export const revalidate = 60; // 1 minute - appointments change frequently

async function getAppointments() {
  const res = await fetch(`${API_URL}/appointments`, {
    next: { revalidate: 60, tags: ['appointments'] },
  });
  return res.json();
}
```

3. **Inventory Items** (`app/(dashboard)/inventory/items/page.tsx`):
```typescript
export const revalidate = 600; // 10 minutes - inventory less frequent
```

**Create Revalidation Utility:**
```typescript
// lib/revalidation.ts
import { revalidateTag, revalidatePath } from 'next/cache';

export function revalidateMedications() {
  revalidateTag('medications');
  revalidatePath('/medications');
}

export function revalidateAppointments() {
  revalidateTag('appointments');
  revalidatePath('/appointments');
}

// Use in mutations
// actions/medications.actions.ts
export async function createMedication(data) {
  const result = await api.post('/medications', data);
  revalidateMedications();
  return result;
}
```

**Expected Impact:**
- Faster page loads
- Reduced API load
- Better user experience

---

### 🟡 Priority 7: Reduce Client Components (12 hours)

**Problem:** 101 files with 'use client' - many unnecessary

**Strategy:**

1. **Audit current usage:**
```bash
grep -r "^'use client'" src/app --include="*.tsx" > client-components.txt
```

2. **Identify candidates for server components:**
   - Components with no state
   - Components with no event handlers
   - Components with only server-side data

3. **Priority files to convert:**
```bash
app/(dashboard)/compliance/page.tsx
app/(dashboard)/compliance/audits/page.tsx
app/(dashboard)/compliance/policies/page.tsx
app/(dashboard)/compliance/reports/page.tsx
app/(dashboard)/documents/templates/page.tsx
app/(dashboard)/forms/page.tsx
# Many analytics pages
```

4. **Pattern to follow:**
```typescript
// ❌ Before: Everything is client
'use client';
export default function CompliancePage() {
  return (
    <div>
      <ComplianceHeader />
      <ComplianceStats />
      <ComplianceTable />
    </div>
  );
}

// ✅ After: Server component with client islands
export default async function CompliancePage() {
  const data = await getComplianceData();

  return (
    <div>
      <ComplianceHeader /> {/* Server component */}
      <ComplianceStats data={data} /> {/* Server component */}
      <ComplianceTableClient data={data} /> {/* Client only if interactive */}
    </div>
  );
}
```

**Expected Impact:**
- Bundle: -100-200KB
- FCP: -500-800ms
- Better SEO

---

## Week 3: Medium Priority

### 🟢 Priority 8: Add Suspense Boundaries (6 hours)

**Pattern:**
```typescript
import { Suspense } from 'react';

export default async function Page() {
  return (
    <div className="space-y-6">
      <FastComponent />

      <Suspense fallback={<SkeletonCard />}>
        <SlowComponentAsync />
      </Suspense>

      <Suspense fallback={<SkeletonChart />}>
        <AnalyticsChartAsync />
      </Suspense>
    </div>
  );
}

// Slow component as async server component
async function SlowComponentAsync() {
  const data = await fetchSlowData();
  return <Component data={data} />;
}
```

**Target:** Add 30-50 Suspense boundaries

---

### 🟢 Priority 9: Implement Prefetching (4 hours)

**Update Link components:**
```typescript
// components/layouts/Sidebar.tsx
<Link href="/students" prefetch={true}>
  Students
</Link>

// Add hover prefetch for critical routes
<Link
  href="/medications"
  prefetch={true}
  onMouseEnter={() => router.prefetch('/medications')}
>
  Medications
</Link>
```

**Add resource hints:**
```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_BASE_URL} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_BASE_URL} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

### 🟢 Priority 10: Image Optimization Audit (4 hours)

**Audit:**
```bash
# Find any images not using next/image
grep -r "src=\"" src/ --include="*.tsx" | grep -E "\.(jpg|jpeg|png|gif|webp)"

# Find background images in CSS
grep -r "background-image" src/ --include="*.css" --include="*.tsx"
```

**Convert to next/image:**
```typescript
import Image from 'next/image';

// ❌ Before
<img src="/logo.png" alt="Logo" />

// ✅ After
<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={50}
  priority // For above-fold images
/>
```

---

## Week 4: Low Priority & Monitoring

### 🔵 Priority 11: Bundle Analysis CI (2 hours)

**Create GitHub Action:**
```yaml
# .github/workflows/performance.yml
name: Performance Checks

on:
  pull_request:
    branches: [main]

jobs:
  bundle-analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Install dependencies
        run: npm ci

      - name: Build with bundle analysis
        run: ANALYZE=true npm run build

      - name: Upload bundle stats
        uses: actions/upload-artifact@v3
        with:
          name: bundle-analysis
          path: .next/analyze/

  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Run Lighthouse CI
        run: npm run lighthouse
```

---

### 🔵 Priority 12: Performance Budgets (1 hour)

**Add to next.config.ts:**
```typescript
// next.config.ts
const nextConfig = {
  // ...existing config

  webpack: (config, { isServer }) => {
    // Performance budgets
    if (!isServer) {
      config.performance = {
        maxAssetSize: 244000, // 244 KiB
        maxEntrypointSize: 244000,
        hints: 'error',
      };
    }

    return config;
  },
};
```

---

### 🔵 Priority 13: Real User Monitoring (2 hours)

**Enable Sentry Performance:**
```typescript
// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation.node');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./instrumentation.edge');
  }
}

// app/layout.tsx
import { useEffect } from 'react';
import { initWebVitals } from '@/lib/performance/web-vitals';

function PerformanceMonitoring() {
  useEffect(() => {
    initWebVitals({
      debug: process.env.NODE_ENV === 'development',
      analytics: {
        sendEvent: (name, params) => {
          // Send to your analytics
          if (window.gtag) {
            window.gtag('event', name, params);
          }
        },
      },
    });
  }, []);

  return null;
}
```

---

## Testing Checklist

### After Each Change

- [ ] Run `npm run build` - check bundle size
- [ ] Run `npm run lighthouse` - check scores
- [ ] Test in Chrome DevTools - check Web Vitals
- [ ] Test on real device - check actual performance
- [ ] Check React DevTools - verify server/client components

### Final Testing (Week 4)

- [ ] Lighthouse Performance Score: 90+
- [ ] FCP < 1.5s
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] TTI < 3.5s
- [ ] Bundle size < 200KB initial

---

## Success Metrics

### Before (Baseline)
```
Lighthouse Performance:  ~65-75
FCP:                    ~2.5-3.0s
LCP:                    ~3.5-4.5s
CLS:                    ~0.15-0.25
TTI:                    ~4.5-5.5s
Bundle (Initial):       ~800KB-1.2MB
```

### After (Target)
```
Lighthouse Performance:  90+      (↑ 20-30%)
FCP:                    < 1.5s    (↓ ~40%)
LCP:                    < 2.5s    (↓ ~45%)
CLS:                    < 0.1     (↓ ~50%)
TTI:                    < 3.5s    (↓ ~35%)
Bundle (Initial):       < 200KB   (↓ ~75%)
```

---

## Quick Reference Commands

```bash
# Development
npm run dev

# Build with analysis
ANALYZE=true npm run build

# Run Lighthouse
npm run lighthouse

# Check bundle size
npm run build && du -sh .next/static/chunks/*

# Type check
npm run type-check

# Run tests
npm test

# E2E tests
npm run test:e2e
```

---

## Notes

- Prioritize Week 1 (Critical) - These give biggest performance gains
- Week 2 (High) improves UX and perceived performance
- Week 3-4 (Medium/Low) for polish and monitoring
- Test after each major change
- Document improvements with before/after metrics

---

**Total Estimated Time:** 60-80 hours over 4 weeks
**Expected Performance Gain:** 75% bundle reduction, 90+ Lighthouse score
**Priority:** Start with Week 1 critical items for maximum impact
