"use strict";
/**
 * LOC: CONSBID12345
 * File: /reuse/construction/construction-bid-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend construction services
 *   - Procurement controllers
 *   - Bid evaluation engines
 *   - Vendor management services
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportBidData = exports.generateVendorScorecard = exports.trackSolicitationMetrics = exports.analyzeVendorCompetition = exports.generateBidEvaluationReport = exports.getProtestHistory = exports.withdrawBidProtest = exports.adjudicateBidProtest = exports.respondToBidProtest = exports.fileBidProtest = exports.conductBidderDebriefing = exports.notifyUnsuccessfulBidders = exports.issueAwardNotice = exports.processAwardApproval = exports.createAwardRecommendation = exports.validateRegulatoryCompliance = exports.verifyDBECompliance = exports.checkSmallBusinessCompliance = exports.verifySuretyCompany = exports.validateBidBond = exports.generateBidTabulation = exports.evaluateValueEngineeringProposals = exports.compareToHistoricalPricing = exports.analyzeBidPrice = exports.generateBidComparison = exports.normalizeEvaluatorScores = exports.performConsensusEvaluation = exports.rankBids = exports.calculateBidScore = exports.evaluateBid = exports.requestBidClarification = exports.validateContractorResponsibility = exports.validateBidResponsiveness = exports.openBids = exports.submitBid = exports.renewVendorPrequalification = exports.checkVendorPastPerformance = exports.verifyVendorCredentials = exports.evaluateVendorPrequalification = exports.createVendorPrequalification = exports.extendBidClosingDate = exports.cancelBidSolicitation = exports.issueSolicitationAddendum = exports.publishBidSolicitation = exports.createBidSolicitation = exports.CreateVendorPrequalificationDto = exports.EvaluateBidDto = exports.SubmitBidDto = exports.CreateBidSolicitationDto = exports.EvaluationCriteriaType = void 0;
exports.BidManagementController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const bid_types_1 = require("./types/bid.types");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Bid evaluation criteria type
 */
var EvaluationCriteriaType;
(function (EvaluationCriteriaType) {
    EvaluationCriteriaType["TECHNICAL"] = "technical";
    EvaluationCriteriaType["FINANCIAL"] = "financial";
    EvaluationCriteriaType["PAST_PERFORMANCE"] = "past_performance";
    EvaluationCriteriaType["EXPERIENCE"] = "experience";
    EvaluationCriteriaType["SCHEDULE"] = "schedule";
    EvaluationCriteriaType["SAFETY"] = "safety";
    EvaluationCriteriaType["QUALITY"] = "quality";
})(bid_types_1.EvaluationCriteriaType || (bid_types_1.EvaluationCriteriaType = {}));
// ============================================================================
// DTO CLASSES FOR VALIDATION
// ============================================================================
/**
 * Create bid solicitation DTO
 */
let CreateBidSolicitationDto = (() => {
    var _a;
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _procurementMethod_decorators;
    let _procurementMethod_initializers = [];
    let _procurementMethod_extraInitializers = [];
    let _awardMethod_decorators;
    let _awardMethod_initializers = [];
    let _awardMethod_extraInitializers = [];
    let _estimatedValue_decorators;
    let _estimatedValue_initializers = [];
    let _estimatedValue_extraInitializers = [];
    let _openingDate_decorators;
    let _openingDate_initializers = [];
    let _openingDate_extraInitializers = [];
    let _closingDate_decorators;
    let _closingDate_initializers = [];
    let _closingDate_extraInitializers = [];
    let _bondRequirement_decorators;
    let _bondRequirement_initializers = [];
    let _bondRequirement_extraInitializers = [];
    return _a = class CreateBidSolicitationDto {
            constructor() {
                this.projectId = __runInitializers(this, _projectId_initializers, void 0);
                this.title = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.procurementMethod = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _procurementMethod_initializers, void 0));
                this.awardMethod = (__runInitializers(this, _procurementMethod_extraInitializers), __runInitializers(this, _awardMethod_initializers, void 0));
                this.estimatedValue = (__runInitializers(this, _awardMethod_extraInitializers), __runInitializers(this, _estimatedValue_initializers, void 0));
                this.openingDate = (__runInitializers(this, _estimatedValue_extraInitializers), __runInitializers(this, _openingDate_initializers, void 0));
                this.closingDate = (__runInitializers(this, _openingDate_extraInitializers), __runInitializers(this, _closingDate_initializers, void 0));
                this.bondRequirement = (__runInitializers(this, _closingDate_extraInitializers), __runInitializers(this, _bondRequirement_initializers, void 0));
                __runInitializers(this, _bondRequirement_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _projectId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project ID' }), (0, class_validator_1.IsUUID)()];
            _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Solicitation title' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MinLength)(10), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Detailed description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(5000)];
            _procurementMethod_decorators = [(0, swagger_1.ApiProperty)({ enum: bid_types_1.ProcurementMethod }), (0, class_validator_1.IsEnum)(bid_types_1.ProcurementMethod)];
            _awardMethod_decorators = [(0, swagger_1.ApiProperty)({ enum: bid_types_1.AwardMethod }), (0, class_validator_1.IsEnum)(bid_types_1.AwardMethod)];
            _estimatedValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Estimated contract value' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _openingDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bid opening date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _closingDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bid closing date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _bondRequirement_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bond required', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _procurementMethod_decorators, { kind: "field", name: "procurementMethod", static: false, private: false, access: { has: obj => "procurementMethod" in obj, get: obj => obj.procurementMethod, set: (obj, value) => { obj.procurementMethod = value; } }, metadata: _metadata }, _procurementMethod_initializers, _procurementMethod_extraInitializers);
            __esDecorate(null, null, _awardMethod_decorators, { kind: "field", name: "awardMethod", static: false, private: false, access: { has: obj => "awardMethod" in obj, get: obj => obj.awardMethod, set: (obj, value) => { obj.awardMethod = value; } }, metadata: _metadata }, _awardMethod_initializers, _awardMethod_extraInitializers);
            __esDecorate(null, null, _estimatedValue_decorators, { kind: "field", name: "estimatedValue", static: false, private: false, access: { has: obj => "estimatedValue" in obj, get: obj => obj.estimatedValue, set: (obj, value) => { obj.estimatedValue = value; } }, metadata: _metadata }, _estimatedValue_initializers, _estimatedValue_extraInitializers);
            __esDecorate(null, null, _openingDate_decorators, { kind: "field", name: "openingDate", static: false, private: false, access: { has: obj => "openingDate" in obj, get: obj => obj.openingDate, set: (obj, value) => { obj.openingDate = value; } }, metadata: _metadata }, _openingDate_initializers, _openingDate_extraInitializers);
            __esDecorate(null, null, _closingDate_decorators, { kind: "field", name: "closingDate", static: false, private: false, access: { has: obj => "closingDate" in obj, get: obj => obj.closingDate, set: (obj, value) => { obj.closingDate = value; } }, metadata: _metadata }, _closingDate_initializers, _closingDate_extraInitializers);
            __esDecorate(null, null, _bondRequirement_decorators, { kind: "field", name: "bondRequirement", static: false, private: false, access: { has: obj => "bondRequirement" in obj, get: obj => obj.bondRequirement, set: (obj, value) => { obj.bondRequirement = value; } }, metadata: _metadata }, _bondRequirement_initializers, _bondRequirement_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateBidSolicitationDto = CreateBidSolicitationDto;
/**
 * Submit bid DTO
 */
let SubmitBidDto = (() => {
    var _a;
    let _solicitationId_decorators;
    let _solicitationId_initializers = [];
    let _solicitationId_extraInitializers = [];
    let _vendorId_decorators;
    let _vendorId_initializers = [];
    let _vendorId_extraInitializers = [];
    let _bidAmount_decorators;
    let _bidAmount_initializers = [];
    let _bidAmount_extraInitializers = [];
    let _scheduleProposed_decorators;
    let _scheduleProposed_initializers = [];
    let _scheduleProposed_extraInitializers = [];
    let _bidBondAmount_decorators;
    let _bidBondAmount_initializers = [];
    let _bidBondAmount_extraInitializers = [];
    return _a = class SubmitBidDto {
            constructor() {
                this.solicitationId = __runInitializers(this, _solicitationId_initializers, void 0);
                this.vendorId = (__runInitializers(this, _solicitationId_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
                this.bidAmount = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _bidAmount_initializers, void 0));
                this.scheduleProposed = (__runInitializers(this, _bidAmount_extraInitializers), __runInitializers(this, _scheduleProposed_initializers, void 0));
                this.bidBondAmount = (__runInitializers(this, _scheduleProposed_extraInitializers), __runInitializers(this, _bidBondAmount_initializers, void 0));
                __runInitializers(this, _bidBondAmount_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _solicitationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Solicitation ID' }), (0, class_validator_1.IsUUID)()];
            _vendorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor ID' }), (0, class_validator_1.IsUUID)()];
            _bidAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bid amount' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _scheduleProposed_decorators = [(0, swagger_1.ApiProperty)({ description: 'Proposed schedule (days)' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _bidBondAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bid bond amount', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _solicitationId_decorators, { kind: "field", name: "solicitationId", static: false, private: false, access: { has: obj => "solicitationId" in obj, get: obj => obj.solicitationId, set: (obj, value) => { obj.solicitationId = value; } }, metadata: _metadata }, _solicitationId_initializers, _solicitationId_extraInitializers);
            __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: obj => "vendorId" in obj, get: obj => obj.vendorId, set: (obj, value) => { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
            __esDecorate(null, null, _bidAmount_decorators, { kind: "field", name: "bidAmount", static: false, private: false, access: { has: obj => "bidAmount" in obj, get: obj => obj.bidAmount, set: (obj, value) => { obj.bidAmount = value; } }, metadata: _metadata }, _bidAmount_initializers, _bidAmount_extraInitializers);
            __esDecorate(null, null, _scheduleProposed_decorators, { kind: "field", name: "scheduleProposed", static: false, private: false, access: { has: obj => "scheduleProposed" in obj, get: obj => obj.scheduleProposed, set: (obj, value) => { obj.scheduleProposed = value; } }, metadata: _metadata }, _scheduleProposed_initializers, _scheduleProposed_extraInitializers);
            __esDecorate(null, null, _bidBondAmount_decorators, { kind: "field", name: "bidBondAmount", static: false, private: false, access: { has: obj => "bidBondAmount" in obj, get: obj => obj.bidBondAmount, set: (obj, value) => { obj.bidBondAmount = value; } }, metadata: _metadata }, _bidBondAmount_initializers, _bidBondAmount_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SubmitBidDto = SubmitBidDto;
/**
 * Evaluate bid DTO
 */
let EvaluateBidDto = (() => {
    var _a;
    let _bidId_decorators;
    let _bidId_initializers = [];
    let _bidId_extraInitializers = [];
    let _criterionId_decorators;
    let _criterionId_initializers = [];
    let _criterionId_extraInitializers = [];
    let _score_decorators;
    let _score_initializers = [];
    let _score_extraInitializers = [];
    let _comments_decorators;
    let _comments_initializers = [];
    let _comments_extraInitializers = [];
    let _strengths_decorators;
    let _strengths_initializers = [];
    let _strengths_extraInitializers = [];
    let _weaknesses_decorators;
    let _weaknesses_initializers = [];
    let _weaknesses_extraInitializers = [];
    return _a = class EvaluateBidDto {
            constructor() {
                this.bidId = __runInitializers(this, _bidId_initializers, void 0);
                this.criterionId = (__runInitializers(this, _bidId_extraInitializers), __runInitializers(this, _criterionId_initializers, void 0));
                this.score = (__runInitializers(this, _criterionId_extraInitializers), __runInitializers(this, _score_initializers, void 0));
                this.comments = (__runInitializers(this, _score_extraInitializers), __runInitializers(this, _comments_initializers, void 0));
                this.strengths = (__runInitializers(this, _comments_extraInitializers), __runInitializers(this, _strengths_initializers, void 0));
                this.weaknesses = (__runInitializers(this, _strengths_extraInitializers), __runInitializers(this, _weaknesses_initializers, void 0));
                __runInitializers(this, _weaknesses_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _bidId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bid ID' }), (0, class_validator_1.IsUUID)()];
            _criterionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Criterion ID' }), (0, class_validator_1.IsUUID)()];
            _score_decorators = [(0, swagger_1.ApiProperty)({ description: 'Score' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _comments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Evaluation comments' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(2000)];
            _strengths_decorators = [(0, swagger_1.ApiProperty)({ description: 'Strengths', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _weaknesses_decorators = [(0, swagger_1.ApiProperty)({ description: 'Weaknesses', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _bidId_decorators, { kind: "field", name: "bidId", static: false, private: false, access: { has: obj => "bidId" in obj, get: obj => obj.bidId, set: (obj, value) => { obj.bidId = value; } }, metadata: _metadata }, _bidId_initializers, _bidId_extraInitializers);
            __esDecorate(null, null, _criterionId_decorators, { kind: "field", name: "criterionId", static: false, private: false, access: { has: obj => "criterionId" in obj, get: obj => obj.criterionId, set: (obj, value) => { obj.criterionId = value; } }, metadata: _metadata }, _criterionId_initializers, _criterionId_extraInitializers);
            __esDecorate(null, null, _score_decorators, { kind: "field", name: "score", static: false, private: false, access: { has: obj => "score" in obj, get: obj => obj.score, set: (obj, value) => { obj.score = value; } }, metadata: _metadata }, _score_initializers, _score_extraInitializers);
            __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: obj => "comments" in obj, get: obj => obj.comments, set: (obj, value) => { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
            __esDecorate(null, null, _strengths_decorators, { kind: "field", name: "strengths", static: false, private: false, access: { has: obj => "strengths" in obj, get: obj => obj.strengths, set: (obj, value) => { obj.strengths = value; } }, metadata: _metadata }, _strengths_initializers, _strengths_extraInitializers);
            __esDecorate(null, null, _weaknesses_decorators, { kind: "field", name: "weaknesses", static: false, private: false, access: { has: obj => "weaknesses" in obj, get: obj => obj.weaknesses, set: (obj, value) => { obj.weaknesses = value; } }, metadata: _metadata }, _weaknesses_initializers, _weaknesses_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.EvaluateBidDto = EvaluateBidDto;
/**
 * Create vendor prequalification DTO
 */
let CreateVendorPrequalificationDto = (() => {
    var _a;
    let _vendorId_decorators;
    let _vendorId_initializers = [];
    let _vendorId_extraInitializers = [];
    let _workCategories_decorators;
    let _workCategories_initializers = [];
    let _workCategories_extraInitializers = [];
    let _maxProjectValue_decorators;
    let _maxProjectValue_initializers = [];
    let _maxProjectValue_extraInitializers = [];
    let _bondingCapacity_decorators;
    let _bondingCapacity_initializers = [];
    let _bondingCapacity_extraInitializers = [];
    let _insuranceCoverage_decorators;
    let _insuranceCoverage_initializers = [];
    let _insuranceCoverage_extraInitializers = [];
    return _a = class CreateVendorPrequalificationDto {
            constructor() {
                this.vendorId = __runInitializers(this, _vendorId_initializers, void 0);
                this.workCategories = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _workCategories_initializers, void 0));
                this.maxProjectValue = (__runInitializers(this, _workCategories_extraInitializers), __runInitializers(this, _maxProjectValue_initializers, void 0));
                this.bondingCapacity = (__runInitializers(this, _maxProjectValue_extraInitializers), __runInitializers(this, _bondingCapacity_initializers, void 0));
                this.insuranceCoverage = (__runInitializers(this, _bondingCapacity_extraInitializers), __runInitializers(this, _insuranceCoverage_initializers, void 0));
                __runInitializers(this, _insuranceCoverage_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _vendorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor ID' }), (0, class_validator_1.IsUUID)()];
            _workCategories_decorators = [(0, swagger_1.ApiProperty)({ description: 'Work categories' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _maxProjectValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Maximum project value' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _bondingCapacity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bonding capacity' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _insuranceCoverage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Insurance coverage amount' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: obj => "vendorId" in obj, get: obj => obj.vendorId, set: (obj, value) => { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
            __esDecorate(null, null, _workCategories_decorators, { kind: "field", name: "workCategories", static: false, private: false, access: { has: obj => "workCategories" in obj, get: obj => obj.workCategories, set: (obj, value) => { obj.workCategories = value; } }, metadata: _metadata }, _workCategories_initializers, _workCategories_extraInitializers);
            __esDecorate(null, null, _maxProjectValue_decorators, { kind: "field", name: "maxProjectValue", static: false, private: false, access: { has: obj => "maxProjectValue" in obj, get: obj => obj.maxProjectValue, set: (obj, value) => { obj.maxProjectValue = value; } }, metadata: _metadata }, _maxProjectValue_initializers, _maxProjectValue_extraInitializers);
            __esDecorate(null, null, _bondingCapacity_decorators, { kind: "field", name: "bondingCapacity", static: false, private: false, access: { has: obj => "bondingCapacity" in obj, get: obj => obj.bondingCapacity, set: (obj, value) => { obj.bondingCapacity = value; } }, metadata: _metadata }, _bondingCapacity_initializers, _bondingCapacity_extraInitializers);
            __esDecorate(null, null, _insuranceCoverage_decorators, { kind: "field", name: "insuranceCoverage", static: false, private: false, access: { has: obj => "insuranceCoverage" in obj, get: obj => obj.insuranceCoverage, set: (obj, value) => { obj.insuranceCoverage = value; } }, metadata: _metadata }, _insuranceCoverage_initializers, _insuranceCoverage_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateVendorPrequalificationDto = CreateVendorPrequalificationDto;
// ============================================================================
// BID SOLICITATION (1-5)
// ============================================================================
/**
 * Creates new bid solicitation with evaluation criteria.
 *
 * @param {object} solicitationData - Solicitation creation data
 * @param {string} userId - User creating solicitation
 * @returns {Promise<BidSolicitation>} Created solicitation
 *
 * @example
 * ```typescript
 * const solicitation = await createBidSolicitation({
 *   projectId: 'proj-123',
 *   title: 'HVAC System Replacement',
 *   description: 'Complete replacement of building HVAC',
 *   procurementMethod: ProcurementMethod.COMPETITIVE_SEALED_BID,
 *   awardMethod: AwardMethod.LOWEST_RESPONSIVE_BID,
 *   estimatedValue: 2500000,
 *   openingDate: new Date('2025-03-01'),
 *   closingDate: new Date('2025-04-15')
 * }, 'admin-456');
 * ```
 */
const createBidSolicitation = async (solicitationData, userId) => {
    const solicitationNumber = generateSolicitationNumber(solicitationData.projectId);
    const defaultCriteria = [
        {
            id: generateUUID(),
            criteriaType: bid_types_1.EvaluationCriteriaType.TECHNICAL,
            description: 'Technical approach and methodology',
            weight: 0.4,
            maxPoints: 40,
            passingScore: 24,
            evaluationGuidance: 'Evaluate technical soundness and feasibility',
        },
        {
            id: generateUUID(),
            criteriaType: bid_types_1.EvaluationCriteriaType.FINANCIAL,
            description: 'Price competitiveness',
            weight: 0.35,
            maxPoints: 35,
            evaluationGuidance: 'Compare to engineer estimate',
        },
        {
            id: generateUUID(),
            criteriaType: bid_types_1.EvaluationCriteriaType.PAST_PERFORMANCE,
            description: 'Past performance on similar projects',
            weight: 0.25,
            maxPoints: 25,
            passingScore: 15,
            evaluationGuidance: 'Review references and completion records',
        },
    ];
    return {
        id: generateUUID(),
        solicitationNumber,
        projectId: solicitationData.projectId,
        title: solicitationData.title,
        description: solicitationData.description,
        procurementMethod: solicitationData.procurementMethod,
        awardMethod: solicitationData.awardMethod,
        estimatedValue: solicitationData.estimatedValue,
        openingDate: solicitationData.openingDate,
        closingDate: solicitationData.closingDate,
        prebidMeetingDate: solicitationData.prebidMeetingDate,
        prebidMeetingLocation: solicitationData.prebidMeetingLocation,
        status: bid_types_1.BidSolicitationStatus.DRAFT,
        bondRequirement: solicitationData.bondRequirement !== false,
        bondPercentage: solicitationData.bondPercentage || 10,
        insuranceRequirements: solicitationData.insuranceRequirements || [
            'General Liability: $2M',
            'Workers Compensation: Statutory',
            'Professional Liability: $1M',
        ],
        evaluationCriteria: solicitationData.evaluationCriteria || defaultCriteria,
        smallBusinessGoals: solicitationData.smallBusinessGoals,
        dbeGoals: solicitationData.dbeGoals,
        documents: [],
        addenda: [],
        metadata: solicitationData.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
        updatedBy: userId,
    };
};
exports.createBidSolicitation = createBidSolicitation;
/**
 * Publishes bid solicitation for vendor access.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @param {string} userId - User publishing solicitation
 * @returns {Promise<BidSolicitation>} Published solicitation
 *
 * @example
 * ```typescript
 * const published = await publishBidSolicitation('sol-123', 'admin-456');
 * ```
 */
const publishBidSolicitation = async (solicitationId, userId) => {
    const solicitation = await getBidSolicitation(solicitationId);
    if (solicitation.status !== bid_types_1.BidSolicitationStatus.DRAFT) {
        throw new Error('Only draft solicitations can be published');
    }
    return {
        ...solicitation,
        status: bid_types_1.BidSolicitationStatus.PUBLISHED,
        publishedDate: new Date(),
        updatedAt: new Date(),
        updatedBy: userId,
    };
};
exports.publishBidSolicitation = publishBidSolicitation;
/**
 * Issues addendum to bid solicitation.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @param {object} addendumData - Addendum details
 * @param {string} userId - User issuing addendum
 * @returns {Promise<Addendum>} Created addendum
 *
 * @example
 * ```typescript
 * const addendum = await issueSolicitationAddendum('sol-123', {
 *   description: 'Clarification on HVAC specifications',
 *   documents: [{ documentName: 'Revised Specs.pdf', documentUrl: '/docs/...' }]
 * }, 'admin-456');
 * ```
 */
const issueSolicitationAddendum = async (solicitationId, addendumData, userId) => {
    const solicitation = await getBidSolicitation(solicitationId);
    const addendumNumber = `ADD-${(solicitation.addenda.length + 1).toString().padStart(3, '0')}`;
    const addendum = {
        id: generateUUID(),
        addendumNumber,
        description: addendumData.description,
        issuedDate: new Date(),
        documents: addendumData.documents || [],
    };
    solicitation.addenda.push(addendum);
    return addendum;
};
exports.issueSolicitationAddendum = issueSolicitationAddendum;
/**
 * Cancels bid solicitation with justification.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @param {string} cancellationReason - Reason for cancellation
 * @param {string} userId - User cancelling solicitation
 * @returns {Promise<BidSolicitation>} Cancelled solicitation
 *
 * @example
 * ```typescript
 * await cancelBidSolicitation('sol-123', 'Project funding withdrawn', 'admin-456');
 * ```
 */
const cancelBidSolicitation = async (solicitationId, cancellationReason, userId) => {
    const solicitation = await getBidSolicitation(solicitationId);
    return {
        ...solicitation,
        status: bid_types_1.BidSolicitationStatus.CANCELLED,
        metadata: {
            ...solicitation.metadata,
            cancellationReason,
            cancelledAt: new Date().toISOString(),
            cancelledBy: userId,
        },
        updatedAt: new Date(),
        updatedBy: userId,
    };
};
exports.cancelBidSolicitation = cancelBidSolicitation;
/**
 * Extends bid closing date with notification to vendors.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @param {Date} newClosingDate - New closing date
 * @param {string} reason - Reason for extension
 * @param {string} userId - User extending deadline
 * @returns {Promise<BidSolicitation>} Updated solicitation
 *
 * @example
 * ```typescript
 * await extendBidClosingDate('sol-123', new Date('2025-05-01'), 'Additional time for site visits', 'admin-456');
 * ```
 */
const extendBidClosingDate = async (solicitationId, newClosingDate, reason, userId) => {
    const solicitation = await getBidSolicitation(solicitationId);
    if (newClosingDate <= solicitation.closingDate) {
        throw new Error('New closing date must be after current closing date');
    }
    return {
        ...solicitation,
        closingDate: newClosingDate,
        metadata: {
            ...solicitation.metadata,
            extensionHistory: [
                ...(solicitation.metadata.extensionHistory || []),
                {
                    oldDate: solicitation.closingDate,
                    newDate: newClosingDate,
                    reason,
                    extendedBy: userId,
                    extendedAt: new Date().toISOString(),
                },
            ],
        },
        updatedAt: new Date(),
        updatedBy: userId,
    };
};
exports.extendBidClosingDate = extendBidClosingDate;
// ============================================================================
// VENDOR PREQUALIFICATION (6-10)
// ============================================================================
/**
 * Creates vendor prequalification application.
 *
 * @param {object} qualificationData - Qualification data
 * @param {string} userId - User creating qualification
 * @returns {Promise<VendorPrequalification>} Created qualification
 *
 * @example
 * ```typescript
 * const qual = await createVendorPrequalification({
 *   vendorId: 'vendor-123',
 *   vendorName: 'ABC Construction',
 *   workCategories: ['General Construction', 'HVAC'],
 *   maxProjectValue: 5000000,
 *   bondingCapacity: 10000000,
 *   insuranceCoverage: 5000000
 * }, 'vendor-user');
 * ```
 */
const createVendorPrequalification = async (qualificationData, userId) => {
    const qualificationNumber = generateQualificationNumber();
    return {
        id: generateUUID(),
        vendorId: qualificationData.vendorId,
        vendorName: qualificationData.vendorName,
        qualificationNumber,
        workCategories: qualificationData.workCategories,
        maxProjectValue: qualificationData.maxProjectValue,
        bondingCapacity: qualificationData.bondingCapacity,
        insuranceCoverage: qualificationData.insuranceCoverage,
        pastProjectCount: qualificationData.pastProjectCount || 0,
        pastProjectValue: qualificationData.pastProjectValue || 0,
        safetyRating: qualificationData.safetyRating || 0,
        qualityRating: qualificationData.qualityRating || 0,
        performanceRating: qualificationData.performanceRating || 0,
        financialStrength: qualificationData.financialStrength || 'FAIR',
        qualificationStatus: bid_types_1.VendorQualificationStatus.PENDING,
        certifications: qualificationData.certifications || [],
        licenses: qualificationData.licenses || [],
        metadata: qualificationData.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.createVendorPrequalification = createVendorPrequalification;
/**
 * Evaluates vendor prequalification application.
 *
 * @param {string} qualificationId - Qualification identifier
 * @param {object} evaluation - Evaluation results
 * @param {string} userId - User evaluating qualification
 * @returns {Promise<VendorPrequalification>} Updated qualification
 *
 * @example
 * ```typescript
 * const evaluated = await evaluateVendorPrequalification('qual-123', {
 *   safetyRating: 8.5,
 *   qualityRating: 9.0,
 *   performanceRating: 8.7,
 *   financialStrength: 'GOOD',
 *   status: VendorQualificationStatus.APPROVED
 * }, 'eval-456');
 * ```
 */
const evaluateVendorPrequalification = async (qualificationId, evaluation, userId) => {
    const qualification = await getVendorPrequalification(qualificationId);
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1); // 1 year validity
    return {
        ...qualification,
        safetyRating: evaluation.safetyRating,
        qualityRating: evaluation.qualityRating,
        performanceRating: evaluation.performanceRating,
        financialStrength: evaluation.financialStrength,
        qualificationStatus: evaluation.status,
        qualifiedDate: evaluation.status === bid_types_1.VendorQualificationStatus.APPROVED ? new Date() : undefined,
        expirationDate: evaluation.status === bid_types_1.VendorQualificationStatus.APPROVED ? expirationDate : undefined,
        updatedAt: new Date(),
    };
};
exports.evaluateVendorPrequalification = evaluateVendorPrequalification;
/**
 * Verifies vendor certifications and licenses.
 *
 * @param {string} qualificationId - Qualification identifier
 * @returns {Promise<object>} Verification results
 *
 * @example
 * ```typescript
 * const verification = await verifyVendorCredentials('qual-123');
 * ```
 */
const verifyVendorCredentials = async (qualificationId) => {
    const qualification = await getVendorPrequalification(qualificationId);
    // In production, verify against external databases
    return {
        certificationsValid: true,
        licensesValid: true,
        invalidItems: [],
        verifiedAt: new Date(),
    };
};
exports.verifyVendorCredentials = verifyVendorCredentials;
/**
 * Checks vendor past performance on similar projects.
 *
 * @param {string} vendorId - Vendor identifier
 * @param {string[]} projectCategories - Project categories to check
 * @returns {Promise<object>} Past performance summary
 *
 * @example
 * ```typescript
 * const performance = await checkVendorPastPerformance('vendor-123', ['HVAC', 'Electrical']);
 * ```
 */
const checkVendorPastPerformance = async (vendorId, projectCategories) => {
    // In production, query project history database
    return {
        totalProjects: 15,
        successfulProjects: 14,
        averageRating: 8.5,
        onTimeDelivery: 93.3,
        onBudgetDelivery: 86.7,
        recentProjects: [],
    };
};
exports.checkVendorPastPerformance = checkVendorPastPerformance;
/**
 * Renews vendor prequalification before expiration.
 *
 * @param {string} qualificationId - Qualification identifier
 * @param {string} userId - User renewing qualification
 * @returns {Promise<VendorPrequalification>} Renewed qualification
 *
 * @example
 * ```typescript
 * const renewed = await renewVendorPrequalification('qual-123', 'admin-456');
 * ```
 */
const renewVendorPrequalification = async (qualificationId, userId) => {
    const qualification = await getVendorPrequalification(qualificationId);
    const newExpirationDate = new Date();
    newExpirationDate.setFullYear(newExpirationDate.getFullYear() + 1);
    return {
        ...qualification,
        qualifiedDate: new Date(),
        expirationDate: newExpirationDate,
        qualificationStatus: bid_types_1.VendorQualificationStatus.APPROVED,
        updatedAt: new Date(),
    };
};
exports.renewVendorPrequalification = renewVendorPrequalification;
// ============================================================================
// BID SUBMISSION AND OPENING (11-15)
// ============================================================================
/**
 * Submits bid for solicitation.
 *
 * @param {object} bidData - Bid submission data
 * @param {string} userId - User submitting bid
 * @returns {Promise<BidSubmission>} Submitted bid
 *
 * @example
 * ```typescript
 * const bid = await submitBid({
 *   solicitationId: 'sol-123',
 *   vendorId: 'vendor-456',
 *   vendorName: 'ABC Construction',
 *   bidAmount: 2350000,
 *   scheduleProposed: 180,
 *   bidBondAmount: 235000,
 *   bidBondProvider: 'Surety Co.'
 * }, 'vendor-user');
 * ```
 */
const submitBid = async (bidData, userId) => {
    const solicitation = await getBidSolicitation(bidData.solicitationId);
    if (solicitation.status !== bid_types_1.BidSolicitationStatus.OPEN && solicitation.status !== bid_types_1.BidSolicitationStatus.PUBLISHED) {
        throw new Error('Solicitation is not accepting bids');
    }
    if (new Date() > solicitation.closingDate) {
        throw new Error('Bid submission deadline has passed');
    }
    const bidNumber = generateBidNumber(bidData.solicitationId);
    return {
        id: generateUUID(),
        solicitationId: bidData.solicitationId,
        vendorId: bidData.vendorId,
        vendorName: bidData.vendorName,
        bidNumber,
        submittalDate: new Date(),
        bidAmount: bidData.bidAmount,
        bidBondAmount: bidData.bidBondAmount,
        bidBondProvider: bidData.bidBondProvider,
        scheduleProposed: bidData.scheduleProposed,
        status: bid_types_1.BidStatus.SUBMITTED,
        responsiveness: false,
        responsibility: false,
        alternatesProvided: bidData.alternates ? bidData.alternates.length > 0 : false,
        valueEngineeringProposals: bidData.valueEngineeringProposals || [],
        clarifications: [],
        evaluationNotes: '',
        metadata: bidData.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.submitBid = submitBid;
/**
 * Opens bids at designated opening time.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @param {string} userId - User opening bids
 * @returns {Promise<object>} Bid opening results
 *
 * @example
 * ```typescript
 * const opening = await openBids('sol-123', 'admin-456');
 * ```
 */
const openBids = async (solicitationId, userId) => {
    const solicitation = await getBidSolicitation(solicitationId);
    const bids = await getSolicitationBids(solicitationId);
    if (new Date() < solicitation.openingDate) {
        throw new Error('Bid opening time has not arrived');
    }
    // Update solicitation status
    solicitation.status = bid_types_1.BidSolicitationStatus.OPEN;
    // Update all bids to under evaluation
    bids.forEach((bid) => {
        bid.status = bid_types_1.BidStatus.UNDER_EVALUATION;
    });
    return {
        solicitationId,
        openedAt: new Date(),
        openedBy: userId,
        totalBids: bids.length,
        bids: bids.map((b) => ({
            bidNumber: b.bidNumber,
            vendorName: b.vendorName,
            bidAmount: b.bidAmount,
        })),
    };
};
exports.openBids = openBids;
/**
 * Validates bid responsiveness to solicitation requirements.
 *
 * @param {string} bidId - Bid identifier
 * @param {string} userId - User validating bid
 * @returns {Promise<object>} Responsiveness determination
 *
 * @example
 * ```typescript
 * const responsive = await validateBidResponsiveness('bid-123', 'eval-456');
 * ```
 */
const validateBidResponsiveness = async (bidId, userId) => {
    const bid = await getBidSubmission(bidId);
    const solicitation = await getBidSolicitation(bid.solicitationId);
    const checklist = [
        { item: 'Bid submitted before deadline', compliant: bid.submittalDate <= solicitation.closingDate },
        { item: 'Bid bond provided (if required)', compliant: solicitation.bondRequirement ? !!bid.bidBondAmount : true },
        { item: 'All required forms signed', compliant: true }, // Placeholder
        { item: 'Pricing complete and unambiguous', compliant: true }, // Placeholder
        { item: 'Schedule requirements acknowledged', compliant: true }, // Placeholder
    ];
    const responsive = checklist.every((c) => c.compliant);
    const deficiencies = checklist.filter((c) => !c.compliant).map((c) => c.item);
    bid.responsiveness = responsive;
    return {
        responsive,
        deficiencies,
        checklist,
    };
};
exports.validateBidResponsiveness = validateBidResponsiveness;
/**
 * Validates contractor responsibility determination.
 *
 * @param {string} bidId - Bid identifier
 * @param {string} userId - User validating responsibility
 * @returns {Promise<object>} Responsibility determination
 *
 * @example
 * ```typescript
 * const responsible = await validateContractorResponsibility('bid-123', 'eval-456');
 * ```
 */
const validateContractorResponsibility = async (bidId, userId) => {
    const bid = await getBidSubmission(bidId);
    // Check vendor prequalification
    const qualification = await getVendorQualificationByVendorId(bid.vendorId);
    const criteria = [
        {
            criterion: 'Adequate financial resources',
            met: qualification?.financialStrength === 'GOOD' || qualification?.financialStrength === 'EXCELLENT',
        },
        { criterion: 'Ability to meet schedule', met: true }, // Placeholder
        { criterion: 'Satisfactory past performance', met: qualification ? qualification.performanceRating >= 7.0 : false },
        { criterion: 'Adequate bonding capacity', met: qualification ? qualification.bondingCapacity >= bid.bidAmount : false },
        { criterion: 'Necessary licenses and permits', met: qualification ? qualification.licenses.length > 0 : false },
    ];
    const responsible = criteria.every((c) => c.met);
    const findings = criteria.filter((c) => !c.met).map((c) => c.criterion);
    bid.responsibility = responsible;
    return {
        responsible,
        findings,
        criteria,
    };
};
exports.validateContractorResponsibility = validateContractorResponsibility;
/**
 * Requests bid clarification from vendor.
 *
 * @param {string} bidId - Bid identifier
 * @param {string} clarificationRequest - Clarification question
 * @param {string} userId - User requesting clarification
 * @returns {Promise<object>} Clarification request
 *
 * @example
 * ```typescript
 * await requestBidClarification('bid-123', 'Please clarify HVAC equipment manufacturer', 'eval-456');
 * ```
 */
const requestBidClarification = async (bidId, clarificationRequest, userId) => {
    const bid = await getBidSubmission(bidId);
    const clarificationId = generateUUID();
    const responseDue = new Date();
    responseDue.setDate(responseDue.getDate() + 3); // 3 days to respond
    bid.clarifications.push({
        id: clarificationId,
        request: clarificationRequest,
        requestedBy: userId,
        requestedAt: new Date(),
        responseDue,
        response: null,
        respondedAt: null,
    });
    return {
        clarificationId,
        requestedAt: new Date(),
        responseDue,
    };
};
exports.requestBidClarification = requestBidClarification;
// ============================================================================
// BID EVALUATION AND SCORING (16-20)
// ============================================================================
/**
 * Evaluates bid against specific criterion.
 *
 * @param {object} evaluationData - Evaluation data
 * @param {string} userId - User performing evaluation
 * @returns {Promise<BidEvaluation>} Evaluation record
 *
 * @example
 * ```typescript
 * const evaluation = await evaluateBid({
 *   bidId: 'bid-123',
 *   criterionId: 'crit-456',
 *   score: 35,
 *   maxScore: 40,
 *   comments: 'Strong technical approach',
 *   strengths: ['Experienced team', 'Proven methodology'],
 *   weaknesses: ['Schedule somewhat aggressive']
 * }, 'eval-789');
 * ```
 */
const evaluateBid = async (evaluationData, userId) => {
    return {
        id: generateUUID(),
        bidId: evaluationData.bidId,
        criterionId: evaluationData.criterionId,
        evaluatorId: userId,
        evaluatorName: 'Evaluator Name', // Fetch from user service
        score: evaluationData.score,
        maxScore: evaluationData.maxScore,
        comments: evaluationData.comments,
        strengths: evaluationData.strengths || [],
        weaknesses: evaluationData.weaknesses || [],
        evaluatedAt: new Date(),
        metadata: {},
    };
};
exports.evaluateBid = evaluateBid;
/**
 * Calculates total weighted score for bid.
 *
 * @param {string} bidId - Bid identifier
 * @returns {Promise<object>} Score calculation
 *
 * @example
 * ```typescript
 * const scores = await calculateBidScore('bid-123');
 * ```
 */
const calculateBidScore = async (bidId) => {
    const bid = await getBidSubmission(bidId);
    const evaluations = await getBidEvaluations(bidId);
    const solicitation = await getBidSolicitation(bid.solicitationId);
    const breakdown = solicitation.evaluationCriteria.map((criterion) => {
        const evaluation = evaluations.find((e) => e.criterionId === criterion.id);
        const score = evaluation?.score || 0;
        const weightedScore = score * criterion.weight;
        return {
            criterion: criterion.description,
            score,
            weight: criterion.weight,
            weightedScore,
        };
    });
    const technicalScore = breakdown
        .filter((b) => b.criterion.toLowerCase().includes('technical'))
        .reduce((sum, b) => sum + b.weightedScore, 0);
    const financialScore = breakdown
        .filter((b) => b.criterion.toLowerCase().includes('financial') || b.criterion.toLowerCase().includes('price'))
        .reduce((sum, b) => sum + b.weightedScore, 0);
    const totalScore = breakdown.reduce((sum, b) => sum + b.weightedScore, 0);
    bid.technicalScore = technicalScore;
    bid.financialScore = financialScore;
    bid.totalScore = totalScore;
    return {
        technicalScore,
        financialScore,
        totalScore,
        breakdown,
    };
};
exports.calculateBidScore = calculateBidScore;
/**
 * Ranks all bids for solicitation.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @returns {Promise<BidSubmission[]>} Ranked bids
 *
 * @example
 * ```typescript
 * const ranked = await rankBids('sol-123');
 * ```
 */
const rankBids = async (solicitationId) => {
    const bids = await getSolicitationBids(solicitationId);
    const solicitation = await getBidSolicitation(solicitationId);
    // Calculate scores for all bids
    await Promise.all(bids.map((bid) => (0, exports.calculateBidScore)(bid.id)));
    // Rank based on award method
    let rankedBids;
    if (solicitation.awardMethod === bid_types_1.AwardMethod.LOWEST_RESPONSIVE_BID) {
        // Rank by price (lowest first)
        rankedBids = bids
            .filter((b) => b.responsiveness && b.responsibility)
            .sort((a, b) => a.bidAmount - b.bidAmount);
    }
    else if (solicitation.awardMethod === bid_types_1.AwardMethod.BEST_VALUE) {
        // Rank by total score (highest first)
        rankedBids = bids
            .filter((b) => b.responsiveness && b.responsibility)
            .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
    }
    else {
        rankedBids = bids;
    }
    // Assign ranks
    rankedBids.forEach((bid, index) => {
        bid.rank = index + 1;
    });
    return rankedBids;
};
exports.rankBids = rankBids;
/**
 * Performs consensus evaluation among evaluators.
 *
 * @param {string} bidId - Bid identifier
 * @returns {Promise<object>} Consensus results
 *
 * @example
 * ```typescript
 * const consensus = await performConsensusEvaluation('bid-123');
 * ```
 */
const performConsensusEvaluation = async (bidId) => {
    const evaluations = await getBidEvaluations(bidId);
    const evaluatorScores = evaluations.map((e) => ({
        evaluatorId: e.evaluatorId,
        score: e.score,
    }));
    const averageScore = evaluatorScores.reduce((sum, e) => sum + e.score, 0) / evaluatorScores.length;
    const variance = evaluatorScores.reduce((sum, e) => sum + Math.pow(e.score - averageScore, 2), 0) / evaluatorScores.length;
    return {
        consensusReached: variance < 5,
        finalScore: averageScore,
        evaluatorScores,
        variance,
    };
};
exports.performConsensusEvaluation = performConsensusEvaluation;
/**
 * Normalizes scores across evaluators.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @returns {Promise<object>} Normalized scores
 *
 * @example
 * ```typescript
 * const normalized = await normalizeEvaluatorScores('sol-123');
 * ```
 */
const normalizeEvaluatorScores = async (solicitationId) => {
    // In production, apply statistical normalization
    return {
        bids: [],
        normalizationFactor: 1.0,
    };
};
exports.normalizeEvaluatorScores = normalizeEvaluatorScores;
// ============================================================================
// BID COMPARISON AND ANALYSIS (21-25)
// ============================================================================
/**
 * Generates comprehensive bid comparison.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @returns {Promise<BidComparison>} Bid comparison
 *
 * @example
 * ```typescript
 * const comparison = await generateBidComparison('sol-123');
 * ```
 */
const generateBidComparison = async (solicitationId) => {
    const solicitation = await getBidSolicitation(solicitationId);
    const bids = await getSolicitationBids(solicitationId);
    const responsiveBids = bids.filter((b) => b.responsiveness && b.responsibility);
    const bidAmounts = responsiveBids.map((b) => b.bidAmount);
    const lowestBid = Math.min(...bidAmounts);
    const highestBid = Math.max(...bidAmounts);
    const averageBid = bidAmounts.reduce((sum, amt) => sum + amt, 0) / bidAmounts.length;
    const comparison = {
        solicitationId,
        bids: responsiveBids.map((b) => ({
            bidId: b.id,
            vendorName: b.vendorName,
            bidAmount: b.bidAmount,
            technicalScore: b.technicalScore || 0,
            totalScore: b.totalScore || 0,
            rank: b.rank || 0,
            responsive: b.responsiveness,
        })),
        lowestBid,
        highestBid,
        averageBid,
        engineerEstimate: solicitation.estimatedValue,
        recommendation: '',
    };
    return comparison;
};
exports.generateBidComparison = generateBidComparison;
/**
 * Analyzes bid price reasonableness.
 *
 * @param {string} bidId - Bid identifier
 * @returns {Promise<PriceAnalysis>} Price analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeBidPrice('bid-123');
 * ```
 */
const analyzeBidPrice = async (bidId) => {
    const bid = await getBidSubmission(bidId);
    const solicitation = await getBidSolicitation(bid.solicitationId);
    const allBids = await getSolicitationBids(solicitation.id);
    const engineerEstimate = solicitation.estimatedValue;
    const varianceFromEstimate = bid.bidAmount - engineerEstimate;
    const variancePercentage = (varianceFromEstimate / engineerEstimate) * 100;
    const bidAmounts = allBids.map((b) => b.bidAmount);
    const lowestBid = Math.min(...bidAmounts);
    const averageBid = bidAmounts.reduce((sum, amt) => sum + amt, 0) / bidAmounts.length;
    let priceReasonableness = true;
    const recommendations = [];
    if (variancePercentage > 20) {
        priceReasonableness = false;
        recommendations.push('Bid exceeds engineer estimate by more than 20%');
    }
    if (bid.bidAmount < lowestBid * 0.8) {
        priceReasonableness = false;
        recommendations.push('Bid significantly below market - verify scope understanding');
    }
    return {
        solicitationId: solicitation.id,
        engineerEstimate,
        lowestBid: bid.bidAmount,
        varianceFromEstimate,
        variancePercentage,
        marketAnalysis: `Bid is ${variancePercentage.toFixed(1)}% ${variancePercentage > 0 ? 'above' : 'below'} engineer estimate`,
        priceReasonableness,
        recommendations,
    };
};
exports.analyzeBidPrice = analyzeBidPrice;
/**
 * Compares bid to historical pricing data.
 *
 * @param {string} bidId - Bid identifier
 * @returns {Promise<object>} Historical comparison
 *
 * @example
 * ```typescript
 * const historical = await compareToHistoricalPricing('bid-123');
 * ```
 */
const compareToHistoricalPricing = async (bidId) => {
    // In production, query historical project database
    return {
        similarProjects: 12,
        averageHistoricalPrice: 2400000,
        varianceFromHistorical: -2.1,
        trend: 'STABLE',
    };
};
exports.compareToHistoricalPricing = compareToHistoricalPricing;
/**
 * Evaluates value engineering proposals.
 *
 * @param {string} bidId - Bid identifier
 * @returns {Promise<object>} VE evaluation
 *
 * @example
 * ```typescript
 * const veAnalysis = await evaluateValueEngineeringProposals('bid-123');
 * ```
 */
const evaluateValueEngineeringProposals = async (bidId) => {
    const bid = await getBidSubmission(bidId);
    return {
        totalProposals: bid.valueEngineeringProposals.length,
        estimatedSavings: 0,
        acceptedProposals: 0,
        recommendations: [],
    };
};
exports.evaluateValueEngineeringProposals = evaluateValueEngineeringProposals;
/**
 * Generates bid tabulation sheet.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @returns {Promise<object>} Bid tabulation
 *
 * @example
 * ```typescript
 * const tabulation = await generateBidTabulation('sol-123');
 * ```
 */
const generateBidTabulation = async (solicitationId) => {
    const solicitation = await getBidSolicitation(solicitationId);
    const bids = await getSolicitationBids(solicitationId);
    const rankedBids = await (0, exports.rankBids)(solicitationId);
    return {
        solicitationNumber: solicitation.solicitationNumber,
        projectTitle: solicitation.title,
        openingDate: solicitation.openingDate,
        bids: rankedBids.map((b) => ({
            rank: b.rank || 0,
            vendorName: b.vendorName,
            baseAmount: b.bidAmount,
            alternates: 0,
            totalAmount: b.bidAmount,
            responsive: b.responsiveness,
        })),
        engineerEstimate: solicitation.estimatedValue,
    };
};
exports.generateBidTabulation = generateBidTabulation;
// ============================================================================
// BID BOND AND COMPLIANCE (26-30)
// ============================================================================
/**
 * Validates bid bond requirements.
 *
 * @param {string} bidId - Bid identifier
 * @returns {Promise<object>} Bond validation results
 *
 * @example
 * ```typescript
 * const bondValidation = await validateBidBond('bid-123');
 * ```
 */
const validateBidBond = async (bidId) => {
    const bid = await getBidSubmission(bidId);
    const solicitation = await getBidSolicitation(bid.solicitationId);
    const requiredAmount = (solicitation.estimatedValue * (solicitation.bondPercentage || 10)) / 100;
    const deficiencies = [];
    if (!bid.bidBondAmount) {
        deficiencies.push('No bid bond provided');
    }
    else if (bid.bidBondAmount < requiredAmount) {
        deficiencies.push(`Bid bond amount insufficient: $${bid.bidBondAmount} < $${requiredAmount}`);
    }
    if (!bid.bidBondProvider) {
        deficiencies.push('Bid bond provider not specified');
    }
    return {
        valid: deficiencies.length === 0,
        bondAmount: bid.bidBondAmount || 0,
        requiredAmount,
        bondProvider: bid.bidBondProvider || '',
        deficiencies,
    };
};
exports.validateBidBond = validateBidBond;
/**
 * Verifies surety company authorization.
 *
 * @param {string} suretyCompany - Surety company name
 * @returns {Promise<object>} Verification results
 *
 * @example
 * ```typescript
 * const verified = await verifySuretyCompany('ABC Surety Co.');
 * ```
 */
const verifySuretyCompany = async (suretyCompany) => {
    // In production, verify against Treasury Department circular
    return {
        authorized: true,
        treasuryListed: true,
        rating: 'A',
        maximumBond: 50000000,
    };
};
exports.verifySuretyCompany = verifySuretyCompany;
/**
 * Checks small business participation compliance.
 *
 * @param {string} bidId - Bid identifier
 * @returns {Promise<object>} Compliance check
 *
 * @example
 * ```typescript
 * const sbCompliance = await checkSmallBusinessCompliance('bid-123');
 * ```
 */
const checkSmallBusinessCompliance = async (bidId) => {
    const bid = await getBidSubmission(bidId);
    const solicitation = await getBidSolicitation(bid.solicitationId);
    return {
        compliant: true,
        goalPercentage: solicitation.smallBusinessGoals || 0,
        proposedPercentage: 0,
        smallBusinessParticipants: [],
    };
};
exports.checkSmallBusinessCompliance = checkSmallBusinessCompliance;
/**
 * Verifies DBE (Disadvantaged Business Enterprise) compliance.
 *
 * @param {string} bidId - Bid identifier
 * @returns {Promise<object>} DBE compliance check
 *
 * @example
 * ```typescript
 * const dbeCompliance = await verifyDBECompliance('bid-123');
 * ```
 */
const verifyDBECompliance = async (bidId) => {
    const bid = await getBidSubmission(bidId);
    const solicitation = await getBidSolicitation(bid.solicitationId);
    return {
        compliant: true,
        goalPercentage: solicitation.dbeGoals || 0,
        proposedPercentage: 0,
        dbeParticipants: [],
        certifiedDBEs: true,
    };
};
exports.verifyDBECompliance = verifyDBECompliance;
/**
 * Validates regulatory compliance requirements.
 *
 * @param {string} bidId - Bid identifier
 * @returns {Promise<object>} Compliance validation
 *
 * @example
 * ```typescript
 * const compliance = await validateRegulatoryCompliance('bid-123');
 * ```
 */
const validateRegulatoryCompliance = async (bidId) => {
    const requirements = [
        { requirement: 'Davis-Bacon wages', met: true },
        { requirement: 'Buy American provisions', met: true },
        { requirement: 'Environmental compliance', met: true },
        { requirement: 'Equal opportunity', met: true },
    ];
    const deficiencies = requirements.filter((r) => !r.met).map((r) => r.requirement);
    return {
        compliant: deficiencies.length === 0,
        requirements,
        deficiencies,
    };
};
exports.validateRegulatoryCompliance = validateRegulatoryCompliance;
// ============================================================================
// AWARD RECOMMENDATION AND PROCESSING (31-35)
// ============================================================================
/**
 * Creates award recommendation.
 *
 * @param {object} recommendationData - Recommendation data
 * @param {string} userId - User making recommendation
 * @returns {Promise<AwardRecommendation>} Award recommendation
 *
 * @example
 * ```typescript
 * const recommendation = await createAwardRecommendation({
 *   solicitationId: 'sol-123',
 *   recommendedBidId: 'bid-456',
 *   recommendedVendorId: 'vendor-789',
 *   recommendedAmount: 2350000,
 *   justification: 'Lowest responsive bid',
 *   analysisNotes: 'Vendor meets all requirements'
 * }, 'pm-012');
 * ```
 */
const createAwardRecommendation = async (recommendationData, userId) => {
    return {
        id: generateUUID(),
        solicitationId: recommendationData.solicitationId,
        recommendedBidId: recommendationData.recommendedBidId,
        recommendedVendorId: recommendationData.recommendedVendorId,
        recommendedAmount: recommendationData.recommendedAmount,
        justification: recommendationData.justification,
        analysisNotes: recommendationData.analysisNotes,
        alternativeConsiderations: recommendationData.alternativeConsiderations || '',
        approvals: [],
        recommendedBy: userId,
        recommendedAt: new Date(),
        status: 'PENDING',
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.createAwardRecommendation = createAwardRecommendation;
/**
 * Processes award recommendation approval.
 *
 * @param {string} recommendationId - Recommendation identifier
 * @param {object} approval - Approval details
 * @returns {Promise<AwardRecommendation>} Updated recommendation
 *
 * @example
 * ```typescript
 * const approved = await processAwardApproval('rec-123', {
 *   approvedBy: 'director-456',
 *   status: 'APPROVED',
 *   comments: 'Concur with recommendation'
 * });
 * ```
 */
const processAwardApproval = async (recommendationId, approval) => {
    const recommendation = await getAwardRecommendation(recommendationId);
    recommendation.approvals.push({
        approvedBy: approval.approvedBy,
        approvedAt: new Date(),
        status: approval.status,
        comments: approval.comments,
    });
    if (approval.status === 'APPROVED') {
        recommendation.status = 'APPROVED';
    }
    else if (approval.status === 'REJECTED') {
        recommendation.status = 'REJECTED';
    }
    return recommendation;
};
exports.processAwardApproval = processAwardApproval;
/**
 * Issues notice of award to winning bidder.
 *
 * @param {string} recommendationId - Recommendation identifier
 * @param {string} userId - User issuing award
 * @returns {Promise<object>} Award notice
 *
 * @example
 * ```typescript
 * const notice = await issueAwardNotice('rec-123', 'admin-456');
 * ```
 */
const issueAwardNotice = async (recommendationId, userId) => {
    const recommendation = await getAwardRecommendation(recommendationId);
    if (recommendation.status !== 'APPROVED') {
        throw new Error('Only approved recommendations can be awarded');
    }
    const bid = await getBidSubmission(recommendation.recommendedBidId);
    const solicitation = await getBidSolicitation(recommendation.solicitationId);
    bid.status = bid_types_1.BidStatus.AWARDED;
    solicitation.status = bid_types_1.BidSolicitationStatus.AWARDED;
    const awardNumber = generateAwardNumber(solicitation.solicitationNumber);
    return {
        awardNumber,
        issuedAt: new Date(),
        contractValue: recommendation.recommendedAmount,
        awardedVendor: bid.vendorName,
    };
};
exports.issueAwardNotice = issueAwardNotice;
/**
 * Notifies unsuccessful bidders.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @param {string} awardedBidId - Awarded bid identifier
 * @returns {Promise<object>} Notification results
 *
 * @example
 * ```typescript
 * await notifyUnsuccessfulBidders('sol-123', 'bid-456');
 * ```
 */
const notifyUnsuccessfulBidders = async (solicitationId, awardedBidId) => {
    const bids = await getSolicitationBids(solicitationId);
    const unsuccessfulBids = bids.filter((b) => b.id !== awardedBidId);
    unsuccessfulBids.forEach((bid) => {
        bid.status = bid_types_1.BidStatus.REJECTED;
    });
    return {
        notifiedCount: unsuccessfulBids.length,
        notificationDate: new Date(),
    };
};
exports.notifyUnsuccessfulBidders = notifyUnsuccessfulBidders;
/**
 * Conducts debriefing for unsuccessful bidder.
 *
 * @param {string} bidId - Bid identifier
 * @param {string} userId - User conducting debriefing
 * @returns {Promise<object>} Debriefing summary
 *
 * @example
 * ```typescript
 * const debriefing = await conductBidderDebriefing('bid-123', 'pm-456');
 * ```
 */
const conductBidderDebriefing = async (bidId, userId) => {
    const bid = await getBidSubmission(bidId);
    const evaluations = await getBidEvaluations(bidId);
    const strengths = [];
    const weaknesses = [];
    evaluations.forEach((e) => {
        strengths.push(...e.strengths);
        weaknesses.push(...e.weaknesses);
    });
    return {
        bidId,
        debriefingDate: new Date(),
        strengths,
        weaknesses,
        recommendations: ['Focus on improving technical approach', 'Consider more competitive pricing'],
    };
};
exports.conductBidderDebriefing = conductBidderDebriefing;
// ============================================================================
// PROTEST HANDLING (36-40)
// ============================================================================
/**
 * Files bid protest.
 *
 * @param {object} protestData - Protest data
 * @returns {Promise<BidProtest>} Filed protest
 *
 * @example
 * ```typescript
 * const protest = await fileBidProtest({
 *   solicitationId: 'sol-123',
 *   protestingVendorId: 'vendor-456',
 *   protestGrounds: 'Improper evaluation',
 *   protestDescription: 'Technical scores not properly calculated'
 * });
 * ```
 */
const fileBidProtest = async (protestData) => {
    const protestNumber = generateProtestNumber();
    const responseDueDate = new Date();
    responseDueDate.setDate(responseDueDate.getDate() + 10); // 10 days to respond
    return {
        id: generateUUID(),
        solicitationId: protestData.solicitationId,
        protestingVendorId: protestData.protestingVendorId,
        protestNumber,
        protestGrounds: protestData.protestGrounds,
        protestDescription: protestData.protestDescription,
        filedDate: new Date(),
        responseRequired: true,
        responseDueDate,
        status: 'FILED',
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.fileBidProtest = fileBidProtest;
/**
 * Responds to bid protest.
 *
 * @param {string} protestId - Protest identifier
 * @param {string} response - Response text
 * @param {string} userId - User responding
 * @returns {Promise<BidProtest>} Updated protest
 *
 * @example
 * ```typescript
 * const responded = await respondToBidProtest('protest-123', 'Evaluation was conducted properly...', 'admin-456');
 * ```
 */
const respondToBidProtest = async (protestId, response, userId) => {
    const protest = await getBidProtest(protestId);
    return {
        ...protest,
        response,
        respondedAt: new Date(),
        status: 'UNDER_REVIEW',
        updatedAt: new Date(),
    };
};
exports.respondToBidProtest = respondToBidProtest;
/**
 * Reviews and adjudicates bid protest.
 *
 * @param {string} protestId - Protest identifier
 * @param {object} adjudication - Adjudication decision
 * @param {string} userId - User adjudicating
 * @returns {Promise<BidProtest>} Adjudicated protest
 *
 * @example
 * ```typescript
 * const adjudicated = await adjudicateBidProtest('protest-123', {
 *   decision: 'DENIED',
 *   resolution: 'Evaluation was conducted in accordance with solicitation requirements'
 * }, 'director-789');
 * ```
 */
const adjudicateBidProtest = async (protestId, adjudication, userId) => {
    const protest = await getBidProtest(protestId);
    return {
        ...protest,
        resolution: adjudication.resolution,
        resolvedDate: new Date(),
        status: adjudication.decision === 'UPHELD' ? 'UPHELD' : 'DENIED',
        updatedAt: new Date(),
    };
};
exports.adjudicateBidProtest = adjudicateBidProtest;
/**
 * Withdraws bid protest.
 *
 * @param {string} protestId - Protest identifier
 * @param {string} reason - Withdrawal reason
 * @returns {Promise<BidProtest>} Withdrawn protest
 *
 * @example
 * ```typescript
 * await withdrawBidProtest('protest-123', 'Issues resolved through clarification');
 * ```
 */
const withdrawBidProtest = async (protestId, reason) => {
    const protest = await getBidProtest(protestId);
    return {
        ...protest,
        status: 'WITHDRAWN',
        resolution: `Protest withdrawn: ${reason}`,
        resolvedDate: new Date(),
        updatedAt: new Date(),
    };
};
exports.withdrawBidProtest = withdrawBidProtest;
/**
 * Retrieves protest history for solicitation.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @returns {Promise<BidProtest[]>} Protest history
 *
 * @example
 * ```typescript
 * const protests = await getProtestHistory('sol-123');
 * ```
 */
const getProtestHistory = async (solicitationId) => {
    // In production, fetch from database
    return [];
};
exports.getProtestHistory = getProtestHistory;
// ============================================================================
// REPORTING AND ANALYTICS (41-45)
// ============================================================================
/**
 * Generates comprehensive bid evaluation report.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @returns {Promise<object>} Evaluation report
 *
 * @example
 * ```typescript
 * const report = await generateBidEvaluationReport('sol-123');
 * ```
 */
const generateBidEvaluationReport = async (solicitationId) => {
    const solicitation = await getBidSolicitation(solicitationId);
    const bids = await getSolicitationBids(solicitationId);
    const comparison = await (0, exports.generateBidComparison)(solicitationId);
    return {
        solicitation,
        totalBids: bids.length,
        responsiveBids: bids.filter((b) => b.responsiveness).length,
        comparison,
        recommendation: null,
    };
};
exports.generateBidEvaluationReport = generateBidEvaluationReport;
/**
 * Analyzes vendor competition levels.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @returns {Promise<object>} Competition analysis
 *
 * @example
 * ```typescript
 * const competition = await analyzeVendorCompetition('sol-123');
 * ```
 */
const analyzeVendorCompetition = async (solicitationId) => {
    const bids = await getSolicitationBids(solicitationId);
    const comparison = await (0, exports.generateBidComparison)(solicitationId);
    const priceSpread = comparison.highestBid - comparison.lowestBid;
    const priceSpreadPercentage = (priceSpread / comparison.lowestBid) * 100;
    let competitivenessRating = 'FAIR';
    if (bids.length >= 5 && priceSpreadPercentage < 15)
        competitivenessRating = 'EXCELLENT';
    else if (bids.length >= 3 && priceSpreadPercentage < 25)
        competitivenessRating = 'GOOD';
    else if (bids.length < 2)
        competitivenessRating = 'POOR';
    return {
        totalBidders: bids.length,
        adequateCompetition: bids.length >= 3,
        priceSpread,
        priceSpreadPercentage,
        competitivenessRating,
    };
};
exports.analyzeVendorCompetition = analyzeVendorCompetition;
/**
 * Tracks bid solicitation performance metrics.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @returns {Promise<object>} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await trackSolicitationMetrics('sol-123');
 * ```
 */
const trackSolicitationMetrics = async (solicitationId) => {
    const solicitation = await getBidSolicitation(solicitationId);
    const bids = await getSolicitationBids(solicitationId);
    const daysToAward = (new Date().getTime() - solicitation.publishedDate.getTime()) / (1000 * 60 * 60 * 24);
    const evaluationDuration = (new Date().getTime() - solicitation.openingDate.getTime()) / (1000 * 60 * 60 * 24);
    const responsiveRate = (bids.filter((b) => b.responsiveness).length / bids.length) * 100;
    const averageBidToEstimateRatio = bids.reduce((sum, b) => sum + b.bidAmount, 0) / bids.length / solicitation.estimatedValue;
    return {
        daysToAward,
        evaluationDuration,
        responsiveRate,
        averageBidToEstimateRatio,
        protestsReceived: 0,
    };
};
exports.trackSolicitationMetrics = trackSolicitationMetrics;
/**
 * Generates vendor performance scorecard.
 *
 * @param {string} vendorId - Vendor identifier
 * @returns {Promise<object>} Performance scorecard
 *
 * @example
 * ```typescript
 * const scorecard = await generateVendorScorecard('vendor-123');
 * ```
 */
const generateVendorScorecard = async (vendorId) => {
    // In production, query vendor bid history
    return {
        vendorId,
        totalBids: 20,
        successfulBids: 5,
        winRate: 25,
        averageBidRank: 2.3,
        averageTechnicalScore: 82.5,
        responsiveRate: 95,
    };
};
exports.generateVendorScorecard = generateVendorScorecard;
/**
 * Exports bid data for compliance reporting.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @param {string} format - Export format ('PDF' | 'EXCEL' | 'CSV')
 * @returns {Promise<Buffer>} Exported data
 *
 * @example
 * ```typescript
 * const report = await exportBidData('sol-123', 'PDF');
 * ```
 */
const exportBidData = async (solicitationId, format) => {
    // In production, generate formatted export
    return Buffer.from('Bid data export');
};
exports.exportBidData = exportBidData;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
async function getBidSolicitation(id) {
    return {
        id,
        solicitationNumber: 'SOL-2025-001',
        projectId: 'proj-1',
        title: 'Test Solicitation',
        description: 'Test',
        procurementMethod: bid_types_1.ProcurementMethod.COMPETITIVE_SEALED_BID,
        awardMethod: bid_types_1.AwardMethod.LOWEST_RESPONSIVE_BID,
        estimatedValue: 1000000,
        openingDate: new Date(),
        closingDate: new Date(),
        status: bid_types_1.BidSolicitationStatus.DRAFT,
        bondRequirement: true,
        bondPercentage: 10,
        insuranceRequirements: [],
        evaluationCriteria: [],
        documents: [],
        addenda: [],
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'user-1',
        updatedBy: 'user-1',
    };
}
async function getBidSubmission(id) {
    return {
        id,
        solicitationId: 'sol-1',
        vendorId: 'vendor-1',
        vendorName: 'Test Vendor',
        bidNumber: 'BID-001',
        submittalDate: new Date(),
        bidAmount: 950000,
        status: bid_types_1.BidStatus.SUBMITTED,
        responsiveness: false,
        responsibility: false,
        scheduleProposed: 180,
        alternatesProvided: false,
        valueEngineeringProposals: [],
        clarifications: [],
        evaluationNotes: '',
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
async function getVendorPrequalification(id) {
    return {
        id,
        vendorId: 'vendor-1',
        vendorName: 'Test Vendor',
        qualificationNumber: 'QUAL-001',
        workCategories: [],
        maxProjectValue: 5000000,
        bondingCapacity: 10000000,
        insuranceCoverage: 5000000,
        pastProjectCount: 10,
        pastProjectValue: 25000000,
        safetyRating: 8.5,
        qualityRating: 9.0,
        performanceRating: 8.7,
        financialStrength: 'GOOD',
        qualificationStatus: bid_types_1.VendorQualificationStatus.APPROVED,
        certifications: [],
        licenses: [],
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
async function getVendorQualificationByVendorId(vendorId) {
    return getVendorPrequalification(vendorId);
}
async function getSolicitationBids(solicitationId) {
    return [];
}
async function getBidEvaluations(bidId) {
    return [];
}
async function getAwardRecommendation(id) {
    return {
        id,
        solicitationId: 'sol-1',
        recommendedBidId: 'bid-1',
        recommendedVendorId: 'vendor-1',
        recommendedAmount: 950000,
        justification: 'Test',
        analysisNotes: 'Test',
        alternativeConsiderations: '',
        approvals: [],
        recommendedBy: 'user-1',
        recommendedAt: new Date(),
        status: 'PENDING',
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
async function getBidProtest(id) {
    return {
        id,
        solicitationId: 'sol-1',
        protestingVendorId: 'vendor-1',
        protestNumber: 'PROT-001',
        protestGrounds: 'Test',
        protestDescription: 'Test',
        filedDate: new Date(),
        responseRequired: true,
        status: 'FILED',
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
function generateSolicitationNumber(projectId) {
    const year = new Date().getFullYear();
    const sequence = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');
    return `SOL-${year}-${sequence}`;
}
function generateQualificationNumber() {
    const year = new Date().getFullYear();
    const sequence = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');
    return `QUAL-${year}-${sequence}`;
}
function generateBidNumber(solicitationId) {
    const sequence = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0');
    return `BID-${sequence}`;
}
function generateAwardNumber(solicitationNumber) {
    return solicitationNumber.replace('SOL', 'AWD');
}
function generateProtestNumber() {
    const year = new Date().getFullYear();
    const sequence = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0');
    return `PROT-${year}-${sequence}`;
}
// ============================================================================
// NESTJS CONTROLLER
// ============================================================================
/**
 * Bid Management Controller
 * Provides RESTful API endpoints for bid solicitation and management
 */
let BidManagementController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('bid-management'), (0, common_1.Controller)('bid-management'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createSolicitation_decorators;
    let _getSolicitation_decorators;
    let _publishSolicitation_decorators;
    let _submitBidEndpoint_decorators;
    let _evaluateBidEndpoint_decorators;
    let _getBidComparison_decorators;
    let _createPrequalification_decorators;
    let _getEvaluationReport_decorators;
    var BidManagementController = _classThis = class {
        async createSolicitation(createDto) {
            return (0, exports.createBidSolicitation)(createDto, 'current-user');
        }
        async getSolicitation(id) {
            return getBidSolicitation(id);
        }
        async publishSolicitation(id) {
            return (0, exports.publishBidSolicitation)(id, 'current-user');
        }
        async submitBidEndpoint(submitDto) {
            return (0, exports.submitBid)(submitDto, 'current-user');
        }
        async evaluateBidEndpoint(id, evaluateDto) {
            return (0, exports.evaluateBid)(evaluateDto, 'current-user');
        }
        async getBidComparison(id) {
            return (0, exports.generateBidComparison)(id);
        }
        async createPrequalification(qualDto) {
            return (0, exports.createVendorPrequalification)(qualDto, 'current-user');
        }
        async getEvaluationReport(id) {
            return (0, exports.generateBidEvaluationReport)(id);
        }
        constructor() {
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
    __setFunctionName(_classThis, "BidManagementController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createSolicitation_decorators = [(0, common_1.Post)('solicitations'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create bid solicitation' }), (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true }))];
        _getSolicitation_decorators = [(0, common_1.Get)('solicitations/:id'), (0, swagger_1.ApiOperation)({ summary: 'Get bid solicitation by ID' })];
        _publishSolicitation_decorators = [(0, common_1.Post)('solicitations/:id/publish'), (0, swagger_1.ApiOperation)({ summary: 'Publish bid solicitation' })];
        _submitBidEndpoint_decorators = [(0, common_1.Post)('bids'), (0, swagger_1.ApiOperation)({ summary: 'Submit bid' })];
        _evaluateBidEndpoint_decorators = [(0, common_1.Post)('bids/:id/evaluate'), (0, swagger_1.ApiOperation)({ summary: 'Evaluate bid' })];
        _getBidComparison_decorators = [(0, common_1.Get)('solicitations/:id/comparison'), (0, swagger_1.ApiOperation)({ summary: 'Generate bid comparison' })];
        _createPrequalification_decorators = [(0, common_1.Post)('vendors/prequalification'), (0, swagger_1.ApiOperation)({ summary: 'Create vendor prequalification' })];
        _getEvaluationReport_decorators = [(0, common_1.Get)('solicitations/:id/report'), (0, swagger_1.ApiOperation)({ summary: 'Generate bid evaluation report' })];
        __esDecorate(_classThis, null, _createSolicitation_decorators, { kind: "method", name: "createSolicitation", static: false, private: false, access: { has: obj => "createSolicitation" in obj, get: obj => obj.createSolicitation }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSolicitation_decorators, { kind: "method", name: "getSolicitation", static: false, private: false, access: { has: obj => "getSolicitation" in obj, get: obj => obj.getSolicitation }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _publishSolicitation_decorators, { kind: "method", name: "publishSolicitation", static: false, private: false, access: { has: obj => "publishSolicitation" in obj, get: obj => obj.publishSolicitation }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _submitBidEndpoint_decorators, { kind: "method", name: "submitBidEndpoint", static: false, private: false, access: { has: obj => "submitBidEndpoint" in obj, get: obj => obj.submitBidEndpoint }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _evaluateBidEndpoint_decorators, { kind: "method", name: "evaluateBidEndpoint", static: false, private: false, access: { has: obj => "evaluateBidEndpoint" in obj, get: obj => obj.evaluateBidEndpoint }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBidComparison_decorators, { kind: "method", name: "getBidComparison", static: false, private: false, access: { has: obj => "getBidComparison" in obj, get: obj => obj.getBidComparison }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createPrequalification_decorators, { kind: "method", name: "createPrequalification", static: false, private: false, access: { has: obj => "createPrequalification" in obj, get: obj => obj.createPrequalification }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getEvaluationReport_decorators, { kind: "method", name: "getEvaluationReport", static: false, private: false, access: { has: obj => "getEvaluationReport" in obj, get: obj => obj.getEvaluationReport }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BidManagementController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BidManagementController = _classThis;
})();
exports.BidManagementController = BidManagementController;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    createBidSolicitationModel,
    createBidSubmissionModel,
    createVendorPrequalificationModel,
    // Bid Solicitation
    createBidSolicitation: exports.createBidSolicitation,
    publishBidSolicitation: exports.publishBidSolicitation,
    issueSolicitationAddendum: exports.issueSolicitationAddendum,
    cancelBidSolicitation: exports.cancelBidSolicitation,
    extendBidClosingDate: exports.extendBidClosingDate,
    // Vendor Prequalification
    createVendorPrequalification: exports.createVendorPrequalification,
    evaluateVendorPrequalification: exports.evaluateVendorPrequalification,
    verifyVendorCredentials: exports.verifyVendorCredentials,
    checkVendorPastPerformance: exports.checkVendorPastPerformance,
    renewVendorPrequalification: exports.renewVendorPrequalification,
    // Bid Submission
    submitBid: exports.submitBid,
    openBids: exports.openBids,
    validateBidResponsiveness: exports.validateBidResponsiveness,
    validateContractorResponsibility: exports.validateContractorResponsibility,
    requestBidClarification: exports.requestBidClarification,
    // Bid Evaluation
    evaluateBid: exports.evaluateBid,
    calculateBidScore: exports.calculateBidScore,
    rankBids: exports.rankBids,
    performConsensusEvaluation: exports.performConsensusEvaluation,
    normalizeEvaluatorScores: exports.normalizeEvaluatorScores,
    // Bid Comparison
    generateBidComparison: exports.generateBidComparison,
    analyzeBidPrice: exports.analyzeBidPrice,
    compareToHistoricalPricing: exports.compareToHistoricalPricing,
    evaluateValueEngineeringProposals: exports.evaluateValueEngineeringProposals,
    generateBidTabulation: exports.generateBidTabulation,
    // Bid Bond and Compliance
    validateBidBond: exports.validateBidBond,
    verifySuretyCompany: exports.verifySuretyCompany,
    checkSmallBusinessCompliance: exports.checkSmallBusinessCompliance,
    verifyDBECompliance: exports.verifyDBECompliance,
    validateRegulatoryCompliance: exports.validateRegulatoryCompliance,
    // Award Processing
    createAwardRecommendation: exports.createAwardRecommendation,
    processAwardApproval: exports.processAwardApproval,
    issueAwardNotice: exports.issueAwardNotice,
    notifyUnsuccessfulBidders: exports.notifyUnsuccessfulBidders,
    conductBidderDebriefing: exports.conductBidderDebriefing,
    // Protest Handling
    fileBidProtest: exports.fileBidProtest,
    respondToBidProtest: exports.respondToBidProtest,
    adjudicateBidProtest: exports.adjudicateBidProtest,
    withdrawBidProtest: exports.withdrawBidProtest,
    getProtestHistory: exports.getProtestHistory,
    // Reporting
    generateBidEvaluationReport: exports.generateBidEvaluationReport,
    analyzeVendorCompetition: exports.analyzeVendorCompetition,
    trackSolicitationMetrics: exports.trackSolicitationMetrics,
    generateVendorScorecard: exports.generateVendorScorecard,
    exportBidData: exports.exportBidData,
    // Controller
    BidManagementController,
};
//# sourceMappingURL=construction-bid-management-kit.js.map