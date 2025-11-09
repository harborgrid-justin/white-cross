/**
 * LOC: CONS-TAL-MGT-001
 * File: /reuse/server/consulting/talent-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable)
 *   - @nestjs/swagger (ApiProperty, ApiResponse)
 *   - class-validator (decorators)
 *   - class-transformer (Type, Transform)
 *
 * DOWNSTREAM (imported by):
 *   - backend/consulting/talent.service.ts
 *   - backend/consulting/workforce-planning.controller.ts
 *   - backend/consulting/succession.service.ts
 */
/**
 * File: /reuse/server/consulting/talent-management-kit.ts
 * Locator: WC-CONS-TALENT-001
 * Purpose: Enterprise-grade Talent Management Kit - workforce planning, succession, competency frameworks, assessments, engagement, retention
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, class-validator 0.14.x, class-transformer 0.5.x
 * Downstream: Consulting services, talent controllers, HR analytics processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 43 production-ready functions for talent management competing with McKinsey, BCG, Bain HR consulting tools
 *
 * LLM Context: Comprehensive talent management utilities for production-ready management consulting applications.
 * Provides workforce planning, succession planning, competency framework design, talent assessment, engagement surveys,
 * retention analysis, learning development plans, skills gap analysis, high-potential identification, performance calibration,
 * talent pipeline analytics, and diversity & inclusion metrics.
 */
import { Model, Sequelize, Transaction } from 'sequelize';
/**
 * Talent tier classifications
 */
export declare enum TalentTier {
    TOP_PERFORMER = "top_performer",
    HIGH_PERFORMER = "high_performer",
    SOLID_PERFORMER = "solid_performer",
    NEEDS_IMPROVEMENT = "needs_improvement",
    UNDERPERFORMER = "underperformer"
}
/**
 * Succession readiness levels
 */
export declare enum SuccessionReadiness {
    READY_NOW = "ready_now",
    READY_1_2_YEARS = "ready_1_2_years",
    READY_3_5_YEARS = "ready_3_5_years",
    NOT_READY = "not_ready",
    EMERGENCY_ONLY = "emergency_only"
}
/**
 * Competency proficiency levels
 */
export declare enum ProficiencyLevel {
    EXPERT = "expert",
    ADVANCED = "advanced",
    INTERMEDIATE = "intermediate",
    BASIC = "basic",
    NOVICE = "novice",
    NOT_APPLICABLE = "not_applicable"
}
/**
 * Engagement survey sentiment
 */
export declare enum EngagementLevel {
    HIGHLY_ENGAGED = "highly_engaged",
    ENGAGED = "engaged",
    NEUTRAL = "neutral",
    DISENGAGED = "disengaged",
    HIGHLY_DISENGAGED = "highly_disengaged"
}
/**
 * Flight risk categories
 */
export declare enum FlightRisk {
    LOW = "low",
    MODERATE = "moderate",
    HIGH = "high",
    CRITICAL = "critical"
}
/**
 * Development need priority
 */
export declare enum DevelopmentPriority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
/**
 * Learning intervention types
 */
export declare enum InterventionType {
    FORMAL_TRAINING = "formal_training",
    COACHING = "coaching",
    MENTORING = "mentoring",
    JOB_ROTATION = "job_rotation",
    STRETCH_ASSIGNMENT = "stretch_assignment",
    SELF_DIRECTED = "self_directed",
    EXTERNAL_COURSE = "external_course"
}
/**
 * Performance rating scale
 */
export declare enum PerformanceRating {
    EXCEPTIONAL = "exceptional",
    EXCEEDS_EXPECTATIONS = "exceeds_expectations",
    MEETS_EXPECTATIONS = "meets_expectations",
    PARTIALLY_MEETS = "partially_meets",
    DOES_NOT_MEET = "does_not_meet"
}
/**
 * Potential assessment
 */
export declare enum PotentialRating {
    HIGH_POTENTIAL = "high_potential",
    MEDIUM_POTENTIAL = "medium_potential",
    LOW_POTENTIAL = "low_potential",
    SPECIALIST = "specialist"
}
/**
 * Workforce planning scenario
 */
export declare enum PlanningScenario {
    BASELINE = "baseline",
    GROWTH = "growth",
    CONTRACTION = "contraction",
    TRANSFORMATION = "transformation",
    ACQUISITION = "acquisition"
}
/**
 * Talent review status
 */
export declare enum ReviewStatus {
    DRAFT = "draft",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    APPROVED = "approved",
    ARCHIVED = "archived"
}
interface WorkforcePlanData {
    planId: string;
    organizationId: string;
    departmentId?: string;
    scenario: PlanningScenario;
    planName: string;
    description: string;
    startDate: Date;
    endDate: Date;
    currentHeadcount: number;
    targetHeadcount: number;
    hires: number;
    attrition: number;
    internalMoves: number;
    budget: number;
    status: ReviewStatus;
    assumptions: string[];
    metadata?: Record<string, any>;
}
interface SuccessionPlanData {
    successionId: string;
    organizationId: string;
    criticalPositionId: string;
    positionTitle: string;
    incumbentId?: string;
    readinessLevel: SuccessionReadiness;
    successors: Array<{
        employeeId: string;
        readiness: SuccessionReadiness;
        developmentNeeds: string[];
    }>;
    riskOfLoss: FlightRisk;
    businessImpactScore: number;
    lastReviewDate: Date;
    nextReviewDate: Date;
    status: ReviewStatus;
    metadata?: Record<string, any>;
}
interface CompetencyFrameworkData {
    frameworkId: string;
    organizationId: string;
    name: string;
    description: string;
    applicableRoles: string[];
    competencies: Array<{
        competencyId: string;
        name: string;
        description: string;
        category: 'technical' | 'leadership' | 'behavioral' | 'functional';
        requiredLevel: ProficiencyLevel;
        weight: number;
    }>;
    effectiveDate: Date;
    isActive: boolean;
    metadata?: Record<string, any>;
}
interface TalentAssessmentData {
    assessmentId: string;
    organizationId: string;
    employeeId: string;
    assessmentType: 'performance' | 'potential' | '360' | 'competency' | 'psychometric';
    assessmentDate: Date;
    performanceRating?: PerformanceRating;
    potentialRating?: PotentialRating;
    talentTier: TalentTier;
    competencyScores: Array<{
        competencyId: string;
        score: number;
        proficiency: ProficiencyLevel;
    }>;
    strengths: string[];
    developmentAreas: string[];
    overallScore: number;
    assessorId: string;
    metadata?: Record<string, any>;
}
interface EngagementSurveyData {
    surveyId: string;
    organizationId: string;
    employeeId: string;
    surveyDate: Date;
    overallEngagement: EngagementLevel;
    engagementScore: number;
    dimensions: Array<{
        dimension: string;
        score: number;
        benchmark: number;
    }>;
    eNPS: number;
    comments?: string;
    flightRisk: FlightRisk;
    metadata?: Record<string, any>;
}
interface RetentionAnalysisData {
    analysisId: string;
    organizationId: string;
    employeeId: string;
    flightRisk: FlightRisk;
    riskScore: number;
    riskFactors: Array<{
        factor: string;
        weight: number;
        score: number;
    }>;
    tenureMonths: number;
    lastPromotion?: Date;
    lastRaise?: Date;
    engagementTrend: 'increasing' | 'stable' | 'declining';
    retentionRecommendations: string[];
    analysisDate: Date;
    metadata?: Record<string, any>;
}
interface DevelopmentPlanData {
    planId: string;
    organizationId: string;
    employeeId: string;
    planName: string;
    objectives: string[];
    competencyGaps: Array<{
        competencyId: string;
        currentLevel: ProficiencyLevel;
        targetLevel: ProficiencyLevel;
        priority: DevelopmentPriority;
    }>;
    interventions: Array<{
        interventionId: string;
        type: InterventionType;
        description: string;
        startDate: Date;
        endDate: Date;
        status: 'planned' | 'in_progress' | 'completed';
        cost?: number;
    }>;
    budget: number;
    startDate: Date;
    endDate: Date;
    progress: number;
    status: ReviewStatus;
    metadata?: Record<string, any>;
}
interface SkillsGapData {
    gapId: string;
    organizationId: string;
    departmentId?: string;
    skillCategory: string;
    skillName: string;
    currentSupply: number;
    requiredDemand: number;
    gap: number;
    gapPercent: number;
    criticalityScore: number;
    timeToFill: number;
    closureStrategy: 'hire' | 'develop' | 'contract' | 'automate';
    analysisDate: Date;
    metadata?: Record<string, any>;
}
/**
 * DTO for creating workforce plan
 */
export declare class CreateWorkforcePlanDto {
    organizationId: string;
    departmentId?: string;
    scenario: PlanningScenario;
    planName: string;
    description: string;
    startDate: Date;
    endDate: Date;
    currentHeadcount: number;
    targetHeadcount: number;
    hires: number;
    attrition: number;
    internalMoves: number;
    budget: number;
    assumptions: string[];
    metadata?: Record<string, any>;
}
/**
 * DTO for creating succession plan
 */
export declare class CreateSuccessionPlanDto {
    organizationId: string;
    criticalPositionId: string;
    positionTitle: string;
    incumbentId?: string;
    readinessLevel: SuccessionReadiness;
    successors: Array<{
        employeeId: string;
        readiness: SuccessionReadiness;
        developmentNeeds: string[];
    }>;
    riskOfLoss: FlightRisk;
    businessImpactScore: number;
    lastReviewDate: Date;
    nextReviewDate: Date;
    metadata?: Record<string, any>;
}
/**
 * DTO for creating competency framework
 */
export declare class CreateCompetencyFrameworkDto {
    organizationId: string;
    name: string;
    description: string;
    applicableRoles: string[];
    competencies: Array<{
        competencyId: string;
        name: string;
        description: string;
        category: 'technical' | 'leadership' | 'behavioral' | 'functional';
        requiredLevel: ProficiencyLevel;
        weight: number;
    }>;
    effectiveDate: Date;
    metadata?: Record<string, any>;
}
/**
 * DTO for creating talent assessment
 */
export declare class CreateTalentAssessmentDto {
    organizationId: string;
    employeeId: string;
    assessmentType: 'performance' | 'potential' | '360' | 'competency' | 'psychometric';
    assessmentDate: Date;
    performanceRating?: PerformanceRating;
    potentialRating?: PotentialRating;
    talentTier: TalentTier;
    competencyScores: Array<{
        competencyId: string;
        score: number;
        proficiency: ProficiencyLevel;
    }>;
    strengths: string[];
    developmentAreas: string[];
    overallScore: number;
    assessorId: string;
    metadata?: Record<string, any>;
}
/**
 * DTO for engagement survey
 */
export declare class CreateEngagementSurveyDto {
    organizationId: string;
    employeeId: string;
    surveyDate: Date;
    overallEngagement: EngagementLevel;
    engagementScore: number;
    dimensions: Array<{
        dimension: string;
        score: number;
        benchmark: number;
    }>;
    eNPS: number;
    comments?: string;
    flightRisk: FlightRisk;
    metadata?: Record<string, any>;
}
/**
 * DTO for retention analysis
 */
export declare class CreateRetentionAnalysisDto {
    organizationId: string;
    employeeId: string;
    flightRisk: FlightRisk;
    riskScore: number;
    riskFactors: Array<{
        factor: string;
        weight: number;
        score: number;
    }>;
    tenureMonths: number;
    lastPromotion?: Date;
    lastRaise?: Date;
    engagementTrend: 'increasing' | 'stable' | 'declining';
    retentionRecommendations: string[];
    metadata?: Record<string, any>;
}
/**
 * DTO for development plan
 */
export declare class CreateDevelopmentPlanDto {
    organizationId: string;
    employeeId: string;
    planName: string;
    objectives: string[];
    competencyGaps: Array<{
        competencyId: string;
        currentLevel: ProficiencyLevel;
        targetLevel: ProficiencyLevel;
        priority: DevelopmentPriority;
    }>;
    interventions: Array<{
        interventionId: string;
        type: InterventionType;
        description: string;
        startDate: Date;
        endDate: Date;
        status: 'planned' | 'in_progress' | 'completed';
        cost?: number;
    }>;
    budget: number;
    startDate: Date;
    endDate: Date;
    progress: number;
    metadata?: Record<string, any>;
}
/**
 * DTO for skills gap analysis
 */
export declare class CreateSkillsGapDto {
    organizationId: string;
    departmentId?: string;
    skillCategory: string;
    skillName: string;
    currentSupply: number;
    requiredDemand: number;
    criticalityScore: number;
    timeToFill: number;
    closureStrategy: 'hire' | 'develop' | 'contract' | 'automate';
    metadata?: Record<string, any>;
}
/**
 * Workforce Plan Model
 */
export declare class WorkforcePlanModel extends Model<WorkforcePlanData> implements WorkforcePlanData {
    planId: string;
    organizationId: string;
    departmentId?: string;
    scenario: PlanningScenario;
    planName: string;
    description: string;
    startDate: Date;
    endDate: Date;
    currentHeadcount: number;
    targetHeadcount: number;
    hires: number;
    attrition: number;
    internalMoves: number;
    budget: number;
    status: ReviewStatus;
    assumptions: string[];
    metadata?: Record<string, any>;
    static initialize(sequelize: Sequelize): typeof WorkforcePlanModel;
}
/**
 * Succession Plan Model
 */
export declare class SuccessionPlanModel extends Model<SuccessionPlanData> implements SuccessionPlanData {
    successionId: string;
    organizationId: string;
    criticalPositionId: string;
    positionTitle: string;
    incumbentId?: string;
    readinessLevel: SuccessionReadiness;
    successors: Array<{
        employeeId: string;
        readiness: SuccessionReadiness;
        developmentNeeds: string[];
    }>;
    riskOfLoss: FlightRisk;
    businessImpactScore: number;
    lastReviewDate: Date;
    nextReviewDate: Date;
    status: ReviewStatus;
    metadata?: Record<string, any>;
    static initialize(sequelize: Sequelize): typeof SuccessionPlanModel;
}
/**
 * Competency Framework Model
 */
export declare class CompetencyFrameworkModel extends Model<CompetencyFrameworkData> implements CompetencyFrameworkData {
    frameworkId: string;
    organizationId: string;
    name: string;
    description: string;
    applicableRoles: string[];
    competencies: Array<{
        competencyId: string;
        name: string;
        description: string;
        category: 'technical' | 'leadership' | 'behavioral' | 'functional';
        requiredLevel: ProficiencyLevel;
        weight: number;
    }>;
    effectiveDate: Date;
    isActive: boolean;
    metadata?: Record<string, any>;
    static initialize(sequelize: Sequelize): typeof CompetencyFrameworkModel;
}
/**
 * Talent Assessment Model
 */
export declare class TalentAssessmentModel extends Model<TalentAssessmentData> implements TalentAssessmentData {
    assessmentId: string;
    organizationId: string;
    employeeId: string;
    assessmentType: 'performance' | 'potential' | '360' | 'competency' | 'psychometric';
    assessmentDate: Date;
    performanceRating?: PerformanceRating;
    potentialRating?: PotentialRating;
    talentTier: TalentTier;
    competencyScores: Array<{
        competencyId: string;
        score: number;
        proficiency: ProficiencyLevel;
    }>;
    strengths: string[];
    developmentAreas: string[];
    overallScore: number;
    assessorId: string;
    metadata?: Record<string, any>;
    static initialize(sequelize: Sequelize): typeof TalentAssessmentModel;
}
/**
 * Engagement Survey Model
 */
export declare class EngagementSurveyModel extends Model<EngagementSurveyData> implements EngagementSurveyData {
    surveyId: string;
    organizationId: string;
    employeeId: string;
    surveyDate: Date;
    overallEngagement: EngagementLevel;
    engagementScore: number;
    dimensions: Array<{
        dimension: string;
        score: number;
        benchmark: number;
    }>;
    eNPS: number;
    comments?: string;
    flightRisk: FlightRisk;
    metadata?: Record<string, any>;
    static initialize(sequelize: Sequelize): typeof EngagementSurveyModel;
}
/**
 * Retention Analysis Model
 */
export declare class RetentionAnalysisModel extends Model<RetentionAnalysisData> implements RetentionAnalysisData {
    analysisId: string;
    organizationId: string;
    employeeId: string;
    flightRisk: FlightRisk;
    riskScore: number;
    riskFactors: Array<{
        factor: string;
        weight: number;
        score: number;
    }>;
    tenureMonths: number;
    lastPromotion?: Date;
    lastRaise?: Date;
    engagementTrend: 'increasing' | 'stable' | 'declining';
    retentionRecommendations: string[];
    analysisDate: Date;
    metadata?: Record<string, any>;
    static initialize(sequelize: Sequelize): typeof RetentionAnalysisModel;
}
/**
 * Development Plan Model
 */
export declare class DevelopmentPlanModel extends Model<DevelopmentPlanData> implements DevelopmentPlanData {
    planId: string;
    organizationId: string;
    employeeId: string;
    planName: string;
    objectives: string[];
    competencyGaps: Array<{
        competencyId: string;
        currentLevel: ProficiencyLevel;
        targetLevel: ProficiencyLevel;
        priority: DevelopmentPriority;
    }>;
    interventions: Array<{
        interventionId: string;
        type: InterventionType;
        description: string;
        startDate: Date;
        endDate: Date;
        status: 'planned' | 'in_progress' | 'completed';
        cost?: number;
    }>;
    budget: number;
    startDate: Date;
    endDate: Date;
    progress: number;
    status: ReviewStatus;
    metadata?: Record<string, any>;
    static initialize(sequelize: Sequelize): typeof DevelopmentPlanModel;
}
/**
 * Skills Gap Model
 */
export declare class SkillsGapModel extends Model<SkillsGapData> implements SkillsGapData {
    gapId: string;
    organizationId: string;
    departmentId?: string;
    skillCategory: string;
    skillName: string;
    currentSupply: number;
    requiredDemand: number;
    gap: number;
    gapPercent: number;
    criticalityScore: number;
    timeToFill: number;
    closureStrategy: 'hire' | 'develop' | 'contract' | 'automate';
    analysisDate: Date;
    metadata?: Record<string, any>;
    static initialize(sequelize: Sequelize): typeof SkillsGapModel;
}
/**
 * 1. Create workforce plan
 */
export declare function createWorkforcePlan(dto: CreateWorkforcePlanDto, transaction?: Transaction): Promise<WorkforcePlanModel>;
/**
 * 2. Calculate workforce gap
 */
export declare function calculateWorkforceGap(current: number, target: number, attrition: number): {
    netGap: number;
    totalNeed: number;
    attritionImpact: number;
};
/**
 * 3. Project headcount over time
 */
export declare function projectHeadcount(baseline: number, monthlyHires: number, monthlyAttritionRate: number, months: number): Array<{
    month: number;
    headcount: number;
    hires: number;
    attrition: number;
}>;
/**
 * 4. Calculate span of control metrics
 */
export declare function calculateSpanOfControl(managers: number, directReports: number): {
    avgSpan: number;
    recommendation: 'narrow' | 'optimal' | 'wide';
    efficiency: number;
};
/**
 * 5. Create succession plan
 */
export declare function createSuccessionPlan(dto: CreateSuccessionPlanDto, transaction?: Transaction): Promise<SuccessionPlanModel>;
/**
 * 6. Calculate succession bench strength
 */
export declare function calculateBenchStrength(criticalPositions: number, readyNowSuccessors: number, ready1to2Successors: number): {
    benchStrength: number;
    coverageRatio: number;
    riskLevel: 'low' | 'medium' | 'high';
};
/**
 * 7. Identify succession gaps
 */
export declare function identifySuccessionGaps(organizationId: string): Promise<Array<{
    positionId: string;
    title: string;
    successorCount: number;
    readyNow: number;
    gapSeverity: 'critical' | 'high' | 'medium';
}>>;
/**
 * 8. Create competency framework
 */
export declare function createCompetencyFramework(dto: CreateCompetencyFrameworkDto, transaction?: Transaction): Promise<CompetencyFrameworkModel>;
/**
 * 9. Calculate competency gap score
 */
export declare function calculateCompetencyGap(currentLevel: ProficiencyLevel, requiredLevel: ProficiencyLevel): {
    gapScore: number;
    priority: DevelopmentPriority;
};
/**
 * 10. Aggregate competency scores
 */
export declare function aggregateCompetencyScores(scores: Array<{
    competencyId: string;
    score: number;
    weight: number;
}>): {
    weightedAverage: number;
    totalWeight: number;
    distribution: Record<string, number>;
};
/**
 * 11. Create talent assessment
 */
export declare function createTalentAssessment(dto: CreateTalentAssessmentDto, transaction?: Transaction): Promise<TalentAssessmentModel>;
/**
 * 12. Build 9-box grid placement
 */
export declare function build9BoxGrid(performance: PerformanceRating, potential: PotentialRating): {
    box: string;
    category: string;
    talentAction: string;
};
/**
 * 13. Calculate performance calibration
 */
export declare function calibratePerformanceRatings(ratings: Array<{
    employeeId: string;
    rating: PerformanceRating;
    score: number;
}>, targetDistribution: Record<PerformanceRating, number>): {
    calibratedRatings: Array<{
        employeeId: string;
        original: PerformanceRating;
        calibrated: PerformanceRating;
    }>;
    deviation: number;
};
/**
 * 14. Identify high potentials
 */
export declare function identifyHighPotentials(organizationId: string, criteria: {
    minPerformanceScore: number;
    minPotentialRating: PotentialRating;
    minTenureMonths: number;
}): Promise<Array<{
    employeeId: string;
    score: number;
    talentTier: TalentTier;
    reasoning: string[];
}>>;
/**
 * 15. Create engagement survey
 */
export declare function createEngagementSurvey(dto: CreateEngagementSurveyDto, transaction?: Transaction): Promise<EngagementSurveyModel>;
/**
 * 16. Calculate engagement index
 */
export declare function calculateEngagementIndex(dimensions: Array<{
    dimension: string;
    score: number;
}>): {
    index: number;
    level: EngagementLevel;
    topDimensions: string[];
    bottomDimensions: string[];
};
/**
 * 17. Calculate eNPS (Employee Net Promoter Score)
 */
export declare function calculateENPS(scores: number[]): {
    eNPS: number;
    promoters: number;
    passives: number;
    detractors: number;
    distribution: Record<string, number>;
};
/**
 * 18. Analyze engagement trends
 */
export declare function analyzeEngagementTrends(organizationId: string, employeeId: string, months?: number): Promise<{
    trend: 'improving' | 'stable' | 'declining';
    changePercent: number;
    surveys: number;
}>;
/**
 * 19. Create retention analysis
 */
export declare function createRetentionAnalysis(dto: CreateRetentionAnalysisDto, transaction?: Transaction): Promise<RetentionAnalysisModel>;
/**
 * 20. Calculate flight risk score
 */
export declare function calculateFlightRiskScore(factors: Array<{
    factor: string;
    weight: number;
    score: number;
}>): {
    riskScore: number;
    flightRisk: FlightRisk;
    topFactors: Array<{
        factor: string;
        contribution: number;
    }>;
};
/**
 * 21. Predict voluntary attrition
 */
export declare function predictVoluntaryAttrition(indicators: {
    engagementScore: number;
    tenureMonths: number;
    timeSinceLastPromotion: number;
    timeSinceLastRaise: number;
    performanceRating: PerformanceRating;
}): {
    attritionProbability: number;
    primaryReasons: string[];
    recommendedActions: string[];
};
/**
 * 22. Calculate retention cost impact
 */
export declare function calculateRetentionCostImpact(salary: number, replacementCostMultiplier?: number, productivityLossMonths?: number): {
    replacementCost: number;
    productivityLoss: number;
    totalImpact: number;
};
/**
 * 23. Create development plan
 */
export declare function createDevelopmentPlan(dto: CreateDevelopmentPlanDto, transaction?: Transaction): Promise<DevelopmentPlanModel>;
/**
 * 24. Prioritize development interventions
 */
export declare function prioritizeDevelopmentInterventions(gaps: Array<{
    competency: string;
    gap: number;
    businessImpact: number;
    urgency: number;
}>): Array<{
    competency: string;
    priorityScore: number;
    rank: number;
    recommendedIntervention: InterventionType;
}>;
/**
 * 25. Calculate development ROI
 */
export declare function calculateDevelopmentROI(investment: {
    trainingCost: number;
    timeInvestmentHours: number;
    hourlyRate: number;
}, outcomes: {
    productivityGain: number;
    performanceImprovement: number;
    retentionImpact: number;
}): {
    totalCost: number;
    totalBenefit: number;
    roi: number;
    paybackMonths: number;
};
/**
 * 26. Track development plan progress
 */
export declare function trackDevelopmentProgress(planId: string): Promise<{
    overallProgress: number;
    completedInterventions: number;
    onTrack: boolean;
    nextMilestones: string[];
}>;
/**
 * 27. Create skills gap analysis
 */
export declare function createSkillsGap(dto: CreateSkillsGapDto, transaction?: Transaction): Promise<SkillsGapModel>;
/**
 * 28. Prioritize skills gaps
 */
export declare function prioritizeSkillsGaps(organizationId: string): Promise<Array<{
    skillName: string;
    gap: number;
    criticalityScore: number;
    priorityRank: number;
    closureStrategy: string;
}>>;
/**
 * 29. Calculate skills supply-demand ratio
 */
export declare function calculateSkillsSupplyDemand(supply: number, demand: number): {
    ratio: number;
    status: 'surplus' | 'balanced' | 'shortage' | 'critical_shortage';
    actionRequired: string;
};
/**
 * 30. Recommend skills closure strategy
 */
export declare function recommendSkillsClosureStrategy(gap: {
    size: number;
    criticalityScore: number;
    timeToFill: number;
    currentMarketAvailability: number;
}): {
    strategy: 'hire' | 'develop' | 'contract' | 'automate';
    rationale: string;
    estimatedTimeframe: number;
};
/**
 * 31. Build talent pipeline metrics
 */
export declare function buildTalentPipelineMetrics(organizationId: string): Promise<{
    pipelineDepth: number;
    readyNowCount: number;
    highPotentialCount: number;
    criticalRoleCoverage: number;
    pipelineHealth: 'strong' | 'adequate' | 'weak';
}>;
/**
 * 32. Calculate diversity metrics
 */
export declare function calculateDiversityMetrics(workforce: Array<{
    gender: string;
    ethnicity: string;
    age: number;
    level: string;
}>): {
    genderDiversity: Record<string, number>;
    ethnicDiversity: Record<string, number>;
    ageDistribution: Record<string, number>;
    leadershipDiversity: number;
};
/**
 * 33. Calculate talent density
 */
export declare function calculateTalentDensity(topPerformers: number, totalWorkforce: number): {
    densityPercent: number;
    benchmark: number;
    rating: 'exceptional' | 'strong' | 'adequate' | 'weak';
};
/**
 * 34. Analyze performance distribution
 */
export declare function analyzePerformanceDistribution(ratings: PerformanceRating[]): {
    distribution: Record<PerformanceRating, number>;
    mean: number;
    median: PerformanceRating;
    skew: 'positive' | 'neutral' | 'negative';
};
/**
 * 35. Calculate learning velocity
 */
export declare function calculateLearningVelocity(interventions: Array<{
    startDate: Date;
    endDate: Date;
    completed: boolean;
}>, competencyGainMonths: number): {
    interventionsPerMonth: number;
    completionRate: number;
    learningVelocity: number;
};
/**
 * 36. Model talent acquisition needs
 */
export declare function modelTalentAcquisitionNeeds(plan: {
    targetHeadcount: number;
    currentHeadcount: number;
    attritionRate: number;
    internalMobility: number;
}, timeline: number): {
    externalHires: number;
    internalPromotions: number;
    monthlyHiringRate: number;
    recruitingCapacityNeeded: number;
};
/**
 * 37. Calculate talent mobility index
 */
export declare function calculateTalentMobilityIndex(movements: {
    promotions: number;
    lateralMoves: number;
    crossFunctional: number;
}, workforce: number): {
    mobilityIndex: number;
    promotionRate: number;
    crossFunctionalRate: number;
    mobilityHealth: 'high' | 'moderate' | 'low';
};
/**
 * 38. Analyze compensation competitiveness
 */
export declare function analyzeCompensationCompetitiveness(internal: {
    salary: number;
    bonus: number;
    equity: number;
}, market: {
    p50: number;
    p75: number;
    p90: number;
}): {
    totalComp: number;
    marketPosition: number;
    competitiveness: 'leading' | 'competitive' | 'lagging';
    gap: number;
};
/**
 * 39. Calculate time-to-fill metrics
 */
export declare function calculateTimeToFill(requisitions: Array<{
    openedDate: Date;
    filledDate: Date;
    role: string;
    level: string;
}>): {
    avgTimeToFill: number;
    medianTimeToFill: number;
    byLevel: Record<string, number>;
    efficiency: number;
};
/**
 * 40. Generate talent review insights
 */
export declare function generateTalentReviewInsights(organizationId: string): Promise<{
    topTalentCount: number;
    flightRiskCount: number;
    successionCoverage: number;
    developmentInvestment: number;
    keyInsights: string[];
    recommendations: string[];
}>;
/**
 * 41. Calculate workforce productivity index
 */
export declare function calculateWorkforceProductivityIndex(metrics: {
    revenuePerEmployee: number;
    profitPerEmployee: number;
    utilizationRate: number;
}): {
    productivityIndex: number;
    rating: 'exceptional' | 'strong' | 'average' | 'below_average';
};
/**
 * 42. Model organizational change impact
 */
export declare function modelOrganizationalChangeImpact(change: {
    affectedHeadcount: number;
    typeOfChange: 'restructure' | 'merger' | 'layoff' | 'expansion';
}, workforce: {
    totalHeadcount: number;
    avgTenure: number;
    engagementScore: number;
}): {
    impactScore: number;
    attritionRisk: number;
    productivityDip: number;
    recoveryMonths: number;
    recommendations: string[];
};
/**
 * 43. Generate workforce scenario planning
 */
export declare function generateWorkforceScenarios(baseline: {
    headcount: number;
    avgSalary: number;
    budget: number;
}, scenarios: Array<{
    name: string;
    growthRate: number;
    attritionRate: number;
    salaryInflation: number;
}>): Array<{
    scenario: string;
    projectedHeadcount: number;
    projectedCost: number;
    budgetVariance: number;
    feasibility: 'within_budget' | 'over_budget' | 'significantly_over';
}>;
export declare const TalentManagementKit: {
    WorkforcePlanModel: typeof WorkforcePlanModel;
    SuccessionPlanModel: typeof SuccessionPlanModel;
    CompetencyFrameworkModel: typeof CompetencyFrameworkModel;
    TalentAssessmentModel: typeof TalentAssessmentModel;
    EngagementSurveyModel: typeof EngagementSurveyModel;
    RetentionAnalysisModel: typeof RetentionAnalysisModel;
    DevelopmentPlanModel: typeof DevelopmentPlanModel;
    SkillsGapModel: typeof SkillsGapModel;
    CreateWorkforcePlanDto: typeof CreateWorkforcePlanDto;
    CreateSuccessionPlanDto: typeof CreateSuccessionPlanDto;
    CreateCompetencyFrameworkDto: typeof CreateCompetencyFrameworkDto;
    CreateTalentAssessmentDto: typeof CreateTalentAssessmentDto;
    CreateEngagementSurveyDto: typeof CreateEngagementSurveyDto;
    CreateRetentionAnalysisDto: typeof CreateRetentionAnalysisDto;
    CreateDevelopmentPlanDto: typeof CreateDevelopmentPlanDto;
    CreateSkillsGapDto: typeof CreateSkillsGapDto;
    createWorkforcePlan: typeof createWorkforcePlan;
    calculateWorkforceGap: typeof calculateWorkforceGap;
    projectHeadcount: typeof projectHeadcount;
    calculateSpanOfControl: typeof calculateSpanOfControl;
    createSuccessionPlan: typeof createSuccessionPlan;
    calculateBenchStrength: typeof calculateBenchStrength;
    identifySuccessionGaps: typeof identifySuccessionGaps;
    createCompetencyFramework: typeof createCompetencyFramework;
    calculateCompetencyGap: typeof calculateCompetencyGap;
    aggregateCompetencyScores: typeof aggregateCompetencyScores;
    createTalentAssessment: typeof createTalentAssessment;
    build9BoxGrid: typeof build9BoxGrid;
    calibratePerformanceRatings: typeof calibratePerformanceRatings;
    identifyHighPotentials: typeof identifyHighPotentials;
    createEngagementSurvey: typeof createEngagementSurvey;
    calculateEngagementIndex: typeof calculateEngagementIndex;
    calculateENPS: typeof calculateENPS;
    analyzeEngagementTrends: typeof analyzeEngagementTrends;
    createRetentionAnalysis: typeof createRetentionAnalysis;
    calculateFlightRiskScore: typeof calculateFlightRiskScore;
    predictVoluntaryAttrition: typeof predictVoluntaryAttrition;
    calculateRetentionCostImpact: typeof calculateRetentionCostImpact;
    createDevelopmentPlan: typeof createDevelopmentPlan;
    prioritizeDevelopmentInterventions: typeof prioritizeDevelopmentInterventions;
    calculateDevelopmentROI: typeof calculateDevelopmentROI;
    trackDevelopmentProgress: typeof trackDevelopmentProgress;
    createSkillsGap: typeof createSkillsGap;
    prioritizeSkillsGaps: typeof prioritizeSkillsGaps;
    calculateSkillsSupplyDemand: typeof calculateSkillsSupplyDemand;
    recommendSkillsClosureStrategy: typeof recommendSkillsClosureStrategy;
    buildTalentPipelineMetrics: typeof buildTalentPipelineMetrics;
    calculateDiversityMetrics: typeof calculateDiversityMetrics;
    calculateTalentDensity: typeof calculateTalentDensity;
    analyzePerformanceDistribution: typeof analyzePerformanceDistribution;
    calculateLearningVelocity: typeof calculateLearningVelocity;
    modelTalentAcquisitionNeeds: typeof modelTalentAcquisitionNeeds;
    calculateTalentMobilityIndex: typeof calculateTalentMobilityIndex;
    analyzeCompensationCompetitiveness: typeof analyzeCompensationCompetitiveness;
    calculateTimeToFill: typeof calculateTimeToFill;
    generateTalentReviewInsights: typeof generateTalentReviewInsights;
    calculateWorkforceProductivityIndex: typeof calculateWorkforceProductivityIndex;
    modelOrganizationalChangeImpact: typeof modelOrganizationalChangeImpact;
    generateWorkforceScenarios: typeof generateWorkforceScenarios;
};
export default TalentManagementKit;
//# sourceMappingURL=talent-management-kit.d.ts.map