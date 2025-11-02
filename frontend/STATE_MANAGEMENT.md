# State Management Guide

**Last Updated:** 2025-11-02
**Project:** White Cross Healthcare Platform
**Framework:** Next.js 16, React 19

---

## Table of Contents

1. [Overview](#overview)
2. [Three-Layer Architecture](#three-layer-architecture)
3. [When to Use Each Layer](#when-to-use-each-layer)
4. [Provider Hierarchy](#provider-hierarchy)
5. [Component Patterns](#component-patterns)
6. [File Organization](#file-organization)
7. [Best Practices](#best-practices)
8. [Common Patterns & Examples](#common-patterns--examples)
9. [HIPAA Compliance](#hipaa-compliance)
10. [Troubleshooting](#troubleshooting)

---

## Overview

White Cross uses a **three-layer state management architecture** to handle different types of state efficiently and maintain HIPAA compliance:

1. **Server State** - TanStack Query (React Query)
2. **Client State** - Redux Toolkit
3. **Local State** - React useState/useReducer + React Hook Form

This separation ensures:
- ✅ Clear boundaries between state types
- ✅ Optimal performance (no unnecessary re-renders)
- ✅ HIPAA-compliant data handling (no PHI in browser storage)
- ✅ Type safety with TypeScript
- ✅ Predictable data flow

---

## Three-Layer Architecture

### 1. Server State - TanStack Query

**Purpose**: Manage server data (fetching, caching, synchronization)

**Location**: `src/hooks/domains/*/queries/` and `src/hooks/domains/*/mutations/`

**Use for**:
- Student data
- Health records
- Medications
- Appointments
- Incidents
- Any data from the backend API

**Example**:
```typescript
import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '@/services';

function StudentProfile({ studentId }) {
  const { data: student, isLoading, error } = useQuery({
    queryKey: ['students', studentId],
    queryFn: () => studentsApi.getStudentById(studentId),
    meta: {
      containsPHI: true, // ⚠️ HIPAA: Mark PHI data
      errorMessage: 'Failed to load student data'
    }
  });

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} />;

  return <StudentCard student={student} />;
}
```

**Key Features**:
- Automatic background refetching
- Smart caching with stale-while-revalidate
- Optimistic updates
- Request deduplication
- Automatic retries
- **PHI metadata** for HIPAA compliance

---

### 2. Client State - Redux Toolkit

**Purpose**: Manage client-side UI state, preferences, and non-server data

**Location**: `src/stores/slices/`

**Use for**:
- Authentication state
- User preferences (theme, layout)
- UI state (sidebar collapsed, modal open)
- Filters and sort configuration (that should persist)
- View mode (table vs grid)
- Global application state

**Example**:
```typescript
import { useAppSelector, useAppDispatch } from '@/stores/hooks';
import { setViewMode } from '@/stores/slices/studentsSlice';

function StudentListContainer() {
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector(state => state.students.viewMode);

  const handleViewModeChange = (mode: 'table' | 'grid') => {
    dispatch(setViewMode(mode));
  };

  return (
    <StudentList
      viewMode={viewMode}
      onViewModeChange={handleViewModeChange}
    />
  );
}
```

**Key Features**:
- Predictable state updates (Redux pattern)
- Time-travel debugging (Redux DevTools)
- Selective persistence (localStorage for non-PHI)
- HIPAA-compliant (PHI excluded from storage)
- Audit middleware for sensitive actions

---

### 3. Local State - React useState/Context

**Purpose**: Manage component-specific, temporary state

**Location**: Component files, custom contexts

**Use for**:
- Form input values (with React Hook Form)
- Component-specific toggles (dropdown open/closed)
- Selection state (checkboxes)
- Modal visibility
- Temporary UI state
- Component-scoped feature state

**Example**:
```typescript
import { useState } from 'react';

function StudentCard({ student }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? 'Collapse' : 'Expand'}
      </button>
      {isExpanded && <StudentDetails student={student} />}
    </div>
  );
}
```

**For complex local state**, use **Context API**:

```typescript
// src/contexts/incidents/FollowUpActionContext.tsx
export function FollowUpActionProvider({ children }) {
  const [selectedAction, setSelectedAction] = useState(null);
  const [filters, setFilters] = useState({});

  // ... TanStack Query for server data
  const { data: actions } = useQuery({
    queryKey: ['followUpActions'],
    queryFn: fetchFollowUpActions
  });

  return (
    <FollowUpActionContext.Provider value={{ actions, selectedAction, setSelectedAction }}>
      {children}
    </FollowUpActionContext.Provider>
  );
}
```

---

## When to Use Each Layer

### Decision Tree

```
Is this data from the backend API?
├─ YES → Use TanStack Query (Server State)
│
└─ NO → Does this state need to persist across sessions?
    ├─ YES → Use Redux (Client State)
    │         ⚠️ Ensure no PHI is persisted
    │
    └─ NO → Does this state need to be shared across multiple components?
        ├─ YES → Is it scoped to a specific feature?
        │   ├─ YES → Use Context API (Local State)
        │   └─ NO → Use Redux (Client State)
        │
        └─ NO → Use useState (Local State)
```

### Quick Reference Table

| State Type | Layer | Examples |
|------------|-------|----------|
| **Server Data** | TanStack Query | Students, health records, medications |
| **Auth State** | Redux + Context | User session, permissions, tokens |
| **UI Preferences** | Redux | Theme, sidebar collapsed, view mode |
| **Filters (persistent)** | Redux | Saved filters, sort configuration |
| **Filters (temporary)** | Local State | Current search input, dropdown selection |
| **Form State** | React Hook Form | Form inputs, validation errors |
| **Modal State** | Local State | Modal open/closed |
| **Selection** | Local State | Checkbox selection, row selection |
| **Feature State** | Context | Follow-up actions, witness statements |

---

## Provider Hierarchy

All providers are composed in `src/app/providers.tsx`:

```typescript
ReduxProvider (outermost)
  ↓
QueryClientProvider (TanStack Query)
  ↓
ApolloProvider (GraphQL - optional)
  ↓
AuthProvider (Authentication)
  ↓
NavigationProvider
  ↓
{children} (Your app)
```

**Why this order?**
1. **Redux** first - provides app-wide state foundation
2. **QueryClient** next - needs Redux for some state sync
3. **Apollo** - GraphQL client for specific queries
4. **Auth** - needs all data layers available
5. **Navigation** - uses auth context

**Feature-specific providers** (e.g., `FollowUpActionProvider`) should wrap only the components that need them:

```typescript
<FollowUpActionProvider initialIncidentId={id}>
  <IncidentFollowUpSection />
</FollowUpActionProvider>
```

**⚠️ DON'T** add feature providers to the root `providers.tsx` unless they're truly global.

---

## Component Patterns

### Pattern 1: Server Component (Next.js App Router)

**Best for**: Pages that fetch data on the server

```typescript
// src/app/(dashboard)/students/[id]/page.tsx
import { getStudentById } from '@/app/(dashboard)/students/_actions';

export default async function StudentPage({ params }) {
  const student = await getStudentById(params.id);

  return <StudentProfile student={student} />;
}
```

✅ **Pros**: SEO-friendly, fast initial load, no client-side loading state
❌ **Cons**: Not interactive, can't use hooks

---

### Pattern 2: Client Component with Query Hook

**Best for**: Interactive pages that need real-time data

```typescript
// src/components/features/students/StudentProfile.tsx
'use client';

import { useStudentById } from '@/hooks/domains/students/queries';

export function StudentProfile({ id }) {
  const { data: student, isLoading } = useStudentById(id);

  if (isLoading) return <LoadingSkeleton />;

  return <StudentCard student={student} />;
}
```

✅ **Pros**: Real-time updates, interactive, automatic refetching
❌ **Cons**: Client-side loading state, not SEO-friendly

---

### Pattern 3: Container/Presentation Split

**Best for**: Complex components with state and presentation logic

```typescript
// Container Component (smart, stateful)
// src/components/features/students/StudentListContainer.tsx
'use client';

import { useStudents } from '@/hooks/domains/students/queries';
import { useAppSelector, useAppDispatch } from '@/stores/hooks';
import { StudentList } from './StudentList';

export function StudentListContainer() {
  const dispatch = useAppDispatch();

  // Server state
  const { data: students, isLoading } = useStudents();

  // Client state
  const viewMode = useAppSelector(state => state.students.viewMode);
  const filters = useAppSelector(state => state.students.filters);

  // Handlers
  const handleViewModeChange = (mode) => {
    dispatch(setViewMode(mode));
  };

  return (
    <StudentList
      students={students}
      loading={isLoading}
      viewMode={viewMode}
      onViewModeChange={handleViewModeChange}
    />
  );
}
```

```typescript
// Presentation Component (dumb, stateless)
// src/components/features/students/StudentList.tsx

interface StudentListProps {
  students: Student[];
  loading: boolean;
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
}

export function StudentList({
  students,
  loading,
  viewMode,
  onViewModeChange
}: StudentListProps) {
  if (loading) return <LoadingSkeleton />;

  return (
    <div>
      <ViewModeToggle value={viewMode} onChange={onViewModeChange} />
      {viewMode === 'table' ? (
        <StudentTable students={students} />
      ) : (
        <StudentGrid students={students} />
      )}
    </div>
  );
}
```

✅ **Pros**: Separation of concerns, testable, reusable presentation component
❌ **Cons**: More files, slight boilerplate

---

## File Organization

### ✅ Correct Structure

```
src/
├── app/
│   ├── providers.tsx                     # Root provider composition
│   └── (dashboard)/
│       └── students/
│           ├── page.tsx                  # Page component (data fetching)
│           └── _components/              # Page-specific components
│
├── components/
│   ├── ui/                               # Primitive UI components (Button, Card)
│   ├── features/                         # Feature-specific components
│   │   └── students/
│   │       ├── StudentList.tsx          # Presentation component
│   │       └── StudentCard.tsx          # Presentation component
│   ├── layouts/                          # Layout components
│   └── shared/                           # Shared components
│
├── contexts/                             # React Context providers
│   ├── AuthContext.tsx                   # ✅ Auth context
│   ├── NavigationContext.tsx             # ✅ Navigation context
│   └── incidents/
│       └── FollowUpActionContext.tsx     # ✅ Feature-specific context
│
├── hooks/                                # React hooks (NO PROVIDERS)
│   ├── domains/                          # Domain-specific hooks
│   │   ├── students/
│   │   │   ├── queries/                  # Query hooks
│   │   │   │   ├── useStudents.ts
│   │   │   │   └── useStudentById.ts
│   │   │   ├── mutations/                # Mutation hooks
│   │   │   │   ├── useCreateStudent.ts
│   │   │   │   └── useUpdateStudent.ts
│   │   │   └── composites/               # Complex workflow hooks
│   │   │       └── useStudentWorkflow.ts
│   │   └── incidents/
│   │       ├── queries/
│   │       └── mutations/
│   ├── core/                             # Core hooks (useAuth, useWebSocket)
│   └── ui/                               # UI hooks (useToast, useModal)
│
└── stores/                               # Redux store
    ├── store.ts                          # Store configuration
    ├── hooks.ts                          # Typed Redux hooks
    └── slices/                           # Redux slices
        ├── authSlice.ts
        ├── studentsSlice.ts
        └── settingsSlice.ts
```

### ❌ Anti-Patterns to Avoid

```
❌ src/hooks/utilities/AuthContext.tsx        # Context in hooks (wrong)
❌ src/hooks/domains/incidents/FollowUpActionContext.tsx  # Provider in hooks (wrong)
❌ src/components/features/students/StudentListWithData.tsx  # Mixing data + UI (wrong)
❌ src/pages/                                  # Old Next.js pattern (use app/)
```

---

## Best Practices

### 1. Always Mark PHI Data

```typescript
// ✅ GOOD: Mark queries containing PHI
useQuery({
  queryKey: ['healthRecords', studentId],
  queryFn: () => fetchHealthRecords(studentId),
  meta: {
    containsPHI: true,  // ⚠️ CRITICAL for HIPAA compliance
    errorMessage: 'Failed to load health records'
  }
});

// ❌ BAD: No PHI metadata
useQuery({
  queryKey: ['healthRecords', studentId],
  queryFn: () => fetchHealthRecords(studentId)
});
```

### 2. Never Store PHI in Redux/localStorage

```typescript
// ✅ GOOD: UI preferences only
const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    theme: 'light',
    sidebarCollapsed: false
  }
});

// ❌ BAD: PHI in Redux
const studentsSlice = createSlice({
  name: 'students',
  initialState: {
    students: [] // ❌ PHI data should NEVER be in Redux
  }
});
```

**Rule**: Server data (especially PHI) should live in TanStack Query cache (memory-only), never Redux or localStorage.

### 3. Use Proper Hook Naming

```typescript
// ✅ GOOD: Clear purpose
useStudents()           // Get list of students
useStudentById(id)      // Get single student
useCreateStudent()      // Mutation to create student

// ❌ BAD: Unclear naming
useGetStudents()        // Redundant "get"
useStudent()            // Ambiguous (list or single?)
```

### 4. Separate Queries and Mutations

```typescript
// ✅ GOOD: Separate files
// hooks/domains/students/queries/useStudents.ts
export function useStudents() { ... }

// hooks/domains/students/mutations/useCreateStudent.ts
export function useCreateStudent() { ... }

// ❌ BAD: All in one file
// hooks/domains/students/useStudents.ts
export function useStudents() { ... }
export function useCreateStudent() { ... }
export function useUpdateStudent() { ... }
// ... 500 lines later
```

### 5. Contexts Should Export Both Provider and Hook

```typescript
// ✅ GOOD: Context file exports both
// contexts/incidents/FollowUpActionContext.tsx

export function FollowUpActionProvider({ children }) {
  // ... provider logic
}

export function useFollowUpActions() {
  const context = useContext(FollowUpActionContext);
  if (!context) {
    throw new Error('useFollowUpActions must be used within FollowUpActionProvider');
  }
  return context;
}
```

### 6. Use Type-Safe Redux Hooks

```typescript
// ✅ GOOD: Use typed hooks
import { useAppSelector, useAppDispatch } from '@/stores/hooks';

const user = useAppSelector(state => state.auth.user);
const dispatch = useAppDispatch();

// ❌ BAD: Use generic hooks
import { useSelector, useDispatch } from 'react-redux';

const user = useSelector(state => state.auth.user); // No type safety
```

---

## Common Patterns & Examples

### Pattern: Optimistic Updates

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => studentsApi.updateStudent(data.id, data),

    // Optimistic update
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['students', newData.id] });

      // Snapshot previous value
      const previous = queryClient.getQueryData(['students', newData.id]);

      // Optimistically update
      queryClient.setQueryData(['students', newData.id], newData);

      return { previous };
    },

    // Rollback on error
    onError: (err, newData, context) => {
      queryClient.setQueryData(['students', newData.id], context.previous);
    },

    // Refetch after success
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });
}
```

### Pattern: Dependent Queries

```typescript
function StudentHealthRecords({ studentId }) {
  // First, fetch student
  const { data: student } = useQuery({
    queryKey: ['students', studentId],
    queryFn: () => fetchStudent(studentId)
  });

  // Then, fetch health records (only when student is available)
  const { data: healthRecords } = useQuery({
    queryKey: ['healthRecords', studentId],
    queryFn: () => fetchHealthRecords(studentId),
    enabled: !!student, // Only run when student exists
    meta: { containsPHI: true }
  });

  return <HealthRecordsList records={healthRecords} />;
}
```

### Pattern: Form State with React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentSchema } from '@/lib/validations/student.schema';

function StudentForm({ onSubmit }) {
  const form = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: ''
    }
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('firstName')} />
      {form.formState.errors.firstName && (
        <span>{form.formState.errors.firstName.message}</span>
      )}
    </form>
  );
}
```

---

## HIPAA Compliance

### Critical Rules

1. **PHI Metadata**: Always mark queries containing PHI with `meta: { containsPHI: true }`
2. **No PHI in Storage**: Never store PHI in localStorage or Redux
3. **Memory-Only Cache**: TanStack Query cache is memory-only (cleared on page refresh)
4. **Session Timeout**: 15-minute idle timeout enforced by AuthContext
5. **Audit Logging**: All PHI access logged via Redux audit middleware

### What is PHI?

PHI (Protected Health Information) includes:
- Student health records
- Medications
- Allergies
- Immunizations
- Chronic conditions
- Incident reports
- Emergency contacts (phone numbers, addresses)

### What is NOT PHI?

- User preferences (theme, layout)
- UI state (sidebar collapsed)
- Filters and sort configuration
- View mode (table/grid)
- Authentication tokens (stored in secure sessionStorage)

### Marking PHI Queries

```typescript
// ✅ PHI - Health records
useQuery({
  queryKey: ['healthRecords', id],
  queryFn: () => fetchHealthRecords(id),
  meta: { containsPHI: true } // ⚠️ Required
});

// ✅ PHI - Student data
useQuery({
  queryKey: ['students', id],
  queryFn: () => fetchStudent(id),
  meta: { containsPHI: true } // ⚠️ Required
});

// ✅ Not PHI - School list
useQuery({
  queryKey: ['schools'],
  queryFn: () => fetchSchools()
  // No PHI metadata needed
});
```

---

## Troubleshooting

### Issue: "useAuth must be used within an AuthProvider"

**Cause**: Component is trying to use `useAuth()` outside the `AuthProvider`.

**Fix**: Ensure the component is wrapped in `<AuthProvider>` (already done in `app/providers.tsx` for the whole app).

```typescript
// ❌ BAD: Using auth outside provider
function MyComponent() {
  const { user } = useAuth(); // Error!
}

// ✅ GOOD: Component is child of AuthProvider
<AuthProvider>
  <MyComponent /> {/* Works! */}
</AuthProvider>
```

---

### Issue: Query not updating after mutation

**Cause**: Query cache not invalidated after mutation.

**Fix**: Invalidate relevant queries in mutation's `onSuccess`:

```typescript
const mutation = useMutation({
  mutationFn: createStudent,
  onSuccess: () => {
    // Invalidate students list
    queryClient.invalidateQueries({ queryKey: ['students'] });
  }
});
```

---

### Issue: Redux state not persisting

**Cause**: State slice not included in persistence middleware.

**Fix**: Check `src/stores/store.ts` persistence middleware:

```typescript
const persistenceMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();

  // Add your slice here
  const uiState = {
    settings: state.settings,
    // Add other non-PHI slices
  };

  localStorage.setItem('whitecross_ui_state', JSON.stringify(uiState));
  return result;
};
```

---

### Issue: "Cannot read properties of undefined" in selector

**Cause**: Query data not loaded yet, but component tries to access nested properties.

**Fix**: Add loading/null checks:

```typescript
// ❌ BAD: No safety checks
const email = useAppSelector(state => state.auth.user.email); // Error if user is null!

// ✅ GOOD: Safe access
const email = useAppSelector(state => state.auth.user?.email);

// ✅ BETTER: Handle loading state
const { data: student, isLoading } = useStudentById(id);
if (isLoading) return <LoadingSkeleton />;
if (!student) return <ErrorState />;
return <StudentProfile student={student} />; // Safe!
```

---

### Issue: Stale data after navigation

**Cause**: TanStack Query cache showing old data.

**Fix**: Either invalidate on navigation or reduce `staleTime`:

```typescript
// Option 1: Invalidate on route change
useEffect(() => {
  queryClient.invalidateQueries({ queryKey: ['students'] });
}, [pathname]);

// Option 2: Reduce stale time
useQuery({
  queryKey: ['students'],
  queryFn: fetchStudents,
  staleTime: 1000 * 60 * 2 // 2 minutes (default is 5 min)
});
```

---

## Additional Resources

- **TanStack Query Docs**: https://tanstack.com/query/latest/docs/react/overview
- **Redux Toolkit Docs**: https://redux-toolkit.js.org/
- **React Hook Form**: https://react-hook-form.com/
- **Next.js App Router**: https://nextjs.org/docs/app
- **HIPAA Compliance**: See `/docs/HIPAA_COMPLIANCE.md` (if available)

---

## Summary

| State Layer | Use For | Location | Persistence |
|-------------|---------|----------|-------------|
| **TanStack Query** | Server data (PHI) | `hooks/domains/*/queries/` | Memory only |
| **Redux Toolkit** | UI state, preferences | `stores/slices/` | localStorage (non-PHI) |
| **Context API** | Feature-scoped state | `contexts/` | Memory only |
| **useState** | Component-local state | Component files | Memory only |
| **React Hook Form** | Form state | Component files | Memory only |

**Golden Rules**:
1. ✅ Server data → TanStack Query
2. ✅ UI preferences → Redux
3. ✅ Component state → useState or Context
4. ✅ Forms → React Hook Form
5. ⚠️ Always mark PHI queries with `meta: { containsPHI: true }`
6. ❌ Never store PHI in Redux or localStorage

---

**Questions?** Check `CLAUDE.md` for more project-specific guidance or consult the team lead.
