# State Management Decision Tree

**Author**: State Management Architect
**Date**: 2025-10-27
**Version**: 1.0
**For**: White Cross Healthcare Platform (Next.js 15)

---

## Quick Decision Flowchart

```
┌─────────────────────────────────────────┐
│  Do I need to manage state for this?   │
└────────────┬────────────────────────────┘
             │
             ├─ NO → Use static props or server component fetch
             │
             └─ YES → Continue below
                │
                ├─ Is this DATA FROM AN API/DATABASE?
                │  │
                │  ├─ YES → Use **TanStack Query** (React Query)
                │  │        ✅ Automatic caching, refetching, background sync
                │  │        ✅ Best for: Students, medications, appointments, health records
                │  │        ✅ Example: useQuery({ queryKey: ['students'], queryFn: fetchStudents })
                │  │
                │  └─ NO → Continue below
                │     │
                │     ├─ Should this state be SHAREABLE/BOOKMARKABLE?
                │     │  (Filters, pagination, modal state, tabs)
                │     │  │
                │     │  ├─ YES → Use **URL State** (searchParams)
                │     │  │        ✅ Shareable URLs, back button works
                │     │  │        ✅ Best for: Filters, sorting, pagination, modals
                │     │  │        ✅ Example: useSearchParams() and router.push()
                │     │  │
                │     │  └─ NO → Continue below
                │     │     │
                │     │     ├─ Is this GLOBAL state across entire app?
                │     │     │  (Auth, theme, notifications, UI preferences)
                │     │     │  │
                │     │     │  ├─ YES → Use **Redux Toolkit**
                │     │     │  │        ✅ Only for: auth, settings, notifications, theme
                │     │     │  │        ✅ Example: useAppSelector(state => state.auth.user)
                │     │     │  │
                │     │     │  └─ NO → Continue below
                │     │     │     │
                │     │     │     ├─ Is state shared across MANY components?
                │     │     │     │  (Not in same parent tree)
                │     │     │     │  │
                │     │     │     │  ├─ YES → Use **Context API**
                │     │     │     │  │        ⚠️  Use sparingly!
                │     │     │     │  │        ✅ Best for: WebSocket connection, theme provider
                │     │     │     │  │        ✅ Example: createContext + useContext
                │     │     │     │  │
                │     │     │     │  └─ NO → Use **useState** (local state)
                │     │     │     │           ✅ Best for: Form inputs, toggles, local UI
                │     │     │     │           ✅ Example: const [open, setOpen] = useState(false)
```

---

## Detailed Decision Criteria

### 1. TanStack Query (React Query) - SERVER STATE

**Use when:**
- ✅ Data comes from an API or database
- ✅ Need caching and automatic refetching
- ✅ Need loading/error states handled automatically
- ✅ Data should sync across tabs
- ✅ Need background refetching

**Examples:**
- Student lists, medication records, appointment data
- Health records, incident reports, documents
- User profiles, contacts, emergency contacts

**Implementation:**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetching data
const { data, isLoading, error } = useQuery({
  queryKey: ['students', { page, grade }], // Unique key
  queryFn: () => fetchStudents({ page, grade }),
  staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  gcTime: 10 * 60 * 1000,   // Keep in memory for 10 min
});

// Mutating data with optimistic updates
const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: deleteStudent,
  onMutate: async (studentId) => {
    await queryClient.cancelQueries({ queryKey: ['students'] });
    const previous = queryClient.getQueryData(['students']);
    queryClient.setQueryData(['students'], (old) =>
      old.filter(s => s.id !== studentId)
    );
    return { previous };
  },
  onError: (err, variables, context) => {
    queryClient.setQueryData(['students'], context.previous);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['students'] });
  }
});
```

**Don't use for:**
- ❌ Authentication state (use Redux)
- ❌ UI state (use useState)
- ❌ Filter/pagination state (use URL state)

---

### 2. URL State (searchParams) - SHAREABLE STATE

**Use when:**
- ✅ State should be shareable via URL
- ✅ State should be bookmarkable
- ✅ Back/forward button should work
- ✅ Need deep linking

**Examples:**
- Filters (grade, status, search query)
- Pagination (page number, page size)
- Modal state (open/closed, which modal)
- Tab selection
- Sorting (sort by, direction)

**Implementation:**
```typescript
'use client';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

function StudentFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read from URL
  const grade = searchParams.get('grade') || '';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');

  // Update URL
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset page when filters change
    if (key !== 'page') {
      params.set('page', '1');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <input
        value={search}
        onChange={(e) => updateFilter('search', e.target.value)}
        placeholder="Search students..."
      />
      <select
        value={grade}
        onChange={(e) => updateFilter('grade', e.target.value)}
      >
        <option value="">All Grades</option>
        <option value="K">Kindergarten</option>
        {/* ... */}
      </select>
    </div>
  );
}
```

**Benefits:**
- ✅ Shareable: `/students?grade=5&search=John`
- ✅ Bookmarkable: Users can save filtered views
- ✅ Back button works: Navigating back restores filters
- ✅ SEO-friendly: Search engines can index filtered pages

**Don't use for:**
- ❌ Sensitive data (passwords, PHI)
- ❌ Temporary UI state (hover, focus)
- ❌ Large data objects

---

### 3. Redux Toolkit - GLOBAL CLIENT STATE

**Use ONLY for:**
1. ✅ **Authentication** (`authSlice.ts`)
   - User object, isAuthenticated, session info
   - Needed across entire app
   - Cross-tab synchronization required

2. ✅ **UI Settings** (`settingsSlice.ts`)
   - User preferences (language, timezone)
   - UI density, accessibility settings
   - Persistent across sessions

3. ✅ **Theme** (`themeSlice.ts`)
   - Dark/light mode
   - Color scheme
   - Applied globally

4. ✅ **Notifications** (`notificationsSlice.ts`)
   - Real-time notification list
   - Toast messages
   - WebSocket-driven updates

**Implementation:**
```typescript
// authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: true
  } as AuthState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    }
  }
});

// In component
import { useAppSelector, useAppDispatch } from '@/stores/hooks';

function ProfileButton() {
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();

  if (!user) return <LoginButton />;

  return <UserMenu user={user} />;
}
```

**DON'T use Redux for:**
- ❌ **Server data** (students, medications) → Use TanStack Query
- ❌ **Filters/pagination** → Use URL state
- ❌ **Form state** → Use react-hook-form
- ❌ **Local UI state** → Use useState
- ❌ **Modal state** → Use URL state or useState

**Why we removed 10 slices:**
- Students, medications, appointments → TanStack Query better
- Inventory, vendors, budgets → Not used, legacy code
- Districts, schools → Server-side data, no client state needed

---

### 4. Context API - SHARED PROVIDER STATE

**Use when:**
- ✅ State shared across many components (but not global app-wide)
- ✅ Provides configuration or service (WebSocket, theme)
- ✅ Avoids prop drilling in component tree
- ⚠️  **Use sparingly** - Redux or URL state often better

**Good use cases:**
```typescript
// WebSocket connection (legitimate use)
const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const ws = io(SOCKET_URL);
    setSocket(ws);
    return () => ws.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

// Usage
function NotificationComponent() {
  const socket = useContext(SocketContext);
  // ... listen to socket events
}
```

**Bad use cases (use alternatives instead):**
```typescript
// ❌ BAD: Navigation context (use usePathname from Next.js)
const NavigationContext = createContext(...);

// ❌ BAD: Form context for single form (use react-hook-form)
const FormContext = createContext(...);

// ❌ BAD: Data fetching context (use TanStack Query)
const DataContext = createContext(...);
```

---

### 5. useState - LOCAL COMPONENT STATE

**Use when:**
- ✅ State only used in ONE component
- ✅ Temporary UI state (open/closed, hover, focus)
- ✅ Simple form inputs (controlled components)
- ✅ Does NOT need to be shared or persisted

**Examples:**
```typescript
function SearchInput() {
  // ✅ Good: Local search text before debounced API call
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText, 300);

  // Trigger API call with debounced value
  useEffect(() => {
    if (debouncedSearch) {
      // Search API call
    }
  }, [debouncedSearch]);

  return (
    <input
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
    />
  );
}

function Modal() {
  // ✅ Good: Modal open state (if not in URL)
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open</button>
      {isOpen && <ModalContent onClose={() => setIsOpen(false)} />}
    </>
  );
}

function DropdownMenu() {
  // ✅ Good: Dropdown expanded state
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <button onClick={() => setIsExpanded(!isExpanded)}>Menu</button>
      {isExpanded && <MenuItems />}
    </div>
  );
}
```

---

### 6. Form State - react-hook-form

**Use for ALL forms:**
- ✅ Form validation with Zod schemas
- ✅ Field state management
- ✅ Error handling
- ✅ Submission state

**Implementation:**
```typescript
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StudentFormSchema } from '@/lib/validations/student.schema';

function StudentForm() {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(StudentFormSchema),
  });

  const onSubmit = async (data: StudentFormInput) => {
    startTransition(async () => {
      const result = await createStudent(data); // Server action
      if (result.success) {
        router.push(`/students/${result.data.id}`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('firstName')} />
      {errors.firstName && <span>{errors.firstName.message}</span>}
      <button disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

**Don't use:**
- ❌ Redux for form state
- ❌ Context for form state
- ❌ Manual useState for complex forms

---

## Common Scenarios & Solutions

### Scenario 1: Student List with Filters and Pagination

**Requirements:**
- Fetch student data from API
- Filter by grade and search
- Paginate results
- Shareable URLs

**Solution:**
```typescript
'use client';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

function StudentList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL State for filters/pagination
  const page = parseInt(searchParams.get('page') || '1');
  const grade = searchParams.get('grade') || '';
  const search = searchParams.get('search') || '';

  // TanStack Query for server data
  const { data, isLoading } = useQuery({
    queryKey: ['students', { page, grade, search }],
    queryFn: () => fetchStudents({ page, grade, search }),
    staleTime: 5 * 60 * 1000,
  });

  const updateUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      {/* Filters */}
      <StudentFilters
        grade={grade}
        search={search}
        onFilterChange={updateUrl}
      />

      {/* List */}
      <StudentTable students={data.students} />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={data.totalPages}
        onPageChange={(page) => updateUrl({ page: page.toString() })}
      />
    </div>
  );
}
```

**State breakdown:**
- ✅ `page`, `grade`, `search` → URL State (shareable)
- ✅ `students` data → TanStack Query (API data)
- ✅ `isLoading`, `error` → TanStack Query (automatic)

---

### Scenario 2: Authentication Flow

**Requirements:**
- Login/logout functionality
- Persist auth state
- Cross-tab synchronization
- Protected routes

**Solution:**
```typescript
// authSlice.ts (Redux)
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, isAuthenticated: false },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    }
  }
});

// AuthContext.tsx (Cross-tab sync)
export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const broadcastChannel = useRef<BroadcastChannel>();

  useEffect(() => {
    // Cross-tab sync
    broadcastChannel.current = new BroadcastChannel('auth_sync');
    broadcastChannel.current.onmessage = (event) => {
      if (event.data.type === 'logout') {
        dispatch(logout());
      }
    };
    return () => broadcastChannel.current?.close();
  }, []);

  return <>{children}</>;
}

// In component
function ProfileButton() {
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    // Broadcast to other tabs
    const channel = new BroadcastChannel('auth_sync');
    channel.postMessage({ type: 'logout' });
  };

  return user ? <UserMenu user={user} onLogout={handleLogout} /> : <LoginButton />;
}
```

**State breakdown:**
- ✅ `user`, `isAuthenticated` → Redux (global, cross-tab)
- ✅ Cross-tab sync → BroadcastChannel API
- ✅ Auth tokens → sessionStorage (not Redux)

---

### Scenario 3: Form with Server Action

**Requirements:**
- Create/edit student form
- Validation with Zod
- Submit to server action
- Optimistic UI updates

**Solution:**
```typescript
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';

function StudentForm({ student }: { student?: Student }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(StudentFormSchema),
    defaultValues: student || {},
  });

  const onSubmit = async (data: StudentFormInput) => {
    startTransition(async () => {
      const result = student
        ? await updateStudent(student.id, data)
        : await createStudent(data);

      if (result.success) {
        router.push(`/students/${result.data.id}`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('firstName')} />
      {errors.firstName && <span>{errors.firstName.message}</span>}

      <button disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Student'}
      </button>
    </form>
  );
}
```

**State breakdown:**
- ✅ Form fields → react-hook-form
- ✅ Validation → Zod schema
- ✅ Submission state → useTransition
- ❌ NO Redux, NO Context, NO manual state

---

## HIPAA Compliance Considerations

### PHI (Protected Health Information) State

**Rules:**
1. ✅ **Never persist PHI to localStorage**
2. ✅ **Use TanStack Query for PHI data** (memory only)
3. ✅ **Session storage only for auth tokens**
4. ✅ **Audit logging for all PHI access**

**Implementation:**
```typescript
// ✅ GOOD: PHI in TanStack Query (memory only)
const { data: healthRecord } = useQuery({
  queryKey: ['healthRecords', studentId],
  queryFn: () => fetchHealthRecord(studentId),
  staleTime: 0, // No caching for PHI
  gcTime: 0,    // No garbage collection retention
});

// ❌ BAD: PHI in Redux with localStorage persistence
const healthRecords = useAppSelector(state => state.healthRecords);
```

---

## Migration Checklist

When migrating from old state management:

### From Redux to TanStack Query
- [ ] Identify if state is server data
- [ ] Create TanStack Query hooks
- [ ] Replace useSelector with useQuery
- [ ] Replace dispatch(fetchAction) with queryClient.invalidateQueries
- [ ] Test caching behavior
- [ ] Remove Redux slice

### From Local State to URL State
- [ ] Identify if state should be shareable
- [ ] Replace useState with useSearchParams
- [ ] Update state updates to router.push
- [ ] Test back/forward navigation
- [ ] Verify bookmarkable URLs

### From Context to TanStack Query
- [ ] Identify if context is for data fetching
- [ ] Create query hooks
- [ ] Remove context provider
- [ ] Update consumers to use useQuery
- [ ] Remove context file

---

## Quick Reference Table

| State Type | Tool | Example | Persistence |
|------------|------|---------|-------------|
| **API Data** | TanStack Query | Students, medications | Cache (memory) |
| **Filters/Pagination** | URL State | `?page=2&grade=5` | URL |
| **Auth** | Redux | User, isAuthenticated | sessionStorage |
| **Theme** | Redux | Dark/light mode | localStorage |
| **Notifications** | Redux | Toast messages | None |
| **Settings** | Redux | UI preferences | localStorage |
| **Form State** | react-hook-form | Form fields, validation | None |
| **Local UI** | useState | Modal open, dropdown | None |
| **WebSocket** | Context | Socket connection | None |

---

## Anti-Patterns to Avoid

### ❌ Anti-Pattern 1: Redux for Server Data
```typescript
// ❌ BAD
const students = useAppSelector(state => state.students.list);
useEffect(() => {
  dispatch(fetchStudents());
}, []);

// ✅ GOOD
const { data: students } = useQuery({
  queryKey: ['students'],
  queryFn: fetchStudents
});
```

### ❌ Anti-Pattern 2: Local State for Filters
```typescript
// ❌ BAD (not shareable)
const [grade, setGrade] = useState('');
const [page, setPage] = useState(1);

// ✅ GOOD (shareable URL)
const grade = searchParams.get('grade') || '';
const page = parseInt(searchParams.get('page') || '1');
```

### ❌ Anti-Pattern 3: Context for Everything
```typescript
// ❌ BAD (unnecessary context)
const StudentContext = createContext();
// Use TanStack Query instead

// ❌ BAD (navigation context)
const NavigationContext = createContext();
// Use usePathname from Next.js instead
```

---

## Summary

**Use this decision order:**

1. **Is it server data?** → TanStack Query
2. **Should it be shareable?** → URL State
3. **Is it global app state?** → Redux (only auth/settings/theme/notifications)
4. **Shared across components?** → Context (rarely)
5. **Local to one component?** → useState

**Remember:**
- ✅ Keep it simple
- ✅ Use the right tool for the job
- ✅ Avoid over-engineering
- ✅ HIPAA compliance first
- ✅ Performance matters

---

**Last Updated**: 2025-10-27
**Version**: 1.0
**Maintained by**: State Management Architect
