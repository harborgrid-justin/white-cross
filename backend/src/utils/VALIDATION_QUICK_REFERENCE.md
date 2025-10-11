# Health Record Validators - Quick Reference Guide

## Import Statement

```typescript
import {
  // Medical Code Validators
  validateICD10Code,
  validateCVXCode,
  validateNDCCode,
  validateNPI,

  // Vital Signs Validators
  validateTemperature,
  validateBloodPressure,
  validateHeartRate,
  validateRespiratoryRate,
  validateOxygenSaturation,
  validateVitalSigns,

  // Growth Validators
  calculateBMI,
  validateBMI,
  validateHeight,
  validateWeight,

  // Date Validators
  validateDiagnosisDate,
  validateVaccinationDates,

  // Other Validators
  validateAllergyReactions,
  validateHealthRecordData,

  // Types
  ValidationResult,
  AgeCategory
} from './healthRecordValidators';
```

## Quick Usage Examples

### Medical Code Validation

```typescript
// ICD-10 Code
const result = validateICD10Code('A00.0');
if (!result.isValid) {
  console.error('Invalid ICD-10:', result.errors);
}

// CVX Code
const cvxResult = validateCVXCode('140');
if (!cvxResult.isValid) {
  throw new Error(cvxResult.errors.join(', '));
}

// NPI
const npiResult = validateNPI('1234567893');
console.log('Warnings:', npiResult.warnings);
```

### Vital Signs Validation

```typescript
// Individual vital sign
const tempResult = validateTemperature(38.5, 'celsius');
if (tempResult.warnings.length > 0) {
  logger.warn('Temperature warnings:', tempResult.warnings);
}

// Blood Pressure
const bpResult = validateBloodPressure(120, 80, AgeCategory.ADULT);
if (!bpResult.isValid) {
  throw new Error('Invalid BP');
}

// Complete Vital Signs
const vitalsResult = validateVitalSigns({
  temperature: 37.0,
  bloodPressureSystolic: 120,
  bloodPressureDiastolic: 80,
  heartRate: 72,
  respiratoryRate: 16,
  oxygenSaturation: 98,
  height: 170,
  weight: 70
}, studentDateOfBirth);

if (!vitalsResult.isValid) {
  return res.status(400).json({ errors: vitalsResult.errors });
}
```

### BMI Calculation

```typescript
// Auto-calculate BMI
const bmi = calculateBMI(170, 70); // height in cm, weight in kg
console.log('BMI:', bmi); // 24.2

// Validate BMI
const bmiResult = validateBMI(24.2, bmi);
if (bmiResult.warnings.length > 0) {
  console.log('BMI category:', bmiResult.warnings[0]);
}
```

### Date Validation

```typescript
// Diagnosis Date
const diagnosisResult = validateDiagnosisDate(new Date('2024-01-15'));
if (!diagnosisResult.isValid) {
  throw new Error('Invalid diagnosis date');
}

// Vaccination Dates
const vaccResult = validateVaccinationDates(
  new Date('2024-01-15'),  // administration
  new Date('2025-01-15')   // expiration
);
```

### Complete Health Record Validation

```typescript
const validation = validateHealthRecordData({
  vital: {
    temperature: 37.2,
    bloodPressureSystolic: 118,
    bloodPressureDiastolic: 76,
    heartRate: 68,
    height: 165,
    weight: 62
  },
  date: new Date(),
  diagnosisCode: 'J06.9',
  providerNpi: '1234567893'
}, studentDateOfBirth);

if (!validation.isValid) {
  throw new Error(validation.errors.join(', '));
}

// Log warnings but proceed
if (validation.warnings.length > 0) {
  logger.warn('Validation warnings:', validation.warnings);
}
```

## Validation Result Pattern

All validators return:

```typescript
interface ValidationResult {
  isValid: boolean;    // false = has critical errors
  errors: string[];    // blocking errors
  warnings: string[];  // non-blocking warnings
}
```

### Usage Pattern

```typescript
const result = validateSomething(data);

// Check critical errors
if (!result.isValid) {
  throw new Error(result.errors.join(', '));
}

// Log warnings
if (result.warnings.length > 0) {
  logger.warn('Warnings:', result.warnings);
}

// Proceed with operation
await saveToDatabase(data);
```

## Age Categories

```typescript
enum AgeCategory {
  INFANT = 'INFANT',        // 0-2 years
  CHILD = 'CHILD',          // 2-12 years
  ADOLESCENT = 'ADOLESCENT', // 12-18 years
  ADULT = 'ADULT'           // 18+ years
}
```

Age is auto-calculated from date of birth in `validateVitalSigns()`.

## Clinical Ranges Quick Reference

### Temperature
- **Celsius**: 35.0°C - 42.0°C (normal: 36.1°C - 37.8°C)
- **Fahrenheit**: 95.0°F - 107.6°F (normal: 97.0°F - 100.0°F)

### Blood Pressure (by age)
- **Infant**: 50-100 / 30-70 mmHg
- **Child**: 70-130 / 40-90 mmHg
- **Adolescent**: 90-140 / 50-95 mmHg
- **Adult**: 90-200 / 50-130 mmHg

### Heart Rate (by age)
- **Infant**: 100-180 bpm
- **Child**: 70-140 bpm
- **Adolescent**: 60-120 bpm
- **Adult**: 40-150 bpm

### Respiratory Rate (by age)
- **Infant**: 30-60 breaths/min
- **Child**: 20-40 breaths/min
- **Adolescent**: 12-30 breaths/min
- **Adult**: 8-30 breaths/min

### Oxygen Saturation
- **Range**: 70-100%
- **Normal**: ≥ 95%
- **Critical**: < 90%

### Height (by age, in cm)
- **Infant**: 45-100
- **Child**: 80-160
- **Adolescent**: 140-200
- **Adult**: 140-230

### Weight (by age, in kg)
- **Infant**: 2-15
- **Child**: 10-60
- **Adolescent**: 30-120
- **Adult**: 35-300

### BMI
- **Range**: 10-60
- **Underweight**: < 18.5
- **Normal**: 18.5-24.9
- **Overweight**: 25-29.9
- **Obese**: ≥ 30

## Medical Code Formats

### ICD-10
- **Format**: `A00` or `A00.0` or `A00.00`
- **Pattern**: Letter + 2-3 digits + optional decimal + 1-2 digits
- **Example**: `J06.9` (Acute upper respiratory infection)

### CVX
- **Format**: 1-3 digit number
- **Range**: 001-999
- **Example**: `140` (Influenza, seasonal, injectable, preservative free)

### NDC
- **Format**: 10-11 digits, often with hyphens
- **Pattern**: `00000-0000-00`
- **Example**: `00002-7510-01`

### NPI
- **Format**: Exactly 10 digits
- **Validation**: Luhn checksum algorithm
- **Example**: `1234567893`

## Common Integration Patterns

### Health Record Creation

```typescript
import { validateHealthRecordData, calculateBMI } from './healthRecordValidators';

async function createHealthRecord(data: CreateHealthRecordData) {
  // Get student with DOB
  const student = await Student.findByPk(data.studentId);

  // Validate
  const validation = validateHealthRecordData(
    {
      vital: data.vital,
      date: data.date,
      diagnosisCode: data.diagnosisCode,
      providerNpi: data.providerNpi
    },
    student.dateOfBirth ? new Date(student.dateOfBirth) : undefined
  );

  if (!validation.isValid) {
    throw new Error(validation.errors.join(', '));
  }

  // Auto-calculate BMI
  if (data.vital?.height && data.vital?.weight) {
    data.vital.bmi = calculateBMI(data.vital.height, data.vital.weight);
  }

  // Log warnings
  if (validation.warnings.length > 0) {
    logger.warn('Health record warnings:', validation.warnings);
  }

  // Create record
  return await HealthRecord.create(data);
}
```

### Allergy Management

```typescript
import { validateAllergyReactions, AllergySeverity } from './healthRecordValidators';

async function addAllergy(data: CreateAllergyData) {
  // Validate reactions
  if (data.reaction) {
    const validation = validateAllergyReactions(data.reaction);
    if (validation.warnings.length > 0) {
      logger.warn('Reaction warnings:', validation.warnings);
    }
  }

  // Critical allergy alert
  if (data.severity === AllergySeverity.LIFE_THREATENING) {
    logger.warn(`CRITICAL ALLERGY: ${data.allergen} for student ${data.studentId}`);
    // Trigger alert system
    await sendCriticalAllergyAlert(data.studentId, data.allergen);
  }

  return await Allergy.create(data);
}
```

### Vaccination Management

```typescript
import { validateCVXCode, validateVaccinationDates } from './healthRecordValidators';

async function addVaccination(data: CreateVaccinationData) {
  // Validate CVX code
  if (data.cvxCode) {
    const cvxResult = validateCVXCode(data.cvxCode);
    if (!cvxResult.isValid) {
      throw new Error(`Invalid CVX code: ${cvxResult.errors.join(', ')}`);
    }
  }

  // Validate dates
  const dateResult = validateVaccinationDates(
    new Date(data.administrationDate),
    data.expirationDate ? new Date(data.expirationDate) : undefined
  );

  if (!dateResult.isValid) {
    throw new Error(`Invalid dates: ${dateResult.errors.join(', ')}`);
  }

  // Auto-calculate series completion
  data.seriesComplete = data.doseNumber === data.totalDoses;

  return await Vaccination.create(data);
}
```

### Chronic Condition Management

```typescript
import { validateICD10Code, validateDiagnosisDate } from './healthRecordValidators';

async function addChronicCondition(data: CreateChronicConditionData) {
  // Validate ICD-10 code
  if (data.icdCode) {
    const icdResult = validateICD10Code(data.icdCode);
    if (!icdResult.isValid) {
      throw new Error(`Invalid ICD-10: ${icdResult.errors.join(', ')}`);
    }
  }

  // Validate diagnosis date
  const dateResult = validateDiagnosisDate(new Date(data.diagnosisDate));
  if (!dateResult.isValid) {
    throw new Error(`Invalid diagnosis date: ${dateResult.errors.join(', ')}`);
  }

  // Critical condition alert
  if (data.severity === ConditionSeverity.CRITICAL) {
    logger.warn(`CRITICAL CONDITION: ${data.condition} for student ${data.studentId}`);
  }

  return await ChronicCondition.create(data);
}
```

## Error Handling Best Practices

### 1. Separate Errors and Warnings

```typescript
const result = validate(data);

// Block on errors
if (!result.isValid) {
  return res.status(400).json({
    error: 'Validation failed',
    details: result.errors
  });
}

// Log warnings but proceed
if (result.warnings.length > 0) {
  logger.warn('Validation warnings:', result.warnings);
}
```

### 2. Provide Specific Error Messages

```typescript
if (!result.isValid) {
  const errorMessage = `Health record validation failed: ${result.errors.join(', ')}`;
  logger.error(errorMessage);
  throw new Error(errorMessage);
}
```

### 3. PHI-Safe Error Responses

```typescript
// BAD: Exposes PHI
throw new Error(`Invalid BP for John Doe: ${systolic}/${diastolic}`);

// GOOD: Generic message
throw new Error(`Blood pressure validation failed: ${result.errors.join(', ')}`);
```

### 4. Audit Trail Logging

```typescript
if (result.warnings.length > 0) {
  logger.warn(`Health record validation warnings for student ${studentId}:`, {
    warnings: result.warnings,
    timestamp: new Date(),
    userId: currentUser.id
  });
}
```

## Testing Examples

```typescript
import { describe, it, expect } from 'vitest';
import { validateBloodPressure, AgeCategory } from './healthRecordValidators';

describe('Blood Pressure Validation', () => {
  it('should validate normal adult BP', () => {
    const result = validateBloodPressure(120, 80, AgeCategory.ADULT);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject systolic <= diastolic', () => {
    const result = validateBloodPressure(80, 120, AgeCategory.ADULT);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('must be greater than');
  });

  it('should warn about hypertension', () => {
    const result = validateBloodPressure(150, 95, AgeCategory.ADULT);
    expect(result.isValid).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
```

## Performance Tips

1. **Batch Validations**: Use `validateVitalSigns()` instead of individual validators
2. **Early Returns**: Validators use early return patterns
3. **Optional Validations**: Skip validation if data not provided
4. **Caching**: Consider caching age category calculations

## Support and Questions

For questions or issues:
1. Check this reference guide
2. Review `healthRecordValidators.ts` source code
3. See `HEALTH_RECORDS_VALIDATION_SUMMARY.md` for detailed documentation
4. Contact the development team

---

**Version**: 1.0
**Last Updated**: 2025-10-11
**Maintained By**: Development Team
