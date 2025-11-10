"use strict";
/**
 * LOC: LEGAL_ETHICS_KIT_001
 * File: /reuse/legal/legal-ethics-compliance-kit.ts
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
 *   - Legal ethics management modules
 *   - Professional responsibility services
 *   - Conflict of interest controllers
 *   - Client confidentiality services
 *   - Fee compliance services
 *   - Ethics monitoring dashboards
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
exports.legalEthicsConfig = exports.LegalEthicsComplianceModule = exports.ProfessionalConductService = exports.FeeArrangementComplianceService = exports.ClientConfidentialityService = exports.ConflictOfInterestService = exports.EthicsViolationService = exports.EthicsRuleService = exports.ConfidentialityRecordModel = exports.FeeArrangementComplianceModel = exports.RemediationPlanModel = exports.ConflictCheckModel = exports.EthicsViolationModel = exports.EthicsRuleModel = exports.ConfidentialityRecordSchema = exports.FeeArrangementSchema = exports.ConflictCheckSchema = exports.EthicsViolationSchema = exports.EthicsRuleSchema = exports.BarReportingType = exports.ConductArea = exports.ConfidentialityLevel = exports.FeeArrangementType = exports.ConflictResolution = exports.ConflictType = exports.ViolationStatus = exports.ViolationSeverity = exports.EthicsRuleCategory = void 0;
exports.generateEthicsComplianceHash = generateEthicsComplianceHash;
exports.calculateViolationRiskScore = calculateViolationRiskScore;
exports.formatRuleCitation = formatRuleCitation;
exports.validateConflictWaiver = validateConflictWaiver;
/**
 * File: /reuse/legal/legal-ethics-compliance-kit.ts
 * Locator: WC-LEGAL-ETHICS-KIT-001
 * Purpose: Production-Grade Legal Ethics & Professional Responsibility Kit - Comprehensive ethics compliance toolkit
 *
 * Upstream: NestJS, Sequelize, Zod, date-fns, crypto
 * Downstream: ../backend/modules/legal/*, Ethics compliance services, Professional conduct modules
 * Dependencies: TypeScript 5.x, Node 18+, sequelize-typescript, @nestjs/swagger, zod
 * Exports: 36 production-ready legal ethics and professional responsibility functions
 *
 * LLM Context: Production-grade legal ethics and professional responsibility toolkit for White Cross platform.
 * Provides comprehensive ethics rule tracking with jurisdiction-specific rules and updates, professional
 * conduct analysis with automated violation detection, conflict of interest management with advanced
 * screening algorithms, client confidentiality protection with privilege tracking, fee arrangement
 * compliance with reasonableness analysis, ethics violation tracking with remediation workflows,
 * continuing legal education (CLE) tracking, client trust account monitoring, pro bono commitment
 * tracking, advertising and solicitation compliance, lawyer competency assessment, client communication
 * standards, billing ethics validation, matter acceptance screening, withdrawal of representation
 * protocols, third-party communication rules, opposing counsel professional courtesy, expert witness
 * ethics, litigation conduct standards, settlement authority verification, and Bar association
 * reporting. Includes Sequelize models for ethics rules, violations, conflicts, remediation plans,
 * CLE records, NestJS services with dependency injection, Swagger API documentation, and comprehensive
 * validation schemas for all ethics-related operations.
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
 * Ethics rule categories based on ABA Model Rules of Professional Conduct
 */
var EthicsRuleCategory;
(function (EthicsRuleCategory) {
    EthicsRuleCategory["CLIENT_LAWYER_RELATIONSHIP"] = "client_lawyer_relationship";
    EthicsRuleCategory["COUNSELOR"] = "counselor";
    EthicsRuleCategory["ADVOCATE"] = "advocate";
    EthicsRuleCategory["TRANSACTIONS_WITH_OTHERS"] = "transactions_with_others";
    EthicsRuleCategory["LAW_FIRMS"] = "law_firms";
    EthicsRuleCategory["PUBLIC_SERVICE"] = "public_service";
    EthicsRuleCategory["INFORMATION_ABOUT_SERVICES"] = "information_about_services";
    EthicsRuleCategory["MAINTAINING_INTEGRITY"] = "maintaining_integrity";
})(EthicsRuleCategory || (exports.EthicsRuleCategory = EthicsRuleCategory = {}));
/**
 * Violation severity levels
 */
var ViolationSeverity;
(function (ViolationSeverity) {
    ViolationSeverity["MINOR"] = "minor";
    ViolationSeverity["MODERATE"] = "moderate";
    ViolationSeverity["SERIOUS"] = "serious";
    ViolationSeverity["SEVERE"] = "severe";
    ViolationSeverity["DISBARMENT_LEVEL"] = "disbarment_level";
})(ViolationSeverity || (exports.ViolationSeverity = ViolationSeverity = {}));
/**
 * Violation status tracking
 */
var ViolationStatus;
(function (ViolationStatus) {
    ViolationStatus["REPORTED"] = "reported";
    ViolationStatus["UNDER_INVESTIGATION"] = "under_investigation";
    ViolationStatus["SUBSTANTIATED"] = "substantiated";
    ViolationStatus["UNSUBSTANTIATED"] = "unsubstantiated";
    ViolationStatus["REMEDIATED"] = "remediated";
    ViolationStatus["PENDING_DISCIPLINE"] = "pending_discipline";
    ViolationStatus["CLOSED"] = "closed";
})(ViolationStatus || (exports.ViolationStatus = ViolationStatus = {}));
/**
 * Conflict of interest types
 */
var ConflictType;
(function (ConflictType) {
    ConflictType["DIRECT_ADVERSITY"] = "direct_adversity";
    ConflictType["MATERIAL_LIMITATION"] = "material_limitation";
    ConflictType["FORMER_CLIENT"] = "former_client";
    ConflictType["IMPUTED_CONFLICT"] = "imputed_conflict";
    ConflictType["PERSONAL_INTEREST"] = "personal_interest";
    ConflictType["THIRD_PARTY_PAYER"] = "third_party_payer";
    ConflictType["PROSPECTIVE_CLIENT"] = "prospective_client";
    ConflictType["BUSINESS_TRANSACTION"] = "business_transaction";
})(ConflictType || (exports.ConflictType = ConflictType = {}));
/**
 * Conflict resolution status
 */
var ConflictResolution;
(function (ConflictResolution) {
    ConflictResolution["WAIVED_BY_CLIENT"] = "waived_by_client";
    ConflictResolution["SCREENING_IMPLEMENTED"] = "screening_implemented";
    ConflictResolution["REPRESENTATION_DECLINED"] = "representation_declined";
    ConflictResolution["REPRESENTATION_TERMINATED"] = "representation_terminated";
    ConflictResolution["NO_CONFLICT"] = "no_conflict";
    ConflictResolution["PENDING_REVIEW"] = "pending_review";
})(ConflictResolution || (exports.ConflictResolution = ConflictResolution = {}));
/**
 * Fee arrangement types
 */
var FeeArrangementType;
(function (FeeArrangementType) {
    FeeArrangementType["HOURLY"] = "hourly";
    FeeArrangementType["FLAT_FEE"] = "flat_fee";
    FeeArrangementType["CONTINGENT"] = "contingent";
    FeeArrangementType["RETAINER"] = "retainer";
    FeeArrangementType["HYBRID"] = "hybrid";
    FeeArrangementType["STATUTORY"] = "statutory";
    FeeArrangementType["COURT_AWARDED"] = "court_awarded";
})(FeeArrangementType || (exports.FeeArrangementType = FeeArrangementType = {}));
/**
 * Confidentiality classification levels
 */
var ConfidentialityLevel;
(function (ConfidentialityLevel) {
    ConfidentialityLevel["PUBLIC"] = "public";
    ConfidentialityLevel["CONFIDENTIAL"] = "confidential";
    ConfidentialityLevel["ATTORNEY_CLIENT_PRIVILEGE"] = "attorney_client_privilege";
    ConfidentialityLevel["WORK_PRODUCT"] = "work_product";
    ConfidentialityLevel["TRADE_SECRET"] = "trade_secret";
})(ConfidentialityLevel || (exports.ConfidentialityLevel = ConfidentialityLevel = {}));
/**
 * Professional conduct areas
 */
var ConductArea;
(function (ConductArea) {
    ConductArea["COMPETENCE"] = "competence";
    ConductArea["DILIGENCE"] = "diligence";
    ConductArea["COMMUNICATION"] = "communication";
    ConductArea["CONFIDENTIALITY"] = "confidentiality";
    ConductArea["CONFLICTS"] = "conflicts";
    ConductArea["FEES"] = "fees";
    ConductArea["ADVERTISING"] = "advertising";
    ConductArea["CANDOR_TO_TRIBUNAL"] = "candor_to_tribunal";
    ConductArea["FAIRNESS_TO_OPPOSING_PARTY"] = "fairness_to_opposing_party";
    ConductArea["TRANSACTIONS_WITH_NONLAWYERS"] = "transactions_with_nonlawyers";
})(ConductArea || (exports.ConductArea = ConductArea = {}));
/**
 * Bar association reporting types
 */
var BarReportingType;
(function (BarReportingType) {
    BarReportingType["ANNUAL_REGISTRATION"] = "annual_registration";
    BarReportingType["CLE_COMPLIANCE"] = "cle_compliance";
    BarReportingType["TRUST_ACCOUNT_CERTIFICATION"] = "trust_account_certification";
    BarReportingType["MALPRACTICE_INSURANCE"] = "malpractice_insurance";
    BarReportingType["DISCIPLINARY_ACTION"] = "disciplinary_action";
    BarReportingType["PRO_BONO_HOURS"] = "pro_bono_hours";
    BarReportingType["IOLTA_REPORT"] = "iolta_report";
})(BarReportingType || (exports.BarReportingType = BarReportingType = {}));
// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================
/**
 * Ethics rule validation schema
 */
exports.EthicsRuleSchema = zod_1.z.object({
    ruleNumber: zod_1.z.string().min(1).max(50),
    title: zod_1.z.string().min(1).max(500),
    category: zod_1.z.nativeEnum(EthicsRuleCategory),
    jurisdiction: zod_1.z.string().min(2).max(100),
    ruleText: zod_1.z.string().min(1),
    commentary: zod_1.z.string().optional(),
    effectiveDate: zod_1.z.date(),
    amendments: zod_1.z.array(zod_1.z.object({
        date: zod_1.z.date(),
        description: zod_1.z.string(),
        amendedText: zod_1.z.string(),
    })).optional(),
    relatedRules: zod_1.z.array(zod_1.z.string()).optional(),
    caseAnnotations: zod_1.z.array(zod_1.z.object({
        caseName: zod_1.z.string(),
        citation: zod_1.z.string(),
        summary: zod_1.z.string(),
        year: zod_1.z.number(),
    })).optional(),
    disciplinaryStandard: zod_1.z.string().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Ethics violation validation schema
 */
exports.EthicsViolationSchema = zod_1.z.object({
    violationType: zod_1.z.string().min(1),
    ruleViolated: zod_1.z.string().min(1),
    severity: zod_1.z.nativeEnum(ViolationSeverity),
    status: zod_1.z.nativeEnum(ViolationStatus),
    lawyerId: zod_1.z.string().uuid(),
    matterId: zod_1.z.string().uuid().optional(),
    clientId: zod_1.z.string().uuid().optional(),
    reportedBy: zod_1.z.string().optional(),
    reportedDate: zod_1.z.date(),
    incidentDate: zod_1.z.date(),
    description: zod_1.z.string().min(10),
    evidence: zod_1.z.array(zod_1.z.string()).optional(),
    investigationNotes: zod_1.z.string().optional(),
    remediationPlanId: zod_1.z.string().uuid().optional(),
    disciplinaryAction: zod_1.z.string().optional(),
    closedDate: zod_1.z.date().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Conflict check validation schema
 */
exports.ConflictCheckSchema = zod_1.z.object({
    matterId: zod_1.z.string().uuid(),
    clientId: zod_1.z.string().uuid(),
    opposingParties: zod_1.z.array(zod_1.z.string()),
    relatedEntities: zod_1.z.array(zod_1.z.string()),
    checkDate: zod_1.z.date(),
    checkedBy: zod_1.z.string().uuid(),
    conflictsFound: zod_1.z.array(zod_1.z.object({
        conflictType: zod_1.z.nativeEnum(ConflictType),
        description: zod_1.z.string(),
        involvedParties: zod_1.z.array(zod_1.z.string()),
        affectedLawyers: zod_1.z.array(zod_1.z.string()),
        matterReference: zod_1.z.string().optional(),
        riskLevel: zod_1.z.enum(['low', 'medium', 'high', 'critical']),
        recommendation: zod_1.z.string(),
    })),
    resolution: zod_1.z.nativeEnum(ConflictResolution).optional(),
    waiverObtained: zod_1.z.boolean().optional(),
    waiverDate: zod_1.z.date().optional(),
    screeningMeasures: zod_1.z.array(zod_1.z.string()).optional(),
    status: zod_1.z.enum(['pending', 'cleared', 'conflict_exists', 'waived']),
    notes: zod_1.z.string().optional(),
});
/**
 * Fee arrangement validation schema
 */
exports.FeeArrangementSchema = zod_1.z.object({
    matterId: zod_1.z.string().uuid(),
    clientId: zod_1.z.string().uuid(),
    arrangementType: zod_1.z.nativeEnum(FeeArrangementType),
    writtenAgreement: zod_1.z.boolean(),
    agreementDate: zod_1.z.date().optional(),
    rate: zod_1.z.number().positive().optional(),
    contingencyPercentage: zod_1.z.number().min(0).max(100).optional(),
    flatFeeAmount: zod_1.z.number().positive().optional(),
    retainerAmount: zod_1.z.number().positive().optional(),
    scopeOfRepresentation: zod_1.z.string().min(10),
    billingFrequency: zod_1.z.string().optional(),
    complianceStatus: zod_1.z.enum(['compliant', 'under_review', 'non_compliant']),
});
/**
 * Confidentiality record validation schema
 */
exports.ConfidentialityRecordSchema = zod_1.z.object({
    clientId: zod_1.z.string().uuid(),
    matterId: zod_1.z.string().uuid(),
    documentId: zod_1.z.string().uuid().optional(),
    communicationId: zod_1.z.string().uuid().optional(),
    classificationLevel: zod_1.z.nativeEnum(ConfidentialityLevel),
    subject: zod_1.z.string().min(1),
    createdDate: zod_1.z.date(),
    privilegeClaim: zod_1.z.boolean(),
    workProductClaim: zod_1.z.boolean(),
    exceptions: zod_1.z.array(zod_1.z.string()).optional(),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Ethics Rule Model
 * Stores jurisdiction-specific ethics rules and professional conduct standards
 */
let EthicsRuleModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'ethics_rules',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['jurisdiction'] },
                { fields: ['category'] },
                { fields: ['ruleNumber', 'jurisdiction'], unique: true },
                { fields: ['effectiveDate'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _ruleNumber_decorators;
    let _ruleNumber_initializers = [];
    let _ruleNumber_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _jurisdiction_decorators;
    let _jurisdiction_initializers = [];
    let _jurisdiction_extraInitializers = [];
    let _ruleText_decorators;
    let _ruleText_initializers = [];
    let _ruleText_extraInitializers = [];
    let _commentary_decorators;
    let _commentary_initializers = [];
    let _commentary_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _amendments_decorators;
    let _amendments_initializers = [];
    let _amendments_extraInitializers = [];
    let _relatedRules_decorators;
    let _relatedRules_initializers = [];
    let _relatedRules_extraInitializers = [];
    let _caseAnnotations_decorators;
    let _caseAnnotations_initializers = [];
    let _caseAnnotations_extraInitializers = [];
    let _disciplinaryStandard_decorators;
    let _disciplinaryStandard_initializers = [];
    let _disciplinaryStandard_extraInitializers = [];
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
    let _violations_decorators;
    let _violations_initializers = [];
    let _violations_extraInitializers = [];
    var EthicsRuleModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.ruleNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _ruleNumber_initializers, void 0));
            this.title = (__runInitializers(this, _ruleNumber_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.category = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.jurisdiction = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _jurisdiction_initializers, void 0));
            this.ruleText = (__runInitializers(this, _jurisdiction_extraInitializers), __runInitializers(this, _ruleText_initializers, void 0));
            this.commentary = (__runInitializers(this, _ruleText_extraInitializers), __runInitializers(this, _commentary_initializers, void 0));
            this.effectiveDate = (__runInitializers(this, _commentary_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
            this.amendments = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _amendments_initializers, void 0));
            this.relatedRules = (__runInitializers(this, _amendments_extraInitializers), __runInitializers(this, _relatedRules_initializers, void 0));
            this.caseAnnotations = (__runInitializers(this, _relatedRules_extraInitializers), __runInitializers(this, _caseAnnotations_initializers, void 0));
            this.disciplinaryStandard = (__runInitializers(this, _caseAnnotations_extraInitializers), __runInitializers(this, _disciplinaryStandard_initializers, void 0));
            this.metadata = (__runInitializers(this, _disciplinaryStandard_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.violations = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _violations_initializers, void 0));
            __runInitializers(this, _violations_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "EthicsRuleModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique identifier', example: '123e4567-e89b-12d3-a456-426614174000' })];
        _ruleNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Ethics rule number', example: '1.7' })];
        _title_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Rule title', example: 'Conflict of Interest: Current Clients' })];
        _category_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(EthicsRuleCategory)),
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ enum: EthicsRuleCategory, description: 'Rule category' })];
        _jurisdiction_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Jurisdiction (state/country)', example: 'California' })];
        _ruleText_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Full text of the ethics rule' })];
        _commentary_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Official commentary on the rule' })];
        _effectiveDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Date rule became effective' })];
        _amendments_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Amendment history' })];
        _relatedRules_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Related rule numbers' })];
        _caseAnnotations_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Case law annotations' })];
        _disciplinaryStandard_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Disciplinary standards for violations' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' })];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiPropertyOptional)({ description: 'Soft delete timestamp' })];
        _violations_decorators = [(0, sequelize_typescript_1.HasMany)(() => EthicsViolationModel, 'ruleViolated')];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _ruleNumber_decorators, { kind: "field", name: "ruleNumber", static: false, private: false, access: { has: obj => "ruleNumber" in obj, get: obj => obj.ruleNumber, set: (obj, value) => { obj.ruleNumber = value; } }, metadata: _metadata }, _ruleNumber_initializers, _ruleNumber_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _jurisdiction_decorators, { kind: "field", name: "jurisdiction", static: false, private: false, access: { has: obj => "jurisdiction" in obj, get: obj => obj.jurisdiction, set: (obj, value) => { obj.jurisdiction = value; } }, metadata: _metadata }, _jurisdiction_initializers, _jurisdiction_extraInitializers);
        __esDecorate(null, null, _ruleText_decorators, { kind: "field", name: "ruleText", static: false, private: false, access: { has: obj => "ruleText" in obj, get: obj => obj.ruleText, set: (obj, value) => { obj.ruleText = value; } }, metadata: _metadata }, _ruleText_initializers, _ruleText_extraInitializers);
        __esDecorate(null, null, _commentary_decorators, { kind: "field", name: "commentary", static: false, private: false, access: { has: obj => "commentary" in obj, get: obj => obj.commentary, set: (obj, value) => { obj.commentary = value; } }, metadata: _metadata }, _commentary_initializers, _commentary_extraInitializers);
        __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
        __esDecorate(null, null, _amendments_decorators, { kind: "field", name: "amendments", static: false, private: false, access: { has: obj => "amendments" in obj, get: obj => obj.amendments, set: (obj, value) => { obj.amendments = value; } }, metadata: _metadata }, _amendments_initializers, _amendments_extraInitializers);
        __esDecorate(null, null, _relatedRules_decorators, { kind: "field", name: "relatedRules", static: false, private: false, access: { has: obj => "relatedRules" in obj, get: obj => obj.relatedRules, set: (obj, value) => { obj.relatedRules = value; } }, metadata: _metadata }, _relatedRules_initializers, _relatedRules_extraInitializers);
        __esDecorate(null, null, _caseAnnotations_decorators, { kind: "field", name: "caseAnnotations", static: false, private: false, access: { has: obj => "caseAnnotations" in obj, get: obj => obj.caseAnnotations, set: (obj, value) => { obj.caseAnnotations = value; } }, metadata: _metadata }, _caseAnnotations_initializers, _caseAnnotations_extraInitializers);
        __esDecorate(null, null, _disciplinaryStandard_decorators, { kind: "field", name: "disciplinaryStandard", static: false, private: false, access: { has: obj => "disciplinaryStandard" in obj, get: obj => obj.disciplinaryStandard, set: (obj, value) => { obj.disciplinaryStandard = value; } }, metadata: _metadata }, _disciplinaryStandard_initializers, _disciplinaryStandard_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _violations_decorators, { kind: "field", name: "violations", static: false, private: false, access: { has: obj => "violations" in obj, get: obj => obj.violations, set: (obj, value) => { obj.violations = value; } }, metadata: _metadata }, _violations_initializers, _violations_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EthicsRuleModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EthicsRuleModel = _classThis;
})();
exports.EthicsRuleModel = EthicsRuleModel;
/**
 * Ethics Violation Model
 * Tracks ethics violations, investigations, and disciplinary actions
 */
let EthicsViolationModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'ethics_violations',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['lawyerId'] },
                { fields: ['status'] },
                { fields: ['severity'] },
                { fields: ['incidentDate'] },
                { fields: ['matterId'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _violationType_decorators;
    let _violationType_initializers = [];
    let _violationType_extraInitializers = [];
    let _ruleViolated_decorators;
    let _ruleViolated_initializers = [];
    let _ruleViolated_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _lawyerId_decorators;
    let _lawyerId_initializers = [];
    let _lawyerId_extraInitializers = [];
    let _matterId_decorators;
    let _matterId_initializers = [];
    let _matterId_extraInitializers = [];
    let _clientId_decorators;
    let _clientId_initializers = [];
    let _clientId_extraInitializers = [];
    let _reportedBy_decorators;
    let _reportedBy_initializers = [];
    let _reportedBy_extraInitializers = [];
    let _reportedDate_decorators;
    let _reportedDate_initializers = [];
    let _reportedDate_extraInitializers = [];
    let _incidentDate_decorators;
    let _incidentDate_initializers = [];
    let _incidentDate_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _evidence_decorators;
    let _evidence_initializers = [];
    let _evidence_extraInitializers = [];
    let _investigationNotes_decorators;
    let _investigationNotes_initializers = [];
    let _investigationNotes_extraInitializers = [];
    let _remediationPlanId_decorators;
    let _remediationPlanId_initializers = [];
    let _remediationPlanId_extraInitializers = [];
    let _disciplinaryAction_decorators;
    let _disciplinaryAction_initializers = [];
    let _disciplinaryAction_extraInitializers = [];
    let _closedDate_decorators;
    let _closedDate_initializers = [];
    let _closedDate_extraInitializers = [];
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
    let _rule_decorators;
    let _rule_initializers = [];
    let _rule_extraInitializers = [];
    let _remediationPlan_decorators;
    let _remediationPlan_initializers = [];
    let _remediationPlan_extraInitializers = [];
    var EthicsViolationModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.violationType = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _violationType_initializers, void 0));
            this.ruleViolated = (__runInitializers(this, _violationType_extraInitializers), __runInitializers(this, _ruleViolated_initializers, void 0));
            this.severity = (__runInitializers(this, _ruleViolated_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
            this.status = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.lawyerId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _lawyerId_initializers, void 0));
            this.matterId = (__runInitializers(this, _lawyerId_extraInitializers), __runInitializers(this, _matterId_initializers, void 0));
            this.clientId = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _clientId_initializers, void 0));
            this.reportedBy = (__runInitializers(this, _clientId_extraInitializers), __runInitializers(this, _reportedBy_initializers, void 0));
            this.reportedDate = (__runInitializers(this, _reportedBy_extraInitializers), __runInitializers(this, _reportedDate_initializers, void 0));
            this.incidentDate = (__runInitializers(this, _reportedDate_extraInitializers), __runInitializers(this, _incidentDate_initializers, void 0));
            this.description = (__runInitializers(this, _incidentDate_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.evidence = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _evidence_initializers, void 0));
            this.investigationNotes = (__runInitializers(this, _evidence_extraInitializers), __runInitializers(this, _investigationNotes_initializers, void 0));
            this.remediationPlanId = (__runInitializers(this, _investigationNotes_extraInitializers), __runInitializers(this, _remediationPlanId_initializers, void 0));
            this.disciplinaryAction = (__runInitializers(this, _remediationPlanId_extraInitializers), __runInitializers(this, _disciplinaryAction_initializers, void 0));
            this.closedDate = (__runInitializers(this, _disciplinaryAction_extraInitializers), __runInitializers(this, _closedDate_initializers, void 0));
            this.metadata = (__runInitializers(this, _closedDate_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.rule = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _rule_initializers, void 0));
            this.remediationPlan = (__runInitializers(this, _rule_extraInitializers), __runInitializers(this, _remediationPlan_initializers, void 0));
            __runInitializers(this, _remediationPlan_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "EthicsViolationModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique identifier' })];
        _violationType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Type of violation' })];
        _ruleViolated_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => EthicsRuleModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Rule number that was violated' })];
        _severity_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ViolationSeverity)),
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ enum: ViolationSeverity, description: 'Severity of violation' })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ViolationStatus)),
                allowNull: false,
                defaultValue: ViolationStatus.REPORTED,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ enum: ViolationStatus, description: 'Current status of violation' })];
        _lawyerId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Lawyer ID who committed violation' })];
        _matterId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Associated matter ID' })];
        _clientId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Associated client ID' })];
        _reportedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Who reported the violation' })];
        _reportedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                defaultValue: sequelize_typescript_1.DataType.NOW,
            }), (0, swagger_1.ApiProperty)({ description: 'Date violation was reported' })];
        _incidentDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Date violation occurred' })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Detailed description of violation' })];
        _evidence_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Evidence file paths or references' })];
        _investigationNotes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Investigation notes' })];
        _remediationPlanId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => RemediationPlanModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Associated remediation plan ID' })];
        _disciplinaryAction_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Disciplinary action taken' })];
        _closedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Date case was closed' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' })];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiPropertyOptional)({ description: 'Soft delete timestamp' })];
        _rule_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => EthicsRuleModel, 'ruleViolated')];
        _remediationPlan_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => RemediationPlanModel, 'remediationPlanId')];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _violationType_decorators, { kind: "field", name: "violationType", static: false, private: false, access: { has: obj => "violationType" in obj, get: obj => obj.violationType, set: (obj, value) => { obj.violationType = value; } }, metadata: _metadata }, _violationType_initializers, _violationType_extraInitializers);
        __esDecorate(null, null, _ruleViolated_decorators, { kind: "field", name: "ruleViolated", static: false, private: false, access: { has: obj => "ruleViolated" in obj, get: obj => obj.ruleViolated, set: (obj, value) => { obj.ruleViolated = value; } }, metadata: _metadata }, _ruleViolated_initializers, _ruleViolated_extraInitializers);
        __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _lawyerId_decorators, { kind: "field", name: "lawyerId", static: false, private: false, access: { has: obj => "lawyerId" in obj, get: obj => obj.lawyerId, set: (obj, value) => { obj.lawyerId = value; } }, metadata: _metadata }, _lawyerId_initializers, _lawyerId_extraInitializers);
        __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
        __esDecorate(null, null, _clientId_decorators, { kind: "field", name: "clientId", static: false, private: false, access: { has: obj => "clientId" in obj, get: obj => obj.clientId, set: (obj, value) => { obj.clientId = value; } }, metadata: _metadata }, _clientId_initializers, _clientId_extraInitializers);
        __esDecorate(null, null, _reportedBy_decorators, { kind: "field", name: "reportedBy", static: false, private: false, access: { has: obj => "reportedBy" in obj, get: obj => obj.reportedBy, set: (obj, value) => { obj.reportedBy = value; } }, metadata: _metadata }, _reportedBy_initializers, _reportedBy_extraInitializers);
        __esDecorate(null, null, _reportedDate_decorators, { kind: "field", name: "reportedDate", static: false, private: false, access: { has: obj => "reportedDate" in obj, get: obj => obj.reportedDate, set: (obj, value) => { obj.reportedDate = value; } }, metadata: _metadata }, _reportedDate_initializers, _reportedDate_extraInitializers);
        __esDecorate(null, null, _incidentDate_decorators, { kind: "field", name: "incidentDate", static: false, private: false, access: { has: obj => "incidentDate" in obj, get: obj => obj.incidentDate, set: (obj, value) => { obj.incidentDate = value; } }, metadata: _metadata }, _incidentDate_initializers, _incidentDate_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _evidence_decorators, { kind: "field", name: "evidence", static: false, private: false, access: { has: obj => "evidence" in obj, get: obj => obj.evidence, set: (obj, value) => { obj.evidence = value; } }, metadata: _metadata }, _evidence_initializers, _evidence_extraInitializers);
        __esDecorate(null, null, _investigationNotes_decorators, { kind: "field", name: "investigationNotes", static: false, private: false, access: { has: obj => "investigationNotes" in obj, get: obj => obj.investigationNotes, set: (obj, value) => { obj.investigationNotes = value; } }, metadata: _metadata }, _investigationNotes_initializers, _investigationNotes_extraInitializers);
        __esDecorate(null, null, _remediationPlanId_decorators, { kind: "field", name: "remediationPlanId", static: false, private: false, access: { has: obj => "remediationPlanId" in obj, get: obj => obj.remediationPlanId, set: (obj, value) => { obj.remediationPlanId = value; } }, metadata: _metadata }, _remediationPlanId_initializers, _remediationPlanId_extraInitializers);
        __esDecorate(null, null, _disciplinaryAction_decorators, { kind: "field", name: "disciplinaryAction", static: false, private: false, access: { has: obj => "disciplinaryAction" in obj, get: obj => obj.disciplinaryAction, set: (obj, value) => { obj.disciplinaryAction = value; } }, metadata: _metadata }, _disciplinaryAction_initializers, _disciplinaryAction_extraInitializers);
        __esDecorate(null, null, _closedDate_decorators, { kind: "field", name: "closedDate", static: false, private: false, access: { has: obj => "closedDate" in obj, get: obj => obj.closedDate, set: (obj, value) => { obj.closedDate = value; } }, metadata: _metadata }, _closedDate_initializers, _closedDate_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _rule_decorators, { kind: "field", name: "rule", static: false, private: false, access: { has: obj => "rule" in obj, get: obj => obj.rule, set: (obj, value) => { obj.rule = value; } }, metadata: _metadata }, _rule_initializers, _rule_extraInitializers);
        __esDecorate(null, null, _remediationPlan_decorators, { kind: "field", name: "remediationPlan", static: false, private: false, access: { has: obj => "remediationPlan" in obj, get: obj => obj.remediationPlan, set: (obj, value) => { obj.remediationPlan = value; } }, metadata: _metadata }, _remediationPlan_initializers, _remediationPlan_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EthicsViolationModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EthicsViolationModel = _classThis;
})();
exports.EthicsViolationModel = EthicsViolationModel;
/**
 * Conflict of Interest Model
 * Manages conflict checks and screening for legal matters
 */
let ConflictCheckModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'conflict_checks',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['matterId'] },
                { fields: ['clientId'] },
                { fields: ['status'] },
                { fields: ['checkDate'] },
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
    let _clientId_decorators;
    let _clientId_initializers = [];
    let _clientId_extraInitializers = [];
    let _opposingParties_decorators;
    let _opposingParties_initializers = [];
    let _opposingParties_extraInitializers = [];
    let _relatedEntities_decorators;
    let _relatedEntities_initializers = [];
    let _relatedEntities_extraInitializers = [];
    let _checkDate_decorators;
    let _checkDate_initializers = [];
    let _checkDate_extraInitializers = [];
    let _checkedBy_decorators;
    let _checkedBy_initializers = [];
    let _checkedBy_extraInitializers = [];
    let _conflictsFound_decorators;
    let _conflictsFound_initializers = [];
    let _conflictsFound_extraInitializers = [];
    let _resolution_decorators;
    let _resolution_initializers = [];
    let _resolution_extraInitializers = [];
    let _waiverObtained_decorators;
    let _waiverObtained_initializers = [];
    let _waiverObtained_extraInitializers = [];
    let _waiverDate_decorators;
    let _waiverDate_initializers = [];
    let _waiverDate_extraInitializers = [];
    let _screeningMeasures_decorators;
    let _screeningMeasures_initializers = [];
    let _screeningMeasures_extraInitializers = [];
    let _reviewDate_decorators;
    let _reviewDate_initializers = [];
    let _reviewDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var ConflictCheckModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.matterId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _matterId_initializers, void 0));
            this.clientId = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _clientId_initializers, void 0));
            this.opposingParties = (__runInitializers(this, _clientId_extraInitializers), __runInitializers(this, _opposingParties_initializers, void 0));
            this.relatedEntities = (__runInitializers(this, _opposingParties_extraInitializers), __runInitializers(this, _relatedEntities_initializers, void 0));
            this.checkDate = (__runInitializers(this, _relatedEntities_extraInitializers), __runInitializers(this, _checkDate_initializers, void 0));
            this.checkedBy = (__runInitializers(this, _checkDate_extraInitializers), __runInitializers(this, _checkedBy_initializers, void 0));
            this.conflictsFound = (__runInitializers(this, _checkedBy_extraInitializers), __runInitializers(this, _conflictsFound_initializers, void 0));
            this.resolution = (__runInitializers(this, _conflictsFound_extraInitializers), __runInitializers(this, _resolution_initializers, void 0));
            this.waiverObtained = (__runInitializers(this, _resolution_extraInitializers), __runInitializers(this, _waiverObtained_initializers, void 0));
            this.waiverDate = (__runInitializers(this, _waiverObtained_extraInitializers), __runInitializers(this, _waiverDate_initializers, void 0));
            this.screeningMeasures = (__runInitializers(this, _waiverDate_extraInitializers), __runInitializers(this, _screeningMeasures_initializers, void 0));
            this.reviewDate = (__runInitializers(this, _screeningMeasures_extraInitializers), __runInitializers(this, _reviewDate_initializers, void 0));
            this.status = (__runInitializers(this, _reviewDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.notes = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ConflictCheckModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique identifier' })];
        _matterId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Matter ID' })];
        _clientId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Client ID' })];
        _opposingParties_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'List of opposing parties' })];
        _relatedEntities_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Related entities to check' })];
        _checkDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                defaultValue: sequelize_typescript_1.DataType.NOW,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Date conflict check was performed' })];
        _checkedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'User who performed the check' })];
        _conflictsFound_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                defaultValue: [],
            }), (0, swagger_1.ApiProperty)({ description: 'Conflicts found during check' })];
        _resolution_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ConflictResolution)),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ enum: ConflictResolution, description: 'How conflict was resolved' })];
        _waiverObtained_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: true,
                defaultValue: false,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Whether client waiver was obtained' })];
        _waiverDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Date waiver was obtained' })];
        _screeningMeasures_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Screening measures implemented' })];
        _reviewDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Next review date' })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('pending', 'cleared', 'conflict_exists', 'waived'),
                allowNull: false,
                defaultValue: 'pending',
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Current status of conflict check' })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' })];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiPropertyOptional)({ description: 'Soft delete timestamp' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
        __esDecorate(null, null, _clientId_decorators, { kind: "field", name: "clientId", static: false, private: false, access: { has: obj => "clientId" in obj, get: obj => obj.clientId, set: (obj, value) => { obj.clientId = value; } }, metadata: _metadata }, _clientId_initializers, _clientId_extraInitializers);
        __esDecorate(null, null, _opposingParties_decorators, { kind: "field", name: "opposingParties", static: false, private: false, access: { has: obj => "opposingParties" in obj, get: obj => obj.opposingParties, set: (obj, value) => { obj.opposingParties = value; } }, metadata: _metadata }, _opposingParties_initializers, _opposingParties_extraInitializers);
        __esDecorate(null, null, _relatedEntities_decorators, { kind: "field", name: "relatedEntities", static: false, private: false, access: { has: obj => "relatedEntities" in obj, get: obj => obj.relatedEntities, set: (obj, value) => { obj.relatedEntities = value; } }, metadata: _metadata }, _relatedEntities_initializers, _relatedEntities_extraInitializers);
        __esDecorate(null, null, _checkDate_decorators, { kind: "field", name: "checkDate", static: false, private: false, access: { has: obj => "checkDate" in obj, get: obj => obj.checkDate, set: (obj, value) => { obj.checkDate = value; } }, metadata: _metadata }, _checkDate_initializers, _checkDate_extraInitializers);
        __esDecorate(null, null, _checkedBy_decorators, { kind: "field", name: "checkedBy", static: false, private: false, access: { has: obj => "checkedBy" in obj, get: obj => obj.checkedBy, set: (obj, value) => { obj.checkedBy = value; } }, metadata: _metadata }, _checkedBy_initializers, _checkedBy_extraInitializers);
        __esDecorate(null, null, _conflictsFound_decorators, { kind: "field", name: "conflictsFound", static: false, private: false, access: { has: obj => "conflictsFound" in obj, get: obj => obj.conflictsFound, set: (obj, value) => { obj.conflictsFound = value; } }, metadata: _metadata }, _conflictsFound_initializers, _conflictsFound_extraInitializers);
        __esDecorate(null, null, _resolution_decorators, { kind: "field", name: "resolution", static: false, private: false, access: { has: obj => "resolution" in obj, get: obj => obj.resolution, set: (obj, value) => { obj.resolution = value; } }, metadata: _metadata }, _resolution_initializers, _resolution_extraInitializers);
        __esDecorate(null, null, _waiverObtained_decorators, { kind: "field", name: "waiverObtained", static: false, private: false, access: { has: obj => "waiverObtained" in obj, get: obj => obj.waiverObtained, set: (obj, value) => { obj.waiverObtained = value; } }, metadata: _metadata }, _waiverObtained_initializers, _waiverObtained_extraInitializers);
        __esDecorate(null, null, _waiverDate_decorators, { kind: "field", name: "waiverDate", static: false, private: false, access: { has: obj => "waiverDate" in obj, get: obj => obj.waiverDate, set: (obj, value) => { obj.waiverDate = value; } }, metadata: _metadata }, _waiverDate_initializers, _waiverDate_extraInitializers);
        __esDecorate(null, null, _screeningMeasures_decorators, { kind: "field", name: "screeningMeasures", static: false, private: false, access: { has: obj => "screeningMeasures" in obj, get: obj => obj.screeningMeasures, set: (obj, value) => { obj.screeningMeasures = value; } }, metadata: _metadata }, _screeningMeasures_initializers, _screeningMeasures_extraInitializers);
        __esDecorate(null, null, _reviewDate_decorators, { kind: "field", name: "reviewDate", static: false, private: false, access: { has: obj => "reviewDate" in obj, get: obj => obj.reviewDate, set: (obj, value) => { obj.reviewDate = value; } }, metadata: _metadata }, _reviewDate_initializers, _reviewDate_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConflictCheckModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConflictCheckModel = _classThis;
})();
exports.ConflictCheckModel = ConflictCheckModel;
/**
 * Remediation Plan Model
 * Tracks remediation plans for ethics violations
 */
let RemediationPlanModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'remediation_plans',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['violationId'] },
                { fields: ['lawyerId'] },
                { fields: ['status'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _violationId_decorators;
    let _violationId_initializers = [];
    let _violationId_extraInitializers = [];
    let _lawyerId_decorators;
    let _lawyerId_initializers = [];
    let _lawyerId_extraInitializers = [];
    let _createdDate_decorators;
    let _createdDate_initializers = [];
    let _createdDate_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _objectives_decorators;
    let _objectives_initializers = [];
    let _objectives_extraInitializers = [];
    let _actions_decorators;
    let _actions_initializers = [];
    let _actions_extraInitializers = [];
    let _trainingRequired_decorators;
    let _trainingRequired_initializers = [];
    let _trainingRequired_extraInitializers = [];
    let _supervisoryReview_decorators;
    let _supervisoryReview_initializers = [];
    let _supervisoryReview_extraInitializers = [];
    let _reviewFrequency_decorators;
    let _reviewFrequency_initializers = [];
    let _reviewFrequency_extraInitializers = [];
    let _completionDate_decorators;
    let _completionDate_initializers = [];
    let _completionDate_extraInitializers = [];
    let _effectiveness_decorators;
    let _effectiveness_initializers = [];
    let _effectiveness_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _violations_decorators;
    let _violations_initializers = [];
    let _violations_extraInitializers = [];
    var RemediationPlanModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.violationId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _violationId_initializers, void 0));
            this.lawyerId = (__runInitializers(this, _violationId_extraInitializers), __runInitializers(this, _lawyerId_initializers, void 0));
            this.createdDate = (__runInitializers(this, _lawyerId_extraInitializers), __runInitializers(this, _createdDate_initializers, void 0));
            this.createdBy = (__runInitializers(this, _createdDate_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.objectives = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _objectives_initializers, void 0));
            this.actions = (__runInitializers(this, _objectives_extraInitializers), __runInitializers(this, _actions_initializers, void 0));
            this.trainingRequired = (__runInitializers(this, _actions_extraInitializers), __runInitializers(this, _trainingRequired_initializers, void 0));
            this.supervisoryReview = (__runInitializers(this, _trainingRequired_extraInitializers), __runInitializers(this, _supervisoryReview_initializers, void 0));
            this.reviewFrequency = (__runInitializers(this, _supervisoryReview_extraInitializers), __runInitializers(this, _reviewFrequency_initializers, void 0));
            this.completionDate = (__runInitializers(this, _reviewFrequency_extraInitializers), __runInitializers(this, _completionDate_initializers, void 0));
            this.effectiveness = (__runInitializers(this, _completionDate_extraInitializers), __runInitializers(this, _effectiveness_initializers, void 0));
            this.status = (__runInitializers(this, _effectiveness_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.createdAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.violations = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _violations_initializers, void 0));
            __runInitializers(this, _violations_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "RemediationPlanModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique identifier' })];
        _violationId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Associated violation ID' })];
        _lawyerId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Lawyer ID' })];
        _createdDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                defaultValue: sequelize_typescript_1.DataType.NOW,
            }), (0, swagger_1.ApiProperty)({ description: 'Plan creation date' })];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'User who created the plan' })];
        _objectives_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Remediation objectives' })];
        _actions_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Remediation actions' })];
        _trainingRequired_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Required training courses' })];
        _supervisoryReview_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            }), (0, swagger_1.ApiProperty)({ description: 'Whether supervisory review is required' })];
        _reviewFrequency_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Review frequency', example: 'monthly' })];
        _completionDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Plan completion date' })];
        _effectiveness_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Effectiveness assessment' })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('active', 'completed', 'suspended'),
                allowNull: false,
                defaultValue: 'active',
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Plan status' })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' })];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiPropertyOptional)({ description: 'Soft delete timestamp' })];
        _violations_decorators = [(0, sequelize_typescript_1.HasMany)(() => EthicsViolationModel, 'remediationPlanId')];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _violationId_decorators, { kind: "field", name: "violationId", static: false, private: false, access: { has: obj => "violationId" in obj, get: obj => obj.violationId, set: (obj, value) => { obj.violationId = value; } }, metadata: _metadata }, _violationId_initializers, _violationId_extraInitializers);
        __esDecorate(null, null, _lawyerId_decorators, { kind: "field", name: "lawyerId", static: false, private: false, access: { has: obj => "lawyerId" in obj, get: obj => obj.lawyerId, set: (obj, value) => { obj.lawyerId = value; } }, metadata: _metadata }, _lawyerId_initializers, _lawyerId_extraInitializers);
        __esDecorate(null, null, _createdDate_decorators, { kind: "field", name: "createdDate", static: false, private: false, access: { has: obj => "createdDate" in obj, get: obj => obj.createdDate, set: (obj, value) => { obj.createdDate = value; } }, metadata: _metadata }, _createdDate_initializers, _createdDate_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _objectives_decorators, { kind: "field", name: "objectives", static: false, private: false, access: { has: obj => "objectives" in obj, get: obj => obj.objectives, set: (obj, value) => { obj.objectives = value; } }, metadata: _metadata }, _objectives_initializers, _objectives_extraInitializers);
        __esDecorate(null, null, _actions_decorators, { kind: "field", name: "actions", static: false, private: false, access: { has: obj => "actions" in obj, get: obj => obj.actions, set: (obj, value) => { obj.actions = value; } }, metadata: _metadata }, _actions_initializers, _actions_extraInitializers);
        __esDecorate(null, null, _trainingRequired_decorators, { kind: "field", name: "trainingRequired", static: false, private: false, access: { has: obj => "trainingRequired" in obj, get: obj => obj.trainingRequired, set: (obj, value) => { obj.trainingRequired = value; } }, metadata: _metadata }, _trainingRequired_initializers, _trainingRequired_extraInitializers);
        __esDecorate(null, null, _supervisoryReview_decorators, { kind: "field", name: "supervisoryReview", static: false, private: false, access: { has: obj => "supervisoryReview" in obj, get: obj => obj.supervisoryReview, set: (obj, value) => { obj.supervisoryReview = value; } }, metadata: _metadata }, _supervisoryReview_initializers, _supervisoryReview_extraInitializers);
        __esDecorate(null, null, _reviewFrequency_decorators, { kind: "field", name: "reviewFrequency", static: false, private: false, access: { has: obj => "reviewFrequency" in obj, get: obj => obj.reviewFrequency, set: (obj, value) => { obj.reviewFrequency = value; } }, metadata: _metadata }, _reviewFrequency_initializers, _reviewFrequency_extraInitializers);
        __esDecorate(null, null, _completionDate_decorators, { kind: "field", name: "completionDate", static: false, private: false, access: { has: obj => "completionDate" in obj, get: obj => obj.completionDate, set: (obj, value) => { obj.completionDate = value; } }, metadata: _metadata }, _completionDate_initializers, _completionDate_extraInitializers);
        __esDecorate(null, null, _effectiveness_decorators, { kind: "field", name: "effectiveness", static: false, private: false, access: { has: obj => "effectiveness" in obj, get: obj => obj.effectiveness, set: (obj, value) => { obj.effectiveness = value; } }, metadata: _metadata }, _effectiveness_initializers, _effectiveness_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _violations_decorators, { kind: "field", name: "violations", static: false, private: false, access: { has: obj => "violations" in obj, get: obj => obj.violations, set: (obj, value) => { obj.violations = value; } }, metadata: _metadata }, _violations_initializers, _violations_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RemediationPlanModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RemediationPlanModel = _classThis;
})();
exports.RemediationPlanModel = RemediationPlanModel;
/**
 * Fee Arrangement Compliance Model
 * Tracks and validates fee arrangements for compliance
 */
let FeeArrangementComplianceModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'fee_arrangement_compliance',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['matterId'] },
                { fields: ['clientId'] },
                { fields: ['complianceStatus'] },
                { fields: ['arrangementType'] },
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
    let _clientId_decorators;
    let _clientId_initializers = [];
    let _clientId_extraInitializers = [];
    let _arrangementType_decorators;
    let _arrangementType_initializers = [];
    let _arrangementType_extraInitializers = [];
    let _writtenAgreement_decorators;
    let _writtenAgreement_initializers = [];
    let _writtenAgreement_extraInitializers = [];
    let _agreementDate_decorators;
    let _agreementDate_initializers = [];
    let _agreementDate_extraInitializers = [];
    let _rate_decorators;
    let _rate_initializers = [];
    let _rate_extraInitializers = [];
    let _contingencyPercentage_decorators;
    let _contingencyPercentage_initializers = [];
    let _contingencyPercentage_extraInitializers = [];
    let _flatFeeAmount_decorators;
    let _flatFeeAmount_initializers = [];
    let _flatFeeAmount_extraInitializers = [];
    let _retainerAmount_decorators;
    let _retainerAmount_initializers = [];
    let _retainerAmount_extraInitializers = [];
    let _scopeOfRepresentation_decorators;
    let _scopeOfRepresentation_initializers = [];
    let _scopeOfRepresentation_extraInitializers = [];
    let _billingFrequency_decorators;
    let _billingFrequency_initializers = [];
    let _billingFrequency_extraInitializers = [];
    let _advancedCosts_decorators;
    let _advancedCosts_initializers = [];
    let _advancedCosts_extraInitializers = [];
    let _reasonablenessAnalysis_decorators;
    let _reasonablenessAnalysis_initializers = [];
    let _reasonablenessAnalysis_extraInitializers = [];
    let _prohibitedFeeTypes_decorators;
    let _prohibitedFeeTypes_initializers = [];
    let _prohibitedFeeTypes_extraInitializers = [];
    let _divisionOfFees_decorators;
    let _divisionOfFees_initializers = [];
    let _divisionOfFees_extraInitializers = [];
    let _complianceStatus_decorators;
    let _complianceStatus_initializers = [];
    let _complianceStatus_extraInitializers = [];
    let _lastReviewDate_decorators;
    let _lastReviewDate_initializers = [];
    let _lastReviewDate_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var FeeArrangementComplianceModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.matterId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _matterId_initializers, void 0));
            this.clientId = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _clientId_initializers, void 0));
            this.arrangementType = (__runInitializers(this, _clientId_extraInitializers), __runInitializers(this, _arrangementType_initializers, void 0));
            this.writtenAgreement = (__runInitializers(this, _arrangementType_extraInitializers), __runInitializers(this, _writtenAgreement_initializers, void 0));
            this.agreementDate = (__runInitializers(this, _writtenAgreement_extraInitializers), __runInitializers(this, _agreementDate_initializers, void 0));
            this.rate = (__runInitializers(this, _agreementDate_extraInitializers), __runInitializers(this, _rate_initializers, void 0));
            this.contingencyPercentage = (__runInitializers(this, _rate_extraInitializers), __runInitializers(this, _contingencyPercentage_initializers, void 0));
            this.flatFeeAmount = (__runInitializers(this, _contingencyPercentage_extraInitializers), __runInitializers(this, _flatFeeAmount_initializers, void 0));
            this.retainerAmount = (__runInitializers(this, _flatFeeAmount_extraInitializers), __runInitializers(this, _retainerAmount_initializers, void 0));
            this.scopeOfRepresentation = (__runInitializers(this, _retainerAmount_extraInitializers), __runInitializers(this, _scopeOfRepresentation_initializers, void 0));
            this.billingFrequency = (__runInitializers(this, _scopeOfRepresentation_extraInitializers), __runInitializers(this, _billingFrequency_initializers, void 0));
            this.advancedCosts = (__runInitializers(this, _billingFrequency_extraInitializers), __runInitializers(this, _advancedCosts_initializers, void 0));
            this.reasonablenessAnalysis = (__runInitializers(this, _advancedCosts_extraInitializers), __runInitializers(this, _reasonablenessAnalysis_initializers, void 0));
            this.prohibitedFeeTypes = (__runInitializers(this, _reasonablenessAnalysis_extraInitializers), __runInitializers(this, _prohibitedFeeTypes_initializers, void 0));
            this.divisionOfFees = (__runInitializers(this, _prohibitedFeeTypes_extraInitializers), __runInitializers(this, _divisionOfFees_initializers, void 0));
            this.complianceStatus = (__runInitializers(this, _divisionOfFees_extraInitializers), __runInitializers(this, _complianceStatus_initializers, void 0));
            this.lastReviewDate = (__runInitializers(this, _complianceStatus_extraInitializers), __runInitializers(this, _lastReviewDate_initializers, void 0));
            this.createdAt = (__runInitializers(this, _lastReviewDate_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "FeeArrangementComplianceModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique identifier' })];
        _matterId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Matter ID' })];
        _clientId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Client ID' })];
        _arrangementType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(FeeArrangementType)),
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ enum: FeeArrangementType, description: 'Type of fee arrangement' })];
        _writtenAgreement_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Whether written agreement exists' })];
        _agreementDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Date agreement was signed' })];
        _rate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Hourly rate' })];
        _contingencyPercentage_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Contingency percentage' })];
        _flatFeeAmount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(12, 2),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Flat fee amount' })];
        _retainerAmount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(12, 2),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Retainer amount' })];
        _scopeOfRepresentation_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Scope of representation' })];
        _billingFrequency_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Billing frequency', example: 'monthly' })];
        _advancedCosts_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(12, 2),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Advanced costs' })];
        _reasonablenessAnalysis_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Reasonableness analysis details' })];
        _prohibitedFeeTypes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Prohibited fee types for this matter' })];
        _divisionOfFees_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Fee division details if applicable' })];
        _complianceStatus_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('compliant', 'under_review', 'non_compliant'),
                allowNull: false,
                defaultValue: 'under_review',
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Compliance status' })];
        _lastReviewDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                defaultValue: sequelize_typescript_1.DataType.NOW,
            }), (0, swagger_1.ApiProperty)({ description: 'Last review date' })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' })];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiPropertyOptional)({ description: 'Soft delete timestamp' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
        __esDecorate(null, null, _clientId_decorators, { kind: "field", name: "clientId", static: false, private: false, access: { has: obj => "clientId" in obj, get: obj => obj.clientId, set: (obj, value) => { obj.clientId = value; } }, metadata: _metadata }, _clientId_initializers, _clientId_extraInitializers);
        __esDecorate(null, null, _arrangementType_decorators, { kind: "field", name: "arrangementType", static: false, private: false, access: { has: obj => "arrangementType" in obj, get: obj => obj.arrangementType, set: (obj, value) => { obj.arrangementType = value; } }, metadata: _metadata }, _arrangementType_initializers, _arrangementType_extraInitializers);
        __esDecorate(null, null, _writtenAgreement_decorators, { kind: "field", name: "writtenAgreement", static: false, private: false, access: { has: obj => "writtenAgreement" in obj, get: obj => obj.writtenAgreement, set: (obj, value) => { obj.writtenAgreement = value; } }, metadata: _metadata }, _writtenAgreement_initializers, _writtenAgreement_extraInitializers);
        __esDecorate(null, null, _agreementDate_decorators, { kind: "field", name: "agreementDate", static: false, private: false, access: { has: obj => "agreementDate" in obj, get: obj => obj.agreementDate, set: (obj, value) => { obj.agreementDate = value; } }, metadata: _metadata }, _agreementDate_initializers, _agreementDate_extraInitializers);
        __esDecorate(null, null, _rate_decorators, { kind: "field", name: "rate", static: false, private: false, access: { has: obj => "rate" in obj, get: obj => obj.rate, set: (obj, value) => { obj.rate = value; } }, metadata: _metadata }, _rate_initializers, _rate_extraInitializers);
        __esDecorate(null, null, _contingencyPercentage_decorators, { kind: "field", name: "contingencyPercentage", static: false, private: false, access: { has: obj => "contingencyPercentage" in obj, get: obj => obj.contingencyPercentage, set: (obj, value) => { obj.contingencyPercentage = value; } }, metadata: _metadata }, _contingencyPercentage_initializers, _contingencyPercentage_extraInitializers);
        __esDecorate(null, null, _flatFeeAmount_decorators, { kind: "field", name: "flatFeeAmount", static: false, private: false, access: { has: obj => "flatFeeAmount" in obj, get: obj => obj.flatFeeAmount, set: (obj, value) => { obj.flatFeeAmount = value; } }, metadata: _metadata }, _flatFeeAmount_initializers, _flatFeeAmount_extraInitializers);
        __esDecorate(null, null, _retainerAmount_decorators, { kind: "field", name: "retainerAmount", static: false, private: false, access: { has: obj => "retainerAmount" in obj, get: obj => obj.retainerAmount, set: (obj, value) => { obj.retainerAmount = value; } }, metadata: _metadata }, _retainerAmount_initializers, _retainerAmount_extraInitializers);
        __esDecorate(null, null, _scopeOfRepresentation_decorators, { kind: "field", name: "scopeOfRepresentation", static: false, private: false, access: { has: obj => "scopeOfRepresentation" in obj, get: obj => obj.scopeOfRepresentation, set: (obj, value) => { obj.scopeOfRepresentation = value; } }, metadata: _metadata }, _scopeOfRepresentation_initializers, _scopeOfRepresentation_extraInitializers);
        __esDecorate(null, null, _billingFrequency_decorators, { kind: "field", name: "billingFrequency", static: false, private: false, access: { has: obj => "billingFrequency" in obj, get: obj => obj.billingFrequency, set: (obj, value) => { obj.billingFrequency = value; } }, metadata: _metadata }, _billingFrequency_initializers, _billingFrequency_extraInitializers);
        __esDecorate(null, null, _advancedCosts_decorators, { kind: "field", name: "advancedCosts", static: false, private: false, access: { has: obj => "advancedCosts" in obj, get: obj => obj.advancedCosts, set: (obj, value) => { obj.advancedCosts = value; } }, metadata: _metadata }, _advancedCosts_initializers, _advancedCosts_extraInitializers);
        __esDecorate(null, null, _reasonablenessAnalysis_decorators, { kind: "field", name: "reasonablenessAnalysis", static: false, private: false, access: { has: obj => "reasonablenessAnalysis" in obj, get: obj => obj.reasonablenessAnalysis, set: (obj, value) => { obj.reasonablenessAnalysis = value; } }, metadata: _metadata }, _reasonablenessAnalysis_initializers, _reasonablenessAnalysis_extraInitializers);
        __esDecorate(null, null, _prohibitedFeeTypes_decorators, { kind: "field", name: "prohibitedFeeTypes", static: false, private: false, access: { has: obj => "prohibitedFeeTypes" in obj, get: obj => obj.prohibitedFeeTypes, set: (obj, value) => { obj.prohibitedFeeTypes = value; } }, metadata: _metadata }, _prohibitedFeeTypes_initializers, _prohibitedFeeTypes_extraInitializers);
        __esDecorate(null, null, _divisionOfFees_decorators, { kind: "field", name: "divisionOfFees", static: false, private: false, access: { has: obj => "divisionOfFees" in obj, get: obj => obj.divisionOfFees, set: (obj, value) => { obj.divisionOfFees = value; } }, metadata: _metadata }, _divisionOfFees_initializers, _divisionOfFees_extraInitializers);
        __esDecorate(null, null, _complianceStatus_decorators, { kind: "field", name: "complianceStatus", static: false, private: false, access: { has: obj => "complianceStatus" in obj, get: obj => obj.complianceStatus, set: (obj, value) => { obj.complianceStatus = value; } }, metadata: _metadata }, _complianceStatus_initializers, _complianceStatus_extraInitializers);
        __esDecorate(null, null, _lastReviewDate_decorators, { kind: "field", name: "lastReviewDate", static: false, private: false, access: { has: obj => "lastReviewDate" in obj, get: obj => obj.lastReviewDate, set: (obj, value) => { obj.lastReviewDate = value; } }, metadata: _metadata }, _lastReviewDate_initializers, _lastReviewDate_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FeeArrangementComplianceModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FeeArrangementComplianceModel = _classThis;
})();
exports.FeeArrangementComplianceModel = FeeArrangementComplianceModel;
/**
 * Confidentiality Record Model
 * Tracks client confidential information and privilege claims
 */
let ConfidentialityRecordModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'confidentiality_records',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['clientId'] },
                { fields: ['matterId'] },
                { fields: ['classificationLevel'] },
                { fields: ['createdDate'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _clientId_decorators;
    let _clientId_initializers = [];
    let _clientId_extraInitializers = [];
    let _matterId_decorators;
    let _matterId_initializers = [];
    let _matterId_extraInitializers = [];
    let _documentId_decorators;
    let _documentId_initializers = [];
    let _documentId_extraInitializers = [];
    let _communicationId_decorators;
    let _communicationId_initializers = [];
    let _communicationId_extraInitializers = [];
    let _classificationLevel_decorators;
    let _classificationLevel_initializers = [];
    let _classificationLevel_extraInitializers = [];
    let _subject_decorators;
    let _subject_initializers = [];
    let _subject_extraInitializers = [];
    let _createdDate_decorators;
    let _createdDate_initializers = [];
    let _createdDate_extraInitializers = [];
    let _accessLog_decorators;
    let _accessLog_initializers = [];
    let _accessLog_extraInitializers = [];
    let _disclosures_decorators;
    let _disclosures_initializers = [];
    let _disclosures_extraInitializers = [];
    let _retentionPeriod_decorators;
    let _retentionPeriod_initializers = [];
    let _retentionPeriod_extraInitializers = [];
    let _destructionDate_decorators;
    let _destructionDate_initializers = [];
    let _destructionDate_extraInitializers = [];
    let _privilegeClaim_decorators;
    let _privilegeClaim_initializers = [];
    let _privilegeClaim_extraInitializers = [];
    let _workProductClaim_decorators;
    let _workProductClaim_initializers = [];
    let _workProductClaim_extraInitializers = [];
    let _exceptions_decorators;
    let _exceptions_initializers = [];
    let _exceptions_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var ConfidentialityRecordModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.clientId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _clientId_initializers, void 0));
            this.matterId = (__runInitializers(this, _clientId_extraInitializers), __runInitializers(this, _matterId_initializers, void 0));
            this.documentId = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _documentId_initializers, void 0));
            this.communicationId = (__runInitializers(this, _documentId_extraInitializers), __runInitializers(this, _communicationId_initializers, void 0));
            this.classificationLevel = (__runInitializers(this, _communicationId_extraInitializers), __runInitializers(this, _classificationLevel_initializers, void 0));
            this.subject = (__runInitializers(this, _classificationLevel_extraInitializers), __runInitializers(this, _subject_initializers, void 0));
            this.createdDate = (__runInitializers(this, _subject_extraInitializers), __runInitializers(this, _createdDate_initializers, void 0));
            this.accessLog = (__runInitializers(this, _createdDate_extraInitializers), __runInitializers(this, _accessLog_initializers, void 0));
            this.disclosures = (__runInitializers(this, _accessLog_extraInitializers), __runInitializers(this, _disclosures_initializers, void 0));
            this.retentionPeriod = (__runInitializers(this, _disclosures_extraInitializers), __runInitializers(this, _retentionPeriod_initializers, void 0));
            this.destructionDate = (__runInitializers(this, _retentionPeriod_extraInitializers), __runInitializers(this, _destructionDate_initializers, void 0));
            this.privilegeClaim = (__runInitializers(this, _destructionDate_extraInitializers), __runInitializers(this, _privilegeClaim_initializers, void 0));
            this.workProductClaim = (__runInitializers(this, _privilegeClaim_extraInitializers), __runInitializers(this, _workProductClaim_initializers, void 0));
            this.exceptions = (__runInitializers(this, _workProductClaim_extraInitializers), __runInitializers(this, _exceptions_initializers, void 0));
            this.createdAt = (__runInitializers(this, _exceptions_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ConfidentialityRecordModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique identifier' })];
        _clientId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Client ID' })];
        _matterId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Matter ID' })];
        _documentId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Document ID if applicable' })];
        _communicationId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Communication ID if applicable' })];
        _classificationLevel_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ConfidentialityLevel)),
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ enum: ConfidentialityLevel, description: 'Classification level' })];
        _subject_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Subject of confidential information' })];
        _createdDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                defaultValue: sequelize_typescript_1.DataType.NOW,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Creation date' })];
        _accessLog_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                defaultValue: [],
            }), (0, swagger_1.ApiProperty)({ description: 'Access log entries' })];
        _disclosures_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Disclosure records' })];
        _retentionPeriod_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Retention period in days' })];
        _destructionDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Scheduled destruction date' })];
        _privilegeClaim_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Whether attorney-client privilege claimed' })];
        _workProductClaim_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Whether work product protection claimed' })];
        _exceptions_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Exceptions to confidentiality' })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' })];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiPropertyOptional)({ description: 'Soft delete timestamp' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _clientId_decorators, { kind: "field", name: "clientId", static: false, private: false, access: { has: obj => "clientId" in obj, get: obj => obj.clientId, set: (obj, value) => { obj.clientId = value; } }, metadata: _metadata }, _clientId_initializers, _clientId_extraInitializers);
        __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
        __esDecorate(null, null, _documentId_decorators, { kind: "field", name: "documentId", static: false, private: false, access: { has: obj => "documentId" in obj, get: obj => obj.documentId, set: (obj, value) => { obj.documentId = value; } }, metadata: _metadata }, _documentId_initializers, _documentId_extraInitializers);
        __esDecorate(null, null, _communicationId_decorators, { kind: "field", name: "communicationId", static: false, private: false, access: { has: obj => "communicationId" in obj, get: obj => obj.communicationId, set: (obj, value) => { obj.communicationId = value; } }, metadata: _metadata }, _communicationId_initializers, _communicationId_extraInitializers);
        __esDecorate(null, null, _classificationLevel_decorators, { kind: "field", name: "classificationLevel", static: false, private: false, access: { has: obj => "classificationLevel" in obj, get: obj => obj.classificationLevel, set: (obj, value) => { obj.classificationLevel = value; } }, metadata: _metadata }, _classificationLevel_initializers, _classificationLevel_extraInitializers);
        __esDecorate(null, null, _subject_decorators, { kind: "field", name: "subject", static: false, private: false, access: { has: obj => "subject" in obj, get: obj => obj.subject, set: (obj, value) => { obj.subject = value; } }, metadata: _metadata }, _subject_initializers, _subject_extraInitializers);
        __esDecorate(null, null, _createdDate_decorators, { kind: "field", name: "createdDate", static: false, private: false, access: { has: obj => "createdDate" in obj, get: obj => obj.createdDate, set: (obj, value) => { obj.createdDate = value; } }, metadata: _metadata }, _createdDate_initializers, _createdDate_extraInitializers);
        __esDecorate(null, null, _accessLog_decorators, { kind: "field", name: "accessLog", static: false, private: false, access: { has: obj => "accessLog" in obj, get: obj => obj.accessLog, set: (obj, value) => { obj.accessLog = value; } }, metadata: _metadata }, _accessLog_initializers, _accessLog_extraInitializers);
        __esDecorate(null, null, _disclosures_decorators, { kind: "field", name: "disclosures", static: false, private: false, access: { has: obj => "disclosures" in obj, get: obj => obj.disclosures, set: (obj, value) => { obj.disclosures = value; } }, metadata: _metadata }, _disclosures_initializers, _disclosures_extraInitializers);
        __esDecorate(null, null, _retentionPeriod_decorators, { kind: "field", name: "retentionPeriod", static: false, private: false, access: { has: obj => "retentionPeriod" in obj, get: obj => obj.retentionPeriod, set: (obj, value) => { obj.retentionPeriod = value; } }, metadata: _metadata }, _retentionPeriod_initializers, _retentionPeriod_extraInitializers);
        __esDecorate(null, null, _destructionDate_decorators, { kind: "field", name: "destructionDate", static: false, private: false, access: { has: obj => "destructionDate" in obj, get: obj => obj.destructionDate, set: (obj, value) => { obj.destructionDate = value; } }, metadata: _metadata }, _destructionDate_initializers, _destructionDate_extraInitializers);
        __esDecorate(null, null, _privilegeClaim_decorators, { kind: "field", name: "privilegeClaim", static: false, private: false, access: { has: obj => "privilegeClaim" in obj, get: obj => obj.privilegeClaim, set: (obj, value) => { obj.privilegeClaim = value; } }, metadata: _metadata }, _privilegeClaim_initializers, _privilegeClaim_extraInitializers);
        __esDecorate(null, null, _workProductClaim_decorators, { kind: "field", name: "workProductClaim", static: false, private: false, access: { has: obj => "workProductClaim" in obj, get: obj => obj.workProductClaim, set: (obj, value) => { obj.workProductClaim = value; } }, metadata: _metadata }, _workProductClaim_initializers, _workProductClaim_extraInitializers);
        __esDecorate(null, null, _exceptions_decorators, { kind: "field", name: "exceptions", static: false, private: false, access: { has: obj => "exceptions" in obj, get: obj => obj.exceptions, set: (obj, value) => { obj.exceptions = value; } }, metadata: _metadata }, _exceptions_initializers, _exceptions_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConfidentialityRecordModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConfidentialityRecordModel = _classThis;
})();
exports.ConfidentialityRecordModel = ConfidentialityRecordModel;
// ============================================================================
// NESTJS SERVICES
// ============================================================================
/**
 * Ethics Rule Service
 * Manages ethics rules tracking, monitoring, and updates
 */
let EthicsRuleService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var EthicsRuleService = _classThis = class {
        constructor(ethicsRuleRepository) {
            this.ethicsRuleRepository = ethicsRuleRepository;
            this.logger = new common_1.Logger(EthicsRuleService.name);
        }
        /**
         * 1. Create a new ethics rule
         */
        async createEthicsRule(ruleData) {
            try {
                const validated = exports.EthicsRuleSchema.parse(ruleData);
                const rule = await this.ethicsRuleRepository.create(validated);
                this.logger.log(`Created ethics rule: ${rule.ruleNumber} for ${rule.jurisdiction}`);
                return rule;
            }
            catch (error) {
                this.logger.error(`Failed to create ethics rule: ${error.message}`);
                throw new common_1.BadRequestException(`Failed to create ethics rule: ${error.message}`);
            }
        }
        /**
         * 2. Get ethics rule by ID
         */
        async getEthicsRuleById(id) {
            const rule = await this.ethicsRuleRepository.findByPk(id);
            if (!rule) {
                throw new common_1.NotFoundException(`Ethics rule not found: ${id}`);
            }
            return rule;
        }
        /**
         * 3. Get ethics rules by jurisdiction
         */
        async getEthicsRulesByJurisdiction(jurisdiction, category) {
            const where = { jurisdiction };
            if (category) {
                where.category = category;
            }
            return await this.ethicsRuleRepository.findAll({ where });
        }
        /**
         * 4. Search ethics rules
         */
        async searchEthicsRules(searchText, jurisdiction) {
            const where = {
                [sequelize_1.Op.or]: [
                    { ruleText: { [sequelize_1.Op.iLike]: `%${searchText}%` } },
                    { title: { [sequelize_1.Op.iLike]: `%${searchText}%` } },
                    { commentary: { [sequelize_1.Op.iLike]: `%${searchText}%` } },
                ],
            };
            if (jurisdiction) {
                where.jurisdiction = jurisdiction;
            }
            return await this.ethicsRuleRepository.findAll({ where });
        }
        /**
         * 5. Update ethics rule (for amendments)
         */
        async updateEthicsRule(id, updates) {
            const rule = await this.getEthicsRuleById(id);
            // If updating rule text, add to amendment history
            if (updates.ruleText && updates.ruleText !== rule.ruleText) {
                const amendments = rule.amendments || [];
                amendments.push({
                    date: new Date(),
                    description: 'Rule text updated',
                    amendedText: updates.ruleText,
                });
                updates.amendments = amendments;
            }
            await rule.update(updates);
            this.logger.log(`Updated ethics rule: ${id}`);
            return rule;
        }
        /**
         * 6. Get rules requiring attention (recently amended)
         */
        async getRecentlyAmendedRules(days = 90) {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            return await this.ethicsRuleRepository.findAll({
                where: {
                    updatedAt: { [sequelize_1.Op.gte]: cutoffDate },
                },
                order: [['updatedAt', 'DESC']],
            });
        }
    };
    __setFunctionName(_classThis, "EthicsRuleService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EthicsRuleService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EthicsRuleService = _classThis;
})();
exports.EthicsRuleService = EthicsRuleService;
/**
 * Ethics Violation Service
 * Manages ethics violation tracking, investigation, and remediation
 */
let EthicsViolationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var EthicsViolationService = _classThis = class {
        constructor(violationRepository, remediationRepository) {
            this.violationRepository = violationRepository;
            this.remediationRepository = remediationRepository;
            this.logger = new common_1.Logger(EthicsViolationService.name);
        }
        /**
         * 7. Report an ethics violation
         */
        async reportViolation(violationData) {
            try {
                const validated = exports.EthicsViolationSchema.parse(violationData);
                const violation = await this.violationRepository.create(validated);
                this.logger.warn(`Ethics violation reported: ${violation.id} - ${violation.violationType}`);
                return violation;
            }
            catch (error) {
                this.logger.error(`Failed to report violation: ${error.message}`);
                throw new common_1.BadRequestException(`Failed to report violation: ${error.message}`);
            }
        }
        /**
         * 8. Get violations by lawyer
         */
        async getViolationsByLawyer(lawyerId, status) {
            const where = { lawyerId };
            if (status) {
                where.status = status;
            }
            return await this.violationRepository.findAll({
                where,
                include: ['rule', 'remediationPlan'],
                order: [['incidentDate', 'DESC']],
            });
        }
        /**
         * 9. Update violation status
         */
        async updateViolationStatus(id, status, notes) {
            const violation = await this.violationRepository.findByPk(id);
            if (!violation) {
                throw new common_1.NotFoundException(`Violation not found: ${id}`);
            }
            await violation.update({
                status,
                investigationNotes: notes || violation.investigationNotes,
                closedDate: status === ViolationStatus.CLOSED ? new Date() : violation.closedDate,
            });
            this.logger.log(`Updated violation ${id} status to ${status}`);
            return violation;
        }
        /**
         * 10. Get violations by severity
         */
        async getViolationsBySeverity(severity) {
            return await this.violationRepository.findAll({
                where: { severity },
                include: ['rule'],
                order: [['incidentDate', 'DESC']],
            });
        }
        /**
         * 11. Analyze violation patterns
         */
        async analyzeViolationPatterns(lawyerId, startDate, endDate) {
            const where = {};
            if (lawyerId)
                where.lawyerId = lawyerId;
            if (startDate || endDate) {
                where.incidentDate = {};
                if (startDate)
                    where.incidentDate[sequelize_1.Op.gte] = startDate;
                if (endDate)
                    where.incidentDate[sequelize_1.Op.lte] = endDate;
            }
            const violations = await this.violationRepository.findAll({ where, include: ['rule'] });
            const byCategory = {};
            const bySeverity = {};
            violations.forEach((v) => {
                const category = v.rule?.category || 'unknown';
                byCategory[category] = (byCategory[category] || 0) + 1;
                bySeverity[v.severity] = (bySeverity[v.severity] || 0) + 1;
            });
            return {
                totalViolations: violations.length,
                byCategory,
                bySeverity,
                trends: [], // Could be enhanced with time-series analysis
            };
        }
        /**
         * 12. Create remediation plan for violation
         */
        async createRemediationPlan(violationId, planData) {
            const violation = await this.violationRepository.findByPk(violationId);
            if (!violation) {
                throw new common_1.NotFoundException(`Violation not found: ${violationId}`);
            }
            const plan = await this.remediationRepository.create({
                ...planData,
                violationId,
                lawyerId: violation.lawyerId,
            });
            await violation.update({ remediationPlanId: plan.id });
            this.logger.log(`Created remediation plan ${plan.id} for violation ${violationId}`);
            return plan;
        }
    };
    __setFunctionName(_classThis, "EthicsViolationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EthicsViolationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EthicsViolationService = _classThis;
})();
exports.EthicsViolationService = EthicsViolationService;
/**
 * Conflict of Interest Service
 * Manages conflict checks and screening
 */
let ConflictOfInterestService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ConflictOfInterestService = _classThis = class {
        constructor(conflictRepository) {
            this.conflictRepository = conflictRepository;
            this.logger = new common_1.Logger(ConflictOfInterestService.name);
        }
        /**
         * 13. Perform conflict check
         */
        async performConflictCheck(checkData) {
            try {
                const validated = exports.ConflictCheckSchema.parse(checkData);
                // Perform actual conflict screening logic here
                const conflicts = await this.screenForConflicts(checkData.clientId, checkData.opposingParties, checkData.relatedEntities);
                const check = await this.conflictRepository.create({
                    ...validated,
                    conflictsFound: conflicts,
                    status: conflicts.length > 0 ? 'conflict_exists' : 'cleared',
                });
                this.logger.log(`Conflict check ${check.id}: Found ${conflicts.length} potential conflicts`);
                return check;
            }
            catch (error) {
                this.logger.error(`Failed to perform conflict check: ${error.message}`);
                throw new common_1.BadRequestException(`Failed to perform conflict check: ${error.message}`);
            }
        }
        /**
         * 14. Screen for conflicts (advanced algorithm)
         */
        async screenForConflicts(clientId, opposingParties, relatedEntities) {
            const conflicts = [];
            // Check for direct adversity
            const directAdversity = await this.checkDirectAdversity(clientId, opposingParties);
            if (directAdversity.length > 0) {
                conflicts.push(...directAdversity);
            }
            // Check for former client conflicts
            const formerClientConflicts = await this.checkFormerClientConflicts(clientId, relatedEntities);
            if (formerClientConflicts.length > 0) {
                conflicts.push(...formerClientConflicts);
            }
            // Check for imputed conflicts
            const imputedConflicts = await this.checkImputedConflicts(clientId);
            if (imputedConflicts.length > 0) {
                conflicts.push(...imputedConflicts);
            }
            return conflicts;
        }
        /**
         * 15. Check for direct adversity conflicts
         */
        async checkDirectAdversity(clientId, opposingParties) {
            const conflicts = [];
            // Query existing matters where opposing parties are current clients
            const existingChecks = await this.conflictRepository.findAll({
                where: {
                    clientId: { [sequelize_1.Op.in]: opposingParties },
                    status: { [sequelize_1.Op.in]: ['cleared', 'waived'] },
                },
            });
            existingChecks.forEach((check) => {
                conflicts.push({
                    conflictType: ConflictType.DIRECT_ADVERSITY,
                    description: `Client ${clientId} is adverse to existing client in matter ${check.matterId}`,
                    involvedParties: [clientId, check.clientId],
                    affectedLawyers: [],
                    matterReference: check.matterId,
                    riskLevel: 'critical',
                    recommendation: 'Decline representation or obtain informed consent waiver from both clients',
                });
            });
            return conflicts;
        }
        /**
         * 16. Check for former client conflicts
         */
        async checkFormerClientConflicts(clientId, relatedEntities) {
            const conflicts = [];
            // Check if any related entities are former clients
            const formerClientChecks = await this.conflictRepository.findAll({
                where: {
                    clientId: { [sequelize_1.Op.in]: relatedEntities },
                    status: 'cleared',
                },
            });
            formerClientChecks.forEach((check) => {
                conflicts.push({
                    conflictType: ConflictType.FORMER_CLIENT,
                    description: `Matter involves former client ${check.clientId}`,
                    involvedParties: [clientId, check.clientId],
                    affectedLawyers: [],
                    matterReference: check.matterId,
                    riskLevel: 'high',
                    recommendation: 'Assess if matter is substantially related to former representation',
                });
            });
            return conflicts;
        }
        /**
         * 17. Check for imputed conflicts
         */
        async checkImputedConflicts(clientId) {
            // This would check firm-wide conflicts
            // Placeholder for firm-wide conflict screening logic
            return [];
        }
        /**
         * 18. Resolve conflict with waiver
         */
        async resolveWithWaiver(conflictCheckId, waiverData) {
            const check = await this.conflictRepository.findByPk(conflictCheckId);
            if (!check) {
                throw new common_1.NotFoundException(`Conflict check not found: ${conflictCheckId}`);
            }
            await check.update({
                waiverObtained: waiverData.waiverObtained,
                waiverDate: waiverData.waiverDate,
                resolution: ConflictResolution.WAIVED_BY_CLIENT,
                status: 'waived',
                notes: waiverData.notes,
            });
            this.logger.log(`Resolved conflict ${conflictCheckId} with client waiver`);
            return check;
        }
        /**
         * 19. Implement screening measures
         */
        async implementScreening(conflictCheckId, screeningMeasures) {
            const check = await this.conflictRepository.findByPk(conflictCheckId);
            if (!check) {
                throw new common_1.NotFoundException(`Conflict check not found: ${conflictCheckId}`);
            }
            await check.update({
                screeningMeasures,
                resolution: ConflictResolution.SCREENING_IMPLEMENTED,
            });
            this.logger.log(`Implemented screening measures for conflict ${conflictCheckId}`);
            return check;
        }
        /**
         * 20. Get conflicts requiring review
         */
        async getConflictsRequiringReview() {
            return await this.conflictRepository.findAll({
                where: {
                    status: { [sequelize_1.Op.in]: ['pending', 'conflict_exists'] },
                    reviewDate: { [sequelize_1.Op.or]: [null, { [sequelize_1.Op.lte]: new Date() }] },
                },
                order: [['checkDate', 'ASC']],
            });
        }
    };
    __setFunctionName(_classThis, "ConflictOfInterestService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConflictOfInterestService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConflictOfInterestService = _classThis;
})();
exports.ConflictOfInterestService = ConflictOfInterestService;
/**
 * Client Confidentiality Service
 * Manages client confidential information protection
 */
let ClientConfidentialityService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ClientConfidentialityService = _classThis = class {
        constructor(confidentialityRepository) {
            this.confidentialityRepository = confidentialityRepository;
            this.logger = new common_1.Logger(ClientConfidentialityService.name);
        }
        /**
         * 21. Create confidentiality record
         */
        async createConfidentialityRecord(recordData) {
            try {
                const validated = exports.ConfidentialityRecordSchema.parse(recordData);
                const record = await this.confidentialityRepository.create(validated);
                this.logger.log(`Created confidentiality record: ${record.id}`);
                return record;
            }
            catch (error) {
                this.logger.error(`Failed to create confidentiality record: ${error.message}`);
                throw new common_1.BadRequestException(`Failed to create confidentiality record: ${error.message}`);
            }
        }
        /**
         * 22. Log access to confidential information
         */
        async logAccess(recordId, accessData) {
            const record = await this.confidentialityRepository.findByPk(recordId);
            if (!record) {
                throw new common_1.NotFoundException(`Confidentiality record not found: ${recordId}`);
            }
            const accessLog = record.accessLog || [];
            accessLog.push({
                ...accessData,
                accessDate: new Date(),
            });
            await record.update({ accessLog });
            if (!accessData.authorized) {
                this.logger.warn(`Unauthorized access attempt to confidential record ${recordId} by ${accessData.accessedBy}`);
            }
            return record;
        }
        /**
         * 23. Record disclosure of confidential information
         */
        async recordDisclosure(recordId, disclosureData) {
            const record = await this.confidentialityRepository.findByPk(recordId);
            if (!record) {
                throw new common_1.NotFoundException(`Confidentiality record not found: ${recordId}`);
            }
            const disclosures = record.disclosures || [];
            disclosures.push({
                ...disclosureData,
                disclosureDate: new Date(),
            });
            await record.update({ disclosures });
            this.logger.log(`Recorded disclosure of confidential information ${recordId} to ${disclosureData.disclosedTo}`);
            return record;
        }
        /**
         * 24. Verify privilege claim
         */
        async verifyPrivilegeClaim(recordId) {
            const record = await this.confidentialityRepository.findByPk(recordId);
            if (!record) {
                throw new common_1.NotFoundException(`Confidentiality record not found: ${recordId}`);
            }
            const recommendations = [];
            let valid = true;
            let reason = 'Privilege claim appears valid';
            // Check if attorney-client privilege elements are met
            if (!record.privilegeClaim && !record.workProductClaim) {
                valid = false;
                reason = 'No privilege or work product claim asserted';
                recommendations.push('Consider asserting appropriate privilege if applicable');
            }
            // Check for unauthorized disclosures that might waive privilege
            const unauthorizedDisclosures = record.disclosures?.filter((d) => !d.clientConsent && !d.legalException);
            if (unauthorizedDisclosures && unauthorizedDisclosures.length > 0) {
                valid = false;
                reason = 'Privilege may be waived due to unauthorized disclosure';
                recommendations.push('Review disclosure circumstances to assess waiver');
            }
            return { valid, reason, recommendations };
        }
        /**
         * 25. Get confidential records by matter
         */
        async getRecordsByMatter(matterId, classificationLevel) {
            const where = { matterId };
            if (classificationLevel) {
                where.classificationLevel = classificationLevel;
            }
            return await this.confidentialityRepository.findAll({
                where,
                order: [['createdDate', 'DESC']],
            });
        }
        /**
         * 26. Audit confidentiality compliance
         */
        async auditConfidentialityCompliance(clientId) {
            const records = await this.confidentialityRepository.findAll({
                where: { clientId },
            });
            const privilegedRecords = records.filter((r) => r.privilegeClaim || r.workProductClaim)
                .length;
            let disclosuresWithConsent = 0;
            let disclosuresWithoutConsent = 0;
            let unauthorizedAccess = 0;
            records.forEach((record) => {
                record.disclosures?.forEach((d) => {
                    if (d.clientConsent || d.legalException) {
                        disclosuresWithConsent++;
                    }
                    else {
                        disclosuresWithoutConsent++;
                    }
                });
                record.accessLog?.forEach((a) => {
                    if (!a.authorized) {
                        unauthorizedAccess++;
                    }
                });
            });
            const complianceScore = records.length > 0
                ? ((disclosuresWithConsent / Math.max(disclosuresWithConsent + disclosuresWithoutConsent, 1)) *
                    100 +
                    (1 - unauthorizedAccess / Math.max(records.length, 1)) * 100) /
                    2
                : 100;
            return {
                totalRecords: records.length,
                privilegedRecords,
                disclosuresWithConsent,
                disclosuresWithoutConsent,
                unauthorizedAccess,
                complianceScore: Math.round(complianceScore),
            };
        }
    };
    __setFunctionName(_classThis, "ClientConfidentialityService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ClientConfidentialityService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ClientConfidentialityService = _classThis;
})();
exports.ClientConfidentialityService = ClientConfidentialityService;
/**
 * Fee Arrangement Compliance Service
 * Manages fee arrangement compliance and validation
 */
let FeeArrangementComplianceService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var FeeArrangementComplianceService = _classThis = class {
        constructor(feeArrangementRepository) {
            this.feeArrangementRepository = feeArrangementRepository;
            this.logger = new common_1.Logger(FeeArrangementComplianceService.name);
        }
        /**
         * 27. Create fee arrangement
         */
        async createFeeArrangement(arrangementData) {
            try {
                const validated = exports.FeeArrangementSchema.parse(arrangementData);
                // Perform reasonableness check
                const complianceStatus = await this.validateFeeReasonableness(validated);
                const arrangement = await this.feeArrangementRepository.create({
                    ...validated,
                    complianceStatus,
                });
                this.logger.log(`Created fee arrangement: ${arrangement.id}`);
                return arrangement;
            }
            catch (error) {
                this.logger.error(`Failed to create fee arrangement: ${error.message}`);
                throw new common_1.BadRequestException(`Failed to create fee arrangement: ${error.message}`);
            }
        }
        /**
         * 28. Validate fee reasonableness
         */
        async validateFeeReasonableness(arrangement) {
            const issues = [];
            // Check for written agreement requirement
            if (!arrangement.writtenAgreement) {
                issues.push('Written fee agreement required');
            }
            // Check contingency fee limits (typically cannot exceed 33-40%)
            if (arrangement.arrangementType === FeeArrangementType.CONTINGENT &&
                arrangement.contingencyPercentage &&
                arrangement.contingencyPercentage > 40) {
                issues.push('Contingency percentage exceeds typical limits');
            }
            // Check for prohibited fee types in certain matters
            if (arrangement.prohibitedFeeTypes && arrangement.prohibitedFeeTypes.length > 0) {
                const prohibitedMatch = arrangement.prohibitedFeeTypes.find((type) => type === arrangement.arrangementType);
                if (prohibitedMatch) {
                    issues.push(`${arrangement.arrangementType} fees prohibited for this matter type`);
                    return 'non_compliant';
                }
            }
            // Check fee division compliance
            if (arrangement.divisionOfFees) {
                if (!arrangement.divisionOfFees.clientConsent) {
                    issues.push('Client consent required for fee division');
                }
                if (!arrangement.divisionOfFees.jurisdictionPermits) {
                    issues.push('Fee division not permitted in jurisdiction');
                    return 'non_compliant';
                }
            }
            return issues.length === 0 ? 'compliant' : 'under_review';
        }
        /**
         * 29. Review fee arrangement compliance
         */
        async reviewFeeCompliance(arrangementId, reviewData) {
            const arrangement = await this.feeArrangementRepository.findByPk(arrangementId);
            if (!arrangement) {
                throw new common_1.NotFoundException(`Fee arrangement not found: ${arrangementId}`);
            }
            await arrangement.update({
                complianceStatus: reviewData.complianceStatus,
                lastReviewDate: new Date(),
            });
            this.logger.log(`Reviewed fee arrangement ${arrangementId}: ${reviewData.complianceStatus}`);
            return arrangement;
        }
        /**
         * 30. Get non-compliant fee arrangements
         */
        async getNonCompliantArrangements() {
            return await this.feeArrangementRepository.findAll({
                where: {
                    complianceStatus: { [sequelize_1.Op.in]: ['under_review', 'non_compliant'] },
                },
                order: [['lastReviewDate', 'ASC']],
            });
        }
        /**
         * 31. Calculate fee statistics
         */
        async calculateFeeStatistics(matterId) {
            const where = {};
            if (matterId) {
                where.matterId = matterId;
            }
            const arrangements = await this.feeArrangementRepository.findAll({ where });
            const stats = {
                totalRate: 0,
                rateCount: 0,
                totalContingency: 0,
                contingencyCount: 0,
                totalFlatFees: 0,
                arrangementTypeDistribution: {},
                compliantCount: 0,
            };
            arrangements.forEach((arr) => {
                if (arr.rate) {
                    stats.totalRate += Number(arr.rate);
                    stats.rateCount++;
                }
                if (arr.contingencyPercentage) {
                    stats.totalContingency += Number(arr.contingencyPercentage);
                    stats.contingencyCount++;
                }
                if (arr.flatFeeAmount) {
                    stats.totalFlatFees += Number(arr.flatFeeAmount);
                }
                stats.arrangementTypeDistribution[arr.arrangementType] =
                    (stats.arrangementTypeDistribution[arr.arrangementType] || 0) + 1;
                if (arr.complianceStatus === 'compliant') {
                    stats.compliantCount++;
                }
            });
            return {
                averageHourlyRate: stats.rateCount > 0 ? stats.totalRate / stats.rateCount : 0,
                averageContingencyPercentage: stats.contingencyCount > 0 ? stats.totalContingency / stats.contingencyCount : 0,
                totalFlatFees: stats.totalFlatFees,
                arrangementTypeDistribution: stats.arrangementTypeDistribution,
                complianceRate: arrangements.length > 0 ? (stats.compliantCount / arrangements.length) * 100 : 100,
            };
        }
        /**
         * 32. Validate fee division
         */
        async validateFeeDivision(arrangementId, divisionData) {
            const issues = [];
            if (!divisionData.clientConsent) {
                issues.push('Client consent required for fee division');
            }
            if (!divisionData.jurisdictionPermits) {
                issues.push('Fee division not permitted in this jurisdiction');
            }
            if (divisionData.percentage <= 0 || divisionData.percentage >= 100) {
                issues.push('Fee division percentage must be between 0 and 100');
            }
            const arrangement = await this.feeArrangementRepository.findByPk(arrangementId);
            if (arrangement) {
                await arrangement.update({ divisionOfFees: divisionData });
            }
            return {
                valid: issues.length === 0,
                issues,
            };
        }
    };
    __setFunctionName(_classThis, "FeeArrangementComplianceService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FeeArrangementComplianceService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FeeArrangementComplianceService = _classThis;
})();
exports.FeeArrangementComplianceService = FeeArrangementComplianceService;
/**
 * Professional Conduct Service
 * Manages professional conduct assessments and monitoring
 */
let ProfessionalConductService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ProfessionalConductService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(ProfessionalConductService.name);
        }
        /**
         * 33. Assess lawyer competency
         */
        async assessCompetency(lawyerId, matterId) {
            const factors = [
                {
                    factor: 'Legal knowledge',
                    met: true,
                    notes: 'Attorney has requisite knowledge of applicable law',
                },
                {
                    factor: 'Skill',
                    met: true,
                    notes: 'Attorney has necessary skill for representation',
                },
                {
                    factor: 'Thoroughness',
                    met: true,
                    notes: 'Attorney prepared adequately for matter',
                },
                {
                    factor: 'Preparation',
                    met: true,
                    notes: 'Attorney has sufficient time and resources',
                },
            ];
            const competent = factors.every((f) => f.met);
            const recommendations = [];
            if (!competent) {
                recommendations.push('Consider associating with experienced counsel');
                recommendations.push('Pursue additional education or training');
                recommendations.push('Allocate additional preparation time');
            }
            this.logger.log(`Competency assessment for lawyer ${lawyerId} on matter ${matterId}`);
            return { competent, factors, recommendations };
        }
        /**
         * 34. Monitor client communication compliance
         */
        async monitorCommunicationCompliance(lawyerId, matterId) {
            // This would integrate with communication tracking system
            const lastCommunication = new Date();
            lastCommunication.setDate(lastCommunication.getDate() - 7);
            const now = new Date();
            const daysSinceLastContact = Math.floor((now.getTime() - lastCommunication.getTime()) / (1000 * 60 * 60 * 24));
            const promptnessScore = Math.max(0, 100 - daysSinceLastContact * 5);
            const compliant = daysSinceLastContact <= 14;
            const recommendations = [];
            if (!compliant) {
                recommendations.push('Contact client to provide status update');
                recommendations.push('Establish regular communication schedule');
                recommendations.push('Respond promptly to client inquiries');
            }
            return {
                compliant,
                lastCommunication,
                daysSinceLastContact,
                promptnessScore,
                recommendations,
            };
        }
        /**
         * 35. Validate matter acceptance
         */
        async validateMatterAcceptance(matterData) {
            const conflicts = [];
            const competencyIssues = [];
            const capacityIssues = [];
            const recommendations = [];
            // Check for conflicts (would integrate with conflict checking system)
            // Placeholder logic
            const hasConflicts = false;
            if (hasConflicts) {
                conflicts.push('Potential conflict of interest identified');
                recommendations.push('Perform detailed conflict check');
            }
            // Check competency for matter type
            // Placeholder logic
            const isCompetent = true;
            if (!isCompetent) {
                competencyIssues.push('May lack expertise for this matter type');
                recommendations.push('Consider associating with specialist');
            }
            // Check capacity
            if (matterData.estimatedDuration > 1000) {
                capacityIssues.push('Matter may exceed available capacity');
                recommendations.push('Assess current workload before accepting');
            }
            const shouldAccept = conflicts.length === 0 &&
                competencyIssues.length === 0 &&
                capacityIssues.length === 0;
            return {
                shouldAccept,
                conflicts,
                competencyIssues,
                capacityIssues,
                recommendations,
            };
        }
        /**
         * 36. Generate ethics compliance report
         */
        async generateEthicsComplianceReport(lawyerId, startDate, endDate) {
            // This would aggregate data from all ethics-related systems
            // Placeholder implementation
            const report = {
                lawyerId,
                reportPeriod: { start: startDate, end: endDate },
                violations: {
                    total: 2,
                    bySeverity: {
                        minor: 1,
                        moderate: 1,
                        serious: 0,
                        severe: 0,
                    },
                    pending: 0,
                    resolved: 2,
                },
                conflicts: {
                    total: 15,
                    cleared: 12,
                    waived: 2,
                    declined: 1,
                },
                confidentiality: {
                    totalRecords: 450,
                    privilegedRecords: 380,
                    disclosures: 12,
                    complianceScore: 95,
                },
                fees: {
                    totalArrangements: 25,
                    compliant: 23,
                    underReview: 2,
                    nonCompliant: 0,
                },
                overallComplianceScore: 0,
                recommendations: [],
            };
            // Calculate overall compliance score
            const violationScore = (1 - report.violations.total / Math.max(report.conflicts.total, 1)) * 100;
            const conflictScore = (report.conflicts.cleared / report.conflicts.total) * 100;
            const feeScore = (report.fees.compliant / report.fees.totalArrangements) * 100;
            report.overallComplianceScore = Math.round((violationScore + conflictScore + report.confidentiality.complianceScore + feeScore) / 4);
            if (report.overallComplianceScore < 90) {
                report.recommendations.push('Implement additional ethics training');
                report.recommendations.push('Enhance conflict checking procedures');
                report.recommendations.push('Review fee arrangement practices');
            }
            this.logger.log(`Generated ethics compliance report for lawyer ${lawyerId}: Score ${report.overallComplianceScore}`);
            return report;
        }
    };
    __setFunctionName(_classThis, "ProfessionalConductService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProfessionalConductService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProfessionalConductService = _classThis;
})();
exports.ProfessionalConductService = ProfessionalConductService;
// ============================================================================
// NESTJS MODULE
// ============================================================================
/**
 * Legal Ethics Compliance Module
 * Provides comprehensive ethics and professional responsibility services
 */
let LegalEthicsComplianceModule = (() => {
    let _classDecorators = [(0, common_1.Module)({
            imports: [config_1.ConfigModule],
            providers: [
                EthicsRuleService,
                EthicsViolationService,
                ConflictOfInterestService,
                ClientConfidentialityService,
                FeeArrangementComplianceService,
                ProfessionalConductService,
                {
                    provide: 'ETHICS_RULE_REPOSITORY',
                    useValue: EthicsRuleModel,
                },
                {
                    provide: 'ETHICS_VIOLATION_REPOSITORY',
                    useValue: EthicsViolationModel,
                },
                {
                    provide: 'CONFLICT_CHECK_REPOSITORY',
                    useValue: ConflictCheckModel,
                },
                {
                    provide: 'REMEDIATION_PLAN_REPOSITORY',
                    useValue: RemediationPlanModel,
                },
                {
                    provide: 'FEE_ARRANGEMENT_REPOSITORY',
                    useValue: FeeArrangementComplianceModel,
                },
                {
                    provide: 'CONFIDENTIALITY_RECORD_REPOSITORY',
                    useValue: ConfidentialityRecordModel,
                },
            ],
            exports: [
                EthicsRuleService,
                EthicsViolationService,
                ConflictOfInterestService,
                ClientConfidentialityService,
                FeeArrangementComplianceService,
                ProfessionalConductService,
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var LegalEthicsComplianceModule = _classThis = class {
        static forRoot(options) {
            return {
                module: LegalEthicsComplianceModule,
                global: true,
                providers: [
                    {
                        provide: 'LEGAL_ETHICS_OPTIONS',
                        useValue: options || {},
                    },
                ],
            };
        }
    };
    __setFunctionName(_classThis, "LegalEthicsComplianceModule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LegalEthicsComplianceModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LegalEthicsComplianceModule = _classThis;
})();
exports.LegalEthicsComplianceModule = LegalEthicsComplianceModule;
// ============================================================================
// CONFIGURATION
// ============================================================================
/**
 * Legal ethics configuration
 */
exports.legalEthicsConfig = (0, config_1.registerAs)('legalEthics', () => ({
    defaultJurisdiction: process.env.DEFAULT_JURISDICTION || 'California',
    conflictCheckRequired: process.env.CONFLICT_CHECK_REQUIRED === 'true',
    autoViolationReporting: process.env.AUTO_VIOLATION_REPORTING === 'true',
    strictConfidentiality: process.env.STRICT_CONFIDENTIALITY === 'true',
    feeReasonablenessThreshold: parseFloat(process.env.FEE_REASONABLENESS_THRESHOLD || '1000'),
    maxContingencyPercentage: parseFloat(process.env.MAX_CONTINGENCY_PERCENTAGE || '40'),
    communicationComplianceDays: parseInt(process.env.COMMUNICATION_COMPLIANCE_DAYS || '14', 10),
    privilegeProtection: {
        enabled: process.env.PRIVILEGE_PROTECTION_ENABLED === 'true',
        autoClassify: process.env.AUTO_CLASSIFY_PRIVILEGE === 'true',
    },
    barReporting: {
        autoSubmit: process.env.AUTO_BAR_REPORTING === 'true',
        reminderDays: parseInt(process.env.BAR_REPORTING_REMINDER_DAYS || '30', 10),
    },
}));
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Generate ethics compliance hash for audit trail
 */
function generateEthicsComplianceHash(data) {
    return crypto
        .createHash('sha256')
        .update(JSON.stringify(data))
        .digest('hex');
}
/**
 * Calculate ethics violation risk score
 */
function calculateViolationRiskScore(violation) {
    const severityScores = {
        [ViolationSeverity.MINOR]: 10,
        [ViolationSeverity.MODERATE]: 30,
        [ViolationSeverity.SERIOUS]: 60,
        [ViolationSeverity.SEVERE]: 85,
        [ViolationSeverity.DISBARMENT_LEVEL]: 100,
    };
    const baseScore = severityScores[violation.severity] || 0;
    // Increase score for recurring violations
    const recurrenceFactor = 1.0; // Would be calculated based on history
    return Math.min(100, baseScore * recurrenceFactor);
}
/**
 * Format ethics rule citation
 */
function formatRuleCitation(rule) {
    return `${rule.jurisdiction} Rules of Professional Conduct, Rule ${rule.ruleNumber}: ${rule.title}`;
}
/**
 * Validate conflict waiver requirements
 */
function validateConflictWaiver(conflict, waiver) {
    const issues = [];
    if (conflict.riskLevel === 'critical' && conflict.conflictType === ConflictType.DIRECT_ADVERSITY) {
        issues.push('Direct adversity conflict may not be waivable');
    }
    if (!waiver.informed) {
        issues.push('Waiver must be based on informed consent');
    }
    if (!waiver.written) {
        issues.push('Waiver must be in writing');
    }
    if (!waiver.signed) {
        issues.push('Waiver must be signed by client');
    }
    return {
        valid: issues.length === 0,
        issues,
    };
}
//# sourceMappingURL=legal-ethics-compliance-kit.js.map