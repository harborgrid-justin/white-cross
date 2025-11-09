"use strict";
/**
 * LOC: CONSFIN78901
 * File: /reuse/consulting/financial-modeling-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Consulting engagement services
 *   - Financial advisory controllers
 *   - Valuation and M&A modules
 *   - Strategic planning services
 */
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateBreakEvenDto = exports.CreateLBOModelDto = exports.CalculateWACCDto = exports.CalculateIRRDto = exports.CalculateNPVDto = exports.CreateScenarioDto = exports.RunSensitivityAnalysisDto = exports.UpdateModelAssumptionsDto = exports.CreateFinancialModelDto = exports.createMergerModelModel = exports.createLBOModelModel = exports.createValuationComparableModel = exports.createFinancialModelModel = exports.SensitivityParameter = exports.CashFlowType = exports.TerminalValueMethod = exports.ValuationApproach = exports.ScenarioType = exports.ModelingMethodology = void 0;
exports.calculateNPV = calculateNPV;
exports.calculateIRR = calculateIRR;
exports.calculateWACC = calculateWACC;
exports.performDCFValuation = performDCFValuation;
exports.calculateTerminalValuePerpetualGrowth = calculateTerminalValuePerpetualGrowth;
exports.calculateTerminalValueExitMultiple = calculateTerminalValueExitMultiple;
exports.calculateEquityValue = calculateEquityValue;
exports.performSensitivityAnalysis = performSensitivityAnalysis;
exports.performTwoWaySensitivity = performTwoWaySensitivity;
exports.generateTornadoChart = generateTornadoChart;
exports.createScenarioAnalysis = createScenarioAnalysis;
exports.calculateExpectedValue = calculateExpectedValue;
exports.performMonteCarloSimulation = performMonteCarloSimulation;
exports.calculateImpliedMultiples = calculateImpliedMultiples;
exports.performComparableCompanyAnalysis = performComparableCompanyAnalysis;
exports.performPrecedentTransactionAnalysis = performPrecedentTransactionAnalysis;
exports.buildLBOModel = buildLBOModel;
exports.calculateLBOReturnsAttribution = calculateLBOReturnsAttribution;
exports.calculateBreakEvenAnalysis = calculateBreakEvenAnalysis;
exports.calculateAccretionDilution = calculateAccretionDilution;
/**
 * File: /reuse/consulting/financial-modeling-kit.ts
 * Locator: WC-CONS-FINMODEL-001
 * Purpose: McKinsey/BCG-Level Financial Modeling - DCF, NPV, IRR, sensitivity analysis, scenario modeling, valuation frameworks
 *
 * Upstream: Independent financial modeling utility module
 * Downstream: ../backend/*, Consulting controllers, Advisory services, M&A modules, Valuation engines
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Decimal.js, mathjs
 * Exports: 50+ utility functions for DCF analysis, NPV/IRR, sensitivity analysis, scenario modeling, financial forecasting, valuation
 *
 * LLM Context: Enterprise-grade financial modeling competing with McKinsey and BCG capabilities.
 * Provides comprehensive discounted cash flow (DCF) analysis, net present value (NPV) calculations, internal rate of return (IRR),
 * modified internal rate of return (MIRR), sensitivity analysis, scenario modeling, Monte Carlo simulation, financial statement modeling,
 * revenue forecasting, cost modeling, capital structure optimization, working capital analysis, break-even analysis, valuation multiples,
 * comparable company analysis, precedent transaction analysis, leveraged buyout (LBO) modeling, merger modeling, accretion/dilution analysis,
 * terminal value calculation, weighted average cost of capital (WACC), enterprise value calculation, equity value bridges, and integrated
 * 3-statement financial models with audit trails and compliance tracking.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
var ModelingMethodology;
(function (ModelingMethodology) {
    ModelingMethodology["DCF"] = "dcf";
    ModelingMethodology["COMPARABLE_COMPANY"] = "comparable-company";
    ModelingMethodology["PRECEDENT_TRANSACTION"] = "precedent-transaction";
    ModelingMethodology["LBO"] = "lbo";
    ModelingMethodology["SUM_OF_PARTS"] = "sum-of-parts";
    ModelingMethodology["ASSET_BASED"] = "asset-based";
})(ModelingMethodology || (exports.ModelingMethodology = ModelingMethodology = {}));
var ScenarioType;
(function (ScenarioType) {
    ScenarioType["BASE_CASE"] = "base-case";
    ScenarioType["BEST_CASE"] = "best-case";
    ScenarioType["WORST_CASE"] = "worst-case";
    ScenarioType["DOWNSIDE"] = "downside";
    ScenarioType["UPSIDE"] = "upside";
    ScenarioType["CUSTOM"] = "custom";
})(ScenarioType || (exports.ScenarioType = ScenarioType = {}));
var ValuationApproach;
(function (ValuationApproach) {
    ValuationApproach["INCOME"] = "income";
    ValuationApproach["MARKET"] = "market";
    ValuationApproach["ASSET"] = "asset";
    ValuationApproach["HYBRID"] = "hybrid";
})(ValuationApproach || (exports.ValuationApproach = ValuationApproach = {}));
var TerminalValueMethod;
(function (TerminalValueMethod) {
    TerminalValueMethod["PERPETUITY_GROWTH"] = "perpetuity-growth";
    TerminalValueMethod["EXIT_MULTIPLE"] = "exit-multiple";
    TerminalValueMethod["SALVAGE_VALUE"] = "salvage-value";
})(TerminalValueMethod || (exports.TerminalValueMethod = TerminalValueMethod = {}));
var CashFlowType;
(function (CashFlowType) {
    CashFlowType["FREE_CASH_FLOW_FIRM"] = "fcff";
    CashFlowType["FREE_CASH_FLOW_EQUITY"] = "fcfe";
    CashFlowType["UNLEVERED_FREE_CASH_FLOW"] = "ufcf";
    CashFlowType["LEVERED_FREE_CASH_FLOW"] = "lfcf";
})(CashFlowType || (exports.CashFlowType = CashFlowType = {}));
var SensitivityParameter;
(function (SensitivityParameter) {
    SensitivityParameter["REVENUE_GROWTH"] = "revenue-growth";
    SensitivityParameter["MARGIN"] = "margin";
    SensitivityParameter["DISCOUNT_RATE"] = "discount-rate";
    SensitivityParameter["TERMINAL_GROWTH"] = "terminal-growth";
    SensitivityParameter["CAPEX"] = "capex";
    SensitivityParameter["WORKING_CAPITAL"] = "working-capital";
})(SensitivityParameter || (exports.SensitivityParameter = SensitivityParameter = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Financial Models with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FinancialModel model
 *
 * @example
 * ```typescript
 * const FinancialModel = createFinancialModelModel(sequelize);
 * const model = await FinancialModel.create({
 *   modelName: 'TechCorp Valuation 2024',
 *   companyId: 'TECH_001',
 *   methodology: 'dcf',
 *   projectionYears: 5
 * });
 * ```
 */
const createFinancialModelModel = (sequelize) => {
    class FinancialModel extends sequelize_1.Model {
    }
    FinancialModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        modelId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'Unique model identifier',
        },
        modelName: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Financial model name',
        },
        companyId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Company identifier',
        },
        companyName: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Company name',
        },
        methodology: {
            type: sequelize_1.DataTypes.ENUM('dcf', 'comparable-company', 'precedent-transaction', 'lbo', 'sum-of-parts', 'asset-based'),
            allowNull: false,
            comment: 'Valuation methodology',
        },
        valuationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Valuation date',
        },
        fiscalYearEnd: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Fiscal year end date',
        },
        projectionYears: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
            comment: 'Number of projection years',
        },
        baseYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Base year for projections',
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'USD',
            comment: 'Currency (ISO 4217)',
        },
        assumptions: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Model assumptions',
        },
        financialStatements: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Historical and projected financial statements',
        },
        cashFlowProjections: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Cash flow projections',
        },
        valuation: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Valuation results',
        },
        scenarios: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Scenario analysis results',
        },
        sensitivityAnalysis: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Sensitivity analysis results',
        },
        modelVersion: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: 'Model version number',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'review', 'approved', 'archived'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Model status',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Approver identifier',
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Approval timestamp',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Creator identifier',
        },
    }, {
        sequelize,
        tableName: 'financial_models',
        timestamps: true,
        indexes: [
            { fields: ['modelId'], unique: true },
            { fields: ['companyId'] },
            { fields: ['methodology'] },
            { fields: ['valuationDate'] },
            { fields: ['status'] },
            { fields: ['createdBy'] },
            { fields: ['createdAt'] },
        ],
    });
    return FinancialModel;
};
exports.createFinancialModelModel = createFinancialModelModel;
/**
 * Sequelize model for Valuation Comparables.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ValuationComparable model
 */
const createValuationComparableModel = (sequelize) => {
    class ValuationComparable extends sequelize_1.Model {
    }
    ValuationComparable.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        comparableId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'Comparable identifier',
        },
        companyName: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Company name',
        },
        ticker: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            comment: 'Stock ticker',
        },
        industry: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Industry classification',
        },
        sector: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Sector classification',
        },
        marketCap: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Market capitalization',
        },
        enterpriseValue: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Enterprise value',
        },
        revenue: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Revenue (LTM)',
        },
        ebitda: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'EBITDA (LTM)',
        },
        ebit: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'EBIT (LTM)',
        },
        netIncome: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Net income (LTM)',
        },
        totalAssets: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Total assets',
        },
        totalDebt: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Total debt',
        },
        cash: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Cash and equivalents',
        },
        evToRevenue: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'EV/Revenue multiple',
        },
        evToEbitda: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'EV/EBITDA multiple',
        },
        evToEbit: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'EV/EBIT multiple',
        },
        peRatio: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'P/E ratio',
        },
        pbRatio: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'P/B ratio',
        },
        revenueGrowth: {
            type: sequelize_1.DataTypes.DECIMAL(10, 4),
            allowNull: false,
            comment: 'Revenue growth rate',
        },
        ebitdaMargin: {
            type: sequelize_1.DataTypes.DECIMAL(10, 4),
            allowNull: false,
            comment: 'EBITDA margin',
        },
        netMargin: {
            type: sequelize_1.DataTypes.DECIMAL(10, 4),
            allowNull: false,
            comment: 'Net margin',
        },
        roe: {
            type: sequelize_1.DataTypes.DECIMAL(10, 4),
            allowNull: false,
            comment: 'Return on equity',
        },
        roa: {
            type: sequelize_1.DataTypes.DECIMAL(10, 4),
            allowNull: false,
            comment: 'Return on assets',
        },
        asOfDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Data as-of date',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'valuation_comparables',
        timestamps: true,
        indexes: [
            { fields: ['comparableId'], unique: true },
            { fields: ['ticker'] },
            { fields: ['industry'] },
            { fields: ['sector'] },
            { fields: ['asOfDate'] },
            { fields: ['evToEbitda'] },
        ],
    });
    return ValuationComparable;
};
exports.createValuationComparableModel = createValuationComparableModel;
/**
 * Sequelize model for LBO Models.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LBOModel model
 */
const createLBOModelModel = (sequelize) => {
    class LBOModel extends sequelize_1.Model {
    }
    LBOModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        lboId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'LBO model identifier',
        },
        modelName: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'LBO model name',
        },
        targetCompany: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Target company name',
        },
        sponsor: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'PE sponsor/firm name',
        },
        purchasePrice: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Purchase price',
        },
        enterpriseValue: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Enterprise value at entry',
        },
        equityContribution: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Equity contribution',
        },
        debtFinancing: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Total debt financing',
        },
        ltv: {
            type: sequelize_1.DataTypes.DECIMAL(5, 4),
            allowNull: false,
            comment: 'Loan-to-value ratio',
        },
        entryMultiple: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'Entry EV/EBITDA multiple',
        },
        exitMultiple: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'Exit EV/EBITDA multiple',
        },
        holdingPeriod: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Holding period in years',
        },
        exitYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Exit year',
        },
        exitEnterpriseValue: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Enterprise value at exit',
        },
        equityProceeds: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Equity proceeds at exit',
        },
        moic: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'Multiple on invested capital',
        },
        irr: {
            type: sequelize_1.DataTypes.DECIMAL(10, 4),
            allowNull: false,
            comment: 'Internal rate of return',
        },
        cashFlows: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Annual cash flows',
        },
        debtSchedule: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Debt paydown schedule',
        },
        sourcesUses: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Sources and uses of funds',
        },
        returnAnalysis: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Return attribution analysis',
        },
        sensitivityAnalysis: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Sensitivity analysis',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'review', 'approved', 'executed', 'archived'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Model status',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Creator identifier',
        },
    }, {
        sequelize,
        tableName: 'lbo_models',
        timestamps: true,
        indexes: [
            { fields: ['lboId'], unique: true },
            { fields: ['targetCompany'] },
            { fields: ['sponsor'] },
            { fields: ['exitYear'] },
            { fields: ['irr'] },
            { fields: ['status'] },
            { fields: ['createdBy'] },
        ],
    });
    return LBOModel;
};
exports.createLBOModelModel = createLBOModelModel;
/**
 * Sequelize model for Merger Models.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} MergerModel model
 */
const createMergerModelModel = (sequelize) => {
    class MergerModel extends sequelize_1.Model {
    }
    MergerModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        mergerId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'Merger model identifier',
        },
        modelName: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Merger model name',
        },
        acquirorCompany: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Acquiror company name',
        },
        targetCompany: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Target company name',
        },
        purchasePrice: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Total purchase price',
        },
        paymentMethod: {
            type: sequelize_1.DataTypes.ENUM('cash', 'stock', 'mixed'),
            allowNull: false,
            comment: 'Payment method',
        },
        exchangeRatio: {
            type: sequelize_1.DataTypes.DECIMAL(10, 6),
            allowNull: true,
            comment: 'Stock exchange ratio',
        },
        cashComponent: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Cash component of consideration',
        },
        stockComponent: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Stock component of consideration',
        },
        synergies: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Synergy assumptions',
        },
        proFormaFinancials: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Pro forma combined financials',
        },
        accretionDilution: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Accretion/dilution analysis',
        },
        combinedMetrics: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Combined company metrics',
        },
        premiumPaid: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Premium paid over market value',
        },
        premiumPercent: {
            type: sequelize_1.DataTypes.DECIMAL(10, 4),
            allowNull: false,
            comment: 'Premium percentage',
        },
        dealMultiples: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Deal valuation multiples',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'review', 'approved', 'announced', 'closed', 'archived'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Model status',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Creator identifier',
        },
    }, {
        sequelize,
        tableName: 'merger_models',
        timestamps: true,
        indexes: [
            { fields: ['mergerId'], unique: true },
            { fields: ['acquirorCompany'] },
            { fields: ['targetCompany'] },
            { fields: ['paymentMethod'] },
            { fields: ['status'] },
            { fields: ['createdBy'] },
        ],
    });
    return MergerModel;
};
exports.createMergerModelModel = createMergerModelModel;
// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================
let CreateFinancialModelDto = (() => {
    var _a;
    let _modelName_decorators;
    let _modelName_initializers = [];
    let _modelName_extraInitializers = [];
    let _companyId_decorators;
    let _companyId_initializers = [];
    let _companyId_extraInitializers = [];
    let _companyName_decorators;
    let _companyName_initializers = [];
    let _companyName_extraInitializers = [];
    let _methodology_decorators;
    let _methodology_initializers = [];
    let _methodology_extraInitializers = [];
    let _valuationDate_decorators;
    let _valuationDate_initializers = [];
    let _valuationDate_extraInitializers = [];
    let _fiscalYearEnd_decorators;
    let _fiscalYearEnd_initializers = [];
    let _fiscalYearEnd_extraInitializers = [];
    let _projectionYears_decorators;
    let _projectionYears_initializers = [];
    let _projectionYears_extraInitializers = [];
    let _baseYear_decorators;
    let _baseYear_initializers = [];
    let _baseYear_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _assumptions_decorators;
    let _assumptions_initializers = [];
    let _assumptions_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    return _a = class CreateFinancialModelDto {
            constructor() {
                this.modelName = __runInitializers(this, _modelName_initializers, void 0);
                this.companyId = (__runInitializers(this, _modelName_extraInitializers), __runInitializers(this, _companyId_initializers, void 0));
                this.companyName = (__runInitializers(this, _companyId_extraInitializers), __runInitializers(this, _companyName_initializers, void 0));
                this.methodology = (__runInitializers(this, _companyName_extraInitializers), __runInitializers(this, _methodology_initializers, void 0));
                this.valuationDate = (__runInitializers(this, _methodology_extraInitializers), __runInitializers(this, _valuationDate_initializers, void 0));
                this.fiscalYearEnd = (__runInitializers(this, _valuationDate_extraInitializers), __runInitializers(this, _fiscalYearEnd_initializers, void 0));
                this.projectionYears = (__runInitializers(this, _fiscalYearEnd_extraInitializers), __runInitializers(this, _projectionYears_initializers, void 0));
                this.baseYear = (__runInitializers(this, _projectionYears_extraInitializers), __runInitializers(this, _baseYear_initializers, void 0));
                this.currency = (__runInitializers(this, _baseYear_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                this.assumptions = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _assumptions_initializers, void 0));
                this.createdBy = (__runInitializers(this, _assumptions_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
                __runInitializers(this, _createdBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _modelName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Model name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(500)];
            _companyId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Company identifier' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _companyName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Company name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _methodology_decorators = [(0, swagger_1.ApiProperty)({ enum: ModelingMethodology, description: 'Valuation methodology' }), (0, class_validator_1.IsEnum)(ModelingMethodology)];
            _valuationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Valuation date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _fiscalYearEnd_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal year end date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _projectionYears_decorators = [(0, swagger_1.ApiProperty)({ description: 'Number of projection years' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(20)];
            _baseYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Base year for projections' }), (0, class_validator_1.IsNumber)()];
            _currency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Currency code (ISO 4217)', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(3)];
            _assumptions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Model assumptions' }), (0, class_validator_1.IsNotEmpty)()];
            _createdBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Creator user ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _modelName_decorators, { kind: "field", name: "modelName", static: false, private: false, access: { has: obj => "modelName" in obj, get: obj => obj.modelName, set: (obj, value) => { obj.modelName = value; } }, metadata: _metadata }, _modelName_initializers, _modelName_extraInitializers);
            __esDecorate(null, null, _companyId_decorators, { kind: "field", name: "companyId", static: false, private: false, access: { has: obj => "companyId" in obj, get: obj => obj.companyId, set: (obj, value) => { obj.companyId = value; } }, metadata: _metadata }, _companyId_initializers, _companyId_extraInitializers);
            __esDecorate(null, null, _companyName_decorators, { kind: "field", name: "companyName", static: false, private: false, access: { has: obj => "companyName" in obj, get: obj => obj.companyName, set: (obj, value) => { obj.companyName = value; } }, metadata: _metadata }, _companyName_initializers, _companyName_extraInitializers);
            __esDecorate(null, null, _methodology_decorators, { kind: "field", name: "methodology", static: false, private: false, access: { has: obj => "methodology" in obj, get: obj => obj.methodology, set: (obj, value) => { obj.methodology = value; } }, metadata: _metadata }, _methodology_initializers, _methodology_extraInitializers);
            __esDecorate(null, null, _valuationDate_decorators, { kind: "field", name: "valuationDate", static: false, private: false, access: { has: obj => "valuationDate" in obj, get: obj => obj.valuationDate, set: (obj, value) => { obj.valuationDate = value; } }, metadata: _metadata }, _valuationDate_initializers, _valuationDate_extraInitializers);
            __esDecorate(null, null, _fiscalYearEnd_decorators, { kind: "field", name: "fiscalYearEnd", static: false, private: false, access: { has: obj => "fiscalYearEnd" in obj, get: obj => obj.fiscalYearEnd, set: (obj, value) => { obj.fiscalYearEnd = value; } }, metadata: _metadata }, _fiscalYearEnd_initializers, _fiscalYearEnd_extraInitializers);
            __esDecorate(null, null, _projectionYears_decorators, { kind: "field", name: "projectionYears", static: false, private: false, access: { has: obj => "projectionYears" in obj, get: obj => obj.projectionYears, set: (obj, value) => { obj.projectionYears = value; } }, metadata: _metadata }, _projectionYears_initializers, _projectionYears_extraInitializers);
            __esDecorate(null, null, _baseYear_decorators, { kind: "field", name: "baseYear", static: false, private: false, access: { has: obj => "baseYear" in obj, get: obj => obj.baseYear, set: (obj, value) => { obj.baseYear = value; } }, metadata: _metadata }, _baseYear_initializers, _baseYear_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _assumptions_decorators, { kind: "field", name: "assumptions", static: false, private: false, access: { has: obj => "assumptions" in obj, get: obj => obj.assumptions, set: (obj, value) => { obj.assumptions = value; } }, metadata: _metadata }, _assumptions_initializers, _assumptions_extraInitializers);
            __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateFinancialModelDto = CreateFinancialModelDto;
let UpdateModelAssumptionsDto = (() => {
    var _a;
    let _revenueGrowthRates_decorators;
    let _revenueGrowthRates_initializers = [];
    let _revenueGrowthRates_extraInitializers = [];
    let _ebitdaMargins_decorators;
    let _ebitdaMargins_initializers = [];
    let _ebitdaMargins_extraInitializers = [];
    let _taxRate_decorators;
    let _taxRate_initializers = [];
    let _taxRate_extraInitializers = [];
    let _discountRate_decorators;
    let _discountRate_initializers = [];
    let _discountRate_extraInitializers = [];
    let _terminalGrowthRate_decorators;
    let _terminalGrowthRate_initializers = [];
    let _terminalGrowthRate_extraInitializers = [];
    let _terminalMultiple_decorators;
    let _terminalMultiple_initializers = [];
    let _terminalMultiple_extraInitializers = [];
    let _capexAsPercentRevenue_decorators;
    let _capexAsPercentRevenue_initializers = [];
    let _capexAsPercentRevenue_extraInitializers = [];
    let _nwcAsPercentRevenue_decorators;
    let _nwcAsPercentRevenue_initializers = [];
    let _nwcAsPercentRevenue_extraInitializers = [];
    return _a = class UpdateModelAssumptionsDto {
            constructor() {
                this.revenueGrowthRates = __runInitializers(this, _revenueGrowthRates_initializers, void 0);
                this.ebitdaMargins = (__runInitializers(this, _revenueGrowthRates_extraInitializers), __runInitializers(this, _ebitdaMargins_initializers, void 0));
                this.taxRate = (__runInitializers(this, _ebitdaMargins_extraInitializers), __runInitializers(this, _taxRate_initializers, void 0));
                this.discountRate = (__runInitializers(this, _taxRate_extraInitializers), __runInitializers(this, _discountRate_initializers, void 0));
                this.terminalGrowthRate = (__runInitializers(this, _discountRate_extraInitializers), __runInitializers(this, _terminalGrowthRate_initializers, void 0));
                this.terminalMultiple = (__runInitializers(this, _terminalGrowthRate_extraInitializers), __runInitializers(this, _terminalMultiple_initializers, void 0));
                this.capexAsPercentRevenue = (__runInitializers(this, _terminalMultiple_extraInitializers), __runInitializers(this, _capexAsPercentRevenue_initializers, void 0));
                this.nwcAsPercentRevenue = (__runInitializers(this, _capexAsPercentRevenue_extraInitializers), __runInitializers(this, _nwcAsPercentRevenue_initializers, void 0));
                __runInitializers(this, _nwcAsPercentRevenue_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _revenueGrowthRates_decorators = [(0, swagger_1.ApiProperty)({ description: 'Revenue growth rates by year', required: false }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            _ebitdaMargins_decorators = [(0, swagger_1.ApiProperty)({ description: 'EBITDA margins by year', required: false }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            _taxRate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tax rate', required: false }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _discountRate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount rate (WACC)', required: false }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _terminalGrowthRate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Terminal growth rate', required: false }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(0.1)];
            _terminalMultiple_decorators = [(0, swagger_1.ApiProperty)({ description: 'Terminal multiple', required: false }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(0)];
            _capexAsPercentRevenue_decorators = [(0, swagger_1.ApiProperty)({ description: 'CapEx as % of revenue by year', required: false }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            _nwcAsPercentRevenue_decorators = [(0, swagger_1.ApiProperty)({ description: 'NWC as % of revenue by year', required: false }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _revenueGrowthRates_decorators, { kind: "field", name: "revenueGrowthRates", static: false, private: false, access: { has: obj => "revenueGrowthRates" in obj, get: obj => obj.revenueGrowthRates, set: (obj, value) => { obj.revenueGrowthRates = value; } }, metadata: _metadata }, _revenueGrowthRates_initializers, _revenueGrowthRates_extraInitializers);
            __esDecorate(null, null, _ebitdaMargins_decorators, { kind: "field", name: "ebitdaMargins", static: false, private: false, access: { has: obj => "ebitdaMargins" in obj, get: obj => obj.ebitdaMargins, set: (obj, value) => { obj.ebitdaMargins = value; } }, metadata: _metadata }, _ebitdaMargins_initializers, _ebitdaMargins_extraInitializers);
            __esDecorate(null, null, _taxRate_decorators, { kind: "field", name: "taxRate", static: false, private: false, access: { has: obj => "taxRate" in obj, get: obj => obj.taxRate, set: (obj, value) => { obj.taxRate = value; } }, metadata: _metadata }, _taxRate_initializers, _taxRate_extraInitializers);
            __esDecorate(null, null, _discountRate_decorators, { kind: "field", name: "discountRate", static: false, private: false, access: { has: obj => "discountRate" in obj, get: obj => obj.discountRate, set: (obj, value) => { obj.discountRate = value; } }, metadata: _metadata }, _discountRate_initializers, _discountRate_extraInitializers);
            __esDecorate(null, null, _terminalGrowthRate_decorators, { kind: "field", name: "terminalGrowthRate", static: false, private: false, access: { has: obj => "terminalGrowthRate" in obj, get: obj => obj.terminalGrowthRate, set: (obj, value) => { obj.terminalGrowthRate = value; } }, metadata: _metadata }, _terminalGrowthRate_initializers, _terminalGrowthRate_extraInitializers);
            __esDecorate(null, null, _terminalMultiple_decorators, { kind: "field", name: "terminalMultiple", static: false, private: false, access: { has: obj => "terminalMultiple" in obj, get: obj => obj.terminalMultiple, set: (obj, value) => { obj.terminalMultiple = value; } }, metadata: _metadata }, _terminalMultiple_initializers, _terminalMultiple_extraInitializers);
            __esDecorate(null, null, _capexAsPercentRevenue_decorators, { kind: "field", name: "capexAsPercentRevenue", static: false, private: false, access: { has: obj => "capexAsPercentRevenue" in obj, get: obj => obj.capexAsPercentRevenue, set: (obj, value) => { obj.capexAsPercentRevenue = value; } }, metadata: _metadata }, _capexAsPercentRevenue_initializers, _capexAsPercentRevenue_extraInitializers);
            __esDecorate(null, null, _nwcAsPercentRevenue_decorators, { kind: "field", name: "nwcAsPercentRevenue", static: false, private: false, access: { has: obj => "nwcAsPercentRevenue" in obj, get: obj => obj.nwcAsPercentRevenue, set: (obj, value) => { obj.nwcAsPercentRevenue = value; } }, metadata: _metadata }, _nwcAsPercentRevenue_initializers, _nwcAsPercentRevenue_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateModelAssumptionsDto = UpdateModelAssumptionsDto;
let RunSensitivityAnalysisDto = (() => {
    var _a;
    let _modelId_decorators;
    let _modelId_initializers = [];
    let _modelId_extraInitializers = [];
    let _parameter_decorators;
    let _parameter_initializers = [];
    let _parameter_extraInitializers = [];
    let _rangeMin_decorators;
    let _rangeMin_initializers = [];
    let _rangeMin_extraInitializers = [];
    let _rangeMax_decorators;
    let _rangeMax_initializers = [];
    let _rangeMax_extraInitializers = [];
    let _step_decorators;
    let _step_initializers = [];
    let _step_extraInitializers = [];
    return _a = class RunSensitivityAnalysisDto {
            constructor() {
                this.modelId = __runInitializers(this, _modelId_initializers, void 0);
                this.parameter = (__runInitializers(this, _modelId_extraInitializers), __runInitializers(this, _parameter_initializers, void 0));
                this.rangeMin = (__runInitializers(this, _parameter_extraInitializers), __runInitializers(this, _rangeMin_initializers, void 0));
                this.rangeMax = (__runInitializers(this, _rangeMin_extraInitializers), __runInitializers(this, _rangeMax_initializers, void 0));
                this.step = (__runInitializers(this, _rangeMax_extraInitializers), __runInitializers(this, _step_initializers, void 0));
                __runInitializers(this, _step_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _modelId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Model ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _parameter_decorators = [(0, swagger_1.ApiProperty)({ enum: SensitivityParameter, description: 'Parameter to analyze' }), (0, class_validator_1.IsEnum)(SensitivityParameter)];
            _rangeMin_decorators = [(0, swagger_1.ApiProperty)({ description: 'Range minimum value' }), (0, class_validator_1.IsNumber)()];
            _rangeMax_decorators = [(0, swagger_1.ApiProperty)({ description: 'Range maximum value' }), (0, class_validator_1.IsNumber)()];
            _step_decorators = [(0, swagger_1.ApiProperty)({ description: 'Step size' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0.0001)];
            __esDecorate(null, null, _modelId_decorators, { kind: "field", name: "modelId", static: false, private: false, access: { has: obj => "modelId" in obj, get: obj => obj.modelId, set: (obj, value) => { obj.modelId = value; } }, metadata: _metadata }, _modelId_initializers, _modelId_extraInitializers);
            __esDecorate(null, null, _parameter_decorators, { kind: "field", name: "parameter", static: false, private: false, access: { has: obj => "parameter" in obj, get: obj => obj.parameter, set: (obj, value) => { obj.parameter = value; } }, metadata: _metadata }, _parameter_initializers, _parameter_extraInitializers);
            __esDecorate(null, null, _rangeMin_decorators, { kind: "field", name: "rangeMin", static: false, private: false, access: { has: obj => "rangeMin" in obj, get: obj => obj.rangeMin, set: (obj, value) => { obj.rangeMin = value; } }, metadata: _metadata }, _rangeMin_initializers, _rangeMin_extraInitializers);
            __esDecorate(null, null, _rangeMax_decorators, { kind: "field", name: "rangeMax", static: false, private: false, access: { has: obj => "rangeMax" in obj, get: obj => obj.rangeMax, set: (obj, value) => { obj.rangeMax = value; } }, metadata: _metadata }, _rangeMax_initializers, _rangeMax_extraInitializers);
            __esDecorate(null, null, _step_decorators, { kind: "field", name: "step", static: false, private: false, access: { has: obj => "step" in obj, get: obj => obj.step, set: (obj, value) => { obj.step = value; } }, metadata: _metadata }, _step_initializers, _step_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RunSensitivityAnalysisDto = RunSensitivityAnalysisDto;
let CreateScenarioDto = (() => {
    var _a;
    let _modelId_decorators;
    let _modelId_initializers = [];
    let _modelId_extraInitializers = [];
    let _scenarioName_decorators;
    let _scenarioName_initializers = [];
    let _scenarioName_extraInitializers = [];
    let _scenarioType_decorators;
    let _scenarioType_initializers = [];
    let _scenarioType_extraInitializers = [];
    let _probability_decorators;
    let _probability_initializers = [];
    let _probability_extraInitializers = [];
    let _assumptions_decorators;
    let _assumptions_initializers = [];
    let _assumptions_extraInitializers = [];
    return _a = class CreateScenarioDto {
            constructor() {
                this.modelId = __runInitializers(this, _modelId_initializers, void 0);
                this.scenarioName = (__runInitializers(this, _modelId_extraInitializers), __runInitializers(this, _scenarioName_initializers, void 0));
                this.scenarioType = (__runInitializers(this, _scenarioName_extraInitializers), __runInitializers(this, _scenarioType_initializers, void 0));
                this.probability = (__runInitializers(this, _scenarioType_extraInitializers), __runInitializers(this, _probability_initializers, void 0));
                this.assumptions = (__runInitializers(this, _probability_extraInitializers), __runInitializers(this, _assumptions_initializers, void 0));
                __runInitializers(this, _assumptions_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _modelId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Model ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _scenarioName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scenario name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _scenarioType_decorators = [(0, swagger_1.ApiProperty)({ enum: ScenarioType, description: 'Scenario type' }), (0, class_validator_1.IsEnum)(ScenarioType)];
            _probability_decorators = [(0, swagger_1.ApiProperty)({ description: 'Probability (0-1)', required: false }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _assumptions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Modified assumptions' }), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _modelId_decorators, { kind: "field", name: "modelId", static: false, private: false, access: { has: obj => "modelId" in obj, get: obj => obj.modelId, set: (obj, value) => { obj.modelId = value; } }, metadata: _metadata }, _modelId_initializers, _modelId_extraInitializers);
            __esDecorate(null, null, _scenarioName_decorators, { kind: "field", name: "scenarioName", static: false, private: false, access: { has: obj => "scenarioName" in obj, get: obj => obj.scenarioName, set: (obj, value) => { obj.scenarioName = value; } }, metadata: _metadata }, _scenarioName_initializers, _scenarioName_extraInitializers);
            __esDecorate(null, null, _scenarioType_decorators, { kind: "field", name: "scenarioType", static: false, private: false, access: { has: obj => "scenarioType" in obj, get: obj => obj.scenarioType, set: (obj, value) => { obj.scenarioType = value; } }, metadata: _metadata }, _scenarioType_initializers, _scenarioType_extraInitializers);
            __esDecorate(null, null, _probability_decorators, { kind: "field", name: "probability", static: false, private: false, access: { has: obj => "probability" in obj, get: obj => obj.probability, set: (obj, value) => { obj.probability = value; } }, metadata: _metadata }, _probability_initializers, _probability_extraInitializers);
            __esDecorate(null, null, _assumptions_decorators, { kind: "field", name: "assumptions", static: false, private: false, access: { has: obj => "assumptions" in obj, get: obj => obj.assumptions, set: (obj, value) => { obj.assumptions = value; } }, metadata: _metadata }, _assumptions_initializers, _assumptions_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateScenarioDto = CreateScenarioDto;
let CalculateNPVDto = (() => {
    var _a;
    let _cashFlows_decorators;
    let _cashFlows_initializers = [];
    let _cashFlows_extraInitializers = [];
    let _discountRate_decorators;
    let _discountRate_initializers = [];
    let _discountRate_extraInitializers = [];
    let _initialInvestment_decorators;
    let _initialInvestment_initializers = [];
    let _initialInvestment_extraInitializers = [];
    return _a = class CalculateNPVDto {
            constructor() {
                this.cashFlows = __runInitializers(this, _cashFlows_initializers, void 0);
                this.discountRate = (__runInitializers(this, _cashFlows_extraInitializers), __runInitializers(this, _discountRate_initializers, void 0));
                this.initialInvestment = (__runInitializers(this, _discountRate_extraInitializers), __runInitializers(this, _initialInvestment_initializers, void 0));
                __runInitializers(this, _initialInvestment_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _cashFlows_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cash flows array' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsNotEmpty)()];
            _discountRate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount rate' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _initialInvestment_decorators = [(0, swagger_1.ApiProperty)({ description: 'Initial investment', required: false }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _cashFlows_decorators, { kind: "field", name: "cashFlows", static: false, private: false, access: { has: obj => "cashFlows" in obj, get: obj => obj.cashFlows, set: (obj, value) => { obj.cashFlows = value; } }, metadata: _metadata }, _cashFlows_initializers, _cashFlows_extraInitializers);
            __esDecorate(null, null, _discountRate_decorators, { kind: "field", name: "discountRate", static: false, private: false, access: { has: obj => "discountRate" in obj, get: obj => obj.discountRate, set: (obj, value) => { obj.discountRate = value; } }, metadata: _metadata }, _discountRate_initializers, _discountRate_extraInitializers);
            __esDecorate(null, null, _initialInvestment_decorators, { kind: "field", name: "initialInvestment", static: false, private: false, access: { has: obj => "initialInvestment" in obj, get: obj => obj.initialInvestment, set: (obj, value) => { obj.initialInvestment = value; } }, metadata: _metadata }, _initialInvestment_initializers, _initialInvestment_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CalculateNPVDto = CalculateNPVDto;
let CalculateIRRDto = (() => {
    var _a;
    let _cashFlows_decorators;
    let _cashFlows_initializers = [];
    let _cashFlows_extraInitializers = [];
    let _reinvestmentRate_decorators;
    let _reinvestmentRate_initializers = [];
    let _reinvestmentRate_extraInitializers = [];
    let _financeRate_decorators;
    let _financeRate_initializers = [];
    let _financeRate_extraInitializers = [];
    return _a = class CalculateIRRDto {
            constructor() {
                this.cashFlows = __runInitializers(this, _cashFlows_initializers, void 0);
                this.reinvestmentRate = (__runInitializers(this, _cashFlows_extraInitializers), __runInitializers(this, _reinvestmentRate_initializers, void 0));
                this.financeRate = (__runInitializers(this, _reinvestmentRate_extraInitializers), __runInitializers(this, _financeRate_initializers, void 0));
                __runInitializers(this, _financeRate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _cashFlows_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cash flows array' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsNotEmpty)()];
            _reinvestmentRate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reinvestment rate for MIRR', required: false }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _financeRate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Finance rate for MIRR', required: false }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            __esDecorate(null, null, _cashFlows_decorators, { kind: "field", name: "cashFlows", static: false, private: false, access: { has: obj => "cashFlows" in obj, get: obj => obj.cashFlows, set: (obj, value) => { obj.cashFlows = value; } }, metadata: _metadata }, _cashFlows_initializers, _cashFlows_extraInitializers);
            __esDecorate(null, null, _reinvestmentRate_decorators, { kind: "field", name: "reinvestmentRate", static: false, private: false, access: { has: obj => "reinvestmentRate" in obj, get: obj => obj.reinvestmentRate, set: (obj, value) => { obj.reinvestmentRate = value; } }, metadata: _metadata }, _reinvestmentRate_initializers, _reinvestmentRate_extraInitializers);
            __esDecorate(null, null, _financeRate_decorators, { kind: "field", name: "financeRate", static: false, private: false, access: { has: obj => "financeRate" in obj, get: obj => obj.financeRate, set: (obj, value) => { obj.financeRate = value; } }, metadata: _metadata }, _financeRate_initializers, _financeRate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CalculateIRRDto = CalculateIRRDto;
let CalculateWACCDto = (() => {
    var _a;
    let _costOfEquity_decorators;
    let _costOfEquity_initializers = [];
    let _costOfEquity_extraInitializers = [];
    let _costOfDebt_decorators;
    let _costOfDebt_initializers = [];
    let _costOfDebt_extraInitializers = [];
    let _marketValueEquity_decorators;
    let _marketValueEquity_initializers = [];
    let _marketValueEquity_extraInitializers = [];
    let _marketValueDebt_decorators;
    let _marketValueDebt_initializers = [];
    let _marketValueDebt_extraInitializers = [];
    let _taxRate_decorators;
    let _taxRate_initializers = [];
    let _taxRate_extraInitializers = [];
    return _a = class CalculateWACCDto {
            constructor() {
                this.costOfEquity = __runInitializers(this, _costOfEquity_initializers, void 0);
                this.costOfDebt = (__runInitializers(this, _costOfEquity_extraInitializers), __runInitializers(this, _costOfDebt_initializers, void 0));
                this.marketValueEquity = (__runInitializers(this, _costOfDebt_extraInitializers), __runInitializers(this, _marketValueEquity_initializers, void 0));
                this.marketValueDebt = (__runInitializers(this, _marketValueEquity_extraInitializers), __runInitializers(this, _marketValueDebt_initializers, void 0));
                this.taxRate = (__runInitializers(this, _marketValueDebt_extraInitializers), __runInitializers(this, _taxRate_initializers, void 0));
                __runInitializers(this, _taxRate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _costOfEquity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost of equity' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _costOfDebt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost of debt (pre-tax)' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _marketValueEquity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Market value of equity' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _marketValueDebt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Market value of debt' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _taxRate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Corporate tax rate' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            __esDecorate(null, null, _costOfEquity_decorators, { kind: "field", name: "costOfEquity", static: false, private: false, access: { has: obj => "costOfEquity" in obj, get: obj => obj.costOfEquity, set: (obj, value) => { obj.costOfEquity = value; } }, metadata: _metadata }, _costOfEquity_initializers, _costOfEquity_extraInitializers);
            __esDecorate(null, null, _costOfDebt_decorators, { kind: "field", name: "costOfDebt", static: false, private: false, access: { has: obj => "costOfDebt" in obj, get: obj => obj.costOfDebt, set: (obj, value) => { obj.costOfDebt = value; } }, metadata: _metadata }, _costOfDebt_initializers, _costOfDebt_extraInitializers);
            __esDecorate(null, null, _marketValueEquity_decorators, { kind: "field", name: "marketValueEquity", static: false, private: false, access: { has: obj => "marketValueEquity" in obj, get: obj => obj.marketValueEquity, set: (obj, value) => { obj.marketValueEquity = value; } }, metadata: _metadata }, _marketValueEquity_initializers, _marketValueEquity_extraInitializers);
            __esDecorate(null, null, _marketValueDebt_decorators, { kind: "field", name: "marketValueDebt", static: false, private: false, access: { has: obj => "marketValueDebt" in obj, get: obj => obj.marketValueDebt, set: (obj, value) => { obj.marketValueDebt = value; } }, metadata: _metadata }, _marketValueDebt_initializers, _marketValueDebt_extraInitializers);
            __esDecorate(null, null, _taxRate_decorators, { kind: "field", name: "taxRate", static: false, private: false, access: { has: obj => "taxRate" in obj, get: obj => obj.taxRate, set: (obj, value) => { obj.taxRate = value; } }, metadata: _metadata }, _taxRate_initializers, _taxRate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CalculateWACCDto = CalculateWACCDto;
let CreateLBOModelDto = (() => {
    var _a;
    let _modelName_decorators;
    let _modelName_initializers = [];
    let _modelName_extraInitializers = [];
    let _targetCompany_decorators;
    let _targetCompany_initializers = [];
    let _targetCompany_extraInitializers = [];
    let _sponsor_decorators;
    let _sponsor_initializers = [];
    let _sponsor_extraInitializers = [];
    let _purchasePrice_decorators;
    let _purchasePrice_initializers = [];
    let _purchasePrice_extraInitializers = [];
    let _equityContribution_decorators;
    let _equityContribution_initializers = [];
    let _equityContribution_extraInitializers = [];
    let _entryMultiple_decorators;
    let _entryMultiple_initializers = [];
    let _entryMultiple_extraInitializers = [];
    let _exitMultiple_decorators;
    let _exitMultiple_initializers = [];
    let _exitMultiple_extraInitializers = [];
    let _holdingPeriod_decorators;
    let _holdingPeriod_initializers = [];
    let _holdingPeriod_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    return _a = class CreateLBOModelDto {
            constructor() {
                this.modelName = __runInitializers(this, _modelName_initializers, void 0);
                this.targetCompany = (__runInitializers(this, _modelName_extraInitializers), __runInitializers(this, _targetCompany_initializers, void 0));
                this.sponsor = (__runInitializers(this, _targetCompany_extraInitializers), __runInitializers(this, _sponsor_initializers, void 0));
                this.purchasePrice = (__runInitializers(this, _sponsor_extraInitializers), __runInitializers(this, _purchasePrice_initializers, void 0));
                this.equityContribution = (__runInitializers(this, _purchasePrice_extraInitializers), __runInitializers(this, _equityContribution_initializers, void 0));
                this.entryMultiple = (__runInitializers(this, _equityContribution_extraInitializers), __runInitializers(this, _entryMultiple_initializers, void 0));
                this.exitMultiple = (__runInitializers(this, _entryMultiple_extraInitializers), __runInitializers(this, _exitMultiple_initializers, void 0));
                this.holdingPeriod = (__runInitializers(this, _exitMultiple_extraInitializers), __runInitializers(this, _holdingPeriod_initializers, void 0));
                this.createdBy = (__runInitializers(this, _holdingPeriod_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
                __runInitializers(this, _createdBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _modelName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Model name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(500)];
            _targetCompany_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target company name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _sponsor_decorators = [(0, swagger_1.ApiProperty)({ description: 'PE sponsor name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _purchasePrice_decorators = [(0, swagger_1.ApiProperty)({ description: 'Purchase price' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _equityContribution_decorators = [(0, swagger_1.ApiProperty)({ description: 'Equity contribution' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _entryMultiple_decorators = [(0, swagger_1.ApiProperty)({ description: 'Entry EV/EBITDA multiple' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _exitMultiple_decorators = [(0, swagger_1.ApiProperty)({ description: 'Exit EV/EBITDA multiple' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _holdingPeriod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Holding period (years)' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(10)];
            _createdBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Creator user ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _modelName_decorators, { kind: "field", name: "modelName", static: false, private: false, access: { has: obj => "modelName" in obj, get: obj => obj.modelName, set: (obj, value) => { obj.modelName = value; } }, metadata: _metadata }, _modelName_initializers, _modelName_extraInitializers);
            __esDecorate(null, null, _targetCompany_decorators, { kind: "field", name: "targetCompany", static: false, private: false, access: { has: obj => "targetCompany" in obj, get: obj => obj.targetCompany, set: (obj, value) => { obj.targetCompany = value; } }, metadata: _metadata }, _targetCompany_initializers, _targetCompany_extraInitializers);
            __esDecorate(null, null, _sponsor_decorators, { kind: "field", name: "sponsor", static: false, private: false, access: { has: obj => "sponsor" in obj, get: obj => obj.sponsor, set: (obj, value) => { obj.sponsor = value; } }, metadata: _metadata }, _sponsor_initializers, _sponsor_extraInitializers);
            __esDecorate(null, null, _purchasePrice_decorators, { kind: "field", name: "purchasePrice", static: false, private: false, access: { has: obj => "purchasePrice" in obj, get: obj => obj.purchasePrice, set: (obj, value) => { obj.purchasePrice = value; } }, metadata: _metadata }, _purchasePrice_initializers, _purchasePrice_extraInitializers);
            __esDecorate(null, null, _equityContribution_decorators, { kind: "field", name: "equityContribution", static: false, private: false, access: { has: obj => "equityContribution" in obj, get: obj => obj.equityContribution, set: (obj, value) => { obj.equityContribution = value; } }, metadata: _metadata }, _equityContribution_initializers, _equityContribution_extraInitializers);
            __esDecorate(null, null, _entryMultiple_decorators, { kind: "field", name: "entryMultiple", static: false, private: false, access: { has: obj => "entryMultiple" in obj, get: obj => obj.entryMultiple, set: (obj, value) => { obj.entryMultiple = value; } }, metadata: _metadata }, _entryMultiple_initializers, _entryMultiple_extraInitializers);
            __esDecorate(null, null, _exitMultiple_decorators, { kind: "field", name: "exitMultiple", static: false, private: false, access: { has: obj => "exitMultiple" in obj, get: obj => obj.exitMultiple, set: (obj, value) => { obj.exitMultiple = value; } }, metadata: _metadata }, _exitMultiple_initializers, _exitMultiple_extraInitializers);
            __esDecorate(null, null, _holdingPeriod_decorators, { kind: "field", name: "holdingPeriod", static: false, private: false, access: { has: obj => "holdingPeriod" in obj, get: obj => obj.holdingPeriod, set: (obj, value) => { obj.holdingPeriod = value; } }, metadata: _metadata }, _holdingPeriod_initializers, _holdingPeriod_extraInitializers);
            __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateLBOModelDto = CreateLBOModelDto;
let CalculateBreakEvenDto = (() => {
    var _a;
    let _fixedCosts_decorators;
    let _fixedCosts_initializers = [];
    let _fixedCosts_extraInitializers = [];
    let _variableCostPerUnit_decorators;
    let _variableCostPerUnit_initializers = [];
    let _variableCostPerUnit_extraInitializers = [];
    let _pricePerUnit_decorators;
    let _pricePerUnit_initializers = [];
    let _pricePerUnit_extraInitializers = [];
    let _currentUnits_decorators;
    let _currentUnits_initializers = [];
    let _currentUnits_extraInitializers = [];
    return _a = class CalculateBreakEvenDto {
            constructor() {
                this.fixedCosts = __runInitializers(this, _fixedCosts_initializers, void 0);
                this.variableCostPerUnit = (__runInitializers(this, _fixedCosts_extraInitializers), __runInitializers(this, _variableCostPerUnit_initializers, void 0));
                this.pricePerUnit = (__runInitializers(this, _variableCostPerUnit_extraInitializers), __runInitializers(this, _pricePerUnit_initializers, void 0));
                this.currentUnits = (__runInitializers(this, _pricePerUnit_extraInitializers), __runInitializers(this, _currentUnits_initializers, void 0));
                __runInitializers(this, _currentUnits_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _fixedCosts_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fixed costs' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _variableCostPerUnit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Variable cost per unit' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _pricePerUnit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Price per unit' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _currentUnits_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current sales units', required: false }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _fixedCosts_decorators, { kind: "field", name: "fixedCosts", static: false, private: false, access: { has: obj => "fixedCosts" in obj, get: obj => obj.fixedCosts, set: (obj, value) => { obj.fixedCosts = value; } }, metadata: _metadata }, _fixedCosts_initializers, _fixedCosts_extraInitializers);
            __esDecorate(null, null, _variableCostPerUnit_decorators, { kind: "field", name: "variableCostPerUnit", static: false, private: false, access: { has: obj => "variableCostPerUnit" in obj, get: obj => obj.variableCostPerUnit, set: (obj, value) => { obj.variableCostPerUnit = value; } }, metadata: _metadata }, _variableCostPerUnit_initializers, _variableCostPerUnit_extraInitializers);
            __esDecorate(null, null, _pricePerUnit_decorators, { kind: "field", name: "pricePerUnit", static: false, private: false, access: { has: obj => "pricePerUnit" in obj, get: obj => obj.pricePerUnit, set: (obj, value) => { obj.pricePerUnit = value; } }, metadata: _metadata }, _pricePerUnit_initializers, _pricePerUnit_extraInitializers);
            __esDecorate(null, null, _currentUnits_decorators, { kind: "field", name: "currentUnits", static: false, private: false, access: { has: obj => "currentUnits" in obj, get: obj => obj.currentUnits, set: (obj, value) => { obj.currentUnits = value; } }, metadata: _metadata }, _currentUnits_initializers, _currentUnits_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CalculateBreakEvenDto = CalculateBreakEvenDto;
// ============================================================================
// DCF VALUATION FUNCTIONS
// ============================================================================
/**
 * Calculate Net Present Value (NPV) of cash flows.
 *
 * @param {number[]} cashFlows - Array of cash flows (including initial investment as negative)
 * @param {number} discountRate - Discount rate (WACC)
 * @param {number} initialInvestment - Initial investment (optional, can be in cashFlows)
 * @returns {NPVAnalysis} NPV analysis results
 *
 * @example
 * ```typescript
 * const npv = calculateNPV([-1000000, 300000, 350000, 400000, 450000, 500000], 0.10);
 * console.log(`NPV: $${npv.npv.toLocaleString()}`);
 * console.log(`Profitability Index: ${npv.profitabilityIndex.toFixed(2)}`);
 * console.log(`Payback Period: ${npv.paybackPeriod.toFixed(2)} years`);
 * ```
 */
function calculateNPV(cashFlows, discountRate, initialInvestment) {
    try {
        const flows = initialInvestment !== undefined ? [-initialInvestment, ...cashFlows] : cashFlows;
        let npv = 0;
        let cumulativeCashFlow = 0;
        let cumulativeDiscountedCashFlow = 0;
        let paybackPeriod = -1;
        let discountedPaybackPeriod = -1;
        for (let i = 0; i < flows.length; i++) {
            const discountedCashFlow = flows[i] / Math.pow(1 + discountRate, i);
            npv += discountedCashFlow;
            cumulativeCashFlow += flows[i];
            cumulativeDiscountedCashFlow += discountedCashFlow;
            // Calculate payback period
            if (paybackPeriod === -1 && cumulativeCashFlow >= 0 && i > 0) {
                const previousCumulative = cumulativeCashFlow - flows[i];
                paybackPeriod = i - 1 + Math.abs(previousCumulative) / flows[i];
            }
            // Calculate discounted payback period
            if (discountedPaybackPeriod === -1 && cumulativeDiscountedCashFlow >= 0 && i > 0) {
                const previousDiscountedCumulative = cumulativeDiscountedCashFlow - discountedCashFlow;
                discountedPaybackPeriod = i - 1 + Math.abs(previousDiscountedCumulative) / discountedCashFlow;
            }
        }
        const investment = Math.abs(flows[0]);
        const profitabilityIndex = investment > 0 ? (npv + investment) / investment : 0;
        return {
            cashFlows: flows,
            discountRate,
            initialInvestment: investment,
            npv,
            profitabilityIndex,
            paybackPeriod: paybackPeriod === -1 ? flows.length : paybackPeriod,
            discountedPaybackPeriod: discountedPaybackPeriod === -1 ? flows.length : discountedPaybackPeriod,
        };
    }
    catch (error) {
        throw new Error(`Failed to calculate NPV: ${error.message}`);
    }
}
/**
 * Calculate Internal Rate of Return (IRR) using Newton-Raphson method.
 *
 * @param {number[]} cashFlows - Array of cash flows
 * @param {number} reinvestmentRate - Reinvestment rate for MIRR (optional)
 * @param {number} financeRate - Finance rate for MIRR (optional)
 * @returns {IRRAnalysis} IRR analysis results
 *
 * @example
 * ```typescript
 * const irr = calculateIRR([-1000000, 300000, 350000, 400000, 450000, 500000], 0.10, 0.08);
 * console.log(`IRR: ${(irr.irr * 100).toFixed(2)}%`);
 * console.log(`MIRR: ${(irr.mirr * 100).toFixed(2)}%`);
 * console.log(`Investment Multiple: ${irr.investmentMultiple.toFixed(2)}x`);
 * ```
 */
function calculateIRR(cashFlows, reinvestmentRate = 0.10, financeRate = 0.08) {
    try {
        // Calculate IRR using Newton-Raphson method
        let irr = 0.1; // Initial guess
        const maxIterations = 100;
        const tolerance = 0.00001;
        for (let i = 0; i < maxIterations; i++) {
            let npv = 0;
            let dnpv = 0;
            for (let j = 0; j < cashFlows.length; j++) {
                const factor = Math.pow(1 + irr, j);
                npv += cashFlows[j] / factor;
                dnpv -= (j * cashFlows[j]) / (factor * (1 + irr));
            }
            const newIrr = irr - npv / dnpv;
            if (Math.abs(newIrr - irr) < tolerance) {
                irr = newIrr;
                break;
            }
            irr = newIrr;
        }
        // Calculate MIRR (Modified IRR)
        let negativeCashFlowsPV = 0;
        let positiveCashFlowsFV = 0;
        for (let i = 0; i < cashFlows.length; i++) {
            if (cashFlows[i] < 0) {
                negativeCashFlowsPV += cashFlows[i] / Math.pow(1 + financeRate, i);
            }
            else {
                positiveCashFlowsFV += cashFlows[i] * Math.pow(1 + reinvestmentRate, cashFlows.length - 1 - i);
            }
        }
        const mirr = Math.pow(-positiveCashFlowsFV / negativeCashFlowsPV, 1 / (cashFlows.length - 1)) - 1;
        // Calculate investment multiple
        const initialInvestment = Math.abs(cashFlows[0]);
        const totalCashReturned = cashFlows.slice(1).reduce((sum, cf) => sum + Math.max(0, cf), 0);
        const investmentMultiple = initialInvestment > 0 ? totalCashReturned / initialInvestment : 0;
        // Calculate annualized return
        const years = cashFlows.length - 1;
        const annualizedReturn = Math.pow(investmentMultiple, 1 / years) - 1;
        return {
            cashFlows,
            irr,
            mirr,
            reinvestmentRate,
            financeRate,
            investmentMultiple,
            annualizedReturn,
        };
    }
    catch (error) {
        throw new Error(`Failed to calculate IRR: ${error.message}`);
    }
}
/**
 * Calculate Weighted Average Cost of Capital (WACC).
 *
 * @param {WACCComponents} components - WACC components
 * @returns {WACCComponents} Complete WACC calculation
 *
 * @example
 * ```typescript
 * const wacc = calculateWACC({
 *   costOfEquity: 0.12,
 *   costOfDebt: 0.06,
 *   marketValueEquity: 8000000,
 *   marketValueDebt: 2000000,
 *   taxRate: 0.25
 * });
 * console.log(`WACC: ${(wacc.wacc * 100).toFixed(2)}%`);
 * ```
 */
function calculateWACC(components) {
    try {
        const { costOfEquity, costOfDebt, marketValueEquity, marketValueDebt, taxRate, } = components;
        if (!costOfEquity || !costOfDebt || !marketValueEquity || !marketValueDebt || taxRate === undefined) {
            throw new Error('Missing required WACC components');
        }
        const totalCapital = marketValueEquity + marketValueDebt;
        const equityWeight = marketValueEquity / totalCapital;
        const debtWeight = marketValueDebt / totalCapital;
        const wacc = (costOfEquity * equityWeight) + (costOfDebt * (1 - taxRate) * debtWeight);
        const debtToEquity = marketValueDebt / marketValueEquity;
        const debtToCapital = marketValueDebt / totalCapital;
        return {
            costOfEquity,
            costOfDebt,
            marketValueEquity,
            marketValueDebt,
            taxRate,
            wacc,
            debtToEquity,
            debtToCapital,
        };
    }
    catch (error) {
        throw new Error(`Failed to calculate WACC: ${error.message}`);
    }
}
/**
 * Perform comprehensive DCF valuation.
 *
 * @param {CashFlowProjection[]} projections - Cash flow projections
 * @param {number} terminalGrowthRate - Terminal growth rate
 * @param {number} discountRate - Discount rate (WACC)
 * @param {number} terminalMultiple - Exit multiple (optional)
 * @param {TerminalValueMethod} method - Terminal value calculation method
 * @returns {ValuationResult} Complete valuation results
 *
 * @example
 * ```typescript
 * const valuation = performDCFValuation(
 *   cashFlowProjections,
 *   0.03,
 *   0.10,
 *   12.0,
 *   TerminalValueMethod.EXIT_MULTIPLE
 * );
 * console.log(`Enterprise Value: $${valuation.enterpriseValue.toLocaleString()}`);
 * console.log(`Equity Value: $${valuation.equityValue.toLocaleString()}`);
 * console.log(`Value per Share: $${valuation.valuePerShare.toFixed(2)}`);
 * ```
 */
function performDCFValuation(projections, terminalGrowthRate, discountRate, terminalMultiple, method = TerminalValueMethod.PERPETUITY_GROWTH) {
    try {
        // Calculate present value of projected cash flows
        let projectedCashFlowsPV = 0;
        projections.forEach((proj) => {
            const discountFactor = 1 / Math.pow(1 + discountRate, proj.year);
            projectedCashFlowsPV += proj.freeCashFlow * discountFactor;
        });
        // Calculate terminal value
        const lastProjection = projections[projections.length - 1];
        let terminalValue = 0;
        if (method === TerminalValueMethod.PERPETUITY_GROWTH) {
            // Gordon Growth Model
            const terminalFCF = lastProjection.freeCashFlow * (1 + terminalGrowthRate);
            terminalValue = terminalFCF / (discountRate - terminalGrowthRate);
        }
        else if (method === TerminalValueMethod.EXIT_MULTIPLE && terminalMultiple) {
            // Exit Multiple Method
            terminalValue = lastProjection.ebitda * terminalMultiple;
        }
        // Discount terminal value to present
        const terminalDiscountFactor = 1 / Math.pow(1 + discountRate, projections.length);
        const terminalValuePV = terminalValue * terminalDiscountFactor;
        // Calculate enterprise value
        const enterpriseValue = projectedCashFlowsPV + terminalValuePV;
        return {
            methodology: ModelingMethodology.DCF,
            enterpriseValue,
            terminalValue,
            terminalValuePV,
            projectedCashFlowsPV,
            wacc: discountRate,
        };
    }
    catch (error) {
        throw new Error(`Failed to perform DCF valuation: ${error.message}`);
    }
}
/**
 * Calculate terminal value using perpetuity growth method.
 *
 * @param {number} finalYearFCF - Final year free cash flow
 * @param {number} terminalGrowthRate - Terminal growth rate (g)
 * @param {number} discountRate - Discount rate (WACC)
 * @returns {number} Terminal value
 *
 * @example
 * ```typescript
 * const tv = calculateTerminalValuePerpetualGrowth(500000, 0.03, 0.10);
 * console.log(`Terminal Value: $${tv.toLocaleString()}`);
 * ```
 */
function calculateTerminalValuePerpetualGrowth(finalYearFCF, terminalGrowthRate, discountRate) {
    try {
        if (discountRate <= terminalGrowthRate) {
            throw new Error('Discount rate must be greater than terminal growth rate');
        }
        const terminalFCF = finalYearFCF * (1 + terminalGrowthRate);
        return terminalFCF / (discountRate - terminalGrowthRate);
    }
    catch (error) {
        throw new Error(`Failed to calculate terminal value: ${error.message}`);
    }
}
/**
 * Calculate terminal value using exit multiple method.
 *
 * @param {number} finalYearMetric - Final year metric (EBITDA, EBIT, Revenue)
 * @param {number} exitMultiple - Exit multiple
 * @returns {number} Terminal value
 *
 * @example
 * ```typescript
 * const tv = calculateTerminalValueExitMultiple(2500000, 12.0);
 * console.log(`Terminal Value: $${tv.toLocaleString()}`);
 * ```
 */
function calculateTerminalValueExitMultiple(finalYearMetric, exitMultiple) {
    try {
        return finalYearMetric * exitMultiple;
    }
    catch (error) {
        throw new Error(`Failed to calculate terminal value: ${error.message}`);
    }
}
/**
 * Calculate enterprise value to equity value bridge.
 *
 * @param {number} enterpriseValue - Enterprise value
 * @param {number} totalDebt - Total debt
 * @param {number} cash - Cash and equivalents
 * @param {number} minorityInterest - Minority interest
 * @param {number} preferredStock - Preferred stock
 * @returns {number} Equity value
 *
 * @example
 * ```typescript
 * const equityValue = calculateEquityValue(50000000, 10000000, 5000000, 500000, 0);
 * console.log(`Equity Value: $${equityValue.toLocaleString()}`);
 * ```
 */
function calculateEquityValue(enterpriseValue, totalDebt, cash, minorityInterest = 0, preferredStock = 0) {
    try {
        return enterpriseValue - totalDebt + cash - minorityInterest - preferredStock;
    }
    catch (error) {
        throw new Error(`Failed to calculate equity value: ${error.message}`);
    }
}
// ============================================================================
// SENSITIVITY ANALYSIS FUNCTIONS
// ============================================================================
/**
 * Perform sensitivity analysis on a single parameter.
 *
 * @param {string} modelId - Financial model ID
 * @param {SensitivityParameter} parameter - Parameter to analyze
 * @param {number} baseValue - Base case value
 * @param {number} rangeMin - Minimum range value
 * @param {number} rangeMax - Maximum range value
 * @param {number} step - Step size
 * @param {Function} valuationFunction - Valuation function to call
 * @returns {Promise<SensitivityResult>} Sensitivity analysis results
 *
 * @example
 * ```typescript
 * const sensitivity = await performSensitivityAnalysis(
 *   'model-123',
 *   SensitivityParameter.DISCOUNT_RATE,
 *   0.10,
 *   0.08,
 *   0.12,
 *   0.005,
 *   valuationFunc
 * );
 * ```
 */
async function performSensitivityAnalysis(modelId, parameter, baseValue, rangeMin, rangeMax, step, valuationFunction) {
    try {
        const results = [];
        const baseValuation = await valuationFunction(baseValue);
        const baseEquityValue = baseValuation.equityValue || 0;
        const baseValuePerShare = baseValuation.valuePerShare || 0;
        let currentValue = rangeMin;
        while (currentValue <= rangeMax) {
            const valuation = await valuationFunction(currentValue);
            const equityValue = valuation.equityValue || 0;
            const valuePerShare = valuation.valuePerShare || 0;
            results.push({
                parameterValue: currentValue,
                equityValue,
                valuePerShare,
                variance: equityValue - baseEquityValue,
                variancePercent: ((equityValue - baseEquityValue) / baseEquityValue) * 100,
            });
            currentValue += step;
        }
        // Generate tornado chart data
        const downsideCase = results[0];
        const upsideCase = results[results.length - 1];
        const tornado = {
            parameter,
            baseCase: baseEquityValue,
            downsideValue: downsideCase.equityValue,
            upsideValue: upsideCase.equityValue,
            downsideImpact: downsideCase.equityValue - baseEquityValue,
            upsideImpact: upsideCase.equityValue - baseEquityValue,
            totalSwing: upsideCase.equityValue - downsideCase.equityValue,
        };
        return {
            parameter,
            baseValue,
            rangeMin,
            rangeMax,
            step,
            results,
            tornado,
        };
    }
    catch (error) {
        throw new Error(`Failed to perform sensitivity analysis: ${error.message}`);
    }
}
/**
 * Perform two-way sensitivity analysis (data table).
 *
 * @param {SensitivityParameter} param1 - First parameter
 * @param {number[]} param1Values - First parameter values
 * @param {SensitivityParameter} param2 - Second parameter
 * @param {number[]} param2Values - Second parameter values
 * @param {Function} valuationFunction - Valuation function
 * @returns {Promise<Record<string, any>>} Two-way sensitivity table
 *
 * @example
 * ```typescript
 * const table = await performTwoWaySensitivity(
 *   SensitivityParameter.DISCOUNT_RATE,
 *   [0.08, 0.09, 0.10, 0.11, 0.12],
 *   SensitivityParameter.TERMINAL_GROWTH,
 *   [0.02, 0.025, 0.03, 0.035, 0.04],
 *   valuationFunc
 * );
 * ```
 */
async function performTwoWaySensitivity(param1, param1Values, param2, param2Values, valuationFunction) {
    try {
        const table = [];
        for (const p1Value of param1Values) {
            const row = [];
            for (const p2Value of param2Values) {
                const value = await valuationFunction(p1Value, p2Value);
                row.push(value);
            }
            table.push(row);
        }
        return {
            param1,
            param1Values,
            param2,
            param2Values,
            table,
        };
    }
    catch (error) {
        throw new Error(`Failed to perform two-way sensitivity: ${error.message}`);
    }
}
/**
 * Generate tornado chart data for multiple parameters.
 *
 * @param {string} modelId - Financial model ID
 * @param {SensitivityParameter[]} parameters - Parameters to analyze
 * @param {Record<string, number>} baseValues - Base case values for each parameter
 * @param {number} variationPercent - Variation percentage (e.g., 0.10 for ±10%)
 * @param {Function} valuationFunction - Valuation function
 * @returns {Promise<TornadoChartData[]>} Tornado chart data sorted by impact
 *
 * @example
 * ```typescript
 * const tornado = await generateTornadoChart(
 *   'model-123',
 *   [SensitivityParameter.REVENUE_GROWTH, SensitivityParameter.MARGIN],
 *   { 'revenue-growth': 0.10, 'margin': 0.25 },
 *   0.10,
 *   valuationFunc
 * );
 * ```
 */
async function generateTornadoChart(modelId, parameters, baseValues, variationPercent, valuationFunction) {
    try {
        const baseCase = await valuationFunction(baseValues);
        const tornadoData = [];
        for (const param of parameters) {
            const baseValue = baseValues[param];
            // Downside case
            const downsideValues = { ...baseValues };
            downsideValues[param] = baseValue * (1 - variationPercent);
            const downsideValue = await valuationFunction(downsideValues);
            // Upside case
            const upsideValues = { ...baseValues };
            upsideValues[param] = baseValue * (1 + variationPercent);
            const upsideValue = await valuationFunction(upsideValues);
            tornadoData.push({
                parameter: param,
                baseCase,
                downsideValue,
                upsideValue,
                downsideImpact: downsideValue - baseCase,
                upsideImpact: upsideValue - baseCase,
                totalSwing: Math.abs(upsideValue - downsideValue),
            });
        }
        // Sort by total swing (highest impact first)
        tornadoData.sort((a, b) => b.totalSwing - a.totalSwing);
        return tornadoData;
    }
    catch (error) {
        throw new Error(`Failed to generate tornado chart: ${error.message}`);
    }
}
// ============================================================================
// SCENARIO MODELING FUNCTIONS
// ============================================================================
/**
 * Create and analyze multiple scenarios.
 *
 * @param {string} modelId - Financial model ID
 * @param {ModelAssumptions} baseAssumptions - Base case assumptions
 * @param {Partial<ModelAssumptions>[]} scenarioAssumptions - Scenario-specific assumptions
 * @param {ScenarioType[]} scenarioTypes - Scenario types
 * @param {Function} valuationFunction - Valuation function
 * @returns {Promise<ScenarioAnalysis[]>} Scenario analysis results
 *
 * @example
 * ```typescript
 * const scenarios = await createScenarioAnalysis(
 *   'model-123',
 *   baseAssumptions,
 *   [optimisticAssumptions, pessimisticAssumptions],
 *   [ScenarioType.BEST_CASE, ScenarioType.WORST_CASE],
 *   valuationFunc
 * );
 * ```
 */
async function createScenarioAnalysis(modelId, baseAssumptions, scenarioAssumptions, scenarioTypes, valuationFunction) {
    try {
        const baseValuation = await valuationFunction(baseAssumptions);
        const scenarios = [];
        for (let i = 0; i < scenarioAssumptions.length; i++) {
            const mergedAssumptions = { ...baseAssumptions, ...scenarioAssumptions[i] };
            const valuation = await valuationFunction(mergedAssumptions);
            const variance = valuation.equityValue - baseValuation.equityValue;
            const variancePercent = (variance / baseValuation.equityValue) * 100;
            scenarios.push({
                scenarioId: `scenario-${i + 1}`,
                scenarioName: scenarioTypes[i],
                scenarioType: scenarioTypes[i],
                probability: getProbabilityForScenario(scenarioTypes[i]),
                assumptions: scenarioAssumptions[i],
                valuation,
                variance,
                variancePercent,
            });
        }
        return scenarios;
    }
    catch (error) {
        throw new Error(`Failed to create scenario analysis: ${error.message}`);
    }
}
/**
 * Calculate probability-weighted expected value across scenarios.
 *
 * @param {ScenarioAnalysis[]} scenarios - Scenario analyses
 * @returns {number} Expected value
 *
 * @example
 * ```typescript
 * const expectedValue = calculateExpectedValue(scenarios);
 * console.log(`Expected Value: $${expectedValue.toLocaleString()}`);
 * ```
 */
function calculateExpectedValue(scenarios) {
    try {
        let expectedValue = 0;
        let totalProbability = 0;
        scenarios.forEach((scenario) => {
            expectedValue += scenario.valuation.equityValue * scenario.probability;
            totalProbability += scenario.probability;
        });
        // Normalize if probabilities don't sum to 1
        if (totalProbability > 0 && Math.abs(totalProbability - 1) > 0.01) {
            expectedValue = expectedValue / totalProbability;
        }
        return expectedValue;
    }
    catch (error) {
        throw new Error(`Failed to calculate expected value: ${error.message}`);
    }
}
/**
 * Perform Monte Carlo simulation for valuation.
 *
 * @param {string} modelId - Financial model ID
 * @param {ModelAssumptions} baseAssumptions - Base assumptions
 * @param {Record<string, { mean: number; stdDev: number }>} distributions - Parameter distributions
 * @param {number} simulations - Number of simulations
 * @param {Function} valuationFunction - Valuation function
 * @returns {Promise<Record<string, any>>} Monte Carlo results
 *
 * @example
 * ```typescript
 * const monteCarlo = await performMonteCarloSimulation(
 *   'model-123',
 *   baseAssumptions,
 *   {
 *     revenueGrowth: { mean: 0.10, stdDev: 0.05 },
 *     ebitdaMargin: { mean: 0.25, stdDev: 0.03 }
 *   },
 *   10000,
 *   valuationFunc
 * );
 * ```
 */
async function performMonteCarloSimulation(modelId, baseAssumptions, distributions, simulations, valuationFunction) {
    try {
        const results = [];
        for (let i = 0; i < simulations; i++) {
            const simulatedAssumptions = { ...baseAssumptions };
            // Apply random variations based on distributions
            Object.keys(distributions).forEach((param) => {
                const { mean, stdDev } = distributions[param];
                const randomValue = generateNormalRandom(mean, stdDev);
                // Update the specific assumption parameter
                if (param in simulatedAssumptions) {
                    simulatedAssumptions[param] = randomValue;
                }
            });
            const value = await valuationFunction(simulatedAssumptions);
            results.push(value);
        }
        // Calculate statistics
        results.sort((a, b) => a - b);
        const mean = results.reduce((sum, val) => sum + val, 0) / results.length;
        const variance = results.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / results.length;
        const stdDev = Math.sqrt(variance);
        const p10 = results[Math.floor(simulations * 0.10)];
        const p25 = results[Math.floor(simulations * 0.25)];
        const p50 = results[Math.floor(simulations * 0.50)];
        const p75 = results[Math.floor(simulations * 0.75)];
        const p90 = results[Math.floor(simulations * 0.90)];
        return {
            simulations,
            mean,
            stdDev,
            min: results[0],
            max: results[results.length - 1],
            p10,
            p25,
            p50,
            p75,
            p90,
            results: results.slice(0, 1000), // Return first 1000 for distribution plotting
        };
    }
    catch (error) {
        throw new Error(`Failed to perform Monte Carlo simulation: ${error.message}`);
    }
}
// ============================================================================
// VALUATION MULTIPLES FUNCTIONS
// ============================================================================
/**
 * Calculate implied valuation multiples.
 *
 * @param {number} enterpriseValue - Enterprise value
 * @param {number} equityValue - Equity value
 * @param {IncomeStatement} financials - Financial metrics
 * @returns {ImpliedMultiples} Implied multiples
 *
 * @example
 * ```typescript
 * const multiples = calculateImpliedMultiples(50000000, 45000000, incomeStatement);
 * console.log(`EV/EBITDA: ${multiples.evToEbitda.toFixed(2)}x`);
 * console.log(`P/E Ratio: ${multiples.peRatio.toFixed(2)}x`);
 * ```
 */
function calculateImpliedMultiples(enterpriseValue, equityValue, financials) {
    try {
        return {
            evToRevenue: financials.revenue > 0 ? enterpriseValue / financials.revenue : 0,
            evToEbitda: financials.ebitda > 0 ? enterpriseValue / financials.ebitda : 0,
            evToEbit: financials.ebit > 0 ? enterpriseValue / financials.ebit : 0,
            peRatio: financials.netIncome > 0 ? equityValue / financials.netIncome : 0,
            pbRatio: 0, // Would need book value from balance sheet
            priceToSales: financials.revenue > 0 ? equityValue / financials.revenue : 0,
            evToFCF: 0, // Would need FCF calculation
        };
    }
    catch (error) {
        throw new Error(`Failed to calculate implied multiples: ${error.message}`);
    }
}
/**
 * Perform comparable company analysis.
 *
 * @param {ComparableCompany[]} comparables - Comparable companies
 * @param {IncomeStatement} targetFinancials - Target company financials
 * @param {string[]} primaryMetrics - Primary metrics to use
 * @returns {Record<string, any>} Comparable company valuation
 *
 * @example
 * ```typescript
 * const compAnalysis = performComparableCompanyAnalysis(
 *   comparableCompanies,
 *   targetFinancials,
 *   ['evToEbitda', 'evToRevenue']
 * );
 * ```
 */
function performComparableCompanyAnalysis(comparables, targetFinancials, primaryMetrics = ['evToEbitda']) {
    try {
        const statistics = {};
        primaryMetrics.forEach((metric) => {
            const values = comparables.map((comp) => comp[metric]).filter((v) => v > 0);
            if (values.length === 0) {
                statistics[metric] = { mean: 0, median: 0, min: 0, max: 0 };
                return;
            }
            values.sort((a, b) => a - b);
            const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
            const median = values[Math.floor(values.length / 2)];
            const min = values[0];
            const max = values[values.length - 1];
            statistics[metric] = { mean, median, min, max, values };
        });
        // Calculate implied valuations
        const impliedValuations = {};
        if (statistics.evToEbitda && targetFinancials.ebitda) {
            impliedValuations.evFromEbitdaMean = statistics.evToEbitda.mean * targetFinancials.ebitda;
            impliedValuations.evFromEbitdaMedian = statistics.evToEbitda.median * targetFinancials.ebitda;
        }
        if (statistics.evToRevenue && targetFinancials.revenue) {
            impliedValuations.evFromRevenueMean = statistics.evToRevenue.mean * targetFinancials.revenue;
            impliedValuations.evFromRevenueMedian = statistics.evToRevenue.median * targetFinancials.revenue;
        }
        return {
            numberOfComparables: comparables.length,
            statistics,
            impliedValuations,
            comparables,
        };
    }
    catch (error) {
        throw new Error(`Failed to perform comparable company analysis: ${error.message}`);
    }
}
/**
 * Perform precedent transaction analysis.
 *
 * @param {PrecedentTransaction[]} transactions - Precedent transactions
 * @param {IncomeStatement} targetFinancials - Target company financials
 * @param {Date} cutoffDate - Only include transactions after this date
 * @returns {Record<string, any>} Precedent transaction valuation
 *
 * @example
 * ```typescript
 * const precedents = performPrecedentTransactionAnalysis(
 *   transactions,
 *   targetFinancials,
 *   new Date('2020-01-01')
 * );
 * ```
 */
function performPrecedentTransactionAnalysis(transactions, targetFinancials, cutoffDate) {
    try {
        let relevantTransactions = transactions;
        if (cutoffDate) {
            relevantTransactions = transactions.filter((txn) => txn.announcedDate >= cutoffDate);
        }
        const evToEbitdaValues = relevantTransactions
            .map((txn) => txn.evToEbitda)
            .filter((v) => v > 0);
        const evToRevenueValues = relevantTransactions
            .map((txn) => txn.evToRevenue)
            .filter((v) => v > 0);
        evToEbitdaValues.sort((a, b) => a - b);
        evToRevenueValues.sort((a, b) => a - b);
        const statistics = {
            evToEbitda: {
                mean: evToEbitdaValues.reduce((sum, val) => sum + val, 0) / evToEbitdaValues.length,
                median: evToEbitdaValues[Math.floor(evToEbitdaValues.length / 2)],
                min: evToEbitdaValues[0],
                max: evToEbitdaValues[evToEbitdaValues.length - 1],
            },
            evToRevenue: {
                mean: evToRevenueValues.reduce((sum, val) => sum + val, 0) / evToRevenueValues.length,
                median: evToRevenueValues[Math.floor(evToRevenueValues.length / 2)],
                min: evToRevenueValues[0],
                max: evToRevenueValues[evToRevenueValues.length - 1],
            },
        };
        const impliedValuations = {
            evFromEbitdaMean: statistics.evToEbitda.mean * targetFinancials.ebitda,
            evFromEbitdaMedian: statistics.evToEbitda.median * targetFinancials.ebitda,
            evFromRevenueMean: statistics.evToRevenue.mean * targetFinancials.revenue,
            evFromRevenueMedian: statistics.evToRevenue.median * targetFinancials.revenue,
        };
        return {
            numberOfTransactions: relevantTransactions.length,
            statistics,
            impliedValuations,
            transactions: relevantTransactions,
        };
    }
    catch (error) {
        throw new Error(`Failed to perform precedent transaction analysis: ${error.message}`);
    }
}
// ============================================================================
// LBO MODELING FUNCTIONS
// ============================================================================
/**
 * Build comprehensive LBO model.
 *
 * @param {string} targetCompany - Target company name
 * @param {number} purchasePrice - Purchase price
 * @param {number} equityContribution - Equity contribution
 * @param {number} entryMultiple - Entry EV/EBITDA multiple
 * @param {number} exitMultiple - Exit EV/EBITDA multiple
 * @param {number} holdingPeriod - Holding period in years
 * @param {CashFlowProjection[]} projections - Cash flow projections
 * @returns {LBOModel} Complete LBO model
 *
 * @example
 * ```typescript
 * const lbo = buildLBOModel(
 *   'TargetCo',
 *   100000000,
 *   30000000,
 *   10.0,
 *   12.0,
 *   5,
 *   cashFlowProjections
 * );
 * console.log(`IRR: ${(lbo.irr * 100).toFixed(2)}%`);
 * console.log(`MOIC: ${lbo.moic.toFixed(2)}x`);
 * ```
 */
function buildLBOModel(targetCompany, purchasePrice, equityContribution, entryMultiple, exitMultiple, holdingPeriod, projections) {
    try {
        const debtFinancing = purchasePrice - equityContribution;
        const ltv = debtFinancing / purchasePrice;
        // Build debt schedule
        const debtSchedule = [];
        let remainingDebt = debtFinancing;
        const interestRate = 0.07; // Assumed
        projections.slice(0, holdingPeriod).forEach((proj, index) => {
            const year = index + 1;
            const interestExpense = remainingDebt * interestRate;
            const cashFlowAvailable = proj.freeCashFlow;
            // Mandatory amortization (simplified)
            const requiredAmortization = debtFinancing * 0.05; // 5% annual
            // Optional prepayment with excess cash flow
            const excessCashFlow = Math.max(0, cashFlowAvailable - interestExpense - requiredAmortization);
            const optionalPrepayment = excessCashFlow * 0.50; // 50% cash flow sweep
            const totalPayment = requiredAmortization + optionalPrepayment;
            const beginningBalance = remainingDebt;
            remainingDebt = Math.max(0, remainingDebt - totalPayment);
            debtSchedule.push({
                year,
                beginningBalance,
                cashFlowAvailable,
                requiredAmortization,
                optionalPrepayment,
                totalPayment,
                endingBalance: remainingDebt,
                interestExpense,
            });
        });
        // Calculate exit value
        const exitYearEbitda = projections[holdingPeriod - 1].ebitda;
        const exitEnterpriseValue = exitYearEbitda * exitMultiple;
        const exitDebt = debtSchedule[debtSchedule.length - 1].endingBalance;
        const equityProceeds = exitEnterpriseValue - exitDebt;
        // Calculate returns
        const moic = equityProceeds / equityContribution;
        const irr = Math.pow(moic, 1 / holdingPeriod) - 1;
        // Build cash flow array for IRR calculation
        const cashFlows = [-equityContribution];
        debtSchedule.forEach((schedule) => {
            cashFlows.push(schedule.cashFlowAvailable - schedule.totalPayment - schedule.interestExpense);
        });
        cashFlows[cashFlows.length - 1] += equityProceeds;
        return {
            targetCompany,
            purchasePrice,
            enterpriseValue: purchasePrice,
            equityContribution,
            debtFinancing,
            ltv,
            entryMultiple,
            exitMultiple,
            holdingPeriod,
            exitYear: new Date().getFullYear() + holdingPeriod,
            exitEnterpriseValue,
            equityProceeds,
            moic,
            irr,
            cashFlows,
            debtSchedule,
        };
    }
    catch (error) {
        throw new Error(`Failed to build LBO model: ${error.message}`);
    }
}
/**
 * Calculate LBO returns attribution.
 *
 * @param {LBOModel} lboModel - LBO model
 * @returns {Record<string, any>} Returns attribution
 *
 * @example
 * ```typescript
 * const attribution = calculateLBOReturnsAttribution(lboModel);
 * console.log(`Multiple expansion: ${attribution.multipleExpansion.toFixed(2)}x`);
 * console.log(`Deleveraging: ${attribution.deleveraging.toFixed(2)}x`);
 * ```
 */
function calculateLBOReturnsAttribution(lboModel) {
    try {
        if (!lboModel.entryMultiple || !lboModel.exitMultiple || !lboModel.debtSchedule ||
            !lboModel.purchasePrice || !lboModel.equityContribution || !lboModel.exitEnterpriseValue) {
            throw new Error('Missing required LBO model data');
        }
        const multipleExpansion = (lboModel.exitMultiple - lboModel.entryMultiple) / lboModel.entryMultiple;
        const initialDebt = lboModel.purchasePrice - lboModel.equityContribution;
        const finalDebt = lboModel.debtSchedule[lboModel.debtSchedule.length - 1].endingBalance;
        const debtPaydown = initialDebt - finalDebt;
        const deleveraging = debtPaydown / lboModel.equityContribution;
        const ebitdaGrowth = 0; // Would need historical vs exit EBITDA
        return {
            multipleExpansion,
            multipleExpansionContribution: multipleExpansion,
            deleveraging,
            deleveragingContribution: deleveraging,
            ebitdaGrowth,
            ebitdaGrowthContribution: ebitdaGrowth,
            totalReturn: lboModel.moic ? lboModel.moic - 1 : 0,
        };
    }
    catch (error) {
        throw new Error(`Failed to calculate returns attribution: ${error.message}`);
    }
}
// ============================================================================
// BREAK-EVEN ANALYSIS FUNCTIONS
// ============================================================================
/**
 * Calculate comprehensive break-even analysis.
 *
 * @param {number} fixedCosts - Fixed costs
 * @param {number} variableCostPerUnit - Variable cost per unit
 * @param {number} pricePerUnit - Price per unit
 * @param {number} currentUnits - Current sales units (optional)
 * @returns {BreakEvenAnalysis} Break-even analysis
 *
 * @example
 * ```typescript
 * const breakEven = calculateBreakEvenAnalysis(500000, 25, 50, 30000);
 * console.log(`Break-even units: ${breakEven.breakEvenUnits.toLocaleString()}`);
 * console.log(`Margin of safety: ${(breakEven.marginOfSafety * 100).toFixed(2)}%`);
 * ```
 */
function calculateBreakEvenAnalysis(fixedCosts, variableCostPerUnit, pricePerUnit, currentUnits) {
    try {
        const contributionMargin = pricePerUnit - variableCostPerUnit;
        const contributionMarginRatio = contributionMargin / pricePerUnit;
        const breakEvenUnits = fixedCosts / contributionMargin;
        const breakEvenRevenue = breakEvenUnits * pricePerUnit;
        let marginOfSafety = 0;
        let operatingLeverage = 0;
        if (currentUnits) {
            const currentRevenue = currentUnits * pricePerUnit;
            marginOfSafety = (currentRevenue - breakEvenRevenue) / currentRevenue;
            const currentContributionMargin = currentUnits * contributionMargin;
            const currentOperatingIncome = currentContributionMargin - fixedCosts;
            if (currentOperatingIncome > 0) {
                operatingLeverage = currentContributionMargin / currentOperatingIncome;
            }
        }
        return {
            fixedCosts,
            variableCostPerUnit,
            pricePerUnit,
            contributionMargin,
            contributionMarginRatio,
            breakEvenUnits,
            breakEvenRevenue,
            marginOfSafety,
            operatingLeverage,
        };
    }
    catch (error) {
        throw new Error(`Failed to calculate break-even analysis: ${error.message}`);
    }
}
// ============================================================================
// MERGER & ACQUISITION FUNCTIONS
// ============================================================================
/**
 * Calculate accretion/dilution analysis for merger.
 *
 * @param {number} acquirorEPS - Acquiror standalone EPS
 * @param {number} acquirorShares - Acquiror shares outstanding
 * @param {number} targetEarnings - Target net income
 * @param {number} purchasePrice - Purchase price
 * @param {number} newSharesIssued - New shares issued (for stock deal)
 * @param {number} synergies - Expected synergies
 * @returns {AccretionDilution} Accretion/dilution analysis
 *
 * @example
 * ```typescript
 * const accretion = calculateAccretionDilution(2.50, 100000000, 50000000, 500000000, 20000000, 10000000);
 * console.log(`Accretion/Dilution: ${(accretion.accretionDilutionPercent).toFixed(2)}%`);
 * ```
 */
function calculateAccretionDilution(acquirorEPS, acquirorShares, targetEarnings, purchasePrice, newSharesIssued, synergies) {
    try {
        const acquirorEarnings = acquirorEPS * acquirorShares;
        const combinedEarnings = acquirorEarnings + targetEarnings + synergies;
        const combinedShares = acquirorShares + newSharesIssued;
        const proFormaEPS = combinedEarnings / combinedShares;
        const accretionDilution = proFormaEPS - acquirorEPS;
        const accretionDilutionPercent = (accretionDilution / acquirorEPS) * 100;
        return {
            year: 1,
            standAloneEPS: acquirorEPS,
            proFormaEPS,
            accretionDilution,
            accretionDilutionPercent,
        };
    }
    catch (error) {
        throw new Error(`Failed to calculate accretion/dilution: ${error.message}`);
    }
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Generate normal random variable (Box-Muller transform).
 */
function generateNormalRandom(mean, stdDev) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z0 * stdDev;
}
/**
 * Get default probability for scenario type.
 */
function getProbabilityForScenario(scenarioType) {
    const probabilities = {
        [ScenarioType.BASE_CASE]: 0.50,
        [ScenarioType.BEST_CASE]: 0.15,
        [ScenarioType.WORST_CASE]: 0.10,
        [ScenarioType.DOWNSIDE]: 0.20,
        [ScenarioType.UPSIDE]: 0.20,
        [ScenarioType.CUSTOM]: 0.25,
    };
    return probabilities[scenarioType] || 0.25;
}
/**
 * Generate UUID v4.
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    createFinancialModelModel: exports.createFinancialModelModel,
    createValuationComparableModel: exports.createValuationComparableModel,
    createLBOModelModel: exports.createLBOModelModel,
    createMergerModelModel: exports.createMergerModelModel,
    // DCF Functions
    calculateNPV,
    calculateIRR,
    calculateWACC,
    performDCFValuation,
    calculateTerminalValuePerpetualGrowth,
    calculateTerminalValueExitMultiple,
    calculateEquityValue,
    // Sensitivity Analysis
    performSensitivityAnalysis,
    performTwoWaySensitivity,
    generateTornadoChart,
    // Scenario Modeling
    createScenarioAnalysis,
    calculateExpectedValue,
    performMonteCarloSimulation,
    // Valuation Multiples
    calculateImpliedMultiples,
    performComparableCompanyAnalysis,
    performPrecedentTransactionAnalysis,
    // LBO Modeling
    buildLBOModel,
    calculateLBOReturnsAttribution,
    // Break-even Analysis
    calculateBreakEvenAnalysis,
    // M&A Functions
    calculateAccretionDilution,
};
//# sourceMappingURL=financial-modeling-kit.js.map