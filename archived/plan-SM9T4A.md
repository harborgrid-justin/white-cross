# State Management Optimization Plan - Identity-Access Module

**Agent ID**: state-management-architect
**Plan ID**: SM9T4A
**Date**: 2025-11-04
**Module**: `F:/temp/white-cross/frontend/src/identity-access`
**References**: API Architecture Review K8L9M3

---

## Executive Summary

Comprehensive state management refactoring to resolve critical anti-patterns, performance issues, and type safety gaps in the identity-access module. Current implementation suffers from Redux+Context duplication, frequent re-renders, state duplication, and extensive use of `any` types.

**Timeline**: 2-3 hours
**Complexity**: High (architectural changes + migration)
**Impact**: High (affects all auth-related components)

---

## Phase 1: Analysis & Architecture Decision (30 minutes)

### Current State Mapping

**Redux State** (`authSlice.ts`):
- `user: User | null`
- `isAuthenticated: boolean`
- `isLoading: boolean`
- `error: string | null`
- `sessionExpiresAt: number | null` ⚠️ DUPLICATE

**Context State** (`AuthContext.tsx`):
- Wraps Redux state (anti-pattern)
- `lastActivityAt: number` (local state) ⚠️ CAUSES RE-RENDERS
- `sessionExpiresAt` from Redux ⚠️ DUPLICATE
- Session warning UI state

**Access Control Slice** (`accessControlSlice.ts`):
- 919 lines with extensive `any` types ⚠️ TYPE SAFETY
- Complex state structure (roles, permissions, incidents, sessions)

### Performance Issues Identified

1. **lastActivityAt Re-render Storm**: Updates on every mouse move → all consumers re-render
2. **Unstable Functions**: Context functions recreated on every render
3. **Interval Dependency**: `checkSession` causes interval recreation
4. **No Selector Granularity**: Components subscribe to entire auth object

### Architectural Decision Matrix

| Criteria | Redux-Only | Context-Only | Clear Separation |
|----------|-----------|--------------|------------------|
| **Codebase Fit** | ⭐⭐⭐⭐⭐ Already using Redux | ⭐⭐ Major refactor needed | ⭐⭐⭐⭐ Balanced |
| **Performance** | ⭐⭐⭐⭐ Good selector optimization | ⭐⭐⭐ Can optimize with selectors | ⭐⭐⭐⭐⭐ Best of both |
| **Developer Experience** | ⭐⭐⭐⭐ Redux DevTools | ⭐⭐⭐⭐ React-idiomatic | ⭐⭐⭐ More complex |
| **Migration Effort** | ⭐⭐⭐⭐ Remove Context only | ⭐ Complete rewrite | ⭐⭐⭐ Moderate refactor |
| **Type Safety** | ⭐⭐⭐⭐⭐ RTK typed | ⭐⭐⭐⭐ Manual typing | ⭐⭐⭐⭐ Typed both |
| **SSR Compatibility** | ⭐⭐⭐⭐⭐ Client-side only | ⭐⭐⭐⭐⭐ Client-side only | ⭐⭐⭐⭐⭐ Both work |

**DECISION: Option C - Clear Separation** (Recommended)

**Rationale**:
- **Redux**: User data, authentication status, permissions (changes infrequently)
- **Context**: Session activity tracking, UI state (changes frequently)
- **Benefits**: Best performance, clear separation of concerns, minimal migration
- **Aligns with**: API architect's recommendation for clear boundaries

---

## Phase 2: Architecture Design (30 minutes)

### New State Architecture

```typescript
// ========================================
// REDUX SLICES (Global, Persistent State)
// ========================================

// authSlice.ts - User Authentication
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  sessionExpiresAt: number | null; // Single source of truth
  error: string | null;
}

// accessControlSlice.ts - Permissions & Roles
interface AccessControlState {
  roles: Role[];
  permissions: Permission[];
  userPermissions: string[];
  // ... with proper TypeScript types (no 'any')
}

// ========================================
// SPLIT CONTEXTS (UI-specific, Transient)
// ========================================

// AuthDataContext - Stable auth data (rarely changes)
interface AuthDataContextValue {
  user: User | null;
  isAuthenticated: boolean;
  sessionExpiresAt: number | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// SessionActivityContext - Frequent updates (isolated)
interface SessionActivityContextValue {
  lastActivityAt: number;
  updateActivity: () => void;
  checkSession: () => boolean;
  isSessionWarningVisible: boolean;
}

// AuthPermissionsContext - Authorization helpers
interface AuthPermissionsContextValue {
  hasRole: (role: string | string[]) => boolean;
  hasPermission: (permission: string) => boolean;
  permissions: string[];
}
```

### Granular Selector Hooks

```typescript
// hooks/state/useAuthUser.ts
export function useAuthUser(): User | null {
  return useSelector((state: RootState) => state.auth.user);
}

// hooks/state/useAuthStatus.ts
export function useAuthStatus(): AuthStatus {
  return useSelector((state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
    sessionExpiresAt: state.auth.sessionExpiresAt
  }), shallowEqual);
}

// hooks/state/usePermissions.ts
export function usePermissions(): string[] {
  return useSelector((state: RootState) =>
    state.accessControl.userPermissions
  );
}
```

---

## Phase 3: Implementation (60 minutes)

### Step 1: Optimize Redux Slices

**authSlice.ts**:
- ✅ Keep as single source of truth for user data
- ✅ Remove `isLoading` (move to local component state or RTK Query)
- ✅ Add proper async thunk error handling
- ✅ Add memoized selectors

**accessControlSlice.ts**:
- ⚠️ Replace all `any` types with proper TypeScript interfaces
- ⚠️ Split into smaller focused slices if >500 lines
- ✅ Add typed selectors for common queries
- ✅ Improve state structure (normalize if needed)

### Step 2: Split AuthContext into Three Contexts

**File Structure**:
```
contexts/
├── AuthDataContext.tsx       (stable auth data)
├── SessionActivityContext.tsx (activity tracking)
├── AuthPermissionsContext.tsx (authorization helpers)
└── AuthProvider.tsx          (combines all three)
```

**Performance Strategy**:
- **AuthDataContext**: Updates only on login/logout
- **SessionActivityContext**: Updates on activity (isolated from other consumers)
- **AuthPermissionsContext**: Derived from Redux, cached

### Step 3: Create Granular Hooks

**Create New Files**:
```
hooks/state/
├── useAuthUser.ts         (user object only)
├── useAuthStatus.ts       (isAuthenticated + sessionExpiresAt)
├── useSessionActivity.ts  (lastActivityAt + updateActivity)
├── usePermissions.ts      (permissions array)
├── useHasRole.ts          (role checking with memoization)
└── useHasPermission.ts    (permission checking)
```

### Step 4: Memoization & Performance

**Apply to Context**:
```typescript
// Memoize functions
const login = useCallback(async (...) => { ... }, [dispatch]);
const logout = useCallback(async (...) => { ... }, [dispatch, router]);
const updateActivity = useCallback(() => { ... }, []);

// Memoize derived values
const hasRole = useCallback((role) => { ... }, [user]);
const hasPermission = useCallback((perm) => { ... }, [user?.permissions]);

// Stable context values
const authDataValue = useMemo(() => ({
  user, isAuthenticated, sessionExpiresAt, login, logout
}), [user, isAuthenticated, sessionExpiresAt, login, logout]);
```

**Fix Interval Cleanup**:
```typescript
// Stabilize checkSession with useCallback
const checkSession = useCallback(() => {
  // ... logic
}, [isAuthenticated, lastActivityAt, sessionExpiresAt, dispatch, router]);

// Interval with stable dependency
useEffect(() => {
  if (!isAuthenticated) return;

  const interval = setInterval(checkSession, ACTIVITY_CHECK_INTERVAL);
  return () => clearInterval(interval);
}, [isAuthenticated, checkSession]); // Now stable!
```

---

## Phase 4: State Persistence (20 minutes)

### Redux Persist Configuration

```typescript
// Already implemented in store.ts
// Verify HIPAA compliance:
// ✅ User profile in sessionStorage (not localStorage)
// ✅ No PHI in persisted state
// ✅ Clear on logout
```

### Migration Handling

```typescript
// Add state migration for schema changes
const migrations = {
  0: (state: any) => {
    // Initial migration if needed
    return state;
  }
};
```

---

## Phase 5: Migration Guide (20 minutes)

### Component Migration Patterns

**Before (Anti-pattern)**:
```typescript
// Component using AuthContext (wraps Redux)
const { user, isAuthenticated } = useAuth();
```

**After (Optimized)**:
```typescript
// Component using granular hooks
const user = useAuthUser();
const { isAuthenticated } = useAuthStatus();
```

**Before (Causes re-renders)**:
```typescript
// Subscribes to lastActivityAt changes
const { lastActivityAt, updateActivity } = useAuth();
```

**After (Isolated)**:
```typescript
// Only re-renders when activity changes
const { updateActivity } = useSessionActivity();
```

---

## Phase 6: Testing & Validation (20 minutes)

### Performance Tests

1. **Re-render Tracking**:
   - Install React DevTools Profiler
   - Track re-renders on mouse move (should only affect SessionActivity consumers)
   - Verify AuthData consumers don't re-render

2. **Memory Leak Detection**:
   - Check interval cleanup (no lingering intervals after unmount)
   - Verify BroadcastChannel closes properly
   - Test rapid login/logout cycles

3. **Cross-tab Sync**:
   - Verify login syncs across tabs
   - Verify logout syncs across tabs
   - Test activity sync

### Validation Checklist

- [ ] No components subscribe to entire auth state
- [ ] lastActivityAt updates don't trigger widespread re-renders
- [ ] All context functions are memoized with useCallback
- [ ] Intervals cleaned up properly (no memory leaks)
- [ ] sessionExpiresAt has single source of truth (Redux)
- [ ] All `any` types removed from accessControlSlice
- [ ] Redux selectors are memoized
- [ ] State persistence works correctly
- [ ] SSR hydration has no mismatches

---

## Deliverables

1. **Optimized State Files**:
   - `stores/slices/authSlice.ts` (enhanced with selectors)
   - `stores/slices/accessControlSlice.ts` (fully typed)
   - `contexts/AuthDataContext.tsx` (new, split)
   - `contexts/SessionActivityContext.tsx` (new, split)
   - `contexts/AuthPermissionsContext.tsx` (new, split)
   - `contexts/AuthProvider.tsx` (combines contexts)

2. **Granular Hooks**:
   - `hooks/state/useAuthUser.ts`
   - `hooks/state/useAuthStatus.ts`
   - `hooks/state/useSessionActivity.ts`
   - `hooks/state/usePermissions.ts`
   - `hooks/state/useHasRole.ts`
   - `hooks/state/useHasPermission.ts`

3. **Documentation**:
   - Migration guide for components
   - Architecture decision record
   - Performance improvement metrics
   - Updated type definitions

---

## Success Metrics

**Performance**:
- ✅ 90%+ reduction in re-renders on mouse activity
- ✅ No memory leaks (stable memory profile)
- ✅ Faster component mount times (fewer context subscriptions)

**Code Quality**:
- ✅ 100% TypeScript type coverage (zero `any` types)
- ✅ All functions memoized with stable references
- ✅ Clear separation of concerns (Redux vs Context)

**Developer Experience**:
- ✅ Granular hooks for easy consumption
- ✅ Clear migration path documented
- ✅ Better DevTools debugging (Redux DevTools + React DevTools)

---

## Risk Mitigation

**Risk**: Breaking existing components during migration
**Mitigation**: Maintain backward compatibility with deprecated `useAuth()` hook that internally uses new hooks

**Risk**: Performance regression from split contexts
**Mitigation**: Extensive profiling before/after, revert if worse

**Risk**: SSR hydration mismatches
**Mitigation**: Proper hydration handling, client-side only state initialization

**Risk**: State synchronization bugs across tabs
**Mitigation**: Comprehensive cross-tab testing, BroadcastChannel error handling
