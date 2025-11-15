# Deprecated Services - Migration Reference

## Overview

This document lists all deprecated service modules in the `services/modules` directory and their modern replacements in `lib/actions`. All services listed here will be removed by **June 30, 2026**.

## Migration Deadline

**Final Deadline: June 30, 2026**

All code must be migrated to the new `lib/actions` architecture by this date. The legacy services directory will be removed entirely.

## Deprecated Services

### ✅ Fully Migrated (Action Available)

These services have complete replacements in `lib/actions`:

| Service File | Replacement | Migration Path | Breaking Changes |
|-------------|-------------|----------------|------------------|
| `auditApi.ts` | `admin.audit-logs.ts` | [View](#auditapi) | None |
| `complianceApi.ts` | `compliance.actions.ts` | [View](#complianceapi) | Minor API changes |
| `dashboardApi.ts` | `dashboard.actions.ts` | [View](#dashboardapi) | Return format standardized |
| `incidentsApi.ts` | `incidents.actions.ts` | [View](#incidentsapi) | None |
| `integrationApi.ts` | `admin.integrations.ts` | [View](#integrationapi) | None |
| `inventoryApi.ts` | `inventory.actions.ts` | [View](#inventoryapi) | None |
| `medicationsApi.ts` | `medications.actions.ts` | [View](#medicationsapi) | Validation changes |
| `reportsApi.ts` | `reports.actions.ts` + `analytics.actions.ts` | [View](#reportsapi) | Split into two modules |
| `studentsApi.ts` | `students.actions.ts` | [View](#studentsapi) | None |
| `systemApi.ts` | `admin.monitoring.ts` + `admin.settings.ts` | [View](#systemapi) | Split into two modules |
| `usersApi.ts` | `admin.users.ts` | [View](#usersapi) | Role constants changed |
| `vendorApi.ts` | `vendors.actions.ts` | [View](#vendorapi) | None |

### ⚠️ Partially Migrated (Use Service for Now)

These services don't have complete action replacements yet:

| Service File | Status | Alternative | Timeline |
|-------------|--------|-------------|----------|
| `contactsApi.ts` | No action available | Continue using service | Q1 2026 |
| `authApi.ts` | Use NextAuth instead | `next-auth` library | Migrated |

### 📁 Module Directories

These directories contain refactored implementations but are still part of the legacy services:

- `audit/` - Re-exported by `auditApi.ts`
- `compliance/` - Sub-modules for compliance operations
- `incidentsApi/` - Modular incident management
- `integrationApi/` - Integration operations split into files
- `inventoryApi/` - Inventory management modules
- `medications/` - Medication management modules
- `studentsApi/` - Student operations modules
- `systemApi/` - System management modules

---

## Detailed Migration Guides

### auditApi

**Deprecated File:** `services/modules/auditApi.ts`

**Replacement:** `lib/actions/admin.audit-logs.ts`

**Status:** ✅ Fully available

**Breaking Changes:** None

#### Migration Example

**Before:**
```typescript
import { auditApi } from '@/services/modules/auditApi';

const logs = await auditApi.getPHIAccessLogs({
  studentId: 'student-123',
  startDate: '2025-01-01',
  endDate: '2025-01-31'
});
```

**After:**
```typescript
import { getPHIAccessLogs } from '@/lib/actions/admin.audit-logs';

const logs = await getPHIAccessLogs({
  studentId: 'student-123',
  startDate: '2025-01-01',
  endDate: '2025-01-31'
});
```

---

### authApi

**Deprecated File:** `services/modules/authApi.ts`

**Replacement:** NextAuth (`next-auth`)

**Status:** ✅ Use NextAuth

**Breaking Changes:** Complete architecture change

#### Migration Example

**Before:**
```typescript
import { authApi } from '@/services/modules/authApi';

const response = await authApi.login({ email, password });
if (response.success) {
  // Redirect to dashboard
}
```

**After:**
```typescript
import { signIn } from 'next-auth/react';

const result = await signIn('credentials', {
  email,
  password,
  redirect: false
});

if (result?.ok) {
  // Redirect to dashboard
}
```

---

### complianceApi

**Deprecated File:** `services/modules/complianceApi.ts`

**Replacement:** `lib/actions/compliance.actions.ts`

**Status:** ✅ Fully available

**Breaking Changes:**
- Return format now includes `success` boolean
- Validation errors return different structure

#### Migration Example

**Before:**
```typescript
import { complianceApi } from '@/services/modules/complianceApi';

const reports = await complianceApi.getReports({
  status: 'SUBMITTED',
  page: 1
});
```

**After:**
```typescript
import { getComplianceReports } from '@/lib/actions/compliance.actions';

const result = await getComplianceReports({
  status: 'SUBMITTED',
  page: 1
});

if (result.success) {
  const reports = result.data;
}
```

---

### contactsApi

**Deprecated File:** `services/modules/contactsApi.ts`

**Replacement:** Not yet available

**Status:** ⚠️ Continue using service

**Timeline:** Server actions planned for Q1 2026

**Current Usage:**
```typescript
import { contactsApi } from '@/services/modules/contactsApi';

const contacts = await contactsApi.getAll({
  studentId: 'student-123'
});
```

**Note:** This service will remain available until the action replacement is ready.

---

### dashboardApi

**Deprecated File:** `services/modules/dashboardApi.ts`

**Replacement:** `lib/actions/dashboard.actions.ts`

**Status:** ✅ Fully available

**Breaking Changes:**
- `getDashboardStats()` return format standardized
- Chart data format updated for consistency

#### Migration Example

**Before:**
```typescript
import { dashboardApi } from '@/services/modules/dashboardApi';

const stats = await dashboardApi.getDashboardStats();
const activities = await dashboardApi.getRecentActivities({ limit: 5 });
```

**After:**
```typescript
import { getDashboardStats, getRecentActivities } from '@/lib/actions/dashboard.actions';

const stats = await getDashboardStats();
const activities = await getRecentActivities({ limit: 5 });
```

---

### incidentsApi

**Deprecated File:** `services/modules/incidentsApi.ts`

**Replacement:** `lib/actions/incidents.actions.ts`

**Status:** ✅ Fully available

**Breaking Changes:** None

#### Migration Example

**Before:**
```typescript
import { incidentsApi } from '@/services/modules/incidentsApi';

const incident = await incidentsApi.create({
  studentId: 'student-123',
  type: 'INJURY',
  description: 'Student fell on playground',
  severity: 'MODERATE'
});
```

**After:**
```typescript
import { createIncident } from '@/lib/actions/incidents.actions';

const result = await createIncident({
  studentId: 'student-123',
  type: 'INJURY',
  description: 'Student fell on playground',
  severity: 'MODERATE'
});

if (result.success) {
  const incident = result.data;
}
```

---

### integrationApi

**Deprecated File:** `services/modules/integrationApi.ts`

**Replacement:** `lib/actions/admin.integrations.ts`

**Status:** ✅ Fully available

**Breaking Changes:** None

#### Migration Example

**Before:**
```typescript
import { integrationApi } from '@/services/modules/integrationApi';

const integrations = await integrationApi.getAll('SIS');
await integrationApi.sync('integration-123');
```

**After:**
```typescript
import { getAllIntegrations, syncIntegration } from '@/lib/actions/admin.integrations';

const integrations = await getAllIntegrations('SIS');
await syncIntegration('integration-123');
```

---

### inventoryApi

**Deprecated File:** `services/modules/inventoryApi.ts`

**Replacement:** `lib/actions/inventory.actions.ts`

**Status:** ✅ Fully available

**Breaking Changes:** None

#### Migration Example

**Before:**
```typescript
import { inventoryApi } from '@/services/modules/inventoryApi';

const items = await inventoryApi.getAll({
  category: 'MEDICAL_SUPPLIES',
  lowStock: true
});
```

**After:**
```typescript
import { getInventoryItems } from '@/lib/actions/inventory.actions';

const items = await getInventoryItems({
  category: 'MEDICAL_SUPPLIES',
  lowStock: true
});
```

---

### medicationsApi

**Deprecated File:** `services/modules/medicationsApi.ts`

**Replacement:** `lib/actions/medications.actions.ts`

**Status:** ✅ Fully available

**Breaking Changes:**
- Validation schemas updated for better type safety
- `logAdministration` renamed to `administerMedication`
- Five Rights validation now enforced server-side

#### Migration Example

**Before:**
```typescript
import { medicationsApi } from '@/services/modules/medicationsApi';

await medicationsApi.logAdministration({
  studentMedicationId: 'med-123',
  administeredBy: 'nurse-456',
  administeredAt: new Date().toISOString()
});
```

**After:**
```typescript
import { administerMedication } from '@/lib/actions/medications.actions';

const result = await administerMedication({
  studentMedicationId: 'med-123',
  // administeredBy and administeredAt are automatically set from session
  notes: 'Student took medication without issues'
});
```

---

### reportsApi

**Deprecated File:** `services/modules/reportsApi.ts`

**Replacement:** `lib/actions/reports.actions.ts` + `lib/actions/analytics.actions.ts`

**Status:** ✅ Fully available (split into two modules)

**Breaking Changes:**
- Analytics functions moved to separate `analytics.actions.ts`
- Report generation now uses background jobs for large reports

#### Migration Example

**Before:**
```typescript
import { reportsApi } from '@/services/modules/reportsApi';

const healthTrends = await reportsApi.getHealthTrends({
  startDate: '2025-01-01',
  endDate: '2025-01-31'
});

const dashboardMetrics = await reportsApi.getDashboard();
```

**After:**
```typescript
import { getHealthTrends } from '@/lib/actions/reports.actions';
import { getDashboardMetrics } from '@/lib/actions/analytics.actions';

const healthTrends = await getHealthTrends({
  startDate: '2025-01-01',
  endDate: '2025-01-31'
});

const dashboardMetrics = await getDashboardMetrics();
```

---

### studentsApi

**Deprecated File:** `services/modules/studentsApi.ts`

**Replacement:** `lib/actions/students.actions.ts`

**Status:** ✅ Fully available

**Breaking Changes:** None

#### Migration Example

**Before:**
```typescript
import { studentsApi } from '@/services/modules/studentsApi';

const students = await studentsApi.getAll({
  grade: '9',
  activeOnly: true,
  page: 1,
  limit: 20
});

const student = await studentsApi.getById('student-123');
```

**After:**
```typescript
import { getStudents, getStudentById } from '@/lib/actions/students.actions';

const students = await getStudents({
  grade: '9',
  activeOnly: true,
  page: 1,
  limit: 20
});

const result = await getStudentById('student-123');
if (result.success) {
  const student = result.data;
}
```

---

### systemApi

**Deprecated File:** `services/modules/systemApi.ts`

**Replacement:** `lib/actions/admin.monitoring.ts` + `lib/actions/admin.settings.ts`

**Status:** ✅ Fully available (split into two modules)

**Breaking Changes:**
- Monitoring functions moved to `admin.monitoring.ts`
- Settings functions moved to `admin.settings.ts`

#### Migration Example

**Before:**
```typescript
import { systemApi } from '@/services/modules/systemApi';

const health = await systemApi.getHealthStatus();
const settings = await systemApi.getSettings();
```

**After:**
```typescript
import { getSystemHealth } from '@/lib/actions/admin.monitoring';
import { getSystemSettings } from '@/lib/actions/admin.settings';

const health = await getSystemHealth();
const settings = await getSystemSettings();
```

---

### usersApi

**Deprecated File:** `services/modules/usersApi.ts`

**Replacement:** `lib/actions/admin.users.ts`

**Status:** ✅ Fully available

**Breaking Changes:**
- Role constants now use enum instead of strings
- Password management functions require additional security checks

#### Migration Example

**Before:**
```typescript
import { usersApi } from '@/services/modules/usersApi';

const users = await usersApi.getAll({
  role: 'NURSE',
  isActive: true
});

await usersApi.create({
  email: 'nurse@school.edu',
  password: 'SecurePass123!',
  firstName: 'Jane',
  lastName: 'Doe',
  role: 'NURSE'
});
```

**After:**
```typescript
import { getUsers, createUser } from '@/lib/actions/admin.users';
import { UserRole } from '@/lib/types';

const users = await getUsers({
  role: UserRole.NURSE,
  isActive: true
});

const result = await createUser({
  email: 'nurse@school.edu',
  password: 'SecurePass123!',
  firstName: 'Jane',
  lastName: 'Doe',
  role: UserRole.NURSE
});
```

---

### vendorApi

**Deprecated File:** `services/modules/vendorApi.ts`

**Replacement:** `lib/actions/vendors.actions.ts`

**Status:** ✅ Fully available

**Breaking Changes:** None

#### Migration Example

**Before:**
```typescript
import { vendorApi } from '@/services/modules/vendorApi';

const vendors = await vendorApi.getVendors({
  activeOnly: true,
  minRating: 4
});
```

**After:**
```typescript
import { getVendors } from '@/lib/actions/vendors.actions';

const vendors = await getVendors({
  activeOnly: true,
  minRating: 4
});
```

---

## Deprecation Warnings

Starting **December 31, 2025**, the following warnings will be added to all service files:

```typescript
/**
 * @deprecated This service is deprecated and will be removed on 2026-06-30.
 * Please migrate to @/lib/actions instead.
 * See: /src/services/modules/DEPRECATED.md for migration guide
 */
```

---

## Testing During Migration

### Running Both Systems

During the migration period, you can run both the old services and new actions side-by-side:

```typescript
import { studentsApi } from '@/services/modules/studentsApi'; // Legacy
import { getStudents } from '@/lib/actions/students.actions'; // New

// Compare results during testing
const legacyResult = await studentsApi.getAll();
const newResult = await getStudents();

console.assert(
  JSON.stringify(legacyResult) === JSON.stringify(newResult),
  'Results should match'
);
```

### Feature Flags

Use feature flags to gradually roll out the new actions:

```typescript
import { useFeatureFlag } from '@/lib/feature-flags';
import { studentsApi } from '@/services/modules/studentsApi';
import { getStudents } from '@/lib/actions/students.actions';

function useStudents() {
  const useServerActions = useFeatureFlag('server-actions-students');

  if (useServerActions) {
    return getStudents();
  } else {
    return studentsApi.getAll();
  }
}
```

---

## Support and Questions

If you have questions about migrating a specific service:

1. Check the [README.md](./README.md) migration guide
2. Review the examples above for your specific service
3. Open a GitHub issue with the `migration` label
4. Contact the development team

---

## Checklist for Service Removal

Before removing a service file on June 30, 2026:

- [ ] All usages have been migrated to actions
- [ ] Tests updated to use new actions
- [ ] Documentation updated
- [ ] No grep matches for the service import
- [ ] CI/CD pipeline passes
- [ ] Production deployment verified

---

**Last Updated:** 2025-11-15

**Version:** 1.0.0

**Next Review:** 2025-12-31 (Add deprecation warnings)
