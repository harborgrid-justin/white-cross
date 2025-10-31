# Student Hooks TypeScript Fixes - Checklist (S9T4D2)

## Phase 1: Core Type Definitions ⏳
- [x] Analyze all errors across 6 files
- [ ] Create MutationCallbackContext interface
- [ ] Fix UseMutationOptions type parameters
- [ ] Add missing cacheConfig.mutations property

## Phase 2: Fix mutations.ts (110 errors) 🔄
- [ ] Fix onSuccess callback signatures (4 parameters issue)
- [ ] Fix onError callback signatures (4 parameters issue)
- [ ] Fix onMutate callback signatures
- [ ] Add explicit types for all callback parameters
- [ ] Fix createStudentUpdateOperation type
- [ ] Add cacheConfig.mutations default value
- [ ] Verify all 110 errors resolved

## Phase 3: Fix useOptimisticStudents.ts (95 errors)
- [ ] Fix useOptimisticStudentCreate onSuccess signature
- [ ] Fix useOptimisticStudentUpdate callbacks
- [ ] Fix useOptimisticStudentDeactivate callbacks
- [ ] Fix useOptimisticStudentReactivate callbacks
- [ ] Fix useOptimisticStudentTransfer callbacks
- [ ] Fix useOptimisticStudentPermanentDelete callbacks
- [ ] Verify all 95 errors resolved

## Phase 4: Fix composite.ts (54 errors)
- [ ] Add logDataAccess to PHIHandler interface
- [ ] Add checkPHIPermission to PHIHandler interface
- [ ] Add sanitizeData to PHIHandler interface
- [ ] Fix bulkUpdateStudents mutation reference
- [ ] Fix deactivateStudent mutation reference
- [ ] Fix reactivateStudent mutation reference
- [ ] Add invalidatePattern to CacheManager
- [ ] Add prefetchData to CacheManager
- [ ] Add getCacheStats to CacheManager
- [ ] Add selectedStudents to Redux integration
- [ ] Add hasSelection to Redux integration
- [ ] Add actions to Redux integration
- [ ] Fix sortBy in StudentFilters
- [ ] Fix all implicit any parameters
- [ ] Verify all 54 errors resolved

## Phase 5: Fix studentRedux.ts (50 errors)
- [ ] Fix mock action creators to return actions
- [ ] Add proper Redux action types
- [ ] Fix useDispatch type
- [ ] Fix useSelector type
- [ ] Add TypedUseSelectorHook usage
- [ ] Verify all 50 errors resolved

## Phase 6: Fix useStudents.ts (44 errors)
- [ ] Fix useCreateStudent callback signatures
- [ ] Fix useUpdateStudent callback signatures
- [ ] Fix useDeleteStudent callback signatures
- [ ] Remove extra parameters from callbacks
- [ ] Verify all 44 errors resolved

## Phase 7: Fix studentsApi.ts (47 errors)
- [ ] Fix Zod error.errors access
- [ ] Add proper error type guards
- [ ] Fix response.data type narrowing
- [ ] Add type assertions where needed
- [ ] Verify all 47 errors resolved

## Phase 8: Final Verification ✅
- [ ] Run npm run type-check for all student files
- [ ] Confirm 0 TypeScript errors in student hooks
- [ ] Update task-status-S9T4D2.json with completion
- [ ] Update progress-S9T4D2.md with final summary
- [ ] Move all tracking files to .temp/completed/

## Notes
- Current status: Phase 1 complete, starting Phase 2
- Total errors to fix: ~400
- No code removal allowed
- All type fixes must be additive only
