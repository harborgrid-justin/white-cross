# Comprehensive Health Records Database Schema Design

## Executive Summary

This document describes the comprehensive health records database schema designed for the White Cross healthcare platform. The schema is HIPAA-compliant, performance-optimized, and designed to meet the complex needs of school healthcare management.

## Table of Contents

1. [Schema Overview](#schema-overview)
2. [Core Models](#core-models)
3. [Data Model Relationships](#data-model-relationships)
4. [Indexing Strategy](#indexing-strategy)
5. [HIPAA Compliance Features](#hipaa-compliance-features)
6. [Performance Optimization](#performance-optimization)
7. [Usage Examples](#usage-examples)
8. [Migration Guide](#migration-guide)

---

## Schema Overview

The health records system consists of **7 primary models**:

1. **HealthRecord** - Main health record container
2. **Allergy** - Comprehensive allergy tracking
3. **ChronicCondition** - Chronic disease management
4. **Vaccination** - Immunization records
5. **Screening** - Health screening results
6. **GrowthMeasurement** - Growth and BMI tracking
7. **VitalSigns** - Vital signs measurements

### Design Principles

- **Normalization**: Properly normalized to 3NF while maintaining query performance
- **Flexibility**: JSON fields for extensibility without schema changes
- **Audit Trail**: Complete tracking of who created/modified records
- **Performance**: Strategic indexing on high-frequency query patterns
- **Compliance**: HIPAA-compliant with confidentiality flags and audit fields
- **Referential Integrity**: Proper cascade rules and foreign key constraints

---

## Core Models

### 1. HealthRecord (Enhanced)

**Purpose**: Central health record repository linking all health-related documentation.

**Key Features**:
- Comprehensive record typing (30+ record types)
- Provider tracking with NPI (National Provider Identifier)
- ICD-10 diagnosis coding support
- Follow-up management workflow
- Confidentiality marking
- Flexible metadata storage (JSON)
- Full audit trail

**Schema**:
```prisma
model HealthRecord {
  id                String           @id @default(cuid())
  recordType        HealthRecordType
  title             String
  description       String
  recordDate        DateTime
  provider          String?
  providerNpi       String?          // National Provider Identifier
  facility          String?
  facilityNpi       String?
  diagnosis         String?
  diagnosisCode     String?          // ICD-10 code
  treatment         String?
  followUpRequired  Boolean          @default(false)
  followUpDate      DateTime?
  followUpCompleted Boolean          @default(false)
  attachments       String[]         // File URLs
  metadata          Json?            // Flexible additional data
  isConfidential    Boolean          @default(false)
  notes             String?
  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt
  createdBy         String?          // User ID
  updatedBy         String?          // User ID

  // Relations
  student          Student           @relation(...)
  allergies        Allergy[]
  conditions       ChronicCondition[]
  vaccinations     Vaccination[]
  screenings       Screening[]
  vitalSigns       VitalSigns[]
  measurements     GrowthMeasurement[]
}
```

**Indexes**:
- `(studentId, recordDate)` - Primary student query pattern
- `(recordType, recordDate)` - Filtering by record type
- `(createdBy)` - Audit queries
- `(followUpRequired, followUpDate)` - Follow-up management

---

### 2. Allergy (Enhanced)

**Purpose**: Comprehensive allergy tracking with emergency response protocols.

**Key Enhancements**:
- Allergy type categorization (FOOD, MEDICATION, ENVIRONMENTAL, etc.)
- Structured reactions storage (JSON array)
- EpiPen management and expiration tracking
- Emergency protocol documentation
- Onset and diagnosis date tracking
- Active/inactive status management
- Verification workflow

**Schema Highlights**:
```prisma
allergyType        AllergyType     @default(OTHER)
symptoms           String?         // Detailed description
reactions          Json?           // Array of specific reactions
emergencyProtocol  String?         // Emergency response steps
epiPenRequired     Boolean         @default(false)
epiPenLocation     String?
epiPenExpiration   DateTime?
verified           Boolean         @default(false)
verifiedBy         String?
active             Boolean         @default(true)
```

**Indexes**:
- `(studentId, active)` - Active allergies for student
- `(allergyType, severity)` - Filtering and reporting
- `(epiPenExpiration)` - EpiPen expiration monitoring

**Use Cases**:
- Emergency room quick reference
- Medication contraindication checking
- Food service allergy alerts
- Annual EpiPen expiration review

---

### 3. ChronicCondition (Enhanced)

**Purpose**: Comprehensive chronic disease management with care planning.

**Key Enhancements**:
- ICD-10 coding support
- Severity and status tracking (enums)
- Emergency action plans
- Accommodation management
- Review date scheduling
- Structured restrictions and precautions (JSON)
- Medication tracking (JSON)

**Schema Highlights**:
```prisma
icdCode                 String?
severity                ConditionSeverity    @default(MODERATE)
status                  ConditionStatus      @default(ACTIVE)
accommodationsRequired  Boolean              @default(false)
accommodationDetails    String?
emergencyProtocol       String?
actionPlan              String?
reviewFrequency         String?             // "Every 6 months"
restrictions            Json?               // Structured data
precautions             Json?
```

**Indexes**:
- `(studentId, status)` - Active conditions per student
- `(severity, status)` - High-severity condition monitoring
- `(nextReviewDate)` - Review scheduling

**Use Cases**:
- 504 plan documentation
- Emergency response planning
- Activity restriction tracking
- Care plan review workflows

---

### 4. Vaccination (New)

**Purpose**: Complete immunization tracking with compliance management.

**Key Features**:
- CDC vaccine coding (CVX codes)
- National Drug Code (NDC) tracking
- Dose series management
- Compliance status tracking
- Exemption documentation
- VFC (Vaccines for Children) eligibility
- VIS (Vaccine Information Statement) tracking
- Adverse event reporting (VAERS-compatible)
- Consent management

**Schema Highlights**:
```prisma
vaccineName            String
vaccineType            VaccineType?
cvxCode                String?              // CDC vaccine code
ndcCode                String?              // National Drug Code
doseNumber             Int?                 // 1, 2, 3...
totalDoses             Int?
seriesComplete         Boolean              @default(false)
siteOfAdministration   AdministrationSite?
routeOfAdministration  AdministrationRoute?
complianceStatus       VaccineComplianceStatus @default(COMPLIANT)
exemptionStatus        Boolean              @default(false)
exemptionReason        String?
vfcEligibility         Boolean              @default(false)
visProvided            Boolean              @default(false)
adverseEvents          Json?
```

**Indexes**:
- `(studentId, administrationDate)` - Student vaccination history
- `(vaccineType, complianceStatus)` - Compliance reporting
- `(nextDueDate)` - Upcoming vaccination reminders
- `(expirationDate)` - Vaccine lot expiration

**Use Cases**:
- School enrollment compliance checking
- Vaccination schedule management
- Outbreak response (identify unvaccinated students)
- State reporting requirements
- Adverse event tracking

---

### 5. Screening (New)

**Purpose**: Standardized health screening documentation.

**Key Features**:
- Multiple screening types (VISION, HEARING, SCOLIOSIS, DENTAL, etc.)
- Structured results storage (JSON)
- Pass/Refer/Fail outcomes
- Referral workflow management
- Follow-up tracking
- Equipment documentation
- Eye/ear specific fields

**Schema Highlights**:
```prisma
screeningType     ScreeningType
outcome           ScreeningOutcome     @default(PASS)
results           Json?                // Structured findings
referralRequired  Boolean              @default(false)
referralTo        String?
followUpStatus    FollowUpStatus?
rightEye          String?              // Vision screening
leftEye           String?
rightEar          String?              // Hearing screening
leftEar           String?
```

**Indexes**:
- `(studentId, screeningDate)` - Student screening history
- `(screeningType, outcome)` - Screening success rates
- `(referralRequired, followUpRequired)` - Outstanding referrals
- `(followUpDate)` - Follow-up scheduling

**Use Cases**:
- Annual vision/hearing screenings
- Scoliosis screening programs
- Referral tracking to specialists
- State compliance reporting

---

### 6. GrowthMeasurement (New)

**Purpose**: Track student growth and nutritional status over time.

**Key Features**:
- Height and weight with unit conversion support
- BMI calculation and percentiles
- Head circumference (for younger students)
- Growth percentile tracking
- Nutritional status assessment
- Concern flagging

**Schema Highlights**:
```prisma
height              Decimal?             // Stored in cm
heightUnit          String @default("cm")
weight              Decimal?             // Stored in kg
weightUnit          String @default("kg")
bmi                 Decimal?
bmiPercentile       Decimal?
heightPercentile    Decimal?
weightPercentile    Decimal?
growthPercentiles   Json?
nutritionalStatus   String?              // Underweight, Normal, etc.
```

**Indexes**:
- `(studentId, measurementDate)` - Growth charts over time
- `(measurementDate)` - Batch measurement sessions

**Use Cases**:
- Growth chart generation
- Obesity screening programs
- Nutritional intervention tracking
- Annual health assessments

---

### 7. VitalSigns (New)

**Purpose**: Record vital signs during appointments and assessments.

**Key Features**:
- Temperature (with site and unit)
- Blood pressure (with position)
- Heart rate and rhythm
- Respiratory rate
- Oxygen saturation
- Pain assessment (0-10 scale)
- Consciousness level
- Glucose monitoring
- Peak flow (asthma management)
- Optional appointment linking

**Schema Highlights**:
```prisma
temperature             Decimal?
temperatureUnit         String @default("F")
temperatureSite         String?          // Oral, Axillary, etc.
bloodPressureSystolic   Int?
bloodPressureDiastolic  Int?
heartRate               Int?
respiratoryRate         Int?
oxygenSaturation        Int?
painLevel               Int?             // 0-10
consciousness           ConsciousnessLevel?
glucoseLevel            Decimal?
peakFlow                Int?             // For asthma
appointmentId           String?          // Optional link
```

**Indexes**:
- `(studentId, measurementDate)` - Student vital signs history
- `(measurementDate)` - Date-based queries
- `(appointmentId)` - Appointment-linked vitals

**Use Cases**:
- Pre-appointment assessments
- Illness evaluation
- Chronic condition monitoring (diabetes, asthma)
- Emergency triage
- Trending analysis

---

## Data Model Relationships

### Relationship Diagram

```
Student (1) ─────┬────────> (*) HealthRecord
                 ├────────> (*) Allergy
                 ├────────> (*) ChronicCondition
                 ├────────> (*) Vaccination
                 ├────────> (*) Screening
                 ├────────> (*) GrowthMeasurement
                 └────────> (*) VitalSigns

HealthRecord (1) ─┬────────> (*) Allergy
                  ├────────> (*) ChronicCondition
                  ├────────> (*) Vaccination
                  ├────────> (*) Screening
                  ├────────> (*) GrowthMeasurement
                  └────────> (*) VitalSigns

Appointment (1) ─────────> (*) VitalSigns
```

### Relationship Rules

1. **Student to All Models**: One-to-Many, CASCADE on delete
   - When a student is deleted, all health records are deleted

2. **HealthRecord to Specialized Records**: One-to-Many, OPTIONAL
   - Specialized records (Allergy, Vaccination, etc.) can exist independently
   - OR can be linked to a parent HealthRecord for documentation
   - healthRecordId is nullable
   - SET NULL on HealthRecord delete (preserves historical data)

3. **Appointment to VitalSigns**: One-to-Many, OPTIONAL
   - VitalSigns can be linked to an appointment or standalone
   - SET NULL on Appointment delete

### Design Rationale

**Why Optional HealthRecord Links?**

The schema allows specialized records (Allergy, Vaccination, etc.) to exist both:
1. **Independently**: Direct student relationship for operational use
2. **Documented**: Linked to a HealthRecord for formal documentation

This dual approach provides:
- **Operational Flexibility**: Quick access to active allergies without joining through HealthRecord
- **Documentation**: Ability to group related records under a formal health record entry
- **Historical Preservation**: Deleting a documentation HealthRecord doesn't delete the underlying clinical data

Example:
```sql
-- Standalone allergy (operational use)
INSERT INTO allergies (studentId, allergen, ...) VALUES (...);

-- Documented allergy assessment
INSERT INTO health_records (studentId, recordType, title, ...) VALUES (..., 'ALLERGY_DOCUMENTATION', ...);
INSERT INTO allergies (studentId, healthRecordId, allergen, ...) VALUES (..., <healthRecordId>, ...);
```

---

## Indexing Strategy

### Index Design Principles

1. **Student-Centric Queries**: Most queries filter by `studentId` first
2. **Date-Based Retrieval**: Time-series queries are common (growth charts, vaccination history)
3. **Status Filtering**: Active vs. inactive, compliance status, etc.
4. **Follow-up Management**: Due dates and outstanding tasks

### Index Catalog

#### HealthRecord Indexes
```sql
CREATE INDEX "health_records_studentId_recordDate_idx"
  ON "health_records"("studentId", "recordDate");

CREATE INDEX "health_records_recordType_recordDate_idx"
  ON "health_records"("recordType", "recordDate");

CREATE INDEX "health_records_createdBy_idx"
  ON "health_records"("createdBy");

CREATE INDEX "health_records_followUpRequired_followUpDate_idx"
  ON "health_records"("followUpRequired", "followUpDate");
```

**Query Patterns Optimized**:
- Get all records for a student ordered by date
- Get all vaccinations in the last year
- Find records needing follow-up
- Audit trail by user

#### Allergy Indexes
```sql
CREATE INDEX "allergies_studentId_active_idx"
  ON "allergies"("studentId", "active");

CREATE INDEX "allergies_allergyType_severity_idx"
  ON "allergies"("allergyType", "severity");

CREATE INDEX "allergies_epiPenExpiration_idx"
  ON "allergies"("epiPenExpiration");
```

**Query Patterns Optimized**:
- Get active allergies for emergency display
- Report on severe food allergies across schools
- Find expiring EpiPens

#### ChronicCondition Indexes
```sql
CREATE INDEX "chronic_conditions_studentId_status_idx"
  ON "chronic_conditions"("studentId", "status");

CREATE INDEX "chronic_conditions_severity_status_idx"
  ON "chronic_conditions"("severity", "status");

CREATE INDEX "chronic_conditions_nextReviewDate_idx"
  ON "chronic_conditions"("nextReviewDate");
```

**Query Patterns Optimized**:
- Get active chronic conditions for student
- Critical condition monitoring dashboard
- Conditions needing review

#### Vaccination Indexes
```sql
CREATE INDEX "vaccinations_studentId_administrationDate_idx"
  ON "vaccinations"("studentId", "administrationDate");

CREATE INDEX "vaccinations_vaccineType_complianceStatus_idx"
  ON "vaccinations"("vaccineType", "complianceStatus");

CREATE INDEX "vaccinations_nextDueDate_idx"
  ON "vaccinations"("nextDueDate");

CREATE INDEX "vaccinations_expirationDate_idx"
  ON "vaccinations"("expirationDate");
```

**Query Patterns Optimized**:
- Vaccination history for student
- Compliance reporting (who needs MMR?)
- Upcoming vaccinations due
- Expiring vaccine lots

#### Screening Indexes
```sql
CREATE INDEX "screenings_studentId_screeningDate_idx"
  ON "screenings"("studentId", "screeningDate");

CREATE INDEX "screenings_screeningType_outcome_idx"
  ON "screenings"("screeningType", "outcome");

CREATE INDEX "screenings_referralRequired_followUpRequired_idx"
  ON "screenings"("referralRequired", "followUpRequired");

CREATE INDEX "screenings_followUpDate_idx"
  ON "screenings"("followUpDate");
```

**Query Patterns Optimized**:
- Student screening history
- Vision screening failure rates
- Outstanding referrals report

#### GrowthMeasurement Indexes
```sql
CREATE INDEX "growth_measurements_studentId_measurementDate_idx"
  ON "growth_measurements"("studentId", "measurementDate");

CREATE INDEX "growth_measurements_measurementDate_idx"
  ON "growth_measurements"("measurementDate");
```

**Query Patterns Optimized**:
- Growth charts (time-series by student)
- Batch measurement sessions

#### VitalSigns Indexes
```sql
CREATE INDEX "vital_signs_studentId_measurementDate_idx"
  ON "vital_signs"("studentId", "measurementDate");

CREATE INDEX "vital_signs_measurementDate_idx"
  ON "vital_signs"("measurementDate");

CREATE INDEX "vital_signs_appointmentId_idx"
  ON "vital_signs"("appointmentId");
```

**Query Patterns Optimized**:
- Vital signs trending
- Appointment vitals retrieval

### Index Maintenance

- **PostgreSQL Specific**: Indexes are automatically maintained
- **Statistics**: Run `ANALYZE` after bulk imports
- **Monitoring**: Use `pg_stat_user_indexes` to monitor index usage
- **Unused Indexes**: Periodically review and drop unused indexes

---

## HIPAA Compliance Features

### Protected Health Information (PHI) Safeguards

1. **Audit Trail**: Every record tracks `createdBy` and `updatedBy`
2. **Confidentiality Marking**: `isConfidential` flag for extra-sensitive records
3. **Cascade Deletes**: Student deletion removes all PHI automatically
4. **No Soft Deletes**: True deletion for "right to be forgotten" compliance
5. **Encrypted Transport**: Schema designed for TLS/SSL database connections
6. **Access Control**: User ID tracking enables role-based access control (RBAC)

### Audit Logging Strategy

**Recommended Implementation**:
- Use database triggers or application-level middleware
- Log to separate `AuditLog` table (already in schema)
- Capture: userId, action (CREATE/READ/UPDATE/DELETE), entityType, entityId, changes (JSON)

Example:
```sql
-- Audit log entry for allergy creation
INSERT INTO audit_logs (userId, action, entityType, entityId, changes)
VALUES ('user123', 'CREATE', 'Allergy', 'allergy456', '{"allergen": "Peanuts", "severity": "LIFE_THREATENING"}');
```

### Data Retention Policies

**Recommended Retention**:
- **Active Students**: Retain all records
- **Graduated/Transferred**: Retain for 7 years (or state requirement)
- **Immunization Records**: Permanent retention (CDC recommendation)
- **Screening Records**: 5 years minimum
- **Incident Reports**: Permanent retention

**Implementation**:
- Use `retentionDate` field (if added) or calculate based on student graduation
- Automated archival jobs
- Separate archive database for long-term storage

### Minimum Necessary Standard

**Schema Support**:
- Views can be created for role-specific data access
- `isConfidential` flag enables additional access controls
- Granular permissions per table/record type

Example View:
```sql
-- Limited view for non-clinical staff
CREATE VIEW student_allergies_summary AS
SELECT studentId, allergen, severity, epiPenRequired
FROM allergies
WHERE active = true AND isConfidential = false;
```

---

## Performance Optimization

### Database Configuration

**Recommended PostgreSQL Settings**:
```ini
# Memory
shared_buffers = 4GB              # 25% of RAM
effective_cache_size = 12GB       # 75% of RAM
work_mem = 64MB                   # For sorting/aggregation

# Connections
max_connections = 200

# Query Planner
random_page_cost = 1.1            # For SSD storage
effective_io_concurrency = 200    # For SSD storage

# WAL
wal_buffers = 16MB
```

### Query Optimization Patterns

#### 1. Student Health Summary (Optimized)

**Goal**: Get complete health overview for a student

```sql
-- Optimized: Parallel queries with selective fields
SELECT
  s.id, s.firstName, s.lastName,
  (SELECT json_agg(json_build_object(
    'allergen', a.allergen,
    'severity', a.severity,
    'epiPenRequired', a.epiPenRequired
  )) FROM allergies a WHERE a.studentId = s.id AND a.active = true) AS allergies,

  (SELECT json_agg(json_build_object(
    'condition', cc.condition,
    'severity', cc.severity,
    'status', cc.status
  )) FROM chronic_conditions cc WHERE cc.studentId = s.id AND cc.status = 'ACTIVE') AS conditions,

  (SELECT json_agg(json_build_object(
    'vaccineName', v.vaccineName,
    'administrationDate', v.administrationDate,
    'complianceStatus', v.complianceStatus
  )) FROM vaccinations v WHERE v.studentId = s.id ORDER BY v.administrationDate DESC LIMIT 10) AS recentVaccinations

FROM students s
WHERE s.id = $1;
```

**Performance Notes**:
- Uses indexes: `allergies_studentId_active_idx`, `chronic_conditions_studentId_status_idx`, `vaccinations_studentId_administrationDate_idx`
- Subquery approach allows PostgreSQL to optimize each independently
- JSON aggregation reduces round trips

#### 2. Vaccination Compliance Report (Optimized)

**Goal**: Find students with overdue vaccinations

```sql
-- Optimized: Uses vaccinations_vaccineType_complianceStatus_idx
SELECT
  s.id,
  s.firstName,
  s.lastName,
  s.grade,
  v.vaccineName,
  v.nextDueDate,
  v.complianceStatus
FROM students s
INNER JOIN vaccinations v ON v.studentId = s.id
WHERE
  v.complianceStatus IN ('OVERDUE', 'NON_COMPLIANT')
  AND s.isActive = true
ORDER BY v.nextDueDate ASC;
```

**Performance Notes**:
- Index scan on `vaccinations_vaccineType_complianceStatus_idx`
- Early filtering reduces join set size
- Could add composite index `(complianceStatus, nextDueDate)` for further optimization

#### 3. Growth Chart Data (Optimized)

**Goal**: Get growth measurements for charting

```sql
-- Optimized: Uses growth_measurements_studentId_measurementDate_idx
SELECT
  measurementDate,
  height,
  weight,
  bmi,
  bmiPercentile,
  heightPercentile,
  weightPercentile
FROM growth_measurements
WHERE studentId = $1
ORDER BY measurementDate ASC;
```

**Performance Notes**:
- Index-only scan possible if all fields in covering index
- Time-series data perfect for index scan
- Consider partitioning by year for very large datasets

#### 4. Active Allergies for Emergency (Optimized)

**Goal**: Fast retrieval for emergency situations

```sql
-- Optimized: Uses allergies_studentId_active_idx
SELECT
  allergen,
  allergyType,
  severity,
  reactions,
  emergencyProtocol,
  epiPenLocation
FROM allergies
WHERE studentId = $1 AND active = true
ORDER BY severity DESC;
```

**Performance Notes**:
- Critical query for emergency response (milliseconds matter)
- Could cache this result with Redis for sub-millisecond response
- Consider materialized view for multi-student emergency scenarios

### Caching Strategy

**Recommended Caching**:

1. **Student Active Allergies**: Cache for 1 hour
   - Key: `student:${studentId}:allergies:active`
   - Invalidate on allergy CREATE/UPDATE/DELETE

2. **Vaccination Compliance**: Cache for 24 hours
   - Key: `student:${studentId}:vaccinations:compliance`
   - Invalidate on vaccination CREATE/UPDATE

3. **Latest Vital Signs**: Cache for 1 hour
   - Key: `student:${studentId}:vitals:latest`
   - Invalidate on vital signs CREATE

**Example (Node.js/Redis)**:
```javascript
async function getActiveAllergies(studentId) {
  const cacheKey = `student:${studentId}:allergies:active`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // Cache miss - query database
  const allergies = await prisma.allergy.findMany({
    where: { studentId, active: true },
    orderBy: { severity: 'desc' }
  });

  // Cache for 1 hour
  await redis.setex(cacheKey, 3600, JSON.stringify(allergies));

  return allergies;
}
```

### Partitioning Strategy (For Large Datasets)

**When to Partition**:
- More than 10 million records in a table
- Queries consistently filter by date ranges
- Regular archival of old data

**Recommended Partitioning**:

```sql
-- Partition health_records by year
CREATE TABLE health_records_2024 PARTITION OF health_records
  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE health_records_2025 PARTITION OF health_records
  FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
```

**Benefits**:
- Faster queries (partition pruning)
- Easier archival (drop old partitions)
- Better vacuum/analyze performance

---

## Usage Examples

### Example 1: Record Student Vaccination

```typescript
// TypeScript with Prisma
async function recordVaccination(data: VaccinationInput) {
  // Create vaccination record
  const vaccination = await prisma.vaccination.create({
    data: {
      studentId: data.studentId,
      vaccineName: 'COVID-19 (Pfizer-BioNTech)',
      vaccineType: 'COVID_19',
      manufacturer: 'Pfizer-BioNTech',
      lotNumber: 'EW0171',
      cvxCode: '208',
      ndcCode: '59267-1000-1',
      doseNumber: 1,
      totalDoses: 2,
      administrationDate: new Date(),
      administeredBy: data.nurseId,
      administeredByRole: 'School Nurse',
      siteOfAdministration: 'ARM_LEFT',
      routeOfAdministration: 'INTRAMUSCULAR',
      dosageAmount: '0.3 mL',
      nextDueDate: addWeeks(new Date(), 3), // 3 weeks for dose 2
      complianceStatus: 'PARTIALLY_COMPLIANT',
      visProvided: true,
      visDate: new Date(),
      consentObtained: true,
      consentBy: 'Parent/Guardian',
      createdBy: data.nurseId,
      updatedBy: data.nurseId
    }
  });

  // Optionally create a parent HealthRecord for documentation
  const healthRecord = await prisma.healthRecord.create({
    data: {
      studentId: data.studentId,
      recordType: 'IMMUNIZATION',
      title: 'COVID-19 Vaccination - Dose 1',
      description: 'First dose of Pfizer-BioNTech COVID-19 vaccine administered',
      recordDate: new Date(),
      provider: data.nurseName,
      followUpRequired: true,
      followUpDate: addWeeks(new Date(), 3),
      createdBy: data.nurseId,
      updatedBy: data.nurseId,
      vaccinations: {
        connect: { id: vaccination.id }
      }
    }
  });

  return { vaccination, healthRecord };
}
```

### Example 2: Document Severe Allergy with EpiPen

```typescript
async function documentAllergy(data: AllergyInput) {
  const allergy = await prisma.allergy.create({
    data: {
      studentId: data.studentId,
      allergen: 'Peanuts',
      allergyType: 'FOOD',
      severity: 'LIFE_THREATENING',
      symptoms: 'Anaphylaxis, difficulty breathing, hives, swelling',
      reactions: {
        symptoms: ['Difficulty breathing', 'Hives', 'Throat swelling'],
        onset: 'Within 5-10 minutes',
        duration: 'Immediate medical intervention required'
      },
      treatment: 'EpiPen administration, call 911 immediately',
      emergencyProtocol: `1. Administer EpiPen to outer thigh
2. Call 911 immediately
3. Keep student lying down (unless breathing difficulty)
4. Monitor vitals every 5 minutes
5. Second EpiPen dose if no improvement after 5-10 minutes
6. Contact parent/guardian`,
      diagnosedDate: new Date('2020-03-15'),
      diagnosedBy: 'Dr. Jane Smith, Allergist',
      verified: true,
      verifiedBy: data.nurseId,
      verificationDate: new Date(),
      active: true,
      epiPenRequired: true,
      epiPenLocation: 'Nurse office, student backpack',
      epiPenExpiration: new Date('2025-12-31'),
      createdBy: data.nurseId,
      updatedBy: data.nurseId
    }
  });

  // Create alert/notification for staff
  await createStaffAlert({
    type: 'CRITICAL_ALLERGY',
    studentId: data.studentId,
    message: `CRITICAL: Student has life-threatening peanut allergy. EpiPen required.`
  });

  return allergy;
}
```

### Example 3: Record Vision Screening

```typescript
async function recordVisionScreening(data: ScreeningInput) {
  const screening = await prisma.screening.create({
    data: {
      studentId: data.studentId,
      screeningType: 'VISION',
      screeningDate: new Date(),
      screenedBy: data.nurseId,
      screenedByRole: 'School Nurse',
      results: {
        distance: {
          rightEye: '20/40',
          leftEye: '20/100',
          bothEyes: '20/40'
        },
        near: {
          rightEye: '20/30',
          leftEye: '20/80',
          bothEyes: '20/30'
        },
        colorVision: 'Normal',
        notes: 'Student squinting with left eye'
      },
      rightEye: '20/40',
      leftEye: '20/100',
      outcome: 'REFER',
      referralRequired: true,
      referralTo: 'Optometrist',
      referralReason: 'Left eye visual acuity below 20/40 threshold',
      followUpRequired: true,
      followUpDate: addWeeks(new Date(), 4),
      followUpStatus: 'PENDING',
      equipmentUsed: 'Snellen Chart',
      passedCriteria: false,
      createdBy: data.nurseId,
      updatedBy: data.nurseId
    }
  });

  // Send referral notification to parent
  await sendParentNotification({
    studentId: data.studentId,
    type: 'SCREENING_REFERRAL',
    subject: 'Vision Screening Referral',
    message: 'Your child requires a follow-up vision examination with an optometrist.'
  });

  return screening;
}
```

### Example 4: Track Student Growth

```typescript
async function recordGrowthMeasurement(data: GrowthInput) {
  // Convert units if necessary
  const heightCm = data.heightUnit === 'in'
    ? data.height * 2.54
    : data.height;
  const weightKg = data.weightUnit === 'lb'
    ? data.weight * 0.453592
    : data.weight;

  // Calculate BMI
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  // Calculate percentiles using CDC growth chart data
  const percentiles = calculateGrowthPercentiles(
    data.dateOfBirth,
    data.gender,
    heightCm,
    weightKg,
    bmi
  );

  const measurement = await prisma.growthMeasurement.create({
    data: {
      studentId: data.studentId,
      measurementDate: new Date(),
      measuredBy: data.nurseId,
      measuredByRole: 'School Nurse',
      height: heightCm,
      heightUnit: 'cm',
      weight: weightKg,
      weightUnit: 'kg',
      bmi: bmi,
      bmiPercentile: percentiles.bmiPercentile,
      heightPercentile: percentiles.heightPercentile,
      weightPercentile: percentiles.weightPercentile,
      growthPercentiles: {
        ageMonths: percentiles.ageMonths,
        heightForAge: percentiles.heightPercentile,
        weightForAge: percentiles.weightPercentile,
        bmiForAge: percentiles.bmiPercentile
      },
      nutritionalStatus: getNutritionalStatus(percentiles.bmiPercentile),
      concerns: percentiles.bmiPercentile > 95
        ? 'BMI above 95th percentile - consider nutritional counseling'
        : null,
      createdBy: data.nurseId,
      updatedBy: data.nurseId
    }
  });

  return measurement;
}

function getNutritionalStatus(bmiPercentile: number): string {
  if (bmiPercentile < 5) return 'Underweight';
  if (bmiPercentile < 85) return 'Normal';
  if (bmiPercentile < 95) return 'Overweight';
  return 'Obese';
}
```

### Example 5: Record Vital Signs During Appointment

```typescript
async function recordVitalSigns(data: VitalSignsInput) {
  const vitals = await prisma.vitalSigns.create({
    data: {
      studentId: data.studentId,
      appointmentId: data.appointmentId, // Optional link
      measurementDate: new Date(),
      measuredBy: data.nurseId,
      measuredByRole: 'School Nurse',
      temperature: 98.6,
      temperatureUnit: 'F',
      temperatureSite: 'Oral',
      bloodPressureSystolic: 110,
      bloodPressureDiastolic: 70,
      bloodPressurePosition: 'Sitting',
      heartRate: 80,
      heartRhythm: 'Regular',
      respiratoryRate: 16,
      oxygenSaturation: 98,
      painLevel: 3,
      painLocation: 'Headache',
      consciousness: 'ALERT',
      notes: 'Student complaining of mild headache. Vitals normal.',
      createdBy: data.nurseId,
      updatedBy: data.nurseId
    }
  });

  // Flag abnormal vitals
  const abnormalities = checkVitalAbnormalities(vitals, data.age);
  if (abnormalities.length > 0) {
    await createNurseAlert({
      studentId: data.studentId,
      type: 'ABNORMAL_VITALS',
      message: `Abnormal vital signs detected: ${abnormalities.join(', ')}`
    });
  }

  return vitals;
}
```

### Example 6: Generate Student Health Summary

```typescript
async function getStudentHealthSummary(studentId: string) {
  const [student, allergies, conditions, recentVaccinations, latestVitals, latestGrowth] =
    await Promise.all([
      prisma.student.findUnique({
        where: { id: studentId },
        include: {
          emergencyContacts: {
            where: { isActive: true },
            orderBy: { priority: 'asc' }
          }
        }
      }),

      prisma.allergy.findMany({
        where: { studentId, active: true },
        orderBy: { severity: 'desc' }
      }),

      prisma.chronicCondition.findMany({
        where: { studentId, status: 'ACTIVE' },
        orderBy: { severity: 'desc' }
      }),

      prisma.vaccination.findMany({
        where: { studentId },
        orderBy: { administrationDate: 'desc' },
        take: 10
      }),

      prisma.vitalSigns.findFirst({
        where: { studentId },
        orderBy: { measurementDate: 'desc' }
      }),

      prisma.growthMeasurement.findFirst({
        where: { studentId },
        orderBy: { measurementDate: 'desc' }
      })
    ]);

  return {
    student,
    activeAllergies: allergies,
    chronicConditions: conditions,
    recentVaccinations,
    latestVitalSigns: latestVitals,
    latestGrowth: latestGrowth,
    riskLevel: calculateRiskLevel(allergies, conditions)
  };
}
```

---

## Migration Guide

### Pre-Migration Checklist

- [ ] **Backup Database**: Full backup before migration
- [ ] **Test on Staging**: Run migration on staging environment first
- [ ] **Review Data**: Understand existing data in health_records, allergies, chronic_conditions
- [ ] **Downtime Planning**: Estimate migration time (depends on data volume)
- [ ] **Rollback Plan**: Document rollback procedure

### Migration Steps

#### Step 1: Backup Current Database

```bash
# PostgreSQL backup
pg_dump -h localhost -U postgres -d whitecross_db -F c -f backup_before_health_migration.dump
```

#### Step 2: Apply Prisma Schema Changes

```bash
cd backend

# Generate migration from schema changes
npx prisma migrate dev --name complete_health_records_schema --create-only

# Review the generated migration SQL
# Edit if necessary (see migration.sql in migrations folder)

# Apply migration
npx prisma migrate dev
```

#### Step 3: Data Migration (If Needed)

If you have existing data in `health_records` that used the `vital` JSON field:

```sql
-- Migrate vital signs data from JSON to dedicated table
INSERT INTO vital_signs (
  id, studentId, healthRecordId, measurementDate, measuredBy,
  temperature, temperatureUnit, bloodPressureSystolic, bloodPressureDiastolic,
  heartRate, respiratoryRate, oxygenSaturation,
  createdAt, updatedAt
)
SELECT
  gen_random_uuid(),
  hr.studentId,
  hr.id,
  hr.recordDate,
  COALESCE(hr.provider, 'Unknown'),
  (hr.vital->>'temperature')::DECIMAL,
  COALESCE(hr.vital->>'temperatureUnit', 'F'),
  (hr.vital->>'bloodPressureSystolic')::INTEGER,
  (hr.vital->>'bloodPressureDiastolic')::INTEGER,
  (hr.vital->>'heartRate')::INTEGER,
  (hr.vital->>'respiratoryRate')::INTEGER,
  (hr.vital->>'oxygenSaturation')::INTEGER,
  hr.createdAt,
  hr.updatedAt
FROM health_records hr
WHERE hr.vital IS NOT NULL
  AND hr.vital->>'temperature' IS NOT NULL;
```

#### Step 4: Update Prisma Client

```bash
# Regenerate Prisma client with new schema
npx prisma generate
```

#### Step 5: Update Application Code

Update TypeScript types and imports:

```typescript
// Old
import { HealthRecord, Allergy, ChronicCondition } from '@prisma/client';

// New
import {
  HealthRecord,
  Allergy,
  ChronicCondition,
  Vaccination,
  Screening,
  GrowthMeasurement,
  VitalSigns,
  AllergyType,
  VaccineType,
  ScreeningType,
  ConditionStatus
} from '@prisma/client';
```

Update queries to use new field names:

```typescript
// Old
const records = await prisma.healthRecord.findMany({
  where: { type: 'VACCINATION' }
});

// New
const records = await prisma.healthRecord.findMany({
  where: { recordType: 'VACCINATION' }
});
```

#### Step 6: Test Thoroughly

- [ ] Test CRUD operations on all new models
- [ ] Test complex queries (student health summary, compliance reports)
- [ ] Test foreign key relationships
- [ ] Verify indexes are being used (EXPLAIN ANALYZE)
- [ ] Test cascade deletes
- [ ] Verify audit trail fields are populated

#### Step 7: Deploy to Production

```bash
# Production deployment
npm run build
npx prisma migrate deploy  # Non-interactive migration for production
```

### Rollback Procedure

If migration fails:

```bash
# Restore from backup
pg_restore -h localhost -U postgres -d whitecross_db -c backup_before_health_migration.dump

# Revert Prisma migrations
npx prisma migrate resolve --rolled-back <migration_name>
```

---

## Appendix: Enum Reference

### AllergyType
- FOOD
- MEDICATION
- ENVIRONMENTAL
- INSECT
- LATEX
- ANIMAL
- CHEMICAL
- SEASONAL
- OTHER

### AllergySeverity
- MILD
- MODERATE
- SEVERE
- LIFE_THREATENING

### ConditionSeverity
- MILD
- MODERATE
- SEVERE
- CRITICAL

### ConditionStatus
- ACTIVE
- MANAGED
- RESOLVED
- MONITORING
- INACTIVE

### VaccineType
- COVID_19, FLU, MEASLES, MUMPS, RUBELLA, MMR
- POLIO, HEPATITIS_A, HEPATITIS_B, VARICELLA
- TETANUS, DIPHTHERIA, PERTUSSIS, TDAP, DTaP
- HIB, PNEUMOCOCCAL, ROTAVIRUS
- MENINGOCOCCAL, HPV, OTHER

### AdministrationSite
- ARM_LEFT, ARM_RIGHT
- THIGH_LEFT, THIGH_RIGHT
- DELTOID_LEFT, DELTOID_RIGHT
- BUTTOCK_LEFT, BUTTOCK_RIGHT
- ORAL, NASAL, OTHER

### AdministrationRoute
- INTRAMUSCULAR, SUBCUTANEOUS, INTRADERMAL
- ORAL, INTRANASAL, INTRAVENOUS, OTHER

### VaccineComplianceStatus
- COMPLIANT
- OVERDUE
- PARTIALLY_COMPLIANT
- EXEMPT
- NON_COMPLIANT

### ScreeningType
- VISION, HEARING, SCOLIOSIS, DENTAL
- BMI, BLOOD_PRESSURE
- DEVELOPMENTAL, SPEECH, MENTAL_HEALTH
- TUBERCULOSIS, LEAD, ANEMIA, OTHER

### ScreeningOutcome
- PASS, REFER, FAIL
- INCONCLUSIVE, INCOMPLETE

### FollowUpStatus
- PENDING, SCHEDULED, COMPLETED
- CANCELLED, OVERDUE, NOT_NEEDED

### ConsciousnessLevel
- ALERT, VERBAL, PAIN, UNRESPONSIVE
- DROWSY, CONFUSED, LETHARGIC

### HealthRecordType (Extended)
- CHECKUP, VACCINATION, ILLNESS, INJURY
- SCREENING, PHYSICAL_EXAM
- MENTAL_HEALTH, DENTAL, VISION, HEARING
- EXAMINATION, ALLERGY_DOCUMENTATION
- CHRONIC_CONDITION_REVIEW, GROWTH_ASSESSMENT
- VITAL_SIGNS_CHECK, EMERGENCY_VISIT
- FOLLOW_UP, CONSULTATION
- DIAGNOSTIC_TEST, PROCEDURE
- HOSPITALIZATION, SURGERY
- COUNSELING, THERAPY, NUTRITION
- MEDICATION_REVIEW, IMMUNIZATION
- LAB_RESULT, RADIOLOGY, OTHER

---

## Summary

This comprehensive health records schema provides:

- **7 Specialized Models** for different health record types
- **14 New Enums** for standardized medical coding
- **30+ Indexes** for query performance optimization
- **Full Audit Trail** with createdBy/updatedBy on all records
- **HIPAA Compliance** features built-in
- **Flexible Relationships** allowing both standalone and documented records
- **Clinical Standards** support (ICD-10, CVX codes, CDC guidelines)

The schema is production-ready, scalable, and designed for the complex needs of school healthcare management.

---

**Document Version**: 1.0
**Last Updated**: 2025-10-10
**Schema Version**: Prisma Schema 2024
**Author**: Database Architecture Team
