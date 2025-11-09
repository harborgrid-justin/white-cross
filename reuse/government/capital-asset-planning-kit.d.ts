/**
 * LOC: CAPASSET1234567
 * File: /reuse/government/capital-asset-planning-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend government services
 *   - Asset management controllers
 *   - Capital planning engines
 */
/**
 * File: /reuse/government/capital-asset-planning-kit.ts
 * Locator: WC-GOV-CAP-001
 * Purpose: Comprehensive Capital Asset Planning & Management Utilities - Enterprise-grade infrastructure asset lifecycle
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Asset controllers, capital planning services, infrastructure management, replacement scheduling
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 50+ utility functions for capital improvement planning, asset lifecycle, replacement scheduling, infrastructure assessment
 *
 * LLM Context: Enterprise-grade capital asset planning and management system for government infrastructure.
 * Provides capital improvement planning, asset lifecycle management, capital budget forecasting, asset replacement
 * scheduling, infrastructure condition assessment, project prioritization, long-term capital planning, multi-year
 * capital plans, debt financing analysis, asset condition rating, funding source planning, capital needs assessment,
 * infrastructure investment optimization, deferred maintenance tracking, service life analysis.
 */
import { Sequelize } from 'sequelize';
interface CapitalAsset {
    assetId: number;
    assetNumber: string;
    assetName: string;
    assetType: string;
    assetClass: 'BUILDING' | 'INFRASTRUCTURE' | 'EQUIPMENT' | 'LAND' | 'VEHICLE' | 'TECHNOLOGY';
    description: string;
    location: string;
    department: string;
    acquisitionDate: Date;
    acquisitionCost: number;
    currentValue: number;
    accumulatedDepreciation: number;
    usefulLifeYears: number;
    remainingLifeYears: number;
    conditionRating: number;
    status: 'ACTIVE' | 'PLANNED' | 'IN_CONSTRUCTION' | 'DISPOSED' | 'RETIRED';
}
interface AssetConditionAssessment {
    assetId: number;
    assessmentDate: Date;
    assessmentType: 'ROUTINE' | 'DETAILED' | 'EMERGENCY' | 'ANNUAL';
    overallCondition: number;
    structuralCondition: number;
    functionalCondition: number;
    safetyCondition: number;
    assessor: string;
    findings: string[];
    recommendations: string[];
    estimatedRepairCost: number;
    urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    nextAssessmentDate: Date;
}
interface CapitalProject {
    projectId: number;
    projectNumber: string;
    projectName: string;
    projectType: 'NEW_CONSTRUCTION' | 'MAJOR_RENOVATION' | 'REPLACEMENT' | 'EXPANSION' | 'IMPROVEMENT';
    description: string;
    justification: string;
    assetIds: number[];
    estimatedCost: number;
    fundingSources: FundingSource[];
    priorityScore: number;
    requestedFiscalYear: number;
    plannedStartDate?: Date;
    plannedCompletionDate?: Date;
    status: 'PROPOSED' | 'APPROVED' | 'FUNDED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}
interface FundingSource {
    sourceType: 'GENERAL_FUND' | 'BONDS' | 'GRANTS' | 'FEES' | 'RESERVES' | 'OTHER';
    sourceName: string;
    amount: number;
    fiscalYear: number;
    restrictions?: string;
    secured: boolean;
}
interface ReplacementSchedule {
    assetId: number;
    assetName: string;
    currentAge: number;
    usefulLife: number;
    recommendedReplacementYear: number;
    estimatedReplacementCost: number;
    conditionScore: number;
    criticalityScore: number;
    replacementPriority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    deferralRisk: string;
}
interface CapitalBudgetForecast {
    fiscalYear: number;
    totalCapitalNeeds: number;
    totalPlannedSpending: number;
    totalAvailableFunding: number;
    fundingGap: number;
    newConstructionCost: number;
    replacementCost: number;
    renovationCost: number;
    maintenanceCost: number;
    projects: CapitalProject[];
}
interface InfrastructureInventory {
    assetCategory: string;
    totalAssets: number;
    totalReplacementValue: number;
    averageAge: number;
    averageCondition: number;
    assetsInPoorCondition: number;
    deferredMaintenanceBacklog: number;
}
interface PrioritizationCriteria {
    criteriaId: string;
    criteriaName: string;
    weight: number;
    scoringMethod: 'NUMERIC' | 'BOOLEAN' | 'CATEGORICAL';
    possibleScores: number[];
    description: string;
}
interface ProjectPrioritization {
    projectId: number;
    criteriaScores: Record<string, number>;
    weightedScore: number;
    rank: number;
    fundingRecommendation: 'APPROVE' | 'DEFER' | 'REJECT';
    justification: string;
}
interface DebtFinancingAnalysis {
    bondIssueAmount: number;
    interestRate: number;
    termYears: number;
    annualDebtService: number;
    totalInterestCost: number;
    totalRepayment: number;
    debtServiceRatio: number;
    affordabilityAnalysis: string;
    fundedProjects: number[];
}
interface MultiYearCapitalPlan {
    planId: string;
    planName: string;
    startFiscalYear: number;
    endFiscalYear: number;
    totalPlannedInvestment: number;
    yearlyBreakdown: CapitalBudgetForecast[];
    fundingStrategy: string;
    assumptions: string[];
    risks: string[];
    approvalStatus: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'ACTIVE';
}
interface AssetLifecyclePhase {
    phase: 'PLANNING' | 'ACQUISITION' | 'OPERATION' | 'MAINTENANCE' | 'REPLACEMENT' | 'DISPOSAL';
    startDate: Date;
    endDate?: Date;
    costs: number;
    activities: string[];
    responsible: string;
}
interface DeferredMaintenance {
    assetId: number;
    maintenanceType: string;
    description: string;
    estimatedCost: number;
    deferredSince: Date;
    consequenceOfDeferral: string;
    impactOnServiceLife: number;
    recommendedCompletionYear: number;
}
/**
 * Sequelize model for Capital Assets with lifecycle tracking and valuation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CapitalAsset model
 *
 * @example
 * ```typescript
 * const CapitalAsset = createCapitalAssetModel(sequelize);
 * const asset = await CapitalAsset.create({
 *   assetNumber: 'BLDG-001',
 *   assetName: 'Main Administration Building',
 *   assetClass: 'BUILDING',
 *   acquisitionCost: 5000000,
 *   usefulLifeYears: 50
 * });
 * ```
 */
export declare const createCapitalAssetModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        assetNumber: string;
        assetName: string;
        assetType: string;
        assetClass: string;
        description: string;
        location: string;
        department: string;
        gpsCoordinates: string | null;
        acquisitionDate: Date;
        acquisitionCost: number;
        currentValue: number;
        accumulatedDepreciation: number;
        usefulLifeYears: number;
        remainingLifeYears: number;
        depreciationMethod: string;
        salvageValue: number;
        conditionRating: number;
        lastAssessmentDate: Date | null;
        nextAssessmentDate: Date | null;
        status: string;
        disposalDate: Date | null;
        disposalValue: number | null;
        replacementCost: number;
        maintenanceSchedule: string | null;
        criticalityRating: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Capital Projects with prioritization and funding tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CapitalProject model
 *
 * @example
 * ```typescript
 * const CapitalProject = createCapitalProjectModel(sequelize);
 * const project = await CapitalProject.create({
 *   projectNumber: 'CAP-2025-001',
 *   projectName: 'Bridge Replacement',
 *   projectType: 'REPLACEMENT',
 *   estimatedCost: 2500000,
 *   requestedFiscalYear: 2025
 * });
 * ```
 */
export declare const createCapitalProjectModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        projectNumber: string;
        projectName: string;
        projectType: string;
        description: string;
        justification: string;
        relatedAssetIds: number[];
        estimatedCost: number;
        actualCost: number | null;
        fundingSources: Record<string, any>[];
        totalFundingSecured: number;
        priorityScore: number;
        priorityRank: number | null;
        requestedFiscalYear: number;
        approvedFiscalYear: number | null;
        plannedStartDate: Date | null;
        actualStartDate: Date | null;
        plannedCompletionDate: Date | null;
        actualCompletionDate: Date | null;
        status: string;
        statusReason: string | null;
        projectManager: string | null;
        department: string;
        approvals: Record<string, any>[];
        riskAssessment: Record<string, any>;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Asset Condition Assessments with findings and recommendations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AssetConditionAssessment model
 *
 * @example
 * ```typescript
 * const Assessment = createAssetConditionAssessmentModel(sequelize);
 * const assessment = await Assessment.create({
 *   assetId: 1,
 *   assessmentType: 'ANNUAL',
 *   overallCondition: 3.5,
 *   assessor: 'John Engineer',
 *   urgency: 'MEDIUM'
 * });
 * ```
 */
export declare const createAssetConditionAssessmentModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        assetId: number;
        assessmentNumber: string;
        assessmentDate: Date;
        assessmentType: string;
        overallCondition: number;
        structuralCondition: number;
        functionalCondition: number;
        safetyCondition: number;
        aestheticCondition: number;
        assessor: string;
        assessorCredentials: string | null;
        findings: string[];
        recommendations: string[];
        estimatedRepairCost: number;
        urgency: string;
        nextAssessmentDate: Date;
        photos: string[];
        documents: string[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
    };
};
/**
 * Calculates asset depreciation based on method and time period.
 *
 * @param {CapitalAsset} asset - Asset details
 * @param {Date} asOfDate - Date to calculate depreciation
 * @returns {Promise<{ annualDepreciation: number; accumulatedDepreciation: number; currentValue: number }>} Depreciation calculation
 *
 * @example
 * ```typescript
 * const depreciation = await calculateAssetDepreciation(asset, new Date());
 * console.log(`Current value: ${depreciation.currentValue}`);
 * ```
 */
export declare const calculateAssetDepreciation: (asset: CapitalAsset, asOfDate: Date) => Promise<{
    annualDepreciation: number;
    accumulatedDepreciation: number;
    currentValue: number;
}>;
/**
 * Tracks asset through lifecycle phases with cost accumulation.
 *
 * @param {number} assetId - Asset ID
 * @returns {Promise<AssetLifecyclePhase[]>} Lifecycle phase history
 *
 * @example
 * ```typescript
 * const lifecycle = await trackAssetLifecycle(1);
 * const totalLifecycleCost = lifecycle.reduce((sum, phase) => sum + phase.costs, 0);
 * ```
 */
export declare const trackAssetLifecycle: (assetId: number) => Promise<AssetLifecyclePhase[]>;
/**
 * Calculates remaining useful life based on condition and usage patterns.
 *
 * @param {number} assetId - Asset ID
 * @param {AssetConditionAssessment} latestAssessment - Latest condition assessment
 * @returns {Promise<{ remainingYears: number; confidence: string; factors: string[] }>} Remaining life analysis
 *
 * @example
 * ```typescript
 * const remainingLife = await calculateRemainingUsefulLife(1, assessment);
 * ```
 */
export declare const calculateRemainingUsefulLife: (assetId: number, latestAssessment: AssetConditionAssessment) => Promise<{
    remainingYears: number;
    confidence: string;
    factors: string[];
}>;
/**
 * Generates asset replacement cost estimate based on current market conditions.
 *
 * @param {number} assetId - Asset ID
 * @param {number} [inflationRate=0.03] - Annual inflation rate
 * @returns {Promise<{ currentReplacementCost: number; futureReplacementCost: number; basis: string }>} Replacement cost estimate
 *
 * @example
 * ```typescript
 * const cost = await estimateAssetReplacementCost(1, 0.035);
 * ```
 */
export declare const estimateAssetReplacementCost: (assetId: number, inflationRate?: number) => Promise<{
    currentReplacementCost: number;
    futureReplacementCost: number;
    basis: string;
}>;
/**
 * Tracks total cost of ownership across asset lifecycle.
 *
 * @param {number} assetId - Asset ID
 * @param {Date} fromDate - Start date
 * @param {Date} toDate - End date
 * @returns {Promise<{ acquisitionCost: number; operatingCost: number; maintenanceCost: number; totalCost: number }>} TCO analysis
 *
 * @example
 * ```typescript
 * const tco = await calculateTotalCostOfOwnership(1, startDate, endDate);
 * ```
 */
export declare const calculateTotalCostOfOwnership: (assetId: number, fromDate: Date, toDate: Date) => Promise<{
    acquisitionCost: number;
    operatingCost: number;
    maintenanceCost: number;
    disposalCost: number;
    totalCost: number;
}>;
/**
 * Conducts asset condition assessment with multi-criteria evaluation.
 *
 * @param {number} assetId - Asset ID
 * @param {string} assessmentType - Type of assessment
 * @param {string} assessor - Assessor name
 * @returns {Promise<AssetConditionAssessment>} Completed assessment
 *
 * @example
 * ```typescript
 * const assessment = await conductConditionAssessment(1, 'ANNUAL', 'John Engineer');
 * ```
 */
export declare const conductConditionAssessment: (assetId: number, assessmentType: string, assessor: string) => Promise<AssetConditionAssessment>;
/**
 * Calculates composite condition index from multiple assessment criteria.
 *
 * @param {AssetConditionAssessment} assessment - Assessment data
 * @param {Record<string, number>} weights - Criteria weights
 * @returns {Promise<{ compositeIndex: number; rating: string; interpretation: string }>} Condition index
 *
 * @example
 * ```typescript
 * const index = await calculateConditionIndex(assessment, {
 *   structural: 0.4,
 *   functional: 0.3,
 *   safety: 0.3
 * });
 * ```
 */
export declare const calculateConditionIndex: (assessment: AssetConditionAssessment, weights: Record<string, number>) => Promise<{
    compositeIndex: number;
    rating: string;
    interpretation: string;
}>;
/**
 * Identifies assets requiring immediate attention based on condition.
 *
 * @param {number} [conditionThreshold=2.0] - Condition threshold
 * @returns {Promise<CapitalAsset[]>} Assets requiring attention
 *
 * @example
 * ```typescript
 * const criticalAssets = await identifyCriticalConditionAssets(2.5);
 * ```
 */
export declare const identifyCriticalConditionAssets: (conditionThreshold?: number) => Promise<CapitalAsset[]>;
/**
 * Generates condition assessment schedule for asset portfolio.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} [assetClass] - Optional asset class filter
 * @returns {Promise<object[]>} Assessment schedule
 *
 * @example
 * ```typescript
 * const schedule = await generateAssessmentSchedule(2025, 'BUILDING');
 * ```
 */
export declare const generateAssessmentSchedule: (fiscalYear: number, assetClass?: string) => Promise<any[]>;
/**
 * Compares condition trends over time for predictive maintenance.
 *
 * @param {number} assetId - Asset ID
 * @param {number} lookbackYears - Years to analyze
 * @returns {Promise<{ trend: string; deteriorationRate: number; predictions: object[] }>} Trend analysis
 *
 * @example
 * ```typescript
 * const trends = await analyzeConditionTrends(1, 5);
 * ```
 */
export declare const analyzeConditionTrends: (assetId: number, lookbackYears: number) => Promise<{
    trend: string;
    deteriorationRate: number;
    predictions: any[];
}>;
/**
 * Creates capital improvement project proposal with justification.
 *
 * @param {Partial<CapitalProject>} projectData - Project details
 * @param {string} createdBy - User creating project
 * @returns {Promise<CapitalProject>} Created project
 *
 * @example
 * ```typescript
 * const project = await createCapitalProject({
 *   projectName: 'Bridge Replacement',
 *   projectType: 'REPLACEMENT',
 *   estimatedCost: 2500000,
 *   justification: 'Critical infrastructure replacement'
 * }, 'manager');
 * ```
 */
export declare const createCapitalProject: (projectData: Partial<CapitalProject>, createdBy: string) => Promise<CapitalProject>;
/**
 * Validates capital project proposal against policies and constraints.
 *
 * @param {CapitalProject} project - Project to validate
 * @returns {Promise<{ valid: boolean; errors: string[]; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateCapitalProject(project);
 * if (!validation.valid) {
 *   console.error(validation.errors);
 * }
 * ```
 */
export declare const validateCapitalProject: (project: CapitalProject) => Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * Estimates project timeline based on complexity and resources.
 *
 * @param {CapitalProject} project - Project details
 * @returns {Promise<{ plannedDuration: number; plannedStartDate: Date; plannedEndDate: Date; milestones: object[] }>} Timeline estimate
 *
 * @example
 * ```typescript
 * const timeline = await estimateProjectTimeline(project);
 * ```
 */
export declare const estimateProjectTimeline: (project: CapitalProject) => Promise<{
    plannedDuration: number;
    plannedStartDate: Date;
    plannedEndDate: Date;
    milestones: any[];
}>;
/**
 * Identifies funding sources and develops financing strategy.
 *
 * @param {CapitalProject} project - Project requiring funding
 * @returns {Promise<FundingSource[]>} Recommended funding sources
 *
 * @example
 * ```typescript
 * const funding = await identifyFundingSources(project);
 * ```
 */
export declare const identifyFundingSources: (project: CapitalProject) => Promise<FundingSource[]>;
/**
 * Generates project risk assessment with mitigation strategies.
 *
 * @param {CapitalProject} project - Project to assess
 * @returns {Promise<{ risks: object[]; overallRiskLevel: string; mitigationPlan: string[] }>} Risk assessment
 *
 * @example
 * ```typescript
 * const risks = await assessProjectRisks(project);
 * ```
 */
export declare const assessProjectRisks: (project: CapitalProject) => Promise<{
    risks: any[];
    overallRiskLevel: string;
    mitigationPlan: string[];
}>;
/**
 * Calculates project priority score using weighted criteria.
 *
 * @param {CapitalProject} project - Project to score
 * @param {PrioritizationCriteria[]} criteria - Scoring criteria
 * @returns {Promise<ProjectPrioritization>} Priority score and ranking
 *
 * @example
 * ```typescript
 * const priority = await calculateProjectPriorityScore(project, criteria);
 * ```
 */
export declare const calculateProjectPriorityScore: (project: CapitalProject, criteria: PrioritizationCriteria[]) => Promise<ProjectPrioritization>;
/**
 * Ranks projects by priority score for budget allocation.
 *
 * @param {CapitalProject[]} projects - Projects to rank
 * @param {PrioritizationCriteria[]} criteria - Ranking criteria
 * @returns {Promise<ProjectPrioritization[]>} Ranked projects
 *
 * @example
 * ```typescript
 * const ranked = await rankCapitalProjects(projects, criteria);
 * ```
 */
export declare const rankCapitalProjects: (projects: CapitalProject[], criteria: PrioritizationCriteria[]) => Promise<ProjectPrioritization[]>;
/**
 * Performs benefit-cost analysis for capital project.
 *
 * @param {CapitalProject} project - Project to analyze
 * @param {number} discountRate - Discount rate for NPV
 * @returns {Promise<{ npv: number; bcRatio: number; roi: number; paybackYears: number }>} Financial analysis
 *
 * @example
 * ```typescript
 * const analysis = await performBenefitCostAnalysis(project, 0.05);
 * ```
 */
export declare const performBenefitCostAnalysis: (project: CapitalProject, discountRate: number) => Promise<{
    npv: number;
    bcRatio: number;
    roi: number;
    paybackYears: number;
}>;
/**
 * Generates prioritization criteria set for scoring.
 *
 * @param {string} [criteriaSet='STANDARD'] - Criteria set type
 * @returns {Promise<PrioritizationCriteria[]>} Prioritization criteria
 *
 * @example
 * ```typescript
 * const criteria = await generatePrioritizationCriteria('INFRASTRUCTURE');
 * ```
 */
export declare const generatePrioritizationCriteria: (criteriaSet?: string) => Promise<PrioritizationCriteria[]>;
/**
 * Optimizes project portfolio selection within budget constraints.
 *
 * @param {CapitalProject[]} projects - Available projects
 * @param {number} budgetConstraint - Total available budget
 * @returns {Promise<{ selectedProjects: CapitalProject[]; totalCost: number; totalScore: number }>} Optimized portfolio
 *
 * @example
 * ```typescript
 * const portfolio = await optimizeProjectPortfolio(projects, 10000000);
 * ```
 */
export declare const optimizeProjectPortfolio: (projects: CapitalProject[], budgetConstraint: number) => Promise<{
    selectedProjects: CapitalProject[];
    totalCost: number;
    totalScore: number;
}>;
/**
 * Generates multi-year capital budget forecast.
 *
 * @param {number} startFiscalYear - Starting fiscal year
 * @param {number} numberOfYears - Number of years to forecast
 * @returns {Promise<CapitalBudgetForecast[]>} Multi-year forecast
 *
 * @example
 * ```typescript
 * const forecast = await generateCapitalBudgetForecast(2025, 5);
 * ```
 */
export declare const generateCapitalBudgetForecast: (startFiscalYear: number, numberOfYears: number) => Promise<CapitalBudgetForecast[]>;
/**
 * Calculates infrastructure funding gap and backlog.
 *
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<{ totalNeeds: number; availableFunding: number; fundingGap: number; backlog: number }>} Funding gap analysis
 *
 * @example
 * ```typescript
 * const gap = await calculateInfrastructureFundingGap(2025);
 * ```
 */
export declare const calculateInfrastructureFundingGap: (fiscalYear: number) => Promise<{
    totalNeeds: number;
    availableFunding: number;
    fundingGap: number;
    backlog: number;
}>;
/**
 * Projects capital needs based on asset lifecycle and replacement schedules.
 *
 * @param {number} forecastYears - Years to project
 * @returns {Promise<object[]>} Capital needs projection
 *
 * @example
 * ```typescript
 * const needs = await projectCapitalNeeds(10);
 * ```
 */
export declare const projectCapitalNeeds: (forecastYears: number) => Promise<any[]>;
/**
 * Analyzes historical capital spending patterns.
 *
 * @param {number} lookbackYears - Years to analyze
 * @returns {Promise<{ averageAnnualSpending: number; trend: string; volatility: number }>} Spending pattern analysis
 *
 * @example
 * ```typescript
 * const patterns = await analyzeCapitalSpendingPatterns(5);
 * ```
 */
export declare const analyzeCapitalSpendingPatterns: (lookbackYears: number) => Promise<{
    averageAnnualSpending: number;
    trend: string;
    volatility: number;
}>;
/**
 * Forecasts capital budget requirements with scenarios.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string[]} scenarios - Scenarios to model
 * @returns {Promise<object>} Scenario-based forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastCapitalRequirements(2025, ['BASE', 'OPTIMISTIC', 'CONSERVATIVE']);
 * ```
 */
export declare const forecastCapitalRequirements: (fiscalYear: number, scenarios: string[]) => Promise<any>;
/**
 * Generates asset replacement schedule based on lifecycle analysis.
 *
 * @param {number} planningHorizon - Years to plan
 * @param {string} [assetClass] - Optional asset class filter
 * @returns {Promise<ReplacementSchedule[]>} Replacement schedule
 *
 * @example
 * ```typescript
 * const schedule = await generateReplacementSchedule(10, 'BUILDING');
 * ```
 */
export declare const generateReplacementSchedule: (planningHorizon: number, assetClass?: string) => Promise<ReplacementSchedule[]>;
/**
 * Optimizes replacement timing based on cost and condition factors.
 *
 * @param {ReplacementSchedule[]} schedule - Initial schedule
 * @param {object} constraints - Optimization constraints
 * @returns {Promise<ReplacementSchedule[]>} Optimized schedule
 *
 * @example
 * ```typescript
 * const optimized = await optimizeReplacementTiming(schedule, { annualBudget: 10000000 });
 * ```
 */
export declare const optimizeReplacementTiming: (schedule: ReplacementSchedule[], constraints: any) => Promise<ReplacementSchedule[]>;
/**
 * Calculates impact of deferring asset replacement.
 *
 * @param {number} assetId - Asset ID
 * @param {number} deferralYears - Years to defer
 * @returns {Promise<{ additionalCost: number; riskLevel: string; serviceImpact: string }>} Deferral impact
 *
 * @example
 * ```typescript
 * const impact = await calculateReplacementDeferralImpact(1, 3);
 * ```
 */
export declare const calculateReplacementDeferralImpact: (assetId: number, deferralYears: number) => Promise<{
    additionalCost: number;
    riskLevel: string;
    serviceImpact: string;
}>;
/**
 * Identifies assets approaching end of useful life.
 *
 * @param {number} thresholdYears - Years threshold for flagging
 * @returns {Promise<CapitalAsset[]>} Assets nearing end of life
 *
 * @example
 * ```typescript
 * const aging = await identifyAgingAssets(5);
 * ```
 */
export declare const identifyAgingAssets: (thresholdYears: number) => Promise<CapitalAsset[]>;
/**
 * Generates replacement cost escalation projections.
 *
 * @param {number} baseYear - Base year for projection
 * @param {number} projectionYears - Years to project
 * @param {number} [escalationRate=0.03] - Annual escalation rate
 * @returns {Promise<object[]>} Cost escalation projections
 *
 * @example
 * ```typescript
 * const escalation = await projectReplacementCostEscalation(2025, 10, 0.035);
 * ```
 */
export declare const projectReplacementCostEscalation: (baseYear: number, projectionYears: number, escalationRate?: number) => Promise<any[]>;
/**
 * Tracks deferred maintenance backlog and costs.
 *
 * @param {string} [assetClass] - Optional asset class filter
 * @returns {Promise<DeferredMaintenance[]>} Deferred maintenance items
 *
 * @example
 * ```typescript
 * const backlog = await trackDeferredMaintenance('BUILDING');
 * ```
 */
export declare const trackDeferredMaintenance: (assetClass?: string) => Promise<DeferredMaintenance[]>;
/**
 * Calculates total deferred maintenance backlog value.
 *
 * @param {string} [department] - Optional department filter
 * @returns {Promise<{ totalBacklog: number; itemCount: number; averageAge: number }>} Backlog summary
 *
 * @example
 * ```typescript
 * const backlog = await calculateDeferredMaintenanceBacklog('Public Works');
 * ```
 */
export declare const calculateDeferredMaintenanceBacklog: (department?: string) => Promise<{
    totalBacklog: number;
    itemCount: number;
    averageAge: number;
}>;
/**
 * Prioritizes deferred maintenance items by impact and urgency.
 *
 * @param {DeferredMaintenance[]} items - Deferred items
 * @returns {Promise<DeferredMaintenance[]>} Prioritized items
 *
 * @example
 * ```typescript
 * const prioritized = await prioritizeDeferredMaintenance(items);
 * ```
 */
export declare const prioritizeDeferredMaintenance: (items: DeferredMaintenance[]) => Promise<DeferredMaintenance[]>;
/**
 * Analyzes cost of deferring maintenance vs. immediate action.
 *
 * @param {DeferredMaintenance} item - Maintenance item
 * @param {number} additionalDeferralYears - Years to defer further
 * @returns {Promise<{ currentCost: number; deferredCost: number; costIncrease: number }>} Cost comparison
 *
 * @example
 * ```typescript
 * const analysis = await analyzeDeferralCost(item, 2);
 * ```
 */
export declare const analyzeDeferralCost: (item: DeferredMaintenance, additionalDeferralYears: number) => Promise<{
    currentCost: number;
    deferredCost: number;
    costIncrease: number;
}>;
/**
 * Generates deferred maintenance reduction plan.
 *
 * @param {number} targetReductionPercent - Target reduction percentage
 * @param {number} yearsToAchieve - Years to achieve target
 * @returns {Promise<object>} Reduction plan
 *
 * @example
 * ```typescript
 * const plan = await generateMaintenanceReductionPlan(50, 5);
 * ```
 */
export declare const generateMaintenanceReductionPlan: (targetReductionPercent: number, yearsToAchieve: number) => Promise<any>;
/**
 * Generates comprehensive infrastructure inventory report.
 *
 * @param {string} [assetClass] - Optional asset class filter
 * @returns {Promise<InfrastructureInventory[]>} Inventory summary
 *
 * @example
 * ```typescript
 * const inventory = await generateInfrastructureInventory('INFRASTRUCTURE');
 * ```
 */
export declare const generateInfrastructureInventory: (assetClass?: string) => Promise<InfrastructureInventory[]>;
/**
 * Calculates infrastructure replacement value for insurance and planning.
 *
 * @param {string} [department] - Optional department filter
 * @returns {Promise<{ totalReplacementValue: number; breakdown: object[] }>} Replacement value
 *
 * @example
 * ```typescript
 * const value = await calculateInfrastructureReplacementValue('Public Works');
 * ```
 */
export declare const calculateInfrastructureReplacementValue: (department?: string) => Promise<{
    totalReplacementValue: number;
    breakdown: any[];
}>;
/**
 * Analyzes infrastructure condition by asset class.
 *
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<object[]>} Condition analysis by class
 *
 * @example
 * ```typescript
 * const analysis = await analyzeInfrastructureCondition(2025);
 * ```
 */
export declare const analyzeInfrastructureCondition: (fiscalYear: number) => Promise<any[]>;
/**
 * Tracks infrastructure capacity and utilization.
 *
 * @param {number} assetId - Asset ID
 * @returns {Promise<{ designCapacity: number; currentUtilization: number; availableCapacity: number }>} Capacity analysis
 *
 * @example
 * ```typescript
 * const capacity = await trackInfrastructureCapacity(1);
 * ```
 */
export declare const trackInfrastructureCapacity: (assetId: number) => Promise<{
    designCapacity: number;
    currentUtilization: number;
    availableCapacity: number;
}>;
/**
 * Generates asset inventory depreciation schedule.
 *
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<object[]>} Depreciation schedule
 *
 * @example
 * ```typescript
 * const schedule = await generateInventoryDepreciationSchedule(2025);
 * ```
 */
export declare const generateInventoryDepreciationSchedule: (fiscalYear: number) => Promise<any[]>;
/**
 * Analyzes debt financing options for capital projects.
 *
 * @param {number} projectCost - Total project cost
 * @param {number} termYears - Bond term in years
 * @param {number} interestRate - Annual interest rate
 * @returns {Promise<DebtFinancingAnalysis>} Financing analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeDebtFinancing(10000000, 20, 0.04);
 * ```
 */
export declare const analyzeDebtFinancing: (projectCost: number, termYears: number, interestRate: number) => Promise<DebtFinancingAnalysis>;
/**
 * Calculates debt service coverage ratio for affordability.
 *
 * @param {number} annualRevenue - Annual revenue
 * @param {number} annualDebtService - Annual debt service
 * @returns {Promise<{ dscr: number; affordable: boolean; recommendation: string }>} Coverage analysis
 *
 * @example
 * ```typescript
 * const coverage = await calculateDebtServiceCoverage(50000000, 5000000);
 * ```
 */
export declare const calculateDebtServiceCoverage: (annualRevenue: number, annualDebtService: number) => Promise<{
    dscr: number;
    affordable: boolean;
    recommendation: string;
}>;
/**
 * Optimizes bond issue sizing and timing.
 *
 * @param {CapitalProject[]} projects - Projects to fund
 * @param {object} marketConditions - Current market conditions
 * @returns {Promise<{ recommendedIssueSize: number; timing: string; projects: number[] }>} Bond optimization
 *
 * @example
 * ```typescript
 * const optimization = await optimizeBondIssuance(projects, marketConditions);
 * ```
 */
export declare const optimizeBondIssuance: (projects: CapitalProject[], marketConditions: any) => Promise<any>;
/**
 * Generates debt service payment schedule.
 *
 * @param {DebtFinancingAnalysis} financing - Financing details
 * @returns {Promise<object[]>} Payment schedule
 *
 * @example
 * ```typescript
 * const schedule = await generateDebtServiceSchedule(financing);
 * ```
 */
export declare const generateDebtServiceSchedule: (financing: DebtFinancingAnalysis) => Promise<any[]>;
/**
 * Performs bond capacity analysis based on revenue and debt limits.
 *
 * @param {number} annualRevenue - Annual revenue
 * @param {number} currentDebt - Current outstanding debt
 * @param {number} [debtLimitPercent=0.15] - Debt limit as percentage of revenue
 * @returns {Promise<{ availableCapacity: number; currentUtilization: number; maxAdditionalDebt: number }>} Capacity analysis
 *
 * @example
 * ```typescript
 * const capacity = await analyzeBondCapacity(50000000, 5000000, 0.15);
 * ```
 */
export declare const analyzeBondCapacity: (annualRevenue: number, currentDebt: number, debtLimitPercent?: number) => Promise<{
    availableCapacity: number;
    currentUtilization: number;
    maxAdditionalDebt: number;
}>;
/**
 * Creates comprehensive multi-year capital improvement plan.
 *
 * @param {number} startYear - Starting fiscal year
 * @param {number} planYears - Number of years in plan
 * @param {CapitalProject[]} projects - Projects to include
 * @returns {Promise<MultiYearCapitalPlan>} Multi-year plan
 *
 * @example
 * ```typescript
 * const plan = await createMultiYearCapitalPlan(2025, 5, projects);
 * ```
 */
export declare const createMultiYearCapitalPlan: (startYear: number, planYears: number, projects: CapitalProject[]) => Promise<MultiYearCapitalPlan>;
/**
 * Validates multi-year plan against constraints and policies.
 *
 * @param {MultiYearCapitalPlan} plan - Plan to validate
 * @returns {Promise<{ valid: boolean; errors: string[]; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateMultiYearPlan(plan);
 * ```
 */
export declare const validateMultiYearPlan: (plan: MultiYearCapitalPlan) => Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * Generates capital plan implementation roadmap.
 *
 * @param {MultiYearCapitalPlan} plan - Approved capital plan
 * @returns {Promise<object>} Implementation roadmap
 *
 * @example
 * ```typescript
 * const roadmap = await generateCapitalPlanRoadmap(plan);
 * ```
 */
export declare const generateCapitalPlanRoadmap: (plan: MultiYearCapitalPlan) => Promise<any>;
/**
 * Tracks capital plan execution progress and performance.
 *
 * @param {string} planId - Plan ID
 * @param {number} fiscalYear - Current fiscal year
 * @returns {Promise<object>} Execution status
 *
 * @example
 * ```typescript
 * const status = await trackCapitalPlanExecution('CIP-2025-2029', 2025);
 * ```
 */
export declare const trackCapitalPlanExecution: (planId: string, fiscalYear: number) => Promise<any>;
/**
 * Generates comprehensive capital asset planning report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {object} [options] - Report options
 * @returns {Promise<object>} Comprehensive planning report
 *
 * @example
 * ```typescript
 * const report = await generateCapitalPlanningReport(2025, { includeForecasts: true });
 * ```
 */
export declare const generateCapitalPlanningReport: (fiscalYear: number, options?: any) => Promise<any>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createCapitalAssetModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            assetNumber: string;
            assetName: string;
            assetType: string;
            assetClass: string;
            description: string;
            location: string;
            department: string;
            gpsCoordinates: string | null;
            acquisitionDate: Date;
            acquisitionCost: number;
            currentValue: number;
            accumulatedDepreciation: number;
            usefulLifeYears: number;
            remainingLifeYears: number;
            depreciationMethod: string;
            salvageValue: number;
            conditionRating: number;
            lastAssessmentDate: Date | null;
            nextAssessmentDate: Date | null;
            status: string;
            disposalDate: Date | null;
            disposalValue: number | null;
            replacementCost: number;
            maintenanceSchedule: string | null;
            criticalityRating: number;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
            readonly createdBy: string;
            readonly updatedBy: string;
        };
    };
    createCapitalProjectModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            projectNumber: string;
            projectName: string;
            projectType: string;
            description: string;
            justification: string;
            relatedAssetIds: number[];
            estimatedCost: number;
            actualCost: number | null;
            fundingSources: Record<string, any>[];
            totalFundingSecured: number;
            priorityScore: number;
            priorityRank: number | null;
            requestedFiscalYear: number;
            approvedFiscalYear: number | null;
            plannedStartDate: Date | null;
            actualStartDate: Date | null;
            plannedCompletionDate: Date | null;
            actualCompletionDate: Date | null;
            status: string;
            statusReason: string | null;
            projectManager: string | null;
            department: string;
            approvals: Record<string, any>[];
            riskAssessment: Record<string, any>;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
            readonly createdBy: string;
            readonly updatedBy: string;
        };
    };
    createAssetConditionAssessmentModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            assetId: number;
            assessmentNumber: string;
            assessmentDate: Date;
            assessmentType: string;
            overallCondition: number;
            structuralCondition: number;
            functionalCondition: number;
            safetyCondition: number;
            aestheticCondition: number;
            assessor: string;
            assessorCredentials: string | null;
            findings: string[];
            recommendations: string[];
            estimatedRepairCost: number;
            urgency: string;
            nextAssessmentDate: Date;
            photos: string[];
            documents: string[];
            metadata: Record<string, any>;
            readonly createdAt: Date;
        };
    };
    calculateAssetDepreciation: (asset: CapitalAsset, asOfDate: Date) => Promise<{
        annualDepreciation: number;
        accumulatedDepreciation: number;
        currentValue: number;
    }>;
    trackAssetLifecycle: (assetId: number) => Promise<AssetLifecyclePhase[]>;
    calculateRemainingUsefulLife: (assetId: number, latestAssessment: AssetConditionAssessment) => Promise<{
        remainingYears: number;
        confidence: string;
        factors: string[];
    }>;
    estimateAssetReplacementCost: (assetId: number, inflationRate?: number) => Promise<{
        currentReplacementCost: number;
        futureReplacementCost: number;
        basis: string;
    }>;
    calculateTotalCostOfOwnership: (assetId: number, fromDate: Date, toDate: Date) => Promise<{
        acquisitionCost: number;
        operatingCost: number;
        maintenanceCost: number;
        disposalCost: number;
        totalCost: number;
    }>;
    conductConditionAssessment: (assetId: number, assessmentType: string, assessor: string) => Promise<AssetConditionAssessment>;
    calculateConditionIndex: (assessment: AssetConditionAssessment, weights: Record<string, number>) => Promise<{
        compositeIndex: number;
        rating: string;
        interpretation: string;
    }>;
    identifyCriticalConditionAssets: (conditionThreshold?: number) => Promise<CapitalAsset[]>;
    generateAssessmentSchedule: (fiscalYear: number, assetClass?: string) => Promise<any[]>;
    analyzeConditionTrends: (assetId: number, lookbackYears: number) => Promise<{
        trend: string;
        deteriorationRate: number;
        predictions: any[];
    }>;
    createCapitalProject: (projectData: Partial<CapitalProject>, createdBy: string) => Promise<CapitalProject>;
    validateCapitalProject: (project: CapitalProject) => Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    estimateProjectTimeline: (project: CapitalProject) => Promise<{
        plannedDuration: number;
        plannedStartDate: Date;
        plannedEndDate: Date;
        milestones: any[];
    }>;
    identifyFundingSources: (project: CapitalProject) => Promise<FundingSource[]>;
    assessProjectRisks: (project: CapitalProject) => Promise<{
        risks: any[];
        overallRiskLevel: string;
        mitigationPlan: string[];
    }>;
    calculateProjectPriorityScore: (project: CapitalProject, criteria: PrioritizationCriteria[]) => Promise<ProjectPrioritization>;
    rankCapitalProjects: (projects: CapitalProject[], criteria: PrioritizationCriteria[]) => Promise<ProjectPrioritization[]>;
    performBenefitCostAnalysis: (project: CapitalProject, discountRate: number) => Promise<{
        npv: number;
        bcRatio: number;
        roi: number;
        paybackYears: number;
    }>;
    generatePrioritizationCriteria: (criteriaSet?: string) => Promise<PrioritizationCriteria[]>;
    optimizeProjectPortfolio: (projects: CapitalProject[], budgetConstraint: number) => Promise<{
        selectedProjects: CapitalProject[];
        totalCost: number;
        totalScore: number;
    }>;
    generateCapitalBudgetForecast: (startFiscalYear: number, numberOfYears: number) => Promise<CapitalBudgetForecast[]>;
    calculateInfrastructureFundingGap: (fiscalYear: number) => Promise<{
        totalNeeds: number;
        availableFunding: number;
        fundingGap: number;
        backlog: number;
    }>;
    projectCapitalNeeds: (forecastYears: number) => Promise<any[]>;
    analyzeCapitalSpendingPatterns: (lookbackYears: number) => Promise<{
        averageAnnualSpending: number;
        trend: string;
        volatility: number;
    }>;
    forecastCapitalRequirements: (fiscalYear: number, scenarios: string[]) => Promise<any>;
    generateReplacementSchedule: (planningHorizon: number, assetClass?: string) => Promise<ReplacementSchedule[]>;
    optimizeReplacementTiming: (schedule: ReplacementSchedule[], constraints: any) => Promise<ReplacementSchedule[]>;
    calculateReplacementDeferralImpact: (assetId: number, deferralYears: number) => Promise<{
        additionalCost: number;
        riskLevel: string;
        serviceImpact: string;
    }>;
    identifyAgingAssets: (thresholdYears: number) => Promise<CapitalAsset[]>;
    projectReplacementCostEscalation: (baseYear: number, projectionYears: number, escalationRate?: number) => Promise<any[]>;
    trackDeferredMaintenance: (assetClass?: string) => Promise<DeferredMaintenance[]>;
    calculateDeferredMaintenanceBacklog: (department?: string) => Promise<{
        totalBacklog: number;
        itemCount: number;
        averageAge: number;
    }>;
    prioritizeDeferredMaintenance: (items: DeferredMaintenance[]) => Promise<DeferredMaintenance[]>;
    analyzeDeferralCost: (item: DeferredMaintenance, additionalDeferralYears: number) => Promise<{
        currentCost: number;
        deferredCost: number;
        costIncrease: number;
    }>;
    generateMaintenanceReductionPlan: (targetReductionPercent: number, yearsToAchieve: number) => Promise<any>;
    generateInfrastructureInventory: (assetClass?: string) => Promise<InfrastructureInventory[]>;
    calculateInfrastructureReplacementValue: (department?: string) => Promise<{
        totalReplacementValue: number;
        breakdown: any[];
    }>;
    analyzeInfrastructureCondition: (fiscalYear: number) => Promise<any[]>;
    trackInfrastructureCapacity: (assetId: number) => Promise<{
        designCapacity: number;
        currentUtilization: number;
        availableCapacity: number;
    }>;
    generateInventoryDepreciationSchedule: (fiscalYear: number) => Promise<any[]>;
    analyzeDebtFinancing: (projectCost: number, termYears: number, interestRate: number) => Promise<DebtFinancingAnalysis>;
    calculateDebtServiceCoverage: (annualRevenue: number, annualDebtService: number) => Promise<{
        dscr: number;
        affordable: boolean;
        recommendation: string;
    }>;
    optimizeBondIssuance: (projects: CapitalProject[], marketConditions: any) => Promise<any>;
    generateDebtServiceSchedule: (financing: DebtFinancingAnalysis) => Promise<any[]>;
    analyzeBondCapacity: (annualRevenue: number, currentDebt: number, debtLimitPercent?: number) => Promise<{
        availableCapacity: number;
        currentUtilization: number;
        maxAdditionalDebt: number;
    }>;
    createMultiYearCapitalPlan: (startYear: number, planYears: number, projects: CapitalProject[]) => Promise<MultiYearCapitalPlan>;
    validateMultiYearPlan: (plan: MultiYearCapitalPlan) => Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    generateCapitalPlanRoadmap: (plan: MultiYearCapitalPlan) => Promise<any>;
    trackCapitalPlanExecution: (planId: string, fiscalYear: number) => Promise<any>;
    generateCapitalPlanningReport: (fiscalYear: number, options?: any) => Promise<any>;
};
export default _default;
//# sourceMappingURL=capital-asset-planning-kit.d.ts.map