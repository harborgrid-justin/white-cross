# Emergency Mutations

This directory contains React Query mutation hooks for all emergency management operations.

## Quick Start

```typescript
// Import individual hooks
import { useCreateEmergencyPlan } from './hooks/domains/emergency/mutations';

// Or import from specific domain
import { useCreateEmergencyPlan } from './hooks/domains/emergency/mutations/useEmergencyPlanMutations';

// Or use the combined object
import { emergencyMutations } from './hooks/domains/emergency/mutations';
const { useCreateEmergencyPlan } = emergencyMutations;
```

## Available Mutations

### Emergency Plans
- `useCreateEmergencyPlan` - Create a new emergency plan
- `useUpdateEmergencyPlan` - Update an existing plan
- `useDeleteEmergencyPlan` - Delete a plan
- `useActivatePlan` - Activate an emergency plan

### Emergency Incidents
- `useCreateIncident` - Report a new incident
- `useUpdateIncident` - Update incident details
- `useCloseIncident` - Close an incident
- `useAddTimelineEntry` - Add an entry to incident timeline

### Emergency Contacts
- `useCreateContact` - Create a new emergency contact
- `useUpdateContact` - Update contact information
- `useDeleteContact` - Delete a contact

### Emergency Procedures
- `useCreateProcedure` - Create a new procedure
- `useUpdateProcedure` - Update procedure details
- `useDeleteProcedure` - Delete a procedure

### Emergency Resources
- `useCreateResource` - Create a new resource
- `useUpdateResource` - Update resource details
- `useDeleteResource` - Delete a resource

### Emergency Training
- `useCreateTraining` - Create a new training program
- `useUpdateTraining` - Update training details
- `useDeleteTraining` - Delete a training program

### Bulk Operations
- `useBulkUpdateIncidents` - Update multiple incidents at once
- `useBulkActivateResources` - Activate multiple resources at once

## Usage Example

```typescript
import { useCreateEmergencyPlan } from './hooks/domains/emergency/mutations';
import { toast } from 'react-hot-toast';

function CreatePlanForm() {
  const createPlan = useCreateEmergencyPlan({
    onSuccess: (newPlan) => {
      console.log('Plan created:', newPlan);
      // Additional success handling
    },
    onError: (error) => {
      // Additional error handling
      console.error('Failed to create plan:', error);
    }
  });

  const handleSubmit = (data) => {
    createPlan.mutate({
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
      priority: data.priority,
      activationCriteria: data.criteria,
      procedures: [],
      contacts: [],
      resources: []
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button
        type="submit"
        disabled={createPlan.isPending}
      >
        {createPlan.isPending ? 'Creating...' : 'Create Plan'}
      </button>
    </form>
  );
}
```

## Type Definitions

All input types are available from the `types.ts` file:

```typescript
import type {
  CreateEmergencyPlanInput,
  UpdateEmergencyPlanInput,
  CreateIncidentInput,
  // ... etc
} from './hooks/domains/emergency/mutations/types';
```

## File Structure

```
mutations/
├── types.ts                          # All input type definitions
├── api/                              # Mock API functions
│   ├── emergencyPlanApi.ts
│   ├── emergencyIncidentApi.ts
│   ├── emergencyContactApi.ts
│   ├── emergencyProcedureApi.ts
│   ├── emergencyResourceApi.ts
│   ├── emergencyTrainingApi.ts
│   ├── bulkOperationApi.ts
│   └── index.ts
├── useEmergencyPlanMutations.ts      # Plan mutation hooks
├── useEmergencyIncidentMutations.ts  # Incident mutation hooks
├── useEmergencyContactMutations.ts   # Contact mutation hooks
├── useEmergencyProcedureMutations.ts # Procedure mutation hooks
├── useEmergencyResourceMutations.ts  # Resource mutation hooks
├── useEmergencyTrainingMutations.ts  # Training mutation hooks
├── useBulkOperationMutations.ts      # Bulk operation hooks
└── index.ts                          # Central exports
```

## Features

- **Type-Safe**: Full TypeScript support with proper type inference
- **Optimistic Updates**: Automatic query cache invalidation
- **Toast Notifications**: Built-in success/error notifications
- **Error Handling**: Consistent error handling across all mutations
- **React Query Integration**: Full integration with @tanstack/react-query
- **Backward Compatible**: All existing imports continue to work

## Cache Invalidation

All mutations automatically invalidate relevant queries:

- Plan mutations → invalidate emergency plans queries
- Incident mutations → invalidate incidents queries
- Contact mutations → invalidate contacts queries
- Procedure mutations → invalidate procedures queries
- Resource mutations → invalidate resources queries
- Training mutations → invalidate training queries

## Testing

See `__tests__/backward-compatibility.test.ts` for comprehensive test coverage ensuring all import methods work correctly.

## Migration from Legacy File

The original `useEmergencyMutations.ts` (1,209 lines) has been refactored into 18 smaller files, each under 300 lines. All exports are maintained for backward compatibility.

### Before (still works):
```typescript
import { useCreateEmergencyPlan } from './hooks/domains/emergency/mutations/useEmergencyMutations';
```

### After (recommended):
```typescript
// From index
import { useCreateEmergencyPlan } from './hooks/domains/emergency/mutations';

// Or from specific module
import { useCreateEmergencyPlan } from './hooks/domains/emergency/mutations/useEmergencyPlanMutations';
```

## Notes

- All mutation hooks use React Query's `useMutation`
- Success/error toast notifications are included by default
- Override default options by passing `UseMutationOptions`
- All mutations include proper TypeScript types
- Mock API functions can be replaced with actual API calls

## Related Documentation

- [Emergency Query Hooks](../queries/README.md) - For reading emergency data
- [Emergency Config](../config.ts) - Query keys and cache utilities
- [React Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
