"use strict";
/**
 * LOC: INS-POLICY-001
 * File: /reuse/insurance/policy-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Insurance backend services
 *   - Policy administration modules
 *   - Underwriting services
 *   - Agency management systems
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
exports.validateTransferEligibility = exports.transferPolicyOwnership = exports.generateCancellationNotice = exports.generateCertificate = exports.generateInsuranceCard = exports.generateDeclarationPage = exports.getPoliciesByHolder = exports.getPolicyByNumber = exports.getExpiringPolicies = exports.searchPolicies = exports.calculateTotalPremium = exports.applySurcharges = exports.applyDiscounts = exports.calculateProRatedPremium = exports.calculateCoveragePeriod = exports.addAdditionalInsured = exports.removeNamedInsured = exports.addNamedInsured = exports.updatePolicyHolder = exports.createPolicyHolder = exports.getBundlePolicies = exports.removePolicyFromBundle = exports.addPolicyToBundle = exports.createPolicyBundle = exports.processAutoRenewals = exports.declineRenewal = exports.acceptRenewal = exports.createRenewalOffer = exports.terminatePolicy = exports.suspendPolicy = exports.reinstatePolicy = exports.cancelPolicy = exports.rollbackPolicyVersion = exports.comparePolicyVersions = exports.getPolicyVersionHistory = exports.modifyPolicy = exports.activatePolicy = exports.issuePolicy = exports.bindPolicy = exports.createPolicyQuote = exports.createPolicyAuditLogModel = exports.createPolicyModel = exports.PolicyDocumentType = exports.VersionReason = exports.InsuredType = exports.PaymentFrequency = exports.CancellationReason = exports.PolicyType = exports.PolicyStatus = void 0;
/**
 * File: /reuse/insurance/policy-management-kit.ts
 * Locator: WC-INS-POLICY-001
 * Purpose: Enterprise Insurance Policy Management Kit - Comprehensive policy lifecycle management
 *
 * Upstream: Independent utility module for insurance policy operations
 * Downstream: ../backend/*, Insurance services, Underwriting, Agency systems, Billing modules
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 40 utility functions for policy creation, modification, termination, versioning, bundles, renewals, transfers
 *
 * LLM Context: Production-ready insurance policy management utilities for White Cross platform.
 * Provides comprehensive policy lifecycle management from quote to bind to issue to renewal, policy versioning,
 * audit trails, multi-product bundles, policy holder management, named/additional insured, coverage calculations,
 * document generation, policy search, status transitions, effective dates, expiration tracking, reinstatement,
 * and ownership transfers. Designed to compete with Allstate, Progressive, and Farmers insurance platforms.
 */
const common_1 = require("@nestjs/common");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Policy status
 */
var PolicyStatus;
(function (PolicyStatus) {
    PolicyStatus["QUOTE"] = "quote";
    PolicyStatus["QUOTED"] = "quoted";
    PolicyStatus["BOUND"] = "bound";
    PolicyStatus["ISSUED"] = "issued";
    PolicyStatus["ACTIVE"] = "active";
    PolicyStatus["PENDING_RENEWAL"] = "pending_renewal";
    PolicyStatus["RENEWED"] = "renewed";
    PolicyStatus["EXPIRED"] = "expired";
    PolicyStatus["CANCELLED"] = "cancelled";
    PolicyStatus["LAPSED"] = "lapsed";
    PolicyStatus["SUSPENDED"] = "suspended";
    PolicyStatus["REINSTATED"] = "reinstated";
    PolicyStatus["TERMINATED"] = "terminated";
    PolicyStatus["PENDING_CANCELLATION"] = "pending_cancellation";
})(PolicyStatus || (exports.PolicyStatus = PolicyStatus = {}));
/**
 * Policy type
 */
var PolicyType;
(function (PolicyType) {
    PolicyType["AUTO"] = "auto";
    PolicyType["HOME"] = "home";
    PolicyType["RENTERS"] = "renters";
    PolicyType["CONDO"] = "condo";
    PolicyType["LIFE"] = "life";
    PolicyType["HEALTH"] = "health";
    PolicyType["DISABILITY"] = "disability";
    PolicyType["UMBRELLA"] = "umbrella";
    PolicyType["COMMERCIAL_AUTO"] = "commercial_auto";
    PolicyType["COMMERCIAL_PROPERTY"] = "commercial_property";
    PolicyType["GENERAL_LIABILITY"] = "general_liability";
    PolicyType["WORKERS_COMP"] = "workers_comp";
    PolicyType["PROFESSIONAL_LIABILITY"] = "professional_liability";
    PolicyType["CYBER"] = "cyber";
    PolicyType["BUNDLE"] = "bundle";
})(PolicyType || (exports.PolicyType = PolicyType = {}));
/**
 * Cancellation reason
 */
var CancellationReason;
(function (CancellationReason) {
    CancellationReason["NON_PAYMENT"] = "non_payment";
    CancellationReason["CUSTOMER_REQUEST"] = "customer_request";
    CancellationReason["UNDERWRITING_DECISION"] = "underwriting_decision";
    CancellationReason["MATERIAL_MISREPRESENTATION"] = "material_misrepresentation";
    CancellationReason["FRAUD"] = "fraud";
    CancellationReason["INSURED_DECEASED"] = "insured_deceased";
    CancellationReason["ASSET_SOLD"] = "asset_sold";
    CancellationReason["REPLACED"] = "replaced";
    CancellationReason["REGULATORY"] = "regulatory";
    CancellationReason["REWRITE"] = "rewrite";
})(CancellationReason || (exports.CancellationReason = CancellationReason = {}));
/**
 * Payment frequency
 */
var PaymentFrequency;
(function (PaymentFrequency) {
    PaymentFrequency["ANNUAL"] = "annual";
    PaymentFrequency["SEMI_ANNUAL"] = "semi_annual";
    PaymentFrequency["QUARTERLY"] = "quarterly";
    PaymentFrequency["MONTHLY"] = "monthly";
    PaymentFrequency["PAY_IN_FULL"] = "pay_in_full";
})(PaymentFrequency || (exports.PaymentFrequency = PaymentFrequency = {}));
/**
 * Insured type
 */
var InsuredType;
(function (InsuredType) {
    InsuredType["NAMED_INSURED"] = "named_insured";
    InsuredType["ADDITIONAL_INSURED"] = "additional_insured";
    InsuredType["LOSS_PAYEE"] = "loss_payee";
    InsuredType["MORTGAGEE"] = "mortgagee";
    InsuredType["LIENHOLDER"] = "lienholder";
    InsuredType["CERTIFICATE_HOLDER"] = "certificate_holder";
})(InsuredType || (exports.InsuredType = InsuredType = {}));
/**
 * Policy version reason
 */
var VersionReason;
(function (VersionReason) {
    VersionReason["NEW_BUSINESS"] = "new_business";
    VersionReason["RENEWAL"] = "renewal";
    VersionReason["ENDORSEMENT"] = "endorsement";
    VersionReason["MIDTERM_CHANGE"] = "midterm_change";
    VersionReason["CORRECTION"] = "correction";
    VersionReason["REINSTATEMENT"] = "reinstatement";
    VersionReason["CANCELLATION"] = "cancellation";
    VersionReason["REWRITE"] = "rewrite";
})(VersionReason || (exports.VersionReason = VersionReason = {}));
/**
 * Document type
 */
var PolicyDocumentType;
(function (PolicyDocumentType) {
    PolicyDocumentType["DECLARATION"] = "declaration";
    PolicyDocumentType["POLICY_FORM"] = "policy_form";
    PolicyDocumentType["ENDORSEMENT"] = "endorsement";
    PolicyDocumentType["CERTIFICATE"] = "certificate";
    PolicyDocumentType["BINDER"] = "binder";
    PolicyDocumentType["ID_CARD"] = "id_card";
    PolicyDocumentType["CANCELLATION_NOTICE"] = "cancellation_notice";
    PolicyDocumentType["RENEWAL_NOTICE"] = "renewal_notice";
    PolicyDocumentType["BILLING_STATEMENT"] = "billing_statement";
})(PolicyDocumentType || (exports.PolicyDocumentType = PolicyDocumentType = {}));
/**
 * Creates Policy model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} Policy model
 */
const createPolicyModel = (sequelize) => {
    let Policy = (() => {
        let _classDecorators = [(0, sequelize_typescript_1.Table)({
                tableName: 'policies',
                timestamps: true,
                paranoid: true,
                indexes: [
                    { fields: ['policyNumber'], unique: true },
                    { fields: ['policyHolderId'] },
                    { fields: ['status'] },
                    { fields: ['policyType'] },
                    { fields: ['effectiveDate'] },
                    { fields: ['expirationDate'] },
                    { fields: ['agentId'] },
                    { fields: ['agencyId'] },
                    { fields: ['state'] },
                    { fields: ['bundleId'] },
                    { fields: ['parentPolicyId'] },
                ],
            })];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = sequelize_typescript_1.Model;
        let _id_decorators;
        let _id_initializers = [];
        let _id_extraInitializers = [];
        let _policyNumber_decorators;
        let _policyNumber_initializers = [];
        let _policyNumber_extraInitializers = [];
        let _policyType_decorators;
        let _policyType_initializers = [];
        let _policyType_extraInitializers = [];
        let _status_decorators;
        let _status_initializers = [];
        let _status_extraInitializers = [];
        let _policyHolderId_decorators;
        let _policyHolderId_initializers = [];
        let _policyHolderId_extraInitializers = [];
        let _effectiveDate_decorators;
        let _effectiveDate_initializers = [];
        let _effectiveDate_extraInitializers = [];
        let _expirationDate_decorators;
        let _expirationDate_initializers = [];
        let _expirationDate_extraInitializers = [];
        let _bindDate_decorators;
        let _bindDate_initializers = [];
        let _bindDate_extraInitializers = [];
        let _issueDate_decorators;
        let _issueDate_initializers = [];
        let _issueDate_extraInitializers = [];
        let _cancellationDate_decorators;
        let _cancellationDate_initializers = [];
        let _cancellationDate_extraInitializers = [];
        let _cancellationReason_decorators;
        let _cancellationReason_initializers = [];
        let _cancellationReason_extraInitializers = [];
        let _premiumAmount_decorators;
        let _premiumAmount_initializers = [];
        let _premiumAmount_extraInitializers = [];
        let _paymentFrequency_decorators;
        let _paymentFrequency_initializers = [];
        let _paymentFrequency_extraInitializers = [];
        let _agentId_decorators;
        let _agentId_initializers = [];
        let _agentId_extraInitializers = [];
        let _agencyId_decorators;
        let _agencyId_initializers = [];
        let _agencyId_extraInitializers = [];
        let _underwriterId_decorators;
        let _underwriterId_initializers = [];
        let _underwriterId_extraInitializers = [];
        let _state_decorators;
        let _state_initializers = [];
        let _state_extraInitializers = [];
        let _version_decorators;
        let _version_initializers = [];
        let _version_extraInitializers = [];
        let _parentPolicyId_decorators;
        let _parentPolicyId_initializers = [];
        let _parentPolicyId_extraInitializers = [];
        let _bundleId_decorators;
        let _bundleId_initializers = [];
        let _bundleId_extraInitializers = [];
        let _autoRenew_decorators;
        let _autoRenew_initializers = [];
        let _autoRenew_extraInitializers = [];
        let _coverages_decorators;
        let _coverages_initializers = [];
        let _coverages_extraInitializers = [];
        let _deductibles_decorators;
        let _deductibles_initializers = [];
        let _deductibles_extraInitializers = [];
        let _limits_decorators;
        let _limits_initializers = [];
        let _limits_extraInitializers = [];
        let _discounts_decorators;
        let _discounts_initializers = [];
        let _discounts_extraInitializers = [];
        let _surcharges_decorators;
        let _surcharges_initializers = [];
        let _surcharges_extraInitializers = [];
        let _billingAddress_decorators;
        let _billingAddress_initializers = [];
        let _billingAddress_extraInitializers = [];
        let _mailingAddress_decorators;
        let _mailingAddress_initializers = [];
        let _mailingAddress_extraInitializers = [];
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
        var Policy = _classThis = class extends _classSuper {
            constructor() {
                super(...arguments);
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.policyNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _policyNumber_initializers, void 0));
                this.policyType = (__runInitializers(this, _policyNumber_extraInitializers), __runInitializers(this, _policyType_initializers, void 0));
                this.status = (__runInitializers(this, _policyType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.policyHolderId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _policyHolderId_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _policyHolderId_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.expirationDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
                this.bindDate = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _bindDate_initializers, void 0));
                this.issueDate = (__runInitializers(this, _bindDate_extraInitializers), __runInitializers(this, _issueDate_initializers, void 0));
                this.cancellationDate = (__runInitializers(this, _issueDate_extraInitializers), __runInitializers(this, _cancellationDate_initializers, void 0));
                this.cancellationReason = (__runInitializers(this, _cancellationDate_extraInitializers), __runInitializers(this, _cancellationReason_initializers, void 0));
                this.premiumAmount = (__runInitializers(this, _cancellationReason_extraInitializers), __runInitializers(this, _premiumAmount_initializers, void 0));
                this.paymentFrequency = (__runInitializers(this, _premiumAmount_extraInitializers), __runInitializers(this, _paymentFrequency_initializers, void 0));
                this.agentId = (__runInitializers(this, _paymentFrequency_extraInitializers), __runInitializers(this, _agentId_initializers, void 0));
                this.agencyId = (__runInitializers(this, _agentId_extraInitializers), __runInitializers(this, _agencyId_initializers, void 0));
                this.underwriterId = (__runInitializers(this, _agencyId_extraInitializers), __runInitializers(this, _underwriterId_initializers, void 0));
                this.state = (__runInitializers(this, _underwriterId_extraInitializers), __runInitializers(this, _state_initializers, void 0));
                this.version = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, _version_initializers, void 0));
                this.parentPolicyId = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _parentPolicyId_initializers, void 0));
                this.bundleId = (__runInitializers(this, _parentPolicyId_extraInitializers), __runInitializers(this, _bundleId_initializers, void 0));
                this.autoRenew = (__runInitializers(this, _bundleId_extraInitializers), __runInitializers(this, _autoRenew_initializers, void 0));
                this.coverages = (__runInitializers(this, _autoRenew_extraInitializers), __runInitializers(this, _coverages_initializers, void 0));
                this.deductibles = (__runInitializers(this, _coverages_extraInitializers), __runInitializers(this, _deductibles_initializers, void 0));
                this.limits = (__runInitializers(this, _deductibles_extraInitializers), __runInitializers(this, _limits_initializers, void 0));
                this.discounts = (__runInitializers(this, _limits_extraInitializers), __runInitializers(this, _discounts_initializers, void 0));
                this.surcharges = (__runInitializers(this, _discounts_extraInitializers), __runInitializers(this, _surcharges_initializers, void 0));
                this.billingAddress = (__runInitializers(this, _surcharges_extraInitializers), __runInitializers(this, _billingAddress_initializers, void 0));
                this.mailingAddress = (__runInitializers(this, _billingAddress_extraInitializers), __runInitializers(this, _mailingAddress_initializers, void 0));
                this.metadata = (__runInitializers(this, _mailingAddress_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
                __runInitializers(this, _deletedAt_extraInitializers);
            }
        };
        __setFunctionName(_classThis, "Policy");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _id_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.UUID,
                    defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                    primaryKey: true,
                })];
            _policyNumber_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.STRING(50),
                    allowNull: false,
                    unique: true,
                })];
            _policyType_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.ENUM(...Object.values(PolicyType)),
                    allowNull: false,
                })];
            _status_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.ENUM(...Object.values(PolicyStatus)),
                    allowNull: false,
                    defaultValue: PolicyStatus.QUOTE,
                })];
            _policyHolderId_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.UUID,
                    allowNull: false,
                })];
            _effectiveDate_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.DATE,
                    allowNull: false,
                })];
            _expirationDate_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.DATE,
                    allowNull: false,
                })];
            _bindDate_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.DATE,
                    allowNull: true,
                })];
            _issueDate_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.DATE,
                    allowNull: true,
                })];
            _cancellationDate_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.DATE,
                    allowNull: true,
                })];
            _cancellationReason_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.ENUM(...Object.values(CancellationReason)),
                    allowNull: true,
                })];
            _premiumAmount_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.DECIMAL(12, 2),
                    allowNull: false,
                })];
            _paymentFrequency_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.ENUM(...Object.values(PaymentFrequency)),
                    allowNull: false,
                })];
            _agentId_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.UUID,
                    allowNull: true,
                })];
            _agencyId_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.UUID,
                    allowNull: true,
                })];
            _underwriterId_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.UUID,
                    allowNull: true,
                })];
            _state_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.STRING(2),
                    allowNull: false,
                })];
            _version_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.INTEGER,
                    allowNull: false,
                    defaultValue: 1,
                })];
            _parentPolicyId_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.UUID,
                    allowNull: true,
                })];
            _bundleId_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.UUID,
                    allowNull: true,
                })];
            _autoRenew_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                })];
            _coverages_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.JSONB,
                    allowNull: false,
                })];
            _deductibles_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.JSONB,
                    allowNull: true,
                })];
            _limits_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.JSONB,
                    allowNull: true,
                })];
            _discounts_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.JSONB,
                    allowNull: true,
                })];
            _surcharges_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.JSONB,
                    allowNull: true,
                })];
            _billingAddress_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.JSONB,
                    allowNull: true,
                })];
            _mailingAddress_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.JSONB,
                    allowNull: true,
                })];
            _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.JSONB,
                    allowNull: true,
                })];
            _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
            _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
            _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _policyNumber_decorators, { kind: "field", name: "policyNumber", static: false, private: false, access: { has: obj => "policyNumber" in obj, get: obj => obj.policyNumber, set: (obj, value) => { obj.policyNumber = value; } }, metadata: _metadata }, _policyNumber_initializers, _policyNumber_extraInitializers);
            __esDecorate(null, null, _policyType_decorators, { kind: "field", name: "policyType", static: false, private: false, access: { has: obj => "policyType" in obj, get: obj => obj.policyType, set: (obj, value) => { obj.policyType = value; } }, metadata: _metadata }, _policyType_initializers, _policyType_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _policyHolderId_decorators, { kind: "field", name: "policyHolderId", static: false, private: false, access: { has: obj => "policyHolderId" in obj, get: obj => obj.policyHolderId, set: (obj, value) => { obj.policyHolderId = value; } }, metadata: _metadata }, _policyHolderId_initializers, _policyHolderId_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
            __esDecorate(null, null, _bindDate_decorators, { kind: "field", name: "bindDate", static: false, private: false, access: { has: obj => "bindDate" in obj, get: obj => obj.bindDate, set: (obj, value) => { obj.bindDate = value; } }, metadata: _metadata }, _bindDate_initializers, _bindDate_extraInitializers);
            __esDecorate(null, null, _issueDate_decorators, { kind: "field", name: "issueDate", static: false, private: false, access: { has: obj => "issueDate" in obj, get: obj => obj.issueDate, set: (obj, value) => { obj.issueDate = value; } }, metadata: _metadata }, _issueDate_initializers, _issueDate_extraInitializers);
            __esDecorate(null, null, _cancellationDate_decorators, { kind: "field", name: "cancellationDate", static: false, private: false, access: { has: obj => "cancellationDate" in obj, get: obj => obj.cancellationDate, set: (obj, value) => { obj.cancellationDate = value; } }, metadata: _metadata }, _cancellationDate_initializers, _cancellationDate_extraInitializers);
            __esDecorate(null, null, _cancellationReason_decorators, { kind: "field", name: "cancellationReason", static: false, private: false, access: { has: obj => "cancellationReason" in obj, get: obj => obj.cancellationReason, set: (obj, value) => { obj.cancellationReason = value; } }, metadata: _metadata }, _cancellationReason_initializers, _cancellationReason_extraInitializers);
            __esDecorate(null, null, _premiumAmount_decorators, { kind: "field", name: "premiumAmount", static: false, private: false, access: { has: obj => "premiumAmount" in obj, get: obj => obj.premiumAmount, set: (obj, value) => { obj.premiumAmount = value; } }, metadata: _metadata }, _premiumAmount_initializers, _premiumAmount_extraInitializers);
            __esDecorate(null, null, _paymentFrequency_decorators, { kind: "field", name: "paymentFrequency", static: false, private: false, access: { has: obj => "paymentFrequency" in obj, get: obj => obj.paymentFrequency, set: (obj, value) => { obj.paymentFrequency = value; } }, metadata: _metadata }, _paymentFrequency_initializers, _paymentFrequency_extraInitializers);
            __esDecorate(null, null, _agentId_decorators, { kind: "field", name: "agentId", static: false, private: false, access: { has: obj => "agentId" in obj, get: obj => obj.agentId, set: (obj, value) => { obj.agentId = value; } }, metadata: _metadata }, _agentId_initializers, _agentId_extraInitializers);
            __esDecorate(null, null, _agencyId_decorators, { kind: "field", name: "agencyId", static: false, private: false, access: { has: obj => "agencyId" in obj, get: obj => obj.agencyId, set: (obj, value) => { obj.agencyId = value; } }, metadata: _metadata }, _agencyId_initializers, _agencyId_extraInitializers);
            __esDecorate(null, null, _underwriterId_decorators, { kind: "field", name: "underwriterId", static: false, private: false, access: { has: obj => "underwriterId" in obj, get: obj => obj.underwriterId, set: (obj, value) => { obj.underwriterId = value; } }, metadata: _metadata }, _underwriterId_initializers, _underwriterId_extraInitializers);
            __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: obj => "state" in obj, get: obj => obj.state, set: (obj, value) => { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
            __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
            __esDecorate(null, null, _parentPolicyId_decorators, { kind: "field", name: "parentPolicyId", static: false, private: false, access: { has: obj => "parentPolicyId" in obj, get: obj => obj.parentPolicyId, set: (obj, value) => { obj.parentPolicyId = value; } }, metadata: _metadata }, _parentPolicyId_initializers, _parentPolicyId_extraInitializers);
            __esDecorate(null, null, _bundleId_decorators, { kind: "field", name: "bundleId", static: false, private: false, access: { has: obj => "bundleId" in obj, get: obj => obj.bundleId, set: (obj, value) => { obj.bundleId = value; } }, metadata: _metadata }, _bundleId_initializers, _bundleId_extraInitializers);
            __esDecorate(null, null, _autoRenew_decorators, { kind: "field", name: "autoRenew", static: false, private: false, access: { has: obj => "autoRenew" in obj, get: obj => obj.autoRenew, set: (obj, value) => { obj.autoRenew = value; } }, metadata: _metadata }, _autoRenew_initializers, _autoRenew_extraInitializers);
            __esDecorate(null, null, _coverages_decorators, { kind: "field", name: "coverages", static: false, private: false, access: { has: obj => "coverages" in obj, get: obj => obj.coverages, set: (obj, value) => { obj.coverages = value; } }, metadata: _metadata }, _coverages_initializers, _coverages_extraInitializers);
            __esDecorate(null, null, _deductibles_decorators, { kind: "field", name: "deductibles", static: false, private: false, access: { has: obj => "deductibles" in obj, get: obj => obj.deductibles, set: (obj, value) => { obj.deductibles = value; } }, metadata: _metadata }, _deductibles_initializers, _deductibles_extraInitializers);
            __esDecorate(null, null, _limits_decorators, { kind: "field", name: "limits", static: false, private: false, access: { has: obj => "limits" in obj, get: obj => obj.limits, set: (obj, value) => { obj.limits = value; } }, metadata: _metadata }, _limits_initializers, _limits_extraInitializers);
            __esDecorate(null, null, _discounts_decorators, { kind: "field", name: "discounts", static: false, private: false, access: { has: obj => "discounts" in obj, get: obj => obj.discounts, set: (obj, value) => { obj.discounts = value; } }, metadata: _metadata }, _discounts_initializers, _discounts_extraInitializers);
            __esDecorate(null, null, _surcharges_decorators, { kind: "field", name: "surcharges", static: false, private: false, access: { has: obj => "surcharges" in obj, get: obj => obj.surcharges, set: (obj, value) => { obj.surcharges = value; } }, metadata: _metadata }, _surcharges_initializers, _surcharges_extraInitializers);
            __esDecorate(null, null, _billingAddress_decorators, { kind: "field", name: "billingAddress", static: false, private: false, access: { has: obj => "billingAddress" in obj, get: obj => obj.billingAddress, set: (obj, value) => { obj.billingAddress = value; } }, metadata: _metadata }, _billingAddress_initializers, _billingAddress_extraInitializers);
            __esDecorate(null, null, _mailingAddress_decorators, { kind: "field", name: "mailingAddress", static: false, private: false, access: { has: obj => "mailingAddress" in obj, get: obj => obj.mailingAddress, set: (obj, value) => { obj.mailingAddress = value; } }, metadata: _metadata }, _mailingAddress_initializers, _mailingAddress_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            Policy = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return Policy = _classThis;
    })();
    return Policy;
};
exports.createPolicyModel = createPolicyModel;
/**
 * Creates PolicyAuditLog model for Sequelize.
 */
const createPolicyAuditLogModel = (sequelize) => {
    let PolicyAuditLog = (() => {
        let _classDecorators = [(0, sequelize_typescript_1.Table)({
                tableName: 'policy_audit_logs',
                timestamps: true,
                updatedAt: false,
                indexes: [
                    { fields: ['policyId'] },
                    { fields: ['action'] },
                    { fields: ['performedBy'] },
                    { fields: ['performedAt'] },
                ],
            })];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = sequelize_typescript_1.Model;
        let _id_decorators;
        let _id_initializers = [];
        let _id_extraInitializers = [];
        let _policyId_decorators;
        let _policyId_initializers = [];
        let _policyId_extraInitializers = [];
        let _action_decorators;
        let _action_initializers = [];
        let _action_extraInitializers = [];
        let _versionReason_decorators;
        let _versionReason_initializers = [];
        let _versionReason_extraInitializers = [];
        let _previousStatus_decorators;
        let _previousStatus_initializers = [];
        let _previousStatus_extraInitializers = [];
        let _newStatus_decorators;
        let _newStatus_initializers = [];
        let _newStatus_extraInitializers = [];
        let _changes_decorators;
        let _changes_initializers = [];
        let _changes_extraInitializers = [];
        let _performedBy_decorators;
        let _performedBy_initializers = [];
        let _performedBy_extraInitializers = [];
        let _performedAt_decorators;
        let _performedAt_initializers = [];
        let _performedAt_extraInitializers = [];
        let _notes_decorators;
        let _notes_initializers = [];
        let _notes_extraInitializers = [];
        let _createdAt_decorators;
        let _createdAt_initializers = [];
        let _createdAt_extraInitializers = [];
        var PolicyAuditLog = _classThis = class extends _classSuper {
            constructor() {
                super(...arguments);
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.policyId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _policyId_initializers, void 0));
                this.action = (__runInitializers(this, _policyId_extraInitializers), __runInitializers(this, _action_initializers, void 0));
                this.versionReason = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _versionReason_initializers, void 0));
                this.previousStatus = (__runInitializers(this, _versionReason_extraInitializers), __runInitializers(this, _previousStatus_initializers, void 0));
                this.newStatus = (__runInitializers(this, _previousStatus_extraInitializers), __runInitializers(this, _newStatus_initializers, void 0));
                this.changes = (__runInitializers(this, _newStatus_extraInitializers), __runInitializers(this, _changes_initializers, void 0));
                this.performedBy = (__runInitializers(this, _changes_extraInitializers), __runInitializers(this, _performedBy_initializers, void 0));
                this.performedAt = (__runInitializers(this, _performedBy_extraInitializers), __runInitializers(this, _performedAt_initializers, void 0));
                this.notes = (__runInitializers(this, _performedAt_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                __runInitializers(this, _createdAt_extraInitializers);
            }
        };
        __setFunctionName(_classThis, "PolicyAuditLog");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _id_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.UUID,
                    defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                    primaryKey: true,
                })];
            _policyId_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.UUID,
                    allowNull: false,
                })];
            _action_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.STRING(100),
                    allowNull: false,
                })];
            _versionReason_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.ENUM(...Object.values(VersionReason)),
                    allowNull: false,
                })];
            _previousStatus_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.ENUM(...Object.values(PolicyStatus)),
                    allowNull: true,
                })];
            _newStatus_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.ENUM(...Object.values(PolicyStatus)),
                    allowNull: true,
                })];
            _changes_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.JSONB,
                    allowNull: false,
                })];
            _performedBy_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.UUID,
                    allowNull: false,
                })];
            _performedAt_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.DATE,
                    allowNull: false,
                    defaultValue: sequelize_typescript_1.DataType.NOW,
                })];
            _notes_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.TEXT,
                    allowNull: true,
                })];
            _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _policyId_decorators, { kind: "field", name: "policyId", static: false, private: false, access: { has: obj => "policyId" in obj, get: obj => obj.policyId, set: (obj, value) => { obj.policyId = value; } }, metadata: _metadata }, _policyId_initializers, _policyId_extraInitializers);
            __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: obj => "action" in obj, get: obj => obj.action, set: (obj, value) => { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
            __esDecorate(null, null, _versionReason_decorators, { kind: "field", name: "versionReason", static: false, private: false, access: { has: obj => "versionReason" in obj, get: obj => obj.versionReason, set: (obj, value) => { obj.versionReason = value; } }, metadata: _metadata }, _versionReason_initializers, _versionReason_extraInitializers);
            __esDecorate(null, null, _previousStatus_decorators, { kind: "field", name: "previousStatus", static: false, private: false, access: { has: obj => "previousStatus" in obj, get: obj => obj.previousStatus, set: (obj, value) => { obj.previousStatus = value; } }, metadata: _metadata }, _previousStatus_initializers, _previousStatus_extraInitializers);
            __esDecorate(null, null, _newStatus_decorators, { kind: "field", name: "newStatus", static: false, private: false, access: { has: obj => "newStatus" in obj, get: obj => obj.newStatus, set: (obj, value) => { obj.newStatus = value; } }, metadata: _metadata }, _newStatus_initializers, _newStatus_extraInitializers);
            __esDecorate(null, null, _changes_decorators, { kind: "field", name: "changes", static: false, private: false, access: { has: obj => "changes" in obj, get: obj => obj.changes, set: (obj, value) => { obj.changes = value; } }, metadata: _metadata }, _changes_initializers, _changes_extraInitializers);
            __esDecorate(null, null, _performedBy_decorators, { kind: "field", name: "performedBy", static: false, private: false, access: { has: obj => "performedBy" in obj, get: obj => obj.performedBy, set: (obj, value) => { obj.performedBy = value; } }, metadata: _metadata }, _performedBy_initializers, _performedBy_extraInitializers);
            __esDecorate(null, null, _performedAt_decorators, { kind: "field", name: "performedAt", static: false, private: false, access: { has: obj => "performedAt" in obj, get: obj => obj.performedAt, set: (obj, value) => { obj.performedAt = value; } }, metadata: _metadata }, _performedAt_initializers, _performedAt_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PolicyAuditLog = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return PolicyAuditLog = _classThis;
    })();
    return PolicyAuditLog;
};
exports.createPolicyAuditLogModel = createPolicyAuditLogModel;
// ============================================================================
// 1. POLICY CREATION & QUOTE MANAGEMENT
// ============================================================================
/**
 * 1. Creates a new insurance policy quote.
 *
 * @param {PolicyCreationData} data - Policy creation data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created policy quote
 *
 * @example
 * ```typescript
 * const quote = await createPolicyQuote({
 *   policyType: PolicyType.AUTO,
 *   policyHolderId: 'holder-123',
 *   effectiveDate: new Date('2025-01-01'),
 *   expirationDate: new Date('2026-01-01'),
 *   premiumAmount: 1200.00,
 *   paymentFrequency: PaymentFrequency.MONTHLY,
 *   state: 'CA',
 *   coverages: [...]
 * });
 * ```
 */
const createPolicyQuote = async (data, transaction) => {
    const policyNumber = await generatePolicyNumber(data.policyType, data.state);
    const policy = {
        policyNumber,
        policyType: data.policyType,
        status: PolicyStatus.QUOTE,
        policyHolderId: data.policyHolderId,
        effectiveDate: data.effectiveDate,
        expirationDate: data.expirationDate,
        premiumAmount: data.premiumAmount,
        paymentFrequency: data.paymentFrequency,
        agentId: data.agentId,
        agencyId: data.agencyId,
        underwriterId: data.underwriterId,
        state: data.state,
        version: 1,
        autoRenew: false,
        coverages: data.coverages,
        deductibles: data.deductibles,
        limits: data.limits,
        discounts: data.discounts,
        surcharges: data.surcharges,
        billingAddress: data.billingAddress,
        mailingAddress: data.mailingAddress,
        metadata: data.metadata,
    };
    // Would use actual Sequelize model here
    return policy;
};
exports.createPolicyQuote = createPolicyQuote;
/**
 * 2. Binds a policy quote (quote → bound transition).
 *
 * @param {string} policyId - Policy ID
 * @param {string} boundBy - User ID who bound the policy
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Bound policy
 */
const bindPolicy = async (policyId, boundBy, transaction) => {
    const policy = await getPolicyById(policyId, transaction);
    if (policy.status !== PolicyStatus.QUOTE && policy.status !== PolicyStatus.QUOTED) {
        throw new common_1.BadRequestException('Only quote status policies can be bound');
    }
    policy.status = PolicyStatus.BOUND;
    policy.bindDate = new Date();
    await createAuditLog({
        policyId,
        action: 'bind_policy',
        versionReason: VersionReason.NEW_BUSINESS,
        previousStatus: PolicyStatus.QUOTE,
        newStatus: PolicyStatus.BOUND,
        changes: { bindDate: policy.bindDate },
        performedBy: boundBy,
        performedAt: new Date(),
    }, transaction);
    return policy;
};
exports.bindPolicy = bindPolicy;
/**
 * 3. Issues a bound policy (bound → issued transition).
 *
 * @param {string} policyId - Policy ID
 * @param {string} issuedBy - User ID who issued the policy
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Issued policy
 */
const issuePolicy = async (policyId, issuedBy, transaction) => {
    const policy = await getPolicyById(policyId, transaction);
    if (policy.status !== PolicyStatus.BOUND) {
        throw new common_1.BadRequestException('Only bound policies can be issued');
    }
    policy.status = PolicyStatus.ISSUED;
    policy.issueDate = new Date();
    await createAuditLog({
        policyId,
        action: 'issue_policy',
        versionReason: VersionReason.NEW_BUSINESS,
        previousStatus: PolicyStatus.BOUND,
        newStatus: PolicyStatus.ISSUED,
        changes: { issueDate: policy.issueDate },
        performedBy: issuedBy,
        performedAt: new Date(),
    }, transaction);
    return policy;
};
exports.issuePolicy = issuePolicy;
/**
 * 4. Activates an issued policy (issued → active transition).
 *
 * @param {string} policyId - Policy ID
 * @param {string} activatedBy - User ID who activated the policy
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Active policy
 */
const activatePolicy = async (policyId, activatedBy, transaction) => {
    const policy = await getPolicyById(policyId, transaction);
    if (policy.status !== PolicyStatus.ISSUED) {
        throw new common_1.BadRequestException('Only issued policies can be activated');
    }
    if (new Date() < policy.effectiveDate) {
        throw new common_1.BadRequestException('Cannot activate policy before effective date');
    }
    policy.status = PolicyStatus.ACTIVE;
    await createAuditLog({
        policyId,
        action: 'activate_policy',
        versionReason: VersionReason.NEW_BUSINESS,
        previousStatus: PolicyStatus.ISSUED,
        newStatus: PolicyStatus.ACTIVE,
        changes: {},
        performedBy: activatedBy,
        performedAt: new Date(),
    }, transaction);
    return policy;
};
exports.activatePolicy = activatePolicy;
// ============================================================================
// 2. POLICY MODIFICATION & VERSIONING
// ============================================================================
/**
 * 5. Modifies an existing policy (creates new version).
 *
 * @param {PolicyModificationData} data - Modification data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Modified policy version
 */
const modifyPolicy = async (data, transaction) => {
    const currentPolicy = await getPolicyById(data.policyId, transaction);
    const newVersion = {
        ...currentPolicy,
        version: currentPolicy.version + 1,
        parentPolicyId: currentPolicy.id,
        effectiveDate: data.effectiveDate,
    };
    // Apply changes
    data.changes.forEach(change => {
        newVersion[change.field] = change.newValue;
    });
    await createAuditLog({
        policyId: data.policyId,
        action: 'modify_policy',
        versionReason: data.reason,
        previousStatus: currentPolicy.status,
        newStatus: currentPolicy.status,
        changes: data.changes,
        performedBy: data.requestedBy,
        performedAt: new Date(),
        notes: data.notes,
    }, transaction);
    return newVersion;
};
exports.modifyPolicy = modifyPolicy;
/**
 * 6. Retrieves policy version history.
 *
 * @param {string} policyId - Policy ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Policy version history
 */
const getPolicyVersionHistory = async (policyId, transaction) => {
    // Would query all versions linked to this policy
    return [];
};
exports.getPolicyVersionHistory = getPolicyVersionHistory;
/**
 * 7. Compares two policy versions.
 *
 * @param {string} policyId1 - First policy version ID
 * @param {string} policyId2 - Second policy version ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PolicyChange[]>} Differences between versions
 */
const comparePolicyVersions = async (policyId1, policyId2, transaction) => {
    const policy1 = await getPolicyById(policyId1, transaction);
    const policy2 = await getPolicyById(policyId2, transaction);
    const changes = [];
    // Compare fields and build change array
    const fields = ['premiumAmount', 'coverages', 'deductibles', 'limits'];
    fields.forEach(field => {
        if (JSON.stringify(policy1[field]) !== JSON.stringify(policy2[field])) {
            changes.push({
                field,
                oldValue: policy1[field],
                newValue: policy2[field],
            });
        }
    });
    return changes;
};
exports.comparePolicyVersions = comparePolicyVersions;
/**
 * 8. Rolls back to a previous policy version.
 *
 * @param {string} policyId - Current policy ID
 * @param {number} targetVersion - Target version number
 * @param {string} rolledBackBy - User performing rollback
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Rolled back policy
 */
const rollbackPolicyVersion = async (policyId, targetVersion, rolledBackBy, transaction) => {
    const versions = await (0, exports.getPolicyVersionHistory)(policyId, transaction);
    const targetPolicy = versions.find(v => v.version === targetVersion);
    if (!targetPolicy) {
        throw new common_1.NotFoundException(`Policy version ${targetVersion} not found`);
    }
    await createAuditLog({
        policyId,
        action: 'rollback_version',
        versionReason: VersionReason.CORRECTION,
        previousStatus: PolicyStatus.ACTIVE,
        newStatus: PolicyStatus.ACTIVE,
        changes: { rolledBackToVersion: targetVersion },
        performedBy: rolledBackBy,
        performedAt: new Date(),
    }, transaction);
    return targetPolicy;
};
exports.rollbackPolicyVersion = rollbackPolicyVersion;
// ============================================================================
// 3. POLICY LIFECYCLE MANAGEMENT
// ============================================================================
/**
 * 9. Cancels a policy.
 *
 * @param {string} policyId - Policy ID
 * @param {CancellationReason} reason - Cancellation reason
 * @param {Date} cancellationDate - Effective cancellation date
 * @param {string} cancelledBy - User cancelling the policy
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cancelled policy
 */
const cancelPolicy = async (policyId, reason, cancellationDate, cancelledBy, transaction) => {
    const policy = await getPolicyById(policyId, transaction);
    if (![PolicyStatus.ACTIVE, PolicyStatus.ISSUED, PolicyStatus.BOUND].includes(policy.status)) {
        throw new common_1.BadRequestException('Policy cannot be cancelled in current status');
    }
    const previousStatus = policy.status;
    policy.status = PolicyStatus.CANCELLED;
    policy.cancellationDate = cancellationDate;
    policy.cancellationReason = reason;
    await createAuditLog({
        policyId,
        action: 'cancel_policy',
        versionReason: VersionReason.CANCELLATION,
        previousStatus,
        newStatus: PolicyStatus.CANCELLED,
        changes: { cancellationDate, cancellationReason: reason },
        performedBy: cancelledBy,
        performedAt: new Date(),
    }, transaction);
    return policy;
};
exports.cancelPolicy = cancelPolicy;
/**
 * 10. Reinstates a cancelled or lapsed policy.
 *
 * @param {ReinstatementData} data - Reinstatement data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reinstated policy
 */
const reinstatePolicy = async (data, transaction) => {
    const policy = await getPolicyById(data.policyId, transaction);
    if (![PolicyStatus.CANCELLED, PolicyStatus.LAPSED].includes(policy.status)) {
        throw new common_1.BadRequestException('Only cancelled or lapsed policies can be reinstated');
    }
    const previousStatus = policy.status;
    policy.status = PolicyStatus.REINSTATED;
    policy.cancellationDate = null;
    policy.cancellationReason = null;
    await createAuditLog({
        policyId: data.policyId,
        action: 'reinstate_policy',
        versionReason: VersionReason.REINSTATEMENT,
        previousStatus,
        newStatus: PolicyStatus.REINSTATED,
        changes: {
            reinstatementDate: data.reinstatementDate,
            reinstatementReason: data.reinstatementReason,
            reinstatementFee: data.reinstatementFee,
            backPremiumDue: data.backPremiumDue,
        },
        performedBy: data.requestedBy,
        performedAt: new Date(),
        notes: data.notes,
    }, transaction);
    return policy;
};
exports.reinstatePolicy = reinstatePolicy;
/**
 * 11. Suspends a policy temporarily.
 *
 * @param {string} policyId - Policy ID
 * @param {string} reason - Suspension reason
 * @param {string} suspendedBy - User suspending the policy
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Suspended policy
 */
const suspendPolicy = async (policyId, reason, suspendedBy, transaction) => {
    const policy = await getPolicyById(policyId, transaction);
    if (policy.status !== PolicyStatus.ACTIVE) {
        throw new common_1.BadRequestException('Only active policies can be suspended');
    }
    const previousStatus = policy.status;
    policy.status = PolicyStatus.SUSPENDED;
    await createAuditLog({
        policyId,
        action: 'suspend_policy',
        versionReason: VersionReason.MIDTERM_CHANGE,
        previousStatus,
        newStatus: PolicyStatus.SUSPENDED,
        changes: { suspensionReason: reason },
        performedBy: suspendedBy,
        performedAt: new Date(),
    }, transaction);
    return policy;
};
exports.suspendPolicy = suspendPolicy;
/**
 * 12. Terminates a policy.
 *
 * @param {string} policyId - Policy ID
 * @param {string} reason - Termination reason
 * @param {Date} terminationDate - Effective termination date
 * @param {string} terminatedBy - User terminating the policy
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Terminated policy
 */
const terminatePolicy = async (policyId, reason, terminationDate, terminatedBy, transaction) => {
    const policy = await getPolicyById(policyId, transaction);
    const previousStatus = policy.status;
    policy.status = PolicyStatus.TERMINATED;
    await createAuditLog({
        policyId,
        action: 'terminate_policy',
        versionReason: VersionReason.CANCELLATION,
        previousStatus,
        newStatus: PolicyStatus.TERMINATED,
        changes: { terminationDate, terminationReason: reason },
        performedBy: terminatedBy,
        performedAt: new Date(),
    }, transaction);
    return policy;
};
exports.terminatePolicy = terminatePolicy;
// ============================================================================
// 4. POLICY RENEWAL
// ============================================================================
/**
 * 13. Creates a renewal offer for expiring policy.
 *
 * @param {RenewalConfiguration} config - Renewal configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Renewal policy offer
 */
const createRenewalOffer = async (config, transaction) => {
    const currentPolicy = await getPolicyById(config.policyId, transaction);
    if (currentPolicy.status !== PolicyStatus.ACTIVE) {
        throw new common_1.BadRequestException('Only active policies can be renewed');
    }
    const renewalPolicy = {
        ...currentPolicy,
        id: undefined, // New ID will be generated
        policyNumber: await generatePolicyNumber(currentPolicy.policyType, currentPolicy.state),
        status: PolicyStatus.PENDING_RENEWAL,
        effectiveDate: config.newEffectiveDate,
        expirationDate: config.newExpirationDate,
        premiumAmount: config.premiumAmount || currentPolicy.premiumAmount,
        version: 1,
        parentPolicyId: currentPolicy.id,
        autoRenew: config.autoRenew,
    };
    // Apply renewal changes if any
    if (config.renewalChanges) {
        config.renewalChanges.forEach(change => {
            renewalPolicy[change.field] = change.newValue;
        });
    }
    return renewalPolicy;
};
exports.createRenewalOffer = createRenewalOffer;
/**
 * 14. Accepts a renewal offer.
 *
 * @param {string} renewalPolicyId - Renewal policy ID
 * @param {string} acceptedBy - User accepting renewal
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Renewed policy
 */
const acceptRenewal = async (renewalPolicyId, acceptedBy, transaction) => {
    const renewalPolicy = await getPolicyById(renewalPolicyId, transaction);
    if (renewalPolicy.status !== PolicyStatus.PENDING_RENEWAL) {
        throw new common_1.BadRequestException('Policy is not pending renewal');
    }
    renewalPolicy.status = PolicyStatus.RENEWED;
    await createAuditLog({
        policyId: renewalPolicyId,
        action: 'accept_renewal',
        versionReason: VersionReason.RENEWAL,
        previousStatus: PolicyStatus.PENDING_RENEWAL,
        newStatus: PolicyStatus.RENEWED,
        changes: {},
        performedBy: acceptedBy,
        performedAt: new Date(),
    }, transaction);
    return renewalPolicy;
};
exports.acceptRenewal = acceptRenewal;
/**
 * 15. Declines a renewal offer.
 *
 * @param {string} renewalPolicyId - Renewal policy ID
 * @param {string} reason - Decline reason
 * @param {string} declinedBy - User declining renewal
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Result
 */
const declineRenewal = async (renewalPolicyId, reason, declinedBy, transaction) => {
    const renewalPolicy = await getPolicyById(renewalPolicyId, transaction);
    if (renewalPolicy.status !== PolicyStatus.PENDING_RENEWAL) {
        throw new common_1.BadRequestException('Policy is not pending renewal');
    }
    renewalPolicy.status = PolicyStatus.CANCELLED;
    await createAuditLog({
        policyId: renewalPolicyId,
        action: 'decline_renewal',
        versionReason: VersionReason.CANCELLATION,
        previousStatus: PolicyStatus.PENDING_RENEWAL,
        newStatus: PolicyStatus.CANCELLED,
        changes: { declineReason: reason },
        performedBy: declinedBy,
        performedAt: new Date(),
    }, transaction);
    return { success: true, reason };
};
exports.declineRenewal = declineRenewal;
/**
 * 16. Processes automatic renewals.
 *
 * @param {Date} asOfDate - Process renewals as of this date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Processed renewals
 */
const processAutoRenewals = async (asOfDate, transaction) => {
    // Would query policies eligible for auto-renewal
    const eligiblePolicies = [];
    const renewals = [];
    for (const policy of eligiblePolicies) {
        const renewal = await (0, exports.createRenewalOffer)({
            policyId: policy.id,
            newEffectiveDate: policy.expirationDate,
            newExpirationDate: new Date(policy.expirationDate.getFullYear() + 1, policy.expirationDate.getMonth(), policy.expirationDate.getDate()),
            autoRenew: true,
        }, transaction);
        await (0, exports.acceptRenewal)(renewal.id, 'system', transaction);
        renewals.push(renewal);
    }
    return renewals;
};
exports.processAutoRenewals = processAutoRenewals;
// ============================================================================
// 5. POLICY BUNDLE MANAGEMENT
// ============================================================================
/**
 * 17. Creates a multi-product policy bundle.
 *
 * @param {BundleConfiguration} config - Bundle configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created bundle with policies
 */
const createPolicyBundle = async (config, transaction) => {
    const bundleId = generateUUID();
    const createdPolicies = [];
    for (const bundlePolicy of config.policies) {
        const policyData = {
            ...bundlePolicy.policyData,
            bundleId,
        };
        const policy = await (0, exports.createPolicyQuote)(policyData, transaction);
        createdPolicies.push(policy);
    }
    const bundle = {
        id: bundleId,
        bundleName: config.bundleName,
        policyHolderId: config.policyHolderId,
        policies: createdPolicies,
        bundleDiscount: config.bundleDiscount,
        bundleDiscountPercentage: config.bundleDiscountPercentage,
        effectiveDate: config.effectiveDate,
        expirationDate: config.expirationDate,
        totalPremium: createdPolicies.reduce((sum, p) => sum + p.premiumAmount, 0) - (config.bundleDiscount || 0),
    };
    return bundle;
};
exports.createPolicyBundle = createPolicyBundle;
/**
 * 18. Adds a policy to an existing bundle.
 *
 * @param {string} bundleId - Bundle ID
 * @param {PolicyCreationData} policyData - New policy data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated bundle
 */
const addPolicyToBundle = async (bundleId, policyData, transaction) => {
    const newPolicy = await (0, exports.createPolicyQuote)({
        ...policyData,
        bundleId,
    }, transaction);
    return newPolicy;
};
exports.addPolicyToBundle = addPolicyToBundle;
/**
 * 19. Removes a policy from a bundle.
 *
 * @param {string} policyId - Policy ID to remove
 * @param {string} removedBy - User removing policy
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated bundle
 */
const removePolicyFromBundle = async (policyId, removedBy, transaction) => {
    const policy = await getPolicyById(policyId, transaction);
    if (!policy.bundleId) {
        throw new common_1.BadRequestException('Policy is not part of a bundle');
    }
    const previousBundleId = policy.bundleId;
    policy.bundleId = null;
    await createAuditLog({
        policyId,
        action: 'remove_from_bundle',
        versionReason: VersionReason.MIDTERM_CHANGE,
        previousStatus: policy.status,
        newStatus: policy.status,
        changes: { bundleId: { old: previousBundleId, new: null } },
        performedBy: removedBy,
        performedAt: new Date(),
    }, transaction);
    return policy;
};
exports.removePolicyFromBundle = removePolicyFromBundle;
/**
 * 20. Retrieves all policies in a bundle.
 *
 * @param {string} bundleId - Bundle ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Bundle policies
 */
const getBundlePolicies = async (bundleId, transaction) => {
    // Would query policies with matching bundleId
    return [];
};
exports.getBundlePolicies = getBundlePolicies;
// ============================================================================
// 6. POLICY HOLDER & INSURED MANAGEMENT
// ============================================================================
/**
 * 21. Creates a new policy holder.
 *
 * @param {PolicyHolderData} data - Policy holder data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created policy holder
 */
const createPolicyHolder = async (data, transaction) => {
    const policyHolder = {
        id: generateUUID(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return policyHolder;
};
exports.createPolicyHolder = createPolicyHolder;
/**
 * 22. Updates policy holder information.
 *
 * @param {string} policyHolderId - Policy holder ID
 * @param {Partial<PolicyHolderData>} updates - Fields to update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated policy holder
 */
const updatePolicyHolder = async (policyHolderId, updates, transaction) => {
    // Would update policy holder record
    return { id: policyHolderId, ...updates };
};
exports.updatePolicyHolder = updatePolicyHolder;
/**
 * 23. Adds named insured to policy.
 *
 * @param {NamedInsuredData} data - Named insured data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created named insured record
 */
const addNamedInsured = async (data, transaction) => {
    const policy = await getPolicyById(data.policyId, transaction);
    const namedInsured = {
        id: generateUUID(),
        ...data,
        createdAt: new Date(),
    };
    await createAuditLog({
        policyId: data.policyId,
        action: 'add_named_insured',
        versionReason: VersionReason.ENDORSEMENT,
        previousStatus: policy.status,
        newStatus: policy.status,
        changes: { addedInsured: namedInsured },
        performedBy: 'system',
        performedAt: new Date(),
    }, transaction);
    return namedInsured;
};
exports.addNamedInsured = addNamedInsured;
/**
 * 24. Removes named insured from policy.
 *
 * @param {string} namedInsuredId - Named insured ID
 * @param {string} removedBy - User removing insured
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Result
 */
const removeNamedInsured = async (namedInsuredId, removedBy, transaction) => {
    // Would delete/deactivate named insured record
    return { success: true, id: namedInsuredId };
};
exports.removeNamedInsured = removeNamedInsured;
/**
 * 25. Adds additional insured to policy.
 *
 * @param {NamedInsuredData} data - Additional insured data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created additional insured record
 */
const addAdditionalInsured = async (data, transaction) => {
    return await (0, exports.addNamedInsured)({
        ...data,
        insuredType: InsuredType.ADDITIONAL_INSURED,
        isPrimary: false,
    }, transaction);
};
exports.addAdditionalInsured = addAdditionalInsured;
// ============================================================================
// 7. COVERAGE & PREMIUM CALCULATIONS
// ============================================================================
/**
 * 26. Calculates coverage period in days.
 *
 * @param {Date} effectiveDate - Policy effective date
 * @param {Date} expirationDate - Policy expiration date
 * @returns {number} Coverage period in days
 */
const calculateCoveragePeriod = (effectiveDate, expirationDate) => {
    const diffTime = Math.abs(expirationDate.getTime() - effectiveDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};
exports.calculateCoveragePeriod = calculateCoveragePeriod;
/**
 * 27. Calculates pro-rated premium for midterm change.
 *
 * @param {number} annualPremium - Annual premium amount
 * @param {Date} changeDate - Date of change
 * @param {Date} expirationDate - Policy expiration date
 * @returns {number} Pro-rated premium
 */
const calculateProRatedPremium = (annualPremium, changeDate, expirationDate) => {
    const remainingDays = (0, exports.calculateCoveragePeriod)(changeDate, expirationDate);
    const totalDays = 365;
    return (annualPremium / totalDays) * remainingDays;
};
exports.calculateProRatedPremium = calculateProRatedPremium;
/**
 * 28. Applies discounts to premium.
 *
 * @param {number} basePremium - Base premium amount
 * @param {PolicyDiscount[]} discounts - Applicable discounts
 * @returns {number} Premium after discounts
 */
const applyDiscounts = (basePremium, discounts) => {
    let totalDiscount = 0;
    for (const discount of discounts) {
        if (discount.discountAmount) {
            totalDiscount += discount.discountAmount;
        }
        else if (discount.discountPercentage) {
            totalDiscount += basePremium * (discount.discountPercentage / 100);
        }
    }
    return Math.max(0, basePremium - totalDiscount);
};
exports.applyDiscounts = applyDiscounts;
/**
 * 29. Applies surcharges to premium.
 *
 * @param {number} basePremium - Base premium amount
 * @param {PolicySurcharge[]} surcharges - Applicable surcharges
 * @returns {number} Premium after surcharges
 */
const applySurcharges = (basePremium, surcharges) => {
    let totalSurcharge = 0;
    for (const surcharge of surcharges) {
        if (surcharge.surchargeAmount) {
            totalSurcharge += surcharge.surchargeAmount;
        }
        else if (surcharge.surchargePercentage) {
            totalSurcharge += basePremium * (surcharge.surchargePercentage / 100);
        }
    }
    return basePremium + totalSurcharge;
};
exports.applySurcharges = applySurcharges;
/**
 * 30. Calculates total policy premium.
 *
 * @param {number} basePremium - Base premium
 * @param {PolicyDiscount[]} [discounts] - Discounts
 * @param {PolicySurcharge[]} [surcharges] - Surcharges
 * @returns {number} Total premium
 */
const calculateTotalPremium = (basePremium, discounts, surcharges) => {
    let total = basePremium;
    if (discounts && discounts.length > 0) {
        total = (0, exports.applyDiscounts)(total, discounts);
    }
    if (surcharges && surcharges.length > 0) {
        total = (0, exports.applySurcharges)(total, surcharges);
    }
    return Math.round(total * 100) / 100; // Round to 2 decimals
};
exports.calculateTotalPremium = calculateTotalPremium;
// ============================================================================
// 8. POLICY SEARCH & FILTERING
// ============================================================================
/**
 * 31. Searches policies by criteria.
 *
 * @param {PolicySearchCriteria} criteria - Search criteria
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Matching policies
 */
const searchPolicies = async (criteria, transaction) => {
    const where = {};
    if (criteria.policyNumber) {
        where['policyNumber'] = { [sequelize_1.Op.like]: `%${criteria.policyNumber}%` };
    }
    if (criteria.policyHolderId) {
        where['policyHolderId'] = criteria.policyHolderId;
    }
    if (criteria.status && criteria.status.length > 0) {
        where['status'] = { [sequelize_1.Op.in]: criteria.status };
    }
    if (criteria.type && criteria.type.length > 0) {
        where['policyType'] = { [sequelize_1.Op.in]: criteria.type };
    }
    if (criteria.state) {
        where['state'] = criteria.state;
    }
    if (criteria.agentId) {
        where['agentId'] = criteria.agentId;
    }
    // Would execute actual query here
    return [];
};
exports.searchPolicies = searchPolicies;
/**
 * 32. Retrieves policies expiring within date range.
 *
 * @param {Date} startDate - Start of range
 * @param {Date} endDate - End of range
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Expiring policies
 */
const getExpiringPolicies = async (startDate, endDate, transaction) => {
    const where = {
        expirationDate: {
            [sequelize_1.Op.between]: [startDate, endDate],
        },
        status: PolicyStatus.ACTIVE,
    };
    // Would execute query
    return [];
};
exports.getExpiringPolicies = getExpiringPolicies;
/**
 * 33. Retrieves policy by policy number.
 *
 * @param {string} policyNumber - Policy number
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Policy
 */
const getPolicyByNumber = async (policyNumber, transaction) => {
    // Would query by policy number
    const policy = null;
    if (!policy) {
        throw new common_1.NotFoundException(`Policy ${policyNumber} not found`);
    }
    return policy;
};
exports.getPolicyByNumber = getPolicyByNumber;
/**
 * 34. Retrieves all policies for a policy holder.
 *
 * @param {string} policyHolderId - Policy holder ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Policies
 */
const getPoliciesByHolder = async (policyHolderId, transaction) => {
    // Would query policies by holder
    return [];
};
exports.getPoliciesByHolder = getPoliciesByHolder;
// ============================================================================
// 9. POLICY DOCUMENT GENERATION
// ============================================================================
/**
 * 35. Generates policy declaration document.
 *
 * @param {string} policyId - Policy ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Buffer>} Generated PDF document
 */
const generateDeclarationPage = async (policyId, transaction) => {
    const policy = await getPolicyById(policyId, transaction);
    // Would generate PDF using policy data
    return Buffer.from('PDF content placeholder');
};
exports.generateDeclarationPage = generateDeclarationPage;
/**
 * 36. Generates insurance ID card.
 *
 * @param {string} policyId - Policy ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Buffer>} Generated ID card PDF
 */
const generateInsuranceCard = async (policyId, transaction) => {
    const policy = await getPolicyById(policyId, transaction);
    // Would generate ID card PDF
    return Buffer.from('ID card PDF placeholder');
};
exports.generateInsuranceCard = generateInsuranceCard;
/**
 * 37. Generates policy certificate.
 *
 * @param {string} policyId - Policy ID
 * @param {string} certificateHolderName - Certificate holder name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Buffer>} Generated certificate PDF
 */
const generateCertificate = async (policyId, certificateHolderName, transaction) => {
    const policy = await getPolicyById(policyId, transaction);
    // Would generate certificate PDF
    return Buffer.from('Certificate PDF placeholder');
};
exports.generateCertificate = generateCertificate;
/**
 * 38. Generates cancellation notice.
 *
 * @param {string} policyId - Policy ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Buffer>} Generated cancellation notice PDF
 */
const generateCancellationNotice = async (policyId, transaction) => {
    const policy = await getPolicyById(policyId, transaction);
    if (policy.status !== PolicyStatus.CANCELLED && policy.status !== PolicyStatus.PENDING_CANCELLATION) {
        throw new common_1.BadRequestException('Policy is not cancelled');
    }
    // Would generate cancellation notice PDF
    return Buffer.from('Cancellation notice PDF placeholder');
};
exports.generateCancellationNotice = generateCancellationNotice;
// ============================================================================
// 10. POLICY TRANSFER
// ============================================================================
/**
 * 39. Transfers policy ownership.
 *
 * @param {TransferData} data - Transfer data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Transferred policy
 */
const transferPolicyOwnership = async (data, transaction) => {
    const policy = await getPolicyById(data.policyId, transaction);
    const oldPolicyHolderId = policy.policyHolderId;
    policy.policyHolderId = data.newPolicyHolderId;
    await createAuditLog({
        policyId: data.policyId,
        action: 'transfer_ownership',
        versionReason: VersionReason.MIDTERM_CHANGE,
        previousStatus: policy.status,
        newStatus: policy.status,
        changes: {
            oldPolicyHolderId,
            newPolicyHolderId: data.newPolicyHolderId,
            transferDate: data.transferDate,
            transferReason: data.transferReason,
        },
        performedBy: data.transferredBy,
        performedAt: new Date(),
        notes: data.transferNotes,
    }, transaction);
    return policy;
};
exports.transferPolicyOwnership = transferPolicyOwnership;
/**
 * 40. Validates policy transfer eligibility.
 *
 * @param {string} policyId - Policy ID
 * @param {string} newPolicyHolderId - New policy holder ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ eligible: boolean; reasons: string[] }>} Eligibility result
 */
const validateTransferEligibility = async (policyId, newPolicyHolderId, transaction) => {
    const policy = await getPolicyById(policyId, transaction);
    const reasons = [];
    if (![PolicyStatus.ACTIVE, PolicyStatus.ISSUED].includes(policy.status)) {
        reasons.push('Policy must be active or issued');
    }
    if (policy.policyHolderId === newPolicyHolderId) {
        reasons.push('New policy holder cannot be the same as current holder');
    }
    // Additional validation logic here
    return {
        eligible: reasons.length === 0,
        reasons,
    };
};
exports.validateTransferEligibility = validateTransferEligibility;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Helper: Generates policy number.
 */
const generatePolicyNumber = async (policyType, state) => {
    const prefix = policyType.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().substring(6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${state}-${timestamp}${random}`;
};
/**
 * Helper: Generates UUID.
 */
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
/**
 * Helper: Retrieves policy by ID.
 */
const getPolicyById = async (policyId, transaction) => {
    // Would fetch from database
    const policy = null;
    if (!policy) {
        throw new common_1.NotFoundException(`Policy ${policyId} not found`);
    }
    return policy;
};
/**
 * Helper: Creates audit log entry.
 */
const createAuditLog = async (data, transaction) => {
    const log = {
        id: generateUUID(),
        ...data,
        createdAt: new Date(),
    };
    return log;
};
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Policy Creation & Quote Management
    createPolicyQuote: exports.createPolicyQuote,
    bindPolicy: exports.bindPolicy,
    issuePolicy: exports.issuePolicy,
    activatePolicy: exports.activatePolicy,
    // Policy Modification & Versioning
    modifyPolicy: exports.modifyPolicy,
    getPolicyVersionHistory: exports.getPolicyVersionHistory,
    comparePolicyVersions: exports.comparePolicyVersions,
    rollbackPolicyVersion: exports.rollbackPolicyVersion,
    // Policy Lifecycle Management
    cancelPolicy: exports.cancelPolicy,
    reinstatePolicy: exports.reinstatePolicy,
    suspendPolicy: exports.suspendPolicy,
    terminatePolicy: exports.terminatePolicy,
    // Policy Renewal
    createRenewalOffer: exports.createRenewalOffer,
    acceptRenewal: exports.acceptRenewal,
    declineRenewal: exports.declineRenewal,
    processAutoRenewals: exports.processAutoRenewals,
    // Policy Bundle Management
    createPolicyBundle: exports.createPolicyBundle,
    addPolicyToBundle: exports.addPolicyToBundle,
    removePolicyFromBundle: exports.removePolicyFromBundle,
    getBundlePolicies: exports.getBundlePolicies,
    // Policy Holder & Insured Management
    createPolicyHolder: exports.createPolicyHolder,
    updatePolicyHolder: exports.updatePolicyHolder,
    addNamedInsured: exports.addNamedInsured,
    removeNamedInsured: exports.removeNamedInsured,
    addAdditionalInsured: exports.addAdditionalInsured,
    // Coverage & Premium Calculations
    calculateCoveragePeriod: exports.calculateCoveragePeriod,
    calculateProRatedPremium: exports.calculateProRatedPremium,
    applyDiscounts: exports.applyDiscounts,
    applySurcharges: exports.applySurcharges,
    calculateTotalPremium: exports.calculateTotalPremium,
    // Policy Search & Filtering
    searchPolicies: exports.searchPolicies,
    getExpiringPolicies: exports.getExpiringPolicies,
    getPolicyByNumber: exports.getPolicyByNumber,
    getPoliciesByHolder: exports.getPoliciesByHolder,
    // Policy Document Generation
    generateDeclarationPage: exports.generateDeclarationPage,
    generateInsuranceCard: exports.generateInsuranceCard,
    generateCertificate: exports.generateCertificate,
    generateCancellationNotice: exports.generateCancellationNotice,
    // Policy Transfer
    transferPolicyOwnership: exports.transferPolicyOwnership,
    validateTransferEligibility: exports.validateTransferEligibility,
    // Model Creators
    createPolicyModel: exports.createPolicyModel,
    createPolicyAuditLogModel: exports.createPolicyAuditLogModel,
};
//# sourceMappingURL=policy-management-kit.js.map