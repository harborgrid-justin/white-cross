# Database Migration Quick Start Guide

## Migration Status: ✅ COMPLETE

The comprehensive health records schema migration has been successfully applied to the White Cross healthcare platform database.

---

## What Changed?

### New Tables
- **vaccinations** - Comprehensive vaccination tracking with CDC compliance
- **screenings** - Vision, hearing, scoliosis, and other health screenings
- **growth_measurements** - Height, weight, BMI, and growth percentiles
- **vital_signs** - Temperature, blood pressure, heart rate, oxygen saturation, etc.

### Enhanced Tables
- **health_records** - Added provider info, diagnosis codes, follow-up tracking, audit fields
- **allergies** - Added allergy types, emergency protocols, EpiPen tracking, audit fields
- **chronic_conditions** - Added severity levels, action plans, accommodations, audit fields

### New Features
- 11 new medical coding enums (AllergyType, VaccineType, ScreeningType, etc.)
- 39 performance indexes for optimized queries
- Full-text search capability on health records
- HIPAA-compliant audit trails (createdBy/updatedBy fields)
- Medical coding standards support (ICD-10, NPI, CVX, NDC)

---

## Database Status

```
Database: neondb (PostgreSQL 15)
Schema Version: Up to date
Total Migrations: 7
Health Tables: 7 (health_records, allergies, chronic_conditions, vaccinations, screenings, growth_measurements, vital_signs)
Total Indexes: 39
```

---

## Quick Commands

### View Database in Prisma Studio
```bash
cd F:\temp\white-cross\backend
npx prisma studio
```
Opens at http://localhost:5555

### Check Migration Status
```bash
cd F:\temp\white-cross\backend
npx prisma migrate status
```

### Regenerate Prisma Client (if needed)
```bash
cd F:\temp\white-cross\backend
npx prisma generate
```

### Format Schema
```bash
cd F:\temp\white-cross\backend
npx prisma format
```

---

## Using the New Schema in Code

### Example: Create a Vaccination Record

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function recordVaccination() {
  const vaccination = await prisma.vaccination.create({
    data: {
      studentId: 'student_123',
      vaccineName: 'MMR Vaccine',
      vaccineType: 'MMR',
      manufacturer: 'Merck',
      administrationDate: new Date(),
      administeredBy: 'Nurse Jane Smith',
      siteOfAdministration: 'ARM_RIGHT',
      routeOfAdministration: 'INTRAMUSCULAR',
      doseNumber: 1,
      totalDoses: 2,
      complianceStatus: 'COMPLIANT',
      consentObtained: true,
      visProvided: true,
      createdBy: 'nurse_456',
    },
  });

  return vaccination;
}
```

### Example: Query Active Allergies

```typescript
async function getActiveAllergies(studentId: string) {
  const allergies = await prisma.allergy.findMany({
    where: {
      studentId,
      active: true,
    },
    orderBy: {
      severity: 'desc', // Most severe first
    },
  });

  return allergies;
}
```

### Example: Record Vital Signs

```typescript
async function recordVitalSigns(appointmentId: string) {
  const vitalSigns = await prisma.vitalSigns.create({
    data: {
      studentId: 'student_123',
      appointmentId,
      measurementDate: new Date(),
      measuredBy: 'Nurse Smith',
      temperature: 98.6,
      temperatureUnit: 'F',
      temperatureSite: 'Oral',
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      heartRate: 72,
      respiratoryRate: 16,
      oxygenSaturation: 98,
      createdBy: 'nurse_456',
    },
  });

  return vitalSigns;
}
```

### Example: Search Health Records

```typescript
async function searchHealthRecords(searchTerm: string) {
  // Uses the full-text search index
  const records = await prisma.$queryRaw`
    SELECT * FROM health_records
    WHERE to_tsvector('english',
      COALESCE(description, '') || ' ' ||
      COALESCE(notes, '') || ' ' ||
      COALESCE(provider, '')
    ) @@ plainto_tsquery('english', ${searchTerm})
    ORDER BY "recordDate" DESC
    LIMIT 20;
  `;

  return records;
}
```

---

## Performance Tips

1. **Use Indexed Queries**: The schema includes 39 indexes optimized for common queries
2. **Leverage Composite Indexes**: Query by (studentId, date) for best performance
3. **Use Enums**: Always use enum values for type-safe, indexed queries
4. **Include Audit Fields**: Always populate createdBy/updatedBy for compliance

### Well-Indexed Queries (Fast ⚡)
```typescript
// Uses: health_records_studentId_recordDate_idx
prisma.healthRecord.findMany({
  where: { studentId: '123' },
  orderBy: { recordDate: 'desc' }
});

// Uses: allergies_studentId_active_idx
prisma.allergy.findMany({
  where: { studentId: '123', active: true }
});

// Uses: vaccinations_nextDueDate_idx
prisma.vaccination.findMany({
  where: { nextDueDate: { lte: new Date() } }
});
```

---

## HIPAA Compliance Reminders

1. **Always Use Audit Fields**
   - Set `createdBy` on create
   - Set `updatedBy` on update

2. **Mark Confidential Records**
   - Use `isConfidential: true` for sensitive health records
   - Implement additional access controls in application layer

3. **Log Access**
   - Log all PHI (Protected Health Information) access
   - Include user ID, timestamp, and action

4. **Encrypt Sensitive Data**
   - Database supports encryption at rest
   - Use application-layer encryption for extra sensitive fields

---

## Common Queries

### Get Student's Complete Health Profile
```typescript
const profile = await prisma.student.findUnique({
  where: { id: studentId },
  include: {
    healthRecords: {
      orderBy: { recordDate: 'desc' },
      take: 10,
    },
    allergies: {
      where: { active: true },
    },
    chronicConditions: {
      where: { status: 'ACTIVE' },
    },
    vaccinations: {
      orderBy: { administrationDate: 'desc' },
    },
    screenings: {
      orderBy: { screeningDate: 'desc' },
      take: 5,
    },
    growthMeasurements: {
      orderBy: { measurementDate: 'desc' },
      take: 10,
    },
    vitalSigns: {
      orderBy: { measurementDate: 'desc' },
      take: 10,
    },
  },
});
```

### Find Students Needing Follow-Up
```typescript
const needsFollowUp = await prisma.healthRecord.findMany({
  where: {
    followUpRequired: true,
    followUpCompleted: false,
    followUpDate: {
      lte: new Date(), // Overdue
    },
  },
  include: {
    student: true,
  },
});
```

### Vaccination Compliance Report
```typescript
const compliance = await prisma.vaccination.groupBy({
  by: ['complianceStatus'],
  _count: true,
});
```

---

## Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
cd F:\temp\white-cross\backend
npm install @prisma/client
npx prisma generate
```

### "Table does not exist"
```bash
cd F:\temp\white-cross\backend
npx prisma migrate deploy
```

### Schema Out of Sync
```bash
cd F:\temp\white-cross\backend
npx prisma db pull  # Pull current database schema
npx prisma generate # Regenerate client
```

---

## Need More Information?

- **Full Migration Report**: See `F:\temp\white-cross\MIGRATION_REPORT_2025-10-10.md`
- **Prisma Schema**: See `F:\temp\white-cross\backend\prisma\schema.prisma`
- **Migration SQL**: See `F:\temp\white-cross\backend\prisma\migrations\`

---

**Last Updated:** October 10, 2025
**Status:** Ready for Development
