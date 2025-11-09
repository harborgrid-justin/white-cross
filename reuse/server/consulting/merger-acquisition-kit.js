"use strict";
/**
 * LOC: CONS-MA-001
 * File: /reuse/server/consulting/merger-acquisition-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable)
 *   - @nestjs/swagger (ApiProperty, ApiResponse)
 *   - class-validator (decorators)
 *   - class-transformer (Type, Transform)
 *
 * DOWNSTREAM (imported by):
 *   - backend/consulting/ma-advisory.service.ts
 *   - backend/consulting/deal-management.controller.ts
 *   - backend/consulting/integration.service.ts
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
exports.ValuationModelEntity = exports.DueDiligenceChecklist = exports.Deal = exports.ValueDriverDto = exports.StakeholderDto = exports.DealStructureOptionDto = exports.CulturalDimensionScoreDto = exports.IntegrationActivityDto = exports.CreateIntegrationPlanDto = exports.SynergyItemDto = exports.ComparableCompanyDto = exports.CreateDCFValuationDto = exports.DiligenceItemDto = exports.CreateDealDto = exports.DealStructure = exports.CulturalDimension = exports.RiskSeverity = exports.IntegrationWorkstream = exports.SynergyType = exports.DiligenceArea = exports.ValuationMethod = exports.DealStatus = exports.DealType = void 0;
exports.initDealModel = initDealModel;
exports.initDueDiligenceChecklistModel = initDueDiligenceChecklistModel;
exports.initValuationModelEntity = initValuationModelEntity;
exports.createDeal = createDeal;
exports.createDueDiligenceChecklist = createDueDiligenceChecklist;
exports.performDCFValuation = performDCFValuation;
exports.performComparableCompanyAnalysis = performComparableCompanyAnalysis;
exports.analyzePrecedentTransactions = analyzePrecedentTransactions;
exports.performSynergyAnalysis = performSynergyAnalysis;
exports.createIntegrationPlan = createIntegrationPlan;
exports.addIntegrationActivity = addIntegrationActivity;
exports.performCulturalAssessment = performCulturalAssessment;
exports.analyzeDealStructure = analyzeDealStructure;
exports.calculateDealPremium = calculateDealPremium;
exports.trackPostMergerIntegration = trackPostMergerIntegration;
exports.createDay1ReadinessChecklist = createDay1ReadinessChecklist;
exports.mapDealStakeholders = mapDealStakeholders;
exports.trackRegulatoryApproval = trackRegulatoryApproval;
exports.createValueCreationPlan = createValueCreationPlan;
exports.identifyIntegrationRisks = identifyIntegrationRisks;
exports.calculateAccretionDilution = calculateAccretionDilution;
exports.performBreakupValuation = performBreakupValuation;
exports.calculateCostOfCapital = calculateCostOfCapital;
exports.estimateCostToAchieve = estimateCostToAchieve;
exports.performSensitivityAnalysis = performSensitivityAnalysis;
exports.generateManagementPresentation = generateManagementPresentation;
exports.calculateEarnoutValuation = calculateEarnoutValuation;
exports.assessQualityOfEarnings = assessQualityOfEarnings;
exports.generateIntegrationCommunicationPlan = generateIntegrationCommunicationPlan;
exports.calculateWorkingCapitalAdjustment = calculateWorkingCapitalAdjustment;
exports.performAntiTrustAnalysis = performAntiTrustAnalysis;
exports.calculateDealIRR = calculateDealIRR;
exports.generateIntegrationSuccessMetrics = generateIntegrationSuccessMetrics;
exports.estimateTransactionCosts = estimateTransactionCosts;
exports.performGoodwillImpairmentTest = performGoodwillImpairmentTest;
exports.generatePurchasePriceAllocation = generatePurchasePriceAllocation;
exports.calculateCustomerLifetimeValueImpact = calculateCustomerLifetimeValueImpact;
/**
 * File: /reuse/server/consulting/merger-acquisition-kit.ts
 * Locator: WC-CONS-MA-001
 * Purpose: Enterprise-grade Merger & Acquisition Kit - due diligence, valuation, synergy analysis, integration planning
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, class-validator 0.14.x, class-transformer 0.5.x
 * Downstream: M&A advisory services, deal management controllers, integration processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 production-ready functions for M&A transactions competing with top-tier investment banks and consulting firms
 *
 * LLM Context: Comprehensive M&A utilities for production-ready investment banking and consulting applications.
 * Provides due diligence checklists, valuation models (DCF, comparables, precedent transactions), synergy analysis,
 * integration planning, cultural assessment, deal structure optimization, post-merger integration tracking,
 * risk assessment, regulatory compliance, stakeholder management, and value creation roadmaps.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Deal types
 */
var DealType;
(function (DealType) {
    DealType["MERGER"] = "merger";
    DealType["ACQUISITION"] = "acquisition";
    DealType["DIVESTITURE"] = "divestiture";
    DealType["JOINT_VENTURE"] = "joint_venture";
    DealType["STRATEGIC_ALLIANCE"] = "strategic_alliance";
    DealType["ASSET_PURCHASE"] = "asset_purchase";
    DealType["STOCK_PURCHASE"] = "stock_purchase";
})(DealType || (exports.DealType = DealType = {}));
/**
 * Deal status
 */
var DealStatus;
(function (DealStatus) {
    DealStatus["IDEATION"] = "ideation";
    DealStatus["PRELIMINARY_REVIEW"] = "preliminary_review";
    DealStatus["DUE_DILIGENCE"] = "due_diligence";
    DealStatus["NEGOTIATION"] = "negotiation";
    DealStatus["AGREEMENT"] = "agreement";
    DealStatus["REGULATORY_APPROVAL"] = "regulatory_approval";
    DealStatus["CLOSING"] = "closing";
    DealStatus["INTEGRATION"] = "integration";
    DealStatus["COMPLETED"] = "completed";
    DealStatus["TERMINATED"] = "terminated";
})(DealStatus || (exports.DealStatus = DealStatus = {}));
/**
 * Valuation methodologies
 */
var ValuationMethod;
(function (ValuationMethod) {
    ValuationMethod["DCF"] = "dcf";
    ValuationMethod["COMPARABLE_COMPANIES"] = "comparable_companies";
    ValuationMethod["PRECEDENT_TRANSACTIONS"] = "precedent_transactions";
    ValuationMethod["ASSET_BASED"] = "asset_based";
    ValuationMethod["MARKET_CAPITALIZATION"] = "market_capitalization";
    ValuationMethod["EARNINGS_MULTIPLE"] = "earnings_multiple";
    ValuationMethod["REVENUE_MULTIPLE"] = "revenue_multiple";
    ValuationMethod["BOOK_VALUE"] = "book_value";
})(ValuationMethod || (exports.ValuationMethod = ValuationMethod = {}));
/**
 * Due diligence areas
 */
var DiligenceArea;
(function (DiligenceArea) {
    DiligenceArea["FINANCIAL"] = "financial";
    DiligenceArea["LEGAL"] = "legal";
    DiligenceArea["OPERATIONAL"] = "operational";
    DiligenceArea["COMMERCIAL"] = "commercial";
    DiligenceArea["TECHNOLOGY"] = "technology";
    DiligenceArea["HR"] = "hr";
    DiligenceArea["ENVIRONMENTAL"] = "environmental";
    DiligenceArea["TAX"] = "tax";
    DiligenceArea["REGULATORY"] = "regulatory";
    DiligenceArea["CULTURAL"] = "cultural";
})(DiligenceArea || (exports.DiligenceArea = DiligenceArea = {}));
/**
 * Synergy types
 */
var SynergyType;
(function (SynergyType) {
    SynergyType["REVENUE"] = "revenue";
    SynergyType["COST"] = "cost";
    SynergyType["FINANCIAL"] = "financial";
    SynergyType["OPERATIONAL"] = "operational";
    SynergyType["TECHNOLOGY"] = "technology";
    SynergyType["TALENT"] = "talent";
    SynergyType["MARKET"] = "market";
})(SynergyType || (exports.SynergyType = SynergyType = {}));
/**
 * Integration workstream types
 */
var IntegrationWorkstream;
(function (IntegrationWorkstream) {
    IntegrationWorkstream["LEADERSHIP"] = "leadership";
    IntegrationWorkstream["ORGANIZATION"] = "organization";
    IntegrationWorkstream["OPERATIONS"] = "operations";
    IntegrationWorkstream["SYSTEMS"] = "systems";
    IntegrationWorkstream["CULTURE"] = "culture";
    IntegrationWorkstream["CUSTOMER"] = "customer";
    IntegrationWorkstream["COMPLIANCE"] = "compliance";
    IntegrationWorkstream["COMMUNICATIONS"] = "communications";
})(IntegrationWorkstream || (exports.IntegrationWorkstream = IntegrationWorkstream = {}));
/**
 * Risk severity levels
 */
var RiskSeverity;
(function (RiskSeverity) {
    RiskSeverity["CRITICAL"] = "critical";
    RiskSeverity["HIGH"] = "high";
    RiskSeverity["MEDIUM"] = "medium";
    RiskSeverity["LOW"] = "low";
    RiskSeverity["NEGLIGIBLE"] = "negligible";
})(RiskSeverity || (exports.RiskSeverity = RiskSeverity = {}));
/**
 * Cultural fit dimensions
 */
var CulturalDimension;
(function (CulturalDimension) {
    CulturalDimension["LEADERSHIP_STYLE"] = "leadership_style";
    CulturalDimension["DECISION_MAKING"] = "decision_making";
    CulturalDimension["COMMUNICATION"] = "communication";
    CulturalDimension["RISK_TOLERANCE"] = "risk_tolerance";
    CulturalDimension["INNOVATION"] = "innovation";
    CulturalDimension["CUSTOMER_FOCUS"] = "customer_focus";
    CulturalDimension["EMPLOYEE_ENGAGEMENT"] = "employee_engagement";
    CulturalDimension["PERFORMANCE_MANAGEMENT"] = "performance_management";
})(CulturalDimension || (exports.CulturalDimension = CulturalDimension = {}));
/**
 * Deal structure components
 */
var DealStructure;
(function (DealStructure) {
    DealStructure["CASH"] = "cash";
    DealStructure["STOCK"] = "stock";
    DealStructure["DEBT"] = "debt";
    DealStructure["EARNOUT"] = "earnout";
    DealStructure["CONTINGENT_PAYMENT"] = "contingent_payment";
    DealStructure["MIXED"] = "mixed";
})(DealStructure || (exports.DealStructure = DealStructure = {}));
// ============================================================================
// DTO DEFINITIONS
// ============================================================================
/**
 * Create Deal DTO
 */
let CreateDealDto = (() => {
    var _a;
    let _dealName_decorators;
    let _dealName_initializers = [];
    let _dealName_extraInitializers = [];
    let _dealType_decorators;
    let _dealType_initializers = [];
    let _dealType_extraInitializers = [];
    let _acquirerCompanyId_decorators;
    let _acquirerCompanyId_initializers = [];
    let _acquirerCompanyId_extraInitializers = [];
    let _targetCompanyId_decorators;
    let _targetCompanyId_initializers = [];
    let _targetCompanyId_extraInitializers = [];
    let _dealValue_decorators;
    let _dealValue_initializers = [];
    let _dealValue_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _dealStructure_decorators;
    let _dealStructure_initializers = [];
    let _dealStructure_extraInitializers = [];
    let _strategicRationale_decorators;
    let _strategicRationale_initializers = [];
    let _strategicRationale_extraInitializers = [];
    let _dealLeadId_decorators;
    let _dealLeadId_initializers = [];
    let _dealLeadId_extraInitializers = [];
    let _expectedClosingDate_decorators;
    let _expectedClosingDate_initializers = [];
    let _expectedClosingDate_extraInitializers = [];
    return _a = class CreateDealDto {
            constructor() {
                this.dealName = __runInitializers(this, _dealName_initializers, void 0);
                this.dealType = (__runInitializers(this, _dealName_extraInitializers), __runInitializers(this, _dealType_initializers, void 0));
                this.acquirerCompanyId = (__runInitializers(this, _dealType_extraInitializers), __runInitializers(this, _acquirerCompanyId_initializers, void 0));
                this.targetCompanyId = (__runInitializers(this, _acquirerCompanyId_extraInitializers), __runInitializers(this, _targetCompanyId_initializers, void 0));
                this.dealValue = (__runInitializers(this, _targetCompanyId_extraInitializers), __runInitializers(this, _dealValue_initializers, void 0));
                this.currency = (__runInitializers(this, _dealValue_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                this.dealStructure = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _dealStructure_initializers, void 0));
                this.strategicRationale = (__runInitializers(this, _dealStructure_extraInitializers), __runInitializers(this, _strategicRationale_initializers, void 0));
                this.dealLeadId = (__runInitializers(this, _strategicRationale_extraInitializers), __runInitializers(this, _dealLeadId_initializers, void 0));
                this.expectedClosingDate = (__runInitializers(this, _dealLeadId_extraInitializers), __runInitializers(this, _expectedClosingDate_initializers, void 0));
                __runInitializers(this, _expectedClosingDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _dealName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Deal name', example: 'Project Apollo - Acquisition of HealthTech Inc' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _dealType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Deal type', enum: DealType }), (0, class_validator_1.IsEnum)(DealType)];
            _acquirerCompanyId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Acquirer company ID', example: 'uuid-acquirer' }), (0, class_validator_1.IsUUID)()];
            _targetCompanyId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target company ID', example: 'uuid-target' }), (0, class_validator_1.IsUUID)()];
            _dealValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Deal value', example: 150000000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _currency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Currency code', example: 'USD' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(3)];
            _dealStructure_decorators = [(0, swagger_1.ApiProperty)({ description: 'Deal structure', enum: DealStructure }), (0, class_validator_1.IsEnum)(DealStructure)];
            _strategicRationale_decorators = [(0, swagger_1.ApiProperty)({ description: 'Strategic rationale', example: 'Expand into new geographic markets and acquire key technology' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(2000)];
            _dealLeadId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Deal lead ID', example: 'uuid-lead' }), (0, class_validator_1.IsUUID)()];
            _expectedClosingDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expected closing date', example: '2025-06-30' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            __esDecorate(null, null, _dealName_decorators, { kind: "field", name: "dealName", static: false, private: false, access: { has: obj => "dealName" in obj, get: obj => obj.dealName, set: (obj, value) => { obj.dealName = value; } }, metadata: _metadata }, _dealName_initializers, _dealName_extraInitializers);
            __esDecorate(null, null, _dealType_decorators, { kind: "field", name: "dealType", static: false, private: false, access: { has: obj => "dealType" in obj, get: obj => obj.dealType, set: (obj, value) => { obj.dealType = value; } }, metadata: _metadata }, _dealType_initializers, _dealType_extraInitializers);
            __esDecorate(null, null, _acquirerCompanyId_decorators, { kind: "field", name: "acquirerCompanyId", static: false, private: false, access: { has: obj => "acquirerCompanyId" in obj, get: obj => obj.acquirerCompanyId, set: (obj, value) => { obj.acquirerCompanyId = value; } }, metadata: _metadata }, _acquirerCompanyId_initializers, _acquirerCompanyId_extraInitializers);
            __esDecorate(null, null, _targetCompanyId_decorators, { kind: "field", name: "targetCompanyId", static: false, private: false, access: { has: obj => "targetCompanyId" in obj, get: obj => obj.targetCompanyId, set: (obj, value) => { obj.targetCompanyId = value; } }, metadata: _metadata }, _targetCompanyId_initializers, _targetCompanyId_extraInitializers);
            __esDecorate(null, null, _dealValue_decorators, { kind: "field", name: "dealValue", static: false, private: false, access: { has: obj => "dealValue" in obj, get: obj => obj.dealValue, set: (obj, value) => { obj.dealValue = value; } }, metadata: _metadata }, _dealValue_initializers, _dealValue_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _dealStructure_decorators, { kind: "field", name: "dealStructure", static: false, private: false, access: { has: obj => "dealStructure" in obj, get: obj => obj.dealStructure, set: (obj, value) => { obj.dealStructure = value; } }, metadata: _metadata }, _dealStructure_initializers, _dealStructure_extraInitializers);
            __esDecorate(null, null, _strategicRationale_decorators, { kind: "field", name: "strategicRationale", static: false, private: false, access: { has: obj => "strategicRationale" in obj, get: obj => obj.strategicRationale, set: (obj, value) => { obj.strategicRationale = value; } }, metadata: _metadata }, _strategicRationale_initializers, _strategicRationale_extraInitializers);
            __esDecorate(null, null, _dealLeadId_decorators, { kind: "field", name: "dealLeadId", static: false, private: false, access: { has: obj => "dealLeadId" in obj, get: obj => obj.dealLeadId, set: (obj, value) => { obj.dealLeadId = value; } }, metadata: _metadata }, _dealLeadId_initializers, _dealLeadId_extraInitializers);
            __esDecorate(null, null, _expectedClosingDate_decorators, { kind: "field", name: "expectedClosingDate", static: false, private: false, access: { has: obj => "expectedClosingDate" in obj, get: obj => obj.expectedClosingDate, set: (obj, value) => { obj.expectedClosingDate = value; } }, metadata: _metadata }, _expectedClosingDate_initializers, _expectedClosingDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateDealDto = CreateDealDto;
/**
 * Due Diligence Item DTO
 */
let DiligenceItemDto = (() => {
    var _a;
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _assigneeId_decorators;
    let _assigneeId_initializers = [];
    let _assigneeId_extraInitializers = [];
    let _documents_decorators;
    let _documents_initializers = [];
    let _documents_extraInitializers = [];
    return _a = class DiligenceItemDto {
            constructor() {
                this.category = __runInitializers(this, _category_initializers, void 0);
                this.description = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.priority = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.assigneeId = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _assigneeId_initializers, void 0));
                this.documents = (__runInitializers(this, _assigneeId_extraInitializers), __runInitializers(this, _documents_initializers, void 0));
                __runInitializers(this, _documents_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _category_decorators = [(0, swagger_1.ApiProperty)({ description: 'Category', example: 'Financial Statements' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Item description', example: 'Review audited financial statements for past 3 years' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority level', enum: ['critical', 'high', 'medium', 'low'] }), (0, class_validator_1.IsEnum)(['critical', 'high', 'medium', 'low'])];
            _assigneeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assignee ID', example: 'uuid-assignee', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _documents_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document references', example: ['doc-123', 'doc-456'], type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _assigneeId_decorators, { kind: "field", name: "assigneeId", static: false, private: false, access: { has: obj => "assigneeId" in obj, get: obj => obj.assigneeId, set: (obj, value) => { obj.assigneeId = value; } }, metadata: _metadata }, _assigneeId_initializers, _assigneeId_extraInitializers);
            __esDecorate(null, null, _documents_decorators, { kind: "field", name: "documents", static: false, private: false, access: { has: obj => "documents" in obj, get: obj => obj.documents, set: (obj, value) => { obj.documents = value; } }, metadata: _metadata }, _documents_initializers, _documents_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.DiligenceItemDto = DiligenceItemDto;
/**
 * Create DCF Valuation DTO
 */
let CreateDCFValuationDto = (() => {
    var _a;
    let _targetCompanyId_decorators;
    let _targetCompanyId_initializers = [];
    let _targetCompanyId_extraInitializers = [];
    let _projectionYears_decorators;
    let _projectionYears_initializers = [];
    let _projectionYears_extraInitializers = [];
    let _freeCashFlows_decorators;
    let _freeCashFlows_initializers = [];
    let _freeCashFlows_extraInitializers = [];
    let _terminalGrowthRate_decorators;
    let _terminalGrowthRate_initializers = [];
    let _terminalGrowthRate_extraInitializers = [];
    let _wacc_decorators;
    let _wacc_initializers = [];
    let _wacc_extraInitializers = [];
    let _netDebt_decorators;
    let _netDebt_initializers = [];
    let _netDebt_extraInitializers = [];
    let _sharesOutstanding_decorators;
    let _sharesOutstanding_initializers = [];
    let _sharesOutstanding_extraInitializers = [];
    return _a = class CreateDCFValuationDto {
            constructor() {
                this.targetCompanyId = __runInitializers(this, _targetCompanyId_initializers, void 0);
                this.projectionYears = (__runInitializers(this, _targetCompanyId_extraInitializers), __runInitializers(this, _projectionYears_initializers, void 0));
                this.freeCashFlows = (__runInitializers(this, _projectionYears_extraInitializers), __runInitializers(this, _freeCashFlows_initializers, void 0));
                this.terminalGrowthRate = (__runInitializers(this, _freeCashFlows_extraInitializers), __runInitializers(this, _terminalGrowthRate_initializers, void 0));
                this.wacc = (__runInitializers(this, _terminalGrowthRate_extraInitializers), __runInitializers(this, _wacc_initializers, void 0));
                this.netDebt = (__runInitializers(this, _wacc_extraInitializers), __runInitializers(this, _netDebt_initializers, void 0));
                this.sharesOutstanding = (__runInitializers(this, _netDebt_extraInitializers), __runInitializers(this, _sharesOutstanding_initializers, void 0));
                __runInitializers(this, _sharesOutstanding_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _targetCompanyId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target company ID', example: 'uuid-target' }), (0, class_validator_1.IsUUID)()];
            _projectionYears_decorators = [(0, swagger_1.ApiProperty)({ description: 'Projection years', example: 5, minimum: 3, maximum: 10 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(3), (0, class_validator_1.Max)(10)];
            _freeCashFlows_decorators = [(0, swagger_1.ApiProperty)({ description: 'Free cash flows array', example: [10000000, 12000000, 14500000, 17000000, 20000000], type: [Number] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsNumber)({}, { each: true })];
            _terminalGrowthRate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Terminal growth rate', example: 0.025, minimum: 0, maximum: 0.1 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(0.1)];
            _wacc_decorators = [(0, swagger_1.ApiProperty)({ description: 'WACC (Weighted Average Cost of Capital)', example: 0.09, minimum: 0, maximum: 0.3 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(0.3)];
            _netDebt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Net debt', example: 25000000 }), (0, class_validator_1.IsNumber)()];
            _sharesOutstanding_decorators = [(0, swagger_1.ApiProperty)({ description: 'Shares outstanding', example: 10000000, minimum: 1 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            __esDecorate(null, null, _targetCompanyId_decorators, { kind: "field", name: "targetCompanyId", static: false, private: false, access: { has: obj => "targetCompanyId" in obj, get: obj => obj.targetCompanyId, set: (obj, value) => { obj.targetCompanyId = value; } }, metadata: _metadata }, _targetCompanyId_initializers, _targetCompanyId_extraInitializers);
            __esDecorate(null, null, _projectionYears_decorators, { kind: "field", name: "projectionYears", static: false, private: false, access: { has: obj => "projectionYears" in obj, get: obj => obj.projectionYears, set: (obj, value) => { obj.projectionYears = value; } }, metadata: _metadata }, _projectionYears_initializers, _projectionYears_extraInitializers);
            __esDecorate(null, null, _freeCashFlows_decorators, { kind: "field", name: "freeCashFlows", static: false, private: false, access: { has: obj => "freeCashFlows" in obj, get: obj => obj.freeCashFlows, set: (obj, value) => { obj.freeCashFlows = value; } }, metadata: _metadata }, _freeCashFlows_initializers, _freeCashFlows_extraInitializers);
            __esDecorate(null, null, _terminalGrowthRate_decorators, { kind: "field", name: "terminalGrowthRate", static: false, private: false, access: { has: obj => "terminalGrowthRate" in obj, get: obj => obj.terminalGrowthRate, set: (obj, value) => { obj.terminalGrowthRate = value; } }, metadata: _metadata }, _terminalGrowthRate_initializers, _terminalGrowthRate_extraInitializers);
            __esDecorate(null, null, _wacc_decorators, { kind: "field", name: "wacc", static: false, private: false, access: { has: obj => "wacc" in obj, get: obj => obj.wacc, set: (obj, value) => { obj.wacc = value; } }, metadata: _metadata }, _wacc_initializers, _wacc_extraInitializers);
            __esDecorate(null, null, _netDebt_decorators, { kind: "field", name: "netDebt", static: false, private: false, access: { has: obj => "netDebt" in obj, get: obj => obj.netDebt, set: (obj, value) => { obj.netDebt = value; } }, metadata: _metadata }, _netDebt_initializers, _netDebt_extraInitializers);
            __esDecorate(null, null, _sharesOutstanding_decorators, { kind: "field", name: "sharesOutstanding", static: false, private: false, access: { has: obj => "sharesOutstanding" in obj, get: obj => obj.sharesOutstanding, set: (obj, value) => { obj.sharesOutstanding = value; } }, metadata: _metadata }, _sharesOutstanding_initializers, _sharesOutstanding_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateDCFValuationDto = CreateDCFValuationDto;
/**
 * Comparable Company DTO
 */
let ComparableCompanyDto = (() => {
    var _a;
    let _companyName_decorators;
    let _companyName_initializers = [];
    let _companyName_extraInitializers = [];
    let _industry_decorators;
    let _industry_initializers = [];
    let _industry_extraInitializers = [];
    let _revenue_decorators;
    let _revenue_initializers = [];
    let _revenue_extraInitializers = [];
    let _ebitda_decorators;
    let _ebitda_initializers = [];
    let _ebitda_extraInitializers = [];
    let _marketCap_decorators;
    let _marketCap_initializers = [];
    let _marketCap_extraInitializers = [];
    let _growthRate_decorators;
    let _growthRate_initializers = [];
    let _growthRate_extraInitializers = [];
    return _a = class ComparableCompanyDto {
            constructor() {
                this.companyName = __runInitializers(this, _companyName_initializers, void 0);
                this.industry = (__runInitializers(this, _companyName_extraInitializers), __runInitializers(this, _industry_initializers, void 0));
                this.revenue = (__runInitializers(this, _industry_extraInitializers), __runInitializers(this, _revenue_initializers, void 0));
                this.ebitda = (__runInitializers(this, _revenue_extraInitializers), __runInitializers(this, _ebitda_initializers, void 0));
                this.marketCap = (__runInitializers(this, _ebitda_extraInitializers), __runInitializers(this, _marketCap_initializers, void 0));
                this.growthRate = (__runInitializers(this, _marketCap_extraInitializers), __runInitializers(this, _growthRate_initializers, void 0));
                __runInitializers(this, _growthRate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _companyName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Company name', example: 'HealthCare Solutions Inc' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _industry_decorators = [(0, swagger_1.ApiProperty)({ description: 'Industry', example: 'Healthcare Technology' }), (0, class_validator_1.IsString)()];
            _revenue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Annual revenue', example: 500000000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _ebitda_decorators = [(0, swagger_1.ApiProperty)({ description: 'EBITDA', example: 75000000 }), (0, class_validator_1.IsNumber)()];
            _marketCap_decorators = [(0, swagger_1.ApiProperty)({ description: 'Market capitalization', example: 800000000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _growthRate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Revenue growth rate', example: 0.15, minimum: -1, maximum: 5 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(-1), (0, class_validator_1.Max)(5)];
            __esDecorate(null, null, _companyName_decorators, { kind: "field", name: "companyName", static: false, private: false, access: { has: obj => "companyName" in obj, get: obj => obj.companyName, set: (obj, value) => { obj.companyName = value; } }, metadata: _metadata }, _companyName_initializers, _companyName_extraInitializers);
            __esDecorate(null, null, _industry_decorators, { kind: "field", name: "industry", static: false, private: false, access: { has: obj => "industry" in obj, get: obj => obj.industry, set: (obj, value) => { obj.industry = value; } }, metadata: _metadata }, _industry_initializers, _industry_extraInitializers);
            __esDecorate(null, null, _revenue_decorators, { kind: "field", name: "revenue", static: false, private: false, access: { has: obj => "revenue" in obj, get: obj => obj.revenue, set: (obj, value) => { obj.revenue = value; } }, metadata: _metadata }, _revenue_initializers, _revenue_extraInitializers);
            __esDecorate(null, null, _ebitda_decorators, { kind: "field", name: "ebitda", static: false, private: false, access: { has: obj => "ebitda" in obj, get: obj => obj.ebitda, set: (obj, value) => { obj.ebitda = value; } }, metadata: _metadata }, _ebitda_initializers, _ebitda_extraInitializers);
            __esDecorate(null, null, _marketCap_decorators, { kind: "field", name: "marketCap", static: false, private: false, access: { has: obj => "marketCap" in obj, get: obj => obj.marketCap, set: (obj, value) => { obj.marketCap = value; } }, metadata: _metadata }, _marketCap_initializers, _marketCap_extraInitializers);
            __esDecorate(null, null, _growthRate_decorators, { kind: "field", name: "growthRate", static: false, private: false, access: { has: obj => "growthRate" in obj, get: obj => obj.growthRate, set: (obj, value) => { obj.growthRate = value; } }, metadata: _metadata }, _growthRate_initializers, _growthRate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ComparableCompanyDto = ComparableCompanyDto;
/**
 * Synergy Item DTO
 */
let SynergyItemDto = (() => {
    var _a;
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _annualValue_decorators;
    let _annualValue_initializers = [];
    let _annualValue_extraInitializers = [];
    let _realizationYear_decorators;
    let _realizationYear_initializers = [];
    let _realizationYear_extraInitializers = [];
    let _probability_decorators;
    let _probability_initializers = [];
    let _probability_extraInitializers = [];
    let _implementationCost_decorators;
    let _implementationCost_initializers = [];
    let _implementationCost_extraInitializers = [];
    let _ownerWorkstream_decorators;
    let _ownerWorkstream_initializers = [];
    let _ownerWorkstream_extraInitializers = [];
    return _a = class SynergyItemDto {
            constructor() {
                this.type = __runInitializers(this, _type_initializers, void 0);
                this.category = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.description = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.annualValue = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _annualValue_initializers, void 0));
                this.realizationYear = (__runInitializers(this, _annualValue_extraInitializers), __runInitializers(this, _realizationYear_initializers, void 0));
                this.probability = (__runInitializers(this, _realizationYear_extraInitializers), __runInitializers(this, _probability_initializers, void 0));
                this.implementationCost = (__runInitializers(this, _probability_extraInitializers), __runInitializers(this, _implementationCost_initializers, void 0));
                this.ownerWorkstream = (__runInitializers(this, _implementationCost_extraInitializers), __runInitializers(this, _ownerWorkstream_initializers, void 0));
                __runInitializers(this, _ownerWorkstream_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _type_decorators = [(0, swagger_1.ApiProperty)({ description: 'Synergy type', enum: SynergyType }), (0, class_validator_1.IsEnum)(SynergyType)];
            _category_decorators = [(0, swagger_1.ApiProperty)({ description: 'Category', example: 'Procurement consolidation' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description', example: 'Consolidate supplier contracts to achieve volume discounts' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            _annualValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Annual value', example: 2500000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _realizationYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Realization year', example: 2, minimum: 1, maximum: 5 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(5)];
            _probability_decorators = [(0, swagger_1.ApiProperty)({ description: 'Probability (0-1)', example: 0.85, minimum: 0, maximum: 1 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _implementationCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Implementation cost', example: 500000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _ownerWorkstream_decorators = [(0, swagger_1.ApiProperty)({ description: 'Owner workstream', enum: IntegrationWorkstream }), (0, class_validator_1.IsEnum)(IntegrationWorkstream)];
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _annualValue_decorators, { kind: "field", name: "annualValue", static: false, private: false, access: { has: obj => "annualValue" in obj, get: obj => obj.annualValue, set: (obj, value) => { obj.annualValue = value; } }, metadata: _metadata }, _annualValue_initializers, _annualValue_extraInitializers);
            __esDecorate(null, null, _realizationYear_decorators, { kind: "field", name: "realizationYear", static: false, private: false, access: { has: obj => "realizationYear" in obj, get: obj => obj.realizationYear, set: (obj, value) => { obj.realizationYear = value; } }, metadata: _metadata }, _realizationYear_initializers, _realizationYear_extraInitializers);
            __esDecorate(null, null, _probability_decorators, { kind: "field", name: "probability", static: false, private: false, access: { has: obj => "probability" in obj, get: obj => obj.probability, set: (obj, value) => { obj.probability = value; } }, metadata: _metadata }, _probability_initializers, _probability_extraInitializers);
            __esDecorate(null, null, _implementationCost_decorators, { kind: "field", name: "implementationCost", static: false, private: false, access: { has: obj => "implementationCost" in obj, get: obj => obj.implementationCost, set: (obj, value) => { obj.implementationCost = value; } }, metadata: _metadata }, _implementationCost_initializers, _implementationCost_extraInitializers);
            __esDecorate(null, null, _ownerWorkstream_decorators, { kind: "field", name: "ownerWorkstream", static: false, private: false, access: { has: obj => "ownerWorkstream" in obj, get: obj => obj.ownerWorkstream, set: (obj, value) => { obj.ownerWorkstream = value; } }, metadata: _metadata }, _ownerWorkstream_initializers, _ownerWorkstream_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SynergyItemDto = SynergyItemDto;
/**
 * Create Integration Plan DTO
 */
let CreateIntegrationPlanDto = (() => {
    var _a;
    let _dealId_decorators;
    let _dealId_initializers = [];
    let _dealId_extraInitializers = [];
    let _planName_decorators;
    let _planName_initializers = [];
    let _planName_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _targetCompletionDate_decorators;
    let _targetCompletionDate_initializers = [];
    let _targetCompletionDate_extraInitializers = [];
    let _totalBudget_decorators;
    let _totalBudget_initializers = [];
    let _totalBudget_extraInitializers = [];
    return _a = class CreateIntegrationPlanDto {
            constructor() {
                this.dealId = __runInitializers(this, _dealId_initializers, void 0);
                this.planName = (__runInitializers(this, _dealId_extraInitializers), __runInitializers(this, _planName_initializers, void 0));
                this.startDate = (__runInitializers(this, _planName_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.targetCompletionDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _targetCompletionDate_initializers, void 0));
                this.totalBudget = (__runInitializers(this, _targetCompletionDate_extraInitializers), __runInitializers(this, _totalBudget_initializers, void 0));
                __runInitializers(this, _totalBudget_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _dealId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Deal ID', example: 'uuid-deal' }), (0, class_validator_1.IsUUID)()];
            _planName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Plan name', example: 'Project Apollo Integration Plan' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date', example: '2025-07-01' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _targetCompletionDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target completion date', example: '2026-06-30' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _totalBudget_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total budget', example: 15000000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _dealId_decorators, { kind: "field", name: "dealId", static: false, private: false, access: { has: obj => "dealId" in obj, get: obj => obj.dealId, set: (obj, value) => { obj.dealId = value; } }, metadata: _metadata }, _dealId_initializers, _dealId_extraInitializers);
            __esDecorate(null, null, _planName_decorators, { kind: "field", name: "planName", static: false, private: false, access: { has: obj => "planName" in obj, get: obj => obj.planName, set: (obj, value) => { obj.planName = value; } }, metadata: _metadata }, _planName_initializers, _planName_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _targetCompletionDate_decorators, { kind: "field", name: "targetCompletionDate", static: false, private: false, access: { has: obj => "targetCompletionDate" in obj, get: obj => obj.targetCompletionDate, set: (obj, value) => { obj.targetCompletionDate = value; } }, metadata: _metadata }, _targetCompletionDate_initializers, _targetCompletionDate_extraInitializers);
            __esDecorate(null, null, _totalBudget_decorators, { kind: "field", name: "totalBudget", static: false, private: false, access: { has: obj => "totalBudget" in obj, get: obj => obj.totalBudget, set: (obj, value) => { obj.totalBudget = value; } }, metadata: _metadata }, _totalBudget_initializers, _totalBudget_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateIntegrationPlanDto = CreateIntegrationPlanDto;
/**
 * Integration Activity DTO
 */
let IntegrationActivityDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _assigneeId_decorators;
    let _assigneeId_initializers = [];
    let _assigneeId_extraInitializers = [];
    let _dependencies_decorators;
    let _dependencies_initializers = [];
    let _dependencies_extraInitializers = [];
    let _deliverables_decorators;
    let _deliverables_initializers = [];
    let _deliverables_extraInitializers = [];
    return _a = class IntegrationActivityDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.startDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.assigneeId = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _assigneeId_initializers, void 0));
                this.dependencies = (__runInitializers(this, _assigneeId_extraInitializers), __runInitializers(this, _dependencies_initializers, void 0));
                this.deliverables = (__runInitializers(this, _dependencies_extraInitializers), __runInitializers(this, _deliverables_initializers, void 0));
                __runInitializers(this, _deliverables_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Activity name', example: 'Integrate ERP systems' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description', example: 'Migrate target company financial data to acquirer ERP' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date', example: '2025-08-01' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date', example: '2025-11-30' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _assigneeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assignee ID', example: 'uuid-assignee' }), (0, class_validator_1.IsUUID)()];
            _dependencies_decorators = [(0, swagger_1.ApiProperty)({ description: 'Dependencies (activity IDs)', example: ['act-001', 'act-002'], type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _deliverables_decorators = [(0, swagger_1.ApiProperty)({ description: 'Deliverables', example: ['Migrated financial data', 'System integration document'], type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _assigneeId_decorators, { kind: "field", name: "assigneeId", static: false, private: false, access: { has: obj => "assigneeId" in obj, get: obj => obj.assigneeId, set: (obj, value) => { obj.assigneeId = value; } }, metadata: _metadata }, _assigneeId_initializers, _assigneeId_extraInitializers);
            __esDecorate(null, null, _dependencies_decorators, { kind: "field", name: "dependencies", static: false, private: false, access: { has: obj => "dependencies" in obj, get: obj => obj.dependencies, set: (obj, value) => { obj.dependencies = value; } }, metadata: _metadata }, _dependencies_initializers, _dependencies_extraInitializers);
            __esDecorate(null, null, _deliverables_decorators, { kind: "field", name: "deliverables", static: false, private: false, access: { has: obj => "deliverables" in obj, get: obj => obj.deliverables, set: (obj, value) => { obj.deliverables = value; } }, metadata: _metadata }, _deliverables_initializers, _deliverables_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.IntegrationActivityDto = IntegrationActivityDto;
/**
 * Cultural Dimension Score DTO
 */
let CulturalDimensionScoreDto = (() => {
    var _a;
    let _dimension_decorators;
    let _dimension_initializers = [];
    let _dimension_extraInitializers = [];
    let _acquirerScore_decorators;
    let _acquirerScore_initializers = [];
    let _acquirerScore_extraInitializers = [];
    let _targetScore_decorators;
    let _targetScore_initializers = [];
    let _targetScore_extraInitializers = [];
    return _a = class CulturalDimensionScoreDto {
            constructor() {
                this.dimension = __runInitializers(this, _dimension_initializers, void 0);
                this.acquirerScore = (__runInitializers(this, _dimension_extraInitializers), __runInitializers(this, _acquirerScore_initializers, void 0));
                this.targetScore = (__runInitializers(this, _acquirerScore_extraInitializers), __runInitializers(this, _targetScore_initializers, void 0));
                __runInitializers(this, _targetScore_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _dimension_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cultural dimension', enum: CulturalDimension }), (0, class_validator_1.IsEnum)(CulturalDimension)];
            _acquirerScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Acquirer score (1-10)', example: 7, minimum: 1, maximum: 10 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(10)];
            _targetScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target score (1-10)', example: 5, minimum: 1, maximum: 10 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(10)];
            __esDecorate(null, null, _dimension_decorators, { kind: "field", name: "dimension", static: false, private: false, access: { has: obj => "dimension" in obj, get: obj => obj.dimension, set: (obj, value) => { obj.dimension = value; } }, metadata: _metadata }, _dimension_initializers, _dimension_extraInitializers);
            __esDecorate(null, null, _acquirerScore_decorators, { kind: "field", name: "acquirerScore", static: false, private: false, access: { has: obj => "acquirerScore" in obj, get: obj => obj.acquirerScore, set: (obj, value) => { obj.acquirerScore = value; } }, metadata: _metadata }, _acquirerScore_initializers, _acquirerScore_extraInitializers);
            __esDecorate(null, null, _targetScore_decorators, { kind: "field", name: "targetScore", static: false, private: false, access: { has: obj => "targetScore" in obj, get: obj => obj.targetScore, set: (obj, value) => { obj.targetScore = value; } }, metadata: _metadata }, _targetScore_initializers, _targetScore_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CulturalDimensionScoreDto = CulturalDimensionScoreDto;
/**
 * Deal Structure Option DTO
 */
let DealStructureOptionDto = (() => {
    var _a;
    let _structureType_decorators;
    let _structureType_initializers = [];
    let _structureType_extraInitializers = [];
    let _cashComponent_decorators;
    let _cashComponent_initializers = [];
    let _cashComponent_extraInitializers = [];
    let _stockComponent_decorators;
    let _stockComponent_initializers = [];
    let _stockComponent_extraInitializers = [];
    let _debtComponent_decorators;
    let _debtComponent_initializers = [];
    let _debtComponent_extraInitializers = [];
    let _earnoutComponent_decorators;
    let _earnoutComponent_initializers = [];
    let _earnoutComponent_extraInitializers = [];
    let _acquirerDilution_decorators;
    let _acquirerDilution_initializers = [];
    let _acquirerDilution_extraInitializers = [];
    return _a = class DealStructureOptionDto {
            constructor() {
                this.structureType = __runInitializers(this, _structureType_initializers, void 0);
                this.cashComponent = (__runInitializers(this, _structureType_extraInitializers), __runInitializers(this, _cashComponent_initializers, void 0));
                this.stockComponent = (__runInitializers(this, _cashComponent_extraInitializers), __runInitializers(this, _stockComponent_initializers, void 0));
                this.debtComponent = (__runInitializers(this, _stockComponent_extraInitializers), __runInitializers(this, _debtComponent_initializers, void 0));
                this.earnoutComponent = (__runInitializers(this, _debtComponent_extraInitializers), __runInitializers(this, _earnoutComponent_initializers, void 0));
                this.acquirerDilution = (__runInitializers(this, _earnoutComponent_extraInitializers), __runInitializers(this, _acquirerDilution_initializers, void 0));
                __runInitializers(this, _acquirerDilution_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _structureType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Structure type', enum: DealStructure }), (0, class_validator_1.IsEnum)(DealStructure)];
            _cashComponent_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cash component', example: 75000000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _stockComponent_decorators = [(0, swagger_1.ApiProperty)({ description: 'Stock component', example: 50000000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _debtComponent_decorators = [(0, swagger_1.ApiProperty)({ description: 'Debt component', example: 25000000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _earnoutComponent_decorators = [(0, swagger_1.ApiProperty)({ description: 'Earnout component', example: 10000000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _acquirerDilution_decorators = [(0, swagger_1.ApiProperty)({ description: 'Acquirer dilution percentage', example: 0.15, minimum: 0, maximum: 1 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            __esDecorate(null, null, _structureType_decorators, { kind: "field", name: "structureType", static: false, private: false, access: { has: obj => "structureType" in obj, get: obj => obj.structureType, set: (obj, value) => { obj.structureType = value; } }, metadata: _metadata }, _structureType_initializers, _structureType_extraInitializers);
            __esDecorate(null, null, _cashComponent_decorators, { kind: "field", name: "cashComponent", static: false, private: false, access: { has: obj => "cashComponent" in obj, get: obj => obj.cashComponent, set: (obj, value) => { obj.cashComponent = value; } }, metadata: _metadata }, _cashComponent_initializers, _cashComponent_extraInitializers);
            __esDecorate(null, null, _stockComponent_decorators, { kind: "field", name: "stockComponent", static: false, private: false, access: { has: obj => "stockComponent" in obj, get: obj => obj.stockComponent, set: (obj, value) => { obj.stockComponent = value; } }, metadata: _metadata }, _stockComponent_initializers, _stockComponent_extraInitializers);
            __esDecorate(null, null, _debtComponent_decorators, { kind: "field", name: "debtComponent", static: false, private: false, access: { has: obj => "debtComponent" in obj, get: obj => obj.debtComponent, set: (obj, value) => { obj.debtComponent = value; } }, metadata: _metadata }, _debtComponent_initializers, _debtComponent_extraInitializers);
            __esDecorate(null, null, _earnoutComponent_decorators, { kind: "field", name: "earnoutComponent", static: false, private: false, access: { has: obj => "earnoutComponent" in obj, get: obj => obj.earnoutComponent, set: (obj, value) => { obj.earnoutComponent = value; } }, metadata: _metadata }, _earnoutComponent_initializers, _earnoutComponent_extraInitializers);
            __esDecorate(null, null, _acquirerDilution_decorators, { kind: "field", name: "acquirerDilution", static: false, private: false, access: { has: obj => "acquirerDilution" in obj, get: obj => obj.acquirerDilution, set: (obj, value) => { obj.acquirerDilution = value; } }, metadata: _metadata }, _acquirerDilution_initializers, _acquirerDilution_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.DealStructureOptionDto = DealStructureOptionDto;
/**
 * Stakeholder DTO
 */
let StakeholderDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _role_decorators;
    let _role_initializers = [];
    let _role_extraInitializers = [];
    let _organization_decorators;
    let _organization_initializers = [];
    let _organization_extraInitializers = [];
    let _influence_decorators;
    let _influence_initializers = [];
    let _influence_extraInitializers = [];
    let _impact_decorators;
    let _impact_initializers = [];
    let _impact_extraInitializers = [];
    let _supportLevel_decorators;
    let _supportLevel_initializers = [];
    let _supportLevel_extraInitializers = [];
    let _concerns_decorators;
    let _concerns_initializers = [];
    let _concerns_extraInitializers = [];
    return _a = class StakeholderDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.role = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _role_initializers, void 0));
                this.organization = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _organization_initializers, void 0));
                this.influence = (__runInitializers(this, _organization_extraInitializers), __runInitializers(this, _influence_initializers, void 0));
                this.impact = (__runInitializers(this, _influence_extraInitializers), __runInitializers(this, _impact_initializers, void 0));
                this.supportLevel = (__runInitializers(this, _impact_extraInitializers), __runInitializers(this, _supportLevel_initializers, void 0));
                this.concerns = (__runInitializers(this, _supportLevel_extraInitializers), __runInitializers(this, _concerns_initializers, void 0));
                __runInitializers(this, _concerns_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Stakeholder name', example: 'John Smith' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _role_decorators = [(0, swagger_1.ApiProperty)({ description: 'Role', example: 'CEO' }), (0, class_validator_1.IsString)()];
            _organization_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization', example: 'Target Company' }), (0, class_validator_1.IsString)()];
            _influence_decorators = [(0, swagger_1.ApiProperty)({ description: 'Influence score (1-10)', example: 9, minimum: 1, maximum: 10 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(10)];
            _impact_decorators = [(0, swagger_1.ApiProperty)({ description: 'Impact score (1-10)', example: 8, minimum: 1, maximum: 10 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(10)];
            _supportLevel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Support level', enum: ['champion', 'supporter', 'neutral', 'resistant', 'blocker'] }), (0, class_validator_1.IsEnum)(['champion', 'supporter', 'neutral', 'resistant', 'blocker'])];
            _concerns_decorators = [(0, swagger_1.ApiProperty)({ description: 'Key concerns', example: ['Job security', 'Cultural fit'], type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: obj => "role" in obj, get: obj => obj.role, set: (obj, value) => { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
            __esDecorate(null, null, _organization_decorators, { kind: "field", name: "organization", static: false, private: false, access: { has: obj => "organization" in obj, get: obj => obj.organization, set: (obj, value) => { obj.organization = value; } }, metadata: _metadata }, _organization_initializers, _organization_extraInitializers);
            __esDecorate(null, null, _influence_decorators, { kind: "field", name: "influence", static: false, private: false, access: { has: obj => "influence" in obj, get: obj => obj.influence, set: (obj, value) => { obj.influence = value; } }, metadata: _metadata }, _influence_initializers, _influence_extraInitializers);
            __esDecorate(null, null, _impact_decorators, { kind: "field", name: "impact", static: false, private: false, access: { has: obj => "impact" in obj, get: obj => obj.impact, set: (obj, value) => { obj.impact = value; } }, metadata: _metadata }, _impact_initializers, _impact_extraInitializers);
            __esDecorate(null, null, _supportLevel_decorators, { kind: "field", name: "supportLevel", static: false, private: false, access: { has: obj => "supportLevel" in obj, get: obj => obj.supportLevel, set: (obj, value) => { obj.supportLevel = value; } }, metadata: _metadata }, _supportLevel_initializers, _supportLevel_extraInitializers);
            __esDecorate(null, null, _concerns_decorators, { kind: "field", name: "concerns", static: false, private: false, access: { has: obj => "concerns" in obj, get: obj => obj.concerns, set: (obj, value) => { obj.concerns = value; } }, metadata: _metadata }, _concerns_initializers, _concerns_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.StakeholderDto = StakeholderDto;
/**
 * Value Driver DTO
 */
let ValueDriverDto = (() => {
    var _a;
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _currentState_decorators;
    let _currentState_initializers = [];
    let _currentState_extraInitializers = [];
    let _targetState_decorators;
    let _targetState_initializers = [];
    let _targetState_extraInitializers = [];
    let _timeframe_decorators;
    let _timeframe_initializers = [];
    let _timeframe_extraInitializers = [];
    return _a = class ValueDriverDto {
            constructor() {
                this.category = __runInitializers(this, _category_initializers, void 0);
                this.description = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.currentState = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _currentState_initializers, void 0));
                this.targetState = (__runInitializers(this, _currentState_extraInitializers), __runInitializers(this, _targetState_initializers, void 0));
                this.timeframe = (__runInitializers(this, _targetState_extraInitializers), __runInitializers(this, _timeframe_initializers, void 0));
                __runInitializers(this, _timeframe_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _category_decorators = [(0, swagger_1.ApiProperty)({ description: 'Value driver category', enum: ['growth', 'margin', 'capital', 'multiple'] }), (0, class_validator_1.IsEnum)(['growth', 'margin', 'capital', 'multiple'])];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description', example: 'Cross-sell to target customer base' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            _currentState_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current state value', example: 50000000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _targetState_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target state value', example: 75000000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _timeframe_decorators = [(0, swagger_1.ApiProperty)({ description: 'Timeframe in months', example: 24, minimum: 1 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _currentState_decorators, { kind: "field", name: "currentState", static: false, private: false, access: { has: obj => "currentState" in obj, get: obj => obj.currentState, set: (obj, value) => { obj.currentState = value; } }, metadata: _metadata }, _currentState_initializers, _currentState_extraInitializers);
            __esDecorate(null, null, _targetState_decorators, { kind: "field", name: "targetState", static: false, private: false, access: { has: obj => "targetState" in obj, get: obj => obj.targetState, set: (obj, value) => { obj.targetState = value; } }, metadata: _metadata }, _targetState_initializers, _targetState_extraInitializers);
            __esDecorate(null, null, _timeframe_decorators, { kind: "field", name: "timeframe", static: false, private: false, access: { has: obj => "timeframe" in obj, get: obj => obj.timeframe, set: (obj, value) => { obj.timeframe = value; } }, metadata: _metadata }, _timeframe_initializers, _timeframe_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ValueDriverDto = ValueDriverDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Deal Sequelize model.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     Deal:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         dealId:
 *           type: string
 *         dealName:
 *           type: string
 *         dealType:
 *           type: string
 *           enum: [merger, acquisition, divestiture, joint_venture, strategic_alliance, asset_purchase, stock_purchase]
 *         dealValue:
 *           type: number
 *         status:
 *           type: string
 *           enum: [ideation, preliminary_review, due_diligence, negotiation, agreement, regulatory_approval, closing, integration, completed, terminated]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
class Deal extends sequelize_1.Model {
}
exports.Deal = Deal;
function initDealModel(sequelize) {
    Deal.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        dealId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        dealName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
        },
        dealType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(DealType)),
            allowNull: false,
        },
        acquirerCompanyId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        targetCompanyId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        dealValue: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'USD',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(DealStatus)),
            allowNull: false,
            defaultValue: DealStatus.IDEATION,
        },
        announcedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        expectedClosingDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        actualClosingDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        dealStructure: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(DealStructure)),
            allowNull: false,
        },
        strategicRationale: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        dealLeadId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        advisors: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
        },
        confidentialityLevel: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'confidential',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'deals',
        timestamps: true,
        indexes: [
            { fields: ['dealId'] },
            { fields: ['status'] },
            { fields: ['acquirerCompanyId'] },
            { fields: ['targetCompanyId'] },
        ],
    });
    return Deal;
}
/**
 * Due Diligence Checklist Sequelize model.
 */
class DueDiligenceChecklist extends sequelize_1.Model {
}
exports.DueDiligenceChecklist = DueDiligenceChecklist;
function initDueDiligenceChecklistModel(sequelize) {
    DueDiligenceChecklist.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        checklistId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        dealId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        area: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(DiligenceArea)),
            allowNull: false,
        },
        checklistName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
        },
        items: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
        },
        completionPercentage: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
        },
        redFlags: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
        },
        leadAssigneeId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        dueDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'not_started',
        },
    }, {
        sequelize,
        tableName: 'due_diligence_checklists',
        timestamps: true,
        indexes: [
            { fields: ['dealId'] },
            { fields: ['area'] },
            { fields: ['status'] },
        ],
    });
    return DueDiligenceChecklist;
}
/**
 * Valuation Model Sequelize model.
 */
class ValuationModelEntity extends sequelize_1.Model {
}
exports.ValuationModelEntity = ValuationModelEntity;
function initValuationModelEntity(sequelize) {
    ValuationModelEntity.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        modelId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        dealId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        targetCompanyId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        method: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(ValuationMethod)),
            allowNull: false,
        },
        baseValue: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
        },
        adjustments: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
        },
        finalValue: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
        },
        valuationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        assumptions: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            defaultValue: [],
        },
        sensitivityAnalysis: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
        },
        confidence: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
        },
        preparedById: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'valuation_models',
        timestamps: true,
        indexes: [
            { fields: ['dealId'] },
            { fields: ['targetCompanyId'] },
            { fields: ['method'] },
        ],
    });
    return ValuationModelEntity;
}
// ============================================================================
// FUNCTIONS
// ============================================================================
/**
 * Creates a new M&A deal.
 *
 * @swagger
 * @openapi
 * /api/ma/deals:
 *   post:
 *     tags:
 *       - M&A
 *     summary: Create deal
 *     description: Creates a new M&A deal with specified parameters
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDealDto'
 *     responses:
 *       201:
 *         description: Deal created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Deal'
 *
 * @param {Partial<DealData>} data - Deal creation data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<DealData>} Created deal
 *
 * @example
 * ```typescript
 * const deal = await createDeal({
 *   dealName: 'Project Apollo',
 *   dealType: DealType.ACQUISITION,
 *   acquirerCompanyId: 'uuid-acq',
 *   targetCompanyId: 'uuid-tgt',
 *   dealValue: 150000000,
 *   currency: 'USD',
 *   dealStructure: DealStructure.MIXED,
 *   strategicRationale: 'Expand market presence'
 * });
 * ```
 */
async function createDeal(data, transaction) {
    const dealId = data.dealId || `DEAL-${Date.now()}`;
    return {
        dealId,
        dealName: data.dealName || '',
        dealType: data.dealType || DealType.ACQUISITION,
        acquirerCompanyId: data.acquirerCompanyId || '',
        targetCompanyId: data.targetCompanyId || '',
        dealValue: data.dealValue || 0,
        currency: data.currency || 'USD',
        status: data.status || DealStatus.IDEATION,
        announcedDate: data.announcedDate,
        expectedClosingDate: data.expectedClosingDate,
        actualClosingDate: data.actualClosingDate,
        dealStructure: data.dealStructure || DealStructure.CASH,
        strategicRationale: data.strategicRationale || '',
        dealLeadId: data.dealLeadId || '',
        advisors: data.advisors || [],
        confidentialityLevel: data.confidentialityLevel || 'confidential',
        metadata: data.metadata || {},
    };
}
/**
 * Creates a comprehensive due diligence checklist.
 *
 * @param {string} dealId - Deal identifier
 * @param {DiligenceArea} area - Due diligence area
 * @param {string} leadAssigneeId - Lead assignee
 * @param {Date} dueDate - Due date
 * @returns {Promise<DueDiligenceChecklist>} Created checklist
 *
 * @example
 * ```typescript
 * const checklist = await createDueDiligenceChecklist(
 *   'DEAL-001',
 *   DiligenceArea.FINANCIAL,
 *   'uuid-lead',
 *   new Date('2025-05-31')
 * );
 * ```
 */
async function createDueDiligenceChecklist(dealId, area, leadAssigneeId, dueDate) {
    const checklistId = `DD-${dealId}-${area}-${Date.now()}`;
    const templateItems = {
        [DiligenceArea.FINANCIAL]: [
            {
                itemId: `${checklistId}-1`,
                category: 'Financial Statements',
                description: 'Review audited financial statements for past 3-5 years',
                priority: 'critical',
                status: 'pending',
                documents: [],
            },
            {
                itemId: `${checklistId}-2`,
                category: 'Revenue Quality',
                description: 'Analyze revenue recognition policies and trends',
                priority: 'critical',
                status: 'pending',
                documents: [],
            },
            {
                itemId: `${checklistId}-3`,
                category: 'Working Capital',
                description: 'Assess working capital requirements and trends',
                priority: 'high',
                status: 'pending',
                documents: [],
            },
        ],
        [DiligenceArea.LEGAL]: [
            {
                itemId: `${checklistId}-1`,
                category: 'Corporate Structure',
                description: 'Review corporate organization and ownership structure',
                priority: 'critical',
                status: 'pending',
                documents: [],
            },
            {
                itemId: `${checklistId}-2`,
                category: 'Material Contracts',
                description: 'Review all material customer and supplier contracts',
                priority: 'critical',
                status: 'pending',
                documents: [],
            },
        ],
        [DiligenceArea.OPERATIONAL]: [
            {
                itemId: `${checklistId}-1`,
                category: 'Operations Overview',
                description: 'Understand operational model and key processes',
                priority: 'high',
                status: 'pending',
                documents: [],
            },
        ],
        [DiligenceArea.COMMERCIAL]: [
            {
                itemId: `${checklistId}-1`,
                category: 'Customer Analysis',
                description: 'Analyze customer concentration and retention',
                priority: 'high',
                status: 'pending',
                documents: [],
            },
        ],
        [DiligenceArea.TECHNOLOGY]: [
            {
                itemId: `${checklistId}-1`,
                category: 'IT Infrastructure',
                description: 'Assess technology stack and infrastructure',
                priority: 'high',
                status: 'pending',
                documents: [],
            },
        ],
        [DiligenceArea.HR]: [
            {
                itemId: `${checklistId}-1`,
                category: 'Key Personnel',
                description: 'Identify key employees and retention risks',
                priority: 'critical',
                status: 'pending',
                documents: [],
            },
        ],
        [DiligenceArea.ENVIRONMENTAL]: [
            {
                itemId: `${checklistId}-1`,
                category: 'Environmental Compliance',
                description: 'Review environmental permits and compliance',
                priority: 'medium',
                status: 'pending',
                documents: [],
            },
        ],
        [DiligenceArea.TAX]: [
            {
                itemId: `${checklistId}-1`,
                category: 'Tax Returns',
                description: 'Review tax returns and positions',
                priority: 'high',
                status: 'pending',
                documents: [],
            },
        ],
        [DiligenceArea.REGULATORY]: [
            {
                itemId: `${checklistId}-1`,
                category: 'Regulatory Compliance',
                description: 'Assess regulatory compliance and licenses',
                priority: 'critical',
                status: 'pending',
                documents: [],
            },
        ],
        [DiligenceArea.CULTURAL]: [
            {
                itemId: `${checklistId}-1`,
                category: 'Culture Assessment',
                description: 'Conduct cultural fit assessment',
                priority: 'high',
                status: 'pending',
                documents: [],
            },
        ],
    };
    return {
        checklistId,
        dealId,
        area,
        checklistName: `${area} Due Diligence`,
        items: templateItems[area] || [],
        completionPercentage: 0,
        redFlags: [],
        leadAssigneeId,
        dueDate,
        status: 'not_started',
    };
}
/**
 * Performs DCF (Discounted Cash Flow) valuation.
 *
 * @param {Partial<DCFValuation>} data - DCF valuation parameters
 * @returns {Promise<DCFValuation>} DCF valuation result
 *
 * @example
 * ```typescript
 * const dcf = await performDCFValuation({
 *   targetCompanyId: 'uuid-target',
 *   projectionYears: 5,
 *   freeCashFlows: [10M, 12M, 14.5M, 17M, 20M],
 *   terminalGrowthRate: 0.025,
 *   wacc: 0.09,
 *   netDebt: 25M,
 *   sharesOutstanding: 10M
 * });
 * console.log(`Equity value per share: $${dcf.valuePerShare.toFixed(2)}`);
 * ```
 */
async function performDCFValuation(data) {
    const modelId = `DCF-${data.targetCompanyId}-${Date.now()}`;
    const fcfs = data.freeCashFlows || [];
    const wacc = data.wacc || 0.09;
    const terminalGrowthRate = data.terminalGrowthRate || 0.025;
    // Calculate present value of projected cash flows
    let pvOfFCF = 0;
    fcfs.forEach((fcf, index) => {
        const year = index + 1;
        const discountFactor = Math.pow(1 + wacc, year);
        pvOfFCF += fcf / discountFactor;
    });
    // Calculate terminal value
    const finalYearFCF = fcfs[fcfs.length - 1] || 0;
    const terminalValue = (finalYearFCF * (1 + terminalGrowthRate)) / (wacc - terminalGrowthRate);
    const pvOfTerminalValue = terminalValue / Math.pow(1 + wacc, fcfs.length);
    // Calculate enterprise value and equity value
    const enterpriseValue = pvOfFCF + pvOfTerminalValue;
    const netDebt = data.netDebt || 0;
    const equityValue = enterpriseValue - netDebt;
    const sharesOutstanding = data.sharesOutstanding || 1;
    const valuePerShare = equityValue / sharesOutstanding;
    return {
        modelId,
        targetCompanyId: data.targetCompanyId || '',
        projectionYears: fcfs.length,
        freeCashFlows: fcfs,
        terminalGrowthRate,
        wacc,
        terminalValue,
        enterpriseValue,
        netDebt,
        equityValue,
        sharesOutstanding,
        valuePerShare,
    };
}
/**
 * Performs comparable company analysis.
 *
 * @param {string} targetCompanyId - Target company ID
 * @param {ComparableCompany[]} comparables - Comparable companies
 * @param {number} targetRevenue - Target company revenue
 * @param {number} targetEbitda - Target company EBITDA
 * @returns {Promise<ComparableCompanyAnalysis>} Comparable analysis
 *
 * @example
 * ```typescript
 * const compAnalysis = await performComparableCompanyAnalysis(
 *   'uuid-target',
 *   comparableCompanies,
 *   500000000,
 *   75000000
 * );
 * console.log(`Implied value: $${compAnalysis.impliedValue.toLocaleString()}`);
 * ```
 */
async function performComparableCompanyAnalysis(targetCompanyId, comparables, targetRevenue, targetEbitda) {
    const analysisId = `COMP-${targetCompanyId}-${Date.now()}`;
    // Calculate multiples for each comparable
    const comparablesWithMultiples = comparables.map(comp => ({
        ...comp,
        evToRevenue: comp.marketCap / comp.revenue,
        evToEbitda: comp.marketCap / comp.ebitda,
        peRatio: comp.marketCap / (comp.ebitda * 0.7), // Simplified P/E approximation
    }));
    // Calculate average and median multiples
    const evToRevenues = comparablesWithMultiples.map(c => c.evToRevenue);
    const evToEbitdas = comparablesWithMultiples.map(c => c.evToEbitda);
    const avgEvToRevenue = evToRevenues.reduce((a, b) => a + b, 0) / evToRevenues.length;
    const avgEvToEbitda = evToEbitdas.reduce((a, b) => a + b, 0) / evToEbitdas.length;
    const medianEvToRevenue = evToRevenues.sort((a, b) => a - b)[Math.floor(evToRevenues.length / 2)];
    const medianEvToEbitda = evToEbitdas.sort((a, b) => a - b)[Math.floor(evToEbitdas.length / 2)];
    // Calculate implied value using average multiples
    const impliedValueRevenue = targetRevenue * avgEvToRevenue;
    const impliedValueEbitda = targetEbitda * avgEvToEbitda;
    const impliedValue = (impliedValueRevenue + impliedValueEbitda) / 2;
    return {
        analysisId,
        targetCompanyId,
        comparableCompanies: comparablesWithMultiples,
        averageMultiples: {
            evToRevenue: avgEvToRevenue,
            evToEbitda: avgEvToEbitda,
        },
        medianMultiples: {
            evToRevenue: medianEvToRevenue,
            evToEbitda: medianEvToEbitda,
        },
        impliedValue,
        premiumDiscount: 0, // Can be adjusted based on specific factors
    };
}
/**
 * Analyzes precedent transactions.
 *
 * @param {string} targetCompanyId - Target company ID
 * @param {PrecedentTransaction[]} precedents - Precedent transactions
 * @param {number} targetRevenue - Target revenue
 * @param {number} targetEbitda - Target EBITDA
 * @returns {Promise<{ impliedValue: number; averageMultiples: Record<string, number> }>} Analysis result
 *
 * @example
 * ```typescript
 * const precedentAnalysis = await analyzePrecedentTransactions(
 *   'uuid-target',
 *   precedentTransactions,
 *   500000000,
 *   75000000
 * );
 * ```
 */
async function analyzePrecedentTransactions(targetCompanyId, precedents, targetRevenue, targetEbitda) {
    // Calculate average multiples from precedent transactions
    const evToRevenues = precedents.map(p => p.evToRevenue);
    const evToEbitdas = precedents.map(p => p.evToEbitda);
    const premiums = precedents.map(p => p.premiumPaid);
    const avgEvToRevenue = evToRevenues.reduce((a, b) => a + b, 0) / evToRevenues.length;
    const avgEvToEbitda = evToEbitdas.reduce((a, b) => a + b, 0) / evToEbitdas.length;
    const medianPremium = premiums.sort((a, b) => a - b)[Math.floor(premiums.length / 2)];
    // Calculate implied value
    const impliedValueRevenue = targetRevenue * avgEvToRevenue;
    const impliedValueEbitda = targetEbitda * avgEvToEbitda;
    const impliedValue = (impliedValueRevenue + impliedValueEbitda) / 2;
    return {
        impliedValue,
        averageMultiples: {
            evToRevenue: avgEvToRevenue,
            evToEbitda: avgEvToEbitda,
        },
        medianPremium,
    };
}
/**
 * Performs comprehensive synergy analysis.
 *
 * @param {string} dealId - Deal ID
 * @param {SynergyItem[]} synergies - Synergy items
 * @param {number} discountRate - Discount rate for NPV
 * @returns {Promise<SynergyAnalysis>} Synergy analysis
 *
 * @example
 * ```typescript
 * const synergyAnalysis = await performSynergyAnalysis(
 *   'DEAL-001',
 *   synergyItems,
 *   0.09
 * );
 * console.log(`Total synergies: $${synergyAnalysis.totalSynergies.toLocaleString()}`);
 * ```
 */
async function performSynergyAnalysis(dealId, synergies, discountRate = 0.09) {
    const analysisId = `SYN-${dealId}-${Date.now()}`;
    // Calculate probability-adjusted synergies
    const adjustedSynergies = synergies.map(s => ({
        ...s,
        adjustedValue: s.annualValue * s.probability,
    }));
    // Aggregate by type
    const revenueSynergies = adjustedSynergies
        .filter(s => s.type === SynergyType.REVENUE)
        .reduce((sum, s) => sum + s.adjustedValue, 0);
    const costSynergies = adjustedSynergies
        .filter(s => s.type === SynergyType.COST)
        .reduce((sum, s) => sum + s.adjustedValue, 0);
    const totalSynergies = revenueSynergies + costSynergies;
    // Calculate implementation cost
    const implementationCost = synergies.reduce((sum, s) => sum + s.implementationCost, 0);
    // Build realization timeline (5 years)
    const timeline = [];
    for (let year = 1; year <= 5; year++) {
        const yearSynergies = adjustedSynergies.filter(s => s.realizationYear === year);
        const yearRevenue = yearSynergies.filter(s => s.type === SynergyType.REVENUE).reduce((sum, s) => sum + s.adjustedValue, 0);
        const yearCost = yearSynergies.filter(s => s.type === SynergyType.COST).reduce((sum, s) => sum + s.adjustedValue, 0);
        const yearTotal = yearRevenue + yearCost;
        const cumulativeSynergies = timeline.length > 0
            ? timeline[timeline.length - 1].cumulativeSynergies + yearTotal
            : yearTotal;
        timeline.push({
            year,
            revenueSynergies: yearRevenue,
            costSynergies: yearCost,
            totalSynergies: yearTotal,
            cumulativeSynergies,
            realizationPercentage: (cumulativeSynergies / totalSynergies) * 100,
        });
    }
    // Calculate NPV of synergies
    let npv = -implementationCost; // Initial investment
    timeline.forEach(t => {
        npv += t.totalSynergies / Math.pow(1 + discountRate, t.year);
    });
    return {
        analysisId,
        dealId,
        totalSynergies,
        revenueSynergies,
        costSynergies,
        synergies: adjustedSynergies,
        realizationTimeline: timeline,
        implementationCost,
        netPresentValue: npv,
        confidenceLevel: npv > 0 ? 'high' : 'medium',
    };
}
/**
 * Creates integration plan with workstreams.
 *
 * @param {Partial<IntegrationPlan>} data - Integration plan data
 * @returns {Promise<IntegrationPlan>} Created integration plan
 *
 * @example
 * ```typescript
 * const integrationPlan = await createIntegrationPlan({
 *   dealId: 'DEAL-001',
 *   planName: 'Project Apollo Integration',
 *   startDate: new Date('2025-07-01'),
 *   targetCompletionDate: new Date('2026-06-30'),
 *   totalBudget: 15000000
 * });
 * ```
 */
async function createIntegrationPlan(data) {
    const planId = `INT-${data.dealId}-${Date.now()}`;
    const startDate = data.startDate || new Date();
    const targetCompletionDate = data.targetCompletionDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    const totalDays = Math.floor((targetCompletionDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
    // Create default workstreams
    const workstreamTypes = Object.values(IntegrationWorkstream);
    const workstreams = workstreamTypes.map(ws => ({
        workstreamId: `WS-${planId}-${ws}`,
        workstream: ws,
        leadId: '',
        objectives: [],
        activities: [],
        budget: 0,
        headcount: 0,
        status: 'not_started',
        completionPercentage: 0,
    }));
    return {
        planId,
        dealId: data.dealId || '',
        planName: data.planName || '',
        startDate,
        targetCompletionDate,
        workstreams: data.workstreams || workstreams,
        totalBudget: data.totalBudget || 0,
        totalDays,
        overallStatus: 'planning',
        completionPercentage: 0,
        criticalPath: data.criticalPath || [],
    };
}
/**
 * Adds activity to integration workstream.
 *
 * @param {string} planId - Integration plan ID
 * @param {string} workstreamId - Workstream ID
 * @param {Partial<IntegrationActivity>} activity - Activity data
 * @returns {Promise<IntegrationActivity>} Created activity
 *
 * @example
 * ```typescript
 * const activity = await addIntegrationActivity(
 *   'INT-001',
 *   'WS-001',
 *   {
 *     name: 'Integrate ERP systems',
 *     description: 'Migrate financial data',
 *     startDate: new Date('2025-08-01'),
 *     endDate: new Date('2025-11-30'),
 *     assigneeId: 'uuid-assignee'
 *   }
 * );
 * ```
 */
async function addIntegrationActivity(planId, workstreamId, activity) {
    const activityId = `ACT-${workstreamId}-${Date.now()}`;
    return {
        activityId,
        name: activity.name || '',
        description: activity.description || '',
        startDate: activity.startDate || new Date(),
        endDate: activity.endDate || new Date(),
        assigneeId: activity.assigneeId || '',
        dependencies: activity.dependencies || [],
        deliverables: activity.deliverables || [],
        status: 'pending',
        progressPercentage: 0,
    };
}
/**
 * Performs cultural assessment between acquirer and target.
 *
 * @param {string} dealId - Deal ID
 * @param {string} acquirerCompanyId - Acquirer company ID
 * @param {string} targetCompanyId - Target company ID
 * @param {CulturalDimensionScore[]} dimensionScores - Cultural dimension scores
 * @returns {Promise<CulturalAssessment>} Cultural assessment
 *
 * @example
 * ```typescript
 * const culturalAssessment = await performCulturalAssessment(
 *   'DEAL-001',
 *   'uuid-acq',
 *   'uuid-tgt',
 *   dimensionScores
 * );
 * console.log(`Overall fit score: ${culturalAssessment.overallFitScore}`);
 * ```
 */
async function performCulturalAssessment(dealId, acquirerCompanyId, targetCompanyId, dimensionScores) {
    const assessmentId = `CULT-${dealId}-${Date.now()}`;
    // Calculate dimensions with gap scores
    const dimensions = dimensionScores.map(ds => {
        const gapScore = Math.abs(ds.acquirerScore - ds.targetScore);
        let alignment;
        let integrationComplexity;
        if (gapScore <= 2) {
            alignment = 'high';
            integrationComplexity = 'simple';
        }
        else if (gapScore <= 4) {
            alignment = 'medium';
            integrationComplexity = 'moderate';
        }
        else {
            alignment = 'low';
            integrationComplexity = 'complex';
        }
        return {
            ...ds,
            gapScore,
            alignment,
            integrationComplexity,
            recommendations: [],
        };
    });
    // Calculate overall fit score (0-100)
    const totalGap = dimensions.reduce((sum, d) => sum + d.gapScore, 0);
    const maxPossibleGap = dimensions.length * 10; // Max gap is 10 per dimension
    const overallFitScore = Math.max(0, 100 - (totalGap / maxPossibleGap) * 100);
    // Determine risk level
    let riskLevel;
    if (overallFitScore >= 75) {
        riskLevel = RiskSeverity.LOW;
    }
    else if (overallFitScore >= 50) {
        riskLevel = RiskSeverity.MEDIUM;
    }
    else if (overallFitScore >= 30) {
        riskLevel = RiskSeverity.HIGH;
    }
    else {
        riskLevel = RiskSeverity.CRITICAL;
    }
    return {
        assessmentId,
        dealId,
        acquirerCompanyId,
        targetCompanyId,
        assessmentDate: new Date(),
        dimensions,
        overallFitScore,
        riskLevel,
        keyFindings: [],
        recommendations: [],
        integrationChallenges: [],
    };
}
/**
 * Analyzes deal structure options.
 *
 * @param {string} dealId - Deal ID
 * @param {DealStructureOption[]} structureOptions - Structure options
 * @returns {Promise<DealStructureAnalysis>} Deal structure analysis
 *
 * @example
 * ```typescript
 * const structureAnalysis = await analyzeDealStructure(
 *   'DEAL-001',
 *   structureOptions
 * );
 * console.log(`Recommended structure: ${structureAnalysis.recommendedStructureId}`);
 * ```
 */
async function analyzeDealStructure(dealId, structureOptions) {
    const analysisId = `STRUCT-${dealId}-${Date.now()}`;
    // Score each option
    const scoredOptions = structureOptions.map(option => {
        let score = 0;
        // Tax efficiency (0-40 points)
        score += option.taxEfficiency * 40;
        // Lower dilution is better (0-30 points)
        score += (1 - option.acquirerDilution) * 30;
        // Lower financing risk is better (0-30 points)
        const riskScores = {
            [RiskSeverity.NEGLIGIBLE]: 30,
            [RiskSeverity.LOW]: 24,
            [RiskSeverity.MEDIUM]: 18,
            [RiskSeverity.HIGH]: 12,
            [RiskSeverity.CRITICAL]: 6,
        };
        score += riskScores[option.financingRisk] || 0;
        return { option, score };
    });
    // Find recommended option (highest score)
    const recommended = scoredOptions.reduce((best, current) => current.score > best.score ? current : best);
    return {
        analysisId,
        dealId,
        proposedStructures: structureOptions,
        recommendedStructureId: recommended.option.optionId,
        taxImplications: [],
        accountingTreatment: '',
        regulatoryConsiderations: [],
    };
}
/**
 * Calculates deal premium paid.
 *
 * @param {number} dealValue - Deal value
 * @param {number} targetMarketCap - Target's pre-announcement market cap
 * @returns {Promise<{ premiumAmount: number; premiumPercentage: number }>} Premium calculation
 *
 * @example
 * ```typescript
 * const premium = await calculateDealPremium(150000000, 120000000);
 * console.log(`Premium: ${premium.premiumPercentage.toFixed(2)}%`);
 * ```
 */
async function calculateDealPremium(dealValue, targetMarketCap) {
    const premiumAmount = dealValue - targetMarketCap;
    const premiumPercentage = (premiumAmount / targetMarketCap) * 100;
    return {
        premiumAmount,
        premiumPercentage,
    };
}
/**
 * Tracks post-merger integration progress.
 *
 * @param {string} dealId - Deal ID
 * @param {Partial<PostMergerIntegration>} data - PMI data
 * @returns {Promise<PostMergerIntegration>} PMI tracking
 *
 * @example
 * ```typescript
 * const pmi = await trackPostMergerIntegration('DEAL-001', pmiData);
 * console.log(`Day 1 readiness: ${pmi.day1Status.readinessScore}%`);
 * ```
 */
async function trackPostMergerIntegration(dealId, data) {
    const integrationId = `PMI-${dealId}-${Date.now()}`;
    const defaultDay1Status = {
        readinessScore: 0,
        criticalSystems: [],
        communicationsPlan: false,
        leadershipAlignment: false,
        employeeNotifications: false,
        customerCommunications: false,
        regulatoryFilings: false,
        openIssues: 0,
    };
    const defaultSynergyCaptureStatus = {
        targetSynergies: 0,
        capturedSynergies: 0,
        captureRate: 0,
        revenueSynergyProgress: 0,
        costSynergyProgress: 0,
        atRiskSynergies: 0,
        blockedSynergies: [],
    };
    return {
        integrationId,
        dealId,
        day1Status: data.day1Status || defaultDay1Status,
        day100Milestones: data.day100Milestones || [],
        synergyCaptureProgress: data.synergyCaptureProgress || defaultSynergyCaptureStatus,
        organizationalHealth: data.organizationalHealth || 0,
        employeeRetention: data.employeeRetention || 0,
        customerRetention: data.customerRetention || 0,
        integrationRisks: data.integrationRisks || [],
    };
}
/**
 * Creates Day 1 readiness checklist.
 *
 * @param {string} dealId - Deal ID
 * @returns {Promise<Day1Readiness>} Day 1 readiness
 *
 * @example
 * ```typescript
 * const day1 = await createDay1ReadinessChecklist('DEAL-001');
 * ```
 */
async function createDay1ReadinessChecklist(dealId) {
    const criticalSystems = [
        {
            systemName: 'ERP',
            category: 'erp',
            integrationApproach: 'coexist',
            readinessStatus: 'ready',
        },
        {
            systemName: 'CRM',
            category: 'crm',
            integrationApproach: 'coexist',
            readinessStatus: 'ready',
        },
        {
            systemName: 'HR System',
            category: 'hr',
            integrationApproach: 'integrate',
            readinessStatus: 'at_risk',
        },
    ];
    return {
        readinessScore: 75,
        criticalSystems,
        communicationsPlan: true,
        leadershipAlignment: true,
        employeeNotifications: true,
        customerCommunications: true,
        regulatoryFilings: true,
        openIssues: 3,
    };
}
/**
 * Maps deal stakeholders with influence-impact analysis.
 *
 * @param {string} dealId - Deal ID
 * @param {Stakeholder[]} stakeholders - Stakeholders
 * @returns {Promise<StakeholderMap>} Stakeholder map
 *
 * @example
 * ```typescript
 * const stakeholderMap = await mapDealStakeholders('DEAL-001', stakeholders);
 * ```
 */
async function mapDealStakeholders(dealId, stakeholders) {
    // Categorize stakeholders into influence-impact quadrants
    const quadrants = [
        {
            quadrant: 'high_influence_high_impact',
            stakeholderIds: stakeholders.filter(s => s.influence >= 7 && s.impact >= 7).map(s => s.stakeholderId),
            strategy: 'Manage closely - key players requiring active engagement',
        },
        {
            quadrant: 'high_influence_low_impact',
            stakeholderIds: stakeholders.filter(s => s.influence >= 7 && s.impact < 7).map(s => s.stakeholderId),
            strategy: 'Keep satisfied - consult regularly but don\'t over-communicate',
        },
        {
            quadrant: 'low_influence_high_impact',
            stakeholderIds: stakeholders.filter(s => s.influence < 7 && s.impact >= 7).map(s => s.stakeholderId),
            strategy: 'Keep informed - ensure they understand benefits',
        },
        {
            quadrant: 'low_influence_low_impact',
            stakeholderIds: stakeholders.filter(s => s.influence < 7 && s.impact < 7).map(s => s.stakeholderId),
            strategy: 'Monitor - minimal effort required',
        },
    ];
    // Create engagement plans
    const engagementPlans = stakeholders.map(s => ({
        stakeholderId: s.stakeholderId,
        objectives: s.supportLevel === 'blocker' ? ['Address concerns', 'Build support'] : ['Maintain support'],
        tactics: s.influence >= 7 ? ['1-on-1 meetings', 'Executive briefings'] : ['Email updates', 'Town halls'],
        frequency: s.influence >= 7 && s.impact >= 7 ? 'Weekly' : 'Monthly',
        channels: [s.communicationPreference],
        ownerId: '',
    }));
    return {
        dealId,
        stakeholders,
        influenceImpactMatrix: quadrants,
        engagementStrategy: engagementPlans,
    };
}
/**
 * Tracks regulatory approval status.
 *
 * @param {string} dealId - Deal ID
 * @param {Partial<RegulatoryApproval>} data - Regulatory approval data
 * @returns {Promise<RegulatoryApproval>} Regulatory approval
 *
 * @example
 * ```typescript
 * const approval = await trackRegulatoryApproval('DEAL-001', approvalData);
 * ```
 */
async function trackRegulatoryApproval(dealId, data) {
    const approvalId = `REG-${dealId}-${data.jurisdiction}-${Date.now()}`;
    return {
        approvalId,
        dealId,
        jurisdiction: data.jurisdiction || '',
        regulatoryBody: data.regulatoryBody || '',
        approvalType: data.approvalType || '',
        filingDate: data.filingDate,
        expectedDecisionDate: data.expectedDecisionDate,
        actualDecisionDate: data.actualDecisionDate,
        status: data.status || 'pending',
        conditions: data.conditions || [],
        risks: data.risks || [],
    };
}
/**
 * Creates value creation plan for deal.
 *
 * @param {string} dealId - Deal ID
 * @param {Partial<ValueCreationPlan>} data - Value creation plan data
 * @returns {Promise<ValueCreationPlan>} Value creation plan
 *
 * @example
 * ```typescript
 * const valuePlan = await createValueCreationPlan('DEAL-001', planData);
 * console.log(`Expected ROI: ${valuePlan.expectedROI.toFixed(2)}`);
 * ```
 */
async function createValueCreationPlan(dealId, data) {
    const planId = `VAL-${dealId}-${Date.now()}`;
    const valueDrivers = data.valueDrivers || [];
    const initiatives = data.initiatives || [];
    const totalValuePotential = valueDrivers.reduce((sum, vd) => sum + vd.valuePotential, 0);
    const investmentRequired = initiatives.reduce((sum, i) => sum + i.investmentRequired, 0);
    const expectedROI = investmentRequired > 0 ? (totalValuePotential - investmentRequired) / investmentRequired : 0;
    const maxTimeframe = Math.max(...valueDrivers.map(vd => vd.timeframe), 12);
    return {
        planId,
        dealId,
        valueDrivers,
        initiatives,
        totalValuePotential,
        realizationTimeline: maxTimeframe,
        investmentRequired,
        expectedROI,
    };
}
/**
 * Identifies integration risks.
 *
 * @param {string} dealId - Deal ID
 * @param {string[]} riskCategories - Risk categories to assess
 * @returns {Promise<IntegrationRisk[]>} Identified risks
 *
 * @example
 * ```typescript
 * const risks = await identifyIntegrationRisks('DEAL-001', ['systems', 'culture', 'operations']);
 * ```
 */
async function identifyIntegrationRisks(dealId, riskCategories) {
    const risks = [];
    riskCategories.forEach((category, index) => {
        const riskId = `RISK-${dealId}-${category}-${index}`;
        // Example risk templates
        if (category === 'systems') {
            risks.push({
                riskId,
                category,
                description: 'System integration complexity and data migration risks',
                severity: RiskSeverity.HIGH,
                probability: 0.7,
                impact: 8,
                riskScore: 0.7 * 8,
                mitigationActions: ['Conduct thorough system assessment', 'Develop detailed integration plan', 'Run parallel systems initially'],
                ownerWorkstream: IntegrationWorkstream.SYSTEMS,
                status: 'identified',
            });
        }
        else if (category === 'culture') {
            risks.push({
                riskId,
                category,
                description: 'Cultural misalignment leading to employee attrition',
                severity: RiskSeverity.MEDIUM,
                probability: 0.5,
                impact: 7,
                riskScore: 0.5 * 7,
                mitigationActions: ['Cultural integration workshops', 'Leadership alignment sessions', 'Clear communication plan'],
                ownerWorkstream: IntegrationWorkstream.CULTURE,
                status: 'identified',
            });
        }
        else if (category === 'operations') {
            risks.push({
                riskId,
                category,
                description: 'Operational disruption during integration',
                severity: RiskSeverity.MEDIUM,
                probability: 0.6,
                impact: 6,
                riskScore: 0.6 * 6,
                mitigationActions: ['Phased integration approach', 'Maintain operational continuity', 'Resource redundancy'],
                ownerWorkstream: IntegrationWorkstream.OPERATIONS,
                status: 'identified',
            });
        }
    });
    return risks;
}
/**
 * Calculates accretion/dilution analysis.
 *
 * @param {number} acquirerEPS - Acquirer's EPS
 * @param {number} targetEarnings - Target's net earnings
 * @param {number} newSharesIssued - New shares issued in deal
 * @param {number} acquirerSharesOutstanding - Acquirer's shares outstanding
 * @returns {Promise<{ proFormaEPS: number; accretionDilution: number; isAccretive: boolean }>} Analysis
 *
 * @example
 * ```typescript
 * const adAnalysis = await calculateAccretionDilution(5.00, 10000000, 2000000, 50000000);
 * console.log(`Pro forma EPS: $${adAnalysis.proFormaEPS.toFixed(2)}`);
 * ```
 */
async function calculateAccretionDilution(acquirerEPS, targetEarnings, newSharesIssued, acquirerSharesOutstanding) {
    const acquirerEarnings = acquirerEPS * acquirerSharesOutstanding;
    const combinedEarnings = acquirerEarnings + targetEarnings;
    const combinedShares = acquirerSharesOutstanding + newSharesIssued;
    const proFormaEPS = combinedEarnings / combinedShares;
    const accretionDilution = ((proFormaEPS - acquirerEPS) / acquirerEPS) * 100;
    const isAccretive = accretionDilution > 0;
    return {
        proFormaEPS,
        accretionDilution,
        isAccretive,
    };
}
/**
 * Performs break-up valuation analysis.
 *
 * @param {string} targetCompanyId - Target company ID
 * @param {Array<{ segment: string; value: number }>} segmentValues - Business segment values
 * @returns {Promise<{ totalBreakupValue: number; premiumToWhole: number }>} Break-up analysis
 *
 * @example
 * ```typescript
 * const breakup = await performBreakupValuation('uuid-target', segmentValues);
 * console.log(`Break-up value premium: ${breakup.premiumToWhole.toFixed(2)}%`);
 * ```
 */
async function performBreakupValuation(targetCompanyId, segmentValues, wholeCompanyValue) {
    const totalBreakupValue = segmentValues.reduce((sum, seg) => sum + seg.value, 0);
    const premiumToWhole = ((totalBreakupValue - wholeCompanyValue) / wholeCompanyValue) * 100;
    return {
        totalBreakupValue,
        premiumToWhole,
        segments: segmentValues,
    };
}
/**
 * Calculates cost of capital for deal financing.
 *
 * @param {number} debtAmount - Debt financing amount
 * @param {number} equityAmount - Equity financing amount
 * @param {number} debtRate - Cost of debt (after-tax)
 * @param {number} equityRate - Cost of equity
 * @returns {Promise<{ wacc: number; debtWeight: number; equityWeight: number }>} Cost of capital
 *
 * @example
 * ```typescript
 * const costOfCapital = await calculateCostOfCapital(50000000, 100000000, 0.05, 0.12);
 * console.log(`WACC: ${costOfCapital.wacc.toFixed(4)}`);
 * ```
 */
async function calculateCostOfCapital(debtAmount, equityAmount, debtRate, equityRate) {
    const totalCapital = debtAmount + equityAmount;
    const debtWeight = debtAmount / totalCapital;
    const equityWeight = equityAmount / totalCapital;
    const wacc = (debtWeight * debtRate) + (equityWeight * equityRate);
    return {
        wacc,
        debtWeight,
        equityWeight,
    };
}
/**
 * Estimates cost to achieve synergies.
 *
 * @param {SynergyItem[]} synergies - Synergy items
 * @param {number} baselineMultiplier - Multiplier for baseline costs (default 0.3)
 * @returns {Promise<{ totalCost: number; costBySynergy: Record<string, number> }>} Cost estimate
 *
 * @example
 * ```typescript
 * const synergyCost = await estimateCostToAchieve(synergyItems, 0.3);
 * console.log(`Total cost to achieve: $${synergyCost.totalCost.toLocaleString()}`);
 * ```
 */
async function estimateCostToAchieve(synergies, baselineMultiplier = 0.3) {
    const costBySynergy = {};
    let totalCost = 0;
    synergies.forEach(syn => {
        // Cost is either explicit implementation cost or estimated as % of annual value
        const cost = syn.implementationCost > 0
            ? syn.implementationCost
            : syn.annualValue * baselineMultiplier;
        costBySynergy[syn.synergyId] = cost;
        totalCost += cost;
    });
    return {
        totalCost,
        costBySynergy,
    };
}
/**
 * Performs sensitivity analysis on deal value.
 *
 * @param {number} baseValue - Base valuation
 * @param {Record<string, number[]>} variables - Variables to test (e.g., {growthRate: [0.02, 0.03, 0.04]})
 * @returns {Promise<SensitivityScenario[]>} Sensitivity scenarios
 *
 * @example
 * ```typescript
 * const sensitivity = await performSensitivityAnalysis(100000000, {
 *   growthRate: [0.02, 0.025, 0.03],
 *   wacc: [0.08, 0.09, 0.10]
 * });
 * ```
 */
async function performSensitivityAnalysis(baseValue, variables) {
    const scenarios = [];
    // Generate scenarios for each variable combination
    const variableNames = Object.keys(variables);
    const variableValues = Object.values(variables);
    // Simple 1-dimensional sensitivity (vary one at a time)
    variableNames.forEach((varName, varIndex) => {
        variableValues[varIndex].forEach(value => {
            // Simple model: value changes proportionally
            const impact = (value - variableValues[varIndex][1]) / variableValues[varIndex][1];
            const resultingValue = baseValue * (1 + impact);
            scenarios.push({
                scenarioName: `${varName} = ${value}`,
                variables: { [varName]: value },
                resultingValue,
                probabilityPercentage: 33, // Equal probability for demonstration
            });
        });
    });
    return scenarios;
}
/**
 * Generates management presentation deck outline.
 *
 * @param {string} dealId - Deal ID
 * @param {string} presentationType - Presentation type (board, investor, employee)
 * @returns {Promise<{ sections: Array<{ title: string; content: string[] }> }>} Deck outline
 *
 * @example
 * ```typescript
 * const deckOutline = await generateManagementPresentation('DEAL-001', 'board');
 * ```
 */
async function generateManagementPresentation(dealId, presentationType) {
    const sections = [];
    if (presentationType === 'board') {
        sections.push({ title: 'Executive Summary', content: ['Strategic rationale', 'Deal structure', 'Valuation summary'] }, { title: 'Strategic Rationale', content: ['Market opportunity', 'Competitive positioning', 'Value creation thesis'] }, { title: 'Valuation Analysis', content: ['DCF valuation', 'Comparable companies', 'Precedent transactions', 'Football field chart'] }, { title: 'Synergies', content: ['Revenue synergies', 'Cost synergies', 'Realization timeline', 'Risk-adjusted NPV'] }, { title: 'Integration Plan', content: ['Key workstreams', 'Day 1 readiness', 'Critical milestones', 'Resource requirements'] }, { title: 'Risks & Mitigations', content: ['Key risks', 'Mitigation strategies', 'Contingency plans'] }, { title: 'Financial Impact', content: ['Accretion/dilution analysis', 'Balance sheet impact', 'Credit metrics'] }, { title: 'Recommendation & Next Steps', content: ['Board recommendation', 'Required approvals', 'Timeline to close'] });
    }
    else if (presentationType === 'investor') {
        sections.push({ title: 'Transaction Overview', content: ['Deal highlights', 'Financial terms', 'Strategic fit'] }, { title: 'Investment Thesis', content: ['Value creation opportunities', 'Market dynamics', 'Competitive advantages'] }, { title: 'Financial Analysis', content: ['Valuation metrics', 'Synergy potential', 'Pro forma financials'] }, { title: 'Integration & Execution', content: ['Integration approach', 'Key milestones', 'Management team'] }, { title: 'Q&A', content: [] });
    }
    else if (presentationType === 'employee') {
        sections.push({ title: 'Why This Deal', content: ['Strategic vision', 'Benefits to employees', 'Cultural fit'] }, { title: 'What It Means For You', content: ['Organizational changes', 'Opportunities', 'Timeline'] }, { title: 'Integration Process', content: ['Key activities', 'Communication plan', 'Support resources'] }, { title: 'Q&A', content: [] });
    }
    else if (presentationType === 'customer') {
        sections.push({ title: 'Transaction Announcement', content: ['Combined company vision', 'Benefits to customers', 'Continuity commitment'] }, { title: 'Enhanced Capabilities', content: ['Expanded offerings', 'Improved service', 'Innovation roadmap'] }, { title: 'Your Experience', content: ['What stays the same', 'What improves', 'Transition timeline'] }, { title: 'Q&A', content: [] });
    }
    return { sections };
}
/**
 * Calculates earnout valuation.
 *
 * @param {number} basePayment - Base payment at closing
 * @param {Array<{ metric: string; target: number; payment: number; probability: number }>} earnoutTerms - Earnout terms
 * @param {number} discountRate - Discount rate
 * @returns {Promise<{ totalExpectedValue: number; earnoutPV: number }>} Earnout valuation
 *
 * @example
 * ```typescript
 * const earnout = await calculateEarnoutValuation(100000000, earnoutTerms, 0.09);
 * console.log(`Total expected value: $${earnout.totalExpectedValue.toLocaleString()}`);
 * ```
 */
async function calculateEarnoutValuation(basePayment, earnoutTerms, discountRate) {
    let earnoutPV = 0;
    earnoutTerms.forEach(term => {
        const expectedPayment = term.payment * term.probability;
        const pv = expectedPayment / Math.pow(1 + discountRate, term.year);
        earnoutPV += pv;
    });
    const totalExpectedValue = basePayment + earnoutPV;
    return {
        totalExpectedValue,
        earnoutPV,
        earnoutComponents: earnoutTerms,
    };
}
/**
 * Assesses target company quality of earnings.
 *
 * @param {number} reportedEarnings - Reported net income
 * @param {Record<string, number>} adjustments - Earnings adjustments
 * @returns {Promise<{ adjustedEarnings: number; qualityScore: number; adjustmentDetails: Record<string, number> }>} QoE assessment
 *
 * @example
 * ```typescript
 * const qoe = await assessQualityOfEarnings(50000000, {
 *   oneTimeGains: -5000000,
 *   nonCashCharges: 2000000,
 *   workingCapitalChanges: -1000000
 * });
 * console.log(`Adjusted earnings: $${qoe.adjustedEarnings.toLocaleString()}`);
 * ```
 */
async function assessQualityOfEarnings(reportedEarnings, adjustments) {
    let adjustedEarnings = reportedEarnings;
    Object.values(adjustments).forEach(adj => {
        adjustedEarnings += adj;
    });
    // Quality score: closer adjusted is to reported, higher the quality
    const adjustmentMagnitude = Math.abs(adjustedEarnings - reportedEarnings);
    const adjustmentPercentage = Math.abs(adjustmentMagnitude / reportedEarnings);
    const qualityScore = Math.max(0, 100 - (adjustmentPercentage * 100));
    return {
        adjustedEarnings,
        qualityScore,
        adjustmentDetails: adjustments,
    };
}
/**
 * Generates integration communication plan.
 *
 * @param {string} dealId - Deal ID
 * @param {string[]} audienceSegments - Audience segments
 * @returns {Promise<Array<{ audience: string; messages: string[]; channels: string[]; frequency: string }>>} Communication plan
 *
 * @example
 * ```typescript
 * const commPlan = await generateIntegrationCommunicationPlan('DEAL-001', ['employees', 'customers', 'investors']);
 * ```
 */
async function generateIntegrationCommunicationPlan(dealId, audienceSegments) {
    const plan = audienceSegments.map(audience => {
        if (audience === 'employees') {
            return {
                audience,
                messages: [
                    'Vision for combined company',
                    'Impact on roles and responsibilities',
                    'Integration timeline',
                    'Support resources available',
                ],
                channels: ['Town halls', 'Email', 'Intranet', 'Manager cascade'],
                frequency: 'Weekly',
                timing: 'Starting Day 1',
            };
        }
        else if (audience === 'customers') {
            return {
                audience,
                messages: [
                    'Continuity of service',
                    'Enhanced capabilities',
                    'Single point of contact',
                    'Transition support',
                ],
                channels: ['Direct outreach', 'Webinars', 'Email', 'Website'],
                frequency: 'Bi-weekly',
                timing: 'Week 1 post-close',
            };
        }
        else if (audience === 'investors') {
            return {
                audience,
                messages: [
                    'Strategic rationale',
                    'Financial impact',
                    'Integration progress',
                    'Synergy realization',
                ],
                channels: ['Earnings calls', 'Investor presentations', 'Press releases', 'SEC filings'],
                frequency: 'Quarterly',
                timing: 'At announcement and quarterly thereafter',
            };
        }
        else if (audience === 'suppliers') {
            return {
                audience,
                messages: [
                    'Continuity of relationship',
                    'Procurement process changes',
                    'Payment terms',
                    'Future opportunities',
                ],
                channels: ['Direct communication', 'Supplier portal', 'Email'],
                frequency: 'Monthly',
                timing: 'Week 2 post-close',
            };
        }
        else {
            return {
                audience,
                messages: [],
                channels: [],
                frequency: '',
                timing: '',
            };
        }
    });
    return plan;
}
/**
 * Calculates working capital adjustment for deal.
 *
 * @param {number} targetWorkingCapital - Target's normalized working capital
 * @param {number} actualWorkingCapital - Actual working capital at closing
 * @param {number} dealValue - Deal value
 * @returns {Promise<{ adjustment: number; adjustedDealValue: number }>} Working capital adjustment
 *
 * @example
 * ```typescript
 * const wcAdjustment = await calculateWorkingCapitalAdjustment(15000000, 12000000, 150000000);
 * console.log(`WC adjustment: $${wcAdjustment.adjustment.toLocaleString()}`);
 * ```
 */
async function calculateWorkingCapitalAdjustment(targetWorkingCapital, actualWorkingCapital, dealValue) {
    const adjustment = actualWorkingCapital - targetWorkingCapital;
    const adjustedDealValue = dealValue + adjustment;
    const adjustmentPercentage = (adjustment / dealValue) * 100;
    return {
        adjustment,
        adjustedDealValue,
        adjustmentPercentage,
    };
}
/**
 * Performs anti-trust analysis for deal.
 *
 * @param {string} dealId - Deal ID
 * @param {number} combinedMarketShare - Combined market share percentage
 * @param {string[]} overlappingProducts - Overlapping product lines
 * @param {string[]} jurisdictions - Relevant jurisdictions
 * @returns {Promise<{ riskLevel: RiskSeverity; requiredFilings: string[]; estimatedTimeframe: number; recommendations: string[] }>} Anti-trust analysis
 *
 * @example
 * ```typescript
 * const antitrustAnalysis = await performAntiTrustAnalysis('DEAL-001', 35, overlappingProducts, ['US', 'EU']);
 * console.log(`Antitrust risk: ${antitrustAnalysis.riskLevel}`);
 * ```
 */
async function performAntiTrustAnalysis(dealId, combinedMarketShare, overlappingProducts, jurisdictions) {
    let riskLevel;
    if (combinedMarketShare >= 40) {
        riskLevel = RiskSeverity.HIGH;
    }
    else if (combinedMarketShare >= 25) {
        riskLevel = RiskSeverity.MEDIUM;
    }
    else {
        riskLevel = RiskSeverity.LOW;
    }
    const requiredFilings = [];
    let estimatedTimeframe = 30; // Base 30 days
    jurisdictions.forEach(jurisdiction => {
        if (jurisdiction === 'US') {
            requiredFilings.push('HSR Filing (Hart-Scott-Rodino)');
            estimatedTimeframe = Math.max(estimatedTimeframe, 90);
        }
        else if (jurisdiction === 'EU') {
            requiredFilings.push('EU Merger Regulation Filing');
            estimatedTimeframe = Math.max(estimatedTimeframe, 90);
        }
        else if (jurisdiction === 'UK') {
            requiredFilings.push('CMA Review');
            estimatedTimeframe = Math.max(estimatedTimeframe, 60);
        }
    });
    const recommendations = [
        'Engage antitrust counsel early',
        'Prepare detailed market share analysis',
        'Identify potential divestitures if needed',
        'Develop regulatory strategy and timeline',
    ];
    if (overlappingProducts.length > 5) {
        recommendations.push('Consider product line divestitures to reduce overlap');
    }
    return {
        riskLevel,
        requiredFilings,
        estimatedTimeframe,
        recommendations,
    };
}
/**
 * Calculates internal rate of return for deal.
 *
 * @param {number} initialInvestment - Initial investment (negative)
 * @param {number[]} cashFlows - Annual cash flows
 * @returns {Promise<{ irr: number; npv: number }>} IRR calculation
 *
 * @example
 * ```typescript
 * const irr = await calculateDealIRR(-150000000, [20000000, 25000000, 30000000, 35000000, 40000000]);
 * console.log(`IRR: ${(irr.irr * 100).toFixed(2)}%`);
 * ```
 */
async function calculateDealIRR(initialInvestment, cashFlows) {
    // Simple IRR approximation using Newton-Raphson method
    let rate = 0.1; // Initial guess
    const tolerance = 0.0001;
    const maxIterations = 100;
    for (let i = 0; i < maxIterations; i++) {
        let npv = initialInvestment;
        let dnpv = 0;
        cashFlows.forEach((cf, year) => {
            const t = year + 1;
            npv += cf / Math.pow(1 + rate, t);
            dnpv -= (t * cf) / Math.pow(1 + rate, t + 1);
        });
        if (Math.abs(npv) < tolerance) {
            break;
        }
        rate = rate - npv / dnpv;
    }
    // Calculate NPV at the found IRR
    let npv = initialInvestment;
    cashFlows.forEach((cf, year) => {
        npv += cf / Math.pow(1 + rate, year + 1);
    });
    return {
        irr: rate,
        npv,
    };
}
/**
 * Generates integration success metrics dashboard.
 *
 * @param {string} dealId - Deal ID
 * @returns {Promise<{ metrics: Array<{ category: string; metric: string; target: number; actual: number; status: string }> }>} Success metrics
 *
 * @example
 * ```typescript
 * const successMetrics = await generateIntegrationSuccessMetrics('DEAL-001');
 * ```
 */
async function generateIntegrationSuccessMetrics(dealId) {
    const metrics = [
        { category: 'Synergies', metric: 'Synergy Capture Rate', target: 80, actual: 65, status: 'on_track', unit: '%' },
        { category: 'People', metric: 'Employee Retention', target: 90, actual: 88, status: 'on_track', unit: '%' },
        { category: 'People', metric: 'Key Talent Retention', target: 95, actual: 92, status: 'at_risk', unit: '%' },
        { category: 'Customers', metric: 'Customer Retention', target: 95, actual: 96, status: 'ahead', unit: '%' },
        { category: 'Customers', metric: 'Cross-sell Success', target: 20, actual: 15, status: 'on_track', unit: '%' },
        { category: 'Operations', metric: 'System Integration', target: 100, actual: 75, status: 'on_track', unit: '%' },
        { category: 'Operations', metric: 'Process Standardization', target: 80, actual: 70, status: 'on_track', unit: '%' },
        { category: 'Financial', metric: 'Revenue Growth', target: 15, actual: 12, status: 'at_risk', unit: '%' },
        { category: 'Financial', metric: 'Cost Reduction', target: 10000000, actual: 8500000, status: 'on_track', unit: '$' },
        { category: 'Culture', metric: 'Employee Engagement', target: 75, actual: 70, status: 'at_risk', unit: 'score' },
    ];
    return { metrics };
}
/**
 * Estimates deal transaction costs.
 *
 * @param {number} dealValue - Deal value
 * @param {DealType} dealType - Deal type
 * @param {boolean} isPublicTarget - Whether target is public company
 * @returns {Promise<{ totalCosts: number; breakdown: Record<string, number> }>} Transaction costs
 *
 * @example
 * ```typescript
 * const txCosts = await estimateTransactionCosts(150000000, DealType.ACQUISITION, true);
 * console.log(`Total transaction costs: $${txCosts.totalCosts.toLocaleString()}`);
 * ```
 */
async function estimateTransactionCosts(dealValue, dealType, isPublicTarget) {
    const breakdown = {};
    // Investment banking fees (1-3% of deal value)
    breakdown.investmentBanking = dealValue * 0.02;
    // Legal fees
    breakdown.legal = isPublicTarget ? dealValue * 0.008 : dealValue * 0.005;
    // Accounting and financial due diligence
    breakdown.accounting = dealValue * 0.003;
    // Consulting fees (integration planning)
    breakdown.consulting = dealValue * 0.002;
    // Regulatory filing fees
    breakdown.regulatory = isPublicTarget ? 500000 : 100000;
    // Financing fees (if debt financing is used)
    breakdown.financing = dealValue * 0.015;
    const totalCosts = Object.values(breakdown).reduce((sum, cost) => sum + cost, 0);
    return {
        totalCosts,
        breakdown,
    };
}
/**
 * Performs goodwill impairment test.
 *
 * @param {number} goodwillAmount - Goodwill on balance sheet
 * @param {number} fairValueOfReportingUnit - Fair value of reporting unit
 * @param {number} carryingValueOfReportingUnit - Carrying value of reporting unit
 * @returns {Promise<{ impairmentCharge: number; revisedGoodwill: number; isPassed: boolean }>} Impairment test
 *
 * @example
 * ```typescript
 * const impairmentTest = await performGoodwillImpairmentTest(50000000, 180000000, 200000000);
 * console.log(`Impairment charge: $${impairmentTest.impairmentCharge.toLocaleString()}`);
 * ```
 */
async function performGoodwillImpairmentTest(goodwillAmount, fairValueOfReportingUnit, carryingValueOfReportingUnit) {
    let impairmentCharge = 0;
    let isPassed = true;
    // Step 1: Compare fair value to carrying value
    if (fairValueOfReportingUnit < carryingValueOfReportingUnit) {
        // Impairment exists
        const deficiency = carryingValueOfReportingUnit - fairValueOfReportingUnit;
        impairmentCharge = Math.min(goodwillAmount, deficiency);
        isPassed = false;
    }
    const revisedGoodwill = goodwillAmount - impairmentCharge;
    return {
        impairmentCharge,
        revisedGoodwill,
        isPassed,
    };
}
/**
 * Generates purchase price allocation.
 *
 * @param {number} purchasePrice - Total purchase price
 * @param {Record<string, number>} fairValues - Fair values of acquired assets
 * @param {number} assumedLiabilities - Assumed liabilities
 * @returns {Promise<{ goodwill: number; allocation: Record<string, number> }>} Purchase price allocation
 *
 * @example
 * ```typescript
 * const ppa = await generatePurchasePriceAllocation(150000000, fairValues, 30000000);
 * console.log(`Goodwill: $${ppa.goodwill.toLocaleString()}`);
 * ```
 */
async function generatePurchasePriceAllocation(purchasePrice, fairValues, assumedLiabilities) {
    const allocation = { ...fairValues };
    const totalIdentifiableAssets = Object.values(fairValues).reduce((sum, val) => sum + val, 0);
    // Goodwill = Purchase Price - (Fair Value of Assets - Assumed Liabilities)
    const goodwill = purchasePrice - (totalIdentifiableAssets - assumedLiabilities);
    allocation.goodwill = goodwill;
    allocation.assumedLiabilities = assumedLiabilities;
    return {
        goodwill,
        allocation,
        totalIdentifiableAssets,
    };
}
/**
 * Calculates customer lifetime value impact from acquisition.
 *
 * @param {number} acquiredCustomers - Number of acquired customers
 * @param {number} averageCustomerValue - Average customer lifetime value
 * @param {number} retentionRate - Expected retention rate
 * @param {number} crossSellUplift - Cross-sell revenue uplift percentage
 * @returns {Promise<{ baseValue: number; enhancedValue: number; valueCreated: number }>} CLV impact
 *
 * @example
 * ```typescript
 * const clvImpact = await calculateCustomerLifetimeValueImpact(10000, 5000, 0.90, 0.20);
 * console.log(`Value created from customer base: $${clvImpact.valueCreated.toLocaleString()}`);
 * ```
 */
async function calculateCustomerLifetimeValueImpact(acquiredCustomers, averageCustomerValue, retentionRate, crossSellUplift) {
    const baseValue = acquiredCustomers * averageCustomerValue * retentionRate;
    const enhancedValue = baseValue * (1 + crossSellUplift);
    const valueCreated = enhancedValue - baseValue;
    return {
        baseValue,
        enhancedValue,
        valueCreated,
    };
}
//# sourceMappingURL=merger-acquisition-kit.js.map