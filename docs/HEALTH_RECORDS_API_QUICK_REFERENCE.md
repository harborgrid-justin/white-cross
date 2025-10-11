# Health Records API - Quick Reference Guide

## Import

```typescript
import { healthRecordsApi } from '@/services/modules/healthRecordsApi';
```

## API Methods by Module

### Main Health Records (11 methods)

```typescript
// List records
healthRecordsApi.getRecords(studentId, filters?)
// -> PaginatedResponse<HealthRecord>

// Get single record
healthRecordsApi.getRecordById(id)
// -> HealthRecord

// Create record
healthRecordsApi.createRecord(data: HealthRecordCreate)
// -> HealthRecord

// Update record
healthRecordsApi.updateRecord(id, data: HealthRecordUpdate)
// -> HealthRecord

// Delete record
healthRecordsApi.deleteRecord(id)
// -> void

// Get timeline
healthRecordsApi.getTimeline(studentId, dateFrom?, dateTo?)
// -> HealthTimeline

// Get summary
healthRecordsApi.getSummary(studentId)
// -> HealthSummary

// Search records
healthRecordsApi.searchRecords(query, filters?)
// -> PaginatedResponse<HealthRecord>

// Export records
healthRecordsApi.exportRecords(studentId, format: 'pdf' | 'json' | 'csv')
// -> Blob

// Import records
healthRecordsApi.importRecords(studentId, file: File)
// -> { imported: number; errors: any[] }

// Get statistics
healthRecordsApi.getStatistics(filters?)
// -> HealthRecordsStatistics
```

### Allergies (9 methods)

```typescript
// List allergies
healthRecordsApi.getAllergies(studentId)
// -> Allergy[]

// Get single allergy
healthRecordsApi.getAllergyById(id)
// -> Allergy

// Create allergy
healthRecordsApi.createAllergy(data: AllergyCreate)
// -> Allergy

// Update allergy
healthRecordsApi.updateAllergy(id, data: AllergyUpdate)
// -> Allergy

// Delete allergy
healthRecordsApi.deleteAllergy(id)
// -> void

// Verify allergy
healthRecordsApi.verifyAllergy(id, verifiedBy)
// -> Allergy

// Get critical allergies
healthRecordsApi.getCriticalAllergies(studentId)
// -> Allergy[]

// Check contraindications
healthRecordsApi.checkContraindications(studentId, medicationId)
// -> { hasContraindication: boolean; allergies: Allergy[]; warnings: string[] }

// Get statistics
healthRecordsApi.getAllergyStatistics(filters?)
// -> { total, byType, bySeverity, critical, verified }
```

### Chronic Conditions (9 methods)

```typescript
// List conditions
healthRecordsApi.getConditions(studentId)
// -> ChronicCondition[]

// Get single condition
healthRecordsApi.getConditionById(id)
// -> ChronicCondition

// Create condition
healthRecordsApi.createCondition(data: ChronicConditionCreate)
// -> ChronicCondition

// Update condition
healthRecordsApi.updateCondition(id, data: ChronicConditionUpdate)
// -> ChronicCondition

// Delete condition
healthRecordsApi.deleteCondition(id)
// -> void

// Update status
healthRecordsApi.updateConditionStatus(id, status: ConditionStatus)
// -> ChronicCondition

// Get active conditions
healthRecordsApi.getActiveConditions(studentId)
// -> ChronicCondition[]

// Get conditions needing review
healthRecordsApi.getConditionsNeedingReview()
// -> Array<ChronicCondition & { daysUntilReview: number }>

// Get statistics
healthRecordsApi.getConditionStatistics(filters?)
// -> { total, active, byStatus, bySeverity, topConditions }
```

### Vaccinations (9 methods)

```typescript
// List vaccinations
healthRecordsApi.getVaccinations(studentId)
// -> Vaccination[]

// Get single vaccination
healthRecordsApi.getVaccinationById(id)
// -> Vaccination

// Create vaccination
healthRecordsApi.createVaccination(data: VaccinationCreate)
// -> Vaccination

// Update vaccination
healthRecordsApi.updateVaccination(id, data: VaccinationUpdate)
// -> Vaccination

// Delete vaccination
healthRecordsApi.deleteVaccination(id)
// -> void

// Check compliance
healthRecordsApi.checkCompliance(studentId)
// -> VaccinationCompliance

// Get upcoming vaccinations
healthRecordsApi.getUpcomingVaccinations(studentId, daysAhead?)
// -> Array<{ vaccineName, dueDate, daysUntilDue, isOverdue }>

// Generate report
healthRecordsApi.generateVaccinationReport(studentId, format: 'pdf' | 'official')
// -> Blob

// Get statistics
healthRecordsApi.getVaccinationStatistics(schoolId?)
// -> { total, compliant, nonCompliant, complianceRate, byVaccine, overdue, upcomingDue }
```

### Screenings (7 methods)

```typescript
// List screenings
healthRecordsApi.getScreenings(studentId)
// -> Screening[]

// Get single screening
healthRecordsApi.getScreeningById(id)
// -> Screening

// Create screening
healthRecordsApi.createScreening(data: ScreeningCreate)
// -> Screening

// Update screening
healthRecordsApi.updateScreening(id, data: ScreeningUpdate)
// -> Screening

// Delete screening
healthRecordsApi.deleteScreening(id)
// -> void

// Get screenings due
healthRecordsApi.getScreeningsDue()
// -> Array<{ student, screeningType, lastScreeningDate?, dueDate, daysOverdue }>

// Get statistics
healthRecordsApi.getScreeningStatistics(filters?)
// -> { total, byType, byOutcome, referrals, followUpsNeeded }
```

### Growth Measurements (8 methods)

```typescript
// List measurements
healthRecordsApi.getGrowthMeasurements(studentId)
// -> GrowthMeasurement[]

// Get single measurement
healthRecordsApi.getGrowthMeasurementById(id)
// -> GrowthMeasurement

// Create measurement
healthRecordsApi.createGrowthMeasurement(data: GrowthMeasurementCreate)
// -> GrowthMeasurement

// Update measurement
healthRecordsApi.updateGrowthMeasurement(id, data: GrowthMeasurementUpdate)
// -> GrowthMeasurement

// Delete measurement
healthRecordsApi.deleteGrowthMeasurement(id)
// -> void

// Get trends
healthRecordsApi.getGrowthTrends(studentId)
// -> GrowthTrend

// Get concerns
healthRecordsApi.getGrowthConcerns(studentId)
// -> { hasConcerns, concerns: Array<{ type, severity, description, recommendation }> }

// Calculate percentiles
healthRecordsApi.calculatePercentiles(studentId)
// -> { latest: { height?, weight?, bmi? }, history }
```

### Vital Signs (7 methods)

```typescript
// List vital signs
healthRecordsApi.getVitalSigns(studentId, filters?)
// -> VitalSigns[]

// Get single vital signs
healthRecordsApi.getVitalSignsById(id)
// -> VitalSigns

// Create vital signs
healthRecordsApi.createVitalSigns(data: VitalSignsCreate)
// -> VitalSigns

// Update vital signs
healthRecordsApi.updateVitalSigns(id, data: VitalSignsUpdate)
// -> VitalSigns

// Delete vital signs
healthRecordsApi.deleteVitalSigns(id)
// -> void

// Get latest vitals
healthRecordsApi.getLatestVitals(studentId)
// -> VitalSigns | null

// Get trends
healthRecordsApi.getVitalTrends(studentId, vitalType, dateFrom?, dateTo?)
// -> VitalSignsTrend
```

## Common Usage Patterns

### Creating Records

```typescript
// Create health record
const record = await healthRecordsApi.createRecord({
  studentId: '123',
  type: 'GENERAL_VISIT',
  date: '2025-01-10',
  description: 'Annual checkup',
  provider: 'Dr. Smith',
  notes: 'Patient appears healthy'
});

// Create allergy
const allergy = await healthRecordsApi.createAllergy({
  studentId: '123',
  allergen: 'Penicillin',
  allergyType: AllergyType.MEDICATION,
  severity: AllergySeverity.SEVERE,
  reaction: 'Anaphylaxis',
  symptoms: ['Difficulty breathing', 'Hives']
});

// Create vital signs
const vitals = await healthRecordsApi.createVitalSigns({
  studentId: '123',
  recordDate: '2025-01-10T09:00:00Z',
  temperature: 37.2,
  temperatureMethod: 'oral',
  bloodPressureSystolic: 120,
  bloodPressureDiastolic: 80,
  heartRate: 75,
  recordedBy: 'Nurse Johnson'
});
```

### Retrieving Data

```typescript
// Get comprehensive health summary
const summary = await healthRecordsApi.getSummary(studentId);
console.log(summary.criticalAlerts);
console.log(summary.allergies);
console.log(summary.vaccinations);

// Get critical allergies only
const criticalAllergies = await healthRecordsApi.getCriticalAllergies(studentId);

// Get vaccination compliance
const compliance = await healthRecordsApi.checkCompliance(studentId);
if (!compliance.isCompliant) {
  console.log('Missing vaccinations:', compliance.missingVaccinations);
}

// Get growth trends
const trends = await healthRecordsApi.getGrowthTrends(studentId);
console.log('Height trend:', trends.trends.heightTrend);
console.log('Concerns:', trends.concerns);
```

### Filtering and Pagination

```typescript
// Filter health records
const records = await healthRecordsApi.getRecords(studentId, {
  type: 'INJURY',
  dateFrom: '2024-01-01',
  dateTo: '2025-01-01',
  page: 1,
  limit: 20
});

// Get vital signs for date range
const vitals = await healthRecordsApi.getVitalSigns(studentId, {
  dateFrom: '2025-01-01',
  dateTo: '2025-01-31',
  limit: 50
});

// Search all records
const searchResults = await healthRecordsApi.searchRecords('asthma', {
  type: 'ILLNESS',
  page: 1,
  limit: 10
});
```

### Safety Checks

```typescript
// Check medication contraindications
const check = await healthRecordsApi.checkContraindications(
  studentId,
  medicationId
);

if (check.hasContraindication) {
  console.error('CONTRAINDICATION DETECTED!');
  console.log('Allergies:', check.allergies);
  console.log('Warnings:', check.warnings);
  // Display warning to user
}
```

### Exporting Data

```typescript
// Export as PDF
const pdfBlob = await healthRecordsApi.exportRecords(studentId, 'pdf');
const url = URL.createObjectURL(pdfBlob);
window.open(url);

// Export vaccination report
const vaccinationReport = await healthRecordsApi.generateVaccinationReport(
  studentId,
  'official'
);
// Download or display report
```

### Statistics and Analytics

```typescript
// Get overall statistics
const stats = await healthRecordsApi.getStatistics({
  dateFrom: '2024-01-01',
  dateTo: '2025-01-01',
  schoolId: 'school123'
});

console.log('Total records:', stats.totalRecords);
console.log('Records by type:', stats.recordsByType);
console.log('Top conditions:', stats.topConditions);
console.log('Vaccination compliance:', stats.vaccinationCompliance.percentage);

// Get allergy statistics
const allergyStats = await healthRecordsApi.getAllergyStatistics({
  schoolId: 'school123'
});
console.log('Critical allergies:', allergyStats.critical);
console.log('By severity:', allergyStats.bySeverity);
```

## Enums Reference

### AllergyType
```typescript
enum AllergyType {
  MEDICATION = 'MEDICATION',
  FOOD = 'FOOD',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  INSECT = 'INSECT',
  LATEX = 'LATEX',
  OTHER = 'OTHER'
}
```

### AllergySeverity
```typescript
enum AllergySeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
  LIFE_THREATENING = 'LIFE_THREATENING'
}
```

### ConditionStatus
```typescript
enum ConditionStatus {
  ACTIVE = 'ACTIVE',
  MANAGED = 'MANAGED',
  IN_REMISSION = 'IN_REMISSION',
  RESOLVED = 'RESOLVED',
  UNDER_OBSERVATION = 'UNDER_OBSERVATION'
}
```

### ConditionSeverity
```typescript
enum ConditionSeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
  CRITICAL = 'CRITICAL'
}
```

### VaccinationStatus
```typescript
enum VaccinationStatus {
  COMPLETED = 'COMPLETED',
  PARTIAL = 'PARTIAL',
  OVERDUE = 'OVERDUE',
  EXEMPTED = 'EXEMPTED',
  NOT_REQUIRED = 'NOT_REQUIRED'
}
```

### ScreeningType
```typescript
enum ScreeningType {
  VISION = 'VISION',
  HEARING = 'HEARING',
  DENTAL = 'DENTAL',
  SCOLIOSIS = 'SCOLIOSIS',
  BMI = 'BMI',
  BLOOD_PRESSURE = 'BLOOD_PRESSURE',
  MENTAL_HEALTH = 'MENTAL_HEALTH',
  DEVELOPMENTAL = 'DEVELOPMENTAL',
  OTHER = 'OTHER'
}
```

### ScreeningOutcome
```typescript
enum ScreeningOutcome {
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  REFER = 'REFER',
  INCONCLUSIVE = 'INCONCLUSIVE',
  DECLINED = 'DECLINED'
}
```

## Error Handling

All methods include comprehensive error handling:

```typescript
try {
  const record = await healthRecordsApi.createRecord(data);
} catch (error) {
  if (error.message.includes('Validation error')) {
    // Handle validation error
    console.error('Invalid data:', error.message);
  } else {
    // Handle other errors
    console.error('Failed to create record:', error.message);
  }
}
```

## Security Features

All methods automatically:
1. Log PHI access to audit trail
2. Sanitize error messages to prevent PHI exposure
3. Validate inputs with Zod schemas
4. Handle authentication via axios interceptors

## File Location

**Full Path**: `F:\temp\white-cross\frontend\src\services\modules\healthRecordsApi.ts`

**Total Methods**: 61 public methods + 2 private utility methods = 63 total methods

**Total Lines**: 2,086 lines of TypeScript
