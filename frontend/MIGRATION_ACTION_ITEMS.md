# Migration Action Items - Services to Actions
## Remaining Work Checklist

**Status:** 80.7% Complete (109/135 files migrated)
**Remaining:** 26 import statements across 19 files
**Estimated Time:** 3.5-4.5 hours

---

## High Priority - Sprint 1 (2-3 hours)

### Health Records Hooks (7 files - 1.5 hours)
**Location:** `/workspaces/white-cross/frontend/src/hooks/domains/health-records/`

- [ ] **allergyHooks.ts** (20 min)
  - Update imports from allergyService to allergyActions
  - Verify hook functionality
  - Update tests

- [ ] **conditionHooks.ts** (20 min)
  - Update imports from conditionService to conditionActions
  - Verify hook functionality
  - Update tests

- [ ] **growthHooks.ts** (20 min)
  - Update imports from growthService to growthActions
  - Verify hook functionality
  - Update tests

- [ ] **healthRecordHooks.ts** (20 min)
  - Update imports from healthRecordService to healthRecordActions
  - Verify hook functionality
  - Update tests

- [ ] **screeningHooks.ts** (20 min)
  - Update imports from screeningService to screeningActions
  - Verify hook functionality
  - Update tests

- [ ] **vaccinationHooks.ts** (20 min)
  - Update imports from vaccinationService to vaccinationActions
  - Verify hook functionality
  - Update tests

- [ ] **vitalSignsHooks.ts** (20 min)
  - Update imports from vitalSignsService to vitalSignsActions
  - Verify hook functionality
  - Update tests

- [ ] **index.ts** (5 min)
  - Update re-exports if needed
  - Verify barrel file consistency

### Identity-Access Thunks (4 files - 1 hour)
**Location:** `/workspaces/white-cross/frontend/src/identity-access/stores/accessControl/thunks/`

- [ ] **incidentsThunks.ts** (15 min)
  - Update imports from incidentService to incidentActions
  - Verify Redux thunk functionality
  - Test state transitions

- [ ] **permissionsThunks.ts** (15 min)
  - Update imports from permissionService to permissionActions
  - Verify Redux thunk functionality
  - Test state transitions

- [ ] **rolesThunks.ts** (15 min)
  - Update imports from roleService to roleActions
  - Verify Redux thunk functionality
  - Test state transitions

- [ ] **sessionsThunks.ts** (15 min)
  - Update imports from sessionService to sessionActions
  - Verify Redux thunk functionality
  - Test state transitions

---

## Medium Priority - Sprint 1 (1 hour)

### Health Records Components (3 files - 45 min)
**Location:** `/workspaces/white-cross/frontend/src/components/features/health-records/components/`

- [ ] **modals/ScreeningModal.tsx** (15 min)
  - Replace service imports with hooks
  - Test modal functionality
  - Verify form submission

- [ ] **modals/VitalSignsModal.tsx** (15 min)
  - Replace service imports with hooks
  - Test modal functionality
  - Verify form submission

- [ ] **tabs/RecordsTab.tsx** (15 min)
  - Replace service imports with hooks
  - Test tab rendering
  - Verify data fetching

### App Data Files (1 file - 15 min)
**Location:** `/workspaces/white-cross/frontend/src/app/(dashboard)/communications/`

- [ ] **data.ts** (15 min)
  - Review if migration needed (may be test data)
  - Update if using actual services
  - Document decision

---

## Low Priority - Sprint 2 (30 minutes)

### Type Definitions (2 files - 15 min)
**Location:** `/workspaces/white-cross/frontend/src/types/`

- [ ] **domain/healthRecords.types.ts** (7.5 min)
  - Update type imports
  - Verify no circular dependencies
  - Consolidate with other type files

- [ ] **legacy/healthRecords.ts** (7.5 min)
  - Update type imports
  - Consider deprecation/removal
  - Document legacy status

### Utilities (1 file - 15 min)
**Location:** `/workspaces/white-cross/frontend/src/utils/`

- [ ] **healthRecords.ts** (15 min)
  - Update service imports to actions
  - Move shared utilities if needed
  - Update function references

---

## Validation Tasks (After Each Migration)

### Per-File Validation
- [ ] Run TypeScript compiler: `npx tsc --noEmit`
- [ ] Run unit tests: `npm test -- [test-file]`
- [ ] Manual testing (if UI component)
- [ ] Code review self-check

### Batch Validation (After Section Complete)
- [ ] Run full test suite: `npm test`
- [ ] Run E2E tests: `npm run test:e2e`
- [ ] Check bundle size impact
- [ ] Performance smoke test

### Final Validation (After All Complete)
- [ ] Full TypeScript compilation
- [ ] Complete test suite pass
- [ ] E2E test suite pass
- [ ] Code review approval
- [ ] Documentation update
- [ ] Performance benchmarking
- [ ] Bundle size analysis

---

## Migration Commands

### Setup
```bash
# Create migration branch
git checkout -b feat/migrate-services-to-actions-final

# Ensure dependencies installed
npm install
```

### During Migration
```bash
# Check current progress
grep -r "from.*services/modules" src --include="*.ts" --include="*.tsx" --exclude-dir=services | wc -l

# Verify TypeScript
npx tsc --noEmit

# Run tests
npm test
```

### After Migration
```bash
# Final verification
npm run build
npm test
npm run test:e2e

# Commit
git add .
git commit -m "feat: complete migration from services/modules to lib/actions

- Migrated remaining health records hooks
- Updated identity-access thunks
- Migrated health records components
- Updated type definitions and utilities
- All tests passing
- Zero breaking changes

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push and create PR
git push -u origin feat/migrate-services-to-actions-final
gh pr create --title "Complete migration from services/modules to lib/actions" --body "$(cat <<'EOF'
## Summary
- Completes migration from services/modules to lib/actions
- 19 remaining files updated
- 26 import statements converted
- Achieves 100% migration completion

## Changes
- Health records hooks migrated (7 files)
- Identity-access thunks updated (4 files)
- Health records components converted (3 files)
- Type definitions updated (2 files)
- Utilities migrated (1 file)
- App data files updated (1 file)

## Test Plan
- [x] TypeScript compilation passes
- [x] Unit tests pass
- [x] Integration tests pass
- [x] E2E tests pass
- [x] Manual smoke testing complete

## Migration Metrics
- Before: 135 files with services/modules imports
- After: 0 external references remaining
- Success Rate: 100%
- Breaking Changes: 0

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Migration Patterns Reference

### Pattern 1: Service to Action Import
```typescript
// BEFORE
import { allergyService } from '@/services/modules/healthRecords/allergyService';

// AFTER
import {
  createAllergy,
  updateAllergy,
  deleteAllergy,
  getAllergies,
  getAllergy
} from '@/lib/actions/allergyActions';
```

### Pattern 2: Service Method to Action Function
```typescript
// BEFORE
const allergies = await allergyService.getAllergies(patientId);
await allergyService.createAllergy(data);

// AFTER
const allergies = await getAllergies(patientId);
await createAllergy(data);
```

### Pattern 3: Hook with Service to Hook with Action
```typescript
// BEFORE
export const useAllergies = (patientId: string) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    allergyService.getAllergies(patientId).then(setData);
  }, [patientId]);
  return data;
};

// AFTER
export const useAllergies = (patientId: string) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    getAllergies(patientId).then(setData);
  }, [patientId]);
  return data;
};
```

### Pattern 4: Redux Thunk Update
```typescript
// BEFORE
import { roleService } from '@/services/modules/accessControl/roleService';

export const fetchRoles = createAsyncThunk(
  'roles/fetch',
  async () => {
    return await roleService.getRoles();
  }
);

// AFTER
import { fetchRoles as fetchRolesAction } from '@/lib/actions/roleActions';

export const fetchRoles = createAsyncThunk(
  'roles/fetch',
  async () => {
    return await fetchRolesAction();
  }
);
```

### Pattern 5: Type Import Update
```typescript
// BEFORE
import type { Allergy } from '@/services/modules/healthRecords/types';

// AFTER
import type { Allergy } from '@/types/domain/healthRecords.types';
```

---

## Common Issues and Solutions

### Issue 1: Circular Dependencies
**Symptom:** TypeScript error about circular dependencies
**Solution:** Use type-only imports where possible
```typescript
import type { SomeType } from '@/types/domain/...';
```

### Issue 2: Missing Action Functions
**Symptom:** Import error - function not found
**Solution:** Check if action exists in corresponding actions file, may need to create it
```typescript
// Check: /workspaces/white-cross/frontend/src/lib/actions/[domain]Actions.ts
// If missing, create the action function
```

### Issue 3: Redux State Type Mismatches
**Symptom:** TypeScript error in thunk return types
**Solution:** Ensure action returns match thunk expectations
```typescript
export const fetchData = createAsyncThunk<ReturnType, ParamType>(
  'data/fetch',
  async (params: ParamType) => {
    const result = await fetchDataAction(params);
    return result; // Ensure return type matches ReturnType
  }
);
```

### Issue 4: Test Mocking Changes
**Symptom:** Tests fail after migration
**Solution:** Update test mocks to use new import paths
```typescript
// BEFORE
jest.mock('@/services/modules/healthRecords/allergyService');

// AFTER
jest.mock('@/lib/actions/allergyActions');
```

---

## Progress Tracking

### Sprint 1 - Week 1
- [ ] Day 1: Migrate allergyHooks, conditionHooks, growthHooks
- [ ] Day 2: Migrate healthRecordHooks, screeningHooks, vaccinationHooks, vitalSignsHooks
- [ ] Day 3: Migrate all identity-access thunks
- [ ] Day 4: Testing and validation

### Sprint 1 - Week 2
- [ ] Day 1: Migrate health records components
- [ ] Day 2: Migrate app data files, type definitions
- [ ] Day 3: Final validation and testing
- [ ] Day 4: Code review and merge

### Sprint 2 (If Needed)
- [ ] Type definitions cleanup
- [ ] Utilities migration
- [ ] Final documentation updates

---

## Success Criteria

### Migration Complete When:
1. [ ] All 19 files migrated
2. [ ] All 26 import statements updated
3. [ ] Zero TypeScript compilation errors (migration-related)
4. [ ] All tests passing (100% pass rate)
5. [ ] No runtime errors in development
6. [ ] No runtime errors in staging
7. [ ] Code review approved
8. [ ] Documentation updated
9. [ ] Performance metrics stable or improved
10. [ ] Bundle size impact acceptable (<5% increase)

### Current Status:
- [x] 80.7% files migrated (109/135)
- [ ] 100% migration target (0/135 remaining)
- [x] Zero breaking changes introduced
- [x] Type safety maintained

---

## Contact and Support

**Questions or Issues:**
- Check `/workspaces/white-cross/frontend/FINAL_MIGRATION_VERIFICATION.md` for detailed analysis
- Review migration patterns in this document
- Refer to existing migrated files as examples

**Example Migrated Files:**
- `/workspaces/white-cross/frontend/src/lib/actions/` - All action files
- Recently migrated components (see git history)

---

**Document Version:** 1.0
**Created:** 2025-11-15
**Last Updated:** 2025-11-15
**Status:** Active Migration - 80.7% Complete
