# Next.js Performance Optimization Checklist

Quick reference checklist for implementing performance optimizations.

---

## Week 1: Critical Items

### ✅ Code-Split Heavy Libraries
- [ ] Create `components/appointments/LazyAppointmentCalendar.tsx` with dynamic import
- [ ] Create `components/ui/charts/LazyCharts.tsx` with dynamic imports
- [ ] Update all imports to use lazy versions
- [ ] Create skeleton loaders for lazy components
- [ ] Test: Verify ~300KB bundle reduction with `npm run build`
- [ ] Commit: "perf: code-split FullCalendar and Recharts"

**Files:**
```
✏️  components/appointments/AppointmentCalendar.tsx
➕  components/appointments/LazyAppointmentCalendar.tsx
➕  components/appointments/CalendarSkeleton.tsx
✏️  components/ui/charts/LineChart.tsx
➕  components/ui/charts/LazyCharts.tsx
➕  components/ui/charts/ChartSkeleton.tsx
```

### ✅ Font Optimization
- [ ] Download Inter font files (Regular, Medium, Bold)
- [ ] Create `public/fonts/` directory
- [ ] Copy font files to `public/fonts/`
- [ ] Update `app/layout.tsx` with `localFont`
- [ ] Update `tailwind.config.ts` font family
- [ ] Test: Verify fonts load from `/fonts/` in Network tab
- [ ] Test: Check CLS reduction in DevTools
- [ ] Commit: "perf: add self-hosted Inter font optimization"

**Files:**
```
➕  public/fonts/Inter-Regular.woff2
➕  public/fonts/Inter-Medium.woff2
➕  public/fonts/Inter-Bold.woff2
✏️  app/layout.tsx
✏️  tailwind.config.ts
```

### ✅ Convert Dashboard Layout
- [ ] Create `app/(dashboard)/DashboardShell.tsx` (client component)
- [ ] Convert `app/(dashboard)/layout.tsx` to server component
- [ ] Split Header into server + client components
- [ ] Split Sidebar into server + client components
- [ ] Test: Verify layout is server component in React DevTools
- [ ] Test: Check ~20KB bundle reduction
- [ ] Commit: "perf: convert dashboard layout to server component"

**Files:**
```
✏️  app/(dashboard)/layout.tsx
➕  app/(dashboard)/DashboardShell.tsx
✏️  components/layouts/Header.tsx
➕  components/layouts/HeaderClient.tsx
✏️  components/layouts/Sidebar.tsx
➕  components/layouts/SidebarClient.tsx
```

### ✅ Fix Dashboard Data
- [ ] Remove `export const dynamic = "force-dynamic"` from dashboard page
- [ ] Add `export const revalidate = 60`
- [ ] Create `getDashboardStats()` server function
- [ ] Create `getRecentActivity()` server function
- [ ] Update component to use real data
- [ ] Test: Verify data loads from API
- [ ] Commit: "fix: fetch real dashboard data with ISR"

**Files:**
```
✏️  app/(dashboard)/dashboard/page.tsx
```

---

## Week 2: High Priority Items

### ✅ Add Loading States
- [ ] Create `components/ui/loading/SkeletonCard.tsx`
- [ ] Create `components/ui/loading/SkeletonTable.tsx`
- [ ] Create `components/ui/loading/SkeletonHeader.tsx`
- [ ] Add `app/(dashboard)/medications/loading.tsx`
- [ ] Add `app/(dashboard)/appointments/loading.tsx`
- [ ] Add `app/(dashboard)/incidents/loading.tsx`
- [ ] Add `app/(dashboard)/analytics/loading.tsx`
- [ ] Add `app/(dashboard)/communications/loading.tsx`
- [ ] Add `app/(dashboard)/inventory/loading.tsx`
- [ ] Add `app/(dashboard)/compliance/loading.tsx`
- [ ] Test: Navigate between routes, verify smooth loading states
- [ ] Test: Check CLS reduction
- [ ] Commit: "feat: add comprehensive loading states"

**Files:**
```
➕  components/ui/loading/SkeletonCard.tsx
➕  components/ui/loading/SkeletonTable.tsx
➕  components/ui/loading/SkeletonHeader.tsx
➕  app/(dashboard)/medications/loading.tsx
➕  app/(dashboard)/appointments/loading.tsx
➕  app/(dashboard)/incidents/loading.tsx
➕  app/(dashboard)/analytics/loading.tsx
➕  app/(dashboard)/communications/loading.tsx
➕  app/(dashboard)/inventory/loading.tsx
➕  app/(dashboard)/compliance/loading.tsx
```

### ✅ Implement ISR
- [ ] Update medications schedule page with revalidate
- [ ] Update appointments calendar page with revalidate
- [ ] Update inventory items page with revalidate
- [ ] Update analytics pages with revalidate
- [ ] Create revalidation utility functions
- [ ] Update mutations to call revalidation
- [ ] Test: Verify caching works (check headers)
- [ ] Commit: "perf: implement ISR for stable routes"

**Files:**
```
✏️  app/(dashboard)/medications/schedule/page.tsx
✏️  app/(dashboard)/appointments/calendar/page.tsx
✏️  app/(dashboard)/inventory/items/page.tsx
✏️  app/(dashboard)/analytics/page.tsx
➕  lib/revalidation.ts
✏️  actions/medications.actions.ts
✏️  actions/appointments.actions.ts
```

### ✅ Reduce Client Components
- [ ] Generate list of all client components
- [ ] Identify 30 candidates for conversion
- [ ] Convert compliance pages to server components
- [ ] Convert analytics pages to server components
- [ ] Convert document pages to server components
- [ ] Extract client-only logic into separate components
- [ ] Test: Verify functionality works
- [ ] Test: Check bundle size reduction
- [ ] Commit: "perf: convert unnecessary client components to server"

**Files:**
```
✏️  app/(dashboard)/compliance/*.tsx
✏️  app/(dashboard)/analytics/*.tsx
✏️  app/(dashboard)/documents/*.tsx
```

---

## Week 3: Medium Priority Items

### ✅ Add Suspense Boundaries
- [ ] Identify slow async components
- [ ] Wrap with Suspense + fallback
- [ ] Create async server component variants
- [ ] Add 30+ Suspense boundaries
- [ ] Test: Verify streaming works
- [ ] Commit: "perf: add Suspense boundaries for better streaming"

### ✅ Implement Prefetching
- [ ] Update all Link components with `prefetch={true}`
- [ ] Add hover prefetch for critical routes
- [ ] Add resource hints to layout
- [ ] Test: Verify prefetching in Network tab
- [ ] Commit: "perf: implement route prefetching strategy"

**Files:**
```
✏️  components/layouts/Sidebar.tsx
✏️  components/layouts/Navigation.tsx
✏️  app/layout.tsx
```

### ✅ Image Optimization
- [ ] Audit all image usage
- [ ] Convert to next/image
- [ ] Add blur placeholders
- [ ] Set appropriate sizes
- [ ] Mark above-fold images with `priority`
- [ ] Test: Verify images optimized
- [ ] Commit: "perf: optimize images with next/image"

---

## Week 4: Low Priority & Monitoring

### ✅ Bundle Analysis CI
- [ ] Create `.github/workflows/performance.yml`
- [ ] Add bundle analysis job
- [ ] Add Lighthouse CI job
- [ ] Test: Run workflow
- [ ] Commit: "ci: add performance monitoring workflow"

**Files:**
```
➕  .github/workflows/performance.yml
```

### ✅ Performance Budgets
- [ ] Add performance config to next.config.ts
- [ ] Set bundle size limits
- [ ] Test: Verify warnings on large bundles
- [ ] Commit: "perf: add bundle size budgets"

**Files:**
```
✏️  next.config.ts
```

### ✅ Real User Monitoring
- [ ] Enable Sentry performance monitoring
- [ ] Configure DataDog RUM (if available)
- [ ] Add Web Vitals reporting
- [ ] Test: Verify metrics reported
- [ ] Commit: "feat: enable real user monitoring"

**Files:**
```
✏️  instrumentation.ts
✏️  app/layout.tsx
```

---

## Testing After Each Week

### Week 1 Testing
```bash
# Build and check bundle
npm run build
ls -lh .next/static/chunks/ | grep -E "pages|chunks"

# Run Lighthouse
npm run lighthouse

# Check Web Vitals in browser
npm run dev
# Open DevTools Console, check metrics
```

**Expected Results:**
- [ ] Bundle size reduced by ~300KB
- [ ] Fonts load without FOIT/FOUT
- [ ] Dashboard loads faster
- [ ] Lighthouse performance: +5-10 points

### Week 2 Testing
```bash
# Check loading states
npm run dev
# Navigate between routes rapidly
# Verify smooth transitions

# Check caching
npm run build && npm start
# Inspect response headers for cache-control
```

**Expected Results:**
- [ ] Loading states visible during navigation
- [ ] No layout shifts
- [ ] Cache headers present
- [ ] Faster subsequent loads

### Week 3 Testing
```bash
# Check Suspense boundaries
npm run dev
# Open React DevTools
# Verify Suspense boundaries highlighted

# Check prefetching
# Open Network tab
# Hover over links, verify prefetch requests
```

**Expected Results:**
- [ ] Suspense boundaries working
- [ ] Prefetch requests visible
- [ ] Faster navigation

### Week 4 Testing
```bash
# Check CI workflow
git push
# Verify GitHub Actions run
# Check bundle analysis artifacts

# Check performance budgets
# Try adding large dependency
# Verify build fails/warns
```

**Expected Results:**
- [ ] CI workflow runs successfully
- [ ] Bundle analysis available
- [ ] Performance budgets enforced

---

## Final Validation

### Before Completion
- [ ] Run full test suite: `npm test`
- [ ] Run E2E tests: `npm run test:e2e`
- [ ] Run Lighthouse CI: `npm run lighthouse`
- [ ] Test on real devices (mobile, tablet, desktop)
- [ ] Check all Core Web Vitals
- [ ] Verify bundle sizes
- [ ] Check accessibility
- [ ] Review with team

### Performance Targets
- [ ] Lighthouse Performance Score: ≥ 90
- [ ] FCP: < 1.5s
- [ ] LCP: < 2.5s
- [ ] CLS: < 0.1
- [ ] TTI: < 3.5s
- [ ] FID/INP: < 100ms
- [ ] Bundle Size (Initial): < 200KB

### Documentation
- [ ] Update README with performance info
- [ ] Document caching strategy
- [ ] Document lazy loading patterns
- [ ] Add performance monitoring guide
- [ ] Create maintenance checklist

---

## Commands Reference

```bash
# Development
npm run dev                          # Start dev server

# Building
npm run build                        # Production build
ANALYZE=true npm run build          # Build with bundle analysis

# Testing
npm test                            # Run unit tests
npm run test:e2e                    # Run E2E tests
npm run lighthouse                  # Run Lighthouse CI

# Performance
npm run analyze                     # Analyze bundle
du -sh .next/static/chunks/*       # Check chunk sizes

# Type checking
npm run type-check                 # TypeScript check

# Linting
npm run lint                       # ESLint
npm run lint:fix                   # Fix linting issues
```

---

## Common Issues & Solutions

### Issue: Font not loading
**Solution:**
- Check file paths in `localFont` config
- Verify font files exist in `public/fonts/`
- Check Network tab for 404s
- Clear browser cache

### Issue: Dynamic import not working
**Solution:**
- Ensure component has default export
- Check for SSR-unsafe code (window, document)
- Use `ssr: false` option if needed
- Add proper loading fallback

### Issue: ISR not caching
**Solution:**
- Check revalidate value is set
- Verify fetch uses `next` option
- Check response headers for cache-control
- Ensure no `dynamic = 'force-dynamic'`

### Issue: Client component converted but broken
**Solution:**
- Check for useState, useEffect usage
- Check for event handlers
- Split into server + client if needed
- Verify data passed as props

### Issue: Suspense boundary not working
**Solution:**
- Ensure wrapped component is async
- Check Suspense has fallback prop
- Verify component actually suspends
- Check React version (19+)

---

## Rollback Plan

If any optimization causes issues:

```bash
# 1. Identify problematic commit
git log --oneline

# 2. Create branch for fix
git checkout -b fix/revert-optimization

# 3. Revert specific commit
git revert <commit-hash>

# 4. Test
npm run build && npm test

# 5. Push and create PR
git push origin fix/revert-optimization
```

---

## Success Criteria

✅ All critical items (Week 1) completed
✅ All high priority items (Week 2) completed
✅ At least 50% of medium priority items completed
✅ Lighthouse Performance Score ≥ 90
✅ All Core Web Vitals in "Good" range
✅ Bundle size reduced by ≥ 60%
✅ No regressions in functionality
✅ All tests passing
✅ Team approval

---

**Status Tracking:**
- Week 1: [ ] Not Started | [ ] In Progress | [ ] Completed
- Week 2: [ ] Not Started | [ ] In Progress | [ ] Completed
- Week 3: [ ] Not Started | [ ] In Progress | [ ] Completed
- Week 4: [ ] Not Started | [ ] In Progress | [ ] Completed

**Last Updated:** [Date]
**Assigned To:** [Name]
**Review Date:** [Date]
