# Redux Store Architecture Documentation

## Overview

This document provides comprehensive documentation for the enterprise-grade Redux architecture implemented in the White Cross healthcare platform. The architecture provides TypeScript-safe state management with standardized patterns, healthcare compliance features, and advanced enterprise capabilities.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Directory Structure](#directory-structure)
3. [Core Components](#core-components)
4. [Usage Guide](#usage-guide)
5. [Best Practices](#best-practices)
6. [Advanced Features](#advanced-features)

## Architecture Overview

### Key Features

- ✅ **Centralized State Management**: Single Redux store with modular slices
- ✅ **TypeScript Safety**: Full type coverage with IntelliSense support
- ✅ **Standardized Patterns**: Consistent entity management across domains
- ✅ **Healthcare Compliance**: HIPAA-compliant state handling with audit trails
- ✅ **Performance Optimized**: Memoized selectors and normalized state
- ✅ **Advanced Features**: Analytics, bulk operations, workflow orchestration
- ✅ **State Persistence**: Cross-tab synchronization with HIPAA compliance

### Technology Stack

- **Redux Toolkit v2.9.1**: Modern Redux with RTK Query
- **TypeScript**: Full type safety and IntelliSense support
- **React Query v5.90.5**: Server state management (hybrid approach)
- **Immer**: Immutable state updates
- **React Hot Toast**: User feedback for errors and notifications

## Directory Structure

```
stores/
├── index.ts                              # Central export module
├── reduxStore.ts                         # Store configuration
├── README.md                             # This documentation
│
├── slices/                               # Redux slices (domain-specific)
│   ├── authSlice.ts                      # Authentication and authorization
│   ├── incidentReportsSlice.ts           # Incident reporting
│   ├── studentsSlice.ts                  # Student management
│   ├── medicationsSlice.ts               # Medication management
│   ├── appointmentsSlice.ts              # Appointment scheduling
│   ├── healthRecordsSlice.ts             # Health records
│   ├── communicationSlice.ts             # Messages and notifications
│   ├── documentsSlice.ts                 # Document management
│   ├── emergencyContactsSlice.ts         # Emergency contacts
│   ├── inventorySlice.ts                 # Inventory management
│   ├── reportsSlice.ts                   # Analytics and reporting
│   ├── settingsSlice.ts                  # System settings
│   ├── usersSlice.ts                     # User management
│   ├── districtsSlice.ts                 # District management
│   └── schoolsSlice.ts                   # School management
│
├── hooks/                                # React hooks for Redux
│   ├── index.ts                          # Central hook exports
│   ├── domainHooks.ts                    # Auth & incidents hooks
│   └── advancedHooks.ts                  # Analytics & enterprise hooks
│
├── types/                                # TypeScript type definitions
│   └── entityTypes.ts                    # Entity interfaces and types
│
├── analytics/                            # Analytics engine
│   └── analyticsEngine.ts                # Health metrics and trends
│
├── api/                                  # API integration
│   └── advancedApiIntegration.ts         # RTK Query endpoints
│
├── enterprise/                           # Enterprise features
│   └── enterpriseFeatures.ts             # Bulk ops, audit, sync
│
├── orchestration/                        # Workflow orchestration
│   └── crossDomainOrchestration.ts       # Multi-domain workflows
│
├── workflows/                            # Specific workflow implementations
│   ├── emergencyWorkflows.ts             # Emergency procedures
│   └── medicationWorkflows.ts            # Medication workflows
│
├── utils/                                # Utility modules
│   ├── sliceFactory.ts                   # Entity slice factory
│   ├── selectorUtils.ts                  # Selector utilities
│   ├── errorHandling.ts                  # Error handling
│   ├── normalizationUtils.ts             # State normalization
│   ├── optimisticUpdates.ts              # Optimistic UI updates
│   ├── enhancedThunks.ts                 # Advanced async thunks
│   └── advancedSelectors.ts              # Complex selectors
│
└── authStore.ts                          # Legacy auth store (Zustand)
```

## Core Components

### 1. Redux Store (`reduxStore.ts`)

The central store configuration with:
- All domain slices combined
- State persistence middleware
- Cross-tab synchronization
- HIPAA-compliant data handling
- Development tools integration

```typescript
import { store } from '@/stores';
import type { RootState, AppDispatch } from '@/stores';
```

### 2. Hooks (`hooks/`)

#### Core Hooks (`hooks/index.ts`)
```typescript
import { useAppDispatch, useAppSelector } from '@/stores';

// Entity management
import { useEntityState, useEntityById, useFilteredEntities } from '@/stores';

// Utility hooks
import { useMemoizedSelector, useDebouncedSelector } from '@/stores';
```

#### Domain Hooks (`hooks/domainHooks.ts`)
```typescript
// Authentication
import { useCurrentUser, useIsAuthenticated, useAuthActions } from '@/stores';

// Incident Reports
import { useIncidentReports, useIncidentActions } from '@/stores';
```

#### Advanced Hooks (`hooks/advancedHooks.ts`)
```typescript
// Analytics
import { useHealthMetrics, useTrendAnalysis } from '@/stores';

// Enterprise features
import { useBulkOperations, useAuditTrail } from '@/stores';

// Workflows
import { useWorkflowExecution } from '@/stores';
```

### 3. Entity Types (`types/entityTypes.ts`)

Standard interfaces for consistent entity management:

```typescript
// Base entity with timestamps
interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

// Healthcare-specific with audit trails
interface HealthcareEntity extends BaseEntity {
  auditTrail: AuditEntry[];
  hipaaFlags: HIPAAFlags;
  complianceMetadata: ComplianceMetadata;
}

// Standard state structure
interface StandardEntityState<T extends BaseEntity> {
  entities: Record<string, T>;
  ids: string[];
  loading: LoadingStates;
  pagination: PaginationState;
  // ...additional state
}
```

### 4. Slice Factory (`sliceFactory.ts`)

Reusable factory for creating consistent Redux slices:

```typescript
import { createEntitySlice } from '@/stores/sliceFactory';

const studentsSlice = createEntitySlice<Student>('students', {
  initialSort: { field: 'lastName', direction: 'asc' },
  defaultFilters: { active: true },
  auditingEnabled: true,
});
```

## Usage Guide

### Importing from Stores

**Always import from the central index:**

```typescript
// ✅ GOOD - Import from central index
import { useAppDispatch, useAppSelector, useAuthActions } from '@/stores';
import type { RootState, AppDispatch } from '@/stores';

// ❌ BAD - Don't import from nested paths
import { useAppDispatch } from '@/stores/hooks/index';
import { useAuthActions } from '@/stores/hooks/domainHooks';
```

### Using Hooks in Components

```typescript
import React from 'react';
import { useAppDispatch, useAppSelector, useAuthActions } from '@/stores';

export const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { login } = useAuthActions();
  const isLoading = useAppSelector(state => state.auth.isLoading);

  const handleSubmit = async (credentials) => {
    await login(credentials);
  };

  // Component implementation...
};
```

### Entity Management

```typescript
import {
  useEntityById,
  useFilteredEntities,
  useAppDispatch
} from '@/stores';
import { fetchStudents } from '@/stores/slices/studentsSlice';

// Get single entity
const student = useEntityById(
  state => state.students,
  studentId
);

// Get filtered entities
const activeStudents = useFilteredEntities(
  state => state.students,
  (student) => student.isActive,
  (a, b) => a.lastName.localeCompare(b.lastName)
);

// Fetch data
const dispatch = useAppDispatch();
useEffect(() => {
  dispatch(fetchStudents({ active: true }));
}, [dispatch]);
```

### Selectors

```typescript
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/stores';

// Memoized selector
const selectActiveStudentsWithMedications = createSelector(
  [
    (state: RootState) => state.students,
    (state: RootState) => state.medications,
  ],
  (students, medications) => {
    return students.ids
      .map(id => students.entities[id])
      .filter(student =>
        student?.isActive &&
        medications.ids.some(medId =>
          medications.entities[medId]?.studentId === student.id
        )
      );
  }
);
```

## Best Practices

### 1. Type Safety

Always use typed hooks and selectors:

```typescript
// ✅ GOOD
const user = useAppSelector((state: RootState) => state.auth.user);

// ❌ BAD
const user = useSelector(state => state.auth.user);
```

### 2. Healthcare Compliance

- Never persist PHI in localStorage without encryption
- Use audit trails for all data modifications
- Implement proper access control checks
- Follow HIPAA guidelines for data handling

```typescript
// Example: Audit trail for updates
dispatch(updateHealthRecord({
  id: recordId,
  updates: newData,
  audit: {
    userId: currentUser.id,
    action: 'UPDATE',
    timestamp: new Date().toISOString(),
    reason: 'Medical information update',
  }
}));
```

### 3. Performance

- Use memoized selectors for expensive computations
- Implement pagination for large datasets
- Debounce user inputs to reduce Redux updates
- Normalize data to avoid duplication

```typescript
// Memoized expensive selector
const expensiveData = useMemoizedSelector(
  (state) => computeExpensiveData(state),
  [/* dependencies */]
);

// Debounced search
const debouncedQuery = useDebouncedSelector(
  (state) => state.search.query,
  500 // 500ms debounce
);
```

### 4. Error Handling

Always handle errors gracefully:

```typescript
const { createStudent } = useStudentActions();

const handleCreate = async (data) => {
  try {
    await createStudent(data).unwrap();
    toast.success('Student created successfully');
  } catch (error) {
    toast.error(error.message || 'Failed to create student');
    console.error('Create student error:', error);
  }
};
```

## Advanced Features

### Analytics Engine

Real-time health metrics and trend analysis:

```typescript
import { useHealthMetrics, useTrendAnalysis } from '@/stores';

const { metrics, refresh } = useHealthMetrics(
  { schoolId: currentSchool.id },
  30000 // Refresh every 30 seconds
);

const trends = useTrendAnalysis({
  type: 'medication_adherence',
  timeRange: '30d',
});
```

### Bulk Operations

Execute operations on multiple entities:

```typescript
import { useBulkOperations } from '@/stores';

const { executeBulk, rollback } = useBulkOperations();

await executeBulk({
  operation: 'update',
  entityType: 'students',
  ids: selectedStudentIds,
  updates: { status: 'inactive' },
});
```

### Workflow Orchestration

Multi-step cross-domain workflows:

```typescript
import { useWorkflowExecution } from '@/stores';

const { execute } = useWorkflowExecution();

await execute('student_enrollment', {
  studentData,
  emergencyContacts,
  healthRecords,
});
```

### Audit Trails

Track all data modifications:

```typescript
import { useAuditTrail } from '@/stores';

const { queryAudit } = useAuditTrail();

const auditHistory = await queryAudit({
  entityType: 'health_records',
  entityId: recordId,
  dateRange: { from: '2025-01-01', to: '2025-01-31' },
});
```

## Migration Notes

### From Legacy Code

If migrating from older Redux patterns:

1. Replace `useSelector` with `useAppSelector`
2. Replace `useDispatch` with `useAppDispatch`
3. Use domain hooks instead of direct selectors
4. Update imports to use central `@/stores` index
5. Adopt entity slice factory for new slices

### Breaking Changes

- Removed `reduxStore.phase1.ts` - use `reduxStore.ts`
- Removed `hooks.phase1.ts` - use `hooks/index.ts`
- Removed `hooks/reduxHooks.ts` - use `hooks/domainHooks.ts`
- Renamed `phase3Hooks.ts` to `advancedHooks.ts`
- Renamed `phase3ApiIntegration.ts` to `advancedApiIntegration.ts`

## Support

For questions or issues:

1. Check this documentation
2. Review example implementations in `slices/`
3. Consult the troubleshooting section in original README
4. Contact the development team

---

**White Cross Redux Architecture v2.0** - Enterprise healthcare platform with TypeScript safety, HIPAA compliance, and advanced features.
