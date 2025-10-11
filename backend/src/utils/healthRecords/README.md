# Health Records Utilities

Comprehensive validation, business logic, and integration utilities for health records management in the White Cross healthcare platform.

## Overview

This module provides a complete suite of tools for managing student health records with:

- **HIPAA-compliant** data handling and PHI sanitization
- **Comprehensive validation** using Joi schemas
- **Business logic** for allergies, vaccinations, chronic conditions, growth, vitals, and screenings
- **External integrations** with CDC, FDA, and state vaccination databases
- **Helper utilities** for common operations

## Table of Contents

1. [Installation](#installation)
2. [Validation Schemas](#validation-schemas)
3. [Business Logic](#business-logic)
4. [Helper Utilities](#helper-utilities)
5. [Integration Functions](#integration-functions)
6. [Examples](#examples)

---

## Installation

```typescript
import {
  // Validation schemas
  createAllergySchema,
  createVaccinationSchema,

  // Business logic
  checkAllergyContraindications,
  calculateVaccinationCompliance,

  // Helpers
  calculateAge,
  sanitizePHI,

  // Integrations
  lookupCVXCode,
  validateICDCode
} from '@/utils/healthRecords';
```

---

## Validation Schemas

### Health Record Schemas

```typescript
import { createHealthRecordSchema, updateHealthRecordSchema } from '@/utils/healthRecords';

// Validate health record creation
const { error, value } = createHealthRecordSchema.validate({
  studentId: 'uuid-here',
  recordType: 'GENERAL',
  recordDate: new Date(),
  title: 'Annual Physical',
  description: 'Student passed annual physical examination'
});
```

### Allergy Schemas

```typescript
import { createAllergySchema } from '@/utils/healthRecords';

const allergyData = {
  studentId: 'student-uuid',
  allergen: 'Peanuts',
  allergyType: 'FOOD',
  severity: 'LIFE_THREATENING',
  symptoms: ['Anaphylaxis', 'Hives', 'Difficulty breathing'],
  hasEpiPen: true,
  epiPenLocation: 'Nurse office, top drawer',
  epiPenExpiration: new Date('2025-12-31'),
  treatment: 'Administer EpiPen immediately and call 911'
};

const { error } = createAllergySchema.validate(allergyData);
```

### Vaccination Schemas

```typescript
import { createVaccinationSchema } from '@/utils/healthRecords';

const vaccinationData = {
  studentId: 'student-uuid',
  vaccineName: 'MMR',
  cvxCode: '03',
  ndcCode: '00006-4047-00',
  manufacturer: 'Merck & Co., Inc.',
  lotNumber: 'ABC123',
  expirationDate: new Date('2026-06-30'),
  administeredDate: new Date('2024-09-01'),
  administeredBy: 'Dr. Jane Smith',
  administrationSite: 'LEFT_ARM',
  route: 'IM',
  dosage: '0.5 mL',
  doseNumber: 2,
  totalDoses: 2
};

const { error } = createVaccinationSchema.validate(vaccinationData);
```

### Chronic Condition Schemas

```typescript
import { createConditionSchema } from '@/utils/healthRecords';

const conditionData = {
  studentId: 'student-uuid',
  condition: 'Type 1 Diabetes Mellitus',
  icdCode: 'E10.9',
  severity: 'SEVERE',
  diagnosedDate: new Date('2020-03-15'),
  symptoms: ['Hyperglycemia', 'Polyuria', 'Polydipsia'],
  treatment: 'Insulin therapy with continuous glucose monitoring',
  actionPlan: 'Check blood glucose before meals...',
  accommodations: ['Blood glucose monitoring', 'Snack access', 'Bathroom privileges']
};

const { error } = createConditionSchema.validate(conditionData);
```

### Growth Measurement Schemas

```typescript
import { createGrowthMeasurementSchema } from '@/utils/healthRecords';

const growthData = {
  studentId: 'student-uuid',
  measurementDate: new Date(),
  height: 145.5,
  heightUnit: 'CM',
  weight: 42.3,
  weightUnit: 'KG',
  measuredBy: 'Nurse Johnson'
};

const { error } = createGrowthMeasurementSchema.validate(growthData);
```

### Vital Signs Schemas

```typescript
import { createVitalSignsSchema } from '@/utils/healthRecords';

const vitalsData = {
  studentId: 'student-uuid',
  recordedDate: new Date(),
  temperature: 37.2,
  temperatureUnit: 'C',
  heartRate: 82,
  respiratoryRate: 18,
  bloodPressureSystolic: 110,
  bloodPressureDiastolic: 70,
  oxygenSaturation: 98,
  recordedBy: 'Nurse Johnson'
};

const { error } = createVitalSignsSchema.validate(vitalsData);
```

### Screening Schemas

```typescript
import { createScreeningSchema } from '@/utils/healthRecords';

const screeningData = {
  studentId: 'student-uuid',
  screeningType: 'VISION',
  screeningDate: new Date(),
  screenedBy: 'Nurse Johnson',
  outcome: 'REFER',
  results: {
    leftEye: '20/40',
    rightEye: '20/50'
  },
  referralType: 'Optometry',
  referralTo: 'Local Eye Care Center',
  referralReason: 'Vision below 20/20 in both eyes'
};

const { error } = createScreeningSchema.validate(screeningData);
```

---

## Business Logic

### Allergy Business Logic

#### Check Medication Contraindications

```typescript
import { checkAllergyContraindications } from '@/utils/healthRecords';

const contraindications = await checkAllergyContraindications(
  'student-uuid',
  'medication-uuid'
);

contraindications.forEach(contra => {
  if (contra.isContraindicated) {
    console.log(`WARNING: ${contra.allergen}`);
    console.log(`Severity: ${contra.severity}`);
    console.log(`Action: ${contra.recommendedAction}`);
  }
});
```

#### Generate Allergy Alerts

```typescript
import { generateAllergyAlert } from '@/utils/healthRecords';

const alert = generateAllergyAlert(allergyRecord);

if (alert) {
  console.log(alert.message);
  alert.actions.forEach(action => console.log(`- ${action}`));
}
```

### Vaccination Business Logic

#### Calculate Vaccination Compliance

```typescript
import { calculateVaccinationCompliance } from '@/utils/healthRecords';

const compliance = await calculateVaccinationCompliance('student-uuid', 'CA');

console.log(`Compliant: ${compliance.isCompliant}`);
console.log(`Missing: ${compliance.missingVaccines.join(', ')}`);
console.log(`Upcoming: ${compliance.upcomingDoses.length} doses due`);
```

#### Validate Vaccination Schedule

```typescript
import { validateVaccinationSchedule } from '@/utils/healthRecords';

const validation = await validateVaccinationSchedule('student-uuid', newVaccination);

if (!validation.isValid) {
  console.log(`Invalid: ${validation.reason}`);
}
```

#### Determine Next Dose Date

```typescript
import { determineNextDueDate } from '@/utils/healthRecords';

const nextDate = determineNextDueDate(vaccinationRecord);
console.log(`Next dose due: ${nextDate.toLocaleDateString()}`);
```

### Chronic Condition Business Logic

#### Calculate Risk Score

```typescript
import { calculateConditionRiskScore } from '@/utils/healthRecords';

const risk = calculateConditionRiskScore(conditionRecord);

console.log(`Risk Level: ${risk.level} (${risk.score}/100)`);
console.log('Risk Factors:');
risk.factors.forEach(factor => console.log(`- ${factor}`));
console.log('Recommendations:');
risk.recommendations.forEach(rec => console.log(`- ${rec}`));
```

#### Determine Review Frequency

```typescript
import { determineReviewFrequency } from '@/utils/healthRecords';

const review = determineReviewFrequency(conditionRecord);

console.log(`Review every ${review.frequency} days`);
console.log(`Next review: ${review.nextReviewDate.toLocaleDateString()}`);
console.log(`Reason: ${review.reason}`);
```

#### Check Accommodation Requirements

```typescript
import { checkAccommodationRequirements } from '@/utils/healthRecords';

const accommodations = checkAccommodationRequirements(conditionRecord);

console.log('Required Accommodations:');
accommodations.forEach(acc => console.log(`- ${acc}`));
```

#### Generate Action Plan

```typescript
import { generateActionPlan } from '@/utils/healthRecords';

const actionPlan = generateActionPlan(conditionRecord);
console.log(actionPlan);
```

### Growth Business Logic

#### Calculate BMI

```typescript
import { calculateBMI } from '@/utils/healthRecords';

const bmi = calculateBMI(145.5, 42.3, 'CM', 'KG');
console.log(`BMI: ${bmi}`);
```

#### Identify Growth Concerns

```typescript
import { identifyGrowthConcerns } from '@/utils/healthRecords';

const concerns = identifyGrowthConcerns(measurementHistory);

concerns.forEach(concern => {
  console.log(`${concern.type}: ${concern.description}`);
  console.log(`Severity: ${concern.severity}`);
  console.log(`Recommendation: ${concern.recommendation}`);
});
```

#### Analyze Growth Trends

```typescript
import { analyzeTrends } from '@/utils/healthRecords';

const trends = analyzeTrends(measurementHistory);

console.log(`Trend: ${trends.trend}`);
console.log(`Growth velocity: ${trends.velocity} cm/month`);
console.log(`Percentile shift: ${trends.percentileShift}`);
console.log(`Normal: ${trends.isNormal}`);
```

### Vital Signs Business Logic

#### Validate Vital Ranges

```typescript
import { validateVitalRanges } from '@/utils/healthRecords';

const { isValid, alerts } = validateVitalRanges(vitalsRecord, studentAge);

alerts.forEach(alert => {
  console.log(`${alert.vital}: ${alert.value}`);
  console.log(`Severity: ${alert.severity}`);
  console.log(`Action: ${alert.action}`);
});
```

#### Calculate Mean Arterial Pressure

```typescript
import { calculateMeanArterialPressure } from '@/utils/healthRecords';

const map = calculateMeanArterialPressure(120, 80);
console.log(`MAP: ${map} mmHg`);
```

#### Assess Vital Trends

```typescript
import { assessVitalTrends } from '@/utils/healthRecords';

const trends = assessVitalTrends(vitalHistory);

console.log(`Trend: ${trends.trend}`);
if (trends.concerns.length > 0) {
  console.log('Concerns:');
  trends.concerns.forEach(concern => console.log(`- ${concern}`));
}
```

### Screening Business Logic

#### Determine Referral Urgency

```typescript
import { determineReferralUrgency } from '@/utils/healthRecords';

const urgency = determineReferralUrgency(screeningRecord);

console.log(`Urgency: ${urgency.urgency}`);
console.log(`Timeframe: ${urgency.timeframe}`);
```

#### Validate Screening Frequency

```typescript
import { validateScreeningFrequency } from '@/utils/healthRecords';

const validation = await validateScreeningFrequency('student-uuid', 'VISION');

if (!validation.isValid) {
  console.log(`Too soon - last screening: ${validation.lastScreening}`);
  console.log(`Wait ${validation.minimumInterval} days`);
}
```

---

## Helper Utilities

### Unit Conversion

```typescript
import { convertUnits } from '@/utils/healthRecords';

// Height conversion
const heightInches = convertUnits(145.5, 'CM', 'IN');

// Weight conversion
const weightPounds = convertUnits(42.3, 'KG', 'LB');

// Temperature conversion
const tempF = convertUnits(37.2, 'C', 'F');
```

### Age Calculation

```typescript
import {
  calculateAge,
  getAgeInYears,
  formatAge,
  getAgeCategory
} from '@/utils/healthRecords';

const age = calculateAge('2015-03-15');
console.log(`Age: ${age.years} years, ${age.months} months, ${age.days} days`);

const ageYears = getAgeInYears('2015-03-15');
console.log(`Age: ${ageYears} years`);

const formatted = formatAge('2015-03-15');
console.log(formatted); // "9 years, 7 months"

const category = getAgeCategory('2015-03-15');
console.log(category); // "School Age"
```

### PHI Sanitization (HIPAA Compliance)

```typescript
import { sanitizePHI, maskSensitiveData, containsPHI } from '@/utils/healthRecords';

// For logging
const sanitizedForLog = sanitizePHI(studentData, 'log');
console.log(sanitizedForLog); // Only ID and timestamp

// For display
const sanitizedForDisplay = sanitizePHI(studentData, 'display');
console.log(sanitizedForDisplay); // Masked SSN, MRN

// Check if contains PHI
if (containsPHI(data)) {
  console.log('Warning: Data contains PHI');
}

// Mask sensitive values
const masked = maskSensitiveData('123-45-6789', 4);
console.log(masked); // "*****6789"
```

### ID Generation

```typescript
import {
  generateHealthRecordId,
  generateMedicalRecordNumber,
  generateBatchId
} from '@/utils/healthRecords';

const recordId = generateHealthRecordId('ALLERGY');
console.log(recordId); // "ALLERGY-ABC123DEF-456"

const mrn = generateMedicalRecordNumber();
console.log(mrn); // "123-456-7890"

const batchId = generateBatchId();
console.log(batchId); // "BATCH-1234567890-ABC123"
```

### Medical Code Parsing

```typescript
import {
  parseMedicalCodes,
  validateICD10Code,
  formatICD10Code
} from '@/utils/healthRecords';

// Parse ICD-10 code
const icd = parseMedicalCodes('E119', 'ICD-10');
console.log(`Valid: ${icd.isValid}`);
console.log(`Formatted: ${formatICD10Code('E119')}`); // "E11.9"

// Validate codes
const isValidICD = validateICD10Code('E11.9'); // true
const isValidCVX = validateCVXCode('03'); // true
const isValidNDC = validateNDCCode('00006-4047-00'); // true
```

### Formatting

```typescript
import { formatHealthRecord, formatDate, formatDateTime } from '@/utils/healthRecords';

const formatted = formatHealthRecord(rawRecord);
console.log(formatted.title);
console.log(formatted.summary);

const dateStr = formatDate(new Date(), 'long');
console.log(dateStr); // "October 10, 2025"

const dateTimeStr = formatDateTime(new Date());
console.log(dateTimeStr); // "10/10/2025, 02:30 PM"
```

---

## Integration Functions

### Vaccine Database Lookups

```typescript
import {
  lookupCVXCode,
  lookupVaccineByNDC,
  searchVaccineByName
} from '@/utils/healthRecords';

// Lookup by CVX code
const vaccine = lookupCVXCode('03');
console.log(vaccine.fullVaccineName); // "measles, mumps and rubella virus vaccine"

// Lookup by NDC code
const ndcVaccine = lookupVaccineByNDC('00006-4047-00');
console.log(ndcVaccine.manufacturer); // "Merck & Co., Inc."

// Search by name
const results = searchVaccineByName('measles');
results.forEach(v => console.log(v.shortDescription));
```

### ICD-10 Code Validation

```typescript
import { validateICDCode, searchICDCodes } from '@/utils/healthRecords';

const icdInfo = await validateICDCode('E11.9');
console.log(icdInfo.description); // "Type 2 diabetes mellitus without complications"
console.log(icdInfo.category);

// Search by description
const diabetesCodes = searchICDCodes('diabetes');
diabetesCodes.forEach(code => {
  console.log(`${code.code}: ${code.description}`);
});
```

### State Vaccination Requirements

```typescript
import {
  checkStateVaccinationRequirements,
  getExemptionRules
} from '@/utils/healthRecords';

const requirements = await checkStateVaccinationRequirements('CA', '7');

console.log('Required Vaccines:');
requirements.requiredVaccines.forEach(req => {
  console.log(`- ${req.vaccine}: ${req.minimumDoses} doses`);
  console.log(`  ${req.notes}`);
});

console.log(`Exemptions allowed: ${requirements.exemptionsAllowed.join(', ')}`);

// Get exemption rules
const exemptions = getExemptionRules('CA');
console.log(`Medical: ${exemptions.medical}`);
console.log(`Religious: ${exemptions.religious}`);
console.log(`Philosophical: ${exemptions.philosophical}`);
```

### CDC Growth Chart Data

```typescript
import { getCDCGrowthChartData, zScoreToPercentile } from '@/utils/healthRecords';

const growthData = await getCDCGrowthChartData(120, 'MALE'); // 10 years old

console.log('Height percentiles:', growthData.percentiles.height);
console.log('Weight percentiles:', growthData.percentiles.weight);
console.log('BMI percentiles:', growthData.percentiles.bmi);

// Convert z-score to percentile
const percentile = zScoreToPercentile(1.5);
console.log(`Z-score 1.5 = ${percentile}th percentile`);
```

---

## Examples

### Complete Allergy Management Workflow

```typescript
import {
  createAllergySchema,
  checkAllergyContraindications,
  generateAllergyAlert,
  sanitizePHI
} from '@/utils/healthRecords';

// 1. Validate allergy data
const allergyData = {
  studentId: 'student-123',
  allergen: 'Penicillin',
  allergyType: 'MEDICATION',
  severity: 'SEVERE',
  symptoms: ['Rash', 'Swelling'],
  treatment: 'Avoid penicillin and related antibiotics'
};

const { error, value } = createAllergySchema.validate(allergyData);
if (error) throw new Error(error.message);

// 2. Save to database
const savedAllergy = await prisma.allergy.create({ data: value });

// 3. Generate alert if needed
const alert = generateAllergyAlert(savedAllergy);
if (alert) {
  await notifyStaff(alert);
}

// 4. Check contraindications when prescribing
const contraindications = await checkAllergyContraindications(
  'student-123',
  'amoxicillin-medication-id'
);

if (contraindications.length > 0) {
  console.log('CONTRAINDICATION ALERT!');
  contraindications.forEach(c => console.log(c.recommendedAction));
}

// 5. Log action (HIPAA compliant)
const sanitized = sanitizePHI(savedAllergy, 'log');
logger.info('Allergy created', sanitized);
```

### Vaccination Compliance Check

```typescript
import {
  calculateVaccinationCompliance,
  checkStateVaccinationRequirements,
  determineNextDueDate
} from '@/utils/healthRecords';

// Check compliance for student in California, 7th grade
const compliance = await calculateVaccinationCompliance('student-123', 'CA');
const requirements = await checkStateVaccinationRequirements('CA', '7');

if (!compliance.isCompliant) {
  console.log('Student is not compliant with vaccination requirements');

  console.log('\nMissing vaccines:');
  compliance.missingVaccines.forEach(vaccine => {
    const req = requirements.requiredVaccines.find(r => r.vaccine === vaccine);
    console.log(`- ${vaccine}: ${req?.minimumDoses} doses required`);
  });

  console.log('\nUpcoming doses:');
  compliance.upcomingDoses.forEach(dose => {
    console.log(`- ${dose.vaccine} dose ${dose.doseNumber} due: ${dose.dueDate.toLocaleDateString()}`);
  });
}
```

### Growth Monitoring System

```typescript
import {
  calculateBMI,
  identifyGrowthConcerns,
  analyzeTrends,
  getCDCGrowthChartData
} from '@/utils/healthRecords';

// New measurement
const measurement = {
  height: 145.5,
  heightUnit: 'CM',
  weight: 42.3,
  weightUnit: 'KG'
};

// Calculate BMI
measurement.bmi = calculateBMI(
  measurement.height,
  measurement.weight,
  measurement.heightUnit,
  measurement.weightUnit
);

// Get percentiles from CDC data
const studentAge = 120; // months
const growthData = await getCDCGrowthChartData(studentAge, 'MALE');

// Save measurement
const saved = await prisma.growthMeasurement.create({
  data: {
    ...measurement,
    studentId: 'student-123',
    measurementDate: new Date(),
    measuredBy: 'Nurse Johnson'
  }
});

// Get history and analyze
const history = await prisma.growthMeasurement.findMany({
  where: { studentId: 'student-123' },
  orderBy: { measurementDate: 'desc' }
});

// Check for concerns
const concerns = identifyGrowthConcerns(history);
if (concerns.length > 0) {
  console.log('Growth concerns detected:');
  concerns.forEach(concern => {
    console.log(`${concern.type}: ${concern.description}`);
    console.log(`Action: ${concern.recommendation}`);
  });
}

// Analyze trends
const trends = analyzeTrends(history);
console.log(`Growth trend: ${trends.trend}`);
console.log(`Velocity: ${trends.velocity} cm/month`);
if (!trends.isNormal) {
  console.log('ALERT: Abnormal growth pattern detected');
}
```

---

## Error Handling

All functions include proper error handling:

```typescript
try {
  const contraindications = await checkAllergyContraindications(
    studentId,
    medicationId
  );
} catch (error) {
  console.error('Error checking contraindications:', error);
  // Handle error appropriately
}
```

---

## HIPAA Compliance

This module follows HIPAA compliance best practices:

1. **PHI Sanitization**: Always use `sanitizePHI()` when logging
2. **Access Control**: Validate user permissions before operations
3. **Audit Logging**: Log all PHI access with sanitized data
4. **Data Minimization**: Only collect necessary information
5. **Encryption**: All sensitive data should be encrypted at rest

---

## Contributing

When adding new features:

1. Follow existing patterns for validation, business logic, and helpers
2. Include comprehensive JSDoc documentation
3. Add error handling and validation
4. Update this README with examples
5. Ensure HIPAA compliance

---

## License

Proprietary - White Cross Healthcare Platform
