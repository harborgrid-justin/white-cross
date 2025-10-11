# Health Records Component Usage Guide

## Quick Reference for Developers

### 1. Main HealthRecords Page

**Location:** `F:\temp\white-cross\frontend\src\pages\HealthRecords.tsx`

**Key Features:**
- Auto-fetches health summary statistics
- Export to PDF/JSON
- Student selector integration
- Tab navigation

**Example Usage:**
```tsx
import HealthRecords from './pages/HealthRecords'

// In your router
<Route path="/health-records" element={<HealthRecords />} />
```

**API Hooks Used:**
```tsx
const { data: healthSummary, isLoading: summaryLoading } = useHealthSummary(studentId)
const exportMutation = useExportHealthHistory()
```

---

### 2. VitalsTab Component

**Location:** `F:\temp\white-cross\frontend\src\components\healthRecords\tabs\VitalsTab.tsx`

**Props:**
```tsx
interface VitalsTabProps {
  studentId: string
  user?: User | null
}
```

**Example Usage:**
```tsx
<VitalsTab
  studentId="student-123"
  user={currentUser}
/>
```

**Features:**
- Quick vital entry form
- Latest vitals display with color-coded indicators
- History table with abnormal value highlighting
- Trend indicators
- Normal range references

**API Hooks Used:**
```tsx
const { data: vitalsData, isLoading, refetch } = useRecentVitals(studentId, 20)
const recordVitalsMutation = useRecordVitals()
```

**Form Data Structure:**
```tsx
interface VitalEntry {
  timestamp: string
  temperature?: number
  bloodPressureSystolic?: number
  bloodPressureDiastolic?: number
  heartRate?: number
  respiratoryRate?: number
  oxygenSaturation?: number
  weight?: number
  height?: number
  notes?: string
}
```

---

### 3. AllergiesTab Component

**Location:** `F:\temp\white-cross\frontend\src\components\healthRecords\tabs\AllergiesTab.tsx`

**Props:**
```tsx
interface AllergiesTabProps {
  allergies: Allergy[]
  onAddAllergy: () => void
  onEditAllergy: (allergy: Allergy) => void
  user?: User | null
}
```

**Example Usage:**
```tsx
<AllergiesTab
  allergies={allergiesData}
  onAddAllergy={() => setShowAddModal(true)}
  onEditAllergy={(allergy) => handleEdit(allergy)}
  user={currentUser}
/>
```

**Features:**
- Life-threatening allergies prominently displayed
- Verification workflow with modal
- Delete confirmation
- EpiPen location tracking
- Summary statistics

**API Hooks Used:**
```tsx
const verifyAllergyMutation = useVerifyAllergy()
const deleteAllergyMutation = useDeleteAllergy()
```

**Allergy Type:**
```tsx
interface Allergy {
  id: string
  studentId?: string
  allergen: string
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING'
  verified: boolean
  reaction?: string
  treatment?: string
  epiPenLocation?: string
  providerName?: string
}
```

---

### 4. VaccinationsTab Component

**Location:** `F:\temp\white-cross\frontend\src\components\healthRecords\tabs\VaccinationsTab.tsx`

**Props:**
```tsx
interface VaccinationsTabProps {
  vaccinations: Vaccination[]
  searchQuery: string
  onSearchChange: (query: string) => void
  vaccinationFilter: string
  onFilterChange: (filter: string) => void
  vaccinationSort: string
  onSortChange: (sort: string) => void
  onRecordVaccination: () => void
  onEditVaccination: (vaccination: Vaccination) => void
  onDeleteVaccination: (vaccination: Vaccination) => void
  onScheduleVaccination: () => void
  user?: User | null
}
```

**Features:**
- Auto-calculated compliance statistics
- Upcoming vaccinations list
- Search and filter
- Sort options

**Statistics Calculations:**
```tsx
// Compliance percentage
const compliancePercentage = Math.round(
  (vaccinations.filter(v => v.compliant).length / vaccinations.length) * 100
)

// Missing vaccinations
const missing = vaccinations.filter(v => !v.compliant && !v.dateAdministered).length

// Overdue vaccinations
const overdue = vaccinations.filter(
  v => !v.compliant && v.dueDate && new Date(v.dueDate) < new Date()
).length
```

---

## Common Patterns

### 1. Loading States

All components implement loading skeletons:

```tsx
{isLoading ? (
  <div className="flex justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
) : (
  // Component content
)}
```

### 2. Empty States

Consistent empty state design:

```tsx
{data.length === 0 ? (
  <div className="text-center py-8 text-gray-600">
    <Icon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
    <p>No records found.</p>
  </div>
) : (
  // Data display
)}
```

### 3. Permission Checks

Role-based access control:

```tsx
const canModify = user?.role !== 'READ_ONLY' && user?.role !== 'VIEWER'

<button disabled={!canModify}>
  Add Record
</button>
```

### 4. Confirmation Modals

Standard confirmation pattern:

```tsx
{showConfirmModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 className="text-lg font-semibold mb-4">Confirm Action</h3>
      <p className="text-gray-700 mb-4">
        Are you sure you want to proceed?
      </p>
      <div className="flex gap-2 justify-end">
        <button onClick={() => setShowConfirmModal(false)} className="btn-secondary">
          Cancel
        </button>
        <button onClick={handleConfirm} className="btn-primary">
          Confirm
        </button>
      </div>
    </div>
  </div>
)}
```

---

## API Hook Patterns

### Query Hooks

Standard query usage:

```tsx
const { data, isLoading, error, refetch } = useQueryHook(params, {
  enabled: !!params,
  // Additional options
})
```

### Mutation Hooks

Standard mutation usage:

```tsx
const mutation = useMutationHook({
  onSuccess: (data) => {
    // Handle success
    toast.success('Operation successful')
  },
  onError: (error) => {
    // Error already handled by hook
    console.error(error)
  }
})

// Usage
const handleSubmit = async (data) => {
  try {
    await mutation.mutateAsync(data)
  } catch (error) {
    // Error already toasted
  }
}
```

---

## Styling Guidelines

### Color Coding

**Severity Levels:**
- Life-threatening: `text-red-600`, `bg-red-50`, `border-red-300`
- Severe: `text-orange-600`, `bg-orange-50`, `border-orange-300`
- Moderate: `text-yellow-600`, `bg-yellow-50`, `border-yellow-300`
- Mild: `text-yellow-500`, `bg-yellow-50`, `border-yellow-300`

**Status Indicators:**
- Success/Verified: `text-green-600`, `bg-green-50`, `border-green-200`
- Warning/Pending: `text-yellow-600`, `bg-yellow-50`, `border-yellow-200`
- Error/Overdue: `text-red-600`, `bg-red-50`, `border-red-200`
- Info: `text-blue-600`, `bg-blue-50`, `border-blue-200`

### Button Styles

```tsx
// Primary action
<button className="btn-primary">Save</button>

// Secondary action
<button className="btn-secondary">Cancel</button>

// Destructive action
<button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
  Delete
</button>
```

---

## Accessibility Checklist

✅ ARIA labels on all interactive elements
✅ Keyboard navigation support
✅ Screen reader announcements
✅ Proper heading hierarchy
✅ Color contrast compliance
✅ Focus indicators
✅ Alt text for icons (aria-hidden for decorative)

**Example:**
```tsx
<button
  className="btn-primary"
  data-testid="record-vitals-button"
  onClick={handleRecord}
  disabled={!canModify}
  aria-label="Record new vital signs"
>
  <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
  Record Vitals
</button>
```

---

## Testing Examples

### Unit Test

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { VitalsTab } from './VitalsTab'

describe('VitalsTab', () => {
  it('displays latest vitals', async () => {
    render(<VitalsTab studentId="123" user={mockUser} />)

    await screen.findByText('Latest Vital Signs')
    expect(screen.getByText('98.6°F')).toBeInTheDocument()
  })

  it('shows entry form when button clicked', () => {
    render(<VitalsTab studentId="123" user={mockUser} />)

    fireEvent.click(screen.getByTestId('record-vitals-button'))
    expect(screen.getByTestId('vitals-entry-form')).toBeInTheDocument()
  })
})
```

### E2E Test

```tsx
describe('Allergy Verification', () => {
  it('should verify an allergy', () => {
    cy.visit('/health-records')
    cy.get('[data-testid="allergies-tab"]').click()
    cy.contains('Verify').first().click()
    cy.contains('Verify Allergy').should('be.visible')
    cy.get('.btn-primary').contains('Verify Allergy').click()
    cy.contains('Allergy verified successfully').should('be.visible')
  })
})
```

---

## Common Issues & Solutions

### Issue: Toast not appearing
**Solution:** Ensure `react-hot-toast` Toaster is in App component:
```tsx
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
      <Toaster position="top-right" />
      {/* Rest of app */}
    </>
  )
}
```

### Issue: Export not downloading
**Solution:** Check browser popup blocker settings and ensure blob handling:
```tsx
const url = window.URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = filename
document.body.appendChild(a)
a.click()
window.URL.revokeObjectURL(url)
document.body.removeChild(a)
```

### Issue: Vitals showing wrong student
**Solution:** Ensure studentId prop updates trigger refetch:
```tsx
useEffect(() => {
  if (studentId) {
    refetch()
  }
}, [studentId, refetch])
```

---

## Performance Tips

1. **Memoize expensive calculations:**
```tsx
const filteredData = useMemo(() => {
  return data.filter(item => item.matches(filter))
}, [data, filter])
```

2. **Debounce search inputs:**
```tsx
const debouncedSearch = useDebounce(searchQuery, 300)
```

3. **Virtualize long lists:**
```tsx
// For lists > 100 items, consider react-window
import { FixedSizeList } from 'react-window'
```

4. **Code split heavy components:**
```tsx
const HeavyComponent = lazy(() => import('./HeavyComponent'))
```

---

## Support & Documentation

- **API Hooks:** See `F:\temp\white-cross\frontend\src\hooks\useHealthRecords.ts`
- **Type Definitions:** See `F:\temp\white-cross\frontend\src\types\healthRecords.ts`
- **Component Tests:** See `F:\temp\white-cross\frontend\src\components\healthRecords\__tests__`
- **Cypress E2E:** See `F:\temp\white-cross\frontend\cypress\e2e\04-medication-management`

For questions or issues, refer to the project's main CLAUDE.md file.
