# Optimistic Updates - Quick Reference

One-page cheat sheet for implementing optimistic UI updates.

---

## Quick Start (30 seconds)

```typescript
// 1. Import hook
import { useOptimisticStudents } from '@/hooks/useOptimisticStudents';

// 2. Use in component
const { createStudent, isCreating, createError } = useOptimisticStudents();

// 3. Call mutation
createStudent.mutate(data); // UI updates instantly!

// 4. Show loading
<button disabled={isCreating}>
  {isCreating ? 'Creating...' : 'Create'}
</button>

// 5. Show errors
{createError && <div>{createError.message}</div>}
```

Done! Your form now has optimistic updates with automatic rollback.

---

## Available Hooks

| Hook | Import Path | Use For |
|------|------------|---------|
| `useOptimisticStudents` | `@/hooks/useOptimisticStudents` | Student CRUD |
| `useOptimisticMedications` | `@/hooks/useOptimisticMedications` | Medication CRUD, prescriptions, inventory |
| `useOptimisticIncidents` | `@/hooks/useOptimisticIncidents` | Incident reports |
| `useOptimisticWitnessStatements` | `@/hooks/useOptimisticIncidents` | Witness statements |
| `useOptimisticFollowUpActions` | `@/hooks/useOptimisticIncidents` | Follow-up actions |

---

## Common Operations

### Create
```typescript
const { createStudent, isCreating, createError } = useOptimisticStudents();
createStudent.mutate(data);
```

### Update
```typescript
const { updateStudent, isUpdating, updateError } = useOptimisticStudents();
updateStudent.mutate({ id: '123', data: { grade: '9' } });
```

### Delete
```typescript
const { deleteStudent, isDeleting, deleteError } = useOptimisticStudents();
deleteStudent.mutate('student-id');
```

---

## Return Values

Every hook provides:

```typescript
{
  // Mutation objects
  createX,      // TanStack Query mutation for create
  updateX,      // TanStack Query mutation for update
  deleteX,      // TanStack Query mutation for delete

  // Convenience functions
  createWithOptimism: (data) => void,     // Direct mutate call
  updateWithOptimism: (data) => void,
  deleteWithOptimism: (id) => void,

  // Loading states
  isCreating: boolean,
  isUpdating: boolean,
  isDeleting: boolean,

  // Error states
  createError: Error | null,
  updateError: Error | null,
  deleteError: Error | null,

  // Success flags
  createSuccess: boolean,
  updateSuccess: boolean,
  deleteSuccess: boolean,

  // Reset functions
  resetCreate: () => void,
  resetUpdate: () => void,
  resetDelete: () => void,
}
```

---

## Mutation Methods

### `.mutate(data)`
Fire and forget. Returns void.
```typescript
createStudent.mutate(data);
```

### `.mutateAsync(data)`
Returns Promise. Use with async/await.
```typescript
await createStudent.mutateAsync(data);
```

### With Callbacks
```typescript
createStudent.mutate(data, {
  onSuccess: (result) => console.log('Success!', result),
  onError: (error) => console.error('Error!', error),
  onSettled: () => console.log('Done (success or error)'),
});
```

---

## Visual Feedback

### Global Indicator
```typescript
import { OptimisticUpdateIndicator } from '@/components/shared/OptimisticUpdateIndicator';

<OptimisticUpdateIndicator position="top-right" showDetails={true} />
```

### Toast Notifications
```typescript
import { UpdateToast, showSuccessToast } from '@/components/shared/UpdateToast';

// Global toaster
<UpdateToast position="top-right" showConfirmed={true} showFailed={true} />

// Manual toasts
showSuccessToast('Created successfully!');
showErrorToast('Failed to create');
```

### Promise Toasts
```typescript
import { showPromiseToast } from '@/components/shared/UpdateToast';

await showPromiseToast(
  createStudent.mutateAsync(data),
  {
    loading: 'Creating...',
    success: 'Created!',
    error: 'Failed!',
  }
);
```

---

## Loading States

### Button
```typescript
<button disabled={isCreating}>
  {isCreating ? 'Creating...' : 'Create'}
</button>
```

### Form
```typescript
<form className={isCreating ? 'opacity-50 pointer-events-none' : ''}>
  {/* fields */}
</form>
```

### Row
```typescript
<tr className={isUpdating ? 'opacity-50' : ''}>
  {/* cells */}
</tr>
```

### Spinner
```typescript
{isCreating && <Spinner />}
{isCreating ? <Spinner /> : <Icon />}
```

---

## Error Handling

### Display Error
```typescript
{createError && (
  <div className="text-red-600">{createError.message}</div>
)}
```

### Alert Banner
```typescript
import { AlertBanner } from '@/components/shared/AlertBanner';

{createError && (
  <AlertBanner type="error">{createError.message}</AlertBanner>
)}
```

### Try-Catch
```typescript
try {
  await createStudent.mutateAsync(data);
  showSuccessToast('Success!');
} catch (error) {
  showErrorToast(error.message);
}
```

### Specific Errors
```typescript
try {
  await createStudent.mutateAsync(data);
} catch (error) {
  if (error.statusCode === 409) {
    showErrorToast('Already exists');
  } else if (error.statusCode === 403) {
    showErrorToast('Permission denied');
  } else {
    showErrorToast('Unknown error');
  }
}
```

---

## Complete Examples

### Basic Form
```typescript
import { useOptimisticStudents } from '@/hooks/useOptimisticStudents';
import { showSuccessToast } from '@/components/shared/UpdateToast';

export const StudentForm = () => {
  const { createStudent, isCreating, createError } = useOptimisticStudents();

  const handleSubmit = async (data) => {
    try {
      await createStudent.mutateAsync(data);
      showSuccessToast('Student created!');
    } catch (error) {
      // Error handled automatically
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* fields */}

      <button disabled={isCreating}>
        {isCreating ? 'Creating...' : 'Create'}
      </button>

      {createError && <div>{createError.message}</div>}
    </form>
  );
};
```

### With All Features
```typescript
import { useOptimisticStudents } from '@/hooks/useOptimisticStudents';
import { showPromiseToast } from '@/components/shared/UpdateToast';
import { OptimisticUpdateIndicator } from '@/components/shared/OptimisticUpdateIndicator';

export const StudentManager = () => {
  const {
    createStudent,
    updateStudent,
    deleteStudent,
    isCreating,
    isUpdating,
    isDeleting,
    createError,
  } = useOptimisticStudents();

  const handleCreate = async (data) => {
    await showPromiseToast(
      createStudent.mutateAsync(data),
      {
        loading: 'Creating student...',
        success: 'Student created!',
        error: 'Failed to create',
      }
    );
  };

  const handleUpdate = (id, data) => {
    updateStudent.mutate({ id, data });
  };

  const handleDelete = async (id) => {
    if (confirm('Delete student?')) {
      await deleteStudent.mutateAsync(id);
    }
  };

  return (
    <div>
      <OptimisticUpdateIndicator position="top-right" />

      <StudentForm
        onSubmit={handleCreate}
        disabled={isCreating}
      />

      <StudentList
        students={students}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />

      {createError && <Alert>{createError.message}</Alert>}
    </div>
  );
};
```

---

## Student Operations

```typescript
const {
  createStudent,      // Create new student
  updateStudent,      // Update student details
  deactivateStudent,  // Soft delete (isActive = false)
  reactivateStudent,  // Restore deactivated student
  transferStudent,    // Transfer to different nurse
  deleteStudent,      // Permanent delete (HIPAA)
} = useOptimisticStudents();

// Create
createStudent.mutate({
  studentNumber: 'STU-001',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '2010-05-15',
  grade: '8',
  gender: 'MALE',
  nurseId: 'nurse-123',
  enrollmentDate: '2024-01-15',
});

// Update
updateStudent.mutate({
  id: 'student-123',
  data: { grade: '9', nurseId: 'nurse-456' },
});

// Deactivate (soft delete)
deactivateStudent.mutate('student-123');

// Reactivate
reactivateStudent.mutate('student-123');

// Transfer
transferStudent.mutate({
  id: 'student-123',
  data: { nurseId: 'nurse-789', reason: 'Caseload balancing' },
});

// Permanent delete
deleteStudent.mutate('student-123');
```

---

## Medication Operations

```typescript
const {
  createMedication,         // Add to formulary
  updateMedication,         // Update medication
  deleteMedication,         // Remove medication
  createPrescription,       // Assign to student
  deactivatePrescription,   // Stop prescription
  logAdministration,        // Log Five Rights
  addInventory,             // Add to inventory
  updateInventory,          // Update quantity
  reportAdverseReaction,    // Report reaction
} = useOptimisticMedications();

// Create medication
createMedication.mutate({
  name: 'Ibuprofen',
  genericName: 'Ibuprofen',
  dosageForm: 'Tablet',
  strength: '200mg',
  manufacturer: 'Generic Pharma',
  isControlled: false,
});

// Create prescription
createPrescription.mutate({
  studentId: 'student-123',
  medicationId: 'med-456',
  dosage: '200mg',
  frequency: 'twice daily',
  route: 'Oral',
  prescribedBy: 'Dr. Smith',
  startDate: '2024-01-15',
});

// Log administration
logAdministration.mutate({
  studentMedicationId: 'prescription-789',
  dosageGiven: '200mg',
  timeGiven: new Date().toISOString(),
  nurseId: 'nurse-123',
  notes: 'Administered with food',
  patientVerified: true,
  allergyChecked: true,
});

// Add inventory
addInventory.mutate({
  medicationId: 'med-456',
  batchNumber: 'BATCH-2024-001',
  expirationDate: '2025-12-31',
  quantity: 100,
  reorderLevel: 20,
});

// Update inventory
updateInventory.mutate({
  id: 'inventory-123',
  data: { quantity: 50, reason: 'Dispensed' },
});

// Report adverse reaction
reportAdverseReaction.mutate({
  studentMedicationId: 'prescription-789',
  severity: 'MILD',
  reaction: 'Mild nausea',
  actionTaken: 'Administered with food',
  reportedAt: new Date().toISOString(),
});
```

---

## Incident Operations

```typescript
const {
  createIncident,   // Create incident report
  updateIncident,   // Update incident
  deleteIncident,   // Delete incident
} = useOptimisticIncidents();

const {
  createWitness,    // Add witness statement
  updateWitness,    // Update statement
  verifyWitness,    // Mark as verified
} = useOptimisticWitnessStatements();

const {
  createAction,     // Create follow-up action
  updateAction,     // Update action
  completeAction,   // Mark complete
} = useOptimisticFollowUpActions();

// Create incident
createIncident.mutate({
  studentId: 'student-123',
  reportedById: 'nurse-456',
  type: 'INJURY',
  severity: 'MEDIUM',
  description: 'Student fell on playground',
  location: 'Playground',
  occurredAt: new Date().toISOString(),
  actionsTaken: 'Applied bandage, ice pack',
  parentNotified: true,
  followUpRequired: true,
});

// Add witness
createWitness.mutate({
  incidentReportId: 'incident-789',
  witnessName: 'John Teacher',
  witnessType: 'STAFF',
  witnessContact: 'john@school.edu',
  statement: 'I witnessed the student fall...',
});

// Create follow-up action
createAction.mutate({
  incidentReportId: 'incident-789',
  action: 'Schedule follow-up appointment',
  dueDate: '2024-01-20',
  priority: 'HIGH',
  assignedTo: 'nurse-456',
});

// Complete action
completeAction.mutate({
  id: 'action-123',
  notes: 'Follow-up completed, student is healthy',
});
```

---

## Tips & Tricks

### 1. Combine Multiple Operations
```typescript
const handleCreateWithRelated = async () => {
  const incident = await createIncident.mutateAsync(incidentData);

  if (witnessData) {
    await createWitness.mutateAsync({
      incidentReportId: incident.report.id,
      ...witnessData,
    });
  }
};
```

### 2. Conditional Updates
```typescript
const handleQuickEdit = (id, field, value) => {
  if (field === 'grade') {
    updateStudent.mutate({ id, data: { grade: value } });
  } else if (field === 'nurse') {
    transferStudent.mutate({ id, data: { nurseId: value } });
  }
};
```

### 3. Batch Operations
```typescript
const handleBulkUpdate = async (ids, data) => {
  await Promise.all(
    ids.map(id => updateStudent.mutateAsync({ id, data }))
  );
};
```

### 4. Reset on Close
```typescript
const handleCloseModal = () => {
  resetCreate();
  setIsOpen(false);
};
```

---

## Debugging

### Check Update Status
```typescript
import { optimisticUpdateManager } from '@/utils/optimisticUpdates';

const stats = optimisticUpdateManager.getStats();
console.log(stats); // { total, pending, confirmed, failed, ... }
```

### Monitor Updates
```typescript
useEffect(() => {
  const unsubscribe = optimisticUpdateManager.subscribe((update) => {
    console.log('[Update]', update);
  });
  return unsubscribe;
}, []);
```

### Get Pending Updates
```typescript
const pending = optimisticUpdateManager.getPendingUpdates();
console.log(`${pending.length} updates pending`);
```

---

## Common Patterns

### Form with Toast
```typescript
const handleSubmit = async (data) => {
  await showPromiseToast(
    createStudent.mutateAsync(data),
    {
      loading: 'Creating...',
      success: 'Created!',
      error: 'Failed!',
    }
  );
};
```

### Table with Inline Edit
```typescript
const handleCellEdit = (id, field, value) => {
  updateStudent.mutate({ id, data: { [field]: value } });
};
```

### Confirmation Dialog
```typescript
const handleDelete = async (id) => {
  if (confirm('Delete student?')) {
    await deleteStudent.mutateAsync(id);
    showSuccessToast('Deleted!');
  }
};
```

### Loading Overlay
```typescript
{isCreating && (
  <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
    <Spinner />
  </div>
)}
```

---

## Need More Help?

- **Full Guide**: See `OPTIMISTIC_UPDATES_INTEGRATION.md`
- **Summary**: See `OPTIMISTIC_UPDATES_IMPLEMENTATION_SUMMARY.md`
- **Examples**: See `frontend/src/utils/optimisticUpdates.examples.ts`
- **Source Code**: Check hook implementations in `frontend/src/hooks/`

---

**Remember**: Optimistic updates make your app feel instant! Use them everywhere. 🚀
