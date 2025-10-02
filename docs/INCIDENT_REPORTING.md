# Incident Reporting System

The White Cross Incident Reporting System provides comprehensive tools for documenting, managing, and tracking student incidents while ensuring legal compliance and facilitating insurance claims.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Data Model](#data-model)
- [API Endpoints](#api-endpoints)
- [Frontend Components](#frontend-components)
- [Compliance and Legal](#compliance-and-legal)
- [Best Practices](#best-practices)

## Overview

The Incident Reporting System is designed to help school nurses:
- Document incidents thoroughly and accurately
- Manage evidence collection (photos, videos, documents)
- Collect and verify witness statements
- Track follow-up actions and compliance
- Automate parent notifications
- Generate legal documents and reports
- Process insurance claims
- Maintain audit trails for regulatory compliance

## Features

### 1. Comprehensive Incident Documentation

Create detailed incident reports with:
- Incident type (Injury, Illness, Behavioral, Medication Error, Allergic Reaction, Emergency, Other)
- Severity levels (Low, Medium, High, Critical)
- Location and time of occurrence
- Detailed description of the incident
- Actions taken by staff
- Witness information
- Related student information

### 2. Automated Injury Report Generation

Generate professional, comprehensive incident reports that include:
- Report number (INC-XXXXXXXX format)
- Student information (name, student number, grade, date of birth)
- Incident details (type, severity, location, time)
- Actions taken
- Witness statements
- Evidence attachments
- Follow-up actions
- Compliance status
- Insurance information

**API Endpoint**: `GET /api/incident-reports/:id/document`

### 3. Photo/Video Evidence Management

Upload and manage evidence:
- Photo evidence with timestamping
- Video evidence with secure storage
- Document attachments
- Automatic metadata tracking
- Secure cloud storage integration

**API Endpoint**: `POST /api/incident-reports/:id/evidence`

**Request Body**:
```json
{
  "evidenceType": "photo",
  "evidenceUrls": ["https://storage.example.com/photo1.jpg"]
}
```

### 4. Witness Statement Collection and Verification

Collect statements from witnesses:
- Student witnesses
- Staff witnesses
- Parent witnesses
- Other witnesses

Each statement includes:
- Witness name and type
- Contact information
- Detailed statement
- Verification status
- Verifier information and timestamp

**Add Statement**: `POST /api/incident-reports/:id/witness-statements`

**Request Body**:
```json
{
  "witnessName": "John Teacher",
  "witnessType": "STAFF",
  "witnessContact": "john.teacher@school.edu",
  "statement": "I witnessed the student fall on the playground..."
}
```

**Verify Statement**: `PUT /api/incident-reports/witness-statements/:statementId/verify`

### 5. Follow-up Action Tracking

Create and track follow-up actions:
- Action description
- Due date
- Priority level (Low, Medium, High, Urgent)
- Assignment to staff members
- Status tracking (Pending, In Progress, Completed, Cancelled)
- Completion notes

**Add Action**: `POST /api/incident-reports/:id/follow-up-actions`

**Request Body**:
```json
{
  "action": "Schedule follow-up assessment",
  "dueDate": "2024-01-15T10:00:00Z",
  "priority": "HIGH",
  "assignedTo": "Nurse Jane"
}
```

**Update Action**: `PUT /api/incident-reports/follow-up-actions/:actionId`

**Request Body**:
```json
{
  "status": "COMPLETED",
  "notes": "Assessment completed. Student fully recovered."
}
```

### 6. Legal Compliance Reporting

Track compliance status:
- Pending: Initial state, awaiting review
- Compliant: All requirements met
- Non-Compliant: Issues identified
- Under Review: Being evaluated for compliance

**Update Compliance**: `PUT /api/incident-reports/:id/compliance`

**Request Body**:
```json
{
  "status": "COMPLIANT"
}
```

### 7. Parent Notification Automation

Automated multi-channel notifications:
- Email notifications
- SMS text messages
- Voice calls

Tracking includes:
- Notification method used
- Timestamp of notification
- Staff member who triggered notification

**Send Notification**: `POST /api/incident-reports/:id/notify-parent-automated`

**Request Body**:
```json
{
  "method": "email"
}
```

### 8. Insurance Claim Integration

Manage insurance claims:
- Claim number assignment
- Status tracking:
  - Not Filed
  - Filed
  - Pending
  - Approved
  - Denied
  - Closed

**Update Claim**: `PUT /api/incident-reports/:id/insurance-claim`

**Request Body**:
```json
{
  "claimNumber": "CLM-2024-001234",
  "status": "FILED"
}
```

## Data Model

### IncidentReport

```typescript
{
  id: string
  type: 'INJURY' | 'ILLNESS' | 'BEHAVIORAL' | 'MEDICATION_ERROR' | 'ALLERGIC_REACTION' | 'EMERGENCY' | 'OTHER'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  location: string
  witnesses: string[]
  actionsTaken: string
  parentNotified: boolean
  parentNotificationMethod?: string
  parentNotifiedAt?: DateTime
  parentNotifiedBy?: string
  followUpRequired: boolean
  followUpNotes?: string
  attachments: string[]
  evidencePhotos: string[]
  evidenceVideos: string[]
  occurredAt: DateTime
  insuranceClaimNumber?: string
  insuranceClaimStatus?: InsuranceClaimStatus
  legalComplianceStatus: ComplianceStatus
  student: Student
  reportedBy: User
  witnessStatements: WitnessStatement[]
  followUpActions: FollowUpAction[]
}
```

### WitnessStatement

```typescript
{
  id: string
  witnessName: string
  witnessType: 'STUDENT' | 'STAFF' | 'PARENT' | 'OTHER'
  witnessContact?: string
  statement: string
  verified: boolean
  verifiedBy?: string
  verifiedAt?: DateTime
}
```

### FollowUpAction

```typescript
{
  id: string
  action: string
  dueDate: DateTime
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  assignedTo?: string
  completedAt?: DateTime
  completedBy?: string
  notes?: string
}
```

## API Endpoints

### Core Incident Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/incident-reports` | List all incident reports with pagination and filtering |
| GET | `/api/incident-reports/:id` | Get a specific incident report |
| POST | `/api/incident-reports` | Create a new incident report |
| PUT | `/api/incident-reports/:id` | Update an incident report |
| GET | `/api/incident-reports/:id/document` | Generate incident report document |

### Witness Statements

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/incident-reports/:id/witness-statements` | Add a witness statement |
| PUT | `/api/incident-reports/witness-statements/:id/verify` | Verify a witness statement |

### Follow-up Actions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/incident-reports/:id/follow-up-actions` | Add a follow-up action |
| PUT | `/api/incident-reports/follow-up-actions/:id` | Update follow-up action status |

### Evidence Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/incident-reports/:id/evidence` | Upload photo/video evidence |

### Compliance and Claims

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/incident-reports/:id/insurance-claim` | Update insurance claim information |
| PUT | `/api/incident-reports/:id/compliance` | Update legal compliance status |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/incident-reports/:id/notify-parent-automated` | Send automated parent notification |
| PUT | `/api/incident-reports/:id/notify-parent` | Manually mark parent as notified |

### Statistics and Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/incident-reports/statistics/overview` | Get incident statistics |
| GET | `/api/incident-reports/search/:query` | Search incident reports |
| GET | `/api/incident-reports/follow-up/pending` | Get incidents requiring follow-up |

## Frontend Components

### Main Pages

1. **Incident Reports Overview** (`/incident-reports`)
   - Dashboard with feature cards
   - Recent incidents list
   - Quick access to create new reports

2. **All Incidents List** (`/incident-reports?view=list`)
   - Comprehensive list of all incidents
   - Filtering by severity, type, compliance status
   - Document generation controls
   - Quick view controls

3. **Incident Details** (`/incident-reports/:id`)
   - Complete incident information
   - Witness statement management
   - Evidence display and upload
   - Parent notification controls
   - Follow-up action tracking
   - Compliance and insurance management

### Key Features

- **Color-coded severity indicators**: Visual cues for incident severity
- **Status badges**: Clear display of compliance and claim status
- **Real-time updates**: Immediate feedback on actions
- **Responsive design**: Works on desktop, tablet, and mobile
- **Accessible UI**: WCAG compliant interface

## Compliance and Legal

### HIPAA Compliance

- All incident data is encrypted at rest and in transit
- Access controls ensure only authorized personnel can view reports
- Comprehensive audit trails track all access and modifications
- Automatic data retention policies

### FERPA Compliance

- Student privacy is maintained throughout the reporting process
- Parent access is controlled and audited
- Data sharing follows FERPA guidelines

### State Regulations

- Reports can be customized to meet state-specific requirements
- Automatic alerts for mandatory reporting situations
- Integration with state reporting systems

### Documentation Standards

- Reports follow industry-standard templates
- Legal language is pre-approved by compliance team
- Consistent formatting for legal review

## Best Practices

### When Creating an Incident Report

1. **Document Immediately**: Create reports as soon as possible after the incident
2. **Be Detailed**: Include all relevant information, even if it seems minor
3. **Use Objective Language**: Stick to facts, avoid opinions or assumptions
4. **Include Witnesses**: Identify all witnesses and collect statements promptly
5. **Take Photos**: Capture visual evidence when appropriate and with proper consent

### For Witness Statements

1. **Collect Promptly**: Get statements while events are fresh in witnesses' minds
2. **Use Their Words**: Record statements in the witness's own words
3. **Verify Identity**: Confirm witness contact information
4. **Get Verification**: Have statements verified by the witness or supervisor

### For Follow-up Actions

1. **Set Realistic Due Dates**: Allow adequate time for completion
2. **Assign Clearly**: Ensure the assigned person is aware and accepts responsibility
3. **Track Progress**: Regularly review pending actions
4. **Document Completion**: Add notes when actions are completed

### For Parent Notifications

1. **Notify Promptly**: Contact parents as soon as appropriate after an incident
2. **Use Multiple Channels**: Consider using both email and phone for important incidents
3. **Document All Attempts**: Record all notification attempts, even unsuccessful ones
4. **Follow Up**: Confirm parents received and understood the notification

### For Evidence Management

1. **Timestamp Everything**: Ensure all evidence is properly timestamped
2. **Maintain Chain of Custody**: Track who accessed evidence and when
3. **Store Securely**: Use secure cloud storage with encryption
4. **Respect Privacy**: Only include necessary evidence, respect student privacy

### For Insurance Claims

1. **File Promptly**: Submit claims within required timeframes
2. **Include All Documentation**: Provide complete incident reports and evidence
3. **Track Status**: Monitor claim progress and follow up as needed
4. **Keep Records**: Maintain copies of all claim communications

## Support

For questions or issues with the Incident Reporting System:
- Contact the IT Support Team
- Review the general documentation at `/docs`
- Check the FAQ section in the application

## Updates and Changelog

This feature was implemented in version 1.0 and includes all components listed above. For future updates and enhancements, please refer to the main CHANGELOG.md file.
