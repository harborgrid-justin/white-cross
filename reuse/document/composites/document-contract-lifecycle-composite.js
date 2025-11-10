"use strict";
/**
 * LOC: DOCCONTLIFE001
 * File: /reuse/document/composites/document-contract-lifecycle-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - ../document-contract-management-kit
 *   - ../document-workflow-kit
 *   - ../document-lifecycle-management-kit
 *   - ../document-automation-kit
 *   - ../document-analytics-kit
 *
 * DOWNSTREAM (imported by):
 *   - Contract management services
 *   - Lifecycle management modules
 *   - Renewal automation engines
 *   - Obligation tracking systems
 *   - Contract analytics dashboards
 *   - Healthcare contract management systems
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
exports.generateContractSummary = exports.calculateContractPerformance = exports.searchContractsByParty = exports.filterContractsByType = exports.filterContractsByStatus = exports.exportContractToJSON = exports.validateContractConfiguration = exports.generateContractAnalytics = exports.calculateAdjustedContractValue = exports.terminateContract = exports.scheduleRenewalNotifications = exports.createRenewalNotification = exports.applyAmendmentToContract = exports.createContractAmendment = exports.isContractExpiringSoon = exports.calculateDaysUntilExpiration = exports.convertPeriodToMilliseconds = exports.renewContract = exports.isEligibleForRenewal = exports.createRenewalTerms = exports.completeMilestone = exports.addMilestoneToContract = exports.createMilestone = exports.getOverdueObligations = exports.completeObligation = exports.addObligationToContract = exports.createObligation = exports.activateContract = exports.transitionLifecycleStage = exports.createContractParty = exports.addPartyToContract = exports.createContract = exports.RenewalNotificationModel = exports.ContractAmendmentModel = exports.ContractModel = exports.NotificationStatus = exports.NotificationType = exports.AmendmentStatus = exports.AdjustmentType = exports.PeriodUnit = exports.MilestoneStatus = exports.ObligationType = exports.ObligationPriority = exports.ObligationStatus = exports.LifecycleStage = exports.ContractStatus = exports.PaymentFrequency = exports.OrganizationType = exports.PartyRole = exports.ContractType = void 0;
exports.ContractLifecycleService = exports.cloneContract = void 0;
/**
 * File: /reuse/document/composites/document-contract-lifecycle-composite.ts
 * Locator: WC-DOC-CONTRACT-LIFECYCLE-001
 * Purpose: Comprehensive Document Contract Lifecycle Toolkit - Production-ready contract management and lifecycle operations
 *
 * Upstream: Composed from document-contract-management-kit, document-workflow-kit, document-lifecycle-management-kit, document-automation-kit, document-analytics-kit
 * Downstream: ../backend/*, Contract management, Lifecycle tracking, Renewal automation, Obligation management, Analytics
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto
 * Exports: 47 utility functions for contract lifecycle, renewals, obligations, approvals, analytics, automation
 *
 * LLM Context: Enterprise-grade contract lifecycle management toolkit for White Cross healthcare platform.
 * Provides comprehensive contract management capabilities including contract creation and configuration,
 * lifecycle stage tracking, renewal management and automation, obligation monitoring and alerts, approval
 * workflows, milestone tracking, amendment management, expiration handling, and HIPAA-compliant audit
 * trails for all contract activities. Composes functions from multiple document kits to provide unified
 * contract operations for provider agreements, vendor contracts, payer agreements, service contracts,
 * and healthcare partnership agreements.
 */
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
/**
 * Contract types
 *
 * Standard contract classifications for healthcare and enterprise operations.
 * Each type has specific lifecycle requirements and compliance obligations.
 *
 * @property {string} PROVIDER_AGREEMENT - Healthcare provider service agreements
 * @property {string} VENDOR_CONTRACT - Vendor and supplier contracts
 * @property {string} PAYER_AGREEMENT - Insurance payer and reimbursement agreements
 * @property {string} SERVICE_LEVEL_AGREEMENT - SLA contracts with performance metrics
 * @property {string} EMPLOYMENT_CONTRACT - Employee and contractor agreements
 * @property {string} PARTNERSHIP_AGREEMENT - Strategic partnership contracts
 * @property {string} LICENSE_AGREEMENT - Software and IP licensing agreements
 * @property {string} LEASE_AGREEMENT - Equipment and facility leases
 * @property {string} CONFIDENTIALITY_AGREEMENT - NDA and confidentiality agreements
 * @property {string} CUSTOM - Custom contract types
 */
var ContractType;
(function (ContractType) {
    ContractType["PROVIDER_AGREEMENT"] = "PROVIDER_AGREEMENT";
    ContractType["VENDOR_CONTRACT"] = "VENDOR_CONTRACT";
    ContractType["PAYER_AGREEMENT"] = "PAYER_AGREEMENT";
    ContractType["SERVICE_LEVEL_AGREEMENT"] = "SERVICE_LEVEL_AGREEMENT";
    ContractType["EMPLOYMENT_CONTRACT"] = "EMPLOYMENT_CONTRACT";
    ContractType["PARTNERSHIP_AGREEMENT"] = "PARTNERSHIP_AGREEMENT";
    ContractType["LICENSE_AGREEMENT"] = "LICENSE_AGREEMENT";
    ContractType["LEASE_AGREEMENT"] = "LEASE_AGREEMENT";
    ContractType["CONFIDENTIALITY_AGREEMENT"] = "CONFIDENTIALITY_AGREEMENT";
    ContractType["CUSTOM"] = "CUSTOM";
})(ContractType || (exports.ContractType = ContractType = {}));
/**
 * Party roles in contract
 */
var PartyRole;
(function (PartyRole) {
    PartyRole["CLIENT"] = "CLIENT";
    PartyRole["PROVIDER"] = "PROVIDER";
    PartyRole["VENDOR"] = "VENDOR";
    PartyRole["PARTNER"] = "PARTNER";
    PartyRole["EMPLOYER"] = "EMPLOYER";
    PartyRole["EMPLOYEE"] = "EMPLOYEE";
    PartyRole["LICENSOR"] = "LICENSOR";
    PartyRole["LICENSEE"] = "LICENSEE";
    PartyRole["LESSOR"] = "LESSOR";
    PartyRole["LESSEE"] = "LESSEE";
})(PartyRole || (exports.PartyRole = PartyRole = {}));
/**
 * Organization types
 */
var OrganizationType;
(function (OrganizationType) {
    OrganizationType["HOSPITAL"] = "HOSPITAL";
    OrganizationType["CLINIC"] = "CLINIC";
    OrganizationType["INSURANCE_COMPANY"] = "INSURANCE_COMPANY";
    OrganizationType["PHARMACEUTICAL"] = "PHARMACEUTICAL";
    OrganizationType["MEDICAL_DEVICE"] = "MEDICAL_DEVICE";
    OrganizationType["LABORATORY"] = "LABORATORY";
    OrganizationType["INDIVIDUAL"] = "INDIVIDUAL";
    OrganizationType["GOVERNMENT"] = "GOVERNMENT";
    OrganizationType["NON_PROFIT"] = "NON_PROFIT";
    OrganizationType["CORPORATION"] = "CORPORATION";
})(OrganizationType || (exports.OrganizationType = OrganizationType = {}));
/**
 * Payment frequency
 */
var PaymentFrequency;
(function (PaymentFrequency) {
    PaymentFrequency["ONE_TIME"] = "ONE_TIME";
    PaymentFrequency["MONTHLY"] = "MONTHLY";
    PaymentFrequency["QUARTERLY"] = "QUARTERLY";
    PaymentFrequency["ANNUALLY"] = "ANNUALLY";
    PaymentFrequency["CUSTOM"] = "CUSTOM";
})(PaymentFrequency || (exports.PaymentFrequency = PaymentFrequency = {}));
/**
 * Contract status
 *
 * Lifecycle status values for contract management.
 * Determines available actions and compliance requirements.
 *
 * @property {string} DRAFT - Contract in draft state, not yet finalized
 * @property {string} PENDING_APPROVAL - Awaiting approval from stakeholders
 * @property {string} ACTIVE - Contract is currently in effect and enforceable
 * @property {string} SUSPENDED - Contract temporarily suspended
 * @property {string} EXPIRED - Contract has reached end date and expired
 * @property {string} TERMINATED - Contract terminated before expiration
 * @property {string} RENEWED - Contract successfully renewed
 * @property {string} AMENDED - Contract has been amended
 */
var ContractStatus;
(function (ContractStatus) {
    ContractStatus["DRAFT"] = "DRAFT";
    ContractStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    ContractStatus["ACTIVE"] = "ACTIVE";
    ContractStatus["SUSPENDED"] = "SUSPENDED";
    ContractStatus["EXPIRED"] = "EXPIRED";
    ContractStatus["TERMINATED"] = "TERMINATED";
    ContractStatus["RENEWED"] = "RENEWED";
    ContractStatus["AMENDED"] = "AMENDED";
})(ContractStatus || (exports.ContractStatus = ContractStatus = {}));
/**
 * Contract lifecycle stages
 *
 * Standardized contract lifecycle phases for workflow management.
 * Each stage has specific activities, approval gates, and metrics.
 *
 * @property {string} INITIATION - Initial contract request and scoping
 * @property {string} NEGOTIATION - Terms negotiation and redlining
 * @property {string} APPROVAL - Approval workflow and sign-off
 * @property {string} EXECUTION - Contract signing and execution
 * @property {string} PERFORMANCE - Active contract performance and monitoring
 * @property {string} RENEWAL - Renewal evaluation and decision
 * @property {string} CLOSE_OUT - Contract closure and archival
 */
var LifecycleStage;
(function (LifecycleStage) {
    LifecycleStage["INITIATION"] = "INITIATION";
    LifecycleStage["NEGOTIATION"] = "NEGOTIATION";
    LifecycleStage["APPROVAL"] = "APPROVAL";
    LifecycleStage["EXECUTION"] = "EXECUTION";
    LifecycleStage["PERFORMANCE"] = "PERFORMANCE";
    LifecycleStage["RENEWAL"] = "RENEWAL";
    LifecycleStage["CLOSE_OUT"] = "CLOSE_OUT";
})(LifecycleStage || (exports.LifecycleStage = LifecycleStage = {}));
/**
 * Obligation status
 *
 * Status tracking for contractual obligations and deliverables.
 * Critical for compliance monitoring and SLA management.
 *
 * @property {string} PENDING - Obligation not yet started
 * @property {string} IN_PROGRESS - Obligation currently being fulfilled
 * @property {string} COMPLETED - Obligation successfully completed
 * @property {string} OVERDUE - Obligation past due date, requires escalation
 * @property {string} WAIVED - Obligation formally waived by agreement
 * @property {string} DISPUTED - Obligation disputed, requires resolution
 */
var ObligationStatus;
(function (ObligationStatus) {
    ObligationStatus["PENDING"] = "PENDING";
    ObligationStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ObligationStatus["COMPLETED"] = "COMPLETED";
    ObligationStatus["OVERDUE"] = "OVERDUE";
    ObligationStatus["WAIVED"] = "WAIVED";
    ObligationStatus["DISPUTED"] = "DISPUTED";
})(ObligationStatus || (exports.ObligationStatus = ObligationStatus = {}));
/**
 * Obligation priority
 */
var ObligationPriority;
(function (ObligationPriority) {
    ObligationPriority["CRITICAL"] = "CRITICAL";
    ObligationPriority["HIGH"] = "HIGH";
    ObligationPriority["MEDIUM"] = "MEDIUM";
    ObligationPriority["LOW"] = "LOW";
})(ObligationPriority || (exports.ObligationPriority = ObligationPriority = {}));
/**
 * Obligation types
 */
var ObligationType;
(function (ObligationType) {
    ObligationType["PAYMENT"] = "PAYMENT";
    ObligationType["DELIVERY"] = "DELIVERY";
    ObligationType["REPORTING"] = "REPORTING";
    ObligationType["COMPLIANCE"] = "COMPLIANCE";
    ObligationType["AUDIT"] = "AUDIT";
    ObligationType["NOTIFICATION"] = "NOTIFICATION";
    ObligationType["PERFORMANCE"] = "PERFORMANCE";
    ObligationType["CONFIDENTIALITY"] = "CONFIDENTIALITY";
})(ObligationType || (exports.ObligationType = ObligationType = {}));
/**
 * Milestone status
 */
var MilestoneStatus;
(function (MilestoneStatus) {
    MilestoneStatus["PENDING"] = "PENDING";
    MilestoneStatus["IN_PROGRESS"] = "IN_PROGRESS";
    MilestoneStatus["COMPLETED"] = "COMPLETED";
    MilestoneStatus["DELAYED"] = "DELAYED";
    MilestoneStatus["CANCELLED"] = "CANCELLED";
})(MilestoneStatus || (exports.MilestoneStatus = MilestoneStatus = {}));
/**
 * Period units
 */
var PeriodUnit;
(function (PeriodUnit) {
    PeriodUnit["DAYS"] = "DAYS";
    PeriodUnit["WEEKS"] = "WEEKS";
    PeriodUnit["MONTHS"] = "MONTHS";
    PeriodUnit["YEARS"] = "YEARS";
})(PeriodUnit || (exports.PeriodUnit = PeriodUnit = {}));
/**
 * Adjustment types
 */
var AdjustmentType;
(function (AdjustmentType) {
    AdjustmentType["PERCENTAGE"] = "PERCENTAGE";
    AdjustmentType["FIXED_AMOUNT"] = "FIXED_AMOUNT";
    AdjustmentType["CPI_INDEXED"] = "CPI_INDEXED";
    AdjustmentType["NEGOTIATED"] = "NEGOTIATED";
})(AdjustmentType || (exports.AdjustmentType = AdjustmentType = {}));
/**
 * Amendment status
 */
var AmendmentStatus;
(function (AmendmentStatus) {
    AmendmentStatus["DRAFT"] = "DRAFT";
    AmendmentStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    AmendmentStatus["APPROVED"] = "APPROVED";
    AmendmentStatus["REJECTED"] = "REJECTED";
    AmendmentStatus["EFFECTIVE"] = "EFFECTIVE";
})(AmendmentStatus || (exports.AmendmentStatus = AmendmentStatus = {}));
/**
 * Notification types
 */
var NotificationType;
(function (NotificationType) {
    NotificationType["RENEWAL_DUE"] = "RENEWAL_DUE";
    NotificationType["EXPIRATION_WARNING"] = "EXPIRATION_WARNING";
    NotificationType["OBLIGATION_DUE"] = "OBLIGATION_DUE";
    NotificationType["MILESTONE_DUE"] = "MILESTONE_DUE";
    NotificationType["PAYMENT_DUE"] = "PAYMENT_DUE";
    NotificationType["APPROVAL_REQUIRED"] = "APPROVAL_REQUIRED";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
/**
 * Notification status
 */
var NotificationStatus;
(function (NotificationStatus) {
    NotificationStatus["SCHEDULED"] = "SCHEDULED";
    NotificationStatus["SENT"] = "SENT";
    NotificationStatus["FAILED"] = "FAILED";
    NotificationStatus["CANCELLED"] = "CANCELLED";
})(NotificationStatus || (exports.NotificationStatus = NotificationStatus = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Contract Model
 * Stores contract definitions
 */
let ContractModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'contracts',
            timestamps: true,
            indexes: [
                { fields: ['type'] },
                { fields: ['status'] },
                { fields: ['currentStage'] },
                { fields: ['startDate'] },
                { fields: ['endDate'] },
            ],
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
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _parties_decorators;
    let _parties_initializers = [];
    let _parties_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _currentStage_decorators;
    let _currentStage_initializers = [];
    let _currentStage_extraInitializers = [];
    let _obligations_decorators;
    let _obligations_initializers = [];
    let _obligations_extraInitializers = [];
    let _milestones_decorators;
    let _milestones_initializers = [];
    let _milestones_extraInitializers = [];
    let _renewalTerms_decorators;
    let _renewalTerms_initializers = [];
    let _renewalTerms_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var ContractModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.type = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.parties = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _parties_initializers, void 0));
            this.startDate = (__runInitializers(this, _parties_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.value = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _value_initializers, void 0));
            this.status = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.currentStage = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _currentStage_initializers, void 0));
            this.obligations = (__runInitializers(this, _currentStage_extraInitializers), __runInitializers(this, _obligations_initializers, void 0));
            this.milestones = (__runInitializers(this, _obligations_extraInitializers), __runInitializers(this, _milestones_initializers, void 0));
            this.renewalTerms = (__runInitializers(this, _milestones_extraInitializers), __runInitializers(this, _renewalTerms_initializers, void 0));
            this.metadata = (__runInitializers(this, _renewalTerms_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ContractModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique contract identifier' })];
        _name_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiProperty)({ description: 'Contract name' })];
        _type_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(ContractType))), (0, swagger_1.ApiProperty)({ enum: ContractType, description: 'Contract type' })];
        _parties_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Contract parties', type: [Object] })];
        _startDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiProperty)({ description: 'Contract start date' })];
        _endDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiProperty)({ description: 'Contract end date' })];
        _value_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Contract value information' })];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(ContractStatus))), (0, swagger_1.ApiProperty)({ enum: ContractStatus, description: 'Contract status' })];
        _currentStage_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(LifecycleStage))), (0, swagger_1.ApiProperty)({ enum: LifecycleStage, description: 'Current lifecycle stage' })];
        _obligations_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Contract obligations', type: [Object] })];
        _milestones_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Contract milestones', type: [Object] })];
        _renewalTerms_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Renewal terms' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _parties_decorators, { kind: "field", name: "parties", static: false, private: false, access: { has: obj => "parties" in obj, get: obj => obj.parties, set: (obj, value) => { obj.parties = value; } }, metadata: _metadata }, _parties_initializers, _parties_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _currentStage_decorators, { kind: "field", name: "currentStage", static: false, private: false, access: { has: obj => "currentStage" in obj, get: obj => obj.currentStage, set: (obj, value) => { obj.currentStage = value; } }, metadata: _metadata }, _currentStage_initializers, _currentStage_extraInitializers);
        __esDecorate(null, null, _obligations_decorators, { kind: "field", name: "obligations", static: false, private: false, access: { has: obj => "obligations" in obj, get: obj => obj.obligations, set: (obj, value) => { obj.obligations = value; } }, metadata: _metadata }, _obligations_initializers, _obligations_extraInitializers);
        __esDecorate(null, null, _milestones_decorators, { kind: "field", name: "milestones", static: false, private: false, access: { has: obj => "milestones" in obj, get: obj => obj.milestones, set: (obj, value) => { obj.milestones = value; } }, metadata: _metadata }, _milestones_initializers, _milestones_extraInitializers);
        __esDecorate(null, null, _renewalTerms_decorators, { kind: "field", name: "renewalTerms", static: false, private: false, access: { has: obj => "renewalTerms" in obj, get: obj => obj.renewalTerms, set: (obj, value) => { obj.renewalTerms = value; } }, metadata: _metadata }, _renewalTerms_initializers, _renewalTerms_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ContractModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ContractModel = _classThis;
})();
exports.ContractModel = ContractModel;
/**
 * Contract Amendment Model
 * Stores contract amendments
 */
let ContractAmendmentModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'contract_amendments',
            timestamps: true,
            indexes: [
                { fields: ['contractId'] },
                { fields: ['status'] },
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
    let _contractId_decorators;
    let _contractId_initializers = [];
    let _contractId_extraInitializers = [];
    let _amendmentNumber_decorators;
    let _amendmentNumber_initializers = [];
    let _amendmentNumber_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _changes_decorators;
    let _changes_initializers = [];
    let _changes_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var ContractAmendmentModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.contractId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _contractId_initializers, void 0));
            this.amendmentNumber = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _amendmentNumber_initializers, void 0));
            this.title = (__runInitializers(this, _amendmentNumber_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.changes = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _changes_initializers, void 0));
            this.effectiveDate = (__runInitializers(this, _changes_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
            this.status = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.metadata = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ContractAmendmentModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique amendment identifier' })];
        _contractId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Contract ID' })];
        _amendmentNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER), (0, swagger_1.ApiProperty)({ description: 'Amendment number' })];
        _title_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiProperty)({ description: 'Amendment title' })];
        _description_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT), (0, swagger_1.ApiProperty)({ description: 'Amendment description' })];
        _changes_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Amendment changes', type: [Object] })];
        _effectiveDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiProperty)({ description: 'Effective date' })];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(AmendmentStatus))), (0, swagger_1.ApiProperty)({ enum: AmendmentStatus, description: 'Amendment status' })];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING)), (0, swagger_1.ApiPropertyOptional)({ description: 'Approvers' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
        __esDecorate(null, null, _amendmentNumber_decorators, { kind: "field", name: "amendmentNumber", static: false, private: false, access: { has: obj => "amendmentNumber" in obj, get: obj => obj.amendmentNumber, set: (obj, value) => { obj.amendmentNumber = value; } }, metadata: _metadata }, _amendmentNumber_initializers, _amendmentNumber_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _changes_decorators, { kind: "field", name: "changes", static: false, private: false, access: { has: obj => "changes" in obj, get: obj => obj.changes, set: (obj, value) => { obj.changes = value; } }, metadata: _metadata }, _changes_initializers, _changes_extraInitializers);
        __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ContractAmendmentModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ContractAmendmentModel = _classThis;
})();
exports.ContractAmendmentModel = ContractAmendmentModel;
/**
 * Renewal Notification Model
 * Stores renewal notifications
 */
let RenewalNotificationModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'renewal_notifications',
            timestamps: true,
            indexes: [
                { fields: ['contractId'] },
                { fields: ['type'] },
                { fields: ['status'] },
                { fields: ['scheduledDate'] },
            ],
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
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _recipientEmails_decorators;
    let _recipientEmails_initializers = [];
    let _recipientEmails_extraInitializers = [];
    let _scheduledDate_decorators;
    let _scheduledDate_initializers = [];
    let _scheduledDate_extraInitializers = [];
    let _sentAt_decorators;
    let _sentAt_initializers = [];
    let _sentAt_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _message_decorators;
    let _message_initializers = [];
    let _message_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var RenewalNotificationModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.contractId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _contractId_initializers, void 0));
            this.type = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.recipientEmails = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _recipientEmails_initializers, void 0));
            this.scheduledDate = (__runInitializers(this, _recipientEmails_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
            this.sentAt = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _sentAt_initializers, void 0));
            this.status = (__runInitializers(this, _sentAt_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.message = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _message_initializers, void 0));
            this.metadata = (__runInitializers(this, _message_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "RenewalNotificationModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique notification identifier' })];
        _contractId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Contract ID' })];
        _type_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(NotificationType))), (0, swagger_1.ApiProperty)({ enum: NotificationType, description: 'Notification type' })];
        _recipientEmails_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING)), (0, swagger_1.ApiProperty)({ description: 'Recipient emails' })];
        _scheduledDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiProperty)({ description: 'Scheduled send date' })];
        _sentAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiPropertyOptional)({ description: 'Actual send date' })];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(NotificationStatus))), (0, swagger_1.ApiProperty)({ enum: NotificationStatus, description: 'Notification status' })];
        _message_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT), (0, swagger_1.ApiProperty)({ description: 'Notification message' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _recipientEmails_decorators, { kind: "field", name: "recipientEmails", static: false, private: false, access: { has: obj => "recipientEmails" in obj, get: obj => obj.recipientEmails, set: (obj, value) => { obj.recipientEmails = value; } }, metadata: _metadata }, _recipientEmails_initializers, _recipientEmails_extraInitializers);
        __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
        __esDecorate(null, null, _sentAt_decorators, { kind: "field", name: "sentAt", static: false, private: false, access: { has: obj => "sentAt" in obj, get: obj => obj.sentAt, set: (obj, value) => { obj.sentAt = value; } }, metadata: _metadata }, _sentAt_initializers, _sentAt_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: obj => "message" in obj, get: obj => obj.message, set: (obj, value) => { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RenewalNotificationModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RenewalNotificationModel = _classThis;
})();
exports.RenewalNotificationModel = RenewalNotificationModel;
// ============================================================================
// CORE CONTRACT LIFECYCLE FUNCTIONS
// ============================================================================
/**
 * Creates a new contract.
 *
 * @param {string} name - Contract name
 * @param {ContractType} type - Contract type
 * @param {ContractParty[]} parties - Contract parties
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Partial<Contract>} options - Additional options
 * @returns {Contract} Contract
 *
 * @example
 * ```typescript
 * const contract = createContract('Provider Agreement', ContractType.PROVIDER_AGREEMENT, parties, startDate, endDate);
 * ```
 */
const createContract = (name, type, parties, startDate, endDate, options) => {
    return {
        id: crypto.randomUUID(),
        name,
        type,
        parties,
        startDate,
        endDate,
        value: options?.value,
        status: ContractStatus.DRAFT,
        currentStage: LifecycleStage.INITIATION,
        obligations: options?.obligations || [],
        milestones: options?.milestones || [],
        renewalTerms: options?.renewalTerms,
        metadata: options?.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.createContract = createContract;
/**
 * Adds a party to contract.
 *
 * @param {Contract} contract - Contract
 * @param {ContractParty} party - Party to add
 * @returns {Contract} Updated contract
 *
 * @example
 * ```typescript
 * const updated = addPartyToContract(contract, party);
 * ```
 */
const addPartyToContract = (contract, party) => {
    return {
        ...contract,
        parties: [...contract.parties, party],
        updatedAt: new Date(),
    };
};
exports.addPartyToContract = addPartyToContract;
/**
 * Creates a contract party.
 *
 * @param {string} name - Party name
 * @param {PartyRole} role - Party role
 * @param {Partial<ContractParty>} options - Additional options
 * @returns {ContractParty} Contract party
 *
 * @example
 * ```typescript
 * const party = createContractParty('Acme Hospital', PartyRole.CLIENT, {email: 'contact@acme.com'});
 * ```
 */
const createContractParty = (name, role, options) => {
    return {
        id: crypto.randomUUID(),
        name,
        role,
        organizationType: options?.organizationType,
        contactPerson: options?.contactPerson,
        email: options?.email,
        phone: options?.phone,
        address: options?.address,
        signedAt: options?.signedAt,
        metadata: options?.metadata,
    };
};
exports.createContractParty = createContractParty;
/**
 * Transitions contract to new lifecycle stage.
 *
 * @param {Contract} contract - Contract
 * @param {LifecycleStage} newStage - New lifecycle stage
 * @param {string} triggeredBy - User who triggered transition
 * @returns {{contract: Contract, transition: LifecycleTransition}} Updated contract and transition record
 *
 * @example
 * ```typescript
 * const {contract, transition} = transitionLifecycleStage(contract, LifecycleStage.EXECUTION, 'user123');
 * ```
 */
const transitionLifecycleStage = (contract, newStage, triggeredBy) => {
    const transition = {
        contractId: contract.id,
        fromStage: contract.currentStage,
        toStage: newStage,
        transitionDate: new Date(),
        triggeredBy,
    };
    const updatedContract = {
        ...contract,
        currentStage: newStage,
        updatedAt: new Date(),
    };
    return { contract: updatedContract, transition };
};
exports.transitionLifecycleStage = transitionLifecycleStage;
/**
 * Activates a contract.
 *
 * @param {Contract} contract - Contract to activate
 * @returns {Contract} Activated contract
 *
 * @example
 * ```typescript
 * const activated = activateContract(contract);
 * ```
 */
const activateContract = (contract) => {
    return {
        ...contract,
        status: ContractStatus.ACTIVE,
        currentStage: LifecycleStage.PERFORMANCE,
        updatedAt: new Date(),
    };
};
exports.activateContract = activateContract;
/**
 * Creates an obligation.
 *
 * @param {string} contractId - Contract identifier
 * @param {string} title - Obligation title
 * @param {string} responsibleParty - Responsible party ID
 * @param {Date} dueDate - Due date
 * @param {Partial<Obligation>} options - Additional options
 * @returns {Obligation} Obligation
 *
 * @example
 * ```typescript
 * const obligation = createObligation('contract123', 'Monthly Report', 'party123', dueDate, {type: ObligationType.REPORTING});
 * ```
 */
const createObligation = (contractId, title, responsibleParty, dueDate, options) => {
    return {
        id: crypto.randomUUID(),
        contractId,
        title,
        description: options?.description || '',
        responsibleParty,
        dueDate,
        status: ObligationStatus.PENDING,
        priority: options?.priority || ObligationPriority.MEDIUM,
        type: options?.type || ObligationType.PERFORMANCE,
        completedAt: options?.completedAt,
        verifiedBy: options?.verifiedBy,
        metadata: options?.metadata,
    };
};
exports.createObligation = createObligation;
/**
 * Adds an obligation to contract.
 *
 * @param {Contract} contract - Contract
 * @param {Obligation} obligation - Obligation to add
 * @returns {Contract} Updated contract
 *
 * @example
 * ```typescript
 * const updated = addObligationToContract(contract, obligation);
 * ```
 */
const addObligationToContract = (contract, obligation) => {
    return {
        ...contract,
        obligations: [...contract.obligations, obligation],
        updatedAt: new Date(),
    };
};
exports.addObligationToContract = addObligationToContract;
/**
 * Marks an obligation as completed.
 *
 * @param {Obligation} obligation - Obligation
 * @param {string} verifiedBy - User who verified completion
 * @returns {Obligation} Completed obligation
 *
 * @example
 * ```typescript
 * const completed = completeObligation(obligation, 'user123');
 * ```
 */
const completeObligation = (obligation, verifiedBy) => {
    return {
        ...obligation,
        status: ObligationStatus.COMPLETED,
        completedAt: new Date(),
        verifiedBy,
    };
};
exports.completeObligation = completeObligation;
/**
 * Gets overdue obligations for contract.
 *
 * @param {Contract} contract - Contract
 * @returns {Obligation[]} Overdue obligations
 *
 * @example
 * ```typescript
 * const overdue = getOverdueObligations(contract);
 * ```
 */
const getOverdueObligations = (contract) => {
    const now = new Date();
    return contract.obligations.filter((o) => (o.status === ObligationStatus.PENDING || o.status === ObligationStatus.IN_PROGRESS) &&
        o.dueDate < now);
};
exports.getOverdueObligations = getOverdueObligations;
/**
 * Creates a milestone.
 *
 * @param {string} contractId - Contract identifier
 * @param {string} name - Milestone name
 * @param {Date} targetDate - Target date
 * @param {Partial<Milestone>} options - Additional options
 * @returns {Milestone} Milestone
 *
 * @example
 * ```typescript
 * const milestone = createMilestone('contract123', 'Phase 1 Completion', targetDate);
 * ```
 */
const createMilestone = (contractId, name, targetDate, options) => {
    return {
        id: crypto.randomUUID(),
        contractId,
        name,
        description: options?.description,
        targetDate,
        status: MilestoneStatus.PENDING,
        completedAt: options?.completedAt,
        dependencies: options?.dependencies,
        deliverables: options?.deliverables,
        metadata: options?.metadata,
    };
};
exports.createMilestone = createMilestone;
/**
 * Adds a milestone to contract.
 *
 * @param {Contract} contract - Contract
 * @param {Milestone} milestone - Milestone to add
 * @returns {Contract} Updated contract
 *
 * @example
 * ```typescript
 * const updated = addMilestoneToContract(contract, milestone);
 * ```
 */
const addMilestoneToContract = (contract, milestone) => {
    return {
        ...contract,
        milestones: [...contract.milestones, milestone],
        updatedAt: new Date(),
    };
};
exports.addMilestoneToContract = addMilestoneToContract;
/**
 * Marks a milestone as completed.
 *
 * @param {Milestone} milestone - Milestone
 * @returns {Milestone} Completed milestone
 *
 * @example
 * ```typescript
 * const completed = completeMilestone(milestone);
 * ```
 */
const completeMilestone = (milestone) => {
    return {
        ...milestone,
        status: MilestoneStatus.COMPLETED,
        completedAt: new Date(),
    };
};
exports.completeMilestone = completeMilestone;
/**
 * Creates renewal terms for contract.
 *
 * @param {boolean} autoRenew - Whether to auto-renew
 * @param {number} renewalPeriod - Renewal period value
 * @param {PeriodUnit} renewalPeriodUnit - Renewal period unit
 * @param {Partial<RenewalTerms>} options - Additional options
 * @returns {RenewalTerms} Renewal terms
 *
 * @example
 * ```typescript
 * const terms = createRenewalTerms(true, 1, PeriodUnit.YEARS, {noticePeriod: 90, noticePeriodUnit: PeriodUnit.DAYS});
 * ```
 */
const createRenewalTerms = (autoRenew, renewalPeriod, renewalPeriodUnit, options) => {
    return {
        autoRenew,
        renewalPeriod,
        renewalPeriodUnit,
        noticePeriod: options?.noticePeriod || 30,
        noticePeriodUnit: options?.noticePeriodUnit || PeriodUnit.DAYS,
        renewalNotificationDays: options?.renewalNotificationDays || 90,
        maxRenewals: options?.maxRenewals,
        currentRenewalCount: options?.currentRenewalCount || 0,
        priceAdjustment: options?.priceAdjustment,
    };
};
exports.createRenewalTerms = createRenewalTerms;
/**
 * Checks if contract is eligible for renewal.
 *
 * @param {Contract} contract - Contract
 * @returns {boolean} True if eligible
 *
 * @example
 * ```typescript
 * const eligible = isEligibleForRenewal(contract);
 * ```
 */
const isEligibleForRenewal = (contract) => {
    if (!contract.renewalTerms)
        return false;
    const { maxRenewals, currentRenewalCount } = contract.renewalTerms;
    if (maxRenewals && currentRenewalCount >= maxRenewals)
        return false;
    return contract.status === ContractStatus.ACTIVE;
};
exports.isEligibleForRenewal = isEligibleForRenewal;
/**
 * Renews a contract.
 *
 * @param {Contract} contract - Contract to renew
 * @returns {Contract} Renewed contract
 *
 * @example
 * ```typescript
 * const renewed = renewContract(contract);
 * ```
 */
const renewContract = (contract) => {
    if (!contract.renewalTerms) {
        throw new Error('Contract does not have renewal terms');
    }
    const renewalPeriodMs = (0, exports.convertPeriodToMilliseconds)(contract.renewalTerms.renewalPeriod, contract.renewalTerms.renewalPeriodUnit);
    const newEndDate = new Date(contract.endDate.getTime() + renewalPeriodMs);
    return {
        ...contract,
        endDate: newEndDate,
        status: ContractStatus.RENEWED,
        currentStage: LifecycleStage.PERFORMANCE,
        renewalTerms: {
            ...contract.renewalTerms,
            currentRenewalCount: contract.renewalTerms.currentRenewalCount + 1,
        },
        updatedAt: new Date(),
    };
};
exports.renewContract = renewContract;
/**
 * Converts period to milliseconds.
 *
 * @param {number} value - Period value
 * @param {PeriodUnit} unit - Period unit
 * @returns {number} Milliseconds
 *
 * @example
 * ```typescript
 * const ms = convertPeriodToMilliseconds(1, PeriodUnit.YEARS);
 * ```
 */
const convertPeriodToMilliseconds = (value, unit) => {
    const conversions = {
        [PeriodUnit.DAYS]: 86400000,
        [PeriodUnit.WEEKS]: 604800000,
        [PeriodUnit.MONTHS]: 2592000000, // Approximate
        [PeriodUnit.YEARS]: 31536000000, // Approximate
    };
    return value * conversions[unit];
};
exports.convertPeriodToMilliseconds = convertPeriodToMilliseconds;
/**
 * Calculates days until contract expiration.
 *
 * @param {Contract} contract - Contract
 * @returns {number} Days until expiration
 *
 * @example
 * ```typescript
 * const days = calculateDaysUntilExpiration(contract);
 * ```
 */
const calculateDaysUntilExpiration = (contract) => {
    const now = Date.now();
    const endTime = contract.endDate.getTime();
    const diff = endTime - now;
    return Math.ceil(diff / 86400000);
};
exports.calculateDaysUntilExpiration = calculateDaysUntilExpiration;
/**
 * Checks if contract is expiring soon.
 *
 * @param {Contract} contract - Contract
 * @param {number} thresholdDays - Days threshold
 * @returns {boolean} True if expiring soon
 *
 * @example
 * ```typescript
 * const expiringSoon = isContractExpiringSoon(contract, 90);
 * ```
 */
const isContractExpiringSoon = (contract, thresholdDays = 90) => {
    const daysUntil = (0, exports.calculateDaysUntilExpiration)(contract);
    return daysUntil <= thresholdDays && daysUntil > 0;
};
exports.isContractExpiringSoon = isContractExpiringSoon;
/**
 * Creates a contract amendment.
 *
 * @param {string} contractId - Contract identifier
 * @param {number} amendmentNumber - Amendment number
 * @param {string} title - Amendment title
 * @param {AmendmentChange[]} changes - Changes
 * @param {Date} effectiveDate - Effective date
 * @param {Partial<ContractAmendment>} options - Additional options
 * @returns {ContractAmendment} Contract amendment
 *
 * @example
 * ```typescript
 * const amendment = createContractAmendment('contract123', 1, 'Price Update', changes, effectiveDate);
 * ```
 */
const createContractAmendment = (contractId, amendmentNumber, title, changes, effectiveDate, options) => {
    return {
        id: crypto.randomUUID(),
        contractId,
        amendmentNumber,
        title,
        description: options?.description || '',
        changes,
        effectiveDate,
        status: AmendmentStatus.DRAFT,
        approvedBy: options?.approvedBy,
        createdAt: new Date(),
        metadata: options?.metadata,
    };
};
exports.createContractAmendment = createContractAmendment;
/**
 * Applies an amendment to contract.
 *
 * @param {Contract} contract - Contract
 * @param {ContractAmendment} amendment - Amendment
 * @returns {Contract} Updated contract
 *
 * @example
 * ```typescript
 * const updated = applyAmendmentToContract(contract, amendment);
 * ```
 */
const applyAmendmentToContract = (contract, amendment) => {
    let updatedContract = { ...contract };
    amendment.changes.forEach((change) => {
        if (change.field in updatedContract) {
            updatedContract[change.field] = change.newValue;
        }
    });
    return {
        ...updatedContract,
        status: ContractStatus.AMENDED,
        updatedAt: new Date(),
    };
};
exports.applyAmendmentToContract = applyAmendmentToContract;
/**
 * Creates a renewal notification.
 *
 * @param {string} contractId - Contract identifier
 * @param {NotificationType} type - Notification type
 * @param {string[]} recipientEmails - Recipient emails
 * @param {Date} scheduledDate - Scheduled send date
 * @param {string} message - Notification message
 * @returns {RenewalNotification} Renewal notification
 *
 * @example
 * ```typescript
 * const notification = createRenewalNotification('contract123', NotificationType.RENEWAL_DUE, emails, scheduledDate, message);
 * ```
 */
const createRenewalNotification = (contractId, type, recipientEmails, scheduledDate, message) => {
    return {
        id: crypto.randomUUID(),
        contractId,
        type,
        recipientEmails,
        scheduledDate,
        status: NotificationStatus.SCHEDULED,
        message,
    };
};
exports.createRenewalNotification = createRenewalNotification;
/**
 * Schedules renewal notifications for contract.
 *
 * @param {Contract} contract - Contract
 * @param {string[]} recipientEmails - Recipient emails
 * @returns {RenewalNotification[]} Scheduled notifications
 *
 * @example
 * ```typescript
 * const notifications = scheduleRenewalNotifications(contract, ['admin@example.com']);
 * ```
 */
const scheduleRenewalNotifications = (contract, recipientEmails) => {
    if (!contract.renewalTerms)
        return [];
    const notifications = [];
    const notificationDate = new Date(contract.endDate.getTime() - contract.renewalTerms.renewalNotificationDays * 86400000);
    notifications.push((0, exports.createRenewalNotification)(contract.id, NotificationType.RENEWAL_DUE, recipientEmails, notificationDate, `Contract "${contract.name}" is due for renewal in ${contract.renewalTerms.renewalNotificationDays} days.`));
    return notifications;
};
exports.scheduleRenewalNotifications = scheduleRenewalNotifications;
/**
 * Terminates a contract.
 *
 * @param {Contract} contract - Contract to terminate
 * @param {string} reason - Termination reason
 * @returns {Contract} Terminated contract
 *
 * @example
 * ```typescript
 * const terminated = terminateContract(contract, 'Mutual agreement');
 * ```
 */
const terminateContract = (contract, reason) => {
    return {
        ...contract,
        status: ContractStatus.TERMINATED,
        currentStage: LifecycleStage.CLOSE_OUT,
        metadata: {
            ...contract.metadata,
            terminationReason: reason,
            terminationDate: new Date(),
        },
        updatedAt: new Date(),
    };
};
exports.terminateContract = terminateContract;
/**
 * Calculates contract value with price adjustment.
 *
 * @param {ContractValue} value - Original value
 * @param {PriceAdjustment} adjustment - Price adjustment
 * @returns {ContractValue} Adjusted value
 *
 * @example
 * ```typescript
 * const adjusted = calculateAdjustedContractValue(value, adjustment);
 * ```
 */
const calculateAdjustedContractValue = (value, adjustment) => {
    let adjustedAmount = value.amount;
    if (adjustment.type === AdjustmentType.PERCENTAGE) {
        adjustedAmount = value.amount * (1 + adjustment.value / 100);
    }
    else if (adjustment.type === AdjustmentType.FIXED_AMOUNT) {
        adjustedAmount = value.amount + adjustment.value;
    }
    return {
        ...value,
        amount: adjustedAmount,
    };
};
exports.calculateAdjustedContractValue = calculateAdjustedContractValue;
/**
 * Generates contract analytics.
 *
 * @param {Contract[]} contracts - List of contracts
 * @returns {ContractAnalytics} Analytics metrics
 *
 * @example
 * ```typescript
 * const analytics = generateContractAnalytics(contracts);
 * ```
 */
const generateContractAnalytics = (contracts) => {
    const totalContracts = contracts.length;
    const activeContracts = contracts.filter((c) => c.status === ContractStatus.ACTIVE).length;
    const expiringContracts = contracts.filter((c) => (0, exports.isContractExpiringSoon)(c, 90)).length;
    const totalValue = contracts.reduce((sum, c) => sum + (c.value?.amount || 0), 0);
    const averageContractValue = totalContracts > 0 ? totalValue / totalContracts : 0;
    const contractsByType = {};
    const contractsByStatus = {};
    contracts.forEach((contract) => {
        contractsByType[contract.type] = (contractsByType[contract.type] || 0) + 1;
        contractsByStatus[contract.status] = (contractsByStatus[contract.status] || 0) + 1;
    });
    const overdueObligations = contracts.reduce((sum, c) => sum + (0, exports.getOverdueObligations)(c).length, 0);
    const upcomingRenewals = contracts.filter((c) => (0, exports.isEligibleForRenewal)(c) && (0, exports.isContractExpiringSoon)(c, 90)).length;
    const totalObligations = contracts.reduce((sum, c) => sum + c.obligations.length, 0);
    const completedObligations = contracts.reduce((sum, c) => sum + c.obligations.filter((o) => o.status === ObligationStatus.COMPLETED).length, 0);
    const complianceRate = totalObligations > 0 ? (completedObligations / totalObligations) * 100 : 100;
    return {
        totalContracts,
        activeContracts,
        expiringContracts,
        totalValue,
        averageContractValue,
        contractsByType,
        contractsByStatus,
        overdueObligations,
        upcomingRenewals,
        complianceRate,
    };
};
exports.generateContractAnalytics = generateContractAnalytics;
/**
 * Validates contract configuration.
 *
 * @param {Contract} contract - Contract to validate
 * @returns {Array<string>} Validation errors
 *
 * @example
 * ```typescript
 * const errors = validateContractConfiguration(contract);
 * ```
 */
const validateContractConfiguration = (contract) => {
    const errors = [];
    if (!contract.name || contract.name.trim() === '') {
        errors.push('Contract name is required');
    }
    if (contract.parties.length === 0) {
        errors.push('At least one party is required');
    }
    if (contract.endDate <= contract.startDate) {
        errors.push('End date must be after start date');
    }
    if (contract.renewalTerms?.autoRenew && !contract.renewalTerms.renewalPeriod) {
        errors.push('Renewal period is required for auto-renewal');
    }
    return errors;
};
exports.validateContractConfiguration = validateContractConfiguration;
/**
 * Exports contract to JSON.
 *
 * @param {Contract} contract - Contract to export
 * @returns {string} JSON string
 *
 * @example
 * ```typescript
 * const json = exportContractToJSON(contract);
 * ```
 */
const exportContractToJSON = (contract) => {
    return JSON.stringify(contract, null, 2);
};
exports.exportContractToJSON = exportContractToJSON;
/**
 * Filters contracts by status.
 *
 * @param {Contract[]} contracts - Contracts to filter
 * @param {ContractStatus} status - Status to filter by
 * @returns {Contract[]} Filtered contracts
 *
 * @example
 * ```typescript
 * const active = filterContractsByStatus(contracts, ContractStatus.ACTIVE);
 * ```
 */
const filterContractsByStatus = (contracts, status) => {
    return contracts.filter((c) => c.status === status);
};
exports.filterContractsByStatus = filterContractsByStatus;
/**
 * Filters contracts by type.
 *
 * @param {Contract[]} contracts - Contracts to filter
 * @param {ContractType} type - Type to filter by
 * @returns {Contract[]} Filtered contracts
 *
 * @example
 * ```typescript
 * const providers = filterContractsByType(contracts, ContractType.PROVIDER_AGREEMENT);
 * ```
 */
const filterContractsByType = (contracts, type) => {
    return contracts.filter((c) => c.type === type);
};
exports.filterContractsByType = filterContractsByType;
/**
 * Searches contracts by party name.
 *
 * @param {Contract[]} contracts - Contracts to search
 * @param {string} partyName - Party name to search for
 * @returns {Contract[]} Matching contracts
 *
 * @example
 * ```typescript
 * const results = searchContractsByParty(contracts, 'Acme');
 * ```
 */
const searchContractsByParty = (contracts, partyName) => {
    const searchLower = partyName.toLowerCase();
    return contracts.filter((c) => c.parties.some((p) => p.name.toLowerCase().includes(searchLower)));
};
exports.searchContractsByParty = searchContractsByParty;
/**
 * Calculates contract performance metrics.
 *
 * @param {Contract} contract - Contract
 * @returns {Record<string, any>} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateContractPerformance(contract);
 * ```
 */
const calculateContractPerformance = (contract) => {
    const totalObligations = contract.obligations.length;
    const completedObligations = contract.obligations.filter((o) => o.status === ObligationStatus.COMPLETED).length;
    const overdueObligations = (0, exports.getOverdueObligations)(contract).length;
    const totalMilestones = contract.milestones.length;
    const completedMilestones = contract.milestones.filter((m) => m.status === MilestoneStatus.COMPLETED).length;
    return {
        contractId: contract.id,
        obligationCompletionRate: totalObligations > 0 ? (completedObligations / totalObligations) * 100 : 100,
        overdueObligations,
        milestoneCompletionRate: totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 100,
        daysUntilExpiration: (0, exports.calculateDaysUntilExpiration)(contract),
        isExpiringSoon: (0, exports.isContractExpiringSoon)(contract),
        status: contract.status,
        currentStage: contract.currentStage,
    };
};
exports.calculateContractPerformance = calculateContractPerformance;
/**
 * Generates contract summary report.
 *
 * @param {Contract} contract - Contract
 * @returns {Record<string, any>} Summary report
 *
 * @example
 * ```typescript
 * const summary = generateContractSummary(contract);
 * ```
 */
const generateContractSummary = (contract) => {
    return {
        id: contract.id,
        name: contract.name,
        type: contract.type,
        status: contract.status,
        currentStage: contract.currentStage,
        parties: contract.parties.map((p) => ({ name: p.name, role: p.role })),
        startDate: contract.startDate,
        endDate: contract.endDate,
        value: contract.value,
        obligationCount: contract.obligations.length,
        milestoneCount: contract.milestones.length,
        hasRenewalTerms: !!contract.renewalTerms,
        autoRenew: contract.renewalTerms?.autoRenew,
        performance: (0, exports.calculateContractPerformance)(contract),
    };
};
exports.generateContractSummary = generateContractSummary;
/**
 * Clones a contract for template reuse.
 *
 * @param {Contract} contract - Contract to clone
 * @param {string} newName - New contract name
 * @returns {Contract} Cloned contract
 *
 * @example
 * ```typescript
 * const cloned = cloneContract(originalContract, 'New Provider Agreement');
 * ```
 */
const cloneContract = (contract, newName) => {
    return {
        ...contract,
        id: crypto.randomUUID(),
        name: newName,
        status: ContractStatus.DRAFT,
        currentStage: LifecycleStage.INITIATION,
        parties: contract.parties.map((p) => ({ ...p, id: crypto.randomUUID(), signedAt: undefined })),
        obligations: contract.obligations.map((o) => ({
            ...o,
            id: crypto.randomUUID(),
            status: ObligationStatus.PENDING,
            completedAt: undefined,
            verifiedBy: undefined,
        })),
        milestones: contract.milestones.map((m) => ({
            ...m,
            id: crypto.randomUUID(),
            status: MilestoneStatus.PENDING,
            completedAt: undefined,
        })),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.cloneContract = cloneContract;
// ============================================================================
// NESTJS SERVICE EXAMPLE
// ============================================================================
/**
 * Contract Lifecycle Service
 * Production-ready NestJS service for contract lifecycle management
 */
let ContractLifecycleService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ContractLifecycleService = _classThis = class {
        /**
         * Creates and validates a new contract
         */
        async createNewContract(name, type, parties, startDate, endDate) {
            const contract = (0, exports.createContract)(name, type, parties, startDate, endDate);
            const errors = (0, exports.validateContractConfiguration)(contract);
            if (errors.length > 0) {
                throw new Error(`Contract validation failed: ${errors.join(', ')}`);
            }
            return contract;
        }
        /**
         * Processes contract renewal
         */
        async processRenewal(contractId) {
            // Implementation would fetch contract and renew it
            return {};
        }
    };
    __setFunctionName(_classThis, "ContractLifecycleService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ContractLifecycleService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ContractLifecycleService = _classThis;
})();
exports.ContractLifecycleService = ContractLifecycleService;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    ContractModel,
    ContractAmendmentModel,
    RenewalNotificationModel,
    // Core Functions
    createContract: exports.createContract,
    addPartyToContract: exports.addPartyToContract,
    createContractParty: exports.createContractParty,
    transitionLifecycleStage: exports.transitionLifecycleStage,
    activateContract: exports.activateContract,
    createObligation: exports.createObligation,
    addObligationToContract: exports.addObligationToContract,
    completeObligation: exports.completeObligation,
    getOverdueObligations: exports.getOverdueObligations,
    createMilestone: exports.createMilestone,
    addMilestoneToContract: exports.addMilestoneToContract,
    completeMilestone: exports.completeMilestone,
    createRenewalTerms: exports.createRenewalTerms,
    isEligibleForRenewal: exports.isEligibleForRenewal,
    renewContract: exports.renewContract,
    convertPeriodToMilliseconds: exports.convertPeriodToMilliseconds,
    calculateDaysUntilExpiration: exports.calculateDaysUntilExpiration,
    isContractExpiringSoon: exports.isContractExpiringSoon,
    createContractAmendment: exports.createContractAmendment,
    applyAmendmentToContract: exports.applyAmendmentToContract,
    createRenewalNotification: exports.createRenewalNotification,
    scheduleRenewalNotifications: exports.scheduleRenewalNotifications,
    terminateContract: exports.terminateContract,
    calculateAdjustedContractValue: exports.calculateAdjustedContractValue,
    generateContractAnalytics: exports.generateContractAnalytics,
    validateContractConfiguration: exports.validateContractConfiguration,
    exportContractToJSON: exports.exportContractToJSON,
    filterContractsByStatus: exports.filterContractsByStatus,
    filterContractsByType: exports.filterContractsByType,
    searchContractsByParty: exports.searchContractsByParty,
    calculateContractPerformance: exports.calculateContractPerformance,
    generateContractSummary: exports.generateContractSummary,
    cloneContract: exports.cloneContract,
    // Services
    ContractLifecycleService,
};
//# sourceMappingURL=document-contract-lifecycle-composite.js.map