# HIPAA Compliance Guide

## Overview

This document outlines the Health Insurance Portability and Accountability Act (HIPAA) compliance measures implemented in the White Cross School Health Management System.

**Last Updated**: November 7, 2025
**Compliance Officer**: [To be assigned]
**Next Audit Date**: [To be scheduled]

## Table of Contents

1. [Regulatory Framework](#regulatory-framework)
2. [Protected Health Information (PHI)](#protected-health-information)
3. [Security Safeguards](#security-safeguards)
4. [Audit Controls](#audit-controls)
5. [Access Control](#access-control)
6. [Data Retention](#data-retention)
7. [Breach Notification](#breach-notification)
8. [Business Associate Agreements](#business-associate-agreements)
9. [Compliance Testing](#compliance-testing)
10. [Incident Response](#incident-response)

---

## Regulatory Framework

### Applicable Regulations

**HIPAA Security Rule** - 45 CFR Part 164, Subpart C
- **164.308**: Administrative Safeguards
- **164.310**: Physical Safeguards
- **164.312**: Technical Safeguards
- **164.316**: Policies and Procedures and Documentation Requirements

**HIPAA Privacy Rule** - 45 CFR Part 164, Subpart E
- **164.502**: Uses and Disclosures of Protected Health Information
- **164.506**: Uses and Disclosures to Carry Out Treatment, Payment, or Health Care Operations
- **164.512**: Uses and Disclosures for Which an Authorization or Opportunity to Agree or Object is Not Required
- **164.528**: Accounting of Disclosures of Protected Health Information

**HIPAA Breach Notification Rule** - 45 CFR Part 164, Subpart D
- **164.404**: Notification to individuals
- **164.406**: Notification to the media
- **164.408**: Notification to the Secretary
- **164.410**: Notification by a business associate
- **164.412**: Law enforcement delay

### Related Regulations

- **FERPA**: Family Educational Rights and Privacy Act (student education records)
- **State Laws**: California CMIA, Texas Medical Records Privacy Act, etc.
- **COPPA**: Children's Online Privacy Protection Act (for students under 13)

---

## Protected Health Information (PHI)

### Definition

Protected Health Information (PHI) includes any individually identifiable health information transmitted or maintained in any form (electronic, paper, oral) that relates to:

1. Past, present, or future physical or mental health condition
2. Provision of health care
3. Past, present, or future payment for health care

### PHI Elements in White Cross System

#### **Demographic PHI**
- Student name (first, last, middle)
- Date of birth
- Medical record number (MRN)
- Student number (when linked to health information)
- Address, phone number, email
- Parent/guardian contact information

#### **Medical PHI**
- **Health Records**: Diagnoses, treatments, prescriptions
- **Medications**: Current medications, dosage, administration schedule
- **Allergies**: Food, medication, environmental allergies
- **Immunizations**: Vaccination history, dates, lot numbers
- **Vital Signs**: Blood pressure, temperature, heart rate, weight, height
- **Chronic Conditions**: Diabetes, asthma, ADHD, etc.
- **Mental Health Records**: Counseling notes, psychiatric assessments
- **Incident Reports**: Injuries, illnesses, emergency events
- **Clinical Notes**: Nurse observations, assessments
- **Lab Results**: Blood tests, screening results
- **Emergency Contacts**: When linked to student health information

#### **De-Identified Data**

The following do NOT constitute PHI when properly de-identified:
- Aggregate statistics (e.g., "50% of students have up-to-date immunizations")
- Anonymized research data
- Public health reporting (when individual identifiers removed)

**De-identification Standards** (45 CFR 164.514):
1. Expert Determination Method
2. Safe Harbor Method (removal of 18 identifiers)

---

## Security Safeguards

### Administrative Safeguards (45 CFR 164.308)

#### Security Management Process
- **Risk Analysis**: Annual security risk assessments
- **Risk Management**: Implementation of security measures
- **Sanction Policy**: Disciplinary actions for violations
- **Information System Activity Review**: Regular audit log reviews

#### Assigned Security Responsibility
- **Security Officer**: [Contact information]
- **Privacy Officer**: [Contact information]
- **Incident Response Team**: [Team roster]

#### Workforce Security
- **Authorization/Supervision**: Role-based access control
- **Workforce Clearance**: Background checks for personnel
- **Termination Procedures**: Immediate access revocation upon termination

#### Information Access Management
- **Isolating Health Care Clearinghouse Functions**: N/A
- **Access Authorization**: Minimum necessary access
- **Access Establishment and Modification**: Formal approval process

#### Security Awareness and Training
- **Security Reminders**: Quarterly training sessions
- **Protection from Malicious Software**: Antivirus, anti-malware
- **Log-in Monitoring**: Failed login detection
- **Password Management**: Strong password policies

#### Security Incident Procedures
- **Response and Reporting**: See [Incident Response](#incident-response)

#### Contingency Plan
- **Data Backup Plan**: Daily automated backups
- **Disaster Recovery Plan**: [Link to DR plan]
- **Emergency Mode Operation Plan**: Offline access procedures
- **Testing and Revision**: Annual DR drills

#### Evaluation
- **Periodic Security Evaluation**: Annual HIPAA compliance audits

#### Business Associate Contracts
- **Written Contract or Other Arrangement Required**: See [BAA Section](#business-associate-agreements)

### Physical Safeguards (45 CFR 164.310)

#### Facility Access Controls
- **Contingency Operations**: Backup facility procedures
- **Facility Security Plan**: Physical security measures
- **Access Control and Validation Procedures**: Badge access
- **Maintenance Records**: Security system maintenance logs

#### Workstation Use
- **Workstation Security**: Screen lock after 10 minutes inactivity
- **Workstation Location**: Restricted to authorized areas

#### Device and Media Controls
- **Disposal**: Secure data wiping before device disposal
- **Media Re-use**: Data sanitization procedures
- **Accountability**: Asset tracking system
- **Data Backup and Storage**: Encrypted backups

### Technical Safeguards (45 CFR 164.312)

#### Access Control
- **Unique User Identification**: Each user has unique ID
- **Emergency Access Procedure**: Break-glass access with enhanced audit
- **Automatic Logoff**: 30 minutes of inactivity
- **Encryption and Decryption**: AES-256 encryption for data at rest

#### Audit Controls
- **Audit Log Implementation**: See [Audit Controls](#audit-controls)

#### Integrity
- **Mechanism to Authenticate ePHI**: Digital signatures, checksums

#### Person or Entity Authentication
- **Multi-Factor Authentication (MFA)**: Required for all users
- **Session Management**: Secure token-based authentication

#### Transmission Security
- **Integrity Controls**: TLS 1.3 for data in transit
- **Encryption**: HTTPS/TLS for all API communications

---

## Audit Controls

### Audit Logging Requirements (45 CFR 164.312(b))

The system implements comprehensive audit logging for all PHI access and modifications.

#### Logged Events

**Every audit log entry captures:**
- **Who**: User ID, user name
- **What**: Action performed (CREATE, READ, UPDATE, DELETE)
- **When**: Timestamp (ISO 8601 format)
- **Where**: IP address, user agent
- **Which**: Entity type, entity ID
- **How**: Request ID, session ID
- **Result**: Success or failure
- **Changes**: Before/after values for UPDATE operations

#### PHI Access Logging

All access to PHI is logged in the `audit_logs` table with `isPHI=true`:

**Logged PHI Operations:**
1. **CREATE**: New health record creation
2. **READ**: Viewing student health information
3. **UPDATE**: Modifying medication, allergy, or other health data
4. **DELETE**: Soft deletion of health records
5. **EXPORT**: Bulk data export operations
6. **PRINT**: Printing PHI documents

**Current Implementation Status:**
- ✅ CREATE operations logged (BeforeCreate hooks)
- ✅ UPDATE operations logged (BeforeUpdate hooks)
- ⚠️ **PARTIAL**: READ operations need AfterFind hooks (see [Recommendations](#recommendations))
- ✅ DELETE operations logged (paranoid mode + hooks)
- ✅ EXPORT operations logged (controller-level)
- ⚠️ PRINT operations need implementation

#### Audit Log Schema

```typescript
interface AuditLogEntry {
  id: string; // UUID
  action: AuditAction; // CREATE, READ, UPDATE, DELETE, etc.
  entityType: string; // Student, HealthRecord, Medication, etc.
  entityId: string; // UUID of affected record
  userId: string; // User who performed action
  userName: string; // Denormalized for reporting
  ipAddress: string; // Client IP address
  userAgent: string; // Browser/client information
  requestId: string; // Request correlation ID
  sessionId: string; // User session ID
  isPHI: boolean; // Flag for PHI access
  complianceType: 'HIPAA' | 'FERPA' | 'GDPR';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  success: boolean; // Operation success/failure
  errorMessage: string | null; // Error details if failed
  previousValues: Record<string, any>; // Before state
  newValues: Record<string, any>; // After state
  changedFields: string[]; // Modified field names
  metadata: Record<string, any>; // Additional context
  tags: string[]; // Categorization tags
  createdAt: Date; // Timestamp
}
```

#### Audit Log Retention

**Retention Period**: 6 years minimum (45 CFR 164.316(b)(2)(i))

- Audit logs are retained for 6 years from creation
- Logs for records involved in litigation are preserved indefinitely (legal hold)
- Automated purge process runs monthly to remove expired logs
- Soft delete used to maintain audit trail

#### Audit Log Access

**Who Can Access Audit Logs:**
- **System Administrators**: Full access for system maintenance
- **Compliance Officers**: Full access for audit and reporting
- **Security Team**: Full access for breach investigation
- **Authorized Users**: Limited access to their own activity logs
- **External Auditors**: Read-only access with formal authorization

**Audit Log Query Examples:**

```typescript
// Get all PHI access by a specific user
const userPHIAccess = await auditService.getAuditLogs({
  userId: 'user-uuid',
  isPHI: true,
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-12-31'),
});

// Get all access to a specific student's health records
const studentAccess = await auditService.getEntityAuditHistory(
  'Student',
  'student-uuid',
  1, // page
  100 // limit
);

// Get compliance report for HIPAA
const complianceReport = await auditService.getComplianceReport(
  new Date('2025-01-01'),
  new Date('2025-12-31')
);
```

---

## Access Control

### Minimum Necessary Standard (45 CFR 164.502(b))

Access to PHI is limited to the minimum necessary to accomplish the intended purpose.

#### Role-Based Access Control (RBAC)

**Roles and PHI Access:**

| Role | PHI Access Scope | Justification |
|------|------------------|---------------|
| **District Admin** | All schools in district | Oversight and compliance monitoring |
| **School Admin** | Own school only | School-level health management |
| **School Nurse** | Assigned school students | Direct care provision |
| **Counselor** | Assigned students (mental health only) | Mental health services |
| **Teacher** | Limited (allergies, emergency info) | Student safety in classroom |
| **Parent/Guardian** | Own child only | Parental rights under FERPA |
| **Student** | Self only (age-appropriate) | Self-management for older students |
| **IT Support** | De-identified/aggregated only | System maintenance without PHI exposure |

#### Multi-Tenant Isolation

**Implementation:**
- Database-level row-level security (RLS)
- School ID filtering in all PHI queries
- Middleware enforcement of tenant boundaries
- Cross-school access attempts logged and blocked

**Example Query Filter:**
```typescript
// Automatic school filter applied
const students = await Student.findAll({
  where: {
    schoolId: currentUser.schoolId, // Enforced by middleware
  },
});
```

#### Authorization Checks

**Every PHI access request verifies:**
1. User is authenticated (valid session token)
2. User has required role for the operation
3. User is authorized for the specific school/district
4. User has permission for the requested record
5. Operation complies with minimum necessary standard

**Failed authorization is logged:**
- Creates audit log entry with `success: false`
- Captures attempted action and reason for denial
- Triggers alert if repeated unauthorized attempts detected

### Emergency Access Procedures

**Break-Glass Access:**
- Available for life-threatening emergencies
- Requires manager override approval
- Enhanced audit logging with justification
- Post-access review within 24 hours
- All emergency access reported monthly

---

## Data Retention

### Retention Requirements (45 CFR 164.316(b)(2)(i))

**HIPAA Requirement**: Retain documentation for 6 years from creation or last effective date, whichever is later.

### Retention Policies by Entity Type

| Entity Type | Retention Period | Legal Basis | Auto-Purge |
|-------------|------------------|-------------|------------|
| **Audit Logs** | 6 years | 45 CFR 164.316(b)(2)(i) | Yes |
| **Health Records** | 7 years | HIPAA + State Law | No (manual review) |
| **Mental Health Records** | 7 years | 42 CFR Part 2 | No (enhanced protection) |
| **Student Records** | 5-7 years | FERPA + State Law | No (varies by state) |
| **Medications** | 7 years | HIPAA + State Law | No |
| **Immunizations** | Permanent | CDC Guidelines | No |
| **Incident Reports** | 7 years | Risk Management | No |
| **Consent Forms** | 7 years | 45 CFR 164.508 | No |

### State-Specific Variations

**California**:
- Adult records: 7 years
- Minor records: Permanent (until age 18 + 7 years)

**New York**:
- 6 years from discharge

**Florida**:
- 7 years from last patient encounter

**Texas**:
- 10 years from last patient encounter

### Retention Service Features

```typescript
// Get retention report
const report = await dataRetentionService.getRetentionReport('AuditLog');

// Purge expired records (dry run)
const purgeResult = await dataRetentionService.purgeExpiredRecords(
  'AuditLog',
  true // dryRun
);

// Create legal hold (prevents purge)
await dataRetentionService.createLegalHold(
  'HealthRecord',
  ['record-uuid-1', 'record-uuid-2'],
  'Pending litigation - Case #2025-001'
);
```

### Legal Hold Process

**When to Create Legal Hold:**
1. Litigation initiated or reasonably anticipated
2. Regulatory investigation commenced
3. Internal investigation requiring record preservation
4. Written request from legal counsel

**Legal Hold Procedures:**
1. Compliance officer creates legal hold in system
2. Affected records flagged as "on hold"
3. Automated purge excludes held records
4. Monthly legal hold review and status update
5. Legal hold release requires legal counsel approval

---

## Breach Notification

### Breach Definition (45 CFR 164.402)

A **breach** is the acquisition, access, use, or disclosure of PHI in a manner not permitted by the Privacy Rule that compromises the security or privacy of PHI.

**Exceptions (Not Considered Breaches):**
1. Unintentional access/use by workforce member within scope of authority
2. Inadvertent disclosure to another authorized person at same facility
3. Disclosure where recipient could not reasonably retain the information

### Breach Detection

The system implements automated breach detection through the `BreachDetectionService`:

**Detection Algorithms:**

1. **Failed Authentication Spikes**
   - Threshold: 5+ failed logins in 15 minutes
   - Action: Alert + temporary account lock

2. **Unauthorized PHI Access Attempts**
   - Threshold: 3+ failed access attempts in 24 hours
   - Action: Alert + access review

3. **Suspicious Access Patterns**
   - After-hours access (10 PM - 6 AM)
   - High-volume access (50+ records/hour)
   - Action: Alert + manager notification

4. **Bulk Data Export**
   - Threshold: 100+ records in single export
   - Threshold for HHS notification: 500+ records
   - Action: Alert + export review

5. **Privilege Escalation**
   - Unauthorized role/permission changes
   - Action: CRITICAL alert + immediate investigation

### Breach Notification Timeline (45 CFR 164.404-414)

#### Discovery to Notification: 60 Days Maximum

**1. Discovery (Day 0)**
- Breach detection system identifies potential breach
- Incident response team activated
- Preliminary assessment begins

**2. Assessment (Days 1-5)**
- Determine if breach occurred (vs. exception)
- Identify affected individuals and records
- Assess risk to individuals (low/moderate/high)
- Document findings

**3. Notification Preparation (Days 6-30)**
- **To Individuals** (within 60 days of discovery)
  - Written notice by first-class mail
  - Email if individual agreed to electronic notice
  - Substitute notice if contact information insufficient
  - Content requirements: 45 CFR 164.404(c)

- **To Media** (if 500+ residents of state/jurisdiction affected)
  - Prominent media outlets serving the state
  - Within 60 days of discovery

- **To HHS**
  - If 500+ individuals affected: Within 60 days
  - If < 500 individuals affected: Annual report (within 60 days of year end)

**4. Post-Notification (Days 31-90)**
- Offer credit monitoring/identity protection (if appropriate)
- Implement corrective actions
- Update policies and procedures
- Conduct post-incident review
- Document lessons learned

### Breach Notification Content

**Required Elements** (45 CFR 164.404(c)):

1. Brief description of what happened
2. Description of types of PHI involved
3. Steps individuals should take to protect themselves
4. Brief description of what the entity is doing to investigate, mitigate, and prevent future breaches
5. Contact procedures for individuals to ask questions

**Template:**

```
[Organization Letterhead]

[Date]

Dear [Individual Name],

We are writing to notify you of a data security incident that may have affected your protected health information.

WHAT HAPPENED:
[Brief description]

WHAT INFORMATION WAS INVOLVED:
The following information may have been accessed or disclosed:
- [List PHI elements: name, DOB, medical information, etc.]

WHAT WE ARE DOING:
[Description of investigation and remediation]

WHAT YOU CAN DO:
[Recommended actions for individual]

FOR MORE INFORMATION:
Please contact our Privacy Officer at [contact information] with questions.

We sincerely apologize for this incident and any inconvenience it may cause.

Sincerely,
[Signature]
[Title]
```

---

## Business Associate Agreements

### BAA Requirements (45 CFR 164.308(b))

Any third-party service provider that creates, receives, maintains, or transmits PHI on behalf of White Cross must sign a Business Associate Agreement (BAA).

### Covered Services Requiring BAA

**Current Third-Party Services:**

| Service | Vendor | BAA Status | Renewal Date | PHI Access |
|---------|--------|------------|--------------|------------|
| **Cloud Hosting** | [Vendor Name] | ✅ Signed | [Date] | Database access |
| **Database** | [Vendor Name] | ✅ Signed | [Date] | Full PHI access |
| **Email Service** | [Vendor Name] | ⚠️ Required | N/A | Notification emails with PHI |
| **SMS Provider** | [Vendor Name] | ⚠️ Required | N/A | Appointment reminders |
| **Backup Service** | [Vendor Name] | ✅ Signed | [Date] | Encrypted backups |
| **Analytics** | [Vendor Name] | ❌ Not Required | N/A | De-identified data only |
| **Error Monitoring** | [Vendor Name] | ⚠️ Review Needed | N/A | May capture PHI in errors |

### BAA Required Provisions

**Permitted Uses and Disclosures:**
- Business associate may use and disclose PHI only as permitted by the agreement
- May use PHI for proper management and administration
- May provide data aggregation services

**Obligations:**
- Not use or disclose PHI other than as permitted
- Use appropriate safeguards to prevent impermissible uses/disclosures
- Report security incidents and breaches to covered entity
- Ensure subcontractors agree to same restrictions (subcontractor BAAs)
- Make PHI available for individual access
- Make PHI available for amendment
- Account for disclosures
- Make internal practices, books, and records available for HHS compliance review
- Return or destroy PHI at termination (if feasible)

### BAA Management Process

**1. Vendor Onboarding:**
- Assess if vendor will access PHI
- If yes, require BAA before data access
- Legal review and execution
- Store signed BAA in compliance repository

**2. Ongoing Management:**
- Annual BAA renewal review
- Vendor security assessment (SOC 2, ISO 27001)
- Incident reporting verification
- Subcontractor BAA validation

**3. Vendor Termination:**
- Ensure PHI return or destruction
- Obtain certification of data destruction
- Revoke all access credentials
- Update access control lists

---

## Compliance Testing

### Automated Testing

**Unit Tests:**
```bash
npm test -- audit.service.spec.ts
npm test -- breach-detection.service.spec.ts
npm test -- data-retention.service.spec.ts
```

**Integration Tests:**
```bash
npm test -- hipaa-access-control.spec.ts
npm test -- hipaa-audit-logging.spec.ts
```

**E2E Compliance Tests:**
```bash
npm run test:e2e -- hipaa-compliance.e2e-spec.ts
```

### Manual Testing Procedures

**Quarterly HIPAA Compliance Audit Checklist:**

- [ ] Review audit log completeness (all PHI access logged)
- [ ] Test unauthorized access prevention (cross-school isolation)
- [ ] Verify encryption in transit (HTTPS, TLS 1.3)
- [ ] Verify encryption at rest (database encryption enabled)
- [ ] Test breach detection algorithms
- [ ] Review data retention compliance
- [ ] Verify BAA status for all vendors
- [ ] Test emergency access procedures
- [ ] Review user access permissions (minimum necessary)
- [ ] Test incident response workflow
- [ ] Verify backup encryption and integrity
- [ ] Review and update security policies

### Penetration Testing

**Annual Third-Party Security Assessment:**
- HIPAA-focused penetration testing
- Vulnerability assessment
- Social engineering test
- Physical security review
- Remediation plan for findings

---

## Incident Response

See detailed procedures in [SECURITY_INCIDENT_RESPONSE.md](./SECURITY_INCIDENT_RESPONSE.md)

**Quick Reference:**

1. **Detection**: Automated breach detection + user reporting
2. **Containment**: Isolate affected systems, revoke access
3. **Investigation**: Determine scope, affected records, root cause
4. **Notification**: Follow 60-day timeline for breach notification
5. **Remediation**: Implement fixes, update policies
6. **Post-Incident**: Lessons learned, compliance reporting

**Emergency Contacts:**
- **Security Officer**: [Name, Phone, Email]
- **Privacy Officer**: [Name, Phone, Email]
- **Legal Counsel**: [Name, Phone, Email]
- **HHS OCR**: 1-800-368-1019, ocrmail@hhs.gov

---

## Recommendations

### Critical Gaps to Address

1. **READ Operation Logging**
   - **Status**: Not implemented for most PHI models
   - **Risk**: Incomplete audit trail violates 45 CFR 164.312(b)
   - **Recommendation**: Implement `@AfterFind` hooks on all PHI models
   - **Priority**: HIGH
   - **Effort**: 2-3 days

2. **Business Associate Agreements**
   - **Status**: Not all vendors have signed BAAs
   - **Risk**: Potential HIPAA violation
   - **Recommendation**: Obtain BAAs from email, SMS vendors within 30 days
   - **Priority**: CRITICAL
   - **Effort**: 1-2 weeks (legal review)

3. **Encryption at Rest**
   - **Status**: Needs verification
   - **Risk**: Potential exposure of ePHI
   - **Recommendation**: Enable database encryption, verify backup encryption
   - **Priority**: HIGH
   - **Effort**: 1 week (infrastructure)

### Best Practices

1. **Regular Security Training**
   - Conduct HIPAA training for all workforce members annually
   - Targeted training for new hires within 30 days
   - Document training completion in compliance system

2. **Audit Log Monitoring**
   - Weekly review of high-severity audit events
   - Monthly compliance reports
   - Quarterly comprehensive audit

3. **Vendor Management**
   - Maintain current BAA repository
   - Annual vendor security assessments
   - Continuous monitoring of vendor incidents

4. **Incident Preparedness**
   - Annual incident response drills
   - Update contact lists quarterly
   - Review and update IR plan annually

---

## Appendix

### Regulatory References

- [HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/index.html)
- [HIPAA Privacy Rule](https://www.hhs.gov/hipaa/for-professionals/privacy/index.html)
- [Breach Notification Rule](https://www.hhs.gov/hipaa/for-professionals/breach-notification/index.html)
- [HHS Guidance](https://www.hhs.gov/hipaa/for-professionals/compliance-enforcement/guidance/index.html)

### Training Resources

- [HHS HIPAA Training](https://www.hhs.gov/hipaa/for-professionals/training/index.html)
- [AHIMA HIPAA Certification](https://www.ahima.org/certification/chps/)

### Audit Templates

- [Annual HIPAA Risk Assessment Template](./templates/risk-assessment.xlsx)
- [Breach Notification Template](./templates/breach-notification.docx)
- [BAA Template](./templates/baa-template.docx)

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-07 | Accessibility Architect | Initial HIPAA compliance documentation |

**Approval**

- [ ] Compliance Officer: _________________ Date: _______
- [ ] Privacy Officer: _________________ Date: _______
- [ ] Security Officer: _________________ Date: _______
- [ ] Legal Counsel: _________________ Date: _______
