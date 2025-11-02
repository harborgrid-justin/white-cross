# Import Error Fix - Quick Start Guide
**For Immediate Implementation**

---

## TL;DR

**Problem**: 150 import errors across codebase
**Root Cause**: Corrupted node_modules (18%) + inconsistent exports (64%) + path mismatches (18%)
**Solution**: 4-phase fix taking 10-14 hours
**Outcome**: Zero import errors, full type safety

---

## Start Here (30 Minutes - CRITICAL)

### Phase 1: Fix Infrastructure

```bash
# Step 1: Navigate to project (2 min)
cd C:/temp/white-cross/frontend

# Step 2: Clean corrupted modules (3 min)
rm -rf node_modules package-lock.json

# Step 3: Reinstall everything (20 min)
npm install

# Step 4: Add missing types (2 min)
npm install --save-dev @types/jsonwebtoken

# Step 5: Verify success (3 min)
npx tsc --noEmit 2>&1 | grep -E "@apollo|@tanstack|clsx" | wc -l
# Should show 0 or close to 0
```

**Fixes**: 27 errors automatically
**Status Check**: If errors persist, verify npm install completed without errors

---

## Phase 2: UI Components (2-3 Hours)

### Quick Wins (30 min)

**Add to barrel files**:

```typescript
// src/components/ui/inputs/index.ts
export { SearchInput } from './SearchInput';

// src/components/ui/select/index.ts (or verify exists)
export { SelectOption } from './Select';

// src/components/ui/dialog/index.ts
export { Modal } from './Modal';

// src/components/ui/skeleton/index.ts
export { LoadingSpinner } from './Skeleton';
```

### Inventory Components (1 hour)

**Pattern for all 17 inventory components**:

```typescript
// Change from
export function InventoryCategoriesContent(props: Props) { ... }

// To dual export
export function InventoryCategoriesContent(props: Props) { ... }
export default InventoryCategoriesContent;
```

**Files**: All in `src/app/(dashboard)/inventory/*/_components/*.tsx`

### Health Records Modals (30 min)

**Same pattern for 7 modals** in `src/components/features/health-records/components/modals/`:
- AllergyModal.tsx
- CarePlanModal.tsx
- ConditionModal.tsx
- ConfirmationModal.tsx
- DetailsModal.tsx
- MeasurementModal.tsx
- VaccinationModal.tsx

**Fixes**: 47 errors

---

## Phase 3: Actions & Hooks (3-4 Hours)

### Communication Actions (30 min)

**Option A (Recommended)**: Update 6 component imports to use correct names:
- `cancelBroadcast` (not cancelBroadcastAction)
- `acknowledgeBroadcast` (not acknowledgeBroadcastAction)
- `archiveMessages` (not archiveMessageAction)
- `deleteMessages` (not deleteMessageAction)

**Option B**: Rename exports in `src/lib/actions/communications.actions.ts` to match imports

### Create Student Hooks (1 hour)

**Create two new files**:

```typescript
// src/hooks/useStudentAllergies.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import { clientGet } from '@/lib/api/client';

export interface StudentAllergy {
  id: string;
  studentId: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
}

export function useStudentAllergies(studentId: string) {
  return useQuery({
    queryKey: ['student-allergies', studentId],
    queryFn: () => clientGet<StudentAllergy[]>(`/api/v1/students/${studentId}/allergies`),
    enabled: !!studentId,
    meta: { containsPHI: true }
  });
}
```

**Add similar for useStudentPhoto.ts**

**Update** `src/hooks/index.ts`:
```typescript
export { useStudentAllergies } from './useStudentAllergies';
export { useStudentPhoto } from './useStudentPhoto';
```

### Fix Incident Paths (45 min)

**Investigate why** `@/actions/incidents.actions` fails
- Check tsconfig.json path aliases
- Verify file is at `src/actions/incidents.actions.ts`
- Update 18 incident files if path is different

### Standardize use-toast (15 min)

**Find and replace** in 11 files:
```typescript
// From
import { useToast } from '@/hooks/use-toast';
// or
import { useToast } from '@/hooks/useToast';

// To (standardized)
import { useToast } from '@/hooks';
```

**Fixes**: 45 errors

---

## Phase 4: Type Definitions (2-3 Hours)

### Document Types (30 min)

**Verify exports exist** in `src/types/documents.ts`:
```typescript
export interface DocumentMetadata { ... }
export interface SignatureWorkflow { ... }
export interface Signature { ... }
export enum SignatureStatus { ... }
export enum WorkflowStatus { ... }
export interface DocumentListResponse { ... }
```

If missing, add explicit `export` keywords.

### Medication Types (45 min)

**Create** `src/types/medications/api.ts` (or update existing):
```typescript
export interface FormularyFilters { ... }
export interface DrugInteraction { ... }
export interface DrugMonograph { ... }
export interface BarcodeResult { ... }
export interface LASAMedication { ... }
export interface Medication { ... }
export interface MedicationInventory { ... }
export interface MedicationReminder { ... }
export interface AdverseReaction { ... }
export interface AdverseReactionFormData { ... }
export interface MedicationAlert { ... }
```

### Settings Schemas (30 min)

**Create** `src/schemas/settings.schemas.ts`:
```typescript
import { z } from 'zod';

export const updateProfileSchema = z.object({ ... });
export const changePasswordSchema = z.object({ ... });
// ... 8 more schemas

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
```

### Misc Types (30 min)

- Add `BudgetVariance` to `src/types/budget.ts`
- Add `StandardEntityState` and `LoadingState` to `src/types/entityTypes.ts`

**Fixes**: 31 errors

---

## Validation After Each Phase

```bash
# Quick check
npx tsc --noEmit 2>&1 | grep -E "Cannot find module|has no exported member" | wc -l

# Full check
npx tsc --noEmit

# Build test
npm run build
```

**Expected Results**:
- After Phase 1: ~321 total errors
- After Phase 2: ~274 total errors
- After Phase 3: ~229 total errors
- After Phase 4: 0 import errors

---

## Emergency Troubleshooting

### If Phase 1 Fails
```bash
# Nuclear option
rm -rf node_modules package-lock.json .next
npm cache clean --force
npm install
```

### If Imports Still Fail
1. Check tsconfig.json has path aliases:
   ```json
   "paths": {
     "@/*": ["./src/*"]
   }
   ```
2. Restart TypeScript server in IDE
3. Clear .next build cache: `rm -rf .next`

### If You Get Stuck
- Read full analysis: `.temp/SYNTHESIS-REPORT-UI9X4K.md`
- Check detailed checklist: `.temp/checklist-UI9X4K.md`
- Review specific phase in plan: `.temp/plan-UI9X4K.md`

---

## Success Indicators

✅ `npx tsc --noEmit` shows 0 import/module errors
✅ `npm run build` completes successfully
✅ IDE autocomplete works for all imports
✅ No red underlines on import statements

---

## Time Estimates

- **Phase 1** (Critical): 30 minutes
- **Phase 2** (UI): 2-3 hours
- **Phase 3** (Actions/Hooks): 3-4 hours
- **Phase 4** (Types): 2-3 hours
- **Testing**: 1-2 hours

**Total**: 10-14 hours

---

## Questions?

**Full documentation** in `.temp/` directory:
- `SYNTHESIS-REPORT-UI9X4K.md` - Complete 40-page analysis
- `EXECUTIVE-SUMMARY-UI9X4K.md` - High-level overview
- `plan-UI9X4K.md` - Strategic plan
- `checklist-UI9X4K.md` - Detailed checklist

**Get Started**: Run Phase 1 commands above (30 min)
