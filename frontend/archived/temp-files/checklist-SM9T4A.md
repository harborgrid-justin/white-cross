# State Management Optimization Checklist - SM9T4A

**Module**: identity-access
**Agent**: state-management-architect
**Date**: 2025-11-04

---

## Phase 1: Analysis & Architecture Decision ⏳

- [ ] Map all state locations (Redux, Context, local)
- [ ] Document state duplication instances
- [ ] Identify all performance bottlenecks
- [ ] Analyze TypeScript type issues (count `any` types)
- [ ] **Make architectural decision**: Redux-only vs Context-only vs Clear Separation
- [ ] Document decision with detailed rationale

## Phase 2: Architecture Design

- [ ] Design new state structure (Redux slices)
- [ ] Design split context architecture (3 contexts)
- [ ] Define TypeScript interfaces for all state
- [ ] Plan granular selector hooks (6 hooks)
- [ ] Document data flow and component integration

## Phase 3: Redux Optimization

### authSlice.ts
- [ ] Add memoized selectors (selectUser, selectAuthStatus, etc.)
- [ ] Enhance async thunk error handling
- [ ] Remove state duplication (single source for sessionExpiresAt)
- [ ] Add proper TypeScript types (no `any`)
- [ ] Document state structure and usage

### accessControlSlice.ts
- [ ] Replace all `any` types with proper TypeScript interfaces (919 lines)
- [ ] Create TypeScript interfaces for: Role, Permission, SecurityIncident, Session, IpRestriction
- [ ] Add typed selectors for common queries
- [ ] Improve state structure (normalize if needed)
- [ ] Add proper error types (no `any` in rejected actions)
- [ ] Split into smaller slices if >500 lines

## Phase 4: Split Contexts

- [ ] Create `contexts/AuthDataContext.tsx` (stable auth data)
- [ ] Create `contexts/SessionActivityContext.tsx` (activity tracking)
- [ ] Create `contexts/AuthPermissionsContext.tsx` (authorization helpers)
- [ ] Create `contexts/AuthProvider.tsx` (combines all three)
- [ ] Implement proper memoization (useCallback, useMemo)
- [ ] Fix interval cleanup issues
- [ ] Handle SSR hydration properly
- [ ] Add BroadcastChannel error handling

## Phase 5: Granular Selector Hooks

- [ ] Create `hooks/state/useAuthUser.ts`
- [ ] Create `hooks/state/useAuthStatus.ts`
- [ ] Create `hooks/state/useSessionActivity.ts`
- [ ] Create `hooks/state/usePermissions.ts`
- [ ] Create `hooks/state/useHasRole.ts`
- [ ] Create `hooks/state/useHasPermission.ts`
- [ ] Add memoization with shallowEqual where appropriate
- [ ] Document each hook with usage examples

## Phase 6: Memoization & Performance

- [ ] Memoize all context functions with useCallback
- [ ] Memoize all derived values with useMemo
- [ ] Stabilize checkSession function
- [ ] Fix interval dependencies (stable references)
- [ ] Ensure stable context values (prevent re-creation)
- [ ] Add shallowEqual to selector hooks
- [ ] Verify no unnecessary re-renders

## Phase 7: State Persistence

- [ ] Verify Redux Persist configuration
- [ ] Ensure HIPAA compliance (no PHI in localStorage)
- [ ] Test state hydration on page reload
- [ ] Handle SSR hydration mismatches
- [ ] Add state migration if schema changes
- [ ] Test cross-tab synchronization

## Phase 8: Migration

- [ ] Create migration guide for components
- [ ] Update component imports (examples for 3-5 common patterns)
- [ ] Add backward compatibility layer (deprecated useAuth hook)
- [ ] Update documentation with new patterns
- [ ] Create TypeScript migration checklist

## Phase 9: Testing & Validation

### Performance Testing
- [ ] Profile re-renders on mouse activity (before/after)
- [ ] Verify only SessionActivity consumers re-render
- [ ] Test memory leaks (interval cleanup)
- [ ] Measure component mount times
- [ ] Test cross-tab synchronization

### Functional Testing
- [ ] Test login flow with new architecture
- [ ] Test logout flow with new architecture
- [ ] Test session timeout (idle + token expiration)
- [ ] Test permission checking (hasRole, hasPermission)
- [ ] Test error handling and recovery
- [ ] Test SSR hydration (no mismatches)

### Type Safety Validation
- [ ] Zero `any` types in authSlice
- [ ] Zero `any` types in accessControlSlice
- [ ] All selectors properly typed
- [ ] All hooks properly typed
- [ ] All context values properly typed

## Phase 10: Documentation

- [ ] Create architecture decision record
- [ ] Write migration guide with code examples
- [ ] Document performance improvements (metrics)
- [ ] Update README with new state management patterns
- [ ] Add JSDoc comments to all new hooks
- [ ] Create state architecture diagram

---

## Final Validation

- [ ] All components using granular hooks (not entire auth state)
- [ ] No state duplication (sessionExpiresAt single source)
- [ ] All functions memoized with stable references
- [ ] All intervals cleaned up properly
- [ ] All TypeScript types defined (zero `any`)
- [ ] Redux selectors memoized
- [ ] State persistence works correctly
- [ ] SSR hydration successful (no mismatches)
- [ ] Performance improvements documented
- [ ] Migration guide complete
