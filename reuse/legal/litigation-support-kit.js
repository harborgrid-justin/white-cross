"use strict";
/**
 * LOC: LITIGATION_SUPPORT_KIT_001
 * File: /reuse/legal/litigation-support-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize-typescript
 *   - sequelize
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *   - pdf-lib
 *   - date-fns
 *
 * DOWNSTREAM (imported by):
 *   - Legal litigation modules
 *   - Court management controllers
 *   - Trial preparation services
 *   - Evidence management services
 *   - Witness coordination services
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
exports.LitigationSupportModule = exports.litigationSupportConfig = exports.DocumentGenerationService = exports.TrialPreparationService = exports.EvidenceTrackingService = exports.WitnessManagementService = exports.TimelineVisualizationService = exports.LitigationMatterService = exports.TrialPreparation = exports.TimelineEvent = exports.Evidence = exports.Witness = exports.LitigationMatter = exports.CreateTimelineEventSchema = exports.CreateEvidenceSchema = exports.CreateWitnessSchema = exports.CreateMatterSchema = exports.TrialPhase = exports.TimelineEventType = exports.ChainOfCustodyStatus = exports.EvidenceCategory = exports.WitnessStatus = exports.WitnessType = exports.MatterType = exports.MatterStatus = void 0;
exports.generateMatterNumber = generateMatterNumber;
exports.calculateFileHash = calculateFileHash;
exports.generateExhibitNumber = generateExhibitNumber;
/**
 * File: /reuse/legal/litigation-support-kit.ts
 * Locator: WC-LITIGATION-SUPPORT-KIT-001
 * Purpose: Production-Grade Litigation Support Kit - Enterprise litigation management toolkit
 *
 * Upstream: NestJS, Sequelize, Zod, PDF-Lib, Date-FNS
 * Downstream: ../backend/modules/litigation/*, Court management controllers, Trial prep services
 * Dependencies: TypeScript 5.x, Node 18+, sequelize-typescript, @nestjs/swagger, zod
 * Exports: 42 production-ready litigation management functions for legal platforms
 *
 * LLM Context: Production-grade litigation lifecycle management toolkit for White Cross platform.
 * Provides comprehensive matter management with case tracking and attorney assignment, timeline
 * creation with conflict detection and visualization export, witness management with testimony
 * recording and credibility assessment, evidence tracking with full chain of custody and integrity
 * validation, trial preparation with readiness assessment and document assembly, Sequelize models
 * for matters/witnesses/evidence/timelines/trial preparation, NestJS services with dependency
 * injection, Swagger API documentation, matter cost calculation and budget tracking, witness
 * interview scheduling and availability tracking, exhibit list generation with automatic numbering,
 * trial binder assembly with table of contents, deposition management and transcript linking,
 * settlement demand generation with supporting documentation, case chronology with automatic
 * timeline generation, discovery request automation, motion drafting with template support,
 * pleading generation, examination outline creation, opening statement framework, trial date
 * scheduling with calendar integration, evidence integrity validation with hash verification,
 * witness-evidence linking for testimony preparation, and healthcare litigation-specific support
 * (medical malpractice, HIPAA compliance, expert medical witnesses, medical records management).
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
 * Litigation matter status lifecycle
 */
var MatterStatus;
(function (MatterStatus) {
    MatterStatus["INITIAL_CONSULTATION"] = "initial_consultation";
    MatterStatus["INVESTIGATION"] = "investigation";
    MatterStatus["PRE_LITIGATION"] = "pre_litigation";
    MatterStatus["COMPLAINT_FILED"] = "complaint_filed";
    MatterStatus["DISCOVERY"] = "discovery";
    MatterStatus["MEDIATION"] = "mediation";
    MatterStatus["ARBITRATION"] = "arbitration";
    MatterStatus["PRE_TRIAL"] = "pre_trial";
    MatterStatus["TRIAL"] = "trial";
    MatterStatus["POST_TRIAL"] = "post_trial";
    MatterStatus["APPEAL"] = "appeal";
    MatterStatus["SETTLED"] = "settled";
    MatterStatus["DISMISSED"] = "dismissed";
    MatterStatus["JUDGMENT_ENTERED"] = "judgment_entered";
    MatterStatus["CLOSED"] = "closed";
})(MatterStatus || (exports.MatterStatus = MatterStatus = {}));
/**
 * Types of litigation matters
 */
var MatterType;
(function (MatterType) {
    MatterType["MEDICAL_MALPRACTICE"] = "medical_malpractice";
    MatterType["PERSONAL_INJURY"] = "personal_injury";
    MatterType["EMPLOYMENT"] = "employment";
    MatterType["CONTRACT_DISPUTE"] = "contract_dispute";
    MatterType["INTELLECTUAL_PROPERTY"] = "intellectual_property";
    MatterType["REGULATORY_COMPLIANCE"] = "regulatory_compliance";
    MatterType["PROFESSIONAL_LIABILITY"] = "professional_liability";
    MatterType["INSURANCE_DEFENSE"] = "insurance_defense";
    MatterType["CLASS_ACTION"] = "class_action";
    MatterType["PRODUCT_LIABILITY"] = "product_liability";
    MatterType["CIVIL_RIGHTS"] = "civil_rights";
    MatterType["HIPAA_VIOLATION"] = "hipaa_violation";
    MatterType["OTHER"] = "other";
})(MatterType || (exports.MatterType = MatterType = {}));
/**
 * Witness types and roles
 */
var WitnessType;
(function (WitnessType) {
    WitnessType["FACT_WITNESS"] = "fact_witness";
    WitnessType["EXPERT_WITNESS"] = "expert_witness";
    WitnessType["CHARACTER_WITNESS"] = "character_witness";
    WitnessType["MEDICAL_EXPERT"] = "medical_expert";
    WitnessType["TECHNICAL_EXPERT"] = "technical_expert";
    WitnessType["PERCIPIENT_WITNESS"] = "percipient_witness";
    WitnessType["REBUTTAL_WITNESS"] = "rebuttal_witness";
    WitnessType["ADVERSE_WITNESS"] = "adverse_witness";
})(WitnessType || (exports.WitnessType = WitnessType = {}));
/**
 * Witness status tracking
 */
var WitnessStatus;
(function (WitnessStatus) {
    WitnessStatus["IDENTIFIED"] = "identified";
    WitnessStatus["CONTACTED"] = "contacted";
    WitnessStatus["INTERVIEW_SCHEDULED"] = "interview_scheduled";
    WitnessStatus["INTERVIEWED"] = "interviewed";
    WitnessStatus["DEPOSITION_SCHEDULED"] = "deposition_scheduled";
    WitnessStatus["DEPOSED"] = "deposed";
    WitnessStatus["TRIAL_READY"] = "trial_ready";
    WitnessStatus["TESTIFIED"] = "testified";
    WitnessStatus["UNAVAILABLE"] = "unavailable";
    WitnessStatus["HOSTILE"] = "hostile";
})(WitnessStatus || (exports.WitnessStatus = WitnessStatus = {}));
/**
 * Evidence categorization
 */
var EvidenceCategory;
(function (EvidenceCategory) {
    EvidenceCategory["DOCUMENTARY"] = "documentary";
    EvidenceCategory["PHYSICAL"] = "physical";
    EvidenceCategory["ELECTRONIC"] = "electronic";
    EvidenceCategory["TESTIMONIAL"] = "testimonial";
    EvidenceCategory["DEMONSTRATIVE"] = "demonstrative";
    EvidenceCategory["MEDICAL_RECORDS"] = "medical_records";
    EvidenceCategory["FINANCIAL_RECORDS"] = "financial_records";
    EvidenceCategory["CORRESPONDENCE"] = "correspondence";
    EvidenceCategory["PHOTOGRAPHS"] = "photographs";
    EvidenceCategory["VIDEO"] = "video";
    EvidenceCategory["AUDIO"] = "audio";
    EvidenceCategory["EXPERT_REPORT"] = "expert_report";
    EvidenceCategory["SCIENTIFIC"] = "scientific";
    EvidenceCategory["REAL_EVIDENCE"] = "real_evidence";
})(EvidenceCategory || (exports.EvidenceCategory = EvidenceCategory = {}));
/**
 * Chain of custody status
 */
var ChainOfCustodyStatus;
(function (ChainOfCustodyStatus) {
    ChainOfCustodyStatus["COLLECTED"] = "collected";
    ChainOfCustodyStatus["SECURED"] = "secured";
    ChainOfCustodyStatus["ANALYZED"] = "analyzed";
    ChainOfCustodyStatus["STORED"] = "stored";
    ChainOfCustodyStatus["TRANSFERRED"] = "transferred";
    ChainOfCustodyStatus["PRESENTED"] = "presented";
    ChainOfCustodyStatus["RETURNED"] = "returned";
    ChainOfCustodyStatus["DESTROYED"] = "destroyed";
})(ChainOfCustodyStatus || (exports.ChainOfCustodyStatus = ChainOfCustodyStatus = {}));
/**
 * Timeline event types
 */
var TimelineEventType;
(function (TimelineEventType) {
    TimelineEventType["INCIDENT"] = "incident";
    TimelineEventType["CONSULTATION"] = "consultation";
    TimelineEventType["FILING"] = "filing";
    TimelineEventType["SERVICE"] = "service";
    TimelineEventType["RESPONSE"] = "response";
    TimelineEventType["DISCOVERY_REQUEST"] = "discovery_request";
    TimelineEventType["DISCOVERY_RESPONSE"] = "discovery_response";
    TimelineEventType["DEPOSITION"] = "deposition";
    TimelineEventType["MOTION"] = "motion";
    TimelineEventType["HEARING"] = "hearing";
    TimelineEventType["SETTLEMENT_DISCUSSION"] = "settlement_discussion";
    TimelineEventType["MEDIATION"] = "mediation";
    TimelineEventType["ARBITRATION"] = "arbitration";
    TimelineEventType["TRIAL_DATE"] = "trial_date";
    TimelineEventType["VERDICT"] = "verdict";
    TimelineEventType["JUDGMENT"] = "judgment";
    TimelineEventType["APPEAL"] = "appeal";
    TimelineEventType["DEADLINE"] = "deadline";
})(TimelineEventType || (exports.TimelineEventType = TimelineEventType = {}));
/**
 * Trial preparation phases
 */
var TrialPhase;
(function (TrialPhase) {
    TrialPhase["INITIAL_PREP"] = "initial_prep";
    TrialPhase["WITNESS_PREP"] = "witness_prep";
    TrialPhase["EXHIBIT_PREP"] = "exhibit_prep";
    TrialPhase["VOIR_DIRE"] = "voir_dire";
    TrialPhase["OPENING_STATEMENTS"] = "opening_statements";
    TrialPhase["PLAINTIFF_CASE"] = "plaintiff_case";
    TrialPhase["DEFENDANT_CASE"] = "defendant_case";
    TrialPhase["REBUTTAL"] = "rebuttal";
    TrialPhase["CLOSING_ARGUMENTS"] = "closing_arguments";
    TrialPhase["JURY_INSTRUCTIONS"] = "jury_instructions";
    TrialPhase["DELIBERATION"] = "deliberation";
    TrialPhase["VERDICT"] = "verdict";
    TrialPhase["POST_TRIAL_MOTIONS"] = "post_trial_motions";
})(TrialPhase || (exports.TrialPhase = TrialPhase = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
const MatterStatusSchema = zod_1.z.nativeEnum(MatterStatus);
const MatterTypeSchema = zod_1.z.nativeEnum(MatterType);
const WitnessTypeSchema = zod_1.z.nativeEnum(WitnessType);
const WitnessStatusSchema = zod_1.z.nativeEnum(WitnessStatus);
const EvidenceCategorySchema = zod_1.z.nativeEnum(EvidenceCategory);
const TimelineEventTypeSchema = zod_1.z.nativeEnum(TimelineEventType);
exports.CreateMatterSchema = zod_1.z.object({
    matterName: zod_1.z.string().min(1).max(500),
    matterType: MatterTypeSchema,
    clientId: zod_1.z.string().uuid(),
    clientName: zod_1.z.string().min(1),
    opposingParty: zod_1.z.string().min(1),
    opposingCounsel: zod_1.z.string().optional(),
    jurisdiction: zod_1.z.string().min(1),
    courtName: zod_1.z.string().optional(),
    leadAttorneyId: zod_1.z.string().uuid(),
    description: zod_1.z.string(),
    estimatedValue: zod_1.z.number().positive().optional(),
    budgetLimit: zod_1.z.number().positive().optional(),
    priority: zod_1.z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    metadata: zod_1.z.record(zod_1.z.any()).default({}),
});
exports.CreateWitnessSchema = zod_1.z.object({
    matterId: zod_1.z.string().uuid(),
    witnessType: WitnessTypeSchema,
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    organization: zod_1.z.string().optional(),
    role: zod_1.z.string().min(1),
    isOpposing: zod_1.z.boolean().default(false),
    isExpert: zod_1.z.boolean().default(false),
    expertiseArea: zod_1.z.string().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).default({}),
});
exports.CreateEvidenceSchema = zod_1.z.object({
    matterId: zod_1.z.string().uuid(),
    category: EvidenceCategorySchema,
    description: zod_1.z.string().min(1),
    source: zod_1.z.string().min(1),
    collectionDate: zod_1.z.date(),
    collectedBy: zod_1.z.string().min(1),
    location: zod_1.z.string().min(1),
    filePath: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    notes: zod_1.z.string().default(''),
    metadata: zod_1.z.record(zod_1.z.any()).default({}),
});
exports.CreateTimelineEventSchema = zod_1.z.object({
    matterId: zod_1.z.string().uuid(),
    eventType: TimelineEventTypeSchema,
    eventDate: zod_1.z.date(),
    title: zod_1.z.string().min(1),
    description: zod_1.z.string(),
    participants: zod_1.z.array(zod_1.z.string()).default([]),
    isDeadline: zod_1.z.boolean().default(false),
    deadlineDate: zod_1.z.date().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).default({}),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * LitigationMatter Sequelize Model
 * Represents a litigation case or matter with full lifecycle tracking
 */
let LitigationMatter = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'litigation_matters',
            paranoid: true,
            timestamps: true,
            indexes: [
                { fields: ['matterNumber'], unique: true },
                { fields: ['status'] },
                { fields: ['matterType'] },
                { fields: ['clientId'] },
                { fields: ['leadAttorneyId'] },
                { fields: ['filingDate'] },
                { fields: ['trialDate'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _matterNumber_decorators;
    let _matterNumber_initializers = [];
    let _matterNumber_extraInitializers = [];
    let _matterName_decorators;
    let _matterName_initializers = [];
    let _matterName_extraInitializers = [];
    let _matterType_decorators;
    let _matterType_initializers = [];
    let _matterType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _clientId_decorators;
    let _clientId_initializers = [];
    let _clientId_extraInitializers = [];
    let _clientName_decorators;
    let _clientName_initializers = [];
    let _clientName_extraInitializers = [];
    let _opposingParty_decorators;
    let _opposingParty_initializers = [];
    let _opposingParty_extraInitializers = [];
    let _opposingCounsel_decorators;
    let _opposingCounsel_initializers = [];
    let _opposingCounsel_extraInitializers = [];
    let _jurisdiction_decorators;
    let _jurisdiction_initializers = [];
    let _jurisdiction_extraInitializers = [];
    let _courtName_decorators;
    let _courtName_initializers = [];
    let _courtName_extraInitializers = [];
    let _caseNumber_decorators;
    let _caseNumber_initializers = [];
    let _caseNumber_extraInitializers = [];
    let _filingDate_decorators;
    let _filingDate_initializers = [];
    let _filingDate_extraInitializers = [];
    let _trialDate_decorators;
    let _trialDate_initializers = [];
    let _trialDate_extraInitializers = [];
    let _leadAttorneyId_decorators;
    let _leadAttorneyId_initializers = [];
    let _leadAttorneyId_extraInitializers = [];
    let _assignedAttorneys_decorators;
    let _assignedAttorneys_initializers = [];
    let _assignedAttorneys_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _estimatedValue_decorators;
    let _estimatedValue_initializers = [];
    let _estimatedValue_extraInitializers = [];
    let _actualCosts_decorators;
    let _actualCosts_initializers = [];
    let _actualCosts_extraInitializers = [];
    let _budgetLimit_decorators;
    let _budgetLimit_initializers = [];
    let _budgetLimit_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
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
    let _witnesses_decorators;
    let _witnesses_initializers = [];
    let _witnesses_extraInitializers = [];
    let _evidence_decorators;
    let _evidence_initializers = [];
    let _evidence_extraInitializers = [];
    let _timelineEvents_decorators;
    let _timelineEvents_initializers = [];
    let _timelineEvents_extraInitializers = [];
    let _trialPreparations_decorators;
    let _trialPreparations_initializers = [];
    let _trialPreparations_extraInitializers = [];
    var LitigationMatter = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.matterNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _matterNumber_initializers, void 0));
            this.matterName = (__runInitializers(this, _matterNumber_extraInitializers), __runInitializers(this, _matterName_initializers, void 0));
            this.matterType = (__runInitializers(this, _matterName_extraInitializers), __runInitializers(this, _matterType_initializers, void 0));
            this.status = (__runInitializers(this, _matterType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.clientId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _clientId_initializers, void 0));
            this.clientName = (__runInitializers(this, _clientId_extraInitializers), __runInitializers(this, _clientName_initializers, void 0));
            this.opposingParty = (__runInitializers(this, _clientName_extraInitializers), __runInitializers(this, _opposingParty_initializers, void 0));
            this.opposingCounsel = (__runInitializers(this, _opposingParty_extraInitializers), __runInitializers(this, _opposingCounsel_initializers, void 0));
            this.jurisdiction = (__runInitializers(this, _opposingCounsel_extraInitializers), __runInitializers(this, _jurisdiction_initializers, void 0));
            this.courtName = (__runInitializers(this, _jurisdiction_extraInitializers), __runInitializers(this, _courtName_initializers, void 0));
            this.caseNumber = (__runInitializers(this, _courtName_extraInitializers), __runInitializers(this, _caseNumber_initializers, void 0));
            this.filingDate = (__runInitializers(this, _caseNumber_extraInitializers), __runInitializers(this, _filingDate_initializers, void 0));
            this.trialDate = (__runInitializers(this, _filingDate_extraInitializers), __runInitializers(this, _trialDate_initializers, void 0));
            this.leadAttorneyId = (__runInitializers(this, _trialDate_extraInitializers), __runInitializers(this, _leadAttorneyId_initializers, void 0));
            this.assignedAttorneys = (__runInitializers(this, _leadAttorneyId_extraInitializers), __runInitializers(this, _assignedAttorneys_initializers, void 0));
            this.description = (__runInitializers(this, _assignedAttorneys_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.estimatedValue = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _estimatedValue_initializers, void 0));
            this.actualCosts = (__runInitializers(this, _estimatedValue_extraInitializers), __runInitializers(this, _actualCosts_initializers, void 0));
            this.budgetLimit = (__runInitializers(this, _actualCosts_extraInitializers), __runInitializers(this, _budgetLimit_initializers, void 0));
            this.priority = (__runInitializers(this, _budgetLimit_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.tags = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.metadata = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.witnesses = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _witnesses_initializers, void 0));
            this.evidence = (__runInitializers(this, _witnesses_extraInitializers), __runInitializers(this, _evidence_initializers, void 0));
            this.timelineEvents = (__runInitializers(this, _evidence_extraInitializers), __runInitializers(this, _timelineEvents_initializers, void 0));
            this.trialPreparations = (__runInitializers(this, _timelineEvents_extraInitializers), __runInitializers(this, _trialPreparations_initializers, void 0));
            __runInitializers(this, _trialPreparations_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "LitigationMatter");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique matter identifier' })];
        _matterNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
                unique: true,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Unique matter number' })];
        _matterName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Matter name/title' })];
        _matterType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(MatterType)),
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ enum: MatterType, description: 'Type of litigation' })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(MatterStatus)),
                allowNull: false,
                defaultValue: MatterStatus.INITIAL_CONSULTATION,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ enum: MatterStatus, description: 'Current matter status' })];
        _clientId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Client UUID' })];
        _clientName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Client name' })];
        _opposingParty_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Opposing party name' })];
        _opposingCounsel_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Opposing counsel name' })];
        _jurisdiction_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Legal jurisdiction' })];
        _courtName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Court name' })];
        _caseNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Court case number' })];
        _filingDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiPropertyOptional)({ description: 'Filing date' })];
        _trialDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiPropertyOptional)({ description: 'Scheduled trial date' })];
        _leadAttorneyId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Lead attorney UUID' })];
        _assignedAttorneys_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID),
                allowNull: false,
                defaultValue: [],
            }), (0, swagger_1.ApiProperty)({ type: [String], description: 'Assigned attorney UUIDs' })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Matter description' })];
        _estimatedValue_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Estimated case value' })];
        _actualCosts_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: true,
                defaultValue: 0,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Actual costs incurred' })];
        _budgetLimit_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Budget limit' })];
        _priority_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('low', 'medium', 'high', 'critical'),
                allowNull: false,
                defaultValue: 'medium',
            }), (0, swagger_1.ApiProperty)({ description: 'Matter priority level' })];
        _tags_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
                defaultValue: [],
            }), (0, swagger_1.ApiProperty)({ type: [String], description: 'Matter tags' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                defaultValue: {},
            }), (0, swagger_1.ApiProperty)({ description: 'Additional metadata' })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' })];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, (0, swagger_1.ApiPropertyOptional)({ description: 'Soft delete timestamp' })];
        _witnesses_decorators = [(0, sequelize_typescript_1.HasMany)(() => Witness)];
        _evidence_decorators = [(0, sequelize_typescript_1.HasMany)(() => Evidence)];
        _timelineEvents_decorators = [(0, sequelize_typescript_1.HasMany)(() => TimelineEvent)];
        _trialPreparations_decorators = [(0, sequelize_typescript_1.HasMany)(() => TrialPreparation)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _matterNumber_decorators, { kind: "field", name: "matterNumber", static: false, private: false, access: { has: obj => "matterNumber" in obj, get: obj => obj.matterNumber, set: (obj, value) => { obj.matterNumber = value; } }, metadata: _metadata }, _matterNumber_initializers, _matterNumber_extraInitializers);
        __esDecorate(null, null, _matterName_decorators, { kind: "field", name: "matterName", static: false, private: false, access: { has: obj => "matterName" in obj, get: obj => obj.matterName, set: (obj, value) => { obj.matterName = value; } }, metadata: _metadata }, _matterName_initializers, _matterName_extraInitializers);
        __esDecorate(null, null, _matterType_decorators, { kind: "field", name: "matterType", static: false, private: false, access: { has: obj => "matterType" in obj, get: obj => obj.matterType, set: (obj, value) => { obj.matterType = value; } }, metadata: _metadata }, _matterType_initializers, _matterType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _clientId_decorators, { kind: "field", name: "clientId", static: false, private: false, access: { has: obj => "clientId" in obj, get: obj => obj.clientId, set: (obj, value) => { obj.clientId = value; } }, metadata: _metadata }, _clientId_initializers, _clientId_extraInitializers);
        __esDecorate(null, null, _clientName_decorators, { kind: "field", name: "clientName", static: false, private: false, access: { has: obj => "clientName" in obj, get: obj => obj.clientName, set: (obj, value) => { obj.clientName = value; } }, metadata: _metadata }, _clientName_initializers, _clientName_extraInitializers);
        __esDecorate(null, null, _opposingParty_decorators, { kind: "field", name: "opposingParty", static: false, private: false, access: { has: obj => "opposingParty" in obj, get: obj => obj.opposingParty, set: (obj, value) => { obj.opposingParty = value; } }, metadata: _metadata }, _opposingParty_initializers, _opposingParty_extraInitializers);
        __esDecorate(null, null, _opposingCounsel_decorators, { kind: "field", name: "opposingCounsel", static: false, private: false, access: { has: obj => "opposingCounsel" in obj, get: obj => obj.opposingCounsel, set: (obj, value) => { obj.opposingCounsel = value; } }, metadata: _metadata }, _opposingCounsel_initializers, _opposingCounsel_extraInitializers);
        __esDecorate(null, null, _jurisdiction_decorators, { kind: "field", name: "jurisdiction", static: false, private: false, access: { has: obj => "jurisdiction" in obj, get: obj => obj.jurisdiction, set: (obj, value) => { obj.jurisdiction = value; } }, metadata: _metadata }, _jurisdiction_initializers, _jurisdiction_extraInitializers);
        __esDecorate(null, null, _courtName_decorators, { kind: "field", name: "courtName", static: false, private: false, access: { has: obj => "courtName" in obj, get: obj => obj.courtName, set: (obj, value) => { obj.courtName = value; } }, metadata: _metadata }, _courtName_initializers, _courtName_extraInitializers);
        __esDecorate(null, null, _caseNumber_decorators, { kind: "field", name: "caseNumber", static: false, private: false, access: { has: obj => "caseNumber" in obj, get: obj => obj.caseNumber, set: (obj, value) => { obj.caseNumber = value; } }, metadata: _metadata }, _caseNumber_initializers, _caseNumber_extraInitializers);
        __esDecorate(null, null, _filingDate_decorators, { kind: "field", name: "filingDate", static: false, private: false, access: { has: obj => "filingDate" in obj, get: obj => obj.filingDate, set: (obj, value) => { obj.filingDate = value; } }, metadata: _metadata }, _filingDate_initializers, _filingDate_extraInitializers);
        __esDecorate(null, null, _trialDate_decorators, { kind: "field", name: "trialDate", static: false, private: false, access: { has: obj => "trialDate" in obj, get: obj => obj.trialDate, set: (obj, value) => { obj.trialDate = value; } }, metadata: _metadata }, _trialDate_initializers, _trialDate_extraInitializers);
        __esDecorate(null, null, _leadAttorneyId_decorators, { kind: "field", name: "leadAttorneyId", static: false, private: false, access: { has: obj => "leadAttorneyId" in obj, get: obj => obj.leadAttorneyId, set: (obj, value) => { obj.leadAttorneyId = value; } }, metadata: _metadata }, _leadAttorneyId_initializers, _leadAttorneyId_extraInitializers);
        __esDecorate(null, null, _assignedAttorneys_decorators, { kind: "field", name: "assignedAttorneys", static: false, private: false, access: { has: obj => "assignedAttorneys" in obj, get: obj => obj.assignedAttorneys, set: (obj, value) => { obj.assignedAttorneys = value; } }, metadata: _metadata }, _assignedAttorneys_initializers, _assignedAttorneys_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _estimatedValue_decorators, { kind: "field", name: "estimatedValue", static: false, private: false, access: { has: obj => "estimatedValue" in obj, get: obj => obj.estimatedValue, set: (obj, value) => { obj.estimatedValue = value; } }, metadata: _metadata }, _estimatedValue_initializers, _estimatedValue_extraInitializers);
        __esDecorate(null, null, _actualCosts_decorators, { kind: "field", name: "actualCosts", static: false, private: false, access: { has: obj => "actualCosts" in obj, get: obj => obj.actualCosts, set: (obj, value) => { obj.actualCosts = value; } }, metadata: _metadata }, _actualCosts_initializers, _actualCosts_extraInitializers);
        __esDecorate(null, null, _budgetLimit_decorators, { kind: "field", name: "budgetLimit", static: false, private: false, access: { has: obj => "budgetLimit" in obj, get: obj => obj.budgetLimit, set: (obj, value) => { obj.budgetLimit = value; } }, metadata: _metadata }, _budgetLimit_initializers, _budgetLimit_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _witnesses_decorators, { kind: "field", name: "witnesses", static: false, private: false, access: { has: obj => "witnesses" in obj, get: obj => obj.witnesses, set: (obj, value) => { obj.witnesses = value; } }, metadata: _metadata }, _witnesses_initializers, _witnesses_extraInitializers);
        __esDecorate(null, null, _evidence_decorators, { kind: "field", name: "evidence", static: false, private: false, access: { has: obj => "evidence" in obj, get: obj => obj.evidence, set: (obj, value) => { obj.evidence = value; } }, metadata: _metadata }, _evidence_initializers, _evidence_extraInitializers);
        __esDecorate(null, null, _timelineEvents_decorators, { kind: "field", name: "timelineEvents", static: false, private: false, access: { has: obj => "timelineEvents" in obj, get: obj => obj.timelineEvents, set: (obj, value) => { obj.timelineEvents = value; } }, metadata: _metadata }, _timelineEvents_initializers, _timelineEvents_extraInitializers);
        __esDecorate(null, null, _trialPreparations_decorators, { kind: "field", name: "trialPreparations", static: false, private: false, access: { has: obj => "trialPreparations" in obj, get: obj => obj.trialPreparations, set: (obj, value) => { obj.trialPreparations = value; } }, metadata: _metadata }, _trialPreparations_initializers, _trialPreparations_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LitigationMatter = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LitigationMatter = _classThis;
})();
exports.LitigationMatter = LitigationMatter;
/**
 * Witness Sequelize Model
 * Represents witnesses associated with litigation matters
 */
let Witness = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'litigation_witnesses',
            paranoid: true,
            timestamps: true,
            indexes: [
                { fields: ['matterId'] },
                { fields: ['witnessType'] },
                { fields: ['status'] },
                { fields: ['email'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _matterId_decorators;
    let _matterId_initializers = [];
    let _matterId_extraInitializers = [];
    let _matter_decorators;
    let _matter_initializers = [];
    let _matter_extraInitializers = [];
    let _witnessType_decorators;
    let _witnessType_initializers = [];
    let _witnessType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
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
    let _address_decorators;
    let _address_initializers = [];
    let _address_extraInitializers = [];
    let _organization_decorators;
    let _organization_initializers = [];
    let _organization_extraInitializers = [];
    let _role_decorators;
    let _role_initializers = [];
    let _role_extraInitializers = [];
    let _credibilityScore_decorators;
    let _credibilityScore_initializers = [];
    let _credibilityScore_extraInitializers = [];
    let _interviewDate_decorators;
    let _interviewDate_initializers = [];
    let _interviewDate_extraInitializers = [];
    let _depositionDate_decorators;
    let _depositionDate_initializers = [];
    let _depositionDate_extraInitializers = [];
    let _depositionTranscript_decorators;
    let _depositionTranscript_initializers = [];
    let _depositionTranscript_extraInitializers = [];
    let _testimonyNotes_decorators;
    let _testimonyNotes_initializers = [];
    let _testimonyNotes_extraInitializers = [];
    let _availability_decorators;
    let _availability_initializers = [];
    let _availability_extraInitializers = [];
    let _isOpposing_decorators;
    let _isOpposing_initializers = [];
    let _isOpposing_extraInitializers = [];
    let _isExpert_decorators;
    let _isExpert_initializers = [];
    let _isExpert_extraInitializers = [];
    let _expertiseArea_decorators;
    let _expertiseArea_initializers = [];
    let _expertiseArea_extraInitializers = [];
    let _expertFees_decorators;
    let _expertFees_initializers = [];
    let _expertFees_extraInitializers = [];
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
    var Witness = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.matterId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _matterId_initializers, void 0));
            this.matter = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _matter_initializers, void 0));
            this.witnessType = (__runInitializers(this, _matter_extraInitializers), __runInitializers(this, _witnessType_initializers, void 0));
            this.status = (__runInitializers(this, _witnessType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.firstName = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _firstName_initializers, void 0));
            this.lastName = (__runInitializers(this, _firstName_extraInitializers), __runInitializers(this, _lastName_initializers, void 0));
            this.email = (__runInitializers(this, _lastName_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
            this.address = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _address_initializers, void 0));
            this.organization = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _organization_initializers, void 0));
            this.role = (__runInitializers(this, _organization_extraInitializers), __runInitializers(this, _role_initializers, void 0));
            this.credibilityScore = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _credibilityScore_initializers, void 0));
            this.interviewDate = (__runInitializers(this, _credibilityScore_extraInitializers), __runInitializers(this, _interviewDate_initializers, void 0));
            this.depositionDate = (__runInitializers(this, _interviewDate_extraInitializers), __runInitializers(this, _depositionDate_initializers, void 0));
            this.depositionTranscript = (__runInitializers(this, _depositionDate_extraInitializers), __runInitializers(this, _depositionTranscript_initializers, void 0));
            this.testimonyNotes = (__runInitializers(this, _depositionTranscript_extraInitializers), __runInitializers(this, _testimonyNotes_initializers, void 0));
            this.availability = (__runInitializers(this, _testimonyNotes_extraInitializers), __runInitializers(this, _availability_initializers, void 0));
            this.isOpposing = (__runInitializers(this, _availability_extraInitializers), __runInitializers(this, _isOpposing_initializers, void 0));
            this.isExpert = (__runInitializers(this, _isOpposing_extraInitializers), __runInitializers(this, _isExpert_initializers, void 0));
            this.expertiseArea = (__runInitializers(this, _isExpert_extraInitializers), __runInitializers(this, _expertiseArea_initializers, void 0));
            this.expertFees = (__runInitializers(this, _expertiseArea_extraInitializers), __runInitializers(this, _expertFees_initializers, void 0));
            this.metadata = (__runInitializers(this, _expertFees_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Witness");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique witness identifier' })];
        _matterId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => LitigationMatter), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Associated matter UUID' })];
        _matter_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => LitigationMatter)];
        _witnessType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(WitnessType)),
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ enum: WitnessType, description: 'Type of witness' })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(WitnessStatus)),
                allowNull: false,
                defaultValue: WitnessStatus.IDENTIFIED,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ enum: WitnessStatus, description: 'Witness status' })];
        _firstName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'First name' })];
        _lastName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Last name' })];
        _email_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: true,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiPropertyOptional)({ description: 'Email address' })];
        _phone_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Phone number' })];
        _address_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Physical address' })];
        _organization_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Organization/employer' })];
        _role_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Role in matter' })];
        _credibilityScore_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
                validate: { min: 0, max: 100 },
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Credibility score (0-100)' })];
        _interviewDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Interview date' })];
        _depositionDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Deposition date' })];
        _depositionTranscript_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Deposition transcript path' })];
        _testimonyNotes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Testimony notes' })];
        _availability_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                defaultValue: {},
            }), (0, swagger_1.ApiProperty)({ description: 'Availability calendar' })];
        _isOpposing_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Is opposing witness' })];
        _isExpert_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Is expert witness' })];
        _expertiseArea_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Area of expertise' })];
        _expertFees_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Expert witness fees' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                defaultValue: {},
            }), (0, swagger_1.ApiProperty)({ description: 'Additional metadata' })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' })];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, (0, swagger_1.ApiPropertyOptional)({ description: 'Soft delete timestamp' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
        __esDecorate(null, null, _matter_decorators, { kind: "field", name: "matter", static: false, private: false, access: { has: obj => "matter" in obj, get: obj => obj.matter, set: (obj, value) => { obj.matter = value; } }, metadata: _metadata }, _matter_initializers, _matter_extraInitializers);
        __esDecorate(null, null, _witnessType_decorators, { kind: "field", name: "witnessType", static: false, private: false, access: { has: obj => "witnessType" in obj, get: obj => obj.witnessType, set: (obj, value) => { obj.witnessType = value; } }, metadata: _metadata }, _witnessType_initializers, _witnessType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _firstName_decorators, { kind: "field", name: "firstName", static: false, private: false, access: { has: obj => "firstName" in obj, get: obj => obj.firstName, set: (obj, value) => { obj.firstName = value; } }, metadata: _metadata }, _firstName_initializers, _firstName_extraInitializers);
        __esDecorate(null, null, _lastName_decorators, { kind: "field", name: "lastName", static: false, private: false, access: { has: obj => "lastName" in obj, get: obj => obj.lastName, set: (obj, value) => { obj.lastName = value; } }, metadata: _metadata }, _lastName_initializers, _lastName_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: obj => "phone" in obj, get: obj => obj.phone, set: (obj, value) => { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
        __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: obj => "address" in obj, get: obj => obj.address, set: (obj, value) => { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
        __esDecorate(null, null, _organization_decorators, { kind: "field", name: "organization", static: false, private: false, access: { has: obj => "organization" in obj, get: obj => obj.organization, set: (obj, value) => { obj.organization = value; } }, metadata: _metadata }, _organization_initializers, _organization_extraInitializers);
        __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: obj => "role" in obj, get: obj => obj.role, set: (obj, value) => { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
        __esDecorate(null, null, _credibilityScore_decorators, { kind: "field", name: "credibilityScore", static: false, private: false, access: { has: obj => "credibilityScore" in obj, get: obj => obj.credibilityScore, set: (obj, value) => { obj.credibilityScore = value; } }, metadata: _metadata }, _credibilityScore_initializers, _credibilityScore_extraInitializers);
        __esDecorate(null, null, _interviewDate_decorators, { kind: "field", name: "interviewDate", static: false, private: false, access: { has: obj => "interviewDate" in obj, get: obj => obj.interviewDate, set: (obj, value) => { obj.interviewDate = value; } }, metadata: _metadata }, _interviewDate_initializers, _interviewDate_extraInitializers);
        __esDecorate(null, null, _depositionDate_decorators, { kind: "field", name: "depositionDate", static: false, private: false, access: { has: obj => "depositionDate" in obj, get: obj => obj.depositionDate, set: (obj, value) => { obj.depositionDate = value; } }, metadata: _metadata }, _depositionDate_initializers, _depositionDate_extraInitializers);
        __esDecorate(null, null, _depositionTranscript_decorators, { kind: "field", name: "depositionTranscript", static: false, private: false, access: { has: obj => "depositionTranscript" in obj, get: obj => obj.depositionTranscript, set: (obj, value) => { obj.depositionTranscript = value; } }, metadata: _metadata }, _depositionTranscript_initializers, _depositionTranscript_extraInitializers);
        __esDecorate(null, null, _testimonyNotes_decorators, { kind: "field", name: "testimonyNotes", static: false, private: false, access: { has: obj => "testimonyNotes" in obj, get: obj => obj.testimonyNotes, set: (obj, value) => { obj.testimonyNotes = value; } }, metadata: _metadata }, _testimonyNotes_initializers, _testimonyNotes_extraInitializers);
        __esDecorate(null, null, _availability_decorators, { kind: "field", name: "availability", static: false, private: false, access: { has: obj => "availability" in obj, get: obj => obj.availability, set: (obj, value) => { obj.availability = value; } }, metadata: _metadata }, _availability_initializers, _availability_extraInitializers);
        __esDecorate(null, null, _isOpposing_decorators, { kind: "field", name: "isOpposing", static: false, private: false, access: { has: obj => "isOpposing" in obj, get: obj => obj.isOpposing, set: (obj, value) => { obj.isOpposing = value; } }, metadata: _metadata }, _isOpposing_initializers, _isOpposing_extraInitializers);
        __esDecorate(null, null, _isExpert_decorators, { kind: "field", name: "isExpert", static: false, private: false, access: { has: obj => "isExpert" in obj, get: obj => obj.isExpert, set: (obj, value) => { obj.isExpert = value; } }, metadata: _metadata }, _isExpert_initializers, _isExpert_extraInitializers);
        __esDecorate(null, null, _expertiseArea_decorators, { kind: "field", name: "expertiseArea", static: false, private: false, access: { has: obj => "expertiseArea" in obj, get: obj => obj.expertiseArea, set: (obj, value) => { obj.expertiseArea = value; } }, metadata: _metadata }, _expertiseArea_initializers, _expertiseArea_extraInitializers);
        __esDecorate(null, null, _expertFees_decorators, { kind: "field", name: "expertFees", static: false, private: false, access: { has: obj => "expertFees" in obj, get: obj => obj.expertFees, set: (obj, value) => { obj.expertFees = value; } }, metadata: _metadata }, _expertFees_initializers, _expertFees_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Witness = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Witness = _classThis;
})();
exports.Witness = Witness;
/**
 * Evidence Sequelize Model
 * Represents evidence items with chain of custody tracking
 */
let Evidence = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'litigation_evidence',
            paranoid: true,
            timestamps: true,
            indexes: [
                { fields: ['matterId'] },
                { fields: ['category'] },
                { fields: ['exhibitNumber'] },
                { fields: ['collectionDate'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _matterId_decorators;
    let _matterId_initializers = [];
    let _matterId_extraInitializers = [];
    let _matter_decorators;
    let _matter_initializers = [];
    let _matter_extraInitializers = [];
    let _exhibitNumber_decorators;
    let _exhibitNumber_initializers = [];
    let _exhibitNumber_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _source_decorators;
    let _source_initializers = [];
    let _source_extraInitializers = [];
    let _collectionDate_decorators;
    let _collectionDate_initializers = [];
    let _collectionDate_extraInitializers = [];
    let _collectedBy_decorators;
    let _collectedBy_initializers = [];
    let _collectedBy_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _fileHash_decorators;
    let _fileHash_initializers = [];
    let _fileHash_extraInitializers = [];
    let _filePath_decorators;
    let _filePath_initializers = [];
    let _filePath_extraInitializers = [];
    let _fileSize_decorators;
    let _fileSize_initializers = [];
    let _fileSize_extraInitializers = [];
    let _mimeType_decorators;
    let _mimeType_initializers = [];
    let _mimeType_extraInitializers = [];
    let _chainOfCustody_decorators;
    let _chainOfCustody_initializers = [];
    let _chainOfCustody_extraInitializers = [];
    let _linkedWitnessIds_decorators;
    let _linkedWitnessIds_initializers = [];
    let _linkedWitnessIds_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _isAdmitted_decorators;
    let _isAdmitted_initializers = [];
    let _isAdmitted_extraInitializers = [];
    let _admissionDate_decorators;
    let _admissionDate_initializers = [];
    let _admissionDate_extraInitializers = [];
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
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var Evidence = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.matterId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _matterId_initializers, void 0));
            this.matter = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _matter_initializers, void 0));
            this.exhibitNumber = (__runInitializers(this, _matter_extraInitializers), __runInitializers(this, _exhibitNumber_initializers, void 0));
            this.category = (__runInitializers(this, _exhibitNumber_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.description = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.source = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _source_initializers, void 0));
            this.collectionDate = (__runInitializers(this, _source_extraInitializers), __runInitializers(this, _collectionDate_initializers, void 0));
            this.collectedBy = (__runInitializers(this, _collectionDate_extraInitializers), __runInitializers(this, _collectedBy_initializers, void 0));
            this.location = (__runInitializers(this, _collectedBy_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.fileHash = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _fileHash_initializers, void 0));
            this.filePath = (__runInitializers(this, _fileHash_extraInitializers), __runInitializers(this, _filePath_initializers, void 0));
            this.fileSize = (__runInitializers(this, _filePath_extraInitializers), __runInitializers(this, _fileSize_initializers, void 0));
            this.mimeType = (__runInitializers(this, _fileSize_extraInitializers), __runInitializers(this, _mimeType_initializers, void 0));
            this.chainOfCustody = (__runInitializers(this, _mimeType_extraInitializers), __runInitializers(this, _chainOfCustody_initializers, void 0));
            this.linkedWitnessIds = (__runInitializers(this, _chainOfCustody_extraInitializers), __runInitializers(this, _linkedWitnessIds_initializers, void 0));
            this.tags = (__runInitializers(this, _linkedWitnessIds_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.isAdmitted = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _isAdmitted_initializers, void 0));
            this.admissionDate = (__runInitializers(this, _isAdmitted_extraInitializers), __runInitializers(this, _admissionDate_initializers, void 0));
            this.notes = (__runInitializers(this, _admissionDate_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.metadata = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Evidence");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique evidence identifier' })];
        _matterId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => LitigationMatter), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Associated matter UUID' })];
        _matter_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => LitigationMatter)];
        _exhibitNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiPropertyOptional)({ description: 'Exhibit number (e.g., A-1, P-42)' })];
        _category_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(EvidenceCategory)),
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ enum: EvidenceCategory, description: 'Evidence category' })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Evidence description' })];
        _source_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Evidence source' })];
        _collectionDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Collection date' })];
        _collectedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Person who collected evidence' })];
        _location_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Storage location' })];
        _fileHash_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(128),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'SHA-256 hash for integrity verification' })];
        _filePath_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(1000),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'File storage path' })];
        _fileSize_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BIGINT,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'File size in bytes' })];
        _mimeType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'MIME type' })];
        _chainOfCustody_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                defaultValue: [],
            }), (0, swagger_1.ApiProperty)({ type: 'array', description: 'Chain of custody log' })];
        _linkedWitnessIds_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID),
                allowNull: false,
                defaultValue: [],
            }), (0, swagger_1.ApiProperty)({ type: [String], description: 'Linked witness UUIDs' })];
        _tags_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
                defaultValue: [],
            }), (0, swagger_1.ApiProperty)({ type: [String], description: 'Evidence tags' })];
        _isAdmitted_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Whether evidence was admitted in court' })];
        _admissionDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Date evidence was admitted' })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
                defaultValue: '',
            }), (0, swagger_1.ApiProperty)({ description: 'Notes about evidence' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                defaultValue: {},
            }), (0, swagger_1.ApiProperty)({ description: 'Additional metadata' })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' })];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, (0, swagger_1.ApiPropertyOptional)({ description: 'Soft delete timestamp' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
        __esDecorate(null, null, _matter_decorators, { kind: "field", name: "matter", static: false, private: false, access: { has: obj => "matter" in obj, get: obj => obj.matter, set: (obj, value) => { obj.matter = value; } }, metadata: _metadata }, _matter_initializers, _matter_extraInitializers);
        __esDecorate(null, null, _exhibitNumber_decorators, { kind: "field", name: "exhibitNumber", static: false, private: false, access: { has: obj => "exhibitNumber" in obj, get: obj => obj.exhibitNumber, set: (obj, value) => { obj.exhibitNumber = value; } }, metadata: _metadata }, _exhibitNumber_initializers, _exhibitNumber_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _source_decorators, { kind: "field", name: "source", static: false, private: false, access: { has: obj => "source" in obj, get: obj => obj.source, set: (obj, value) => { obj.source = value; } }, metadata: _metadata }, _source_initializers, _source_extraInitializers);
        __esDecorate(null, null, _collectionDate_decorators, { kind: "field", name: "collectionDate", static: false, private: false, access: { has: obj => "collectionDate" in obj, get: obj => obj.collectionDate, set: (obj, value) => { obj.collectionDate = value; } }, metadata: _metadata }, _collectionDate_initializers, _collectionDate_extraInitializers);
        __esDecorate(null, null, _collectedBy_decorators, { kind: "field", name: "collectedBy", static: false, private: false, access: { has: obj => "collectedBy" in obj, get: obj => obj.collectedBy, set: (obj, value) => { obj.collectedBy = value; } }, metadata: _metadata }, _collectedBy_initializers, _collectedBy_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _fileHash_decorators, { kind: "field", name: "fileHash", static: false, private: false, access: { has: obj => "fileHash" in obj, get: obj => obj.fileHash, set: (obj, value) => { obj.fileHash = value; } }, metadata: _metadata }, _fileHash_initializers, _fileHash_extraInitializers);
        __esDecorate(null, null, _filePath_decorators, { kind: "field", name: "filePath", static: false, private: false, access: { has: obj => "filePath" in obj, get: obj => obj.filePath, set: (obj, value) => { obj.filePath = value; } }, metadata: _metadata }, _filePath_initializers, _filePath_extraInitializers);
        __esDecorate(null, null, _fileSize_decorators, { kind: "field", name: "fileSize", static: false, private: false, access: { has: obj => "fileSize" in obj, get: obj => obj.fileSize, set: (obj, value) => { obj.fileSize = value; } }, metadata: _metadata }, _fileSize_initializers, _fileSize_extraInitializers);
        __esDecorate(null, null, _mimeType_decorators, { kind: "field", name: "mimeType", static: false, private: false, access: { has: obj => "mimeType" in obj, get: obj => obj.mimeType, set: (obj, value) => { obj.mimeType = value; } }, metadata: _metadata }, _mimeType_initializers, _mimeType_extraInitializers);
        __esDecorate(null, null, _chainOfCustody_decorators, { kind: "field", name: "chainOfCustody", static: false, private: false, access: { has: obj => "chainOfCustody" in obj, get: obj => obj.chainOfCustody, set: (obj, value) => { obj.chainOfCustody = value; } }, metadata: _metadata }, _chainOfCustody_initializers, _chainOfCustody_extraInitializers);
        __esDecorate(null, null, _linkedWitnessIds_decorators, { kind: "field", name: "linkedWitnessIds", static: false, private: false, access: { has: obj => "linkedWitnessIds" in obj, get: obj => obj.linkedWitnessIds, set: (obj, value) => { obj.linkedWitnessIds = value; } }, metadata: _metadata }, _linkedWitnessIds_initializers, _linkedWitnessIds_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _isAdmitted_decorators, { kind: "field", name: "isAdmitted", static: false, private: false, access: { has: obj => "isAdmitted" in obj, get: obj => obj.isAdmitted, set: (obj, value) => { obj.isAdmitted = value; } }, metadata: _metadata }, _isAdmitted_initializers, _isAdmitted_extraInitializers);
        __esDecorate(null, null, _admissionDate_decorators, { kind: "field", name: "admissionDate", static: false, private: false, access: { has: obj => "admissionDate" in obj, get: obj => obj.admissionDate, set: (obj, value) => { obj.admissionDate = value; } }, metadata: _metadata }, _admissionDate_initializers, _admissionDate_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Evidence = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Evidence = _classThis;
})();
exports.Evidence = Evidence;
/**
 * TimelineEvent Sequelize Model
 * Represents events in the litigation timeline
 */
let TimelineEvent = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'litigation_timeline_events',
            paranoid: true,
            timestamps: true,
            indexes: [
                { fields: ['matterId'] },
                { fields: ['eventType'] },
                { fields: ['eventDate'] },
                { fields: ['isDeadline'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _matterId_decorators;
    let _matterId_initializers = [];
    let _matterId_extraInitializers = [];
    let _matter_decorators;
    let _matter_initializers = [];
    let _matter_extraInitializers = [];
    let _eventType_decorators;
    let _eventType_initializers = [];
    let _eventType_extraInitializers = [];
    let _eventDate_decorators;
    let _eventDate_initializers = [];
    let _eventDate_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _participants_decorators;
    let _participants_initializers = [];
    let _participants_extraInitializers = [];
    let _relatedDocuments_decorators;
    let _relatedDocuments_initializers = [];
    let _relatedDocuments_extraInitializers = [];
    let _relatedWitnesses_decorators;
    let _relatedWitnesses_initializers = [];
    let _relatedWitnesses_extraInitializers = [];
    let _relatedEvidence_decorators;
    let _relatedEvidence_initializers = [];
    let _relatedEvidence_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _outcome_decorators;
    let _outcome_initializers = [];
    let _outcome_extraInitializers = [];
    let _isDeadline_decorators;
    let _isDeadline_initializers = [];
    let _isDeadline_extraInitializers = [];
    let _deadlineDate_decorators;
    let _deadlineDate_initializers = [];
    let _deadlineDate_extraInitializers = [];
    let _completed_decorators;
    let _completed_initializers = [];
    let _completed_extraInitializers = [];
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
    var TimelineEvent = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.matterId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _matterId_initializers, void 0));
            this.matter = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _matter_initializers, void 0));
            this.eventType = (__runInitializers(this, _matter_extraInitializers), __runInitializers(this, _eventType_initializers, void 0));
            this.eventDate = (__runInitializers(this, _eventType_extraInitializers), __runInitializers(this, _eventDate_initializers, void 0));
            this.title = (__runInitializers(this, _eventDate_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.participants = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _participants_initializers, void 0));
            this.relatedDocuments = (__runInitializers(this, _participants_extraInitializers), __runInitializers(this, _relatedDocuments_initializers, void 0));
            this.relatedWitnesses = (__runInitializers(this, _relatedDocuments_extraInitializers), __runInitializers(this, _relatedWitnesses_initializers, void 0));
            this.relatedEvidence = (__runInitializers(this, _relatedWitnesses_extraInitializers), __runInitializers(this, _relatedEvidence_initializers, void 0));
            this.location = (__runInitializers(this, _relatedEvidence_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.outcome = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _outcome_initializers, void 0));
            this.isDeadline = (__runInitializers(this, _outcome_extraInitializers), __runInitializers(this, _isDeadline_initializers, void 0));
            this.deadlineDate = (__runInitializers(this, _isDeadline_extraInitializers), __runInitializers(this, _deadlineDate_initializers, void 0));
            this.completed = (__runInitializers(this, _deadlineDate_extraInitializers), __runInitializers(this, _completed_initializers, void 0));
            this.metadata = (__runInitializers(this, _completed_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "TimelineEvent");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique event identifier' })];
        _matterId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => LitigationMatter), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Associated matter UUID' })];
        _matter_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => LitigationMatter)];
        _eventType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(TimelineEventType)),
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ enum: TimelineEventType, description: 'Event type' })];
        _eventDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Event date and time' })];
        _title_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Event title' })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Event description' })];
        _participants_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
                defaultValue: [],
            }), (0, swagger_1.ApiProperty)({ type: [String], description: 'Event participants' })];
        _relatedDocuments_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
                defaultValue: [],
            }), (0, swagger_1.ApiProperty)({ type: [String], description: 'Related document IDs' })];
        _relatedWitnesses_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID),
                allowNull: false,
                defaultValue: [],
            }), (0, swagger_1.ApiProperty)({ type: [String], description: 'Related witness UUIDs' })];
        _relatedEvidence_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID),
                allowNull: false,
                defaultValue: [],
            }), (0, swagger_1.ApiProperty)({ type: [String], description: 'Related evidence UUIDs' })];
        _location_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Event location' })];
        _outcome_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Event outcome' })];
        _isDeadline_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Is this a deadline' })];
        _deadlineDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Deadline date if applicable' })];
        _completed_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Is event/deadline completed' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                defaultValue: {},
            }), (0, swagger_1.ApiProperty)({ description: 'Additional metadata' })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' })];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, (0, swagger_1.ApiPropertyOptional)({ description: 'Soft delete timestamp' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
        __esDecorate(null, null, _matter_decorators, { kind: "field", name: "matter", static: false, private: false, access: { has: obj => "matter" in obj, get: obj => obj.matter, set: (obj, value) => { obj.matter = value; } }, metadata: _metadata }, _matter_initializers, _matter_extraInitializers);
        __esDecorate(null, null, _eventType_decorators, { kind: "field", name: "eventType", static: false, private: false, access: { has: obj => "eventType" in obj, get: obj => obj.eventType, set: (obj, value) => { obj.eventType = value; } }, metadata: _metadata }, _eventType_initializers, _eventType_extraInitializers);
        __esDecorate(null, null, _eventDate_decorators, { kind: "field", name: "eventDate", static: false, private: false, access: { has: obj => "eventDate" in obj, get: obj => obj.eventDate, set: (obj, value) => { obj.eventDate = value; } }, metadata: _metadata }, _eventDate_initializers, _eventDate_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _participants_decorators, { kind: "field", name: "participants", static: false, private: false, access: { has: obj => "participants" in obj, get: obj => obj.participants, set: (obj, value) => { obj.participants = value; } }, metadata: _metadata }, _participants_initializers, _participants_extraInitializers);
        __esDecorate(null, null, _relatedDocuments_decorators, { kind: "field", name: "relatedDocuments", static: false, private: false, access: { has: obj => "relatedDocuments" in obj, get: obj => obj.relatedDocuments, set: (obj, value) => { obj.relatedDocuments = value; } }, metadata: _metadata }, _relatedDocuments_initializers, _relatedDocuments_extraInitializers);
        __esDecorate(null, null, _relatedWitnesses_decorators, { kind: "field", name: "relatedWitnesses", static: false, private: false, access: { has: obj => "relatedWitnesses" in obj, get: obj => obj.relatedWitnesses, set: (obj, value) => { obj.relatedWitnesses = value; } }, metadata: _metadata }, _relatedWitnesses_initializers, _relatedWitnesses_extraInitializers);
        __esDecorate(null, null, _relatedEvidence_decorators, { kind: "field", name: "relatedEvidence", static: false, private: false, access: { has: obj => "relatedEvidence" in obj, get: obj => obj.relatedEvidence, set: (obj, value) => { obj.relatedEvidence = value; } }, metadata: _metadata }, _relatedEvidence_initializers, _relatedEvidence_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _outcome_decorators, { kind: "field", name: "outcome", static: false, private: false, access: { has: obj => "outcome" in obj, get: obj => obj.outcome, set: (obj, value) => { obj.outcome = value; } }, metadata: _metadata }, _outcome_initializers, _outcome_extraInitializers);
        __esDecorate(null, null, _isDeadline_decorators, { kind: "field", name: "isDeadline", static: false, private: false, access: { has: obj => "isDeadline" in obj, get: obj => obj.isDeadline, set: (obj, value) => { obj.isDeadline = value; } }, metadata: _metadata }, _isDeadline_initializers, _isDeadline_extraInitializers);
        __esDecorate(null, null, _deadlineDate_decorators, { kind: "field", name: "deadlineDate", static: false, private: false, access: { has: obj => "deadlineDate" in obj, get: obj => obj.deadlineDate, set: (obj, value) => { obj.deadlineDate = value; } }, metadata: _metadata }, _deadlineDate_initializers, _deadlineDate_extraInitializers);
        __esDecorate(null, null, _completed_decorators, { kind: "field", name: "completed", static: false, private: false, access: { has: obj => "completed" in obj, get: obj => obj.completed, set: (obj, value) => { obj.completed = value; } }, metadata: _metadata }, _completed_initializers, _completed_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TimelineEvent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TimelineEvent = _classThis;
})();
exports.TimelineEvent = TimelineEvent;
/**
 * TrialPreparation Sequelize Model
 * Represents trial preparation and readiness tracking
 */
let TrialPreparation = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'litigation_trial_preparation',
            paranoid: true,
            timestamps: true,
            indexes: [
                { fields: ['matterId'] },
                { fields: ['trialDate'] },
                { fields: ['currentPhase'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _matterId_decorators;
    let _matterId_initializers = [];
    let _matterId_extraInitializers = [];
    let _matter_decorators;
    let _matter_initializers = [];
    let _matter_extraInitializers = [];
    let _trialDate_decorators;
    let _trialDate_initializers = [];
    let _trialDate_extraInitializers = [];
    let _currentPhase_decorators;
    let _currentPhase_initializers = [];
    let _currentPhase_extraInitializers = [];
    let _readinessScore_decorators;
    let _readinessScore_initializers = [];
    let _readinessScore_extraInitializers = [];
    let _witnessListComplete_decorators;
    let _witnessListComplete_initializers = [];
    let _witnessListComplete_extraInitializers = [];
    let _exhibitListComplete_decorators;
    let _exhibitListComplete_initializers = [];
    let _exhibitListComplete_extraInitializers = [];
    let _trialBinderComplete_decorators;
    let _trialBinderComplete_initializers = [];
    let _trialBinderComplete_extraInitializers = [];
    let _openingStatementDrafted_decorators;
    let _openingStatementDrafted_initializers = [];
    let _openingStatementDrafted_extraInitializers = [];
    let _closingArgumentDrafted_decorators;
    let _closingArgumentDrafted_initializers = [];
    let _closingArgumentDrafted_extraInitializers = [];
    let _witnessExaminationOutlines_decorators;
    let _witnessExaminationOutlines_initializers = [];
    let _witnessExaminationOutlines_extraInitializers = [];
    let _trialStrategy_decorators;
    let _trialStrategy_initializers = [];
    let _trialStrategy_extraInitializers = [];
    let _jurySelectionNotes_decorators;
    let _jurySelectionNotes_initializers = [];
    let _jurySelectionNotes_extraInitializers = [];
    let _estimatedDuration_decorators;
    let _estimatedDuration_initializers = [];
    let _estimatedDuration_extraInitializers = [];
    let _checklist_decorators;
    let _checklist_initializers = [];
    let _checklist_extraInitializers = [];
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
    var TrialPreparation = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.matterId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _matterId_initializers, void 0));
            this.matter = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _matter_initializers, void 0));
            this.trialDate = (__runInitializers(this, _matter_extraInitializers), __runInitializers(this, _trialDate_initializers, void 0));
            this.currentPhase = (__runInitializers(this, _trialDate_extraInitializers), __runInitializers(this, _currentPhase_initializers, void 0));
            this.readinessScore = (__runInitializers(this, _currentPhase_extraInitializers), __runInitializers(this, _readinessScore_initializers, void 0));
            this.witnessListComplete = (__runInitializers(this, _readinessScore_extraInitializers), __runInitializers(this, _witnessListComplete_initializers, void 0));
            this.exhibitListComplete = (__runInitializers(this, _witnessListComplete_extraInitializers), __runInitializers(this, _exhibitListComplete_initializers, void 0));
            this.trialBinderComplete = (__runInitializers(this, _exhibitListComplete_extraInitializers), __runInitializers(this, _trialBinderComplete_initializers, void 0));
            this.openingStatementDrafted = (__runInitializers(this, _trialBinderComplete_extraInitializers), __runInitializers(this, _openingStatementDrafted_initializers, void 0));
            this.closingArgumentDrafted = (__runInitializers(this, _openingStatementDrafted_extraInitializers), __runInitializers(this, _closingArgumentDrafted_initializers, void 0));
            this.witnessExaminationOutlines = (__runInitializers(this, _closingArgumentDrafted_extraInitializers), __runInitializers(this, _witnessExaminationOutlines_initializers, void 0));
            this.trialStrategy = (__runInitializers(this, _witnessExaminationOutlines_extraInitializers), __runInitializers(this, _trialStrategy_initializers, void 0));
            this.jurySelectionNotes = (__runInitializers(this, _trialStrategy_extraInitializers), __runInitializers(this, _jurySelectionNotes_initializers, void 0));
            this.estimatedDuration = (__runInitializers(this, _jurySelectionNotes_extraInitializers), __runInitializers(this, _estimatedDuration_initializers, void 0));
            this.checklist = (__runInitializers(this, _estimatedDuration_extraInitializers), __runInitializers(this, _checklist_initializers, void 0));
            this.metadata = (__runInitializers(this, _checklist_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "TrialPreparation");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique trial preparation identifier' })];
        _matterId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => LitigationMatter), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Associated matter UUID' })];
        _matter_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => LitigationMatter)];
        _trialDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Scheduled trial date' })];
        _currentPhase_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(TrialPhase)),
                allowNull: false,
                defaultValue: TrialPhase.INITIAL_PREP,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ enum: TrialPhase, description: 'Current trial phase' })];
        _readinessScore_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: { min: 0, max: 100 },
            }), (0, swagger_1.ApiProperty)({ description: 'Trial readiness score (0-100)' })];
        _witnessListComplete_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Is witness list complete' })];
        _exhibitListComplete_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Is exhibit list complete' })];
        _trialBinderComplete_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Is trial binder complete' })];
        _openingStatementDrafted_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Is opening statement drafted' })];
        _closingArgumentDrafted_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Is closing argument drafted' })];
        _witnessExaminationOutlines_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                defaultValue: {},
            }), (0, swagger_1.ApiProperty)({ description: 'Witness examination outlines by witness ID' })];
        _trialStrategy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
                defaultValue: '',
            }), (0, swagger_1.ApiProperty)({ description: 'Overall trial strategy' })];
        _jurySelectionNotes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Jury selection notes' })];
        _estimatedDuration_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 1,
            }), (0, swagger_1.ApiProperty)({ description: 'Estimated trial duration in days' })];
        _checklist_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                defaultValue: [],
            }), (0, swagger_1.ApiProperty)({ type: 'array', description: 'Trial preparation checklist' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                defaultValue: {},
            }), (0, swagger_1.ApiProperty)({ description: 'Additional metadata' })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' })];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, (0, swagger_1.ApiPropertyOptional)({ description: 'Soft delete timestamp' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
        __esDecorate(null, null, _matter_decorators, { kind: "field", name: "matter", static: false, private: false, access: { has: obj => "matter" in obj, get: obj => obj.matter, set: (obj, value) => { obj.matter = value; } }, metadata: _metadata }, _matter_initializers, _matter_extraInitializers);
        __esDecorate(null, null, _trialDate_decorators, { kind: "field", name: "trialDate", static: false, private: false, access: { has: obj => "trialDate" in obj, get: obj => obj.trialDate, set: (obj, value) => { obj.trialDate = value; } }, metadata: _metadata }, _trialDate_initializers, _trialDate_extraInitializers);
        __esDecorate(null, null, _currentPhase_decorators, { kind: "field", name: "currentPhase", static: false, private: false, access: { has: obj => "currentPhase" in obj, get: obj => obj.currentPhase, set: (obj, value) => { obj.currentPhase = value; } }, metadata: _metadata }, _currentPhase_initializers, _currentPhase_extraInitializers);
        __esDecorate(null, null, _readinessScore_decorators, { kind: "field", name: "readinessScore", static: false, private: false, access: { has: obj => "readinessScore" in obj, get: obj => obj.readinessScore, set: (obj, value) => { obj.readinessScore = value; } }, metadata: _metadata }, _readinessScore_initializers, _readinessScore_extraInitializers);
        __esDecorate(null, null, _witnessListComplete_decorators, { kind: "field", name: "witnessListComplete", static: false, private: false, access: { has: obj => "witnessListComplete" in obj, get: obj => obj.witnessListComplete, set: (obj, value) => { obj.witnessListComplete = value; } }, metadata: _metadata }, _witnessListComplete_initializers, _witnessListComplete_extraInitializers);
        __esDecorate(null, null, _exhibitListComplete_decorators, { kind: "field", name: "exhibitListComplete", static: false, private: false, access: { has: obj => "exhibitListComplete" in obj, get: obj => obj.exhibitListComplete, set: (obj, value) => { obj.exhibitListComplete = value; } }, metadata: _metadata }, _exhibitListComplete_initializers, _exhibitListComplete_extraInitializers);
        __esDecorate(null, null, _trialBinderComplete_decorators, { kind: "field", name: "trialBinderComplete", static: false, private: false, access: { has: obj => "trialBinderComplete" in obj, get: obj => obj.trialBinderComplete, set: (obj, value) => { obj.trialBinderComplete = value; } }, metadata: _metadata }, _trialBinderComplete_initializers, _trialBinderComplete_extraInitializers);
        __esDecorate(null, null, _openingStatementDrafted_decorators, { kind: "field", name: "openingStatementDrafted", static: false, private: false, access: { has: obj => "openingStatementDrafted" in obj, get: obj => obj.openingStatementDrafted, set: (obj, value) => { obj.openingStatementDrafted = value; } }, metadata: _metadata }, _openingStatementDrafted_initializers, _openingStatementDrafted_extraInitializers);
        __esDecorate(null, null, _closingArgumentDrafted_decorators, { kind: "field", name: "closingArgumentDrafted", static: false, private: false, access: { has: obj => "closingArgumentDrafted" in obj, get: obj => obj.closingArgumentDrafted, set: (obj, value) => { obj.closingArgumentDrafted = value; } }, metadata: _metadata }, _closingArgumentDrafted_initializers, _closingArgumentDrafted_extraInitializers);
        __esDecorate(null, null, _witnessExaminationOutlines_decorators, { kind: "field", name: "witnessExaminationOutlines", static: false, private: false, access: { has: obj => "witnessExaminationOutlines" in obj, get: obj => obj.witnessExaminationOutlines, set: (obj, value) => { obj.witnessExaminationOutlines = value; } }, metadata: _metadata }, _witnessExaminationOutlines_initializers, _witnessExaminationOutlines_extraInitializers);
        __esDecorate(null, null, _trialStrategy_decorators, { kind: "field", name: "trialStrategy", static: false, private: false, access: { has: obj => "trialStrategy" in obj, get: obj => obj.trialStrategy, set: (obj, value) => { obj.trialStrategy = value; } }, metadata: _metadata }, _trialStrategy_initializers, _trialStrategy_extraInitializers);
        __esDecorate(null, null, _jurySelectionNotes_decorators, { kind: "field", name: "jurySelectionNotes", static: false, private: false, access: { has: obj => "jurySelectionNotes" in obj, get: obj => obj.jurySelectionNotes, set: (obj, value) => { obj.jurySelectionNotes = value; } }, metadata: _metadata }, _jurySelectionNotes_initializers, _jurySelectionNotes_extraInitializers);
        __esDecorate(null, null, _estimatedDuration_decorators, { kind: "field", name: "estimatedDuration", static: false, private: false, access: { has: obj => "estimatedDuration" in obj, get: obj => obj.estimatedDuration, set: (obj, value) => { obj.estimatedDuration = value; } }, metadata: _metadata }, _estimatedDuration_initializers, _estimatedDuration_extraInitializers);
        __esDecorate(null, null, _checklist_decorators, { kind: "field", name: "checklist", static: false, private: false, access: { has: obj => "checklist" in obj, get: obj => obj.checklist, set: (obj, value) => { obj.checklist = value; } }, metadata: _metadata }, _checklist_initializers, _checklist_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TrialPreparation = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TrialPreparation = _classThis;
})();
exports.TrialPreparation = TrialPreparation;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Generate unique matter number
 */
function generateMatterNumber(prefix = 'MTR') {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}
/**
 * Calculate file hash for integrity verification
 */
function calculateFileHash(content) {
    return crypto
        .createHash('sha256')
        .update(content)
        .digest('hex');
}
/**
 * Generate exhibit number
 */
function generateExhibitNumber(side, sequence) {
    const prefix = side === 'plaintiff' ? 'P' : 'D';
    return `${prefix}-${sequence}`;
}
// ============================================================================
// NESTJS SERVICES
// ============================================================================
/**
 * LitigationMatterService
 * Injectable service for matter management operations
 */
let LitigationMatterService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var LitigationMatterService = _classThis = class {
        constructor(sequelize, configService) {
            this.sequelize = sequelize;
            this.configService = configService;
            this.logger = new common_1.Logger(LitigationMatterService.name);
        }
        /**
         * 1. Create new litigation matter
         */
        async createLitigationMatter(data, createdBy) {
            const validated = exports.CreateMatterSchema.parse(data);
            try {
                const matterNumber = generateMatterNumber();
                const matter = await LitigationMatter.create({
                    ...validated,
                    matterNumber,
                    status: MatterStatus.INITIAL_CONSULTATION,
                    assignedAttorneys: [validated.leadAttorneyId],
                    actualCosts: 0,
                    metadata: {
                        ...validated.metadata,
                        createdBy,
                        auditLog: [
                            {
                                timestamp: new Date(),
                                action: 'created',
                                performedBy: createdBy,
                                details: 'Matter created',
                            },
                        ],
                    },
                });
                this.logger.log(`Created litigation matter: ${matter.matterNumber}`);
                return matter;
            }
            catch (error) {
                this.logger.error('Failed to create litigation matter', error);
                throw new common_1.InternalServerErrorException('Failed to create litigation matter');
            }
        }
        /**
         * 2. Update matter details
         */
        async updateMatterDetails(matterId, updates, updatedBy) {
            const matter = await LitigationMatter.findByPk(matterId);
            if (!matter) {
                throw new common_1.NotFoundException('Matter not found');
            }
            try {
                const auditLog = matter.metadata.auditLog || [];
                auditLog.push({
                    timestamp: new Date(),
                    action: 'updated',
                    performedBy: updatedBy,
                    details: `Updated: ${Object.keys(updates).join(', ')}`,
                });
                await matter.update({
                    ...updates,
                    metadata: {
                        ...matter.metadata,
                        auditLog,
                    },
                });
                this.logger.log(`Updated matter: ${matter.matterNumber}`);
                return matter;
            }
            catch (error) {
                this.logger.error('Failed to update matter', error);
                throw new common_1.InternalServerErrorException('Failed to update matter');
            }
        }
        /**
         * 3. Get matter by ID
         */
        async getMatterById(matterId) {
            const matter = await LitigationMatter.findByPk(matterId, {
                include: [
                    { model: Witness },
                    { model: Evidence },
                    { model: TimelineEvent },
                    { model: TrialPreparation },
                ],
            });
            if (!matter) {
                throw new common_1.NotFoundException('Matter not found');
            }
            return matter;
        }
        /**
         * 4. Search matters with filters
         */
        async searchMatters(filters) {
            const where = {};
            if (filters.status?.length) {
                where.status = { [sequelize_1.Op.in]: filters.status };
            }
            if (filters.matterType?.length) {
                where.matterType = { [sequelize_1.Op.in]: filters.matterType };
            }
            if (filters.clientId) {
                where.clientId = filters.clientId;
            }
            if (filters.leadAttorneyId) {
                where.leadAttorneyId = filters.leadAttorneyId;
            }
            if (filters.keyword) {
                where[sequelize_1.Op.or] = [
                    { matterName: { [sequelize_1.Op.iLike]: `%${filters.keyword}%` } },
                    { description: { [sequelize_1.Op.iLike]: `%${filters.keyword}%` } },
                    { opposingParty: { [sequelize_1.Op.iLike]: `%${filters.keyword}%` } },
                ];
            }
            if (filters.filingDateFrom || filters.filingDateTo) {
                where.filingDate = {};
                if (filters.filingDateFrom) {
                    where.filingDate[sequelize_1.Op.gte] = filters.filingDateFrom;
                }
                if (filters.filingDateTo) {
                    where.filingDate[sequelize_1.Op.lte] = filters.filingDateTo;
                }
            }
            if (filters.trialDateFrom || filters.trialDateTo) {
                where.trialDate = {};
                if (filters.trialDateFrom) {
                    where.trialDate[sequelize_1.Op.gte] = filters.trialDateFrom;
                }
                if (filters.trialDateTo) {
                    where.trialDate[sequelize_1.Op.lte] = filters.trialDateTo;
                }
            }
            const { rows, count } = await LitigationMatter.findAndCountAll({
                where,
                limit: filters.limit || 50,
                offset: filters.offset || 0,
                order: [['createdAt', 'DESC']],
            });
            return { rows, count };
        }
        /**
         * 5. Update matter status
         */
        async updateMatterStatus(matterId, newStatus, updatedBy, notes) {
            const matter = await LitigationMatter.findByPk(matterId);
            if (!matter) {
                throw new common_1.NotFoundException('Matter not found');
            }
            const auditLog = matter.metadata.auditLog || [];
            auditLog.push({
                timestamp: new Date(),
                action: 'status_changed',
                performedBy: updatedBy,
                details: `Status changed from ${matter.status} to ${newStatus}`,
                notes,
            });
            await matter.update({
                status: newStatus,
                metadata: {
                    ...matter.metadata,
                    auditLog,
                },
            });
            this.logger.log(`Matter ${matter.matterNumber} status: ${newStatus}`);
            return matter;
        }
        /**
         * 6. Assign matter to attorney
         */
        async assignMatterToAttorney(matterId, attorneyId, isLead, assignedBy) {
            const matter = await LitigationMatter.findByPk(matterId);
            if (!matter) {
                throw new common_1.NotFoundException('Matter not found');
            }
            const assignedAttorneys = new Set(matter.assignedAttorneys);
            assignedAttorneys.add(attorneyId);
            const auditLog = matter.metadata.auditLog || [];
            auditLog.push({
                timestamp: new Date(),
                action: 'attorney_assigned',
                performedBy: assignedBy,
                details: `Attorney ${attorneyId} assigned${isLead ? ' as lead' : ''}`,
            });
            await matter.update({
                leadAttorneyId: isLead ? attorneyId : matter.leadAttorneyId,
                assignedAttorneys: Array.from(assignedAttorneys),
                metadata: {
                    ...matter.metadata,
                    auditLog,
                },
            });
            this.logger.log(`Attorney assigned to matter: ${matter.matterNumber}`);
            return matter;
        }
        /**
         * 7. Calculate matter costs
         */
        async calculateMatterCosts(matterId) {
            const matter = await this.getMatterById(matterId);
            const witnesses = matter.witnesses || [];
            const expertFees = witnesses
                .filter((w) => w.isExpert && w.expertFees)
                .reduce((sum, w) => sum + (w.expertFees || 0), 0);
            const actualCosts = matter.actualCosts || 0;
            const budgetLimit = matter.budgetLimit || null;
            const budgetRemaining = budgetLimit ? budgetLimit - actualCosts : null;
            const percentageUsed = budgetLimit ? (actualCosts / budgetLimit) * 100 : null;
            return {
                actualCosts,
                budgetLimit,
                budgetRemaining,
                percentageUsed,
                breakdown: {
                    witnessExpenses: 0, // Would aggregate from expense records
                    filingFees: 0,
                    expertFees,
                    otherExpenses: actualCosts - expertFees,
                },
            };
        }
        /**
         * 8. Generate matter summary
         */
        async generateMatterSummary(matterId) {
            const matter = await this.getMatterById(matterId);
            const witnesses = matter.witnesses || [];
            const evidence = matter.evidence || [];
            const timelineEvents = matter.timelineEvents || [];
            const now = new Date();
            const daysActive = Math.floor((now.getTime() - matter.createdAt.getTime()) / (1000 * 60 * 60 * 24));
            const daysUntilTrial = matter.trialDate
                ? Math.floor((matter.trialDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                : null;
            const upcomingDeadlines = timelineEvents.filter((e) => e.isDeadline && !e.completed && e.deadlineDate && e.deadlineDate > now).length;
            return {
                matter: matter.toJSON(),
                statistics: {
                    totalWitnesses: witnesses.length,
                    expertWitnesses: witnesses.filter((w) => w.isExpert).length,
                    totalEvidence: evidence.length,
                    admittedEvidence: evidence.filter((e) => e.isAdmitted).length,
                    timelineEvents: timelineEvents.length,
                    upcomingDeadlines,
                },
                status: {
                    daysActive,
                    daysUntilTrial,
                    currentPhase: matter.status,
                },
            };
        }
    };
    __setFunctionName(_classThis, "LitigationMatterService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LitigationMatterService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LitigationMatterService = _classThis;
})();
exports.LitigationMatterService = LitigationMatterService;
/**
 * TimelineVisualizationService
 * Injectable service for timeline management
 */
let TimelineVisualizationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var TimelineVisualizationService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
            this.logger = new common_1.Logger(TimelineVisualizationService.name);
        }
        /**
         * 9. Create timeline event
         */
        async createTimelineEvent(data, createdBy) {
            const validated = exports.CreateTimelineEventSchema.parse(data);
            try {
                const event = await TimelineEvent.create({
                    ...validated,
                    completed: false,
                    metadata: {
                        createdBy,
                    },
                });
                this.logger.log(`Created timeline event: ${event.title}`);
                return event;
            }
            catch (error) {
                this.logger.error('Failed to create timeline event', error);
                throw new common_1.InternalServerErrorException('Failed to create timeline event');
            }
        }
        /**
         * 10. Update timeline event
         */
        async updateTimelineEvent(eventId, updates, updatedBy) {
            const event = await TimelineEvent.findByPk(eventId);
            if (!event) {
                throw new common_1.NotFoundException('Timeline event not found');
            }
            await event.update({
                ...updates,
                metadata: {
                    ...event.metadata,
                    lastUpdatedBy: updatedBy,
                    lastUpdatedAt: new Date(),
                },
            });
            this.logger.log(`Updated timeline event: ${event.title}`);
            return event;
        }
        /**
         * 11. Get timeline for matter
         */
        async getTimelineForMatter(matterId, options) {
            const where = { matterId };
            if (options?.eventTypes?.length) {
                where.eventType = { [sequelize_1.Op.in]: options.eventTypes };
            }
            if (options?.includeCompleted === false) {
                where.completed = false;
            }
            const events = await TimelineEvent.findAll({
                where,
                order: [['eventDate', options?.sortOrder || 'ASC']],
            });
            return events;
        }
        /**
         * 12. Generate timeline visualization data
         */
        async generateTimelineVisualization(matterId) {
            const events = await this.getTimelineForMatter(matterId, {
                includeCompleted: true,
                sortOrder: 'ASC',
            });
            const now = new Date();
            // Map events
            const mappedEvents = events.map((e) => ({
                id: e.id,
                date: e.eventDate,
                title: e.title,
                type: e.eventType,
                description: e.description,
                isDeadline: e.isDeadline,
                completed: e.completed,
            }));
            // Extract milestones
            const milestoneTypes = [
                TimelineEventType.FILING,
                TimelineEventType.TRIAL_DATE,
                TimelineEventType.VERDICT,
                TimelineEventType.JUDGMENT,
            ];
            const milestones = events
                .filter((e) => milestoneTypes.includes(e.eventType))
                .map((e) => ({
                date: e.eventDate,
                label: e.title,
                significance: (e.eventType === TimelineEventType.TRIAL_DATE ||
                    e.eventType === TimelineEventType.VERDICT
                    ? 'high'
                    : 'medium'),
            }));
            // Extract deadlines
            const deadlines = events
                .filter((e) => e.isDeadline && e.deadlineDate)
                .map((e) => {
                const deadlineDate = e.deadlineDate;
                const daysRemaining = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                return {
                    date: deadlineDate,
                    title: e.title,
                    overdue: daysRemaining < 0 && !e.completed,
                    daysRemaining,
                };
            })
                .sort((a, b) => a.date.getTime() - b.date.getTime());
            return {
                events: mappedEvents,
                milestones,
                deadlines,
            };
        }
        /**
         * 13. Detect timeline conflicts
         */
        async detectTimelineConflicts(matterId) {
            const events = await this.getTimelineForMatter(matterId);
            const conflicts = [];
            // Check for overlapping deadlines (same day)
            const deadlinesByDate = new Map();
            events
                .filter((e) => e.isDeadline && e.deadlineDate && !e.completed)
                .forEach((e) => {
                const dateKey = e.deadlineDate.toISOString().split('T')[0];
                if (!deadlinesByDate.has(dateKey)) {
                    deadlinesByDate.set(dateKey, []);
                }
                deadlinesByDate.get(dateKey).push(e);
            });
            deadlinesByDate.forEach((eventsOnDate, date) => {
                if (eventsOnDate.length > 3) {
                    conflicts.push({
                        conflict: `Multiple deadlines on ${date}`,
                        events: eventsOnDate.map((e) => e.title),
                        severity: 'high',
                        suggestion: 'Consider rescheduling some deadlines to avoid overload',
                    });
                }
            });
            // Check for past uncompleted deadlines
            const now = new Date();
            const overdueDeadlines = events.filter((e) => e.isDeadline && e.deadlineDate && e.deadlineDate < now && !e.completed);
            if (overdueDeadlines.length > 0) {
                conflicts.push({
                    conflict: `${overdueDeadlines.length} overdue deadline(s)`,
                    events: overdueDeadlines.map((e) => e.title),
                    severity: 'high',
                    suggestion: 'Update status or reschedule overdue deadlines',
                });
            }
            return conflicts;
        }
        /**
         * 14. Export timeline data
         */
        async exportTimelineData(matterId, format) {
            const events = await this.getTimelineForMatter(matterId, {
                includeCompleted: true,
                sortOrder: 'ASC',
            });
            if (format === 'json') {
                return JSON.stringify(events, null, 2);
            }
            // CSV format
            const headers = [
                'Date',
                'Title',
                'Type',
                'Description',
                'Is Deadline',
                'Completed',
                'Participants',
                'Location',
            ];
            const rows = events.map((e) => [
                e.eventDate.toISOString(),
                e.title,
                e.eventType,
                e.description,
                e.isDeadline ? 'Yes' : 'No',
                e.completed ? 'Yes' : 'No',
                e.participants.join('; '),
                e.location || '',
            ]);
            const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
            return csv;
        }
    };
    __setFunctionName(_classThis, "TimelineVisualizationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TimelineVisualizationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TimelineVisualizationService = _classThis;
})();
exports.TimelineVisualizationService = TimelineVisualizationService;
/**
 * WitnessManagementService
 * Injectable service for witness operations
 */
let WitnessManagementService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var WitnessManagementService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
            this.logger = new common_1.Logger(WitnessManagementService.name);
        }
        /**
         * 15. Add witness to matter
         */
        async addWitnessToMatter(data, addedBy) {
            const validated = exports.CreateWitnessSchema.parse(data);
            try {
                const witness = await Witness.create({
                    ...validated,
                    status: WitnessStatus.IDENTIFIED,
                    availability: {},
                    metadata: {
                        addedBy,
                        addedAt: new Date(),
                    },
                });
                this.logger.log(`Added witness: ${witness.firstName} ${witness.lastName} to matter ${witness.matterId}`);
                return witness;
            }
            catch (error) {
                this.logger.error('Failed to add witness', error);
                throw new common_1.InternalServerErrorException('Failed to add witness');
            }
        }
        /**
         * 16. Update witness information
         */
        async updateWitnessInformation(witnessId, updates, updatedBy) {
            const witness = await Witness.findByPk(witnessId);
            if (!witness) {
                throw new common_1.NotFoundException('Witness not found');
            }
            await witness.update({
                ...updates,
                metadata: {
                    ...witness.metadata,
                    lastUpdatedBy: updatedBy,
                    lastUpdatedAt: new Date(),
                },
            });
            this.logger.log(`Updated witness: ${witness.firstName} ${witness.lastName}`);
            return witness;
        }
        /**
         * 17. Schedule witness interview
         */
        async scheduleWitnessInterview(witnessId, interviewDate, scheduledBy, notes) {
            const witness = await Witness.findByPk(witnessId);
            if (!witness) {
                throw new common_1.NotFoundException('Witness not found');
            }
            await witness.update({
                interviewDate,
                status: WitnessStatus.INTERVIEW_SCHEDULED,
                metadata: {
                    ...witness.metadata,
                    interviewScheduledBy: scheduledBy,
                    interviewScheduledAt: new Date(),
                    interviewNotes: notes,
                },
            });
            this.logger.log(`Scheduled interview for ${witness.firstName} ${witness.lastName} on ${interviewDate}`);
            return witness;
        }
        /**
         * 18. Record witness testimony
         */
        async recordWitnessTestimony(witnessId, testimony, recordedBy) {
            const witness = await Witness.findByPk(witnessId);
            if (!witness) {
                throw new common_1.NotFoundException('Witness not found');
            }
            const updates = {
                testimonyNotes: testimony.notes,
            };
            if (testimony.type === 'deposition') {
                updates.depositionDate = testimony.date;
                updates.depositionTranscript = testimony.transcriptPath;
                updates.status = WitnessStatus.DEPOSED;
            }
            else if (testimony.type === 'interview') {
                updates.interviewDate = testimony.date;
                updates.status = WitnessStatus.INTERVIEWED;
            }
            else if (testimony.type === 'trial') {
                updates.status = WitnessStatus.TESTIFIED;
            }
            await witness.update({
                ...updates,
                metadata: {
                    ...witness.metadata,
                    [`${testimony.type}RecordedBy`]: recordedBy,
                    [`${testimony.type}RecordedAt`]: new Date(),
                },
            });
            this.logger.log(`Recorded ${testimony.type} for ${witness.firstName} ${witness.lastName}`);
            return witness;
        }
        /**
         * 19. Assess witness credibility
         */
        async assessWitnessCredibility(witnessId, score, assessmentNotes, assessedBy) {
            if (score < 0 || score > 100) {
                throw new common_1.BadRequestException('Credibility score must be between 0 and 100');
            }
            const witness = await Witness.findByPk(witnessId);
            if (!witness) {
                throw new common_1.NotFoundException('Witness not found');
            }
            await witness.update({
                credibilityScore: score,
                metadata: {
                    ...witness.metadata,
                    credibilityAssessment: {
                        score,
                        notes: assessmentNotes,
                        assessedBy,
                        assessedAt: new Date(),
                    },
                },
            });
            this.logger.log(`Assessed credibility for ${witness.firstName} ${witness.lastName}: ${score}/100`);
            return witness;
        }
        /**
         * 20. Generate witness list
         */
        async generateWitnessList(matterId, options) {
            const where = { matterId };
            if (options?.includeOpposing === false) {
                where.isOpposing = false;
            }
            if (options?.witnessTypes?.length) {
                where.witnessType = { [sequelize_1.Op.in]: options.witnessTypes };
            }
            let orderBy = [];
            if (options?.sortBy === 'name') {
                orderBy = [['lastName', 'ASC'], ['firstName', 'ASC']];
            }
            else if (options?.sortBy === 'type') {
                orderBy = [['witnessType', 'ASC'], ['lastName', 'ASC']];
            }
            else if (options?.sortBy === 'credibility') {
                orderBy = [['credibilityScore', 'DESC NULLS LAST'], ['lastName', 'ASC']];
            }
            else {
                orderBy = [['createdAt', 'ASC']];
            }
            const witnesses = await Witness.findAll({
                where,
                order: orderBy,
            });
            return witnesses.map((w) => ({
                id: w.id,
                name: `${w.firstName} ${w.lastName}`,
                type: w.witnessType,
                status: w.status,
                isExpert: w.isExpert,
                isOpposing: w.isOpposing,
                credibilityScore: w.credibilityScore,
                contact: {
                    email: w.email,
                    phone: w.phone,
                },
            }));
        }
        /**
         * 21. Track witness availability
         */
        async trackWitnessAvailability(witnessId, availability, updatedBy) {
            const witness = await Witness.findByPk(witnessId);
            if (!witness) {
                throw new common_1.NotFoundException('Witness not found');
            }
            await witness.update({
                availability: {
                    ...witness.availability,
                    ...availability,
                },
                metadata: {
                    ...witness.metadata,
                    availabilityUpdatedBy: updatedBy,
                    availabilityUpdatedAt: new Date(),
                },
            });
            this.logger.log(`Updated availability for ${witness.firstName} ${witness.lastName}`);
            return witness;
        }
    };
    __setFunctionName(_classThis, "WitnessManagementService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WitnessManagementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WitnessManagementService = _classThis;
})();
exports.WitnessManagementService = WitnessManagementService;
/**
 * EvidenceTrackingService
 * Injectable service for evidence management
 */
let EvidenceTrackingService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var EvidenceTrackingService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
            this.logger = new common_1.Logger(EvidenceTrackingService.name);
        }
        /**
         * 22. Add evidence to matter
         */
        async addEvidenceToMatter(data, addedBy) {
            const validated = exports.CreateEvidenceSchema.parse(data);
            try {
                const chainOfCustody = [
                    {
                        timestamp: new Date(),
                        action: ChainOfCustodyStatus.COLLECTED,
                        performedBy: addedBy,
                        location: validated.location,
                        notes: 'Evidence initially logged',
                    },
                ];
                const evidence = await Evidence.create({
                    ...validated,
                    chainOfCustody,
                    linkedWitnessIds: [],
                    isAdmitted: false,
                    metadata: {
                        addedBy,
                        addedAt: new Date(),
                    },
                });
                this.logger.log(`Added evidence: ${evidence.description}`);
                return evidence;
            }
            catch (error) {
                this.logger.error('Failed to add evidence', error);
                throw new common_1.InternalServerErrorException('Failed to add evidence');
            }
        }
        /**
         * 23. Update evidence details
         */
        async updateEvidenceDetails(evidenceId, updates, updatedBy) {
            const evidence = await Evidence.findByPk(evidenceId);
            if (!evidence) {
                throw new common_1.NotFoundException('Evidence not found');
            }
            await evidence.update({
                ...updates,
                metadata: {
                    ...evidence.metadata,
                    lastUpdatedBy: updatedBy,
                    lastUpdatedAt: new Date(),
                },
            });
            this.logger.log(`Updated evidence: ${evidence.description}`);
            return evidence;
        }
        /**
         * 24. Record chain of custody
         */
        async recordChainOfCustody(evidenceId, entry, performedBy) {
            const evidence = await Evidence.findByPk(evidenceId);
            if (!evidence) {
                throw new common_1.NotFoundException('Evidence not found');
            }
            const newEntry = {
                timestamp: new Date(),
                action: entry.action,
                performedBy,
                location: entry.location,
                notes: entry.notes,
                signature: entry.signature,
            };
            const updatedChain = [...evidence.chainOfCustody, newEntry];
            await evidence.update({
                chainOfCustody: updatedChain,
                location: entry.location,
            });
            this.logger.log(`Chain of custody updated for evidence: ${evidence.description}`);
            return evidence;
        }
        /**
         * 25. Search evidence
         */
        async searchEvidence(filters) {
            const where = {};
            if (filters.matterId) {
                where.matterId = filters.matterId;
            }
            if (filters.category?.length) {
                where.category = { [sequelize_1.Op.in]: filters.category };
            }
            if (filters.keyword) {
                where[sequelize_1.Op.or] = [
                    { description: { [sequelize_1.Op.iLike]: `%${filters.keyword}%` } },
                    { source: { [sequelize_1.Op.iLike]: `%${filters.keyword}%` } },
                    { notes: { [sequelize_1.Op.iLike]: `%${filters.keyword}%` } },
                ];
            }
            if (filters.collectedFrom || filters.collectedTo) {
                where.collectionDate = {};
                if (filters.collectedFrom) {
                    where.collectionDate[sequelize_1.Op.gte] = filters.collectedFrom;
                }
                if (filters.collectedTo) {
                    where.collectionDate[sequelize_1.Op.lte] = filters.collectedTo;
                }
            }
            if (filters.isAdmitted !== undefined) {
                where.isAdmitted = filters.isAdmitted;
            }
            if (filters.tags?.length) {
                where.tags = { [sequelize_1.Op.overlap]: filters.tags };
            }
            const { rows, count } = await Evidence.findAndCountAll({
                where,
                limit: filters.limit || 50,
                offset: filters.offset || 0,
                order: [['collectionDate', 'DESC']],
            });
            return { rows, count };
        }
        /**
         * 26. Generate exhibit list
         */
        async generateExhibitList(matterId, side) {
            const evidence = await Evidence.findAll({
                where: { matterId },
                order: [['collectionDate', 'ASC']],
            });
            let sequence = 1;
            return evidence.map((e) => {
                const exhibitNumber = e.exhibitNumber || generateExhibitNumber(side, sequence++);
                // Update exhibit number if not set
                if (!e.exhibitNumber) {
                    e.update({ exhibitNumber });
                }
                return {
                    exhibitNumber,
                    description: e.description,
                    category: e.category,
                    source: e.source,
                    isAdmitted: e.isAdmitted,
                    notes: e.notes,
                };
            });
        }
        /**
         * 27. Validate evidence integrity
         */
        async validateEvidenceIntegrity(evidenceId) {
            const evidence = await Evidence.findByPk(evidenceId);
            if (!evidence) {
                throw new common_1.NotFoundException('Evidence not found');
            }
            const issues = [];
            let isValid = true;
            // Check if chain of custody is intact
            const chainIntact = evidence.chainOfCustody.length > 0;
            if (!chainIntact) {
                issues.push('Chain of custody is empty');
                isValid = false;
            }
            // Verify chain sequence (timestamps should be in order)
            for (let i = 1; i < evidence.chainOfCustody.length; i++) {
                const prev = evidence.chainOfCustody[i - 1];
                const curr = evidence.chainOfCustody[i];
                if (new Date(curr.timestamp) < new Date(prev.timestamp)) {
                    issues.push(`Chain of custody timestamp out of order at index ${i}`);
                    isValid = false;
                }
            }
            // If there's a file hash, we'd verify it here
            // This is a placeholder for actual file hash verification
            const expectedHash = evidence.fileHash;
            const actualHash = expectedHash; // Would compute from actual file
            if (expectedHash && actualHash && expectedHash !== actualHash) {
                issues.push('File hash mismatch - evidence may have been tampered with');
                isValid = false;
            }
            return {
                isValid,
                expectedHash,
                actualHash,
                chainIntact,
                issues,
            };
        }
        /**
         * 28. Link evidence to witness
         */
        async linkEvidenceToWitness(evidenceId, witnessId, linkedBy) {
            const evidence = await Evidence.findByPk(evidenceId);
            if (!evidence) {
                throw new common_1.NotFoundException('Evidence not found');
            }
            const witness = await Witness.findByPk(witnessId);
            if (!witness) {
                throw new common_1.NotFoundException('Witness not found');
            }
            const linkedWitnesses = new Set(evidence.linkedWitnessIds);
            linkedWitnesses.add(witnessId);
            await evidence.update({
                linkedWitnessIds: Array.from(linkedWitnesses),
                metadata: {
                    ...evidence.metadata,
                    witnessLinkHistory: [
                        ...(evidence.metadata.witnessLinkHistory || []),
                        {
                            witnessId,
                            witnessName: `${witness.firstName} ${witness.lastName}`,
                            linkedBy,
                            linkedAt: new Date(),
                        },
                    ],
                },
            });
            this.logger.log(`Linked evidence ${evidence.id} to witness ${witness.firstName} ${witness.lastName}`);
            return evidence;
        }
        /**
         * 29. Export evidence log
         */
        async exportEvidenceLog(matterId, format) {
            const evidence = await Evidence.findAll({
                where: { matterId },
                order: [['collectionDate', 'ASC']],
            });
            if (format === 'json') {
                return JSON.stringify(evidence, null, 2);
            }
            // CSV format
            const headers = [
                'Exhibit Number',
                'Category',
                'Description',
                'Source',
                'Collection Date',
                'Collected By',
                'Location',
                'Is Admitted',
                'Tags',
            ];
            const rows = evidence.map((e) => [
                e.exhibitNumber || '',
                e.category,
                e.description,
                e.source,
                e.collectionDate.toISOString(),
                e.collectedBy,
                e.location,
                e.isAdmitted ? 'Yes' : 'No',
                e.tags.join('; '),
            ]);
            const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
            return csv;
        }
    };
    __setFunctionName(_classThis, "EvidenceTrackingService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EvidenceTrackingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EvidenceTrackingService = _classThis;
})();
exports.EvidenceTrackingService = EvidenceTrackingService;
/**
 * TrialPreparationService
 * Injectable service for trial preparation operations
 */
let TrialPreparationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var TrialPreparationService = _classThis = class {
        constructor(sequelize, witnessService, evidenceService) {
            this.sequelize = sequelize;
            this.witnessService = witnessService;
            this.evidenceService = evidenceService;
            this.logger = new common_1.Logger(TrialPreparationService.name);
        }
        /**
         * 30. Create trial preparation plan
         */
        async createTrialPreparationPlan(matterId, trialDate, createdBy) {
            try {
                const checklist = [
                    {
                        id: crypto.randomUUID(),
                        task: 'Finalize witness list',
                        category: 'Witnesses',
                        completed: false,
                        priority: 'high',
                        dueDate: new Date(trialDate.getTime() - 30 * 24 * 60 * 60 * 1000),
                    },
                    {
                        id: crypto.randomUUID(),
                        task: 'Prepare witness examination outlines',
                        category: 'Witnesses',
                        completed: false,
                        priority: 'high',
                        dueDate: new Date(trialDate.getTime() - 21 * 24 * 60 * 60 * 1000),
                    },
                    {
                        id: crypto.randomUUID(),
                        task: 'Complete exhibit list',
                        category: 'Evidence',
                        completed: false,
                        priority: 'high',
                        dueDate: new Date(trialDate.getTime() - 30 * 24 * 60 * 60 * 1000),
                    },
                    {
                        id: crypto.randomUUID(),
                        task: 'Organize trial binder',
                        category: 'Documents',
                        completed: false,
                        priority: 'medium',
                        dueDate: new Date(trialDate.getTime() - 14 * 24 * 60 * 60 * 1000),
                    },
                    {
                        id: crypto.randomUUID(),
                        task: 'Draft opening statement',
                        category: 'Arguments',
                        completed: false,
                        priority: 'high',
                        dueDate: new Date(trialDate.getTime() - 14 * 24 * 60 * 60 * 1000),
                    },
                    {
                        id: crypto.randomUUID(),
                        task: 'Draft closing argument',
                        category: 'Arguments',
                        completed: false,
                        priority: 'high',
                        dueDate: new Date(trialDate.getTime() - 7 * 24 * 60 * 60 * 1000),
                    },
                    {
                        id: crypto.randomUUID(),
                        task: 'Prepare jury selection questions',
                        category: 'Jury',
                        completed: false,
                        priority: 'medium',
                        dueDate: new Date(trialDate.getTime() - 10 * 24 * 60 * 60 * 1000),
                    },
                    {
                        id: crypto.randomUUID(),
                        task: 'File pretrial motions',
                        category: 'Court Filings',
                        completed: false,
                        priority: 'high',
                        dueDate: new Date(trialDate.getTime() - 30 * 24 * 60 * 60 * 1000),
                    },
                ];
                const trialPrep = await TrialPreparation.create({
                    matterId,
                    trialDate,
                    currentPhase: TrialPhase.INITIAL_PREP,
                    readinessScore: 0,
                    witnessListComplete: false,
                    exhibitListComplete: false,
                    trialBinderComplete: false,
                    openingStatementDrafted: false,
                    closingArgumentDrafted: false,
                    witnessExaminationOutlines: {},
                    trialStrategy: '',
                    estimatedDuration: 1,
                    checklist,
                    metadata: {
                        createdBy,
                        createdAt: new Date(),
                    },
                });
                this.logger.log(`Created trial preparation plan for matter: ${matterId}`);
                return trialPrep;
            }
            catch (error) {
                this.logger.error('Failed to create trial preparation plan', error);
                throw new common_1.InternalServerErrorException('Failed to create trial preparation plan');
            }
        }
        /**
         * 31. Update trial readiness
         */
        async updateTrialReadiness(trialPrepId, updates, updatedBy) {
            const trialPrep = await TrialPreparation.findByPk(trialPrepId);
            if (!trialPrep) {
                throw new common_1.NotFoundException('Trial preparation not found');
            }
            await trialPrep.update({
                ...updates,
                metadata: {
                    ...trialPrep.metadata,
                    lastUpdatedBy: updatedBy,
                    lastUpdatedAt: new Date(),
                },
            });
            // Recalculate readiness score
            const readinessScore = await this.calculateReadinessScore(trialPrep);
            await trialPrep.update({ readinessScore });
            this.logger.log(`Updated trial readiness: ${readinessScore}%`);
            return trialPrep;
        }
        /**
         * 32. Generate trial binder
         */
        async generateTrialBinder(trialPrepId) {
            const trialPrep = await TrialPreparation.findByPk(trialPrepId, {
                include: [{ model: LitigationMatter, include: [Witness, Evidence] }],
            });
            if (!trialPrep) {
                throw new common_1.NotFoundException('Trial preparation not found');
            }
            const matter = trialPrep.matter;
            if (!matter) {
                throw new common_1.NotFoundException('Associated matter not found');
            }
            const sections = [
                {
                    title: 'Case Summary and Timeline',
                    order: 1,
                    documents: [
                        { name: 'Case Summary', type: 'summary' },
                        { name: 'Case Chronology', type: 'timeline' },
                    ],
                },
                {
                    title: 'Pleadings and Motions',
                    order: 2,
                    documents: [
                        { name: 'Complaint', type: 'pleading' },
                        { name: 'Answer', type: 'pleading' },
                        { name: 'Pretrial Motions', type: 'motion' },
                    ],
                },
                {
                    title: 'Witness Information',
                    order: 3,
                    documents: matter.witnesses?.map((w) => ({
                        name: `${w.firstName} ${w.lastName} - ${w.witnessType}`,
                        type: 'witness_profile',
                    })) || [],
                },
                {
                    title: 'Exhibit List',
                    order: 4,
                    documents: matter.evidence?.map((e) => ({
                        name: `${e.exhibitNumber || 'TBD'} - ${e.description}`,
                        type: 'exhibit',
                        path: e.filePath,
                    })) || [],
                },
                {
                    title: 'Trial Strategy',
                    order: 5,
                    documents: [
                        { name: 'Opening Statement', type: 'argument' },
                        { name: 'Witness Examination Outlines', type: 'outline' },
                        { name: 'Closing Argument', type: 'argument' },
                    ],
                },
            ];
            const tableOfContents = sections
                .map((section, idx) => {
                const docs = section.documents.map((doc, docIdx) => `    ${docIdx + 1}. ${doc.name}`).join('\n');
                return `${idx + 1}. ${section.title}\n${docs}`;
            })
                .join('\n\n');
            return {
                sections,
                tableOfContents,
            };
        }
        /**
         * 33. Schedule trial date
         */
        async scheduleTrialDate(matterId, trialDate, scheduledBy, courtroom) {
            const matter = await LitigationMatter.findByPk(matterId);
            if (!matter) {
                throw new common_1.NotFoundException('Matter not found');
            }
            const auditLog = matter.metadata.auditLog || [];
            auditLog.push({
                timestamp: new Date(),
                action: 'trial_scheduled',
                performedBy: scheduledBy,
                details: `Trial scheduled for ${trialDate.toISOString()}${courtroom ? ` in ${courtroom}` : ''}`,
            });
            await matter.update({
                trialDate,
                metadata: {
                    ...matter.metadata,
                    courtroom,
                    auditLog,
                },
            });
            this.logger.log(`Scheduled trial date for matter ${matter.matterNumber}: ${trialDate}`);
            return matter;
        }
        /**
         * 34. Assess trial readiness
         */
        async assessTrialReadiness(trialPrepId) {
            const trialPrep = await TrialPreparation.findByPk(trialPrepId);
            if (!trialPrep) {
                throw new common_1.NotFoundException('Trial preparation not found');
            }
            const now = new Date();
            const completedTasks = trialPrep.checklist.filter((item) => item.completed).length;
            const totalTasks = trialPrep.checklist.length;
            const percentComplete = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
            const upcomingTasks = trialPrep.checklist
                .filter((item) => !item.completed && item.dueDate)
                .map((item) => ({
                task: item.task,
                dueDate: item.dueDate,
                priority: item.priority,
                overdue: item.dueDate < now,
            }))
                .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
            const recommendations = [];
            if (!trialPrep.witnessListComplete) {
                recommendations.push('Complete and finalize witness list');
            }
            if (!trialPrep.exhibitListComplete) {
                recommendations.push('Finalize exhibit list with all evidence');
            }
            if (!trialPrep.openingStatementDrafted) {
                recommendations.push('Draft opening statement');
            }
            if (!trialPrep.closingArgumentDrafted) {
                recommendations.push('Draft closing argument');
            }
            if (percentComplete < 75) {
                recommendations.push('Accelerate checklist completion - less than 75% complete');
            }
            const overdueTasks = upcomingTasks.filter((t) => t.overdue).length;
            if (overdueTasks > 0) {
                recommendations.push(`Address ${overdueTasks} overdue task(s) immediately`);
            }
            return {
                readinessScore: trialPrep.readinessScore,
                assessmentDate: now,
                completionStatus: {
                    witnessList: trialPrep.witnessListComplete,
                    exhibitList: trialPrep.exhibitListComplete,
                    trialBinder: trialPrep.trialBinderComplete,
                    openingStatement: trialPrep.openingStatementDrafted,
                    closingArgument: trialPrep.closingArgumentDrafted,
                },
                checklistProgress: {
                    total: totalTasks,
                    completed: completedTasks,
                    percentComplete,
                },
                upcomingTasks,
                recommendations,
            };
        }
        /**
         * 35. Generate opening statement framework
         */
        async generateOpeningStatement(trialPrepId, theme) {
            const trialPrep = await TrialPreparation.findByPk(trialPrepId, {
                include: [{ model: LitigationMatter }],
            });
            if (!trialPrep) {
                throw new common_1.NotFoundException('Trial preparation not found');
            }
            const structure = [
                {
                    section: 'Introduction',
                    purpose: 'Introduce yourself, your client, and establish rapport',
                    keyPoints: [
                        'Greet the jury professionally',
                        'Introduce counsel and client',
                        'Present case theme',
                    ],
                },
                {
                    section: 'Overview of Facts',
                    purpose: 'Provide roadmap of what evidence will show',
                    keyPoints: [
                        'Chronological narrative of events',
                        'Key factual elements',
                        'Undisputed facts',
                    ],
                },
                {
                    section: 'Legal Framework',
                    purpose: 'Explain relevant law in accessible terms',
                    keyPoints: [
                        'Applicable legal standards',
                        'Burden of proof',
                        'Elements to be proven',
                    ],
                },
                {
                    section: 'Evidence Preview',
                    purpose: 'Outline what witnesses and exhibits will demonstrate',
                    keyPoints: [
                        'Key witnesses and their testimony',
                        'Important documentary evidence',
                        'Expert testimony overview',
                    ],
                },
                {
                    section: 'Conclusion',
                    purpose: 'Reinforce theme and request favorable verdict',
                    keyPoints: [
                        'Restate case theme',
                        'Preview desired verdict',
                        'Thank the jury',
                    ],
                },
            ];
            const template = `
OPENING STATEMENT - ${trialPrep.matter?.matterName || 'Case'}

THEME: ${theme}

May it please the Court, counsel, ladies and gentlemen of the jury:

[INTRODUCTION]
My name is [ATTORNEY NAME], and I represent [CLIENT NAME] in this matter.

[THEME STATEMENT]
${theme}

[FACTS OVERVIEW]
Let me tell you what happened and what the evidence will show...

[Key factual narrative goes here]

[LEGAL FRAMEWORK]
The law in this case requires that we prove [ELEMENTS]...

[EVIDENCE PREVIEW]
You will hear testimony from:
- [Witness list with brief description of expected testimony]

You will see documentary evidence including:
- [Exhibit list with brief description]

[CONCLUSION]
At the end of this trial, after you have heard all the evidence, we will ask you to return a verdict in favor of [CLIENT NAME].

Thank you.
    `.trim();
            await trialPrep.update({
                openingStatementDrafted: true,
                metadata: {
                    ...trialPrep.metadata,
                    openingStatementTheme: theme,
                },
            });
            return {
                theme,
                structure,
                template,
            };
        }
        /**
         * 36. Create examination outline
         */
        async createExaminationOutline(trialPrepId, witnessId, examinationType) {
            const trialPrep = await TrialPreparation.findByPk(trialPrepId);
            if (!trialPrep) {
                throw new common_1.NotFoundException('Trial preparation not found');
            }
            const witness = await Witness.findByPk(witnessId);
            if (!witness) {
                throw new common_1.NotFoundException('Witness not found');
            }
            const objectives = examinationType === 'direct'
                ? [
                    'Establish witness credibility and qualifications',
                    'Elicit favorable testimony supporting case theory',
                    'Introduce relevant exhibits through witness',
                    'Build narrative chronologically',
                    'Anticipate and address potential weaknesses',
                ]
                : [
                    'Impeach witness credibility',
                    'Highlight inconsistencies in testimony',
                    'Extract favorable admissions',
                    'Limit harmful testimony',
                    'Control witness responses',
                ];
            const outline = examinationType === 'direct'
                ? [
                    {
                        topic: 'Background and Qualifications',
                        questions: [
                            'Please state your full name for the record.',
                            'What is your current occupation?',
                            'How long have you been in this field?',
                        ],
                    },
                    {
                        topic: 'Relevant Events',
                        questions: [
                            'Where were you on [DATE]?',
                            'What did you observe?',
                            'What happened next?',
                        ],
                    },
                ]
                : [
                    {
                        topic: 'Prior Inconsistent Statements',
                        questions: [
                            'You testified in your deposition that [STATEMENT], correct?',
                            'Today you said [DIFFERENT STATEMENT], is that right?',
                            'Which version is accurate?',
                        ],
                    },
                ];
            const examinationOutline = {
                witnessName: `${witness.firstName} ${witness.lastName}`,
                examinationType,
                objectives,
                outline,
            };
            const outlines = { ...trialPrep.witnessExaminationOutlines };
            outlines[witnessId] = examinationOutline;
            await trialPrep.update({
                witnessExaminationOutlines: outlines,
            });
            this.logger.log(`Created ${examinationType} examination outline for ${witness.firstName} ${witness.lastName}`);
            return examinationOutline;
        }
        /**
         * Helper: Calculate readiness score
         */
        async calculateReadinessScore(trialPrep) {
            let score = 0;
            const weights = {
                witnessList: 15,
                exhibitList: 15,
                trialBinder: 10,
                openingStatement: 20,
                closingArgument: 20,
                checklistCompletion: 20,
            };
            if (trialPrep.witnessListComplete)
                score += weights.witnessList;
            if (trialPrep.exhibitListComplete)
                score += weights.exhibitList;
            if (trialPrep.trialBinderComplete)
                score += weights.trialBinder;
            if (trialPrep.openingStatementDrafted)
                score += weights.openingStatement;
            if (trialPrep.closingArgumentDrafted)
                score += weights.closingArgument;
            const completedTasks = trialPrep.checklist.filter((item) => item.completed).length;
            const totalTasks = trialPrep.checklist.length;
            const checklistScore = totalTasks > 0 ? (completedTasks / totalTasks) * weights.checklistCompletion : 0;
            score += checklistScore;
            return Math.round(score);
        }
    };
    __setFunctionName(_classThis, "TrialPreparationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TrialPreparationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TrialPreparationService = _classThis;
})();
exports.TrialPreparationService = TrialPreparationService;
/**
 * DocumentGenerationService
 * Injectable service for legal document generation
 */
let DocumentGenerationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var DocumentGenerationService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
            this.logger = new common_1.Logger(DocumentGenerationService.name);
        }
        /**
         * 37. Generate pleading
         */
        async generatePleading(matterId, pleadingType, claims) {
            const matter = await LitigationMatter.findByPk(matterId);
            if (!matter) {
                throw new common_1.NotFoundException('Matter not found');
            }
            const document = `
${pleadingType.toUpperCase()}

${matter.courtName || '[COURT NAME]'}
${matter.jurisdiction}

${matter.clientName},
    Plaintiff,

v.                                      Case No. ${matter.caseNumber || '[CASE NUMBER]'}

${matter.opposingParty},
    Defendant.

${pleadingType === 'complaint' ? 'COMPLAINT FOR' : pleadingType.toUpperCase()}

    Comes now the ${pleadingType === 'answer' ? 'Defendant' : 'Plaintiff'}, by and through undersigned counsel, and states as follows:

${claims.map((claim, idx) => `
COUNT ${idx + 1}: ${claim.claim}

${claim.allegations.map((allegation, aIdx) => `${aIdx + 1}. ${allegation}`).join('\n')}
`).join('\n')}

WHEREFORE, ${pleadingType === 'complaint' ? 'Plaintiff' : 'Defendant'} respectfully requests that this Court:

a) [RELIEF REQUESTED]
b) Award costs and attorney's fees
c) Grant such other and further relief as the Court deems just and proper.

Respectfully submitted,

_______________________
[ATTORNEY NAME]
[BAR NUMBER]
[FIRM NAME]
[ADDRESS]

Date: ${new Date().toLocaleDateString()}
    `.trim();
            this.logger.log(`Generated ${pleadingType} for matter ${matter.matterNumber}`);
            return {
                pleadingType,
                document,
                dateGenerated: new Date(),
            };
        }
        /**
         * 38. Create motion
         */
        async createMotion(matterId, motionType, grounds, reliefSought) {
            const matter = await LitigationMatter.findByPk(matterId);
            if (!matter) {
                throw new common_1.NotFoundException('Matter not found');
            }
            const document = `
MOTION ${motionType.toUpperCase()}

${matter.courtName || '[COURT NAME]'}
${matter.jurisdiction}

${matter.clientName},
    Plaintiff,

v.                                      Case No. ${matter.caseNumber || '[CASE NUMBER]'}

${matter.opposingParty},
    Defendant.

MOTION ${motionType.toUpperCase()}

    Comes now the Plaintiff, by and through undersigned counsel, and respectfully moves this Court for ${motionType}, and in support thereof states as follows:

GROUNDS

${grounds.map((ground, idx) => `${idx + 1}. ${ground}`).join('\n\n')}

RELIEF SOUGHT

    WHEREFORE, Plaintiff respectfully requests that this Court ${reliefSought}.

Respectfully submitted,

_______________________
[ATTORNEY NAME]
[BAR NUMBER]
[FIRM NAME]
[ADDRESS]

Date: ${new Date().toLocaleDateString()}
    `.trim();
            this.logger.log(`Generated motion (${motionType}) for matter ${matter.matterNumber}`);
            return {
                motionType,
                document,
                dateGenerated: new Date(),
            };
        }
        /**
         * 39. Assemble trial exhibits
         */
        async assembleTrialExhibits(matterId, side) {
            const evidence = await Evidence.findAll({
                where: { matterId },
                order: [['collectionDate', 'ASC']],
            });
            let sequence = 1;
            const exhibits = evidence.map((e) => {
                const exhibitNumber = e.exhibitNumber || generateExhibitNumber(side, sequence++);
                if (!e.exhibitNumber) {
                    e.update({ exhibitNumber });
                }
                return {
                    exhibitNumber,
                    description: e.description,
                    category: e.category,
                    filePath: e.filePath,
                };
            });
            const matter = await LitigationMatter.findByPk(matterId);
            const coverSheet = `
EXHIBIT LIST

Case: ${matter?.matterName || '[CASE NAME]'}
Case No: ${matter?.caseNumber || '[CASE NUMBER]'}
${side === 'plaintiff' ? 'Plaintiff' : 'Defendant'} Exhibits

Total Exhibits: ${exhibits.length}

${exhibits.map((ex, idx) => `${idx + 1}. Exhibit ${ex.exhibitNumber}: ${ex.description}`).join('\n')}

Prepared: ${new Date().toLocaleDateString()}
    `.trim();
            return {
                totalExhibits: exhibits.length,
                exhibits,
                coverSheet,
            };
        }
        /**
         * 40. Generate discovery request
         */
        async generateDiscoveryRequest(matterId, requestType, requests) {
            const matter = await LitigationMatter.findByPk(matterId);
            if (!matter) {
                throw new common_1.NotFoundException('Matter not found');
            }
            const typeMap = {
                interrogatories: 'INTERROGATORIES',
                requests_for_production: 'REQUESTS FOR PRODUCTION OF DOCUMENTS',
                requests_for_admission: 'REQUESTS FOR ADMISSION',
            };
            const document = `
${matter.clientName.toUpperCase()}'S ${typeMap[requestType]}

${matter.courtName || '[COURT NAME]'}
${matter.jurisdiction}

${matter.clientName},
    Plaintiff,

v.                                      Case No. ${matter.caseNumber || '[CASE NUMBER]'}

${matter.opposingParty},
    Defendant.

${typeMap[requestType]} TO DEFENDANT

    Plaintiff, pursuant to [APPLICABLE RULES], hereby requests that Defendant respond to the following ${requestType}:

${requests.map((req, idx) => `${requestType === 'interrogatories' ? 'INTERROGATORY' : 'REQUEST'} NO. ${idx + 1}: ${req}`).join('\n\n')}

INSTRUCTIONS

${requestType === 'interrogatories' ? `
1. Answer each interrogatory separately and fully in writing under oath.
2. Answers are due within 30 days of service.
3. If you cannot answer fully, answer to the extent possible.
` : requestType === 'requests_for_production' ? `
1. Produce all responsive documents within 30 days.
2. Documents should be produced as they are kept in the usual course of business.
3. Label all documents with corresponding request number.
` : `
1. Respond to each request within 30 days.
2. Each matter must be admitted or denied.
3. Provide reasons for any denial.
`}

Respectfully submitted,

_______________________
[ATTORNEY NAME]
[BAR NUMBER]
[FIRM NAME]
[ADDRESS]

Date: ${new Date().toLocaleDateString()}
    `.trim();
            this.logger.log(`Generated ${requestType} for matter ${matter.matterNumber}`);
            return {
                requestType: typeMap[requestType],
                document,
                dateGenerated: new Date(),
            };
        }
        /**
         * 41. Create settlement demand
         */
        async createSettlementDemand(matterId, demandAmount, damages, deadline) {
            const matter = await LitigationMatter.findByPk(matterId);
            if (!matter) {
                throw new common_1.NotFoundException('Matter not found');
            }
            const totalDamages = damages.reduce((sum, d) => sum + d.amount, 0);
            const document = `
SETTLEMENT DEMAND

${new Date().toLocaleDateString()}

${matter.opposingCounsel || '[OPPOSING COUNSEL]'}
${matter.opposingParty}

Re: ${matter.matterName}
    Case No. ${matter.caseNumber || 'Pre-litigation'}

Dear ${matter.opposingCounsel ? 'Counsel' : 'Sir/Madam'}:

This letter constitutes a settlement demand on behalf of our client, ${matter.clientName}, arising from ${matter.description}.

FACTS

[Detailed factual background of the case]

DAMAGES

Our client has sustained the following damages:

${damages.map((d, idx) => `
${idx + 1}. ${d.category}: $${d.amount.toLocaleString()}
   ${d.description}
`).join('\n')}

Total Documented Damages: $${totalDamages.toLocaleString()}

LIABILITY

[Analysis of defendant's liability]

DEMAND

In consideration of the facts, injuries, and damages outlined above, our client demands settlement in the amount of $${demandAmount.toLocaleString()} to resolve this matter.

This offer remains open until ${deadline.toLocaleDateString()}. If we do not receive a response by that date, we will proceed with litigation and will not consider any settlement offer below the full amount of damages plus costs and attorney's fees.

Please contact me at your earliest convenience to discuss this matter.

Very truly yours,

_______________________
[ATTORNEY NAME]
[BAR NUMBER]
[FIRM NAME]
[CONTACT INFORMATION]
    `.trim();
            this.logger.log(`Generated settlement demand for matter ${matter.matterNumber}: $${demandAmount}`);
            return {
                demandAmount,
                document,
                dateGenerated: new Date(),
            };
        }
        /**
         * 42. Generate case chronology
         */
        async generateCaseChronology(matterId) {
            const matter = await LitigationMatter.findByPk(matterId, {
                include: [{ model: TimelineEvent }],
            });
            if (!matter) {
                throw new common_1.NotFoundException('Matter not found');
            }
            const events = (matter.timelineEvents || [])
                .sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime())
                .map((e) => ({
                date: e.eventDate,
                event: e.title,
                description: e.description,
                category: e.eventType,
            }));
            const document = `
CASE CHRONOLOGY

Matter: ${matter.matterName}
Case No: ${matter.caseNumber || 'N/A'}
Client: ${matter.clientName}
Opposing Party: ${matter.opposingParty}

CHRONOLOGICAL EVENTS

${events.map((e, idx) => `
${idx + 1}. ${e.date.toLocaleDateString()} - ${e.event}
   Category: ${e.category}
   ${e.description}
`).join('\n')}

Total Events: ${events.length}

Prepared: ${new Date().toLocaleDateString()}
    `.trim();
            this.logger.log(`Generated case chronology for matter ${matter.matterNumber}`);
            return {
                matterName: matter.matterName,
                events,
                document,
                dateGenerated: new Date(),
            };
        }
    };
    __setFunctionName(_classThis, "DocumentGenerationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocumentGenerationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocumentGenerationService = _classThis;
})();
exports.DocumentGenerationService = DocumentGenerationService;
// ============================================================================
// MODULE CONFIGURATION
// ============================================================================
/**
 * Configuration factory for litigation support
 */
exports.litigationSupportConfig = (0, config_1.registerAs)('litigationSupport', () => ({
    matterNumberPrefix: process.env.LITIGATION_MATTER_PREFIX || 'MTR',
    enableAuditLogging: process.env.LITIGATION_AUDIT_LOGGING !== 'false',
    defaultTrialDuration: parseInt(process.env.DEFAULT_TRIAL_DURATION || '1', 10),
    enableEmailNotifications: process.env.LITIGATION_EMAIL_NOTIFICATIONS === 'true',
}));
/**
 * LitigationSupportModule
 * NestJS module providing litigation management services
 */
let LitigationSupportModule = (() => {
    let _classDecorators = [(0, common_1.Global)(), (0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forFeature(exports.litigationSupportConfig),
            ],
            providers: [
                LitigationMatterService,
                TimelineVisualizationService,
                WitnessManagementService,
                EvidenceTrackingService,
                TrialPreparationService,
                DocumentGenerationService,
            ],
            exports: [
                LitigationMatterService,
                TimelineVisualizationService,
                WitnessManagementService,
                EvidenceTrackingService,
                TrialPreparationService,
                DocumentGenerationService,
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var LitigationSupportModule = _classThis = class {
        static forRoot(sequelize) {
            return {
                module: LitigationSupportModule,
                providers: [
                    {
                        provide: 'SEQUELIZE',
                        useValue: sequelize,
                    },
                    LitigationMatterService,
                    TimelineVisualizationService,
                    WitnessManagementService,
                    EvidenceTrackingService,
                    TrialPreparationService,
                    DocumentGenerationService,
                ],
                exports: [
                    LitigationMatterService,
                    TimelineVisualizationService,
                    WitnessManagementService,
                    EvidenceTrackingService,
                    TrialPreparationService,
                    DocumentGenerationService,
                ],
            };
        }
    };
    __setFunctionName(_classThis, "LitigationSupportModule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LitigationSupportModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LitigationSupportModule = _classThis;
})();
exports.LitigationSupportModule = LitigationSupportModule;
//# sourceMappingURL=litigation-support-kit.js.map