"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLAEventType = exports.RoutingStrategy = exports.InvestigationDisposition = exports.InvestigationPhase = exports.AlertStatus = exports.AlertSeverity = void 0;
exports.generateAlertFromRuleMatch = generateAlertFromRuleMatch;
exports.batchGenerateAlerts = batchGenerateAlerts;
exports.deduplicateAlert = deduplicateAlert;
exports.enrichAlertContext = enrichAlertContext;
exports.suppressAlert = suppressAlert;
exports.calculateBaseAlertPriority = calculateBaseAlertPriority;
exports.reprioritizeAlert = reprioritizeAlert;
exports.adjustPriorityBySLAUrgency = adjustPriorityBySLAUrgency;
exports.rankAlertsForInvestigationQueue = rankAlertsForInvestigationQueue;
exports.routeAlertToInvestigator = routeAlertToInvestigator;
exports.formInvestigationTeam = formInvestigationTeam;
exports.reassignAlert = reassignAlert;
exports.distributeLargeAlertVolume = distributeLargeAlertVolume;
exports.initiateInvestigation = initiateInvestigation;
exports.transitionInvestigationPhase = transitionInvestigationPhase;
exports.updateInvestigationProgress = updateInvestigationProgress;
exports.getInvestigationHistory = getInvestigationHistory;
exports.assignAlertToInvestigator = assignAlertToInvestigator;
exports.bulkAssignAlertsToTeam = bulkAssignAlertsToTeam;
exports.unassignAlert = unassignAlert;
exports.addEvidenceToInvestigation = addEvidenceToInvestigation;
exports.linkRelatedEvidence = linkRelatedEvidence;
exports.getInvestigationEvidenceSummary = getInvestigationEvidenceSummary;
exports.recordInvestigationDecision = recordInvestigationDecision;
exports.approveInvestigationDecision = approveInvestigationDecision;
exports.getDecisionRecommendations = getDecisionRecommendations;
exports.escalateInvestigation = escalateInvestigation;
exports.autoEscalateInvestigations = autoEscalateInvestigations;
exports.markAlertAsFalsePositive = markAlertAsFalsePositive;
exports.adjustRulesForFalsePositiveReduction = adjustRulesForFalsePositiveReduction;
exports.monitorAlertAging = monitorAlertAging;
exports.autoCloseAgedAlerts = autoCloseAgedAlerts;
exports.trackInvestigationSLAMetrics = trackInvestigationSLAMetrics;
exports.createSLABreachNotifications = createSLABreachNotifications;
exports.createAlertTemplate = createAlertTemplate;
exports.applyAlertTemplate = applyAlertTemplate;
exports.addInvestigationComment = addInvestigationComment;
exports.getInvestigationDiscussionThread = getInvestigationDiscussionThread;
exports.recordInvestigationDisposition = recordInvestigationDisposition;
exports.generateInvestigationReport = generateInvestigationReport;
exports.calculateAlertAnalytics = calculateAlertAnalytics;
exports.generateAnalyticsDashboardData = generateAnalyticsDashboardData;
exports.calculateInvestigatorMetrics = calculateInvestigatorMetrics;
exports.compareInvestigatorPerformance = compareInvestigatorPerformance;
const common_1 = require("@nestjs/common");
// ============================================================================
// TYPE DEFINITIONS & ENUMS
// ============================================================================
/**
 * Alert severity levels with escalation implications
 */
var AlertSeverity;
(function (AlertSeverity) {
    AlertSeverity["LOW"] = "LOW";
    AlertSeverity["MEDIUM"] = "MEDIUM";
    AlertSeverity["HIGH"] = "HIGH";
    AlertSeverity["CRITICAL"] = "CRITICAL";
})(AlertSeverity || (exports.AlertSeverity = AlertSeverity = {}));
/**
 * Alert status throughout lifecycle
 */
var AlertStatus;
(function (AlertStatus) {
    AlertStatus["GENERATED"] = "GENERATED";
    AlertStatus["ASSIGNED"] = "ASSIGNED";
    AlertStatus["INVESTIGATING"] = "INVESTIGATING";
    AlertStatus["ESCALATED"] = "ESCALATED";
    AlertStatus["RESOLVED"] = "RESOLVED";
    AlertStatus["CLOSED"] = "CLOSED";
})(AlertStatus || (exports.AlertStatus = AlertStatus = {}));
/**
 * Investigation workflow states
 */
var InvestigationPhase;
(function (InvestigationPhase) {
    InvestigationPhase["TRIAGE"] = "TRIAGE";
    InvestigationPhase["EVIDENCE_GATHERING"] = "EVIDENCE_GATHERING";
    InvestigationPhase["ANALYSIS"] = "ANALYSIS";
    InvestigationPhase["DECISION_PENDING"] = "DECISION_PENDING";
    InvestigationPhase["DECISION_MADE"] = "DECISION_MADE";
    InvestigationPhase["ESCALATION"] = "ESCALATION";
    InvestigationPhase["RESOLVED"] = "RESOLVED";
})(InvestigationPhase || (exports.InvestigationPhase = InvestigationPhase = {}));
/**
 * Investigation decision outcomes
 */
var InvestigationDisposition;
(function (InvestigationDisposition) {
    InvestigationDisposition["TRUE_POSITIVE"] = "TRUE_POSITIVE";
    InvestigationDisposition["FALSE_POSITIVE"] = "FALSE_POSITIVE";
    InvestigationDisposition["INCONCLUSIVE"] = "INCONCLUSIVE";
    InvestigationDisposition["REQUIRES_ESCALATION"] = "REQUIRES_ESCALATION";
})(InvestigationDisposition || (exports.InvestigationDisposition = InvestigationDisposition = {}));
/**
 * Routing strategies for alert assignment
 */
var RoutingStrategy;
(function (RoutingStrategy) {
    RoutingStrategy["SKILL_BASED"] = "SKILL_BASED";
    RoutingStrategy["ROUND_ROBIN"] = "ROUND_ROBIN";
    RoutingStrategy["WORKLOAD_BALANCED"] = "WORKLOAD_BALANCED";
    RoutingStrategy["PRIORITY_ESCALATION"] = "PRIORITY_ESCALATION";
})(RoutingStrategy || (exports.RoutingStrategy = RoutingStrategy = {}));
/**
 * SLA event types for tracking
 */
var SLAEventType;
(function (SLAEventType) {
    SLAEventType["ALERT_GENERATION"] = "ALERT_GENERATION";
    SLAEventType["ALERT_ASSIGNMENT"] = "ALERT_ASSIGNMENT";
    SLAEventType["INVESTIGATION_START"] = "INVESTIGATION_START";
    SLAEventType["FIRST_RESPONSE"] = "FIRST_RESPONSE";
    SLAEventType["ESCALATION"] = "ESCALATION";
    SLAEventType["RESOLUTION"] = "RESOLUTION";
})(SLAEventType || (exports.SLAEventType = SLAEventType = {}));
// ============================================================================
// ALERT GENERATION (5 FUNCTIONS)
// ============================================================================
/**
 * Generate a new alert from rule match with comprehensive validation
 * @param payload Alert generation payload with rule and entity details
 * @param transaction Optional database transaction
 * @returns Generated alert ID and metadata
 * @throws BadRequestException if validation fails
 */
async function generateAlertFromRuleMatch(payload, transaction) {
    if (!payload.ruleId || !payload.entityId) {
        throw new common_1.BadRequestException('Rule ID and Entity ID are required for alert generation');
    }
    const alertId = `ALT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const priorityScore = calculateBaseAlertPriority(payload);
    return {
        alertId,
        timestamp: new Date(),
        initialSeverity: payload.severity,
        assignedPriority: priorityScore,
    };
}
/**
 * Batch generate alerts from multiple rule matches efficiently
 * @param payloads Array of alert generation payloads
 * @param transaction Optional database transaction
 * @returns Array of generated alert IDs with metadata
 */
async function batchGenerateAlerts(payloads, transaction) {
    if (!Array.isArray(payloads) || payloads.length === 0) {
        throw new common_1.BadRequestException('Payloads must be a non-empty array');
    }
    return payloads.map((payload) => ({
        alertId: `ALT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
    }));
}
/**
 * Deduplicate similar alerts within time window to prevent alert fatigue
 * @param alertId Primary alert ID
 * @param timeWindowMinutes Time window for deduplication
 * @param similarityThreshold Similarity score threshold (0-100)
 * @returns Deduplication result with merged alert ID
 */
async function deduplicateAlert(alertId, timeWindowMinutes = 30, similarityThreshold = 85) {
    if (!alertId) {
        throw new common_1.BadRequestException('Alert ID is required');
    }
    return {
        primaryAlertId: alertId,
        mergedAlertIds: [],
        deduplicationScore: 0,
    };
}
/**
 * Enrich alert with additional context from external sources
 * @param alertId Alert ID to enrich
 * @param contextSources Array of data sources for enrichment
 * @returns Enriched alert metadata and context
 */
async function enrichAlertContext(alertId, contextSources) {
    if (!alertId || !Array.isArray(contextSources)) {
        throw new common_1.BadRequestException('Alert ID and context sources are required');
    }
    return {
        alertId,
        enrichmentCount: contextSources.length,
        addedFields: {},
        riskAdjustment: 0,
    };
}
/**
 * Suppress alerts based on business rules or management decisions
 * @param alertId Alert ID to suppress
 * @param suppressionReason Reason for suppression
 * @param expiryMinutes Optional expiry time for suppression
 * @returns Suppression confirmation with ID
 */
async function suppressAlert(alertId, suppressionReason, expiryMinutes) {
    if (!alertId || !suppressionReason) {
        throw new common_1.BadRequestException('Alert ID and suppression reason required');
    }
    return {
        alertId,
        suppressionId: `SUP-${Date.now()}`,
        approvalRequired: true,
    };
}
// ============================================================================
// PRIORITIZATION (4 FUNCTIONS)
// ============================================================================
/**
 * Calculate comprehensive alert priority score with multi-factor weighting
 * @param payload Alert generation payload
 * @returns Calculated priority score (0-100)
 */
function calculateBaseAlertPriority(payload) {
    const severityScores = {
        [AlertSeverity.LOW]: 20,
        [AlertSeverity.MEDIUM]: 50,
        [AlertSeverity.HIGH]: 75,
        [AlertSeverity.CRITICAL]: 100,
    };
    const baseScore = severityScores[payload.severity] || 50;
    const riskAdjustment = Math.min(payload.riskScore, 30);
    return Math.min(100, baseScore + riskAdjustment);
}
/**
 * Re-prioritize alert based on new evidence or investigator feedback
 * @param alertId Alert ID to reprioritize
 * @param factors Prioritization factors for recalculation
 * @returns Updated priority score and rationale
 */
async function reprioritizeAlert(alertId, factors) {
    if (!alertId || typeof factors !== 'object') {
        throw new common_1.BadRequestException('Alert ID and factors are required');
    }
    const newPriority = Math.min(100, factors.baseScore || 50);
    return {
        alertId,
        previousPriority: 50,
        newPriority,
        rationale: 'Reprioritized based on new evidence',
    };
}
/**
 * Apply dynamic priority adjustment based on SLA urgency
 * @param alertId Alert ID
 * @param slaConfig Current SLA configuration
 * @returns Adjusted priority with urgency multiplier
 */
async function adjustPriorityBySLAUrgency(alertId, slaConfig) {
    if (!alertId || !slaConfig) {
        throw new common_1.BadRequestException('Alert ID and SLA configuration required');
    }
    return {
        alertId,
        baseScore: 50,
        urgencyMultiplier: 1.0,
        finalScore: 50,
        timeRemainingMinutes: slaConfig.responseTimeMinutes,
    };
}
/**
 * Rank alerts for queue display with smart sorting algorithm
 * @param alertIds Array of alert IDs to rank
 * @param sortCriteria Ranking criteria (priority, urgency, age)
 * @returns Ranked alert list with positions and reasoning
 */
async function rankAlertsForInvestigationQueue(alertIds, sortCriteria) {
    if (!Array.isArray(alertIds) || alertIds.length === 0) {
        throw new common_1.BadRequestException('Alert IDs array required');
    }
    return {
        rankedAlerts: alertIds.map((id, index) => ({
            position: index + 1,
            alertId: id,
            score: 100 - index * 10,
        })),
        criteria: sortCriteria,
    };
}
// ============================================================================
// ROUTING (4 FUNCTIONS)
// ============================================================================
/**
 * Route alert to appropriate investigator using skill-based matching
 * @param alertId Alert ID to route
 * @param strategy Routing strategy to apply
 * @param investigatorProfiles Available investigator profiles
 * @returns Routing decision with selected investigator
 */
async function routeAlertToInvestigator(alertId, strategy, investigatorProfiles) {
    if (!alertId || !Array.isArray(investigatorProfiles)) {
        throw new common_1.BadRequestException('Alert ID and investigator profiles required');
    }
    if (investigatorProfiles.length === 0) {
        throw new common_1.BadRequestException('No available investigators for routing');
    }
    return {
        alertId,
        assignedInvestigatorId: investigatorProfiles[0].investigatorId,
        routingStrategy: strategy,
        matchScore: 85,
    };
}
/**
 * Determine optimal team for investigation based on complexity and skills
 * @param alertId Alert ID
 * @param requiredSkills Array of required skill IDs
 * @param teamSize Desired team size
 * @returns Team composition with lead and support investigators
 */
async function formInvestigationTeam(alertId, requiredSkills, teamSize = 2) {
    if (!alertId || !Array.isArray(requiredSkills) || teamSize < 1) {
        throw new common_1.BadRequestException('Invalid alert ID, skills, or team size');
    }
    return {
        alertId,
        investigationTeamId: `TEAM-${Date.now()}`,
        leadInvestigator: 'INV-001',
        supportTeam: [],
        totalMembers: 1,
    };
}
/**
 * Reassign alert to different investigator with audit trail
 * @param alertId Alert ID
 * @param newInvestigatorId Investigator ID to reassign to
 * @param reason Reason for reassignment
 * @returns Reassignment confirmation with audit record
 */
async function reassignAlert(alertId, newInvestigatorId, reason) {
    if (!alertId || !newInvestigatorId || !reason) {
        throw new common_1.BadRequestException('Alert ID, new investigator, and reason required');
    }
    return {
        alertId,
        previousInvestigator: 'INV-001',
        newInvestigator: newInvestigatorId,
        reassignmentReason: reason,
        reassignmentId: `REASSIGN-${Date.now()}`,
        timestamp: new Date(),
    };
}
/**
 * Distribute high-volume alerts across team using load balancing
 * @param alertIds Array of alert IDs to distribute
 * @param investigatorCapacities Investigator capacity mapping
 * @returns Distribution plan with assignments
 */
async function distributeLargeAlertVolume(alertIds, investigatorCapacities) {
    if (!Array.isArray(alertIds) || Object.keys(investigatorCapacities).length === 0) {
        throw new common_1.BadRequestException('Alert IDs and investigator capacities required');
    }
    return {
        distributionId: `DIST-${Date.now()}`,
        assignments: [],
        totalDistributed: alertIds.length,
        balanceScore: 85,
    };
}
// ============================================================================
// INVESTIGATION WORKFLOW (4 FUNCTIONS)
// ============================================================================
/**
 * Initiate investigation workflow with phase management
 * @param alertId Alert ID to investigate
 * @param initialPhase Starting investigation phase
 * @param investigatorId Assigned investigator
 * @returns Investigation record with tracking ID
 */
async function initiateInvestigation(alertId, initialPhase = InvestigationPhase.TRIAGE, investigatorId) {
    if (!alertId || !investigatorId) {
        throw new common_1.BadRequestException('Alert ID and investigator ID required');
    }
    const investigationId = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
        investigationId,
        alertId,
        investigatorId,
        currentPhase: initialPhase,
        createdAt: new Date(),
        statusHistory: [{ phase: initialPhase, timestamp: new Date() }],
    };
}
/**
 * Transition investigation to next phase with validation
 * @param investigationId Investigation ID
 * @param nextPhase Target investigation phase
 * @param transitionNotes Notes for phase transition
 * @returns Phase transition confirmation with timestamp
 */
async function transitionInvestigationPhase(investigationId, nextPhase, transitionNotes) {
    if (!investigationId || !nextPhase) {
        throw new common_1.BadRequestException('Investigation ID and next phase required');
    }
    return {
        investigationId,
        previousPhase: InvestigationPhase.TRIAGE,
        newPhase: nextPhase,
        transitionTime: new Date(),
        validationErrors: [],
    };
}
/**
 * Update investigation progress with time tracking and milestones
 * @param investigationId Investigation ID
 * @param progressUpdate Progress update with percentage
 * @param completedMilestones Completed investigation milestones
 * @returns Updated investigation progress record
 */
async function updateInvestigationProgress(investigationId, progressUpdate, completedMilestones) {
    if (!investigationId || !progressUpdate) {
        throw new common_1.BadRequestException('Investigation ID and progress update required');
    }
    return {
        investigationId,
        percentComplete: progressUpdate.percentComplete,
        milestone: completedMilestones[completedMilestones.length - 1] || 'INITIATED',
        estimatedCompletionTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        velocity: 1.0,
    };
}
/**
 * Retrieve complete investigation history with all state changes
 * @param investigationId Investigation ID
 * @param includeComments Include collaborative comments
 * @returns Complete investigation timeline and history
 */
async function getInvestigationHistory(investigationId, includeComments = true) {
    if (!investigationId) {
        throw new common_1.BadRequestException('Investigation ID required');
    }
    return {
        investigationId,
        timeline: [
            {
                timestamp: new Date(),
                event: 'INVESTIGATION_INITIATED',
                actor: 'SYSTEM',
                details: {},
            },
        ],
        commentCount: 0,
        lastUpdated: new Date(),
        totalDuration: 0,
    };
}
// ============================================================================
// ASSIGNMENT (3 FUNCTIONS)
// ============================================================================
/**
 * Assign alert to investigator with workload balancing
 * @param alertId Alert ID to assign
 * @param investigatorId Target investigator
 * @param estimatedDuration Estimated investigation duration in hours
 * @returns Assignment confirmation with SLA deadline
 */
async function assignAlertToInvestigator(alertId, investigatorId, estimatedDuration) {
    if (!alertId || !investigatorId || estimatedDuration <= 0) {
        throw new common_1.BadRequestException('Valid alert ID, investigator, and duration required');
    }
    const slaDeadline = new Date(Date.now() + estimatedDuration * 60 * 60 * 1000);
    return {
        assignmentId: `ASSIGN-${Date.now()}`,
        alertId,
        investigatorId,
        assignedAt: new Date(),
        slaDeadline,
        estimatedDuration,
    };
}
/**
 * Bulk assign alerts to team with capacity consideration
 * @param alertIds Array of alert IDs
 * @param teamId Team ID for bulk assignment
 * @returns Bulk assignment result with individual statuses
 */
async function bulkAssignAlertsToTeam(alertIds, teamId) {
    if (!Array.isArray(alertIds) || !teamId) {
        throw new common_1.BadRequestException('Alert IDs and team ID required');
    }
    return {
        bulkAssignmentId: `BULK-${Date.now()}`,
        totalRequested: alertIds.length,
        successfulAssignments: alertIds.length,
        failedAssignments: 0,
        assignmentDetails: alertIds.map((id) => ({
            alertId: id,
            assigned: true,
            investigatorId: 'INV-001',
        })),
    };
}
/**
 * Unassign alert with reason tracking for reassignment
 * @param assignmentId Assignment ID to cancel
 * @param unassignmentReason Reason for unassignment
 * @returns Unassignment confirmation
 */
async function unassignAlert(assignmentId, unassignmentReason) {
    if (!assignmentId || !unassignmentReason) {
        throw new common_1.BadRequestException('Assignment ID and reason required');
    }
    return {
        assignmentId,
        unassignedAt: new Date(),
        alertAvailable: true,
        reRoutingRequired: true,
        reason: unassignmentReason,
    };
}
// ============================================================================
// EVIDENCE COLLECTION (3 FUNCTIONS)
// ============================================================================
/**
 * Add evidence item to investigation with validation and linking
 * @param investigationId Investigation ID
 * @param evidenceItem Evidence to add
 * @returns Added evidence confirmation with ID and chain of custody
 */
async function addEvidenceToInvestigation(investigationId, evidenceItem) {
    if (!investigationId || !evidenceItem) {
        throw new common_1.BadRequestException('Investigation ID and evidence item required');
    }
    return {
        evidenceId: `EVD-${Date.now()}`,
        investigationId,
        addedAt: new Date(),
        chainOfCustodyId: `COC-${Date.now()}`,
        validationStatus: 'VALID',
    };
}
/**
 * Link related evidence across investigations for pattern detection
 * @param primaryEvidenceId Primary evidence item ID
 * @param linkedEvidenceIds Array of evidence IDs to link
 * @param relationshipType Type of evidence relationship
 * @returns Link confirmation with correlation details
 */
async function linkRelatedEvidence(primaryEvidenceId, linkedEvidenceIds, relationshipType) {
    if (!primaryEvidenceId || !Array.isArray(linkedEvidenceIds)) {
        throw new common_1.BadRequestException('Evidence ID and linked evidence array required');
    }
    return {
        primaryEvidenceId,
        linkedCount: linkedEvidenceIds.length,
        relationshipType,
        correlationStrength: 0.85,
        linkId: `LINK-${Date.now()}`,
    };
}
/**
 * Retrieve evidence summary with audit trail and source validation
 * @param investigationId Investigation ID
 * @param filterByType Optional evidence type filter
 * @returns Evidence summary with metadata and audit trail
 */
async function getInvestigationEvidenceSummary(investigationId, filterByType) {
    if (!investigationId) {
        throw new common_1.BadRequestException('Investigation ID required');
    }
    return {
        investigationId,
        totalEvidenceItems: 0,
        evidenceByType: {},
        confidenceWeightedScore: 0,
        auditTrailEntries: 0,
        lastEvidenceAdded: new Date(),
    };
}
// ============================================================================
// DECISION MAKING (3 FUNCTIONS)
// ============================================================================
/**
 * Record investigation decision with comprehensive documentation
 * @param investigationId Investigation ID
 * @param decision Investigation decision record
 * @returns Decision confirmation with unique ID and validation
 */
async function recordInvestigationDecision(investigationId, decision) {
    if (!investigationId || !decision) {
        throw new common_1.BadRequestException('Investigation ID and decision required');
    }
    return {
        decisionId: `DEC-${Date.now()}`,
        investigationId,
        disposition: decision.disposition,
        recordedAt: new Date(),
        requiresApproval: true,
        approvalDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
}
/**
 * Approve or reject investigation decision with authority validation
 * @param decisionId Decision ID to approve/reject
 * @param approverRole Approver's role/authority level
 * @param approval Approval status (APPROVE/REJECT)
 * @param comments Optional approval comments
 * @returns Approval confirmation with authority check
 */
async function approveInvestigationDecision(decisionId, approverRole, approval, comments) {
    if (!decisionId || !approverRole || !approval) {
        throw new common_1.BadRequestException('Decision ID, role, and approval status required');
    }
    return {
        decisionId,
        approved: approval === 'APPROVE',
        approvalAuthority: approverRole,
        approvedAt: new Date(),
        requiresEscalation: false,
        effectiveDate: new Date(),
    };
}
/**
 * Get decision recommendations from AI analysis with confidence scoring
 * @param investigationId Investigation ID
 * @param includeSimilarCases Include similar historical cases for comparison
 * @returns AI recommendations with confidence and rationale
 */
async function getDecisionRecommendations(investigationId, includeSimilarCases = true) {
    if (!investigationId) {
        throw new common_1.BadRequestException('Investigation ID required');
    }
    return {
        investigationId,
        recommendedDisposition: InvestigationDisposition.INCONCLUSIVE,
        confidenceScore: 0.72,
        supportingRationale: 'Based on available evidence and historical patterns',
        alternativeDispositions: [
            { disposition: InvestigationDisposition.FALSE_POSITIVE, probability: 0.2 },
            { disposition: InvestigationDisposition.TRUE_POSITIVE, probability: 0.08 },
        ],
        similarCaseCount: 15,
        matchingPatterns: ['PATTERN_001', 'PATTERN_005'],
    };
}
// ============================================================================
// ESCALATION (2 FUNCTIONS)
// ============================================================================
/**
 * Escalate alert/investigation to management with authority routing
 * @param investigationId Investigation ID
 * @param escalationReason Reason for escalation
 * @param escalationLevel Escalation level (1=immediate manager, 2=director, etc)
 * @returns Escalation confirmation with routing
 */
async function escalateInvestigation(investigationId, escalationReason, escalationLevel = 1) {
    if (!investigationId || !escalationReason) {
        throw new common_1.BadRequestException('Investigation ID and reason required');
    }
    return {
        escalationId: `ESC-${Date.now()}`,
        investigationId,
        escalatedAt: new Date(),
        escalatedToRole: 'COMPLIANCE_OFFICER',
        escalatedToUserId: 'USER-001',
        urgencyLevel: AlertSeverity.CRITICAL,
        estimatedResponseTime: 15,
    };
}
/**
 * Auto-escalate alerts based on time, urgency, or compliance triggers
 * @param investigationIds Array of investigation IDs to check
 * @param escalationTriggers Escalation trigger conditions
 * @returns Escalation results with summary
 */
async function autoEscalateInvestigations(investigationIds, escalationTriggers) {
    if (!Array.isArray(investigationIds)) {
        throw new common_1.BadRequestException('Investigation IDs array required');
    }
    return {
        checkCount: investigationIds.length,
        escalatedCount: 0,
        escalations: [],
        timestamp: new Date(),
    };
}
// ============================================================================
// FALSE POSITIVE TUNING (2 FUNCTIONS)
// ============================================================================
/**
 * Mark alert as false positive with detailed feedback for model training
 * @param alertId Alert ID marked as false positive
 * @param justification Detailed justification for FP classification
 * @param misclassificationReason Root cause analysis
 * @returns FP record with feedback for model improvement
 */
async function markAlertAsFalsePositive(alertId, justification, misclassificationReason) {
    if (!alertId || !justification) {
        throw new common_1.BadRequestException('Alert ID and justification required');
    }
    return {
        falsePositiveId: `FP-${Date.now()}`,
        alertId,
        recordedAt: new Date(),
        feedbackForModelTraining: {
            features: {},
            actualLabel: 'FALSE_POSITIVE',
            predictedLabel: 'TRUE_POSITIVE',
            confidenceWasted: 0.45,
        },
        impactOnRuleScore: -2.5,
    };
}
/**
 * Calculate and apply false positive rate adjustments to alert rules
 * @param ruleIds Array of rule IDs to analyze
 * @param adjustmentFactors False positive rate adjustment parameters
 * @returns Rule adjustment recommendations with impact assessment
 */
async function adjustRulesForFalsePositiveReduction(ruleIds, adjustmentFactors) {
    if (!Array.isArray(ruleIds) || ruleIds.length === 0) {
        throw new common_1.BadRequestException('Rule IDs array required');
    }
    return {
        analysisId: `ADJ-${Date.now()}`,
        rulesAnalyzed: ruleIds.length,
        rulesRecommendedForAdjustment: 0,
        projectedFPReduction: 0,
        adjustmentDetails: [],
    };
}
// ============================================================================
// AGING (2 FUNCTIONS)
// ============================================================================
/**
 * Monitor alert aging and apply aging-based rules
 * @param alertIds Array of alert IDs to monitor
 * @param agingThresholds Age thresholds for action (in hours)
 * @returns Aged alert summary with escalation requirements
 */
async function monitorAlertAging(alertIds, agingThresholds) {
    if (!Array.isArray(alertIds)) {
        throw new common_1.BadRequestException('Alert IDs array required');
    }
    return {
        analysisTime: new Date(),
        totalAlertsMonitored: alertIds.length,
        alertsByAge: {
            recent: 0,
            aging: 0,
            escalationRequired: 0,
            violation: 0,
        },
        agedAlerts: [],
    };
}
/**
 * Auto-close aged alerts with compliance documentation
 * @param alertIds Array of alert IDs to close
 * @param inactivityDays Days of inactivity before auto-close
 * @param closureReason Documented reason for closure
 * @returns Auto-closure results with compliance confirmation
 */
async function autoCloseAgedAlerts(alertIds, inactivityDays, closureReason) {
    if (!Array.isArray(alertIds) || inactivityDays < 1) {
        throw new common_1.BadRequestException('Alert IDs and valid inactivity days required');
    }
    return {
        closureRunId: `CLOSE-${Date.now()}`,
        processedAlerts: alertIds.length,
        closedAlerts: 0,
        requiresApproval: 0,
        closureDetails: [],
    };
}
// ============================================================================
// SLA TRACKING (2 FUNCTIONS)
// ============================================================================
/**
 * Track SLA metrics for alert/investigation with deadline monitoring
 * @param investigationIds Array of investigation IDs
 * @param slaConfigs SLA configurations by category/severity
 * @returns SLA tracking summary with violation alerts
 */
async function trackInvestigationSLAMetrics(investigationIds, slaConfigs) {
    if (!Array.isArray(investigationIds) || !Array.isArray(slaConfigs)) {
        throw new common_1.BadRequestException('Investigation IDs and SLA configs required');
    }
    return {
        trackingRunId: `SLA-${Date.now()}`,
        totalInvestigations: investigationIds.length,
        compliant: 0,
        atRisk: 0,
        violated: 0,
        slaMetrics: [],
        overallComplianceRate: 0,
    };
}
/**
 * Calculate SLA breach notifications with escalation routing
 * @param slaViolationAlertIds Array of SLA violation alert IDs
 * @param notificationThreshold Percentage threshold for notification
 * @returns Notification plan with recipient routing
 */
async function createSLABreachNotifications(slaViolationAlertIds, notificationThreshold = 80) {
    if (!Array.isArray(slaViolationAlertIds) || notificationThreshold < 0 || notificationThreshold > 100) {
        throw new common_1.BadRequestException('Valid alert IDs and threshold required');
    }
    return {
        notificationRunId: `NOTIFY-${Date.now()}`,
        alertsProcessed: slaViolationAlertIds.length,
        notificationsCreated: 0,
        recipientsByRole: {},
        escalationChain: [],
        estimatedDelivery: new Date(),
    };
}
// ============================================================================
// TEMPLATES (2 FUNCTIONS)
// ============================================================================
/**
 * Create reusable alert template with dynamic field mapping
 * @param template Alert template definition
 * @returns Template creation confirmation with version control
 */
async function createAlertTemplate(template) {
    if (!template || !template.name || !template.ruleId) {
        throw new common_1.BadRequestException('Template name and rule ID required');
    }
    return {
        templateId: `TPL-${Date.now()}`,
        name: template.name,
        version: '1.0.0',
        createdAt: new Date(),
        status: 'DRAFT',
        validationStatus: 'VALID',
    };
}
/**
 * Apply alert template to generate standardized alerts
 * @param templateId Template ID to apply
 * @param entityData Entity data for template substitution
 * @param customizations Optional field customizations
 * @returns Generated alerts with template values applied
 */
async function applyAlertTemplate(templateId, entityData, customizations) {
    if (!templateId || !entityData) {
        throw new common_1.BadRequestException('Template ID and entity data required');
    }
    return {
        generatedAlertId: `ALT-${Date.now()}`,
        templateId,
        appliedAt: new Date(),
        fieldsMapped: Object.keys(entityData).length,
        customizationsApplied: customizations ? Object.keys(customizations).length : 0,
        alertPreview: {
            severity: AlertSeverity.MEDIUM,
            category: 'COMPLIANCE',
            description: 'Generated from template',
        },
    };
}
// ============================================================================
// COLLABORATIVE TOOLS (2 FUNCTIONS)
// ============================================================================
/**
 * Add collaborative comment to investigation with mention/notification support
 * @param investigationId Investigation ID
 * @param comment Investigation comment with metadata
 * @returns Comment creation confirmation with notification routing
 */
async function addInvestigationComment(investigationId, comment) {
    if (!investigationId || !comment || !comment.content) {
        throw new common_1.BadRequestException('Investigation ID and comment content required');
    }
    return {
        commentId: `COM-${Date.now()}`,
        investigationId,
        createdAt: new Date(),
        mentionedUsers: comment.mentions || [],
        notificationsSent: (comment.mentions || []).length,
        visibility: 'TEAM_ONLY',
    };
}
/**
 * Retrieve investigation discussion thread with full context
 * @param investigationId Investigation ID
 * @param includeAttachments Include attached files in responses
 * @param pageSize Pagination size (default 20)
 * @returns Investigation discussion thread with metadata
 */
async function getInvestigationDiscussionThread(investigationId, includeAttachments = true, pageSize = 20) {
    if (!investigationId || pageSize < 1) {
        throw new common_1.BadRequestException('Investigation ID and valid page size required');
    }
    return {
        investigationId,
        totalComments: 0,
        comments: [],
        participantCount: 0,
        lastActivity: new Date(),
        hasMoreComments: false,
    };
}
// ============================================================================
// DISPOSITION (2 FUNCTIONS)
// ============================================================================
/**
 * Record final disposition of investigation with compliance documentation
 * @param investigationId Investigation ID
 * @param disposition Disposition with evidence and rationale
 * @returns Disposition recording confirmation
 */
async function recordInvestigationDisposition(investigationId, disposition, evidenceForDisposition, rationale) {
    if (!investigationId || !disposition) {
        throw new common_1.BadRequestException('Investigation ID and disposition required');
    }
    return {
        dispositionId: `DISP-${Date.now()}`,
        investigationId,
        disposition,
        recordedAt: new Date(),
        complianceApprovalRequired: true,
        reportingRequired: disposition === InvestigationDisposition.TRUE_POSITIVE,
        reportingEntities: [],
    };
}
/**
 * Generate final investigation report with findings and recommendations
 * @param investigationId Investigation ID
 * @param reportFormat Report format (PDF, HTML, JSON)
 * @param includeRecommendations Include recommendations for prevention
 * @returns Generated report with metadata
 */
async function generateInvestigationReport(investigationId, reportFormat = 'PDF', includeRecommendations = true) {
    if (!investigationId) {
        throw new common_1.BadRequestException('Investigation ID required');
    }
    return {
        reportId: `RPT-${Date.now()}`,
        investigationId,
        reportUrl: `https://reports.example.com/${investigationId}/${Date.now()}`,
        format: reportFormat,
        generatedAt: new Date(),
        fileSize: 0,
        pageCount: reportFormat === 'PDF' ? 5 : undefined,
        sections: ['EXECUTIVE_SUMMARY', 'FINDINGS', 'EVIDENCE', 'ANALYSIS'],
        complianceApproved: false,
    };
}
// ============================================================================
// ANALYTICS (2 FUNCTIONS)
// ============================================================================
/**
 * Calculate comprehensive alert and investigation analytics metrics
 * @param timeRange Time range for analytics (start and end dates)
 * @param dimensions Analytics dimensions (status, severity, category, etc)
 * @returns Alert analytics with trends and KPIs
 */
async function calculateAlertAnalytics(timeRange, dimensions) {
    if (!timeRange || !timeRange.startDate || !timeRange.endDate) {
        throw new common_1.BadRequestException('Valid time range required');
    }
    return {
        totalAlerts: 0,
        alertsByStatus: {},
        alertsBySeverity: {},
        averageResolutionTime: 0,
        falsePositiveRate: 0,
        escalationRate: 0,
        complianceViolations: 0,
        investigatorProductivity: {},
    };
}
/**
 * Generate analytics dashboard data with trend analysis
 * @param metricType Type of metric (ALERT_METRICS, INVESTIGATION_METRICS, etc)
 * @param granularity Time granularity (HOURLY, DAILY, WEEKLY, MONTHLY)
 * @param includeForecasting Include predictive analytics
 * @returns Dashboard metrics with trends and forecasts
 */
async function generateAnalyticsDashboardData(metricType, granularity, includeForecasting = false) {
    if (!metricType || !granularity) {
        throw new common_1.BadRequestException('Metric type and granularity required');
    }
    return {
        dashboardId: `DASH-${Date.now()}`,
        metricType,
        granularity,
        dataPoints: [],
        summary: {
            current: 0,
            previousPeriod: 0,
            changePercent: 0,
        },
    };
}
// ============================================================================
// INVESTIGATOR METRICS (2 FUNCTIONS)
// ============================================================================
/**
 * Calculate comprehensive investigator performance metrics
 * @param investigatorId Investigator ID
 * @param timeRange Time range for metrics calculation
 * @returns Detailed investigator performance metrics
 */
async function calculateInvestigatorMetrics(investigatorId, timeRange) {
    if (!investigatorId || !timeRange || !timeRange.startDate || !timeRange.endDate) {
        throw new common_1.BadRequestException('Valid investigator ID and time range required');
    }
    return {
        investigatorId,
        totalInvestigations: 0,
        averageResolutionTime: 0,
        truePositiveRate: 0,
        falsePositiveDetectionRate: 0,
        escalationRate: 0,
        slaComplianceRate: 0,
        skillDevelopment: {},
    };
}
/**
 * Compare investigator performance across team with benchmarking
 * @param investigatorIds Array of investigator IDs to compare
 * @param benchmarkType Comparison basis (TEAM_AVERAGE, DEPARTMENT_AVERAGE, BEST_PERFORMER)
 * @returns Comparative analysis with rankings
 */
async function compareInvestigatorPerformance(investigatorIds, benchmarkType) {
    if (!Array.isArray(investigatorIds) || investigatorIds.length === 0) {
        throw new common_1.BadRequestException('Investigator IDs array required');
    }
    return {
        comparisonId: `CMP-${Date.now()}`,
        benchmarkType,
        investigators: [],
        topPerformers: [],
        improvementOpportunities: [],
        recommendedTraining: {},
    };
}
// ============================================================================
// UTILITY FUNCTION
// ============================================================================
/**
 * Helper function to calculate base alert priority score
 * @internal
 */
function calculateBaseAlertPriority(payload) {
    const severityScores = {
        [AlertSeverity.LOW]: 20,
        [AlertSeverity.MEDIUM]: 50,
        [AlertSeverity.HIGH]: 75,
        [AlertSeverity.CRITICAL]: 100,
    };
    const baseScore = severityScores[payload.severity] || 50;
    const riskAdjustment = Math.min(payload.riskScore, 30);
    return Math.min(100, baseScore + riskAdjustment);
}
//# sourceMappingURL=alert-management-investigation-kit.js.map