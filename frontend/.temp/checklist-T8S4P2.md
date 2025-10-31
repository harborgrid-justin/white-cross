# TypeScript Error Fixing Checklist
**Agent ID**: typescript-architect (T8S4P2)
**Task**: Fix all TypeScript errors in incident hooks and services

## Pre-Implementation
- [x] Analyze all target files
- [x] Identify error patterns
- [x] Create execution plan
- [x] Set up tracking documents

## Phase 1: useOptimisticIncidents.ts (126 errors)
- [ ] Fix onSuccess callback signature - remove queryClient parameter
- [ ] Fix onError callback signature - remove queryClient parameter
- [ ] Add explicit type for filters parameter in query keys
- [ ] Fix context types in onMutate handlers
- [ ] Fix error types in catch blocks
- [ ] Verify all mutation hooks fixed
- [ ] Run type-check for this file

## Phase 2: WitnessStatementContext.tsx (58 errors)
- [ ] Fix createMutation callback signatures
- [ ] Fix updateMutation callback signatures
- [ ] Fix deleteMutation callback signatures
- [ ] Fix verifyMutation callback signatures
- [ ] Fix unverifyMutation callback signatures
- [ ] Add explicit error types in catch blocks
- [ ] Run type-check for this file

## Phase 3: incidentReportsSlice.test.ts (53 errors)
- [ ] Add type annotations for createMockIncidentReport function
- [ ] Fix test callback parameter types
- [ ] Add types for thunk action test arguments
- [ ] Fix selector test parameter types
- [ ] Fix enum import issues
- [ ] Run type-check for this file

## Phase 4: incidentsApi.ts (67 errors)
- [ ] Add explicit types for catch block errors
- [ ] Fix any types in method parameters
- [ ] Add proper return type annotations
- [ ] Fix generic type parameters
- [ ] Run type-check for this file

## Phase 5: Final Validation
- [ ] Run full type-check on all incident files
- [ ] Verify error count reduced to 0
- [ ] Confirm no new errors introduced
- [ ] Validate code logic unchanged
- [ ] Update tracking documents

## Post-Implementation
- [ ] Create completion summary
- [ ] Move tracking files to completed/
- [ ] Document any follow-up items
