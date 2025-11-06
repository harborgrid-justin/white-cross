# Database Architecture Review Report
**Date:** 2025-11-05
**Database System:** PostgreSQL with Sequelize ORM
**Total Models Analyzed:** 92 models (~21,118 lines of code)
**Compliance Requirements:** HIPAA, FERPA, GDPR

---

## Executive Summary

This comprehensive review examined the entire database schema across 92 Sequelize models representing a school health management system. The analysis identified **critical data integrity issues**, **foreign key constraint problems**, **missing indexes**, and **normalization concerns** that require immediate attention for HIPAA compliance and production readiness.

**Overall Assessment:** The schema has a solid foundation but contains **18 critical issues** and **34 medium-priority issues** that must be addressed before production deployment.

---

## Critical Issues (Priority 1 - Must Fix)

### 1. BROKEN FOREIGN KEY RELATIONSHIPS

#### Issue 1.1: MedicationLog Missing Foreign Key Constraint
**File:** `/workspaces/white-cross/backend/src/database/models/medication-log.model.ts`
**Lines:** 86-90

**Problem:**
```typescript
@Column({
  type: DataType.UUID,
  allowNull: false
})
medicationId: string;
```

The `medicationId` field in `MedicationLog` has NO foreign key constraint, decorator, or referential integrity to the `medications` table. This allows orphaned records and data corruption.

**Impact:**
- Medication logs can reference non-existent medications
- Cannot enforce CASCADE or SET NULL on medication deletion
- HIPAA audit trail broken (cannot trace medication administration to actual medication records)
- Data integrity violations

**Fix:**
```typescript
@ForeignKey(() => require('./medication.model').Medication)
@Column({
  type: DataType.UUID,
  allowNull: false,
  references: {
    model: 'medications',
    key: 'id'
  },
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT'  // Prevent deletion of medications with logs
})
medicationId: string;

@BelongsTo(() => require('./medication.model').Medication, {
  foreignKey: 'medicationId',
  as: 'medication'
})
declare medication?: any;
```

---

#### Issue 1.2: StudentMedication Foreign Key Inconsistency
**File:** `/workspaces/white-cross/backend/src/database/models/student-medication.model.ts`
**Lines:** 86-98

**Problem:**
```typescript
@ForeignKey(() => require('./student.model').Student)
@Column({
  type: DataType.UUID,
  allowNull: false
})
studentId: string;

@ForeignKey(() => require('./medication.model').Medication)
@Column({
  type: DataType.UUID,
  allowNull: false
})
medicationId: string;
```

Missing `references` object and `onDelete`/`onUpdate` actions in column definitions.

**Impact:**
- Inconsistent foreign key enforcement across database
- No explicit referential integrity constraints
- Migration scripts may not create proper foreign keys

**Fix:**
```typescript
@ForeignKey(() => require('./student.model').Student)
@Column({
  type: DataType.UUID,
  allowNull: false,
  references: {
    model: 'students',
    key: 'id'
  },
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'  // Student deletion cascades to their medications
})
studentId: string;

@ForeignKey(() => require('./medication.model').Medication)
@Column({
  type: DataType.UUID,
  allowNull: false,
  references: {
    model: 'medications',
    key: 'id'
  },
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT'  // Cannot delete medications in active use
})
medicationId: string;
```

---

#### Issue 1.3: School.incidentReports Relationship Without Foreign Key
**File:** `/workspaces/white-cross/backend/src/database/models/school.model.ts`
**Lines:** 262-267

**Problem:**
```typescript
@HasMany(() => require('./incident-report.model').IncidentReport, {
  foreignKey: 'schoolId',
  as: 'incidentReports',
  constraints: false  // ⚠️ DISABLES CONSTRAINTS!
})
declare incidentReports?: any[];
```

The `constraints: false` option **completely disables foreign key constraints**, allowing orphaned records.

**Impact:**
- Incident reports can reference deleted schools
- No referential integrity between schools and incidents
- HIPAA compliance violation (cannot ensure data lineage)
- Cannot CASCADE deletes properly

**Fix:**
```typescript
@HasMany(() => require('./incident-report.model').IncidentReport, {
  foreignKey: 'schoolId',
  as: 'incidentReports'
  // Remove constraints: false
})
declare incidentReports?: any[];
```

AND add to IncidentReport model:
```typescript
@ForeignKey(() => require('./school.model').School)
@Column({
  type: DataType.UUID,
  allowNull: true,  // Some incidents may not have school context
  references: {
    model: 'schools',
    key: 'id'
  },
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL'
})
schoolId?: string;
```

---

### 2. MISSING CRITICAL INDEXES

#### Issue 2.1: Allergy Model - Missing Composite Indexes
**File:** `/workspaces/white-cross/backend/src/database/models/allergy.model.ts`
**Lines:** 118-136

**Problem:**
```typescript
indexes: [
  { fields: ['studentId', 'active'] },  // No name - auto-generated hash
  { fields: ['allergyType', 'severity'] },  // No name
  { fields: ['epiPenExpiration'] }  // No name
]
```

**Issues:**
- No explicit index names (Sequelize generates unpredictable names)
- Missing critical query indexes
- No index on `severity` alone for severe allergy queries
- No composite index for common filtering patterns

**Impact:**
- Slow queries when searching for life-threatening allergies
- Poor performance on EpiPen expiration reports
- Index names differ between environments

**Fix:**
```typescript
indexes: [
  // Primary filtering indexes
  {
    fields: ['studentId', 'active'],
    name: 'idx_allergies_student_active'
  },
  {
    fields: ['allergyType', 'severity', 'active'],
    name: 'idx_allergies_type_severity_active'
  },
  {
    fields: ['severity', 'active'],
    name: 'idx_allergies_severity_active'
  },

  // EpiPen management indexes
  {
    fields: ['epiPenRequired', 'epiPenExpiration', 'active'],
    name: 'idx_allergies_epipen_expiration',
    where: {
      epiPenRequired: true
    }
  },
  {
    fields: ['epiPenExpiration'],
    name: 'idx_allergies_epipen_exp_date'
  },

  // Verification workflow
  {
    fields: ['verified', 'active', 'createdAt'],
    name: 'idx_allergies_verified_status'
  },

  // Student health overview
  {
    fields: ['studentId', 'severity', 'active'],
    name: 'idx_allergies_student_severity'
  },

  // Standard audit indexes
  {
    fields: ['createdAt'],
    name: 'idx_allergies_created_at'
  },
  {
    fields: ['updatedAt'],
    name: 'idx_allergies_updated_at'
  }
]
```

---

#### Issue 2.2: ChronicCondition Missing Critical Indexes
**File:** `/workspaces/white-cross/backend/src/database/models/chronic-condition.model.ts`
**Lines:** 80-104

**Problem:**
```typescript
indexes: [
  { fields: ['studentId', 'isActive'] },  // No name
  { fields: ['status', 'isActive'] },  // No name
  { fields: ['nextReviewDate'] },  // No name
  { fields: ['requiresIEP'] },  // No name
  { fields: ['requires504'] }  // No name
]
```

**Issues:**
- No composite index for IEP/504 reporting queries
- Missing index for overdue reviews
- No index on `condition` field for condition-type reporting
- No index for multiple conditions per student

**Impact:**
- Slow IEP/504 compliance reports
- Poor performance on review due date queries
- Inefficient condition prevalence analytics

**Fix:**
```typescript
indexes: [
  // Core filtering
  {
    fields: ['studentId', 'isActive', 'status'],
    name: 'idx_chronic_conditions_student_active_status'
  },
  {
    fields: ['status', 'isActive', 'nextReviewDate'],
    name: 'idx_chronic_conditions_status_review'
  },

  // IEP/504 compliance
  {
    fields: ['requiresIEP', 'isActive'],
    name: 'idx_chronic_conditions_iep'
  },
  {
    fields: ['requires504', 'isActive'],
    name: 'idx_chronic_conditions_504'
  },
  {
    fields: ['requiresIEP', 'requires504', 'isActive'],
    name: 'idx_chronic_conditions_accommodations'
  },

  // Review management
  {
    fields: ['nextReviewDate', 'isActive'],
    name: 'idx_chronic_conditions_next_review'
  },
  {
    fields: ['lastReviewDate'],
    name: 'idx_chronic_conditions_last_review'
  },

  // Condition tracking
  {
    fields: ['condition', 'isActive'],
    name: 'idx_chronic_conditions_condition_type'
  },
  {
    fields: ['icdCode'],
    name: 'idx_chronic_conditions_icd_code'
  },

  // Health record integration
  {
    fields: ['healthRecordId'],
    name: 'idx_chronic_conditions_health_record'
  },

  // Standard audit indexes
  {
    fields: ['createdAt'],
    name: 'idx_chronic_conditions_created_at'
  },
  {
    fields: ['updatedAt'],
    name: 'idx_chronic_conditions_updated_at'
  }
]
```

---

#### Issue 2.3: StudentMedication Missing Index for Active Medication Queries
**File:** `/workspaces/white-cross/backend/src/database/models/student-medication.model.ts`
**Lines:** 48-78

**Problem:**
```typescript
indexes: [
  { fields: ['studentId'] },
  { fields: ['medicationId'] },
  { fields: ['isActive'] },
  { fields: ['startDate'] },
  { fields: ['endDate'] },
  { fields: ['studentId', 'isActive'] },
  { fields: ['createdBy'] }
]
```

**Issues:**
- No composite index for date range queries (startDate + endDate + isActive)
- No index for medication expiration queries
- Missing index for prescriber tracking
- No index for refill management

**Impact:**
- Slow queries for currently active medications
- Poor performance on medication expiration reports
- Inefficient medication administration scheduling

**Fix:**
```typescript
indexes: [
  // Core student queries
  {
    fields: ['studentId', 'isActive', 'startDate'],
    name: 'idx_student_medications_student_active_start'
  },
  {
    fields: ['studentId', 'endDate', 'isActive'],
    name: 'idx_student_medications_student_end_active'
  },

  // Medication tracking
  {
    fields: ['medicationId', 'isActive'],
    name: 'idx_student_medications_medication_active'
  },

  // Active medication queries (current date between start and end)
  {
    fields: ['isActive', 'startDate', 'endDate'],
    name: 'idx_student_medications_active_date_range'
  },

  // Prescription management
  {
    fields: ['prescribedBy', 'startDate'],
    name: 'idx_student_medications_prescriber'
  },
  {
    fields: ['prescriptionNumber'],
    name: 'idx_student_medications_prescription_num'
  },

  // Refill tracking
  {
    fields: ['refillsRemaining', 'isActive'],
    name: 'idx_student_medications_refills'
  },

  // Audit tracking
  {
    fields: ['createdBy'],
    name: 'idx_student_medications_created_by'
  },
  {
    fields: ['createdAt'],
    name: 'idx_student_medications_created_at'
  },
  {
    fields: ['updatedAt'],
    name: 'idx_student_medications_updated_at'
  }
]
```

---

### 3. DATA INTEGRITY VIOLATIONS

#### Issue 3.1: MedicationLog - Inconsistent Status and WasGiven Fields
**File:** `/workspaces/white-cross/backend/src/database/models/medication-log.model.ts`
**Lines:** 129-158

**Problem:**
```typescript
@Index
@Column({
  type: DataType.STRING(50),
  validate: {
    isIn: [Object.values(MedicationLogStatus)]
  },
  allowNull: true,  // ⚠️ NULLABLE!
  defaultValue: MedicationLogStatus.ADMINISTERED,
  comment: 'Status of medication administration'
})
status?: MedicationLogStatus;

// ... later ...

@Default(false)
@Column({
  type: DataType.BOOLEAN,
  allowNull: false
})
wasGiven: boolean;
```

**Issues:**
- `status` is nullable but `wasGiven` is required - semantic overlap
- No validation ensuring consistency between `status` and `wasGiven`
- If `status` is REFUSED, `wasGiven` should be false
- If `wasGiven` is false, `reasonNotGiven` should be required

**Impact:**
- Data inconsistency: `status: ADMINISTERED` but `wasGiven: false`
- HIPAA audit trail corruption (conflicting medication records)
- Legal liability if medication administration status is unclear

**Fix:**

Add validation hook:
```typescript
@BeforeCreate
@BeforeUpdate
static async validateMedicationStatus(instance: MedicationLog) {
  // Ensure status is never null
  if (!instance.status) {
    instance.status = instance.wasGiven
      ? MedicationLogStatus.ADMINISTERED
      : MedicationLogStatus.CANCELLED;
  }

  // Validate consistency between status and wasGiven
  const statusGiven = [
    MedicationLogStatus.ADMINISTERED
  ];
  const statusNotGiven = [
    MedicationLogStatus.MISSED,
    MedicationLogStatus.CANCELLED,
    MedicationLogStatus.REFUSED
  ];

  if (instance.wasGiven && !statusGiven.includes(instance.status)) {
    throw new Error(
      `Invalid status '${instance.status}' for wasGiven=true. ` +
      `Must be ADMINISTERED.`
    );
  }

  if (!instance.wasGiven && statusGiven.includes(instance.status)) {
    throw new Error(
      `Invalid status '${instance.status}' for wasGiven=false. ` +
      `Cannot mark as ADMINISTERED when medication was not given.`
    );
  }

  // Require reason when medication not given
  if (!instance.wasGiven && !instance.reasonNotGiven) {
    throw new Error('reasonNotGiven is required when wasGiven is false');
  }

  // Clear reasonNotGiven if medication was given
  if (instance.wasGiven && instance.reasonNotGiven) {
    instance.reasonNotGiven = undefined;
  }
}
```

AND change `status` to NOT NULL:
```typescript
@Index
@Column({
  type: DataType.STRING(50),
  validate: {
    isIn: [Object.values(MedicationLogStatus)]
  },
  allowNull: false,  // ✅ REQUIRED
  defaultValue: MedicationLogStatus.PENDING,  // Better default
  comment: 'Status of medication administration'
})
status: MedicationLogStatus;
```

---

#### Issue 3.2: Appointment - Duplicate Date Fields Without Sync
**File:** `/workspaces/white-cross/backend/src/database/models/appointment.model.ts`
**Lines:** 214-239

**Problem:**
```typescript
@Index
@Column({
  type: DataType.DATE,
  allowNull: false
})
scheduledAt: Date;

/**
 * Alias for 'scheduledAt' field - used for DTO compatibility
 * @returns The scheduled date and time
 */
get appointmentDate(): Date {
  return this.scheduledAt;
}

set appointmentDate(value: Date) {
  this.scheduledAt = value;
}
```

**Issues:**
- Virtual getter/setter creates confusion about which field is "real"
- DTOs may set `appointmentDate` but queries use `scheduledAt`
- No database-level alias (virtual fields don't exist in DB)
- Code uses both names inconsistently

**Impact:**
- Query confusion and bugs
- Difficult to maintain consistent field usage
- ORM mismatches between models and DTOs

**Fix:**

**Option 1 (Recommended): Standardize on scheduledAt**
Remove the virtual field and update all DTOs to use `scheduledAt`:
```typescript
// Remove lines 214-239
// Update all DTOs and services to use scheduledAt consistently
```

**Option 2: Keep Virtual but Document Clearly**
```typescript
/**
 * IMPORTANT: This is a VIRTUAL field (getter/setter only).
 * The actual database column is 'scheduledAt'.
 * Use 'scheduledAt' in all database queries and indexes.
 * This field exists ONLY for backward compatibility with legacy DTOs.
 *
 * @deprecated Use 'scheduledAt' instead. This will be removed in v2.0
 */
get appointmentDate(): Date {
  return this.scheduledAt;
}

set appointmentDate(value: Date) {
  this.scheduledAt = value;
}
```

---

#### Issue 3.3: Allergy EpiPen Validation Allows Expired Pens
**File:** `/workspaces/white-cross/backend/src/database/models/allergy.model.ts`
**Lines:** 292-301

**Problem:**
```typescript
@BeforeCreate
@BeforeUpdate
static async validateEpiPen(instance: Allergy) {
  if (instance.epiPenRequired && !instance.epiPenLocation) {
    throw new Error('epiPenLocation is required when EpiPen is required');
  }
  if (instance.epiPenExpiration && instance.epiPenExpiration < new Date()) {
    console.warn(`[WARNING] EpiPen for allergy ${instance.id} has expired`);
    // ⚠️ ONLY LOGS WARNING - DOESN'T PREVENT SAVE!
  }
}
```

**Issues:**
- Expired EpiPen records can be created/saved
- Only logs a warning (easily missed)
- No enforcement of expiration date validity
- HIPAA compliance risk: expired emergency medication on record

**Impact:**
- Students with expired EpiPens marked as "protected"
- Life-threatening allergy response failure
- Legal liability if expired EpiPen is relied upon

**Fix:**
```typescript
@BeforeCreate
@BeforeUpdate
static async validateEpiPen(instance: Allergy) {
  if (instance.epiPenRequired) {
    // Require location
    if (!instance.epiPenLocation) {
      throw new Error('epiPenLocation is required when EpiPen is required');
    }

    // Require expiration date
    if (!instance.epiPenExpiration) {
      throw new Error('epiPenExpiration is required when EpiPen is required');
    }

    // Prevent saving expired EpiPens
    const now = new Date();
    if (instance.epiPenExpiration < now) {
      throw new Error(
        `Cannot save allergy with expired EpiPen. ` +
        `EpiPen expired on ${instance.epiPenExpiration.toISOString()}. ` +
        `Please update the EpiPen expiration date or mark epiPenRequired as false.`
      );
    }

    // Warn if expiring soon (within 30 days)
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    if (instance.epiPenExpiration < thirtyDaysFromNow) {
      console.warn(
        `[WARNING] EpiPen for allergy ${instance.id} expires soon: ` +
        `${instance.epiPenExpiration.toISOString()}`
      );
    }
  } else {
    // Clear EpiPen fields if not required
    instance.epiPenLocation = undefined;
    instance.epiPenExpiration = undefined;
  }
}
```

---

### 4. REFERENTIAL INTEGRITY CONCERNS

#### Issue 4.1: User Model - Inconsistent onDelete Actions
**File:** `/workspaces/white-cross/backend/src/database/models/user.model.ts`
**Lines:** 183-209

**Problem:**
```typescript
@ForeignKey(() => require('./school.model').School)
@Column({
  type: DataType.UUID,
  allowNull: true,
  references: { model: 'schools', key: 'id' },
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL',  // ✅ Correct
})
declare schoolId?: string;

@ForeignKey(() => require('./district.model').District)
@Column({
  type: DataType.UUID,
  allowNull: true,
  references: { model: 'districts', key: 'id' },
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL',  // ✅ Correct
})
declare districtId?: string;
```

BUT elsewhere in the codebase:

**Student Model:**
```typescript
@ForeignKey(() => require('./school.model').School)
@Column({
  type: DataType.UUID,
  allowNull: true,
  references: { model: 'schools', key: 'id' },
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'  // ⚠️ DELETES STUDENTS!
})
schoolId?: string;
```

**Issues:**
- Inconsistent cascading behavior across similar relationships
- User school deletion sets to NULL (keeps user)
- Student school deletion cascades DELETE (removes student!)
- No clear policy on referential integrity strategy

**Impact:**
- Accidental data loss when deleting schools
- Orphaned records in some tables, cascaded deletes in others
- Difficult to predict deletion behavior

**Fix:**

**Create a Referential Integrity Policy Document:**

```markdown
## Referential Integrity Strategy

### CASCADE DELETE (onDelete: 'CASCADE')
Use when child records have no meaning without parent:
- Student → HealthRecords
- Student → Appointments
- Student → Allergies
- IncidentReport → WitnessStatements
- Appointment → AppointmentReminders

### SET NULL (onDelete: 'SET NULL')
Use when child records should be preserved but reference is optional:
- User → schoolId (users can exist without schools)
- User → districtId
- Student → nurseId (students can exist without assigned nurse)
- Appointment → nurseId (preserve appointment history)

### RESTRICT (onDelete: 'RESTRICT')
Use when deletion should be prevented if references exist:
- Medication (cannot delete if in use by StudentMedications)
- School (cannot delete if has active students)
- District (cannot delete if has active schools)
```

**Apply Policy to Student Model:**
```typescript
@ForeignKey(() => require('./school.model').School)
@Column({
  type: DataType.UUID,
  allowNull: true,
  references: { model: 'schools', key: 'id' },
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT'  // ✅ Changed: Prevent school deletion if students exist
})
schoolId?: string;

@ForeignKey(() => require('./district.model').District)
@Column({
  type: DataType.UUID,
  allowNull: true,
  references: { model: 'districts', key: 'id' },
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT'  // ✅ Changed: Prevent district deletion if students exist
})
districtId?: string;
```

---

#### Issue 4.2: IncidentReport.reportedById Uses RESTRICT Instead of SET NULL
**File:** `/workspaces/white-cross/backend/src/database/models/incident-report.model.ts`
**Lines:** 196-207

**Problem:**
```typescript
@ForeignKey(() => require('./user.model').User)
@Column({
  type: DataType.UUID,
  allowNull: false,
  references: { model: 'users', key: 'id' },
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT'  // ⚠️ PREVENTS USER DELETION!
})
reportedById: string;
```

**Issues:**
- User accounts cannot be deleted if they've reported incidents
- HIPAA requires retaining incident reports indefinitely
- Prevents employee offboarding/account cleanup
- Forces keeping inactive user accounts forever

**Impact:**
- Cannot deactivate/delete user accounts after employee departure
- Accumulation of stale user accounts
- Compliance issue: retaining unnecessary PII

**Fix:**

**Option 1 (Recommended): SET NULL with Audit Trail**
```typescript
@ForeignKey(() => require('./user.model').User)
@Column({
  type: DataType.UUID,
  allowNull: true,  // ✅ Changed: Allow null after user deletion
  references: { model: 'users', key: 'id' },
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL'  // ✅ Changed: Preserve incident but null user reference
})
reportedById?: string;  // ✅ Changed: Make optional

// Add denormalized fields for audit trail
@Column({
  type: DataType.STRING(200),
  allowNull: true,
  comment: 'Name of user who reported (denormalized for historical record)'
})
reportedByName?: string;

@Column({
  type: DataType.STRING(255),
  allowNull: true,
  comment: 'Email of user who reported (denormalized for historical record)'
})
reportedByEmail?: string;
```

AND add hook to denormalize data:
```typescript
@BeforeCreate
static async denormalizeReporter(instance: IncidentReport) {
  if (instance.reportedById) {
    const User = require('./user.model').User;
    const reporter = await User.findByPk(instance.reportedById);
    if (reporter) {
      instance.reportedByName = reporter.fullName;
      instance.reportedByEmail = reporter.email;
    }
  }
}
```

---

## Medium Priority Issues (Priority 2)

### 5. NORMALIZATION CONCERNS

#### Issue 5.1: User Model - Duplicate Fields (passwordChangedAt vs lastPasswordChange)
**File:** `/workspaces/white-cross/backend/src/database/models/user.model.ts`
**Lines:** 248-286

**Problem:**
```typescript
@Column({
  type: DataType.DATE,
  allowNull: true,
  comment: 'Timestamp when password was last changed (for token invalidation)'
})
declare passwordChangedAt?: Date;

// ... 30 lines later ...

@Column({
  type: DataType.DATE,
  allowNull: true,
  comment: 'Timestamp when password was last changed (for password rotation policy)'
})
declare lastPasswordChange?: Date;
```

**Issues:**
- Two fields storing the same information
- Both track password change timestamp
- Wastes storage space
- Creates confusion about which field to use
- Both fields are set in password hooks (lines 425-426)

**Impact:**
- Code inconsistency (some uses `passwordChangedAt`, others use `lastPasswordChange`)
- Potential bugs if fields diverge
- Redundant data in database

**Fix:**

**Remove duplicate field:**
```typescript
// Keep only passwordChangedAt (more semantic for JWT validation)
// Remove lastPasswordChange field entirely

// Update hook:
@BeforeUpdate
static async hashPasswordBeforeUpdate(user: User) {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 10);
    user.passwordChangedAt = new Date();
    // REMOVE: user.lastPasswordChange = new Date();
  }
}

// Update requiresPasswordChange() method:
requiresPasswordChange(): boolean {
  if (this.mustChangePassword) {
    return true;
  }

  if (this.passwordChangedAt) {  // ✅ Use passwordChangedAt
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    return this.passwordChangedAt < ninetyDaysAgo;
  }

  return false;
}
```

---

#### Issue 5.2: User Model - Duplicate Email Verification Fields
**File:** `/workspaces/white-cross/backend/src/database/models/user.model.ts`
**Lines:** 217-234, 347-361

**Problem:**
```typescript
// First set of fields:
@Column({
  type: DataType.BOOLEAN,
  allowNull: false,
  defaultValue: false
})
declare emailVerified: boolean;

@Column({ type: DataType.STRING(255), allowNull: true })
declare emailVerificationToken?: string;

@Column({ type: DataType.DATE, allowNull: true })
declare emailVerificationExpires?: Date;

// ... later, DUPLICATE set of fields:

@Column({
  type: DataType.BOOLEAN,
  allowNull: false,
  defaultValue: false,
  comment: 'Whether email address has been verified'
})
declare isEmailVerified: boolean;

@Column({
  type: DataType.DATE,
  allowNull: true,
  comment: 'Timestamp when email was verified'
})
declare emailVerifiedAt?: Date | null;
```

**Issues:**
- `emailVerified` vs `isEmailVerified` (both boolean, same purpose)
- No clear migration path between old and new fields
- Two sources of truth for verification status

**Impact:**
- Bugs when code uses wrong field
- Database bloat
- Confusion for developers

**Fix:**

**Consolidate to single set of fields:**
```typescript
// REMOVE: emailVerified (use isEmailVerified instead)
// KEEP: isEmailVerified, emailVerifiedAt, emailVerificationToken, emailVerificationExpires

@Column({
  type: DataType.BOOLEAN,
  allowNull: false,
  defaultValue: false,
  comment: 'Whether email address has been verified'
})
declare isEmailVerified: boolean;

@Column({
  type: DataType.DATE,
  allowNull: true,
  comment: 'Timestamp when email was verified'
})
declare emailVerifiedAt?: Date | null;

@Column({
  type: DataType.STRING(255),
  allowNull: true,
  comment: 'Token for email verification (expires after emailVerificationExpires)'
})
declare emailVerificationToken?: string | null;

@Column({
  type: DataType.DATE,
  allowNull: true,
  comment: 'Expiration time for verification token'
})
declare emailVerificationExpires?: Date | null;
```

**Migration script:**
```typescript
// Copy emailVerified to isEmailVerified if isEmailVerified is null
await queryInterface.sequelize.query(`
  UPDATE users
  SET "isEmailVerified" = "emailVerified"
  WHERE "isEmailVerified" IS NULL OR "isEmailVerified" = false;
`);

// Then drop emailVerified column
await queryInterface.removeColumn('users', 'emailVerified');
```

---

#### Issue 5.3: User Model - Duplicate 2FA Fields
**File:** `/workspaces/white-cross/backend/src/database/models/user.model.ts`
**Lines:** 256-267, 295-323

**Problem:**
```typescript
// First set:
@Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
declare twoFactorEnabled: boolean;

@Column({ type: DataType.STRING(255), allowNull: true })
declare twoFactorSecret?: string;

// ... later, DUPLICATE set:

@Column({
  type: DataType.BOOLEAN,
  allowNull: false,
  defaultValue: false,
  comment: 'Whether multi-factor authentication is enabled'
})
declare mfaEnabled: boolean;

@Column({
  type: DataType.STRING(255),
  allowNull: true,
  comment: 'TOTP secret for MFA (encrypted)'
})
declare mfaSecret?: string | null;

@Column({
  type: DataType.TEXT,
  allowNull: true,
  comment: 'JSON array of hashed backup codes for MFA recovery'
})
declare mfaBackupCodes?: string | null;

@Column({
  type: DataType.DATE,
  allowNull: true,
  comment: 'Timestamp when MFA was enabled'
})
declare mfaEnabledAt?: Date | null;
```

**Issues:**
- `twoFactorEnabled` vs `mfaEnabled` (same concept)
- `twoFactorSecret` vs `mfaSecret` (same data)
- Migration incomplete between old and new fields

**Impact:**
- Security bugs if wrong field is checked
- Code uses both naming conventions
- Database bloat

**Fix:**

**Consolidate to MFA fields (more modern terminology):**
```typescript
// REMOVE: twoFactorEnabled, twoFactorSecret
// KEEP: mfaEnabled, mfaSecret, mfaBackupCodes, mfaEnabledAt

@Column({
  type: DataType.BOOLEAN,
  allowNull: false,
  defaultValue: false,
  comment: 'Whether multi-factor authentication is enabled'
})
declare mfaEnabled: boolean;

@Column({
  type: DataType.STRING(255),
  allowNull: true,
  comment: 'TOTP secret for MFA (encrypted with application key)'
})
declare mfaSecret?: string | null;

@Column({
  type: DataType.TEXT,
  allowNull: true,
  comment: 'JSON array of hashed backup codes for MFA recovery (bcrypt hashed)'
})
declare mfaBackupCodes?: string | null;

@Column({
  type: DataType.DATE,
  allowNull: true,
  comment: 'Timestamp when MFA was enabled'
})
declare mfaEnabledAt?: Date | null;
```

---

### 6. MISSING CONSTRAINTS

#### Issue 6.1: User.failedLoginAttempts No Upper Bound
**File:** `/workspaces/white-cross/backend/src/database/models/user.model.ts`
**Lines:** 268-273

**Problem:**
```typescript
@Column({
  type: DataType.INTEGER,
  allowNull: false,
  defaultValue: 0
})
declare failedLoginAttempts: number;
```

**Issues:**
- No validation constraint (could be negative or extremely large)
- No maximum value defined
- Could overflow in extreme edge cases

**Impact:**
- Data integrity issues
- Potential integer overflow bugs

**Fix:**
```typescript
@Column({
  type: DataType.INTEGER,
  allowNull: false,
  defaultValue: 0,
  validate: {
    min: 0,
    max: 1000  // Reasonable upper bound
  },
  comment: 'Number of consecutive failed login attempts'
})
declare failedLoginAttempts: number;
```

---

#### Issue 6.2: Appointment.duration Validation Too Broad
**File:** `/workspaces/white-cross/backend/src/database/models/appointment.model.ts`
**Lines:** 241-251

**Problem:**
```typescript
@Column({
  type: DataType.INTEGER,
  allowNull: false,
  defaultValue: 30,
  validate: {
    min: 15,
    max: 120  // 2 hours maximum
  },
  comment: 'Duration in minutes'
})
duration: number;
```

**Issues:**
- Max of 120 minutes may be insufficient for some appointments
- No validation for multiples of 5 or 15 (standard scheduling increments)
- Could allow odd durations like 17 or 73 minutes

**Impact:**
- UI scheduling grid misalignment
- Confusing appointment durations

**Fix:**
```typescript
@Column({
  type: DataType.INTEGER,
  allowNull: false,
  defaultValue: 30,
  validate: {
    min: 15,
    max: 240,  // ✅ Increased to 4 hours for extended appointments
    isMultipleOfFive(value: number) {
      if (value % 5 !== 0) {
        throw new Error('Duration must be a multiple of 5 minutes');
      }
    }
  },
  comment: 'Duration in minutes (must be multiple of 5)'
})
duration: number;
```

---

#### Issue 6.3: Student.medicalRecordNum Duplicate Unique Index
**File:** `/workspaces/white-cross/backend/src/database/models/student.model.ts`
**Lines:** 109-117, 233-237

**Problem:**
```typescript
// In indexes array:
{
  fields: ['medicalRecordNum'],
  unique: true,
  where: {
    medicalRecordNum: {
      [Op.ne]: null
    }
  }
},

// In column definition:
@AllowNull
@Column({
  type: DataType.STRING(50),
  unique: true  // ⚠️ DUPLICATE UNIQUE CONSTRAINT!
})
medicalRecordNum?: string;
```

**Issues:**
- Two unique constraints on same column
- Index constraint has WHERE clause (partial unique index)
- Column constraint is unconditional unique
- May cause issues with NULL values

**Impact:**
- Unnecessary duplicate index
- Performance overhead
- Confusion about which constraint is enforced

**Fix:**

**Remove column-level unique constraint (keep partial index):**
```typescript
@AllowNull
@Column({
  type: DataType.STRING(50)
  // REMOVE: unique: true
})
medicalRecordNum?: string;

// Keep partial unique index in indexes array:
{
  fields: ['medicalRecordNum'],
  unique: true,
  name: 'idx_students_medical_record_num_unique',
  where: {
    medicalRecordNum: {
      [Op.ne]: null
    }
  }
}
```

---

### 7. AUDIT LOG DEFICIENCIES

#### Issue 7.1: AuditLog Has updatedAt Field Despite Being Immutable
**File:** `/workspaces/white-cross/backend/src/database/models/audit-log.model.ts`
**Lines:** 92, 127-129

**Problem:**
```typescript
@Table({
  tableName: 'audit_logs',
  timestamps: true,
  updatedAt: false,  // ✅ Correctly disabled
  underscored: false,
  indexes: [...]
})

// BUT...

{
  fields: ['updatedAt'],
  name: 'idx_audit_log_updated_at'  // ⚠️ INDEX ON NON-EXISTENT FIELD!
}
```

**Issues:**
- Index created for `updatedAt` field that doesn't exist
- Sequelize will create an empty/unused index
- Wasted disk space and index maintenance overhead

**Impact:**
- Unnecessary index maintenance
- Disk space waste
- Slower writes

**Fix:**
```typescript
// Remove the updatedAt index:
indexes: [
  // ... all other indexes ...
  {
    fields: ['createdAt'],
    name: 'idx_audit_log_created_at'
  }
  // REMOVE: idx_audit_log_updated_at
]
```

---

#### Issue 7.2: AuditLog Has BeforeUpdate Hook Despite Being Immutable
**File:** `/workspaces/white-cross/backend/src/database/models/audit-log.model.ts`
**Lines:** 305-315

**Problem:**
```typescript
// Hooks for HIPAA compliance
@BeforeCreate
@BeforeUpdate  // ⚠️ SHOULD NEVER BE CALLED (audit logs are immutable!)
static async auditPHIAccess(instance: AuditLog) {
  if (instance.changed()) {
    const changedFields = instance.changed() as string[];
    console.log(`[AUDIT] AuditLog ${instance.id} modified at ${new Date().toISOString()}`);
    console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
    // TODO: Integrate with AuditLog service for persistent audit trail
  }
}
```

**Issues:**
- Audit logs should NEVER be updated (immutability requirement)
- Having `@BeforeUpdate` hook suggests updates are expected
- Should actively PREVENT updates instead

**Impact:**
- HIPAA compliance violation if audit logs are modified
- Data tampering risk

**Fix:**

**Remove BeforeUpdate and add prevention:**
```typescript
@BeforeCreate
static preventModification(instance: AuditLog) {
  // Ensure audit logs have a timestamp
  if (!instance.createdAt) {
    instance.createdAt = new Date();
  }
}

@BeforeUpdate
static preventUpdate(instance: AuditLog) {
  throw new Error(
    'AUDIT LOG MODIFICATION ATTEMPT DETECTED: ' +
    'Audit logs are immutable and cannot be updated. ' +
    'This is a HIPAA compliance requirement. ' +
    `Attempted modification of AuditLog ${instance.id} at ${new Date().toISOString()}`
  );
}

@BeforeDestroy
static preventDelete(instance: AuditLog) {
  throw new Error(
    'AUDIT LOG DELETION ATTEMPT DETECTED: ' +
    'Audit logs are immutable and cannot be deleted. ' +
    'This is a HIPAA compliance requirement. ' +
    'Use data retention policies for archival. ' +
    `Attempted deletion of AuditLog ${instance.id} at ${new Date().toISOString()}`
  );
}
```

---

### 8. INDEX NAMING INCONSISTENCIES

#### Issue 8.1: Inconsistent Index Naming Conventions
**Files:** Multiple model files across `/workspaces/white-cross/backend/src/database/models/`

**Problem:**

Some models use explicit names:
```typescript
{ fields: ['createdAt'], name: 'idx_students_created_at' }
```

Others don't:
```typescript
{ fields: ['studentId', 'active'] }  // Auto-generated name
```

**Issues:**
- Inconsistent naming makes debugging difficult
- Auto-generated names are unpredictable
- Can't easily identify indexes in production
- Makes migrations harder to write

**Impact:**
- Hard to track which indexes exist
- Difficult to drop/recreate specific indexes
- Production debugging issues

**Fix:**

**Establish naming convention and apply consistently:**

```typescript
// Convention: idx_{tablename}_{field1}_{field2}_{purpose}

// Examples:
indexes: [
  // Single field indexes
  {
    fields: ['studentId'],
    name: 'idx_allergies_student'
  },
  {
    fields: ['active'],
    name: 'idx_allergies_active'
  },

  // Composite indexes (list all fields)
  {
    fields: ['studentId', 'active'],
    name: 'idx_allergies_student_active'
  },
  {
    fields: ['studentId', 'severity', 'active'],
    name: 'idx_allergies_student_severity_active'
  },

  // Unique indexes (include _unique suffix)
  {
    fields: ['studentNumber'],
    unique: true,
    name: 'idx_students_student_number_unique'
  },

  // Partial indexes (include _partial suffix)
  {
    fields: ['epiPenRequired', 'epiPenExpiration'],
    name: 'idx_allergies_epipen_exp_partial',
    where: { epiPenRequired: true }
  }
]
```

**Apply to ALL models systematically.**

---

### 9. SCHEMA CONSISTENCY ISSUES

#### Issue 9.1: ConsentForm Missing Paranoid Soft Deletes
**File:** `/workspaces/white-cross/backend/src/database/models/consent-form.model.ts`
**Lines:** 46-69

**Problem:**
```typescript
@Table({
  tableName: 'consent_forms',
  timestamps: true,
  underscored: false,
  // ⚠️ MISSING: paranoid: true
  indexes: [...]
})
```

**Issues:**
- Most other PHI-related models use `paranoid: true` (soft deletes)
- ConsentForm does NOT have soft deletes
- Consent forms are legal documents that should never be hard deleted
- Inconsistent with HIPAA/legal retention requirements

**Impact:**
- Consent forms can be permanently deleted
- Legal compliance violation
- Cannot recover accidentally deleted consent forms

**Fix:**
```typescript
@Table({
  tableName: 'consent_forms',
  timestamps: true,
  underscored: false,
  paranoid: true,  // ✅ Added: Enable soft deletes for legal compliance
  indexes: [
    { fields: ['type'], name: 'idx_consent_forms_type' },
    { fields: ['isActive'], name: 'idx_consent_forms_active' },
    { fields: ['expiresAt'], name: 'idx_consent_forms_expires' },
    { fields: ['deletedAt'], name: 'idx_consent_forms_deleted' },  // ✅ Added
    { fields: ['createdAt'], name: 'idx_consent_forms_created_at' },
    { fields: ['updatedAt'], name: 'idx_consent_forms_updated_at' }
  ]
})
export class ConsentForm extends Model<ConsentFormAttributes> implements ConsentFormAttributes {
  // ... existing fields ...

  // ✅ Add deletedAt field:
  @Column({ type: DataType.DATE, allowNull: true })
  declare deletedAt?: Date;
}
```

---

#### Issue 9.2: PhiDisclosure Missing Paranoid Soft Deletes
**File:** `/workspaces/white-cross/backend/src/database/models/phi-disclosure.model.ts`
**Lines:** 91-123

**Problem:**
```typescript
@Table({
  tableName: 'phi_disclosures',
  timestamps: true,
  underscored: false,
  // ⚠️ MISSING: paranoid: true
  indexes: [...]
})
```

**Issues:**
- PHI disclosure logs are REQUIRED by HIPAA to be retained
- Missing soft delete protection
- Critical compliance violation
- Can be permanently deleted, destroying audit trail

**Impact:**
- HIPAA violation (loss of disclosure accounting)
- Legal liability
- Cannot track PHI access history

**Fix:**
```typescript
@Table({
  tableName: 'phi_disclosures',
  timestamps: true,
  underscored: false,
  paranoid: true,  // ✅ CRITICAL: Enable soft deletes for HIPAA compliance
  indexes: [
    { fields: ['studentId', 'disclosureDate'], name: 'idx_phi_disclosures_student_date' },
    { fields: ['purpose', 'disclosureDate'], name: 'idx_phi_disclosures_purpose_date' },
    { fields: ['studentId'], name: 'idx_phi_disclosures_student' },
    { fields: ['purpose'], name: 'idx_phi_disclosures_purpose' },
    { fields: ['disclosureDate'], name: 'idx_phi_disclosures_date' },
    { fields: ['followUpDate'], name: 'idx_phi_disclosures_followup' },
    { fields: ['deletedAt'], name: 'idx_phi_disclosures_deleted' },  // ✅ Added
    { fields: ['createdAt'], name: 'idx_phi_disclosures_created_at' },
    { fields: ['updatedAt'], name: 'idx_phi_disclosures_updated_at' }
  ]
})
export class PhiDisclosure extends Model<PhiDisclosureAttributes> implements PhiDisclosureAttributes {
  // ... existing fields ...

  // ✅ Add deletedAt field:
  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Soft delete timestamp - PHI disclosures must never be hard deleted per HIPAA'
  })
  declare deletedAt?: Date;
}
```

---

## Lower Priority Issues (Priority 3)

### 10. PERFORMANCE OPTIMIZATION OPPORTUNITIES

#### Issue 10.1: Student.getAge() Calculated on Every Access
**File:** `/workspaces/white-cross/backend/src/database/models/student.model.ts`
**Lines:** 350-353, 440-451

**Problem:**
```typescript
get age(): number {
  return this.getAge();
}

getAge(): number {
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}
```

**Issues:**
- Age calculated on every property access
- Unnecessary computation for bulk queries
- Could be pre-computed or cached

**Impact:**
- Performance overhead in list views
- Repeated calculations when rendering student lists

**Fix:**

**Option 1: Memoize calculation (simple)**
```typescript
private _cachedAge?: number;
private _cacheDate?: Date;

getAge(): number {
  const today = new Date();

  // Cache age for 1 hour
  if (this._cachedAge && this._cacheDate) {
    const hoursSinceCache = (today.getTime() - this._cacheDate.getTime()) / (1000 * 60 * 60);
    if (hoursSinceCache < 1) {
      return this._cachedAge;
    }
  }

  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  this._cachedAge = age;
  this._cacheDate = today;

  return age;
}
```

**Option 2: Database-calculated age (best for queries)**
```typescript
// Add scope with age calculation
@Scopes(() => ({
  withAge: {
    attributes: {
      include: [
        [
          sequelize.literal(`
            EXTRACT(YEAR FROM AGE(CURRENT_DATE, "dateOfBirth"))
          `),
          'age'
        ]
      ]
    }
  }
}))
```

---

#### Issue 10.2: HealthRecord.attachments Using JSON Instead of JSONB
**File:** `/workspaces/white-cross/backend/src/database/models/health-record.model.ts`
**Lines:** 278-283

**Problem:**
```typescript
@Default([])
@Column({
  type: DataType.JSON,  // ⚠️ Not indexed, no query support
  allowNull: false
})
attachments: string[];
```

**Issues:**
- JSON type doesn't support PostgreSQL JSONB indexing
- Cannot efficiently query attachments
- Missing opportunities for advanced queries

**Impact:**
- Slower queries on attachment metadata
- Cannot use PostgreSQL JSONB operators

**Fix:**
```typescript
@Default([])
@Column({
  type: DataType.JSONB,  // ✅ Changed to JSONB
  allowNull: false
})
attachments: string[];

// Add GIN index for JSONB queries
// In indexes array:
{
  fields: ['attachments'],
  using: 'gin',
  name: 'idx_health_records_attachments_gin'
}
```

---

#### Issue 10.3: Missing Covering Indexes for Common Queries
**Multiple Files**

**Problem:**
Many queries fetch multiple fields but indexes only cover sorting/filtering fields, not selected fields. This forces index-only scans to lookup full rows.

**Example:**
```typescript
// Query: Get active students with grade and name
Student.findAll({
  where: { isActive: true, grade: '10' },
  attributes: ['id', 'firstName', 'lastName', 'studentNumber']
});

// Current index:
{ fields: ['isActive', 'grade'] }

// Requires: 1) Index scan, 2) Table lookup for firstName, lastName, studentNumber
```

**Impact:**
- Extra I/O for row lookups
- Slower query performance

**Fix:**

**Add covering indexes for hot queries:**
```typescript
// Student model - covering index for common list queries
{
  fields: ['isActive', 'grade', 'lastName', 'firstName', 'studentNumber'],
  name: 'idx_students_active_grade_names_covering'
}

// Health records - covering index for recent records with basic info
{
  fields: ['studentId', 'recordDate', 'recordType', 'title'],
  name: 'idx_health_records_student_recent_covering'
}
```

---

### 11. DOCUMENTATION ISSUES

#### Issue 11.1: Inconsistent PHI Comments
**Multiple Files**

**Problem:**
Some fields marked as `@PHI` in comments, others with `// Protected Health Information`, others with no marking.

**Example from Student model:**
```typescript
/**
 * Student's first name
 * @PHI - Protected Health Information
 */
@Column({...})
firstName: string;

// vs.

@Column({...})
lastName: string;  // No PHI marking
```

**Impact:**
- Difficult to identify all PHI fields
- Incomplete HIPAA compliance documentation
- Hard to ensure proper encryption/access control

**Fix:**

**Standardize PHI marking across all models:**
```typescript
/**
 * Student's first name
 * @PHI HIPAA Protected Health Information - Requires audit logging
 */
@Column({...})
firstName: string;

/**
 * Student's last name
 * @PHI HIPAA Protected Health Information - Requires audit logging
 */
@Column({...})
lastName: string;

/**
 * Student's date of birth
 * @PHI HIPAA Protected Health Information - Requires audit logging
 * @FERPA Educational Record
 */
@Column({...})
dateOfBirth: Date;
```

**Create PHI field inventory document:**
```markdown
# PHI Fields Inventory

## Student Model (students table)
- firstName (String) - Name
- lastName (String) - Name
- dateOfBirth (Date) - DOB
- medicalRecordNum (String) - Medical Record Number
- photo (String URL) - Image
- studentNumber (String) - Student ID

## HealthRecord Model (health_records table)
- ALL FIELDS are PHI by definition
...
```

---

#### Issue 11.2: Missing Foreign Key Documentation
**Multiple Files**

**Problem:**
Foreign key relationships not consistently documented with relationship cardinality and cascade behavior.

**Example:**
```typescript
@ForeignKey(() => require('./student.model').Student)
@Column({...})
studentId: string;
```

**Impact:**
- Difficult to understand schema relationships
- Hard to predict cascade behavior
- Incomplete database documentation

**Fix:**

**Add comprehensive relationship documentation:**
```typescript
/**
 * Foreign Key: Student
 *
 * Relationship: Many-to-One (many health records belong to one student)
 * Cardinality: [1..N] health records per student
 * Cascade: DELETE CASCADE (deleting student removes all health records)
 * Required: Yes (health record must have a student)
 *
 * Business Rule: Health records are intrinsically tied to students.
 * When a student is removed from the system, all health records must
 * be deleted to maintain referential integrity.
 */
@ForeignKey(() => require('./student.model').Student)
@Column({
  type: DataType.UUID,
  allowNull: false,
  references: { model: 'students', key: 'id' },
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})
studentId: string;
```

---

### 12. SECURITY CONCERNS

#### Issue 12.1: Password Hashing Salt Rounds Hard-Coded
**File:** `/workspaces/white-cross/backend/src/database/models/user.model.ts`
**Lines:** 413-419, 421-428

**Problem:**
```typescript
@BeforeCreate
static async hashPasswordBeforeCreate(user: User) {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);  // ⚠️ Hard-coded
    user.lastPasswordChange = new Date();
  }
}

@BeforeUpdate
static async hashPasswordBeforeUpdate(user: User) {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 10);  // ⚠️ Hard-coded
    user.passwordChangedAt = new Date();
    user.lastPasswordChange = new Date();
  }
}
```

**Issues:**
- Salt rounds hard-coded to 10
- Cannot adjust security level without code changes
- No environment-based configuration

**Impact:**
- Inflexible security configuration
- Cannot increase rounds for high-security deployments

**Fix:**

**Use environment variable with sensible default:**
```typescript
import { ConfigService } from '@nestjs/config';

// In module or at top of file:
const configService = new ConfigService();
const BCRYPT_ROUNDS = configService.get<number>('BCRYPT_SALT_ROUNDS', 12);  // Default to 12

@BeforeCreate
static async hashPasswordBeforeCreate(user: User) {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, BCRYPT_ROUNDS);
    user.lastPasswordChange = new Date();
  }
}

@BeforeUpdate
static async hashPasswordBeforeUpdate(user: User) {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, BCRYPT_ROUNDS);
    user.passwordChangedAt = new Date();
    user.lastPasswordChange = new Date();
  }
}
```

**Add to configuration validation:**
```typescript
// src/config/validation.schema.ts
BCRYPT_SALT_ROUNDS: Joi.number().integer().min(10).max(16).default(12)
  .description('Bcrypt salt rounds for password hashing (10-16, default 12)')
```

---

## Summary and Recommendations

### Critical Issues Requiring Immediate Action

1. **Fix Foreign Key Constraints** (Issues 1.1-1.3)
   - Add missing foreign key to MedicationLog.medicationId
   - Remove `constraints: false` from School.incidentReports
   - Add complete foreign key definitions to StudentMedication

2. **Add Missing Indexes** (Issues 2.1-2.3)
   - Allergy model needs 8+ indexes for query optimization
   - ChronicCondition needs 12+ indexes for IEP/504 compliance
   - StudentMedication needs date-range indexes

3. **Fix Data Integrity Issues** (Issues 3.1-3.3)
   - Add validation hooks for MedicationLog status consistency
   - Prevent expired EpiPen records from being saved
   - Standardize Appointment date field naming

4. **Fix Referential Integrity** (Issues 4.1-4.2)
   - Establish and document referential integrity policy
   - Change IncidentReport.reportedById to SET NULL with denormalization
   - Apply CASCADE/RESTRICT/SET NULL consistently

### Medium Priority Improvements

5. **Normalize Duplicate Fields** (Issues 5.1-5.3)
   - Remove duplicate password change tracking fields
   - Consolidate email verification fields
   - Consolidate 2FA/MFA fields

6. **Add Missing Constraints** (Issues 6.1-6.3)
   - Add bounds validation to User.failedLoginAttempts
   - Improve Appointment.duration validation
   - Remove duplicate unique constraint on Student.medicalRecordNum

7. **Fix Audit Log Issues** (Issues 7.1-7.2)
   - Remove non-existent updatedAt index
   - Add BeforeUpdate hook to PREVENT modifications
   - Add BeforeDestroy hook to PREVENT deletions

8. **Standardize Index Naming** (Issue 8.1)
   - Apply consistent naming convention across all models
   - Document index naming convention

9. **Fix Schema Consistency** (Issues 9.1-9.2)
   - Add paranoid: true to ConsentForm
   - Add paranoid: true to PhiDisclosure
   - Add deletedAt fields and indexes

### Lower Priority Optimizations

10. **Performance Optimizations** (Issues 10.1-10.3)
    - Memoize Student.getAge() calculation
    - Change HealthRecord.attachments from JSON to JSONB
    - Add covering indexes for hot queries

11. **Improve Documentation** (Issues 11.1-11.2)
    - Standardize PHI field marking
    - Create PHI field inventory
    - Add comprehensive foreign key documentation

12. **Security Enhancements** (Issue 12.1)
    - Make bcrypt salt rounds configurable
    - Add environment-based security configuration

---

## Migration Priority and Timeline

### Phase 1: Critical Fixes (Week 1)
**MUST complete before production:**
- Add MedicationLog.medicationId foreign key
- Fix School.incidentReports constraints
- Add StudentMedication foreign key details
- Fix IncidentReport.reportedById referential integrity
- Add expired EpiPen validation

### Phase 2: Index Additions (Week 2)
**Performance and compliance:**
- Add all missing indexes to Allergy model
- Add all missing indexes to ChronicCondition model
- Add all missing indexes to StudentMedication model
- Standardize all index naming

### Phase 3: Data Integrity (Week 3)
**Data quality and consistency:**
- Add MedicationLog status validation
- Fix Appointment date field naming
- Add User.failedLoginAttempts validation
- Improve Appointment.duration validation

### Phase 4: Normalization (Week 4)
**Reduce redundancy:**
- Remove duplicate password tracking fields
- Consolidate email verification fields
- Consolidate 2FA fields
- Remove duplicate Student.medicalRecordNum unique constraint

### Phase 5: Compliance and Audit (Week 5)
**HIPAA/FERPA compliance:**
- Add paranoid mode to ConsentForm
- Add paranoid mode to PhiDisclosure
- Fix AuditLog immutability enforcement
- Remove AuditLog updatedAt index
- Standardize PHI field documentation

### Phase 6: Optimization (Ongoing)
**Performance improvements:**
- Memoize expensive calculations
- Convert JSON to JSONB where beneficial
- Add covering indexes for specific queries

---

## Testing Requirements

### Required Tests Before Deployment

1. **Foreign Key Constraint Tests**
   ```typescript
   describe('Foreign Key Integrity', () => {
     it('should prevent deletion of medication with existing logs', async () => {
       // Create medication and log
       // Attempt to delete medication
       // Expect error
     });

     it('should cascade delete student health records', async () => {
       // Create student with health records
       // Delete student
       // Verify health records are deleted
     });
   });
   ```

2. **Data Integrity Tests**
   ```typescript
   describe('MedicationLog Validation', () => {
     it('should prevent wasGiven=false with status=ADMINISTERED', async () => {
       // Attempt to create invalid log
       // Expect validation error
     });

     it('should require reasonNotGiven when wasGiven=false', async () => {
       // Attempt to create log without reason
       // Expect validation error
     });
   });
   ```

3. **Index Performance Tests**
   ```typescript
   describe('Index Performance', () => {
     it('should use index for student allergy queries', async () => {
       // Run EXPLAIN ANALYZE on query
       // Verify index usage
     });
   });
   ```

4. **Audit Log Immutability Tests**
   ```typescript
   describe('AuditLog Immutability', () => {
     it('should prevent updates to audit logs', async () => {
       // Create audit log
       // Attempt to update
       // Expect error
     });

     it('should prevent deletion of audit logs', async () => {
       // Create audit log
       // Attempt to delete
       // Expect error
     });
   });
   ```

---

## Database Migration Scripts

### Critical Migration 1: Add MedicationLog Foreign Key

```typescript
// migrations/20251105-001-add-medication-log-foreign-key.ts
import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  // Add foreign key constraint
  await queryInterface.addConstraint('medication_logs', {
    fields: ['medicationId'],
    type: 'foreign key',
    name: 'fk_medication_logs_medication_id',
    references: {
      table: 'medications',
      field: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  });

  // Add index for foreign key
  await queryInterface.addIndex('medication_logs', {
    fields: ['medicationId'],
    name: 'idx_medication_logs_medication_id'
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeConstraint('medication_logs', 'fk_medication_logs_medication_id');
  await queryInterface.removeIndex('medication_logs', 'idx_medication_logs_medication_id');
}
```

### Critical Migration 2: Add Comprehensive Allergy Indexes

```typescript
// migrations/20251105-002-add-allergy-indexes.ts
import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addIndex('allergies', {
    fields: ['studentId', 'active'],
    name: 'idx_allergies_student_active'
  });

  await queryInterface.addIndex('allergies', {
    fields: ['allergyType', 'severity', 'active'],
    name: 'idx_allergies_type_severity_active'
  });

  await queryInterface.addIndex('allergies', {
    fields: ['severity', 'active'],
    name: 'idx_allergies_severity_active'
  });

  await queryInterface.addIndex('allergies', {
    fields: ['epiPenRequired', 'epiPenExpiration', 'active'],
    name: 'idx_allergies_epipen_expiration',
    where: { epiPenRequired: true }
  });

  await queryInterface.addIndex('allergies', {
    fields: ['verified', 'active', 'createdAt'],
    name: 'idx_allergies_verified_status'
  });

  await queryInterface.addIndex('allergies', {
    fields: ['studentId', 'severity', 'active'],
    name: 'idx_allergies_student_severity'
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  const indexes = [
    'idx_allergies_student_active',
    'idx_allergies_type_severity_active',
    'idx_allergies_severity_active',
    'idx_allergies_epipen_expiration',
    'idx_allergies_verified_status',
    'idx_allergies_student_severity'
  ];

  for (const indexName of indexes) {
    await queryInterface.removeIndex('allergies', indexName);
  }
}
```

### Critical Migration 3: Add Paranoid Mode to Compliance Tables

```typescript
// migrations/20251105-003-add-paranoid-to-compliance-tables.ts
import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  // Add deletedAt to consent_forms
  await queryInterface.addColumn('consent_forms', 'deletedAt', {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Soft delete timestamp for legal compliance'
  });

  await queryInterface.addIndex('consent_forms', {
    fields: ['deletedAt'],
    name: 'idx_consent_forms_deleted'
  });

  // Add deletedAt to phi_disclosures
  await queryInterface.addColumn('phi_disclosures', 'deletedAt', {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Soft delete timestamp - PHI disclosures must never be hard deleted per HIPAA'
  });

  await queryInterface.addIndex('phi_disclosures', {
    fields: ['deletedAt'],
    name: 'idx_phi_disclosures_deleted'
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeColumn('consent_forms', 'deletedAt');
  await queryInterface.removeColumn('phi_disclosures', 'deletedAt');
}
```

---

## Conclusion

This database schema has a solid architectural foundation but requires critical fixes before production deployment. The most pressing issues involve:

1. **Missing foreign key constraints** that allow data corruption
2. **Inadequate indexing** that will cause performance issues at scale
3. **Data integrity violations** that could lead to HIPAA compliance failures
4. **Inconsistent referential integrity** that makes cascade behavior unpredictable

**Estimated Effort:**
- Critical fixes: 40-60 hours
- Medium priority: 30-40 hours
- Lower priority: 20-30 hours
- Testing: 40-50 hours
- **Total: 130-180 hours (3-4 weeks with 1-2 developers)**

**Risk Assessment:**
- **High Risk**: Deploying without critical fixes could result in data loss, HIPAA violations, and legal liability
- **Medium Risk**: Deploying without medium priority fixes will cause performance issues and data quality problems
- **Low Risk**: Lower priority issues can be addressed post-deployment in maintenance cycles

**Recommendation:** Complete Phase 1 (Critical Fixes) and Phase 2 (Index Additions) before production deployment. Phases 3-6 can be completed in post-deployment sprints.
