# Students Domain Hooks

Enterprise-grade React hooks for student data management with comprehensive FERPA compliance, PHI handling, and educational data privacy protections.

## Architecture Overview

The students domain is organized into four primary categories:

1. **Configuration** - Domain settings, query keys, cache strategies
2. **Queries** - Data fetching hooks with TanStack Query
3. **Mutations** - Data modification hooks with optimistic updates
4. **Composites** - High-level hooks combining multiple concerns

## FERPA Compliance

All student data operations comply with the Family Educational Rights and Privacy Act (FERPA). Access to student records is:

- Authenticated and authorized via RBAC
- Logged for audit trails per 34 CFR §99.32
- Cached appropriately based on data sensitivity
- Sanitized to prevent unauthorized disclosure

## PHI Handling

Student health records are treated as Protected Health Information (PHI) requiring dual compliance with both FERPA and HIPAA:

- Health data is NOT cached (staleTime: 0)
- Access requires explicit permissions
- All PHI access is audit-logged with access reason
- Data is encrypted in transit and at rest

## Data Sensitivity Levels

- **Public**: Directory information (names, grades, dates)
- **Internal**: Education records (enrollment, attendance, academics)
- **Confidential**: Sensitive records (contacts, disciplinary records)
- **PHI**: Health information (medical records, medications, allergies)
- **Critical**: Emergency data (safety alerts, critical medications)

## Available Hooks

### Query Hooks - Data Fetching

- `useStudents` - Paginated student lists with filters
- `useStudentDetail` - Individual student details
- `useStudentSearch` - Real-time search with debouncing
- `useInfiniteStudents` - Infinite scroll/virtual lists
- `useStudentStats` - Enrollment and health statistics

### Mutation Hooks - Data Modification

- `useStudentMutations` - Standard CRUD operations
- `useOptimisticStudents` - CRUD with optimistic updates
- `useStudentManagement` - High-level management operations
- `useCreateStudent`, `useUpdateStudent`, `useDeleteStudent` - Individual ops

### Composite Hooks - Complex Workflows

- `useStudentManager` - Complete student management interface
- `useStudentDashboard` - Dashboard metrics and statistics
- `useStudentProfile` - Full student profile with health data
- `useBulkStudentOperations` - Bulk update/transfer/export

## Usage Examples

### Basic Student List Query

```typescript
import { useStudents } from '@/hooks/domains/students';

function StudentList() {
  const { students, isLoading, pagination } = useStudents({
    grade: '5',
    isActive: true,
    page: 1,
    limit: 25
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      {students.map(student => (
        <StudentCard key={student.id} student={student} />
      ))}
      <Pagination {...pagination} />
    </div>
  );
}
```

### Student Enrollment with Optimistic Updates

```typescript
import { useOptimisticStudents } from '@/hooks/domains/students';

function EnrollmentForm() {
  const { createStudent, isCreating } = useOptimisticStudents();

  const handleSubmit = async (data) => {
    await createStudent.mutateAsync({
      studentNumber: 'STU-2024-001',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '2010-05-15',
      grade: '8',
      enrollmentDate: '2024-01-15',
      nurseId: 'nurse-123'
    });
    // Student appears in list immediately, confirmed by server
  };

  return <StudentForm onSubmit={handleSubmit} loading={isCreating} />;
}
```

### Complete Student Management Dashboard

```typescript
import { useStudentManager } from '@/hooks/domains/students';

function StudentManagementDashboard() {
  const manager = useStudentManager({
    enableRedux: true,
    enablePHI: true,
    initialFilters: { isActive: true }
  });

  return (
    <Dashboard>
      <SearchBar
        query={manager.search.query}
        onQueryChange={manager.search.setQuery}
        suggestions={manager.search.suggestions}
      />
      <FilterPanel
        filters={manager.filter.filters}
        onFilterChange={manager.filter.updateFilter}
        activeCount={manager.filter.activeCount}
      />
      <StudentGrid
        students={manager.students}
        loading={manager.isLoading}
        onUpdate={manager.operations.updateStudent}
        onDelete={manager.operations.deleteStudent}
      />
    </Dashboard>
  );
}
```

### Student Profile with Health Records (PHI)

```typescript
import { useStudentProfile } from '@/hooks/domains/students';

function StudentProfilePage({ studentId }: { studentId: string }) {
  const profile = useStudentProfile(studentId, {
    includeHealthRecords: true,
    includeMedications: true,
    enablePHI: true
  });

  // PHI access is automatically audit-logged
  return (
    <ProfileLayout>
      <BasicInfo student={profile.student} />
      <HealthSummary
        healthData={profile.healthData}
        medications={profile.healthData?.medications}
        allergies={profile.healthData?.allergies}
      />
      <ActivityTimeline timeline={profile.timeline} />
    </ProfileLayout>
  );
}
```

### Bulk Student Operations

```typescript
import { useBulkStudentOperations } from '@/hooks/domains/students';

function BulkOperationsPanel() {
  const bulk = useBulkStudentOperations({
    enableRedux: true,
    confirmationRequired: true
  });

  const handleBulkTransfer = async (newNurseId: string) => {
    await bulk.executeOperation('bulk-assign-nurse', {
      nurseId: newNurseId
    }, true); // Confirmation provided
    // All selected students transferred with audit logging
  };

  return (
    <Panel>
      <SelectionSummary count={bulk.selectedCount} />
      <OperationButtons
        operations={bulk.availableOperations}
        onExecute={bulk.executeOperation}
      />
    </Panel>
  );
}
```

## Integration

### TanStack Query Integration

All hooks use TanStack Query for:

- Intelligent caching with sensitivity-based strategies
- Automatic background refetching
- Optimistic updates with automatic rollback
- Request deduplication and batching
- Cache invalidation and synchronization

### Redux Integration (Optional)

Composite hooks can integrate with Redux for:

- UI state management (selection, view modes, filters)
- Cross-tab synchronization via BroadcastChannel
- Persistent user preferences
- Optimistic UI updates coordinated with server state

## References

- [TanStack Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [FERPA Guidance](https://www2.ed.gov/policy/gen/guid/fpco/ferpa/index.html)
- [HIPAA Compliance](https://www.hhs.gov/hipaa/index.html)
- See `useHealthcareCompliance` for audit logging implementation
- See `useCacheManager` for cache strategy configuration

## Version

**Version**: 3.0.0
**Author**: White Cross Healthcare Platform
