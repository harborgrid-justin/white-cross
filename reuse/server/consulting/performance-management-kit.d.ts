/**
 * LOC: CONS-PERF-MGT-001
 * File: /reuse/server/consulting/performance-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable)
 *   - @nestjs/swagger (ApiProperty, ApiResponse)
 *   - class-validator (decorators)
 *   - class-transformer (Type, Transform)
 *
 * DOWNSTREAM (imported by):
 *   - backend/consulting/performance.service.ts
 *   - backend/consulting/okr.controller.ts
 *   - backend/consulting/calibration.service.ts
 */
/**
 * File: /reuse/server/consulting/performance-management-kit.ts
 * Locator: WC-CONS-PERFMGT-001
 * Purpose: Enterprise-grade Performance Management Kit - OKRs, KPIs, balanced scorecard, 360 feedback, calibration
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, class-validator 0.14.x, class-transformer 0.5.x
 * Downstream: Consulting services, performance controllers, calibration processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 44 production-ready functions for performance management competing with Workday, SuccessFactors, Lattice
 *
 * LLM Context: Comprehensive performance management utilities for production-ready consulting applications.
 * Provides OKR framework implementation, KPI design and tracking, balanced scorecard methodology, 360-degree feedback,
 * performance calibration sessions, goal cascading, performance improvement plans, continuous feedback, ratings,
 * talent review processes, succession planning integration, and performance analytics.
 */
import { Model, Sequelize, Transaction } from 'sequelize';
/**
 * Goal types
 */
export declare enum GoalType {
    OBJECTIVE = "objective",
    KEY_RESULT = "key_result",
    KPI = "kpi",
    MILESTONE = "milestone",
    BEHAVIOR = "behavior",
    DEVELOPMENT = "development"
}
/**
 * Goal status
 */
export declare enum GoalStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    AT_RISK = "at_risk",
    COMPLETED = "completed",
    DEFERRED = "deferred",
    CANCELLED = "cancelled"
}
/**
 * Performance rating scale
 */
export declare enum PerformanceRating {
    UNSATISFACTORY = "unsatisfactory",
    NEEDS_IMPROVEMENT = "needs_improvement",
    MEETS_EXPECTATIONS = "meets_expectations",
    EXCEEDS_EXPECTATIONS = "exceeds_expectations",
    OUTSTANDING = "outstanding"
}
/**
 * Review cycle frequency
 */
export declare enum ReviewCycleFrequency {
    QUARTERLY = "quarterly",
    SEMI_ANNUAL = "semi_annual",
    ANNUAL = "annual",
    CONTINUOUS = "continuous"
}
/**
 * Feedback types
 */
export declare enum FeedbackType {
    UPWARD = "upward",
    DOWNWARD = "downward",
    PEER = "peer",
    SELF = "self",
    CUSTOMER = "customer"
}
/**
 * KPI measurement types
 */
export declare enum KPIMeasurementType {
    NUMERIC = "numeric",
    PERCENTAGE = "percentage",
    CURRENCY = "currency",
    BOOLEAN = "boolean",
    MILESTONE = "milestone"
}
/**
 * Balanced scorecard perspectives
 */
export declare enum BalancedScorecardPerspective {
    FINANCIAL = "financial",
    CUSTOMER = "customer",
    INTERNAL_PROCESS = "internal_process",
    LEARNING_GROWTH = "learning_growth"
}
/**
 * Calibration decision types
 */
export declare enum CalibrationDecision {
    CONFIRMED = "confirmed",
    UPGRADED = "upgraded",
    DOWNGRADED = "downgraded",
    UNDER_REVIEW = "under_review"
}
/**
 * Performance improvement plan status
 */
export declare enum PIPStatus {
    ACTIVE = "active",
    ON_TRACK = "on_track",
    AT_RISK = "at_risk",
    COMPLETED_SUCCESS = "completed_success",
    COMPLETED_FAILURE = "completed_failure",
    CANCELLED = "cancelled"
}
/**
 * Goal alignment levels
 */
export declare enum AlignmentLevel {
    COMPANY = "company",
    DIVISION = "division",
    DEPARTMENT = "department",
    TEAM = "team",
    INDIVIDUAL = "individual"
}
/**
 * Development area categories
 */
export declare enum DevelopmentCategory {
    TECHNICAL_SKILLS = "technical_skills",
    LEADERSHIP = "leadership",
    COMMUNICATION = "communication",
    COLLABORATION = "collaboration",
    INNOVATION = "innovation",
    EXECUTION = "execution"
}
interface ObjectiveData {
    objectiveId: string;
    organizationId: string;
    ownerId: string;
    title: string;
    description: string;
    alignmentLevel: AlignmentLevel;
    parentObjectiveId?: string;
    timeFrame: string;
    startDate: Date;
    endDate: Date;
    weight: number;
    status: GoalStatus;
    progress: number;
    confidenceLevel: number;
    metadata?: Record<string, any>;
}
interface KeyResultData {
    keyResultId: string;
    objectiveId: string;
    title: string;
    description: string;
    measurementType: KPIMeasurementType;
    startValue: number;
    targetValue: number;
    currentValue: number;
    unit: string;
    weight: number;
    status: GoalStatus;
    progress: number;
    milestones?: string[];
}
interface KPIData {
    kpiId: string;
    organizationId: string;
    name: string;
    description: string;
    category: string;
    owner: string;
    measurementType: KPIMeasurementType;
    formula: string;
    dataSource: string;
    frequency: string;
    targetValue: number;
    currentValue: number;
    thresholdGreen: number;
    thresholdYellow: number;
    thresholdRed: number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
    priority: 'low' | 'medium' | 'high' | 'critical';
}
interface BalancedScorecardData {
    scorecardId: string;
    organizationId: string;
    name: string;
    description: string;
    timeframe: string;
    perspectives: ScorecardPerspective[];
    overallScore: number;
    status: 'draft' | 'active' | 'archived';
}
interface ScorecardPerspective {
    perspectiveId: string;
    perspective: BalancedScorecardPerspective;
    objectives: string[];
    measures: string[];
    targets: string[];
    initiatives: string[];
    weight: number;
    score: number;
}
interface FeedbackRequestData {
    requestId: string;
    subjectId: string;
    subjectName: string;
    requesterId: string;
    feedbackType: FeedbackType;
    reviewers: string[];
    questions: FeedbackQuestion[];
    dueDate: Date;
    purpose: string;
    isAnonymous: boolean;
    status: 'pending' | 'in_progress' | 'completed';
}
interface FeedbackQuestion {
    questionId: string;
    questionText: string;
    category: string;
    isRequired: boolean;
    responseType: 'text' | 'rating' | 'multiple_choice';
    options?: string[];
}
interface FeedbackResponseData {
    responseId: string;
    requestId: string;
    reviewerId: string;
    responses: QuestionResponse[];
    overallRating?: number;
    strengths: string[];
    areasForImprovement: string[];
    submittedAt: Date;
}
interface QuestionResponse {
    questionId: string;
    answer: string | number;
    comments?: string;
}
interface PerformanceReviewData {
    reviewId: string;
    employeeId: string;
    reviewerId: string;
    reviewCycle: string;
    reviewPeriodStart: Date;
    reviewPeriodEnd: Date;
    overallRating: PerformanceRating;
    goalAchievement: number;
    competencyRatings: CompetencyRating[];
    strengths: string[];
    areasForImprovement: string[];
    developmentGoals: string[];
    promotionRecommendation: boolean;
    compensationRecommendation: string;
    comments: string;
    status: 'draft' | 'submitted' | 'calibrated' | 'finalized';
}
interface CompetencyRating {
    competencyId: string;
    competencyName: string;
    rating: PerformanceRating;
    comments: string;
    examples: string[];
}
interface CalibrationSessionData {
    sessionId: string;
    organizationId: string;
    sessionName: string;
    calibrationCycle: string;
    facilitatorId: string;
    participants: string[];
    reviews: string[];
    sessionDate: Date;
    ratingDistribution: RatingDistribution;
    decisions: CalibrationDecision[];
    status: 'scheduled' | 'in_progress' | 'completed';
}
interface RatingDistribution {
    unsatisfactory: number;
    needsImprovement: number;
    meetsExpectations: number;
    exceedsExpectations: number;
    outstanding: number;
    targetDistribution: Record<PerformanceRating, number>;
    actualDistribution: Record<PerformanceRating, number>;
}
interface CalibrationDecisionData {
    decisionId: string;
    sessionId: string;
    reviewId: string;
    employeeId: string;
    originalRating: PerformanceRating;
    calibratedRating: PerformanceRating;
    decision: CalibrationDecision;
    rationale: string;
    discussionNotes: string;
    approvedBy: string;
}
interface GoalCascadeData {
    cascadeId: string;
    organizationId: string;
    topLevelObjectiveId: string;
    cascadeLevels: CascadeLevel[];
    totalGoals: number;
    alignmentScore: number;
    completionPercentage: number;
}
interface CascadeLevel {
    level: AlignmentLevel;
    parentGoalId?: string;
    childGoals: ObjectiveData[];
    alignmentStrength: number;
}
interface PerformanceImprovementPlanData {
    pipId: string;
    employeeId: string;
    managerId: string;
    startDate: Date;
    reviewDate: Date;
    endDate: Date;
    concernsIdentified: string[];
    performanceGaps: PerformanceGap[];
    improvementActions: ImprovementAction[];
    successCriteria: string[];
    supportProvided: string[];
    status: PIPStatus;
    progressNotes: ProgressNote[];
    outcome?: 'successful' | 'unsuccessful';
}
interface PerformanceGap {
    gapId: string;
    area: string;
    currentState: string;
    expectedState: string;
    severity: 'low' | 'medium' | 'high';
    impact: string;
}
interface ImprovementAction {
    actionId: string;
    description: string;
    targetCompletionDate: Date;
    responsibleParty: string;
    resources: string[];
    status: 'pending' | 'in_progress' | 'completed';
    completionDate?: Date;
}
interface ProgressNote {
    noteId: string;
    date: Date;
    author: string;
    observation: string;
    progress: 'positive' | 'neutral' | 'negative';
    nextSteps: string[];
}
interface ContinuousFeedbackData {
    feedbackId: string;
    giverId: string;
    receiverId: string;
    feedbackDate: Date;
    context: string;
    positiveObservations: string[];
    constructiveSuggestions: string[];
    actionableItems: string[];
    isPrivate: boolean;
    isAcknowledged: boolean;
    acknowledgedAt?: Date;
}
interface TalentReviewData {
    reviewId: string;
    organizationId: string;
    reviewCycle: string;
    reviewDate: Date;
    participants: string[];
    employeesReviewed: TalentReviewEmployee[];
    nineBoxGrid: NineBoxGrid;
    successionPlans: SuccessionPlan[];
    talentActions: TalentAction[];
}
interface TalentReviewEmployee {
    employeeId: string;
    employeeName: string;
    position: string;
    performanceRating: PerformanceRating;
    potentialRating: 'low' | 'medium' | 'high';
    nineBoxPosition: string;
    flightRisk: 'low' | 'medium' | 'high';
    readinessForPromotion: string;
    developmentNeeds: string[];
}
interface NineBoxGrid {
    gridId: string;
    positions: Record<string, string[]>;
    distribution: Record<string, number>;
}
interface SuccessionPlan {
    planId: string;
    criticalRole: string;
    incumbentId?: string;
    successors: SuccessorCandidate[];
    developmentTimeline: string;
    riskLevel: 'low' | 'medium' | 'high';
}
interface SuccessorCandidate {
    candidateId: string;
    candidateName: string;
    readiness: 'ready_now' | '1_year' | '2_3_years' | 'long_term';
    developmentNeeds: string[];
    strengthsAlignment: string[];
}
interface TalentAction {
    actionId: string;
    employeeId: string;
    actionType: 'promotion' | 'development' | 'retention' | 'transition';
    description: string;
    targetDate: Date;
    owner: string;
    status: 'planned' | 'in_progress' | 'completed';
}
interface PerformanceAnalytics {
    organizationId: string;
    analysisPeriod: string;
    totalEmployees: number;
    ratingDistribution: Record<PerformanceRating, number>;
    goalCompletionRate: number;
    averageGoalProgress: number;
    feedbackVelocity: number;
    calibrationVariance: number;
    topPerformers: string[];
    atRiskEmployees: string[];
    trendsAnalysis: TrendAnalysis[];
}
interface TrendAnalysis {
    metric: string;
    currentValue: number;
    previousValue: number;
    changePercentage: number;
    trend: 'improving' | 'declining' | 'stable';
    insights: string[];
}
/**
 * Create Objective DTO
 */
export declare class CreateObjectiveDto {
    title: string;
    description: string;
    alignmentLevel: AlignmentLevel;
    parentObjectiveId?: string;
    timeFrame: string;
    startDate: Date;
    endDate: Date;
    weight: number;
}
/**
 * Create Key Result DTO
 */
export declare class CreateKeyResultDto {
    objectiveId: string;
    title: string;
    description: string;
    measurementType: KPIMeasurementType;
    startValue: number;
    targetValue: number;
    unit: string;
    weight: number;
}
/**
 * Create KPI DTO
 */
export declare class CreateKPIDto {
    name: string;
    description: string;
    category: string;
    owner: string;
    measurementType: KPIMeasurementType;
    formula: string;
    dataSource: string;
    frequency: string;
    targetValue: number;
    thresholdGreen: number;
    thresholdYellow: number;
    thresholdRed: number;
    unit: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
}
/**
 * Create Feedback Request DTO
 */
export declare class CreateFeedbackRequestDto {
    subjectId: string;
    feedbackType: FeedbackType;
    reviewers: string[];
    questions: FeedbackQuestion[];
    dueDate: Date;
    purpose: string;
    isAnonymous: boolean;
}
/**
 * Create Performance Review DTO
 */
export declare class CreatePerformanceReviewDto {
    employeeId: string;
    reviewCycle: string;
    reviewPeriodStart: Date;
    reviewPeriodEnd: Date;
    overallRating: PerformanceRating;
    goalAchievement: number;
    competencyRatings: CompetencyRating[];
    strengths: string[];
    areasForImprovement: string[];
    developmentGoals: string[];
    promotionRecommendation: boolean;
    compensationRecommendation: string;
    comments: string;
}
/**
 * Create Calibration Session DTO
 */
export declare class CreateCalibrationSessionDto {
    sessionName: string;
    calibrationCycle: string;
    facilitatorId: string;
    participants: string[];
    reviews: string[];
    sessionDate: Date;
}
/**
 * Create PIP DTO
 */
export declare class CreatePIPDto {
    employeeId: string;
    managerId: string;
    startDate: Date;
    reviewDate: Date;
    endDate: Date;
    concernsIdentified: string[];
    performanceGaps: PerformanceGap[];
    improvementActions: ImprovementAction[];
    successCriteria: string[];
    supportProvided: string[];
}
/**
 * Objective Model
 */
export declare class Objective extends Model<ObjectiveData> implements ObjectiveData {
    objectiveId: string;
    organizationId: string;
    ownerId: string;
    title: string;
    description: string;
    alignmentLevel: AlignmentLevel;
    parentObjectiveId?: string;
    timeFrame: string;
    startDate: Date;
    endDate: Date;
    weight: number;
    status: GoalStatus;
    progress: number;
    confidenceLevel: number;
    metadata?: Record<string, any>;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export declare function initObjectiveModel(sequelize: Sequelize): typeof Objective;
/**
 * Key Result Model
 */
export declare class KeyResult extends Model<KeyResultData> implements KeyResultData {
    keyResultId: string;
    objectiveId: string;
    title: string;
    description: string;
    measurementType: KPIMeasurementType;
    startValue: number;
    targetValue: number;
    currentValue: number;
    unit: string;
    weight: number;
    status: GoalStatus;
    progress: number;
    milestones?: string[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export declare function initKeyResultModel(sequelize: Sequelize): typeof KeyResult;
/**
 * KPI Model
 */
export declare class KPI extends Model<KPIData> implements KPIData {
    kpiId: string;
    organizationId: string;
    name: string;
    description: string;
    category: string;
    owner: string;
    measurementType: KPIMeasurementType;
    formula: string;
    dataSource: string;
    frequency: string;
    targetValue: number;
    currentValue: number;
    thresholdGreen: number;
    thresholdYellow: number;
    thresholdRed: number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
    priority: 'low' | 'medium' | 'high' | 'critical';
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export declare function initKPIModel(sequelize: Sequelize): typeof KPI;
/**
 * Performance Review Model
 */
export declare class PerformanceReview extends Model<PerformanceReviewData> implements PerformanceReviewData {
    reviewId: string;
    employeeId: string;
    reviewerId: string;
    reviewCycle: string;
    reviewPeriodStart: Date;
    reviewPeriodEnd: Date;
    overallRating: PerformanceRating;
    goalAchievement: number;
    competencyRatings: CompetencyRating[];
    strengths: string[];
    areasForImprovement: string[];
    developmentGoals: string[];
    promotionRecommendation: boolean;
    compensationRecommendation: string;
    comments: string;
    status: 'draft' | 'submitted' | 'calibrated' | 'finalized';
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export declare function initPerformanceReviewModel(sequelize: Sequelize): typeof PerformanceReview;
/**
 * Performance Improvement Plan Model
 */
export declare class PerformanceImprovementPlan extends Model<PerformanceImprovementPlanData> implements PerformanceImprovementPlanData {
    pipId: string;
    employeeId: string;
    managerId: string;
    startDate: Date;
    reviewDate: Date;
    endDate: Date;
    concernsIdentified: string[];
    performanceGaps: PerformanceGap[];
    improvementActions: ImprovementAction[];
    successCriteria: string[];
    supportProvided: string[];
    status: PIPStatus;
    progressNotes: ProgressNote[];
    outcome?: 'successful' | 'unsuccessful';
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export declare function initPerformanceImprovementPlanModel(sequelize: Sequelize): typeof PerformanceImprovementPlan;
/**
 * Creates a new objective.
 *
 * @swagger
 * @openapi
 * /api/performance/objectives:
 *   post:
 *     tags:
 *       - Performance Management
 *     summary: Create objective
 *     description: Creates a new objective aligned to organizational goals
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateObjectiveDto'
 *     responses:
 *       201:
 *         description: Objective created successfully
 *       400:
 *         description: Invalid input data
 *
 * @param {CreateObjectiveDto} data - Objective data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<ObjectiveData>} Created objective
 *
 * @example
 * ```typescript
 * const objective = await createObjective({
 *   title: 'Improve Customer Satisfaction',
 *   description: 'Increase NPS by implementing customer feedback loop',
 *   alignmentLevel: AlignmentLevel.DEPARTMENT,
 *   timeFrame: 'Q1 2024',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-03-31'),
 *   weight: 30
 * });
 * ```
 */
export declare function createObjective(data: Partial<ObjectiveData>, transaction?: Transaction): Promise<ObjectiveData>;
/**
 * Creates a key result for an objective.
 *
 * @param {CreateKeyResultDto} data - Key result data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<KeyResultData>} Created key result
 *
 * @example
 * ```typescript
 * const keyResult = await createKeyResult({
 *   objectiveId: 'OBJ-123',
 *   title: 'Achieve NPS of 70+',
 *   measurementType: KPIMeasurementType.NUMERIC,
 *   startValue: 55,
 *   targetValue: 70,
 *   unit: 'points',
 *   weight: 50
 * });
 * ```
 */
export declare function createKeyResult(data: Partial<KeyResultData>, transaction?: Transaction): Promise<KeyResultData>;
/**
 * Calculates progress percentage.
 *
 * @param {number} startValue - Starting value
 * @param {number} currentValue - Current value
 * @param {number} targetValue - Target value
 * @returns {number} Progress percentage (0-100)
 */
export declare function calculateProgress(startValue: number, currentValue: number, targetValue: number): number;
/**
 * Updates key result progress.
 *
 * @param {string} keyResultId - Key result ID
 * @param {number} newValue - New current value
 * @returns {Promise<KeyResultData>} Updated key result
 */
export declare function updateKeyResultProgress(keyResultId: string, newValue: number): Promise<KeyResultData>;
/**
 * Creates a KPI.
 *
 * @param {CreateKPIDto} data - KPI data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<KPIData>} Created KPI
 */
export declare function createKPI(data: Partial<KPIData>, transaction?: Transaction): Promise<KPIData>;
/**
 * Updates KPI value and calculates trend.
 *
 * @param {string} kpiId - KPI ID
 * @param {number} newValue - New value
 * @param {number} previousValue - Previous value
 * @returns {Promise<KPIData>} Updated KPI
 */
export declare function updateKPIValue(kpiId: string, newValue: number, previousValue: number): Promise<KPIData>;
/**
 * Evaluates KPI status based on thresholds.
 *
 * @param {KPIData} kpi - KPI data
 * @returns {Object} KPI status evaluation
 */
export declare function evaluateKPIStatus(kpi: KPIData): {
    status: 'green' | 'yellow' | 'red';
    message: string;
    performanceLevel: number;
};
/**
 * Creates a balanced scorecard.
 *
 * @param {Partial<BalancedScorecardData>} data - Scorecard data
 * @returns {Promise<BalancedScorecardData>} Created scorecard
 */
export declare function createBalancedScorecard(data: Partial<BalancedScorecardData>): Promise<BalancedScorecardData>;
/**
 * Adds a perspective to balanced scorecard.
 *
 * @param {string} scorecardId - Scorecard ID
 * @param {BalancedScorecardPerspective} perspective - Perspective type
 * @param {Partial<ScorecardPerspective>} data - Perspective data
 * @returns {Promise<ScorecardPerspective>} Created perspective
 */
export declare function addScorecardPerspective(scorecardId: string, perspective: BalancedScorecardPerspective, data: Partial<ScorecardPerspective>): Promise<ScorecardPerspective>;
/**
 * Calculates balanced scorecard overall score.
 *
 * @param {ScorecardPerspective[]} perspectives - All perspectives
 * @returns {number} Overall weighted score
 */
export declare function calculateBalancedScorecardScore(perspectives: ScorecardPerspective[]): number;
/**
 * Creates a 360 feedback request.
 *
 * @param {CreateFeedbackRequestDto} data - Feedback request data
 * @returns {Promise<FeedbackRequestData>} Created feedback request
 */
export declare function create360FeedbackRequest(data: Partial<FeedbackRequestData>): Promise<FeedbackRequestData>;
/**
 * Submits 360 feedback response.
 *
 * @param {Partial<FeedbackResponseData>} data - Feedback response data
 * @returns {Promise<FeedbackResponseData>} Submitted feedback response
 */
export declare function submit360FeedbackResponse(data: Partial<FeedbackResponseData>): Promise<FeedbackResponseData>;
/**
 * Aggregates 360 feedback responses.
 *
 * @param {string} requestId - Feedback request ID
 * @param {FeedbackResponseData[]} responses - All responses
 * @returns {Object} Aggregated feedback
 */
export declare function aggregate360Feedback(requestId: string, responses: FeedbackResponseData[]): {
    requestId: string;
    responseCount: number;
    averageRating: number;
    commonStrengths: string[];
    commonImprovementAreas: string[];
    thematicAnalysis: Record<string, number>;
};
/**
 * Creates a performance review.
 *
 * @param {CreatePerformanceReviewDto} data - Review data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<PerformanceReviewData>} Created review
 */
export declare function createPerformanceReview(data: Partial<PerformanceReviewData>, transaction?: Transaction): Promise<PerformanceReviewData>;
/**
 * Creates a calibration session.
 *
 * @param {CreateCalibrationSessionDto} data - Calibration session data
 * @returns {Promise<CalibrationSessionData>} Created session
 */
export declare function createCalibrationSession(data: Partial<CalibrationSessionData>): Promise<CalibrationSessionData>;
/**
 * Calibrates performance rating.
 *
 * @param {string} sessionId - Calibration session ID
 * @param {string} reviewId - Review ID
 * @param {PerformanceRating} originalRating - Original rating
 * @param {PerformanceRating} calibratedRating - Calibrated rating
 * @param {string} rationale - Calibration rationale
 * @returns {Promise<CalibrationDecisionData>} Calibration decision
 */
export declare function calibratePerformanceRating(sessionId: string, reviewId: string, originalRating: PerformanceRating, calibratedRating: PerformanceRating, rationale: string): Promise<CalibrationDecisionData>;
/**
 * Validates rating distribution against target.
 *
 * @param {RatingDistribution} distribution - Rating distribution
 * @returns {Object} Validation result
 */
export declare function validateRatingDistribution(distribution: RatingDistribution): {
    isValid: boolean;
    variances: Record<PerformanceRating, number>;
    recommendations: string[];
};
/**
 * Cascades goals from parent to child level.
 *
 * @param {string} parentObjectiveId - Parent objective ID
 * @param {AlignmentLevel} childLevel - Child alignment level
 * @param {string[]} childOwnerIds - Child owner IDs
 * @returns {Promise<GoalCascadeData>} Goal cascade structure
 */
export declare function cascadeGoals(parentObjectiveId: string, childLevel: AlignmentLevel, childOwnerIds: string[]): Promise<GoalCascadeData>;
/**
 * Validates goal alignment.
 *
 * @param {ObjectiveData} childGoal - Child goal
 * @param {ObjectiveData} parentGoal - Parent goal
 * @returns {Object} Alignment validation
 */
export declare function validateGoalAlignment(childGoal: ObjectiveData, parentGoal: ObjectiveData): {
    isAligned: boolean;
    alignmentScore: number;
    issues: string[];
    recommendations: string[];
};
/**
 * Creates a performance improvement plan (PIP).
 *
 * @param {CreatePIPDto} data - PIP data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<PerformanceImprovementPlanData>} Created PIP
 */
export declare function createPerformanceImprovementPlan(data: Partial<PerformanceImprovementPlanData>, transaction?: Transaction): Promise<PerformanceImprovementPlanData>;
/**
 * Adds progress note to PIP.
 *
 * @param {string} pipId - PIP ID
 * @param {Partial<ProgressNote>} noteData - Progress note data
 * @returns {Promise<ProgressNote>} Added progress note
 */
export declare function addPIPProgressNote(pipId: string, noteData: Partial<ProgressNote>): Promise<ProgressNote>;
/**
 * Evaluates PIP success.
 *
 * @param {PerformanceImprovementPlanData} pip - PIP data
 * @returns {Object} PIP evaluation
 */
export declare function evaluatePIPSuccess(pip: PerformanceImprovementPlanData): {
    isSuccessful: boolean;
    completionRate: number;
    positiveProgressNotes: number;
    recommendation: 'continue' | 'extend' | 'close_successful' | 'close_unsuccessful';
};
/**
 * Creates continuous feedback.
 *
 * @param {Partial<ContinuousFeedbackData>} data - Feedback data
 * @returns {Promise<ContinuousFeedbackData>} Created feedback
 */
export declare function createContinuousFeedback(data: Partial<ContinuousFeedbackData>): Promise<ContinuousFeedbackData>;
/**
 * Acknowledges continuous feedback.
 *
 * @param {string} feedbackId - Feedback ID
 * @returns {Promise<ContinuousFeedbackData>} Updated feedback
 */
export declare function acknowledgeContinuousFeedback(feedbackId: string): Promise<ContinuousFeedbackData>;
/**
 * Analyzes feedback trends.
 *
 * @param {string} employeeId - Employee ID
 * @param {ContinuousFeedbackData[]} feedbackList - List of feedback
 * @returns {Object} Feedback trend analysis
 */
export declare function analyzeFeedbackTrends(employeeId: string, feedbackList: ContinuousFeedbackData[]): {
    totalFeedback: number;
    positiveCount: number;
    constructiveCount: number;
    topPositiveThemes: string[];
    topImprovementThemes: string[];
    feedbackVelocity: number;
};
/**
 * Creates a talent review.
 *
 * @param {Partial<TalentReviewData>} data - Talent review data
 * @returns {Promise<TalentReviewData>} Created talent review
 */
export declare function createTalentReview(data: Partial<TalentReviewData>): Promise<TalentReviewData>;
/**
 * Plots employee on 9-box grid.
 *
 * @param {PerformanceRating} performanceRating - Performance rating
 * @param {'low' | 'medium' | 'high'} potentialRating - Potential rating
 * @returns {string} 9-box position
 */
export declare function plotOn9Box(performanceRating: PerformanceRating, potentialRating: 'low' | 'medium' | 'high'): string;
/**
 * Generates succession plan recommendations.
 *
 * @param {string} criticalRole - Critical role title
 * @param {TalentReviewEmployee[]} potentialSuccessors - Potential successors
 * @returns {SuccessionPlan} Succession plan
 */
export declare function generateSuccessionPlan(criticalRole: string, potentialSuccessors: TalentReviewEmployee[]): SuccessionPlan;
/**
 * Generates performance analytics.
 *
 * @param {string} organizationId - Organization ID
 * @param {PerformanceReviewData[]} reviews - Performance reviews
 * @param {ObjectiveData[]} objectives - Objectives
 * @returns {Promise<PerformanceAnalytics>} Performance analytics
 */
export declare function generatePerformanceAnalytics(organizationId: string, reviews: PerformanceReviewData[], objectives: ObjectiveData[]): Promise<PerformanceAnalytics>;
/**
 * Exports OKRs to structured format.
 *
 * @param {string} organizationId - Organization ID
 * @param {ObjectiveData[]} objectives - Objectives
 * @param {KeyResultData[]} keyResults - Key results
 * @returns {Object} Exported OKR data
 */
export declare function exportOKRs(organizationId: string, objectives: ObjectiveData[], keyResults: KeyResultData[]): {
    organizationId: string;
    exportDate: Date;
    okrs: Array<{
        objective: ObjectiveData;
        keyResults: KeyResultData[];
    }>;
};
/**
 * Imports OKRs from external format.
 *
 * @param {any} okrData - External OKR data
 * @returns {Promise<{ objectives: ObjectiveData[]; keyResults: KeyResultData[] }>} Imported OKRs
 */
export declare function importOKRs(okrData: any): Promise<{
    objectives: ObjectiveData[];
    keyResults: KeyResultData[];
}>;
/**
 * Calculates team performance score.
 *
 * @param {PerformanceReviewData[]} teamReviews - Team member reviews
 * @returns {Object} Team performance metrics
 */
export declare function calculateTeamPerformanceScore(teamReviews: PerformanceReviewData[]): {
    teamSize: number;
    averageRating: number;
    goalAchievementAvg: number;
    distributionBalance: number;
    teamHealthScore: number;
};
/**
 * Generates performance improvement recommendations.
 *
 * @param {PerformanceReviewData} review - Performance review
 * @returns {string[]} Recommendations
 */
export declare function generatePerformanceRecommendations(review: PerformanceReviewData): string[];
/**
 * Schedules performance review cycle.
 *
 * @param {string} organizationId - Organization ID
 * @param {ReviewCycleFrequency} frequency - Review frequency
 * @param {Date} startDate - Cycle start date
 * @returns {Object} Review cycle schedule
 */
export declare function schedulePerformanceReviewCycle(organizationId: string, frequency: ReviewCycleFrequency, startDate: Date): {
    cycleId: string;
    frequency: ReviewCycleFrequency;
    reviewPeriods: Array<{
        period: string;
        startDate: Date;
        endDate: Date;
        dueDate: Date;
    }>;
};
/**
 * Calculates compensation adjustment based on performance.
 *
 * @param {PerformanceRating} rating - Performance rating
 * @param {number} currentSalary - Current salary
 * @param {number} budgetPool - Available budget pool percentage
 * @returns {Object} Compensation recommendation
 */
export declare function calculateCompensationAdjustment(rating: PerformanceRating, currentSalary: number, budgetPool: number): {
    recommendedIncrease: number;
    increasePercentage: number;
    newSalary: number;
    rationale: string;
};
/**
 * Identifies high-potential employees.
 *
 * @param {PerformanceReviewData[]} reviews - Performance reviews
 * @param {TalentReviewEmployee[]} talentData - Talent review data
 * @returns {TalentReviewEmployee[]} High-potential employees
 */
export declare function identifyHighPotentialEmployees(reviews: PerformanceReviewData[], talentData: TalentReviewEmployee[]): TalentReviewEmployee[];
/**
 * Generates development plan from performance review.
 *
 * @param {PerformanceReviewData} review - Performance review
 * @returns {Object} Development plan
 */
export declare function generateDevelopmentPlan(review: PerformanceReviewData): {
    employeeId: string;
    developmentAreas: Array<{
        area: string;
        category: DevelopmentCategory;
        priority: 'high' | 'medium' | 'low';
        suggestedActions: string[];
        targetCompletionDate: Date;
    }>;
    learningObjectives: string[];
    estimatedDuration: string;
};
/**
 * Analyzes goal alignment across organization.
 *
 * @param {ObjectiveData[]} allObjectives - All organizational objectives
 * @returns {Object} Alignment analysis
 */
export declare function analyzeOrganizationalAlignment(allObjectives: ObjectiveData[]): {
    totalObjectives: number;
    alignmentByLevel: Record<AlignmentLevel, number>;
    cascadeDepth: number;
    orphanedGoals: string[];
    alignmentHealth: number;
};
/**
 * Generates performance dashboard metrics.
 *
 * @param {string} organizationId - Organization ID
 * @param {PerformanceReviewData[]} reviews - Reviews
 * @param {ObjectiveData[]} objectives - Objectives
 * @param {ContinuousFeedbackData[]} feedback - Continuous feedback
 * @returns {Object} Dashboard metrics
 */
export declare function generatePerformanceDashboard(organizationId: string, reviews: PerformanceReviewData[], objectives: ObjectiveData[], feedback: ContinuousFeedbackData[]): {
    organizationId: string;
    period: string;
    metrics: {
        activeGoals: number;
        goalCompletionRate: number;
        averagePerformanceRating: number;
        feedbackCount: number;
        employeesWithPIPs: number;
        calibrationCoverage: number;
    };
    trends: {
        performanceImprovement: number;
        goalProgressVelocity: number;
        feedbackEngagement: number;
    };
    alerts: string[];
};
export {};
//# sourceMappingURL=performance-management-kit.d.ts.map