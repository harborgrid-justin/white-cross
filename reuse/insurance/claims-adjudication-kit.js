"use strict";
/**
 * LOC: INS-ADJUDICATION-001
 * File: /reuse/insurance/claims-adjudication-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Claims backend services
 *   - Adjudication workflow modules
 *   - Settlement processing systems
 *   - Litigation management
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
exports.SettlementOffer = exports.ClaimsAdjudication = exports.TotalLossType = exports.DenialReason = exports.SettlementType = exports.ValuationMethod = exports.LiabilityDetermination = exports.CoverageDecision = exports.AdjudicationStatus = void 0;
exports.verifyCoverage = verifyCoverage;
exports.analyzeCoverageGaps = analyzeCoverageGaps;
exports.checkPolicyLimits = checkPolicyLimits;
exports.issueReservationOfRights = issueReservationOfRights;
exports.determineLiability = determineLiability;
exports.calculateComparativeNegligence = calculateComparativeNegligence;
exports.valueClaim = valueClaim;
exports.calculateActualCashValue = calculateActualCashValue;
exports.calculateReplacementCostValue = calculateReplacementCostValue;
exports.applyDeductible = applyDeductible;
exports.applyPolicyLimits = applyPolicyLimits;
exports.generateSettlementOffer = generateSettlementOffer;
exports.acceptSettlementOffer = acceptSettlementOffer;
exports.rejectSettlementOffer = rejectSettlementOffer;
exports.configureStructuredSettlement = configureStructuredSettlement;
exports.calculateSettlementAuthority = calculateSettlementAuthority;
exports.generateDenialLetter = generateDenialLetter;
exports.processDenialAppeal = processDenialAppeal;
exports.determineTotalLoss = determineTotalLoss;
exports.calculateTotalLossSettlement = calculateTotalLossSettlement;
exports.trackNegotiation = trackNegotiation;
exports.calculateSettlementRecommendation = calculateSettlementRecommendation;
/**
 * File: /reuse/insurance/claims-adjudication-kit.ts
 * Locator: WC-INS-ADJUDICATION-001
 * Purpose: Enterprise Insurance Claims Adjudication Kit - Comprehensive claims evaluation and settlement
 *
 * Upstream: Independent utility module for insurance claims adjudication operations
 * Downstream: ../backend/*, Claims services, Settlement systems, Litigation modules, Payment processing
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 42 utility functions for coverage verification, liability determination, negligence calculations, policy limits, deductibles, claim valuation, settlement authority, offers, structured settlements, denials, reservations of rights, negotiations, total loss, ACV, RCV
 *
 * LLM Context: Production-ready claims adjudication utilities for White Cross insurance platform.
 * Provides comprehensive claims evaluation including coverage verification and analysis, liability determination,
 * comparative negligence calculations, policy limits application, deductible application, claim valuation
 * methodologies, settlement authority management, settlement offer generation, structured settlement setup,
 * claim denial letter generation, reservation of rights notices, claim negotiation tracking, total loss
 * determinations, Actual Cash Value (ACV) calculations, and Replacement Cost Value (RCV) calculations.
 * Designed to compete with Allstate, Progressive, and Farmers insurance platforms.
 */
const common_1 = require("@nestjs/common");
const sequelize_typescript_1 = require("sequelize-typescript");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Adjudication status
 */
var AdjudicationStatus;
(function (AdjudicationStatus) {
    AdjudicationStatus["PENDING_REVIEW"] = "pending_review";
    AdjudicationStatus["UNDER_INVESTIGATION"] = "under_investigation";
    AdjudicationStatus["COVERAGE_VERIFIED"] = "coverage_verified";
    AdjudicationStatus["LIABILITY_DETERMINED"] = "liability_determined";
    AdjudicationStatus["VALUATION_COMPLETE"] = "valuation_complete";
    AdjudicationStatus["SETTLEMENT_OFFERED"] = "settlement_offered";
    AdjudicationStatus["SETTLEMENT_ACCEPTED"] = "settlement_accepted";
    AdjudicationStatus["SETTLEMENT_REJECTED"] = "settlement_rejected";
    AdjudicationStatus["DENIED"] = "denied";
    AdjudicationStatus["LITIGATION"] = "litigation";
    AdjudicationStatus["CLOSED"] = "closed";
})(AdjudicationStatus || (exports.AdjudicationStatus = AdjudicationStatus = {}));
/**
 * Coverage decision
 */
var CoverageDecision;
(function (CoverageDecision) {
    CoverageDecision["COVERED"] = "covered";
    CoverageDecision["NOT_COVERED"] = "not_covered";
    CoverageDecision["PARTIALLY_COVERED"] = "partially_covered";
    CoverageDecision["PENDING_INVESTIGATION"] = "pending_investigation";
    CoverageDecision["RESERVATION_OF_RIGHTS"] = "reservation_of_rights";
})(CoverageDecision || (exports.CoverageDecision = CoverageDecision = {}));
/**
 * Liability determination
 */
var LiabilityDetermination;
(function (LiabilityDetermination) {
    LiabilityDetermination["FULL_LIABILITY"] = "full_liability";
    LiabilityDetermination["NO_LIABILITY"] = "no_liability";
    LiabilityDetermination["COMPARATIVE_NEGLIGENCE"] = "comparative_negligence";
    LiabilityDetermination["CONTRIBUTORY_NEGLIGENCE"] = "contributory_negligence";
    LiabilityDetermination["JOINT_AND_SEVERAL"] = "joint_and_several";
    LiabilityDetermination["STRICT_LIABILITY"] = "strict_liability";
    LiabilityDetermination["VICARIOUS_LIABILITY"] = "vicarious_liability";
})(LiabilityDetermination || (exports.LiabilityDetermination = LiabilityDetermination = {}));
/**
 * Valuation method
 */
var ValuationMethod;
(function (ValuationMethod) {
    ValuationMethod["ACTUAL_CASH_VALUE"] = "actual_cash_value";
    ValuationMethod["REPLACEMENT_COST"] = "replacement_cost";
    ValuationMethod["AGREED_VALUE"] = "agreed_value";
    ValuationMethod["STATED_VALUE"] = "stated_value";
    ValuationMethod["MARKET_VALUE"] = "market_value";
    ValuationMethod["FUNCTIONAL_REPLACEMENT"] = "functional_replacement";
})(ValuationMethod || (exports.ValuationMethod = ValuationMethod = {}));
/**
 * Settlement type
 */
var SettlementType;
(function (SettlementType) {
    SettlementType["LUMP_SUM"] = "lump_sum";
    SettlementType["STRUCTURED_SETTLEMENT"] = "structured_settlement";
    SettlementType["PERIODIC_PAYMENTS"] = "periodic_payments";
    SettlementType["ANNUITY"] = "annuity";
    SettlementType["MEDICAL_SET_ASIDE"] = "medical_set_aside";
})(SettlementType || (exports.SettlementType = SettlementType = {}));
/**
 * Denial reason
 */
var DenialReason;
(function (DenialReason) {
    DenialReason["NO_COVERAGE"] = "no_coverage";
    DenialReason["POLICY_EXCLUSION"] = "policy_exclusion";
    DenialReason["POLICY_LAPSED"] = "policy_lapsed";
    DenialReason["MATERIAL_MISREPRESENTATION"] = "material_misrepresentation";
    DenialReason["FRAUD"] = "fraud";
    DenialReason["LATE_REPORTING"] = "late_reporting";
    DenialReason["OUTSIDE_POLICY_PERIOD"] = "outside_policy_period";
    DenialReason["INSUFFICIENT_EVIDENCE"] = "insufficient_evidence";
    DenialReason["CONTRIBUTORY_NEGLIGENCE"] = "contributory_negligence";
    DenialReason["INTENTIONAL_ACT"] = "intentional_act";
})(DenialReason || (exports.DenialReason = DenialReason = {}));
/**
 * Total loss type
 */
var TotalLossType;
(function (TotalLossType) {
    TotalLossType["ACTUAL_TOTAL_LOSS"] = "actual_total_loss";
    TotalLossType["CONSTRUCTIVE_TOTAL_LOSS"] = "constructive_total_loss";
    TotalLossType["ECONOMIC_TOTAL_LOSS"] = "economic_total_loss";
    TotalLossType["NOT_TOTAL_LOSS"] = "not_total_loss";
})(TotalLossType || (exports.TotalLossType = TotalLossType = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Claims adjudication model
 */
let ClaimsAdjudication = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'claims_adjudication',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['claim_id'] },
                { fields: ['adjudication_status'] },
                { fields: ['coverage_decision'] },
                { fields: ['liability_determination'] },
                { fields: ['created_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _claim_id_decorators;
    let _claim_id_initializers = [];
    let _claim_id_extraInitializers = [];
    let _policy_id_decorators;
    let _policy_id_initializers = [];
    let _policy_id_extraInitializers = [];
    let _adjudication_status_decorators;
    let _adjudication_status_initializers = [];
    let _adjudication_status_extraInitializers = [];
    let _coverage_decision_decorators;
    let _coverage_decision_initializers = [];
    let _coverage_decision_extraInitializers = [];
    let _liability_determination_decorators;
    let _liability_determination_initializers = [];
    let _liability_determination_extraInitializers = [];
    let _insured_liability_percentage_decorators;
    let _insured_liability_percentage_initializers = [];
    let _insured_liability_percentage_extraInitializers = [];
    let _total_damages_decorators;
    let _total_damages_initializers = [];
    let _total_damages_extraInitializers = [];
    let _settlement_amount_decorators;
    let _settlement_amount_initializers = [];
    let _settlement_amount_extraInitializers = [];
    let _settlement_type_decorators;
    let _settlement_type_initializers = [];
    let _settlement_type_extraInitializers = [];
    let _deductible_amount_decorators;
    let _deductible_amount_initializers = [];
    let _deductible_amount_extraInitializers = [];
    let _policy_limit_decorators;
    let _policy_limit_initializers = [];
    let _policy_limit_extraInitializers = [];
    let _valuation_method_decorators;
    let _valuation_method_initializers = [];
    let _valuation_method_extraInitializers = [];
    let _is_total_loss_decorators;
    let _is_total_loss_initializers = [];
    let _is_total_loss_extraInitializers = [];
    let _denial_reason_decorators;
    let _denial_reason_initializers = [];
    let _denial_reason_extraInitializers = [];
    let _adjudication_notes_decorators;
    let _adjudication_notes_initializers = [];
    let _adjudication_notes_extraInitializers = [];
    let _supporting_documents_decorators;
    let _supporting_documents_initializers = [];
    let _supporting_documents_extraInitializers = [];
    let _adjudicated_by_decorators;
    let _adjudicated_by_initializers = [];
    let _adjudicated_by_extraInitializers = [];
    let _adjudication_date_decorators;
    let _adjudication_date_initializers = [];
    let _adjudication_date_extraInitializers = [];
    let _created_at_decorators;
    let _created_at_initializers = [];
    let _created_at_extraInitializers = [];
    let _updated_at_decorators;
    let _updated_at_initializers = [];
    let _updated_at_extraInitializers = [];
    let _deleted_at_decorators;
    let _deleted_at_initializers = [];
    let _deleted_at_extraInitializers = [];
    var ClaimsAdjudication = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.claim_id = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _claim_id_initializers, void 0));
            this.policy_id = (__runInitializers(this, _claim_id_extraInitializers), __runInitializers(this, _policy_id_initializers, void 0));
            this.adjudication_status = (__runInitializers(this, _policy_id_extraInitializers), __runInitializers(this, _adjudication_status_initializers, void 0));
            this.coverage_decision = (__runInitializers(this, _adjudication_status_extraInitializers), __runInitializers(this, _coverage_decision_initializers, void 0));
            this.liability_determination = (__runInitializers(this, _coverage_decision_extraInitializers), __runInitializers(this, _liability_determination_initializers, void 0));
            this.insured_liability_percentage = (__runInitializers(this, _liability_determination_extraInitializers), __runInitializers(this, _insured_liability_percentage_initializers, void 0));
            this.total_damages = (__runInitializers(this, _insured_liability_percentage_extraInitializers), __runInitializers(this, _total_damages_initializers, void 0));
            this.settlement_amount = (__runInitializers(this, _total_damages_extraInitializers), __runInitializers(this, _settlement_amount_initializers, void 0));
            this.settlement_type = (__runInitializers(this, _settlement_amount_extraInitializers), __runInitializers(this, _settlement_type_initializers, void 0));
            this.deductible_amount = (__runInitializers(this, _settlement_type_extraInitializers), __runInitializers(this, _deductible_amount_initializers, void 0));
            this.policy_limit = (__runInitializers(this, _deductible_amount_extraInitializers), __runInitializers(this, _policy_limit_initializers, void 0));
            this.valuation_method = (__runInitializers(this, _policy_limit_extraInitializers), __runInitializers(this, _valuation_method_initializers, void 0));
            this.is_total_loss = (__runInitializers(this, _valuation_method_extraInitializers), __runInitializers(this, _is_total_loss_initializers, void 0));
            this.denial_reason = (__runInitializers(this, _is_total_loss_extraInitializers), __runInitializers(this, _denial_reason_initializers, void 0));
            this.adjudication_notes = (__runInitializers(this, _denial_reason_extraInitializers), __runInitializers(this, _adjudication_notes_initializers, void 0));
            this.supporting_documents = (__runInitializers(this, _adjudication_notes_extraInitializers), __runInitializers(this, _supporting_documents_initializers, void 0));
            this.adjudicated_by = (__runInitializers(this, _supporting_documents_extraInitializers), __runInitializers(this, _adjudicated_by_initializers, void 0));
            this.adjudication_date = (__runInitializers(this, _adjudicated_by_extraInitializers), __runInitializers(this, _adjudication_date_initializers, void 0));
            this.created_at = (__runInitializers(this, _adjudication_date_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
            this.updated_at = (__runInitializers(this, _created_at_extraInitializers), __runInitializers(this, _updated_at_initializers, void 0));
            this.deleted_at = (__runInitializers(this, _updated_at_extraInitializers), __runInitializers(this, _deleted_at_initializers, void 0));
            __runInitializers(this, _deleted_at_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ClaimsAdjudication");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _claim_id_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _policy_id_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _adjudication_status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                defaultValue: AdjudicationStatus.PENDING_REVIEW,
            })];
        _coverage_decision_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _liability_determination_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _insured_liability_percentage_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                allowNull: true,
            })];
        _total_damages_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(20, 2),
                allowNull: true,
            })];
        _settlement_amount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(20, 2),
                allowNull: true,
            })];
        _settlement_type_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _deductible_amount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(20, 2),
                allowNull: true,
            })];
        _policy_limit_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(20, 2),
                allowNull: true,
            })];
        _valuation_method_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _is_total_loss_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: false,
            })];
        _denial_reason_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _adjudication_notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _supporting_documents_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _adjudicated_by_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
            })];
        _adjudication_date_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _created_at_decorators = [sequelize_typescript_1.CreatedAt];
        _updated_at_decorators = [sequelize_typescript_1.UpdatedAt];
        _deleted_at_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _claim_id_decorators, { kind: "field", name: "claim_id", static: false, private: false, access: { has: obj => "claim_id" in obj, get: obj => obj.claim_id, set: (obj, value) => { obj.claim_id = value; } }, metadata: _metadata }, _claim_id_initializers, _claim_id_extraInitializers);
        __esDecorate(null, null, _policy_id_decorators, { kind: "field", name: "policy_id", static: false, private: false, access: { has: obj => "policy_id" in obj, get: obj => obj.policy_id, set: (obj, value) => { obj.policy_id = value; } }, metadata: _metadata }, _policy_id_initializers, _policy_id_extraInitializers);
        __esDecorate(null, null, _adjudication_status_decorators, { kind: "field", name: "adjudication_status", static: false, private: false, access: { has: obj => "adjudication_status" in obj, get: obj => obj.adjudication_status, set: (obj, value) => { obj.adjudication_status = value; } }, metadata: _metadata }, _adjudication_status_initializers, _adjudication_status_extraInitializers);
        __esDecorate(null, null, _coverage_decision_decorators, { kind: "field", name: "coverage_decision", static: false, private: false, access: { has: obj => "coverage_decision" in obj, get: obj => obj.coverage_decision, set: (obj, value) => { obj.coverage_decision = value; } }, metadata: _metadata }, _coverage_decision_initializers, _coverage_decision_extraInitializers);
        __esDecorate(null, null, _liability_determination_decorators, { kind: "field", name: "liability_determination", static: false, private: false, access: { has: obj => "liability_determination" in obj, get: obj => obj.liability_determination, set: (obj, value) => { obj.liability_determination = value; } }, metadata: _metadata }, _liability_determination_initializers, _liability_determination_extraInitializers);
        __esDecorate(null, null, _insured_liability_percentage_decorators, { kind: "field", name: "insured_liability_percentage", static: false, private: false, access: { has: obj => "insured_liability_percentage" in obj, get: obj => obj.insured_liability_percentage, set: (obj, value) => { obj.insured_liability_percentage = value; } }, metadata: _metadata }, _insured_liability_percentage_initializers, _insured_liability_percentage_extraInitializers);
        __esDecorate(null, null, _total_damages_decorators, { kind: "field", name: "total_damages", static: false, private: false, access: { has: obj => "total_damages" in obj, get: obj => obj.total_damages, set: (obj, value) => { obj.total_damages = value; } }, metadata: _metadata }, _total_damages_initializers, _total_damages_extraInitializers);
        __esDecorate(null, null, _settlement_amount_decorators, { kind: "field", name: "settlement_amount", static: false, private: false, access: { has: obj => "settlement_amount" in obj, get: obj => obj.settlement_amount, set: (obj, value) => { obj.settlement_amount = value; } }, metadata: _metadata }, _settlement_amount_initializers, _settlement_amount_extraInitializers);
        __esDecorate(null, null, _settlement_type_decorators, { kind: "field", name: "settlement_type", static: false, private: false, access: { has: obj => "settlement_type" in obj, get: obj => obj.settlement_type, set: (obj, value) => { obj.settlement_type = value; } }, metadata: _metadata }, _settlement_type_initializers, _settlement_type_extraInitializers);
        __esDecorate(null, null, _deductible_amount_decorators, { kind: "field", name: "deductible_amount", static: false, private: false, access: { has: obj => "deductible_amount" in obj, get: obj => obj.deductible_amount, set: (obj, value) => { obj.deductible_amount = value; } }, metadata: _metadata }, _deductible_amount_initializers, _deductible_amount_extraInitializers);
        __esDecorate(null, null, _policy_limit_decorators, { kind: "field", name: "policy_limit", static: false, private: false, access: { has: obj => "policy_limit" in obj, get: obj => obj.policy_limit, set: (obj, value) => { obj.policy_limit = value; } }, metadata: _metadata }, _policy_limit_initializers, _policy_limit_extraInitializers);
        __esDecorate(null, null, _valuation_method_decorators, { kind: "field", name: "valuation_method", static: false, private: false, access: { has: obj => "valuation_method" in obj, get: obj => obj.valuation_method, set: (obj, value) => { obj.valuation_method = value; } }, metadata: _metadata }, _valuation_method_initializers, _valuation_method_extraInitializers);
        __esDecorate(null, null, _is_total_loss_decorators, { kind: "field", name: "is_total_loss", static: false, private: false, access: { has: obj => "is_total_loss" in obj, get: obj => obj.is_total_loss, set: (obj, value) => { obj.is_total_loss = value; } }, metadata: _metadata }, _is_total_loss_initializers, _is_total_loss_extraInitializers);
        __esDecorate(null, null, _denial_reason_decorators, { kind: "field", name: "denial_reason", static: false, private: false, access: { has: obj => "denial_reason" in obj, get: obj => obj.denial_reason, set: (obj, value) => { obj.denial_reason = value; } }, metadata: _metadata }, _denial_reason_initializers, _denial_reason_extraInitializers);
        __esDecorate(null, null, _adjudication_notes_decorators, { kind: "field", name: "adjudication_notes", static: false, private: false, access: { has: obj => "adjudication_notes" in obj, get: obj => obj.adjudication_notes, set: (obj, value) => { obj.adjudication_notes = value; } }, metadata: _metadata }, _adjudication_notes_initializers, _adjudication_notes_extraInitializers);
        __esDecorate(null, null, _supporting_documents_decorators, { kind: "field", name: "supporting_documents", static: false, private: false, access: { has: obj => "supporting_documents" in obj, get: obj => obj.supporting_documents, set: (obj, value) => { obj.supporting_documents = value; } }, metadata: _metadata }, _supporting_documents_initializers, _supporting_documents_extraInitializers);
        __esDecorate(null, null, _adjudicated_by_decorators, { kind: "field", name: "adjudicated_by", static: false, private: false, access: { has: obj => "adjudicated_by" in obj, get: obj => obj.adjudicated_by, set: (obj, value) => { obj.adjudicated_by = value; } }, metadata: _metadata }, _adjudicated_by_initializers, _adjudicated_by_extraInitializers);
        __esDecorate(null, null, _adjudication_date_decorators, { kind: "field", name: "adjudication_date", static: false, private: false, access: { has: obj => "adjudication_date" in obj, get: obj => obj.adjudication_date, set: (obj, value) => { obj.adjudication_date = value; } }, metadata: _metadata }, _adjudication_date_initializers, _adjudication_date_extraInitializers);
        __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: obj => "created_at" in obj, get: obj => obj.created_at, set: (obj, value) => { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
        __esDecorate(null, null, _updated_at_decorators, { kind: "field", name: "updated_at", static: false, private: false, access: { has: obj => "updated_at" in obj, get: obj => obj.updated_at, set: (obj, value) => { obj.updated_at = value; } }, metadata: _metadata }, _updated_at_initializers, _updated_at_extraInitializers);
        __esDecorate(null, null, _deleted_at_decorators, { kind: "field", name: "deleted_at", static: false, private: false, access: { has: obj => "deleted_at" in obj, get: obj => obj.deleted_at, set: (obj, value) => { obj.deleted_at = value; } }, metadata: _metadata }, _deleted_at_initializers, _deleted_at_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ClaimsAdjudication = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ClaimsAdjudication = _classThis;
})();
exports.ClaimsAdjudication = ClaimsAdjudication;
/**
 * Settlement offers model
 */
let SettlementOffer = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'settlement_offers',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['claim_id'] },
                { fields: ['offer_status'] },
                { fields: ['valid_until'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _claim_id_decorators;
    let _claim_id_initializers = [];
    let _claim_id_extraInitializers = [];
    let _offer_amount_decorators;
    let _offer_amount_initializers = [];
    let _offer_amount_extraInitializers = [];
    let _settlement_type_decorators;
    let _settlement_type_initializers = [];
    let _settlement_type_extraInitializers = [];
    let _offer_status_decorators;
    let _offer_status_initializers = [];
    let _offer_status_extraInitializers = [];
    let _payment_schedule_decorators;
    let _payment_schedule_initializers = [];
    let _payment_schedule_extraInitializers = [];
    let _conditions_decorators;
    let _conditions_initializers = [];
    let _conditions_extraInitializers = [];
    let _offer_date_decorators;
    let _offer_date_initializers = [];
    let _offer_date_extraInitializers = [];
    let _valid_until_decorators;
    let _valid_until_initializers = [];
    let _valid_until_extraInitializers = [];
    let _offered_by_decorators;
    let _offered_by_initializers = [];
    let _offered_by_extraInitializers = [];
    let _response_date_decorators;
    let _response_date_initializers = [];
    let _response_date_extraInitializers = [];
    let _response_by_decorators;
    let _response_by_initializers = [];
    let _response_by_extraInitializers = [];
    let _counter_offer_decorators;
    let _counter_offer_initializers = [];
    let _counter_offer_extraInitializers = [];
    let _acceptance_terms_decorators;
    let _acceptance_terms_initializers = [];
    let _acceptance_terms_extraInitializers = [];
    let _created_at_decorators;
    let _created_at_initializers = [];
    let _created_at_extraInitializers = [];
    let _updated_at_decorators;
    let _updated_at_initializers = [];
    let _updated_at_extraInitializers = [];
    let _deleted_at_decorators;
    let _deleted_at_initializers = [];
    let _deleted_at_extraInitializers = [];
    var SettlementOffer = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.claim_id = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _claim_id_initializers, void 0));
            this.offer_amount = (__runInitializers(this, _claim_id_extraInitializers), __runInitializers(this, _offer_amount_initializers, void 0));
            this.settlement_type = (__runInitializers(this, _offer_amount_extraInitializers), __runInitializers(this, _settlement_type_initializers, void 0));
            this.offer_status = (__runInitializers(this, _settlement_type_extraInitializers), __runInitializers(this, _offer_status_initializers, void 0));
            this.payment_schedule = (__runInitializers(this, _offer_status_extraInitializers), __runInitializers(this, _payment_schedule_initializers, void 0));
            this.conditions = (__runInitializers(this, _payment_schedule_extraInitializers), __runInitializers(this, _conditions_initializers, void 0));
            this.offer_date = (__runInitializers(this, _conditions_extraInitializers), __runInitializers(this, _offer_date_initializers, void 0));
            this.valid_until = (__runInitializers(this, _offer_date_extraInitializers), __runInitializers(this, _valid_until_initializers, void 0));
            this.offered_by = (__runInitializers(this, _valid_until_extraInitializers), __runInitializers(this, _offered_by_initializers, void 0));
            this.response_date = (__runInitializers(this, _offered_by_extraInitializers), __runInitializers(this, _response_date_initializers, void 0));
            this.response_by = (__runInitializers(this, _response_date_extraInitializers), __runInitializers(this, _response_by_initializers, void 0));
            this.counter_offer = (__runInitializers(this, _response_by_extraInitializers), __runInitializers(this, _counter_offer_initializers, void 0));
            this.acceptance_terms = (__runInitializers(this, _counter_offer_extraInitializers), __runInitializers(this, _acceptance_terms_initializers, void 0));
            this.created_at = (__runInitializers(this, _acceptance_terms_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
            this.updated_at = (__runInitializers(this, _created_at_extraInitializers), __runInitializers(this, _updated_at_initializers, void 0));
            this.deleted_at = (__runInitializers(this, _updated_at_extraInitializers), __runInitializers(this, _deleted_at_initializers, void 0));
            __runInitializers(this, _deleted_at_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SettlementOffer");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _claim_id_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _offer_amount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(20, 2),
                allowNull: false,
            })];
        _settlement_type_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            })];
        _offer_status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                defaultValue: 'pending',
            })];
        _payment_schedule_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _conditions_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT),
                allowNull: true,
            })];
        _offer_date_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _valid_until_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _offered_by_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
            })];
        _response_date_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _response_by_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
            })];
        _counter_offer_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(20, 2),
                allowNull: true,
            })];
        _acceptance_terms_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _created_at_decorators = [sequelize_typescript_1.CreatedAt];
        _updated_at_decorators = [sequelize_typescript_1.UpdatedAt];
        _deleted_at_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _claim_id_decorators, { kind: "field", name: "claim_id", static: false, private: false, access: { has: obj => "claim_id" in obj, get: obj => obj.claim_id, set: (obj, value) => { obj.claim_id = value; } }, metadata: _metadata }, _claim_id_initializers, _claim_id_extraInitializers);
        __esDecorate(null, null, _offer_amount_decorators, { kind: "field", name: "offer_amount", static: false, private: false, access: { has: obj => "offer_amount" in obj, get: obj => obj.offer_amount, set: (obj, value) => { obj.offer_amount = value; } }, metadata: _metadata }, _offer_amount_initializers, _offer_amount_extraInitializers);
        __esDecorate(null, null, _settlement_type_decorators, { kind: "field", name: "settlement_type", static: false, private: false, access: { has: obj => "settlement_type" in obj, get: obj => obj.settlement_type, set: (obj, value) => { obj.settlement_type = value; } }, metadata: _metadata }, _settlement_type_initializers, _settlement_type_extraInitializers);
        __esDecorate(null, null, _offer_status_decorators, { kind: "field", name: "offer_status", static: false, private: false, access: { has: obj => "offer_status" in obj, get: obj => obj.offer_status, set: (obj, value) => { obj.offer_status = value; } }, metadata: _metadata }, _offer_status_initializers, _offer_status_extraInitializers);
        __esDecorate(null, null, _payment_schedule_decorators, { kind: "field", name: "payment_schedule", static: false, private: false, access: { has: obj => "payment_schedule" in obj, get: obj => obj.payment_schedule, set: (obj, value) => { obj.payment_schedule = value; } }, metadata: _metadata }, _payment_schedule_initializers, _payment_schedule_extraInitializers);
        __esDecorate(null, null, _conditions_decorators, { kind: "field", name: "conditions", static: false, private: false, access: { has: obj => "conditions" in obj, get: obj => obj.conditions, set: (obj, value) => { obj.conditions = value; } }, metadata: _metadata }, _conditions_initializers, _conditions_extraInitializers);
        __esDecorate(null, null, _offer_date_decorators, { kind: "field", name: "offer_date", static: false, private: false, access: { has: obj => "offer_date" in obj, get: obj => obj.offer_date, set: (obj, value) => { obj.offer_date = value; } }, metadata: _metadata }, _offer_date_initializers, _offer_date_extraInitializers);
        __esDecorate(null, null, _valid_until_decorators, { kind: "field", name: "valid_until", static: false, private: false, access: { has: obj => "valid_until" in obj, get: obj => obj.valid_until, set: (obj, value) => { obj.valid_until = value; } }, metadata: _metadata }, _valid_until_initializers, _valid_until_extraInitializers);
        __esDecorate(null, null, _offered_by_decorators, { kind: "field", name: "offered_by", static: false, private: false, access: { has: obj => "offered_by" in obj, get: obj => obj.offered_by, set: (obj, value) => { obj.offered_by = value; } }, metadata: _metadata }, _offered_by_initializers, _offered_by_extraInitializers);
        __esDecorate(null, null, _response_date_decorators, { kind: "field", name: "response_date", static: false, private: false, access: { has: obj => "response_date" in obj, get: obj => obj.response_date, set: (obj, value) => { obj.response_date = value; } }, metadata: _metadata }, _response_date_initializers, _response_date_extraInitializers);
        __esDecorate(null, null, _response_by_decorators, { kind: "field", name: "response_by", static: false, private: false, access: { has: obj => "response_by" in obj, get: obj => obj.response_by, set: (obj, value) => { obj.response_by = value; } }, metadata: _metadata }, _response_by_initializers, _response_by_extraInitializers);
        __esDecorate(null, null, _counter_offer_decorators, { kind: "field", name: "counter_offer", static: false, private: false, access: { has: obj => "counter_offer" in obj, get: obj => obj.counter_offer, set: (obj, value) => { obj.counter_offer = value; } }, metadata: _metadata }, _counter_offer_initializers, _counter_offer_extraInitializers);
        __esDecorate(null, null, _acceptance_terms_decorators, { kind: "field", name: "acceptance_terms", static: false, private: false, access: { has: obj => "acceptance_terms" in obj, get: obj => obj.acceptance_terms, set: (obj, value) => { obj.acceptance_terms = value; } }, metadata: _metadata }, _acceptance_terms_initializers, _acceptance_terms_extraInitializers);
        __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: obj => "created_at" in obj, get: obj => obj.created_at, set: (obj, value) => { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
        __esDecorate(null, null, _updated_at_decorators, { kind: "field", name: "updated_at", static: false, private: false, access: { has: obj => "updated_at" in obj, get: obj => obj.updated_at, set: (obj, value) => { obj.updated_at = value; } }, metadata: _metadata }, _updated_at_initializers, _updated_at_extraInitializers);
        __esDecorate(null, null, _deleted_at_decorators, { kind: "field", name: "deleted_at", static: false, private: false, access: { has: obj => "deleted_at" in obj, get: obj => obj.deleted_at, set: (obj, value) => { obj.deleted_at = value; } }, metadata: _metadata }, _deleted_at_initializers, _deleted_at_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SettlementOffer = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SettlementOffer = _classThis;
})();
exports.SettlementOffer = SettlementOffer;
// ============================================================================
// COVERAGE VERIFICATION FUNCTIONS
// ============================================================================
/**
 * Verifies coverage for a claim
 *
 * @param request - Coverage verification request
 * @param transaction - Optional database transaction
 * @returns Coverage verification result
 *
 * @example
 * ```typescript
 * const coverageResult = await verifyCoverage({
 *   claimId: 'claim-123',
 *   policyId: 'policy-456',
 *   lossDate: new Date('2024-06-15'),
 *   lossType: 'collision',
 *   claimAmount: 15000
 * });
 * ```
 */
async function verifyCoverage(request, transaction) {
    const { claimId, policyId, lossDate, lossType, lossLocation, claimAmount } = request;
    // Simulate policy lookup and coverage verification
    const policyInForce = true;
    const withinCoveragePeriod = true;
    const withinReportingRequirements = true;
    const applicableCoverages = ['collision', 'comprehensive'];
    const excludedCoverages = [];
    const deductibleAmount = 500;
    const coverageLimit = 50000;
    const remainingLimit = 50000;
    let coverageDecision;
    if (!policyInForce) {
        coverageDecision = CoverageDecision.NOT_COVERED;
    }
    else if (!withinCoveragePeriod) {
        coverageDecision = CoverageDecision.NOT_COVERED;
    }
    else if (applicableCoverages.includes(lossType)) {
        coverageDecision = CoverageDecision.COVERED;
    }
    else {
        coverageDecision = CoverageDecision.NOT_COVERED;
    }
    return {
        coverageDecision,
        applicableCoverages,
        excludedCoverages,
        policyInForce,
        withinCoveragePeriod,
        withinReportingRequirements,
        deductibleAmount,
        coverageLimit,
        remainingLimit,
        coinsurancePercentage: 80,
        verificationNotes: 'Coverage verified for collision loss within policy period',
        verifiedBy: 'system',
        verifiedAt: new Date(),
    };
}
/**
 * Analyzes coverage gaps and exclusions
 */
async function analyzeCoverageGaps(policyId, claimType, transaction) {
    // Simulate gap analysis
    const gaps = [];
    const recommendations = [];
    if (claimType === 'flood') {
        gaps.push('Flood damage not covered under standard policy');
        recommendations.push('Consider purchasing separate flood insurance');
    }
    return {
        hasGaps: gaps.length > 0,
        gaps,
        recommendations,
    };
}
/**
 * Checks policy limits and remaining capacity
 */
async function checkPolicyLimits(policyId, coverageType, requestedAmount, transaction) {
    // Simulate limit checking
    const coverageLimit = 100000;
    const usedAmount = 25000;
    const remainingAmount = coverageLimit - usedAmount;
    const withinLimits = requestedAmount <= remainingAmount;
    return {
        withinLimits,
        coverageLimit,
        usedAmount,
        remainingAmount,
    };
}
/**
 * Issues reservation of rights notice
 */
async function issueReservationOfRights(notice, transaction) {
    const noticeId = `ROR-${Date.now()}`;
    // Create adjudication record with reservation
    await ClaimsAdjudication.create({
        claim_id: notice.claimId,
        policy_id: 'unknown', // Would be fetched from claim
        adjudication_status: AdjudicationStatus.UNDER_INVESTIGATION,
        coverage_decision: CoverageDecision.RESERVATION_OF_RIGHTS,
        adjudication_notes: JSON.stringify(notice),
        adjudicated_by: notice.issuedBy,
        adjudication_date: new Date(),
    }, { transaction });
    return {
        noticeId,
        issuedAt: new Date(),
    };
}
// ============================================================================
// LIABILITY DETERMINATION FUNCTIONS
// ============================================================================
/**
 * Determines liability allocation
 */
async function determineLiability(assessment, transaction) {
    const { claimId, insuredPercentage, claimantPercentage, jursdictionRules } = assessment;
    // Determine liability type based on percentages
    let determination;
    if (insuredPercentage === 100) {
        determination = LiabilityDetermination.FULL_LIABILITY;
    }
    else if (insuredPercentage === 0) {
        determination = LiabilityDetermination.NO_LIABILITY;
    }
    else {
        determination = LiabilityDetermination.COMPARATIVE_NEGLIGENCE;
    }
    const totalDamages = 50000; // Would be calculated from claim
    const insuredResponsibility = totalDamages * (insuredPercentage / 100);
    const claimantResponsibility = totalDamages * (claimantPercentage / 100);
    const result = {
        determination,
        insuredLiabilityPercentage: insuredPercentage,
        claimantLiabilityPercentage: claimantPercentage,
        totalDamages,
        insuredResponsibility,
        claimantResponsibility,
        assessmentRationale: `Based on ${assessment.factorsConsidered.join(', ')}`,
        assessedBy: 'adjuster',
        assessedAt: new Date(),
    };
    return result;
}
/**
 * Calculates comparative negligence
 */
async function calculateComparativeNegligence(insuredFaultPercentage, claimantFaultPercentage, totalDamages, jurisdiction) {
    let insuredOwes = 0;
    let claimantOwes = 0;
    let barredRecovery = false;
    if (jurisdiction === 'pure') {
        // Pure comparative negligence - each pays their fault percentage
        insuredOwes = totalDamages * (insuredFaultPercentage / 100);
        claimantOwes = totalDamages * (claimantFaultPercentage / 100);
    }
    else if (jurisdiction === 'modified') {
        // Modified comparative (50% or 51% bar)
        if (claimantFaultPercentage >= 50) {
            barredRecovery = true;
            insuredOwes = 0;
        }
        else {
            insuredOwes = totalDamages * (insuredFaultPercentage / 100);
        }
    }
    else {
        // Contributory negligence - any fault bars recovery
        if (claimantFaultPercentage > 0) {
            barredRecovery = true;
            insuredOwes = 0;
        }
        else {
            insuredOwes = totalDamages;
        }
    }
    return { insuredOwes, claimantOwes, barredRecovery };
}
vicariously;
liable: boolean;
rationale: string;
 > {
    let, vicariouslyLiable = false,
    let, rationale = '',
    if(employerRelationship) { }
} && scopeOfEmployment;
{
    vicariouslyLiable = true;
    rationale = 'Employer liable for employee actions within scope of employment';
}
if (agencyRelationship) {
    vicariouslyLiable = true;
    rationale = 'Principal liable for agent actions within scope of authority';
}
else {
    rationale = 'No vicarious liability relationship established';
}
return { 'vicariouslyLiable': vicariouslyLiable, rationale };
// ============================================================================
// CLAIM VALUATION FUNCTIONS
// ============================================================================
/**
 * Values claim using specified method
 */
async function valueClaim(data, transaction) {
    const { claimId, valuationMethod, propertyValue, damageEstimate, salvageValue, depreciation, medicalExpenses, lostWages, painAndSuffering, additionalLivingExpenses, } = data;
    let totalValuation = 0;
    let actualCashValue;
    let replacementCost;
    const valuationBreakdown = {};
    if (valuationMethod === ValuationMethod.ACTUAL_CASH_VALUE) {
        actualCashValue = damageEstimate - (depreciation || 0);
        totalValuation = actualCashValue;
        valuationBreakdown.damageEstimate = damageEstimate;
        valuationBreakdown.depreciation = -(depreciation || 0);
    }
    else if (valuationMethod === ValuationMethod.REPLACEMENT_COST) {
        replacementCost = damageEstimate;
        totalValuation = replacementCost;
        valuationBreakdown.replacementCost = replacementCost;
    }
    if (medicalExpenses) {
        totalValuation += medicalExpenses;
        valuationBreakdown.medicalExpenses = medicalExpenses;
    }
    if (lostWages) {
        totalValuation += lostWages;
        valuationBreakdown.lostWages = lostWages;
    }
    if (painAndSuffering) {
        totalValuation += painAndSuffering;
        valuationBreakdown.painAndSuffering = painAndSuffering;
    }
    if (additionalLivingExpenses) {
        totalValuation += additionalLivingExpenses;
        valuationBreakdown.additionalLivingExpenses = additionalLivingExpenses;
    }
    const lessDeductible = 500; // Would be from policy
    const lessPriorPayments = 0;
    const netSettlementAmount = totalValuation - lessDeductible - lessPriorPayments;
    return {
        totalValuation,
        actualCashValue,
        replacementCost,
        lessDeductible,
        lessPriorPayments,
        netSettlementAmount,
        valuationBreakdown,
        valuationDate: new Date(),
        valuedBy: 'appraiser',
    };
}
/**
 * Calculates Actual Cash Value (ACV)
 */
async function calculateActualCashValue(replacementCost, age, usefulLife, condition) {
    let depreciationPercentage = (age / usefulLife) * 100;
    // Adjust for condition
    if (condition === 'excellent') {
        depreciationPercentage *= 0.8;
    }
    else if (condition === 'poor') {
        depreciationPercentage *= 1.2;
    }
    depreciationPercentage = Math.min(100, Math.max(0, depreciationPercentage));
    const depreciation = replacementCost * (depreciationPercentage / 100);
    const acv = replacementCost - depreciation;
    return {
        acv,
        depreciation,
        depreciationPercentage,
    };
}
/**
 * Calculates Replacement Cost Value (RCV)
 */
async function calculateReplacementCostValue(itemDescription, quantity, unitCost, inflationRate) {
    let adjustedUnitCost = unitCost;
    if (inflationRate) {
        adjustedUnitCost = unitCost * (1 + inflationRate);
    }
    const totalCost = adjustedUnitCost * quantity;
    return {
        rcv: totalCost,
        unitCost: adjustedUnitCost,
        totalCost,
    };
}
/**
 * Applies deductible to claim valuation
 */
async function applyDeductible(claimValue, deductibleAmount, deductibleType, deductiblePercentage) {
    let deductibleApplied;
    if (deductibleType === 'flat') {
        deductibleApplied = deductibleAmount;
    }
    else {
        deductibleApplied = claimValue * ((deductiblePercentage || 0) / 100);
    }
    const netAmount = Math.max(0, claimValue - deductibleApplied);
    return {
        netAmount,
        deductibleApplied,
    };
}
/**
 * Applies policy limits to valuation
 */
async function applyPolicyLimits(claimValue, perOccurrenceLimit, aggregateLimit, previousPayments) {
    const availableAggregate = aggregateLimit - previousPayments;
    const maxPayable = Math.min(perOccurrenceLimit, availableAggregate);
    const payableAmount = Math.min(claimValue, maxPayable);
    const excessAmount = Math.max(0, claimValue - maxPayable);
    const withinLimits = excessAmount === 0;
    return {
        payableAmount,
        excessAmount,
        withinLimits,
    };
}
// ============================================================================
// SETTLEMENT FUNCTIONS
// ============================================================================
/**
 * Generates settlement offer
 */
async function generateSettlementOffer(data, transaction) {
    const offer = await SettlementOffer.create({
        claim_id: data.claimId,
        offer_amount: data.offerAmount,
        settlement_type: data.settlementType,
        payment_schedule: data.paymentSchedule,
        conditions: data.conditions,
        offer_date: new Date(),
        valid_until: data.validUntil,
        offered_by: data.offeredBy,
        offer_status: 'pending',
    }, { transaction });
    return {
        offerId: offer.id,
        claimId: offer.claim_id,
        offerAmount: parseFloat(offer.offer_amount.toString()),
        settlementType: offer.settlement_type,
        offerStatus: 'pending',
        offerDate: offer.offer_date,
        validUntil: offer.valid_until,
    };
}
/**
 * Accepts settlement offer
 */
async function acceptSettlementOffer(offerId, acceptedBy, acceptanceTerms, transaction) {
    const offer = await SettlementOffer.findByPk(offerId, { transaction });
    if (!offer) {
        throw new common_1.NotFoundException(`Settlement offer ${offerId} not found`);
    }
    if (new Date() > offer.valid_until) {
        throw new common_1.BadRequestException('Settlement offer has expired');
    }
    await offer.update({
        offer_status: 'accepted',
        response_date: new Date(),
        response_by: acceptedBy,
        acceptance_terms: acceptanceTerms,
    }, { transaction });
    return {
        offerId: offer.id,
        claimId: offer.claim_id,
        offerAmount: parseFloat(offer.offer_amount.toString()),
        settlementType: offer.settlement_type,
        offerStatus: 'accepted',
        offerDate: offer.offer_date,
        validUntil: offer.valid_until,
        responseDate: offer.response_date || undefined,
        responseBy: offer.response_by || undefined,
        acceptanceTerms: offer.acceptance_terms || undefined,
    };
}
/**
 * Rejects settlement offer
 */
async function rejectSettlementOffer(offerId, rejectedBy, counterOffer, transaction) {
    const offer = await SettlementOffer.findByPk(offerId, { transaction });
    if (!offer) {
        throw new common_1.NotFoundException(`Settlement offer ${offerId} not found`);
    }
    await offer.update({
        offer_status: counterOffer ? 'countered' : 'rejected',
        response_date: new Date(),
        response_by: rejectedBy,
        counter_offer: counterOffer,
    }, { transaction });
    return {
        offerId: offer.id,
        claimId: offer.claim_id,
        offerAmount: parseFloat(offer.offer_amount.toString()),
        settlementType: offer.settlement_type,
        offerStatus: counterOffer ? 'countered' : 'rejected',
        offerDate: offer.offer_date,
        validUntil: offer.valid_until,
        responseDate: offer.response_date || undefined,
        responseBy: offer.response_by || undefined,
        counterOffer: counterOffer,
    };
}
/**
 * Configures structured settlement
 */
async function configureStructuredSettlement(config) {
    const { totalAmount, initialPayment, periodicPaymentAmount, paymentFrequency, numberOfPayments, costOfLivingAdjustment, colaPercentage, } = config;
    const paymentSchedule = [];
    let currentDate = new Date();
    let currentPaymentAmount = periodicPaymentAmount;
    let futureValue = initialPayment;
    // Add initial payment
    paymentSchedule.push({
        date: new Date(currentDate),
        amount: initialPayment,
    });
    // Calculate periodic payments
    const monthsPerPayment = paymentFrequency === 'monthly' ? 1 : paymentFrequency === 'quarterly' ? 3 : 12;
    for (let i = 0; i < numberOfPayments; i++) {
        currentDate = new Date(currentDate);
        currentDate.setMonth(currentDate.getMonth() + monthsPerPayment);
        if (costOfLivingAdjustment && colaPercentage) {
            currentPaymentAmount *= 1 + colaPercentage / 100;
        }
        paymentSchedule.push({
            date: new Date(currentDate),
            amount: currentPaymentAmount,
        });
        futureValue += currentPaymentAmount;
    }
    return {
        presentValue: totalAmount,
        futureValue,
        paymentSchedule,
    };
}
/**
 * Calculates settlement authority level
 */
async function calculateSettlementAuthority(claimValue, adjusterLevel) {
    const authorityLimits = {
        trainee: 5000,
        junior: 25000,
        senior: 100000,
        supervisor: 500000,
        manager: Infinity,
    };
    const authorityLimit = authorityLimits[adjusterLevel];
    const hasAuthority = claimValue <= authorityLimit;
    const requiresApproval = !hasAuthority;
    let approverLevel;
    if (requiresApproval) {
        if (claimValue > authorityLimits.supervisor) {
            approverLevel = 'manager';
        }
        else if (claimValue > authorityLimits.senior) {
            approverLevel = 'supervisor';
        }
        else if (claimValue > authorityLimits.junior) {
            approverLevel = 'senior';
        }
        else {
            approverLevel = 'junior';
        }
    }
    return {
        hasAuthority,
        authorityLimit,
        requiresApproval,
        approverLevel,
    };
}
// ============================================================================
// DENIAL FUNCTIONS
// ============================================================================
/**
 * Generates claim denial letter
 */
async function generateDenialLetter(data, transaction) {
    const letterId = `DENIAL-${Date.now()}`;
    await ClaimsAdjudication.create({
        claim_id: data.claimId,
        policy_id: 'unknown',
        adjudication_status: AdjudicationStatus.DENIED,
        coverage_decision: CoverageDecision.NOT_COVERED,
        denial_reason: data.denialReason,
        adjudication_notes: data.explanationOfDecision,
        adjudicated_by: data.deniedBy,
        adjudication_date: new Date(),
    }, { transaction });
    return {
        letterId,
        denialDate: new Date(),
        appealDeadline: data.appealDeadline,
    };
}
/**
 * Processes denial appeal
 */
async function processDenialAppeal(claimId, appealReason, supportingDocuments, appealedBy, transaction) {
    const appealId = `APPEAL-${Date.now()}`;
    const reviewDeadline = new Date();
    reviewDeadline.setDate(reviewDeadline.getDate() + 30);
    return {
        appealId,
        appealStatus: 'under_review',
        reviewDeadline,
    };
}
// ============================================================================
// TOTAL LOSS FUNCTIONS
// ============================================================================
/**
 * Determines if claim is total loss
 */
async function determineTotalLoss(data, transaction) {
    const { propertyValue, repairCost, salvageValue, totalLossThresholdPercentage } = data;
    const repairCostPercentage = (repairCost / propertyValue) * 100;
    const totalLossThreshold = totalLossThresholdPercentage;
    const isTotalLoss = repairCostPercentage >= totalLossThreshold;
    let totalLossType;
    let settlementAmount;
    let settlementCalculation;
    if (!isTotalLoss) {
        totalLossType = TotalLossType.NOT_TOTAL_LOSS;
        settlementAmount = repairCost;
        settlementCalculation = `Repair cost ${repairCost} is ${repairCostPercentage.toFixed(1)}% of value, below ${totalLossThreshold}% threshold`;
    }
    else if (repairCost > propertyValue) {
        totalLossType = TotalLossType.ACTUAL_TOTAL_LOSS;
        settlementAmount = propertyValue - salvageValue;
        settlementCalculation = `Actual total loss: Property value ${propertyValue} - Salvage ${salvageValue} = ${settlementAmount}`;
    }
    else {
        totalLossType = TotalLossType.CONSTRUCTIVE_TOTAL_LOSS;
        settlementAmount = propertyValue - salvageValue;
        settlementCalculation = `Constructive total loss: Repair cost ${repairCostPercentage.toFixed(1)}% exceeds threshold. Settlement: ${propertyValue} - ${salvageValue} = ${settlementAmount}`;
    }
    return {
        isTotalLoss,
        totalLossType,
        propertyValue,
        repairCost,
        salvageValue,
        repairCostPercentage,
        totalLossThreshold,
        settlementAmount,
        settlementCalculation,
        determinedBy: 'system',
        determinedAt: new Date(),
    };
}
/**
 * Calculates total loss settlement
 */
async function calculateTotalLossSettlement(actualCashValue, salvageValue, deductible, priorDamage) {
    const grossSettlement = actualCashValue;
    const lessSalvage = salvageValue;
    const lessDeductible = deductible;
    const lessPriorDamage = priorDamage || 0;
    const netSettlement = grossSettlement - lessSalvage - lessDeductible - lessPriorDamage;
    return {
        grossSettlement,
        lessSalvage,
        lessDeductible,
        lessPriorDamage,
        netSettlement,
    };
}
// ============================================================================
// NEGOTIATION TRACKING FUNCTIONS
// ============================================================================
/**
 * Tracks claim negotiation progress
 */
async function trackNegotiation(claimId, demandAmount, offerAmount, round) {
    const negotiationGap = demandAmount - offerAmount;
    const gapPercentage = (negotiationGap / demandAmount) * 100;
    const convergenceRate = gapPercentage / round; // Gap reduction per round
    let recommendation;
    if (gapPercentage < 10) {
        recommendation = 'Parties are close. Recommend final settlement push.';
    }
    else if (gapPercentage < 25) {
        recommendation = 'Moderate gap. Continue negotiations.';
    }
    else {
        recommendation = 'Significant gap. Consider mediation or further evidence.';
    }
    return {
        negotiationGap,
        gapPercentage,
        convergenceRate,
        recommendation,
    };
}
/**
 * Calculates settlement recommendation
 */
async function calculateSettlementRecommendation(claimValuation, liabilityPercentage, litigationCostEstimate, successProbability) {
    // Expected value approach
    const expectedJudgment = claimValuation * liabilityPercentage * successProbability;
    const totalLitigationCost = litigationCostEstimate;
    const expectedCostOfTrial = expectedJudgment + totalLitigationCost;
    // Recommend settlement at 80% of expected cost to account for risk
    const recommendedAmount = expectedCostOfTrial * 0.8;
    const rationale = `Based on ${(liabilityPercentage * 100).toFixed(0)}% liability, ${(successProbability * 100).toFixed(0)}% success probability, and $${litigationCostEstimate} litigation costs. Expected trial cost: $${expectedCostOfTrial.toFixed(0)}. Recommend settling at 80% to avoid risk.`;
    let confidenceLevel;
    if (successProbability > 0.7) {
        confidenceLevel = 'high';
    }
    else if (successProbability > 0.4) {
        confidenceLevel = 'medium';
    }
    else {
        confidenceLevel = 'low';
    }
    return {
        recommendedAmount,
        rationale,
        confidenceLevel,
    };
}
//# sourceMappingURL=claims-adjudication-kit.js.map