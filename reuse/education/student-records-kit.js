"use strict";
/**
 * LOC: EDU-RECORDS-001
 * File: /reuse/education/student-records-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - crypto (encryption)
 *
 * DOWNSTREAM (imported by):
 *   - Backend education modules
 *   - Registrar services
 *   - Records management services
 *   - Compliance reporting modules
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDegreeAudit = exports.validateEncryptionCompliance = exports.encryptStudentRecords = exports.performSecurityAudit = exports.generateRetentionReport = exports.destroyExpiredRecords = exports.scheduleRecordsDestruction = exports.retrieveArchivedRecords = exports.archiveStudentRecords = exports.checkRecordsHolds = exports.releaseRecordsHold = exports.placeRecordsHold = exports.approveGradeChange = exports.createGradeChangeRequest = exports.createEnrollmentVerificationLetter = exports.generateDegreeVerification = exports.verifyTranscriptAuthenticity = exports.generateOfficialTranscript = exports.createTranscriptRequest = exports.cancelRecordsRequest = exports.getPendingRecordsRequests = exports.completeRecordsRequest = exports.processRecordsRequest = exports.createRecordsRequest = exports.decryptRecordData = exports.encryptRecordData = exports.generateFERPAComplianceReport = exports.validateRecordDisclosure = exports.getFERPAAuditLog = exports.logRecordAccess = exports.checkDirectoryOptOut = exports.revokeFERPAConsent = exports.validateFERPAAuthorization = exports.createFERPAConsent = exports.verifyEducationalRecord = exports.addEducationalRecord = exports.calculateCumulativeGPA = exports.createAcademicHistory = exports.getStudentRecords = exports.lockStudentRecord = exports.updateStudentRecord = exports.getStudentRecord = exports.createStudentRecord = exports.createEducationalRecordModel = exports.createAcademicHistoryModel = exports.createStudentRecordModel = exports.RecordsRequestDto = exports.FERPAConsentDto = exports.TranscriptRequestDto = exports.CreateRecordDto = void 0;
exports.generateStudentHistoryReport = void 0;
/**
 * File: /reuse/education/student-records-kit.ts
 * Locator: WC-EDU-RECORDS-001
 * Purpose: Comprehensive Student Records Management - Ellucian SIS-level records management with FERPA compliance
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, Node crypto
 * Downstream: ../backend/education/*, Registrar Office, Records Management, Compliance
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for records management, FERPA compliance, verification, archival, security
 *
 * LLM Context: Enterprise-grade student records management for higher education SIS.
 * Provides comprehensive student records management, FERPA compliance, records request processing,
 * verification services, change of records, transcript management, records holds and locks,
 * records archival and retention, encryption and security, audit logging, electronic signature support,
 * and full compliance with federal education privacy regulations.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
const crypto = __importStar(require("crypto"));
// ============================================================================
// DTO CLASSES
// ============================================================================
let CreateRecordDto = (() => {
    var _a;
    let _studentId_decorators;
    let _studentId_initializers = [];
    let _studentId_extraInitializers = [];
    let _recordType_decorators;
    let _recordType_initializers = [];
    let _recordType_extraInitializers = [];
    let _academicYear_decorators;
    let _academicYear_initializers = [];
    let _academicYear_extraInitializers = [];
    let _termId_decorators;
    let _termId_initializers = [];
    let _termId_extraInitializers = [];
    let _recordData_decorators;
    let _recordData_initializers = [];
    let _recordData_extraInitializers = [];
    let _isOfficial_decorators;
    let _isOfficial_initializers = [];
    let _isOfficial_extraInitializers = [];
    let _isPermanent_decorators;
    let _isPermanent_initializers = [];
    let _isPermanent_extraInitializers = [];
    let _ferpaProtected_decorators;
    let _ferpaProtected_initializers = [];
    let _ferpaProtected_extraInitializers = [];
    return _a = class CreateRecordDto {
            constructor() {
                this.studentId = __runInitializers(this, _studentId_initializers, void 0);
                this.recordType = (__runInitializers(this, _studentId_extraInitializers), __runInitializers(this, _recordType_initializers, void 0));
                this.academicYear = (__runInitializers(this, _recordType_extraInitializers), __runInitializers(this, _academicYear_initializers, void 0));
                this.termId = (__runInitializers(this, _academicYear_extraInitializers), __runInitializers(this, _termId_initializers, void 0));
                this.recordData = (__runInitializers(this, _termId_extraInitializers), __runInitializers(this, _recordData_initializers, void 0));
                this.isOfficial = (__runInitializers(this, _recordData_extraInitializers), __runInitializers(this, _isOfficial_initializers, void 0));
                this.isPermanent = (__runInitializers(this, _isOfficial_extraInitializers), __runInitializers(this, _isPermanent_initializers, void 0));
                this.ferpaProtected = (__runInitializers(this, _isPermanent_extraInitializers), __runInitializers(this, _ferpaProtected_initializers, void 0));
                __runInitializers(this, _ferpaProtected_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _studentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Student ID' })];
            _recordType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Record type', enum: ['academic', 'disciplinary', 'medical', 'financial', 'enrollment', 'transcript'] })];
            _academicYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Academic year' })];
            _termId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Term ID' })];
            _recordData_decorators = [(0, swagger_1.ApiProperty)({ description: 'Record data as JSON' })];
            _isOfficial_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is official record', default: true })];
            _isPermanent_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is permanent record', default: false })];
            _ferpaProtected_decorators = [(0, swagger_1.ApiProperty)({ description: 'FERPA protected', default: true })];
            __esDecorate(null, null, _studentId_decorators, { kind: "field", name: "studentId", static: false, private: false, access: { has: obj => "studentId" in obj, get: obj => obj.studentId, set: (obj, value) => { obj.studentId = value; } }, metadata: _metadata }, _studentId_initializers, _studentId_extraInitializers);
            __esDecorate(null, null, _recordType_decorators, { kind: "field", name: "recordType", static: false, private: false, access: { has: obj => "recordType" in obj, get: obj => obj.recordType, set: (obj, value) => { obj.recordType = value; } }, metadata: _metadata }, _recordType_initializers, _recordType_extraInitializers);
            __esDecorate(null, null, _academicYear_decorators, { kind: "field", name: "academicYear", static: false, private: false, access: { has: obj => "academicYear" in obj, get: obj => obj.academicYear, set: (obj, value) => { obj.academicYear = value; } }, metadata: _metadata }, _academicYear_initializers, _academicYear_extraInitializers);
            __esDecorate(null, null, _termId_decorators, { kind: "field", name: "termId", static: false, private: false, access: { has: obj => "termId" in obj, get: obj => obj.termId, set: (obj, value) => { obj.termId = value; } }, metadata: _metadata }, _termId_initializers, _termId_extraInitializers);
            __esDecorate(null, null, _recordData_decorators, { kind: "field", name: "recordData", static: false, private: false, access: { has: obj => "recordData" in obj, get: obj => obj.recordData, set: (obj, value) => { obj.recordData = value; } }, metadata: _metadata }, _recordData_initializers, _recordData_extraInitializers);
            __esDecorate(null, null, _isOfficial_decorators, { kind: "field", name: "isOfficial", static: false, private: false, access: { has: obj => "isOfficial" in obj, get: obj => obj.isOfficial, set: (obj, value) => { obj.isOfficial = value; } }, metadata: _metadata }, _isOfficial_initializers, _isOfficial_extraInitializers);
            __esDecorate(null, null, _isPermanent_decorators, { kind: "field", name: "isPermanent", static: false, private: false, access: { has: obj => "isPermanent" in obj, get: obj => obj.isPermanent, set: (obj, value) => { obj.isPermanent = value; } }, metadata: _metadata }, _isPermanent_initializers, _isPermanent_extraInitializers);
            __esDecorate(null, null, _ferpaProtected_decorators, { kind: "field", name: "ferpaProtected", static: false, private: false, access: { has: obj => "ferpaProtected" in obj, get: obj => obj.ferpaProtected, set: (obj, value) => { obj.ferpaProtected = value; } }, metadata: _metadata }, _ferpaProtected_initializers, _ferpaProtected_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateRecordDto = CreateRecordDto;
let TranscriptRequestDto = (() => {
    var _a;
    let _studentId_decorators;
    let _studentId_initializers = [];
    let _studentId_extraInitializers = [];
    let _transcriptType_decorators;
    let _transcriptType_initializers = [];
    let _transcriptType_extraInitializers = [];
    let _recipientName_decorators;
    let _recipientName_initializers = [];
    let _recipientName_extraInitializers = [];
    let _recipientEmail_decorators;
    let _recipientEmail_initializers = [];
    let _recipientEmail_extraInitializers = [];
    let _deliveryMethod_decorators;
    let _deliveryMethod_initializers = [];
    let _deliveryMethod_extraInitializers = [];
    let _includeGrades_decorators;
    let _includeGrades_initializers = [];
    let _includeGrades_extraInitializers = [];
    let _includeDegrees_decorators;
    let _includeDegrees_initializers = [];
    let _includeDegrees_extraInitializers = [];
    return _a = class TranscriptRequestDto {
            constructor() {
                this.studentId = __runInitializers(this, _studentId_initializers, void 0);
                this.transcriptType = (__runInitializers(this, _studentId_extraInitializers), __runInitializers(this, _transcriptType_initializers, void 0));
                this.recipientName = (__runInitializers(this, _transcriptType_extraInitializers), __runInitializers(this, _recipientName_initializers, void 0));
                this.recipientEmail = (__runInitializers(this, _recipientName_extraInitializers), __runInitializers(this, _recipientEmail_initializers, void 0));
                this.deliveryMethod = (__runInitializers(this, _recipientEmail_extraInitializers), __runInitializers(this, _deliveryMethod_initializers, void 0));
                this.includeGrades = (__runInitializers(this, _deliveryMethod_extraInitializers), __runInitializers(this, _includeGrades_initializers, void 0));
                this.includeDegrees = (__runInitializers(this, _includeGrades_extraInitializers), __runInitializers(this, _includeDegrees_initializers, void 0));
                __runInitializers(this, _includeDegrees_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _studentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Student ID' })];
            _transcriptType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transcript type', enum: ['official', 'unofficial', 'academic-progress'] })];
            _recipientName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recipient name' })];
            _recipientEmail_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recipient email', required: false })];
            _deliveryMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Delivery method', enum: ['mail', 'electronic', 'pickup', 'fax'] })];
            _includeGrades_decorators = [(0, swagger_1.ApiProperty)({ description: 'Include grades', default: true })];
            _includeDegrees_decorators = [(0, swagger_1.ApiProperty)({ description: 'Include degrees', default: true })];
            __esDecorate(null, null, _studentId_decorators, { kind: "field", name: "studentId", static: false, private: false, access: { has: obj => "studentId" in obj, get: obj => obj.studentId, set: (obj, value) => { obj.studentId = value; } }, metadata: _metadata }, _studentId_initializers, _studentId_extraInitializers);
            __esDecorate(null, null, _transcriptType_decorators, { kind: "field", name: "transcriptType", static: false, private: false, access: { has: obj => "transcriptType" in obj, get: obj => obj.transcriptType, set: (obj, value) => { obj.transcriptType = value; } }, metadata: _metadata }, _transcriptType_initializers, _transcriptType_extraInitializers);
            __esDecorate(null, null, _recipientName_decorators, { kind: "field", name: "recipientName", static: false, private: false, access: { has: obj => "recipientName" in obj, get: obj => obj.recipientName, set: (obj, value) => { obj.recipientName = value; } }, metadata: _metadata }, _recipientName_initializers, _recipientName_extraInitializers);
            __esDecorate(null, null, _recipientEmail_decorators, { kind: "field", name: "recipientEmail", static: false, private: false, access: { has: obj => "recipientEmail" in obj, get: obj => obj.recipientEmail, set: (obj, value) => { obj.recipientEmail = value; } }, metadata: _metadata }, _recipientEmail_initializers, _recipientEmail_extraInitializers);
            __esDecorate(null, null, _deliveryMethod_decorators, { kind: "field", name: "deliveryMethod", static: false, private: false, access: { has: obj => "deliveryMethod" in obj, get: obj => obj.deliveryMethod, set: (obj, value) => { obj.deliveryMethod = value; } }, metadata: _metadata }, _deliveryMethod_initializers, _deliveryMethod_extraInitializers);
            __esDecorate(null, null, _includeGrades_decorators, { kind: "field", name: "includeGrades", static: false, private: false, access: { has: obj => "includeGrades" in obj, get: obj => obj.includeGrades, set: (obj, value) => { obj.includeGrades = value; } }, metadata: _metadata }, _includeGrades_initializers, _includeGrades_extraInitializers);
            __esDecorate(null, null, _includeDegrees_decorators, { kind: "field", name: "includeDegrees", static: false, private: false, access: { has: obj => "includeDegrees" in obj, get: obj => obj.includeDegrees, set: (obj, value) => { obj.includeDegrees = value; } }, metadata: _metadata }, _includeDegrees_initializers, _includeDegrees_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.TranscriptRequestDto = TranscriptRequestDto;
let FERPAConsentDto = (() => {
    var _a;
    let _studentId_decorators;
    let _studentId_initializers = [];
    let _studentId_extraInitializers = [];
    let _consentType_decorators;
    let _consentType_initializers = [];
    let _consentType_extraInitializers = [];
    let _grantedTo_decorators;
    let _grantedTo_initializers = [];
    let _grantedTo_extraInitializers = [];
    let _purpose_decorators;
    let _purpose_initializers = [];
    let _purpose_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    return _a = class FERPAConsentDto {
            constructor() {
                this.studentId = __runInitializers(this, _studentId_initializers, void 0);
                this.consentType = (__runInitializers(this, _studentId_extraInitializers), __runInitializers(this, _consentType_initializers, void 0));
                this.grantedTo = (__runInitializers(this, _consentType_extraInitializers), __runInitializers(this, _grantedTo_initializers, void 0));
                this.purpose = (__runInitializers(this, _grantedTo_extraInitializers), __runInitializers(this, _purpose_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _purpose_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.expirationDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
                __runInitializers(this, _expirationDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _studentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Student ID' })];
            _consentType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Consent type', enum: ['directory-information', 'educational-records', 'third-party-disclosure'] })];
            _grantedTo_decorators = [(0, swagger_1.ApiProperty)({ description: 'Granted to (organization/person)', required: false })];
            _purpose_decorators = [(0, swagger_1.ApiProperty)({ description: 'Purpose of consent' })];
            _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date' })];
            _expirationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expiration date', required: false })];
            __esDecorate(null, null, _studentId_decorators, { kind: "field", name: "studentId", static: false, private: false, access: { has: obj => "studentId" in obj, get: obj => obj.studentId, set: (obj, value) => { obj.studentId = value; } }, metadata: _metadata }, _studentId_initializers, _studentId_extraInitializers);
            __esDecorate(null, null, _consentType_decorators, { kind: "field", name: "consentType", static: false, private: false, access: { has: obj => "consentType" in obj, get: obj => obj.consentType, set: (obj, value) => { obj.consentType = value; } }, metadata: _metadata }, _consentType_initializers, _consentType_extraInitializers);
            __esDecorate(null, null, _grantedTo_decorators, { kind: "field", name: "grantedTo", static: false, private: false, access: { has: obj => "grantedTo" in obj, get: obj => obj.grantedTo, set: (obj, value) => { obj.grantedTo = value; } }, metadata: _metadata }, _grantedTo_initializers, _grantedTo_extraInitializers);
            __esDecorate(null, null, _purpose_decorators, { kind: "field", name: "purpose", static: false, private: false, access: { has: obj => "purpose" in obj, get: obj => obj.purpose, set: (obj, value) => { obj.purpose = value; } }, metadata: _metadata }, _purpose_initializers, _purpose_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.FERPAConsentDto = FERPAConsentDto;
let RecordsRequestDto = (() => {
    var _a;
    let _studentId_decorators;
    let _studentId_initializers = [];
    let _studentId_extraInitializers = [];
    let _requestType_decorators;
    let _requestType_initializers = [];
    let _requestType_extraInitializers = [];
    let _recipientName_decorators;
    let _recipientName_initializers = [];
    let _recipientName_extraInitializers = [];
    let _recipientAddress_decorators;
    let _recipientAddress_initializers = [];
    let _recipientAddress_extraInitializers = [];
    let _deliveryMethod_decorators;
    let _deliveryMethod_initializers = [];
    let _deliveryMethod_extraInitializers = [];
    let _urgency_decorators;
    let _urgency_initializers = [];
    let _urgency_extraInitializers = [];
    return _a = class RecordsRequestDto {
            constructor() {
                this.studentId = __runInitializers(this, _studentId_initializers, void 0);
                this.requestType = (__runInitializers(this, _studentId_extraInitializers), __runInitializers(this, _requestType_initializers, void 0));
                this.recipientName = (__runInitializers(this, _requestType_extraInitializers), __runInitializers(this, _recipientName_initializers, void 0));
                this.recipientAddress = (__runInitializers(this, _recipientName_extraInitializers), __runInitializers(this, _recipientAddress_initializers, void 0));
                this.deliveryMethod = (__runInitializers(this, _recipientAddress_extraInitializers), __runInitializers(this, _deliveryMethod_initializers, void 0));
                this.urgency = (__runInitializers(this, _deliveryMethod_extraInitializers), __runInitializers(this, _urgency_initializers, void 0));
                __runInitializers(this, _urgency_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _studentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Student ID' })];
            _requestType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Request type', enum: ['transcript', 'verification', 'enrollment-letter', 'degree-audit', 'full-records'] })];
            _recipientName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recipient name' })];
            _recipientAddress_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recipient address' })];
            _deliveryMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Delivery method', enum: ['mail', 'electronic', 'pickup', 'fax'] })];
            _urgency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Urgency level', enum: ['standard', 'rush', 'same-day'] })];
            __esDecorate(null, null, _studentId_decorators, { kind: "field", name: "studentId", static: false, private: false, access: { has: obj => "studentId" in obj, get: obj => obj.studentId, set: (obj, value) => { obj.studentId = value; } }, metadata: _metadata }, _studentId_initializers, _studentId_extraInitializers);
            __esDecorate(null, null, _requestType_decorators, { kind: "field", name: "requestType", static: false, private: false, access: { has: obj => "requestType" in obj, get: obj => obj.requestType, set: (obj, value) => { obj.requestType = value; } }, metadata: _metadata }, _requestType_initializers, _requestType_extraInitializers);
            __esDecorate(null, null, _recipientName_decorators, { kind: "field", name: "recipientName", static: false, private: false, access: { has: obj => "recipientName" in obj, get: obj => obj.recipientName, set: (obj, value) => { obj.recipientName = value; } }, metadata: _metadata }, _recipientName_initializers, _recipientName_extraInitializers);
            __esDecorate(null, null, _recipientAddress_decorators, { kind: "field", name: "recipientAddress", static: false, private: false, access: { has: obj => "recipientAddress" in obj, get: obj => obj.recipientAddress, set: (obj, value) => { obj.recipientAddress = value; } }, metadata: _metadata }, _recipientAddress_initializers, _recipientAddress_extraInitializers);
            __esDecorate(null, null, _deliveryMethod_decorators, { kind: "field", name: "deliveryMethod", static: false, private: false, access: { has: obj => "deliveryMethod" in obj, get: obj => obj.deliveryMethod, set: (obj, value) => { obj.deliveryMethod = value; } }, metadata: _metadata }, _deliveryMethod_initializers, _deliveryMethod_extraInitializers);
            __esDecorate(null, null, _urgency_decorators, { kind: "field", name: "urgency", static: false, private: false, access: { has: obj => "urgency" in obj, get: obj => obj.urgency, set: (obj, value) => { obj.urgency = value; } }, metadata: _metadata }, _urgency_initializers, _urgency_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RecordsRequestDto = RecordsRequestDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for StudentRecord with FERPA compliance and encryption.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} StudentRecord model
 *
 * @example
 * ```typescript
 * const StudentRecord = createStudentRecordModel(sequelize);
 * const record = await StudentRecord.create({
 *   recordId: 'REC-2024-001234',
 *   studentId: 1,
 *   recordType: 'academic',
 *   academicYear: 2024,
 *   termId: 202401,
 *   recordData: { ... },
 *   isOfficial: true,
 *   ferpaProtected: true
 * });
 * ```
 */
const createStudentRecordModel = (sequelize) => {
    class StudentRecord extends sequelize_1.Model {
    }
    StudentRecord.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        recordId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'Unique record identifier',
            validate: {
                notEmpty: true,
            },
        },
        studentId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to student',
            references: {
                model: 'students',
                key: 'id',
            },
        },
        recordType: {
            type: sequelize_1.DataTypes.ENUM('academic', 'disciplinary', 'medical', 'financial', 'enrollment', 'transcript', 'degree', 'honors'),
            allowNull: false,
            comment: 'Type of record',
        },
        recordDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Date record was created',
        },
        academicYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Academic year',
            validate: {
                min: 1900,
                max: 2099,
            },
        },
        termId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to academic term',
        },
        recordData: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Record data (unencrypted for non-sensitive)',
        },
        recordDataEncrypted: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Encrypted record data for FERPA-protected information',
        },
        isOfficial: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Is official record',
        },
        isPermanent: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Is permanent record (never deleted)',
        },
        isLocked: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Is locked from editing',
        },
        ferpaProtected: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'FERPA protected status',
        },
        retentionPeriod: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 7,
            comment: 'Retention period in years',
            validate: {
                min: 0,
                max: 100,
            },
        },
        destructionDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Scheduled destruction date',
        },
        encryptionKey: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Encryption key identifier',
        },
        lastAccessedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last access date',
        },
        lastAccessedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Last accessed by user',
        },
        accessCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of times accessed',
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
            comment: 'User who created the record',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who last updated the record',
        },
    }, {
        sequelize,
        tableName: 'student_records',
        timestamps: true,
        indexes: [
            { fields: ['recordId'], unique: true },
            { fields: ['studentId'] },
            { fields: ['recordType'] },
            { fields: ['academicYear', 'termId'] },
            { fields: ['ferpaProtected'] },
            { fields: ['isLocked'] },
            { fields: ['destructionDate'] },
        ],
        hooks: {
            beforeCreate: (record) => {
                if (!record.createdBy) {
                    throw new Error('createdBy is required');
                }
                record.updatedBy = record.createdBy;
                // Set destruction date based on retention period
                if (!record.isPermanent && record.retentionPeriod > 0) {
                    const destructionDate = new Date();
                    destructionDate.setFullYear(destructionDate.getFullYear() + record.retentionPeriod);
                    record.destructionDate = destructionDate;
                }
            },
            beforeUpdate: (record) => {
                if (!record.updatedBy) {
                    throw new Error('updatedBy is required');
                }
                if (record.isLocked && record.changed('recordData')) {
                    throw new Error('Cannot modify locked record');
                }
            },
        },
    });
    return StudentRecord;
};
exports.createStudentRecordModel = createStudentRecordModel;
/**
 * Sequelize model for AcademicHistory with comprehensive GPA tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AcademicHistory model
 *
 * @example
 * ```typescript
 * const AcademicHistory = createAcademicHistoryModel(sequelize);
 * const history = await AcademicHistory.create({
 *   studentId: 1,
 *   termId: 202401,
 *   academicYear: 2024,
 *   creditsAttempted: 15,
 *   creditsEarned: 15,
 *   gpa: 3.5,
 *   cumulativeGPA: 3.4,
 *   academicStanding: 'good'
 * });
 * ```
 */
const createAcademicHistoryModel = (sequelize) => {
    class AcademicHistory extends sequelize_1.Model {
    }
    AcademicHistory.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        studentId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to student',
            references: {
                model: 'students',
                key: 'id',
            },
        },
        termId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to academic term',
        },
        academicYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Academic year',
            validate: {
                min: 1900,
                max: 2099,
            },
        },
        creditsAttempted: {
            type: sequelize_1.DataTypes.DECIMAL(6, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Credits attempted in term',
            validate: {
                min: 0,
            },
        },
        creditsEarned: {
            type: sequelize_1.DataTypes.DECIMAL(6, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Credits earned in term',
            validate: {
                min: 0,
            },
        },
        creditsTransfer: {
            type: sequelize_1.DataTypes.DECIMAL(6, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Transfer credits applied',
            validate: {
                min: 0,
            },
        },
        gpa: {
            type: sequelize_1.DataTypes.DECIMAL(3, 2),
            allowNull: false,
            defaultValue: 0.00,
            comment: 'Term GPA',
            validate: {
                min: 0.00,
                max: 4.00,
            },
        },
        cumulativeGPA: {
            type: sequelize_1.DataTypes.DECIMAL(3, 2),
            allowNull: false,
            defaultValue: 0.00,
            comment: 'Cumulative GPA',
            validate: {
                min: 0.00,
                max: 4.00,
            },
        },
        majorGPA: {
            type: sequelize_1.DataTypes.DECIMAL(3, 2),
            allowNull: true,
            comment: 'Major GPA',
            validate: {
                min: 0.00,
                max: 4.00,
            },
        },
        academicStanding: {
            type: sequelize_1.DataTypes.ENUM('excellent', 'good', 'probation', 'suspension', 'dismissal'),
            allowNull: false,
            defaultValue: 'good',
            comment: 'Academic standing',
        },
        deansListStatus: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: "Dean's List status",
        },
        presidentsListStatus: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: "President's List status",
        },
        probationStatus: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Academic probation status',
        },
        suspensionStatus: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Academic suspension status',
        },
        honorsDesignation: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Honors designation',
        },
        withdrawalStatus: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Withdrawal status',
        },
        leaveOfAbsence: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Leave of absence status',
        },
        graduationEligible: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Graduation eligibility',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'academic_history',
        timestamps: true,
        indexes: [
            { fields: ['studentId', 'termId'], unique: true },
            { fields: ['academicYear'] },
            { fields: ['academicStanding'] },
            { fields: ['deansListStatus'] },
            { fields: ['probationStatus'] },
        ],
    });
    return AcademicHistory;
};
exports.createAcademicHistoryModel = createAcademicHistoryModel;
/**
 * Sequelize model for EducationalRecord for prior institutions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EducationalRecord model
 */
const createEducationalRecordModel = (sequelize) => {
    class EducationalRecord extends sequelize_1.Model {
    }
    EducationalRecord.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        studentId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to student',
            references: {
                model: 'students',
                key: 'id',
            },
        },
        institutionName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Name of institution',
            validate: {
                notEmpty: true,
            },
        },
        institutionCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Institution code (FICE, CEEB, etc.)',
        },
        institutionType: {
            type: sequelize_1.DataTypes.ENUM('high-school', 'college', 'university', 'community-college', 'technical', 'other'),
            allowNull: false,
            comment: 'Type of institution',
        },
        institutionCity: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'City',
        },
        institutionState: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'State/Province',
        },
        institutionCountry: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            defaultValue: 'United States',
            comment: 'Country',
        },
        attendanceStartDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
            comment: 'Start date of attendance',
        },
        attendanceEndDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: true,
            comment: 'End date of attendance',
        },
        degreeEarned: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Degree earned',
        },
        majorField: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Major field of study',
        },
        graduationDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: true,
            comment: 'Graduation date',
        },
        gpa: {
            type: sequelize_1.DataTypes.DECIMAL(3, 2),
            allowNull: true,
            comment: 'GPA from institution',
            validate: {
                min: 0.00,
            },
        },
        gpaScale: {
            type: sequelize_1.DataTypes.DECIMAL(3, 2),
            allowNull: false,
            defaultValue: 4.00,
            comment: 'GPA scale',
        },
        transcriptReceived: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Transcript received',
        },
        transcriptDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date transcript received',
        },
        verificationStatus: {
            type: sequelize_1.DataTypes.ENUM('pending', 'verified', 'unverified', 'discrepancy'),
            allowNull: false,
            defaultValue: 'pending',
            comment: 'Verification status',
        },
        verificationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date of verification',
        },
        isPrimary: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Is primary institution',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'educational_records',
        timestamps: true,
        indexes: [
            { fields: ['studentId'] },
            { fields: ['institutionName'] },
            { fields: ['institutionType'] },
            { fields: ['verificationStatus'] },
            { fields: ['transcriptReceived'] },
        ],
    });
    return EducationalRecord;
};
exports.createEducationalRecordModel = createEducationalRecordModel;
// ============================================================================
// STUDENT RECORDS MANAGEMENT FUNCTIONS (1-10)
// ============================================================================
/**
 * Creates a new student record with FERPA protection.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateRecordDto} recordData - Record creation data
 * @param {string} userId - User creating the record
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created record
 *
 * @example
 * ```typescript
 * const record = await createStudentRecord(sequelize, {
 *   studentId: 1,
 *   recordType: 'academic',
 *   academicYear: 2024,
 *   termId: 202401,
 *   recordData: { courseGrades: [...] },
 *   isOfficial: true,
 *   isPermanent: true,
 *   ferpaProtected: true
 * }, 'registrar123');
 * ```
 */
const createStudentRecord = async (sequelize, recordData, userId, transaction) => {
    const StudentRecord = (0, exports.createStudentRecordModel)(sequelize);
    const recordId = `REC-${recordData.academicYear}-${recordData.studentId}-${Date.now()}`;
    let encryptedData = null;
    let encryptionKey = null;
    // Encrypt sensitive data if FERPA protected
    if (recordData.ferpaProtected) {
        const encryption = (0, exports.encryptRecordData)(JSON.stringify(recordData.recordData));
        encryptedData = encryption.encrypted;
        encryptionKey = encryption.key;
    }
    const record = await StudentRecord.create({
        recordId,
        ...recordData,
        recordDate: new Date(),
        recordDataEncrypted: encryptedData,
        encryptionKey,
        isLocked: false,
        createdBy: userId,
        updatedBy: userId,
    }, { transaction });
    // Log access
    await (0, exports.logRecordAccess)(sequelize, recordId, recordData.studentId, 'create', userId, transaction);
    return record;
};
exports.createStudentRecord = createStudentRecord;
/**
 * Retrieves a student record with FERPA compliance check.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} recordId - Record ID
 * @param {string} userId - User requesting the record
 * @param {string} [justification] - Justification for access
 * @returns {Promise<any>} Student record
 *
 * @example
 * ```typescript
 * const record = await getStudentRecord(sequelize, 'REC-2024-001', 'advisor123', 'Academic advising');
 * ```
 */
const getStudentRecord = async (sequelize, recordId, userId, justification) => {
    const StudentRecord = (0, exports.createStudentRecordModel)(sequelize);
    const record = await StudentRecord.findOne({
        where: { recordId },
    });
    if (!record) {
        throw new Error('Record not found');
    }
    // Decrypt data if encrypted
    let recordData = record.recordData;
    if (record.recordDataEncrypted && record.encryptionKey) {
        const decrypted = (0, exports.decryptRecordData)(record.recordDataEncrypted, record.encryptionKey);
        recordData = JSON.parse(decrypted);
    }
    // Update access tracking
    await record.update({
        lastAccessedDate: new Date(),
        lastAccessedBy: userId,
        accessCount: record.accessCount + 1,
    });
    // Log access
    await (0, exports.logRecordAccess)(sequelize, recordId, record.studentId, 'view', userId, undefined, justification);
    return {
        ...record.toJSON(),
        recordData,
    };
};
exports.getStudentRecord = getStudentRecord;
/**
 * Updates a student record if not locked.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} recordId - Record ID
 * @param {Partial<CreateRecordDto>} updateData - Update data
 * @param {string} userId - User updating the record
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated record
 *
 * @example
 * ```typescript
 * const updated = await updateStudentRecord(sequelize, 'REC-2024-001', {
 *   recordData: { updatedField: 'newValue' }
 * }, 'registrar123');
 * ```
 */
const updateStudentRecord = async (sequelize, recordId, updateData, userId, transaction) => {
    const StudentRecord = (0, exports.createStudentRecordModel)(sequelize);
    const record = await StudentRecord.findOne({
        where: { recordId },
        transaction,
    });
    if (!record) {
        throw new Error('Record not found');
    }
    if (record.isLocked) {
        throw new Error('Cannot update locked record');
    }
    // Re-encrypt if updating data
    let encryptedData = record.recordDataEncrypted;
    if (updateData.recordData && record.ferpaProtected) {
        const encryption = (0, exports.encryptRecordData)(JSON.stringify(updateData.recordData));
        encryptedData = encryption.encrypted;
    }
    await record.update({
        ...updateData,
        recordDataEncrypted: encryptedData,
        updatedBy: userId,
    }, { transaction });
    // Log access
    await (0, exports.logRecordAccess)(sequelize, recordId, record.studentId, 'update', userId, transaction);
    return record;
};
exports.updateStudentRecord = updateStudentRecord;
/**
 * Locks a student record to prevent modifications.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} recordId - Record ID
 * @param {string} userId - User locking the record
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await lockStudentRecord(sequelize, 'REC-2024-001', 'registrar123');
 * ```
 */
const lockStudentRecord = async (sequelize, recordId, userId, transaction) => {
    const StudentRecord = (0, exports.createStudentRecordModel)(sequelize);
    const record = await StudentRecord.findOne({
        where: { recordId },
        transaction,
    });
    if (!record) {
        throw new Error('Record not found');
    }
    await record.update({
        isLocked: true,
        updatedBy: userId,
        metadata: {
            ...record.metadata,
            lockedAt: new Date().toISOString(),
            lockedBy: userId,
        },
    }, { transaction });
};
exports.lockStudentRecord = lockStudentRecord;
/**
 * Retrieves all records for a student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} [recordType] - Filter by record type
 * @returns {Promise<any[]>} Array of records
 *
 * @example
 * ```typescript
 * const records = await getStudentRecords(sequelize, 1, 'academic');
 * ```
 */
const getStudentRecords = async (sequelize, studentId, recordType) => {
    const StudentRecord = (0, exports.createStudentRecordModel)(sequelize);
    const where = { studentId };
    if (recordType) {
        where.recordType = recordType;
    }
    return await StudentRecord.findAll({
        where,
        order: [['recordDate', 'DESC']],
    });
};
exports.getStudentRecords = getStudentRecords;
/**
 * Creates academic history record for term.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {AcademicHistory} historyData - Academic history data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Academic history record
 *
 * @example
 * ```typescript
 * const history = await createAcademicHistory(sequelize, {
 *   studentId: 1,
 *   termId: 202401,
 *   academicYear: 2024,
 *   creditsAttempted: 15,
 *   creditsEarned: 15,
 *   gpa: 3.5,
 *   cumulativeGPA: 3.4,
 *   academicStanding: 'good',
 *   deansListStatus: true,
 *   probationStatus: false,
 *   withdrawalStatus: false
 * });
 * ```
 */
const createAcademicHistory = async (sequelize, historyData, transaction) => {
    const AcademicHistory = (0, exports.createAcademicHistoryModel)(sequelize);
    const history = await AcademicHistory.create(historyData, { transaction });
    return history;
};
exports.createAcademicHistory = createAcademicHistory;
/**
 * Calculates cumulative GPA for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @returns {Promise<number>} Cumulative GPA
 *
 * @example
 * ```typescript
 * const gpa = await calculateCumulativeGPA(sequelize, 1);
 * ```
 */
const calculateCumulativeGPA = async (sequelize, studentId) => {
    const AcademicHistory = (0, exports.createAcademicHistoryModel)(sequelize);
    const histories = await AcademicHistory.findAll({
        where: { studentId },
        order: [['termId', 'DESC']],
        limit: 1,
    });
    if (histories.length === 0) {
        return 0.0;
    }
    return Number(histories[0].cumulativeGPA);
};
exports.calculateCumulativeGPA = calculateCumulativeGPA;
/**
 * Adds educational record from prior institution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {EducationalRecord} educationData - Educational record data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Educational record
 *
 * @example
 * ```typescript
 * const record = await addEducationalRecord(sequelize, {
 *   studentId: 1,
 *   institutionName: 'Previous University',
 *   institutionType: 'university',
 *   attendanceStartDate: new Date('2020-09-01'),
 *   attendanceEndDate: new Date('2022-05-15'),
 *   degreeEarned: 'Associate of Arts',
 *   graduationDate: new Date('2022-05-15'),
 *   gpa: 3.2,
 *   transcriptReceived: true,
 *   verificationStatus: 'verified'
 * });
 * ```
 */
const addEducationalRecord = async (sequelize, educationData, transaction) => {
    const EducationalRecord = (0, exports.createEducationalRecordModel)(sequelize);
    const record = await EducationalRecord.create(educationData, { transaction });
    return record;
};
exports.addEducationalRecord = addEducationalRecord;
/**
 * Verifies educational record from prior institution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} recordId - Educational record ID
 * @param {string} userId - User verifying the record
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await verifyEducationalRecord(sequelize, 1, 'registrar123');
 * ```
 */
const verifyEducationalRecord = async (sequelize, recordId, userId, transaction) => {
    const EducationalRecord = (0, exports.createEducationalRecordModel)(sequelize);
    const record = await EducationalRecord.findByPk(recordId, { transaction });
    if (!record) {
        throw new Error('Educational record not found');
    }
    await record.update({
        verificationStatus: 'verified',
        verificationDate: new Date(),
    }, { transaction });
};
exports.verifyEducationalRecord = verifyEducationalRecord;
// ============================================================================
// FERPA COMPLIANCE FUNCTIONS (11-20)
// ============================================================================
/**
 * Creates FERPA consent record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {FERPAConsent} consentData - Consent data
 * @param {string} userId - User creating consent
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Consent record
 *
 * @example
 * ```typescript
 * const consent = await createFERPAConsent(sequelize, {
 *   consentId: 'FERPA-2024-001',
 *   studentId: 1,
 *   consentType: 'third-party-disclosure',
 *   grantedTo: 'Parent - John Doe Sr.',
 *   purpose: 'Academic progress disclosure',
 *   effectiveDate: new Date(),
 *   expirationDate: new Date('2025-12-31'),
 *   isActive: true
 * }, 'student123');
 * ```
 */
const createFERPAConsent = async (sequelize, consentData, userId, transaction) => {
    const result = await sequelize.query(`INSERT INTO ferpa_consents
     (consent_id, student_id, consent_type, granted_to, purpose, effective_date, expiration_date,
      is_active, created_at, updated_at, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)`, {
        replacements: [
            consentData.consentId,
            consentData.studentId,
            consentData.consentType,
            consentData.grantedTo || null,
            consentData.purpose,
            consentData.effectiveDate,
            consentData.expirationDate || null,
            consentData.isActive,
            userId,
        ],
        transaction,
    });
    return result;
};
exports.createFERPAConsent = createFERPAConsent;
/**
 * Validates FERPA authorization for record access.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} requestedBy - User requesting access
 * @param {string} purpose - Purpose of access
 * @returns {Promise<{ authorized: boolean; reason?: string }>} Authorization status
 *
 * @example
 * ```typescript
 * const auth = await validateFERPAAuthorization(sequelize, 1, 'parent123', 'View grades');
 * ```
 */
const validateFERPAAuthorization = async (sequelize, studentId, requestedBy, purpose) => {
    // Check for active consent
    const [consents] = await sequelize.query(`SELECT * FROM ferpa_consents
     WHERE student_id = ? AND is_active = true
     AND effective_date <= NOW()
     AND (expiration_date IS NULL OR expiration_date >= NOW())`, {
        replacements: [studentId],
    });
    if (!consents || consents.length === 0) {
        return { authorized: false, reason: 'No active FERPA consent found' };
    }
    // Check if requester matches consent
    const matchingConsent = consents.find((c) => c.granted_to && c.granted_to.includes(requestedBy));
    if (!matchingConsent) {
        return { authorized: false, reason: 'Requester not authorized in consent' };
    }
    return { authorized: true };
};
exports.validateFERPAAuthorization = validateFERPAAuthorization;
/**
 * Revokes FERPA consent.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} consentId - Consent ID
 * @param {string} userId - User revoking consent
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revokeFERPAConsent(sequelize, 'FERPA-2024-001', 'student123');
 * ```
 */
const revokeFERPAConsent = async (sequelize, consentId, userId, transaction) => {
    await sequelize.query(`UPDATE ferpa_consents
     SET is_active = false, revoked_date = NOW(), revoked_by = ?, updated_at = NOW()
     WHERE consent_id = ?`, {
        replacements: [userId, consentId],
        transaction,
    });
};
exports.revokeFERPAConsent = revokeFERPAConsent;
/**
 * Checks if student has opted out of directory information.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @returns {Promise<boolean>} Whether student opted out
 *
 * @example
 * ```typescript
 * const optedOut = await checkDirectoryOptOut(sequelize, 1);
 * ```
 */
const checkDirectoryOptOut = async (sequelize, studentId) => {
    const [consents] = await sequelize.query(`SELECT * FROM ferpa_consents
     WHERE student_id = ? AND consent_type = 'directory-information' AND is_active = false`, {
        replacements: [studentId],
    });
    return consents && consents.length > 0;
};
exports.checkDirectoryOptOut = checkDirectoryOptOut;
/**
 * Logs record access for FERPA compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} recordId - Record ID
 * @param {number} studentId - Student ID
 * @param {string} actionType - Type of action
 * @param {string} userId - User performing action
 * @param {Transaction} [transaction] - Optional transaction
 * @param {string} [justification] - Justification for access
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logRecordAccess(sequelize, 'REC-2024-001', 1, 'view', 'advisor123', undefined, 'Academic advising');
 * ```
 */
const logRecordAccess = async (sequelize, recordId, studentId, actionType, userId, transaction, justification) => {
    await sequelize.query(`INSERT INTO records_audit_log
     (record_id, student_id, action_type, action_by, action_date, ip_address, justification, ferpa_compliant, created_at)
     VALUES (?, ?, ?, ?, NOW(), ?, ?, true, NOW())`, {
        replacements: [recordId, studentId, actionType, userId, '0.0.0.0', justification || null],
        transaction,
    });
};
exports.logRecordAccess = logRecordAccess;
/**
 * Retrieves FERPA audit log for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {Date} [startDate] - Start date filter
 * @param {Date} [endDate] - End date filter
 * @returns {Promise<any[]>} Audit log entries
 *
 * @example
 * ```typescript
 * const auditLog = await getFERPAAuditLog(sequelize, 1, new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
const getFERPAAuditLog = async (sequelize, studentId, startDate, endDate) => {
    let query = `SELECT * FROM records_audit_log WHERE student_id = ?`;
    const replacements = [studentId];
    if (startDate) {
        query += ` AND action_date >= ?`;
        replacements.push(startDate);
    }
    if (endDate) {
        query += ` AND action_date <= ?`;
        replacements.push(endDate);
    }
    query += ` ORDER BY action_date DESC`;
    const [results] = await sequelize.query(query, { replacements });
    return results;
};
exports.getFERPAAuditLog = getFERPAAuditLog;
/**
 * Validates FERPA compliance for record disclosure.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} recipientType - Type of recipient
 * @param {string} purpose - Purpose of disclosure
 * @returns {Promise<{ compliant: boolean; issues: string[] }>} Compliance status
 *
 * @example
 * ```typescript
 * const compliance = await validateRecordDisclosure(sequelize, 1, 'employer', 'Employment verification');
 * ```
 */
const validateRecordDisclosure = async (sequelize, studentId, recipientType, purpose) => {
    const issues = [];
    // Check for active consent
    const [consents] = await sequelize.query(`SELECT * FROM ferpa_consents
     WHERE student_id = ? AND is_active = true AND consent_type = 'third-party-disclosure'`, {
        replacements: [studentId],
    });
    if (!consents || consents.length === 0) {
        // Check if recipient falls under FERPA exceptions
        const exceptions = ['school-official', 'financial-aid', 'accreditation', 'court-order', 'health-safety'];
        if (!exceptions.includes(recipientType)) {
            issues.push('No active consent for third-party disclosure');
        }
    }
    // Check directory opt-out
    const optedOut = await (0, exports.checkDirectoryOptOut)(sequelize, studentId);
    if (optedOut && recipientType === 'directory') {
        issues.push('Student has opted out of directory information');
    }
    return {
        compliant: issues.length === 0,
        issues,
    };
};
exports.validateRecordDisclosure = validateRecordDisclosure;
/**
 * Generates FERPA compliance report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any>} Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateFERPAComplianceReport(sequelize, new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
const generateFERPAComplianceReport = async (sequelize, startDate, endDate) => {
    const [accessLogs] = await sequelize.query(`SELECT action_type, COUNT(*) as count FROM records_audit_log
     WHERE action_date BETWEEN ? AND ?
     GROUP BY action_type`, {
        replacements: [startDate, endDate],
    });
    const [consentStats] = await sequelize.query(`SELECT consent_type, COUNT(*) as count, SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as active_count
     FROM ferpa_consents
     WHERE created_at BETWEEN ? AND ?
     GROUP BY consent_type`, {
        replacements: [startDate, endDate],
    });
    return {
        reportPeriod: {
            startDate,
            endDate,
        },
        accessStatistics: accessLogs,
        consentStatistics: consentStats,
        generatedAt: new Date(),
    };
};
exports.generateFERPAComplianceReport = generateFERPAComplianceReport;
/**
 * Encrypts sensitive record data.
 *
 * @param {string} data - Data to encrypt
 * @returns {{ encrypted: string; key: string }} Encrypted data and key
 *
 * @example
 * ```typescript
 * const { encrypted, key } = encryptRecordData(JSON.stringify(sensitiveData));
 * ```
 */
const encryptRecordData = (data) => {
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        encrypted: `${iv.toString('hex')}:${encrypted}`,
        key: key.toString('hex'),
    };
};
exports.encryptRecordData = encryptRecordData;
/**
 * Decrypts encrypted record data.
 *
 * @param {string} encryptedData - Encrypted data
 * @param {string} keyHex - Encryption key in hex
 * @returns {string} Decrypted data
 *
 * @example
 * ```typescript
 * const decrypted = decryptRecordData(encrypted, key);
 * ```
 */
const decryptRecordData = (encryptedData, keyHex) => {
    const algorithm = 'aes-256-cbc';
    const [ivHex, encrypted] = encryptedData.split(':');
    const key = Buffer.from(keyHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
exports.decryptRecordData = decryptRecordData;
// ============================================================================
// RECORDS REQUEST MANAGEMENT (21-25)
// ============================================================================
/**
 * Creates records request.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RecordsRequest} requestData - Request data
 * @param {string} userId - User creating request
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Records request
 *
 * @example
 * ```typescript
 * const request = await createRecordsRequest(sequelize, {
 *   requestId: 'REQ-2024-001',
 *   studentId: 1,
 *   requestType: 'transcript',
 *   requestDate: new Date(),
 *   requestedBy: 'student123',
 *   recipientName: 'Graduate School',
 *   recipientAddress: '123 University Ave',
 *   deliveryMethod: 'electronic',
 *   urgency: 'standard',
 *   status: 'pending',
 *   fee: 10,
 *   isPaid: false
 * }, 'student123');
 * ```
 */
const createRecordsRequest = async (sequelize, requestData, userId, transaction) => {
    // Validate FERPA authorization
    const authorization = await (0, exports.validateFERPAAuthorization)(sequelize, requestData.studentId, userId, `Records request: ${requestData.requestType}`);
    if (!authorization.authorized && requestData.requestedBy !== 'self') {
        throw new Error(`FERPA authorization failed: ${authorization.reason}`);
    }
    const result = await sequelize.query(`INSERT INTO records_requests
     (request_id, student_id, request_type, request_date, requested_by, recipient_name,
      recipient_address, delivery_method, urgency, status, fee, is_paid, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`, {
        replacements: [
            requestData.requestId,
            requestData.studentId,
            requestData.requestType,
            requestData.requestDate,
            requestData.requestedBy,
            requestData.recipientName,
            requestData.recipientAddress,
            requestData.deliveryMethod,
            requestData.urgency,
            requestData.status,
            requestData.fee,
            requestData.isPaid,
        ],
        transaction,
    });
    return result;
};
exports.createRecordsRequest = createRecordsRequest;
/**
 * Processes records request.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} requestId - Request ID
 * @param {string} userId - User processing request
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await processRecordsRequest(sequelize, 'REQ-2024-001', 'registrar123');
 * ```
 */
const processRecordsRequest = async (sequelize, requestId, userId, transaction) => {
    await sequelize.query(`UPDATE records_requests
     SET status = 'processing', processed_by = ?, updated_at = NOW()
     WHERE request_id = ?`, {
        replacements: [userId, requestId],
        transaction,
    });
};
exports.processRecordsRequest = processRecordsRequest;
/**
 * Completes records request.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} requestId - Request ID
 * @param {string} trackingNumber - Tracking number
 * @param {string} userId - User completing request
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await completeRecordsRequest(sequelize, 'REQ-2024-001', 'TRACK-12345', 'registrar123');
 * ```
 */
const completeRecordsRequest = async (sequelize, requestId, trackingNumber, userId, transaction) => {
    await sequelize.query(`UPDATE records_requests
     SET status = 'completed', processed_date = NOW(), tracking_number = ?, updated_at = NOW()
     WHERE request_id = ?`, {
        replacements: [trackingNumber, requestId],
        transaction,
    });
};
exports.completeRecordsRequest = completeRecordsRequest;
/**
 * Retrieves pending records requests.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Pending requests
 *
 * @example
 * ```typescript
 * const pending = await getPendingRecordsRequests(sequelize);
 * ```
 */
const getPendingRecordsRequests = async (sequelize) => {
    const [requests] = await sequelize.query(`SELECT * FROM records_requests
     WHERE status IN ('pending', 'processing')
     ORDER BY urgency DESC, request_date ASC`);
    return requests;
};
exports.getPendingRecordsRequests = getPendingRecordsRequests;
/**
 * Cancels records request.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} requestId - Request ID
 * @param {string} userId - User cancelling request
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cancelRecordsRequest(sequelize, 'REQ-2024-001', 'student123');
 * ```
 */
const cancelRecordsRequest = async (sequelize, requestId, userId, transaction) => {
    await sequelize.query(`UPDATE records_requests
     SET status = 'cancelled', updated_at = NOW()
     WHERE request_id = ? AND status = 'pending'`, {
        replacements: [requestId],
        transaction,
    });
};
exports.cancelRecordsRequest = cancelRecordsRequest;
// ============================================================================
// RECORDS VERIFICATION (26-30)
// ============================================================================
/**
 * Creates transcript request.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {TranscriptRequest} transcriptData - Transcript request data
 * @param {string} userId - User creating request
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Transcript request
 *
 * @example
 * ```typescript
 * const transcript = await createTranscriptRequest(sequelize, {
 *   transcriptId: 'TRANS-2024-001',
 *   studentId: 1,
 *   transcriptType: 'official',
 *   includeGrades: true,
 *   includeDegrees: true,
 *   includeHonors: true,
 *   includeTestScores: false,
 *   recipientName: 'Graduate School',
 *   recipientEmail: 'admissions@gradschool.edu',
 *   deliveryMethod: 'electronic',
 *   requestDate: new Date()
 * }, 'student123');
 * ```
 */
const createTranscriptRequest = async (sequelize, transcriptData, userId, transaction) => {
    // Generate verification code for electronic transcripts
    const verificationCode = transcriptData.deliveryMethod === 'electronic'
        ? crypto.randomBytes(16).toString('hex')
        : null;
    const result = await sequelize.query(`INSERT INTO transcript_requests
     (transcript_id, student_id, transcript_type, include_grades, include_degrees, include_honors,
      include_test_scores, recipient_name, recipient_email, delivery_method, request_date,
      verification_code, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`, {
        replacements: [
            transcriptData.transcriptId,
            transcriptData.studentId,
            transcriptData.transcriptType,
            transcriptData.includeGrades,
            transcriptData.includeDegrees,
            transcriptData.includeHonors,
            transcriptData.includeTestScores,
            transcriptData.recipientName,
            transcriptData.recipientEmail || null,
            transcriptData.deliveryMethod,
            transcriptData.requestDate,
            verificationCode,
        ],
        transaction,
    });
    return { ...transcriptData, verificationCode };
};
exports.createTranscriptRequest = createTranscriptRequest;
/**
 * Generates official transcript.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {boolean} includeInProgress - Include in-progress courses
 * @returns {Promise<any>} Transcript data
 *
 * @example
 * ```typescript
 * const transcript = await generateOfficialTranscript(sequelize, 1, true);
 * ```
 */
const generateOfficialTranscript = async (sequelize, studentId, includeInProgress = false) => {
    // Get student info
    const [students] = await sequelize.query(`SELECT * FROM students WHERE id = ?`, { replacements: [studentId] });
    if (!students || students.length === 0) {
        throw new Error('Student not found');
    }
    const student = students[0];
    // Get academic history
    const AcademicHistory = (0, exports.createAcademicHistoryModel)(sequelize);
    const history = await AcademicHistory.findAll({
        where: { studentId },
        order: [['termId', 'ASC']],
    });
    // Get course enrollments
    let enrollmentQuery = `
    SELECT e.*, c.course_code, c.course_title
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    WHERE e.student_id = ?
  `;
    if (!includeInProgress) {
        enrollmentQuery += ` AND e.enrollment_status = 'completed'`;
    }
    enrollmentQuery += ` ORDER BY e.term_id, c.course_code`;
    const [enrollments] = await sequelize.query(enrollmentQuery, { replacements: [studentId] });
    // Generate electronic signature
    const signatureData = {
        studentId,
        generatedDate: new Date(),
        transcriptType: 'official',
    };
    const electronicSignature = crypto
        .createHash('sha256')
        .update(JSON.stringify(signatureData))
        .digest('hex');
    return {
        transcriptType: 'official',
        issuedDate: new Date(),
        student: {
            studentNumber: student.student_number,
            name: `${student.first_name} ${student.last_name}`,
            dateOfBirth: student.date_of_birth,
            admissionDate: student.admission_date,
        },
        academicHistory: history,
        courseWork: enrollments,
        summary: {
            cumulativeGPA: student.gpa,
            creditsEarned: student.credits_earned,
            creditsAttempted: student.credits_attempted,
            academicLevel: student.academic_level,
        },
        electronicSignature,
        verificationNote: 'This is an official transcript. Verify authenticity at verify.university.edu',
    };
};
exports.generateOfficialTranscript = generateOfficialTranscript;
/**
 * Verifies transcript authenticity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} verificationCode - Verification code
 * @returns {Promise<{ valid: boolean; transcriptData?: any }>} Verification result
 *
 * @example
 * ```typescript
 * const verification = await verifyTranscriptAuthenticity(sequelize, 'abc123def456');
 * ```
 */
const verifyTranscriptAuthenticity = async (sequelize, verificationCode) => {
    const [transcripts] = await sequelize.query(`SELECT * FROM transcript_requests WHERE verification_code = ?`, { replacements: [verificationCode] });
    if (!transcripts || transcripts.length === 0) {
        return { valid: false };
    }
    const transcript = transcripts[0];
    // Check if transcript is still valid (e.g., issued within last 6 months)
    const issueDate = new Date(transcript.issued_date);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    if (issueDate < sixMonthsAgo) {
        return { valid: false };
    }
    return {
        valid: true,
        transcriptData: {
            studentId: transcript.student_id,
            transcriptType: transcript.transcript_type,
            issuedDate: transcript.issued_date,
            recipientName: transcript.recipient_name,
        },
    };
};
exports.verifyTranscriptAuthenticity = verifyTranscriptAuthenticity;
/**
 * Generates degree verification letter.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} degreeType - Degree type
 * @returns {Promise<any>} Verification letter
 *
 * @example
 * ```typescript
 * const letter = await generateDegreeVerification(sequelize, 1, 'Bachelor of Science');
 * ```
 */
const generateDegreeVerification = async (sequelize, studentId, degreeType) => {
    const [students] = await sequelize.query(`SELECT * FROM students WHERE id = ?`, { replacements: [studentId] });
    if (!students || students.length === 0) {
        throw new Error('Student not found');
    }
    const student = students[0];
    if (!student.actual_graduation_date) {
        throw new Error('Student has not graduated');
    }
    return {
        verificationType: 'Degree Verification',
        issuedDate: new Date(),
        student: {
            studentNumber: student.student_number,
            name: `${student.first_name} ${student.last_name}`,
        },
        degree: {
            degreeType,
            conferredDate: student.actual_graduation_date,
            major: student.major_name || 'N/A',
        },
        verificationStatement: `This letter verifies that the above-named student was awarded a ${degreeType} degree on ${student.actual_graduation_date}.`,
        officialSeal: true,
    };
};
exports.generateDegreeVerification = generateDegreeVerification;
/**
 * Creates enrollment verification for external party.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @param {string} verificationPurpose - Purpose of verification
 * @returns {Promise<any>} Enrollment verification
 *
 * @example
 * ```typescript
 * const verification = await createEnrollmentVerificationLetter(sequelize, 1, 202401, 'Loan deferment');
 * ```
 */
const createEnrollmentVerificationLetter = async (sequelize, studentId, termId, verificationPurpose) => {
    // This would integrate with the enrollment kit
    const [students] = await sequelize.query(`SELECT * FROM students WHERE id = ?`, { replacements: [studentId] });
    const student = students[0];
    // Get enrollment data
    const [enrollments] = await sequelize.query(`SELECT COUNT(*) as course_count, SUM(credits) as total_credits
     FROM enrollments
     WHERE student_id = ? AND term_id = ? AND enrollment_status IN ('enrolled', 'in-progress')`, { replacements: [studentId, termId] });
    const enrollmentData = enrollments[0];
    const isFullTime = Number(enrollmentData.total_credits) >= 12;
    return {
        verificationType: 'Enrollment Verification',
        issuedDate: new Date(),
        purpose: verificationPurpose,
        student: {
            studentNumber: student.student_number,
            name: `${student.first_name} ${student.last_name}`,
        },
        enrollment: {
            termId,
            enrollmentStatus: student.enrollment_status,
            creditsEnrolled: enrollmentData.total_credits,
            courseCount: enrollmentData.course_count,
            fullTimeStatus: isFullTime ? 'Full-Time' : 'Part-Time',
            academicLevel: student.academic_level,
        },
        validThrough: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        officialSeal: true,
    };
};
exports.createEnrollmentVerificationLetter = createEnrollmentVerificationLetter;
// ============================================================================
// RECORDS CHANGES, HOLDS, AND LOCKS (31-35)
// ============================================================================
/**
 * Creates grade change request.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {GradeChangeRequest} changeData - Grade change data
 * @param {string} userId - User creating request
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Grade change request
 *
 * @example
 * ```typescript
 * const request = await createGradeChangeRequest(sequelize, {
 *   requestId: 'GC-2024-001',
 *   studentId: 1,
 *   courseId: 101,
 *   termId: 202401,
 *   currentGrade: 'B',
 *   proposedGrade: 'A',
 *   changeReason: 'Grading error - final exam score was incorrectly recorded',
 *   requestedBy: 'professor123',
 *   requestDate: new Date(),
 *   status: 'pending'
 * }, 'professor123');
 * ```
 */
const createGradeChangeRequest = async (sequelize, changeData, userId, transaction) => {
    const result = await sequelize.query(`INSERT INTO grade_change_requests
     (request_id, student_id, course_id, term_id, current_grade, proposed_grade, change_reason,
      requested_by, request_date, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`, {
        replacements: [
            changeData.requestId,
            changeData.studentId,
            changeData.courseId,
            changeData.termId,
            changeData.currentGrade,
            changeData.proposedGrade,
            changeData.changeReason,
            changeData.requestedBy,
            changeData.requestDate,
            changeData.status,
        ],
        transaction,
    });
    return result;
};
exports.createGradeChangeRequest = createGradeChangeRequest;
/**
 * Approves grade change request.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} requestId - Request ID
 * @param {string} userId - User approving request
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await approveGradeChange(sequelize, 'GC-2024-001', 'dean123');
 * ```
 */
const approveGradeChange = async (sequelize, requestId, userId, transaction) => {
    // Get grade change request
    const [requests] = await sequelize.query(`SELECT * FROM grade_change_requests WHERE request_id = ?`, { replacements: [requestId], transaction });
    if (!requests || requests.length === 0) {
        throw new Error('Grade change request not found');
    }
    const request = requests[0];
    // Update enrollment with new grade
    await sequelize.query(`UPDATE enrollments
     SET grade = ?, updated_at = NOW(), updated_by = ?
     WHERE student_id = ? AND course_id = ? AND term_id = ?`, {
        replacements: [request.proposed_grade, userId, request.student_id, request.course_id, request.term_id],
        transaction,
    });
    // Update grade change request status
    await sequelize.query(`UPDATE grade_change_requests
     SET status = 'approved', approved_by = ?, approval_date = NOW(), updated_at = NOW()
     WHERE request_id = ?`, {
        replacements: [userId, requestId],
        transaction,
    });
    // Log the change
    await sequelize.query(`INSERT INTO records_audit_log
     (record_id, student_id, action_type, action_by, action_date, justification, created_at)
     VALUES (?, ?, 'grade-change', ?, NOW(), ?, NOW())`, {
        replacements: [requestId, request.student_id, userId, request.change_reason],
        transaction,
    });
};
exports.approveGradeChange = approveGradeChange;
/**
 * Places hold on student records.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RecordsHold} holdData - Hold data
 * @param {string} userId - User placing hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Records hold
 *
 * @example
 * ```typescript
 * const hold = await placeRecordsHold(sequelize, {
 *   holdId: 'RHOLD-2024-001',
 *   studentId: 1,
 *   recordType: 'transcript',
 *   holdReason: 'Unpaid library fines',
 *   placedBy: 'library123',
 *   placedDate: new Date(),
 *   isActive: true,
 *   requiresAuthorization: true
 * }, 'library123');
 * ```
 */
const placeRecordsHold = async (sequelize, holdData, userId, transaction) => {
    const result = await sequelize.query(`INSERT INTO records_holds
     (hold_id, student_id, record_type, hold_reason, placed_by, placed_date, is_active,
      requires_authorization, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`, {
        replacements: [
            holdData.holdId,
            holdData.studentId,
            holdData.recordType,
            holdData.holdReason,
            holdData.placedBy,
            holdData.placedDate,
            holdData.isActive,
            holdData.requiresAuthorization,
        ],
        transaction,
    });
    return result;
};
exports.placeRecordsHold = placeRecordsHold;
/**
 * Releases hold on student records.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} holdId - Hold ID
 * @param {string} userId - User releasing hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await releaseRecordsHold(sequelize, 'RHOLD-2024-001', 'library123');
 * ```
 */
const releaseRecordsHold = async (sequelize, holdId, userId, transaction) => {
    await sequelize.query(`UPDATE records_holds
     SET is_active = false, released_by = ?, released_date = NOW(), updated_at = NOW()
     WHERE hold_id = ?`, {
        replacements: [userId, holdId],
        transaction,
    });
};
exports.releaseRecordsHold = releaseRecordsHold;
/**
 * Checks for active records holds.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} [recordType] - Filter by record type
 * @returns {Promise<{ hasHolds: boolean; holds: any[] }>} Hold status
 *
 * @example
 * ```typescript
 * const holdStatus = await checkRecordsHolds(sequelize, 1, 'transcript');
 * ```
 */
const checkRecordsHolds = async (sequelize, studentId, recordType) => {
    let query = `SELECT * FROM records_holds WHERE student_id = ? AND is_active = true`;
    const replacements = [studentId];
    if (recordType) {
        query += ` AND record_type = ?`;
        replacements.push(recordType);
    }
    query += ` ORDER BY placed_date DESC`;
    const [holds] = await sequelize.query(query, { replacements });
    return {
        hasHolds: holds.length > 0,
        holds: holds,
    };
};
exports.checkRecordsHolds = checkRecordsHolds;
// ============================================================================
// RECORDS ARCHIVAL AND SECURITY (36-45)
// ============================================================================
/**
 * Archives student records for retention.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} archiveLocation - Archive storage location
 * @param {string} userId - User archiving records
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Archive summary
 *
 * @example
 * ```typescript
 * const archive = await archiveStudentRecords(sequelize, 1, 's3://archives/2024/', 'registrar123');
 * ```
 */
const archiveStudentRecords = async (sequelize, studentId, archiveLocation, userId, transaction) => {
    const StudentRecord = (0, exports.createStudentRecordModel)(sequelize);
    // Get all records for student
    const records = await StudentRecord.findAll({
        where: { studentId },
        transaction,
    });
    const archiveId = `ARCH-${studentId}-${Date.now()}`;
    // Create archive entry
    await sequelize.query(`INSERT INTO records_archives
     (archive_id, student_id, archive_location, record_count, archive_date, archived_by, created_at)
     VALUES (?, ?, ?, ?, NOW(), ?, NOW())`, {
        replacements: [archiveId, studentId, archiveLocation, records.length, userId],
        transaction,
    });
    // Mark records as archived
    await StudentRecord.update({
        metadata: sequelize.literal(`JSON_SET(metadata, '$.archived', true, '$.archiveId', '${archiveId}')`),
    }, {
        where: { studentId },
        transaction,
    });
    return {
        archiveId,
        studentId,
        recordCount: records.length,
        archiveLocation,
        archiveDate: new Date(),
    };
};
exports.archiveStudentRecords = archiveStudentRecords;
/**
 * Retrieves archived records.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} archiveId - Archive ID
 * @param {string} userId - User requesting records
 * @returns {Promise<any>} Archived records
 *
 * @example
 * ```typescript
 * const archived = await retrieveArchivedRecords(sequelize, 'ARCH-1-1234567890', 'registrar123');
 * ```
 */
const retrieveArchivedRecords = async (sequelize, archiveId, userId) => {
    const [archives] = await sequelize.query(`SELECT * FROM records_archives WHERE archive_id = ?`, { replacements: [archiveId] });
    if (!archives || archives.length === 0) {
        throw new Error('Archive not found');
    }
    const archive = archives[0];
    // Log retrieval
    await sequelize.query(`INSERT INTO records_audit_log
     (record_id, student_id, action_type, action_by, action_date, created_at)
     VALUES (?, ?, 'archive-retrieval', ?, NOW(), NOW())`, {
        replacements: [archiveId, archive.student_id, userId],
    });
    return archive;
};
exports.retrieveArchivedRecords = retrieveArchivedRecords;
/**
 * Schedules records for destruction based on retention policy.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ scheduled: number; records: any[] }>} Destruction schedule
 *
 * @example
 * ```typescript
 * const scheduled = await scheduleRecordsDestruction(sequelize);
 * ```
 */
const scheduleRecordsDestruction = async (sequelize, transaction) => {
    const StudentRecord = (0, exports.createStudentRecordModel)(sequelize);
    // Find records past their destruction date
    const records = await StudentRecord.findAll({
        where: {
            isPermanent: false,
            destructionDate: { [sequelize_1.Op.lte]: new Date() },
            isLocked: false,
        },
        transaction,
    });
    // Schedule for destruction
    for (const record of records) {
        await sequelize.query(`INSERT INTO records_destruction_schedule
       (record_id, student_id, scheduled_date, destruction_reason, created_at)
       VALUES (?, ?, NOW(), 'Retention period expired', NOW())`, {
            replacements: [record.recordId, record.studentId],
            transaction,
        });
    }
    return {
        scheduled: records.length,
        records: records.map((r) => ({ recordId: r.recordId, destructionDate: r.destructionDate })),
    };
};
exports.scheduleRecordsDestruction = scheduleRecordsDestruction;
/**
 * Securely destroys expired records.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} recordIds - Record IDs to destroy
 * @param {string} userId - User authorizing destruction
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of records destroyed
 *
 * @example
 * ```typescript
 * const destroyed = await destroyExpiredRecords(sequelize, ['REC-2015-001', 'REC-2015-002'], 'registrar123');
 * ```
 */
const destroyExpiredRecords = async (sequelize, recordIds, userId, transaction) => {
    const StudentRecord = (0, exports.createStudentRecordModel)(sequelize);
    let destroyedCount = 0;
    for (const recordId of recordIds) {
        const record = await StudentRecord.findOne({
            where: { recordId },
            transaction,
        });
        if (!record) {
            continue;
        }
        if (record.isPermanent) {
            throw new Error(`Cannot destroy permanent record: ${recordId}`);
        }
        // Log destruction
        await sequelize.query(`INSERT INTO records_destruction_log
       (record_id, student_id, destruction_date, destroyed_by, destruction_method, created_at)
       VALUES (?, ?, NOW(), ?, 'secure-deletion', NOW())`, {
            replacements: [recordId, record.studentId, userId],
            transaction,
        });
        // Delete record
        await record.destroy({ transaction });
        destroyedCount++;
    }
    return destroyedCount;
};
exports.destroyExpiredRecords = destroyExpiredRecords;
/**
 * Generates records retention report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Retention report
 *
 * @example
 * ```typescript
 * const report = await generateRetentionReport(sequelize);
 * ```
 */
const generateRetentionReport = async (sequelize) => {
    const [summary] = await sequelize.query(`
    SELECT
      record_type,
      COUNT(*) as total_records,
      SUM(CASE WHEN is_permanent THEN 1 ELSE 0 END) as permanent_records,
      SUM(CASE WHEN destruction_date <= NOW() THEN 1 ELSE 0 END) as eligible_for_destruction,
      SUM(CASE WHEN is_locked THEN 1 ELSE 0 END) as locked_records
    FROM student_records
    GROUP BY record_type
  `);
    const [destructionSchedule] = await sequelize.query(`
    SELECT COUNT(*) as scheduled_count
    FROM records_destruction_schedule
    WHERE destruction_date IS NULL
  `);
    return {
        reportDate: new Date(),
        summary,
        destructionSchedule: destructionSchedule[0],
    };
};
exports.generateRetentionReport = generateRetentionReport;
/**
 * Performs security audit on records access.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any>} Security audit report
 *
 * @example
 * ```typescript
 * const audit = await performSecurityAudit(sequelize, new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
const performSecurityAudit = async (sequelize, startDate, endDate) => {
    const [accessByUser] = await sequelize.query(`SELECT action_by, action_type, COUNT(*) as access_count
     FROM records_audit_log
     WHERE action_date BETWEEN ? AND ?
     GROUP BY action_by, action_type
     ORDER BY access_count DESC`, { replacements: [startDate, endDate] });
    const [unauthorizedAttempts] = await sequelize.query(`SELECT action_by, COUNT(*) as attempt_count
     FROM records_audit_log
     WHERE ferpa_compliant = false AND action_date BETWEEN ? AND ?
     GROUP BY action_by`, { replacements: [startDate, endDate] });
    const [highRiskAccess] = await sequelize.query(`SELECT student_id, action_by, action_type, action_date
     FROM records_audit_log
     WHERE action_type IN ('export', 'print', 'email') AND action_date BETWEEN ? AND ?
     ORDER BY action_date DESC
     LIMIT 100`, { replacements: [startDate, endDate] });
    return {
        auditPeriod: { startDate, endDate },
        accessByUser,
        unauthorizedAttempts,
        highRiskAccess,
        generatedAt: new Date(),
    };
};
exports.performSecurityAudit = performSecurityAudit;
/**
 * Encrypts batch of student records.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} recordIds - Record IDs to encrypt
 * @param {string} userId - User performing encryption
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of records encrypted
 *
 * @example
 * ```typescript
 * const encrypted = await encryptStudentRecords(sequelize, ['REC-2024-001', 'REC-2024-002'], 'admin123');
 * ```
 */
const encryptStudentRecords = async (sequelize, recordIds, userId, transaction) => {
    const StudentRecord = (0, exports.createStudentRecordModel)(sequelize);
    let encryptedCount = 0;
    for (const recordId of recordIds) {
        const record = await StudentRecord.findOne({
            where: { recordId },
            transaction,
        });
        if (!record || record.recordDataEncrypted) {
            continue; // Skip if not found or already encrypted
        }
        const encryption = (0, exports.encryptRecordData)(JSON.stringify(record.recordData));
        await record.update({
            recordDataEncrypted: encryption.encrypted,
            encryptionKey: encryption.key,
            recordData: {}, // Clear unencrypted data
            updatedBy: userId,
        }, { transaction });
        encryptedCount++;
    }
    return encryptedCount;
};
exports.encryptStudentRecords = encryptStudentRecords;
/**
 * Validates records encryption compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ compliant: boolean; unencryptedCount: number; records: any[] }>} Compliance status
 *
 * @example
 * ```typescript
 * const compliance = await validateEncryptionCompliance(sequelize);
 * ```
 */
const validateEncryptionCompliance = async (sequelize) => {
    const StudentRecord = (0, exports.createStudentRecordModel)(sequelize);
    // Find FERPA-protected records that are not encrypted
    const unencrypted = await StudentRecord.findAll({
        where: {
            ferpaProtected: true,
            recordDataEncrypted: null,
        },
        attributes: ['recordId', 'studentId', 'recordType', 'createdAt'],
    });
    return {
        compliant: unencrypted.length === 0,
        unencryptedCount: unencrypted.length,
        records: unencrypted.map((r) => ({
            recordId: r.recordId,
            studentId: r.studentId,
            recordType: r.recordType,
            createdAt: r.createdAt,
        })),
    };
};
exports.validateEncryptionCompliance = validateEncryptionCompliance;
/**
 * Creates degree audit for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DegreeAudit} auditData - Degree audit data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Degree audit
 *
 * @example
 * ```typescript
 * const audit = await createDegreeAudit(sequelize, {
 *   auditId: 'AUDIT-2024-001',
 *   studentId: 1,
 *   programId: 101,
 *   degreeType: 'Bachelor of Science',
 *   auditDate: new Date(),
 *   completionPercentage: 75,
 *   creditsRequired: 120,
 *   creditsCompleted: 90,
 *   creditsInProgress: 15,
 *   creditsRemaining: 15,
 *   requirementsMet: ['General Education', 'Major Core'],
 *   requirementsPending: ['Senior Capstone', 'Electives'],
 *   expectedGraduationDate: new Date('2025-05-15')
 * });
 * ```
 */
const createDegreeAudit = async (sequelize, auditData, transaction) => {
    const result = await sequelize.query(`INSERT INTO degree_audits
     (audit_id, student_id, program_id, degree_type, audit_date, completion_percentage,
      credits_required, credits_completed, credits_in_progress, credits_remaining,
      requirements_met, requirements_pending, expected_graduation_date, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`, {
        replacements: [
            auditData.auditId,
            auditData.studentId,
            auditData.programId,
            auditData.degreeType,
            auditData.auditDate,
            auditData.completionPercentage,
            auditData.creditsRequired,
            auditData.creditsCompleted,
            auditData.creditsInProgress,
            auditData.creditsRemaining,
            JSON.stringify(auditData.requirementsMet),
            JSON.stringify(auditData.requirementsPending),
            auditData.expectedGraduationDate || null,
        ],
        transaction,
    });
    return result;
};
exports.createDegreeAudit = createDegreeAudit;
/**
 * Generates comprehensive student history report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @returns {Promise<any>} Comprehensive history report
 *
 * @example
 * ```typescript
 * const history = await generateStudentHistoryReport(sequelize, 1);
 * ```
 */
const generateStudentHistoryReport = async (sequelize, studentId) => {
    const [student] = await sequelize.query(`SELECT * FROM students WHERE id = ?`, { replacements: [studentId] });
    const AcademicHistory = (0, exports.createAcademicHistoryModel)(sequelize);
    const academicHistory = await AcademicHistory.findAll({
        where: { studentId },
        order: [['termId', 'ASC']],
    });
    const EducationalRecord = (0, exports.createEducationalRecordModel)(sequelize);
    const priorEducation = await EducationalRecord.findAll({
        where: { studentId },
    });
    const records = await (0, exports.getStudentRecords)(sequelize, studentId);
    return {
        reportDate: new Date(),
        student: student[0],
        academicHistory,
        priorEducation,
        recordsSummary: {
            totalRecords: records.length,
            recordTypes: records.reduce((acc, r) => {
                acc[r.recordType] = (acc[r.recordType] || 0) + 1;
                return acc;
            }, {}),
        },
    };
};
exports.generateStudentHistoryReport = generateStudentHistoryReport;
/**
 * Default export with all utilities.
 */
exports.default = {
    // Models
    createStudentRecordModel: exports.createStudentRecordModel,
    createAcademicHistoryModel: exports.createAcademicHistoryModel,
    createEducationalRecordModel: exports.createEducationalRecordModel,
    // Student Records Management
    createStudentRecord: exports.createStudentRecord,
    getStudentRecord: exports.getStudentRecord,
    updateStudentRecord: exports.updateStudentRecord,
    lockStudentRecord: exports.lockStudentRecord,
    getStudentRecords: exports.getStudentRecords,
    createAcademicHistory: exports.createAcademicHistory,
    calculateCumulativeGPA: exports.calculateCumulativeGPA,
    addEducationalRecord: exports.addEducationalRecord,
    verifyEducationalRecord: exports.verifyEducationalRecord,
    // FERPA Compliance
    createFERPAConsent: exports.createFERPAConsent,
    validateFERPAAuthorization: exports.validateFERPAAuthorization,
    revokeFERPAConsent: exports.revokeFERPAConsent,
    checkDirectoryOptOut: exports.checkDirectoryOptOut,
    logRecordAccess: exports.logRecordAccess,
    getFERPAAuditLog: exports.getFERPAAuditLog,
    validateRecordDisclosure: exports.validateRecordDisclosure,
    generateFERPAComplianceReport: exports.generateFERPAComplianceReport,
    encryptRecordData: exports.encryptRecordData,
    decryptRecordData: exports.decryptRecordData,
    // Records Request Management
    createRecordsRequest: exports.createRecordsRequest,
    processRecordsRequest: exports.processRecordsRequest,
    completeRecordsRequest: exports.completeRecordsRequest,
    getPendingRecordsRequests: exports.getPendingRecordsRequests,
    cancelRecordsRequest: exports.cancelRecordsRequest,
    // Records Verification
    createTranscriptRequest: exports.createTranscriptRequest,
    generateOfficialTranscript: exports.generateOfficialTranscript,
    verifyTranscriptAuthenticity: exports.verifyTranscriptAuthenticity,
    generateDegreeVerification: exports.generateDegreeVerification,
    createEnrollmentVerificationLetter: exports.createEnrollmentVerificationLetter,
    // Records Changes, Holds, Locks
    createGradeChangeRequest: exports.createGradeChangeRequest,
    approveGradeChange: exports.approveGradeChange,
    placeRecordsHold: exports.placeRecordsHold,
    releaseRecordsHold: exports.releaseRecordsHold,
    checkRecordsHolds: exports.checkRecordsHolds,
    // Records Archival and Security
    archiveStudentRecords: exports.archiveStudentRecords,
    retrieveArchivedRecords: exports.retrieveArchivedRecords,
    scheduleRecordsDestruction: exports.scheduleRecordsDestruction,
    destroyExpiredRecords: exports.destroyExpiredRecords,
    generateRetentionReport: exports.generateRetentionReport,
    performSecurityAudit: exports.performSecurityAudit,
    encryptStudentRecords: exports.encryptStudentRecords,
    validateEncryptionCompliance: exports.validateEncryptionCompliance,
    createDegreeAudit: exports.createDegreeAudit,
    generateStudentHistoryReport: exports.generateStudentHistoryReport,
};
//# sourceMappingURL=student-records-kit.js.map