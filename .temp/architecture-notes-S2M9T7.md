# Architecture Notes - State Management Organization (S2M9T7)

## References to Other Agent Work
- **TypeScript Architect (T8C4M2)**: Identified 150+ implicit 'any' errors in React Query callbacks
  - This work aligns with state management patterns - will address type issues in state hooks
- **Previous implementation work**: Multiple agents have worked on component architecture

## Current State Management Architecture

### Three-Layer State Management (Correct Pattern)

1. **Server State - TanStack Query (React Query)**
   - Location: `src/hooks/domains/*/queries/`, `src/hooks/domains/*/mutations/`
   - Purpose: Server data fetching, caching, synchronization
   - Used for: Students, medications, health records, appointments, etc.
   - Issues: Type safety (from T8C4M2) - missing generic type parameters

2. **Client State - Redux Toolkit**
   - Location: `src/stores/slices/`
   - Purpose: UI state, filters, preferences, auth state
   - Features: HIPAA-compliant persistence, domain-based organization
   - Quality: ✅ Well-structured, properly configured

3. **Local State - React useState/useReducer**
   - Location: Component-level state management
   - Purpose: Form state, UI toggles, component-specific state
   - Form validation: React Hook Form + Zod
   - Quality: ✅ Generally well-used

### Provider Hierarchy

**Main Providers** (`src/app/providers.tsx`):
```typescript
ReduxProvider
  → QueryClientProvider (TanStack Query)
    → ApolloProvider (GraphQL)
      → AuthProvider
        → NavigationProvider
```

**Status**: ✅ Well-organized, proper hierarchy

## Critical Issues Identified

### 1. Duplicate AuthContext Files (High Priority)

**Problem**: Three AuthContext implementations exist:

1. **ACTIVE** - `/src/contexts/AuthContext.tsx`
   - 557 lines, sophisticated implementation
   - Uses Redux (authSlice)
   - HIPAA-compliant session management
   - BroadcastChannel for multi-tab sync
   - Used by app/providers.tsx and 6 files

2. **DUPLICATE** - `/src/hooks/utilities/AuthContext.tsx`
   - 208 lines, simpler implementation
   - Does NOT use Redux
   - Legacy token management
   - **NOT IMPORTED ANYWHERE** (0 usages)
   - Should be DELETED

3. **DUPLICATE** - `/src/hooks/utilities/AuthContext.enhanced.tsx`
   - Enhanced variant
   - **NOT IMPORTED ANYWHERE** (0 usages)
   - Should be DELETED

**Impact**:
- Confusion for developers
- Risk of using wrong context
- FollowUpActionContext incorrectly imports from duplicate

**Fix**: Delete duplicate files in hooks/utilities/

### 2. Context Files in Wrong Directory (High Priority)

**Problem**: Provider components located in hooks directory

**Issue Files**:
- `/src/hooks/domains/incidents/FollowUpActionContext.tsx`
  - This is a PROVIDER component (750 lines)
  - Located in hooks/domains/ (incorrect)
  - Should be in contexts/incidents/ or providers/incidents/
  - Imports duplicate AuthContext from wrong location (line 32)

**Pattern**:
- Hooks should export hooks (functions starting with `use`)
- Providers should be in contexts/ or providers/
- This file has BOTH: `useFollowUpActions` hook AND `FollowUpActionProvider` component

**Fix**:
- Move provider to `/src/contexts/incidents/FollowUpActionContext.tsx`
- Fix import to use correct AuthContext from `/src/contexts/AuthContext`

### 3. Legacy Context Migration Files (Medium Priority)

**Problem**: Unused migration files still present

**Files**:
- `/src/hooks/utilities/legacy-contextMigration.tsx` (16KB)
  - Migration helper from old context pattern
  - Likely no longer needed
  - Should verify and remove if unused

### 4. Component Organization Patterns (Medium Priority)

**Current State**: Mixed patterns

**Good Examples** (Keep these patterns):
- `/src/components/features/health-records/components/tabs/OverviewTab.tsx`
  - Pure presentation component
  - No state management, just UI
  - Data passed via props

- `/src/components/features/students/StudentList.tsx`
  - Smart component with local state (selection, view mode)
  - Data received via props (from parent container/page)
  - Good separation: UI logic in component, data fetching in page

**Pattern to Establish**:
- Pages (in app/) = Data fetching (Server Components or with hooks)
- Feature components = Presentation + local UI state
- Hooks = Data fetching and business logic
- Contexts = Shared state providers

## State Boundaries Analysis

### Server State (TanStack Query) - ✅ Mostly Good

**Correct Usage**:
- Health records queries in `hooks/domains/health/queries/`
- Student queries in `hooks/domains/students/queries/`
- Medication queries properly structured
- Mutations properly organized

**Issues**:
- Missing type parameters (TypeScript Architect finding)
- Some contexts duplicate query logic (FollowUpActionContext)

### Client State (Redux) - ✅ Good

**Well-Structured**:
- Domain-based slices: auth, students, healthRecords, medications
- HIPAA-compliant persistence
- Proper middleware (persistence, audit)
- No PHI in localStorage

**No Issues Found**

### Local State - ✅ Good

**Well-Used**:
- Component-level toggles and selections
- Form state with React Hook Form
- UI-specific state properly localized

**No Major Issues Found**

## Architectural Recommendations

### File Organization Structure (Proposed)

```
src/
├── app/                          # Next.js App Router
│   ├── providers.tsx            # ✅ Root provider composition
│   └── (dashboard)/             # ✅ Route groups
│
├── components/                   # ✅ UI Components
│   ├── ui/                      # Primitive UI components
│   ├── features/                # Feature-specific components
│   ├── layouts/                 # Layout components
│   └── shared/                  # Shared components
│
├── contexts/                     # ✅ React Contexts
│   ├── AuthContext.tsx          # ✅ Main auth context
│   ├── NavigationContext.tsx    # ✅ Navigation state
│   └── incidents/               # ⚠️ MOVE FollowUpActionContext here
│       └── FollowUpActionContext.tsx
│
├── hooks/                        # React Hooks (NO PROVIDERS)
│   ├── domains/                 # Domain hooks
│   │   ├── students/
│   │   │   ├── queries/        # Query hooks only
│   │   │   ├── mutations/      # Mutation hooks only
│   │   │   └── composites/     # Composite hooks
│   │   └── incidents/
│   │       ├── queries/
│   │       ├── mutations/
│   │       └── ❌ FollowUpActionContext.tsx (MOVE TO contexts/)
│   ├── core/                    # Core hooks
│   ├── ui/                      # UI hooks
│   └── utilities/               # Utility hooks
│       ├── ❌ AuthContext.tsx (DELETE - duplicate)
│       ├── ❌ AuthContext.enhanced.tsx (DELETE - duplicate)
│       └── ❌ legacy-contextMigration.tsx (VERIFY & DELETE)
│
└── stores/                       # ✅ Redux Store
    ├── store.ts                 # Store configuration
    └── slices/                  # Redux slices
```

### Context Provider Patterns

**Rule**: Separate hook from provider

**Before** (FollowUpActionContext - current anti-pattern):
```typescript
// In hooks/domains/incidents/FollowUpActionContext.tsx
export function FollowUpActionProvider() { /* ... */ }  // Provider component
export function useFollowUpActions() { /* ... */ }      // Hook
```

**After** (recommended pattern):
```typescript
// In contexts/incidents/FollowUpActionContext.tsx
export function FollowUpActionProvider() { /* ... */ }  // Provider component
export function useFollowUpActions() { /* ... */ }      // Hook to consume context

// OR split into two files:
// contexts/incidents/FollowUpActionProvider.tsx - Provider
// hooks/domains/incidents/useFollowUpActions.ts - Hook
```

### State Selection Guidelines

**When to use each state layer**:

1. **TanStack Query (Server State)**:
   - ✅ Data from backend API
   - ✅ Entities: students, medications, health records
   - ✅ Lists with filters
   - ❌ UI state (filters, sort order, view mode)

2. **Redux (Client State)**:
   - ✅ Authentication state
   - ✅ UI preferences (theme, sidebar collapsed)
   - ✅ Filters and sort config (persistable)
   - ✅ Global UI state
   - ❌ Server data (use Query)
   - ❌ Form state (use React Hook Form)

3. **Local State (useState)**:
   - ✅ Component-specific toggles
   - ✅ Modal open/close
   - ✅ Selection state
   - ✅ Temporary form input
   - ❌ Data that needs to persist
   - ❌ Data shared across components

4. **Context (Custom Providers)**:
   - ✅ Feature-specific state (e.g., FollowUpActions for incidents)
   - ✅ When Redux is overkill
   - ✅ Scoped to specific feature tree
   - ❌ Global app state (use Redux)
   - ❌ Server data (use Query)

## Quality Standards Applied

### Component Organization
- ✅ Clear separation: Pages fetch data, Components display
- ✅ Server Components used in App Router
- ✅ Client Components marked with 'use client'
- ⚠️ Some contexts in wrong directories

### State Management
- ✅ Three-layer architecture properly implemented
- ✅ HIPAA compliance in Redux persistence
- ✅ Type safety (except Query callback types - see T8C4M2)
- ⚠️ Duplicate auth contexts need cleanup

### Developer Experience
- ✅ Redux DevTools configured
- ✅ React Query DevTools configured
- ✅ Clear domain-based organization
- ⚠️ Confusing file locations (contexts in hooks/)

## Integration with TypeScript Architect Work

The TypeScript Architect (T8C4M2) identified that React Query hooks need generic type parameters:

```typescript
// Current (implicit any)
const mutation = useMutation({
  onSuccess: (data, variables, context) => { /* ... */ }
});

// Should be
const mutation = useMutation<TData, TError, TVariables, TContext>({
  onSuccess: (data, variables, context) => { /* ... */ }
});
```

**Our role**: Ensure proper state management patterns are in place so these types can be properly applied.

## Performance Considerations

- ✅ Memoized selectors in contexts (FollowUpActionContext uses useMemo)
- ✅ Selective Redux persistence (no PHI)
- ✅ React Query cache configuration
- ✅ React.memo used appropriately (StudentList)
- ✅ Optimistic updates in mutations

## Security & HIPAA Compliance

- ✅ PHI excluded from localStorage
- ✅ Auth tokens in sessionStorage only
- ✅ Session timeout (15 min idle)
- ✅ Audit middleware in Redux
- ✅ Multi-tab session sync
- ✅ Secure token management

## Summary

**Strengths**:
1. Well-structured three-layer state architecture
2. HIPAA-compliant Redux persistence
3. Proper provider hierarchy
4. Good Server Component usage
5. Domain-based hook organization

**Issues to Fix**:
1. Remove duplicate AuthContext files (hooks/utilities/)
2. Move FollowUpActionContext from hooks/ to contexts/
3. Fix incorrect AuthContext import in FollowUpActionContext
4. Remove legacy migration files
5. Document state management patterns

**Priority**:
1. HIGH: Delete duplicate AuthContext files
2. HIGH: Move FollowUpActionContext to correct directory
3. MEDIUM: Remove legacy-contextMigration.tsx
4. LOW: Document patterns in STATE_MANAGEMENT.md
