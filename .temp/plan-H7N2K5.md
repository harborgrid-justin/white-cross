# Plan - Client-side Hooks and Navigation (H7N2K5)

## Agent ID
Agent 4: Client-side Hooks and Navigation

## References to Other Agent Work
- Architecture notes: `.temp/architecture-notes-AP9E2X.md` (App Router conventions)
- Architecture notes: `.temp/architecture-notes-R3M8D1.md` (TypeScript improvements)
- Architecture notes: `.temp/architecture-notes-N4W8Q2.md` (Component patterns)

## Mission
Update client components to use Next.js navigation hooks properly in the App Router.

## Phases

### Phase 1: Audit (Current)
**Timeline**: 30 minutes
**Deliverables**:
- Comprehensive audit of navigation patterns
- List of files using window.location (52 files found)
- List of files using useRouter (47 files found)
- List of files using usePathname/useSearchParams/useParams (17 files found)
- Identification of missing Suspense boundaries

### Phase 2: Replace window.location
**Timeline**: 45 minutes
**Deliverables**:
- Replace window.location.href with router.push()
- Replace window.location.pathname with usePathname()
- Replace window.location.search with useSearchParams()
- Add 'use client' directives where needed

### Phase 3: Update useRouter Usage
**Timeline**: 45 minutes
**Deliverables**:
- Ensure all useRouter imports from 'next/navigation'
- Update router methods to App Router API
- Replace router.pathname with usePathname()
- Replace router.query with useSearchParams()

### Phase 4: Add Suspense Boundaries
**Timeline**: 30 minutes
**Deliverables**:
- Wrap components using useSearchParams in Suspense
- Add appropriate fallback UI
- Ensure proper error boundaries

### Phase 5: TypeScript Types
**Timeline**: 30 minutes
**Deliverables**:
- Add proper types for route params
- Add proper types for search params
- Type router navigation methods

### Phase 6: Validation
**Timeline**: 30 minutes
**Deliverables**:
- Review all changes for correctness
- Verify proper client/server boundaries
- Test navigation flows
- Document changes

## Total Estimated Time
3 hours
