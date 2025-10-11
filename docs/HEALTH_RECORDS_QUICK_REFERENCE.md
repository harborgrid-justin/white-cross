# Health Records Schema - Quick Reference Guide

## Overview

Quick reference for developers working with the White Cross health records database schema.

## Table Summary

| Model | Purpose | Key Fields | Common Queries |
|-------|---------|-----------|----------------|
| **HealthRecord** | Main health documentation | recordType, recordDate, diagnosis, followUpRequired | Student history, follow-ups needed |
| **Allergy** | Allergy tracking | allergen, allergyType, severity, epiPenExpiration | Active allergies, expiring EpiPens |
| **ChronicCondition** | Chronic disease management | condition, severity, status, nextReviewDate | Active conditions, reviews due |
| **Vaccination** | Immunization records | vaccineName, vaccineType, complianceStatus, nextDueDate | Compliance reports, upcoming doses |
| **Screening** | Health screenings | screeningType, outcome, referralRequired | Failed screenings, pending referrals |
| **GrowthMeasurement** | Growth tracking | height, weight, bmi, bmiPercentile | Growth charts, BMI trends |
| **VitalSigns** | Vital signs | temperature, bloodPressure, heartRate, oxygenSaturation | Latest vitals, trending data |

## Common Query Patterns

### 1. Get Active Student Allergies (Emergency View)

```typescript
const allergies = await prisma.allergy.findMany({
  where: {
    studentId: 'student_id',
    active: true
  },
  orderBy: { severity: 'desc' },
  select: {
    allergen: true,
    allergyType: true,
    severity: true,
    reactions: true,
    emergencyProtocol: true,
    epiPenRequired: true,
    epiPenLocation: true
  }
});
```

**Index Used**: `allergies_studentId_active_idx`

### 2. Get Vaccination Compliance Status

```typescript
const vaccinations = await prisma.vaccination.findMany({
  where: {
    studentId: 'student_id'
  },
  orderBy: { administrationDate: 'desc' },
  select: {
    vaccineName: true,
    vaccineType: true,
    administrationDate: true,
    doseNumber: true,
    totalDoses: true,
    seriesComplete: true,
    complianceStatus: true,
    nextDueDate: true
  }
});
```

**Index Used**: `vaccinations_studentId_administrationDate_idx`

### 3. Get Active Chronic Conditions

```typescript
const conditions = await prisma.chronicCondition.findMany({
  where: {
    studentId: 'student_id',
    status: 'ACTIVE'
  },
  orderBy: { severity: 'desc' },
  select: {
    condition: true,
    icdCode: true,
    severity: true,
    emergencyProtocol: true,
    actionPlan: true,
    accommodationsRequired: true,
    accommodationDetails: true,
    medications: true,
    restrictions: true
  }
});
```

**Index Used**: `chronic_conditions_studentId_status_idx`

### 4. Get Latest Vital Signs

```typescript
const latestVitals = await prisma.vitalSigns.findFirst({
  where: { studentId: 'student_id' },
  orderBy: { measurementDate: 'desc' },
  select: {
    measurementDate: true,
    temperature: true,
    temperatureUnit: true,
    bloodPressureSystolic: true,
    bloodPressureDiastolic: true,
    heartRate: true,
    respiratoryRate: true,
    oxygenSaturation: true,
    painLevel: true,
    consciousness: true
  }
});
```

**Index Used**: `vital_signs_studentId_measurementDate_idx`

### 5. Get Growth Chart Data

```typescript
const growthData = await prisma.growthMeasurement.findMany({
  where: { studentId: 'student_id' },
  orderBy: { measurementDate: 'asc' },
  select: {
    measurementDate: true,
    height: true,
    weight: true,
    bmi: true,
    bmiPercentile: true,
    heightPercentile: true,
    weightPercentile: true,
    nutritionalStatus: true
  }
});
```

**Index Used**: `growth_measurements_studentId_measurementDate_idx`

### 6. Find Students with Overdue Vaccinations

```typescript
const overdueStudents = await prisma.vaccination.findMany({
  where: {
    complianceStatus: {
      in: ['OVERDUE', 'NON_COMPLIANT']
    },
    student: {
      isActive: true
    }
  },
  include: {
    student: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        grade: true
      }
    }
  },
  orderBy: { nextDueDate: 'asc' }
});
```

**Index Used**: `vaccinations_vaccineType_complianceStatus_idx`

### 7. Find Expiring EpiPens

```typescript
const expiringEpiPens = await prisma.allergy.findMany({
  where: {
    epiPenRequired: true,
    epiPenExpiration: {
      lte: addMonths(new Date(), 3) // Within 3 months
    },
    active: true,
    student: {
      isActive: true
    }
  },
  include: {
    student: {
      select: {
        firstName: true,
        lastName: true,
        grade: true
      }
    }
  },
  orderBy: { epiPenExpiration: 'asc' }
});
```

**Index Used**: `allergies_epiPenExpiration_idx`

### 8. Get Health Records Needing Follow-Up

```typescript
const followUpNeeded = await prisma.healthRecord.findMany({
  where: {
    followUpRequired: true,
    followUpCompleted: false,
    followUpDate: {
      lte: addDays(new Date(), 7) // Due within 7 days
    }
  },
  include: {
    student: {
      select: {
        firstName: true,
        lastName: true,
        grade: true
      }
    }
  },
  orderBy: { followUpDate: 'asc' }
});
```

**Index Used**: `health_records_followUpRequired_followUpDate_idx`

### 9. Get Failed Screenings Requiring Referrals

```typescript
const referralsNeeded = await prisma.screening.findMany({
  where: {
    outcome: {
      in: ['REFER', 'FAIL']
    },
    referralRequired: true,
    followUpStatus: {
      in: ['PENDING', 'SCHEDULED']
    }
  },
  include: {
    student: {
      select: {
        firstName: true,
        lastName: true,
        grade: true
      }
    }
  },
  orderBy: { screeningDate: 'desc' }
});
```

**Index Used**: `screenings_referralRequired_followUpRequired_idx`

### 10. Complete Student Health Summary

```typescript
async function getCompleteHealthSummary(studentId: string) {
  return await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      allergies: {
        where: { active: true },
        orderBy: { severity: 'desc' }
      },
      chronicConditions: {
        where: { status: 'ACTIVE' },
        orderBy: { severity: 'desc' }
      },
      vaccinations: {
        orderBy: { administrationDate: 'desc' },
        take: 10
      },
      screenings: {
        orderBy: { screeningDate: 'desc' },
        take: 5
      },
      growthMeasurements: {
        orderBy: { measurementDate: 'desc' },
        take: 1
      },
      vitalSigns: {
        orderBy: { measurementDate: 'desc' },
        take: 1
      }
    }
  });
}
```

## Field Reference

### HealthRecord Key Fields

- `recordType`: Type of health record (enum: CHECKUP, VACCINATION, ILLNESS, etc.)
- `recordDate`: Date of the health record event
- `provider`: Name of healthcare provider
- `providerNpi`: National Provider Identifier
- `diagnosisCode`: ICD-10 diagnosis code
- `followUpRequired`: Boolean flag for follow-up needed
- `followUpDate`: When follow-up is due
- `isConfidential`: Extra sensitivity flag
- `createdBy`: User ID who created the record
- `updatedBy`: User ID who last updated

### Allergy Key Fields

- `allergen`: Name of allergen (e.g., "Peanuts")
- `allergyType`: Category (FOOD, MEDICATION, ENVIRONMENTAL, etc.)
- `severity`: Level (MILD, MODERATE, SEVERE, LIFE_THREATENING)
- `emergencyProtocol`: Emergency response steps
- `epiPenRequired`: Boolean for EpiPen necessity
- `epiPenExpiration`: Expiration date of EpiPen
- `active`: Boolean for active/resolved status
- `verified`: Boolean for verification status

### ChronicCondition Key Fields

- `condition`: Name of condition (e.g., "Type 1 Diabetes")
- `icdCode`: ICD-10 code
- `severity`: Level (MILD, MODERATE, SEVERE, CRITICAL)
- `status`: Status (ACTIVE, MANAGED, RESOLVED, MONITORING)
- `emergencyProtocol`: Emergency action plan
- `actionPlan`: Care/management plan
- `accommodationsRequired`: Boolean for 504 plan
- `nextReviewDate`: When condition should be reviewed

### Vaccination Key Fields

- `vaccineName`: Name of vaccine
- `vaccineType`: Category (COVID_19, FLU, MMR, etc.)
- `cvxCode`: CDC vaccine code
- `ndcCode`: National Drug Code
- `doseNumber`: Which dose in series (1, 2, 3, etc.)
- `seriesComplete`: Boolean for series completion
- `complianceStatus`: Status (COMPLIANT, OVERDUE, EXEMPT, etc.)
- `nextDueDate`: When next dose is due
- `exemptionStatus`: Boolean for exemption

### Screening Key Fields

- `screeningType`: Type (VISION, HEARING, SCOLIOSIS, etc.)
- `outcome`: Result (PASS, REFER, FAIL, INCONCLUSIVE)
- `referralRequired`: Boolean for referral needed
- `followUpStatus`: Status (PENDING, SCHEDULED, COMPLETED, etc.)
- `rightEye` / `leftEye`: Vision screening results
- `rightEar` / `leftEar`: Hearing screening results

### GrowthMeasurement Key Fields

- `height`: Height value (stored in cm)
- `weight`: Weight value (stored in kg)
- `bmi`: Calculated BMI
- `bmiPercentile`: BMI percentile for age/gender
- `heightPercentile`: Height percentile
- `weightPercentile`: Weight percentile
- `nutritionalStatus`: Status (Underweight, Normal, Overweight, Obese)

### VitalSigns Key Fields

- `temperature`: Temperature value
- `temperatureUnit`: Unit (F or C)
- `bloodPressureSystolic`: Systolic BP (mmHg)
- `bloodPressureDiastolic`: Diastolic BP (mmHg)
- `heartRate`: Heart rate (bpm)
- `respiratoryRate`: Respiratory rate (breaths/min)
- `oxygenSaturation`: O2 saturation (percentage)
- `painLevel`: Pain scale (0-10)
- `consciousness`: Level (ALERT, VERBAL, PAIN, UNRESPONSIVE, etc.)

## Enum Values Quick Reference

### AllergyType
`FOOD | MEDICATION | ENVIRONMENTAL | INSECT | LATEX | ANIMAL | CHEMICAL | SEASONAL | OTHER`

### AllergySeverity
`MILD | MODERATE | SEVERE | LIFE_THREATENING`

### ConditionStatus
`ACTIVE | MANAGED | RESOLVED | MONITORING | INACTIVE`

### ConditionSeverity
`MILD | MODERATE | SEVERE | CRITICAL`

### VaccineComplianceStatus
`COMPLIANT | OVERDUE | PARTIALLY_COMPLIANT | EXEMPT | NON_COMPLIANT`

### ScreeningOutcome
`PASS | REFER | FAIL | INCONCLUSIVE | INCOMPLETE`

### ScreeningType
`VISION | HEARING | SCOLIOSIS | DENTAL | BMI | BLOOD_PRESSURE | DEVELOPMENTAL | SPEECH | MENTAL_HEALTH | TUBERCULOSIS | LEAD | ANEMIA | OTHER`

### ConsciousnessLevel
`ALERT | VERBAL | PAIN | UNRESPONSIVE | DROWSY | CONFUSED | LETHARGIC`

## Index Reference

### HealthRecord Indexes
- `health_records_studentId_recordDate_idx` - Student health history
- `health_records_recordType_recordDate_idx` - Filter by type and date
- `health_records_createdBy_idx` - Audit queries
- `health_records_followUpRequired_followUpDate_idx` - Follow-up management

### Allergy Indexes
- `allergies_studentId_active_idx` - Active allergies by student
- `allergies_allergyType_severity_idx` - Filtering by type/severity
- `allergies_epiPenExpiration_idx` - EpiPen expiration tracking

### ChronicCondition Indexes
- `chronic_conditions_studentId_status_idx` - Active conditions by student
- `chronic_conditions_severity_status_idx` - Critical condition monitoring
- `chronic_conditions_nextReviewDate_idx` - Review scheduling

### Vaccination Indexes
- `vaccinations_studentId_administrationDate_idx` - Vaccination history
- `vaccinations_vaccineType_complianceStatus_idx` - Compliance reporting
- `vaccinations_nextDueDate_idx` - Upcoming vaccinations
- `vaccinations_expirationDate_idx` - Vaccine lot expiration

### Screening Indexes
- `screenings_studentId_screeningDate_idx` - Screening history
- `screenings_screeningType_outcome_idx` - Screening results
- `screenings_referralRequired_followUpRequired_idx` - Referral tracking
- `screenings_followUpDate_idx` - Follow-up scheduling

### GrowthMeasurement Indexes
- `growth_measurements_studentId_measurementDate_idx` - Growth charts
- `growth_measurements_measurementDate_idx` - Batch measurements

### VitalSigns Indexes
- `vital_signs_studentId_measurementDate_idx` - Vital signs history
- `vital_signs_measurementDate_idx` - Date-based queries
- `vital_signs_appointmentId_idx` - Appointment vitals

## Performance Tips

1. **Always Filter by studentId First**: Most indexes are compound with studentId
2. **Use Select to Limit Fields**: Only fetch fields you need
3. **Leverage Indexes**: Check EXPLAIN ANALYZE to verify index usage
4. **Cache Frequently Accessed Data**: Active allergies, compliance status
5. **Use Prisma's Include Wisely**: Deep nesting can cause N+1 queries
6. **Batch Operations**: Use `createMany` for bulk inserts
7. **Pagination**: Use `skip` and `take` for large result sets

## HIPAA Compliance Reminders

- Always log access to health records (use `createdBy`, `updatedBy`)
- Mark sensitive records with `isConfidential` flag
- Use role-based access control (RBAC) before queries
- Audit trail required for all PHI access
- Encrypt data in transit and at rest
- Implement minimum necessary access principle

## Migration Commands

```bash
# Generate migration
npx prisma migrate dev --name complete_health_records_schema

# Apply migration to production
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# View database in browser
npx prisma studio
```

## Common Gotchas

1. **Field Rename**: `type` → `recordType`, `date` → `recordDate` in HealthRecord
2. **Enum Changes**: ConditionStatus changed from string to enum
3. **Optional Relations**: healthRecordId is nullable on all specialized tables
4. **Unit Storage**: Height in cm, weight in kg (convert on input/output)
5. **Cascade Deletes**: Student deletion cascades to ALL health records
6. **JSON Fields**: reactions, metadata, restrictions use JSONB (queryable)

## Support Resources

- **Schema File**: `F:\temp\white-cross\backend\prisma\schema.prisma`
- **Migration SQL**: `F:\temp\white-cross\backend\prisma\migrations\20251010_complete_health_records_schema\migration.sql`
- **Full Documentation**: `F:\temp\white-cross\HEALTH_RECORDS_SCHEMA_DESIGN.md`
- **Prisma Docs**: https://www.prisma.io/docs/

---

**Version**: 1.0
**Last Updated**: 2025-10-10
