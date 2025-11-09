/**
 * Financial Case Management Workflow Kit
 * Enterprise-grade case management system with comprehensive workflow support
 *
 * Features:
 * - Complete case lifecycle management (creation, assignment, prioritization, closure)
 * - Evidence and investigation tracking
 * - Multi-user collaboration with commenting system
 * - SLA tracking and escalation management
 * - Audit trails and compliance reporting
 * - Advanced search, filtering, and archival
 * - Notification system with template support
 * - Financial metrics and KPI tracking
 *
 * @module case-management-workflow-kit
 * @version 1.0.0
 */
import { Model, Transaction } from 'sequelize';
/**
 * Case status enumeration tracking workflow progression
 */
export declare enum CaseStatus {
    DRAFT = "DRAFT",
    OPEN = "OPEN",
    ASSIGNED = "ASSIGNED",
    INVESTIGATING = "INVESTIGATING",
    UNDER_REVIEW = "UNDER_REVIEW",
    ESCALATED = "ESCALATED",
    DECISION_PENDING = "DECISION_PENDING",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED",
    ARCHIVED = "ARCHIVED"
}
/**
 * Case priority levels with SLA implications
 */
export declare enum CasePriority {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW"
}
/**
 * Evidence classification for proper management
 */
export declare enum EvidenceType {
    DOCUMENT = "DOCUMENT",
    EMAIL = "EMAIL",
    TRANSACTION_RECORD = "TRANSACTION_RECORD",
    COMMUNICATION = "COMMUNICATION",
    MEDIA = "MEDIA",
    DATABASE_RECORD = "DATABASE_RECORD",
    AUDIT_LOG = "AUDIT_LOG",
    OTHER = "OTHER"
}
/**
 * Investigation activity types
 */
export declare enum InvestigationActivityType {
    REVIEW = "REVIEW",
    ANALYSIS = "ANALYSIS",
    INTERVIEW = "INTERVIEW",
    DOCUMENT_COLLECTION = "DOCUMENT_COLLECTION",
    FOLLOW_UP = "FOLLOW_UP",
    ESCALATION = "ESCALATION",
    DECISION = "DECISION"
}
/**
 * Task status within investigation
 */
export declare enum TaskStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    BLOCKED = "BLOCKED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
/**
 * Decision types in case resolution workflow
 */
export declare enum DecisionType {
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    NEEDS_REVIEW = "NEEDS_REVIEW",
    NEEDS_ESCALATION = "NEEDS_ESCALATION"
}
/**
 * Escalation reasons for traceability
 */
export declare enum EscalationReason {
    COMPLEXITY = "COMPLEXITY",
    TIME_EXCEEDED = "TIME_EXCEEDED",
    REGULATORY = "REGULATORY",
    HIGH_VALUE = "HIGH_VALUE",
    MANAGEMENT_REQUEST = "MANAGEMENT_REQUEST",
    OTHER = "OTHER"
}
/**
 * Core case creation DTO
 */
export interface CreateCaseDTO {
    caseNumber: string;
    title: string;
    description: string;
    caseType: string;
    priority: CasePriority;
    createdBy: string;
    department?: string;
    relatedAccounts?: string[];
    tags?: string[];
}
/**
 * Case assignment data
 */
export interface AssignCaseDTO {
    assignedTo: string;
    assignedBy: string;
    notes?: string;
}
/**
 * Evidence submission data
 */
export interface SubmitEvidenceDTO {
    title: string;
    description: string;
    type: EvidenceType;
    fileUrl?: string;
    contentHash: string;
    submittedBy: string;
    tags?: string[];
}
/**
 * Investigation activity tracking
 */
export interface AddInvestigationActivityDTO {
    activityType: InvestigationActivityType;
    description: string;
    performedBy: string;
    findings?: string;
    attachments?: string[];
}
/**
 * Task creation within investigation
 */
export interface CreateInvestigationTaskDTO {
    title: string;
    description: string;
    assignedTo: string;
    dueDate: Date;
    priority: CasePriority;
    dependsOn?: string[];
}
/**
 * Case note/comment submission
 */
export interface AddCaseNoteDTO {
    content: string;
    authorId: string;
    isInternal: boolean;
    mentions?: string[];
}
/**
 * Decision workflow submission
 */
export interface SubmitDecisionDTO {
    decision: DecisionType;
    reasoning: string;
    decidedBy: string;
    recommendations?: string;
    attachments?: string[];
}
/**
 * Escalation submission
 */
export interface EscalateCaseDTO {
    reason: EscalationReason;
    escalatedTo: string;
    escalatedBy: string;
    justification: string;
    targetResolutionDate?: Date;
}
/**
 * Case closure data
 */
export interface CloseCaseDTO {
    closedBy: string;
    resolution: string;
    outcome: string;
    recommendations?: string;
    followUpRequired: boolean;
    followUpDate?: Date;
}
/**
 * Search and filter criteria
 */
export interface CaseSearchCriteria {
    caseNumber?: string;
    status?: CaseStatus[];
    priority?: CasePriority[];
    assignedTo?: string;
    createdBy?: string;
    dateFrom?: Date;
    dateTo?: Date;
    department?: string;
    tags?: string[];
    searchTerm?: string;
    page?: number;
    limit?: number;
}
/**
 * SLA tracking configuration
 */
export interface SLAConfiguration {
    priority: CasePriority;
    responseTimeHours: number;
    resolutionTimeHours: number;
}
/**
 * Notification template data
 */
export interface NotificationTemplate {
    id: string;
    name: string;
    subject: string;
    body: string;
    placeholders: string[];
    isActive: boolean;
}
/**
 * Case metrics and KPI data
 */
export interface CaseMetrics {
    totalCases: number;
    openCases: number;
    closedCases: number;
    averageResolutionTime: number;
    averageResponseTime: number;
    onTimeSLAPercentage: number;
    escalationRate: number;
    priorityDistribution: Record<string, number>;
}
/**
 * Financial Case model for Sequelize ORM
 */
export declare class FinancialCase extends Model {
    id: string;
    caseNumber: string;
    title: string;
    description: string;
    caseType: string;
    status: CaseStatus;
    priority: CasePriority;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    assignedTo?: string;
    assignedAt?: Date;
    department?: string;
    relatedAccounts: string[];
    tags: string[];
    closedAt?: Date;
    closedBy?: string;
    archivedAt?: Date;
    slaResponseDeadline?: Date;
    slaResolutionDeadline?: Date;
    resolutionSummary?: string;
}
/**
 * Case Evidence model
 */
export declare class CaseEvidence extends Model {
    id: string;
    caseId: string;
    title: string;
    description: string;
    type: EvidenceType;
    fileUrl?: string;
    contentHash: string;
    submittedBy: string;
    submittedAt: Date;
    tags: string[];
    isVerified: boolean;
    verifiedBy?: string;
    verifiedAt?: Date;
    retentionExpiryDate?: Date;
}
/**
 * Investigation Timeline model
 */
export declare class InvestigationTimeline extends Model {
    id: string;
    caseId: string;
    activityType: InvestigationActivityType;
    description: string;
    performedBy: string;
    performedAt: Date;
    findings?: string;
    attachments: string[];
    duration?: number;
}
/**
 * Investigation Task model
 */
export declare class InvestigationTask extends Model {
    id: string;
    caseId: string;
    title: string;
    description: string;
    status: TaskStatus;
    assignedTo: string;
    createdAt: Date;
    dueDate: Date;
    completedAt?: Date;
    priority: CasePriority;
    dependsOn: string[];
    progress: number;
}
/**
 * Case Notes/Comments model
 */
export declare class CaseNote extends Model {
    id: string;
    caseId: string;
    content: string;
    authorId: string;
    authorName: string;
    createdAt: Date;
    updatedAt: Date;
    isInternal: boolean;
    mentions: string[];
    attachments: string[];
    isEdited: boolean;
    editHistory?: Record<string, any>[];
}
/**
 * Decision Workflow model
 */
export declare class CaseDecision extends Model {
    id: string;
    caseId: string;
    decision: DecisionType;
    reasoning: string;
    decidedBy: string;
    decidedAt: Date;
    recommendations?: string;
    attachments: string[];
    approvedBy?: string;
    approvedAt?: Date;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
}
/**
 * Escalation History model
 */
export declare class CaseEscalation extends Model {
    id: string;
    caseId: string;
    reason: EscalationReason;
    escalatedFrom: string;
    escalatedTo: string;
    escalatedBy: string;
    escalatedAt: Date;
    justification: string;
    targetResolutionDate?: Date;
    resolvedAt?: Date;
    resolution?: string;
}
/**
 * Case Closure Record model
 */
export declare class CaseClosure extends Model {
    id: string;
    caseId: string;
    closedBy: string;
    closedAt: Date;
    resolution: string;
    outcome: string;
    recommendations?: string;
    followUpRequired: boolean;
    followUpDate?: Date;
    satisfactionScore?: number;
}
/**
 * Audit Trail model
 */
export declare class CaseAuditTrail extends Model {
    id: string;
    caseId: string;
    action: string;
    performedBy: string;
    performedAt: Date;
    previousValues?: Record<string, any>;
    newValues?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}
/**
 * SLA Tracking model
 */
export declare class CaseSLA extends Model {
    id: string;
    caseId: string;
    priority: CasePriority;
    responseDeadline: Date;
    resolutionDeadline: Date;
    responseBreached: boolean;
    responseBreachedAt?: Date;
    resolutionBreached: boolean;
    resolutionBreachedAt?: Date;
    actualResponseTime?: number;
    actualResolutionTime?: number;
}
/**
 * Notification model
 */
export declare class CaseNotification extends Model {
    id: string;
    caseId: string;
    recipientId: string;
    type: string;
    subject: string;
    body: string;
    createdAt: Date;
    sentAt?: Date;
    readAt?: Date;
    deliveryStatus: 'PENDING' | 'SENT' | 'FAILED';
    retryCount: number;
}
/**
 * Case Template model
 */
export declare class CaseTemplate extends Model {
    id: string;
    name: string;
    description: string;
    caseType: string;
    defaultPriority: CasePriority;
    taskTemplate: string;
    checklistItems: string[];
    defaultAssignedDepartment?: string;
    createdBy: string;
    createdAt: Date;
    isActive: boolean;
}
export declare class CaseManagementWorkflowService {
    private caseModel;
    private evidenceModel;
    private timelineModel;
    private taskModel;
    private noteModel;
    private decisionModel;
    private escalationModel;
    private closureModel;
    private auditTrailModel;
    private slaModel;
    private notificationModel;
    private templateModel;
    private readonly SLA_CONFIG;
    constructor(caseModel: typeof FinancialCase, evidenceModel: typeof CaseEvidence, timelineModel: typeof InvestigationTimeline, taskModel: typeof InvestigationTask, noteModel: typeof CaseNote, decisionModel: typeof CaseDecision, escalationModel: typeof CaseEscalation, closureModel: typeof CaseClosure, auditTrailModel: typeof CaseAuditTrail, slaModel: typeof CaseSLA, notificationModel: typeof CaseNotification, templateModel: typeof CaseTemplate);
    /**
     * Create a new financial case with comprehensive initialization
     *
     * @param dto - Case creation data transfer object
     * @param transaction - Database transaction for atomicity
     * @returns Created case entity with all initialized fields
     * @throws BadRequestException if validation fails
     *
     * @example
     * const newCase = await service.createCase({
     *   caseNumber: 'FC-2024-00001',
     *   title: 'Suspicious Transaction Detection',
     *   description: 'Large unusual wire transfer detected',
     *   caseType: 'AML_INVESTIGATION',
     *   priority: CasePriority.HIGH,
     *   createdBy: 'user-123'
     * });
     */
    createCase(dto: CreateCaseDTO, transaction?: Transaction): Promise<FinancialCase>;
    /**
     * Create case from template with pre-configured settings
     *
     * @param templateId - Template identifier
     * @param dto - Base case data
     * @param transaction - Database transaction
     * @returns Created case with template configurations applied
     * @throws NotFoundException if template not found
     */
    createCaseFromTemplate(templateId: string, dto: CreateCaseDTO, transaction?: Transaction): Promise<FinancialCase>;
    /**
     * Bulk create cases from CSV/batch data
     *
     * @param cases - Array of case creation DTOs
     * @param transaction - Database transaction
     * @returns Array of created cases
     * @throws BadRequestException if any case fails validation
     */
    bulkCreateCases(cases: CreateCaseDTO[], transaction?: Transaction): Promise<FinancialCase[]>;
    /**
     * Assign case to investigator with audit trail
     *
     * @param caseId - Case identifier
     * @param dto - Assignment data
     * @param transaction - Database transaction
     * @returns Updated case
     * @throws NotFoundException if case not found
     */
    assignCase(caseId: string, dto: AssignCaseDTO, transaction?: Transaction): Promise<FinancialCase>;
    /**
     * Reassign case to different investigator
     *
     * @param caseId - Case identifier
     * @param newAssignee - New assignee user ID
     * @param reason - Reason for reassignment
     * @param performedBy - User performing reassignment
     * @param transaction - Database transaction
     * @returns Updated case
     */
    reassignCase(caseId: string, newAssignee: string, reason: string, performedBy: string, transaction?: Transaction): Promise<FinancialCase>;
    /**
     * Get assignment history for case
     *
     * @param caseId - Case identifier
     * @returns Chronological list of assignments
     */
    getAssignmentHistory(caseId: string): Promise<Array<{
        assignedTo: string;
        assignedAt: Date;
        assignedBy: string;
        reason?: string;
    }>>;
    /**
     * Update case priority with impact analysis
     *
     * @param caseId - Case identifier
     * @param newPriority - New priority level
     * @param reason - Reason for priority change
     * @param changedBy - User making change
     * @param transaction - Database transaction
     * @returns Updated case
     */
    updateCasePriority(caseId: string, newPriority: CasePriority, reason: string, changedBy: string, transaction?: Transaction): Promise<FinancialCase>;
    /**
     * Auto-prioritize cases based on risk scoring rules
     *
     * @param caseId - Case identifier
     * @param riskScore - Calculated risk score (0-100)
     * @returns New priority level assigned
     */
    autoPrioritizeCase(caseId: string, riskScore: number): Promise<CasePriority>;
    /**
     * Update case status with validation and state machine enforcement
     *
     * @param caseId - Case identifier
     * @param newStatus - New status
     * @param changedBy - User performing change
     * @param reason - Status change reason
     * @param transaction - Database transaction
     * @returns Updated case
     * @throws BadRequestException if status transition invalid
     */
    updateCaseStatus(caseId: string, newStatus: CaseStatus, changedBy: string, reason?: string, transaction?: Transaction): Promise<FinancialCase>;
    /**
     * Get status history with timestamps
     *
     * @param caseId - Case identifier
     * @returns Chronological status change history
     */
    getStatusHistory(caseId: string): Promise<Array<{
        status: CaseStatus;
        changedAt: Date;
        changedBy: string;
        reason?: string;
    }>>;
    /**
     * Get current case status summary
     *
     * @param caseId - Case identifier
     * @returns Comprehensive status information
     */
    getCaseStatus(caseId: string): Promise<{
        caseId: string;
        caseNumber: string;
        currentStatus: CaseStatus;
        priority: CasePriority;
        assignedTo?: string;
        lastUpdated: Date;
        progressPercentage: number;
        tasksSummary: {
            total: number;
            completed: number;
            pending: number;
        };
    }>;
    /**
     * Submit evidence with hash verification and retention tracking
     *
     * @param caseId - Case identifier
     * @param dto - Evidence submission data
     * @param transaction - Database transaction
     * @returns Created evidence record
     * @throws NotFoundException if case not found
     */
    submitEvidence(caseId: string, dto: SubmitEvidenceDTO, transaction?: Transaction): Promise<CaseEvidence>;
    /**
     * Verify evidence and mark as validated
     *
     * @param evidenceId - Evidence identifier
     * @param verifiedBy - User verifying evidence
     * @param verificationNotes - Verification details
     * @param transaction - Database transaction
     * @returns Updated evidence
     */
    verifyEvidence(evidenceId: string, verifiedBy: string, verificationNotes?: string, transaction?: Transaction): Promise<CaseEvidence>;
    /**
     * Get all evidence for case
     *
     * @param caseId - Case identifier
     * @param filters - Optional filter criteria
     * @returns Paginated evidence list
     */
    getEvidenceList(caseId: string, filters?: {
        type?: EvidenceType;
        verified?: boolean;
        offset?: number;
        limit?: number;
    }): Promise<{
        evidence: CaseEvidence[];
        total: number;
    }>;
    /**
     * Set evidence retention expiry and manage archival
     *
     * @param evidenceId - Evidence identifier
     * @param expiryDate - Date when evidence can be deleted
     * @param reason - Retention policy reason
     * @param transaction - Database transaction
     * @returns Updated evidence
     */
    setEvidenceRetention(evidenceId: string, expiryDate: Date, reason: string, transaction?: Transaction): Promise<CaseEvidence>;
    /**
     * Add investigation activity to timeline
     *
     * @param caseId - Case identifier
     * @param dto - Investigation activity data
     * @param transaction - Database transaction
     * @returns Created timeline entry
     */
    addInvestigationActivity(caseId: string, dto: AddInvestigationActivityDTO, transaction?: Transaction): Promise<InvestigationTimeline>;
    /**
     * Get investigation timeline for case
     *
     * @param caseId - Case identifier
     * @returns Chronological investigation activities
     */
    getInvestigationTimeline(caseId: string): Promise<InvestigationTimeline[]>;
    /**
     * Generate investigation summary from timeline
     *
     * @param caseId - Case identifier
     * @returns Summary of investigation progress and findings
     */
    getInvestigationSummary(caseId: string): Promise<{
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
    }>;
    /**
     * Create investigation task within case
     *
     * @param caseId - Case identifier
     * @param dto - Task creation data
     * @param transaction - Database transaction
     * @returns Created task
     */
    createInvestigationTask(caseId: string, dto: CreateInvestigationTaskDTO, transaction?: Transaction): Promise<InvestigationTask>;
    /**
     * Update task status with progress tracking
     *
     * @param taskId - Task identifier
     * @param newStatus - New task status
     * @param progress - Completion percentage (0-100)
     * @param updatedBy - User updating task
     * @param transaction - Database transaction
     * @returns Updated task
     */
    updateTaskStatus(taskId: string, newStatus: TaskStatus, progress?: number, updatedBy?: string, transaction?: Transaction): Promise<InvestigationTask>;
    /**
     * Get tasks for case with filtering
     *
     * @param caseId - Case identifier
     * @param filters - Filter options (status, assignedTo, etc.)
     * @returns Filtered task list
     */
    getTasksForCase(caseId: string, filters?: {
        status?: TaskStatus;
        assignedTo?: string;
        overdue?: boolean;
    }): Promise<InvestigationTask[]>;
    /**
     * Batch update task dependencies (useful for workflow management)
     *
     * @param taskIds - Task identifiers
     * @param dependencyMap - Mapping of task IDs to their dependencies
     * @param transaction - Database transaction
     * @returns Array of updated tasks
     */
    updateTaskDependencies(taskIds: string[], dependencyMap: Record<string, string[]>, transaction?: Transaction): Promise<InvestigationTask[]>;
    /**
     * Add case note or comment with mention support
     *
     * @param caseId - Case identifier
     * @param dto - Note data
     * @param transaction - Database transaction
     * @returns Created note
     */
    addCaseNote(caseId: string, dto: AddCaseNoteDTO, transaction?: Transaction): Promise<CaseNote>;
    /**
     * Get case notes with pagination
     *
     * @param caseId - Case identifier
     * @param filters - Filter options (internal only, author, etc.)
     * @returns Paginated notes list
     */
    getCaseNotes(caseId: string, filters?: {
        internalOnly?: boolean;
        authorId?: string;
        offset?: number;
        limit?: number;
    }): Promise<{
        notes: CaseNote[];
        total: number;
    }>;
    /**
     * Edit case note with edit history tracking
     *
     * @param noteId - Note identifier
     * @param newContent - Updated note content
     * @param editedBy - User editing
     * @param transaction - Database transaction
     * @returns Updated note
     */
    editCaseNote(noteId: string, newContent: string, editedBy: string, transaction?: Transaction): Promise<CaseNote>;
    /**
     * Submit case decision with supporting documentation
     *
     * @param caseId - Case identifier
     * @param dto - Decision submission data
     * @param transaction - Database transaction
     * @returns Created decision record
     */
    submitDecision(caseId: string, dto: SubmitDecisionDTO, transaction?: Transaction): Promise<CaseDecision>;
    /**
     * Approve or reject decision
     *
     * @param decisionId - Decision identifier
     * @param approved - Approval status
     * @param approvedBy - User approving
     * @param comments - Optional approval comments
     * @param transaction - Database transaction
     * @returns Updated decision
     */
    approveDecision(decisionId: string, approved: boolean, approvedBy: string, comments?: string, transaction?: Transaction): Promise<CaseDecision>;
    /**
     * Get decision history for case
     *
     * @param caseId - Case identifier
     * @returns All decisions made on case
     */
    getDecisionHistory(caseId: string): Promise<CaseDecision[]>;
    /**
     * Escalate case to higher authority/review
     *
     * @param caseId - Case identifier
     * @param dto - Escalation data
     * @param transaction - Database transaction
     * @returns Escalation record
     */
    escalateCase(caseId: string, dto: EscalateCaseDTO, transaction?: Transaction): Promise<CaseEscalation>;
    /**
     * Resolve escalation
     *
     * @param escalationId - Escalation identifier
     * @param resolution - How escalation was resolved
     * @param resolvedBy - User resolving
     * @param transaction - Database transaction
     * @returns Updated escalation
     */
    resolveEscalation(escalationId: string, resolution: string, resolvedBy: string, transaction?: Transaction): Promise<CaseEscalation>;
    /**
     * Get escalation history for case
     *
     * @param caseId - Case identifier
     * @returns List of escalations
     */
    getEscalationHistory(caseId: string): Promise<CaseEscalation[]>;
    /**
     * Close case with comprehensive closure documentation
     *
     * @param caseId - Case identifier
     * @param dto - Case closure data
     * @param transaction - Database transaction
     * @returns Closure record
     */
    closeCase(caseId: string, dto: CloseCaseDTO, transaction?: Transaction): Promise<CaseClosure>;
    /**
     * Archive closed case
     *
     * @param caseId - Case identifier
     * @param archivedBy - User archiving
     * @param reason - Archive reason
     * @param transaction - Database transaction
     * @returns Updated case
     */
    archiveCase(caseId: string, archivedBy: string, reason?: string, transaction?: Transaction): Promise<FinancialCase>;
    /**
     * Create follow-up case from closed case
     *
     * @param caseId - Original case identifier
     * @param followUpData - Follow-up case creation data
     * @param transaction - Database transaction
     * @returns New follow-up case
     */
    createFollowUpCase(caseId: string, followUpData: CreateCaseDTO, transaction?: Transaction): Promise<FinancialCase>;
    /**
     * Calculate comprehensive case metrics
     *
     * @param filters - Optional filter criteria
     * @returns Aggregated metrics and KPIs
     */
    calculateCaseMetrics(filters?: {
        dateFrom?: Date;
        dateTo?: Date;
        department?: string;
        caseType?: string;
    }): Promise<CaseMetrics>;
    /**
     * Generate comprehensive case report
     *
     * @param caseId - Case identifier
     * @returns Complete case report with all details
     */
    generateCaseReport(caseId: string): Promise<{
        caseInfo: any;
        timeline: any;
        evidence: any;
        decisions: any;
        escalations: any;
        notes: any;
        metrics: any;
    }>;
    /**
     * Advanced search with multiple filter criteria
     *
     * @param criteria - Search and filter criteria
     * @returns Paginated search results
     */
    searchCases(criteria: CaseSearchCriteria): Promise<{
        cases: FinancialCase[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    /**
     * Apply saved filter and return matching cases
     *
     * @param filterName - Name of saved filter
     * @param page - Pagination page
     * @param limit - Results per page
     * @returns Filtered cases
     */
    applySavedFilter(filterName: string, page?: number, limit?: number): Promise<{
        cases: FinancialCase[];
        total: number;
    }>;
    /**
     * Manage case archival lifecycle
     *
     * @param filters - Archive filters (age, status, etc.)
     * @returns List of archived cases
     */
    getArchivedCases(filters?: {
        dateFrom?: Date;
        dateTo?: Date;
        department?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        cases: FinancialCase[];
        total: number;
    }>;
    /**
     * Retrieve complete audit trail for case with filter support
     *
     * @param caseId - Case identifier
     * @param filters - Optional filters (action, performedBy, date range)
     * @returns Audit trail entries in chronological order
     */
    getAuditTrail(caseId: string, filters?: {
        action?: string;
        performedBy?: string;
        dateFrom?: Date;
        dateTo?: Date;
        offset?: number;
        limit?: number;
    }): Promise<{
        entries: CaseAuditTrail[];
        total: number;
    }>;
    /**
     * Initialize SLA for new case based on priority
     */
    private _initializeSLA;
    /**
     * Create audit trail entry
     */
    private _createAuditTrail;
    /**
     * Create notification
     */
    private _createNotification;
    /**
     * Validate case status transition
     */
    private _isValidStatusTransition;
}
export declare const CASE_MANAGEMENT_EXPORTS: {
    CaseManagementWorkflowService: typeof CaseManagementWorkflowService;
    FinancialCase: typeof FinancialCase;
    CaseEvidence: typeof CaseEvidence;
    InvestigationTimeline: typeof InvestigationTimeline;
    InvestigationTask: typeof InvestigationTask;
    CaseNote: typeof CaseNote;
    CaseDecision: typeof CaseDecision;
    CaseEscalation: typeof CaseEscalation;
    CaseClosure: typeof CaseClosure;
    CaseAuditTrail: typeof CaseAuditTrail;
    CaseSLA: typeof CaseSLA;
    CaseNotification: typeof CaseNotification;
    CaseTemplate: typeof CaseTemplate;
    CaseStatus: typeof CaseStatus;
    CasePriority: typeof CasePriority;
    EvidenceType: typeof EvidenceType;
    InvestigationActivityType: typeof InvestigationActivityType;
    TaskStatus: typeof TaskStatus;
    DecisionType: typeof DecisionType;
    EscalationReason: typeof EscalationReason;
    CreateCaseDTO: any;
    AssignCaseDTO: any;
    SubmitEvidenceDTO: any;
    AddInvestigationActivityDTO: any;
    CreateInvestigationTaskDTO: any;
    AddCaseNoteDTO: any;
    SubmitDecisionDTO: any;
    EscalateCaseDTO: any;
    CloseCaseDTO: any;
    CaseSearchCriteria: any;
    SLAConfiguration: any;
    NotificationTemplate: any;
    CaseMetrics: any;
};
//# sourceMappingURL=case-management-workflow-kit.d.ts.map