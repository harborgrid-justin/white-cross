# Optimistic UI Updates System

Production-grade optimistic update management system for the White Cross healthcare platform. Provides automatic rollback, conflict resolution, race condition handling, and comprehensive audit trails for HIPAA-compliant data management.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)
- [HIPAA Compliance](#hipaa-compliance)
- [Troubleshooting](#troubleshooting)

## Overview

Optimistic updates improve user experience by immediately reflecting changes in the UI before server confirmation. This system provides enterprise-grade optimistic update management with:

- **Automatic Rollback**: Reverts changes when server operations fail
- **Conflict Detection**: Identifies when server data differs from client data
- **Race Condition Handling**: Queues conflicting updates automatically
- **Comprehensive Audit Trail**: Tracks all updates for compliance
- **Visual Feedback**: UI components show update status
- **Transaction Support**: Group related updates together

## Features

### Core Features

- ✅ **Optimistic Create/Update/Delete**: Standard CRUD operations with optimistic updates
- ✅ **Bulk Operations**: Batch create, update, and delete with optimistic feedback
- ✅ **Conflict Resolution**: Multiple strategies (server wins, client wins, merge, manual)
- ✅ **Rollback Strategies**: Restore previous, refetch, keep stale, or custom
- ✅ **Update Queuing**: Automatic queuing for conflicting operations
- ✅ **Retry Logic**: Configurable retry attempts for failed operations
- ✅ **Transaction Support**: Group related updates with rollback on failure
- ✅ **Update History**: Complete audit trail of all operations

### UI Components

- 🎨 **OptimisticUpdateIndicator**: Visual indicator for pending updates
- 🎨 **UpdateToast**: Toast notifications for success/failure
- 🎨 **RollbackButton**: Manual rollback with confirmation
- 🎨 **ConflictResolutionModal**: User-driven conflict resolution

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Components  │  │    Hooks     │  │     API      │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
┌─────────▼──────────────────▼──────────────────▼──────────────┐
│              Optimistic Updates System                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      OptimisticUpdateManager (Core Engine)           │   │
│  │  • Update Tracking      • Conflict Detection         │   │
│  │  • Queue Management     • Rollback Logic             │   │
│  │  • Event System         • Audit Logging              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────┐    ┌──────────────────┐              │
│  │  Helper Functions │    │  Custom Hooks    │              │
│  │  • optimisticXXX │    │  • useOptimistic │              │
│  │  • confirmUpdate │    │  • useRollback   │              │
│  │  • rollbackUpdate│    │  • useConflicts  │              │
│  └──────────────────┘    └──────────────────┘              │
└───────────────────────────────────────────────────────────────┘
          │                                      │
┌─────────▼──────────────────────────────────────▼──────────────┐
│                    TanStack Query Cache                        │
└────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Action**: User triggers an operation (create, update, delete)
2. **Optimistic Update**: System immediately updates UI cache
3. **API Request**: Sends request to server
4. **Response Handling**:
   - **Success**: Confirm update with server data
   - **Failure**: Rollback to previous state
   - **Conflict**: Trigger conflict resolution

## Quick Start

### 1. Installation

The optimistic updates system is built-in. Import the hooks and components:

```typescript
import {
  useOptimisticIncidentCreate,
  useOptimisticIncidentUpdate,
  useOptimisticIncidentDelete,
} from '@/hooks/useOptimisticIncidents';

import { OptimisticUpdateIndicator } from '@/components/shared/OptimisticUpdateIndicator';
import { UpdateToast } from '@/components/shared/UpdateToast';
```

### 2. Basic Usage

```typescript
function IncidentForm() {
  const createMutation = useOptimisticIncidentCreate({
    onSuccess: (response) => {
      console.log('Created:', response.report);
    },
  });

  const handleSubmit = (data) => {
    createMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Creating...' : 'Create Incident'}
      </button>
    </form>
  );
}
```

### 3. Add UI Feedback

```typescript
function App() {
  return (
    <>
      {/* Global components */}
      <OptimisticUpdateIndicator position="top-right" />
      <UpdateToast position="bottom-right" />

      {/* Your app content */}
      <IncidentForm />
    </>
  );
}
```

## Core Concepts

### Update Lifecycle

1. **PENDING**: Update created, waiting to be applied
2. **APPLIED**: Update applied to cache
3. **CONFIRMED**: Server confirmed, update successful
4. **FAILED**: Server rejected, ready for rollback
5. **ROLLED_BACK**: Changes reverted
6. **CONFLICTED**: Server data conflicts with client

### Rollback Strategies

#### RESTORE_PREVIOUS (Default)
Restores the exact previous data state.

```typescript
optimisticUpdate(queryClient, ['incidents'], id, changes, {
  rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS
});
```

#### REFETCH
Invalidates cache and refetches from server.

```typescript
optimisticUpdate(queryClient, ['incidents'], id, changes, {
  rollbackStrategy: RollbackStrategy.REFETCH
});
```

#### KEEP_STALE
Keeps optimistic data but marks as stale.

```typescript
optimisticUpdate(queryClient, ['incidents'], id, changes, {
  rollbackStrategy: RollbackStrategy.KEEP_STALE
});
```

#### CUSTOM
Provide custom rollback logic.

```typescript
optimisticUpdate(queryClient, ['incidents'], id, changes, {
  rollbackStrategy: RollbackStrategy.CUSTOM,
  customRollback: async (queryClient) => {
    // Custom rollback logic
  }
});
```

### Conflict Resolution Strategies

#### SERVER_WINS (Default)
Server data always takes precedence.

#### CLIENT_WINS
Client data takes precedence.

#### MERGE
Merge both versions using a merge function.

```typescript
optimisticUpdate(queryClient, ['incidents'], id, changes, {
  conflictStrategy: ConflictResolutionStrategy.MERGE,
  mergeFn: (server, client) => ({
    ...server,
    description: client.description, // Keep client description
    witnesses: [...new Set([...server.witnesses, ...client.witnesses])] // Merge arrays
  })
});
```

#### MANUAL
Show UI for user to choose resolution.

#### TIMESTAMP
Use timestamps to determine which version is newer.

## API Reference

### Helper Functions

#### optimisticCreate
```typescript
function optimisticCreate<T>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>,
  options?: OptimisticOperationOptions<T>
): { updateId: string; tempId: string; tempEntity: T }
```

#### optimisticUpdate
```typescript
function optimisticUpdate<T>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  entityId: string,
  changes: Partial<Omit<T, 'id' | 'createdAt'>>,
  options?: OptimisticOperationOptions<T>
): string
```

#### optimisticDelete
```typescript
function optimisticDelete<T>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  entityId: string,
  options?: OptimisticOperationOptions<T>
): string
```

#### confirmUpdate
```typescript
function confirmUpdate<T>(
  updateId: string,
  confirmedData: T,
  queryClient?: QueryClient
): void
```

#### rollbackUpdate
```typescript
function rollbackUpdate(
  queryClient: QueryClient,
  updateId: string,
  error?: { message: string; code?: string; statusCode?: number }
): Promise<void>
```

### Custom Hooks

#### useOptimisticIncidentCreate
```typescript
function useOptimisticIncidentCreate(
  options?: UseMutationOptions<
    { report: IncidentReport },
    Error,
    CreateIncidentReportRequest
  >
): UseMutationResult
```

#### useOptimisticIncidentUpdate
```typescript
function useOptimisticIncidentUpdate(
  options?: UseMutationOptions<
    { report: IncidentReport },
    Error,
    { id: string; data: UpdateIncidentReportRequest }
  >
): UseMutationResult
```

#### useRollback
```typescript
function useRollback(): {
  rollback: (updateId: string, options?: RollbackOptions) => Promise<void>;
  batchRollback: (updateIds: string[], options?: RollbackOptions) => Promise<void>;
  isRollingBack: boolean;
}
```

### UI Components

#### OptimisticUpdateIndicator
```typescript
<OptimisticUpdateIndicator
  queryKey={['incidents']}
  position="top-right"
  showDetails={true}
  showCount={true}
/>
```

#### UpdateToast
```typescript
<UpdateToast
  position="bottom-right"
  duration={3000}
  showConfirmed={true}
  showFailed={true}
  messages={{
    create: 'Incident created successfully',
    update: 'Incident updated successfully'
  }}
/>
```

#### RollbackButton
```typescript
<RollbackButton
  updateId={updateId}
  variant="danger"
  size="md"
  confirmBeforeRollback={true}
  onRollback={() => console.log('Rolled back')}
/>
```

#### ConflictResolutionModal
```typescript
<ConflictResolutionModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  autoShow={true}
  onResolved={() => console.log('Conflict resolved')}
/>
```

## Usage Examples

### Example 1: Create Incident Report

```typescript
function CreateIncidentForm() {
  const createMutation = useOptimisticIncidentCreate({
    onSuccess: (response) => {
      toast.success('Incident created successfully');
      navigate(`/incidents/${response.report.id}`);
    },
    onError: (error) => {
      toast.error(`Failed to create incident: ${error.message}`);
    }
  });

  const handleSubmit = (data: CreateIncidentReportRequest) => {
    createMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button
        type="submit"
        disabled={createMutation.isPending}
      >
        {createMutation.isPending ? 'Creating...' : 'Create Incident'}
      </button>
    </form>
  );
}
```

### Example 2: Update with Rollback

```typescript
function IncidentActions({ incident }) {
  const updateMutation = useOptimisticIncidentUpdate();
  const { rollback } = useRollback();

  const handleResolve = () => {
    updateMutation.mutate(
      {
        id: incident.id,
        data: { status: IncidentStatus.RESOLVED }
      },
      {
        onError: (error, variables, context) => {
          // Automatic rollback happens in hook
          // Optionally show manual rollback button
          toast.error(
            <div>
              <p>Failed to resolve incident</p>
              <button onClick={() => rollback(context.updateId)}>
                Undo
              </button>
            </div>
          );
        }
      }
    );
  };

  return (
    <button onClick={handleResolve}>
      Mark as Resolved
    </button>
  );
}
```

### Example 3: Bulk Operations

```typescript
function BulkDeleteIncidents({ selectedIds }) {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleBulkDelete = async () => {
    setIsDeleting(true);

    // Create optimistic bulk delete
    const updateId = optimisticBulkDelete(
      queryClient,
      ['incidents'],
      selectedIds
    );

    try {
      await api.bulkDeleteIncidents(selectedIds);
      confirmUpdate(updateId!, { success: true });
      toast.success(`Deleted ${selectedIds.length} incidents`);
    } catch (error) {
      await rollbackUpdate(queryClient, updateId!, {
        message: error.message
      });
      toast.error('Failed to delete incidents');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleBulkDelete}
      disabled={isDeleting || selectedIds.length === 0}
    >
      Delete {selectedIds.length} Selected
    </button>
  );
}
```

### Example 4: Transactions

```typescript
function CreateIncidentWithWitness() {
  const queryClient = useQueryClient();

  const handleCreate = async (incidentData, witnessData) => {
    const txnId = beginTransaction();

    try {
      // Create incident
      const { updateId: incidentUpdateId, tempId } = optimisticCreate(
        queryClient,
        ['incidents'],
        incidentData,
        { transactionId: txnId }
      );

      // Create witness (depends on incident)
      const { updateId: witnessUpdateId } = optimisticCreate(
        queryClient,
        ['incidents', tempId, 'witnesses'],
        { ...witnessData, incidentReportId: tempId },
        {
          transactionId: txnId,
          dependencies: [incidentUpdateId]
        }
      );

      // API calls
      const incident = await api.createIncident(incidentData);
      const witness = await api.createWitness({
        ...witnessData,
        incidentReportId: incident.id
      });

      // Commit transaction
      commitTransaction(txnId, queryClient);
    } catch (error) {
      // Rollback all changes
      await rollbackTransaction(queryClient, txnId);
      throw error;
    }
  };

  return <form onSubmit={handleCreate}>{/* Form */}</form>;
}
```

## Best Practices

### 1. Always Handle Errors

```typescript
const mutation = useOptimisticIncidentCreate({
  onError: (error, variables, context) => {
    // Show user-friendly error message
    toast.error(`Failed: ${error.message}`);

    // Log for debugging
    console.error('Mutation failed:', {
      error,
      variables,
      context
    });
  }
});
```

### 2. Use Appropriate Rollback Strategies

- **RESTORE_PREVIOUS**: For most operations
- **REFETCH**: When data might be stale
- **CUSTOM**: For complex rollback logic

### 3. Handle Conflicts Gracefully

```typescript
optimisticUpdate(queryClient, key, id, changes, {
  conflictStrategy: ConflictResolutionStrategy.MANUAL,
  // Let users decide on conflicts for important data
});
```

### 4. Provide Visual Feedback

Always include update indicators and toasts:

```typescript
function App() {
  return (
    <>
      <OptimisticUpdateIndicator position="top-right" />
      <UpdateToast position="bottom-right" />
      <ConflictResolutionModal isOpen={false} onClose={() => {}} autoShow />

      {/* App content */}
    </>
  );
}
```

### 5. Use Transactions for Related Updates

Group related updates that should succeed or fail together:

```typescript
const txnId = beginTransaction();
try {
  // Multiple related updates
  await Promise.all([...]);
  commitTransaction(txnId);
} catch {
  await rollbackTransaction(queryClient, txnId);
}
```

### 6. Clean Up Old Updates

```typescript
useEffect(() => {
  // Clean up updates older than 5 minutes
  const interval = setInterval(() => {
    optimisticUpdateManager.clearOldUpdates(5 * 60 * 1000);
  }, 60 * 1000);

  return () => clearInterval(interval);
}, []);
```

## HIPAA Compliance

### Audit Logging

All optimistic updates are logged for HIPAA compliance:

```typescript
{
  action: 'CONFIRMED',
  updateId: 'opt_123456',
  operationType: 'UPDATE',
  status: 'CONFIRMED',
  timestamp: 1234567890,
  userId: 'nurse-456',
  transactionId: 'txn_789',
  duration: 150
}
```

### Data Security

- **No PHI in Logs**: Logs contain metadata only, no patient data
- **User Tracking**: All updates tracked to specific users
- **Audit Trail**: Complete history of all operations
- **Rollback Support**: Ability to undo changes if needed

### Sensitive Data Handling

```typescript
// Mask sensitive fields in conflict resolution UI
const renderValue = (key: string, value: any) => {
  const sensitiveFields = ['ssn', 'medicalRecordNumber'];
  if (sensitiveFields.includes(key)) {
    return '••••••••';
  }
  return value;
};
```

## Troubleshooting

### Updates Not Appearing

**Problem**: Optimistic updates don't show in UI

**Solution**: Ensure query keys match exactly:

```typescript
// Must match
const queryKey = ['incidents', 'list'];
optimisticUpdate(queryClient, ['incidents', 'list'], id, changes);
```

### Rollback Not Working

**Problem**: Failed updates don't rollback

**Solution**: Check rollback strategy and error handling:

```typescript
optimisticUpdate(queryClient, key, id, changes, {
  rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
  // Ensure previous data exists
});
```

### Conflicts Not Detected

**Problem**: Conflicts don't trigger resolution

**Solution**: Enable conflict detection:

```typescript
optimisticUpdate(queryClient, key, id, changes, {
  conflictStrategy: ConflictResolutionStrategy.MANUAL,
  // Will show conflict modal
});
```

### Memory Leaks

**Problem**: Too many updates tracked

**Solution**: Clean up old updates:

```typescript
optimisticUpdateManager.clearOldUpdates(5 * 60 * 1000);
```

### Race Conditions

**Problem**: Concurrent updates cause issues

**Solution**: Updates are automatically queued. To skip queuing:

```typescript
optimisticUpdate(queryClient, key, id, changes, {
  skipQueue: true // Not recommended
});
```

## Performance Considerations

### Update Batching

For multiple updates, use bulk operations:

```typescript
// Instead of multiple single updates
optimisticBulkUpdate(queryClient, key, updates);
```

### Memory Management

Clean up completed updates regularly:

```typescript
// In App.tsx or root component
useEffect(() => {
  const cleanup = setInterval(() => {
    optimisticUpdateManager.clearOldUpdates();
  }, 60000);

  return () => clearInterval(cleanup);
}, []);
```

### Cache Optimization

Use appropriate stale times:

```typescript
// Frequent updates
const { data } = useQuery(key, fetcher, {
  staleTime: 1000 // 1 second
});

// Infrequent updates
const { data } = useQuery(key, fetcher, {
  staleTime: 5 * 60 * 1000 // 5 minutes
});
```

## Support

For issues or questions:

1. Check examples in `optimisticUpdates.examples.ts`
2. Review this README
3. Check console logs for error details
4. Contact the development team

## License

Internal use only - White Cross Healthcare Platform
