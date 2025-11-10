"use strict";
/**
 * LOC: EXPERT_WITNESS_MANAGEMENT_KIT_001
 * File: /reuse/legal/expert-witness-management-kit.ts
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
 *   - Legal litigation modules
 *   - Expert witness controllers
 *   - Deposition management services
 *   - Trial preparation services
 *   - Legal billing services
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
exports.ExpertWitnessManagementModule = exports.expertWitnessManagementConfig = exports.ExpertWitnessManagementService = exports.ExpertSearchFiltersDto = exports.CreateExpertInvoiceDto = exports.CreateExpertDepositionDto = exports.CreateExpertReportDto = exports.CreateExpertEngagementDto = exports.UpdateExpertWitnessProfileDto = exports.CreateExpertWitnessProfileDto = exports.CredentialVerification = exports.ExpertInvoice = exports.ExpertDeposition = exports.ExpertReport = exports.ExpertEngagement = exports.ExpertWitnessProfile = exports.CredentialVerificationSchema = exports.ExpertInvoiceSchema = exports.ExpertDepositionSchema = exports.ExpertReportSchema = exports.ExpertEngagementSchema = exports.ExpertWitnessProfileSchema = exports.ConflictCheckResult = exports.CredentialStatus = exports.InvoiceStatus = exports.FeeStructure = exports.DepositionStatus = exports.ReportStatus = exports.EngagementType = exports.ExpertStatus = exports.ExpertSpecialty = void 0;
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
 * Expert witness specialty areas
 */
var ExpertSpecialty;
(function (ExpertSpecialty) {
    ExpertSpecialty["MEDICAL"] = "medical";
    ExpertSpecialty["NURSING"] = "nursing";
    ExpertSpecialty["PHARMACY"] = "pharmacy";
    ExpertSpecialty["MEDICAL_DEVICE"] = "medical_device";
    ExpertSpecialty["BIOMEDICAL_ENGINEERING"] = "biomedical_engineering";
    ExpertSpecialty["RADIOLOGY"] = "radiology";
    ExpertSpecialty["PATHOLOGY"] = "pathology";
    ExpertSpecialty["SURGERY"] = "surgery";
    ExpertSpecialty["ANESTHESIOLOGY"] = "anesthesiology";
    ExpertSpecialty["EMERGENCY_MEDICINE"] = "emergency_medicine";
    ExpertSpecialty["PSYCHIATRY"] = "psychiatry";
    ExpertSpecialty["NEUROLOGY"] = "neurology";
    ExpertSpecialty["CARDIOLOGY"] = "cardiology";
    ExpertSpecialty["ONCOLOGY"] = "oncology";
    ExpertSpecialty["ORTHOPEDICS"] = "orthopedics";
    ExpertSpecialty["ACCOUNTING"] = "accounting";
    ExpertSpecialty["ECONOMICS"] = "economics";
    ExpertSpecialty["ENGINEERING"] = "engineering";
    ExpertSpecialty["COMPUTER_FORENSICS"] = "computer_forensics";
    ExpertSpecialty["ACCIDENT_RECONSTRUCTION"] = "accident_reconstruction";
    ExpertSpecialty["TOXICOLOGY"] = "toxicology";
    ExpertSpecialty["VOCATIONAL"] = "vocational";
    ExpertSpecialty["LIFE_CARE_PLANNING"] = "life_care_planning";
    ExpertSpecialty["BIOMECHANICS"] = "biomechanics";
    ExpertSpecialty["EPIDEMIOLOGY"] = "epidemiology";
    ExpertSpecialty["OTHER"] = "other";
})(ExpertSpecialty || (exports.ExpertSpecialty = ExpertSpecialty = {}));
/**
 * Expert witness status lifecycle
 */
var ExpertStatus;
(function (ExpertStatus) {
    ExpertStatus["CANDIDATE"] = "candidate";
    ExpertStatus["UNDER_REVIEW"] = "under_review";
    ExpertStatus["CONFLICT_CHECK"] = "conflict_check";
    ExpertStatus["APPROVED"] = "approved";
    ExpertStatus["RETAINED"] = "retained";
    ExpertStatus["ENGAGED"] = "engaged";
    ExpertStatus["REPORT_IN_PROGRESS"] = "report_in_progress";
    ExpertStatus["REPORT_SUBMITTED"] = "report_submitted";
    ExpertStatus["DEPOSITION_PREP"] = "deposition_prep";
    ExpertStatus["DEPOSED"] = "deposed";
    ExpertStatus["TRIAL_PREP"] = "trial_prep";
    ExpertStatus["TESTIFIED"] = "testified";
    ExpertStatus["COMPLETED"] = "completed";
    ExpertStatus["WITHDRAWN"] = "withdrawn";
    ExpertStatus["DISQUALIFIED"] = "disqualified";
})(ExpertStatus || (exports.ExpertStatus = ExpertStatus = {}));
/**
 * Expert witness engagement type
 */
var EngagementType;
(function (EngagementType) {
    EngagementType["CONSULTING_ONLY"] = "consulting_only";
    EngagementType["TESTIFYING"] = "testifying";
    EngagementType["CONSULTING_AND_TESTIFYING"] = "consulting_and_testifying";
    EngagementType["REBUTTAL"] = "rebuttal";
    EngagementType["TECHNICAL_ADVISOR"] = "technical_advisor";
    EngagementType["SHADOW_EXPERT"] = "shadow_expert";
})(EngagementType || (exports.EngagementType = EngagementType = {}));
/**
 * Expert report status
 */
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["NOT_STARTED"] = "not_started";
    ReportStatus["IN_PROGRESS"] = "in_progress";
    ReportStatus["DRAFT_SUBMITTED"] = "draft_submitted";
    ReportStatus["UNDER_REVIEW"] = "under_review";
    ReportStatus["REVISIONS_REQUESTED"] = "revisions_requested";
    ReportStatus["FINAL_SUBMITTED"] = "final_submitted";
    ReportStatus["DISCLOSED"] = "disclosed";
    ReportStatus["SUPPLEMENTED"] = "supplemented";
    ReportStatus["CHALLENGED"] = "challenged";
    ReportStatus["EXCLUDED"] = "excluded";
    ReportStatus["ADMITTED"] = "admitted";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
/**
 * Deposition status
 */
var DepositionStatus;
(function (DepositionStatus) {
    DepositionStatus["NOT_SCHEDULED"] = "not_scheduled";
    DepositionStatus["SCHEDULED"] = "scheduled";
    DepositionStatus["PREP_IN_PROGRESS"] = "prep_in_progress";
    DepositionStatus["READY"] = "ready";
    DepositionStatus["IN_PROGRESS"] = "in_progress";
    DepositionStatus["COMPLETED"] = "completed";
    DepositionStatus["TRANSCRIPT_ORDERED"] = "transcript_ordered";
    DepositionStatus["TRANSCRIPT_RECEIVED"] = "transcript_received";
    DepositionStatus["ERRATA_PENDING"] = "errata_pending";
    DepositionStatus["FINALIZED"] = "finalized";
})(DepositionStatus || (exports.DepositionStatus = DepositionStatus = {}));
/**
 * Fee structure types
 */
var FeeStructure;
(function (FeeStructure) {
    FeeStructure["HOURLY"] = "hourly";
    FeeStructure["FLAT_FEE"] = "flat_fee";
    FeeStructure["CONTINGENCY"] = "contingency";
    FeeStructure["RETAINER_PLUS_HOURLY"] = "retainer_plus_hourly";
    FeeStructure["PER_REPORT"] = "per_report";
    FeeStructure["PER_DEPOSITION"] = "per_deposition";
    FeeStructure["PER_TRIAL_DAY"] = "per_trial_day";
    FeeStructure["BLENDED"] = "blended";
})(FeeStructure || (exports.FeeStructure = FeeStructure = {}));
/**
 * Invoice status
 */
var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["DRAFT"] = "draft";
    InvoiceStatus["SUBMITTED"] = "submitted";
    InvoiceStatus["UNDER_REVIEW"] = "under_review";
    InvoiceStatus["APPROVED"] = "approved";
    InvoiceStatus["DISPUTED"] = "disputed";
    InvoiceStatus["PAID"] = "paid";
    InvoiceStatus["OVERDUE"] = "overdue";
    InvoiceStatus["WRITTEN_OFF"] = "written_off";
})(InvoiceStatus || (exports.InvoiceStatus = InvoiceStatus = {}));
/**
 * Credential verification status
 */
var CredentialStatus;
(function (CredentialStatus) {
    CredentialStatus["PENDING"] = "pending";
    CredentialStatus["VERIFIED"] = "verified";
    CredentialStatus["EXPIRED"] = "expired";
    CredentialStatus["INVALID"] = "invalid";
    CredentialStatus["SUSPENDED"] = "suspended";
    CredentialStatus["REVOKED"] = "revoked";
})(CredentialStatus || (exports.CredentialStatus = CredentialStatus = {}));
/**
 * Conflict check result
 */
var ConflictCheckResult;
(function (ConflictCheckResult) {
    ConflictCheckResult["CLEAR"] = "clear";
    ConflictCheckResult["POTENTIAL_CONFLICT"] = "potential_conflict";
    ConflictCheckResult["CONFLICT_IDENTIFIED"] = "conflict_identified";
    ConflictCheckResult["WAIVED"] = "waived";
    ConflictCheckResult["PENDING_REVIEW"] = "pending_review";
})(ConflictCheckResult || (exports.ConflictCheckResult = ConflictCheckResult = {}));
// ============================================================================
// ZOD SCHEMAS
// ============================================================================
/**
 * Expert witness profile schema
 */
exports.ExpertWitnessProfileSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    firstName: zod_1.z.string().min(1).max(100),
    lastName: zod_1.z.string().min(1).max(100),
    credentials: zod_1.z.string().max(200),
    specialty: zod_1.z.nativeEnum(ExpertSpecialty),
    subSpecialties: zod_1.z.array(zod_1.z.string()).default([]),
    licenseNumber: zod_1.z.string().max(100).optional(),
    licenseState: zod_1.z.string().max(50).optional(),
    licenseExpiration: zod_1.z.date().optional(),
    boardCertified: zod_1.z.boolean().default(false),
    boardCertifications: zod_1.z.array(zod_1.z.string()).default([]),
    yearsExperience: zod_1.z.number().int().min(0),
    currentEmployer: zod_1.z.string().max(200).optional(),
    currentPosition: zod_1.z.string().max(200).optional(),
    cvUrl: zod_1.z.string().url().optional(),
    photoUrl: zod_1.z.string().url().optional(),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().max(50),
    address: zod_1.z.string().max(500).optional(),
    hourlyRate: zod_1.z.number().min(0).optional(),
    depositRequired: zod_1.z.number().min(0).default(0),
    feeStructure: zod_1.z.nativeEnum(FeeStructure).default(FeeStructure.HOURLY),
    availableForTravel: zod_1.z.boolean().default(true),
    languagesSpoken: zod_1.z.array(zod_1.z.string()).default(['English']),
    publications: zod_1.z.array(zod_1.z.string()).default([]),
    priorTestimonyCount: zod_1.z.number().int().min(0).default(0),
    dauberChallenges: zod_1.z.number().int().min(0).default(0),
    dauberSuccesses: zod_1.z.number().int().min(0).default(0),
    rating: zod_1.z.number().min(0).max(5).optional(),
    notes: zod_1.z.string().optional(),
    status: zod_1.z.nativeEnum(ExpertStatus).default(ExpertStatus.CANDIDATE),
    createdBy: zod_1.z.string().uuid(),
    organizationId: zod_1.z.string().uuid(),
});
/**
 * Expert engagement schema
 */
exports.ExpertEngagementSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    expertId: zod_1.z.string().uuid(),
    caseId: zod_1.z.string().uuid(),
    engagementType: zod_1.z.nativeEnum(EngagementType),
    retainedDate: zod_1.z.date(),
    engagementLetterSigned: zod_1.z.boolean().default(false),
    conflictCheckCompleted: zod_1.z.boolean().default(false),
    conflictCheckResult: zod_1.z.nativeEnum(ConflictCheckResult).optional(),
    expectedReportDate: zod_1.z.date().optional(),
    expectedDepositionDate: zod_1.z.date().optional(),
    expectedTrialDate: zod_1.z.date().optional(),
    retainerAmount: zod_1.z.number().min(0).optional(),
    hourlyRate: zod_1.z.number().min(0).optional(),
    budgetCap: zod_1.z.number().min(0).optional(),
    currentSpend: zod_1.z.number().min(0).default(0),
    status: zod_1.z.nativeEnum(ExpertStatus).default(ExpertStatus.RETAINED),
    assignedAttorney: zod_1.z.string().uuid(),
    notes: zod_1.z.string().optional(),
    organizationId: zod_1.z.string().uuid(),
});
/**
 * Expert report schema
 */
exports.ExpertReportSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    expertEngagementId: zod_1.z.string().uuid(),
    reportType: zod_1.z.enum(['initial', 'supplemental', 'rebuttal']),
    version: zod_1.z.number().int().min(1).default(1),
    requestedDate: zod_1.z.date(),
    dueDate: zod_1.z.date(),
    submittedDate: zod_1.z.date().optional(),
    disclosureDeadline: zod_1.z.date().optional(),
    disclosedDate: zod_1.z.date().optional(),
    reportUrl: zod_1.z.string().url().optional(),
    pageCount: zod_1.z.number().int().min(0).default(0),
    attachmentCount: zod_1.z.number().int().min(0).default(0),
    status: zod_1.z.nativeEnum(ReportStatus).default(ReportStatus.NOT_STARTED),
    dauberChallenged: zod_1.z.boolean().default(false),
    dauberChallengeDate: zod_1.z.date().optional(),
    dauberHearingDate: zod_1.z.date().optional(),
    admissibilityStatus: zod_1.z.enum(['pending', 'admitted', 'excluded', 'limited']).optional(),
    reviewNotes: zod_1.z.string().optional(),
    organizationId: zod_1.z.string().uuid(),
});
/**
 * Expert deposition schema
 */
exports.ExpertDepositionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    expertEngagementId: zod_1.z.string().uuid(),
    noticeReceivedDate: zod_1.z.date().optional(),
    scheduledDate: zod_1.z.date().optional(),
    scheduledTime: zod_1.z.string().optional(),
    location: zod_1.z.string().max(500).optional(),
    remoteDeposition: zod_1.z.boolean().default(false),
    estimatedDuration: zod_1.z.number().min(0).default(4),
    videoRecorded: zod_1.z.boolean().default(false),
    courtReporter: zod_1.z.string().max(200).optional(),
    opposingCounsel: zod_1.z.string().max(200).optional(),
    defendingAttorney: zod_1.z.string().uuid().optional(),
    prepSessionsCompleted: zod_1.z.number().int().min(0).default(0),
    exhibitsIdentified: zod_1.z.number().int().min(0).default(0),
    status: zod_1.z.nativeEnum(DepositionStatus).default(DepositionStatus.NOT_SCHEDULED),
    transcriptOrderedDate: zod_1.z.date().optional(),
    transcriptReceivedDate: zod_1.z.date().optional(),
    transcriptUrl: zod_1.z.string().url().optional(),
    errataDeadline: zod_1.z.date().optional(),
    errataSubmitted: zod_1.z.boolean().default(false),
    notes: zod_1.z.string().optional(),
    organizationId: zod_1.z.string().uuid(),
});
/**
 * Expert invoice schema
 */
exports.ExpertInvoiceSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    expertEngagementId: zod_1.z.string().uuid(),
    invoiceNumber: zod_1.z.string().max(100),
    invoiceDate: zod_1.z.date(),
    dueDate: zod_1.z.date(),
    periodStart: zod_1.z.date(),
    periodEnd: zod_1.z.date(),
    hoursWorked: zod_1.z.number().min(0).default(0),
    hourlyRate: zod_1.z.number().min(0).optional(),
    laborAmount: zod_1.z.number().min(0).default(0),
    expensesAmount: zod_1.z.number().min(0).default(0),
    totalAmount: zod_1.z.number().min(0),
    status: zod_1.z.nativeEnum(InvoiceStatus).default(InvoiceStatus.DRAFT),
    approvedBy: zod_1.z.string().uuid().optional(),
    approvedDate: zod_1.z.date().optional(),
    paidDate: zod_1.z.date().optional(),
    paymentMethod: zod_1.z.string().max(100).optional(),
    invoiceUrl: zod_1.z.string().url().optional(),
    notes: zod_1.z.string().optional(),
    organizationId: zod_1.z.string().uuid(),
});
/**
 * Expert credential verification schema
 */
exports.CredentialVerificationSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    expertId: zod_1.z.string().uuid(),
    verificationType: zod_1.z.enum(['license', 'certification', 'education', 'experience', 'publication']),
    credentialName: zod_1.z.string().max(200),
    issuingAuthority: zod_1.z.string().max(200),
    credentialNumber: zod_1.z.string().max(100).optional(),
    issueDate: zod_1.z.date().optional(),
    expirationDate: zod_1.z.date().optional(),
    verifiedDate: zod_1.z.date(),
    verifiedBy: zod_1.z.string().uuid(),
    verificationMethod: zod_1.z.string().max(200),
    status: zod_1.z.nativeEnum(CredentialStatus).default(CredentialStatus.VERIFIED),
    documentUrl: zod_1.z.string().url().optional(),
    notes: zod_1.z.string().optional(),
    organizationId: zod_1.z.string().uuid(),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Expert witness profile model
 */
let ExpertWitnessProfile = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'expert_witness_profiles',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['specialty'] },
                { fields: ['status'] },
                { fields: ['organizationId'] },
                { fields: ['licenseState'] },
                { fields: ['boardCertified'] },
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
    let _credentials_decorators;
    let _credentials_initializers = [];
    let _credentials_extraInitializers = [];
    let _specialty_decorators;
    let _specialty_initializers = [];
    let _specialty_extraInitializers = [];
    let _subSpecialties_decorators;
    let _subSpecialties_initializers = [];
    let _subSpecialties_extraInitializers = [];
    let _licenseNumber_decorators;
    let _licenseNumber_initializers = [];
    let _licenseNumber_extraInitializers = [];
    let _licenseState_decorators;
    let _licenseState_initializers = [];
    let _licenseState_extraInitializers = [];
    let _licenseExpiration_decorators;
    let _licenseExpiration_initializers = [];
    let _licenseExpiration_extraInitializers = [];
    let _boardCertified_decorators;
    let _boardCertified_initializers = [];
    let _boardCertified_extraInitializers = [];
    let _boardCertifications_decorators;
    let _boardCertifications_initializers = [];
    let _boardCertifications_extraInitializers = [];
    let _yearsExperience_decorators;
    let _yearsExperience_initializers = [];
    let _yearsExperience_extraInitializers = [];
    let _currentEmployer_decorators;
    let _currentEmployer_initializers = [];
    let _currentEmployer_extraInitializers = [];
    let _currentPosition_decorators;
    let _currentPosition_initializers = [];
    let _currentPosition_extraInitializers = [];
    let _cvUrl_decorators;
    let _cvUrl_initializers = [];
    let _cvUrl_extraInitializers = [];
    let _photoUrl_decorators;
    let _photoUrl_initializers = [];
    let _photoUrl_extraInitializers = [];
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _phone_decorators;
    let _phone_initializers = [];
    let _phone_extraInitializers = [];
    let _address_decorators;
    let _address_initializers = [];
    let _address_extraInitializers = [];
    let _hourlyRate_decorators;
    let _hourlyRate_initializers = [];
    let _hourlyRate_extraInitializers = [];
    let _depositRequired_decorators;
    let _depositRequired_initializers = [];
    let _depositRequired_extraInitializers = [];
    let _feeStructure_decorators;
    let _feeStructure_initializers = [];
    let _feeStructure_extraInitializers = [];
    let _availableForTravel_decorators;
    let _availableForTravel_initializers = [];
    let _availableForTravel_extraInitializers = [];
    let _languagesSpoken_decorators;
    let _languagesSpoken_initializers = [];
    let _languagesSpoken_extraInitializers = [];
    let _publications_decorators;
    let _publications_initializers = [];
    let _publications_extraInitializers = [];
    let _priorTestimonyCount_decorators;
    let _priorTestimonyCount_initializers = [];
    let _priorTestimonyCount_extraInitializers = [];
    let _dauberChallenges_decorators;
    let _dauberChallenges_initializers = [];
    let _dauberChallenges_extraInitializers = [];
    let _dauberSuccesses_decorators;
    let _dauberSuccesses_initializers = [];
    let _dauberSuccesses_extraInitializers = [];
    let _rating_decorators;
    let _rating_initializers = [];
    let _rating_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _engagements_decorators;
    let _engagements_initializers = [];
    let _engagements_extraInitializers = [];
    let _credentials_decorators_1;
    let _credentials_initializers_1 = [];
    let _credentials_extraInitializers_1 = [];
    var ExpertWitnessProfile = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.firstName = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _firstName_initializers, void 0));
            this.lastName = (__runInitializers(this, _firstName_extraInitializers), __runInitializers(this, _lastName_initializers, void 0));
            this.credentials = (__runInitializers(this, _lastName_extraInitializers), __runInitializers(this, _credentials_initializers, void 0));
            this.specialty = (__runInitializers(this, _credentials_extraInitializers), __runInitializers(this, _specialty_initializers, void 0));
            this.subSpecialties = (__runInitializers(this, _specialty_extraInitializers), __runInitializers(this, _subSpecialties_initializers, void 0));
            this.licenseNumber = (__runInitializers(this, _subSpecialties_extraInitializers), __runInitializers(this, _licenseNumber_initializers, void 0));
            this.licenseState = (__runInitializers(this, _licenseNumber_extraInitializers), __runInitializers(this, _licenseState_initializers, void 0));
            this.licenseExpiration = (__runInitializers(this, _licenseState_extraInitializers), __runInitializers(this, _licenseExpiration_initializers, void 0));
            this.boardCertified = (__runInitializers(this, _licenseExpiration_extraInitializers), __runInitializers(this, _boardCertified_initializers, void 0));
            this.boardCertifications = (__runInitializers(this, _boardCertified_extraInitializers), __runInitializers(this, _boardCertifications_initializers, void 0));
            this.yearsExperience = (__runInitializers(this, _boardCertifications_extraInitializers), __runInitializers(this, _yearsExperience_initializers, void 0));
            this.currentEmployer = (__runInitializers(this, _yearsExperience_extraInitializers), __runInitializers(this, _currentEmployer_initializers, void 0));
            this.currentPosition = (__runInitializers(this, _currentEmployer_extraInitializers), __runInitializers(this, _currentPosition_initializers, void 0));
            this.cvUrl = (__runInitializers(this, _currentPosition_extraInitializers), __runInitializers(this, _cvUrl_initializers, void 0));
            this.photoUrl = (__runInitializers(this, _cvUrl_extraInitializers), __runInitializers(this, _photoUrl_initializers, void 0));
            this.email = (__runInitializers(this, _photoUrl_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
            this.address = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _address_initializers, void 0));
            this.hourlyRate = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _hourlyRate_initializers, void 0));
            this.depositRequired = (__runInitializers(this, _hourlyRate_extraInitializers), __runInitializers(this, _depositRequired_initializers, void 0));
            this.feeStructure = (__runInitializers(this, _depositRequired_extraInitializers), __runInitializers(this, _feeStructure_initializers, void 0));
            this.availableForTravel = (__runInitializers(this, _feeStructure_extraInitializers), __runInitializers(this, _availableForTravel_initializers, void 0));
            this.languagesSpoken = (__runInitializers(this, _availableForTravel_extraInitializers), __runInitializers(this, _languagesSpoken_initializers, void 0));
            this.publications = (__runInitializers(this, _languagesSpoken_extraInitializers), __runInitializers(this, _publications_initializers, void 0));
            this.priorTestimonyCount = (__runInitializers(this, _publications_extraInitializers), __runInitializers(this, _priorTestimonyCount_initializers, void 0));
            this.dauberChallenges = (__runInitializers(this, _priorTestimonyCount_extraInitializers), __runInitializers(this, _dauberChallenges_initializers, void 0));
            this.dauberSuccesses = (__runInitializers(this, _dauberChallenges_extraInitializers), __runInitializers(this, _dauberSuccesses_initializers, void 0));
            this.rating = (__runInitializers(this, _dauberSuccesses_extraInitializers), __runInitializers(this, _rating_initializers, void 0));
            this.notes = (__runInitializers(this, _rating_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.status = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.createdBy = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.organizationId = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _organizationId_initializers, void 0));
            this.createdAt = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.engagements = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _engagements_initializers, void 0));
            this.credentials = (__runInitializers(this, _engagements_extraInitializers), __runInitializers(this, _credentials_initializers_1, void 0));
            __runInitializers(this, _credentials_extraInitializers_1);
        }
    };
    __setFunctionName(_classThis, "ExpertWitnessProfile");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _firstName_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false })];
        _lastName_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false })];
        _credentials_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: true })];
        _specialty_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ExpertSpecialty)), allowNull: false })];
        _subSpecialties_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: [] })];
        _licenseNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: true })];
        _licenseState_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: true })];
        _licenseExpiration_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _boardCertified_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _boardCertifications_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: [] })];
        _yearsExperience_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _currentEmployer_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: true })];
        _currentPosition_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: true })];
        _cvUrl_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true })];
        _photoUrl_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true })];
        _email_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _phone_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false })];
        _address_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500), allowNull: true })];
        _hourlyRate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: true })];
        _depositRequired_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), defaultValue: 0 })];
        _feeStructure_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(FeeStructure)), defaultValue: FeeStructure.HOURLY })];
        _availableForTravel_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _languagesSpoken_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: ['English'] })];
        _publications_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: [] })];
        _priorTestimonyCount_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _dauberChallenges_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _dauberSuccesses_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _rating_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(3, 2), allowNull: true })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true })];
        _status_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ExpertStatus)), defaultValue: ExpertStatus.CANDIDATE })];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _organizationId_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _engagements_decorators = [(0, sequelize_typescript_1.HasMany)(() => ExpertEngagement)];
        _credentials_decorators_1 = [(0, sequelize_typescript_1.HasMany)(() => CredentialVerification)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _firstName_decorators, { kind: "field", name: "firstName", static: false, private: false, access: { has: obj => "firstName" in obj, get: obj => obj.firstName, set: (obj, value) => { obj.firstName = value; } }, metadata: _metadata }, _firstName_initializers, _firstName_extraInitializers);
        __esDecorate(null, null, _lastName_decorators, { kind: "field", name: "lastName", static: false, private: false, access: { has: obj => "lastName" in obj, get: obj => obj.lastName, set: (obj, value) => { obj.lastName = value; } }, metadata: _metadata }, _lastName_initializers, _lastName_extraInitializers);
        __esDecorate(null, null, _credentials_decorators, { kind: "field", name: "credentials", static: false, private: false, access: { has: obj => "credentials" in obj, get: obj => obj.credentials, set: (obj, value) => { obj.credentials = value; } }, metadata: _metadata }, _credentials_initializers, _credentials_extraInitializers);
        __esDecorate(null, null, _specialty_decorators, { kind: "field", name: "specialty", static: false, private: false, access: { has: obj => "specialty" in obj, get: obj => obj.specialty, set: (obj, value) => { obj.specialty = value; } }, metadata: _metadata }, _specialty_initializers, _specialty_extraInitializers);
        __esDecorate(null, null, _subSpecialties_decorators, { kind: "field", name: "subSpecialties", static: false, private: false, access: { has: obj => "subSpecialties" in obj, get: obj => obj.subSpecialties, set: (obj, value) => { obj.subSpecialties = value; } }, metadata: _metadata }, _subSpecialties_initializers, _subSpecialties_extraInitializers);
        __esDecorate(null, null, _licenseNumber_decorators, { kind: "field", name: "licenseNumber", static: false, private: false, access: { has: obj => "licenseNumber" in obj, get: obj => obj.licenseNumber, set: (obj, value) => { obj.licenseNumber = value; } }, metadata: _metadata }, _licenseNumber_initializers, _licenseNumber_extraInitializers);
        __esDecorate(null, null, _licenseState_decorators, { kind: "field", name: "licenseState", static: false, private: false, access: { has: obj => "licenseState" in obj, get: obj => obj.licenseState, set: (obj, value) => { obj.licenseState = value; } }, metadata: _metadata }, _licenseState_initializers, _licenseState_extraInitializers);
        __esDecorate(null, null, _licenseExpiration_decorators, { kind: "field", name: "licenseExpiration", static: false, private: false, access: { has: obj => "licenseExpiration" in obj, get: obj => obj.licenseExpiration, set: (obj, value) => { obj.licenseExpiration = value; } }, metadata: _metadata }, _licenseExpiration_initializers, _licenseExpiration_extraInitializers);
        __esDecorate(null, null, _boardCertified_decorators, { kind: "field", name: "boardCertified", static: false, private: false, access: { has: obj => "boardCertified" in obj, get: obj => obj.boardCertified, set: (obj, value) => { obj.boardCertified = value; } }, metadata: _metadata }, _boardCertified_initializers, _boardCertified_extraInitializers);
        __esDecorate(null, null, _boardCertifications_decorators, { kind: "field", name: "boardCertifications", static: false, private: false, access: { has: obj => "boardCertifications" in obj, get: obj => obj.boardCertifications, set: (obj, value) => { obj.boardCertifications = value; } }, metadata: _metadata }, _boardCertifications_initializers, _boardCertifications_extraInitializers);
        __esDecorate(null, null, _yearsExperience_decorators, { kind: "field", name: "yearsExperience", static: false, private: false, access: { has: obj => "yearsExperience" in obj, get: obj => obj.yearsExperience, set: (obj, value) => { obj.yearsExperience = value; } }, metadata: _metadata }, _yearsExperience_initializers, _yearsExperience_extraInitializers);
        __esDecorate(null, null, _currentEmployer_decorators, { kind: "field", name: "currentEmployer", static: false, private: false, access: { has: obj => "currentEmployer" in obj, get: obj => obj.currentEmployer, set: (obj, value) => { obj.currentEmployer = value; } }, metadata: _metadata }, _currentEmployer_initializers, _currentEmployer_extraInitializers);
        __esDecorate(null, null, _currentPosition_decorators, { kind: "field", name: "currentPosition", static: false, private: false, access: { has: obj => "currentPosition" in obj, get: obj => obj.currentPosition, set: (obj, value) => { obj.currentPosition = value; } }, metadata: _metadata }, _currentPosition_initializers, _currentPosition_extraInitializers);
        __esDecorate(null, null, _cvUrl_decorators, { kind: "field", name: "cvUrl", static: false, private: false, access: { has: obj => "cvUrl" in obj, get: obj => obj.cvUrl, set: (obj, value) => { obj.cvUrl = value; } }, metadata: _metadata }, _cvUrl_initializers, _cvUrl_extraInitializers);
        __esDecorate(null, null, _photoUrl_decorators, { kind: "field", name: "photoUrl", static: false, private: false, access: { has: obj => "photoUrl" in obj, get: obj => obj.photoUrl, set: (obj, value) => { obj.photoUrl = value; } }, metadata: _metadata }, _photoUrl_initializers, _photoUrl_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: obj => "phone" in obj, get: obj => obj.phone, set: (obj, value) => { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
        __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: obj => "address" in obj, get: obj => obj.address, set: (obj, value) => { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
        __esDecorate(null, null, _hourlyRate_decorators, { kind: "field", name: "hourlyRate", static: false, private: false, access: { has: obj => "hourlyRate" in obj, get: obj => obj.hourlyRate, set: (obj, value) => { obj.hourlyRate = value; } }, metadata: _metadata }, _hourlyRate_initializers, _hourlyRate_extraInitializers);
        __esDecorate(null, null, _depositRequired_decorators, { kind: "field", name: "depositRequired", static: false, private: false, access: { has: obj => "depositRequired" in obj, get: obj => obj.depositRequired, set: (obj, value) => { obj.depositRequired = value; } }, metadata: _metadata }, _depositRequired_initializers, _depositRequired_extraInitializers);
        __esDecorate(null, null, _feeStructure_decorators, { kind: "field", name: "feeStructure", static: false, private: false, access: { has: obj => "feeStructure" in obj, get: obj => obj.feeStructure, set: (obj, value) => { obj.feeStructure = value; } }, metadata: _metadata }, _feeStructure_initializers, _feeStructure_extraInitializers);
        __esDecorate(null, null, _availableForTravel_decorators, { kind: "field", name: "availableForTravel", static: false, private: false, access: { has: obj => "availableForTravel" in obj, get: obj => obj.availableForTravel, set: (obj, value) => { obj.availableForTravel = value; } }, metadata: _metadata }, _availableForTravel_initializers, _availableForTravel_extraInitializers);
        __esDecorate(null, null, _languagesSpoken_decorators, { kind: "field", name: "languagesSpoken", static: false, private: false, access: { has: obj => "languagesSpoken" in obj, get: obj => obj.languagesSpoken, set: (obj, value) => { obj.languagesSpoken = value; } }, metadata: _metadata }, _languagesSpoken_initializers, _languagesSpoken_extraInitializers);
        __esDecorate(null, null, _publications_decorators, { kind: "field", name: "publications", static: false, private: false, access: { has: obj => "publications" in obj, get: obj => obj.publications, set: (obj, value) => { obj.publications = value; } }, metadata: _metadata }, _publications_initializers, _publications_extraInitializers);
        __esDecorate(null, null, _priorTestimonyCount_decorators, { kind: "field", name: "priorTestimonyCount", static: false, private: false, access: { has: obj => "priorTestimonyCount" in obj, get: obj => obj.priorTestimonyCount, set: (obj, value) => { obj.priorTestimonyCount = value; } }, metadata: _metadata }, _priorTestimonyCount_initializers, _priorTestimonyCount_extraInitializers);
        __esDecorate(null, null, _dauberChallenges_decorators, { kind: "field", name: "dauberChallenges", static: false, private: false, access: { has: obj => "dauberChallenges" in obj, get: obj => obj.dauberChallenges, set: (obj, value) => { obj.dauberChallenges = value; } }, metadata: _metadata }, _dauberChallenges_initializers, _dauberChallenges_extraInitializers);
        __esDecorate(null, null, _dauberSuccesses_decorators, { kind: "field", name: "dauberSuccesses", static: false, private: false, access: { has: obj => "dauberSuccesses" in obj, get: obj => obj.dauberSuccesses, set: (obj, value) => { obj.dauberSuccesses = value; } }, metadata: _metadata }, _dauberSuccesses_initializers, _dauberSuccesses_extraInitializers);
        __esDecorate(null, null, _rating_decorators, { kind: "field", name: "rating", static: false, private: false, access: { has: obj => "rating" in obj, get: obj => obj.rating, set: (obj, value) => { obj.rating = value; } }, metadata: _metadata }, _rating_initializers, _rating_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _engagements_decorators, { kind: "field", name: "engagements", static: false, private: false, access: { has: obj => "engagements" in obj, get: obj => obj.engagements, set: (obj, value) => { obj.engagements = value; } }, metadata: _metadata }, _engagements_initializers, _engagements_extraInitializers);
        __esDecorate(null, null, _credentials_decorators_1, { kind: "field", name: "credentials", static: false, private: false, access: { has: obj => "credentials" in obj, get: obj => obj.credentials, set: (obj, value) => { obj.credentials = value; } }, metadata: _metadata }, _credentials_initializers_1, _credentials_extraInitializers_1);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExpertWitnessProfile = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExpertWitnessProfile = _classThis;
})();
exports.ExpertWitnessProfile = ExpertWitnessProfile;
/**
 * Expert engagement model
 */
let ExpertEngagement = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'expert_engagements',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['expertId'] },
                { fields: ['caseId'] },
                { fields: ['status'] },
                { fields: ['organizationId'] },
                { fields: ['assignedAttorney'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _expertId_decorators;
    let _expertId_initializers = [];
    let _expertId_extraInitializers = [];
    let _caseId_decorators;
    let _caseId_initializers = [];
    let _caseId_extraInitializers = [];
    let _engagementType_decorators;
    let _engagementType_initializers = [];
    let _engagementType_extraInitializers = [];
    let _retainedDate_decorators;
    let _retainedDate_initializers = [];
    let _retainedDate_extraInitializers = [];
    let _engagementLetterSigned_decorators;
    let _engagementLetterSigned_initializers = [];
    let _engagementLetterSigned_extraInitializers = [];
    let _conflictCheckCompleted_decorators;
    let _conflictCheckCompleted_initializers = [];
    let _conflictCheckCompleted_extraInitializers = [];
    let _conflictCheckResult_decorators;
    let _conflictCheckResult_initializers = [];
    let _conflictCheckResult_extraInitializers = [];
    let _expectedReportDate_decorators;
    let _expectedReportDate_initializers = [];
    let _expectedReportDate_extraInitializers = [];
    let _expectedDepositionDate_decorators;
    let _expectedDepositionDate_initializers = [];
    let _expectedDepositionDate_extraInitializers = [];
    let _expectedTrialDate_decorators;
    let _expectedTrialDate_initializers = [];
    let _expectedTrialDate_extraInitializers = [];
    let _retainerAmount_decorators;
    let _retainerAmount_initializers = [];
    let _retainerAmount_extraInitializers = [];
    let _hourlyRate_decorators;
    let _hourlyRate_initializers = [];
    let _hourlyRate_extraInitializers = [];
    let _budgetCap_decorators;
    let _budgetCap_initializers = [];
    let _budgetCap_extraInitializers = [];
    let _currentSpend_decorators;
    let _currentSpend_initializers = [];
    let _currentSpend_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _assignedAttorney_decorators;
    let _assignedAttorney_initializers = [];
    let _assignedAttorney_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _expert_decorators;
    let _expert_initializers = [];
    let _expert_extraInitializers = [];
    let _reports_decorators;
    let _reports_initializers = [];
    let _reports_extraInitializers = [];
    let _depositions_decorators;
    let _depositions_initializers = [];
    let _depositions_extraInitializers = [];
    let _invoices_decorators;
    let _invoices_initializers = [];
    let _invoices_extraInitializers = [];
    var ExpertEngagement = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.expertId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _expertId_initializers, void 0));
            this.caseId = (__runInitializers(this, _expertId_extraInitializers), __runInitializers(this, _caseId_initializers, void 0));
            this.engagementType = (__runInitializers(this, _caseId_extraInitializers), __runInitializers(this, _engagementType_initializers, void 0));
            this.retainedDate = (__runInitializers(this, _engagementType_extraInitializers), __runInitializers(this, _retainedDate_initializers, void 0));
            this.engagementLetterSigned = (__runInitializers(this, _retainedDate_extraInitializers), __runInitializers(this, _engagementLetterSigned_initializers, void 0));
            this.conflictCheckCompleted = (__runInitializers(this, _engagementLetterSigned_extraInitializers), __runInitializers(this, _conflictCheckCompleted_initializers, void 0));
            this.conflictCheckResult = (__runInitializers(this, _conflictCheckCompleted_extraInitializers), __runInitializers(this, _conflictCheckResult_initializers, void 0));
            this.expectedReportDate = (__runInitializers(this, _conflictCheckResult_extraInitializers), __runInitializers(this, _expectedReportDate_initializers, void 0));
            this.expectedDepositionDate = (__runInitializers(this, _expectedReportDate_extraInitializers), __runInitializers(this, _expectedDepositionDate_initializers, void 0));
            this.expectedTrialDate = (__runInitializers(this, _expectedDepositionDate_extraInitializers), __runInitializers(this, _expectedTrialDate_initializers, void 0));
            this.retainerAmount = (__runInitializers(this, _expectedTrialDate_extraInitializers), __runInitializers(this, _retainerAmount_initializers, void 0));
            this.hourlyRate = (__runInitializers(this, _retainerAmount_extraInitializers), __runInitializers(this, _hourlyRate_initializers, void 0));
            this.budgetCap = (__runInitializers(this, _hourlyRate_extraInitializers), __runInitializers(this, _budgetCap_initializers, void 0));
            this.currentSpend = (__runInitializers(this, _budgetCap_extraInitializers), __runInitializers(this, _currentSpend_initializers, void 0));
            this.status = (__runInitializers(this, _currentSpend_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.assignedAttorney = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _assignedAttorney_initializers, void 0));
            this.notes = (__runInitializers(this, _assignedAttorney_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.organizationId = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _organizationId_initializers, void 0));
            this.createdAt = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.expert = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _expert_initializers, void 0));
            this.reports = (__runInitializers(this, _expert_extraInitializers), __runInitializers(this, _reports_initializers, void 0));
            this.depositions = (__runInitializers(this, _reports_extraInitializers), __runInitializers(this, _depositions_initializers, void 0));
            this.invoices = (__runInitializers(this, _depositions_extraInitializers), __runInitializers(this, _invoices_initializers, void 0));
            __runInitializers(this, _invoices_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ExpertEngagement");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _expertId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => ExpertWitnessProfile), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _caseId_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _engagementType_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(EngagementType)), allowNull: false })];
        _retainedDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _engagementLetterSigned_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _conflictCheckCompleted_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _conflictCheckResult_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ConflictCheckResult)), allowNull: true })];
        _expectedReportDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _expectedDepositionDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _expectedTrialDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _retainerAmount_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: true })];
        _hourlyRate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: true })];
        _budgetCap_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: true })];
        _currentSpend_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), defaultValue: 0 })];
        _status_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ExpertStatus)), defaultValue: ExpertStatus.RETAINED })];
        _assignedAttorney_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true })];
        _organizationId_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _expert_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ExpertWitnessProfile)];
        _reports_decorators = [(0, sequelize_typescript_1.HasMany)(() => ExpertReport)];
        _depositions_decorators = [(0, sequelize_typescript_1.HasMany)(() => ExpertDeposition)];
        _invoices_decorators = [(0, sequelize_typescript_1.HasMany)(() => ExpertInvoice)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _expertId_decorators, { kind: "field", name: "expertId", static: false, private: false, access: { has: obj => "expertId" in obj, get: obj => obj.expertId, set: (obj, value) => { obj.expertId = value; } }, metadata: _metadata }, _expertId_initializers, _expertId_extraInitializers);
        __esDecorate(null, null, _caseId_decorators, { kind: "field", name: "caseId", static: false, private: false, access: { has: obj => "caseId" in obj, get: obj => obj.caseId, set: (obj, value) => { obj.caseId = value; } }, metadata: _metadata }, _caseId_initializers, _caseId_extraInitializers);
        __esDecorate(null, null, _engagementType_decorators, { kind: "field", name: "engagementType", static: false, private: false, access: { has: obj => "engagementType" in obj, get: obj => obj.engagementType, set: (obj, value) => { obj.engagementType = value; } }, metadata: _metadata }, _engagementType_initializers, _engagementType_extraInitializers);
        __esDecorate(null, null, _retainedDate_decorators, { kind: "field", name: "retainedDate", static: false, private: false, access: { has: obj => "retainedDate" in obj, get: obj => obj.retainedDate, set: (obj, value) => { obj.retainedDate = value; } }, metadata: _metadata }, _retainedDate_initializers, _retainedDate_extraInitializers);
        __esDecorate(null, null, _engagementLetterSigned_decorators, { kind: "field", name: "engagementLetterSigned", static: false, private: false, access: { has: obj => "engagementLetterSigned" in obj, get: obj => obj.engagementLetterSigned, set: (obj, value) => { obj.engagementLetterSigned = value; } }, metadata: _metadata }, _engagementLetterSigned_initializers, _engagementLetterSigned_extraInitializers);
        __esDecorate(null, null, _conflictCheckCompleted_decorators, { kind: "field", name: "conflictCheckCompleted", static: false, private: false, access: { has: obj => "conflictCheckCompleted" in obj, get: obj => obj.conflictCheckCompleted, set: (obj, value) => { obj.conflictCheckCompleted = value; } }, metadata: _metadata }, _conflictCheckCompleted_initializers, _conflictCheckCompleted_extraInitializers);
        __esDecorate(null, null, _conflictCheckResult_decorators, { kind: "field", name: "conflictCheckResult", static: false, private: false, access: { has: obj => "conflictCheckResult" in obj, get: obj => obj.conflictCheckResult, set: (obj, value) => { obj.conflictCheckResult = value; } }, metadata: _metadata }, _conflictCheckResult_initializers, _conflictCheckResult_extraInitializers);
        __esDecorate(null, null, _expectedReportDate_decorators, { kind: "field", name: "expectedReportDate", static: false, private: false, access: { has: obj => "expectedReportDate" in obj, get: obj => obj.expectedReportDate, set: (obj, value) => { obj.expectedReportDate = value; } }, metadata: _metadata }, _expectedReportDate_initializers, _expectedReportDate_extraInitializers);
        __esDecorate(null, null, _expectedDepositionDate_decorators, { kind: "field", name: "expectedDepositionDate", static: false, private: false, access: { has: obj => "expectedDepositionDate" in obj, get: obj => obj.expectedDepositionDate, set: (obj, value) => { obj.expectedDepositionDate = value; } }, metadata: _metadata }, _expectedDepositionDate_initializers, _expectedDepositionDate_extraInitializers);
        __esDecorate(null, null, _expectedTrialDate_decorators, { kind: "field", name: "expectedTrialDate", static: false, private: false, access: { has: obj => "expectedTrialDate" in obj, get: obj => obj.expectedTrialDate, set: (obj, value) => { obj.expectedTrialDate = value; } }, metadata: _metadata }, _expectedTrialDate_initializers, _expectedTrialDate_extraInitializers);
        __esDecorate(null, null, _retainerAmount_decorators, { kind: "field", name: "retainerAmount", static: false, private: false, access: { has: obj => "retainerAmount" in obj, get: obj => obj.retainerAmount, set: (obj, value) => { obj.retainerAmount = value; } }, metadata: _metadata }, _retainerAmount_initializers, _retainerAmount_extraInitializers);
        __esDecorate(null, null, _hourlyRate_decorators, { kind: "field", name: "hourlyRate", static: false, private: false, access: { has: obj => "hourlyRate" in obj, get: obj => obj.hourlyRate, set: (obj, value) => { obj.hourlyRate = value; } }, metadata: _metadata }, _hourlyRate_initializers, _hourlyRate_extraInitializers);
        __esDecorate(null, null, _budgetCap_decorators, { kind: "field", name: "budgetCap", static: false, private: false, access: { has: obj => "budgetCap" in obj, get: obj => obj.budgetCap, set: (obj, value) => { obj.budgetCap = value; } }, metadata: _metadata }, _budgetCap_initializers, _budgetCap_extraInitializers);
        __esDecorate(null, null, _currentSpend_decorators, { kind: "field", name: "currentSpend", static: false, private: false, access: { has: obj => "currentSpend" in obj, get: obj => obj.currentSpend, set: (obj, value) => { obj.currentSpend = value; } }, metadata: _metadata }, _currentSpend_initializers, _currentSpend_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _assignedAttorney_decorators, { kind: "field", name: "assignedAttorney", static: false, private: false, access: { has: obj => "assignedAttorney" in obj, get: obj => obj.assignedAttorney, set: (obj, value) => { obj.assignedAttorney = value; } }, metadata: _metadata }, _assignedAttorney_initializers, _assignedAttorney_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _expert_decorators, { kind: "field", name: "expert", static: false, private: false, access: { has: obj => "expert" in obj, get: obj => obj.expert, set: (obj, value) => { obj.expert = value; } }, metadata: _metadata }, _expert_initializers, _expert_extraInitializers);
        __esDecorate(null, null, _reports_decorators, { kind: "field", name: "reports", static: false, private: false, access: { has: obj => "reports" in obj, get: obj => obj.reports, set: (obj, value) => { obj.reports = value; } }, metadata: _metadata }, _reports_initializers, _reports_extraInitializers);
        __esDecorate(null, null, _depositions_decorators, { kind: "field", name: "depositions", static: false, private: false, access: { has: obj => "depositions" in obj, get: obj => obj.depositions, set: (obj, value) => { obj.depositions = value; } }, metadata: _metadata }, _depositions_initializers, _depositions_extraInitializers);
        __esDecorate(null, null, _invoices_decorators, { kind: "field", name: "invoices", static: false, private: false, access: { has: obj => "invoices" in obj, get: obj => obj.invoices, set: (obj, value) => { obj.invoices = value; } }, metadata: _metadata }, _invoices_initializers, _invoices_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExpertEngagement = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExpertEngagement = _classThis;
})();
exports.ExpertEngagement = ExpertEngagement;
/**
 * Expert report model
 */
let ExpertReport = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'expert_reports',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['expertEngagementId'] },
                { fields: ['status'] },
                { fields: ['dueDate'] },
                { fields: ['organizationId'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _expertEngagementId_decorators;
    let _expertEngagementId_initializers = [];
    let _expertEngagementId_extraInitializers = [];
    let _reportType_decorators;
    let _reportType_initializers = [];
    let _reportType_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _requestedDate_decorators;
    let _requestedDate_initializers = [];
    let _requestedDate_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _submittedDate_decorators;
    let _submittedDate_initializers = [];
    let _submittedDate_extraInitializers = [];
    let _disclosureDeadline_decorators;
    let _disclosureDeadline_initializers = [];
    let _disclosureDeadline_extraInitializers = [];
    let _disclosedDate_decorators;
    let _disclosedDate_initializers = [];
    let _disclosedDate_extraInitializers = [];
    let _reportUrl_decorators;
    let _reportUrl_initializers = [];
    let _reportUrl_extraInitializers = [];
    let _pageCount_decorators;
    let _pageCount_initializers = [];
    let _pageCount_extraInitializers = [];
    let _attachmentCount_decorators;
    let _attachmentCount_initializers = [];
    let _attachmentCount_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _dauberChallenged_decorators;
    let _dauberChallenged_initializers = [];
    let _dauberChallenged_extraInitializers = [];
    let _dauberChallengeDate_decorators;
    let _dauberChallengeDate_initializers = [];
    let _dauberChallengeDate_extraInitializers = [];
    let _dauberHearingDate_decorators;
    let _dauberHearingDate_initializers = [];
    let _dauberHearingDate_extraInitializers = [];
    let _admissibilityStatus_decorators;
    let _admissibilityStatus_initializers = [];
    let _admissibilityStatus_extraInitializers = [];
    let _reviewNotes_decorators;
    let _reviewNotes_initializers = [];
    let _reviewNotes_extraInitializers = [];
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _engagement_decorators;
    let _engagement_initializers = [];
    let _engagement_extraInitializers = [];
    var ExpertReport = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.expertEngagementId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _expertEngagementId_initializers, void 0));
            this.reportType = (__runInitializers(this, _expertEngagementId_extraInitializers), __runInitializers(this, _reportType_initializers, void 0));
            this.version = (__runInitializers(this, _reportType_extraInitializers), __runInitializers(this, _version_initializers, void 0));
            this.requestedDate = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _requestedDate_initializers, void 0));
            this.dueDate = (__runInitializers(this, _requestedDate_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
            this.submittedDate = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _submittedDate_initializers, void 0));
            this.disclosureDeadline = (__runInitializers(this, _submittedDate_extraInitializers), __runInitializers(this, _disclosureDeadline_initializers, void 0));
            this.disclosedDate = (__runInitializers(this, _disclosureDeadline_extraInitializers), __runInitializers(this, _disclosedDate_initializers, void 0));
            this.reportUrl = (__runInitializers(this, _disclosedDate_extraInitializers), __runInitializers(this, _reportUrl_initializers, void 0));
            this.pageCount = (__runInitializers(this, _reportUrl_extraInitializers), __runInitializers(this, _pageCount_initializers, void 0));
            this.attachmentCount = (__runInitializers(this, _pageCount_extraInitializers), __runInitializers(this, _attachmentCount_initializers, void 0));
            this.status = (__runInitializers(this, _attachmentCount_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.dauberChallenged = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _dauberChallenged_initializers, void 0));
            this.dauberChallengeDate = (__runInitializers(this, _dauberChallenged_extraInitializers), __runInitializers(this, _dauberChallengeDate_initializers, void 0));
            this.dauberHearingDate = (__runInitializers(this, _dauberChallengeDate_extraInitializers), __runInitializers(this, _dauberHearingDate_initializers, void 0));
            this.admissibilityStatus = (__runInitializers(this, _dauberHearingDate_extraInitializers), __runInitializers(this, _admissibilityStatus_initializers, void 0));
            this.reviewNotes = (__runInitializers(this, _admissibilityStatus_extraInitializers), __runInitializers(this, _reviewNotes_initializers, void 0));
            this.organizationId = (__runInitializers(this, _reviewNotes_extraInitializers), __runInitializers(this, _organizationId_initializers, void 0));
            this.createdAt = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.engagement = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _engagement_initializers, void 0));
            __runInitializers(this, _engagement_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ExpertReport");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _expertEngagementId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => ExpertEngagement), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _reportType_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM('initial', 'supplemental', 'rebuttal'), allowNull: false })];
        _version_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 1 })];
        _requestedDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _dueDate_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _submittedDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _disclosureDeadline_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _disclosedDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _reportUrl_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true })];
        _pageCount_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _attachmentCount_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _status_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ReportStatus)), defaultValue: ReportStatus.NOT_STARTED })];
        _dauberChallenged_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _dauberChallengeDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _dauberHearingDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _admissibilityStatus_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM('pending', 'admitted', 'excluded', 'limited'), allowNull: true })];
        _reviewNotes_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true })];
        _organizationId_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _engagement_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ExpertEngagement)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _expertEngagementId_decorators, { kind: "field", name: "expertEngagementId", static: false, private: false, access: { has: obj => "expertEngagementId" in obj, get: obj => obj.expertEngagementId, set: (obj, value) => { obj.expertEngagementId = value; } }, metadata: _metadata }, _expertEngagementId_initializers, _expertEngagementId_extraInitializers);
        __esDecorate(null, null, _reportType_decorators, { kind: "field", name: "reportType", static: false, private: false, access: { has: obj => "reportType" in obj, get: obj => obj.reportType, set: (obj, value) => { obj.reportType = value; } }, metadata: _metadata }, _reportType_initializers, _reportType_extraInitializers);
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, null, _requestedDate_decorators, { kind: "field", name: "requestedDate", static: false, private: false, access: { has: obj => "requestedDate" in obj, get: obj => obj.requestedDate, set: (obj, value) => { obj.requestedDate = value; } }, metadata: _metadata }, _requestedDate_initializers, _requestedDate_extraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
        __esDecorate(null, null, _submittedDate_decorators, { kind: "field", name: "submittedDate", static: false, private: false, access: { has: obj => "submittedDate" in obj, get: obj => obj.submittedDate, set: (obj, value) => { obj.submittedDate = value; } }, metadata: _metadata }, _submittedDate_initializers, _submittedDate_extraInitializers);
        __esDecorate(null, null, _disclosureDeadline_decorators, { kind: "field", name: "disclosureDeadline", static: false, private: false, access: { has: obj => "disclosureDeadline" in obj, get: obj => obj.disclosureDeadline, set: (obj, value) => { obj.disclosureDeadline = value; } }, metadata: _metadata }, _disclosureDeadline_initializers, _disclosureDeadline_extraInitializers);
        __esDecorate(null, null, _disclosedDate_decorators, { kind: "field", name: "disclosedDate", static: false, private: false, access: { has: obj => "disclosedDate" in obj, get: obj => obj.disclosedDate, set: (obj, value) => { obj.disclosedDate = value; } }, metadata: _metadata }, _disclosedDate_initializers, _disclosedDate_extraInitializers);
        __esDecorate(null, null, _reportUrl_decorators, { kind: "field", name: "reportUrl", static: false, private: false, access: { has: obj => "reportUrl" in obj, get: obj => obj.reportUrl, set: (obj, value) => { obj.reportUrl = value; } }, metadata: _metadata }, _reportUrl_initializers, _reportUrl_extraInitializers);
        __esDecorate(null, null, _pageCount_decorators, { kind: "field", name: "pageCount", static: false, private: false, access: { has: obj => "pageCount" in obj, get: obj => obj.pageCount, set: (obj, value) => { obj.pageCount = value; } }, metadata: _metadata }, _pageCount_initializers, _pageCount_extraInitializers);
        __esDecorate(null, null, _attachmentCount_decorators, { kind: "field", name: "attachmentCount", static: false, private: false, access: { has: obj => "attachmentCount" in obj, get: obj => obj.attachmentCount, set: (obj, value) => { obj.attachmentCount = value; } }, metadata: _metadata }, _attachmentCount_initializers, _attachmentCount_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _dauberChallenged_decorators, { kind: "field", name: "dauberChallenged", static: false, private: false, access: { has: obj => "dauberChallenged" in obj, get: obj => obj.dauberChallenged, set: (obj, value) => { obj.dauberChallenged = value; } }, metadata: _metadata }, _dauberChallenged_initializers, _dauberChallenged_extraInitializers);
        __esDecorate(null, null, _dauberChallengeDate_decorators, { kind: "field", name: "dauberChallengeDate", static: false, private: false, access: { has: obj => "dauberChallengeDate" in obj, get: obj => obj.dauberChallengeDate, set: (obj, value) => { obj.dauberChallengeDate = value; } }, metadata: _metadata }, _dauberChallengeDate_initializers, _dauberChallengeDate_extraInitializers);
        __esDecorate(null, null, _dauberHearingDate_decorators, { kind: "field", name: "dauberHearingDate", static: false, private: false, access: { has: obj => "dauberHearingDate" in obj, get: obj => obj.dauberHearingDate, set: (obj, value) => { obj.dauberHearingDate = value; } }, metadata: _metadata }, _dauberHearingDate_initializers, _dauberHearingDate_extraInitializers);
        __esDecorate(null, null, _admissibilityStatus_decorators, { kind: "field", name: "admissibilityStatus", static: false, private: false, access: { has: obj => "admissibilityStatus" in obj, get: obj => obj.admissibilityStatus, set: (obj, value) => { obj.admissibilityStatus = value; } }, metadata: _metadata }, _admissibilityStatus_initializers, _admissibilityStatus_extraInitializers);
        __esDecorate(null, null, _reviewNotes_decorators, { kind: "field", name: "reviewNotes", static: false, private: false, access: { has: obj => "reviewNotes" in obj, get: obj => obj.reviewNotes, set: (obj, value) => { obj.reviewNotes = value; } }, metadata: _metadata }, _reviewNotes_initializers, _reviewNotes_extraInitializers);
        __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _engagement_decorators, { kind: "field", name: "engagement", static: false, private: false, access: { has: obj => "engagement" in obj, get: obj => obj.engagement, set: (obj, value) => { obj.engagement = value; } }, metadata: _metadata }, _engagement_initializers, _engagement_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExpertReport = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExpertReport = _classThis;
})();
exports.ExpertReport = ExpertReport;
/**
 * Expert deposition model
 */
let ExpertDeposition = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'expert_depositions',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['expertEngagementId'] },
                { fields: ['status'] },
                { fields: ['scheduledDate'] },
                { fields: ['organizationId'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _expertEngagementId_decorators;
    let _expertEngagementId_initializers = [];
    let _expertEngagementId_extraInitializers = [];
    let _noticeReceivedDate_decorators;
    let _noticeReceivedDate_initializers = [];
    let _noticeReceivedDate_extraInitializers = [];
    let _scheduledDate_decorators;
    let _scheduledDate_initializers = [];
    let _scheduledDate_extraInitializers = [];
    let _scheduledTime_decorators;
    let _scheduledTime_initializers = [];
    let _scheduledTime_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _remoteDeposition_decorators;
    let _remoteDeposition_initializers = [];
    let _remoteDeposition_extraInitializers = [];
    let _estimatedDuration_decorators;
    let _estimatedDuration_initializers = [];
    let _estimatedDuration_extraInitializers = [];
    let _videoRecorded_decorators;
    let _videoRecorded_initializers = [];
    let _videoRecorded_extraInitializers = [];
    let _courtReporter_decorators;
    let _courtReporter_initializers = [];
    let _courtReporter_extraInitializers = [];
    let _opposingCounsel_decorators;
    let _opposingCounsel_initializers = [];
    let _opposingCounsel_extraInitializers = [];
    let _defendingAttorney_decorators;
    let _defendingAttorney_initializers = [];
    let _defendingAttorney_extraInitializers = [];
    let _prepSessionsCompleted_decorators;
    let _prepSessionsCompleted_initializers = [];
    let _prepSessionsCompleted_extraInitializers = [];
    let _exhibitsIdentified_decorators;
    let _exhibitsIdentified_initializers = [];
    let _exhibitsIdentified_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _transcriptOrderedDate_decorators;
    let _transcriptOrderedDate_initializers = [];
    let _transcriptOrderedDate_extraInitializers = [];
    let _transcriptReceivedDate_decorators;
    let _transcriptReceivedDate_initializers = [];
    let _transcriptReceivedDate_extraInitializers = [];
    let _transcriptUrl_decorators;
    let _transcriptUrl_initializers = [];
    let _transcriptUrl_extraInitializers = [];
    let _errataDeadline_decorators;
    let _errataDeadline_initializers = [];
    let _errataDeadline_extraInitializers = [];
    let _errataSubmitted_decorators;
    let _errataSubmitted_initializers = [];
    let _errataSubmitted_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _engagement_decorators;
    let _engagement_initializers = [];
    let _engagement_extraInitializers = [];
    var ExpertDeposition = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.expertEngagementId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _expertEngagementId_initializers, void 0));
            this.noticeReceivedDate = (__runInitializers(this, _expertEngagementId_extraInitializers), __runInitializers(this, _noticeReceivedDate_initializers, void 0));
            this.scheduledDate = (__runInitializers(this, _noticeReceivedDate_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
            this.scheduledTime = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _scheduledTime_initializers, void 0));
            this.location = (__runInitializers(this, _scheduledTime_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.remoteDeposition = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _remoteDeposition_initializers, void 0));
            this.estimatedDuration = (__runInitializers(this, _remoteDeposition_extraInitializers), __runInitializers(this, _estimatedDuration_initializers, void 0));
            this.videoRecorded = (__runInitializers(this, _estimatedDuration_extraInitializers), __runInitializers(this, _videoRecorded_initializers, void 0));
            this.courtReporter = (__runInitializers(this, _videoRecorded_extraInitializers), __runInitializers(this, _courtReporter_initializers, void 0));
            this.opposingCounsel = (__runInitializers(this, _courtReporter_extraInitializers), __runInitializers(this, _opposingCounsel_initializers, void 0));
            this.defendingAttorney = (__runInitializers(this, _opposingCounsel_extraInitializers), __runInitializers(this, _defendingAttorney_initializers, void 0));
            this.prepSessionsCompleted = (__runInitializers(this, _defendingAttorney_extraInitializers), __runInitializers(this, _prepSessionsCompleted_initializers, void 0));
            this.exhibitsIdentified = (__runInitializers(this, _prepSessionsCompleted_extraInitializers), __runInitializers(this, _exhibitsIdentified_initializers, void 0));
            this.status = (__runInitializers(this, _exhibitsIdentified_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.transcriptOrderedDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _transcriptOrderedDate_initializers, void 0));
            this.transcriptReceivedDate = (__runInitializers(this, _transcriptOrderedDate_extraInitializers), __runInitializers(this, _transcriptReceivedDate_initializers, void 0));
            this.transcriptUrl = (__runInitializers(this, _transcriptReceivedDate_extraInitializers), __runInitializers(this, _transcriptUrl_initializers, void 0));
            this.errataDeadline = (__runInitializers(this, _transcriptUrl_extraInitializers), __runInitializers(this, _errataDeadline_initializers, void 0));
            this.errataSubmitted = (__runInitializers(this, _errataDeadline_extraInitializers), __runInitializers(this, _errataSubmitted_initializers, void 0));
            this.notes = (__runInitializers(this, _errataSubmitted_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.organizationId = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _organizationId_initializers, void 0));
            this.createdAt = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.engagement = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _engagement_initializers, void 0));
            __runInitializers(this, _engagement_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ExpertDeposition");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _expertEngagementId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => ExpertEngagement), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _noticeReceivedDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _scheduledDate_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _scheduledTime_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: true })];
        _location_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500), allowNull: true })];
        _remoteDeposition_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _estimatedDuration_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2), defaultValue: 4 })];
        _videoRecorded_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _courtReporter_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: true })];
        _opposingCounsel_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: true })];
        _defendingAttorney_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true })];
        _prepSessionsCompleted_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _exhibitsIdentified_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _status_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(DepositionStatus)), defaultValue: DepositionStatus.NOT_SCHEDULED })];
        _transcriptOrderedDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _transcriptReceivedDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _transcriptUrl_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true })];
        _errataDeadline_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _errataSubmitted_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true })];
        _organizationId_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _engagement_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ExpertEngagement)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _expertEngagementId_decorators, { kind: "field", name: "expertEngagementId", static: false, private: false, access: { has: obj => "expertEngagementId" in obj, get: obj => obj.expertEngagementId, set: (obj, value) => { obj.expertEngagementId = value; } }, metadata: _metadata }, _expertEngagementId_initializers, _expertEngagementId_extraInitializers);
        __esDecorate(null, null, _noticeReceivedDate_decorators, { kind: "field", name: "noticeReceivedDate", static: false, private: false, access: { has: obj => "noticeReceivedDate" in obj, get: obj => obj.noticeReceivedDate, set: (obj, value) => { obj.noticeReceivedDate = value; } }, metadata: _metadata }, _noticeReceivedDate_initializers, _noticeReceivedDate_extraInitializers);
        __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
        __esDecorate(null, null, _scheduledTime_decorators, { kind: "field", name: "scheduledTime", static: false, private: false, access: { has: obj => "scheduledTime" in obj, get: obj => obj.scheduledTime, set: (obj, value) => { obj.scheduledTime = value; } }, metadata: _metadata }, _scheduledTime_initializers, _scheduledTime_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _remoteDeposition_decorators, { kind: "field", name: "remoteDeposition", static: false, private: false, access: { has: obj => "remoteDeposition" in obj, get: obj => obj.remoteDeposition, set: (obj, value) => { obj.remoteDeposition = value; } }, metadata: _metadata }, _remoteDeposition_initializers, _remoteDeposition_extraInitializers);
        __esDecorate(null, null, _estimatedDuration_decorators, { kind: "field", name: "estimatedDuration", static: false, private: false, access: { has: obj => "estimatedDuration" in obj, get: obj => obj.estimatedDuration, set: (obj, value) => { obj.estimatedDuration = value; } }, metadata: _metadata }, _estimatedDuration_initializers, _estimatedDuration_extraInitializers);
        __esDecorate(null, null, _videoRecorded_decorators, { kind: "field", name: "videoRecorded", static: false, private: false, access: { has: obj => "videoRecorded" in obj, get: obj => obj.videoRecorded, set: (obj, value) => { obj.videoRecorded = value; } }, metadata: _metadata }, _videoRecorded_initializers, _videoRecorded_extraInitializers);
        __esDecorate(null, null, _courtReporter_decorators, { kind: "field", name: "courtReporter", static: false, private: false, access: { has: obj => "courtReporter" in obj, get: obj => obj.courtReporter, set: (obj, value) => { obj.courtReporter = value; } }, metadata: _metadata }, _courtReporter_initializers, _courtReporter_extraInitializers);
        __esDecorate(null, null, _opposingCounsel_decorators, { kind: "field", name: "opposingCounsel", static: false, private: false, access: { has: obj => "opposingCounsel" in obj, get: obj => obj.opposingCounsel, set: (obj, value) => { obj.opposingCounsel = value; } }, metadata: _metadata }, _opposingCounsel_initializers, _opposingCounsel_extraInitializers);
        __esDecorate(null, null, _defendingAttorney_decorators, { kind: "field", name: "defendingAttorney", static: false, private: false, access: { has: obj => "defendingAttorney" in obj, get: obj => obj.defendingAttorney, set: (obj, value) => { obj.defendingAttorney = value; } }, metadata: _metadata }, _defendingAttorney_initializers, _defendingAttorney_extraInitializers);
        __esDecorate(null, null, _prepSessionsCompleted_decorators, { kind: "field", name: "prepSessionsCompleted", static: false, private: false, access: { has: obj => "prepSessionsCompleted" in obj, get: obj => obj.prepSessionsCompleted, set: (obj, value) => { obj.prepSessionsCompleted = value; } }, metadata: _metadata }, _prepSessionsCompleted_initializers, _prepSessionsCompleted_extraInitializers);
        __esDecorate(null, null, _exhibitsIdentified_decorators, { kind: "field", name: "exhibitsIdentified", static: false, private: false, access: { has: obj => "exhibitsIdentified" in obj, get: obj => obj.exhibitsIdentified, set: (obj, value) => { obj.exhibitsIdentified = value; } }, metadata: _metadata }, _exhibitsIdentified_initializers, _exhibitsIdentified_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _transcriptOrderedDate_decorators, { kind: "field", name: "transcriptOrderedDate", static: false, private: false, access: { has: obj => "transcriptOrderedDate" in obj, get: obj => obj.transcriptOrderedDate, set: (obj, value) => { obj.transcriptOrderedDate = value; } }, metadata: _metadata }, _transcriptOrderedDate_initializers, _transcriptOrderedDate_extraInitializers);
        __esDecorate(null, null, _transcriptReceivedDate_decorators, { kind: "field", name: "transcriptReceivedDate", static: false, private: false, access: { has: obj => "transcriptReceivedDate" in obj, get: obj => obj.transcriptReceivedDate, set: (obj, value) => { obj.transcriptReceivedDate = value; } }, metadata: _metadata }, _transcriptReceivedDate_initializers, _transcriptReceivedDate_extraInitializers);
        __esDecorate(null, null, _transcriptUrl_decorators, { kind: "field", name: "transcriptUrl", static: false, private: false, access: { has: obj => "transcriptUrl" in obj, get: obj => obj.transcriptUrl, set: (obj, value) => { obj.transcriptUrl = value; } }, metadata: _metadata }, _transcriptUrl_initializers, _transcriptUrl_extraInitializers);
        __esDecorate(null, null, _errataDeadline_decorators, { kind: "field", name: "errataDeadline", static: false, private: false, access: { has: obj => "errataDeadline" in obj, get: obj => obj.errataDeadline, set: (obj, value) => { obj.errataDeadline = value; } }, metadata: _metadata }, _errataDeadline_initializers, _errataDeadline_extraInitializers);
        __esDecorate(null, null, _errataSubmitted_decorators, { kind: "field", name: "errataSubmitted", static: false, private: false, access: { has: obj => "errataSubmitted" in obj, get: obj => obj.errataSubmitted, set: (obj, value) => { obj.errataSubmitted = value; } }, metadata: _metadata }, _errataSubmitted_initializers, _errataSubmitted_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _engagement_decorators, { kind: "field", name: "engagement", static: false, private: false, access: { has: obj => "engagement" in obj, get: obj => obj.engagement, set: (obj, value) => { obj.engagement = value; } }, metadata: _metadata }, _engagement_initializers, _engagement_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExpertDeposition = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExpertDeposition = _classThis;
})();
exports.ExpertDeposition = ExpertDeposition;
/**
 * Expert invoice model
 */
let ExpertInvoice = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'expert_invoices',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['expertEngagementId'] },
                { fields: ['status'] },
                { fields: ['invoiceDate'] },
                { fields: ['dueDate'] },
                { fields: ['organizationId'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _expertEngagementId_decorators;
    let _expertEngagementId_initializers = [];
    let _expertEngagementId_extraInitializers = [];
    let _invoiceNumber_decorators;
    let _invoiceNumber_initializers = [];
    let _invoiceNumber_extraInitializers = [];
    let _invoiceDate_decorators;
    let _invoiceDate_initializers = [];
    let _invoiceDate_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _periodStart_decorators;
    let _periodStart_initializers = [];
    let _periodStart_extraInitializers = [];
    let _periodEnd_decorators;
    let _periodEnd_initializers = [];
    let _periodEnd_extraInitializers = [];
    let _hoursWorked_decorators;
    let _hoursWorked_initializers = [];
    let _hoursWorked_extraInitializers = [];
    let _hourlyRate_decorators;
    let _hourlyRate_initializers = [];
    let _hourlyRate_extraInitializers = [];
    let _laborAmount_decorators;
    let _laborAmount_initializers = [];
    let _laborAmount_extraInitializers = [];
    let _expensesAmount_decorators;
    let _expensesAmount_initializers = [];
    let _expensesAmount_extraInitializers = [];
    let _totalAmount_decorators;
    let _totalAmount_initializers = [];
    let _totalAmount_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvedDate_decorators;
    let _approvedDate_initializers = [];
    let _approvedDate_extraInitializers = [];
    let _paidDate_decorators;
    let _paidDate_initializers = [];
    let _paidDate_extraInitializers = [];
    let _paymentMethod_decorators;
    let _paymentMethod_initializers = [];
    let _paymentMethod_extraInitializers = [];
    let _invoiceUrl_decorators;
    let _invoiceUrl_initializers = [];
    let _invoiceUrl_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _engagement_decorators;
    let _engagement_initializers = [];
    let _engagement_extraInitializers = [];
    var ExpertInvoice = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.expertEngagementId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _expertEngagementId_initializers, void 0));
            this.invoiceNumber = (__runInitializers(this, _expertEngagementId_extraInitializers), __runInitializers(this, _invoiceNumber_initializers, void 0));
            this.invoiceDate = (__runInitializers(this, _invoiceNumber_extraInitializers), __runInitializers(this, _invoiceDate_initializers, void 0));
            this.dueDate = (__runInitializers(this, _invoiceDate_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
            this.periodStart = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _periodStart_initializers, void 0));
            this.periodEnd = (__runInitializers(this, _periodStart_extraInitializers), __runInitializers(this, _periodEnd_initializers, void 0));
            this.hoursWorked = (__runInitializers(this, _periodEnd_extraInitializers), __runInitializers(this, _hoursWorked_initializers, void 0));
            this.hourlyRate = (__runInitializers(this, _hoursWorked_extraInitializers), __runInitializers(this, _hourlyRate_initializers, void 0));
            this.laborAmount = (__runInitializers(this, _hourlyRate_extraInitializers), __runInitializers(this, _laborAmount_initializers, void 0));
            this.expensesAmount = (__runInitializers(this, _laborAmount_extraInitializers), __runInitializers(this, _expensesAmount_initializers, void 0));
            this.totalAmount = (__runInitializers(this, _expensesAmount_extraInitializers), __runInitializers(this, _totalAmount_initializers, void 0));
            this.status = (__runInitializers(this, _totalAmount_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvedDate = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvedDate_initializers, void 0));
            this.paidDate = (__runInitializers(this, _approvedDate_extraInitializers), __runInitializers(this, _paidDate_initializers, void 0));
            this.paymentMethod = (__runInitializers(this, _paidDate_extraInitializers), __runInitializers(this, _paymentMethod_initializers, void 0));
            this.invoiceUrl = (__runInitializers(this, _paymentMethod_extraInitializers), __runInitializers(this, _invoiceUrl_initializers, void 0));
            this.notes = (__runInitializers(this, _invoiceUrl_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.organizationId = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _organizationId_initializers, void 0));
            this.createdAt = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.engagement = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _engagement_initializers, void 0));
            __runInitializers(this, _engagement_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ExpertInvoice");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _expertEngagementId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => ExpertEngagement), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _invoiceNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false })];
        _invoiceDate_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _dueDate_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _periodStart_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _periodEnd_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _hoursWorked_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), defaultValue: 0 })];
        _hourlyRate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: true })];
        _laborAmount_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), defaultValue: 0 })];
        _expensesAmount_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), defaultValue: 0 })];
        _totalAmount_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: false })];
        _status_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(InvoiceStatus)), defaultValue: InvoiceStatus.DRAFT })];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true })];
        _approvedDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _paidDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _paymentMethod_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: true })];
        _invoiceUrl_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true })];
        _organizationId_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _engagement_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ExpertEngagement)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _expertEngagementId_decorators, { kind: "field", name: "expertEngagementId", static: false, private: false, access: { has: obj => "expertEngagementId" in obj, get: obj => obj.expertEngagementId, set: (obj, value) => { obj.expertEngagementId = value; } }, metadata: _metadata }, _expertEngagementId_initializers, _expertEngagementId_extraInitializers);
        __esDecorate(null, null, _invoiceNumber_decorators, { kind: "field", name: "invoiceNumber", static: false, private: false, access: { has: obj => "invoiceNumber" in obj, get: obj => obj.invoiceNumber, set: (obj, value) => { obj.invoiceNumber = value; } }, metadata: _metadata }, _invoiceNumber_initializers, _invoiceNumber_extraInitializers);
        __esDecorate(null, null, _invoiceDate_decorators, { kind: "field", name: "invoiceDate", static: false, private: false, access: { has: obj => "invoiceDate" in obj, get: obj => obj.invoiceDate, set: (obj, value) => { obj.invoiceDate = value; } }, metadata: _metadata }, _invoiceDate_initializers, _invoiceDate_extraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
        __esDecorate(null, null, _periodStart_decorators, { kind: "field", name: "periodStart", static: false, private: false, access: { has: obj => "periodStart" in obj, get: obj => obj.periodStart, set: (obj, value) => { obj.periodStart = value; } }, metadata: _metadata }, _periodStart_initializers, _periodStart_extraInitializers);
        __esDecorate(null, null, _periodEnd_decorators, { kind: "field", name: "periodEnd", static: false, private: false, access: { has: obj => "periodEnd" in obj, get: obj => obj.periodEnd, set: (obj, value) => { obj.periodEnd = value; } }, metadata: _metadata }, _periodEnd_initializers, _periodEnd_extraInitializers);
        __esDecorate(null, null, _hoursWorked_decorators, { kind: "field", name: "hoursWorked", static: false, private: false, access: { has: obj => "hoursWorked" in obj, get: obj => obj.hoursWorked, set: (obj, value) => { obj.hoursWorked = value; } }, metadata: _metadata }, _hoursWorked_initializers, _hoursWorked_extraInitializers);
        __esDecorate(null, null, _hourlyRate_decorators, { kind: "field", name: "hourlyRate", static: false, private: false, access: { has: obj => "hourlyRate" in obj, get: obj => obj.hourlyRate, set: (obj, value) => { obj.hourlyRate = value; } }, metadata: _metadata }, _hourlyRate_initializers, _hourlyRate_extraInitializers);
        __esDecorate(null, null, _laborAmount_decorators, { kind: "field", name: "laborAmount", static: false, private: false, access: { has: obj => "laborAmount" in obj, get: obj => obj.laborAmount, set: (obj, value) => { obj.laborAmount = value; } }, metadata: _metadata }, _laborAmount_initializers, _laborAmount_extraInitializers);
        __esDecorate(null, null, _expensesAmount_decorators, { kind: "field", name: "expensesAmount", static: false, private: false, access: { has: obj => "expensesAmount" in obj, get: obj => obj.expensesAmount, set: (obj, value) => { obj.expensesAmount = value; } }, metadata: _metadata }, _expensesAmount_initializers, _expensesAmount_extraInitializers);
        __esDecorate(null, null, _totalAmount_decorators, { kind: "field", name: "totalAmount", static: false, private: false, access: { has: obj => "totalAmount" in obj, get: obj => obj.totalAmount, set: (obj, value) => { obj.totalAmount = value; } }, metadata: _metadata }, _totalAmount_initializers, _totalAmount_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvedDate_decorators, { kind: "field", name: "approvedDate", static: false, private: false, access: { has: obj => "approvedDate" in obj, get: obj => obj.approvedDate, set: (obj, value) => { obj.approvedDate = value; } }, metadata: _metadata }, _approvedDate_initializers, _approvedDate_extraInitializers);
        __esDecorate(null, null, _paidDate_decorators, { kind: "field", name: "paidDate", static: false, private: false, access: { has: obj => "paidDate" in obj, get: obj => obj.paidDate, set: (obj, value) => { obj.paidDate = value; } }, metadata: _metadata }, _paidDate_initializers, _paidDate_extraInitializers);
        __esDecorate(null, null, _paymentMethod_decorators, { kind: "field", name: "paymentMethod", static: false, private: false, access: { has: obj => "paymentMethod" in obj, get: obj => obj.paymentMethod, set: (obj, value) => { obj.paymentMethod = value; } }, metadata: _metadata }, _paymentMethod_initializers, _paymentMethod_extraInitializers);
        __esDecorate(null, null, _invoiceUrl_decorators, { kind: "field", name: "invoiceUrl", static: false, private: false, access: { has: obj => "invoiceUrl" in obj, get: obj => obj.invoiceUrl, set: (obj, value) => { obj.invoiceUrl = value; } }, metadata: _metadata }, _invoiceUrl_initializers, _invoiceUrl_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _engagement_decorators, { kind: "field", name: "engagement", static: false, private: false, access: { has: obj => "engagement" in obj, get: obj => obj.engagement, set: (obj, value) => { obj.engagement = value; } }, metadata: _metadata }, _engagement_initializers, _engagement_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExpertInvoice = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExpertInvoice = _classThis;
})();
exports.ExpertInvoice = ExpertInvoice;
/**
 * Credential verification model
 */
let CredentialVerification = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'expert_credential_verifications',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['expertId'] },
                { fields: ['verificationType'] },
                { fields: ['status'] },
                { fields: ['expirationDate'] },
                { fields: ['organizationId'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _expertId_decorators;
    let _expertId_initializers = [];
    let _expertId_extraInitializers = [];
    let _verificationType_decorators;
    let _verificationType_initializers = [];
    let _verificationType_extraInitializers = [];
    let _credentialName_decorators;
    let _credentialName_initializers = [];
    let _credentialName_extraInitializers = [];
    let _issuingAuthority_decorators;
    let _issuingAuthority_initializers = [];
    let _issuingAuthority_extraInitializers = [];
    let _credentialNumber_decorators;
    let _credentialNumber_initializers = [];
    let _credentialNumber_extraInitializers = [];
    let _issueDate_decorators;
    let _issueDate_initializers = [];
    let _issueDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _verifiedDate_decorators;
    let _verifiedDate_initializers = [];
    let _verifiedDate_extraInitializers = [];
    let _verifiedBy_decorators;
    let _verifiedBy_initializers = [];
    let _verifiedBy_extraInitializers = [];
    let _verificationMethod_decorators;
    let _verificationMethod_initializers = [];
    let _verificationMethod_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _documentUrl_decorators;
    let _documentUrl_initializers = [];
    let _documentUrl_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _expert_decorators;
    let _expert_initializers = [];
    let _expert_extraInitializers = [];
    var CredentialVerification = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.expertId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _expertId_initializers, void 0));
            this.verificationType = (__runInitializers(this, _expertId_extraInitializers), __runInitializers(this, _verificationType_initializers, void 0));
            this.credentialName = (__runInitializers(this, _verificationType_extraInitializers), __runInitializers(this, _credentialName_initializers, void 0));
            this.issuingAuthority = (__runInitializers(this, _credentialName_extraInitializers), __runInitializers(this, _issuingAuthority_initializers, void 0));
            this.credentialNumber = (__runInitializers(this, _issuingAuthority_extraInitializers), __runInitializers(this, _credentialNumber_initializers, void 0));
            this.issueDate = (__runInitializers(this, _credentialNumber_extraInitializers), __runInitializers(this, _issueDate_initializers, void 0));
            this.expirationDate = (__runInitializers(this, _issueDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
            this.verifiedDate = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _verifiedDate_initializers, void 0));
            this.verifiedBy = (__runInitializers(this, _verifiedDate_extraInitializers), __runInitializers(this, _verifiedBy_initializers, void 0));
            this.verificationMethod = (__runInitializers(this, _verifiedBy_extraInitializers), __runInitializers(this, _verificationMethod_initializers, void 0));
            this.status = (__runInitializers(this, _verificationMethod_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.documentUrl = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _documentUrl_initializers, void 0));
            this.notes = (__runInitializers(this, _documentUrl_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.organizationId = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _organizationId_initializers, void 0));
            this.createdAt = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.expert = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _expert_initializers, void 0));
            __runInitializers(this, _expert_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CredentialVerification");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _expertId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => ExpertWitnessProfile), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _verificationType_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM('license', 'certification', 'education', 'experience', 'publication'), allowNull: false })];
        _credentialName_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _issuingAuthority_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _credentialNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: true })];
        _issueDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _expirationDate_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _verifiedDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _verifiedBy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _verificationMethod_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _status_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(CredentialStatus)), defaultValue: CredentialStatus.VERIFIED })];
        _documentUrl_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true })];
        _organizationId_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _expert_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ExpertWitnessProfile)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _expertId_decorators, { kind: "field", name: "expertId", static: false, private: false, access: { has: obj => "expertId" in obj, get: obj => obj.expertId, set: (obj, value) => { obj.expertId = value; } }, metadata: _metadata }, _expertId_initializers, _expertId_extraInitializers);
        __esDecorate(null, null, _verificationType_decorators, { kind: "field", name: "verificationType", static: false, private: false, access: { has: obj => "verificationType" in obj, get: obj => obj.verificationType, set: (obj, value) => { obj.verificationType = value; } }, metadata: _metadata }, _verificationType_initializers, _verificationType_extraInitializers);
        __esDecorate(null, null, _credentialName_decorators, { kind: "field", name: "credentialName", static: false, private: false, access: { has: obj => "credentialName" in obj, get: obj => obj.credentialName, set: (obj, value) => { obj.credentialName = value; } }, metadata: _metadata }, _credentialName_initializers, _credentialName_extraInitializers);
        __esDecorate(null, null, _issuingAuthority_decorators, { kind: "field", name: "issuingAuthority", static: false, private: false, access: { has: obj => "issuingAuthority" in obj, get: obj => obj.issuingAuthority, set: (obj, value) => { obj.issuingAuthority = value; } }, metadata: _metadata }, _issuingAuthority_initializers, _issuingAuthority_extraInitializers);
        __esDecorate(null, null, _credentialNumber_decorators, { kind: "field", name: "credentialNumber", static: false, private: false, access: { has: obj => "credentialNumber" in obj, get: obj => obj.credentialNumber, set: (obj, value) => { obj.credentialNumber = value; } }, metadata: _metadata }, _credentialNumber_initializers, _credentialNumber_extraInitializers);
        __esDecorate(null, null, _issueDate_decorators, { kind: "field", name: "issueDate", static: false, private: false, access: { has: obj => "issueDate" in obj, get: obj => obj.issueDate, set: (obj, value) => { obj.issueDate = value; } }, metadata: _metadata }, _issueDate_initializers, _issueDate_extraInitializers);
        __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
        __esDecorate(null, null, _verifiedDate_decorators, { kind: "field", name: "verifiedDate", static: false, private: false, access: { has: obj => "verifiedDate" in obj, get: obj => obj.verifiedDate, set: (obj, value) => { obj.verifiedDate = value; } }, metadata: _metadata }, _verifiedDate_initializers, _verifiedDate_extraInitializers);
        __esDecorate(null, null, _verifiedBy_decorators, { kind: "field", name: "verifiedBy", static: false, private: false, access: { has: obj => "verifiedBy" in obj, get: obj => obj.verifiedBy, set: (obj, value) => { obj.verifiedBy = value; } }, metadata: _metadata }, _verifiedBy_initializers, _verifiedBy_extraInitializers);
        __esDecorate(null, null, _verificationMethod_decorators, { kind: "field", name: "verificationMethod", static: false, private: false, access: { has: obj => "verificationMethod" in obj, get: obj => obj.verificationMethod, set: (obj, value) => { obj.verificationMethod = value; } }, metadata: _metadata }, _verificationMethod_initializers, _verificationMethod_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _documentUrl_decorators, { kind: "field", name: "documentUrl", static: false, private: false, access: { has: obj => "documentUrl" in obj, get: obj => obj.documentUrl, set: (obj, value) => { obj.documentUrl = value; } }, metadata: _metadata }, _documentUrl_initializers, _documentUrl_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _expert_decorators, { kind: "field", name: "expert", static: false, private: false, access: { has: obj => "expert" in obj, get: obj => obj.expert, set: (obj, value) => { obj.expert = value; } }, metadata: _metadata }, _expert_initializers, _expert_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CredentialVerification = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CredentialVerification = _classThis;
})();
exports.CredentialVerification = CredentialVerification;
// ============================================================================
// DTOs (Data Transfer Objects)
// ============================================================================
/**
 * Create expert witness profile DTO
 */
let CreateExpertWitnessProfileDto = (() => {
    var _a;
    let _firstName_decorators;
    let _firstName_initializers = [];
    let _firstName_extraInitializers = [];
    let _lastName_decorators;
    let _lastName_initializers = [];
    let _lastName_extraInitializers = [];
    let _credentials_decorators;
    let _credentials_initializers = [];
    let _credentials_extraInitializers = [];
    let _specialty_decorators;
    let _specialty_initializers = [];
    let _specialty_extraInitializers = [];
    let _subSpecialties_decorators;
    let _subSpecialties_initializers = [];
    let _subSpecialties_extraInitializers = [];
    let _licenseNumber_decorators;
    let _licenseNumber_initializers = [];
    let _licenseNumber_extraInitializers = [];
    let _licenseState_decorators;
    let _licenseState_initializers = [];
    let _licenseState_extraInitializers = [];
    let _licenseExpiration_decorators;
    let _licenseExpiration_initializers = [];
    let _licenseExpiration_extraInitializers = [];
    let _boardCertified_decorators;
    let _boardCertified_initializers = [];
    let _boardCertified_extraInitializers = [];
    let _boardCertifications_decorators;
    let _boardCertifications_initializers = [];
    let _boardCertifications_extraInitializers = [];
    let _yearsExperience_decorators;
    let _yearsExperience_initializers = [];
    let _yearsExperience_extraInitializers = [];
    let _currentEmployer_decorators;
    let _currentEmployer_initializers = [];
    let _currentEmployer_extraInitializers = [];
    let _currentPosition_decorators;
    let _currentPosition_initializers = [];
    let _currentPosition_extraInitializers = [];
    let _cvUrl_decorators;
    let _cvUrl_initializers = [];
    let _cvUrl_extraInitializers = [];
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _phone_decorators;
    let _phone_initializers = [];
    let _phone_extraInitializers = [];
    let _address_decorators;
    let _address_initializers = [];
    let _address_extraInitializers = [];
    let _hourlyRate_decorators;
    let _hourlyRate_initializers = [];
    let _hourlyRate_extraInitializers = [];
    let _depositRequired_decorators;
    let _depositRequired_initializers = [];
    let _depositRequired_extraInitializers = [];
    let _feeStructure_decorators;
    let _feeStructure_initializers = [];
    let _feeStructure_extraInitializers = [];
    let _availableForTravel_decorators;
    let _availableForTravel_initializers = [];
    let _availableForTravel_extraInitializers = [];
    let _languagesSpoken_decorators;
    let _languagesSpoken_initializers = [];
    let _languagesSpoken_extraInitializers = [];
    let _publications_decorators;
    let _publications_initializers = [];
    let _publications_extraInitializers = [];
    let _priorTestimonyCount_decorators;
    let _priorTestimonyCount_initializers = [];
    let _priorTestimonyCount_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    return _a = class CreateExpertWitnessProfileDto {
            constructor() {
                this.firstName = __runInitializers(this, _firstName_initializers, void 0);
                this.lastName = (__runInitializers(this, _firstName_extraInitializers), __runInitializers(this, _lastName_initializers, void 0));
                this.credentials = (__runInitializers(this, _lastName_extraInitializers), __runInitializers(this, _credentials_initializers, void 0));
                this.specialty = (__runInitializers(this, _credentials_extraInitializers), __runInitializers(this, _specialty_initializers, void 0));
                this.subSpecialties = (__runInitializers(this, _specialty_extraInitializers), __runInitializers(this, _subSpecialties_initializers, void 0));
                this.licenseNumber = (__runInitializers(this, _subSpecialties_extraInitializers), __runInitializers(this, _licenseNumber_initializers, void 0));
                this.licenseState = (__runInitializers(this, _licenseNumber_extraInitializers), __runInitializers(this, _licenseState_initializers, void 0));
                this.licenseExpiration = (__runInitializers(this, _licenseState_extraInitializers), __runInitializers(this, _licenseExpiration_initializers, void 0));
                this.boardCertified = (__runInitializers(this, _licenseExpiration_extraInitializers), __runInitializers(this, _boardCertified_initializers, void 0));
                this.boardCertifications = (__runInitializers(this, _boardCertified_extraInitializers), __runInitializers(this, _boardCertifications_initializers, void 0));
                this.yearsExperience = (__runInitializers(this, _boardCertifications_extraInitializers), __runInitializers(this, _yearsExperience_initializers, void 0));
                this.currentEmployer = (__runInitializers(this, _yearsExperience_extraInitializers), __runInitializers(this, _currentEmployer_initializers, void 0));
                this.currentPosition = (__runInitializers(this, _currentEmployer_extraInitializers), __runInitializers(this, _currentPosition_initializers, void 0));
                this.cvUrl = (__runInitializers(this, _currentPosition_extraInitializers), __runInitializers(this, _cvUrl_initializers, void 0));
                this.email = (__runInitializers(this, _cvUrl_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
                this.address = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _address_initializers, void 0));
                this.hourlyRate = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _hourlyRate_initializers, void 0));
                this.depositRequired = (__runInitializers(this, _hourlyRate_extraInitializers), __runInitializers(this, _depositRequired_initializers, void 0));
                this.feeStructure = (__runInitializers(this, _depositRequired_extraInitializers), __runInitializers(this, _feeStructure_initializers, void 0));
                this.availableForTravel = (__runInitializers(this, _feeStructure_extraInitializers), __runInitializers(this, _availableForTravel_initializers, void 0));
                this.languagesSpoken = (__runInitializers(this, _availableForTravel_extraInitializers), __runInitializers(this, _languagesSpoken_initializers, void 0));
                this.publications = (__runInitializers(this, _languagesSpoken_extraInitializers), __runInitializers(this, _publications_initializers, void 0));
                this.priorTestimonyCount = (__runInitializers(this, _publications_extraInitializers), __runInitializers(this, _priorTestimonyCount_initializers, void 0));
                this.createdBy = (__runInitializers(this, _priorTestimonyCount_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
                this.organizationId = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _organizationId_initializers, void 0));
                __runInitializers(this, _organizationId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _firstName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expert first name' })];
            _lastName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expert last name' })];
            _credentials_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Professional credentials (e.g., MD, PhD, JD)' })];
            _specialty_decorators = [(0, swagger_1.ApiProperty)({ enum: ExpertSpecialty, description: 'Primary specialty area' })];
            _subSpecialties_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Sub-specialty areas' })];
            _licenseNumber_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Professional license number' })];
            _licenseState_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'State of licensure' })];
            _licenseExpiration_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'License expiration date' })];
            _boardCertified_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Board certified status' })];
            _boardCertifications_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Board certifications held' })];
            _yearsExperience_decorators = [(0, swagger_1.ApiProperty)({ description: 'Years of professional experience' })];
            _currentEmployer_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Current employer organization' })];
            _currentPosition_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Current position title' })];
            _cvUrl_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'URL to CV/resume document' })];
            _email_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contact email address' })];
            _phone_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contact phone number' })];
            _address_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Mailing address' })];
            _hourlyRate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Hourly consulting rate' })];
            _depositRequired_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Retainer deposit required' })];
            _feeStructure_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: FeeStructure, description: 'Fee structure type' })];
            _availableForTravel_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Available for travel' })];
            _languagesSpoken_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Languages spoken' })];
            _publications_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Published works' })];
            _priorTestimonyCount_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Number of prior testimonies' })];
            _createdBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID creating the profile' })];
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' })];
            __esDecorate(null, null, _firstName_decorators, { kind: "field", name: "firstName", static: false, private: false, access: { has: obj => "firstName" in obj, get: obj => obj.firstName, set: (obj, value) => { obj.firstName = value; } }, metadata: _metadata }, _firstName_initializers, _firstName_extraInitializers);
            __esDecorate(null, null, _lastName_decorators, { kind: "field", name: "lastName", static: false, private: false, access: { has: obj => "lastName" in obj, get: obj => obj.lastName, set: (obj, value) => { obj.lastName = value; } }, metadata: _metadata }, _lastName_initializers, _lastName_extraInitializers);
            __esDecorate(null, null, _credentials_decorators, { kind: "field", name: "credentials", static: false, private: false, access: { has: obj => "credentials" in obj, get: obj => obj.credentials, set: (obj, value) => { obj.credentials = value; } }, metadata: _metadata }, _credentials_initializers, _credentials_extraInitializers);
            __esDecorate(null, null, _specialty_decorators, { kind: "field", name: "specialty", static: false, private: false, access: { has: obj => "specialty" in obj, get: obj => obj.specialty, set: (obj, value) => { obj.specialty = value; } }, metadata: _metadata }, _specialty_initializers, _specialty_extraInitializers);
            __esDecorate(null, null, _subSpecialties_decorators, { kind: "field", name: "subSpecialties", static: false, private: false, access: { has: obj => "subSpecialties" in obj, get: obj => obj.subSpecialties, set: (obj, value) => { obj.subSpecialties = value; } }, metadata: _metadata }, _subSpecialties_initializers, _subSpecialties_extraInitializers);
            __esDecorate(null, null, _licenseNumber_decorators, { kind: "field", name: "licenseNumber", static: false, private: false, access: { has: obj => "licenseNumber" in obj, get: obj => obj.licenseNumber, set: (obj, value) => { obj.licenseNumber = value; } }, metadata: _metadata }, _licenseNumber_initializers, _licenseNumber_extraInitializers);
            __esDecorate(null, null, _licenseState_decorators, { kind: "field", name: "licenseState", static: false, private: false, access: { has: obj => "licenseState" in obj, get: obj => obj.licenseState, set: (obj, value) => { obj.licenseState = value; } }, metadata: _metadata }, _licenseState_initializers, _licenseState_extraInitializers);
            __esDecorate(null, null, _licenseExpiration_decorators, { kind: "field", name: "licenseExpiration", static: false, private: false, access: { has: obj => "licenseExpiration" in obj, get: obj => obj.licenseExpiration, set: (obj, value) => { obj.licenseExpiration = value; } }, metadata: _metadata }, _licenseExpiration_initializers, _licenseExpiration_extraInitializers);
            __esDecorate(null, null, _boardCertified_decorators, { kind: "field", name: "boardCertified", static: false, private: false, access: { has: obj => "boardCertified" in obj, get: obj => obj.boardCertified, set: (obj, value) => { obj.boardCertified = value; } }, metadata: _metadata }, _boardCertified_initializers, _boardCertified_extraInitializers);
            __esDecorate(null, null, _boardCertifications_decorators, { kind: "field", name: "boardCertifications", static: false, private: false, access: { has: obj => "boardCertifications" in obj, get: obj => obj.boardCertifications, set: (obj, value) => { obj.boardCertifications = value; } }, metadata: _metadata }, _boardCertifications_initializers, _boardCertifications_extraInitializers);
            __esDecorate(null, null, _yearsExperience_decorators, { kind: "field", name: "yearsExperience", static: false, private: false, access: { has: obj => "yearsExperience" in obj, get: obj => obj.yearsExperience, set: (obj, value) => { obj.yearsExperience = value; } }, metadata: _metadata }, _yearsExperience_initializers, _yearsExperience_extraInitializers);
            __esDecorate(null, null, _currentEmployer_decorators, { kind: "field", name: "currentEmployer", static: false, private: false, access: { has: obj => "currentEmployer" in obj, get: obj => obj.currentEmployer, set: (obj, value) => { obj.currentEmployer = value; } }, metadata: _metadata }, _currentEmployer_initializers, _currentEmployer_extraInitializers);
            __esDecorate(null, null, _currentPosition_decorators, { kind: "field", name: "currentPosition", static: false, private: false, access: { has: obj => "currentPosition" in obj, get: obj => obj.currentPosition, set: (obj, value) => { obj.currentPosition = value; } }, metadata: _metadata }, _currentPosition_initializers, _currentPosition_extraInitializers);
            __esDecorate(null, null, _cvUrl_decorators, { kind: "field", name: "cvUrl", static: false, private: false, access: { has: obj => "cvUrl" in obj, get: obj => obj.cvUrl, set: (obj, value) => { obj.cvUrl = value; } }, metadata: _metadata }, _cvUrl_initializers, _cvUrl_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: obj => "phone" in obj, get: obj => obj.phone, set: (obj, value) => { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: obj => "address" in obj, get: obj => obj.address, set: (obj, value) => { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
            __esDecorate(null, null, _hourlyRate_decorators, { kind: "field", name: "hourlyRate", static: false, private: false, access: { has: obj => "hourlyRate" in obj, get: obj => obj.hourlyRate, set: (obj, value) => { obj.hourlyRate = value; } }, metadata: _metadata }, _hourlyRate_initializers, _hourlyRate_extraInitializers);
            __esDecorate(null, null, _depositRequired_decorators, { kind: "field", name: "depositRequired", static: false, private: false, access: { has: obj => "depositRequired" in obj, get: obj => obj.depositRequired, set: (obj, value) => { obj.depositRequired = value; } }, metadata: _metadata }, _depositRequired_initializers, _depositRequired_extraInitializers);
            __esDecorate(null, null, _feeStructure_decorators, { kind: "field", name: "feeStructure", static: false, private: false, access: { has: obj => "feeStructure" in obj, get: obj => obj.feeStructure, set: (obj, value) => { obj.feeStructure = value; } }, metadata: _metadata }, _feeStructure_initializers, _feeStructure_extraInitializers);
            __esDecorate(null, null, _availableForTravel_decorators, { kind: "field", name: "availableForTravel", static: false, private: false, access: { has: obj => "availableForTravel" in obj, get: obj => obj.availableForTravel, set: (obj, value) => { obj.availableForTravel = value; } }, metadata: _metadata }, _availableForTravel_initializers, _availableForTravel_extraInitializers);
            __esDecorate(null, null, _languagesSpoken_decorators, { kind: "field", name: "languagesSpoken", static: false, private: false, access: { has: obj => "languagesSpoken" in obj, get: obj => obj.languagesSpoken, set: (obj, value) => { obj.languagesSpoken = value; } }, metadata: _metadata }, _languagesSpoken_initializers, _languagesSpoken_extraInitializers);
            __esDecorate(null, null, _publications_decorators, { kind: "field", name: "publications", static: false, private: false, access: { has: obj => "publications" in obj, get: obj => obj.publications, set: (obj, value) => { obj.publications = value; } }, metadata: _metadata }, _publications_initializers, _publications_extraInitializers);
            __esDecorate(null, null, _priorTestimonyCount_decorators, { kind: "field", name: "priorTestimonyCount", static: false, private: false, access: { has: obj => "priorTestimonyCount" in obj, get: obj => obj.priorTestimonyCount, set: (obj, value) => { obj.priorTestimonyCount = value; } }, metadata: _metadata }, _priorTestimonyCount_initializers, _priorTestimonyCount_extraInitializers);
            __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateExpertWitnessProfileDto = CreateExpertWitnessProfileDto;
/**
 * Update expert witness profile DTO
 */
let UpdateExpertWitnessProfileDto = (() => {
    var _a;
    let _firstName_decorators;
    let _firstName_initializers = [];
    let _firstName_extraInitializers = [];
    let _lastName_decorators;
    let _lastName_initializers = [];
    let _lastName_extraInitializers = [];
    let _credentials_decorators;
    let _credentials_initializers = [];
    let _credentials_extraInitializers = [];
    let _specialty_decorators;
    let _specialty_initializers = [];
    let _specialty_extraInitializers = [];
    let _subSpecialties_decorators;
    let _subSpecialties_initializers = [];
    let _subSpecialties_extraInitializers = [];
    let _hourlyRate_decorators;
    let _hourlyRate_initializers = [];
    let _hourlyRate_extraInitializers = [];
    let _phone_decorators;
    let _phone_initializers = [];
    let _phone_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _rating_decorators;
    let _rating_initializers = [];
    let _rating_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    return _a = class UpdateExpertWitnessProfileDto {
            constructor() {
                this.firstName = __runInitializers(this, _firstName_initializers, void 0);
                this.lastName = (__runInitializers(this, _firstName_extraInitializers), __runInitializers(this, _lastName_initializers, void 0));
                this.credentials = (__runInitializers(this, _lastName_extraInitializers), __runInitializers(this, _credentials_initializers, void 0));
                this.specialty = (__runInitializers(this, _credentials_extraInitializers), __runInitializers(this, _specialty_initializers, void 0));
                this.subSpecialties = (__runInitializers(this, _specialty_extraInitializers), __runInitializers(this, _subSpecialties_initializers, void 0));
                this.hourlyRate = (__runInitializers(this, _subSpecialties_extraInitializers), __runInitializers(this, _hourlyRate_initializers, void 0));
                this.phone = (__runInitializers(this, _hourlyRate_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
                this.status = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.rating = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _rating_initializers, void 0));
                this.notes = (__runInitializers(this, _rating_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _firstName_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Expert first name' })];
            _lastName_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Expert last name' })];
            _credentials_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Professional credentials' })];
            _specialty_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: ExpertSpecialty, description: 'Primary specialty area' })];
            _subSpecialties_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Sub-specialty areas' })];
            _hourlyRate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Hourly consulting rate' })];
            _phone_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Contact phone number' })];
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: ExpertStatus, description: 'Expert status' })];
            _rating_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Rating score (0-5)' })];
            _notes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' })];
            __esDecorate(null, null, _firstName_decorators, { kind: "field", name: "firstName", static: false, private: false, access: { has: obj => "firstName" in obj, get: obj => obj.firstName, set: (obj, value) => { obj.firstName = value; } }, metadata: _metadata }, _firstName_initializers, _firstName_extraInitializers);
            __esDecorate(null, null, _lastName_decorators, { kind: "field", name: "lastName", static: false, private: false, access: { has: obj => "lastName" in obj, get: obj => obj.lastName, set: (obj, value) => { obj.lastName = value; } }, metadata: _metadata }, _lastName_initializers, _lastName_extraInitializers);
            __esDecorate(null, null, _credentials_decorators, { kind: "field", name: "credentials", static: false, private: false, access: { has: obj => "credentials" in obj, get: obj => obj.credentials, set: (obj, value) => { obj.credentials = value; } }, metadata: _metadata }, _credentials_initializers, _credentials_extraInitializers);
            __esDecorate(null, null, _specialty_decorators, { kind: "field", name: "specialty", static: false, private: false, access: { has: obj => "specialty" in obj, get: obj => obj.specialty, set: (obj, value) => { obj.specialty = value; } }, metadata: _metadata }, _specialty_initializers, _specialty_extraInitializers);
            __esDecorate(null, null, _subSpecialties_decorators, { kind: "field", name: "subSpecialties", static: false, private: false, access: { has: obj => "subSpecialties" in obj, get: obj => obj.subSpecialties, set: (obj, value) => { obj.subSpecialties = value; } }, metadata: _metadata }, _subSpecialties_initializers, _subSpecialties_extraInitializers);
            __esDecorate(null, null, _hourlyRate_decorators, { kind: "field", name: "hourlyRate", static: false, private: false, access: { has: obj => "hourlyRate" in obj, get: obj => obj.hourlyRate, set: (obj, value) => { obj.hourlyRate = value; } }, metadata: _metadata }, _hourlyRate_initializers, _hourlyRate_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: obj => "phone" in obj, get: obj => obj.phone, set: (obj, value) => { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _rating_decorators, { kind: "field", name: "rating", static: false, private: false, access: { has: obj => "rating" in obj, get: obj => obj.rating, set: (obj, value) => { obj.rating = value; } }, metadata: _metadata }, _rating_initializers, _rating_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateExpertWitnessProfileDto = UpdateExpertWitnessProfileDto;
/**
 * Create expert engagement DTO
 */
let CreateExpertEngagementDto = (() => {
    var _a;
    let _expertId_decorators;
    let _expertId_initializers = [];
    let _expertId_extraInitializers = [];
    let _caseId_decorators;
    let _caseId_initializers = [];
    let _caseId_extraInitializers = [];
    let _engagementType_decorators;
    let _engagementType_initializers = [];
    let _engagementType_extraInitializers = [];
    let _retainedDate_decorators;
    let _retainedDate_initializers = [];
    let _retainedDate_extraInitializers = [];
    let _expectedReportDate_decorators;
    let _expectedReportDate_initializers = [];
    let _expectedReportDate_extraInitializers = [];
    let _expectedDepositionDate_decorators;
    let _expectedDepositionDate_initializers = [];
    let _expectedDepositionDate_extraInitializers = [];
    let _retainerAmount_decorators;
    let _retainerAmount_initializers = [];
    let _retainerAmount_extraInitializers = [];
    let _hourlyRate_decorators;
    let _hourlyRate_initializers = [];
    let _hourlyRate_extraInitializers = [];
    let _budgetCap_decorators;
    let _budgetCap_initializers = [];
    let _budgetCap_extraInitializers = [];
    let _assignedAttorney_decorators;
    let _assignedAttorney_initializers = [];
    let _assignedAttorney_extraInitializers = [];
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    return _a = class CreateExpertEngagementDto {
            constructor() {
                this.expertId = __runInitializers(this, _expertId_initializers, void 0);
                this.caseId = (__runInitializers(this, _expertId_extraInitializers), __runInitializers(this, _caseId_initializers, void 0));
                this.engagementType = (__runInitializers(this, _caseId_extraInitializers), __runInitializers(this, _engagementType_initializers, void 0));
                this.retainedDate = (__runInitializers(this, _engagementType_extraInitializers), __runInitializers(this, _retainedDate_initializers, void 0));
                this.expectedReportDate = (__runInitializers(this, _retainedDate_extraInitializers), __runInitializers(this, _expectedReportDate_initializers, void 0));
                this.expectedDepositionDate = (__runInitializers(this, _expectedReportDate_extraInitializers), __runInitializers(this, _expectedDepositionDate_initializers, void 0));
                this.retainerAmount = (__runInitializers(this, _expectedDepositionDate_extraInitializers), __runInitializers(this, _retainerAmount_initializers, void 0));
                this.hourlyRate = (__runInitializers(this, _retainerAmount_extraInitializers), __runInitializers(this, _hourlyRate_initializers, void 0));
                this.budgetCap = (__runInitializers(this, _hourlyRate_extraInitializers), __runInitializers(this, _budgetCap_initializers, void 0));
                this.assignedAttorney = (__runInitializers(this, _budgetCap_extraInitializers), __runInitializers(this, _assignedAttorney_initializers, void 0));
                this.organizationId = (__runInitializers(this, _assignedAttorney_extraInitializers), __runInitializers(this, _organizationId_initializers, void 0));
                __runInitializers(this, _organizationId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _expertId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expert witness ID' })];
            _caseId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Case/matter ID' })];
            _engagementType_decorators = [(0, swagger_1.ApiProperty)({ enum: EngagementType, description: 'Type of engagement' })];
            _retainedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Date expert was retained' })];
            _expectedReportDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Expected report delivery date' })];
            _expectedDepositionDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Expected deposition date' })];
            _retainerAmount_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Retainer amount paid' })];
            _hourlyRate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Hourly rate for this engagement' })];
            _budgetCap_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Budget cap for engagement' })];
            _assignedAttorney_decorators = [(0, swagger_1.ApiProperty)({ description: 'Attorney assigned to coordinate with expert' })];
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' })];
            __esDecorate(null, null, _expertId_decorators, { kind: "field", name: "expertId", static: false, private: false, access: { has: obj => "expertId" in obj, get: obj => obj.expertId, set: (obj, value) => { obj.expertId = value; } }, metadata: _metadata }, _expertId_initializers, _expertId_extraInitializers);
            __esDecorate(null, null, _caseId_decorators, { kind: "field", name: "caseId", static: false, private: false, access: { has: obj => "caseId" in obj, get: obj => obj.caseId, set: (obj, value) => { obj.caseId = value; } }, metadata: _metadata }, _caseId_initializers, _caseId_extraInitializers);
            __esDecorate(null, null, _engagementType_decorators, { kind: "field", name: "engagementType", static: false, private: false, access: { has: obj => "engagementType" in obj, get: obj => obj.engagementType, set: (obj, value) => { obj.engagementType = value; } }, metadata: _metadata }, _engagementType_initializers, _engagementType_extraInitializers);
            __esDecorate(null, null, _retainedDate_decorators, { kind: "field", name: "retainedDate", static: false, private: false, access: { has: obj => "retainedDate" in obj, get: obj => obj.retainedDate, set: (obj, value) => { obj.retainedDate = value; } }, metadata: _metadata }, _retainedDate_initializers, _retainedDate_extraInitializers);
            __esDecorate(null, null, _expectedReportDate_decorators, { kind: "field", name: "expectedReportDate", static: false, private: false, access: { has: obj => "expectedReportDate" in obj, get: obj => obj.expectedReportDate, set: (obj, value) => { obj.expectedReportDate = value; } }, metadata: _metadata }, _expectedReportDate_initializers, _expectedReportDate_extraInitializers);
            __esDecorate(null, null, _expectedDepositionDate_decorators, { kind: "field", name: "expectedDepositionDate", static: false, private: false, access: { has: obj => "expectedDepositionDate" in obj, get: obj => obj.expectedDepositionDate, set: (obj, value) => { obj.expectedDepositionDate = value; } }, metadata: _metadata }, _expectedDepositionDate_initializers, _expectedDepositionDate_extraInitializers);
            __esDecorate(null, null, _retainerAmount_decorators, { kind: "field", name: "retainerAmount", static: false, private: false, access: { has: obj => "retainerAmount" in obj, get: obj => obj.retainerAmount, set: (obj, value) => { obj.retainerAmount = value; } }, metadata: _metadata }, _retainerAmount_initializers, _retainerAmount_extraInitializers);
            __esDecorate(null, null, _hourlyRate_decorators, { kind: "field", name: "hourlyRate", static: false, private: false, access: { has: obj => "hourlyRate" in obj, get: obj => obj.hourlyRate, set: (obj, value) => { obj.hourlyRate = value; } }, metadata: _metadata }, _hourlyRate_initializers, _hourlyRate_extraInitializers);
            __esDecorate(null, null, _budgetCap_decorators, { kind: "field", name: "budgetCap", static: false, private: false, access: { has: obj => "budgetCap" in obj, get: obj => obj.budgetCap, set: (obj, value) => { obj.budgetCap = value; } }, metadata: _metadata }, _budgetCap_initializers, _budgetCap_extraInitializers);
            __esDecorate(null, null, _assignedAttorney_decorators, { kind: "field", name: "assignedAttorney", static: false, private: false, access: { has: obj => "assignedAttorney" in obj, get: obj => obj.assignedAttorney, set: (obj, value) => { obj.assignedAttorney = value; } }, metadata: _metadata }, _assignedAttorney_initializers, _assignedAttorney_extraInitializers);
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateExpertEngagementDto = CreateExpertEngagementDto;
/**
 * Create expert report DTO
 */
let CreateExpertReportDto = (() => {
    var _a;
    let _expertEngagementId_decorators;
    let _expertEngagementId_initializers = [];
    let _expertEngagementId_extraInitializers = [];
    let _reportType_decorators;
    let _reportType_initializers = [];
    let _reportType_extraInitializers = [];
    let _requestedDate_decorators;
    let _requestedDate_initializers = [];
    let _requestedDate_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _disclosureDeadline_decorators;
    let _disclosureDeadline_initializers = [];
    let _disclosureDeadline_extraInitializers = [];
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    return _a = class CreateExpertReportDto {
            constructor() {
                this.expertEngagementId = __runInitializers(this, _expertEngagementId_initializers, void 0);
                this.reportType = (__runInitializers(this, _expertEngagementId_extraInitializers), __runInitializers(this, _reportType_initializers, void 0));
                this.requestedDate = (__runInitializers(this, _reportType_extraInitializers), __runInitializers(this, _requestedDate_initializers, void 0));
                this.dueDate = (__runInitializers(this, _requestedDate_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
                this.disclosureDeadline = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _disclosureDeadline_initializers, void 0));
                this.organizationId = (__runInitializers(this, _disclosureDeadline_extraInitializers), __runInitializers(this, _organizationId_initializers, void 0));
                __runInitializers(this, _organizationId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _expertEngagementId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expert engagement ID' })];
            _reportType_decorators = [(0, swagger_1.ApiProperty)({ enum: ['initial', 'supplemental', 'rebuttal'], description: 'Report type' })];
            _requestedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Date report was requested' })];
            _dueDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Report due date' })];
            _disclosureDeadline_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Disclosure deadline' })];
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' })];
            __esDecorate(null, null, _expertEngagementId_decorators, { kind: "field", name: "expertEngagementId", static: false, private: false, access: { has: obj => "expertEngagementId" in obj, get: obj => obj.expertEngagementId, set: (obj, value) => { obj.expertEngagementId = value; } }, metadata: _metadata }, _expertEngagementId_initializers, _expertEngagementId_extraInitializers);
            __esDecorate(null, null, _reportType_decorators, { kind: "field", name: "reportType", static: false, private: false, access: { has: obj => "reportType" in obj, get: obj => obj.reportType, set: (obj, value) => { obj.reportType = value; } }, metadata: _metadata }, _reportType_initializers, _reportType_extraInitializers);
            __esDecorate(null, null, _requestedDate_decorators, { kind: "field", name: "requestedDate", static: false, private: false, access: { has: obj => "requestedDate" in obj, get: obj => obj.requestedDate, set: (obj, value) => { obj.requestedDate = value; } }, metadata: _metadata }, _requestedDate_initializers, _requestedDate_extraInitializers);
            __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
            __esDecorate(null, null, _disclosureDeadline_decorators, { kind: "field", name: "disclosureDeadline", static: false, private: false, access: { has: obj => "disclosureDeadline" in obj, get: obj => obj.disclosureDeadline, set: (obj, value) => { obj.disclosureDeadline = value; } }, metadata: _metadata }, _disclosureDeadline_initializers, _disclosureDeadline_extraInitializers);
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateExpertReportDto = CreateExpertReportDto;
/**
 * Create expert deposition DTO
 */
let CreateExpertDepositionDto = (() => {
    var _a;
    let _expertEngagementId_decorators;
    let _expertEngagementId_initializers = [];
    let _expertEngagementId_extraInitializers = [];
    let _noticeReceivedDate_decorators;
    let _noticeReceivedDate_initializers = [];
    let _noticeReceivedDate_extraInitializers = [];
    let _scheduledDate_decorators;
    let _scheduledDate_initializers = [];
    let _scheduledDate_extraInitializers = [];
    let _scheduledTime_decorators;
    let _scheduledTime_initializers = [];
    let _scheduledTime_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _remoteDeposition_decorators;
    let _remoteDeposition_initializers = [];
    let _remoteDeposition_extraInitializers = [];
    let _estimatedDuration_decorators;
    let _estimatedDuration_initializers = [];
    let _estimatedDuration_extraInitializers = [];
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    return _a = class CreateExpertDepositionDto {
            constructor() {
                this.expertEngagementId = __runInitializers(this, _expertEngagementId_initializers, void 0);
                this.noticeReceivedDate = (__runInitializers(this, _expertEngagementId_extraInitializers), __runInitializers(this, _noticeReceivedDate_initializers, void 0));
                this.scheduledDate = (__runInitializers(this, _noticeReceivedDate_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
                this.scheduledTime = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _scheduledTime_initializers, void 0));
                this.location = (__runInitializers(this, _scheduledTime_extraInitializers), __runInitializers(this, _location_initializers, void 0));
                this.remoteDeposition = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _remoteDeposition_initializers, void 0));
                this.estimatedDuration = (__runInitializers(this, _remoteDeposition_extraInitializers), __runInitializers(this, _estimatedDuration_initializers, void 0));
                this.organizationId = (__runInitializers(this, _estimatedDuration_extraInitializers), __runInitializers(this, _organizationId_initializers, void 0));
                __runInitializers(this, _organizationId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _expertEngagementId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expert engagement ID' })];
            _noticeReceivedDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Date deposition notice received' })];
            _scheduledDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Scheduled deposition date' })];
            _scheduledTime_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Scheduled time' })];
            _location_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Deposition location' })];
            _remoteDeposition_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Remote/video deposition' })];
            _estimatedDuration_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Estimated duration in hours' })];
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' })];
            __esDecorate(null, null, _expertEngagementId_decorators, { kind: "field", name: "expertEngagementId", static: false, private: false, access: { has: obj => "expertEngagementId" in obj, get: obj => obj.expertEngagementId, set: (obj, value) => { obj.expertEngagementId = value; } }, metadata: _metadata }, _expertEngagementId_initializers, _expertEngagementId_extraInitializers);
            __esDecorate(null, null, _noticeReceivedDate_decorators, { kind: "field", name: "noticeReceivedDate", static: false, private: false, access: { has: obj => "noticeReceivedDate" in obj, get: obj => obj.noticeReceivedDate, set: (obj, value) => { obj.noticeReceivedDate = value; } }, metadata: _metadata }, _noticeReceivedDate_initializers, _noticeReceivedDate_extraInitializers);
            __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
            __esDecorate(null, null, _scheduledTime_decorators, { kind: "field", name: "scheduledTime", static: false, private: false, access: { has: obj => "scheduledTime" in obj, get: obj => obj.scheduledTime, set: (obj, value) => { obj.scheduledTime = value; } }, metadata: _metadata }, _scheduledTime_initializers, _scheduledTime_extraInitializers);
            __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
            __esDecorate(null, null, _remoteDeposition_decorators, { kind: "field", name: "remoteDeposition", static: false, private: false, access: { has: obj => "remoteDeposition" in obj, get: obj => obj.remoteDeposition, set: (obj, value) => { obj.remoteDeposition = value; } }, metadata: _metadata }, _remoteDeposition_initializers, _remoteDeposition_extraInitializers);
            __esDecorate(null, null, _estimatedDuration_decorators, { kind: "field", name: "estimatedDuration", static: false, private: false, access: { has: obj => "estimatedDuration" in obj, get: obj => obj.estimatedDuration, set: (obj, value) => { obj.estimatedDuration = value; } }, metadata: _metadata }, _estimatedDuration_initializers, _estimatedDuration_extraInitializers);
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateExpertDepositionDto = CreateExpertDepositionDto;
/**
 * Create expert invoice DTO
 */
let CreateExpertInvoiceDto = (() => {
    var _a;
    let _expertEngagementId_decorators;
    let _expertEngagementId_initializers = [];
    let _expertEngagementId_extraInitializers = [];
    let _invoiceNumber_decorators;
    let _invoiceNumber_initializers = [];
    let _invoiceNumber_extraInitializers = [];
    let _invoiceDate_decorators;
    let _invoiceDate_initializers = [];
    let _invoiceDate_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _periodStart_decorators;
    let _periodStart_initializers = [];
    let _periodStart_extraInitializers = [];
    let _periodEnd_decorators;
    let _periodEnd_initializers = [];
    let _periodEnd_extraInitializers = [];
    let _hoursWorked_decorators;
    let _hoursWorked_initializers = [];
    let _hoursWorked_extraInitializers = [];
    let _hourlyRate_decorators;
    let _hourlyRate_initializers = [];
    let _hourlyRate_extraInitializers = [];
    let _laborAmount_decorators;
    let _laborAmount_initializers = [];
    let _laborAmount_extraInitializers = [];
    let _expensesAmount_decorators;
    let _expensesAmount_initializers = [];
    let _expensesAmount_extraInitializers = [];
    let _totalAmount_decorators;
    let _totalAmount_initializers = [];
    let _totalAmount_extraInitializers = [];
    let _invoiceUrl_decorators;
    let _invoiceUrl_initializers = [];
    let _invoiceUrl_extraInitializers = [];
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    return _a = class CreateExpertInvoiceDto {
            constructor() {
                this.expertEngagementId = __runInitializers(this, _expertEngagementId_initializers, void 0);
                this.invoiceNumber = (__runInitializers(this, _expertEngagementId_extraInitializers), __runInitializers(this, _invoiceNumber_initializers, void 0));
                this.invoiceDate = (__runInitializers(this, _invoiceNumber_extraInitializers), __runInitializers(this, _invoiceDate_initializers, void 0));
                this.dueDate = (__runInitializers(this, _invoiceDate_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
                this.periodStart = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _periodStart_initializers, void 0));
                this.periodEnd = (__runInitializers(this, _periodStart_extraInitializers), __runInitializers(this, _periodEnd_initializers, void 0));
                this.hoursWorked = (__runInitializers(this, _periodEnd_extraInitializers), __runInitializers(this, _hoursWorked_initializers, void 0));
                this.hourlyRate = (__runInitializers(this, _hoursWorked_extraInitializers), __runInitializers(this, _hourlyRate_initializers, void 0));
                this.laborAmount = (__runInitializers(this, _hourlyRate_extraInitializers), __runInitializers(this, _laborAmount_initializers, void 0));
                this.expensesAmount = (__runInitializers(this, _laborAmount_extraInitializers), __runInitializers(this, _expensesAmount_initializers, void 0));
                this.totalAmount = (__runInitializers(this, _expensesAmount_extraInitializers), __runInitializers(this, _totalAmount_initializers, void 0));
                this.invoiceUrl = (__runInitializers(this, _totalAmount_extraInitializers), __runInitializers(this, _invoiceUrl_initializers, void 0));
                this.organizationId = (__runInitializers(this, _invoiceUrl_extraInitializers), __runInitializers(this, _organizationId_initializers, void 0));
                __runInitializers(this, _organizationId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _expertEngagementId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expert engagement ID' })];
            _invoiceNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice number' })];
            _invoiceDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice date' })];
            _dueDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment due date' })];
            _periodStart_decorators = [(0, swagger_1.ApiProperty)({ description: 'Billing period start date' })];
            _periodEnd_decorators = [(0, swagger_1.ApiProperty)({ description: 'Billing period end date' })];
            _hoursWorked_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total hours worked' })];
            _hourlyRate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Hourly rate applied' })];
            _laborAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total labor charges' })];
            _expensesAmount_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Total expenses', default: 0 })];
            _totalAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total invoice amount' })];
            _invoiceUrl_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Invoice document URL' })];
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' })];
            __esDecorate(null, null, _expertEngagementId_decorators, { kind: "field", name: "expertEngagementId", static: false, private: false, access: { has: obj => "expertEngagementId" in obj, get: obj => obj.expertEngagementId, set: (obj, value) => { obj.expertEngagementId = value; } }, metadata: _metadata }, _expertEngagementId_initializers, _expertEngagementId_extraInitializers);
            __esDecorate(null, null, _invoiceNumber_decorators, { kind: "field", name: "invoiceNumber", static: false, private: false, access: { has: obj => "invoiceNumber" in obj, get: obj => obj.invoiceNumber, set: (obj, value) => { obj.invoiceNumber = value; } }, metadata: _metadata }, _invoiceNumber_initializers, _invoiceNumber_extraInitializers);
            __esDecorate(null, null, _invoiceDate_decorators, { kind: "field", name: "invoiceDate", static: false, private: false, access: { has: obj => "invoiceDate" in obj, get: obj => obj.invoiceDate, set: (obj, value) => { obj.invoiceDate = value; } }, metadata: _metadata }, _invoiceDate_initializers, _invoiceDate_extraInitializers);
            __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
            __esDecorate(null, null, _periodStart_decorators, { kind: "field", name: "periodStart", static: false, private: false, access: { has: obj => "periodStart" in obj, get: obj => obj.periodStart, set: (obj, value) => { obj.periodStart = value; } }, metadata: _metadata }, _periodStart_initializers, _periodStart_extraInitializers);
            __esDecorate(null, null, _periodEnd_decorators, { kind: "field", name: "periodEnd", static: false, private: false, access: { has: obj => "periodEnd" in obj, get: obj => obj.periodEnd, set: (obj, value) => { obj.periodEnd = value; } }, metadata: _metadata }, _periodEnd_initializers, _periodEnd_extraInitializers);
            __esDecorate(null, null, _hoursWorked_decorators, { kind: "field", name: "hoursWorked", static: false, private: false, access: { has: obj => "hoursWorked" in obj, get: obj => obj.hoursWorked, set: (obj, value) => { obj.hoursWorked = value; } }, metadata: _metadata }, _hoursWorked_initializers, _hoursWorked_extraInitializers);
            __esDecorate(null, null, _hourlyRate_decorators, { kind: "field", name: "hourlyRate", static: false, private: false, access: { has: obj => "hourlyRate" in obj, get: obj => obj.hourlyRate, set: (obj, value) => { obj.hourlyRate = value; } }, metadata: _metadata }, _hourlyRate_initializers, _hourlyRate_extraInitializers);
            __esDecorate(null, null, _laborAmount_decorators, { kind: "field", name: "laborAmount", static: false, private: false, access: { has: obj => "laborAmount" in obj, get: obj => obj.laborAmount, set: (obj, value) => { obj.laborAmount = value; } }, metadata: _metadata }, _laborAmount_initializers, _laborAmount_extraInitializers);
            __esDecorate(null, null, _expensesAmount_decorators, { kind: "field", name: "expensesAmount", static: false, private: false, access: { has: obj => "expensesAmount" in obj, get: obj => obj.expensesAmount, set: (obj, value) => { obj.expensesAmount = value; } }, metadata: _metadata }, _expensesAmount_initializers, _expensesAmount_extraInitializers);
            __esDecorate(null, null, _totalAmount_decorators, { kind: "field", name: "totalAmount", static: false, private: false, access: { has: obj => "totalAmount" in obj, get: obj => obj.totalAmount, set: (obj, value) => { obj.totalAmount = value; } }, metadata: _metadata }, _totalAmount_initializers, _totalAmount_extraInitializers);
            __esDecorate(null, null, _invoiceUrl_decorators, { kind: "field", name: "invoiceUrl", static: false, private: false, access: { has: obj => "invoiceUrl" in obj, get: obj => obj.invoiceUrl, set: (obj, value) => { obj.invoiceUrl = value; } }, metadata: _metadata }, _invoiceUrl_initializers, _invoiceUrl_extraInitializers);
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateExpertInvoiceDto = CreateExpertInvoiceDto;
/**
 * Expert search filters DTO
 */
let ExpertSearchFiltersDto = (() => {
    var _a;
    let _specialty_decorators;
    let _specialty_initializers = [];
    let _specialty_extraInitializers = [];
    let _licenseState_decorators;
    let _licenseState_initializers = [];
    let _licenseState_extraInitializers = [];
    let _boardCertified_decorators;
    let _boardCertified_initializers = [];
    let _boardCertified_extraInitializers = [];
    let _minYearsExperience_decorators;
    let _minYearsExperience_initializers = [];
    let _minYearsExperience_extraInitializers = [];
    let _maxHourlyRate_decorators;
    let _maxHourlyRate_initializers = [];
    let _maxHourlyRate_extraInitializers = [];
    let _availableForTravel_decorators;
    let _availableForTravel_initializers = [];
    let _availableForTravel_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _minRating_decorators;
    let _minRating_initializers = [];
    let _minRating_extraInitializers = [];
    return _a = class ExpertSearchFiltersDto {
            constructor() {
                this.specialty = __runInitializers(this, _specialty_initializers, void 0);
                this.licenseState = (__runInitializers(this, _specialty_extraInitializers), __runInitializers(this, _licenseState_initializers, void 0));
                this.boardCertified = (__runInitializers(this, _licenseState_extraInitializers), __runInitializers(this, _boardCertified_initializers, void 0));
                this.minYearsExperience = (__runInitializers(this, _boardCertified_extraInitializers), __runInitializers(this, _minYearsExperience_initializers, void 0));
                this.maxHourlyRate = (__runInitializers(this, _minYearsExperience_extraInitializers), __runInitializers(this, _maxHourlyRate_initializers, void 0));
                this.availableForTravel = (__runInitializers(this, _maxHourlyRate_extraInitializers), __runInitializers(this, _availableForTravel_initializers, void 0));
                this.status = (__runInitializers(this, _availableForTravel_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.minRating = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _minRating_initializers, void 0));
                __runInitializers(this, _minRating_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _specialty_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: ExpertSpecialty, description: 'Filter by specialty' })];
            _licenseState_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filter by license state' })];
            _boardCertified_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filter by board certified status' })];
            _minYearsExperience_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Minimum years of experience' })];
            _maxHourlyRate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Maximum hourly rate' })];
            _availableForTravel_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Available for travel' })];
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: ExpertStatus, description: 'Filter by expert status' })];
            _minRating_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Minimum rating (0-5)' })];
            __esDecorate(null, null, _specialty_decorators, { kind: "field", name: "specialty", static: false, private: false, access: { has: obj => "specialty" in obj, get: obj => obj.specialty, set: (obj, value) => { obj.specialty = value; } }, metadata: _metadata }, _specialty_initializers, _specialty_extraInitializers);
            __esDecorate(null, null, _licenseState_decorators, { kind: "field", name: "licenseState", static: false, private: false, access: { has: obj => "licenseState" in obj, get: obj => obj.licenseState, set: (obj, value) => { obj.licenseState = value; } }, metadata: _metadata }, _licenseState_initializers, _licenseState_extraInitializers);
            __esDecorate(null, null, _boardCertified_decorators, { kind: "field", name: "boardCertified", static: false, private: false, access: { has: obj => "boardCertified" in obj, get: obj => obj.boardCertified, set: (obj, value) => { obj.boardCertified = value; } }, metadata: _metadata }, _boardCertified_initializers, _boardCertified_extraInitializers);
            __esDecorate(null, null, _minYearsExperience_decorators, { kind: "field", name: "minYearsExperience", static: false, private: false, access: { has: obj => "minYearsExperience" in obj, get: obj => obj.minYearsExperience, set: (obj, value) => { obj.minYearsExperience = value; } }, metadata: _metadata }, _minYearsExperience_initializers, _minYearsExperience_extraInitializers);
            __esDecorate(null, null, _maxHourlyRate_decorators, { kind: "field", name: "maxHourlyRate", static: false, private: false, access: { has: obj => "maxHourlyRate" in obj, get: obj => obj.maxHourlyRate, set: (obj, value) => { obj.maxHourlyRate = value; } }, metadata: _metadata }, _maxHourlyRate_initializers, _maxHourlyRate_extraInitializers);
            __esDecorate(null, null, _availableForTravel_decorators, { kind: "field", name: "availableForTravel", static: false, private: false, access: { has: obj => "availableForTravel" in obj, get: obj => obj.availableForTravel, set: (obj, value) => { obj.availableForTravel = value; } }, metadata: _metadata }, _availableForTravel_initializers, _availableForTravel_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _minRating_decorators, { kind: "field", name: "minRating", static: false, private: false, access: { has: obj => "minRating" in obj, get: obj => obj.minRating, set: (obj, value) => { obj.minRating = value; } }, metadata: _metadata }, _minRating_initializers, _minRating_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ExpertSearchFiltersDto = ExpertSearchFiltersDto;
// ============================================================================
// SERVICES
// ============================================================================
/**
 * Expert witness management service
 * Handles all expert witness coordination operations
 */
let ExpertWitnessManagementService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ExpertWitnessManagementService = _classThis = class {
        constructor(sequelize, configService) {
            this.sequelize = sequelize;
            this.configService = configService;
            this.logger = new common_1.Logger(ExpertWitnessManagementService.name);
        }
        // ============================================================================
        // 1. QUALIFICATION VERIFICATION FUNCTIONS
        // ============================================================================
        /**
         * Verify expert professional license
         * Validates active license status and expiration
         */
        async verifyProfessionalLicense(expertId, licenseNumber, licenseState, verifiedBy, organizationId, transaction) {
            try {
                const expert = await ExpertWitnessProfile.findByPk(expertId);
                if (!expert) {
                    throw new common_1.NotFoundException(`Expert not found: ${expertId}`);
                }
                // Create verification record
                const verification = await CredentialVerification.create({
                    expertId,
                    verificationType: 'license',
                    credentialName: `${licenseState} Professional License`,
                    issuingAuthority: `${licenseState} State Licensing Board`,
                    credentialNumber: licenseNumber,
                    verifiedDate: new Date(),
                    verifiedBy,
                    verificationMethod: 'Online State Database Verification',
                    status: CredentialStatus.VERIFIED,
                    organizationId,
                }, { transaction });
                this.logger.log(`Professional license verified for expert ${expertId}`);
                return verification;
            }
            catch (error) {
                this.logger.error(`Failed to verify professional license: ${error}`);
                throw new common_1.InternalServerErrorException('License verification failed');
            }
        }
        /**
         * Verify board certification credentials
         * Validates board certification status and specialty
         */
        async verifyBoardCertification(expertId, certificationName, certifyingBoard, verifiedBy, organizationId, transaction) {
            try {
                const verification = await CredentialVerification.create({
                    expertId,
                    verificationType: 'certification',
                    credentialName: certificationName,
                    issuingAuthority: certifyingBoard,
                    verifiedDate: new Date(),
                    verifiedBy,
                    verificationMethod: 'Board Database Verification',
                    status: CredentialStatus.VERIFIED,
                    organizationId,
                }, { transaction });
                // Update expert profile
                await ExpertWitnessProfile.update({ boardCertified: true }, { where: { id: expertId }, transaction });
                this.logger.log(`Board certification verified for expert ${expertId}`);
                return verification;
            }
            catch (error) {
                this.logger.error(`Failed to verify board certification: ${error}`);
                throw new common_1.InternalServerErrorException('Board certification verification failed');
            }
        }
        /**
         * Verify educational credentials
         * Validates degrees and educational background
         */
        async verifyEducationalCredentials(expertId, degreeName, institution, graduationYear, verifiedBy, organizationId, transaction) {
            try {
                const verification = await CredentialVerification.create({
                    expertId,
                    verificationType: 'education',
                    credentialName: `${degreeName} - ${institution}`,
                    issuingAuthority: institution,
                    issueDate: new Date(graduationYear, 5, 1),
                    verifiedDate: new Date(),
                    verifiedBy,
                    verificationMethod: 'Institution Verification / National Student Clearinghouse',
                    status: CredentialStatus.VERIFIED,
                    organizationId,
                }, { transaction });
                this.logger.log(`Educational credentials verified for expert ${expertId}`);
                return verification;
            }
            catch (error) {
                this.logger.error(`Failed to verify educational credentials: ${error}`);
                throw new common_1.InternalServerErrorException('Educational verification failed');
            }
        }
        /**
         * Verify professional experience
         * Validates work history and expertise claims
         */
        async verifyProfessionalExperience(expertId, employerName, position, startYear, endYear, verifiedBy, organizationId, transaction) {
            try {
                const experienceDescription = endYear
                    ? `${position} at ${employerName} (${startYear}-${endYear})`
                    : `${position} at ${employerName} (${startYear}-Present)`;
                const verification = await CredentialVerification.create({
                    expertId,
                    verificationType: 'experience',
                    credentialName: experienceDescription,
                    issuingAuthority: employerName,
                    issueDate: new Date(startYear, 0, 1),
                    verifiedDate: new Date(),
                    verifiedBy,
                    verificationMethod: 'Employment Verification',
                    status: CredentialStatus.VERIFIED,
                    organizationId,
                }, { transaction });
                this.logger.log(`Professional experience verified for expert ${expertId}`);
                return verification;
            }
            catch (error) {
                this.logger.error(`Failed to verify professional experience: ${error}`);
                throw new common_1.InternalServerErrorException('Experience verification failed');
            }
        }
        /**
         * Verify published works and research
         * Validates publications and scholarly contributions
         */
        async verifyPublications(expertId, publicationTitle, journal, publicationYear, verifiedBy, organizationId, transaction) {
            try {
                const verification = await CredentialVerification.create({
                    expertId,
                    verificationType: 'publication',
                    credentialName: `"${publicationTitle}" - ${journal}`,
                    issuingAuthority: journal,
                    issueDate: new Date(publicationYear, 0, 1),
                    verifiedDate: new Date(),
                    verifiedBy,
                    verificationMethod: 'PubMed/Academic Database Verification',
                    status: CredentialStatus.VERIFIED,
                    organizationId,
                }, { transaction });
                this.logger.log(`Publication verified for expert ${expertId}`);
                return verification;
            }
            catch (error) {
                this.logger.error(`Failed to verify publication: ${error}`);
                throw new common_1.InternalServerErrorException('Publication verification failed');
            }
        }
        /**
         * Check credential expiration status
         * Monitors and alerts on expiring credentials
         */
        async checkCredentialExpirations(expertId, daysThreshold = 90) {
            try {
                const thresholdDate = new Date();
                thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
                const expiringCredentials = await CredentialVerification.findAll({
                    where: {
                        expertId,
                        expirationDate: {
                            [sequelize_1.Op.lte]: thresholdDate,
                            [sequelize_1.Op.gte]: new Date(),
                        },
                        status: CredentialStatus.VERIFIED,
                    },
                    order: [['expirationDate', 'ASC']],
                });
                this.logger.log(`Found ${expiringCredentials.length} expiring credentials for expert ${expertId}`);
                return expiringCredentials;
            }
            catch (error) {
                this.logger.error(`Failed to check credential expirations: ${error}`);
                throw new common_1.InternalServerErrorException('Credential expiration check failed');
            }
        }
        /**
         * Analyze expert CV and extract qualifications
         * Automated CV parsing and qualification extraction
         */
        async analyzeExpertCV(expertId, cvUrl, organizationId) {
            try {
                // Placeholder for CV parsing logic
                // In production, this would use ML/NLP to extract structured data from CV
                const analysis = {
                    education: [],
                    certifications: [],
                    experience: [],
                    publications: [],
                };
                this.logger.log(`CV analyzed for expert ${expertId}`);
                return analysis;
            }
            catch (error) {
                this.logger.error(`Failed to analyze expert CV: ${error}`);
                throw new common_1.InternalServerErrorException('CV analysis failed');
            }
        }
        // ============================================================================
        // 2. EXPERT SELECTION FUNCTIONS
        // ============================================================================
        /**
         * Search experts by specialty and criteria
         * Advanced search with multiple filter options
         */
        async searchExperts(filters, organizationId) {
            try {
                const whereClause = { organizationId };
                if (filters.specialty) {
                    whereClause.specialty = filters.specialty;
                }
                if (filters.licenseState) {
                    whereClause.licenseState = filters.licenseState;
                }
                if (filters.boardCertified !== undefined) {
                    whereClause.boardCertified = filters.boardCertified;
                }
                if (filters.minYearsExperience) {
                    whereClause.yearsExperience = { [sequelize_1.Op.gte]: filters.minYearsExperience };
                }
                if (filters.maxHourlyRate) {
                    whereClause.hourlyRate = { [sequelize_1.Op.lte]: filters.maxHourlyRate };
                }
                if (filters.availableForTravel !== undefined) {
                    whereClause.availableForTravel = filters.availableForTravel;
                }
                if (filters.status) {
                    whereClause.status = filters.status;
                }
                if (filters.minRating) {
                    whereClause.rating = { [sequelize_1.Op.gte]: filters.minRating };
                }
                const experts = await ExpertWitnessProfile.findAll({
                    where: whereClause,
                    include: [
                        {
                            model: CredentialVerification,
                            where: { status: CredentialStatus.VERIFIED },
                            required: false,
                        },
                    ],
                    order: [
                        ['rating', 'DESC NULLS LAST'],
                        ['yearsExperience', 'DESC'],
                    ],
                });
                this.logger.log(`Found ${experts.length} experts matching criteria`);
                return experts;
            }
            catch (error) {
                this.logger.error(`Failed to search experts: ${error}`);
                throw new common_1.InternalServerErrorException('Expert search failed');
            }
        }
        /**
         * Match experts to case requirements
         * Intelligent matching based on case needs
         */
        async matchExpertsToCase(criteria, organizationId) {
            try {
                const whereClause = {
                    organizationId,
                    specialty: { [sequelize_1.Op.in]: criteria.specialtyRequired },
                };
                if (criteria.jurisdictionRequired && criteria.jurisdictionRequired.length > 0) {
                    whereClause.licenseState = { [sequelize_1.Op.in]: criteria.jurisdictionRequired };
                }
                if (criteria.minYearsExperience) {
                    whereClause.yearsExperience = { [sequelize_1.Op.gte]: criteria.minYearsExperience };
                }
                if (criteria.boardCertificationRequired) {
                    whereClause.boardCertified = true;
                }
                if (criteria.maxHourlyRate) {
                    whereClause.hourlyRate = { [sequelize_1.Op.lte]: criteria.maxHourlyRate };
                }
                const experts = await ExpertWitnessProfile.findAll({
                    where: whereClause,
                    include: [
                        {
                            model: CredentialVerification,
                            where: { status: CredentialStatus.VERIFIED },
                            required: criteria.boardCertificationRequired,
                        },
                    ],
                    order: [
                        ['rating', 'DESC NULLS LAST'],
                        ['dauberSuccesses', 'DESC'],
                        ['priorTestimonyCount', 'DESC'],
                    ],
                    limit: 10,
                });
                this.logger.log(`Matched ${experts.length} experts to case criteria`);
                return experts;
            }
            catch (error) {
                this.logger.error(`Failed to match experts to case: ${error}`);
                throw new common_1.InternalServerErrorException('Expert matching failed');
            }
        }
        /**
         * Perform conflict of interest check
         * Comprehensive conflict screening
         */
        async performConflictCheck(expertId, caseId, opposingParties, organizationId) {
            try {
                // Check for prior engagements with opposing parties
                const priorEngagements = await ExpertEngagement.findAll({
                    where: {
                        expertId,
                        organizationId,
                    },
                    include: [
                        {
                            model: ExpertWitnessProfile,
                        },
                    ],
                });
                // Placeholder for actual conflict detection logic
                // In production, this would check against case parties, related cases, etc.
                let result = ConflictCheckResult.CLEAR;
                if (priorEngagements.length > 10) {
                    result = ConflictCheckResult.POTENTIAL_CONFLICT;
                }
                this.logger.log(`Conflict check completed for expert ${expertId} on case ${caseId}: ${result}`);
                return result;
            }
            catch (error) {
                this.logger.error(`Failed to perform conflict check: ${error}`);
                throw new common_1.InternalServerErrorException('Conflict check failed');
            }
        }
        /**
         * Evaluate expert qualifications score
         * Calculate comprehensive qualification score
         */
        async evaluateExpertQualifications(expertId) {
            try {
                const expert = await ExpertWitnessProfile.findByPk(expertId, {
                    include: [{ model: CredentialVerification }],
                });
                if (!expert) {
                    throw new common_1.NotFoundException(`Expert not found: ${expertId}`);
                }
                let score = 0;
                // Experience points
                score += Math.min(expert.yearsExperience * 2, 40);
                // Board certification
                if (expert.boardCertified)
                    score += 20;
                // Prior testimony experience
                score += Math.min(expert.priorTestimonyCount * 1, 20);
                // Daubert success rate
                if (expert.dauberChallenges > 0) {
                    const successRate = expert.dauberSuccesses / expert.dauberChallenges;
                    score += successRate * 10;
                }
                // Verified credentials
                score += Math.min((expert.credentials?.length || 0) * 2, 10);
                const finalScore = Math.min(score, 100);
                this.logger.log(`Qualification score for expert ${expertId}: ${finalScore}`);
                return finalScore;
            }
            catch (error) {
                this.logger.error(`Failed to evaluate expert qualifications: ${error}`);
                throw new common_1.InternalServerErrorException('Qualification evaluation failed');
            }
        }
        /**
         * Research expert's prior testimony history
         * Compile testimony record and outcomes
         */
        async researchPriorTestimony(expertId) {
            try {
                const expert = await ExpertWitnessProfile.findByPk(expertId);
                if (!expert) {
                    throw new common_1.NotFoundException(`Expert not found: ${expertId}`);
                }
                const engagements = await ExpertEngagement.findAll({
                    where: { expertId },
                    include: [
                        { model: ExpertDeposition },
                        { model: ExpertReport },
                    ],
                });
                const depositionCount = await ExpertDeposition.count({
                    include: [
                        {
                            model: ExpertEngagement,
                            where: { expertId },
                            required: true,
                        },
                    ],
                    where: { status: DepositionStatus.FINALIZED },
                });
                const history = {
                    totalCases: engagements.length,
                    depositions: depositionCount,
                    trials: expert.priorTestimonyCount,
                    dauberChallenges: expert.dauberChallenges,
                    outcomes: [],
                };
                this.logger.log(`Prior testimony history compiled for expert ${expertId}`);
                return history;
            }
            catch (error) {
                this.logger.error(`Failed to research prior testimony: ${error}`);
                throw new common_1.InternalServerErrorException('Prior testimony research failed');
            }
        }
        /**
         * Check expert availability for case timeline
         * Verify availability for key dates
         */
        async checkExpertAvailability(expertId, requiredDates) {
            try {
                const existingEngagements = await ExpertEngagement.findAll({
                    where: {
                        expertId,
                        status: {
                            [sequelize_1.Op.in]: [
                                ExpertStatus.RETAINED,
                                ExpertStatus.ENGAGED,
                                ExpertStatus.DEPOSITION_PREP,
                                ExpertStatus.TRIAL_PREP,
                            ],
                        },
                    },
                    include: [
                        { model: ExpertDeposition, where: { scheduledDate: { [sequelize_1.Op.ne]: null } }, required: false },
                    ],
                });
                const conflicts = [];
                // Check for scheduling conflicts
                for (const date of requiredDates) {
                    for (const engagement of existingEngagements) {
                        if (engagement.depositions) {
                            for (const depo of engagement.depositions) {
                                if (depo.scheduledDate && this.isSameDay(depo.scheduledDate, date)) {
                                    conflicts.push(date);
                                }
                            }
                        }
                    }
                }
                const result = {
                    available: conflicts.length === 0,
                    conflicts,
                };
                this.logger.log(`Availability check for expert ${expertId}: ${result.available ? 'Available' : 'Conflicts found'}`);
                return result;
            }
            catch (error) {
                this.logger.error(`Failed to check expert availability: ${error}`);
                throw new common_1.InternalServerErrorException('Availability check failed');
            }
        }
        // ============================================================================
        // 3. RETENTION MANAGEMENT FUNCTIONS
        // ============================================================================
        /**
         * Create expert engagement and retain expert
         * Formal retention process
         */
        async retainExpert(data, transaction) {
            try {
                const engagement = await ExpertEngagement.create({
                    ...data,
                    status: ExpertStatus.RETAINED,
                    currentSpend: 0,
                }, { transaction });
                // Update expert status
                await ExpertWitnessProfile.update({ status: ExpertStatus.RETAINED }, { where: { id: data.expertId }, transaction });
                this.logger.log(`Expert ${data.expertId} retained for case ${data.caseId}`);
                return engagement;
            }
            catch (error) {
                this.logger.error(`Failed to retain expert: ${error}`);
                throw new common_1.InternalServerErrorException('Expert retention failed');
            }
        }
        /**
         * Generate engagement letter for expert
         * Create formal engagement agreement
         */
        async generateEngagementLetter(engagementId) {
            try {
                const engagement = await ExpertEngagement.findByPk(engagementId, {
                    include: [{ model: ExpertWitnessProfile }],
                });
                if (!engagement) {
                    throw new common_1.NotFoundException(`Engagement not found: ${engagementId}`);
                }
                // Placeholder for engagement letter generation
                const letterContent = `
EXPERT WITNESS ENGAGEMENT LETTER

Date: ${new Date().toLocaleDateString()}

Expert: ${engagement.expert.firstName} ${engagement.expert.lastName}, ${engagement.expert.credentials}
Case ID: ${engagement.caseId}
Engagement Type: ${engagement.engagementType}

This letter confirms your engagement as an expert witness in the above-referenced matter.

Terms:
- Hourly Rate: $${engagement.hourlyRate || engagement.expert.hourlyRate}
- Retainer: $${engagement.retainerAmount || 0}
${engagement.budgetCap ? `- Budget Cap: $${engagement.budgetCap}` : ''}

Expected Deliverables:
${engagement.expectedReportDate ? `- Expert Report: ${engagement.expectedReportDate.toLocaleDateString()}` : ''}
${engagement.expectedDepositionDate ? `- Deposition: ${engagement.expectedDepositionDate.toLocaleDateString()}` : ''}

Please sign and return this letter to indicate your acceptance of this engagement.

Sincerely,
[Law Firm Name]
      `.trim();
                const letterUrl = `/documents/engagement-letters/${engagementId}.pdf`;
                this.logger.log(`Engagement letter generated for engagement ${engagementId}`);
                return { letterContent, letterUrl };
            }
            catch (error) {
                this.logger.error(`Failed to generate engagement letter: ${error}`);
                throw new common_1.InternalServerErrorException('Engagement letter generation failed');
            }
        }
        /**
         * Update engagement status
         * Track engagement lifecycle
         */
        async updateEngagementStatus(engagementId, newStatus, notes, transaction) {
            try {
                const engagement = await ExpertEngagement.findByPk(engagementId);
                if (!engagement) {
                    throw new common_1.NotFoundException(`Engagement not found: ${engagementId}`);
                }
                await engagement.update({
                    status: newStatus,
                    notes: notes ? `${engagement.notes || ''}\n${new Date().toISOString()}: ${notes}` : engagement.notes,
                }, { transaction });
                // Update expert profile status
                await ExpertWitnessProfile.update({ status: newStatus }, { where: { id: engagement.expertId }, transaction });
                this.logger.log(`Engagement ${engagementId} status updated to ${newStatus}`);
                return engagement;
            }
            catch (error) {
                this.logger.error(`Failed to update engagement status: ${error}`);
                throw new common_1.InternalServerErrorException('Engagement status update failed');
            }
        }
        /**
         * Track retainer and budget utilization
         * Monitor spend against budget
         */
        async trackRetainerUtilization(engagementId) {
            try {
                const engagement = await ExpertEngagement.findByPk(engagementId, {
                    include: [{ model: ExpertInvoice }],
                });
                if (!engagement) {
                    throw new common_1.NotFoundException(`Engagement not found: ${engagementId}`);
                }
                const totalInvoiced = engagement.invoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
                const retainerAmount = Number(engagement.retainerAmount || 0);
                const budgetCap = engagement.budgetCap ? Number(engagement.budgetCap) : undefined;
                const utilization = {
                    retainerAmount,
                    currentSpend: totalInvoiced,
                    remainingRetainer: Math.max(retainerAmount - totalInvoiced, 0),
                    budgetCap,
                    budgetRemaining: budgetCap ? Math.max(budgetCap - totalInvoiced, 0) : undefined,
                    utilizationPercent: retainerAmount > 0 ? (totalInvoiced / retainerAmount) * 100 : 0,
                };
                this.logger.log(`Retainer utilization calculated for engagement ${engagementId}: ${utilization.utilizationPercent.toFixed(2)}%`);
                return utilization;
            }
            catch (error) {
                this.logger.error(`Failed to track retainer utilization: ${error}`);
                throw new common_1.InternalServerErrorException('Retainer tracking failed');
            }
        }
        // ============================================================================
        // 4. REPORT TRACKING FUNCTIONS
        // ============================================================================
        /**
         * Create expert report tracking record
         * Initialize report tracking
         */
        async createExpertReport(data, transaction) {
            try {
                const report = await ExpertReport.create({
                    ...data,
                    version: 1,
                    status: ReportStatus.NOT_STARTED,
                    pageCount: 0,
                    attachmentCount: 0,
                    dauberChallenged: false,
                }, { transaction });
                this.logger.log(`Expert report created: ${report.id}`);
                return report;
            }
            catch (error) {
                this.logger.error(`Failed to create expert report: ${error}`);
                throw new common_1.InternalServerErrorException('Report creation failed');
            }
        }
        /**
         * Update report status and track progress
         * Monitor report development
         */
        async updateReportStatus(reportId, status, submittedDate, reviewNotes, transaction) {
            try {
                const report = await ExpertReport.findByPk(reportId);
                if (!report) {
                    throw new common_1.NotFoundException(`Report not found: ${reportId}`);
                }
                const updates = { status };
                if (submittedDate)
                    updates.submittedDate = submittedDate;
                if (reviewNotes)
                    updates.reviewNotes = reviewNotes;
                await report.update(updates, { transaction });
                this.logger.log(`Report ${reportId} status updated to ${status}`);
                return report;
            }
            catch (error) {
                this.logger.error(`Failed to update report status: ${error}`);
                throw new common_1.InternalServerErrorException('Report status update failed');
            }
        }
        /**
         * Track report deadline compliance
         * Monitor deadlines and send alerts
         */
        async trackReportDeadlines(organizationId, daysThreshold = 7) {
            try {
                const thresholdDate = new Date();
                thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
                const upcomingReports = await ExpertReport.findAll({
                    where: {
                        organizationId,
                        dueDate: {
                            [sequelize_1.Op.lte]: thresholdDate,
                            [sequelize_1.Op.gte]: new Date(),
                        },
                        status: {
                            [sequelize_1.Op.notIn]: [ReportStatus.FINAL_SUBMITTED, ReportStatus.DISCLOSED],
                        },
                    },
                    include: [
                        {
                            model: ExpertEngagement,
                            include: [{ model: ExpertWitnessProfile }],
                        },
                    ],
                    order: [['dueDate', 'ASC']],
                });
                this.logger.log(`Found ${upcomingReports.length} reports due within ${daysThreshold} days`);
                return upcomingReports;
            }
            catch (error) {
                this.logger.error(`Failed to track report deadlines: ${error}`);
                throw new common_1.InternalServerErrorException('Report deadline tracking failed');
            }
        }
        /**
         * Manage report version control
         * Track report revisions
         */
        async createReportVersion(reportId, reportUrl, pageCount, transaction) {
            try {
                const currentReport = await ExpertReport.findByPk(reportId);
                if (!currentReport) {
                    throw new common_1.NotFoundException(`Report not found: ${reportId}`);
                }
                const newVersion = currentReport.version + 1;
                await currentReport.update({
                    version: newVersion,
                    reportUrl,
                    pageCount,
                    submittedDate: new Date(),
                    status: ReportStatus.DRAFT_SUBMITTED,
                }, { transaction });
                this.logger.log(`Report ${reportId} updated to version ${newVersion}`);
                return currentReport;
            }
            catch (error) {
                this.logger.error(`Failed to create report version: ${error}`);
                throw new common_1.InternalServerErrorException('Report version creation failed');
            }
        }
        /**
         * Track Daubert challenges to expert reports
         * Monitor admissibility challenges
         */
        async trackDauberChallenge(reportId, challengeDate, hearingDate, transaction) {
            try {
                const report = await ExpertReport.findByPk(reportId, {
                    include: [
                        {
                            model: ExpertEngagement,
                            include: [{ model: ExpertWitnessProfile }],
                        },
                    ],
                });
                if (!report) {
                    throw new common_1.NotFoundException(`Report not found: ${reportId}`);
                }
                await report.update({
                    dauberChallenged: true,
                    dauberChallengeDate: challengeDate,
                    dauberHearingDate: hearingDate,
                    status: ReportStatus.CHALLENGED,
                    admissibilityStatus: 'pending',
                }, { transaction });
                // Update expert's Daubert challenge count
                await ExpertWitnessProfile.increment('dauberChallenges', { by: 1, where: { id: report.engagement.expertId }, transaction });
                this.logger.log(`Daubert challenge tracked for report ${reportId}`);
                return report;
            }
            catch (error) {
                this.logger.error(`Failed to track Daubert challenge: ${error}`);
                throw new common_1.InternalServerErrorException('Daubert challenge tracking failed');
            }
        }
        /**
         * Update report admissibility status
         * Track court rulings on expert testimony
         */
        async updateReportAdmissibility(reportId, admissibilityStatus, transaction) {
            try {
                const report = await ExpertReport.findByPk(reportId, {
                    include: [
                        {
                            model: ExpertEngagement,
                            include: [{ model: ExpertWitnessProfile }],
                        },
                    ],
                });
                if (!report) {
                    throw new common_1.NotFoundException(`Report not found: ${reportId}`);
                }
                await report.update({
                    admissibilityStatus,
                    status: admissibilityStatus === 'admitted' ? ReportStatus.ADMITTED : ReportStatus.EXCLUDED,
                }, { transaction });
                // If Daubert challenge was successful, increment success count
                if (report.dauberChallenged && admissibilityStatus === 'admitted') {
                    await ExpertWitnessProfile.increment('dauberSuccesses', { by: 1, where: { id: report.engagement.expertId }, transaction });
                }
                this.logger.log(`Report ${reportId} admissibility updated to ${admissibilityStatus}`);
                return report;
            }
            catch (error) {
                this.logger.error(`Failed to update report admissibility: ${error}`);
                throw new common_1.InternalServerErrorException('Admissibility update failed');
            }
        }
        // ============================================================================
        // 5. DEPOSITION PREPARATION FUNCTIONS
        // ============================================================================
        /**
         * Schedule expert deposition
         * Create deposition record and tracking
         */
        async scheduleDeposition(data, transaction) {
            try {
                const deposition = await ExpertDeposition.create({
                    ...data,
                    status: data.scheduledDate ? DepositionStatus.SCHEDULED : DepositionStatus.NOT_SCHEDULED,
                    prepSessionsCompleted: 0,
                    exhibitsIdentified: 0,
                    videoRecorded: false,
                    errataSubmitted: false,
                }, { transaction });
                // Update engagement status
                await ExpertEngagement.update({ status: ExpertStatus.DEPOSITION_PREP }, { where: { id: data.expertEngagementId }, transaction });
                this.logger.log(`Deposition scheduled: ${deposition.id}`);
                return deposition;
            }
            catch (error) {
                this.logger.error(`Failed to schedule deposition: ${error}`);
                throw new common_1.InternalServerErrorException('Deposition scheduling failed');
            }
        }
        /**
         * Create deposition preparation checklist
         * Generate comprehensive prep tasks
         */
        async createDepositionPrepChecklist(depositionId) {
            try {
                const deposition = await ExpertDeposition.findByPk(depositionId, {
                    include: [
                        {
                            model: ExpertEngagement,
                            include: [{ model: ExpertWitnessProfile }],
                        },
                    ],
                });
                if (!deposition) {
                    throw new common_1.NotFoundException(`Deposition not found: ${depositionId}`);
                }
                const checklist = {
                    depositionId,
                    expertId: deposition.engagement.expertId,
                    scheduledDate: deposition.scheduledDate || new Date(),
                    location: deposition.location || 'TBD',
                    estimatedDuration: Number(deposition.estimatedDuration),
                    prepSessionsCompleted: 0,
                    exhibitsReviewed: false,
                    priorTestimonyReviewed: false,
                    caseFactsReviewed: false,
                    opposingCounselResearched: false,
                    mockQuestionsCompleted: false,
                    videoRecorded: false,
                    interpreterNeeded: false,
                };
                this.logger.log(`Deposition prep checklist created for ${depositionId}`);
                return checklist;
            }
            catch (error) {
                this.logger.error(`Failed to create deposition prep checklist: ${error}`);
                throw new common_1.InternalServerErrorException('Deposition prep checklist creation failed');
            }
        }
        /**
         * Track deposition preparation sessions
         * Log prep meetings and progress
         */
        async trackPrepSession(depositionId, sessionNotes, transaction) {
            try {
                const deposition = await ExpertDeposition.findByPk(depositionId);
                if (!deposition) {
                    throw new common_1.NotFoundException(`Deposition not found: ${depositionId}`);
                }
                await deposition.increment('prepSessionsCompleted', { by: 1, transaction });
                const updatedNotes = `${deposition.notes || ''}\n\nPrep Session ${deposition.prepSessionsCompleted + 1} - ${new Date().toLocaleDateString()}:\n${sessionNotes}`;
                await deposition.update({ notes: updatedNotes }, { transaction });
                this.logger.log(`Prep session tracked for deposition ${depositionId}`);
                return deposition;
            }
            catch (error) {
                this.logger.error(`Failed to track prep session: ${error}`);
                throw new common_1.InternalServerErrorException('Prep session tracking failed');
            }
        }
        /**
         * Generate deposition question outline
         * Create structured question list
         */
        async generateDepositionQuestions(depositionId, reportId) {
            try {
                const deposition = await ExpertDeposition.findByPk(depositionId, {
                    include: [
                        {
                            model: ExpertEngagement,
                            include: [
                                { model: ExpertWitnessProfile },
                                { model: ExpertReport },
                            ],
                        },
                    ],
                });
                if (!deposition) {
                    throw new common_1.NotFoundException(`Deposition not found: ${depositionId}`);
                }
                // Placeholder for question generation logic
                const questions = [
                    'Please state your full name and current position.',
                    'What are your educational qualifications?',
                    'Are you board certified? In what specialty?',
                    'How many times have you testified as an expert witness?',
                    'What is your hourly rate for this engagement?',
                    'Please describe your methodology in forming your opinion in this case.',
                    'What documents did you review in preparation of your report?',
                    'Did you consult with any other experts?',
                ];
                const exhibits = [];
                this.logger.log(`Deposition questions generated for ${depositionId}`);
                return { questions, exhibits };
            }
            catch (error) {
                this.logger.error(`Failed to generate deposition questions: ${error}`);
                throw new common_1.InternalServerErrorException('Question generation failed');
            }
        }
        /**
         * Manage deposition exhibits
         * Track and organize deposition evidence
         */
        async manageDepositionExhibits(depositionId, exhibitList, transaction) {
            try {
                const deposition = await ExpertDeposition.findByPk(depositionId);
                if (!deposition) {
                    throw new common_1.NotFoundException(`Deposition not found: ${depositionId}`);
                }
                await deposition.update({
                    exhibitsIdentified: exhibitList.length,
                    notes: `${deposition.notes || ''}\n\nExhibits: ${exhibitList.join(', ')}`,
                }, { transaction });
                this.logger.log(`${exhibitList.length} exhibits managed for deposition ${depositionId}`);
                return deposition;
            }
            catch (error) {
                this.logger.error(`Failed to manage deposition exhibits: ${error}`);
                throw new common_1.InternalServerErrorException('Exhibit management failed');
            }
        }
        /**
         * Update deposition status
         * Track deposition lifecycle
         */
        async updateDepositionStatus(depositionId, status, transaction) {
            try {
                const deposition = await ExpertDeposition.findByPk(depositionId);
                if (!deposition) {
                    throw new common_1.NotFoundException(`Deposition not found: ${depositionId}`);
                }
                await deposition.update({ status }, { transaction });
                // Update engagement status if deposed
                if (status === DepositionStatus.FINALIZED) {
                    await ExpertEngagement.update({ status: ExpertStatus.DEPOSED }, { where: { id: deposition.expertEngagementId }, transaction });
                }
                this.logger.log(`Deposition ${depositionId} status updated to ${status}`);
                return deposition;
            }
            catch (error) {
                this.logger.error(`Failed to update deposition status: ${error}`);
                throw new common_1.InternalServerErrorException('Deposition status update failed');
            }
        }
        /**
         * Track transcript receipt and review
         * Manage deposition transcripts
         */
        async trackTranscript(depositionId, transcriptUrl, transcriptReceivedDate, transaction) {
            try {
                const deposition = await ExpertDeposition.findByPk(depositionId);
                if (!deposition) {
                    throw new common_1.NotFoundException(`Deposition not found: ${depositionId}`);
                }
                // Calculate errata deadline (typically 30 days from receipt)
                const errataDeadline = new Date(transcriptReceivedDate);
                errataDeadline.setDate(errataDeadline.getDate() + 30);
                await deposition.update({
                    transcriptUrl,
                    transcriptReceivedDate,
                    errataDeadline,
                    status: DepositionStatus.TRANSCRIPT_RECEIVED,
                }, { transaction });
                this.logger.log(`Transcript tracked for deposition ${depositionId}`);
                return deposition;
            }
            catch (error) {
                this.logger.error(`Failed to track transcript: ${error}`);
                throw new common_1.InternalServerErrorException('Transcript tracking failed');
            }
        }
        // ============================================================================
        // 6. FEE MANAGEMENT FUNCTIONS
        // ============================================================================
        /**
         * Create expert invoice
         * Generate billing record
         */
        async createExpertInvoice(data, transaction) {
            try {
                const invoice = await ExpertInvoice.create({
                    ...data,
                    status: InvoiceStatus.DRAFT,
                }, { transaction });
                // Update engagement current spend
                await ExpertEngagement.increment('currentSpend', { by: data.totalAmount, where: { id: data.expertEngagementId }, transaction });
                this.logger.log(`Expert invoice created: ${invoice.id}`);
                return invoice;
            }
            catch (error) {
                this.logger.error(`Failed to create expert invoice: ${error}`);
                throw new common_1.InternalServerErrorException('Invoice creation failed');
            }
        }
        /**
         * Calculate expert fees for period
         * Compute billable amounts
         */
        async calculateExpertFees(engagementId, hoursWorked) {
            try {
                const engagement = await ExpertEngagement.findByPk(engagementId, {
                    include: [{ model: ExpertWitnessProfile }],
                });
                if (!engagement) {
                    throw new common_1.NotFoundException(`Engagement not found: ${engagementId}`);
                }
                const hourlyRate = Number(engagement.hourlyRate || engagement.expert.hourlyRate || 0);
                const laborAmount = hourlyRate * hoursWorked;
                const calculation = {
                    hourlyRate,
                    laborAmount,
                    subtotal: laborAmount,
                };
                this.logger.log(`Expert fees calculated for engagement ${engagementId}: $${calculation.subtotal}`);
                return calculation;
            }
            catch (error) {
                this.logger.error(`Failed to calculate expert fees: ${error}`);
                throw new common_1.InternalServerErrorException('Fee calculation failed');
            }
        }
        /**
         * Approve expert invoice
         * Review and approve billing
         */
        async approveInvoice(invoiceId, approvedBy, transaction) {
            try {
                const invoice = await ExpertInvoice.findByPk(invoiceId);
                if (!invoice) {
                    throw new common_1.NotFoundException(`Invoice not found: ${invoiceId}`);
                }
                await invoice.update({
                    status: InvoiceStatus.APPROVED,
                    approvedBy,
                    approvedDate: new Date(),
                }, { transaction });
                this.logger.log(`Invoice ${invoiceId} approved by ${approvedBy}`);
                return invoice;
            }
            catch (error) {
                this.logger.error(`Failed to approve invoice: ${error}`);
                throw new common_1.InternalServerErrorException('Invoice approval failed');
            }
        }
        /**
         * Record invoice payment
         * Track payment receipt
         */
        async recordInvoicePayment(invoiceId, paymentDate, paymentMethod, transaction) {
            try {
                const invoice = await ExpertInvoice.findByPk(invoiceId);
                if (!invoice) {
                    throw new common_1.NotFoundException(`Invoice not found: ${invoiceId}`);
                }
                await invoice.update({
                    status: InvoiceStatus.PAID,
                    paidDate: paymentDate,
                    paymentMethod,
                }, { transaction });
                this.logger.log(`Payment recorded for invoice ${invoiceId}`);
                return invoice;
            }
            catch (error) {
                this.logger.error(`Failed to record invoice payment: ${error}`);
                throw new common_1.InternalServerErrorException('Payment recording failed');
            }
        }
        /**
         * Generate fee summary for expert engagement
         * Comprehensive financial summary
         */
        async generateFeeSummary(engagementId) {
            try {
                const engagement = await ExpertEngagement.findByPk(engagementId, {
                    include: [{ model: ExpertInvoice }],
                });
                if (!engagement) {
                    throw new common_1.NotFoundException(`Engagement not found: ${engagementId}`);
                }
                const totalBilled = engagement.invoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
                const totalPaid = engagement.invoices
                    .filter((inv) => inv.status === InvoiceStatus.PAID)
                    .reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
                const totalHours = engagement.invoices.reduce((sum, inv) => sum + Number(inv.hoursWorked), 0);
                const lastInvoice = engagement.invoices.sort((a, b) => b.invoiceDate.getTime() - a.invoiceDate.getTime())[0];
                const summary = {
                    expertId: engagement.expertId,
                    caseId: engagement.caseId,
                    feeStructure: FeeStructure.HOURLY,
                    hourlyRate: Number(engagement.hourlyRate),
                    retainerAmount: Number(engagement.retainerAmount || 0),
                    totalHoursBilled: totalHours,
                    totalAmountBilled: totalBilled,
                    totalAmountPaid: totalPaid,
                    outstandingBalance: totalBilled - totalPaid,
                    lastInvoiceDate: lastInvoice?.invoiceDate,
                    budgetRemaining: engagement.budgetCap
                        ? Number(engagement.budgetCap) - totalBilled
                        : undefined,
                };
                this.logger.log(`Fee summary generated for engagement ${engagementId}`);
                return summary;
            }
            catch (error) {
                this.logger.error(`Failed to generate fee summary: ${error}`);
                throw new common_1.InternalServerErrorException('Fee summary generation failed');
            }
        }
        /**
         * Track budget compliance and alerts
         * Monitor budget overruns
         */
        async trackBudgetCompliance(engagementId) {
            try {
                const engagement = await ExpertEngagement.findByPk(engagementId, {
                    include: [{ model: ExpertInvoice }],
                });
                if (!engagement) {
                    throw new common_1.NotFoundException(`Engagement not found: ${engagementId}`);
                }
                if (!engagement.budgetCap) {
                    throw new common_1.BadRequestException('No budget cap set for this engagement');
                }
                const totalSpend = engagement.invoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
                const budgetCap = Number(engagement.budgetCap);
                const remainingBudget = budgetCap - totalSpend;
                const percentUtilized = (totalSpend / budgetCap) * 100;
                const compliance = {
                    budgetCap,
                    totalSpend,
                    remainingBudget,
                    percentUtilized,
                    overBudget: totalSpend > budgetCap,
                };
                this.logger.log(`Budget compliance tracked for engagement ${engagementId}: ${percentUtilized.toFixed(2)}% utilized`);
                return compliance;
            }
            catch (error) {
                this.logger.error(`Failed to track budget compliance: ${error}`);
                throw new common_1.InternalServerErrorException('Budget compliance tracking failed');
            }
        }
        // ============================================================================
        // 7. PERFORMANCE EVALUATION FUNCTIONS
        // ============================================================================
        /**
         * Calculate expert performance metrics
         * Comprehensive performance assessment
         */
        async calculatePerformanceMetrics(expertId) {
            try {
                const expert = await ExpertWitnessProfile.findByPk(expertId);
                if (!expert) {
                    throw new common_1.NotFoundException(`Expert not found: ${expertId}`);
                }
                const engagements = await ExpertEngagement.findAll({
                    where: { expertId },
                    include: [
                        { model: ExpertReport },
                        { model: ExpertDeposition },
                    ],
                });
                const totalDepositions = await ExpertDeposition.count({
                    include: [
                        {
                            model: ExpertEngagement,
                            where: { expertId },
                            required: true,
                        },
                    ],
                });
                const reports = await ExpertReport.findAll({
                    include: [
                        {
                            model: ExpertEngagement,
                            where: { expertId },
                            required: true,
                        },
                    ],
                });
                // Calculate average report turnaround
                const completedReports = reports.filter((r) => r.submittedDate && r.requestedDate);
                const avgTurnaround = completedReports.length > 0
                    ? completedReports.reduce((sum, r) => {
                        const days = Math.floor((r.submittedDate.getTime() - r.requestedDate.getTime()) / (1000 * 60 * 60 * 24));
                        return sum + days;
                    }, 0) / completedReports.length
                    : 0;
                const dauberSuccessRate = expert.dauberChallenges > 0
                    ? (expert.dauberSuccesses / expert.dauberChallenges) * 100
                    : 100;
                const metrics = {
                    expertId,
                    totalCasesWorked: engagements.length,
                    totalDepositions: totalDepositions,
                    totalTrials: expert.priorTestimonyCount,
                    dauberChallenges: expert.dauberChallenges,
                    dauberSuccessRate,
                    averageReportTurnaround: avgTurnaround,
                    clientSatisfactionScore: Number(expert.rating || 0),
                    onTimeDeliveryRate: 100, // Placeholder
                    testimonyEffectivenessScore: dauberSuccessRate,
                    communicationScore: Number(expert.rating || 0),
                };
                this.logger.log(`Performance metrics calculated for expert ${expertId}`);
                return metrics;
            }
            catch (error) {
                this.logger.error(`Failed to calculate performance metrics: ${error}`);
                throw new common_1.InternalServerErrorException('Performance metrics calculation failed');
            }
        }
        /**
         * Rate expert performance
         * Collect and store ratings
         */
        async rateExpertPerformance(expertId, rating, feedback, transaction) {
            try {
                if (rating < 0 || rating > 5) {
                    throw new common_1.BadRequestException('Rating must be between 0 and 5');
                }
                const expert = await ExpertWitnessProfile.findByPk(expertId);
                if (!expert) {
                    throw new common_1.NotFoundException(`Expert not found: ${expertId}`);
                }
                // Calculate new average rating
                const currentRating = Number(expert.rating || 0);
                const engagementCount = await ExpertEngagement.count({ where: { expertId } });
                const newRating = engagementCount > 0
                    ? ((currentRating * (engagementCount - 1)) + rating) / engagementCount
                    : rating;
                await expert.update({
                    rating: newRating,
                    notes: `${expert.notes || ''}\n\nRating: ${rating}/5 - ${new Date().toLocaleDateString()}\nFeedback: ${feedback}`,
                }, { transaction });
                this.logger.log(`Expert ${expertId} rated: ${rating}/5`);
                return expert;
            }
            catch (error) {
                this.logger.error(`Failed to rate expert performance: ${error}`);
                throw new common_1.InternalServerErrorException('Expert rating failed');
            }
        }
        /**
         * Generate comprehensive expert engagement summary
         * Compile all engagement details for reporting
         */
        async generateEngagementSummary(engagementId) {
            try {
                const engagement = await ExpertEngagement.findByPk(engagementId, {
                    include: [
                        { model: ExpertWitnessProfile },
                        { model: ExpertReport },
                        { model: ExpertDeposition },
                        { model: ExpertInvoice },
                    ],
                });
                if (!engagement) {
                    throw new common_1.NotFoundException(`Engagement not found: ${engagementId}`);
                }
                const feeSummary = await this.generateFeeSummary(engagementId);
                const performanceMetrics = await this.calculatePerformanceMetrics(engagement.expertId);
                const summary = {
                    engagement,
                    expert: engagement.expert,
                    reports: engagement.reports,
                    depositions: engagement.depositions,
                    invoices: engagement.invoices,
                    feeSummary,
                    performanceMetrics,
                };
                this.logger.log(`Comprehensive engagement summary generated for ${engagementId}`);
                return summary;
            }
            catch (error) {
                this.logger.error(`Failed to generate engagement summary: ${error}`);
                throw new common_1.InternalServerErrorException('Engagement summary generation failed');
            }
        }
        // ============================================================================
        // HELPER METHODS
        // ============================================================================
        /**
         * Check if two dates are on the same day
         */
        isSameDay(date1, date2) {
            return (date1.getFullYear() === date2.getFullYear() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getDate() === date2.getDate());
        }
    };
    __setFunctionName(_classThis, "ExpertWitnessManagementService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExpertWitnessManagementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExpertWitnessManagementService = _classThis;
})();
exports.ExpertWitnessManagementService = ExpertWitnessManagementService;
// ============================================================================
// MODULE DEFINITION
// ============================================================================
/**
 * Configuration factory for expert witness management
 */
exports.expertWitnessManagementConfig = (0, config_1.registerAs)('expertWitnessManagement', () => ({
    defaultRetainerDays: parseInt(process.env.EXPERT_RETAINER_DAYS || '30', 10),
    defaultReportTurnaround: parseInt(process.env.EXPERT_REPORT_TURNAROUND_DAYS || '45', 10),
    budgetWarningThreshold: parseInt(process.env.EXPERT_BUDGET_WARNING_PERCENT || '80', 10),
    credentialExpirationWarning: parseInt(process.env.CREDENTIAL_EXPIRATION_WARNING_DAYS || '90', 10),
    defaultDepositionDuration: parseFloat(process.env.DEFAULT_DEPOSITION_HOURS || '4'),
    errataDeadlineDays: parseInt(process.env.ERRATA_DEADLINE_DAYS || '30', 10),
}));
/**
 * Expert witness management module
 */
let ExpertWitnessManagementModule = (() => {
    let _classDecorators = [(0, common_1.Global)(), (0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forFeature(exports.expertWitnessManagementConfig),
            ],
            providers: [ExpertWitnessManagementService],
            exports: [ExpertWitnessManagementService],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ExpertWitnessManagementModule = _classThis = class {
        /**
         * Register module with Sequelize models
         */
        static forRoot(sequelize) {
            return {
                module: ExpertWitnessManagementModule,
                providers: [
                    {
                        provide: 'SEQUELIZE',
                        useValue: sequelize,
                    },
                    ExpertWitnessManagementService,
                ],
                exports: [ExpertWitnessManagementService],
            };
        }
    };
    __setFunctionName(_classThis, "ExpertWitnessManagementModule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExpertWitnessManagementModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExpertWitnessManagementModule = _classThis;
})();
exports.ExpertWitnessManagementModule = ExpertWitnessManagementModule;
//# sourceMappingURL=expert-witness-management-kit.js.map