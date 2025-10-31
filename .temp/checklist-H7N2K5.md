# Checklist - Client-side Hooks and Navigation (H7N2K5)

## Phase 1: Audit
- [x] Check .temp/ directory for existing agent work
- [x] Search for window.location usage (52 files)
- [x] Search for useRouter usage (47 files)
- [x] Search for usePathname/useSearchParams/useParams (17 files)
- [x] Search for next/router imports (0 files - good!)
- [x] Examine key files in detail
- [x] Identify react-router-dom imports (5 critical files found)
- [x] Document current navigation patterns
- [x] Create architecture notes

## Phase 2: Fix React Router Imports (NEW - CRITICAL)
- [x] Fix routeValidation.ts - migrate to next/navigation
- [x] Fix useRouteState.ts - migrate to next/navigation (deprecated file)
- [x] Fix Breadcrumbs.tsx - migrate to next/navigation
- [x] Fix ProtectedRoute.tsx - migrate to next/navigation
- [ ] Fix development/navigation/examples.tsx - migrate to next/navigation (skipped - development file)
- [x] Update all hook APIs to match Next.js patterns
- [ ] Add Suspense boundaries where useSearchParams is used (next phase)

## Phase 3: Replace window.location
- [ ] Review each file using window.location
- [ ] Replace window.location.href with router.push()
- [ ] Replace window.location.pathname with usePathname()
- [ ] Replace window.location.search with useSearchParams()
- [ ] Add 'use client' directives
- [ ] Update imports to 'next/navigation'

## Phase 3: Update useRouter Usage
- [ ] Verify all useRouter imports from 'next/navigation'
- [ ] Update router.push() calls to new API
- [ ] Replace router.pathname usage
- [ ] Replace router.query usage
- [ ] Update router.replace() calls
- [ ] Add prefetching where appropriate

## Phase 4: Add Suspense Boundaries
- [ ] Identify all useSearchParams usage
- [ ] Wrap in Suspense boundaries
- [ ] Add appropriate loading fallbacks
- [ ] Test with dynamic routing

## Phase 5: TypeScript Types
- [ ] Type route params in dynamic routes
- [ ] Type search params
- [ ] Type router methods
- [ ] Update component prop types

## Phase 6: Validation
- [ ] Review all modified files
- [ ] Verify 'use client' directives
- [ ] Check TypeScript compilation
- [ ] Test navigation flows
- [ ] Document changes
