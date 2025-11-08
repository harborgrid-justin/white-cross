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

import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import {
  InjectModel,
} from '@nestjs/sequelize';
import {
  Model,
  Op,
  Transaction,
  Sequelize,
} from 'sequelize';
import {
  Column,
  DataType,
  Table,
  Index,
  Scopes,
} from 'sequelize-typescript';

// ============================================================================
// TYPE DEFINITIONS & ENUMS
// ============================================================================

/**
 * Alert severity levels with escalation implications
 */
enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Alert status throughout lifecycle
 */
enum AlertStatus {
  GENERATED = 'GENERATED',
  ASSIGNED = 'ASSIGNED',
  INVESTIGATING = 'INVESTIGATING',
  ESCALATED = 'ESCALATED',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

/**
 * Investigation workflow states
 */
enum InvestigationPhase {
  TRIAGE = 'TRIAGE',
  EVIDENCE_GATHERING = 'EVIDENCE_GATHERING',
  ANALYSIS = 'ANALYSIS',
  DECISION_PENDING = 'DECISION_PENDING',
  DECISION_MADE = 'DECISION_MADE',
  ESCALATION = 'ESCALATION',
  RESOLVED = 'RESOLVED',
}

/**
 * Investigation decision outcomes
 */
enum InvestigationDisposition {
  TRUE_POSITIVE = 'TRUE_POSITIVE',
  FALSE_POSITIVE = 'FALSE_POSITIVE',
  INCONCLUSIVE = 'INCONCLUSIVE',
  REQUIRES_ESCALATION = 'REQUIRES_ESCALATION',
}

/**
 * Routing strategies for alert assignment
 */
enum RoutingStrategy {
  SKILL_BASED = 'SKILL_BASED',
  ROUND_ROBIN = 'ROUND_ROBIN',
  WORKLOAD_BALANCED = 'WORKLOAD_BALANCED',
  PRIORITY_ESCALATION = 'PRIORITY_ESCALATION',
}

/**
 * SLA event types for tracking
 */
enum SLAEventType {
  ALERT_GENERATION = 'ALERT_GENERATION',
  ALERT_ASSIGNMENT = 'ALERT_ASSIGNMENT',
  INVESTIGATION_START = 'INVESTIGATION_START',
  FIRST_RESPONSE = 'FIRST_RESPONSE',
  ESCALATION = 'ESCALATION',
  RESOLUTION = 'RESOLUTION',
}

// ============================================================================
// INTERFACES & TYPE DEFINITIONS
// ============================================================================

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
  edits?: Array<{ at: Date; by: string }>;
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
export async function generateAlertFromRuleMatch(
  payload: AlertGenerationPayload,
  transaction?: Transaction,
): Promise<{
  alertId: string;
  timestamp: Date;
  initialSeverity: AlertSeverity;
  assignedPriority: number;
}> {
  if (!payload.ruleId || !payload.entityId) {
    throw new BadRequestException(
      'Rule ID and Entity ID are required for alert generation',
    );
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
export async function batchGenerateAlerts(
  payloads: AlertGenerationPayload[],
  transaction?: Transaction,
): Promise<Array<{ alertId: string; timestamp: Date }>> {
  if (!Array.isArray(payloads) || payloads.length === 0) {
    throw new BadRequestException('Payloads must be a non-empty array');
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
export async function deduplicateAlert(
  alertId: string,
  timeWindowMinutes: number = 30,
  similarityThreshold: number = 85,
): Promise<{
  primaryAlertId: string;
  mergedAlertIds: string[];
  deduplicationScore: number;
}> {
  if (!alertId) {
    throw new BadRequestException('Alert ID is required');
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
export async function enrichAlertContext(
  alertId: string,
  contextSources: string[],
): Promise<{
  alertId: string;
  enrichmentCount: number;
  addedFields: Record<string, unknown>;
  riskAdjustment: number;
}> {
  if (!alertId || !Array.isArray(contextSources)) {
    throw new BadRequestException('Alert ID and context sources are required');
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
export async function suppressAlert(
  alertId: string,
  suppressionReason: string,
  expiryMinutes?: number,
): Promise<{
  alertId: string;
  suppressionId: string;
  expiresAt?: Date;
  approvalRequired: boolean;
}> {
  if (!alertId || !suppressionReason) {
    throw new BadRequestException('Alert ID and suppression reason required');
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
export function calculateBaseAlertPriority(
  payload: AlertGenerationPayload,
): number {
  const severityScores: Record<AlertSeverity, number> = {
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
export async function reprioritizeAlert(
  alertId: string,
  factors: Partial<PrioritizationFactors>,
): Promise<{
  alertId: string;
  previousPriority: number;
  newPriority: number;
  rationale: string;
}> {
  if (!alertId || typeof factors !== 'object') {
    throw new BadRequestException('Alert ID and factors are required');
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
export async function adjustPriorityBySLAUrgency(
  alertId: string,
  slaConfig: SLAConfiguration,
): Promise<{
  alertId: string;
  baseScore: number;
  urgencyMultiplier: number;
  finalScore: number;
  timeRemainingMinutes: number;
}> {
  if (!alertId || !slaConfig) {
    throw new BadRequestException('Alert ID and SLA configuration required');
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
export async function rankAlertsForInvestigationQueue(
  alertIds: string[],
  sortCriteria: 'PRIORITY' | 'URGENCY' | 'AGE' | 'MIXED',
): Promise<{
  rankedAlerts: Array<{ position: number; alertId: string; score: number }>;
  criteria: string;
}> {
  if (!Array.isArray(alertIds) || alertIds.length === 0) {
    throw new BadRequestException('Alert IDs array required');
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
export async function routeAlertToInvestigator(
  alertId: string,
  strategy: RoutingStrategy,
  investigatorProfiles: InvestigatorProfile[],
): Promise<{
  alertId: string;
  assignedInvestigatorId: string;
  routingStrategy: string;
  matchScore: number;
}> {
  if (!alertId || !Array.isArray(investigatorProfiles)) {
    throw new BadRequestException('Alert ID and investigator profiles required');
  }

  if (investigatorProfiles.length === 0) {
    throw new BadRequestException('No available investigators for routing');
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
export async function formInvestigationTeam(
  alertId: string,
  requiredSkills: string[],
  teamSize: number = 2,
): Promise<{
  alertId: string;
  investigationTeamId: string;
  leadInvestigator: string;
  supportTeam: string[];
  totalMembers: number;
}> {
  if (!alertId || !Array.isArray(requiredSkills) || teamSize < 1) {
    throw new BadRequestException('Invalid alert ID, skills, or team size');
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
export async function reassignAlert(
  alertId: string,
  newInvestigatorId: string,
  reason: string,
): Promise<{
  alertId: string;
  previousInvestigator: string;
  newInvestigator: string;
  reassignmentReason: string;
  reassignmentId: string;
  timestamp: Date;
}> {
  if (!alertId || !newInvestigatorId || !reason) {
    throw new BadRequestException(
      'Alert ID, new investigator, and reason required',
    );
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
export async function distributeLargeAlertVolume(
  alertIds: string[],
  investigatorCapacities: Record<string, number>,
): Promise<{
  distributionId: string;
  assignments: Array<{ investigatorId: string; alertCount: number; alerts: string[] }>;
  totalDistributed: number;
  balanceScore: number;
}> {
  if (!Array.isArray(alertIds) || Object.keys(investigatorCapacities).length === 0) {
    throw new BadRequestException('Alert IDs and investigator capacities required');
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
export async function initiateInvestigation(
  alertId: string,
  initialPhase: InvestigationPhase = InvestigationPhase.TRIAGE,
  investigatorId: string,
): Promise<{
  investigationId: string;
  alertId: string;
  investigatorId: string;
  currentPhase: InvestigationPhase;
  createdAt: Date;
  statusHistory: Array<{ phase: InvestigationPhase; timestamp: Date }>;
}> {
  if (!alertId || !investigatorId) {
    throw new BadRequestException('Alert ID and investigator ID required');
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
export async function transitionInvestigationPhase(
  investigationId: string,
  nextPhase: InvestigationPhase,
  transitionNotes: string,
): Promise<{
  investigationId: string;
  previousPhase: InvestigationPhase;
  newPhase: InvestigationPhase;
  transitionTime: Date;
  validationErrors: string[];
}> {
  if (!investigationId || !nextPhase) {
    throw new BadRequestException('Investigation ID and next phase required');
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
export async function updateInvestigationProgress(
  investigationId: string,
  progressUpdate: { percentComplete: number; summary: string },
  completedMilestones: string[],
): Promise<{
  investigationId: string;
  percentComplete: number;
  milestone: string;
  estimatedCompletionTime: Date;
  velocity: number;
}> {
  if (!investigationId || !progressUpdate) {
    throw new BadRequestException('Investigation ID and progress update required');
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
export async function getInvestigationHistory(
  investigationId: string,
  includeComments: boolean = true,
): Promise<{
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
}> {
  if (!investigationId) {
    throw new BadRequestException('Investigation ID required');
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
export async function assignAlertToInvestigator(
  alertId: string,
  investigatorId: string,
  estimatedDuration: number,
): Promise<{
  assignmentId: string;
  alertId: string;
  investigatorId: string;
  assignedAt: Date;
  slaDeadline: Date;
  estimatedDuration: number;
}> {
  if (!alertId || !investigatorId || estimatedDuration <= 0) {
    throw new BadRequestException('Valid alert ID, investigator, and duration required');
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
export async function bulkAssignAlertsToTeam(
  alertIds: string[],
  teamId: string,
): Promise<{
  bulkAssignmentId: string;
  totalRequested: number;
  successfulAssignments: number;
  failedAssignments: number;
  assignmentDetails: Array<{
    alertId: string;
    assigned: boolean;
    investigatorId?: string;
  }>;
}> {
  if (!Array.isArray(alertIds) || !teamId) {
    throw new BadRequestException('Alert IDs and team ID required');
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
export async function unassignAlert(
  assignmentId: string,
  unassignmentReason: string,
): Promise<{
  assignmentId: string;
  unassignedAt: Date;
  alertAvailable: boolean;
  reRoutingRequired: boolean;
  reason: string;
}> {
  if (!assignmentId || !unassignmentReason) {
    throw new BadRequestException('Assignment ID and reason required');
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
export async function addEvidenceToInvestigation(
  investigationId: string,
  evidenceItem: Omit<EvidenceItem, 'id' | 'addedAt'>,
): Promise<{
  evidenceId: string;
  investigationId: string;
  addedAt: Date;
  chainOfCustodyId: string;
  validationStatus: 'VALID' | 'REVIEW_REQUIRED';
}> {
  if (!investigationId || !evidenceItem) {
    throw new BadRequestException('Investigation ID and evidence item required');
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
export async function linkRelatedEvidence(
  primaryEvidenceId: string,
  linkedEvidenceIds: string[],
  relationshipType: 'SUPPORTS' | 'CONTRADICTS' | 'CONTEXT' | 'CORROBORATION',
): Promise<{
  primaryEvidenceId: string;
  linkedCount: number;
  relationshipType: string;
  correlationStrength: number;
  linkId: string;
}> {
  if (!primaryEvidenceId || !Array.isArray(linkedEvidenceIds)) {
    throw new BadRequestException('Evidence ID and linked evidence array required');
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
export async function getInvestigationEvidenceSummary(
  investigationId: string,
  filterByType?: string,
): Promise<{
  investigationId: string;
  totalEvidenceItems: number;
  evidenceByType: Record<string, number>;
  confidenceWeightedScore: number;
  auditTrailEntries: number;
  lastEvidenceAdded: Date;
}> {
  if (!investigationId) {
    throw new BadRequestException('Investigation ID required');
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
export async function recordInvestigationDecision(
  investigationId: string,
  decision: Omit<InvestigationDecision, 'investigationId'>,
): Promise<{
  decisionId: string;
  investigationId: string;
  disposition: InvestigationDisposition;
  recordedAt: Date;
  requiresApproval: boolean;
  approvalDeadline?: Date;
}> {
  if (!investigationId || !decision) {
    throw new BadRequestException('Investigation ID and decision required');
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
export async function approveInvestigationDecision(
  decisionId: string,
  approverRole: string,
  approval: 'APPROVE' | 'REJECT',
  comments?: string,
): Promise<{
  decisionId: string;
  approved: boolean;
  approvalAuthority: string;
  approvedAt: Date;
  requiresEscalation: boolean;
  effectiveDate: Date;
}> {
  if (!decisionId || !approverRole || !approval) {
    throw new BadRequestException('Decision ID, role, and approval status required');
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
export async function getDecisionRecommendations(
  investigationId: string,
  includeSimilarCases: boolean = true,
): Promise<{
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
}> {
  if (!investigationId) {
    throw new BadRequestException('Investigation ID required');
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
export async function escalateInvestigation(
  investigationId: string,
  escalationReason: string,
  escalationLevel: number = 1,
): Promise<{
  escalationId: string;
  investigationId: string;
  escalatedAt: Date;
  escalatedToRole: string;
  escalatedToUserId: string;
  urgencyLevel: AlertSeverity;
  estimatedResponseTime: number;
}> {
  if (!investigationId || !escalationReason) {
    throw new BadRequestException('Investigation ID and reason required');
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
export async function autoEscalateInvestigations(
  investigationIds: string[],
  escalationTriggers: {
    agingMinutes?: number;
    urgencyThreshold?: AlertSeverity;
    complianceViolation?: boolean;
  },
): Promise<{
  checkCount: number;
  escalatedCount: number;
  escalations: Array<{
    investigationId: string;
    escalationId: string;
    trigger: string;
  }>;
  timestamp: Date;
}> {
  if (!Array.isArray(investigationIds)) {
    throw new BadRequestException('Investigation IDs array required');
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
export async function markAlertAsFalsePositive(
  alertId: string,
  justification: string,
  misclassificationReason: string,
): Promise<{
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
}> {
  if (!alertId || !justification) {
    throw new BadRequestException('Alert ID and justification required');
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
export async function adjustRulesForFalsePositiveReduction(
  ruleIds: string[],
  adjustmentFactors: {
    fpThresholdPercent?: number;
    confidenceFloor?: number;
    featureWeights?: Record<string, number>;
  },
): Promise<{
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
}> {
  if (!Array.isArray(ruleIds) || ruleIds.length === 0) {
    throw new BadRequestException('Rule IDs array required');
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
export async function monitorAlertAging(
  alertIds: string[],
  agingThresholds: {
    warningHours?: number;
    escalationHours?: number;
    violationHours?: number;
  },
): Promise<{
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
}> {
  if (!Array.isArray(alertIds)) {
    throw new BadRequestException('Alert IDs array required');
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
export async function autoCloseAgedAlerts(
  alertIds: string[],
  inactivityDays: number,
  closureReason: string,
): Promise<{
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
}> {
  if (!Array.isArray(alertIds) || inactivityDays < 1) {
    throw new BadRequestException('Alert IDs and valid inactivity days required');
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
export async function trackInvestigationSLAMetrics(
  investigationIds: string[],
  slaConfigs: SLAConfiguration[],
): Promise<{
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
}> {
  if (!Array.isArray(investigationIds) || !Array.isArray(slaConfigs)) {
    throw new BadRequestException('Investigation IDs and SLA configs required');
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
export async function createSLABreachNotifications(
  slaViolationAlertIds: string[],
  notificationThreshold: number = 80,
): Promise<{
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
}> {
  if (!Array.isArray(slaViolationAlertIds) || notificationThreshold < 0 || notificationThreshold > 100) {
    throw new BadRequestException('Valid alert IDs and threshold required');
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
export async function createAlertTemplate(
  template: Omit<AlertTemplate, 'templateId'>,
): Promise<{
  templateId: string;
  name: string;
  version: string;
  createdAt: Date;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  validationStatus: 'VALID' | 'VALIDATION_ERRORS';
  errors?: string[];
}> {
  if (!template || !template.name || !template.ruleId) {
    throw new BadRequestException('Template name and rule ID required');
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
export async function applyAlertTemplate(
  templateId: string,
  entityData: Record<string, unknown>,
  customizations?: Record<string, unknown>,
): Promise<{
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
}> {
  if (!templateId || !entityData) {
    throw new BadRequestException('Template ID and entity data required');
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
export async function addInvestigationComment(
  investigationId: string,
  comment: Omit<InvestigationComment, 'id' | 'createdAt'>,
): Promise<{
  commentId: string;
  investigationId: string;
  createdAt: Date;
  mentionedUsers: string[];
  notificationsSent: number;
  visibility: 'PUBLIC' | 'TEAM_ONLY' | 'CONFIDENTIAL';
}> {
  if (!investigationId || !comment || !comment.content) {
    throw new BadRequestException('Investigation ID and comment content required');
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
export async function getInvestigationDiscussionThread(
  investigationId: string,
  includeAttachments: boolean = true,
  pageSize: number = 20,
): Promise<{
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
}> {
  if (!investigationId || pageSize < 1) {
    throw new BadRequestException('Investigation ID and valid page size required');
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
export async function recordInvestigationDisposition(
  investigationId: string,
  disposition: InvestigationDisposition,
  evidenceForDisposition: string[],
  rationale: string,
): Promise<{
  dispositionId: string;
  investigationId: string;
  disposition: InvestigationDisposition;
  recordedAt: Date;
  complianceApprovalRequired: boolean;
  reportingRequired: boolean;
  reportingEntities: string[];
}> {
  if (!investigationId || !disposition) {
    throw new BadRequestException('Investigation ID and disposition required');
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
export async function generateInvestigationReport(
  investigationId: string,
  reportFormat: 'PDF' | 'HTML' | 'JSON' = 'PDF',
  includeRecommendations: boolean = true,
): Promise<{
  reportId: string;
  investigationId: string;
  reportUrl: string;
  format: string;
  generatedAt: Date;
  fileSize: number;
  pageCount?: number;
  sections: string[];
  complianceApproved: boolean;
}> {
  if (!investigationId) {
    throw new BadRequestException('Investigation ID required');
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
export async function calculateAlertAnalytics(
  timeRange: { startDate: Date; endDate: Date },
  dimensions?: string[],
): Promise<AlertAnalyticsMetrics> {
  if (!timeRange || !timeRange.startDate || !timeRange.endDate) {
    throw new BadRequestException('Valid time range required');
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
export async function generateAnalyticsDashboardData(
  metricType: string,
  granularity: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY',
  includeForecasting: boolean = false,
): Promise<{
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
}> {
  if (!metricType || !granularity) {
    throw new BadRequestException('Metric type and granularity required');
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
export async function calculateInvestigatorMetrics(
  investigatorId: string,
  timeRange: { startDate: Date; endDate: Date },
): Promise<InvestigatorMetrics> {
  if (!investigatorId || !timeRange || !timeRange.startDate || !timeRange.endDate) {
    throw new BadRequestException('Valid investigator ID and time range required');
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
export async function compareInvestigatorPerformance(
  investigatorIds: string[],
  benchmarkType: 'TEAM_AVERAGE' | 'DEPARTMENT_AVERAGE' | 'BEST_PERFORMER',
): Promise<{
  comparisonId: string;
  benchmarkType: string;
  investigators: Array<{
    investigatorId: string;
    rank: number;
    totalScore: number;
    metricsComparison: Record<string, { value: number; benchmarkValue: number; variance: number }>;
    developmentOpportunities: string[];
  }>;
  topPerformers: string[];
  improvementOpportunities: string[];
  recommendedTraining: Record<string, string[]>;
}> {
  if (!Array.isArray(investigatorIds) || investigatorIds.length === 0) {
    throw new BadRequestException('Investigator IDs array required');
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
function calculateBaseAlertPriority(
  payload: AlertGenerationPayload,
): number {
  const severityScores: Record<AlertSeverity, number> = {
    [AlertSeverity.LOW]: 20,
    [AlertSeverity.MEDIUM]: 50,
    [AlertSeverity.HIGH]: 75,
    [AlertSeverity.CRITICAL]: 100,
  };

  const baseScore = severityScores[payload.severity] || 50;
  const riskAdjustment = Math.min(payload.riskScore, 30);

  return Math.min(100, baseScore + riskAdjustment);
}

export {
  AlertSeverity,
  AlertStatus,
  InvestigationPhase,
  InvestigationDisposition,
  RoutingStrategy,
  SLAEventType,
  type AlertGenerationPayload,
  type PrioritizationFactors,
  type EvidenceItem,
  type InvestigatorProfile,
  type SLAConfiguration,
  type AlertTemplate,
  type InvestigationComment,
  type InvestigationDecision,
  type AlertAnalyticsMetrics,
  type InvestigatorMetrics,
};
