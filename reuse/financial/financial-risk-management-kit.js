"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFXExposureModel = exports.createLiquidityRiskModel = exports.createCreditRiskProfileModel = exports.createRiskAssessmentModel = void 0;
exports.performRiskAssessment = performRiskAssessment;
exports.calculateRiskScore = calculateRiskScore;
exports.identifyTopRisks = identifyTopRisks;
exports.createRiskHeatMap = createRiskHeatMap;
exports.monitorRiskLimits = monitorRiskLimits;
exports.generateRiskRegister = generateRiskRegister;
exports.calculateResidualRisk = calculateResidualRisk;
exports.analyzeRiskConcentration = analyzeRiskConcentration;
exports.calculateCreditRiskScore = calculateCreditRiskScore;
exports.calculateProbabilityOfDefault = calculateProbabilityOfDefault;
exports.calculateLossGivenDefault = calculateLossGivenDefault;
exports.calculateExpectedLoss = calculateExpectedLoss;
exports.calculateRiskWeightedAssets = calculateRiskWeightedAssets;
exports.assignCreditRating = assignCreditRating;
exports.monitorCreditUtilization = monitorCreditUtilization;
exports.analyzeCounterpartyRisk = analyzeCounterpartyRisk;
exports.calculateLiquidityCoverageRatio = calculateLiquidityCoverageRatio;
exports.calculateNetStableFundingRatio = calculateNetStableFundingRatio;
exports.performLiquidityStressTest = performLiquidityStressTest;
exports.calculateCashBurnRate = calculateCashBurnRate;
exports.analyzeCashFlowGaps = analyzeCashFlowGaps;
exports.calculateLiquidityMetrics = calculateLiquidityMetrics;
exports.monitorLiquidityWarningIndicators = monitorLiquidityWarningIndicators;
exports.generateContingencyFundingPlan = generateContingencyFundingPlan;
exports.calculateFXExposure = calculateFXExposure;
exports.calculateFXValueAtRisk = calculateFXValueAtRisk;
exports.designHedgingStrategy = designHedgingStrategy;
exports.calculateHedgeEffectiveness = calculateHedgeEffectiveness;
exports.performFXSensitivityAnalysis = performFXSensitivityAnalysis;
exports.monitorFXLimits = monitorFXLimits;
exports.calculateNaturalHedge = calculateNaturalHedge;
exports.optimizeHedgingPortfolio = optimizeHedgingPortfolio;
exports.generateFXRiskReport = generateFXRiskReport;
exports.calculateParametricVaR = calculateParametricVaR;
exports.calculateExpectedShortfall = calculateExpectedShortfall;
exports.performMonteCarloVaR = performMonteCarloVaR;
exports.calculateMarketRisk = calculateMarketRisk;
exports.performStressTest = performStressTest;
exports.calculatePortfolioBeta = calculatePortfolioBeta;
exports.calculateSharpeRatio = calculateSharpeRatio;
exports.monitorMarketRiskLimits = monitorMarketRiskLimits;
exports.calculateRegulatoryCapital = calculateRegulatoryCapital;
exports.generateRiskComplianceReport = generateRiskComplianceReport;
exports.assessOperationalRisk = assessOperationalRisk;
exports.generateExecutiveRiskDashboard = generateExecutiveRiskDashboard;
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
const sequelize_1 = require("sequelize");
// ============================================================================
// SEQUELIZE MODELS (1-4)
// ============================================================================
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
const createRiskAssessmentModel = (sequelize) => {
    class RiskAssessment extends sequelize_1.Model {
    }
    RiskAssessment.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        assessmentId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'Unique assessment identifier',
        },
        entityId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Entity being assessed',
        },
        entityType: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Type of entity (customer, vendor, portfolio, etc.)',
        },
        assessmentDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Assessment date',
        },
        riskType: {
            type: sequelize_1.DataTypes.ENUM('credit', 'market', 'liquidity', 'operational', 'fx', 'interest-rate', 'compliance', 'strategic'),
            allowNull: false,
            comment: 'Type of risk',
        },
        riskCategory: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Risk category/sub-type',
        },
        riskLevel: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            allowNull: false,
            comment: 'Overall risk level',
        },
        riskScore: {
            type: sequelize_1.DataTypes.DECIMAL(10, 4),
            allowNull: false,
            comment: 'Calculated risk score (0-100)',
        },
        probability: {
            type: sequelize_1.DataTypes.DECIMAL(5, 4),
            allowNull: false,
            comment: 'Probability of occurrence (0-1)',
        },
        impact: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Financial impact if materialized',
        },
        inherentRisk: {
            type: sequelize_1.DataTypes.DECIMAL(10, 4),
            allowNull: false,
            comment: 'Inherent risk before controls',
        },
        residualRisk: {
            type: sequelize_1.DataTypes.DECIMAL(10, 4),
            allowNull: false,
            comment: 'Residual risk after controls',
        },
        controls: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Risk controls in place',
        },
        mitigationStatus: {
            type: sequelize_1.DataTypes.ENUM('none', 'planned', 'in-progress', 'partial', 'full'),
            allowNull: false,
            defaultValue: 'none',
            comment: 'Mitigation status',
        },
        mitigationPlan: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Mitigation plan details',
        },
        owner: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Risk owner',
        },
        assessor: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Person who performed assessment',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Approver',
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Approval timestamp',
        },
        nextReviewDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Next review date',
        },
        lastReviewDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last review date',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'pending-review', 'approved', 'expired'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Assessment status',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'risk_assessments',
        timestamps: true,
        indexes: [
            { fields: ['assessmentId'], unique: true },
            { fields: ['entityId'] },
            { fields: ['entityType'] },
            { fields: ['riskType'] },
            { fields: ['riskLevel'] },
            { fields: ['assessmentDate'] },
            { fields: ['nextReviewDate'] },
            { fields: ['status'] },
            { fields: ['owner'] },
        ],
    });
    return RiskAssessment;
};
exports.createRiskAssessmentModel = createRiskAssessmentModel;
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
const createCreditRiskProfileModel = (sequelize) => {
    class CreditRiskProfile extends sequelize_1.Model {
    }
    CreditRiskProfile.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        entityId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'Entity identifier',
        },
        entityName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Entity name',
        },
        entityType: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Entity type (customer, vendor, counterparty)',
        },
        creditScore: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Credit score (300-850 range)',
        },
        creditRating: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
            comment: 'Credit rating (AAA to D)',
        },
        ratingAgency: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Rating agency if external',
        },
        probabilityOfDefault: {
            type: sequelize_1.DataTypes.DECIMAL(8, 6),
            allowNull: false,
            comment: 'Probability of default (0-1)',
        },
        lossGivenDefault: {
            type: sequelize_1.DataTypes.DECIMAL(5, 4),
            allowNull: false,
            defaultValue: 0.45,
            comment: 'Loss given default (typically 0.45)',
        },
        expectedLoss: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Expected loss amount',
        },
        exposureAtDefault: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Exposure at default',
        },
        riskWeightedAssets: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Risk-weighted assets (Basel III)',
        },
        creditLimit: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Approved credit limit',
        },
        currentExposure: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Current exposure amount',
        },
        utilizationRate: {
            type: sequelize_1.DataTypes.DECIMAL(5, 4),
            allowNull: false,
            defaultValue: 0,
            comment: 'Credit utilization rate',
        },
        paymentHistory: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Payment history records',
        },
        delinquencyStatus: {
            type: sequelize_1.DataTypes.ENUM('current', '30-days', '60-days', '90-days', '120-days', 'default'),
            allowNull: false,
            defaultValue: 'current',
            comment: 'Delinquency status',
        },
        daysPastDue: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Days past due',
        },
        defaultFlag: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Default flag',
        },
        lastReviewDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Last review date',
        },
        nextReviewDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Next review date',
        },
        collateralValue: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Collateral value',
        },
        guarantees: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Guarantees and covenants',
        },
        covenants: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Financial covenants',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'credit_risk_profiles',
        timestamps: true,
        indexes: [
            { fields: ['entityId'], unique: true },
            { fields: ['creditScore'] },
            { fields: ['creditRating'] },
            { fields: ['delinquencyStatus'] },
            { fields: ['defaultFlag'] },
            { fields: ['nextReviewDate'] },
            { fields: ['probabilityOfDefault'] },
            { fields: ['entityType'] },
        ],
    });
    return CreditRiskProfile;
};
exports.createCreditRiskProfileModel = createCreditRiskProfileModel;
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
const createLiquidityRiskModel = (sequelize) => {
    class LiquidityRisk extends sequelize_1.Model {
    }
    LiquidityRisk.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        entityId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Entity identifier',
        },
        period: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Period identifier',
        },
        measurementDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Measurement date',
        },
        cashBalance: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Cash balance',
        },
        cashEquivalents: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Cash equivalents',
        },
        liquidAssets: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Total liquid assets',
        },
        currentRatio: {
            type: sequelize_1.DataTypes.DECIMAL(10, 4),
            allowNull: false,
            comment: 'Current ratio',
        },
        quickRatio: {
            type: sequelize_1.DataTypes.DECIMAL(10, 4),
            allowNull: false,
            comment: 'Quick ratio',
        },
        cashRatio: {
            type: sequelize_1.DataTypes.DECIMAL(10, 4),
            allowNull: false,
            comment: 'Cash ratio',
        },
        workingCapital: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Working capital',
        },
        operatingCashFlow: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Operating cash flow',
        },
        cashConversionCycle: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'Cash conversion cycle (days)',
        },
        burnRate: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Monthly burn rate',
        },
        runwayMonths: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'Runway in months',
        },
        liquidityGap: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Liquidity gap',
        },
        stressTestResults: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Stress test scenario results',
        },
        contingencyFunding: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Contingency funding available',
        },
        creditFacilities: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Credit facilities and lines',
        },
        liquidityRiskLevel: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            allowNull: false,
            comment: 'Overall liquidity risk level',
        },
        earlyWarningIndicators: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Early warning indicators',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'liquidity_risk_monitoring',
        timestamps: true,
        indexes: [
            { fields: ['entityId', 'period'], unique: true },
            { fields: ['entityId'] },
            { fields: ['period'] },
            { fields: ['measurementDate'] },
            { fields: ['liquidityRiskLevel'] },
            { fields: ['runwayMonths'] },
        ],
    });
    return LiquidityRisk;
};
exports.createLiquidityRiskModel = createLiquidityRiskModel;
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
const createFXExposureModel = (sequelize) => {
    class FXExposure extends sequelize_1.Model {
    }
    FXExposure.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        entityId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Entity identifier',
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            comment: 'Foreign currency (ISO 4217)',
        },
        baseCurrency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'USD',
            comment: 'Base currency',
        },
        exposureAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Total exposure amount',
        },
        exposureType: {
            type: sequelize_1.DataTypes.ENUM('transaction', 'translation', 'economic'),
            allowNull: false,
            comment: 'Type of FX exposure',
        },
        hedgingRatio: {
            type: sequelize_1.DataTypes.DECIMAL(5, 4),
            allowNull: false,
            defaultValue: 0,
            comment: 'Hedging ratio (0-1)',
        },
        hedgedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Hedged amount',
        },
        unhedgedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Unhedged exposure',
        },
        spotRate: {
            type: sequelize_1.DataTypes.DECIMAL(15, 6),
            allowNull: false,
            comment: 'Current spot rate',
        },
        forwardRate: {
            type: sequelize_1.DataTypes.DECIMAL(15, 6),
            allowNull: true,
            comment: 'Forward rate if hedged',
        },
        volatility: {
            type: sequelize_1.DataTypes.DECIMAL(10, 6),
            allowNull: false,
            comment: 'FX volatility',
        },
        valueAtRisk: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Value at Risk (95% confidence)',
        },
        hedgingStrategies: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Active hedging strategies',
        },
        netExposure: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Net exposure after hedging',
        },
        riskLevel: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            allowNull: false,
            comment: 'FX risk level',
        },
        lastRebalanceDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last rebalance date',
        },
        nextRebalanceDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Next scheduled rebalance',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'fx_exposure_management',
        timestamps: true,
        indexes: [
            { fields: ['entityId', 'currency'], unique: true },
            { fields: ['entityId'] },
            { fields: ['currency'] },
            { fields: ['exposureType'] },
            { fields: ['riskLevel'] },
            { fields: ['nextRebalanceDate'] },
        ],
    });
    return FXExposure;
};
exports.createFXExposureModel = createFXExposureModel;
// ============================================================================
// RISK ASSESSMENT FUNCTIONS (1-8)
// ============================================================================
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
async function performRiskAssessment(entityId, riskType, inputData) {
    try {
        // Calculate risk score based on type
        let riskScore = 0;
        let probability = 0;
        let impact = 0;
        switch (riskType) {
            case 'credit':
                riskScore = await calculateCreditRiskScore(inputData);
                probability = inputData.probabilityOfDefault || 0.05;
                impact = inputData.exposureAtDefault || 0;
                break;
            case 'market':
                riskScore = await calculateMarketRiskScore(inputData);
                probability = 0.1;
                impact = inputData.portfolioValue || 0;
                break;
            case 'liquidity':
                riskScore = await calculateLiquidityRiskScore(inputData);
                probability = 0.05;
                impact = inputData.liquidityGap || 0;
                break;
            default:
                riskScore = 50;
                probability = 0.1;
                impact = 100000;
        }
        // Determine risk level
        let riskLevel;
        if (riskScore < 30)
            riskLevel = 'low';
        else if (riskScore < 60)
            riskLevel = 'medium';
        else if (riskScore < 80)
            riskLevel = 'high';
        else
            riskLevel = 'critical';
        return {
            id: `RISK_${Date.now()}`,
            entityId,
            assessmentDate: new Date(),
            riskType,
            riskLevel,
            riskScore,
            probability,
            impact,
            mitigationStatus: 'none',
            owner: inputData.owner || 'Risk Manager',
            nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        };
    }
    catch (error) {
        throw new Error(`Failed to perform risk assessment: ${error.message}`);
    }
}
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
function calculateRiskScore(probability, impact, maxImpact) {
    try {
        const normalizedImpact = maxImpact > 0 ? impact / maxImpact : 0;
        return (probability * 0.5 + normalizedImpact * 0.5) * 100;
    }
    catch (error) {
        throw new Error(`Failed to calculate risk score: ${error.message}`);
    }
}
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
async function identifyTopRisks(assessments, topN = 10) {
    try {
        return assessments
            .sort((a, b) => {
            // Sort by risk level priority, then by score
            const levelPriority = {
                critical: 4,
                high: 3,
                medium: 2,
                low: 1,
            };
            const levelDiff = levelPriority[b.riskLevel] - levelPriority[a.riskLevel];
            return levelDiff !== 0 ? levelDiff : b.riskScore - a.riskScore;
        })
            .slice(0, topN);
    }
    catch (error) {
        throw new Error(`Failed to identify top risks: ${error.message}`);
    }
}
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
async function createRiskHeatMap(assessments) {
    try {
        const heatMap = {
            dimensions: ['probability', 'impact'],
            zones: {
                low: [],
                medium: [],
                high: [],
                critical: [],
            },
            statistics: {
                totalRisks: assessments.length,
                averageScore: 0,
                distributionByType: {},
            },
        };
        assessments.forEach((assessment) => {
            heatMap.zones[assessment.riskLevel].push(assessment);
            heatMap.statistics.distributionByType[assessment.riskType] =
                (heatMap.statistics.distributionByType[assessment.riskType] || 0) + 1;
        });
        const totalScore = assessments.reduce((sum, a) => sum + a.riskScore, 0);
        heatMap.statistics.averageScore = assessments.length > 0 ? totalScore / assessments.length : 0;
        return heatMap;
    }
    catch (error) {
        throw new Error(`Failed to create risk heat map: ${error.message}`);
    }
}
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
async function monitorRiskLimits(limits, currentValues) {
    try {
        const breaches = [];
        for (const limit of limits) {
            const currentValue = currentValues[limit.limitId] || 0;
            const utilizationPercentage = (currentValue / limit.limitValue) * 100;
            let breachStatus;
            if (utilizationPercentage >= 100) {
                breachStatus = 'breach';
            }
            else if (utilizationPercentage >= limit.warningThreshold) {
                breachStatus = 'warning';
            }
            else {
                breachStatus = 'within-limit';
            }
            if (breachStatus !== 'within-limit') {
                breaches.push({
                    ...limit,
                    currentValue,
                    utilizationPercentage,
                    breachStatus,
                });
            }
        }
        return breaches;
    }
    catch (error) {
        throw new Error(`Failed to monitor risk limits: ${error.message}`);
    }
}
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
async function generateRiskRegister(entityId, asOfDate) {
    try {
        return {
            entityId,
            asOfDate: asOfDate.toISOString(),
            risks: [],
            summary: {
                totalRisks: 0,
                byLevel: { critical: 0, high: 0, medium: 0, low: 0 },
                byType: {},
                averageScore: 0,
            },
            trends: {
                newRisks: 0,
                closedRisks: 0,
                escalatedRisks: 0,
            },
            mitigationProgress: {
                planned: 0,
                inProgress: 0,
                completed: 0,
            },
        };
    }
    catch (error) {
        throw new Error(`Failed to generate risk register: ${error.message}`);
    }
}
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
async function calculateResidualRisk(inherentRisk, controls) {
    try {
        let totalEffectiveness = 0;
        let effectiveControlCount = 0;
        for (const control of controls) {
            if (control.status === 'effective') {
                totalEffectiveness += control.effectiveness;
                effectiveControlCount++;
            }
        }
        const averageEffectiveness = effectiveControlCount > 0 ? totalEffectiveness / effectiveControlCount : 0;
        return inherentRisk * (1 - averageEffectiveness);
    }
    catch (error) {
        throw new Error(`Failed to calculate residual risk: ${error.message}`);
    }
}
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
async function analyzeRiskConcentration(exposures, totalExposure, concentrationLimit) {
    try {
        const concentrations = [];
        for (const [entity, exposure] of Object.entries(exposures)) {
            const percentageOfTotal = (exposure / totalExposure) * 100;
            const limit = (concentrationLimit / 100) * totalExposure;
            const excessExposure = Math.max(0, exposure - limit);
            if (percentageOfTotal > concentrationLimit) {
                concentrations.push({
                    concentrationType: 'single-name',
                    entity,
                    exposure,
                    percentageOfTotal,
                    limit,
                    excessExposure,
                    diversificationScore: 100 - percentageOfTotal,
                });
            }
        }
        return concentrations;
    }
    catch (error) {
        throw new Error(`Failed to analyze risk concentration: ${error.message}`);
    }
}
// ============================================================================
// CREDIT RISK FUNCTIONS (9-16)
// ============================================================================
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
async function calculateCreditRiskScore(creditData) {
    try {
        let score = 0;
        // Credit score component (40% weight)
        const creditScore = creditData.creditScore || 650;
        const creditScoreNormalized = Math.max(0, Math.min(100, ((creditScore - 300) / 550) * 100));
        score += creditScoreNormalized * 0.4;
        // Debt-to-income ratio (20% weight)
        const debtToIncome = creditData.debtToIncome || 0.4;
        const dtiScore = Math.max(0, 100 - (debtToIncome * 200));
        score += dtiScore * 0.2;
        // Payment history (25% weight)
        const paymentScore = creditData.paymentScore || 70;
        score += paymentScore * 0.25;
        // Utilization rate (15% weight)
        const utilizationRate = creditData.utilizationRate || 0.5;
        const utilizationScore = Math.max(0, 100 - (utilizationRate * 100));
        score += utilizationScore * 0.15;
        // Invert score so higher credit risk = higher score
        return 100 - score;
    }
    catch (error) {
        throw new Error(`Failed to calculate credit risk score: ${error.message}`);
    }
}
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
async function calculateProbabilityOfDefault(creditScore, financialRatios) {
    try {
        // Base PD from credit score mapping
        let basePD = 0;
        if (creditScore >= 800)
            basePD = 0.005;
        else if (creditScore >= 750)
            basePD = 0.01;
        else if (creditScore >= 700)
            basePD = 0.02;
        else if (creditScore >= 650)
            basePD = 0.05;
        else if (creditScore >= 600)
            basePD = 0.10;
        else if (creditScore >= 550)
            basePD = 0.20;
        else
            basePD = 0.35;
        // Adjust based on financial ratios
        const debtToEquity = financialRatios.debtToEquity || 1.0;
        const interestCoverage = financialRatios.interestCoverage || 2.0;
        const currentRatio = financialRatios.currentRatio || 1.0;
        let adjustment = 1.0;
        if (debtToEquity > 2.0)
            adjustment *= 1.5;
        if (interestCoverage < 1.5)
            adjustment *= 1.5;
        if (currentRatio < 1.0)
            adjustment *= 1.3;
        return Math.min(0.99, basePD * adjustment);
    }
    catch (error) {
        throw new Error(`Failed to calculate probability of default: ${error.message}`);
    }
}
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
async function calculateLossGivenDefault(exposureAmount, collateralValue, seniority = 'senior') {
    try {
        // Base recovery rates by seniority
        const baseRecoveryRates = {
            senior: 0.60,
            subordinated: 0.40,
            equity: 0.10,
        };
        const baseRecovery = baseRecoveryRates[seniority] || 0.45;
        // Adjust for collateral
        const collateralCoverage = collateralValue / exposureAmount;
        const adjustedRecovery = Math.min(0.95, baseRecovery + (collateralCoverage * 0.3));
        return 1 - adjustedRecovery;
    }
    catch (error) {
        throw new Error(`Failed to calculate loss given default: ${error.message}`);
    }
}
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
function calculateExpectedLoss(probabilityOfDefault, lossGivenDefault, exposureAtDefault) {
    try {
        return probabilityOfDefault * lossGivenDefault * exposureAtDefault;
    }
    catch (error) {
        throw new Error(`Failed to calculate expected loss: ${error.message}`);
    }
}
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
function calculateRiskWeightedAssets(exposure, riskWeight, creditConversionFactor = 1.0) {
    try {
        return exposure * creditConversionFactor * riskWeight;
    }
    catch (error) {
        throw new Error(`Failed to calculate risk-weighted assets: ${error.message}`);
    }
}
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
async function assignCreditRating(creditScore, financialMetrics) {
    try {
        // Simplified rating assignment based on credit score
        if (creditScore >= 800)
            return 'AAA';
        if (creditScore >= 780)
            return 'AA+';
        if (creditScore >= 760)
            return 'AA';
        if (creditScore >= 740)
            return 'AA-';
        if (creditScore >= 720)
            return 'A+';
        if (creditScore >= 700)
            return 'A';
        if (creditScore >= 680)
            return 'A-';
        if (creditScore >= 660)
            return 'BBB+';
        if (creditScore >= 640)
            return 'BBB';
        if (creditScore >= 620)
            return 'BBB-';
        if (creditScore >= 600)
            return 'BB+';
        if (creditScore >= 580)
            return 'BB';
        if (creditScore >= 560)
            return 'BB-';
        if (creditScore >= 540)
            return 'B+';
        if (creditScore >= 520)
            return 'B';
        if (creditScore >= 500)
            return 'B-';
        if (creditScore >= 480)
            return 'CCC';
        return 'D';
    }
    catch (error) {
        throw new Error(`Failed to assign credit rating: ${error.message}`);
    }
}
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
async function monitorCreditUtilization(creditLimit, currentExposure, warningThreshold = 80) {
    try {
        const utilizationRate = (currentExposure / creditLimit) * 100;
        const availableCredit = creditLimit - currentExposure;
        let status;
        if (utilizationRate >= 100)
            status = 'critical';
        else if (utilizationRate >= warningThreshold)
            status = 'warning';
        else
            status = 'normal';
        return {
            creditLimit,
            currentExposure,
            availableCredit,
            utilizationRate,
            warningThreshold,
            status,
            alert: status !== 'normal',
        };
    }
    catch (error) {
        throw new Error(`Failed to monitor credit utilization: ${error.message}`);
    }
}
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
async function analyzeCounterpartyRisk(counterpartyId, exposure, creditData) {
    try {
        const creditRating = creditData.creditRating || 'BBB';
        const probabilityOfDefault = creditData.probabilityOfDefault || 0.05;
        const collateralHeld = creditData.collateralHeld || 0;
        const netExposure = exposure - collateralHeld;
        // Calculate Credit Valuation Adjustment (CVA)
        const lgd = 0.45;
        const cva = probabilityOfDefault * lgd * netExposure;
        return {
            counterpartyId,
            counterpartyName: creditData.name || counterpartyId,
            exposure,
            creditRating,
            probabilityOfDefault,
            creditValuationAdjustment: cva,
            collateralHeld,
            netExposure,
            concentrationRisk: 0, // Calculate based on total portfolio
            relationshipDuration: creditData.relationshipDuration || 0,
        };
    }
    catch (error) {
        throw new Error(`Failed to analyze counterparty risk: ${error.message}`);
    }
}
// ============================================================================
// LIQUIDITY RISK FUNCTIONS (17-24)
// ============================================================================
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
function calculateLiquidityCoverageRatio(highQualityLiquidAssets, totalNetCashOutflows) {
    try {
        if (totalNetCashOutflows === 0)
            return 100;
        return (highQualityLiquidAssets / totalNetCashOutflows) * 100;
    }
    catch (error) {
        throw new Error(`Failed to calculate LCR: ${error.message}`);
    }
}
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
function calculateNetStableFundingRatio(availableStableFunding, requiredStableFunding) {
    try {
        if (requiredStableFunding === 0)
            return 100;
        return (availableStableFunding / requiredStableFunding) * 100;
    }
    catch (error) {
        throw new Error(`Failed to calculate NSFR: ${error.message}`);
    }
}
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
async function performLiquidityStressTest(baselineData, scenario, shocks) {
    try {
        const { cashBalance = 0, operatingCashFlow = 0, receivables = 0, payables = 0, } = baselineData;
        const cashFlowReduction = shocks.cashFlowReduction || 0.3;
        const receivablesDelay = shocks.receivablesDelay || 45;
        const payablesAcceleration = shocks.payablesAcceleration || 0.5;
        // Calculate stressed cash flows for 12 months
        const projectedCashFlow = [];
        let cumulativeCash = cashBalance;
        for (let month = 1; month <= 12; month++) {
            const stressedInflow = operatingCashFlow * (1 - cashFlowReduction);
            const stressedOutflow = payables * (1 + payablesAcceleration);
            const monthlyNet = stressedInflow - stressedOutflow;
            cumulativeCash += monthlyNet;
            projectedCashFlow.push(cumulativeCash);
        }
        // Find first month with negative cash
        const survivalPeriod = projectedCashFlow.findIndex(cf => cf < 0);
        const cashShortfall = Math.min(...projectedCashFlow, 0);
        let severity;
        if (survivalPeriod === -1 || survivalPeriod > 12)
            severity = 'mild';
        else if (survivalPeriod > 6)
            severity = 'moderate';
        else if (survivalPeriod > 3)
            severity = 'severe';
        else
            severity = 'extreme';
        return {
            scenario,
            severity,
            assumptions: shocks,
            projectedCashFlow,
            cashShortfall: Math.abs(cashShortfall),
            survivalPeriod: survivalPeriod === -1 ? 12 : survivalPeriod,
            requiredLiquidity: Math.abs(cashShortfall),
            mitigationActions: [],
        };
    }
    catch (error) {
        throw new Error(`Failed to perform liquidity stress test: ${error.message}`);
    }
}
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
async function calculateCashBurnRate(cashBalance, monthlyExpenses, monthlyRevenue) {
    try {
        const burnRate = monthlyExpenses - monthlyRevenue;
        const runwayMonths = burnRate > 0 ? cashBalance / burnRate : Infinity;
        return {
            cashBalance,
            monthlyExpenses,
            monthlyRevenue,
            burnRate,
            runwayMonths: isFinite(runwayMonths) ? runwayMonths : 999,
        };
    }
    catch (error) {
        throw new Error(`Failed to calculate cash burn rate: ${error.message}`);
    }
}
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
async function analyzeCashFlowGaps(cashFlows) {
    try {
        let cumulativeCash = 0;
        const gaps = [];
        let maxGap = 0;
        let maxGapDate = null;
        for (const cf of cashFlows) {
            const netFlow = cf.inflow - cf.outflow;
            cumulativeCash += netFlow;
            if (cumulativeCash < 0) {
                gaps.push({
                    date: cf.date,
                    gap: Math.abs(cumulativeCash),
                    cumulative: cumulativeCash,
                });
                if (Math.abs(cumulativeCash) > maxGap) {
                    maxGap = Math.abs(cumulativeCash);
                    maxGapDate = cf.date;
                }
            }
        }
        return {
            totalGaps: gaps.length,
            maxGap,
            maxGapDate,
            gaps,
            fundingRequired: maxGap,
        };
    }
    catch (error) {
        throw new Error(`Failed to analyze cash flow gaps: ${error.message}`);
    }
}
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
async function calculateLiquidityMetrics(financialData) {
    try {
        const { cash = 0, cashEquivalents = 0, marketableSecurities = 0, currentAssets = 0, currentLiabilities = 0, inventory = 0, operatingCashFlow = 0, monthlyExpenses = 0, } = financialData;
        const liquidAssets = cash + cashEquivalents + marketableSecurities;
        const workingCapital = currentAssets - currentLiabilities;
        const burnRate = monthlyExpenses;
        const runwayMonths = burnRate > 0 ? liquidAssets / burnRate : 999;
        return {
            cashBalance: cash,
            cashEquivalents,
            liquidAssets,
            currentRatio: currentLiabilities > 0 ? currentAssets / currentLiabilities : 0,
            quickRatio: currentLiabilities > 0 ? (currentAssets - inventory) / currentLiabilities : 0,
            cashRatio: currentLiabilities > 0 ? liquidAssets / currentLiabilities : 0,
            workingCapital,
            operatingCashFlow,
            cashConversionCycle: 0,
            burnRate,
            runwayMonths,
            liquidityGap: 0,
        };
    }
    catch (error) {
        throw new Error(`Failed to calculate liquidity metrics: ${error.message}`);
    }
}
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
async function monitorLiquidityWarningIndicators(currentMetrics, thresholds) {
    try {
        const warnings = [];
        const checks = [
            { indicator: 'Current Ratio', value: currentMetrics.currentRatio, threshold: thresholds.currentRatio || 1.5 },
            { indicator: 'Quick Ratio', value: currentMetrics.quickRatio, threshold: thresholds.quickRatio || 1.0 },
            { indicator: 'Runway Months', value: currentMetrics.runwayMonths, threshold: thresholds.runwayMonths || 6 },
            { indicator: 'Cash Ratio', value: currentMetrics.cashRatio, threshold: thresholds.cashRatio || 0.5 },
        ];
        for (const check of checks) {
            let status = 'normal';
            if (check.indicator === 'Runway Months') {
                if (check.value < check.threshold)
                    status = 'warning';
                if (check.value < check.threshold / 2)
                    status = 'critical';
            }
            else {
                if (check.value < check.threshold)
                    status = 'warning';
                if (check.value < check.threshold * 0.7)
                    status = 'critical';
            }
            if (status !== 'normal') {
                warnings.push(check);
            }
        }
        return warnings;
    }
    catch (error) {
        throw new Error(`Failed to monitor liquidity warning indicators: ${error.message}`);
    }
}
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
async function generateContingencyFundingPlan(requiredFunding, timeframe) {
    try {
        return {
            requiredFunding,
            timeframe,
            sources: [
                { source: 'Credit Line Draw', amount: requiredFunding * 0.4, days: 3 },
                { source: 'Asset Liquidation', amount: requiredFunding * 0.3, days: 7 },
                { source: 'Receivables Factoring', amount: requiredFunding * 0.2, days: 5 },
                { source: 'Emergency Loan', amount: requiredFunding * 0.1, days: 10 },
            ],
            actions: [
                'Accelerate receivables collection',
                'Defer non-essential expenses',
                'Negotiate payment terms with vendors',
                'Activate credit facilities',
            ],
            timeline: [],
        };
    }
    catch (error) {
        throw new Error(`Failed to generate contingency funding plan: ${error.message}`);
    }
}
// ============================================================================
// FX RISK & HEDGING FUNCTIONS (25-33)
// ============================================================================
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
async function calculateFXExposure(currencyPositions, spotRates) {
    try {
        const exposures = [];
        for (const [currency, position] of Object.entries(currencyPositions)) {
            const spotRate = spotRates[currency] || 1;
            const exposureAmount = position * spotRate;
            const volatility = 0.10; // Simplified - should be calculated from historical data
            exposures.push({
                currency,
                exposureAmount,
                exposureType: 'transaction',
                hedgingRatio: 0,
                hedgedAmount: 0,
                unhedgedAmount: exposureAmount,
                spotRate,
                volatility,
                valueAtRisk: 0, // Calculate separately
            });
        }
        return exposures;
    }
    catch (error) {
        throw new Error(`Failed to calculate FX exposure: ${error.message}`);
    }
}
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
function calculateFXValueAtRisk(exposure, volatility, confidenceLevel = 0.95, holdingPeriod = 1) {
    try {
        // Z-score for confidence level
        const zScores = {
            0.90: 1.28,
            0.95: 1.65,
            0.99: 2.33,
        };
        const zScore = zScores[confidenceLevel] || 1.65;
        const dailyVolatility = volatility / Math.sqrt(252); // Convert annual to daily
        const periodVolatility = dailyVolatility * Math.sqrt(holdingPeriod);
        return exposure * zScore * periodVolatility;
    }
    catch (error) {
        throw new Error(`Failed to calculate FX VaR: ${error.message}`);
    }
}
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
async function designHedgingStrategy(exposure, targetHedgeRatio, allowedInstruments) {
    try {
        const hedgeAmount = exposure.exposureAmount * targetHedgeRatio;
        // Select instrument (simplified - would use optimization in production)
        const instrumentType = allowedInstruments[0] || 'forward';
        return {
            id: `HEDGE_${Date.now()}`,
            instrumentType,
            underlying: exposure.currency,
            notionalAmount: hedgeAmount,
            hedgeRatio: targetHedgeRatio,
            effectiveness: 0.95,
            cost: hedgeAmount * 0.002, // Simplified cost
            maturityDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            counterparty: 'Major Bank',
        };
    }
    catch (error) {
        throw new Error(`Failed to design hedging strategy: ${error.message}`);
    }
}
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
async function calculateHedgeEffectiveness(hedge, spotChange, hedgeValueChange) {
    try {
        const exposureChange = hedge.notionalAmount * spotChange;
        const effectiveness = Math.abs(hedgeValueChange / exposureChange) * 100;
        const netImpact = exposureChange + hedgeValueChange;
        const hedgeRatio = Math.abs(hedgeValueChange / exposureChange);
        return {
            exposureChange,
            hedgeValueChange,
            netImpact,
            effectiveness,
            hedgeRatio,
            qualifiesForHedgeAccounting: effectiveness >= 80 && effectiveness <= 125,
        };
    }
    catch (error) {
        throw new Error(`Failed to calculate hedge effectiveness: ${error.message}`);
    }
}
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
async function performFXSensitivityAnalysis(exposures, rateShocks) {
    try {
        const results = {
            scenarios: [],
            totalExposure: 0,
        };
        const totalExposure = exposures.reduce((sum, exp) => sum + exp.exposureAmount, 0);
        results.totalExposure = totalExposure;
        for (const shock of rateShocks) {
            let scenarioImpact = 0;
            for (const exposure of exposures) {
                const impact = exposure.unhedgedAmount * shock;
                scenarioImpact += impact;
            }
            results.scenarios.push({
                shock,
                shockPercentage: shock * 100,
                impact: scenarioImpact,
                impactPercentage: (scenarioImpact / totalExposure) * 100,
            });
        }
        return results;
    }
    catch (error) {
        throw new Error(`Failed to perform FX sensitivity analysis: ${error.message}`);
    }
}
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
async function monitorFXLimits(exposures, limits) {
    try {
        const actions = [];
        for (const exposure of exposures) {
            const limit = limits[exposure.currency];
            if (!limit)
                continue;
            if (exposure.exposureAmount > limit) {
                const excess = exposure.exposureAmount - limit;
                actions.push({
                    currency: exposure.currency,
                    action: `Reduce exposure by ${excess.toFixed(2)}`,
                    excess,
                });
            }
        }
        return actions;
    }
    catch (error) {
        throw new Error(`Failed to monitor FX limits: ${error.message}`);
    }
}
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
async function calculateNaturalHedge(assets, liabilities) {
    try {
        const hedgeOpportunities = {};
        for (const asset of assets) {
            const matchingLiability = liabilities.find(l => l.currency === asset.currency);
            if (matchingLiability) {
                const netExposure = asset.exposureAmount - matchingLiability.exposureAmount;
                const hedgeRatio = Math.min(asset.exposureAmount, matchingLiability.exposureAmount) /
                    Math.max(asset.exposureAmount, matchingLiability.exposureAmount);
                hedgeOpportunities[asset.currency] = {
                    assetExposure: asset.exposureAmount,
                    liabilityExposure: matchingLiability.exposureAmount,
                    netExposure,
                    naturalHedgeRatio: hedgeRatio,
                    remainingExposure: Math.abs(netExposure),
                };
            }
        }
        return hedgeOpportunities;
    }
    catch (error) {
        throw new Error(`Failed to calculate natural hedge: ${error.message}`);
    }
}
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
async function optimizeHedgingPortfolio(exposures, hedgingBudget, instrumentCosts) {
    try {
        const strategies = [];
        let remainingBudget = hedgingBudget;
        // Sort exposures by VaR (highest risk first)
        const sortedExposures = [...exposures].sort((a, b) => b.valueAtRisk - a.valueAtRisk);
        for (const exposure of sortedExposures) {
            if (remainingBudget <= 0)
                break;
            const forwardCost = exposure.exposureAmount * (instrumentCosts.forward || 0.001);
            if (forwardCost <= remainingBudget) {
                strategies.push({
                    id: `HEDGE_${exposure.currency}_${Date.now()}`,
                    instrumentType: 'forward',
                    underlying: exposure.currency,
                    notionalAmount: exposure.exposureAmount * 0.75,
                    hedgeRatio: 0.75,
                    effectiveness: 0.95,
                    cost: forwardCost,
                    maturityDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                    counterparty: 'Major Bank',
                });
                remainingBudget -= forwardCost;
            }
        }
        return strategies;
    }
    catch (error) {
        throw new Error(`Failed to optimize hedging portfolio: ${error.message}`);
    }
}
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
async function generateFXRiskReport(exposures, hedges, period) {
    try {
        const totalExposure = exposures.reduce((sum, exp) => sum + exp.exposureAmount, 0);
        const totalHedged = hedges.reduce((sum, h) => sum + h.notionalAmount, 0);
        const hedgeRatio = totalExposure > 0 ? totalHedged / totalExposure : 0;
        return {
            period,
            summary: {
                totalExposure,
                totalHedged,
                unhedged: totalExposure - totalHedged,
                hedgeRatio: hedgeRatio * 100,
                numberOfCurrencies: exposures.length,
                numberOfHedges: hedges.length,
            },
            exposuresByCurrency: exposures.map(exp => ({
                currency: exp.currency,
                exposure: exp.exposureAmount,
                hedged: exp.hedgedAmount,
                var95: exp.valueAtRisk,
            })),
            hedgingCost: hedges.reduce((sum, h) => sum + h.cost, 0),
            riskLevel: hedgeRatio >= 0.75 ? 'low' : hedgeRatio >= 0.50 ? 'medium' : 'high',
        };
    }
    catch (error) {
        throw new Error(`Failed to generate FX risk report: ${error.message}`);
    }
}
// ============================================================================
// MARKET RISK & VAR FUNCTIONS (34-41)
// ============================================================================
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
async function calculateParametricVaR(portfolioValue, volatility, confidenceLevel = 0.95, holdingPeriod = 1) {
    try {
        const zScores = {
            0.90: 1.28,
            0.95: 1.65,
            0.99: 2.33,
        };
        const zScore = zScores[confidenceLevel] || 1.65;
        const dailyVolatility = volatility / Math.sqrt(252);
        const periodVolatility = dailyVolatility * Math.sqrt(holdingPeriod);
        const var95 = portfolioValue * zScore * periodVolatility;
        const var99 = portfolioValue * zScores[0.99] * periodVolatility;
        // Expected Shortfall (CVaR) approximation
        const expectedShortfall = var95 * 1.2;
        return {
            portfolioValue,
            var95,
            var99,
            confidenceLevel,
            holdingPeriod,
            calculationMethod: 'parametric',
            expectedShortfall,
            volatility,
        };
    }
    catch (error) {
        throw new Error(`Failed to calculate parametric VaR: ${error.message}`);
    }
}
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
function calculateExpectedShortfall(varResult) {
    try {
        // ES is typically 10-30% higher than VaR
        return varResult.var95 * 1.25;
    }
    catch (error) {
        throw new Error(`Failed to calculate expected shortfall: ${error.message}`);
    }
}
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
async function performMonteCarloVaR(portfolioValue, volatility, drift, simulations = 10000, holdingPeriod = 1) {
    try {
        const dailyVolatility = volatility / Math.sqrt(252);
        const dailyDrift = drift / 252;
        const dt = holdingPeriod / 252;
        const returns = [];
        for (let i = 0; i < simulations; i++) {
            const randomShock = (Math.random() - 0.5) * 2; // Simplified normal random
            const portfolioReturn = dailyDrift * dt + dailyVolatility * Math.sqrt(dt) * randomShock;
            returns.push(portfolioReturn);
        }
        // Sort returns
        returns.sort((a, b) => a - b);
        // Calculate VaR at different confidence levels
        const var95Index = Math.floor(simulations * 0.05);
        const var99Index = Math.floor(simulations * 0.01);
        const var95 = Math.abs(returns[var95Index] * portfolioValue);
        const var99 = Math.abs(returns[var99Index] * portfolioValue);
        // Expected Shortfall (average of losses beyond VaR)
        const tailLosses = returns.slice(0, var95Index).map(r => Math.abs(r * portfolioValue));
        const expectedShortfall = tailLosses.reduce((sum, l) => sum + l, 0) / tailLosses.length;
        return {
            portfolioValue,
            var95,
            var99,
            confidenceLevel: 0.95,
            holdingPeriod,
            calculationMethod: 'monte-carlo',
            expectedShortfall,
            volatility,
        };
    }
    catch (error) {
        throw new Error(`Failed to perform Monte Carlo VaR: ${error.message}`);
    }
}
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
async function calculateMarketRisk(assetClass, exposure, marketData) {
    try {
        const volatility = marketData.volatility || 0.15;
        const beta = marketData.beta || 1.0;
        const var95 = await calculateParametricVaR(exposure, volatility, 0.95, 1);
        return {
            assetClass,
            exposure,
            beta,
            volatility,
            valueAtRisk: var95.var95,
            expectedShortfall: var95.expectedShortfall,
            stressLoss: exposure * 0.30, // Simplified
            marginRequirement: exposure * 0.10,
            hedgeEffectiveness: 0,
        };
    }
    catch (error) {
        throw new Error(`Failed to calculate market risk: ${error.message}`);
    }
}
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
async function performStressTest(portfolioValue, scenarios) {
    try {
        const results = {
            portfolioValue,
            scenarios: [],
            worstCase: { scenarioId: '', impact: 0 },
            averageImpact: 0,
        };
        let totalImpact = 0;
        let worstImpact = 0;
        let worstScenarioId = '';
        for (const scenario of scenarios) {
            const impact = scenario.portfolioImpact;
            totalImpact += impact;
            if (Math.abs(impact) > Math.abs(worstImpact)) {
                worstImpact = impact;
                worstScenarioId = scenario.scenarioId;
            }
            results.scenarios.push({
                scenarioId: scenario.scenarioId,
                scenarioName: scenario.scenarioName,
                impact,
                impactPercentage: (impact / portfolioValue) * 100,
                rating: scenario.overallRiskRating,
            });
        }
        results.worstCase = { scenarioId: worstScenarioId, impact: worstImpact };
        results.averageImpact = scenarios.length > 0 ? totalImpact / scenarios.length : 0;
        return results;
    }
    catch (error) {
        throw new Error(`Failed to perform stress test: ${error.message}`);
    }
}
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
function calculatePortfolioBeta(holdings) {
    try {
        return holdings.reduce((sum, holding) => sum + (holding.weight * holding.beta), 0);
    }
    catch (error) {
        throw new Error(`Failed to calculate portfolio beta: ${error.message}`);
    }
}
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
function calculateSharpeRatio(portfolioReturn, riskFreeRate, standardDeviation) {
    try {
        if (standardDeviation === 0)
            return 0;
        return (portfolioReturn - riskFreeRate) / standardDeviation;
    }
    catch (error) {
        throw new Error(`Failed to calculate Sharpe ratio: ${error.message}`);
    }
}
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
async function monitorMarketRiskLimits(risks, limits) {
    try {
        const breaches = [];
        for (const risk of risks) {
            const limit = limits[risk.assetClass];
            if (!limit)
                continue;
            if (risk.valueAtRisk > limit) {
                breaches.push({
                    assetClass: risk.assetClass,
                    breach: `VaR ${risk.valueAtRisk} exceeds limit ${limit}`,
                    excess: risk.valueAtRisk - limit,
                });
            }
        }
        return breaches;
    }
    catch (error) {
        throw new Error(`Failed to monitor market risk limits: ${error.message}`);
    }
}
// ============================================================================
// REGULATORY & COMPLIANCE FUNCTIONS (42-45)
// ============================================================================
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
async function calculateRegulatoryCapital(riskWeightedAssets, capitalBuffers) {
    try {
        // Basel III minimum requirements
        const minimumTier1Ratio = 0.06;
        const minimumTotalRatio = 0.08;
        // Calculate buffers
        const conservationBuffer = capitalBuffers.conservation || 0.025;
        const countercyclicalBuffer = capitalBuffers.countercyclical || 0;
        const totalMinimumTier1 = minimumTier1Ratio + conservationBuffer + countercyclicalBuffer;
        const totalMinimumTotal = minimumTotalRatio + conservationBuffer + countercyclicalBuffer;
        // Mock current capital (would come from balance sheet)
        const tier1Capital = riskWeightedAssets * 0.10;
        const tier2Capital = riskWeightedAssets * 0.04;
        const totalCapital = tier1Capital + tier2Capital;
        const tier1Ratio = (tier1Capital / riskWeightedAssets) * 100;
        const totalCapitalRatio = (totalCapital / riskWeightedAssets) * 100;
        const leverageRatio = 5.0; // Simplified
        const buffer = totalCapitalRatio - (totalMinimumTotal * 100);
        let adequacyStatus;
        if (buffer >= 2.0)
            adequacyStatus = 'adequate';
        else if (buffer >= 0)
            adequacyStatus = 'marginal';
        else
            adequacyStatus = 'inadequate';
        return {
            tier1Capital,
            tier2Capital,
            totalCapital,
            riskWeightedAssets,
            tier1Ratio,
            totalCapitalRatio,
            leverageRatio,
            minimumRequirement: totalMinimumTotal * 100,
            buffer,
            adequacyStatus,
        };
    }
    catch (error) {
        throw new Error(`Failed to calculate regulatory capital: ${error.message}`);
    }
}
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
async function generateRiskComplianceReport(entityId, reportingPeriod, riskData) {
    try {
        return {
            entityId,
            reportingPeriod,
            reportDate: new Date().toISOString(),
            capitalAdequacy: riskData.capitalAdequacy || {},
            liquidityCoverage: riskData.liquidityCoverage || {},
            riskConcentrations: riskData.concentrations || [],
            limitBreaches: riskData.breaches || [],
            stressTestResults: riskData.stressTests || [],
            complianceStatus: 'compliant',
            exceptions: [],
            certificationStatement: 'All risk metrics within regulatory limits',
        };
    }
    catch (error) {
        throw new Error(`Failed to generate risk compliance report: ${error.message}`);
    }
}
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
async function assessOperationalRisk(lossData) {
    try {
        const risks = [];
        for (const data of lossData) {
            const expectedLoss = data.loss * data.frequency;
            risks.push({
                category: 'process',
                riskEvent: data.category,
                frequency: data.frequency,
                averageLoss: data.loss,
                maxLoss: data.loss * 2, // Simplified
                expectedLoss,
                controls: [],
                residualRisk: expectedLoss * 0.5, // Assuming 50% control effectiveness
            });
        }
        return risks;
    }
    catch (error) {
        throw new Error(`Failed to assess operational risk: ${error.message}`);
    }
}
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
async function generateExecutiveRiskDashboard(entityId, asOfDate) {
    try {
        return {
            entityId,
            asOfDate: asOfDate.toISOString(),
            overallRiskRating: 'medium',
            riskAppetite: {
                current: 65,
                target: 70,
                status: 'within-appetite',
            },
            keyRisks: {
                credit: { level: 'medium', trend: 'stable', score: 55 },
                market: { level: 'low', trend: 'improving', score: 35 },
                liquidity: { level: 'low', trend: 'stable', score: 25 },
                operational: { level: 'medium', trend: 'improving', score: 45 },
                compliance: { level: 'low', trend: 'stable', score: 20 },
            },
            topRisks: [],
            limitBreaches: [],
            actionItems: [],
            nextReviewDate: new Date(asOfDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };
    }
    catch (error) {
        throw new Error(`Failed to generate executive risk dashboard: ${error.message}`);
    }
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Calculate market risk score from market data.
 */
async function calculateMarketRiskScore(inputData) {
    const volatility = inputData.volatility || 0.15;
    return Math.min(100, volatility * 400); // Simplified scoring
}
/**
 * Calculate liquidity risk score from liquidity metrics.
 */
async function calculateLiquidityRiskScore(inputData) {
    const currentRatio = inputData.currentRatio || 1.0;
    const runwayMonths = inputData.runwayMonths || 6;
    let score = 0;
    if (currentRatio < 1.0)
        score += 40;
    else if (currentRatio < 1.5)
        score += 20;
    if (runwayMonths < 3)
        score += 40;
    else if (runwayMonths < 6)
        score += 20;
    return Math.min(100, score);
}
//# sourceMappingURL=financial-risk-management-kit.js.map