# Financial Case Management Workflow Kit - Complete Reference

**File:** `/home/user/white-cross/reuse/financial/case-management-workflow-kit.ts`
**Version:** 1.0.0
**Type:** Enterprise-Grade TypeScript + NestJS + Sequelize
**Total Functions:** 40
**Lines of Code:** 2,338

---

## Overview

A comprehensive, production-ready financial case management system designed for compliance, investigation, and workflow management. Implements complete case lifecycle from creation through closure, with advanced features for collaboration, SLA tracking, audit trails, and reporting.

**Key Capabilities:**
- Complete case lifecycle management
- Multi-user collaboration with commenting
- Evidence and investigation tracking
- SLA monitoring and escalation
- Audit trail and compliance reporting
- Advanced search and filtering
- Template-based case creation
- Notification system
- Archive management

---

## Architecture Components

### Core Models (12 Sequelize Entities)
1. **FinancialCase** - Core case entity with lifecycle tracking
2. **CaseEvidence** - Evidence submission and verification
3. **InvestigationTimeline** - Chronological activity tracking
4. **InvestigationTask** - Task management within cases
5. **CaseNote** - Comments and collaboration
6. **CaseDecision** - Decision workflow tracking
7. **CaseEscalation** - Escalation management
8. **CaseClosure** - Case closure documentation
9. **CaseAuditTrail** - Complete audit trail
10. **CaseSLA** - SLA tracking and monitoring
11. **CaseNotification** - Notification delivery
12. **CaseTemplate** - Case templates for standardization

### Enums (7)
- **CaseStatus** - 10 workflow states
- **CasePriority** - 4 priority levels
- **EvidenceType** - 8 evidence classifications
- **InvestigationActivityType** - 7 activity types
- **TaskStatus** - 5 task states
- **DecisionType** - 4 decision outcomes
- **EscalationReason** - 6 escalation reasons

### DTOs & Interfaces (12)
- CreateCaseDTO
- AssignCaseDTO
- SubmitEvidenceDTO
- AddInvestigationActivityDTO
- CreateInvestigationTaskDTO
- AddCaseNoteDTO
- SubmitDecisionDTO
- EscalateCaseDTO
- CloseCaseDTO
- CaseSearchCriteria
- SLAConfiguration
- CaseMetrics

---

## 40 Functions - Complete List

### GROUP 1: CASE CREATION (3 Functions)

#### 1. `createCase(dto, transaction)`
**Type:** Case Creation
**Signature:**
```typescript
async createCase(
  dto: CreateCaseDTO,
  transaction?: Transaction
): Promise<FinancialCase>
```
**Features:**
- Creates new financial case with validation
- Automatic duplicate case number detection
- SLA initialization based on priority
- Audit trail creation
- Atomic transaction support

**Validates:**
- Case number uniqueness
- Title and description required
- Case type specified

**Side Effects:**
- Creates SLA tracking record
- Records creation in audit trail
- Initializes case as DRAFT status

---

#### 2. `createCaseFromTemplate(templateId, dto, transaction)`
**Type:** Template-Based Creation
**Signature:**
```typescript
async createCaseFromTemplate(
  templateId: string,
  dto: CreateCaseDTO,
  transaction?: Transaction
): Promise<FinancialCase>
```
**Features:**
- Creates case using predefined template
- Auto-applies template settings (priority, department)
- Bulk creates template tasks
- Maintains template consistency

**Returns:** Case with template configurations applied

---

#### 3. `bulkCreateCases(cases, transaction)`
**Type:** Batch Creation
**Signature:**
```typescript
async bulkCreateCases(
  cases: CreateCaseDTO[],
  transaction?: Transaction
): Promise<FinancialCase[]>
```
**Features:**
- Batch create multiple cases atomically
- Individual case validation
- Rollback on any failure
- Progress tracking through array return

**Validates:** Each case individually

---

### GROUP 2: CASE ASSIGNMENT (3 Functions)

#### 4. `assignCase(caseId, dto, transaction)`
**Type:** Assignment
**Signature:**
```typescript
async assignCase(
  caseId: string,
  dto: AssignCaseDTO,
  transaction?: Transaction
): Promise<FinancialCase>
```
**Features:**
- Assign case to investigator
- Auto-update status from DRAFT to ASSIGNED
- Create assignment notification
- Audit trail with previous assignee
- Optional assignment notes

**Notification Triggers:** Creates notification for assignee

---

#### 5. `reassignCase(caseId, newAssignee, reason, performedBy, transaction)`
**Type:** Reassignment
**Signature:**
```typescript
async reassignCase(
  caseId: string,
  newAssignee: string,
  reason: string,
  performedBy: string,
  transaction?: Transaction
): Promise<FinancialCase>
```
**Features:**
- Reassign to different investigator
- Track reassignment reason
- Audit trail with both assignees
- Notification to new assignee

---

#### 6. `getAssignmentHistory(caseId)`
**Type:** History Retrieval
**Signature:**
```typescript
async getAssignmentHistory(caseId: string): Promise<Array<{
  assignedTo: string;
  assignedAt: Date;
  assignedBy: string;
  reason?: string;
}>>
```
**Features:**
- Chronological assignment history
- Shows all reassignments
- Includes assignment reasons

---

### GROUP 3: CASE PRIORITIZATION (2 Functions)

#### 7. `updateCasePriority(caseId, newPriority, reason, changedBy, transaction)`
**Type:** Priority Management
**Signature:**
```typescript
async updateCasePriority(
  caseId: string,
  newPriority: CasePriority,
  reason: string,
  changedBy: string,
  transaction?: Transaction
): Promise<FinancialCase>
```
**Features:**
- Update case priority with reason tracking
- Automatic SLA recalculation based on priority
- Creates internal case note
- Full audit trail
- Triggers SLA deadline updates

**SLA Mapping:**
- CRITICAL: 2hr response, 24hr resolution
- HIGH: 8hr response, 72hr resolution
- MEDIUM: 24hr response, 240hr resolution
- LOW: 72hr response, 480hr resolution

---

#### 8. `autoPrioritizeCase(caseId, riskScore)`
**Type:** Automated Prioritization
**Signature:**
```typescript
async autoPrioritizeCase(
  caseId: string,
  riskScore: number
): Promise<CasePriority>
```
**Features:**
- Auto-calculate priority from risk score
- Risk score 0-100 mapping:
  - 80+: CRITICAL
  - 60-79: HIGH
  - 40-59: MEDIUM
  - <40: LOW
- Returns assigned priority

---

### GROUP 4: STATUS TRACKING (3 Functions)

#### 9. `updateCaseStatus(caseId, newStatus, changedBy, reason, transaction)`
**Type:** Status Management
**Signature:**
```typescript
async updateCaseStatus(
  caseId: string,
  newStatus: CaseStatus,
  changedBy: string,
  reason?: string,
  transaction?: Transaction
): Promise<FinancialCase>
```
**Features:**
- State machine validation for transitions
- Prevents invalid status changes
- Audit trail recording
- Internal case notes
- Transaction support

**Valid Transitions:**
- DRAFT → OPEN, ASSIGNED
- OPEN → ASSIGNED, ARCHIVED
- ASSIGNED → INVESTIGATING, ESCALATED, ARCHIVED
- INVESTIGATING → UNDER_REVIEW, ESCALATED, DECISION_PENDING
- UNDER_REVIEW → DECISION_PENDING, RESOLVED
- ESCALATED → INVESTIGATING, DECISION_PENDING
- DECISION_PENDING → RESOLVED, ESCALATED
- RESOLVED → CLOSED
- CLOSED → ARCHIVED

---

#### 10. `getStatusHistory(caseId)`
**Type:** Status History
**Signature:**
```typescript
async getStatusHistory(caseId: string): Promise<Array<{
  status: CaseStatus;
  changedAt: Date;
  changedBy: string;
  reason?: string;
}>>
```
**Features:**
- Chronological status changes
- Shows who changed status and when
- Includes change reasons

---

#### 11. `getCaseStatus(caseId)`
**Type:** Status Summary
**Signature:**
```typescript
async getCaseStatus(caseId: string): Promise<{
  caseId: string;
  caseNumber: string;
  currentStatus: CaseStatus;
  priority: CasePriority;
  assignedTo?: string;
  lastUpdated: Date;
  progressPercentage: number;
  tasksSummary: { total: number; completed: number; pending: number };
}>
```
**Features:**
- Current status overview
- Progress calculation from tasks
- Task summary breakdown

---

### GROUP 5: EVIDENCE MANAGEMENT (4 Functions)

#### 12. `submitEvidence(caseId, dto, transaction)`
**Type:** Evidence Submission
**Signature:**
```typescript
async submitEvidence(
  caseId: string,
  dto: SubmitEvidenceDTO,
  transaction?: Transaction
): Promise<CaseEvidence>
```
**Features:**
- Submit evidence with hash verification
- Support 8 evidence types (DOCUMENT, EMAIL, TRANSACTION_RECORD, etc.)
- Content hash for integrity verification
- Tags for categorization
- Audit trail and case note creation

**Evidence Types:**
- DOCUMENT
- EMAIL
- TRANSACTION_RECORD
- COMMUNICATION
- MEDIA
- DATABASE_RECORD
- AUDIT_LOG
- OTHER

---

#### 13. `verifyEvidence(evidenceId, verifiedBy, verificationNotes, transaction)`
**Type:** Evidence Verification
**Signature:**
```typescript
async verifyEvidence(
  evidenceId: string,
  verifiedBy: string,
  verificationNotes?: string,
  transaction?: Transaction
): Promise<CaseEvidence>
```
**Features:**
- Mark evidence as verified
- Verification timestamp and user tracking
- Optional verification notes
- Case note creation

---

#### 14. `getEvidenceList(caseId, filters)`
**Type:** Evidence Retrieval
**Signature:**
```typescript
async getEvidenceList(
  caseId: string,
  filters?: {
    type?: EvidenceType;
    verified?: boolean;
    offset?: number;
    limit?: number;
  }
): Promise<{ evidence: CaseEvidence[]; total: number }>
```
**Features:**
- Paginated evidence listing
- Filter by type and verification status
- Sorting by submission date (newest first)

---

#### 15. `setEvidenceRetention(evidenceId, expiryDate, reason, transaction)`
**Type:** Retention Management
**Signature:**
```typescript
async setEvidenceRetention(
  evidenceId: string,
  expiryDate: Date,
  reason: string,
  transaction?: Transaction
): Promise<CaseEvidence>
```
**Features:**
- Set evidence retention/expiry dates
- Compliance-driven retention policies
- Case note with retention reason
- Archival eligibility tracking

---

### GROUP 6: INVESTIGATION TIMELINE (3 Functions)

#### 16. `addInvestigationActivity(caseId, dto, transaction)`
**Type:** Timeline Entry
**Signature:**
```typescript
async addInvestigationActivity(
  caseId: string,
  dto: AddInvestigationActivityDTO,
  transaction?: Transaction
): Promise<InvestigationTimeline>
```
**Features:**
- Add investigation activity to timeline
- Support 7 activity types (REVIEW, ANALYSIS, INTERVIEW, etc.)
- Optional findings and attachments
- Auto-update case status to INVESTIGATING
- Audit trail and case notes

**Activity Types:**
- REVIEW
- ANALYSIS
- INTERVIEW
- DOCUMENT_COLLECTION
- FOLLOW_UP
- ESCALATION
- DECISION

---

#### 17. `getInvestigationTimeline(caseId)`
**Type:** Timeline Retrieval
**Signature:**
```typescript
async getInvestigationTimeline(
  caseId: string
): Promise<InvestigationTimeline[]>
```
**Features:**
- Chronological timeline of all activities
- Earliest activity first (chronological order)

---

#### 18. `getInvestigationSummary(caseId)`
**Type:** Timeline Analysis
**Signature:**
```typescript
async getInvestigationSummary(caseId: string): Promise<{
  caseId: string;
  totalActivities: number;
  activitiesByType: Record<string, number>;
  lastActivity: {
    performedAt: Date;
    type: InvestigationActivityType;
    performedBy: string;
  };
  investigationDuration: number;
  keyFindings: string[];
}>
```
**Features:**
- Investigation progress summary
- Activity count by type
- Investigation duration in days
- Key findings extraction
- Last activity tracking

---

### GROUP 7: TASK MANAGEMENT (4 Functions)

#### 19. `createInvestigationTask(caseId, dto, transaction)`
**Type:** Task Creation
**Signature:**
```typescript
async createInvestigationTask(
  caseId: string,
  dto: CreateInvestigationTaskDTO,
  transaction?: Transaction
): Promise<InvestigationTask>
```
**Features:**
- Create investigation task with priority
- Dependency tracking
- Due date management
- Auto-assigns initial status to PENDING
- Notification to assignee
- Initial progress at 0%

---

#### 20. `updateTaskStatus(taskId, newStatus, progress, updatedBy, transaction)`
**Type:** Task Status Update
**Signature:**
```typescript
async updateTaskStatus(
  taskId: string,
  newStatus: TaskStatus,
  progress?: number,
  updatedBy?: string,
  transaction?: Transaction
): Promise<InvestigationTask>
```
**Features:**
- Update task status with progress
- Auto-set completedAt for COMPLETED
- Progress percentage tracking

**Task Status Options:**
- PENDING
- IN_PROGRESS
- BLOCKED
- COMPLETED
- CANCELLED

---

#### 21. `getTasksForCase(caseId, filters)`
**Type:** Task Retrieval
**Signature:**
```typescript
async getTasksForCase(
  caseId: string,
  filters?: {
    status?: TaskStatus;
    assignedTo?: string;
    overdue?: boolean;
  }
): Promise<InvestigationTask[]>
```
**Features:**
- Get all tasks for case
- Filter by status, assignee, overdue status
- Sorted by due date (earliest first)

---

#### 22. `updateTaskDependencies(taskIds, dependencyMap, transaction)`
**Type:** Dependency Management
**Signature:**
```typescript
async updateTaskDependencies(
  taskIds: string[],
  dependencyMap: Record<string, string[]>,
  transaction?: Transaction
): Promise<InvestigationTask[]>
```
**Features:**
- Batch update task dependencies
- Support task workflow sequencing
- Returns updated tasks

---

### GROUP 8: COLLABORATION & NOTES (3 Functions)

#### 23. `addCaseNote(caseId, dto, transaction)`
**Type:** Note/Comment Creation
**Signature:**
```typescript
async addCaseNote(
  caseId: string,
  dto: AddCaseNoteDTO,
  transaction?: Transaction
): Promise<CaseNote>
```
**Features:**
- Add internal or external notes
- User mention support (@username)
- Auto-create notifications for mentioned users
- Edit history tracking
- Attachment support

---

#### 24. `getCaseNotes(caseId, filters)`
**Type:** Notes Retrieval
**Signature:**
```typescript
async getCaseNotes(
  caseId: string,
  filters?: {
    internalOnly?: boolean;
    authorId?: string;
    offset?: number;
    limit?: number;
  }
): Promise<{ notes: CaseNote[]; total: number }>
```
**Features:**
- Paginated note retrieval
- Filter by internal/external status
- Filter by author
- Newest notes first

---

#### 25. `editCaseNote(noteId, newContent, editedBy, transaction)`
**Type:** Note Editing
**Signature:**
```typescript
async editCaseNote(
  noteId: string,
  newContent: string,
  editedBy: string,
  transaction?: Transaction
): Promise<CaseNote>
```
**Features:**
- Edit existing note
- Edit history tracking (previous content, timestamp, editor)
- Mark as edited flag

---

### GROUP 9: DECISION WORKFLOW (3 Functions)

#### 26. `submitDecision(caseId, dto, transaction)`
**Type:** Decision Submission
**Signature:**
```typescript
async submitDecision(
  caseId: string,
  dto: SubmitDecisionDTO,
  transaction?: Transaction
): Promise<CaseDecision>
```
**Features:**
- Submit case decision with supporting documentation
- Decision types: APPROVED, REJECTED, NEEDS_REVIEW, NEEDS_ESCALATION
- Reasoning and recommendations
- Attachment support
- Auto-update case status based on decision
- Audit trail creation

**Decision Status:** PENDING (until approval)

---

#### 27. `approveDecision(decisionId, approved, approvedBy, comments, transaction)`
**Type:** Decision Approval
**Signature:**
```typescript
async approveDecision(
  decisionId: string,
  approved: boolean,
  approvedBy: string,
  comments?: string,
  transaction?: Transaction
): Promise<CaseDecision>
```
**Features:**
- Approve or reject decision
- Decision status: APPROVED or REJECTED
- Approval timestamp and user tracking
- Auto-resolve case if APPROVED
- Case note creation

---

#### 28. `getDecisionHistory(caseId)`
**Type:** Decision History
**Signature:**
```typescript
async getDecisionHistory(
  caseId: string
): Promise<CaseDecision[]>
```
**Features:**
- All decisions made on case
- Newest decisions first
- Includes approval status

---

### GROUP 10: ESCALATION (3 Functions)

#### 29. `escalateCase(caseId, dto, transaction)`
**Type:** Case Escalation
**Signature:**
```typescript
async escalateCase(
  caseId: string,
  dto: EscalateCaseDTO,
  transaction?: Transaction
): Promise<CaseEscalation>
```
**Features:**
- Escalate case to higher authority
- 6 escalation reasons (COMPLEXITY, TIME_EXCEEDED, REGULATORY, etc.)
- Target resolution date setting
- Reassigns case to escalation recipient
- Auto-update status to ESCALATED
- Notification to escalation recipient
- Audit trail with previous assignee

**Escalation Reasons:**
- COMPLEXITY
- TIME_EXCEEDED
- REGULATORY
- HIGH_VALUE
- MANAGEMENT_REQUEST
- OTHER

---

#### 30. `resolveEscalation(escalationId, resolution, resolvedBy, transaction)`
**Type:** Escalation Resolution
**Signature:**
```typescript
async resolveEscalation(
  escalationId: string,
  resolution: string,
  resolvedBy: string,
  transaction?: Transaction
): Promise<CaseEscalation>
```
**Features:**
- Mark escalation as resolved
- Document resolution approach
- Case note creation

---

#### 31. `getEscalationHistory(caseId)`
**Type:** Escalation History
**Signature:**
```typescript
async getEscalationHistory(
  caseId: string
): Promise<CaseEscalation[]>
```
**Features:**
- All escalations for case
- Newest escalations first
- Shows from/to assignees and reasons

---

### GROUP 11: CLOSURE PROCEDURES (3 Functions)

#### 32. `closeCase(caseId, dto, transaction)`
**Type:** Case Closure
**Signature:**
```typescript
async closeCase(
  caseId: string,
  dto: CloseCaseDTO,
  transaction?: Transaction
): Promise<CaseClosure>
```
**Features:**
- Close case with comprehensive documentation
- Resolution and outcome documentation
- Follow-up case requirement tracking
- Follow-up due date scheduling
- Auto-update case status to CLOSED
- Closure timestamp and user tracking
- Audit trail creation
- Resolution summary in case entity

---

#### 33. `archiveCase(caseId, archivedBy, reason, transaction)`
**Type:** Case Archival
**Signature:**
```typescript
async archiveCase(
  caseId: string,
  archivedBy: string,
  reason?: string,
  transaction?: Transaction
): Promise<FinancialCase>
```
**Features:**
- Archive closed case
- Validation: Only closed cases can be archived
- Archive timestamp and reason tracking
- Audit trail creation

---

#### 34. `createFollowUpCase(caseId, followUpData, transaction)`
**Type:** Follow-up Case Creation
**Signature:**
```typescript
async createFollowUpCase(
  caseId: string,
  followUpData: CreateCaseDTO,
  transaction?: Transaction
): Promise<FinancialCase>
```
**Features:**
- Create follow-up case from closed case
- Auto-tag with reference to original case
- Link cases in audit trail
- Inherits case context

---

### GROUP 12: METRICS & REPORTING (2 Functions)

#### 35. `calculateCaseMetrics(filters)`
**Type:** Metrics Calculation
**Signature:**
```typescript
async calculateCaseMetrics(filters?: {
  dateFrom?: Date;
  dateTo?: Date;
  department?: string;
  caseType?: string;
}): Promise<CaseMetrics>
```
**Features:**
- Comprehensive case metrics and KPIs
- Returns:
  - Total cases
  - Open cases count
  - Closed cases count
  - Average resolution time (hours)
  - Average response time (hours)
  - SLA on-time percentage
  - Escalation rate percentage
  - Priority distribution breakdown
- Date range filtering
- Department filtering

---

#### 36. `generateCaseReport(caseId)`
**Type:** Report Generation
**Signature:**
```typescript
async generateCaseReport(caseId: string): Promise<{
  caseInfo: any;
  timeline: any;
  evidence: any;
  decisions: any;
  escalations: any;
  notes: any;
  metrics: any;
}>
```
**Features:**
- Generate comprehensive case report
- Includes all case data, timeline, evidence
- Decision and escalation history
- All notes and comments
- Case metrics and progress
- Single consolidated report

---

### GROUP 13: SEARCH & FILTER (2 Functions)

#### 37. `searchCases(criteria)`
**Type:** Advanced Search
**Signature:**
```typescript
async searchCases(criteria: CaseSearchCriteria): Promise<{
  cases: FinancialCase[];
  total: number;
  page: number;
  pageSize: number;
}>
```
**Features:**
- Multi-criterion search and filtering
- Case number search (partial match, case-insensitive)
- Filter by status(es)
- Filter by priority(ies)
- Assignee filtering
- Creator filtering
- Department filtering
- Date range filtering
- Full-text search on title and description
- Pagination support
- Newest cases first

---

#### 38. `applySavedFilter(filterName, page, limit)`
**Type:** Saved Filter Application
**Signature:**
```typescript
async applySavedFilter(
  filterName: string,
  page?: number,
  limit?: number
): Promise<{ cases: FinancialCase[]; total: number }>
```
**Features:**
- Apply predefined filters
- Pre-configured filters:
  - "my-active-cases" → ASSIGNED, INVESTIGATING
  - "high-priority" → CRITICAL, HIGH priority
  - "pending-closure" → UNDER_REVIEW, DECISION_PENDING
  - "escalated" → ESCALATED status
- Pagination support

---

### GROUP 14: ARCHIVE MANAGEMENT (1 Function)

#### 39. `getArchivedCases(filters)`
**Type:** Archive Retrieval
**Signature:**
```typescript
async getArchivedCases(filters?: {
  dateFrom?: Date;
  dateTo?: Date;
  department?: string;
  page?: number;
  limit?: number;
}): Promise<{ cases: FinancialCase[]; total: number }>
```
**Features:**
- Retrieve archived cases
- Filter by archive date range
- Filter by department
- Pagination support
- Newest archives first

---

### GROUP 15: AUDIT TRAIL (1 Function)

#### 40. `getAuditTrail(caseId, filters)`
**Type:** Audit Trail Retrieval
**Signature:**
```typescript
async getAuditTrail(
  caseId: string,
  filters?: {
    action?: string;
    performedBy?: string;
    dateFrom?: Date;
    dateTo?: Date;
    offset?: number;
    limit?: number;
  }
): Promise<{ entries: CaseAuditTrail[]; total: number }>
```
**Features:**
- Complete audit trail for case
- Filter by action type
- Filter by performer
- Date range filtering
- Pagination support
- Newest actions first
- Previous and new values tracking
- Full compliance audit support

---

## Private Helper Functions

### `_initializeSLA(caseId, priority, transaction)`
Initialize SLA tracking based on case priority

### `_createAuditTrail(caseId, action, performedBy, previousValues, newValues, transaction)`
Create audit trail entry with before/after values

### `_createNotification(caseId, recipientId, type, subject, body, transaction)`
Create notification for case participants

### `_isValidStatusTransition(from, to)`
Validate case status transitions against state machine

---

## Usage Examples

### Example 1: Creating and Managing a Case
```typescript
// Create case
const newCase = await service.createCase({
  caseNumber: 'FC-2024-00001',
  title: 'Suspicious Wire Transfer',
  description: 'Large unusual wire transfer detected',
  caseType: 'AML_INVESTIGATION',
  priority: CasePriority.HIGH,
  createdBy: 'analyst-123'
});

// Assign to investigator
await service.assignCase(newCase.id, {
  assignedTo: 'investigator-456',
  assignedBy: 'manager-789',
  notes: 'Priority investigation needed'
});

// Update status to investigating
await service.updateCaseStatus(
  newCase.id,
  CaseStatus.INVESTIGATING,
  'manager-789',
  'Investigation commenced'
);
```

### Example 2: Evidence Management
```typescript
// Submit evidence
const evidence = await service.submitEvidence(caseId, {
  title: 'Transaction Report',
  description: 'Detailed transaction analysis',
  type: EvidenceType.TRANSACTION_RECORD,
  fileUrl: 's3://bucket/evidence.pdf',
  contentHash: 'abc123def456',
  submittedBy: 'analyst-123'
});

// Verify evidence
await service.verifyEvidence(
  evidence.id,
  'reviewer-789',
  'Hash verified, authenticity confirmed'
);
```

### Example 3: Investigation Timeline
```typescript
// Add investigation activities
await service.addInvestigationActivity(caseId, {
  activityType: InvestigationActivityType.REVIEW,
  description: 'Reviewed transaction patterns',
  performedBy: 'analyst-123',
  findings: 'Pattern matches known AML indicators'
});

// Get timeline summary
const summary = await service.getInvestigationSummary(caseId);
```

### Example 4: Task Management
```typescript
// Create investigation tasks
await service.createInvestigationTask(caseId, {
  title: 'Contact customer for clarification',
  description: 'Follow up on transaction details',
  assignedTo: 'investigator-456',
  dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
  priority: CasePriority.HIGH
});

// Update task progress
await service.updateTaskStatus(taskId, TaskStatus.IN_PROGRESS, 50);
```

### Example 5: Decision Workflow
```typescript
// Submit decision
const decision = await service.submitDecision(caseId, {
  decision: DecisionType.APPROVED,
  reasoning: 'Evidence supports regulatory report filing',
  decidedBy: 'reviewer-789',
  recommendations: 'File SAR with FinCEN'
});

// Approve decision
await service.approveDecision(
  decision.id,
  true,
  'compliance-director-123',
  'SAR filing approved'
);
```

### Example 6: Advanced Search
```typescript
// Search cases
const results = await service.searchCases({
  status: [CaseStatus.OPEN, CaseStatus.INVESTIGATING],
  priority: [CasePriority.CRITICAL, CasePriority.HIGH],
  department: 'Compliance',
  dateFrom: new Date('2024-01-01'),
  page: 1,
  limit: 20
});
```

---

## Key Features Summary

### State Machine Management
- 10 case statuses with validated transitions
- Prevents invalid state changes
- Automatic status progression support

### SLA Tracking
- Priority-based SLA configuration
- Automatic deadline calculation
- Breach detection and monitoring
- Response and resolution time tracking

### Audit & Compliance
- Complete audit trail for all changes
- Previous and new value tracking
- User attribution for all actions
- Timestamp accuracy
- GDPR/regulatory compliance ready

### Collaboration
- Case notes with user mentions
- Edit history tracking
- Internal/external note separation
- Notification system integration

### Evidence Management
- 8 evidence types supported
- Hash-based integrity verification
- Retention policy tracking
- Verification workflow

### Investigation Support
- Chronological activity timeline
- 7 activity types (REVIEW, ANALYSIS, INTERVIEW, etc.)
- Finding and attachment tracking
- Duration calculation

### Reporting & Metrics
- Comprehensive KPI calculations
- Priority distribution analysis
- SLA compliance percentage
- Escalation rate tracking
- Full case reports

### Search & Filter
- Full-text search capability
- Multi-criterion filtering
- Pre-configured saved filters
- Pagination support
- Case-insensitive search

---

## Integration Points

### NestJS
- Injectable service pattern
- Sequelize model decorators (@InjectModel)
- Exception handling (BadRequestException, NotFoundException, ConflictException)
- Transaction management

### Database (Sequelize)
- 12 models with relationships
- Transaction support
- Query optimization
- Foreign key support

### External Systems
- Notification system (via createNotification)
- Evidence storage (fileUrl property)
- Template system (case templates)
- Risk scoring (auto-prioritization)

---

## Performance Considerations

- Efficient pagination support
- Indexed queries on common filters
- Eager loading for relationships
- Batch operation support
- Transaction-based consistency

---

## Security Features

- Type-safe enums prevent invalid values
- Validation on all inputs
- User attribution for audit trail
- Access control ready (layer above service)
- Hash verification for evidence integrity

---

## Exports

The kit exports all components in `CASE_MANAGEMENT_EXPORTS`:
- Service class
- All 12 Sequelize models
- 7 Enums
- 12 DTOs/Interfaces

---

## Version History

**v1.0.0** (November 2024)
- Initial release
- 40 comprehensive functions
- 12 Sequelize models
- Complete case lifecycle support
- Enterprise-grade features

---

## Development Notes

- Designed for financial compliance systems
- Extensible architecture for custom workflows
- Ready for production deployment
- Comprehensive error handling
- Full audit trail capabilities
- Supports distributed transactions

---

**Generated:** November 8, 2024
**File Location:** `/home/user/white-cross/reuse/financial/case-management-workflow-kit.ts`
