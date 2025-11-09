/**
 * LOC: HCMWFP1234567
 * File: /reuse/server/human-capital/workforce-planning-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../../error-handling-kit.ts
 *   - ../../validation-kit.ts
 *   - ../../database-models-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend HR services
 *   - Workforce planning controllers
 *   - Strategic planning dashboards
 */
/**
 * File: /reuse/server/human-capital/workforce-planning-kit.ts
 * Locator: WC-HCM-WFP-001
 * Purpose: Comprehensive Workforce Planning & Forecasting Utilities - SAP SuccessFactors Workforce Analytics parity
 *
 * Upstream: Error handling, validation, database models
 * Downstream: ../backend/*, HR services, workforce planning controllers, strategic planning dashboards
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Zod 3.x
 * Exports: 48+ utility functions for workforce planning, headcount forecasting, skills gap analysis, scenario planning
 *
 * LLM Context: Enterprise-grade workforce planning system competing with SAP SuccessFactors Workforce Analytics.
 * Provides strategic workforce planning, headcount forecasting, supply/demand modeling, skills gap analysis,
 * scenario planning, workforce segmentation, critical role identification, cost modeling, retirement projections,
 * hiring plans, contingent workforce planning, and comprehensive workforce planning dashboards.
 */
import { Sequelize } from 'sequelize';
export declare const WorkforcePlanSchema: any;
export declare const HeadcountForecastSchema: any;
export declare const SkillsGapSchema: any;
export declare const ScenarioSchema: any;
interface WorkforcePlan {
    planId: string;
    planName: string;
    fiscalYear: number;
    planningHorizon: 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM';
    organizationUnit: string;
    status: 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'ACTIVE' | 'ARCHIVED';
    startDate: Date;
    endDate: Date;
    targetHeadcount: number;
    currentHeadcount: number;
    budgetedPositions: number;
    objectives: string[];
    metadata: Record<string, any>;
}
interface HeadcountForecast {
    forecastId: string;
    forecastPeriod: string;
    department: string;
    jobFamily: string;
    currentHeadcount: number;
    projectedHeadcount: number;
    variance: number;
    variancePercent: number;
    confidenceLevel: number;
    forecastMethod: 'LINEAR_REGRESSION' | 'TIME_SERIES' | 'MACHINE_LEARNING' | 'JUDGMENTAL';
    assumptions: string[];
}
interface SupplyDemandAnalysis {
    period: string;
    demand: {
        newPositions: number;
        replacements: number;
        growthHires: number;
        total: number;
    };
    supply: {
        internalCandidates: number;
        externalPipeline: number;
        transfers: number;
        total: number;
    };
    gap: number;
    recommendations: string[];
}
interface SkillsGapAnalysis {
    skillCategory: string;
    skillName: string;
    requiredProficiency: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
    currentProficiency: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
    employeesRequired: number;
    employeesAvailable: number;
    gap: number;
    gapPercent: number;
    gapSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    closureStrategy: string[];
    estimatedClosureTime: number;
}
interface ScenarioAnalysis {
    scenarioId: string;
    scenarioName: string;
    scenarioType: 'OPTIMISTIC' | 'BASELINE' | 'PESSIMISTIC' | 'CUSTOM';
    assumptions: {
        growthRate: number;
        attritionRate: number;
        budgetChange: number;
        marketConditions: string;
    };
    projectedOutcomes: {
        headcount: number;
        costImpact: number;
        timeToHire: number;
        skillsAvailability: number;
    };
    riskAssessment: {
        probability: number;
        impact: 'LOW' | 'MEDIUM' | 'HIGH';
        mitigation: string[];
    };
}
interface WorkforceSegment {
    segmentId: string;
    segmentName: string;
    segmentationType: 'DEMOGRAPHIC' | 'SKILLS' | 'PERFORMANCE' | 'TENURE' | 'COST' | 'STRATEGIC';
    criteria: Record<string, any>;
    employeeCount: number;
    percentOfWorkforce: number;
    characteristics: {
        avgTenure: number;
        avgAge: number;
        avgCompensation: number;
        performanceRating: number;
    };
    trends: {
        growth: number;
        attrition: number;
        productivity: number;
    };
}
interface CriticalRole {
    roleId: string;
    roleTitle: string;
    department: string;
    criticalityScore: number;
    criticalityReason: 'REVENUE_IMPACT' | 'SCARCE_SKILLS' | 'STRATEGIC' | 'REGULATORY' | 'OPERATIONAL';
    currentIncumbents: number;
    requiredIncumbents: number;
    successionDepth: number;
    retirementRisk: number;
    developmentPriority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    successionPlan: {
        readyNow: number;
        ready1Year: number;
        ready2Plus: number;
    };
}
interface WorkforceCostModel {
    modelId: string;
    fiscalYear: number;
    period: string;
    costCategories: {
        salaries: number;
        benefits: number;
        bonuses: number;
        training: number;
        recruitment: number;
        overhead: number;
    };
    costPerEmployee: number;
    costPerHire: number;
    totalWorkforceCost: number;
    budgetVariance: number;
    projections: Array<{
        period: string;
        projectedCost: number;
        assumptions: string[];
    }>;
}
interface RetirementProjection {
    projectionId: string;
    department: string;
    timeHorizon: '1_YEAR' | '3_YEAR' | '5_YEAR' | '10_YEAR';
    retirementEligible: number;
    projectedRetirements: number;
    criticalRolesImpacted: number;
    knowledgeTransferRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    successorReadiness: {
        ready: number;
        developing: number;
        notIdentified: number;
    };
    recommendations: string[];
}
interface AttritionProjection {
    period: string;
    department: string;
    voluntaryAttrition: number;
    involuntaryAttrition: number;
    retirementAttrition: number;
    totalAttrition: number;
    attritionRate: number;
    industryBenchmark: number;
    trendDirection: 'IMPROVING' | 'STABLE' | 'WORSENING';
    riskFactors: string[];
}
interface HiringPlan {
    planId: string;
    fiscalYear: number;
    department: string;
    newPositions: number;
    replacementPositions: number;
    totalHires: number;
    timeline: Array<{
        period: string;
        plannedHires: number;
        estimatedStartDates: Date[];
    }>;
    budget: number;
    approvalStatus: 'PENDING' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED';
    recruitmentStrategy: string[];
}
interface ContingentWorkforce {
    workforceType: 'CONTRACTORS' | 'CONSULTANTS' | 'TEMPORARY' | 'SEASONAL' | 'FREELANCE';
    currentCount: number;
    projectedCount: number;
    costComparison: {
        contingentCost: number;
        fteCost: number;
        savings: number;
    };
    utilizationRate: number;
    conversionRate: number;
    riskAssessment: {
        compliance: 'LOW' | 'MEDIUM' | 'HIGH';
        knowledgeRetention: 'LOW' | 'MEDIUM' | 'HIGH';
        culturalImpact: 'LOW' | 'MEDIUM' | 'HIGH';
    };
}
interface WorkforcePlanningDashboard {
    dashboardId: string;
    organizationUnit: string;
    asOfDate: Date;
    summary: {
        totalHeadcount: number;
        vacancies: number;
        plannedHires: number;
        projectedAttrition: number;
        criticalRoles: number;
        skillsGaps: number;
    };
    kpis: Array<{
        kpiName: string;
        current: number;
        target: number;
        status: 'ON_TARGET' | 'AT_RISK' | 'OFF_TARGET';
    }>;
    alerts: Array<{
        severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
        message: string;
        actionRequired: string;
    }>;
}
/**
 * Sequelize model for Workforce Plans with approval workflow and versioning.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} WorkforcePlan model
 *
 * @example
 * ```typescript
 * const WorkforcePlan = createWorkforcePlanModel(sequelize);
 * const plan = await WorkforcePlan.create({
 *   planName: 'FY2025 Workforce Strategy',
 *   fiscalYear: 2025,
 *   planningHorizon: 'MEDIUM_TERM',
 *   organizationUnit: 'Engineering'
 * });
 * ```
 */
export declare const createWorkforcePlanModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        planId: string;
        planName: string;
        fiscalYear: number;
        planningHorizon: string;
        organizationUnit: string;
        status: string;
        startDate: Date;
        endDate: Date;
        targetHeadcount: number;
        currentHeadcount: number;
        budgetedPositions: number;
        objectives: string[];
        strategies: Record<string, any>;
        version: number;
        createdBy: string;
        approvedBy: string | null;
        approvedAt: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Headcount Forecasts with confidence intervals.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} HeadcountForecast model
 *
 * @example
 * ```typescript
 * const HeadcountForecast = createHeadcountForecastModel(sequelize);
 * const forecast = await HeadcountForecast.create({
 *   forecastPeriod: '2025-Q3',
 *   department: 'Engineering',
 *   projectedHeadcount: 450,
 *   forecastMethod: 'MACHINE_LEARNING'
 * });
 * ```
 */
export declare const createHeadcountForecastModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        forecastId: string;
        forecastPeriod: string;
        department: string;
        jobFamily: string;
        currentHeadcount: number;
        projectedHeadcount: number;
        variance: number;
        variancePercent: number;
        confidenceLevel: number;
        confidenceInterval: Record<string, any>;
        forecastMethod: string;
        assumptions: string[];
        scenarioType: string;
        createdBy: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Skills Gap Analysis with closure tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SkillsGap model
 *
 * @example
 * ```typescript
 * const SkillsGap = createSkillsGapModel(sequelize);
 * const gap = await SkillsGap.create({
 *   skillCategory: 'Cloud Computing',
 *   skillName: 'AWS Solutions Architect',
 *   gapSeverity: 'HIGH',
 *   employeesRequired: 20
 * });
 * ```
 */
export declare const createSkillsGapModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        gapId: string;
        skillCategory: string;
        skillName: string;
        requiredProficiency: string;
        currentProficiency: string;
        employeesRequired: number;
        employeesAvailable: number;
        gap: number;
        gapPercent: number;
        gapSeverity: string;
        closureStrategy: string[];
        estimatedClosureTime: number;
        closureProgress: number;
        businessImpact: string;
        priority: number;
        assignedTo: string | null;
        targetClosureDate: Date | null;
        status: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a comprehensive workforce plan with objectives and strategies.
 *
 * @param {Partial<WorkforcePlan>} planData - Workforce plan data
 * @param {string} userId - User creating the plan
 * @returns {Promise<WorkforcePlan>} Created workforce plan
 *
 * @example
 * ```typescript
 * const plan = await createWorkforcePlan({
 *   planName: 'FY2025 Engineering Workforce Strategy',
 *   fiscalYear: 2025,
 *   planningHorizon: 'MEDIUM_TERM',
 *   organizationUnit: 'Engineering'
 * }, 'user123');
 * ```
 */
export declare const createWorkforcePlan: (planData: Partial<WorkforcePlan>, userId: string) => Promise<WorkforcePlan>;
/**
 * Updates workforce plan with revised objectives and strategies.
 *
 * @param {string} planId - Plan identifier
 * @param {Partial<WorkforcePlan>} updates - Plan updates
 * @param {string} userId - User updating the plan
 * @returns {Promise<WorkforcePlan>} Updated workforce plan
 *
 * @example
 * ```typescript
 * const updated = await updateWorkforcePlan('WFP-12345', {
 *   targetHeadcount: 500,
 *   objectives: ['Increase technical talent by 20%']
 * }, 'user123');
 * ```
 */
export declare const updateWorkforcePlan: (planId: string, updates: Partial<WorkforcePlan>, userId: string) => Promise<WorkforcePlan>;
/**
 * Approves workforce plan and activates it for execution.
 *
 * @param {string} planId - Plan identifier
 * @param {string} approverId - User approving the plan
 * @param {string} [comments] - Approval comments
 * @returns {Promise<{ approved: boolean; approvedAt: Date; approvedBy: string }>} Approval result
 *
 * @example
 * ```typescript
 * const approval = await approveWorkforcePlan('WFP-12345', 'director123', 'Approved with budget constraints');
 * ```
 */
export declare const approveWorkforcePlan: (planId: string, approverId: string, comments?: string) => Promise<{
    approved: boolean;
    approvedAt: Date;
    approvedBy: string;
}>;
/**
 * Aligns workforce plan with organizational strategic objectives.
 *
 * @param {string} planId - Plan identifier
 * @param {string[]} strategicObjectives - Strategic objectives
 * @returns {Promise<{ aligned: boolean; alignmentScore: number; gaps: string[] }>} Alignment analysis
 *
 * @example
 * ```typescript
 * const alignment = await alignPlanWithStrategy('WFP-12345', [
 *   'Expand cloud services',
 *   'Improve customer experience'
 * ]);
 * ```
 */
export declare const alignPlanWithStrategy: (planId: string, strategicObjectives: string[]) => Promise<{
    aligned: boolean;
    alignmentScore: number;
    gaps: string[];
}>;
/**
 * Generates workforce plan execution roadmap with milestones.
 *
 * @param {string} planId - Plan identifier
 * @returns {Promise<Array<{ phase: string; milestones: string[]; timeline: Date; deliverables: string[] }>>} Execution roadmap
 *
 * @example
 * ```typescript
 * const roadmap = await generatePlanRoadmap('WFP-12345');
 * ```
 */
export declare const generatePlanRoadmap: (planId: string) => Promise<Array<{
    phase: string;
    milestones: string[];
    timeline: Date;
    deliverables: string[];
}>>;
/**
 * Generates headcount forecast using specified methodology.
 *
 * @param {string} department - Department identifier
 * @param {number} forecastPeriods - Number of periods to forecast
 * @param {'LINEAR_REGRESSION' | 'TIME_SERIES' | 'MACHINE_LEARNING' | 'JUDGMENTAL'} method - Forecasting method
 * @returns {Promise<HeadcountForecast[]>} Headcount forecasts
 *
 * @example
 * ```typescript
 * const forecasts = await generateHeadcountForecast('Engineering', 4, 'MACHINE_LEARNING');
 * ```
 */
export declare const generateHeadcountForecast: (department: string, forecastPeriods: number, method: "LINEAR_REGRESSION" | "TIME_SERIES" | "MACHINE_LEARNING" | "JUDGMENTAL") => Promise<HeadcountForecast[]>;
/**
 * Calculates confidence intervals for headcount forecasts.
 *
 * @param {HeadcountForecast} forecast - Headcount forecast
 * @param {number} [confidenceLevel=0.95] - Confidence level (0-1)
 * @returns {Promise<{ lower: number; upper: number; median: number }>} Confidence interval
 *
 * @example
 * ```typescript
 * const interval = await calculateForecastConfidenceInterval(forecast, 0.95);
 * console.log(`Forecast range: ${interval.lower} - ${interval.upper}`);
 * ```
 */
export declare const calculateForecastConfidenceInterval: (forecast: HeadcountForecast, confidenceLevel?: number) => Promise<{
    lower: number;
    upper: number;
    median: number;
}>;
/**
 * Compares actual vs. forecasted headcount and calculates accuracy.
 *
 * @param {string} department - Department identifier
 * @param {string} period - Reporting period
 * @returns {Promise<{ actual: number; forecasted: number; variance: number; accuracy: number }>} Forecast accuracy
 *
 * @example
 * ```typescript
 * const accuracy = await compareForecastAccuracy('Engineering', '2025-Q1');
 * ```
 */
export declare const compareForecastAccuracy: (department: string, period: string) => Promise<{
    actual: number;
    forecasted: number;
    variance: number;
    accuracy: number;
}>;
/**
 * Adjusts forecast based on business changes or new information.
 *
 * @param {string} forecastId - Forecast identifier
 * @param {Record<string, any>} adjustments - Forecast adjustments
 * @param {string} reason - Reason for adjustment
 * @returns {Promise<HeadcountForecast>} Adjusted forecast
 *
 * @example
 * ```typescript
 * const adjusted = await adjustForecast('HCF-12345', {
 *   projectedHeadcount: 450,
 *   assumptions: ['New product launch planned']
 * }, 'Product expansion');
 * ```
 */
export declare const adjustForecast: (forecastId: string, adjustments: Record<string, any>, reason: string) => Promise<HeadcountForecast>;
/**
 * Analyzes headcount trends across multiple dimensions.
 *
 * @param {string} department - Department identifier
 * @param {number} numberOfPeriods - Number of historical periods to analyze
 * @returns {Promise<{ trendDirection: string; growthRate: number; seasonality: boolean }>} Trend analysis
 *
 * @example
 * ```typescript
 * const trends = await analyzeHeadcountTrends('Engineering', 12);
 * ```
 */
export declare const analyzeHeadcountTrends: (department: string, numberOfPeriods: number) => Promise<{
    trendDirection: string;
    growthRate: number;
    seasonality: boolean;
}>;
/**
 * Generates multi-scenario headcount projections.
 *
 * @param {string} department - Department identifier
 * @param {number} forecastPeriods - Number of periods to project
 * @returns {Promise<Record<string, HeadcountForecast[]>>} Scenario projections
 *
 * @example
 * ```typescript
 * const scenarios = await generateMultiScenarioProjections('Engineering', 4);
 * console.log(scenarios.optimistic, scenarios.baseline, scenarios.pessimistic);
 * ```
 */
export declare const generateMultiScenarioProjections: (department: string, forecastPeriods: number) => Promise<Record<string, HeadcountForecast[]>>;
/**
 * Analyzes workforce supply and demand for specified period.
 *
 * @param {string} department - Department identifier
 * @param {string} period - Reporting period
 * @returns {Promise<SupplyDemandAnalysis>} Supply and demand analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeSupplyDemand('Engineering', '2025-Q3');
 * ```
 */
export declare const analyzeSupplyDemand: (department: string, period: string) => Promise<SupplyDemandAnalysis>;
/**
 * Projects future workforce demand based on business growth.
 *
 * @param {string} department - Department identifier
 * @param {number} projectedGrowth - Projected growth rate (percentage)
 * @param {number} forecastPeriods - Number of periods to forecast
 * @returns {Promise<Array<{ period: string; demand: number; drivers: string[] }>>} Demand projections
 *
 * @example
 * ```typescript
 * const demand = await projectWorkforceDemand('Sales', 15, 4);
 * ```
 */
export declare const projectWorkforceDemand: (department: string, projectedGrowth: number, forecastPeriods: number) => Promise<Array<{
    period: string;
    demand: number;
    drivers: string[];
}>>;
/**
 * Assesses internal workforce supply and readiness.
 *
 * @param {string} department - Department identifier
 * @param {string[]} requiredSkills - Required skills
 * @returns {Promise<{ available: number; readyNow: number; readySoon: number; developmentNeeded: number }>} Supply assessment
 *
 * @example
 * ```typescript
 * const supply = await assessInternalSupply('Engineering', ['Java', 'AWS', 'Microservices']);
 * ```
 */
export declare const assessInternalSupply: (department: string, requiredSkills: string[]) => Promise<{
    available: number;
    readyNow: number;
    readySoon: number;
    developmentNeeded: number;
}>;
/**
 * Evaluates external labor market supply.
 *
 * @param {string} jobFamily - Job family
 * @param {string} location - Geographic location
 * @returns {Promise<{ marketSize: number; availability: string; competitionLevel: string; timeToFill: number }>} Market analysis
 *
 * @example
 * ```typescript
 * const market = await evaluateExternalMarketSupply('Software Engineering', 'San Francisco');
 * ```
 */
export declare const evaluateExternalMarketSupply: (jobFamily: string, location: string) => Promise<{
    marketSize: number;
    availability: string;
    competitionLevel: string;
    timeToFill: number;
}>;
/**
 * Identifies workforce supply-demand gaps and risks.
 *
 * @param {SupplyDemandAnalysis} analysis - Supply-demand analysis
 * @returns {Promise<Array<{ gap: string; severity: string; impact: string; mitigation: string[] }>>} Gap analysis
 *
 * @example
 * ```typescript
 * const gaps = await identifySupplyDemandGaps(analysis);
 * ```
 */
export declare const identifySupplyDemandGaps: (analysis: SupplyDemandAnalysis) => Promise<Array<{
    gap: string;
    severity: string;
    impact: string;
    mitigation: string[];
}>>;
/**
 * Optimizes workforce mix between internal and external sources.
 *
 * @param {SupplyDemandAnalysis} analysis - Supply-demand analysis
 * @param {Record<string, any>} constraints - Optimization constraints
 * @returns {Promise<{ internalHires: number; externalHires: number; contractors: number; cost: number }>} Optimized mix
 *
 * @example
 * ```typescript
 * const optimized = await optimizeWorkforceMix(analysis, { budget: 5000000, timeframe: 6 });
 * ```
 */
export declare const optimizeWorkforceMix: (analysis: SupplyDemandAnalysis, constraints: Record<string, any>) => Promise<{
    internalHires: number;
    externalHires: number;
    contractors: number;
    cost: number;
}>;
/**
 * Conducts comprehensive skills gap analysis.
 *
 * @param {string} department - Department identifier
 * @param {string[]} requiredSkills - Required skills
 * @returns {Promise<SkillsGapAnalysis[]>} Skills gap analysis
 *
 * @example
 * ```typescript
 * const gaps = await conductSkillsGapAnalysis('Engineering', ['Python', 'Kubernetes', 'Machine Learning']);
 * ```
 */
export declare const conductSkillsGapAnalysis: (department: string, requiredSkills: string[]) => Promise<SkillsGapAnalysis[]>;
/**
 * Forecasts future skills requirements based on business strategy.
 *
 * @param {string} department - Department identifier
 * @param {number} forecastPeriods - Number of periods to forecast
 * @param {string[]} strategicInitiatives - Strategic initiatives
 * @returns {Promise<Array<{ period: string; skills: string[]; demand: number }>>} Skills forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastSkillsRequirements('Engineering', 4, ['Cloud migration', 'AI adoption']);
 * ```
 */
export declare const forecastSkillsRequirements: (department: string, forecastPeriods: number, strategicInitiatives: string[]) => Promise<Array<{
    period: string;
    skills: string[];
    demand: number;
}>>;
/**
 * Prioritizes skills gaps by business impact and urgency.
 *
 * @param {SkillsGapAnalysis[]} gaps - Skills gaps
 * @returns {Promise<SkillsGapAnalysis[]>} Prioritized skills gaps
 *
 * @example
 * ```typescript
 * const prioritized = await prioritizeSkillsGaps(gaps);
 * ```
 */
export declare const prioritizeSkillsGaps: (gaps: SkillsGapAnalysis[]) => Promise<SkillsGapAnalysis[]>;
/**
 * Develops skills closure strategies and action plans.
 *
 * @param {SkillsGapAnalysis} gap - Skills gap
 * @returns {Promise<{ strategies: string[]; timeline: number; cost: number; riskLevel: string }>} Closure plan
 *
 * @example
 * ```typescript
 * const plan = await developSkillsClosurePlan(gap);
 * ```
 */
export declare const developSkillsClosurePlan: (gap: SkillsGapAnalysis) => Promise<{
    strategies: string[];
    timeline: number;
    cost: number;
    riskLevel: string;
}>;
/**
 * Tracks skills gap closure progress and effectiveness.
 *
 * @param {string} gapId - Gap identifier
 * @returns {Promise<{ progress: number; closedGaps: number; remainingGaps: number; onTrack: boolean }>} Progress tracking
 *
 * @example
 * ```typescript
 * const progress = await trackSkillsGapClosure('GAP-12345');
 * ```
 */
export declare const trackSkillsGapClosure: (gapId: string) => Promise<{
    progress: number;
    closedGaps: number;
    remainingGaps: number;
    onTrack: boolean;
}>;
/**
 * Benchmarks skills against industry standards.
 *
 * @param {string} department - Department identifier
 * @param {string} industryCode - Industry classification
 * @returns {Promise<Array<{ skill: string; organizationLevel: number; industryLevel: number; gap: number }>>} Skills benchmark
 *
 * @example
 * ```typescript
 * const benchmark = await benchmarkSkillsAgainstIndustry('Engineering', 'NAICS-541512');
 * ```
 */
export declare const benchmarkSkillsAgainstIndustry: (department: string, industryCode: string) => Promise<Array<{
    skill: string;
    organizationLevel: number;
    industryLevel: number;
    gap: number;
}>>;
/**
 * Creates workforce planning scenario with assumptions.
 *
 * @param {Partial<ScenarioAnalysis>} scenarioData - Scenario data
 * @returns {Promise<ScenarioAnalysis>} Created scenario
 *
 * @example
 * ```typescript
 * const scenario = await createPlanningScenario({
 *   scenarioName: 'Rapid Growth',
 *   scenarioType: 'OPTIMISTIC',
 *   assumptions: { growthRate: 25, attritionRate: 10 }
 * });
 * ```
 */
export declare const createPlanningScenario: (scenarioData: Partial<ScenarioAnalysis>) => Promise<ScenarioAnalysis>;
/**
 * Runs what-if analysis on workforce variables.
 *
 * @param {string} department - Department identifier
 * @param {Record<string, any>} variables - Variables to analyze
 * @returns {Promise<{ baseCase: any; scenarios: Array<{ name: string; outcome: any }> }>} What-if analysis
 *
 * @example
 * ```typescript
 * const analysis = await runWhatIfAnalysis('Engineering', {
 *   attritionRate: [10, 15, 20],
 *   growthRate: [5, 10, 15]
 * });
 * ```
 */
export declare const runWhatIfAnalysis: (department: string, variables: Record<string, any>) => Promise<{
    baseCase: any;
    scenarios: Array<{
        name: string;
        outcome: any;
    }>;
}>;
/**
 * Compares multiple workforce planning scenarios.
 *
 * @param {string[]} scenarioIds - Scenario identifiers
 * @returns {Promise<Array<{ scenarioId: string; metrics: Record<string, any>; ranking: number }>>} Scenario comparison
 *
 * @example
 * ```typescript
 * const comparison = await comparePlanningScenarios(['SCN-001', 'SCN-002', 'SCN-003']);
 * ```
 */
export declare const comparePlanningScenarios: (scenarioIds: string[]) => Promise<Array<{
    scenarioId: string;
    metrics: Record<string, any>;
    ranking: number;
}>>;
/**
 * Assesses risks associated with workforce scenarios.
 *
 * @param {ScenarioAnalysis} scenario - Scenario to assess
 * @returns {Promise<{ riskScore: number; risks: Array<{ risk: string; probability: number; impact: string }> }>} Risk assessment
 *
 * @example
 * ```typescript
 * const risks = await assessScenarioRisks(scenario);
 * ```
 */
export declare const assessScenarioRisks: (scenario: ScenarioAnalysis) => Promise<{
    riskScore: number;
    risks: Array<{
        risk: string;
        probability: number;
        impact: string;
    }>;
}>;
/**
 * Recommends optimal scenario based on organizational constraints.
 *
 * @param {ScenarioAnalysis[]} scenarios - Scenarios to evaluate
 * @param {Record<string, any>} constraints - Organizational constraints
 * @returns {Promise<{ recommendedScenario: string; score: number; rationale: string[] }>} Recommendation
 *
 * @example
 * ```typescript
 * const recommendation = await recommendOptimalScenario(scenarios, {
 *   maxBudget: 50000000,
 *   maxRisk: 'MEDIUM'
 * });
 * ```
 */
export declare const recommendOptimalScenario: (scenarios: ScenarioAnalysis[], constraints: Record<string, any>) => Promise<{
    recommendedScenario: string;
    score: number;
    rationale: string[];
}>;
/**
 * Segments workforce by specified criteria.
 *
 * @param {'DEMOGRAPHIC' | 'SKILLS' | 'PERFORMANCE' | 'TENURE' | 'COST' | 'STRATEGIC'} segmentationType - Segmentation type
 * @param {Record<string, any>} criteria - Segmentation criteria
 * @returns {Promise<WorkforceSegment[]>} Workforce segments
 *
 * @example
 * ```typescript
 * const segments = await segmentWorkforce('SKILLS', {
 *   skillCategories: ['Technical', 'Leadership', 'Business']
 * });
 * ```
 */
export declare const segmentWorkforce: (segmentationType: "DEMOGRAPHIC" | "SKILLS" | "PERFORMANCE" | "TENURE" | "COST" | "STRATEGIC", criteria: Record<string, any>) => Promise<WorkforceSegment[]>;
/**
 * Analyzes segment characteristics and trends.
 *
 * @param {string} segmentId - Segment identifier
 * @returns {Promise<{ demographics: any; performance: any; engagement: any; retention: any }>} Segment analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeSegmentCharacteristics('SEG-12345');
 * ```
 */
export declare const analyzeSegmentCharacteristics: (segmentId: string) => Promise<{
    demographics: any;
    performance: any;
    engagement: any;
    retention: any;
}>;
/**
 * Develops targeted strategies for workforce segments.
 *
 * @param {WorkforceSegment} segment - Workforce segment
 * @returns {Promise<{ strategies: string[]; investments: number; expectedOutcomes: string[] }>} Segment strategies
 *
 * @example
 * ```typescript
 * const strategies = await developSegmentStrategies(segment);
 * ```
 */
export declare const developSegmentStrategies: (segment: WorkforceSegment) => Promise<{
    strategies: string[];
    investments: number;
    expectedOutcomes: string[];
}>;
/**
 * Tracks segment performance metrics over time.
 *
 * @param {string} segmentId - Segment identifier
 * @param {number} numberOfPeriods - Number of periods to track
 * @returns {Promise<Array<{ period: string; metrics: Record<string, any> }>>} Segment performance history
 *
 * @example
 * ```typescript
 * const history = await trackSegmentPerformance('SEG-12345', 6);
 * ```
 */
export declare const trackSegmentPerformance: (segmentId: string, numberOfPeriods: number) => Promise<Array<{
    period: string;
    metrics: Record<string, any>;
}>>;
/**
 * Identifies critical roles based on business impact.
 *
 * @param {string} department - Department identifier
 * @param {Record<string, any>} criteria - Criticality criteria
 * @returns {Promise<CriticalRole[]>} Critical roles
 *
 * @example
 * ```typescript
 * const criticalRoles = await identifyCriticalRoles('Engineering', {
 *   revenueImpact: 'HIGH',
 *   scarcity: 'HIGH'
 * });
 * ```
 */
export declare const identifyCriticalRoles: (department: string, criteria: Record<string, any>) => Promise<CriticalRole[]>;
/**
 * Assesses succession readiness for critical roles.
 *
 * @param {string} roleId - Role identifier
 * @returns {Promise<{ successors: number; readiness: Record<string, number>; gaps: string[] }>} Succession readiness
 *
 * @example
 * ```typescript
 * const readiness = await assessSuccessionReadiness('ROLE-12345');
 * ```
 */
export declare const assessSuccessionReadiness: (roleId: string) => Promise<{
    successors: number;
    readiness: Record<string, number>;
    gaps: string[];
}>;
/**
 * Develops succession plans for critical roles.
 *
 * @param {CriticalRole} role - Critical role
 * @returns {Promise<{ plan: string[]; timeline: number; developmentActivities: string[] }>} Succession plan
 *
 * @example
 * ```typescript
 * const plan = await developSuccessionPlan(role);
 * ```
 */
export declare const developSuccessionPlan: (role: CriticalRole) => Promise<{
    plan: string[];
    timeline: number;
    developmentActivities: string[];
}>;
/**
 * Monitors critical role vacancies and risks.
 *
 * @param {string} department - Department identifier
 * @returns {Promise<{ vacancies: number; atRisk: number; avgTimeToFill: number; businessImpact: string }>} Vacancy monitoring
 *
 * @example
 * ```typescript
 * const monitoring = await monitorCriticalRoleVacancies('Engineering');
 * ```
 */
export declare const monitorCriticalRoleVacancies: (department: string) => Promise<{
    vacancies: number;
    atRisk: number;
    avgTimeToFill: number;
    businessImpact: string;
}>;
/**
 * Creates comprehensive workforce cost model.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} department - Department identifier
 * @returns {Promise<WorkforceCostModel>} Workforce cost model
 *
 * @example
 * ```typescript
 * const costModel = await createWorkforceCostModel(2025, 'Engineering');
 * ```
 */
export declare const createWorkforceCostModel: (fiscalYear: number, department: string) => Promise<WorkforceCostModel>;
/**
 * Projects workforce costs for future periods.
 *
 * @param {WorkforceCostModel} model - Cost model
 * @param {number} forecastPeriods - Number of periods to forecast
 * @param {Record<string, any>} assumptions - Cost assumptions
 * @returns {Promise<Array<{ period: string; projectedCost: number; breakdown: Record<string, number> }>>} Cost projections
 *
 * @example
 * ```typescript
 * const projections = await projectWorkforceCosts(model, 4, { salaryIncrease: 3 });
 * ```
 */
export declare const projectWorkforceCosts: (model: WorkforceCostModel, forecastPeriods: number, assumptions: Record<string, any>) => Promise<Array<{
    period: string;
    projectedCost: number;
    breakdown: Record<string, number>;
}>>;
/**
 * Analyzes cost per hire and cost to fill metrics.
 *
 * @param {string} department - Department identifier
 * @param {string} period - Reporting period
 * @returns {Promise<{ costPerHire: number; costToFill: number; timeToFill: number; efficiency: number }>} Cost analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeCostPerHire('Engineering', '2025-Q1');
 * ```
 */
export declare const analyzeCostPerHire: (department: string, period: string) => Promise<{
    costPerHire: number;
    costToFill: number;
    timeToFill: number;
    efficiency: number;
}>;
/**
 * Optimizes workforce costs while maintaining quality.
 *
 * @param {WorkforceCostModel} model - Cost model
 * @param {Record<string, any>} constraints - Optimization constraints
 * @returns {Promise<{ optimizedCost: number; savings: number; recommendations: string[] }>} Cost optimization
 *
 * @example
 * ```typescript
 * const optimization = await optimizeWorkforceCosts(model, { targetSavings: 2000000 });
 * ```
 */
export declare const optimizeWorkforceCosts: (model: WorkforceCostModel, constraints: Record<string, any>) => Promise<{
    optimizedCost: number;
    savings: number;
    recommendations: string[];
}>;
/**
 * Projects retirement eligibility and timing.
 *
 * @param {string} department - Department identifier
 * @param {'1_YEAR' | '3_YEAR' | '5_YEAR' | '10_YEAR'} timeHorizon - Projection horizon
 * @returns {Promise<RetirementProjection>} Retirement projection
 *
 * @example
 * ```typescript
 * const projection = await projectRetirementEligibility('Engineering', '5_YEAR');
 * ```
 */
export declare const projectRetirementEligibility: (department: string, timeHorizon: "1_YEAR" | "3_YEAR" | "5_YEAR" | "10_YEAR") => Promise<RetirementProjection>;
/**
 * Forecasts attrition rates by segment and reason.
 *
 * @param {string} department - Department identifier
 * @param {number} forecastPeriods - Number of periods to forecast
 * @returns {Promise<AttritionProjection[]>} Attrition forecasts
 *
 * @example
 * ```typescript
 * const forecasts = await forecastAttritionRates('Sales', 4);
 * ```
 */
export declare const forecastAttritionRates: (department: string, forecastPeriods: number) => Promise<AttritionProjection[]>;
/**
 * Identifies high-risk attrition candidates.
 *
 * @param {string} department - Department identifier
 * @param {Record<string, any>} riskFactors - Risk factors to consider
 * @returns {Promise<Array<{ employeeId: string; riskScore: number; reasons: string[]; interventions: string[] }>>} At-risk employees
 *
 * @example
 * ```typescript
 * const atRisk = await identifyAttritionRisks('Engineering', {
 *   tenure: '<2 years',
 *   performance: '>4.0'
 * });
 * ```
 */
export declare const identifyAttritionRisks: (department: string, riskFactors: Record<string, any>) => Promise<Array<{
    employeeId: string;
    riskScore: number;
    reasons: string[];
    interventions: string[];
}>>;
/**
 * Develops retention strategies for critical talent.
 *
 * @param {string} segmentId - Workforce segment
 * @returns {Promise<{ strategies: string[]; investments: number; expectedRetention: number }>} Retention strategies
 *
 * @example
 * ```typescript
 * const strategies = await developRetentionStrategies('SEG-HIGH-PERFORMERS');
 * ```
 */
export declare const developRetentionStrategies: (segmentId: string) => Promise<{
    strategies: string[];
    investments: number;
    expectedRetention: number;
}>;
/**
 * Creates detailed hiring plan with timeline and budget.
 *
 * @param {Partial<HiringPlan>} planData - Hiring plan data
 * @returns {Promise<HiringPlan>} Created hiring plan
 *
 * @example
 * ```typescript
 * const plan = await createHiringPlan({
 *   fiscalYear: 2025,
 *   department: 'Engineering',
 *   newPositions: 30,
 *   replacementPositions: 15
 * });
 * ```
 */
export declare const createHiringPlan: (planData: Partial<HiringPlan>) => Promise<HiringPlan>;
/**
 * Optimizes hiring timeline based on constraints.
 *
 * @param {HiringPlan} plan - Hiring plan
 * @param {Record<string, any>} constraints - Optimization constraints
 * @returns {Promise<Array<{ period: string; plannedHires: number; recruiters: number; budget: number }>>} Optimized timeline
 *
 * @example
 * ```typescript
 * const timeline = await optimizeHiringTimeline(plan, {
 *   maxHiresPerMonth: 10,
 *   budgetLimit: 2000000
 * });
 * ```
 */
export declare const optimizeHiringTimeline: (plan: HiringPlan, constraints: Record<string, any>) => Promise<Array<{
    period: string;
    plannedHires: number;
    recruiters: number;
    budget: number;
}>>;
/**
 * Tracks hiring plan execution and progress.
 *
 * @param {string} planId - Plan identifier
 * @returns {Promise<{ planned: number; hired: number; inProgress: number; completion: number }>} Plan progress
 *
 * @example
 * ```typescript
 * const progress = await trackHiringPlanProgress('HP-12345');
 * ```
 */
export declare const trackHiringPlanProgress: (planId: string) => Promise<{
    planned: number;
    hired: number;
    inProgress: number;
    completion: number;
}>;
/**
 * Analyzes contingent workforce utilization and strategy.
 *
 * @param {string} department - Department identifier
 * @returns {Promise<ContingentWorkforce>} Contingent workforce analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeContingentWorkforce('Engineering');
 * ```
 */
export declare const analyzeContingentWorkforce: (department: string) => Promise<ContingentWorkforce>;
/**
 * Generates comprehensive workforce planning dashboard.
 *
 * @param {string} organizationUnit - Organization unit
 * @param {Date} asOfDate - As-of date
 * @returns {Promise<WorkforcePlanningDashboard>} Workforce planning dashboard
 *
 * @example
 * ```typescript
 * const dashboard = await generateWorkforcePlanningDashboard('Engineering', new Date());
 * ```
 */
export declare const generateWorkforcePlanningDashboard: (organizationUnit: string, asOfDate: Date) => Promise<WorkforcePlanningDashboard>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createWorkforcePlanModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            planId: string;
            planName: string;
            fiscalYear: number;
            planningHorizon: string;
            organizationUnit: string;
            status: string;
            startDate: Date;
            endDate: Date;
            targetHeadcount: number;
            currentHeadcount: number;
            budgetedPositions: number;
            objectives: string[];
            strategies: Record<string, any>;
            version: number;
            createdBy: string;
            approvedBy: string | null;
            approvedAt: Date | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createHeadcountForecastModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            forecastId: string;
            forecastPeriod: string;
            department: string;
            jobFamily: string;
            currentHeadcount: number;
            projectedHeadcount: number;
            variance: number;
            variancePercent: number;
            confidenceLevel: number;
            confidenceInterval: Record<string, any>;
            forecastMethod: string;
            assumptions: string[];
            scenarioType: string;
            createdBy: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createSkillsGapModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            gapId: string;
            skillCategory: string;
            skillName: string;
            requiredProficiency: string;
            currentProficiency: string;
            employeesRequired: number;
            employeesAvailable: number;
            gap: number;
            gapPercent: number;
            gapSeverity: string;
            closureStrategy: string[];
            estimatedClosureTime: number;
            closureProgress: number;
            businessImpact: string;
            priority: number;
            assignedTo: string | null;
            targetClosureDate: Date | null;
            status: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createWorkforcePlan: (planData: Partial<WorkforcePlan>, userId: string) => Promise<WorkforcePlan>;
    updateWorkforcePlan: (planId: string, updates: Partial<WorkforcePlan>, userId: string) => Promise<WorkforcePlan>;
    approveWorkforcePlan: (planId: string, approverId: string, comments?: string) => Promise<{
        approved: boolean;
        approvedAt: Date;
        approvedBy: string;
    }>;
    alignPlanWithStrategy: (planId: string, strategicObjectives: string[]) => Promise<{
        aligned: boolean;
        alignmentScore: number;
        gaps: string[];
    }>;
    generatePlanRoadmap: (planId: string) => Promise<Array<{
        phase: string;
        milestones: string[];
        timeline: Date;
        deliverables: string[];
    }>>;
    generateHeadcountForecast: (department: string, forecastPeriods: number, method: "LINEAR_REGRESSION" | "TIME_SERIES" | "MACHINE_LEARNING" | "JUDGMENTAL") => Promise<HeadcountForecast[]>;
    calculateForecastConfidenceInterval: (forecast: HeadcountForecast, confidenceLevel?: number) => Promise<{
        lower: number;
        upper: number;
        median: number;
    }>;
    compareForecastAccuracy: (department: string, period: string) => Promise<{
        actual: number;
        forecasted: number;
        variance: number;
        accuracy: number;
    }>;
    adjustForecast: (forecastId: string, adjustments: Record<string, any>, reason: string) => Promise<HeadcountForecast>;
    analyzeHeadcountTrends: (department: string, numberOfPeriods: number) => Promise<{
        trendDirection: string;
        growthRate: number;
        seasonality: boolean;
    }>;
    generateMultiScenarioProjections: (department: string, forecastPeriods: number) => Promise<Record<string, HeadcountForecast[]>>;
    analyzeSupplyDemand: (department: string, period: string) => Promise<SupplyDemandAnalysis>;
    projectWorkforceDemand: (department: string, projectedGrowth: number, forecastPeriods: number) => Promise<Array<{
        period: string;
        demand: number;
        drivers: string[];
    }>>;
    assessInternalSupply: (department: string, requiredSkills: string[]) => Promise<{
        available: number;
        readyNow: number;
        readySoon: number;
        developmentNeeded: number;
    }>;
    evaluateExternalMarketSupply: (jobFamily: string, location: string) => Promise<{
        marketSize: number;
        availability: string;
        competitionLevel: string;
        timeToFill: number;
    }>;
    identifySupplyDemandGaps: (analysis: SupplyDemandAnalysis) => Promise<Array<{
        gap: string;
        severity: string;
        impact: string;
        mitigation: string[];
    }>>;
    optimizeWorkforceMix: (analysis: SupplyDemandAnalysis, constraints: Record<string, any>) => Promise<{
        internalHires: number;
        externalHires: number;
        contractors: number;
        cost: number;
    }>;
    conductSkillsGapAnalysis: (department: string, requiredSkills: string[]) => Promise<SkillsGapAnalysis[]>;
    forecastSkillsRequirements: (department: string, forecastPeriods: number, strategicInitiatives: string[]) => Promise<Array<{
        period: string;
        skills: string[];
        demand: number;
    }>>;
    prioritizeSkillsGaps: (gaps: SkillsGapAnalysis[]) => Promise<SkillsGapAnalysis[]>;
    developSkillsClosurePlan: (gap: SkillsGapAnalysis) => Promise<{
        strategies: string[];
        timeline: number;
        cost: number;
        riskLevel: string;
    }>;
    trackSkillsGapClosure: (gapId: string) => Promise<{
        progress: number;
        closedGaps: number;
        remainingGaps: number;
        onTrack: boolean;
    }>;
    benchmarkSkillsAgainstIndustry: (department: string, industryCode: string) => Promise<Array<{
        skill: string;
        organizationLevel: number;
        industryLevel: number;
        gap: number;
    }>>;
    createPlanningScenario: (scenarioData: Partial<ScenarioAnalysis>) => Promise<ScenarioAnalysis>;
    runWhatIfAnalysis: (department: string, variables: Record<string, any>) => Promise<{
        baseCase: any;
        scenarios: Array<{
            name: string;
            outcome: any;
        }>;
    }>;
    comparePlanningScenarios: (scenarioIds: string[]) => Promise<Array<{
        scenarioId: string;
        metrics: Record<string, any>;
        ranking: number;
    }>>;
    assessScenarioRisks: (scenario: ScenarioAnalysis) => Promise<{
        riskScore: number;
        risks: Array<{
            risk: string;
            probability: number;
            impact: string;
        }>;
    }>;
    recommendOptimalScenario: (scenarios: ScenarioAnalysis[], constraints: Record<string, any>) => Promise<{
        recommendedScenario: string;
        score: number;
        rationale: string[];
    }>;
    segmentWorkforce: (segmentationType: "DEMOGRAPHIC" | "SKILLS" | "PERFORMANCE" | "TENURE" | "COST" | "STRATEGIC", criteria: Record<string, any>) => Promise<WorkforceSegment[]>;
    analyzeSegmentCharacteristics: (segmentId: string) => Promise<{
        demographics: any;
        performance: any;
        engagement: any;
        retention: any;
    }>;
    developSegmentStrategies: (segment: WorkforceSegment) => Promise<{
        strategies: string[];
        investments: number;
        expectedOutcomes: string[];
    }>;
    trackSegmentPerformance: (segmentId: string, numberOfPeriods: number) => Promise<Array<{
        period: string;
        metrics: Record<string, any>;
    }>>;
    identifyCriticalRoles: (department: string, criteria: Record<string, any>) => Promise<CriticalRole[]>;
    assessSuccessionReadiness: (roleId: string) => Promise<{
        successors: number;
        readiness: Record<string, number>;
        gaps: string[];
    }>;
    developSuccessionPlan: (role: CriticalRole) => Promise<{
        plan: string[];
        timeline: number;
        developmentActivities: string[];
    }>;
    monitorCriticalRoleVacancies: (department: string) => Promise<{
        vacancies: number;
        atRisk: number;
        avgTimeToFill: number;
        businessImpact: string;
    }>;
    createWorkforceCostModel: (fiscalYear: number, department: string) => Promise<WorkforceCostModel>;
    projectWorkforceCosts: (model: WorkforceCostModel, forecastPeriods: number, assumptions: Record<string, any>) => Promise<Array<{
        period: string;
        projectedCost: number;
        breakdown: Record<string, number>;
    }>>;
    analyzeCostPerHire: (department: string, period: string) => Promise<{
        costPerHire: number;
        costToFill: number;
        timeToFill: number;
        efficiency: number;
    }>;
    optimizeWorkforceCosts: (model: WorkforceCostModel, constraints: Record<string, any>) => Promise<{
        optimizedCost: number;
        savings: number;
        recommendations: string[];
    }>;
    projectRetirementEligibility: (department: string, timeHorizon: "1_YEAR" | "3_YEAR" | "5_YEAR" | "10_YEAR") => Promise<RetirementProjection>;
    forecastAttritionRates: (department: string, forecastPeriods: number) => Promise<AttritionProjection[]>;
    identifyAttritionRisks: (department: string, riskFactors: Record<string, any>) => Promise<Array<{
        employeeId: string;
        riskScore: number;
        reasons: string[];
        interventions: string[];
    }>>;
    developRetentionStrategies: (segmentId: string) => Promise<{
        strategies: string[];
        investments: number;
        expectedRetention: number;
    }>;
    createHiringPlan: (planData: Partial<HiringPlan>) => Promise<HiringPlan>;
    optimizeHiringTimeline: (plan: HiringPlan, constraints: Record<string, any>) => Promise<Array<{
        period: string;
        plannedHires: number;
        recruiters: number;
        budget: number;
    }>>;
    trackHiringPlanProgress: (planId: string) => Promise<{
        planned: number;
        hired: number;
        inProgress: number;
        completion: number;
    }>;
    analyzeContingentWorkforce: (department: string) => Promise<ContingentWorkforce>;
    generateWorkforcePlanningDashboard: (organizationUnit: string, asOfDate: Date) => Promise<WorkforcePlanningDashboard>;
};
export default _default;
//# sourceMappingURL=workforce-planning-kit.d.ts.map