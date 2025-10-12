# Complete Integration Documentation

## Overview

This document provides a comprehensive overview of all state management and routing features integrated into the White Cross healthcare platform. These features form the backbone of enterprise-grade state management, authentication, data fetching, and navigation guard systems.

## Table of Contents

- [Integration Summary](#integration-summary)
- [Architecture Overview](#architecture-overview)
- [Redux Integration](#redux-integration)
- [Context API Integration](#context-api-integration)
- [Navigation Guards](#navigation-guards)
- [File Structure](#file-structure)
- [Migration Guide](#migration-guide)
- [Related Documentation](#related-documentation)

---

## Integration Summary

### Completed Features

1. **Redux Store with Incident Reports Management** (Complete)
   - Centralized state management using Redux Toolkit
   - Incident reports slice with full CRUD operations
   - Witness statements and follow-up actions support
   - Optimistic updates and normalized state structure

2. **Context API Integrations** (Complete)
   - Witness Statement Context with TanStack Query
   - Follow-Up Action Context with priority tracking
   - Authentication Context with session management

3. **Navigation Guards System** (Complete)
   - HOC-based route protection
   - Permission checking system
   - Data loading guards
   - Unsaved changes protection

4. **State Persistence** (Complete)
   - Redux DevTools integration
   - Local state management with React hooks
   - Cache invalidation strategies

5. **Optimistic Updates** (Complete)
   - Immediate UI feedback
   - Automatic rollback on errors
   - Query invalidation on success

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Application Layer                         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │    Pages     │  │  Components  │  │     Routes           │ │
│  │              │  │              │  │  (with Guards)       │ │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘ │
│         │                 │                      │              │
└─────────┼─────────────────┼──────────────────────┼──────────────┘
          │                 │                      │
          │                 │                      │
┌─────────┴─────────────────┴──────────────────────┴──────────────┐
│                     State Management Layer                        │
│                                                                  │
│  ┌──────────────────┐  ┌────────────────────┐  ┌─────────────┐ │
│  │   Redux Store    │  │   Context APIs     │  │  TanStack   │ │
│  │                  │  │                    │  │   Query     │ │
│  │  - Incident      │  │  - Witness Stmt    │  │             │ │
│  │    Reports       │  │  - Follow-Up       │  │  - Caching  │ │
│  │  - Auth          │  │  - Authentication  │  │  - Refetch  │ │
│  │                  │  │                    │  │  - Optimist │ │
│  └────────┬─────────┘  └─────────┬──────────┘  └──────┬──────┘ │
│           │                      │                     │         │
└───────────┼──────────────────────┼─────────────────────┼─────────┘
            │                      │                     │
            │                      │                     │
┌───────────┴──────────────────────┴─────────────────────┴─────────┐
│                      Service Layer                                │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  API Services                             │  │
│  │                                                           │  │
│  │  - incidentReportsApi                                    │  │
│  │  - studentsApi                                           │  │
│  │  - medicationsApi                                        │  │
│  │  - healthRecordsApi                                      │  │
│  └──────────────────────────┬───────────────────────────────┘  │
│                             │                                   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Backend API    │
                    │  (REST/HTTP)    │
                    └─────────────────┘
```

---

## Redux Integration

### Store Configuration

**Location:** `frontend/src/stores/reduxStore.ts`

```typescript
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import incidentReportsSlice from './slices/incidentReportsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    incidentReports: incidentReportsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: import.meta.env.DEV,
});
```

### Incident Reports Slice

**Location:** `frontend/src/stores/slices/incidentReportsSlice.ts`

**Key Features:**
- Complete CRUD operations for incident reports
- Witness statements management
- Follow-up actions tracking
- Advanced filtering and search
- Optimistic updates
- Normalized state structure
- Comprehensive error handling

**State Structure:**
```typescript
interface IncidentReportsState {
  reports: IncidentReport[];
  selectedReport: IncidentReport | null;
  witnessStatements: WitnessStatement[];
  followUpActions: FollowUpAction[];
  searchResults: IncidentReport[];
  pagination: PaginationMeta;
  filters: IncidentReportFilters;
  searchQuery: string;
  sortConfig: SortConfig;
  viewMode: ViewMode;
  loading: LoadingStates;
  errors: ErrorStates;
  lastFetched: number | null;
  cacheInvalidated: boolean;
}
```

**Async Thunks:**
- `fetchIncidentReports` - Fetch all reports with filtering
- `fetchIncidentReportById` - Fetch single report
- `createIncidentReport` - Create new report
- `updateIncidentReport` - Update existing report
- `deleteIncidentReport` - Delete report
- `searchIncidentReports` - Search reports
- `fetchWitnessStatements` - Fetch witness statements
- `createWitnessStatement` - Create witness statement
- `fetchFollowUpActions` - Fetch follow-up actions
- `createFollowUpAction` - Create follow-up action

**Selectors:**
- `selectIncidentReports` - All reports
- `selectCurrentIncident` - Selected report
- `selectWitnessStatements` - Witness statements
- `selectFollowUpActions` - Follow-up actions
- `selectFilteredAndSortedReports` - Filtered and sorted reports
- `selectReportStatistics` - Analytics data
- And many more specialized selectors

**Usage Example:**
```typescript
import { useAppDispatch, useAppSelector } from '@/stores/hooks/reduxHooks';
import {
  fetchIncidentReports,
  selectIncidentReports,
  setFilters
} from '@/stores/slices/incidentReportsSlice';

function IncidentReportsList() {
  const dispatch = useAppDispatch();
  const reports = useAppSelector(selectIncidentReports);
  const loading = useAppSelector(state => state.incidentReports.loading.list);

  useEffect(() => {
    dispatch(fetchIncidentReports({ status: 'OPEN' }));
  }, [dispatch]);

  return (
    <div>
      {loading ? <LoadingSpinner /> : (
        reports.map(report => (
          <ReportCard key={report.id} report={report} />
        ))
      )}
    </div>
  );
}
```

---

## Context API Integration

### Witness Statement Context

**Location:** `frontend/src/contexts/WitnessStatementContext.tsx`

**Key Features:**
- Full CRUD operations for witness statements
- TanStack Query integration for caching
- Optimistic UI updates
- Type-safe operations
- Verification status tracking
- Form state management

**API Methods:**
```typescript
const {
  statements,              // List of statements
  isLoading,              // Loading state
  loadWitnessStatements,  // Load statements
  createWitnessStatement, // Create statement
  updateWitnessStatement, // Update statement
  deleteWitnessStatement, // Delete statement
  verifyStatement,        // Mark as verified
  unverifyStatement,      // Mark as unverified
  selectedStatement,      // Selected statement
  setSelectedStatement,   // Select statement
  formState,              // Form data
  setFormState,           // Update form
  refetch,                // Refresh data
} = useWitnessStatements();
```

**Usage Example:**
```typescript
import { WitnessStatementProvider, useWitnessStatements } from '@/contexts/WitnessStatementContext';

// Wrap your component tree
<WitnessStatementProvider>
  <IncidentDetailsPage />
</WitnessStatementProvider>

// Use in components
function WitnessStatementsList() {
  const {
    statements,
    isLoading,
    createWitnessStatement,
    verifyStatement
  } = useWitnessStatements();

  const handleCreate = async (data) => {
    await createWitnessStatement({
      incidentReportId: '123',
      witnessName: 'John Doe',
      witnessType: 'STUDENT',
      statement: 'I saw what happened...',
    });
  };

  return (
    <div>
      {statements.map(statement => (
        <StatementCard
          key={statement.id}
          statement={statement}
          onVerify={() => verifyStatement(statement.id)}
        />
      ))}
    </div>
  );
}
```

**Documentation:**
- README: `frontend/src/contexts/WitnessStatementContext.README.md`
- Architecture: `frontend/src/contexts/WitnessStatementContext.ARCHITECTURE.md`
- Integration: `frontend/src/contexts/WitnessStatementContext.INTEGRATION.md`

### Follow-Up Action Context

**Location:** `frontend/src/contexts/FollowUpActionContext.tsx`

**Key Features:**
- Comprehensive state management for follow-up actions
- Priority-based filtering and sorting
- Overdue action detection and alerts
- Optimistic UI updates
- Permission-based action assignments
- Status tracking and lifecycle management

**API Methods:**
```typescript
const {
  actions,                 // Filtered/sorted actions
  selectedAction,          // Selected action
  overdueActions,          // Overdue actions with alerts
  stats,                   // Statistics
  isLoading,              // Loading state
  loadFollowUpActions,    // Load actions
  createFollowUpAction,   // Create action
  updateFollowUpAction,   // Update action
  deleteFollowUpAction,   // Delete action
  updateActionStatus,     // Update status
  completeAction,         // Mark as complete
  cancelAction,           // Cancel action
  assignAction,           // Assign to user
  unassignAction,         // Unassign
  setFilters,             // Set filters
  setSortBy,              // Set sort field
  canAssignAction,        // Check permissions
  canEditAction,          // Check permissions
} = useFollowUpActions();
```

**Usage Example:**
```typescript
import { FollowUpActionProvider, useFollowUpActions } from '@/contexts/FollowUpActionContext';

// Wrap your component tree
<FollowUpActionProvider
  initialIncidentId="123"
  refreshInterval={60000}
  autoNotifyOverdue={true}
>
  <FollowUpActionsPage />
</FollowUpActionProvider>

// Use in components
function FollowUpActionsList() {
  const {
    actions,
    overdueActions,
    completeAction,
    setFilters,
    stats
  } = useFollowUpActions();

  return (
    <div>
      <ActionStats stats={stats} />
      <OverdueAlerts alerts={overdueActions} />
      <FilterBar onFilter={setFilters} />
      {actions.map(action => (
        <ActionCard
          key={action.id}
          action={action}
          onComplete={(notes) => completeAction(action.id, notes)}
        />
      ))}
    </div>
  );
}
```

**Documentation:**
- README: `frontend/src/contexts/FollowUpActionContext.README.md`
- Architecture: `frontend/src/contexts/FollowUpActionContext.ARCHITECTURE.md`
- Integration Checklist: `frontend/src/contexts/FollowUpActionContext.INTEGRATION_CHECKLIST.md`

---

## Navigation Guards

**Location:** `frontend/src/guards/navigationGuards.tsx`

### Available Guard HOCs

#### 1. Authentication Guard
Ensures user is authenticated before accessing route.

```typescript
import { withAuthGuard } from '@/guards/navigationGuards';

const ProtectedPage = withAuthGuard(MyPage);
```

#### 2. Role Guard
Checks user has required role(s).

```typescript
import { withRoleGuard } from '@/guards/navigationGuards';

const AdminPage = withRoleGuard(['ADMIN', 'SCHOOL_ADMIN'])(MyPage);
```

#### 3. Permission Guard
Validates specific permissions.

```typescript
import { withPermissionGuard } from '@/guards/navigationGuards';

const StudentEditPage = withPermissionGuard([
  { resource: 'students', action: 'update' }
])(MyPage);
```

#### 4. Data Guard
Ensures data is loaded before rendering.

```typescript
import { withDataGuard } from '@/guards/navigationGuards';

const StudentPage = withDataGuard(async (context) => {
  const student = await studentsApi.getById(context.params.id);
  return { student };
})(MyPage);
```

#### 5. Feature Guard
Checks feature flags.

```typescript
import { withFeatureGuard } from '@/guards/navigationGuards';

const BetaPage = withFeatureGuard('beta-features')(MyPage);
```

### Guard Composition

Combine multiple guards:

```typescript
import { composeGuards, withAuthGuard, withRoleGuard, withPermissionGuard } from '@/guards/navigationGuards';

const ProtectedPage = composeGuards([
  withAuthGuard,
  withRoleGuard(['ADMIN']),
  withPermissionGuard([{ resource: 'users', action: 'manage' }])
])(MyPage);
```

### Permission System

**Role-Based Permissions:**

```typescript
// Role hierarchy
ADMIN / DISTRICT_ADMIN: *.*  (all permissions)
SCHOOL_ADMIN: students.*, medications.*, health_records.*, ...
NURSE: students.read/update, medications.*, health_records.*, ...
COUNSELOR: students.read, health_records.read, ...
READ_ONLY: *.read
```

**Check Permissions:**
```typescript
import { checkPermission, checkAllPermissions } from '@/guards/navigationGuards';

if (checkPermission(user, { resource: 'students', action: 'update' })) {
  // Allow edit
}

if (checkAllPermissions(user, [
  { resource: 'students', action: 'update' },
  { resource: 'health_records', action: 'create' }
])) {
  // Allow both operations
}
```

### Unsaved Changes Protection

```typescript
import { useUnsavedChanges, UnsavedChangesPrompt } from '@/guards/navigationGuards';

function MyForm() {
  const {
    hasUnsavedChanges,
    setHasUnsavedChanges,
    showPrompt,
    confirmNavigation,
    cancelNavigation
  } = useUnsavedChanges();

  useEffect(() => {
    setHasUnsavedChanges(formDirty);
  }, [formDirty]);

  return (
    <>
      <form>...</form>
      <UnsavedChangesPrompt
        isOpen={showPrompt}
        onSave={handleSave}
        onDiscard={confirmNavigation}
        onCancel={cancelNavigation}
      />
    </>
  );
}
```

**Documentation:**
- README: `frontend/src/guards/README.md`
- Summary: `frontend/src/guards/SUMMARY.md`
- Quick Reference: `frontend/src/guards/QUICK_REFERENCE.md`
- Implementation Checklist: `frontend/src/guards/IMPLEMENTATION_CHECKLIST.md`

---

## File Structure

```
frontend/src/
├── stores/
│   ├── reduxStore.ts                    # Redux store configuration
│   ├── authStore.ts                     # Legacy auth store
│   ├── hooks/
│   │   └── reduxHooks.ts                # Typed Redux hooks
│   └── slices/
│       ├── authSlice.ts                 # Auth slice
│       ├── incidentReportsSlice.ts      # Incident reports slice
│       ├── incidentReportsSlice.test.ts # Tests
│       ├── incidentReportsSlice.example.ts # Examples
│       └── INCIDENT_REPORTS_SLICE_README.md # Documentation
│
├── contexts/
│   ├── AuthContext.tsx                  # Authentication context
│   ├── WitnessStatementContext.tsx      # Witness statements context
│   ├── WitnessStatementContext.test.tsx # Tests
│   ├── WitnessStatementContext.example.tsx # Examples
│   ├── WitnessStatementContext.README.md # Documentation
│   ├── WitnessStatementContext.ARCHITECTURE.md # Architecture
│   ├── WitnessStatementContext.INTEGRATION.md # Integration guide
│   ├── WitnessStatementContext.QUICKREF.md # Quick reference
│   ├── FollowUpActionContext.tsx        # Follow-up actions context
│   ├── FollowUpActionContext.test.tsx   # Tests
│   ├── FollowUpActionContext.example.tsx # Examples
│   ├── FollowUpActionContext.README.md  # Documentation
│   ├── FollowUpActionContext.ARCHITECTURE.md # Architecture
│   └── FollowUpActionContext.INTEGRATION_CHECKLIST.md # Checklist
│
├── guards/
│   ├── navigationGuards.tsx             # Navigation guards
│   ├── navigationGuards.test.tsx        # Tests
│   ├── navigationGuards.examples.tsx    # Examples
│   ├── integration.example.tsx          # Integration examples
│   ├── index.ts                         # Exports
│   ├── README.md                        # Documentation
│   ├── SUMMARY.md                       # Summary
│   ├── QUICK_REFERENCE.md              # Quick reference
│   └── IMPLEMENTATION_CHECKLIST.md      # Implementation checklist
│
├── services/
│   ├── modules/
│   │   └── incidentReportsApi.ts       # Incident reports API
│   └── index.ts                         # Service exports
│
├── types/
│   ├── incidents.ts                     # Incident types
│   ├── index.ts                         # Type exports
│   └── ...                              # Other type files
│
├── App.tsx                               # Main app component
├── main.tsx                              # App entry point
│
├── INTEGRATION_COMPLETE.md              # This file
├── STATE_MANAGEMENT_ARCHITECTURE.md     # Architecture guide
├── TESTING_GUIDE.md                     # Testing guide
└── QUICK_START.md                       # Quick start guide
```

---

## Migration Guide

### From Direct API Calls to Redux

**Before:**
```typescript
function IncidentReportsList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const data = await incidentReportsApi.getAll();
        setReports(data.reports);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return <div>{/* render reports */}</div>;
}
```

**After:**
```typescript
import { useAppDispatch, useAppSelector } from '@/stores/hooks/reduxHooks';
import {
  fetchIncidentReports,
  selectIncidentReports,
  selectIsLoading
} from '@/stores/slices/incidentReportsSlice';

function IncidentReportsList() {
  const dispatch = useAppDispatch();
  const reports = useAppSelector(selectIncidentReports);
  const loading = useAppSelector(selectIsLoading('list'));

  useEffect(() => {
    dispatch(fetchIncidentReports());
  }, [dispatch]);

  return <div>{/* render reports */}</div>;
}
```

**Benefits:**
- Centralized state management
- Automatic caching
- Built-in loading states
- Error handling
- Redux DevTools integration

### From Local State to Context

**Before:**
```typescript
function WitnessStatementsList({ incidentId }) {
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadStatements = async () => {
    setLoading(true);
    try {
      const data = await incidentReportsApi.getWitnessStatements(incidentId);
      setStatements(data.statements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatements();
  }, [incidentId]);

  return <div>{/* render statements */}</div>;
}
```

**After:**
```typescript
import { useWitnessStatements } from '@/contexts/WitnessStatementContext';

function WitnessStatementsList({ incidentId }) {
  const { statements, isLoading, loadWitnessStatements } = useWitnessStatements();

  useEffect(() => {
    loadWitnessStatements(incidentId);
  }, [incidentId, loadWitnessStatements]);

  return <div>{/* render statements */}</div>;
}
```

**Benefits:**
- Shared state across components
- TanStack Query caching
- Optimistic updates
- Automatic refetching
- Type-safe operations

### Adding Navigation Guards

**Before:**
```typescript
function StudentEditPage() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (user.role !== 'ADMIN' && user.role !== 'NURSE') {
    return <AccessDenied />;
  }

  return <div>{/* edit form */}</div>;
}
```

**After:**
```typescript
import { composeGuards, withAuthGuard, withRoleGuard } from '@/guards/navigationGuards';

const StudentEditPage = composeGuards([
  withAuthGuard,
  withRoleGuard(['ADMIN', 'NURSE'])
])(function StudentEditPage() {
  return <div>{/* edit form */}</div>;
});

export default StudentEditPage;
```

**Benefits:**
- Declarative route protection
- Reusable guard logic
- Automatic redirects
- Consistent error handling
- Better separation of concerns

---

## Related Documentation

### Core Documentation
- [State Management Architecture](./STATE_MANAGEMENT_ARCHITECTURE.md)
- [Testing Guide](./TESTING_GUIDE.md)
- [Quick Start Guide](./QUICK_START.md)

### Feature Documentation
- [Incident Reports Slice](./stores/slices/INCIDENT_REPORTS_SLICE_README.md)
- [Witness Statement Context](./contexts/WitnessStatementContext.README.md)
- [Follow-Up Action Context](./contexts/FollowUpActionContext.README.md)
- [Navigation Guards](./guards/README.md)

### Implementation Guides
- [Navigation Guards Implementation Checklist](./guards/IMPLEMENTATION_CHECKLIST.md)
- [Witness Statement Integration Guide](./contexts/WitnessStatementContext.INTEGRATION.md)
- [Follow-Up Action Integration Checklist](./contexts/FollowUpActionContext.INTEGRATION_CHECKLIST.md)

### Quick References
- [Navigation Guards Quick Reference](./guards/QUICK_REFERENCE.md)
- [Witness Statement Quick Reference](./contexts/WitnessStatementContext.QUICKREF.md)

### Project Documentation
- [Project README](../README.md)
- [CLAUDE.md](../../CLAUDE.md)
- [CHANGELOG.md](../../CHANGELOG.md)

---

## Summary

This integration provides a robust, enterprise-grade foundation for state management, data fetching, and navigation control in the White Cross platform. Key highlights:

1. **Redux Store**: Centralized state for incident reports with comprehensive CRUD operations
2. **Context APIs**: Specialized state management for witness statements and follow-up actions
3. **Navigation Guards**: Declarative route protection with permission checking
4. **Optimistic Updates**: Immediate UI feedback with automatic rollback
5. **Type Safety**: Full TypeScript integration throughout
6. **Testing Support**: Comprehensive test coverage and examples
7. **Developer Experience**: Extensive documentation and examples

For questions or support, refer to the related documentation or consult the development team.

---

**Last Updated:** October 11, 2025
**Version:** 1.0.0
