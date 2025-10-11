# Sequelize Migration Changelog

Complete changelog of all database schema changes in chronological order.

---

## Migration 1: Initial Database Schema
**File:** `20241002000000-init-database-schema.js`
**Status:** Pre-existing
**Date:** 2024-10-02

### Enums Created (40)
- UserRole (ADMIN, NURSE, SCHOOL_ADMIN, DISTRICT_ADMIN)
- Gender (MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY)
- ContactPriority (PRIMARY, SECONDARY, EMERGENCY_ONLY)
- HealthRecordType (CHECKUP, VACCINATION, ILLNESS, INJURY, SCREENING, PHYSICAL_EXAM, MENTAL_HEALTH, DENTAL, VISION, HEARING)
- AllergySeverity (MILD, MODERATE, SEVERE, LIFE_THREATENING)
- AppointmentType (ROUTINE_CHECKUP, MEDICATION_ADMINISTRATION, INJURY_ASSESSMENT, ILLNESS_EVALUATION, FOLLOW_UP, SCREENING, EMERGENCY)
- AppointmentStatus (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW)
- IncidentType (INJURY, ILLNESS, BEHAVIORAL, MEDICATION_ERROR, ALLERGIC_REACTION, EMERGENCY, OTHER)
- IncidentSeverity (LOW, MEDIUM, HIGH, CRITICAL)
- InventoryTransactionType (PURCHASE, USAGE, ADJUSTMENT, TRANSFER, DISPOSAL)
- MaintenanceType (ROUTINE, REPAIR, CALIBRATION, INSPECTION, CLEANING)
- MessageType (EMAIL, SMS, PUSH_NOTIFICATION, VOICE)
- MessageCategory (EMERGENCY, HEALTH_UPDATE, APPOINTMENT_REMINDER, MEDICATION_REMINDER, GENERAL, INCIDENT_NOTIFICATION, COMPLIANCE)
- MessagePriority (LOW, MEDIUM, HIGH, URGENT)
- RecipientType (STUDENT, EMERGENCY_CONTACT, PARENT, NURSE, ADMIN)
- DeliveryStatus (PENDING, SENT, DELIVERED, FAILED, BOUNCED)
- WitnessType (STUDENT, STAFF, PARENT, OTHER)
- InsuranceClaimStatus (NOT_FILED, FILED, PENDING, APPROVED, DENIED, CLOSED)
- ComplianceStatus (PENDING, COMPLIANT, NON_COMPLIANT, UNDER_REVIEW)
- ActionPriority (LOW, MEDIUM, HIGH, URGENT)
- ActionStatus (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
- PurchaseOrderStatus (PENDING, APPROVED, ORDERED, PARTIALLY_RECEIVED, RECEIVED, CANCELLED)
- WaitlistPriority (LOW, NORMAL, HIGH, URGENT)
- WaitlistStatus (WAITING, NOTIFIED, SCHEDULED, EXPIRED, CANCELLED)
- ReminderStatus (SCHEDULED, SENT, FAILED, CANCELLED)
- ConfigCategory (GENERAL, SECURITY, NOTIFICATION, INTEGRATION, BACKUP, PERFORMANCE)
- BackupType (AUTOMATIC, MANUAL, SCHEDULED)
- BackupStatus (IN_PROGRESS, COMPLETED, FAILED)
- MetricType (CPU_USAGE, MEMORY_USAGE, DISK_USAGE, API_RESPONSE_TIME, DATABASE_QUERY_TIME, ACTIVE_USERS, ERROR_RATE, REQUEST_COUNT)
- LicenseType (TRIAL, BASIC, PROFESSIONAL, ENTERPRISE)
- LicenseStatus (ACTIVE, EXPIRED, SUSPENDED, CANCELLED)
- TrainingCategory (HIPAA_COMPLIANCE, MEDICATION_MANAGEMENT, EMERGENCY_PROCEDURES, SYSTEM_TRAINING, SAFETY_PROTOCOLS, DATA_SECURITY)
- AuditAction (CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT, EXPORT, IMPORT, BACKUP, RESTORE)
- IntegrationType (SIS, EHR, PHARMACY, LABORATORY, INSURANCE, PARENT_PORTAL, HEALTH_APP, GOVERNMENT_REPORTING)
- IntegrationStatus (ACTIVE, INACTIVE, ERROR, TESTING, SYNCING)
- DocumentCategory (MEDICAL_RECORD, INCIDENT_REPORT, CONSENT_FORM, POLICY, TRAINING, ADMINISTRATIVE, STUDENT_FILE, INSURANCE, OTHER)
- DocumentStatus (DRAFT, PENDING_REVIEW, APPROVED, ARCHIVED, EXPIRED)
- DocumentAccessLevel (PUBLIC, STAFF_ONLY, ADMIN_ONLY, RESTRICTED)
- DocumentAction (CREATED, VIEWED, DOWNLOADED, UPDATED, DELETED, SHARED, SIGNED)
- ComplianceReportType (HIPAA, FERPA, STATE_HEALTH, MEDICATION_AUDIT, SAFETY_INSPECTION, TRAINING_COMPLIANCE, DATA_PRIVACY, CUSTOM)
- ComplianceCategory (PRIVACY, SECURITY, DOCUMENTATION, TRAINING, SAFETY, MEDICATION, HEALTH_RECORDS, CONSENT)
- ChecklistItemStatus (PENDING, IN_PROGRESS, COMPLETED, NOT_APPLICABLE, FAILED)
- ConsentType (MEDICAL_TREATMENT, MEDICATION_ADMINISTRATION, EMERGENCY_CARE, PHOTO_RELEASE, DATA_SHARING, TELEHEALTH, RESEARCH, OTHER)
- PolicyCategory (HIPAA, FERPA, MEDICATION, EMERGENCY, SAFETY, DATA_SECURITY, OPERATIONAL, TRAINING)
- PolicyStatus (DRAFT, UNDER_REVIEW, ACTIVE, ARCHIVED, SUPERSEDED)
- SecurityIncidentType (UNAUTHORIZED_ACCESS, DATA_BREACH, FAILED_LOGIN_ATTEMPTS, SUSPICIOUS_ACTIVITY, MALWARE, PHISHING, POLICY_VIOLATION, OTHER)
- SecurityIncidentStatus (OPEN, INVESTIGATING, CONTAINED, RESOLVED, CLOSED)
- IpRestrictionType (WHITELIST, BLACKLIST)

### Tables Created (5)
1. **districts**
   - id (PK)
   - name
   - code (unique)
   - address, city, state, zipCode
   - phone, email, website
   - isActive
   - createdAt, updatedAt

2. **schools**
   - id (PK)
   - name
   - code (unique)
   - address, city, state, zipCode
   - phone, email
   - principal
   - studentCount
   - isActive
   - districtId (FK → districts)
   - createdAt, updatedAt

3. **users**
   - id (PK)
   - email (unique)
   - password
   - firstName, lastName
   - role (UserRole enum)
   - isActive
   - lastLogin
   - createdAt, updatedAt

4. **students**
   - id (PK)
   - studentNumber (unique)
   - firstName, lastName
   - dateOfBirth
   - grade
   - gender (Gender enum)
   - photo
   - medicalRecordNum (unique)
   - isActive
   - enrollmentDate
   - nurseId (FK → users)
   - createdAt, updatedAt

5. **emergency_contacts**
   - id (PK)
   - firstName, lastName
   - relationship
   - phoneNumber
   - email
   - address
   - priority (ContactPriority enum)
   - isActive
   - studentId (FK → students, CASCADE)
   - createdAt, updatedAt

---

## Migration 2: Add Viewer and Counselor Roles
**File:** `20251003162519-add-viewer-counselor-roles.js`
**Date:** 2025-10-03

### Enum Changes
- **UserRole:** Added values
  - `VIEWER` - Read-only access to health records
  - `COUNSELOR` - Access to student mental health and counseling records

### Notes
- Enum value additions are one-way in PostgreSQL (cannot auto-rollback)
- No table structure changes
- Supports expanded access control patterns

---

## Migration 3: Add Administration Features
**File:** `20251009011130-add-administration-features.js`
**Date:** 2025-10-09

### Table: districts
**New Columns:**
- `description` (TEXT) - District description
- `phoneNumber` (TEXT) - Additional phone number field
- `status` (TEXT, default: 'Active') - District status
- `superintendent` (TEXT) - Superintendent name

### Table: schools
**New Columns:**
- `phoneNumber` (TEXT) - Additional phone number field
- `principalName` (TEXT) - Principal's name
- `schoolType` (TEXT, default: 'Elementary') - School type classification
- `status` (TEXT, default: 'Active') - School status
- `totalEnrollment` (INTEGER) - Total student enrollment count

### Table: users
**New Columns:**
- `schoolId` (TEXT, FK → schools) - User's assigned school
- `districtId` (TEXT, FK → districts) - User's assigned district

**New Indexes:**
- `users_schoolId_idx` - Index on schoolId
- `users_districtId_idx` - Index on districtId

### Use Cases
- Multi-district/multi-school deployment support
- Organizational hierarchy
- User assignment to specific locations
- Access control and data isolation

---

## Migration 4: Enhance System Configuration
**File:** `20251009013303-enhance-system-configuration.js`
**Date:** 2025-10-09

### New Enums
1. **ConfigValueType**
   - STRING, NUMBER, BOOLEAN, JSON, ARRAY, DATE, TIME, DATETIME, EMAIL, URL, COLOR, ENUM

2. **ConfigScope**
   - SYSTEM, DISTRICT, SCHOOL, USER

### Enum Extensions
**ConfigCategory:** Added values
- HEALTHCARE
- MEDICATION
- APPOINTMENTS
- UI
- QUERY
- FILE_UPLOAD
- RATE_LIMITING
- SESSION
- EMAIL
- SMS

### Table: system_configurations
**New Columns:**
- `valueType` (ConfigValueType enum, default: STRING) - Type validation and parsing
- `subCategory` (TEXT) - Additional categorization
- `defaultValue` (TEXT) - Default configuration value
- `validValues` (TEXT[]) - Enumerated valid values
- `minValue` (DOUBLE) - Minimum numeric value
- `maxValue` (DOUBLE) - Maximum numeric value
- `isEditable` (BOOLEAN, default: true) - Whether value can be changed via UI
- `requiresRestart` (BOOLEAN, default: false) - Whether change requires app restart
- `scope` (ConfigScope enum, default: SYSTEM) - Configuration scope level
- `scopeId` (TEXT) - District or School ID if scope is not SYSTEM
- `tags` (TEXT[]) - Tags for grouping and filtering
- `sortOrder` (INTEGER, default: 0) - Display sort order

**New Indexes:**
- `system_configurations_category_subCategory_idx` - Composite index
- `system_configurations_scope_scopeId_idx` - Composite index
- `system_configurations_tags_idx` - GIN index for array search

### New Table: configuration_history
**Purpose:** Audit trail for all configuration changes

**Columns:**
- `id` (PK)
- `configKey` (TEXT) - Configuration key
- `oldValue` (TEXT) - Previous value
- `newValue` (TEXT) - New value
- `changedBy` (TEXT) - User ID who made change
- `changedByName` (TEXT) - User's name for reference
- `changeReason` (TEXT) - Reason for change
- `ipAddress` (TEXT) - IP address of change
- `userAgent` (TEXT) - User agent string
- `configurationId` (TEXT, FK → system_configurations, CASCADE) - Reference to config
- `createdAt` (TIMESTAMP) - When change occurred

**Indexes:**
- `configuration_history_configKey_createdAt_idx`
- `configuration_history_changedBy_createdAt_idx`
- `configuration_history_configurationId_createdAt_idx`

### Use Cases
- Per-district/per-school configuration
- Configuration versioning and rollback
- Audit trail for compliance
- Advanced configuration management

---

## Migration 5: Complete Health Records Schema
**File:** `20251010000000-complete-health-records-schema.js`
**Date:** 2025-10-10

### New Enums (11)

1. **AllergyType**
   - FOOD, MEDICATION, ENVIRONMENTAL, INSECT, LATEX, ANIMAL, CHEMICAL, SEASONAL, OTHER

2. **ConditionSeverity**
   - MILD, MODERATE, SEVERE, CRITICAL

3. **ConditionStatus**
   - ACTIVE, MANAGED, RESOLVED, MONITORING, INACTIVE

4. **VaccineType**
   - COVID_19, FLU, MEASLES, MUMPS, RUBELLA, MMR, POLIO, HEPATITIS_A, HEPATITIS_B, VARICELLA, TETANUS, DIPHTHERIA, PERTUSSIS, TDAP, DTaP, HIB, PNEUMOCOCCAL, ROTAVIRUS, MENINGOCOCCAL, HPV, OTHER

5. **AdministrationSite**
   - ARM_LEFT, ARM_RIGHT, THIGH_LEFT, THIGH_RIGHT, DELTOID_LEFT, DELTOID_RIGHT, BUTTOCK_LEFT, BUTTOCK_RIGHT, ORAL, NASAL, OTHER

6. **AdministrationRoute**
   - INTRAMUSCULAR, SUBCUTANEOUS, INTRADERMAL, ORAL, INTRANASAL, INTRAVENOUS, OTHER

7. **VaccineComplianceStatus**
   - COMPLIANT, OVERDUE, PARTIALLY_COMPLIANT, EXEMPT, NON_COMPLIANT

8. **ScreeningType**
   - VISION, HEARING, SCOLIOSIS, DENTAL, BMI, BLOOD_PRESSURE, DEVELOPMENTAL, SPEECH, MENTAL_HEALTH, TUBERCULOSIS, LEAD, ANEMIA, OTHER

9. **ScreeningOutcome**
   - PASS, REFER, FAIL, INCONCLUSIVE, INCOMPLETE

10. **FollowUpStatus**
    - PENDING, SCHEDULED, COMPLETED, CANCELLED, OVERDUE, NOT_NEEDED

11. **ConsciousnessLevel**
    - ALERT, VERBAL, PAIN, UNRESPONSIVE, DROWSY, CONFUSED, LETHARGIC

### Enum Extensions
**HealthRecordType:** Added 20 new values
- EXAMINATION, ALLERGY_DOCUMENTATION, CHRONIC_CONDITION_REVIEW, GROWTH_ASSESSMENT, VITAL_SIGNS_CHECK, EMERGENCY_VISIT, FOLLOW_UP, CONSULTATION, DIAGNOSTIC_TEST, PROCEDURE, HOSPITALIZATION, SURGERY, COUNSELING, THERAPY, NUTRITION, MEDICATION_REVIEW, IMMUNIZATION, LAB_RESULT, RADIOLOGY, OTHER

### Table: health_records (Modified)
**Column Renames:**
- `type` → `recordType`
- `date` → `recordDate`

**New Columns:**
- `title` (TEXT) - Record title
- `provider` (TEXT) - Healthcare provider name
- `providerNpi` (TEXT) - National Provider Identifier
- `facility` (TEXT) - Healthcare facility name
- `facilityNpi` (TEXT) - Facility NPI
- `diagnosis` (TEXT) - Diagnosis description
- `diagnosisCode` (TEXT) - ICD-10 diagnosis code
- `treatment` (TEXT) - Treatment description
- `followUpRequired` (BOOLEAN) - Whether follow-up needed
- `followUpDate` (TIMESTAMP) - Scheduled follow-up date
- `followUpCompleted` (BOOLEAN) - Follow-up completion status
- `metadata` (JSONB) - Additional flexible data
- `isConfidential` (BOOLEAN) - Requires additional access controls
- `createdBy` (TEXT) - User ID who created record
- `updatedBy` (TEXT) - User ID who last updated

**Removed Columns:**
- `vital` (moved to dedicated vital_signs table)

**New Indexes:**
- `health_records_studentId_recordDate_idx`
- `health_records_recordType_recordDate_idx`
- `health_records_createdBy_idx`
- `health_records_followUpRequired_followUpDate_idx`

### Table: allergies (Modified)
**New Columns:**
- `allergyType` (AllergyType enum) - Type classification
- `symptoms` (TEXT) - Detailed symptom description
- `reactions` (JSONB) - Array of specific reactions
- `treatment` (TEXT) - Treatment protocol
- `emergencyProtocol` (TEXT) - Emergency response protocol
- `onsetDate` (TIMESTAMP) - When allergy first appeared
- `diagnosedDate` (TIMESTAMP) - Official diagnosis date
- `diagnosedBy` (TEXT) - Who diagnosed the allergy
- `verified` (BOOLEAN) - Verification status
- `verifiedBy` (TEXT) - User ID who verified
- `verificationDate` (TIMESTAMP) - Verification date
- `active` (BOOLEAN) - Whether allergy is still active
- `notes` (TEXT) - Additional notes
- `epiPenRequired` (BOOLEAN) - Whether EpiPen needed
- `epiPenLocation` (TEXT) - Where EpiPen is stored
- `epiPenExpiration` (TIMESTAMP) - EpiPen expiration date
- `healthRecordId` (TEXT, FK → health_records) - Related health record
- `createdBy` (TEXT) - Creator user ID
- `updatedBy` (TEXT) - Last updater user ID

**New Indexes:**
- `allergies_studentId_active_idx`
- `allergies_allergyType_severity_idx`
- `allergies_epiPenExpiration_idx`

### Table: chronic_conditions (Modified)
**New Columns:**
- `icdCode` (TEXT) - ICD-10 diagnosis code
- `diagnosedBy` (TEXT) - Healthcare provider
- `severity` (ConditionSeverity enum) - Condition severity
- `medications` (JSONB) - Related medication details
- `treatments` (TEXT) - Treatment protocols
- `accommodationsRequired` (BOOLEAN) - Whether accommodations needed
- `accommodationDetails` (TEXT) - Details of accommodations
- `emergencyProtocol` (TEXT) - Emergency action plan
- `actionPlan` (TEXT) - Care/management action plan
- `reviewFrequency` (TEXT) - Review schedule (e.g., "Every 6 months")
- `restrictions` (JSONB) - Activity/dietary/environmental restrictions
- `precautions` (JSONB) - Special precautions
- `triggers` (TEXT[]) - Known condition triggers
- `carePlan` (TEXT) - Detailed care plan
- `lastReviewDate` (TIMESTAMP) - Last review date
- `healthRecordId` (TEXT, FK → health_records) - Related health record
- `createdBy` (TEXT) - Creator user ID
- `updatedBy` (TEXT) - Last updater user ID

**Column Type Changes:**
- `status` - Converted to ConditionStatus enum

**New Indexes:**
- `chronic_conditions_studentId_status_idx`
- `chronic_conditions_severity_status_idx`
- `chronic_conditions_nextReviewDate_idx`

### New Table: vaccinations
**Purpose:** Comprehensive vaccination tracking with CDC compliance

**Columns:**
- `id` (PK)
- `vaccineName` (TEXT) - Vaccine name
- `vaccineType` (VaccineType enum) - Vaccine type
- `manufacturer` (TEXT) - Manufacturer name
- `lotNumber` (TEXT) - Batch/lot number
- `cvxCode` (TEXT) - CDC vaccine code
- `ndcCode` (TEXT) - National Drug Code
- `doseNumber` (INTEGER) - Dose in series (1, 2, 3, etc.)
- `totalDoses` (INTEGER) - Total doses in series
- `seriesComplete` (BOOLEAN) - Series completion status
- `administrationDate` (TIMESTAMP) - When administered
- `administeredBy` (TEXT) - Who administered
- `administeredByRole` (TEXT) - Administrator's role
- `facility` (TEXT) - Administration facility
- `siteOfAdministration` (AdministrationSite enum) - Body location
- `routeOfAdministration` (AdministrationRoute enum) - Administration method
- `dosageAmount` (TEXT) - Dosage given
- `expirationDate` (TIMESTAMP) - Vaccine expiration
- `nextDueDate` (TIMESTAMP) - Next dose due date
- `reactions` (TEXT) - Adverse reactions
- `adverseEvents` (JSONB) - Structured adverse event data
- `exemptionStatus` (BOOLEAN) - Exemption status
- `exemptionReason` (TEXT) - Reason for exemption
- `exemptionDocument` (TEXT) - URL to exemption documentation
- `complianceStatus` (VaccineComplianceStatus enum) - Compliance status
- `vfcEligibility` (BOOLEAN) - Vaccines for Children program eligibility
- `visProvided` (BOOLEAN) - Vaccine Information Statement provided
- `visDate` (TIMESTAMP) - When VIS provided
- `consentObtained` (BOOLEAN) - Consent obtained
- `consentBy` (TEXT) - Who provided consent
- `notes` (TEXT) - Additional notes
- `studentId` (TEXT, FK → students, CASCADE)
- `healthRecordId` (TEXT, FK → health_records)
- `createdBy`, `updatedBy`, `createdAt`, `updatedAt`

**Indexes:**
- `vaccinations_studentId_administrationDate_idx`
- `vaccinations_vaccineType_complianceStatus_idx`
- `vaccinations_nextDueDate_idx`
- `vaccinations_expirationDate_idx`

### New Table: screenings
**Purpose:** Health screening records (vision, hearing, scoliosis, etc.)

**Columns:**
- `id` (PK)
- `screeningType` (ScreeningType enum) - Type of screening
- `screeningDate` (TIMESTAMP) - When performed
- `screenedBy` (TEXT) - Who performed screening
- `screenedByRole` (TEXT) - Screener's role
- `results` (JSONB) - Detailed findings
- `outcome` (ScreeningOutcome enum) - Overall outcome
- `referralRequired` (BOOLEAN) - Referral needed
- `referralTo` (TEXT) - Specialist or facility
- `referralDate` (TIMESTAMP) - Referral date
- `referralReason` (TEXT) - Reason for referral
- `followUpRequired` (BOOLEAN) - Follow-up needed
- `followUpDate` (TIMESTAMP) - Follow-up date
- `followUpStatus` (FollowUpStatus enum) - Follow-up status
- `equipmentUsed` (TEXT) - Equipment used
- `testDetails` (JSONB) - Test-specific details
- `rightEye` (TEXT) - Vision: right eye results
- `leftEye` (TEXT) - Vision: left eye results
- `rightEar` (TEXT) - Hearing: right ear results
- `leftEar` (TEXT) - Hearing: left ear results
- `passedCriteria` (BOOLEAN) - Passed screening criteria
- `notes` (TEXT) - Additional notes
- `studentId` (TEXT, FK → students, CASCADE)
- `healthRecordId` (TEXT, FK → health_records)
- `createdBy`, `updatedBy`, `createdAt`, `updatedAt`

**Indexes:**
- `screenings_studentId_screeningDate_idx`
- `screenings_screeningType_outcome_idx`
- `screenings_referralRequired_followUpRequired_idx`
- `screenings_followUpDate_idx`

### New Table: growth_measurements
**Purpose:** Growth tracking (height, weight, BMI, percentiles)

**Columns:**
- `id` (PK)
- `measurementDate` (TIMESTAMP) - Measurement date
- `measuredBy` (TEXT) - Who measured
- `measuredByRole` (TEXT) - Measurer's role
- `height` (DECIMAL) - Height in cm
- `heightUnit` (TEXT, default: 'cm') - cm or in
- `weight` (DECIMAL) - Weight in kg
- `weightUnit` (TEXT, default: 'kg') - kg or lb
- `bmi` (DECIMAL) - Calculated BMI
- `bmiPercentile` (DECIMAL) - BMI percentile
- `headCircumference` (DECIMAL) - Head circumference (for young children)
- `heightPercentile` (DECIMAL) - Height percentile
- `weightPercentile` (DECIMAL) - Weight percentile
- `growthPercentiles` (JSONB) - Additional percentile data
- `nutritionalStatus` (TEXT) - Underweight, Normal, Overweight, Obese
- `concerns` (TEXT) - Growth concerns
- `notes` (TEXT) - Additional notes
- `studentId` (TEXT, FK → students, CASCADE)
- `healthRecordId` (TEXT, FK → health_records)
- `createdBy`, `updatedBy`, `createdAt`, `updatedAt`

**Indexes:**
- `growth_measurements_studentId_measurementDate_idx`
- `growth_measurements_measurementDate_idx`

### New Table: vital_signs
**Purpose:** Comprehensive vital signs measurements

**Columns:**
- `id` (PK)
- `measurementDate` (TIMESTAMP) - Measurement date
- `measuredBy` (TEXT) - Who measured
- `measuredByRole` (TEXT) - Measurer's role
- `temperature` (DECIMAL) - Body temperature
- `temperatureUnit` (TEXT, default: 'F') - F or C
- `temperatureSite` (TEXT) - Oral, Axillary, Tympanic, Temporal
- `bloodPressureSystolic` (INTEGER) - Systolic BP
- `bloodPressureDiastolic` (INTEGER) - Diastolic BP
- `bloodPressurePosition` (TEXT) - Sitting, Standing, Lying
- `heartRate` (INTEGER) - Beats per minute
- `heartRhythm` (TEXT) - Regular, Irregular
- `respiratoryRate` (INTEGER) - Breaths per minute
- `oxygenSaturation` (INTEGER) - O2 saturation (0-100%)
- `oxygenSupplemental` (BOOLEAN) - On supplemental oxygen
- `painLevel` (INTEGER) - Pain scale 0-10
- `painLocation` (TEXT) - Where pain is located
- `consciousness` (ConsciousnessLevel enum) - Level of consciousness
- `glucoseLevel` (DECIMAL) - Blood glucose mg/dL
- `peakFlow` (INTEGER) - For asthma patients, L/min
- `notes` (TEXT) - Additional notes
- `studentId` (TEXT, FK → students, CASCADE)
- `healthRecordId` (TEXT, FK → health_records)
- `appointmentId` (TEXT, FK → appointments)
- `createdBy`, `updatedBy`, `createdAt`, `updatedAt`

**Indexes:**
- `vital_signs_studentId_measurementDate_idx`
- `vital_signs_measurementDate_idx`
- `vital_signs_appointmentId_idx`

### Documentation
Added table and column comments for:
- HIPAA compliance context
- NPI (National Provider Identifier) explanation
- ICD-10 code usage
- CDC vaccine codes (CVX, NDC)
- VFC program eligibility
- VIS (Vaccine Information Statement) requirements

---

## Migration 6: Performance Indexes
**File:** `20251011000000-performance-indexes.js`
**Date:** 2025-10-11

### Purpose
Comprehensive performance optimization addressing N+1 query problems and missing indexes.

### Student-Related Indexes (4)
- `idx_students_school` - Partial index on schoolId (active only)
- `idx_students_nurse` - Partial index on nurseId (active only)
- `idx_students_grade_active` - Composite on grade, isActive
- `idx_students_search` - GIN full-text search index
- `idx_students_health_overview` - Composite for dashboard queries

### User-Related Indexes (4)
- `idx_users_school` - Partial index on schoolId (active only)
- `idx_users_district` - Partial index on districtId (active only)
- `idx_users_role_active` - Composite on role, isActive
- `idx_users_search` - GIN full-text search index

### Medication-Related Indexes (8)
- `idx_student_medications_active_dates` - Partial index on active medications with dates
- `idx_student_medications_student` - Composite on studentId, isActive
- `idx_medication_logs_student` - Composite on studentMedicationId, timeGiven
- `idx_medication_logs_nurse` - Composite on nurseId, timeGiven
- `idx_medications_category_active` - Composite on category, isActive
- `idx_medications_stock` - Partial index for low stock items
- `idx_medications_expiration` - Partial index for expiring medications
- `idx_medications_search` - GIN full-text search index
- `idx_medication_schedule` - Composite for scheduling queries

### Health Record Indexes (4)
- `idx_health_records_student_date` - Composite for student record lookups
- `idx_health_records_type_date` - Composite for record type queries
- `idx_health_records_confidential` - Partial index for confidential records
- `idx_health_records_provider` - Partial index on providerNpi

### Appointment Indexes (4)
- `idx_appointments_upcoming` - Partial index for scheduled/in-progress
- `idx_appointments_student` - Composite for student appointment history
- `idx_appointments_date_range` - Partial index excluding cancelled
- `idx_appointment_availability` - Composite for scheduling availability

### Incident Report Indexes (4)
- `idx_incident_reports_student` - Composite for student incident history
- `idx_incident_reports_reporter` - Composite for reporter's incidents
- `idx_incident_reports_filters` - Composite for filtering
- `idx_incident_reports_critical` - Partial index for high/critical severity

### Emergency Contact Indexes (2)
- `idx_emergency_contacts_student` - Partial index with priority (active only)
- `idx_emergency_contacts_primary` - Partial index for primary contacts

### Document Indexes (4)
- `idx_documents_student` - Partial index for student documents
- `idx_documents_uploader` - Composite on uploader, date
- `idx_documents_category` - Composite on category, date
- `idx_documents_expiring` - Partial index for expiring documents

### Audit Log Indexes (4)
- `idx_audit_logs_user` - Partial index for user's actions
- `idx_audit_logs_entity` - Composite for entity tracking
- `idx_audit_logs_date` - Composite for date range queries
- `idx_audit_logs_export` - Partial index for export actions

### Communication Indexes (3)
- `idx_messages_sender` - Composite on sender, date
- `idx_message_recipients_recipient` - Composite for recipient queries
- `idx_message_recipients_unread` - Partial index for unread messages

### Inventory Indexes (4)
- `idx_inventory_category` - Composite on category, location, active
- `idx_inventory_low_stock` - Partial index for low stock alerts
- `idx_inventory_transactions_item` - Composite for item transaction history
- `idx_inventory_transactions_performer` - Composite for user's transactions

### Compliance Indexes (3)
- `idx_compliance_records_student` - Composite for student compliance
- `idx_compliance_records_status` - Partial index for non-compliant items
- `idx_compliance_records_overdue` - Partial index for overdue items

### Session Indexes (2)
- `idx_sessions_user_active` - Partial index for active sessions
- `idx_sessions_expired` - Partial index for expired sessions

### Allergy & Chronic Condition Indexes (3)
- `idx_allergies_student` - Partial index for active allergies
- `idx_allergies_critical` - Partial index for life-threatening allergies
- `idx_chronic_conditions_student` - Partial index for active conditions

### Vaccination Indexes (3)
- `idx_vaccinations_student` - Composite for student vaccination history
- `idx_vaccinations_compliance` - Composite for compliance tracking
- `idx_vaccinations_due` - Partial index for upcoming vaccinations

### Post-Creation
ANALYZE commands run on all major tables to update query planner statistics.

---

## Summary Statistics

### Total Schema Objects
- **Enums:** 50+ types
- **Tables:** 9 created/modified in these migrations (many more exist from complete schema)
- **Indexes:** 50+ performance indexes
- **Foreign Keys:** 8+ constraints

### Lines of Code
- Migration 1 (Init): ~900 lines
- Migration 2 (Roles): ~50 lines
- Migration 3 (Admin): ~180 lines
- Migration 4 (Config): ~400 lines
- Migration 5 (Health): ~1100 lines
- Migration 6 (Indexes): ~700 lines
- **Total:** ~3400 lines of migration code

### Healthcare Features
- HIPAA compliance built-in
- Audit trails for all PHI
- CDC vaccine code support
- ICD-10 diagnosis codes
- NPI tracking for providers
- Full-text search capabilities
- Multi-tenant support
- Performance optimized for large datasets

---

**Document Version:** 1.0
**Last Updated:** 2025-10-11
**Database:** PostgreSQL 15+
**ORM:** Sequelize 6.x
