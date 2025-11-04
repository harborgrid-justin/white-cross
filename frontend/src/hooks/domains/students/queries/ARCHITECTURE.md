# Student Query Hooks Architecture

## Module Dependency Graph

```
┌─────────────────────────────────────────────────────────────────┐
│                         index.ts (73 LOC)                       │
│                  ┌────────────────────────────┐                 │
│                  │   Barrel Export Module     │                 │
│                  │  (Backward Compatibility)  │                 │
│                  └────────────────────────────┘                 │
│                              ↓                                   │
│              Re-exports everything from below                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Core Infrastructure                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────┐     ┌───────────────────────────┐  │
│  │ studentQueryKeys.ts    │     │ studentQueryTypes.ts      │  │
│  │      (70 LOC)          │     │      (175 LOC)            │  │
│  ├────────────────────────┤     ├───────────────────────────┤  │
│  │ • studentKeys factory  │     │ • UseStudentsReturn       │  │
│  │ • CACHE_CONFIG         │     │ • UseStudentDetailReturn  │  │
│  │                        │     │ • UseStudentSearchReturn  │  │
│  │ Used by: All modules   │     │ • StudentStats            │  │
│  │ Dependencies: None     │     │ • All type definitions    │  │
│  └────────────────────────┘     └───────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Query Hooks Layer                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │         useStudentCoreQueries.ts (282 LOC)                 │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │ • useStudents()          - Main hook with Redux           │ │
│  │ • useStudentDetail()     - Single student fetching        │ │
│  │ • useStudentSearch()     - Search functionality           │ │
│  │                                                            │ │
│  │ Dependencies:                                              │ │
│  │   - studentQueryKeys                                       │ │
│  │   - studentQueryTypes                                      │ │
│  │   - @tanstack/react-query                                 │ │
│  │   - Redux store                                            │ │
│  │   - API actions                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │    useStudentSpecializedQueries.ts (95 LOC)                │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │ • useAssignedStudents()  - Nurse-assigned students        │ │
│  │ • useStudentStats()      - Statistics (placeholder)       │ │
│  │                                                            │ │
│  │ Dependencies:                                              │ │
│  │   - studentQueryKeys                                       │ │
│  │   - studentQueryTypes                                      │ │
│  │   - @tanstack/react-query                                 │ │
│  │   - API actions                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Mutation Hooks Layer                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │         useStudentMutations.ts (247 LOC)                   │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │ • useCreateStudent()      - Create new student            │ │
│  │ • useUpdateStudent()      - Update existing student       │ │
│  │ • useDeleteStudent()      - Delete student                │ │
│  │ • useBulkImportStudents() - Bulk import                   │ │
│  │ • useExportStudents()     - Export data                   │ │
│  │                                                            │ │
│  │ Features:                                                  │ │
│  │   - Auto cache invalidation                                │ │
│  │   - Redux sync                                             │ │
│  │   - No optimistic updates (healthcare data integrity)     │ │
│  │                                                            │ │
│  │ Dependencies:                                              │ │
│  │   - studentQueryKeys                                       │ │
│  │   - @tanstack/react-query                                 │ │
│  │   - Redux store                                            │ │
│  │   - API actions                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     Utility Hooks Layer                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │         useStudentUtilities.ts (106 LOC)                   │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │ • useStudentCacheInvalidation()  - Manual cache control   │ │
│  │   - invalidateAll()                                        │ │
│  │   - invalidateStudent()                                    │ │
│  │   - invalidateLists()                                      │ │
│  │   - invalidateSearches()                                   │ │
│  │   - invalidateStats()                                      │ │
│  │                                                            │ │
│  │ • useStudentPrefetch()           - Performance optimization│ │
│  │   - prefetchStudent()                                      │ │
│  │   - prefetchStudents()                                     │ │
│  │                                                            │ │
│  │ Dependencies:                                              │ │
│  │   - studentQueryKeys                                       │ │
│  │   - @tanstack/react-query                                 │ │
│  │   - API actions                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Component Integration Patterns

### Pattern 1: List View Component
```typescript
import { useStudents } from '@/hooks/domains/students/queries';

function StudentListPage() {
  const {
    students,           // Student data
    pagination,         // Pagination metadata
    isLoading,          // Loading state
    viewMode,           // Grid/list/table
    setViewMode,        // Change view
    selectStudent,      // Select action
    filters,            // Current filters
    setFilters,         // Update filters
  } = useStudents({ page: 1, limit: 20 });

  return <StudentList students={students} />;
}
```

### Pattern 2: Detail View Component
```typescript
import { useStudentDetail } from '@/hooks/domains/students/queries';

function StudentDetailPage({ id }: { id: string }) {
  const {
    student,
    isLoading,
    error
  } = useStudentDetail(id);

  if (isLoading) return <Loading />;
  if (error) return <Error />;
  return <StudentProfile student={student} />;
}
```

### Pattern 3: Form Component
```typescript
import {
  useCreateStudent,
  useUpdateStudent
} from '@/hooks/domains/students/queries';

function StudentForm({ studentId }: { studentId?: string }) {
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();

  const handleSubmit = async (data: StudentData) => {
    if (studentId) {
      await updateStudent.mutateAsync({ id: studentId, data });
    } else {
      await createStudent.mutateAsync(data);
    }
  };

  return <Form onSubmit={handleSubmit} />;
}
```

### Pattern 4: Search Component
```typescript
import { useStudentSearch } from '@/hooks/domains/students/queries';

function StudentSearch() {
  const [query, setQuery] = useState('');
  const { students, isLoading } = useStudentSearch(query);

  return (
    <>
      <SearchInput value={query} onChange={setQuery} />
      <SearchResults students={students} loading={isLoading} />
    </>
  );
}
```

### Pattern 5: Performance-Optimized Component
```typescript
import {
  useStudents,
  useStudentPrefetch
} from '@/hooks/domains/students/queries';

function OptimizedStudentList() {
  const { students } = useStudents();
  const { prefetchStudent } = useStudentPrefetch();

  return (
    <div>
      {students.map(student => (
        <StudentCard
          key={student.id}
          student={student}
          onMouseEnter={() => prefetchStudent(student.id)}
        />
      ))}
    </div>
  );
}
```

### Pattern 6: Cache Management Component
```typescript
import {
  useStudents,
  useStudentCacheInvalidation
} from '@/hooks/domains/students/queries';

function StudentDashboard() {
  const { students } = useStudents();
  const { invalidateAll } = useStudentCacheInvalidation();

  const handleRefresh = () => {
    invalidateAll();
    toast.info('Refreshed student data');
  };

  return (
    <>
      <RefreshButton onClick={handleRefresh} />
      <StudentList students={students} />
    </>
  );
}
```

## Data Flow

```
┌─────────────┐
│  Component  │
└──────┬──────┘
       │ Import hook
       ↓
┌─────────────┐
│    Hook     │ ← Uses query keys from studentQueryKeys
└──────┬──────┘
       │ Fetch request
       ↓
┌─────────────┐
│  API Layer  │
└──────┬──────┘
       │ HTTP request
       ↓
┌─────────────┐
│   Backend   │
└──────┬──────┘
       │ Response
       ↓
┌─────────────┐
│ React Query │ ← Caches using CACHE_CONFIG
│    Cache    │
└──────┬──────┘
       │ Data
       ↓
┌─────────────┐
│  Component  │
└─────────────┘
```

## Cache Invalidation Flow

```
User Action (Create/Update/Delete)
       ↓
Mutation Hook (useStudentMutations.ts)
       ↓
API Call
       ↓
Success Handler
       ├── Invalidate affected query keys
       ├── Update Redux store
       └── Pre-populate cache if needed
       ↓
React Query refetches invalidated queries
       ↓
Components re-render with fresh data
```

## Module Responsibilities

| Module | Responsibility | Exports | Dependencies |
|--------|---------------|---------|--------------|
| **studentQueryKeys** | Query key generation | `studentKeys`, `CACHE_CONFIG` | None |
| **studentQueryTypes** | Type definitions | All interfaces | `@/types` |
| **useStudentCoreQueries** | Core data fetching | `useStudents`, `useStudentDetail`, `useStudentSearch` | Keys, Types, API, Redux |
| **useStudentSpecializedQueries** | Specialized queries | `useAssignedStudents`, `useStudentStats` | Keys, Types, API |
| **useStudentMutations** | Data mutations | `useCreateStudent`, `useUpdateStudent`, etc. | Keys, API, Redux |
| **useStudentUtilities** | Cache & performance | `useStudentCacheInvalidation`, `useStudentPrefetch` | Keys, API |
| **index** | Barrel export | Re-exports all | All modules |

## Benefits of This Architecture

### 1. Separation of Concerns
- **Keys & Config**: Centralized, no runtime code
- **Types**: Pure metadata
- **Queries**: Read operations
- **Mutations**: Write operations
- **Utilities**: Advanced features

### 2. Tree Shaking
- Components only import what they need
- Unused utilities don't bloat bundle
- Better code splitting

### 3. Maintainability
- Small, focused files
- Clear responsibilities
- Easy to locate functionality
- Simple to test

### 4. Performance
- Faster compilation
- Better IDE performance
- Optimized bundle size
- Efficient caching

### 5. Scalability
- Easy to add new hooks
- Clear patterns to follow
- Minimal merge conflicts
- Team-friendly structure

## Testing Strategy

```typescript
// Test studentQueryKeys.ts
describe('studentQueryKeys', () => {
  it('generates correct query keys', () => {
    expect(studentKeys.detail('123')).toEqual(['students', 'detail', '123']);
  });
});

// Test useStudentCoreQueries.ts
describe('useStudents', () => {
  it('fetches students with filters', async () => {
    const { result } = renderHook(() =>
      useStudents({ grade: '5' })
    );
    await waitFor(() => expect(result.current.students).toHaveLength(5));
  });
});

// Test useStudentMutations.ts
describe('useCreateStudent', () => {
  it('creates student and invalidates cache', async () => {
    const { result } = renderHook(() => useCreateStudent());
    await result.current.mutateAsync(studentData);
    expect(queryClient.invalidateQueries).toHaveBeenCalled();
  });
});
```

## Migration Path

### Phase 1: Current (Complete ✅)
- Refactor to modular structure
- Maintain backward compatibility
- No breaking changes

### Phase 2: Update Imports (Optional)
- Update components to import from specific modules
- Better tree-shaking
- Clearer dependencies

### Phase 3: Add Features
- New hooks go in appropriate module
- Types in studentQueryTypes
- Keys in studentQueryKeys

### Phase 4: Optimize
- Split large modules if needed
- Add more specialized query modules
- Performance tuning

This architecture provides a solid foundation for scalable, maintainable student data management.
