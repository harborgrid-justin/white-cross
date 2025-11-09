"use strict";
/**
 * LOC: CONTRACT_MGMT_KIT_001
 * File: /reuse/legal/contract-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize-typescript
 *   - sequelize
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *   - diff
 *   - node-cron
 *
 * DOWNSTREAM (imported by):
 *   - Legal management modules
 *   - Contract workflow controllers
 *   - Clause library services
 *   - Obligation tracking services
 *   - Contract analytics services
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
exports.ObligationDto = exports.CreateContractDto = exports.ContractDto = exports.ContractManagementService = exports.ContractVersionModel = exports.ContractTemplateModel = exports.ContractObligationModel = exports.ContractClauseModel = exports.ContractPartyModel = exports.ContractModel = exports.TemplateVariableSchema = exports.ObligationCreateSchema = exports.ClauseCreateSchema = exports.ContractPartySchema = exports.ContractCreateSchema = exports.ApprovalDecision = exports.VersionAction = exports.PartyRole = exports.ObligationPriority = exports.ObligationStatus = exports.ClauseCategory = exports.ContractType = exports.ContractStatus = void 0;
exports.registerContractConfig = registerContractConfig;
exports.createContractConfigModule = createContractConfigModule;
exports.generateContractNumber = generateContractNumber;
exports.createContract = createContract;
exports.createContractFromTemplate = createContractFromTemplate;
exports.validateTemplateVariables = validateTemplateVariables;
exports.substituteTemplateVariables = substituteTemplateVariables;
exports.createClause = createClause;
exports.addClauseToContract = addClauseToContract;
exports.searchClauses = searchClauses;
exports.detectClauseConflicts = detectClauseConflicts;
exports.createContractVersion = createContractVersion;
exports.getContractVersionHistory = getContractVersionHistory;
exports.compareContractVersions = compareContractVersions;
exports.restoreContractVersion = restoreContractVersion;
exports.createObligation = createObligation;
exports.getUpcomingObligations = getUpcomingObligations;
exports.getOverdueObligations = getOverdueObligations;
exports.completeObligation = completeObligation;
exports.sendObligationReminders = sendObligationReminders;
exports.searchContracts = searchContracts;
exports.getContractByNumber = getContractByNumber;
exports.getContractsExpiringSoon = getContractsExpiringSoon;
/**
 * File: /reuse/legal/contract-management-kit.ts
 * Locator: WC-CONTRACT-MGMT-KIT-001
 * Purpose: Production-Grade Contract Management Kit - Enterprise contract lifecycle management toolkit
 *
 * Upstream: NestJS, Sequelize, Zod, Node-Cron, Diff
 * Downstream: ../backend/modules/legal/*, Contract workflow controllers, Obligation services
 * Dependencies: TypeScript 5.x, Node 18+, sequelize-typescript, @nestjs/swagger, zod
 * Exports: 43 production-ready contract management functions for legal platforms
 *
 * LLM Context: Production-grade contract lifecycle management toolkit for White Cross platform.
 * Provides comprehensive contract creation with template engine and variable substitution,
 * clause library management with categorization and versioning, contract versioning with
 * full diff tracking and comparison, obligation tracking with deadline management and alerts,
 * contract search with full-text and metadata filters, Sequelize models for contracts/clauses/
 * obligations, NestJS services with dependency injection, Swagger API documentation, contract
 * approval workflows with multi-step review, contract status lifecycle management, contract
 * parties and stakeholder management, contract metadata with custom fields, contract document
 * attachment management, contract renewal and expiration tracking, contract amendments and
 * addendums, contract compliance tracking, contract analytics and reporting, contract templates
 * with variable validation, clause conflict detection, obligation reminder notifications,
 * contract audit logging, digital signature integration, contract risk assessment, contract
 * comparison and analysis, and healthcare-specific contract types (provider agreements, vendor
 * contracts, patient consent, insurance contracts).
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
 * Contract status lifecycle
 */
var ContractStatus;
(function (ContractStatus) {
    ContractStatus["DRAFT"] = "draft";
    ContractStatus["PENDING_REVIEW"] = "pending_review";
    ContractStatus["IN_NEGOTIATION"] = "in_negotiation";
    ContractStatus["PENDING_APPROVAL"] = "pending_approval";
    ContractStatus["APPROVED"] = "approved";
    ContractStatus["ACTIVE"] = "active";
    ContractStatus["EXPIRED"] = "expired";
    ContractStatus["TERMINATED"] = "terminated";
    ContractStatus["RENEWED"] = "renewed";
    ContractStatus["ARCHIVED"] = "archived";
})(ContractStatus || (exports.ContractStatus = ContractStatus = {}));
/**
 * Contract type categories
 */
var ContractType;
(function (ContractType) {
    ContractType["PROVIDER_AGREEMENT"] = "provider_agreement";
    ContractType["VENDOR_CONTRACT"] = "vendor_contract";
    ContractType["SERVICE_AGREEMENT"] = "service_agreement";
    ContractType["PATIENT_CONSENT"] = "patient_consent";
    ContractType["INSURANCE_CONTRACT"] = "insurance_contract";
    ContractType["EMPLOYMENT_CONTRACT"] = "employment_contract";
    ContractType["NDA"] = "nda";
    ContractType["SLA"] = "sla";
    ContractType["LEASE_AGREEMENT"] = "lease_agreement";
    ContractType["LICENSING_AGREEMENT"] = "licensing_agreement";
    ContractType["PARTNERSHIP_AGREEMENT"] = "partnership_agreement";
    ContractType["OTHER"] = "other";
})(ContractType || (exports.ContractType = ContractType = {}));
/**
 * Clause category types
 */
var ClauseCategory;
(function (ClauseCategory) {
    ClauseCategory["PAYMENT_TERMS"] = "payment_terms";
    ClauseCategory["CONFIDENTIALITY"] = "confidentiality";
    ClauseCategory["LIABILITY"] = "liability";
    ClauseCategory["INDEMNIFICATION"] = "indemnification";
    ClauseCategory["TERMINATION"] = "termination";
    ClauseCategory["DISPUTE_RESOLUTION"] = "dispute_resolution";
    ClauseCategory["INTELLECTUAL_PROPERTY"] = "intellectual_property";
    ClauseCategory["DATA_PROTECTION"] = "data_protection";
    ClauseCategory["COMPLIANCE"] = "compliance";
    ClauseCategory["FORCE_MAJEURE"] = "force_majeure";
    ClauseCategory["GOVERNING_LAW"] = "governing_law";
    ClauseCategory["AMENDMENT"] = "amendment";
    ClauseCategory["RENEWAL"] = "renewal";
    ClauseCategory["ASSIGNMENT"] = "assignment";
    ClauseCategory["NOTICES"] = "notices";
    ClauseCategory["HIPAA_COMPLIANCE"] = "hipaa_compliance";
    ClauseCategory["OTHER"] = "other";
})(ClauseCategory || (exports.ClauseCategory = ClauseCategory = {}));
/**
 * Obligation status tracking
 */
var ObligationStatus;
(function (ObligationStatus) {
    ObligationStatus["PENDING"] = "pending";
    ObligationStatus["IN_PROGRESS"] = "in_progress";
    ObligationStatus["COMPLETED"] = "completed";
    ObligationStatus["OVERDUE"] = "overdue";
    ObligationStatus["WAIVED"] = "waived";
    ObligationStatus["DISPUTED"] = "disputed";
})(ObligationStatus || (exports.ObligationStatus = ObligationStatus = {}));
/**
 * Obligation priority levels
 */
var ObligationPriority;
(function (ObligationPriority) {
    ObligationPriority["LOW"] = "low";
    ObligationPriority["MEDIUM"] = "medium";
    ObligationPriority["HIGH"] = "high";
    ObligationPriority["CRITICAL"] = "critical";
})(ObligationPriority || (exports.ObligationPriority = ObligationPriority = {}));
/**
 * Contract party role types
 */
var PartyRole;
(function (PartyRole) {
    PartyRole["PROVIDER"] = "provider";
    PartyRole["CLIENT"] = "client";
    PartyRole["VENDOR"] = "vendor";
    PartyRole["PATIENT"] = "patient";
    PartyRole["INSURER"] = "insurer";
    PartyRole["EMPLOYER"] = "employer";
    PartyRole["EMPLOYEE"] = "employee";
    PartyRole["LICENSOR"] = "licensor";
    PartyRole["LICENSEE"] = "licensee";
    PartyRole["PARTNER"] = "partner";
    PartyRole["OTHER"] = "other";
})(PartyRole || (exports.PartyRole = PartyRole = {}));
/**
 * Contract version action types
 */
var VersionAction;
(function (VersionAction) {
    VersionAction["CREATED"] = "created";
    VersionAction["UPDATED"] = "updated";
    VersionAction["AMENDED"] = "amended";
    VersionAction["RESTORED"] = "restored";
    VersionAction["ARCHIVED"] = "archived";
})(VersionAction || (exports.VersionAction = VersionAction = {}));
/**
 * Contract approval decision
 */
var ApprovalDecision;
(function (ApprovalDecision) {
    ApprovalDecision["APPROVED"] = "approved";
    ApprovalDecision["REJECTED"] = "rejected";
    ApprovalDecision["REQUIRES_CHANGES"] = "requires_changes";
})(ApprovalDecision || (exports.ApprovalDecision = ApprovalDecision = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Contract creation schema
 */
exports.ContractCreateSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(500),
    description: zod_1.z.string().max(2000).optional(),
    contractType: zod_1.z.nativeEnum(ContractType),
    effectiveDate: zod_1.z.date(),
    expirationDate: zod_1.z.date().optional(),
    autoRenew: zod_1.z.boolean().default(false),
    renewalNoticeDays: zod_1.z.number().int().min(0).max(365).optional(),
    terminationNoticeDays: zod_1.z.number().int().min(0).max(365).optional(),
    totalValue: zod_1.z.number().min(0).optional(),
    currency: zod_1.z.string().length(3).optional(),
    templateId: zod_1.z.string().optional(),
    metadata: zod_1.z.object({
        tags: zod_1.z.array(zod_1.z.string()).default([]),
        category: zod_1.z.string().optional(),
        department: zod_1.z.string().optional(),
        riskLevel: zod_1.z.enum(['low', 'medium', 'high', 'critical']).optional(),
        customFields: zod_1.z.record(zod_1.z.any()).default({}),
    }).optional(),
});
/**
 * Contract party schema
 */
exports.ContractPartySchema = zod_1.z.object({
    role: zod_1.z.nativeEnum(PartyRole),
    entityType: zod_1.z.enum(['individual', 'organization']),
    name: zod_1.z.string().min(1).max(255),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    organizationId: zod_1.z.string().optional(),
    userId: zod_1.z.string().optional(),
    signatureRequired: zod_1.z.boolean().default(false),
    isPrimary: zod_1.z.boolean().default(false),
    metadata: zod_1.z.record(zod_1.z.any()).default({}),
});
/**
 * Clause creation schema
 */
exports.ClauseCreateSchema = zod_1.z.object({
    category: zod_1.z.nativeEnum(ClauseCategory),
    title: zod_1.z.string().min(1).max(500),
    content: zod_1.z.string().min(1),
    order: zod_1.z.number().int().min(0).default(0),
    required: zod_1.z.boolean().default(false),
    editable: zod_1.z.boolean().default(true),
    variables: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        type: zod_1.z.enum(['string', 'number', 'date', 'boolean', 'currency']),
        required: zod_1.z.boolean(),
        defaultValue: zod_1.z.any().optional(),
        validation: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
    })).default([]),
    metadata: zod_1.z.record(zod_1.z.any()).default({}),
});
/**
 * Obligation creation schema
 */
exports.ObligationCreateSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(500),
    description: zod_1.z.string().min(1),
    responsibleParty: zod_1.z.nativeEnum(PartyRole),
    assignedTo: zod_1.z.string().optional(),
    dueDate: zod_1.z.date(),
    priority: zod_1.z.nativeEnum(ObligationPriority).default(ObligationPriority.MEDIUM),
    recurring: zod_1.z.boolean().default(false),
    recurrencePattern: zod_1.z.string().optional(),
    reminderDays: zod_1.z.array(zod_1.z.number().int().min(0)).default([7, 3, 1]),
    dependencies: zod_1.z.array(zod_1.z.string()).default([]),
    metadata: zod_1.z.record(zod_1.z.any()).default({}),
});
/**
 * Template variable schema
 */
exports.TemplateVariableSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    type: zod_1.z.enum(['string', 'number', 'date', 'boolean', 'currency', 'party', 'clause']),
    required: zod_1.z.boolean(),
    defaultValue: zod_1.z.any().optional(),
    validation: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    options: zod_1.z.array(zod_1.z.any()).optional(),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Contract Sequelize Model
 */
let ContractModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'contracts',
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
    let _contractNumber_decorators;
    let _contractNumber_initializers = [];
    let _contractNumber_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _contractType_decorators;
    let _contractType_initializers = [];
    let _contractType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _autoRenew_decorators;
    let _autoRenew_initializers = [];
    let _autoRenew_extraInitializers = [];
    let _renewalNoticeDays_decorators;
    let _renewalNoticeDays_initializers = [];
    let _renewalNoticeDays_extraInitializers = [];
    let _terminationNoticeDays_decorators;
    let _terminationNoticeDays_initializers = [];
    let _terminationNoticeDays_extraInitializers = [];
    let _totalValue_decorators;
    let _totalValue_initializers = [];
    let _totalValue_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _templateId_decorators;
    let _templateId_initializers = [];
    let _templateId_extraInitializers = [];
    let _parentContractId_decorators;
    let _parentContractId_initializers = [];
    let _parentContractId_extraInitializers = [];
    let _documentUrl_decorators;
    let _documentUrl_initializers = [];
    let _documentUrl_extraInitializers = [];
    let _signedDocumentUrl_decorators;
    let _signedDocumentUrl_initializers = [];
    let _signedDocumentUrl_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _updatedBy_decorators;
    let _updatedBy_initializers = [];
    let _updatedBy_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvedAt_decorators;
    let _approvedAt_initializers = [];
    let _approvedAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _parties_decorators;
    let _parties_initializers = [];
    let _parties_extraInitializers = [];
    let _clauses_decorators;
    let _clauses_initializers = [];
    let _clauses_extraInitializers = [];
    let _obligations_decorators;
    let _obligations_initializers = [];
    let _obligations_extraInitializers = [];
    let _versions_decorators;
    let _versions_initializers = [];
    let _versions_extraInitializers = [];
    var ContractModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.contractNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _contractNumber_initializers, void 0));
            this.title = (__runInitializers(this, _contractNumber_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.contractType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _contractType_initializers, void 0));
            this.status = (__runInitializers(this, _contractType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.version = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _version_initializers, void 0));
            this.effectiveDate = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
            this.expirationDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
            this.autoRenew = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _autoRenew_initializers, void 0));
            this.renewalNoticeDays = (__runInitializers(this, _autoRenew_extraInitializers), __runInitializers(this, _renewalNoticeDays_initializers, void 0));
            this.terminationNoticeDays = (__runInitializers(this, _renewalNoticeDays_extraInitializers), __runInitializers(this, _terminationNoticeDays_initializers, void 0));
            this.totalValue = (__runInitializers(this, _terminationNoticeDays_extraInitializers), __runInitializers(this, _totalValue_initializers, void 0));
            this.currency = (__runInitializers(this, _totalValue_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
            this.metadata = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.templateId = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _templateId_initializers, void 0));
            this.parentContractId = (__runInitializers(this, _templateId_extraInitializers), __runInitializers(this, _parentContractId_initializers, void 0));
            this.documentUrl = (__runInitializers(this, _parentContractId_extraInitializers), __runInitializers(this, _documentUrl_initializers, void 0));
            this.signedDocumentUrl = (__runInitializers(this, _documentUrl_extraInitializers), __runInitializers(this, _signedDocumentUrl_initializers, void 0));
            this.tenantId = (__runInitializers(this, _signedDocumentUrl_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.createdBy = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvedAt = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvedAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _approvedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.parties = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _parties_initializers, void 0));
            this.clauses = (__runInitializers(this, _parties_extraInitializers), __runInitializers(this, _clauses_initializers, void 0));
            this.obligations = (__runInitializers(this, _clauses_extraInitializers), __runInitializers(this, _obligations_initializers, void 0));
            this.versions = (__runInitializers(this, _obligations_extraInitializers), __runInitializers(this, _versions_initializers, void 0));
            __runInitializers(this, _versions_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ContractModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _contractNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                unique: true,
                allowNull: false,
            })];
        _title_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _contractType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ContractType)),
                allowNull: false,
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ContractStatus)),
                allowNull: false,
                defaultValue: ContractStatus.DRAFT,
            })];
        _version_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                defaultValue: 1,
            })];
        _effectiveDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _expirationDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _autoRenew_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: false,
            })];
        _renewalNoticeDays_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _terminationNoticeDays_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _totalValue_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _currency_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(3))];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _templateId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _parentContractId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _documentUrl_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _signedDocumentUrl_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _updatedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _approvedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _parties_decorators = [(0, sequelize_typescript_1.HasMany)(() => ContractPartyModel)];
        _clauses_decorators = [(0, sequelize_typescript_1.HasMany)(() => ContractClauseModel)];
        _obligations_decorators = [(0, sequelize_typescript_1.HasMany)(() => ContractObligationModel)];
        _versions_decorators = [(0, sequelize_typescript_1.HasMany)(() => ContractVersionModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _contractNumber_decorators, { kind: "field", name: "contractNumber", static: false, private: false, access: { has: obj => "contractNumber" in obj, get: obj => obj.contractNumber, set: (obj, value) => { obj.contractNumber = value; } }, metadata: _metadata }, _contractNumber_initializers, _contractNumber_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _contractType_decorators, { kind: "field", name: "contractType", static: false, private: false, access: { has: obj => "contractType" in obj, get: obj => obj.contractType, set: (obj, value) => { obj.contractType = value; } }, metadata: _metadata }, _contractType_initializers, _contractType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
        __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
        __esDecorate(null, null, _autoRenew_decorators, { kind: "field", name: "autoRenew", static: false, private: false, access: { has: obj => "autoRenew" in obj, get: obj => obj.autoRenew, set: (obj, value) => { obj.autoRenew = value; } }, metadata: _metadata }, _autoRenew_initializers, _autoRenew_extraInitializers);
        __esDecorate(null, null, _renewalNoticeDays_decorators, { kind: "field", name: "renewalNoticeDays", static: false, private: false, access: { has: obj => "renewalNoticeDays" in obj, get: obj => obj.renewalNoticeDays, set: (obj, value) => { obj.renewalNoticeDays = value; } }, metadata: _metadata }, _renewalNoticeDays_initializers, _renewalNoticeDays_extraInitializers);
        __esDecorate(null, null, _terminationNoticeDays_decorators, { kind: "field", name: "terminationNoticeDays", static: false, private: false, access: { has: obj => "terminationNoticeDays" in obj, get: obj => obj.terminationNoticeDays, set: (obj, value) => { obj.terminationNoticeDays = value; } }, metadata: _metadata }, _terminationNoticeDays_initializers, _terminationNoticeDays_extraInitializers);
        __esDecorate(null, null, _totalValue_decorators, { kind: "field", name: "totalValue", static: false, private: false, access: { has: obj => "totalValue" in obj, get: obj => obj.totalValue, set: (obj, value) => { obj.totalValue = value; } }, metadata: _metadata }, _totalValue_initializers, _totalValue_extraInitializers);
        __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _templateId_decorators, { kind: "field", name: "templateId", static: false, private: false, access: { has: obj => "templateId" in obj, get: obj => obj.templateId, set: (obj, value) => { obj.templateId = value; } }, metadata: _metadata }, _templateId_initializers, _templateId_extraInitializers);
        __esDecorate(null, null, _parentContractId_decorators, { kind: "field", name: "parentContractId", static: false, private: false, access: { has: obj => "parentContractId" in obj, get: obj => obj.parentContractId, set: (obj, value) => { obj.parentContractId = value; } }, metadata: _metadata }, _parentContractId_initializers, _parentContractId_extraInitializers);
        __esDecorate(null, null, _documentUrl_decorators, { kind: "field", name: "documentUrl", static: false, private: false, access: { has: obj => "documentUrl" in obj, get: obj => obj.documentUrl, set: (obj, value) => { obj.documentUrl = value; } }, metadata: _metadata }, _documentUrl_initializers, _documentUrl_extraInitializers);
        __esDecorate(null, null, _signedDocumentUrl_decorators, { kind: "field", name: "signedDocumentUrl", static: false, private: false, access: { has: obj => "signedDocumentUrl" in obj, get: obj => obj.signedDocumentUrl, set: (obj, value) => { obj.signedDocumentUrl = value; } }, metadata: _metadata }, _signedDocumentUrl_initializers, _signedDocumentUrl_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvedAt_decorators, { kind: "field", name: "approvedAt", static: false, private: false, access: { has: obj => "approvedAt" in obj, get: obj => obj.approvedAt, set: (obj, value) => { obj.approvedAt = value; } }, metadata: _metadata }, _approvedAt_initializers, _approvedAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _parties_decorators, { kind: "field", name: "parties", static: false, private: false, access: { has: obj => "parties" in obj, get: obj => obj.parties, set: (obj, value) => { obj.parties = value; } }, metadata: _metadata }, _parties_initializers, _parties_extraInitializers);
        __esDecorate(null, null, _clauses_decorators, { kind: "field", name: "clauses", static: false, private: false, access: { has: obj => "clauses" in obj, get: obj => obj.clauses, set: (obj, value) => { obj.clauses = value; } }, metadata: _metadata }, _clauses_initializers, _clauses_extraInitializers);
        __esDecorate(null, null, _obligations_decorators, { kind: "field", name: "obligations", static: false, private: false, access: { has: obj => "obligations" in obj, get: obj => obj.obligations, set: (obj, value) => { obj.obligations = value; } }, metadata: _metadata }, _obligations_initializers, _obligations_extraInitializers);
        __esDecorate(null, null, _versions_decorators, { kind: "field", name: "versions", static: false, private: false, access: { has: obj => "versions" in obj, get: obj => obj.versions, set: (obj, value) => { obj.versions = value; } }, metadata: _metadata }, _versions_initializers, _versions_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ContractModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ContractModel = _classThis;
})();
exports.ContractModel = ContractModel;
/**
 * Contract Party Sequelize Model
 */
let ContractPartyModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'contract_parties',
            timestamps: false,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _contractId_decorators;
    let _contractId_initializers = [];
    let _contractId_extraInitializers = [];
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
    let _address_decorators;
    let _address_initializers = [];
    let _address_extraInitializers = [];
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
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
    let _contract_decorators;
    let _contract_initializers = [];
    let _contract_extraInitializers = [];
    var ContractPartyModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.contractId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _contractId_initializers, void 0));
            this.role = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _role_initializers, void 0));
            this.entityType = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _entityType_initializers, void 0));
            this.name = (__runInitializers(this, _entityType_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.email = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
            this.address = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _address_initializers, void 0));
            this.organizationId = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _organizationId_initializers, void 0));
            this.userId = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.signatureRequired = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _signatureRequired_initializers, void 0));
            this.signedAt = (__runInitializers(this, _signatureRequired_extraInitializers), __runInitializers(this, _signedAt_initializers, void 0));
            this.signatureUrl = (__runInitializers(this, _signedAt_extraInitializers), __runInitializers(this, _signatureUrl_initializers, void 0));
            this.isPrimary = (__runInitializers(this, _signatureUrl_extraInitializers), __runInitializers(this, _isPrimary_initializers, void 0));
            this.metadata = (__runInitializers(this, _isPrimary_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.contract = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _contract_initializers, void 0));
            __runInitializers(this, _contract_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ContractPartyModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _contractId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => ContractModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _role_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PartyRole)),
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
        _address_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _organizationId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _userId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
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
        _contract_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ContractModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
        __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: obj => "role" in obj, get: obj => obj.role, set: (obj, value) => { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
        __esDecorate(null, null, _entityType_decorators, { kind: "field", name: "entityType", static: false, private: false, access: { has: obj => "entityType" in obj, get: obj => obj.entityType, set: (obj, value) => { obj.entityType = value; } }, metadata: _metadata }, _entityType_initializers, _entityType_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: obj => "phone" in obj, get: obj => obj.phone, set: (obj, value) => { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
        __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: obj => "address" in obj, get: obj => obj.address, set: (obj, value) => { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
        __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _signatureRequired_decorators, { kind: "field", name: "signatureRequired", static: false, private: false, access: { has: obj => "signatureRequired" in obj, get: obj => obj.signatureRequired, set: (obj, value) => { obj.signatureRequired = value; } }, metadata: _metadata }, _signatureRequired_initializers, _signatureRequired_extraInitializers);
        __esDecorate(null, null, _signedAt_decorators, { kind: "field", name: "signedAt", static: false, private: false, access: { has: obj => "signedAt" in obj, get: obj => obj.signedAt, set: (obj, value) => { obj.signedAt = value; } }, metadata: _metadata }, _signedAt_initializers, _signedAt_extraInitializers);
        __esDecorate(null, null, _signatureUrl_decorators, { kind: "field", name: "signatureUrl", static: false, private: false, access: { has: obj => "signatureUrl" in obj, get: obj => obj.signatureUrl, set: (obj, value) => { obj.signatureUrl = value; } }, metadata: _metadata }, _signatureUrl_initializers, _signatureUrl_extraInitializers);
        __esDecorate(null, null, _isPrimary_decorators, { kind: "field", name: "isPrimary", static: false, private: false, access: { has: obj => "isPrimary" in obj, get: obj => obj.isPrimary, set: (obj, value) => { obj.isPrimary = value; } }, metadata: _metadata }, _isPrimary_initializers, _isPrimary_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _contract_decorators, { kind: "field", name: "contract", static: false, private: false, access: { has: obj => "contract" in obj, get: obj => obj.contract, set: (obj, value) => { obj.contract = value; } }, metadata: _metadata }, _contract_initializers, _contract_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ContractPartyModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ContractPartyModel = _classThis;
})();
exports.ContractPartyModel = ContractPartyModel;
/**
 * Contract Clause Sequelize Model
 */
let ContractClauseModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'contract_clauses',
            timestamps: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _contractId_decorators;
    let _contractId_initializers = [];
    let _contractId_extraInitializers = [];
    let _libraryClauseId_decorators;
    let _libraryClauseId_initializers = [];
    let _libraryClauseId_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _content_extraInitializers = [];
    let _order_decorators;
    let _order_initializers = [];
    let _order_extraInitializers = [];
    let _required_decorators;
    let _required_initializers = [];
    let _required_extraInitializers = [];
    let _editable_decorators;
    let _editable_initializers = [];
    let _editable_extraInitializers = [];
    let _variables_decorators;
    let _variables_initializers = [];
    let _variables_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _contract_decorators;
    let _contract_initializers = [];
    let _contract_extraInitializers = [];
    var ContractClauseModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.contractId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _contractId_initializers, void 0));
            this.libraryClauseId = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _libraryClauseId_initializers, void 0));
            this.category = (__runInitializers(this, _libraryClauseId_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.title = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.content = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.order = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _order_initializers, void 0));
            this.required = (__runInitializers(this, _order_extraInitializers), __runInitializers(this, _required_initializers, void 0));
            this.editable = (__runInitializers(this, _required_extraInitializers), __runInitializers(this, _editable_initializers, void 0));
            this.variables = (__runInitializers(this, _editable_extraInitializers), __runInitializers(this, _variables_initializers, void 0));
            this.metadata = (__runInitializers(this, _variables_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.version = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _version_initializers, void 0));
            this.createdAt = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.contract = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _contract_initializers, void 0));
            __runInitializers(this, _contract_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ContractClauseModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _contractId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => ContractModel), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _libraryClauseId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _category_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ClauseCategory)),
                allowNull: false,
            })];
        _title_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: false,
            })];
        _content_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _order_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                defaultValue: 0,
            })];
        _required_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: false,
            })];
        _editable_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: true,
            })];
        _variables_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _version_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                defaultValue: 1,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _contract_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ContractModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
        __esDecorate(null, null, _libraryClauseId_decorators, { kind: "field", name: "libraryClauseId", static: false, private: false, access: { has: obj => "libraryClauseId" in obj, get: obj => obj.libraryClauseId, set: (obj, value) => { obj.libraryClauseId = value; } }, metadata: _metadata }, _libraryClauseId_initializers, _libraryClauseId_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _order_decorators, { kind: "field", name: "order", static: false, private: false, access: { has: obj => "order" in obj, get: obj => obj.order, set: (obj, value) => { obj.order = value; } }, metadata: _metadata }, _order_initializers, _order_extraInitializers);
        __esDecorate(null, null, _required_decorators, { kind: "field", name: "required", static: false, private: false, access: { has: obj => "required" in obj, get: obj => obj.required, set: (obj, value) => { obj.required = value; } }, metadata: _metadata }, _required_initializers, _required_extraInitializers);
        __esDecorate(null, null, _editable_decorators, { kind: "field", name: "editable", static: false, private: false, access: { has: obj => "editable" in obj, get: obj => obj.editable, set: (obj, value) => { obj.editable = value; } }, metadata: _metadata }, _editable_initializers, _editable_extraInitializers);
        __esDecorate(null, null, _variables_decorators, { kind: "field", name: "variables", static: false, private: false, access: { has: obj => "variables" in obj, get: obj => obj.variables, set: (obj, value) => { obj.variables = value; } }, metadata: _metadata }, _variables_initializers, _variables_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _contract_decorators, { kind: "field", name: "contract", static: false, private: false, access: { has: obj => "contract" in obj, get: obj => obj.contract, set: (obj, value) => { obj.contract = value; } }, metadata: _metadata }, _contract_initializers, _contract_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ContractClauseModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ContractClauseModel = _classThis;
})();
exports.ContractClauseModel = ContractClauseModel;
/**
 * Contract Obligation Sequelize Model
 */
let ContractObligationModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'contract_obligations',
            timestamps: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _contractId_decorators;
    let _contractId_initializers = [];
    let _contractId_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _responsibleParty_decorators;
    let _responsibleParty_initializers = [];
    let _responsibleParty_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _completedDate_decorators;
    let _completedDate_initializers = [];
    let _completedDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _recurring_decorators;
    let _recurring_initializers = [];
    let _recurring_extraInitializers = [];
    let _recurrencePattern_decorators;
    let _recurrencePattern_initializers = [];
    let _recurrencePattern_extraInitializers = [];
    let _reminderDays_decorators;
    let _reminderDays_initializers = [];
    let _reminderDays_extraInitializers = [];
    let _dependencies_decorators;
    let _dependencies_initializers = [];
    let _dependencies_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _contract_decorators;
    let _contract_initializers = [];
    let _contract_extraInitializers = [];
    var ContractObligationModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.contractId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _contractId_initializers, void 0));
            this.title = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.responsibleParty = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _responsibleParty_initializers, void 0));
            this.assignedTo = (__runInitializers(this, _responsibleParty_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
            this.dueDate = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
            this.completedDate = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _completedDate_initializers, void 0));
            this.status = (__runInitializers(this, _completedDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.priority = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.recurring = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _recurring_initializers, void 0));
            this.recurrencePattern = (__runInitializers(this, _recurring_extraInitializers), __runInitializers(this, _recurrencePattern_initializers, void 0));
            this.reminderDays = (__runInitializers(this, _recurrencePattern_extraInitializers), __runInitializers(this, _reminderDays_initializers, void 0));
            this.dependencies = (__runInitializers(this, _reminderDays_extraInitializers), __runInitializers(this, _dependencies_initializers, void 0));
            this.metadata = (__runInitializers(this, _dependencies_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.contract = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _contract_initializers, void 0));
            __runInitializers(this, _contract_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ContractObligationModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _contractId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => ContractModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _title_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _responsibleParty_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PartyRole)),
                allowNull: false,
            })];
        _assignedTo_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _dueDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _completedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ObligationStatus)),
                defaultValue: ObligationStatus.PENDING,
            })];
        _priority_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ObligationPriority)),
                defaultValue: ObligationPriority.MEDIUM,
            })];
        _recurring_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: false,
            })];
        _recurrencePattern_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _reminderDays_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _dependencies_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _contract_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ContractModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _responsibleParty_decorators, { kind: "field", name: "responsibleParty", static: false, private: false, access: { has: obj => "responsibleParty" in obj, get: obj => obj.responsibleParty, set: (obj, value) => { obj.responsibleParty = value; } }, metadata: _metadata }, _responsibleParty_initializers, _responsibleParty_extraInitializers);
        __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
        __esDecorate(null, null, _completedDate_decorators, { kind: "field", name: "completedDate", static: false, private: false, access: { has: obj => "completedDate" in obj, get: obj => obj.completedDate, set: (obj, value) => { obj.completedDate = value; } }, metadata: _metadata }, _completedDate_initializers, _completedDate_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _recurring_decorators, { kind: "field", name: "recurring", static: false, private: false, access: { has: obj => "recurring" in obj, get: obj => obj.recurring, set: (obj, value) => { obj.recurring = value; } }, metadata: _metadata }, _recurring_initializers, _recurring_extraInitializers);
        __esDecorate(null, null, _recurrencePattern_decorators, { kind: "field", name: "recurrencePattern", static: false, private: false, access: { has: obj => "recurrencePattern" in obj, get: obj => obj.recurrencePattern, set: (obj, value) => { obj.recurrencePattern = value; } }, metadata: _metadata }, _recurrencePattern_initializers, _recurrencePattern_extraInitializers);
        __esDecorate(null, null, _reminderDays_decorators, { kind: "field", name: "reminderDays", static: false, private: false, access: { has: obj => "reminderDays" in obj, get: obj => obj.reminderDays, set: (obj, value) => { obj.reminderDays = value; } }, metadata: _metadata }, _reminderDays_initializers, _reminderDays_extraInitializers);
        __esDecorate(null, null, _dependencies_decorators, { kind: "field", name: "dependencies", static: false, private: false, access: { has: obj => "dependencies" in obj, get: obj => obj.dependencies, set: (obj, value) => { obj.dependencies = value; } }, metadata: _metadata }, _dependencies_initializers, _dependencies_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _contract_decorators, { kind: "field", name: "contract", static: false, private: false, access: { has: obj => "contract" in obj, get: obj => obj.contract, set: (obj, value) => { obj.contract = value; } }, metadata: _metadata }, _contract_initializers, _contract_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ContractObligationModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ContractObligationModel = _classThis;
})();
exports.ContractObligationModel = ContractObligationModel;
/**
 * Contract Template Sequelize Model
 */
let ContractTemplateModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'contract_templates',
            timestamps: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _contractType_decorators;
    let _contractType_initializers = [];
    let _contractType_extraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _content_extraInitializers = [];
    let _variables_decorators;
    let _variables_initializers = [];
    let _variables_extraInitializers = [];
    let _defaultClauses_decorators;
    let _defaultClauses_initializers = [];
    let _defaultClauses_extraInitializers = [];
    let _requiredClauses_decorators;
    let _requiredClauses_initializers = [];
    let _requiredClauses_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
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
    var ContractTemplateModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.contractType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _contractType_initializers, void 0));
            this.content = (__runInitializers(this, _contractType_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.variables = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _variables_initializers, void 0));
            this.defaultClauses = (__runInitializers(this, _variables_extraInitializers), __runInitializers(this, _defaultClauses_initializers, void 0));
            this.requiredClauses = (__runInitializers(this, _defaultClauses_extraInitializers), __runInitializers(this, _requiredClauses_initializers, void 0));
            this.version = (__runInitializers(this, _requiredClauses_extraInitializers), __runInitializers(this, _version_initializers, void 0));
            this.isActive = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.metadata = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ContractTemplateModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _name_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _contractType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ContractType)),
                allowNull: false,
            })];
        _content_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _variables_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _defaultClauses_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _requiredClauses_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _version_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                defaultValue: 1,
            })];
        _isActive_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: true,
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _contractType_decorators, { kind: "field", name: "contractType", static: false, private: false, access: { has: obj => "contractType" in obj, get: obj => obj.contractType, set: (obj, value) => { obj.contractType = value; } }, metadata: _metadata }, _contractType_initializers, _contractType_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _variables_decorators, { kind: "field", name: "variables", static: false, private: false, access: { has: obj => "variables" in obj, get: obj => obj.variables, set: (obj, value) => { obj.variables = value; } }, metadata: _metadata }, _variables_initializers, _variables_extraInitializers);
        __esDecorate(null, null, _defaultClauses_decorators, { kind: "field", name: "defaultClauses", static: false, private: false, access: { has: obj => "defaultClauses" in obj, get: obj => obj.defaultClauses, set: (obj, value) => { obj.defaultClauses = value; } }, metadata: _metadata }, _defaultClauses_initializers, _defaultClauses_extraInitializers);
        __esDecorate(null, null, _requiredClauses_decorators, { kind: "field", name: "requiredClauses", static: false, private: false, access: { has: obj => "requiredClauses" in obj, get: obj => obj.requiredClauses, set: (obj, value) => { obj.requiredClauses = value; } }, metadata: _metadata }, _requiredClauses_initializers, _requiredClauses_extraInitializers);
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ContractTemplateModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ContractTemplateModel = _classThis;
})();
exports.ContractTemplateModel = ContractTemplateModel;
/**
 * Contract Version Sequelize Model
 */
let ContractVersionModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'contract_versions',
            timestamps: false,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _contractId_decorators;
    let _contractId_initializers = [];
    let _contractId_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _action_decorators;
    let _action_initializers = [];
    let _action_extraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _content_extraInitializers = [];
    let _changes_decorators;
    let _changes_initializers = [];
    let _changes_extraInitializers = [];
    let _checksum_decorators;
    let _checksum_initializers = [];
    let _checksum_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _contract_decorators;
    let _contract_initializers = [];
    let _contract_extraInitializers = [];
    var ContractVersionModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.contractId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _contractId_initializers, void 0));
            this.version = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _version_initializers, void 0));
            this.action = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _action_initializers, void 0));
            this.content = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.changes = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _changes_initializers, void 0));
            this.checksum = (__runInitializers(this, _changes_extraInitializers), __runInitializers(this, _checksum_initializers, void 0));
            this.createdBy = (__runInitializers(this, _checksum_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.metadata = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.contract = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _contract_initializers, void 0));
            __runInitializers(this, _contract_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ContractVersionModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _contractId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => ContractModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _version_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
            })];
        _action_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(VersionAction)),
                allowNull: false,
            })];
        _content_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _changes_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _checksum_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: false,
            })];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _createdAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                defaultValue: sequelize_typescript_1.DataType.NOW,
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _contract_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ContractModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: obj => "action" in obj, get: obj => obj.action, set: (obj, value) => { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _changes_decorators, { kind: "field", name: "changes", static: false, private: false, access: { has: obj => "changes" in obj, get: obj => obj.changes, set: (obj, value) => { obj.changes = value; } }, metadata: _metadata }, _changes_initializers, _changes_extraInitializers);
        __esDecorate(null, null, _checksum_decorators, { kind: "field", name: "checksum", static: false, private: false, access: { has: obj => "checksum" in obj, get: obj => obj.checksum, set: (obj, value) => { obj.checksum = value; } }, metadata: _metadata }, _checksum_initializers, _checksum_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _contract_decorators, { kind: "field", name: "contract", static: false, private: false, access: { has: obj => "contract" in obj, get: obj => obj.contract, set: (obj, value) => { obj.contract = value; } }, metadata: _metadata }, _contract_initializers, _contract_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ContractVersionModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ContractVersionModel = _classThis;
})();
exports.ContractVersionModel = ContractVersionModel;
// ============================================================================
// CONFIGURATION MANAGEMENT
// ============================================================================
/**
 * Register contract management configuration namespace
 *
 * @returns Configuration factory for NestJS
 *
 * @example
 * ```typescript
 * ConfigModule.forRoot({
 *   load: [registerContractConfig()],
 * })
 * ```
 */
function registerContractConfig() {
    return (0, config_1.registerAs)('contracts', () => ({
        contractNumberPrefix: process.env.CONTRACT_NUMBER_PREFIX || 'CTR',
        enableVersioning: process.env.CONTRACT_VERSIONING !== 'false',
        maxVersions: parseInt(process.env.CONTRACT_MAX_VERSIONS || '50', 10),
        enableAutoApproval: process.env.CONTRACT_AUTO_APPROVAL === 'true',
        enableDigitalSignature: process.env.CONTRACT_DIGITAL_SIGNATURE !== 'false',
        defaultCurrency: process.env.CONTRACT_DEFAULT_CURRENCY || 'USD',
        reminderSchedule: process.env.CONTRACT_REMINDER_SCHEDULE || '0 9 * * *', // Daily at 9 AM
        expirationWarningDays: parseInt(process.env.CONTRACT_EXPIRATION_WARNING_DAYS || '30', 10),
        obligationReminderDays: process.env.CONTRACT_OBLIGATION_REMINDERS?.split(',').map(Number) || [30, 14, 7, 3, 1],
        enableAuditLog: process.env.CONTRACT_AUDIT_LOG !== 'false',
        templateDirectory: process.env.CONTRACT_TEMPLATE_DIR || './templates/contracts',
    }));
}
/**
 * Create contract management configuration module
 *
 * @returns DynamicModule for contract config
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [createContractConfigModule()],
 * })
 * export class ContractModule {}
 * ```
 */
function createContractConfigModule() {
    return config_1.ConfigModule.forRoot({
        load: [registerContractConfig()],
        isGlobal: true,
        cache: true,
    });
}
// ============================================================================
// CONTRACT CREATION & TEMPLATING
// ============================================================================
/**
 * Generate unique contract number
 *
 * @param configService - Configuration service
 * @returns Unique contract number
 *
 * @example
 * ```typescript
 * const contractNumber = await generateContractNumber(configService);
 * // 'CTR-2025-001234'
 * ```
 */
async function generateContractNumber(configService) {
    const prefix = configService.get('contracts.contractNumberPrefix', 'CTR');
    const year = new Date().getFullYear();
    const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${year}-${timestamp}${randomPart}`;
}
/**
 * Create new contract from template or scratch
 *
 * @param data - Contract creation data
 * @param userId - User creating the contract
 * @param configService - Configuration service
 * @returns Created contract
 *
 * @example
 * ```typescript
 * const contract = await createContract({
 *   title: 'Provider Service Agreement',
 *   contractType: ContractType.PROVIDER_AGREEMENT,
 *   effectiveDate: new Date('2025-01-01'),
 *   templateId: 'tmpl_123',
 * }, 'user_456', configService);
 * ```
 */
async function createContract(data, userId, configService) {
    const logger = new common_1.Logger('ContractCreation');
    // Validate input
    const validated = exports.ContractCreateSchema.parse(data);
    // Generate contract number
    const contractNumber = await generateContractNumber(configService);
    // Create contract entity
    const contract = {
        id: crypto.randomUUID(),
        contractNumber,
        title: validated.title,
        description: validated.description,
        contractType: validated.contractType,
        status: ContractStatus.DRAFT,
        version: 1,
        effectiveDate: validated.effectiveDate,
        expirationDate: validated.expirationDate,
        autoRenew: validated.autoRenew,
        renewalNoticeDays: validated.renewalNoticeDays,
        terminationNoticeDays: validated.terminationNoticeDays,
        totalValue: validated.totalValue,
        currency: validated.currency || configService.get('contracts.defaultCurrency', 'USD'),
        parties: [],
        clauses: [],
        obligations: [],
        metadata: {
            tags: validated.metadata?.tags || [],
            category: validated.metadata?.category,
            department: validated.metadata?.department,
            riskLevel: validated.metadata?.riskLevel,
            complianceFlags: [],
            customFields: validated.metadata?.customFields || {},
            attachments: [],
            relatedContracts: [],
        },
        templateId: validated.templateId,
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    logger.log(`Contract ${contractNumber} created successfully`);
    return contract;
}
/**
 * Create contract from template with variable substitution
 *
 * @param templateId - Template ID
 * @param variables - Template variable values
 * @param userId - User creating contract
 * @param repository - Template repository
 * @returns Created contract
 *
 * @example
 * ```typescript
 * const contract = await createContractFromTemplate(
 *   'tmpl_provider_agreement',
 *   {
 *     providerName: 'Dr. John Smith',
 *     effectiveDate: new Date(),
 *     annualFee: 50000,
 *   },
 *   'user_123',
 *   templateRepo
 * );
 * ```
 */
async function createContractFromTemplate(templateId, variables, userId, repository) {
    const logger = new common_1.Logger('ContractTemplating');
    // Fetch template
    const template = await repository.findByPk(templateId);
    if (!template) {
        throw new common_1.NotFoundException(`Contract template ${templateId} not found`);
    }
    if (!template.isActive) {
        throw new common_1.BadRequestException('Contract template is not active');
    }
    // Validate required variables
    await validateTemplateVariables(template.variables, variables);
    // Substitute variables in content
    const content = substituteTemplateVariables(template.content, variables);
    // Create contract
    const contract = {
        title: variables.title || template.name,
        contractType: template.contractType,
        templateId: template.id,
        // Additional fields would be populated from variables
    };
    logger.log(`Contract created from template ${templateId}`);
    return contract;
}
/**
 * Validate template variables against requirements
 *
 * @param templateVars - Template variable definitions
 * @param providedVars - Provided variable values
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * await validateTemplateVariables(template.variables, userProvidedVars);
 * ```
 */
async function validateTemplateVariables(templateVars, providedVars) {
    for (const templateVar of templateVars) {
        if (templateVar.required && !(templateVar.name in providedVars)) {
            throw new common_1.BadRequestException(`Required variable '${templateVar.name}' is missing`);
        }
        if (templateVar.name in providedVars) {
            const value = providedVars[templateVar.name];
            // Type validation
            if (!validateVariableType(value, templateVar.type)) {
                throw new common_1.BadRequestException(`Variable '${templateVar.name}' must be of type ${templateVar.type}`);
            }
            // Custom validation
            if (templateVar.validation) {
                try {
                    const regex = new RegExp(templateVar.validation);
                    if (!regex.test(String(value))) {
                        throw new common_1.BadRequestException(`Variable '${templateVar.name}' does not match validation pattern`);
                    }
                }
                catch (error) {
                    throw new common_1.BadRequestException(`Invalid validation pattern for '${templateVar.name}'`);
                }
            }
        }
    }
}
/**
 * Validate variable type
 */
function validateVariableType(value, type) {
    switch (type) {
        case 'string':
            return typeof value === 'string';
        case 'number':
        case 'currency':
            return typeof value === 'number' && !isNaN(value);
        case 'date':
            return value instanceof Date || !isNaN(Date.parse(value));
        case 'boolean':
            return typeof value === 'boolean';
        default:
            return true;
    }
}
/**
 * Substitute variables in template content
 *
 * @param content - Template content
 * @param variables - Variable values
 * @returns Content with substituted variables
 *
 * @example
 * ```typescript
 * const result = substituteTemplateVariables(
 *   'Provider: {{providerName}}, Fee: {{annualFee}}',
 *   { providerName: 'Dr. Smith', annualFee: 50000 }
 * );
 * // 'Provider: Dr. Smith, Fee: 50000'
 * ```
 */
function substituteTemplateVariables(content, variables) {
    let result = content;
    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
        result = result.replace(regex, String(value));
    }
    return result;
}
// ============================================================================
// CLAUSE LIBRARY MANAGEMENT
// ============================================================================
/**
 * Create clause in library
 *
 * @param data - Clause creation data
 * @param userId - User creating clause
 * @returns Created clause
 *
 * @example
 * ```typescript
 * const clause = await createClause({
 *   category: ClauseCategory.PAYMENT_TERMS,
 *   title: 'Standard Payment Terms',
 *   content: 'Payment due within 30 days...',
 * }, 'user_123');
 * ```
 */
async function createClause(data, userId) {
    const validated = exports.ClauseCreateSchema.parse(data);
    const clause = {
        id: crypto.randomUUID(),
        category: validated.category,
        title: validated.title,
        content: validated.content,
        order: validated.order,
        required: validated.required,
        editable: validated.editable,
        variables: validated.variables,
        metadata: validated.metadata,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return clause;
}
/**
 * Add clause to contract
 *
 * @param contractId - Contract ID
 * @param clauseId - Clause ID from library
 * @param order - Clause order in contract
 * @param repository - Clause repository
 * @returns Added clause
 *
 * @example
 * ```typescript
 * const clause = await addClauseToContract(
 *   'contract_123',
 *   'clause_456',
 *   2,
 *   clauseRepo
 * );
 * ```
 */
async function addClauseToContract(contractId, clauseId, order, repository) {
    const logger = new common_1.Logger('ClauseManagement');
    // Fetch library clause
    const libraryClause = await repository.findByPk(clauseId);
    if (!libraryClause) {
        throw new common_1.NotFoundException(`Clause ${clauseId} not found`);
    }
    // Create contract-specific clause
    const contractClause = {
        ...libraryClause.toJSON(),
        id: crypto.randomUUID(),
        contractId,
        libraryClauseId: clauseId,
        order,
    };
    logger.log(`Clause ${clauseId} added to contract ${contractId}`);
    return contractClause;
}
/**
 * Search clauses by category and keywords
 *
 * @param category - Clause category
 * @param keywords - Search keywords
 * @param repository - Clause repository
 * @returns Matching clauses
 *
 * @example
 * ```typescript
 * const clauses = await searchClauses(
 *   ClauseCategory.PAYMENT_TERMS,
 *   'net 30',
 *   clauseRepo
 * );
 * ```
 */
async function searchClauses(category, keywords, repository) {
    const where = {};
    if (category) {
        where.category = category;
    }
    if (keywords) {
        where[sequelize_1.Op.or] = [
            { title: { [sequelize_1.Op.iLike]: `%${keywords}%` } },
            { content: { [sequelize_1.Op.iLike]: `%${keywords}%` } },
        ];
    }
    const clauses = await repository.findAll({ where });
    return clauses.map((c) => c.toJSON());
}
/**
 * Detect conflicting clauses in contract
 *
 * @param clauses - Contract clauses
 * @returns Array of potential conflicts
 *
 * @example
 * ```typescript
 * const conflicts = detectClauseConflicts(contract.clauses);
 * if (conflicts.length > 0) {
 *   console.warn('Clause conflicts detected:', conflicts);
 * }
 * ```
 */
function detectClauseConflicts(clauses) {
    const conflicts = [];
    // Check for duplicate categories where only one should exist
    const singletonCategories = [
        ClauseCategory.GOVERNING_LAW,
        ClauseCategory.DISPUTE_RESOLUTION,
    ];
    for (const category of singletonCategories) {
        const categoryclauses = clauses.filter(c => c.category === category);
        if (categoryClauses.length > 1) {
            for (let i = 0; i < categoryClauses.length - 1; i++) {
                conflicts.push({
                    clause1: categoryClauses[i].id,
                    clause2: categoryClauses[i + 1].id,
                    reason: `Multiple ${category} clauses found - only one should exist`,
                });
            }
        }
    }
    return conflicts;
}
// ============================================================================
// CONTRACT VERSIONING & COMPARISON
// ============================================================================
/**
 * Create new version of contract
 *
 * @param contractId - Contract ID
 * @param content - Updated contract content
 * @param changes - Description of changes
 * @param userId - User making changes
 * @returns Contract version
 *
 * @example
 * ```typescript
 * const version = await createContractVersion(
 *   'contract_123',
 *   updatedContent,
 *   'Updated payment terms',
 *   'user_456'
 * );
 * ```
 */
async function createContractVersion(contractId, content, changes, userId) {
    const checksum = crypto.createHash('sha256').update(content).digest('hex');
    const version = {
        id: crypto.randomUUID(),
        contractId,
        version: 0, // Should be incremented from latest version
        action: VersionAction.UPDATED,
        content,
        changes,
        checksum,
        createdBy: userId,
        createdAt: new Date(),
        metadata: {},
    };
    return version;
}
/**
 * Get version history for contract
 *
 * @param contractId - Contract ID
 * @param repository - Version repository
 * @returns Array of versions
 *
 * @example
 * ```typescript
 * const history = await getContractVersionHistory('contract_123', versionRepo);
 * ```
 */
async function getContractVersionHistory(contractId, repository) {
    const versions = await repository.findAll({
        where: { contractId },
        order: [['version', 'DESC']],
    });
    return versions.map((v) => v.toJSON());
}
/**
 * Compare two contract versions
 *
 * @param version1 - First version
 * @param version2 - Second version
 * @returns Comparison result with differences
 *
 * @example
 * ```typescript
 * const comparison = await compareContractVersions(v1, v2);
 * console.log(`Similarity: ${comparison.similarity}%`);
 * ```
 */
async function compareContractVersions(version1, version2) {
    const logger = new common_1.Logger('ContractComparison');
    // Calculate differences
    const differences = calculateContentDifferences(version1.content, version2.content);
    // Calculate similarity score
    const similarity = calculateSimilarity(version1.content, version2.content);
    const comparison = {
        contractId1: version1.contractId,
        contractId2: version2.contractId,
        version1: version1.version,
        version2: version2.version,
        differences,
        similarity,
        comparedAt: new Date(),
    };
    logger.log(`Compared versions ${version1.version} and ${version2.version}, similarity: ${similarity}%`);
    return comparison;
}
/**
 * Calculate content differences between two texts
 */
function calculateContentDifferences(content1, content2) {
    const differences = [];
    // Simple line-by-line comparison
    // In production, would use a proper diff library like 'diff'
    const lines1 = content1.split('\n');
    const lines2 = content2.split('\n');
    const maxLines = Math.max(lines1.length, lines2.length);
    for (let i = 0; i < maxLines; i++) {
        const line1 = lines1[i] || '';
        const line2 = lines2[i] || '';
        if (line1 !== line2) {
            if (!line1) {
                differences.push({
                    section: `Line ${i + 1}`,
                    type: 'added',
                    content2: line2,
                    severity: 'minor',
                });
            }
            else if (!line2) {
                differences.push({
                    section: `Line ${i + 1}`,
                    type: 'removed',
                    content1: line1,
                    severity: 'minor',
                });
            }
            else {
                differences.push({
                    section: `Line ${i + 1}`,
                    type: 'modified',
                    content1: line1,
                    content2: line2,
                    severity: determineDifferenceSeverity(line1, line2),
                });
            }
        }
    }
    return differences;
}
/**
 * Determine severity of a difference
 */
function determineDifferenceSeverity(content1, content2) {
    const keywords = {
        major: ['payment', 'liability', 'termination', 'indemnification', 'shall', 'must'],
        moderate: ['may', 'should', 'responsibility', 'obligation'],
    };
    const text = (content1 + ' ' + content2).toLowerCase();
    if (keywords.major.some(k => text.includes(k))) {
        return 'major';
    }
    if (keywords.moderate.some(k => text.includes(k))) {
        return 'moderate';
    }
    return 'minor';
}
/**
 * Calculate similarity percentage between two texts
 */
function calculateSimilarity(content1, content2) {
    const words1 = content1.toLowerCase().split(/\s+/);
    const words2 = content2.toLowerCase().split(/\s+/);
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return Math.round((intersection.size / union.size) * 100);
}
/**
 * Restore contract to specific version
 *
 * @param contractId - Contract ID
 * @param versionNumber - Version number to restore
 * @param userId - User performing restoration
 * @param repository - Version repository
 *
 * @example
 * ```typescript
 * await restoreContractVersion('contract_123', 3, 'user_456', versionRepo);
 * ```
 */
async function restoreContractVersion(contractId, versionNumber, userId, repository) {
    const logger = new common_1.Logger('ContractVersioning');
    const version = await repository.findOne({
        where: { contractId, version: versionNumber },
    });
    if (!version) {
        throw new common_1.NotFoundException(`Version ${versionNumber} not found for contract ${contractId}`);
    }
    logger.log(`Restoring contract ${contractId} to version ${versionNumber}`);
    // Implementation would:
    // 1. Create new version with action=RESTORED
    // 2. Update current contract with restored content
    // 3. Increment version number
}
// ============================================================================
// OBLIGATION TRACKING & DEADLINES
// ============================================================================
/**
 * Create contract obligation
 *
 * @param contractId - Contract ID
 * @param data - Obligation creation data
 * @param userId - User creating obligation
 * @returns Created obligation
 *
 * @example
 * ```typescript
 * const obligation = await createObligation('contract_123', {
 *   title: 'Monthly Report Submission',
 *   description: 'Submit monthly performance report',
 *   responsibleParty: PartyRole.PROVIDER,
 *   dueDate: new Date('2025-02-01'),
 *   priority: ObligationPriority.HIGH,
 *   recurring: true,
 *   recurrencePattern: 'monthly',
 * }, 'user_456');
 * ```
 */
async function createObligation(contractId, data, userId) {
    const validated = exports.ObligationCreateSchema.parse(data);
    const obligation = {
        id: crypto.randomUUID(),
        contractId,
        title: validated.title,
        description: validated.description,
        responsibleParty: validated.responsibleParty,
        assignedTo: validated.assignedTo,
        dueDate: validated.dueDate,
        status: ObligationStatus.PENDING,
        priority: validated.priority,
        recurring: validated.recurring,
        recurrencePattern: validated.recurrencePattern,
        reminderDays: validated.reminderDays,
        dependencies: validated.dependencies,
        metadata: validated.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return obligation;
}
/**
 * Get upcoming obligations within date range
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @param repository - Obligation repository
 * @returns Array of obligations
 *
 * @example
 * ```typescript
 * const upcoming = await getUpcomingObligations(
 *   new Date(),
 *   new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
 *   obligationRepo
 * );
 * ```
 */
async function getUpcomingObligations(startDate, endDate, repository) {
    const obligations = await repository.findAll({
        where: {
            dueDate: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
            status: {
                [sequelize_1.Op.notIn]: [ObligationStatus.COMPLETED, ObligationStatus.WAIVED],
            },
        },
        order: [['dueDate', 'ASC']],
    });
    return obligations.map((o) => o.toJSON());
}
/**
 * Get overdue obligations
 *
 * @param repository - Obligation repository
 * @returns Array of overdue obligations
 *
 * @example
 * ```typescript
 * const overdue = await getOverdueObligations(obligationRepo);
 * ```
 */
async function getOverdueObligations(repository) {
    const now = new Date();
    const obligations = await repository.findAll({
        where: {
            dueDate: { [sequelize_1.Op.lt]: now },
            status: {
                [sequelize_1.Op.notIn]: [ObligationStatus.COMPLETED, ObligationStatus.WAIVED],
            },
        },
        order: [['dueDate', 'ASC']],
    });
    // Update status to overdue
    for (const obligation of obligations) {
        await repository.update({ status: ObligationStatus.OVERDUE }, { where: { id: obligation.id } });
    }
    return obligations.map((o) => o.toJSON());
}
/**
 * Complete obligation
 *
 * @param obligationId - Obligation ID
 * @param userId - User completing obligation
 * @param repository - Obligation repository
 *
 * @example
 * ```typescript
 * await completeObligation('obligation_123', 'user_456', obligationRepo);
 * ```
 */
async function completeObligation(obligationId, userId, repository) {
    const logger = new common_1.Logger('ObligationTracking');
    const obligation = await repository.findByPk(obligationId);
    if (!obligation) {
        throw new common_1.NotFoundException(`Obligation ${obligationId} not found`);
    }
    await repository.update({
        status: ObligationStatus.COMPLETED,
        completedDate: new Date(),
    }, { where: { id: obligationId } });
    logger.log(`Obligation ${obligationId} marked as completed by ${userId}`);
    // If recurring, create next occurrence
    if (obligation.recurring && obligation.recurrencePattern) {
        await createRecurringObligation(obligation);
    }
}
/**
 * Create next occurrence of recurring obligation
 */
async function createRecurringObligation(obligation) {
    const nextDueDate = calculateNextDueDate(obligation.dueDate, obligation.recurrencePattern);
    const nextObligation = {
        ...obligation.toJSON(),
        id: crypto.randomUUID(),
        dueDate: nextDueDate,
        status: ObligationStatus.PENDING,
        completedDate: undefined,
    };
    // Would save to repository
}
/**
 * Calculate next due date for recurring obligation
 */
function calculateNextDueDate(currentDate, pattern) {
    const next = new Date(currentDate);
    switch (pattern.toLowerCase()) {
        case 'daily':
            next.setDate(next.getDate() + 1);
            break;
        case 'weekly':
            next.setDate(next.getDate() + 7);
            break;
        case 'monthly':
            next.setMonth(next.getMonth() + 1);
            break;
        case 'quarterly':
            next.setMonth(next.getMonth() + 3);
            break;
        case 'annually':
            next.setFullYear(next.getFullYear() + 1);
            break;
        default:
            next.setMonth(next.getMonth() + 1);
    }
    return next;
}
/**
 * Send obligation reminders for upcoming deadlines
 *
 * @param daysAhead - Days to look ahead
 * @param repository - Obligation repository
 * @returns Number of reminders sent
 *
 * @example
 * ```typescript
 * const count = await sendObligationReminders(7, obligationRepo);
 * ```
 */
async function sendObligationReminders(daysAhead, repository) {
    const logger = new common_1.Logger('ObligationReminders');
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);
    const obligations = await repository.findAll({
        where: {
            dueDate: {
                [sequelize_1.Op.between]: [new Date(), targetDate],
            },
            status: ObligationStatus.PENDING,
        },
    });
    let remindersSent = 0;
    for (const obligation of obligations) {
        const daysUntilDue = Math.ceil((obligation.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (obligation.reminderDays.includes(daysUntilDue)) {
            // Send reminder (would integrate with email service)
            logger.log(`Reminder sent for obligation ${obligation.id}, due in ${daysUntilDue} days`);
            remindersSent++;
        }
    }
    return remindersSent;
}
// ============================================================================
// CONTRACT SEARCH & RETRIEVAL
// ============================================================================
/**
 * Search contracts with filters
 *
 * @param filters - Search filters
 * @param repository - Contract repository
 * @returns Matching contracts
 *
 * @example
 * ```typescript
 * const contracts = await searchContracts({
 *   query: 'provider agreement',
 *   contractTypes: [ContractType.PROVIDER_AGREEMENT],
 *   statuses: [ContractStatus.ACTIVE],
 *   effectiveDateFrom: new Date('2025-01-01'),
 * }, contractRepo);
 * ```
 */
async function searchContracts(filters, repository) {
    const where = {};
    // Full-text search on title and description
    if (filters.query) {
        where[sequelize_1.Op.or] = [
            { title: { [sequelize_1.Op.iLike]: `%${filters.query}%` } },
            { description: { [sequelize_1.Op.iLike]: `%${filters.query}%` } },
        ];
    }
    // Contract type filter
    if (filters.contractTypes?.length) {
        where.contractType = { [sequelize_1.Op.in]: filters.contractTypes };
    }
    // Status filter
    if (filters.statuses?.length) {
        where.status = { [sequelize_1.Op.in]: filters.statuses };
    }
    // Date range filters
    if (filters.effectiveDateFrom) {
        where.effectiveDate = { [sequelize_1.Op.gte]: filters.effectiveDateFrom };
    }
    if (filters.effectiveDateTo) {
        where.effectiveDate = { ...where.effectiveDate, [sequelize_1.Op.lte]: filters.effectiveDateTo };
    }
    if (filters.expirationDateFrom) {
        where.expirationDate = { [sequelize_1.Op.gte]: filters.expirationDateFrom };
    }
    if (filters.expirationDateTo) {
        where.expirationDate = { ...where.expirationDate, [sequelize_1.Op.lte]: filters.expirationDateTo };
    }
    // Value range
    if (filters.minValue !== undefined) {
        where.totalValue = { [sequelize_1.Op.gte]: filters.minValue };
    }
    if (filters.maxValue !== undefined) {
        where.totalValue = { ...where.totalValue, [sequelize_1.Op.lte]: filters.maxValue };
    }
    // Tenant filter
    if (filters.tenantId) {
        where.tenantId = filters.tenantId;
    }
    const contracts = await repository.findAll({
        where,
        include: ['parties', 'clauses', 'obligations'],
        order: [['createdAt', 'DESC']],
    });
    return contracts.map((c) => c.toJSON());
}
/**
 * Get contract by contract number
 *
 * @param contractNumber - Contract number
 * @param repository - Contract repository
 * @returns Contract
 *
 * @example
 * ```typescript
 * const contract = await getContractByNumber('CTR-2025-001234', contractRepo);
 * ```
 */
async function getContractByNumber(contractNumber, repository) {
    const contract = await repository.findOne({
        where: { contractNumber },
        include: ['parties', 'clauses', 'obligations'],
    });
    if (!contract) {
        throw new common_1.NotFoundException(`Contract ${contractNumber} not found`);
    }
    return contract.toJSON();
}
/**
 * Get contracts expiring soon
 *
 * @param daysAhead - Days to look ahead
 * @param repository - Contract repository
 * @returns Expiring contracts
 *
 * @example
 * ```typescript
 * const expiring = await getContractsExpiringSoon(30, contractRepo);
 * ```
 */
async function getContractsExpiringSoon(daysAhead, repository) {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    const contracts = await repository.findAll({
        where: {
            expirationDate: {
                [sequelize_1.Op.between]: [now, futureDate],
            },
            status: ContractStatus.ACTIVE,
            autoRenew: false,
        },
        order: [['expirationDate', 'ASC']],
    });
    return contracts.map((c) => c.toJSON());
}
// ============================================================================
// NESTJS SERVICE
// ============================================================================
/**
 * Contract Management Service
 * NestJS service for contract operations with dependency injection
 */
let ContractManagementService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ContractManagementService = _classThis = class {
        constructor(contractRepo, clauseRepo, obligationRepo, versionRepo, configService) {
            this.contractRepo = contractRepo;
            this.clauseRepo = clauseRepo;
            this.obligationRepo = obligationRepo;
            this.versionRepo = versionRepo;
            this.configService = configService;
            this.logger = new common_1.Logger(ContractManagementService.name);
        }
        /**
         * Create new contract
         */
        async create(data, userId) {
            this.logger.log(`Creating contract: ${data.title}`);
            return createContract(data, userId, this.configService);
        }
        /**
         * Get contract by ID
         */
        async findById(id) {
            const contract = await this.contractRepo.findByPk(id, {
                include: [
                    { model: ContractPartyModel, as: 'parties' },
                    { model: ContractClauseModel, as: 'clauses' },
                    { model: ContractObligationModel, as: 'obligations' },
                ],
            });
            if (!contract) {
                throw new common_1.NotFoundException(`Contract ${id} not found`);
            }
            return contract.toJSON();
        }
        /**
         * Search contracts
         */
        async search(filters) {
            return searchContracts(filters, this.contractRepo);
        }
        /**
         * Update contract status
         */
        async updateStatus(id, status, userId) {
            await this.contractRepo.update({ status, updatedBy: userId }, { where: { id } });
            this.logger.log(`Contract ${id} status updated to ${status}`);
        }
        /**
         * Add clause to contract
         */
        async addClause(contractId, clauseId, order) {
            return addClauseToContract(contractId, clauseId, order, this.clauseRepo);
        }
        /**
         * Create obligation
         */
        async createObligation(contractId, data, userId) {
            return createObligation(contractId, data, userId);
        }
        /**
         * Get version history
         */
        async getVersionHistory(contractId) {
            return getContractVersionHistory(contractId, this.versionRepo);
        }
    };
    __setFunctionName(_classThis, "ContractManagementService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ContractManagementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ContractManagementService = _classThis;
})();
exports.ContractManagementService = ContractManagementService;
// ============================================================================
// SWAGGER API DOCUMENTATION
// ============================================================================
/**
 * Contract DTO for API documentation
 */
let ContractDto = (() => {
    var _a;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _contractNumber_decorators;
    let _contractNumber_initializers = [];
    let _contractNumber_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _contractType_decorators;
    let _contractType_initializers = [];
    let _contractType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _autoRenew_decorators;
    let _autoRenew_initializers = [];
    let _autoRenew_extraInitializers = [];
    let _totalValue_decorators;
    let _totalValue_initializers = [];
    let _totalValue_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    return _a = class ContractDto {
            constructor() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.contractNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _contractNumber_initializers, void 0));
                this.title = (__runInitializers(this, _contractNumber_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.contractType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _contractType_initializers, void 0));
                this.status = (__runInitializers(this, _contractType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.version = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _version_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.expirationDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
                this.autoRenew = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _autoRenew_initializers, void 0));
                this.totalValue = (__runInitializers(this, _autoRenew_extraInitializers), __runInitializers(this, _totalValue_initializers, void 0));
                this.currency = (__runInitializers(this, _totalValue_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                __runInitializers(this, _currency_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({ example: 'uuid', description: 'Contract ID' })];
            _contractNumber_decorators = [(0, swagger_1.ApiProperty)({ example: 'CTR-2025-001234', description: 'Contract number' })];
            _title_decorators = [(0, swagger_1.ApiProperty)({ example: 'Provider Service Agreement', description: 'Contract title' })];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Contract description' })];
            _contractType_decorators = [(0, swagger_1.ApiProperty)({ enum: ContractType, description: 'Contract type' })];
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: ContractStatus, description: 'Contract status' })];
            _version_decorators = [(0, swagger_1.ApiProperty)({ example: 1, description: 'Version number' })];
            _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ type: Date, description: 'Effective date' })];
            _expirationDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: Date, description: 'Expiration date' })];
            _autoRenew_decorators = [(0, swagger_1.ApiProperty)({ example: false, description: 'Auto-renewal flag' })];
            _totalValue_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 50000, description: 'Total contract value' })];
            _currency_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'USD', description: 'Currency code' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _contractNumber_decorators, { kind: "field", name: "contractNumber", static: false, private: false, access: { has: obj => "contractNumber" in obj, get: obj => obj.contractNumber, set: (obj, value) => { obj.contractNumber = value; } }, metadata: _metadata }, _contractNumber_initializers, _contractNumber_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _contractType_decorators, { kind: "field", name: "contractType", static: false, private: false, access: { has: obj => "contractType" in obj, get: obj => obj.contractType, set: (obj, value) => { obj.contractType = value; } }, metadata: _metadata }, _contractType_initializers, _contractType_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
            __esDecorate(null, null, _autoRenew_decorators, { kind: "field", name: "autoRenew", static: false, private: false, access: { has: obj => "autoRenew" in obj, get: obj => obj.autoRenew, set: (obj, value) => { obj.autoRenew = value; } }, metadata: _metadata }, _autoRenew_initializers, _autoRenew_extraInitializers);
            __esDecorate(null, null, _totalValue_decorators, { kind: "field", name: "totalValue", static: false, private: false, access: { has: obj => "totalValue" in obj, get: obj => obj.totalValue, set: (obj, value) => { obj.totalValue = value; } }, metadata: _metadata }, _totalValue_initializers, _totalValue_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ContractDto = ContractDto;
/**
 * Create Contract DTO
 */
let CreateContractDto = (() => {
    var _a;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _contractType_decorators;
    let _contractType_initializers = [];
    let _contractType_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _autoRenew_decorators;
    let _autoRenew_initializers = [];
    let _autoRenew_extraInitializers = [];
    let _totalValue_decorators;
    let _totalValue_initializers = [];
    let _totalValue_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _templateId_decorators;
    let _templateId_initializers = [];
    let _templateId_extraInitializers = [];
    return _a = class CreateContractDto {
            constructor() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.contractType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _contractType_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _contractType_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.expirationDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
                this.autoRenew = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _autoRenew_initializers, void 0));
                this.totalValue = (__runInitializers(this, _autoRenew_extraInitializers), __runInitializers(this, _totalValue_initializers, void 0));
                this.currency = (__runInitializers(this, _totalValue_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                this.templateId = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _templateId_initializers, void 0));
                __runInitializers(this, _templateId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, swagger_1.ApiProperty)({ example: 'Provider Service Agreement' })];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _contractType_decorators = [(0, swagger_1.ApiProperty)({ enum: ContractType })];
            _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ type: Date })];
            _expirationDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: Date })];
            _autoRenew_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: false })];
            _totalValue_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _currency_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'USD' })];
            _templateId_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _contractType_decorators, { kind: "field", name: "contractType", static: false, private: false, access: { has: obj => "contractType" in obj, get: obj => obj.contractType, set: (obj, value) => { obj.contractType = value; } }, metadata: _metadata }, _contractType_initializers, _contractType_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
            __esDecorate(null, null, _autoRenew_decorators, { kind: "field", name: "autoRenew", static: false, private: false, access: { has: obj => "autoRenew" in obj, get: obj => obj.autoRenew, set: (obj, value) => { obj.autoRenew = value; } }, metadata: _metadata }, _autoRenew_initializers, _autoRenew_extraInitializers);
            __esDecorate(null, null, _totalValue_decorators, { kind: "field", name: "totalValue", static: false, private: false, access: { has: obj => "totalValue" in obj, get: obj => obj.totalValue, set: (obj, value) => { obj.totalValue = value; } }, metadata: _metadata }, _totalValue_initializers, _totalValue_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _templateId_decorators, { kind: "field", name: "templateId", static: false, private: false, access: { has: obj => "templateId" in obj, get: obj => obj.templateId, set: (obj, value) => { obj.templateId = value; } }, metadata: _metadata }, _templateId_initializers, _templateId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateContractDto = CreateContractDto;
/**
 * Obligation DTO
 */
let ObligationDto = (() => {
    var _a;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _contractId_decorators;
    let _contractId_initializers = [];
    let _contractId_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _responsibleParty_decorators;
    let _responsibleParty_initializers = [];
    let _responsibleParty_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _recurring_decorators;
    let _recurring_initializers = [];
    let _recurring_extraInitializers = [];
    return _a = class ObligationDto {
            constructor() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.contractId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _contractId_initializers, void 0));
                this.title = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.responsibleParty = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _responsibleParty_initializers, void 0));
                this.dueDate = (__runInitializers(this, _responsibleParty_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
                this.status = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.priority = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.recurring = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _recurring_initializers, void 0));
                __runInitializers(this, _recurring_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _contractId_decorators = [(0, swagger_1.ApiProperty)()];
            _title_decorators = [(0, swagger_1.ApiProperty)({ example: 'Submit Monthly Report' })];
            _description_decorators = [(0, swagger_1.ApiProperty)()];
            _responsibleParty_decorators = [(0, swagger_1.ApiProperty)({ enum: PartyRole })];
            _dueDate_decorators = [(0, swagger_1.ApiProperty)({ type: Date })];
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: ObligationStatus })];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ enum: ObligationPriority })];
            _recurring_decorators = [(0, swagger_1.ApiProperty)({ default: false })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _responsibleParty_decorators, { kind: "field", name: "responsibleParty", static: false, private: false, access: { has: obj => "responsibleParty" in obj, get: obj => obj.responsibleParty, set: (obj, value) => { obj.responsibleParty = value; } }, metadata: _metadata }, _responsibleParty_initializers, _responsibleParty_extraInitializers);
            __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _recurring_decorators, { kind: "field", name: "recurring", static: false, private: false, access: { has: obj => "recurring" in obj, get: obj => obj.recurring, set: (obj, value) => { obj.recurring = value; } }, metadata: _metadata }, _recurring_initializers, _recurring_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ObligationDto = ObligationDto;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Configuration
    registerContractConfig,
    createContractConfigModule,
    // Contract Creation & Templating
    generateContractNumber,
    createContract,
    createContractFromTemplate,
    validateTemplateVariables,
    substituteTemplateVariables,
    // Clause Management
    createClause,
    addClauseToContract,
    searchClauses,
    detectClauseConflicts,
    // Versioning & Comparison
    createContractVersion,
    getContractVersionHistory,
    compareContractVersions,
    restoreContractVersion,
    // Obligation Tracking
    createObligation,
    getUpcomingObligations,
    getOverdueObligations,
    completeObligation,
    sendObligationReminders,
    // Search & Retrieval
    searchContracts,
    getContractByNumber,
    getContractsExpiringSoon,
    // Service
    ContractManagementService,
};
//# sourceMappingURL=contract-management-kit.js.map