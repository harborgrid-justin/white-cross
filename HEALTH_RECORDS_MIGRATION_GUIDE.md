# Health Records Frontend Migration Guide

## Overview
This guide helps developers migrate from the old health records implementation to the new comprehensive API-integrated version.

---

## Breaking Changes

### 1. Removed Mock Data

**Before:**
```tsx
const mockAllergies = [
  { id: '1', allergen: 'Peanuts', severity: 'SEVERE' },
  // ... more mock data
]
```

**After:**
```tsx
// Data comes from API hooks
const { data: allergies } = useAllergies(studentId)
```

### 2. Component Props Changes

#### AllergiesTab

**Before:**
```tsx
<AllergiesTab
  allergies={mockAllergies}
  onAddAllergy={() => {}}
  onEditAllergy={() => {}}
/>
```

**After:**
```tsx
<AllergiesTab
  allergies={allergiesData || []}  // Must handle undefined
  onAddAllergy={handleAddAllergy}
  onEditAllergy={handleEditAllergy}
  user={currentUser}  // NEW: Required for permissions
/>
```

#### VaccinationsTab

**Before:**
```tsx
<VaccinationsTab vaccinations={mockData} />
```

**After:**
```tsx
<VaccinationsTab
  vaccinations={vaccinationsData || []}
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  vaccinationFilter={filter}
  onFilterChange={setFilter}
  vaccinationSort={sort}
  onSortChange={setSort}
  onRecordVaccination={handleRecord}
  onEditVaccination={handleEdit}
  onDeleteVaccination={handleDelete}
  onScheduleVaccination={handleSchedule}
  user={currentUser}
/>
```

### 3. Statistics Display

**Before:**
```tsx
<StatsCard title="Total Records" value="247" trend="+12 this month" />
```

**After:**
```tsx
const { data: healthSummary, isLoading } = useHealthSummary(studentId)

<StatsCard
  title="Total Records"
  value={healthSummary?.totalRecords || 0}
  trend={`${healthSummary?.recentRecordsCount || 0} this month`}
/>
```

---

## Migration Steps

### Step 1: Update Imports

**Add new imports:**
```tsx
// API hooks
import {
  useHealthSummary,
  useAllergies,
  useVaccinations,
  useRecentVitals,
  useVerifyAllergy,
  useDeleteAllergy,
  useExportHealthHistory
} from '../hooks/useHealthRecords'

// Toast notifications
import toast from 'react-hot-toast'

// New components
import { VitalsTab } from '../components/healthRecords/tabs/VitalsTab'
```

### Step 2: Replace Mock Data with API Hooks

**Before:**
```tsx
const [allergies, setAllergies] = useState(mockAllergies)
```

**After:**
```tsx
const { data: allergies, isLoading: allergiesLoading } = useAllergies(studentId)
```

### Step 3: Add Loading States

**Pattern:**
```tsx
{isLoading ? (
  <div className="flex justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
) : data ? (
  <ComponentWithData data={data} />
) : (
  <EmptyState />
)}
```

### Step 4: Implement Error Handling

**Add error boundaries:**
```tsx
const { data, error, isLoading } = useHealthRecords(studentId)

if (error) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <p className="text-red-800">Failed to load health records</p>
      <button onClick={() => refetch()} className="btn-secondary mt-2">
        Retry
      </button>
    </div>
  )
}
```

### Step 5: Update Mutation Handlers

**Before:**
```tsx
const handleDelete = (id: string) => {
  setAllergies(allergies.filter(a => a.id !== id))
  alert('Deleted')
}
```

**After:**
```tsx
const deleteMutation = useDeleteAllergy()

const handleDelete = async (allergy: Allergy) => {
  try {
    await deleteMutation.mutateAsync({
      id: allergy.id,
      studentId: allergy.studentId
    })
    // Success toast handled by hook
  } catch (error) {
    // Error toast handled by hook
  }
}
```

### Step 6: Add Permission Checks

**Pattern:**
```tsx
const canModify = user?.role !== 'READ_ONLY' && user?.role !== 'VIEWER'

<button
  onClick={handleAdd}
  disabled={!canModify}
  className="btn-primary"
>
  Add Record
</button>
```

---

## Component-Specific Migrations

### AllergiesTab Migration

**Steps:**
1. Remove mock allergy data
2. Add `useAllergies()` hook
3. Add `useVerifyAllergy()` hook
4. Add `useDeleteAllergy()` hook
5. Add verification modal state
6. Add delete confirmation modal state
7. Separate life-threatening allergies
8. Add summary statistics

**Example:**
```tsx
// OLD
const AllergiesTab = ({ allergies, onAdd, onEdit }) => {
  return (
    <div>
      {allergies.map(allergy => (
        <div key={allergy.id}>{allergy.allergen}</div>
      ))}
    </div>
  )
}

// NEW
const AllergiesTab = ({ allergies, onAdd, onEdit, user }) => {
  const verifyMutation = useVerifyAllergy()
  const deleteMutation = useDeleteAllergy()
  const [verifying, setVerifying] = useState(null)

  const lifeThreatening = allergies.filter(a => a.severity === 'LIFE_THREATENING')
  const others = allergies.filter(a => a.severity !== 'LIFE_THREATENING')

  return (
    <div className="space-y-6">
      {/* Life-threatening section */}
      {lifeThreatening.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
          <h4 className="text-lg font-bold text-red-900">LIFE-THREATENING ALLERGIES</h4>
          {/* ... */}
        </div>
      )}

      {/* Others section */}
      {/* ... */}
    </div>
  )
}
```

### VaccinationsTab Migration

**Steps:**
1. Remove hardcoded statistics
2. Calculate from actual data
3. Derive upcoming from main list
4. Add filter/sort props
5. Use proper hooks

**Example:**
```tsx
// OLD - Hardcoded
<div className="text-2xl font-bold text-green-700">85%</div>

// NEW - Calculated
<div className="text-2xl font-bold text-green-700">
  {vaccinations.length > 0
    ? Math.round((vaccinations.filter(v => v.compliant).length / vaccinations.length) * 100)
    : 0}%
</div>
```

### VitalsTab Migration (New Component)

**Implementation:**
```tsx
import { VitalsTab } from '../components/healthRecords/tabs/VitalsTab'

// In HealthRecords page
{activeTab === 'vitals' && (
  <VitalsTab
    studentId={selectedStudent?.id || '1'}
    user={user}
  />
)}
```

---

## Data Flow Changes

### Before (Mock Data)
```
Component → useState(mockData) → Display
```

### After (API Integration)
```
Component → useQuery(API) → React Query Cache → Display
                ↓
          Automatic refetch on mutations
```

---

## Common Migration Patterns

### Pattern 1: Replace useState with useQuery

**Before:**
```tsx
const [data, setData] = useState([])

useEffect(() => {
  fetchData().then(setData)
}, [])
```

**After:**
```tsx
const { data } = useQuery({
  queryKey: ['data', id],
  queryFn: () => fetchData(id)
})
```

### Pattern 2: Replace Manual Updates with Mutations

**Before:**
```tsx
const handleUpdate = (id, newData) => {
  setData(data.map(item =>
    item.id === id ? { ...item, ...newData } : item
  ))
}
```

**After:**
```tsx
const updateMutation = useUpdateMutation()

const handleUpdate = async (id, newData) => {
  await updateMutation.mutateAsync({ id, data: newData })
  // Cache automatically updated
}
```

### Pattern 3: Replace Alerts with Toasts

**Before:**
```tsx
alert('Success!')
```

**After:**
```tsx
toast.success('Operation successful')
```

---

## Testing Updates

### Update Unit Tests

**Before:**
```tsx
it('displays allergies', () => {
  const allergies = [mockAllergy1, mockAllergy2]
  render(<AllergiesTab allergies={allergies} />)
  expect(screen.getByText('Peanuts')).toBeInTheDocument()
})
```

**After:**
```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

it('displays allergies', async () => {
  const queryClient = new QueryClient()

  render(
    <QueryClientProvider client={queryClient}>
      <AllergiesTab
        allergies={mockAllergies}
        onAddAllergy={jest.fn()}
        onEditAllergy={jest.fn()}
        user={mockUser}
      />
    </QueryClientProvider>
  )

  expect(screen.getByText('Peanuts')).toBeInTheDocument()
})
```

### Update E2E Tests

**Add data-testid attributes:**
```tsx
<button data-testid="verify-allergy-button">Verify</button>
<div data-testid="life-threatening-section">...</div>
<table data-testid="vitals-table">...</table>
```

**Update Cypress tests:**
```tsx
cy.get('[data-testid="verify-allergy-button"]').click()
cy.contains('Allergy verified successfully').should('be.visible')
```

---

## Performance Considerations

### 1. Optimize Re-renders

**Use memo for expensive operations:**
```tsx
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.date.localeCompare(b.date))
}, [data])
```

### 2. Implement Query Caching

**React Query handles this automatically:**
```tsx
// Data cached for 5 minutes by default
const { data } = useHealthRecords(studentId)

// Manual cache configuration
const { data } = useHealthRecords(studentId, {
  staleTime: 10 * 60 * 1000, // 10 minutes
  cacheTime: 30 * 60 * 1000  // 30 minutes
})
```

### 3. Lazy Load Heavy Components

```tsx
const GrowthChartsTab = lazy(() =>
  import('../components/healthRecords/tabs/GrowthChartsTab')
)

<Suspense fallback={<LoadingSpinner />}>
  <GrowthChartsTab />
</Suspense>
```

---

## Rollback Plan

If issues arise during migration:

### Phase 1: Immediate Rollback
```bash
git revert <commit-hash>
git push
```

### Phase 2: Feature Flag
```tsx
const USE_NEW_HEALTH_RECORDS = process.env.REACT_APP_NEW_HEALTH_RECORDS === 'true'

{USE_NEW_HEALTH_RECORDS ? (
  <NewHealthRecordsComponent />
) : (
  <OldHealthRecordsComponent />
)}
```

### Phase 3: Gradual Migration
```tsx
// Migrate one tab at a time
const MIGRATED_TABS = ['vitals', 'allergies']

{MIGRATED_TABS.includes(activeTab) ? (
  <NewTabComponent />
) : (
  <OldTabComponent />
)}
```

---

## Checklist

### Pre-Migration
- [ ] Backup current codebase
- [ ] Review API documentation
- [ ] Test API endpoints
- [ ] Update environment variables
- [ ] Install new dependencies
- [ ] Update TypeScript types

### During Migration
- [ ] Update imports
- [ ] Replace mock data with hooks
- [ ] Add loading states
- [ ] Add error handling
- [ ] Implement permission checks
- [ ] Add confirmation modals
- [ ] Update tests

### Post-Migration
- [ ] Run all unit tests
- [ ] Run all E2E tests
- [ ] Test in staging environment
- [ ] Performance testing
- [ ] Accessibility audit
- [ ] User acceptance testing
- [ ] Update documentation
- [ ] Deploy to production

---

## Troubleshooting

### Issue: "Cannot read property of undefined"
**Cause:** Data not loaded yet
**Solution:** Add optional chaining and null checks
```tsx
const value = data?.field || defaultValue
```

### Issue: "Query not refetching after mutation"
**Cause:** Cache not invalidated
**Solution:** Check mutation's `onSuccess` invalidates queries
```tsx
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['allergies'] })
}
```

### Issue: "Infinite loading spinner"
**Cause:** Query never resolves
**Solution:** Check network tab and add error handling
```tsx
const { data, error, isLoading } = useQuery(...)

if (error) return <ErrorComponent />
if (isLoading) return <LoadingSpinner />
return <DataDisplay data={data} />
```

### Issue: "Permission errors"
**Cause:** User role not passed to component
**Solution:** Ensure user prop is passed
```tsx
<Component user={currentUser} />
```

---

## Support Resources

- **API Documentation:** `/docs/api/health-records-api.md`
- **Hook Documentation:** `/frontend/src/hooks/useHealthRecords.ts`
- **Component Examples:** `/frontend/src/components/healthRecords/tabs/`
- **Test Examples:** `/frontend/src/components/healthRecords/__tests__/`
- **Cypress Tests:** `/frontend/cypress/e2e/04-medication-management/`

For additional support, contact the development team or open an issue in the project repository.

---

## Timeline

**Recommended Migration Schedule:**

- **Week 1:** Update types and hooks
- **Week 2:** Migrate AllergiesTab and VaccinationsTab
- **Week 3:** Migrate VitalsTab (new) and RecordsTab
- **Week 4:** Testing and bug fixes
- **Week 5:** Staging deployment and UAT
- **Week 6:** Production deployment

**Total Estimated Time:** 6 weeks for full migration and testing
