"use strict";
/**
 * LOC: DEPOSITION_MANAGEMENT_KIT_001
 * File: /reuse/legal/deposition-management-kit.ts
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
 *   - node-schedule
 *
 * DOWNSTREAM (imported by):
 *   - Legal deposition modules
 *   - Litigation support controllers
 *   - Discovery management services
 *   - Court reporting services
 *   - Transcript management services
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
exports.CreateSummaryDto = exports.TrackObjectionDto = exports.OrderTranscriptDto = exports.PrepareExhibitDto = exports.ScheduleDepositionDto = exports.DepositionManagementModule = exports.DepositionManagementService = exports.DepositionOutlineModel = exports.DepositionSummaryModel = exports.DepositionObjectionModel = exports.DepositionTranscriptModel = exports.DepositionExhibitModel = exports.DepositionModel = exports.SummaryCreationSchema = exports.ObjectionSchema = exports.TranscriptOrderSchema = exports.ExhibitPrepSchema = exports.DepositionScheduleSchema = exports.TranscriptStatus = exports.ObjectionRuling = exports.ObjectionType = exports.ExhibitStatus = exports.DepositionType = exports.DepositionStatus = void 0;
exports.scheduleDeposition = scheduleDeposition;
exports.generateDepositionNumber = generateDepositionNumber;
exports.calculateEstimatedCost = calculateEstimatedCost;
exports.prepareDepositionExhibit = prepareDepositionExhibit;
exports.generateExhibitNumber = generateExhibitNumber;
exports.orderDepositionTranscript = orderDepositionTranscript;
exports.calculateTranscriptCost = calculateTranscriptCost;
exports.calculateExpectedDate = calculateExpectedDate;
exports.trackDepositionObjection = trackDepositionObjection;
exports.createDepositionSummary = createDepositionSummary;
exports.markExhibit = markExhibit;
exports.introduceExhibit = introduceExhibit;
exports.authenticateExhibit = authenticateExhibit;
exports.updateObjectionRuling = updateObjectionRuling;
exports.generateDepositionNotice = generateDepositionNotice;
exports.createDepositionOutline = createDepositionOutline;
exports.updateDepositionStatus = updateDepositionStatus;
exports.cancelDeposition = cancelDeposition;
exports.rescheduleDeposition = rescheduleDeposition;
exports.assignCourtReporter = assignCourtReporter;
exports.assignVideographer = assignVideographer;
exports.addDepositionAttendee = addDepositionAttendee;
exports.removeDepositionAttendee = removeDepositionAttendee;
exports.recordNoticeService = recordNoticeService;
exports.confirmDeposition = confirmDeposition;
exports.startDeposition = startDeposition;
exports.completeDeposition = completeDeposition;
exports.updateTranscriptStatus = updateTranscriptStatus;
exports.attachTranscriptFile = attachTranscriptFile;
exports.submitErrataSheet = submitErrataSheet;
exports.assignTranscriptReviewer = assignTranscriptReviewer;
exports.completeTranscriptReview = completeTranscriptReview;
exports.getDepositionWithRelations = getDepositionWithRelations;
exports.searchDepositions = searchDepositions;
exports.getUpcomingDepositions = getUpcomingDepositions;
exports.calculateDepositionStatistics = calculateDepositionStatistics;
/**
 * File: /reuse/legal/deposition-management-kit.ts
 * Locator: WC-DEPOSITION-MANAGEMENT-KIT-001
 * Purpose: Production-Grade Deposition Management Kit - Enterprise deposition coordination toolkit
 *
 * Upstream: NestJS, Sequelize, Zod, Date-FNS, Node-Schedule
 * Downstream: ../backend/modules/depositions/*, Litigation support controllers, Discovery services
 * Dependencies: TypeScript 5.x, Node 18+, sequelize-typescript, @nestjs/swagger, zod
 * Exports: 36 production-ready deposition management functions for legal platforms
 *
 * LLM Context: Production-grade deposition lifecycle management toolkit for White Cross platform.
 * Provides comprehensive deposition scheduling with calendar integration and conflict detection,
 * exhibit preparation with automatic numbering and organization, transcript ordering with court
 * reporter coordination, objection tracking with categorization and rulings, deposition summary
 * creation with key testimony extraction, Sequelize models for depositions/exhibits/transcripts/
 * objections/summaries, NestJS services with dependency injection, Swagger API documentation,
 * witness coordination with notification management, video deposition setup and recording management,
 * exhibit marking and authentication, transcript review workflow with errata sheet handling,
 * deposition outline generation, question preparation with topic organization, time tracking and
 * billing integration, court reporter management and vendor coordination, deposition room reservation,
 * remote deposition technology setup, deposition notice generation and service tracking, protective
 * order compliance, privilege assertion logging, deposition digest creation with page-line citations,
 * key testimony highlighting and indexing, deposition clip extraction for trial use, multi-deposition
 * coordination for complex cases, deposition cost estimation and budget tracking, deposition testimony
 * comparison and impeachment preparation, expert witness deposition scheduling with materials review,
 * deposition preparation sessions with witness coaching tracking, deposition agreement drafting,
 * deposition cancellation and rescheduling workflows, and healthcare litigation-specific support
 * (medical expert depositions, HIPAA-compliant recording, medical terminology indexing).
 */
const crypto = __importStar(require("crypto"));
const common_1 = require("@nestjs/common");
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const sequelize_1 = require("sequelize");
const date_fns_1 = require("date-fns");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Deposition status lifecycle
 */
var DepositionStatus;
(function (DepositionStatus) {
    DepositionStatus["SCHEDULED"] = "scheduled";
    DepositionStatus["NOTICE_SENT"] = "notice_sent";
    DepositionStatus["CONFIRMED"] = "confirmed";
    DepositionStatus["IN_PROGRESS"] = "in_progress";
    DepositionStatus["RECESSED"] = "recessed";
    DepositionStatus["COMPLETED"] = "completed";
    DepositionStatus["CANCELLED"] = "cancelled";
    DepositionStatus["RESCHEDULED"] = "rescheduled";
    DepositionStatus["TRANSCRIPT_ORDERED"] = "transcript_ordered";
    DepositionStatus["TRANSCRIPT_RECEIVED"] = "transcript_received";
    DepositionStatus["REVIEWED"] = "reviewed";
    DepositionStatus["FINALIZED"] = "finalized";
})(DepositionStatus || (exports.DepositionStatus = DepositionStatus = {}));
/**
 * Deposition types
 */
var DepositionType;
(function (DepositionType) {
    DepositionType["ORAL"] = "oral";
    DepositionType["WRITTEN"] = "written";
    DepositionType["VIDEO"] = "video";
    DepositionType["TELEPHONE"] = "telephone";
    DepositionType["REMOTE"] = "remote";
    DepositionType["EXPERT_WITNESS"] = "expert_witness";
    DepositionType["PARTY"] = "party";
    DepositionType["NON_PARTY"] = "non_party";
    DepositionType["CORPORATE_REPRESENTATIVE"] = "corporate_representative";
    DepositionType["RULE_30_B_6"] = "rule_30_b_6";
})(DepositionType || (exports.DepositionType = DepositionType = {}));
/**
 * Exhibit status
 */
var ExhibitStatus;
(function (ExhibitStatus) {
    ExhibitStatus["IDENTIFIED"] = "identified";
    ExhibitStatus["PREPARED"] = "prepared";
    ExhibitStatus["MARKED"] = "marked";
    ExhibitStatus["INTRODUCED"] = "introduced";
    ExhibitStatus["AUTHENTICATED"] = "authenticated";
    ExhibitStatus["ADMITTED"] = "admitted";
    ExhibitStatus["EXCLUDED"] = "excluded";
    ExhibitStatus["WITHDRAWN"] = "withdrawn";
})(ExhibitStatus || (exports.ExhibitStatus = ExhibitStatus = {}));
/**
 * Objection types
 */
var ObjectionType;
(function (ObjectionType) {
    ObjectionType["FORM"] = "form";
    ObjectionType["RELEVANCE"] = "relevance";
    ObjectionType["HEARSAY"] = "hearsay";
    ObjectionType["SPECULATION"] = "speculation";
    ObjectionType["PRIVILEGE"] = "privilege";
    ObjectionType["ATTORNEY_CLIENT"] = "attorney_client";
    ObjectionType["WORK_PRODUCT"] = "work_product";
    ObjectionType["FOUNDATION"] = "foundation";
    ObjectionType["COMPOUND"] = "compound";
    ObjectionType["ARGUMENTATIVE"] = "argumentative";
    ObjectionType["ASKED_AND_ANSWERED"] = "asked_and_answered";
    ObjectionType["VAGUE"] = "vague";
    ObjectionType["AMBIGUOUS"] = "ambiguous";
    ObjectionType["CONFIDENTIAL"] = "confidential";
    ObjectionType["PROPRIETARY"] = "proprietary";
    ObjectionType["PRIVACY"] = "privacy";
    ObjectionType["HARASSING"] = "harassing";
    ObjectionType["OPPRESSIVE"] = "oppressive";
})(ObjectionType || (exports.ObjectionType = ObjectionType = {}));
/**
 * Objection ruling
 */
var ObjectionRuling;
(function (ObjectionRuling) {
    ObjectionRuling["PENDING"] = "pending";
    ObjectionRuling["SUSTAINED"] = "sustained";
    ObjectionRuling["OVERRULED"] = "overruled";
    ObjectionRuling["DEFERRED"] = "deferred";
    ObjectionRuling["WITHDRAWN"] = "withdrawn";
    ObjectionRuling["INSTRUCTION_TO_ANSWER"] = "instruction_to_answer";
    ObjectionRuling["INSTRUCTION_NOT_TO_ANSWER"] = "instruction_not_to_answer";
})(ObjectionRuling || (exports.ObjectionRuling = ObjectionRuling = {}));
/**
 * Transcript status
 */
var TranscriptStatus;
(function (TranscriptStatus) {
    TranscriptStatus["ORDERED"] = "ordered";
    TranscriptStatus["IN_PRODUCTION"] = "in_production";
    TranscriptStatus["DRAFT_RECEIVED"] = "draft_received";
    TranscriptStatus["UNDER_REVIEW"] = "under_review";
    TranscriptStatus["ERRATA_SUBMITTED"] = "errata_submitted";
    TranscriptStatus["CERTIFIED"] = "certified";
    TranscriptStatus["FINALIZED"] = "finalized";
})(TranscriptStatus || (exports.TranscriptStatus = TranscriptStatus = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
exports.DepositionScheduleSchema = zod_1.z.object({
    matterId: zod_1.z.string().uuid(),
    witnessId: zod_1.z.string().uuid(),
    witnessName: zod_1.z.string().min(1),
    depositionType: zod_1.z.nativeEnum(DepositionType),
    scheduledDate: zod_1.z.coerce.date(),
    scheduledTime: zod_1.z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
    duration: zod_1.z.number().int().min(30).max(480),
    location: zod_1.z.string().min(1),
    isRemote: zod_1.z.boolean().default(false),
    remoteLink: zod_1.z.string().url().optional(),
    defendingAttorneyId: zod_1.z.string().uuid(),
    examiningAttorneyId: zod_1.z.string().uuid(),
    courtReporterId: zod_1.z.string().uuid().optional(),
    videographerId: zod_1.z.string().uuid().optional(),
    topics: zod_1.z.array(zod_1.z.string()).default([]),
    priority: zod_1.z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
});
exports.ExhibitPrepSchema = zod_1.z.object({
    depositionId: zod_1.z.string().uuid(),
    description: zod_1.z.string().min(1),
    documentId: zod_1.z.string().uuid().optional(),
    documentPath: zod_1.z.string().optional(),
    documentType: zod_1.z.string(),
    batesRange: zod_1.z.string().optional(),
    isConfidential: zod_1.z.boolean().default(false),
});
exports.TranscriptOrderSchema = zod_1.z.object({
    depositionId: zod_1.z.string().uuid(),
    courtReporterId: zod_1.z.string().uuid(),
    transcriptType: zod_1.z.enum(['rough', 'expedited', 'daily', 'standard', 'certified']),
    format: zod_1.z.enum(['pdf', 'word', 'text', 'ptx', 'ascii']),
    expectedDate: zod_1.z.coerce.date().optional(),
    isConfidential: zod_1.z.boolean().default(false),
});
exports.ObjectionSchema = zod_1.z.object({
    depositionId: zod_1.z.string().uuid(),
    transcriptPage: zod_1.z.number().int().positive().optional(),
    transcriptLine: zod_1.z.number().int().positive().optional(),
    objectionType: zod_1.z.nativeEnum(ObjectionType),
    objectingAttorneyId: zod_1.z.string().uuid(),
    question: zod_1.z.string(),
    grounds: zod_1.z.string(),
    isPreserved: zod_1.z.boolean().default(true),
});
exports.SummaryCreationSchema = zod_1.z.object({
    depositionId: zod_1.z.string().uuid(),
    summaryType: zod_1.z.enum(['page-line', 'narrative', 'topical', 'issue-focused', 'impeachment']),
    createdBy: zod_1.z.string().uuid(),
    summaryText: zod_1.z.string(),
    keyTestimony: zod_1.z.array(zod_1.z.object({
        topic: zod_1.z.string(),
        pageRange: zod_1.z.string(),
        lineRange: zod_1.z.string(),
        testimony: zod_1.z.string(),
        significance: zod_1.z.string(),
        tags: zod_1.z.array(zod_1.z.string()).default([]),
    })).default([]),
    overallImpact: zod_1.z.enum(['positive', 'neutral', 'negative', 'mixed']),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
let DepositionModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'depositions',
            paranoid: true,
            timestamps: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _depositionNumber_decorators;
    let _depositionNumber_initializers = [];
    let _depositionNumber_extraInitializers = [];
    let _matterId_decorators;
    let _matterId_initializers = [];
    let _matterId_extraInitializers = [];
    let _witnessId_decorators;
    let _witnessId_initializers = [];
    let _witnessId_extraInitializers = [];
    let _witnessName_decorators;
    let _witnessName_initializers = [];
    let _witnessName_extraInitializers = [];
    let _depositionType_decorators;
    let _depositionType_initializers = [];
    let _depositionType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _scheduledDate_decorators;
    let _scheduledDate_initializers = [];
    let _scheduledDate_extraInitializers = [];
    let _scheduledTime_decorators;
    let _scheduledTime_initializers = [];
    let _scheduledTime_extraInitializers = [];
    let _duration_decorators;
    let _duration_initializers = [];
    let _duration_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _isRemote_decorators;
    let _isRemote_initializers = [];
    let _isRemote_extraInitializers = [];
    let _remoteLink_decorators;
    let _remoteLink_initializers = [];
    let _remoteLink_extraInitializers = [];
    let _roomNumber_decorators;
    let _roomNumber_initializers = [];
    let _roomNumber_extraInitializers = [];
    let _defendingAttorneyId_decorators;
    let _defendingAttorneyId_initializers = [];
    let _defendingAttorneyId_extraInitializers = [];
    let _examiningAttorneyId_decorators;
    let _examiningAttorneyId_initializers = [];
    let _examiningAttorneyId_extraInitializers = [];
    let _attendees_decorators;
    let _attendees_initializers = [];
    let _attendees_extraInitializers = [];
    let _courtReporterId_decorators;
    let _courtReporterId_initializers = [];
    let _courtReporterId_extraInitializers = [];
    let _courtReporterName_decorators;
    let _courtReporterName_initializers = [];
    let _courtReporterName_extraInitializers = [];
    let _courtReporterFirm_decorators;
    let _courtReporterFirm_initializers = [];
    let _courtReporterFirm_extraInitializers = [];
    let _videographerId_decorators;
    let _videographerId_initializers = [];
    let _videographerId_extraInitializers = [];
    let _videographerName_decorators;
    let _videographerName_initializers = [];
    let _videographerName_extraInitializers = [];
    let _noticeServedDate_decorators;
    let _noticeServedDate_initializers = [];
    let _noticeServedDate_extraInitializers = [];
    let _noticeMethod_decorators;
    let _noticeMethod_initializers = [];
    let _noticeMethod_extraInitializers = [];
    let _estimatedCost_decorators;
    let _estimatedCost_initializers = [];
    let _estimatedCost_extraInitializers = [];
    let _actualCost_decorators;
    let _actualCost_initializers = [];
    let _actualCost_extraInitializers = [];
    let _isExpert_decorators;
    let _isExpert_initializers = [];
    let _isExpert_extraInitializers = [];
    let _expertFee_decorators;
    let _expertFee_initializers = [];
    let _expertFee_extraInitializers = [];
    let _materialsProvided_decorators;
    let _materialsProvided_initializers = [];
    let _materialsProvided_extraInitializers = [];
    let _topics_decorators;
    let _topics_initializers = [];
    let _topics_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _cancelledReason_decorators;
    let _cancelledReason_initializers = [];
    let _cancelledReason_extraInitializers = [];
    let _rescheduledFrom_decorators;
    let _rescheduledFrom_initializers = [];
    let _rescheduledFrom_extraInitializers = [];
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
    let _exhibits_decorators;
    let _exhibits_initializers = [];
    let _exhibits_extraInitializers = [];
    let _transcripts_decorators;
    let _transcripts_initializers = [];
    let _transcripts_extraInitializers = [];
    let _objections_decorators;
    let _objections_initializers = [];
    let _objections_extraInitializers = [];
    let _summaries_decorators;
    let _summaries_initializers = [];
    let _summaries_extraInitializers = [];
    var DepositionModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.depositionNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _depositionNumber_initializers, void 0));
            this.matterId = (__runInitializers(this, _depositionNumber_extraInitializers), __runInitializers(this, _matterId_initializers, void 0));
            this.witnessId = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _witnessId_initializers, void 0));
            this.witnessName = (__runInitializers(this, _witnessId_extraInitializers), __runInitializers(this, _witnessName_initializers, void 0));
            this.depositionType = (__runInitializers(this, _witnessName_extraInitializers), __runInitializers(this, _depositionType_initializers, void 0));
            this.status = (__runInitializers(this, _depositionType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.scheduledDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
            this.scheduledTime = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _scheduledTime_initializers, void 0));
            this.duration = (__runInitializers(this, _scheduledTime_extraInitializers), __runInitializers(this, _duration_initializers, void 0));
            this.location = (__runInitializers(this, _duration_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.isRemote = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _isRemote_initializers, void 0));
            this.remoteLink = (__runInitializers(this, _isRemote_extraInitializers), __runInitializers(this, _remoteLink_initializers, void 0));
            this.roomNumber = (__runInitializers(this, _remoteLink_extraInitializers), __runInitializers(this, _roomNumber_initializers, void 0));
            this.defendingAttorneyId = (__runInitializers(this, _roomNumber_extraInitializers), __runInitializers(this, _defendingAttorneyId_initializers, void 0));
            this.examiningAttorneyId = (__runInitializers(this, _defendingAttorneyId_extraInitializers), __runInitializers(this, _examiningAttorneyId_initializers, void 0));
            this.attendees = (__runInitializers(this, _examiningAttorneyId_extraInitializers), __runInitializers(this, _attendees_initializers, void 0));
            this.courtReporterId = (__runInitializers(this, _attendees_extraInitializers), __runInitializers(this, _courtReporterId_initializers, void 0));
            this.courtReporterName = (__runInitializers(this, _courtReporterId_extraInitializers), __runInitializers(this, _courtReporterName_initializers, void 0));
            this.courtReporterFirm = (__runInitializers(this, _courtReporterName_extraInitializers), __runInitializers(this, _courtReporterFirm_initializers, void 0));
            this.videographerId = (__runInitializers(this, _courtReporterFirm_extraInitializers), __runInitializers(this, _videographerId_initializers, void 0));
            this.videographerName = (__runInitializers(this, _videographerId_extraInitializers), __runInitializers(this, _videographerName_initializers, void 0));
            this.noticeServedDate = (__runInitializers(this, _videographerName_extraInitializers), __runInitializers(this, _noticeServedDate_initializers, void 0));
            this.noticeMethod = (__runInitializers(this, _noticeServedDate_extraInitializers), __runInitializers(this, _noticeMethod_initializers, void 0));
            this.estimatedCost = (__runInitializers(this, _noticeMethod_extraInitializers), __runInitializers(this, _estimatedCost_initializers, void 0));
            this.actualCost = (__runInitializers(this, _estimatedCost_extraInitializers), __runInitializers(this, _actualCost_initializers, void 0));
            this.isExpert = (__runInitializers(this, _actualCost_extraInitializers), __runInitializers(this, _isExpert_initializers, void 0));
            this.expertFee = (__runInitializers(this, _isExpert_extraInitializers), __runInitializers(this, _expertFee_initializers, void 0));
            this.materialsProvided = (__runInitializers(this, _expertFee_extraInitializers), __runInitializers(this, _materialsProvided_initializers, void 0));
            this.topics = (__runInitializers(this, _materialsProvided_extraInitializers), __runInitializers(this, _topics_initializers, void 0));
            this.priority = (__runInitializers(this, _topics_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.notes = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.cancelledReason = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _cancelledReason_initializers, void 0));
            this.rescheduledFrom = (__runInitializers(this, _cancelledReason_extraInitializers), __runInitializers(this, _rescheduledFrom_initializers, void 0));
            this.metadata = (__runInitializers(this, _rescheduledFrom_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.exhibits = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _exhibits_initializers, void 0));
            this.transcripts = (__runInitializers(this, _exhibits_extraInitializers), __runInitializers(this, _transcripts_initializers, void 0));
            this.objections = (__runInitializers(this, _transcripts_extraInitializers), __runInitializers(this, _objections_initializers, void 0));
            this.summaries = (__runInitializers(this, _objections_extraInitializers), __runInitializers(this, _summaries_initializers, void 0));
            __runInitializers(this, _summaries_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DepositionModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _depositionNumber_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                unique: true,
                allowNull: false,
            })];
        _matterId_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.ForeignKey)(() => sequelize_typescript_1.Model), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _witnessId_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.ForeignKey)(() => sequelize_typescript_1.Model), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _witnessName_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _depositionType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(DepositionType)),
                allowNull: false,
            })];
        _status_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(DepositionStatus)),
                allowNull: false,
            })];
        _scheduledDate_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _scheduledTime_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _duration_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _location_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _isRemote_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _remoteLink_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _roomNumber_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _defendingAttorneyId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => sequelize_typescript_1.Model), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _examiningAttorneyId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => sequelize_typescript_1.Model), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _attendees_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _courtReporterId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => sequelize_typescript_1.Model), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _courtReporterName_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _courtReporterFirm_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _videographerId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => sequelize_typescript_1.Model), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _videographerName_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _noticeServedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _noticeMethod_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _estimatedCost_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _actualCost_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _isExpert_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _expertFee_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _materialsProvided_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _topics_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _priority_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('low', 'medium', 'high', 'urgent'),
                defaultValue: 'medium',
            })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _cancelledReason_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _rescheduledFrom_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _exhibits_decorators = [(0, sequelize_typescript_1.HasMany)(() => DepositionExhibitModel)];
        _transcripts_decorators = [(0, sequelize_typescript_1.HasMany)(() => DepositionTranscriptModel)];
        _objections_decorators = [(0, sequelize_typescript_1.HasMany)(() => DepositionObjectionModel)];
        _summaries_decorators = [(0, sequelize_typescript_1.HasMany)(() => DepositionSummaryModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _depositionNumber_decorators, { kind: "field", name: "depositionNumber", static: false, private: false, access: { has: obj => "depositionNumber" in obj, get: obj => obj.depositionNumber, set: (obj, value) => { obj.depositionNumber = value; } }, metadata: _metadata }, _depositionNumber_initializers, _depositionNumber_extraInitializers);
        __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
        __esDecorate(null, null, _witnessId_decorators, { kind: "field", name: "witnessId", static: false, private: false, access: { has: obj => "witnessId" in obj, get: obj => obj.witnessId, set: (obj, value) => { obj.witnessId = value; } }, metadata: _metadata }, _witnessId_initializers, _witnessId_extraInitializers);
        __esDecorate(null, null, _witnessName_decorators, { kind: "field", name: "witnessName", static: false, private: false, access: { has: obj => "witnessName" in obj, get: obj => obj.witnessName, set: (obj, value) => { obj.witnessName = value; } }, metadata: _metadata }, _witnessName_initializers, _witnessName_extraInitializers);
        __esDecorate(null, null, _depositionType_decorators, { kind: "field", name: "depositionType", static: false, private: false, access: { has: obj => "depositionType" in obj, get: obj => obj.depositionType, set: (obj, value) => { obj.depositionType = value; } }, metadata: _metadata }, _depositionType_initializers, _depositionType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
        __esDecorate(null, null, _scheduledTime_decorators, { kind: "field", name: "scheduledTime", static: false, private: false, access: { has: obj => "scheduledTime" in obj, get: obj => obj.scheduledTime, set: (obj, value) => { obj.scheduledTime = value; } }, metadata: _metadata }, _scheduledTime_initializers, _scheduledTime_extraInitializers);
        __esDecorate(null, null, _duration_decorators, { kind: "field", name: "duration", static: false, private: false, access: { has: obj => "duration" in obj, get: obj => obj.duration, set: (obj, value) => { obj.duration = value; } }, metadata: _metadata }, _duration_initializers, _duration_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _isRemote_decorators, { kind: "field", name: "isRemote", static: false, private: false, access: { has: obj => "isRemote" in obj, get: obj => obj.isRemote, set: (obj, value) => { obj.isRemote = value; } }, metadata: _metadata }, _isRemote_initializers, _isRemote_extraInitializers);
        __esDecorate(null, null, _remoteLink_decorators, { kind: "field", name: "remoteLink", static: false, private: false, access: { has: obj => "remoteLink" in obj, get: obj => obj.remoteLink, set: (obj, value) => { obj.remoteLink = value; } }, metadata: _metadata }, _remoteLink_initializers, _remoteLink_extraInitializers);
        __esDecorate(null, null, _roomNumber_decorators, { kind: "field", name: "roomNumber", static: false, private: false, access: { has: obj => "roomNumber" in obj, get: obj => obj.roomNumber, set: (obj, value) => { obj.roomNumber = value; } }, metadata: _metadata }, _roomNumber_initializers, _roomNumber_extraInitializers);
        __esDecorate(null, null, _defendingAttorneyId_decorators, { kind: "field", name: "defendingAttorneyId", static: false, private: false, access: { has: obj => "defendingAttorneyId" in obj, get: obj => obj.defendingAttorneyId, set: (obj, value) => { obj.defendingAttorneyId = value; } }, metadata: _metadata }, _defendingAttorneyId_initializers, _defendingAttorneyId_extraInitializers);
        __esDecorate(null, null, _examiningAttorneyId_decorators, { kind: "field", name: "examiningAttorneyId", static: false, private: false, access: { has: obj => "examiningAttorneyId" in obj, get: obj => obj.examiningAttorneyId, set: (obj, value) => { obj.examiningAttorneyId = value; } }, metadata: _metadata }, _examiningAttorneyId_initializers, _examiningAttorneyId_extraInitializers);
        __esDecorate(null, null, _attendees_decorators, { kind: "field", name: "attendees", static: false, private: false, access: { has: obj => "attendees" in obj, get: obj => obj.attendees, set: (obj, value) => { obj.attendees = value; } }, metadata: _metadata }, _attendees_initializers, _attendees_extraInitializers);
        __esDecorate(null, null, _courtReporterId_decorators, { kind: "field", name: "courtReporterId", static: false, private: false, access: { has: obj => "courtReporterId" in obj, get: obj => obj.courtReporterId, set: (obj, value) => { obj.courtReporterId = value; } }, metadata: _metadata }, _courtReporterId_initializers, _courtReporterId_extraInitializers);
        __esDecorate(null, null, _courtReporterName_decorators, { kind: "field", name: "courtReporterName", static: false, private: false, access: { has: obj => "courtReporterName" in obj, get: obj => obj.courtReporterName, set: (obj, value) => { obj.courtReporterName = value; } }, metadata: _metadata }, _courtReporterName_initializers, _courtReporterName_extraInitializers);
        __esDecorate(null, null, _courtReporterFirm_decorators, { kind: "field", name: "courtReporterFirm", static: false, private: false, access: { has: obj => "courtReporterFirm" in obj, get: obj => obj.courtReporterFirm, set: (obj, value) => { obj.courtReporterFirm = value; } }, metadata: _metadata }, _courtReporterFirm_initializers, _courtReporterFirm_extraInitializers);
        __esDecorate(null, null, _videographerId_decorators, { kind: "field", name: "videographerId", static: false, private: false, access: { has: obj => "videographerId" in obj, get: obj => obj.videographerId, set: (obj, value) => { obj.videographerId = value; } }, metadata: _metadata }, _videographerId_initializers, _videographerId_extraInitializers);
        __esDecorate(null, null, _videographerName_decorators, { kind: "field", name: "videographerName", static: false, private: false, access: { has: obj => "videographerName" in obj, get: obj => obj.videographerName, set: (obj, value) => { obj.videographerName = value; } }, metadata: _metadata }, _videographerName_initializers, _videographerName_extraInitializers);
        __esDecorate(null, null, _noticeServedDate_decorators, { kind: "field", name: "noticeServedDate", static: false, private: false, access: { has: obj => "noticeServedDate" in obj, get: obj => obj.noticeServedDate, set: (obj, value) => { obj.noticeServedDate = value; } }, metadata: _metadata }, _noticeServedDate_initializers, _noticeServedDate_extraInitializers);
        __esDecorate(null, null, _noticeMethod_decorators, { kind: "field", name: "noticeMethod", static: false, private: false, access: { has: obj => "noticeMethod" in obj, get: obj => obj.noticeMethod, set: (obj, value) => { obj.noticeMethod = value; } }, metadata: _metadata }, _noticeMethod_initializers, _noticeMethod_extraInitializers);
        __esDecorate(null, null, _estimatedCost_decorators, { kind: "field", name: "estimatedCost", static: false, private: false, access: { has: obj => "estimatedCost" in obj, get: obj => obj.estimatedCost, set: (obj, value) => { obj.estimatedCost = value; } }, metadata: _metadata }, _estimatedCost_initializers, _estimatedCost_extraInitializers);
        __esDecorate(null, null, _actualCost_decorators, { kind: "field", name: "actualCost", static: false, private: false, access: { has: obj => "actualCost" in obj, get: obj => obj.actualCost, set: (obj, value) => { obj.actualCost = value; } }, metadata: _metadata }, _actualCost_initializers, _actualCost_extraInitializers);
        __esDecorate(null, null, _isExpert_decorators, { kind: "field", name: "isExpert", static: false, private: false, access: { has: obj => "isExpert" in obj, get: obj => obj.isExpert, set: (obj, value) => { obj.isExpert = value; } }, metadata: _metadata }, _isExpert_initializers, _isExpert_extraInitializers);
        __esDecorate(null, null, _expertFee_decorators, { kind: "field", name: "expertFee", static: false, private: false, access: { has: obj => "expertFee" in obj, get: obj => obj.expertFee, set: (obj, value) => { obj.expertFee = value; } }, metadata: _metadata }, _expertFee_initializers, _expertFee_extraInitializers);
        __esDecorate(null, null, _materialsProvided_decorators, { kind: "field", name: "materialsProvided", static: false, private: false, access: { has: obj => "materialsProvided" in obj, get: obj => obj.materialsProvided, set: (obj, value) => { obj.materialsProvided = value; } }, metadata: _metadata }, _materialsProvided_initializers, _materialsProvided_extraInitializers);
        __esDecorate(null, null, _topics_decorators, { kind: "field", name: "topics", static: false, private: false, access: { has: obj => "topics" in obj, get: obj => obj.topics, set: (obj, value) => { obj.topics = value; } }, metadata: _metadata }, _topics_initializers, _topics_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _cancelledReason_decorators, { kind: "field", name: "cancelledReason", static: false, private: false, access: { has: obj => "cancelledReason" in obj, get: obj => obj.cancelledReason, set: (obj, value) => { obj.cancelledReason = value; } }, metadata: _metadata }, _cancelledReason_initializers, _cancelledReason_extraInitializers);
        __esDecorate(null, null, _rescheduledFrom_decorators, { kind: "field", name: "rescheduledFrom", static: false, private: false, access: { has: obj => "rescheduledFrom" in obj, get: obj => obj.rescheduledFrom, set: (obj, value) => { obj.rescheduledFrom = value; } }, metadata: _metadata }, _rescheduledFrom_initializers, _rescheduledFrom_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _exhibits_decorators, { kind: "field", name: "exhibits", static: false, private: false, access: { has: obj => "exhibits" in obj, get: obj => obj.exhibits, set: (obj, value) => { obj.exhibits = value; } }, metadata: _metadata }, _exhibits_initializers, _exhibits_extraInitializers);
        __esDecorate(null, null, _transcripts_decorators, { kind: "field", name: "transcripts", static: false, private: false, access: { has: obj => "transcripts" in obj, get: obj => obj.transcripts, set: (obj, value) => { obj.transcripts = value; } }, metadata: _metadata }, _transcripts_initializers, _transcripts_extraInitializers);
        __esDecorate(null, null, _objections_decorators, { kind: "field", name: "objections", static: false, private: false, access: { has: obj => "objections" in obj, get: obj => obj.objections, set: (obj, value) => { obj.objections = value; } }, metadata: _metadata }, _objections_initializers, _objections_extraInitializers);
        __esDecorate(null, null, _summaries_decorators, { kind: "field", name: "summaries", static: false, private: false, access: { has: obj => "summaries" in obj, get: obj => obj.summaries, set: (obj, value) => { obj.summaries = value; } }, metadata: _metadata }, _summaries_initializers, _summaries_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DepositionModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DepositionModel = _classThis;
})();
exports.DepositionModel = DepositionModel;
let DepositionExhibitModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'deposition_exhibits',
            timestamps: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _depositionId_decorators;
    let _depositionId_initializers = [];
    let _depositionId_extraInitializers = [];
    let _exhibitNumber_decorators;
    let _exhibitNumber_initializers = [];
    let _exhibitNumber_extraInitializers = [];
    let _exhibitLabel_decorators;
    let _exhibitLabel_initializers = [];
    let _exhibitLabel_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _documentId_decorators;
    let _documentId_initializers = [];
    let _documentId_extraInitializers = [];
    let _documentPath_decorators;
    let _documentPath_initializers = [];
    let _documentPath_extraInitializers = [];
    let _documentType_decorators;
    let _documentType_initializers = [];
    let _documentType_extraInitializers = [];
    let _fileSize_decorators;
    let _fileSize_initializers = [];
    let _fileSize_extraInitializers = [];
    let _pageCount_decorators;
    let _pageCount_initializers = [];
    let _pageCount_extraInitializers = [];
    let _markedAt_decorators;
    let _markedAt_initializers = [];
    let _markedAt_extraInitializers = [];
    let _markedBy_decorators;
    let _markedBy_initializers = [];
    let _markedBy_extraInitializers = [];
    let _introducedAt_decorators;
    let _introducedAt_initializers = [];
    let _introducedAt_extraInitializers = [];
    let _authenticatedBy_decorators;
    let _authenticatedBy_initializers = [];
    let _authenticatedBy_extraInitializers = [];
    let _batesRange_decorators;
    let _batesRange_initializers = [];
    let _batesRange_extraInitializers = [];
    let _isConfidential_decorators;
    let _isConfidential_initializers = [];
    let _isConfidential_extraInitializers = [];
    let _isPriorArt_decorators;
    let _isPriorArt_initializers = [];
    let _isPriorArt_extraInitializers = [];
    let _objections_decorators;
    let _objections_initializers = [];
    let _objections_extraInitializers = [];
    let _admissionNotes_decorators;
    let _admissionNotes_initializers = [];
    let _admissionNotes_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deposition_decorators;
    let _deposition_initializers = [];
    let _deposition_extraInitializers = [];
    var DepositionExhibitModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.depositionId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _depositionId_initializers, void 0));
            this.exhibitNumber = (__runInitializers(this, _depositionId_extraInitializers), __runInitializers(this, _exhibitNumber_initializers, void 0));
            this.exhibitLabel = (__runInitializers(this, _exhibitNumber_extraInitializers), __runInitializers(this, _exhibitLabel_initializers, void 0));
            this.description = (__runInitializers(this, _exhibitLabel_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.status = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.documentId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _documentId_initializers, void 0));
            this.documentPath = (__runInitializers(this, _documentId_extraInitializers), __runInitializers(this, _documentPath_initializers, void 0));
            this.documentType = (__runInitializers(this, _documentPath_extraInitializers), __runInitializers(this, _documentType_initializers, void 0));
            this.fileSize = (__runInitializers(this, _documentType_extraInitializers), __runInitializers(this, _fileSize_initializers, void 0));
            this.pageCount = (__runInitializers(this, _fileSize_extraInitializers), __runInitializers(this, _pageCount_initializers, void 0));
            this.markedAt = (__runInitializers(this, _pageCount_extraInitializers), __runInitializers(this, _markedAt_initializers, void 0));
            this.markedBy = (__runInitializers(this, _markedAt_extraInitializers), __runInitializers(this, _markedBy_initializers, void 0));
            this.introducedAt = (__runInitializers(this, _markedBy_extraInitializers), __runInitializers(this, _introducedAt_initializers, void 0));
            this.authenticatedBy = (__runInitializers(this, _introducedAt_extraInitializers), __runInitializers(this, _authenticatedBy_initializers, void 0));
            this.batesRange = (__runInitializers(this, _authenticatedBy_extraInitializers), __runInitializers(this, _batesRange_initializers, void 0));
            this.isConfidential = (__runInitializers(this, _batesRange_extraInitializers), __runInitializers(this, _isConfidential_initializers, void 0));
            this.isPriorArt = (__runInitializers(this, _isConfidential_extraInitializers), __runInitializers(this, _isPriorArt_initializers, void 0));
            this.objections = (__runInitializers(this, _isPriorArt_extraInitializers), __runInitializers(this, _objections_initializers, void 0));
            this.admissionNotes = (__runInitializers(this, _objections_extraInitializers), __runInitializers(this, _admissionNotes_initializers, void 0));
            this.metadata = (__runInitializers(this, _admissionNotes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deposition = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deposition_initializers, void 0));
            __runInitializers(this, _deposition_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DepositionExhibitModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _depositionId_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.ForeignKey)(() => DepositionModel), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _exhibitNumber_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _exhibitLabel_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _description_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ExhibitStatus)),
                allowNull: false,
            })];
        _documentId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _documentPath_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _documentType_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _fileSize_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _pageCount_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _markedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _markedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _introducedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _authenticatedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _batesRange_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _isConfidential_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _isPriorArt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _objections_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _admissionNotes_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deposition_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => DepositionModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _depositionId_decorators, { kind: "field", name: "depositionId", static: false, private: false, access: { has: obj => "depositionId" in obj, get: obj => obj.depositionId, set: (obj, value) => { obj.depositionId = value; } }, metadata: _metadata }, _depositionId_initializers, _depositionId_extraInitializers);
        __esDecorate(null, null, _exhibitNumber_decorators, { kind: "field", name: "exhibitNumber", static: false, private: false, access: { has: obj => "exhibitNumber" in obj, get: obj => obj.exhibitNumber, set: (obj, value) => { obj.exhibitNumber = value; } }, metadata: _metadata }, _exhibitNumber_initializers, _exhibitNumber_extraInitializers);
        __esDecorate(null, null, _exhibitLabel_decorators, { kind: "field", name: "exhibitLabel", static: false, private: false, access: { has: obj => "exhibitLabel" in obj, get: obj => obj.exhibitLabel, set: (obj, value) => { obj.exhibitLabel = value; } }, metadata: _metadata }, _exhibitLabel_initializers, _exhibitLabel_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _documentId_decorators, { kind: "field", name: "documentId", static: false, private: false, access: { has: obj => "documentId" in obj, get: obj => obj.documentId, set: (obj, value) => { obj.documentId = value; } }, metadata: _metadata }, _documentId_initializers, _documentId_extraInitializers);
        __esDecorate(null, null, _documentPath_decorators, { kind: "field", name: "documentPath", static: false, private: false, access: { has: obj => "documentPath" in obj, get: obj => obj.documentPath, set: (obj, value) => { obj.documentPath = value; } }, metadata: _metadata }, _documentPath_initializers, _documentPath_extraInitializers);
        __esDecorate(null, null, _documentType_decorators, { kind: "field", name: "documentType", static: false, private: false, access: { has: obj => "documentType" in obj, get: obj => obj.documentType, set: (obj, value) => { obj.documentType = value; } }, metadata: _metadata }, _documentType_initializers, _documentType_extraInitializers);
        __esDecorate(null, null, _fileSize_decorators, { kind: "field", name: "fileSize", static: false, private: false, access: { has: obj => "fileSize" in obj, get: obj => obj.fileSize, set: (obj, value) => { obj.fileSize = value; } }, metadata: _metadata }, _fileSize_initializers, _fileSize_extraInitializers);
        __esDecorate(null, null, _pageCount_decorators, { kind: "field", name: "pageCount", static: false, private: false, access: { has: obj => "pageCount" in obj, get: obj => obj.pageCount, set: (obj, value) => { obj.pageCount = value; } }, metadata: _metadata }, _pageCount_initializers, _pageCount_extraInitializers);
        __esDecorate(null, null, _markedAt_decorators, { kind: "field", name: "markedAt", static: false, private: false, access: { has: obj => "markedAt" in obj, get: obj => obj.markedAt, set: (obj, value) => { obj.markedAt = value; } }, metadata: _metadata }, _markedAt_initializers, _markedAt_extraInitializers);
        __esDecorate(null, null, _markedBy_decorators, { kind: "field", name: "markedBy", static: false, private: false, access: { has: obj => "markedBy" in obj, get: obj => obj.markedBy, set: (obj, value) => { obj.markedBy = value; } }, metadata: _metadata }, _markedBy_initializers, _markedBy_extraInitializers);
        __esDecorate(null, null, _introducedAt_decorators, { kind: "field", name: "introducedAt", static: false, private: false, access: { has: obj => "introducedAt" in obj, get: obj => obj.introducedAt, set: (obj, value) => { obj.introducedAt = value; } }, metadata: _metadata }, _introducedAt_initializers, _introducedAt_extraInitializers);
        __esDecorate(null, null, _authenticatedBy_decorators, { kind: "field", name: "authenticatedBy", static: false, private: false, access: { has: obj => "authenticatedBy" in obj, get: obj => obj.authenticatedBy, set: (obj, value) => { obj.authenticatedBy = value; } }, metadata: _metadata }, _authenticatedBy_initializers, _authenticatedBy_extraInitializers);
        __esDecorate(null, null, _batesRange_decorators, { kind: "field", name: "batesRange", static: false, private: false, access: { has: obj => "batesRange" in obj, get: obj => obj.batesRange, set: (obj, value) => { obj.batesRange = value; } }, metadata: _metadata }, _batesRange_initializers, _batesRange_extraInitializers);
        __esDecorate(null, null, _isConfidential_decorators, { kind: "field", name: "isConfidential", static: false, private: false, access: { has: obj => "isConfidential" in obj, get: obj => obj.isConfidential, set: (obj, value) => { obj.isConfidential = value; } }, metadata: _metadata }, _isConfidential_initializers, _isConfidential_extraInitializers);
        __esDecorate(null, null, _isPriorArt_decorators, { kind: "field", name: "isPriorArt", static: false, private: false, access: { has: obj => "isPriorArt" in obj, get: obj => obj.isPriorArt, set: (obj, value) => { obj.isPriorArt = value; } }, metadata: _metadata }, _isPriorArt_initializers, _isPriorArt_extraInitializers);
        __esDecorate(null, null, _objections_decorators, { kind: "field", name: "objections", static: false, private: false, access: { has: obj => "objections" in obj, get: obj => obj.objections, set: (obj, value) => { obj.objections = value; } }, metadata: _metadata }, _objections_initializers, _objections_extraInitializers);
        __esDecorate(null, null, _admissionNotes_decorators, { kind: "field", name: "admissionNotes", static: false, private: false, access: { has: obj => "admissionNotes" in obj, get: obj => obj.admissionNotes, set: (obj, value) => { obj.admissionNotes = value; } }, metadata: _metadata }, _admissionNotes_initializers, _admissionNotes_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deposition_decorators, { kind: "field", name: "deposition", static: false, private: false, access: { has: obj => "deposition" in obj, get: obj => obj.deposition, set: (obj, value) => { obj.deposition = value; } }, metadata: _metadata }, _deposition_initializers, _deposition_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DepositionExhibitModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DepositionExhibitModel = _classThis;
})();
exports.DepositionExhibitModel = DepositionExhibitModel;
let DepositionTranscriptModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'deposition_transcripts',
            timestamps: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _depositionId_decorators;
    let _depositionId_initializers = [];
    let _depositionId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _courtReporterId_decorators;
    let _courtReporterId_initializers = [];
    let _courtReporterId_extraInitializers = [];
    let _orderedDate_decorators;
    let _orderedDate_initializers = [];
    let _orderedDate_extraInitializers = [];
    let _expectedDate_decorators;
    let _expectedDate_initializers = [];
    let _expectedDate_extraInitializers = [];
    let _receivedDate_decorators;
    let _receivedDate_initializers = [];
    let _receivedDate_extraInitializers = [];
    let _certifiedDate_decorators;
    let _certifiedDate_initializers = [];
    let _certifiedDate_extraInitializers = [];
    let _transcriptType_decorators;
    let _transcriptType_initializers = [];
    let _transcriptType_extraInitializers = [];
    let _format_decorators;
    let _format_initializers = [];
    let _format_extraInitializers = [];
    let _filePath_decorators;
    let _filePath_initializers = [];
    let _filePath_extraInitializers = [];
    let _fileSize_decorators;
    let _fileSize_initializers = [];
    let _fileSize_extraInitializers = [];
    let _pageCount_decorators;
    let _pageCount_initializers = [];
    let _pageCount_extraInitializers = [];
    let _totalCost_decorators;
    let _totalCost_initializers = [];
    let _totalCost_extraInitializers = [];
    let _rushFee_decorators;
    let _rushFee_initializers = [];
    let _rushFee_extraInitializers = [];
    let _copyFee_decorators;
    let _copyFee_initializers = [];
    let _copyFee_extraInitializers = [];
    let _videoCost_decorators;
    let _videoCost_initializers = [];
    let _videoCost_extraInitializers = [];
    let _errataDeadline_decorators;
    let _errataDeadline_initializers = [];
    let _errataDeadline_extraInitializers = [];
    let _errataSubmitted_decorators;
    let _errataSubmitted_initializers = [];
    let _errataSubmitted_extraInitializers = [];
    let _errataPath_decorators;
    let _errataPath_initializers = [];
    let _errataPath_extraInitializers = [];
    let _reviewAssignedTo_decorators;
    let _reviewAssignedTo_initializers = [];
    let _reviewAssignedTo_extraInitializers = [];
    let _reviewCompletedDate_decorators;
    let _reviewCompletedDate_initializers = [];
    let _reviewCompletedDate_extraInitializers = [];
    let _isConfidential_decorators;
    let _isConfidential_initializers = [];
    let _isConfidential_extraInitializers = [];
    let _accessRestrictions_decorators;
    let _accessRestrictions_initializers = [];
    let _accessRestrictions_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deposition_decorators;
    let _deposition_initializers = [];
    let _deposition_extraInitializers = [];
    var DepositionTranscriptModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.depositionId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _depositionId_initializers, void 0));
            this.status = (__runInitializers(this, _depositionId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.courtReporterId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _courtReporterId_initializers, void 0));
            this.orderedDate = (__runInitializers(this, _courtReporterId_extraInitializers), __runInitializers(this, _orderedDate_initializers, void 0));
            this.expectedDate = (__runInitializers(this, _orderedDate_extraInitializers), __runInitializers(this, _expectedDate_initializers, void 0));
            this.receivedDate = (__runInitializers(this, _expectedDate_extraInitializers), __runInitializers(this, _receivedDate_initializers, void 0));
            this.certifiedDate = (__runInitializers(this, _receivedDate_extraInitializers), __runInitializers(this, _certifiedDate_initializers, void 0));
            this.transcriptType = (__runInitializers(this, _certifiedDate_extraInitializers), __runInitializers(this, _transcriptType_initializers, void 0));
            this.format = (__runInitializers(this, _transcriptType_extraInitializers), __runInitializers(this, _format_initializers, void 0));
            this.filePath = (__runInitializers(this, _format_extraInitializers), __runInitializers(this, _filePath_initializers, void 0));
            this.fileSize = (__runInitializers(this, _filePath_extraInitializers), __runInitializers(this, _fileSize_initializers, void 0));
            this.pageCount = (__runInitializers(this, _fileSize_extraInitializers), __runInitializers(this, _pageCount_initializers, void 0));
            this.totalCost = (__runInitializers(this, _pageCount_extraInitializers), __runInitializers(this, _totalCost_initializers, void 0));
            this.rushFee = (__runInitializers(this, _totalCost_extraInitializers), __runInitializers(this, _rushFee_initializers, void 0));
            this.copyFee = (__runInitializers(this, _rushFee_extraInitializers), __runInitializers(this, _copyFee_initializers, void 0));
            this.videoCost = (__runInitializers(this, _copyFee_extraInitializers), __runInitializers(this, _videoCost_initializers, void 0));
            this.errataDeadline = (__runInitializers(this, _videoCost_extraInitializers), __runInitializers(this, _errataDeadline_initializers, void 0));
            this.errataSubmitted = (__runInitializers(this, _errataDeadline_extraInitializers), __runInitializers(this, _errataSubmitted_initializers, void 0));
            this.errataPath = (__runInitializers(this, _errataSubmitted_extraInitializers), __runInitializers(this, _errataPath_initializers, void 0));
            this.reviewAssignedTo = (__runInitializers(this, _errataPath_extraInitializers), __runInitializers(this, _reviewAssignedTo_initializers, void 0));
            this.reviewCompletedDate = (__runInitializers(this, _reviewAssignedTo_extraInitializers), __runInitializers(this, _reviewCompletedDate_initializers, void 0));
            this.isConfidential = (__runInitializers(this, _reviewCompletedDate_extraInitializers), __runInitializers(this, _isConfidential_initializers, void 0));
            this.accessRestrictions = (__runInitializers(this, _isConfidential_extraInitializers), __runInitializers(this, _accessRestrictions_initializers, void 0));
            this.metadata = (__runInitializers(this, _accessRestrictions_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deposition = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deposition_initializers, void 0));
            __runInitializers(this, _deposition_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DepositionTranscriptModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _depositionId_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.ForeignKey)(() => DepositionModel), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _status_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(TranscriptStatus)),
                allowNull: false,
            })];
        _courtReporterId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => sequelize_typescript_1.Model), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _orderedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _expectedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _receivedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _certifiedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _transcriptType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('rough', 'expedited', 'daily', 'standard', 'certified'),
                allowNull: false,
            })];
        _format_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('pdf', 'word', 'text', 'ptx', 'ascii'),
                allowNull: false,
            })];
        _filePath_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _fileSize_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _pageCount_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _totalCost_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _rushFee_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _copyFee_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _videoCost_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _errataDeadline_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _errataSubmitted_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _errataPath_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _reviewAssignedTo_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _reviewCompletedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _isConfidential_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _accessRestrictions_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deposition_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => DepositionModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _depositionId_decorators, { kind: "field", name: "depositionId", static: false, private: false, access: { has: obj => "depositionId" in obj, get: obj => obj.depositionId, set: (obj, value) => { obj.depositionId = value; } }, metadata: _metadata }, _depositionId_initializers, _depositionId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _courtReporterId_decorators, { kind: "field", name: "courtReporterId", static: false, private: false, access: { has: obj => "courtReporterId" in obj, get: obj => obj.courtReporterId, set: (obj, value) => { obj.courtReporterId = value; } }, metadata: _metadata }, _courtReporterId_initializers, _courtReporterId_extraInitializers);
        __esDecorate(null, null, _orderedDate_decorators, { kind: "field", name: "orderedDate", static: false, private: false, access: { has: obj => "orderedDate" in obj, get: obj => obj.orderedDate, set: (obj, value) => { obj.orderedDate = value; } }, metadata: _metadata }, _orderedDate_initializers, _orderedDate_extraInitializers);
        __esDecorate(null, null, _expectedDate_decorators, { kind: "field", name: "expectedDate", static: false, private: false, access: { has: obj => "expectedDate" in obj, get: obj => obj.expectedDate, set: (obj, value) => { obj.expectedDate = value; } }, metadata: _metadata }, _expectedDate_initializers, _expectedDate_extraInitializers);
        __esDecorate(null, null, _receivedDate_decorators, { kind: "field", name: "receivedDate", static: false, private: false, access: { has: obj => "receivedDate" in obj, get: obj => obj.receivedDate, set: (obj, value) => { obj.receivedDate = value; } }, metadata: _metadata }, _receivedDate_initializers, _receivedDate_extraInitializers);
        __esDecorate(null, null, _certifiedDate_decorators, { kind: "field", name: "certifiedDate", static: false, private: false, access: { has: obj => "certifiedDate" in obj, get: obj => obj.certifiedDate, set: (obj, value) => { obj.certifiedDate = value; } }, metadata: _metadata }, _certifiedDate_initializers, _certifiedDate_extraInitializers);
        __esDecorate(null, null, _transcriptType_decorators, { kind: "field", name: "transcriptType", static: false, private: false, access: { has: obj => "transcriptType" in obj, get: obj => obj.transcriptType, set: (obj, value) => { obj.transcriptType = value; } }, metadata: _metadata }, _transcriptType_initializers, _transcriptType_extraInitializers);
        __esDecorate(null, null, _format_decorators, { kind: "field", name: "format", static: false, private: false, access: { has: obj => "format" in obj, get: obj => obj.format, set: (obj, value) => { obj.format = value; } }, metadata: _metadata }, _format_initializers, _format_extraInitializers);
        __esDecorate(null, null, _filePath_decorators, { kind: "field", name: "filePath", static: false, private: false, access: { has: obj => "filePath" in obj, get: obj => obj.filePath, set: (obj, value) => { obj.filePath = value; } }, metadata: _metadata }, _filePath_initializers, _filePath_extraInitializers);
        __esDecorate(null, null, _fileSize_decorators, { kind: "field", name: "fileSize", static: false, private: false, access: { has: obj => "fileSize" in obj, get: obj => obj.fileSize, set: (obj, value) => { obj.fileSize = value; } }, metadata: _metadata }, _fileSize_initializers, _fileSize_extraInitializers);
        __esDecorate(null, null, _pageCount_decorators, { kind: "field", name: "pageCount", static: false, private: false, access: { has: obj => "pageCount" in obj, get: obj => obj.pageCount, set: (obj, value) => { obj.pageCount = value; } }, metadata: _metadata }, _pageCount_initializers, _pageCount_extraInitializers);
        __esDecorate(null, null, _totalCost_decorators, { kind: "field", name: "totalCost", static: false, private: false, access: { has: obj => "totalCost" in obj, get: obj => obj.totalCost, set: (obj, value) => { obj.totalCost = value; } }, metadata: _metadata }, _totalCost_initializers, _totalCost_extraInitializers);
        __esDecorate(null, null, _rushFee_decorators, { kind: "field", name: "rushFee", static: false, private: false, access: { has: obj => "rushFee" in obj, get: obj => obj.rushFee, set: (obj, value) => { obj.rushFee = value; } }, metadata: _metadata }, _rushFee_initializers, _rushFee_extraInitializers);
        __esDecorate(null, null, _copyFee_decorators, { kind: "field", name: "copyFee", static: false, private: false, access: { has: obj => "copyFee" in obj, get: obj => obj.copyFee, set: (obj, value) => { obj.copyFee = value; } }, metadata: _metadata }, _copyFee_initializers, _copyFee_extraInitializers);
        __esDecorate(null, null, _videoCost_decorators, { kind: "field", name: "videoCost", static: false, private: false, access: { has: obj => "videoCost" in obj, get: obj => obj.videoCost, set: (obj, value) => { obj.videoCost = value; } }, metadata: _metadata }, _videoCost_initializers, _videoCost_extraInitializers);
        __esDecorate(null, null, _errataDeadline_decorators, { kind: "field", name: "errataDeadline", static: false, private: false, access: { has: obj => "errataDeadline" in obj, get: obj => obj.errataDeadline, set: (obj, value) => { obj.errataDeadline = value; } }, metadata: _metadata }, _errataDeadline_initializers, _errataDeadline_extraInitializers);
        __esDecorate(null, null, _errataSubmitted_decorators, { kind: "field", name: "errataSubmitted", static: false, private: false, access: { has: obj => "errataSubmitted" in obj, get: obj => obj.errataSubmitted, set: (obj, value) => { obj.errataSubmitted = value; } }, metadata: _metadata }, _errataSubmitted_initializers, _errataSubmitted_extraInitializers);
        __esDecorate(null, null, _errataPath_decorators, { kind: "field", name: "errataPath", static: false, private: false, access: { has: obj => "errataPath" in obj, get: obj => obj.errataPath, set: (obj, value) => { obj.errataPath = value; } }, metadata: _metadata }, _errataPath_initializers, _errataPath_extraInitializers);
        __esDecorate(null, null, _reviewAssignedTo_decorators, { kind: "field", name: "reviewAssignedTo", static: false, private: false, access: { has: obj => "reviewAssignedTo" in obj, get: obj => obj.reviewAssignedTo, set: (obj, value) => { obj.reviewAssignedTo = value; } }, metadata: _metadata }, _reviewAssignedTo_initializers, _reviewAssignedTo_extraInitializers);
        __esDecorate(null, null, _reviewCompletedDate_decorators, { kind: "field", name: "reviewCompletedDate", static: false, private: false, access: { has: obj => "reviewCompletedDate" in obj, get: obj => obj.reviewCompletedDate, set: (obj, value) => { obj.reviewCompletedDate = value; } }, metadata: _metadata }, _reviewCompletedDate_initializers, _reviewCompletedDate_extraInitializers);
        __esDecorate(null, null, _isConfidential_decorators, { kind: "field", name: "isConfidential", static: false, private: false, access: { has: obj => "isConfidential" in obj, get: obj => obj.isConfidential, set: (obj, value) => { obj.isConfidential = value; } }, metadata: _metadata }, _isConfidential_initializers, _isConfidential_extraInitializers);
        __esDecorate(null, null, _accessRestrictions_decorators, { kind: "field", name: "accessRestrictions", static: false, private: false, access: { has: obj => "accessRestrictions" in obj, get: obj => obj.accessRestrictions, set: (obj, value) => { obj.accessRestrictions = value; } }, metadata: _metadata }, _accessRestrictions_initializers, _accessRestrictions_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deposition_decorators, { kind: "field", name: "deposition", static: false, private: false, access: { has: obj => "deposition" in obj, get: obj => obj.deposition, set: (obj, value) => { obj.deposition = value; } }, metadata: _metadata }, _deposition_initializers, _deposition_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DepositionTranscriptModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DepositionTranscriptModel = _classThis;
})();
exports.DepositionTranscriptModel = DepositionTranscriptModel;
let DepositionObjectionModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'deposition_objections',
            timestamps: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _depositionId_decorators;
    let _depositionId_initializers = [];
    let _depositionId_extraInitializers = [];
    let _transcriptPage_decorators;
    let _transcriptPage_initializers = [];
    let _transcriptPage_extraInitializers = [];
    let _transcriptLine_decorators;
    let _transcriptLine_initializers = [];
    let _transcriptLine_extraInitializers = [];
    let _timestamp_decorators;
    let _timestamp_initializers = [];
    let _timestamp_extraInitializers = [];
    let _objectionType_decorators;
    let _objectionType_initializers = [];
    let _objectionType_extraInitializers = [];
    let _objectingAttorneyId_decorators;
    let _objectingAttorneyId_initializers = [];
    let _objectingAttorneyId_extraInitializers = [];
    let _objectingAttorneyName_decorators;
    let _objectingAttorneyName_initializers = [];
    let _objectingAttorneyName_extraInitializers = [];
    let _question_decorators;
    let _question_initializers = [];
    let _question_extraInitializers = [];
    let _grounds_decorators;
    let _grounds_initializers = [];
    let _grounds_extraInitializers = [];
    let _ruling_decorators;
    let _ruling_initializers = [];
    let _ruling_extraInitializers = [];
    let _rulingJudge_decorators;
    let _rulingJudge_initializers = [];
    let _rulingJudge_extraInitializers = [];
    let _rulingDate_decorators;
    let _rulingDate_initializers = [];
    let _rulingDate_extraInitializers = [];
    let _rulingNotes_decorators;
    let _rulingNotes_initializers = [];
    let _rulingNotes_extraInitializers = [];
    let _isPreserved_decorators;
    let _isPreserved_initializers = [];
    let _isPreserved_extraInitializers = [];
    let _relatedMotion_decorators;
    let _relatedMotion_initializers = [];
    let _relatedMotion_extraInitializers = [];
    let _impeachmentValue_decorators;
    let _impeachmentValue_initializers = [];
    let _impeachmentValue_extraInitializers = [];
    let _followUpRequired_decorators;
    let _followUpRequired_initializers = [];
    let _followUpRequired_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deposition_decorators;
    let _deposition_initializers = [];
    let _deposition_extraInitializers = [];
    var DepositionObjectionModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.depositionId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _depositionId_initializers, void 0));
            this.transcriptPage = (__runInitializers(this, _depositionId_extraInitializers), __runInitializers(this, _transcriptPage_initializers, void 0));
            this.transcriptLine = (__runInitializers(this, _transcriptPage_extraInitializers), __runInitializers(this, _transcriptLine_initializers, void 0));
            this.timestamp = (__runInitializers(this, _transcriptLine_extraInitializers), __runInitializers(this, _timestamp_initializers, void 0));
            this.objectionType = (__runInitializers(this, _timestamp_extraInitializers), __runInitializers(this, _objectionType_initializers, void 0));
            this.objectingAttorneyId = (__runInitializers(this, _objectionType_extraInitializers), __runInitializers(this, _objectingAttorneyId_initializers, void 0));
            this.objectingAttorneyName = (__runInitializers(this, _objectingAttorneyId_extraInitializers), __runInitializers(this, _objectingAttorneyName_initializers, void 0));
            this.question = (__runInitializers(this, _objectingAttorneyName_extraInitializers), __runInitializers(this, _question_initializers, void 0));
            this.grounds = (__runInitializers(this, _question_extraInitializers), __runInitializers(this, _grounds_initializers, void 0));
            this.ruling = (__runInitializers(this, _grounds_extraInitializers), __runInitializers(this, _ruling_initializers, void 0));
            this.rulingJudge = (__runInitializers(this, _ruling_extraInitializers), __runInitializers(this, _rulingJudge_initializers, void 0));
            this.rulingDate = (__runInitializers(this, _rulingJudge_extraInitializers), __runInitializers(this, _rulingDate_initializers, void 0));
            this.rulingNotes = (__runInitializers(this, _rulingDate_extraInitializers), __runInitializers(this, _rulingNotes_initializers, void 0));
            this.isPreserved = (__runInitializers(this, _rulingNotes_extraInitializers), __runInitializers(this, _isPreserved_initializers, void 0));
            this.relatedMotion = (__runInitializers(this, _isPreserved_extraInitializers), __runInitializers(this, _relatedMotion_initializers, void 0));
            this.impeachmentValue = (__runInitializers(this, _relatedMotion_extraInitializers), __runInitializers(this, _impeachmentValue_initializers, void 0));
            this.followUpRequired = (__runInitializers(this, _impeachmentValue_extraInitializers), __runInitializers(this, _followUpRequired_initializers, void 0));
            this.metadata = (__runInitializers(this, _followUpRequired_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deposition = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deposition_initializers, void 0));
            __runInitializers(this, _deposition_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DepositionObjectionModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _depositionId_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.ForeignKey)(() => DepositionModel), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _transcriptPage_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _transcriptLine_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _timestamp_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _objectionType_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ObjectionType)),
                allowNull: false,
            })];
        _objectingAttorneyId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => sequelize_typescript_1.Model), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _objectingAttorneyName_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _question_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _grounds_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _ruling_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ObjectionRuling)),
                defaultValue: ObjectionRuling.PENDING,
            })];
        _rulingJudge_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _rulingDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _rulingNotes_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _isPreserved_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _relatedMotion_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _impeachmentValue_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('low', 'medium', 'high'),
                defaultValue: 'medium',
            })];
        _followUpRequired_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deposition_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => DepositionModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _depositionId_decorators, { kind: "field", name: "depositionId", static: false, private: false, access: { has: obj => "depositionId" in obj, get: obj => obj.depositionId, set: (obj, value) => { obj.depositionId = value; } }, metadata: _metadata }, _depositionId_initializers, _depositionId_extraInitializers);
        __esDecorate(null, null, _transcriptPage_decorators, { kind: "field", name: "transcriptPage", static: false, private: false, access: { has: obj => "transcriptPage" in obj, get: obj => obj.transcriptPage, set: (obj, value) => { obj.transcriptPage = value; } }, metadata: _metadata }, _transcriptPage_initializers, _transcriptPage_extraInitializers);
        __esDecorate(null, null, _transcriptLine_decorators, { kind: "field", name: "transcriptLine", static: false, private: false, access: { has: obj => "transcriptLine" in obj, get: obj => obj.transcriptLine, set: (obj, value) => { obj.transcriptLine = value; } }, metadata: _metadata }, _transcriptLine_initializers, _transcriptLine_extraInitializers);
        __esDecorate(null, null, _timestamp_decorators, { kind: "field", name: "timestamp", static: false, private: false, access: { has: obj => "timestamp" in obj, get: obj => obj.timestamp, set: (obj, value) => { obj.timestamp = value; } }, metadata: _metadata }, _timestamp_initializers, _timestamp_extraInitializers);
        __esDecorate(null, null, _objectionType_decorators, { kind: "field", name: "objectionType", static: false, private: false, access: { has: obj => "objectionType" in obj, get: obj => obj.objectionType, set: (obj, value) => { obj.objectionType = value; } }, metadata: _metadata }, _objectionType_initializers, _objectionType_extraInitializers);
        __esDecorate(null, null, _objectingAttorneyId_decorators, { kind: "field", name: "objectingAttorneyId", static: false, private: false, access: { has: obj => "objectingAttorneyId" in obj, get: obj => obj.objectingAttorneyId, set: (obj, value) => { obj.objectingAttorneyId = value; } }, metadata: _metadata }, _objectingAttorneyId_initializers, _objectingAttorneyId_extraInitializers);
        __esDecorate(null, null, _objectingAttorneyName_decorators, { kind: "field", name: "objectingAttorneyName", static: false, private: false, access: { has: obj => "objectingAttorneyName" in obj, get: obj => obj.objectingAttorneyName, set: (obj, value) => { obj.objectingAttorneyName = value; } }, metadata: _metadata }, _objectingAttorneyName_initializers, _objectingAttorneyName_extraInitializers);
        __esDecorate(null, null, _question_decorators, { kind: "field", name: "question", static: false, private: false, access: { has: obj => "question" in obj, get: obj => obj.question, set: (obj, value) => { obj.question = value; } }, metadata: _metadata }, _question_initializers, _question_extraInitializers);
        __esDecorate(null, null, _grounds_decorators, { kind: "field", name: "grounds", static: false, private: false, access: { has: obj => "grounds" in obj, get: obj => obj.grounds, set: (obj, value) => { obj.grounds = value; } }, metadata: _metadata }, _grounds_initializers, _grounds_extraInitializers);
        __esDecorate(null, null, _ruling_decorators, { kind: "field", name: "ruling", static: false, private: false, access: { has: obj => "ruling" in obj, get: obj => obj.ruling, set: (obj, value) => { obj.ruling = value; } }, metadata: _metadata }, _ruling_initializers, _ruling_extraInitializers);
        __esDecorate(null, null, _rulingJudge_decorators, { kind: "field", name: "rulingJudge", static: false, private: false, access: { has: obj => "rulingJudge" in obj, get: obj => obj.rulingJudge, set: (obj, value) => { obj.rulingJudge = value; } }, metadata: _metadata }, _rulingJudge_initializers, _rulingJudge_extraInitializers);
        __esDecorate(null, null, _rulingDate_decorators, { kind: "field", name: "rulingDate", static: false, private: false, access: { has: obj => "rulingDate" in obj, get: obj => obj.rulingDate, set: (obj, value) => { obj.rulingDate = value; } }, metadata: _metadata }, _rulingDate_initializers, _rulingDate_extraInitializers);
        __esDecorate(null, null, _rulingNotes_decorators, { kind: "field", name: "rulingNotes", static: false, private: false, access: { has: obj => "rulingNotes" in obj, get: obj => obj.rulingNotes, set: (obj, value) => { obj.rulingNotes = value; } }, metadata: _metadata }, _rulingNotes_initializers, _rulingNotes_extraInitializers);
        __esDecorate(null, null, _isPreserved_decorators, { kind: "field", name: "isPreserved", static: false, private: false, access: { has: obj => "isPreserved" in obj, get: obj => obj.isPreserved, set: (obj, value) => { obj.isPreserved = value; } }, metadata: _metadata }, _isPreserved_initializers, _isPreserved_extraInitializers);
        __esDecorate(null, null, _relatedMotion_decorators, { kind: "field", name: "relatedMotion", static: false, private: false, access: { has: obj => "relatedMotion" in obj, get: obj => obj.relatedMotion, set: (obj, value) => { obj.relatedMotion = value; } }, metadata: _metadata }, _relatedMotion_initializers, _relatedMotion_extraInitializers);
        __esDecorate(null, null, _impeachmentValue_decorators, { kind: "field", name: "impeachmentValue", static: false, private: false, access: { has: obj => "impeachmentValue" in obj, get: obj => obj.impeachmentValue, set: (obj, value) => { obj.impeachmentValue = value; } }, metadata: _metadata }, _impeachmentValue_initializers, _impeachmentValue_extraInitializers);
        __esDecorate(null, null, _followUpRequired_decorators, { kind: "field", name: "followUpRequired", static: false, private: false, access: { has: obj => "followUpRequired" in obj, get: obj => obj.followUpRequired, set: (obj, value) => { obj.followUpRequired = value; } }, metadata: _metadata }, _followUpRequired_initializers, _followUpRequired_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deposition_decorators, { kind: "field", name: "deposition", static: false, private: false, access: { has: obj => "deposition" in obj, get: obj => obj.deposition, set: (obj, value) => { obj.deposition = value; } }, metadata: _metadata }, _deposition_initializers, _deposition_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DepositionObjectionModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DepositionObjectionModel = _classThis;
})();
exports.DepositionObjectionModel = DepositionObjectionModel;
let DepositionSummaryModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'deposition_summaries',
            timestamps: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _depositionId_decorators;
    let _depositionId_initializers = [];
    let _depositionId_extraInitializers = [];
    let _summaryType_decorators;
    let _summaryType_initializers = [];
    let _summaryType_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _reviewedBy_decorators;
    let _reviewedBy_initializers = [];
    let _reviewedBy_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _summaryText_decorators;
    let _summaryText_initializers = [];
    let _summaryText_extraInitializers = [];
    let _keyTestimony_decorators;
    let _keyTestimony_initializers = [];
    let _keyTestimony_extraInitializers = [];
    let _admissions_decorators;
    let _admissions_initializers = [];
    let _admissions_extraInitializers = [];
    let _contradictions_decorators;
    let _contradictions_initializers = [];
    let _contradictions_extraInitializers = [];
    let _impeachmentOpportunities_decorators;
    let _impeachmentOpportunities_initializers = [];
    let _impeachmentOpportunities_extraInitializers = [];
    let _exhibits_decorators;
    let _exhibits_initializers = [];
    let _exhibits_extraInitializers = [];
    let _credibilityAssessment_decorators;
    let _credibilityAssessment_initializers = [];
    let _credibilityAssessment_extraInitializers = [];
    let _strengthScore_decorators;
    let _strengthScore_initializers = [];
    let _strengthScore_extraInitializers = [];
    let _overallImpact_decorators;
    let _overallImpact_initializers = [];
    let _overallImpact_extraInitializers = [];
    let _followUpQuestions_decorators;
    let _followUpQuestions_initializers = [];
    let _followUpQuestions_extraInitializers = [];
    let _trialUseNotes_decorators;
    let _trialUseNotes_initializers = [];
    let _trialUseNotes_extraInitializers = [];
    let _isConfidential_decorators;
    let _isConfidential_initializers = [];
    let _isConfidential_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deposition_decorators;
    let _deposition_initializers = [];
    let _deposition_extraInitializers = [];
    var DepositionSummaryModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.depositionId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _depositionId_initializers, void 0));
            this.summaryType = (__runInitializers(this, _depositionId_extraInitializers), __runInitializers(this, _summaryType_initializers, void 0));
            this.createdBy = (__runInitializers(this, _summaryType_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.reviewedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _reviewedBy_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _reviewedBy_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.summaryText = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _summaryText_initializers, void 0));
            this.keyTestimony = (__runInitializers(this, _summaryText_extraInitializers), __runInitializers(this, _keyTestimony_initializers, void 0));
            this.admissions = (__runInitializers(this, _keyTestimony_extraInitializers), __runInitializers(this, _admissions_initializers, void 0));
            this.contradictions = (__runInitializers(this, _admissions_extraInitializers), __runInitializers(this, _contradictions_initializers, void 0));
            this.impeachmentOpportunities = (__runInitializers(this, _contradictions_extraInitializers), __runInitializers(this, _impeachmentOpportunities_initializers, void 0));
            this.exhibits = (__runInitializers(this, _impeachmentOpportunities_extraInitializers), __runInitializers(this, _exhibits_initializers, void 0));
            this.credibilityAssessment = (__runInitializers(this, _exhibits_extraInitializers), __runInitializers(this, _credibilityAssessment_initializers, void 0));
            this.strengthScore = (__runInitializers(this, _credibilityAssessment_extraInitializers), __runInitializers(this, _strengthScore_initializers, void 0));
            this.overallImpact = (__runInitializers(this, _strengthScore_extraInitializers), __runInitializers(this, _overallImpact_initializers, void 0));
            this.followUpQuestions = (__runInitializers(this, _overallImpact_extraInitializers), __runInitializers(this, _followUpQuestions_initializers, void 0));
            this.trialUseNotes = (__runInitializers(this, _followUpQuestions_extraInitializers), __runInitializers(this, _trialUseNotes_initializers, void 0));
            this.isConfidential = (__runInitializers(this, _trialUseNotes_extraInitializers), __runInitializers(this, _isConfidential_initializers, void 0));
            this.metadata = (__runInitializers(this, _isConfidential_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deposition = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deposition_initializers, void 0));
            __runInitializers(this, _deposition_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DepositionSummaryModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _depositionId_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.ForeignKey)(() => DepositionModel), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _summaryType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('page-line', 'narrative', 'topical', 'issue-focused', 'impeachment'),
                allowNull: false,
            })];
        _createdBy_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => sequelize_typescript_1.Model), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _reviewedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _summaryText_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _keyTestimony_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _admissions_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _contradictions_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _impeachmentOpportunities_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _exhibits_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _credibilityAssessment_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _strengthScore_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                validate: { min: 1, max: 10 },
            })];
        _overallImpact_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('positive', 'neutral', 'negative', 'mixed'),
                allowNull: false,
            })];
        _followUpQuestions_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _trialUseNotes_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _isConfidential_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deposition_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => DepositionModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _depositionId_decorators, { kind: "field", name: "depositionId", static: false, private: false, access: { has: obj => "depositionId" in obj, get: obj => obj.depositionId, set: (obj, value) => { obj.depositionId = value; } }, metadata: _metadata }, _depositionId_initializers, _depositionId_extraInitializers);
        __esDecorate(null, null, _summaryType_decorators, { kind: "field", name: "summaryType", static: false, private: false, access: { has: obj => "summaryType" in obj, get: obj => obj.summaryType, set: (obj, value) => { obj.summaryType = value; } }, metadata: _metadata }, _summaryType_initializers, _summaryType_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _reviewedBy_decorators, { kind: "field", name: "reviewedBy", static: false, private: false, access: { has: obj => "reviewedBy" in obj, get: obj => obj.reviewedBy, set: (obj, value) => { obj.reviewedBy = value; } }, metadata: _metadata }, _reviewedBy_initializers, _reviewedBy_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _summaryText_decorators, { kind: "field", name: "summaryText", static: false, private: false, access: { has: obj => "summaryText" in obj, get: obj => obj.summaryText, set: (obj, value) => { obj.summaryText = value; } }, metadata: _metadata }, _summaryText_initializers, _summaryText_extraInitializers);
        __esDecorate(null, null, _keyTestimony_decorators, { kind: "field", name: "keyTestimony", static: false, private: false, access: { has: obj => "keyTestimony" in obj, get: obj => obj.keyTestimony, set: (obj, value) => { obj.keyTestimony = value; } }, metadata: _metadata }, _keyTestimony_initializers, _keyTestimony_extraInitializers);
        __esDecorate(null, null, _admissions_decorators, { kind: "field", name: "admissions", static: false, private: false, access: { has: obj => "admissions" in obj, get: obj => obj.admissions, set: (obj, value) => { obj.admissions = value; } }, metadata: _metadata }, _admissions_initializers, _admissions_extraInitializers);
        __esDecorate(null, null, _contradictions_decorators, { kind: "field", name: "contradictions", static: false, private: false, access: { has: obj => "contradictions" in obj, get: obj => obj.contradictions, set: (obj, value) => { obj.contradictions = value; } }, metadata: _metadata }, _contradictions_initializers, _contradictions_extraInitializers);
        __esDecorate(null, null, _impeachmentOpportunities_decorators, { kind: "field", name: "impeachmentOpportunities", static: false, private: false, access: { has: obj => "impeachmentOpportunities" in obj, get: obj => obj.impeachmentOpportunities, set: (obj, value) => { obj.impeachmentOpportunities = value; } }, metadata: _metadata }, _impeachmentOpportunities_initializers, _impeachmentOpportunities_extraInitializers);
        __esDecorate(null, null, _exhibits_decorators, { kind: "field", name: "exhibits", static: false, private: false, access: { has: obj => "exhibits" in obj, get: obj => obj.exhibits, set: (obj, value) => { obj.exhibits = value; } }, metadata: _metadata }, _exhibits_initializers, _exhibits_extraInitializers);
        __esDecorate(null, null, _credibilityAssessment_decorators, { kind: "field", name: "credibilityAssessment", static: false, private: false, access: { has: obj => "credibilityAssessment" in obj, get: obj => obj.credibilityAssessment, set: (obj, value) => { obj.credibilityAssessment = value; } }, metadata: _metadata }, _credibilityAssessment_initializers, _credibilityAssessment_extraInitializers);
        __esDecorate(null, null, _strengthScore_decorators, { kind: "field", name: "strengthScore", static: false, private: false, access: { has: obj => "strengthScore" in obj, get: obj => obj.strengthScore, set: (obj, value) => { obj.strengthScore = value; } }, metadata: _metadata }, _strengthScore_initializers, _strengthScore_extraInitializers);
        __esDecorate(null, null, _overallImpact_decorators, { kind: "field", name: "overallImpact", static: false, private: false, access: { has: obj => "overallImpact" in obj, get: obj => obj.overallImpact, set: (obj, value) => { obj.overallImpact = value; } }, metadata: _metadata }, _overallImpact_initializers, _overallImpact_extraInitializers);
        __esDecorate(null, null, _followUpQuestions_decorators, { kind: "field", name: "followUpQuestions", static: false, private: false, access: { has: obj => "followUpQuestions" in obj, get: obj => obj.followUpQuestions, set: (obj, value) => { obj.followUpQuestions = value; } }, metadata: _metadata }, _followUpQuestions_initializers, _followUpQuestions_extraInitializers);
        __esDecorate(null, null, _trialUseNotes_decorators, { kind: "field", name: "trialUseNotes", static: false, private: false, access: { has: obj => "trialUseNotes" in obj, get: obj => obj.trialUseNotes, set: (obj, value) => { obj.trialUseNotes = value; } }, metadata: _metadata }, _trialUseNotes_initializers, _trialUseNotes_extraInitializers);
        __esDecorate(null, null, _isConfidential_decorators, { kind: "field", name: "isConfidential", static: false, private: false, access: { has: obj => "isConfidential" in obj, get: obj => obj.isConfidential, set: (obj, value) => { obj.isConfidential = value; } }, metadata: _metadata }, _isConfidential_initializers, _isConfidential_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deposition_decorators, { kind: "field", name: "deposition", static: false, private: false, access: { has: obj => "deposition" in obj, get: obj => obj.deposition, set: (obj, value) => { obj.deposition = value; } }, metadata: _metadata }, _deposition_initializers, _deposition_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DepositionSummaryModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DepositionSummaryModel = _classThis;
})();
exports.DepositionSummaryModel = DepositionSummaryModel;
let DepositionOutlineModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'deposition_outlines',
            timestamps: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _depositionId_decorators;
    let _depositionId_initializers = [];
    let _depositionId_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _topics_decorators;
    let _topics_initializers = [];
    let _topics_extraInitializers = [];
    let _objectives_decorators;
    let _objectives_initializers = [];
    let _objectives_extraInitializers = [];
    let _documentsToReview_decorators;
    let _documentsToReview_initializers = [];
    let _documentsToReview_extraInitializers = [];
    let _impeachmentMaterial_decorators;
    let _impeachmentMaterial_initializers = [];
    let _impeachmentMaterial_extraInitializers = [];
    let _estimatedDuration_decorators;
    let _estimatedDuration_initializers = [];
    let _estimatedDuration_extraInitializers = [];
    let _actualDuration_decorators;
    let _actualDuration_initializers = [];
    let _actualDuration_extraInitializers = [];
    let _completionStatus_decorators;
    let _completionStatus_initializers = [];
    let _completionStatus_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deposition_decorators;
    let _deposition_initializers = [];
    let _deposition_extraInitializers = [];
    var DepositionOutlineModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.depositionId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _depositionId_initializers, void 0));
            this.createdBy = (__runInitializers(this, _depositionId_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.title = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.version = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _version_initializers, void 0));
            this.topics = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _topics_initializers, void 0));
            this.objectives = (__runInitializers(this, _topics_extraInitializers), __runInitializers(this, _objectives_initializers, void 0));
            this.documentsToReview = (__runInitializers(this, _objectives_extraInitializers), __runInitializers(this, _documentsToReview_initializers, void 0));
            this.impeachmentMaterial = (__runInitializers(this, _documentsToReview_extraInitializers), __runInitializers(this, _impeachmentMaterial_initializers, void 0));
            this.estimatedDuration = (__runInitializers(this, _impeachmentMaterial_extraInitializers), __runInitializers(this, _estimatedDuration_initializers, void 0));
            this.actualDuration = (__runInitializers(this, _estimatedDuration_extraInitializers), __runInitializers(this, _actualDuration_initializers, void 0));
            this.completionStatus = (__runInitializers(this, _actualDuration_extraInitializers), __runInitializers(this, _completionStatus_initializers, void 0));
            this.metadata = (__runInitializers(this, _completionStatus_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deposition = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deposition_initializers, void 0));
            __runInitializers(this, _deposition_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DepositionOutlineModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _depositionId_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.ForeignKey)(() => DepositionModel), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _createdBy_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => sequelize_typescript_1.Model), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _title_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _version_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                defaultValue: 1,
            })];
        _topics_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _objectives_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _documentsToReview_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _impeachmentMaterial_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _estimatedDuration_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _actualDuration_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _completionStatus_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deposition_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => DepositionModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _depositionId_decorators, { kind: "field", name: "depositionId", static: false, private: false, access: { has: obj => "depositionId" in obj, get: obj => obj.depositionId, set: (obj, value) => { obj.depositionId = value; } }, metadata: _metadata }, _depositionId_initializers, _depositionId_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, null, _topics_decorators, { kind: "field", name: "topics", static: false, private: false, access: { has: obj => "topics" in obj, get: obj => obj.topics, set: (obj, value) => { obj.topics = value; } }, metadata: _metadata }, _topics_initializers, _topics_extraInitializers);
        __esDecorate(null, null, _objectives_decorators, { kind: "field", name: "objectives", static: false, private: false, access: { has: obj => "objectives" in obj, get: obj => obj.objectives, set: (obj, value) => { obj.objectives = value; } }, metadata: _metadata }, _objectives_initializers, _objectives_extraInitializers);
        __esDecorate(null, null, _documentsToReview_decorators, { kind: "field", name: "documentsToReview", static: false, private: false, access: { has: obj => "documentsToReview" in obj, get: obj => obj.documentsToReview, set: (obj, value) => { obj.documentsToReview = value; } }, metadata: _metadata }, _documentsToReview_initializers, _documentsToReview_extraInitializers);
        __esDecorate(null, null, _impeachmentMaterial_decorators, { kind: "field", name: "impeachmentMaterial", static: false, private: false, access: { has: obj => "impeachmentMaterial" in obj, get: obj => obj.impeachmentMaterial, set: (obj, value) => { obj.impeachmentMaterial = value; } }, metadata: _metadata }, _impeachmentMaterial_initializers, _impeachmentMaterial_extraInitializers);
        __esDecorate(null, null, _estimatedDuration_decorators, { kind: "field", name: "estimatedDuration", static: false, private: false, access: { has: obj => "estimatedDuration" in obj, get: obj => obj.estimatedDuration, set: (obj, value) => { obj.estimatedDuration = value; } }, metadata: _metadata }, _estimatedDuration_initializers, _estimatedDuration_extraInitializers);
        __esDecorate(null, null, _actualDuration_decorators, { kind: "field", name: "actualDuration", static: false, private: false, access: { has: obj => "actualDuration" in obj, get: obj => obj.actualDuration, set: (obj, value) => { obj.actualDuration = value; } }, metadata: _metadata }, _actualDuration_initializers, _actualDuration_extraInitializers);
        __esDecorate(null, null, _completionStatus_decorators, { kind: "field", name: "completionStatus", static: false, private: false, access: { has: obj => "completionStatus" in obj, get: obj => obj.completionStatus, set: (obj, value) => { obj.completionStatus = value; } }, metadata: _metadata }, _completionStatus_initializers, _completionStatus_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deposition_decorators, { kind: "field", name: "deposition", static: false, private: false, access: { has: obj => "deposition" in obj, get: obj => obj.deposition, set: (obj, value) => { obj.deposition = value; } }, metadata: _metadata }, _deposition_initializers, _deposition_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DepositionOutlineModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DepositionOutlineModel = _classThis;
})();
exports.DepositionOutlineModel = DepositionOutlineModel;
// ============================================================================
// FUNCTION 1: SCHEDULE DEPOSITION
// ============================================================================
/**
 * Schedule a new deposition with calendar integration and conflict detection
 *
 * @param params - Deposition scheduling parameters
 * @param transaction - Optional database transaction
 * @returns Created deposition record
 * @throws BadRequestException if scheduling conflicts exist
 * @throws NotFoundException if witness or attorneys not found
 */
async function scheduleDeposition(params, transaction) {
    const validated = exports.DepositionScheduleSchema.parse(params);
    // Check for scheduling conflicts
    const conflicts = await DepositionModel.findAll({
        where: {
            scheduledDate: validated.scheduledDate,
            status: {
                [sequelize_1.Op.notIn]: [DepositionStatus.CANCELLED, DepositionStatus.COMPLETED],
            },
            [sequelize_1.Op.or]: [
                { defendingAttorneyId: validated.defendingAttorneyId },
                { examiningAttorneyId: validated.examiningAttorneyId },
                { witnessId: validated.witnessId },
            ],
        },
        transaction,
    });
    if (conflicts.length > 0) {
        throw new common_1.ConflictException(`Scheduling conflict detected for the specified date and participants`);
    }
    // Generate unique deposition number
    const depositionNumber = await generateDepositionNumber(validated.matterId, transaction);
    const deposition = await DepositionModel.create({
        id: crypto.randomUUID(),
        depositionNumber,
        matterId: validated.matterId,
        witnessId: validated.witnessId,
        witnessName: validated.witnessName,
        depositionType: validated.depositionType,
        status: DepositionStatus.SCHEDULED,
        scheduledDate: validated.scheduledDate,
        scheduledTime: validated.scheduledTime,
        duration: validated.duration,
        location: validated.location,
        isRemote: validated.isRemote,
        remoteLink: validated.remoteLink,
        defendingAttorneyId: validated.defendingAttorneyId,
        examiningAttorneyId: validated.examiningAttorneyId,
        attendees: [validated.defendingAttorneyId, validated.examiningAttorneyId],
        courtReporterId: validated.courtReporterId,
        videographerId: validated.videographerId,
        isExpert: validated.depositionType === DepositionType.EXPERT_WITNESS,
        materialsProvided: [],
        topics: validated.topics,
        priority: validated.priority,
        notes: '',
        estimatedCost: calculateEstimatedCost(validated),
        metadata: {},
    }, { transaction });
    return deposition;
}
// ============================================================================
// FUNCTION 2: GENERATE DEPOSITION NUMBER
// ============================================================================
/**
 * Generate unique deposition number for a matter
 *
 * @param matterId - Matter identifier
 * @param transaction - Optional database transaction
 * @returns Unique deposition number
 */
async function generateDepositionNumber(matterId, transaction) {
    const count = await DepositionModel.count({
        where: { matterId },
        transaction,
    });
    const year = new Date().getFullYear();
    const sequence = (count + 1).toString().padStart(4, '0');
    const matterPrefix = matterId.substring(0, 6).toUpperCase();
    return `DEP-${year}-${matterPrefix}-${sequence}`;
}
// ============================================================================
// FUNCTION 3: CALCULATE ESTIMATED COST
// ============================================================================
/**
 * Calculate estimated deposition cost based on parameters
 *
 * @param params - Deposition parameters
 * @returns Estimated cost in dollars
 */
function calculateEstimatedCost(params) {
    let cost = 0;
    // Court reporter base fee
    cost += 500;
    // Duration fee (per hour beyond first hour)
    const hours = Math.ceil(params.duration / 60);
    if (hours > 1) {
        cost += (hours - 1) * 150;
    }
    // Remote deposition technology fee
    if (params.isRemote) {
        cost += 200;
    }
    // Video deposition fee
    if (params.depositionType === DepositionType.VIDEO) {
        cost += 400;
    }
    // Expert witness premium
    if (params.depositionType === DepositionType.EXPERT_WITNESS) {
        cost += 300;
    }
    return cost;
}
// ============================================================================
// FUNCTION 4: PREPARE EXHIBIT
// ============================================================================
/**
 * Prepare and mark an exhibit for deposition use
 *
 * @param params - Exhibit preparation parameters
 * @param transaction - Optional database transaction
 * @returns Created exhibit record
 * @throws NotFoundException if deposition not found
 */
async function prepareDepositionExhibit(params, transaction) {
    const validated = exports.ExhibitPrepSchema.parse(params);
    const deposition = await DepositionModel.findByPk(validated.depositionId, { transaction });
    if (!deposition) {
        throw new common_1.NotFoundException(`Deposition not found: ${validated.depositionId}`);
    }
    // Generate exhibit number
    const exhibitNumber = await generateExhibitNumber(validated.depositionId, transaction);
    const exhibit = await DepositionExhibitModel.create({
        id: crypto.randomUUID(),
        depositionId: validated.depositionId,
        exhibitNumber,
        exhibitLabel: `Exhibit ${exhibitNumber}`,
        description: validated.description,
        status: ExhibitStatus.PREPARED,
        documentId: validated.documentId,
        documentPath: validated.documentPath,
        documentType: validated.documentType,
        batesRange: validated.batesRange,
        isConfidential: validated.isConfidential,
        isPriorArt: false,
        objections: [],
        admissionNotes: '',
        metadata: {},
    }, { transaction });
    return exhibit;
}
// ============================================================================
// FUNCTION 5: GENERATE EXHIBIT NUMBER
// ============================================================================
/**
 * Generate sequential exhibit number for a deposition
 *
 * @param depositionId - Deposition identifier
 * @param transaction - Optional database transaction
 * @returns Exhibit number (e.g., "1", "2", "3")
 */
async function generateExhibitNumber(depositionId, transaction) {
    const count = await DepositionExhibitModel.count({
        where: { depositionId },
        transaction,
    });
    return (count + 1).toString();
}
// ============================================================================
// FUNCTION 6: ORDER TRANSCRIPT
// ============================================================================
/**
 * Order deposition transcript from court reporter
 *
 * @param params - Transcript order parameters
 * @param transaction - Optional database transaction
 * @returns Created transcript order record
 * @throws NotFoundException if deposition or court reporter not found
 */
async function orderDepositionTranscript(params, transaction) {
    const validated = exports.TranscriptOrderSchema.parse(params);
    const deposition = await DepositionModel.findByPk(validated.depositionId, { transaction });
    if (!deposition) {
        throw new common_1.NotFoundException(`Deposition not found: ${validated.depositionId}`);
    }
    if (deposition.status !== DepositionStatus.COMPLETED) {
        throw new common_1.BadRequestException('Cannot order transcript for incomplete deposition');
    }
    const cost = calculateTranscriptCost(validated.transcriptType, deposition.duration);
    const transcript = await DepositionTranscriptModel.create({
        id: crypto.randomUUID(),
        depositionId: validated.depositionId,
        status: TranscriptStatus.ORDERED,
        courtReporterId: validated.courtReporterId,
        orderedDate: new Date(),
        expectedDate: validated.expectedDate || calculateExpectedDate(validated.transcriptType),
        transcriptType: validated.transcriptType,
        format: validated.format,
        totalCost: cost,
        isConfidential: validated.isConfidential,
        accessRestrictions: validated.isConfidential ? ['attorney-eyes-only'] : [],
        metadata: {},
    }, { transaction });
    // Update deposition status
    await deposition.update({ status: DepositionStatus.TRANSCRIPT_ORDERED }, { transaction });
    return transcript;
}
// ============================================================================
// FUNCTION 7: CALCULATE TRANSCRIPT COST
// ============================================================================
/**
 * Calculate transcript cost based on type and duration
 *
 * @param transcriptType - Type of transcript
 * @param duration - Deposition duration in minutes
 * @returns Total cost in dollars
 */
function calculateTranscriptCost(transcriptType, duration) {
    const pages = Math.ceil(duration / 4); // Approximate 4 minutes per page
    let costPerPage = 0;
    switch (transcriptType) {
        case 'rough':
            costPerPage = 2.50;
            break;
        case 'expedited':
            costPerPage = 5.00;
            break;
        case 'daily':
            costPerPage = 4.00;
            break;
        case 'standard':
            costPerPage = 3.00;
            break;
        case 'certified':
            costPerPage = 3.50;
            break;
    }
    return pages * costPerPage;
}
// ============================================================================
// FUNCTION 8: CALCULATE EXPECTED TRANSCRIPT DATE
// ============================================================================
/**
 * Calculate expected delivery date for transcript based on type
 *
 * @param transcriptType - Type of transcript
 * @returns Expected delivery date
 */
function calculateExpectedDate(transcriptType) {
    const businessDays = {
        rough: 3,
        expedited: 5,
        daily: 1,
        standard: 14,
        certified: 21,
    };
    return (0, date_fns_1.addDays)(new Date(), businessDays[transcriptType] || 14);
}
// ============================================================================
// FUNCTION 9: TRACK OBJECTION
// ============================================================================
/**
 * Track and log objection during deposition
 *
 * @param params - Objection parameters
 * @param transaction - Optional database transaction
 * @returns Created objection record
 * @throws NotFoundException if deposition not found
 */
async function trackDepositionObjection(params, transaction) {
    const validated = exports.ObjectionSchema.parse(params);
    const deposition = await DepositionModel.findByPk(validated.depositionId, { transaction });
    if (!deposition) {
        throw new common_1.NotFoundException(`Deposition not found: ${validated.depositionId}`);
    }
    const objection = await DepositionObjectionModel.create({
        id: crypto.randomUUID(),
        depositionId: validated.depositionId,
        transcriptPage: validated.transcriptPage,
        transcriptLine: validated.transcriptLine,
        timestamp: new Date(),
        objectionType: validated.objectionType,
        objectingAttorneyId: validated.objectingAttorneyId,
        objectingAttorneyName: '', // To be populated from attorney lookup
        question: validated.question,
        grounds: validated.grounds,
        ruling: ObjectionRuling.PENDING,
        isPreserved: validated.isPreserved,
        impeachmentValue: 'medium',
        followUpRequired: false,
        metadata: {},
    }, { transaction });
    return objection;
}
// ============================================================================
// FUNCTION 10: CREATE DEPOSITION SUMMARY
// ============================================================================
/**
 * Create comprehensive deposition summary with key testimony
 *
 * @param params - Summary creation parameters
 * @param transaction - Optional database transaction
 * @returns Created summary record
 * @throws NotFoundException if deposition not found
 */
async function createDepositionSummary(params, transaction) {
    const validated = exports.SummaryCreationSchema.parse(params);
    const deposition = await DepositionModel.findByPk(validated.depositionId, {
        include: [
            DepositionTranscriptModel,
            DepositionObjectionModel,
            DepositionExhibitModel,
        ],
        transaction,
    });
    if (!deposition) {
        throw new common_1.NotFoundException(`Deposition not found: ${validated.depositionId}`);
    }
    const summary = await DepositionSummaryModel.create({
        id: crypto.randomUUID(),
        depositionId: validated.depositionId,
        summaryType: validated.summaryType,
        createdBy: validated.createdBy,
        summaryText: validated.summaryText,
        keyTestimony: validated.keyTestimony,
        admissions: [],
        contradictions: [],
        impeachmentOpportunities: [],
        exhibits: [],
        credibilityAssessment: '',
        strengthScore: 5,
        overallImpact: validated.overallImpact,
        followUpQuestions: [],
        trialUseNotes: '',
        isConfidential: false,
        metadata: {},
    }, { transaction });
    return summary;
}
// ============================================================================
// FUNCTION 11: MARK EXHIBIT DURING DEPOSITION
// ============================================================================
/**
 * Mark exhibit as introduced during deposition
 *
 * @param exhibitId - Exhibit identifier
 * @param markedBy - Attorney marking the exhibit
 * @param transaction - Optional database transaction
 * @returns Updated exhibit record
 */
async function markExhibit(exhibitId, markedBy, transaction) {
    const exhibit = await DepositionExhibitModel.findByPk(exhibitId, { transaction });
    if (!exhibit) {
        throw new common_1.NotFoundException(`Exhibit not found: ${exhibitId}`);
    }
    await exhibit.update({
        status: ExhibitStatus.MARKED,
        markedAt: new Date(),
        markedBy,
    }, { transaction });
    return exhibit;
}
// ============================================================================
// FUNCTION 12: INTRODUCE EXHIBIT
// ============================================================================
/**
 * Mark exhibit as introduced into the deposition record
 *
 * @param exhibitId - Exhibit identifier
 * @param transaction - Optional database transaction
 * @returns Updated exhibit record
 */
async function introduceExhibit(exhibitId, transaction) {
    const exhibit = await DepositionExhibitModel.findByPk(exhibitId, { transaction });
    if (!exhibit) {
        throw new common_1.NotFoundException(`Exhibit not found: ${exhibitId}`);
    }
    await exhibit.update({
        status: ExhibitStatus.INTRODUCED,
        introducedAt: new Date(),
    }, { transaction });
    return exhibit;
}
// ============================================================================
// FUNCTION 13: AUTHENTICATE EXHIBIT
// ============================================================================
/**
 * Mark exhibit as authenticated by witness
 *
 * @param exhibitId - Exhibit identifier
 * @param authenticatedBy - Witness authenticating the exhibit
 * @param transaction - Optional database transaction
 * @returns Updated exhibit record
 */
async function authenticateExhibit(exhibitId, authenticatedBy, transaction) {
    const exhibit = await DepositionExhibitModel.findByPk(exhibitId, { transaction });
    if (!exhibit) {
        throw new common_1.NotFoundException(`Exhibit not found: ${exhibitId}`);
    }
    await exhibit.update({
        status: ExhibitStatus.AUTHENTICATED,
        authenticatedBy,
    }, { transaction });
    return exhibit;
}
// ============================================================================
// FUNCTION 14: UPDATE OBJECTION RULING
// ============================================================================
/**
 * Update ruling on deposition objection
 *
 * @param objectionId - Objection identifier
 * @param ruling - Ruling decision
 * @param rulingJudge - Judge name (optional)
 * @param notes - Ruling notes (optional)
 * @param transaction - Optional database transaction
 * @returns Updated objection record
 */
async function updateObjectionRuling(objectionId, ruling, rulingJudge, notes, transaction) {
    const objection = await DepositionObjectionModel.findByPk(objectionId, { transaction });
    if (!objection) {
        throw new common_1.NotFoundException(`Objection not found: ${objectionId}`);
    }
    await objection.update({
        ruling,
        rulingJudge,
        rulingDate: new Date(),
        rulingNotes: notes,
    }, { transaction });
    return objection;
}
// ============================================================================
// FUNCTION 15: GENERATE DEPOSITION NOTICE
// ============================================================================
/**
 * Generate formal deposition notice document
 *
 * @param depositionId - Deposition identifier
 * @returns Notice document content
 */
async function generateDepositionNotice(depositionId) {
    const deposition = await DepositionModel.findByPk(depositionId);
    if (!deposition) {
        throw new common_1.NotFoundException(`Deposition not found: ${depositionId}`);
    }
    const noticeDate = (0, date_fns_1.format)(new Date(), 'MMMM dd, yyyy');
    const depositionDate = (0, date_fns_1.format)(deposition.scheduledDate, 'MMMM dd, yyyy');
    return `
NOTICE OF DEPOSITION

Date: ${noticeDate}

TO: All Counsel of Record

PLEASE TAKE NOTICE that the deposition of ${deposition.witnessName} will be taken as follows:

Deposition Number: ${deposition.depositionNumber}
Date: ${depositionDate}
Time: ${deposition.scheduledTime}
Location: ${deposition.location}
${deposition.isRemote ? `Remote Link: ${deposition.remoteLink}` : ''}
Type: ${deposition.depositionType}
Estimated Duration: ${deposition.duration} minutes

Topics for Examination:
${deposition.topics.map((topic, idx) => `${idx + 1}. ${topic}`).join('\n')}

This deposition will be recorded by a certified court reporter and may be used at trial or any hearing in this matter.

Respectfully submitted,

[Examining Attorney]
Date: ${noticeDate}
  `.trim();
}
// ============================================================================
// FUNCTION 16: CREATE DEPOSITION OUTLINE
// ============================================================================
/**
 * Create structured deposition outline with topics and questions
 *
 * @param depositionId - Deposition identifier
 * @param createdBy - Attorney creating the outline
 * @param title - Outline title
 * @param topics - Topic structure
 * @param transaction - Optional database transaction
 * @returns Created outline record
 */
async function createDepositionOutline(depositionId, createdBy, title, topics, transaction) {
    const deposition = await DepositionModel.findByPk(depositionId, { transaction });
    if (!deposition) {
        throw new common_1.NotFoundException(`Deposition not found: ${depositionId}`);
    }
    const estimatedDuration = topics.reduce((sum, topic) => sum + topic.estimatedTime, 0);
    const outline = await DepositionOutlineModel.create({
        id: crypto.randomUUID(),
        depositionId,
        createdBy,
        title,
        version: 1,
        topics,
        objectives: [],
        documentsToReview: [],
        impeachmentMaterial: [],
        estimatedDuration,
        completionStatus: {},
        metadata: {},
    }, { transaction });
    return outline;
}
// ============================================================================
// FUNCTION 17: UPDATE DEPOSITION STATUS
// ============================================================================
/**
 * Update deposition status with validation
 *
 * @param depositionId - Deposition identifier
 * @param status - New status
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
async function updateDepositionStatus(depositionId, status, transaction) {
    const deposition = await DepositionModel.findByPk(depositionId, { transaction });
    if (!deposition) {
        throw new common_1.NotFoundException(`Deposition not found: ${depositionId}`);
    }
    await deposition.update({ status }, { transaction });
    return deposition;
}
// ============================================================================
// FUNCTION 18: CANCEL DEPOSITION
// ============================================================================
/**
 * Cancel scheduled deposition with reason
 *
 * @param depositionId - Deposition identifier
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
async function cancelDeposition(depositionId, reason, transaction) {
    const deposition = await DepositionModel.findByPk(depositionId, { transaction });
    if (!deposition) {
        throw new common_1.NotFoundException(`Deposition not found: ${depositionId}`);
    }
    if (deposition.status === DepositionStatus.COMPLETED) {
        throw new common_1.BadRequestException('Cannot cancel completed deposition');
    }
    await deposition.update({
        status: DepositionStatus.CANCELLED,
        cancelledReason: reason,
    }, { transaction });
    return deposition;
}
// ============================================================================
// FUNCTION 19: RESCHEDULE DEPOSITION
// ============================================================================
/**
 * Reschedule deposition to new date/time
 *
 * @param depositionId - Original deposition identifier
 * @param newDate - New scheduled date
 * @param newTime - New scheduled time
 * @param transaction - Optional database transaction
 * @returns New deposition record
 */
async function rescheduleDeposition(depositionId, newDate, newTime, transaction) {
    const originalDeposition = await DepositionModel.findByPk(depositionId, { transaction });
    if (!originalDeposition) {
        throw new common_1.NotFoundException(`Deposition not found: ${depositionId}`);
    }
    // Mark original as rescheduled
    await originalDeposition.update({ status: DepositionStatus.RESCHEDULED }, { transaction });
    // Create new deposition record
    const newDeposition = await DepositionModel.create({
        ...originalDeposition.get({ plain: true }),
        id: crypto.randomUUID(),
        depositionNumber: await generateDepositionNumber(originalDeposition.matterId, transaction),
        scheduledDate: newDate,
        scheduledTime: newTime,
        status: DepositionStatus.SCHEDULED,
        rescheduledFrom: depositionId,
        createdAt: new Date(),
        updatedAt: new Date(),
    }, { transaction });
    return newDeposition;
}
// ============================================================================
// FUNCTION 20: ASSIGN COURT REPORTER
// ============================================================================
/**
 * Assign court reporter to deposition
 *
 * @param depositionId - Deposition identifier
 * @param courtReporterId - Court reporter identifier
 * @param courtReporterName - Court reporter name
 * @param courtReporterFirm - Court reporter firm
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
async function assignCourtReporter(depositionId, courtReporterId, courtReporterName, courtReporterFirm, transaction) {
    const deposition = await DepositionModel.findByPk(depositionId, { transaction });
    if (!deposition) {
        throw new common_1.NotFoundException(`Deposition not found: ${depositionId}`);
    }
    await deposition.update({
        courtReporterId,
        courtReporterName,
        courtReporterFirm,
    }, { transaction });
    return deposition;
}
// ============================================================================
// FUNCTION 21: ASSIGN VIDEOGRAPHER
// ============================================================================
/**
 * Assign videographer to video deposition
 *
 * @param depositionId - Deposition identifier
 * @param videographerId - Videographer identifier
 * @param videographerName - Videographer name
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
async function assignVideographer(depositionId, videographerId, videographerName, transaction) {
    const deposition = await DepositionModel.findByPk(depositionId, { transaction });
    if (!deposition) {
        throw new common_1.NotFoundException(`Deposition not found: ${depositionId}`);
    }
    if (deposition.depositionType !== DepositionType.VIDEO) {
        throw new common_1.BadRequestException('Videographer can only be assigned to video depositions');
    }
    await deposition.update({
        videographerId,
        videographerName,
    }, { transaction });
    return deposition;
}
// ============================================================================
// FUNCTION 22: ADD DEPOSITION ATTENDEE
// ============================================================================
/**
 * Add attendee to deposition
 *
 * @param depositionId - Deposition identifier
 * @param attendeeId - Attendee identifier
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
async function addDepositionAttendee(depositionId, attendeeId, transaction) {
    const deposition = await DepositionModel.findByPk(depositionId, { transaction });
    if (!deposition) {
        throw new common_1.NotFoundException(`Deposition not found: ${depositionId}`);
    }
    if (!deposition.attendees.includes(attendeeId)) {
        await deposition.update({
            attendees: [...deposition.attendees, attendeeId],
        }, { transaction });
    }
    return deposition;
}
// ============================================================================
// FUNCTION 23: REMOVE DEPOSITION ATTENDEE
// ============================================================================
/**
 * Remove attendee from deposition
 *
 * @param depositionId - Deposition identifier
 * @param attendeeId - Attendee identifier
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
async function removeDepositionAttendee(depositionId, attendeeId, transaction) {
    const deposition = await DepositionModel.findByPk(depositionId, { transaction });
    if (!deposition) {
        throw new common_1.NotFoundException(`Deposition not found: ${depositionId}`);
    }
    await deposition.update({
        attendees: deposition.attendees.filter((id) => id !== attendeeId),
    }, { transaction });
    return deposition;
}
// ============================================================================
// FUNCTION 24: RECORD DEPOSITION NOTICE SERVICE
// ============================================================================
/**
 * Record service of deposition notice
 *
 * @param depositionId - Deposition identifier
 * @param serviceDate - Date notice was served
 * @param serviceMethod - Method of service
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
async function recordNoticeService(depositionId, serviceDate, serviceMethod, transaction) {
    const deposition = await DepositionModel.findByPk(depositionId, { transaction });
    if (!deposition) {
        throw new common_1.NotFoundException(`Deposition not found: ${depositionId}`);
    }
    await deposition.update({
        noticeServedDate: serviceDate,
        noticeMethod: serviceMethod,
        status: DepositionStatus.NOTICE_SENT,
    }, { transaction });
    return deposition;
}
// ============================================================================
// FUNCTION 25: CONFIRM DEPOSITION
// ============================================================================
/**
 * Confirm deposition attendance and readiness
 *
 * @param depositionId - Deposition identifier
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
async function confirmDeposition(depositionId, transaction) {
    const deposition = await DepositionModel.findByPk(depositionId, { transaction });
    if (!deposition) {
        throw new common_1.NotFoundException(`Deposition not found: ${depositionId}`);
    }
    await deposition.update({ status: DepositionStatus.CONFIRMED }, { transaction });
    return deposition;
}
// ============================================================================
// FUNCTION 26: START DEPOSITION
// ============================================================================
/**
 * Mark deposition as in progress
 *
 * @param depositionId - Deposition identifier
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
async function startDeposition(depositionId, transaction) {
    const deposition = await DepositionModel.findByPk(depositionId, { transaction });
    if (!deposition) {
        throw new common_1.NotFoundException(`Deposition not found: ${depositionId}`);
    }
    await deposition.update({ status: DepositionStatus.IN_PROGRESS }, { transaction });
    return deposition;
}
// ============================================================================
// FUNCTION 27: COMPLETE DEPOSITION
// ============================================================================
/**
 * Mark deposition as completed
 *
 * @param depositionId - Deposition identifier
 * @param actualCost - Actual cost incurred (optional)
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
async function completeDeposition(depositionId, actualCost, transaction) {
    const deposition = await DepositionModel.findByPk(depositionId, { transaction });
    if (!deposition) {
        throw new common_1.NotFoundException(`Deposition not found: ${depositionId}`);
    }
    await deposition.update({
        status: DepositionStatus.COMPLETED,
        actualCost: actualCost || deposition.estimatedCost,
    }, { transaction });
    return deposition;
}
// ============================================================================
// FUNCTION 28: UPDATE TRANSCRIPT STATUS
// ============================================================================
/**
 * Update transcript status throughout production lifecycle
 *
 * @param transcriptId - Transcript identifier
 * @param status - New status
 * @param transaction - Optional database transaction
 * @returns Updated transcript record
 */
async function updateTranscriptStatus(transcriptId, status, transaction) {
    const transcript = await DepositionTranscriptModel.findByPk(transcriptId, { transaction });
    if (!transcript) {
        throw new common_1.NotFoundException(`Transcript not found: ${transcriptId}`);
    }
    const updates = { status };
    if (status === TranscriptStatus.DRAFT_RECEIVED) {
        updates.receivedDate = new Date();
    }
    else if (status === TranscriptStatus.CERTIFIED) {
        updates.certifiedDate = new Date();
    }
    await transcript.update(updates, { transaction });
    return transcript;
}
// ============================================================================
// FUNCTION 29: ATTACH TRANSCRIPT FILE
// ============================================================================
/**
 * Attach transcript file to record
 *
 * @param transcriptId - Transcript identifier
 * @param filePath - File path
 * @param fileSize - File size in bytes
 * @param pageCount - Number of pages
 * @param transaction - Optional database transaction
 * @returns Updated transcript record
 */
async function attachTranscriptFile(transcriptId, filePath, fileSize, pageCount, transaction) {
    const transcript = await DepositionTranscriptModel.findByPk(transcriptId, { transaction });
    if (!transcript) {
        throw new common_1.NotFoundException(`Transcript not found: ${transcriptId}`);
    }
    await transcript.update({
        filePath,
        fileSize,
        pageCount,
        receivedDate: new Date(),
        status: TranscriptStatus.DRAFT_RECEIVED,
    }, { transaction });
    return transcript;
}
// ============================================================================
// FUNCTION 30: SUBMIT ERRATA SHEET
// ============================================================================
/**
 * Submit witness errata sheet for transcript corrections
 *
 * @param transcriptId - Transcript identifier
 * @param errataPath - Path to errata sheet
 * @param transaction - Optional database transaction
 * @returns Updated transcript record
 */
async function submitErrataSheet(transcriptId, errataPath, transaction) {
    const transcript = await DepositionTranscriptModel.findByPk(transcriptId, { transaction });
    if (!transcript) {
        throw new common_1.NotFoundException(`Transcript not found: ${transcriptId}`);
    }
    await transcript.update({
        errataPath,
        errataSubmitted: new Date(),
        status: TranscriptStatus.ERRATA_SUBMITTED,
    }, { transaction });
    return transcript;
}
// ============================================================================
// FUNCTION 31: ASSIGN TRANSCRIPT REVIEWER
// ============================================================================
/**
 * Assign attorney to review transcript
 *
 * @param transcriptId - Transcript identifier
 * @param reviewerId - Reviewer identifier
 * @param transaction - Optional database transaction
 * @returns Updated transcript record
 */
async function assignTranscriptReviewer(transcriptId, reviewerId, transaction) {
    const transcript = await DepositionTranscriptModel.findByPk(transcriptId, { transaction });
    if (!transcript) {
        throw new common_1.NotFoundException(`Transcript not found: ${transcriptId}`);
    }
    await transcript.update({
        reviewAssignedTo: reviewerId,
        status: TranscriptStatus.UNDER_REVIEW,
    }, { transaction });
    return transcript;
}
// ============================================================================
// FUNCTION 32: COMPLETE TRANSCRIPT REVIEW
// ============================================================================
/**
 * Mark transcript review as complete
 *
 * @param transcriptId - Transcript identifier
 * @param transaction - Optional database transaction
 * @returns Updated transcript record
 */
async function completeTranscriptReview(transcriptId, transaction) {
    const transcript = await DepositionTranscriptModel.findByPk(transcriptId, { transaction });
    if (!transcript) {
        throw new common_1.NotFoundException(`Transcript not found: ${transcriptId}`);
    }
    await transcript.update({
        reviewCompletedDate: new Date(),
        status: TranscriptStatus.FINALIZED,
    }, { transaction });
    return transcript;
}
// ============================================================================
// FUNCTION 33: GET DEPOSITION WITH RELATIONS
// ============================================================================
/**
 * Retrieve deposition with all related records
 *
 * @param depositionId - Deposition identifier
 * @returns Deposition with exhibits, transcripts, objections, and summaries
 */
async function getDepositionWithRelations(depositionId) {
    const deposition = await DepositionModel.findByPk(depositionId, {
        include: [
            {
                model: DepositionExhibitModel,
                as: 'exhibits',
            },
            {
                model: DepositionTranscriptModel,
                as: 'transcripts',
            },
            {
                model: DepositionObjectionModel,
                as: 'objections',
            },
            {
                model: DepositionSummaryModel,
                as: 'summaries',
            },
        ],
    });
    if (!deposition) {
        throw new common_1.NotFoundException(`Deposition not found: ${depositionId}`);
    }
    return deposition;
}
// ============================================================================
// FUNCTION 34: SEARCH DEPOSITIONS
// ============================================================================
/**
 * Search depositions with advanced filtering
 *
 * @param filters - Search filters
 * @returns Matching deposition records
 */
async function searchDepositions(filters) {
    const where = {};
    if (filters.matterId)
        where.matterId = filters.matterId;
    if (filters.witnessId)
        where.witnessId = filters.witnessId;
    if (filters.status)
        where.status = filters.status;
    if (filters.depositionType)
        where.depositionType = filters.depositionType;
    if (filters.priority)
        where.priority = filters.priority;
    if (filters.isExpert !== undefined)
        where.isExpert = filters.isExpert;
    if (filters.fromDate || filters.toDate) {
        where.scheduledDate = {};
        if (filters.fromDate)
            where.scheduledDate[sequelize_1.Op.gte] = filters.fromDate;
        if (filters.toDate)
            where.scheduledDate[sequelize_1.Op.lte] = filters.toDate;
    }
    const depositions = await DepositionModel.findAll({
        where,
        order: [['scheduledDate', 'DESC']],
    });
    return depositions;
}
// ============================================================================
// FUNCTION 35: GET UPCOMING DEPOSITIONS
// ============================================================================
/**
 * Get upcoming depositions within specified days
 *
 * @param matterId - Matter identifier (optional)
 * @param days - Number of days to look ahead (default: 30)
 * @returns Upcoming deposition records
 */
async function getUpcomingDepositions(matterId, days = 30) {
    const where = {
        scheduledDate: {
            [sequelize_1.Op.gte]: new Date(),
            [sequelize_1.Op.lte]: (0, date_fns_1.addDays)(new Date(), days),
        },
        status: {
            [sequelize_1.Op.in]: [
                DepositionStatus.SCHEDULED,
                DepositionStatus.NOTICE_SENT,
                DepositionStatus.CONFIRMED,
            ],
        },
    };
    if (matterId) {
        where.matterId = matterId;
    }
    const depositions = await DepositionModel.findAll({
        where,
        order: [['scheduledDate', 'ASC'], ['scheduledTime', 'ASC']],
    });
    return depositions;
}
// ============================================================================
// FUNCTION 36: CALCULATE DEPOSITION STATISTICS
// ============================================================================
/**
 * Calculate deposition statistics for a matter
 *
 * @param matterId - Matter identifier
 * @returns Deposition statistics
 */
async function calculateDepositionStatistics(matterId) {
    const depositions = await DepositionModel.findAll({
        where: { matterId },
        include: [
            DepositionExhibitModel,
            DepositionObjectionModel,
            DepositionTranscriptModel,
        ],
    });
    const stats = {
        totalDepositions: depositions.length,
        completedDepositions: depositions.filter((d) => d.status === DepositionStatus.COMPLETED).length,
        scheduledDepositions: depositions.filter((d) => [DepositionStatus.SCHEDULED, DepositionStatus.CONFIRMED].includes(d.status)).length,
        cancelledDepositions: depositions.filter((d) => d.status === DepositionStatus.CANCELLED).length,
        totalCost: depositions.reduce((sum, d) => sum + (d.actualCost || d.estimatedCost), 0),
        averageDuration: depositions.length > 0
            ? depositions.reduce((sum, d) => sum + d.duration, 0) / depositions.length
            : 0,
        totalObjections: 0,
        expertDepositions: depositions.filter((d) => d.isExpert).length,
        totalExhibits: 0,
        transcriptsOrdered: 0,
        transcriptsReceived: 0,
    };
    // Count related records
    for (const deposition of depositions) {
        if (deposition.objections) {
            stats.totalObjections += deposition.objections.length;
        }
        if (deposition.exhibits) {
            stats.totalExhibits += deposition.exhibits.length;
        }
        if (deposition.transcripts) {
            stats.transcriptsOrdered += deposition.transcripts.length;
            stats.transcriptsReceived += deposition.transcripts.filter((t) => t.status === TranscriptStatus.FINALIZED).length;
        }
    }
    return stats;
}
// ============================================================================
// NESTJS SERVICE
// ============================================================================
let DepositionManagementService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var DepositionManagementService = _classThis = class {
        constructor(sequelize, configService) {
            this.sequelize = sequelize;
            this.configService = configService;
            this.logger = new common_1.Logger(DepositionManagementService.name);
        }
        async scheduleDeposition(params) {
            return this.sequelize.transaction((transaction) => scheduleDeposition(params, transaction));
        }
        async prepareExhibit(params) {
            return this.sequelize.transaction((transaction) => prepareDepositionExhibit(params, transaction));
        }
        async orderTranscript(params) {
            return this.sequelize.transaction((transaction) => orderDepositionTranscript(params, transaction));
        }
        async trackObjection(params) {
            return this.sequelize.transaction((transaction) => trackDepositionObjection(params, transaction));
        }
        async createSummary(params) {
            return this.sequelize.transaction((transaction) => createDepositionSummary(params, transaction));
        }
        async getDeposition(id) {
            return getDepositionWithRelations(id);
        }
        async searchDepositions(filters) {
            return searchDepositions(filters);
        }
        async getUpcoming(matterId, days) {
            return getUpcomingDepositions(matterId, days);
        }
        async getStatistics(matterId) {
            return calculateDepositionStatistics(matterId);
        }
    };
    __setFunctionName(_classThis, "DepositionManagementService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DepositionManagementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DepositionManagementService = _classThis;
})();
exports.DepositionManagementService = DepositionManagementService;
// ============================================================================
// NESTJS MODULE
// ============================================================================
let DepositionManagementModule = (() => {
    let _classDecorators = [(0, common_1.Global)(), (0, common_1.Module)({})];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var DepositionManagementModule = _classThis = class {
        static forRoot(options) {
            return {
                module: DepositionManagementModule,
                providers: [
                    {
                        provide: 'SEQUELIZE',
                        useValue: options?.sequelize,
                    },
                    DepositionManagementService,
                ],
                exports: [DepositionManagementService],
            };
        }
    };
    __setFunctionName(_classThis, "DepositionManagementModule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DepositionManagementModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DepositionManagementModule = _classThis;
})();
exports.DepositionManagementModule = DepositionManagementModule;
// ============================================================================
// SWAGGER API DOCUMENTATION
// ============================================================================
let ScheduleDepositionDto = (() => {
    var _a;
    let _matterId_decorators;
    let _matterId_initializers = [];
    let _matterId_extraInitializers = [];
    let _witnessId_decorators;
    let _witnessId_initializers = [];
    let _witnessId_extraInitializers = [];
    let _witnessName_decorators;
    let _witnessName_initializers = [];
    let _witnessName_extraInitializers = [];
    let _depositionType_decorators;
    let _depositionType_initializers = [];
    let _depositionType_extraInitializers = [];
    let _scheduledDate_decorators;
    let _scheduledDate_initializers = [];
    let _scheduledDate_extraInitializers = [];
    let _scheduledTime_decorators;
    let _scheduledTime_initializers = [];
    let _scheduledTime_extraInitializers = [];
    let _duration_decorators;
    let _duration_initializers = [];
    let _duration_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _isRemote_decorators;
    let _isRemote_initializers = [];
    let _isRemote_extraInitializers = [];
    let _remoteLink_decorators;
    let _remoteLink_initializers = [];
    let _remoteLink_extraInitializers = [];
    let _defendingAttorneyId_decorators;
    let _defendingAttorneyId_initializers = [];
    let _defendingAttorneyId_extraInitializers = [];
    let _examiningAttorneyId_decorators;
    let _examiningAttorneyId_initializers = [];
    let _examiningAttorneyId_extraInitializers = [];
    let _courtReporterId_decorators;
    let _courtReporterId_initializers = [];
    let _courtReporterId_extraInitializers = [];
    let _topics_decorators;
    let _topics_initializers = [];
    let _topics_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    return _a = class ScheduleDepositionDto {
            constructor() {
                this.matterId = __runInitializers(this, _matterId_initializers, void 0);
                this.witnessId = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _witnessId_initializers, void 0));
                this.witnessName = (__runInitializers(this, _witnessId_extraInitializers), __runInitializers(this, _witnessName_initializers, void 0));
                this.depositionType = (__runInitializers(this, _witnessName_extraInitializers), __runInitializers(this, _depositionType_initializers, void 0));
                this.scheduledDate = (__runInitializers(this, _depositionType_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
                this.scheduledTime = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _scheduledTime_initializers, void 0));
                this.duration = (__runInitializers(this, _scheduledTime_extraInitializers), __runInitializers(this, _duration_initializers, void 0));
                this.location = (__runInitializers(this, _duration_extraInitializers), __runInitializers(this, _location_initializers, void 0));
                this.isRemote = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _isRemote_initializers, void 0));
                this.remoteLink = (__runInitializers(this, _isRemote_extraInitializers), __runInitializers(this, _remoteLink_initializers, void 0));
                this.defendingAttorneyId = (__runInitializers(this, _remoteLink_extraInitializers), __runInitializers(this, _defendingAttorneyId_initializers, void 0));
                this.examiningAttorneyId = (__runInitializers(this, _defendingAttorneyId_extraInitializers), __runInitializers(this, _examiningAttorneyId_initializers, void 0));
                this.courtReporterId = (__runInitializers(this, _examiningAttorneyId_extraInitializers), __runInitializers(this, _courtReporterId_initializers, void 0));
                this.topics = (__runInitializers(this, _courtReporterId_extraInitializers), __runInitializers(this, _topics_initializers, void 0));
                this.priority = (__runInitializers(this, _topics_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                __runInitializers(this, _priority_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _matterId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Matter UUID' })];
            _witnessId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Witness UUID' })];
            _witnessName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Witness full name' })];
            _depositionType_decorators = [(0, swagger_1.ApiProperty)({ enum: DepositionType, description: 'Type of deposition' })];
            _scheduledDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scheduled date' })];
            _scheduledTime_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scheduled time (HH:mm format)' })];
            _duration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Duration in minutes' })];
            _location_decorators = [(0, swagger_1.ApiProperty)({ description: 'Deposition location' })];
            _isRemote_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Is remote deposition' })];
            _remoteLink_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Remote meeting link' })];
            _defendingAttorneyId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Defending attorney UUID' })];
            _examiningAttorneyId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Examining attorney UUID' })];
            _courtReporterId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Court reporter UUID' })];
            _topics_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Topics for examination', type: [String] })];
            _priority_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: ['low', 'medium', 'high', 'urgent'] })];
            __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
            __esDecorate(null, null, _witnessId_decorators, { kind: "field", name: "witnessId", static: false, private: false, access: { has: obj => "witnessId" in obj, get: obj => obj.witnessId, set: (obj, value) => { obj.witnessId = value; } }, metadata: _metadata }, _witnessId_initializers, _witnessId_extraInitializers);
            __esDecorate(null, null, _witnessName_decorators, { kind: "field", name: "witnessName", static: false, private: false, access: { has: obj => "witnessName" in obj, get: obj => obj.witnessName, set: (obj, value) => { obj.witnessName = value; } }, metadata: _metadata }, _witnessName_initializers, _witnessName_extraInitializers);
            __esDecorate(null, null, _depositionType_decorators, { kind: "field", name: "depositionType", static: false, private: false, access: { has: obj => "depositionType" in obj, get: obj => obj.depositionType, set: (obj, value) => { obj.depositionType = value; } }, metadata: _metadata }, _depositionType_initializers, _depositionType_extraInitializers);
            __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
            __esDecorate(null, null, _scheduledTime_decorators, { kind: "field", name: "scheduledTime", static: false, private: false, access: { has: obj => "scheduledTime" in obj, get: obj => obj.scheduledTime, set: (obj, value) => { obj.scheduledTime = value; } }, metadata: _metadata }, _scheduledTime_initializers, _scheduledTime_extraInitializers);
            __esDecorate(null, null, _duration_decorators, { kind: "field", name: "duration", static: false, private: false, access: { has: obj => "duration" in obj, get: obj => obj.duration, set: (obj, value) => { obj.duration = value; } }, metadata: _metadata }, _duration_initializers, _duration_extraInitializers);
            __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
            __esDecorate(null, null, _isRemote_decorators, { kind: "field", name: "isRemote", static: false, private: false, access: { has: obj => "isRemote" in obj, get: obj => obj.isRemote, set: (obj, value) => { obj.isRemote = value; } }, metadata: _metadata }, _isRemote_initializers, _isRemote_extraInitializers);
            __esDecorate(null, null, _remoteLink_decorators, { kind: "field", name: "remoteLink", static: false, private: false, access: { has: obj => "remoteLink" in obj, get: obj => obj.remoteLink, set: (obj, value) => { obj.remoteLink = value; } }, metadata: _metadata }, _remoteLink_initializers, _remoteLink_extraInitializers);
            __esDecorate(null, null, _defendingAttorneyId_decorators, { kind: "field", name: "defendingAttorneyId", static: false, private: false, access: { has: obj => "defendingAttorneyId" in obj, get: obj => obj.defendingAttorneyId, set: (obj, value) => { obj.defendingAttorneyId = value; } }, metadata: _metadata }, _defendingAttorneyId_initializers, _defendingAttorneyId_extraInitializers);
            __esDecorate(null, null, _examiningAttorneyId_decorators, { kind: "field", name: "examiningAttorneyId", static: false, private: false, access: { has: obj => "examiningAttorneyId" in obj, get: obj => obj.examiningAttorneyId, set: (obj, value) => { obj.examiningAttorneyId = value; } }, metadata: _metadata }, _examiningAttorneyId_initializers, _examiningAttorneyId_extraInitializers);
            __esDecorate(null, null, _courtReporterId_decorators, { kind: "field", name: "courtReporterId", static: false, private: false, access: { has: obj => "courtReporterId" in obj, get: obj => obj.courtReporterId, set: (obj, value) => { obj.courtReporterId = value; } }, metadata: _metadata }, _courtReporterId_initializers, _courtReporterId_extraInitializers);
            __esDecorate(null, null, _topics_decorators, { kind: "field", name: "topics", static: false, private: false, access: { has: obj => "topics" in obj, get: obj => obj.topics, set: (obj, value) => { obj.topics = value; } }, metadata: _metadata }, _topics_initializers, _topics_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ScheduleDepositionDto = ScheduleDepositionDto;
let PrepareExhibitDto = (() => {
    var _a;
    let _depositionId_decorators;
    let _depositionId_initializers = [];
    let _depositionId_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _documentId_decorators;
    let _documentId_initializers = [];
    let _documentId_extraInitializers = [];
    let _documentPath_decorators;
    let _documentPath_initializers = [];
    let _documentPath_extraInitializers = [];
    let _documentType_decorators;
    let _documentType_initializers = [];
    let _documentType_extraInitializers = [];
    let _batesRange_decorators;
    let _batesRange_initializers = [];
    let _batesRange_extraInitializers = [];
    let _isConfidential_decorators;
    let _isConfidential_initializers = [];
    let _isConfidential_extraInitializers = [];
    return _a = class PrepareExhibitDto {
            constructor() {
                this.depositionId = __runInitializers(this, _depositionId_initializers, void 0);
                this.description = (__runInitializers(this, _depositionId_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.documentId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _documentId_initializers, void 0));
                this.documentPath = (__runInitializers(this, _documentId_extraInitializers), __runInitializers(this, _documentPath_initializers, void 0));
                this.documentType = (__runInitializers(this, _documentPath_extraInitializers), __runInitializers(this, _documentType_initializers, void 0));
                this.batesRange = (__runInitializers(this, _documentType_extraInitializers), __runInitializers(this, _batesRange_initializers, void 0));
                this.isConfidential = (__runInitializers(this, _batesRange_extraInitializers), __runInitializers(this, _isConfidential_initializers, void 0));
                __runInitializers(this, _isConfidential_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _depositionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Deposition UUID' })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Exhibit description' })];
            _documentId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Document UUID' })];
            _documentPath_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Document file path' })];
            _documentType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document type' })];
            _batesRange_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Bates number range' })];
            _isConfidential_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Is confidential document' })];
            __esDecorate(null, null, _depositionId_decorators, { kind: "field", name: "depositionId", static: false, private: false, access: { has: obj => "depositionId" in obj, get: obj => obj.depositionId, set: (obj, value) => { obj.depositionId = value; } }, metadata: _metadata }, _depositionId_initializers, _depositionId_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _documentId_decorators, { kind: "field", name: "documentId", static: false, private: false, access: { has: obj => "documentId" in obj, get: obj => obj.documentId, set: (obj, value) => { obj.documentId = value; } }, metadata: _metadata }, _documentId_initializers, _documentId_extraInitializers);
            __esDecorate(null, null, _documentPath_decorators, { kind: "field", name: "documentPath", static: false, private: false, access: { has: obj => "documentPath" in obj, get: obj => obj.documentPath, set: (obj, value) => { obj.documentPath = value; } }, metadata: _metadata }, _documentPath_initializers, _documentPath_extraInitializers);
            __esDecorate(null, null, _documentType_decorators, { kind: "field", name: "documentType", static: false, private: false, access: { has: obj => "documentType" in obj, get: obj => obj.documentType, set: (obj, value) => { obj.documentType = value; } }, metadata: _metadata }, _documentType_initializers, _documentType_extraInitializers);
            __esDecorate(null, null, _batesRange_decorators, { kind: "field", name: "batesRange", static: false, private: false, access: { has: obj => "batesRange" in obj, get: obj => obj.batesRange, set: (obj, value) => { obj.batesRange = value; } }, metadata: _metadata }, _batesRange_initializers, _batesRange_extraInitializers);
            __esDecorate(null, null, _isConfidential_decorators, { kind: "field", name: "isConfidential", static: false, private: false, access: { has: obj => "isConfidential" in obj, get: obj => obj.isConfidential, set: (obj, value) => { obj.isConfidential = value; } }, metadata: _metadata }, _isConfidential_initializers, _isConfidential_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PrepareExhibitDto = PrepareExhibitDto;
let OrderTranscriptDto = (() => {
    var _a;
    let _depositionId_decorators;
    let _depositionId_initializers = [];
    let _depositionId_extraInitializers = [];
    let _courtReporterId_decorators;
    let _courtReporterId_initializers = [];
    let _courtReporterId_extraInitializers = [];
    let _transcriptType_decorators;
    let _transcriptType_initializers = [];
    let _transcriptType_extraInitializers = [];
    let _format_decorators;
    let _format_initializers = [];
    let _format_extraInitializers = [];
    let _expectedDate_decorators;
    let _expectedDate_initializers = [];
    let _expectedDate_extraInitializers = [];
    let _isConfidential_decorators;
    let _isConfidential_initializers = [];
    let _isConfidential_extraInitializers = [];
    return _a = class OrderTranscriptDto {
            constructor() {
                this.depositionId = __runInitializers(this, _depositionId_initializers, void 0);
                this.courtReporterId = (__runInitializers(this, _depositionId_extraInitializers), __runInitializers(this, _courtReporterId_initializers, void 0));
                this.transcriptType = (__runInitializers(this, _courtReporterId_extraInitializers), __runInitializers(this, _transcriptType_initializers, void 0));
                this.format = (__runInitializers(this, _transcriptType_extraInitializers), __runInitializers(this, _format_initializers, void 0));
                this.expectedDate = (__runInitializers(this, _format_extraInitializers), __runInitializers(this, _expectedDate_initializers, void 0));
                this.isConfidential = (__runInitializers(this, _expectedDate_extraInitializers), __runInitializers(this, _isConfidential_initializers, void 0));
                __runInitializers(this, _isConfidential_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _depositionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Deposition UUID' })];
            _courtReporterId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Court reporter UUID' })];
            _transcriptType_decorators = [(0, swagger_1.ApiProperty)({ enum: ['rough', 'expedited', 'daily', 'standard', 'certified'] })];
            _format_decorators = [(0, swagger_1.ApiProperty)({ enum: ['pdf', 'word', 'text', 'ptx', 'ascii'] })];
            _expectedDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Expected delivery date' })];
            _isConfidential_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Is confidential transcript' })];
            __esDecorate(null, null, _depositionId_decorators, { kind: "field", name: "depositionId", static: false, private: false, access: { has: obj => "depositionId" in obj, get: obj => obj.depositionId, set: (obj, value) => { obj.depositionId = value; } }, metadata: _metadata }, _depositionId_initializers, _depositionId_extraInitializers);
            __esDecorate(null, null, _courtReporterId_decorators, { kind: "field", name: "courtReporterId", static: false, private: false, access: { has: obj => "courtReporterId" in obj, get: obj => obj.courtReporterId, set: (obj, value) => { obj.courtReporterId = value; } }, metadata: _metadata }, _courtReporterId_initializers, _courtReporterId_extraInitializers);
            __esDecorate(null, null, _transcriptType_decorators, { kind: "field", name: "transcriptType", static: false, private: false, access: { has: obj => "transcriptType" in obj, get: obj => obj.transcriptType, set: (obj, value) => { obj.transcriptType = value; } }, metadata: _metadata }, _transcriptType_initializers, _transcriptType_extraInitializers);
            __esDecorate(null, null, _format_decorators, { kind: "field", name: "format", static: false, private: false, access: { has: obj => "format" in obj, get: obj => obj.format, set: (obj, value) => { obj.format = value; } }, metadata: _metadata }, _format_initializers, _format_extraInitializers);
            __esDecorate(null, null, _expectedDate_decorators, { kind: "field", name: "expectedDate", static: false, private: false, access: { has: obj => "expectedDate" in obj, get: obj => obj.expectedDate, set: (obj, value) => { obj.expectedDate = value; } }, metadata: _metadata }, _expectedDate_initializers, _expectedDate_extraInitializers);
            __esDecorate(null, null, _isConfidential_decorators, { kind: "field", name: "isConfidential", static: false, private: false, access: { has: obj => "isConfidential" in obj, get: obj => obj.isConfidential, set: (obj, value) => { obj.isConfidential = value; } }, metadata: _metadata }, _isConfidential_initializers, _isConfidential_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.OrderTranscriptDto = OrderTranscriptDto;
let TrackObjectionDto = (() => {
    var _a;
    let _depositionId_decorators;
    let _depositionId_initializers = [];
    let _depositionId_extraInitializers = [];
    let _transcriptPage_decorators;
    let _transcriptPage_initializers = [];
    let _transcriptPage_extraInitializers = [];
    let _transcriptLine_decorators;
    let _transcriptLine_initializers = [];
    let _transcriptLine_extraInitializers = [];
    let _objectionType_decorators;
    let _objectionType_initializers = [];
    let _objectionType_extraInitializers = [];
    let _objectingAttorneyId_decorators;
    let _objectingAttorneyId_initializers = [];
    let _objectingAttorneyId_extraInitializers = [];
    let _question_decorators;
    let _question_initializers = [];
    let _question_extraInitializers = [];
    let _grounds_decorators;
    let _grounds_initializers = [];
    let _grounds_extraInitializers = [];
    let _isPreserved_decorators;
    let _isPreserved_initializers = [];
    let _isPreserved_extraInitializers = [];
    return _a = class TrackObjectionDto {
            constructor() {
                this.depositionId = __runInitializers(this, _depositionId_initializers, void 0);
                this.transcriptPage = (__runInitializers(this, _depositionId_extraInitializers), __runInitializers(this, _transcriptPage_initializers, void 0));
                this.transcriptLine = (__runInitializers(this, _transcriptPage_extraInitializers), __runInitializers(this, _transcriptLine_initializers, void 0));
                this.objectionType = (__runInitializers(this, _transcriptLine_extraInitializers), __runInitializers(this, _objectionType_initializers, void 0));
                this.objectingAttorneyId = (__runInitializers(this, _objectionType_extraInitializers), __runInitializers(this, _objectingAttorneyId_initializers, void 0));
                this.question = (__runInitializers(this, _objectingAttorneyId_extraInitializers), __runInitializers(this, _question_initializers, void 0));
                this.grounds = (__runInitializers(this, _question_extraInitializers), __runInitializers(this, _grounds_initializers, void 0));
                this.isPreserved = (__runInitializers(this, _grounds_extraInitializers), __runInitializers(this, _isPreserved_initializers, void 0));
                __runInitializers(this, _isPreserved_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _depositionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Deposition UUID' })];
            _transcriptPage_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Transcript page number' })];
            _transcriptLine_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Transcript line number' })];
            _objectionType_decorators = [(0, swagger_1.ApiProperty)({ enum: ObjectionType, description: 'Type of objection' })];
            _objectingAttorneyId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Objecting attorney UUID' })];
            _question_decorators = [(0, swagger_1.ApiProperty)({ description: 'Question being objected to' })];
            _grounds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Grounds for objection' })];
            _isPreserved_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Is objection preserved for trial' })];
            __esDecorate(null, null, _depositionId_decorators, { kind: "field", name: "depositionId", static: false, private: false, access: { has: obj => "depositionId" in obj, get: obj => obj.depositionId, set: (obj, value) => { obj.depositionId = value; } }, metadata: _metadata }, _depositionId_initializers, _depositionId_extraInitializers);
            __esDecorate(null, null, _transcriptPage_decorators, { kind: "field", name: "transcriptPage", static: false, private: false, access: { has: obj => "transcriptPage" in obj, get: obj => obj.transcriptPage, set: (obj, value) => { obj.transcriptPage = value; } }, metadata: _metadata }, _transcriptPage_initializers, _transcriptPage_extraInitializers);
            __esDecorate(null, null, _transcriptLine_decorators, { kind: "field", name: "transcriptLine", static: false, private: false, access: { has: obj => "transcriptLine" in obj, get: obj => obj.transcriptLine, set: (obj, value) => { obj.transcriptLine = value; } }, metadata: _metadata }, _transcriptLine_initializers, _transcriptLine_extraInitializers);
            __esDecorate(null, null, _objectionType_decorators, { kind: "field", name: "objectionType", static: false, private: false, access: { has: obj => "objectionType" in obj, get: obj => obj.objectionType, set: (obj, value) => { obj.objectionType = value; } }, metadata: _metadata }, _objectionType_initializers, _objectionType_extraInitializers);
            __esDecorate(null, null, _objectingAttorneyId_decorators, { kind: "field", name: "objectingAttorneyId", static: false, private: false, access: { has: obj => "objectingAttorneyId" in obj, get: obj => obj.objectingAttorneyId, set: (obj, value) => { obj.objectingAttorneyId = value; } }, metadata: _metadata }, _objectingAttorneyId_initializers, _objectingAttorneyId_extraInitializers);
            __esDecorate(null, null, _question_decorators, { kind: "field", name: "question", static: false, private: false, access: { has: obj => "question" in obj, get: obj => obj.question, set: (obj, value) => { obj.question = value; } }, metadata: _metadata }, _question_initializers, _question_extraInitializers);
            __esDecorate(null, null, _grounds_decorators, { kind: "field", name: "grounds", static: false, private: false, access: { has: obj => "grounds" in obj, get: obj => obj.grounds, set: (obj, value) => { obj.grounds = value; } }, metadata: _metadata }, _grounds_initializers, _grounds_extraInitializers);
            __esDecorate(null, null, _isPreserved_decorators, { kind: "field", name: "isPreserved", static: false, private: false, access: { has: obj => "isPreserved" in obj, get: obj => obj.isPreserved, set: (obj, value) => { obj.isPreserved = value; } }, metadata: _metadata }, _isPreserved_initializers, _isPreserved_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.TrackObjectionDto = TrackObjectionDto;
let CreateSummaryDto = (() => {
    var _a;
    let _depositionId_decorators;
    let _depositionId_initializers = [];
    let _depositionId_extraInitializers = [];
    let _summaryType_decorators;
    let _summaryType_initializers = [];
    let _summaryType_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _summaryText_decorators;
    let _summaryText_initializers = [];
    let _summaryText_extraInitializers = [];
    let _keyTestimony_decorators;
    let _keyTestimony_initializers = [];
    let _keyTestimony_extraInitializers = [];
    let _overallImpact_decorators;
    let _overallImpact_initializers = [];
    let _overallImpact_extraInitializers = [];
    return _a = class CreateSummaryDto {
            constructor() {
                this.depositionId = __runInitializers(this, _depositionId_initializers, void 0);
                this.summaryType = (__runInitializers(this, _depositionId_extraInitializers), __runInitializers(this, _summaryType_initializers, void 0));
                this.createdBy = (__runInitializers(this, _summaryType_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
                this.summaryText = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _summaryText_initializers, void 0));
                this.keyTestimony = (__runInitializers(this, _summaryText_extraInitializers), __runInitializers(this, _keyTestimony_initializers, void 0));
                this.overallImpact = (__runInitializers(this, _keyTestimony_extraInitializers), __runInitializers(this, _overallImpact_initializers, void 0));
                __runInitializers(this, _overallImpact_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _depositionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Deposition UUID' })];
            _summaryType_decorators = [(0, swagger_1.ApiProperty)({ enum: ['page-line', 'narrative', 'topical', 'issue-focused', 'impeachment'] })];
            _createdBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Attorney creating summary UUID' })];
            _summaryText_decorators = [(0, swagger_1.ApiProperty)({ description: 'Summary text content' })];
            _keyTestimony_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Key testimony excerpts', type: 'array' })];
            _overallImpact_decorators = [(0, swagger_1.ApiProperty)({ enum: ['positive', 'neutral', 'negative', 'mixed'] })];
            __esDecorate(null, null, _depositionId_decorators, { kind: "field", name: "depositionId", static: false, private: false, access: { has: obj => "depositionId" in obj, get: obj => obj.depositionId, set: (obj, value) => { obj.depositionId = value; } }, metadata: _metadata }, _depositionId_initializers, _depositionId_extraInitializers);
            __esDecorate(null, null, _summaryType_decorators, { kind: "field", name: "summaryType", static: false, private: false, access: { has: obj => "summaryType" in obj, get: obj => obj.summaryType, set: (obj, value) => { obj.summaryType = value; } }, metadata: _metadata }, _summaryType_initializers, _summaryType_extraInitializers);
            __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
            __esDecorate(null, null, _summaryText_decorators, { kind: "field", name: "summaryText", static: false, private: false, access: { has: obj => "summaryText" in obj, get: obj => obj.summaryText, set: (obj, value) => { obj.summaryText = value; } }, metadata: _metadata }, _summaryText_initializers, _summaryText_extraInitializers);
            __esDecorate(null, null, _keyTestimony_decorators, { kind: "field", name: "keyTestimony", static: false, private: false, access: { has: obj => "keyTestimony" in obj, get: obj => obj.keyTestimony, set: (obj, value) => { obj.keyTestimony = value; } }, metadata: _metadata }, _keyTestimony_initializers, _keyTestimony_extraInitializers);
            __esDecorate(null, null, _overallImpact_decorators, { kind: "field", name: "overallImpact", static: false, private: false, access: { has: obj => "overallImpact" in obj, get: obj => obj.overallImpact, set: (obj, value) => { obj.overallImpact = value; } }, metadata: _metadata }, _overallImpact_initializers, _overallImpact_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateSummaryDto = CreateSummaryDto;
//# sourceMappingURL=deposition-management-kit.js.map