# Emergency Domain Configuration Module Breakdown

This document describes the refactoring of the emergency domain configuration from a single large file (1039 lines) into multiple smaller, more maintainable modules.

## File Structure

```
emergency/
├── config.ts                          (114 lines) - Backward compatibility re-exports
├── emergencyQueryKeys.ts              (97 lines)  - Query key factory
├── emergencyCacheConfig.ts            (81 lines)  - Cache timing configuration
├── emergencyTypes.ts                  (96 lines)  - Type re-exports
├── emergencyCacheUtils.ts             (284 lines) - Cache invalidation utilities
├── types/                             - Type definitions subdirectory
│   ├── index.ts                       (63 lines)  - Type exports
│   ├── emergencyUserTypes.ts          (29 lines)  - User and base types
│   ├── emergencyContactTypes.ts       (43 lines)  - Contact types
│   ├── emergencyPlanTypes.ts          (108 lines) - Plan types
│   ├── emergencyIncidentTypes.ts      (131 lines) - Incident types
│   ├── emergencyProcedureTypes.ts     (60 lines)  - Procedure types
│   ├── emergencyResourceTypes.ts      (63 lines)  - Resource types
│   └── emergencyTrainingTypes.ts      (85 lines)  - Training types
└── README.md                          - This file

Total: 1,254 lines (including documentation and re-exports)
Original: 1,039 lines (dense configuration)
```

## Module Breakdown

### 1. emergencyQueryKeys.ts (97 lines)
**Purpose**: Query key factory for TanStack Query cache management

**Exports**:
- `EMERGENCY_QUERY_KEYS` - Hierarchical query key structure

**Key Features**:
- Supports all emergency entities (plans, incidents, contacts, procedures, resources, training)
- List and detail queries with optional filters
- Enables precise cache invalidation

**Usage**:
```typescript
import { EMERGENCY_QUERY_KEYS } from '@/hooks/domains/emergency/emergencyQueryKeys';

const queryKey = EMERGENCY_QUERY_KEYS.incidentDetails('incident-123');
```

### 2. emergencyCacheConfig.ts (81 lines)
**Purpose**: Cache timing configuration for different data types

**Exports**:
- `EMERGENCY_CACHE_CONFIG` - Stale time and cache time constants

**Key Features**:
- Real-time data (incidents): 2-minute stale time
- Static data (procedures): 1-hour stale time
- Balanced caching for other entities

**Usage**:
```typescript
import { EMERGENCY_CACHE_CONFIG } from '@/hooks/domains/emergency/emergencyCacheConfig';

useQuery({
  queryKey: ['incident', id],
  staleTime: EMERGENCY_CACHE_CONFIG.INCIDENTS_STALE_TIME,
});
```

### 3. emergencyTypes.ts (96 lines)
**Purpose**: Consolidated type re-exports for convenience

**Exports**: All emergency domain types

**Key Features**:
- Single import point for all types
- Delegates to types/ subdirectory
- Maintains backward compatibility

**Usage**:
```typescript
import { EmergencyPlan, EmergencyIncident } from '@/hooks/domains/emergency/emergencyTypes';
```

### 4. emergencyCacheUtils.ts (284 lines)
**Purpose**: Cache invalidation utility functions

**Exports**:
- `invalidateEmergencyPlansQueries()`
- `invalidateIncidentsQueries()`
- `invalidateContactsQueries()`
- `invalidateProceduresQueries()`
- `invalidateResourcesQueries()`
- `invalidateTrainingQueries()`
- `invalidateAllEmergencyQueries()`

**Key Features**:
- Targeted cache invalidation after mutations
- Comprehensive documentation for each function
- Performance optimization guidance

**Usage**:
```typescript
import { invalidateIncidentsQueries } from '@/hooks/domains/emergency/emergencyCacheUtils';

onSuccess: () => {
  invalidateIncidentsQueries(queryClient);
}
```

### 5. types/ Subdirectory
**Purpose**: Modular type definitions for better organization

#### types/emergencyUserTypes.ts (29 lines)
- `EmergencyUser` - User information
- `ContactAvailability` - Base availability type (shared)

#### types/emergencyContactTypes.ts (43 lines)
- `EmergencyContact` - Contact details
- `ContactAddress` - Address structure

#### types/emergencyPlanTypes.ts (108 lines)
- `EmergencyPlan` - Emergency response plans
- `EmergencyPlanCategory` - Plan categories
- `EscalationLevel` - Escalation hierarchy
- `EscalationRule` - Escalation rules
- `CommunicationStep` - Communication workflow
- `RecoveryStep` - Recovery procedures

#### types/emergencyIncidentTypes.ts (131 lines)
- `EmergencyIncident` - Incident tracking
- `IncidentType` - Incident classification
- `IncidentLocation` - Location details
- `IncidentTimelineEntry` - Timeline events
- `IncidentCommunication` - Communication logs
- `IncidentDamage` - Damage assessment

#### types/emergencyProcedureTypes.ts (60 lines)
- `EmergencyProcedure` - Procedure definitions
- `ProcedureStep` - Individual steps
- `ChecklistItem` - Checklist items
- `ProcedureDocument` - Procedure documents

#### types/emergencyResourceTypes.ts (63 lines)
- `EmergencyResource` - Resource tracking
- `ResourceType` - Resource types
- `MaintenanceSchedule` - Maintenance schedules
- `ResourceSupplier` - Supplier information

#### types/emergencyTrainingTypes.ts (85 lines)
- `EmergencyTraining` - Training programs
- `TrainingFrequency` - Training frequency
- `TrainingModule` - Training modules
- `TrainingActivity` - Training activities
- `TrainingMaterial` - Training materials
- `TrainingAssessment` - Assessments
- `AssessmentQuestion` - Assessment questions

### 6. config.ts (114 lines)
**Purpose**: Backward compatibility layer

**Exports**: Re-exports everything from modular files

**Key Features**:
- Maintains existing import paths
- Marked as deprecated for new code
- Zero breaking changes for existing code

**Usage** (legacy):
```typescript
import { EMERGENCY_QUERY_KEYS, EmergencyPlan } from '@/hooks/domains/emergency/config';
```

## Migration Guide

### For Existing Code
No changes required! All existing imports continue to work:

```typescript
// Still works perfectly
import { EMERGENCY_QUERY_KEYS, EMERGENCY_CACHE_CONFIG } from '@/hooks/domains/emergency/config';
import type { EmergencyPlan } from '@/hooks/domains/emergency/config';
```

### For New Code
Prefer importing from specific modules for better tree-shaking:

```typescript
// Better for tree-shaking
import { EMERGENCY_QUERY_KEYS } from '@/hooks/domains/emergency/emergencyQueryKeys';
import { EMERGENCY_CACHE_CONFIG } from '@/hooks/domains/emergency/emergencyCacheConfig';
import type { EmergencyPlan } from '@/hooks/domains/emergency/types/emergencyPlanTypes';
```

Or use the convenience exports:

```typescript
// Convenient but includes all types
import type { EmergencyPlan } from '@/hooks/domains/emergency/emergencyTypes';
```

## Benefits

### Maintainability
- **Smaller Files**: Each file is under 300 lines (target achieved)
- **Clear Separation**: Query keys, cache config, types, and utils are separate
- **Focused Modules**: Each module has a single, clear responsibility

### Developer Experience
- **Easier Navigation**: Find what you need quickly
- **Better IntelliSense**: Faster IDE performance with smaller files
- **Clear Documentation**: Each module has comprehensive JSDoc

### Performance
- **Tree-Shaking**: Import only what you need
- **Faster Compilation**: TypeScript compiles smaller files faster
- **Better Caching**: Build tools can cache modules independently

### Type Safety
- **No Circular Dependencies**: Types organized to avoid circular imports
- **Clear Type Hierarchy**: User types → Contact types → Plan/Incident types
- **Compile-Time Verification**: All modules TypeScript strict mode compatible

## Verification

All files have been verified to:
1. ✅ Be under 300 lines of code
2. ✅ Compile without TypeScript errors
3. ✅ Maintain backward compatibility
4. ✅ Have no circular dependencies
5. ✅ Include comprehensive documentation

## Testing

To verify the refactoring:

```bash
# TypeScript compilation
npx tsc --noEmit --skipLibCheck src/hooks/domains/emergency/**/*.ts

# Line counts
wc -l src/hooks/domains/emergency/**/*.ts

# Import verification
grep -r "from.*emergency" src/ | grep -v node_modules
```

## Future Improvements

1. **Further Modularization**: If any file exceeds 300 lines in the future, split it further
2. **Type Guards**: Add runtime type validation utilities
3. **Constants**: Extract magic numbers and strings to constants files
4. **Validation Schemas**: Add Zod or Yup schemas for runtime validation
5. **Test Coverage**: Add unit tests for cache utilities and type guards

## Questions & Support

For questions about this refactoring or the emergency domain:
- See the module documentation in each file
- Review the examples in JSDoc comments
- Check the main index.ts for available exports
