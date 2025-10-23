# Compliance & System Modules - Swagger/OpenAPI Documentation Summary

**White Cross Healthcare Platform - Backend API**
**OpenAPI Version**: 3.0 (via hapi-swagger)
**Documentation Generated**: 2025-10-23
**Total Endpoints**: 68 endpoints across 5 route files

---

## Table of Contents

1. [Compliance Module](#compliance-module)
   - [Audit Routes (17 endpoints)](#audit-routes)
   - [Compliance Routes (28 endpoints)](#compliance-routes)
2. [System Module](#system-module)
   - [Authentication Routes (5 endpoints)](#authentication-routes)
   - [Configuration Routes (7 endpoints)](#configuration-routes)
   - [Integrations Routes (11 endpoints)](#integrations-routes)
3. [Security & Authorization](#security--authorization)
4. [Compliance Requirements](#compliance-requirements)
5. [Validation Schemas](#validation-schemas)

---

## Compliance Module

The Compliance module provides comprehensive HIPAA/FERPA compliance management, audit trail logging, and regulatory reporting capabilities.

### Audit Routes

**Base Path**: `/api/v1/audit`
**Total Endpoints**: 17
**Authentication**: JWT required for all endpoints
**Authorization**: Admin/Compliance Officer roles required for most endpoints

#### Audit Log Management

##### 1. List Audit Logs
- **Method**: `GET`
- **Path**: `/api/v1/audit/logs`
- **Description**: List audit logs with comprehensive filtering and pagination
- **Tags**: `Audit`, `Compliance`, `v1`
- **Authorization**: Admin, Compliance Officer
- **Query Parameters**:
  - `userId` (uuid, optional) - Filter by user UUID
  - `entityType` (string, optional) - Filter by entity type (STUDENT, HEALTH_RECORD, MEDICATION, etc.)
  - `action` (enum, optional) - Filter by action (CREATE, READ, VIEW, ACCESS, UPDATE, DELETE, LOGIN, LOGOUT, EXPORT, IMPORT, BACKUP, RESTORE, SECURITY_EVENT)
  - `startDate` (ISO 8601, optional) - Filter start date
  - `endDate` (ISO 8601, optional) - Filter end date
  - `ipAddress` (IPv4/IPv6, optional) - Filter by IP address
  - `page` (number, default: 1) - Page number
  - `limit` (number, default: 20, max: 100) - Records per page
- **Responses**:
  - `200` - Audit logs retrieved successfully with pagination
  - `401` - Unauthorized
  - `403` - Forbidden (Admin or Compliance Officer only)
- **HIPAA Compliance**: Critical endpoint for compliance audits and security investigations
- **Audit Trail**: All access to this endpoint is logged

**Example Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "action": "VIEW",
      "entityType": "HEALTH_RECORD",
      "entityId": "uuid",
      "changes": {},
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "timestamp": "2025-10-23T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

##### 2. Get Audit Log by ID
- **Method**: `GET`
- **Path**: `/api/v1/audit/logs/{id}`
- **Description**: Get detailed audit log entry by ID
- **Tags**: `Audit`, `Compliance`, `v1`
- **Path Parameters**:
  - `id` (uuid, required) - Audit log ID
- **Responses**:
  - `200` - Audit log retrieved successfully
  - `401` - Unauthorized
  - `404` - Audit log not found

##### 3. Create Audit Log Entry
- **Method**: `POST`
- **Path**: `/api/v1/audit/logs`
- **Description**: Manually create audit log entry for system actions
- **Tags**: `Audit`, `Compliance`, `v1`
- **Request Body**:
  - `userId` (uuid, optional) - User ID (null for system actions)
  - `action` (enum, required) - Action type
  - `entityType` (string, required) - Entity type being acted upon
  - `entityId` (string, optional) - Entity ID if applicable
  - `changes` (object, optional) - Details of changes or action metadata
  - `ipAddress` (IP address, optional) - IP address (auto-captured if not provided)
  - `userAgent` (string, max 500, optional) - Browser user agent
- **Responses**:
  - `201` - Audit log created successfully
  - `400` - Validation error
  - `401` - Unauthorized

#### PHI Access Logging

##### 4. Get PHI Access Logs
- **Method**: `GET`
- **Path**: `/api/v1/audit/phi-access`
- **Description**: Get Protected Health Information (PHI) access audit trail
- **Tags**: `Audit`, `PHI`, `Compliance`, `v1`
- **Authorization**: Admin, Compliance Officer
- **Query Parameters**:
  - `userId` (uuid, optional) - Filter by user ID
  - `studentId` (uuid, optional) - Filter by student ID
  - `accessType` (enum, optional) - Filter by access type (VIEW, EDIT, EXPORT, PRINT, DELETE)
  - `dataCategory` (enum, optional) - Filter by data category (HEALTH_RECORD, MEDICATION, ALLERGY, CHRONIC_CONDITION, VACCINATION, MENTAL_HEALTH, EMERGENCY_CONTACT, FULL_PROFILE)
  - `startDate` (ISO 8601, optional) - Filter start date
  - `endDate` (ISO 8601, optional) - Filter end date
  - `page`, `limit` - Pagination parameters
- **Responses**:
  - `200` - PHI access logs retrieved successfully
  - `401` - Unauthorized
  - `403` - Forbidden (Admin or Compliance Officer only)
- **HIPAA Compliance**: Critical endpoint for tracking PHI access
- **Security Rule Reference**: 45 CFR § 164.308(a)(1)(ii)(D)

##### 5. Log PHI Access
- **Method**: `POST`
- **Path**: `/api/v1/audit/phi-access`
- **Description**: Record PHI access for HIPAA compliance
- **Tags**: `Audit`, `PHI`, `Compliance`, `v1`
- **Request Body**:
  - `userId` (uuid, required) - User accessing PHI
  - `studentId` (uuid, required) - Student whose PHI is being accessed
  - `accessType` (enum, required) - Type of access (VIEW, EDIT, EXPORT, PRINT, DELETE)
  - `dataCategory` (enum, required) - Category of PHI data
  - `entityType` (string, required) - Specific entity type
  - `entityId` (string, optional) - Specific entity ID
  - `success` (boolean, default: true) - Whether access was successful
  - `errorMessage` (string, max 1000, optional) - Error message if access failed
- **Responses**:
  - `201` - PHI access logged successfully
  - `400` - Validation error
  - `401` - Unauthorized
- **HIPAA Compliance**: Required by HIPAA Security Rule
- **Auto-Capture**: IP address and timestamp automatically captured

#### Audit Statistics & Analytics

##### 6. Get Audit Statistics
- **Method**: `GET`
- **Path**: `/api/v1/audit/statistics`
- **Description**: Get comprehensive audit statistics for specified date range
- **Tags**: `Audit`, `Statistics`, `Compliance`, `v1`
- **Query Parameters**:
  - `startDate` (ISO 8601, required) - Statistics start date
  - `endDate` (ISO 8601, required) - Statistics end date
  - `groupBy` (enum, optional, default: 'action') - Group statistics by: action, entityType, user, hour, day
- **Responses**:
  - `200` - Audit statistics retrieved successfully
  - `400` - Validation error
  - `401` - Unauthorized
- **Returns**: Total logs, unique users, action distribution, entity type distribution, hourly/daily trends, top users by activity

##### 7. Get User Activity
- **Method**: `GET`
- **Path**: `/api/v1/audit/user/{userId}/activity`
- **Description**: Get paginated audit trail for specific user
- **Tags**: `Audit`, `Users`, `Compliance`, `v1`
- **Path Parameters**:
  - `userId` (uuid, required) - User ID
- **Query Parameters**:
  - `startDate` (ISO 8601, optional) - Filter start date
  - `endDate` (ISO 8601, optional) - Filter end date
  - `action` (string, optional) - Filter by action type
  - `page`, `limit` - Pagination parameters
- **Responses**:
  - `200` - User activity retrieved successfully
  - `401` - Unauthorized
  - `404` - User not found

##### 8. Export Audit Logs
- **Method**: `GET`
- **Path**: `/api/v1/audit/export`
- **Description**: Export audit logs for compliance reporting
- **Tags**: `Audit`, `Export`, `Compliance`, `v1`
- **Authorization**: Admin only
- **Query Parameters**:
  - `startDate` (ISO 8601, required) - Export start date
  - `endDate` (ISO 8601, required) - Export end date
  - `format` (enum, optional, default: 'csv') - Export format (csv, json, pdf)
  - `userId` (uuid, optional) - Filter by user
  - `entityType` (string, optional) - Filter by entity type
  - `action` (enum, optional) - Filter by action
- **Responses**:
  - `200` - Audit logs exported successfully
  - `400` - Validation error
  - `401` - Unauthorized
  - `403` - Forbidden (Admin only)
- **Note**: Large exports may take time to process

#### Security Analysis

##### 9. Get Security Analysis
- **Method**: `GET`
- **Path**: `/api/v1/audit/security-analysis`
- **Description**: Perform comprehensive security analysis
- **Tags**: `Audit`, `Security`, `Compliance`, `v1`
- **Authorization**: Admin, Security Officer
- **Query Parameters**:
  - `startDate` (ISO 8601, required) - Analysis start date
  - `endDate` (ISO 8601, required) - Analysis end date
  - `severityThreshold` (enum, optional) - Minimum severity (LOW, MEDIUM, HIGH, CRITICAL)
- **Responses**:
  - `200` - Security analysis completed successfully
  - `400` - Validation error
  - `401` - Unauthorized
  - `403` - Forbidden (Admin or Security Officer only)
- **Analysis Includes**:
  - Suspicious login patterns (failed attempts, brute force)
  - Unusual PHI access (high volume, wide access, after-hours)
  - Data exfiltration detection (bulk exports, rapid downloads)
  - Access pattern analysis
  - Risk levels and flagged users
  - Security recommendations

##### 10. Run Security Analysis
- **Method**: `POST`
- **Path**: `/api/v1/audit/security-analysis/run`
- **Description**: Trigger on-demand comprehensive security analysis
- **Tags**: `Audit`, `Security`, `Compliance`, `v1`
- **Authorization**: Admin, Security Officer
- **Request Body**: Same as query parameters for GET security analysis
- **Responses**:
  - `201` - Security analysis completed and report generated
  - `400` - Validation error
  - `401` - Unauthorized
  - `403` - Forbidden
- **Results**: Saved for compliance documentation

#### Compliance Reporting

##### 11. Generate Compliance Report
- **Method**: `GET`
- **Path**: `/api/v1/audit/compliance-report`
- **Description**: Generate comprehensive HIPAA compliance report
- **Tags**: `Audit`, `Compliance`, `Reports`, `v1`
- **Authorization**: Compliance Officer only
- **Query Parameters**:
  - `startDate` (ISO 8601, required) - Report start date
  - `endDate` (ISO 8601, required) - Report end date
- **Responses**:
  - `200` - Compliance report generated successfully
  - `400` - Validation error
  - `401` - Unauthorized
  - `403` - Forbidden (Compliance Officer only)
- **Report Includes**:
  - PHI access summary (total access, success rate)
  - Access by type and category
  - Top users and students by access count
  - Failed access attempts
  - Compliance metrics
- **Required For**: Periodic HIPAA compliance reviews

#### Anomaly Detection

##### 12. Detect Security Anomalies
- **Method**: `GET`
- **Path**: `/api/v1/audit/anomalies`
- **Description**: Detect anomalous behavior patterns in audit logs
- **Tags**: `Audit`, `Security`, `Anomalies`, `v1`
- **Authorization**: Admin, Security Officer
- **Query Parameters**:
  - `startDate` (ISO 8601, required) - Analysis start date
  - `endDate` (ISO 8601, required) - Analysis end date
- **Responses**:
  - `200` - Anomalies detected and analyzed
  - `400` - Validation error
  - `401` - Unauthorized
  - `403` - Forbidden
- **Detection Includes**:
  - Suspicious logins (multiple failures, brute force attempts)
  - Unusual PHI access (abnormal volumes, patterns)
  - After-hours access (outside business hours)
  - Flagged activities with risk levels

#### Session Audit Trail

##### 13. Get Session Audit Trail
- **Method**: `GET`
- **Path**: `/api/v1/audit/session/{sessionId}`
- **Description**: Get complete audit trail for a user session
- **Tags**: `Audit`, `Sessions`, `Compliance`, `v1`
- **Path Parameters**:
  - `sessionId` (string, required) - Session ID
- **Responses**:
  - `200` - Session audit trail retrieved successfully
  - `401` - Unauthorized
  - `404` - Session not found
- **Trail Includes**: All actions from login to logout, entities accessed, modifications, failed attempts, timeline

#### Data Access History

##### 14. Get Data Access History
- **Method**: `GET`
- **Path**: `/api/v1/audit/data-access/{resourceType}/{resourceId}`
- **Description**: Get complete access history for a specific resource
- **Tags**: `Audit`, `DataAccess`, `Compliance`, `v1`
- **Path Parameters**:
  - `resourceType` (string, required) - Resource type (e.g., HEALTH_RECORD, MEDICATION)
  - `resourceId` (uuid, required) - Resource ID
- **Query Parameters**:
  - `page`, `limit` - Pagination parameters
- **Responses**:
  - `200` - Data access history retrieved successfully
  - `401` - Unauthorized
  - `404` - Resource not found
- **HIPAA Compliance**: Critical for PHI disclosure accounting
- **Use Case**: Answer "Who accessed this student's records?"

#### Archive Operations

##### 15. Archive Old Audit Logs
- **Method**: `DELETE`
- **Path**: `/api/v1/audit/logs/archive`
- **Description**: Archive audit logs older than specified days
- **Tags**: `Audit`, `Archive`, `Compliance`, `v1`
- **Authorization**: Admin only
- **Request Body**:
  - `olderThanDays` (number, min: 90, required) - Archive logs older than X days
  - `dryRun` (boolean, optional, default: false) - Test mode without actual archiving
- **Responses**:
  - `200` - Audit logs archived successfully
  - `400` - Validation error (retention violation)
  - `401` - Unauthorized
  - `403` - Forbidden (Admin only)
- **HIPAA Compliance**: Maintains data retention requirements
- **Minimum Retention**: 90 days (cannot delete logs newer than 90 days)
- **Note**: Moves logs to long-term storage while maintaining compliance

---

### Compliance Routes

**Base Path**: `/api/v1/compliance`
**Total Endpoints**: 28
**Authentication**: JWT required for all endpoints
**Authorization**: Varies by endpoint (typically Compliance Officer or Admin)

#### Compliance Report Management

##### 16. List Compliance Reports
- **Method**: `GET`
- **Path**: `/api/v1/compliance/reports`
- **Description**: List compliance reports with filtering
- **Tags**: `Compliance`, `Reports`, `v1`
- **Authorization**: Compliance Officer, Admin
- **Query Parameters**:
  - `reportType` (enum, optional) - Filter by type (HIPAA, FERPA, PRIVACY, SECURITY, BREACH, RISK_ASSESSMENT, TRAINING, AUDIT, GENERAL)
  - `status` (enum, optional) - Filter by status (PENDING, IN_PROGRESS, COMPLIANT, NON_COMPLIANT, NEEDS_REVIEW)
  - `period` (enum, optional) - Filter by period (DAILY, WEEKLY, MONTHLY, QUARTERLY, ANNUAL)
  - `page`, `limit` - Pagination parameters
- **Responses**:
  - `200` - Compliance reports retrieved successfully
  - `401` - Unauthorized
  - `403` - Forbidden

##### 17. Get Compliance Report by ID
- **Method**: `GET`
- **Path**: `/api/v1/compliance/reports/{id}`
- **Description**: Get detailed compliance report
- **Tags**: `Compliance`, `Reports`, `v1`
- **Path Parameters**:
  - `id` (uuid, required) - Report ID
- **Responses**:
  - `200` - Compliance report retrieved successfully
  - `401` - Unauthorized
  - `404` - Report not found
- **Returns**: Title, description, type, status, period, findings, recommendations, checklist items, submission details, review status

##### 18. Create Compliance Report
- **Method**: `POST`
- **Path**: `/api/v1/compliance/reports`
- **Description**: Create new compliance report
- **Tags**: `Compliance`, `Reports`, `v1`
- **Authorization**: Compliance Officer only
- **Request Body**:
  - `reportType` (enum, required) - Report type
  - `title` (string, 5-200 chars, required) - Report title
  - `description` (string, max 2000 chars, optional) - Report description
  - `period` (enum, required) - Reporting period
  - `dueDate` (ISO 8601, optional) - Report due date
- **Responses**:
  - `201` - Compliance report created successfully
  - `400` - Validation error
  - `401` - Unauthorized
  - `403` - Forbidden (Compliance Officer only)
- **Report Types**:
  - **HIPAA**: Privacy/security rule compliance
  - **FERPA**: Education records compliance
  - **PRIVACY**: Data protection
  - **SECURITY**: Access controls
  - **BREACH**: Incident reporting
  - **RISK_ASSESSMENT**: Risk analysis
  - **TRAINING**: Staff training compliance
  - **AUDIT**: Audit results

##### 19. Update Compliance Report
- **Method**: `PUT`
- **Path**: `/api/v1/compliance/reports/{id}`
- **Description**: Update compliance report status, findings, or recommendations
- **Tags**: `Compliance`, `Reports`, `v1`
- **Authorization**: Compliance Officer only
- **Path Parameters**:
  - `id` (uuid, required) - Report ID
- **Request Body**:
  - `status` (enum, optional) - Update status
  - `findings` (object, optional) - Compliance findings
  - `recommendations` (array of strings, optional) - Recommendations
  - `submittedBy` (uuid, optional) - Submitter user ID
  - `reviewedBy` (uuid, optional) - Reviewer user ID
- **Responses**:
  - `200` - Report updated successfully
  - `400` - Validation error
  - `401` - Unauthorized
  - `404` - Report not found
- **Status Workflow**: PENDING → IN_PROGRESS → COMPLIANT/NON_COMPLIANT/NEEDS_REVIEW
- **Auto-Tracking**: Submission timestamp recorded when marked compliant

##### 20. Delete Compliance Report
- **Method**: `DELETE`
- **Path**: `/api/v1/compliance/reports/{id}`
- **Description**: Delete compliance report
- **Tags**: `Compliance`, `Reports`, `v1`
- **Authorization**: Admin only
- **Path Parameters**:
  - `id` (uuid, required) - Report ID
- **Responses**:
  - `200` - Report deleted successfully
  - `400` - Cannot delete submitted report
  - `401` - Unauthorized
  - `403` - Forbidden (Admin only)
  - `404` - Report not found
- **Restriction**: Only draft reports or reports without submissions can be deleted
- **Best Practice**: Archive instead of delete to maintain audit trail

##### 21. Generate Automated Compliance Report
- **Method**: `POST`
- **Path**: `/api/v1/compliance/reports/generate`
- **Description**: Automatically generate compliance report by analyzing system data
- **Tags**: `Compliance`, `Reports`, `v1`
- **Authorization**: Compliance Officer only
- **Request Body**:
  - `reportType` (enum, required) - Type of report to generate
  - `period` (enum, required) - Reporting period
  - `startDate` (ISO 8601, optional) - Custom start date (overrides period)
  - `endDate` (ISO 8601, optional) - Custom end date (overrides period)
  - `includeRecommendations` (boolean, default: true) - Include automated recommendations
- **Responses**:
  - `201` - Compliance report generated successfully
  - `400` - Validation error
  - `401` - Unauthorized
  - `403` - Forbidden
- **Data Collected**: Audit logs, PHI access patterns, security events, policy acknowledgments, consent records
- **Automated Findings**: Based on compliance rules and thresholds

#### Compliance Checklist Management

##### 22. List Compliance Checklists
- **Method**: `GET`
- **Path**: `/api/v1/compliance/checklists`
- **Description**: List compliance checklist items
- **Tags**: `Compliance`, `Checklists`, `v1`
- **Query Parameters**:
  - `reportId` (uuid, optional) - Filter by report ID
  - `category` (string, optional) - Filter by category
  - `status` (enum, optional) - Filter by status (PENDING, IN_PROGRESS, COMPLETED, NOT_APPLICABLE, FAILED)
  - `page`, `limit` - Pagination parameters
- **Responses**:
  - `200` - Checklists retrieved successfully
  - `401` - Unauthorized

##### 23. Get Checklist by ID
- **Method**: `GET`
- **Path**: `/api/v1/compliance/checklists/{id}`
- **Description**: Get detailed checklist item
- **Tags**: `Compliance`, `Checklists`, `v1`
- **Path Parameters**:
  - `id` (uuid, required) - Checklist item ID
- **Responses**:
  - `200` - Checklist item retrieved successfully
  - `401` - Unauthorized
  - `404` - Checklist item not found
- **Returns**: Requirement description, category, status, evidence of compliance, completion details, due date

##### 24. Create Compliance Checklist
- **Method**: `POST`
- **Path**: `/api/v1/compliance/checklists`
- **Description**: Create new compliance checklist item
- **Tags**: `Compliance`, `Checklists`, `v1`
- **Authorization**: Compliance Officer only
- **Request Body**:
  - `requirement` (string, 5-500 chars, required) - Compliance requirement description
  - `description` (string, max 2000 chars, optional) - Detailed description
  - `category` (string, required) - Requirement category (e.g., HIPAA_PRIVACY, HIPAA_SECURITY, FERPA)
  - `dueDate` (ISO 8601, optional) - Requirement due date
  - `reportId` (uuid, optional) - Associated compliance report ID
- **Responses**:
  - `201` - Checklist item created successfully
  - `400` - Validation error
  - `401` - Unauthorized
  - `403` - Forbidden
- **Initial Status**: Automatically set to PENDING

##### 25. Update Compliance Checklist
- **Method**: `PUT`
- **Path**: `/api/v1/compliance/checklists/{id}`
- **Description**: Update checklist item status, evidence, or notes
- **Tags**: `Compliance`, `Checklists`, `v1`
- **Path Parameters**:
  - `id` (uuid, required) - Checklist item ID
- **Request Body**:
  - `status` (enum, optional) - Update status
  - `evidence` (string, optional) - Evidence of compliance
  - `notes` (string, optional) - Notes
  - `completedBy` (uuid, optional) - User who completed
- **Responses**:
  - `200` - Checklist item updated successfully
  - `400` - Validation error
  - `401` - Unauthorized
  - `404` - Checklist item not found
- **Status Workflow**: PENDING → IN_PROGRESS → COMPLETED/NOT_APPLICABLE/FAILED
- **Auto-Tracking**: Completion timestamp recorded when marked COMPLETED

##### 26. Delete Checklist Item
- **Method**: `DELETE`
- **Path**: `/api/v1/compliance/checklists/{id}`
- **Description**: Delete compliance checklist item
- **Tags**: `Compliance`, `Checklists`, `v1`
- **Authorization**: Compliance Officer, Admin
- **Path Parameters**:
  - `id` (uuid, required) - Checklist item ID
- **Responses**:
  - `200` - Checklist item deleted successfully
  - `400` - Cannot delete completed item
  - `401` - Unauthorized
  - `403` - Forbidden
  - `404` - Checklist item not found
- **Restriction**: Only PENDING or NOT_APPLICABLE items can be deleted
- **Best Practice**: Maintain completed items for audit trail

#### Policy Management

##### 27. List Policy Documents
- **Method**: `GET`
- **Path**: `/api/v1/compliance/policies`
- **Description**: List policy documents
- **Tags**: `Compliance`, `Policies`, `v1`
- **Query Parameters**:
  - `category` (enum, optional) - Filter by category (HIPAA_PRIVACY, HIPAA_SECURITY, FERPA, DATA_RETENTION, INCIDENT_RESPONSE, ACCESS_CONTROL, TRAINING)
  - `status` (enum, optional) - Filter by status (DRAFT, ACTIVE, ARCHIVED, SUPERSEDED)
- **Responses**:
  - `200` - Policies retrieved successfully
  - `401` - Unauthorized

##### 28. Get Policy by ID
- **Method**: `GET`
- **Path**: `/api/v1/compliance/policies/{policyId}`
- **Description**: Get detailed policy document
- **Tags**: `Compliance`, `Policies`, `v1`
- **Path Parameters**:
  - `policyId` (uuid, required) - Policy ID
- **Responses**:
  - `200` - Policy retrieved successfully
  - `401` - Unauthorized
  - `404` - Policy not found
- **Returns**: Title, category, content, version, status, effective date, review date, approval details, acknowledgment history

##### 29. Create Policy Document
- **Method**: `POST`
- **Path**: `/api/v1/compliance/policies`
- **Description**: Create new policy document
- **Tags**: `Compliance`, `Policies`, `v1`
- **Authorization**: Compliance Officer, Admin
- **Request Body**:
  - `title` (string, 5-200 chars, required) - Policy title
  - `category` (enum, required) - Policy category
  - `content` (string, min 100 chars, required) - Policy content (minimum for legal validity)
  - `version` (string, required) - Version number (e.g., "1.0")
  - `effectiveDate` (ISO 8601, required) - Effective date
  - `reviewDate` (ISO 8601, optional) - Next review date
- **Responses**:
  - `201` - Policy created successfully
  - `400` - Validation error (content too short, invalid version format)
  - `401` - Unauthorized
  - `403` - Forbidden
- **Initial Status**: Automatically set to DRAFT
- **Version Control**: Supports policy lifecycle management

##### 30. Update Policy Document
- **Method**: `PUT`
- **Path**: `/api/v1/compliance/policies/{policyId}`
- **Description**: Update policy status or approval details
- **Tags**: `Compliance`, `Policies`, `v1`
- **Authorization**: Admin only
- **Path Parameters**:
  - `policyId` (uuid, required) - Policy ID
- **Request Body**:
  - `status` (enum, optional) - Update status
  - `approvedBy` (uuid, optional) - Approver user ID
  - `approvalNotes` (string, optional) - Approval notes
- **Responses**:
  - `200` - Policy updated successfully
  - `400` - Invalid status transition or missing approval
  - `401` - Unauthorized
  - `403` - Forbidden (Admin only)
  - `404` - Policy not found
- **Status Workflow**: DRAFT → ACTIVE (requires approval) → ARCHIVED/SUPERSEDED
- **Restriction**: Cannot reactivate archived/superseded policies - create new version instead
- **Auto-Tracking**: Approval timestamp recorded when activated

##### 31. Acknowledge Policy
- **Method**: `POST`
- **Path**: `/api/v1/compliance/policies/{policyId}/acknowledge`
- **Description**: Record staff acknowledgment of policy
- **Tags**: `Compliance`, `Policies`, `Training`, `v1`
- **Path Parameters**:
  - `policyId` (uuid, required) - Policy ID
- **Responses**:
  - `201` - Policy acknowledged successfully
  - `400` - Policy not active or already acknowledged
  - `401` - Unauthorized
  - `404` - Policy not found
- **HIPAA/FERPA Compliance**: Required for training compliance
- **Restriction**: Only ACTIVE policies can be acknowledged
- **Audit Trail**: Records user, timestamp, and IP address
- **Duplicate Prevention**: Prevents duplicate acknowledgments

#### Consent Management

##### 32. List Consent Forms
- **Method**: `GET`
- **Path**: `/api/v1/compliance/consents/forms`
- **Description**: List consent form templates
- **Tags**: `Compliance`, `Consents`, `v1`
- **Query Parameters**:
  - `active` (boolean, optional) - Filter by active status
- **Responses**:
  - `200` - Consent forms retrieved successfully
  - `401` - Unauthorized
- **Consent Types**:
  - **HIPAA_AUTHORIZATION**: PHI release
  - **FERPA_RELEASE**: Education records
  - **PHOTO_RELEASE**: Photography/media
  - **MEDICAL_TREATMENT**: Treatment authorization
  - **RESEARCH**: Research participation
  - **EMERGENCY_CONTACT**: Emergency contact information

##### 33. Get Consent Form by ID
- **Method**: `GET`
- **Path**: `/api/v1/compliance/consents/forms/{id}`
- **Description**: Get detailed consent form
- **Tags**: `Compliance`, `Consents`, `v1`
- **Path Parameters**:
  - `id` (uuid, required) - Consent form ID
- **Responses**:
  - `200` - Consent form retrieved successfully
  - `401` - Unauthorized
  - `404` - Consent form not found
- **Returns**: Type, title, description, full content, version, active status, expiration date, recent signatures

##### 34. Create Consent Form
- **Method**: `POST`
- **Path**: `/api/v1/compliance/consents/forms`
- **Description**: Create new consent form template
- **Tags**: `Compliance`, `Consents`, `v1`
- **Authorization**: Admin only
- **Request Body**:
  - `type` (enum, required) - Consent type
  - `title` (string, 5-200 chars, required) - Form title
  - `description` (string, optional) - Form description
  - `content` (string, min 50 chars, required) - Form content (minimum for legal validity)
  - `version` (string, required) - Version number (e.g., "1.0")
  - `expirationDate` (ISO 8601, optional) - Expiration date for time-limited consents
- **Responses**:
  - `201` - Consent form created successfully
  - `400` - Validation error (content too short, invalid version)
  - `401` - Unauthorized
  - `403` - Forbidden (Admin only)
- **Initial Status**: Automatically set to active
- **Version Control**: Supports consent tracking

##### 35. Record Consent Signature
- **Method**: `POST`
- **Path**: `/api/v1/compliance/consents`
- **Description**: Record digital consent signature
- **Tags**: `Compliance`, `Consents`, `v1`
- **Request Body**:
  - `formId` (uuid, required) - Consent form ID
  - `studentId` (uuid, required) - Student ID
  - `signatoryName` (string, 2-100 chars, required) - Name of person signing
  - `relationship` (enum, required) - Relationship to student (Mother, Father, Parent, Legal Guardian, etc.)
  - `digitalSignature` (string, optional) - Base64-encoded signature image
  - `ipAddress` (IP address, optional) - IP address (auto-captured if not provided)
- **Responses**:
  - `201` - Consent recorded successfully
  - `400` - Validation error (form inactive/expired, already signed)
  - `401` - Unauthorized
  - `404` - Consent form or student not found
- **Legal Compliance**: Records signatory, relationship, signature, IP address, timestamp for legal validity
- **Validation**: Form must be active and not expired
- **Duplicate Prevention**: Prevents duplicate signatures
- **Audit Trail**: Complete audit trail maintained

##### 36. Get Student Consents
- **Method**: `GET`
- **Path**: `/api/v1/compliance/consents/student/{studentId}`
- **Description**: Get all consent signatures for a student
- **Tags**: `Compliance`, `Consents`, `Students`, `v1`
- **Path Parameters**:
  - `studentId` (uuid, required) - Student ID
- **Responses**:
  - `200` - Student consents retrieved successfully
  - `401` - Unauthorized
  - `404` - Student not found
- **Returns**: Consent form details, signatory information, signature date, withdrawal status, digital signature data

##### 37. Withdraw Consent
- **Method**: `PUT`
- **Path**: `/api/v1/compliance/consents/{signatureId}/withdraw`
- **Description**: Withdraw previously given consent
- **Tags**: `Compliance`, `Consents`, `v1`
- **Path Parameters**:
  - `signatureId` (uuid, required) - Consent signature ID
- **Responses**:
  - `200` - Consent withdrawn successfully
  - `400` - Consent already withdrawn
  - `401` - Unauthorized
  - `404` - Consent signature not found
- **Legal Compliance**: Records withdrawal timestamp and user for complete audit trail
- **Preservation**: Consent signature preserved for legal record
- **Duplicate Prevention**: Prevents duplicate withdrawal
- **System Impact**: System must respect withdrawal immediately

#### Compliance Statistics

##### 38. Get Compliance Statistics
- **Method**: `GET`
- **Path**: `/api/v1/compliance/statistics`
- **Description**: Get comprehensive compliance metrics
- **Tags**: `Compliance`, `Statistics`, `v1`
- **Query Parameters**:
  - `period` (enum, optional) - Period (DAILY, WEEKLY, MONTHLY, QUARTERLY, ANNUAL)
  - `startDate` (ISO 8601, optional) - Custom start date
  - `endDate` (ISO 8601, optional) - Custom end date
- **Responses**:
  - `200` - Compliance statistics retrieved successfully
  - `400` - Validation error (invalid date range for custom period)
  - `401` - Unauthorized
- **Metrics Included**:
  - Report statistics (total, compliant, non-compliant, pending)
  - Compliance rate
  - Policy statistics (active, acknowledged)
  - Consent statistics (active, withdrawn)
  - Checklist completion rate

---

## System Module

The System module provides authentication, configuration management, integrations, and administrative functionality.

### Authentication Routes

**Base Path**: `/v1/system/auth` and `/v1/system/admin`
**Total Endpoints**: 5
**Authentication**: JWT required for all endpoints
**File**: `backend/src/routes/v1/system/routes/authentication.routes.ts`

#### Multi-Factor Authentication (MFA)

##### 39. Setup MFA
- **Method**: `POST`
- **Path**: `/v1/system/auth/mfa/setup`
- **Description**: Initialize multi-factor authentication for user
- **Tags**: `system`, `authentication`, `mfa`, `v1`
- **Request Body**:
  - `method` (enum, required) - MFA method (TOTP, SMS, EMAIL)
  - `phoneNumber` (string, optional) - Phone number for SMS (required if method is SMS)
  - `email` (string, optional) - Email for email MFA (required if method is EMAIL)
- **Responses**:
  - `200` - MFA setup successful
  - `400` - Invalid MFA setup data
  - `401` - Authentication required
  - `409` - MFA already configured
  - `500` - Server error during MFA setup
- **Security**: JWT authentication required
- **Methods**: TOTP (Time-based One-Time Password), SMS, Email

##### 40. Verify MFA Code
- **Method**: `POST`
- **Path**: `/v1/system/auth/mfa/verify`
- **Description**: Validate MFA authentication code
- **Tags**: `system`, `authentication`, `mfa`, `v1`
- **Request Body**:
  - `code` (string, required) - MFA code to verify
  - `backupCode` (string, optional) - Backup code if TOTP unavailable
- **Responses**:
  - `200` - MFA verification successful
  - `400` - Invalid MFA code
  - `401` - Authentication required
  - `403` - MFA verification failed
  - `500` - Server error during MFA verification
- **Security**: JWT authentication required
- **Code Types**: TOTP codes, SMS codes, Email codes, Backup codes

#### System Monitoring

##### 41. Get System Health Status
- **Method**: `GET`
- **Path**: `/v1/system/admin/health`
- **Description**: Get comprehensive system health status
- **Tags**: `system`, `monitoring`, `health`, `v1`
- **Authorization**: Admin access required
- **Query Parameters**:
  - `detailed` (boolean, optional, default: false) - Include detailed metrics
- **Responses**:
  - `200` - System health retrieved successfully
  - `401` - Authentication required
  - `403` - Admin access required
  - `500` - Server error retrieving system health
- **Returns**: Database connectivity, service status, memory usage, performance metrics

##### 42. Get Feature Integration Status
- **Method**: `GET`
- **Path**: `/v1/system/admin/features/status`
- **Description**: Get status of all integrated system features
- **Tags**: `system`, `monitoring`, `features`, `v1`
- **Authorization**: Admin access required
- **Query Parameters**:
  - `module` (enum, optional) - Filter by module (healthcare, operations, analytics, communication)
- **Responses**:
  - `200` - Feature status retrieved successfully
  - `401` - Authentication required
  - `403` - Admin access required
  - `500` - Server error retrieving feature status
- **Returns**: Availability and health status of healthcare, operations, analytics, and communication modules

##### 43. Generate Feature Integration Report
- **Method**: `GET`
- **Path**: `/v1/system/admin/features/report`
- **Description**: Generate comprehensive feature integration report
- **Tags**: `system`, `monitoring`, `reporting`, `v1`
- **Authorization**: Admin access required
- **Responses**:
  - `200` - Feature report generated successfully
  - `401` - Authentication required
  - `403` - Admin access required
  - `500` - Server error generating report
- **Returns**: Detailed report of all system features, usage statistics, and integration health

---

### Configuration Routes

**Base Path**: `/api/v1/system`
**Total Endpoints**: 7
**Authentication**: JWT required for all endpoints
**Authorization**: Admin or District Admin roles required
**File**: `backend/src/routes/v1/system/routes/configuration.routes.ts`

#### System Configuration

##### 44. Get System Configuration
- **Method**: `GET`
- **Path**: `/api/v1/system/config`
- **Description**: Get current system configuration settings
- **Tags**: `System`, `Configuration`, `v1`
- **Authorization**: Admin only
- **Responses**:
  - `200` - System configuration retrieved successfully
  - `401` - Unauthorized
  - `403` - Forbidden (Admin role required)
- **Returns**: SMTP settings, security settings, performance settings, integration settings
- **Security**: All sensitive credentials are masked

##### 45. Update System Configuration
- **Method**: `PUT`
- **Path**: `/api/v1/system/config`
- **Description**: Update system-wide configuration settings
- **Tags**: `System`, `Configuration`, `v1`
- **Authorization**: Admin only
- **Request Body**:
  - `category` (enum, required) - Setting category (GENERAL, SECURITY, NOTIFICATION, INTEGRATION, BACKUP, PERFORMANCE)
  - `settings` (object, required) - Settings object with key-value pairs
  - `requireRestart` (boolean, optional) - Whether changes require system restart
- **Responses**:
  - `200` - System configuration updated successfully
  - `400` - Validation error
  - `401` - Unauthorized
  - `403` - Forbidden (Admin role required)
- **Warning**: Changes may require system restart depending on setting type
- **Audit Trail**: All updates are logged
- **Caution**: Incorrect settings can affect system functionality

#### School Management

##### 46. List Schools
- **Method**: `GET`
- **Path**: `/api/v1/system/schools`
- **Description**: List schools in district
- **Tags**: `System`, `Schools`, `v1`
- **Authorization**: Admin, District Admin
- **Query Parameters**:
  - `districtId` (uuid, optional) - Filter by district ID
  - `search` (string, optional) - Search by name or code
  - `page`, `limit` - Pagination parameters
- **Responses**:
  - `200` - Schools retrieved successfully with pagination
  - `401` - Unauthorized
  - `403` - Forbidden (Admin or District Admin only)
- **Returns**: School settings, contact information, active status

##### 47. Get School by ID
- **Method**: `GET`
- **Path**: `/api/v1/system/schools/{schoolId}`
- **Description**: Get detailed school information
- **Tags**: `System`, `Schools`, `v1`
- **Path Parameters**:
  - `schoolId` (uuid, required) - School ID
- **Responses**:
  - `200` - School retrieved successfully
  - `401` - Unauthorized
  - `404` - School not found
- **Returns**: Name, code, address, contact details, settings, active status

##### 48. Update School Settings
- **Method**: `PUT`
- **Path**: `/api/v1/system/schools/{schoolId}`
- **Description**: Update school configuration
- **Tags**: `System`, `Schools`, `v1`
- **Authorization**: Admin, District Admin
- **Path Parameters**:
  - `schoolId` (uuid, required) - School ID
- **Request Body**:
  - `name` (string, 2-200 chars, optional) - School name
  - `code` (string, 2-50 chars, optional) - School code
  - `phone` (string, optional) - Phone number (validated)
  - `email` (string, optional) - Email (validated)
  - `address` (object, optional) - School address
  - `settings` (object, optional) - School-specific settings
  - `active` (boolean, optional) - Active status
- **Responses**:
  - `200` - School updated successfully
  - `400` - Validation error (invalid phone/email format)
  - `401` - Unauthorized
  - `403` - Forbidden (Admin or District Admin only)
  - `404` - School not found
- **Validation**: Phone and email formats validated
- **Audit Trail**: All updates are logged

#### Feature Management

##### 49. Get Enabled Features
- **Method**: `GET`
- **Path**: `/api/v1/system/features`
- **Description**: Get current feature flag configuration
- **Tags**: `System`, `Features`, `v1`
- **Responses**:
  - `200` - Features retrieved successfully
  - `401` - Unauthorized
- **Features Include**:
  - **MEDICATION_MANAGEMENT**: Medication tracking
  - **INCIDENT_REPORTING**: Incident reports
  - **PARENT_PORTAL**: Parent access
  - **MOBILE_APP**: Mobile application
  - **ANALYTICS_DASHBOARD**: Advanced analytics
  - **INTEGRATION_SIS**: SIS integration
  - **AUTOMATED_NOTIFICATIONS**: Automated alerts

##### 50. Update Enabled Features
- **Method**: `PUT`
- **Path**: `/api/v1/system/features`
- **Description**: Enable or disable system features
- **Tags**: `System`, `Features`, `v1`
- **Authorization**: Admin only
- **Request Body**:
  - Object with feature flags as boolean values (e.g., `{ "MEDICATION_MANAGEMENT": true, "PARENT_PORTAL": false }`)
- **Responses**:
  - `200` - Features updated successfully
  - `400` - Validation error
  - `401` - Unauthorized
  - `403` - Forbidden (Admin role required)
- **Impact**: Feature flags control availability of major platform modules
- **Licensing**: Enabling features may require additional licensing
- **Data Preservation**: Disabling features hides functionality but preserves existing data
- **Immediate Effect**: Changes take effect immediately
- **Dependencies**: Features may have dependencies - use with caution

---

### Integrations Routes

**Base Path**: `/api/v1/system`
**Total Endpoints**: 11
**Authentication**: JWT required for all endpoints
**Authorization**: Admin role required for most endpoints
**File**: `backend/src/routes/v1/system/routes/integrations.routes.ts`

#### Integration Management

##### 51. List Configured Integrations
- **Method**: `GET`
- **Path**: `/api/v1/system/integrations`
- **Description**: List all configured integrations
- **Tags**: `System`, `Integrations`, `v1`
- **Authorization**: Admin only
- **Query Parameters**:
  - `type` (enum, optional) - Filter by integration type
  - `status` (enum, optional) - Filter by status (ACTIVE, INACTIVE, ERROR, PENDING)
  - `page`, `limit` - Pagination parameters
- **Responses**:
  - `200` - Integrations retrieved successfully with pagination
  - `401` - Unauthorized
  - `403` - Forbidden (Admin role required)
- **Integration Types**:
  - **SIS**: Student Information System
  - **EMAIL**: SMTP/SendGrid
  - **SMS**: Twilio
  - **STORAGE**: AWS S3/Azure
  - **AUTHENTICATION**: SAML/OAuth/LDAP
  - **EHR**: Electronic Health Records
  - **PHARMACY**: Pharmacy systems
  - **LABORATORY**: Laboratory systems
  - **INSURANCE**: Insurance systems
- **Status Values**:
  - **ACTIVE**: Connected and operational
  - **INACTIVE**: Configured but disabled
  - **ERROR**: Connection issues
  - **PENDING**: Not yet configured
- **Security**: Credentials are masked

##### 52. Get Integration Details
- **Method**: `GET`
- **Path**: `/api/v1/system/integrations/{id}`
- **Description**: Get detailed integration configuration
- **Tags**: `System`, `Integrations`, `v1`
- **Authorization**: Admin only
- **Path Parameters**:
  - `id` (uuid, required) - Integration ID
- **Responses**:
  - `200` - Integration retrieved successfully
  - `401` - Unauthorized
  - `403` - Forbidden (Admin role required)
  - `404` - Integration not found
- **Returns**: Name, type, endpoint, status, settings, sync frequency, recent activity logs (last 5 entries)
- **Security**: Sensitive credentials (API keys, passwords) are masked
- **Use Case**: Integration configuration review and monitoring

##### 53. Add New Integration
- **Method**: `POST`
- **Path**: `/api/v1/system/integrations`
- **Description**: Create new integration configuration
- **Tags**: `System`, `Integrations`, `v1`
- **Authorization**: Admin only
- **Request Body**:
  - `name` (string, 2-100 chars, required) - Integration name
  - `type` (enum, required) - Integration type
  - `endpoint` (URL, required) - Integration endpoint URL
  - `authMethod` (enum, required) - Authentication method (OAUTH, BASIC_AUTH, API_KEY)
  - `credentials` (object, required) - Credentials object:
    - For OAuth: `clientId`, `clientSecret`, `tokenEndpoint`
    - For Basic Auth: `username`, `password`
    - For API Key: `apiKey`, `apiKeyHeader`
  - `settings` (object, optional) - Integration-specific settings
  - `syncFrequency` (number, optional, default: 0) - Sync interval in minutes (0 = manual only)
- **Responses**:
  - `201` - Integration created successfully
  - `400` - Validation error (invalid endpoint URL)
  - `401` - Unauthorized
  - `403` - Forbidden (Admin role required)
  - `409` - Conflict (integration with this name already exists)
- **Validation**: Endpoint URLs validated
- **Security**: Credentials encrypted before storage
- **Initial Status**: Set to INACTIVE for safety
- **Next Step**: Test integration before activation

##### 54. Update Integration Configuration
- **Method**: `PUT`
- **Path**: `/api/v1/system/integrations/{id}`
- **Description**: Update integration configuration
- **Tags**: `System`, `Integrations`, `v1`
- **Authorization**: Admin only
- **Path Parameters**:
  - `id` (uuid, required) - Integration ID
- **Request Body**:
  - `name` (string, optional) - Update name
  - `endpoint` (URL, optional) - Update endpoint
  - `credentials` (object, optional) - Update credentials
  - `settings` (object, optional) - Update settings
  - `syncFrequency` (number, optional) - Update sync interval (0 = manual only, >0 = automatic)
  - `status` (enum, optional) - Update status
- **Responses**:
  - `200` - Integration updated successfully
  - `400` - Validation error (invalid endpoint URL)
  - `401` - Unauthorized
  - `403` - Forbidden (Admin role required)
  - `404` - Integration not found
- **Validation**: Endpoint URLs validated if changed
- **Security**: Credentials re-encrypted if updated
- **Connection Test**: Re-tested if credentials or endpoint changed
- **Status Workflow**: PENDING → INACTIVE → ACTIVE or ERROR
- **Audit Trail**: All configuration changes are logged

##### 55. Remove Integration
- **Method**: `DELETE`
- **Path**: `/api/v1/system/integrations/{id}`
- **Description**: Delete integration configuration and associated logs
- **Tags**: `System`, `Integrations`, `v1`
- **Authorization**: Admin only
- **Path Parameters**:
  - `id` (uuid, required) - Integration ID
- **Responses**:
  - `200` - Integration deleted successfully
  - `400` - Cannot delete active integration (deactivate first)
  - `401` - Unauthorized
  - `403` - Forbidden (Admin role required)
  - `404` - Integration not found
- **WARNING**: This action cannot be undone
- **Restriction**: Active integrations must be deactivated before deletion
- **Impact**: Scheduled syncs will be cancelled, historical sync logs removed
- **Best Practice**: Consider deactivating instead of deleting to preserve audit trail

##### 56. Test Integration Connection
- **Method**: `POST`
- **Path**: `/api/v1/system/integrations/{id}/test`
- **Description**: Test integration connectivity and authentication
- **Tags**: `System`, `Integrations`, `v1`
- **Authorization**: Admin only
- **Path Parameters**:
  - `id` (uuid, required) - Integration ID
- **Responses**:
  - `200` - Connection test completed (check success field for result)
  - `401` - Unauthorized
  - `403` - Forbidden (Admin role required)
  - `404` - Integration not found
- **Validation**: Validates credentials without modifying data
- **Returns**: Response time, connection status, integration-specific details (API version, record counts, etc.)
- **Status Update**: Temporarily sets status to TESTING during test, then ACTIVE on success or ERROR on failure
- **Logging**: Test results logged for troubleshooting
- **Required**: Before activating new integrations

#### Data Synchronization

##### 57. Sync Student Data from SIS
- **Method**: `POST`
- **Path**: `/api/v1/system/sync/students`
- **Description**: Pull student data from Student Information System
- **Tags**: `System`, `Sync`, `Students`, `v1`
- **Authorization**: Admin only
- **Request Body**:
  - `integrationId` (uuid, required) - SIS integration ID
  - `syncType` (enum, required) - Sync type (FULL, INCREMENTAL)
  - `gradeLevel` (string, optional) - Filter by grade level
  - `autoCreate` (boolean, optional, default: true) - Auto-create new student records
  - `conflictResolution` (enum, optional, default: 'SIS_WINS') - Conflict resolution strategy (SIS_WINS, LOCAL_WINS, MANUAL)
- **Responses**:
  - `201` - Student sync initiated successfully
  - `400` - Validation error (integration must be SIS type or not configured)
  - `401` - Unauthorized
  - `403` - Forbidden (Admin role required)
  - `404` - Integration not found
- **Sync Types**:
  - **FULL**: Imports all students
  - **INCREMENTAL**: Imports only changed records
- **Returns**: Sync session with statistics (processed, created, updated, skipped, failed)
- **Async Processing**: Sync runs asynchronously for large datasets
- **Monitoring**: Use sync status endpoint to monitor progress

##### 58. Get Sync Status
- **Method**: `GET`
- **Path**: `/api/v1/system/sync/status`
- **Description**: Get recent synchronization sessions with status and statistics
- **Tags**: `System`, `Sync`, `v1`
- **Query Parameters**:
  - `integrationId` (uuid, optional) - Filter by integration ID
  - `status` (enum, optional) - Filter by status (IDLE, IN_PROGRESS, COMPLETED, FAILED)
  - `page`, `limit` - Pagination parameters
- **Responses**:
  - `200` - Sync status retrieved successfully
  - `401` - Unauthorized
- **Sync Statuses**:
  - **IDLE**: No sync running
  - **IN_PROGRESS**: Currently syncing
  - **COMPLETED**: Last sync successful
  - **FAILED**: Last sync failed
- **Returns**: Session details including start time, completion time, records processed, success/failure counts, error messages
- **Use Case**: Monitoring active syncs and reviewing sync history

##### 59. Get Sync Logs
- **Method**: `GET`
- **Path**: `/api/v1/system/sync/logs`
- **Description**: Get paginated integration operation logs
- **Tags**: `System`, `Sync`, `Logs`, `v1`
- **Authorization**: Admin only
- **Query Parameters**:
  - `integrationId` (uuid, optional) - Filter by integration ID
  - `status` (enum, optional) - Filter by status (success, failed)
  - `action` (string, optional) - Filter by action type
  - `startDate` (ISO 8601, optional) - Filter start date
  - `endDate` (ISO 8601, optional) - Filter end date
  - `page`, `limit` - Pagination parameters
- **Responses**:
  - `200` - Sync logs retrieved successfully with pagination
  - `401` - Unauthorized
  - `403` - Forbidden (Admin role required)
- **Log Types**: Sync operations, connection tests, configuration changes, errors, warnings
- **Log Details**: Timestamp, action, status, duration, records processed, error details
- **Compliance**: Required for HIPAA compliance auditing and operational monitoring

#### Utility Operations

##### 60. Trigger Grade Transition
- **Method**: `POST`
- **Path**: `/api/v1/system/grade-transition`
- **Description**: Perform end-of-year grade transition for all active students
- **Tags**: `System`, `Utilities`, `v1`
- **Authorization**: Admin only
- **Request Body**:
  - `dryRun` (boolean, optional, default: false) - Preview changes without committing
  - `gradeFilter` (array of strings, optional) - Filter by specific grades
  - `promotionDate` (ISO 8601, optional, default: today) - Effective date of promotion
- **Responses**:
  - `200` - Grade transition completed successfully
  - `400` - Validation error
  - `401` - Unauthorized
  - `403` - Forbidden (Admin role required)
- **Progression Rules**: K→1, 1→2, ..., 11→12, 12→Graduate
- **Dry Run**: Preview changes without committing (recommended first step)
- **Returns**: Detailed results for each student (old grade, new grade, success status, errors)
- **Audit Trail**: Creates audit trail entries
- **Best Practice**: Use dryRun first to verify expected results

##### 61. Get System Health Status
- **Method**: `GET`
- **Path**: `/api/v1/system/health`
- **Description**: Get comprehensive system health metrics
- **Tags**: `System`, `Utilities`, `v1`
- **Responses**:
  - `200` - System health retrieved successfully
  - `401` - Unauthorized
- **Returns**:
  - Database status (connected, response time)
  - Cache status (connected, hit rate)
  - Integration health (total, active, error, inactive counts)
  - Server uptime
  - Memory usage (used, total, percentage)
  - Timestamp
- **Use Case**: System monitoring dashboard, alerting, operational visibility

---

## Security & Authorization

### Authentication
- **All endpoints require JWT authentication** unless explicitly stated otherwise
- JWT tokens must be included in the `Authorization` header: `Bearer <token>`
- Invalid or expired tokens will result in `401 Unauthorized` responses

### Authorization Levels

#### Admin Role
- **Full system access** including all configuration, compliance, and audit endpoints
- Required for:
  - System configuration management
  - Feature flag management
  - Integration management
  - Audit log archiving
  - School settings updates
  - Policy approval
  - Consent form creation
  - Grade transitions
  - System health monitoring

#### Compliance Officer Role
- **Compliance and audit access** for regulatory management
- Required for:
  - Viewing and creating compliance reports
  - Managing compliance checklists
  - Policy management
  - Generating compliance reports
  - Accessing audit logs and PHI access logs
  - Running security analysis

#### District Admin Role
- **District-level administrative access**
- Required for:
  - Viewing and managing schools across district
  - District-wide reporting

#### Security Officer Role
- **Security monitoring and analysis access**
- Required for:
  - Security analysis endpoints
  - Anomaly detection
  - Threat monitoring

### Role Combinations
Some endpoints accept multiple roles (e.g., "Admin OR Compliance Officer"). Users with any of the specified roles can access these endpoints.

### IP Address Logging
Many compliance and audit endpoints automatically capture and log the client's IP address for security and compliance purposes.

---

## Compliance Requirements

### HIPAA Compliance

#### Critical HIPAA Endpoints
The following endpoints are flagged as **CRITICAL HIPAA ENDPOINTS** and are essential for HIPAA compliance:

1. **Audit Logs** (`/api/v1/audit/logs`) - Required by 45 CFR § 164.308(a)(1)(ii)(D) and 45 CFR § 164.312(b)
2. **PHI Access Logs** (`/api/v1/audit/phi-access`) - Required by 45 CFR § 164.308(a)(1)(ii)(D)
3. **Compliance Reports** - Required for periodic HIPAA compliance reviews
4. **Data Access History** - Required for PHI disclosure accounting

#### HIPAA Security Rule References
- **45 CFR § 164.308(a)(1)(ii)(D)**: Information System Activity Review - Requires audit controls
- **45 CFR § 164.312(b)**: Audit Controls - Requires mechanisms to record and examine activity

#### Data Retention
- **Minimum Retention**: 6 years per HIPAA requirements
- **Archive Endpoint**: Cannot archive logs newer than 90 days
- **Audit Trail**: All compliance-related actions are logged

#### PHI Access Tracking
All access to Protected Health Information (PHI) must be logged including:
- User accessing the data
- Student whose data is accessed
- Type of access (VIEW, EDIT, EXPORT, PRINT, DELETE)
- Data category accessed
- Timestamp and IP address
- Success/failure status

### FERPA Compliance

#### Education Records
The Compliance module supports FERPA (Family Educational Rights and Privacy Act) compliance for education records:
- **Consent Management**: Parent/guardian consent for information release
- **Access Tracking**: Who accessed student education records
- **Policy Management**: FERPA policy documentation and acknowledgment

#### FERPA Report Types
- Compliance reports can be generated specifically for FERPA compliance
- Tracks consent for release of education records
- Maintains audit trail of education record access

### Policy Acknowledgment
Staff must acknowledge HIPAA, FERPA, and other privacy policies:
- **Training Compliance**: Required for HIPAA/FERPA training
- **Audit Trail**: Records user, timestamp, and IP address
- **Duplicate Prevention**: Prevents multiple acknowledgments

### Consent Management
Legal consent tracking for:
- **HIPAA Authorization**: PHI release consent
- **FERPA Release**: Education records consent
- **Digital Signatures**: Legally valid with IP address and timestamp
- **Withdrawal**: Consent can be withdrawn with complete audit trail

---

## Validation Schemas

All request bodies and query parameters are validated using Joi schemas. Below are key validation patterns:

### Common Validation Patterns

#### UUID Validation
```javascript
Joi.string().uuid() // Valid UUID v4 format required
```

#### Date Validation
```javascript
Joi.date().iso() // ISO 8601 format (e.g., "2025-10-23T10:00:00Z")
Joi.date().iso().min('now') // Must be in the future
```

#### Pagination
```javascript
{
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
}
```

#### IP Address
```javascript
Joi.string().ip() // IPv4 or IPv6
```

#### Email
```javascript
Joi.string().email() // Valid email format
```

#### Phone
```javascript
Joi.string().pattern(/^[+]?[0-9\s\-\(\)]+$/) // Phone number with international support
```

### Audit Validation Schemas

#### Action Types
```javascript
Joi.string().valid('CREATE', 'READ', 'VIEW', 'ACCESS', 'UPDATE', 'DELETE',
  'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT', 'BACKUP', 'RESTORE', 'SECURITY_EVENT')
```

#### PHI Access Types
```javascript
Joi.string().valid('VIEW', 'EDIT', 'EXPORT', 'PRINT', 'DELETE')
```

#### PHI Data Categories
```javascript
Joi.string().valid('HEALTH_RECORD', 'MEDICATION', 'ALLERGY',
  'CHRONIC_CONDITION', 'VACCINATION', 'MENTAL_HEALTH',
  'EMERGENCY_CONTACT', 'FULL_PROFILE')
```

### Compliance Validation Schemas

#### Report Types
```javascript
Joi.string().valid('HIPAA', 'FERPA', 'PRIVACY', 'SECURITY',
  'BREACH', 'RISK_ASSESSMENT', 'TRAINING', 'AUDIT', 'GENERAL')
```

#### Report Status
```javascript
Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLIANT',
  'NON_COMPLIANT', 'NEEDS_REVIEW')
```

#### Reporting Period
```javascript
Joi.string().valid('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUAL')
```

#### Checklist Status
```javascript
Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED',
  'NOT_APPLICABLE', 'FAILED')
```

#### Policy Categories
```javascript
Joi.string().valid('HIPAA_PRIVACY', 'HIPAA_SECURITY', 'FERPA',
  'DATA_RETENTION', 'INCIDENT_RESPONSE', 'ACCESS_CONTROL', 'TRAINING')
```

#### Policy Status
```javascript
Joi.string().valid('DRAFT', 'ACTIVE', 'ARCHIVED', 'SUPERSEDED')
```

#### Consent Types
```javascript
Joi.string().valid('HIPAA_AUTHORIZATION', 'FERPA_RELEASE',
  'PHOTO_RELEASE', 'MEDICAL_TREATMENT', 'RESEARCH', 'EMERGENCY_CONTACT')
```

#### Relationship Types
```javascript
Joi.string().valid('Mother', 'Father', 'Parent', 'Legal Guardian',
  'Step-Parent', 'Grandparent', 'Other')
```

### System Validation Schemas

#### Configuration Categories
```javascript
Joi.string().valid('GENERAL', 'SECURITY', 'NOTIFICATION',
  'INTEGRATION', 'BACKUP', 'PERFORMANCE')
```

#### Integration Types
```javascript
Joi.string().valid('SIS', 'EMAIL', 'SMS', 'STORAGE',
  'AUTHENTICATION', 'EHR', 'PHARMACY', 'LABORATORY', 'INSURANCE')
```

#### Integration Status
```javascript
Joi.string().valid('ACTIVE', 'INACTIVE', 'ERROR', 'PENDING')
```

#### Authentication Methods
```javascript
Joi.string().valid('OAUTH', 'BASIC_AUTH', 'API_KEY')
```

#### MFA Methods
```javascript
Joi.string().valid('TOTP', 'SMS', 'EMAIL')
```

#### Sync Types
```javascript
Joi.string().valid('FULL', 'INCREMENTAL')
```

#### Conflict Resolution
```javascript
Joi.string().valid('SIS_WINS', 'LOCAL_WINS', 'MANUAL')
```

### String Length Constraints

#### Common Constraints
- **Titles**: 5-200 characters
- **Descriptions**: Max 2000 characters
- **Names**: 2-100 characters
- **Codes**: 2-50 characters
- **User Agent**: Max 500 characters
- **Error Messages**: Max 1000 characters
- **Policy/Consent Content**: Min 50-100 characters (legal validity)
- **Version Numbers**: Pattern matching (e.g., "1.0", "2.1.3")

---

## Response Formats

### Success Responses

#### List/Paginated Response
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

#### Single Resource Response
```json
{
  "data": {
    "id": "uuid",
    // ... resource fields
  }
}
```

#### Statistics Response
```json
{
  "statistics": {
    "total": 1000,
    "breakdown": { ... },
    "trends": [ ... ]
  },
  "period": {
    "startDate": "2025-10-01T00:00:00Z",
    "endDate": "2025-10-23T23:59:59Z"
  }
}
```

### Error Responses

#### Validation Error (400)
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "validation": {
    "source": "payload",
    "keys": ["fieldName"]
  }
}
```

#### Unauthorized (401)
```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Missing authentication"
}
```

#### Forbidden (403)
```json
{
  "statusCode": 403,
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

#### Not Found (404)
```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Resource not found"
}
```

#### Conflict (409)
```json
{
  "statusCode": 409,
  "error": "Conflict",
  "message": "Resource already exists"
}
```

---

## API Documentation Access

### Swagger UI
The API documentation is accessible through hapi-swagger, which automatically generates interactive Swagger UI documentation.

**Typical Access URL**: `http://your-domain/documentation`

### Documentation Features
- **Interactive API Explorer**: Test endpoints directly from the documentation
- **Request/Response Examples**: View example payloads and responses
- **Schema Definitions**: Browse all validation schemas
- **Authentication**: Configure JWT token for authenticated requests
- **Try It Out**: Execute API calls from the browser

---

## Summary of Endpoints by HTTP Method

### GET Endpoints (33)
- List/retrieve operations for audit logs, compliance reports, checklists, policies, consents, integrations, schools, features, system health

### POST Endpoints (20)
- Create operations for audit logs, PHI access logs, compliance reports, checklists, policies, consents, integrations
- Action operations for security analysis, sync students, test connections, grade transitions, MFA setup/verify

### PUT Endpoints (12)
- Update operations for compliance reports, checklists, policies, schools, integrations, features, system configuration
- Consent withdrawal

### DELETE Endpoints (3)
- Delete operations for compliance reports, checklists, integrations
- Archive audit logs

---

## Endpoint Count by Module

### Compliance Module (45 endpoints)
- **Audit Routes**: 17 endpoints
- **Compliance Routes**: 28 endpoints

### System Module (23 endpoints)
- **Authentication Routes**: 5 endpoints
- **Configuration Routes**: 7 endpoints
- **Integrations Routes**: 11 endpoints

**Total**: 68 endpoints

---

## Tags for Organization

API endpoints are organized using the following tags:

### Compliance Tags
- `Audit` - Audit trail and logging
- `PHI` - Protected Health Information tracking
- `Security` - Security analysis and monitoring
- `Compliance` - Compliance reports and management
- `Reports` - Reporting functionality
- `Checklists` - Compliance checklists
- `Policies` - Policy management
- `Consents` - Consent management
- `Training` - Training and acknowledgment
- `Statistics` - Statistical data
- `Export` - Export functionality
- `Archive` - Archive operations
- `Anomalies` - Anomaly detection
- `Sessions` - Session tracking
- `DataAccess` - Data access history

### System Tags
- `System` - System-wide operations
- `Configuration` - Configuration management
- `Schools` - School management
- `Features` - Feature flags
- `Integrations` - Third-party integrations
- `Sync` - Data synchronization
- `Logs` - Integration logs
- `Utilities` - Utility operations
- `authentication` - Authentication operations
- `mfa` - Multi-factor authentication
- `monitoring` - System monitoring
- `health` - Health status

### Version Tag
- `v1` - API version 1

---

## Additional Notes

### hapi-swagger Compatibility
All routes are configured for hapi-swagger with:
- Route-level documentation using `tags`, `description`, and `notes`
- Response documentation in `plugins['hapi-swagger'].responses`
- Validation schemas linked via `validate` option
- Security schemes defined for JWT authentication

### Auto-Capture Features
Several endpoints automatically capture metadata:
- **IP Address**: Captured from request for audit/compliance logging
- **Timestamp**: All records timestamped automatically
- **User Agent**: Browser information captured for security analysis

### Async Operations
Some operations run asynchronously for performance:
- **Student Sync**: Large dataset synchronization
- **Report Generation**: Complex compliance reports
- **Security Analysis**: Comprehensive log analysis

Use status/monitoring endpoints to track progress of async operations.

### Version Control
Policies and consent forms support version control:
- Version numbers required (e.g., "1.0", "2.1.3")
- Version history maintained
- Superseded versions archived

### Dry Run Support
Critical bulk operations support dry-run mode:
- **Grade Transition**: Preview changes without committing
- **Audit Archive**: Test archiving without actual deletion

Always use dry-run first to verify expected results.

---

**End of Documentation Summary**

For detailed implementation information, refer to:
- Route files in `backend/src/routes/v1/compliance/` and `backend/src/routes/v1/system/`
- Validator files in `backend/src/routes/v1/compliance/validators/` and `backend/src/routes/v1/system/validators/`
- Controller files in corresponding `controllers/` directories
