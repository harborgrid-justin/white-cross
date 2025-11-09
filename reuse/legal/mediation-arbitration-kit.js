"use strict";
/**
 * LOC: MEDIATION_ARBITRATION_KIT_001
 * File: /reuse/legal/mediation-arbitration-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize-typescript
 *   - sequelize
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *   - date-fns
 *
 * DOWNSTREAM (imported by):
 *   - Legal ADR modules
 *   - Mediation management controllers
 *   - Arbitration services
 *   - Settlement conference services
 *   - Dispute resolution services
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
exports.MediationArbitrationModule = exports.mediationArbitrationConfig = exports.ADROutcomeAnalyticsService = exports.ADRSessionService = exports.ArbitrationAwardService = exports.SettlementOfferService = exports.ADRProceedingService = exports.MediatorSelectionService = exports.ADRSession = exports.ArbitrationAward = exports.SettlementOffer = exports.ADRProceeding = exports.Mediator = exports.CreateArbitrationAwardSchema = exports.CreateSettlementOfferSchema = exports.CreateADRProceedingSchema = exports.CreateMediatorSchema = exports.SessionFormat = exports.AwardStatus = exports.SettlementOfferStatus = exports.ArbitrationRules = exports.ArbitrationType = exports.MediatorCertification = exports.ADRStatus = exports.ADRType = void 0;
exports.generateADRNumber = generateADRNumber;
exports.generateOfferNumber = generateOfferNumber;
exports.generateAwardNumber = generateAwardNumber;
exports.calculateConflictScore = calculateConflictScore;
exports.rankMediatorsBySuitability = rankMediatorsBySuitability;
/**
 * File: /reuse/legal/mediation-arbitration-kit.ts
 * Locator: WC-MEDIATION-ARBITRATION-KIT-001
 * Purpose: Production-Grade Alternative Dispute Resolution Kit - Enterprise ADR management toolkit
 *
 * Upstream: NestJS, Sequelize, Zod, Date-FNS
 * Downstream: ../backend/modules/adr/*, Mediation controllers, Arbitration services
 * Dependencies: TypeScript 5.x, Node 18+, sequelize-typescript, @nestjs/swagger, zod
 * Exports: 40 production-ready ADR management functions for legal platforms
 *
 * LLM Context: Production-grade alternative dispute resolution lifecycle management toolkit for
 * White Cross platform. Provides comprehensive mediator selection with qualification verification
 * and conflict checking, ADR scheduling with calendar integration and availability management,
 * settlement conference tracking with offer/counteroffer documentation, arbitration award management
 * with enforcement tracking, ADR outcome analysis with success metrics and cost comparison,
 * Sequelize models for mediators/arbitrations/settlements/awards/conferences, NestJS services with
 * dependency injection, Swagger API documentation, mediator certification tracking and renewal
 * management, neutral selection algorithms with party preferences, ADR session scheduling with
 * automatic reminders, settlement proposal generation with valuation analysis, arbitration hearing
 * management with evidence submission, award drafting with legal standards compliance, enforcement
 * action tracking, mediated settlement agreement generation, confidentiality agreement management,
 * ADR clause analysis and recommendation, cost-benefit analysis comparing litigation vs ADR,
 * success rate analytics by mediator and case type, dispute classification and ADR suitability
 * assessment, multi-party mediation coordination, binding vs non-binding arbitration management,
 * discovery in arbitration scheduling, arbitration rule selection (AAA, JAMS, custom), virtual ADR
 * session support with video conference integration, and healthcare-specific ADR (medical malpractice
 * mediation, peer review arbitration, HIPAA-compliant confidentiality).
 */
const crypto = __importStar(require("crypto"));
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const sequelize_1 = require("sequelize");
const date_fns_1 = require("date-fns");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * ADR process types
 */
var ADRType;
(function (ADRType) {
    ADRType["MEDIATION"] = "mediation";
    ADRType["ARBITRATION"] = "arbitration";
    ADRType["SETTLEMENT_CONFERENCE"] = "settlement_conference";
    ADRType["NEUTRAL_EVALUATION"] = "neutral_evaluation";
    ADRType["EARLY_NEUTRAL_EVALUATION"] = "early_neutral_evaluation";
    ADRType["MINI_TRIAL"] = "mini_trial";
    ADRType["SUMMARY_JURY_TRIAL"] = "summary_jury_trial";
    ADRType["CONCILIATION"] = "conciliation";
    ADRType["FACILITATION"] = "facilitation";
    ADRType["MED_ARB"] = "med_arb";
    ADRType["ARB_MED"] = "arb_med";
})(ADRType || (exports.ADRType = ADRType = {}));
/**
 * ADR status lifecycle
 */
var ADRStatus;
(function (ADRStatus) {
    ADRStatus["INITIATED"] = "initiated";
    ADRStatus["MEDIATOR_SELECTION"] = "mediator_selection";
    ADRStatus["SCHEDULED"] = "scheduled";
    ADRStatus["IN_PROGRESS"] = "in_progress";
    ADRStatus["SETTLEMENT_REACHED"] = "settlement_reached";
    ADRStatus["IMPASSE"] = "impasse";
    ADRStatus["AWARD_ISSUED"] = "award_issued";
    ADRStatus["AWARD_CHALLENGED"] = "award_challenged";
    ADRStatus["AWARD_CONFIRMED"] = "award_confirmed";
    ADRStatus["AWARD_VACATED"] = "award_vacated";
    ADRStatus["ENFORCEMENT_PENDING"] = "enforcement_pending";
    ADRStatus["COMPLETED"] = "completed";
    ADRStatus["TERMINATED"] = "terminated";
})(ADRStatus || (exports.ADRStatus = ADRStatus = {}));
/**
 * Mediator certification levels
 */
var MediatorCertification;
(function (MediatorCertification) {
    MediatorCertification["BASIC"] = "basic";
    MediatorCertification["ADVANCED"] = "advanced";
    MediatorCertification["MASTER"] = "master";
    MediatorCertification["SPECIALTY_MEDICAL"] = "specialty_medical";
    MediatorCertification["SPECIALTY_EMPLOYMENT"] = "specialty_employment";
    MediatorCertification["SPECIALTY_COMMERCIAL"] = "specialty_commercial";
    MediatorCertification["SPECIALTY_FAMILY"] = "specialty_family";
    MediatorCertification["SPECIALTY_CONSTRUCTION"] = "specialty_construction";
    MediatorCertification["AAA_CERTIFIED"] = "aaa_certified";
    MediatorCertification["JAMS_CERTIFIED"] = "jams_certified";
    MediatorCertification["CPR_CERTIFIED"] = "cpr_certified";
    MediatorCertification["IMI_CERTIFIED"] = "imi_certified";
})(MediatorCertification || (exports.MediatorCertification = MediatorCertification = {}));
/**
 * Arbitration binding types
 */
var ArbitrationType;
(function (ArbitrationType) {
    ArbitrationType["BINDING"] = "binding";
    ArbitrationType["NON_BINDING"] = "non_binding";
    ArbitrationType["HIGH_LOW_ARBITRATION"] = "high_low_arbitration";
    ArbitrationType["BASEBALL_ARBITRATION"] = "baseball_arbitration";
    ArbitrationType["NIGHT_BASEBALL"] = "night_baseball";
})(ArbitrationType || (exports.ArbitrationType = ArbitrationType = {}));
/**
 * Arbitration rule sets
 */
var ArbitrationRules;
(function (ArbitrationRules) {
    ArbitrationRules["AAA_COMMERCIAL"] = "aaa_commercial";
    ArbitrationRules["AAA_EMPLOYMENT"] = "aaa_employment";
    ArbitrationRules["AAA_HEALTHCARE"] = "aaa_healthcare";
    ArbitrationRules["JAMS_COMPREHENSIVE"] = "jams_comprehensive";
    ArbitrationRules["JAMS_STREAMLINED"] = "jams_streamlined";
    ArbitrationRules["CPR_RULES"] = "cpr_rules";
    ArbitrationRules["UNCITRAL"] = "uncitral";
    ArbitrationRules["ICC"] = "icc";
    ArbitrationRules["CUSTOM"] = "custom";
})(ArbitrationRules || (exports.ArbitrationRules = ArbitrationRules = {}));
/**
 * Settlement offer status
 */
var SettlementOfferStatus;
(function (SettlementOfferStatus) {
    SettlementOfferStatus["DRAFT"] = "draft";
    SettlementOfferStatus["PROPOSED"] = "proposed";
    SettlementOfferStatus["PENDING_REVIEW"] = "pending_review";
    SettlementOfferStatus["ACCEPTED"] = "accepted";
    SettlementOfferStatus["REJECTED"] = "rejected";
    SettlementOfferStatus["COUNTERED"] = "countered";
    SettlementOfferStatus["WITHDRAWN"] = "withdrawn";
    SettlementOfferStatus["EXPIRED"] = "expired";
})(SettlementOfferStatus || (exports.SettlementOfferStatus = SettlementOfferStatus = {}));
/**
 * Award status tracking
 */
var AwardStatus;
(function (AwardStatus) {
    AwardStatus["DRAFT"] = "draft";
    AwardStatus["ISSUED"] = "issued";
    AwardStatus["SERVED"] = "served";
    AwardStatus["MOTION_TO_CONFIRM"] = "motion_to_confirm";
    AwardStatus["MOTION_TO_VACATE"] = "motion_to_vacate";
    AwardStatus["MOTION_TO_MODIFY"] = "motion_to_modify";
    AwardStatus["CONFIRMED"] = "confirmed";
    AwardStatus["VACATED"] = "vacated";
    AwardStatus["MODIFIED"] = "modified";
    AwardStatus["ENFORCEMENT_INITIATED"] = "enforcement_initiated";
    AwardStatus["SATISFIED"] = "satisfied";
})(AwardStatus || (exports.AwardStatus = AwardStatus = {}));
/**
 * Session format types
 */
var SessionFormat;
(function (SessionFormat) {
    SessionFormat["IN_PERSON"] = "in_person";
    SessionFormat["VIRTUAL"] = "virtual";
    SessionFormat["HYBRID"] = "hybrid";
    SessionFormat["TELEPHONIC"] = "telephonic";
    SessionFormat["ASYNCHRONOUS"] = "asynchronous";
})(SessionFormat || (exports.SessionFormat = SessionFormat = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
exports.CreateMediatorSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string(),
    certifications: zod_1.z.array(zod_1.z.nativeEnum(MediatorCertification)),
    specializations: zod_1.z.array(zod_1.z.string()),
    yearsExperience: zod_1.z.number().min(0),
    hourlyRate: zod_1.z.number().min(0),
    bio: zod_1.z.string(),
    educationBackground: zod_1.z.array(zod_1.z.string()),
    languages: zod_1.z.array(zod_1.z.string()),
    jurisdictions: zod_1.z.array(zod_1.z.string()),
});
exports.CreateADRProceedingSchema = zod_1.z.object({
    adrType: zod_1.z.nativeEnum(ADRType),
    matterId: zod_1.z.string().uuid(),
    matterName: zod_1.z.string(),
    claimantId: zod_1.z.string().uuid(),
    claimantName: zod_1.z.string(),
    respondentId: zod_1.z.string().uuid(),
    respondentName: zod_1.z.string(),
    disputeDescription: zod_1.z.string(),
    amountInControversy: zod_1.z.number().optional(),
    arbitrationType: zod_1.z.nativeEnum(ArbitrationType).optional(),
    arbitrationRules: zod_1.z.nativeEnum(ArbitrationRules).optional(),
    sessionFormat: zod_1.z.nativeEnum(SessionFormat),
    isBinding: zod_1.z.boolean(),
});
exports.CreateSettlementOfferSchema = zod_1.z.object({
    adrProceedingId: zod_1.z.string().uuid(),
    offeringParty: zod_1.z.enum(['claimant', 'respondent']),
    offeringPartyId: zod_1.z.string().uuid(),
    receivingPartyId: zod_1.z.string().uuid(),
    offerAmount: zod_1.z.number().min(0),
    conditions: zod_1.z.array(zod_1.z.string()),
    responseDeadline: zod_1.z.string().datetime(),
    confidential: zod_1.z.boolean(),
});
exports.CreateArbitrationAwardSchema = zod_1.z.object({
    adrProceedingId: zod_1.z.string().uuid(),
    arbitratorIds: zod_1.z.array(zod_1.z.string().uuid()),
    awardType: zod_1.z.enum(['final', 'interim', 'partial', 'consent', 'default']),
    awardAmount: zod_1.z.number().optional(),
    prevailingParty: zod_1.z.enum(['claimant', 'respondent', 'split']).optional(),
    findings: zod_1.z.string(),
    reasoning: zod_1.z.string(),
    appealAllowed: zod_1.z.boolean(),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
let Mediator = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'mediators',
            timestamps: true,
            paranoid: true,
            underscored: true,
            indexes: [
                { fields: ['email'], unique: true },
                { fields: ['is_active'] },
                { fields: ['certifications'], using: 'gin' },
                { fields: ['specializations'], using: 'gin' },
                { fields: ['jurisdictions'], using: 'gin' },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _firstName_decorators;
    let _firstName_initializers = [];
    let _firstName_extraInitializers = [];
    let _lastName_decorators;
    let _lastName_initializers = [];
    let _lastName_extraInitializers = [];
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _phone_decorators;
    let _phone_initializers = [];
    let _phone_extraInitializers = [];
    let _organization_decorators;
    let _organization_initializers = [];
    let _organization_extraInitializers = [];
    let _certifications_decorators;
    let _certifications_initializers = [];
    let _certifications_extraInitializers = [];
    let _specializations_decorators;
    let _specializations_initializers = [];
    let _specializations_extraInitializers = [];
    let _yearsExperience_decorators;
    let _yearsExperience_initializers = [];
    let _yearsExperience_extraInitializers = [];
    let _successRate_decorators;
    let _successRate_initializers = [];
    let _successRate_extraInitializers = [];
    let _totalCasesMediated_decorators;
    let _totalCasesMediated_initializers = [];
    let _totalCasesMediated_extraInitializers = [];
    let _hourlyRate_decorators;
    let _hourlyRate_initializers = [];
    let _hourlyRate_extraInitializers = [];
    let _dailyRate_decorators;
    let _dailyRate_initializers = [];
    let _dailyRate_extraInitializers = [];
    let _availability_decorators;
    let _availability_initializers = [];
    let _availability_extraInitializers = [];
    let _bio_decorators;
    let _bio_initializers = [];
    let _bio_extraInitializers = [];
    let _educationBackground_decorators;
    let _educationBackground_initializers = [];
    let _educationBackground_extraInitializers = [];
    let _languages_decorators;
    let _languages_initializers = [];
    let _languages_extraInitializers = [];
    let _jurisdictions_decorators;
    let _jurisdictions_initializers = [];
    let _jurisdictions_extraInitializers = [];
    let _conflictCheckIds_decorators;
    let _conflictCheckIds_initializers = [];
    let _conflictCheckIds_extraInitializers = [];
    let _rating_decorators;
    let _rating_initializers = [];
    let _rating_extraInitializers = [];
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
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _proceedings_decorators;
    let _proceedings_initializers = [];
    let _proceedings_extraInitializers = [];
    var Mediator = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.firstName = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _firstName_initializers, void 0));
            this.lastName = (__runInitializers(this, _firstName_extraInitializers), __runInitializers(this, _lastName_initializers, void 0));
            this.email = (__runInitializers(this, _lastName_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
            this.organization = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _organization_initializers, void 0));
            this.certifications = (__runInitializers(this, _organization_extraInitializers), __runInitializers(this, _certifications_initializers, void 0));
            this.specializations = (__runInitializers(this, _certifications_extraInitializers), __runInitializers(this, _specializations_initializers, void 0));
            this.yearsExperience = (__runInitializers(this, _specializations_extraInitializers), __runInitializers(this, _yearsExperience_initializers, void 0));
            this.successRate = (__runInitializers(this, _yearsExperience_extraInitializers), __runInitializers(this, _successRate_initializers, void 0));
            this.totalCasesMediated = (__runInitializers(this, _successRate_extraInitializers), __runInitializers(this, _totalCasesMediated_initializers, void 0));
            this.hourlyRate = (__runInitializers(this, _totalCasesMediated_extraInitializers), __runInitializers(this, _hourlyRate_initializers, void 0));
            this.dailyRate = (__runInitializers(this, _hourlyRate_extraInitializers), __runInitializers(this, _dailyRate_initializers, void 0));
            this.availability = (__runInitializers(this, _dailyRate_extraInitializers), __runInitializers(this, _availability_initializers, void 0));
            this.bio = (__runInitializers(this, _availability_extraInitializers), __runInitializers(this, _bio_initializers, void 0));
            this.educationBackground = (__runInitializers(this, _bio_extraInitializers), __runInitializers(this, _educationBackground_initializers, void 0));
            this.languages = (__runInitializers(this, _educationBackground_extraInitializers), __runInitializers(this, _languages_initializers, void 0));
            this.jurisdictions = (__runInitializers(this, _languages_extraInitializers), __runInitializers(this, _jurisdictions_initializers, void 0));
            this.conflictCheckIds = (__runInitializers(this, _jurisdictions_extraInitializers), __runInitializers(this, _conflictCheckIds_initializers, void 0));
            this.rating = (__runInitializers(this, _conflictCheckIds_extraInitializers), __runInitializers(this, _rating_initializers, void 0));
            this.isActive = (__runInitializers(this, _rating_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.metadata = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.proceedings = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _proceedings_initializers, void 0));
            __runInitializers(this, _proceedings_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Mediator");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique mediator identifier' }), sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _firstName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Mediator first name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _lastName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Mediator last name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _email_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contact email address' }), (0, sequelize_typescript_1.Index)({ unique: true }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _phone_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contact phone number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _organization_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Organization affiliation' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true })];
        _certifications_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Mediator certifications',
                enum: MediatorCertification,
                isArray: true,
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING), allowNull: false })];
        _specializations_decorators = [(0, swagger_1.ApiProperty)({ description: 'Areas of specialization', isArray: true }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING), allowNull: false })];
        _yearsExperience_decorators = [(0, swagger_1.ApiProperty)({ description: 'Years of mediation experience' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _successRate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Success rate percentage (0-100)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.FLOAT, allowNull: true })];
        _totalCasesMediated_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total cases mediated', default: 0 }), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _hourlyRate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Hourly rate in USD' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: false })];
        _dailyRate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Daily rate in USD' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: true })];
        _availability_decorators = [(0, swagger_1.ApiProperty)({ description: 'Availability calendar', type: 'object' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false, defaultValue: {} })];
        _bio_decorators = [(0, swagger_1.ApiProperty)({ description: 'Mediator biography' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _educationBackground_decorators = [(0, swagger_1.ApiProperty)({ description: 'Education credentials', isArray: true }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING), allowNull: false })];
        _languages_decorators = [(0, swagger_1.ApiProperty)({ description: 'Languages spoken', isArray: true }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING), allowNull: false })];
        _jurisdictions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Licensed jurisdictions', isArray: true }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING), allowNull: false })];
        _conflictCheckIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Conflict check party IDs', isArray: true }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
                defaultValue: [],
            })];
        _rating_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Mediator rating (0-5)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.FLOAT, allowNull: true })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Active status', default: true }), (0, sequelize_typescript_1.Default)(true), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata', type: 'object' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false, defaultValue: {} })];
        _createdAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }), sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _updatedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }), sequelize_typescript_1.UpdatedAt, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _deletedAt_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Soft delete timestamp' }), sequelize_typescript_1.DeletedAt, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _proceedings_decorators = [(0, sequelize_typescript_1.HasMany)(() => ADRProceeding, 'mediatorId')];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _firstName_decorators, { kind: "field", name: "firstName", static: false, private: false, access: { has: obj => "firstName" in obj, get: obj => obj.firstName, set: (obj, value) => { obj.firstName = value; } }, metadata: _metadata }, _firstName_initializers, _firstName_extraInitializers);
        __esDecorate(null, null, _lastName_decorators, { kind: "field", name: "lastName", static: false, private: false, access: { has: obj => "lastName" in obj, get: obj => obj.lastName, set: (obj, value) => { obj.lastName = value; } }, metadata: _metadata }, _lastName_initializers, _lastName_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: obj => "phone" in obj, get: obj => obj.phone, set: (obj, value) => { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
        __esDecorate(null, null, _organization_decorators, { kind: "field", name: "organization", static: false, private: false, access: { has: obj => "organization" in obj, get: obj => obj.organization, set: (obj, value) => { obj.organization = value; } }, metadata: _metadata }, _organization_initializers, _organization_extraInitializers);
        __esDecorate(null, null, _certifications_decorators, { kind: "field", name: "certifications", static: false, private: false, access: { has: obj => "certifications" in obj, get: obj => obj.certifications, set: (obj, value) => { obj.certifications = value; } }, metadata: _metadata }, _certifications_initializers, _certifications_extraInitializers);
        __esDecorate(null, null, _specializations_decorators, { kind: "field", name: "specializations", static: false, private: false, access: { has: obj => "specializations" in obj, get: obj => obj.specializations, set: (obj, value) => { obj.specializations = value; } }, metadata: _metadata }, _specializations_initializers, _specializations_extraInitializers);
        __esDecorate(null, null, _yearsExperience_decorators, { kind: "field", name: "yearsExperience", static: false, private: false, access: { has: obj => "yearsExperience" in obj, get: obj => obj.yearsExperience, set: (obj, value) => { obj.yearsExperience = value; } }, metadata: _metadata }, _yearsExperience_initializers, _yearsExperience_extraInitializers);
        __esDecorate(null, null, _successRate_decorators, { kind: "field", name: "successRate", static: false, private: false, access: { has: obj => "successRate" in obj, get: obj => obj.successRate, set: (obj, value) => { obj.successRate = value; } }, metadata: _metadata }, _successRate_initializers, _successRate_extraInitializers);
        __esDecorate(null, null, _totalCasesMediated_decorators, { kind: "field", name: "totalCasesMediated", static: false, private: false, access: { has: obj => "totalCasesMediated" in obj, get: obj => obj.totalCasesMediated, set: (obj, value) => { obj.totalCasesMediated = value; } }, metadata: _metadata }, _totalCasesMediated_initializers, _totalCasesMediated_extraInitializers);
        __esDecorate(null, null, _hourlyRate_decorators, { kind: "field", name: "hourlyRate", static: false, private: false, access: { has: obj => "hourlyRate" in obj, get: obj => obj.hourlyRate, set: (obj, value) => { obj.hourlyRate = value; } }, metadata: _metadata }, _hourlyRate_initializers, _hourlyRate_extraInitializers);
        __esDecorate(null, null, _dailyRate_decorators, { kind: "field", name: "dailyRate", static: false, private: false, access: { has: obj => "dailyRate" in obj, get: obj => obj.dailyRate, set: (obj, value) => { obj.dailyRate = value; } }, metadata: _metadata }, _dailyRate_initializers, _dailyRate_extraInitializers);
        __esDecorate(null, null, _availability_decorators, { kind: "field", name: "availability", static: false, private: false, access: { has: obj => "availability" in obj, get: obj => obj.availability, set: (obj, value) => { obj.availability = value; } }, metadata: _metadata }, _availability_initializers, _availability_extraInitializers);
        __esDecorate(null, null, _bio_decorators, { kind: "field", name: "bio", static: false, private: false, access: { has: obj => "bio" in obj, get: obj => obj.bio, set: (obj, value) => { obj.bio = value; } }, metadata: _metadata }, _bio_initializers, _bio_extraInitializers);
        __esDecorate(null, null, _educationBackground_decorators, { kind: "field", name: "educationBackground", static: false, private: false, access: { has: obj => "educationBackground" in obj, get: obj => obj.educationBackground, set: (obj, value) => { obj.educationBackground = value; } }, metadata: _metadata }, _educationBackground_initializers, _educationBackground_extraInitializers);
        __esDecorate(null, null, _languages_decorators, { kind: "field", name: "languages", static: false, private: false, access: { has: obj => "languages" in obj, get: obj => obj.languages, set: (obj, value) => { obj.languages = value; } }, metadata: _metadata }, _languages_initializers, _languages_extraInitializers);
        __esDecorate(null, null, _jurisdictions_decorators, { kind: "field", name: "jurisdictions", static: false, private: false, access: { has: obj => "jurisdictions" in obj, get: obj => obj.jurisdictions, set: (obj, value) => { obj.jurisdictions = value; } }, metadata: _metadata }, _jurisdictions_initializers, _jurisdictions_extraInitializers);
        __esDecorate(null, null, _conflictCheckIds_decorators, { kind: "field", name: "conflictCheckIds", static: false, private: false, access: { has: obj => "conflictCheckIds" in obj, get: obj => obj.conflictCheckIds, set: (obj, value) => { obj.conflictCheckIds = value; } }, metadata: _metadata }, _conflictCheckIds_initializers, _conflictCheckIds_extraInitializers);
        __esDecorate(null, null, _rating_decorators, { kind: "field", name: "rating", static: false, private: false, access: { has: obj => "rating" in obj, get: obj => obj.rating, set: (obj, value) => { obj.rating = value; } }, metadata: _metadata }, _rating_initializers, _rating_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _proceedings_decorators, { kind: "field", name: "proceedings", static: false, private: false, access: { has: obj => "proceedings" in obj, get: obj => obj.proceedings, set: (obj, value) => { obj.proceedings = value; } }, metadata: _metadata }, _proceedings_initializers, _proceedings_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Mediator = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Mediator = _classThis;
})();
exports.Mediator = Mediator;
let ADRProceeding = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'adr_proceedings',
            timestamps: true,
            paranoid: true,
            underscored: true,
            indexes: [
                { fields: ['adr_number'], unique: true },
                { fields: ['matter_id'] },
                { fields: ['status'] },
                { fields: ['adr_type'] },
                { fields: ['mediator_id'] },
                { fields: ['scheduled_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _adrNumber_decorators;
    let _adrNumber_initializers = [];
    let _adrNumber_extraInitializers = [];
    let _adrType_decorators;
    let _adrType_initializers = [];
    let _adrType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _matterId_decorators;
    let _matterId_initializers = [];
    let _matterId_extraInitializers = [];
    let _matterName_decorators;
    let _matterName_initializers = [];
    let _matterName_extraInitializers = [];
    let _claimantId_decorators;
    let _claimantId_initializers = [];
    let _claimantId_extraInitializers = [];
    let _claimantName_decorators;
    let _claimantName_initializers = [];
    let _claimantName_extraInitializers = [];
    let _respondentId_decorators;
    let _respondentId_initializers = [];
    let _respondentId_extraInitializers = [];
    let _respondentName_decorators;
    let _respondentName_initializers = [];
    let _respondentName_extraInitializers = [];
    let _mediatorId_decorators;
    let _mediatorId_initializers = [];
    let _mediatorId_extraInitializers = [];
    let _arbitratorIds_decorators;
    let _arbitratorIds_initializers = [];
    let _arbitratorIds_extraInitializers = [];
    let _disputeDescription_decorators;
    let _disputeDescription_initializers = [];
    let _disputeDescription_extraInitializers = [];
    let _amountInControversy_decorators;
    let _amountInControversy_initializers = [];
    let _amountInControversy_extraInitializers = [];
    let _arbitrationType_decorators;
    let _arbitrationType_initializers = [];
    let _arbitrationType_extraInitializers = [];
    let _arbitrationRules_decorators;
    let _arbitrationRules_initializers = [];
    let _arbitrationRules_extraInitializers = [];
    let _sessionFormat_decorators;
    let _sessionFormat_initializers = [];
    let _sessionFormat_extraInitializers = [];
    let _scheduledDate_decorators;
    let _scheduledDate_initializers = [];
    let _scheduledDate_extraInitializers = [];
    let _scheduledDuration_decorators;
    let _scheduledDuration_initializers = [];
    let _scheduledDuration_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _virtualMeetingLink_decorators;
    let _virtualMeetingLink_initializers = [];
    let _virtualMeetingLink_extraInitializers = [];
    let _confidentialityAgreementSigned_decorators;
    let _confidentialityAgreementSigned_initializers = [];
    let _confidentialityAgreementSigned_extraInitializers = [];
    let _isBinding_decorators;
    let _isBinding_initializers = [];
    let _isBinding_extraInitializers = [];
    let _discoveryAllowed_decorators;
    let _discoveryAllowed_initializers = [];
    let _discoveryAllowed_extraInitializers = [];
    let _filingFee_decorators;
    let _filingFee_initializers = [];
    let _filingFee_extraInitializers = [];
    let _administrativeFees_decorators;
    let _administrativeFees_initializers = [];
    let _administrativeFees_extraInitializers = [];
    let _neutralFees_decorators;
    let _neutralFees_initializers = [];
    let _neutralFees_extraInitializers = [];
    let _estimatedTotalCost_decorators;
    let _estimatedTotalCost_initializers = [];
    let _estimatedTotalCost_extraInitializers = [];
    let _actualTotalCost_decorators;
    let _actualTotalCost_initializers = [];
    let _actualTotalCost_extraInitializers = [];
    let _initiationDate_decorators;
    let _initiationDate_initializers = [];
    let _initiationDate_extraInitializers = [];
    let _completionDate_decorators;
    let _completionDate_initializers = [];
    let _completionDate_extraInitializers = [];
    let _outcome_decorators;
    let _outcome_initializers = [];
    let _outcome_extraInitializers = [];
    let _settlementAmount_decorators;
    let _settlementAmount_initializers = [];
    let _settlementAmount_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _mediator_decorators;
    let _mediator_initializers = [];
    let _mediator_extraInitializers = [];
    let _settlementOffers_decorators;
    let _settlementOffers_initializers = [];
    let _settlementOffers_extraInitializers = [];
    let _awards_decorators;
    let _awards_initializers = [];
    let _awards_extraInitializers = [];
    let _sessions_decorators;
    let _sessions_initializers = [];
    let _sessions_extraInitializers = [];
    var ADRProceeding = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.adrNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _adrNumber_initializers, void 0));
            this.adrType = (__runInitializers(this, _adrNumber_extraInitializers), __runInitializers(this, _adrType_initializers, void 0));
            this.status = (__runInitializers(this, _adrType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.matterId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _matterId_initializers, void 0));
            this.matterName = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _matterName_initializers, void 0));
            this.claimantId = (__runInitializers(this, _matterName_extraInitializers), __runInitializers(this, _claimantId_initializers, void 0));
            this.claimantName = (__runInitializers(this, _claimantId_extraInitializers), __runInitializers(this, _claimantName_initializers, void 0));
            this.respondentId = (__runInitializers(this, _claimantName_extraInitializers), __runInitializers(this, _respondentId_initializers, void 0));
            this.respondentName = (__runInitializers(this, _respondentId_extraInitializers), __runInitializers(this, _respondentName_initializers, void 0));
            this.mediatorId = (__runInitializers(this, _respondentName_extraInitializers), __runInitializers(this, _mediatorId_initializers, void 0));
            this.arbitratorIds = (__runInitializers(this, _mediatorId_extraInitializers), __runInitializers(this, _arbitratorIds_initializers, void 0));
            this.disputeDescription = (__runInitializers(this, _arbitratorIds_extraInitializers), __runInitializers(this, _disputeDescription_initializers, void 0));
            this.amountInControversy = (__runInitializers(this, _disputeDescription_extraInitializers), __runInitializers(this, _amountInControversy_initializers, void 0));
            this.arbitrationType = (__runInitializers(this, _amountInControversy_extraInitializers), __runInitializers(this, _arbitrationType_initializers, void 0));
            this.arbitrationRules = (__runInitializers(this, _arbitrationType_extraInitializers), __runInitializers(this, _arbitrationRules_initializers, void 0));
            this.sessionFormat = (__runInitializers(this, _arbitrationRules_extraInitializers), __runInitializers(this, _sessionFormat_initializers, void 0));
            this.scheduledDate = (__runInitializers(this, _sessionFormat_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
            this.scheduledDuration = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _scheduledDuration_initializers, void 0));
            this.location = (__runInitializers(this, _scheduledDuration_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.virtualMeetingLink = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _virtualMeetingLink_initializers, void 0));
            this.confidentialityAgreementSigned = (__runInitializers(this, _virtualMeetingLink_extraInitializers), __runInitializers(this, _confidentialityAgreementSigned_initializers, void 0));
            this.isBinding = (__runInitializers(this, _confidentialityAgreementSigned_extraInitializers), __runInitializers(this, _isBinding_initializers, void 0));
            this.discoveryAllowed = (__runInitializers(this, _isBinding_extraInitializers), __runInitializers(this, _discoveryAllowed_initializers, void 0));
            this.filingFee = (__runInitializers(this, _discoveryAllowed_extraInitializers), __runInitializers(this, _filingFee_initializers, void 0));
            this.administrativeFees = (__runInitializers(this, _filingFee_extraInitializers), __runInitializers(this, _administrativeFees_initializers, void 0));
            this.neutralFees = (__runInitializers(this, _administrativeFees_extraInitializers), __runInitializers(this, _neutralFees_initializers, void 0));
            this.estimatedTotalCost = (__runInitializers(this, _neutralFees_extraInitializers), __runInitializers(this, _estimatedTotalCost_initializers, void 0));
            this.actualTotalCost = (__runInitializers(this, _estimatedTotalCost_extraInitializers), __runInitializers(this, _actualTotalCost_initializers, void 0));
            this.initiationDate = (__runInitializers(this, _actualTotalCost_extraInitializers), __runInitializers(this, _initiationDate_initializers, void 0));
            this.completionDate = (__runInitializers(this, _initiationDate_extraInitializers), __runInitializers(this, _completionDate_initializers, void 0));
            this.outcome = (__runInitializers(this, _completionDate_extraInitializers), __runInitializers(this, _outcome_initializers, void 0));
            this.settlementAmount = (__runInitializers(this, _outcome_extraInitializers), __runInitializers(this, _settlementAmount_initializers, void 0));
            this.tags = (__runInitializers(this, _settlementAmount_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.metadata = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.mediator = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _mediator_initializers, void 0));
            this.settlementOffers = (__runInitializers(this, _mediator_extraInitializers), __runInitializers(this, _settlementOffers_initializers, void 0));
            this.awards = (__runInitializers(this, _settlementOffers_extraInitializers), __runInitializers(this, _awards_initializers, void 0));
            this.sessions = (__runInitializers(this, _awards_extraInitializers), __runInitializers(this, _sessions_initializers, void 0));
            __runInitializers(this, _sessions_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ADRProceeding");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique ADR proceeding identifier' }), sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _adrNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'ADR proceeding number' }), (0, sequelize_typescript_1.Index)({ unique: true }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _adrType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Type of ADR process', enum: ADRType }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current status', enum: ADRStatus }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _matterId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Associated matter ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _matterName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Matter name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _claimantId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Claimant party ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _claimantName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Claimant party name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _respondentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Respondent party ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _respondentName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Respondent party name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _mediatorId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Assigned mediator ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Mediator), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true })];
        _arbitratorIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Arbitrator panel IDs', isArray: true }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID),
                allowNull: false,
                defaultValue: [],
            })];
        _disputeDescription_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description of the dispute' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _amountInControversy_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Amount in controversy' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: true })];
        _arbitrationType_decorators = [(0, swagger_1.ApiPropertyOptional)({
                description: 'Arbitration type',
                enum: ArbitrationType,
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true })];
        _arbitrationRules_decorators = [(0, swagger_1.ApiPropertyOptional)({
                description: 'Applicable arbitration rules',
                enum: ArbitrationRules,
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true })];
        _sessionFormat_decorators = [(0, swagger_1.ApiProperty)({ description: 'Session format', enum: SessionFormat }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _scheduledDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Scheduled date/time' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _scheduledDuration_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Scheduled duration in hours' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true })];
        _location_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Physical location' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true })];
        _virtualMeetingLink_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Virtual meeting link' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true })];
        _confidentialityAgreementSigned_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Confidentiality agreement signed',
                default: false,
            }), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false })];
        _isBinding_decorators = [(0, swagger_1.ApiProperty)({ description: 'Binding ADR', default: false }), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false })];
        _discoveryAllowed_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discovery allowed', default: false }), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false })];
        _filingFee_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filing fee' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: true })];
        _administrativeFees_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Administrative fees' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: true })];
        _neutralFees_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Neutral fees' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: true })];
        _estimatedTotalCost_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Estimated total cost' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: true })];
        _actualTotalCost_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Actual total cost' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: true })];
        _initiationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Initiation date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _completionDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Completion date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _outcome_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Outcome description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true })];
        _settlementAmount_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Settlement amount' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: true })];
        _tags_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tags', isArray: true }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
                defaultValue: [],
            })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata', type: 'object' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false, defaultValue: {} })];
        _createdAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }), sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _updatedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }), sequelize_typescript_1.UpdatedAt, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _deletedAt_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Soft delete timestamp' }), sequelize_typescript_1.DeletedAt, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _mediator_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Mediator)];
        _settlementOffers_decorators = [(0, sequelize_typescript_1.HasMany)(() => SettlementOffer, 'adrProceedingId')];
        _awards_decorators = [(0, sequelize_typescript_1.HasMany)(() => ArbitrationAward, 'adrProceedingId')];
        _sessions_decorators = [(0, sequelize_typescript_1.HasMany)(() => ADRSession, 'adrProceedingId')];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _adrNumber_decorators, { kind: "field", name: "adrNumber", static: false, private: false, access: { has: obj => "adrNumber" in obj, get: obj => obj.adrNumber, set: (obj, value) => { obj.adrNumber = value; } }, metadata: _metadata }, _adrNumber_initializers, _adrNumber_extraInitializers);
        __esDecorate(null, null, _adrType_decorators, { kind: "field", name: "adrType", static: false, private: false, access: { has: obj => "adrType" in obj, get: obj => obj.adrType, set: (obj, value) => { obj.adrType = value; } }, metadata: _metadata }, _adrType_initializers, _adrType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
        __esDecorate(null, null, _matterName_decorators, { kind: "field", name: "matterName", static: false, private: false, access: { has: obj => "matterName" in obj, get: obj => obj.matterName, set: (obj, value) => { obj.matterName = value; } }, metadata: _metadata }, _matterName_initializers, _matterName_extraInitializers);
        __esDecorate(null, null, _claimantId_decorators, { kind: "field", name: "claimantId", static: false, private: false, access: { has: obj => "claimantId" in obj, get: obj => obj.claimantId, set: (obj, value) => { obj.claimantId = value; } }, metadata: _metadata }, _claimantId_initializers, _claimantId_extraInitializers);
        __esDecorate(null, null, _claimantName_decorators, { kind: "field", name: "claimantName", static: false, private: false, access: { has: obj => "claimantName" in obj, get: obj => obj.claimantName, set: (obj, value) => { obj.claimantName = value; } }, metadata: _metadata }, _claimantName_initializers, _claimantName_extraInitializers);
        __esDecorate(null, null, _respondentId_decorators, { kind: "field", name: "respondentId", static: false, private: false, access: { has: obj => "respondentId" in obj, get: obj => obj.respondentId, set: (obj, value) => { obj.respondentId = value; } }, metadata: _metadata }, _respondentId_initializers, _respondentId_extraInitializers);
        __esDecorate(null, null, _respondentName_decorators, { kind: "field", name: "respondentName", static: false, private: false, access: { has: obj => "respondentName" in obj, get: obj => obj.respondentName, set: (obj, value) => { obj.respondentName = value; } }, metadata: _metadata }, _respondentName_initializers, _respondentName_extraInitializers);
        __esDecorate(null, null, _mediatorId_decorators, { kind: "field", name: "mediatorId", static: false, private: false, access: { has: obj => "mediatorId" in obj, get: obj => obj.mediatorId, set: (obj, value) => { obj.mediatorId = value; } }, metadata: _metadata }, _mediatorId_initializers, _mediatorId_extraInitializers);
        __esDecorate(null, null, _arbitratorIds_decorators, { kind: "field", name: "arbitratorIds", static: false, private: false, access: { has: obj => "arbitratorIds" in obj, get: obj => obj.arbitratorIds, set: (obj, value) => { obj.arbitratorIds = value; } }, metadata: _metadata }, _arbitratorIds_initializers, _arbitratorIds_extraInitializers);
        __esDecorate(null, null, _disputeDescription_decorators, { kind: "field", name: "disputeDescription", static: false, private: false, access: { has: obj => "disputeDescription" in obj, get: obj => obj.disputeDescription, set: (obj, value) => { obj.disputeDescription = value; } }, metadata: _metadata }, _disputeDescription_initializers, _disputeDescription_extraInitializers);
        __esDecorate(null, null, _amountInControversy_decorators, { kind: "field", name: "amountInControversy", static: false, private: false, access: { has: obj => "amountInControversy" in obj, get: obj => obj.amountInControversy, set: (obj, value) => { obj.amountInControversy = value; } }, metadata: _metadata }, _amountInControversy_initializers, _amountInControversy_extraInitializers);
        __esDecorate(null, null, _arbitrationType_decorators, { kind: "field", name: "arbitrationType", static: false, private: false, access: { has: obj => "arbitrationType" in obj, get: obj => obj.arbitrationType, set: (obj, value) => { obj.arbitrationType = value; } }, metadata: _metadata }, _arbitrationType_initializers, _arbitrationType_extraInitializers);
        __esDecorate(null, null, _arbitrationRules_decorators, { kind: "field", name: "arbitrationRules", static: false, private: false, access: { has: obj => "arbitrationRules" in obj, get: obj => obj.arbitrationRules, set: (obj, value) => { obj.arbitrationRules = value; } }, metadata: _metadata }, _arbitrationRules_initializers, _arbitrationRules_extraInitializers);
        __esDecorate(null, null, _sessionFormat_decorators, { kind: "field", name: "sessionFormat", static: false, private: false, access: { has: obj => "sessionFormat" in obj, get: obj => obj.sessionFormat, set: (obj, value) => { obj.sessionFormat = value; } }, metadata: _metadata }, _sessionFormat_initializers, _sessionFormat_extraInitializers);
        __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
        __esDecorate(null, null, _scheduledDuration_decorators, { kind: "field", name: "scheduledDuration", static: false, private: false, access: { has: obj => "scheduledDuration" in obj, get: obj => obj.scheduledDuration, set: (obj, value) => { obj.scheduledDuration = value; } }, metadata: _metadata }, _scheduledDuration_initializers, _scheduledDuration_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _virtualMeetingLink_decorators, { kind: "field", name: "virtualMeetingLink", static: false, private: false, access: { has: obj => "virtualMeetingLink" in obj, get: obj => obj.virtualMeetingLink, set: (obj, value) => { obj.virtualMeetingLink = value; } }, metadata: _metadata }, _virtualMeetingLink_initializers, _virtualMeetingLink_extraInitializers);
        __esDecorate(null, null, _confidentialityAgreementSigned_decorators, { kind: "field", name: "confidentialityAgreementSigned", static: false, private: false, access: { has: obj => "confidentialityAgreementSigned" in obj, get: obj => obj.confidentialityAgreementSigned, set: (obj, value) => { obj.confidentialityAgreementSigned = value; } }, metadata: _metadata }, _confidentialityAgreementSigned_initializers, _confidentialityAgreementSigned_extraInitializers);
        __esDecorate(null, null, _isBinding_decorators, { kind: "field", name: "isBinding", static: false, private: false, access: { has: obj => "isBinding" in obj, get: obj => obj.isBinding, set: (obj, value) => { obj.isBinding = value; } }, metadata: _metadata }, _isBinding_initializers, _isBinding_extraInitializers);
        __esDecorate(null, null, _discoveryAllowed_decorators, { kind: "field", name: "discoveryAllowed", static: false, private: false, access: { has: obj => "discoveryAllowed" in obj, get: obj => obj.discoveryAllowed, set: (obj, value) => { obj.discoveryAllowed = value; } }, metadata: _metadata }, _discoveryAllowed_initializers, _discoveryAllowed_extraInitializers);
        __esDecorate(null, null, _filingFee_decorators, { kind: "field", name: "filingFee", static: false, private: false, access: { has: obj => "filingFee" in obj, get: obj => obj.filingFee, set: (obj, value) => { obj.filingFee = value; } }, metadata: _metadata }, _filingFee_initializers, _filingFee_extraInitializers);
        __esDecorate(null, null, _administrativeFees_decorators, { kind: "field", name: "administrativeFees", static: false, private: false, access: { has: obj => "administrativeFees" in obj, get: obj => obj.administrativeFees, set: (obj, value) => { obj.administrativeFees = value; } }, metadata: _metadata }, _administrativeFees_initializers, _administrativeFees_extraInitializers);
        __esDecorate(null, null, _neutralFees_decorators, { kind: "field", name: "neutralFees", static: false, private: false, access: { has: obj => "neutralFees" in obj, get: obj => obj.neutralFees, set: (obj, value) => { obj.neutralFees = value; } }, metadata: _metadata }, _neutralFees_initializers, _neutralFees_extraInitializers);
        __esDecorate(null, null, _estimatedTotalCost_decorators, { kind: "field", name: "estimatedTotalCost", static: false, private: false, access: { has: obj => "estimatedTotalCost" in obj, get: obj => obj.estimatedTotalCost, set: (obj, value) => { obj.estimatedTotalCost = value; } }, metadata: _metadata }, _estimatedTotalCost_initializers, _estimatedTotalCost_extraInitializers);
        __esDecorate(null, null, _actualTotalCost_decorators, { kind: "field", name: "actualTotalCost", static: false, private: false, access: { has: obj => "actualTotalCost" in obj, get: obj => obj.actualTotalCost, set: (obj, value) => { obj.actualTotalCost = value; } }, metadata: _metadata }, _actualTotalCost_initializers, _actualTotalCost_extraInitializers);
        __esDecorate(null, null, _initiationDate_decorators, { kind: "field", name: "initiationDate", static: false, private: false, access: { has: obj => "initiationDate" in obj, get: obj => obj.initiationDate, set: (obj, value) => { obj.initiationDate = value; } }, metadata: _metadata }, _initiationDate_initializers, _initiationDate_extraInitializers);
        __esDecorate(null, null, _completionDate_decorators, { kind: "field", name: "completionDate", static: false, private: false, access: { has: obj => "completionDate" in obj, get: obj => obj.completionDate, set: (obj, value) => { obj.completionDate = value; } }, metadata: _metadata }, _completionDate_initializers, _completionDate_extraInitializers);
        __esDecorate(null, null, _outcome_decorators, { kind: "field", name: "outcome", static: false, private: false, access: { has: obj => "outcome" in obj, get: obj => obj.outcome, set: (obj, value) => { obj.outcome = value; } }, metadata: _metadata }, _outcome_initializers, _outcome_extraInitializers);
        __esDecorate(null, null, _settlementAmount_decorators, { kind: "field", name: "settlementAmount", static: false, private: false, access: { has: obj => "settlementAmount" in obj, get: obj => obj.settlementAmount, set: (obj, value) => { obj.settlementAmount = value; } }, metadata: _metadata }, _settlementAmount_initializers, _settlementAmount_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _mediator_decorators, { kind: "field", name: "mediator", static: false, private: false, access: { has: obj => "mediator" in obj, get: obj => obj.mediator, set: (obj, value) => { obj.mediator = value; } }, metadata: _metadata }, _mediator_initializers, _mediator_extraInitializers);
        __esDecorate(null, null, _settlementOffers_decorators, { kind: "field", name: "settlementOffers", static: false, private: false, access: { has: obj => "settlementOffers" in obj, get: obj => obj.settlementOffers, set: (obj, value) => { obj.settlementOffers = value; } }, metadata: _metadata }, _settlementOffers_initializers, _settlementOffers_extraInitializers);
        __esDecorate(null, null, _awards_decorators, { kind: "field", name: "awards", static: false, private: false, access: { has: obj => "awards" in obj, get: obj => obj.awards, set: (obj, value) => { obj.awards = value; } }, metadata: _metadata }, _awards_initializers, _awards_extraInitializers);
        __esDecorate(null, null, _sessions_decorators, { kind: "field", name: "sessions", static: false, private: false, access: { has: obj => "sessions" in obj, get: obj => obj.sessions, set: (obj, value) => { obj.sessions = value; } }, metadata: _metadata }, _sessions_initializers, _sessions_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ADRProceeding = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ADRProceeding = _classThis;
})();
exports.ADRProceeding = ADRProceeding;
let SettlementOffer = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'settlement_offers',
            timestamps: true,
            underscored: true,
            indexes: [
                { fields: ['adr_proceeding_id'] },
                { fields: ['offer_number'], unique: true },
                { fields: ['status'] },
                { fields: ['response_deadline'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _adrProceedingId_decorators;
    let _adrProceedingId_initializers = [];
    let _adrProceedingId_extraInitializers = [];
    let _offerNumber_decorators;
    let _offerNumber_initializers = [];
    let _offerNumber_extraInitializers = [];
    let _offeringParty_decorators;
    let _offeringParty_initializers = [];
    let _offeringParty_extraInitializers = [];
    let _offeringPartyId_decorators;
    let _offeringPartyId_initializers = [];
    let _offeringPartyId_extraInitializers = [];
    let _receivingPartyId_decorators;
    let _receivingPartyId_initializers = [];
    let _receivingPartyId_extraInitializers = [];
    let _offerAmount_decorators;
    let _offerAmount_initializers = [];
    let _offerAmount_extraInitializers = [];
    let _structuredPayment_decorators;
    let _structuredPayment_initializers = [];
    let _structuredPayment_extraInitializers = [];
    let _paymentTerms_decorators;
    let _paymentTerms_initializers = [];
    let _paymentTerms_extraInitializers = [];
    let _nonMonetaryTerms_decorators;
    let _nonMonetaryTerms_initializers = [];
    let _nonMonetaryTerms_extraInitializers = [];
    let _conditions_decorators;
    let _conditions_initializers = [];
    let _conditions_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _proposedDate_decorators;
    let _proposedDate_initializers = [];
    let _proposedDate_extraInitializers = [];
    let _responseDeadline_decorators;
    let _responseDeadline_initializers = [];
    let _responseDeadline_extraInitializers = [];
    let _responseDate_decorators;
    let _responseDate_initializers = [];
    let _responseDate_extraInitializers = [];
    let _counterOfferAmount_decorators;
    let _counterOfferAmount_initializers = [];
    let _counterOfferAmount_extraInitializers = [];
    let _rejectionReason_decorators;
    let _rejectionReason_initializers = [];
    let _rejectionReason_extraInitializers = [];
    let _acceptedDate_decorators;
    let _acceptedDate_initializers = [];
    let _acceptedDate_extraInitializers = [];
    let _confidential_decorators;
    let _confidential_initializers = [];
    let _confidential_extraInitializers = [];
    let _validityPeriod_decorators;
    let _validityPeriod_initializers = [];
    let _validityPeriod_extraInitializers = [];
    let _relatedOfferIds_decorators;
    let _relatedOfferIds_initializers = [];
    let _relatedOfferIds_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _adrProceeding_decorators;
    let _adrProceeding_initializers = [];
    let _adrProceeding_extraInitializers = [];
    var SettlementOffer = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.adrProceedingId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _adrProceedingId_initializers, void 0));
            this.offerNumber = (__runInitializers(this, _adrProceedingId_extraInitializers), __runInitializers(this, _offerNumber_initializers, void 0));
            this.offeringParty = (__runInitializers(this, _offerNumber_extraInitializers), __runInitializers(this, _offeringParty_initializers, void 0));
            this.offeringPartyId = (__runInitializers(this, _offeringParty_extraInitializers), __runInitializers(this, _offeringPartyId_initializers, void 0));
            this.receivingPartyId = (__runInitializers(this, _offeringPartyId_extraInitializers), __runInitializers(this, _receivingPartyId_initializers, void 0));
            this.offerAmount = (__runInitializers(this, _receivingPartyId_extraInitializers), __runInitializers(this, _offerAmount_initializers, void 0));
            this.structuredPayment = (__runInitializers(this, _offerAmount_extraInitializers), __runInitializers(this, _structuredPayment_initializers, void 0));
            this.paymentTerms = (__runInitializers(this, _structuredPayment_extraInitializers), __runInitializers(this, _paymentTerms_initializers, void 0));
            this.nonMonetaryTerms = (__runInitializers(this, _paymentTerms_extraInitializers), __runInitializers(this, _nonMonetaryTerms_initializers, void 0));
            this.conditions = (__runInitializers(this, _nonMonetaryTerms_extraInitializers), __runInitializers(this, _conditions_initializers, void 0));
            this.status = (__runInitializers(this, _conditions_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.proposedDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _proposedDate_initializers, void 0));
            this.responseDeadline = (__runInitializers(this, _proposedDate_extraInitializers), __runInitializers(this, _responseDeadline_initializers, void 0));
            this.responseDate = (__runInitializers(this, _responseDeadline_extraInitializers), __runInitializers(this, _responseDate_initializers, void 0));
            this.counterOfferAmount = (__runInitializers(this, _responseDate_extraInitializers), __runInitializers(this, _counterOfferAmount_initializers, void 0));
            this.rejectionReason = (__runInitializers(this, _counterOfferAmount_extraInitializers), __runInitializers(this, _rejectionReason_initializers, void 0));
            this.acceptedDate = (__runInitializers(this, _rejectionReason_extraInitializers), __runInitializers(this, _acceptedDate_initializers, void 0));
            this.confidential = (__runInitializers(this, _acceptedDate_extraInitializers), __runInitializers(this, _confidential_initializers, void 0));
            this.validityPeriod = (__runInitializers(this, _confidential_extraInitializers), __runInitializers(this, _validityPeriod_initializers, void 0));
            this.relatedOfferIds = (__runInitializers(this, _validityPeriod_extraInitializers), __runInitializers(this, _relatedOfferIds_initializers, void 0));
            this.attachments = (__runInitializers(this, _relatedOfferIds_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.notes = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.metadata = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.adrProceeding = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _adrProceeding_initializers, void 0));
            __runInitializers(this, _adrProceeding_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SettlementOffer");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique settlement offer identifier' }), sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _adrProceedingId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Associated ADR proceeding ID' }), (0, sequelize_typescript_1.ForeignKey)(() => ADRProceeding), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _offerNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Offer number' }), (0, sequelize_typescript_1.Index)({ unique: true }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _offeringParty_decorators = [(0, swagger_1.ApiProperty)({ description: 'Offering party', enum: ['claimant', 'respondent'] }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _offeringPartyId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Offering party ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _receivingPartyId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Receiving party ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _offerAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Monetary offer amount' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: false })];
        _structuredPayment_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Structured payment option' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: true })];
        _paymentTerms_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Payment terms description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true })];
        _nonMonetaryTerms_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Non-monetary terms', isArray: true }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING), allowNull: true })];
        _conditions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Conditions of offer', isArray: true }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING), allowNull: false })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Offer status', enum: SettlementOfferStatus }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _proposedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Date offer proposed' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _responseDeadline_decorators = [(0, swagger_1.ApiProperty)({ description: 'Response deadline' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _responseDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Date of response' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _counterOfferAmount_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Counter offer amount' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: true })];
        _rejectionReason_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Rejection reason' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true })];
        _acceptedDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Date accepted' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _confidential_decorators = [(0, swagger_1.ApiProperty)({ description: 'Confidential offer', default: true }), (0, sequelize_typescript_1.Default)(true), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false })];
        _validityPeriod_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Validity period in days' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true })];
        _relatedOfferIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Related offer IDs', isArray: true }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID),
                allowNull: false,
                defaultValue: [],
            })];
        _attachments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Attachment file paths', isArray: true }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
                defaultValue: [],
            })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Internal notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false, defaultValue: '' })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata', type: 'object' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false, defaultValue: {} })];
        _createdAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }), sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _updatedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }), sequelize_typescript_1.UpdatedAt, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _adrProceeding_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ADRProceeding)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _adrProceedingId_decorators, { kind: "field", name: "adrProceedingId", static: false, private: false, access: { has: obj => "adrProceedingId" in obj, get: obj => obj.adrProceedingId, set: (obj, value) => { obj.adrProceedingId = value; } }, metadata: _metadata }, _adrProceedingId_initializers, _adrProceedingId_extraInitializers);
        __esDecorate(null, null, _offerNumber_decorators, { kind: "field", name: "offerNumber", static: false, private: false, access: { has: obj => "offerNumber" in obj, get: obj => obj.offerNumber, set: (obj, value) => { obj.offerNumber = value; } }, metadata: _metadata }, _offerNumber_initializers, _offerNumber_extraInitializers);
        __esDecorate(null, null, _offeringParty_decorators, { kind: "field", name: "offeringParty", static: false, private: false, access: { has: obj => "offeringParty" in obj, get: obj => obj.offeringParty, set: (obj, value) => { obj.offeringParty = value; } }, metadata: _metadata }, _offeringParty_initializers, _offeringParty_extraInitializers);
        __esDecorate(null, null, _offeringPartyId_decorators, { kind: "field", name: "offeringPartyId", static: false, private: false, access: { has: obj => "offeringPartyId" in obj, get: obj => obj.offeringPartyId, set: (obj, value) => { obj.offeringPartyId = value; } }, metadata: _metadata }, _offeringPartyId_initializers, _offeringPartyId_extraInitializers);
        __esDecorate(null, null, _receivingPartyId_decorators, { kind: "field", name: "receivingPartyId", static: false, private: false, access: { has: obj => "receivingPartyId" in obj, get: obj => obj.receivingPartyId, set: (obj, value) => { obj.receivingPartyId = value; } }, metadata: _metadata }, _receivingPartyId_initializers, _receivingPartyId_extraInitializers);
        __esDecorate(null, null, _offerAmount_decorators, { kind: "field", name: "offerAmount", static: false, private: false, access: { has: obj => "offerAmount" in obj, get: obj => obj.offerAmount, set: (obj, value) => { obj.offerAmount = value; } }, metadata: _metadata }, _offerAmount_initializers, _offerAmount_extraInitializers);
        __esDecorate(null, null, _structuredPayment_decorators, { kind: "field", name: "structuredPayment", static: false, private: false, access: { has: obj => "structuredPayment" in obj, get: obj => obj.structuredPayment, set: (obj, value) => { obj.structuredPayment = value; } }, metadata: _metadata }, _structuredPayment_initializers, _structuredPayment_extraInitializers);
        __esDecorate(null, null, _paymentTerms_decorators, { kind: "field", name: "paymentTerms", static: false, private: false, access: { has: obj => "paymentTerms" in obj, get: obj => obj.paymentTerms, set: (obj, value) => { obj.paymentTerms = value; } }, metadata: _metadata }, _paymentTerms_initializers, _paymentTerms_extraInitializers);
        __esDecorate(null, null, _nonMonetaryTerms_decorators, { kind: "field", name: "nonMonetaryTerms", static: false, private: false, access: { has: obj => "nonMonetaryTerms" in obj, get: obj => obj.nonMonetaryTerms, set: (obj, value) => { obj.nonMonetaryTerms = value; } }, metadata: _metadata }, _nonMonetaryTerms_initializers, _nonMonetaryTerms_extraInitializers);
        __esDecorate(null, null, _conditions_decorators, { kind: "field", name: "conditions", static: false, private: false, access: { has: obj => "conditions" in obj, get: obj => obj.conditions, set: (obj, value) => { obj.conditions = value; } }, metadata: _metadata }, _conditions_initializers, _conditions_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _proposedDate_decorators, { kind: "field", name: "proposedDate", static: false, private: false, access: { has: obj => "proposedDate" in obj, get: obj => obj.proposedDate, set: (obj, value) => { obj.proposedDate = value; } }, metadata: _metadata }, _proposedDate_initializers, _proposedDate_extraInitializers);
        __esDecorate(null, null, _responseDeadline_decorators, { kind: "field", name: "responseDeadline", static: false, private: false, access: { has: obj => "responseDeadline" in obj, get: obj => obj.responseDeadline, set: (obj, value) => { obj.responseDeadline = value; } }, metadata: _metadata }, _responseDeadline_initializers, _responseDeadline_extraInitializers);
        __esDecorate(null, null, _responseDate_decorators, { kind: "field", name: "responseDate", static: false, private: false, access: { has: obj => "responseDate" in obj, get: obj => obj.responseDate, set: (obj, value) => { obj.responseDate = value; } }, metadata: _metadata }, _responseDate_initializers, _responseDate_extraInitializers);
        __esDecorate(null, null, _counterOfferAmount_decorators, { kind: "field", name: "counterOfferAmount", static: false, private: false, access: { has: obj => "counterOfferAmount" in obj, get: obj => obj.counterOfferAmount, set: (obj, value) => { obj.counterOfferAmount = value; } }, metadata: _metadata }, _counterOfferAmount_initializers, _counterOfferAmount_extraInitializers);
        __esDecorate(null, null, _rejectionReason_decorators, { kind: "field", name: "rejectionReason", static: false, private: false, access: { has: obj => "rejectionReason" in obj, get: obj => obj.rejectionReason, set: (obj, value) => { obj.rejectionReason = value; } }, metadata: _metadata }, _rejectionReason_initializers, _rejectionReason_extraInitializers);
        __esDecorate(null, null, _acceptedDate_decorators, { kind: "field", name: "acceptedDate", static: false, private: false, access: { has: obj => "acceptedDate" in obj, get: obj => obj.acceptedDate, set: (obj, value) => { obj.acceptedDate = value; } }, metadata: _metadata }, _acceptedDate_initializers, _acceptedDate_extraInitializers);
        __esDecorate(null, null, _confidential_decorators, { kind: "field", name: "confidential", static: false, private: false, access: { has: obj => "confidential" in obj, get: obj => obj.confidential, set: (obj, value) => { obj.confidential = value; } }, metadata: _metadata }, _confidential_initializers, _confidential_extraInitializers);
        __esDecorate(null, null, _validityPeriod_decorators, { kind: "field", name: "validityPeriod", static: false, private: false, access: { has: obj => "validityPeriod" in obj, get: obj => obj.validityPeriod, set: (obj, value) => { obj.validityPeriod = value; } }, metadata: _metadata }, _validityPeriod_initializers, _validityPeriod_extraInitializers);
        __esDecorate(null, null, _relatedOfferIds_decorators, { kind: "field", name: "relatedOfferIds", static: false, private: false, access: { has: obj => "relatedOfferIds" in obj, get: obj => obj.relatedOfferIds, set: (obj, value) => { obj.relatedOfferIds = value; } }, metadata: _metadata }, _relatedOfferIds_initializers, _relatedOfferIds_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _adrProceeding_decorators, { kind: "field", name: "adrProceeding", static: false, private: false, access: { has: obj => "adrProceeding" in obj, get: obj => obj.adrProceeding, set: (obj, value) => { obj.adrProceeding = value; } }, metadata: _metadata }, _adrProceeding_initializers, _adrProceeding_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SettlementOffer = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SettlementOffer = _classThis;
})();
exports.SettlementOffer = SettlementOffer;
let ArbitrationAward = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'arbitration_awards',
            timestamps: true,
            underscored: true,
            indexes: [
                { fields: ['adr_proceeding_id'] },
                { fields: ['award_number'], unique: true },
                { fields: ['status'] },
                { fields: ['issued_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _adrProceedingId_decorators;
    let _adrProceedingId_initializers = [];
    let _adrProceedingId_extraInitializers = [];
    let _awardNumber_decorators;
    let _awardNumber_initializers = [];
    let _awardNumber_extraInitializers = [];
    let _arbitratorIds_decorators;
    let _arbitratorIds_initializers = [];
    let _arbitratorIds_extraInitializers = [];
    let _awardType_decorators;
    let _awardType_initializers = [];
    let _awardType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _issuedDate_decorators;
    let _issuedDate_initializers = [];
    let _issuedDate_extraInitializers = [];
    let _awardAmount_decorators;
    let _awardAmount_initializers = [];
    let _awardAmount_extraInitializers = [];
    let _prevailingParty_decorators;
    let _prevailingParty_initializers = [];
    let _prevailingParty_extraInitializers = [];
    let _findings_decorators;
    let _findings_initializers = [];
    let _findings_extraInitializers = [];
    let _reasoning_decorators;
    let _reasoning_initializers = [];
    let _reasoning_extraInitializers = [];
    let _costsAwarded_decorators;
    let _costsAwarded_initializers = [];
    let _costsAwarded_extraInitializers = [];
    let _costsAllocationClaimant_decorators;
    let _costsAllocationClaimant_initializers = [];
    let _costsAllocationClaimant_extraInitializers = [];
    let _costsAllocationRespondent_decorators;
    let _costsAllocationRespondent_initializers = [];
    let _costsAllocationRespondent_extraInitializers = [];
    let _interestRate_decorators;
    let _interestRate_initializers = [];
    let _interestRate_extraInitializers = [];
    let _interestStartDate_decorators;
    let _interestStartDate_initializers = [];
    let _interestStartDate_extraInitializers = [];
    let _paymentDeadline_decorators;
    let _paymentDeadline_initializers = [];
    let _paymentDeadline_extraInitializers = [];
    let _appealAllowed_decorators;
    let _appealAllowed_initializers = [];
    let _appealAllowed_extraInitializers = [];
    let _appealDeadline_decorators;
    let _appealDeadline_initializers = [];
    let _appealDeadline_extraInitializers = [];
    let _confirmationMotionDate_decorators;
    let _confirmationMotionDate_initializers = [];
    let _confirmationMotionDate_extraInitializers = [];
    let _confirmationJudgment_decorators;
    let _confirmationJudgment_initializers = [];
    let _confirmationJudgment_extraInitializers = [];
    let _vacatureMotionDate_decorators;
    let _vacatureMotionDate_initializers = [];
    let _vacatureMotionDate_extraInitializers = [];
    let _vacatureReason_decorators;
    let _vacatureReason_initializers = [];
    let _vacatureReason_extraInitializers = [];
    let _enforcementJurisdiction_decorators;
    let _enforcementJurisdiction_initializers = [];
    let _enforcementJurisdiction_extraInitializers = [];
    let _enforcementStatus_decorators;
    let _enforcementStatus_initializers = [];
    let _enforcementStatus_extraInitializers = [];
    let _satisfactionDate_decorators;
    let _satisfactionDate_initializers = [];
    let _satisfactionDate_extraInitializers = [];
    let _documentPath_decorators;
    let _documentPath_initializers = [];
    let _documentPath_extraInitializers = [];
    let _digitalSignature_decorators;
    let _digitalSignature_initializers = [];
    let _digitalSignature_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _adrProceeding_decorators;
    let _adrProceeding_initializers = [];
    let _adrProceeding_extraInitializers = [];
    var ArbitrationAward = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.adrProceedingId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _adrProceedingId_initializers, void 0));
            this.awardNumber = (__runInitializers(this, _adrProceedingId_extraInitializers), __runInitializers(this, _awardNumber_initializers, void 0));
            this.arbitratorIds = (__runInitializers(this, _awardNumber_extraInitializers), __runInitializers(this, _arbitratorIds_initializers, void 0));
            this.awardType = (__runInitializers(this, _arbitratorIds_extraInitializers), __runInitializers(this, _awardType_initializers, void 0));
            this.status = (__runInitializers(this, _awardType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.issuedDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _issuedDate_initializers, void 0));
            this.awardAmount = (__runInitializers(this, _issuedDate_extraInitializers), __runInitializers(this, _awardAmount_initializers, void 0));
            this.prevailingParty = (__runInitializers(this, _awardAmount_extraInitializers), __runInitializers(this, _prevailingParty_initializers, void 0));
            this.findings = (__runInitializers(this, _prevailingParty_extraInitializers), __runInitializers(this, _findings_initializers, void 0));
            this.reasoning = (__runInitializers(this, _findings_extraInitializers), __runInitializers(this, _reasoning_initializers, void 0));
            this.costsAwarded = (__runInitializers(this, _reasoning_extraInitializers), __runInitializers(this, _costsAwarded_initializers, void 0));
            this.costsAllocationClaimant = (__runInitializers(this, _costsAwarded_extraInitializers), __runInitializers(this, _costsAllocationClaimant_initializers, void 0));
            this.costsAllocationRespondent = (__runInitializers(this, _costsAllocationClaimant_extraInitializers), __runInitializers(this, _costsAllocationRespondent_initializers, void 0));
            this.interestRate = (__runInitializers(this, _costsAllocationRespondent_extraInitializers), __runInitializers(this, _interestRate_initializers, void 0));
            this.interestStartDate = (__runInitializers(this, _interestRate_extraInitializers), __runInitializers(this, _interestStartDate_initializers, void 0));
            this.paymentDeadline = (__runInitializers(this, _interestStartDate_extraInitializers), __runInitializers(this, _paymentDeadline_initializers, void 0));
            this.appealAllowed = (__runInitializers(this, _paymentDeadline_extraInitializers), __runInitializers(this, _appealAllowed_initializers, void 0));
            this.appealDeadline = (__runInitializers(this, _appealAllowed_extraInitializers), __runInitializers(this, _appealDeadline_initializers, void 0));
            this.confirmationMotionDate = (__runInitializers(this, _appealDeadline_extraInitializers), __runInitializers(this, _confirmationMotionDate_initializers, void 0));
            this.confirmationJudgment = (__runInitializers(this, _confirmationMotionDate_extraInitializers), __runInitializers(this, _confirmationJudgment_initializers, void 0));
            this.vacatureMotionDate = (__runInitializers(this, _confirmationJudgment_extraInitializers), __runInitializers(this, _vacatureMotionDate_initializers, void 0));
            this.vacatureReason = (__runInitializers(this, _vacatureMotionDate_extraInitializers), __runInitializers(this, _vacatureReason_initializers, void 0));
            this.enforcementJurisdiction = (__runInitializers(this, _vacatureReason_extraInitializers), __runInitializers(this, _enforcementJurisdiction_initializers, void 0));
            this.enforcementStatus = (__runInitializers(this, _enforcementJurisdiction_extraInitializers), __runInitializers(this, _enforcementStatus_initializers, void 0));
            this.satisfactionDate = (__runInitializers(this, _enforcementStatus_extraInitializers), __runInitializers(this, _satisfactionDate_initializers, void 0));
            this.documentPath = (__runInitializers(this, _satisfactionDate_extraInitializers), __runInitializers(this, _documentPath_initializers, void 0));
            this.digitalSignature = (__runInitializers(this, _documentPath_extraInitializers), __runInitializers(this, _digitalSignature_initializers, void 0));
            this.metadata = (__runInitializers(this, _digitalSignature_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.adrProceeding = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _adrProceeding_initializers, void 0));
            __runInitializers(this, _adrProceeding_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ArbitrationAward");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique award identifier' }), sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _adrProceedingId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Associated ADR proceeding ID' }), (0, sequelize_typescript_1.ForeignKey)(() => ADRProceeding), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _awardNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Award number' }), (0, sequelize_typescript_1.Index)({ unique: true }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _arbitratorIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Arbitrator panel IDs', isArray: true }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID), allowNull: false })];
        _awardType_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Type of award',
                enum: ['final', 'interim', 'partial', 'consent', 'default'],
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Award status', enum: AwardStatus }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _issuedDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Date award issued' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _awardAmount_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Monetary award amount' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: true })];
        _prevailingParty_decorators = [(0, swagger_1.ApiPropertyOptional)({
                description: 'Prevailing party',
                enum: ['claimant', 'respondent', 'split'],
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true })];
        _findings_decorators = [(0, swagger_1.ApiProperty)({ description: 'Factual findings' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _reasoning_decorators = [(0, swagger_1.ApiProperty)({ description: 'Legal reasoning' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _costsAwarded_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Costs awarded' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: true })];
        _costsAllocationClaimant_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Costs allocated to claimant' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: true })];
        _costsAllocationRespondent_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Costs allocated to respondent' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: true })];
        _interestRate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Interest rate percentage' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2), allowNull: true })];
        _interestStartDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Interest accrual start date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _paymentDeadline_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Payment deadline' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _appealAllowed_decorators = [(0, swagger_1.ApiProperty)({ description: 'Appeal allowed', default: false }), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false })];
        _appealDeadline_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Appeal deadline' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _confirmationMotionDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Confirmation motion filing date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _confirmationJudgment_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Confirmation judgment reference' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true })];
        _vacatureMotionDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Vacature motion filing date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _vacatureReason_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Vacature reason' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true })];
        _enforcementJurisdiction_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Enforcement jurisdiction' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true })];
        _enforcementStatus_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Enforcement status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true })];
        _satisfactionDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Satisfaction date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _documentPath_decorators = [(0, swagger_1.ApiProperty)({ description: 'Award document file path' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _digitalSignature_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Digital signature hash' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata', type: 'object' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false, defaultValue: {} })];
        _createdAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }), sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _updatedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }), sequelize_typescript_1.UpdatedAt, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _adrProceeding_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ADRProceeding)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _adrProceedingId_decorators, { kind: "field", name: "adrProceedingId", static: false, private: false, access: { has: obj => "adrProceedingId" in obj, get: obj => obj.adrProceedingId, set: (obj, value) => { obj.adrProceedingId = value; } }, metadata: _metadata }, _adrProceedingId_initializers, _adrProceedingId_extraInitializers);
        __esDecorate(null, null, _awardNumber_decorators, { kind: "field", name: "awardNumber", static: false, private: false, access: { has: obj => "awardNumber" in obj, get: obj => obj.awardNumber, set: (obj, value) => { obj.awardNumber = value; } }, metadata: _metadata }, _awardNumber_initializers, _awardNumber_extraInitializers);
        __esDecorate(null, null, _arbitratorIds_decorators, { kind: "field", name: "arbitratorIds", static: false, private: false, access: { has: obj => "arbitratorIds" in obj, get: obj => obj.arbitratorIds, set: (obj, value) => { obj.arbitratorIds = value; } }, metadata: _metadata }, _arbitratorIds_initializers, _arbitratorIds_extraInitializers);
        __esDecorate(null, null, _awardType_decorators, { kind: "field", name: "awardType", static: false, private: false, access: { has: obj => "awardType" in obj, get: obj => obj.awardType, set: (obj, value) => { obj.awardType = value; } }, metadata: _metadata }, _awardType_initializers, _awardType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _issuedDate_decorators, { kind: "field", name: "issuedDate", static: false, private: false, access: { has: obj => "issuedDate" in obj, get: obj => obj.issuedDate, set: (obj, value) => { obj.issuedDate = value; } }, metadata: _metadata }, _issuedDate_initializers, _issuedDate_extraInitializers);
        __esDecorate(null, null, _awardAmount_decorators, { kind: "field", name: "awardAmount", static: false, private: false, access: { has: obj => "awardAmount" in obj, get: obj => obj.awardAmount, set: (obj, value) => { obj.awardAmount = value; } }, metadata: _metadata }, _awardAmount_initializers, _awardAmount_extraInitializers);
        __esDecorate(null, null, _prevailingParty_decorators, { kind: "field", name: "prevailingParty", static: false, private: false, access: { has: obj => "prevailingParty" in obj, get: obj => obj.prevailingParty, set: (obj, value) => { obj.prevailingParty = value; } }, metadata: _metadata }, _prevailingParty_initializers, _prevailingParty_extraInitializers);
        __esDecorate(null, null, _findings_decorators, { kind: "field", name: "findings", static: false, private: false, access: { has: obj => "findings" in obj, get: obj => obj.findings, set: (obj, value) => { obj.findings = value; } }, metadata: _metadata }, _findings_initializers, _findings_extraInitializers);
        __esDecorate(null, null, _reasoning_decorators, { kind: "field", name: "reasoning", static: false, private: false, access: { has: obj => "reasoning" in obj, get: obj => obj.reasoning, set: (obj, value) => { obj.reasoning = value; } }, metadata: _metadata }, _reasoning_initializers, _reasoning_extraInitializers);
        __esDecorate(null, null, _costsAwarded_decorators, { kind: "field", name: "costsAwarded", static: false, private: false, access: { has: obj => "costsAwarded" in obj, get: obj => obj.costsAwarded, set: (obj, value) => { obj.costsAwarded = value; } }, metadata: _metadata }, _costsAwarded_initializers, _costsAwarded_extraInitializers);
        __esDecorate(null, null, _costsAllocationClaimant_decorators, { kind: "field", name: "costsAllocationClaimant", static: false, private: false, access: { has: obj => "costsAllocationClaimant" in obj, get: obj => obj.costsAllocationClaimant, set: (obj, value) => { obj.costsAllocationClaimant = value; } }, metadata: _metadata }, _costsAllocationClaimant_initializers, _costsAllocationClaimant_extraInitializers);
        __esDecorate(null, null, _costsAllocationRespondent_decorators, { kind: "field", name: "costsAllocationRespondent", static: false, private: false, access: { has: obj => "costsAllocationRespondent" in obj, get: obj => obj.costsAllocationRespondent, set: (obj, value) => { obj.costsAllocationRespondent = value; } }, metadata: _metadata }, _costsAllocationRespondent_initializers, _costsAllocationRespondent_extraInitializers);
        __esDecorate(null, null, _interestRate_decorators, { kind: "field", name: "interestRate", static: false, private: false, access: { has: obj => "interestRate" in obj, get: obj => obj.interestRate, set: (obj, value) => { obj.interestRate = value; } }, metadata: _metadata }, _interestRate_initializers, _interestRate_extraInitializers);
        __esDecorate(null, null, _interestStartDate_decorators, { kind: "field", name: "interestStartDate", static: false, private: false, access: { has: obj => "interestStartDate" in obj, get: obj => obj.interestStartDate, set: (obj, value) => { obj.interestStartDate = value; } }, metadata: _metadata }, _interestStartDate_initializers, _interestStartDate_extraInitializers);
        __esDecorate(null, null, _paymentDeadline_decorators, { kind: "field", name: "paymentDeadline", static: false, private: false, access: { has: obj => "paymentDeadline" in obj, get: obj => obj.paymentDeadline, set: (obj, value) => { obj.paymentDeadline = value; } }, metadata: _metadata }, _paymentDeadline_initializers, _paymentDeadline_extraInitializers);
        __esDecorate(null, null, _appealAllowed_decorators, { kind: "field", name: "appealAllowed", static: false, private: false, access: { has: obj => "appealAllowed" in obj, get: obj => obj.appealAllowed, set: (obj, value) => { obj.appealAllowed = value; } }, metadata: _metadata }, _appealAllowed_initializers, _appealAllowed_extraInitializers);
        __esDecorate(null, null, _appealDeadline_decorators, { kind: "field", name: "appealDeadline", static: false, private: false, access: { has: obj => "appealDeadline" in obj, get: obj => obj.appealDeadline, set: (obj, value) => { obj.appealDeadline = value; } }, metadata: _metadata }, _appealDeadline_initializers, _appealDeadline_extraInitializers);
        __esDecorate(null, null, _confirmationMotionDate_decorators, { kind: "field", name: "confirmationMotionDate", static: false, private: false, access: { has: obj => "confirmationMotionDate" in obj, get: obj => obj.confirmationMotionDate, set: (obj, value) => { obj.confirmationMotionDate = value; } }, metadata: _metadata }, _confirmationMotionDate_initializers, _confirmationMotionDate_extraInitializers);
        __esDecorate(null, null, _confirmationJudgment_decorators, { kind: "field", name: "confirmationJudgment", static: false, private: false, access: { has: obj => "confirmationJudgment" in obj, get: obj => obj.confirmationJudgment, set: (obj, value) => { obj.confirmationJudgment = value; } }, metadata: _metadata }, _confirmationJudgment_initializers, _confirmationJudgment_extraInitializers);
        __esDecorate(null, null, _vacatureMotionDate_decorators, { kind: "field", name: "vacatureMotionDate", static: false, private: false, access: { has: obj => "vacatureMotionDate" in obj, get: obj => obj.vacatureMotionDate, set: (obj, value) => { obj.vacatureMotionDate = value; } }, metadata: _metadata }, _vacatureMotionDate_initializers, _vacatureMotionDate_extraInitializers);
        __esDecorate(null, null, _vacatureReason_decorators, { kind: "field", name: "vacatureReason", static: false, private: false, access: { has: obj => "vacatureReason" in obj, get: obj => obj.vacatureReason, set: (obj, value) => { obj.vacatureReason = value; } }, metadata: _metadata }, _vacatureReason_initializers, _vacatureReason_extraInitializers);
        __esDecorate(null, null, _enforcementJurisdiction_decorators, { kind: "field", name: "enforcementJurisdiction", static: false, private: false, access: { has: obj => "enforcementJurisdiction" in obj, get: obj => obj.enforcementJurisdiction, set: (obj, value) => { obj.enforcementJurisdiction = value; } }, metadata: _metadata }, _enforcementJurisdiction_initializers, _enforcementJurisdiction_extraInitializers);
        __esDecorate(null, null, _enforcementStatus_decorators, { kind: "field", name: "enforcementStatus", static: false, private: false, access: { has: obj => "enforcementStatus" in obj, get: obj => obj.enforcementStatus, set: (obj, value) => { obj.enforcementStatus = value; } }, metadata: _metadata }, _enforcementStatus_initializers, _enforcementStatus_extraInitializers);
        __esDecorate(null, null, _satisfactionDate_decorators, { kind: "field", name: "satisfactionDate", static: false, private: false, access: { has: obj => "satisfactionDate" in obj, get: obj => obj.satisfactionDate, set: (obj, value) => { obj.satisfactionDate = value; } }, metadata: _metadata }, _satisfactionDate_initializers, _satisfactionDate_extraInitializers);
        __esDecorate(null, null, _documentPath_decorators, { kind: "field", name: "documentPath", static: false, private: false, access: { has: obj => "documentPath" in obj, get: obj => obj.documentPath, set: (obj, value) => { obj.documentPath = value; } }, metadata: _metadata }, _documentPath_initializers, _documentPath_extraInitializers);
        __esDecorate(null, null, _digitalSignature_decorators, { kind: "field", name: "digitalSignature", static: false, private: false, access: { has: obj => "digitalSignature" in obj, get: obj => obj.digitalSignature, set: (obj, value) => { obj.digitalSignature = value; } }, metadata: _metadata }, _digitalSignature_initializers, _digitalSignature_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _adrProceeding_decorators, { kind: "field", name: "adrProceeding", static: false, private: false, access: { has: obj => "adrProceeding" in obj, get: obj => obj.adrProceeding, set: (obj, value) => { obj.adrProceeding = value; } }, metadata: _metadata }, _adrProceeding_initializers, _adrProceeding_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ArbitrationAward = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ArbitrationAward = _classThis;
})();
exports.ArbitrationAward = ArbitrationAward;
let ADRSession = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'adr_sessions',
            timestamps: true,
            underscored: true,
            indexes: [
                { fields: ['adr_proceeding_id'] },
                { fields: ['session_date'] },
                { fields: ['session_number'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _adrProceedingId_decorators;
    let _adrProceedingId_initializers = [];
    let _adrProceedingId_extraInitializers = [];
    let _sessionNumber_decorators;
    let _sessionNumber_initializers = [];
    let _sessionNumber_extraInitializers = [];
    let _sessionDate_decorators;
    let _sessionDate_initializers = [];
    let _sessionDate_extraInitializers = [];
    let _duration_decorators;
    let _duration_initializers = [];
    let _duration_extraInitializers = [];
    let _format_decorators;
    let _format_initializers = [];
    let _format_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _virtualMeetingLink_decorators;
    let _virtualMeetingLink_initializers = [];
    let _virtualMeetingLink_extraInitializers = [];
    let _attendees_decorators;
    let _attendees_initializers = [];
    let _attendees_extraInitializers = [];
    let _mediatorNotes_decorators;
    let _mediatorNotes_initializers = [];
    let _mediatorNotes_extraInitializers = [];
    let _progressNotes_decorators;
    let _progressNotes_initializers = [];
    let _progressNotes_extraInitializers = [];
    let _nextSteps_decorators;
    let _nextSteps_initializers = [];
    let _nextSteps_extraInitializers = [];
    let _documentsExchanged_decorators;
    let _documentsExchanged_initializers = [];
    let _documentsExchanged_extraInitializers = [];
    let _settlementDiscussed_decorators;
    let _settlementDiscussed_initializers = [];
    let _settlementDiscussed_extraInitializers = [];
    let _settlementRange_decorators;
    let _settlementRange_initializers = [];
    let _settlementRange_extraInitializers = [];
    let _nextSessionDate_decorators;
    let _nextSessionDate_initializers = [];
    let _nextSessionDate_extraInitializers = [];
    let _caucusHeld_decorators;
    let _caucusHeld_initializers = [];
    let _caucusHeld_extraInitializers = [];
    let _caucusDuration_decorators;
    let _caucusDuration_initializers = [];
    let _caucusDuration_extraInitializers = [];
    let _isSuccessful_decorators;
    let _isSuccessful_initializers = [];
    let _isSuccessful_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _adrProceeding_decorators;
    let _adrProceeding_initializers = [];
    let _adrProceeding_extraInitializers = [];
    var ADRSession = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.adrProceedingId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _adrProceedingId_initializers, void 0));
            this.sessionNumber = (__runInitializers(this, _adrProceedingId_extraInitializers), __runInitializers(this, _sessionNumber_initializers, void 0));
            this.sessionDate = (__runInitializers(this, _sessionNumber_extraInitializers), __runInitializers(this, _sessionDate_initializers, void 0));
            this.duration = (__runInitializers(this, _sessionDate_extraInitializers), __runInitializers(this, _duration_initializers, void 0));
            this.format = (__runInitializers(this, _duration_extraInitializers), __runInitializers(this, _format_initializers, void 0));
            this.location = (__runInitializers(this, _format_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.virtualMeetingLink = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _virtualMeetingLink_initializers, void 0));
            this.attendees = (__runInitializers(this, _virtualMeetingLink_extraInitializers), __runInitializers(this, _attendees_initializers, void 0));
            this.mediatorNotes = (__runInitializers(this, _attendees_extraInitializers), __runInitializers(this, _mediatorNotes_initializers, void 0));
            this.progressNotes = (__runInitializers(this, _mediatorNotes_extraInitializers), __runInitializers(this, _progressNotes_initializers, void 0));
            this.nextSteps = (__runInitializers(this, _progressNotes_extraInitializers), __runInitializers(this, _nextSteps_initializers, void 0));
            this.documentsExchanged = (__runInitializers(this, _nextSteps_extraInitializers), __runInitializers(this, _documentsExchanged_initializers, void 0));
            this.settlementDiscussed = (__runInitializers(this, _documentsExchanged_extraInitializers), __runInitializers(this, _settlementDiscussed_initializers, void 0));
            this.settlementRange = (__runInitializers(this, _settlementDiscussed_extraInitializers), __runInitializers(this, _settlementRange_initializers, void 0));
            this.nextSessionDate = (__runInitializers(this, _settlementRange_extraInitializers), __runInitializers(this, _nextSessionDate_initializers, void 0));
            this.caucusHeld = (__runInitializers(this, _nextSessionDate_extraInitializers), __runInitializers(this, _caucusHeld_initializers, void 0));
            this.caucusDuration = (__runInitializers(this, _caucusHeld_extraInitializers), __runInitializers(this, _caucusDuration_initializers, void 0));
            this.isSuccessful = (__runInitializers(this, _caucusDuration_extraInitializers), __runInitializers(this, _isSuccessful_initializers, void 0));
            this.metadata = (__runInitializers(this, _isSuccessful_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.adrProceeding = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _adrProceeding_initializers, void 0));
            __runInitializers(this, _adrProceeding_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ADRSession");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique session identifier' }), sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _adrProceedingId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Associated ADR proceeding ID' }), (0, sequelize_typescript_1.ForeignKey)(() => ADRProceeding), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _sessionNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Session number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _sessionDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Session date/time' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _duration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Duration in hours' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _format_decorators = [(0, swagger_1.ApiProperty)({ description: 'Session format', enum: SessionFormat }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _location_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Physical location' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true })];
        _virtualMeetingLink_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Virtual meeting link' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true })];
        _attendees_decorators = [(0, swagger_1.ApiProperty)({ description: 'Attendee IDs', isArray: true }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING), allowNull: false })];
        _mediatorNotes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Mediator confidential notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true })];
        _progressNotes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Progress notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false, defaultValue: '' })];
        _nextSteps_decorators = [(0, swagger_1.ApiProperty)({ description: 'Next steps', isArray: true }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
                defaultValue: [],
            })];
        _documentsExchanged_decorators = [(0, swagger_1.ApiProperty)({ description: 'Documents exchanged', isArray: true }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
                defaultValue: [],
            })];
        _settlementDiscussed_decorators = [(0, swagger_1.ApiProperty)({ description: 'Settlement discussed', default: false }), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false })];
        _settlementRange_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Settlement range discussed' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: true })];
        _nextSessionDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Next session scheduled date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _caucusHeld_decorators = [(0, swagger_1.ApiProperty)({ description: 'Caucus held', default: false }), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false })];
        _caucusDuration_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Caucus duration in minutes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true })];
        _isSuccessful_decorators = [(0, swagger_1.ApiProperty)({ description: 'Session successful', default: false }), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata', type: 'object' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false, defaultValue: {} })];
        _createdAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }), sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _updatedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }), sequelize_typescript_1.UpdatedAt, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _adrProceeding_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ADRProceeding)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _adrProceedingId_decorators, { kind: "field", name: "adrProceedingId", static: false, private: false, access: { has: obj => "adrProceedingId" in obj, get: obj => obj.adrProceedingId, set: (obj, value) => { obj.adrProceedingId = value; } }, metadata: _metadata }, _adrProceedingId_initializers, _adrProceedingId_extraInitializers);
        __esDecorate(null, null, _sessionNumber_decorators, { kind: "field", name: "sessionNumber", static: false, private: false, access: { has: obj => "sessionNumber" in obj, get: obj => obj.sessionNumber, set: (obj, value) => { obj.sessionNumber = value; } }, metadata: _metadata }, _sessionNumber_initializers, _sessionNumber_extraInitializers);
        __esDecorate(null, null, _sessionDate_decorators, { kind: "field", name: "sessionDate", static: false, private: false, access: { has: obj => "sessionDate" in obj, get: obj => obj.sessionDate, set: (obj, value) => { obj.sessionDate = value; } }, metadata: _metadata }, _sessionDate_initializers, _sessionDate_extraInitializers);
        __esDecorate(null, null, _duration_decorators, { kind: "field", name: "duration", static: false, private: false, access: { has: obj => "duration" in obj, get: obj => obj.duration, set: (obj, value) => { obj.duration = value; } }, metadata: _metadata }, _duration_initializers, _duration_extraInitializers);
        __esDecorate(null, null, _format_decorators, { kind: "field", name: "format", static: false, private: false, access: { has: obj => "format" in obj, get: obj => obj.format, set: (obj, value) => { obj.format = value; } }, metadata: _metadata }, _format_initializers, _format_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _virtualMeetingLink_decorators, { kind: "field", name: "virtualMeetingLink", static: false, private: false, access: { has: obj => "virtualMeetingLink" in obj, get: obj => obj.virtualMeetingLink, set: (obj, value) => { obj.virtualMeetingLink = value; } }, metadata: _metadata }, _virtualMeetingLink_initializers, _virtualMeetingLink_extraInitializers);
        __esDecorate(null, null, _attendees_decorators, { kind: "field", name: "attendees", static: false, private: false, access: { has: obj => "attendees" in obj, get: obj => obj.attendees, set: (obj, value) => { obj.attendees = value; } }, metadata: _metadata }, _attendees_initializers, _attendees_extraInitializers);
        __esDecorate(null, null, _mediatorNotes_decorators, { kind: "field", name: "mediatorNotes", static: false, private: false, access: { has: obj => "mediatorNotes" in obj, get: obj => obj.mediatorNotes, set: (obj, value) => { obj.mediatorNotes = value; } }, metadata: _metadata }, _mediatorNotes_initializers, _mediatorNotes_extraInitializers);
        __esDecorate(null, null, _progressNotes_decorators, { kind: "field", name: "progressNotes", static: false, private: false, access: { has: obj => "progressNotes" in obj, get: obj => obj.progressNotes, set: (obj, value) => { obj.progressNotes = value; } }, metadata: _metadata }, _progressNotes_initializers, _progressNotes_extraInitializers);
        __esDecorate(null, null, _nextSteps_decorators, { kind: "field", name: "nextSteps", static: false, private: false, access: { has: obj => "nextSteps" in obj, get: obj => obj.nextSteps, set: (obj, value) => { obj.nextSteps = value; } }, metadata: _metadata }, _nextSteps_initializers, _nextSteps_extraInitializers);
        __esDecorate(null, null, _documentsExchanged_decorators, { kind: "field", name: "documentsExchanged", static: false, private: false, access: { has: obj => "documentsExchanged" in obj, get: obj => obj.documentsExchanged, set: (obj, value) => { obj.documentsExchanged = value; } }, metadata: _metadata }, _documentsExchanged_initializers, _documentsExchanged_extraInitializers);
        __esDecorate(null, null, _settlementDiscussed_decorators, { kind: "field", name: "settlementDiscussed", static: false, private: false, access: { has: obj => "settlementDiscussed" in obj, get: obj => obj.settlementDiscussed, set: (obj, value) => { obj.settlementDiscussed = value; } }, metadata: _metadata }, _settlementDiscussed_initializers, _settlementDiscussed_extraInitializers);
        __esDecorate(null, null, _settlementRange_decorators, { kind: "field", name: "settlementRange", static: false, private: false, access: { has: obj => "settlementRange" in obj, get: obj => obj.settlementRange, set: (obj, value) => { obj.settlementRange = value; } }, metadata: _metadata }, _settlementRange_initializers, _settlementRange_extraInitializers);
        __esDecorate(null, null, _nextSessionDate_decorators, { kind: "field", name: "nextSessionDate", static: false, private: false, access: { has: obj => "nextSessionDate" in obj, get: obj => obj.nextSessionDate, set: (obj, value) => { obj.nextSessionDate = value; } }, metadata: _metadata }, _nextSessionDate_initializers, _nextSessionDate_extraInitializers);
        __esDecorate(null, null, _caucusHeld_decorators, { kind: "field", name: "caucusHeld", static: false, private: false, access: { has: obj => "caucusHeld" in obj, get: obj => obj.caucusHeld, set: (obj, value) => { obj.caucusHeld = value; } }, metadata: _metadata }, _caucusHeld_initializers, _caucusHeld_extraInitializers);
        __esDecorate(null, null, _caucusDuration_decorators, { kind: "field", name: "caucusDuration", static: false, private: false, access: { has: obj => "caucusDuration" in obj, get: obj => obj.caucusDuration, set: (obj, value) => { obj.caucusDuration = value; } }, metadata: _metadata }, _caucusDuration_initializers, _caucusDuration_extraInitializers);
        __esDecorate(null, null, _isSuccessful_decorators, { kind: "field", name: "isSuccessful", static: false, private: false, access: { has: obj => "isSuccessful" in obj, get: obj => obj.isSuccessful, set: (obj, value) => { obj.isSuccessful = value; } }, metadata: _metadata }, _isSuccessful_initializers, _isSuccessful_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _adrProceeding_decorators, { kind: "field", name: "adrProceeding", static: false, private: false, access: { has: obj => "adrProceeding" in obj, get: obj => obj.adrProceeding, set: (obj, value) => { obj.adrProceeding = value; } }, metadata: _metadata }, _adrProceeding_initializers, _adrProceeding_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ADRSession = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ADRSession = _classThis;
})();
exports.ADRSession = ADRSession;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Generates unique ADR proceeding number
 */
function generateADRNumber(prefix = 'ADR') {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}
/**
 * Generates unique settlement offer number
 */
function generateOfferNumber(adrNumber, sequence) {
    return `${adrNumber}-OFFER-${sequence.toString().padStart(3, '0')}`;
}
/**
 * Generates unique arbitration award number
 */
function generateAwardNumber(adrNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    return `${adrNumber}-AWARD-${timestamp}`;
}
/**
 * Calculates mediator conflict score
 */
function calculateConflictScore(mediatorConflictIds, partyIds) {
    const conflicts = partyIds.filter((id) => mediatorConflictIds.includes(id));
    return conflicts.length / partyIds.length;
}
/**
 * Ranks mediators by suitability
 */
function rankMediatorsBySuitability(mediators, criteria) {
    return mediators
        .filter((m) => {
        if (!m.isActive)
            return false;
        if (criteria.maxRate && m.hourlyRate > criteria.maxRate)
            return false;
        if (criteria.jurisdiction && !m.jurisdictions.includes(criteria.jurisdiction))
            return false;
        if (criteria.specialization && !m.specializations.includes(criteria.specialization))
            return false;
        const conflictScore = calculateConflictScore(m.conflictCheckIds, criteria.partyIds);
        return conflictScore === 0;
    })
        .sort((a, b) => {
        const scoreA = (a.successRate || 0) + a.yearsExperience * 0.5 + (a.rating || 0) * 10;
        const scoreB = (b.successRate || 0) + b.yearsExperience * 0.5 + (b.rating || 0) * 10;
        return scoreB - scoreA;
    });
}
// ============================================================================
// NESTJS SERVICES
// ============================================================================
/**
 * Mediator Selection Service
 * Manages mediator profiles and selection algorithms
 */
let MediatorSelectionService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var MediatorSelectionService = _classThis = class {
        constructor(mediatorRepository) {
            this.mediatorRepository = mediatorRepository;
            this.logger = new common_1.Logger(MediatorSelectionService.name);
        }
        /**
         * Creates a new mediator profile
         */
        async createMediator(data) {
            try {
                const validated = exports.CreateMediatorSchema.parse(data);
                const mediator = await this.mediatorRepository.create({
                    ...validated,
                    totalCasesMediated: 0,
                    conflictCheckIds: [],
                    isActive: true,
                    availability: {},
                    metadata: {},
                });
                this.logger.log(`Created mediator: ${mediator.id}`);
                return mediator;
            }
            catch (error) {
                this.logger.error('Failed to create mediator', error);
                throw new common_1.BadRequestException('Failed to create mediator');
            }
        }
        /**
         * Finds qualified mediators based on criteria
         */
        async findQualifiedMediators(criteria) {
            try {
                const whereClause = { isActive: true };
                if (criteria.jurisdiction) {
                    whereClause.jurisdictions = { [sequelize_1.Op.contains]: [criteria.jurisdiction] };
                }
                if (criteria.specialization) {
                    whereClause.specializations = { [sequelize_1.Op.contains]: [criteria.specialization] };
                }
                if (criteria.certifications) {
                    whereClause.certifications = { [sequelize_1.Op.overlap]: criteria.certifications };
                }
                if (criteria.maxRate) {
                    whereClause.hourlyRate = { [sequelize_1.Op.lte]: criteria.maxRate };
                }
                if (criteria.minExperience) {
                    whereClause.yearsExperience = { [sequelize_1.Op.gte]: criteria.minExperience };
                }
                const mediators = await this.mediatorRepository.findAll({ where: whereClause });
                return rankMediatorsBySuitability(mediators, criteria);
            }
            catch (error) {
                this.logger.error('Failed to find qualified mediators', error);
                throw new common_1.InternalServerErrorException('Failed to find qualified mediators');
            }
        }
        /**
         * Performs conflict check for mediator
         */
        async performConflictCheck(mediatorId, partyIds) {
            try {
                const mediator = await this.mediatorRepository.findByPk(mediatorId);
                if (!mediator) {
                    throw new common_1.NotFoundException('Mediator not found');
                }
                const conflictingParties = partyIds.filter((id) => mediator.conflictCheckIds.includes(id));
                return {
                    hasConflict: conflictingParties.length > 0,
                    conflictingParties,
                };
            }
            catch (error) {
                this.logger.error('Conflict check failed', error);
                throw error;
            }
        }
        /**
         * Updates mediator availability calendar
         */
        async updateAvailability(mediatorId, availability) {
            try {
                const mediator = await this.mediatorRepository.findByPk(mediatorId);
                if (!mediator) {
                    throw new common_1.NotFoundException('Mediator not found');
                }
                await mediator.update({ availability });
                return mediator;
            }
            catch (error) {
                this.logger.error('Failed to update availability', error);
                throw error;
            }
        }
        /**
         * Calculates mediator success metrics
         */
        async calculateMediatorMetrics(mediatorId) {
            try {
                const proceedings = await ADRProceeding.findAll({
                    where: { mediatorId, status: { [sequelize_1.Op.in]: [ADRStatus.SETTLEMENT_REACHED, ADRStatus.COMPLETED] } },
                });
                const totalCases = proceedings.length;
                const settledCases = proceedings.filter((p) => p.status === ADRStatus.SETTLEMENT_REACHED).length;
                const successRate = totalCases > 0 ? (settledCases / totalCases) * 100 : 0;
                const resolutionTimes = proceedings
                    .filter((p) => p.completionDate)
                    .map((p) => (0, date_fns_1.differenceInDays)(p.completionDate, p.initiationDate));
                const averageResolutionTime = resolutionTimes.length > 0
                    ? resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length
                    : 0;
                return { successRate, averageResolutionTime, totalCases };
            }
            catch (error) {
                this.logger.error('Failed to calculate mediator metrics', error);
                throw new common_1.InternalServerErrorException('Failed to calculate metrics');
            }
        }
        /**
         * Validates mediator certification and renewal status
         */
        async validateMediatorCertification(mediatorId) {
            try {
                const mediator = await this.mediatorRepository.findByPk(mediatorId);
                if (!mediator) {
                    throw new common_1.NotFoundException('Mediator not found');
                }
                const expiringCertifications = [];
                const certificationExpiryDates = mediator.metadata?.certificationExpiry || {};
                Object.entries(certificationExpiryDates).forEach(([cert, expiryDate]) => {
                    const daysUntilExpiry = (0, date_fns_1.differenceInDays)(new Date(expiryDate), new Date());
                    if (daysUntilExpiry < 90) {
                        expiringCertifications.push(cert);
                    }
                });
                return {
                    isValid: mediator.isActive && mediator.certifications.length > 0,
                    certifications: mediator.certifications,
                    expiringCertifications,
                    renewalRequired: expiringCertifications.length > 0,
                };
            }
            catch (error) {
                this.logger.error('Failed to validate certification', error);
                throw error;
            }
        }
        /**
         * Searches mediators by party preferences
         */
        async searchMediatorsByPreference(preferences) {
            try {
                const whereClause = { isActive: true };
                if (preferences.preferredLanguage) {
                    whereClause.languages = { [sequelize_1.Op.contains]: [preferences.preferredLanguage] };
                }
                const mediators = await this.mediatorRepository.findAll({ where: whereClause });
                return mediators.filter((m) => {
                    if (preferences.preferredStyle && m.metadata?.mediationStyle !== preferences.preferredStyle) {
                        return false;
                    }
                    if (preferences.preferredGender && m.metadata?.gender !== preferences.preferredGender) {
                        return false;
                    }
                    if (preferences.industryExperience && !m.specializations.includes(preferences.industryExperience)) {
                        return false;
                    }
                    if (preferences.virtualCapable && !m.metadata?.virtualCapable) {
                        return false;
                    }
                    return true;
                });
            }
            catch (error) {
                this.logger.error('Failed to search by preferences', error);
                throw new common_1.InternalServerErrorException('Failed to search by preferences');
            }
        }
        /**
         * Compares mediator costs and generates cost analysis
         */
        async compareMediatorCosts(mediatorIds) {
            try {
                const mediators = await this.mediatorRepository.findAll({
                    where: { id: { [sequelize_1.Op.in]: mediatorIds } },
                });
                const estimatedSessionHours = 8;
                return mediators.map((m) => {
                    const estimatedCost = m.hourlyRate * estimatedSessionHours;
                    const valueScore = (m.successRate || 0) / (m.hourlyRate / 100);
                    return {
                        mediatorId: m.id,
                        name: `${m.firstName} ${m.lastName}`,
                        hourlyRate: m.hourlyRate,
                        estimatedCost,
                        valueScore,
                    };
                }).sort((a, b) => b.valueScore - a.valueScore);
            }
            catch (error) {
                this.logger.error('Failed to compare costs', error);
                throw new common_1.InternalServerErrorException('Failed to compare costs');
            }
        }
    };
    __setFunctionName(_classThis, "MediatorSelectionService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MediatorSelectionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MediatorSelectionService = _classThis;
})();
exports.MediatorSelectionService = MediatorSelectionService;
/**
 * ADR Proceeding Management Service
 * Manages ADR proceedings lifecycle
 */
let ADRProceedingService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ADRProceedingService = _classThis = class {
        constructor(adrRepository, mediatorRepository) {
            this.adrRepository = adrRepository;
            this.mediatorRepository = mediatorRepository;
            this.logger = new common_1.Logger(ADRProceedingService.name);
        }
        /**
         * Initiates a new ADR proceeding
         */
        async initiateADRProceeding(data) {
            try {
                const validated = exports.CreateADRProceedingSchema.parse(data);
                const adrNumber = generateADRNumber();
                const proceeding = await this.adrRepository.create({
                    ...validated,
                    adrNumber,
                    status: ADRStatus.INITIATED,
                    initiationDate: new Date(),
                    arbitratorIds: [],
                    confidentialityAgreementSigned: false,
                    discoveryAllowed: false,
                    tags: [],
                    metadata: {},
                });
                this.logger.log(`Initiated ADR proceeding: ${proceeding.adrNumber}`);
                return proceeding;
            }
            catch (error) {
                this.logger.error('Failed to initiate ADR proceeding', error);
                throw new common_1.BadRequestException('Failed to initiate ADR proceeding');
            }
        }
        /**
         * Assigns mediator to proceeding
         */
        async assignMediator(proceedingId, mediatorId) {
            try {
                const proceeding = await this.adrRepository.findByPk(proceedingId);
                if (!proceeding) {
                    throw new common_1.NotFoundException('ADR proceeding not found');
                }
                const mediator = await this.mediatorRepository.findByPk(mediatorId);
                if (!mediator) {
                    throw new common_1.NotFoundException('Mediator not found');
                }
                await proceeding.update({
                    mediatorId,
                    status: ADRStatus.SCHEDULED,
                });
                this.logger.log(`Assigned mediator ${mediatorId} to ${proceeding.adrNumber}`);
                return proceeding;
            }
            catch (error) {
                this.logger.error('Failed to assign mediator', error);
                throw error;
            }
        }
        /**
         * Schedules ADR session
         */
        async scheduleSession(proceedingId, sessionData) {
            try {
                const proceeding = await this.adrRepository.findByPk(proceedingId);
                if (!proceeding) {
                    throw new common_1.NotFoundException('ADR proceeding not found');
                }
                await proceeding.update({
                    ...sessionData,
                    status: ADRStatus.SCHEDULED,
                });
                this.logger.log(`Scheduled session for ${proceeding.adrNumber}`);
                return proceeding;
            }
            catch (error) {
                this.logger.error('Failed to schedule session', error);
                throw error;
            }
        }
        /**
         * Updates proceeding status
         */
        async updateStatus(proceedingId, status) {
            try {
                const proceeding = await this.adrRepository.findByPk(proceedingId);
                if (!proceeding) {
                    throw new common_1.NotFoundException('ADR proceeding not found');
                }
                const updates = { status };
                if (status === ADRStatus.COMPLETED || status === ADRStatus.SETTLEMENT_REACHED) {
                    updates.completionDate = new Date();
                }
                await proceeding.update(updates);
                this.logger.log(`Updated status of ${proceeding.adrNumber} to ${status}`);
                return proceeding;
            }
            catch (error) {
                this.logger.error('Failed to update status', error);
                throw error;
            }
        }
        /**
         * Calculates estimated ADR costs
         */
        async calculateEstimatedCosts(proceedingId) {
            try {
                const proceeding = await this.adrRepository.findByPk(proceedingId, {
                    include: [Mediator],
                });
                if (!proceeding) {
                    throw new common_1.NotFoundException('ADR proceeding not found');
                }
                const filingFee = proceeding.adrType === ADRType.ARBITRATION ? 1500 : 500;
                const administrativeFees = 1000;
                let neutralFees = 0;
                if (proceeding.mediator) {
                    const estimatedHours = proceeding.scheduledDuration || 8;
                    neutralFees = proceeding.mediator.hourlyRate * estimatedHours;
                }
                const estimatedTotal = filingFee + administrativeFees + neutralFees;
                await proceeding.update({
                    filingFee,
                    administrativeFees,
                    neutralFees,
                    estimatedTotalCost: estimatedTotal,
                });
                return { filingFee, administrativeFees, neutralFees, estimatedTotal };
            }
            catch (error) {
                this.logger.error('Failed to calculate costs', error);
                throw error;
            }
        }
        /**
         * Generates virtual meeting link for ADR session
         */
        async generateVirtualMeetingLink(proceedingId) {
            try {
                const proceeding = await this.adrRepository.findByPk(proceedingId);
                if (!proceeding) {
                    throw new common_1.NotFoundException('ADR proceeding not found');
                }
                const meetingId = crypto.randomBytes(8).toString('hex');
                const passcode = Math.random().toString(36).substring(2, 10).toUpperCase();
                const meetingLink = `https://adr-virtual.whitecross.com/meeting/${meetingId}?pwd=${passcode}`;
                await proceeding.update({ virtualMeetingLink: meetingLink });
                this.logger.log(`Generated virtual meeting link for ${proceeding.adrNumber}`);
                return { meetingLink, meetingId, passcode };
            }
            catch (error) {
                this.logger.error('Failed to generate meeting link', error);
                throw error;
            }
        }
        /**
         * Sends ADR notifications to parties
         */
        async sendADRNotifications(proceedingId, notificationType) {
            try {
                const proceeding = await this.adrRepository.findByPk(proceedingId);
                if (!proceeding) {
                    throw new common_1.NotFoundException('ADR proceeding not found');
                }
                const recipients = [proceeding.claimantId, proceeding.respondentId];
                if (proceeding.mediatorId) {
                    recipients.push(proceeding.mediatorId);
                }
                this.logger.log(`Sent ${notificationType} notifications for ${proceeding.adrNumber}`);
                return { sent: true, recipients };
            }
            catch (error) {
                this.logger.error('Failed to send notifications', error);
                throw error;
            }
        }
        /**
         * Generates confidentiality agreement
         */
        async generateConfidentialityAgreement(proceedingId) {
            try {
                const proceeding = await this.adrRepository.findByPk(proceedingId);
                if (!proceeding) {
                    throw new common_1.NotFoundException('ADR proceeding not found');
                }
                const agreementContent = `
CONFIDENTIALITY AGREEMENT
ADR Proceeding: ${proceeding.adrNumber}

This Agreement is entered into by and between:
Claimant: ${proceeding.claimantName}
Respondent: ${proceeding.respondentName}

The parties agree that all information disclosed during the ${proceeding.adrType}
proceeding shall remain strictly confidential and shall not be disclosed to any
third party without prior written consent of all parties.

Date: ${(0, date_fns_1.format)(new Date(), 'yyyy-MM-dd')}
      `.trim();
                const agreementPath = `/agreements/${proceeding.adrNumber}-confidentiality.pdf`;
                await proceeding.update({
                    confidentialityAgreementSigned: true,
                    metadata: { ...proceeding.metadata, confidentialityAgreementPath: agreementPath }
                });
                this.logger.log(`Generated confidentiality agreement for ${proceeding.adrNumber}`);
                return { agreementPath, agreementContent };
            }
            catch (error) {
                this.logger.error('Failed to generate confidentiality agreement', error);
                throw error;
            }
        }
        /**
         * Tracks ADR communications and correspondence
         */
        async trackADRCommunications(proceedingId, communication) {
            try {
                const proceeding = await this.adrRepository.findByPk(proceedingId);
                if (!proceeding) {
                    throw new common_1.NotFoundException('ADR proceeding not found');
                }
                const communications = proceeding.metadata?.communications || [];
                communications.push({
                    ...communication,
                    timestamp: new Date(),
                });
                await proceeding.update({
                    metadata: { ...proceeding.metadata, communications }
                });
                this.logger.log(`Tracked communication for ${proceeding.adrNumber}`);
            }
            catch (error) {
                this.logger.error('Failed to track communication', error);
                throw error;
            }
        }
    };
    __setFunctionName(_classThis, "ADRProceedingService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ADRProceedingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ADRProceedingService = _classThis;
})();
exports.ADRProceedingService = ADRProceedingService;
/**
 * Settlement Offer Management Service
 * Manages settlement offers and counteroffers
 */
let SettlementOfferService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SettlementOfferService = _classThis = class {
        constructor(offerRepository, adrRepository) {
            this.offerRepository = offerRepository;
            this.adrRepository = adrRepository;
            this.logger = new common_1.Logger(SettlementOfferService.name);
        }
        /**
         * Creates a new settlement offer
         */
        async createOffer(data) {
            try {
                const validated = exports.CreateSettlementOfferSchema.parse(data);
                const proceeding = await this.adrRepository.findByPk(validated.adrProceedingId);
                if (!proceeding) {
                    throw new common_1.NotFoundException('ADR proceeding not found');
                }
                const existingOffers = await this.offerRepository.count({
                    where: { adrProceedingId: validated.adrProceedingId },
                });
                const offerNumber = generateOfferNumber(proceeding.adrNumber, existingOffers + 1);
                const offer = await this.offerRepository.create({
                    ...validated,
                    offerNumber,
                    status: SettlementOfferStatus.PROPOSED,
                    proposedDate: new Date(),
                    relatedOfferIds: [],
                    attachments: [],
                    notes: '',
                    metadata: {},
                });
                this.logger.log(`Created settlement offer: ${offer.offerNumber}`);
                return offer;
            }
            catch (error) {
                this.logger.error('Failed to create settlement offer', error);
                throw new common_1.BadRequestException('Failed to create settlement offer');
            }
        }
        /**
         * Responds to settlement offer
         */
        async respondToOffer(offerId, response) {
            try {
                const offer = await this.offerRepository.findByPk(offerId);
                if (!offer) {
                    throw new common_1.NotFoundException('Settlement offer not found');
                }
                if (offer.status !== SettlementOfferStatus.PROPOSED) {
                    throw new common_1.BadRequestException('Offer is not in proposed status');
                }
                const updates = {
                    responseDate: new Date(),
                };
                if (response.action === 'accept') {
                    updates.status = SettlementOfferStatus.ACCEPTED;
                    updates.acceptedDate = new Date();
                }
                else if (response.action === 'reject') {
                    updates.status = SettlementOfferStatus.REJECTED;
                    updates.rejectionReason = response.rejectionReason;
                }
                else if (response.action === 'counter') {
                    updates.status = SettlementOfferStatus.COUNTERED;
                    updates.counterOfferAmount = response.counterAmount;
                }
                await offer.update(updates);
                this.logger.log(`Responded to offer ${offer.offerNumber}: ${response.action}`);
                return offer;
            }
            catch (error) {
                this.logger.error('Failed to respond to offer', error);
                throw error;
            }
        }
        /**
         * Generates settlement valuation analysis
         */
        async generateValuationAnalysis(offerId) {
            try {
                const offer = await this.offerRepository.findByPk(offerId, {
                    include: [{ model: ADRProceeding, as: 'adrProceeding' }],
                });
                if (!offer) {
                    throw new common_1.NotFoundException('Settlement offer not found');
                }
                const estimatedValue = offer.adrProceeding.amountInControversy || 0;
                const valuationPercentage = estimatedValue > 0 ? (offer.offerAmount / estimatedValue) * 100 : 0;
                let recommendation = 'Consider';
                if (valuationPercentage >= 80)
                    recommendation = 'Strong acceptance recommended';
                else if (valuationPercentage >= 60)
                    recommendation = 'Acceptance recommended';
                else if (valuationPercentage >= 40)
                    recommendation = 'Consider countering';
                else
                    recommendation = 'Counter or reject recommended';
                return {
                    offerAmount: offer.offerAmount,
                    estimatedValue,
                    valuationPercentage,
                    recommendation,
                };
            }
            catch (error) {
                this.logger.error('Failed to generate valuation analysis', error);
                throw error;
            }
        }
        /**
         * Tracks settlement negotiation history
         */
        async getOfferHistory(adrProceedingId) {
            try {
                return await this.offerRepository.findAll({
                    where: { adrProceedingId },
                    order: [['proposedDate', 'ASC']],
                });
            }
            catch (error) {
                this.logger.error('Failed to get offer history', error);
                throw new common_1.InternalServerErrorException('Failed to get offer history');
            }
        }
        /**
         * Generates settlement agreement document
         */
        async generateSettlementAgreement(offerId) {
            try {
                const offer = await this.offerRepository.findByPk(offerId, {
                    include: [{ model: ADRProceeding, as: 'adrProceeding' }],
                });
                if (!offer) {
                    throw new common_1.NotFoundException('Settlement offer not found');
                }
                if (offer.status !== SettlementOfferStatus.ACCEPTED) {
                    throw new common_1.BadRequestException('Only accepted offers can generate agreements');
                }
                const agreementContent = `
SETTLEMENT AGREEMENT
Offer Number: ${offer.offerNumber}
ADR Proceeding: ${offer.adrProceeding.adrNumber}

This Settlement Agreement is entered into on ${(0, date_fns_1.format)(new Date(), 'MMMM d, yyyy')} by and between:

Claimant: ${offer.adrProceeding.claimantName}
Respondent: ${offer.adrProceeding.respondentName}

SETTLEMENT TERMS:
1. Settlement Amount: $${offer.offerAmount.toLocaleString()}
2. Payment Terms: ${offer.paymentTerms || 'Payment in full within 30 days'}

${offer.nonMonetaryTerms && offer.nonMonetaryTerms.length > 0 ? `
NON-MONETARY TERMS:
${offer.nonMonetaryTerms.map((term, idx) => `${idx + 1}. ${term}`).join('\n')}
` : ''}

CONDITIONS:
${offer.conditions.map((cond, idx) => `${idx + 1}. ${cond}`).join('\n')}

This Agreement constitutes the full and final settlement of all claims.

Date of Settlement: ${(0, date_fns_1.format)(offer.acceptedDate, 'yyyy-MM-dd')}
      `.trim();
                const agreementPath = `/settlements/${offer.offerNumber}-agreement.pdf`;
                await offer.update({
                    metadata: { ...offer.metadata, settlementAgreementPath: agreementPath }
                });
                this.logger.log(`Generated settlement agreement for ${offer.offerNumber}`);
                return { agreementPath, agreementContent };
            }
            catch (error) {
                this.logger.error('Failed to generate settlement agreement', error);
                throw error;
            }
        }
        /**
         * Validates offer compliance with legal requirements
         */
        async validateOfferCompliance(offerId) {
            try {
                const offer = await this.offerRepository.findByPk(offerId);
                if (!offer) {
                    throw new common_1.NotFoundException('Settlement offer not found');
                }
                const violations = [];
                const warnings = [];
                if (offer.offerAmount <= 0) {
                    violations.push('Offer amount must be greater than zero');
                }
                if (offer.conditions.length === 0) {
                    warnings.push('No conditions specified for settlement');
                }
                if (!offer.responseDeadline) {
                    violations.push('Response deadline is required');
                }
                else if ((0, date_fns_1.isBefore)(offer.responseDeadline, new Date())) {
                    warnings.push('Response deadline has passed');
                }
                if (offer.confidential && !offer.metadata?.confidentialityClause) {
                    warnings.push('Confidential offer should include confidentiality clause');
                }
                return {
                    isCompliant: violations.length === 0,
                    violations,
                    warnings,
                };
            }
            catch (error) {
                this.logger.error('Failed to validate offer compliance', error);
                throw error;
            }
        }
        /**
         * Calculates settlement offer trends
         */
        async calculateOfferTrends(adrProceedingId) {
            try {
                const offers = await this.offerRepository.findAll({
                    where: { adrProceedingId },
                    order: [['proposedDate', 'ASC']],
                });
                if (offers.length === 0) {
                    return {
                        offerCount: 0,
                        averageOfferAmount: 0,
                        lowestOffer: 0,
                        highestOffer: 0,
                        trendDirection: 'stable',
                    };
                }
                const amounts = offers.map((o) => o.offerAmount);
                const averageOfferAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
                const lowestOffer = Math.min(...amounts);
                const highestOffer = Math.max(...amounts);
                let trendDirection = 'stable';
                if (offers.length >= 2) {
                    const firstHalf = offers.slice(0, Math.floor(offers.length / 2));
                    const secondHalf = offers.slice(Math.floor(offers.length / 2));
                    const firstAvg = firstHalf.reduce((sum, o) => sum + o.offerAmount, 0) / firstHalf.length;
                    const secondAvg = secondHalf.reduce((sum, o) => sum + o.offerAmount, 0) / secondHalf.length;
                    if (secondAvg > firstAvg * 1.1) {
                        trendDirection = 'increasing';
                    }
                    else if (secondAvg < firstAvg * 0.9) {
                        trendDirection = 'decreasing';
                    }
                }
                return {
                    offerCount: offers.length,
                    averageOfferAmount,
                    lowestOffer,
                    highestOffer,
                    trendDirection,
                };
            }
            catch (error) {
                this.logger.error('Failed to calculate offer trends', error);
                throw new common_1.InternalServerErrorException('Failed to calculate offer trends');
            }
        }
    };
    __setFunctionName(_classThis, "SettlementOfferService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SettlementOfferService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SettlementOfferService = _classThis;
})();
exports.SettlementOfferService = SettlementOfferService;
/**
 * Arbitration Award Management Service
 * Manages arbitration awards and enforcement
 */
let ArbitrationAwardService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ArbitrationAwardService = _classThis = class {
        constructor(awardRepository, adrRepository) {
            this.awardRepository = awardRepository;
            this.adrRepository = adrRepository;
            this.logger = new common_1.Logger(ArbitrationAwardService.name);
        }
        /**
         * Creates arbitration award
         */
        async createAward(data) {
            try {
                const validated = exports.CreateArbitrationAwardSchema.parse(data);
                const proceeding = await this.adrRepository.findByPk(validated.adrProceedingId);
                if (!proceeding) {
                    throw new common_1.NotFoundException('ADR proceeding not found');
                }
                const awardNumber = generateAwardNumber(proceeding.adrNumber);
                const award = await this.awardRepository.create({
                    ...validated,
                    awardNumber,
                    status: AwardStatus.DRAFT,
                    documentPath: `/awards/${awardNumber}.pdf`,
                    metadata: {},
                });
                this.logger.log(`Created arbitration award: ${award.awardNumber}`);
                return award;
            }
            catch (error) {
                this.logger.error('Failed to create award', error);
                throw new common_1.BadRequestException('Failed to create award');
            }
        }
        /**
         * Issues arbitration award
         */
        async issueAward(awardId) {
            try {
                const award = await this.awardRepository.findByPk(awardId);
                if (!award) {
                    throw new common_1.NotFoundException('Award not found');
                }
                if (award.status !== AwardStatus.DRAFT) {
                    throw new common_1.BadRequestException('Award must be in draft status');
                }
                await award.update({
                    status: AwardStatus.ISSUED,
                    issuedDate: new Date(),
                });
                const proceeding = await this.adrRepository.findByPk(award.adrProceedingId);
                if (proceeding) {
                    await proceeding.update({ status: ADRStatus.AWARD_ISSUED });
                }
                this.logger.log(`Issued award: ${award.awardNumber}`);
                return award;
            }
            catch (error) {
                this.logger.error('Failed to issue award', error);
                throw error;
            }
        }
        /**
         * Confirms arbitration award
         */
        async confirmAward(awardId, confirmationData) {
            try {
                const award = await this.awardRepository.findByPk(awardId);
                if (!award) {
                    throw new common_1.NotFoundException('Award not found');
                }
                await award.update({
                    status: AwardStatus.CONFIRMED,
                    ...confirmationData,
                });
                this.logger.log(`Confirmed award: ${award.awardNumber}`);
                return award;
            }
            catch (error) {
                this.logger.error('Failed to confirm award', error);
                throw error;
            }
        }
        /**
         * Tracks award enforcement
         */
        async trackEnforcement(awardId, enforcementData) {
            try {
                const award = await this.awardRepository.findByPk(awardId);
                if (!award) {
                    throw new common_1.NotFoundException('Award not found');
                }
                await award.update({
                    status: AwardStatus.ENFORCEMENT_INITIATED,
                    enforcementJurisdiction: enforcementData.jurisdiction,
                    enforcementStatus: enforcementData.enforcementStatus,
                });
                this.logger.log(`Tracking enforcement for award: ${award.awardNumber}`);
                return award;
            }
            catch (error) {
                this.logger.error('Failed to track enforcement', error);
                throw error;
            }
        }
        /**
         * Calculates award payment schedule
         */
        async calculatePaymentSchedule(awardId) {
            try {
                const award = await this.awardRepository.findByPk(awardId);
                if (!award) {
                    throw new common_1.NotFoundException('Award not found');
                }
                const principalAmount = award.awardAmount || 0;
                let interestAmount = 0;
                if (award.interestRate && award.interestStartDate) {
                    const daysSinceStart = (0, date_fns_1.differenceInDays)(new Date(), award.interestStartDate);
                    const yearsSinceStart = daysSinceStart / 365;
                    interestAmount = principalAmount * (award.interestRate / 100) * yearsSinceStart;
                }
                const totalDue = principalAmount + interestAmount;
                const paymentDeadline = award.paymentDeadline || (0, date_fns_1.addDays)(new Date(), 30);
                return { principalAmount, interestAmount, totalDue, paymentDeadline };
            }
            catch (error) {
                this.logger.error('Failed to calculate payment schedule', error);
                throw error;
            }
        }
    };
    __setFunctionName(_classThis, "ArbitrationAwardService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ArbitrationAwardService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ArbitrationAwardService = _classThis;
})();
exports.ArbitrationAwardService = ArbitrationAwardService;
/**
 * ADR Session Management Service
 * Manages ADR sessions and conferences
 */
let ADRSessionService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ADRSessionService = _classThis = class {
        constructor(sessionRepository, adrRepository) {
            this.sessionRepository = sessionRepository;
            this.adrRepository = adrRepository;
            this.logger = new common_1.Logger(ADRSessionService.name);
        }
        /**
         * Creates a new ADR session
         */
        async createSession(sessionData) {
            try {
                const proceeding = await this.adrRepository.findByPk(sessionData.adrProceedingId);
                if (!proceeding) {
                    throw new common_1.NotFoundException('ADR proceeding not found');
                }
                const existingSessions = await this.sessionRepository.count({
                    where: { adrProceedingId: sessionData.adrProceedingId },
                });
                const session = await this.sessionRepository.create({
                    ...sessionData,
                    sessionNumber: existingSessions + 1,
                    progressNotes: '',
                    nextSteps: [],
                    documentsExchanged: [],
                    settlementDiscussed: false,
                    caucusHeld: false,
                    isSuccessful: false,
                    metadata: {},
                });
                this.logger.log(`Created ADR session #${session.sessionNumber} for ${proceeding.adrNumber}`);
                return session;
            }
            catch (error) {
                this.logger.error('Failed to create session', error);
                throw new common_1.BadRequestException('Failed to create session');
            }
        }
        /**
         * Records session outcomes
         */
        async recordSessionOutcome(sessionId, outcome) {
            try {
                const session = await this.sessionRepository.findByPk(sessionId);
                if (!session) {
                    throw new common_1.NotFoundException('Session not found');
                }
                await session.update(outcome);
                this.logger.log(`Recorded outcome for session ${session.id}`);
                return session;
            }
            catch (error) {
                this.logger.error('Failed to record session outcome', error);
                throw error;
            }
        }
        /**
         * Schedules follow-up session
         */
        async scheduleFollowUp(sessionId, nextSessionData) {
            try {
                const currentSession = await this.sessionRepository.findByPk(sessionId);
                if (!currentSession) {
                    throw new common_1.NotFoundException('Session not found');
                }
                await currentSession.update({ nextSessionDate: nextSessionData.sessionDate });
                const newSession = await this.createSession({
                    adrProceedingId: currentSession.adrProceedingId,
                    sessionDate: nextSessionData.sessionDate,
                    duration: nextSessionData.duration,
                    format: nextSessionData.format,
                    attendees: currentSession.attendees,
                });
                this.logger.log(`Scheduled follow-up session for ${currentSession.adrProceedingId}`);
                return newSession;
            }
            catch (error) {
                this.logger.error('Failed to schedule follow-up', error);
                throw error;
            }
        }
        /**
         * Retrieves session history
         */
        async getSessionHistory(adrProceedingId) {
            try {
                return await this.sessionRepository.findAll({
                    where: { adrProceedingId },
                    order: [['sessionDate', 'ASC']],
                });
            }
            catch (error) {
                this.logger.error('Failed to get session history', error);
                throw new common_1.InternalServerErrorException('Failed to get session history');
            }
        }
    };
    __setFunctionName(_classThis, "ADRSessionService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ADRSessionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ADRSessionService = _classThis;
})();
exports.ADRSessionService = ADRSessionService;
/**
 * ADR Outcome Analytics Service
 * Provides outcome analysis and reporting
 */
let ADROutcomeAnalyticsService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ADROutcomeAnalyticsService = _classThis = class {
        constructor(adrRepository, offerRepository, sessionRepository) {
            this.adrRepository = adrRepository;
            this.offerRepository = offerRepository;
            this.sessionRepository = sessionRepository;
            this.logger = new common_1.Logger(ADROutcomeAnalyticsService.name);
        }
        /**
         * Calculates overall ADR outcome metrics
         */
        async calculateOutcomeMetrics(filters) {
            try {
                const whereClause = {};
                if (filters?.dateFrom) {
                    whereClause.initiationDate = { [sequelize_1.Op.gte]: filters.dateFrom };
                }
                if (filters?.dateTo) {
                    whereClause.completionDate = { [sequelize_1.Op.lte]: filters.dateTo };
                }
                if (filters?.adrType) {
                    whereClause.adrType = filters.adrType;
                }
                if (filters?.mediatorId) {
                    whereClause.mediatorId = filters.mediatorId;
                }
                const proceedings = await this.adrRepository.findAll({ where: whereClause });
                const totalProceedings = proceedings.length;
                const settledProceedings = proceedings.filter((p) => p.status === ADRStatus.SETTLEMENT_REACHED).length;
                const impasseProceedings = proceedings.filter((p) => p.status === ADRStatus.IMPASSE).length;
                const settlementRate = totalProceedings > 0 ? (settledProceedings / totalProceedings) * 100 : 0;
                const settlementAmounts = proceedings
                    .filter((p) => p.settlementAmount)
                    .map((p) => p.settlementAmount);
                const averageSettlementAmount = settlementAmounts.length > 0
                    ? settlementAmounts.reduce((a, b) => a + b, 0) / settlementAmounts.length
                    : 0;
                const resolutionTimes = proceedings
                    .filter((p) => p.completionDate)
                    .map((p) => (0, date_fns_1.differenceInDays)(p.completionDate, p.initiationDate));
                const averageTimeToResolution = resolutionTimes.length > 0
                    ? resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length
                    : 0;
                const costs = proceedings
                    .filter((p) => p.actualTotalCost)
                    .map((p) => p.actualTotalCost);
                const averageCost = costs.length > 0 ? costs.reduce((a, b) => a + b, 0) / costs.length : 0;
                const estimatedLitigationCost = averageSettlementAmount * 0.3;
                const costSavingsVsLitigation = estimatedLitigationCost - averageCost;
                const mediatorSuccessRates = {};
                const settlementRateByType = {};
                const sessions = await this.sessionRepository.findAll({
                    where: {
                        adrProceedingId: { [sequelize_1.Op.in]: proceedings.map((p) => p.id) },
                    },
                });
                const sessionCounts = {};
                sessions.forEach((s) => {
                    sessionCounts[s.adrProceedingId] = (sessionCounts[s.adrProceedingId] || 0) + 1;
                });
                const averageSessionsToSettlement = Object.keys(sessionCounts).length > 0
                    ? Object.values(sessionCounts).reduce((a, b) => a + b, 0) /
                        Object.keys(sessionCounts).length
                    : 0;
                return {
                    totalProceedings,
                    settledProceedings,
                    impasseProceedings,
                    settlementRate,
                    averageSettlementAmount,
                    averageTimeToResolution,
                    averageCost,
                    costSavingsVsLitigation,
                    mediatorSuccessRates,
                    settlementRateByType,
                    averageSessionsToSettlement,
                };
            }
            catch (error) {
                this.logger.error('Failed to calculate outcome metrics', error);
                throw new common_1.InternalServerErrorException('Failed to calculate outcome metrics');
            }
        }
        /**
         * Analyzes settlement patterns
         */
        async analyzeSettlementPatterns(adrType) {
            try {
                const whereClause = {};
                if (adrType) {
                    const proceedings = await this.adrRepository.findAll({
                        where: { adrType },
                        attributes: ['id'],
                    });
                    whereClause.adrProceedingId = { [sequelize_1.Op.in]: proceedings.map((p) => p.id) };
                }
                const offers = await this.offerRepository.findAll({ where: whereClause });
                const proceedingOffers = {};
                offers.forEach((offer) => {
                    if (!proceedingOffers[offer.adrProceedingId]) {
                        proceedingOffers[offer.adrProceedingId] = [];
                    }
                    proceedingOffers[offer.adrProceedingId].push(offer);
                });
                const offerCounts = Object.values(proceedingOffers).map((o) => o.length);
                const averageOfferCount = offerCounts.length > 0
                    ? offerCounts.reduce((a, b) => a + b, 0) / offerCounts.length
                    : 0;
                const negotiationTimes = Object.values(proceedingOffers)
                    .filter((offers) => offers.length > 0)
                    .map((offers) => {
                    const first = offers[0];
                    const last = offers[offers.length - 1];
                    return (0, date_fns_1.differenceInDays)(last.proposedDate, first.proposedDate);
                });
                const averageNegotiationTime = negotiationTimes.length > 0
                    ? negotiationTimes.reduce((a, b) => a + b, 0) / negotiationTimes.length
                    : 0;
                const acceptedOffers = offers.filter((o) => o.status === SettlementOfferStatus.ACCEPTED);
                const acceptanceRate = offers.length > 0 ? (acceptedOffers.length / offers.length) * 100 : 0;
                const discounts = Object.values(proceedingOffers)
                    .filter((offers) => offers.length > 1 && offers[offers.length - 1].status === SettlementOfferStatus.ACCEPTED)
                    .map((offers) => {
                    const initial = offers[0].offerAmount;
                    const final = offers[offers.length - 1].offerAmount;
                    return ((initial - final) / initial) * 100;
                });
                const averageDiscountFromInitial = discounts.length > 0 ? discounts.reduce((a, b) => a + b, 0) / discounts.length : 0;
                return {
                    averageOfferCount,
                    averageNegotiationTime,
                    acceptanceRate,
                    averageDiscountFromInitial,
                };
            }
            catch (error) {
                this.logger.error('Failed to analyze settlement patterns', error);
                throw new common_1.InternalServerErrorException('Failed to analyze settlement patterns');
            }
        }
        /**
         * Generates ADR suitability assessment
         */
        async assessADRSuitability(caseData) {
            try {
                let suitabilityScore = 50;
                const reasoning = [];
                if (caseData.amountInControversy < 100000) {
                    suitabilityScore += 15;
                    reasoning.push('Lower amount in controversy favors cost-effective ADR');
                }
                else if (caseData.amountInControversy > 1000000) {
                    suitabilityScore += 10;
                    reasoning.push('High-value case may benefit from expert arbitration');
                }
                if (caseData.relationshipPreservation) {
                    suitabilityScore += 20;
                    reasoning.push('Relationship preservation strongly favors mediation');
                }
                if (caseData.timeConstraints) {
                    suitabilityScore += 15;
                    reasoning.push('Time constraints favor expedited ADR process');
                }
                if (caseData.confidentialityRequired) {
                    suitabilityScore += 10;
                    reasoning.push('Confidentiality requirements favor ADR over public litigation');
                }
                let recommendedADRType;
                if (caseData.relationshipPreservation) {
                    recommendedADRType = ADRType.MEDIATION;
                }
                else if (caseData.amountInControversy > 500000) {
                    recommendedADRType = ADRType.ARBITRATION;
                }
                else {
                    recommendedADRType = ADRType.SETTLEMENT_CONFERENCE;
                }
                return { suitabilityScore, recommendedADRType, reasoning };
            }
            catch (error) {
                this.logger.error('Failed to assess ADR suitability', error);
                throw new common_1.InternalServerErrorException('Failed to assess ADR suitability');
            }
        }
        /**
         * Compares ADR cost vs litigation cost
         */
        async compareADRVsLitigationCost(proceedingId) {
            try {
                const proceeding = await this.adrRepository.findByPk(proceedingId);
                if (!proceeding) {
                    throw new common_1.NotFoundException('ADR proceeding not found');
                }
                const adrCost = proceeding.actualTotalCost || proceeding.estimatedTotalCost || 0;
                const amountInControversy = proceeding.amountInControversy || 0;
                const estimatedLitigationCost = amountInControversy * 0.25;
                const savings = estimatedLitigationCost - adrCost;
                const savingsPercentage = estimatedLitigationCost > 0 ? (savings / estimatedLitigationCost) * 100 : 0;
                return { adrCost, estimatedLitigationCost, savings, savingsPercentage };
            }
            catch (error) {
                this.logger.error('Failed to compare costs', error);
                throw error;
            }
        }
    };
    __setFunctionName(_classThis, "ADROutcomeAnalyticsService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ADROutcomeAnalyticsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ADROutcomeAnalyticsService = _classThis;
})();
exports.ADROutcomeAnalyticsService = ADROutcomeAnalyticsService;
// ============================================================================
// CONFIGURATION
// ============================================================================
exports.mediationArbitrationConfig = (0, config_1.registerAs)('mediationArbitration', () => ({
    defaultSessionDuration: parseInt(process.env.ADR_DEFAULT_SESSION_DURATION || '480', 10),
    defaultOfferValidityDays: parseInt(process.env.ADR_OFFER_VALIDITY_DAYS || '14', 10),
    defaultPaymentDeadlineDays: parseInt(process.env.ADR_PAYMENT_DEADLINE_DAYS || '30', 10),
    virtualMeetingProvider: process.env.ADR_VIRTUAL_MEETING_PROVIDER || 'zoom',
    filingFeeMediation: parseFloat(process.env.ADR_FILING_FEE_MEDIATION || '500'),
    filingFeeArbitration: parseFloat(process.env.ADR_FILING_FEE_ARBITRATION || '1500'),
    administrativeFee: parseFloat(process.env.ADR_ADMINISTRATIVE_FEE || '1000'),
    enableAutomatedReminders: process.env.ADR_AUTOMATED_REMINDERS === 'true',
    reminderDaysBefore: parseInt(process.env.ADR_REMINDER_DAYS_BEFORE || '7', 10),
    maxArbitrators: parseInt(process.env.ADR_MAX_ARBITRATORS || '3', 10),
    confidentialityDefault: process.env.ADR_CONFIDENTIALITY_DEFAULT !== 'false',
}));
// ============================================================================
// MODULE DEFINITION
// ============================================================================
let MediationArbitrationModule = (() => {
    let _classDecorators = [(0, common_1.Global)(), (0, common_1.Module)({})];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var MediationArbitrationModule = _classThis = class {
        static forRoot() {
            return {
                module: MediationArbitrationModule,
                imports: [config_1.ConfigModule.forFeature(exports.mediationArbitrationConfig)],
                providers: [
                    {
                        provide: 'MEDIATOR_REPOSITORY',
                        useValue: Mediator,
                    },
                    {
                        provide: 'ADR_PROCEEDING_REPOSITORY',
                        useValue: ADRProceeding,
                    },
                    {
                        provide: 'SETTLEMENT_OFFER_REPOSITORY',
                        useValue: SettlementOffer,
                    },
                    {
                        provide: 'ARBITRATION_AWARD_REPOSITORY',
                        useValue: ArbitrationAward,
                    },
                    {
                        provide: 'ADR_SESSION_REPOSITORY',
                        useValue: ADRSession,
                    },
                    MediatorSelectionService,
                    ADRProceedingService,
                    SettlementOfferService,
                    ArbitrationAwardService,
                    ADRSessionService,
                    ADROutcomeAnalyticsService,
                ],
                exports: [
                    'MEDIATOR_REPOSITORY',
                    'ADR_PROCEEDING_REPOSITORY',
                    'SETTLEMENT_OFFER_REPOSITORY',
                    'ARBITRATION_AWARD_REPOSITORY',
                    'ADR_SESSION_REPOSITORY',
                    MediatorSelectionService,
                    ADRProceedingService,
                    SettlementOfferService,
                    ArbitrationAwardService,
                    ADRSessionService,
                    ADROutcomeAnalyticsService,
                ],
            };
        }
        static forFeature() {
            return {
                module: MediationArbitrationModule,
                providers: [
                    MediatorSelectionService,
                    ADRProceedingService,
                    SettlementOfferService,
                    ArbitrationAwardService,
                    ADRSessionService,
                    ADROutcomeAnalyticsService,
                ],
                exports: [
                    MediatorSelectionService,
                    ADRProceedingService,
                    SettlementOfferService,
                    ArbitrationAwardService,
                    ADRSessionService,
                    ADROutcomeAnalyticsService,
                ],
            };
        }
    };
    __setFunctionName(_classThis, "MediationArbitrationModule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MediationArbitrationModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MediationArbitrationModule = _classThis;
})();
exports.MediationArbitrationModule = MediationArbitrationModule;
//# sourceMappingURL=mediation-arbitration-kit.js.map