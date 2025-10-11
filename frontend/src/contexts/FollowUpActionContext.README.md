# Follow-Up Action Context

Production-grade React Context for managing incident follow-up actions in the White Cross healthcare platform.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [API Reference](#api-reference)
- [Advanced Usage](#advanced-usage)
- [Type Definitions](#type-definitions)
- [Performance Optimization](#performance-optimization)
- [Security & Permissions](#security--permissions)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## Overview

The `FollowUpActionContext` provides a centralized state management solution for incident follow-up actions with the following capabilities:

- **Real-time Updates**: TanStack Query integration for automatic data synchronization
- **Optimistic UI**: Instant feedback on user actions with automatic rollback on errors
- **Advanced Filtering**: Filter by status, priority, assignment, and overdue status
- **Smart Sorting**: Sort by due date, priority, or creation date
- **Overdue Detection**: Automatic detection and alerting for overdue actions
- **Permission Management**: Role-based access control for assignments and edits
- **Statistics**: Real-time statistics for action tracking
- **Type Safety**: Full TypeScript support with strict typing

## Features

### Core Features
- ✅ CRUD operations for follow-up actions
- ✅ Status lifecycle management (Pending → In Progress → Completed/Cancelled)
- ✅ Priority-based action management
- ✅ User assignment and unassignment
- ✅ Due date tracking with overdue alerts
- ✅ Advanced filtering and sorting
- ✅ Real-time statistics

### Advanced Features
- ✅ Optimistic UI updates
- ✅ Automatic query invalidation
- ✅ Permission-based action controls
- ✅ Overdue severity levels (warning/critical)
- ✅ Auto-refresh capability
- ✅ Error handling and recovery
- ✅ Loading state management

## Installation

The context is already part of the White Cross frontend. To use it in your component:

```tsx
import { FollowUpActionProvider, useFollowUpActions } from '@/contexts/FollowUpActionContext';
```

## Basic Usage

### 1. Setup Provider

Wrap your component tree with the `FollowUpActionProvider`:

```tsx
import { FollowUpActionProvider } from '@/contexts/FollowUpActionContext';

function App() {
  return (
    <FollowUpActionProvider
      initialIncidentId="incident-123"
      refreshInterval={60000} // Refresh every 60 seconds
      autoNotifyOverdue={true}
    >
      <YourComponents />
    </FollowUpActionProvider>
  );
}
```

### 2. Use the Hook

Access context methods and state in any child component:

```tsx
import { useFollowUpActions } from '@/contexts/FollowUpActionContext';

function FollowUpActionsList() {
  const {
    actions,
    isLoading,
    error,
    loadFollowUpActions,
  } = useFollowUpActions();

  useEffect(() => {
    loadFollowUpActions('incident-123');
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {actions.map(action => (
        <li key={action.id}>{action.action}</li>
      ))}
    </ul>
  );
}
```

## API Reference

### Provider Props

```typescript
interface FollowUpActionProviderProps {
  children: React.ReactNode;
  initialIncidentId?: string;      // Optional incident ID to load on mount
  refreshInterval?: number;         // Auto-refresh interval in milliseconds
  autoNotifyOverdue?: boolean;      // Enable automatic overdue notifications
}
```

### Context State

```typescript
interface FollowUpActionContextState {
  // Data
  actions: FollowUpAction[];              // Filtered and sorted actions
  selectedAction: FollowUpAction | null;  // Currently selected action
  overdueActions: OverdueAlert[];         // Actions past due date

  // Loading States
  isLoading: boolean;                     // Initial data loading
  isCreating: boolean;                    // Creating new action
  isUpdating: boolean;                    // Updating existing action
  isDeleting: boolean;                    // Deleting action

  // Error State
  error: Error | null;

  // Filters
  filters: ActionFilters;                 // Current filter configuration
  sortBy: 'dueDate' | 'priority' | 'createdAt';
  sortOrder: 'asc' | 'desc';

  // Statistics
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    overdue: number;
  };
}
```

### Context Methods

#### Data Loading

```typescript
// Load actions for a specific incident
loadFollowUpActions(incidentId: string): Promise<void>

// Refresh current actions
refreshActions(): Promise<void>
```

#### CRUD Operations

```typescript
// Create a new follow-up action
createFollowUpAction(data: CreateFollowUpActionRequest): Promise<FollowUpAction>

// Update an existing action
updateFollowUpAction(id: string, data: UpdateFollowUpActionRequest): Promise<FollowUpAction>

// Delete an action
deleteFollowUpAction(id: string): Promise<void>
```

#### Status Management

```typescript
// Update action status with optional notes
updateActionStatus(id: string, status: ActionStatus, notes?: string): Promise<FollowUpAction>

// Complete an action with notes
completeAction(id: string, notes: string): Promise<FollowUpAction>

// Cancel an action with reason
cancelAction(id: string, reason: string): Promise<FollowUpAction>
```

#### Assignment

```typescript
// Assign action to a user (requires permissions)
assignAction(id: string, userId: string): Promise<FollowUpAction>

// Unassign action
unassignAction(id: string): Promise<FollowUpAction>
```

#### Selection

```typescript
// Set selected action
setSelectedAction(action: FollowUpAction | null): void

// Clear selection
clearSelectedAction(): void
```

#### Filtering and Sorting

```typescript
// Set filters
setFilters(filters: Partial<ActionFilters>): void

// Clear all filters
clearFilters(): void

// Set sort field
setSortBy(field: 'dueDate' | 'priority' | 'createdAt'): void

// Set sort order
setSortOrder(order: 'asc' | 'desc'): void
```

#### Utilities

```typescript
// Get overdue actions with alert information
getOverdueActions(): OverdueAlert[]

// Get actions by status
getActionsByStatus(status: ActionStatus): FollowUpAction[]

// Get actions by priority
getActionsByPriority(priority: ActionPriority): FollowUpAction[]

// Check if action is overdue
isActionOverdue(action: FollowUpAction): boolean

// Check if user can assign action
canAssignAction(action: FollowUpAction): boolean

// Check if user can edit action
canEditAction(action: FollowUpAction): boolean
```

## Advanced Usage

### Filtering Actions

```tsx
function FilteredActionsList() {
  const { actions, setFilters, clearFilters } = useFollowUpActions();

  return (
    <div>
      <button onClick={() => setFilters({ status: [ActionStatus.PENDING] })}>
        Show Pending
      </button>
      <button onClick={() => setFilters({ assignedToMe: true })}>
        Show My Actions
      </button>
      <button onClick={() => setFilters({ overduedOnly: true })}>
        Show Overdue
      </button>
      <button onClick={clearFilters}>
        Clear Filters
      </button>

      <ul>
        {actions.map(action => (
          <li key={action.id}>{action.action}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Creating Actions

```tsx
function CreateActionForm() {
  const { createFollowUpAction, isCreating } = useFollowUpActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createFollowUpAction({
        incidentReportId: 'incident-123',
        action: 'Follow up with parent',
        priority: ActionPriority.HIGH,
        dueDate: new Date(Date.now() + 86400000).toISOString(),
        assignedTo: 'user-456',
      });

      alert('Action created successfully!');
    } catch (error) {
      console.error('Failed to create action:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isCreating}>
        {isCreating ? 'Creating...' : 'Create Action'}
      </button>
    </form>
  );
}
```

### Overdue Action Alerts

```tsx
function OverdueAlerts() {
  const { overdueActions } = useFollowUpActions();

  const criticalActions = overdueActions.filter(a => a.severity === 'critical');
  const warningActions = overdueActions.filter(a => a.severity === 'warning');

  return (
    <div>
      {criticalActions.length > 0 && (
        <div className="alert alert-critical">
          <h3>Critical: {criticalActions.length} actions overdue</h3>
          <ul>
            {criticalActions.map(alert => (
              <li key={alert.action.id}>
                {alert.action.action} - {alert.daysOverdue} days overdue
              </li>
            ))}
          </ul>
        </div>
      )}

      {warningActions.length > 0 && (
        <div className="alert alert-warning">
          <h3>Warning: {warningActions.length} actions overdue</h3>
          <ul>
            {warningActions.map(alert => (
              <li key={alert.action.id}>
                {alert.action.action} - {alert.daysOverdue} days overdue
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Statistics Dashboard

```tsx
function ActionStatistics() {
  const { stats } = useFollowUpActions();

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Total Actions</h3>
        <p>{stats.total}</p>
      </div>
      <div className="stat-card">
        <h3>Pending</h3>
        <p>{stats.pending}</p>
      </div>
      <div className="stat-card">
        <h3>In Progress</h3>
        <p>{stats.inProgress}</p>
      </div>
      <div className="stat-card">
        <h3>Completed</h3>
        <p>{stats.completed}</p>
      </div>
      <div className="stat-card overdue">
        <h3>Overdue</h3>
        <p>{stats.overdue}</p>
      </div>
    </div>
  );
}
```

## Type Definitions

### ActionFilters

```typescript
interface ActionFilters {
  status?: ActionStatus[];          // Filter by one or more statuses
  priority?: ActionPriority[];      // Filter by one or more priorities
  assignedToMe?: boolean;           // Show only actions assigned to current user
  overduedOnly?: boolean;           // Show only overdue actions
  incidentReportId?: string;        // Filter by incident ID
}
```

### OverdueAlert

```typescript
interface OverdueAlert {
  action: FollowUpAction;           // The overdue action
  daysOverdue: number;              // Number of days past due date
  severity: 'warning' | 'critical'; // Alert severity level
}
```

### ActionStatus Enum

```typescript
enum ActionStatus {
  PENDING = 'PENDING',              // Not started
  IN_PROGRESS = 'IN_PROGRESS',      // Currently being worked on
  COMPLETED = 'COMPLETED',          // Finished successfully
  CANCELLED = 'CANCELLED',          // Cancelled with reason
}
```

### ActionPriority Enum

```typescript
enum ActionPriority {
  LOW = 'LOW',                      // Low priority
  MEDIUM = 'MEDIUM',                // Medium priority
  HIGH = 'HIGH',                    // High priority
  URGENT = 'URGENT',                // Urgent - immediate attention required
}
```

## Performance Optimization

### Memoization

The context automatically memoizes computed values using `useMemo`:
- Filtered and sorted actions
- Overdue actions calculation
- Statistics computation

### Query Caching

TanStack Query provides built-in caching with a 30-second stale time:

```typescript
staleTime: 30000, // Data is fresh for 30 seconds
```

### Optimistic Updates

All mutations use optimistic updates for instant UI feedback:

```typescript
onMutate: async ({ id, data }) => {
  // Cancel outgoing refetches
  await queryClient.cancelQueries({ queryKey: QUERY_KEYS.actions() });

  // Snapshot previous value
  const previousActions = queryClient.getQueryData(QUERY_KEYS.actions());

  // Optimistically update UI
  queryClient.setQueryData(QUERY_KEYS.actions(), (old) => {
    // Update logic
  });

  return { previousActions };
},
```

### Best Practices

1. **Use filters instead of manual filtering**: The context handles filtering efficiently
2. **Leverage statistics**: Use computed stats instead of calculating manually
3. **Batch operations**: Group multiple filter/sort changes when possible
4. **Auto-refresh carefully**: Use appropriate refresh intervals (30-60 seconds recommended)

## Security & Permissions

### Permission Checks

The context enforces role-based permissions:

#### Assignment Permissions

Only these roles can assign actions:
- `NURSE`
- `ADMIN`
- `SCHOOL_ADMIN`
- `DISTRICT_ADMIN`

```typescript
const canAssign = canAssignAction(action);
if (canAssign) {
  await assignAction(action.id, userId);
}
```

#### Edit Permissions

Users can edit actions if:
- They are an ADMIN or DISTRICT_ADMIN (can edit any action)
- The action is assigned to them
- The action is unassigned

```typescript
const canEdit = canEditAction(action);
if (canEdit) {
  await updateFollowUpAction(action.id, { status: ActionStatus.IN_PROGRESS });
}
```

### Error Handling

```typescript
try {
  await createFollowUpAction(data);
} catch (error: any) {
  if (error.message.includes('permissions')) {
    // Handle permission error
    alert('You do not have permission to perform this action');
  } else {
    // Handle other errors
    console.error('Operation failed:', error);
  }
}
```

## Testing

### Unit Tests

The context includes comprehensive unit tests covering:
- Initialization
- Data loading and refreshing
- CRUD operations
- Status management
- Filtering and sorting
- Statistics calculation
- Overdue detection
- Permission checks
- Optimistic updates
- Error handling

Run tests:

```bash
npm test FollowUpActionContext.test.tsx
```

### Integration Tests

Example integration test:

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('should create and complete action', async () => {
  render(
    <FollowUpActionProvider initialIncidentId="test-123">
      <ActionManagement />
    </FollowUpActionProvider>
  );

  // Create action
  await userEvent.type(screen.getByLabelText('Action'), 'Test action');
  await userEvent.click(screen.getByText('Create'));

  await waitFor(() => {
    expect(screen.getByText('Test action')).toBeInTheDocument();
  });

  // Complete action
  await userEvent.click(screen.getByText('Complete'));

  await waitFor(() => {
    expect(screen.getByText('COMPLETED')).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Common Issues

#### 1. "must be used within a FollowUpActionProvider"

**Problem**: Using `useFollowUpActions` outside of the provider.

**Solution**: Wrap your component tree with `FollowUpActionProvider`:

```tsx
<FollowUpActionProvider>
  <YourComponent />
</FollowUpActionProvider>
```

#### 2. Actions not loading

**Problem**: Actions list is empty or not loading.

**Solution**: Ensure you call `loadFollowUpActions` with a valid incident ID:

```tsx
useEffect(() => {
  loadFollowUpActions('incident-123');
}, [loadFollowUpActions]);
```

#### 3. Permission denied errors

**Problem**: Cannot assign or edit actions.

**Solution**: Check user permissions using `canAssignAction` and `canEditAction`:

```tsx
if (!canAssignAction(action)) {
  alert('You do not have permission to assign actions');
  return;
}
```

#### 4. Optimistic updates not rolling back

**Problem**: UI shows incorrect state after failed mutation.

**Solution**: The context handles this automatically. If issues persist, check network connectivity and API responses.

#### 5. Stale data after external updates

**Problem**: Actions not reflecting changes made elsewhere.

**Solution**: Manually refresh or reduce refresh interval:

```tsx
// Manual refresh
await refreshActions();

// Or use shorter interval
<FollowUpActionProvider refreshInterval={30000}>
```

### Debug Mode

Enable debug logging:

```tsx
// In your component
useEffect(() => {
  console.log('Current actions:', actions);
  console.log('Filters:', filters);
  console.log('Stats:', stats);
}, [actions, filters, stats]);
```

## Additional Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Context Best Practices](https://react.dev/learn/passing-data-deeply-with-context)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [White Cross API Documentation](../../backend/README.md)

## Support

For issues or questions:
1. Check this documentation
2. Review example code in `FollowUpActionContext.example.tsx`
3. Run unit tests to verify setup
4. Contact the development team

## License

Internal use only - White Cross Healthcare Platform
