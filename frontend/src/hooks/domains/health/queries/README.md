# Health Records Hooks

Enterprise-grade React Query hooks for health records management with HIPAA compliance and healthcare-appropriate caching strategies.

## Overview

This directory contains modular, type-safe React Query hooks for managing all aspects of student health records in a healthcare context. The hooks are organized by domain for clarity and maintainability.

## File Structure

```
queries/
├── types.ts                         # Shared type definitions and error classes
├── healthRecordsConfig.ts           # Cache configuration and query key factory
├── healthRecordsUtils.ts            # Error handling and retry utilities
├── useHealthRecordsQueries.ts       # Core health records read operations
├── useHealthRecordsMutations.ts     # Core health records write operations
├── useAllergies.ts                  # Allergy management hooks (safety critical)
├── useChronicConditions.ts          # Chronic condition tracking hooks
├── useVaccinations.ts               # Vaccination compliance hooks
├── useScreenings.ts                 # Health screening tracking hooks
├── useGrowthMeasurements.ts         # Growth measurement and trend hooks
├── useVitalSigns.ts                 # Real-time vital signs hooks (critical)
└── index.ts                         # Barrel export (use this for imports)
```

## Usage

### Basic Import (Recommended)

Import from the barrel export for backward compatibility and convenience:

```typescript
import {
  useHealthRecords,
  useAllergies,
  useVaccinations,
  useVitalSigns,
} from '@/hooks/domains/health/queries';
```

### Specific Module Import (Advanced)

For better tree-shaking in large applications:

```typescript
import { useHealthRecords } from '@/hooks/domains/health/queries/useHealthRecordsQueries';
import { useAllergies } from '@/hooks/domains/health/queries/useAllergies';
```

## Available Hooks

### Core Health Records

**Queries:**
- `useHealthRecords()` - Fetch all health records for a student
- `useHealthRecordDetail()` - Fetch a single health record by ID
- `useHealthRecordTimeline()` - Fetch chronological health record timeline
- `useHealthRecordSummary()` - Fetch health summary
- `useHealthRecordSearch()` - Search health records
- `useHealthRecordsByType()` - Filter health records by type
- `usePaginatedHealthRecords()` - Fetch paginated health records

**Mutations:**
- `useCreateHealthRecord()` - Create a new health record
- `useUpdateHealthRecord()` - Update an existing health record
- `useDeleteHealthRecord()` - Delete a health record
- `useExportHealthRecords()` - Export health records to PDF/JSON
- `useImportHealthRecords()` - Import health records from file

**Utilities:**
- `useHealthRecordsCleanup()` - HIPAA-compliant automatic data cleanup

### Allergies (Safety Critical - NO CACHE)

**Queries:**
- `useAllergies()` - Fetch all allergies (always fresh data)
- `useCriticalAllergies()` - Fetch life-threatening allergies only
- `useAllergyContraindications()` - Check medication contraindications

**Mutations:**
- `useCreateAllergy()` - Add new allergy
- `useUpdateAllergy()` - Update allergy details
- `useDeleteAllergy()` - Remove allergy record
- `useVerifyAllergy()` - Verify allergy record

### Chronic Conditions

**Queries:**
- `useChronicConditions()` - Fetch all chronic conditions
- `useActiveConditions()` - Fetch active conditions only

**Mutations:**
- `useCreateCondition()` - Add new chronic condition
- `useUpdateCondition()` - Update condition details
- `useDeleteCondition()` - Remove condition
- `useUpdateConditionStatus()` - Update condition status

### Vaccinations

**Queries:**
- `useVaccinations()` - Fetch vaccination records
- `useVaccinationCompliance()` - Check compliance status
- `useUpcomingVaccinations()` - Get upcoming vaccinations due

**Mutations:**
- `useCreateVaccination()` - Record new vaccination
- `useUpdateVaccination()` - Update vaccination record
- `useDeleteVaccination()` - Remove vaccination record

### Health Screenings

**Queries:**
- `useScreenings()` - Fetch screening records

**Mutations:**
- `useCreateScreening()` - Record new screening
- `useUpdateScreening()` - Update screening record
- `useDeleteScreening()` - Remove screening record

### Growth Measurements

**Queries:**
- `useGrowthMeasurements()` - Fetch growth measurements
- `useGrowthTrends()` - Calculate growth trends (height, weight, BMI)
- `useGrowthPercentiles()` - Get latest percentiles

**Mutations:**
- `useCreateGrowthMeasurement()` - Record new measurement
- `useUpdateGrowthMeasurement()` - Update measurement
- `useDeleteGrowthMeasurement()` - Remove measurement

### Vital Signs (Real-time Critical - NO CACHE)

**Queries:**
- `useVitalSigns()` - Fetch vital signs (always fresh data)
- `useLatestVitals()` - Get most recent vital signs

**Mutations:**
- `useCreateVitalSigns()` - Record new vital signs
- `useUpdateVitalSigns()` - Update vital signs
- `useDeleteVitalSigns()` - Remove vital signs record

## Healthcare Safety Features

### NO CACHE Policy

Critical health data has **NO CACHE** to ensure safety:

- **Allergies**: `staleTime: 0` - Always fetch fresh (life-threatening risk)
- **Vital Signs**: `staleTime: 0` - Always fetch fresh (real-time critical)

### NO Optimistic Updates

All mutations wait for server confirmation before updating cache:

```typescript
// Healthcare safety: NO optimistic updates
onSuccess: (data) => {
  // Only update cache AFTER successful server response
  queryClient.invalidateQueries({ queryKey: healthRecordKeys.allergies(studentId) });
}
```

### PHI-Safe Error Messages

Error messages are scrubbed of Protected Health Information (PHI):

```typescript
// PHI removed from error messages
if (error.message.includes('student') || error.message.includes('patient')) {
  toast.error('Unable to access health records. Please contact support.');
}
```

### HIPAA-Compliant Auto Cleanup

Automatic data cleanup after 15 minutes of inactivity:

```typescript
useHealthRecordsCleanup(studentId);
// Removes all health data from cache on unmount or timeout
```

## Cache Strategy

Healthcare-appropriate cache times based on data criticality:

```typescript
const STALE_TIME = {
  HEALTH_RECORDS: 5 * 60 * 1000,      // 5 minutes
  ALLERGIES: 0,                        // NO CACHE - safety critical
  CHRONIC_CONDITIONS: 5 * 60 * 1000,   // 5 minutes
  VACCINATIONS: 10 * 60 * 1000,        // 10 minutes
  GROWTH: 15 * 60 * 1000,              // 15 minutes - stable data
  SCREENINGS: 10 * 60 * 1000,          // 10 minutes
  VITALS: 0,                           // NO CACHE - real-time critical
};
```

## Query Key Factory

Hierarchical query keys for granular cache control:

```typescript
healthRecordKeys.all                                    // ['healthRecords']
healthRecordKeys.records(studentId)                     // ['healthRecords', 'records', studentId]
healthRecordKeys.allergies(studentId)                   // ['healthRecords', 'allergies', studentId]
healthRecordKeys.criticalAllergies(studentId)          // ['healthRecords', 'criticalAllergies', studentId]
```

## Error Handling

### Circuit Breaker Awareness

```typescript
if (error instanceof CircuitBreakerError) {
  toast.error('Service temporarily unavailable. Please try again in a few moments.');
}
```

### Retry Logic

Exponential backoff with smart retry decisions:

```typescript
retry: shouldRetry,  // Don't retry on 400, 401, 403, 404, 422
retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
```

## Example Usage

### Fetching Health Records

```typescript
function HealthRecordsView({ studentId }: { studentId: string }) {
  const { data: records, isLoading, error } = useHealthRecords(studentId);

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return <RecordsList records={records} />;
}
```

### Managing Allergies (Safety Critical)

```typescript
function AllergyManagement({ studentId }: { studentId: string }) {
  // Always fetches fresh data (NO CACHE)
  const { data: allergies } = useAllergies(studentId);
  const createAllergy = useCreateAllergy();

  const handleAddAllergy = (allergyData) => {
    createAllergy.mutate({
      studentId,
      ...allergyData,
    });
  };

  return <AllergyForm allergies={allergies} onSubmit={handleAddAllergy} />;
}
```

### HIPAA-Compliant Data Cleanup

```typescript
function HealthRecordsPage({ studentId }: { studentId: string }) {
  // Automatically cleans up data on unmount or after 15 minutes of inactivity
  useHealthRecordsCleanup(studentId);

  return <HealthRecordsContent studentId={studentId} />;
}
```

## TypeScript Support

All hooks are fully typed with TypeScript:

```typescript
const { data: allergies } = useAllergies(studentId);
// allergies: Allergy[] | undefined

const { data: vitals } = useLatestVitals(studentId);
// vitals: VitalSigns | undefined
```

## Migration from Old Structure

The breakdown maintains 100% backward compatibility. No code changes required:

```typescript
// Old import - still works
import { useHealthRecords } from '@/hooks/domains/health/queries';

// New specific import - also works
import { useHealthRecords } from '@/hooks/domains/health/queries/useHealthRecordsQueries';
```

## File Size Metrics

All files are optimized for maintainability (under 300 LOC):

| File | Lines | Purpose |
|------|-------|---------|
| types.ts | 52 | Type definitions |
| healthRecordsConfig.ts | 123 | Configuration |
| healthRecordsUtils.ts | 75 | Utilities |
| useHealthRecordsQueries.ts | 294 | Core queries |
| useHealthRecordsMutations.ts | 187 | Core mutations |
| useAllergies.ts | 257 | Allergy domain |
| useChronicConditions.ts | 259 | Conditions domain |
| useVaccinations.ts | 267 | Vaccinations domain |
| useScreenings.ts | 211 | Screenings domain |
| useGrowthMeasurements.ts | 258 | Growth domain |
| useVitalSigns.ts | 210 | Vitals domain |
| index.ts | 116 | Barrel exports |

## Best Practices

1. **Always use the cleanup hook** for HIPAA compliance:
   ```typescript
   useHealthRecordsCleanup(studentId);
   ```

2. **Never cache safety-critical data** - allergies and vital signs already have NO CACHE

3. **Wait for server confirmation** - all mutations use proper invalidation, no optimistic updates

4. **Use PHI-safe error messages** - errors are automatically scrubbed by `handleQueryError()`

5. **Leverage query key factory** for precise cache invalidation:
   ```typescript
   queryClient.invalidateQueries({ queryKey: healthRecordKeys.allergies(studentId) });
   ```

## Related Documentation

- [React Query Docs](https://tanstack.com/query/latest)
- [HIPAA Compliance Guidelines](https://www.hhs.gov/hipaa)
- [Healthcare Data Security Best Practices](https://www.healthit.gov/topic/privacy-security-and-hipaa)

## Support

For questions or issues with these hooks, please contact the development team or file an issue in the project repository.
