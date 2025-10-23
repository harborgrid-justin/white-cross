# Incident Reporting and Document Management Services - JSDoc Documentation Summary

## Overview
This document provides comprehensive JSDoc documentation standards that have been applied to the incident reporting and document management service files in the backend.

## Files Documented

### Incident Report Services (`backend/src/services/incidentReport/`)

#### 1. **coreService.ts** - Incident Report Core Service
**Purpose**: Central incident report management service providing CRUD operations, incident lifecycle management, and automated notification workflows for student safety incidents.

**Key JSDoc Additions**:
- **File-level**:
  ```typescript
  /**
   * @fileoverview Incident Report Core Service
   * @module services/incidentReport/coreService
   * @description Central incident report management service
   *
   * Key Features:
   * - Complete incident lifecycle management (create, read, update)
   * - Automated emergency notifications based on severity
   * - Student safety tracking and reporting
   *
   * @compliance State incident reporting requirements
   * @legal 7-year retention for all incident reports
   * @audit Complete incident workflow tracking with timestamps
   */
  ```

- **createIncidentReport Method**:
  ```typescript
  /**
   * @method createIncidentReport
   * @description Create incident report with automatic notification based on severity
   * @async
   * @param {CreateIncidentReportData} data - Incident details
   * @param {string} data.studentId - Student UUID
   * @param {string} data.type - Incident type (INJURY, ILLNESS, BEHAVIORAL, etc.)
   * @param {string} data.severity - Severity level (LOW, MEDIUM, HIGH, CRITICAL)
   * @returns {Promise<IncidentReport>} Created incident report with associations
   *
   * @business CRITICAL: Principal notification within 1 hour
   * @business HIGH: Parent notification within 2 hours
   * @business MEDIUM: Parent notification within 4 hours
   * @business LOW: Parent notification within same day
   * @legal 7-year retention requirement for all incident reports
   *
   * @example
   * const report = await IncidentCoreService.createIncidentReport({
   *   studentId: 'student-123',
   *   type: 'INJURY',
   *   severity: 'HIGH',
   *   description: 'Student fell during recess...',
   *   occurredAt: new Date(),
   *   location: 'Playground'
   * });
   */
  ```

#### 2. **followUpService.ts** - Follow-Up Action Service
**Purpose**: Manages follow-up actions for incident reports including action tracking, status updates, and deadline management.

**Key JSDoc Additions**:
- **File-level**:
  ```typescript
  /**
   * @fileoverview Follow-Up Action Service
   * @module services/incidentReport/followUpService
   * @description Manages follow-up actions for incident reports with priority tracking
   *
   * Key Features:
   * - Follow-up action creation and assignment
   * - Status tracking (PENDING, COMPLETED)
   * - Due date management and overdue alerts
   * - Priority-based action queuing
   *
   * @compliance Required follow-up documentation for incident reports
   * @business Follow-up actions ensure incident resolution
   * @audit Complete action tracking with completion timestamps
   */
  ```

- **addFollowUpAction Method**:
  ```typescript
  /**
   * @method addFollowUpAction
   * @description Add follow-up action to incident report with validation
   * @async
   * @param {string} incidentReportId - Incident report UUID
   * @param {CreateFollowUpActionData} data - Follow-up action details
   * @param {string} data.action - Action description
   * @param {Date} data.dueDate - Action due date
   * @param {string} data.priority - Priority (LOW, MEDIUM, HIGH, URGENT)
   * @param {string} data.assignedTo - Staff member UUID assigned to action
   * @returns {Promise<FollowUpAction>} Created follow-up action
   *
   * @business Ensures systematic follow-up for all incidents
   * @audit Logs follow-up action creation for compliance
   *
   * @example
   * const action = await FollowUpService.addFollowUpAction('incident-123', {
   *   action: 'Contact parent for medical clearance',
   *   dueDate: new Date('2024-10-25'),
   *   priority: 'HIGH',
   *   assignedTo: 'nurse-456'
   * });
   */
  ```

- **getOverdueActions Method**:
  ```typescript
  /**
   * @method getOverdueActions
   * @description Get all overdue follow-up actions
   * @async
   * @returns {Promise<Array<FollowUpAction>>} Overdue actions with incident details
   *
   * @business Used for daily compliance review and escalation
   * @audit Tracks overdue items for management reporting
   *
   * @example
   * const overdueActions = await FollowUpService.getOverdueActions();
   * console.log(`${overdueActions.length} actions are overdue`);
   */
  ```

#### 3. **witnessService.ts** - Witness Statement Service
**Purpose**: Manages witness statements for incident reports including statement collection, verification, and tracking.

**Key JSDoc Additions**:
- **File-level**:
  ```typescript
  /**
   * @fileoverview Witness Statement Service
   * @module services/incidentReport/witnessService
   * @description Manages witness statements for incident reports
   *
   * Key Features:
   * - Witness statement collection and storage
   * - Statement verification workflow
   * - Multiple witness support per incident
   * - Witness type classification (STAFF, STUDENT, PARENT, OTHER)
   *
   * @compliance Required for comprehensive incident documentation
   * @legal Witness statements support legal defense
   * @audit Complete witness statement tracking
   */
  ```

- **addWitnessStatement Method**:
  ```typescript
  /**
   * @method addWitnessStatement
   * @description Add witness statement to incident report with validation
   * @async
   * @param {string} incidentReportId - Incident report UUID
   * @param {CreateWitnessStatementData} data - Witness statement details
   * @param {string} data.witnessName - Full name of witness
   * @param {string} data.witnessType - Witness type (STAFF, STUDENT, PARENT, OTHER)
   * @param {string} data.witnessContact - Contact information
   * @param {string} data.statement - Detailed witness statement
   * @returns {Promise<WitnessStatement>} Created witness statement
   *
   * @business Multiple witness statements strengthen incident documentation
   * @legal Witness statements may be required for legal proceedings
   * @audit Logs witness statement collection
   *
   * @example
   * const statement = await WitnessService.addWitnessStatement('incident-123', {
   *   witnessName: 'John Doe',
   *   witnessType: 'STAFF',
   *   witnessContact: 'john.doe@school.edu',
   *   statement: 'I saw the student trip over the backpack...'
   * });
   */
  ```

- **verifyWitnessStatement Method**:
  ```typescript
  /**
   * @method verifyWitnessStatement
   * @description Verify witness statement by authorized personnel
   * @async
   * @param {string} statementId - Witness statement UUID
   * @param {string} verifiedBy - User UUID performing verification
   * @returns {Promise<WitnessStatement>} Verified witness statement
   *
   * @business Statement verification ensures accuracy and authenticity
   * @audit Logs verification activity for compliance
   *
   * @example
   * const verified = await WitnessService.verifyWitnessStatement(
   *   'statement-123',
   *   'principal-456'
   * );
   */
  ```

#### 4. **notificationService.ts** - Notification Service
**Purpose**: Manages automated notifications for incident reports based on severity and school policies.

**Key JSDoc Additions**:
- **File-level**:
  ```typescript
  /**
   * @fileoverview Incident Notification Service
   * @module services/incidentReport/notificationService
   * @description Manages automated incident notifications to parents and staff
   *
   * Key Features:
   * - Severity-based automatic notifications
   * - Emergency contact notification
   * - Multi-channel notification support (email, SMS, voice)
   * - Notification tracking and logging
   *
   * @compliance State requirements for timely parent notification
   * @business Notification timelines:
   *   - CRITICAL: Immediate (within 1 hour to principal)
   *   - HIGH: Within 2 hours to parents
   *   - MEDIUM: Within 4 hours to parents
   *   - LOW: Same day notification
   * @audit Complete notification tracking for compliance
   */
  ```

- **notifyEmergencyContacts Method**:
  ```typescript
  /**
   * @method notifyEmergencyContacts
   * @description Notify emergency contacts about incident
   * @async
   * @param {string} incidentId - Incident report UUID
   * @returns {Promise<boolean>} Success status
   *
   * @business Automatically triggered for HIGH and CRITICAL incidents
   * @compliance Required for serious incidents
   * @audit Logs all notification attempts and delivery status
   *
   * @example
   * await NotificationService.notifyEmergencyContacts('incident-123');
   * // Sends notifications to all active emergency contacts
   */
  ```

- **notifyParent Method**:
  ```typescript
  /**
   * @method notifyParent
   * @description Send parent notification via specified method
   * @async
   * @param {string} incidentReportId - Incident report UUID
   * @param {string} method - Notification method (email, sms, voice)
   * @param {string} notifiedBy - User UUID sending notification
   * @returns {Promise<IncidentReport>} Updated incident report
   *
   * @business Tracks notification method and timestamp for compliance
   * @audit Logs notification delivery for documentation
   *
   * @example
   * await NotificationService.notifyParent(
   *   'incident-123',
   *   'email',
   *   'nurse-456'
   * );
   */
  ```

### Document Management Services (`backend/src/services/document/`)

#### 5. **documentService.ts** - Main Document Service
**Purpose**: Comprehensive document management service with HIPAA compliance, version control, and audit trail.

**Key JSDoc Additions**:
- **File-level**:
  ```typescript
  /**
   * @fileoverview Document Management Service
   * @module services/document/documentService
   * @description Enterprise document management with HIPAA compliance
   *
   * Key Features:
   * - Document CRUD operations with validation
   * - Version control and document history
   * - Digital signatures and approval workflows
   * - Access tracking for HIPAA compliance
   * - Document sharing and permissions
   * - Automated retention and archival
   *
   * @security File type validation (whitelist only)
   * @security Virus scanning integration hook
   * @security Encryption at rest for PHI documents
   * @compliance HIPAA - PHI document retention (7 years)
   * @compliance State requirements for document retention
   * @audit Complete document lifecycle tracking
   */
  ```

- **createDocument Method**:
  ```typescript
  /**
   * @method createDocument
   * @description Create new document with HIPAA compliance validation
   * @async
   * @param {CreateDocumentData} data - Document metadata
   * @param {string} data.title - Document title
   * @param {string} data.category - Document category (MEDICAL_RECORD, CONSENT_FORM, etc.)
   * @param {string} data.fileType - File type extension
   * @param {string} data.fileName - Original filename
   * @param {number} data.fileSize - File size in bytes
   * @param {string} data.fileUrl - Storage URL
   * @param {string} data.uploadedBy - User UUID
   * @param {string} [data.studentId] - Associated student UUID (optional)
   * @returns {Promise<Document>} Created document record
   * @throws {ValidationError} When file type not allowed
   * @throws {PayloadTooLargeError} When file exceeds size limit
   *
   * @security File type whitelist validation
   * @security Automatic retention date calculation
   * @compliance Automatic PHI classification
   * @audit Creates audit trail entry
   *
   * @example
   * const document = await DocumentService.createDocument({
   *   title: 'Physical Examination Form',
   *   category: 'MEDICAL_RECORD',
   *   fileType: 'pdf',
   *   fileName: 'physical-exam.pdf',
   *   fileSize: 245678,
   *   fileUrl: 's3://bucket/documents/uuid.pdf',
   *   uploadedBy: 'nurse-123',
   *   studentId: 'student-456'
   * });
   */
  ```

- **signDocument Method**:
  ```typescript
  /**
   * @method signDocument
   * @description Sign document with digital signature
   * @async
   * @param {SignDocumentData} data - Signature data
   * @param {string} data.documentId - Document UUID
   * @param {string} data.signedBy - User UUID
   * @param {string} data.signedByRole - Role of signer
   * @param {string} [data.signatureData] - Digital signature data
   * @param {string} [data.ipAddress] - IP address of signer
   * @returns {Promise<DocumentSignature>} Created signature record
   *
   * @security IP address tracking for signature authentication
   * @compliance Digital signature meets legal requirements
   * @audit Complete signature audit trail
   *
   * @example
   * const signature = await DocumentService.signDocument({
   *   documentId: 'doc-123',
   *   signedBy: 'doctor-456',
   *   signedByRole: 'School Physician',
   *   signatureData: 'base64-encoded-signature',
   *   ipAddress: '192.168.1.100'
   * });
   */
  ```

#### 6. **storage.operations.ts** - Document Storage Operations
**Purpose**: File upload, download, and access tracking operations with PHI protection.

**Key JSDoc Additions**:
- **File-level**:
  ```typescript
  /**
   * @fileoverview Document Storage Operations
   * @module services/document/storage.operations
   * @description File storage operations with HIPAA-compliant access tracking
   *
   * Key Features:
   * - Document download with access logging
   * - Document viewing with access tracking
   * - PHI document flagging
   * - IP address tracking for security
   *
   * @security Access logging for all PHI documents
   * @compliance HIPAA access tracking requirements
   * @audit Complete document access history
   */
  ```

- **downloadDocument Method**:
  ```typescript
  /**
   * @method downloadDocument
   * @description Download document with access tracking
   * @async
   * @param {string} documentId - Document UUID
   * @param {string} downloadedBy - User UUID
   * @param {string} [ipAddress] - IP address of downloader
   * @returns {Promise<Document>} Document with access metadata
   *
   * @security Tracks all PHI document downloads
   * @security Records IP address for audit trail
   * @compliance HIPAA requires tracking of all PHI access
   * @audit Creates downloadaudit trail entry with PHI flag
   *
   * @example
   * const document = await downloadDocument(
   *   'doc-123',
   *   'nurse-456',
   *   '192.168.1.100'
   * );
   * // Updates accessCount and lastAccessedAt
   */
  ```

- **viewDocument Method**:
  ```typescript
  /**
   * @method viewDocument
   * @description View document in browser with access tracking
   * @async
   * @param {string} documentId - Document UUID
   * @param {string} viewedBy - User UUID
   * @param {string} [ipAddress] - IP address of viewer
   * @returns {Promise<Document>} Document with access metadata
   *
   * @security Distinguishes between view and download for audit
   * @compliance HIPAA access tracking
   * @audit Creates view audit trail entry
   *
   * @example
   * const document = await viewDocument(
   *   'doc-123',
   *   'teacher-456',
   *   '192.168.1.101'
   * );
   */
  ```

#### 7. **crud.operations.ts** - Document CRUD Operations
**Purpose**: Core create, read, update, delete operations for documents with transaction safety.

**Key JSDoc Additions**:
- **File-level**:
  ```typescript
  /**
   * @fileoverview Document CRUD Operations
   * @module services/document/crud.operations
   * @description Core document lifecycle operations with HIPAA compliance
   *
   * Key Features:
   * - Transaction-safe CRUD operations
   * - Comprehensive validation
   * - Audit trail integration
   * - Retention policy enforcement
   *
   * @security Transaction-based operations prevent data corruption
   * @compliance Validates retention requirements before deletion
   * @audit All operations create audit trail entries
   */
  ```

- **createDocument Method**:
  ```typescript
  /**
   * @method createDocument
   * @description Create document with transaction safety
   * @async
   * @param {CreateDocumentData} data - Document creation data
   * @returns {Promise<Document>} Created document
   * @throws {ValidationError} When validation fails
   * @throws {Error} When transaction fails
   *
   * @security Uses database transactions for data integrity
   * @compliance Calculates retention date based on category
   * @audit Creates audit trail entry within transaction
   *
   * @example
   * const document = await createDocument({
   *   title: 'Immunization Record',
   *   category: 'MEDICAL_RECORD',
   *   fileType: 'pdf',
   *   fileName: 'immunization.pdf',
   *   fileSize: 156789,
   *   fileUrl: 's3://bucket/docs/uuid.pdf',
   *   uploadedBy: 'nurse-123'
   * });
   */
  ```

- **deleteDocument Method**:
  ```typescript
  /**
   * @method deleteDocument
   * @description Delete document with retention validation
   * @async
   * @param {string} id - Document UUID
   * @param {string} deletedBy - User UUID
   * @returns {Promise<Object>} Success result
   * @throws {Error} When retention requirements prevent deletion
   *
   * @compliance Prevents deletion of documents within retention period
   * @audit Creates deletion audit trail before removing document
   *
   * @example
   * await deleteDocument('doc-123', 'admin-456');
   * // Validates retention requirements before deletion
   */
  ```

## Notification Timelines Documented

### Incident Severity-Based Notifications:
- **CRITICAL**: Principal notification within 1 hour, immediate parent contact
- **HIGH**: Parent notification within 2 hours
- **MEDIUM**: Parent notification within 4 hours
- **LOW**: Parent notification within same day

### Workflow Explanations:
1. **Incident Creation** → Automatic severity assessment → Trigger notifications
2. **Witness Statement Collection** → Multiple witnesses supported → Verification workflow
3. **Follow-Up Action** → Assignment → Due date tracking → Completion workflow
4. **Document Upload** → Validation → PHI classification → Retention calculation → Audit trail

## Security Features Highlighted

### Incident Reports:
- 7-year retention requirement for all incidents
- Complete audit trail with timestamps
- Automated notification based on severity
- Witness statement verification workflow
- Follow-up action tracking

### Documents:
- **File Type Validation**: Whitelist-based file type checking
- **Virus Scanning**: Integration hook for antivirus scanning
- **Encryption at Rest**: PHI documents encrypted
- **Access Tracking**: Complete HIPAA-compliant access logging
- **IP Address Logging**: Security audit trail
- **Digital Signatures**: Legal-compliant signature workflow
- **Retention Policies**: Automatic retention date calculation
- **Version Control**: Complete document history

## Compliance Features

### HIPAA Compliance:
- PHI document identification and protection
- 7-year retention for medical records
- Complete access audit trail
- Encryption at rest
- IP address tracking

### State Requirements:
- Timely parent notification
- Incident report retention (7 years)
- Witness statement documentation
- Follow-up action tracking

## JSDoc Tags Used

- `@fileoverview` - File description
- `@module` - Module path
- `@description` - Detailed description
- `@method` - Method documentation
- `@async` - Async method indicator
- `@param` - Parameter documentation
- `@returns` - Return value documentation
- `@throws` - Error conditions
- `@example` - Usage examples
- `@compliance` - Compliance requirements
- `@legal` - Legal requirements
- `@audit` - Audit requirements
- `@business` - Business rules
- `@security` - Security features

## Summary

All incident reporting and document management service files have been comprehensively documented with:
- File-level JSDoc with module information
- Method-level JSDoc with parameters, returns, and examples
- Business rule documentation
- Compliance and legal requirements
- Security feature highlights
- Audit trail explanations
- Notification workflows
- Retention policies

This documentation provides complete context for developers, compliance officers, and system administrators working with these critical healthcare management services.
