# Architecture Notes - Client-side Hooks and Navigation (H7N2K5)

## Agent ID
Agent 4: Client-side Hooks and Navigation

## References to Other Agent Work
- App Router conventions: `.temp/architecture-notes-AP9E2X.md`
- TypeScript improvements: `.temp/architecture-notes-R3M8D1.md`
- Component patterns: `.temp/architecture-notes-N4W8Q2.md`

## Critical Issues Found

### 1. Wrong Library Imports (CRITICAL)
Several files are importing from `react-router-dom` instead of `next/navigation`. This is incompatible with Next.js App Router:

**Files using react-router-dom (MUST FIX):**
1. `/home/user/white-cross/frontend/src/hooks/utilities/routeValidation.ts` - Line 32
2. `/home/user/white-cross/frontend/src/hooks/utilities/useRouteState.ts` - Line 25
3. `/home/user/white-cross/frontend/src/components/ui/navigation/Breadcrumbs.tsx` - Line 25
4. `/home/user/white-cross/frontend/src/components/auth/ProtectedRoute.tsx` - Line 14
5. `/home/user/white-cross/frontend/src/components/development/navigation/examples.tsx` - Line 25

**Test file (SKIP):**
- `useRouteState.test.tsx` - Test file, can use react-router-dom for testing

### 2. Files Using Correct Next.js Hooks (GOOD)
These files are already correct:
- `useRouteState.tsx` - Uses next/navigation properly
- `StudentsFilters.tsx` - Uses next/navigation properly
- `Sidebar.tsx` - Uses next/navigation properly
- `login/page.tsx` - Uses next/navigation properly

### 3. window.location Usage
Found 52 files using window.location. Need to examine each case:
- Some may be legitimate (e.g., for initial state, external redirects)
- Others should use Next.js hooks

## Navigation Hook Migration Guide

### React Router → Next.js App Router

| React Router | Next.js App Router | Usage |
|--------------|-------------------|-------|
| `useNavigate()` | `useRouter()` from 'next/navigation' | Client-side navigation |
| `useLocation().pathname` | `usePathname()` | Get current path |
| `useSearchParams()` | `useSearchParams()` | Get URL search params (needs Suspense) |
| `useParams()` | `useParams()` | Get dynamic route params |
| `<Navigate />` | `redirect()` or `router.push()` | Redirects |
| `<Link />` | `<Link />` from 'next/link' | Navigation links |

### Key Differences

1. **useRouter API Changes:**
   - Next.js: `router.push('/path')`, `router.replace('/path')`, `router.back()`
   - React Router: `navigate('/path')`, `navigate(-1)`

2. **useSearchParams Requires Suspense:**
   - Must wrap components using useSearchParams in `<Suspense>` boundaries
   - Provide loading fallback UI

3. **No useLocation:**
   - Split into `usePathname()` for path
   - Use `useSearchParams()` for query params
   - Use `useParams()` for route params

4. **Link Component:**
   - Import from 'next/link' not 'react-router-dom'
   - Uses `href` prop instead of `to`

## Design Decisions

### Decision 1: Migration Strategy
**Decision:** Fix imports first, then add Suspense boundaries, then handle edge cases
**Rationale:** Import fixes are straightforward and prevent runtime errors. Suspense is required for useSearchParams.

### Decision 2: window.location Usage
**Decision:** Keep window.location for initial state and external redirects, replace for navigation
**Rationale:** Some window.location usage is legitimate (SSR-safe initial state). Only replace when proper Next.js hooks are better.

### Decision 3: Backward Compatibility
**Decision:** Create wrapper hooks that match old API but use Next.js internally
**Rationale:** Minimizes changes to consuming components while using correct navigation underneath.

## Integration Points

### With Other Navigation
- Sidebar uses `usePathname()` for active state
- NavigationContext tracks history (needs coordination with Next.js navigation)
- RouteState uses window.history.replaceState (needs review)

### With TypeScript
- All hooks need proper type definitions
- Route params should be typed based on route structure
- SearchParams should have schema validation (Zod)

### With Suspense
- Components using useSearchParams must be wrapped in Suspense
- Need to determine appropriate loading UI for each context
- Error boundaries should catch navigation errors

## Performance Considerations

### Prefetching
- Next.js Link automatically prefetches on hover
- Can manually prefetch with `router.prefetch('/path')`
- Should identify critical navigation paths for prefetching

### Client/Server Boundaries
- Navigation hooks can only be used in client components
- Need 'use client' directive at top of files
- Server Components should use native Next.js navigation

## Migration Priority

**Phase 1 (HIGH PRIORITY):**
1. Fix react-router-dom imports to next/navigation
2. Update routeValidation.ts hook APIs
3. Fix Breadcrumbs component
4. Fix ProtectedRoute component

**Phase 2 (MEDIUM PRIORITY):**
5. Audit window.location usage (52 files)
6. Add Suspense boundaries for useSearchParams
7. Update NavigationContext to work with Next.js

**Phase 3 (LOW PRIORITY):**
8. Add proper TypeScript types
9. Optimize prefetching strategy
10. Add comprehensive tests

## Risks and Mitigation

### Risk 1: Breaking Changes
**Risk:** Updating navigation hooks could break existing functionality
**Mitigation:** Test each change thoroughly, update incrementally

### Risk 2: Missing Suspense Boundaries
**Risk:** Using useSearchParams without Suspense causes errors
**Mitigation:** Audit all useSearchParams usage, add Suspense wrappers

### Risk 3: Type Safety Loss
**Risk:** Replacing typed hooks with untyped ones
**Mitigation:** Add proper TypeScript types for all navigation hooks

## Testing Strategy

1. **Unit Tests:** Test individual hook replacements
2. **Integration Tests:** Test navigation flows
3. **E2E Tests:** Test complete user journeys
4. **Manual Testing:** Verify all navigation patterns work
