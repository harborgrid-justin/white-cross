/**
 * LOC: FINRISK1234567
 * File: /reuse/financial/financial-risk-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Financial risk controllers
 *   - Risk assessment services
 *   - Compliance and audit modules
 *   - Treasury management components
 */
/**
 * File: /reuse/financial/financial-risk-management-kit.ts
 * Locator: WC-FIN-RISKMGMT-001
 * Purpose: USACE CEFMS-Level Financial Risk Management - Risk assessment, credit risk, liquidity risk, FX risk, hedging strategies
 *
 * Upstream: Independent financial risk utility module
 * Downstream: ../backend/*, Risk controllers, Treasury services, Compliance modules, Audit systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Decimal.js
 * Exports: 45+ utility functions for risk assessment, credit scoring, liquidity management, FX exposure, VaR calculations, stress testing, hedging
 *
 * LLM Context: Enterprise-grade financial risk management competing with USACE CEFMS.
 * Provides comprehensive risk assessment frameworks, credit risk scoring, default probability modeling,
 * liquidity risk monitoring, cash flow stress testing, foreign exchange exposure management, Value-at-Risk (VaR),
 * Expected Shortfall (ES), Monte Carlo simulations, scenario analysis, hedging strategy optimization,
 * counterparty risk analysis, market risk assessment, operational risk tracking, regulatory compliance (Basel III),
 * risk reporting dashboards, early warning systems, and integrated risk governance.
 */
import { Sequelize } from 'sequelize';
interface RiskAssessment {
    id: string;
    entityId: string;
    assessmentDate: Date;
    riskType: 'credit' | 'market' | 'liquidity' | 'operational' | 'fx' | 'interest-rate' | 'compliance';
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    riskScore: number;
    probability: number;
    impact: number;
    mitigationStatus: 'none' | 'partial' | 'full';
    mitigationPlan?: string;
    owner: string;
    nextReviewDate: Date;
}
interface PaymentRecord {
    date: Date;
    amountDue: number;
    amountPaid: number;
    daysLate: number;
    status: 'on-time' | 'late' | 'missed' | 'partial';
}
interface LiquidityMetrics {
    cashBalance: number;
    cashEquivalents: number;
    liquidAssets: number;
    currentRatio: number;
    quickRatio: number;
    cashRatio: number;
    workingCapital: number;
    operatingCashFlow: number;
    cashConversionCycle: number;
    burnRate: number;
    runwayMonths: number;
    liquidityGap: number;
}
interface LiquidityStressTest {
    scenario: string;
    severity: 'mild' | 'moderate' | 'severe' | 'extreme';
    assumptions: Record<string, number>;
    projectedCashFlow: number[];
    cashShortfall: number;
    survivalPeriod: number;
    requiredLiquidity: number;
    mitigationActions: string[];
}
interface FXExposure {
    currency: string;
    exposureAmount: number;
    exposureType: 'transaction' | 'translation' | 'economic';
    hedgingRatio: number;
    hedgedAmount: number;
    unhedgedAmount: number;
    spotRate: number;
    forwardRate?: number;
    volatility: number;
    valueAtRisk: number;
}
interface HedgingStrategy {
    id: string;
    instrumentType: 'forward' | 'futures' | 'option' | 'swap' | 'collar' | 'natural-hedge';
    underlying: string;
    notionalAmount: number;
    hedgeRatio: number;
    effectiveness: number;
    cost: number;
    maturityDate: Date;
    counterparty: string;
    collateral?: number;
}
interface ValueAtRisk {
    portfolioValue: number;
    var95: number;
    var99: number;
    confidenceLevel: number;
    holdingPeriod: number;
    calculationMethod: 'parametric' | 'historical' | 'monte-carlo';
    expectedShortfall: number;
    volatility: number;
    correlation?: number[][];
}
interface StressTestScenario {
    scenarioId: string;
    scenarioName: string;
    scenarioType: 'historical' | 'hypothetical' | 'regulatory';
    marketShocks: Record<string, number>;
    portfolioImpact: number;
    capitalImpact: number;
    liquidityImpact: number;
    operationalImpact: number;
    overallRiskRating: 'pass' | 'warning' | 'fail';
}
interface CounterpartyRisk {
    counterpartyId: string;
    counterpartyName: string;
    exposure: number;
    creditRating: string;
    probabilityOfDefault: number;
    creditValuationAdjustment: number;
    collateralHeld: number;
    netExposure: number;
    concentrationRisk: number;
    relationshipDuration: number;
}
interface MarketRisk {
    assetClass: string;
    exposure: number;
    beta: number;
    volatility: number;
    valueAtRisk: number;
    expectedShortfall: number;
    stressLoss: number;
    marginRequirement: number;
    hedgeEffectiveness: number;
}
interface OperationalRisk {
    category: 'process' | 'people' | 'systems' | 'external';
    riskEvent: string;
    frequency: number;
    averageLoss: number;
    maxLoss: number;
    expectedLoss: number;
    controls: RiskControl[];
    residualRisk: number;
}
interface RiskControl {
    controlId: string;
    controlType: 'preventive' | 'detective' | 'corrective';
    effectiveness: number;
    cost: number;
    owner: string;
    lastReviewDate: Date;
    status: 'effective' | 'needs-improvement' | 'ineffective';
}
interface RiskLimit {
    limitId: string;
    limitType: 'credit' | 'market' | 'liquidity' | 'concentration';
    entity: string;
    limitValue: number;
    currentValue: number;
    utilizationPercentage: number;
    warningThreshold: number;
    breachStatus: 'within-limit' | 'warning' | 'breach';
    approvedBy: string;
    reviewFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
}
interface RiskConcentration {
    concentrationType: 'single-name' | 'sector' | 'geography' | 'product';
    entity: string;
    exposure: number;
    percentageOfTotal: number;
    limit: number;
    excessExposure: number;
    diversificationScore: number;
}
interface RegulatoryCapital {
    tier1Capital: number;
    tier2Capital: number;
    totalCapital: number;
    riskWeightedAssets: number;
    tier1Ratio: number;
    totalCapitalRatio: number;
    leverageRatio: number;
    minimumRequirement: number;
    buffer: number;
    adequacyStatus: 'adequate' | 'marginal' | 'inadequate';
}
/**
 * Sequelize model for Risk Assessments with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RiskAssessment model
 *
 * @example
 * ```typescript
 * const RiskAssessment = createRiskAssessmentModel(sequelize);
 * const assessment = await RiskAssessment.create({
 *   entityId: 'CUST_001',
 *   riskType: 'credit',
 *   riskLevel: 'medium',
 *   riskScore: 65.5,
 *   probability: 0.15,
 *   impact: 250000
 * });
 * ```
 */
export declare const createRiskAssessmentModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        assessmentId: string;
        entityId: string;
        entityType: string;
        assessmentDate: Date;
        riskType: string;
        riskCategory: string;
        riskLevel: string;
        riskScore: number;
        probability: number;
        impact: number;
        inherentRisk: number;
        residualRisk: number;
        controls: RiskControl[];
        mitigationStatus: string;
        mitigationPlan: string | null;
        owner: string;
        assessor: string;
        approvedBy: string | null;
        approvedAt: Date | null;
        nextReviewDate: Date;
        lastReviewDate: Date;
        status: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Credit Risk Profiles with scoring and limits.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CreditRiskProfile model
 *
 * @example
 * ```typescript
 * const CreditProfile = createCreditRiskProfileModel(sequelize);
 * const profile = await CreditProfile.create({
 *   entityId: 'CUST_001',
 *   creditScore: 720,
 *   creditRating: 'BBB+',
 *   probabilityOfDefault: 0.025,
 *   creditLimit: 500000
 * });
 * ```
 */
export declare const createCreditRiskProfileModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        entityId: string;
        entityName: string;
        entityType: string;
        creditScore: number;
        creditRating: string;
        ratingAgency: string | null;
        probabilityOfDefault: number;
        lossGivenDefault: number;
        expectedLoss: number;
        exposureAtDefault: number;
        riskWeightedAssets: number;
        creditLimit: number;
        currentExposure: number;
        utilizationRate: number;
        paymentHistory: PaymentRecord[];
        delinquencyStatus: string;
        daysPastDue: number;
        defaultFlag: boolean;
        lastReviewDate: Date;
        nextReviewDate: Date;
        collateralValue: number;
        guarantees: Record<string, any>[];
        covenants: Record<string, any>[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Liquidity Risk Monitoring with stress scenarios.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LiquidityRisk model
 *
 * @example
 * ```typescript
 * const LiquidityRisk = createLiquidityRiskModel(sequelize);
 * const risk = await LiquidityRisk.create({
 *   period: '2025-01',
 *   cashBalance: 2500000,
 *   currentRatio: 1.85,
 *   runwayMonths: 18
 * });
 * ```
 */
export declare const createLiquidityRiskModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        entityId: string;
        period: string;
        measurementDate: Date;
        cashBalance: number;
        cashEquivalents: number;
        liquidAssets: number;
        currentRatio: number;
        quickRatio: number;
        cashRatio: number;
        workingCapital: number;
        operatingCashFlow: number;
        cashConversionCycle: number;
        burnRate: number;
        runwayMonths: number;
        liquidityGap: number;
        stressTestResults: LiquidityStressTest[];
        contingencyFunding: number;
        creditFacilities: Record<string, any>[];
        liquidityRiskLevel: string;
        earlyWarningIndicators: Record<string, any>[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for FX Exposure and Hedging Management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FXExposure model
 *
 * @example
 * ```typescript
 * const FXExposure = createFXExposureModel(sequelize);
 * const exposure = await FXExposure.create({
 *   currency: 'EUR',
 *   exposureAmount: 5000000,
 *   exposureType: 'transaction',
 *   hedgingRatio: 0.75
 * });
 * ```
 */
export declare const createFXExposureModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        entityId: string;
        currency: string;
        baseCurrency: string;
        exposureAmount: number;
        exposureType: string;
        hedgingRatio: number;
        hedgedAmount: number;
        unhedgedAmount: number;
        spotRate: number;
        forwardRate: number | null;
        volatility: number;
        valueAtRisk: number;
        hedgingStrategies: HedgingStrategy[];
        netExposure: number;
        riskLevel: string;
        lastRebalanceDate: Date;
        nextRebalanceDate: Date;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Perform comprehensive risk assessment for entity.
 *
 * @param {string} entityId - Entity identifier
 * @param {string} riskType - Type of risk to assess
 * @param {Record<string, any>} inputData - Assessment input data
 * @returns {Promise<RiskAssessment>} Risk assessment result
 *
 * @example
 * ```typescript
 * const assessment = await performRiskAssessment('CUST_001', 'credit', {
 *   financialStatements: {...},
 *   paymentHistory: [...]
 * });
 * ```
 */
export declare function performRiskAssessment(entityId: string, riskType: 'credit' | 'market' | 'liquidity' | 'operational' | 'fx' | 'interest-rate' | 'compliance', inputData: Record<string, any>): Promise<RiskAssessment>;
/**
 * Calculate overall risk score using probability and impact matrix.
 *
 * @param {number} probability - Probability of occurrence (0-1)
 * @param {number} impact - Financial impact
 * @param {number} maxImpact - Maximum expected impact
 * @returns {number} Risk score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateRiskScore(0.25, 500000, 2000000);
 * // Returns: 62.5
 * ```
 */
export declare function calculateRiskScore(probability: number, impact: number, maxImpact: number): number;
/**
 * Identify and prioritize top risks across organization.
 *
 * @param {RiskAssessment[]} assessments - All risk assessments
 * @param {number} topN - Number of top risks to return
 * @returns {Promise<RiskAssessment[]>} Top prioritized risks
 *
 * @example
 * ```typescript
 * const topRisks = await identifyTopRisks(allAssessments, 10);
 * ```
 */
export declare function identifyTopRisks(assessments: RiskAssessment[], topN?: number): Promise<RiskAssessment[]>;
/**
 * Create risk heat map for visualization.
 *
 * @param {RiskAssessment[]} assessments - Risk assessments
 * @returns {Promise<Record<string, any>>} Heat map data structure
 *
 * @example
 * ```typescript
 * const heatMap = await createRiskHeatMap(assessments);
 * ```
 */
export declare function createRiskHeatMap(assessments: RiskAssessment[]): Promise<Record<string, any>>;
/**
 * Monitor risk limits and trigger alerts on breaches.
 *
 * @param {RiskLimit[]} limits - Risk limits to monitor
 * @param {Record<string, number>} currentValues - Current exposure values
 * @returns {Promise<RiskLimit[]>} Breached or warning limits
 *
 * @example
 * ```typescript
 * const breaches = await monitorRiskLimits(limits, { credit: 5500000, market: 2200000 });
 * ```
 */
export declare function monitorRiskLimits(limits: RiskLimit[], currentValues: Record<string, number>): Promise<RiskLimit[]>;
/**
 * Generate risk register with all identified risks.
 *
 * @param {string} entityId - Entity identifier
 * @param {Date} asOfDate - As-of date for register
 * @returns {Promise<Record<string, any>>} Risk register
 *
 * @example
 * ```typescript
 * const register = await generateRiskRegister('ORG_001', new Date());
 * ```
 */
export declare function generateRiskRegister(entityId: string, asOfDate: Date): Promise<Record<string, any>>;
/**
 * Calculate residual risk after control effectiveness.
 *
 * @param {number} inherentRisk - Inherent risk score
 * @param {RiskControl[]} controls - Risk controls
 * @returns {Promise<number>} Residual risk score
 *
 * @example
 * ```typescript
 * const residual = await calculateResidualRisk(85, controls);
 * ```
 */
export declare function calculateResidualRisk(inherentRisk: number, controls: RiskControl[]): Promise<number>;
/**
 * Perform risk concentration analysis across portfolio.
 *
 * @param {Record<string, number>} exposures - Exposures by entity/sector
 * @param {number} totalExposure - Total portfolio exposure
 * @param {number} concentrationLimit - Concentration limit percentage
 * @returns {Promise<RiskConcentration[]>} Concentration risks
 *
 * @example
 * ```typescript
 * const concentrations = await analyzeRiskConcentration(
 *   { 'Tech Sector': 5000000, 'Single Customer': 3000000 },
 *   10000000,
 *   25
 * );
 * ```
 */
export declare function analyzeRiskConcentration(exposures: Record<string, number>, totalExposure: number, concentrationLimit: number): Promise<RiskConcentration[]>;
/**
 * Calculate credit risk score using multiple factors.
 *
 * @param {Record<string, any>} creditData - Credit assessment data
 * @returns {Promise<number>} Credit risk score (0-100)
 *
 * @example
 * ```typescript
 * const score = await calculateCreditRiskScore({
 *   creditScore: 720,
 *   debtToIncome: 0.35,
 *   paymentHistory: 'excellent',
 *   utilizationRate: 0.30
 * });
 * ```
 */
export declare function calculateCreditRiskScore(creditData: Record<string, any>): Promise<number>;
/**
 * Estimate probability of default (PD) using credit score and financials.
 *
 * @param {number} creditScore - Credit score (300-850)
 * @param {Record<string, number>} financialRatios - Financial ratios
 * @returns {Promise<number>} Probability of default (0-1)
 *
 * @example
 * ```typescript
 * const pd = await calculateProbabilityOfDefault(720, {
 *   debtToEquity: 0.5,
 *   interestCoverage: 5.0,
 *   currentRatio: 1.8
 * });
 * ```
 */
export declare function calculateProbabilityOfDefault(creditScore: number, financialRatios: Record<string, number>): Promise<number>;
/**
 * Calculate Loss Given Default (LGD) based on collateral and seniority.
 *
 * @param {number} exposureAmount - Total exposure
 * @param {number} collateralValue - Collateral value
 * @param {string} seniority - Debt seniority (senior, subordinated, equity)
 * @returns {Promise<number>} Loss given default (0-1)
 *
 * @example
 * ```typescript
 * const lgd = await calculateLossGivenDefault(1000000, 600000, 'senior');
 * // Returns: 0.40 (40% loss)
 * ```
 */
export declare function calculateLossGivenDefault(exposureAmount: number, collateralValue: number, seniority?: 'senior' | 'subordinated' | 'equity'): Promise<number>;
/**
 * Calculate Expected Loss (EL = PD × LGD × EAD).
 *
 * @param {number} probabilityOfDefault - PD (0-1)
 * @param {number} lossGivenDefault - LGD (0-1)
 * @param {number} exposureAtDefault - EAD amount
 * @returns {number} Expected loss amount
 *
 * @example
 * ```typescript
 * const el = calculateExpectedLoss(0.05, 0.45, 1000000);
 * // Returns: 22500
 * ```
 */
export declare function calculateExpectedLoss(probabilityOfDefault: number, lossGivenDefault: number, exposureAtDefault: number): number;
/**
 * Calculate Risk-Weighted Assets (RWA) per Basel III.
 *
 * @param {number} exposure - Exposure amount
 * @param {number} riskWeight - Risk weight (0-1.5)
 * @param {number} creditConversionFactor - CCF for off-balance sheet
 * @returns {number} Risk-weighted assets
 *
 * @example
 * ```typescript
 * const rwa = calculateRiskWeightedAssets(1000000, 0.50, 1.0);
 * // Returns: 500000
 * ```
 */
export declare function calculateRiskWeightedAssets(exposure: number, riskWeight: number, creditConversionFactor?: number): number;
/**
 * Assign credit rating based on score and financial metrics.
 *
 * @param {number} creditScore - Credit score
 * @param {Record<string, number>} financialMetrics - Financial metrics
 * @returns {Promise<string>} Credit rating (AAA to D)
 *
 * @example
 * ```typescript
 * const rating = await assignCreditRating(750, { debtToEquity: 0.4, roe: 18.5 });
 * // Returns: 'A+'
 * ```
 */
export declare function assignCreditRating(creditScore: number, financialMetrics: Record<string, number>): Promise<string>;
/**
 * Monitor credit utilization and alert on limits.
 *
 * @param {number} creditLimit - Approved credit limit
 * @param {number} currentExposure - Current exposure
 * @param {number} warningThreshold - Warning threshold percentage
 * @returns {Promise<Record<string, any>>} Utilization analysis
 *
 * @example
 * ```typescript
 * const analysis = await monitorCreditUtilization(500000, 425000, 85);
 * ```
 */
export declare function monitorCreditUtilization(creditLimit: number, currentExposure: number, warningThreshold?: number): Promise<Record<string, any>>;
/**
 * Analyze counterparty credit risk and concentration.
 *
 * @param {string} counterpartyId - Counterparty identifier
 * @param {number} exposure - Current exposure
 * @param {Record<string, any>} creditData - Credit data
 * @returns {Promise<CounterpartyRisk>} Counterparty risk assessment
 *
 * @example
 * ```typescript
 * const cpRisk = await analyzeCounterpartyRisk('CP_001', 2500000, creditData);
 * ```
 */
export declare function analyzeCounterpartyRisk(counterpartyId: string, exposure: number, creditData: Record<string, any>): Promise<CounterpartyRisk>;
/**
 * Calculate liquidity coverage ratio (LCR) per Basel III.
 *
 * @param {number} highQualityLiquidAssets - HQLA amount
 * @param {number} totalNetCashOutflows - Net cash outflows (30 days)
 * @returns {number} LCR percentage (should be >= 100%)
 *
 * @example
 * ```typescript
 * const lcr = calculateLiquidityCoverageRatio(15000000, 12000000);
 * // Returns: 125
 * ```
 */
export declare function calculateLiquidityCoverageRatio(highQualityLiquidAssets: number, totalNetCashOutflows: number): number;
/**
 * Calculate net stable funding ratio (NSFR) per Basel III.
 *
 * @param {number} availableStableFunding - ASF amount
 * @param {number} requiredStableFunding - RSF amount
 * @returns {number} NSFR percentage (should be >= 100%)
 *
 * @example
 * ```typescript
 * const nsfr = calculateNetStableFundingRatio(80000000, 70000000);
 * // Returns: 114.29
 * ```
 */
export declare function calculateNetStableFundingRatio(availableStableFunding: number, requiredStableFunding: number): number;
/**
 * Perform liquidity stress test under various scenarios.
 *
 * @param {Record<string, number>} baselineData - Baseline liquidity data
 * @param {string} scenario - Stress scenario name
 * @param {Record<string, number>} shocks - Scenario shocks
 * @returns {Promise<LiquidityStressTest>} Stress test results
 *
 * @example
 * ```typescript
 * const stressTest = await performLiquidityStressTest(
 *   { cashBalance: 5000000, receivables: 3000000 },
 *   'severe-recession',
 *   { cashFlowReduction: 0.4, receivablesDelay: 30 }
 * );
 * ```
 */
export declare function performLiquidityStressTest(baselineData: Record<string, number>, scenario: string, shocks: Record<string, number>): Promise<LiquidityStressTest>;
/**
 * Calculate cash burn rate and runway.
 *
 * @param {number} cashBalance - Current cash balance
 * @param {number} monthlyExpenses - Average monthly expenses
 * @param {number} monthlyRevenue - Average monthly revenue
 * @returns {Promise<Record<string, number>>} Burn rate and runway
 *
 * @example
 * ```typescript
 * const burnAnalysis = await calculateCashBurnRate(3000000, 500000, 300000);
 * // Returns: { burnRate: 200000, runwayMonths: 15 }
 * ```
 */
export declare function calculateCashBurnRate(cashBalance: number, monthlyExpenses: number, monthlyRevenue: number): Promise<Record<string, number>>;
/**
 * Analyze cash flow gaps and timing mismatches.
 *
 * @param {Array<{date: Date, inflow: number, outflow: number}>} cashFlows - Cash flow schedule
 * @returns {Promise<Record<string, any>>} Gap analysis
 *
 * @example
 * ```typescript
 * const gapAnalysis = await analyzeCashFlowGaps(cashFlowSchedule);
 * ```
 */
export declare function analyzeCashFlowGaps(cashFlows: Array<{
    date: Date;
    inflow: number;
    outflow: number;
}>): Promise<Record<string, any>>;
/**
 * Calculate liquidity metrics suite.
 *
 * @param {Record<string, number>} financialData - Financial data
 * @returns {Promise<LiquidityMetrics>} Comprehensive liquidity metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateLiquidityMetrics({
 *   cash: 2000000,
 *   currentAssets: 8000000,
 *   currentLiabilities: 5000000,
 *   operatingCashFlow: 500000
 * });
 * ```
 */
export declare function calculateLiquidityMetrics(financialData: Record<string, number>): Promise<LiquidityMetrics>;
/**
 * Monitor early warning indicators for liquidity crisis.
 *
 * @param {LiquidityMetrics} currentMetrics - Current liquidity metrics
 * @param {Record<string, number>} thresholds - Warning thresholds
 * @returns {Promise<Array<{indicator: string, value: number, threshold: number, status: string}>>} Warning indicators
 *
 * @example
 * ```typescript
 * const warnings = await monitorLiquidityWarningIndicators(metrics, {
 *   currentRatio: 1.5,
 *   runwayMonths: 6
 * });
 * ```
 */
export declare function monitorLiquidityWarningIndicators(currentMetrics: LiquidityMetrics, thresholds: Record<string, number>): Promise<Array<{
    indicator: string;
    value: number;
    threshold: number;
    status: string;
}>>;
/**
 * Generate contingency funding plan for liquidity crisis.
 *
 * @param {number} requiredFunding - Required funding amount
 * @param {number} timeframe - Days to secure funding
 * @returns {Promise<Record<string, any>>} Contingency funding plan
 *
 * @example
 * ```typescript
 * const plan = await generateContingencyFundingPlan(5000000, 30);
 * ```
 */
export declare function generateContingencyFundingPlan(requiredFunding: number, timeframe: number): Promise<Record<string, any>>;
/**
 * Calculate foreign exchange exposure across currencies.
 *
 * @param {Record<string, number>} currencyPositions - Positions by currency
 * @param {Record<string, number>} spotRates - Spot rates to base currency
 * @returns {Promise<FXExposure[]>} FX exposures
 *
 * @example
 * ```typescript
 * const exposures = await calculateFXExposure(
 *   { EUR: 5000000, GBP: 3000000, JPY: 500000000 },
 *   { EUR: 1.08, GBP: 1.27, JPY: 0.0067 }
 * );
 * ```
 */
export declare function calculateFXExposure(currencyPositions: Record<string, number>, spotRates: Record<string, number>): Promise<FXExposure[]>;
/**
 * Calculate Value-at-Risk (VaR) for FX exposure.
 *
 * @param {number} exposure - FX exposure amount
 * @param {number} volatility - FX volatility (annual)
 * @param {number} confidenceLevel - Confidence level (e.g., 0.95)
 * @param {number} holdingPeriod - Holding period in days
 * @returns {number} Value at Risk
 *
 * @example
 * ```typescript
 * const var95 = calculateFXValueAtRisk(5000000, 0.12, 0.95, 1);
 * // Returns: ~100,000 (simplified)
 * ```
 */
export declare function calculateFXValueAtRisk(exposure: number, volatility: number, confidenceLevel?: number, holdingPeriod?: number): number;
/**
 * Design optimal hedging strategy for FX exposure.
 *
 * @param {FXExposure} exposure - FX exposure details
 * @param {number} targetHedgeRatio - Target hedge ratio (0-1)
 * @param {string[]} allowedInstruments - Allowed hedging instruments
 * @returns {Promise<HedgingStrategy>} Recommended hedging strategy
 *
 * @example
 * ```typescript
 * const strategy = await designHedgingStrategy(
 *   exposure,
 *   0.75,
 *   ['forward', 'option', 'swap']
 * );
 * ```
 */
export declare function designHedgingStrategy(exposure: FXExposure, targetHedgeRatio: number, allowedInstruments: string[]): Promise<HedgingStrategy>;
/**
 * Calculate hedge effectiveness and accounting impact.
 *
 * @param {HedgingStrategy} hedge - Hedging strategy
 * @param {number} spotChange - Change in spot rate
 * @param {number} hedgeValueChange - Change in hedge value
 * @returns {Promise<Record<string, number>>} Effectiveness metrics
 *
 * @example
 * ```typescript
 * const effectiveness = await calculateHedgeEffectiveness(
 *   strategy,
 *   -0.05,
 *   0.048
 * );
 * ```
 */
export declare function calculateHedgeEffectiveness(hedge: HedgingStrategy, spotChange: number, hedgeValueChange: number): Promise<Record<string, number>>;
/**
 * Perform FX sensitivity analysis.
 *
 * @param {FXExposure[]} exposures - FX exposures
 * @param {number[]} rateShocks - Rate shock scenarios (e.g., [-0.10, -0.05, 0, 0.05, 0.10])
 * @returns {Promise<Record<string, any>>} Sensitivity analysis results
 *
 * @example
 * ```typescript
 * const sensitivity = await performFXSensitivityAnalysis(
 *   exposures,
 *   [-0.10, -0.05, 0, 0.05, 0.10]
 * );
 * ```
 */
export declare function performFXSensitivityAnalysis(exposures: FXExposure[], rateShocks: number[]): Promise<Record<string, any>>;
/**
 * Monitor FX limits and trigger rebalancing.
 *
 * @param {FXExposure[]} exposures - Current FX exposures
 * @param {Record<string, number>} limits - FX exposure limits by currency
 * @returns {Promise<Array<{currency: string, action: string}>>} Rebalancing actions
 *
 * @example
 * ```typescript
 * const actions = await monitorFXLimits(exposures, { EUR: 10000000, GBP: 5000000 });
 * ```
 */
export declare function monitorFXLimits(exposures: FXExposure[], limits: Record<string, number>): Promise<Array<{
    currency: string;
    action: string;
    excess: number;
}>>;
/**
 * Calculate natural hedge opportunities.
 *
 * @param {FXExposure[]} assets - FX asset exposures
 * @param {FXExposure[]} liabilities - FX liability exposures
 * @returns {Promise<Record<string, any>>} Natural hedge analysis
 *
 * @example
 * ```typescript
 * const naturalHedges = await calculateNaturalHedge(assetExposures, liabilityExposures);
 * ```
 */
export declare function calculateNaturalHedge(assets: FXExposure[], liabilities: FXExposure[]): Promise<Record<string, any>>;
/**
 * Optimize multi-currency hedging portfolio.
 *
 * @param {FXExposure[]} exposures - All FX exposures
 * @param {number} hedgingBudget - Total hedging budget
 * @param {Record<string, number>} instrumentCosts - Costs by instrument type
 * @returns {Promise<HedgingStrategy[]>} Optimized hedging portfolio
 *
 * @example
 * ```typescript
 * const portfolio = await optimizeHedgingPortfolio(
 *   exposures,
 *   500000,
 *   { forward: 0.001, option: 0.02 }
 * );
 * ```
 */
export declare function optimizeHedgingPortfolio(exposures: FXExposure[], hedgingBudget: number, instrumentCosts: Record<string, number>): Promise<HedgingStrategy[]>;
/**
 * Generate FX risk report for management.
 *
 * @param {FXExposure[]} exposures - FX exposures
 * @param {HedgingStrategy[]} hedges - Active hedges
 * @param {string} period - Reporting period
 * @returns {Promise<Record<string, any>>} FX risk report
 *
 * @example
 * ```typescript
 * const report = await generateFXRiskReport(exposures, hedges, '2025-Q1');
 * ```
 */
export declare function generateFXRiskReport(exposures: FXExposure[], hedges: HedgingStrategy[], period: string): Promise<Record<string, any>>;
/**
 * Calculate portfolio Value-at-Risk using parametric method.
 *
 * @param {number} portfolioValue - Portfolio value
 * @param {number} volatility - Portfolio volatility (annual)
 * @param {number} confidenceLevel - Confidence level (0.95 or 0.99)
 * @param {number} holdingPeriod - Holding period in days
 * @returns {Promise<ValueAtRisk>} VaR calculation results
 *
 * @example
 * ```typescript
 * const var = await calculateParametricVaR(10000000, 0.15, 0.95, 1);
 * ```
 */
export declare function calculateParametricVaR(portfolioValue: number, volatility: number, confidenceLevel?: number, holdingPeriod?: number): Promise<ValueAtRisk>;
/**
 * Calculate Expected Shortfall (ES) / Conditional VaR.
 *
 * @param {ValueAtRisk} varResult - VaR calculation result
 * @returns {number} Expected shortfall
 *
 * @example
 * ```typescript
 * const es = calculateExpectedShortfall(varResult);
 * ```
 */
export declare function calculateExpectedShortfall(varResult: ValueAtRisk): number;
/**
 * Perform Monte Carlo simulation for VaR.
 *
 * @param {number} portfolioValue - Portfolio value
 * @param {number} volatility - Volatility
 * @param {number} drift - Expected return (drift)
 * @param {number} simulations - Number of simulations
 * @param {number} holdingPeriod - Holding period in days
 * @returns {Promise<ValueAtRisk>} VaR from Monte Carlo
 *
 * @example
 * ```typescript
 * const mcVar = await performMonteCarloVaR(10000000, 0.15, 0.08, 10000, 1);
 * ```
 */
export declare function performMonteCarloVaR(portfolioValue: number, volatility: number, drift: number, simulations?: number, holdingPeriod?: number): Promise<ValueAtRisk>;
/**
 * Calculate market risk for specific asset class.
 *
 * @param {string} assetClass - Asset class (equity, fixed-income, commodity, etc.)
 * @param {number} exposure - Exposure amount
 * @param {Record<string, number>} marketData - Market data (volatility, beta, etc.)
 * @returns {Promise<MarketRisk>} Market risk assessment
 *
 * @example
 * ```typescript
 * const risk = await calculateMarketRisk('equity', 5000000, {
 *   volatility: 0.20,
 *   beta: 1.2
 * });
 * ```
 */
export declare function calculateMarketRisk(assetClass: string, exposure: number, marketData: Record<string, number>): Promise<MarketRisk>;
/**
 * Perform stress testing on portfolio.
 *
 * @param {number} portfolioValue - Portfolio value
 * @param {StressTestScenario[]} scenarios - Stress scenarios
 * @returns {Promise<Record<string, any>>} Stress test results
 *
 * @example
 * ```typescript
 * const results = await performStressTest(10000000, scenarios);
 * ```
 */
export declare function performStressTest(portfolioValue: number, scenarios: StressTestScenario[]): Promise<Record<string, any>>;
/**
 * Calculate portfolio beta and systematic risk.
 *
 * @param {Array<{weight: number, beta: number}>} holdings - Portfolio holdings
 * @returns {number} Portfolio beta
 *
 * @example
 * ```typescript
 * const beta = calculatePortfolioBeta([
 *   { weight: 0.4, beta: 1.2 },
 *   { weight: 0.6, beta: 0.8 }
 * ]);
 * // Returns: 0.96
 * ```
 */
export declare function calculatePortfolioBeta(holdings: Array<{
    weight: number;
    beta: number;
}>): number;
/**
 * Calculate Sharpe ratio for risk-adjusted returns.
 *
 * @param {number} portfolioReturn - Portfolio return
 * @param {number} riskFreeRate - Risk-free rate
 * @param {number} standardDeviation - Portfolio standard deviation
 * @returns {number} Sharpe ratio
 *
 * @example
 * ```typescript
 * const sharpe = calculateSharpeRatio(0.12, 0.02, 0.15);
 * // Returns: 0.67
 * ```
 */
export declare function calculateSharpeRatio(portfolioReturn: number, riskFreeRate: number, standardDeviation: number): number;
/**
 * Monitor market risk limits and generate alerts.
 *
 * @param {MarketRisk[]} risks - Market risks
 * @param {Record<string, number>} limits - Risk limits
 * @returns {Promise<Array<{assetClass: string, breach: string}>>} Limit breaches
 *
 * @example
 * ```typescript
 * const breaches = await monitorMarketRiskLimits(risks, { equity: 1000000 });
 * ```
 */
export declare function monitorMarketRiskLimits(risks: MarketRisk[], limits: Record<string, number>): Promise<Array<{
    assetClass: string;
    breach: string;
    excess: number;
}>>;
/**
 * Calculate regulatory capital requirements per Basel III.
 *
 * @param {number} riskWeightedAssets - Total RWA
 * @param {Record<string, number>} capitalBuffers - Required capital buffers
 * @returns {Promise<RegulatoryCapital>} Capital requirements
 *
 * @example
 * ```typescript
 * const capital = await calculateRegulatoryCapital(100000000, {
 *   conservation: 0.025,
 *   countercyclical: 0.01
 * });
 * ```
 */
export declare function calculateRegulatoryCapital(riskWeightedAssets: number, capitalBuffers: Record<string, number>): Promise<RegulatoryCapital>;
/**
 * Generate risk compliance report for regulators.
 *
 * @param {string} entityId - Entity identifier
 * @param {string} reportingPeriod - Reporting period
 * @param {Record<string, any>} riskData - Risk data
 * @returns {Promise<Record<string, any>>} Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateRiskComplianceReport('ORG_001', '2025-Q1', riskData);
 * ```
 */
export declare function generateRiskComplianceReport(entityId: string, reportingPeriod: string, riskData: Record<string, any>): Promise<Record<string, any>>;
/**
 * Assess operational risk using loss data.
 *
 * @param {Array<{category: string, loss: number, frequency: number}>} lossData - Loss event data
 * @returns {Promise<OperationalRisk[]>} Operational risk assessments
 *
 * @example
 * ```typescript
 * const opRisk = await assessOperationalRisk([
 *   { category: 'fraud', loss: 50000, frequency: 2 },
 *   { category: 'systems', loss: 100000, frequency: 1 }
 * ]);
 * ```
 */
export declare function assessOperationalRisk(lossData: Array<{
    category: string;
    loss: number;
    frequency: number;
}>): Promise<OperationalRisk[]>;
/**
 * Generate integrated risk dashboard for executives.
 *
 * @param {string} entityId - Entity identifier
 * @param {Date} asOfDate - As-of date
 * @returns {Promise<Record<string, any>>} Executive risk dashboard
 *
 * @example
 * ```typescript
 * const dashboard = await generateExecutiveRiskDashboard('ORG_001', new Date());
 * ```
 */
export declare function generateExecutiveRiskDashboard(entityId: string, asOfDate: Date): Promise<Record<string, any>>;
export {};
//# sourceMappingURL=financial-risk-management-kit.d.ts.map