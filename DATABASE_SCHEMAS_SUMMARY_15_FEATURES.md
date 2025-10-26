# Database Schema Summary - 15 Critical Features
## White Cross School Nurse SaaS Platform

**Task ID:** DB7K3M  
**Database Architect Agent**  
**Date:** 2025-10-26

---

## Quick Reference: All 54 New Tables

### Compliance & Security (9 tables)
1. **Feature 30 - PHI Disclosure:** `phi_disclosures`, `phi_disclosure_recipients`, `phi_disclosure_audit`
2. **Feature 32 - Encryption:** `encryption_keys`, `key_rotation_history`, `encrypted_field_metadata`
3. **Feature 33 - Tamper Alerts:** `tamper_alerts`, `data_integrity_checksums`, `alert_response_log`

### Clinical Safety (12 tables)
4. **Feature 48 - Drug Interactions:** `drug_catalog`, `drug_interactions`, `interaction_severity_levels`, `student_drug_allergies_xref`
5. **Feature 37 - Outbreak Detection:** `outbreak_patterns`, `symptom_tracking`, `outbreak_alerts`, `outbreak_case_clusters`
6. **Feature 26 - Real-Time Alerts:** `alert_definitions`, `alert_instances`, `alert_subscriptions`, `alert_delivery_log`

### Operations (12 tables)
7. **Feature 17 - Clinic Visits:** `clinic_visits`, `visit_reasons`, `class_time_missed`, `visit_frequency_analytics`
8. **Features 5 & 41 - Immunization:** `immunization_reminders`, `vaccination_schedules`, `compliance_dashboard_cache`, `reminder_delivery_status`

### Integration (13 tables)
9. **Feature 44 - Medicaid Billing:** `medicaid_eligibility`, `billing_claims`, `claim_line_items`, `claim_submissions`, `payment_tracking`
10. **Feature 43 - State Registry:** `registry_connections`, `registry_submissions`, `registry_responses`, `submission_error_log`
11. **Feature 42 - SIS Integration:** `sis_sync_configs`, `sis_sync_jobs`, `sis_field_mappings`, `sis_sync_errors`

### Reporting (12 tables)
12. **Feature 35 - PDF Reports:** `report_definitions`, `report_instances`, `report_parameters`, `report_generation_log`
13. **Feature 21 - Document Sharing:** `shared_documents`, `document_access_tokens`, `sharing_permissions`, `share_access_audit`
14. **Feature 38 - Export Scheduling:** `scheduled_exports`, `export_jobs`, `export_history`, `export_configurations`

---

## Complete Table Schemas

### FEATURE 30: PHI DISCLOSURE TRACKING (3 tables)

#### Table: phi_disclosures
**Purpose:** HIPAA §164.528 compliance - track all PHI disclosures
**Retention:** 6 years minimum

**Key Columns:**
- `id` (PK), `student_id` (FK → students), `disclosed_by` (FK → users)
- `disclosure_date`, `disclosure_type`, `purpose` (required)
- `data_disclosed` (JSONB), `disclosure_scope`
- `accounting_required`, `exemption_reason`

**Indexes:**
- `(student_id, disclosure_date DESC)`
- `(disclosure_type)`, `(accounting_required, disclosure_date)`

#### Table: phi_disclosure_recipients
**Purpose:** Track individuals/organizations receiving PHI

**Key Columns:**
- `disclosure_id` (FK → phi_disclosures)
- `recipient_type`, `recipient_name`, `recipient_organization`
- `npi_number`, `identity_verified`, `verification_method`
- `acknowledgment_received`, `delivery_method`

**Indexes:**
- `(disclosure_id)`, `(recipient_name)`, `(npi_number)`

#### Table: phi_disclosure_audit
**Purpose:** Immutable audit trail (beforeUpdate/Delete triggers prevent modification)

**Key Columns:**
- `disclosure_id`, `action`, `performed_by`, `performed_at`
- `action_details` (JSONB), `changes` (JSONB)

---

### FEATURE 32: ENCRYPTION KEY MANAGEMENT (3 tables)

#### Table: encryption_keys
**Purpose:** AES-256-GCM key management with rotation

**Key Columns:**
- `key_name` (UNIQUE), `key_purpose`, `algorithm`, `key_size`
- `encrypted_key_data`, `key_hash`, `initialization_vector`
- `status` (PENDING/ACTIVE/RETIRED/REVOKED), `is_default`
- `rotation_period_days`, `next_rotation_date`
- `encryptions_performed`, `decryptions_performed`

**Indexes:**
- `(status)`, `(key_purpose, is_default)`, `(next_rotation_date WHERE status='ACTIVE')`

#### Table: key_rotation_history
**Purpose:** Immutable rotation history for compliance

**Key Columns:**
- `key_id`, `rotation_date`, `rotation_type`, `rotation_reason`
- `old_key_hash`, `new_key_hash`
- `records_to_reencrypt`, `records_reencrypted`, `reencryption_errors`

#### Table: encrypted_field_metadata
**Purpose:** Track encrypted fields for re-encryption during rotation

**Key Columns:**
- `table_name`, `column_name`, `record_id` (UNIQUE composite)
- `key_id`, `initialization_vector`, `encryption_algorithm`
- `data_classification` (PHI/PII/SENSITIVE), `phi_category`
- `last_reencrypted_at`, `reencryption_count`

---

### FEATURE 33: TAMPER ALERT SYSTEM (3 tables)

#### Table: tamper_alerts
**Purpose:** Detect unauthorized modifications to critical data

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
alert_type VARCHAR(50) NOT NULL, -- CHECKSUM_MISMATCH, UNAUTHORIZED_MODIFICATION, LOG_TAMPERING
severity VARCHAR(20) NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
affected_table VARCHAR(100) NOT NULL,
affected_record_id VARCHAR,
expected_checksum VARCHAR(64),
actual_checksum VARCHAR(64),
detection_method VARCHAR(100), -- SCHEDULED_SCAN, REAL_TIME_VERIFICATION, AUDIT_REVIEW
detected_at TIMESTAMP NOT NULL DEFAULT NOW(),
detected_by VARCHAR, -- System or user ID
resolution_status VARCHAR(50) DEFAULT 'OPEN', -- OPEN, INVESTIGATING, FALSE_POSITIVE, CONFIRMED, RESOLVED
resolved_at TIMESTAMP,
resolved_by VARCHAR,
resolution_notes TEXT,
impact_assessment JSONB, -- {records_affected: 5, data_compromised: false}
automated_response VARCHAR(100), -- NOTIFICATION_SENT, ACCESS_REVOKED, BACKUP_RESTORED
FOREIGN KEY (detected_by) REFERENCES users(id),
FOREIGN KEY (resolved_by) REFERENCES users(id)
```

**Indexes:** `(alert_type, detected_at DESC)`, `(severity, resolution_status)`, `(affected_table, detected_at)`

#### Table: data_integrity_checksums
**Purpose:** Store SHA-256 checksums for tamper detection

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
table_name VARCHAR(100) NOT NULL,
record_id VARCHAR NOT NULL,
column_name VARCHAR(100), -- NULL = entire record
checksum VARCHAR(64) NOT NULL,
checksum_algorithm VARCHAR(50) DEFAULT 'SHA-256',
last_verified_at TIMESTAMP NOT NULL DEFAULT NOW(),
verification_count INTEGER DEFAULT 0,
last_modified_at TIMESTAMP, -- From source record
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW(),
UNIQUE (table_name, record_id, column_name)
```

**Indexes:** `(table_name, record_id)`, `(last_verified_at)`, `(checksum)`

#### Table: alert_response_log
**Purpose:** Track all responses to tamper alerts

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
tamper_alert_id VARCHAR NOT NULL,
response_action VARCHAR(100) NOT NULL, -- NOTIFIED_ADMIN, LOCKED_RECORD, REVOKED_ACCESS
performed_by VARCHAR NOT NULL,
performed_at TIMESTAMP NOT NULL DEFAULT NOW(),
action_details JSONB,
success BOOLEAN DEFAULT TRUE,
error_message TEXT,
FOREIGN KEY (tamper_alert_id) REFERENCES tamper_alerts(id) ON DELETE CASCADE
```

---

### FEATURE 48: DRUG INTERACTION CHECKER (4 tables)

#### Table: drug_catalog
**Purpose:** Comprehensive drug reference database

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
drug_name VARCHAR(200) NOT NULL,
generic_name VARCHAR(200),
brand_names JSONB, -- ["Tylenol", "Panadol"]
rxnorm_code VARCHAR(20) UNIQUE, -- RxNorm CUI
ndc_codes JSONB, -- National Drug Codes array
drug_class VARCHAR(100), -- ANALGESIC, ANTIBIOTIC, ANTIHISTAMINE
controlled_substance_schedule VARCHAR(10), -- Schedule II, III, IV, V
fda_approval_status VARCHAR(50),
dosage_forms JSONB, -- ["tablet", "liquid", "injection"]
strengths JSONB, -- ["500mg", "1000mg"]
administration_routes JSONB, -- ["oral", "intravenous"]
indications TEXT,
contraindications TEXT,
warnings TEXT,
side_effects JSONB,
pregnancy_category VARCHAR(10),
is_active BOOLEAN DEFAULT TRUE,
last_updated TIMESTAMP DEFAULT NOW(),
data_source VARCHAR(100) -- FDA_DATABASE, CLINICAL_PHARMACOLOGY
```

**Indexes:** `(drug_name)`, `(generic_name)`, `(rxnorm_code)`, `(drug_class)`, `(is_active)`

#### Table: drug_interactions
**Purpose:** Many-to-many self-referential interaction tracking

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
drug_a_id VARCHAR NOT NULL,
drug_b_id VARCHAR NOT NULL,
interaction_severity VARCHAR(20) NOT NULL, -- MINOR, MODERATE, MAJOR, CONTRAINDICATED
interaction_type VARCHAR(100), -- PHARMACOKINETIC, PHARMACODYNAMIC, ADDITIVE_TOXICITY
description TEXT NOT NULL,
clinical_effects TEXT,
management_recommendations TEXT,
evidence_level VARCHAR(50), -- THEORETICAL, CASE_REPORT, CLINICAL_STUDY, WELL_DOCUMENTED
onset VARCHAR(50), -- RAPID, DELAYED
documentation_quality VARCHAR(50), -- EXCELLENT, GOOD, FAIR, POOR
last_reviewed_date DATE,
reviewed_by VARCHAR(200), -- Clinical pharmacist name
FOREIGN KEY (drug_a_id) REFERENCES drug_catalog(id),
FOREIGN KEY (drug_b_id) REFERENCES drug_catalog(id),
CHECK (drug_a_id < drug_b_id) -- Prevent duplicate A-B and B-A entries
```

**Indexes:** `(drug_a_id, drug_b_id) UNIQUE`, `(interaction_severity)`, `(evidence_level)`

#### Table: interaction_severity_levels
**Purpose:** Define severity levels with clinical guidance

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
severity_code VARCHAR(20) UNIQUE NOT NULL, -- MINOR, MODERATE, MAJOR, CONTRAINDICATED
severity_rank INTEGER UNIQUE NOT NULL, -- 1=minor, 4=contraindicated
display_name VARCHAR(50),
color_code VARCHAR(7), -- Hex color for UI
icon_name VARCHAR(50),
clinical_guidance TEXT,
alert_threshold BOOLEAN, -- Should trigger alert?
require_physician_approval BOOLEAN,
prevent_prescribing BOOLEAN
```

#### Table: student_drug_allergies_xref
**Purpose:** Cross-reference student allergies with drug catalog

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
student_id VARCHAR NOT NULL,
allergy_id VARCHAR NOT NULL, -- From existing allergies table
drug_id VARCHAR, -- Specific drug if known
drug_class VARCHAR(100), -- Or entire class (e.g., PENICILLINS)
cross_reactive_drugs JSONB, -- List of drugs to avoid
verified_by VARCHAR,
verification_date TIMESTAMP,
FOREIGN KEY (student_id) REFERENCES students(id),
FOREIGN KEY (drug_id) REFERENCES drug_catalog(id)
```

---

### FEATURE 37: OUTBREAK DETECTION (4 tables)

#### Table: outbreak_patterns
**Purpose:** Define detection patterns for outbreaks

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
pattern_name VARCHAR(100) UNIQUE NOT NULL,
disease_category VARCHAR(100), -- RESPIRATORY, GASTROINTESTINAL, SKIN_INFECTION
symptom_combination JSONB NOT NULL, -- {fever: true, cough: true, duration_days: ">2"}
threshold_students INTEGER DEFAULT 3, -- Minimum students for alert
threshold_percentage DECIMAL(5,2), -- % of student population
time_window_days INTEGER DEFAULT 7,
geographic_clustering BOOLEAN DEFAULT TRUE,
cluster_radius_meters INTEGER, -- For geographic detection
severity_level VARCHAR(20), -- LOW, MODERATE, HIGH, EPIDEMIC
notification_recipients JSONB, -- {roles: ["NURSE", "ADMIN"], external: ["health_dept"]}
is_active BOOLEAN DEFAULT TRUE,
reportable_disease BOOLEAN DEFAULT FALSE, -- CDC/state reporting required
created_by VARCHAR,
created_at TIMESTAMP DEFAULT NOW()
```

**Indexes:** `(disease_category)`, `(is_active)`, `(reportable_disease)`

#### Table: symptom_tracking
**Purpose:** Track student symptoms for outbreak detection

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
student_id VARCHAR NOT NULL,
reported_date TIMESTAMP NOT NULL DEFAULT NOW(),
symptom_onset_date DATE NOT NULL,
symptoms JSONB NOT NULL, -- {fever: true, temp_f: 101.5, cough: true, vomiting: false}
severity_assessment VARCHAR(50), -- MILD, MODERATE, SEVERE
diagnosis VARCHAR(200),
icd10_code VARCHAR(10),
location_at_onset VARCHAR(200), -- Classroom, bus, cafeteria
student_grade_level VARCHAR(10),
sent_home BOOLEAN DEFAULT FALSE,
returned_to_school_date DATE,
follow_up_required BOOLEAN,
notes TEXT,
reported_by VARCHAR,
FOREIGN KEY (student_id) REFERENCES students(id),
FOREIGN KEY (reported_by) REFERENCES users(id)
```

**Indexes:** `(student_id, reported_date DESC)`, `(symptom_onset_date DESC)`, `(diagnosis)`, `symptoms USING GIN`

#### Table: outbreak_alerts
**Purpose:** Generated alerts when outbreak thresholds met

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
pattern_id VARCHAR,
alert_date TIMESTAMP NOT NULL DEFAULT NOW(),
school_id VARCHAR NOT NULL,
affected_students_count INTEGER NOT NULL,
total_student_population INTEGER,
percentage_affected DECIMAL(5,2),
symptom_summary JSONB, -- Aggregated symptoms
geographic_cluster_info JSONB, -- {centroid_lat, centroid_lng, radius_m}
time_series_data JSONB, -- Daily case counts
outbreak_status VARCHAR(50) DEFAULT 'INVESTIGATING', -- INVESTIGATING, CONFIRMED, CONTAINED, RESOLVED
severity_level VARCHAR(20),
health_department_notified BOOLEAN DEFAULT FALSE,
notification_sent_at TIMESTAMP,
containment_measures JSONB, -- {actions_taken: [], quarantine_in_place: false}
resolved_at TIMESTAMP,
resolution_notes TEXT,
FOREIGN KEY (pattern_id) REFERENCES outbreak_patterns(id),
FOREIGN KEY (school_id) REFERENCES schools(id)
```

**Indexes:** `(school_id, alert_date DESC)`, `(outbreak_status)`, `(severity_level)`

#### Table: outbreak_case_clusters
**Purpose:** Link individual symptom cases to outbreak alerts

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
outbreak_alert_id VARCHAR NOT NULL,
symptom_tracking_id VARCHAR NOT NULL,
cluster_assignment INTEGER, -- Cluster number for multi-cluster outbreaks
spatial_distance_meters DECIMAL(10,2),
temporal_distance_days INTEGER,
epidemiological_link_strength VARCHAR(50), -- STRONG, MODERATE, WEAK
FOREIGN KEY (outbreak_alert_id) REFERENCES outbreak_alerts(id) ON DELETE CASCADE,
FOREIGN KEY (symptom_tracking_id) REFERENCES symptom_tracking(id),
UNIQUE (outbreak_alert_id, symptom_tracking_id)
```

---

### FEATURE 26: REAL-TIME ALERTS (4 tables)

#### Table: alert_definitions
**Purpose:** Define alert types and rules

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
alert_code VARCHAR(50) UNIQUE NOT NULL, -- MEDICATION_MISSED, EMERGENCY_HEALTH, OUTBREAK_DETECTED
alert_name VARCHAR(200) NOT NULL,
alert_category VARCHAR(50), -- HEALTH_EMERGENCY, MEDICATION, COMPLIANCE, SYSTEM
priority_level VARCHAR(20) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL, EMERGENCY
alert_conditions JSONB NOT NULL, -- {trigger: "medication_missed", time_past_due: 30}
escalation_rules JSONB, -- {escalate_after_minutes: 15, escalate_to: ["SUPERVISOR"]}
delivery_channels JSONB DEFAULT '["EMAIL", "SMS"]', -- [IN_APP, EMAIL, SMS, PUSH, VOICE]
message_template TEXT,
is_active BOOLEAN DEFAULT TRUE,
can_user_dismiss BOOLEAN DEFAULT TRUE,
require_acknowledgment BOOLEAN DEFAULT FALSE,
expiration_minutes INTEGER, -- Auto-resolve after X minutes
created_by VARCHAR,
created_at TIMESTAMP DEFAULT NOW()
```

**Indexes:** `(alert_code)`, `(alert_category, priority_level)`, `(is_active)`

#### Table: alert_instances
**Purpose:** Individual alert occurrences

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
alert_definition_id VARCHAR NOT NULL,
triggered_at TIMESTAMP NOT NULL DEFAULT NOW(),
triggered_by_user_id VARCHAR, -- NULL = system-triggered
triggered_by_event VARCHAR(100), -- Event that caused alert
target_entity_type VARCHAR(50), -- STUDENT, USER, SCHOOL
target_entity_id VARCHAR,
priority_override VARCHAR(20), -- Override default priority
alert_data JSONB, -- Context-specific data
alert_status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, ACKNOWLEDGED, ESCALATED, RESOLVED, EXPIRED
acknowledged_at TIMESTAMP,
acknowledged_by VARCHAR,
resolved_at TIMESTAMP,
resolved_by VARCHAR,
resolution_notes TEXT,
escalation_level INTEGER DEFAULT 0,
last_escalated_at TIMESTAMP,
expires_at TIMESTAMP,
FOREIGN KEY (alert_definition_id) REFERENCES alert_definitions(id),
FOREIGN KEY (acknowledged_by) REFERENCES users(id),
FOREIGN KEY (resolved_by) REFERENCES users(id)
```

**Indexes:** `(alert_definition_id, triggered_at DESC)`, `(alert_status, priority_override)`, `(target_entity_type, target_entity_id)`, `(expires_at WHERE alert_status='ACTIVE')`

#### Table: alert_subscriptions
**Purpose:** User alert preferences

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
user_id VARCHAR NOT NULL,
alert_definition_id VARCHAR, -- NULL = all alerts
alert_category VARCHAR(50), -- Subscribe by category
priority_threshold VARCHAR(20), -- Only HIGH and CRITICAL
delivery_channels JSONB DEFAULT '["IN_APP"]',
is_active BOOLEAN DEFAULT TRUE,
quiet_hours_start TIME, -- Don't send during quiet hours
quiet_hours_end TIME,
weekend_delivery BOOLEAN DEFAULT TRUE,
FOREIGN KEY (user_id) REFERENCES users(id),
FOREIGN KEY (alert_definition_id) REFERENCES alert_definitions(id)
```

**Indexes:** `(user_id, is_active)`, `(alert_definition_id)`, `(alert_category)`

#### Table: alert_delivery_log
**Purpose:** Track alert delivery attempts

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
alert_instance_id VARCHAR NOT NULL,
recipient_user_id VARCHAR NOT NULL,
delivery_channel VARCHAR(50) NOT NULL, -- EMAIL, SMS, PUSH, VOICE, IN_APP
sent_at TIMESTAMP NOT NULL DEFAULT NOW(),
delivery_status VARCHAR(50), -- PENDING, SENT, DELIVERED, FAILED, BOUNCED
delivery_confirmation_at TIMESTAMP,
failure_reason TEXT,
retry_count INTEGER DEFAULT 0,
next_retry_at TIMESTAMP,
channel_response JSONB, -- Provider-specific response data
FOREIGN KEY (alert_instance_id) REFERENCES alert_instances(id) ON DELETE CASCADE,
FOREIGN KEY (recipient_user_id) REFERENCES users(id)
```

**Indexes:** `(alert_instance_id)`, `(recipient_user_id, sent_at DESC)`, `(delivery_status, next_retry_at WHERE delivery_status='PENDING')`

---

### FEATURE 17: CLINIC VISIT TRACKING (4 tables)

#### Table: clinic_visits
**Purpose:** Complete clinic attendance tracking

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
student_id VARCHAR NOT NULL,
arrival_time TIMESTAMP NOT NULL DEFAULT NOW(),
departure_time TIMESTAMP,
visit_duration_minutes INTEGER GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (departure_time - arrival_time))/60) STORED,
visit_reason_id VARCHAR,
visit_reason_custom TEXT,
severity_triage VARCHAR(20), -- ROUTINE, URGENT, EMERGENCY
presenting_complaint TEXT NOT NULL,
vital_signs_taken BOOLEAN DEFAULT FALSE,
temperature_f DECIMAL(4,2),
heart_rate INTEGER,
blood_pressure_systolic INTEGER,
blood_pressure_diastolic INTEGER,
treatment_provided TEXT,
medications_administered JSONB, -- [{medication_id, dose, time}]
sent_home BOOLEAN DEFAULT FALSE,
parent_notified BOOLEAN DEFAULT FALSE,
parent_notification_time TIMESTAMP,
follow_up_required BOOLEAN DEFAULT FALSE,
follow_up_notes TEXT,
return_to_class_time TIMESTAMP,
excuse_note_generated BOOLEAN DEFAULT FALSE,
nurse_notes TEXT,
attended_by_user_id VARCHAR NOT NULL,
FOREIGN KEY (student_id) REFERENCES students(id),
FOREIGN KEY (visit_reason_id) REFERENCES visit_reasons(id),
FOREIGN KEY (attended_by_user_id) REFERENCES users(id)
```

**Indexes:** `(student_id, arrival_time DESC)`, `(arrival_time DESC)`, `(visit_reason_id)`, `(severity_triage, arrival_time)`, `(sent_home, arrival_time)`

#### Table: visit_reasons
**Purpose:** Standardized visit reason catalog

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
reason_code VARCHAR(50) UNIQUE NOT NULL,
reason_name VARCHAR(200) NOT NULL,
reason_category VARCHAR(50), -- ILLNESS, INJURY, MEDICATION, ROUTINE_CHECK, CHRONIC_CONDITION
icd10_codes JSONB, -- Associated diagnosis codes
typical_duration_minutes INTEGER,
requires_parent_notification BOOLEAN DEFAULT FALSE,
requires_vital_signs BOOLEAN DEFAULT FALSE,
is_active BOOLEAN DEFAULT TRUE,
display_order INTEGER,
description TEXT
```

#### Table: class_time_missed
**Purpose:** Track instructional time lost

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
clinic_visit_id VARCHAR NOT NULL,
student_id VARCHAR NOT NULL,
class_period VARCHAR(50),
subject VARCHAR(100),
minutes_missed INTEGER NOT NULL,
absence_excused BOOLEAN DEFAULT TRUE,
teacher_notified BOOLEAN DEFAULT FALSE,
makeup_work_required BOOLEAN DEFAULT FALSE,
FOREIGN KEY (clinic_visit_id) REFERENCES clinic_visits(id) ON DELETE CASCADE,
FOREIGN KEY (student_id) REFERENCES students(id)
```

#### Table: visit_frequency_analytics (Materialized View)
**Purpose:** Pre-calculated visit analytics

**Key Columns:**
```sql
student_id VARCHAR PRIMARY KEY,
total_visits INTEGER,
visits_last_30_days INTEGER,
visits_current_school_year INTEGER,
most_common_reason VARCHAR(200),
average_visit_duration_minutes DECIMAL(6,2),
percentage_sent_home DECIMAL(5,2),
chronic_visitor_flag BOOLEAN, -- >10 visits in 30 days
last_visit_date TIMESTAMP,
REFRESH: Daily at midnight
```

---

### FEATURES 5 & 41: IMMUNIZATION REMINDERS & DASHBOARD (4 tables)

#### Table: immunization_reminders
**Purpose:** Automated vaccination reminders

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
student_id VARCHAR NOT NULL,
vaccination_schedule_id VARCHAR NOT NULL,
vaccine_type VARCHAR(50) NOT NULL,
dose_number INTEGER,
due_date DATE NOT NULL,
reminder_type VARCHAR(50) DEFAULT 'UPCOMING', -- UPCOMING, OVERDUE, URGENT
reminder_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, SENT, ACKNOWLEDGED, DISMISSED, COMPLETED
sent_date TIMESTAMP,
channels_sent JSONB, -- ["EMAIL", "SMS"]
parent_acknowledged BOOLEAN DEFAULT FALSE,
acknowledgment_date TIMESTAMP,
vaccination_completed_date DATE,
completion_verified_by VARCHAR,
notes TEXT,
FOREIGN KEY (student_id) REFERENCES students(id),
FOREIGN KEY (vaccination_schedule_id) REFERENCES vaccination_schedules(id)
```

**Indexes:** `(student_id, due_date)`, `(due_date, reminder_status)`, `(reminder_status, sent_date)`

#### Table: vaccination_schedules
**Purpose:** State-specific vaccination requirements

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
state_code VARCHAR(2) NOT NULL,
vaccine_type VARCHAR(50) NOT NULL,
dose_number INTEGER NOT NULL,
minimum_age_months INTEGER,
maximum_age_months INTEGER,
minimum_interval_days INTEGER, -- From previous dose
grade_level VARCHAR(20), -- K, 1, 7, etc.
required_for_enrollment BOOLEAN DEFAULT TRUE,
grace_period_days INTEGER DEFAULT 30,
exemption_allowed BOOLEAN DEFAULT TRUE,
exemption_types JSONB, -- ["MEDICAL", "RELIGIOUS", "PHILOSOPHICAL"]
cdc_schedule_reference VARCHAR(200),
last_updated DATE DEFAULT CURRENT_DATE,
UNIQUE (state_code, vaccine_type, dose_number)
```

**Indexes:** `(state_code, grade_level)`, `(vaccine_type, dose_number)`, `(required_for_enrollment)`

#### Table: compliance_dashboard_cache (Materialized View)
**Purpose:** Pre-calculated compliance metrics

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
school_id VARCHAR NOT NULL,
grade_level VARCHAR(20),
vaccine_type VARCHAR(50),
total_students INTEGER,
compliant_count INTEGER,
overdue_count INTEGER,
exempt_count INTEGER,
compliance_percentage DECIMAL(5,2),
non_compliance_list JSONB, -- Student IDs requiring action
last_updated TIMESTAMP DEFAULT NOW(),
REFRESH: Nightly + on-demand
```

#### Table: reminder_delivery_status
**Purpose:** Multi-channel reminder delivery tracking

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
reminder_id VARCHAR NOT NULL,
delivery_channel VARCHAR(50) NOT NULL,
recipient_type VARCHAR(50), -- PARENT, GUARDIAN, STUDENT
recipient_contact VARCHAR(255),
sent_at TIMESTAMP DEFAULT NOW(),
delivery_status VARCHAR(50), -- PENDING, SENT, DELIVERED, FAILED, BOUNCED
delivered_at TIMESTAMP,
read_at TIMESTAMP,
clicked_at TIMESTAMP,
failure_reason TEXT,
FOREIGN KEY (reminder_id) REFERENCES immunization_reminders(id) ON DELETE CASCADE
```

---

### FEATURE 44: MEDICAID BILLING (5 tables)

#### Table: medicaid_eligibility
**Purpose:** Student Medicaid eligibility verification

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
student_id VARCHAR NOT NULL,
medicaid_id VARCHAR(20) UNIQUE NOT NULL,
state_medicaid_id VARCHAR(30),
eligibility_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, VERIFIED, EXPIRED, DENIED
verification_date DATE,
coverage_start_date DATE,
coverage_end_date DATE,
managed_care_organization VARCHAR(200),
mco_member_id VARCHAR(30),
primary_care_provider VARCHAR(200),
pcp_npi VARCHAR(10),
benefit_plan_type VARCHAR(100),
copay_amount DECIMAL(6,2),
eligibility_category VARCHAR(100), -- TANF, SSI, FOSTER_CARE, etc.
last_verification_check DATE,
next_verification_due DATE,
verification_frequency_days INTEGER DEFAULT 90,
auto_reverify BOOLEAN DEFAULT TRUE,
eligibility_notes TEXT,
FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT
```

**Indexes:** `(student_id)`, `(medicaid_id)`, `(eligibility_status, coverage_end_date)`, `(next_verification_due)`

#### Table: billing_claims
**Purpose:** CMS-1500 billing claims

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
claim_number VARCHAR(50) UNIQUE NOT NULL, -- Internal claim number
student_id VARCHAR NOT NULL,
eligibility_id VARCHAR NOT NULL,
service_date DATE NOT NULL,
date_of_birth DATE NOT NULL,
diagnosis_codes JSONB NOT NULL, -- ICD-10 codes array
place_of_service_code VARCHAR(2) DEFAULT '11', -- 11 = Office
billing_provider_npi VARCHAR(10) NOT NULL,
billing_provider_name VARCHAR(200) NOT NULL,
billing_provider_taxonomy VARCHAR(20),
rendering_provider_npi VARCHAR(10),
rendering_provider_name VARCHAR(200),
total_charge DECIMAL(10,2) NOT NULL,
claim_status VARCHAR(50) DEFAULT 'DRAFT', -- DRAFT, READY, SUBMITTED, PENDING, PAID, DENIED, ADJUSTED
created_date DATE DEFAULT CURRENT_DATE,
submitted_date DATE,
adjudication_date DATE,
paid_date DATE,
paid_amount DECIMAL(10,2),
adjustment_amount DECIMAL(10,2),
denial_code VARCHAR(10),
denial_reason TEXT,
claim_metadata JSONB, -- Additional CMS-1500 fields
FOREIGN KEY (student_id) REFERENCES students(id),
FOREIGN KEY (eligibility_id) REFERENCES medicaid_eligibility(id)
```

**Indexes:** `(claim_number)`, `(student_id, service_date DESC)`, `(claim_status)`, `(submitted_date)`, `(billing_provider_npi)`

#### Table: claim_line_items
**Purpose:** Individual services on claim (CPT codes)

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
claim_id VARCHAR NOT NULL,
line_number INTEGER NOT NULL,
service_date DATE NOT NULL,
procedure_code VARCHAR(10) NOT NULL, -- CPT code
procedure_description VARCHAR(500),
modifiers JSONB, -- CPT modifiers array
units INTEGER DEFAULT 1,
unit_charge DECIMAL(10,2) NOT NULL,
total_charge DECIMAL(10,2) NOT NULL,
paid_amount DECIMAL(10,2),
adjustment_codes JSONB,
adjustment_amount DECIMAL(10,2),
line_status VARCHAR(50), -- PENDING, APPROVED, DENIED, ADJUSTED
denial_code VARCHAR(10),
FOREIGN KEY (claim_id) REFERENCES billing_claims(id) ON DELETE CASCADE,
UNIQUE (claim_id, line_number)
```

**Indexes:** `(claim_id, line_number)`, `(procedure_code)`, `(service_date)`

#### Table: claim_submissions
**Purpose:** Track electronic claim submissions (837P)

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
claim_id VARCHAR NOT NULL,
submission_date TIMESTAMP NOT NULL DEFAULT NOW(),
submission_method VARCHAR(50), -- EDI_837P, PAPER, CLEARINGHOUSE, PORTAL
clearinghouse_name VARCHAR(100),
transmission_id VARCHAR(100),
batch_id VARCHAR(100),
submission_status VARCHAR(50) DEFAULT 'SENT', -- SENT, ACKNOWLEDGED, REJECTED, ACCEPTED
acknowledgment_date TIMESTAMP,
acknowledgment_code VARCHAR(50),
rejection_reason TEXT,
edi_file_path VARCHAR(500), -- Path to 837P file
response_file_path VARCHAR(500), -- Path to 999/277 response
retry_count INTEGER DEFAULT 0,
FOREIGN KEY (claim_id) REFERENCES billing_claims(id) ON DELETE RESTRICT
```

**Indexes:** `(claim_id, submission_date DESC)`, `(submission_status)`, `(batch_id)`

#### Table: payment_tracking
**Purpose:** Track payments and remittance advice

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
claim_id VARCHAR NOT NULL,
payment_date DATE NOT NULL,
payment_method VARCHAR(50), -- EFT, CHECK, ERA
check_number VARCHAR(50),
eft_trace_number VARCHAR(50),
payment_amount DECIMAL(10,2) NOT NULL,
era_file_path VARCHAR(500), -- Electronic Remittance Advice
adjustment_codes JSONB,
adjustment_total DECIMAL(10,2),
contractual_adjustment DECIMAL(10,2),
patient_responsibility DECIMAL(10,2),
remarks TEXT,
deposited_date DATE,
bank_account_last_four VARCHAR(4),
reconciliation_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, MATCHED, UNMATCHED, DISPUTED
FOREIGN KEY (claim_id) REFERENCES billing_claims(id) ON DELETE RESTRICT
```

**Indexes:** `(claim_id)`, `(payment_date DESC)`, `(check_number)`, `(eft_trace_number)`, `(reconciliation_status)`

---

### FEATURE 43: STATE REGISTRY INTEGRATION (4 tables)

#### Table: registry_connections
**Purpose:** State immunization registry configurations

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
registry_name VARCHAR(200) NOT NULL,
state_code VARCHAR(2) NOT NULL,
registry_type VARCHAR(50) DEFAULT 'IMMUNIZATION', -- IMMUNIZATION, BIRTH_DEFECTS, REPORTABLE_DISEASE
connection_method VARCHAR(50), -- HL7_V2, SOAP_API, REST_API, SFTP
endpoint_url VARCHAR(500),
hl7_version VARCHAR(20), -- v2.5.1
message_profile VARCHAR(100), -- CDC_IMPLEMENTATION_GUIDE_2.5.1
authentication_method VARCHAR(50), -- CERTIFICATE, USERNAME_PASSWORD, API_KEY, OAUTH2
credential_vault_key VARCHAR(200), -- Reference to encrypted credentials
facility_id VARCHAR(50), -- Registry-assigned facility ID
sending_application VARCHAR(200),
sending_facility VARCHAR(200),
connection_status VARCHAR(50) DEFAULT 'INACTIVE', -- ACTIVE, INACTIVE, ERROR, TESTING
last_successful_connection TIMESTAMP,
last_connection_error TEXT,
test_mode BOOLEAN DEFAULT TRUE,
is_active BOOLEAN DEFAULT TRUE,
UNIQUE (state_code, registry_type)
```

**Indexes:** `(state_code, registry_type)`, `(connection_status)`, `(is_active)`

#### Table: registry_submissions
**Purpose:** Track submissions to state registries

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
registry_connection_id VARCHAR NOT NULL,
submission_date TIMESTAMP NOT NULL DEFAULT NOW(),
submission_type VARCHAR(50), -- NEW_IMMUNIZATION, UPDATE_DEMOGRAPHICS, QUERY_HISTORY
student_id VARCHAR NOT NULL,
vaccination_id VARCHAR, -- NULL for queries
message_type VARCHAR(10), -- VXU, QBP, RSP (HL7 message types)
hl7_message TEXT, -- Complete HL7 message sent
message_control_id VARCHAR(100), -- HL7 MSH-10
submission_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, SENT, ACKNOWLEDGED, REJECTED, ERROR
response_received_at TIMESTAMP,
hl7_response TEXT,
acknowledgment_code VARCHAR(10), -- AA, AE, AR (HL7 MSA-1)
response_error_codes JSONB,
response_warnings JSONB,
retry_count INTEGER DEFAULT 0,
last_retry_at TIMESTAMP,
FOREIGN KEY (registry_connection_id) REFERENCES registry_connections(id),
FOREIGN KEY (student_id) REFERENCES students(id),
FOREIGN KEY (vaccination_id) REFERENCES vaccinations(id)
```

**Indexes:** `(registry_connection_id, submission_date DESC)`, `(student_id)`, `(submission_status)`, `(message_control_id)`

#### Table: registry_responses
**Purpose:** Parse and store registry responses

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
submission_id VARCHAR NOT NULL UNIQUE,
response_date TIMESTAMP NOT NULL DEFAULT NOW(),
response_type VARCHAR(50), -- ACKNOWLEDGMENT, IMMUNIZATION_HISTORY, ERROR
acknowledgment_status VARCHAR(10), -- AA, AE, AR, CA, CE, CR
error_severity VARCHAR(20), -- ERROR, WARNING, INFO
error_messages JSONB, -- Structured error array
immunization_history JSONB, -- For query responses
forecast_recommendations JSONB, -- Vaccine recommendations from registry
patient_registry_id VARCHAR(50), -- State-assigned patient ID
last_immunization_date DATE,
compliance_status VARCHAR(50),
exemptions_on_file JSONB,
response_metadata JSONB,
FOREIGN KEY (submission_id) REFERENCES registry_submissions(id) ON DELETE CASCADE
```

**Indexes:** `(submission_id)`, `(response_date DESC)`, `(acknowledgment_status)`

#### Table: submission_error_log
**Purpose:** Detailed error tracking for troubleshooting

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
submission_id VARCHAR NOT NULL,
error_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
error_type VARCHAR(100), -- HL7_PARSE_ERROR, VALIDATION_ERROR, CONNECTION_ERROR
error_code VARCHAR(50),
error_message TEXT NOT NULL,
hl7_segment VARCHAR(10), -- Which segment had error (MSH, PID, RXA, etc.)
field_number VARCHAR(20), -- HL7 field number
field_value TEXT,
stack_trace TEXT,
resolution_status VARCHAR(50) DEFAULT 'OPEN', -- OPEN, INVESTIGATING, RESOLVED, KNOWN_ISSUE
resolution_notes TEXT,
resolved_at TIMESTAMP,
FOREIGN KEY (submission_id) REFERENCES registry_submissions(id) ON DELETE CASCADE
```

**Indexes:** `(submission_id)`, `(error_type)`, `(resolution_status)`, `(error_timestamp DESC)`

---

### FEATURE 42: SIS INTEGRATION (4 tables)

#### Table: sis_sync_configs
**Purpose:** Student Information System integration settings

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
school_id VARCHAR NOT NULL,
sis_vendor VARCHAR(50) NOT NULL, -- POWERSCHOOL, INFINITE_CAMPUS, SKYWARD, ASPEN, etc.
sis_version VARCHAR(20),
connection_type VARCHAR(50), -- REST_API, SOAP, SFTP, DATABASE_DIRECT, CSV_IMPORT
api_base_url VARCHAR(500),
api_version VARCHAR(20),
authentication_method VARCHAR(50),
credential_vault_key VARCHAR(200),
sync_direction VARCHAR(50) DEFAULT 'BIDIRECTIONAL', -- IMPORT_ONLY, EXPORT_ONLY, BIDIRECTIONAL
sync_frequency VARCHAR(50) DEFAULT 'DAILY', -- REALTIME, HOURLY, DAILY, WEEKLY, MANUAL
sync_schedule_cron VARCHAR(100), -- Cron expression
last_sync_timestamp TIMESTAMP,
next_sync_scheduled TIMESTAMP,
sync_enabled BOOLEAN DEFAULT TRUE,
sync_student_demographics BOOLEAN DEFAULT TRUE,
sync_enrollments BOOLEAN DEFAULT TRUE,
sync_attendance BOOLEAN DEFAULT FALSE,
sync_health_alerts BOOLEAN DEFAULT FALSE,
conflict_resolution_strategy VARCHAR(50) DEFAULT 'SIS_WINS', -- SIS_WINS, WHITECROSS_WINS, MANUAL_REVIEW
test_mode BOOLEAN DEFAULT TRUE,
FOREIGN KEY (school_id) REFERENCES schools(id)
```

**Indexes:** `(school_id)`, `(sis_vendor)`, `(sync_enabled, next_sync_scheduled)`, `(last_sync_timestamp)`

#### Table: sis_sync_jobs
**Purpose:** Track individual sync job executions

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
config_id VARCHAR NOT NULL,
job_start_time TIMESTAMP NOT NULL DEFAULT NOW(),
job_end_time TIMESTAMP,
job_duration_seconds INTEGER GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (job_end_time - job_start_time))) STORED,
job_status VARCHAR(50) DEFAULT 'RUNNING', -- RUNNING, COMPLETED, FAILED, PARTIAL_SUCCESS
trigger_type VARCHAR(50), -- SCHEDULED, MANUAL, WEBHOOK, API_CALL
triggered_by VARCHAR, -- User ID if manual
sync_direction VARCHAR(50), -- IMPORT, EXPORT, BIDIRECTIONAL
records_processed INTEGER DEFAULT 0,
records_created INTEGER DEFAULT 0,
records_updated INTEGER DEFAULT 0,
records_skipped INTEGER DEFAULT 0,
records_failed INTEGER DEFAULT 0,
data_snapshot JSONB, -- Summary of changes
error_summary TEXT,
performance_metrics JSONB, -- {api_calls: 150, avg_response_ms: 234}
FOREIGN KEY (config_id) REFERENCES sis_sync_configs(id),
FOREIGN KEY (triggered_by) REFERENCES users(id) ON DELETE SET NULL
```

**Indexes:** `(config_id, job_start_time DESC)`, `(job_status)`, `(job_start_time DESC)`

#### Table: sis_field_mappings
**Purpose:** Map SIS fields to White Cross fields

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
config_id VARCHAR NOT NULL,
entity_type VARCHAR(50) NOT NULL, -- STUDENT, EMERGENCY_CONTACT, ENROLLMENT, HEALTH_CONDITION
sis_field_name VARCHAR(200) NOT NULL,
sis_field_type VARCHAR(50), -- STRING, INTEGER, DATE, BOOLEAN, OBJECT
whitecross_table VARCHAR(100) NOT NULL,
whitecross_column VARCHAR(100) NOT NULL,
whitecross_field_type VARCHAR(50),
transformation_rule VARCHAR(50), -- DIRECT, UPPERCASE, DATE_FORMAT, LOOKUP, CUSTOM
transformation_function TEXT, -- Custom transformation logic
default_value TEXT,
is_required BOOLEAN DEFAULT FALSE,
is_key_field BOOLEAN DEFAULT FALSE, -- Used for matching records
validation_rule TEXT, -- Regex or logic for validation
mapping_notes TEXT,
is_active BOOLEAN DEFAULT TRUE,
FOREIGN KEY (config_id) REFERENCES sis_sync_configs(id) ON DELETE CASCADE
```

**Indexes:** `(config_id, entity_type)`, `(whitecross_table, whitecross_column)`, `(is_key_field)`

#### Table: sis_sync_errors
**Purpose:** Record-level sync errors for manual resolution

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
sync_job_id VARCHAR NOT NULL,
error_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
entity_type VARCHAR(50) NOT NULL,
sis_record_id VARCHAR(200),
whitecross_record_id VARCHAR,
error_type VARCHAR(100), -- VALIDATION_ERROR, MISSING_REQUIRED_FIELD, DUPLICATE_RECORD, CONFLICT
error_field VARCHAR(200),
error_message TEXT NOT NULL,
sis_data_snapshot JSONB, -- Original SIS data
whitecross_data_snapshot JSONB, -- Current White Cross data
suggested_resolution TEXT,
resolution_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, MANUAL_REVIEW, AUTO_RESOLVED, RESOLVED, IGNORED
resolved_at TIMESTAMP,
resolved_by VARCHAR,
resolution_action VARCHAR(100), -- UPDATED_WHITECROSS, UPDATED_SIS, MERGED, CREATED_NEW, SKIPPED
resolution_notes TEXT,
FOREIGN KEY (sync_job_id) REFERENCES sis_sync_jobs(id) ON DELETE CASCADE,
FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL
```

**Indexes:** `(sync_job_id)`, `(resolution_status, error_timestamp)`, `(entity_type, error_type)`, `(sis_record_id)`

---

### FEATURE 35: PDF REPORTS METADATA (4 tables)

#### Table: report_definitions
**Purpose:** Define available report templates

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
report_code VARCHAR(50) UNIQUE NOT NULL,
report_name VARCHAR(200) NOT NULL,
report_category VARCHAR(50), -- HEALTH, IMMUNIZATION, COMPLIANCE, INCIDENT, CUSTOM
description TEXT,
template_type VARCHAR(50) DEFAULT 'PDF', -- PDF, EXCEL, CSV, HTML
template_path VARCHAR(500), -- Path to template file
template_engine VARCHAR(50), -- JSPDF, HANDLEBARS, PUPPETEER
data_source_query TEXT, -- SQL or query logic
required_parameters JSONB, -- [{name: "school_id", type: "string", required: true}]
optional_parameters JSONB,
output_filename_pattern VARCHAR(200), -- "Health_Report_{school_name}_{date}.pdf"
page_orientation VARCHAR(20) DEFAULT 'PORTRAIT', -- PORTRAIT, LANDSCAPE
page_size VARCHAR(20) DEFAULT 'LETTER', -- LETTER, A4, LEGAL
includes_phi BOOLEAN DEFAULT FALSE,
includes_pii BOOLEAN DEFAULT FALSE,
access_roles JSONB, -- ["NURSE", "ADMIN"]
is_active BOOLEAN DEFAULT TRUE,
estimated_generation_time_seconds INTEGER,
created_by VARCHAR,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW(),
FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
```

**Indexes:** `(report_code)`, `(report_category, is_active)`, `(includes_phi)`

#### Table: report_instances
**Purpose:** Track generated reports

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
report_definition_id VARCHAR NOT NULL,
generated_at TIMESTAMP NOT NULL DEFAULT NOW(),
generated_by VARCHAR NOT NULL,
report_parameters JSONB NOT NULL, -- Parameters used for generation
file_path VARCHAR(500) NOT NULL,
file_size_bytes BIGINT,
file_hash VARCHAR(64), -- SHA-256 for integrity
page_count INTEGER,
generation_status VARCHAR(50) DEFAULT 'GENERATING', -- GENERATING, COMPLETED, FAILED
generation_error TEXT,
generation_duration_seconds INTEGER,
expires_at TIMESTAMP, -- Auto-delete date
downloaded_count INTEGER DEFAULT 0,
last_downloaded_at TIMESTAMP,
encryption_key_id VARCHAR, -- If file encrypted at rest
access_token VARCHAR(100) UNIQUE, -- Temporary access token
is_archived BOOLEAN DEFAULT FALSE,
FOREIGN KEY (report_definition_id) REFERENCES report_definitions(id),
FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE RESTRICT,
FOREIGN KEY (encryption_key_id) REFERENCES encryption_keys(id) ON DELETE SET NULL
```

**Indexes:** `(report_definition_id, generated_at DESC)`, `(generated_by)`, `(access_token)`, `(expires_at WHERE is_archived=FALSE)`

#### Table: report_parameters
**Purpose:** Store common parameter sets

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
parameter_set_name VARCHAR(100) NOT NULL,
report_definition_id VARCHAR NOT NULL,
parameter_values JSONB NOT NULL,
is_default BOOLEAN DEFAULT FALSE,
created_by VARCHAR NOT NULL,
created_at TIMESTAMP DEFAULT NOW(),
FOREIGN KEY (report_definition_id) REFERENCES report_definitions(id) ON DELETE CASCADE,
FOREIGN KEY (created_by) REFERENCES users(id)
```

#### Table: report_generation_log
**Purpose:** Audit trail for report generation

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
report_instance_id VARCHAR NOT NULL,
log_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
log_level VARCHAR(20), -- INFO, WARNING, ERROR
log_message TEXT NOT NULL,
execution_context JSONB, -- {step: "data_fetching", records_processed: 500}
FOREIGN KEY (report_instance_id) REFERENCES report_instances(id) ON DELETE CASCADE
```

**Indexes:** `(report_instance_id, log_timestamp)`, `(log_level)`

---

### FEATURE 21: SECURE DOCUMENT SHARING (4 tables)

#### Table: shared_documents
**Purpose:** Time-limited secure document sharing

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
document_id VARCHAR NOT NULL,
shared_by VARCHAR NOT NULL,
share_purpose TEXT,
created_at TIMESTAMP NOT NULL DEFAULT NOW(),
expires_at TIMESTAMP NOT NULL,
max_access_count INTEGER, -- NULL = unlimited
current_access_count INTEGER DEFAULT 0,
share_status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, EXPIRED, REVOKED, EXHAUSTED
revoked_at TIMESTAMP,
revoked_by VARCHAR,
revocation_reason TEXT,
require_password BOOLEAN DEFAULT FALSE,
password_hash VARCHAR(255),
require_email_verification BOOLEAN DEFAULT TRUE,
watermark_enabled BOOLEAN DEFAULT TRUE,
download_allowed BOOLEAN DEFAULT FALSE,
print_allowed BOOLEAN DEFAULT FALSE,
FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
FOREIGN KEY (shared_by) REFERENCES users(id) ON DELETE RESTRICT,
FOREIGN KEY (revoked_by) REFERENCES users(id) ON DELETE SET NULL
```

**Indexes:** `(document_id)`, `(shared_by)`, `(expires_at, share_status)`, `(share_status)`

#### Table: document_access_tokens
**Purpose:** Generate unique access tokens

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
shared_document_id VARCHAR NOT NULL,
access_token VARCHAR(255) UNIQUE NOT NULL, -- Cryptographically secure random token
token_hash VARCHAR(64) NOT NULL, -- SHA-256 hash of token
created_at TIMESTAMP NOT NULL DEFAULT NOW(),
expires_at TIMESTAMP NOT NULL,
single_use BOOLEAN DEFAULT FALSE,
used BOOLEAN DEFAULT FALSE,
used_at TIMESTAMP,
used_by_email VARCHAR(255),
used_by_ip VARCHAR(45),
FOREIGN KEY (shared_document_id) REFERENCES shared_documents(id) ON DELETE CASCADE
```

**Indexes:** `(access_token)`, `(token_hash)`, `(shared_document_id)`, `(expires_at, used)`

#### Table: sharing_permissions
**Purpose:** Granular access control for shares

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
shared_document_id VARCHAR NOT NULL,
permission_type VARCHAR(50) NOT NULL, -- VIEW, DOWNLOAD, PRINT, ANNOTATE
granted BOOLEAN DEFAULT TRUE,
granted_to_email VARCHAR(255), -- Specific email restriction
granted_to_ip_range VARCHAR(100), -- IP restriction (CIDR notation)
granted_at TIMESTAMP DEFAULT NOW(),
granted_by VARCHAR,
FOREIGN KEY (shared_document_id) REFERENCES shared_documents(id) ON DELETE CASCADE,
FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE SET NULL
```

**Indexes:** `(shared_document_id, permission_type)`, `(granted_to_email)`

#### Table: share_access_audit
**Purpose:** Immutable audit trail of share access

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
shared_document_id VARCHAR NOT NULL,
access_token_id VARCHAR,
access_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
access_type VARCHAR(50) NOT NULL, -- VIEW, DOWNLOAD, PRINT, DENIED
accessor_email VARCHAR(255),
accessor_ip VARCHAR(45) NOT NULL,
accessor_user_agent TEXT,
access_granted BOOLEAN NOT NULL,
denial_reason VARCHAR(200),
session_duration_seconds INTEGER,
pages_viewed JSONB, -- Array of page numbers viewed
FOREIGN KEY (shared_document_id) REFERENCES shared_documents(id) ON DELETE RESTRICT,
FOREIGN KEY (access_token_id) REFERENCES document_access_tokens(id) ON DELETE SET NULL
```

**Indexes:** `(shared_document_id, access_timestamp DESC)`, `(accessor_email)`, `(access_timestamp DESC)`

**Immutability:** Prevent modifications via triggers (similar to audit_logs pattern)

---

### FEATURE 38: EXPORT SCHEDULING (4 tables)

#### Table: scheduled_exports
**Purpose:** Define recurring export jobs

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
schedule_name VARCHAR(200) NOT NULL,
export_type VARCHAR(50) NOT NULL, -- STUDENT_ROSTER, IMMUNIZATION_COMPLIANCE, MEDICAID_CLAIMS, etc.
export_format VARCHAR(20) DEFAULT 'CSV', -- CSV, EXCEL, JSON, XML, HL7, EDI
schedule_frequency VARCHAR(50) DEFAULT 'DAILY', -- HOURLY, DAILY, WEEKLY, MONTHLY, CUSTOM
schedule_cron_expression VARCHAR(100), -- For custom schedules
schedule_timezone VARCHAR(50) DEFAULT 'America/New_York',
next_run_time TIMESTAMP,
last_run_time TIMESTAMP,
is_active BOOLEAN DEFAULT TRUE,
export_filters JSONB, -- {school_id: "123", grade_levels: ["K", "1", "2"]}
destination_type VARCHAR(50), -- SFTP, S3, EMAIL, LOCAL_STORAGE, API_ENDPOINT
destination_config JSONB, -- Connection details
notification_emails JSONB, -- Send completion notification
encrypt_export BOOLEAN DEFAULT TRUE,
encryption_key_id VARCHAR,
retention_days INTEGER DEFAULT 30,
created_by VARCHAR NOT NULL,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW(),
FOREIGN KEY (encryption_key_id) REFERENCES encryption_keys(id),
FOREIGN KEY (created_by) REFERENCES users(id)
```

**Indexes:** `(is_active, next_run_time)`, `(export_type)`, `(created_by)`

#### Table: export_jobs
**Purpose:** Track individual export executions

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
scheduled_export_id VARCHAR, -- NULL for ad-hoc exports
export_config_id VARCHAR, -- Snapshot of config used
job_start_time TIMESTAMP NOT NULL DEFAULT NOW(),
job_end_time TIMESTAMP,
job_duration_seconds INTEGER GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (job_end_time - job_start_time))) STORED,
job_status VARCHAR(50) DEFAULT 'RUNNING', -- RUNNING, COMPLETED, FAILED, CANCELLED
triggered_by VARCHAR, -- User ID or "SYSTEM"
trigger_type VARCHAR(50), -- SCHEDULED, MANUAL, API
records_exported INTEGER DEFAULT 0,
file_path VARCHAR(500),
file_size_bytes BIGINT,
file_hash VARCHAR(64),
export_parameters JSONB, -- Parameters used
error_message TEXT,
warnings JSONB,
destination_delivery_status VARCHAR(50), -- PENDING, SENT, FAILED
delivery_confirmation TEXT,
FOREIGN KEY (scheduled_export_id) REFERENCES scheduled_exports(id) ON DELETE SET NULL,
FOREIGN KEY (export_config_id) REFERENCES export_configurations(id),
FOREIGN KEY (triggered_by) REFERENCES users(id) ON DELETE SET NULL
```

**Indexes:** `(scheduled_export_id, job_start_time DESC)`, `(job_status)`, `(job_start_time DESC)`

#### Table: export_history
**Purpose:** Long-term export history with aggregated metrics

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
export_job_id VARCHAR NOT NULL,
export_date DATE NOT NULL,
export_type VARCHAR(50) NOT NULL,
total_records INTEGER NOT NULL,
success BOOLEAN NOT NULL,
file_archived_path VARCHAR(500),
archival_date DATE,
purge_date DATE,
audit_checksum VARCHAR(64),
metadata JSONB,
FOREIGN KEY (export_job_id) REFERENCES export_jobs(id) ON DELETE RESTRICT
```

**Indexes:** `(export_date DESC)`, `(export_type, export_date)`, `(purge_date WHERE purge_date IS NOT NULL)`

#### Table: export_configurations
**Purpose:** Versioned export configuration snapshots

**Key Columns:**
```sql
id VARCHAR PRIMARY KEY,
scheduled_export_id VARCHAR NOT NULL,
config_version INTEGER NOT NULL,
config_snapshot JSONB NOT NULL, -- Complete config at time of export
effective_from TIMESTAMP NOT NULL DEFAULT NOW(),
effective_to TIMESTAMP,
is_current BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT NOW(),
FOREIGN KEY (scheduled_export_id) REFERENCES scheduled_exports(id) ON DELETE CASCADE,
UNIQUE (scheduled_export_id, config_version)
```

**Indexes:** `(scheduled_export_id, is_current)`, `(effective_from DESC)`

---

## New Enum Definitions

Add these enums to `/backend/src/database/types/enums.ts`:

```typescript
// Feature 30: PHI Disclosure Tracking
export enum PHIDisclosureType {
  TREATMENT = 'TREATMENT',
  PAYMENT = 'PAYMENT',
  HEALTHCARE_OPERATIONS = 'HEALTHCARE_OPERATIONS',
  PUBLIC_HEALTH = 'PUBLIC_HEALTH',
  ABUSE_NEGLECT = 'ABUSE_NEGLECT',
  JUDICIAL_PROCEEDING = 'JUDICIAL_PROCEEDING',
  LAW_ENFORCEMENT = 'LAW_ENFORCEMENT',
  RESEARCH = 'RESEARCH',
  PATIENT_REQUEST = 'PATIENT_REQUEST',
  DIRECTORY_LISTING = 'DIRECTORY_LISTING',
  EMERGENCY = 'EMERGENCY',
  OTHER = 'OTHER',
}

export enum DisclosureScope {
  MINIMUM_NECESSARY = 'MINIMUM_NECESSARY',
  FULL_RECORD = 'FULL_RECORD',
  PARTIAL = 'PARTIAL',
}

export enum RecipientType {
  INDIVIDUAL = 'INDIVIDUAL',
  ORGANIZATION = 'ORGANIZATION',
  GOVERNMENT_AGENCY = 'GOVERNMENT_AGENCY',
  INSURANCE_COMPANY = 'INSURANCE_COMPANY',
  HEALTHCARE_PROVIDER = 'HEALTHCARE_PROVIDER',
  ATTORNEY = 'ATTORNEY',
  COURT = 'COURT',
  PARENT_GUARDIAN = 'PARENT_GUARDIAN',
  SCHOOL_OFFICIAL = 'SCHOOL_OFFICIAL',
  OTHER = 'OTHER',
}

// Feature 32: Encryption
export enum EncryptionKeyStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  ROTATING = 'ROTATING',
  RETIRED = 'RETIRED',
  REVOKED = 'REVOKED',
  COMPROMISED = 'COMPROMISED',
}

export enum KeyRotationType {
  SCHEDULED = 'SCHEDULED',
  EMERGENCY = 'EMERGENCY',
  COMPROMISED = 'COMPROMISED',
  MANUAL = 'MANUAL',
  POLICY_CHANGE = 'POLICY_CHANGE',
}

export enum DataClassification {
  PHI = 'PHI',
  PII = 'PII',
  SENSITIVE = 'SENSITIVE',
  CONFIDENTIAL = 'CONFIDENTIAL',
  PUBLIC = 'PUBLIC',
}

// Feature 33: Tamper Alerts
export enum TamperAlertType {
  CHECKSUM_MISMATCH = 'CHECKSUM_MISMATCH',
  UNAUTHORIZED_MODIFICATION = 'UNAUTHORIZED_MODIFICATION',
  LOG_TAMPERING = 'LOG_TAMPERING',
  DELETED_RECORD = 'DELETED_RECORD',
  SUSPICIOUS_PATTERN = 'SUSPICIOUS_PATTERN',
}

export enum TamperAlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum TamperResolutionStatus {
  OPEN = 'OPEN',
  INVESTIGATING = 'INVESTIGATING',
  FALSE_POSITIVE = 'FALSE_POSITIVE',
  CONFIRMED = 'CONFIRMED',
  RESOLVED = 'RESOLVED',
}

// Feature 48: Drug Interactions
export enum DrugInteractionSeverity {
  MINOR = 'MINOR',
  MODERATE = 'MODERATE',
  MAJOR = 'MAJOR',
  CONTRAINDICATED = 'CONTRAINDICATED',
}

export enum DrugClass {
  ANALGESIC = 'ANALGESIC',
  ANTIBIOTIC = 'ANTIBIOTIC',
  ANTIHISTAMINE = 'ANTIHISTAMINE',
  ANTIHYPERTENSIVE = 'ANTIHYPERTENSIVE',
  BRONCHODILATOR = 'BRONCHODILATOR',
  STIMULANT = 'STIMULANT',
  INSULIN = 'INSULIN',
  OTHER = 'OTHER',
}

// Feature 37: Outbreak Detection
export enum OutbreakStatus {
  INVESTIGATING = 'INVESTIGATING',
  CONFIRMED = 'CONFIRMED',
  CONTAINED = 'CONTAINED',
  RESOLVED = 'RESOLVED',
}

export enum DiseaseCategory {
  RESPIRATORY = 'RESPIRATORY',
  GASTROINTESTINAL = 'GASTROINTESTINAL',
  SKIN_INFECTION = 'SKIN_INFECTION',
  COMMUNICABLE_DISEASE = 'COMMUNICABLE_DISEASE',
  VECTOR_BORNE = 'VECTOR_BORNE',
}

// Feature 26: Real-Time Alerts
export enum AlertPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
  EMERGENCY = 'EMERGENCY',
}

export enum AlertStatus {
  ACTIVE = 'ACTIVE',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  ESCALATED = 'ESCALATED',
  RESOLVED = 'RESOLVED',
  EXPIRED = 'EXPIRED',
}

export enum AlertDeliveryChannel {
  IN_APP = 'IN_APP',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  VOICE = 'VOICE',
}

// Feature 17: Clinic Visits
export enum VisitSeverityTriage {
  ROUTINE = 'ROUTINE',
  URGENT = 'URGENT',
  EMERGENCY = 'EMERGENCY',
}

// Feature 44: Medicaid Billing
export enum MedicaidEligibilityStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  EXPIRED = 'EXPIRED',
  DENIED = 'DENIED',
}

export enum ClaimStatus {
  DRAFT = 'DRAFT',
  READY = 'READY',
  SUBMITTED = 'SUBMITTED',
  PENDING = 'PENDING',
  PAID = 'PAID',
  DENIED = 'DENIED',
  ADJUSTED = 'ADJUSTED',
}

// Feature 43: State Registry
export enum RegistryType {
  IMMUNIZATION = 'IMMUNIZATION',
  BIRTH_DEFECTS = 'BIRTH_DEFECTS',
  REPORTABLE_DISEASE = 'REPORTABLE_DISEASE',
}

export enum HL7MessageType {
  VXU = 'VXU', // Vaccination update
  QBP = 'QBP', // Query by parameter
  RSP = 'RSP', // Response
  ADT = 'ADT', // Admission/discharge/transfer
}

// Feature 42: SIS Integration
export enum SISVendor {
  POWERSCHOOL = 'POWERSCHOOL',
  INFINITE_CAMPUS = 'INFINITE_CAMPUS',
  SKYWARD = 'SKYWARD',
  ASPEN = 'ASPEN',
  SYNERGY = 'SYNERGY',
  ESCHOOL = 'ESCHOOL',
  OTHER = 'OTHER',
}

export enum SyncDirection {
  IMPORT_ONLY = 'IMPORT_ONLY',
  EXPORT_ONLY = 'EXPORT_ONLY',
  BIDIRECTIONAL = 'BIDIRECTIONAL',
}

// Feature 35: Reports
export enum ReportCategory {
  HEALTH = 'HEALTH',
  IMMUNIZATION = 'IMMUNIZATION',
  COMPLIANCE = 'COMPLIANCE',
  INCIDENT = 'INCIDENT',
  MEDICATION = 'MEDICATION',
  ANALYTICS = 'ANALYTICS',
  CUSTOM = 'CUSTOM',
}

export enum ReportGenerationStatus {
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

// Feature 38: Export Scheduling
export enum ExportFormat {
  CSV = 'CSV',
  EXCEL = 'EXCEL',
  JSON = 'JSON',
  XML = 'XML',
  HL7 = 'HL7',
  EDI = 'EDI',
  PDF = 'PDF',
}

export enum ExportDestinationType {
  SFTP = 'SFTP',
  S3 = 'S3',
  EMAIL = 'EMAIL',
  LOCAL_STORAGE = 'LOCAL_STORAGE',
  API_ENDPOINT = 'API_ENDPOINT',
}
```

---

## Implementation Checklist

### Phase 1: Compliance & Security (Week 1-2)
- [ ] Add new enums to `enums.ts`
- [ ] Create migration `00020-create-phi-disclosure-tracking.ts`
- [ ] Create models: `PHIDisclosure`, `PHIDisclosureRecipient`, `PHIDisclosureAudit`
- [ ] Test PHI disclosure tracking with seed data
- [ ] Create migration `00021-create-encryption-key-management.ts`
- [ ] Create models: `EncryptionKey`, `KeyRotationHistory`, `EncryptedFieldMetadata`
- [ ] Implement key rotation automation
- [ ] Create migration `00022-create-tamper-alert-system.ts`
- [ ] Create models: `TamperAlert`, `DataIntegrityChecksum`, `AlertResponseLog`
- [ ] Implement checksum verification triggers

### Phase 2: Clinical Safety (Week 3-5)
- [ ] Create migration `00023-create-drug-interaction-checker.ts`
- [ ] Create models: `DrugCatalog`, `DrugInteraction`, `InteractionSeverityLevel`, `StudentDrugAllergyXref`
- [ ] Import FDA drug interaction database
- [ ] Create migration `00024-create-outbreak-detection.ts`
- [ ] Create models: `OutbreakPattern`, `SymptomTracking`, `OutbreakAlert`, `OutbreakCaseCluster`
- [ ] Implement outbreak detection algorithms
- [ ] Create migration `00025-create-real-time-alerts.ts`
- [ ] Create models: `AlertDefinition`, `AlertInstance`, `AlertSubscription`, `AlertDeliveryLog`
- [ ] Integrate with Socket.io for WebSocket publishing

### Phase 3: Operations (Week 6-8)
- [ ] Create migration `00026-create-clinic-visit-tracking.ts`
- [ ] Create models: `ClinicVisit`, `VisitReason`, `ClassTimeMissed`
- [ ] Create materialized view: `visit_frequency_analytics`
- [ ] Create migration `00027-create-immunization-reminders.ts`
- [ ] Create models: `ImmunizationReminder`, `VaccinationSchedule`, `ReminderDeliveryStatus`
- [ ] Create materialized view: `compliance_dashboard_cache`
- [ ] Implement reminder scheduling job

### Phase 4: Integration (Week 9-12)
- [ ] Create migration `00028-create-medicaid-billing.ts`
- [ ] Create models: `MedicaidEligibility`, `BillingClaim`, `ClaimLineItem`, `ClaimSubmission`, `PaymentTracking`
- [ ] Implement CMS-1500 form generation
- [ ] Implement HIPAA 837P EDI generation
- [ ] Create migration `00029-create-state-registry-integration.ts`
- [ ] Create models: `RegistryConnection`, `RegistrySubmission`, `RegistryResponse`, `SubmissionErrorLog`
- [ ] Implement HL7 v2.5.1 message generation
- [ ] Create migration `00030-create-sis-integration.ts`
- [ ] Create models: `SISSyncConfig`, `SISSyncJob`, `SISFieldMapping`, `SISSyncError`
- [ ] Implement SIS vendor API connectors

### Phase 5: Reporting (Week 13-16)
- [ ] Create migration `00031-create-pdf-reports-metadata.ts`
- [ ] Create models: `ReportDefinition`, `ReportInstance`, `ReportParameter`, `ReportGenerationLog`
- [ ] Integrate jsPDF library
- [ ] Create migration `00032-create-secure-document-sharing.ts`
- [ ] Create models: `SharedDocument`, `DocumentAccessToken`, `SharingPermission`, `ShareAccessAudit`
- [ ] Implement token generation and expiration
- [ ] Create migration `00033-create-export-scheduling.ts`
- [ ] Create models: `ScheduledExport`, `ExportJob`, `ExportHistory`, `ExportConfiguration`
- [ ] Implement cron-based job scheduler

### Testing & Validation
- [ ] Test all migrations (up and down)
- [ ] Test all model validations
- [ ] Verify all foreign key constraints
- [ ] Verify all indexes created
- [ ] Load test high-volume tables (audit logs, clinic visits)
- [ ] Test materialized view refresh
- [ ] Test immutability triggers (audit tables, tamper alerts)
- [ ] Verify HIPAA compliance requirements
- [ ] Performance benchmark queries

### Documentation
- [ ] Update API documentation for new endpoints
- [ ] Create database schema diagrams
- [ ] Document data retention policies
- [ ] Document encryption key rotation procedures
- [ ] Create administrator guides for each feature

---

## Performance Optimization Notes

### Partitioning Strategy
- **audit_logs:** Partition by month
- **clinic_visits:** Partition by academic year
- **alert_instances:** Partition by quarter
- **symptom_tracking:** Partition by semester

### Materialized View Refresh Schedule
- **visit_frequency_analytics:** Daily at midnight
- **compliance_dashboard_cache:** Nightly + on-demand after vaccination entry
- **outbreak_case_clusters:** Hourly during outbreak investigations

### Index Maintenance
- **Weekly:** REINDEX all GIN indexes (JSONB columns)
- **Monthly:** VACUUM ANALYZE all tables
- **Quarterly:** Review unused indexes and slow queries

---

## Security Considerations

### Encryption at Rest
- All PHI fields encrypted with field-level encryption
- Encryption keys rotated quarterly
- Key rotation history preserved for decryption of historical data

### Access Control
- Row-level security (RLS) for multi-tenancy
- Column-level permissions for sensitive fields
- All PHI access logged automatically

### Audit Requirements
- All CRUD operations logged via Sequelize hooks
- Immutable audit tables (beforeUpdate/beforeDestroy triggers)
- 6-year retention for HIPAA compliance

---

## Contact & Support

**Task ID:** DB7K3M  
**Database Architect Agent**  
**Documentation Location:** `/home/user/white-cross/.temp/`

For implementation questions, refer to:
- **Architecture Notes:** `.temp/architecture-notes-DB7K3M.md`
- **Detailed Plan:** `.temp/plan-DB7K3M.md`
- **Task Status:** `.temp/task-status-DB7K3M.json`
- **Progress Tracking:** `.temp/progress-DB7K3M.md`

---

**End of Database Schema Summary**
