# Health Queries Breakdown Plan (H7K9M2)

## Objective
Break down useHealthQueries.ts (745 LOC) into smaller, maintainable modules (max 300 LOC each) while maintaining all functionality and backward compatibility.

## File Analysis
Current file contains:
- Patient queries (3 hooks, ~105 LOC)
- Appointment queries (5 hooks, ~90 LOC)
- Medical record queries (3 hooks, ~80 LOC)
- Provider queries (3 hooks, ~70 LOC)
- Facility queries (2 hooks, ~60 LOC)
- Vital signs queries (2 hooks, ~40 LOC)
- Medication queries (1 hook, ~30 LOC)
- Allergy queries (1 hook, ~30 LOC)
- Lab result queries (1 hook, ~35 LOC)
- Clinical alert queries (3 hooks, ~50 LOC)
- Analytics queries (4 hooks, ~110 LOC)

## Proposed Module Structure

### 1. usePatientAppointmentQueries.ts (~195 LOC)
- Patient queries (usePatients, usePatient, usePatientSearch)
- Appointment queries (useAppointments, useAppointment, useAppointmentsByPatient, useAppointmentsByProvider, useAppointmentsToday)

### 2. useMedicalRecordProviderQueries.ts (~210 LOC)
- Medical record queries (useMedicalRecords, useMedicalRecord, useMedicalRecordsByPatient)
- Provider queries (useProviders, useProvider, useProvidersByDepartment)
- Facility queries (useFacilities, useFacility)

### 3. useClinicalDataQueries.ts (~135 LOC)
- Vital signs queries (useVitalsByPatient, useVitalsByType)
- Medication queries (useMedicationsByPatient)
- Allergy queries (useAllergiesByPatient)
- Lab result queries (useLabResultsByPatient)

### 4. useAlertAnalyticsQueries.ts (~195 LOC)
- Clinical alert queries (useClinicalAlertsByPatient, useActiveClinicalAlerts, useCriticalAlerts)
- Analytics queries (useHealthMetrics, usePatientAnalytics, useAppointmentAnalytics, useProviderAnalytics)

### 5. index.ts (~30 LOC)
- Re-export all hooks for backward compatibility

## Implementation Timeline

### Phase 1: Patient & Appointment Module (15 min)
- Extract patient and appointment queries
- Create usePatientAppointmentQueries.ts
- Test imports and types

### Phase 2: Medical Records & Provider Module (15 min)
- Extract medical record, provider, and facility queries
- Create useMedicalRecordProviderQueries.ts

### Phase 3: Clinical Data Module (10 min)
- Extract vitals, medications, allergies, lab results
- Create useClinicalDataQueries.ts

### Phase 4: Alerts & Analytics Module (15 min)
- Extract clinical alerts and analytics queries
- Create useAlertAnalyticsQueries.ts

### Phase 5: Index & Backward Compatibility (10 min)
- Create index.ts with all re-exports
- Verify no breaking changes

## Success Criteria
- All modules under 300 LOC
- All existing functionality maintained
- Backward compatibility via index.ts
- Proper TypeScript imports/exports
- Clean separation of concerns
