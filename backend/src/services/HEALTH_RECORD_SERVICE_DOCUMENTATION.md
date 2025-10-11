# Health Record Service - Comprehensive Documentation

## Overview

The Health Record Service is a comprehensive backend service layer for managing all health-related data in the White Cross Healthcare Platform. It provides enterprise-grade functionality with HIPAA compliance, PHI (Protected Health Information) logging, and robust error handling.

## Architecture

The service is split into two main files for better organization:

1. **healthRecordService.enhanced.ts** - Main health records, allergies, and chronic conditions
2. **healthRecordService.part2.ts** - Vaccinations, screenings, growth measurements, and vital signs

## File Locations

- Main Service: `F:\temp\white-cross\backend\src\services\healthRecordService.enhanced.ts`
- Sub-modules: `F:\temp\white-cross\backend\src\services\healthRecordService.part2.ts`
- Original Service: `F:\temp\white-cross\backend\src\services\healthRecordService.ts`

## Service Modules

### 1. Main Health Records Module (EnhancedHealthRecordService)

#### Core Methods

**getAllRecords(studentId, filters, page, limit, userId)**
- Get all health records for a student with filtering and pagination
- Supports filtering by: recordType, dateFrom, dateTo, provider, isConfidential, followUpRequired
- Returns paginated results with student details
- Logs PHI access automatically

**getRecordById(id, userId)**
- Get a single health record by ID with all details
- Includes student information, allergies, and conditions
- Logs PHI access

**createRecord(data, userId)**
- Create a new health record with PHI logging
- Validates student existence
- Automatically sets createdBy field
- Logs creation action

**updateRecord(id, data, userId)**
- Update a health record with audit trail
- Validates record existence
- Sets updatedBy field
- Logs changes with details

**deleteRecord(id, userId)**
- Delete a health record with logging
- Hard delete (no soft delete in schema)
- Comprehensive PHI logging

**getRecordsByType(studentId, recordType, userId)**
- Get records filtered by specific type
- Types: CHECKUP, VACCINATION, ILLNESS, INJURY, SCREENING, etc.

**getRecordTimeline(studentId, userId)**
- Get chronological timeline of all health records
- Sorted by recordDate ascending
- Useful for visual timelines

**searchRecords(studentId, query, userId)**
- Full-text search across health records
- Searches: title, description, diagnosis, treatment, provider, notes
- Case-insensitive search

### 2. Allergies Sub-Module

#### Core Methods

**getAllergies(studentId, userId)**
- Get all active allergies for a student
- Sorted by severity (most severe first)
- Includes student and health record details

**getAllergyById(id, userId)**
- Get a single allergy by ID
- Complete allergy details with relations

**createAllergy(data, userId)**
- Create an allergy with verification workflow
- Prevents duplicate allergens
- Supports verification status
- Tracks EpiPen requirements and expiration

**updateAllergy(id, data, userId)**
- Update an allergy with audit trail
- Automatically updates verification date when verified

**deleteAllergy(id, userId)**
- Soft delete allergy (sets active = false)
- Maintains data for historical purposes

**verifyAllergy(id, userId)**
- Mark an allergy as verified
- Records verification date and user

**checkAllergyContraindications(studentId, medicationId, userId)**
- Check for allergy contraindications with medications
- Compares allergens with medication names
- Returns severity and recommendations
- Critical for medication safety

**getLifeThreateningAllergies(studentId, userId)**
- Get only life-threatening allergies
- For emergency situations and alerts

**getAllergyStatistics(filters)**
- Comprehensive allergy statistics
- Filters by school or district
- Groups by severity and type
- Calculates verification rates

### 3. Chronic Conditions Sub-Module

#### Core Methods

**getChronicConditions(studentId, userId)**
- Get all chronic conditions for a student
- Sorted by status, severity, and name
- Includes care plans and action plans

**getConditionById(id, userId)**
- Get a single chronic condition by ID
- Complete condition details with relations

**createCondition(data, userId)**
- Create a chronic condition with care plan
- Supports ICD-10 codes
- Tracks accommodations and restrictions

**updateCondition(id, data, userId)**
- Update a chronic condition with versioning
- Updates lastReviewDate when care plan changes
- Maintains audit trail

**deleteCondition(id, userId)**
- Archive condition (sets status to RESOLVED)
- Maintains data for historical purposes

**getActiveConditions(studentId, userId)**
- Get only active chronic conditions
- Useful for current care planning

**updateConditionStatus(id, status, userId)**
- Update condition status only
- Statuses: ACTIVE, MANAGED, RESOLVED, MONITORING
- Updates lastReviewDate

**getConditionsRequiringReview(filters)**
- Get conditions due for review
- Filters by school or district
- Based on nextReviewDate

**getConditionStatistics(filters)**
- Comprehensive condition statistics
- Groups by status and severity
- Tracks accommodation requirements

### 4. Vaccinations Sub-Module (VaccinationService)

#### Core Methods

**getVaccinations(studentId, userId)**
- Get all vaccinations for a student
- Sorted by administration date (most recent first)

**getVaccinationById(id, userId)**
- Get a single vaccination by ID

**createVaccination(data, userId)**
- Record a new vaccination
- Supports CVX and NDC codes
- Tracks lot numbers and expiration
- Records VIS (Vaccine Information Statement) provision
- Tracks consent

**updateVaccination(id, data, userId)**
- Update vaccination record
- Maintains audit trail

**deleteVaccination(id, userId)**
- Delete vaccination record
- Logs deletion action

**checkVaccinationCompliance(studentId, userId)**
- Check vaccination compliance status
- Returns compliance breakdown
- Identifies incomplete series
- Flags overdue vaccinations

**getUpcomingVaccinations(studentId, userId)**
- Get vaccinations due in next 90 days
- Sorted by due date

**getVaccinationStatistics(schoolId)**
- School-wide vaccination statistics
- Compliance breakdown
- Groups by vaccine type

**generateVaccinationReport(studentId, userId)**
- Generate comprehensive vaccination report
- Includes compliance status
- Ready for PDF generation or export

### 5. Screenings Sub-Module (ScreeningService)

#### Core Methods

**getScreenings(studentId, userId)**
- Get all screenings for a student
- Includes detailed results

**getScreeningById(id, userId)**
- Get a single screening by ID

**createScreening(data, userId)**
- Record a new screening
- Types: VISION, HEARING, SCOLIOSIS, DENTAL, BMI, etc.
- Tracks outcomes and referrals
- Records equipment used

**updateScreening(id, data, userId)**
- Update screening record
- Maintains audit trail

**deleteScreening(id, userId)**
- Delete screening record
- Logs deletion action

**getScreeningsDueForReview(filters)**
- Get screenings requiring follow-up
- Filters by school
- Based on followUpDate

**getScreeningStatistics(filters)**
- Comprehensive screening statistics
- Groups by type and outcome
- Tracks referrals and pending follow-ups

### 6. Growth Measurements Sub-Module (GrowthMeasurementService)

#### Core Methods

**getGrowthMeasurements(studentId, userId)**
- Get all growth measurements
- Sorted by measurement date

**createGrowthMeasurement(data, userId)**
- Record new growth measurement
- Auto-calculates BMI if height and weight provided
- Supports both metric and imperial units

**updateGrowthMeasurement(id, data, userId)**
- Update growth measurement
- Recalculates BMI when needed

**deleteGrowthMeasurement(id, userId)**
- Delete growth measurement
- Logs deletion action

**calculateGrowthPercentiles(studentId, userId)**
- Calculate growth percentiles
- Uses age in months
- Returns height, weight, and BMI percentiles
- Note: Uses placeholder percentile calculation (implement CDC charts in production)

**getGrowthTrends(studentId, userId)**
- Analyze growth trends
- Calculates direction and rate of change
- Requires minimum 2 measurements

**flagGrowthConcerns(studentId, userId)**
- Identify growth concerns
- Flags underweight, overweight, obesity
- Identifies rapid changes
- Flags extreme percentiles

### 7. Vital Signs Sub-Module (VitalSignsService)

#### Core Methods

**getVitalSigns(studentId, filters, userId)**
- Get vital signs history
- Supports date range filtering
- Includes appointment associations

**createVitalSigns(data, userId)**
- Record vital signs
- Comprehensive vital sign tracking:
  - Temperature (with site and unit)
  - Blood Pressure (with position)
  - Heart Rate (with rhythm)
  - Respiratory Rate
  - Oxygen Saturation (with supplemental oxygen flag)
  - Pain Level (0-10 scale)
  - Consciousness Level
  - Glucose Level
  - Peak Flow (for asthma)

**getLatestVitals(studentId, userId)**
- Get most recent vital signs
- Returns null if no records

**getVitalTrends(studentId, vitalType, userId)**
- Analyze trends for specific vital type
- Types: temperature, bloodPressure, heartRate, respiratoryRate, oxygenSaturation
- Identifies outliers based on normal ranges
- Provides summary statistics

## Common Features

### PHI Logging

All methods that access Protected Health Information automatically log:
- User ID
- Student ID
- Access type (READ, WRITE, DELETE, EXPORT)
- Data category
- Description
- Additional details (for updates/changes)

Logs are stored in the AuditLog table for HIPAA compliance.

### Error Handling

All methods include:
- Try-catch blocks
- Descriptive error messages
- Logger integration
- Proper error propagation

### Validation

- Student existence validation
- Duplicate checking (allergies)
- Input data validation
- Proper type checking

### Data Integrity

- Transaction support where needed
- Foreign key validation
- Soft deletes where appropriate
- Audit trail maintenance

## Helper Methods

### getStudentHealthSummary(studentId, userId)
Returns comprehensive health summary including:
- Student basic info
- Allergies summary (total, life-threatening, epiPen required)
- Chronic conditions summary (total, active)
- Recent health records
- Follow-up records (total, overdue)

### getHealthRecordStatistics(studentId, userId)
Returns statistics including:
- Total records
- Records by type
- Follow-up pending count
- Confidential records count

### exportHealthRecords(studentId, format, userId)
Export health records in JSON or PDF format
- Formats: 'JSON' or 'PDF'
- Includes all health data
- Proper PHI logging
- Returns data structure ready for export

## Usage Examples

### Creating a Health Record

```typescript
import { EnhancedHealthRecordService } from './healthRecordService.enhanced';

const newRecord = await EnhancedHealthRecordService.createRecord({
  studentId: 'student123',
  recordType: 'ILLNESS',
  title: 'Common Cold',
  description: 'Student presented with runny nose and mild cough',
  recordDate: new Date(),
  provider: 'Dr. Jane Smith',
  diagnosis: 'Upper Respiratory Infection',
  treatment: 'Rest and fluids recommended',
  followUpRequired: true,
  followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  notes: 'Parent contacted and notified'
}, 'userId123');
```

### Creating an Allergy with Contraindication Check

```typescript
import { EnhancedHealthRecordService } from './healthRecordService.enhanced';

// Create allergy
const allergy = await EnhancedHealthRecordService.createAllergy({
  studentId: 'student123',
  allergen: 'Penicillin',
  allergyType: 'MEDICATION',
  severity: 'LIFE_THREATENING',
  symptoms: 'Anaphylaxis',
  emergencyProtocol: 'Administer EpiPen and call 911',
  epiPenRequired: true,
  epiPenLocation: 'Nurse Office - Refrigerator Bin A',
  epiPenExpiration: new Date('2025-12-31'),
  verified: true
}, 'userId123');

// Check contraindications before prescribing
const check = await EnhancedHealthRecordService.checkAllergyContraindications(
  'student123',
  'medication456',
  'userId123'
);

if (check.hasContraindications) {
  console.log('WARNING: Contraindications found:', check.contraindications);
}
```

### Recording Vaccination with Compliance Check

```typescript
import { VaccinationService } from './healthRecordService.part2';

// Record vaccination
const vaccination = await VaccinationService.createVaccination({
  studentId: 'student123',
  vaccineName: 'Influenza Vaccine 2024-2025',
  vaccineType: 'FLU',
  manufacturer: 'Sanofi Pasteur',
  lotNumber: 'FL2024A12345',
  cvxCode: '88',
  administrationDate: new Date(),
  administeredBy: 'Nurse Johnson',
  administeredByRole: 'School Nurse',
  siteOfAdministration: 'ARM_LEFT',
  routeOfAdministration: 'INTRAMUSCULAR',
  dosageAmount: '0.5 mL',
  expirationDate: new Date('2025-06-30'),
  visProvided: true,
  visDate: new Date(),
  consentObtained: true,
  consentBy: 'Parent - John Doe',
  complianceStatus: 'COMPLIANT'
}, 'userId123');

// Check compliance
const compliance = await VaccinationService.checkVaccinationCompliance(
  'student123',
  'userId123'
);

console.log('Overall Status:', compliance.overallStatus);
console.log('Compliance Breakdown:', compliance.compliance);
```

### Recording Screening with Follow-up

```typescript
import { ScreeningService } from './healthRecordService.part2';

const screening = await ScreeningService.createScreening({
  studentId: 'student123',
  screeningType: 'VISION',
  screeningDate: new Date(),
  screenedBy: 'Nurse Smith',
  screenedByRole: 'School Nurse',
  results: {
    distance: '20/40',
    near: '20/20',
    colorVision: 'Normal'
  },
  outcome: 'REFER',
  rightEye: '20/40',
  leftEye: '20/30',
  passedCriteria: false,
  referralRequired: true,
  referralTo: 'Dr. Vision Specialist',
  referralDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  referralReason: 'Below normal visual acuity in both eyes',
  followUpRequired: true,
  followUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  followUpStatus: 'PENDING',
  notes: 'Parent notified of referral recommendation'
}, 'userId123');
```

### Growth Measurement with Percentile Analysis

```typescript
import { GrowthMeasurementService } from './healthRecordService.part2';

// Record measurement
const measurement = await GrowthMeasurementService.createGrowthMeasurement({
  studentId: 'student123',
  measurementDate: new Date(),
  measuredBy: 'Nurse Johnson',
  height: 145,
  heightUnit: 'cm',
  weight: 40,
  weightUnit: 'kg',
  notes: 'Annual health assessment'
}, 'userId123');

// Calculate percentiles
const percentiles = await GrowthMeasurementService.calculateGrowthPercentiles(
  'student123',
  'userId123'
);

// Check for concerns
const concerns = await GrowthMeasurementService.flagGrowthConcerns(
  'student123',
  'userId123'
);

if (concerns.hasConcerns) {
  console.log('Growth Concerns Identified:', concerns.concerns);
}
```

### Vital Signs with Trend Analysis

```typescript
import { VitalSignsService } from './healthRecordService.part2';

// Record vitals
const vitals = await VitalSignsService.createVitalSigns({
  studentId: 'student123',
  measurementDate: new Date(),
  measuredBy: 'Nurse Smith',
  temperature: 98.6,
  temperatureUnit: 'F',
  temperatureSite: 'Oral',
  bloodPressureSystolic: 110,
  bloodPressureDiastolic: 70,
  bloodPressurePosition: 'Sitting',
  heartRate: 72,
  heartRhythm: 'Regular',
  respiratoryRate: 16,
  oxygenSaturation: 98,
  consciousness: 'ALERT',
  painLevel: 0,
  notes: 'All vital signs within normal limits'
}, 'userId123');

// Analyze blood pressure trends
const bpTrends = await VitalSignsService.getVitalTrends(
  'student123',
  'bloodPressure',
  'userId123'
);

if (bpTrends.outliers.length > 0) {
  console.log('Blood Pressure Outliers:', bpTrends.outliers);
}
```

## Security & Compliance

### HIPAA Compliance
- All PHI access is logged to AuditLog table
- Logs include: userId, action, entityType, entityId, timestamp, changes
- Logs cannot be deleted (append-only)

### Authentication
- All methods require userId parameter
- userId should be validated by calling controller/middleware
- Never expose PHI without proper authentication

### Authorization
- Service layer does not handle authorization
- Implement authorization in controllers or middleware
- Check user permissions before calling service methods

### Data Privacy
- Sensitive fields are properly logged
- Soft deletes preserve historical data
- Hard deletes only when absolutely necessary

## Performance Considerations

### Database Queries
- Uses Prisma ORM for type-safe queries
- Includes proper indexes (defined in schema)
- Uses select statements to limit returned fields
- Implements pagination for large datasets

### Caching
- Consider implementing Redis caching for frequently accessed data
- Cache key suggestions:
  - `student:${studentId}:allergies`
  - `student:${studentId}:conditions`
  - `student:${studentId}:latest-vitals`

### Batch Operations
- Consider implementing batch methods for:
  - Bulk vaccination records
  - Multiple screening results
  - Batch compliance checks

## Testing Recommendations

### Unit Tests
Test each method with:
- Valid inputs
- Invalid studentId
- Missing required fields
- Duplicate detection
- Edge cases

### Integration Tests
Test workflows:
- Create allergy -> Check contraindications
- Record vaccination -> Check compliance
- Record screening -> Flag for follow-up
- Record growth -> Flag concerns

### Load Tests
Test with:
- Large number of records
- Concurrent access
- Complex queries

## Migration from Old Service

The original `healthRecordService.ts` provides basic functionality. To migrate:

1. Update imports to use `EnhancedHealthRecordService`
2. Add userId parameter to all method calls
3. Update response handling (methods now return complete objects)
4. Implement proper error handling
5. Update tests to match new method signatures

## Future Enhancements

1. **Implement CDC Growth Charts**
   - Replace placeholder percentile calculations
   - Use official WHO/CDC growth standards

2. **Add Document Generation**
   - PDF reports for vaccinations
   - Growth charts visualization
   - Comprehensive health summaries

3. **Implement Real-time Alerts**
   - Critical vital signs alerts
   - Vaccination due reminders
   - Follow-up notifications

4. **Add Data Export**
   - HL7/FHIR format support
   - EHR system integration
   - Standardized health reports

5. **Implement Advanced Analytics**
   - Population health statistics
   - Trend predictions
   - Risk assessment algorithms

## Support & Maintenance

For questions or issues:
1. Check this documentation
2. Review Prisma schema for data models
3. Check audit logs for PHI access history
4. Review logger output for errors

## License & Compliance

This service is part of the White Cross Healthcare Platform and must comply with:
- HIPAA regulations
- FERPA requirements
- State health reporting standards
- School district policies

All PHI must be handled according to organizational privacy policies.
