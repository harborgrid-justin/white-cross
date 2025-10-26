# White Cross Platform - 15 Feature Integration & Coordination Plan

**Project:** White Cross Healthcare Platform
**Analysis Date:** October 26, 2025
**Planning Horizon:** 20 Weeks (5 Months)
**Team Size:** 5-6 Developers + 1 QA Engineer
**Priority:** CRITICAL - Production Launch Blockers

---

## Executive Summary

This document provides a comprehensive implementation roadmap for 15 critical features identified in the gap analysis. The plan prioritizes compliance, patient safety, and operational efficiency while minimizing technical debt and integration risks.

**Current Infrastructure Status:**
- WebSocket infrastructure: **READY** (Socket.io client/server installed)
- PDF libraries: **READY** (jsPDF + html2pdf.js installed)
- Backend APIs: **90% complete**
- Frontend UI: **35% complete**
- Database models: **85% complete**

**Total Estimated Effort:** 16-20 weeks with parallel workstreams

---

## 1. Implementation Order & Dependencies

### Phase 1: Foundation & Infrastructure (Weeks 1-4)
**Goal:** Build shared components and infrastructure needed by multiple features

#### Week 1-2: Core Infrastructure
1. **PDF Report Service** (BLOCKER for features 10, 35, 36, 37)
   - Status: Libraries installed, need service layer
   - Dependencies: None
   - Blockers: Features 10, 35, 36, 37
   - Priority: CRITICAL

2. **WebSocket Real-Time Service Enhancement** (BLOCKER for features 6, 26)
   - Status: Basic WebSocket exists, needs health-specific events
   - Dependencies: None
   - Blockers: Features 6, 26, 5
   - Priority: CRITICAL

3. **Encryption Status UI Components** (BLOCKER for feature 2)
   - Status: Backend encryption exists, no UI
   - Dependencies: None
   - Blockers: Feature 2, 12
   - Priority: CRITICAL

#### Week 3-4: Compliance Foundation
4. **PHI Disclosure Tracking System** (Feature 30)
   - Status: No implementation
   - Dependencies: Audit logging (exists)
   - Impact: HIPAA compliance requirement
   - Priority: CRITICAL

5. **Tamper Alert System** (Feature 33)
   - Status: Backend checksum exists, no UI
   - Dependencies: WebSocket service (Week 1-2)
   - Impact: Security requirement
   - Priority: CRITICAL

### Phase 2: Patient Safety Features (Weeks 5-8)
**Goal:** Implement critical patient safety and clinical features

#### Week 5-7: Clinical Safety
6. **Drug Interaction Checker** (Feature 48)
   - Status: Skeleton only
   - Dependencies: External drug reference API integration
   - Impact: Patient safety CRITICAL
   - Priority: CRITICAL
   - Components: Search, checker, dose calculator

7. **Outbreak Detection System** (Feature 37)
   - Status: Not implemented
   - Dependencies: Analytics foundation, chart library (Recharts exists)
   - Impact: Public health safety
   - Priority: CRITICAL

#### Week 8: Real-Time Alerts
8. **Real-Time Health Alerts** (Feature 26)
   - Status: No implementation
   - Dependencies: WebSocket service (Week 1-2), Outbreak detection (Week 5-7)
   - Impact: Emergency response
   - Priority: CRITICAL

### Phase 3: Operations & Clinical Workflows (Weeks 9-12)
**Goal:** Complete core clinical and operational features

#### Week 9-10: Clinical Tracking
9. **Clinic Visit Tracking** (Feature 17)
   - Status: 0% implemented
   - Dependencies: Student health records (exists)
   - Impact: Operations workflow
   - Priority: HIGH

10. **Immunization Dashboard** (Feature 41)
    - Status: API ready, no UI
    - Dependencies: Chart library (exists), PDF service (Week 1-2)
    - Impact: Compliance tracking
    - Priority: CRITICAL

#### Week 11-12: Immunization UI
11. **Immunization UI Components** (Feature 5)
    - Status: API complete, UI stubs
    - Dependencies: Immunization dashboard (Week 9-10)
    - Impact: Clinical workflow
    - Priority: HIGH
    - Components: Vaccine history, reminders, compliance charts, exemptions

### Phase 4: Financial & Integration (Weeks 13-16)
**Goal:** Revenue generation and external integrations

#### Week 13-14: PDF Reporting
12. **PDF Report Generation** (Features 35, 36)
    - Status: Library installed, no implementation
    - Dependencies: PDF service (Week 1-2), charts (exists)
    - Impact: Reporting requirement
    - Priority: HIGH

#### Week 15-16: Financial Integration
13. **Medicaid Billing UI** (Feature 44)
    - Status: Backend API 90% complete, no UI
    - Dependencies: PDF reports (Week 13-14)
    - Impact: Revenue generation
    - Priority: CRITICAL
    - Components: Eligibility checks, claims submission, payment tracking

### Phase 5: Document & Data Management (Weeks 17-20)
**Goal:** Complete document management and external integrations

#### Week 17-18: Document Security
14. **Secure Document Sharing** (Feature 21)
    - Status: All stubs
    - Dependencies: Encryption UI (Week 1-2), audit logging (exists)
    - Impact: HIPAA compliance
    - Priority: HIGH

15. **Export Scheduling** (Feature 38)
    - Status: Placeholder only
    - Dependencies: PDF service, schedulers (exists)
    - Impact: Operations efficiency
    - Priority: MEDIUM

#### Week 19-20: External Integrations
16. **State Registry Integration** (Feature 43)
    - Status: Backend exists, no UI
    - Dependencies: Error handling, PDF reports
    - Impact: Compliance requirement
    - Priority: HIGH

17. **SIS Integration UI** (Feature 42)
    - Status: Backend API 90%, no UI
    - Dependencies: Export scheduling (Week 17-18)
    - Impact: Data sync efficiency
    - Priority: MEDIUM

---

## 2. Shared Components to Build First

### Priority 1: Foundation Components (Week 1)

#### A. PDF Service Layer
```typescript
// Location: /frontend/src/services/pdf/PDFService.ts
// Dependencies: jsPDF (installed), html2pdf.js (installed)
// Used by: Features 10, 12, 13, 16

PDFService {
  - generateStudentHealthReport(studentId)
  - generateImmunizationReport(studentId)
  - generateMedicaidClaim(claimData)
  - generateComplianceReport(reportData)
  - generateCustomReport(template, data)
  - addWatermark(doc, text)
  - addHeaderFooter(doc, metadata)
  - exportToBlob(doc)
  - downloadPDF(doc, filename)
}
```

**Implementation Tasks:**
- Create PDF service class with jsPDF wrapper
- Build reusable report templates
- Add HIPAA-compliant watermarking
- Implement print preview component
- Create PDF export hooks for React

#### B. Real-Time Alert Components
```typescript
// Location: /frontend/src/components/alerts/
// Dependencies: WebSocketService (exists), Tailwind CSS
// Used by: Features 6, 5, 7, 8, 11

Components:
- <AlertBanner severity="critical|high|medium|low" />
- <AlertNotification type="emergency|health|medication" />
- <AlertCenter /> // Centralized alert dashboard
- <AlertSound /> // Audio notification component
- <AlertBadge count={unreadCount} />
```

**Implementation Tasks:**
- Create alert UI component library
- Integrate with WebSocket service
- Add browser notification API support
- Implement alert priority queue
- Create alert history viewer
- Add sound/visual indicators

#### C. Encryption Status Indicators
```typescript
// Location: /frontend/src/components/security/
// Dependencies: Backend encryption API (exists)
// Used by: Features 2, 12, 14

Components:
- <EncryptionBadge status="encrypted|unencrypted" />
- <EncryptionIndicator type="at-rest|in-transit|e2e" />
- <KeyRotationStatus lastRotated={date} nextRotation={date} />
- <EncryptionSettings /> // User-facing controls
```

### Priority 2: Data Visualization Components (Week 2)

#### D. Chart Components (Extend Recharts)
```typescript
// Location: /frontend/src/components/charts/
// Dependencies: Recharts (installed)
// Used by: Features 7, 10, 11

Components:
- <OutbreakSpikesChart data={healthTrends} />
- <ImmunizationComplianceChart data={compliance} />
- <ClinicVisitTrendsChart data={visits} />
- <VaccineCoverageChart data={coverage} />
- <HealthMetricsTimeline data={metrics} />
```

#### E. Form Builder Components
```typescript
// Location: /frontend/src/components/forms/
// Dependencies: React Hook Form (installed), Zod (installed)
// Used by: Features 1, 4, 11, 13

Components:
- <DynamicForm schema={zodSchema} />
- <FormSection title={string} collapsible />
- <PHIField encrypted={boolean} auditLog={boolean} />
- <SignatureCapture onSign={handler} />
- <DateTimePicker required={boolean} />
- <FileUploadZone accept={mimeTypes} encrypted />
```

### Priority 3: Integration Components (Week 3-4)

#### F. External API Adapters
```typescript
// Location: /frontend/src/services/integrations/
// Used by: Features 6, 13, 16, 17

Adapters:
- DrugReferenceAdapter (Feature 6)
  - checkInteractions(medications[])
  - getDoseCalculation(drug, weight, age)
  - getSideEffects(drugId)

- MedicaidAPIAdapter (Feature 13)
  - checkEligibility(studentId, medicaidId)
  - submitClaim(claimData)
  - getClaimStatus(claimId)

- StateRegistryAdapter (Feature 16)
  - submitImmunizationRecord(record)
  - queryStudentRecords(studentId)
  - getComplianceStatus(studentId)

- SISAdapter (Feature 17)
  - syncStudentDemographics()
  - exportAttendanceData()
  - importEnrollmentData()
```

---

## 3. Common Utilities and Helpers Needed

### A. Data Processing Utilities

```typescript
// Location: /frontend/src/utils/data/

// PHI Detection & Sanitization
export const phiUtils = {
  detectPHI(text: string): boolean
  sanitizePHI(data: any): any
  maskPHI(text: string): string
  validatePHIAccess(userId: string, resourceId: string): boolean
}

// Date/Time Formatting
export const dateUtils = {
  formatHealthcareDate(date: Date): string // MM/DD/YYYY HH:mm format
  calculateAge(birthDate: Date): number
  isVaccineOverdue(dueDate: Date, gracePeroid: number): boolean
  formatDuration(start: Date, end: Date): string
}

// Clinical Calculations
export const clinicalUtils = {
  calculateBMI(weight: number, height: number): number
  calculateDosage(weight: number, dosagePerKg: number): number
  interpretGrowthPercentile(value: number, age: number, gender: string): string
  validateVitalSigns(vitals: VitalSigns): ValidationResult
}

// Encryption Helpers
export const encryptionUtils = {
  encryptFieldClientSide(data: string, publicKey: string): string
  decryptFieldClientSide(encryptedData: string, privateKey: string): string
  generateKeyPair(): { publicKey: string; privateKey: string }
  verifyChecksum(data: any, checksum: string): boolean
}
```

### B. Validation & Compliance Utilities

```typescript
// Location: /frontend/src/utils/validation/

// HIPAA Compliance Validators
export const hipaaValidators = {
  validatePHIAccess(userId: string, action: string, resourceId: string): boolean
  logPHIDisclosure(disclosure: PHIDisclosure): Promise<void>
  validateConsentForAccess(studentId: string, userId: string): boolean
  checkDataSharingPermissions(data: any, recipientId: string): boolean
}

// Healthcare Data Validators
export const healthcareValidators = {
  validateNPI(npi: string): boolean
  validateICD10Code(code: string): boolean
  validateCPTCode(code: string): boolean
  validateMedicaidId(id: string): boolean
  validateVaccineCode(code: string): boolean // CVX codes
  validateLOINC(code: string): boolean
}

// Form Validators (Zod schemas)
export const formSchemas = {
  immunizationRecordSchema: z.object({ ... })
  clinicVisitSchema: z.object({ ... })
  medicaidClaimSchema: z.object({ ... })
  drugInteractionCheckSchema: z.object({ ... })
  phiDisclosureSchema: z.object({ ... })
}
```

### C. Real-Time Communication Utilities

```typescript
// Location: /frontend/src/utils/realtime/

// WebSocket Event Helpers
export const wsHelpers = {
  emitHealthAlert(alert: HealthAlert): void
  emitEmergencyAlert(emergency: EmergencyAlert): void
  subscribeToStudentUpdates(studentId: string): void
  unsubscribeFromStudentUpdates(studentId: string): void
  broadcastMedicationReminder(reminder: MedicationReminder): void
}

// Notification Helpers
export const notificationHelpers = {
  showDesktopNotification(title: string, body: string, severity: Severity): void
  playAlertSound(severity: Severity): void
  createNotificationWithAction(notification: Notification): void
  requestNotificationPermission(): Promise<boolean>
}
```

---

## 4. Integration Points Between Features

### Critical Integration Map

```
PHI Disclosure Tracking (F1)
├── Integrates with: Encryption UI (F2), Secure Doc Sharing (F14)
├── Provides: Audit trail for all PHI access
└── Consumes: Audit logging service (exists)

Encryption UI (F2)
├── Integrates with: Secure Doc Sharing (F14), Medicaid Billing (F13)
├── Provides: Visual encryption indicators, key management
└── Consumes: Backend encryption service (exists)

Real-Time Alerts (F6)
├── Integrates with: Outbreak Detection (F7), Drug Checker (F4), Clinic Visits (F8)
├── Provides: WebSocket notification infrastructure
└── Consumes: WebSocket service (exists)

Drug Interaction Checker (F4)
├── Integrates with: Real-Time Alerts (F6), Medication module (exists)
├── Provides: Safety checking for medication administration
└── Consumes: External drug reference API

Outbreak Detection (F7)
├── Integrates with: Real-Time Alerts (F6), Clinic Visits (F8), Analytics (exists)
├── Provides: Spike detection, trend analysis
└── Consumes: Health records, clinic visit data

Clinic Visit Tracking (F8)
├── Integrates with: Outbreak Detection (F7), PDF Reports (F10), Analytics (exists)
├── Provides: Visit analytics, attendance patterns
└── Consumes: Student health records (exists)

Immunization Dashboard (F9)
├── Integrates with: Immunization UI (F11), PDF Reports (F10), State Registry (F16)
├── Provides: Compliance tracking, coverage visualization
└── Consumes: Vaccination records (exists)

Immunization UI (F11)
├── Integrates with: Immunization Dashboard (F9), State Registry (F16), Real-Time Alerts (F6)
├── Provides: Vaccine entry, reminder scheduling, exemption tracking
└── Consumes: Vaccination records, WebSocket alerts

PDF Reports (F10)
├── Integrates with: All reporting features, Medicaid Billing (F13), Export (F15)
├── Provides: Universal PDF generation service
└── Consumes: Report data from all modules

Medicaid Billing (F13)
├── Integrates with: PDF Reports (F10), Encryption UI (F2), Clinic Visits (F8)
├── Provides: Revenue generation, claims management
└── Consumes: Service documentation, eligibility data

Secure Document Sharing (F14)
├── Integrates with: Encryption UI (F2), PHI Tracking (F1), PDF Reports (F10)
├── Provides: HIPAA-compliant document distribution
└── Consumes: Document service (exists), encryption service

State Registry Integration (F16)
├── Integrates with: Immunization UI (F11), Immunization Dashboard (F9), PDF Reports (F10)
├── Provides: Automated compliance reporting
└── Consumes: Vaccination records, state APIs

Export Scheduling (F15)
├── Integrates with: PDF Reports (F10), SIS Integration (F17), All data modules
├── Provides: Automated data export, scheduled reports
└── Consumes: Scheduler service (exists), export APIs

SIS Integration (F17)
├── Integrates with: Export Scheduling (F15), Student module (exists)
├── Provides: Bidirectional student data sync
└── Consumes: SIS APIs, student demographics
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                      │
├─────────────────────────────────────────────────────────────┤
│ Immunization UI │ Clinic Visits │ Drug Checker │ Medicaid   │
│ Alert Center    │ Reports       │ Doc Sharing  │ SIS Sync   │
└────────┬────────────────┬───────────────┬──────────────┬────┘
         │                │               │              │
    ┌────┴────────────────┴───────────────┴──────────────┴───┐
    │              Shared Component Layer                     │
    ├─────────────────────────────────────────────────────────┤
    │ Alert Components │ PDF Service │ Encryption UI │ Forms  │
    │ Chart Library    │ Validation  │ PHI Utils     │        │
    └────┬────────────────┬───────────────┬──────────────┬────┘
         │                │               │              │
    ┌────┴────────────────┴───────────────┴──────────────┴───┐
    │                  Service Layer                          │
    ├─────────────────────────────────────────────────────────┤
    │ WebSocket │ Redux Store │ TanStack Query │ API Client   │
    │ PDF Gen   │ Audit Log   │ Encryption     │ External APIs│
    └────┬────────────────┬───────────────┬──────────────┬────┘
         │                │               │              │
    ┌────┴────────────────┴───────────────┴──────────────┴───┐
    │                   Backend APIs                          │
    ├─────────────────────────────────────────────────────────┤
    │ Vaccination │ Clinic Visit │ Medicaid │ Drug Reference  │
    │ Audit Trail │ Documents    │ SIS API  │ State Registry  │
    └─────────────────────────────────────────────────────────┘
```

---

## 5. Testing Dependencies and Order

### Testing Strategy by Phase

#### Phase 1: Foundation Testing (Weeks 1-4)
```
Week 1-2: Unit Tests
├── PDF Service unit tests
│   ├── Test PDF generation with mock data
│   ├── Test template rendering
│   ├── Test watermark application
│   └── Test export functionality
│
├── WebSocket service tests
│   ├── Test connection/disconnection
│   ├── Test event emission
│   ├── Test reconnection logic
│   └── Test health alert events
│
└── Encryption UI component tests
    ├── Test encryption indicator rendering
    ├── Test status updates
    └── Test user controls

Week 3-4: Integration Tests
├── PHI disclosure tracking
│   ├── Test disclosure logging
│   ├── Test audit trail creation
│   └── Test compliance reporting
│
└── Tamper alert system
    ├── Test checksum validation
    ├── Test alert triggering
    └── Test WebSocket notification
```

#### Phase 2: Patient Safety Testing (Weeks 5-8)
```
Week 5-7: Critical Safety Tests
├── Drug interaction checker
│   ├── Test interaction detection
│   ├── Test dose calculation accuracy
│   ├── Test alert triggering
│   └── Test external API integration
│
├── Outbreak detection
│   ├── Test spike detection algorithm
│   ├── Test trend analysis
│   ├── Test threshold configuration
│   └── Test historical data analysis
│
└── Real-time alerts
    ├── Test alert delivery latency (<1s)
    ├── Test alert priority handling
    ├── Test cross-browser notifications
    └── Test audio/visual indicators

Week 8: Safety Integration Tests
├── End-to-end medication workflow
│   ├── Admin → Drug check → Alert → Log
│
├── Outbreak detection workflow
│   ├── Visit entry → Analysis → Alert → Report
│
└── Emergency alert workflow
    ├── Trigger → Broadcast → Acknowledgment → Log
```

#### Phase 3: Clinical Workflow Testing (Weeks 9-12)
```
Week 9-10: Operational Tests
├── Clinic visit tracking
│   ├── Test check-in/check-out
│   ├── Test visit analytics
│   ├── Test attendance reports
│   └── Test data export
│
├── Immunization dashboard
│   ├── Test compliance calculations
│   ├── Test chart rendering
│   ├── Test PDF export
│   └── Test real-time updates
│
└── Immunization UI
    ├── Test vaccine entry forms
    ├── Test reminder scheduling
    ├── Test exemption workflow
    └── Test state registry sync

Week 11-12: Clinical Integration Tests
├── Complete immunization workflow
│   ├── Entry → Dashboard → Reminder → Report → Registry
│
└── Visit tracking workflow
    ├── Check-in → Care → Check-out → Analytics → Report
```

#### Phase 4: Financial & Integration Testing (Weeks 13-16)
```
Week 13-14: Report Generation Tests
├── PDF report service
│   ├── Test all report templates
│   ├── Test HIPAA compliance (watermarks, encryption)
│   ├── Test batch generation
│   └── Test performance (>100 reports/min)
│
└── Report integration tests
    ├── Test data aggregation
    ├── Test scheduled generation
    └── Test distribution

Week 15-16: Financial Integration Tests
├── Medicaid billing workflow
│   ├── Eligibility → Service → Claim → Submission → Payment
│   ├── Test error handling
│   ├── Test rejection workflow
│   └── Test payment tracking
│
└── External API integration tests
    ├── Test Medicaid API connectivity
    ├── Test claim submission
    ├── Test status polling
    └── Test error recovery
```

#### Phase 5: Data Management Testing (Weeks 17-20)
```
Week 17-18: Security & Export Tests
├── Secure document sharing
│   ├── Test encryption end-to-end
│   ├── Test access control
│   ├── Test audit logging
│   └── Test document expiration
│
├── Export scheduling
│   ├── Test scheduled exports
│   ├── Test format conversion
│   ├── Test delivery methods
│   └── Test error handling
│
└── Integration tests
    ├── Document lifecycle: Create → Share → Access → Expire
    └── Export workflow: Schedule → Generate → Deliver → Confirm

Week 19-20: External Integration Tests
├── State registry integration
│   ├── Test record submission
│   ├── Test query responses
│   ├── Test error handling
│   └── Test batch operations
│
├── SIS integration
│   ├── Test data sync (one-way, two-way)
│   ├── Test conflict resolution
│   ├── Test enrollment triggers
│   └── Test manual overrides
│
└── Complete integration tests
    ├── Student enrollment → SIS sync → Health record → Registry
    └── Data export → Schedule → Format → SIS delivery
```

### Test Coverage Requirements

```
Unit Tests: 95% line coverage, 90% branch coverage
Integration Tests: All critical user workflows
E2E Tests: Happy path + error scenarios for each feature
Performance Tests:
  - WebSocket latency: <100ms
  - PDF generation: <2s per report
  - Drug checker response: <500ms
  - Dashboard load: <1s

Security Tests:
  - PHI access auditing: 100% coverage
  - Encryption validation: All PHI fields
  - Access control: All protected routes
  - SQL injection: All user inputs
```

---

## 6. Database Migration Sequence

### Migration Order & Dependencies

```sql
-- Phase 1: Foundation (Week 1-2)

-- Migration 20: PHI Disclosure Tracking
CREATE TABLE phi_disclosures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disclosed_by_user_id UUID NOT NULL REFERENCES users(id),
  student_id UUID NOT NULL REFERENCES students(id),
  disclosure_type VARCHAR(50) NOT NULL, -- 'consent', 'treatment', 'operations', 'legal'
  disclosed_to VARCHAR(255) NOT NULL, -- recipient name/organization
  disclosure_reason TEXT NOT NULL,
  phi_categories TEXT[], -- ['demographics', 'diagnoses', 'medications', etc.]
  disclosure_date TIMESTAMP NOT NULL DEFAULT NOW(),
  consent_form_id UUID REFERENCES consent_forms(id),
  document_id UUID REFERENCES documents(id),
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_phi_disclosures_student ON phi_disclosures(student_id);
CREATE INDEX idx_phi_disclosures_user ON phi_disclosures(disclosed_by_user_id);
CREATE INDEX idx_phi_disclosures_date ON phi_disclosures(disclosure_date DESC);

-- Migration 21: Tamper Detection
ALTER TABLE audit_logs ADD COLUMN checksum VARCHAR(64);
ALTER TABLE audit_logs ADD COLUMN tamper_detected BOOLEAN DEFAULT false;
ALTER TABLE audit_logs ADD COLUMN verified_at TIMESTAMP;

CREATE TABLE tamper_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_log_id UUID NOT NULL REFERENCES audit_logs(id),
  detected_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expected_checksum VARCHAR(64) NOT NULL,
  actual_checksum VARCHAR(64) NOT NULL,
  severity VARCHAR(20) NOT NULL DEFAULT 'HIGH',
  investigated_by_user_id UUID REFERENCES users(id),
  investigation_notes TEXT,
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tamper_alerts_unresolved ON tamper_alerts(resolved) WHERE resolved = false;

-- Phase 2: Clinical Features (Week 5-8)

-- Migration 22: Drug Interactions
CREATE TABLE drug_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_a_id UUID NOT NULL REFERENCES medications(id),
  medication_b_id UUID NOT NULL,
  interaction_severity VARCHAR(20) NOT NULL, -- 'MINOR', 'MODERATE', 'MAJOR', 'CONTRAINDICATED'
  interaction_type VARCHAR(50) NOT NULL, -- 'pharmacodynamic', 'pharmacokinetic'
  clinical_effects TEXT NOT NULL,
  management_recommendations TEXT,
  reference_source VARCHAR(255),
  last_updated TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_drug_interactions_meds ON drug_interactions(medication_a_id, medication_b_id);

CREATE TABLE drug_interaction_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id),
  checked_by_user_id UUID NOT NULL REFERENCES users(id),
  medications_checked JSONB NOT NULL, -- array of medication IDs
  interactions_found JSONB, -- array of interaction details
  severity VARCHAR(20), -- highest severity found
  override_reason TEXT,
  check_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_drug_checks_student ON drug_interaction_checks(student_id);
CREATE INDEX idx_drug_checks_timestamp ON drug_interaction_checks(check_timestamp DESC);

-- Migration 23: Clinic Visits
CREATE TABLE clinic_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id),
  visit_date DATE NOT NULL,
  check_in_time TIMESTAMP NOT NULL,
  check_out_time TIMESTAMP,
  visit_reason VARCHAR(100) NOT NULL, -- 'illness', 'injury', 'medication', 'screening', 'other'
  chief_complaint TEXT,
  visit_type VARCHAR(50) NOT NULL DEFAULT 'walk-in', -- 'walk-in', 'scheduled', 'emergency'
  attended_by_user_id UUID REFERENCES users(id),
  class_missed VARCHAR(100), -- class period or subject
  referred_to VARCHAR(255), -- 'parent', 'hospital', 'doctor', etc.
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_notes TEXT,
  duration_minutes INTEGER,
  health_record_id UUID REFERENCES health_records(id),
  temperature DECIMAL(4,1),
  blood_pressure VARCHAR(20),
  heart_rate INTEGER,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clinic_visits_student ON clinic_visits(student_id);
CREATE INDEX idx_clinic_visits_date ON clinic_visits(visit_date DESC);
CREATE INDEX idx_clinic_visits_reason ON clinic_visits(visit_reason);
CREATE INDEX idx_clinic_visits_follow_up ON clinic_visits(follow_up_required) WHERE follow_up_required = true;

-- Migration 24: Outbreak Detection
CREATE TABLE health_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  trend_date DATE NOT NULL,
  condition_type VARCHAR(100) NOT NULL, -- 'flu', 'stomach_bug', 'head_lice', etc.
  case_count INTEGER NOT NULL DEFAULT 0,
  baseline_count INTEGER NOT NULL DEFAULT 0,
  spike_detected BOOLEAN DEFAULT false,
  spike_threshold_exceeded DECIMAL(5,2), -- percentage above baseline
  alert_sent BOOLEAN DEFAULT false,
  alert_sent_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_health_trends_school_date ON health_trends(school_id, trend_date DESC);
CREATE INDEX idx_health_trends_spikes ON health_trends(spike_detected) WHERE spike_detected = true;

CREATE TABLE outbreak_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  health_trend_id UUID NOT NULL REFERENCES health_trends(id),
  school_id UUID NOT NULL REFERENCES schools(id),
  condition_type VARCHAR(100) NOT NULL,
  alert_severity VARCHAR(20) NOT NULL DEFAULT 'MEDIUM', -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
  affected_students INTEGER NOT NULL,
  affected_percentage DECIMAL(5,2) NOT NULL,
  alert_message TEXT NOT NULL,
  recommended_actions TEXT[],
  alert_recipients JSONB, -- array of user IDs notified
  acknowledged_by_user_id UUID REFERENCES users(id),
  acknowledged_at TIMESTAMP,
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_outbreak_alerts_school ON outbreak_alerts(school_id);
CREATE INDEX idx_outbreak_alerts_unresolved ON outbreak_alerts(resolved) WHERE resolved = false;

-- Phase 3: Operations (Week 9-12)

-- Migration 25: Immunization Enhancements
ALTER TABLE vaccinations ADD COLUMN exemption_type VARCHAR(50); -- 'medical', 'religious', 'philosophical'
ALTER TABLE vaccinations ADD COLUMN exemption_document_id UUID REFERENCES documents(id);
ALTER TABLE vaccinations ADD COLUMN exemption_expiration_date DATE;
ALTER TABLE vaccinations ADD COLUMN reminder_sent BOOLEAN DEFAULT false;
ALTER TABLE vaccinations ADD COLUMN reminder_sent_at TIMESTAMP;
ALTER TABLE vaccinations ADD COLUMN next_reminder_date DATE;
ALTER TABLE vaccinations ADD COLUMN compliance_status VARCHAR(50) DEFAULT 'compliant'; -- 'compliant', 'pending', 'overdue', 'exempt'
ALTER TABLE vaccinations ADD COLUMN state_registry_submitted BOOLEAN DEFAULT false;
ALTER TABLE vaccinations ADD COLUMN state_registry_submission_date TIMESTAMP;
ALTER TABLE vaccinations ADD COLUMN state_registry_confirmation_id VARCHAR(255);

CREATE INDEX idx_vaccinations_reminders ON vaccinations(next_reminder_date) WHERE reminder_sent = false;
CREATE INDEX idx_vaccinations_compliance ON vaccinations(compliance_status);

-- Phase 4: Financial (Week 13-16)

-- Migration 26: Medicaid Billing
CREATE TABLE medicaid_eligibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id),
  medicaid_id VARCHAR(50) NOT NULL,
  eligibility_status VARCHAR(20) NOT NULL, -- 'active', 'inactive', 'pending'
  effective_date DATE NOT NULL,
  termination_date DATE,
  plan_name VARCHAR(255),
  plan_id VARCHAR(100),
  last_verified_at TIMESTAMP,
  verified_by_user_id UUID REFERENCES users(id),
  verification_method VARCHAR(50), -- 'api', 'manual', 'document'
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_medicaid_eligibility_student ON medicaid_eligibility(student_id, medicaid_id);
CREATE INDEX idx_medicaid_eligibility_status ON medicaid_eligibility(eligibility_status);

CREATE TABLE medicaid_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id),
  medicaid_eligibility_id UUID NOT NULL REFERENCES medicaid_eligibility(id),
  claim_number VARCHAR(50) UNIQUE NOT NULL,
  service_date DATE NOT NULL,
  clinic_visit_id UUID REFERENCES clinic_visits(id),
  service_type VARCHAR(100) NOT NULL, -- 'screening', 'assessment', 'treatment', etc.
  cpt_code VARCHAR(10) NOT NULL, -- Current Procedural Terminology code
  diagnosis_code VARCHAR(10) NOT NULL, -- ICD-10 code
  units INTEGER NOT NULL DEFAULT 1,
  charge_amount DECIMAL(10,2) NOT NULL,
  claim_status VARCHAR(50) NOT NULL DEFAULT 'draft', -- 'draft', 'submitted', 'accepted', 'rejected', 'paid'
  submitted_at TIMESTAMP,
  submitted_by_user_id UUID REFERENCES users(id),
  response_received_at TIMESTAMP,
  payment_amount DECIMAL(10,2),
  payment_date DATE,
  rejection_reason TEXT,
  resubmission_count INTEGER DEFAULT 0,
  documentation_ids UUID[], -- array of document IDs
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_medicaid_claims_student ON medicaid_claims(student_id);
CREATE INDEX idx_medicaid_claims_status ON medicaid_claims(claim_status);
CREATE INDEX idx_medicaid_claims_service_date ON medicaid_claims(service_date DESC);

-- Phase 5: Data Management (Week 17-20)

-- Migration 27: Document Sharing
CREATE TABLE document_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id),
  shared_by_user_id UUID NOT NULL REFERENCES users(id),
  shared_with_email VARCHAR(255) NOT NULL,
  shared_with_user_id UUID REFERENCES users(id),
  access_level VARCHAR(20) NOT NULL DEFAULT 'view', -- 'view', 'download', 'edit'
  share_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP,
  password_protected BOOLEAN DEFAULT false,
  password_hash VARCHAR(255),
  access_count INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP,
  revoked BOOLEAN DEFAULT false,
  revoked_at TIMESTAMP,
  revoked_by_user_id UUID REFERENCES users(id),
  revocation_reason TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_document_shares_document ON document_shares(document_id);
CREATE INDEX idx_document_shares_token ON document_shares(share_token);
CREATE INDEX idx_document_shares_active ON document_shares(revoked) WHERE revoked = false;

CREATE TABLE document_share_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_share_id UUID NOT NULL REFERENCES document_shares(id),
  accessed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT,
  action VARCHAR(50) NOT NULL, -- 'view', 'download', 'print'
  success BOOLEAN NOT NULL DEFAULT true,
  failure_reason TEXT
);

-- Migration 28: Scheduled Exports
CREATE TABLE scheduled_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  export_name VARCHAR(255) NOT NULL,
  export_type VARCHAR(100) NOT NULL, -- 'students', 'health_records', 'medications', 'attendance', etc.
  schedule_cron VARCHAR(100) NOT NULL, -- cron expression
  export_format VARCHAR(20) NOT NULL, -- 'CSV', 'PDF', 'JSON', 'XML'
  destination_type VARCHAR(50) NOT NULL, -- 'email', 'sftp', 'api', 's3'
  destination_config JSONB NOT NULL, -- destination-specific configuration
  filter_criteria JSONB, -- export filters
  include_fields TEXT[], -- specific fields to include
  encryption_enabled BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMP,
  last_run_status VARCHAR(50), -- 'success', 'failure', 'partial'
  next_run_at TIMESTAMP,
  created_by_user_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_scheduled_exports_next_run ON scheduled_exports(next_run_at) WHERE active = true;

CREATE TABLE export_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_export_id UUID NOT NULL REFERENCES scheduled_exports(id),
  run_started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  run_completed_at TIMESTAMP,
  status VARCHAR(50) NOT NULL DEFAULT 'running', -- 'running', 'success', 'failure'
  records_exported INTEGER DEFAULT 0,
  file_size_bytes BIGINT,
  file_path VARCHAR(500),
  error_message TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_export_runs_scheduled_export ON export_runs(scheduled_export_id);
CREATE INDEX idx_export_runs_started_at ON export_runs(run_started_at DESC);

-- Migration 29: SIS Integration
CREATE TABLE sis_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_type VARCHAR(50) NOT NULL, -- 'student_import', 'attendance_export', 'enrollment_sync', etc.
  sync_direction VARCHAR(20) NOT NULL, -- 'import', 'export', 'bidirectional'
  sync_started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  sync_completed_at TIMESTAMP,
  status VARCHAR(50) NOT NULL DEFAULT 'running', -- 'running', 'success', 'failure', 'partial'
  records_processed INTEGER DEFAULT 0,
  records_created INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  error_details JSONB,
  triggered_by VARCHAR(50), -- 'manual', 'scheduled', 'enrollment_event'
  triggered_by_user_id UUID REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sis_sync_logs_started_at ON sis_sync_logs(sync_started_at DESC);

CREATE TABLE sis_sync_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sis_sync_log_id UUID NOT NULL REFERENCES sis_sync_logs(id),
  student_id UUID REFERENCES students(id),
  sis_student_id VARCHAR(100),
  conflict_type VARCHAR(100) NOT NULL, -- 'duplicate', 'mismatch', 'missing_required', etc.
  conflict_field VARCHAR(100),
  local_value TEXT,
  sis_value TEXT,
  resolution_strategy VARCHAR(50), -- 'local_wins', 'sis_wins', 'manual', 'merge'
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP,
  resolved_by_user_id UUID REFERENCES users(id),
  resolution_notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sis_sync_conflicts_unresolved ON sis_sync_conflicts(resolved) WHERE resolved = false;
```

### Migration Rollback Strategy

```sql
-- Each migration includes corresponding DOWN migration:

-- Example: Migration 20 Rollback
DROP TABLE IF EXISTS phi_disclosures CASCADE;

-- Example: Migration 21 Rollback
DROP TABLE IF EXISTS tamper_alerts CASCADE;
ALTER TABLE audit_logs DROP COLUMN IF EXISTS checksum;
ALTER TABLE audit_logs DROP COLUMN IF EXISTS tamper_detected;
ALTER TABLE audit_logs DROP COLUMN IF EXISTS verified_at;

-- Rollback order: Reverse of migration order
-- Always test rollbacks in development environment first
```

---

## 7. Risk Mitigation Strategies

### A. Technical Risks

#### Risk 1: WebSocket Connection Failures
**Impact:** Real-time alerts (F6) won't work, critical for emergencies
**Probability:** Medium
**Mitigation:**
- Implement automatic reconnection with exponential backoff (ALREADY EXISTS)
- Fallback to HTTP polling for critical alerts
- Store missed alerts on backend, replay on reconnect
- Add connection status indicator in UI
- Implement heartbeat/ping mechanism (ALREADY EXISTS)

**Contingency:**
- If WebSocket fails in production, enable HTTP polling fallback
- Send critical alerts via SMS/email as backup
- Display prominent "disconnected" banner with refresh option

#### Risk 2: External API Dependencies (Drug Reference, Medicaid, State Registry)
**Impact:** Features 4, 13, 16 blocked if APIs unavailable
**Probability:** Medium
**Mitigation:**
- Cache drug interaction data locally (7-day TTL)
- Implement circuit breaker pattern for external APIs
- Build comprehensive error handling and retry logic
- Add "degraded mode" for offline operation
- Create mock data for development/testing

**Contingency:**
- Maintain local drug reference database as fallback
- Implement manual claim submission workflow
- Allow offline immunization entry with batch sync later

#### Risk 3: PDF Generation Performance
**Impact:** Reports timeout or crash with large datasets
**Probability:** Low
**Mitigation:**
- Implement pagination for large reports (max 100 records per PDF)
- Generate PDFs asynchronously with job queue
- Add progress indicators for long-running reports
- Optimize chart rendering (use canvas instead of SVG for large datasets)
- Implement report caching (cache for 1 hour)

**Contingency:**
- Break large reports into multiple PDFs
- Offer CSV export as alternative to PDF
- Generate summary PDF with link to detailed data

#### Risk 4: Database Migration Failures
**Impact:** Downtime, data corruption
**Probability:** Low
**Mitigation:**
- Test all migrations in staging environment first
- Create full database backup before each migration
- Use database transactions for atomic migrations
- Add rollback scripts for each migration
- Implement migration locking to prevent concurrent runs
- Run migrations during low-traffic windows

**Contingency:**
- Have DBA on standby during production migrations
- Prepare rollback plan with time estimates
- Keep previous version deployed and ready to switch back

### B. Compliance & Security Risks

#### Risk 5: PHI Disclosure Logging Gaps
**Impact:** HIPAA violation, fines, legal liability
**Probability:** Medium
**Mitigation:**
- Implement comprehensive audit logging at all PHI access points
- Use database triggers to ensure logging even if application fails
- Add automated compliance checks (daily scans)
- Implement "break-glass" emergency access with mandatory documentation
- Require manager approval for bulk PHI access

**Contingency:**
- If audit gap discovered, conduct immediate investigation
- Document gap in compliance report
- Implement additional logging at application and database levels
- Notify compliance officer

#### Risk 6: Encryption Key Management
**Impact:** Data breach if keys compromised
**Probability:** Low
**Mitigation:**
- Use industry-standard key management service (AWS KMS, Azure Key Vault)
- Implement automatic key rotation (90-day schedule)
- Store keys separately from encrypted data
- Use envelope encryption for PHI
- Implement key access logging

**Contingency:**
- If key compromise suspected, immediate key rotation
- Re-encrypt all PHI with new keys
- Conduct security audit
- Notify affected parties per HIPAA breach notification rules

#### Risk 7: Medication Safety - False Negatives in Drug Checker
**Impact:** Patient harm from undetected drug interactions
**Probability:** Low
**Mitigation:**
- Use multiple drug reference sources (First Databank, Micromedex)
- Implement conservative checking (flag questionable interactions)
- Require pharmacist/physician review for overrides
- Display warnings even for minor interactions
- Log all interaction checks and overrides

**Contingency:**
- If false negative discovered, immediate safety alert to all users
- Review all recent administrations of affected medications
- Contact physicians for affected students
- Update drug reference database
- File incident report

### C. Operational Risks

#### Risk 8: User Adoption Resistance
**Impact:** Low feature utilization, workarounds, data quality issues
**Probability:** Medium
**Mitigation:**
- Conduct user training sessions before each phase rollout
- Create role-specific video tutorials
- Implement in-app guidance and tooltips
- Designate "super users" in each school for peer support
- Collect user feedback and iterate quickly
- Implement gradual feature rollout (pilot schools first)

**Contingency:**
- If adoption lags, conduct user interviews to identify blockers
- Simplify UI based on feedback
- Extend training period
- Consider workflow adjustments

#### Risk 9: Performance Degradation with Scale
**Impact:** Slow response times, poor user experience
**Probability:** Medium
**Mitigation:**
- Implement comprehensive performance testing (load, stress, spike)
- Use database query optimization and indexing
- Implement caching strategy (Redis for hot data)
- Add pagination to all list views
- Monitor performance metrics in production (New Relic, DataDog)
- Set up auto-scaling for backend services

**Contingency:**
- If performance issues occur, implement query optimization
- Add database read replicas
- Increase cache TTL for non-critical data
- Defer non-essential background jobs to off-peak hours

#### Risk 10: Integration Data Conflicts (SIS)
**Impact:** Student data inconsistencies, duplicate records
**Probability:** High
**Mitigation:**
- Implement conflict resolution UI (F17)
- Use deterministic matching algorithm (student ID + DOB + last name)
- Create conflict review workflow requiring user action
- Log all data conflicts for analysis
- Implement dry-run mode for sync testing

**Contingency:**
- If conflicts escalate, pause automatic sync
- Manual review and resolution of all conflicts
- Adjust matching algorithm based on conflict patterns
- Implement stricter validation rules

### D. Timeline Risks

#### Risk 11: Feature Dependency Delays
**Impact:** Downstream features blocked, timeline slippage
**Probability:** High
**Mitigation:**
- Build foundation components first (Phase 1)
- Implement features with mocks/stubs to unblock parallel work
- Daily standup to identify blockers early
- Maintain 1-week buffer in schedule for each phase
- Use feature flags to deploy incomplete features without exposing to users

**Contingency:**
- If critical feature delayed, adjust dependent feature schedules
- Re-prioritize features to maintain critical path
- Add developers to delayed features
- Consider reducing scope of non-critical features

#### Risk 12: Resource Availability
**Impact:** Development delays, knowledge silos
**Probability:** Medium
**Mitigation:**
- Cross-train developers on multiple features
- Document all architectural decisions and patterns
- Pair programming for critical features
- Code review requirement (2 approvers)
- Maintain up-to-date README and architecture docs

**Contingency:**
- If developer unavailable, reassign work to cross-trained teammate
- Extend timeline if multiple developers lost
- Engage contractors for short-term capacity boost

### Risk Tracking Matrix

| Risk ID | Risk Name | Impact | Probability | Mitigation Status | Owner |
|---------|-----------|--------|-------------|-------------------|-------|
| R1 | WebSocket Failures | HIGH | MEDIUM | In Progress | Backend Lead |
| R2 | External API Deps | HIGH | MEDIUM | Planned | Integration Lead |
| R3 | PDF Performance | MEDIUM | LOW | Planned | Frontend Lead |
| R4 | Migration Failures | HIGH | LOW | In Progress | DBA |
| R5 | PHI Logging Gaps | CRITICAL | MEDIUM | In Progress | Security Lead |
| R6 | Key Management | CRITICAL | LOW | In Progress | Security Lead |
| R7 | Drug Checker False Negatives | CRITICAL | LOW | Planned | Clinical Lead |
| R8 | User Adoption | MEDIUM | MEDIUM | Planned | Product Manager |
| R9 | Performance Degradation | MEDIUM | MEDIUM | Planned | DevOps Lead |
| R10 | SIS Data Conflicts | MEDIUM | HIGH | Planned | Integration Lead |
| R11 | Dependency Delays | MEDIUM | HIGH | In Progress | Project Manager |
| R12 | Resource Availability | MEDIUM | MEDIUM | In Progress | Engineering Manager |

---

## 8. Rollback Procedures

### A. Feature-Level Rollback (Feature Flags)

All features deployed with feature flags to enable instant rollback without deployment:

```typescript
// Location: /frontend/src/config/featureFlags.ts

export const FEATURE_FLAGS = {
  PHI_DISCLOSURE_TRACKING: process.env.VITE_FEATURE_PHI_DISCLOSURE === 'true',
  ENCRYPTION_UI: process.env.VITE_FEATURE_ENCRYPTION_UI === 'true',
  TAMPER_ALERTS: process.env.VITE_FEATURE_TAMPER_ALERTS === 'true',
  DRUG_INTERACTION_CHECKER: process.env.VITE_FEATURE_DRUG_CHECKER === 'true',
  OUTBREAK_DETECTION: process.env.VITE_FEATURE_OUTBREAK_DETECTION === 'true',
  REALTIME_ALERTS: process.env.VITE_FEATURE_REALTIME_ALERTS === 'true',
  CLINIC_VISIT_TRACKING: process.env.VITE_FEATURE_CLINIC_VISITS === 'true',
  IMMUNIZATION_DASHBOARD: process.env.VITE_FEATURE_IMMUNIZATION_DASHBOARD === 'true',
  MEDICAID_BILLING: process.env.VITE_FEATURE_MEDICAID_BILLING === 'true',
  PDF_REPORTS: process.env.VITE_FEATURE_PDF_REPORTS === 'true',
  IMMUNIZATION_UI: process.env.VITE_FEATURE_IMMUNIZATION_UI === 'true',
  SECURE_DOC_SHARING: process.env.VITE_FEATURE_SECURE_DOC_SHARING === 'true',
  STATE_REGISTRY_INTEGRATION: process.env.VITE_FEATURE_STATE_REGISTRY === 'true',
  EXPORT_SCHEDULING: process.env.VITE_FEATURE_EXPORT_SCHEDULING === 'true',
  SIS_INTEGRATION: process.env.VITE_FEATURE_SIS_INTEGRATION === 'true',
};

// Rollback procedure: Update environment variable and restart frontend
// No code deployment required
```

### B. Database Rollback Procedures

#### Rollback Decision Matrix

```
Issue Severity:
├── CRITICAL (data corruption, security breach)
│   └── Action: Immediate rollback + incident response
│
├── HIGH (major functionality broken, affects >50% users)
│   └── Action: Rollback within 1 hour
│
├── MEDIUM (minor functionality issues, affects <50% users)
│   └── Action: Hot fix within 4 hours OR rollback
│
└── LOW (cosmetic issues, performance degradation <20%)
    └── Action: Fix in next deployment cycle
```

#### Step-by-Step Rollback Process

```bash
# 1. STOP NEW DEPLOYMENTS
# Alert all developers to halt deployments

# 2. IDENTIFY MIGRATION TO ROLLBACK
# Check current migration version
cd /home/user/white-cross/backend
npm run db:migrate:status

# 3. BACKUP CURRENT DATABASE STATE
# Create backup before rollback
pg_dump -h localhost -U postgres -d white_cross_prod > backup_before_rollback_$(date +%Y%m%d_%H%M%S).sql

# 4. RUN ROLLBACK MIGRATION
# Undo last migration
npm run db:migrate:undo

# For multiple migrations:
# npm run db:migrate:undo:all  # Use with extreme caution!

# 5. VERIFY ROLLBACK SUCCESS
npm run db:migrate:status
# Check that target migration is listed as "down"

# 6. RESTART BACKEND SERVICES
# To clear any cached schema information
pm2 restart white-cross-backend

# 7. VERIFY APPLICATION FUNCTIONALITY
# Run smoke tests
npm run test:api-integration

# 8. MONITOR ERROR RATES
# Check logs for errors related to rolled back features
pm2 logs white-cross-backend --lines 100 | grep ERROR

# 9. NOTIFY STAKEHOLDERS
# Send notification to team and users if necessary

# 10. POST-MORTEM
# Document what went wrong, create Jira ticket for fix
```

#### Migration-Specific Rollback Notes

```
Migration 20 (PHI Disclosures):
- Rollback Impact: PHI disclosure logging disabled
- Data Loss: Yes - disclosure records created after migration
- Recommended Action: Export disclosure data before rollback
- Backup Command:
  pg_dump -h localhost -U postgres -t phi_disclosures white_cross_prod > phi_disclosures_backup.sql

Migration 22 (Drug Interactions):
- Rollback Impact: Drug checker disabled
- Data Loss: Yes - interaction check logs
- Safety Impact: HIGH - nurses must do manual drug checks
- Recommended Action: Notify all users before rollback

Migration 23 (Clinic Visits):
- Rollback Impact: Visit tracking disabled
- Data Loss: Yes - visit records created after migration
- Recommended Action: Export visit data, revert to paper logs temporarily

Migration 26 (Medicaid Billing):
- Rollback Impact: Billing workflow disabled
- Data Loss: Yes - claims data
- Financial Impact: HIGH - cannot bill Medicaid
- Recommended Action: Do NOT rollback unless critical bug, fix forward instead
```

### C. Code Rollback Procedures

#### Git Rollback Commands

```bash
# 1. IDENTIFY COMMIT TO ROLLBACK TO
git log --oneline -20
# Note the commit hash before the problematic deployment

# 2. CREATE ROLLBACK BRANCH
git checkout -b rollback/feature-name-YYYYMMDD

# 3. REVERT TO PREVIOUS COMMIT
# Option A: Revert specific commit (creates new commit)
git revert <commit-hash>

# Option B: Hard reset (rewrites history - use with caution)
git reset --hard <commit-hash>
git push origin rollback/feature-name-YYYYMMDD --force

# 4. DEPLOY ROLLBACK BRANCH
# Update CI/CD to deploy rollback branch

# 5. VERIFY DEPLOYMENT
curl https://api.whitecross.com/health
# Should return 200 OK

# 6. CREATE FIX BRANCH
git checkout -b fix/feature-name-issue
# Fix the issue in this branch

# 7. MERGE FIX AND REDEPLOY
# Once fix is verified, merge to main and deploy
```

### D. Rollback Testing

Before each production deployment, verify rollback procedures in staging:

```bash
# Weekly Rollback Drill (Friday afternoons)
1. Deploy new feature to staging
2. Verify feature works
3. Execute rollback procedure
4. Verify rollback successful
5. Document any issues with rollback process
6. Update rollback documentation if needed
```

---

## 9. Documentation Requirements

### A. Technical Documentation

#### 1. Architecture Decision Records (ADRs)
Location: `/docs/adr/`

Required ADRs for each feature:
```
ADR-020-PHI-Disclosure-Tracking.md
├── Context: HIPAA requirement for disclosure tracking
├── Decision: Database-backed audit trail with UI
├── Consequences: Additional storage, query overhead
└── Alternatives Considered: File-based logging, external service

ADR-021-Real-Time-Alert-Architecture.md
├── Context: Need for instant emergency notifications
├── Decision: WebSocket with HTTP polling fallback
├── Consequences: Increased server connections, complexity
└── Alternatives Considered: Server-Sent Events, long polling only

ADR-022-PDF-Generation-Strategy.md
├── Context: Multiple reporting features need PDF export
├── Decision: Client-side generation with jsPDF
├── Consequences: Browser memory limits, no server load
└── Alternatives Considered: Server-side generation, third-party service

[Similar ADRs for remaining features...]
```

#### 2. API Documentation
Location: `/docs/api/`

For each new API endpoint:
```markdown
## POST /api/v1/phi/disclosures

**Purpose:** Log PHI disclosure event

**Authentication:** Required (JWT)

**Authorization:** Roles: ADMIN, NURSE

**Request Body:**
```json
{
  "studentId": "uuid",
  "disclosureTo": "string",
  "disclosureReason": "string",
  "phiCategories": ["demographics", "diagnoses"],
  "consentFormId": "uuid"
}
```

**Response:** 201 Created
```json
{
  "id": "uuid",
  "disclosureDate": "2025-10-26T10:30:00Z",
  "status": "logged"
}
```

**Error Codes:**
- 400: Missing required fields
- 401: Unauthorized
- 403: Insufficient permissions
- 500: Server error

**Rate Limit:** 100 requests/hour

**Audit:** Yes, all disclosure logs are audited
```

#### 3. Database Schema Documentation
Location: `/docs/database/`

For each new table:
```markdown
## Table: phi_disclosures

**Purpose:** Track all PHI disclosures for HIPAA compliance

**Relationships:**
- FK to users (disclosed_by_user_id)
- FK to students (student_id)
- FK to consent_forms (consent_form_id)

**Indexes:**
- idx_phi_disclosures_student (student_id) - Performance
- idx_phi_disclosures_date (disclosure_date DESC) - Reporting

**Retention Policy:** 7 years (HIPAA requirement)

**Backup Schedule:** Daily incremental, weekly full

**Privacy Level:** HIGH - Contains PHI access records
```

### B. User Documentation

#### 1. Feature Guides
Location: `/docs/user-guides/`

For each feature:
```markdown
# Immunization Dashboard User Guide

## Overview
The Immunization Dashboard provides a comprehensive view of vaccination compliance across all students.

## Accessing the Dashboard
1. Navigate to Health > Immunizations
2. Select "Dashboard" tab
3. Dashboard loads with current compliance metrics

## Dashboard Sections

### Compliance Overview
- Shows overall compliance percentage
- Color-coded by status:
  - Green: Compliant (>95%)
  - Yellow: Attention needed (85-95%)
  - Red: Non-compliant (<85%)

### Upcoming Due Dates
- Lists students with vaccinations due in next 30 days
- Click student name to view details
- Use "Send Reminder" to notify parents

### Exemptions
- View all medical and religious exemptions
- Check expiration dates
- Upload new exemption documentation

## Common Tasks

### Sending Reminders
1. Click "Send Reminders" button
2. Select reminder template
3. Choose recipients (all overdue or specific students)
4. Click "Send"

### Generating Reports
1. Click "Export" button
2. Choose format (PDF or CSV)
3. Select date range
4. Click "Generate Report"

## Troubleshooting
- If dashboard doesn't load: Refresh page, check internet connection
- If compliance percentage seems wrong: Verify all records are up to date
- If reminder fails to send: Check email configuration

## Support
Contact: support@whitecross.com or ext. 1234
```

#### 2. Video Tutorials
Location: `/docs/videos/`

Required videos (3-5 minutes each):
1. "Immunization Dashboard Overview" (F9, F11)
2. "Drug Interaction Checker Walkthrough" (F4)
3. "Clinic Visit Check-In Process" (F8)
4. "Generating Medicaid Claims" (F13)
5. "Secure Document Sharing" (F14)
6. "Responding to Real-Time Alerts" (F6)
7. "PHI Disclosure Logging" (F1)
8. "Running Scheduled Exports" (F15)

Video format:
- Screen recording with voiceover
- Closed captions required (accessibility)
- Chapter markers for easy navigation
- Example data (no real PHI)

#### 3. Quick Reference Cards
Location: `/docs/quick-reference/`

One-page cheat sheets for common tasks:
```
┌─────────────────────────────────────────────────────────┐
│ Drug Interaction Checker - Quick Reference             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ BEFORE ADMINISTERING MEDICATION:                        │
│                                                         │
│ 1. Open medication record                              │
│ 2. Click "Check Interactions" button                   │
│ 3. Review any warnings displayed:                      │
│    • RED = Do not administer, contact physician        │
│    • YELLOW = Use caution, monitor closely             │
│    • GREEN = No interactions found                     │
│                                                         │
│ 4. If override needed:                                 │
│    a. Click "Override Warning"                         │
│    b. Enter physician approval                         │
│    c. Document reason                                  │
│                                                         │
│ 5. Administer medication                               │
│ 6. Log administration in system                        │
│                                                         │
│ EMERGENCY CONTACTS:                                     │
│ • Poison Control: 1-800-222-1222                       │
│ • On-call Physician: ext. 5678                         │
│ • Pharmacy: ext. 9012                                  │
│                                                         │
│ REMEMBER: When in doubt, don't administer!             │
│ Call physician for clarification.                      │
└─────────────────────────────────────────────────────────┘
```

### C. Compliance Documentation

#### 1. HIPAA Compliance Reports
Location: `/docs/compliance/hipaa/`

Required documentation:
```markdown
# HIPAA Compliance Report - PHI Disclosure Tracking

**Feature:** PHI Disclosure Tracking (F1)

**HIPAA Requirements Addressed:**
- 45 CFR § 164.528 - Accounting of Disclosures
- 45 CFR § 164.502(a) - Uses and Disclosures

**Implementation Details:**
1. All PHI disclosures logged to `phi_disclosures` table
2. Minimum data set: who, what, when, why, to whom
3. Retention: 7 years per HIPAA requirement
4. Audit trail: Immutable logs with checksums

**Access Controls:**
- View disclosure logs: ADMIN, COMPLIANCE_OFFICER
- Create disclosures: ADMIN, NURSE (with documented reason)
- Export logs: COMPLIANCE_OFFICER only

**Testing Completed:**
- ✅ Disclosure logging accuracy
- ✅ Mandatory field validation
- ✅ Audit trail integrity
- ✅ Access control enforcement
- ✅ Report generation

**Certification:**
This feature has been reviewed and certified as HIPAA-compliant by:
- Security Officer: [Name], [Date]
- Privacy Officer: [Name], [Date]
- Compliance Officer: [Name], [Date]

**Next Review Date:** [6 months from launch]
```

#### 2. Security Assessment Reports
Location: `/docs/compliance/security/`

For each feature with security implications:
```markdown
# Security Assessment - Secure Document Sharing (F14)

**Threat Model:**
1. Unauthorized access to shared documents
2. Document interception during transmission
3. Brute force attack on share tokens
4. Password disclosure

**Security Controls Implemented:**

1. **Authentication & Authorization**
   - JWT token required for document owners
   - Share token (256-bit UUID) for recipients
   - Optional password protection (bcrypt hash)
   - Expiration timestamps enforced

2. **Encryption**
   - TLS 1.3 for data in transit
   - AES-256 for documents at rest
   - End-to-end encryption option for sensitive documents

3. **Access Logging**
   - All document access logged to `document_share_access_log`
   - Includes IP address, user agent, timestamp
   - Failed access attempts logged

4. **Rate Limiting**
   - Maximum 10 access attempts per minute per token
   - Lock token after 5 failed password attempts
   - Automatic revocation after 10 failed attempts

**Penetration Testing:**
- Test Date: [Date]
- Tester: [Name/Company]
- Findings: [Summary]
- Remediation: [Actions taken]

**Certification:**
Assessed and approved by Security Team on [Date]
```

### D. Operational Documentation

#### 1. Runbooks
Location: `/docs/runbooks/`

For each feature requiring operational support:
```markdown
# Runbook - Real-Time Alert System (F6)

## Normal Operation

**Health Checks:**
- WebSocket server status: `curl https://api.whitecross.com/health/websocket`
- Expected response: `{"status": "ok", "connections": <number>}`

**Monitoring Metrics:**
- Active WebSocket connections: Target <5000
- Alert delivery latency: Target <100ms (p95)
- Connection failures: Target <0.1%

## Common Issues

### Issue 1: WebSocket connections failing
**Symptoms:**
- Users report not receiving alerts
- Monitoring shows connection failures >1%

**Diagnosis:**
```bash
# Check WebSocket server logs
pm2 logs white-cross-websocket | grep "connection error"

# Check load balancer
curl https://api.whitecross.com/health/websocket

# Check Redis (for connection state)
redis-cli ping
```

**Resolution:**
1. Check server capacity: `pm2 list`
2. If CPU >80%, scale horizontally: `pm2 scale white-cross-websocket +2`
3. If Redis down, restart: `systemctl restart redis`
4. Clear stale connections: `redis-cli FLUSHDB` (caution: clears all connections)

**Escalation:** If issue persists >15 minutes, page on-call engineer

### Issue 2: Alert delivery delays
**Symptoms:**
- Alerts arriving >5 seconds after event

**Diagnosis:**
- Check queue depth: `redis-cli LLEN alert_queue`
- Check worker status: `pm2 list | grep alert-worker`

**Resolution:**
1. Scale alert workers: `pm2 scale alert-worker +2`
2. Check for blocked events: `redis-cli LRANGE alert_queue 0 -1`
3. If queue >10000, investigate event source

## Disaster Recovery

**Scenario: WebSocket server completely down**

1. Enable HTTP polling fallback (automatic after 3 failed reconnects)
2. Restart WebSocket server: `pm2 restart white-cross-websocket`
3. Monitor connection recovery
4. Check for missed alerts: Run sync script
5. Notify users of temporary degradation

**Recovery Time Objective (RTO):** 5 minutes
**Recovery Point Objective (RPO):** 0 (no data loss, alerts queued)
```

#### 2. Deployment Checklists
Location: `/docs/deployment/`

```markdown
# Deployment Checklist - Phase 2 (Patient Safety Features)

## Pre-Deployment (1 week before)

### Code Readiness
- [ ] All features merged to `release/phase-2` branch
- [ ] Code review completed (2+ approvers)
- [ ] All tests passing (unit, integration, E2E)
- [ ] Test coverage >95%
- [ ] No critical or high-severity bugs
- [ ] Performance testing completed
- [ ] Security scan completed (no high/critical vulnerabilities)

### Documentation
- [ ] API documentation updated
- [ ] User guides written and reviewed
- [ ] Video tutorials recorded
- [ ] Quick reference cards created
- [ ] Runbooks written for new features
- [ ] HIPAA compliance documentation completed

### Infrastructure
- [ ] Database migrations tested in staging
- [ ] Feature flags configured
- [ ] Environment variables set
- [ ] Monitoring alerts configured
- [ ] Log aggregation set up
- [ ] Backup procedures tested

### Communication
- [ ] Deployment notice sent to users (3 days prior)
- [ ] Training sessions scheduled
- [ ] Support team briefed
- [ ] Escalation contacts confirmed
- [ ] Rollback decision tree reviewed

## Deployment Day

### Pre-Deployment (9:00 AM)
- [ ] All hands meeting - review deployment plan
- [ ] Verify staging environment matches production
- [ ] Create full database backup
- [ ] Tag release in Git: `git tag v2.0-phase2`
- [ ] Deploy to first pilot school

### Deployment (10:00 AM - Low Traffic Window)
- [ ] Enable maintenance mode
- [ ] Run database migrations
  ```bash
  cd backend
  npm run db:migrate
  npm run db:migrate:status  # Verify success
  ```
- [ ] Deploy backend: `pm2 deploy production`
- [ ] Deploy frontend: `npm run build && npm run deploy`
- [ ] Disable maintenance mode

### Post-Deployment (10:30 AM)
- [ ] Verify health checks passing
  - Backend: `curl https://api.whitecross.com/health`
  - WebSocket: `curl https://api.whitecross.com/health/websocket`
  - Database: `curl https://api.whitecross.com/health/database`
- [ ] Run smoke tests
  - Create test clinic visit
  - Run drug interaction check
  - Trigger test alert
  - Verify WebSocket connection
- [ ] Enable feature flags (gradual rollout)
  - 10% of users: DRUG_INTERACTION_CHECKER=true
  - Monitor for 1 hour
  - If no issues, increase to 50%
  - If no issues, increase to 100%
- [ ] Monitor error rates (target <0.1%)
- [ ] Monitor performance (latency p95 <200ms)

### Post-Deployment Monitoring (All Day)
- [ ] Check logs every 30 minutes
- [ ] Review user support tickets
- [ ] Monitor WebSocket connection count
- [ ] Track feature usage metrics
- [ ] Check database query performance

## Post-Deployment (Next Day)

- [ ] Review deployment metrics
- [ ] Check overnight batch jobs
- [ ] Conduct user survey (pilot schools)
- [ ] Address any issues found
- [ ] Update documentation based on feedback
- [ ] Schedule retrospective meeting

## Rollback Conditions

Immediate rollback if:
- [ ] Error rate >1%
- [ ] Critical security vulnerability discovered
- [ ] Data corruption detected
- [ ] HIPAA compliance violation
- [ ] Service completely unavailable >5 minutes

Planned rollback if:
- [ ] User adoption <20% after 48 hours
- [ ] Support tickets >10/hour
- [ ] Performance degradation >50%
- [ ] Major functionality broken
```

---

## 10. Deployment Checklist

### Week-by-Week Deployment Strategy

#### Phase 1 Deployment (End of Week 4)

**Features Deployed:**
- PDF Report Service
- WebSocket Real-Time Enhancement
- Encryption Status UI
- PHI Disclosure Tracking
- Tamper Alert System

**Deployment Steps:**

```bash
# Week 4 Friday - Deploy to Staging
git checkout -b release/phase-1
git merge develop

# Run all tests
npm run test
npm run test:e2e
npm run test:api-integration

# Deploy to staging
./scripts/deploy-staging.sh

# Week 5 Monday - Deploy to Production (Pilot Schools)
# 1. Database migration
cd backend
npm run db:migrate

# 2. Deploy backend
pm2 deploy production

# 3. Build and deploy frontend
cd ../frontend
npm run build
aws s3 sync dist/ s3://whitecross-prod-frontend/

# 4. Enable feature flags for pilot schools
# Update .env.production:
VITE_FEATURE_PHI_DISCLOSURE=true
VITE_FEATURE_ENCRYPTION_UI=true
VITE_FEATURE_TAMPER_ALERTS=true

# Restart frontend
pm2 restart whitecross-frontend

# Week 5 Wednesday - Full Production Rollout
# Enable for all users if pilot successful
```

**Pilot Schools:**
- Lincoln Elementary (100 students)
- Jefferson Middle School (250 students)
- Washington High School (500 students)

**Success Criteria:**
- Zero critical bugs
- <0.1% error rate
- User satisfaction >4.0/5
- HIPAA compliance verified
- Feature usage >80%

#### Phase 2 Deployment (End of Week 8)

**Features Deployed:**
- Drug Interaction Checker
- Outbreak Detection System
- Real-Time Health Alerts

**Pre-Deployment Validation:**
```bash
# Critical safety testing
cd backend
npm run test:drug-checker -- --coverage
npm run test:outbreak-detection -- --coverage
npm run test:realtime-alerts -- --coverage

# Load testing
npm run test:load -- --feature drug-checker --users 1000

# Security audit
npm run security:audit
npm run lint:security
```

**Deployment Window:** Sunday 2:00 AM - 6:00 AM (Minimal disruption)

**Rollout Plan:**
```
Hour 1 (2:00 AM): Deploy to 5% of users (pilot schools)
Hour 2 (3:00 AM): Monitor metrics, if stable increase to 20%
Hour 3 (4:00 AM): Increase to 50%
Hour 4 (5:00 AM): Increase to 100%
Hour 5-6 (6:00 AM): Final monitoring, hand off to day team
```

#### Phase 3 Deployment (End of Week 12)

**Features Deployed:**
- Clinic Visit Tracking
- Immunization Dashboard
- Immunization UI Components

**Special Considerations:**
- High data volume features
- Training required for all users
- Conduct training sessions in Weeks 11-12

**Deployment Checklist:**
- [ ] All nurses trained (attendance >95%)
- [ ] User guides distributed
- [ ] Quick reference cards printed
- [ ] Support team expanded (2x capacity for first week)
- [ ] Monitor clinic visit data quality
- [ ] Verify immunization data import from existing systems

#### Phase 4 Deployment (End of Week 16)

**Features Deployed:**
- PDF Report Generation (all templates)
- Medicaid Billing UI

**Financial Impact Testing:**
```bash
# Verify Medicaid claim accuracy
# Compare system-generated claims vs manual claims for 100 students
# Acceptance: >99% match rate

# Test payment tracking
# Verify claims status updates sync correctly

# Load test
# Generate 1000 claims simultaneously
```

**Compliance Validation:**
- [ ] Legal review of Medicaid claim templates
- [ ] Verify HIPAA compliance of billing data
- [ ] Test audit trail for all financial transactions
- [ ] External auditor review (if required)

#### Phase 5 Deployment (End of Week 20)

**Features Deployed:**
- Secure Document Sharing
- Export Scheduling
- State Registry Integration
- SIS Integration UI

**Integration Testing:**
```bash
# Test all external integrations
npm run test:integration:state-registry
npm run test:integration:sis

# Dry-run SIS sync
npm run sync:sis -- --dry-run --school lincoln-elementary

# Verify document sharing encryption
npm run test:e2e:secure-sharing
```

**Final Production Readiness Review:**
- [ ] All 15 features deployed and verified
- [ ] All placeholder components replaced
- [ ] Test coverage >95%
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] HIPAA compliance certified
- [ ] User training completed
- [ ] Documentation complete
- [ ] Support team ready
- [ ] Monitoring and alerting configured

---

## Production Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Load Balancer (AWS ALB)                  │
│                         SSL Termination                       │
└────────────────┬────────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
┌───────▼─────────┐ ┌────▼──────────────┐
│  Frontend CDN   │ │  Backend Cluster  │
│  (CloudFront)   │ │   (EC2 Auto-Scale)│
│                 │ │                   │
│  React SPA      │ │  Hapi.js API      │
│  Static Assets  │ │  Socket.io Server │
└─────────────────┘ └────┬──────────────┘
                         │
            ┌────────────┼────────────┐
            │            │            │
    ┌───────▼─────┐ ┌───▼────┐ ┌────▼─────────┐
    │ PostgreSQL  │ │ Redis  │ │ External APIs│
    │  (RDS)      │ │(ElastiCache)│           │
    │  Primary +  │ │        │ │ • Drug DB   │
    │  Read Replica│ │ Cache  │ │ • Medicaid  │
    └─────────────┘ │ Sessions│ │ • State Reg │
                    │ WebSocket│ │ • SIS      │
                    └──────────┘ └────────────┘
```

---

## Success Metrics

### Feature Adoption Metrics

Track for each feature:
```
Week 1: >50% of active users try feature
Week 2: >70% adoption
Week 4: >90% adoption

If adoption <50% by Week 2:
  - Conduct user interviews
  - Review training materials
  - Simplify UI if needed
```

### Performance Metrics

```
API Response Time:
  - p50: <100ms
  - p95: <200ms
  - p99: <500ms

WebSocket Latency:
  - Alert delivery: <100ms (p95)
  - Connection success rate: >99.9%

PDF Generation:
  - Single report: <2s
  - Batch report (100 students): <30s

Database Query Performance:
  - Dashboard load: <500ms
  - Clinic visit check-in: <200ms
  - Drug interaction check: <500ms
```

### Quality Metrics

```
Bugs:
  - Critical (P0): 0 in production
  - High (P1): <5 per feature
  - Medium (P2): <20 per feature
  - Low (P3): Tracked but not blocking

Test Coverage:
  - Unit: >95% lines, >90% branches
  - Integration: All critical workflows
  - E2E: All user journeys

Code Quality:
  - Linting errors: 0
  - Type errors: 0
  - Security vulnerabilities: 0 (high/critical)
```

### Business Metrics

```
Medicaid Billing (Feature 13):
  - Claims submitted: Track weekly
  - Claim acceptance rate: >95%
  - Revenue generated: Track monthly
  - Time to submit claim: <5 minutes (vs 30 min manual)

Clinic Efficiency (Feature 8):
  - Average visit duration: Track and trend
  - Students per day: Track capacity utilization
  - Time savings vs paper: Target 20% reduction

Compliance (Features 1, 2, 3, 5):
  - HIPAA audit findings: 0
  - PHI disclosure tracking: 100% logged
  - Immunization compliance rate: Increase by 10%
```

---

## Timeline Summary

### Gantt Chart Overview

```
Phase 1: Foundation & Infrastructure (Weeks 1-4)
  Week 1: [PDF Service][WebSocket][Encryption UI]
  Week 2: [PDF Service][WebSocket][Encryption UI]
  Week 3: [PHI Disclosure][Tamper Alerts]
  Week 4: [PHI Disclosure][Tamper Alerts][Testing]
         └─ DEPLOY PHASE 1 ─┘

Phase 2: Patient Safety Features (Weeks 5-8)
  Week 5: [Drug Checker]
  Week 6: [Drug Checker][Outbreak Detection]
  Week 7: [Outbreak Detection][Real-Time Alerts]
  Week 8: [Real-Time Alerts][Integration Testing]
         └─ DEPLOY PHASE 2 ─┘

Phase 3: Operations & Clinical Workflows (Weeks 9-12)
  Week 9:  [Clinic Visits][Immunization Dashboard]
  Week 10: [Clinic Visits][Immunization Dashboard]
  Week 11: [Immunization UI][Training]
  Week 12: [Immunization UI][Testing]
          └─ DEPLOY PHASE 3 ─┘

Phase 4: Financial & Integration (Weeks 13-16)
  Week 13: [PDF Reports][Integration Testing]
  Week 14: [PDF Reports][Medicaid Billing]
  Week 15: [Medicaid Billing]
  Week 16: [Medicaid Billing][Testing]
          └─ DEPLOY PHASE 4 ─┘

Phase 5: Data Management (Weeks 17-20)
  Week 17: [Secure Doc Sharing][Export Scheduling]
  Week 18: [Secure Doc Sharing][Export Scheduling]
  Week 19: [State Registry][SIS Integration]
  Week 20: [State Registry][SIS Integration][Final Testing]
          └─ DEPLOY PHASE 5 ─┘
```

### Resource Allocation

```
Team Structure:

Developer 1: Frontend Lead
  - Weeks 1-4: PDF Service, Encryption UI
  - Weeks 5-8: Drug Checker UI
  - Weeks 9-12: Immunization Dashboard & UI
  - Weeks 13-16: Report Templates
  - Weeks 17-20: Document Sharing UI

Developer 2: Frontend Developer
  - Weeks 1-4: Alert Components, Shared Components
  - Weeks 5-8: Outbreak Detection UI, Real-Time Alerts
  - Weeks 9-12: Clinic Visit UI
  - Weeks 13-16: Medicaid Billing UI
  - Weeks 17-20: Export Scheduling UI

Developer 3: Backend Lead
  - Weeks 1-4: WebSocket Enhancement, Audit Trail
  - Weeks 5-8: Drug Checker Service, Outbreak Detection Logic
  - Weeks 9-12: Clinic Visit API, Immunization API
  - Weeks 13-16: PDF Generation Service, Medicaid Integration
  - Weeks 17-20: State Registry Integration

Developer 4: Backend Developer
  - Weeks 1-4: Database Migrations, PHI Logging
  - Weeks 5-8: Real-Time Alert Service
  - Weeks 9-12: Background Jobs, Reminders
  - Weeks 13-16: Report Generation, Export Service
  - Weeks 17-20: SIS Integration Service

Developer 5: Full-Stack (Integration)
  - Weeks 1-4: Testing Framework, CI/CD
  - Weeks 5-8: External API Integration (Drug DB)
  - Weeks 9-12: Chart Library Integration
  - Weeks 13-16: Medicaid API Integration
  - Weeks 17-20: SIS & State Registry APIs

QA Engineer:
  - Ongoing: Test planning, test execution, automation
  - Each phase: Integration testing, E2E testing
  - Deployment: Production smoke testing

DevOps/SRE (Part-time):
  - Infrastructure setup and monitoring
  - Deployment automation
  - Performance testing and optimization
```

---

## Appendix: Feature Implementation Templates

### A. Feature Implementation Checklist Template

```markdown
# Feature: [Feature Name]

## Planning Phase
- [ ] Requirements documented
- [ ] Architecture design reviewed
- [ ] Database schema designed
- [ ] API endpoints defined
- [ ] UI mockups created
- [ ] Dependencies identified
- [ ] Risks assessed

## Development Phase
- [ ] Database migration created
- [ ] Backend API implemented
- [ ] Service layer implemented
- [ ] Frontend UI implemented
- [ ] Redux state management added
- [ ] Integration with existing features
- [ ] Error handling implemented
- [ ] Loading states implemented
- [ ] Validation implemented (frontend + backend)

## Testing Phase
- [ ] Unit tests written (>95% coverage)
- [ ] Integration tests written
- [ ] E2E tests written
- [ ] Security testing completed
- [ ] Performance testing completed
- [ ] Accessibility testing completed
- [ ] Cross-browser testing completed

## Documentation Phase
- [ ] API documentation updated
- [ ] User guide written
- [ ] Video tutorial recorded
- [ ] Quick reference created
- [ ] ADR written
- [ ] Runbook created

## Deployment Phase
- [ ] Feature flag configured
- [ ] Staging deployment successful
- [ ] Pilot deployment successful
- [ ] Production deployment successful
- [ ] Monitoring configured
- [ ] Alerts configured

## Post-Deployment Phase
- [ ] User training conducted
- [ ] Support team briefed
- [ ] Metrics tracked
- [ ] User feedback collected
- [ ] Issues addressed
- [ ] Retrospective completed
```

### B. Pull Request Template

```markdown
## Feature: [Feature Name]

### Description
Brief description of the changes

### Related Issues
- Fixes #123
- Addresses #456

### Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

### Testing Completed
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

### Compliance Checklist
- [ ] No PHI logged
- [ ] Audit logging implemented (if PHI access)
- [ ] Input validation implemented
- [ ] SQL injection prevention verified
- [ ] XSS prevention verified
- [ ] Access control implemented

### Performance Impact
- [ ] No significant performance degradation
- [ ] Database queries optimized
- [ ] API response time acceptable (<200ms)

### Documentation
- [ ] Code comments added
- [ ] API documentation updated
- [ ] User documentation updated

### Screenshots
[Add screenshots if UI changes]

### Deployment Notes
[Any special deployment considerations]

### Rollback Plan
[How to rollback if issues occur]

### Reviewers
@frontend-lead @backend-lead
```

---

## Conclusion

This comprehensive plan provides a roadmap for implementing 15 critical features over 20 weeks. Key success factors:

1. **Foundation First:** Build shared components (PDF, WebSocket, encryption UI) before feature-specific implementations
2. **Parallel Workstreams:** Multiple developers working on independent features simultaneously
3. **Incremental Deployment:** Deploy in phases with pilot schools before full rollout
4. **Comprehensive Testing:** 95% test coverage, security audits, performance testing
5. **Risk Mitigation:** Feature flags, rollback procedures, contingency plans
6. **Strong Documentation:** Technical, user, compliance, and operational documentation

**Next Steps:**
1. Review and approve this plan (Week 0)
2. Set up infrastructure and CI/CD pipelines (Week 0)
3. Kick off Phase 1 development (Week 1)
4. Weekly status meetings to track progress
5. Bi-weekly demos to stakeholders
6. Continuous iteration based on feedback

**Contact:** For questions or clarifications, contact the project manager or engineering leads.

---

**Document Version:** 1.0
**Last Updated:** October 26, 2025
**Status:** Ready for Approval
**Approval Required:** Engineering Manager, Product Manager, Security Officer, Compliance Officer
