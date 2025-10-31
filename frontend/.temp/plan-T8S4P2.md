# TypeScript Error Fixing Plan - Incident Hooks & Services
**Agent ID**: typescript-architect (T8S4P2)
**Created**: 2025-10-31
**Referenced Work**:
- Planning by Agent A1B2C3: `.temp/plan-A1B2C3.md`
- Planning by Agent X7Y3Z9: `.temp/plan-X7Y3Z9.md`

## Objective
Fix all TypeScript errors in incident-related hooks, context, tests, and API service files without removing any code. Focus on adding proper types, interfaces, and fixing implicit any parameters.

## Target Files (304 total errors)
1. `src/hooks/domains/incidents/mutations/useOptimisticIncidents.ts` (126 errors)
2. `src/hooks/domains/incidents/WitnessStatementContext.tsx` (58 errors)
3. `src/stores/slices/incidentReportsSlice.test.ts` (53 errors)
4. `src/services/modules/incidentsApi.ts` (67 errors)

## Error Categories Identified

### Category 1: TanStack Query Callback Signatures
- **Issue**: `onSuccess` and `onError` callbacks expect 3 parameters, but code passes 4 (including queryClient)
- **Solution**: Remove `queryClient` parameter from callback signatures and use the queryClient from closure
- **Files**: useOptimisticIncidents.ts, WitnessStatementContext.tsx

### Category 2: Implicit Any Types
- **Issue**: Parameters without type annotations default to `any`
- **Solution**: Add explicit type annotations using existing type imports
- **Files**: All files

### Category 3: Generic Type Parameters
- **Issue**: Missing or incorrect generic type parameters in query/mutation functions
- **Solution**: Add proper generic constraints using existing types
- **Files**: useOptimisticIncidents.ts, WitnessStatementContext.tsx

### Category 4: Test Type Safety
- **Issue**: Test mock functions missing type annotations
- **Solution**: Add proper types for test helpers and mocks
- **Files**: incidentReportsSlice.test.ts

### Category 5: Error Handling Types
- **Issue**: Error objects typed as `any` in catch blocks
- **Solution**: Use proper error types (Error, unknown) with type guards
- **Files**: All files

## Implementation Phases

### Phase 1: Fix useOptimisticIncidents.ts (126 errors)
**Duration**: 15 minutes
**Focus**:
- Fix TanStack Query callback signatures (onSuccess, onError)
- Remove queryClient from callback parameters
- Add explicit types for mutation context objects
- Fix any types in filters parameter
- Add proper generic constraints for optimistic helpers

### Phase 2: Fix WitnessStatementContext.tsx (58 errors)
**Duration**: 10 minutes
**Focus**:
- Fix mutation callback signatures
- Add explicit types for error handling
- Add types for context objects in mutations
- Fix any types in event handlers

### Phase 3: Fix incidentReportsSlice.test.ts (53 errors)
**Duration**: 10 minutes
**Focus**:
- Add type annotations for test helper functions
- Fix mock incident report factory types
- Add proper types for thunk action creators
- Fix selector test parameter types

### Phase 4: Fix incidentsApi.ts (67 errors)
**Duration**: 10 minutes
**Focus**:
- Add explicit types for error handling
- Fix any types in generic parameters
- Add proper return type annotations
- Fix parameter type annotations

### Phase 5: Validation & Verification
**Duration**: 5 minutes
**Focus**:
- Run type-check to verify all errors resolved
- Ensure no new errors introduced
- Validate that code logic unchanged

## Technical Approach

### TanStack Query Callback Signatures
```typescript
// BEFORE (incorrect - 4 parameters)
onSuccess?: (response: T, variables: V, context: C, queryClient: QueryClient) => void

// AFTER (correct - 3 parameters)
onSuccess?: (response: T, variables: V, context: C) => void
// Use queryClient from closure instead
```

### Implicit Any Fixes
```typescript
// BEFORE
const handler = (error) => { ... }

// AFTER
const handler = (error: Error) => { ... }
// OR
const handler = (error: unknown) => {
  if (error instanceof Error) { ... }
}
```

### Generic Type Constraints
```typescript
// BEFORE
optimisticCreate<T>(...)

// AFTER
optimisticCreate<IncidentReport>(...)
```

## Success Criteria
- ✅ All 304 TypeScript errors resolved
- ✅ No code functionality removed
- ✅ Proper type safety throughout
- ✅ No new errors introduced
- ✅ Type-check passes for incident-related files

## Risk Assessment
- **Low Risk**: Adding type annotations doesn't change runtime behavior
- **Medium Risk**: TanStack Query callback signature changes require careful validation
- **Mitigation**: Test each file incrementally with type-check

## Dependencies
- Existing type definitions in `@/types/incidents`
- TanStack Query v5 type definitions
- Redux toolkit type definitions

## Coordination Notes
- Building on accessibility work from Agent X7Y3Z9
- Following type safety patterns from Agent A1B2C3
- No conflicts with existing work products
