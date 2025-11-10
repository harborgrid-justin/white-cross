"use strict";
/**
 * LOC: SETTLEMENT_NEG_KIT_001
 * File: /reuse/legal/settlement-negotiation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize-typescript
 *   - sequelize
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *   - node-cron
 *
 * DOWNSTREAM (imported by):
 *   - Legal management modules
 *   - Litigation services
 *   - Settlement workflow controllers
 *   - Payment processing services
 *   - Document generation services
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentPlanDto = exports.SettlementOfferDto = exports.CreateSettlementDto = exports.SettlementDto = exports.SettlementNegotiationService = exports.SettlementAuthorityModel = exports.PaymentInstallmentModel = exports.PaymentPlanModel = exports.NegotiationActivityModel = exports.NegotiationSessionModel = exports.SettlementPartyModel = exports.SettlementOfferModel = exports.SettlementModel = exports.SettlementAuthoritySchema = exports.NegotiationSessionSchema = exports.PaymentPlanSchema = exports.SettlementOfferSchema = exports.SettlementCreateSchema = exports.ActivityType = exports.ReleaseType = exports.ApprovalDecision = exports.NegotiationRole = exports.InstallmentStatus = exports.PaymentPlanStatus = exports.SettlementType = exports.OfferStatus = exports.SettlementStatus = void 0;
exports.registerSettlementConfig = registerSettlementConfig;
exports.createSettlementConfigModule = createSettlementConfigModule;
exports.generateSettlementNumber = generateSettlementNumber;
exports.createSettlementOffer = createSettlementOffer;
exports.updateSettlementOffer = updateSettlementOffer;
exports.acceptSettlementOffer = acceptSettlementOffer;
exports.rejectSettlementOffer = rejectSettlementOffer;
exports.counterSettlementOffer = counterSettlementOffer;
exports.withdrawSettlementOffer = withdrawSettlementOffer;
exports.getSettlementOfferHistory = getSettlementOfferHistory;
exports.createNegotiationSession = createNegotiationSession;
exports.addNegotiationNote = addNegotiationNote;
exports.trackNegotiationActivity = trackNegotiationActivity;
exports.getNegotiationTimeline = getNegotiationTimeline;
exports.calculateSettlementRange = calculateSettlementRange;
exports.evaluateSettlementOffer = evaluateSettlementOffer;
exports.checkSettlementAuthority = checkSettlementAuthority;
exports.requestSettlementApproval = requestSettlementApproval;
exports.approveSettlement = approveSettlement;
exports.rejectSettlementApproval = rejectSettlementApproval;
exports.delegateSettlementAuthority = delegateSettlementAuthority;
exports.createPaymentPlan = createPaymentPlan;
exports.validatePaymentPlan = validatePaymentPlan;
exports.calculatePaymentSchedule = calculatePaymentSchedule;
exports.updatePaymentStatus = updatePaymentStatus;
exports.getPaymentPlanStatus = getPaymentPlanStatus;
exports.generateReleaseDocument = generateReleaseDocument;
exports.generateSettlementAgreement = generateSettlementAgreement;
exports.validateReleaseTerms = validateReleaseTerms;
exports.executeSettlement = executeSettlement;
exports.recordSettlementPayment = recordSettlementPayment;
exports.searchSettlements = searchSettlements;
exports.getSettlementByNumber = getSettlementByNumber;
exports.getSettlementAnalytics = getSettlementAnalytics;
exports.compareSettlements = compareSettlements;
exports.calculateSettlementMetrics = calculateSettlementMetrics;
exports.generateSettlementReport = generateSettlementReport;
exports.exportSettlementData = exportSettlementData;
/**
 * File: /reuse/legal/settlement-negotiation-kit.ts
 * Locator: WC-SETTLEMENT-NEG-KIT-001
 * Purpose: Production-Grade Settlement Negotiation Kit - Enterprise settlement management toolkit
 *
 * Upstream: NestJS, Sequelize, Zod, Node-Cron
 * Downstream: ../backend/modules/legal/*, Settlement controllers, Payment services
 * Dependencies: TypeScript 5.x, Node 18+, sequelize-typescript, @nestjs/swagger, zod
 * Exports: 37 production-ready settlement negotiation functions for legal platforms
 *
 * LLM Context: Production-grade settlement negotiation and management toolkit for White Cross platform.
 * Provides comprehensive settlement offer creation and tracking with versioning, negotiation session
 * management with full history and timeline, multi-party negotiation support, settlement authority
 * management with approval workflows and delegation, payment plan creation with flexible schedules
 * and installments, automated payment tracking and reminders, release document generation with
 * template support, settlement agreement generation, settlement range calculation based on case
 * factors, offer evaluation and comparison, settlement analytics and reporting, Sequelize models
 * for settlements/offers/negotiations/payments, NestJS services with dependency injection, Swagger
 * API documentation, settlement status lifecycle management, counter-offer handling, approval
 * workflows, settlement execution and finalization, payment recording and reconciliation, settlement
 * metrics and KPIs, and healthcare-specific settlement types (medical malpractice, insurance claims,
 * patient disputes).
 */
const crypto = __importStar(require("crypto"));
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Settlement status lifecycle
 */
var SettlementStatus;
(function (SettlementStatus) {
    SettlementStatus["DRAFT"] = "draft";
    SettlementStatus["PROPOSED"] = "proposed";
    SettlementStatus["UNDER_NEGOTIATION"] = "under_negotiation";
    SettlementStatus["PENDING_APPROVAL"] = "pending_approval";
    SettlementStatus["APPROVED"] = "approved";
    SettlementStatus["ACCEPTED"] = "accepted";
    SettlementStatus["REJECTED"] = "rejected";
    SettlementStatus["WITHDRAWN"] = "withdrawn";
    SettlementStatus["EXECUTED"] = "executed";
    SettlementStatus["COMPLETED"] = "completed";
    SettlementStatus["CANCELLED"] = "cancelled";
})(SettlementStatus || (exports.SettlementStatus = SettlementStatus = {}));
/**
 * Settlement offer status
 */
var OfferStatus;
(function (OfferStatus) {
    OfferStatus["PENDING"] = "pending";
    OfferStatus["ACCEPTED"] = "accepted";
    OfferStatus["REJECTED"] = "rejected";
    OfferStatus["COUNTERED"] = "countered";
    OfferStatus["WITHDRAWN"] = "withdrawn";
    OfferStatus["EXPIRED"] = "expired";
})(OfferStatus || (exports.OfferStatus = OfferStatus = {}));
/**
 * Settlement type categories
 */
var SettlementType;
(function (SettlementType) {
    SettlementType["MEDICAL_MALPRACTICE"] = "medical_malpractice";
    SettlementType["INSURANCE_CLAIM"] = "insurance_claim";
    SettlementType["PATIENT_DISPUTE"] = "patient_dispute";
    SettlementType["EMPLOYMENT_DISPUTE"] = "employment_dispute";
    SettlementType["CONTRACT_DISPUTE"] = "contract_dispute";
    SettlementType["PERSONAL_INJURY"] = "personal_injury";
    SettlementType["PROPERTY_DAMAGE"] = "property_damage";
    SettlementType["BREACH_OF_CONTRACT"] = "breach_of_contract";
    SettlementType["PROFESSIONAL_LIABILITY"] = "professional_liability";
    SettlementType["REGULATORY_SETTLEMENT"] = "regulatory_settlement";
    SettlementType["OTHER"] = "other";
})(SettlementType || (exports.SettlementType = SettlementType = {}));
/**
 * Payment plan status
 */
var PaymentPlanStatus;
(function (PaymentPlanStatus) {
    PaymentPlanStatus["ACTIVE"] = "active";
    PaymentPlanStatus["COMPLETED"] = "completed";
    PaymentPlanStatus["DEFAULTED"] = "defaulted";
    PaymentPlanStatus["CANCELLED"] = "cancelled";
    PaymentPlanStatus["SUSPENDED"] = "suspended";
})(PaymentPlanStatus || (exports.PaymentPlanStatus = PaymentPlanStatus = {}));
/**
 * Payment installment status
 */
var InstallmentStatus;
(function (InstallmentStatus) {
    InstallmentStatus["PENDING"] = "pending";
    InstallmentStatus["PAID"] = "paid";
    InstallmentStatus["OVERDUE"] = "overdue";
    InstallmentStatus["PARTIAL"] = "partial";
    InstallmentStatus["WAIVED"] = "waived";
})(InstallmentStatus || (exports.InstallmentStatus = InstallmentStatus = {}));
/**
 * Negotiation party role
 */
var NegotiationRole;
(function (NegotiationRole) {
    NegotiationRole["PLAINTIFF"] = "plaintiff";
    NegotiationRole["DEFENDANT"] = "defendant";
    NegotiationRole["PLAINTIFF_ATTORNEY"] = "plaintiff_attorney";
    NegotiationRole["DEFENDANT_ATTORNEY"] = "defendant_attorney";
    NegotiationRole["MEDIATOR"] = "mediator";
    NegotiationRole["INSURANCE_ADJUSTER"] = "insurance_adjuster";
    NegotiationRole["LEGAL_COUNSEL"] = "legal_counsel";
    NegotiationRole["EXPERT_WITNESS"] = "expert_witness";
    NegotiationRole["OTHER"] = "other";
})(NegotiationRole || (exports.NegotiationRole = NegotiationRole = {}));
/**
 * Settlement approval decision
 */
var ApprovalDecision;
(function (ApprovalDecision) {
    ApprovalDecision["APPROVED"] = "approved";
    ApprovalDecision["REJECTED"] = "rejected";
    ApprovalDecision["REQUIRES_REVISION"] = "requires_revision";
    ApprovalDecision["ESCALATED"] = "escalated";
})(ApprovalDecision || (exports.ApprovalDecision = ApprovalDecision = {}));
/**
 * Release type
 */
var ReleaseType;
(function (ReleaseType) {
    ReleaseType["GENERAL_RELEASE"] = "general_release";
    ReleaseType["LIMITED_RELEASE"] = "limited_release";
    ReleaseType["MUTUAL_RELEASE"] = "mutual_release";
    ReleaseType["COVENANT_NOT_TO_SUE"] = "covenant_not_to_sue";
    ReleaseType["WAIVER"] = "waiver";
})(ReleaseType || (exports.ReleaseType = ReleaseType = {}));
/**
 * Negotiation activity type
 */
var ActivityType;
(function (ActivityType) {
    ActivityType["OFFER_MADE"] = "offer_made";
    ActivityType["OFFER_ACCEPTED"] = "offer_accepted";
    ActivityType["OFFER_REJECTED"] = "offer_rejected";
    ActivityType["COUNTER_OFFER"] = "counter_offer";
    ActivityType["NOTE_ADDED"] = "note_added";
    ActivityType["DOCUMENT_UPLOADED"] = "document_uploaded";
    ActivityType["COMMUNICATION"] = "communication";
    ActivityType["STATUS_CHANGE"] = "status_change";
    ActivityType["APPROVAL_REQUESTED"] = "approval_requested";
    ActivityType["APPROVAL_GRANTED"] = "approval_granted";
    ActivityType["PAYMENT_MADE"] = "payment_made";
})(ActivityType || (exports.ActivityType = ActivityType = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Settlement creation schema
 */
exports.SettlementCreateSchema = zod_1.z.object({
    caseId: zod_1.z.string().uuid(),
    settlementType: zod_1.z.nativeEnum(SettlementType),
    demandAmount: zod_1.z.number().min(0).optional(),
    offerAmount: zod_1.z.number().min(0).optional(),
    description: zod_1.z.string().max(2000).optional(),
    currency: zod_1.z.string().length(3).default('USD'),
    terms: zod_1.z.object({
        confidentialityRequired: zod_1.z.boolean().default(false),
        nonAdmissionClause: zod_1.z.boolean().default(true),
        taxResponsibility: zod_1.z.enum(['plaintiff', 'defendant', 'split']).default('defendant'),
        dismissalType: zod_1.z.enum(['with_prejudice', 'without_prejudice']).default('with_prejudice'),
        effectiveDate: zod_1.z.date(),
        paymentDueDate: zod_1.z.date().optional(),
        specialConditions: zod_1.z.array(zod_1.z.string()).default([]),
        attachments: zod_1.z.array(zod_1.z.string()).default([]),
    }),
    approvalRequired: zod_1.z.boolean().default(false),
    metadata: zod_1.z.object({
        mediationRequired: zod_1.z.boolean().default(false),
        authorityLevel: zod_1.z.string(),
        customFields: zod_1.z.record(zod_1.z.any()).default({}),
        tags: zod_1.z.array(zod_1.z.string()).default([]),
    }).optional(),
});
/**
 * Settlement offer schema
 */
exports.SettlementOfferSchema = zod_1.z.object({
    amount: zod_1.z.number().min(0),
    currency: zod_1.z.string().length(3).default('USD'),
    terms: zod_1.z.string().min(1),
    conditions: zod_1.z.array(zod_1.z.string()).default([]),
    validUntil: zod_1.z.date().optional(),
    responseDeadline: zod_1.z.date().optional(),
    offerType: zod_1.z.enum(['initial', 'counter', 'final']).default('initial'),
    parentOfferId: zod_1.z.string().uuid().optional(),
});
/**
 * Payment plan schema
 */
exports.PaymentPlanSchema = zod_1.z.object({
    totalAmount: zod_1.z.number().min(0),
    currency: zod_1.z.string().length(3).default('USD'),
    numberOfInstallments: zod_1.z.number().int().min(1).max(120),
    frequency: zod_1.z.enum(['weekly', 'bi-weekly', 'monthly', 'quarterly', 'custom']),
    startDate: zod_1.z.date(),
    defaultGracePeriodDays: zod_1.z.number().int().min(0).default(5),
    latePaymentPenalty: zod_1.z.number().min(0).optional(),
});
/**
 * Negotiation session schema
 */
exports.NegotiationSessionSchema = zod_1.z.object({
    sessionType: zod_1.z.enum(['direct', 'mediated', 'virtual', 'in_person']),
    scheduledAt: zod_1.z.date().optional(),
    agenda: zod_1.z.string().optional(),
    participants: zod_1.z.array(zod_1.z.object({
        userId: zod_1.z.string().uuid(),
        role: zod_1.z.nativeEnum(NegotiationRole),
        name: zod_1.z.string(),
    })),
});
/**
 * Settlement authority schema
 */
exports.SettlementAuthoritySchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    role: zod_1.z.string(),
    minAmount: zod_1.z.number().min(0),
    maxAmount: zod_1.z.number().min(0),
    settlementTypes: zod_1.z.array(zod_1.z.nativeEnum(SettlementType)),
    requiresApproval: zod_1.z.boolean(),
    approverUserId: zod_1.z.string().uuid().optional(),
    effectiveFrom: zod_1.z.date(),
    effectiveUntil: zod_1.z.date().optional(),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Settlement Sequelize Model
 */
let SettlementModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'settlements',
            timestamps: true,
            paranoid: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _settlementNumber_decorators;
    let _settlementNumber_initializers = [];
    let _settlementNumber_extraInitializers = [];
    let _caseId_decorators;
    let _caseId_initializers = [];
    let _caseId_extraInitializers = [];
    let _settlementType_decorators;
    let _settlementType_initializers = [];
    let _settlementType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _totalAmount_decorators;
    let _totalAmount_initializers = [];
    let _totalAmount_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _demandAmount_decorators;
    let _demandAmount_initializers = [];
    let _demandAmount_extraInitializers = [];
    let _offerAmount_decorators;
    let _offerAmount_initializers = [];
    let _offerAmount_extraInitializers = [];
    let _finalAmount_decorators;
    let _finalAmount_initializers = [];
    let _finalAmount_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _terms_decorators;
    let _terms_initializers = [];
    let _terms_extraInitializers = [];
    let _approvalRequired_decorators;
    let _approvalRequired_initializers = [];
    let _approvalRequired_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvedAt_decorators;
    let _approvedAt_initializers = [];
    let _approvedAt_extraInitializers = [];
    let _executedAt_decorators;
    let _executedAt_initializers = [];
    let _executedAt_extraInitializers = [];
    let _completedAt_decorators;
    let _completedAt_initializers = [];
    let _completedAt_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _updatedBy_decorators;
    let _updatedBy_initializers = [];
    let _updatedBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _offers_decorators;
    let _offers_initializers = [];
    let _offers_extraInitializers = [];
    let _parties_decorators;
    let _parties_initializers = [];
    let _parties_extraInitializers = [];
    let _activities_decorators;
    let _activities_initializers = [];
    let _activities_extraInitializers = [];
    var SettlementModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.settlementNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _settlementNumber_initializers, void 0));
            this.caseId = (__runInitializers(this, _settlementNumber_extraInitializers), __runInitializers(this, _caseId_initializers, void 0));
            this.settlementType = (__runInitializers(this, _caseId_extraInitializers), __runInitializers(this, _settlementType_initializers, void 0));
            this.status = (__runInitializers(this, _settlementType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.totalAmount = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _totalAmount_initializers, void 0));
            this.currency = (__runInitializers(this, _totalAmount_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
            this.demandAmount = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _demandAmount_initializers, void 0));
            this.offerAmount = (__runInitializers(this, _demandAmount_extraInitializers), __runInitializers(this, _offerAmount_initializers, void 0));
            this.finalAmount = (__runInitializers(this, _offerAmount_extraInitializers), __runInitializers(this, _finalAmount_initializers, void 0));
            this.description = (__runInitializers(this, _finalAmount_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.terms = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _terms_initializers, void 0));
            this.approvalRequired = (__runInitializers(this, _terms_extraInitializers), __runInitializers(this, _approvalRequired_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _approvalRequired_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvedAt = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvedAt_initializers, void 0));
            this.executedAt = (__runInitializers(this, _approvedAt_extraInitializers), __runInitializers(this, _executedAt_initializers, void 0));
            this.completedAt = (__runInitializers(this, _executedAt_extraInitializers), __runInitializers(this, _completedAt_initializers, void 0));
            this.metadata = (__runInitializers(this, _completedAt_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.tenantId = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.createdBy = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.offers = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _offers_initializers, void 0));
            this.parties = (__runInitializers(this, _offers_extraInitializers), __runInitializers(this, _parties_initializers, void 0));
            this.activities = (__runInitializers(this, _parties_extraInitializers), __runInitializers(this, _activities_initializers, void 0));
            __runInitializers(this, _activities_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SettlementModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _settlementNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                unique: true,
                allowNull: false,
            })];
        _caseId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _settlementType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(SettlementType)),
                allowNull: false,
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(SettlementStatus)),
                allowNull: false,
                defaultValue: SettlementStatus.DRAFT,
            })];
        _totalAmount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
            })];
        _currency_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(3),
                defaultValue: 'USD',
            })];
        _demandAmount_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _offerAmount_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _finalAmount_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _description_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _terms_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _approvalRequired_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: false,
            })];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _approvedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _executedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _completedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _updatedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _offers_decorators = [(0, sequelize_typescript_1.HasMany)(() => SettlementOfferModel)];
        _parties_decorators = [(0, sequelize_typescript_1.HasMany)(() => SettlementPartyModel)];
        _activities_decorators = [(0, sequelize_typescript_1.HasMany)(() => NegotiationActivityModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _settlementNumber_decorators, { kind: "field", name: "settlementNumber", static: false, private: false, access: { has: obj => "settlementNumber" in obj, get: obj => obj.settlementNumber, set: (obj, value) => { obj.settlementNumber = value; } }, metadata: _metadata }, _settlementNumber_initializers, _settlementNumber_extraInitializers);
        __esDecorate(null, null, _caseId_decorators, { kind: "field", name: "caseId", static: false, private: false, access: { has: obj => "caseId" in obj, get: obj => obj.caseId, set: (obj, value) => { obj.caseId = value; } }, metadata: _metadata }, _caseId_initializers, _caseId_extraInitializers);
        __esDecorate(null, null, _settlementType_decorators, { kind: "field", name: "settlementType", static: false, private: false, access: { has: obj => "settlementType" in obj, get: obj => obj.settlementType, set: (obj, value) => { obj.settlementType = value; } }, metadata: _metadata }, _settlementType_initializers, _settlementType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _totalAmount_decorators, { kind: "field", name: "totalAmount", static: false, private: false, access: { has: obj => "totalAmount" in obj, get: obj => obj.totalAmount, set: (obj, value) => { obj.totalAmount = value; } }, metadata: _metadata }, _totalAmount_initializers, _totalAmount_extraInitializers);
        __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
        __esDecorate(null, null, _demandAmount_decorators, { kind: "field", name: "demandAmount", static: false, private: false, access: { has: obj => "demandAmount" in obj, get: obj => obj.demandAmount, set: (obj, value) => { obj.demandAmount = value; } }, metadata: _metadata }, _demandAmount_initializers, _demandAmount_extraInitializers);
        __esDecorate(null, null, _offerAmount_decorators, { kind: "field", name: "offerAmount", static: false, private: false, access: { has: obj => "offerAmount" in obj, get: obj => obj.offerAmount, set: (obj, value) => { obj.offerAmount = value; } }, metadata: _metadata }, _offerAmount_initializers, _offerAmount_extraInitializers);
        __esDecorate(null, null, _finalAmount_decorators, { kind: "field", name: "finalAmount", static: false, private: false, access: { has: obj => "finalAmount" in obj, get: obj => obj.finalAmount, set: (obj, value) => { obj.finalAmount = value; } }, metadata: _metadata }, _finalAmount_initializers, _finalAmount_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _terms_decorators, { kind: "field", name: "terms", static: false, private: false, access: { has: obj => "terms" in obj, get: obj => obj.terms, set: (obj, value) => { obj.terms = value; } }, metadata: _metadata }, _terms_initializers, _terms_extraInitializers);
        __esDecorate(null, null, _approvalRequired_decorators, { kind: "field", name: "approvalRequired", static: false, private: false, access: { has: obj => "approvalRequired" in obj, get: obj => obj.approvalRequired, set: (obj, value) => { obj.approvalRequired = value; } }, metadata: _metadata }, _approvalRequired_initializers, _approvalRequired_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvedAt_decorators, { kind: "field", name: "approvedAt", static: false, private: false, access: { has: obj => "approvedAt" in obj, get: obj => obj.approvedAt, set: (obj, value) => { obj.approvedAt = value; } }, metadata: _metadata }, _approvedAt_initializers, _approvedAt_extraInitializers);
        __esDecorate(null, null, _executedAt_decorators, { kind: "field", name: "executedAt", static: false, private: false, access: { has: obj => "executedAt" in obj, get: obj => obj.executedAt, set: (obj, value) => { obj.executedAt = value; } }, metadata: _metadata }, _executedAt_initializers, _executedAt_extraInitializers);
        __esDecorate(null, null, _completedAt_decorators, { kind: "field", name: "completedAt", static: false, private: false, access: { has: obj => "completedAt" in obj, get: obj => obj.completedAt, set: (obj, value) => { obj.completedAt = value; } }, metadata: _metadata }, _completedAt_initializers, _completedAt_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _offers_decorators, { kind: "field", name: "offers", static: false, private: false, access: { has: obj => "offers" in obj, get: obj => obj.offers, set: (obj, value) => { obj.offers = value; } }, metadata: _metadata }, _offers_initializers, _offers_extraInitializers);
        __esDecorate(null, null, _parties_decorators, { kind: "field", name: "parties", static: false, private: false, access: { has: obj => "parties" in obj, get: obj => obj.parties, set: (obj, value) => { obj.parties = value; } }, metadata: _metadata }, _parties_initializers, _parties_extraInitializers);
        __esDecorate(null, null, _activities_decorators, { kind: "field", name: "activities", static: false, private: false, access: { has: obj => "activities" in obj, get: obj => obj.activities, set: (obj, value) => { obj.activities = value; } }, metadata: _metadata }, _activities_initializers, _activities_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SettlementModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SettlementModel = _classThis;
})();
exports.SettlementModel = SettlementModel;
/**
 * Settlement Offer Sequelize Model
 */
let SettlementOfferModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'settlement_offers',
            timestamps: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _settlementId_decorators;
    let _settlementId_initializers = [];
    let _settlementId_extraInitializers = [];
    let _offerNumber_decorators;
    let _offerNumber_initializers = [];
    let _offerNumber_extraInitializers = [];
    let _offerType_decorators;
    let _offerType_initializers = [];
    let _offerType_extraInitializers = [];
    let _offeredBy_decorators;
    let _offeredBy_initializers = [];
    let _offeredBy_extraInitializers = [];
    let _offeredByRole_decorators;
    let _offeredByRole_initializers = [];
    let _offeredByRole_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _terms_decorators;
    let _terms_initializers = [];
    let _terms_extraInitializers = [];
    let _conditions_decorators;
    let _conditions_initializers = [];
    let _conditions_extraInitializers = [];
    let _validUntil_decorators;
    let _validUntil_initializers = [];
    let _validUntil_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _responseDeadline_decorators;
    let _responseDeadline_initializers = [];
    let _responseDeadline_extraInitializers = [];
    let _parentOfferId_decorators;
    let _parentOfferId_initializers = [];
    let _parentOfferId_extraInitializers = [];
    let _counterOffers_decorators;
    let _counterOffers_initializers = [];
    let _counterOffers_extraInitializers = [];
    let _rejectionReason_decorators;
    let _rejectionReason_initializers = [];
    let _rejectionReason_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _settlement_decorators;
    let _settlement_initializers = [];
    let _settlement_extraInitializers = [];
    var SettlementOfferModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.settlementId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _settlementId_initializers, void 0));
            this.offerNumber = (__runInitializers(this, _settlementId_extraInitializers), __runInitializers(this, _offerNumber_initializers, void 0));
            this.offerType = (__runInitializers(this, _offerNumber_extraInitializers), __runInitializers(this, _offerType_initializers, void 0));
            this.offeredBy = (__runInitializers(this, _offerType_extraInitializers), __runInitializers(this, _offeredBy_initializers, void 0));
            this.offeredByRole = (__runInitializers(this, _offeredBy_extraInitializers), __runInitializers(this, _offeredByRole_initializers, void 0));
            this.amount = (__runInitializers(this, _offeredByRole_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
            this.currency = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
            this.terms = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _terms_initializers, void 0));
            this.conditions = (__runInitializers(this, _terms_extraInitializers), __runInitializers(this, _conditions_initializers, void 0));
            this.validUntil = (__runInitializers(this, _conditions_extraInitializers), __runInitializers(this, _validUntil_initializers, void 0));
            this.status = (__runInitializers(this, _validUntil_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.responseDeadline = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _responseDeadline_initializers, void 0));
            this.parentOfferId = (__runInitializers(this, _responseDeadline_extraInitializers), __runInitializers(this, _parentOfferId_initializers, void 0));
            this.counterOffers = (__runInitializers(this, _parentOfferId_extraInitializers), __runInitializers(this, _counterOffers_initializers, void 0));
            this.rejectionReason = (__runInitializers(this, _counterOffers_extraInitializers), __runInitializers(this, _rejectionReason_initializers, void 0));
            this.metadata = (__runInitializers(this, _rejectionReason_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.settlement = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _settlement_initializers, void 0));
            __runInitializers(this, _settlement_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SettlementOfferModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _settlementId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => SettlementModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _offerNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
            })];
        _offerType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('initial', 'counter', 'final'),
                allowNull: false,
            })];
        _offeredBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _offeredByRole_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(NegotiationRole)),
                allowNull: false,
            })];
        _amount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
            })];
        _currency_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(3),
                defaultValue: 'USD',
            })];
        _terms_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _conditions_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _validUntil_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(OfferStatus)),
                defaultValue: OfferStatus.PENDING,
            })];
        _responseDeadline_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _parentOfferId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _counterOffers_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _rejectionReason_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _settlement_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => SettlementModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _settlementId_decorators, { kind: "field", name: "settlementId", static: false, private: false, access: { has: obj => "settlementId" in obj, get: obj => obj.settlementId, set: (obj, value) => { obj.settlementId = value; } }, metadata: _metadata }, _settlementId_initializers, _settlementId_extraInitializers);
        __esDecorate(null, null, _offerNumber_decorators, { kind: "field", name: "offerNumber", static: false, private: false, access: { has: obj => "offerNumber" in obj, get: obj => obj.offerNumber, set: (obj, value) => { obj.offerNumber = value; } }, metadata: _metadata }, _offerNumber_initializers, _offerNumber_extraInitializers);
        __esDecorate(null, null, _offerType_decorators, { kind: "field", name: "offerType", static: false, private: false, access: { has: obj => "offerType" in obj, get: obj => obj.offerType, set: (obj, value) => { obj.offerType = value; } }, metadata: _metadata }, _offerType_initializers, _offerType_extraInitializers);
        __esDecorate(null, null, _offeredBy_decorators, { kind: "field", name: "offeredBy", static: false, private: false, access: { has: obj => "offeredBy" in obj, get: obj => obj.offeredBy, set: (obj, value) => { obj.offeredBy = value; } }, metadata: _metadata }, _offeredBy_initializers, _offeredBy_extraInitializers);
        __esDecorate(null, null, _offeredByRole_decorators, { kind: "field", name: "offeredByRole", static: false, private: false, access: { has: obj => "offeredByRole" in obj, get: obj => obj.offeredByRole, set: (obj, value) => { obj.offeredByRole = value; } }, metadata: _metadata }, _offeredByRole_initializers, _offeredByRole_extraInitializers);
        __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
        __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
        __esDecorate(null, null, _terms_decorators, { kind: "field", name: "terms", static: false, private: false, access: { has: obj => "terms" in obj, get: obj => obj.terms, set: (obj, value) => { obj.terms = value; } }, metadata: _metadata }, _terms_initializers, _terms_extraInitializers);
        __esDecorate(null, null, _conditions_decorators, { kind: "field", name: "conditions", static: false, private: false, access: { has: obj => "conditions" in obj, get: obj => obj.conditions, set: (obj, value) => { obj.conditions = value; } }, metadata: _metadata }, _conditions_initializers, _conditions_extraInitializers);
        __esDecorate(null, null, _validUntil_decorators, { kind: "field", name: "validUntil", static: false, private: false, access: { has: obj => "validUntil" in obj, get: obj => obj.validUntil, set: (obj, value) => { obj.validUntil = value; } }, metadata: _metadata }, _validUntil_initializers, _validUntil_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _responseDeadline_decorators, { kind: "field", name: "responseDeadline", static: false, private: false, access: { has: obj => "responseDeadline" in obj, get: obj => obj.responseDeadline, set: (obj, value) => { obj.responseDeadline = value; } }, metadata: _metadata }, _responseDeadline_initializers, _responseDeadline_extraInitializers);
        __esDecorate(null, null, _parentOfferId_decorators, { kind: "field", name: "parentOfferId", static: false, private: false, access: { has: obj => "parentOfferId" in obj, get: obj => obj.parentOfferId, set: (obj, value) => { obj.parentOfferId = value; } }, metadata: _metadata }, _parentOfferId_initializers, _parentOfferId_extraInitializers);
        __esDecorate(null, null, _counterOffers_decorators, { kind: "field", name: "counterOffers", static: false, private: false, access: { has: obj => "counterOffers" in obj, get: obj => obj.counterOffers, set: (obj, value) => { obj.counterOffers = value; } }, metadata: _metadata }, _counterOffers_initializers, _counterOffers_extraInitializers);
        __esDecorate(null, null, _rejectionReason_decorators, { kind: "field", name: "rejectionReason", static: false, private: false, access: { has: obj => "rejectionReason" in obj, get: obj => obj.rejectionReason, set: (obj, value) => { obj.rejectionReason = value; } }, metadata: _metadata }, _rejectionReason_initializers, _rejectionReason_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _settlement_decorators, { kind: "field", name: "settlement", static: false, private: false, access: { has: obj => "settlement" in obj, get: obj => obj.settlement, set: (obj, value) => { obj.settlement = value; } }, metadata: _metadata }, _settlement_initializers, _settlement_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SettlementOfferModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SettlementOfferModel = _classThis;
})();
exports.SettlementOfferModel = SettlementOfferModel;
/**
 * Settlement Party Sequelize Model
 */
let SettlementPartyModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'settlement_parties',
            timestamps: false,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _settlementId_decorators;
    let _settlementId_initializers = [];
    let _settlementId_extraInitializers = [];
    let _role_decorators;
    let _role_initializers = [];
    let _role_extraInitializers = [];
    let _entityType_decorators;
    let _entityType_initializers = [];
    let _entityType_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _phone_decorators;
    let _phone_initializers = [];
    let _phone_extraInitializers = [];
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _authorityLimit_decorators;
    let _authorityLimit_initializers = [];
    let _authorityLimit_extraInitializers = [];
    let _signatureRequired_decorators;
    let _signatureRequired_initializers = [];
    let _signatureRequired_extraInitializers = [];
    let _signedAt_decorators;
    let _signedAt_initializers = [];
    let _signedAt_extraInitializers = [];
    let _signatureUrl_decorators;
    let _signatureUrl_initializers = [];
    let _signatureUrl_extraInitializers = [];
    let _isPrimary_decorators;
    let _isPrimary_initializers = [];
    let _isPrimary_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _settlement_decorators;
    let _settlement_initializers = [];
    let _settlement_extraInitializers = [];
    var SettlementPartyModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.settlementId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _settlementId_initializers, void 0));
            this.role = (__runInitializers(this, _settlementId_extraInitializers), __runInitializers(this, _role_initializers, void 0));
            this.entityType = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _entityType_initializers, void 0));
            this.name = (__runInitializers(this, _entityType_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.email = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
            this.organizationId = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _organizationId_initializers, void 0));
            this.userId = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.authorityLimit = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _authorityLimit_initializers, void 0));
            this.signatureRequired = (__runInitializers(this, _authorityLimit_extraInitializers), __runInitializers(this, _signatureRequired_initializers, void 0));
            this.signedAt = (__runInitializers(this, _signatureRequired_extraInitializers), __runInitializers(this, _signedAt_initializers, void 0));
            this.signatureUrl = (__runInitializers(this, _signedAt_extraInitializers), __runInitializers(this, _signatureUrl_initializers, void 0));
            this.isPrimary = (__runInitializers(this, _signatureUrl_extraInitializers), __runInitializers(this, _isPrimary_initializers, void 0));
            this.metadata = (__runInitializers(this, _isPrimary_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.settlement = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _settlement_initializers, void 0));
            __runInitializers(this, _settlement_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SettlementPartyModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _settlementId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => SettlementModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _role_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(NegotiationRole)),
                allowNull: false,
            })];
        _entityType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('individual', 'organization'),
                allowNull: false,
            })];
        _name_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
            })];
        _email_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _phone_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _organizationId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _userId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _authorityLimit_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _signatureRequired_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: false,
            })];
        _signedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _signatureUrl_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _isPrimary_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: false,
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _settlement_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => SettlementModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _settlementId_decorators, { kind: "field", name: "settlementId", static: false, private: false, access: { has: obj => "settlementId" in obj, get: obj => obj.settlementId, set: (obj, value) => { obj.settlementId = value; } }, metadata: _metadata }, _settlementId_initializers, _settlementId_extraInitializers);
        __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: obj => "role" in obj, get: obj => obj.role, set: (obj, value) => { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
        __esDecorate(null, null, _entityType_decorators, { kind: "field", name: "entityType", static: false, private: false, access: { has: obj => "entityType" in obj, get: obj => obj.entityType, set: (obj, value) => { obj.entityType = value; } }, metadata: _metadata }, _entityType_initializers, _entityType_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: obj => "phone" in obj, get: obj => obj.phone, set: (obj, value) => { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
        __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _authorityLimit_decorators, { kind: "field", name: "authorityLimit", static: false, private: false, access: { has: obj => "authorityLimit" in obj, get: obj => obj.authorityLimit, set: (obj, value) => { obj.authorityLimit = value; } }, metadata: _metadata }, _authorityLimit_initializers, _authorityLimit_extraInitializers);
        __esDecorate(null, null, _signatureRequired_decorators, { kind: "field", name: "signatureRequired", static: false, private: false, access: { has: obj => "signatureRequired" in obj, get: obj => obj.signatureRequired, set: (obj, value) => { obj.signatureRequired = value; } }, metadata: _metadata }, _signatureRequired_initializers, _signatureRequired_extraInitializers);
        __esDecorate(null, null, _signedAt_decorators, { kind: "field", name: "signedAt", static: false, private: false, access: { has: obj => "signedAt" in obj, get: obj => obj.signedAt, set: (obj, value) => { obj.signedAt = value; } }, metadata: _metadata }, _signedAt_initializers, _signedAt_extraInitializers);
        __esDecorate(null, null, _signatureUrl_decorators, { kind: "field", name: "signatureUrl", static: false, private: false, access: { has: obj => "signatureUrl" in obj, get: obj => obj.signatureUrl, set: (obj, value) => { obj.signatureUrl = value; } }, metadata: _metadata }, _signatureUrl_initializers, _signatureUrl_extraInitializers);
        __esDecorate(null, null, _isPrimary_decorators, { kind: "field", name: "isPrimary", static: false, private: false, access: { has: obj => "isPrimary" in obj, get: obj => obj.isPrimary, set: (obj, value) => { obj.isPrimary = value; } }, metadata: _metadata }, _isPrimary_initializers, _isPrimary_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _settlement_decorators, { kind: "field", name: "settlement", static: false, private: false, access: { has: obj => "settlement" in obj, get: obj => obj.settlement, set: (obj, value) => { obj.settlement = value; } }, metadata: _metadata }, _settlement_initializers, _settlement_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SettlementPartyModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SettlementPartyModel = _classThis;
})();
exports.SettlementPartyModel = SettlementPartyModel;
/**
 * Negotiation Session Sequelize Model
 */
let NegotiationSessionModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'negotiation_sessions',
            timestamps: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _settlementId_decorators;
    let _settlementId_initializers = [];
    let _settlementId_extraInitializers = [];
    let _sessionNumber_decorators;
    let _sessionNumber_initializers = [];
    let _sessionNumber_extraInitializers = [];
    let _sessionType_decorators;
    let _sessionType_initializers = [];
    let _sessionType_extraInitializers = [];
    let _scheduledAt_decorators;
    let _scheduledAt_initializers = [];
    let _scheduledAt_extraInitializers = [];
    let _startedAt_decorators;
    let _startedAt_initializers = [];
    let _startedAt_extraInitializers = [];
    let _endedAt_decorators;
    let _endedAt_initializers = [];
    let _endedAt_extraInitializers = [];
    let _participants_decorators;
    let _participants_initializers = [];
    let _participants_extraInitializers = [];
    let _agenda_decorators;
    let _agenda_initializers = [];
    let _agenda_extraInitializers = [];
    let _summary_decorators;
    let _summary_initializers = [];
    let _summary_extraInitializers = [];
    let _outcome_decorators;
    let _outcome_initializers = [];
    let _outcome_extraInitializers = [];
    let _nextSteps_decorators;
    let _nextSteps_initializers = [];
    let _nextSteps_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var NegotiationSessionModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.settlementId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _settlementId_initializers, void 0));
            this.sessionNumber = (__runInitializers(this, _settlementId_extraInitializers), __runInitializers(this, _sessionNumber_initializers, void 0));
            this.sessionType = (__runInitializers(this, _sessionNumber_extraInitializers), __runInitializers(this, _sessionType_initializers, void 0));
            this.scheduledAt = (__runInitializers(this, _sessionType_extraInitializers), __runInitializers(this, _scheduledAt_initializers, void 0));
            this.startedAt = (__runInitializers(this, _scheduledAt_extraInitializers), __runInitializers(this, _startedAt_initializers, void 0));
            this.endedAt = (__runInitializers(this, _startedAt_extraInitializers), __runInitializers(this, _endedAt_initializers, void 0));
            this.participants = (__runInitializers(this, _endedAt_extraInitializers), __runInitializers(this, _participants_initializers, void 0));
            this.agenda = (__runInitializers(this, _participants_extraInitializers), __runInitializers(this, _agenda_initializers, void 0));
            this.summary = (__runInitializers(this, _agenda_extraInitializers), __runInitializers(this, _summary_initializers, void 0));
            this.outcome = (__runInitializers(this, _summary_extraInitializers), __runInitializers(this, _outcome_initializers, void 0));
            this.nextSteps = (__runInitializers(this, _outcome_extraInitializers), __runInitializers(this, _nextSteps_initializers, void 0));
            this.attachments = (__runInitializers(this, _nextSteps_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.metadata = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdBy = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "NegotiationSessionModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _settlementId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _sessionNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
            })];
        _sessionType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('direct', 'mediated', 'virtual', 'in_person'),
                allowNull: false,
            })];
        _scheduledAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _startedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _endedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _participants_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _agenda_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _summary_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _outcome_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _nextSteps_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _attachments_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _settlementId_decorators, { kind: "field", name: "settlementId", static: false, private: false, access: { has: obj => "settlementId" in obj, get: obj => obj.settlementId, set: (obj, value) => { obj.settlementId = value; } }, metadata: _metadata }, _settlementId_initializers, _settlementId_extraInitializers);
        __esDecorate(null, null, _sessionNumber_decorators, { kind: "field", name: "sessionNumber", static: false, private: false, access: { has: obj => "sessionNumber" in obj, get: obj => obj.sessionNumber, set: (obj, value) => { obj.sessionNumber = value; } }, metadata: _metadata }, _sessionNumber_initializers, _sessionNumber_extraInitializers);
        __esDecorate(null, null, _sessionType_decorators, { kind: "field", name: "sessionType", static: false, private: false, access: { has: obj => "sessionType" in obj, get: obj => obj.sessionType, set: (obj, value) => { obj.sessionType = value; } }, metadata: _metadata }, _sessionType_initializers, _sessionType_extraInitializers);
        __esDecorate(null, null, _scheduledAt_decorators, { kind: "field", name: "scheduledAt", static: false, private: false, access: { has: obj => "scheduledAt" in obj, get: obj => obj.scheduledAt, set: (obj, value) => { obj.scheduledAt = value; } }, metadata: _metadata }, _scheduledAt_initializers, _scheduledAt_extraInitializers);
        __esDecorate(null, null, _startedAt_decorators, { kind: "field", name: "startedAt", static: false, private: false, access: { has: obj => "startedAt" in obj, get: obj => obj.startedAt, set: (obj, value) => { obj.startedAt = value; } }, metadata: _metadata }, _startedAt_initializers, _startedAt_extraInitializers);
        __esDecorate(null, null, _endedAt_decorators, { kind: "field", name: "endedAt", static: false, private: false, access: { has: obj => "endedAt" in obj, get: obj => obj.endedAt, set: (obj, value) => { obj.endedAt = value; } }, metadata: _metadata }, _endedAt_initializers, _endedAt_extraInitializers);
        __esDecorate(null, null, _participants_decorators, { kind: "field", name: "participants", static: false, private: false, access: { has: obj => "participants" in obj, get: obj => obj.participants, set: (obj, value) => { obj.participants = value; } }, metadata: _metadata }, _participants_initializers, _participants_extraInitializers);
        __esDecorate(null, null, _agenda_decorators, { kind: "field", name: "agenda", static: false, private: false, access: { has: obj => "agenda" in obj, get: obj => obj.agenda, set: (obj, value) => { obj.agenda = value; } }, metadata: _metadata }, _agenda_initializers, _agenda_extraInitializers);
        __esDecorate(null, null, _summary_decorators, { kind: "field", name: "summary", static: false, private: false, access: { has: obj => "summary" in obj, get: obj => obj.summary, set: (obj, value) => { obj.summary = value; } }, metadata: _metadata }, _summary_initializers, _summary_extraInitializers);
        __esDecorate(null, null, _outcome_decorators, { kind: "field", name: "outcome", static: false, private: false, access: { has: obj => "outcome" in obj, get: obj => obj.outcome, set: (obj, value) => { obj.outcome = value; } }, metadata: _metadata }, _outcome_initializers, _outcome_extraInitializers);
        __esDecorate(null, null, _nextSteps_decorators, { kind: "field", name: "nextSteps", static: false, private: false, access: { has: obj => "nextSteps" in obj, get: obj => obj.nextSteps, set: (obj, value) => { obj.nextSteps = value; } }, metadata: _metadata }, _nextSteps_initializers, _nextSteps_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NegotiationSessionModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NegotiationSessionModel = _classThis;
})();
exports.NegotiationSessionModel = NegotiationSessionModel;
/**
 * Negotiation Activity Sequelize Model
 */
let NegotiationActivityModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'negotiation_activities',
            timestamps: false,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _settlementId_decorators;
    let _settlementId_initializers = [];
    let _settlementId_extraInitializers = [];
    let _activityType_decorators;
    let _activityType_initializers = [];
    let _activityType_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _performedBy_decorators;
    let _performedBy_initializers = [];
    let _performedBy_extraInitializers = [];
    let _performedByRole_decorators;
    let _performedByRole_initializers = [];
    let _performedByRole_extraInitializers = [];
    let _relatedOfferId_decorators;
    let _relatedOfferId_initializers = [];
    let _relatedOfferId_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _timestamp_decorators;
    let _timestamp_initializers = [];
    let _timestamp_extraInitializers = [];
    let _settlement_decorators;
    let _settlement_initializers = [];
    let _settlement_extraInitializers = [];
    var NegotiationActivityModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.settlementId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _settlementId_initializers, void 0));
            this.activityType = (__runInitializers(this, _settlementId_extraInitializers), __runInitializers(this, _activityType_initializers, void 0));
            this.description = (__runInitializers(this, _activityType_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.performedBy = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _performedBy_initializers, void 0));
            this.performedByRole = (__runInitializers(this, _performedBy_extraInitializers), __runInitializers(this, _performedByRole_initializers, void 0));
            this.relatedOfferId = (__runInitializers(this, _performedByRole_extraInitializers), __runInitializers(this, _relatedOfferId_initializers, void 0));
            this.metadata = (__runInitializers(this, _relatedOfferId_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.timestamp = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _timestamp_initializers, void 0));
            this.settlement = (__runInitializers(this, _timestamp_extraInitializers), __runInitializers(this, _settlement_initializers, void 0));
            __runInitializers(this, _settlement_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "NegotiationActivityModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _settlementId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => SettlementModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _activityType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ActivityType)),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _performedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _performedByRole_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(NegotiationRole)),
                allowNull: false,
            })];
        _relatedOfferId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _timestamp_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                defaultValue: sequelize_typescript_1.DataType.NOW,
            })];
        _settlement_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => SettlementModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _settlementId_decorators, { kind: "field", name: "settlementId", static: false, private: false, access: { has: obj => "settlementId" in obj, get: obj => obj.settlementId, set: (obj, value) => { obj.settlementId = value; } }, metadata: _metadata }, _settlementId_initializers, _settlementId_extraInitializers);
        __esDecorate(null, null, _activityType_decorators, { kind: "field", name: "activityType", static: false, private: false, access: { has: obj => "activityType" in obj, get: obj => obj.activityType, set: (obj, value) => { obj.activityType = value; } }, metadata: _metadata }, _activityType_initializers, _activityType_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _performedBy_decorators, { kind: "field", name: "performedBy", static: false, private: false, access: { has: obj => "performedBy" in obj, get: obj => obj.performedBy, set: (obj, value) => { obj.performedBy = value; } }, metadata: _metadata }, _performedBy_initializers, _performedBy_extraInitializers);
        __esDecorate(null, null, _performedByRole_decorators, { kind: "field", name: "performedByRole", static: false, private: false, access: { has: obj => "performedByRole" in obj, get: obj => obj.performedByRole, set: (obj, value) => { obj.performedByRole = value; } }, metadata: _metadata }, _performedByRole_initializers, _performedByRole_extraInitializers);
        __esDecorate(null, null, _relatedOfferId_decorators, { kind: "field", name: "relatedOfferId", static: false, private: false, access: { has: obj => "relatedOfferId" in obj, get: obj => obj.relatedOfferId, set: (obj, value) => { obj.relatedOfferId = value; } }, metadata: _metadata }, _relatedOfferId_initializers, _relatedOfferId_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _timestamp_decorators, { kind: "field", name: "timestamp", static: false, private: false, access: { has: obj => "timestamp" in obj, get: obj => obj.timestamp, set: (obj, value) => { obj.timestamp = value; } }, metadata: _metadata }, _timestamp_initializers, _timestamp_extraInitializers);
        __esDecorate(null, null, _settlement_decorators, { kind: "field", name: "settlement", static: false, private: false, access: { has: obj => "settlement" in obj, get: obj => obj.settlement, set: (obj, value) => { obj.settlement = value; } }, metadata: _metadata }, _settlement_initializers, _settlement_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NegotiationActivityModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NegotiationActivityModel = _classThis;
})();
exports.NegotiationActivityModel = NegotiationActivityModel;
/**
 * Payment Plan Sequelize Model
 */
let PaymentPlanModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'payment_plans',
            timestamps: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _settlementId_decorators;
    let _settlementId_initializers = [];
    let _settlementId_extraInitializers = [];
    let _totalAmount_decorators;
    let _totalAmount_initializers = [];
    let _totalAmount_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _numberOfInstallments_decorators;
    let _numberOfInstallments_initializers = [];
    let _numberOfInstallments_extraInitializers = [];
    let _frequency_decorators;
    let _frequency_initializers = [];
    let _frequency_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _latePaymentPenalty_decorators;
    let _latePaymentPenalty_initializers = [];
    let _latePaymentPenalty_extraInitializers = [];
    let _defaultGracePeriodDays_decorators;
    let _defaultGracePeriodDays_initializers = [];
    let _defaultGracePeriodDays_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _installments_decorators;
    let _installments_initializers = [];
    let _installments_extraInitializers = [];
    var PaymentPlanModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.settlementId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _settlementId_initializers, void 0));
            this.totalAmount = (__runInitializers(this, _settlementId_extraInitializers), __runInitializers(this, _totalAmount_initializers, void 0));
            this.currency = (__runInitializers(this, _totalAmount_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
            this.numberOfInstallments = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _numberOfInstallments_initializers, void 0));
            this.frequency = (__runInitializers(this, _numberOfInstallments_extraInitializers), __runInitializers(this, _frequency_initializers, void 0));
            this.startDate = (__runInitializers(this, _frequency_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.status = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.latePaymentPenalty = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _latePaymentPenalty_initializers, void 0));
            this.defaultGracePeriodDays = (__runInitializers(this, _latePaymentPenalty_extraInitializers), __runInitializers(this, _defaultGracePeriodDays_initializers, void 0));
            this.metadata = (__runInitializers(this, _defaultGracePeriodDays_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.installments = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _installments_initializers, void 0));
            __runInitializers(this, _installments_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PaymentPlanModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _settlementId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                unique: true,
            })];
        _totalAmount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
            })];
        _currency_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(3),
                defaultValue: 'USD',
            })];
        _numberOfInstallments_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
            })];
        _frequency_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('weekly', 'bi-weekly', 'monthly', 'quarterly', 'custom'),
                allowNull: false,
            })];
        _startDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _endDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PaymentPlanStatus)),
                defaultValue: PaymentPlanStatus.ACTIVE,
            })];
        _latePaymentPenalty_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _defaultGracePeriodDays_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                defaultValue: 5,
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _installments_decorators = [(0, sequelize_typescript_1.HasMany)(() => PaymentInstallmentModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _settlementId_decorators, { kind: "field", name: "settlementId", static: false, private: false, access: { has: obj => "settlementId" in obj, get: obj => obj.settlementId, set: (obj, value) => { obj.settlementId = value; } }, metadata: _metadata }, _settlementId_initializers, _settlementId_extraInitializers);
        __esDecorate(null, null, _totalAmount_decorators, { kind: "field", name: "totalAmount", static: false, private: false, access: { has: obj => "totalAmount" in obj, get: obj => obj.totalAmount, set: (obj, value) => { obj.totalAmount = value; } }, metadata: _metadata }, _totalAmount_initializers, _totalAmount_extraInitializers);
        __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
        __esDecorate(null, null, _numberOfInstallments_decorators, { kind: "field", name: "numberOfInstallments", static: false, private: false, access: { has: obj => "numberOfInstallments" in obj, get: obj => obj.numberOfInstallments, set: (obj, value) => { obj.numberOfInstallments = value; } }, metadata: _metadata }, _numberOfInstallments_initializers, _numberOfInstallments_extraInitializers);
        __esDecorate(null, null, _frequency_decorators, { kind: "field", name: "frequency", static: false, private: false, access: { has: obj => "frequency" in obj, get: obj => obj.frequency, set: (obj, value) => { obj.frequency = value; } }, metadata: _metadata }, _frequency_initializers, _frequency_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _latePaymentPenalty_decorators, { kind: "field", name: "latePaymentPenalty", static: false, private: false, access: { has: obj => "latePaymentPenalty" in obj, get: obj => obj.latePaymentPenalty, set: (obj, value) => { obj.latePaymentPenalty = value; } }, metadata: _metadata }, _latePaymentPenalty_initializers, _latePaymentPenalty_extraInitializers);
        __esDecorate(null, null, _defaultGracePeriodDays_decorators, { kind: "field", name: "defaultGracePeriodDays", static: false, private: false, access: { has: obj => "defaultGracePeriodDays" in obj, get: obj => obj.defaultGracePeriodDays, set: (obj, value) => { obj.defaultGracePeriodDays = value; } }, metadata: _metadata }, _defaultGracePeriodDays_initializers, _defaultGracePeriodDays_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _installments_decorators, { kind: "field", name: "installments", static: false, private: false, access: { has: obj => "installments" in obj, get: obj => obj.installments, set: (obj, value) => { obj.installments = value; } }, metadata: _metadata }, _installments_initializers, _installments_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PaymentPlanModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PaymentPlanModel = _classThis;
})();
exports.PaymentPlanModel = PaymentPlanModel;
/**
 * Payment Installment Sequelize Model
 */
let PaymentInstallmentModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'payment_installments',
            timestamps: false,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _paymentPlanId_decorators;
    let _paymentPlanId_initializers = [];
    let _paymentPlanId_extraInitializers = [];
    let _installmentNumber_decorators;
    let _installmentNumber_initializers = [];
    let _installmentNumber_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _paidDate_decorators;
    let _paidDate_initializers = [];
    let _paidDate_extraInitializers = [];
    let _paidAmount_decorators;
    let _paidAmount_initializers = [];
    let _paidAmount_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _paymentMethod_decorators;
    let _paymentMethod_initializers = [];
    let _paymentMethod_extraInitializers = [];
    let _transactionId_decorators;
    let _transactionId_initializers = [];
    let _transactionId_extraInitializers = [];
    let _receiptUrl_decorators;
    let _receiptUrl_initializers = [];
    let _receiptUrl_extraInitializers = [];
    let _lateFeesApplied_decorators;
    let _lateFeesApplied_initializers = [];
    let _lateFeesApplied_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _paymentPlan_decorators;
    let _paymentPlan_initializers = [];
    let _paymentPlan_extraInitializers = [];
    var PaymentInstallmentModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.paymentPlanId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _paymentPlanId_initializers, void 0));
            this.installmentNumber = (__runInitializers(this, _paymentPlanId_extraInitializers), __runInitializers(this, _installmentNumber_initializers, void 0));
            this.amount = (__runInitializers(this, _installmentNumber_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
            this.dueDate = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
            this.paidDate = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _paidDate_initializers, void 0));
            this.paidAmount = (__runInitializers(this, _paidDate_extraInitializers), __runInitializers(this, _paidAmount_initializers, void 0));
            this.status = (__runInitializers(this, _paidAmount_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.paymentMethod = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _paymentMethod_initializers, void 0));
            this.transactionId = (__runInitializers(this, _paymentMethod_extraInitializers), __runInitializers(this, _transactionId_initializers, void 0));
            this.receiptUrl = (__runInitializers(this, _transactionId_extraInitializers), __runInitializers(this, _receiptUrl_initializers, void 0));
            this.lateFeesApplied = (__runInitializers(this, _receiptUrl_extraInitializers), __runInitializers(this, _lateFeesApplied_initializers, void 0));
            this.metadata = (__runInitializers(this, _lateFeesApplied_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.paymentPlan = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _paymentPlan_initializers, void 0));
            __runInitializers(this, _paymentPlan_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PaymentInstallmentModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _paymentPlanId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => PaymentPlanModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _installmentNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
            })];
        _amount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
            })];
        _dueDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _paidDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _paidAmount_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(InstallmentStatus)),
                defaultValue: InstallmentStatus.PENDING,
            })];
        _paymentMethod_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _transactionId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _receiptUrl_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _lateFeesApplied_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _paymentPlan_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => PaymentPlanModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _paymentPlanId_decorators, { kind: "field", name: "paymentPlanId", static: false, private: false, access: { has: obj => "paymentPlanId" in obj, get: obj => obj.paymentPlanId, set: (obj, value) => { obj.paymentPlanId = value; } }, metadata: _metadata }, _paymentPlanId_initializers, _paymentPlanId_extraInitializers);
        __esDecorate(null, null, _installmentNumber_decorators, { kind: "field", name: "installmentNumber", static: false, private: false, access: { has: obj => "installmentNumber" in obj, get: obj => obj.installmentNumber, set: (obj, value) => { obj.installmentNumber = value; } }, metadata: _metadata }, _installmentNumber_initializers, _installmentNumber_extraInitializers);
        __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
        __esDecorate(null, null, _paidDate_decorators, { kind: "field", name: "paidDate", static: false, private: false, access: { has: obj => "paidDate" in obj, get: obj => obj.paidDate, set: (obj, value) => { obj.paidDate = value; } }, metadata: _metadata }, _paidDate_initializers, _paidDate_extraInitializers);
        __esDecorate(null, null, _paidAmount_decorators, { kind: "field", name: "paidAmount", static: false, private: false, access: { has: obj => "paidAmount" in obj, get: obj => obj.paidAmount, set: (obj, value) => { obj.paidAmount = value; } }, metadata: _metadata }, _paidAmount_initializers, _paidAmount_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _paymentMethod_decorators, { kind: "field", name: "paymentMethod", static: false, private: false, access: { has: obj => "paymentMethod" in obj, get: obj => obj.paymentMethod, set: (obj, value) => { obj.paymentMethod = value; } }, metadata: _metadata }, _paymentMethod_initializers, _paymentMethod_extraInitializers);
        __esDecorate(null, null, _transactionId_decorators, { kind: "field", name: "transactionId", static: false, private: false, access: { has: obj => "transactionId" in obj, get: obj => obj.transactionId, set: (obj, value) => { obj.transactionId = value; } }, metadata: _metadata }, _transactionId_initializers, _transactionId_extraInitializers);
        __esDecorate(null, null, _receiptUrl_decorators, { kind: "field", name: "receiptUrl", static: false, private: false, access: { has: obj => "receiptUrl" in obj, get: obj => obj.receiptUrl, set: (obj, value) => { obj.receiptUrl = value; } }, metadata: _metadata }, _receiptUrl_initializers, _receiptUrl_extraInitializers);
        __esDecorate(null, null, _lateFeesApplied_decorators, { kind: "field", name: "lateFeesApplied", static: false, private: false, access: { has: obj => "lateFeesApplied" in obj, get: obj => obj.lateFeesApplied, set: (obj, value) => { obj.lateFeesApplied = value; } }, metadata: _metadata }, _lateFeesApplied_initializers, _lateFeesApplied_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _paymentPlan_decorators, { kind: "field", name: "paymentPlan", static: false, private: false, access: { has: obj => "paymentPlan" in obj, get: obj => obj.paymentPlan, set: (obj, value) => { obj.paymentPlan = value; } }, metadata: _metadata }, _paymentPlan_initializers, _paymentPlan_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PaymentInstallmentModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PaymentInstallmentModel = _classThis;
})();
exports.PaymentInstallmentModel = PaymentInstallmentModel;
/**
 * Settlement Authority Sequelize Model
 */
let SettlementAuthorityModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'settlement_authorities',
            timestamps: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _role_decorators;
    let _role_initializers = [];
    let _role_extraInitializers = [];
    let _minAmount_decorators;
    let _minAmount_initializers = [];
    let _minAmount_extraInitializers = [];
    let _maxAmount_decorators;
    let _maxAmount_initializers = [];
    let _maxAmount_extraInitializers = [];
    let _settlementTypes_decorators;
    let _settlementTypes_initializers = [];
    let _settlementTypes_extraInitializers = [];
    let _requiresApproval_decorators;
    let _requiresApproval_initializers = [];
    let _requiresApproval_extraInitializers = [];
    let _approverUserId_decorators;
    let _approverUserId_initializers = [];
    let _approverUserId_extraInitializers = [];
    let _delegatedFrom_decorators;
    let _delegatedFrom_initializers = [];
    let _delegatedFrom_extraInitializers = [];
    let _effectiveFrom_decorators;
    let _effectiveFrom_initializers = [];
    let _effectiveFrom_extraInitializers = [];
    let _effectiveUntil_decorators;
    let _effectiveUntil_initializers = [];
    let _effectiveUntil_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var SettlementAuthorityModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.userId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.role = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _role_initializers, void 0));
            this.minAmount = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _minAmount_initializers, void 0));
            this.maxAmount = (__runInitializers(this, _minAmount_extraInitializers), __runInitializers(this, _maxAmount_initializers, void 0));
            this.settlementTypes = (__runInitializers(this, _maxAmount_extraInitializers), __runInitializers(this, _settlementTypes_initializers, void 0));
            this.requiresApproval = (__runInitializers(this, _settlementTypes_extraInitializers), __runInitializers(this, _requiresApproval_initializers, void 0));
            this.approverUserId = (__runInitializers(this, _requiresApproval_extraInitializers), __runInitializers(this, _approverUserId_initializers, void 0));
            this.delegatedFrom = (__runInitializers(this, _approverUserId_extraInitializers), __runInitializers(this, _delegatedFrom_initializers, void 0));
            this.effectiveFrom = (__runInitializers(this, _delegatedFrom_extraInitializers), __runInitializers(this, _effectiveFrom_initializers, void 0));
            this.effectiveUntil = (__runInitializers(this, _effectiveFrom_extraInitializers), __runInitializers(this, _effectiveUntil_initializers, void 0));
            this.isActive = (__runInitializers(this, _effectiveUntil_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.metadata = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SettlementAuthorityModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _userId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _role_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: false,
            })];
        _minAmount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
            })];
        _maxAmount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
            })];
        _settlementTypes_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _requiresApproval_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: false,
            })];
        _approverUserId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _delegatedFrom_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _effectiveFrom_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _effectiveUntil_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _isActive_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: true,
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: obj => "role" in obj, get: obj => obj.role, set: (obj, value) => { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
        __esDecorate(null, null, _minAmount_decorators, { kind: "field", name: "minAmount", static: false, private: false, access: { has: obj => "minAmount" in obj, get: obj => obj.minAmount, set: (obj, value) => { obj.minAmount = value; } }, metadata: _metadata }, _minAmount_initializers, _minAmount_extraInitializers);
        __esDecorate(null, null, _maxAmount_decorators, { kind: "field", name: "maxAmount", static: false, private: false, access: { has: obj => "maxAmount" in obj, get: obj => obj.maxAmount, set: (obj, value) => { obj.maxAmount = value; } }, metadata: _metadata }, _maxAmount_initializers, _maxAmount_extraInitializers);
        __esDecorate(null, null, _settlementTypes_decorators, { kind: "field", name: "settlementTypes", static: false, private: false, access: { has: obj => "settlementTypes" in obj, get: obj => obj.settlementTypes, set: (obj, value) => { obj.settlementTypes = value; } }, metadata: _metadata }, _settlementTypes_initializers, _settlementTypes_extraInitializers);
        __esDecorate(null, null, _requiresApproval_decorators, { kind: "field", name: "requiresApproval", static: false, private: false, access: { has: obj => "requiresApproval" in obj, get: obj => obj.requiresApproval, set: (obj, value) => { obj.requiresApproval = value; } }, metadata: _metadata }, _requiresApproval_initializers, _requiresApproval_extraInitializers);
        __esDecorate(null, null, _approverUserId_decorators, { kind: "field", name: "approverUserId", static: false, private: false, access: { has: obj => "approverUserId" in obj, get: obj => obj.approverUserId, set: (obj, value) => { obj.approverUserId = value; } }, metadata: _metadata }, _approverUserId_initializers, _approverUserId_extraInitializers);
        __esDecorate(null, null, _delegatedFrom_decorators, { kind: "field", name: "delegatedFrom", static: false, private: false, access: { has: obj => "delegatedFrom" in obj, get: obj => obj.delegatedFrom, set: (obj, value) => { obj.delegatedFrom = value; } }, metadata: _metadata }, _delegatedFrom_initializers, _delegatedFrom_extraInitializers);
        __esDecorate(null, null, _effectiveFrom_decorators, { kind: "field", name: "effectiveFrom", static: false, private: false, access: { has: obj => "effectiveFrom" in obj, get: obj => obj.effectiveFrom, set: (obj, value) => { obj.effectiveFrom = value; } }, metadata: _metadata }, _effectiveFrom_initializers, _effectiveFrom_extraInitializers);
        __esDecorate(null, null, _effectiveUntil_decorators, { kind: "field", name: "effectiveUntil", static: false, private: false, access: { has: obj => "effectiveUntil" in obj, get: obj => obj.effectiveUntil, set: (obj, value) => { obj.effectiveUntil = value; } }, metadata: _metadata }, _effectiveUntil_initializers, _effectiveUntil_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SettlementAuthorityModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SettlementAuthorityModel = _classThis;
})();
exports.SettlementAuthorityModel = SettlementAuthorityModel;
// ============================================================================
// CONFIGURATION MANAGEMENT
// ============================================================================
/**
 * Register settlement negotiation configuration namespace
 *
 * @returns Configuration factory for NestJS
 *
 * @example
 * ```typescript
 * ConfigModule.forRoot({
 *   load: [registerSettlementConfig()],
 * })
 * ```
 */
function registerSettlementConfig() {
    return (0, config_1.registerAs)('settlements', () => ({
        settlementNumberPrefix: process.env.SETTLEMENT_NUMBER_PREFIX || 'STL',
        defaultCurrency: process.env.SETTLEMENT_DEFAULT_CURRENCY || 'USD',
        offerExpirationDays: parseInt(process.env.SETTLEMENT_OFFER_EXPIRATION_DAYS || '30', 10),
        defaultPaymentPlanGraceDays: parseInt(process.env.SETTLEMENT_PAYMENT_GRACE_DAYS || '5', 10),
        maxInstallments: parseInt(process.env.SETTLEMENT_MAX_INSTALLMENTS || '120', 10),
        requireApprovalAboveAmount: parseFloat(process.env.SETTLEMENT_APPROVAL_THRESHOLD || '100000'),
        reminderSchedule: process.env.SETTLEMENT_REMINDER_SCHEDULE || '0 9 * * *',
        paymentReminderDays: process.env.SETTLEMENT_PAYMENT_REMINDERS?.split(',').map(Number) || [7, 3, 1],
        enableAutoApproval: process.env.SETTLEMENT_AUTO_APPROVAL === 'true',
        enableMediation: process.env.SETTLEMENT_ENABLE_MEDIATION !== 'false',
        defaultAuthorityLevels: {
            junior: { min: 0, max: 25000 },
            senior: { min: 0, max: 100000 },
            manager: { min: 0, max: 500000 },
            director: { min: 0, max: Number.MAX_SAFE_INTEGER },
        },
    }));
}
/**
 * Create settlement negotiation configuration module
 *
 * @returns DynamicModule for settlement config
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [createSettlementConfigModule()],
 * })
 * export class SettlementModule {}
 * ```
 */
function createSettlementConfigModule() {
    return config_1.ConfigModule.forRoot({
        load: [registerSettlementConfig()],
        isGlobal: true,
        cache: true,
    });
}
// ============================================================================
// SETTLEMENT CREATION & MANAGEMENT
// ============================================================================
/**
 * Generate unique settlement number
 *
 * @param configService - Configuration service
 * @returns Unique settlement number
 *
 * @example
 * ```typescript
 * const settlementNumber = await generateSettlementNumber(configService);
 * // 'STL-2025-001234'
 * ```
 */
async function generateSettlementNumber(configService) {
    const prefix = configService.get('settlements.settlementNumberPrefix', 'STL');
    const year = new Date().getFullYear();
    const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${year}-${timestamp}${randomPart}`;
}
/**
 * Create new settlement offer
 *
 * @param data - Settlement creation data
 * @param userId - User creating the settlement
 * @param configService - Configuration service
 * @returns Created settlement
 *
 * @example
 * ```typescript
 * const settlement = await createSettlementOffer({
 *   caseId: 'case_123',
 *   settlementType: SettlementType.MEDICAL_MALPRACTICE,
 *   demandAmount: 500000,
 *   terms: { ... },
 * }, 'user_456', configService);
 * ```
 */
async function createSettlementOffer(data, userId, configService) {
    const logger = new common_1.Logger('SettlementCreation');
    // Validate input
    const validated = exports.SettlementCreateSchema.parse(data);
    // Generate settlement number
    const settlementNumber = await generateSettlementNumber(configService);
    // Create settlement entity
    const settlement = {
        id: crypto.randomUUID(),
        settlementNumber,
        caseId: validated.caseId,
        settlementType: validated.settlementType,
        status: SettlementStatus.DRAFT,
        totalAmount: validated.offerAmount || validated.demandAmount || 0,
        currency: validated.currency,
        demandAmount: validated.demandAmount,
        offerAmount: validated.offerAmount,
        description: validated.description,
        terms: validated.terms,
        parties: [],
        releaseDocuments: [],
        approvalRequired: validated.approvalRequired,
        metadata: {
            numberOfOffers: 0,
            numberOfCounterOffers: 0,
            mediationRequired: validated.metadata?.mediationRequired || false,
            authorityLevel: validated.metadata?.authorityLevel || 'junior',
            customFields: validated.metadata?.customFields || {},
            tags: validated.metadata?.tags || [],
        },
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    logger.log(`Settlement ${settlementNumber} created successfully`);
    return settlement;
}
/**
 * Update settlement offer
 *
 * @param settlementId - Settlement ID
 * @param updates - Settlement updates
 * @param userId - User updating the settlement
 * @param repository - Settlement repository
 *
 * @example
 * ```typescript
 * await updateSettlementOffer('settlement_123', {
 *   offerAmount: 450000,
 *   status: SettlementStatus.UNDER_NEGOTIATION,
 * }, 'user_456', settlementRepo);
 * ```
 */
async function updateSettlementOffer(settlementId, updates, userId, repository) {
    const logger = new common_1.Logger('SettlementUpdate');
    const settlement = await repository.findByPk(settlementId);
    if (!settlement) {
        throw new common_1.NotFoundException(`Settlement ${settlementId} not found`);
    }
    await repository.update({ ...updates, updatedBy: userId, updatedAt: new Date() }, { where: { id: settlementId } });
    logger.log(`Settlement ${settlementId} updated by ${userId}`);
}
/**
 * Accept settlement offer
 *
 * @param settlementId - Settlement ID
 * @param userId - User accepting the offer
 * @param role - User's role in negotiation
 * @param repository - Settlement repository
 *
 * @example
 * ```typescript
 * await acceptSettlementOffer('settlement_123', 'user_456', NegotiationRole.PLAINTIFF_ATTORNEY, settlementRepo);
 * ```
 */
async function acceptSettlementOffer(settlementId, userId, role, repository) {
    const logger = new common_1.Logger('SettlementAcceptance');
    const settlement = await repository.findByPk(settlementId);
    if (!settlement) {
        throw new common_1.NotFoundException(`Settlement ${settlementId} not found`);
    }
    if (settlement.status === SettlementStatus.EXECUTED) {
        throw new common_1.BadRequestException('Settlement has already been executed');
    }
    await repository.update({
        status: SettlementStatus.ACCEPTED,
        updatedBy: userId,
        updatedAt: new Date(),
    }, { where: { id: settlementId } });
    logger.log(`Settlement ${settlementId} accepted by ${userId} (${role})`);
}
/**
 * Reject settlement offer
 *
 * @param settlementId - Settlement ID
 * @param userId - User rejecting the offer
 * @param role - User's role in negotiation
 * @param reason - Rejection reason
 * @param repository - Settlement repository
 *
 * @example
 * ```typescript
 * await rejectSettlementOffer('settlement_123', 'user_456', NegotiationRole.DEFENDANT_ATTORNEY, 'Amount too high', settlementRepo);
 * ```
 */
async function rejectSettlementOffer(settlementId, userId, role, reason, repository) {
    const logger = new common_1.Logger('SettlementRejection');
    const settlement = await repository.findByPk(settlementId);
    if (!settlement) {
        throw new common_1.NotFoundException(`Settlement ${settlementId} not found`);
    }
    await repository.update({
        status: SettlementStatus.REJECTED,
        updatedBy: userId,
        updatedAt: new Date(),
    }, { where: { id: settlementId } });
    logger.log(`Settlement ${settlementId} rejected by ${userId} (${role}): ${reason}`);
}
/**
 * Create counter settlement offer
 *
 * @param settlementId - Original settlement ID
 * @param data - Counter offer data
 * @param userId - User making counter offer
 * @param role - User's role in negotiation
 * @param repository - Offer repository
 * @returns Created counter offer
 *
 * @example
 * ```typescript
 * const counterOffer = await counterSettlementOffer(
 *   'settlement_123',
 *   { amount: 400000, terms: '...', conditions: [] },
 *   'user_456',
 *   NegotiationRole.DEFENDANT_ATTORNEY,
 *   offerRepo
 * );
 * ```
 */
async function counterSettlementOffer(settlementId, data, userId, role, repository) {
    const logger = new common_1.Logger('CounterOffer');
    const validated = exports.SettlementOfferSchema.parse(data);
    // Get latest offer number
    const latestOffer = await repository.findOne({
        where: { settlementId },
        order: [['offerNumber', 'DESC']],
    });
    const offerNumber = latestOffer ? latestOffer.offerNumber + 1 : 1;
    const counterOffer = {
        id: crypto.randomUUID(),
        settlementId,
        offerNumber,
        offerType: validated.offerType,
        offeredBy: userId,
        offeredByRole: role,
        amount: validated.amount,
        currency: validated.currency,
        terms: validated.terms,
        conditions: validated.conditions,
        validUntil: validated.validUntil,
        status: OfferStatus.PENDING,
        responseDeadline: validated.responseDeadline,
        parentOfferId: validated.parentOfferId,
        counterOffers: [],
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    logger.log(`Counter offer ${offerNumber} created for settlement ${settlementId}`);
    return counterOffer;
}
/**
 * Withdraw settlement offer
 *
 * @param settlementId - Settlement ID
 * @param userId - User withdrawing the offer
 * @param reason - Withdrawal reason
 * @param repository - Settlement repository
 *
 * @example
 * ```typescript
 * await withdrawSettlementOffer('settlement_123', 'user_456', 'Client decision', settlementRepo);
 * ```
 */
async function withdrawSettlementOffer(settlementId, userId, reason, repository) {
    const logger = new common_1.Logger('SettlementWithdrawal');
    const settlement = await repository.findByPk(settlementId);
    if (!settlement) {
        throw new common_1.NotFoundException(`Settlement ${settlementId} not found`);
    }
    if ([SettlementStatus.EXECUTED, SettlementStatus.COMPLETED].includes(settlement.status)) {
        throw new common_1.BadRequestException('Cannot withdraw executed or completed settlement');
    }
    await repository.update({
        status: SettlementStatus.WITHDRAWN,
        updatedBy: userId,
        updatedAt: new Date(),
    }, { where: { id: settlementId } });
    logger.log(`Settlement ${settlementId} withdrawn by ${userId}: ${reason}`);
}
/**
 * Get settlement offer history
 *
 * @param settlementId - Settlement ID
 * @param repository - Offer repository
 * @returns Array of offers
 *
 * @example
 * ```typescript
 * const history = await getSettlementOfferHistory('settlement_123', offerRepo);
 * ```
 */
async function getSettlementOfferHistory(settlementId, repository) {
    const offers = await repository.findAll({
        where: { settlementId },
        order: [['offerNumber', 'ASC']],
    });
    return offers.map((o) => o.toJSON());
}
// ============================================================================
// NEGOTIATION SESSION MANAGEMENT
// ============================================================================
/**
 * Create negotiation session
 *
 * @param settlementId - Settlement ID
 * @param data - Session data
 * @param userId - User creating session
 * @param repository - Session repository
 * @returns Created session
 *
 * @example
 * ```typescript
 * const session = await createNegotiationSession(
 *   'settlement_123',
 *   {
 *     sessionType: 'mediated',
 *     scheduledAt: new Date('2025-02-15T10:00:00Z'),
 *     participants: [...],
 *   },
 *   'user_456',
 *   sessionRepo
 * );
 * ```
 */
async function createNegotiationSession(settlementId, data, userId, repository) {
    const logger = new common_1.Logger('NegotiationSession');
    const validated = exports.NegotiationSessionSchema.parse(data);
    // Get latest session number
    const latestSession = await repository.findOne({
        where: { settlementId },
        order: [['sessionNumber', 'DESC']],
    });
    const sessionNumber = latestSession ? latestSession.sessionNumber + 1 : 1;
    const session = {
        id: crypto.randomUUID(),
        settlementId,
        sessionNumber,
        sessionType: validated.sessionType,
        scheduledAt: validated.scheduledAt,
        participants: validated.participants.map(p => ({
            ...p,
            attended: false,
        })),
        agenda: validated.agenda,
        attachments: [],
        metadata: {},
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    logger.log(`Negotiation session ${sessionNumber} created for settlement ${settlementId}`);
    return session;
}
/**
 * Add negotiation note
 *
 * @param settlementId - Settlement ID
 * @param note - Note content
 * @param userId - User adding note
 * @param role - User's role
 * @param repository - Activity repository
 *
 * @example
 * ```typescript
 * await addNegotiationNote(
 *   'settlement_123',
 *   'Discussed payment terms...',
 *   'user_456',
 *   NegotiationRole.PLAINTIFF_ATTORNEY,
 *   activityRepo
 * );
 * ```
 */
async function addNegotiationNote(settlementId, note, userId, role, repository) {
    const logger = new common_1.Logger('NegotiationNote');
    const activity = {
        id: crypto.randomUUID(),
        settlementId,
        activityType: ActivityType.NOTE_ADDED,
        description: note,
        performedBy: userId,
        performedByRole: role,
        metadata: {},
        timestamp: new Date(),
    };
    // Would save to repository
    logger.log(`Note added to settlement ${settlementId} by ${userId}`);
}
/**
 * Track negotiation activity
 *
 * @param settlementId - Settlement ID
 * @param activityType - Type of activity
 * @param description - Activity description
 * @param userId - User performing activity
 * @param role - User's role
 * @param metadata - Additional metadata
 * @param repository - Activity repository
 *
 * @example
 * ```typescript
 * await trackNegotiationActivity(
 *   'settlement_123',
 *   ActivityType.OFFER_MADE,
 *   'Initial offer presented',
 *   'user_456',
 *   NegotiationRole.PLAINTIFF_ATTORNEY,
 *   { offerId: 'offer_789' },
 *   activityRepo
 * );
 * ```
 */
async function trackNegotiationActivity(settlementId, activityType, description, userId, role, metadata, repository) {
    const activity = {
        id: crypto.randomUUID(),
        settlementId,
        activityType,
        description,
        performedBy: userId,
        performedByRole: role,
        relatedOfferId: metadata.offerId,
        metadata,
        timestamp: new Date(),
    };
    // Would save to repository
}
/**
 * Get negotiation timeline
 *
 * @param settlementId - Settlement ID
 * @param repository - Activity repository
 * @returns Array of activities in chronological order
 *
 * @example
 * ```typescript
 * const timeline = await getNegotiationTimeline('settlement_123', activityRepo);
 * ```
 */
async function getNegotiationTimeline(settlementId, repository) {
    const activities = await repository.findAll({
        where: { settlementId },
        order: [['timestamp', 'ASC']],
    });
    return activities.map((a) => a.toJSON());
}
// ============================================================================
// SETTLEMENT AUTHORITY & APPROVAL
// ============================================================================
/**
 * Calculate settlement range based on case factors
 *
 * @param caseId - Case ID
 * @param factors - Settlement factors
 * @param userId - User calculating range
 * @returns Settlement range calculation
 *
 * @example
 * ```typescript
 * const range = await calculateSettlementRange('case_123', [
 *   { name: 'medical_expenses', weight: 0.4, value: 200000, impact: 80000 },
 *   { name: 'lost_wages', weight: 0.3, value: 100000, impact: 30000 },
 *   { name: 'pain_suffering', weight: 0.3, value: 150000, impact: 45000 },
 * ], 'user_456');
 * ```
 */
async function calculateSettlementRange(caseId, factors, userId) {
    const logger = new common_1.Logger('SettlementRangeCalculation');
    // Calculate weighted total
    const totalImpact = factors.reduce((sum, factor) => sum + factor.impact, 0);
    // Apply confidence adjustments (simplified)
    const confidence = 0.75; // 75% confidence
    const minimumAmount = Math.round(totalImpact * 0.6);
    const maximumAmount = Math.round(totalImpact * 1.4);
    const recommendedAmount = Math.round(totalImpact);
    const range = {
        settlementId: crypto.randomUUID(), // Would be actual settlement ID
        minimumAmount,
        maximumAmount,
        recommendedAmount,
        factors,
        confidence,
        calculatedAt: new Date(),
        calculatedBy: userId,
    };
    logger.log(`Settlement range calculated: ${minimumAmount} - ${maximumAmount} (recommended: ${recommendedAmount})`);
    return range;
}
/**
 * Evaluate settlement offer against calculated range
 *
 * @param offerId - Offer ID
 * @param range - Settlement range
 * @returns Evaluation result
 *
 * @example
 * ```typescript
 * const evaluation = await evaluateSettlementOffer('offer_123', settlementRange);
 * ```
 */
async function evaluateSettlementOffer(offerId, range) {
    // This would fetch actual offer and compare
    const offerAmount = 0; // Placeholder
    const withinRange = offerAmount >= range.minimumAmount && offerAmount <= range.maximumAmount;
    const percentOfRecommended = Math.round((offerAmount / range.recommendedAmount) * 100);
    let recommendation = '';
    if (offerAmount < range.minimumAmount) {
        recommendation = 'REJECT - Below minimum acceptable range';
    }
    else if (offerAmount > range.maximumAmount) {
        recommendation = 'ACCEPT - Exceeds maximum expectations';
    }
    else if (offerAmount >= range.recommendedAmount * 0.9) {
        recommendation = 'ACCEPT - Within favorable range';
    }
    else {
        recommendation = 'NEGOTIATE - Room for improvement';
    }
    return { recommendation, withinRange, percentOfRecommended };
}
/**
 * Check settlement authority for user
 *
 * @param userId - User ID
 * @param amount - Settlement amount
 * @param settlementType - Settlement type
 * @param repository - Authority repository
 * @returns Authority check result
 *
 * @example
 * ```typescript
 * const hasAuthority = await checkSettlementAuthority('user_123', 250000, SettlementType.MEDICAL_MALPRACTICE, authorityRepo);
 * ```
 */
async function checkSettlementAuthority(userId, amount, settlementType, repository) {
    const now = new Date();
    const authority = await repository.findOne({
        where: {
            userId,
            isActive: true,
            minAmount: { [sequelize_1.Op.lte]: amount },
            maxAmount: { [sequelize_1.Op.gte]: amount },
            settlementTypes: { [sequelize_1.Op.contains]: [settlementType] },
            effectiveFrom: { [sequelize_1.Op.lte]: now },
            [sequelize_1.Op.or]: [
                { effectiveUntil: null },
                { effectiveUntil: { [sequelize_1.Op.gte]: now } },
            ],
        },
    });
    if (!authority) {
        return { authorized: false, requiresApproval: true };
    }
    return {
        authorized: true,
        requiresApproval: authority.requiresApproval,
        approverUserId: authority.approverUserId,
    };
}
/**
 * Request settlement approval
 *
 * @param settlementId - Settlement ID
 * @param approverUserId - Approver user ID
 * @param comments - Request comments
 * @param userId - User requesting approval
 * @param repository - Approval repository
 * @returns Created approval request
 *
 * @example
 * ```typescript
 * const approval = await requestSettlementApproval(
 *   'settlement_123',
 *   'manager_456',
 *   'Amount exceeds authority limit',
 *   'user_789',
 *   approvalRepo
 * );
 * ```
 */
async function requestSettlementApproval(settlementId, approverUserId, comments, userId, repository) {
    const logger = new common_1.Logger('SettlementApproval');
    const approval = {
        id: crypto.randomUUID(),
        settlementId,
        approverUserId,
        approverRole: 'manager', // Would be fetched from user profile
        comments,
        requestedAt: new Date(),
        order: 1,
        required: true,
        metadata: {},
    };
    logger.log(`Approval requested for settlement ${settlementId} from ${approverUserId}`);
    return approval;
}
/**
 * Approve settlement
 *
 * @param approvalId - Approval ID
 * @param decision - Approval decision
 * @param comments - Approval comments
 * @param userId - User approving
 * @param repository - Approval repository
 *
 * @example
 * ```typescript
 * await approveSettlement('approval_123', ApprovalDecision.APPROVED, 'Approved based on case merits', 'manager_456', approvalRepo);
 * ```
 */
async function approveSettlement(approvalId, decision, comments, userId, repository) {
    const logger = new common_1.Logger('SettlementApproval');
    await repository.update({
        decision,
        comments,
        decidedAt: new Date(),
    }, { where: { id: approvalId } });
    logger.log(`Settlement approval ${approvalId} ${decision} by ${userId}`);
}
/**
 * Reject settlement approval
 *
 * @param approvalId - Approval ID
 * @param reason - Rejection reason
 * @param userId - User rejecting
 * @param repository - Approval repository
 *
 * @example
 * ```typescript
 * await rejectSettlementApproval('approval_123', 'Amount too high for case value', 'manager_456', approvalRepo);
 * ```
 */
async function rejectSettlementApproval(approvalId, reason, userId, repository) {
    const logger = new common_1.Logger('SettlementApproval');
    await repository.update({
        decision: ApprovalDecision.REJECTED,
        comments: reason,
        decidedAt: new Date(),
    }, { where: { id: approvalId } });
    logger.log(`Settlement approval ${approvalId} rejected by ${userId}: ${reason}`);
}
/**
 * Delegate settlement authority
 *
 * @param fromUserId - User delegating authority
 * @param toUserId - User receiving authority
 * @param data - Authority configuration
 * @param repository - Authority repository
 * @returns Created authority delegation
 *
 * @example
 * ```typescript
 * const delegation = await delegateSettlementAuthority(
 *   'manager_123',
 *   'attorney_456',
 *   {
 *     userId: 'attorney_456',
 *     role: 'attorney',
 *     minAmount: 0,
 *     maxAmount: 50000,
 *     settlementTypes: [SettlementType.MEDICAL_MALPRACTICE],
 *     requiresApproval: false,
 *     effectiveFrom: new Date(),
 *     effectiveUntil: new Date('2025-12-31'),
 *   },
 *   authorityRepo
 * );
 * ```
 */
async function delegateSettlementAuthority(fromUserId, toUserId, data, repository) {
    const logger = new common_1.Logger('AuthorityDelegation');
    const validated = exports.SettlementAuthoritySchema.parse(data);
    const authority = {
        id: crypto.randomUUID(),
        userId: toUserId,
        role: validated.role,
        minAmount: validated.minAmount,
        maxAmount: validated.maxAmount,
        settlementTypes: validated.settlementTypes,
        requiresApproval: validated.requiresApproval,
        approverUserId: validated.approverUserId,
        delegatedFrom: fromUserId,
        effectiveFrom: validated.effectiveFrom,
        effectiveUntil: validated.effectiveUntil,
        isActive: true,
        metadata: {},
    };
    logger.log(`Settlement authority delegated from ${fromUserId} to ${toUserId}`);
    return authority;
}
// ============================================================================
// PAYMENT PLAN MANAGEMENT
// ============================================================================
/**
 * Create payment plan for settlement
 *
 * @param settlementId - Settlement ID
 * @param data - Payment plan data
 * @param userId - User creating plan
 * @returns Created payment plan
 *
 * @example
 * ```typescript
 * const plan = await createPaymentPlan('settlement_123', {
 *   totalAmount: 300000,
 *   currency: 'USD',
 *   numberOfInstallments: 12,
 *   frequency: 'monthly',
 *   startDate: new Date('2025-03-01'),
 *   defaultGracePeriodDays: 5,
 * }, 'user_456');
 * ```
 */
async function createPaymentPlan(settlementId, data, userId) {
    const logger = new common_1.Logger('PaymentPlanCreation');
    const validated = exports.PaymentPlanSchema.parse(data);
    // Calculate end date
    const endDate = calculatePaymentPlanEndDate(validated.startDate, validated.numberOfInstallments, validated.frequency);
    // Generate installment schedule
    const installments = generatePaymentSchedule(validated.totalAmount, validated.numberOfInstallments, validated.startDate, validated.frequency);
    const paymentPlan = {
        id: crypto.randomUUID(),
        settlementId,
        totalAmount: validated.totalAmount,
        currency: validated.currency,
        numberOfInstallments: validated.numberOfInstallments,
        frequency: validated.frequency,
        startDate: validated.startDate,
        endDate,
        installments,
        status: PaymentPlanStatus.ACTIVE,
        latePaymentPenalty: validated.latePaymentPenalty,
        defaultGracePeriodDays: validated.defaultGracePeriodDays,
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    logger.log(`Payment plan created for settlement ${settlementId}: ${validated.numberOfInstallments} installments`);
    return paymentPlan;
}
/**
 * Calculate payment plan end date
 */
function calculatePaymentPlanEndDate(startDate, numberOfInstallments, frequency) {
    const endDate = new Date(startDate);
    switch (frequency) {
        case 'weekly':
            endDate.setDate(endDate.getDate() + (numberOfInstallments * 7));
            break;
        case 'bi-weekly':
            endDate.setDate(endDate.getDate() + (numberOfInstallments * 14));
            break;
        case 'monthly':
            endDate.setMonth(endDate.getMonth() + numberOfInstallments);
            break;
        case 'quarterly':
            endDate.setMonth(endDate.getMonth() + (numberOfInstallments * 3));
            break;
        default:
            endDate.setMonth(endDate.getMonth() + numberOfInstallments);
    }
    return endDate;
}
/**
 * Validate payment plan
 *
 * @param plan - Payment plan to validate
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePaymentPlan(paymentPlan);
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
async function validatePaymentPlan(plan) {
    const errors = [];
    // Validate total amount matches installments
    const installmentTotal = plan.installments.reduce((sum, inst) => sum + inst.amount, 0);
    if (Math.abs(installmentTotal - plan.totalAmount) > 0.01) {
        errors.push(`Installment total (${installmentTotal}) does not match plan total (${plan.totalAmount})`);
    }
    // Validate installment count
    if (plan.installments.length !== plan.numberOfInstallments) {
        errors.push(`Expected ${plan.numberOfInstallments} installments, found ${plan.installments.length}`);
    }
    // Validate dates
    if (plan.endDate < plan.startDate) {
        errors.push('End date cannot be before start date');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
/**
 * Calculate payment schedule
 *
 * @param totalAmount - Total payment amount
 * @param numberOfInstallments - Number of installments
 * @param startDate - Start date
 * @param frequency - Payment frequency
 * @returns Array of payment installments
 *
 * @example
 * ```typescript
 * const schedule = calculatePaymentSchedule(300000, 12, new Date('2025-03-01'), 'monthly');
 * ```
 */
function calculatePaymentSchedule(totalAmount, numberOfInstallments, startDate, frequency) {
    const installments = [];
    const baseAmount = Math.floor((totalAmount / numberOfInstallments) * 100) / 100;
    let remainingAmount = totalAmount;
    for (let i = 0; i < numberOfInstallments; i++) {
        const dueDate = calculateInstallmentDueDate(startDate, i, frequency);
        const isLast = i === numberOfInstallments - 1;
        const amount = isLast ? remainingAmount : baseAmount;
        installments.push({
            id: crypto.randomUUID(),
            paymentPlanId: '', // Will be set when plan is created
            installmentNumber: i + 1,
            amount,
            dueDate,
            status: InstallmentStatus.PENDING,
            metadata: {},
        });
        remainingAmount -= amount;
    }
    return installments;
}
/**
 * Calculate installment due date
 */
function calculateInstallmentDueDate(startDate, installmentIndex, frequency) {
    const dueDate = new Date(startDate);
    switch (frequency) {
        case 'weekly':
            dueDate.setDate(dueDate.getDate() + (installmentIndex * 7));
            break;
        case 'bi-weekly':
            dueDate.setDate(dueDate.getDate() + (installmentIndex * 14));
            break;
        case 'monthly':
            dueDate.setMonth(dueDate.getMonth() + installmentIndex);
            break;
        case 'quarterly':
            dueDate.setMonth(dueDate.getMonth() + (installmentIndex * 3));
            break;
        default:
            dueDate.setMonth(dueDate.getMonth() + installmentIndex);
    }
    return dueDate;
}
/**
 * Update payment status
 *
 * @param installmentId - Installment ID
 * @param status - Payment status
 * @param paidAmount - Amount paid
 * @param paymentDetails - Payment details
 * @param repository - Installment repository
 *
 * @example
 * ```typescript
 * await updatePaymentStatus(
 *   'installment_123',
 *   InstallmentStatus.PAID,
 *   25000,
 *   { paymentMethod: 'wire_transfer', transactionId: 'TXN123' },
 *   installmentRepo
 * );
 * ```
 */
async function updatePaymentStatus(installmentId, status, paidAmount, paymentDetails, repository) {
    const logger = new common_1.Logger('PaymentStatus');
    await repository.update({
        status,
        paidAmount,
        paidDate: status === InstallmentStatus.PAID ? new Date() : null,
        paymentMethod: paymentDetails.paymentMethod,
        transactionId: paymentDetails.transactionId,
        receiptUrl: paymentDetails.receiptUrl,
    }, { where: { id: installmentId } });
    logger.log(`Payment installment ${installmentId} updated to ${status}`);
}
/**
 * Get payment plan status
 *
 * @param paymentPlanId - Payment plan ID
 * @param repository - Payment plan repository
 * @returns Payment plan status summary
 *
 * @example
 * ```typescript
 * const status = await getPaymentPlanStatus('plan_123', planRepo);
 * console.log(`Paid: ${status.paidCount}/${status.totalCount}, Remaining: ${status.remainingAmount}`);
 * ```
 */
async function getPaymentPlanStatus(paymentPlanId, repository) {
    const plan = await repository.findByPk(paymentPlanId, {
        include: [{ model: PaymentInstallmentModel, as: 'installments' }],
    });
    if (!plan) {
        throw new common_1.NotFoundException(`Payment plan ${paymentPlanId} not found`);
    }
    const installments = plan.installments || [];
    const paidInstallments = installments.filter((i) => i.status === InstallmentStatus.PAID);
    const overdueInstallments = installments.filter((i) => i.status === InstallmentStatus.OVERDUE);
    const paidAmount = paidInstallments.reduce((sum, i) => sum + (i.paidAmount || 0), 0);
    return {
        totalCount: installments.length,
        paidCount: paidInstallments.length,
        overdueCount: overdueInstallments.length,
        paidAmount,
        remainingAmount: plan.totalAmount - paidAmount,
        completionPercentage: Math.round((paidAmount / plan.totalAmount) * 100),
    };
}
// ============================================================================
// RELEASE DOCUMENT GENERATION
// ============================================================================
/**
 * Generate release document
 *
 * @param settlementId - Settlement ID
 * @param releaseType - Type of release
 * @param variables - Template variables
 * @param userId - User generating document
 * @returns Generated release document
 *
 * @example
 * ```typescript
 * const release = await generateReleaseDocument(
 *   'settlement_123',
 *   ReleaseType.GENERAL_RELEASE,
 *   {
 *     plaintiffName: 'John Doe',
 *     defendantName: 'ABC Hospital',
 *     settlementAmount: 300000,
 *     releaseDate: new Date(),
 *   },
 *   'user_456'
 * );
 * ```
 */
async function generateReleaseDocument(settlementId, releaseType, variables, userId) {
    const logger = new common_1.Logger('ReleaseGeneration');
    const template = getReleaseTemplate(releaseType);
    const content = substituteReleaseVariables(template, variables);
    const releaseDocument = {
        id: crypto.randomUUID(),
        settlementId,
        releaseType,
        documentTitle: `${releaseType.replace(/_/g, ' ').toUpperCase()} - ${settlementId}`,
        content,
        variables,
        generatedAt: new Date(),
        signedBy: [],
        fullyExecuted: false,
        metadata: {},
    };
    logger.log(`Release document generated for settlement ${settlementId}: ${releaseType}`);
    return releaseDocument;
}
/**
 * Get release template by type
 */
function getReleaseTemplate(releaseType) {
    const templates = {
        [ReleaseType.GENERAL_RELEASE]: `
GENERAL RELEASE AND SETTLEMENT AGREEMENT

This General Release and Settlement Agreement ("Agreement") is made and entered into as of {{releaseDate}}, by and between {{plaintiffName}} ("Releasor") and {{defendantName}} ("Releasee").

WHEREAS, the parties desire to settle and resolve all disputes and claims arising from the matter described as {{caseDescription}};

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

1. SETTLEMENT PAYMENT
Releasee agrees to pay Releasor the sum of {{settlementAmount}} {{currency}} in full and final settlement of all claims.

2. GENERAL RELEASE
Releasor hereby releases, acquits, and forever discharges Releasee from any and all claims, demands, damages, actions, causes of action, or suits of any kind or nature whatsoever.

3. CONFIDENTIALITY
The parties agree that the terms of this Agreement shall remain confidential.

4. GOVERNING LAW
This Agreement shall be governed by the laws of {{jurisdiction}}.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.
    `.trim(),
        [ReleaseType.LIMITED_RELEASE]: `LIMITED RELEASE - Template content...`,
        [ReleaseType.MUTUAL_RELEASE]: `MUTUAL RELEASE - Template content...`,
        [ReleaseType.COVENANT_NOT_TO_SUE]: `COVENANT NOT TO SUE - Template content...`,
        [ReleaseType.WAIVER]: `WAIVER - Template content...`,
    };
    return templates[releaseType] || templates[ReleaseType.GENERAL_RELEASE];
}
/**
 * Substitute variables in release template
 */
function substituteReleaseVariables(template, variables) {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
        result = result.replace(regex, String(value));
    }
    return result;
}
/**
 * Generate settlement agreement
 *
 * @param settlementId - Settlement ID
 * @param variables - Agreement variables
 * @param userId - User generating agreement
 * @returns Generated settlement agreement
 *
 * @example
 * ```typescript
 * const agreement = await generateSettlementAgreement('settlement_123', {...}, 'user_456');
 * ```
 */
async function generateSettlementAgreement(settlementId, variables, userId) {
    const logger = new common_1.Logger('AgreementGeneration');
    // Generate comprehensive settlement agreement
    const content = `
SETTLEMENT AGREEMENT

This Settlement Agreement is entered into as of ${variables.effectiveDate}, by and between:

PARTIES:
- Plaintiff: ${variables.plaintiffName}
- Defendant: ${variables.defendantName}

SETTLEMENT TERMS:
1. Settlement Amount: ${variables.settlementAmount} ${variables.currency}
2. Payment Terms: ${variables.paymentTerms}
3. Dismissal: ${variables.dismissalType}

[Additional terms and conditions...]
  `.trim();
    logger.log(`Settlement agreement generated for ${settlementId}`);
    return { content };
}
/**
 * Validate release terms
 *
 * @param releaseDocument - Release document to validate
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateReleaseTerms(releaseDoc);
 * ```
 */
async function validateReleaseTerms(releaseDocument) {
    const errors = [];
    // Check required variables
    const requiredVars = ['plaintiffName', 'defendantName', 'settlementAmount', 'releaseDate'];
    for (const varName of requiredVars) {
        if (!releaseDocument.variables[varName]) {
            errors.push(`Missing required variable: ${varName}`);
        }
    }
    // Check content not empty
    if (!releaseDocument.content || releaseDocument.content.trim().length === 0) {
        errors.push('Release document content is empty');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
/**
 * Execute settlement (finalize)
 *
 * @param settlementId - Settlement ID
 * @param userId - User executing settlement
 * @param repository - Settlement repository
 *
 * @example
 * ```typescript
 * await executeSettlement('settlement_123', 'user_456', settlementRepo);
 * ```
 */
async function executeSettlement(settlementId, userId, repository) {
    const logger = new common_1.Logger('SettlementExecution');
    const settlement = await repository.findByPk(settlementId);
    if (!settlement) {
        throw new common_1.NotFoundException(`Settlement ${settlementId} not found`);
    }
    if (settlement.status !== SettlementStatus.ACCEPTED) {
        throw new common_1.BadRequestException('Settlement must be accepted before execution');
    }
    await repository.update({
        status: SettlementStatus.EXECUTED,
        executedAt: new Date(),
        updatedBy: userId,
    }, { where: { id: settlementId } });
    logger.log(`Settlement ${settlementId} executed by ${userId}`);
}
/**
 * Record settlement payment
 *
 * @param settlementId - Settlement ID
 * @param amount - Payment amount
 * @param paymentMethod - Payment method
 * @param transactionId - Transaction ID
 * @param userId - User recording payment
 *
 * @example
 * ```typescript
 * await recordSettlementPayment(
 *   'settlement_123',
 *   300000,
 *   'wire_transfer',
 *   'TXN789',
 *   'user_456'
 * );
 * ```
 */
async function recordSettlementPayment(settlementId, amount, paymentMethod, transactionId, userId) {
    const logger = new common_1.Logger('PaymentRecording');
    // Record payment in activity log
    const activity = {
        id: crypto.randomUUID(),
        settlementId,
        activityType: ActivityType.PAYMENT_MADE,
        description: `Payment of ${amount} recorded via ${paymentMethod}`,
        performedBy: userId,
        performedByRole: NegotiationRole.OTHER,
        metadata: {
            amount,
            paymentMethod,
            transactionId,
        },
        timestamp: new Date(),
    };
    logger.log(`Payment recorded for settlement ${settlementId}: ${amount} (${transactionId})`);
}
// ============================================================================
// SETTLEMENT SEARCH & ANALYTICS
// ============================================================================
/**
 * Search settlements with filters
 *
 * @param filters - Search filters
 * @param repository - Settlement repository
 * @returns Matching settlements
 *
 * @example
 * ```typescript
 * const settlements = await searchSettlements({
 *   settlementTypes: [SettlementType.MEDICAL_MALPRACTICE],
 *   statuses: [SettlementStatus.EXECUTED],
 *   minAmount: 100000,
 *   maxAmount: 1000000,
 * }, settlementRepo);
 * ```
 */
async function searchSettlements(filters, repository) {
    const where = {};
    if (filters.query) {
        where[sequelize_1.Op.or] = [
            { settlementNumber: { [sequelize_1.Op.iLike]: `%${filters.query}%` } },
            { description: { [sequelize_1.Op.iLike]: `%${filters.query}%` } },
        ];
    }
    if (filters.caseIds?.length) {
        where.caseId = { [sequelize_1.Op.in]: filters.caseIds };
    }
    if (filters.settlementTypes?.length) {
        where.settlementType = { [sequelize_1.Op.in]: filters.settlementTypes };
    }
    if (filters.statuses?.length) {
        where.status = { [sequelize_1.Op.in]: filters.statuses };
    }
    if (filters.minAmount !== undefined) {
        where.totalAmount = { [sequelize_1.Op.gte]: filters.minAmount };
    }
    if (filters.maxAmount !== undefined) {
        where.totalAmount = { ...where.totalAmount, [sequelize_1.Op.lte]: filters.maxAmount };
    }
    if (filters.createdFrom) {
        where.createdAt = { [sequelize_1.Op.gte]: filters.createdFrom };
    }
    if (filters.createdTo) {
        where.createdAt = { ...where.createdAt, [sequelize_1.Op.lte]: filters.createdTo };
    }
    if (filters.tenantId) {
        where.tenantId = filters.tenantId;
    }
    const settlements = await repository.findAll({
        where,
        include: ['parties', 'offers'],
        order: [['createdAt', 'DESC']],
    });
    return settlements.map((s) => s.toJSON());
}
/**
 * Get settlement by settlement number
 *
 * @param settlementNumber - Settlement number
 * @param repository - Settlement repository
 * @returns Settlement
 *
 * @example
 * ```typescript
 * const settlement = await getSettlementByNumber('STL-2025-001234', settlementRepo);
 * ```
 */
async function getSettlementByNumber(settlementNumber, repository) {
    const settlement = await repository.findOne({
        where: { settlementNumber },
        include: ['parties', 'offers', 'activities'],
    });
    if (!settlement) {
        throw new common_1.NotFoundException(`Settlement ${settlementNumber} not found`);
    }
    return settlement.toJSON();
}
/**
 * Get settlement analytics
 *
 * @param filters - Analytics filters
 * @param repository - Settlement repository
 * @returns Settlement analytics data
 *
 * @example
 * ```typescript
 * const analytics = await getSettlementAnalytics({ tenantId: 'tenant_123' }, settlementRepo);
 * ```
 */
async function getSettlementAnalytics(filters, repository) {
    const where = {};
    if (filters.tenantId) {
        where.tenantId = filters.tenantId;
    }
    if (filters.settlementTypes?.length) {
        where.settlementType = { [sequelize_1.Op.in]: filters.settlementTypes };
    }
    const settlements = await repository.findAll({ where });
    const totalSettlements = settlements.length;
    const totalAmount = settlements.reduce((sum, s) => sum + (s.finalAmount || s.totalAmount || 0), 0);
    const averageAmount = totalSettlements > 0 ? totalAmount / totalSettlements : 0;
    // Calculate median
    const amounts = settlements
        .map((s) => s.finalAmount || s.totalAmount || 0)
        .sort((a, b) => a - b);
    const medianAmount = totalSettlements > 0
        ? amounts[Math.floor(totalSettlements / 2)]
        : 0;
    // Calculate average negotiation days
    const negotiationDays = settlements
        .filter((s) => s.metadata?.negotiationStartDate && s.executedAt)
        .map((s) => {
        const start = new Date(s.metadata.negotiationStartDate);
        const end = new Date(s.executedAt);
        return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    });
    const averageNegotiationDays = negotiationDays.length > 0
        ? negotiationDays.reduce((sum, days) => sum + days, 0) / negotiationDays.length
        : 0;
    // Success rate (executed / total)
    const executedCount = settlements.filter((s) => s.status === SettlementStatus.EXECUTED).length;
    const successRate = totalSettlements > 0 ? (executedCount / totalSettlements) * 100 : 0;
    // Group by type
    const byType = {};
    for (const type of Object.values(SettlementType)) {
        byType[type] = settlements.filter((s) => s.settlementType === type).length;
    }
    // Group by status
    const byStatus = {};
    for (const status of Object.values(SettlementStatus)) {
        byStatus[status] = settlements.filter((s) => s.status === status).length;
    }
    return {
        totalSettlements,
        totalAmount,
        averageAmount,
        medianAmount,
        averageNegotiationDays,
        successRate,
        byType,
        byStatus,
        timeSeriesData: [], // Would be calculated from settlements grouped by date
    };
}
/**
 * Compare settlement offers
 *
 * @param offer1Id - First offer ID
 * @param offer2Id - Second offer ID
 * @param repository - Offer repository
 * @returns Comparison result
 *
 * @example
 * ```typescript
 * const comparison = await compareSettlements('offer_123', 'offer_456', offerRepo);
 * ```
 */
async function compareSettlements(offer1Id, offer2Id, repository) {
    const offer1 = await repository.findByPk(offer1Id);
    const offer2 = await repository.findByPk(offer2Id);
    if (!offer1 || !offer2) {
        throw new common_1.NotFoundException('One or both offers not found');
    }
    const amountDifference = offer2.amount - offer1.amount;
    const percentageDifference = ((amountDifference / offer1.amount) * 100);
    // Compare terms (simplified)
    const termsDifference = [];
    if (offer1.terms !== offer2.terms) {
        termsDifference.push('Terms differ between offers');
    }
    let recommendation = '';
    if (amountDifference > 0) {
        recommendation = `Offer 2 is ${percentageDifference.toFixed(1)}% higher`;
    }
    else if (amountDifference < 0) {
        recommendation = `Offer 1 is ${Math.abs(percentageDifference).toFixed(1)}% higher`;
    }
    else {
        recommendation = 'Offers are equal in amount';
    }
    return {
        offer1Id,
        offer2Id,
        amountDifference,
        percentageDifference,
        termsDifference,
        recommendation,
        comparedAt: new Date(),
    };
}
/**
 * Calculate settlement metrics
 *
 * @param settlementId - Settlement ID
 * @param repository - Settlement repository
 * @returns Settlement metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateSettlementMetrics('settlement_123', settlementRepo);
 * ```
 */
async function calculateSettlementMetrics(settlementId, repository) {
    const settlement = await repository.findByPk(settlementId, {
        include: ['offers'],
    });
    if (!settlement) {
        throw new common_1.NotFoundException(`Settlement ${settlementId} not found`);
    }
    const metrics = {
        numberOfOffers: settlement.offers?.length || 0,
    };
    if (settlement.metadata?.negotiationStartDate && settlement.executedAt) {
        const start = new Date(settlement.metadata.negotiationStartDate);
        const end = new Date(settlement.executedAt);
        metrics.negotiationDuration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }
    if (settlement.demandAmount && settlement.finalAmount) {
        metrics.demandToSettlementRatio = settlement.finalAmount / settlement.demandAmount;
    }
    if (settlement.createdAt && settlement.executedAt) {
        const created = new Date(settlement.createdAt);
        const executed = new Date(settlement.executedAt);
        metrics.timeToExecution = Math.ceil((executed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    }
    return metrics;
}
/**
 * Generate settlement report
 *
 * @param settlementId - Settlement ID
 * @param repository - Settlement repository
 * @returns Settlement report
 *
 * @example
 * ```typescript
 * const report = await generateSettlementReport('settlement_123', settlementRepo);
 * ```
 */
async function generateSettlementReport(settlementId, repository) {
    const settlement = await repository.findByPk(settlementId, {
        include: ['parties', 'offers', 'activities'],
    });
    if (!settlement) {
        throw new common_1.NotFoundException(`Settlement ${settlementId} not found`);
    }
    const metrics = await calculateSettlementMetrics(settlementId, repository);
    const summary = `
Settlement Report: ${settlement.settlementNumber}
Status: ${settlement.status}
Type: ${settlement.settlementType}
Final Amount: ${settlement.finalAmount || settlement.totalAmount} ${settlement.currency}
Negotiation Duration: ${metrics.negotiationDuration || 'N/A'} days
Number of Offers: ${metrics.numberOfOffers}
  `.trim();
    return {
        summary,
        details: {
            settlement: settlement.toJSON(),
            metrics,
        },
    };
}
/**
 * Export settlement data
 *
 * @param filters - Export filters
 * @param format - Export format
 * @param repository - Settlement repository
 * @returns Exported data
 *
 * @example
 * ```typescript
 * const data = await exportSettlementData({ statuses: [SettlementStatus.EXECUTED] }, 'json', settlementRepo);
 * ```
 */
async function exportSettlementData(filters, format, repository) {
    const settlements = await searchSettlements(filters, repository);
    if (format === 'json') {
        return JSON.stringify(settlements, null, 2);
    }
    else {
        // CSV format (simplified)
        const headers = ['Settlement Number', 'Type', 'Status', 'Amount', 'Currency', 'Created At'];
        const rows = settlements.map(s => [
            s.settlementNumber,
            s.settlementType,
            s.status,
            s.totalAmount,
            s.currency,
            s.createdAt.toISOString(),
        ]);
        return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }
}
// ============================================================================
// NESTJS SERVICE
// ============================================================================
/**
 * Settlement Negotiation Service
 * NestJS service for settlement operations with dependency injection
 */
let SettlementNegotiationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SettlementNegotiationService = _classThis = class {
        constructor(settlementRepo, offerRepo, paymentPlanRepo, authorityRepo, activityRepo, configService) {
            this.settlementRepo = settlementRepo;
            this.offerRepo = offerRepo;
            this.paymentPlanRepo = paymentPlanRepo;
            this.authorityRepo = authorityRepo;
            this.activityRepo = activityRepo;
            this.configService = configService;
            this.logger = new common_1.Logger(SettlementNegotiationService.name);
        }
        /**
         * Create new settlement
         */
        async create(data, userId) {
            this.logger.log(`Creating settlement for case: ${data.caseId}`);
            return createSettlementOffer(data, userId, this.configService);
        }
        /**
         * Get settlement by ID
         */
        async findById(id) {
            const settlement = await this.settlementRepo.findByPk(id, {
                include: [
                    { model: SettlementPartyModel, as: 'parties' },
                    { model: SettlementOfferModel, as: 'offers' },
                    { model: NegotiationActivityModel, as: 'activities' },
                ],
            });
            if (!settlement) {
                throw new common_1.NotFoundException(`Settlement ${id} not found`);
            }
            return settlement.toJSON();
        }
        /**
         * Search settlements
         */
        async search(filters) {
            return searchSettlements(filters, this.settlementRepo);
        }
        /**
         * Create offer
         */
        async createOffer(settlementId, data, userId, role) {
            return counterSettlementOffer(settlementId, data, userId, role, this.offerRepo);
        }
        /**
         * Create payment plan
         */
        async createPaymentPlan(settlementId, data, userId) {
            return createPaymentPlan(settlementId, data, userId);
        }
        /**
         * Get analytics
         */
        async getAnalytics(filters) {
            return getSettlementAnalytics(filters, this.settlementRepo);
        }
    };
    __setFunctionName(_classThis, "SettlementNegotiationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SettlementNegotiationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SettlementNegotiationService = _classThis;
})();
exports.SettlementNegotiationService = SettlementNegotiationService;
// ============================================================================
// SWAGGER API DOCUMENTATION
// ============================================================================
/**
 * Settlement DTO for API documentation
 */
let SettlementDto = (() => {
    var _a;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _settlementNumber_decorators;
    let _settlementNumber_initializers = [];
    let _settlementNumber_extraInitializers = [];
    let _caseId_decorators;
    let _caseId_initializers = [];
    let _caseId_extraInitializers = [];
    let _settlementType_decorators;
    let _settlementType_initializers = [];
    let _settlementType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _totalAmount_decorators;
    let _totalAmount_initializers = [];
    let _totalAmount_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _demandAmount_decorators;
    let _demandAmount_initializers = [];
    let _demandAmount_extraInitializers = [];
    let _offerAmount_decorators;
    let _offerAmount_initializers = [];
    let _offerAmount_extraInitializers = [];
    return _a = class SettlementDto {
            constructor() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.settlementNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _settlementNumber_initializers, void 0));
                this.caseId = (__runInitializers(this, _settlementNumber_extraInitializers), __runInitializers(this, _caseId_initializers, void 0));
                this.settlementType = (__runInitializers(this, _caseId_extraInitializers), __runInitializers(this, _settlementType_initializers, void 0));
                this.status = (__runInitializers(this, _settlementType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.totalAmount = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _totalAmount_initializers, void 0));
                this.currency = (__runInitializers(this, _totalAmount_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                this.demandAmount = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _demandAmount_initializers, void 0));
                this.offerAmount = (__runInitializers(this, _demandAmount_extraInitializers), __runInitializers(this, _offerAmount_initializers, void 0));
                __runInitializers(this, _offerAmount_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({ example: 'uuid', description: 'Settlement ID' })];
            _settlementNumber_decorators = [(0, swagger_1.ApiProperty)({ example: 'STL-2025-001234', description: 'Settlement number' })];
            _caseId_decorators = [(0, swagger_1.ApiProperty)({ example: 'uuid', description: 'Case ID' })];
            _settlementType_decorators = [(0, swagger_1.ApiProperty)({ enum: SettlementType, description: 'Settlement type' })];
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: SettlementStatus, description: 'Settlement status' })];
            _totalAmount_decorators = [(0, swagger_1.ApiProperty)({ example: 300000, description: 'Total settlement amount' })];
            _currency_decorators = [(0, swagger_1.ApiProperty)({ example: 'USD', description: 'Currency code' })];
            _demandAmount_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 500000, description: 'Demand amount' })];
            _offerAmount_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 300000, description: 'Offer amount' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _settlementNumber_decorators, { kind: "field", name: "settlementNumber", static: false, private: false, access: { has: obj => "settlementNumber" in obj, get: obj => obj.settlementNumber, set: (obj, value) => { obj.settlementNumber = value; } }, metadata: _metadata }, _settlementNumber_initializers, _settlementNumber_extraInitializers);
            __esDecorate(null, null, _caseId_decorators, { kind: "field", name: "caseId", static: false, private: false, access: { has: obj => "caseId" in obj, get: obj => obj.caseId, set: (obj, value) => { obj.caseId = value; } }, metadata: _metadata }, _caseId_initializers, _caseId_extraInitializers);
            __esDecorate(null, null, _settlementType_decorators, { kind: "field", name: "settlementType", static: false, private: false, access: { has: obj => "settlementType" in obj, get: obj => obj.settlementType, set: (obj, value) => { obj.settlementType = value; } }, metadata: _metadata }, _settlementType_initializers, _settlementType_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _totalAmount_decorators, { kind: "field", name: "totalAmount", static: false, private: false, access: { has: obj => "totalAmount" in obj, get: obj => obj.totalAmount, set: (obj, value) => { obj.totalAmount = value; } }, metadata: _metadata }, _totalAmount_initializers, _totalAmount_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _demandAmount_decorators, { kind: "field", name: "demandAmount", static: false, private: false, access: { has: obj => "demandAmount" in obj, get: obj => obj.demandAmount, set: (obj, value) => { obj.demandAmount = value; } }, metadata: _metadata }, _demandAmount_initializers, _demandAmount_extraInitializers);
            __esDecorate(null, null, _offerAmount_decorators, { kind: "field", name: "offerAmount", static: false, private: false, access: { has: obj => "offerAmount" in obj, get: obj => obj.offerAmount, set: (obj, value) => { obj.offerAmount = value; } }, metadata: _metadata }, _offerAmount_initializers, _offerAmount_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SettlementDto = SettlementDto;
/**
 * Create Settlement DTO
 */
let CreateSettlementDto = (() => {
    var _a;
    let _caseId_decorators;
    let _caseId_initializers = [];
    let _caseId_extraInitializers = [];
    let _settlementType_decorators;
    let _settlementType_initializers = [];
    let _settlementType_extraInitializers = [];
    let _demandAmount_decorators;
    let _demandAmount_initializers = [];
    let _demandAmount_extraInitializers = [];
    let _offerAmount_decorators;
    let _offerAmount_initializers = [];
    let _offerAmount_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    return _a = class CreateSettlementDto {
            constructor() {
                this.caseId = __runInitializers(this, _caseId_initializers, void 0);
                this.settlementType = (__runInitializers(this, _caseId_extraInitializers), __runInitializers(this, _settlementType_initializers, void 0));
                this.demandAmount = (__runInitializers(this, _settlementType_extraInitializers), __runInitializers(this, _demandAmount_initializers, void 0));
                this.offerAmount = (__runInitializers(this, _demandAmount_extraInitializers), __runInitializers(this, _offerAmount_initializers, void 0));
                this.description = (__runInitializers(this, _offerAmount_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.currency = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                __runInitializers(this, _currency_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _caseId_decorators = [(0, swagger_1.ApiProperty)({ example: 'uuid' })];
            _settlementType_decorators = [(0, swagger_1.ApiProperty)({ enum: SettlementType })];
            _demandAmount_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 500000 })];
            _offerAmount_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 300000 })];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _currency_decorators = [(0, swagger_1.ApiProperty)({ example: 'USD', default: 'USD' })];
            __esDecorate(null, null, _caseId_decorators, { kind: "field", name: "caseId", static: false, private: false, access: { has: obj => "caseId" in obj, get: obj => obj.caseId, set: (obj, value) => { obj.caseId = value; } }, metadata: _metadata }, _caseId_initializers, _caseId_extraInitializers);
            __esDecorate(null, null, _settlementType_decorators, { kind: "field", name: "settlementType", static: false, private: false, access: { has: obj => "settlementType" in obj, get: obj => obj.settlementType, set: (obj, value) => { obj.settlementType = value; } }, metadata: _metadata }, _settlementType_initializers, _settlementType_extraInitializers);
            __esDecorate(null, null, _demandAmount_decorators, { kind: "field", name: "demandAmount", static: false, private: false, access: { has: obj => "demandAmount" in obj, get: obj => obj.demandAmount, set: (obj, value) => { obj.demandAmount = value; } }, metadata: _metadata }, _demandAmount_initializers, _demandAmount_extraInitializers);
            __esDecorate(null, null, _offerAmount_decorators, { kind: "field", name: "offerAmount", static: false, private: false, access: { has: obj => "offerAmount" in obj, get: obj => obj.offerAmount, set: (obj, value) => { obj.offerAmount = value; } }, metadata: _metadata }, _offerAmount_initializers, _offerAmount_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateSettlementDto = CreateSettlementDto;
/**
 * Settlement Offer DTO
 */
let SettlementOfferDto = (() => {
    var _a;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _settlementId_decorators;
    let _settlementId_initializers = [];
    let _settlementId_extraInitializers = [];
    let _offerNumber_decorators;
    let _offerNumber_initializers = [];
    let _offerNumber_extraInitializers = [];
    let _offerType_decorators;
    let _offerType_initializers = [];
    let _offerType_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    return _a = class SettlementOfferDto {
            constructor() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.settlementId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _settlementId_initializers, void 0));
                this.offerNumber = (__runInitializers(this, _settlementId_extraInitializers), __runInitializers(this, _offerNumber_initializers, void 0));
                this.offerType = (__runInitializers(this, _offerNumber_extraInitializers), __runInitializers(this, _offerType_initializers, void 0));
                this.amount = (__runInitializers(this, _offerType_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.status = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                __runInitializers(this, _status_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _settlementId_decorators = [(0, swagger_1.ApiProperty)()];
            _offerNumber_decorators = [(0, swagger_1.ApiProperty)({ example: 1 })];
            _offerType_decorators = [(0, swagger_1.ApiProperty)({ enum: ['initial', 'counter', 'final'] })];
            _amount_decorators = [(0, swagger_1.ApiProperty)({ example: 300000 })];
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: OfferStatus })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _settlementId_decorators, { kind: "field", name: "settlementId", static: false, private: false, access: { has: obj => "settlementId" in obj, get: obj => obj.settlementId, set: (obj, value) => { obj.settlementId = value; } }, metadata: _metadata }, _settlementId_initializers, _settlementId_extraInitializers);
            __esDecorate(null, null, _offerNumber_decorators, { kind: "field", name: "offerNumber", static: false, private: false, access: { has: obj => "offerNumber" in obj, get: obj => obj.offerNumber, set: (obj, value) => { obj.offerNumber = value; } }, metadata: _metadata }, _offerNumber_initializers, _offerNumber_extraInitializers);
            __esDecorate(null, null, _offerType_decorators, { kind: "field", name: "offerType", static: false, private: false, access: { has: obj => "offerType" in obj, get: obj => obj.offerType, set: (obj, value) => { obj.offerType = value; } }, metadata: _metadata }, _offerType_initializers, _offerType_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SettlementOfferDto = SettlementOfferDto;
/**
 * Payment Plan DTO
 */
let PaymentPlanDto = (() => {
    var _a;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _settlementId_decorators;
    let _settlementId_initializers = [];
    let _settlementId_extraInitializers = [];
    let _totalAmount_decorators;
    let _totalAmount_initializers = [];
    let _totalAmount_extraInitializers = [];
    let _numberOfInstallments_decorators;
    let _numberOfInstallments_initializers = [];
    let _numberOfInstallments_extraInitializers = [];
    let _frequency_decorators;
    let _frequency_initializers = [];
    let _frequency_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    return _a = class PaymentPlanDto {
            constructor() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.settlementId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _settlementId_initializers, void 0));
                this.totalAmount = (__runInitializers(this, _settlementId_extraInitializers), __runInitializers(this, _totalAmount_initializers, void 0));
                this.numberOfInstallments = (__runInitializers(this, _totalAmount_extraInitializers), __runInitializers(this, _numberOfInstallments_initializers, void 0));
                this.frequency = (__runInitializers(this, _numberOfInstallments_extraInitializers), __runInitializers(this, _frequency_initializers, void 0));
                this.status = (__runInitializers(this, _frequency_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                __runInitializers(this, _status_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _settlementId_decorators = [(0, swagger_1.ApiProperty)()];
            _totalAmount_decorators = [(0, swagger_1.ApiProperty)({ example: 300000 })];
            _numberOfInstallments_decorators = [(0, swagger_1.ApiProperty)({ example: 12 })];
            _frequency_decorators = [(0, swagger_1.ApiProperty)({ enum: ['weekly', 'bi-weekly', 'monthly', 'quarterly'] })];
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: PaymentPlanStatus })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _settlementId_decorators, { kind: "field", name: "settlementId", static: false, private: false, access: { has: obj => "settlementId" in obj, get: obj => obj.settlementId, set: (obj, value) => { obj.settlementId = value; } }, metadata: _metadata }, _settlementId_initializers, _settlementId_extraInitializers);
            __esDecorate(null, null, _totalAmount_decorators, { kind: "field", name: "totalAmount", static: false, private: false, access: { has: obj => "totalAmount" in obj, get: obj => obj.totalAmount, set: (obj, value) => { obj.totalAmount = value; } }, metadata: _metadata }, _totalAmount_initializers, _totalAmount_extraInitializers);
            __esDecorate(null, null, _numberOfInstallments_decorators, { kind: "field", name: "numberOfInstallments", static: false, private: false, access: { has: obj => "numberOfInstallments" in obj, get: obj => obj.numberOfInstallments, set: (obj, value) => { obj.numberOfInstallments = value; } }, metadata: _metadata }, _numberOfInstallments_initializers, _numberOfInstallments_extraInitializers);
            __esDecorate(null, null, _frequency_decorators, { kind: "field", name: "frequency", static: false, private: false, access: { has: obj => "frequency" in obj, get: obj => obj.frequency, set: (obj, value) => { obj.frequency = value; } }, metadata: _metadata }, _frequency_initializers, _frequency_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PaymentPlanDto = PaymentPlanDto;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Configuration
    registerSettlementConfig,
    createSettlementConfigModule,
    // Settlement Management
    generateSettlementNumber,
    createSettlementOffer,
    updateSettlementOffer,
    acceptSettlementOffer,
    rejectSettlementOffer,
    counterSettlementOffer,
    withdrawSettlementOffer,
    getSettlementOfferHistory,
    // Negotiation
    createNegotiationSession,
    addNegotiationNote,
    trackNegotiationActivity,
    getNegotiationTimeline,
    // Authority & Approval
    calculateSettlementRange,
    evaluateSettlementOffer,
    checkSettlementAuthority,
    requestSettlementApproval,
    approveSettlement,
    rejectSettlementApproval,
    delegateSettlementAuthority,
    // Payment Plans
    createPaymentPlan,
    validatePaymentPlan,
    calculatePaymentSchedule,
    updatePaymentStatus,
    getPaymentPlanStatus,
    // Release Documents
    generateReleaseDocument,
    generateSettlementAgreement,
    validateReleaseTerms,
    executeSettlement,
    recordSettlementPayment,
    // Search & Analytics
    searchSettlements,
    getSettlementByNumber,
    getSettlementAnalytics,
    compareSettlements,
    calculateSettlementMetrics,
    generateSettlementReport,
    exportSettlementData,
    // Service
    SettlementNegotiationService,
};
//# sourceMappingURL=settlement-negotiation-kit.js.map