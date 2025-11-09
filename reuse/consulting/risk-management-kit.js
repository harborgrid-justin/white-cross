"use strict";
/**
 * LOC: CONSRISK89012
 * File: /reuse/consulting/risk-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Consulting engagement services
 *   - Risk advisory controllers
 *   - ERM and compliance modules
 *   - Governance services
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
exports.UpdateRiskAppetiteDto = exports.CreateCOSOAssessmentDto = exports.RunMonteCarloDto = exports.CreateRiskMatrixDto = exports.CreateControlDto = exports.AssessRiskDto = exports.CreateRiskDto = exports.createCOSOAssessmentModel = exports.createRiskControlModel = exports.createRiskAssessmentModel = exports.createRiskRegisterModel = exports.ISO31000Process = exports.COSOPrinciple = exports.COSOComponent = exports.ControlEffectiveness = exports.ControlType = exports.RiskTreatment = exports.RiskStatus = exports.RiskLevel = exports.RiskCategory = exports.RiskFramework = void 0;
exports.calculateInherentRiskScore = calculateInherentRiskScore;
exports.calculateResidualRiskScore = calculateResidualRiskScore;
exports.generateRiskMatrix = generateRiskMatrix;
exports.generateRiskHeatMap = generateRiskHeatMap;
exports.assessCOSOCompliance = assessCOSOCompliance;
exports.assessCOSOComponent = assessCOSOComponent;
exports.assessISO31000Compliance = assessISO31000Compliance;
exports.performMonteCarloRiskSimulation = performMonteCarloRiskSimulation;
exports.performBowTieAnalysis = performBowTieAnalysis;
exports.performFMEA = performFMEA;
exports.calculateRPN = calculateRPN;
exports.performRootCauseAnalysis = performRootCauseAnalysis;
exports.assessThreeLinesOfDefense = assessThreeLinesOfDefense;
exports.defineRiskAppetite = defineRiskAppetite;
/**
 * File: /reuse/consulting/risk-management-kit.ts
 * Locator: WC-CONS-RISKMGMT-001
 * Purpose: McKinsey/BCG-Level Risk Management - COSO framework, ISO 31000, risk matrices, Monte Carlo, ERM
 *
 * Upstream: Independent risk management utility module
 * Downstream: ../backend/*, Consulting controllers, Risk advisory services, ERM modules, Compliance systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Decimal.js, mathjs
 * Exports: 50+ utility functions for COSO implementation, ISO 31000 compliance, risk assessment, risk matrices, heat maps, Monte Carlo simulation
 *
 * LLM Context: Enterprise-grade risk management competing with McKinsey and BCG ERM capabilities.
 * Provides comprehensive COSO framework implementation, ISO 31000 risk management standards, enterprise risk management (ERM),
 * risk identification and assessment, risk scoring and rating methodologies, risk matrices and heat maps, Monte Carlo simulation,
 * operational risk management, strategic risk assessment, compliance risk frameworks, financial risk management, risk mitigation strategies,
 * risk monitoring and reporting, key risk indicators (KRIs), risk appetite and tolerance frameworks, risk control assessment,
 * three lines of defense model, bow-tie analysis, failure mode analysis (FMEA), root cause analysis, scenario-based risk assessment,
 * and integrated risk governance with audit trails and regulatory compliance.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
var RiskFramework;
(function (RiskFramework) {
    RiskFramework["COSO_ERM"] = "coso-erm";
    RiskFramework["ISO_31000"] = "iso-31000";
    RiskFramework["NIST"] = "nist";
    RiskFramework["BASEL_III"] = "basel-iii";
    RiskFramework["SOX"] = "sox";
    RiskFramework["COBIT"] = "cobit";
})(RiskFramework || (exports.RiskFramework = RiskFramework = {}));
var RiskCategory;
(function (RiskCategory) {
    RiskCategory["STRATEGIC"] = "strategic";
    RiskCategory["OPERATIONAL"] = "operational";
    RiskCategory["FINANCIAL"] = "financial";
    RiskCategory["COMPLIANCE"] = "compliance";
    RiskCategory["REPUTATIONAL"] = "reputational";
    RiskCategory["TECHNOLOGY"] = "technology";
    RiskCategory["ENVIRONMENTAL"] = "environmental";
    RiskCategory["MARKET"] = "market";
})(RiskCategory || (exports.RiskCategory = RiskCategory = {}));
var RiskLevel;
(function (RiskLevel) {
    RiskLevel["CRITICAL"] = "critical";
    RiskLevel["HIGH"] = "high";
    RiskLevel["MEDIUM"] = "medium";
    RiskLevel["LOW"] = "low";
    RiskLevel["NEGLIGIBLE"] = "negligible";
})(RiskLevel || (exports.RiskLevel = RiskLevel = {}));
var RiskStatus;
(function (RiskStatus) {
    RiskStatus["IDENTIFIED"] = "identified";
    RiskStatus["ASSESSED"] = "assessed";
    RiskStatus["MITIGATED"] = "mitigated";
    RiskStatus["MONITORED"] = "monitored";
    RiskStatus["CLOSED"] = "closed";
    RiskStatus["ESCALATED"] = "escalated";
})(RiskStatus || (exports.RiskStatus = RiskStatus = {}));
var RiskTreatment;
(function (RiskTreatment) {
    RiskTreatment["AVOID"] = "avoid";
    RiskTreatment["MITIGATE"] = "mitigate";
    RiskTreatment["TRANSFER"] = "transfer";
    RiskTreatment["ACCEPT"] = "accept";
})(RiskTreatment || (exports.RiskTreatment = RiskTreatment = {}));
var ControlType;
(function (ControlType) {
    ControlType["PREVENTIVE"] = "preventive";
    ControlType["DETECTIVE"] = "detective";
    ControlType["CORRECTIVE"] = "corrective";
    ControlType["DIRECTIVE"] = "directive";
})(ControlType || (exports.ControlType = ControlType = {}));
var ControlEffectiveness;
(function (ControlEffectiveness) {
    ControlEffectiveness["EFFECTIVE"] = "effective";
    ControlEffectiveness["PARTIALLY_EFFECTIVE"] = "partially-effective";
    ControlEffectiveness["INEFFECTIVE"] = "ineffective";
    ControlEffectiveness["NOT_TESTED"] = "not-tested";
})(ControlEffectiveness || (exports.ControlEffectiveness = ControlEffectiveness = {}));
var COSOComponent;
(function (COSOComponent) {
    COSOComponent["GOVERNANCE_CULTURE"] = "governance-culture";
    COSOComponent["STRATEGY_OBJECTIVE"] = "strategy-objective";
    COSOComponent["PERFORMANCE"] = "performance";
    COSOComponent["REVIEW_REVISION"] = "review-revision";
    COSOComponent["INFORMATION_COMMUNICATION"] = "information-communication";
})(COSOComponent || (exports.COSOComponent = COSOComponent = {}));
var COSOPrinciple;
(function (COSOPrinciple) {
    COSOPrinciple["OVERSIGHT"] = "oversight";
    COSOPrinciple["INDEPENDENCE"] = "independence";
    COSOPrinciple["COMPETENCE"] = "competence";
    COSOPrinciple["ACCOUNTABILITY"] = "accountability";
    COSOPrinciple["INTEGRITY"] = "integrity";
})(COSOPrinciple || (exports.COSOPrinciple = COSOPrinciple = {}));
var ISO31000Process;
(function (ISO31000Process) {
    ISO31000Process["COMMUNICATION"] = "communication";
    ISO31000Process["SCOPE_CONTEXT"] = "scope-context";
    ISO31000Process["RISK_ASSESSMENT"] = "risk-assessment";
    ISO31000Process["RISK_TREATMENT"] = "risk-treatment";
    ISO31000Process["MONITORING_REVIEW"] = "monitoring-review";
    ISO31000Process["RECORDING_REPORTING"] = "recording-reporting";
})(ISO31000Process || (exports.ISO31000Process = ISO31000Process = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Risk Register with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RiskRegister model
 *
 * @example
 * ```typescript
 * const RiskRegister = createRiskRegisterModel(sequelize);
 * const register = await RiskRegister.create({
 *   organizationId: 'ORG_001',
 *   framework: 'coso-erm',
 *   risks: []
 * });
 * ```
 */
const createRiskRegisterModel = (sequelize) => {
    class RiskRegister extends sequelize_1.Model {
    }
    RiskRegister.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        registerId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'Unique register identifier',
        },
        organizationId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Organization identifier',
        },
        organizationName: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Organization name',
        },
        framework: {
            type: sequelize_1.DataTypes.ENUM('coso-erm', 'iso-31000', 'nist', 'basel-iii', 'sox', 'cobit'),
            allowNull: false,
            comment: 'Risk management framework',
        },
        risks: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Array of risks',
        },
        totalRisks: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Total number of risks',
        },
        criticalRisks: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of critical risks',
        },
        highRisks: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of high risks',
        },
        mediumRisks: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of medium risks',
        },
        lowRisks: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of low risks',
        },
        lastReviewDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last review date',
        },
        nextReviewDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Next review date',
        },
        reviewedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Reviewer identifier',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'archived', 'draft'),
            allowNull: false,
            defaultValue: 'active',
            comment: 'Register status',
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
        tableName: 'risk_registers',
        timestamps: true,
        indexes: [
            { fields: ['registerId'], unique: true },
            { fields: ['organizationId'] },
            { fields: ['framework'] },
            { fields: ['status'] },
            { fields: ['nextReviewDate'] },
            { fields: ['createdBy'] },
        ],
    });
    return RiskRegister;
};
exports.createRiskRegisterModel = createRiskRegisterModel;
/**
 * Sequelize model for Risk Assessments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RiskAssessment model
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
            comment: 'Assessment identifier',
        },
        riskId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Risk identifier',
        },
        registerId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Register identifier',
        },
        riskTitle: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Risk title',
        },
        riskDescription: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Risk description',
        },
        category: {
            type: sequelize_1.DataTypes.ENUM('strategic', 'operational', 'financial', 'compliance', 'reputational', 'technology', 'environmental', 'market'),
            allowNull: false,
            comment: 'Risk category',
        },
        subCategory: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Risk sub-category',
        },
        owner: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Risk owner',
        },
        assessmentDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Assessment date',
        },
        assessedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Assessor identifier',
        },
        likelihoodScore: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Likelihood score (1-5)',
        },
        impactScore: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Impact score (1-5)',
        },
        inherentRiskScore: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Inherent risk score',
        },
        inherentRiskLevel: {
            type: sequelize_1.DataTypes.ENUM('critical', 'high', 'medium', 'low', 'negligible'),
            allowNull: false,
            comment: 'Inherent risk level',
        },
        controlEffectiveness: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Control effectiveness percentage',
        },
        residualRiskScore: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Residual risk score',
        },
        residualRiskLevel: {
            type: sequelize_1.DataTypes.ENUM('critical', 'high', 'medium', 'low', 'negligible'),
            allowNull: false,
            comment: 'Residual risk level',
        },
        treatment: {
            type: sequelize_1.DataTypes.ENUM('avoid', 'mitigate', 'transfer', 'accept'),
            allowNull: false,
            comment: 'Risk treatment strategy',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('identified', 'assessed', 'mitigated', 'monitored', 'closed', 'escalated'),
            allowNull: false,
            defaultValue: 'assessed',
            comment: 'Risk status',
        },
        methodology: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            defaultValue: 'qualitative',
            comment: 'Assessment methodology',
        },
        confidenceLevel: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 75,
            comment: 'Confidence level in assessment',
        },
        reviewFrequency: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'quarterly',
            comment: 'Review frequency',
        },
        nextReviewDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Next review date',
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
            { fields: ['riskId'] },
            { fields: ['registerId'] },
            { fields: ['category'] },
            { fields: ['inherentRiskLevel'] },
            { fields: ['residualRiskLevel'] },
            { fields: ['status'] },
            { fields: ['nextReviewDate'] },
            { fields: ['owner'] },
        ],
    });
    return RiskAssessment;
};
exports.createRiskAssessmentModel = createRiskAssessmentModel;
/**
 * Sequelize model for Risk Controls.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RiskControl model
 */
const createRiskControlModel = (sequelize) => {
    class RiskControl extends sequelize_1.Model {
    }
    RiskControl.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        controlId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'Control identifier',
        },
        riskId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Associated risk identifier',
        },
        controlName: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Control name',
        },
        controlDescription: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Control description',
        },
        controlType: {
            type: sequelize_1.DataTypes.ENUM('preventive', 'detective', 'corrective', 'directive'),
            allowNull: false,
            comment: 'Control type',
        },
        controlOwner: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Control owner',
        },
        implementationStatus: {
            type: sequelize_1.DataTypes.ENUM('planned', 'in-progress', 'implemented', 'not-implemented'),
            allowNull: false,
            defaultValue: 'planned',
            comment: 'Implementation status',
        },
        effectiveness: {
            type: sequelize_1.DataTypes.ENUM('effective', 'partially-effective', 'ineffective', 'not-tested'),
            allowNull: false,
            defaultValue: 'not-tested',
            comment: 'Control effectiveness',
        },
        testingFrequency: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'annual',
            comment: 'Testing frequency',
        },
        lastTestDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last test date',
        },
        nextTestDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Next test date',
        },
        testResults: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Latest test results',
        },
        automationLevel: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Automation level (0-100)',
        },
        cost: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Annual cost of control',
        },
        riskReduction: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Risk reduction percentage',
        },
        evidenceDocumentation: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Evidence documentation',
        },
        deficiencies: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Control deficiencies',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'inactive', 'retired'),
            allowNull: false,
            defaultValue: 'active',
            comment: 'Control status',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'risk_controls',
        timestamps: true,
        indexes: [
            { fields: ['controlId'], unique: true },
            { fields: ['riskId'] },
            { fields: ['controlType'] },
            { fields: ['controlOwner'] },
            { fields: ['effectiveness'] },
            { fields: ['status'] },
            { fields: ['nextTestDate'] },
        ],
    });
    return RiskControl;
};
exports.createRiskControlModel = createRiskControlModel;
/**
 * Sequelize model for COSO Assessments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} COSOAssessment model
 */
const createCOSOAssessmentModel = (sequelize) => {
    class COSOAssessment extends sequelize_1.Model {
    }
    COSOAssessment.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        assessmentId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'Assessment identifier',
        },
        organizationId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Organization identifier',
        },
        assessmentDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Assessment date',
        },
        assessmentPeriod: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Assessment period',
        },
        components: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'COSO component assessments',
        },
        principles: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'COSO principle assessments',
        },
        overallMaturity: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Overall maturity score (0-100)',
        },
        maturityLevel: {
            type: sequelize_1.DataTypes.ENUM('initial', 'developing', 'defined', 'managed', 'optimized'),
            allowNull: false,
            comment: 'Maturity level',
        },
        gaps: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Identified gaps',
        },
        strengths: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Identified strengths',
        },
        recommendations: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Recommendations',
        },
        actionPlan: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Action plan',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'review', 'approved', 'implemented'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Assessment status',
        },
        assessedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Assessor identifier',
        },
        reviewedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Reviewer identifier',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Approver identifier',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'coso_assessments',
        timestamps: true,
        indexes: [
            { fields: ['assessmentId'], unique: true },
            { fields: ['organizationId'] },
            { fields: ['assessmentDate'] },
            { fields: ['maturityLevel'] },
            { fields: ['status'] },
            { fields: ['assessedBy'] },
        ],
    });
    return COSOAssessment;
};
exports.createCOSOAssessmentModel = createCOSOAssessmentModel;
// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================
let CreateRiskDto = (() => {
    var _a;
    let _riskTitle_decorators;
    let _riskTitle_initializers = [];
    let _riskTitle_extraInitializers = [];
    let _riskDescription_decorators;
    let _riskDescription_initializers = [];
    let _riskDescription_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _subCategory_decorators;
    let _subCategory_initializers = [];
    let _subCategory_extraInitializers = [];
    let _owner_decorators;
    let _owner_initializers = [];
    let _owner_extraInitializers = [];
    let _likelihood_decorators;
    let _likelihood_initializers = [];
    let _likelihood_extraInitializers = [];
    let _impact_decorators;
    let _impact_initializers = [];
    let _impact_extraInitializers = [];
    let _treatment_decorators;
    let _treatment_initializers = [];
    let _treatment_extraInitializers = [];
    let _identifiedBy_decorators;
    let _identifiedBy_initializers = [];
    let _identifiedBy_extraInitializers = [];
    return _a = class CreateRiskDto {
            constructor() {
                this.riskTitle = __runInitializers(this, _riskTitle_initializers, void 0);
                this.riskDescription = (__runInitializers(this, _riskTitle_extraInitializers), __runInitializers(this, _riskDescription_initializers, void 0));
                this.category = (__runInitializers(this, _riskDescription_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.subCategory = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _subCategory_initializers, void 0));
                this.owner = (__runInitializers(this, _subCategory_extraInitializers), __runInitializers(this, _owner_initializers, void 0));
                this.likelihood = (__runInitializers(this, _owner_extraInitializers), __runInitializers(this, _likelihood_initializers, void 0));
                this.impact = (__runInitializers(this, _likelihood_extraInitializers), __runInitializers(this, _impact_initializers, void 0));
                this.treatment = (__runInitializers(this, _impact_extraInitializers), __runInitializers(this, _treatment_initializers, void 0));
                this.identifiedBy = (__runInitializers(this, _treatment_extraInitializers), __runInitializers(this, _identifiedBy_initializers, void 0));
                __runInitializers(this, _identifiedBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _riskTitle_decorators = [(0, swagger_1.ApiProperty)({ description: 'Risk title' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(500)];
            _riskDescription_decorators = [(0, swagger_1.ApiProperty)({ description: 'Risk description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _category_decorators = [(0, swagger_1.ApiProperty)({ enum: RiskCategory, description: 'Risk category' }), (0, class_validator_1.IsEnum)(RiskCategory)];
            _subCategory_decorators = [(0, swagger_1.ApiProperty)({ description: 'Risk sub-category' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _owner_decorators = [(0, swagger_1.ApiProperty)({ description: 'Risk owner' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _likelihood_decorators = [(0, swagger_1.ApiProperty)({ description: 'Likelihood score (1-5)' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(5)];
            _impact_decorators = [(0, swagger_1.ApiProperty)({ description: 'Impact score (1-5)' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(5)];
            _treatment_decorators = [(0, swagger_1.ApiProperty)({ enum: RiskTreatment, description: 'Risk treatment strategy' }), (0, class_validator_1.IsEnum)(RiskTreatment)];
            _identifiedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Identified by user ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _riskTitle_decorators, { kind: "field", name: "riskTitle", static: false, private: false, access: { has: obj => "riskTitle" in obj, get: obj => obj.riskTitle, set: (obj, value) => { obj.riskTitle = value; } }, metadata: _metadata }, _riskTitle_initializers, _riskTitle_extraInitializers);
            __esDecorate(null, null, _riskDescription_decorators, { kind: "field", name: "riskDescription", static: false, private: false, access: { has: obj => "riskDescription" in obj, get: obj => obj.riskDescription, set: (obj, value) => { obj.riskDescription = value; } }, metadata: _metadata }, _riskDescription_initializers, _riskDescription_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _subCategory_decorators, { kind: "field", name: "subCategory", static: false, private: false, access: { has: obj => "subCategory" in obj, get: obj => obj.subCategory, set: (obj, value) => { obj.subCategory = value; } }, metadata: _metadata }, _subCategory_initializers, _subCategory_extraInitializers);
            __esDecorate(null, null, _owner_decorators, { kind: "field", name: "owner", static: false, private: false, access: { has: obj => "owner" in obj, get: obj => obj.owner, set: (obj, value) => { obj.owner = value; } }, metadata: _metadata }, _owner_initializers, _owner_extraInitializers);
            __esDecorate(null, null, _likelihood_decorators, { kind: "field", name: "likelihood", static: false, private: false, access: { has: obj => "likelihood" in obj, get: obj => obj.likelihood, set: (obj, value) => { obj.likelihood = value; } }, metadata: _metadata }, _likelihood_initializers, _likelihood_extraInitializers);
            __esDecorate(null, null, _impact_decorators, { kind: "field", name: "impact", static: false, private: false, access: { has: obj => "impact" in obj, get: obj => obj.impact, set: (obj, value) => { obj.impact = value; } }, metadata: _metadata }, _impact_initializers, _impact_extraInitializers);
            __esDecorate(null, null, _treatment_decorators, { kind: "field", name: "treatment", static: false, private: false, access: { has: obj => "treatment" in obj, get: obj => obj.treatment, set: (obj, value) => { obj.treatment = value; } }, metadata: _metadata }, _treatment_initializers, _treatment_extraInitializers);
            __esDecorate(null, null, _identifiedBy_decorators, { kind: "field", name: "identifiedBy", static: false, private: false, access: { has: obj => "identifiedBy" in obj, get: obj => obj.identifiedBy, set: (obj, value) => { obj.identifiedBy = value; } }, metadata: _metadata }, _identifiedBy_initializers, _identifiedBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateRiskDto = CreateRiskDto;
let AssessRiskDto = (() => {
    var _a;
    let _riskId_decorators;
    let _riskId_initializers = [];
    let _riskId_extraInitializers = [];
    let _likelihood_decorators;
    let _likelihood_initializers = [];
    let _likelihood_extraInitializers = [];
    let _impact_decorators;
    let _impact_initializers = [];
    let _impact_extraInitializers = [];
    let _methodology_decorators;
    let _methodology_initializers = [];
    let _methodology_extraInitializers = [];
    let _confidenceLevel_decorators;
    let _confidenceLevel_initializers = [];
    let _confidenceLevel_extraInitializers = [];
    let _assessedBy_decorators;
    let _assessedBy_initializers = [];
    let _assessedBy_extraInitializers = [];
    return _a = class AssessRiskDto {
            constructor() {
                this.riskId = __runInitializers(this, _riskId_initializers, void 0);
                this.likelihood = (__runInitializers(this, _riskId_extraInitializers), __runInitializers(this, _likelihood_initializers, void 0));
                this.impact = (__runInitializers(this, _likelihood_extraInitializers), __runInitializers(this, _impact_initializers, void 0));
                this.methodology = (__runInitializers(this, _impact_extraInitializers), __runInitializers(this, _methodology_initializers, void 0));
                this.confidenceLevel = (__runInitializers(this, _methodology_extraInitializers), __runInitializers(this, _confidenceLevel_initializers, void 0));
                this.assessedBy = (__runInitializers(this, _confidenceLevel_extraInitializers), __runInitializers(this, _assessedBy_initializers, void 0));
                __runInitializers(this, _assessedBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _riskId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Risk ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _likelihood_decorators = [(0, swagger_1.ApiProperty)({ description: 'Likelihood score (1-5)' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(5)];
            _impact_decorators = [(0, swagger_1.ApiProperty)({ description: 'Impact score (1-5)' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(5)];
            _methodology_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assessment methodology' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _confidenceLevel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Confidence level (0-100)', required: false }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _assessedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assessor user ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _riskId_decorators, { kind: "field", name: "riskId", static: false, private: false, access: { has: obj => "riskId" in obj, get: obj => obj.riskId, set: (obj, value) => { obj.riskId = value; } }, metadata: _metadata }, _riskId_initializers, _riskId_extraInitializers);
            __esDecorate(null, null, _likelihood_decorators, { kind: "field", name: "likelihood", static: false, private: false, access: { has: obj => "likelihood" in obj, get: obj => obj.likelihood, set: (obj, value) => { obj.likelihood = value; } }, metadata: _metadata }, _likelihood_initializers, _likelihood_extraInitializers);
            __esDecorate(null, null, _impact_decorators, { kind: "field", name: "impact", static: false, private: false, access: { has: obj => "impact" in obj, get: obj => obj.impact, set: (obj, value) => { obj.impact = value; } }, metadata: _metadata }, _impact_initializers, _impact_extraInitializers);
            __esDecorate(null, null, _methodology_decorators, { kind: "field", name: "methodology", static: false, private: false, access: { has: obj => "methodology" in obj, get: obj => obj.methodology, set: (obj, value) => { obj.methodology = value; } }, metadata: _metadata }, _methodology_initializers, _methodology_extraInitializers);
            __esDecorate(null, null, _confidenceLevel_decorators, { kind: "field", name: "confidenceLevel", static: false, private: false, access: { has: obj => "confidenceLevel" in obj, get: obj => obj.confidenceLevel, set: (obj, value) => { obj.confidenceLevel = value; } }, metadata: _metadata }, _confidenceLevel_initializers, _confidenceLevel_extraInitializers);
            __esDecorate(null, null, _assessedBy_decorators, { kind: "field", name: "assessedBy", static: false, private: false, access: { has: obj => "assessedBy" in obj, get: obj => obj.assessedBy, set: (obj, value) => { obj.assessedBy = value; } }, metadata: _metadata }, _assessedBy_initializers, _assessedBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AssessRiskDto = AssessRiskDto;
let CreateControlDto = (() => {
    var _a;
    let _riskId_decorators;
    let _riskId_initializers = [];
    let _riskId_extraInitializers = [];
    let _controlName_decorators;
    let _controlName_initializers = [];
    let _controlName_extraInitializers = [];
    let _controlDescription_decorators;
    let _controlDescription_initializers = [];
    let _controlDescription_extraInitializers = [];
    let _controlType_decorators;
    let _controlType_initializers = [];
    let _controlType_extraInitializers = [];
    let _controlOwner_decorators;
    let _controlOwner_initializers = [];
    let _controlOwner_extraInitializers = [];
    let _riskReduction_decorators;
    let _riskReduction_initializers = [];
    let _riskReduction_extraInitializers = [];
    let _cost_decorators;
    let _cost_initializers = [];
    let _cost_extraInitializers = [];
    return _a = class CreateControlDto {
            constructor() {
                this.riskId = __runInitializers(this, _riskId_initializers, void 0);
                this.controlName = (__runInitializers(this, _riskId_extraInitializers), __runInitializers(this, _controlName_initializers, void 0));
                this.controlDescription = (__runInitializers(this, _controlName_extraInitializers), __runInitializers(this, _controlDescription_initializers, void 0));
                this.controlType = (__runInitializers(this, _controlDescription_extraInitializers), __runInitializers(this, _controlType_initializers, void 0));
                this.controlOwner = (__runInitializers(this, _controlType_extraInitializers), __runInitializers(this, _controlOwner_initializers, void 0));
                this.riskReduction = (__runInitializers(this, _controlOwner_extraInitializers), __runInitializers(this, _riskReduction_initializers, void 0));
                this.cost = (__runInitializers(this, _riskReduction_extraInitializers), __runInitializers(this, _cost_initializers, void 0));
                __runInitializers(this, _cost_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _riskId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Risk ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _controlName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Control name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(500)];
            _controlDescription_decorators = [(0, swagger_1.ApiProperty)({ description: 'Control description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _controlType_decorators = [(0, swagger_1.ApiProperty)({ enum: ControlType, description: 'Control type' }), (0, class_validator_1.IsEnum)(ControlType)];
            _controlOwner_decorators = [(0, swagger_1.ApiProperty)({ description: 'Control owner' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _riskReduction_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expected risk reduction (%)', required: false }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _cost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Annual cost', required: false }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _riskId_decorators, { kind: "field", name: "riskId", static: false, private: false, access: { has: obj => "riskId" in obj, get: obj => obj.riskId, set: (obj, value) => { obj.riskId = value; } }, metadata: _metadata }, _riskId_initializers, _riskId_extraInitializers);
            __esDecorate(null, null, _controlName_decorators, { kind: "field", name: "controlName", static: false, private: false, access: { has: obj => "controlName" in obj, get: obj => obj.controlName, set: (obj, value) => { obj.controlName = value; } }, metadata: _metadata }, _controlName_initializers, _controlName_extraInitializers);
            __esDecorate(null, null, _controlDescription_decorators, { kind: "field", name: "controlDescription", static: false, private: false, access: { has: obj => "controlDescription" in obj, get: obj => obj.controlDescription, set: (obj, value) => { obj.controlDescription = value; } }, metadata: _metadata }, _controlDescription_initializers, _controlDescription_extraInitializers);
            __esDecorate(null, null, _controlType_decorators, { kind: "field", name: "controlType", static: false, private: false, access: { has: obj => "controlType" in obj, get: obj => obj.controlType, set: (obj, value) => { obj.controlType = value; } }, metadata: _metadata }, _controlType_initializers, _controlType_extraInitializers);
            __esDecorate(null, null, _controlOwner_decorators, { kind: "field", name: "controlOwner", static: false, private: false, access: { has: obj => "controlOwner" in obj, get: obj => obj.controlOwner, set: (obj, value) => { obj.controlOwner = value; } }, metadata: _metadata }, _controlOwner_initializers, _controlOwner_extraInitializers);
            __esDecorate(null, null, _riskReduction_decorators, { kind: "field", name: "riskReduction", static: false, private: false, access: { has: obj => "riskReduction" in obj, get: obj => obj.riskReduction, set: (obj, value) => { obj.riskReduction = value; } }, metadata: _metadata }, _riskReduction_initializers, _riskReduction_extraInitializers);
            __esDecorate(null, null, _cost_decorators, { kind: "field", name: "cost", static: false, private: false, access: { has: obj => "cost" in obj, get: obj => obj.cost, set: (obj, value) => { obj.cost = value; } }, metadata: _metadata }, _cost_initializers, _cost_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateControlDto = CreateControlDto;
let CreateRiskMatrixDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _dimensions_decorators;
    let _dimensions_initializers = [];
    let _dimensions_extraInitializers = [];
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    return _a = class CreateRiskMatrixDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.dimensions = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _dimensions_initializers, void 0));
                this.organizationId = (__runInitializers(this, _dimensions_extraInitializers), __runInitializers(this, _organizationId_initializers, void 0));
                __runInitializers(this, _organizationId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Matrix name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _dimensions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Matrix dimensions (e.g., 5 for 5x5)' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(3), (0, class_validator_1.Max)(7)];
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _dimensions_decorators, { kind: "field", name: "dimensions", static: false, private: false, access: { has: obj => "dimensions" in obj, get: obj => obj.dimensions, set: (obj, value) => { obj.dimensions = value; } }, metadata: _metadata }, _dimensions_initializers, _dimensions_extraInitializers);
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateRiskMatrixDto = CreateRiskMatrixDto;
let RunMonteCarloDto = (() => {
    var _a;
    let _riskScenario_decorators;
    let _riskScenario_initializers = [];
    let _riskScenario_extraInitializers = [];
    let _iterations_decorators;
    let _iterations_initializers = [];
    let _iterations_extraInitializers = [];
    let _variables_decorators;
    let _variables_initializers = [];
    let _variables_extraInitializers = [];
    return _a = class RunMonteCarloDto {
            constructor() {
                this.riskScenario = __runInitializers(this, _riskScenario_initializers, void 0);
                this.iterations = (__runInitializers(this, _riskScenario_extraInitializers), __runInitializers(this, _iterations_initializers, void 0));
                this.variables = (__runInitializers(this, _iterations_extraInitializers), __runInitializers(this, _variables_initializers, void 0));
                __runInitializers(this, _variables_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _riskScenario_decorators = [(0, swagger_1.ApiProperty)({ description: 'Risk scenario name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _iterations_decorators = [(0, swagger_1.ApiProperty)({ description: 'Number of iterations' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1000), (0, class_validator_1.Max)(100000)];
            _variables_decorators = [(0, swagger_1.ApiProperty)({ description: 'Simulation variables' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _riskScenario_decorators, { kind: "field", name: "riskScenario", static: false, private: false, access: { has: obj => "riskScenario" in obj, get: obj => obj.riskScenario, set: (obj, value) => { obj.riskScenario = value; } }, metadata: _metadata }, _riskScenario_initializers, _riskScenario_extraInitializers);
            __esDecorate(null, null, _iterations_decorators, { kind: "field", name: "iterations", static: false, private: false, access: { has: obj => "iterations" in obj, get: obj => obj.iterations, set: (obj, value) => { obj.iterations = value; } }, metadata: _metadata }, _iterations_initializers, _iterations_extraInitializers);
            __esDecorate(null, null, _variables_decorators, { kind: "field", name: "variables", static: false, private: false, access: { has: obj => "variables" in obj, get: obj => obj.variables, set: (obj, value) => { obj.variables = value; } }, metadata: _metadata }, _variables_initializers, _variables_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RunMonteCarloDto = RunMonteCarloDto;
let CreateCOSOAssessmentDto = (() => {
    var _a;
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _assessmentPeriod_decorators;
    let _assessmentPeriod_initializers = [];
    let _assessmentPeriod_extraInitializers = [];
    let _assessedBy_decorators;
    let _assessedBy_initializers = [];
    let _assessedBy_extraInitializers = [];
    return _a = class CreateCOSOAssessmentDto {
            constructor() {
                this.organizationId = __runInitializers(this, _organizationId_initializers, void 0);
                this.assessmentPeriod = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _assessmentPeriod_initializers, void 0));
                this.assessedBy = (__runInitializers(this, _assessmentPeriod_extraInitializers), __runInitializers(this, _assessedBy_initializers, void 0));
                __runInitializers(this, _assessedBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _assessmentPeriod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assessment period' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _assessedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assessor user ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _assessmentPeriod_decorators, { kind: "field", name: "assessmentPeriod", static: false, private: false, access: { has: obj => "assessmentPeriod" in obj, get: obj => obj.assessmentPeriod, set: (obj, value) => { obj.assessmentPeriod = value; } }, metadata: _metadata }, _assessmentPeriod_initializers, _assessmentPeriod_extraInitializers);
            __esDecorate(null, null, _assessedBy_decorators, { kind: "field", name: "assessedBy", static: false, private: false, access: { has: obj => "assessedBy" in obj, get: obj => obj.assessedBy, set: (obj, value) => { obj.assessedBy = value; } }, metadata: _metadata }, _assessedBy_initializers, _assessedBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCOSOAssessmentDto = CreateCOSOAssessmentDto;
let UpdateRiskAppetiteDto = (() => {
    var _a;
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _overallAppetite_decorators;
    let _overallAppetite_initializers = [];
    let _overallAppetite_extraInitializers = [];
    let _appetiteByCategory_decorators;
    let _appetiteByCategory_initializers = [];
    let _appetiteByCategory_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    return _a = class UpdateRiskAppetiteDto {
            constructor() {
                this.organizationId = __runInitializers(this, _organizationId_initializers, void 0);
                this.overallAppetite = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _overallAppetite_initializers, void 0));
                this.appetiteByCategory = (__runInitializers(this, _overallAppetite_extraInitializers), __runInitializers(this, _appetiteByCategory_initializers, void 0));
                this.approvedBy = (__runInitializers(this, _appetiteByCategory_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
                __runInitializers(this, _approvedBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _overallAppetite_decorators = [(0, swagger_1.ApiProperty)({ description: 'Overall appetite statement' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _appetiteByCategory_decorators = [(0, swagger_1.ApiProperty)({ description: 'Appetite by category' }), (0, class_validator_1.IsNotEmpty)()];
            _approvedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approved by user ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _overallAppetite_decorators, { kind: "field", name: "overallAppetite", static: false, private: false, access: { has: obj => "overallAppetite" in obj, get: obj => obj.overallAppetite, set: (obj, value) => { obj.overallAppetite = value; } }, metadata: _metadata }, _overallAppetite_initializers, _overallAppetite_extraInitializers);
            __esDecorate(null, null, _appetiteByCategory_decorators, { kind: "field", name: "appetiteByCategory", static: false, private: false, access: { has: obj => "appetiteByCategory" in obj, get: obj => obj.appetiteByCategory, set: (obj, value) => { obj.appetiteByCategory = value; } }, metadata: _metadata }, _appetiteByCategory_initializers, _appetiteByCategory_extraInitializers);
            __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateRiskAppetiteDto = UpdateRiskAppetiteDto;
// ============================================================================
// RISK ASSESSMENT FUNCTIONS
// ============================================================================
/**
 * Calculate inherent risk score.
 *
 * @param {number} likelihood - Likelihood score (1-5)
 * @param {number} impact - Impact score (1-5)
 * @returns {RiskScore} Risk score details
 *
 * @example
 * ```typescript
 * const inherentRisk = calculateInherentRiskScore(4, 5);
 * console.log(`Risk Level: ${inherentRisk.riskLevel}`);
 * console.log(`Risk Score: ${inherentRisk.score}`);
 * ```
 */
function calculateInherentRiskScore(likelihood, impact) {
    try {
        const score = likelihood * impact;
        let riskLevel;
        if (score >= 20) {
            riskLevel = RiskLevel.CRITICAL;
        }
        else if (score >= 15) {
            riskLevel = RiskLevel.HIGH;
        }
        else if (score >= 8) {
            riskLevel = RiskLevel.MEDIUM;
        }
        else if (score >= 4) {
            riskLevel = RiskLevel.LOW;
        }
        else {
            riskLevel = RiskLevel.NEGLIGIBLE;
        }
        return {
            likelihood,
            impact,
            score,
            riskLevel,
            methodology: 'likelihood-impact-matrix',
            assessmentDate: new Date(),
        };
    }
    catch (error) {
        throw new Error(`Failed to calculate inherent risk score: ${error.message}`);
    }
}
/**
 * Calculate residual risk score after controls.
 *
 * @param {RiskScore} inherentRisk - Inherent risk score
 * @param {RiskControl[]} controls - Risk controls
 * @returns {RiskScore} Residual risk score
 *
 * @example
 * ```typescript
 * const residualRisk = calculateResidualRiskScore(inherentRisk, controls);
 * console.log(`Residual Risk Level: ${residualRisk.riskLevel}`);
 * console.log(`Risk Reduction: ${((1 - residualRisk.score / inherentRisk.score) * 100).toFixed(2)}%`);
 * ```
 */
function calculateResidualRiskScore(inherentRisk, controls) {
    try {
        if (!inherentRisk.score) {
            throw new Error('Inherent risk score is required');
        }
        // Calculate overall control effectiveness
        let totalEffectiveness = 0;
        let effectiveControlCount = 0;
        controls.forEach((control) => {
            if (control.implementationStatus === 'implemented' && control.riskReduction > 0) {
                totalEffectiveness += control.riskReduction;
                effectiveControlCount++;
            }
        });
        // Average effectiveness, capped at 95% (never 100% reduction)
        const avgEffectiveness = effectiveControlCount > 0
            ? Math.min(totalEffectiveness / effectiveControlCount, 95)
            : 0;
        // Calculate residual risk
        const residualScore = inherentRisk.score * (1 - avgEffectiveness / 100);
        let riskLevel;
        if (residualScore >= 20) {
            riskLevel = RiskLevel.CRITICAL;
        }
        else if (residualScore >= 15) {
            riskLevel = RiskLevel.HIGH;
        }
        else if (residualScore >= 8) {
            riskLevel = RiskLevel.MEDIUM;
        }
        else if (residualScore >= 4) {
            riskLevel = RiskLevel.LOW;
        }
        else {
            riskLevel = RiskLevel.NEGLIGIBLE;
        }
        return {
            likelihood: inherentRisk.likelihood,
            impact: inherentRisk.impact,
            score: Math.round(residualScore * 100) / 100,
            riskLevel,
            methodology: 'control-adjusted',
            assessmentDate: new Date(),
        };
    }
    catch (error) {
        throw new Error(`Failed to calculate residual risk score: ${error.message}`);
    }
}
/**
 * Generate risk matrix.
 *
 * @param {number} dimensions - Matrix dimensions (e.g., 5 for 5x5)
 * @param {string} name - Matrix name
 * @returns {RiskMatrix} Risk matrix
 *
 * @example
 * ```typescript
 * const matrix = generateRiskMatrix(5, 'Standard 5x5 Risk Matrix');
 * console.log(`Matrix has ${matrix.cells.length}x${matrix.cells[0].length} cells`);
 * ```
 */
function generateRiskMatrix(dimensions, name) {
    try {
        const likelihoodScale = {
            levels: dimensions,
            descriptors: ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain'],
            definitions: [
                'May occur only in exceptional circumstances',
                'Could occur at some time',
                'Might occur at some time',
                'Will probably occur in most circumstances',
                'Expected to occur in most circumstances',
            ],
            numericValues: [1, 2, 3, 4, 5],
        };
        const impactScale = {
            levels: dimensions,
            descriptors: ['Insignificant', 'Minor', 'Moderate', 'Major', 'Catastrophic'],
            definitions: [
                'Minimal impact on objectives',
                'Minor impact on objectives',
                'Moderate impact on objectives',
                'Major impact on objectives',
                'Severe impact on objectives',
            ],
            numericValues: [1, 2, 3, 4, 5],
        };
        const cells = [];
        for (let likelihood = 1; likelihood <= dimensions; likelihood++) {
            const row = [];
            for (let impact = 1; impact <= dimensions; impact++) {
                const score = likelihood * impact;
                let riskLevel;
                let color;
                if (score >= 20) {
                    riskLevel = RiskLevel.CRITICAL;
                    color = '#8B0000';
                }
                else if (score >= 15) {
                    riskLevel = RiskLevel.HIGH;
                    color = '#FF0000';
                }
                else if (score >= 8) {
                    riskLevel = RiskLevel.MEDIUM;
                    color = '#FFA500';
                }
                else if (score >= 4) {
                    riskLevel = RiskLevel.LOW;
                    color = '#FFFF00';
                }
                else {
                    riskLevel = RiskLevel.NEGLIGIBLE;
                    color = '#00FF00';
                }
                row.push({
                    likelihood,
                    impact,
                    score,
                    riskLevel,
                    color,
                });
            }
            cells.push(row);
        }
        return {
            matrixId: generateUUID(),
            name,
            dimensions,
            likelihoodScale,
            impactScale,
            cells,
            colorCoding: {
                critical: '#8B0000',
                high: '#FF0000',
                medium: '#FFA500',
                low: '#FFFF00',
                negligible: '#00FF00',
            },
        };
    }
    catch (error) {
        throw new Error(`Failed to generate risk matrix: ${error.message}`);
    }
}
/**
 * Generate risk heat map.
 *
 * @param {Risk[]} risks - Array of risks
 * @param {string} name - Heat map name
 * @returns {RiskHeatMap} Risk heat map
 *
 * @example
 * ```typescript
 * const heatMap = generateRiskHeatMap(risks, 'Q4 2024 Risk Heat Map');
 * console.log(`Total risks plotted: ${heatMap.risks.length}`);
 * console.log(`Critical risks: ${heatMap.concentrationAnalysis.risksByLevel.critical}`);
 * ```
 */
function generateRiskHeatMap(risks, name) {
    try {
        const plotPoints = risks.map((risk) => ({
            riskId: risk.riskId,
            riskName: risk.riskTitle,
            x: risk.inherentRiskScore.likelihood,
            y: risk.inherentRiskScore.impact,
            size: risk.inherentRiskScore.score,
            category: risk.category,
            riskLevel: risk.inherentRiskScore.riskLevel,
        }));
        const quadrants = [
            {
                name: 'High Impact, Low Likelihood',
                xMin: 0,
                xMax: 2.5,
                yMin: 3.5,
                yMax: 5,
                riskLevel: RiskLevel.MEDIUM,
                recommendedAction: 'Monitor and prepare contingency plans',
            },
            {
                name: 'High Impact, High Likelihood',
                xMin: 3.5,
                xMax: 5,
                yMin: 3.5,
                yMax: 5,
                riskLevel: RiskLevel.CRITICAL,
                recommendedAction: 'Immediate mitigation required',
            },
            {
                name: 'Low Impact, Low Likelihood',
                xMin: 0,
                xMax: 2.5,
                yMin: 0,
                yMax: 2.5,
                riskLevel: RiskLevel.LOW,
                recommendedAction: 'Accept and monitor periodically',
            },
            {
                name: 'Low Impact, High Likelihood',
                xMin: 3.5,
                xMax: 5,
                yMin: 0,
                yMax: 2.5,
                riskLevel: RiskLevel.MEDIUM,
                recommendedAction: 'Implement cost-effective controls',
            },
        ];
        // Concentration analysis
        const risksByCategory = {};
        const risksByLevel = {};
        Object.values(RiskCategory).forEach((cat) => {
            risksByCategory[cat] = 0;
        });
        Object.values(RiskLevel).forEach((level) => {
            risksByLevel[level] = 0;
        });
        risks.forEach((risk) => {
            risksByCategory[risk.category]++;
            risksByLevel[risk.inherentRiskScore.riskLevel]++;
        });
        const topRisks = [...risks]
            .sort((a, b) => b.inherentRiskScore.score - a.inherentRiskScore.score)
            .slice(0, 10);
        const totalRisks = risks.length;
        const criticalHighRisks = risksByLevel[RiskLevel.CRITICAL] + risksByLevel[RiskLevel.HIGH];
        const concentrationScore = totalRisks > 0 ? (criticalHighRisks / totalRisks) * 100 : 0;
        const concentrationAnalysis = {
            topRisks,
            risksByCategory,
            risksByLevel,
            concentrationScore,
            diversificationRecommendations: [
                'Consider risk diversification across categories',
                'Review concentration in high-impact areas',
                'Implement portfolio-level risk management',
            ],
        };
        return {
            heatMapId: generateUUID(),
            name,
            risks: plotPoints,
            quadrants,
            concentrationAnalysis,
        };
    }
    catch (error) {
        throw new Error(`Failed to generate risk heat map: ${error.message}`);
    }
}
// ============================================================================
// COSO FRAMEWORK FUNCTIONS
// ============================================================================
/**
 * Assess COSO ERM framework compliance.
 *
 * @param {string} organizationId - Organization identifier
 * @param {COSOComponentAssessment[]} componentAssessments - Component assessments
 * @param {COSOPrincipleAssessment[]} principleAssessments - Principle assessments
 * @returns {COSOAssessment} COSO assessment results
 *
 * @example
 * ```typescript
 * const cosoAssessment = assessCOSOCompliance(
 *   'ORG_001',
 *   componentAssessments,
 *   principleAssessments
 * );
 * console.log(`Overall Maturity: ${cosoAssessment.overallMaturity}%`);
 * ```
 */
function assessCOSOCompliance(organizationId, componentAssessments, principleAssessments) {
    try {
        // Calculate overall maturity
        const totalComponentScore = componentAssessments.reduce((sum, comp) => sum + comp.score, 0);
        const overallMaturity = totalComponentScore / componentAssessments.length;
        // Identify gaps
        const gaps = [];
        componentAssessments.forEach((comp) => {
            comp.weaknesses.forEach((weakness) => {
                gaps.push(`${comp.component}: ${weakness}`);
            });
        });
        principleAssessments.forEach((prin) => {
            prin.deficiencies.forEach((deficiency) => {
                gaps.push(`${prin.principle}: ${deficiency}`);
            });
        });
        // Generate recommendations
        const recommendations = [];
        if (overallMaturity < 50) {
            recommendations.push('Establish foundational risk management processes');
            recommendations.push('Develop risk governance structure');
            recommendations.push('Implement basic risk assessment methodology');
        }
        else if (overallMaturity < 75) {
            recommendations.push('Enhance risk monitoring capabilities');
            recommendations.push('Integrate risk management with strategic planning');
            recommendations.push('Improve risk communication and reporting');
        }
        else {
            recommendations.push('Optimize risk management processes');
            recommendations.push('Leverage technology for risk automation');
            recommendations.push('Benchmark against industry best practices');
        }
        return {
            assessmentId: generateUUID(),
            organizationId,
            assessmentDate: new Date(),
            components: componentAssessments,
            principles: principleAssessments,
            overallMaturity,
            gaps,
            recommendations,
            status: 'draft',
        };
    }
    catch (error) {
        throw new Error(`Failed to assess COSO compliance: ${error.message}`);
    }
}
/**
 * Assess COSO component maturity.
 *
 * @param {COSOComponent} component - COSO component
 * @param {string[]} strengths - Identified strengths
 * @param {string[]} weaknesses - Identified weaknesses
 * @param {string[]} evidence - Supporting evidence
 * @returns {COSOComponentAssessment} Component assessment
 *
 * @example
 * ```typescript
 * const componentAssessment = assessCOSOComponent(
 *   COSOComponent.GOVERNANCE_CULTURE,
 *   ['Strong board oversight', 'Clear risk appetite'],
 *   ['Limited risk training', 'Inconsistent tone from top'],
 *   ['Board minutes', 'Risk appetite statement']
 * );
 * ```
 */
function assessCOSOComponent(component, strengths, weaknesses, evidence) {
    try {
        // Calculate maturity based on strengths vs weaknesses
        const totalFactors = strengths.length + weaknesses.length;
        const maturityLevel = totalFactors > 0
            ? Math.round((strengths.length / totalFactors) * 5)
            : 1;
        const score = (maturityLevel / 5) * 100;
        return {
            component,
            maturityLevel,
            strengths,
            weaknesses,
            evidence,
            score,
        };
    }
    catch (error) {
        throw new Error(`Failed to assess COSO component: ${error.message}`);
    }
}
// ============================================================================
// ISO 31000 FUNCTIONS
// ============================================================================
/**
 * Assess ISO 31000 compliance.
 *
 * @param {string} organizationId - Organization identifier
 * @param {ISO31000ProcessAssessment[]} processAssessments - Process assessments
 * @param {FrameworkAssessment} frameworkAssessment - Framework assessment
 * @returns {ISO31000Assessment} ISO 31000 assessment results
 *
 * @example
 * ```typescript
 * const iso31000Assessment = assessISO31000Compliance(
 *   'ORG_001',
 *   processAssessments,
 *   frameworkAssessment
 * );
 * console.log(`Overall Compliance: ${iso31000Assessment.overallCompliance}%`);
 * ```
 */
function assessISO31000Compliance(organizationId, processAssessments, frameworkAssessment) {
    try {
        // Calculate overall compliance
        const processScore = processAssessments.reduce((sum, proc) => sum + proc.effectiveness, 0) /
            processAssessments.length;
        const frameworkScore = (frameworkAssessment.leadership +
            frameworkAssessment.integration +
            frameworkAssessment.design +
            frameworkAssessment.implementation +
            frameworkAssessment.evaluation +
            frameworkAssessment.improvement) / 6;
        const overallCompliance = (processScore + frameworkScore) / 2;
        // Identify gaps
        const gaps = [];
        processAssessments.forEach((proc) => {
            if (!proc.implemented) {
                gaps.push(`${proc.process} process not implemented`);
            }
            else if (proc.effectiveness < 60) {
                gaps.push(`${proc.process} process effectiveness below threshold`);
            }
        });
        // Generate recommendations
        const recommendations = [];
        if (frameworkAssessment.leadership < 70) {
            recommendations.push('Strengthen leadership commitment to risk management');
        }
        if (frameworkAssessment.integration < 70) {
            recommendations.push('Better integrate risk management with business processes');
        }
        if (overallCompliance < 70) {
            recommendations.push('Develop comprehensive risk management improvement plan');
        }
        return {
            assessmentId: generateUUID(),
            organizationId,
            assessmentDate: new Date(),
            processes: processAssessments,
            framework: frameworkAssessment,
            overallCompliance,
            gaps,
            recommendations,
        };
    }
    catch (error) {
        throw new Error(`Failed to assess ISO 31000 compliance: ${error.message}`);
    }
}
// ============================================================================
// MONTE CARLO SIMULATION FUNCTIONS
// ============================================================================
/**
 * Perform Monte Carlo risk simulation.
 *
 * @param {string} riskScenario - Risk scenario description
 * @param {SimulationVariable[]} variables - Simulation variables
 * @param {number} iterations - Number of iterations
 * @returns {Promise<MonteCarloRiskSimulation>} Simulation results
 *
 * @example
 * ```typescript
 * const simulation = await performMonteCarloRiskSimulation(
 *   'Revenue Loss Scenario',
 *   [
 *     { variableName: 'demandReduction', distribution: 'normal', parameters: { mean: 0.15, stdDev: 0.05 } },
 *     { variableName: 'priceImpact', distribution: 'triangular', parameters: { min: -0.20, mode: -0.10, max: 0 } }
 *   ],
 *   10000
 * );
 * console.log(`Expected Loss: $${simulation.results.mean.toLocaleString()}`);
 * console.log(`95% VaR: $${simulation.results.p95.toLocaleString()}`);
 * ```
 */
async function performMonteCarloRiskSimulation(riskScenario, variables, iterations) {
    try {
        const results = [];
        for (let i = 0; i < iterations; i++) {
            let simulationValue = 0;
            variables.forEach((variable) => {
                const randomValue = generateRandomFromDistribution(variable.distribution, variable.parameters);
                simulationValue += randomValue;
            });
            results.push(simulationValue);
        }
        // Calculate statistics
        results.sort((a, b) => a - b);
        const mean = results.reduce((sum, val) => sum + val, 0) / results.length;
        const variance = results.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / results.length;
        const stdDev = Math.sqrt(variance);
        const simulationResults = {
            mean,
            median: results[Math.floor(iterations * 0.50)],
            stdDev,
            variance,
            min: results[0],
            max: results[results.length - 1],
            p5: results[Math.floor(iterations * 0.05)],
            p10: results[Math.floor(iterations * 0.10)],
            p25: results[Math.floor(iterations * 0.25)],
            p75: results[Math.floor(iterations * 0.75)],
            p90: results[Math.floor(iterations * 0.90)],
            p95: results[Math.floor(iterations * 0.95)],
            p99: results[Math.floor(iterations * 0.99)],
            confidenceIntervals: [
                { confidence: 0.90, lowerBound: results[Math.floor(iterations * 0.05)], upperBound: results[Math.floor(iterations * 0.95)] },
                { confidence: 0.95, lowerBound: results[Math.floor(iterations * 0.025)], upperBound: results[Math.floor(iterations * 0.975)] },
                { confidence: 0.99, lowerBound: results[Math.floor(iterations * 0.005)], upperBound: results[Math.floor(iterations * 0.995)] },
            ],
            histogram: generateHistogram(results, 20),
        };
        // Sensitivity analysis
        const sensitivityAnalysis = {};
        variables.forEach((variable) => {
            sensitivityAnalysis[variable.variableName] = Math.random() * 0.5; // Simplified
        });
        return {
            simulationId: generateUUID(),
            riskScenario,
            iterations,
            variables,
            results: simulationResults,
            sensitivityAnalysis,
        };
    }
    catch (error) {
        throw new Error(`Failed to perform Monte Carlo simulation: ${error.message}`);
    }
}
// ============================================================================
// BOW-TIE ANALYSIS FUNCTIONS
// ============================================================================
/**
 * Perform bow-tie risk analysis.
 *
 * @param {string} hazard - Hazard description
 * @param {string} topEvent - Top event (unwanted outcome)
 * @param {Threat[]} threats - Threats leading to top event
 * @param {Consequence[]} consequences - Consequences of top event
 * @param {RiskControl[]} controls - Risk controls
 * @returns {BowTieAnalysis} Bow-tie analysis
 *
 * @example
 * ```typescript
 * const bowTie = performBowTieAnalysis(
 *   'Cybersecurity Breach',
 *   'Data Breach',
 *   threats,
 *   consequences,
 *   controls
 * );
 * console.log(`Total threats: ${bowTie.threats.length}`);
 * console.log(`Total consequences: ${bowTie.consequences.length}`);
 * ```
 */
function performBowTieAnalysis(hazard, topEvent, threats, consequences, controls) {
    try {
        // Separate preventive and mitigating controls
        const preventiveControls = controls.filter((c) => c.controlType === ControlType.PREVENTIVE);
        const mitigatingControls = controls.filter((c) => c.controlType === ControlType.DETECTIVE || c.controlType === ControlType.CORRECTIVE);
        // Identify escalation factors
        const escalationFactors = [
            'Control failure',
            'Human error',
            'System malfunction',
            'Inadequate resources',
            'Poor communication',
        ];
        // Identify recovery measures
        const recoveryMeasures = [
            'Emergency response plan',
            'Business continuity activation',
            'Incident management',
            'Communication protocol',
            'Recovery operations',
        ];
        return {
            bowTieId: generateUUID(),
            hazard,
            topEvent,
            threats,
            preventiveControls,
            consequences,
            mitigatingControls,
            escalationFactors,
            recoveryMeasures,
        };
    }
    catch (error) {
        throw new Error(`Failed to perform bow-tie analysis: ${error.message}`);
    }
}
// ============================================================================
// FMEA FUNCTIONS
// ============================================================================
/**
 * Perform Failure Mode and Effects Analysis (FMEA).
 *
 * @param {string} process - Process name
 * @param {FailureMode[]} failureModes - Failure modes
 * @returns {FMEAAnalysis} FMEA analysis
 *
 * @example
 * ```typescript
 * const fmea = performFMEA('Order Processing', failureModes);
 * console.log(`Overall RPN: ${fmea.overallRPN}`);
 * console.log(`High priority actions: ${fmea.priorityActions.length}`);
 * ```
 */
function performFMEA(process, failureModes) {
    try {
        // Calculate RPN for each failure mode
        failureModes.forEach((fm) => {
            fm.rpn = fm.severity * fm.occurrence * fm.detection;
        });
        // Sort by RPN (highest first)
        failureModes.sort((a, b) => b.rpn - a.rpn);
        // Overall RPN (average)
        const overallRPN = failureModes.reduce((sum, fm) => sum + fm.rpn, 0) / failureModes.length;
        // Priority actions for high RPN items
        const priorityActions = failureModes
            .filter((fm) => fm.rpn >= 100)
            .flatMap((fm) => fm.recommendedActions);
        return {
            fmeaId: generateUUID(),
            process,
            failureModes,
            priorityActions,
            overallRPN,
        };
    }
    catch (error) {
        throw new Error(`Failed to perform FMEA: ${error.message}`);
    }
}
/**
 * Calculate FMEA Risk Priority Number (RPN).
 *
 * @param {number} severity - Severity rating (1-10)
 * @param {number} occurrence - Occurrence rating (1-10)
 * @param {number} detection - Detection rating (1-10)
 * @returns {number} RPN value
 *
 * @example
 * ```typescript
 * const rpn = calculateRPN(8, 6, 4);
 * console.log(`RPN: ${rpn}`); // 192
 * ```
 */
function calculateRPN(severity, occurrence, detection) {
    try {
        return severity * occurrence * detection;
    }
    catch (error) {
        throw new Error(`Failed to calculate RPN: ${error.message}`);
    }
}
// ============================================================================
// ROOT CAUSE ANALYSIS FUNCTIONS
// ============================================================================
/**
 * Perform root cause analysis.
 *
 * @param {string} incident - Incident description
 * @param {string} methodology - RCA methodology
 * @param {RootCause[]} rootCauses - Identified root causes
 * @param {string[]} contributingFactors - Contributing factors
 * @returns {RootCauseAnalysis} Root cause analysis
 *
 * @example
 * ```typescript
 * const rca = performRootCauseAnalysis(
 *   'System Outage - March 2024',
 *   '5-whys',
 *   rootCauses,
 *   contributingFactors
 * );
 * ```
 */
function performRootCauseAnalysis(incident, methodology, rootCauses, contributingFactors) {
    try {
        // Generate corrective actions
        const correctiveActions = rootCauses.map((cause, index) => ({
            actionId: `CA-${index + 1}`,
            description: `Address root cause: ${cause.description}`,
            owner: 'TBD',
            targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
            status: 'planned',
            effectiveness: 0,
        }));
        // Generate preventive actions
        const preventiveActions = [
            {
                actionId: 'PA-1',
                description: 'Implement monitoring and early warning systems',
                scope: 'Organization-wide',
                implementation: 'Deploy automated monitoring tools',
                monitoring: 'Monthly effectiveness review',
            },
            {
                actionId: 'PA-2',
                description: 'Enhance training and awareness programs',
                scope: 'Affected departments',
                implementation: 'Conduct quarterly training sessions',
                monitoring: 'Training completion tracking',
            },
        ];
        return {
            rcaId: generateUUID(),
            incident,
            methodology,
            rootCauses,
            contributingFactors,
            correctiveActions,
            preventiveActions,
        };
    }
    catch (error) {
        throw new Error(`Failed to perform root cause analysis: ${error.message}`);
    }
}
// ============================================================================
// THREE LINES OF DEFENSE FUNCTIONS
// ============================================================================
/**
 * Assess three lines of defense model effectiveness.
 *
 * @param {string} organizationId - Organization identifier
 * @param {DefenseLineDescription} firstLine - First line of defense
 * @param {DefenseLineDescription} secondLine - Second line of defense
 * @param {DefenseLineDescription} thirdLine - Third line of defense
 * @param {GovernanceStructure} governance - Governance structure
 * @returns {ThreeLinesModel} Three lines assessment
 *
 * @example
 * ```typescript
 * const threeLinesAssessment = assessThreeLinesOfDefense(
 *   'ORG_001',
 *   firstLine,
 *   secondLine,
 *   thirdLine,
 *   governance
 * );
 * console.log(`Overall Effectiveness: ${threeLinesAssessment.effectivenessRating}%`);
 * ```
 */
function assessThreeLinesOfDefense(organizationId, firstLine, secondLine, thirdLine, governance) {
    try {
        // Calculate overall effectiveness
        const effectivenessRating = (firstLine.effectiveness +
            secondLine.effectiveness +
            thirdLine.effectiveness) / 3;
        return {
            organizationId,
            firstLine,
            secondLine,
            thirdLine,
            governanceStructure: governance,
            effectivenessRating,
        };
    }
    catch (error) {
        throw new Error(`Failed to assess three lines of defense: ${error.message}`);
    }
}
// ============================================================================
// RISK APPETITE AND TOLERANCE FUNCTIONS
// ============================================================================
/**
 * Define organizational risk appetite.
 *
 * @param {string} organizationId - Organization identifier
 * @param {RiskFramework} framework - Risk framework
 * @param {string} overallAppetite - Overall appetite statement
 * @param {Record<RiskCategory, AppetiteStatement>} appetiteByCategory - Category-specific appetite
 * @param {string} approvedBy - Approver identifier
 * @returns {RiskAppetite} Risk appetite
 *
 * @example
 * ```typescript
 * const riskAppetite = defineRiskAppetite(
 *   'ORG_001',
 *   RiskFramework.COSO_ERM,
 *   'Moderate risk appetite for growth',
 *   appetiteStatements,
 *   'CEO_001'
 * );
 * ```
 */
function defineRiskAppetite(organizationId, framework, overallAppetite, appetiteByCategory, approvedBy) {
    try {
        // Generate tolerance limits from appetite statements
        const toleranceLimits = [];
        Object.entries(appetiteByCategory).forEach(([category, statement]) => {
            statement.quantitativeMetrics.forEach((metric, index) => {
                toleranceLimits.push({
                    limitId: `LIMIT-${category}-${index}`,
                    riskType: category,
                    metric: metric.metricName,
                    appetiteThreshold: metric.appetiteLimit,
                    toleranceThreshold: metric.toleranceLimit,
                    currentValue: metric.currentValue,
                    status: metric.currentValue <= metric.appetiteLimit
                        ? 'within-appetite'
                        : metric.currentValue <= metric.toleranceLimit
                            ? 'within-tolerance'
                            : 'exceeded',
                });
            });
        });
        return {
            organizationId,
            framework,
            overallAppetite,
            appetiteByCategory,
            toleranceLimits,
            approvedBy,
            approvedDate: new Date(),
            reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        };
    }
    catch (error) {
        throw new Error(`Failed to define risk appetite: ${error.message}`);
    }
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Generate random value from specified distribution.
 */
function generateRandomFromDistribution(distribution, parameters) {
    switch (distribution) {
        case 'normal': {
            const { mean, stdDev } = parameters;
            return generateNormalRandom(mean, stdDev);
        }
        case 'uniform': {
            const { min, max } = parameters;
            return min + Math.random() * (max - min);
        }
        case 'triangular': {
            const { min, mode, max } = parameters;
            return generateTriangularRandom(min, mode, max);
        }
        default:
            return Math.random();
    }
}
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
 * Generate triangular random variable.
 */
function generateTriangularRandom(min, mode, max) {
    const u = Math.random();
    const f = (mode - min) / (max - min);
    if (u < f) {
        return min + Math.sqrt(u * (max - min) * (mode - min));
    }
    else {
        return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
    }
}
/**
 * Generate histogram from data.
 */
function generateHistogram(data, bins) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / bins;
    const histogram = [];
    for (let i = 0; i < bins; i++) {
        const binStart = min + i * binWidth;
        const binEnd = binStart + binWidth;
        const frequency = data.filter((val) => val >= binStart && val < binEnd).length;
        histogram.push({
            binStart,
            binEnd,
            frequency,
            probability: frequency / data.length,
        });
    }
    return histogram;
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
    createRiskRegisterModel: exports.createRiskRegisterModel,
    createRiskAssessmentModel: exports.createRiskAssessmentModel,
    createRiskControlModel: exports.createRiskControlModel,
    createCOSOAssessmentModel: exports.createCOSOAssessmentModel,
    // Risk Assessment
    calculateInherentRiskScore,
    calculateResidualRiskScore,
    generateRiskMatrix,
    generateRiskHeatMap,
    // COSO Framework
    assessCOSOCompliance,
    assessCOSOComponent,
    // ISO 31000
    assessISO31000Compliance,
    // Monte Carlo Simulation
    performMonteCarloRiskSimulation,
    // Bow-Tie Analysis
    performBowTieAnalysis,
    // FMEA
    performFMEA,
    calculateRPN,
    // Root Cause Analysis
    performRootCauseAnalysis,
    // Three Lines of Defense
    assessThreeLinesOfDefense,
    // Risk Appetite
    defineRiskAppetite,
};
//# sourceMappingURL=risk-management-kit.js.map