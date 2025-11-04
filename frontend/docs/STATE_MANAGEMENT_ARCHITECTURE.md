# State Management Architecture Guide

**Version:** 1.0.0
**Last Updated:** 2025-11-04
**Compliance:** Items 151-170 (NEXTJS_GAP_ANALYSIS_CHECKLIST.md)

## Overview

The White Cross frontend implements a **multi-layered state management architecture** using best-in-class libraries for different types of state. This approach ensures optimal performance, type safety, and HIPAA compliance.

## State Layer Separation

### 1. Global Client State - Redux Toolkit ✅

**Location:** `frontend/src/stores/`
**Library:** Redux Toolkit v2.9+
**Purpose:** Persistent client-side application state

**When to use:**
- Cross-cutting UI state (theme, sidebar, preferences)
- Application-wide settings and configuration
- Complex state with multiple update patterns
- State requiring time-travel debugging

**Compliance:**
- ✅ Item 151: Redux Toolkit chosen for complex global state
- ✅ Item 152: Global state minimized (13 slices, removed 10 unused)
- ✅ Item 153: State normalized using EntityAdapter
- ✅ Item 154: Selectors memoized with createSelector
- ✅ Item 155: Redux Toolkit v2.9 with modern patterns

**Architecture:**
```typescript
// Store structure
{
  auth: AuthState,
  users: UsersState,
  students: StudentsState,      // Normalized with EntityAdapter
  healthRecords: HealthRecordsState,
  medications: MedicationsState,
  appointments: AppointmentsState,
  incidents: IncidentsState,
  // ... 6 more domain slices
}
```

**Example - Create a slice:**
```typescript
import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';

interface SettingsState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  language: string;
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    theme: 'light',
    sidebarOpen: true,
    language: 'en',
  } as SettingsState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

// Memoized selectors
export const selectTheme = (state: RootState) => state.settings.theme;
export const selectIsDarkMode = createSelector(
  [selectTheme],
  (theme) => theme === 'dark'
);

export const { setTheme, toggleSidebar } = settingsSlice.actions;
export default settingsSlice.reducer;
```

**Example - Use in component:**
```typescript
'use client';

import { useAppSelector, useAppDispatch } from '@/stores/hooks';
import { setTheme, selectTheme } from '@/stores/slices/settingsSlice';

function ThemeToggle() {
  const theme = useAppSelector(selectTheme);
  const dispatch = useAppDispatch();

  return (
    <button onClick={() => dispatch(setTheme(theme === 'light' ? 'dark' : 'light'))}>
      Toggle Theme ({theme})
    </button>
  );
}
```

### 2. Server State - TanStack Query ✅

**Location:** `frontend/src/hooks/domains/`
**Library:** TanStack Query (React Query) v5.90+
**Purpose:** Server state caching and synchronization

**When to use:**
- API data fetching and caching
- Server-side data mutations
- Real-time data synchronization
- Optimistic updates
- Background refetching

**Compliance:**
- ✅ Item 156: TanStack Query for all server state
- ✅ Item 157: Granular cache invalidation with tags
- ✅ Item 158: Optimistic updates for mutations
- ✅ Item 159: Hierarchical query key organization
- ✅ Item 160: Stale-while-revalidate (5min stale, 30min GC)

**Configuration:**
```typescript
// frontend/src/config/queryClient.ts
const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: 5 * 60 * 1000,      // 5 minutes
    gcTime: 30 * 60 * 1000,         // 30 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: (failureCount, error) => {
      // Smart retry logic
      if (error.status >= 400 && error.status < 500) return false;
      return failureCount < 3;
    },
  },
};
```

**Query Keys - Hierarchical Organization:**
```typescript
// frontend/src/hooks/domains/students/queryKeys.ts
export const studentQueryKeys = {
  all: ['students'] as const,
  lists: {
    all: () => [...studentQueryKeys.all, 'list'] as const,
    filtered: (filters: StudentFilters) =>
      [...studentQueryKeys.all, 'list', 'filtered', filters] as const,
    byGrade: (grade: string) =>
      [...studentQueryKeys.all, 'list', 'byGrade', grade] as const,
  },
  details: {
    all: () => [...studentQueryKeys.all, 'detail'] as const,
    byId: (id: string) =>
      [...studentQueryKeys.all, 'detail', id] as const,
    withHealthRecords: (id: string) =>
      [...studentQueryKeys.all, 'detail', id, 'withHealthRecords'] as const,
  },
};
```

**Example - Query hook:**
```typescript
import { useQuery } from '@tanstack/react-query';
import { studentQueryKeys } from './queryKeys';

export function useStudents(filters?: StudentFilters) {
  return useQuery({
    queryKey: studentQueryKeys.lists.filtered(filters || {}),
    queryFn: () => apiActions.students.getAll(filters),
    staleTime: 5 * 60 * 1000,
    meta: {
      containsPHI: true,
      errorMessage: 'Failed to load students',
    },
  });
}
```

**Example - Mutation with optimistic updates:**
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => apiActions.students.update(id, data),

    // Optimistic update
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: studentQueryKeys.details.byId(id)
      });

      const previous = queryClient.getQueryData(
        studentQueryKeys.details.byId(id)
      );

      queryClient.setQueryData(
        studentQueryKeys.details.byId(id),
        (old) => ({ ...old, ...data })
      );

      return { previous };
    },

    // Rollback on error
    onError: (_err, { id }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          studentQueryKeys.details.byId(id),
          context.previous
        );
      }
    },

    // Refetch on success
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({
        queryKey: studentQueryKeys.lists.all()
      });
      queryClient.invalidateQueries({
        queryKey: studentQueryKeys.details.byId(id)
      });
    },
  });
}
```

### 3. Local UI State - Zustand ✅

**Location:** `frontend/src/stores/messaging/`
**Library:** Zustand v5.0+
**Purpose:** Feature-specific UI state

**When to use:**
- Component tree state (modals, dropdowns)
- Feature-specific state (messaging, notifications)
- Temporary UI state
- Real-time collaboration state

**Example:**
```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface MessageState {
  messages: Message[];
  drafts: Record<string, Draft>;
  selectedMessage: Message | null;

  addMessage: (message: Message) => void;
  selectMessage: (message: Message | null) => void;
  saveDraft: (conversationId: string, content: string) => void;
}

export const useMessageStore = create<MessageState>()(
  devtools(
    persist(
      (set) => ({
        messages: [],
        drafts: {},
        selectedMessage: null,

        addMessage: (message) => set((state) => ({
          messages: [...state.messages, message],
        })),

        selectMessage: (message) => set({ selectedMessage: message }),

        saveDraft: (conversationId, content) => set((state) => ({
          drafts: { ...state.drafts, [conversationId]: { content } },
        })),
      }),
      { name: 'message-storage' }
    )
  )
);
```

### 4. Form State - React Hook Form + Zod ✅

**Location:** Throughout components
**Library:** React Hook Form v7.66+ with Zod v4.1+
**Purpose:** Form state and validation

**Compliance:**
- ✅ Item 161: React Hook Form for complex forms
- ✅ Item 162: Zod schemas for validation
- ✅ Item 163: Form state persistence with useFormPersistence
- ✅ Item 164: Field-level validation
- ✅ Item 165: Submission states handled

**Example - Form with Zod schema:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define schema
const StudentFormSchema = z.object({
  studentNumber: z.string().min(1, 'Student number required'),
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  grade: z.string().min(1, 'Grade required'),
  dateOfBirth: z.string().refine(
    (date) => new Date(date) < new Date(),
    'Date must be in the past'
  ),
});

type StudentFormInput = z.infer<typeof StudentFormSchema>;

function StudentForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormInput>({
    resolver: zodResolver(StudentFormSchema),
  });

  const onSubmit = async (data: StudentFormInput) => {
    await createStudent(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('studentNumber')} />
      {errors.studentNumber && <p>{errors.studentNumber.message}</p>}

      <input {...register('firstName')} />
      {errors.firstName && <p>{errors.firstName.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

**Example - Form persistence:**
```typescript
import { useFormPersistence } from '@/hooks/utilities/useFormPersistence';

function IncidentForm() {
  const { register, watch, setValue, handleSubmit } = useForm<IncidentFormInput>({
    resolver: zodResolver(IncidentFormSchema),
  });

  // Automatically persist to localStorage
  const { clearStorage } = useFormPersistence(watch, setValue, {
    storageKey: 'incident-draft',
    excludeFields: ['attachments'], // Don't persist file uploads
  });

  const onSubmit = async (data: IncidentFormInput) => {
    await createIncident(data);
    clearStorage(); // Clear draft on success
  };

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

### 5. URL State - Next.js Search Params ✅

**Location:** Server and client components
**Purpose:** Shareable, bookmarkable state

**Compliance:**
- ✅ Item 166: Search params for shareable state
- ✅ Item 167: useSearchParams (client) / searchParams prop (server)
- ✅ Item 168: URL synchronized with UI
- ✅ Item 169: Browser history managed
- ✅ Item 170: Deep linking supported

**Example - Server Component (Next.js 15 pattern):**
```typescript
// app/(dashboard)/students/page.tsx
interface StudentsPageProps {
  searchParams: {
    page?: string;
    search?: string;
    grade?: string;
  };
}

export default function StudentsPage({ searchParams }: StudentsPageProps) {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || '';
  const grade = searchParams.grade || null;

  return (
    <StudentsContent
      page={page}
      search={search}
      grade={grade}
    />
  );
}
```

**Example - Client Component with useUrlState hook:**
```typescript
'use client';

import { useUrlState } from '@/hooks/utilities/useUrlState';

function StudentsFilters() {
  const { state, setState, setParam } = useUrlState({
    page: 1,
    search: '',
    grade: null as string | null,
    status: 'active',
  });

  return (
    <div>
      <input
        value={state.search}
        onChange={(e) => setParam('search', e.target.value, { replace: true })}
      />

      <select
        value={state.grade || ''}
        onChange={(e) => setParam('grade', e.target.value || null)}
      >
        <option value="">All Grades</option>
        <option value="1">Grade 1</option>
        <option value="2">Grade 2</option>
      </select>

      <button onClick={() => setState({ page: 1, search: '', grade: null })}>
        Clear Filters
      </button>
    </div>
  );
}
```

## Performance Best Practices

### Selector Memoization

Always use memoized selectors for derived state:

```typescript
import { createSelector } from '@reduxjs/toolkit';

// ❌ BAD - Recalculates on every render
const BadComponent = () => {
  const students = useAppSelector(state =>
    Object.values(state.students.entities).filter(s => s.isActive)
  );
};

// ✅ GOOD - Memoized selector
const selectActiveStudents = createSelector(
  [(state: RootState) => state.students],
  ({ ids, entities }) => ids
    .map(id => entities[id])
    .filter(s => s?.isActive)
);

const GoodComponent = () => {
  const students = useAppSelector(selectActiveStudents);
};
```

### Query Key Organization

Use hierarchical query keys for efficient cache invalidation:

```typescript
// ✅ GOOD - Hierarchical
const queryKeys = {
  all: ['students'],
  lists: {
    all: () => [...queryKeys.all, 'list'],
    filtered: (filters) => [...queryKeys.all, 'list', filters],
  },
  details: {
    byId: (id) => [...queryKeys.all, 'detail', id],
  },
};

// Invalidate all student queries
queryClient.invalidateQueries({ queryKey: queryKeys.all });

// Invalidate only lists
queryClient.invalidateQueries({ queryKey: queryKeys.lists.all() });

// Invalidate specific student
queryClient.invalidateQueries({ queryKey: queryKeys.details.byId('123') });
```

## HIPAA Compliance

### PHI Data Handling

**Redux Persistence:**
```typescript
// Only persist non-PHI data
const persistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();

  // Safe to persist (no PHI)
  localStorage.setItem('ui_state', JSON.stringify({
    settings: state.settings,
    theme: state.theme,
  }));

  // NEVER persist PHI
  // ❌ localStorage.setItem('students', JSON.stringify(state.students));

  return result;
};
```

**TanStack Query:**
```typescript
// Mark queries with PHI metadata
useQuery({
  queryKey: studentQueryKeys.details.byId(id),
  queryFn: () => fetchStudent(id),
  meta: {
    containsPHI: true, // Excludes from persistence
    auditLog: true,    // Triggers audit logging
  },
});
```

## Migration Guides

### Moving from Client URLSearchParams to useUrlState

```typescript
// ❌ OLD - Manual URLSearchParams
'use client';
import { useEffect, useState } from 'react';

function OldComponent() {
  const [filters, setFilters] = useState({ search: '', grade: '' });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFilters({
      search: params.get('search') || '',
      grade: params.get('grade') || '',
    });
  }, []);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(window.location.search);
    params.set(key, value);
    window.history.pushState({}, '', `?${params.toString()}`);
    setFilters({ ...filters, [key]: value });
  };
}

// ✅ NEW - useUrlState hook
'use client';
import { useUrlState } from '@/hooks/utilities/useUrlState';

function NewComponent() {
  const { state, setParam } = useUrlState({
    search: '',
    grade: '',
  });

  // That's it! State is automatically synced with URL
  const updateFilter = (key, value) => setParam(key, value);
}
```

## Decision Matrix

| State Type | Redux | TanStack Query | Zustand | React Hook Form | URL |
|------------|-------|----------------|---------|-----------------|-----|
| API Data | ❌ | ✅ | ❌ | ❌ | ❌ |
| Global UI | ✅ | ❌ | ⚠️ | ❌ | ❌ |
| Local UI | ❌ | ❌ | ✅ | ❌ | ❌ |
| Form Data | ❌ | ❌ | ❌ | ✅ | ❌ |
| Filters | ❌ | ❌ | ❌ | ⚠️ | ✅ |
| Pagination | ❌ | ❌ | ❌ | ❌ | ✅ |

## Common Patterns

### Pattern: List with Filters and Pagination

```typescript
function StudentsList() {
  // URL state for shareable filters
  const { state: filters } = useUrlState({
    page: 1,
    limit: 20,
    search: '',
    grade: null,
  });

  // Server state for data
  const { data, isLoading } = useQuery({
    queryKey: studentQueryKeys.lists.filtered(filters),
    queryFn: () => fetchStudents(filters),
  });

  // Local UI state for selection
  const selectedIds = useMessageStore(state => state.selectedIds);

  return <StudentTable data={data} filters={filters} />;
}
```

## Resources

- Redux Toolkit: https://redux-toolkit.js.org/
- TanStack Query: https://tanstack.com/query/latest
- Zustand: https://docs.pmnd.rs/zustand/getting-started/introduction
- React Hook Form: https://react-hook-form.com/
- Zod: https://zod.dev/

## Compliance Checklist

- [x] 151. State management library choice justified (Redux/Zustand)
- [x] 152. Global state minimized
- [x] 153. State normalized for complex data
- [x] 154. Selectors memoized
- [x] 155. Redux Toolkit used if using Redux
- [x] 156. TanStack Query used for server state
- [x] 157. Cache invalidation strategies implemented
- [x] 158. Optimistic updates for mutations
- [x] 159. Query keys organized systematically
- [x] 160. Stale-while-revalidate pattern used
- [x] 161. React Hook Form used for complex forms
- [x] 162. Form validation with Zod schemas
- [x] 163. Form state persisted where appropriate
- [x] 164. Field-level validation implemented
- [x] 165. Form submission states handled
- [x] 166. Search params used for shareable state
- [x] 167. useSearchParams hook utilized
- [x] 168. URL state synchronized with UI
- [x] 169. Browser history managed properly
- [x] 170. Deep linking supported
