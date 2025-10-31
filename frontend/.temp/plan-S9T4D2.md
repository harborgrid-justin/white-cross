# Student Hooks TypeScript Fixes - Implementation Plan (S9T4D2)

## Task ID: S9T4D2
## Agent: TypeScript Architect
## Started: 2025-10-31

## Cross-Agent References
- Related to API integration work by: `.temp/task-status-A1B2C3.json`
- Coordinated with accessibility audit: `.temp/task-status-X7Y3Z9.json`

## Objective
Fix all TypeScript errors in student-related hooks and services to achieve full type safety and eliminate implicit any types.

## Scope
- **6 files** to fix
- **~400 total errors** estimated
- Focus: Type safety, no code removal, preserve all functionality

## Files to Fix

### 1. src/hooks/domains/students/mutations/mutations.ts (110 errors)
**Issues:**
- Implicit any in callback parameters (onSuccess, onError, onMutate)
- Missing type parameters for UseMutationOptions
- Incorrect mutation function signatures
- Missing properties on cacheConfig.mutations

### 2. src/hooks/domains/students/mutations/useOptimisticStudents.ts (95 errors)
**Issues:**
- UseMutationOptions callbacks have extra parameters
- Type mismatches in onSuccess/onError callbacks
- Missing context type definitions

### 3. src/hooks/domains/students/composites/composite.ts (54 errors)
**Issues:**
- Missing properties on utility hook returns (phiHandler, cacheManager, bulkOps)
- Implicit any in callback parameters
- Type mismatches in student update data
- Missing StudentFilters properties (sortBy)

### 4. src/hooks/utilities/studentRedux.ts (50 errors)
**Issues:**
- Mock actions returning void instead of action objects
- useDispatch/useSelector type issues
- Missing type imports

### 5. src/lib/query/hooks/useStudents.ts (44 errors)
**Issues:**
- UseMutationOptions callback signature mismatches
- Missing context parameter types

### 6. src/services/modules/studentsApi.ts (47 errors)
**Issues:**
- Zod error.errors property access
- Response data type narrowing issues

## Implementation Strategy

### Phase 1: Core Type Definitions (1 hour)
- [ ] Add missing interface properties
- [ ] Create proper callback type definitions
- [ ] Fix UseMutationOptions type parameters

### Phase 2: Fix Mutation Hooks (2 hours)
- [ ] Fix mutations.ts callback signatures
- [ ] Fix useOptimisticStudents.ts callbacks
- [ ] Add proper context types

### Phase 3: Fix Composite & Utilities (1.5 hours)
- [ ] Fix composite.ts utility hook issues
- [ ] Fix studentRedux.ts mock actions
- [ ] Add missing type imports

### Phase 4: Fix API & Query Hooks (1 hour)
- [ ] Fix studentsApi.ts Zod error handling
- [ ] Fix useStudents.ts callback types
- [ ] Add type narrowing guards

### Phase 5: Verification (30 min)
- [ ] Run npm run type-check
- [ ] Verify no student-related errors remain
- [ ] Document any breaking changes

## Timeline
- **Total estimated time**: 6 hours
- **Complexity**: Medium-High
- **Priority**: High

## Success Criteria
- ✅ All TypeScript errors in student hooks resolved
- ✅ No implicit any types remaining
- ✅ All callbacks properly typed
- ✅ No code removed (only type additions/fixes)
- ✅ npm run type-check passes for student files

## Risk Mitigation
- Preserve all existing functionality
- Add types incrementally, verify each file
- Use type assertions only where absolutely necessary
- Document any complex type decisions
