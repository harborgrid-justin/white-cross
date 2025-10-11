# Health Record Service - Quick Reference Guide

## Import Statements

```typescript
// Main service (health records, allergies, chronic conditions)
import { EnhancedHealthRecordService } from '../services/healthRecordService.enhanced';

// Specialized services
import {
  VaccinationService,
  ScreeningService,
  GrowthMeasurementService,
  VitalSignsService
} from '../services/healthRecordService.part2';
```

## Quick Method Reference

### Health Records

```typescript
// Get all records with pagination and filters
const records = await EnhancedHealthRecordService.getAllRecords(
  studentId,
  { recordType: 'ILLNESS', dateFrom: new Date('2024-01-01') },
  1,  // page
  20, // limit
  userId
);

// Get single record
const record = await EnhancedHealthRecordService.getRecordById(recordId, userId);

// Create record
const newRecord = await EnhancedHealthRecordService.createRecord({
  studentId,
  recordType: 'CHECKUP',
  title: 'Annual Physical',
  description: 'Routine annual examination',
  recordDate: new Date(),
  provider: 'Dr. Smith'
}, userId);

// Update record
const updated = await EnhancedHealthRecordService.updateRecord(
  recordId,
  { followUpCompleted: true },
  userId
);

// Delete record
await EnhancedHealthRecordService.deleteRecord(recordId, userId);

// Search records
const results = await EnhancedHealthRecordService.searchRecords(
  studentId,
  'asthma',
  userId
);

// Get timeline
const timeline = await EnhancedHealthRecordService.getRecordTimeline(studentId, userId);

// Get student health summary
const summary = await EnhancedHealthRecordService.getStudentHealthSummary(studentId, userId);
```

### Allergies

```typescript
// Get all allergies
const allergies = await EnhancedHealthRecordService.getAllergies(studentId, userId);

// Create allergy
const allergy = await EnhancedHealthRecordService.createAllergy({
  studentId,
  allergen: 'Penicillin',
  allergyType: 'MEDICATION',
  severity: 'LIFE_THREATENING',
  epiPenRequired: true,
  verified: true
}, userId);

// Verify allergy
await EnhancedHealthRecordService.verifyAllergy(allergyId, userId);

// Check medication contraindications
const check = await EnhancedHealthRecordService.checkAllergyContraindications(
  studentId,
  medicationId,
  userId
);

// Get life-threatening allergies
const critical = await EnhancedHealthRecordService.getLifeThreateningAllergies(
  studentId,
  userId
);

// Get allergy statistics
const stats = await EnhancedHealthRecordService.getAllergyStatistics({
  schoolId: 'school123'
});
```

### Chronic Conditions

```typescript
// Get all conditions
const conditions = await EnhancedHealthRecordService.getChronicConditions(studentId, userId);

// Create condition
const condition = await EnhancedHealthRecordService.createCondition({
  studentId,
  condition: 'Type 1 Diabetes',
  diagnosisDate: new Date('2023-01-15'),
  severity: 'SEVERE',
  status: 'ACTIVE',
  carePlan: 'Monitor blood sugar 4x daily...',
  accommodationsRequired: true
}, userId);

// Get active conditions only
const active = await EnhancedHealthRecordService.getActiveConditions(studentId, userId);

// Update status
await EnhancedHealthRecordService.updateConditionStatus(
  conditionId,
  'MANAGED',
  userId
);

// Get conditions needing review
const needReview = await EnhancedHealthRecordService.getConditionsRequiringReview({
  schoolId: 'school123'
});
```

### Vaccinations

```typescript
// Get all vaccinations
const vaccinations = await VaccinationService.getVaccinations(studentId, userId);

// Record vaccination
const vaccination = await VaccinationService.createVaccination({
  studentId,
  vaccineName: 'MMR',
  vaccineType: 'MMR',
  administrationDate: new Date(),
  administeredBy: 'Nurse Johnson',
  lotNumber: 'MMR2024-12345',
  visProvided: true,
  consentObtained: true
}, userId);

// Check compliance
const compliance = await VaccinationService.checkVaccinationCompliance(
  studentId,
  userId
);

// Get upcoming vaccinations
const upcoming = await VaccinationService.getUpcomingVaccinations(studentId, userId);

// Generate report
const report = await VaccinationService.generateVaccinationReport(studentId, userId);
```

### Screenings

```typescript
// Get all screenings
const screenings = await ScreeningService.getScreenings(studentId, userId);

// Record screening
const screening = await ScreeningService.createScreening({
  studentId,
  screeningType: 'VISION',
  screeningDate: new Date(),
  screenedBy: 'Nurse Smith',
  outcome: 'PASS',
  rightEye: '20/20',
  leftEye: '20/20'
}, userId);

// Get screenings needing follow-up
const needFollowUp = await ScreeningService.getScreeningsDueForReview({
  schoolId: 'school123'
});

// Get statistics
const stats = await ScreeningService.getScreeningStatistics({
  schoolId: 'school123'
});
```

### Growth Measurements

```typescript
// Get all measurements
const measurements = await GrowthMeasurementService.getGrowthMeasurements(
  studentId,
  userId
);

// Record measurement (BMI auto-calculated)
const measurement = await GrowthMeasurementService.createGrowthMeasurement({
  studentId,
  measurementDate: new Date(),
  measuredBy: 'Nurse Johnson',
  height: 145,
  heightUnit: 'cm',
  weight: 40,
  weightUnit: 'kg'
}, userId);

// Calculate percentiles
const percentiles = await GrowthMeasurementService.calculateGrowthPercentiles(
  studentId,
  userId
);

// Get growth trends
const trends = await GrowthMeasurementService.getGrowthTrends(studentId, userId);

// Flag concerns
const concerns = await GrowthMeasurementService.flagGrowthConcerns(studentId, userId);
```

### Vital Signs

```typescript
// Get vital signs history
const vitals = await VitalSignsService.getVitalSigns(
  studentId,
  { dateFrom: new Date('2024-01-01') },
  userId
);

// Record vital signs
const vitalSigns = await VitalSignsService.createVitalSigns({
  studentId,
  measurementDate: new Date(),
  measuredBy: 'Nurse Smith',
  temperature: 98.6,
  temperatureUnit: 'F',
  bloodPressureSystolic: 110,
  bloodPressureDiastolic: 70,
  heartRate: 72,
  oxygenSaturation: 98
}, userId);

// Get latest vitals
const latest = await VitalSignsService.getLatestVitals(studentId, userId);

// Analyze trends
const bpTrends = await VitalSignsService.getVitalTrends(
  studentId,
  'bloodPressure',
  userId
);
```

## Common Enums

### Record Types
```typescript
'CHECKUP' | 'VACCINATION' | 'ILLNESS' | 'INJURY' | 'SCREENING' |
'PHYSICAL_EXAM' | 'MENTAL_HEALTH' | 'DENTAL' | 'VISION' | 'HEARING'
```

### Allergy Types
```typescript
'FOOD' | 'MEDICATION' | 'ENVIRONMENTAL' | 'INSECT' | 'LATEX' |
'ANIMAL' | 'CHEMICAL' | 'SEASONAL' | 'OTHER'
```

### Allergy Severity
```typescript
'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING'
```

### Condition Status
```typescript
'ACTIVE' | 'MANAGED' | 'RESOLVED' | 'MONITORING'
```

### Condition Severity
```typescript
'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL'
```

### Vaccine Types
```typescript
'COVID_19' | 'FLU' | 'MEASLES' | 'MUMPS' | 'RUBELLA' | 'MMR' |
'POLIO' | 'HEPATITIS_A' | 'HEPATITIS_B' | 'VARICELLA' |
'TETANUS' | 'DIPHTHERIA' | 'PERTUSSIS' | 'TDAP' | 'DTaP' |
'HIB' | 'PNEUMOCOCCAL' | 'ROTAVIRUS' | 'MENINGOCOCCAL' | 'HPV'
```

### Vaccine Compliance
```typescript
'COMPLIANT' | 'OVERDUE' | 'PARTIALLY_COMPLIANT' | 'EXEMPT' | 'NON_COMPLIANT'
```

### Screening Types
```typescript
'VISION' | 'HEARING' | 'SCOLIOSIS' | 'DENTAL' | 'BMI' |
'BLOOD_PRESSURE' | 'DEVELOPMENTAL' | 'SPEECH' | 'MENTAL_HEALTH' |
'TUBERCULOSIS' | 'LEAD' | 'ANEMIA' | 'OTHER'
```

### Screening Outcomes
```typescript
'PASS' | 'REFER' | 'FAIL' | 'INCONCLUSIVE' | 'INCOMPLETE'
```

## Common Patterns

### Check Before Create
```typescript
// Always check for contraindications before prescribing medication
const check = await EnhancedHealthRecordService.checkAllergyContraindications(
  studentId,
  medicationId,
  userId
);

if (check.hasContraindications) {
  throw new Error('Medication contraindicated due to allergies');
}
```

### Pagination
```typescript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 20;

const result = await EnhancedHealthRecordService.getAllRecords(
  studentId,
  filters,
  page,
  limit,
  userId
);

// Returns: { records: [...], pagination: { page, limit, total, pages } }
```

### Error Handling
```typescript
try {
  const record = await EnhancedHealthRecordService.createRecord(data, userId);
  res.status(201).json({ success: true, data: record });
} catch (error) {
  logger.error('Failed to create health record:', error);
  res.status(500).json({
    success: false,
    error: error.message
  });
}
```

### PHI Logging
All methods automatically log PHI access. No additional code needed:
```typescript
// This automatically logs to AuditLog table
const allergies = await EnhancedHealthRecordService.getAllergies(studentId, userId);
// Log entry: { userId, action: 'READ', entityType: 'ALLERGY', entityId: studentId, ... }
```

### Export Data
```typescript
// Export as JSON
const jsonExport = await EnhancedHealthRecordService.exportHealthRecords(
  studentId,
  'JSON',
  userId
);

// Export as PDF data (pass to PDF generator)
const pdfData = await EnhancedHealthRecordService.exportHealthRecords(
  studentId,
  'PDF',
  userId
);
```

## Response Formats

### Standard Response
```typescript
{
  success: true,
  data: { /* record data */ }
}
```

### Paginated Response
```typescript
{
  records: [...],
  pagination: {
    page: 1,
    limit: 20,
    total: 45,
    pages: 3
  }
}
```

### Error Response
```typescript
{
  success: false,
  error: "Error message here"
}
```

### Contraindication Check Response
```typescript
{
  hasContraindications: true,
  contraindications: [
    {
      type: 'DIRECT_ALLERGY',
      severity: 'LIFE_THREATENING',
      allergen: 'Penicillin',
      medication: 'Amoxicillin',
      warning: 'Patient has documented allergy to Penicillin',
      recommendation: 'DO NOT ADMINISTER'
    }
  ],
  studentName: 'John Doe',
  medicationName: 'Amoxicillin'
}
```

### Compliance Check Response
```typescript
{
  overallStatus: 'PARTIALLY_COMPLIANT',
  compliance: {
    compliant: 8,
    overdue: 2,
    partiallyCompliant: 1,
    exempt: 0,
    nonCompliant: 0,
    incompleteSeries: 3,
    upcomingDue: 1,
    total: 11
  },
  vaccinations: [...]
}
```

## Controller Example

```typescript
import { Router } from 'express';
import { EnhancedHealthRecordService } from '../services/healthRecordService.enhanced';
import { authenticateUser } from '../middleware/auth';

const router = Router();

// Get all health records for a student
router.get('/students/:studentId/health-records',
  authenticateUser,
  async (req, res) => {
    try {
      const { studentId } = req.params;
      const userId = req.user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const filters = {
        recordType: req.query.recordType as any,
        dateFrom: req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined,
        dateTo: req.query.dateTo ? new Date(req.query.dateTo as string) : undefined
      };

      const result = await EnhancedHealthRecordService.getAllRecords(
        studentId,
        filters,
        page,
        limit,
        userId
      );

      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Create health record
router.post('/students/:studentId/health-records',
  authenticateUser,
  async (req, res) => {
    try {
      const { studentId } = req.params;
      const userId = req.user.id;

      const record = await EnhancedHealthRecordService.createRecord(
        { ...req.body, studentId },
        userId
      );

      res.status(201).json({ success: true, data: record });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

export default router;
```

## Testing Examples

```typescript
describe('Health Record Service', () => {
  it('should create allergy and check contraindications', async () => {
    // Create allergy
    const allergy = await EnhancedHealthRecordService.createAllergy({
      studentId: 'test123',
      allergen: 'Penicillin',
      allergyType: 'MEDICATION',
      severity: 'LIFE_THREATENING'
    }, 'nurse123');

    expect(allergy.allergen).toBe('Penicillin');

    // Check contraindication
    const check = await EnhancedHealthRecordService.checkAllergyContraindications(
      'test123',
      'penicillin-med-id',
      'nurse123'
    );

    expect(check.hasContraindications).toBe(true);
  });

  it('should track vaccination compliance', async () => {
    const compliance = await VaccinationService.checkVaccinationCompliance(
      'test123',
      'nurse123'
    );

    expect(compliance).toHaveProperty('overallStatus');
    expect(compliance).toHaveProperty('compliance');
  });
});
```

## Performance Tips

1. **Use pagination** for large datasets
2. **Cache frequent queries** (allergies, latest vitals)
3. **Batch operations** when possible
4. **Use select statements** to limit returned fields
5. **Implement Redis** for hot data

## Security Checklist

- [ ] Always require userId parameter
- [ ] Validate user has access to student data
- [ ] Never expose raw error details to client
- [ ] Use HTTPS for all API endpoints
- [ ] Implement rate limiting
- [ ] Log all PHI access (automatic)
- [ ] Encrypt sensitive data at rest
- [ ] Use prepared statements (Prisma handles this)
- [ ] Validate all input data
- [ ] Implement proper CORS settings

## Files Reference

```
backend/src/services/
├── healthRecordService.enhanced.ts       # Main service
├── healthRecordService.part2.ts          # Sub-modules
└── HEALTH_RECORD_SERVICE_DOCUMENTATION.md # Full docs

project root/
├── HEALTH_RECORD_SERVICE_IMPLEMENTATION_SUMMARY.md
└── HEALTH_RECORD_SERVICE_QUICK_REFERENCE.md (this file)
```

## Support

For detailed documentation, see:
- `HEALTH_RECORD_SERVICE_DOCUMENTATION.md` - Complete API docs
- `HEALTH_RECORD_SERVICE_IMPLEMENTATION_SUMMARY.md` - Implementation details
- Prisma schema at `backend/prisma/schema.prisma` - Data models

---

**Pro Tip**: Keep this guide bookmarked for quick reference during development!
