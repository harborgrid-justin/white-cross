# Optimistic Updates - Quick Start Guide

Get started with optimistic updates in 5 minutes.

## Installation

No installation needed - the system is built-in to the White Cross platform.

## Step 1: Add Global UI Components (One Time Setup)

In your root `App.tsx`, add the global UI components:

```typescript
import { OptimisticUpdateIndicator, UpdateToast, ConflictResolutionModal } from '@/components/shared';

function App() {
  return (
    <>
      {/* Add these once at the root level */}
      <OptimisticUpdateIndicator position="top-right" />
      <UpdateToast position="bottom-right" />
      <ConflictResolutionModal isOpen={false} onClose={() => {}} autoShow />

      {/* Your app content */}
      <YourAppContent />
    </>
  );
}
```

## Step 2: Use Optimistic Hooks

For incident reports, use the pre-built hooks:

### Create Incident

```typescript
import { useOptimisticIncidentCreate } from '@/hooks/useOptimisticIncidents';

function CreateIncidentForm() {
  const createMutation = useOptimisticIncidentCreate({
    onSuccess: (response) => {
      console.log('Created:', response.report);
      // Navigate or show success message
    }
  });

  const handleSubmit = (data) => {
    createMutation.mutate({
      studentId: 'student-123',
      type: 'INJURY',
      severity: 'MEDIUM',
      description: 'Student fell on playground',
      location: 'Playground',
      occurredAt: new Date().toISOString(),
      actionsTaken: 'Applied first aid',
      reportedById: 'nurse-456',
    });
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={createMutation.isPending}
    >
      {createMutation.isPending ? 'Creating...' : 'Create Incident'}
    </button>
  );
}
```

### Update Incident

```typescript
import { useOptimisticIncidentUpdate } from '@/hooks/useOptimisticIncidents';

function IncidentActions({ incidentId }) {
  const updateMutation = useOptimisticIncidentUpdate();

  const handleResolve = () => {
    updateMutation.mutate({
      id: incidentId,
      data: {
        status: 'RESOLVED',
        followUpNotes: 'Issue resolved'
      }
    });
  };

  return (
    <button onClick={handleResolve} disabled={updateMutation.isPending}>
      Mark as Resolved
    </button>
  );
}
```

### Delete Incident

```typescript
import { useOptimisticIncidentDelete } from '@/hooks/useOptimisticIncidents';

function DeleteButton({ incidentId }) {
  const deleteMutation = useOptimisticIncidentDelete();

  const handleDelete = () => {
    if (confirm('Are you sure?')) {
      deleteMutation.mutate(incidentId);
    }
  };

  return (
    <button onClick={handleDelete} disabled={deleteMutation.isPending}>
      Delete
    </button>
  );
}
```

## Step 3: Add Visual Feedback (Optional)

Show a rollback button if an update fails:

```typescript
import { RollbackButton } from '@/components/shared';

function IncidentForm() {
  const createMutation = useOptimisticIncidentCreate();

  return (
    <div>
      <button onClick={handleCreate}>Create</button>

      {/* Show rollback button if mutation fails */}
      {createMutation.isError && createMutation.context?.updateId && (
        <RollbackButton
          updateId={createMutation.context.updateId}
          variant="danger"
          text="Undo Changes"
        />
      )}
    </div>
  );
}
```

## That's It!

You now have:
- ✅ Instant UI updates
- ✅ Automatic error rollback
- ✅ Visual feedback
- ✅ Conflict resolution
- ✅ HIPAA-compliant audit logging

## Advanced Usage

### Custom Optimistic Updates

For other entities, use the helper functions:

```typescript
import { optimisticCreate, confirmCreate } from '@/utils/optimisticHelpers';
import { useQueryClient } from '@tanstack/react-query';

function MyComponent() {
  const queryClient = useQueryClient();

  const handleCreate = async () => {
    // Create optimistically
    const { updateId, tempId, tempEntity } = optimisticCreate(
      queryClient,
      ['my-entity'],
      { name: 'New Item' }
    );

    try {
      // Call API
      const response = await api.createEntity({ name: 'New Item' });

      // Confirm with server data
      confirmCreate(queryClient, ['my-entity'], updateId, tempId, response);
    } catch (error) {
      // Automatic rollback happens in helper
      console.error('Failed:', error);
    }
  };

  return <button onClick={handleCreate}>Create</button>;
}
```

### Transactions

Group related updates:

```typescript
import { beginTransaction, commitTransaction, rollbackTransaction } from '@/utils/optimisticHelpers';

const txnId = beginTransaction();

try {
  // Multiple related updates
  const { updateId: id1 } = optimisticCreate(queryClient, key1, data1, { transactionId: txnId });
  const { updateId: id2 } = optimisticCreate(queryClient, key2, data2, { transactionId: txnId });

  // API calls
  await Promise.all([api.create1(), api.create2()]);

  // Commit all
  commitTransaction(txnId, queryClient);
} catch (error) {
  // Rollback all
  await rollbackTransaction(queryClient, txnId);
}
```

## Common Patterns

### Pattern 1: Show Loading State

```typescript
function MyComponent() {
  const mutation = useOptimisticIncidentCreate();

  return (
    <button disabled={mutation.isPending}>
      {mutation.isPending ? 'Creating...' : 'Create'}
    </button>
  );
}
```

### Pattern 2: Success Notification

```typescript
const mutation = useOptimisticIncidentCreate({
  onSuccess: () => {
    toast.success('Incident created successfully!');
  }
});
```

### Pattern 3: Error Handling

```typescript
const mutation = useOptimisticIncidentCreate({
  onError: (error) => {
    toast.error(`Failed: ${error.message}`);
  }
});
```

### Pattern 4: Redirect After Success

```typescript
const navigate = useNavigate();
const mutation = useOptimisticIncidentCreate({
  onSuccess: (response) => {
    navigate(`/incidents/${response.report.id}`);
  }
});
```

## Troubleshooting

### Updates Not Showing?

Make sure query keys match:
```typescript
// Query key
useQuery(['incidents', 'list'], ...)

// Must match in optimistic update
optimisticCreate(queryClient, ['incidents'], ...)
```

### Rollback Not Working?

Check that you have the previous data:
```typescript
// Set initial data first
queryClient.setQueryData(['incidents', 'list'], { data: [] });

// Then create optimistically
optimisticCreate(queryClient, ['incidents'], newIncident);
```

### Conflicts Not Detected?

Enable manual conflict resolution:
```typescript
optimisticUpdate(queryClient, key, id, changes, {
  conflictStrategy: ConflictResolutionStrategy.MANUAL
});
```

## Next Steps

- Read the [full documentation](./OPTIMISTIC_UPDATES_README.md)
- Check out [examples](./optimisticUpdates.examples.ts)
- Review [best practices](./OPTIMISTIC_UPDATES_README.md#best-practices)

## Need Help?

1. Check the console for error messages
2. Review the examples in `optimisticUpdates.examples.ts`
3. Read the full README
4. Contact the development team
