# TypeScript Error Fix Plan - K9M3P6

## References to Other Agent Work
- Previous TypeScript error analysis: `.temp/typescript-errors-T5E8R2.txt`
- Architecture decisions: `.temp/architecture-notes-A1B2C3.md`
- Completion summary: `.temp/completion-summary-X7Y3Z9.md`

## Overview
Fix all 305 TS2305 and TS2307 errors by adding missing exports and creating missing modules.

## Phases

### Phase 1: Missing Exports (150 errors)
Add missing exports to existing modules:
- `@/types/budget` - export BudgetVariance
- `@/types/documents` - export DocumentMetadata, FileMetadata, SignatureWorkflow, etc.
- `@/schemas/settings.schemas` - export all schemas
- `@/stores/reduxStore` - export RootState, AppDispatch, etc.
- Service modules - export missing types

### Phase 2: Missing Hook Modules (50 errors)
Create missing hook modules:
- `@/hooks/use-toast.ts`
- `@/hooks/usePermissions.ts`
- `@/hooks/documents.ts`
- `@/hooks/useStudentAllergies.ts`
- `@/hooks/useStudentPhoto.ts`
- And others

### Phase 3: Missing Action Modules (15 errors)
Create missing action modules:
- `@/actions/incidents.actions.ts`
- `@/actions/alerts.actions.ts`
- `@/actions/appointments.actions.ts`

### Phase 4: Missing UI Components (10 errors)
Create missing UI components:
- `@/components/ui/dropdown-menu.tsx`
- `@/components/ui/table.tsx`
- `@/components/ui/Inputs/DatePicker.tsx`

### Phase 5: Missing Utilities (30 errors)
Create missing utility modules:
- `@/utils/cn.ts`
- Route utilities
- Service modules

### Phase 6: Test Utilities (10 errors)
Create missing test utilities:
- `@/test/utils/test-utils.tsx`
- `@/test/mocks/server.ts`
- `@/__tests__/utils/testHelpers.ts`

### Phase 7: Barrel Exports (20 errors)
Add barrel exports where needed:
- Student actions
- Hook indexes
- Component indexes

### Phase 8: External Library Types (20 errors)
Add ambient module declarations for external libraries

## Timeline
Estimated completion: 2-3 hours with systematic approach

## Success Criteria
- All 305 TS2305 and TS2307 errors resolved
- Type-check passes successfully
- No code deleted, only additions
