/**
 * LOC: HCSUCC9002345
 * File: /reuse/server/human-capital/succession-planning-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable, decorators)
 *   - zod (validation schemas)
 *
 * DOWNSTREAM (imported by):
 *   - backend/human-capital/*
 *   - backend/controllers/succession-planning.controller.ts
 *   - backend/services/succession-planning.service.ts
 *   - backend/modules/talent-management.module.ts
 */
/**
 * File: /reuse/server/human-capital/succession-planning-kit.ts
 * Locator: WC-HC-SUCC-001
 * Purpose: SAP SuccessFactors-level Succession Planning - key position identification, successor readiness, talent pools, development plans, succession scenarios
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, Zod validation
 * Downstream: Succession planning controllers, talent services, leadership development, risk management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+, Zod 3.x
 * Exports: 46 production-ready functions for succession planning, readiness assessment, talent pools, 9-box grid, high-potential programs
 *
 * LLM Context: Enterprise-grade succession planning utilities competing with SAP SuccessFactors Succession Management.
 * Provides comprehensive key position identification and risk assessment, successor identification and readiness tracking,
 * talent pool management with development plans, succession readiness assessment and scoring, individual development plans
 * for successors, succession scenario modeling and planning, emergency succession protocols, succession timeline tracking,
 * talent review meeting facilitation, 9-box grid and talent matrix analysis, high-potential employee identification and
 * development programs, succession analytics and organizational risk assessment for business continuity.
 */
import { Sequelize, Transaction } from 'sequelize';
interface KeyPosition {
    positionId: string;
    positionTitle: string;
    department: string;
    businessUnit: string;
    reportingTo: string;
    jobLevel: string;
    criticalityLevel: 'critical' | 'high' | 'medium' | 'low';
    riskLevel: 'high_risk' | 'medium_risk' | 'low_risk';
    incumbentId?: string;
    incumbentTenure: number;
    retirementEligibilityDate?: Date;
    difficultToFill: boolean;
    businessImpactScore: number;
    uniqueSkillsRequired: string[];
    successorCount: number;
    readyNowCount: number;
    metadata?: Record<string, any>;
}
interface Successor {
    successorId: string;
    employeeId: string;
    positionId: string;
    readinessLevel: 'ready_now' | 'ready_1_year' | 'ready_2_3_years' | 'not_ready' | 'emergency_only';
    readinessScore: number;
    currentRole: string;
    experienceGap: string[];
    skillsGap: string[];
    developmentPriority: 'high' | 'medium' | 'low';
    developmentPlanId?: string;
    riskFactors: string[];
    retentionRisk: 'high' | 'medium' | 'low';
    lastAssessmentDate: Date;
    nextAssessmentDate: Date;
    nominatedBy: string;
    approvedBy?: string;
    isActive: boolean;
}
interface TalentPool {
    poolId: string;
    poolName: string;
    poolType: 'succession' | 'high_potential' | 'critical_skills' | 'leadership' | 'technical';
    targetPositions: string[];
    eligibilityCriteria: string[];
    members: string[];
    developmentFocus: string[];
    poolOwner: string;
    reviewFrequency: 'quarterly' | 'semi_annual' | 'annual';
    lastReviewDate: Date;
    nextReviewDate: Date;
    isActive: boolean;
    metadata?: Record<string, any>;
}
interface ReadinessAssessment {
    assessmentId: string;
    successorId: string;
    employeeId: string;
    targetPositionId: string;
    assessmentDate: Date;
    assessedBy: string;
    readinessScore: number;
    competencyScores: CompetencyScore[];
    experienceEvaluation: ExperienceEvaluation;
    leadershipReadiness: number;
    technicalReadiness: number;
    strengthsIdentified: string[];
    developmentNeeds: string[];
    recommendedActions: string[];
    timeToReadiness: number;
    overallRecommendation: 'ready_now' | 'ready_soon' | 'needs_development' | 'not_recommended';
}
interface CompetencyScore {
    competencyId: string;
    competencyName: string;
    requiredLevel: number;
    currentLevel: number;
    gap: number;
    assessmentNotes: string;
}
interface ExperienceEvaluation {
    yearsInCurrentRole: number;
    yearsInCompany: number;
    relevantExperience: string[];
    criticalExperienceGaps: string[];
    crossFunctionalExperience: boolean;
    internationalExperience: boolean;
    leadershipExperience: string[];
}
interface DevelopmentPlan {
    planId: string;
    employeeId: string;
    targetPositionId: string;
    planType: 'succession' | 'career' | 'performance' | 'leadership';
    startDate: Date;
    targetCompletionDate: Date;
    developmentGoals: DevelopmentGoal[];
    developmentActivities: DevelopmentActivity[];
    milestones: Milestone[];
    mentor?: string;
    coach?: string;
    sponsor?: string;
    budget?: number;
    status: 'active' | 'on_track' | 'at_risk' | 'completed' | 'cancelled';
    progressPercentage: number;
    lastReviewDate: Date;
    nextReviewDate: Date;
}
interface DevelopmentGoal {
    goalId: string;
    description: string;
    targetCompetency: string;
    measureOfSuccess: string;
    targetDate: Date;
    status: 'not_started' | 'in_progress' | 'completed';
    progress: number;
}
interface DevelopmentActivity {
    activityId: string;
    activityType: 'training' | 'coaching' | 'mentoring' | 'stretch_assignment' | 'job_rotation' | 'project_lead' | 'shadowing';
    title: string;
    description: string;
    provider?: string;
    startDate: Date;
    endDate: Date;
    cost?: number;
    status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
    completionPercentage: number;
    outcomeNotes?: string;
}
interface Milestone {
    milestoneId: string;
    description: string;
    targetDate: Date;
    completionDate?: Date;
    status: 'pending' | 'completed' | 'missed';
    dependencies: string[];
}
interface SuccessionScenario {
    scenarioId: string;
    scenarioName: string;
    scenarioType: 'planned' | 'emergency' | 'retirement' | 'expansion' | 'restructure';
    affectedPositions: string[];
    plannedDate?: Date;
    probability: number;
    impact: 'high' | 'medium' | 'low';
    proposedSuccessions: ProposedSuccession[];
    contingencyPlan?: string;
    riskMitigations: string[];
    approvalStatus: 'draft' | 'pending_review' | 'approved' | 'rejected';
    createdBy: string;
    approvedBy?: string;
}
interface ProposedSuccession {
    positionId: string;
    currentIncumbent?: string;
    proposedSuccessor: string;
    proposedSuccessorName: string;
    readinessLevel: string;
    transitionDate: Date;
    developmentRequired: string[];
    riskFactors: string[];
}
interface EmergencySuccessionPlan {
    planId: string;
    positionId: string;
    primarySuccessor: string;
    backupSuccessors: string[];
    emergencyContacts: EmergencyContact[];
    criticalKnowledgeDocumentation: string[];
    transitionChecklist: string[];
    communicationPlan: string;
    stakeholderNotification: string[];
    activationTriggers: string[];
    lastReviewDate: Date;
    nextReviewDate: Date;
}
interface EmergencyContact {
    contactId: string;
    name: string;
    role: string;
    phone: string;
    email: string;
    availability: string;
}
interface SuccessionTimeline {
    timelineId: string;
    positionId: string;
    plannedSuccessionDate: Date;
    incumbentDepartureReason: 'retirement' | 'promotion' | 'transfer' | 'resignation' | 'termination' | 'other';
    selectedSuccessor: string;
    developmentCompletionDate: Date;
    transitionStartDate: Date;
    transitionEndDate: Date;
    transitionPhases: TransitionPhase[];
    status: 'planned' | 'in_progress' | 'completed' | 'delayed';
    delayReasons?: string[];
}
interface TransitionPhase {
    phaseId: string;
    phaseName: string;
    startDate: Date;
    endDate: Date;
    activities: string[];
    responsibilities: string[];
    status: 'pending' | 'active' | 'completed';
    completionPercentage: number;
}
interface TalentReviewMeeting {
    meetingId: string;
    meetingDate: Date;
    meetingType: 'annual' | 'quarterly' | 'ad_hoc';
    organizationalScope: string;
    attendees: string[];
    facilitator: string;
    agenda: string[];
    positionsReviewed: string[];
    employeesDiscussed: string[];
    decisions: TalentDecision[];
    actionItems: ActionItem[];
    nextMeetingDate?: Date;
    meetingNotes: string;
}
interface TalentDecision {
    decisionId: string;
    decisionType: 'succession_plan' | 'promotion' | 'development' | 'talent_pool' | 'compensation' | 'retention';
    employeeId?: string;
    positionId?: string;
    decision: string;
    rationale: string;
    approvedBy: string[];
    effectiveDate: Date;
    followUpRequired: boolean;
}
interface ActionItem {
    itemId: string;
    description: string;
    assignedTo: string;
    dueDate: Date;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'in_progress' | 'completed';
    completionDate?: Date;
}
interface NineBoxPosition {
    employeeId: string;
    performanceRating: 'low' | 'medium' | 'high';
    potentialRating: 'low' | 'medium' | 'high';
    boxPosition: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    category: 'high_potential' | 'solid_performer' | 'inconsistent' | 'new_to_role' | 'low_performer' | 'key_player' | 'rising_star' | 'future_leader' | 'trusted_professional';
    recommendedActions: string[];
    retentionRisk: 'high' | 'medium' | 'low';
    developmentPriority: 'high' | 'medium' | 'low';
    lastPlacementDate: Date;
}
interface TalentMatrix {
    matrixId: string;
    matrixType: '9_box' | 'skills_matrix' | 'readiness_matrix' | 'risk_matrix';
    organizationalScope: string;
    reviewPeriod: string;
    employees: TalentMatrixEntry[];
    analytics: {
        distributionByBox: Record<string, number>;
        highPotentialCount: number;
        successionReadyCount: number;
        developmentPriority: Record<string, number>;
    };
    createdDate: Date;
    lastUpdated: Date;
}
interface TalentMatrixEntry {
    employeeId: string;
    employeeName: string;
    currentRole: string;
    department: string;
    performanceRating: string;
    potentialRating: string;
    matrixPosition: string;
    notes: string;
}
interface HighPotentialProgram {
    programId: string;
    programName: string;
    cohort: string;
    startDate: Date;
    endDate: Date;
    participants: string[];
    selectionCriteria: string[];
    programComponents: ProgramComponent[];
    expectedOutcomes: string[];
    programSponsor: string;
    budget: number;
    status: 'planning' | 'active' | 'completed';
    successMetrics: Record<string, any>;
}
interface ProgramComponent {
    componentId: string;
    componentType: 'leadership_training' | 'executive_coaching' | 'strategic_project' | 'mentoring' | 'networking';
    title: string;
    description: string;
    duration: number;
    facilitator?: string;
    completionRequired: boolean;
}
interface SuccessionRisk {
    positionId: string;
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
    riskFactors: RiskFactor[];
    overallRiskScore: number;
    mitigationStrategies: string[];
    contingencyPlans: string[];
    lastAssessmentDate: Date;
    nextAssessmentDate: Date;
}
interface RiskFactor {
    factor: string;
    severity: 'high' | 'medium' | 'low';
    likelihood: 'high' | 'medium' | 'low';
    impact: string;
    mitigation: string;
}
interface SuccessionAnalytics {
    reportDate: Date;
    organizationalScope: string;
    metrics: {
        totalKeyPositions: number;
        positionsWithSuccessors: number;
        successionCoverage: number;
        readyNowSuccessors: number;
        averageReadinessScore: number;
        highRiskPositions: number;
        retirementEligibleCount: number;
        talentPoolMembers: number;
        developmentPlansActive: number;
        averageSuccessorDepth: number;
    };
    risks: {
        criticalGaps: number;
        singlePointsOfFailure: number;
        retirementRisk: number;
        flightRisk: number;
    };
    trends: {
        successionCoverageGrowth: number;
        readinessImprovement: number;
        developmentPlanCompletion: number;
    };
}
export declare const KeyPositionSchema: any;
export declare const SuccessorSchema: any;
export declare const TalentPoolSchema: any;
export declare const DevelopmentPlanSchema: any;
export declare const NineBoxPositionSchema: any;
/**
 * Key Position model for identifying critical organizational positions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} KeyPosition model
 *
 * @example
 * ```typescript
 * const KeyPosition = createKeyPositionModel(sequelize);
 * const position = await KeyPosition.create({
 *   positionTitle: 'Chief Technology Officer',
 *   department: 'Technology',
 *   businessUnit: 'Corporate',
 *   reportingTo: 'CEO',
 *   jobLevel: 'C-Level',
 *   criticalityLevel: 'critical',
 *   riskLevel: 'high_risk',
 *   difficultToFill: true,
 *   businessImpactScore: 95
 * });
 * ```
 */
export declare const createKeyPositionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        positionId: string;
        positionTitle: string;
        department: string;
        businessUnit: string;
        reportingTo: string;
        jobLevel: string;
        criticalityLevel: string;
        riskLevel: string;
        incumbentId: string | null;
        incumbentTenure: number;
        retirementEligibilityDate: Date | null;
        difficultToFill: boolean;
        businessImpactScore: number;
        uniqueSkillsRequired: string[];
        successorCount: number;
        readyNowCount: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Successor model for tracking succession candidates.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Successor model
 *
 * @example
 * ```typescript
 * const Successor = createSuccessorModel(sequelize);
 * const successor = await Successor.create({
 *   employeeId: 'emp-uuid',
 *   positionId: 'pos-uuid',
 *   readinessLevel: 'ready_1_year',
 *   readinessScore: 75,
 *   currentRole: 'Senior Director',
 *   developmentPriority: 'high',
 *   retentionRisk: 'low',
 *   nominatedBy: 'mgr-uuid'
 * });
 * ```
 */
export declare const createSuccessorModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        successorId: string;
        employeeId: string;
        positionId: string;
        readinessLevel: string;
        readinessScore: number;
        currentRole: string;
        experienceGap: string[];
        skillsGap: string[];
        developmentPriority: string;
        developmentPlanId: string | null;
        riskFactors: string[];
        retentionRisk: string;
        lastAssessmentDate: Date;
        nextAssessmentDate: Date;
        nominatedBy: string;
        approvedBy: string | null;
        isActive: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Talent Pool model for managing succession talent pools.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TalentPool model
 *
 * @example
 * ```typescript
 * const TalentPool = createTalentPoolModel(sequelize);
 * const pool = await TalentPool.create({
 *   poolName: 'Executive Leadership Pipeline',
 *   poolType: 'succession',
 *   targetPositions: ['CEO', 'COO', 'CFO'],
 *   eligibilityCriteria: ['VP level', '10+ years experience'],
 *   poolOwner: 'CHRO',
 *   reviewFrequency: 'quarterly'
 * });
 * ```
 */
export declare const createTalentPoolModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        poolId: string;
        poolName: string;
        poolType: string;
        targetPositions: string[];
        eligibilityCriteria: string[];
        members: string[];
        developmentFocus: string[];
        poolOwner: string;
        reviewFrequency: string;
        lastReviewDate: Date;
        nextReviewDate: Date;
        isActive: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * 1. Identifies and registers a key position for succession planning.
 *
 * @param {Omit<KeyPosition, 'positionId' | 'successorCount' | 'readyNowCount'>} positionData - Position data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<KeyPosition>} Created key position
 *
 * @example
 * ```typescript
 * const keyPos = await identifyKeyPosition({
 *   positionTitle: 'VP of Engineering',
 *   department: 'Engineering',
 *   businessUnit: 'Technology',
 *   reportingTo: 'CTO',
 *   jobLevel: 'VP',
 *   criticalityLevel: 'critical',
 *   riskLevel: 'high_risk',
 *   incumbentId: 'emp-123',
 *   incumbentTenure: 48,
 *   difficultToFill: true,
 *   businessImpactScore: 90,
 *   uniqueSkillsRequired: ['Technical Leadership', 'Cloud Architecture']
 * });
 * ```
 */
export declare function identifyKeyPosition(positionData: Omit<KeyPosition, 'positionId' | 'successorCount' | 'readyNowCount'>, transaction?: Transaction): Promise<KeyPosition>;
/**
 * 2. Assesses succession risk for a key position.
 *
 * @param {string} positionId - Position ID
 * @returns {Promise<SuccessionRisk>} Risk assessment
 *
 * @example
 * ```typescript
 * const risk = await assessKeyPositionRisk('kp-123');
 * console.log(`Risk level: ${risk.riskLevel}`);
 * console.log(`Overall score: ${risk.overallRiskScore}`);
 * ```
 */
export declare function assessKeyPositionRisk(positionId: string): Promise<SuccessionRisk>;
/**
 * 3. Updates key position information including successor counts.
 *
 * @param {string} positionId - Position ID
 * @param {Partial<KeyPosition>} updates - Updates to apply
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<KeyPosition>} Updated position
 *
 * @example
 * ```typescript
 * await updateKeyPosition('kp-123', {
 *   successorCount: 3,
 *   readyNowCount: 1,
 *   riskLevel: 'medium_risk'
 * });
 * ```
 */
export declare function updateKeyPosition(positionId: string, updates: Partial<KeyPosition>, transaction?: Transaction): Promise<KeyPosition>;
/**
 * 4. Lists all key positions with filtering.
 *
 * @param {object} filters - Filter criteria
 * @returns {Promise<KeyPosition[]>} Key positions
 *
 * @example
 * ```typescript
 * const criticalPositions = await listKeyPositions({
 *   criticalityLevel: 'critical',
 *   riskLevel: 'high_risk',
 *   successorCount: 0
 * });
 * ```
 */
export declare function listKeyPositions(filters?: {
    department?: string;
    businessUnit?: string;
    criticalityLevel?: string;
    riskLevel?: string;
    successorCount?: number;
}): Promise<KeyPosition[]>;
/**
 * 5. Calculates business impact score for a position.
 *
 * @param {string} positionId - Position ID
 * @param {object} factors - Impact factors
 * @returns {Promise<{ score: number; breakdown: Record<string, number> }>} Impact score
 *
 * @example
 * ```typescript
 * const impact = await calculateBusinessImpact('kp-123', {
 *   revenueImpact: 85,
 *   customerImpact: 90,
 *   employeeImpact: 75,
 *   strategicImportance: 95
 * });
 * ```
 */
export declare function calculateBusinessImpact(positionId: string, factors: Record<string, number>): Promise<{
    score: number;
    breakdown: Record<string, number>;
}>;
/**
 * 6. Identifies positions at high retirement risk.
 *
 * @param {number} monthsThreshold - Months until retirement eligibility
 * @returns {Promise<KeyPosition[]>} At-risk positions
 *
 * @example
 * ```typescript
 * const atRiskPositions = await identifyRetirementRiskPositions(24);
 * console.log(`${atRiskPositions.length} positions at retirement risk`);
 * ```
 */
export declare function identifyRetirementRiskPositions(monthsThreshold: number): Promise<KeyPosition[]>;
/**
 * 7. Nominates a successor for a key position.
 *
 * @param {Omit<Successor, 'successorId' | 'lastAssessmentDate' | 'isActive'>} successorData - Successor data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<Successor>} Created successor record
 *
 * @example
 * ```typescript
 * const successor = await nominateSuccessor({
 *   employeeId: 'emp-456',
 *   positionId: 'kp-123',
 *   readinessLevel: 'ready_1_year',
 *   readinessScore: 75,
 *   currentRole: 'Director of Engineering',
 *   experienceGap: ['P&L management', 'Board presentations'],
 *   skillsGap: ['Strategic planning'],
 *   developmentPriority: 'high',
 *   riskFactors: [],
 *   retentionRisk: 'low',
 *   nextAssessmentDate: new Date('2025-06-01'),
 *   nominatedBy: 'CTO'
 * });
 * ```
 */
export declare function nominateSuccessor(successorData: Omit<Successor, 'successorId' | 'lastAssessmentDate' | 'isActive'>, transaction?: Transaction): Promise<Successor>;
/**
 * 8. Conducts readiness assessment for a successor.
 *
 * @param {string} successorId - Successor ID
 * @param {Omit<ReadinessAssessment, 'assessmentId'>} assessmentData - Assessment data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<ReadinessAssessment>} Assessment result
 *
 * @example
 * ```typescript
 * const assessment = await conductReadinessAssessment('suc-123', {
 *   successorId: 'suc-123',
 *   employeeId: 'emp-456',
 *   targetPositionId: 'kp-789',
 *   assessmentDate: new Date(),
 *   assessedBy: 'talent-team',
 *   readinessScore: 78,
 *   competencyScores: [...],
 *   experienceEvaluation: {...},
 *   leadershipReadiness: 80,
 *   technicalReadiness: 85,
 *   strengthsIdentified: ['Technical expertise', 'Team leadership'],
 *   developmentNeeds: ['Strategic thinking', 'Financial acumen'],
 *   recommendedActions: ['Executive coaching', 'Finance training'],
 *   timeToReadiness: 12,
 *   overallRecommendation: 'ready_soon'
 * });
 * ```
 */
export declare function conductReadinessAssessment(successorId: string, assessmentData: Omit<ReadinessAssessment, 'assessmentId'>, transaction?: Transaction): Promise<ReadinessAssessment>;
/**
 * 9. Updates successor readiness level based on assessment.
 *
 * @param {string} successorId - Successor ID
 * @param {object} readinessUpdate - Readiness update data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<Successor>} Updated successor
 *
 * @example
 * ```typescript
 * await updateSuccessorReadiness('suc-123', {
 *   readinessLevel: 'ready_now',
 *   readinessScore: 92,
 *   skillsGap: [],
 *   nextAssessmentDate: new Date('2025-12-01')
 * });
 * ```
 */
export declare function updateSuccessorReadiness(successorId: string, readinessUpdate: {
    readinessLevel?: string;
    readinessScore?: number;
    experienceGap?: string[];
    skillsGap?: string[];
    nextAssessmentDate?: Date;
}, transaction?: Transaction): Promise<Successor>;
/**
 * 10. Lists successors for a key position with readiness filtering.
 *
 * @param {string} positionId - Position ID
 * @param {object} filters - Filter criteria
 * @returns {Promise<Successor[]>} Successors
 *
 * @example
 * ```typescript
 * const readySuccessors = await listSuccessorsForPosition('kp-123', {
 *   readinessLevel: ['ready_now', 'ready_1_year'],
 *   isActive: true
 * });
 * ```
 */
export declare function listSuccessorsForPosition(positionId: string, filters?: {
    readinessLevel?: string[];
    developmentPriority?: string;
    isActive?: boolean;
}): Promise<Successor[]>;
/**
 * 11. Calculates successor depth (bench strength) for a position.
 *
 * @param {string} positionId - Position ID
 * @returns {Promise<{ total: number; readyNow: number; ready1Year: number; ready2Plus: number; depth: string }>} Successor depth
 *
 * @example
 * ```typescript
 * const depth = await calculateSuccessorDepth('kp-123');
 * console.log(`Bench strength: ${depth.depth}`);
 * ```
 */
export declare function calculateSuccessorDepth(positionId: string): Promise<{
    total: number;
    readyNow: number;
    ready1Year: number;
    ready2Plus: number;
    depth: string;
}>;
/**
 * 12. Compares multiple successors for a position.
 *
 * @param {string} positionId - Position ID
 * @param {string[]} successorIds - Successor IDs to compare
 * @returns {Promise<Array<{ successorId: string; scores: Record<string, number>; ranking: number }>>} Comparison
 *
 * @example
 * ```typescript
 * const comparison = await compareSuccessors('kp-123', ['suc-1', 'suc-2', 'suc-3']);
 * comparison.forEach(c => console.log(`Rank ${c.ranking}: ${c.successorId}`));
 * ```
 */
export declare function compareSuccessors(positionId: string, successorIds: string[]): Promise<Array<{
    successorId: string;
    scores: Record<string, number>;
    ranking: number;
}>>;
/**
 * 13. Deactivates a successor nomination.
 *
 * @param {string} successorId - Successor ID
 * @param {string} reason - Deactivation reason
 * @param {string} deactivatedBy - User performing action
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await deactivateSuccessor('suc-123', 'Employee left company', 'hr-admin');
 * ```
 */
export declare function deactivateSuccessor(successorId: string, reason: string, deactivatedBy: string, transaction?: Transaction): Promise<boolean>;
/**
 * 14. Creates a succession talent pool.
 *
 * @param {Omit<TalentPool, 'poolId' | 'lastReviewDate'>} poolData - Pool data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<TalentPool>} Created pool
 *
 * @example
 * ```typescript
 * const pool = await createTalentPool({
 *   poolName: 'C-Suite Pipeline',
 *   poolType: 'succession',
 *   targetPositions: ['CEO', 'CFO', 'COO'],
 *   eligibilityCriteria: ['SVP or higher', '15+ years experience'],
 *   members: ['emp-1', 'emp-2'],
 *   developmentFocus: ['Strategic leadership', 'Board governance'],
 *   poolOwner: 'CHRO',
 *   reviewFrequency: 'quarterly',
 *   nextReviewDate: new Date('2025-03-31'),
 *   isActive: true
 * });
 * ```
 */
export declare function createTalentPool(poolData: Omit<TalentPool, 'poolId' | 'lastReviewDate'>, transaction?: Transaction): Promise<TalentPool>;
/**
 * 15. Adds members to a talent pool.
 *
 * @param {string} poolId - Pool ID
 * @param {string[]} employeeIds - Employee IDs to add
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<TalentPool>} Updated pool
 *
 * @example
 * ```typescript
 * await addMembersToTalentPool('tp-123', ['emp-456', 'emp-789']);
 * ```
 */
export declare function addMembersToTalentPool(poolId: string, employeeIds: string[], transaction?: Transaction): Promise<TalentPool>;
/**
 * 16. Removes members from a talent pool.
 *
 * @param {string} poolId - Pool ID
 * @param {string[]} employeeIds - Employee IDs to remove
 * @param {string} reason - Removal reason
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<TalentPool>} Updated pool
 *
 * @example
 * ```typescript
 * await removeMembersFromTalentPool('tp-123', ['emp-456'], 'No longer meets criteria');
 * ```
 */
export declare function removeMembersFromTalentPool(poolId: string, employeeIds: string[], reason: string, transaction?: Transaction): Promise<TalentPool>;
/**
 * 17. Reviews and updates talent pool membership.
 *
 * @param {string} poolId - Pool ID
 * @param {object} reviewData - Review data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<TalentPool>} Updated pool
 *
 * @example
 * ```typescript
 * await reviewTalentPool('tp-123', {
 *   reviewDate: new Date(),
 *   reviewedBy: 'talent-committee',
 *   membersAdded: ['emp-999'],
 *   membersRemoved: ['emp-111'],
 *   nextReviewDate: new Date('2025-09-30')
 * });
 * ```
 */
export declare function reviewTalentPool(poolId: string, reviewData: {
    reviewDate: Date;
    reviewedBy: string;
    membersAdded?: string[];
    membersRemoved?: string[];
    nextReviewDate: Date;
}, transaction?: Transaction): Promise<TalentPool>;
/**
 * 18. Lists all talent pools with filtering.
 *
 * @param {object} filters - Filter criteria
 * @returns {Promise<TalentPool[]>} Talent pools
 *
 * @example
 * ```typescript
 * const successionPools = await listTalentPools({
 *   poolType: 'succession',
 *   isActive: true
 * });
 * ```
 */
export declare function listTalentPools(filters?: {
    poolType?: string;
    poolOwner?: string;
    isActive?: boolean;
}): Promise<TalentPool[]>;
/**
 * 19. Creates a development plan for a successor.
 *
 * @param {Omit<DevelopmentPlan, 'planId' | 'status' | 'progressPercentage' | 'lastReviewDate'>} planData - Plan data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<DevelopmentPlan>} Created plan
 *
 * @example
 * ```typescript
 * const plan = await createSuccessorDevelopmentPlan({
 *   employeeId: 'emp-456',
 *   targetPositionId: 'kp-123',
 *   planType: 'succession',
 *   startDate: new Date(),
 *   targetCompletionDate: new Date('2026-06-30'),
 *   developmentGoals: [...],
 *   developmentActivities: [...],
 *   milestones: [...],
 *   mentor: 'exec-789',
 *   coach: 'coach-111',
 *   budget: 25000,
 *   nextReviewDate: new Date('2025-03-01')
 * });
 * ```
 */
export declare function createSuccessorDevelopmentPlan(planData: Omit<DevelopmentPlan, 'planId' | 'status' | 'progressPercentage' | 'lastReviewDate'>, transaction?: Transaction): Promise<DevelopmentPlan>;
/**
 * 20. Updates development plan progress.
 *
 * @param {string} planId - Plan ID
 * @param {object} progressUpdate - Progress update
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<DevelopmentPlan>} Updated plan
 *
 * @example
 * ```typescript
 * await updateDevelopmentPlanProgress('dp-123', {
 *   progressPercentage: 45,
 *   status: 'on_track',
 *   completedGoals: ['goal-1', 'goal-2'],
 *   lastReviewDate: new Date()
 * });
 * ```
 */
export declare function updateDevelopmentPlanProgress(planId: string, progressUpdate: {
    progressPercentage?: number;
    status?: string;
    completedGoals?: string[];
    lastReviewDate?: Date;
}, transaction?: Transaction): Promise<DevelopmentPlan>;
/**
 * 21. Adds development activity to a plan.
 *
 * @param {string} planId - Plan ID
 * @param {DevelopmentActivity} activity - Activity to add
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<DevelopmentPlan>} Updated plan
 *
 * @example
 * ```typescript
 * await addDevelopmentActivity('dp-123', {
 *   activityId: 'act-1',
 *   activityType: 'coaching',
 *   title: 'Executive Leadership Coaching',
 *   description: '12-session executive coaching program',
 *   provider: 'Leadership Institute',
 *   startDate: new Date(),
 *   endDate: new Date('2025-12-31'),
 *   cost: 15000,
 *   status: 'planned',
 *   completionPercentage: 0
 * });
 * ```
 */
export declare function addDevelopmentActivity(planId: string, activity: DevelopmentActivity, transaction?: Transaction): Promise<DevelopmentPlan>;
/**
 * 22. Retrieves development plans for an employee.
 *
 * @param {string} employeeId - Employee ID
 * @param {object} filters - Optional filters
 * @returns {Promise<DevelopmentPlan[]>} Development plans
 *
 * @example
 * ```typescript
 * const plans = await getEmployeeDevelopmentPlans('emp-456', {
 *   planType: 'succession',
 *   status: 'active'
 * });
 * ```
 */
export declare function getEmployeeDevelopmentPlans(employeeId: string, filters?: {
    planType?: string;
    status?: string;
}): Promise<DevelopmentPlan[]>;
/**
 * 23. Creates a succession scenario for planning purposes.
 *
 * @param {Omit<SuccessionScenario, 'scenarioId'>} scenarioData - Scenario data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<SuccessionScenario>} Created scenario
 *
 * @example
 * ```typescript
 * const scenario = await createSuccessionScenario({
 *   scenarioName: 'Q3 2025 Executive Transitions',
 *   scenarioType: 'planned',
 *   affectedPositions: ['kp-1', 'kp-2', 'kp-3'],
 *   plannedDate: new Date('2025-09-01'),
 *   probability: 85,
 *   impact: 'high',
 *   proposedSuccessions: [...],
 *   riskMitigations: ['Knowledge transfer', 'Overlapping transition'],
 *   approvalStatus: 'pending_review',
 *   createdBy: 'talent-team'
 * });
 * ```
 */
export declare function createSuccessionScenario(scenarioData: Omit<SuccessionScenario, 'scenarioId'>, transaction?: Transaction): Promise<SuccessionScenario>;
/**
 * 24. Models impact of succession scenario on organization.
 *
 * @param {string} scenarioId - Scenario ID
 * @returns {Promise<{ organizationalImpact: string; riskScore: number; affectedEmployees: number; recommendations: string[] }>} Impact analysis
 *
 * @example
 * ```typescript
 * const impact = await modelSuccessionScenario('sc-123');
 * console.log('Risk score:', impact.riskScore);
 * console.log('Recommendations:', impact.recommendations);
 * ```
 */
export declare function modelSuccessionScenario(scenarioId: string): Promise<{
    organizationalImpact: string;
    riskScore: number;
    affectedEmployees: number;
    recommendations: string[];
}>;
/**
 * 25. Approves or rejects a succession scenario.
 *
 * @param {string} scenarioId - Scenario ID
 * @param {object} approvalData - Approval data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<SuccessionScenario>} Updated scenario
 *
 * @example
 * ```typescript
 * await approveSuccessionScenario('sc-123', {
 *   approvalStatus: 'approved',
 *   approvedBy: 'CEO',
 *   approvalNotes: 'Approved with conditions'
 * });
 * ```
 */
export declare function approveSuccessionScenario(scenarioId: string, approvalData: {
    approvalStatus: 'approved' | 'rejected';
    approvedBy: string;
    approvalNotes?: string;
}, transaction?: Transaction): Promise<SuccessionScenario>;
/**
 * 26. Lists succession scenarios with filtering.
 *
 * @param {object} filters - Filter criteria
 * @returns {Promise<SuccessionScenario[]>} Scenarios
 *
 * @example
 * ```typescript
 * const plannedScenarios = await listSuccessionScenarios({
 *   scenarioType: 'planned',
 *   approvalStatus: 'approved'
 * });
 * ```
 */
export declare function listSuccessionScenarios(filters?: {
    scenarioType?: string;
    approvalStatus?: string;
    impact?: string;
}): Promise<SuccessionScenario[]>;
/**
 * 27. Creates an emergency succession plan for a critical position.
 *
 * @param {Omit<EmergencySuccessionPlan, 'planId' | 'lastReviewDate'>} planData - Plan data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<EmergencySuccessionPlan>} Created plan
 *
 * @example
 * ```typescript
 * const emergencyPlan = await createEmergencySuccessionPlan({
 *   positionId: 'kp-123',
 *   primarySuccessor: 'emp-456',
 *   backupSuccessors: ['emp-789', 'emp-111'],
 *   emergencyContacts: [...],
 *   criticalKnowledgeDocumentation: ['Process docs', 'Access credentials'],
 *   transitionChecklist: ['Notify board', 'Brief successor', 'Transfer authorities'],
 *   communicationPlan: 'Emergency communication protocol v2',
 *   stakeholderNotification: ['Board', 'Executive team', 'Key clients'],
 *   activationTriggers: ['Sudden departure', 'Extended absence', 'Crisis'],
 *   nextReviewDate: new Date('2025-06-01')
 * });
 * ```
 */
export declare function createEmergencySuccessionPlan(planData: Omit<EmergencySuccessionPlan, 'planId' | 'lastReviewDate'>, transaction?: Transaction): Promise<EmergencySuccessionPlan>;
/**
 * 28. Activates emergency succession plan.
 *
 * @param {string} planId - Plan ID
 * @param {object} activationData - Activation data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<{ activated: boolean; successor: string; notificationsSent: number }>} Activation result
 *
 * @example
 * ```typescript
 * const result = await activateEmergencySuccessionPlan('esp-123', {
 *   trigger: 'Sudden departure',
 *   activatedBy: 'CHRO',
 *   activationDate: new Date(),
 *   notifyStakeholders: true
 * });
 * ```
 */
export declare function activateEmergencySuccessionPlan(planId: string, activationData: {
    trigger: string;
    activatedBy: string;
    activationDate: Date;
    notifyStakeholders: boolean;
}, transaction?: Transaction): Promise<{
    activated: boolean;
    successor: string;
    notificationsSent: number;
}>;
/**
 * 29. Reviews and updates emergency succession plan.
 *
 * @param {string} planId - Plan ID
 * @param {Partial<EmergencySuccessionPlan>} updates - Updates to apply
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<EmergencySuccessionPlan>} Updated plan
 *
 * @example
 * ```typescript
 * await reviewEmergencySuccessionPlan('esp-123', {
 *   primarySuccessor: 'emp-999',
 *   backupSuccessors: ['emp-456', 'emp-789'],
 *   nextReviewDate: new Date('2025-12-01')
 * });
 * ```
 */
export declare function reviewEmergencySuccessionPlan(planId: string, updates: Partial<EmergencySuccessionPlan>, transaction?: Transaction): Promise<EmergencySuccessionPlan>;
/**
 * 30. Creates a succession timeline for planned transition.
 *
 * @param {Omit<SuccessionTimeline, 'timelineId'>} timelineData - Timeline data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<SuccessionTimeline>} Created timeline
 *
 * @example
 * ```typescript
 * const timeline = await createSuccessionTimeline({
 *   positionId: 'kp-123',
 *   plannedSuccessionDate: new Date('2025-10-01'),
 *   incumbentDepartureReason: 'retirement',
 *   selectedSuccessor: 'emp-456',
 *   developmentCompletionDate: new Date('2025-08-01'),
 *   transitionStartDate: new Date('2025-09-01'),
 *   transitionEndDate: new Date('2025-11-01'),
 *   transitionPhases: [...],
 *   status: 'planned'
 * });
 * ```
 */
export declare function createSuccessionTimeline(timelineData: Omit<SuccessionTimeline, 'timelineId'>, transaction?: Transaction): Promise<SuccessionTimeline>;
/**
 * 31. Updates succession timeline progress.
 *
 * @param {string} timelineId - Timeline ID
 * @param {object} progressUpdate - Progress update
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<SuccessionTimeline>} Updated timeline
 *
 * @example
 * ```typescript
 * await updateSuccessionTimelineProgress('st-123', {
 *   status: 'in_progress',
 *   currentPhase: 'knowledge_transfer',
 *   completedPhases: ['preparation']
 * });
 * ```
 */
export declare function updateSuccessionTimelineProgress(timelineId: string, progressUpdate: {
    status?: string;
    currentPhase?: string;
    completedPhases?: string[];
    delayReasons?: string[];
}, transaction?: Transaction): Promise<SuccessionTimeline>;
/**
 * 32. Retrieves all active succession timelines.
 *
 * @param {object} filters - Filter criteria
 * @returns {Promise<SuccessionTimeline[]>} Timelines
 *
 * @example
 * ```typescript
 * const activeTimelines = await getActiveSuccessionTimelines({
 *   status: 'in_progress',
 *   departureReason: 'retirement'
 * });
 * ```
 */
export declare function getActiveSuccessionTimelines(filters?: {
    status?: string;
    departureReason?: string;
}): Promise<SuccessionTimeline[]>;
/**
 * 33. Schedules a talent review meeting.
 *
 * @param {Omit<TalentReviewMeeting, 'meetingId'>} meetingData - Meeting data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<TalentReviewMeeting>} Scheduled meeting
 *
 * @example
 * ```typescript
 * const meeting = await scheduleTalentReviewMeeting({
 *   meetingDate: new Date('2025-03-15T09:00:00'),
 *   meetingType: 'annual',
 *   organizationalScope: 'Technology Division',
 *   attendees: ['CEO', 'CHRO', 'CTO', 'VPs'],
 *   facilitator: 'CHRO',
 *   agenda: ['Review key positions', 'Assess successors', 'Development plans'],
 *   positionsReviewed: [],
 *   employeesDiscussed: [],
 *   decisions: [],
 *   actionItems: [],
 *   meetingNotes: ''
 * });
 * ```
 */
export declare function scheduleTalentReviewMeeting(meetingData: Omit<TalentReviewMeeting, 'meetingId'>, transaction?: Transaction): Promise<TalentReviewMeeting>;
/**
 * 34. Records talent decisions from review meeting.
 *
 * @param {string} meetingId - Meeting ID
 * @param {TalentDecision[]} decisions - Talent decisions
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<TalentReviewMeeting>} Updated meeting
 *
 * @example
 * ```typescript
 * await recordTalentDecisions('trm-123', [
 *   {
 *     decisionId: 'td-1',
 *     decisionType: 'succession_plan',
 *     employeeId: 'emp-456',
 *     positionId: 'kp-789',
 *     decision: 'Designate as primary successor',
 *     rationale: 'Strong readiness scores and leadership potential',
 *     approvedBy: ['CEO', 'CHRO'],
 *     effectiveDate: new Date(),
 *     followUpRequired: true
 *   }
 * ]);
 * ```
 */
export declare function recordTalentDecisions(meetingId: string, decisions: TalentDecision[], transaction?: Transaction): Promise<TalentReviewMeeting>;
/**
 * 35. Retrieves talent review meeting history.
 *
 * @param {object} filters - Filter criteria
 * @returns {Promise<TalentReviewMeeting[]>} Meetings
 *
 * @example
 * ```typescript
 * const meetings = await getTalentReviewMeetingHistory({
 *   meetingType: 'annual',
 *   organizationalScope: 'Technology Division',
 *   fromDate: new Date('2024-01-01')
 * });
 * ```
 */
export declare function getTalentReviewMeetingHistory(filters?: {
    meetingType?: string;
    organizationalScope?: string;
    fromDate?: Date;
}): Promise<TalentReviewMeeting[]>;
/**
 * 36. Places employee on 9-box grid based on performance and potential.
 *
 * @param {Omit<NineBoxPosition, 'boxPosition' | 'category' | 'lastPlacementDate'>} placementData - Placement data
 * @returns {Promise<NineBoxPosition>} 9-box placement
 *
 * @example
 * ```typescript
 * const placement = await placeEmployeeOn9Box({
 *   employeeId: 'emp-456',
 *   performanceRating: 'high',
 *   potentialRating: 'high',
 *   recommendedActions: ['Succession planning', 'Executive development'],
 *   retentionRisk: 'medium',
 *   developmentPriority: 'high'
 * });
 * console.log(`Category: ${placement.category}, Box: ${placement.boxPosition}`);
 * ```
 */
export declare function placeEmployeeOn9Box(placementData: Omit<NineBoxPosition, 'boxPosition' | 'category' | 'lastPlacementDate'>): Promise<NineBoxPosition>;
/**
 * 37. Generates talent matrix for organizational unit.
 *
 * @param {object} matrixConfig - Matrix configuration
 * @returns {Promise<TalentMatrix>} Talent matrix
 *
 * @example
 * ```typescript
 * const matrix = await generateTalentMatrix({
 *   matrixType: '9_box',
 *   organizationalScope: 'Engineering Department',
 *   reviewPeriod: '2024',
 *   employees: [...]
 * });
 * ```
 */
export declare function generateTalentMatrix(matrixConfig: {
    matrixType: '9_box' | 'skills_matrix' | 'readiness_matrix' | 'risk_matrix';
    organizationalScope: string;
    reviewPeriod: string;
    employees: TalentMatrixEntry[];
}): Promise<TalentMatrix>;
/**
 * 38. Retrieves 9-box placement history for an employee.
 *
 * @param {string} employeeId - Employee ID
 * @returns {Promise<NineBoxPosition[]>} Placement history
 *
 * @example
 * ```typescript
 * const history = await get9BoxHistory('emp-456');
 * history.forEach(p => console.log(`${p.lastPlacementDate}: Box ${p.boxPosition}`));
 * ```
 */
export declare function get9BoxHistory(employeeId: string): Promise<NineBoxPosition[]>;
/**
 * 39. Analyzes talent distribution across 9-box grid.
 *
 * @param {string} organizationalScope - Organizational scope
 * @returns {Promise<{ distribution: Record<string, number>; insights: string[]; riskAreas: string[] }>} Distribution analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyze9BoxDistribution('Engineering');
 * console.log('Distribution:', analysis.distribution);
 * console.log('Insights:', analysis.insights);
 * ```
 */
export declare function analyze9BoxDistribution(organizationalScope: string): Promise<{
    distribution: Record<string, number>;
    insights: string[];
    riskAreas: string[];
}>;
/**
 * 40. Creates a high-potential development program.
 *
 * @param {Omit<HighPotentialProgram, 'programId'>} programData - Program data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<HighPotentialProgram>} Created program
 *
 * @example
 * ```typescript
 * const program = await createHighPotentialProgram({
 *   programName: 'Future Leaders Program 2025',
 *   cohort: '2025-Q1',
 *   startDate: new Date('2025-03-01'),
 *   endDate: new Date('2026-02-28'),
 *   participants: ['emp-1', 'emp-2', 'emp-3'],
 *   selectionCriteria: ['Box 6-9', 'Manager recommendation', 'Assessment score >85'],
 *   programComponents: [...],
 *   expectedOutcomes: ['Readiness for VP role', 'Expanded network'],
 *   programSponsor: 'CEO',
 *   budget: 250000,
 *   status: 'planning',
 *   successMetrics: { promotionRate: 80, retentionRate: 95 }
 * });
 * ```
 */
export declare function createHighPotentialProgram(programData: Omit<HighPotentialProgram, 'programId'>, transaction?: Transaction): Promise<HighPotentialProgram>;
/**
 * 41. Enrolls participants in high-potential program.
 *
 * @param {string} programId - Program ID
 * @param {string[]} employeeIds - Employee IDs to enroll
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<HighPotentialProgram>} Updated program
 *
 * @example
 * ```typescript
 * await enrollInHighPotentialProgram('hp-123', ['emp-456', 'emp-789']);
 * ```
 */
export declare function enrollInHighPotentialProgram(programId: string, employeeIds: string[], transaction?: Transaction): Promise<HighPotentialProgram>;
/**
 * 42. Tracks high-potential program outcomes.
 *
 * @param {string} programId - Program ID
 * @returns {Promise<{ completionRate: number; promotions: number; retention: number; successStories: string[] }>} Program outcomes
 *
 * @example
 * ```typescript
 * const outcomes = await trackHighPotentialProgramOutcomes('hp-123');
 * console.log(`Completion rate: ${outcomes.completionRate}%`);
 * console.log(`Promotions: ${outcomes.promotions}`);
 * ```
 */
export declare function trackHighPotentialProgramOutcomes(programId: string): Promise<{
    completionRate: number;
    promotions: number;
    retention: number;
    successStories: string[];
}>;
/**
 * 43. Generates comprehensive succession planning analytics.
 *
 * @param {object} filters - Analysis filters
 * @returns {Promise<SuccessionAnalytics>} Analytics data
 *
 * @example
 * ```typescript
 * const analytics = await generateSuccessionAnalytics({
 *   organizationalScope: 'Corporate',
 *   includeRiskMetrics: true
 * });
 * console.log('Succession coverage:', analytics.metrics.successionCoverage);
 * console.log('Critical gaps:', analytics.risks.criticalGaps);
 * ```
 */
export declare function generateSuccessionAnalytics(filters?: {
    organizationalScope?: string;
    includeRiskMetrics?: boolean;
}): Promise<SuccessionAnalytics>;
/**
 * 44. Identifies succession planning gaps and risks.
 *
 * @param {string} organizationalScope - Organizational scope
 * @returns {Promise<Array<{ positionId: string; gapType: string; severity: string; recommendation: string }>>} Gaps
 *
 * @example
 * ```typescript
 * const gaps = await identifySuccessionGaps('Technology Division');
 * gaps.forEach(g => console.log(`${g.gapType} - ${g.severity}: ${g.recommendation}`));
 * ```
 */
export declare function identifySuccessionGaps(organizationalScope: string): Promise<Array<{
    positionId: string;
    gapType: string;
    severity: string;
    recommendation: string;
}>>;
/**
 * 45. Calculates organizational succession readiness score.
 *
 * @param {string} organizationalScope - Organizational scope
 * @returns {Promise<{ overallScore: number; breakdown: Record<string, number>; grade: string }>} Readiness score
 *
 * @example
 * ```typescript
 * const readiness = await calculateOrganizationalReadiness('Engineering');
 * console.log(`Overall readiness: ${readiness.overallScore} (${readiness.grade})`);
 * ```
 */
export declare function calculateOrganizationalReadiness(organizationalScope: string): Promise<{
    overallScore: number;
    breakdown: Record<string, number>;
    grade: string;
}>;
/**
 * 46. Exports succession planning report with visualizations.
 *
 * @param {object} reportConfig - Report configuration
 * @returns {Promise<{ reportId: string; format: string; url: string; sections: string[] }>} Report metadata
 *
 * @example
 * ```typescript
 * const report = await exportSuccessionPlanningReport({
 *   organizationalScope: 'Corporate',
 *   reportType: 'executive_summary',
 *   includeCharts: true,
 *   format: 'pdf'
 * });
 * console.log('Report URL:', report.url);
 * ```
 */
export declare function exportSuccessionPlanningReport(reportConfig: {
    organizationalScope: string;
    reportType: 'executive_summary' | 'detailed' | 'dashboard';
    includeCharts?: boolean;
    format?: 'pdf' | 'excel' | 'powerpoint';
}): Promise<{
    reportId: string;
    format: string;
    url: string;
    sections: string[];
}>;
/**
 * NestJS Service wrapper for Succession Planning operations.
 * Provides injectable service for use in NestJS applications.
 *
 * @example
 * ```typescript
 * @Module({
 *   providers: [SuccessionPlanningService],
 *   exports: [SuccessionPlanningService],
 * })
 * export class SuccessionPlanningModule {}
 * ```
 */
export declare class SuccessionPlanningService {
    identifyKeyPosition: typeof identifyKeyPosition;
    assessKeyPositionRisk: typeof assessKeyPositionRisk;
    updateKeyPosition: typeof updateKeyPosition;
    listKeyPositions: typeof listKeyPositions;
    calculateBusinessImpact: typeof calculateBusinessImpact;
    identifyRetirementRiskPositions: typeof identifyRetirementRiskPositions;
    nominateSuccessor: typeof nominateSuccessor;
    conductReadinessAssessment: typeof conductReadinessAssessment;
    updateSuccessorReadiness: typeof updateSuccessorReadiness;
    listSuccessorsForPosition: typeof listSuccessorsForPosition;
    calculateSuccessorDepth: typeof calculateSuccessorDepth;
    compareSuccessors: typeof compareSuccessors;
    deactivateSuccessor: typeof deactivateSuccessor;
    createTalentPool: typeof createTalentPool;
    addMembersToTalentPool: typeof addMembersToTalentPool;
    removeMembersFromTalentPool: typeof removeMembersFromTalentPool;
    reviewTalentPool: typeof reviewTalentPool;
    listTalentPools: typeof listTalentPools;
    createSuccessorDevelopmentPlan: typeof createSuccessorDevelopmentPlan;
    updateDevelopmentPlanProgress: typeof updateDevelopmentPlanProgress;
    addDevelopmentActivity: typeof addDevelopmentActivity;
    getEmployeeDevelopmentPlans: typeof getEmployeeDevelopmentPlans;
    createSuccessionScenario: typeof createSuccessionScenario;
    modelSuccessionScenario: typeof modelSuccessionScenario;
    approveSuccessionScenario: typeof approveSuccessionScenario;
    listSuccessionScenarios: typeof listSuccessionScenarios;
    createEmergencySuccessionPlan: typeof createEmergencySuccessionPlan;
    activateEmergencySuccessionPlan: typeof activateEmergencySuccessionPlan;
    reviewEmergencySuccessionPlan: typeof reviewEmergencySuccessionPlan;
    createSuccessionTimeline: typeof createSuccessionTimeline;
    updateSuccessionTimelineProgress: typeof updateSuccessionTimelineProgress;
    getActiveSuccessionTimelines: typeof getActiveSuccessionTimelines;
    scheduleTalentReviewMeeting: typeof scheduleTalentReviewMeeting;
    recordTalentDecisions: typeof recordTalentDecisions;
    getTalentReviewMeetingHistory: typeof getTalentReviewMeetingHistory;
    placeEmployeeOn9Box: typeof placeEmployeeOn9Box;
    generateTalentMatrix: typeof generateTalentMatrix;
    get9BoxHistory: typeof get9BoxHistory;
    analyze9BoxDistribution: typeof analyze9BoxDistribution;
    createHighPotentialProgram: typeof createHighPotentialProgram;
    enrollInHighPotentialProgram: typeof enrollInHighPotentialProgram;
    trackHighPotentialProgramOutcomes: typeof trackHighPotentialProgramOutcomes;
    generateSuccessionAnalytics: typeof generateSuccessionAnalytics;
    identifySuccessionGaps: typeof identifySuccessionGaps;
    calculateOrganizationalReadiness: typeof calculateOrganizationalReadiness;
    exportSuccessionPlanningReport: typeof exportSuccessionPlanningReport;
}
export {};
//# sourceMappingURL=succession-planning-kit.d.ts.map