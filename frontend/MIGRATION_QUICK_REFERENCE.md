# Migration Quick Reference Card

---

## Status at a Glance

**97.8% Complete** | **30 Files Remaining** | **5 Hours of Work**

---

## Quick Commands

### Check Remaining Files
```bash
find src/ -type f ! -path "*/services/modules/*" -exec grep -l "from.*services/modules" {} \;
```

### Count Remaining
```bash
find src/ -type f ! -path "*/services/modules/*" -exec grep -l "from.*services/modules" {} \; | wc -l
```

### Verify TypeScript
```bash
npx tsc --noEmit
```

### Build Check
```bash
npm run build
```

---

## Update Patterns

### Health Records
```typescript
// OLD
import { healthRecordsApi } from '@/services/modules/healthRecordsApi';
import type { Allergy } from '@/services/modules/healthRecordsApi';

// NEW
import { healthRecordsApi } from '@/lib/api/healthRecordsApi';
import type { Allergy } from '@/lib/api/healthRecordsApi';
```

### Students
```typescript
// OLD
import { studentsApi } from '@/services/modules/studentsApi';

// NEW
import { studentsApi } from '@/lib/api/studentsApi';
```

### Incidents
```typescript
// OLD
import { incidentsApi } from '@/services/modules/incidentsApi';

// NEW
import { incidentsApi } from '@/lib/api/incidentsApi';
```

### Access Control
```typescript
// OLD
import { accessControlApi } from '@/services/modules/accessControlApi';

// NEW
import { accessControlApi } from '@/lib/api/accessControlApi';
```

### Emergency Contacts
```typescript
// OLD
import { CreateEmergencyContactData } from '@/services/modules/emergencyContactsApi';

// NEW
import { CreateEmergencyContactData } from '@/lib/api/emergencyContactsApi';
```

### Communications
```typescript
// OLD
import type { Message } from '@/services/modules/communicationsApi';

// NEW
import type { Message } from '@/lib/api/communicationsApi';
```

---

## Bulk Update Commands

### Health Records Hooks
```bash
find src/hooks/domains/health-records -name "*.ts" -type f -exec sed -i \
  "s|from '../../../services/modules/healthRecordsApi'|from '@/lib/api/healthRecordsApi'|g" {} \;
```

### Students Hooks
```bash
find src/hooks/domains/students -name "*.ts" -type f -exec sed -i \
  "s|from '@/services/modules/studentsApi'|from '@/lib/api/studentsApi'|g" {} \;
```

### Health Records Components
```bash
find src/components/features/health-records -name "*.tsx" -type f -exec sed -i \
  "s|from '@/services/modules/healthRecordsApi'|from '@/lib/api/healthRecordsApi'|g" {} \;
```

### Incident Thunks
```bash
find src/stores/slices/incidentReports/thunks -name "*.ts" -type f -exec sed -i \
  "s|from '@/services/modules/incidentsApi'|from '@/lib/api/incidentsApi'|g" {} \;
```

### Access Control Thunks
```bash
find src/identity-access/stores/accessControl/thunks -name "*.ts" -type f -exec sed -i \
  "s|from '@/services/modules/accessControlApi'|from '@/lib/api/accessControlApi'|g" {} \;
```

### All at Once
```bash
./scripts/update-service-imports.sh
```

---

## Files Checklist

### Health Records (14 files)
**Hooks (8):**
- [ ] src/hooks/domains/health-records/allergyHooks.ts
- [ ] src/hooks/domains/health-records/conditionHooks.ts
- [ ] src/hooks/domains/health-records/growthHooks.ts
- [ ] src/hooks/domains/health-records/healthRecordHooks.ts
- [ ] src/hooks/domains/health-records/index.ts
- [ ] src/hooks/domains/health-records/screeningHooks.ts
- [ ] src/hooks/domains/health-records/vaccinationHooks.ts
- [ ] src/hooks/domains/health-records/vitalSignsHooks.ts

**Components (3):**
- [ ] src/components/features/health-records/components/tabs/RecordsTab.tsx
- [ ] src/components/features/health-records/components/modals/VitalSignsModal.tsx
- [ ] src/components/features/health-records/components/modals/ScreeningModal.tsx

**Types (3):**
- [ ] src/types/domain/healthRecords.types.ts
- [ ] src/types/legacy/healthRecords.ts
- [ ] src/utils/healthRecords.ts

### Students (7 files)
**Statistics Hooks (5):**
- [ ] src/hooks/domains/students/queries/statistics/useActivityRiskStats.ts
- [ ] src/hooks/domains/students/queries/statistics/useAnalyticsStats.ts
- [ ] src/hooks/domains/students/queries/statistics/useComplianceStats.ts
- [ ] src/hooks/domains/students/queries/statistics/useEnrollmentStats.ts
- [ ] src/hooks/domains/students/queries/statistics/useHealthStats.ts

**Query Hooks (2):**
- [ ] src/hooks/domains/students/queries/useStudentDetails.ts
- [ ] src/hooks/domains/students/queries/useStudentsList.ts

### Stores (8 files)
**Incidents (3):**
- [ ] src/stores/slices/incidentReports/thunks/followUpThunks.ts
- [ ] src/stores/slices/incidentReports/thunks/reportThunks.ts
- [ ] src/stores/slices/incidentReports/thunks/witnessThunks.ts

**Access Control (4):**
- [ ] src/identity-access/stores/accessControl/thunks/incidentsThunks.ts
- [ ] src/identity-access/stores/accessControl/thunks/permissionsThunks.ts
- [ ] src/identity-access/stores/accessControl/thunks/rolesThunks.ts
- [ ] src/identity-access/stores/accessControl/thunks/sessionsThunks.ts

**Contacts (1):**
- [ ] src/stores/slices/contactsSlice.ts

### Other (1 file)
- [ ] src/app/(dashboard)/communications/data.ts

---

## Testing After Updates

### Quick Test
```bash
npx tsc --noEmit && npm run build
```

### Full Test
1. `npx tsc --noEmit` - Type check
2. `npm run build` - Build check
3. `npm run dev` - Development server
4. Test features in browser
5. Check Redux DevTools (for thunks)

---

## By Priority

### 🔴 High (18 files - 4h)
Health records hooks (8), Students hooks (7), Health records components (3)

### 🟡 Medium (8 files - 1h 45m)
Incident thunks (3), Access control thunks (4), Contacts slice (1)

### 🟢 Low (4 files - 20m)
Type files (3), Communications data (1)

---

## Import Path Mapping

| Old Path | New Path | Usage |
|----------|----------|-------|
| `@/services/modules/healthRecordsApi` | `@/lib/api/healthRecordsApi` | API client |
| `@/services/modules/studentsApi` | `@/lib/api/studentsApi` | API client |
| `@/services/modules/incidentsApi` | `@/lib/api/incidentsApi` | API client |
| `@/services/modules/accessControlApi` | `@/lib/api/accessControlApi` | API client |
| `@/services/modules/emergencyContactsApi` | `@/lib/api/emergencyContactsApi` | API client |
| `@/services/modules/communicationsApi` | `@/lib/api/communicationsApi` | API client |

---

## Rollback

### Full Rollback
```bash
git checkout -- src/
```

### Domain-Specific Rollback
```bash
# Health Records
git checkout -- src/hooks/domains/health-records/
git checkout -- src/components/features/health-records/
git checkout -- src/types/domain/healthRecords.types.ts
git checkout -- src/types/legacy/healthRecords.ts
git checkout -- src/utils/healthRecords.ts

# Students
git checkout -- src/hooks/domains/students/

# Stores
git checkout -- src/stores/
git checkout -- src/identity-access/

# Other
git checkout -- src/app/\(dashboard\)/communications/data.ts
```

---

## Success Verification

### Zero Remaining Imports
```bash
find src/ -type f ! -path "*/services/modules/*" -exec grep -l "from.*services/modules" {} \; | wc -l
# Expected: 0
```

### TypeScript Clean
```bash
npx tsc --noEmit 2>&1 | grep -i "services/modules"
# Expected: (empty)
```

### Build Success
```bash
npm run build
# Expected: ✓ Compiled successfully
```

---

## Resources

**Full Documentation:**
- UPDATE_VERIFICATION_REPORT.md - Complete analysis
- MIGRATION_ACTION_PLAN.md - Step-by-step guide
- MIGRATION_SUMMARY.md - Executive summary
- MIGRATION_QUICK_REFERENCE.md - This file

**Scripts:**
- scripts/update-service-imports.sh - Automated updates

---

## Time Estimates

| Task | Time | Files |
|------|------|-------|
| Health Records Hooks | 2h | 8 |
| Students Hooks | 1.5h | 7 |
| Health Records Components | 30m | 3 |
| Health Records Types | 15m | 3 |
| Incident Thunks | 45m | 3 |
| Access Control Thunks | 45m | 4 |
| Contacts Slice | 15m | 1 |
| Communications Data | 5m | 1 |
| **Total** | **5h 25m** | **30** |

---

## Common Issues

### Issue: Import not found
**Solution:** Check if API file exists in `/workspaces/white-cross/frontend/src/lib/api/`

### Issue: Type errors after update
**Solution:** Ensure type imports are also updated, not just value imports

### Issue: Redux thunk not working
**Solution:** Test in Redux DevTools, verify action is dispatched correctly

### Issue: Deprecation warning still showing
**Solution:** Clear browser cache, restart dev server

---

**Last Updated:** 2025-11-15
**Status:** Ready to Execute
**Next Action:** Choose update strategy and begin
