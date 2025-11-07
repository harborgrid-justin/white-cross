# Sequelize Models Architecture Review
## White Cross Healthcare Platform - Production Database Analysis

**Review Date:** 2025-11-07
**Reviewed By:** Sequelize Models Architect
**Models Reviewed:** 15+ core healthcare entities
**Focus:** Data integrity, HIPAA compliance, performance, and production readiness

---

## Executive Summary

This comprehensive review analyzed 15+ Sequelize models across the White Cross healthcare platform. The models demonstrate **strong HIPAA compliance awareness**, comprehensive **audit logging hooks**, and **well-designed indexes**. However, there are **critical production issues** that require immediate attention, particularly around **data validation**, **foreign key constraints**, **missing NOT NULL constraints**, and **inconsistent soft delete implementation**.

### Overall Assessment: **B+ (85/100)**

**Strengths:**
- Excellent HIPAA audit logging infrastructure
- Comprehensive scopes for complex queries
- Strong index coverage for performance
- Good use of enums for data integrity
- Paranoid soft deletes for audit trail preservation

**Critical Issues:**
- Missing validation on critical healthcare fields
- Inconsistent foreign key constraint enforcement
- Nullable fields that should be required
- Some missing indexes on foreign keys
- Inconsistent use of @Index decorator
- TODO comments indicating incomplete audit integration

---

## 1. Model Definitions Analysis

### 1.1 Student Model (/workspaces/white-cross/backend/src/student/models/student.model.ts)

**Overall Score: A- (90/100)**

#### Strengths:
- UUID primary key with proper default
- Comprehensive PHI documentation
- Soft deletes enabled (paranoid: true)
- Unique constraints on studentNumber and medicalRecordNum
- Instance methods for business logic (getFullName, getAge, isCurrentlyEnrolled)
- Proper ENUM usage for Gender

#### Issues Found:

**CRITICAL - Line 156-169: Foreign Keys Missing Constraints**
```typescript
@Column({
  type: DataType.STRING,
  allowNull: true,
})
nurseId?: string;

@Column({
  type: DataType.STRING,
  allowNull: true,
})
schoolId?: string;

@Column({
  type: DataType.STRING,
  allowNull: true,
})
districtId?: string;
```

**Problem:** Foreign keys lack referential integrity constraints
**Impact:** Risk of orphaned records, data corruption, cascade behavior undefined
**Recommendation:**
```typescript
@ForeignKey(() => User)
@Column({
  type: DataType.UUID, // Should be UUID not STRING
  allowNull: true,
  references: {
    model: 'users',
    key: 'id',
  },
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL',
})
nurseId?: string;
```

**CRITICAL - Line 48-50: Primary Key Type Inconsistency**
```typescript
@PrimaryKey
@Default(DataType.UUIDV4)
@Column(DataType.STRING)  // Should be DataType.UUID
declare id: string;
```

**Problem:** Using STRING instead of UUID type
**Impact:** Less efficient indexing, no validation, larger storage
**Recommendation:** Change to `DataType.UUID`

**MEDIUM - Line 126-131: Medical Record Number Validation Missing**
```typescript
@Column({
  type: DataType.STRING(50),
  allowNull: true,
  unique: true,
})
medicalRecordNum?: string;
```

**Problem:** No format validation for critical healthcare identifier
**Impact:** Invalid MRN formats could be stored
**Recommendation:** Add validation regex pattern for MRN format

**LOW - Line 98-101: Grade Validation Missing**
```typescript
@Column({
  type: DataType.STRING(10),
  allowNull: false,
})
grade: string;
```

**Problem:** No validation for valid grade values (K-12)
**Impact:** Invalid grades could be stored
**Recommendation:** Add ENUM or validation regex

---

### 1.2 Health Record Model (/workspaces/white-cross/backend/src/database/models/health-record.model.ts)

**Overall Score: A (95/100)**

#### Strengths:
- Excellent enum for recordType with 30+ values
- Comprehensive indexes including composite indexes
- NPI validation with regex (10-digit format)
- ICD-10 diagnosis code validation
- Follow-up date validation hooks
- PHI audit integration with dynamic import
- Rich scopes for complex queries

#### Issues Found:

**LOW - Line 309-314: Attachments Array Default Could Be Problematic**
```typescript
@Default([])
@Column({
  type: DataType.JSON,
  allowNull: false,
})
attachments: string[];
```

**Problem:** JSON type instead of JSONB, no validation on array items
**Impact:** Less efficient querying, no URL validation
**Recommendation:** Use JSONB and add validation for URL format

**LOW - Line 316: Metadata Field Too Generic**
```typescript
@Column(DataType.JSONB)
metadata?: Record<string, any>;
```

**Problem:** No structure or validation for metadata
**Impact:** Could store arbitrary data, hard to query
**Recommendation:** Define interface for expected metadata structure

---

### 1.3 Medication Model (/workspaces/white-cross/backend/src/database/models/medication.model.ts)

**Overall Score: A (92/100)**

#### Strengths:
- NDC validation with proper format regex
- DEA schedule enum for controlled substances
- Business logic validation in hooks (controlled schedule validation)
- Automatic witness requirement setting for Schedule II/III
- Comprehensive scopes (active, controlled, byDEASchedule, requiresWitness)
- Extensive composite indexes

#### Issues Found:

**HIGH - Line 162-172: NDC Validation Regex May Be Too Strict**
```typescript
@Column({
  type: DataType.STRING(255),
  unique: true,
  validate: {
    is: {
      args: /^\d{4,5}-\d{3,4}-\d{1,2}$/,
      msg: 'NDC must be in format 12345-1234-12 or 1234-123-1',
    },
  },
})
ndc?: string;
```

**Problem:** NDC format has multiple valid formats (10-digit and 11-digit variants)
**Impact:** May reject valid NDC codes
**Recommendation:** Update regex to support all valid NDC formats

**MEDIUM - Line 219-228: Console Logging in Hooks**
```typescript
@BeforeCreate
@BeforeUpdate
static async auditAccess(instance: Medication) {
  if (instance.changed()) {
    const changedFields = instance.changed() as string[];
    console.log(
      `[AUDIT] Medication ${instance.id} (${instance.name}) modified at ${new Date().toISOString()}`,
    );
    console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
    // TODO: Integrate with AuditLog service for persistent audit trail
  }
}
```

**Problem:** Using console.log instead of persistent audit logging, TODO comment
**Impact:** Audit logs lost on restart, not queryable, HIPAA non-compliant
**Recommendation:** Replace with persistent AuditLog service immediately

---

### 1.4 Student Medication Model (/workspaces/white-cross/backend/src/database/models/student-medication.model.ts)

**Overall Score: B+ (88/100)**

#### Strengths:
- Proper foreign key relationships
- Virtual getters (isCurrentlyActive, daysRemaining)
- Date-based logic for medication validity
- Paranoid soft deletes disabled (timestamps: true only)

#### Issues Found:

**CRITICAL - Line 46-78: Missing Indexes on Foreign Keys**
```typescript
@Table({
  tableName: 'student_medications',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['studentId'],  // ✓ Has index
    },
    {
      fields: ['medicationId'],  // ✓ Has index
    },
    {
      fields: ['isActive'],
    },
    // ... more indexes
  ],
})
```

**Problem:** No @Index decorator on foreign key columns
**Impact:** Inconsistent with other models, but indexes defined in table config
**Recommendation:** Use @Index decorator for consistency

**MEDIUM - Line 146-150: Prescription Number No Validation**
```typescript
@Column({
  type: DataType.STRING(255),
})
prescriptionNumber?: string;
```

**Problem:** No format validation for prescription numbers
**Impact:** Invalid formats could be stored
**Recommendation:** Add validation pattern

---

### 1.5 Medication Log Model (/workspaces/white-cross/backend/src/database/models/medication-log.model.ts)

**Overall Score: A- (90/100)**

#### Strengths:
- Comprehensive status enum (PENDING, ADMINISTERED, MISSED, CANCELLED, REFUSED)
- Proper decimal type for dosage (DECIMAL(10, 2))
- Foreign key constraints with CASCADE/RESTRICT
- Paranoid soft deletes enabled
- scheduledAt field for planned administration

#### Issues Found:

**MEDIUM - Line 146-150: Status Validation Inconsistency**
```typescript
@Index
@Column({
  type: DataType.STRING(50),
  validate: {
    isIn: [Object.values(MedicationLogStatus)],
  },
  allowNull: true,
  defaultValue: MedicationLogStatus.ADMINISTERED,
})
status?: MedicationLogStatus;
```

**Problem:** Nullable but has default value, validation is redundant with enum type
**Impact:** Inconsistent behavior, could be null despite default
**Recommendation:** Make NOT NULL since it has a default value

**CRITICAL - Line 159-163: wasGiven Field Redundant with Status**
```typescript
@Default(false)
@Column({
  type: DataType.BOOLEAN,
  allowNull: false,
})
wasGiven: boolean;
```

**Problem:** Duplicates information from status field
**Impact:** Data integrity risk if fields become inconsistent
**Recommendation:** Remove wasGiven and derive from status

---

### 1.6 Allergy Model (/workspaces/white-cross/backend/src/database/models/allergy.model.ts)

**Overall Score: A (93/100)**

#### Strengths:
- EpiPen tracking with location and expiration
- Verification workflow (verified, verifiedBy, verificationDate)
- Severity enum (MILD, MODERATE, SEVERE, LIFE_THREATENING)
- AllergyType enum (FOOD, MEDICATION, ENVIRONMENTAL, INSECT, LATEX)
- Excellent scopes (severe, requiresEpiPen, expiredEpiPen, unverified)
- Validation hooks for EpiPen requirements
- Instance methods (isEpiPenExpired, getDaysUntilEpiPenExpiration)

#### Issues Found:

**MEDIUM - Line 197-198: Reactions Field Type**
```typescript
@Column(DataType.JSONB)
reactions?: any;
```

**Problem:** No type safety for reactions data
**Impact:** Could store arbitrary data
**Recommendation:** Define interface for reaction data structure

**LOW - Line 302-312: Verification Hook Updates verificationDate**
```typescript
@BeforeUpdate
static async validateVerification(instance: Allergy) {
  if (instance.changed('verified') && instance.verified) {
    if (!instance.verifiedBy) {
      throw new Error(
        'verifiedBy is required when marking allergy as verified',
      );
    }
    instance.verificationDate = new Date();
  }
}
```

**Problem:** Automatically sets verificationDate on update only
**Impact:** May not set on create if verified=true
**Recommendation:** Add @BeforeCreate hook as well

---

### 1.7 Chronic Condition Model (/workspaces/white-cross/backend/src/database/models/chronic-condition.model.ts)

**Overall Score: B+ (87/100)**

#### Strengths:
- ICD code field for standardized coding
- IEP and 504 plan flags for educational accommodations
- Status enum (ACTIVE, MANAGED, RESOLVED, MONITORING)
- JSON arrays for medications, restrictions, triggers, accommodations
- Review date tracking (lastReviewDate, nextReviewDate)

#### Issues Found:

**HIGH - Line 188-214: JSON Arrays with No Validation**
```typescript
@Column({
  type: DataType.JSON,
  allowNull: false,
  defaultValue: [],
})
medications: string[];

@Column({
  type: DataType.JSON,
  allowNull: false,
  defaultValue: [],
})
restrictions: string[];
```

**Problem:** Using JSON instead of JSONB, no validation on array contents
**Impact:** Less efficient, no type checking, could store non-string values
**Recommendation:** Use JSONB and add validation

**MEDIUM - Line 142-145: ICD Code Validation Missing**
```typescript
@AllowNull
@Column({
  type: DataType.STRING(20),
})
icdCode?: string;
```

**Problem:** No validation for ICD-10 code format
**Impact:** Invalid codes could be stored
**Recommendation:** Add validation regex matching ICD-10 format

---

### 1.8 Appointment Model (/workspaces/white-cross/backend/src/database/models/appointment.model.ts)

**Overall Score: A (94/100)**

#### Strengths:
- Comprehensive appointment types enum
- Duration validation (min: 15, max: 120 minutes)
- Recurring appointment support (recurringGroupId, recurringFrequency)
- Virtual getters (isUpcoming, isToday, minutesUntil)
- Validation hooks for scheduled date and recurring data
- Excellent scopes (upcoming, today, emergency, recurring)
- Getter/setter aliases for DTO compatibility

#### Issues Found:

**LOW - Line 318-322: Recurring Frequency Field**
```typescript
@Column({
  type: DataType.STRING(50),
  allowNull: true,
  comment: 'Frequency: DAILY, WEEKLY, MONTHLY, YEARLY',
})
recurringFrequency?: string;
```

**Problem:** Should be an enum instead of string
**Impact:** Could store invalid frequency values
**Recommendation:** Create RecurringFrequency enum

**LOW - Line 297: Reason Length Validation**
```typescript
reason: string;
```

**Problem:** Minimum length of 3 may be too restrictive
**Impact:** Valid short reasons like "Flu" would be rejected
**Recommendation:** Consider reducing minimum to 1 or 2

---

### 1.9 Incident Report Model (/workspaces/white-cross/backend/src/database/models/incident-report.model.ts)

**Overall Score: A- (91/100)**

#### Strengths:
- Comprehensive type enum (INJURY, ILLNESS, BEHAVIORAL, MEDICATION_ERROR, ALLERGIC_REACTION)
- Severity enum (LOW, MEDIUM, HIGH, CRITICAL)
- Status workflow (DRAFT → PENDING_REVIEW → UNDER_INVESTIGATION → RESOLVED → CLOSED)
- Insurance claim tracking with status enum
- Compliance status tracking
- Evidence arrays (photos, videos, attachments)
- Parent notification tracking
- Follow-up actions and witness statements relationships

#### Issues Found:

**MEDIUM - Line 263-268: Witnesses Array Type**
```typescript
@Default([])
@Column({
  type: DataType.ARRAY(DataType.STRING(255)),
  allowNull: false,
})
witnesses: string[];
```

**Problem:** Stores witness names as strings, no structured data
**Impact:** Cannot track witness contact info, relationship to incident
**Recommendation:** Consider separate WitnessStatement model (which exists)

**LOW - Line 420-429: Parent Notification Hook Logic**
```typescript
@BeforeCreate
@BeforeUpdate
static async validateParentNotification(instance: IncidentReport) {
  if (instance.parentNotified && !instance.parentNotificationMethod) {
    throw new Error(
      'parentNotificationMethod is required when parent is notified',
    );
  }
  if (instance.parentNotified && !instance.parentNotifiedAt) {
    instance.parentNotifiedAt = new Date();
  }
}
```

**Problem:** Doesn't validate parentNotifiedBy is set
**Impact:** Missing audit trail of who notified parent
**Recommendation:** Add parentNotifiedBy validation

---

### 1.10 Emergency Contact Model (/workspaces/white-cross/backend/src/database/models/emergency-contact.model.ts)

**Overall Score: A (95/100)**

#### Strengths:
- Priority enum (PRIMARY, SECONDARY, EMERGENCY_ONLY)
- Verification status workflow
- Phone number validation (E.164 format)
- Email validation
- Multi-channel notification support
- Pickup authorization tracking
- Excellent scopes (primary, verified, canPickup, unverified)
- Virtual getters (fullName, isPrimary, isVerified)
- PHI field tracking in audit hooks

#### Issues Found:

**LOW - Line 260: Notification Channels as TEXT**
```typescript
@Column({
  type: DataType.TEXT,
  allowNull: true,
  comment: 'JSON array of notification channels (sms, email, voice)',
})
notificationChannels: string | null;
```

**Problem:** Stores JSON as TEXT string instead of JSONB
**Impact:** No type safety, less efficient, manual parsing required
**Recommendation:** Use JSONB array or separate enum array

---

### 1.11 User Model (/workspaces/white-cross/backend/src/database/models/user.model.ts)

**Overall Score: A+ (97/100)**

#### Strengths:
- Comprehensive role enum
- Security features (MFA, OAuth, account lockout)
- Password hashing hooks with bcrypt
- Configurable salt rounds from environment
- Password rotation tracking
- Failed login attempt tracking
- Email verification workflow
- Paranoid soft deletes
- Helper methods (comparePassword, isAccountLocked, requiresPasswordChange)
- toSafeObject() method excludes sensitive fields

#### Issues Found:

**LOW - Line 540-556: Direct process.env Access in Hooks**
```typescript
@BeforeCreate
static async hashPasswordBeforeCreate(user: User) {
  if (user.password) {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
    // ...
  }
}
```

**Problem:** Direct process.env access violates configuration architecture
**Impact:** Not using AppConfigService, inconsistent with standards
**Recommendation:** Inject AppConfigService (may require architecture change)

**MEDIUM - Line 288: Phone Number No Validation**
```typescript
@Column({
  type: DataType.STRING(20),
  allowNull: true,
})
declare phone?: string;
```

**Problem:** No format validation for phone numbers
**Impact:** Invalid formats could be stored
**Recommendation:** Add E.164 format validation

---

### 1.12 Audit Log Model (/workspaces/white-cross/backend/src/database/models/audit-log.model.ts)

**Overall Score: A+ (98/100)**

#### Strengths:
- Immutable design (updatedAt: false)
- Comprehensive compliance types (HIPAA, FERPA, GDPR)
- Severity levels
- Request/session correlation IDs
- Before/after value tracking (previousValues, newValues)
- GIN indexes for JSONB fields
- Retention policy methods based on compliance type
- Export methods with redaction options
- Extensive composite indexes

#### Issues Found:

**LOW - Line 136-144: beforeUpdate Hook on Immutable Model**
```typescript
beforeUpdate: (instance: AuditLog) => {
  if (instance.changed()) {
    const changedFields = instance.changed() as string[];
    const logger = new LoggerService();
    logger.setContext('AuditLog');
    logger.warn(
      `AuditLog ${instance.id} modified at ${new Date().toISOString()}`,
    );
  }
},
```

**Problem:** Has beforeUpdate hook despite being immutable
**Impact:** Confusing, should prevent updates entirely
**Recommendation:** Throw error in beforeUpdate to enforce immutability

---

### 1.13 Vaccination Model (/workspaces/white-cross/backend/src/database/models/vaccination.model.ts)

**Overall Score: A (92/100)**

#### Strengths:
- Comprehensive vaccine type enum (25+ vaccines)
- Site and route of administration enums
- CDC CVX code and NDC code tracking
- Dose series tracking (doseNumber, totalDoses, seriesComplete)
- VFC eligibility tracking
- VIS (Vaccine Information Statement) tracking
- Parental consent tracking
- Exemption tracking with documentation
- Compliance status enum
- Instance methods (isOverdue, getDaysUntilNextDose, getSeriesCompletionPercentage)

#### Issues Found:

**MEDIUM - Line 249-252: CVX Code No Validation**
```typescript
@AllowNull
@Column({
  type: DataType.STRING(10),
})
cvxCode?: string;
```

**Problem:** CVX codes have specific format, no validation
**Impact:** Invalid CVX codes could be stored
**Recommendation:** Add validation for CDC CVX code format

**LOW - Line 477: Consent Validation Missing**
```typescript
consentObtained: boolean;
```

**Problem:** No hook to validate consentBy is set when consentObtained=true
**Impact:** Missing audit trail of who provided consent
**Recommendation:** Add validation hook

---

### 1.14 Vital Signs Model (/workspaces/white-cross/backend/src/database/models/vital-signs.model.ts)

**Overall Score: B+ (88/100)**

#### Strengths:
- Comprehensive vital signs tracking
- Unit tracking for temperature, weight, height
- Automatic BMI calculation hook
- Automatic abnormal vital detection hook
- Pain scale validation (0-10)
- Abnormal flags array for specific vitals

#### Issues Found:

**HIGH - Line 217-239: BMI Calculation Hook Only on Create**
```typescript
@BeforeCreate
static async calculateBMI(instance: VitalSigns) {
  // BMI calculation logic
}
```

**Problem:** BMI not recalculated on update if height/weight change
**Impact:** Stale BMI values if vitals are updated
**Recommendation:** Add @BeforeUpdate decorator

**MEDIUM - Line 241-292: Hardcoded Abnormal Ranges**
```typescript
// Temperature checks (assuming Fahrenheit)
if (instance.temperature) {
  if (instance.temperature < 95 || instance.temperature > 100.4) {
    abnormalFlags.push('temperature');
  }
}
```

**Problem:** Hardcoded thresholds don't account for age/patient variations
**Impact:** May flag normal values for some populations
**Recommendation:** Make thresholds configurable or age-based

**MEDIUM - Line 129-180: All Vitals Optional**
```typescript
@Column(DataType.FLOAT)
temperature?: number;

@Column(DataType.INTEGER)
heartRate?: number;
```

**Problem:** All measurements optional, could create empty records
**Impact:** Meaningless vital signs records with no data
**Recommendation:** Require at least one vital sign measurement

---

## 2. Data Validation Analysis

### 2.1 Model-Level Validators

**Excellent:**
- Email validation (User, EmergencyContact)
- Phone number validation (EmergencyContact with E.164)
- NDC format validation (Medication)
- NPI format validation (HealthRecord)
- ICD-10 code validation (HealthRecord)
- Duration min/max validation (Appointment)
- Pain scale validation (VitalSigns)

**Missing:**
- MRN (Medical Record Number) format validation (Student)
- CVX code format validation (Vaccination)
- ICD code format validation (ChronicCondition)
- Prescription number format validation (StudentMedication)
- Grade value validation (Student)
- Phone number validation (User)

### 2.2 Custom Validation Functions

**Excellent Examples:**
```typescript
// Medication - Controlled substance validation
@BeforeCreate
@BeforeUpdate
static async validateControlledSchedule(instance: Medication) {
  if (instance.isControlled && !instance.deaSchedule) {
    throw new Error('Controlled medications must have a DEA schedule');
  }
  if (!instance.isControlled && instance.deaSchedule) {
    throw new Error('Non-controlled medications cannot have a DEA schedule');
  }
}

// Allergy - EpiPen requirement validation
@BeforeCreate
@BeforeUpdate
static async validateEpiPen(instance: Allergy) {
  if (instance.epiPenRequired && !instance.epiPenLocation) {
    throw new Error('epiPenLocation is required when EpiPen is required');
  }
}
```

**Recommendations:**
1. Add validation for medication interaction checks
2. Add age-appropriate medication dosage validation
3. Add allergy-medication cross-validation
4. Add appointment scheduling conflict validation

### 2.3 Data Integrity Rules

**Implemented:**
- Unique constraints (studentNumber, email, NDC)
- Foreign key constraints (mostly implemented)
- NOT NULL enforcement (varies by model)
- Default values (well implemented)
- Enum constraints (excellent coverage)

**Gaps:**
- No database-level CHECK constraints defined
- Some foreign keys missing ON DELETE/ON UPDATE rules
- Inconsistent nullable vs NOT NULL decisions

---

## 3. Indexes Analysis

### 3.1 Primary Keys

**Status: EXCELLENT**
- All models use UUID primary keys
- All have proper default (UUIDV4)
- All marked with @PrimaryKey decorator

**Issue:**
- Student model uses DataType.STRING instead of DataType.UUID

### 3.2 Foreign Keys

**Index Coverage: GOOD (85%)**

**Well-Indexed:**
- All studentId foreign keys
- Most userId foreign keys
- healthRecordId in related tables

**Missing Index Decorator:**
- StudentMedication foreign keys (but indexes defined in table config)

### 3.3 Performance Indexes

**Excellent Composite Indexes:**

```typescript
// HealthRecord
{
  fields: ['studentId', 'recordType', 'recordDate'],
  name: 'idx_health_records_student_type_date',
}

// Appointment
{
  fields: ['nurseId', 'scheduledAt', 'status'],
  name: 'idx_appointments_nurse_scheduled_status',
}

// AuditLog
{
  fields: ['entityType', 'entityId', 'createdAt'],
}
```

**Recommendations:**
1. Add index on Student.enrollmentDate for cohort queries
2. Add index on Medication.manufacturer for recall queries
3. Add index on Allergy.diagnosedDate for timeline queries
4. Add GIN index on Incident Report evidencePhotos array

### 3.4 Unique Constraints

**Properly Implemented:**
- Student.studentNumber (unique index)
- Student.medicalRecordNum (unique index)
- User.email (unique index)
- Medication.ndc (unique index)

---

## 4. Hooks & Lifecycle Analysis

### 4.1 BeforeCreate Hooks

**Usage: WIDESPREAD**

**Common Patterns:**
- Password hashing (User)
- Audit logging (all PHI models)
- Field calculation (BMI in VitalSigns)
- Business validation (Medication controlled schedule)
- Auto-population (EpiPen witness requirement)

**Best Implementation:**
```typescript
// User model - Password hashing with configurable salt rounds
@BeforeCreate
static async hashPasswordBeforeCreate(user: User) {
  if (user.password) {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);

    if (saltRounds < 10 || saltRounds > 14) {
      throw new Error(
        `SECURITY WARNING: bcrypt salt rounds must be between 10 and 14. Current: ${saltRounds}`,
      );
    }

    user.password = await bcrypt.hash(user.password, saltRounds);
    user.lastPasswordChange = new Date();
  }
}
```

### 4.2 BeforeUpdate Hooks

**Usage: WIDESPREAD**

**Common Patterns:**
- Audit logging on field changes
- Password change tracking
- Validation enforcement
- Auto-updating timestamps

**Issue - Inconsistent Implementation:**
- Some hooks only on @BeforeCreate (BMI calculation)
- Some hooks on both decorators but different logic

### 4.3 AfterCreate/AfterUpdate Hooks

**Usage: MINIMAL**

**Issue:** No AfterCreate/AfterUpdate hooks for:
- Creating related records (e.g., auto-create health record on allergy diagnosis)
- Sending notifications (e.g., notify on critical incident)
- Triggering workflows (e.g., schedule follow-up on diagnosis)

**Recommendation:** Implement AfterCreate hooks for:
1. Critical allergy notifications
2. Incident report escalation
3. Medication interaction checks
4. Compliance deadline creation

### 4.4 Audit Logging Hooks

**Status: PARTIALLY IMPLEMENTED**

**Current Implementation:**
```typescript
@BeforeCreate
@BeforeUpdate
static async auditPHIAccess(instance: HealthRecord) {
  if (instance.changed()) {
    const changedFields = instance.changed() as string[];

    const { logModelPHIAccess } = await import(
      '../services/model-audit-helper.service.js'
    );

    await logModelPHIAccess(
      'HealthRecord',
      instance.id,
      'UPDATE',
      changedFields,
      transaction,
    );
  }
}
```

**Issues:**
1. Most models still use console.log (with TODO comments)
2. Only HealthRecord and EmergencyContact use persistent audit service
3. Inconsistent PHI field tracking
4. No CREATE action logging, only UPDATE

**CRITICAL RECOMMENDATION:**
Replace all console.log audit hooks with persistent AuditLog service immediately for HIPAA compliance.

---

## 5. Schema Design Analysis

### 5.1 Normalization

**Overall: GOOD (3NF compliant)**

**Well-Normalized:**
- Medications separate from StudentMedications (proper M:N via junction)
- Appointments reference User and Student
- Emergency contacts separate from Students
- Incident reports separate from follow-up actions and witness statements

**Potential Denormalization for Performance:**
- User name cached in AuditLog (good for reporting)
- Student age calculated dynamically (good, avoids stale data)

### 5.2 Data Type Choices

**Excellent:**
- UUID for all primary/foreign keys
- ENUM for constrained values
- DECIMAL for dosage amounts
- DATEONLY for dates without time
- JSONB for structured metadata (in most cases)

**Issues:**
- JSON instead of JSONB in some models (ChronicCondition, VitalSigns)
- Student foreign keys use STRING(UUID) instead of UUID type
- Some TEXT fields where VARCHAR would be more appropriate

### 5.3 Nullable vs NOT NULL

**Inconsistencies Found:**

**Should be NOT NULL but Nullable:**
```typescript
// Medication - dosageForm is required for safety
@Column({
  type: DataType.STRING(255),
  allowNull: false,  // ✓ Correct
})
dosageForm: string;

// StudentMedication - prescribedBy is critical for liability
@Column({
  type: DataType.STRING(255),
  allowNull: false,  // ✓ Correct
})
prescribedBy: string;
```

**Correctly Nullable:**
```typescript
// Student - nurseId can be unassigned
@Column({
  type: DataType.STRING,
  allowNull: true,  // ✓ Correct
})
nurseId?: string;
```

**Issue - Mixed Patterns:**
- Some models use optional TypeScript (?) consistently
- Some have TypeScript optional but database NOT NULL
- Some have database nullable but no TypeScript optional

### 5.4 Default Values

**Excellent Implementation:**

```typescript
// Proper boolean defaults
@Default(false)
@Column(DataType.BOOLEAN)
isActive: boolean;

// Proper timestamp defaults
@Default(DataType.NOW)
@Column(DataType.DATE)
enrollmentDate: Date;

// Proper array defaults
@Default([])
@Column({
  type: DataType.ARRAY(DataType.STRING(255)),
  allowNull: false,
})
witnesses: string[];
```

**Recommendations:**
1. Add default status for all workflow entities
2. Add default compliance status for all compliance-related entities
3. Consider default priority for EmergencyContact (already has PRIMARY)

---

## 6. Critical Issues Summary

### 6.1 CRITICAL (Must Fix Before Production)

1. **Incomplete Audit Logging** (11+ models affected)
   - **Files:** medication.model.ts, student-medication.model.ts, medication-log.model.ts, allergy.model.ts, chronic-condition.model.ts, appointment.model.ts, incident-report.model.ts, vaccination.model.ts, vital-signs.model.ts
   - **Issue:** Console.log instead of persistent AuditLog service
   - **Impact:** HIPAA violation, audit trail lost on restart
   - **Fix:** Replace all console.log with AuditLog service calls

2. **Missing Foreign Key Constraints** (Student model)
   - **File:** student.model.ts lines 156-178
   - **Issue:** Foreign keys lack referential integrity
   - **Impact:** Risk of orphaned records, data corruption
   - **Fix:** Add @ForeignKey decorator and references config

3. **Inconsistent UUID Type** (Student model)
   - **File:** student.model.ts line 49
   - **Issue:** Using DataType.STRING instead of DataType.UUID for primary key
   - **Impact:** Less efficient indexing, larger storage
   - **Fix:** Change to DataType.UUID

4. **Redundant Fields** (MedicationLog model)
   - **File:** medication-log.model.ts lines 159-163
   - **Issue:** wasGiven field duplicates status field
   - **Impact:** Data integrity risk
   - **Fix:** Remove wasGiven, derive from status enum

### 6.2 HIGH PRIORITY (Fix Soon)

1. **NDC Validation Too Strict** (Medication model)
   - **File:** medication.model.ts line 167
   - **Issue:** Regex doesn't support all valid NDC formats
   - **Impact:** Valid medications rejected
   - **Fix:** Update regex to support 10-digit and 11-digit NDC formats

2. **JSON vs JSONB** (ChronicCondition, VitalSigns)
   - **Files:** chronic-condition.model.ts lines 188-214, vital-signs.model.ts
   - **Issue:** Using JSON instead of JSONB for arrays
   - **Impact:** Less efficient querying
   - **Fix:** Change to JSONB

3. **Missing Validation** (Multiple models)
   - **Files:** student.model.ts (MRN), chronic-condition.model.ts (ICD code), vaccination.model.ts (CVX code)
   - **Issue:** No format validation on critical identifiers
   - **Impact:** Invalid codes stored
   - **Fix:** Add regex validation

### 6.3 MEDIUM PRIORITY

1. **BMI Calculation Only on Create** (VitalSigns model)
   - **File:** vital-signs.model.ts line 217
   - **Issue:** BMI not recalculated on update
   - **Impact:** Stale BMI if vitals updated
   - **Fix:** Add @BeforeUpdate decorator

2. **Hardcoded Vital Thresholds** (VitalSigns model)
   - **File:** vital-signs.model.ts lines 246-289
   - **Issue:** No age-based or configurable ranges
   - **Impact:** May flag normal values
   - **Fix:** Make thresholds age-based or configurable

3. **Missing Index Decorators** (StudentMedication)
   - **File:** student-medication.model.ts
   - **Issue:** Indexes defined in table config but no @Index decorator
   - **Impact:** Inconsistent with other models
   - **Fix:** Add @Index decorators for consistency

### 6.4 LOW PRIORITY

1. **Enum vs String** (Multiple models)
   - **Files:** appointment.model.ts (recurringFrequency)
   - **Issue:** Using string where enum would be better
   - **Impact:** Could store invalid values
   - **Fix:** Create appropriate enums

2. **Direct process.env Access** (User model)
   - **File:** user.model.ts lines 544, 561
   - **Issue:** Violates configuration architecture
   - **Impact:** Inconsistent with standards
   - **Fix:** Consider alternative approach (AppConfigService injection complex in hooks)

---

## 7. Best Practices & Recommendations

### 7.1 Sequelize v6 Best Practices

**Already Implemented:**
- ✅ sequelize-typescript decorators
- ✅ Model class extending Model<Attributes>
- ✅ Paranoid soft deletes
- ✅ Scopes for reusable queries
- ✅ Hooks for business logic
- ✅ Virtual fields with getters
- ✅ Instance methods for business logic
- ✅ Proper TypeScript typing

**Recommendations:**
1. Use transaction parameter in all hooks for rollback safety
2. Add class methods for complex queries
3. Consider Model.afterSync hooks for seed data
4. Use Model.scope('defaultScope').unscoped() carefully

### 7.2 HIPAA Compliance

**Current Status: PARTIAL**

**Implemented:**
- PHI documentation in comments
- Soft deletes for audit trail
- Audit logging hooks (incomplete)
- Encryption fields noted
- Access logging (partial)

**Critical Gaps:**
1. **Field-level encryption not implemented**
   - Recommendation: Encrypt PHI fields at rest
2. **Audit logging incomplete**
   - Recommendation: Complete AuditLog service integration
3. **No access control at model level**
   - Recommendation: Add row-level security
4. **No data retention policies enforced**
   - Recommendation: Implement automated data retention

### 7.3 Production Database Modeling

**Recommendations:**

1. **Add Database Constraints**
   ```sql
   ALTER TABLE students ADD CONSTRAINT chk_grade
     CHECK (grade IN ('K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'));

   ALTER TABLE medications ADD CONSTRAINT chk_controlled_schedule
     CHECK ((is_controlled = true AND dea_schedule IS NOT NULL) OR
            (is_controlled = false AND dea_schedule IS NULL));
   ```

2. **Add Covering Indexes**
   ```typescript
   // For student health dashboard query
   {
     fields: ['studentId', 'isActive'],
     include: ['firstName', 'lastName', 'grade'],
   }
   ```

3. **Add Partial Indexes**
   ```typescript
   // Only index active students
   {
     fields: ['studentId'],
     where: { isActive: true },
   }
   ```

4. **Add Materialized Views**
   - Student health summary view
   - Compliance status dashboard
   - Medication administration schedule

### 7.4 Performance Optimization

**Already Optimized:**
- Composite indexes on common query patterns
- Indexes on foreign keys
- GIN indexes on JSONB fields
- Scopes with ORDER BY

**Additional Recommendations:**

1. **Query Optimization**
   - Use eager loading with includes
   - Avoid N+1 queries with proper includes
   - Use raw queries for complex reports

2. **Index Maintenance**
   - Monitor unused indexes (pg_stat_user_indexes)
   - Add indexes based on query patterns
   - Consider index-only scans for common queries

3. **Connection Pooling**
   - Configure appropriate pool size
   - Monitor connection usage
   - Implement connection retry logic

### 7.5 Testing Recommendations

**Model Testing:**
```typescript
describe('Medication Model', () => {
  describe('Validation', () => {
    it('should reject invalid NDC format', async () => {
      expect(async () => {
        await Medication.create({
          name: 'Test Med',
          ndc: 'invalid',
          // ...
        });
      }).rejects.toThrow('NDC must be in format');
    });

    it('should require DEA schedule for controlled substances', async () => {
      expect(async () => {
        await Medication.create({
          name: 'Test Med',
          isControlled: true,
          // missing deaSchedule
        });
      }).rejects.toThrow('Controlled medications must have a DEA schedule');
    });
  });

  describe('Hooks', () => {
    it('should set requiresWitness for Schedule II', async () => {
      const med = await Medication.create({
        name: 'Oxycodone',
        isControlled: true,
        deaSchedule: 'II',
      });

      expect(med.requiresWitness).toBe(true);
    });
  });
});
```

---

## 8. Migration Checklist

### 8.1 Immediate Actions (Week 1)

- [ ] Replace all console.log audit hooks with AuditLog service
- [ ] Add missing foreign key constraints to Student model
- [ ] Fix Student primary key type (STRING → UUID)
- [ ] Remove redundant wasGiven field from MedicationLog
- [ ] Add validation patterns for MRN, CVX, ICD codes

### 8.2 Short-term Actions (Month 1)

- [ ] Convert JSON fields to JSONB
- [ ] Add missing @Index decorators
- [ ] Implement field-level encryption for PHI
- [ ] Update NDC validation regex
- [ ] Add @BeforeUpdate to BMI calculation hook
- [ ] Make vital sign thresholds configurable

### 8.3 Long-term Actions (Quarter 1)

- [ ] Implement row-level security
- [ ] Add database CHECK constraints
- [ ] Create materialized views for reporting
- [ ] Implement automated data retention
- [ ] Add AfterCreate hooks for workflows
- [ ] Comprehensive model test coverage

---

## 9. Security Recommendations

### 9.1 Implemented Security

- Password hashing with bcrypt
- Configurable salt rounds
- Account lockout after failed attempts
- MFA support
- Email verification
- Password rotation tracking
- OAuth integration support

### 9.2 Additional Recommendations

1. **Field-level Encryption**
   ```typescript
   @Column({
     type: DataType.TEXT,
     get() {
       const encrypted = this.getDataValue('ssn');
       return encrypted ? decrypt(encrypted) : null;
     },
     set(value: string) {
       this.setDataValue('ssn', encrypt(value));
     },
   })
   ssn?: string;
   ```

2. **Audit All PHI Access**
   ```typescript
   @AfterFind
   static async auditRead(instances: HealthRecord[]) {
     for (const instance of instances) {
       await AuditLog.create({
         action: AuditAction.READ,
         entityType: 'HealthRecord',
         entityId: instance.id,
         isPHI: true,
       });
     }
   }
   ```

3. **Rate Limiting at Model Level**
   - Implement for login attempts
   - Implement for API key usage
   - Implement for bulk operations

---

## 10. Conclusion

The White Cross Sequelize models demonstrate **strong architectural foundation** with excellent use of TypeScript, comprehensive enums, well-designed indexes, and good understanding of HIPAA requirements. However, **critical gaps in audit logging implementation** pose compliance risks that must be addressed immediately.

### Final Scores by Category:

| Category | Score | Status |
|----------|-------|--------|
| Model Definitions | 90/100 | Excellent |
| Data Validation | 80/100 | Good |
| Indexes | 92/100 | Excellent |
| Hooks & Lifecycle | 75/100 | Needs Work |
| Schema Design | 88/100 | Very Good |
| HIPAA Compliance | 70/100 | Incomplete |
| Performance | 90/100 | Excellent |
| **Overall** | **85/100** | **Good (B+)** |

### Priority Actions:

1. **This Week:** Complete audit logging integration
2. **This Month:** Fix foreign key constraints and validation
3. **This Quarter:** Implement field-level encryption and complete HIPAA compliance

The models are **production-ready with the critical fixes applied**, particularly the audit logging completion. The architecture is solid and will scale well with proper monitoring and index maintenance.

---

**End of Report**

Generated by: Sequelize Models Architect
Date: 2025-11-07
Models Version: v2.0.0
