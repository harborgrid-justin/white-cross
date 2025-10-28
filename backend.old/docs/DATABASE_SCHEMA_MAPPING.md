# Database Schema to OpenAPI Mapping

**White Cross Healthcare Platform**
**Generated:** 2025-10-23
**Database:** PostgreSQL with Sequelize ORM
**Purpose:** Comprehensive documentation of database tables, fields, relationships, and OpenAPI schema mappings

---

## Table of Contents

1. [Overview](#overview)
2. [Core Models](#core-models)
3. [Healthcare Models](#healthcare-models)
4. [Medication Models](#medication-models)
5. [Security & RBAC Models](#security--rbac-models)
6. [Compliance Models](#compliance-models)
7. [Communication Models](#communication-models)
8. [Administration Models](#administration-models)
9. [Document Management Models](#document-management-models)
10. [Inventory & Budget Models](#inventory--budget-models)
11. [Integration Models](#integration-models)
12. [Field Exclusion Guidelines](#field-exclusion-guidelines)
13. [OpenAPI Schema Components](#openapi-schema-components)

---

## Overview

### Database Configuration
- **Dialect:** PostgreSQL
- **ORM:** Sequelize v6
- **Connection Pooling:** Min: 5, Max: 20 connections
- **SSL:** Enabled in production
- **Audit Logging:** HIPAA-compliant audit trails via `AuditableModel`
- **Timestamps:** All tables include `createdAt` and `updatedAt`

### Primary Key Strategy
- **Type:** UUID v4 (STRING)
- **Default:** `DataTypes.UUIDV4`
- **Consistency:** All primary keys use UUIDs for distributed systems compatibility

### Common Field Patterns
- **Audit Fields:** `createdBy`, `updatedBy` (nullable STRING, UUID references to users)
- **Timestamps:** `createdAt`, `updatedAt` (DATE, auto-managed by Sequelize)
- **Status Fields:** Boolean flags (`isActive`, `verified`, etc.) default to `true` or `false`
- **Enum Fields:** Validated against predefined enum types from `database/types/enums.ts`

---

## Core Models

### 1. users

**Table Name:** `users`
**Description:** System users with authentication, security features, and role-based access control
**HIPAA Compliance:** Contains PHI access credentials
**Security Level:** CRITICAL

#### Fields

| Field | Type | Required | Default | Constraints | OpenAPI Type | Sensitive | Notes |
|-------|------|----------|---------|-------------|--------------|-----------|-------|
| id | STRING (UUID) | Yes | UUIDV4 | PK, Unique | string (uuid) | No | Primary key |
| email | STRING | Yes | - | Unique, Email format | string (email) | Yes | Login identifier |
| password | STRING | Yes | - | Hashed (bcrypt) | - | **EXCLUDE** | Never expose in API |
| firstName | STRING | Yes | - | 1-100 chars | string | No | User first name |
| lastName | STRING | Yes | - | 1-100 chars | string | No | User last name |
| role | ENUM(UserRole) | Yes | NURSE | See enum | string (enum) | No | Legacy role field |
| isActive | BOOLEAN | Yes | true | - | boolean | No | Account status |
| lastLogin | DATE | No | null | - | string (date-time) | No | Last auth timestamp |
| schoolId | STRING (UUID) | No | null | FK to schools | string (uuid) | No | School association |
| districtId | STRING (UUID) | No | null | FK to districts | string (uuid) | No | District association |
| phone | STRING | No | null | Phone format regex | string | Yes | Contact number |
| emailVerified | BOOLEAN | Yes | false | - | boolean | No | Email verification status |
| emailVerificationToken | STRING | No | null | - | - | **EXCLUDE** | Security token |
| emailVerificationExpires | DATE | No | null | - | - | **EXCLUDE** | Token expiration |
| passwordResetToken | STRING | No | null | - | - | **EXCLUDE** | Security token |
| passwordResetExpires | DATE | No | null | - | - | **EXCLUDE** | Token expiration |
| passwordChangedAt | DATE | No | null | - | string (date-time) | No | Password change tracking |
| twoFactorEnabled | BOOLEAN | Yes | false | - | boolean | No | 2FA status |
| twoFactorSecret | STRING | No | null | Encrypted | - | **EXCLUDE** | 2FA TOTP secret |
| failedLoginAttempts | INTEGER | Yes | 0 | 0+ | integer | No | Login attempt counter |
| lockoutUntil | DATE | No | null | - | string (date-time) | No | Account lockout expiration |
| lastPasswordChange | DATE | No | null | - | string (date-time) | No | Password expiry tracking |
| mustChangePassword | BOOLEAN | Yes | false | - | boolean | No | Force password change |
| createdAt | DATE | Yes | NOW | Auto | string (date-time) | No | Record creation |
| updatedAt | DATE | Yes | NOW | Auto | string (date-time) | No | Record update |

#### Relationships
- **1:N → UserRoleAssignment:** User can have multiple role assignments (RBAC)
- **1:N → Session:** User can have multiple active sessions
- **1:N → LoginAttempt:** User login history tracking
- **1:N → Student (via nurseId):** Nurse assigned to students
- **1:N → Appointment (via nurseId):** Nurse appointments
- **N:1 ← School:** User belongs to a school
- **N:1 ← District:** User belongs to a district

#### Indexes
```sql
CREATE UNIQUE INDEX users_email_unique ON users(email);
CREATE INDEX users_schoolId_idx ON users(schoolId);
CREATE INDEX users_districtId_idx ON users(districtId);
CREATE INDEX users_role_idx ON users(role);
CREATE INDEX users_isActive_idx ON users(isActive);
CREATE INDEX users_emailVerificationToken_idx ON users(emailVerificationToken);
CREATE INDEX users_passwordResetToken_idx ON users(passwordResetToken);
CREATE INDEX users_lockoutUntil_idx ON users(lockoutUntil);
```

#### Validation Rules
- Email: RFC 5322 email format validation
- Password: Minimum 8 characters (enforced at application layer)
- Phone: International phone format regex
- Account Lockout: 5 failed attempts → 30-minute lockout
- Password Expiration: 90 days (healthcare compliance)

#### Security Features
- **Password Hashing:** Bcrypt with 10 rounds (via `beforeCreate` and `beforeUpdate` hooks)
- **Account Lockout:** Automatic after 5 failed login attempts (30 minutes)
- **2FA Support:** TOTP-based two-factor authentication
- **Password Expiration:** 90-day mandatory rotation for HIPAA compliance
- **Token Expiration:** Email verification and password reset tokens expire
- **Safe Object Method:** `toSafeObject()` excludes sensitive fields

#### OpenAPI Schema Component
```yaml
User:
  type: object
  properties:
    id:
      type: string
      format: uuid
      description: User unique identifier
    email:
      type: string
      format: email
      description: User email address (unique)
    firstName:
      type: string
      minLength: 1
      maxLength: 100
      description: User first name
    lastName:
      type: string
      minLength: 1
      maxLength: 100
      description: User last name
    role:
      type: string
      enum: [ADMIN, NURSE, SCHOOL_ADMIN, DISTRICT_ADMIN, VIEWER, COUNSELOR]
      description: Primary user role (legacy)
    isActive:
      type: boolean
      description: Account active status
    lastLogin:
      type: string
      format: date-time
      nullable: true
      description: Last successful login timestamp
    schoolId:
      type: string
      format: uuid
      nullable: true
      description: Associated school ID
    districtId:
      type: string
      format: uuid
      nullable: true
      description: Associated district ID
    phone:
      type: string
      nullable: true
      description: Phone number
    emailVerified:
      type: boolean
      description: Email verification status
    twoFactorEnabled:
      type: boolean
      description: Two-factor authentication enabled
    failedLoginAttempts:
      type: integer
      minimum: 0
      description: Count of failed login attempts
    lockoutUntil:
      type: string
      format: date-time
      nullable: true
      description: Account lockout expiration timestamp
    mustChangePassword:
      type: boolean
      description: Force password change on next login
    createdAt:
      type: string
      format: date-time
      description: Record creation timestamp
    updatedAt:
      type: string
      format: date-time
      description: Record last update timestamp
  required:
    - id
    - email
    - firstName
    - lastName
    - role
    - isActive
    - emailVerified
    - twoFactorEnabled

UserCreate:
  type: object
  properties:
    email:
      type: string
      format: email
    password:
      type: string
      minLength: 8
      description: Password (will be hashed)
    firstName:
      type: string
      minLength: 1
      maxLength: 100
    lastName:
      type: string
      minLength: 1
      maxLength: 100
    role:
      type: string
      enum: [ADMIN, NURSE, SCHOOL_ADMIN, DISTRICT_ADMIN, VIEWER, COUNSELOR]
    schoolId:
      type: string
      format: uuid
      nullable: true
    districtId:
      type: string
      format: uuid
      nullable: true
    phone:
      type: string
      nullable: true
  required:
    - email
    - password
    - firstName
    - lastName
    - role
```

---

### 2. students

**Table Name:** `students`
**Description:** Student demographic and enrollment information
**HIPAA Compliance:** Contains PHI (Protected Health Information)
**Security Level:** HIGH
**Auditable:** Yes (via `AuditableModel`)

#### Fields

| Field | Type | Required | Default | Constraints | OpenAPI Type | Sensitive | Notes |
|-------|------|----------|---------|-------------|--------------|-----------|-------|
| id | STRING (UUID) | Yes | UUIDV4 | PK, Unique | string (uuid) | No | Primary key |
| studentNumber | STRING(20) | Yes | - | Unique, Alphanumeric+hyphens | string | No | Unique student identifier |
| firstName | STRING(100) | Yes | - | 1-100 chars, Letters/spaces/hyphens/apostrophes | string | Yes (PHI) | Student first name |
| lastName | STRING(100) | Yes | - | 1-100 chars, Letters/spaces/hyphens/apostrophes | string | Yes (PHI) | Student last name |
| dateOfBirth | DATEONLY | Yes | - | Past date, Age 3-100 years | string (date) | Yes (PHI) | Birth date |
| grade | STRING(10) | Yes | - | 1-10 chars | string | No | Current grade level |
| gender | ENUM(Gender) | Yes | - | MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY | string (enum) | No | Gender identity |
| photo | STRING(500) | No | null | Valid URL | string (uri) | Yes (PHI) | Photo URL |
| medicalRecordNum | STRING(20) | No | null | Unique, 5-20 chars, Alphanumeric+hyphens | string | Yes (PHI) | Medical record number |
| isActive | BOOLEAN | Yes | true | - | boolean | No | Active enrollment status |
| enrollmentDate | DATE | Yes | NOW | 2000 to +1 year from today | string (date) | No | Enrollment date |
| nurseId | STRING(36) | No | null | UUID, FK to users | string (uuid) | No | Assigned nurse |
| createdBy | STRING | No | null | UUID, FK to users | string (uuid) | No | Audit: creator user ID |
| updatedBy | STRING | No | null | UUID, FK to users | string (uuid) | No | Audit: updater user ID |
| createdAt | DATE | Yes | NOW | Auto | string (date-time) | No | Record creation |
| updatedAt | DATE | Yes | NOW | Auto | string (date-time) | No | Record update |

#### Computed Properties (Not in DB)
- **fullName:** `${firstName} ${lastName}` (string)
- **age:** Calculated from `dateOfBirth` (integer)

#### Relationships
- **1:N → EmergencyContact:** Student has multiple emergency contacts
- **1:N → HealthRecord:** Student has multiple health records
- **1:N → Allergy:** Student has multiple allergies
- **1:N → StudentMedication:** Student has multiple medication prescriptions
- **1:N → Appointment:** Student has multiple appointments
- **1:N → Vaccination:** Student has multiple vaccination records
- **1:N → ChronicCondition:** Student has multiple chronic conditions
- **1:N → VitalSigns:** Student has multiple vital sign measurements
- **1:N → GrowthMeasurement:** Student has multiple growth measurements
- **1:N → Screening:** Student has multiple screening records
- **N:1 ← User (via nurseId):** Student assigned to a nurse

#### Indexes
```sql
CREATE UNIQUE INDEX students_studentNumber_unique ON students(studentNumber);
CREATE INDEX students_nurseId_idx ON students(nurseId);
CREATE INDEX students_isActive_idx ON students(isActive);
CREATE INDEX students_grade_idx ON students(grade);
CREATE INDEX students_lastName_firstName_idx ON students(lastName, firstName);
CREATE INDEX students_createdBy_idx ON students(createdBy);
```

#### Validation Rules
- **studentNumber:** 4-20 alphanumeric characters with optional hyphens
- **firstName/lastName:** Letters, spaces, hyphens, apostrophes only
- **dateOfBirth:** Must be past date, age must be 3-100 years
- **grade:** 1-10 characters (e.g., "K", "1", "12")
- **medicalRecordNum:** If provided, must be 5-20 alphanumeric+hyphens, unique
- **photo:** Must be valid URL, max 500 characters
- **enrollmentDate:** Must be between 2000 and 1 year from today

#### OpenAPI Schema Component
```yaml
Student:
  type: object
  properties:
    id:
      type: string
      format: uuid
    studentNumber:
      type: string
      minLength: 4
      maxLength: 20
      pattern: '^[A-Z0-9-]+$'
      description: Unique student identifier
    firstName:
      type: string
      minLength: 1
      maxLength: 100
      description: Student first name (PHI)
    lastName:
      type: string
      minLength: 1
      maxLength: 100
      description: Student last name (PHI)
    dateOfBirth:
      type: string
      format: date
      description: Student birth date (PHI)
    grade:
      type: string
      minLength: 1
      maxLength: 10
      description: Current grade level
    gender:
      type: string
      enum: [MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY]
    photo:
      type: string
      format: uri
      nullable: true
      maxLength: 500
      description: Photo URL (PHI)
    medicalRecordNum:
      type: string
      nullable: true
      minLength: 5
      maxLength: 20
      description: Medical record number (PHI)
    isActive:
      type: boolean
      description: Active enrollment status
    enrollmentDate:
      type: string
      format: date
      description: Date of enrollment
    nurseId:
      type: string
      format: uuid
      nullable: true
      description: Assigned nurse ID
    fullName:
      type: string
      readOnly: true
      description: Computed full name (firstName + lastName)
    age:
      type: integer
      readOnly: true
      description: Computed age from dateOfBirth
    createdAt:
      type: string
      format: date-time
    updatedAt:
      type: string
      format: date-time
  required:
    - id
    - studentNumber
    - firstName
    - lastName
    - dateOfBirth
    - grade
    - gender
    - isActive
    - enrollmentDate

StudentCreate:
  type: object
  properties:
    studentNumber:
      type: string
      minLength: 4
      maxLength: 20
      pattern: '^[A-Z0-9-]+$'
    firstName:
      type: string
      minLength: 1
      maxLength: 100
    lastName:
      type: string
      minLength: 1
      maxLength: 100
    dateOfBirth:
      type: string
      format: date
    grade:
      type: string
      minLength: 1
      maxLength: 10
    gender:
      type: string
      enum: [MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY]
    photo:
      type: string
      format: uri
      nullable: true
    medicalRecordNum:
      type: string
      nullable: true
      minLength: 5
      maxLength: 20
    nurseId:
      type: string
      format: uuid
      nullable: true
  required:
    - studentNumber
    - firstName
    - lastName
    - dateOfBirth
    - grade
    - gender
```

---

### 3. emergency_contacts

**Table Name:** `emergency_contacts`
**Description:** Emergency contact information for students
**HIPAA Compliance:** Contains PHI
**Security Level:** HIGH

#### Fields

| Field | Type | Required | Default | Constraints | OpenAPI Type | Sensitive | Notes |
|-------|------|----------|---------|-------------|--------------|-----------|-------|
| id | STRING (UUID) | Yes | UUIDV4 | PK | string (uuid) | No | Primary key |
| studentId | STRING(36) | Yes | - | UUID, FK to students | string (uuid) | No | Associated student |
| firstName | STRING(100) | Yes | - | 1-100 chars, Letters/spaces/hyphens/apostrophes | string | Yes (PHI) | Contact first name |
| lastName | STRING(100) | Yes | - | 1-100 chars, Letters/spaces/hyphens/apostrophes | string | Yes (PHI) | Contact last name |
| relationship | STRING(50) | Yes | - | Valid relationships enum | string (enum) | No | Relationship to student |
| phoneNumber | STRING(20) | Yes | - | 10-20 chars, Phone format | string | Yes (PHI) | Contact phone |
| email | STRING(255) | No | null | Email format, No disposable domains | string (email) | Yes (PHI) | Contact email |
| address | TEXT | No | null | Max 500 chars | string | Yes (PHI) | Contact address |
| priority | ENUM(ContactPriority) | Yes | PRIMARY | PRIMARY, SECONDARY, EMERGENCY_ONLY | string (enum) | No | Contact priority |
| isActive | BOOLEAN | Yes | true | - | boolean | No | Contact status |
| preferredContactMethod | ENUM | No | ANY | SMS, EMAIL, VOICE, ANY | string (enum) | No | Preferred method |
| verificationStatus | ENUM | No | UNVERIFIED | UNVERIFIED, PENDING, VERIFIED, FAILED | string (enum) | No | Verification status |
| lastVerifiedAt | DATE | No | null | Not future | string (date-time) | No | Last verification |
| notificationChannels | TEXT (JSON) | No | null | JSON array: sms, email, voice | array | No | Enabled channels |
| canPickupStudent | BOOLEAN | No | false | - | boolean | No | Pickup authorization |
| notes | TEXT | No | null | Max 1000 chars | string | No | Additional notes |
| createdAt | DATE | Yes | NOW | Auto | string (date-time) | No | Record creation |
| updatedAt | DATE | Yes | NOW | Auto | string (date-time) | No | Record update |

#### Relationships
- **N:1 ← Student:** Contact belongs to a student

#### Validation Rules
- **relationship:** Must be one of: PARENT, GUARDIAN, SIBLING, GRANDPARENT, AUNT_UNCLE, FAMILY_FRIEND, NEIGHBOR, OTHER
- **phoneNumber:** International format validation, not all same digit
- **email:** RFC 5322 format, no disposable domains (tempmail.com, throwaway.email, 10minutemail.com)
- **notificationChannels:** If provided, must be valid JSON array with values: sms, email, voice

#### OpenAPI Schema Component
```yaml
EmergencyContact:
  type: object
  properties:
    id:
      type: string
      format: uuid
    studentId:
      type: string
      format: uuid
    firstName:
      type: string
      minLength: 1
      maxLength: 100
    lastName:
      type: string
      minLength: 1
      maxLength: 100
    relationship:
      type: string
      enum: [PARENT, GUARDIAN, SIBLING, GRANDPARENT, AUNT_UNCLE, FAMILY_FRIEND, NEIGHBOR, OTHER]
    phoneNumber:
      type: string
      minLength: 10
      maxLength: 20
      description: International phone format
    email:
      type: string
      format: email
      nullable: true
      maxLength: 255
    address:
      type: string
      nullable: true
      maxLength: 500
    priority:
      type: string
      enum: [PRIMARY, SECONDARY, EMERGENCY_ONLY]
    isActive:
      type: boolean
    preferredContactMethod:
      type: string
      enum: [SMS, EMAIL, VOICE, ANY]
      nullable: true
    verificationStatus:
      type: string
      enum: [UNVERIFIED, PENDING, VERIFIED, FAILED]
      nullable: true
    lastVerifiedAt:
      type: string
      format: date-time
      nullable: true
    notificationChannels:
      type: array
      items:
        type: string
        enum: [sms, email, voice]
      nullable: true
    canPickupStudent:
      type: boolean
      nullable: true
    notes:
      type: string
      nullable: true
      maxLength: 1000
    fullName:
      type: string
      readOnly: true
      description: Computed full name
    isPrimary:
      type: boolean
      readOnly: true
      description: Whether this is the primary contact
    isVerified:
      type: boolean
      readOnly: true
      description: Whether contact is verified
    createdAt:
      type: string
      format: date-time
    updatedAt:
      type: string
      format: date-time
  required:
    - id
    - studentId
    - firstName
    - lastName
    - relationship
    - phoneNumber
    - priority
    - isActive
```

---

### 4. medications

**Table Name:** `medications`
**Description:** Medication formulary catalog including controlled substances
**Security Level:** MEDIUM
**Auditable:** No (reference data)

#### Fields

| Field | Type | Required | Default | Constraints | OpenAPI Type | Sensitive | Notes |
|-------|------|----------|---------|-------------|--------------|-----------|-------|
| id | STRING (UUID) | Yes | UUIDV4 | PK | string (uuid) | No | Primary key |
| name | STRING | Yes | - | - | string | No | Brand/trade name |
| genericName | STRING | No | null | - | string | No | Generic/chemical name |
| dosageForm | STRING | Yes | - | - | string | No | Form (tablet, capsule, liquid, etc.) |
| strength | STRING | Yes | - | - | string | No | Dosage strength (e.g., "500mg", "10mg/5mL") |
| manufacturer | STRING | No | null | - | string | No | Pharmaceutical manufacturer |
| ndc | STRING | No | null | Unique | string | No | National Drug Code (11-digit) |
| isControlled | BOOLEAN | Yes | false | - | boolean | No | Controlled substance flag |
| deaSchedule | STRING(3) | No | null | I, II, III, IV, V | string (enum) | No | DEA Schedule classification |
| requiresWitness | BOOLEAN | Yes | false | - | boolean | No | Witness requirement for administration |
| createdAt | DATE | Yes | NOW | Auto | string (date-time) | No | Record creation |
| updatedAt | DATE | Yes | NOW | Auto | string (date-time) | No | Record update |

#### Relationships
- **1:N → StudentMedication:** Medication prescribed to students
- **1:N → MedicationInventory:** Medication stock tracking
- **1:N → MedicationLog:** Medication administration logs

#### Indexes
```sql
CREATE INDEX medications_name_idx ON medications(name);
CREATE INDEX medications_ndc_idx ON medications(ndc);
CREATE INDEX medications_isControlled_idx ON medications(isControlled);
CREATE INDEX medications_deaSchedule_idx ON medications(deaSchedule);
```

#### Validation Rules
- **deaSchedule:** If provided, must be 'I', 'II', 'III', 'IV', or 'V'
- **ndc:** If provided, must be unique (11-digit NDC code)

#### DEA Schedule Reference
- **Schedule I:** High abuse potential, no accepted medical use
- **Schedule II:** High abuse potential (morphine, oxycodone) - requires witness
- **Schedule III:** Moderate abuse potential (Tylenol with codeine)
- **Schedule IV:** Low abuse potential (Xanax, Valium)
- **Schedule V:** Lowest abuse potential (cough preparations)

#### OpenAPI Schema Component
```yaml
Medication:
  type: object
  properties:
    id:
      type: string
      format: uuid
    name:
      type: string
      description: Brand or trade name
    genericName:
      type: string
      nullable: true
      description: Generic or chemical name
    dosageForm:
      type: string
      description: Form (tablet, capsule, liquid, injection, etc.)
    strength:
      type: string
      description: Dosage strength (e.g., "500mg", "10mg/5mL")
    manufacturer:
      type: string
      nullable: true
      description: Pharmaceutical manufacturer
    ndc:
      type: string
      nullable: true
      description: National Drug Code (11-digit unique identifier)
    isControlled:
      type: boolean
      description: Whether medication is a controlled substance
    deaSchedule:
      type: string
      enum: [I, II, III, IV, V]
      nullable: true
      description: DEA Schedule classification for controlled substances
    requiresWitness:
      type: boolean
      description: Whether administration requires a witness (typically Schedule I-II)
    createdAt:
      type: string
      format: date-time
    updatedAt:
      type: string
      format: date-time
  required:
    - id
    - name
    - dosageForm
    - strength
    - isControlled
    - requiresWitness
```

---

## Healthcare Models

### 5. health_records

**Table Name:** `health_records`
**Description:** Comprehensive student health records including visits, diagnoses, treatments
**HIPAA Compliance:** Contains PHI - CRITICAL
**Security Level:** CRITICAL
**Auditable:** Yes (via `AuditableModel`)

#### Fields

| Field | Type | Required | Default | Constraints | OpenAPI Type | Sensitive | Notes |
|-------|------|----------|---------|-------------|--------------|-----------|-------|
| id | STRING (UUID) | Yes | UUIDV4 | PK | string (uuid) | No | Primary key |
| studentId | STRING | Yes | - | FK to students | string (uuid) | No | Associated student |
| recordType | ENUM(HealthRecordType) | Yes | - | 26 types | string (enum) | No | Record category |
| title | STRING | Yes | - | - | string | No | Brief summary |
| description | TEXT | Yes | - | - | string | Yes (PHI) | Detailed description |
| recordDate | DATE | Yes | - | - | string (date-time) | No | Event date |
| provider | STRING | No | null | - | string | Yes (PHI) | Healthcare provider name |
| providerNpi | STRING | No | null | 10 digits | string | No | National Provider Identifier |
| facility | STRING | No | null | - | string | Yes (PHI) | Healthcare facility |
| facilityNpi | STRING | No | null | - | string | No | Facility NPI |
| diagnosis | TEXT | No | null | - | string | Yes (PHI) | Medical diagnosis |
| diagnosisCode | STRING | No | null | ICD-10 format | string | No | ICD-10 code |
| treatment | TEXT | No | null | - | string | Yes (PHI) | Treatment provided |
| followUpRequired | BOOLEAN | Yes | false | - | boolean | No | Follow-up needed |
| followUpDate | DATE | No | null | - | string (date-time) | No | Scheduled follow-up |
| followUpCompleted | BOOLEAN | Yes | false | - | boolean | No | Follow-up completion |
| attachments | ARRAY(STRING) | Yes | [] | File paths/URLs | array | Yes (PHI) | Supporting documents |
| metadata | JSONB | No | null | - | object | No | Additional structured data |
| isConfidential | BOOLEAN | Yes | false | - | boolean | No | Sensitive info flag |
| notes | TEXT | No | null | - | string | Yes (PHI) | Additional notes |
| createdBy | STRING | No | null | UUID, FK to users | string (uuid) | No | Audit: creator |
| updatedBy | STRING | No | null | UUID, FK to users | string (uuid) | No | Audit: updater |
| createdAt | DATE | Yes | NOW | Auto | string (date-time) | No | Record creation |
| updatedAt | DATE | Yes | NOW | Auto | string (date-time) | No | Record update |

#### Relationships
- **N:1 ← Student:** Health record belongs to a student

#### Indexes
```sql
CREATE INDEX health_records_studentId_recordDate_idx ON health_records(studentId, recordDate);
CREATE INDEX health_records_recordType_recordDate_idx ON health_records(recordType, recordDate);
CREATE INDEX health_records_createdBy_idx ON health_records(createdBy);
CREATE INDEX health_records_followUpRequired_followUpDate_idx ON health_records(followUpRequired, followUpDate);
```

#### HealthRecordType Enum Values
```
CHECKUP, VACCINATION, ILLNESS, INJURY, SCREENING, PHYSICAL_EXAM, MENTAL_HEALTH, DENTAL, VISION, HEARING,
EXAMINATION, ALLERGY_DOCUMENTATION, CHRONIC_CONDITION_REVIEW, GROWTH_ASSESSMENT, VITAL_SIGNS_CHECK,
EMERGENCY_VISIT, FOLLOW_UP, CONSULTATION, DIAGNOSTIC_TEST, PROCEDURE, HOSPITALIZATION, SURGERY,
COUNSELING, THERAPY, NUTRITION, MEDICATION_REVIEW, IMMUNIZATION, LAB_RESULT, RADIOLOGY, OTHER
```

#### OpenAPI Schema Component
```yaml
HealthRecord:
  type: object
  properties:
    id:
      type: string
      format: uuid
    studentId:
      type: string
      format: uuid
    recordType:
      type: string
      enum: [CHECKUP, VACCINATION, ILLNESS, INJURY, SCREENING, PHYSICAL_EXAM, MENTAL_HEALTH, DENTAL, VISION, HEARING, EXAMINATION, ALLERGY_DOCUMENTATION, CHRONIC_CONDITION_REVIEW, GROWTH_ASSESSMENT, VITAL_SIGNS_CHECK, EMERGENCY_VISIT, FOLLOW_UP, CONSULTATION, DIAGNOSTIC_TEST, PROCEDURE, HOSPITALIZATION, SURGERY, COUNSELING, THERAPY, NUTRITION, MEDICATION_REVIEW, IMMUNIZATION, LAB_RESULT, RADIOLOGY, OTHER]
    title:
      type: string
      description: Brief summary of health record
    description:
      type: string
      description: Detailed description (PHI)
    recordDate:
      type: string
      format: date-time
      description: When health event occurred
    provider:
      type: string
      nullable: true
      description: Healthcare provider name (PHI)
    providerNpi:
      type: string
      nullable: true
      pattern: '^\d{10}$'
      description: National Provider Identifier (10 digits)
    facility:
      type: string
      nullable: true
      description: Healthcare facility name (PHI)
    facilityNpi:
      type: string
      nullable: true
      description: Facility NPI
    diagnosis:
      type: string
      nullable: true
      description: Medical diagnosis (PHI)
    diagnosisCode:
      type: string
      nullable: true
      description: ICD-10 diagnosis code
    treatment:
      type: string
      nullable: true
      description: Treatment provided (PHI)
    followUpRequired:
      type: boolean
      description: Whether follow-up is needed
    followUpDate:
      type: string
      format: date-time
      nullable: true
      description: Scheduled follow-up date
    followUpCompleted:
      type: boolean
      description: Follow-up completion status
    attachments:
      type: array
      items:
        type: string
        format: uri
      description: Supporting documents (PHI)
    metadata:
      type: object
      nullable: true
      description: Additional structured data
    isConfidential:
      type: boolean
      description: Sensitive information flag
    notes:
      type: string
      nullable: true
      description: Additional notes (PHI)
    createdAt:
      type: string
      format: date-time
    updatedAt:
      type: string
      format: date-time
  required:
    - id
    - studentId
    - recordType
    - title
    - description
    - recordDate
    - followUpRequired
    - followUpCompleted
    - attachments
    - isConfidential
```

---

### 6. appointments

**Table Name:** `appointments`
**Description:** Student health appointments with scheduling and status tracking
**HIPAA Compliance:** Contains PHI
**Security Level:** HIGH

#### Fields

| Field | Type | Required | Default | Constraints | OpenAPI Type | Sensitive | Notes |
|-------|------|----------|---------|-------------|--------------|-----------|-------|
| id | STRING (UUID) | Yes | UUIDV4 | PK | string (uuid) | No | Primary key |
| studentId | STRING | Yes | - | FK to students | string (uuid) | No | Associated student |
| nurseId | STRING | Yes | - | FK to users | string (uuid) | No | Assigned nurse |
| type | ENUM(AppointmentType) | Yes | - | 7 types | string (enum) | No | Appointment type |
| scheduledAt | DATE | Yes | - | Future, Business hours, Weekday | string (date-time) | No | Scheduled time |
| duration | INTEGER | Yes | 30 | 15-120, 15-min increments | integer | No | Duration in minutes |
| status | ENUM(AppointmentStatus) | Yes | SCHEDULED | 5 statuses | string (enum) | No | Appointment status |
| reason | STRING | Yes | - | 3-500 chars | string | Yes (PHI) | Appointment reason |
| notes | TEXT | No | null | Max 5000 chars | string | Yes (PHI) | Clinical notes |
| createdAt | DATE | Yes | NOW | Auto | string (date-time) | No | Record creation |
| updatedAt | DATE | Yes | NOW | Auto | string (date-time) | No | Record update |

#### Relationships
- **N:1 ← Student:** Appointment for a student
- **N:1 ← User (nurseId):** Appointment assigned to nurse
- **1:N → AppointmentReminder:** Appointment has reminders

#### Indexes
```sql
CREATE INDEX appointments_studentId_idx ON appointments(studentId);
CREATE INDEX appointments_nurseId_scheduledAt_idx ON appointments(nurseId, scheduledAt);
CREATE INDEX appointments_status_scheduledAt_idx ON appointments(status, scheduledAt);
```

#### Validation Rules
- **scheduledAt:** Must be future date (for new records), business hours (8 AM - 5 PM), weekdays only (Monday-Friday)
- **duration:** Must be 15-120 minutes in 15-minute increments (15, 30, 45, 60, 75, 90, 105, 120)
- **reason:** Must be 3-500 characters
- **notes:** Max 5000 characters

#### AppointmentType Enum
```
ROUTINE_CHECKUP, MEDICATION_ADMINISTRATION, INJURY_ASSESSMENT, ILLNESS_EVALUATION, FOLLOW_UP, SCREENING, EMERGENCY
```

#### AppointmentStatus Enum
```
SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW
```

#### Business Rules
- Appointments must be scheduled during business hours (8:00 AM - 5:00 PM)
- No weekend appointments (Monday-Friday only)
- Duration in 15-minute increments
- Minimum duration: 15 minutes (quick checks)
- Maximum duration: 120 minutes (comprehensive exams)

#### OpenAPI Schema Component
```yaml
Appointment:
  type: object
  properties:
    id:
      type: string
      format: uuid
    studentId:
      type: string
      format: uuid
    nurseId:
      type: string
      format: uuid
    type:
      type: string
      enum: [ROUTINE_CHECKUP, MEDICATION_ADMINISTRATION, INJURY_ASSESSMENT, ILLNESS_EVALUATION, FOLLOW_UP, SCREENING, EMERGENCY]
    scheduledAt:
      type: string
      format: date-time
      description: Scheduled appointment time (8 AM - 5 PM, weekdays)
    duration:
      type: integer
      minimum: 15
      maximum: 120
      multipleOf: 15
      description: Duration in minutes (15-minute increments)
    status:
      type: string
      enum: [SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW]
    reason:
      type: string
      minLength: 3
      maxLength: 500
      description: Reason for appointment (PHI)
    notes:
      type: string
      nullable: true
      maxLength: 5000
      description: Clinical notes (PHI)
    createdAt:
      type: string
      format: date-time
    updatedAt:
      type: string
      format: date-time
  required:
    - id
    - studentId
    - nurseId
    - type
    - scheduledAt
    - duration
    - status
    - reason
```

---

### 7. allergies

**Table Name:** `allergies`
**Description:** Student allergy tracking with emergency protocols and EpiPen management
**HIPAA Compliance:** Contains PHI - CRITICAL for safety
**Security Level:** CRITICAL
**Auditable:** Yes (via `AuditableModel`)

#### Fields

| Field | Type | Required | Default | Constraints | OpenAPI Type | Sensitive | Notes |
|-------|------|----------|---------|-------------|--------------|-----------|-------|
| id | STRING (UUID) | Yes | UUIDV4 | PK | string (uuid) | No | Primary key |
| studentId | STRING | Yes | - | FK to students | string (uuid) | No | Associated student |
| allergen | STRING | Yes | - | - | string | Yes (PHI) | Allergen name |
| allergyType | ENUM(AllergyType) | Yes | OTHER | 9 types | string (enum) | No | Allergy category |
| severity | ENUM(AllergySeverity) | Yes | - | 4 levels | string (enum) | No | Severity level |
| symptoms | TEXT | No | null | - | string | Yes (PHI) | Known symptoms |
| reactions | JSONB | No | null | - | object | Yes (PHI) | Structured reaction data |
| treatment | TEXT | No | null | - | string | Yes (PHI) | Standard treatment |
| emergencyProtocol | TEXT | No | null | - | string | Yes (PHI) | Emergency response |
| onsetDate | DATE | No | null | - | string (date) | No | Allergy onset date |
| diagnosedDate | DATE | No | null | - | string (date) | No | Diagnosis date |
| diagnosedBy | STRING | No | null | - | string | No | Diagnosing provider |
| verified | BOOLEAN | Yes | false | - | boolean | No | Medical verification |
| verifiedBy | STRING | No | null | UUID | string (uuid) | No | Verifier user ID |
| verificationDate | DATE | No | null | - | string (date-time) | No | Verification date |
| active | BOOLEAN | Yes | true | - | boolean | No | Active status |
| notes | TEXT | No | null | - | string | Yes (PHI) | Additional notes |
| epiPenRequired | BOOLEAN | Yes | false | - | boolean | No | EpiPen requirement |
| epiPenLocation | STRING | No | null | - | string | No | EpiPen storage location |
| epiPenExpiration | DATE | No | null | - | string (date) | No | EpiPen expiration |
| healthRecordId | STRING | No | null | UUID | string (uuid) | No | Related health record |
| createdBy | STRING | No | null | UUID | string (uuid) | No | Audit: creator |
| updatedBy | STRING | No | null | UUID | string (uuid) | No | Audit: updater |
| createdAt | DATE | Yes | NOW | Auto | string (date-time) | No | Record creation |
| updatedAt | DATE | Yes | NOW | Auto | string (date-time) | No | Record update |

#### Relationships
- **N:1 ← Student:** Allergy belongs to a student
- **N:1 ← HealthRecord (optional):** Allergy may link to health record

#### Indexes
```sql
CREATE INDEX allergies_studentId_active_idx ON allergies(studentId, active);
CREATE INDEX allergies_allergyType_severity_idx ON allergies(allergyType, severity);
CREATE INDEX allergies_epiPenExpiration_idx ON allergies(epiPenExpiration);
```

#### AllergyType Enum
```
FOOD, MEDICATION, ENVIRONMENTAL, INSECT, LATEX, ANIMAL, CHEMICAL, SEASONAL, OTHER
```

#### AllergySeverity Enum
```
MILD, MODERATE, SEVERE, LIFE_THREATENING
```

#### OpenAPI Schema Component
```yaml
Allergy:
  type: object
  properties:
    id:
      type: string
      format: uuid
    studentId:
      type: string
      format: uuid
    allergen:
      type: string
      description: Name of allergen (PHI)
    allergyType:
      type: string
      enum: [FOOD, MEDICATION, ENVIRONMENTAL, INSECT, LATEX, ANIMAL, CHEMICAL, SEASONAL, OTHER]
    severity:
      type: string
      enum: [MILD, MODERATE, SEVERE, LIFE_THREATENING]
    symptoms:
      type: string
      nullable: true
      description: Known symptoms and reactions (PHI)
    reactions:
      type: object
      nullable: true
      description: Structured reaction data (PHI)
    treatment:
      type: string
      nullable: true
      description: Standard treatment protocol (PHI)
    emergencyProtocol:
      type: string
      nullable: true
      description: Emergency response procedures (PHI)
    onsetDate:
      type: string
      format: date
      nullable: true
      description: Date when allergy first appeared
    diagnosedDate:
      type: string
      format: date
      nullable: true
      description: Date of medical diagnosis
    diagnosedBy:
      type: string
      nullable: true
      description: Healthcare provider who diagnosed
    verified:
      type: boolean
      description: Medical verification status
    verifiedBy:
      type: string
      format: uuid
      nullable: true
      description: User ID who verified
    verificationDate:
      type: string
      format: date-time
      nullable: true
      description: Verification timestamp
    active:
      type: boolean
      description: Allergy active status
    notes:
      type: string
      nullable: true
      description: Additional notes (PHI)
    epiPenRequired:
      type: boolean
      description: Whether student needs EpiPen access
    epiPenLocation:
      type: string
      nullable: true
      description: Where EpiPen is stored
    epiPenExpiration:
      type: string
      format: date
      nullable: true
      description: EpiPen expiration date for monitoring
    healthRecordId:
      type: string
      format: uuid
      nullable: true
      description: Related health record reference
    createdAt:
      type: string
      format: date-time
    updatedAt:
      type: string
      format: date-time
  required:
    - id
    - studentId
    - allergen
    - allergyType
    - severity
    - verified
    - active
    - epiPenRequired
```

---

## Medication Models

### 8. student_medications

**Table Name:** `student_medications`
**Description:** Medication prescriptions assigned to students
**HIPAA Compliance:** Contains PHI - Prescription information
**Security Level:** CRITICAL
**Auditable:** Yes (via `AuditableModel`)

#### Fields

| Field | Type | Required | Default | Constraints | OpenAPI Type | Sensitive | Notes |
|-------|------|----------|---------|-------------|--------------|-----------|-------|
| id | STRING (UUID) | Yes | UUIDV4 | PK | string (uuid) | No | Primary key |
| studentId | STRING | Yes | - | FK to students, CASCADE | string (uuid) | No | Associated student |
| medicationId | STRING | Yes | - | FK to medications | string (uuid) | No | Medication reference |
| dosage | STRING | Yes | - | - | string | Yes (PHI) | Medication dosage |
| frequency | STRING | Yes | - | - | string | Yes (PHI) | Administration frequency |
| route | STRING | Yes | - | - | string | Yes (PHI) | Administration route |
| instructions | TEXT | No | null | - | string | Yes (PHI) | Special instructions |
| startDate | DATE | Yes | - | - | string (date) | No | Regimen start date |
| endDate | DATE | No | null | - | string (date) | No | Regimen end date (null = ongoing) |
| isActive | BOOLEAN | Yes | true | - | boolean | No | Prescription status |
| prescribedBy | STRING | Yes | - | - | string | Yes (PHI) | Prescribing provider |
| prescriptionNumber | STRING | No | null | - | string | Yes (PHI) | Rx number |
| refillsRemaining | INTEGER | No | 0 | 0-12 | integer | No | Refills remaining |
| createdBy | STRING | No | null | UUID | string (uuid) | No | Audit: creator |
| updatedBy | STRING | No | null | UUID | string (uuid) | No | Audit: updater |
| createdAt | DATE | Yes | NOW | Auto | string (date-time) | No | Record creation |
| updatedAt | DATE | Yes | NOW | Auto | string (date-time) | No | Record update |

#### Computed Properties (Not in DB)
- **isCurrentlyActive:** Checks if medication is active based on dates and isActive flag (boolean)
- **daysRemaining:** Calculates days until endDate (integer | null)

#### Relationships
- **N:1 ← Student:** Prescription belongs to a student (CASCADE delete)
- **N:1 ← Medication:** Prescription references medication formulary
- **1:N → MedicationLog:** Prescription has administration logs

#### Indexes
```sql
CREATE INDEX student_medications_studentId_idx ON student_medications(studentId);
CREATE INDEX student_medications_medicationId_idx ON student_medications(medicationId);
CREATE INDEX student_medications_isActive_idx ON student_medications(isActive);
CREATE INDEX student_medications_startDate_idx ON student_medications(startDate);
CREATE INDEX student_medications_endDate_idx ON student_medications(endDate);
CREATE INDEX student_medications_studentId_isActive_idx ON student_medications(studentId, isActive);
CREATE INDEX student_medications_createdBy_idx ON student_medications(createdBy);
```

#### Validation Rules
- **refillsRemaining:** Min: 0, Max: 12

#### OpenAPI Schema Component
```yaml
StudentMedication:
  type: object
  properties:
    id:
      type: string
      format: uuid
    studentId:
      type: string
      format: uuid
    medicationId:
      type: string
      format: uuid
    dosage:
      type: string
      description: Medication dosage (e.g., "10mg", "2 tablets") (PHI)
    frequency:
      type: string
      description: Administration frequency (e.g., "Once daily", "Twice daily") (PHI)
    route:
      type: string
      description: Administration route (e.g., "Oral", "Topical", "Injection") (PHI)
    instructions:
      type: string
      nullable: true
      description: Special instructions for administration (PHI)
    startDate:
      type: string
      format: date
      description: Date when medication regimen begins
    endDate:
      type: string
      format: date
      nullable: true
      description: Date when medication regimen ends (null for ongoing)
    isActive:
      type: boolean
      description: Whether prescription is currently active
    prescribedBy:
      type: string
      description: Name of prescribing healthcare provider (PHI)
    prescriptionNumber:
      type: string
      nullable: true
      description: Prescription number for tracking (PHI)
    refillsRemaining:
      type: integer
      minimum: 0
      maximum: 12
      nullable: true
      description: Number of refills remaining
    isCurrentlyActive:
      type: boolean
      readOnly: true
      description: Computed - whether medication is currently active based on dates
    daysRemaining:
      type: integer
      readOnly: true
      nullable: true
      description: Computed - days remaining in regimen
    createdAt:
      type: string
      format: date-time
    updatedAt:
      type: string
      format: date-time
  required:
    - id
    - studentId
    - medicationId
    - dosage
    - frequency
    - route
    - startDate
    - isActive
    - prescribedBy
```

---

## Security & RBAC Models

### 9. roles

**Table Name:** `roles`
**Description:** Role definitions for role-based access control (RBAC)
**Security Level:** CRITICAL

#### Fields

| Field | Type | Required | Default | Constraints | OpenAPI Type | Sensitive | Notes |
|-------|------|----------|---------|-------------|--------------|-----------|-------|
| id | STRING (UUID) | Yes | UUIDV4 | PK | string (uuid) | No | Primary key |
| name | STRING | Yes | - | Unique, 2-100 chars, Alphanumeric+spaces+hyphens+underscores | string | No | Role name |
| description | TEXT | No | null | Max 1000 chars | string | No | Role description |
| isSystem | BOOLEAN | Yes | false | - | boolean | No | System role protection |
| createdAt | DATE | Yes | NOW | Auto | string (date-time) | No | Record creation |
| updatedAt | DATE | Yes | NOW | Auto | string (date-time) | No | Record update |

#### Relationships
- **1:N → RolePermission:** Role has multiple permissions (M:N via junction)
- **1:N → UserRoleAssignment:** Role assigned to multiple users (M:N via junction)

#### Indexes
```sql
CREATE UNIQUE INDEX roles_name_unique ON roles(name);
CREATE INDEX roles_isSystem_idx ON roles(isSystem);
```

#### Validation Rules
- **name:** 2-100 characters, alphanumeric with spaces, hyphens, underscores
- **name (reserved):** Cannot use: SYSTEM, ROOT, SUPERADMIN, SUPERUSER
- **description:** Max 1000 characters

#### OpenAPI Schema Component
```yaml
Role:
  type: object
  properties:
    id:
      type: string
      format: uuid
    name:
      type: string
      minLength: 2
      maxLength: 100
      pattern: '^[a-zA-Z0-9\s\-_]+$'
      description: Unique role name
    description:
      type: string
      nullable: true
      maxLength: 1000
      description: Role description
    isSystem:
      type: boolean
      description: System roles cannot be deleted
    createdAt:
      type: string
      format: date-time
    updatedAt:
      type: string
      format: date-time
  required:
    - id
    - name
    - isSystem
```

---

## Field Exclusion Guidelines

### Security Exclusions (NEVER expose in API responses)

These fields contain security-sensitive information and must **NEVER** be included in API responses:

#### User Model
- `password` - Bcrypt hashed password
- `passwordResetToken` - Password reset token
- `passwordResetExpires` - Password reset expiration
- `emailVerificationToken` - Email verification token
- `emailVerificationExpires` - Email verification expiration
- `twoFactorSecret` - TOTP 2FA secret (encrypted at rest)

#### Best Practice
Use the `User.toSafeObject()` method which automatically excludes these fields:
```typescript
// Safe API response
res.json({ user: user.toSafeObject() });
```

### PHI (Protected Health Information) Access Control

Fields containing PHI should have restricted access based on user roles and permissions. Consider implementing field-level access control:

#### High-Sensitivity PHI Fields
- Patient names (firstName, lastName)
- Date of birth (dateOfBirth)
- Medical record numbers (medicalRecordNum)
- Diagnosis information (diagnosis, diagnosisCode)
- Treatment details (treatment, emergencyProtocol)
- Medication information (dosage, frequency, prescribedBy, prescriptionNumber)
- Clinical notes (notes, description, reason)
- Allergy information (allergen, symptoms, reactions)
- Contact information (phoneNumber, email, address)

#### PHI Access Levels
1. **Full Access:** Nurses, healthcare providers with patient assignment
2. **Limited Access:** School administrators (summary data only)
3. **No Access:** Viewers, unassigned staff

### Audit Field Handling

Audit fields (`createdBy`, `updatedBy`) should be:
- **Readable:** Included in API responses for audit trail visibility
- **Not Writable:** Automatically populated by system, never set by client
- **User-Friendly:** Consider joining with `users` table to return creator/updater names

---

## OpenAPI Schema Components

### Complete Schema Export for Swagger

Below is a template for organizing schemas in your OpenAPI specification:

```yaml
components:
  schemas:
    # Core Models
    User:
      # See section 1 above
    UserCreate:
      # See section 1 above
    UserUpdate:
      # Similar to UserCreate but all fields optional

    Student:
      # See section 2 above
    StudentCreate:
      # See section 2 above
    StudentUpdate:
      # Similar to StudentCreate but all fields optional

    EmergencyContact:
      # See section 3 above
    EmergencyContactCreate:
      # Similar pattern

    # Healthcare Models
    HealthRecord:
      # See section 5 above
    HealthRecordCreate:
      # Create variant

    Appointment:
      # See section 6 above
    AppointmentCreate:
      # Create variant

    Allergy:
      # See section 7 above
    AllergyCreate:
      # Create variant

    # Medication Models
    Medication:
      # See section 4 above
    MedicationCreate:
      # Create variant

    StudentMedication:
      # See section 8 above
    StudentMedicationCreate:
      # Create variant

    # Security Models
    Role:
      # See section 9 above
    Permission:
      # Similar pattern

    # Common Response Schemas
    PaginatedResponse:
      type: object
      properties:
        data:
          type: array
          items: {}
        pagination:
          type: object
          properties:
            page:
              type: integer
              minimum: 1
            pageSize:
              type: integer
              minimum: 1
              maximum: 100
            totalPages:
              type: integer
            totalCount:
              type: integer
            hasMore:
              type: boolean
      required:
        - data
        - pagination

    ErrorResponse:
      type: object
      properties:
        error:
          type: object
          properties:
            code:
              type: string
              description: Error code
            message:
              type: string
              description: Human-readable error message
            details:
              type: object
              nullable: true
              description: Additional error details
            timestamp:
              type: string
              format: date-time
              description: Error timestamp
          required:
            - code
            - message
      required:
        - error

    ValidationErrorResponse:
      type: object
      properties:
        error:
          type: object
          properties:
            code:
              type: string
              enum: [VALIDATION_ERROR]
            message:
              type: string
            validationErrors:
              type: array
              items:
                type: object
                properties:
                  field:
                    type: string
                  message:
                    type: string
                  constraint:
                    type: string
      required:
        - error

  # Enum Definitions for Reusability
  parameters:
    PageParam:
      name: page
      in: query
      required: false
      schema:
        type: integer
        minimum: 1
        default: 1
      description: Page number

    PageSizeParam:
      name: pageSize
      in: query
      required: false
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 20
      description: Number of items per page

    SortParam:
      name: sort
      in: query
      required: false
      schema:
        type: string
      description: Sort field and direction (e.g., "createdAt:desc")
```

### Enum Reference for OpenAPI

All enums should be defined in a centralized location. Reference the `backend/src/database/types/enums.ts` file for the complete list of enums and their values.

Key enums include:
- UserRole
- Gender
- ContactPriority
- HealthRecordType (26 values)
- AllergyType, AllergySeverity
- AppointmentType, AppointmentStatus
- IncidentType, IncidentSeverity
- MessageType, MessagePriority, DeliveryStatus
- AuditAction
- ComplianceReportType, ComplianceStatus, ComplianceCategory
- And 40+ more...

---

## Database Relationship Summary

### Key Foreign Key Relationships

```
users (1) ───────> (N) students [nurseId]
students (1) ─────> (N) emergency_contacts [studentId]
students (1) ─────> (N) health_records [studentId]
students (1) ─────> (N) appointments [studentId]
students (1) ─────> (N) allergies [studentId]
students (1) ─────> (N) student_medications [studentId]
students (1) ─────> (N) vaccinations [studentId]
students (1) ─────> (N) chronic_conditions [studentId]
students (1) ─────> (N) vital_signs [studentId]
students (1) ─────> (N) growth_measurements [studentId]
students (1) ─────> (N) screenings [studentId]

medications (1) ──> (N) student_medications [medicationId]
student_medications (1) ──> (N) medication_logs [studentMedicationId]

users (1) ────────> (N) appointments [nurseId]
users (1) ────────> (N) user_role_assignments [userId]
roles (1) ────────> (N) user_role_assignments [roleId]
roles (1) ────────> (N) role_permissions [roleId]
permissions (1) ──> (N) role_permissions [permissionId]

districts (1) ────> (N) schools [districtId]
schools (1) ──────> (N) users [schoolId]
```

### Junction Tables (Many-to-Many)

- **user_role_assignments:** Users ↔ Roles (RBAC multi-role support)
- **role_permissions:** Roles ↔ Permissions (permission aggregation)
- **document_signatures:** Documents ↔ Users (signature workflow)

---

## Migration and Schema Evolution

### Current Migration Status
- **Last Migration:** `20251011170704-add-document-validation-constraints.js`
- **Migration Directory:** `backend/src/database/migrations/`
- **Migration Strategy:** Sequential numbered migrations with rollback support

### Schema Change Process
1. Create new migration file in `migrations/` directory
2. Define `up` (apply changes) and `down` (rollback) functions
3. Test migration in development environment
4. Apply to staging for validation
5. Deploy to production with backup verification

### Data Integrity Enforcement
- Foreign key constraints with CASCADE/RESTRICT policies
- NOT NULL constraints on required fields
- UNIQUE constraints on business identifiers
- CHECK constraints for value validation
- Database-level enum enforcement via PostgreSQL ENUM types

---

## Performance Optimization Notes

### Indexing Strategy
- **Primary Keys:** All tables use UUID primary keys (indexed automatically)
- **Foreign Keys:** All foreign key columns have indexes for join optimization
- **Composite Indexes:** Multi-column indexes for common query patterns
  - Example: `students(lastName, firstName)` for name searches
  - Example: `appointments(nurseId, scheduledAt)` for nurse schedule queries
  - Example: `health_records(studentId, recordDate)` for chronological health history

### Query Performance
- **Connection Pooling:** Min 5, Max 20 connections for optimal concurrency
- **Statement Timeout:** 30 seconds (reduced from 60s for faster failure detection)
- **Slow Query Logging:** Queries >1000ms logged as warnings, >5000ms as errors
- **Pagination:** Always use `LIMIT` and `OFFSET` for large result sets

### Caching Recommendations
- **Reference Data:** Cache medications, roles, permissions (low change frequency)
- **User Sessions:** Redis cache for active sessions
- **Frequently Accessed Records:** Consider Redis for student demographic data (non-PHI)

---

## Compliance and Audit Trail

### HIPAA Compliance Features
- **Audit Logging:** All PHI access logged via `AuditableModel` hooks
- **Field-Level Tracking:** `createdBy`, `updatedBy` capture user accountability
- **Access Control:** Role-based permissions restrict PHI access
- **Encryption:** Sensitive fields (2FA secrets) encrypted at rest
- **Data Retention:** 7-year retention policy for all health records

### AuditableModel Implementation
Models with `AuditableModel.setupAuditHooks()` automatically log:
- **CREATE:** New record creation with initial values
- **UPDATE:** Field changes (before/after snapshots)
- **DELETE:** Record deletion with final state

Audited Models:
- `students`, `health_records`, `allergies`, `student_medications`, `vaccinations`,
  `chronic_conditions`, `vital_signs`, `growth_measurements`, `screenings`

### Audit Log Structure
```typescript
{
  timestamp: ISO8601,
  entityType: "Student" | "HealthRecord" | "Allergy" | ...,
  action: "CREATE" | "UPDATE" | "DELETE",
  entityId: UUID,
  userId: UUID,
  changes: {
    old: { ... },  // For UPDATE/DELETE
    new: { ... }   // For CREATE/UPDATE
  }
}
```

---

## Additional Models (Summary)

Due to space constraints, the following models follow similar patterns to those documented above. Refer to their Sequelize model files for detailed field definitions:

### Healthcare (Continued)
- **vaccinations:** Immunization records with lot numbers, expiration tracking
- **chronic_conditions:** Long-term health condition management
- **vital_signs:** Blood pressure, temperature, pulse, respiratory rate tracking
- **growth_measurements:** Height, weight, BMI, head circumference
- **screenings:** Vision, hearing, dental, scoliosis, BMI screenings

### Medication (Continued)
- **medication_inventory:** Stock tracking, expiration monitoring
- **medication_logs:** Administration logs with witnesses for controlled substances

### Incidents
- **incident_reports:** Injury, illness, behavioral, medication error reports
- **witness_statements:** Witness accounts of incidents
- **follow_up_actions:** Post-incident action tracking

### Communication
- **messages:** Email, SMS, push notification, voice messages
- **message_deliveries:** Delivery status tracking per recipient
- **message_templates:** Reusable message templates

### Compliance
- **audit_logs:** Comprehensive audit trail (manual logs)
- **compliance_reports:** HIPAA, FERPA, state health compliance reports
- **compliance_checklist_items:** Checklist item tracking
- **consent_forms:** Medical treatment, medication, emergency care consents
- **consent_signatures:** Digital signature capture
- **policy_documents:** Policy management
- **policy_acknowledgments:** Staff policy acknowledgment tracking

### Security
- **permissions:** Permission definitions
- **role_permissions:** Role-permission assignments (M:N junction)
- **user_role_assignments:** User-role assignments (M:N junction)
- **sessions:** Active user sessions
- **login_attempts:** Login attempt tracking for security
- **security_incidents:** Security event tracking
- **ip_restrictions:** IP whitelist/blacklist

### Documents
- **documents:** Document metadata and storage
- **document_audit_trails:** Document access auditing
- **document_signatures:** Digital signature workflow

### Administration
- **districts:** School district information
- **schools:** School information
- **system_configurations:** Application configuration (key-value store)
- **configuration_history:** Configuration change history
- **backup_logs:** Automated backup tracking
- **performance_metrics:** System performance monitoring
- **licenses:** License management
- **training_modules:** Staff training content
- **training_completions:** Training completion tracking

### Inventory & Budget
- **inventory_items:** Medical supplies, equipment tracking
- **inventory_transactions:** Stock movements (purchase, usage, disposal)
- **maintenance_logs:** Equipment maintenance tracking
- **vendors:** Vendor information
- **purchase_orders:** Purchase order management
- **purchase_order_items:** Line items for purchase orders
- **budget_categories:** Budget category definitions
- **budget_transactions:** Budget allocation and spending

### Integration
- **integration_configs:** External system integration settings (SIS, EHR, pharmacy)
- **integration_logs:** Integration sync logs and error tracking

---

## Conclusion

This comprehensive mapping provides a foundation for accurate OpenAPI schema generation. Key takeaways:

1. **Consistency:** All models use UUID primary keys, timestamps, and follow similar patterns
2. **Security:** Sensitive fields (passwords, tokens, secrets) must be excluded from API responses
3. **PHI Protection:** Healthcare data requires strict access control and audit logging
4. **Validation:** Database constraints should be mirrored in OpenAPI schema validations
5. **Relationships:** Foreign keys and associations provide rich data retrieval capabilities
6. **Audit Trail:** HIPAA-compliant audit logging tracks all PHI modifications

### Next Steps
1. Generate OpenAPI schemas based on these mappings
2. Implement field-level access control for PHI in API layer
3. Add pagination, filtering, and sorting to list endpoints
4. Create comprehensive API documentation with examples
5. Implement API versioning strategy for schema evolution

---

**Document Version:** 1.0
**Last Updated:** 2025-10-23
**Maintained By:** Database Architecture Team
**Review Cycle:** Quarterly or after major schema changes
