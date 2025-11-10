/**
 * LOC: HCM_CASE_MGT_001
 * File: /reuse/server/human-capital/hr-case-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - moment
 *
 * DOWNSTREAM (imported by):
 *   - HR service desk implementations
 *   - Employee self-service portals
 *   - Ticketing system integrations (Jira, ServiceNow)
 *   - Knowledge base systems
 *   - Case analytics & reporting
 *   - Workflow automation engines
 */
import { Model } from 'sequelize-typescript';
import { z } from 'zod';
import { Transaction } from 'sequelize';
/**
 * Case status
 */
export declare enum CaseStatus {
    NEW = "NEW",
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    PENDING_EMPLOYEE = "PENDING_EMPLOYEE",
    PENDING_THIRD_PARTY = "PENDING_THIRD_PARTY",
    ESCALATED = "ESCALATED",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED",
    CANCELLED = "CANCELLED",
    REOPENED = "REOPENED"
}
/**
 * Case priority levels
 */
export declare enum CasePriority {
    CRITICAL = "CRITICAL",// P1 - Resolve within 4 hours
    HIGH = "HIGH",// P2 - Resolve within 8 hours
    MEDIUM = "MEDIUM",// P3 - Resolve within 24 hours
    LOW = "LOW",// P4 - Resolve within 72 hours
    PLANNING = "PLANNING"
}
/**
 * Case categories
 */
export declare enum CaseCategory {
    PAYROLL = "PAYROLL",
    BENEFITS = "BENEFITS",
    TIME_OFF = "TIME_OFF",
    PERFORMANCE = "PERFORMANCE",
    COMPENSATION = "COMPENSATION",
    ONBOARDING = "ONBOARDING",
    OFFBOARDING = "OFFBOARDING",
    TRAINING = "TRAINING",
    POLICY_QUESTION = "POLICY_QUESTION",
    COMPLAINT = "COMPLAINT",
    IT_ACCESS = "IT_ACCESS",
    FACILITIES = "FACILITIES",
    GENERAL_INQUIRY = "GENERAL_INQUIRY",
    OTHER = "OTHER"
}
/**
 * Case sub-categories
 */
export declare enum CaseSubCategory {
    PAYROLL_MISSING_PAY = "PAYROLL_MISSING_PAY",
    PAYROLL_INCORRECT_AMOUNT = "PAYROLL_INCORRECT_AMOUNT",
    PAYROLL_TAX_WITHHOLDING = "PAYROLL_TAX_WITHHOLDING",
    PAYROLL_DIRECT_DEPOSIT = "PAYROLL_DIRECT_DEPOSIT",
    BENEFITS_ENROLLMENT = "BENEFITS_ENROLLMENT",
    BENEFITS_CLAIM = "BENEFITS_CLAIM",
    BENEFITS_CHANGE = "BENEFITS_CHANGE",
    BENEFITS_TERMINATION = "BENEFITS_TERMINATION",
    TIMEOFF_REQUEST = "TIMEOFF_REQUEST",
    TIMEOFF_BALANCE = "TIMEOFF_BALANCE",
    TIMEOFF_APPROVAL = "TIMEOFF_APPROVAL",
    OTHER = "OTHER"
}
/**
 * Case channel
 */
export declare enum CaseChannel {
    EMPLOYEE_PORTAL = "EMPLOYEE_PORTAL",
    EMAIL = "EMAIL",
    PHONE = "PHONE",
    CHAT = "CHAT",
    IN_PERSON = "IN_PERSON",
    MOBILE_APP = "MOBILE_APP",
    INTEGRATION = "INTEGRATION"
}
/**
 * SLA status
 */
export declare enum SLAStatus {
    ON_TRACK = "ON_TRACK",
    AT_RISK = "AT_RISK",
    BREACHED = "BREACHED",
    PAUSED = "PAUSED",
    COMPLETED = "COMPLETED"
}
/**
 * Escalation level
 */
export declare enum EscalationLevel {
    LEVEL_0 = "LEVEL_0",// No escalation
    LEVEL_1 = "LEVEL_1",// First line manager
    LEVEL_2 = "LEVEL_2",// Department head
    LEVEL_3 = "LEVEL_3",// VP/Director
    LEVEL_4 = "LEVEL_4"
}
/**
 * Case resolution type
 */
export declare enum ResolutionType {
    RESOLVED = "RESOLVED",
    WORKAROUND = "WORKAROUND",
    CANNOT_REPRODUCE = "CANNOT_REPRODUCE",
    DUPLICATE = "DUPLICATE",
    NOT_AN_ISSUE = "NOT_AN_ISSUE",
    CANCELLED = "CANCELLED"
}
/**
 * Satisfaction rating
 */
export declare enum SatisfactionRating {
    VERY_SATISFIED = "VERY_SATISFIED",
    SATISFIED = "SATISFIED",
    NEUTRAL = "NEUTRAL",
    DISSATISFIED = "DISSATISFIED",
    VERY_DISSATISFIED = "VERY_DISSATISFIED"
}
/**
 * External ticketing system
 */
export declare enum TicketingSystem {
    JIRA = "JIRA",
    SERVICENOW = "SERVICENOW",
    ZENDESK = "ZENDESK",
    FRESHDESK = "FRESHDESK",
    SALESFORCE = "SALESFORCE",
    INTERNAL = "INTERNAL"
}
/**
 * Workflow status
 */
export declare enum WorkflowStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    SKIPPED = "SKIPPED"
}
/**
 * HR Case
 */
export interface IHRCase {
    id: string;
    caseNumber: string;
    employeeId: string;
    subject: string;
    description: string;
    category: CaseCategory;
    subCategory?: CaseSubCategory;
    priority: CasePriority;
    status: CaseStatus;
    channel: CaseChannel;
    assignedTo?: string;
    assignedTeam?: string;
    tags: string[];
    attachments: string[];
    relatedCases: string[];
    externalTicketId?: string;
    externalSystem?: TicketingSystem;
    createdAt: Date;
    updatedAt: Date;
    closedAt?: Date;
    resolvedAt?: Date;
}
/**
 * Case category configuration
 */
export interface ICaseCategory {
    id: string;
    category: CaseCategory;
    subCategories: CaseSubCategory[];
    defaultPriority: CasePriority;
    defaultAssignedTeam?: string;
    requiresApproval: boolean;
    slaTargetHours: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Case assignment
 */
export interface ICaseAssignment {
    id: string;
    caseId: string;
    assignedFrom?: string;
    assignedTo: string;
    assignedTeam?: string;
    assignmentReason: string;
    assignedAt: Date;
    acceptedAt?: Date;
    createdAt: Date;
}
/**
 * SLA configuration
 */
export interface ISLAConfiguration {
    id: string;
    category: CaseCategory;
    priority: CasePriority;
    responseTimeHours: number;
    resolutionTimeHours: number;
    escalationEnabled: boolean;
    escalationThresholdPercent: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * SLA tracking
 */
export interface ISLATracking {
    id: string;
    caseId: string;
    slaConfigId: string;
    responseDeadline: Date;
    resolutionDeadline: Date;
    firstResponseAt?: Date;
    status: SLAStatus;
    breachedAt?: Date;
    pausedAt?: Date;
    pausedDuration: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Case collaboration note
 */
export interface ICaseNote {
    id: string;
    caseId: string;
    authorId: string;
    noteType: 'PUBLIC' | 'INTERNAL' | 'SYSTEM';
    content: string;
    mentions: string[];
    attachments: string[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Knowledge base article
 */
export interface IKnowledgeBaseArticle {
    id: string;
    title: string;
    content: string;
    category: CaseCategory;
    subCategories: CaseSubCategory[];
    tags: string[];
    views: number;
    helpful: number;
    notHelpful: number;
    relatedArticles: string[];
    published: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Case escalation
 */
export interface ICaseEscalation {
    id: string;
    caseId: string;
    escalationLevel: EscalationLevel;
    escalatedFrom?: string;
    escalatedTo: string;
    reason: string;
    escalatedAt: Date;
    resolvedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Case resolution
 */
export interface ICaseResolution {
    id: string;
    caseId: string;
    resolutionType: ResolutionType;
    resolutionNotes: string;
    rootCause?: string;
    preventiveMeasures?: string;
    resolvedBy: string;
    resolvedAt: Date;
    satisfactionRating?: SatisfactionRating;
    satisfactionFeedback?: string;
    createdAt: Date;
}
/**
 * Case template
 */
export interface ICaseTemplate {
    id: string;
    templateName: string;
    category: CaseCategory;
    subCategory?: CaseSubCategory;
    defaultPriority: CasePriority;
    subjectTemplate: string;
    descriptionTemplate: string;
    workflowSteps: IWorkflowStep[];
    active: boolean;
    usageCount: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Workflow step
 */
export interface IWorkflowStep {
    stepNumber: number;
    stepName: string;
    description: string;
    assignedRole?: string;
    estimatedHours: number;
    required: boolean;
}
/**
 * Case analytics
 */
export interface ICaseAnalytics {
    period: string;
    totalCases: number;
    openCases: number;
    resolvedCases: number;
    averageResolutionTimeHours: number;
    slaComplianceRate: number;
    satisfactionScore: number;
    byCategory: Map<CaseCategory, number>;
    byPriority: Map<CasePriority, number>;
}
/**
 * External ticket integration
 */
export interface IExternalTicketIntegration {
    id: string;
    system: TicketingSystem;
    status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
    configuration: Record<string, any>;
    lastSyncAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const HRCaseSchema: any;
export declare const CaseAssignmentSchema: any;
export declare const SLAConfigurationSchema: any;
export declare const CaseNoteSchema: any;
export declare const KnowledgeBaseArticleSchema: any;
export declare const CaseEscalationSchema: any;
export declare const CaseResolutionSchema: any;
export declare const CaseTemplateSchema: any;
/**
 * HR Case Model
 */
export declare class HRCaseModel extends Model<IHRCase> {
    id: string;
    caseNumber: string;
    employeeId: string;
    subject: string;
    description: string;
    category: CaseCategory;
    subCategory?: CaseSubCategory;
    priority: CasePriority;
    status: CaseStatus;
    channel: CaseChannel;
    assignedTo?: string;
    assignedTeam?: string;
    tags: string[];
    attachments: string[];
    relatedCases: string[];
    externalTicketId?: string;
    externalSystem?: TicketingSystem;
    createdAt: Date;
    updatedAt: Date;
    closedAt?: Date;
    resolvedAt?: Date;
    deletedAt?: Date;
    notes: CaseNoteModel[];
    assignments: CaseAssignmentModel[];
    escalations: CaseEscalationModel[];
}
/**
 * Case Category Configuration Model
 */
export declare class CaseCategoryModel extends Model<ICaseCategory> {
    id: string;
    category: CaseCategory;
    subCategories: CaseSubCategory[];
    defaultPriority: CasePriority;
    defaultAssignedTeam?: string;
    requiresApproval: boolean;
    slaTargetHours: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Case Assignment Model
 */
export declare class CaseAssignmentModel extends Model<ICaseAssignment> {
    id: string;
    caseId: string;
    assignedFrom?: string;
    assignedTo: string;
    assignedTeam?: string;
    assignmentReason: string;
    assignedAt: Date;
    acceptedAt?: Date;
    createdAt: Date;
    case: HRCaseModel;
}
/**
 * SLA Configuration Model
 */
export declare class SLAConfigurationModel extends Model<ISLAConfiguration> {
    id: string;
    category: CaseCategory;
    priority: CasePriority;
    responseTimeHours: number;
    resolutionTimeHours: number;
    escalationEnabled: boolean;
    escalationThresholdPercent: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * SLA Tracking Model
 */
export declare class SLATrackingModel extends Model<ISLATracking> {
    id: string;
    caseId: string;
    slaConfigId: string;
    responseDeadline: Date;
    resolutionDeadline: Date;
    firstResponseAt?: Date;
    status: SLAStatus;
    breachedAt?: Date;
    pausedAt?: Date;
    pausedDuration: number;
    createdAt: Date;
    updatedAt: Date;
    slaConfig: SLAConfigurationModel;
}
/**
 * Case Note Model
 */
export declare class CaseNoteModel extends Model<ICaseNote> {
    id: string;
    caseId: string;
    authorId: string;
    noteType: string;
    content: string;
    mentions: string[];
    attachments: string[];
    createdAt: Date;
    updatedAt: Date;
    case: HRCaseModel;
}
/**
 * Knowledge Base Article Model
 */
export declare class KnowledgeBaseArticleModel extends Model<IKnowledgeBaseArticle> {
    id: string;
    title: string;
    content: string;
    category: CaseCategory;
    subCategories: CaseSubCategory[];
    tags: string[];
    views: number;
    helpful: number;
    notHelpful: number;
    relatedArticles: string[];
    published: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Case Escalation Model
 */
export declare class CaseEscalationModel extends Model<ICaseEscalation> {
    id: string;
    caseId: string;
    escalationLevel: EscalationLevel;
    escalatedFrom?: string;
    escalatedTo: string;
    reason: string;
    escalatedAt: Date;
    resolvedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    case: HRCaseModel;
}
/**
 * Case Resolution Model
 */
export declare class CaseResolutionModel extends Model<ICaseResolution> {
    id: string;
    caseId: string;
    resolutionType: ResolutionType;
    resolutionNotes: string;
    rootCause?: string;
    preventiveMeasures?: string;
    resolvedBy: string;
    resolvedAt: Date;
    satisfactionRating?: SatisfactionRating;
    satisfactionFeedback?: string;
    createdAt: Date;
}
/**
 * Case Template Model
 */
export declare class CaseTemplateModel extends Model<ICaseTemplate> {
    id: string;
    templateName: string;
    category: CaseCategory;
    subCategory?: CaseSubCategory;
    defaultPriority: CasePriority;
    subjectTemplate: string;
    descriptionTemplate: string;
    workflowSteps: IWorkflowStep[];
    active: boolean;
    usageCount: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * External Ticket Integration Model
 */
export declare class ExternalTicketIntegrationModel extends Model<IExternalTicketIntegration> {
    id: string;
    system: TicketingSystem;
    status: string;
    configuration: Record<string, any>;
    lastSyncAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * HR Case Creation & Tracking Functions
 */
/**
 * Create new HR case
 * @param caseData - Case data
 * @param transaction - Optional database transaction
 * @returns Created case
 */
export declare function createHRCase(caseData: z.infer<typeof HRCaseSchema>, transaction?: Transaction): Promise<HRCaseModel>;
/**
 * Update case status
 * @param caseId - Case ID
 * @param newStatus - New status
 * @param updatedBy - User updating the status
 * @param transaction - Optional database transaction
 * @returns Updated case
 */
export declare function updateCaseStatus(caseId: string, newStatus: CaseStatus, updatedBy: string, transaction?: Transaction): Promise<HRCaseModel>;
/**
 * Get case details with all related data
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns Case with details
 */
export declare function getCaseDetails(caseId: string, transaction?: Transaction): Promise<HRCaseModel>;
/**
 * List all cases for employee
 * @param employeeId - Employee ID
 * @param options - Query options
 * @param transaction - Optional database transaction
 * @returns List of cases
 */
export declare function listEmployeeCases(employeeId: string, options?: {
    status?: CaseStatus;
    category?: CaseCategory;
    limit?: number;
    offset?: number;
    transaction?: Transaction;
}): Promise<{
    cases: HRCaseModel[];
    total: number;
}>;
/**
 * Case Categorization & Prioritization Functions
 */
/**
 * Categorize case by type using ML/rules
 * @param caseId - Case ID
 * @param suggestedCategory - Suggested category
 * @param suggestedSubCategory - Suggested sub-category
 * @param transaction - Optional database transaction
 * @returns Categorized case
 */
export declare function categorizeCaseByType(caseId: string, suggestedCategory: CaseCategory, suggestedSubCategory?: CaseSubCategory, transaction?: Transaction): Promise<HRCaseModel>;
/**
 * Set case priority based on urgency and impact
 * @param caseId - Case ID
 * @param priority - Priority level
 * @param transaction - Optional database transaction
 * @returns Updated case
 */
export declare function setPriority(caseId: string, priority: CasePriority, transaction?: Transaction): Promise<HRCaseModel>;
/**
 * Auto-categorize case using ML
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns Categorized case with confidence score
 */
export declare function autoCategorizeCaseUsingML(caseId: string, transaction?: Transaction): Promise<{
    case: HRCaseModel;
    confidence: number;
}>;
/**
 * Case Assignment & Routing Functions
 */
/**
 * Assign case to agent
 * @param assignmentData - Assignment data
 * @param transaction - Optional database transaction
 * @returns Assignment record
 */
export declare function assignCaseToAgent(assignmentData: z.infer<typeof CaseAssignmentSchema>, transaction?: Transaction): Promise<CaseAssignmentModel>;
/**
 * Route case by skill matching
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns Routing recommendation
 */
export declare function routeCaseBySkill(caseId: string, transaction?: Transaction): Promise<{
    recommendedAgent: string;
    recommendedTeam: string;
    matchScore: number;
}>;
/**
 * Reassign case to different agent
 * @param caseId - Case ID
 * @param newAssignee - New assignee
 * @param reason - Reassignment reason
 * @param transaction - Optional database transaction
 * @returns Reassignment record
 */
export declare function reassignCase(caseId: string, newAssignee: string, reason: string, transaction?: Transaction): Promise<CaseAssignmentModel>;
/**
 * Get agent workload for load balancing
 * @param agentId - Agent ID
 * @param transaction - Optional database transaction
 * @returns Workload metrics
 */
export declare function getAgentWorkload(agentId: string, transaction?: Transaction): Promise<{
    activeCases: number;
    criticalCases: number;
    averageResolutionTime: number;
    capacity: number;
}>;
/**
 * Service Level Agreements (SLA) Functions
 */
/**
 * Define SLA for case type
 * @param slaData - SLA configuration data
 * @param transaction - Optional database transaction
 * @returns Created SLA configuration
 */
export declare function defineSLAForCaseType(slaData: z.infer<typeof SLAConfigurationSchema>, transaction?: Transaction): Promise<SLAConfigurationModel>;
/**
 * Track SLA compliance for case
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns SLA tracking with current status
 */
export declare function trackSLACompliance(caseId: string, transaction?: Transaction): Promise<SLATrackingModel>;
/**
 * Alert when SLA breach is imminent
 * @param hoursBeforeBreach - Hours before breach to alert
 * @param transaction - Optional database transaction
 * @returns List of cases at risk
 */
export declare function alertSLABreach(hoursBeforeBreach: number, transaction?: Transaction): Promise<SLATrackingModel[]>;
/**
 * Case Collaboration & Notes Functions
 */
/**
 * Add note to case
 * @param noteData - Note data
 * @param transaction - Optional database transaction
 * @returns Created note
 */
export declare function addCaseNote(noteData: z.infer<typeof CaseNoteSchema>, transaction?: Transaction): Promise<CaseNoteModel>;
/**
 * Tag collaborators in case notes
 * @param noteId - Note ID
 * @param userIds - Array of user IDs to tag
 * @param transaction - Optional database transaction
 * @returns Updated note
 */
export declare function tagCollaborators(noteId: string, userIds: string[], transaction?: Transaction): Promise<CaseNoteModel>;
/**
 * Get case history with all notes
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns Case notes in chronological order
 */
export declare function getCaseHistory(caseId: string, transaction?: Transaction): Promise<CaseNoteModel[]>;
/**
 * Knowledge Base Integration Functions
 */
/**
 * Search knowledge base for solutions
 * @param searchQuery - Search query
 * @param category - Optional category filter
 * @param transaction - Optional database transaction
 * @returns Matching articles
 */
export declare function searchKnowledgeBase(searchQuery: string, category?: CaseCategory, transaction?: Transaction): Promise<KnowledgeBaseArticleModel[]>;
/**
 * Link KB article to case
 * @param caseId - Case ID
 * @param articleId - Article ID
 * @param transaction - Optional database transaction
 * @returns Confirmation
 */
export declare function linkArticleToCase(caseId: string, articleId: string, transaction?: Transaction): Promise<{
    linked: boolean;
}>;
/**
 * Suggest relevant KB articles for case
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns Suggested articles
 */
export declare function suggestKBArticles(caseId: string, transaction?: Transaction): Promise<KnowledgeBaseArticleModel[]>;
/**
 * Case Escalation Management Functions
 */
/**
 * Escalate case to higher level
 * @param escalationData - Escalation data
 * @param transaction - Optional database transaction
 * @returns Escalation record
 */
export declare function escalateCase(escalationData: z.infer<typeof CaseEscalationSchema>, transaction?: Transaction): Promise<CaseEscalationModel>;
/**
 * Track escalation path for case
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns Escalation history
 */
export declare function trackEscalationPath(caseId: string, transaction?: Transaction): Promise<CaseEscalationModel[]>;
/**
 * Notify stakeholders of escalation
 * @param escalationId - Escalation ID
 * @param transaction - Optional database transaction
 * @returns Notification result
 */
export declare function notifyEscalationStakeholders(escalationId: string, transaction?: Transaction): Promise<{
    notified: boolean;
    recipientCount: number;
}>;
/**
 * De-escalate case back to normal flow
 * @param caseId - Case ID
 * @param reason - De-escalation reason
 * @param transaction - Optional database transaction
 * @returns Updated case
 */
export declare function deEscalateCase(caseId: string, reason: string, transaction?: Transaction): Promise<HRCaseModel>;
/**
 * Case Resolution & Closure Functions
 */
/**
 * Resolve case with solution
 * @param resolutionData - Resolution data
 * @param transaction - Optional database transaction
 * @returns Resolution record
 */
export declare function resolveCaseWithSolution(resolutionData: z.infer<typeof CaseResolutionSchema>, transaction?: Transaction): Promise<CaseResolutionModel>;
/**
 * Close case after resolution
 * @param caseId - Case ID
 * @param closedBy - User closing the case
 * @param transaction - Optional database transaction
 * @returns Closed case
 */
export declare function closeCase(caseId: string, closedBy: string, transaction?: Transaction): Promise<HRCaseModel>;
/**
 * Request employee feedback on resolution
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns Feedback request result
 */
export declare function requestEmployeeFeedback(caseId: string, transaction?: Transaction): Promise<{
    requestSent: boolean;
    surveyUrl?: string;
}>;
/**
 * Track case resolution time metrics
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns Resolution metrics
 */
export declare function trackResolutionTime(caseId: string, transaction?: Transaction): Promise<{
    totalTimeHours: number;
    responseTimeHours: number;
    resolutionTimeHours: number;
    slaCompliant: boolean;
}>;
/**
 * Employee Portal Integration Functions
 */
/**
 * Submit case from employee portal
 * @param caseData - Case data from portal
 * @param transaction - Optional database transaction
 * @returns Created case
 */
export declare function submitCaseFromPortal(caseData: z.infer<typeof HRCaseSchema>, transaction?: Transaction): Promise<HRCaseModel>;
/**
 * Get case status for employee
 * @param caseId - Case ID
 * @param employeeId - Employee ID
 * @param transaction - Optional database transaction
 * @returns Case status information
 */
export declare function getCaseStatusForEmployee(caseId: string, employeeId: string, transaction?: Transaction): Promise<{
    caseNumber: string;
    status: CaseStatus;
    lastUpdate: Date;
    assignedTo?: string;
    notes: CaseNoteModel[];
}>;
/**
 * Send case update notification to employee
 * @param caseId - Case ID
 * @param message - Update message
 * @param transaction - Optional database transaction
 * @returns Notification result
 */
export declare function sendCaseUpdateNotification(caseId: string, message: string, transaction?: Transaction): Promise<{
    sent: boolean;
}>;
/**
 * Case Templates & Workflows Functions
 */
/**
 * Create reusable case template
 * @param templateData - Template data
 * @param transaction - Optional database transaction
 * @returns Created template
 */
export declare function createCaseTemplate(templateData: z.infer<typeof CaseTemplateSchema>, transaction?: Transaction): Promise<CaseTemplateModel>;
/**
 * Apply workflow template to case
 * @param caseId - Case ID
 * @param templateId - Template ID
 * @param transaction - Optional database transaction
 * @returns Case with applied workflow
 */
export declare function applyCaseWorkflow(caseId: string, templateId: string, transaction?: Transaction): Promise<HRCaseModel>;
/**
 * Track workflow progress for case
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns Workflow progress
 */
export declare function trackWorkflowProgress(caseId: string, transaction?: Transaction): Promise<{
    totalSteps: number;
    completedSteps: number;
    currentStep: number;
    percentComplete: number;
}>;
/**
 * Case Analytics & Reporting Functions
 */
/**
 * Generate case analytics for period
 * @param startDate - Start date
 * @param endDate - End date
 * @param transaction - Optional database transaction
 * @returns Analytics data
 */
export declare function generateCaseAnalytics(startDate: Date, endDate: Date, transaction?: Transaction): Promise<ICaseAnalytics>;
/**
 * Track case metrics over time
 * @param metric - Metric to track
 * @param days - Number of days to track
 * @param transaction - Optional database transaction
 * @returns Metric data
 */
export declare function trackCaseMetrics(metric: 'VOLUME' | 'RESOLUTION_TIME' | 'SLA_COMPLIANCE', days: number, transaction?: Transaction): Promise<Array<{
    date: string;
    value: number;
}>>;
/**
 * Export case reports
 * @param startDate - Start date
 * @param endDate - End date
 * @param format - Export format
 * @param transaction - Optional database transaction
 * @returns Export result
 */
export declare function exportCaseReports(startDate: Date, endDate: Date, format: 'PDF' | 'CSV' | 'EXCEL', transaction?: Transaction): Promise<{
    exported: boolean;
    url: string;
}>;
/**
 * Integration with Ticketing Systems Functions
 */
/**
 * Sync with external ticketing system
 * @param system - Ticketing system
 * @param transaction - Optional database transaction
 * @returns Sync result
 */
export declare function syncWithExternalTicketingSystem(system: TicketingSystem, transaction?: Transaction): Promise<{
    synced: boolean;
    recordsSynced: number;
}>;
/**
 * Create Jira ticket from case
 * @param caseId - Case ID
 * @param projectKey - Jira project key
 * @param transaction - Optional database transaction
 * @returns Jira ticket info
 */
export declare function createJiraTicketFromCase(caseId: string, projectKey: string, transaction?: Transaction): Promise<{
    ticketId: string;
    ticketUrl: string;
}>;
/**
 * Update case from external system
 * @param caseId - Case ID
 * @param externalData - Data from external system
 * @param transaction - Optional database transaction
 * @returns Updated case
 */
export declare function updateCaseFromExternalSystem(caseId: string, externalData: {
    status?: string;
    assignee?: string;
    notes?: string;
}, transaction?: Transaction): Promise<HRCaseModel>;
/**
 * HR Case Management Service
 * Provides enterprise-grade HR case and ticket management
 */
export declare class HRCaseManagementService {
    createHRCase(data: z.infer<typeof HRCaseSchema>, transaction?: Transaction): Promise<HRCaseModel>;
    updateCaseStatus(caseId: string, newStatus: CaseStatus, updatedBy: string, transaction?: Transaction): Promise<HRCaseModel>;
    getCaseDetails(caseId: string, transaction?: Transaction): Promise<HRCaseModel>;
    listEmployeeCases(employeeId: string, options?: any): Promise<{
        cases: HRCaseModel[];
        total: number;
    }>;
    categorizeCaseByType(caseId: string, category: CaseCategory, subCategory?: CaseSubCategory, transaction?: Transaction): Promise<HRCaseModel>;
    setPriority(caseId: string, priority: CasePriority, transaction?: Transaction): Promise<HRCaseModel>;
    autoCategorizeCaseUsingML(caseId: string, transaction?: Transaction): Promise<{
        case: HRCaseModel;
        confidence: number;
    }>;
    assignCaseToAgent(data: z.infer<typeof CaseAssignmentSchema>, transaction?: Transaction): Promise<CaseAssignmentModel>;
    routeCaseBySkill(caseId: string, transaction?: Transaction): Promise<{
        recommendedAgent: string;
        recommendedTeam: string;
        matchScore: number;
    }>;
    reassignCase(caseId: string, newAssignee: string, reason: string, transaction?: Transaction): Promise<CaseAssignmentModel>;
    getAgentWorkload(agentId: string, transaction?: Transaction): Promise<{
        activeCases: number;
        criticalCases: number;
        averageResolutionTime: number;
        capacity: number;
    }>;
    defineSLAForCaseType(data: z.infer<typeof SLAConfigurationSchema>, transaction?: Transaction): Promise<SLAConfigurationModel>;
    trackSLACompliance(caseId: string, transaction?: Transaction): Promise<SLATrackingModel>;
    alertSLABreach(hoursBeforeBreach: number, transaction?: Transaction): Promise<SLATrackingModel[]>;
    addCaseNote(data: z.infer<typeof CaseNoteSchema>, transaction?: Transaction): Promise<CaseNoteModel>;
    tagCollaborators(noteId: string, userIds: string[], transaction?: Transaction): Promise<CaseNoteModel>;
    getCaseHistory(caseId: string, transaction?: Transaction): Promise<CaseNoteModel[]>;
    searchKnowledgeBase(query: string, category?: CaseCategory, transaction?: Transaction): Promise<KnowledgeBaseArticleModel[]>;
    linkArticleToCase(caseId: string, articleId: string, transaction?: Transaction): Promise<{
        linked: boolean;
    }>;
    suggestKBArticles(caseId: string, transaction?: Transaction): Promise<KnowledgeBaseArticleModel[]>;
    escalateCase(data: z.infer<typeof CaseEscalationSchema>, transaction?: Transaction): Promise<CaseEscalationModel>;
    trackEscalationPath(caseId: string, transaction?: Transaction): Promise<CaseEscalationModel[]>;
    notifyEscalationStakeholders(escalationId: string, transaction?: Transaction): Promise<{
        notified: boolean;
        recipientCount: number;
    }>;
    deEscalateCase(caseId: string, reason: string, transaction?: Transaction): Promise<HRCaseModel>;
    resolveCaseWithSolution(data: z.infer<typeof CaseResolutionSchema>, transaction?: Transaction): Promise<CaseResolutionModel>;
    closeCase(caseId: string, closedBy: string, transaction?: Transaction): Promise<HRCaseModel>;
    requestEmployeeFeedback(caseId: string, transaction?: Transaction): Promise<{
        requestSent: boolean;
        surveyUrl?: string;
    }>;
    trackResolutionTime(caseId: string, transaction?: Transaction): Promise<{
        totalTimeHours: number;
        responseTimeHours: number;
        resolutionTimeHours: number;
        slaCompliant: boolean;
    }>;
    submitCaseFromPortal(data: z.infer<typeof HRCaseSchema>, transaction?: Transaction): Promise<HRCaseModel>;
    getCaseStatusForEmployee(caseId: string, employeeId: string, transaction?: Transaction): Promise<{
        caseNumber: string;
        status: CaseStatus;
        lastUpdate: Date;
        assignedTo?: string;
        notes: CaseNoteModel[];
    }>;
    sendCaseUpdateNotification(caseId: string, message: string, transaction?: Transaction): Promise<{
        sent: boolean;
    }>;
    createCaseTemplate(data: z.infer<typeof CaseTemplateSchema>, transaction?: Transaction): Promise<CaseTemplateModel>;
    applyCaseWorkflow(caseId: string, templateId: string, transaction?: Transaction): Promise<HRCaseModel>;
    trackWorkflowProgress(caseId: string, transaction?: Transaction): Promise<{
        totalSteps: number;
        completedSteps: number;
        currentStep: number;
        percentComplete: number;
    }>;
    generateCaseAnalytics(startDate: Date, endDate: Date, transaction?: Transaction): Promise<ICaseAnalytics>;
    trackCaseMetrics(metric: 'VOLUME' | 'RESOLUTION_TIME' | 'SLA_COMPLIANCE', days: number, transaction?: Transaction): Promise<{
        date: string;
        value: number;
    }[]>;
    exportCaseReports(startDate: Date, endDate: Date, format: 'PDF' | 'CSV' | 'EXCEL', transaction?: Transaction): Promise<{
        exported: boolean;
        url: string;
    }>;
    syncWithExternalTicketingSystem(system: TicketingSystem, transaction?: Transaction): Promise<{
        synced: boolean;
        recordsSynced: number;
    }>;
    createJiraTicketFromCase(caseId: string, projectKey: string, transaction?: Transaction): Promise<{
        ticketId: string;
        ticketUrl: string;
    }>;
    updateCaseFromExternalSystem(caseId: string, externalData: any, transaction?: Transaction): Promise<HRCaseModel>;
}
//# sourceMappingURL=hr-case-management-kit.d.ts.map