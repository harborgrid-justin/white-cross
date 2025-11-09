/**
 * LOC: CONS-SCN-PLN-001
 * File: /reuse/server/consulting/scenario-planning-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable)
 *   - @nestjs/swagger (ApiProperty, ApiResponse)
 *   - class-validator (decorators)
 *   - class-transformer (Type, Transform)
 *
 * DOWNSTREAM (imported by):
 *   - backend/consulting/scenario-planning.service.ts
 *   - backend/consulting/strategic-options.controller.ts
 *   - backend/consulting/war-gaming.service.ts
 */
/**
 * File: /reuse/server/consulting/scenario-planning-kit.ts
 * Locator: WC-CONS-SCNPLN-001
 * Purpose: Enterprise-grade Scenario Planning Kit - scenario development, war gaming, contingency planning, strategic options analysis
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, class-validator 0.14.x, class-transformer 0.5.x
 * Downstream: Consulting services, strategic planning controllers, scenario analysis processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 40 production-ready functions for scenario planning competing with McKinsey, BCG, Bain consulting tools
 *
 * LLM Context: Comprehensive scenario planning utilities for production-ready management consulting applications.
 * Provides scenario development, war gaming, contingency planning, strategic options analysis, uncertainty mapping,
 * scenario matrices, impact assessment, risk scenarios, future state modeling, stress testing, sensitivity analysis,
 * option valuation, decision trees, scenario narratives, and strategic flexibility analysis.
 */
import { Sequelize } from 'sequelize';
/**
 * Scenario type classifications
 */
export declare enum ScenarioType {
    OPTIMISTIC = "optimistic",
    BASELINE = "baseline",
    PESSIMISTIC = "pessimistic",
    WORST_CASE = "worst_case",
    WILDCARD = "wildcard",
    EXPLORATORY = "exploratory"
}
/**
 * Uncertainty levels for scenario variables
 */
export declare enum UncertaintyLevel {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
/**
 * Strategic option types
 */
export declare enum OptionType {
    EXPAND = "expand",
    MAINTAIN = "maintain",
    RETREAT = "retreat",
    PIVOT = "pivot",
    ACQUIRE = "acquire",
    DIVEST = "divest",
    PARTNER = "partner",
    INNOVATE = "innovate"
}
/**
 * Impact severity levels
 */
export declare enum ImpactSeverity {
    NEGLIGIBLE = "negligible",
    MINOR = "minor",
    MODERATE = "moderate",
    MAJOR = "major",
    CATASTROPHIC = "catastrophic"
}
/**
 * War game outcome types
 */
export declare enum WarGameOutcome {
    WIN = "win",
    LOSE = "lose",
    STALEMATE = "stalemate",
    PARTIAL_WIN = "partial_win",
    PYRRHIC_VICTORY = "pyrrhic_victory"
}
/**
 * Contingency trigger types
 */
export declare enum ContingencyTrigger {
    MARKET_SHIFT = "market_shift",
    COMPETITIVE_MOVE = "competitive_move",
    REGULATORY_CHANGE = "regulatory_change",
    TECHNOLOGY_DISRUPTION = "technology_disruption",
    ECONOMIC_EVENT = "economic_event",
    GEOPOLITICAL_EVENT = "geopolitical_event"
}
/**
 * Scenario data interface
 */
export interface ScenarioData {
    scenarioId: string;
    name: string;
    scenarioType: ScenarioType;
    description: string;
    timeHorizon: number;
    probability: number;
    keyAssumptions: string[];
    drivingForces: string[];
    criticalUncertainties: Array<{
        variable: string;
        uncertaintyLevel: UncertaintyLevel;
        range: {
            min: number;
            max: number;
        };
    }>;
    narrative: string;
    indicators: string[];
    status: string;
    createdBy: string;
    metadata: Record<string, any>;
}
/**
 * Strategic option data interface
 */
export interface StrategicOptionData {
    optionId: string;
    scenarioId: string;
    optionType: OptionType;
    name: string;
    description: string;
    investmentRequired: number;
    expectedValue: number;
    upside: number;
    downside: number;
    flexibility: number;
    reversibility: boolean;
    timeToImplement: number;
    dependencies: string[];
    risks: string[];
    benefits: string[];
}
/**
 * War game simulation data
 */
export interface WarGameData {
    gameId: string;
    scenarioId: string;
    gameName: string;
    participants: string[];
    moves: Array<{
        player: string;
        moveType: string;
        description: string;
        timestamp: Date;
    }>;
    outcome: WarGameOutcome;
    insights: string[];
    learnings: string[];
    durationHours: number;
}
/**
 * Impact assessment data
 */
export interface ImpactAssessmentData {
    assessmentId: string;
    scenarioId: string;
    impactArea: string;
    severity: ImpactSeverity;
    financialImpact: number;
    operationalImpact: string;
    strategicImpact: string;
    likelihood: number;
    timeframe: string;
    mitigationActions: string[];
}
/**
 * Contingency plan data
 */
export interface ContingencyPlanData {
    planId: string;
    scenarioId: string;
    triggerType: ContingencyTrigger;
    triggerConditions: string[];
    actions: Array<{
        sequence: number;
        action: string;
        owner: string;
        timeline: string;
        resources: string[];
    }>;
    activationThreshold: string;
    deactivationCriteria: string;
    status: string;
}
/**
 * Scenario matrix cell data
 */
export interface ScenarioMatrixData {
    matrixId: string;
    axis1: {
        name: string;
        states: string[];
    };
    axis2: {
        name: string;
        states: string[];
    };
    cells: Array<{
        position: [number, number];
        scenarioId: string;
        scenarioName: string;
        probability: number;
        attractiveness: number;
    }>;
}
/**
 * Create Scenario DTO
 */
export declare class CreateScenarioDto {
    name: string;
    scenarioType: ScenarioType;
    description: string;
    timeHorizon: number;
    probability: number;
    keyAssumptions: string[];
    drivingForces: string[];
    narrative: string;
    indicators: string[];
    metadata?: Record<string, any>;
}
/**
 * Create Strategic Option DTO
 */
export declare class CreateStrategicOptionDto {
    scenarioId: string;
    name: string;
    optionType: OptionType;
    description: string;
    investmentRequired: number;
    expectedValue: number;
    upside: number;
    downside: number;
    flexibility: number;
    reversibility: boolean;
    timeToImplement: number;
    dependencies: string[];
    risks: string[];
    benefits: string[];
}
/**
 * Create War Game DTO
 */
export declare class CreateWarGameDto {
    scenarioId: string;
    gameName: string;
    participants: string[];
    durationHours: number;
}
/**
 * Create Impact Assessment DTO
 */
export declare class CreateImpactAssessmentDto {
    scenarioId: string;
    impactArea: string;
    severity: ImpactSeverity;
    financialImpact: number;
    operationalImpact: string;
    strategicImpact: string;
    likelihood: number;
    timeframe: string;
    mitigationActions: string[];
}
/**
 * Create Contingency Plan DTO
 */
export declare class CreateContingencyPlanDto {
    scenarioId: string;
    triggerType: ContingencyTrigger;
    triggerConditions: string[];
    activationThreshold: string;
    deactivationCriteria: string;
}
/**
 * Scenario Sequelize model.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     Scenario:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         scenarioId:
 *           type: string
 *         name:
 *           type: string
 *         scenarioType:
 *           type: string
 *           enum: [optimistic, baseline, pessimistic, worst_case, wildcard, exploratory]
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Scenario model
 */
export declare const createScenarioModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        scenarioId: string;
        name: string;
        scenarioType: string;
        description: string;
        timeHorizon: number;
        probability: number;
        keyAssumptions: string[];
        drivingForces: string[];
        criticalUncertainties: any[];
        narrative: string;
        indicators: string[];
        status: string;
        createdBy: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Strategic Option Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} StrategicOption model
 */
export declare const createStrategicOptionModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        optionId: string;
        scenarioId: string;
        optionType: string;
        name: string;
        description: string;
        investmentRequired: number;
        expectedValue: number;
        upside: number;
        downside: number;
        flexibility: number;
        reversibility: boolean;
        timeToImplement: number;
        dependencies: string[];
        risks: string[];
        benefits: string[];
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * War Game Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} WarGame model
 */
export declare const createWarGameModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        gameId: string;
        scenarioId: string;
        gameName: string;
        participants: string[];
        moves: any[];
        outcome: string;
        insights: string[];
        learnings: string[];
        durationHours: number;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Impact Assessment Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ImpactAssessment model
 */
export declare const createImpactAssessmentModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        assessmentId: string;
        scenarioId: string;
        impactArea: string;
        severity: string;
        financialImpact: number;
        operationalImpact: string;
        strategicImpact: string;
        likelihood: number;
        timeframe: string;
        mitigationActions: string[];
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Contingency Plan Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ContingencyPlan model
 */
export declare const createContingencyPlanModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        planId: string;
        scenarioId: string;
        triggerType: string;
        triggerConditions: string[];
        actions: any[];
        activationThreshold: string;
        deactivationCriteria: string;
        status: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new scenario with comprehensive details.
 *
 * @param {Partial<ScenarioData>} data - Scenario data
 * @returns {Promise<ScenarioData>} Created scenario
 *
 * @example
 * ```typescript
 * const scenario = await createScenario({
 *   name: 'Digital Transformation Accelerates',
 *   scenarioType: ScenarioType.OPTIMISTIC,
 *   timeHorizon: 5,
 *   probability: 35,
 *   ...
 * });
 * ```
 */
export declare function createScenario(data: Partial<ScenarioData>): Promise<ScenarioData>;
/**
 * Identifies critical uncertainties for scenario planning.
 *
 * @param {string[]} variables - List of strategic variables
 * @returns {Promise<Array<{ variable: string; uncertaintyLevel: UncertaintyLevel; impactLevel: string }>>} Uncertainty analysis
 *
 * @example
 * ```typescript
 * const uncertainties = await identifyCriticalUncertainties([
 *   'Market growth rate',
 *   'Regulatory environment',
 *   'Technology adoption'
 * ]);
 * ```
 */
export declare function identifyCriticalUncertainties(variables: string[]): Promise<Array<{
    variable: string;
    uncertaintyLevel: UncertaintyLevel;
    impactLevel: string;
}>>;
/**
 * Generates driving forces analysis for scenarios.
 *
 * @param {string} industry - Industry context
 * @param {string} geography - Geographic scope
 * @returns {Promise<Array<{ force: string; category: string; strength: number; trend: string }>>} Driving forces
 *
 * @example
 * ```typescript
 * const forces = await generateDrivingForces('healthcare', 'North America');
 * ```
 */
export declare function generateDrivingForces(industry: string, geography: string): Promise<Array<{
    force: string;
    category: string;
    strength: number;
    trend: string;
}>>;
/**
 * Creates scenario matrix with two axes of uncertainty.
 *
 * @param {string} axis1Name - First axis name
 * @param {string[]} axis1States - First axis states
 * @param {string} axis2Name - Second axis name
 * @param {string[]} axis2States - Second axis states
 * @returns {Promise<ScenarioMatrixData>} Scenario matrix
 *
 * @example
 * ```typescript
 * const matrix = await createScenarioMatrix(
 *   'Market Growth', ['Low', 'High'],
 *   'Competition', ['Fragmented', 'Consolidated']
 * );
 * ```
 */
export declare function createScenarioMatrix(axis1Name: string, axis1States: string[], axis2Name: string, axis2States: string[]): Promise<ScenarioMatrixData>;
/**
 * Develops detailed scenario narratives from key drivers.
 *
 * @param {string} scenarioId - Scenario identifier
 * @param {string[]} drivingForces - Key driving forces
 * @param {number} timeHorizon - Planning time horizon
 * @returns {Promise<string>} Scenario narrative
 *
 * @example
 * ```typescript
 * const narrative = await developScenarioNarrative('SCN-001', forces, 5);
 * ```
 */
export declare function developScenarioNarrative(scenarioId: string, drivingForces: string[], timeHorizon: number): Promise<string>;
/**
 * Identifies leading indicators for scenario monitoring.
 *
 * @param {string} scenarioId - Scenario identifier
 * @param {string[]} keyAssumptions - Key scenario assumptions
 * @returns {Promise<Array<{ indicator: string; metric: string; threshold: number; frequency: string }>>} Leading indicators
 *
 * @example
 * ```typescript
 * const indicators = await identifyLeadingIndicators('SCN-001', assumptions);
 * ```
 */
export declare function identifyLeadingIndicators(scenarioId: string, keyAssumptions: string[]): Promise<Array<{
    indicator: string;
    metric: string;
    threshold: number;
    frequency: string;
}>>;
/**
 * Assesses scenario plausibility based on multiple factors.
 *
 * @param {ScenarioData} scenario - Scenario to assess
 * @returns {Promise<{ plausibilityScore: number; strengths: string[]; weaknesses: string[]; confidence: string }>} Plausibility assessment
 *
 * @example
 * ```typescript
 * const assessment = await assessScenarioPlausibility(scenario);
 * ```
 */
export declare function assessScenarioPlausibility(scenario: ScenarioData): Promise<{
    plausibilityScore: number;
    strengths: string[];
    weaknesses: string[];
    confidence: string;
}>;
/**
 * Generates scenario divergence analysis showing differences from baseline.
 *
 * @param {ScenarioData} scenario - Target scenario
 * @param {ScenarioData} baseline - Baseline scenario
 * @returns {Promise<Array<{ dimension: string; baselineValue: number; scenarioValue: number; divergence: number }>>} Divergence analysis
 *
 * @example
 * ```typescript
 * const divergence = await analyzeScenarioDivergence(optimistic, baseline);
 * ```
 */
export declare function analyzeScenarioDivergence(scenario: ScenarioData, baseline: ScenarioData): Promise<Array<{
    dimension: string;
    baselineValue: number;
    scenarioValue: number;
    divergence: number;
}>>;
/**
 * Maps scenario interdependencies and cascade effects.
 *
 * @param {ScenarioData[]} scenarios - Array of scenarios
 * @returns {Promise<Array<{ source: string; target: string; relationship: string; strength: number }>>} Interdependency map
 *
 * @example
 * ```typescript
 * const dependencies = await mapScenarioInterdependencies(scenarios);
 * ```
 */
export declare function mapScenarioInterdependencies(scenarios: ScenarioData[]): Promise<Array<{
    source: string;
    target: string;
    relationship: string;
    strength: number;
}>>;
/**
 * Validates scenario consistency and internal logic.
 *
 * @param {ScenarioData} scenario - Scenario to validate
 * @returns {Promise<{ isValid: boolean; issues: string[]; recommendations: string[] }>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateScenarioConsistency(scenario);
 * ```
 */
export declare function validateScenarioConsistency(scenario: ScenarioData): Promise<{
    isValid: boolean;
    issues: string[];
    recommendations: string[];
}>;
/**
 * Initializes a war game simulation.
 *
 * @param {Partial<WarGameData>} data - War game data
 * @returns {Promise<WarGameData>} Initialized war game
 *
 * @example
 * ```typescript
 * const game = await initializeWarGame({
 *   scenarioId: 'SCN-001',
 *   gameName: 'Market Entry War Game',
 *   participants: ['Team A', 'Team B'],
 *   durationHours: 4
 * });
 * ```
 */
export declare function initializeWarGame(data: Partial<WarGameData>): Promise<WarGameData>;
/**
 * Records a war game move.
 *
 * @param {string} gameId - Game identifier
 * @param {string} player - Player name
 * @param {string} moveType - Type of move
 * @param {string} description - Move description
 * @returns {Promise<{ moveId: string; timestamp: Date; success: boolean }>} Move result
 *
 * @example
 * ```typescript
 * const move = await recordWarGameMove('WAR-001', 'Team A', 'price_cut', 'Reduce prices by 15%');
 * ```
 */
export declare function recordWarGameMove(gameId: string, player: string, moveType: string, description: string): Promise<{
    moveId: string;
    timestamp: Date;
    success: boolean;
}>;
/**
 * Analyzes war game competitive dynamics.
 *
 * @param {WarGameData} game - War game data
 * @returns {Promise<{ competitiveIntensity: number; keyPatterns: string[]; turningPoints: string[] }>} Dynamic analysis
 *
 * @example
 * ```typescript
 * const dynamics = await analyzeWarGameDynamics(game);
 * ```
 */
export declare function analyzeWarGameDynamics(game: WarGameData): Promise<{
    competitiveIntensity: number;
    keyPatterns: string[];
    turningPoints: string[];
}>;
/**
 * Extracts strategic insights from war game results.
 *
 * @param {WarGameData} game - Completed war game
 * @returns {Promise<Array<{ insight: string; category: string; priority: string }>>} Strategic insights
 *
 * @example
 * ```typescript
 * const insights = await extractWarGameInsights(game);
 * ```
 */
export declare function extractWarGameInsights(game: WarGameData): Promise<Array<{
    insight: string;
    category: string;
    priority: string;
}>>;
/**
 * Generates war game debrief report.
 *
 * @param {WarGameData} game - Completed war game
 * @returns {Promise<{ summary: string; outcomes: any; recommendations: string[] }>} Debrief report
 *
 * @example
 * ```typescript
 * const debrief = await generateWarGameDebrief(game);
 * ```
 */
export declare function generateWarGameDebrief(game: WarGameData): Promise<{
    summary: string;
    outcomes: any;
    recommendations: string[];
}>;
/**
 * Creates a strategic option.
 *
 * @param {Partial<StrategicOptionData>} data - Option data
 * @returns {Promise<StrategicOptionData>} Created option
 *
 * @example
 * ```typescript
 * const option = await createStrategicOption({
 *   scenarioId: 'SCN-001',
 *   optionType: OptionType.EXPAND,
 *   name: 'Accelerated Growth',
 *   ...
 * });
 * ```
 */
export declare function createStrategicOption(data: Partial<StrategicOptionData>): Promise<StrategicOptionData>;
/**
 * Evaluates option value using real options analysis.
 *
 * @param {StrategicOptionData} option - Strategic option
 * @param {number} volatility - Market volatility
 * @returns {Promise<{ optionValue: number; impliedROI: number; valueBreakdown: any }>} Option valuation
 *
 * @example
 * ```typescript
 * const valuation = await evaluateOptionValue(option, 0.25);
 * ```
 */
export declare function evaluateOptionValue(option: StrategicOptionData, volatility: number): Promise<{
    optionValue: number;
    impliedROI: number;
    valueBreakdown: any;
}>;
/**
 * Analyzes option flexibility and reversibility.
 *
 * @param {StrategicOptionData} option - Strategic option
 * @returns {Promise<{ flexibilityScore: number; reversibilityCost: number; adaptability: string }>} Flexibility analysis
 *
 * @example
 * ```typescript
 * const flexibility = await analyzeOptionFlexibility(option);
 * ```
 */
export declare function analyzeOptionFlexibility(option: StrategicOptionData): Promise<{
    flexibilityScore: number;
    reversibilityCost: number;
    adaptability: string;
}>;
/**
 * Compares multiple strategic options.
 *
 * @param {StrategicOptionData[]} options - Array of options
 * @param {string[]} criteria - Comparison criteria
 * @returns {Promise<Array<{ optionId: string; scores: Record<string, number>; rank: number }>>} Option comparison
 *
 * @example
 * ```typescript
 * const comparison = await compareStrategicOptions(options, ['ROI', 'Risk', 'Speed']);
 * ```
 */
export declare function compareStrategicOptions(options: StrategicOptionData[], criteria: string[]): Promise<Array<{
    optionId: string;
    scores: Record<string, number>;
    rank: number;
}>>;
/**
 * Generates decision tree for option selection.
 *
 * @param {StrategicOptionData[]} options - Available options
 * @param {string[]} decisionPoints - Key decision points
 * @returns {Promise<{ tree: any; optimalPath: string[]; expectedValue: number }>} Decision tree
 *
 * @example
 * ```typescript
 * const tree = await generateOptionDecisionTree(options, decisionPoints);
 * ```
 */
export declare function generateOptionDecisionTree(options: StrategicOptionData[], decisionPoints: string[]): Promise<{
    tree: any;
    optimalPath: string[];
    expectedValue: number;
}>;
/**
 * Assesses option implementation risks.
 *
 * @param {StrategicOptionData} option - Strategic option
 * @returns {Promise<{ overallRisk: string; riskFactors: Array<{ factor: string; severity: string; mitigation: string }> }>} Risk assessment
 *
 * @example
 * ```typescript
 * const risks = await assessOptionRisks(option);
 * ```
 */
export declare function assessOptionRisks(option: StrategicOptionData): Promise<{
    overallRisk: string;
    riskFactors: Array<{
        factor: string;
        severity: string;
        mitigation: string;
    }>;
}>;
/**
 * Calculates option breakeven point.
 *
 * @param {StrategicOptionData} option - Strategic option
 * @param {number} annualBenefit - Expected annual benefit
 * @returns {Promise<{ breakEvenMonths: number; cumulativeBenefit: number[]; paybackPeriod: number }>} Breakeven analysis
 *
 * @example
 * ```typescript
 * const breakeven = await calculateOptionBreakeven(option, 500000);
 * ```
 */
export declare function calculateOptionBreakeven(option: StrategicOptionData, annualBenefit: number): Promise<{
    breakEvenMonths: number;
    cumulativeBenefit: number[];
    paybackPeriod: number;
}>;
/**
 * Prioritizes options using multi-criteria analysis.
 *
 * @param {StrategicOptionData[]} options - Array of options
 * @param {Record<string, number>} criteriaWeights - Criteria weights
 * @returns {Promise<Array<{ optionId: string; weightedScore: number; rank: number }>>} Prioritization
 *
 * @example
 * ```typescript
 * const priority = await prioritizeOptions(options, { ROI: 0.4, Risk: 0.3, Speed: 0.3 });
 * ```
 */
export declare function prioritizeOptions(options: StrategicOptionData[], criteriaWeights: Record<string, number>): Promise<Array<{
    optionId: string;
    weightedScore: number;
    rank: number;
}>>;
/**
 * Simulates option outcomes using Monte Carlo.
 *
 * @param {StrategicOptionData} option - Strategic option
 * @param {number} iterations - Number of simulations
 * @returns {Promise<{ meanValue: number; stdDev: number; percentiles: Record<string, number>; distribution: number[] }>} Simulation results
 *
 * @example
 * ```typescript
 * const simulation = await simulateOptionOutcomes(option, 10000);
 * ```
 */
export declare function simulateOptionOutcomes(option: StrategicOptionData, iterations: number): Promise<{
    meanValue: number;
    stdDev: number;
    percentiles: Record<string, number>;
    distribution: number[];
}>;
/**
 * Generates option recommendation report.
 *
 * @param {StrategicOptionData[]} options - Array of options
 * @param {string} scenarioId - Scenario context
 * @returns {Promise<{ recommended: string; rationale: string; alternatives: string[]; implementation: any }>} Recommendation
 *
 * @example
 * ```typescript
 * const recommendation = await generateOptionRecommendation(options, 'SCN-001');
 * ```
 */
export declare function generateOptionRecommendation(options: StrategicOptionData[], scenarioId: string): Promise<{
    recommended: string;
    rationale: string;
    alternatives: string[];
    implementation: any;
}>;
/**
 * Creates a contingency plan.
 *
 * @param {Partial<ContingencyPlanData>} data - Contingency plan data
 * @returns {Promise<ContingencyPlanData>} Created contingency plan
 *
 * @example
 * ```typescript
 * const plan = await createContingencyPlan({
 *   scenarioId: 'SCN-001',
 *   triggerType: ContingencyTrigger.MARKET_SHIFT,
 *   ...
 * });
 * ```
 */
export declare function createContingencyPlan(data: Partial<ContingencyPlanData>): Promise<ContingencyPlanData>;
/**
 * Monitors trigger conditions for contingency activation.
 *
 * @param {ContingencyPlanData} plan - Contingency plan
 * @param {Record<string, any>} currentMetrics - Current metric values
 * @returns {Promise<{ shouldActivate: boolean; triggeredConditions: string[]; confidence: number }>} Monitoring result
 *
 * @example
 * ```typescript
 * const monitoring = await monitorContingencyTriggers(plan, metrics);
 * ```
 */
export declare function monitorContingencyTriggers(plan: ContingencyPlanData, currentMetrics: Record<string, any>): Promise<{
    shouldActivate: boolean;
    triggeredConditions: string[];
    confidence: number;
}>;
/**
 * Activates a contingency plan.
 *
 * @param {string} planId - Plan identifier
 * @param {string} activatedBy - User activating the plan
 * @returns {Promise<{ activationId: string; timestamp: Date; initialActions: string[] }>} Activation result
 *
 * @example
 * ```typescript
 * const activation = await activateContingencyPlan('CONT-001', 'john@example.com');
 * ```
 */
export declare function activateContingencyPlan(planId: string, activatedBy: string): Promise<{
    activationId: string;
    timestamp: Date;
    initialActions: string[];
}>;
/**
 * Tracks contingency plan execution.
 *
 * @param {string} planId - Plan identifier
 * @returns {Promise<{ completedActions: number; totalActions: number; status: string; blockers: string[] }>} Execution status
 *
 * @example
 * ```typescript
 * const status = await trackContingencyExecution('CONT-001');
 * ```
 */
export declare function trackContingencyExecution(planId: string): Promise<{
    completedActions: number;
    totalActions: number;
    status: string;
    blockers: string[];
}>;
/**
 * Evaluates contingency plan effectiveness.
 *
 * @param {string} planId - Plan identifier
 * @param {Record<string, any>} outcomes - Plan outcomes
 * @returns {Promise<{ effectiveness: number; lessons: string[]; recommendations: string[] }>} Effectiveness evaluation
 *
 * @example
 * ```typescript
 * const evaluation = await evaluateContingencyEffectiveness('CONT-001', outcomes);
 * ```
 */
export declare function evaluateContingencyEffectiveness(planId: string, outcomes: Record<string, any>): Promise<{
    effectiveness: number;
    lessons: string[];
    recommendations: string[];
}>;
/**
 * Creates an impact assessment.
 *
 * @param {Partial<ImpactAssessmentData>} data - Impact assessment data
 * @returns {Promise<ImpactAssessmentData>} Created assessment
 *
 * @example
 * ```typescript
 * const assessment = await createImpactAssessment({
 *   scenarioId: 'SCN-001',
 *   impactArea: 'Revenue',
 *   severity: ImpactSeverity.MAJOR,
 *   ...
 * });
 * ```
 */
export declare function createImpactAssessment(data: Partial<ImpactAssessmentData>): Promise<ImpactAssessmentData>;
/**
 * Calculates risk-adjusted impact value.
 *
 * @param {ImpactAssessmentData} assessment - Impact assessment
 * @returns {Promise<{ riskAdjustedImpact: number; expectedLoss: number; maxExposure: number }>} Risk-adjusted values
 *
 * @example
 * ```typescript
 * const adjusted = await calculateRiskAdjustedImpact(assessment);
 * ```
 */
export declare function calculateRiskAdjustedImpact(assessment: ImpactAssessmentData): Promise<{
    riskAdjustedImpact: number;
    expectedLoss: number;
    maxExposure: number;
}>;
/**
 * Generates impact heatmap across scenarios.
 *
 * @param {ImpactAssessmentData[]} assessments - Array of assessments
 * @returns {Promise<Array<{ area: string; severity: string; likelihood: number; priority: number }>>} Impact heatmap
 *
 * @example
 * ```typescript
 * const heatmap = await generateImpactHeatmap(assessments);
 * ```
 */
export declare function generateImpactHeatmap(assessments: ImpactAssessmentData[]): Promise<Array<{
    area: string;
    severity: string;
    likelihood: number;
    priority: number;
}>>;
/**
 * Prioritizes mitigation actions based on impact.
 *
 * @param {ImpactAssessmentData[]} assessments - Array of assessments
 * @returns {Promise<Array<{ action: string; impactArea: string; priority: string; urgency: string }>>} Prioritized actions
 *
 * @example
 * ```typescript
 * const actions = await prioritizeMitigationActions(assessments);
 * ```
 */
export declare function prioritizeMitigationActions(assessments: ImpactAssessmentData[]): Promise<Array<{
    action: string;
    impactArea: string;
    priority: string;
    urgency: string;
}>>;
/**
 * Tracks impact realization over time.
 *
 * @param {string} scenarioId - Scenario identifier
 * @param {ImpactAssessmentData[]} assessments - Impact assessments
 * @returns {Promise<{ timeline: Array<{ period: string; realizedImpact: number; variance: number }> }>} Impact tracking
 *
 * @example
 * ```typescript
 * const tracking = await trackImpactRealization('SCN-001', assessments);
 * ```
 */
export declare function trackImpactRealization(scenarioId: string, assessments: ImpactAssessmentData[]): Promise<{
    timeline: Array<{
        period: string;
        realizedImpact: number;
        variance: number;
    }>;
}>;
/**
 * Performs sensitivity analysis on scenario variables.
 *
 * @param {ScenarioData} scenario - Scenario to analyze
 * @param {string[]} variables - Variables to test
 * @returns {Promise<Array<{ variable: string; sensitivity: number; impactRange: [number, number] }>>} Sensitivity analysis
 *
 * @example
 * ```typescript
 * const sensitivity = await performSensitivityAnalysis(scenario, variables);
 * ```
 */
export declare function performSensitivityAnalysis(scenario: ScenarioData, variables: string[]): Promise<Array<{
    variable: string;
    sensitivity: number;
    impactRange: [number, number];
}>>;
/**
 * Maps uncertainty ranges for key variables.
 *
 * @param {Array<{ variable: string; min: number; max: number; most_likely: number }>} variables - Variable ranges
 * @returns {Promise<Array<{ variable: string; range: number; coefficient: number; confidence: string }>>} Uncertainty map
 *
 * @example
 * ```typescript
 * const map = await mapUncertaintyRanges(variables);
 * ```
 */
export declare function mapUncertaintyRanges(variables: Array<{
    variable: string;
    min: number;
    max: number;
    most_likely: number;
}>): Promise<Array<{
    variable: string;
    range: number;
    coefficient: number;
    confidence: string;
}>>;
/**
 * Generates tornado diagram data for sensitivity.
 *
 * @param {ScenarioData} scenario - Scenario
 * @param {string[]} variables - Variables to analyze
 * @returns {Promise<Array<{ variable: string; low: number; high: number; baseline: number }>>} Tornado data
 *
 * @example
 * ```typescript
 * const tornado = await generateTornadoDiagram(scenario, variables);
 * ```
 */
export declare function generateTornadoDiagram(scenario: ScenarioData, variables: string[]): Promise<Array<{
    variable: string;
    low: number;
    high: number;
    baseline: number;
}>>;
/**
 * Calculates scenario variance and standard deviation.
 *
 * @param {ScenarioData[]} scenarios - Array of scenarios
 * @param {string} metric - Metric to analyze
 * @returns {Promise<{ mean: number; variance: number; stdDev: number; range: [number, number] }>} Statistical analysis
 *
 * @example
 * ```typescript
 * const stats = await calculateScenarioVariance(scenarios, 'revenue');
 * ```
 */
export declare function calculateScenarioVariance(scenarios: ScenarioData[], metric: string): Promise<{
    mean: number;
    variance: number;
    stdDev: number;
    range: [number, number];
}>;
/**
 * Generates scenario stress testing results.
 *
 * @param {ScenarioData} scenario - Scenario to stress test
 * @param {Array<{ variable: string; stress: number }>} stressTests - Stress test parameters
 * @returns {Promise<{ breakingPoint: string; resilience: number; vulnerabilities: string[] }>} Stress test results
 *
 * @example
 * ```typescript
 * const stress = await generateStressTestResults(scenario, tests);
 * ```
 */
export declare function generateStressTestResults(scenario: ScenarioData, stressTests: Array<{
    variable: string;
    stress: number;
}>): Promise<{
    breakingPoint: string;
    resilience: number;
    vulnerabilities: string[];
}>;
//# sourceMappingURL=scenario-planning-kit.d.ts.map