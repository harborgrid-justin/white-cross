# Redux Store Quick Reference Card

## Import Everything from `@/stores`

```typescript
import {
  // Core hooks
  useAppDispatch,
  useAppSelector,

  // Auth
  useCurrentUser,
  useIsAuthenticated,
  useAuthActions,

  // Students
  useStudents,
  useStudentsActions,
  useActiveStudents,
  useStudentsByGrade,

  // Medications
  useMedications,
  useMedicationsActions,
  useMedicationsDueToday,
  useMedicationsByStudent,

  // Health Records
  useHealthRecords,
  useHealthRecordsActions,
  useHealthRecordsByStudent,

  // Appointments
  useAppointments,
  useAppointmentsActions,
  useUpcomingAppointments,

  // Incidents
  useIncidentReports,
  useIncidentActions,

  // Emergency Contacts
  useEmergencyContacts,
  useEmergencyContactsActions,
  useContactsByStudent,

  // Documents
  useDocuments,
  useDocumentsActions,
  useDocumentsByStudent,

  // Communication
  useMessages,
  useCommunicationActions,
  useUnreadMessages,

  // Inventory
  useInventoryItems,
  useInventoryActions,
  useLowStockItems,
  useExpiredItems,

  // Reports
  useReports,
  useReportsActions,

  // Administration
  useUsers,
  useUsersActions,
  useDistricts,
  useDistrictsActions,
  useSchools,
  useSchoolsActions,
  useSettings,
  useSettingsActions,

  // Types
  type RootState,
  type AppDispatch,
} from '@/stores';
```

## Common Patterns

### Fetch Data on Mount

```typescript
function MyComponent() {
  const { fetchAll } = useStudentsActions();
  const students = useStudents();

  useEffect(() => {
    fetchAll({ active: true });
  }, [fetchAll]);

  return <div>{/* render */}</div>;
}
```

### Create with Error Handling

```typescript
function CreateForm() {
  const { create } = useStudentsActions();

  const handleSubmit = async (data) => {
    try {
      await create(data).unwrap();
      toast.success('Created successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return <form onSubmit={handleSubmit}>{/* fields */}</form>;
}
```

### Get Entity by ID

```typescript
function StudentDetail({ studentId }: { studentId: string }) {
  const student = useStudentById(studentId);
  const { fetchById } = useStudentsActions();

  useEffect(() => {
    fetchById(studentId);
  }, [studentId, fetchById]);

  if (!student) return <div>Loading...</div>;

  return <div>{student.firstName} {student.lastName}</div>;
}
```

### Filter and Sort

```typescript
function StudentsByGrade({ grade }: { grade: string }) {
  const students = useStudentsByGrade(grade);
  // Already filtered by grade!

  return (
    <ul>
      {students.map(s => <li key={s.id}>{s.firstName}</li>)}
    </ul>
  );
}
```

### Check Loading State

```typescript
function MyComponent() {
  const students = useStudents();
  const loading = useAppSelector(state => state.students.loading.list.isLoading);
  const error = useAppSelector(state => state.students.loading.list.error);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return <StudentsList students={students} />;
}
```

### Update with Optimistic UI

```typescript
function QuickStatusUpdate({ incidentId, newStatus }) {
  const { optimisticUpdate, updateReport } = useIncidentActions();

  const handleUpdate = async () => {
    // Update UI immediately
    optimisticUpdate(incidentId, { status: newStatus });

    try {
      // Then sync with server
      await updateReport(incidentId, { status: newStatus }).unwrap();
    } catch (error) {
      // Redux automatically reverts on error
      toast.error('Failed to update');
    }
  };

  return <button onClick={handleUpdate}>Update Status</button>;
}
```

### Bulk Operations

```typescript
function BulkDelete() {
  const { bulkDelete } = useStudentsActions();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleBulkDelete = async () => {
    try {
      await bulkDelete(selectedIds);
      toast.success(`Deleted ${selectedIds.length} items`);
      setSelectedIds([]);
    } catch (error) {
      toast.error('Bulk delete failed');
    }
  };

  return <button onClick={handleBulkDelete}>Delete Selected</button>;
}
```

### Multiple Related Entities

```typescript
function StudentProfile({ studentId }) {
  const student = useStudentById(studentId);
  const medications = useMedicationsByStudent(studentId);
  const appointments = useAppointmentsByStudent(studentId);
  const contacts = useContactsByStudent(studentId);

  // All related data in one component!

  return (
    <div>
      <h1>{student?.firstName}</h1>
      <MedicationsList items={medications} />
      <AppointmentsList items={appointments} />
      <ContactsList items={contacts} />
    </div>
  );
}
```

### Custom Selector

```typescript
// Use built-in selector
const activeStudents = useActiveStudents();

// Or create custom selector
const criticalStudents = useAppSelector((state) => {
  const students = Object.values(state.students.entities);
  return students.filter(s => s?.hasCriticalCondition);
});
```

## All Available Hooks

### Auth Domain
- `useCurrentUser()` - Get authenticated user
- `useIsAuthenticated()` - Check auth status
- `useAuthLoading()` - Auth loading state
- `useAuthError()` - Auth error
- `useAuthActions()` - { login, logout, register, refreshUser, clearError, setUser }

### Students Domain
- `useStudents()` - All students
- `useStudentById(id)` - Single student
- `useActiveStudents()` - Active only
- `useStudentsByGrade(grade)` - Filter by grade
- `useStudentsByNurse(nurseId)` - By nurse
- `useStudentsWithAllergies()` - Has allergies
- `useStudentsWithMedications()` - Has medications
- `useStudentsActions()` - { fetchAll, fetchById, create, update, delete, bulkDelete }

### Medications Domain
- `useMedications()` - All medications
- `useActiveMedications()` - Active only
- `useMedicationsByStudent(studentId)` - By student
- `useMedicationsDueToday()` - Due today
- `useMedicationsActions()` - { fetchAll, fetchById, create, update, delete }

### Health Records Domain
- `useHealthRecords()` - All records
- `useHealthRecordsByStudent(studentId)` - By student
- `useHealthRecordsActions()` - { fetchAll, fetchById, create, update, delete }

### Appointments Domain
- `useAppointments()` - All appointments
- `useUpcomingAppointments()` - Upcoming only
- `useAppointmentsByStudent(studentId)` - By student
- `useAppointmentsActions()` - { fetchAll, fetchById, create, update, delete }

### Emergency Contacts Domain
- `useEmergencyContacts()` - All contacts
- `useContactsByStudent(studentId)` - By student
- `useEmergencyContactsActions()` - { fetchAll, fetchById, create, update, delete }

### Documents Domain
- `useDocuments()` - All documents
- `useDocumentsByStudent(studentId)` - By student
- `useDocumentsActions()` - { fetchAll, fetchById, create, update, delete }

### Communication Domain
- `useMessages()` - All messages
- `useUnreadMessages()` - Unread only
- `useCommunicationActions()` - { fetchAll, fetchById, create, update, delete }

### Inventory Domain
- `useInventoryItems()` - All items
- `useLowStockItems()` - Low stock alerts
- `useExpiredItems()` - Expired items
- `useInventoryActions()` - { fetchAll, fetchById, create, update, delete }

### Incidents Domain
- `useIncidentReports()` - All incidents
- `useCurrentIncident()` - Selected incident
- `useWitnessStatements()` - Witness statements
- `useFollowUpActions()` - Follow-up actions
- `useIncidentActions()` - { fetchReports, createReport, updateReport, deleteReport, ... }

### Administration
- `useUsers()` - All users
- `useUsersByRole(role)` - By role
- `useUsersActions()` - User CRUD
- `useDistricts()` - All districts
- `useDistrictsActions()` - District CRUD
- `useSchools()` - All schools
- `useSchoolsByDistrict(districtId)` - By district
- `useSchoolsActions()` - School CRUD
- `useSettings()` - System settings
- `useSettingsActions()` - Settings CRUD

## State Structure

```typescript
RootState = {
  auth: { user, isAuthenticated, isLoading, error },
  students: { entities, ids, loading, filters, pagination },
  medications: { entities, ids, loading, filters, pagination },
  healthRecords: { entities, ids, loading, filters, pagination },
  appointments: { entities, ids, loading, filters, pagination },
  emergencyContacts: { entities, ids, loading, filters, pagination },
  documents: { entities, ids, loading, filters, pagination },
  communication: { entities, ids, loading, filters, pagination },
  inventory: { entities, ids, loading, filters, pagination },
  incidentReports: { reports, selectedReport, witnessStatements, followUpActions },
  users: { entities, ids, loading, filters, pagination },
  districts: { entities, ids, loading, filters, pagination },
  schools: { entities, ids, loading, filters, pagination },
  settings: { entities, ids, loading, filters, pagination },
  reports: { entities, ids, loading, filters, pagination },
  enterprise: { bulkOperations, auditTrail, dataSync },
  orchestration: { workflows, executions },
}
```

## Action Patterns

### Standard Actions (All Slices)
```typescript
const actions = useEntityActions();
actions.fetchAll(filters?)    // GET /entity
actions.fetchById(id)          // GET /entity/:id
actions.create(data)           // POST /entity
actions.update({ id, data })   // PUT /entity/:id
actions.delete(id)             // DELETE /entity/:id
actions.bulkDelete(ids)        // DELETE /entity/bulk
```

### Unwrap for Error Handling
```typescript
try {
  const result = await actions.create(data).unwrap();
  // result is the created entity
} catch (error) {
  // error is the API error
}
```

## Documentation

- **Architecture**: `stores/README.md`
- **Examples**: `stores/USAGE_EXAMPLES.md`
- **Integration**: `stores/INTEGRATION_COMPLETE.md`
- **Quick Ref**: This file

## Redux DevTools

Open Redux DevTools in browser to:
- ✅ Inspect current state
- ✅ View action history
- ✅ Time-travel debugging
- ✅ Monitor performance

---

**Remember: Always import from `@/stores`** ✅
