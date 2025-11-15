# Students & Inventory API Migration Summary

**Document Version:** 1.0.0
**Last Updated:** 2025-11-15
**Deprecation Notice:** v1.5.0
**Removal Target:** v2.0.0 (June 30, 2026)

---

## Executive Summary

This document provides a comprehensive migration guide for transitioning from the legacy service-based API pattern to the new Next.js 14+ server actions pattern for **Students** and **Inventory** modules.

### What Changed

| Aspect | Legacy (services/modules) | New (lib/actions) |
|--------|---------------------------|-------------------|
| **Architecture** | Client-side API service classes | Server-side action functions |
| **Caching** | Manual cache management | Automatic Next.js cache |
| **Error Handling** | Exceptions (try/catch) | Result objects (success/error) |
| **Form Integration** | Manual event handlers | useActionState hook |
| **Type Safety** | Class methods with types | Typed server actions |
| **HIPAA Logging** | Manual audit calls | Automatic audit logging |

### Key Benefits

- ✅ Better performance with built-in caching
- ✅ Improved type safety and developer experience
- ✅ Automatic cache invalidation
- ✅ Simplified form handling with React 19 patterns
- ✅ Server-side execution reduces client bundle size
- ✅ Enhanced security with server-only operations

---

## Part 1: Students API Migration

### Files Updated

| File | Status | Description |
|------|--------|-------------|
| `/services/modules/studentsApi.ts` | ⚠️ **DEPRECATED** | Main entry point with migration guide |
| `/services/modules/studentsApi/` | ⚠️ **DEPRECATED** | Subdirectory with modular implementation |

### Replacement Locations

| Legacy Path | New Path | Purpose |
|-------------|----------|---------|
| `studentsApi.ts` | `@/lib/actions/students.actions.ts` | Main exports |
| N/A | `@/lib/actions/students.crud.ts` | Create, Read, Update, Delete |
| N/A | `@/lib/actions/students.cache.ts` | Cached read operations |
| N/A | `@/lib/actions/students.bulk.ts` | Bulk & transfer operations |
| N/A | `@/lib/actions/students.status.ts` | Status management |
| N/A | `@/lib/actions/students.forms.ts` | Form-specific actions |
| N/A | `@/lib/actions/students.utils.ts` | Utility functions |
| N/A | `@/lib/actions/students.types.ts` | TypeScript types |

---

## Students CRUD Operations

### Create Student

#### Before (Legacy)
```typescript
import { studentsApi } from '@/services/modules/studentsApi';

try {
  const student = await studentsApi.create({
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '2010-05-15',
    grade: '5',
    gender: 'MALE',
    medicalRecordNumber: 'MRN-12345'
  });
  console.log('Created:', student);
} catch (error) {
  console.error('Failed:', error);
}
```

#### After (New Pattern)
```typescript
import { createStudent } from '@/lib/actions/students.crud';

const result = await createStudent({
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '2010-05-15',
  grade: '5',
  gender: 'MALE',
  medicalRecordNumber: 'MRN-12345'
});

if (result.success) {
  console.log('Created:', result.data);
} else {
  console.error('Failed:', result.error);
}
```

### Read Students (List with Filters)

#### Before (Legacy)
```typescript
import { studentsApi } from '@/services/modules/studentsApi';

const response = await studentsApi.getAll({
  grade: '5',
  isActive: true,
  page: 1,
  limit: 20
});

const students = response.data;
const total = response.pagination.total;
```

#### After (New Pattern)
```typescript
import { getStudents, getPaginatedStudents } from '@/lib/actions/students.cache';

// Simple list
const result = await getStudents({
  grade: '5',
  isActive: true
});

if (result.success) {
  const students = result.data;
}

// Paginated
const paginatedResult = await getPaginatedStudents({
  page: 1,
  limit: 20,
  filters: { grade: '5', isActive: true }
});
```

### Read Single Student

#### Before (Legacy)
```typescript
const student = await studentsApi.getById('student-id');
```

#### After (New Pattern)
```typescript
import { getStudent } from '@/lib/actions/students.cache';

const result = await getStudent('student-id');
if (result.success) {
  const student = result.data;
}
```

### Update Student

#### Before (Legacy)
```typescript
const updated = await studentsApi.update('student-id', {
  grade: '6',
  nurseId: 'new-nurse-id'
});
```

#### After (New Pattern)
```typescript
import { updateStudent } from '@/lib/actions/students.crud';

const result = await updateStudent('student-id', {
  grade: '6',
  nurseId: 'new-nurse-id'
});

if (result.success) {
  const updated = result.data;
}
```

### Delete Student (Soft Delete)

#### Before (Legacy)
```typescript
const result = await studentsApi.deactivate('student-id');
console.log(result.message);
```

#### After (New Pattern)
```typescript
import { deleteStudent } from '@/lib/actions/students.crud';
// OR for explicit soft delete:
import { deactivateStudent } from '@/lib/actions/students.status';

const result = await deleteStudent('student-id');
if (result.success) {
  console.log(result.message);
}
```

---

## Students Bulk Operations

### Transfer Student to Nurse

#### Before (Legacy)
```typescript
const transferred = await studentsApi.transfer('student-id', {
  nurseId: 'nurse-id',
  reason: 'Workload redistribution',
  effectiveDate: '2025-01-15'
});
```

#### After (New Pattern)
```typescript
import { transferStudent } from '@/lib/actions/students.bulk';

const result = await transferStudent('student-id', {
  nurseId: 'nurse-id',
  reason: 'Workload redistribution',
  effectiveDate: '2025-01-15'
});

if (result.success) {
  const transferred = result.data;
}
```

### Bulk Update Students

#### Before (Legacy)
```typescript
const bulkResult = await studentsApi.bulkUpdate({
  studentIds: ['id1', 'id2', 'id3'],
  updates: { grade: '6', nurseId: 'new-nurse-id' }
});

console.log(`Updated ${bulkResult.updatedCount} students`);
```

#### After (New Pattern)
```typescript
import { bulkUpdateStudents } from '@/lib/actions/students.bulk';

const result = await bulkUpdateStudents({
  studentIds: ['id1', 'id2', 'id3'],
  updateData: { grade: '6', nurseId: 'new-nurse-id' }
});

if (result.success) {
  console.log(`Updated ${result.data.length} students`);
}
```

---

## Students Form Integration

### React Component with Form Action

#### Before (Legacy)
```typescript
'use client';

import { studentsApi } from '@/services/modules/studentsApi';
import { useState } from 'react';

export function StudentForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      await studentsApi.create(data);
      alert('Student created!');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Student'}
      </button>
    </form>
  );
}
```

#### After (New Pattern - Option 1: useActionState)
```typescript
'use client';

import { useActionState } from 'react';
import { createStudentFromForm } from '@/lib/actions/students.forms';

export function StudentForm() {
  const [state, formAction, isPending] = useActionState(
    createStudentFromForm,
    { success: false }
  );

  return (
    <form action={formAction}>
      {/* form fields */}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Student'}
      </button>
      {state.error && (
        <div className="error">{state.error}</div>
      )}
      {state.success && (
        <div className="success">Student created!</div>
      )}
    </form>
  );
}
```

#### After (New Pattern - Option 2: Manual Control)
```typescript
'use client';

import { useState } from 'react';
import { createStudent } from '@/lib/actions/students.crud';

export function StudentForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const result = await createStudent({
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      dateOfBirth: formData.get('dateOfBirth') as string,
      grade: formData.get('grade') as string,
      gender: formData.get('gender') as 'MALE' | 'FEMALE' | 'OTHER'
    });

    setPending(false);

    if (result.success) {
      alert('Student created!');
    } else {
      setError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={pending}>
        {pending ? 'Creating...' : 'Create Student'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
```

---

## Part 2: Inventory API Migration

### Files Updated

| File | Status | Description |
|------|--------|-------------|
| `/services/modules/inventoryApi.ts` | ⚠️ **DEPRECATED** | Main entry point with migration guide |
| `/services/modules/inventoryApi/` | ⚠️ **DEPRECATED** | Subdirectory with modular implementation |

### Replacement Locations

| Legacy Path | New Path | Purpose |
|-------------|----------|---------|
| `inventoryApi.ts` | `@/lib/actions/inventory.actions.ts` | Main exports |
| N/A | `@/lib/actions/inventory.items.ts` | Item CRUD operations |
| N/A | `@/lib/actions/inventory.stock.ts` | Stock level management |
| N/A | `@/lib/actions/inventory.batches.ts` | Batch/expiration tracking |
| N/A | `@/lib/actions/inventory.locations.ts` | Location management |
| N/A | `@/lib/actions/inventory.analytics.ts` | Analytics & reporting |
| N/A | `@/lib/actions/inventory.types.ts` | TypeScript types |
| N/A | `@/lib/actions/inventory.utils.ts` | Utility functions |

---

## Inventory Item Operations

### Create Inventory Item

#### Before (Legacy)
```typescript
import { inventoryApi } from '@/services/modules/inventoryApi';

const item = await inventoryApi.inventory.createInventoryItem({
  name: 'Bandages',
  category: 'MEDICAL_SUPPLIES',
  unitOfMeasure: 'box',
  unitCost: 5.99,
  minStockLevel: 10,
  reorderPoint: 15,
  requiresExpiration: true
});
```

#### After (New Pattern - Form Action)
```typescript
'use client';

import { useActionState } from 'react';
import { createInventoryItemAction } from '@/lib/actions/inventory.items';

export function CreateInventoryItemForm() {
  const [state, formAction, isPending] = useActionState(
    createInventoryItemAction,
    { success: false }
  );

  return (
    <form action={formAction}>
      <input name="name" defaultValue="Bandages" required />
      <select name="category" required>
        <option value="MEDICAL_SUPPLIES">Medical Supplies</option>
        <option value="MEDICATIONS">Medications</option>
      </select>
      <input name="unitOfMeasure" defaultValue="box" required />
      <input name="unitCost" type="number" step="0.01" defaultValue="5.99" />
      <input name="minStockLevel" type="number" defaultValue="10" />
      <input name="reorderPoint" type="number" defaultValue="15" />
      <label>
        <input name="requiresExpiration" type="checkbox" />
        Requires Expiration Tracking
      </label>
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Item'}
      </button>
      {state.error && <div className="error">{state.error}</div>}
    </form>
  );
}
```

### Get Inventory Items (with filters)

#### Before (Legacy)
```typescript
const items = await inventoryApi.inventory.getInventoryItems({
  category: 'MEDICAL_SUPPLIES',
  active: true,
  search: 'bandage'
});
```

#### After (New Pattern)
```typescript
import { getInventoryItemsAction } from '@/lib/actions/inventory.items';

const result = await getInventoryItemsAction({
  category: 'MEDICAL_SUPPLIES',
  active: true,
  search: 'bandage'
});

if (result.success) {
  const items = result.data;
}
```

### Get Single Inventory Item

#### Before (Legacy)
```typescript
const item = await inventoryApi.inventory.getInventoryItem('item-id');
```

#### After (New Pattern)
```typescript
import { getInventoryItemAction } from '@/lib/actions/inventory.items';

const result = await getInventoryItemAction('item-id', true); // includeStock = true
if (result.success) {
  const item = result.data;
}
```

### Update Inventory Item

#### Before (Legacy)
```typescript
const updated = await inventoryApi.inventory.updateInventoryItem('item-id', {
  unitCost: 6.99,
  minStockLevel: 15,
  reorderPoint: 20
});
```

#### After (New Pattern)
```typescript
import { updateInventoryItemAction } from '@/lib/actions/inventory.items';

// Construct FormData (typically from form submission)
const formData = new FormData();
formData.set('unitCost', '6.99');
formData.set('minStockLevel', '15');
formData.set('reorderPoint', '20');

const result = await updateInventoryItemAction('item-id', {}, formData);
if (result.success) {
  const updated = result.data;
}
```

### Delete Inventory Item

#### Before (Legacy)
```typescript
await inventoryApi.inventory.deleteInventoryItem('item-id');
```

#### After (New Pattern)
```typescript
import { deleteInventoryItemAction } from '@/lib/actions/inventory.items';

const result = await deleteInventoryItemAction('item-id');
if (result.success) {
  console.log('Item deleted successfully');
}
```

---

## Stock Management Operations

### Get Stock Levels

#### Before (Legacy)
```typescript
const stock = await inventoryApi.stock.getCurrentStock('item-id');
const lowStock = await inventoryApi.stock.getLowStockItems();
```

#### After (New Pattern)
```typescript
import { getStockLevelsAction } from '@/lib/actions/inventory.stock';

const result = await getStockLevelsAction('item-id');
if (result.success) {
  const stockLevels = result.data;
}
```

### Create Stock Level (for new location)

#### Before (Legacy)
```typescript
await inventoryApi.stock.createStockLevel({
  inventoryItemId: 'item-id',
  locationId: 'location-id',
  quantity: 100,
  minStockLevel: 10
});
```

#### After (New Pattern)
```typescript
import { createStockLevelAction } from '@/lib/actions/inventory.stock';

const result = await createStockLevelAction({
  inventoryItemId: 'item-id',
  locationId: 'location-id',
  quantity: 100,
  minStockLevel: 10
});
```

### Get Expiring Items/Batches

#### Before (Legacy)
```typescript
const expiring = await inventoryApi.stock.getExpiringItems({
  daysUntilExpiration: 30
});
```

#### After (New Pattern)
```typescript
import { getExpiringBatchesAction } from '@/lib/actions/inventory.batches';

const result = await getExpiringBatchesAction(30); // days until expiration
if (result.success) {
  const expiringBatches = result.data;
}
```

---

## Batch Operations (Expiration Tracking)

### Create Batch

#### Before (Legacy)
```typescript
await inventoryApi.stock.createTransaction({
  itemId: 'item-id',
  batchNumber: 'BATCH-001',
  expirationDate: '2026-12-31',
  quantity: 50,
  transactionType: 'RECEIPT'
});
```

#### After (New Pattern)
```typescript
import { createBatchAction } from '@/lib/actions/inventory.batches';

const result = await createBatchAction({
  inventoryItemId: 'item-id',
  batchNumber: 'BATCH-001',
  expirationDate: '2026-12-31',
  quantity: 50
});
```

---

## Location Operations

### Get Inventory Locations

#### Before (Legacy)
```typescript
// Not directly available in old API
```

#### After (New Pattern)
```typescript
import { getInventoryLocationsAction } from '@/lib/actions/inventory.locations';

const result = await getInventoryLocationsAction();
if (result.success) {
  const locations = result.data;
}
```

### Create Inventory Location

#### Before (Legacy)
```typescript
// Not directly available in old API
```

#### After (New Pattern)
```typescript
import { createInventoryLocationAction } from '@/lib/actions/inventory.locations';

const result = await createInventoryLocationAction({
  name: 'Main Storage',
  description: 'Primary inventory storage location',
  type: 'WAREHOUSE'
});
```

---

## Analytics & Reporting

### Get Inventory Statistics

#### Before (Legacy)
```typescript
const stats = await inventoryApi.analytics.getInventoryStats();
```

#### After (New Pattern)
```typescript
import { getInventoryStats } from '@/lib/actions/inventory.analytics';

const result = await getInventoryStats();
if (result.success) {
  const stats = result.data;
  // stats includes: totalItems, totalValue, lowStockCount, etc.
}
```

### Get Dashboard Data

#### Before (Legacy)
```typescript
const dashboard = await inventoryApi.analytics.getInventoryStats();
```

#### After (New Pattern)
```typescript
import { getInventoryDashboardData } from '@/lib/actions/inventory.analytics';

const result = await getInventoryDashboardData();
if (result.success) {
  const dashboardData = result.data;
}
```

### Get Categories

#### Before (Legacy)
```typescript
// Categories were hardcoded or fetched separately
```

#### After (New Pattern)
```typescript
import { getInventoryCategoriesAction } from '@/lib/actions/inventory.analytics';

const result = await getInventoryCategoriesAction();
const categories = result.data;
```

---

## Controlled Substances (HIPAA/DEA Compliance)

### Before (Legacy)
```typescript
const item = await inventoryApi.inventory.createInventoryItem({
  name: 'Controlled Medication',
  isControlledSubstance: true,
  controlledSubstanceSchedule: 'II'
});
// Manual audit logging required
```

### After (New Pattern)
```typescript
// Automatic audit logging built into action
import { createInventoryItemAction } from '@/lib/actions/inventory.items';

// In form:
<input name="name" defaultValue="Controlled Medication" />
<input name="isControlledSubstance" type="checkbox" defaultValue="true" />
<select name="controlledSubstanceSchedule">
  <option value="II">Schedule II</option>
  <option value="III">Schedule III</option>
</select>

// Action automatically creates audit log when isControlledSubstance is true
```

---

## Type Imports Migration

### Before (Legacy)
```typescript
import type {
  Student,
  CreateStudentData
} from '@/services/modules/studentsApi';

import type {
  InventoryItem
} from '@/services/modules/inventoryApi';
```

### After (New Pattern)
```typescript
// Domain types from centralized types directory
import type {
  Student,
  CreateStudentData
} from '@/types/domain/student.types';

import type {
  InventoryItem
} from '@/types/domain/inventory.types';

// Action result wrapper types
import type { ActionResult } from '@/lib/actions/students.types';
import type { ActionResult } from '@/lib/actions/inventory.types';
```

---

## Error Handling Pattern Change

### Before (Legacy - Exception-based)
```typescript
try {
  const student = await studentsApi.getById('student-id');
  console.log(student);
} catch (error) {
  console.error('Error fetching student:', error);
  // Handle error
}
```

### After (New - Result-based)
```typescript
import { getStudent } from '@/lib/actions/students.cache';

const result = await getStudent('student-id');

if (!result.success) {
  console.error('Error fetching student:', result.error);
  // Handle error
  return;
}

// TypeScript knows result.data exists here
const student = result.data;
console.log(student);
```

---

## Cache Invalidation

### Before (Legacy - Manual)
```typescript
import { studentsApi } from '@/services/modules/studentsApi';
import { clearStudentCache } from '@/services/modules/studentsApi';

await studentsApi.update('student-id', { grade: '6' });
clearStudentCache(); // Manual cache clearing
```

### After (New - Automatic)
```typescript
import { updateStudent } from '@/lib/actions/students.crud';

await updateStudent('student-id', { grade: '6' });
// Cache automatically invalidated with:
// - revalidateTag(CACHE_TAGS.STUDENTS)
// - revalidateTag(`student-${studentId}`)
// - revalidatePath('/dashboard/students')
// - revalidatePath(`/dashboard/students/${studentId}`)
```

---

## Migration Checklist

### Students Module

- [ ] Update all student CRUD operations
  - [ ] Replace `studentsApi.create()` with `createStudent()`
  - [ ] Replace `studentsApi.getAll()` with `getStudents()` or `getPaginatedStudents()`
  - [ ] Replace `studentsApi.getById()` with `getStudent()`
  - [ ] Replace `studentsApi.update()` with `updateStudent()`
  - [ ] Replace `studentsApi.deactivate()` with `deleteStudent()` or `deactivateStudent()`
- [ ] Update bulk operations
  - [ ] Replace `studentsApi.transfer()` with `transferStudent()`
  - [ ] Replace `studentsApi.bulkUpdate()` with `bulkUpdateStudents()`
- [ ] Update specialized operations
  - [ ] Replace `studentsApi.search()` with `searchStudents()`
  - [ ] Replace `studentsApi.getStatistics()` with `getStudentStatistics()`
  - [ ] Replace `studentsApi.exportStudentData()` with `exportStudentData()`
- [ ] Update form integrations
  - [ ] Convert to `useActionState` hook pattern
  - [ ] Use form action functions: `createStudentFromForm`, `updateStudentFromForm`
- [ ] Update error handling from try/catch to result checking
- [ ] Update type imports to use `@/types/domain/student.types`
- [ ] Remove manual cache clearing calls
- [ ] Test HIPAA audit logging still works
- [ ] Update unit tests to mock server actions
- [ ] Remove old `studentsApi` imports after migration

### Inventory Module

- [ ] Update inventory item operations
  - [ ] Replace `inventoryApi.inventory.createInventoryItem()` with `createInventoryItemAction()`
  - [ ] Replace `inventoryApi.inventory.getInventoryItems()` with `getInventoryItemsAction()`
  - [ ] Replace `inventoryApi.inventory.getInventoryItem()` with `getInventoryItemAction()`
  - [ ] Replace `inventoryApi.inventory.updateInventoryItem()` with `updateInventoryItemAction()`
  - [ ] Replace `inventoryApi.inventory.deleteInventoryItem()` with `deleteInventoryItemAction()`
- [ ] Update stock management operations
  - [ ] Replace `inventoryApi.stock.getCurrentStock()` with `getStockLevelsAction()`
  - [ ] Replace `inventoryApi.stock.createStockLevel()` with `createStockLevelAction()`
  - [ ] Replace `inventoryApi.stock.getExpiringItems()` with `getExpiringBatchesAction()`
- [ ] Update batch operations
  - [ ] Replace batch creation with `createBatchAction()`
- [ ] Update location operations
  - [ ] Use new `getInventoryLocationsAction()` and `createInventoryLocationAction()`
- [ ] Update analytics operations
  - [ ] Replace `inventoryApi.analytics.getInventoryStats()` with `getInventoryStats()`
  - [ ] Replace dashboard calls with `getInventoryDashboardData()`
  - [ ] Use `getInventoryCategoriesAction()` for categories
- [ ] Migrate supplier operations to vendors module
  - [ ] Replace `inventoryApi.suppliers.*` with `vendors.*` actions
- [ ] Migrate purchase order operations
  - [ ] Replace `inventoryApi.suppliers.getPurchaseOrders()` with `purchase-orders.*` actions
- [ ] Update form integrations to use `useActionState`
- [ ] Convert object-based updates to FormData pattern
- [ ] Update error handling from try/catch to result checking
- [ ] Update type imports to use `@/types/domain/inventory.types`
- [ ] Test controlled substance audit logging
- [ ] Verify multi-location inventory tracking works
- [ ] Update unit tests to mock server actions
- [ ] Remove old `inventoryApi` imports after migration

---

## Breaking Changes Summary

### All Modules

1. **Return Type Change**: Methods now return `ActionResult<T>` instead of throwing exceptions
   ```typescript
   // Old: throws on error
   const data = await api.method();

   // New: returns result object
   const result = await action();
   if (result.success) { const data = result.data; }
   ```

2. **Method Name Changes**:
   - `getAll()` → `getStudents()` / `getInventoryItemsAction()`
   - `getById()` → `getStudent()` / `getInventoryItemAction()`
   - `delete()` → `deleteStudent()` / `deleteInventoryItemAction()`

3. **Parameter Structure Changes**:
   - Students: `bulkUpdate({ updates })` → `bulkUpdateStudents({ updateData })`
   - Inventory: Object parameters → FormData for create/update actions

4. **Cache Management**: Manual cache clearing removed, automatic invalidation with revalidateTag/revalidatePath

5. **Form Integration**: Manual event handlers → `useActionState` hook with form actions

6. **Imports**: Service classes → Individual action functions

### Inventory-Specific

7. **Module Separation**:
   - Suppliers → Vendors module (`@/lib/actions/vendors.*`)
   - Purchase Orders → Separate module (`@/lib/actions/purchase-orders.*`)
   - Stock/Batches → Separate actions (`inventory.stock`, `inventory.batches`)

8. **Location Management**: Explicit location operations now available

9. **Analytics Consolidation**: Multiple analytics endpoints → Unified stats/dashboard

---

## Testing Strategy

### Unit Tests

#### Before (Legacy)
```typescript
jest.mock('@/services/modules/studentsApi', () => ({
  studentsApi: {
    getById: jest.fn(),
    create: jest.fn()
  }
}));

test('fetches student', async () => {
  studentsApi.getById.mockResolvedValue({ id: '1', name: 'John' });
  const student = await studentsApi.getById('1');
  expect(student.name).toBe('John');
});
```

#### After (New)
```typescript
jest.mock('@/lib/actions/students.cache', () => ({
  getStudent: jest.fn()
}));

test('fetches student', async () => {
  getStudent.mockResolvedValue({
    success: true,
    data: { id: '1', name: 'John' }
  });

  const result = await getStudent('1');
  expect(result.success).toBe(true);
  expect(result.data.name).toBe('John');
});
```

### Integration Tests

Test server actions with actual Next.js cache behavior in test environment.

---

## Timeline & Support

### Deprecation Timeline

| Version | Date | Status | Action Required |
|---------|------|--------|-----------------|
| **v1.5.0** | Nov 2025 | ⚠️ Deprecation warnings added | Begin migration planning |
| **v1.6.0** | Jan 2026 | Runtime warnings in dev mode | Active migration in progress |
| **v1.8.0** | Mar 2026 | Warning level increased | Complete migration by this point |
| **v2.0.0** | **Jun 30, 2026** | 🚫 **Legacy APIs removed** | **Migration must be complete** |

### Support Resources

- **Documentation**: `/src/services/modules/DEPRECATED.md` (comprehensive guide)
- **New Implementation Examples**:
  - `/src/lib/actions/students.actions.ts`
  - `/src/lib/actions/inventory.actions.ts`
- **Team Support**: #api-migration-support channel
- **Office Hours**: Weekly migration Q&A sessions (Wednesdays 2pm)

### Migration Assistance

For questions or issues during migration:

1. Check this document and inline migration comments
2. Review new action implementations for patterns
3. Post in #api-migration-support with specific questions
4. Attend weekly migration office hours for live help

---

## Additional Resources

### Documentation

- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React useActionState Hook](https://react.dev/reference/react/useActionState)
- [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching)

### Internal Guides

- `/src/services/modules/DEPRECATED.md` - Full deprecation guide
- `/src/lib/actions/README.md` - Server actions architecture
- `/docs/migration/` - Migration patterns and examples

---

**Document End**

*Last Updated: 2025-11-15*
*Version: 1.0.0*
*Status: Active Deprecation*
