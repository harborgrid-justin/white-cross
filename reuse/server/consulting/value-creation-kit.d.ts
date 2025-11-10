/**
 * LOC: CONS-VAL-CRE-001
 * File: /reuse/server/consulting/value-creation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable)
 *   - @nestjs/swagger (ApiProperty, ApiResponse)
 *   - class-validator (decorators)
 *   - class-transformer (Type, Transform)
 *
 * DOWNSTREAM (imported by):
 *   - backend/consulting/value-creation.service.ts
 *   - backend/consulting/shareholder-value.controller.ts
 *   - backend/consulting/economic-profit.service.ts
 */
/**
 * File: /reuse/server/consulting/value-creation-kit.ts
 * Locator: WC-CONS-VALCRE-001
 * Purpose: Enterprise-grade Value Creation Kit - value driver trees, value chain analysis, economic profit, shareholder value
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, class-validator 0.14.x, class-transformer 0.5.x
 * Downstream: Consulting services, value creation controllers, financial analysis processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 35 production-ready functions for value creation competing with McKinsey, BCG, Bain consulting tools
 *
 * LLM Context: Comprehensive value creation utilities for production-ready management consulting applications.
 * Provides value driver trees, value chain analysis, economic profit calculation, shareholder value analysis,
 * value capture strategies, value creation initiatives, ROIC analysis, EVA calculation, value migration,
 * and strategic value assessment.
 */
import { Sequelize } from 'sequelize';
/**
 * Value driver types
 */
export declare enum ValueDriverType {
    REVENUE_GROWTH = "revenue_growth",
    MARGIN_EXPANSION = "margin_expansion",
    CAPITAL_EFFICIENCY = "capital_efficiency",
    COST_REDUCTION = "cost_reduction",
    ASSET_PRODUCTIVITY = "asset_productivity",
    RISK_REDUCTION = "risk_reduction"
}
/**
 * Value chain activities
 */
export declare enum ValueChainActivity {
    INBOUND_LOGISTICS = "inbound_logistics",
    OPERATIONS = "operations",
    OUTBOUND_LOGISTICS = "outbound_logistics",
    MARKETING_SALES = "marketing_sales",
    SERVICE = "service",
    INFRASTRUCTURE = "infrastructure",
    HR_MANAGEMENT = "hr_management",
    TECHNOLOGY = "technology",
    PROCUREMENT = "procurement"
}
/**
 * Value capture mechanisms
 */
export declare enum ValueCaptureMechanism {
    PRICING_POWER = "pricing_power",
    COST_LEADERSHIP = "cost_leadership",
    DIFFERENTIATION = "differentiation",
    NETWORK_EFFECTS = "network_effects",
    SWITCHING_COSTS = "switching_costs",
    SCALE_ECONOMIES = "scale_economies"
}
/**
 * Economic profit components
 */
export declare enum EPComponent {
    NOPAT = "nopat",
    INVESTED_CAPITAL = "invested_capital",
    WACC = "wacc",
    CAPITAL_CHARGE = "capital_charge"
}
/**
 * Value creation initiative types
 */
export declare enum InitiativeType {
    GROWTH = "growth",
    PRODUCTIVITY = "productivity",
    CAPITAL = "capital",
    INNOVATION = "innovation",
    TRANSFORMATION = "transformation"
}
/**
 * ROIC improvement levers
 */
export declare enum ROICLever {
    MARGIN_IMPROVEMENT = "margin_improvement",
    REVENUE_GROWTH = "revenue_growth",
    WORKING_CAPITAL = "working_capital",
    FIXED_ASSETS = "fixed_assets",
    TAX_EFFICIENCY = "tax_efficiency"
}
/**
 * Value driver tree data
 */
export interface ValueDriverTreeData {
    treeId: string;
    rootMetric: string;
    drivers: Array<{
        level: number;
        driverId: string;
        name: string;
        parentId: string | null;
        currentValue: number;
        targetValue: number;
        impact: number;
        unit: string;
    }>;
    totalValuePotential: number;
    sensitivity: Record<string, number>;
}
/**
 * Value chain analysis data
 */
export interface ValueChainAnalysisData {
    analysisId: string;
    organizationId: string;
    activities: Array<{
        activity: ValueChainActivity;
        costPercentage: number;
        valueContribution: number;
        competitivePosition: string;
        improvementOpportunities: string[];
    }>;
    totalCost: number;
    valueMargin: number;
    competitiveAdvantages: string[];
}
/**
 * Economic profit data
 */
export interface EconomicProfitData {
    calculationId: string;
    period: string;
    revenue: number;
    operatingCosts: number;
    ebit: number;
    taxes: number;
    nopat: number;
    investedCapital: number;
    wacc: number;
    capitalCharge: number;
    economicProfit: number;
    roic: number;
    spread: number;
}
/**
 * Shareholder value data
 */
export interface ShareholderValueData {
    valueId: string;
    organizationId: string;
    enterpriseValue: number;
    equityValue: number;
    netDebt: number;
    sharesOutstanding: number;
    valuePerShare: number;
    fcf: number;
    discountRate: number;
    terminalValue: number;
    pvFutureCashFlows: number;
}
/**
 * Value creation initiative data
 */
export interface ValueCreationInitiativeData {
    initiativeId: string;
    name: string;
    initiativeType: InitiativeType;
    description: string;
    expectedValue: number;
    investmentRequired: number;
    roi: number;
    paybackPeriod: number;
    npv: number;
    irr: number;
    risks: string[];
    milestones: Array<{
        milestone: string;
        targetDate: Date;
        valueContribution: number;
    }>;
}
/**
 * ROIC analysis data
 */
export interface ROICAnalysisData {
    analysisId: string;
    roic: number;
    wacc: number;
    spread: number;
    nopat: number;
    investedCapital: number;
    levers: Array<{
        lever: ROICLever;
        currentImpact: number;
        potentialImpact: number;
        improvement: number;
    }>;
    targetROIC: number;
}
/**
 * Create Value Driver Tree DTO
 */
export declare class CreateValueDriverTreeDto {
    rootMetric: string;
    totalValuePotential: number;
}
/**
 * Create Value Chain Analysis DTO
 */
export declare class CreateValueChainAnalysisDto {
    organizationId: string;
    totalCost: number;
    valueMargin: number;
}
/**
 * Create Economic Profit DTO
 */
export declare class CreateEconomicProfitDto {
    period: string;
    revenue: number;
    operatingCosts: number;
    taxRate: number;
    investedCapital: number;
    wacc: number;
}
/**
 * Create Shareholder Value DTO
 */
export declare class CreateShareholderValueDto {
    organizationId: string;
    netDebt: number;
    sharesOutstanding: number;
    fcf: number;
    discountRate: number;
}
/**
 * Create Value Creation Initiative DTO
 */
export declare class CreateValueCreationInitiativeDto {
    name: string;
    initiativeType: InitiativeType;
    description: string;
    expectedValue: number;
    investmentRequired: number;
    risks: string[];
}
/**
 * Create ROIC Analysis DTO
 */
export declare class CreateROICAnalysisDto {
    nopat: number;
    investedCapital: number;
    wacc: number;
    targetROIC: number;
}
/**
 * Value Driver Tree Sequelize model.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     ValueDriverTree:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         treeId:
 *           type: string
 *         rootMetric:
 *           type: string
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ValueDriverTree model
 */
export declare const createValueDriverTreeModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        treeId: string;
        rootMetric: string;
        drivers: any[];
        totalValuePotential: number;
        sensitivity: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Value Chain Analysis Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ValueChainAnalysis model
 */
export declare const createValueChainAnalysisModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        analysisId: string;
        organizationId: string;
        activities: any[];
        totalCost: number;
        valueMargin: number;
        competitiveAdvantages: string[];
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Economic Profit Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EconomicProfit model
 */
export declare const createEconomicProfitModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        calculationId: string;
        period: string;
        revenue: number;
        operatingCosts: number;
        ebit: number;
        taxes: number;
        nopat: number;
        investedCapital: number;
        wacc: number;
        capitalCharge: number;
        economicProfit: number;
        roic: number;
        spread: number;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Shareholder Value Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ShareholderValue model
 */
export declare const createShareholderValueModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        valueId: string;
        organizationId: string;
        enterpriseValue: number;
        equityValue: number;
        netDebt: number;
        sharesOutstanding: number;
        valuePerShare: number;
        fcf: number;
        discountRate: number;
        terminalValue: number;
        pvFutureCashFlows: number;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Value Creation Initiative Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ValueCreationInitiative model
 */
export declare const createValueCreationInitiativeModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        initiativeId: string;
        name: string;
        initiativeType: string;
        description: string;
        expectedValue: number;
        investmentRequired: number;
        roi: number;
        paybackPeriod: number;
        npv: number;
        irr: number;
        risks: string[];
        milestones: any[];
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * ROIC Analysis Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ROICAnalysis model
 */
export declare const createROICAnalysisModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        analysisId: string;
        roic: number;
        wacc: number;
        spread: number;
        nopat: number;
        investedCapital: number;
        levers: any[];
        targetROIC: number;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates value driver tree.
 *
 * @param {Partial<ValueDriverTreeData>} data - Tree data
 * @returns {Promise<ValueDriverTreeData>} Value driver tree
 *
 * @example
 * ```typescript
 * const tree = await createValueDriverTree({
 *   rootMetric: 'Revenue Growth',
 *   totalValuePotential: 50000000,
 *   ...
 * });
 * ```
 */
export declare function createValueDriverTree(data: Partial<ValueDriverTreeData>): Promise<ValueDriverTreeData>;
/**
 * Adds driver to value tree.
 *
 * @param {string} treeId - Tree identifier
 * @param {string} parentId - Parent driver ID
 * @param {string} name - Driver name
 * @param {number} currentValue - Current value
 * @param {number} targetValue - Target value
 * @returns {Promise<{ driverId: string; impact: number }>} Added driver
 *
 * @example
 * ```typescript
 * const driver = await addValueDriver('VDT-001', 'parent-123', 'Customer Retention', 85, 92);
 * ```
 */
export declare function addValueDriver(treeId: string, parentId: string, name: string, currentValue: number, targetValue: number): Promise<{
    driverId: string;
    impact: number;
}>;
/**
 * Calculates driver impact on root metric.
 *
 * @param {ValueDriverTreeData} tree - Value driver tree
 * @param {string} driverId - Driver to analyze
 * @returns {Promise<{ directImpact: number; totalImpact: number; sensitivity: number }>} Driver impact
 *
 * @example
 * ```typescript
 * const impact = await calculateDriverImpact(tree, 'DRV-001');
 * ```
 */
export declare function calculateDriverImpact(tree: ValueDriverTreeData, driverId: string): Promise<{
    directImpact: number;
    totalImpact: number;
    sensitivity: number;
}>;
/**
 * Performs sensitivity analysis on drivers.
 *
 * @param {ValueDriverTreeData} tree - Value driver tree
 * @returns {Promise<Array<{ driverId: string; name: string; sensitivity: number; elasticity: number }>>} Sensitivity analysis
 *
 * @example
 * ```typescript
 * const sensitivity = await analyzeSensitivity(tree);
 * ```
 */
export declare function analyzeSensitivity(tree: ValueDriverTreeData): Promise<Array<{
    driverId: string;
    name: string;
    sensitivity: number;
    elasticity: number;
}>>;
/**
 * Identifies high-impact value drivers.
 *
 * @param {ValueDriverTreeData} tree - Value driver tree
 * @param {number} threshold - Impact threshold percentage
 * @returns {Promise<Array<{ driverId: string; name: string; impact: number; priority: string }>>} High-impact drivers
 *
 * @example
 * ```typescript
 * const highImpact = await identifyHighImpactDrivers(tree, 20);
 * ```
 */
export declare function identifyHighImpactDrivers(tree: ValueDriverTreeData, threshold: number): Promise<Array<{
    driverId: string;
    name: string;
    impact: number;
    priority: string;
}>>;
/**
 * Generates value waterfall chart data.
 *
 * @param {ValueDriverTreeData} tree - Value driver tree
 * @returns {Promise<Array<{ driver: string; contribution: number; cumulative: number }>>} Waterfall data
 *
 * @example
 * ```typescript
 * const waterfall = await generateValueWaterfall(tree);
 * ```
 */
export declare function generateValueWaterfall(tree: ValueDriverTreeData): Promise<Array<{
    driver: string;
    contribution: number;
    cumulative: number;
}>>;
/**
 * Optimizes driver portfolio for maximum value.
 *
 * @param {ValueDriverTreeData} tree - Value driver tree
 * @param {number} resourceConstraint - Resource constraint
 * @returns {Promise<{ optimizedDrivers: string[]; expectedValue: number; efficiency: number }>} Optimization result
 *
 * @example
 * ```typescript
 * const optimized = await optimizeDriverPortfolio(tree, 10000000);
 * ```
 */
export declare function optimizeDriverPortfolio(tree: ValueDriverTreeData, resourceConstraint: number): Promise<{
    optimizedDrivers: string[];
    expectedValue: number;
    efficiency: number;
}>;
/**
 * Validates value driver tree consistency.
 *
 * @param {ValueDriverTreeData} tree - Value driver tree
 * @returns {Promise<{ isValid: boolean; issues: string[]; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateDriverTree(tree);
 * ```
 */
export declare function validateDriverTree(tree: ValueDriverTreeData): Promise<{
    isValid: boolean;
    issues: string[];
    warnings: string[];
}>;
/**
 * Creates value chain analysis.
 *
 * @param {Partial<ValueChainAnalysisData>} data - Analysis data
 * @returns {Promise<ValueChainAnalysisData>} Value chain analysis
 *
 * @example
 * ```typescript
 * const analysis = await createValueChainAnalysis({
 *   organizationId: 'uuid-org',
 *   totalCost: 10000000,
 *   ...
 * });
 * ```
 */
export declare function createValueChainAnalysis(data: Partial<ValueChainAnalysisData>): Promise<ValueChainAnalysisData>;
/**
 * Analyzes value chain activity costs.
 *
 * @param {ValueChainAnalysisData} analysis - Value chain analysis
 * @returns {Promise<Array<{ activity: ValueChainActivity; cost: number; percentage: number; benchmark: number }>>} Cost analysis
 *
 * @example
 * ```typescript
 * const costs = await analyzeActivityCosts(analysis);
 * ```
 */
export declare function analyzeActivityCosts(analysis: ValueChainAnalysisData): Promise<Array<{
    activity: ValueChainActivity;
    cost: number;
    percentage: number;
    benchmark: number;
}>>;
/**
 * Identifies value chain bottlenecks.
 *
 * @param {ValueChainAnalysisData} analysis - Value chain analysis
 * @returns {Promise<Array<{ activity: ValueChainActivity; severity: string; impact: number }>>} Bottlenecks
 *
 * @example
 * ```typescript
 * const bottlenecks = await identifyValueChainBottlenecks(analysis);
 * ```
 */
export declare function identifyValueChainBottlenecks(analysis: ValueChainAnalysisData): Promise<Array<{
    activity: ValueChainActivity;
    severity: string;
    impact: number;
}>>;
/**
 * Benchmarks value chain vs peers.
 *
 * @param {ValueChainAnalysisData} analysis - Organization analysis
 * @param {ValueChainAnalysisData[]} peerAnalyses - Peer analyses
 * @returns {Promise<Array<{ activity: ValueChainActivity; position: string; gap: number }>>} Benchmark results
 *
 * @example
 * ```typescript
 * const benchmark = await benchmarkValueChain(analysis, peers);
 * ```
 */
export declare function benchmarkValueChain(analysis: ValueChainAnalysisData, peerAnalyses: ValueChainAnalysisData[]): Promise<Array<{
    activity: ValueChainActivity;
    position: string;
    gap: number;
}>>;
/**
 * Identifies competitive advantages in value chain.
 *
 * @param {ValueChainAnalysisData} analysis - Value chain analysis
 * @returns {Promise<Array<{ activity: ValueChainActivity; advantage: string; strength: number }>>} Competitive advantages
 *
 * @example
 * ```typescript
 * const advantages = await identifyCompetitiveAdvantages(analysis);
 * ```
 */
export declare function identifyCompetitiveAdvantages(analysis: ValueChainAnalysisData): Promise<Array<{
    activity: ValueChainActivity;
    advantage: string;
    strength: number;
}>>;
/**
 * Generates value chain optimization recommendations.
 *
 * @param {ValueChainAnalysisData} analysis - Value chain analysis
 * @returns {Promise<Array<{ activity: ValueChainActivity; recommendation: string; impact: number; effort: string }>>} Recommendations
 *
 * @example
 * ```typescript
 * const recommendations = await generateValueChainRecommendations(analysis);
 * ```
 */
export declare function generateValueChainRecommendations(analysis: ValueChainAnalysisData): Promise<Array<{
    activity: ValueChainActivity;
    recommendation: string;
    impact: number;
    effort: string;
}>>;
/**
 * Calculates economic profit (EVA).
 *
 * @param {Partial<EconomicProfitData>} data - Economic profit data
 * @returns {Promise<EconomicProfitData>} Economic profit calculation
 *
 * @example
 * ```typescript
 * const ep = await calculateEconomicProfit({
 *   revenue: 100000000,
 *   operatingCosts: 70000000,
 *   ...
 * });
 * ```
 */
export declare function calculateEconomicProfit(data: Partial<EconomicProfitData>): Promise<EconomicProfitData>;
/**
 * Analyzes economic profit trends.
 *
 * @param {EconomicProfitData[]} historicalEP - Historical economic profit
 * @returns {Promise<{ trend: string; avgGrowth: number; volatility: number; forecast: number }>} Trend analysis
 *
 * @example
 * ```typescript
 * const trend = await analyzeEconomicProfitTrend(historical);
 * ```
 */
export declare function analyzeEconomicProfitTrend(historicalEP: EconomicProfitData[]): Promise<{
    trend: string;
    avgGrowth: number;
    volatility: number;
    forecast: number;
}>;
/**
 * Decomposes economic profit drivers.
 *
 * @param {EconomicProfitData} ep - Economic profit data
 * @returns {Promise<{ nopatContribution: number; capitalEfficiency: number; costOfCapital: number }>} Driver decomposition
 *
 * @example
 * ```typescript
 * const drivers = await decomposeEconomicProfitDrivers(ep);
 * ```
 */
export declare function decomposeEconomicProfitDrivers(ep: EconomicProfitData): Promise<{
    nopatContribution: number;
    capitalEfficiency: number;
    costOfCapital: number;
}>;
/**
 * Benchmarks economic profit vs industry.
 *
 * @param {EconomicProfitData} ep - Organization economic profit
 * @param {number} industryAvgEP - Industry average EP
 * @returns {Promise<{ position: string; gap: number; percentile: number }>} Benchmark result
 *
 * @example
 * ```typescript
 * const benchmark = await benchmarkEconomicProfit(ep, 15000000);
 * ```
 */
export declare function benchmarkEconomicProfit(ep: EconomicProfitData, industryAvgEP: number): Promise<{
    position: string;
    gap: number;
    percentile: number;
}>;
/**
 * Identifies EP improvement opportunities.
 *
 * @param {EconomicProfitData} ep - Economic profit data
 * @returns {Promise<Array<{ lever: string; currentImpact: number; potential: number; priority: string }>>} Improvement opportunities
 *
 * @example
 * ```typescript
 * const opportunities = await identifyEPImprovementOpportunities(ep);
 * ```
 */
export declare function identifyEPImprovementOpportunities(ep: EconomicProfitData): Promise<Array<{
    lever: string;
    currentImpact: number;
    potential: number;
    priority: string;
}>>;
/**
 * Simulates EP scenarios.
 *
 * @param {EconomicProfitData} baseEP - Base economic profit
 * @param {Array<{ parameter: string; change: number }>} scenarios - Scenario parameters
 * @returns {Promise<Array<{ scenario: string; ep: number; change: number }>>} Scenario results
 *
 * @example
 * ```typescript
 * const scenarios = await simulateEconomicProfitScenarios(base, parameters);
 * ```
 */
export declare function simulateEconomicProfitScenarios(baseEP: EconomicProfitData, scenarios: Array<{
    parameter: string;
    change: number;
}>): Promise<Array<{
    scenario: string;
    ep: number;
    change: number;
}>>;
/**
 * Calculates shareholder value (DCF).
 *
 * @param {Partial<ShareholderValueData>} data - Shareholder value data
 * @returns {Promise<ShareholderValueData>} Shareholder value calculation
 *
 * @example
 * ```typescript
 * const sv = await calculateShareholderValue({
 *   organizationId: 'uuid-org',
 *   fcf: 25000000,
 *   ...
 * });
 * ```
 */
export declare function calculateShareholderValue(data: Partial<ShareholderValueData>): Promise<ShareholderValueData>;
/**
 * Analyzes value creation vs destruction.
 *
 * @param {ShareholderValueData} currentValue - Current shareholder value
 * @param {ShareholderValueData} previousValue - Previous shareholder value
 * @returns {Promise<{ valueChange: number; changePercent: number; status: string; drivers: string[] }>} Value analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeValueCreation(current, previous);
 * ```
 */
export declare function analyzeValueCreation(currentValue: ShareholderValueData, previousValue: ShareholderValueData): Promise<{
    valueChange: number;
    changePercent: number;
    status: string;
    drivers: string[];
}>;
/**
 * Performs sensitivity analysis on valuation.
 *
 * @param {ShareholderValueData} baseValue - Base valuation
 * @param {string[]} parameters - Parameters to test
 * @returns {Promise<Array<{ parameter: string; low: number; base: number; high: number; sensitivity: number }>>} Sensitivity results
 *
 * @example
 * ```typescript
 * const sensitivity = await performValuationSensitivity(base, ['discountRate', 'growthRate']);
 * ```
 */
export declare function performValuationSensitivity(baseValue: ShareholderValueData, parameters: string[]): Promise<Array<{
    parameter: string;
    low: number;
    base: number;
    high: number;
    sensitivity: number;
}>>;
/**
 * Calculates total shareholder return (TSR).
 *
 * @param {number} beginningPrice - Beginning share price
 * @param {number} endingPrice - Ending share price
 * @param {number} dividends - Dividends paid
 * @returns {Promise<{ tsr: number; capitalAppreciation: number; dividendYield: number }>} TSR calculation
 *
 * @example
 * ```typescript
 * const tsr = await calculateTSR(100, 115, 5);
 * ```
 */
export declare function calculateTSR(beginningPrice: number, endingPrice: number, dividends: number): Promise<{
    tsr: number;
    capitalAppreciation: number;
    dividendYield: number;
}>;
/**
 * Benchmarks TSR vs market/peers.
 *
 * @param {number} organizationTSR - Organization TSR
 * @param {number} marketTSR - Market TSR
 * @param {number[]} peerTSRs - Peer TSRs
 * @returns {Promise<{ outperformance: number; marketRank: string; peerRank: number; percentile: number }>} TSR benchmark
 *
 * @example
 * ```typescript
 * const benchmark = await benchmarkTSR(25, 15, [20, 18, 22, 16]);
 * ```
 */
export declare function benchmarkTSR(organizationTSR: number, marketTSR: number, peerTSRs: number[]): Promise<{
    outperformance: number;
    marketRank: string;
    peerRank: number;
    percentile: number;
}>;
/**
 * Generates shareholder value bridge.
 *
 * @param {ShareholderValueData} startValue - Starting value
 * @param {ShareholderValueData} endValue - Ending value
 * @returns {Promise<Array<{ component: string; contribution: number; percentage: number }>>} Value bridge
 *
 * @example
 * ```typescript
 * const bridge = await generateValueBridge(start, end);
 * ```
 */
export declare function generateValueBridge(startValue: ShareholderValueData, endValue: ShareholderValueData): Promise<Array<{
    component: string;
    contribution: number;
    percentage: number;
}>>;
/**
 * Creates value creation initiative.
 *
 * @param {Partial<ValueCreationInitiativeData>} data - Initiative data
 * @returns {Promise<ValueCreationInitiativeData>} Value creation initiative
 *
 * @example
 * ```typescript
 * const initiative = await createValueCreationInitiative({
 *   name: 'Digital Transformation',
 *   initiativeType: InitiativeType.TRANSFORMATION,
 *   ...
 * });
 * ```
 */
export declare function createValueCreationInitiative(data: Partial<ValueCreationInitiativeData>): Promise<ValueCreationInitiativeData>;
/**
 * Prioritizes value creation initiatives.
 *
 * @param {ValueCreationInitiativeData[]} initiatives - Array of initiatives
 * @param {Record<string, number>} weights - Prioritization weights
 * @returns {Promise<Array<{ initiativeId: string; name: string; score: number; rank: number }>>} Prioritized initiatives
 *
 * @example
 * ```typescript
 * const prioritized = await prioritizeValueInitiatives(initiatives, { roi: 0.4, risk: 0.3, speed: 0.3 });
 * ```
 */
export declare function prioritizeValueInitiatives(initiatives: ValueCreationInitiativeData[], weights: Record<string, number>): Promise<Array<{
    initiativeId: string;
    name: string;
    score: number;
    rank: number;
}>>;
/**
 * Tracks initiative value realization.
 *
 * @param {string} initiativeId - Initiative identifier
 * @param {number} actualValue - Actual value realized
 * @param {number} targetValue - Target value
 * @returns {Promise<{ realization: number; variance: number; status: string; forecast: number }>} Tracking result
 *
 * @example
 * ```typescript
 * const tracking = await trackInitiativeRealization('VCI-001', 12000000, 15000000);
 * ```
 */
export declare function trackInitiativeRealization(initiativeId: string, actualValue: number, targetValue: number): Promise<{
    realization: number;
    variance: number;
    status: string;
    forecast: number;
}>;
/**
 * Generates initiative portfolio dashboard.
 *
 * @param {ValueCreationInitiativeData[]} initiatives - Portfolio of initiatives
 * @returns {Promise<{ totalValue: number; totalInvestment: number; portfolioROI: number; byType: Record<string, number> }>} Portfolio dashboard
 *
 * @example
 * ```typescript
 * const dashboard = await generateInitiativePortfolio(initiatives);
 * ```
 */
export declare function generateInitiativePortfolio(initiatives: ValueCreationInitiativeData[]): Promise<{
    totalValue: number;
    totalInvestment: number;
    portfolioROI: number;
    byType: Record<string, number>;
}>;
/**
 * Creates ROIC analysis.
 *
 * @param {Partial<ROICAnalysisData>} data - ROIC data
 * @returns {Promise<ROICAnalysisData>} ROIC analysis
 *
 * @example
 * ```typescript
 * const roic = await createROICAnalysis({
 *   nopat: 25000000,
 *   investedCapital: 200000000,
 *   ...
 * });
 * ```
 */
export declare function createROICAnalysis(data: Partial<ROICAnalysisData>): Promise<ROICAnalysisData>;
/**
 * Decomposes ROIC into components.
 *
 * @param {ROICAnalysisData} roic - ROIC analysis
 * @returns {Promise<{ margin: number; turnover: number; marginContribution: number; turnoverContribution: number }>} ROIC decomposition
 *
 * @example
 * ```typescript
 * const decomposition = await decomposeROIC(roic);
 * ```
 */
export declare function decomposeROIC(roic: ROICAnalysisData): Promise<{
    margin: number;
    turnover: number;
    marginContribution: number;
    turnoverContribution: number;
}>;
/**
 * Identifies ROIC improvement levers.
 *
 * @param {ROICAnalysisData} roic - ROIC analysis
 * @returns {Promise<Array<{ lever: ROICLever; currentImpact: number; potential: number; priority: string }>>} Improvement levers
 *
 * @example
 * ```typescript
 * const levers = await identifyROICLevers(roic);
 * ```
 */
export declare function identifyROICLevers(roic: ROICAnalysisData): Promise<Array<{
    lever: ROICLever;
    currentImpact: number;
    potential: number;
    priority: string;
}>>;
/**
 * Benchmarks ROIC vs industry.
 *
 * @param {ROICAnalysisData} roic - Organization ROIC
 * @param {number} industryMedian - Industry median ROIC
 * @param {number} topQuartile - Top quartile ROIC
 * @returns {Promise<{ position: string; gap: number; percentile: number }>} ROIC benchmark
 *
 * @example
 * ```typescript
 * const benchmark = await benchmarkROIC(roic, 12, 18);
 * ```
 */
export declare function benchmarkROIC(roic: ROICAnalysisData, industryMedian: number, topQuartile: number): Promise<{
    position: string;
    gap: number;
    percentile: number;
}>;
/**
 * Simulates ROIC improvement scenarios.
 *
 * @param {ROICAnalysisData} baseROIC - Base ROIC
 * @param {Array<{ lever: ROICLever; improvement: number }>} improvements - Improvement scenarios
 * @returns {Promise<Array<{ scenario: string; newROIC: number; spread: number; value: number }>>} Scenario results
 *
 * @example
 * ```typescript
 * const scenarios = await simulateROICImprovements(base, improvements);
 * ```
 */
export declare function simulateROICImprovements(baseROIC: ROICAnalysisData, improvements: Array<{
    lever: ROICLever;
    improvement: number;
}>): Promise<Array<{
    scenario: string;
    newROIC: number;
    spread: number;
    value: number;
}>>;
//# sourceMappingURL=value-creation-kit.d.ts.map