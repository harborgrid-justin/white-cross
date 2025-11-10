/**
 * LOC: CONSSTRAT12345
 * File: /reuse/consulting/strategic-planning-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend consulting services
 *   - Strategic planning controllers
 *   - Business analytics dashboards
 *   - Executive reporting engines
 */
/**
 * File: /reuse/consulting/strategic-planning-kit.ts
 * Locator: WC-CONSULTING-STRATEGY-001
 * Purpose: Comprehensive Strategic Planning & Analysis - McKinsey/BCG-level strategic frameworks and methodologies
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Consulting controllers, strategy services, analytics platforms, executive dashboards
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for SWOT analysis, Porter's Five Forces, BCG Matrix, Ansoff Matrix, balanced scorecard, scenario planning
 *
 * LLM Context: Enterprise-grade strategic planning system competing with McKinsey/BCG/Bain capabilities.
 * Provides comprehensive strategic analysis frameworks including SWOT, Porter's Five Forces, BCG Matrix,
 * Ansoff Matrix, balanced scorecard, scenario planning, competitive intelligence, market analysis,
 * strategic roadmapping, value chain analysis, blue ocean strategy, core competency analysis,
 * stakeholder mapping, strategic risk assessment, portfolio optimization, and strategic performance tracking.
 */
import { Model, Sequelize, Transaction } from 'sequelize';
/**
 * Strategic analysis framework types
 */
export declare enum StrategyFramework {
    SWOT = "swot",
    PORTER_FIVE_FORCES = "porter_five_forces",
    BCG_MATRIX = "bcg_matrix",
    ANSOFF_MATRIX = "ansoff_matrix",
    BALANCED_SCORECARD = "balanced_scorecard",
    VALUE_CHAIN = "value_chain",
    PESTEL = "pestel",
    BLUE_OCEAN = "blue_ocean",
    CORE_COMPETENCY = "core_competency",
    SCENARIO_PLANNING = "scenario_planning"
}
/**
 * Strategic position quadrants
 */
export declare enum StrategicPosition {
    STAR = "star",
    CASH_COW = "cash_cow",
    QUESTION_MARK = "question_mark",
    DOG = "dog",
    LEADER = "leader",
    CHALLENGER = "challenger",
    FOLLOWER = "follower",
    NICHER = "nicher"
}
/**
 * Strategic priority levels
 */
export declare enum StrategyPriority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    DEFERRED = "deferred"
}
/**
 * Strategic initiative status
 */
export declare enum InitiativeStatus {
    PROPOSED = "proposed",
    APPROVED = "approved",
    IN_PROGRESS = "in_progress",
    ON_HOLD = "on_hold",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    UNDER_REVIEW = "under_review"
}
/**
 * Competitive intensity levels
 */
export declare enum CompetitiveIntensity {
    VERY_HIGH = "very_high",
    HIGH = "high",
    MODERATE = "moderate",
    LOW = "low",
    VERY_LOW = "very_low"
}
/**
 * Growth strategy types
 */
export declare enum GrowthStrategy {
    MARKET_PENETRATION = "market_penetration",
    MARKET_DEVELOPMENT = "market_development",
    PRODUCT_DEVELOPMENT = "product_development",
    DIVERSIFICATION = "diversification",
    VERTICAL_INTEGRATION = "vertical_integration",
    HORIZONTAL_INTEGRATION = "horizontal_integration"
}
/**
 * Strategic risk levels
 */
export declare enum StrategicRiskLevel {
    CRITICAL = "critical",
    HIGH = "high",
    MODERATE = "moderate",
    LOW = "low",
    NEGLIGIBLE = "negligible"
}
/**
 * Strategic context interface
 */
export interface StrategyContext {
    organizationId: string;
    userId: string;
    timestamp: string;
    framework: StrategyFramework;
    analysisId?: string;
    metadata?: Record<string, any>;
}
/**
 * SWOT Analysis interface
 */
export interface SWOTAnalysis {
    id: string;
    organizationId: string;
    analysisName: string;
    analysisDate: string;
    timeHorizon: string;
    strengths: SWOTItem[];
    weaknesses: SWOTItem[];
    opportunities: SWOTItem[];
    threats: SWOTItem[];
    strategicRecommendations: StrategicRecommendation[];
    crossFactorAnalysis: CrossFactorAnalysis[];
    status: InitiativeStatus;
    createdBy: string;
    approvedBy?: string;
    approvedAt?: string;
    metadata: Record<string, any>;
}
/**
 * SWOT item interface
 */
export interface SWOTItem {
    id: string;
    category: 'strength' | 'weakness' | 'opportunity' | 'threat';
    description: string;
    impact: number;
    urgency: number;
    evidence: string[];
    relatedFactors: string[];
    actionItems: string[];
    owner?: string;
    dueDate?: string;
}
/**
 * Cross-factor SWOT analysis
 */
export interface CrossFactorAnalysis {
    type: 'SO' | 'WO' | 'ST' | 'WT';
    strategy: string;
    relatedStrengths?: string[];
    relatedWeaknesses?: string[];
    relatedOpportunities?: string[];
    relatedThreats?: string[];
    priority: StrategyPriority;
    estimatedImpact: number;
    implementationComplexity: number;
}
/**
 * Porter's Five Forces analysis
 */
export interface PorterFiveForcesAnalysis {
    id: string;
    organizationId: string;
    industry: string;
    analysisDate: string;
    competitiveRivalry: ForceAnalysis;
    threatOfNewEntrants: ForceAnalysis;
    bargainingPowerSuppliers: ForceAnalysis;
    bargainingPowerBuyers: ForceAnalysis;
    threatOfSubstitutes: ForceAnalysis;
    overallAttractiveness: number;
    strategicImplications: string[];
    actionItems: ActionItem[];
    metadata: Record<string, any>;
}
/**
 * Individual force analysis
 */
export interface ForceAnalysis {
    intensity: CompetitiveIntensity;
    intensityScore: number;
    keyFactors: ForceFactor[];
    trends: string[];
    strategicResponse: string;
    mitigationStrategies: string[];
}
/**
 * Force factor
 */
export interface ForceFactor {
    factor: string;
    impact: number;
    trend: 'increasing' | 'stable' | 'decreasing';
    description: string;
}
/**
 * BCG Matrix analysis
 */
export interface BCGMatrixAnalysis {
    id: string;
    organizationId: string;
    portfolioName: string;
    analysisDate: string;
    businessUnits: BCGBusinessUnit[];
    portfolioRecommendations: PortfolioRecommendation[];
    resourceAllocation: ResourceAllocation[];
    strategicGaps: string[];
    metadata: Record<string, any>;
}
/**
 * BCG business unit positioning
 */
export interface BCGBusinessUnit {
    id: string;
    unitName: string;
    position: StrategicPosition;
    marketGrowthRate: number;
    relativeMarketShare: number;
    revenue: number;
    profitMargin: number;
    cashFlowContribution: number;
    strategicImportance: number;
    recommendedStrategy: string;
    investmentPriority: StrategyPriority;
    timeline: string;
}
/**
 * Portfolio recommendation
 */
export interface PortfolioRecommendation {
    type: 'invest' | 'hold' | 'harvest' | 'divest';
    businessUnits: string[];
    rationale: string;
    expectedOutcome: string;
    risks: string[];
    requiredInvestment: number;
    expectedReturn: number;
    timeframe: string;
}
/**
 * Resource allocation
 */
export interface ResourceAllocation {
    businessUnitId: string;
    allocationType: 'capital' | 'human' | 'technology' | 'marketing';
    currentAllocation: number;
    recommendedAllocation: number;
    variance: number;
    justification: string;
}
/**
 * Ansoff Matrix analysis
 */
export interface AnsoffMatrixAnalysis {
    id: string;
    organizationId: string;
    analysisName: string;
    analysisDate: string;
    marketPenetration: GrowthInitiative[];
    marketDevelopment: GrowthInitiative[];
    productDevelopment: GrowthInitiative[];
    diversification: GrowthInitiative[];
    recommendedStrategy: GrowthStrategy;
    riskAssessment: StrategyRiskAssessment;
    metadata: Record<string, any>;
}
/**
 * Growth initiative
 */
export interface GrowthInitiative {
    id: string;
    initiativeName: string;
    description: string;
    targetMarket?: string;
    targetProduct?: string;
    expectedRevenue: number;
    investmentRequired: number;
    roi: number;
    timeToMarket: number;
    riskLevel: StrategicRiskLevel;
    successProbability: number;
    strategicFit: number;
    priority: StrategyPriority;
}
/**
 * Strategy risk assessment
 */
export interface StrategyRiskAssessment {
    overallRisk: StrategicRiskLevel;
    riskScore: number;
    marketRisks: RiskItem[];
    operationalRisks: RiskItem[];
    financialRisks: RiskItem[];
    competitiveRisks: RiskItem[];
    mitigationPlan: MitigationStrategy[];
}
/**
 * Risk item
 */
export interface RiskItem {
    id: string;
    riskDescription: string;
    probability: number;
    impact: number;
    riskScore: number;
    category: string;
    owner?: string;
}
/**
 * Mitigation strategy
 */
export interface MitigationStrategy {
    riskId: string;
    strategy: string;
    cost: number;
    effectiveness: number;
    timeline: string;
    owner: string;
}
/**
 * Balanced Scorecard
 */
export interface BalancedScorecard {
    id: string;
    organizationId: string;
    scorecardName: string;
    period: string;
    financialPerspective: PerspectiveMetrics;
    customerPerspective: PerspectiveMetrics;
    internalProcessPerspective: PerspectiveMetrics;
    learningGrowthPerspective: PerspectiveMetrics;
    strategicObjectives: StrategicObjective[];
    strategyMap: StrategyMapNode[];
    overallScore: number;
    status: InitiativeStatus;
    metadata: Record<string, any>;
}
/**
 * Perspective metrics
 */
export interface PerspectiveMetrics {
    perspective: 'financial' | 'customer' | 'internal' | 'learning';
    objectives: StrategicObjective[];
    measures: PerformanceMeasure[];
    targets: Target[];
    initiatives: Initiative[];
    currentScore: number;
    targetScore: number;
    variance: number;
}
/**
 * Strategic objective
 */
export interface StrategicObjective {
    id: string;
    objectiveName: string;
    description: string;
    perspective: 'financial' | 'customer' | 'internal' | 'learning';
    weight: number;
    owner: string;
    status: InitiativeStatus;
    linkedObjectives: string[];
}
/**
 * Performance measure
 */
export interface PerformanceMeasure {
    id: string;
    measureName: string;
    objectiveId: string;
    metricType: 'leading' | 'lagging';
    unit: string;
    currentValue: number;
    targetValue: number;
    baseline: number;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
    dataSource: string;
}
/**
 * Target
 */
export interface Target {
    measureId: string;
    period: string;
    targetValue: number;
    actualValue?: number;
    variance?: number;
    status: 'on-track' | 'at-risk' | 'behind' | 'achieved';
}
/**
 * Initiative
 */
export interface Initiative {
    id: string;
    initiativeName: string;
    description: string;
    objectiveIds: string[];
    owner: string;
    budget: number;
    startDate: string;
    endDate: string;
    status: InitiativeStatus;
    progress: number;
    expectedImpact: number;
}
/**
 * Strategy map node
 */
export interface StrategyMapNode {
    objectiveId: string;
    perspective: 'financial' | 'customer' | 'internal' | 'learning';
    dependencies: string[];
    contributesTo: string[];
}
/**
 * Scenario planning analysis
 */
export interface ScenarioPlanningAnalysis {
    id: string;
    organizationId: string;
    analysisName: string;
    timeHorizon: string;
    scenarios: Scenario[];
    criticalUncertainties: CriticalUncertainty[];
    earlyWarningIndicators: EarlyWarningIndicator[];
    contingencyPlans: ContingencyPlan[];
    recommendedActions: StrategicRecommendation[];
    metadata: Record<string, any>;
}
/**
 * Scenario
 */
export interface Scenario {
    id: string;
    scenarioName: string;
    description: string;
    probability: number;
    impact: number;
    assumptions: Assumption[];
    projections: ScenarioProjection[];
    strategicImplications: string[];
    requiredCapabilities: string[];
}
/**
 * Assumption
 */
export interface Assumption {
    category: string;
    assumption: string;
    confidence: number;
    evidenceSupport: string[];
}
/**
 * Scenario projection
 */
export interface ScenarioProjection {
    metric: string;
    baselineValue: number;
    projectedValue: number;
    year: number;
    confidence: number;
}
/**
 * Critical uncertainty
 */
export interface CriticalUncertainty {
    id: string;
    uncertaintyName: string;
    description: string;
    impact: number;
    predictability: number;
    monitoringMethod: string;
    owner: string;
}
/**
 * Early warning indicator
 */
export interface EarlyWarningIndicator {
    id: string;
    indicatorName: string;
    scenarioId: string;
    currentValue: number;
    thresholdValue: number;
    trend: 'increasing' | 'stable' | 'decreasing';
    monitoringFrequency: string;
    alertOwner: string;
}
/**
 * Contingency plan
 */
export interface ContingencyPlan {
    id: string;
    scenarioId: string;
    planName: string;
    triggers: string[];
    actions: ActionItem[];
    resources: ResourceRequirement[];
    responsibleParty: string;
    activationCriteria: string;
}
/**
 * Strategic recommendation
 */
export interface StrategicRecommendation {
    id: string;
    recommendation: string;
    rationale: string;
    expectedBenefit: string;
    implementationCost: number;
    timeframe: string;
    priority: StrategyPriority;
    risks: string[];
    dependencies: string[];
    owner?: string;
}
/**
 * Action item
 */
export interface ActionItem {
    id: string;
    action: string;
    description: string;
    owner: string;
    dueDate: string;
    status: InitiativeStatus;
    priority: StrategyPriority;
    dependencies: string[];
}
/**
 * Resource requirement
 */
export interface ResourceRequirement {
    resourceType: 'capital' | 'human' | 'technology' | 'infrastructure';
    description: string;
    quantity: number;
    cost: number;
    availability: 'available' | 'needs_acquisition' | 'not_available';
}
/**
 * Value chain analysis
 */
export interface ValueChainAnalysis {
    id: string;
    organizationId: string;
    analysisDate: string;
    primaryActivities: ValueActivity[];
    supportActivities: ValueActivity[];
    costDrivers: CostDriver[];
    valueDrivers: ValueDriver[];
    competitiveAdvantages: CompetitiveAdvantage[];
    improvementOpportunities: ImprovementOpportunity[];
    metadata: Record<string, any>;
}
/**
 * Value activity
 */
export interface ValueActivity {
    id: string;
    activityName: string;
    activityType: 'primary' | 'support';
    category: string;
    valueContribution: number;
    costContribution: number;
    efficiency: number;
    qualityLevel: number;
    competitivePosition: 'superior' | 'at_par' | 'inferior';
    improvementPotential: number;
}
/**
 * Cost driver
 */
export interface CostDriver {
    activityId: string;
    driver: string;
    impactLevel: number;
    optimization: string;
    expectedSavings: number;
}
/**
 * Value driver
 */
export interface ValueDriver {
    activityId: string;
    driver: string;
    customerValue: number;
    differentiationPotential: number;
    enhancementStrategy: string;
    expectedRevenue: number;
}
/**
 * Competitive advantage
 */
export interface CompetitiveAdvantage {
    source: string;
    type: 'cost' | 'differentiation' | 'focus';
    sustainability: number;
    activities: string[];
    protection: string;
}
/**
 * Improvement opportunity
 */
export interface ImprovementOpportunity {
    id: string;
    activityId: string;
    opportunity: string;
    type: 'cost_reduction' | 'value_enhancement' | 'efficiency';
    potentialImpact: number;
    implementationCost: number;
    roi: number;
    priority: StrategyPriority;
}
/**
 * DTO for creating SWOT analysis
 */
export declare class CreateSWOTAnalysisDto {
    organizationId: string;
    analysisName: string;
    analysisDate: string;
    timeHorizon: string;
    strengths: SWOTItemDto[];
    weaknesses: SWOTItemDto[];
    opportunities: SWOTItemDto[];
    threats: SWOTItemDto[];
    metadata?: Record<string, any>;
}
/**
 * DTO for SWOT item
 */
export declare class SWOTItemDto {
    category: 'strength' | 'weakness' | 'opportunity' | 'threat';
    description: string;
    impact: number;
    urgency: number;
    evidence: string[];
    relatedFactors?: string[];
    actionItems?: string[];
}
/**
 * DTO for creating Porter's Five Forces analysis
 */
export declare class CreatePorterFiveForcesDto {
    organizationId: string;
    industry: string;
    analysisDate: string;
    competitiveRivalry: ForceAnalysisDto;
    threatOfNewEntrants: ForceAnalysisDto;
    bargainingPowerSuppliers: ForceAnalysisDto;
    bargainingPowerBuyers: ForceAnalysisDto;
    threatOfSubstitutes: ForceAnalysisDto;
    metadata?: Record<string, any>;
}
/**
 * DTO for force analysis
 */
export declare class ForceAnalysisDto {
    intensity: CompetitiveIntensity;
    intensityScore: number;
    keyFactors: ForceFactorDto[];
    strategicResponse: string;
}
/**
 * DTO for force factor
 */
export declare class ForceFactorDto {
    factor: string;
    impact: number;
    trend: 'increasing' | 'stable' | 'decreasing';
    description: string;
}
/**
 * DTO for creating BCG Matrix analysis
 */
export declare class CreateBCGMatrixDto {
    organizationId: string;
    portfolioName: string;
    analysisDate: string;
    businessUnits: BCGBusinessUnitDto[];
    metadata?: Record<string, any>;
}
/**
 * DTO for BCG business unit
 */
export declare class BCGBusinessUnitDto {
    unitName: string;
    position: StrategicPosition;
    marketGrowthRate: number;
    relativeMarketShare: number;
    revenue: number;
    profitMargin: number;
    strategicImportance: number;
    recommendedStrategy: string;
}
/**
 * DTO for creating Ansoff Matrix analysis
 */
export declare class CreateAnsoffMatrixDto {
    organizationId: string;
    analysisName: string;
    analysisDate: string;
    marketPenetration: GrowthInitiativeDto[];
    marketDevelopment: GrowthInitiativeDto[];
    productDevelopment: GrowthInitiativeDto[];
    diversification: GrowthInitiativeDto[];
    recommendedStrategy: GrowthStrategy;
}
/**
 * DTO for growth initiative
 */
export declare class GrowthInitiativeDto {
    initiativeName: string;
    description: string;
    expectedRevenue: number;
    investmentRequired: number;
    roi: number;
    timeToMarket: number;
    riskLevel: StrategicRiskLevel;
    successProbability: number;
    strategicFit: number;
    priority: StrategyPriority;
}
/**
 * DTO for creating Balanced Scorecard
 */
export declare class CreateBalancedScorecardDto {
    organizationId: string;
    scorecardName: string;
    period: string;
    financialPerspective: PerspectiveMetricsDto;
    customerPerspective: PerspectiveMetricsDto;
    internalProcessPerspective: PerspectiveMetricsDto;
    learningGrowthPerspective: PerspectiveMetricsDto;
}
/**
 * DTO for perspective metrics
 */
export declare class PerspectiveMetricsDto {
    perspective: 'financial' | 'customer' | 'internal' | 'learning';
    objectives: StrategicObjectiveDto[];
    measures: PerformanceMeasureDto[];
    targetScore: number;
}
/**
 * DTO for strategic objective
 */
export declare class StrategicObjectiveDto {
    objectiveName: string;
    description: string;
    weight: number;
    owner: string;
}
/**
 * DTO for performance measure
 */
export declare class PerformanceMeasureDto {
    measureName: string;
    metricType: 'leading' | 'lagging';
    unit: string;
    targetValue: number;
    baseline: number;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
}
/**
 * DTO for creating scenario planning analysis
 */
export declare class CreateScenarioPlanningDto {
    organizationId: string;
    analysisName: string;
    timeHorizon: string;
    scenarios: ScenarioDto[];
    criticalUncertainties: CriticalUncertaintyDto[];
}
/**
 * DTO for scenario
 */
export declare class ScenarioDto {
    scenarioName: string;
    description: string;
    probability: number;
    impact: number;
    assumptions: AssumptionDto[];
    strategicImplications: string[];
}
/**
 * DTO for assumption
 */
export declare class AssumptionDto {
    category: string;
    assumption: string;
    confidence: number;
    evidenceSupport: string[];
}
/**
 * DTO for critical uncertainty
 */
export declare class CriticalUncertaintyDto {
    uncertaintyName: string;
    description: string;
    impact: number;
    predictability: number;
    monitoringMethod: string;
    owner: string;
}
/**
 * SWOT Analysis Model
 * Stores comprehensive SWOT analysis data
 */
export declare class SWOTAnalysisModel extends Model {
    id: string;
    organizationId: string;
    analysisName: string;
    analysisDate: string;
    timeHorizon: string;
    strengths: string;
    weaknesses: string;
    opportunities: string;
    threats: string;
    strategicRecommendations: string;
    crossFactorAnalysis: string;
    status: InitiativeStatus;
    createdBy: string;
    approvedBy: string | null;
    approvedAt: Date | null;
    metadata: string;
    createdAt: Date;
    updatedAt: Date;
    static initModel(sequelize: Sequelize): typeof SWOTAnalysisModel;
}
/**
 * Porter Five Forces Model
 * Stores Porter's Five Forces analysis
 */
export declare class PorterFiveForcesModel extends Model {
    id: string;
    organizationId: string;
    industry: string;
    analysisDate: string;
    competitiveRivalry: string;
    threatOfNewEntrants: string;
    bargainingPowerSuppliers: string;
    bargainingPowerBuyers: string;
    threatOfSubstitutes: string;
    overallAttractiveness: number;
    strategicImplications: string;
    actionItems: string;
    metadata: string;
    createdAt: Date;
    updatedAt: Date;
    static initModel(sequelize: Sequelize): typeof PorterFiveForcesModel;
}
/**
 * BCG Matrix Model
 * Stores BCG Matrix portfolio analysis
 */
export declare class BCGMatrixModel extends Model {
    id: string;
    organizationId: string;
    portfolioName: string;
    analysisDate: string;
    businessUnits: string;
    portfolioRecommendations: string;
    resourceAllocation: string;
    strategicGaps: string;
    metadata: string;
    createdAt: Date;
    updatedAt: Date;
    static initModel(sequelize: Sequelize): typeof BCGMatrixModel;
}
/**
 * Balanced Scorecard Model
 * Stores balanced scorecard data
 */
export declare class BalancedScorecardModel extends Model {
    id: string;
    organizationId: string;
    scorecardName: string;
    period: string;
    financialPerspective: string;
    customerPerspective: string;
    internalProcessPerspective: string;
    learningGrowthPerspective: string;
    strategicObjectives: string;
    strategyMap: string;
    overallScore: number;
    status: InitiativeStatus;
    metadata: string;
    createdAt: Date;
    updatedAt: Date;
    static initModel(sequelize: Sequelize): typeof BalancedScorecardModel;
}
/**
 * Function 1: Create comprehensive SWOT analysis
 *
 * Generates a complete SWOT analysis with strengths, weaknesses, opportunities,
 * threats, cross-factor analysis, and strategic recommendations.
 *
 * @param context - Strategy context
 * @param data - SWOT analysis data
 * @param transaction - Database transaction
 * @returns Created SWOT analysis
 *
 * @example
 * ```typescript
 * const swot = await createSWOTAnalysis(
 *   context,
 *   {
 *     organizationId: 'org-123',
 *     analysisName: 'Q4 2024 Strategic SWOT',
 *     strengths: [{ category: 'strength', description: 'Market leader', impact: 9, urgency: 8 }],
 *     // ... other data
 *   },
 *   transaction
 * );
 * ```
 */
export declare function createSWOTAnalysis(context: StrategyContext, data: Partial<SWOTAnalysis>, transaction?: Transaction): Promise<SWOTAnalysis>;
/**
 * Function 2: Generate cross-factor SWOT analysis (SO, WO, ST, WT strategies)
 *
 * Analyzes combinations of SWOT factors to identify strategic options:
 * - SO: Use strengths to capitalize on opportunities
 * - WO: Overcome weaknesses to pursue opportunities
 * - ST: Use strengths to mitigate threats
 * - WT: Minimize weaknesses and avoid threats
 *
 * @param strengths - List of strengths
 * @param weaknesses - List of weaknesses
 * @param opportunities - List of opportunities
 * @param threats - List of threats
 * @returns Cross-factor strategic options
 *
 * @example
 * ```typescript
 * const crossFactors = generateCrossFactorAnalysis(strengths, weaknesses, opportunities, threats);
 * // Returns SO, WO, ST, WT strategic recommendations
 * ```
 */
export declare function generateCrossFactorAnalysis(strengths: SWOTItem[], weaknesses: SWOTItem[], opportunities: SWOTItem[], threats: SWOTItem[]): CrossFactorAnalysis[];
/**
 * Function 3: Generate strategic recommendations from SWOT analysis
 *
 * Creates prioritized strategic recommendations based on SWOT factors
 * and cross-factor analysis.
 *
 * @param strengths - List of strengths
 * @param weaknesses - List of weaknesses
 * @param opportunities - List of opportunities
 * @param threats - List of threats
 * @param crossFactors - Cross-factor analysis results
 * @returns Prioritized strategic recommendations
 *
 * @example
 * ```typescript
 * const recommendations = generateSWOTRecommendations(
 *   strengths, weaknesses, opportunities, threats, crossFactors
 * );
 * ```
 */
export declare function generateSWOTRecommendations(strengths: SWOTItem[], weaknesses: SWOTItem[], opportunities: SWOTItem[], threats: SWOTItem[], crossFactors: CrossFactorAnalysis[]): StrategicRecommendation[];
/**
 * Function 4: Create Porter's Five Forces industry analysis
 *
 * Analyzes industry competitive forces: rivalry, new entrants, suppliers,
 * buyers, and substitutes to determine industry attractiveness.
 *
 * @param context - Strategy context
 * @param data - Five forces analysis data
 * @param transaction - Database transaction
 * @returns Created Porter's Five Forces analysis
 *
 * @example
 * ```typescript
 * const analysis = await createPorterFiveForcesAnalysis(context, {
 *   industry: 'Software as a Service',
 *   competitiveRivalry: { intensity: 'high', intensityScore: 8, ... },
 *   // ... other forces
 * });
 * ```
 */
export declare function createPorterFiveForcesAnalysis(context: StrategyContext, data: Partial<PorterFiveForcesAnalysis>, transaction?: Transaction): Promise<PorterFiveForcesAnalysis>;
/**
 * Function 5: Calculate overall industry attractiveness score
 *
 * Aggregates the five forces intensity scores to determine overall
 * industry attractiveness (higher score = more attractive industry).
 *
 * @param forces - Array of force analyses
 * @returns Overall attractiveness score (1-10)
 *
 * @example
 * ```typescript
 * const score = calculateIndustryAttractiveness([
 *   rivalryAnalysis, newEntrantsAnalysis, suppliersAnalysis, buyersAnalysis, substitutesAnalysis
 * ]);
 * // Returns 6.5 (moderately attractive)
 * ```
 */
export declare function calculateIndustryAttractiveness(forces: ForceAnalysis[]): number;
/**
 * Function 6: Create BCG Matrix portfolio analysis
 * Positions business units in BCG Matrix (Stars, Cash Cows, Question Marks, Dogs)
 */
export declare function createBCGMatrixAnalysis(context: StrategyContext, data: Partial<BCGMatrixAnalysis>, transaction?: Transaction): Promise<BCGMatrixAnalysis>;
/**
 * Function 7: Determine BCG Matrix position
 * Classifies business unit into Stars, Cash Cows, Question Marks, or Dogs
 */
export declare function determineBCGPosition(marketGrowthRate: number, relativeMarketShare: number): StrategicPosition;
/**
 * Function 8: Get BCG strategy recommendation
 * Returns appropriate strategy based on BCG position
 */
export declare function getBCGStrategy(unit: BCGBusinessUnit): string;
/**
 * Function 9: Calculate investment priority
 * Determines investment priority based on BCG position and strategic importance
 */
export declare function getInvestmentPriority(unit: BCGBusinessUnit): StrategyPriority;
/**
 * Function 10: Generate portfolio recommendations
 * Creates strategic recommendations for portfolio management
 */
export declare function generatePortfolioRecommendations(units: BCGBusinessUnit[]): PortfolioRecommendation[];
/**
 * Function 11: Calculate resource allocation
 * Determines optimal resource distribution across portfolio
 */
export declare function calculateResourceAllocation(units: BCGBusinessUnit[]): ResourceAllocation[];
/**
 * Function 12: Identify strategic gaps in portfolio
 * Detects portfolio imbalances and risks
 */
export declare function identifyStrategicGaps(units: BCGBusinessUnit[]): string[];
/**
 * Function 13: Create Ansoff Matrix growth analysis
 * Analyzes growth strategies across market/product dimensions
 */
export declare function createAnsoffMatrixAnalysis(context: StrategyContext, data: Partial<AnsoffMatrixAnalysis>, transaction?: Transaction): Promise<AnsoffMatrixAnalysis>;
/**
 * Function 14: Assess Ansoff Matrix risk levels
 * Evaluates risk across all growth strategies
 */
export declare function assessAnsoffRisk(marketPen: GrowthInitiative[], marketDev: GrowthInitiative[], productDev: GrowthInitiative[], diversification: GrowthInitiative[]): StrategyRiskAssessment;
/**
 * Function 15: Create Balanced Scorecard
 * Implements balanced scorecard strategic performance management
 */
export declare function createBalancedScorecard(context: StrategyContext, data: Partial<BalancedScorecard>, transaction?: Transaction): Promise<BalancedScorecard>;
/**
 * Function 16: Build strategy map
 * Creates causal linkages between strategic objectives
 */
export declare function buildStrategyMap(objectives: StrategicObjective[]): StrategyMapNode[];
/**
 * Function 17: Calculate balanced scorecard performance
 * Computes weighted performance scores across perspectives
 */
export declare function calculateBalancedScorecardPerformance(scorecard: BalancedScorecard): number;
/**
 * Function 18: Track BSC measure performance
 * Monitors KPI performance against targets
 */
export declare function trackMeasurePerformance(measure: PerformanceMeasure, actualValue: number): Target;
/**
 * Function 19: Create scenario planning analysis
 * Develops multiple future scenarios for strategic planning
 */
export declare function createScenarioPlanningAnalysis(context: StrategyContext, data: Partial<ScenarioPlanningAnalysis>, transaction?: Transaction): Promise<ScenarioPlanningAnalysis>;
/**
 * Function 20: Generate early warning indicators
 * Creates monitoring indicators for scenario triggers
 */
export declare function generateEarlyWarningIndicators(scenarios: Scenario[]): EarlyWarningIndicator[];
/**
 * Function 21: Generate contingency plans
 * Creates response plans for different scenarios
 */
export declare function generateContingencyPlans(scenarios: Scenario[]): ContingencyPlan[];
/**
 * Function 22: Assess scenario probability
 * Evaluates likelihood of scenario occurrence
 */
export declare function assessScenarioProbability(scenario: Scenario, currentIndicators: EarlyWarningIndicator[]): number;
/**
 * Function 23: Create value chain analysis
 * Analyzes primary and support activities for competitive advantage
 */
export declare function createValueChainAnalysis(context: StrategyContext, data: Partial<ValueChainAnalysis>, transaction?: Transaction): Promise<ValueChainAnalysis>;
/**
 * Function 24: Identify cost drivers
 * Finds key cost drivers in value chain activities
 */
export declare function identifyCostDrivers(primary: ValueActivity[], support: ValueActivity[]): CostDriver[];
/**
 * Function 25: Identify value drivers
 * Finds key value creation drivers in value chain
 */
export declare function identifyValueDrivers(primary: ValueActivity[], support: ValueActivity[]): ValueDriver[];
/**
 * Function 26: Identify competitive advantages
 * Detects sources of competitive advantage in value chain
 */
export declare function identifyCompetitiveAdvantages(activities: ValueActivity[]): CompetitiveAdvantage[];
/**
 * Function 27: Calculate value chain margin
 * Computes total margin from value chain activities
 */
export declare function calculateValueChainMargin(analysis: ValueChainAnalysis): number;
/**
 * Function 28: Benchmark value chain activities
 * Compares activities against industry benchmarks
 */
export declare function benchmarkValueChainActivities(activities: ValueActivity[], benchmarks: Record<string, number>): Array<{
    activity: string;
    gap: number;
}>;
/**
 * Function 29: Generate strategic roadmap
 * Creates multi-year strategic implementation roadmap
 */
export declare function generateStrategicRoadmap(initiatives: Initiative[], timeHorizon: number): Array<{
    year: number;
    initiatives: Initiative[];
}>;
/**
 * Function 30: Perform stakeholder analysis
 * Maps and analyzes key stakeholders
 */
export declare function performStakeholderAnalysis(stakeholders: Array<{
    name: string;
    power: number;
    interest: number;
}>): Array<{
    name: string;
    quadrant: string;
    strategy: string;
}>;
/**
 * Function 31: Calculate strategic fit score
 * Assesses alignment between initiative and strategy
 */
export declare function calculateStrategicFitScore(initiative: GrowthInitiative, strategicObjectives: StrategicObjective[]): number;
/**
 * Function 32: Optimize portfolio allocation
 * Uses efficient frontier to optimize portfolio mix
 */
export declare function optimizePortfolioAllocation(units: BCGBusinessUnit[], constraints: {
    maxRisk: number;
    minReturn: number;
}): ResourceAllocation[];
/**
 * Function 33: Conduct PESTEL analysis
 * Analyzes Political, Economic, Social, Technological, Environmental, Legal factors
 */
export declare function conductPESTELAnalysis(factors: Record<string, Array<{
    factor: string;
    impact: number;
}>>): {
    category: string;
    totalImpact: number;
    keyFactors: string[];
}[];
/**
 * Function 34: Analyze core competencies
 * Identifies and evaluates organizational core competencies
 */
export declare function analyzeCoreCompetencies(competencies: Array<{
    name: string;
    valuable: boolean;
    rare: boolean;
    inimitable: boolean;
    organized: boolean;
}>): Array<{
    name: string;
    isCoreCompetency: boolean;
    sustainableAdvantage: boolean;
}>;
/**
 * Function 35: Calculate market attractiveness
 * Evaluates market attractiveness using multiple factors
 */
export declare function calculateMarketAttractiveness(market: {
    size: number;
    growth: number;
    profitability: number;
    competitiveIntensity: number;
    barriers: number;
}): number;
/**
 * Function 36: Perform gap analysis
 * Identifies gaps between current and desired state
 */
export declare function performGapAnalysis(currentState: Record<string, number>, desiredState: Record<string, number>): Array<{
    dimension: string;
    gap: number;
    priority: StrategyPriority;
}>;
/**
 * Function 37: Simulate strategic scenarios
 * Runs Monte Carlo simulation for strategic outcomes
 */
export declare function simulateStrategicScenarios(initiative: GrowthInitiative, iterations?: number): {
    meanROI: number;
    stdDev: number;
    successProbability: number;
};
/**
 * Function 38: Prioritize strategic initiatives
 * Ranks initiatives using multi-criteria decision analysis
 */
export declare function prioritizeStrategicInitiatives(initiatives: Initiative[], criteria: {
    impact: number;
    feasibility: number;
    urgency: number;
    alignment: number;
}): Initiative[];
/**
 * Function 39: Track strategic KPIs
 * Monitors key performance indicators for strategic initiatives
 */
export declare function trackStrategicKPIs(kpis: Array<{
    name: string;
    current: number;
    target: number;
    weight: number;
}>): {
    overallProgress: number;
    atRiskKPIs: string[];
};
/**
 * Function 40: Generate strategy execution dashboard
 * Creates comprehensive dashboard metrics for strategy tracking
 */
export declare function generateStrategyExecutionDashboard(scorecard: BalancedScorecard, initiatives: Initiative[]): {
    overallHealth: number;
    perspectiveHealth: Record<string, number>;
    initiativeProgress: number;
    atRiskCount: number;
};
/**
 * Function 41: Analyze strategic dependencies
 * Maps dependencies between strategic initiatives
 */
export declare function analyzeStrategicDependencies(initiatives: Initiative[]): Array<{
    initiative: string;
    blockedBy: string[];
    blocks: string[];
}>;
/**
 * Function 42: Calculate strategic momentum
 * Measures rate of strategic progress
 */
export declare function calculateStrategicMomentum(historicalScores: Array<{
    period: string;
    score: number;
}>): {
    momentum: number;
    trend: 'accelerating' | 'steady' | 'decelerating';
};
/**
 * Function 43: Assess strategic agility
 * Evaluates organization's ability to adapt strategy
 */
export declare function assessStrategicAgility(factors: {
    decisionSpeed: number;
    resourceFlexibility: number;
    innovationCapability: number;
    marketResponsiveness: number;
}): {
    agilityScore: number;
    strengths: string[];
    weaknesses: string[];
};
/**
 * Function 44: Forecast strategic outcomes
 * Projects future outcomes based on current trajectory
 */
export declare function forecastStrategicOutcomes(currentMetrics: Record<string, number>, growthRates: Record<string, number>, periods: number): Array<{
    period: number;
    metrics: Record<string, number>;
}>;
/**
 * Function 45: Generate executive strategy summary
 * Creates C-suite ready strategic summary
 */
export declare function generateExecutiveStrategySummary(swot: SWOTAnalysis, porter: PorterFiveForcesAnalysis, bcg: BCGMatrixAnalysis, scorecard: BalancedScorecard): {
    strategicPosition: string;
    keyRecommendations: string[];
    criticalRisks: string[];
    performanceSummary: string;
    nextSteps: string[];
};
declare const _default: {
    createSWOTAnalysis: typeof createSWOTAnalysis;
    generateCrossFactorAnalysis: typeof generateCrossFactorAnalysis;
    generateSWOTRecommendations: typeof generateSWOTRecommendations;
    createPorterFiveForcesAnalysis: typeof createPorterFiveForcesAnalysis;
    calculateIndustryAttractiveness: typeof calculateIndustryAttractiveness;
    createBCGMatrixAnalysis: typeof createBCGMatrixAnalysis;
    determineBCGPosition: typeof determineBCGPosition;
    getBCGStrategy: typeof getBCGStrategy;
    getInvestmentPriority: typeof getInvestmentPriority;
    generatePortfolioRecommendations: typeof generatePortfolioRecommendations;
    calculateResourceAllocation: typeof calculateResourceAllocation;
    identifyStrategicGaps: typeof identifyStrategicGaps;
    createAnsoffMatrixAnalysis: typeof createAnsoffMatrixAnalysis;
    assessAnsoffRisk: typeof assessAnsoffRisk;
    createBalancedScorecard: typeof createBalancedScorecard;
    buildStrategyMap: typeof buildStrategyMap;
    calculateBalancedScorecardPerformance: typeof calculateBalancedScorecardPerformance;
    trackMeasurePerformance: typeof trackMeasurePerformance;
    createScenarioPlanningAnalysis: typeof createScenarioPlanningAnalysis;
    generateEarlyWarningIndicators: typeof generateEarlyWarningIndicators;
    generateContingencyPlans: typeof generateContingencyPlans;
    assessScenarioProbability: typeof assessScenarioProbability;
    createValueChainAnalysis: typeof createValueChainAnalysis;
    identifyCostDrivers: typeof identifyCostDrivers;
    identifyValueDrivers: typeof identifyValueDrivers;
    identifyCompetitiveAdvantages: typeof identifyCompetitiveAdvantages;
    calculateValueChainMargin: typeof calculateValueChainMargin;
    benchmarkValueChainActivities: typeof benchmarkValueChainActivities;
    generateStrategicRoadmap: typeof generateStrategicRoadmap;
    performStakeholderAnalysis: typeof performStakeholderAnalysis;
    calculateStrategicFitScore: typeof calculateStrategicFitScore;
    optimizePortfolioAllocation: typeof optimizePortfolioAllocation;
    conductPESTELAnalysis: typeof conductPESTELAnalysis;
    analyzeCoreCompetencies: typeof analyzeCoreCompetencies;
    calculateMarketAttractiveness: typeof calculateMarketAttractiveness;
    performGapAnalysis: typeof performGapAnalysis;
    simulateStrategicScenarios: typeof simulateStrategicScenarios;
    prioritizeStrategicInitiatives: typeof prioritizeStrategicInitiatives;
    trackStrategicKPIs: typeof trackStrategicKPIs;
    generateStrategyExecutionDashboard: typeof generateStrategyExecutionDashboard;
    analyzeStrategicDependencies: typeof analyzeStrategicDependencies;
    calculateStrategicMomentum: typeof calculateStrategicMomentum;
    assessStrategicAgility: typeof assessStrategicAgility;
    forecastStrategicOutcomes: typeof forecastStrategicOutcomes;
    generateExecutiveStrategySummary: typeof generateExecutiveStrategySummary;
    SWOTAnalysisModel: typeof SWOTAnalysisModel;
    PorterFiveForcesModel: typeof PorterFiveForcesModel;
    BCGMatrixModel: typeof BCGMatrixModel;
    BalancedScorecardModel: typeof BalancedScorecardModel;
};
export default _default;
//# sourceMappingURL=strategic-planning-kit.d.ts.map