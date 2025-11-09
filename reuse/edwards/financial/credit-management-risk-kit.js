"use strict";
/**
 * LOC: CREDMGMT001
 * File: /reuse/edwards/financial/credit-management-risk-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ./financial-accounts-receivable-kit (AR operations)
 *
 * DOWNSTREAM (imported by):
 *   - Backend credit management modules
 *   - Collections services
 *   - Risk assessment systems
 *   - Customer credit workflows
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
exports.createRiskMitigationActionModel = exports.createCreditInsurancePolicyModel = exports.createAgingAnalysisModel = exports.createDunningHistoryModel = exports.createDunningLevelModel = exports.createCollectionsCaseModel = exports.createCreditRiskAssessmentModel = exports.createCreditReviewModel = exports.createCreditHoldModel = exports.createCreditScoreModel = exports.createCreditScoringModelModel = exports.createCustomerCreditLimitModel = exports.RiskAssessmentRequestDto = exports.CreateCreditReviewDto = exports.AgingAnalysisRequestDto = exports.SendDunningNoticeDto = exports.CreateCollectionsCaseDto = exports.CalculateCreditScoreDto = exports.CreateCreditHoldDto = exports.ApproveCreditLimitDto = exports.CreateCreditLimitDto = void 0;
exports.createCreditLimit = createCreditLimit;
exports.approveCreditLimit = approveCreditLimit;
exports.rejectCreditLimit = rejectCreditLimit;
exports.getCurrentCreditLimit = getCurrentCreditLimit;
exports.getCreditLimitHistory = getCreditLimitHistory;
exports.isOverCreditLimit = isOverCreditLimit;
exports.getPendingCreditLimitApprovals = getPendingCreditLimitApprovals;
exports.calculateCreditUtilization = calculateCreditUtilization;
exports.calculateCreditScore = calculateCreditScore;
exports.pullBureauCreditScore = pullBureauCreditScore;
exports.getLatestCreditScore = getLatestCreditScore;
exports.getCreditScoreHistory = getCreditScoreHistory;
exports.placeCreditHold = placeCreditHold;
exports.releaseCreditHold = releaseCreditHold;
exports.hasActiveCreditHold = hasActiveCreditHold;
exports.getActiveCreditHolds = getActiveCreditHolds;
exports.processAutoReleaseCreditHolds = processAutoReleaseCreditHolds;
exports.createCreditReview = createCreditReview;
exports.completeCreditReview = completeCreditReview;
exports.getPendingCreditReviews = getPendingCreditReviews;
exports.performCreditRiskAssessment = performCreditRiskAssessment;
exports.getLatestRiskAssessment = getLatestRiskAssessment;
exports.createCollectionsCase = createCollectionsCase;
exports.updateCollectionsCaseStatus = updateCollectionsCaseStatus;
exports.closeCollectionsCase = closeCollectionsCase;
exports.getCollectionsWorkload = getCollectionsWorkload;
exports.sendDunningNotice = sendDunningNotice;
exports.getDunningHistory = getDunningHistory;
exports.processAutoDunning = processAutoDunning;
exports.generateAgingAnalysis = generateAgingAnalysis;
exports.getAgingAnalysisSummary = getAgingAnalysisSummary;
exports.getCreditDashboard = getCreditDashboard;
/**
 * File: /reuse/edwards/financial/credit-management-risk-kit.ts
 * Locator: WC-EDWARDS-CREDMGMT-001
 * Purpose: Comprehensive Credit Management & Risk Assessment - Oracle JD Edwards EnterpriseOne-level credit limits, scoring, collections, dunning, risk mitigation
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, financial-accounts-receivable-kit
 * Downstream: ../backend/credit/*, Collections Services, Risk Assessment, Customer Credit Workflows
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 44 functions for credit limits, credit scoring, credit holds, credit reviews, collections, dunning, aging analysis, credit insurance, risk mitigation
 *
 * LLM Context: Enterprise-grade credit management for Oracle JD Edwards EnterpriseOne compliance.
 * Provides comprehensive credit limit management with approval workflows, credit scoring integration
 * with credit bureaus (Experian, Equifax, TransUnion), credit hold automation, periodic credit reviews,
 * collections case management, dunning level progression, AR aging analysis, credit insurance tracking,
 * and risk mitigation strategies. Supports FCRA and FDCPA compliance.
 *
 * Database Schema Design:
 * - customer_credit_limits: Credit limit master with effective dating and approval workflow
 * - credit_scoring_models: Configurable scoring algorithm definitions
 * - credit_scores: Customer credit score history (time series)
 * - credit_holds: Active credit holds with release workflow
 * - credit_reviews: Periodic credit review records and decisions
 * - credit_risk_assessments: Comprehensive risk evaluation results
 * - collections_cases: Collections case management with assignment
 * - dunning_levels: Dunning configuration by level and severity
 * - dunning_history: Customer dunning communications audit trail
 * - aging_analysis: AR aging bucket snapshots for reporting
 * - credit_insurance_policies: Credit insurance coverage tracking
 * - risk_mitigation_actions: Risk mitigation plan execution
 *
 * Indexing Strategy:
 * - Composite indexes: (customer_id, effective_date), (customer_id, score_date)
 * - Partial indexes: WHERE hold_status = 'active', WHERE collections_status IN ('active', 'escalated')
 * - Covering indexes: Collections dashboard with (status, assigned_to, priority)
 * - GIN indexes: JSON metadata for flexible risk factor queries
 * - Expression indexes: UPPER(customer_name) for case-insensitive search
 *
 * Query Optimization:
 * - Materialized views for aging analysis summary (refreshed daily)
 * - Denormalized current credit limit in customer master table
 * - Partitioning aging_analysis by fiscal period for historical data
 * - Batch credit score calculation with parallel processing
 * - Prepared statements for collections workload queries
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// DTO CLASSES
// ============================================================================
let CreateCreditLimitDto = (() => {
    var _a;
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _creditLimit_decorators;
    let _creditLimit_initializers = [];
    let _creditLimit_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _requestedBy_decorators;
    let _requestedBy_initializers = [];
    let _requestedBy_extraInitializers = [];
    let _reviewDate_decorators;
    let _reviewDate_initializers = [];
    let _reviewDate_extraInitializers = [];
    return _a = class CreateCreditLimitDto {
            constructor() {
                this.customerId = __runInitializers(this, _customerId_initializers, void 0);
                this.creditLimit = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _creditLimit_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _creditLimit_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.expirationDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
                this.currency = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                this.requestedBy = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _requestedBy_initializers, void 0));
                this.reviewDate = (__runInitializers(this, _requestedBy_extraInitializers), __runInitializers(this, _reviewDate_initializers, void 0));
                __runInitializers(this, _reviewDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' })];
            _creditLimit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Credit limit amount', example: 50000 })];
            _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date', example: '2024-01-01' })];
            _expirationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expiration date (optional)', required: false })];
            _currency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Currency code', example: 'USD' })];
            _requestedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'User requesting limit' })];
            _reviewDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Next review date', example: '2024-07-01' })];
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _creditLimit_decorators, { kind: "field", name: "creditLimit", static: false, private: false, access: { has: obj => "creditLimit" in obj, get: obj => obj.creditLimit, set: (obj, value) => { obj.creditLimit = value; } }, metadata: _metadata }, _creditLimit_initializers, _creditLimit_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _requestedBy_decorators, { kind: "field", name: "requestedBy", static: false, private: false, access: { has: obj => "requestedBy" in obj, get: obj => obj.requestedBy, set: (obj, value) => { obj.requestedBy = value; } }, metadata: _metadata }, _requestedBy_initializers, _requestedBy_extraInitializers);
            __esDecorate(null, null, _reviewDate_decorators, { kind: "field", name: "reviewDate", static: false, private: false, access: { has: obj => "reviewDate" in obj, get: obj => obj.reviewDate, set: (obj, value) => { obj.reviewDate = value; } }, metadata: _metadata }, _reviewDate_initializers, _reviewDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCreditLimitDto = CreateCreditLimitDto;
let ApproveCreditLimitDto = (() => {
    var _a;
    let _creditLimitId_decorators;
    let _creditLimitId_initializers = [];
    let _creditLimitId_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvalNotes_decorators;
    let _approvalNotes_initializers = [];
    let _approvalNotes_extraInitializers = [];
    return _a = class ApproveCreditLimitDto {
            constructor() {
                this.creditLimitId = __runInitializers(this, _creditLimitId_initializers, void 0);
                this.approvedBy = (__runInitializers(this, _creditLimitId_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
                this.approvalNotes = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvalNotes_initializers, void 0));
                __runInitializers(this, _approvalNotes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _creditLimitId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Credit limit ID' })];
            _approvedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approver user ID' })];
            _approvalNotes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval notes', required: false })];
            __esDecorate(null, null, _creditLimitId_decorators, { kind: "field", name: "creditLimitId", static: false, private: false, access: { has: obj => "creditLimitId" in obj, get: obj => obj.creditLimitId, set: (obj, value) => { obj.creditLimitId = value; } }, metadata: _metadata }, _creditLimitId_initializers, _creditLimitId_extraInitializers);
            __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
            __esDecorate(null, null, _approvalNotes_decorators, { kind: "field", name: "approvalNotes", static: false, private: false, access: { has: obj => "approvalNotes" in obj, get: obj => obj.approvalNotes, set: (obj, value) => { obj.approvalNotes = value; } }, metadata: _metadata }, _approvalNotes_initializers, _approvalNotes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ApproveCreditLimitDto = ApproveCreditLimitDto;
let CreateCreditHoldDto = (() => {
    var _a;
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _holdType_decorators;
    let _holdType_initializers = [];
    let _holdType_extraInitializers = [];
    let _holdReason_decorators;
    let _holdReason_initializers = [];
    let _holdReason_extraInitializers = [];
    let _autoRelease_decorators;
    let _autoRelease_initializers = [];
    let _autoRelease_extraInitializers = [];
    let _releaseConditions_decorators;
    let _releaseConditions_initializers = [];
    let _releaseConditions_extraInitializers = [];
    return _a = class CreateCreditHoldDto {
            constructor() {
                this.customerId = __runInitializers(this, _customerId_initializers, void 0);
                this.holdType = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _holdType_initializers, void 0));
                this.holdReason = (__runInitializers(this, _holdType_extraInitializers), __runInitializers(this, _holdReason_initializers, void 0));
                this.autoRelease = (__runInitializers(this, _holdReason_extraInitializers), __runInitializers(this, _autoRelease_initializers, void 0));
                this.releaseConditions = (__runInitializers(this, _autoRelease_extraInitializers), __runInitializers(this, _releaseConditions_initializers, void 0));
                __runInitializers(this, _releaseConditions_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' })];
            _holdType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Hold type', enum: ['manual', 'auto_overlimit', 'auto_pastdue', 'auto_nsf', 'fraud'] })];
            _holdReason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Hold reason' })];
            _autoRelease_decorators = [(0, swagger_1.ApiProperty)({ description: 'Auto-release enabled', default: false })];
            _releaseConditions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Release conditions (JSON)', required: false })];
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _holdType_decorators, { kind: "field", name: "holdType", static: false, private: false, access: { has: obj => "holdType" in obj, get: obj => obj.holdType, set: (obj, value) => { obj.holdType = value; } }, metadata: _metadata }, _holdType_initializers, _holdType_extraInitializers);
            __esDecorate(null, null, _holdReason_decorators, { kind: "field", name: "holdReason", static: false, private: false, access: { has: obj => "holdReason" in obj, get: obj => obj.holdReason, set: (obj, value) => { obj.holdReason = value; } }, metadata: _metadata }, _holdReason_initializers, _holdReason_extraInitializers);
            __esDecorate(null, null, _autoRelease_decorators, { kind: "field", name: "autoRelease", static: false, private: false, access: { has: obj => "autoRelease" in obj, get: obj => obj.autoRelease, set: (obj, value) => { obj.autoRelease = value; } }, metadata: _metadata }, _autoRelease_initializers, _autoRelease_extraInitializers);
            __esDecorate(null, null, _releaseConditions_decorators, { kind: "field", name: "releaseConditions", static: false, private: false, access: { has: obj => "releaseConditions" in obj, get: obj => obj.releaseConditions, set: (obj, value) => { obj.releaseConditions = value; } }, metadata: _metadata }, _releaseConditions_initializers, _releaseConditions_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCreditHoldDto = CreateCreditHoldDto;
let CalculateCreditScoreDto = (() => {
    var _a;
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _modelId_decorators;
    let _modelId_initializers = [];
    let _modelId_extraInitializers = [];
    let _includeBureau_decorators;
    let _includeBureau_initializers = [];
    let _includeBureau_extraInitializers = [];
    let _bureauSource_decorators;
    let _bureauSource_initializers = [];
    let _bureauSource_extraInitializers = [];
    return _a = class CalculateCreditScoreDto {
            constructor() {
                this.customerId = __runInitializers(this, _customerId_initializers, void 0);
                this.modelId = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _modelId_initializers, void 0));
                this.includeBureau = (__runInitializers(this, _modelId_extraInitializers), __runInitializers(this, _includeBureau_initializers, void 0));
                this.bureauSource = (__runInitializers(this, _includeBureau_extraInitializers), __runInitializers(this, _bureauSource_initializers, void 0));
                __runInitializers(this, _bureauSource_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' })];
            _modelId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scoring model ID' })];
            _includeBureau_decorators = [(0, swagger_1.ApiProperty)({ description: 'Include bureau pull', default: false })];
            _bureauSource_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bureau source', enum: ['experian', 'equifax', 'transunion'], required: false })];
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _modelId_decorators, { kind: "field", name: "modelId", static: false, private: false, access: { has: obj => "modelId" in obj, get: obj => obj.modelId, set: (obj, value) => { obj.modelId = value; } }, metadata: _metadata }, _modelId_initializers, _modelId_extraInitializers);
            __esDecorate(null, null, _includeBureau_decorators, { kind: "field", name: "includeBureau", static: false, private: false, access: { has: obj => "includeBureau" in obj, get: obj => obj.includeBureau, set: (obj, value) => { obj.includeBureau = value; } }, metadata: _metadata }, _includeBureau_initializers, _includeBureau_extraInitializers);
            __esDecorate(null, null, _bureauSource_decorators, { kind: "field", name: "bureauSource", static: false, private: false, access: { has: obj => "bureauSource" in obj, get: obj => obj.bureauSource, set: (obj, value) => { obj.bureauSource = value; } }, metadata: _metadata }, _bureauSource_initializers, _bureauSource_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CalculateCreditScoreDto = CalculateCreditScoreDto;
let CreateCollectionsCaseDto = (() => {
    var _a;
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _caseType_decorators;
    let _caseType_initializers = [];
    let _caseType_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _nextActionDate_decorators;
    let _nextActionDate_initializers = [];
    let _nextActionDate_extraInitializers = [];
    let _nextActionType_decorators;
    let _nextActionType_initializers = [];
    let _nextActionType_extraInitializers = [];
    return _a = class CreateCollectionsCaseDto {
            constructor() {
                this.customerId = __runInitializers(this, _customerId_initializers, void 0);
                this.caseType = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _caseType_initializers, void 0));
                this.priority = (__runInitializers(this, _caseType_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.assignedTo = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
                this.nextActionDate = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _nextActionDate_initializers, void 0));
                this.nextActionType = (__runInitializers(this, _nextActionDate_extraInitializers), __runInitializers(this, _nextActionType_initializers, void 0));
                __runInitializers(this, _nextActionType_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' })];
            _caseType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Case type', enum: ['overdue', 'dispute', 'bankruptcy', 'legal'] })];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority', enum: ['low', 'medium', 'high', 'critical'] })];
            _assignedTo_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assigned to user' })];
            _nextActionDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Next action date' })];
            _nextActionType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Next action type', example: 'Call customer' })];
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _caseType_decorators, { kind: "field", name: "caseType", static: false, private: false, access: { has: obj => "caseType" in obj, get: obj => obj.caseType, set: (obj, value) => { obj.caseType = value; } }, metadata: _metadata }, _caseType_initializers, _caseType_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
            __esDecorate(null, null, _nextActionDate_decorators, { kind: "field", name: "nextActionDate", static: false, private: false, access: { has: obj => "nextActionDate" in obj, get: obj => obj.nextActionDate, set: (obj, value) => { obj.nextActionDate = value; } }, metadata: _metadata }, _nextActionDate_initializers, _nextActionDate_extraInitializers);
            __esDecorate(null, null, _nextActionType_decorators, { kind: "field", name: "nextActionType", static: false, private: false, access: { has: obj => "nextActionType" in obj, get: obj => obj.nextActionType, set: (obj, value) => { obj.nextActionType = value; } }, metadata: _metadata }, _nextActionType_initializers, _nextActionType_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCollectionsCaseDto = CreateCollectionsCaseDto;
let SendDunningNoticeDto = (() => {
    var _a;
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _dunningLevel_decorators;
    let _dunningLevel_initializers = [];
    let _dunningLevel_extraInitializers = [];
    let _invoiceNumbers_decorators;
    let _invoiceNumbers_initializers = [];
    let _invoiceNumbers_extraInitializers = [];
    let _deliveryMethod_decorators;
    let _deliveryMethod_initializers = [];
    let _deliveryMethod_extraInitializers = [];
    let _overrideMessage_decorators;
    let _overrideMessage_initializers = [];
    let _overrideMessage_extraInitializers = [];
    return _a = class SendDunningNoticeDto {
            constructor() {
                this.customerId = __runInitializers(this, _customerId_initializers, void 0);
                this.dunningLevel = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _dunningLevel_initializers, void 0));
                this.invoiceNumbers = (__runInitializers(this, _dunningLevel_extraInitializers), __runInitializers(this, _invoiceNumbers_initializers, void 0));
                this.deliveryMethod = (__runInitializers(this, _invoiceNumbers_extraInitializers), __runInitializers(this, _deliveryMethod_initializers, void 0));
                this.overrideMessage = (__runInitializers(this, _deliveryMethod_extraInitializers), __runInitializers(this, _overrideMessage_initializers, void 0));
                __runInitializers(this, _overrideMessage_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' })];
            _dunningLevel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Dunning level number' })];
            _invoiceNumbers_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice numbers', type: [String] })];
            _deliveryMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Delivery method', enum: ['email', 'mail', 'phone', 'sms'] })];
            _overrideMessage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Override message (optional)', required: false })];
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _dunningLevel_decorators, { kind: "field", name: "dunningLevel", static: false, private: false, access: { has: obj => "dunningLevel" in obj, get: obj => obj.dunningLevel, set: (obj, value) => { obj.dunningLevel = value; } }, metadata: _metadata }, _dunningLevel_initializers, _dunningLevel_extraInitializers);
            __esDecorate(null, null, _invoiceNumbers_decorators, { kind: "field", name: "invoiceNumbers", static: false, private: false, access: { has: obj => "invoiceNumbers" in obj, get: obj => obj.invoiceNumbers, set: (obj, value) => { obj.invoiceNumbers = value; } }, metadata: _metadata }, _invoiceNumbers_initializers, _invoiceNumbers_extraInitializers);
            __esDecorate(null, null, _deliveryMethod_decorators, { kind: "field", name: "deliveryMethod", static: false, private: false, access: { has: obj => "deliveryMethod" in obj, get: obj => obj.deliveryMethod, set: (obj, value) => { obj.deliveryMethod = value; } }, metadata: _metadata }, _deliveryMethod_initializers, _deliveryMethod_extraInitializers);
            __esDecorate(null, null, _overrideMessage_decorators, { kind: "field", name: "overrideMessage", static: false, private: false, access: { has: obj => "overrideMessage" in obj, get: obj => obj.overrideMessage, set: (obj, value) => { obj.overrideMessage = value; } }, metadata: _metadata }, _overrideMessage_initializers, _overrideMessage_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SendDunningNoticeDto = SendDunningNoticeDto;
let AgingAnalysisRequestDto = (() => {
    var _a;
    let _asOfDate_decorators;
    let _asOfDate_initializers = [];
    let _asOfDate_extraInitializers = [];
    let _customerIds_decorators;
    let _customerIds_initializers = [];
    let _customerIds_extraInitializers = [];
    let _agingBucket_decorators;
    let _agingBucket_initializers = [];
    let _agingBucket_extraInitializers = [];
    let _minAmount_decorators;
    let _minAmount_initializers = [];
    let _minAmount_extraInitializers = [];
    return _a = class AgingAnalysisRequestDto {
            constructor() {
                this.asOfDate = __runInitializers(this, _asOfDate_initializers, void 0);
                this.customerIds = (__runInitializers(this, _asOfDate_extraInitializers), __runInitializers(this, _customerIds_initializers, void 0));
                this.agingBucket = (__runInitializers(this, _customerIds_extraInitializers), __runInitializers(this, _agingBucket_initializers, void 0));
                this.minAmount = (__runInitializers(this, _agingBucket_extraInitializers), __runInitializers(this, _minAmount_initializers, void 0));
                __runInitializers(this, _minAmount_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _asOfDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'As of date', example: '2024-01-31' })];
            _customerIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer IDs (optional - all if not provided)', required: false })];
            _agingBucket_decorators = [(0, swagger_1.ApiProperty)({ description: 'Aging bucket filter', required: false })];
            _minAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Minimum amount threshold', required: false })];
            __esDecorate(null, null, _asOfDate_decorators, { kind: "field", name: "asOfDate", static: false, private: false, access: { has: obj => "asOfDate" in obj, get: obj => obj.asOfDate, set: (obj, value) => { obj.asOfDate = value; } }, metadata: _metadata }, _asOfDate_initializers, _asOfDate_extraInitializers);
            __esDecorate(null, null, _customerIds_decorators, { kind: "field", name: "customerIds", static: false, private: false, access: { has: obj => "customerIds" in obj, get: obj => obj.customerIds, set: (obj, value) => { obj.customerIds = value; } }, metadata: _metadata }, _customerIds_initializers, _customerIds_extraInitializers);
            __esDecorate(null, null, _agingBucket_decorators, { kind: "field", name: "agingBucket", static: false, private: false, access: { has: obj => "agingBucket" in obj, get: obj => obj.agingBucket, set: (obj, value) => { obj.agingBucket = value; } }, metadata: _metadata }, _agingBucket_initializers, _agingBucket_extraInitializers);
            __esDecorate(null, null, _minAmount_decorators, { kind: "field", name: "minAmount", static: false, private: false, access: { has: obj => "minAmount" in obj, get: obj => obj.minAmount, set: (obj, value) => { obj.minAmount = value; } }, metadata: _metadata }, _minAmount_initializers, _minAmount_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AgingAnalysisRequestDto = AgingAnalysisRequestDto;
let CreateCreditReviewDto = (() => {
    var _a;
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _reviewType_decorators;
    let _reviewType_initializers = [];
    let _reviewType_extraInitializers = [];
    let _reviewDate_decorators;
    let _reviewDate_initializers = [];
    let _reviewDate_extraInitializers = [];
    let _reviewedBy_decorators;
    let _reviewedBy_initializers = [];
    let _reviewedBy_extraInitializers = [];
    return _a = class CreateCreditReviewDto {
            constructor() {
                this.customerId = __runInitializers(this, _customerId_initializers, void 0);
                this.reviewType = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _reviewType_initializers, void 0));
                this.reviewDate = (__runInitializers(this, _reviewType_extraInitializers), __runInitializers(this, _reviewDate_initializers, void 0));
                this.reviewedBy = (__runInitializers(this, _reviewDate_extraInitializers), __runInitializers(this, _reviewedBy_initializers, void 0));
                __runInitializers(this, _reviewedBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' })];
            _reviewType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Review type', enum: ['periodic', 'triggered', 'ad_hoc'] })];
            _reviewDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Review date', example: '2024-01-15' })];
            _reviewedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reviewer user ID' })];
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _reviewType_decorators, { kind: "field", name: "reviewType", static: false, private: false, access: { has: obj => "reviewType" in obj, get: obj => obj.reviewType, set: (obj, value) => { obj.reviewType = value; } }, metadata: _metadata }, _reviewType_initializers, _reviewType_extraInitializers);
            __esDecorate(null, null, _reviewDate_decorators, { kind: "field", name: "reviewDate", static: false, private: false, access: { has: obj => "reviewDate" in obj, get: obj => obj.reviewDate, set: (obj, value) => { obj.reviewDate = value; } }, metadata: _metadata }, _reviewDate_initializers, _reviewDate_extraInitializers);
            __esDecorate(null, null, _reviewedBy_decorators, { kind: "field", name: "reviewedBy", static: false, private: false, access: { has: obj => "reviewedBy" in obj, get: obj => obj.reviewedBy, set: (obj, value) => { obj.reviewedBy = value; } }, metadata: _metadata }, _reviewedBy_initializers, _reviewedBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCreditReviewDto = CreateCreditReviewDto;
let RiskAssessmentRequestDto = (() => {
    var _a;
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _assessmentType_decorators;
    let _assessmentType_initializers = [];
    let _assessmentType_extraInitializers = [];
    let _includeFinancialAnalysis_decorators;
    let _includeFinancialAnalysis_initializers = [];
    let _includeFinancialAnalysis_extraInitializers = [];
    return _a = class RiskAssessmentRequestDto {
            constructor() {
                this.customerId = __runInitializers(this, _customerId_initializers, void 0);
                this.assessmentType = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _assessmentType_initializers, void 0));
                this.includeFinancialAnalysis = (__runInitializers(this, _assessmentType_extraInitializers), __runInitializers(this, _includeFinancialAnalysis_initializers, void 0));
                __runInitializers(this, _includeFinancialAnalysis_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' })];
            _assessmentType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assessment type', enum: ['initial', 'periodic', 'triggered'] })];
            _includeFinancialAnalysis_decorators = [(0, swagger_1.ApiProperty)({ description: 'Include financial analysis', default: true })];
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _assessmentType_decorators, { kind: "field", name: "assessmentType", static: false, private: false, access: { has: obj => "assessmentType" in obj, get: obj => obj.assessmentType, set: (obj, value) => { obj.assessmentType = value; } }, metadata: _metadata }, _assessmentType_initializers, _assessmentType_extraInitializers);
            __esDecorate(null, null, _includeFinancialAnalysis_decorators, { kind: "field", name: "includeFinancialAnalysis", static: false, private: false, access: { has: obj => "includeFinancialAnalysis" in obj, get: obj => obj.includeFinancialAnalysis, set: (obj, value) => { obj.includeFinancialAnalysis = value; } }, metadata: _metadata }, _includeFinancialAnalysis_initializers, _includeFinancialAnalysis_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RiskAssessmentRequestDto = RiskAssessmentRequestDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Customer Credit Limits with approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CustomerCreditLimit model
 *
 * @example
 * ```typescript
 * const CreditLimit = createCustomerCreditLimitModel(sequelize);
 * const limit = await CreditLimit.create({
 *   customerId: 12345,
 *   customerName: 'Acme Corp',
 *   creditLimit: 100000,
 *   effectiveDate: new Date(),
 *   currency: 'USD',
 *   requestedBy: 'user123'
 * });
 * ```
 */
const createCustomerCreditLimitModel = (sequelize) => {
    class CustomerCreditLimit extends sequelize_1.Model {
    }
    CustomerCreditLimit.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        customerId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Customer foreign key',
        },
        customerName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Customer name (denormalized)',
        },
        creditLimit: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Credit limit amount',
            validate: {
                min: 0,
            },
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Effective start date',
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Expiration date (null = indefinite)',
        },
        previousLimit: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Previous credit limit',
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'USD',
            comment: 'Currency code',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'expired', 'pending', 'rejected'),
            allowNull: false,
            defaultValue: 'pending',
            comment: 'Credit limit status',
        },
        requestedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who requested limit',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who approved limit',
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Approval timestamp',
        },
        rejectionReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Rejection reason if rejected',
        },
        reviewDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Next review date',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: 'customer_credit_limits',
        indexes: [
            {
                fields: ['customer_id', 'effective_date'],
                name: 'idx_customer_credit_limits_customer_date',
            },
            {
                fields: ['status'],
                name: 'idx_customer_credit_limits_status',
            },
            {
                fields: ['review_date'],
                name: 'idx_customer_credit_limits_review',
            },
            {
                fields: ['customer_id', 'status'],
                where: { status: 'active' },
                name: 'idx_customer_credit_limits_active',
            },
        ],
    });
    return CustomerCreditLimit;
};
exports.createCustomerCreditLimitModel = createCustomerCreditLimitModel;
/**
 * Sequelize model for Credit Scoring Models.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CreditScoringModel model
 */
const createCreditScoringModelModel = (sequelize) => {
    class CreditScoringModel extends sequelize_1.Model {
    }
    CreditScoringModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        modelName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Model descriptive name',
        },
        modelVersion: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            comment: 'Model version',
        },
        modelType: {
            type: sequelize_1.DataTypes.ENUM('internal', 'bureau', 'hybrid'),
            allowNull: false,
            comment: 'Scoring model type',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Model active status',
        },
        scoringFactors: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Scoring factor definitions',
        },
        weightings: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Factor weightings',
        },
        scoreMin: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 300,
            comment: 'Minimum score',
        },
        scoreMax: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 850,
            comment: 'Maximum score',
        },
        riskThresholds: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Risk level thresholds',
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Model effective date',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: 'credit_scoring_models',
        indexes: [
            {
                fields: ['is_active', 'effective_date'],
                name: 'idx_credit_scoring_models_active',
            },
            {
                fields: ['model_type'],
                name: 'idx_credit_scoring_models_type',
            },
        ],
    });
    return CreditScoringModel;
};
exports.createCreditScoringModelModel = createCreditScoringModelModel;
/**
 * Sequelize model for Credit Scores (time series).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CreditScore model
 */
const createCreditScoreModel = (sequelize) => {
    class CreditScore extends sequelize_1.Model {
    }
    CreditScore.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        customerId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Customer foreign key',
        },
        scoreDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Score calculation date',
        },
        scoreValue: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Credit score value',
            validate: {
                min: 300,
                max: 850,
            },
        },
        scoreModel: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Scoring model used',
        },
        scoreSource: {
            type: sequelize_1.DataTypes.ENUM('experian', 'equifax', 'transunion', 'internal'),
            allowNull: false,
            comment: 'Score data source',
        },
        riskLevel: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            allowNull: false,
            comment: 'Risk classification',
        },
        scoreFactors: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Scoring factor breakdown',
        },
        bureauResponse: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Bureau API response',
        },
        calculatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User or system who calculated',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: 'credit_scores',
        updatedAt: false,
        indexes: [
            {
                fields: ['customer_id', 'score_date'],
                name: 'idx_credit_scores_customer_date',
            },
            {
                fields: ['risk_level'],
                name: 'idx_credit_scores_risk',
            },
            {
                fields: ['score_source'],
                name: 'idx_credit_scores_source',
            },
        ],
    });
    return CreditScore;
};
exports.createCreditScoreModel = createCreditScoreModel;
/**
 * Sequelize model for Credit Holds.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CreditHold model
 */
const createCreditHoldModel = (sequelize) => {
    class CreditHold extends sequelize_1.Model {
    }
    CreditHold.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        customerId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Customer foreign key',
        },
        customerName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Customer name (denormalized)',
        },
        holdType: {
            type: sequelize_1.DataTypes.ENUM('manual', 'auto_overlimit', 'auto_pastdue', 'auto_nsf', 'fraud'),
            allowNull: false,
            comment: 'Hold type',
        },
        holdReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Hold reason',
        },
        holdDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Hold placed date',
        },
        holdStatus: {
            type: sequelize_1.DataTypes.ENUM('active', 'released', 'expired'),
            allowNull: false,
            defaultValue: 'active',
            comment: 'Hold status',
        },
        releasedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Hold released date',
        },
        releasedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who released hold',
        },
        releaseReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Release reason',
        },
        impactedOrders: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER),
            allowNull: false,
            defaultValue: [],
            comment: 'Impacted order IDs',
        },
        autoRelease: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Auto-release when conditions met',
        },
        releaseConditions: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Auto-release conditions',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: 'credit_holds',
        indexes: [
            {
                fields: ['customer_id', 'hold_status'],
                name: 'idx_credit_holds_customer_status',
            },
            {
                fields: ['hold_status', 'hold_date'],
                where: { hold_status: 'active' },
                name: 'idx_credit_holds_active',
            },
            {
                fields: ['hold_type'],
                name: 'idx_credit_holds_type',
            },
        ],
    });
    return CreditHold;
};
exports.createCreditHoldModel = createCreditHoldModel;
/**
 * Sequelize model for Credit Reviews.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CreditReview model
 */
const createCreditReviewModel = (sequelize) => {
    class CreditReview extends sequelize_1.Model {
    }
    CreditReview.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        customerId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Customer foreign key',
        },
        reviewDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Review date',
        },
        reviewType: {
            type: sequelize_1.DataTypes.ENUM('periodic', 'triggered', 'ad_hoc'),
            allowNull: false,
            comment: 'Review type',
        },
        reviewStatus: {
            type: sequelize_1.DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'cancelled'),
            allowNull: false,
            defaultValue: 'scheduled',
            comment: 'Review status',
        },
        currentCreditLimit: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Current credit limit',
        },
        recommendedLimit: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Recommended credit limit',
        },
        currentRiskLevel: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            comment: 'Current risk level',
        },
        assessedRiskLevel: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            comment: 'Assessed risk level',
        },
        reviewNotes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Review notes',
        },
        reviewedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Reviewer',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Approver',
        },
        completedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Completion timestamp',
        },
        nextReviewDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Next review date',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: 'credit_reviews',
        indexes: [
            {
                fields: ['customer_id', 'review_date'],
                name: 'idx_credit_reviews_customer_date',
            },
            {
                fields: ['review_status'],
                name: 'idx_credit_reviews_status',
            },
            {
                fields: ['next_review_date'],
                name: 'idx_credit_reviews_next',
            },
        ],
    });
    return CreditReview;
};
exports.createCreditReviewModel = createCreditReviewModel;
/**
 * Sequelize model for Credit Risk Assessments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CreditRiskAssessment model
 */
const createCreditRiskAssessmentModel = (sequelize) => {
    class CreditRiskAssessment extends sequelize_1.Model {
    }
    CreditRiskAssessment.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        customerId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Customer foreign key',
        },
        assessmentDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Assessment date',
        },
        assessmentType: {
            type: sequelize_1.DataTypes.ENUM('initial', 'periodic', 'triggered'),
            allowNull: false,
            comment: 'Assessment type',
        },
        riskScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Risk score (0-100)',
            validate: {
                min: 0,
                max: 100,
            },
        },
        riskLevel: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            allowNull: false,
            comment: 'Risk classification',
        },
        financialRatios: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Financial ratio analysis',
        },
        paymentHistory: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Payment history metrics',
        },
        exposureAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Total exposure amount',
        },
        daysPayableOutstanding: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'Average days payable outstanding',
        },
        delinquencyRate: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Delinquency rate percentage',
        },
        riskFactors: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            defaultValue: [],
            comment: 'Identified risk factors',
        },
        mitigationRecommendations: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            defaultValue: [],
            comment: 'Mitigation recommendations',
        },
        assessedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Assessor',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: 'credit_risk_assessments',
        updatedAt: false,
        indexes: [
            {
                fields: ['customer_id', 'assessment_date'],
                name: 'idx_credit_risk_assessments_customer_date',
            },
            {
                fields: ['risk_level'],
                name: 'idx_credit_risk_assessments_risk',
            },
            {
                fields: ['assessment_type'],
                name: 'idx_credit_risk_assessments_type',
            },
        ],
    });
    return CreditRiskAssessment;
};
exports.createCreditRiskAssessmentModel = createCreditRiskAssessmentModel;
/**
 * Sequelize model for Collections Cases.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CollectionsCase model
 */
const createCollectionsCaseModel = (sequelize) => {
    class CollectionsCase extends sequelize_1.Model {
    }
    CollectionsCase.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        customerId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Customer foreign key',
        },
        customerName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Customer name (denormalized)',
        },
        caseNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique case number',
        },
        caseType: {
            type: sequelize_1.DataTypes.ENUM('overdue', 'dispute', 'bankruptcy', 'legal'),
            allowNull: false,
            comment: 'Case type',
        },
        caseStatus: {
            type: sequelize_1.DataTypes.ENUM('new', 'active', 'escalated', 'resolved', 'written_off'),
            allowNull: false,
            defaultValue: 'new',
            comment: 'Case status',
        },
        priority: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            allowNull: false,
            comment: 'Case priority',
        },
        totalOutstanding: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Total outstanding amount',
        },
        oldestInvoiceDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Oldest invoice date',
        },
        daysOutstanding: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Days outstanding',
        },
        assignedTo: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Assigned collections agent',
        },
        openedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Case opened date',
        },
        closedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Case closed date',
        },
        resolutionType: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Resolution type',
        },
        resolutionNotes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Resolution notes',
        },
        nextActionDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Next scheduled action',
        },
        nextActionType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Next action type',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: 'collections_cases',
        indexes: [
            {
                unique: true,
                fields: ['case_number'],
                name: 'idx_collections_cases_unique',
            },
            {
                fields: ['customer_id', 'case_status'],
                name: 'idx_collections_cases_customer_status',
            },
            {
                fields: ['case_status', 'assigned_to', 'priority'],
                where: { case_status: { [sequelize_1.Op.in]: ['active', 'escalated'] } },
                name: 'idx_collections_cases_workload',
            },
            {
                fields: ['next_action_date'],
                name: 'idx_collections_cases_next_action',
            },
        ],
    });
    return CollectionsCase;
};
exports.createCollectionsCaseModel = createCollectionsCaseModel;
/**
 * Sequelize model for Dunning Levels configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DunningLevel model
 */
const createDunningLevelModel = (sequelize) => {
    class DunningLevel extends sequelize_1.Model {
    }
    DunningLevel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        levelNumber: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            comment: 'Dunning level number',
        },
        levelName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Level name',
        },
        daysOverdue: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Days overdue trigger',
        },
        severity: {
            type: sequelize_1.DataTypes.ENUM('reminder', 'warning', 'urgent', 'final', 'legal'),
            allowNull: false,
            comment: 'Severity level',
        },
        messageTemplate: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Message template',
        },
        deliveryMethods: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: ['email'],
            comment: 'Delivery methods',
        },
        escalationRules: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Escalation rules',
        },
        autoHold: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Auto credit hold',
        },
        autoEscalate: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Auto-escalate to next level',
        },
        escalationDays: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 7,
            comment: 'Days before escalation',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Level active status',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: 'dunning_levels',
        indexes: [
            {
                unique: true,
                fields: ['level_number'],
                name: 'idx_dunning_levels_unique',
            },
            {
                fields: ['is_active', 'days_overdue'],
                name: 'idx_dunning_levels_active',
            },
        ],
    });
    return DunningLevel;
};
exports.createDunningLevelModel = createDunningLevelModel;
/**
 * Sequelize model for Dunning History (audit trail).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DunningHistory model
 */
const createDunningHistoryModel = (sequelize) => {
    class DunningHistory extends sequelize_1.Model {
    }
    DunningHistory.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        customerId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Customer foreign key',
        },
        caseId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Collections case foreign key',
        },
        dunningLevel: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Dunning level number',
        },
        dunningDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Dunning sent date',
        },
        invoiceNumbers: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            comment: 'Affected invoice numbers',
        },
        totalAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Total amount owed',
        },
        daysOverdue: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Days overdue',
        },
        messageSubject: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Message subject',
        },
        messageBody: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Message body',
        },
        deliveryMethod: {
            type: sequelize_1.DataTypes.ENUM('email', 'mail', 'phone', 'sms'),
            allowNull: false,
            comment: 'Delivery method',
        },
        deliveryStatus: {
            type: sequelize_1.DataTypes.ENUM('sent', 'delivered', 'failed', 'bounced'),
            allowNull: false,
            defaultValue: 'sent',
            comment: 'Delivery status',
        },
        sentBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who sent notice',
        },
        responseReceived: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Customer responded',
        },
        responseDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Response date',
        },
        responseNotes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Response notes',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: 'dunning_history',
        updatedAt: false,
        indexes: [
            {
                fields: ['customer_id', 'dunning_date'],
                name: 'idx_dunning_history_customer_date',
            },
            {
                fields: ['case_id'],
                name: 'idx_dunning_history_case',
            },
            {
                fields: ['dunning_level'],
                name: 'idx_dunning_history_level',
            },
            {
                fields: ['delivery_status'],
                name: 'idx_dunning_history_delivery',
            },
        ],
    });
    return DunningHistory;
};
exports.createDunningHistoryModel = createDunningHistoryModel;
/**
 * Sequelize model for Aging Analysis snapshots.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AgingAnalysis model
 */
const createAgingAnalysisModel = (sequelize) => {
    class AgingAnalysis extends sequelize_1.Model {
    }
    AgingAnalysis.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        analysisDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Analysis snapshot date',
        },
        customerId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Customer foreign key',
        },
        customerName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Customer name (denormalized)',
        },
        totalOutstanding: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Total outstanding',
        },
        current: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Current (not due)',
        },
        days1to30: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: '1-30 days overdue',
        },
        days31to60: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: '31-60 days overdue',
        },
        days61to90: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: '61-90 days overdue',
        },
        days91to120: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: '91-120 days overdue',
        },
        over120: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Over 120 days',
        },
        creditLimit: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Credit limit',
        },
        creditAvailable: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Available credit',
        },
        riskLevel: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            comment: 'Risk level',
        },
        agingBucket: {
            type: sequelize_1.DataTypes.ENUM('current', '1-30', '31-60', '61-90', '91-120', '120+'),
            allowNull: false,
            comment: 'Primary aging bucket',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: 'aging_analysis',
        updatedAt: false,
        indexes: [
            {
                fields: ['analysis_date', 'customer_id'],
                name: 'idx_aging_analysis_date_customer',
            },
            {
                fields: ['aging_bucket'],
                name: 'idx_aging_analysis_bucket',
            },
            {
                fields: ['risk_level'],
                name: 'idx_aging_analysis_risk',
            },
        ],
    });
    return AgingAnalysis;
};
exports.createAgingAnalysisModel = createAgingAnalysisModel;
/**
 * Sequelize model for Credit Insurance Policies.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CreditInsurancePolicy model
 */
const createCreditInsurancePolicyModel = (sequelize) => {
    class CreditInsurancePolicy extends sequelize_1.Model {
    }
    CreditInsurancePolicy.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        customerId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Customer foreign key',
        },
        policyNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Policy number',
        },
        insuranceProvider: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Insurance provider',
        },
        coverageAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Coverage amount',
        },
        deductible: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Deductible amount',
        },
        premiumRate: {
            type: sequelize_1.DataTypes.DECIMAL(5, 4),
            allowNull: false,
            comment: 'Premium rate percentage',
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Policy effective date',
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Policy expiration date',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'expired', 'cancelled'),
            allowNull: false,
            defaultValue: 'active',
            comment: 'Policy status',
        },
        claimHistory: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Claim history',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: 'credit_insurance_policies',
        indexes: [
            {
                unique: true,
                fields: ['policy_number'],
                name: 'idx_credit_insurance_policies_unique',
            },
            {
                fields: ['customer_id', 'status'],
                name: 'idx_credit_insurance_policies_customer',
            },
            {
                fields: ['expiration_date'],
                name: 'idx_credit_insurance_policies_expiration',
            },
        ],
    });
    return CreditInsurancePolicy;
};
exports.createCreditInsurancePolicyModel = createCreditInsurancePolicyModel;
/**
 * Sequelize model for Risk Mitigation Actions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RiskMitigationAction model
 */
const createRiskMitigationActionModel = (sequelize) => {
    class RiskMitigationAction extends sequelize_1.Model {
    }
    RiskMitigationAction.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        customerId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Customer foreign key',
        },
        assessmentId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Risk assessment foreign key',
        },
        actionType: {
            type: sequelize_1.DataTypes.ENUM('reduce_limit', 'require_prepayment', 'shorten_terms', 'increase_insurance', 'legal_action'),
            allowNull: false,
            comment: 'Action type',
        },
        actionDescription: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Action description',
        },
        actionDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Action date',
        },
        actionStatus: {
            type: sequelize_1.DataTypes.ENUM('planned', 'in_progress', 'completed', 'cancelled'),
            allowNull: false,
            defaultValue: 'planned',
            comment: 'Action status',
        },
        completedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Completion date',
        },
        expectedImpact: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Expected impact',
        },
        actualImpact: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Actual impact',
        },
        implementedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Implementer',
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Notes',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: 'risk_mitigation_actions',
        indexes: [
            {
                fields: ['customer_id', 'action_status'],
                name: 'idx_risk_mitigation_actions_customer',
            },
            {
                fields: ['assessment_id'],
                name: 'idx_risk_mitigation_actions_assessment',
            },
            {
                fields: ['action_type'],
                name: 'idx_risk_mitigation_actions_type',
            },
        ],
    });
    return RiskMitigationAction;
};
exports.createRiskMitigationActionModel = createRiskMitigationActionModel;
// ============================================================================
// CREDIT LIMIT MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Create new credit limit request (pending approval).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateCreditLimitDto} limitData - Credit limit data
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<CustomerCreditLimit>} Created credit limit
 *
 * @example
 * ```typescript
 * const limit = await createCreditLimit(sequelize, {
 *   customerId: 12345,
 *   creditLimit: 100000,
 *   effectiveDate: new Date('2024-01-01'),
 *   currency: 'USD',
 *   requestedBy: 'user123',
 *   reviewDate: new Date('2024-07-01')
 * });
 * ```
 */
async function createCreditLimit(sequelize, limitData, transaction) {
    const CustomerCreditLimit = (0, exports.createCustomerCreditLimitModel)(sequelize);
    // Get previous limit
    const previousLimit = await getCurrentCreditLimit(sequelize, limitData.customerId);
    const limit = await CustomerCreditLimit.create({
        ...limitData,
        customerName: '', // Would fetch from customer table
        previousLimit: previousLimit?.creditLimit || 0,
        status: 'pending',
        approvedBy: null,
        approvedAt: null,
        rejectionReason: null,
        metadata: {},
    }, { transaction });
    return limit.toJSON();
}
/**
 * Approve credit limit and activate.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ApproveCreditLimitDto} approvalData - Approval data
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
async function approveCreditLimit(sequelize, approvalData, transaction) {
    const CustomerCreditLimit = (0, exports.createCustomerCreditLimitModel)(sequelize);
    await CustomerCreditLimit.update({
        status: 'active',
        approvedBy: approvalData.approvedBy,
        approvedAt: new Date(),
    }, {
        where: { id: approvalData.creditLimitId },
        transaction,
    });
}
/**
 * Reject credit limit request.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} creditLimitId - Credit limit ID
 * @param {string} rejectionReason - Rejection reason
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
async function rejectCreditLimit(sequelize, creditLimitId, rejectionReason, transaction) {
    const CustomerCreditLimit = (0, exports.createCustomerCreditLimitModel)(sequelize);
    await CustomerCreditLimit.update({
        status: 'rejected',
        rejectionReason,
    }, {
        where: { id: creditLimitId },
        transaction,
    });
}
/**
 * Get current active credit limit for customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @returns {Promise<CustomerCreditLimit | null>} Active credit limit
 */
async function getCurrentCreditLimit(sequelize, customerId) {
    const CustomerCreditLimit = (0, exports.createCustomerCreditLimitModel)(sequelize);
    const limit = await CustomerCreditLimit.findOne({
        where: {
            customerId,
            status: 'active',
            effectiveDate: { [sequelize_1.Op.lte]: new Date() },
            [sequelize_1.Op.or]: [
                { expirationDate: null },
                { expirationDate: { [sequelize_1.Op.gte]: new Date() } },
            ],
        },
        order: [['effectiveDate', 'DESC']],
    });
    return limit ? limit.toJSON() : null;
}
/**
 * Get credit limit history for customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @returns {Promise<CustomerCreditLimit[]>} Credit limit history
 */
async function getCreditLimitHistory(sequelize, customerId) {
    const CustomerCreditLimit = (0, exports.createCustomerCreditLimitModel)(sequelize);
    const limits = await CustomerCreditLimit.findAll({
        where: { customerId },
        order: [['effectiveDate', 'DESC']],
    });
    return limits.map(l => l.toJSON());
}
/**
 * Check if customer exceeds credit limit.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {number} currentBalance - Current AR balance
 * @returns {Promise<boolean>} True if over limit
 */
async function isOverCreditLimit(sequelize, customerId, currentBalance) {
    const currentLimit = await getCurrentCreditLimit(sequelize, customerId);
    if (!currentLimit) {
        return true; // No limit = over limit
    }
    return currentBalance > currentLimit.creditLimit;
}
/**
 * Get pending credit limit approvals.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<CustomerCreditLimit[]>} Pending approvals
 */
async function getPendingCreditLimitApprovals(sequelize) {
    const CustomerCreditLimit = (0, exports.createCustomerCreditLimitModel)(sequelize);
    const pending = await CustomerCreditLimit.findAll({
        where: { status: 'pending' },
        order: [['createdAt', 'ASC']],
    });
    return pending.map(l => l.toJSON());
}
/**
 * Calculate credit utilization percentage.
 *
 * @param {number} creditLimit - Credit limit
 * @param {number} currentBalance - Current balance
 * @returns {number} Utilization percentage (0-100)
 */
function calculateCreditUtilization(creditLimit, currentBalance) {
    if (creditLimit === 0)
        return 100;
    return Math.min((currentBalance / creditLimit) * 100, 100);
}
// ============================================================================
// CREDIT SCORING FUNCTIONS
// ============================================================================
/**
 * Calculate internal credit score for customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CalculateCreditScoreDto} request - Scoring request
 * @param {string} userId - User calculating score
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<CreditScore>} Calculated credit score
 *
 * @description
 * Calculates credit score using configured scoring model.
 * Factors: payment history, credit utilization, account age, delinquency rate.
 */
async function calculateCreditScore(sequelize, request, userId, transaction) {
    const CreditScore = (0, exports.createCreditScoreModel)(sequelize);
    const CreditScoringModel = (0, exports.createCreditScoringModelModel)(sequelize);
    const model = await CreditScoringModel.findByPk(request.modelId);
    if (!model) {
        throw new Error(`Scoring model ${request.modelId} not found`);
    }
    // TODO: Implement actual scoring calculation based on model factors
    // Simplified example:
    const scoreValue = 700; // Would calculate based on payment history, utilization, etc.
    const riskLevel = scoreValue >= 700 ? 'low' : scoreValue >= 600 ? 'medium' : 'high';
    const score = await CreditScore.create({
        customerId: request.customerId,
        scoreDate: new Date(),
        scoreValue,
        scoreModel: model.modelName,
        scoreSource: 'internal',
        riskLevel,
        scoreFactors: {},
        bureauResponse: {},
        calculatedBy: userId,
    }, { transaction });
    return score.toJSON();
}
/**
 * Pull credit score from bureau (Experian, Equifax, TransUnion).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {string} bureauSource - Bureau source
 * @param {string} userId - User requesting pull
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<CreditScore>} Bureau credit score
 */
async function pullBureauCreditScore(sequelize, customerId, bureauSource, userId, transaction) {
    const CreditScore = (0, exports.createCreditScoreModel)(sequelize);
    // TODO: Implement actual bureau API integration
    // This would call Experian/Equifax/TransUnion APIs
    const score = await CreditScore.create({
        customerId,
        scoreDate: new Date(),
        scoreValue: 725, // From bureau response
        scoreModel: `${bureauSource}_fico`,
        scoreSource: bureauSource,
        riskLevel: 'low',
        scoreFactors: {},
        bureauResponse: {},
        calculatedBy: userId,
    }, { transaction });
    return score.toJSON();
}
/**
 * Get latest credit score for customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @returns {Promise<CreditScore | null>} Latest credit score
 */
async function getLatestCreditScore(sequelize, customerId) {
    const CreditScore = (0, exports.createCreditScoreModel)(sequelize);
    const score = await CreditScore.findOne({
        where: { customerId },
        order: [['scoreDate', 'DESC']],
    });
    return score ? score.toJSON() : null;
}
/**
 * Get credit score history for trending.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<CreditScore[]>} Score history
 */
async function getCreditScoreHistory(sequelize, customerId, startDate, endDate) {
    const CreditScore = (0, exports.createCreditScoreModel)(sequelize);
    const where = { customerId };
    if (startDate || endDate) {
        where.scoreDate = {};
        if (startDate)
            where.scoreDate[sequelize_1.Op.gte] = startDate;
        if (endDate)
            where.scoreDate[sequelize_1.Op.lte] = endDate;
    }
    const scores = await CreditScore.findAll({
        where,
        order: [['scoreDate', 'DESC']],
    });
    return scores.map(s => s.toJSON());
}
// ============================================================================
// CREDIT HOLD FUNCTIONS
// ============================================================================
/**
 * Place credit hold on customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateCreditHoldDto} holdData - Hold data
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<CreditHold>} Created credit hold
 */
async function placeCreditHold(sequelize, holdData, transaction) {
    const CreditHold = (0, exports.createCreditHoldModel)(sequelize);
    const hold = await CreditHold.create({
        ...holdData,
        customerName: '', // Would fetch from customer table
        holdDate: new Date(),
        holdStatus: 'active',
        releasedDate: null,
        releasedBy: null,
        releaseReason: null,
        impactedOrders: [],
        releaseConditions: holdData.releaseConditions || {},
    }, { transaction });
    return hold.toJSON();
}
/**
 * Release credit hold.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} holdId - Hold ID
 * @param {string} releasedBy - User releasing hold
 * @param {string} releaseReason - Release reason
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
async function releaseCreditHold(sequelize, holdId, releasedBy, releaseReason, transaction) {
    const CreditHold = (0, exports.createCreditHoldModel)(sequelize);
    await CreditHold.update({
        holdStatus: 'released',
        releasedDate: new Date(),
        releasedBy,
        releaseReason,
    }, {
        where: { id: holdId },
        transaction,
    });
}
/**
 * Check if customer has active credit hold.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @returns {Promise<boolean>} True if hold active
 */
async function hasActiveCreditHold(sequelize, customerId) {
    const CreditHold = (0, exports.createCreditHoldModel)(sequelize);
    const count = await CreditHold.count({
        where: {
            customerId,
            holdStatus: 'active',
        },
    });
    return count > 0;
}
/**
 * Get active credit holds for customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @returns {Promise<CreditHold[]>} Active holds
 */
async function getActiveCreditHolds(sequelize, customerId) {
    const CreditHold = (0, exports.createCreditHoldModel)(sequelize);
    const holds = await CreditHold.findAll({
        where: {
            customerId,
            holdStatus: 'active',
        },
        order: [['holdDate', 'DESC']],
    });
    return holds.map(h => h.toJSON());
}
/**
 * Auto-release holds based on conditions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<number>} Number of holds released
 */
async function processAutoReleaseCreditHolds(sequelize, transaction) {
    const CreditHold = (0, exports.createCreditHoldModel)(sequelize);
    const holds = await CreditHold.findAll({
        where: {
            holdStatus: 'active',
            autoRelease: true,
        },
    });
    let releasedCount = 0;
    for (const hold of holds) {
        // TODO: Check release conditions
        // If conditions met, release hold
        // releasedCount++;
    }
    return releasedCount;
}
// ============================================================================
// CREDIT REVIEW FUNCTIONS
// ============================================================================
/**
 * Create credit review for customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateCreditReviewDto} reviewData - Review data
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<CreditReview>} Created review
 */
async function createCreditReview(sequelize, reviewData, transaction) {
    const CreditReview = (0, exports.createCreditReviewModel)(sequelize);
    const currentLimit = await getCurrentCreditLimit(sequelize, reviewData.customerId);
    const latestScore = await getLatestCreditScore(sequelize, reviewData.customerId);
    const review = await CreditReview.create({
        ...reviewData,
        reviewStatus: 'scheduled',
        currentCreditLimit: currentLimit?.creditLimit || 0,
        recommendedLimit: currentLimit?.creditLimit || 0,
        currentRiskLevel: latestScore?.riskLevel || 'medium',
        assessedRiskLevel: latestScore?.riskLevel || 'medium',
        reviewNotes: '',
        approvedBy: null,
        completedAt: null,
        nextReviewDate: new Date(reviewData.reviewDate.getTime() + 180 * 24 * 60 * 60 * 1000), // 6 months
    }, { transaction });
    return review.toJSON();
}
/**
 * Complete credit review.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} reviewId - Review ID
 * @param {number} recommendedLimit - Recommended credit limit
 * @param {string} assessedRiskLevel - Assessed risk level
 * @param {string} reviewNotes - Review notes
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
async function completeCreditReview(sequelize, reviewId, recommendedLimit, assessedRiskLevel, reviewNotes, transaction) {
    const CreditReview = (0, exports.createCreditReviewModel)(sequelize);
    await CreditReview.update({
        reviewStatus: 'completed',
        recommendedLimit,
        assessedRiskLevel,
        reviewNotes,
        completedAt: new Date(),
    }, {
        where: { id: reviewId },
        transaction,
    });
}
/**
 * Get pending credit reviews.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<CreditReview[]>} Pending reviews
 */
async function getPendingCreditReviews(sequelize) {
    const CreditReview = (0, exports.createCreditReviewModel)(sequelize);
    const reviews = await CreditReview.findAll({
        where: {
            reviewStatus: { [sequelize_1.Op.in]: ['scheduled', 'in_progress'] },
        },
        order: [['reviewDate', 'ASC']],
    });
    return reviews.map(r => r.toJSON());
}
// ============================================================================
// RISK ASSESSMENT FUNCTIONS
// ============================================================================
/**
 * Perform comprehensive credit risk assessment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RiskAssessmentRequestDto} request - Assessment request
 * @param {string} userId - User performing assessment
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<CreditRiskAssessment>} Risk assessment
 */
async function performCreditRiskAssessment(sequelize, request, userId, transaction) {
    const CreditRiskAssessment = (0, exports.createCreditRiskAssessmentModel)(sequelize);
    // TODO: Calculate financial ratios, payment history metrics
    const riskScore = 35.5; // 0-100 scale
    const riskLevel = riskScore < 25 ? 'low' : riskScore < 50 ? 'medium' : riskScore < 75 ? 'high' : 'critical';
    const assessment = await CreditRiskAssessment.create({
        customerId: request.customerId,
        assessmentDate: new Date(),
        assessmentType: request.assessmentType,
        riskScore,
        riskLevel,
        financialRatios: {},
        paymentHistory: {},
        exposureAmount: 0,
        daysPayableOutstanding: 45,
        delinquencyRate: 5.5,
        riskFactors: ['High DSO', 'Increasing balance'],
        mitigationRecommendations: ['Reduce credit limit', 'Require prepayment'],
        assessedBy: userId,
    }, { transaction });
    return assessment.toJSON();
}
/**
 * Get latest risk assessment for customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @returns {Promise<CreditRiskAssessment | null>} Latest assessment
 */
async function getLatestRiskAssessment(sequelize, customerId) {
    const CreditRiskAssessment = (0, exports.createCreditRiskAssessmentModel)(sequelize);
    const assessment = await CreditRiskAssessment.findOne({
        where: { customerId },
        order: [['assessmentDate', 'DESC']],
    });
    return assessment ? assessment.toJSON() : null;
}
// ============================================================================
// COLLECTIONS MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Create collections case for overdue customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateCollectionsCaseDto} caseData - Case data
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<CollectionsCase>} Created case
 */
async function createCollectionsCase(sequelize, caseData, transaction) {
    const CollectionsCase = (0, exports.createCollectionsCaseModel)(sequelize);
    const caseNumber = `COLL-${Date.now()}`;
    const collectionsCase = await CollectionsCase.create({
        ...caseData,
        customerName: '', // Would fetch
        caseNumber,
        caseStatus: 'new',
        totalOutstanding: 0, // Would calculate
        oldestInvoiceDate: new Date(),
        daysOutstanding: 0,
        openedDate: new Date(),
        closedDate: null,
        resolutionType: null,
        resolutionNotes: null,
    }, { transaction });
    return collectionsCase.toJSON();
}
/**
 * Update collections case status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} caseId - Case ID
 * @param {string} newStatus - New status
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
async function updateCollectionsCaseStatus(sequelize, caseId, newStatus, transaction) {
    const CollectionsCase = (0, exports.createCollectionsCaseModel)(sequelize);
    await CollectionsCase.update({ caseStatus: newStatus }, {
        where: { id: caseId },
        transaction,
    });
}
/**
 * Close collections case.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} caseId - Case ID
 * @param {string} resolutionType - Resolution type
 * @param {string} resolutionNotes - Resolution notes
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
async function closeCollectionsCase(sequelize, caseId, resolutionType, resolutionNotes, transaction) {
    const CollectionsCase = (0, exports.createCollectionsCaseModel)(sequelize);
    await CollectionsCase.update({
        caseStatus: 'resolved',
        closedDate: new Date(),
        resolutionType,
        resolutionNotes,
    }, {
        where: { id: caseId },
        transaction,
    });
}
/**
 * Get collections workload by agent.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} assignedTo - Agent user ID
 * @returns {Promise<CollectionsWorkload>} Workload summary
 */
async function getCollectionsWorkload(sequelize, assignedTo) {
    const CollectionsCase = (0, exports.createCollectionsCaseModel)(sequelize);
    const activeCases = await CollectionsCase.count({
        where: {
            assignedTo,
            caseStatus: { [sequelize_1.Op.in]: ['active', 'escalated'] },
        },
    });
    const totalOutstanding = await CollectionsCase.sum('totalOutstanding', {
        where: {
            assignedTo,
            caseStatus: { [sequelize_1.Op.in]: ['active', 'escalated'] },
        },
    });
    const highPriorityCases = await CollectionsCase.count({
        where: {
            assignedTo,
            caseStatus: { [sequelize_1.Op.in]: ['active', 'escalated'] },
            priority: { [sequelize_1.Op.in]: ['high', 'critical'] },
        },
    });
    return {
        assignedTo,
        activeCases,
        totalOutstanding: totalOutstanding || 0,
        highPriorityCases,
        overdueActions: 0,
        resolvedThisMonth: 0,
        collectionRate: 0,
    };
}
// ============================================================================
// DUNNING PROCESS FUNCTIONS
// ============================================================================
/**
 * Send dunning notice to customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {SendDunningNoticeDto} noticeData - Notice data
 * @param {string} userId - User sending notice
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<DunningHistory>} Dunning history record
 */
async function sendDunningNotice(sequelize, noticeData, userId, transaction) {
    const DunningHistory = (0, exports.createDunningHistoryModel)(sequelize);
    const DunningLevel = (0, exports.createDunningLevelModel)(sequelize);
    const level = await DunningLevel.findOne({
        where: { levelNumber: noticeData.dunningLevel },
    });
    if (!level) {
        throw new Error(`Dunning level ${noticeData.dunningLevel} not found`);
    }
    const history = await DunningHistory.create({
        customerId: noticeData.customerId,
        caseId: null,
        dunningLevel: noticeData.dunningLevel,
        dunningDate: new Date(),
        invoiceNumbers: noticeData.invoiceNumbers,
        totalAmount: 0, // Would calculate
        daysOverdue: 0, // Would calculate
        messageSubject: `Payment Reminder - Level ${noticeData.dunningLevel}`,
        messageBody: noticeData.overrideMessage || level.messageTemplate,
        deliveryMethod: noticeData.deliveryMethod,
        deliveryStatus: 'sent',
        sentBy: userId,
        responseReceived: false,
        responseDate: null,
        responseNotes: null,
    }, { transaction });
    return history.toJSON();
}
/**
 * Get dunning history for customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @returns {Promise<DunningHistory[]>} Dunning history
 */
async function getDunningHistory(sequelize, customerId) {
    const DunningHistory = (0, exports.createDunningHistoryModel)(sequelize);
    const history = await DunningHistory.findAll({
        where: { customerId },
        order: [['dunningDate', 'DESC']],
    });
    return history.map(h => h.toJSON());
}
/**
 * Process automatic dunning for overdue invoices.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<number>} Number of notices sent
 */
async function processAutoDunning(sequelize, transaction) {
    // TODO: Find all overdue invoices and send appropriate dunning notices
    return 0;
}
// ============================================================================
// AGING ANALYSIS FUNCTIONS
// ============================================================================
/**
 * Generate aging analysis snapshot for all customers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {AgingAnalysisRequestDto} request - Analysis request
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<AgingAnalysis[]>} Aging analysis
 */
async function generateAgingAnalysis(sequelize, request, transaction) {
    const AgingAnalysis = (0, exports.createAgingAnalysisModel)(sequelize);
    // TODO: Calculate aging buckets from invoice data
    // This is a simplified placeholder
    const analysis = [];
    return analysis;
}
/**
 * Get aging analysis summary by bucket.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - Analysis date
 * @returns {Promise<Record<string, number>>} Summary by bucket
 */
async function getAgingAnalysisSummary(sequelize, asOfDate) {
    const AgingAnalysis = (0, exports.createAgingAnalysisModel)(sequelize);
    const summary = await AgingAnalysis.findAll({
        where: { analysisDate: asOfDate },
        attributes: [
            'agingBucket',
            [sequelize.fn('SUM', sequelize.col('total_outstanding')), 'total'],
        ],
        group: ['agingBucket'],
        raw: true,
    });
    const result = {};
    for (const row of summary) {
        result[row.agingBucket] = parseFloat(row.total);
    }
    return result;
}
// ============================================================================
// CREDIT DASHBOARD FUNCTIONS
// ============================================================================
/**
 * Get comprehensive credit dashboard for customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @returns {Promise<CreditDashboard>} Credit dashboard
 */
async function getCreditDashboard(sequelize, customerId) {
    const currentLimit = await getCurrentCreditLimit(sequelize, customerId);
    const latestScore = await getLatestCreditScore(sequelize, customerId);
    const hasHold = await hasActiveCreditHold(sequelize, customerId);
    // TODO: Get current balance, past due amount from AR
    const dashboard = {
        customerId,
        customerName: '',
        creditLimit: currentLimit?.creditLimit || 0,
        currentBalance: 0,
        creditAvailable: 0,
        utilizationPercent: 0,
        latestCreditScore: latestScore?.scoreValue || 0,
        riskLevel: latestScore?.riskLevel || 'medium',
        holdStatus: hasHold ? 'active' : 'none',
        daysPayableOutstanding: 0,
        totalPastDue: 0,
        activeCases: 0,
        lastPaymentDate: null,
        nextReviewDate: currentLimit?.reviewDate || new Date(),
    };
    return dashboard;
}
//# sourceMappingURL=credit-management-risk-kit.js.map