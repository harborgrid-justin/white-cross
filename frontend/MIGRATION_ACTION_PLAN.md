# Service Module Migration - Action Plan

**Status:** 97.8% Complete | **Remaining:** 30 files | **Estimated Effort:** 5 hours

---

## Quick Reference

### Files to Update by Category

| Category | Files | Priority | Effort | Status |
|----------|-------|----------|--------|--------|
| Health Records Hooks | 8 | 🔴 HIGH | 2h | ⏳ Pending |
| Students Hooks | 7 | 🔴 HIGH | 1.5h | ⏳ Pending |
| Health Records Components | 3 | 🔴 HIGH | 30m | ⏳ Pending |
| Incident Store Thunks | 3 | 🟡 MEDIUM | 45m | ⏳ Pending |
| Access Control Thunks | 4 | 🟡 MEDIUM | 45m | ⏳ Pending |
| Contacts Slice | 1 | 🟡 MEDIUM | 15m | ⏳ Pending |
| Type Definitions | 3 | 🟢 LOW | 15m | ⏳ Pending |
| Communications Data | 1 | 🟢 LOW | 5m | ⏳ Pending |
| **TOTAL** | **30** | | **5h 25m** | |

---

## Week 1: High Priority (Day 1-3)

### Day 1: Health Records Hooks (2 hours)

**Task:** Update 8 hook files

**Files:**
```
src/hooks/domains/health-records/
├── allergyHooks.ts
├── conditionHooks.ts
├── growthHooks.ts
├── healthRecordHooks.ts
├── index.ts
├── screeningHooks.ts
├── vaccinationHooks.ts
└── vitalSignsHooks.ts
```

**Change Pattern:**
```typescript
// Find:    from '../../../services/modules/healthRecordsApi'
// Replace: from '@/lib/api/healthRecordsApi'
```

**Quick Update Command:**
```bash
cd /workspaces/white-cross/frontend
find src/hooks/domains/health-records -name "*.ts" -type f -exec sed -i \
  "s|from '../../../services/modules/healthRecordsApi'|from '@/lib/api/healthRecordsApi'|g" {} \;
```

**Verification:**
```bash
# Check changes
git diff src/hooks/domains/health-records/

# Type check
npx tsc --noEmit --project tsconfig.json

# Test the hooks
npm run dev
# Navigate to health records pages and verify functionality
```

---

### Day 2: Students Hooks (1.5 hours)

**Task:** Update 7 hook files

**Files:**
```
src/hooks/domains/students/queries/
├── statistics/
│   ├── useActivityRiskStats.ts
│   ├── useAnalyticsStats.ts
│   ├── useComplianceStats.ts
│   ├── useEnrollmentStats.ts
│   └── useHealthStats.ts
├── useStudentDetails.ts
└── useStudentsList.ts
```

**Change Pattern:**
```typescript
// Find:    from '@/services/modules/studentsApi'
// Replace: from '@/lib/api/studentsApi'
```

**Quick Update Command:**
```bash
cd /workspaces/white-cross/frontend
find src/hooks/domains/students -name "*.ts" -type f -exec sed -i \
  "s|from '@/services/modules/studentsApi'|from '@/lib/api/studentsApi'|g" {} \;
```

**Verification:**
```bash
# Check changes
git diff src/hooks/domains/students/

# Type check
npx tsc --noEmit

# Test the hooks
npm run dev
# Navigate to students pages and verify statistics display correctly
```

---

### Day 3: Health Records Components & Types (1 hour)

**Task:** Update 3 components + 3 type files

**Component Files:**
```
src/components/features/health-records/components/
├── tabs/RecordsTab.tsx
└── modals/
    ├── VitalSignsModal.tsx
    └── ScreeningModal.tsx
```

**Type Files:**
```
src/types/domain/healthRecords.types.ts
src/types/legacy/healthRecords.ts
src/utils/healthRecords.ts
```

**Change Pattern:**
```typescript
// Components:
// Find:    from '@/services/modules/healthRecordsApi'
// Replace: from '@/lib/api/healthRecordsApi'

// Types (adjust path):
// Find:    from '../services/modules/healthRecordsApi'
// Replace: from '@/lib/api/healthRecordsApi'
```

**Quick Update Commands:**
```bash
cd /workspaces/white-cross/frontend

# Update components
find src/components/features/health-records -name "*.tsx" -type f -exec sed -i \
  "s|from '@/services/modules/healthRecordsApi'|from '@/lib/api/healthRecordsApi'|g" {} \;

# Update types
sed -i "s|from '../services/modules/healthRecordsApi'|from '@/lib/api/healthRecordsApi'|g" \
  src/types/domain/healthRecords.types.ts

sed -i "s|from '../services/modules/healthRecordsApi'|from '@/lib/api/healthRecordsApi'|g" \
  src/types/legacy/healthRecords.ts

sed -i "s|from '@/services/modules/healthRecordsApi'|from '@/lib/api/healthRecordsApi'|g" \
  src/utils/healthRecords.ts
```

**Verification:**
```bash
# Check changes
git diff src/components/features/health-records/
git diff src/types/
git diff src/utils/healthRecords.ts

# Type check
npx tsc --noEmit

# Test components
npm run dev
# Test: Open health records modals, create/edit records
```

---

## Week 2: Medium Priority (Day 4-5)

### Day 4: Store Updates (1 hour 45 minutes)

**Task:** Update incident thunks, access control thunks, and contacts slice

**Incident Thunks (3 files):**
```
src/stores/slices/incidentReports/thunks/
├── followUpThunks.ts
├── reportThunks.ts
└── witnessThunks.ts
```

**Access Control Thunks (4 files):**
```
src/identity-access/stores/accessControl/thunks/
├── incidentsThunks.ts
├── permissionsThunks.ts
├── rolesThunks.ts
└── sessionsThunks.ts
```

**Contacts Slice (1 file):**
```
src/stores/slices/contactsSlice.ts
```

**Quick Update Commands:**
```bash
cd /workspaces/white-cross/frontend

# Update incident thunks
find src/stores/slices/incidentReports/thunks -name "*.ts" -type f -exec sed -i \
  "s|from '@/services/modules/incidentsApi'|from '@/lib/api/incidentsApi'|g" {} \;

# Update access control thunks
find src/identity-access/stores/accessControl/thunks -name "*.ts" -type f -exec sed -i \
  "s|from '@/services/modules/accessControlApi'|from '@/lib/api/accessControlApi'|g" {} \;

# Update contacts slice
sed -i "s|from '@/services/modules/emergencyContactsApi'|from '@/lib/api/emergencyContactsApi'|g" \
  src/stores/slices/contactsSlice.ts
```

**Verification:**
```bash
# Check changes
git diff src/stores/
git diff src/identity-access/

# Type check
npx tsc --noEmit

# Test Redux thunks
npm run dev
# Test: Create/edit incidents, manage contacts, check access control
# Open Redux DevTools and verify thunk actions dispatch correctly
```

---

### Day 5: Final Cleanup (20 minutes)

**Task:** Update communications data file

**File:**
```
src/app/(dashboard)/communications/data.ts
```

**Quick Update Command:**
```bash
cd /workspaces/white-cross/frontend

sed -i "s|from '@/services/modules/communicationsApi'|from '@/lib/api/communicationsApi'|g" \
  src/app/\(dashboard\)/communications/data.ts
```

**Final Verification:**
```bash
# Check all changes
git status
git diff

# Type check
npx tsc --noEmit

# Build check
npm run build

# Verify no remaining imports
find src/ -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/services/modules/*" \
  -exec grep -l "from.*services/modules" {} \; | wc -l
# Expected output: 0

# Test application
npm run dev
# Full smoke test of all updated features
```

---

## Automated Update Script

Create and run this script to update all files at once:

**File:** `scripts/update-service-imports.sh`

```bash
#!/bin/bash

echo "🚀 Starting service module import migration..."

cd /workspaces/white-cross/frontend

# Health Records Hooks
echo "📝 Updating health records hooks..."
find src/hooks/domains/health-records -name "*.ts" -type f -exec sed -i \
  "s|from '../../../services/modules/healthRecordsApi'|from '@/lib/api/healthRecordsApi'|g" {} \;

# Students Hooks
echo "📝 Updating students hooks..."
find src/hooks/domains/students -name "*.ts" -type f -exec sed -i \
  "s|from '@/services/modules/studentsApi'|from '@/lib/api/studentsApi'|g" {} \;

# Health Records Components
echo "📝 Updating health records components..."
find src/components/features/health-records -name "*.tsx" -type f -exec sed -i \
  "s|from '@/services/modules/healthRecordsApi'|from '@/lib/api/healthRecordsApi'|g" {} \;

# Type Files
echo "📝 Updating type files..."
sed -i "s|from '../services/modules/healthRecordsApi'|from '@/lib/api/healthRecordsApi'|g" \
  src/types/domain/healthRecords.types.ts

sed -i "s|from '../services/modules/healthRecordsApi'|from '@/lib/api/healthRecordsApi'|g" \
  src/types/legacy/healthRecords.ts

sed -i "s|from '@/services/modules/healthRecordsApi'|from '@/lib/api/healthRecordsApi'|g" \
  src/utils/healthRecords.ts

# Incident Thunks
echo "📝 Updating incident thunks..."
find src/stores/slices/incidentReports/thunks -name "*.ts" -type f -exec sed -i \
  "s|from '@/services/modules/incidentsApi'|from '@/lib/api/incidentsApi'|g" {} \;

# Access Control Thunks
echo "📝 Updating access control thunks..."
find src/identity-access/stores/accessControl/thunks -name "*.ts" -type f -exec sed -i \
  "s|from '@/services/modules/accessControlApi'|from '@/lib/api/accessControlApi'|g" {} \;

# Contacts Slice
echo "📝 Updating contacts slice..."
sed -i "s|from '@/services/modules/emergencyContactsApi'|from '@/lib/api/emergencyContactsApi'|g" \
  src/stores/slices/contactsSlice.ts

# Communications Data
echo "📝 Updating communications data..."
sed -i "s|from '@/services/modules/communicationsApi'|from '@/lib/api/communicationsApi'|g" \
  src/app/\(dashboard\)/communications/data.ts

echo "✅ Migration complete!"
echo ""
echo "🔍 Running verification..."

# Count remaining imports
REMAINING=$(find src/ -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/services/modules/*" \
  -exec grep -l "from.*services/modules" {} \; | wc -l)

echo "📊 Remaining imports: $REMAINING"

if [ $REMAINING -eq 0 ]; then
  echo "✅ All imports successfully updated!"
else
  echo "⚠️  Some imports still remain. Please check:"
  find src/ -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/services/modules/*" \
    -exec grep -l "from.*services/modules" {} \;
fi

echo ""
echo "🧪 Running TypeScript check..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
  echo "✅ TypeScript check passed!"
else
  echo "⚠️  TypeScript errors found. Please review."
fi

echo ""
echo "📝 Summary of changes:"
git status --short | grep -E "^\s*M" | wc -l | xargs -I {} echo "Modified files: {}"
git diff --stat
```

**Usage:**
```bash
chmod +x scripts/update-service-imports.sh
./scripts/update-service-imports.sh
```

---

## Manual Update Checklist

Use this checklist if updating manually:

### Health Records Domain
- [ ] src/hooks/domains/health-records/allergyHooks.ts
- [ ] src/hooks/domains/health-records/conditionHooks.ts
- [ ] src/hooks/domains/health-records/growthHooks.ts
- [ ] src/hooks/domains/health-records/healthRecordHooks.ts
- [ ] src/hooks/domains/health-records/index.ts
- [ ] src/hooks/domains/health-records/screeningHooks.ts
- [ ] src/hooks/domains/health-records/vaccinationHooks.ts
- [ ] src/hooks/domains/health-records/vitalSignsHooks.ts
- [ ] src/components/features/health-records/components/tabs/RecordsTab.tsx
- [ ] src/components/features/health-records/components/modals/VitalSignsModal.tsx
- [ ] src/components/features/health-records/components/modals/ScreeningModal.tsx
- [ ] src/types/domain/healthRecords.types.ts
- [ ] src/types/legacy/healthRecords.ts
- [ ] src/utils/healthRecords.ts

### Students Domain
- [ ] src/hooks/domains/students/queries/statistics/useActivityRiskStats.ts
- [ ] src/hooks/domains/students/queries/statistics/useAnalyticsStats.ts
- [ ] src/hooks/domains/students/queries/statistics/useComplianceStats.ts
- [ ] src/hooks/domains/students/queries/statistics/useEnrollmentStats.ts
- [ ] src/hooks/domains/students/queries/statistics/useHealthStats.ts
- [ ] src/hooks/domains/students/queries/useStudentDetails.ts
- [ ] src/hooks/domains/students/queries/useStudentsList.ts

### Stores Domain
- [ ] src/stores/slices/incidentReports/thunks/followUpThunks.ts
- [ ] src/stores/slices/incidentReports/thunks/reportThunks.ts
- [ ] src/stores/slices/incidentReports/thunks/witnessThunks.ts
- [ ] src/stores/slices/contactsSlice.ts

### Identity & Access Domain
- [ ] src/identity-access/stores/accessControl/thunks/incidentsThunks.ts
- [ ] src/identity-access/stores/accessControl/thunks/permissionsThunks.ts
- [ ] src/identity-access/stores/accessControl/thunks/rolesThunks.ts
- [ ] src/identity-access/stores/accessControl/thunks/sessionsThunks.ts

### Communications Domain
- [ ] src/app/(dashboard)/communications/data.ts

### Final Checks
- [ ] Run `npx tsc --noEmit` - no import errors
- [ ] Run `npm run build` - build succeeds
- [ ] Test health records functionality
- [ ] Test students statistics
- [ ] Test incident reporting
- [ ] Test access control
- [ ] Test emergency contacts
- [ ] Test communications
- [ ] Verify no imports remain: `find src/ -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/services/modules/*" -exec grep -l "from.*services/modules" {} \;`

---

## Testing Protocol

After each batch of updates:

### 1. Type Safety Check
```bash
npx tsc --noEmit
```
**Expected:** No new type errors

### 2. Build Verification
```bash
npm run build
```
**Expected:** Build succeeds without errors

### 3. Development Server
```bash
npm run dev
```
**Expected:** Server starts without errors, no deprecation warnings in console

### 4. Feature Testing

**Health Records:**
- [ ] View student health records
- [ ] Create new allergy
- [ ] Add vital signs
- [ ] Create screening record
- [ ] Add vaccination
- [ ] Add chronic condition
- [ ] View growth measurements

**Students:**
- [ ] View student list
- [ ] View student details
- [ ] Check enrollment statistics
- [ ] Check health statistics
- [ ] Check compliance stats
- [ ] Check analytics stats
- [ ] Check activity risk stats

**Incidents:**
- [ ] Create incident report
- [ ] Add follow-up
- [ ] Add witness statement
- [ ] Update incident status

**Access Control:**
- [ ] Manage user roles
- [ ] Manage permissions
- [ ] View active sessions
- [ ] Check access logs

**Emergency Contacts:**
- [ ] Add emergency contact
- [ ] Update contact info
- [ ] Remove contact

**Communications:**
- [ ] View messages
- [ ] Send message
- [ ] Check message delivery

### 5. Redux DevTools Check
- [ ] Open Redux DevTools
- [ ] Trigger actions from updated thunks
- [ ] Verify actions dispatch correctly
- [ ] Check state updates properly

---

## Rollback Plan

If issues are encountered:

```bash
# Revert all changes
git checkout -- src/

# Or revert specific domains
git checkout -- src/hooks/domains/health-records/
git checkout -- src/hooks/domains/students/
git checkout -- src/stores/
git checkout -- src/identity-access/
git checkout -- src/components/features/health-records/
git checkout -- src/types/
git checkout -- src/utils/healthRecords.ts
git checkout -- src/app/\(dashboard\)/communications/data.ts
```

---

## Success Criteria

Migration is complete when:

1. ✅ All 30 files updated
2. ✅ TypeScript compiles without import errors
3. ✅ Build succeeds
4. ✅ All features tested and working
5. ✅ No deprecation warnings in console
6. ✅ Zero files outside services/modules importing from services/modules

**Verification Command:**
```bash
find src/ -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/services/modules/*" \
  -exec grep -l "from.*services/modules" {} \; | wc -l
```
**Expected Result:** 0

---

## Post-Migration Tasks

Once migration is 100% complete:

### Week 3: Documentation
- [ ] Update ARCHITECTURE.md
- [ ] Update API documentation
- [ ] Update developer onboarding guide
- [ ] Create migration guide for team

### Week 4: Cleanup (Future)
- [ ] Remove re-export facades (50+ files)
- [ ] Archive services/modules directory
- [ ] Update import paths in documentation
- [ ] Final verification and testing

---

**Created:** 2025-11-15
**Last Updated:** 2025-11-15
**Status:** Ready to Execute
