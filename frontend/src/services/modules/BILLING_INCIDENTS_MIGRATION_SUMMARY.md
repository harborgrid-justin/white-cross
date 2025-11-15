# Billing & Incidents Service Module Migration Summary

**Status**: ✅ Complete
**Date**: 2025-11-15
**Task ID**: B7C9D2
**Related**: SVC001 (Comprehensive Service Migration)

## Overview

This document summarizes the deprecation and migration guidance added to billing and incident service modules in `/workspaces/white-cross/frontend/src/services/modules/`. All files have been updated with comprehensive deprecation warnings, migration examples, and references to replacement Server Actions.

## Files Updated

### Billing Service Modules (5 files)

#### 1. `/billingApi/index.ts`
- **Status**: ✅ Enhanced deprecation header
- **Removal Date**: 2026-06-30
- **Migration Target**: `@/lib/actions/billing.*`
- **Key Changes**:
  - Added comprehensive quick migration guide
  - Listed all replacement action files
  - Added benefits of migration section
  - Included concrete before/after examples

#### 2. `/billingApi/invoices.ts` (280 lines)
- **Status**: ✅ Deprecation added
- **Migration Target**: `@/lib/actions/billing.invoices` + `@/lib/actions/billing.cache`
- **Method Mappings**:
  - `getInvoices()` → `getInvoices()` from `billing.cache`
  - `getInvoiceById()` → `getInvoice()` from `billing.cache`
  - `createInvoice()` → `createInvoiceAction()` from `billing.invoices`
  - `updateInvoice()` → `updateInvoiceAction()` from `billing.invoices`
  - `sendInvoice()` → `sendInvoiceAction()` from `billing.invoices`
  - `voidInvoice()` → `voidInvoiceAction()` from `billing.invoices`

#### 3. `/billingApi/payments.ts`
- **Status**: ✅ Deprecation added
- **Migration Target**: `@/lib/actions/billing.payments` + `@/lib/actions/billing.cache`
- **Method Mappings**:
  - `getPayments()` → `getPayments()` from `billing.cache`
  - `recordPayment()` → `recordPaymentAction()` from `billing.payments`
  - `processRefund()` → `processRefundAction()` from `billing.payments`
  - `voidPayment()` → `voidPaymentAction()` from `billing.payments`

#### 4. `/billingApi/analytics.ts`
- **Status**: ✅ Deprecation added
- **Migration Target**: `@/lib/actions/billing.cache` + `@/lib/actions/billing.utils`
- **Method Mappings**:
  - `getBillingAnalytics()` → `getBillingAnalytics()` from `billing.cache`
  - `getRevenueTrends()` → `getRevenueTrends()` from `billing.cache`
  - `getPaymentAnalytics()` → Analytics functions from `billing.cache` or `billing.utils`

#### 5. `/billingApi/settings.ts`
- **Status**: ✅ Deprecation added
- **Migration Target**: `@/lib/actions/billing.cache` + `@/lib/actions/billing.invoices`
- **Method Mappings**:
  - `getBillingSettings()` → `getBillingSettings()` from `billing.cache`
  - `updateBillingSettings()` → Custom action or `billing.invoices`
  - `sendPaymentReminder()` → `sendInvoiceAction()` from `billing.invoices`

### Incident Service Modules (7 files)

#### 1. `/incidentsApi.ts` (Re-export wrapper)
- **Status**: ✅ Enhanced comprehensive deprecation
- **Removal Date**: 2026-06-30
- **Migration Target**: `@/lib/actions/incidents.*`
- **Key Changes**:
  - Added comprehensive migration guide covering all operations
  - Documented CRUD, follow-ups, witnesses patterns
  - Listed all replacement action modules
  - Included benefits and key differences

#### 2. `/incidentReportsApi.ts` (Backward compatibility)
- **Status**: ✅ Strong "DO NOT USE" warning added
- **Removal Date**: 2026-06-30
- **Migration Target**: Direct to `@/lib/actions/incidents.*` (skip incidentsApi)
- **Key Changes**:
  - Added "DOUBLE DEPRECATED" warning
  - Explained legacy path history (/incident-reports/* → /incidents/*)
  - Recommended skipping incidentsApi and going straight to actions
  - Clarified this is only for backward compatibility

#### 3. `/incidentsApi/incidents.ts` (Core CRUD, 381 lines)
- **Status**: ✅ Deprecation added
- **Migration Target**: `@/lib/actions/incidents.crud` + `@/lib/actions/incidents.analytics`
- **Method Mappings**:
  - `getAll()` → `getIncidents()` from `incidents.crud`
  - `getById()` → `getIncident()` from `incidents.crud`
  - `create()` → `createIncident()` from `incidents.crud`
  - `update()` → `updateIncident()` from `incidents.crud`
  - `delete()` → `deleteIncident()` from `incidents.crud`
  - `search()` → Use `getIncidents()` with filter parameters
  - `getStatistics()` → `getIncidentAnalytics()` from `incidents.analytics`
  - `getFollowUpRequired()` → `getIncidentsRequiringFollowUp()` from `incidents.crud`
  - `getStudentRecentIncidents()` → `getStudentRecentIncidents()` from `incidents.crud`

#### 4. `/incidentsApi/followUps.ts`
- **Status**: ✅ Deprecation added
- **Migration Target**: `@/lib/actions/incidents.followup`
- **Method Mappings**:
  - `getFollowUpActions()` → `getFollowUpActions()` from `incidents.followup`
  - `createFollowUpAction()` → `addFollowUpAction()` from `incidents.followup`
  - `updateFollowUpAction()` → `updateFollowUpAction()` from `incidents.followup`
  - `deleteFollowUpAction()` → `deleteFollowUpAction()` from `incidents.followup`
  - Parent notifications → `addFollowUpNotes()` from `incidents.followup`

#### 5. `/incidentsApi/witnesses.ts`
- **Status**: ✅ Deprecation added
- **Migration Target**: `@/lib/actions/incidents.witnesses`
- **Method Mappings**:
  - `getWitnessStatements()` → `getWitnessStatements()` from `incidents.witnesses`
  - `addWitnessStatement()` → `addWitnessStatement()` from `incidents.witnesses`
  - `updateWitnessStatement()` → `updateWitnessStatement()` from `incidents.witnesses`
  - `verifyWitnessStatement()` → `verifyWitnessStatement()` from `incidents.witnesses`
  - `getUnverifiedStatements()` → `getUnverifiedStatements()` from `incidents.witnesses`

#### 6. `/incidentsApi/evidence.ts`
- **Status**: ✅ Deprecation added
- **Migration Target**: `@/lib/actions/incidents.operations` + `@/lib/actions/documents.upload`
- **Method Mappings**:
  - `addEvidence()` → `updateIncident()` from `incidents.crud` or `uploadDocument()` from `documents.upload`
  - `updateInsuranceClaim()` → `updateIncident()` with insurance data
  - `updateComplianceStatus()` → `updateIncident()` with compliance data
  - Evidence attachments → Use document upload actions

#### 7. `/incidentsApi/reports.ts`
- **Status**: ✅ Deprecation added
- **Migration Target**: `@/lib/actions/incidents.analytics` + `@/lib/actions/reports.generation`
- **Method Mappings**:
  - `generateReport()` → `generateReport()` from `reports.generation`
  - `exportToPDF()` → `generateReport()` with format: 'pdf'
  - Analytics queries → `getIncidentAnalytics()` from `incidents.analytics`

## Import Verification

### API Client Imports

All service module files have been verified to use appropriate API client imports:

**Billing Service Modules**:
- ✅ Use `ApiClient` from `../../core/ApiClient`
- ✅ Import types from `../../types`
- ✅ Use billing-specific endpoints from `./endpoints`

**Incident Service Modules**:
- ✅ Use `ApiClient` from `../../core/ApiClient`
- ✅ Import utilities from `../../utils/apiUtils`
- ✅ Import types from local `./types`

**Action Files** (Replacement targets):
- ✅ Use `serverGet`, `serverPost`, `serverPut`, `serverDelete` from `@/lib/api/server`
- ✅ Use `revalidatePath`, `revalidateTag` for cache invalidation
- ✅ Include `'use server'` directive for mutations

## Migration Patterns

### Pattern 1: Queries (Cached Reads)

```typescript
// ❌ OLD: Service Module
import { billingApi } from '@/services/modules/billingApi';
const invoices = await billingApi.invoices.getInvoices(1, 20);

// ✅ NEW: Cached Server Action
import { getInvoices } from '@/lib/actions/billing.cache';
const invoices = await getInvoices({ page: 1, limit: 20 });
```

### Pattern 2: Mutations (Create/Update/Delete)

```typescript
// ❌ OLD: Service Module
import { billingApi } from '@/services/modules/billingApi';
const invoice = await billingApi.invoices.createInvoice(data);

// ✅ NEW: Server Action with Result Pattern
import { createInvoiceAction } from '@/lib/actions/billing.invoices';
const result = await createInvoiceAction(data);
if (result.success) {
  console.log('Created:', result.data);
} else {
  console.error('Error:', result.error);
}
```

### Pattern 3: Nested Operations (Incidents)

```typescript
// ❌ OLD: Service Module with Nested API
import { incidentsApi } from '@/services/modules/incidentsApi';
const followUps = await incidentsApi.followUps.getFollowUpActions(incidentId);
await incidentsApi.witnesses.addWitnessStatement(incidentId, data);

// ✅ NEW: Dedicated Action Modules
import { getFollowUpActions } from '@/lib/actions/incidents.followup';
import { addWitnessStatement } from '@/lib/actions/incidents.witnesses';

const followUps = await getFollowUpActions(incidentId);
const result = await addWitnessStatement(incidentId, data);
```

## Benefits of Migration

### Server Actions Advantages
1. **'use server' Directive**: Explicit server-side execution
2. **Automatic Cache Invalidation**: Built-in `revalidatePath()` and `revalidateTag()`
3. **Type-Safe Error Handling**: Consistent `{ success, data?, error? }` pattern
4. **Better Performance**: Optimized for Next.js App Router
5. **Built-in Audit Logging**: HIPAA-compliant logging (billing actions)
6. **Simpler Imports**: No class instantiation required

### Developer Experience
- Clear separation: Queries vs Mutations
- Consistent patterns across all domains
- Better TypeScript inference
- Reduced boilerplate code
- Easier testing

## Duplicate File Handling

### incidentsApi.ts vs incidentReportsApi.ts

**Resolution**:
- `incidentReportsApi.ts` = **Legacy backward compatibility wrapper** (DOUBLE DEPRECATED)
  - Points to `incidentsApi.ts`
  - Strong "DO NOT USE" warning
  - Historical context: Old API path `/incident-reports/*`

- `incidentsApi.ts` = **Main re-export wrapper** (DEPRECATED)
  - Re-exports from `incidentsApi/` subdirectory modules
  - Comprehensive migration guide
  - Points to `@/lib/actions/incidents.*`

**Recommendation**: Migrate directly to `@/lib/actions/incidents.*`, bypassing both wrappers.

## Timeline

### Deprecation Schedule
- **Now - 2026-06-30**: Service modules remain with deprecation warnings
- **2026-06-30**: Service modules will be removed
- **Action Items**:
  - Update consuming code to use Server Actions
  - Remove service module imports
  - Update tests to use new patterns

### Suggested Migration Order
1. **Phase 1** (Immediate): New code uses Server Actions
2. **Phase 2** (Next sprint): Update high-traffic endpoints
3. **Phase 3** (Q1 2026): Migrate remaining code
4. **Phase 4** (Q2 2026): Remove service modules

## Common Gotchas

### 1. Response Structure Differences
```typescript
// Service modules return data directly
const incidents = await incidentsApi.getAll(); // IncidentReport[]

// Server actions may return wrapped responses
const response = await getIncidents(); // { incidents: [], pagination: {} }
const incidents = response.incidents;
```

### 2. Error Handling
```typescript
// Service modules throw errors
try {
  const invoice = await billingApi.invoices.createInvoice(data);
} catch (error) {
  // Handle error
}

// Server actions return result objects
const result = await createInvoiceAction(data);
if (!result.success) {
  console.error(result.error);
}
```

### 3. Class Instantiation vs Direct Imports
```typescript
// Service modules use classes
const incidentsCore = new IncidentsCore(apiClient);
await incidentsCore.create(data);

// Server actions are direct function imports
import { createIncident } from '@/lib/actions/incidents.crud';
await createIncident(data);
```

## Testing Considerations

### Unit Tests
- Update imports to new action modules
- Mock `serverGet`/`serverPost` instead of API client
- Test result object destructuring

### Integration Tests
- Verify cache invalidation works correctly
- Test revalidation paths
- Ensure audit logging fires (billing)

## Related Documentation

- **Service Module Deprecation**: `/src/services/modules/DEPRECATED.md`
- **Comprehensive Migration Plan**: `/src/lib/actions/.temp/plan-SVC001.md`
- **Architecture Notes**: `/src/lib/actions/.temp/architecture-notes-SVC001.md`
- **Action Files**:
  - Billing: `/src/lib/actions/billing.*`
  - Incidents: `/src/lib/actions/incidents.*`

## Support

For migration assistance:
1. Review migration examples in deprecated service files
2. Check existing action file implementations
3. Reference this summary document
4. Consult SVC001 comprehensive migration plan

---

**Migration Summary Created**: 2025-11-15
**Task**: B7C9D2
**Agent**: TypeScript Architect
**Status**: ✅ Complete - All deprecation warnings and migration guidance added
