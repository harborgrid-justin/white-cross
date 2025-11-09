/**
 * Alert Management Investigation Kit
 * Enterprise-grade financial alert generation, triage, investigation, and resolution system
 * Supports: AML/CFT, fraud detection, transaction monitoring, and compliance investigations
 *
 * @packageDocumentation
 * @module alert-management-investigation-kit
 * @requires nestjs/common
 * @requires sequelize
 * @requires sequelize-typescript
 */
import { Transaction } from 'sequelize';
/**
 * Alert severity levels with escalation implications
 */
declare enum AlertSeverity {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}
/**
 * Alert status throughout lifecycle
 */
declare enum AlertStatus {
    GENERATED = "GENERATED",
    ASSIGNED = "ASSIGNED",
    INVESTIGATING = "INVESTIGATING",
    ESCALATED = "ESCALATED",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED"
}
/**
 * Investigation workflow states
 */
declare enum InvestigationPhase {
    TRIAGE = "TRIAGE",
    EVIDENCE_GATHERING = "EVIDENCE_GATHERING",
    ANALYSIS = "ANALYSIS",
    DECISION_PENDING = "DECISION_PENDING",
    DECISION_MADE = "DECISION_MADE",
    ESCALATION = "ESCALATION",
    RESOLVED = "RESOLVED"
}
/**
 * Investigation decision outcomes
 */
declare enum InvestigationDisposition {
    TRUE_POSITIVE = "TRUE_POSITIVE",
    FALSE_POSITIVE = "FALSE_POSITIVE",
    INCONCLUSIVE = "INCONCLUSIVE",
    REQUIRES_ESCALATION = "REQUIRES_ESCALATION"
}
/**
 * Routing strategies for alert assignment
 */
declare enum RoutingStrategy {
    SKILL_BASED = "SKILL_BASED",
    ROUND_ROBIN = "ROUND_ROBIN",
    WORKLOAD_BALANCED = "WORKLOAD_BALANCED",
    PRIORITY_ESCALATION = "PRIORITY_ESCALATION"
}
/**
 * SLA event types for tracking
 */
declare enum SLAEventType {
    ALERT_GENERATION = "ALERT_GENERATION",
    ALERT_ASSIGNMENT = "ALERT_ASSIGNMENT",
    INVESTIGATION_START = "INVESTIGATION_START",
    FIRST_RESPONSE = "FIRST_RESPONSE",
    ESCALATION = "ESCALATION",
    RESOLUTION = "RESOLUTION"
}
/**
 * Alert generation request with comprehensive metadata
 */
interface AlertGenerationPayload {
    ruleId: string;
    ruleName: string;
    entityId: string;
    entityType: 'CUSTOMER' | 'ACCOUNT' | 'TRANSACTION' | 'WIRE_TRANSFER';
    severity: AlertSeverity;
    category: 'AML' | 'FRAUD' | 'COMPLIANCE' | 'OPERATIONAL' | 'RISK';
    description: string;
    riskScore: number;
    matchedPatterns: string[];
    sourceSystem: string;
    timestamp: Date;
    metadata?: Record<string, unknown>;
    tags?: string[];
}
/**
 * Prioritization factors for alert ranking
 */
interface PrioritizationFactors {
    baseScore: number;
    severityMultiplier: number;
    riskAdjustment: number;
    historicalContext: number;
    timeUrgency: number;
    complianceRequirement: number;
}
/**
 * Investigation evidence item
 */
interface EvidenceItem {
    id: string;
    type: 'DOCUMENT' | 'TRANSACTION' | 'COMMUNICATION' | 'MEDIA' | 'REFERENCE';
    source: string;
    sourceUrl?: string;
    description: string;
    confidence: number;
    linkedAlertIds?: string[];
    addedAt: Date;
    addedBy: string;
}
/**
 * Investigator skill profile
 */
interface InvestigatorProfile {
    investigatorId: string;
    skills: string[];
    currentWorkload: number;
    maxCapacity: number;
    specializations: string[];
    performanceScore: number;
}
/**
 * SLA configuration per alert type
 */
interface SLAConfiguration {
    alertCategory: string;
    alertSeverity: AlertSeverity;
    responseTimeMinutes: number;
    investigationTimeMinutes: number;
    resolutionTimeMinutes: number;
    escalationTrigger: number;
}
/**
 * Alert template for consistent generation
 */
interface AlertTemplate {
    templateId: string;
    name: string;
    description: string;
    ruleId: string;
    category: string;
    defaultSeverity: AlertSeverity;
    expectedDuration: number;
    requiredFields: string[];
    escalationRules: Record<string, unknown>;
}
/**
 * Collaborative investigation comment
 */
interface InvestigationComment {
    id: string;
    investigationId: string;
    author: string;
    authorRole: string;
    content: string;
    attachments?: string[];
    mentions?: string[];
    createdAt: Date;
    edited: boolean;
    edits?: Array<{
        at: Date;
        by: string;
    }>;
}
/**
 * Investigation decision record
 */
interface InvestigationDecision {
    investigationId: string;
    disposition: InvestigationDisposition;
    decidedBy: string;
    decidedAt: Date;
    justification: string;
    supportingEvidence: string[];
    reviewedBy?: string;
    reviewedAt?: Date;
    confidenceLevel: number;
}
/**
 * Alert analytics metrics
 */
interface AlertAnalyticsMetrics {
    totalAlerts: number;
    alertsByStatus: Record<string, number>;
    alertsBySeverity: Record<string, number>;
    averageResolutionTime: number;
    falsePositiveRate: number;
    escalationRate: number;
    complianceViolations: number;
    investigatorProductivity: Record<string, number>;
}
/**
 * Investigator performance metrics
 */
interface InvestigatorMetrics {
    investigatorId: string;
    totalInvestigations: number;
    averageResolutionTime: number;
    truePositiveRate: number;
    falsePositiveDetectionRate: number;
    escalationRate: number;
    slaComplianceRate: number;
    skillDevelopment: Record<string, number>;
}
/**
 * Generate a new alert from rule match with comprehensive validation
 * @param payload Alert generation payload with rule and entity details
 * @param transaction Optional database transaction
 * @returns Generated alert ID and metadata
 * @throws BadRequestException if validation fails
 */
export declare function generateAlertFromRuleMatch(payload: AlertGenerationPayload, transaction?: Transaction): Promise<{
    alertId: string;
    timestamp: Date;
    initialSeverity: AlertSeverity;
    assignedPriority: number;
}>;
/**
 * Batch generate alerts from multiple rule matches efficiently
 * @param payloads Array of alert generation payloads
 * @param transaction Optional database transaction
 * @returns Array of generated alert IDs with metadata
 */
export declare function batchGenerateAlerts(payloads: AlertGenerationPayload[], transaction?: Transaction): Promise<Array<{
    alertId: string;
    timestamp: Date;
}>>;
/**
 * Deduplicate similar alerts within time window to prevent alert fatigue
 * @param alertId Primary alert ID
 * @param timeWindowMinutes Time window for deduplication
 * @param similarityThreshold Similarity score threshold (0-100)
 * @returns Deduplication result with merged alert ID
 */
export declare function deduplicateAlert(alertId: string, timeWindowMinutes?: number, similarityThreshold?: number): Promise<{
    primaryAlertId: string;
    mergedAlertIds: string[];
    deduplicationScore: number;
}>;
/**
 * Enrich alert with additional context from external sources
 * @param alertId Alert ID to enrich
 * @param contextSources Array of data sources for enrichment
 * @returns Enriched alert metadata and context
 */
export declare function enrichAlertContext(alertId: string, contextSources: string[]): Promise<{
    alertId: string;
    enrichmentCount: number;
    addedFields: Record<string, unknown>;
    riskAdjustment: number;
}>;
/**
 * Suppress alerts based on business rules or management decisions
 * @param alertId Alert ID to suppress
 * @param suppressionReason Reason for suppression
 * @param expiryMinutes Optional expiry time for suppression
 * @returns Suppression confirmation with ID
 */
export declare function suppressAlert(alertId: string, suppressionReason: string, expiryMinutes?: number): Promise<{
    alertId: string;
    suppressionId: string;
    expiresAt?: Date;
    approvalRequired: boolean;
}>;
/**
 * Calculate comprehensive alert priority score with multi-factor weighting
 * @param payload Alert generation payload
 * @returns Calculated priority score (0-100)
 */
export declare function calculateBaseAlertPriority(payload: AlertGenerationPayload): number;
/**
 * Re-prioritize alert based on new evidence or investigator feedback
 * @param alertId Alert ID to reprioritize
 * @param factors Prioritization factors for recalculation
 * @returns Updated priority score and rationale
 */
export declare function reprioritizeAlert(alertId: string, factors: Partial<PrioritizationFactors>): Promise<{
    alertId: string;
    previousPriority: number;
    newPriority: number;
    rationale: string;
}>;
/**
 * Apply dynamic priority adjustment based on SLA urgency
 * @param alertId Alert ID
 * @param slaConfig Current SLA configuration
 * @returns Adjusted priority with urgency multiplier
 */
export declare function adjustPriorityBySLAUrgency(alertId: string, slaConfig: SLAConfiguration): Promise<{
    alertId: string;
    baseScore: number;
    urgencyMultiplier: number;
    finalScore: number;
    timeRemainingMinutes: number;
}>;
/**
 * Rank alerts for queue display with smart sorting algorithm
 * @param alertIds Array of alert IDs to rank
 * @param sortCriteria Ranking criteria (priority, urgency, age)
 * @returns Ranked alert list with positions and reasoning
 */
export declare function rankAlertsForInvestigationQueue(alertIds: string[], sortCriteria: 'PRIORITY' | 'URGENCY' | 'AGE' | 'MIXED'): Promise<{
    rankedAlerts: Array<{
        position: number;
        alertId: string;
        score: number;
    }>;
    criteria: string;
}>;
/**
 * Route alert to appropriate investigator using skill-based matching
 * @param alertId Alert ID to route
 * @param strategy Routing strategy to apply
 * @param investigatorProfiles Available investigator profiles
 * @returns Routing decision with selected investigator
 */
export declare function routeAlertToInvestigator(alertId: string, strategy: RoutingStrategy, investigatorProfiles: InvestigatorProfile[]): Promise<{
    alertId: string;
    assignedInvestigatorId: string;
    routingStrategy: string;
    matchScore: number;
}>;
/**
 * Determine optimal team for investigation based on complexity and skills
 * @param alertId Alert ID
 * @param requiredSkills Array of required skill IDs
 * @param teamSize Desired team size
 * @returns Team composition with lead and support investigators
 */
export declare function formInvestigationTeam(alertId: string, requiredSkills: string[], teamSize?: number): Promise<{
    alertId: string;
    investigationTeamId: string;
    leadInvestigator: string;
    supportTeam: string[];
    totalMembers: number;
}>;
/**
 * Reassign alert to different investigator with audit trail
 * @param alertId Alert ID
 * @param newInvestigatorId Investigator ID to reassign to
 * @param reason Reason for reassignment
 * @returns Reassignment confirmation with audit record
 */
export declare function reassignAlert(alertId: string, newInvestigatorId: string, reason: string): Promise<{
    alertId: string;
    previousInvestigator: string;
    newInvestigator: string;
    reassignmentReason: string;
    reassignmentId: string;
    timestamp: Date;
}>;
/**
 * Distribute high-volume alerts across team using load balancing
 * @param alertIds Array of alert IDs to distribute
 * @param investigatorCapacities Investigator capacity mapping
 * @returns Distribution plan with assignments
 */
export declare function distributeLargeAlertVolume(alertIds: string[], investigatorCapacities: Record<string, number>): Promise<{
    distributionId: string;
    assignments: Array<{
        investigatorId: string;
        alertCount: number;
        alerts: string[];
    }>;
    totalDistributed: number;
    balanceScore: number;
}>;
/**
 * Initiate investigation workflow with phase management
 * @param alertId Alert ID to investigate
 * @param initialPhase Starting investigation phase
 * @param investigatorId Assigned investigator
 * @returns Investigation record with tracking ID
 */
export declare function initiateInvestigation(alertId: string, initialPhase: InvestigationPhase | undefined, investigatorId: string): Promise<{
    investigationId: string;
    alertId: string;
    investigatorId: string;
    currentPhase: InvestigationPhase;
    createdAt: Date;
    statusHistory: Array<{
        phase: InvestigationPhase;
        timestamp: Date;
    }>;
}>;
/**
 * Transition investigation to next phase with validation
 * @param investigationId Investigation ID
 * @param nextPhase Target investigation phase
 * @param transitionNotes Notes for phase transition
 * @returns Phase transition confirmation with timestamp
 */
export declare function transitionInvestigationPhase(investigationId: string, nextPhase: InvestigationPhase, transitionNotes: string): Promise<{
    investigationId: string;
    previousPhase: InvestigationPhase;
    newPhase: InvestigationPhase;
    transitionTime: Date;
    validationErrors: string[];
}>;
/**
 * Update investigation progress with time tracking and milestones
 * @param investigationId Investigation ID
 * @param progressUpdate Progress update with percentage
 * @param completedMilestones Completed investigation milestones
 * @returns Updated investigation progress record
 */
export declare function updateInvestigationProgress(investigationId: string, progressUpdate: {
    percentComplete: number;
    summary: string;
}, completedMilestones: string[]): Promise<{
    investigationId: string;
    percentComplete: number;
    milestone: string;
    estimatedCompletionTime: Date;
    velocity: number;
}>;
/**
 * Retrieve complete investigation history with all state changes
 * @param investigationId Investigation ID
 * @param includeComments Include collaborative comments
 * @returns Complete investigation timeline and history
 */
export declare function getInvestigationHistory(investigationId: string, includeComments?: boolean): Promise<{
    investigationId: string;
    timeline: Array<{
        timestamp: Date;
        event: string;
        actor: string;
        details: Record<string, unknown>;
    }>;
    commentCount: number;
    lastUpdated: Date;
    totalDuration: number;
}>;
/**
 * Assign alert to investigator with workload balancing
 * @param alertId Alert ID to assign
 * @param investigatorId Target investigator
 * @param estimatedDuration Estimated investigation duration in hours
 * @returns Assignment confirmation with SLA deadline
 */
export declare function assignAlertToInvestigator(alertId: string, investigatorId: string, estimatedDuration: number): Promise<{
    assignmentId: string;
    alertId: string;
    investigatorId: string;
    assignedAt: Date;
    slaDeadline: Date;
    estimatedDuration: number;
}>;
/**
 * Bulk assign alerts to team with capacity consideration
 * @param alertIds Array of alert IDs
 * @param teamId Team ID for bulk assignment
 * @returns Bulk assignment result with individual statuses
 */
export declare function bulkAssignAlertsToTeam(alertIds: string[], teamId: string): Promise<{
    bulkAssignmentId: string;
    totalRequested: number;
    successfulAssignments: number;
    failedAssignments: number;
    assignmentDetails: Array<{
        alertId: string;
        assigned: boolean;
        investigatorId?: string;
    }>;
}>;
/**
 * Unassign alert with reason tracking for reassignment
 * @param assignmentId Assignment ID to cancel
 * @param unassignmentReason Reason for unassignment
 * @returns Unassignment confirmation
 */
export declare function unassignAlert(assignmentId: string, unassignmentReason: string): Promise<{
    assignmentId: string;
    unassignedAt: Date;
    alertAvailable: boolean;
    reRoutingRequired: boolean;
    reason: string;
}>;
/**
 * Add evidence item to investigation with validation and linking
 * @param investigationId Investigation ID
 * @param evidenceItem Evidence to add
 * @returns Added evidence confirmation with ID and chain of custody
 */
export declare function addEvidenceToInvestigation(investigationId: string, evidenceItem: Omit<EvidenceItem, 'id' | 'addedAt'>): Promise<{
    evidenceId: string;
    investigationId: string;
    addedAt: Date;
    chainOfCustodyId: string;
    validationStatus: 'VALID' | 'REVIEW_REQUIRED';
}>;
/**
 * Link related evidence across investigations for pattern detection
 * @param primaryEvidenceId Primary evidence item ID
 * @param linkedEvidenceIds Array of evidence IDs to link
 * @param relationshipType Type of evidence relationship
 * @returns Link confirmation with correlation details
 */
export declare function linkRelatedEvidence(primaryEvidenceId: string, linkedEvidenceIds: string[], relationshipType: 'SUPPORTS' | 'CONTRADICTS' | 'CONTEXT' | 'CORROBORATION'): Promise<{
    primaryEvidenceId: string;
    linkedCount: number;
    relationshipType: string;
    correlationStrength: number;
    linkId: string;
}>;
/**
 * Retrieve evidence summary with audit trail and source validation
 * @param investigationId Investigation ID
 * @param filterByType Optional evidence type filter
 * @returns Evidence summary with metadata and audit trail
 */
export declare function getInvestigationEvidenceSummary(investigationId: string, filterByType?: string): Promise<{
    investigationId: string;
    totalEvidenceItems: number;
    evidenceByType: Record<string, number>;
    confidenceWeightedScore: number;
    auditTrailEntries: number;
    lastEvidenceAdded: Date;
}>;
/**
 * Record investigation decision with comprehensive documentation
 * @param investigationId Investigation ID
 * @param decision Investigation decision record
 * @returns Decision confirmation with unique ID and validation
 */
export declare function recordInvestigationDecision(investigationId: string, decision: Omit<InvestigationDecision, 'investigationId'>): Promise<{
    decisionId: string;
    investigationId: string;
    disposition: InvestigationDisposition;
    recordedAt: Date;
    requiresApproval: boolean;
    approvalDeadline?: Date;
}>;
/**
 * Approve or reject investigation decision with authority validation
 * @param decisionId Decision ID to approve/reject
 * @param approverRole Approver's role/authority level
 * @param approval Approval status (APPROVE/REJECT)
 * @param comments Optional approval comments
 * @returns Approval confirmation with authority check
 */
export declare function approveInvestigationDecision(decisionId: string, approverRole: string, approval: 'APPROVE' | 'REJECT', comments?: string): Promise<{
    decisionId: string;
    approved: boolean;
    approvalAuthority: string;
    approvedAt: Date;
    requiresEscalation: boolean;
    effectiveDate: Date;
}>;
/**
 * Get decision recommendations from AI analysis with confidence scoring
 * @param investigationId Investigation ID
 * @param includeSimilarCases Include similar historical cases for comparison
 * @returns AI recommendations with confidence and rationale
 */
export declare function getDecisionRecommendations(investigationId: string, includeSimilarCases?: boolean): Promise<{
    investigationId: string;
    recommendedDisposition: InvestigationDisposition;
    confidenceScore: number;
    supportingRationale: string;
    alternativeDispositions: Array<{
        disposition: InvestigationDisposition;
        probability: number;
    }>;
    similarCaseCount?: number;
    matchingPatterns: string[];
}>;
/**
 * Escalate alert/investigation to management with authority routing
 * @param investigationId Investigation ID
 * @param escalationReason Reason for escalation
 * @param escalationLevel Escalation level (1=immediate manager, 2=director, etc)
 * @returns Escalation confirmation with routing
 */
export declare function escalateInvestigation(investigationId: string, escalationReason: string, escalationLevel?: number): Promise<{
    escalationId: string;
    investigationId: string;
    escalatedAt: Date;
    escalatedToRole: string;
    escalatedToUserId: string;
    urgencyLevel: AlertSeverity;
    estimatedResponseTime: number;
}>;
/**
 * Auto-escalate alerts based on time, urgency, or compliance triggers
 * @param investigationIds Array of investigation IDs to check
 * @param escalationTriggers Escalation trigger conditions
 * @returns Escalation results with summary
 */
export declare function autoEscalateInvestigations(investigationIds: string[], escalationTriggers: {
    agingMinutes?: number;
    urgencyThreshold?: AlertSeverity;
    complianceViolation?: boolean;
}): Promise<{
    checkCount: number;
    escalatedCount: number;
    escalations: Array<{
        investigationId: string;
        escalationId: string;
        trigger: string;
    }>;
    timestamp: Date;
}>;
/**
 * Mark alert as false positive with detailed feedback for model training
 * @param alertId Alert ID marked as false positive
 * @param justification Detailed justification for FP classification
 * @param misclassificationReason Root cause analysis
 * @returns FP record with feedback for model improvement
 */
export declare function markAlertAsFalsePositive(alertId: string, justification: string, misclassificationReason: string): Promise<{
    falsePositiveId: string;
    alertId: string;
    recordedAt: Date;
    feedbackForModelTraining: {
        features: Record<string, unknown>;
        actualLabel: string;
        predictedLabel: string;
        confidenceWasted: number;
    };
    impactOnRuleScore: number;
}>;
/**
 * Calculate and apply false positive rate adjustments to alert rules
 * @param ruleIds Array of rule IDs to analyze
 * @param adjustmentFactors False positive rate adjustment parameters
 * @returns Rule adjustment recommendations with impact assessment
 */
export declare function adjustRulesForFalsePositiveReduction(ruleIds: string[], adjustmentFactors: {
    fpThresholdPercent?: number;
    confidenceFloor?: number;
    featureWeights?: Record<string, number>;
}): Promise<{
    analysisId: string;
    rulesAnalyzed: number;
    rulesRecommendedForAdjustment: number;
    projectedFPReduction: number;
    adjustmentDetails: Array<{
        ruleId: string;
        currentFPRate: number;
        projectedFPRate: number;
        recommendations: string[];
    }>;
}>;
/**
 * Monitor alert aging and apply aging-based rules
 * @param alertIds Array of alert IDs to monitor
 * @param agingThresholds Age thresholds for action (in hours)
 * @returns Aged alert summary with escalation requirements
 */
export declare function monitorAlertAging(alertIds: string[], agingThresholds: {
    warningHours?: number;
    escalationHours?: number;
    violationHours?: number;
}): Promise<{
    analysisTime: Date;
    totalAlertsMonitored: number;
    alertsByAge: {
        recent: number;
        aging: number;
        escalationRequired: number;
        violation: number;
    };
    agedAlerts: Array<{
        alertId: string;
        ageHours: number;
        status: string;
        escalationRequired: boolean;
    }>;
}>;
/**
 * Auto-close aged alerts with compliance documentation
 * @param alertIds Array of alert IDs to close
 * @param inactivityDays Days of inactivity before auto-close
 * @param closureReason Documented reason for closure
 * @returns Auto-closure results with compliance confirmation
 */
export declare function autoCloseAgedAlerts(alertIds: string[], inactivityDays: number, closureReason: string): Promise<{
    closureRunId: string;
    processedAlerts: number;
    closedAlerts: number;
    requiresApproval: number;
    closureDetails: Array<{
        alertId: string;
        closed: boolean;
        requiresApproval: boolean;
        reason: string;
    }>;
}>;
/**
 * Track SLA metrics for alert/investigation with deadline monitoring
 * @param investigationIds Array of investigation IDs
 * @param slaConfigs SLA configurations by category/severity
 * @returns SLA tracking summary with violation alerts
 */
export declare function trackInvestigationSLAMetrics(investigationIds: string[], slaConfigs: SLAConfiguration[]): Promise<{
    trackingRunId: string;
    totalInvestigations: number;
    compliant: number;
    atRisk: number;
    violated: number;
    slaMetrics: Array<{
        investigationId: string;
        responseDeadline: Date;
        investigationDeadline: Date;
        resolutionDeadline: Date;
        timeRemainingPercent: number;
        status: 'COMPLIANT' | 'AT_RISK' | 'VIOLATED';
    }>;
    overallComplianceRate: number;
}>;
/**
 * Calculate SLA breach notifications with escalation routing
 * @param slaViolationAlertIds Array of SLA violation alert IDs
 * @param notificationThreshold Percentage threshold for notification
 * @returns Notification plan with recipient routing
 */
export declare function createSLABreachNotifications(slaViolationAlertIds: string[], notificationThreshold?: number): Promise<{
    notificationRunId: string;
    alertsProcessed: number;
    notificationsCreated: number;
    recipientsByRole: Record<string, number>;
    escalationChain: Array<{
        role: string;
        notificationType: string;
        deliveryMethod: string;
    }>;
    estimatedDelivery: Date;
}>;
/**
 * Create reusable alert template with dynamic field mapping
 * @param template Alert template definition
 * @returns Template creation confirmation with version control
 */
export declare function createAlertTemplate(template: Omit<AlertTemplate, 'templateId'>): Promise<{
    templateId: string;
    name: string;
    version: string;
    createdAt: Date;
    status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
    validationStatus: 'VALID' | 'VALIDATION_ERRORS';
    errors?: string[];
}>;
/**
 * Apply alert template to generate standardized alerts
 * @param templateId Template ID to apply
 * @param entityData Entity data for template substitution
 * @param customizations Optional field customizations
 * @returns Generated alerts with template values applied
 */
export declare function applyAlertTemplate(templateId: string, entityData: Record<string, unknown>, customizations?: Record<string, unknown>): Promise<{
    generatedAlertId: string;
    templateId: string;
    appliedAt: Date;
    fieldsMapped: number;
    customizationsApplied: number;
    alertPreview: {
        severity: AlertSeverity;
        category: string;
        description: string;
    };
}>;
/**
 * Add collaborative comment to investigation with mention/notification support
 * @param investigationId Investigation ID
 * @param comment Investigation comment with metadata
 * @returns Comment creation confirmation with notification routing
 */
export declare function addInvestigationComment(investigationId: string, comment: Omit<InvestigationComment, 'id' | 'createdAt'>): Promise<{
    commentId: string;
    investigationId: string;
    createdAt: Date;
    mentionedUsers: string[];
    notificationsSent: number;
    visibility: 'PUBLIC' | 'TEAM_ONLY' | 'CONFIDENTIAL';
}>;
/**
 * Retrieve investigation discussion thread with full context
 * @param investigationId Investigation ID
 * @param includeAttachments Include attached files in responses
 * @param pageSize Pagination size (default 20)
 * @returns Investigation discussion thread with metadata
 */
export declare function getInvestigationDiscussionThread(investigationId: string, includeAttachments?: boolean, pageSize?: number): Promise<{
    investigationId: string;
    totalComments: number;
    comments: Array<{
        commentId: string;
        author: string;
        authorRole: string;
        content: string;
        createdAt: Date;
        attachments?: string[];
        mentions?: string[];
    }>;
    participantCount: number;
    lastActivity: Date;
    hasMoreComments: boolean;
}>;
/**
 * Record final disposition of investigation with compliance documentation
 * @param investigationId Investigation ID
 * @param disposition Disposition with evidence and rationale
 * @returns Disposition recording confirmation
 */
export declare function recordInvestigationDisposition(investigationId: string, disposition: InvestigationDisposition, evidenceForDisposition: string[], rationale: string): Promise<{
    dispositionId: string;
    investigationId: string;
    disposition: InvestigationDisposition;
    recordedAt: Date;
    complianceApprovalRequired: boolean;
    reportingRequired: boolean;
    reportingEntities: string[];
}>;
/**
 * Generate final investigation report with findings and recommendations
 * @param investigationId Investigation ID
 * @param reportFormat Report format (PDF, HTML, JSON)
 * @param includeRecommendations Include recommendations for prevention
 * @returns Generated report with metadata
 */
export declare function generateInvestigationReport(investigationId: string, reportFormat?: 'PDF' | 'HTML' | 'JSON', includeRecommendations?: boolean): Promise<{
    reportId: string;
    investigationId: string;
    reportUrl: string;
    format: string;
    generatedAt: Date;
    fileSize: number;
    pageCount?: number;
    sections: string[];
    complianceApproved: boolean;
}>;
/**
 * Calculate comprehensive alert and investigation analytics metrics
 * @param timeRange Time range for analytics (start and end dates)
 * @param dimensions Analytics dimensions (status, severity, category, etc)
 * @returns Alert analytics with trends and KPIs
 */
export declare function calculateAlertAnalytics(timeRange: {
    startDate: Date;
    endDate: Date;
}, dimensions?: string[]): Promise<AlertAnalyticsMetrics>;
/**
 * Generate analytics dashboard data with trend analysis
 * @param metricType Type of metric (ALERT_METRICS, INVESTIGATION_METRICS, etc)
 * @param granularity Time granularity (HOURLY, DAILY, WEEKLY, MONTHLY)
 * @param includeForecasting Include predictive analytics
 * @returns Dashboard metrics with trends and forecasts
 */
export declare function generateAnalyticsDashboardData(metricType: string, granularity: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY', includeForecasting?: boolean): Promise<{
    dashboardId: string;
    metricType: string;
    granularity: string;
    dataPoints: Array<{
        timestamp: Date;
        value: number;
        trend: 'UP' | 'DOWN' | 'STABLE';
        confidence: number;
    }>;
    summary: {
        current: number;
        previousPeriod: number;
        changePercent: number;
    };
    forecasts?: Array<{
        timestamp: Date;
        projectedValue: number;
        confidenceInterval: [number, number];
    }>;
}>;
/**
 * Calculate comprehensive investigator performance metrics
 * @param investigatorId Investigator ID
 * @param timeRange Time range for metrics calculation
 * @returns Detailed investigator performance metrics
 */
export declare function calculateInvestigatorMetrics(investigatorId: string, timeRange: {
    startDate: Date;
    endDate: Date;
}): Promise<InvestigatorMetrics>;
/**
 * Compare investigator performance across team with benchmarking
 * @param investigatorIds Array of investigator IDs to compare
 * @param benchmarkType Comparison basis (TEAM_AVERAGE, DEPARTMENT_AVERAGE, BEST_PERFORMER)
 * @returns Comparative analysis with rankings
 */
export declare function compareInvestigatorPerformance(investigatorIds: string[], benchmarkType: 'TEAM_AVERAGE' | 'DEPARTMENT_AVERAGE' | 'BEST_PERFORMER'): Promise<{
    comparisonId: string;
    benchmarkType: string;
    investigators: Array<{
        investigatorId: string;
        rank: number;
        totalScore: number;
        metricsComparison: Record<string, {
            value: number;
            benchmarkValue: number;
            variance: number;
        }>;
        developmentOpportunities: string[];
    }>;
    topPerformers: string[];
    improvementOpportunities: string[];
    recommendedTraining: Record<string, string[]>;
}>;
export { AlertSeverity, AlertStatus, InvestigationPhase, InvestigationDisposition, RoutingStrategy, SLAEventType, type AlertGenerationPayload, type PrioritizationFactors, type EvidenceItem, type InvestigatorProfile, type SLAConfiguration, type AlertTemplate, type InvestigationComment, type InvestigationDecision, type AlertAnalyticsMetrics, type InvestigatorMetrics, };
//# sourceMappingURL=alert-management-investigation-kit.d.ts.map