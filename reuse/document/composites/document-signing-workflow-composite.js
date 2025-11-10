"use strict";
/**
 * LOC: DOCSIGNWFLOW001
 * File: /reuse/document/composites/document-signing-workflow-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - ../document-signing-kit
 *   - ../document-esignature-advanced-kit
 *   - ../document-workflow-kit
 *   - ../document-notification-advanced-kit
 *   - ../document-automation-kit
 *
 * DOWNSTREAM (imported by):
 *   - E-signature services
 *   - Document workflow engines
 *   - Signer management modules
 *   - Approval chain processors
 *   - Bulk signing operations
 *   - Healthcare document signing dashboards
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
exports.generateWorkflowSummary = exports.calculateTimeUntilExpiration = exports.extendWorkflowExpiration = exports.isWorkflowExpired = exports.exportWorkflowAuditTrail = exports.voidSigningWorkflow = exports.createCounterSignatureWorkflow = exports.getWorkflowExecutionStatus = exports.calculateWorkflowCompletionPercentage = exports.validateSignerPhone = exports.validateSignerEmail = exports.generateAccessCode = exports.authenticateSignerWithCode = exports.delegateApproval = exports.areAllApproversApproved = exports.markApproverDecision = exports.getNextApprover = exports.createApprovalChain = exports.updateBulkOperationStats = exports.isBulkOperationComplete = exports.processBulkRecipient = exports.createBulkSigningOperation = exports.sendSignatureRequest = exports.scheduleAutomaticReminders = exports.createSigningReminder = exports.markSignerComplete = exports.validateSigningSession = exports.generateSigningSession = exports.validateSignatureFieldPlacement = exports.createSignatureField = exports.areAllSignersComplete = exports.getNextSigner = exports.updateSignerRoutingOrder = exports.removeSignerFromWorkflow = exports.addSignerToWorkflow = exports.createSigningWorkflow = exports.BulkSigningOperationModel = exports.SigningSessionModel = exports.SigningWorkflowConfigModel = exports.DeliveryStatus = exports.NotificationType = exports.WorkflowExecutionStatus = exports.BulkSigningStatus = exports.ApprovalStatus = exports.FieldType = exports.AuthenticationMethod = exports.SignerStatus = exports.SignerRole = exports.RoutingOrder = exports.WorkflowType = void 0;
exports.SigningWorkflowService = exports.mergeWorkflows = exports.cloneWorkflow = exports.validateWorkflowConfiguration = void 0;
/**
 * File: /reuse/document/composites/document-signing-workflow-composite.ts
 * Locator: WC-DOC-SIGNING-WORKFLOW-001
 * Purpose: Comprehensive Document Signing Workflow Toolkit - Production-ready e-signature workflows and signing orchestration
 *
 * Upstream: Composed from document-signing-kit, document-esignature-advanced-kit, document-workflow-kit, document-notification-advanced-kit, document-automation-kit
 * Downstream: ../backend/*, E-signature services, Workflow engines, Signer management, Approval chains, Bulk operations
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto
 * Exports: 45 utility functions for e-signature workflows, signer management, approval routing, notifications, bulk signing
 *
 * LLM Context: Enterprise-grade document signing workflow toolkit for White Cross healthcare platform.
 * Provides comprehensive e-signature capabilities including multi-party signing workflows, sequential and parallel
 * approval chains, signer authentication and verification, automated reminder notifications, bulk signing operations,
 * signature field positioning, signing session management, audit trail generation, and HIPAA-compliant electronic
 * signature capture. Composes functions from multiple document kits to provide unified signing operations for
 * patient consent forms, provider agreements, insurance authorizations, and legal healthcare documents.
 */
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
/**
 * Workflow types for signing
 */
var WorkflowType;
(function (WorkflowType) {
    WorkflowType["SIMPLE_SIGN"] = "SIMPLE_SIGN";
    WorkflowType["SEQUENTIAL_APPROVAL"] = "SEQUENTIAL_APPROVAL";
    WorkflowType["PARALLEL_APPROVAL"] = "PARALLEL_APPROVAL";
    WorkflowType["HYBRID_APPROVAL"] = "HYBRID_APPROVAL";
    WorkflowType["BULK_SIGNING"] = "BULK_SIGNING";
    WorkflowType["COUNTER_SIGN"] = "COUNTER_SIGN";
})(WorkflowType || (exports.WorkflowType = WorkflowType = {}));
/**
 * Routing order for signers
 */
var RoutingOrder;
(function (RoutingOrder) {
    RoutingOrder["SEQUENTIAL"] = "SEQUENTIAL";
    RoutingOrder["PARALLEL"] = "PARALLEL";
    RoutingOrder["CUSTOM"] = "CUSTOM";
    RoutingOrder["HYBRID"] = "HYBRID";
})(RoutingOrder || (exports.RoutingOrder = RoutingOrder = {}));
/**
 * Signer roles
 */
var SignerRole;
(function (SignerRole) {
    SignerRole["SIGNER"] = "SIGNER";
    SignerRole["APPROVER"] = "APPROVER";
    SignerRole["REVIEWER"] = "REVIEWER";
    SignerRole["WITNESS"] = "WITNESS";
    SignerRole["NOTARY"] = "NOTARY";
    SignerRole["CARBON_COPY"] = "CARBON_COPY";
})(SignerRole || (exports.SignerRole = SignerRole = {}));
/**
 * Signer status
 */
var SignerStatus;
(function (SignerStatus) {
    SignerStatus["PENDING"] = "PENDING";
    SignerStatus["SENT"] = "SENT";
    SignerStatus["DELIVERED"] = "DELIVERED";
    SignerStatus["OPENED"] = "OPENED";
    SignerStatus["SIGNED"] = "SIGNED";
    SignerStatus["DECLINED"] = "DECLINED";
    SignerStatus["EXPIRED"] = "EXPIRED";
    SignerStatus["VOIDED"] = "VOIDED";
})(SignerStatus || (exports.SignerStatus = SignerStatus = {}));
/**
 * Authentication methods for signing
 */
var AuthenticationMethod;
(function (AuthenticationMethod) {
    AuthenticationMethod["EMAIL"] = "EMAIL";
    AuthenticationMethod["SMS"] = "SMS";
    AuthenticationMethod["ACCESS_CODE"] = "ACCESS_CODE";
    AuthenticationMethod["PHONE_AUTH"] = "PHONE_AUTH";
    AuthenticationMethod["ID_VERIFICATION"] = "ID_VERIFICATION";
    AuthenticationMethod["KNOWLEDGE_BASED_AUTH"] = "KNOWLEDGE_BASED_AUTH";
    AuthenticationMethod["BIOMETRIC"] = "BIOMETRIC";
    AuthenticationMethod["MULTI_FACTOR"] = "MULTI_FACTOR";
})(AuthenticationMethod || (exports.AuthenticationMethod = AuthenticationMethod = {}));
/**
 * Field types for signature documents
 */
var FieldType;
(function (FieldType) {
    FieldType["SIGNATURE"] = "SIGNATURE";
    FieldType["INITIAL"] = "INITIAL";
    FieldType["DATE_SIGNED"] = "DATE_SIGNED";
    FieldType["TEXT"] = "TEXT";
    FieldType["CHECKBOX"] = "CHECKBOX";
    FieldType["RADIO"] = "RADIO";
    FieldType["DROPDOWN"] = "DROPDOWN";
    FieldType["FULL_NAME"] = "FULL_NAME";
    FieldType["EMAIL"] = "EMAIL";
    FieldType["COMPANY"] = "COMPANY";
    FieldType["TITLE"] = "TITLE";
})(FieldType || (exports.FieldType = FieldType = {}));
/**
 * Approval status
 */
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["PENDING"] = "PENDING";
    ApprovalStatus["APPROVED"] = "APPROVED";
    ApprovalStatus["REJECTED"] = "REJECTED";
    ApprovalStatus["DELEGATED"] = "DELEGATED";
})(ApprovalStatus || (exports.ApprovalStatus = ApprovalStatus = {}));
/**
 * Bulk signing status
 */
var BulkSigningStatus;
(function (BulkSigningStatus) {
    BulkSigningStatus["PREPARING"] = "PREPARING";
    BulkSigningStatus["IN_PROGRESS"] = "IN_PROGRESS";
    BulkSigningStatus["COMPLETED"] = "COMPLETED";
    BulkSigningStatus["FAILED"] = "FAILED";
    BulkSigningStatus["CANCELLED"] = "CANCELLED";
})(BulkSigningStatus || (exports.BulkSigningStatus = BulkSigningStatus = {}));
/**
 * Workflow execution status
 */
var WorkflowExecutionStatus;
(function (WorkflowExecutionStatus) {
    WorkflowExecutionStatus["INITIATED"] = "INITIATED";
    WorkflowExecutionStatus["IN_PROGRESS"] = "IN_PROGRESS";
    WorkflowExecutionStatus["COMPLETED"] = "COMPLETED";
    WorkflowExecutionStatus["FAILED"] = "FAILED";
    WorkflowExecutionStatus["CANCELLED"] = "CANCELLED";
    WorkflowExecutionStatus["EXPIRED"] = "EXPIRED";
})(WorkflowExecutionStatus || (exports.WorkflowExecutionStatus = WorkflowExecutionStatus = {}));
/**
 * Notification types
 */
var NotificationType;
(function (NotificationType) {
    NotificationType["SIGNATURE_REQUEST"] = "SIGNATURE_REQUEST";
    NotificationType["REMINDER"] = "REMINDER";
    NotificationType["COMPLETED"] = "COMPLETED";
    NotificationType["DECLINED"] = "DECLINED";
    NotificationType["EXPIRED"] = "EXPIRED";
    NotificationType["VOIDED"] = "VOIDED";
    NotificationType["APPROVED"] = "APPROVED";
    NotificationType["REJECTED"] = "REJECTED";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
/**
 * Delivery status for notifications
 */
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["PENDING"] = "PENDING";
    DeliveryStatus["SENT"] = "SENT";
    DeliveryStatus["DELIVERED"] = "DELIVERED";
    DeliveryStatus["FAILED"] = "FAILED";
    DeliveryStatus["BOUNCED"] = "BOUNCED";
})(DeliveryStatus || (exports.DeliveryStatus = DeliveryStatus = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Signing Workflow Configuration Model
 * Stores configuration for document signing workflows
 */
let SigningWorkflowConfigModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'signing_workflow_configs',
            timestamps: true,
            indexes: [
                { fields: ['documentId'] },
                { fields: ['workflowType'] },
                { fields: ['routingOrder'] },
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
    let _documentId_decorators;
    let _documentId_initializers = [];
    let _documentId_extraInitializers = [];
    let _workflowType_decorators;
    let _workflowType_initializers = [];
    let _workflowType_extraInitializers = [];
    let _routingOrder_decorators;
    let _routingOrder_initializers = [];
    let _routingOrder_extraInitializers = [];
    let _signers_decorators;
    let _signers_initializers = [];
    let _signers_extraInitializers = [];
    let _approvers_decorators;
    let _approvers_initializers = [];
    let _approvers_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _reminderSchedule_decorators;
    let _reminderSchedule_initializers = [];
    let _reminderSchedule_extraInitializers = [];
    let _authenticationMethod_decorators;
    let _authenticationMethod_initializers = [];
    let _authenticationMethod_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var SigningWorkflowConfigModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.documentId = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _documentId_initializers, void 0));
            this.workflowType = (__runInitializers(this, _documentId_extraInitializers), __runInitializers(this, _workflowType_initializers, void 0));
            this.routingOrder = (__runInitializers(this, _workflowType_extraInitializers), __runInitializers(this, _routingOrder_initializers, void 0));
            this.signers = (__runInitializers(this, _routingOrder_extraInitializers), __runInitializers(this, _signers_initializers, void 0));
            this.approvers = (__runInitializers(this, _signers_extraInitializers), __runInitializers(this, _approvers_initializers, void 0));
            this.expirationDate = (__runInitializers(this, _approvers_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
            this.reminderSchedule = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _reminderSchedule_initializers, void 0));
            this.authenticationMethod = (__runInitializers(this, _reminderSchedule_extraInitializers), __runInitializers(this, _authenticationMethod_initializers, void 0));
            this.metadata = (__runInitializers(this, _authenticationMethod_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SigningWorkflowConfigModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique workflow configuration identifier' })];
        _name_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiProperty)({ description: 'Workflow name' })];
        _documentId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Associated document ID' })];
        _workflowType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(WorkflowType))), (0, swagger_1.ApiProperty)({ enum: WorkflowType, description: 'Type of workflow' })];
        _routingOrder_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(RoutingOrder))), (0, swagger_1.ApiProperty)({ enum: RoutingOrder, description: 'Routing order for signers' })];
        _signers_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'List of signers', type: [Object] })];
        _approvers_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'List of approvers', type: [Object] })];
        _expirationDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiPropertyOptional)({ description: 'Workflow expiration date' })];
        _reminderSchedule_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Reminder schedule configuration' })];
        _authenticationMethod_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(AuthenticationMethod))), (0, swagger_1.ApiProperty)({ enum: AuthenticationMethod, description: 'Authentication method' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _documentId_decorators, { kind: "field", name: "documentId", static: false, private: false, access: { has: obj => "documentId" in obj, get: obj => obj.documentId, set: (obj, value) => { obj.documentId = value; } }, metadata: _metadata }, _documentId_initializers, _documentId_extraInitializers);
        __esDecorate(null, null, _workflowType_decorators, { kind: "field", name: "workflowType", static: false, private: false, access: { has: obj => "workflowType" in obj, get: obj => obj.workflowType, set: (obj, value) => { obj.workflowType = value; } }, metadata: _metadata }, _workflowType_initializers, _workflowType_extraInitializers);
        __esDecorate(null, null, _routingOrder_decorators, { kind: "field", name: "routingOrder", static: false, private: false, access: { has: obj => "routingOrder" in obj, get: obj => obj.routingOrder, set: (obj, value) => { obj.routingOrder = value; } }, metadata: _metadata }, _routingOrder_initializers, _routingOrder_extraInitializers);
        __esDecorate(null, null, _signers_decorators, { kind: "field", name: "signers", static: false, private: false, access: { has: obj => "signers" in obj, get: obj => obj.signers, set: (obj, value) => { obj.signers = value; } }, metadata: _metadata }, _signers_initializers, _signers_extraInitializers);
        __esDecorate(null, null, _approvers_decorators, { kind: "field", name: "approvers", static: false, private: false, access: { has: obj => "approvers" in obj, get: obj => obj.approvers, set: (obj, value) => { obj.approvers = value; } }, metadata: _metadata }, _approvers_initializers, _approvers_extraInitializers);
        __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
        __esDecorate(null, null, _reminderSchedule_decorators, { kind: "field", name: "reminderSchedule", static: false, private: false, access: { has: obj => "reminderSchedule" in obj, get: obj => obj.reminderSchedule, set: (obj, value) => { obj.reminderSchedule = value; } }, metadata: _metadata }, _reminderSchedule_initializers, _reminderSchedule_extraInitializers);
        __esDecorate(null, null, _authenticationMethod_decorators, { kind: "field", name: "authenticationMethod", static: false, private: false, access: { has: obj => "authenticationMethod" in obj, get: obj => obj.authenticationMethod, set: (obj, value) => { obj.authenticationMethod = value; } }, metadata: _metadata }, _authenticationMethod_initializers, _authenticationMethod_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SigningWorkflowConfigModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SigningWorkflowConfigModel = _classThis;
})();
exports.SigningWorkflowConfigModel = SigningWorkflowConfigModel;
/**
 * Signing Session Model
 * Stores active signing sessions
 */
let SigningSessionModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'signing_sessions',
            timestamps: true,
            indexes: [
                { fields: ['documentId'] },
                { fields: ['signerId'] },
                { fields: ['sessionToken'] },
                { fields: ['expiresAt'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _documentId_decorators;
    let _documentId_initializers = [];
    let _documentId_extraInitializers = [];
    let _signerId_decorators;
    let _signerId_initializers = [];
    let _signerId_extraInitializers = [];
    let _sessionToken_decorators;
    let _sessionToken_initializers = [];
    let _sessionToken_extraInitializers = [];
    let _startedAt_decorators;
    let _startedAt_initializers = [];
    let _startedAt_extraInitializers = [];
    let _expiresAt_decorators;
    let _expiresAt_initializers = [];
    let _expiresAt_extraInitializers = [];
    let _ipAddress_decorators;
    let _ipAddress_initializers = [];
    let _ipAddress_extraInitializers = [];
    let _userAgent_decorators;
    let _userAgent_initializers = [];
    let _userAgent_extraInitializers = [];
    let _authenticated_decorators;
    let _authenticated_initializers = [];
    let _authenticated_extraInitializers = [];
    let _completed_decorators;
    let _completed_initializers = [];
    let _completed_extraInitializers = [];
    let _completedAt_decorators;
    let _completedAt_initializers = [];
    let _completedAt_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var SigningSessionModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.documentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _documentId_initializers, void 0));
            this.signerId = (__runInitializers(this, _documentId_extraInitializers), __runInitializers(this, _signerId_initializers, void 0));
            this.sessionToken = (__runInitializers(this, _signerId_extraInitializers), __runInitializers(this, _sessionToken_initializers, void 0));
            this.startedAt = (__runInitializers(this, _sessionToken_extraInitializers), __runInitializers(this, _startedAt_initializers, void 0));
            this.expiresAt = (__runInitializers(this, _startedAt_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
            this.ipAddress = (__runInitializers(this, _expiresAt_extraInitializers), __runInitializers(this, _ipAddress_initializers, void 0));
            this.userAgent = (__runInitializers(this, _ipAddress_extraInitializers), __runInitializers(this, _userAgent_initializers, void 0));
            this.authenticated = (__runInitializers(this, _userAgent_extraInitializers), __runInitializers(this, _authenticated_initializers, void 0));
            this.completed = (__runInitializers(this, _authenticated_extraInitializers), __runInitializers(this, _completed_initializers, void 0));
            this.completedAt = (__runInitializers(this, _completed_extraInitializers), __runInitializers(this, _completedAt_initializers, void 0));
            this.metadata = (__runInitializers(this, _completedAt_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SigningSessionModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique session identifier' })];
        _documentId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Document ID' })];
        _signerId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Signer ID' })];
        _sessionToken_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Unique, sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiProperty)({ description: 'Session token' })];
        _startedAt_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiProperty)({ description: 'Session start time' })];
        _expiresAt_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiProperty)({ description: 'Session expiration time' })];
        _ipAddress_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiProperty)({ description: 'IP address' })];
        _userAgent_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT), (0, swagger_1.ApiProperty)({ description: 'User agent string' })];
        _authenticated_decorators = [(0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN), (0, swagger_1.ApiProperty)({ description: 'Authentication status' })];
        _completed_decorators = [(0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN), (0, swagger_1.ApiProperty)({ description: 'Completion status' })];
        _completedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiPropertyOptional)({ description: 'Completion time' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _documentId_decorators, { kind: "field", name: "documentId", static: false, private: false, access: { has: obj => "documentId" in obj, get: obj => obj.documentId, set: (obj, value) => { obj.documentId = value; } }, metadata: _metadata }, _documentId_initializers, _documentId_extraInitializers);
        __esDecorate(null, null, _signerId_decorators, { kind: "field", name: "signerId", static: false, private: false, access: { has: obj => "signerId" in obj, get: obj => obj.signerId, set: (obj, value) => { obj.signerId = value; } }, metadata: _metadata }, _signerId_initializers, _signerId_extraInitializers);
        __esDecorate(null, null, _sessionToken_decorators, { kind: "field", name: "sessionToken", static: false, private: false, access: { has: obj => "sessionToken" in obj, get: obj => obj.sessionToken, set: (obj, value) => { obj.sessionToken = value; } }, metadata: _metadata }, _sessionToken_initializers, _sessionToken_extraInitializers);
        __esDecorate(null, null, _startedAt_decorators, { kind: "field", name: "startedAt", static: false, private: false, access: { has: obj => "startedAt" in obj, get: obj => obj.startedAt, set: (obj, value) => { obj.startedAt = value; } }, metadata: _metadata }, _startedAt_initializers, _startedAt_extraInitializers);
        __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: obj => "expiresAt" in obj, get: obj => obj.expiresAt, set: (obj, value) => { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
        __esDecorate(null, null, _ipAddress_decorators, { kind: "field", name: "ipAddress", static: false, private: false, access: { has: obj => "ipAddress" in obj, get: obj => obj.ipAddress, set: (obj, value) => { obj.ipAddress = value; } }, metadata: _metadata }, _ipAddress_initializers, _ipAddress_extraInitializers);
        __esDecorate(null, null, _userAgent_decorators, { kind: "field", name: "userAgent", static: false, private: false, access: { has: obj => "userAgent" in obj, get: obj => obj.userAgent, set: (obj, value) => { obj.userAgent = value; } }, metadata: _metadata }, _userAgent_initializers, _userAgent_extraInitializers);
        __esDecorate(null, null, _authenticated_decorators, { kind: "field", name: "authenticated", static: false, private: false, access: { has: obj => "authenticated" in obj, get: obj => obj.authenticated, set: (obj, value) => { obj.authenticated = value; } }, metadata: _metadata }, _authenticated_initializers, _authenticated_extraInitializers);
        __esDecorate(null, null, _completed_decorators, { kind: "field", name: "completed", static: false, private: false, access: { has: obj => "completed" in obj, get: obj => obj.completed, set: (obj, value) => { obj.completed = value; } }, metadata: _metadata }, _completed_initializers, _completed_extraInitializers);
        __esDecorate(null, null, _completedAt_decorators, { kind: "field", name: "completedAt", static: false, private: false, access: { has: obj => "completedAt" in obj, get: obj => obj.completedAt, set: (obj, value) => { obj.completedAt = value; } }, metadata: _metadata }, _completedAt_initializers, _completedAt_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SigningSessionModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SigningSessionModel = _classThis;
})();
exports.SigningSessionModel = SigningSessionModel;
/**
 * Bulk Signing Operation Model
 * Stores bulk signing operations
 */
let BulkSigningOperationModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'bulk_signing_operations',
            timestamps: true,
            indexes: [
                { fields: ['status'] },
                { fields: ['startedAt'] },
                { fields: ['completedAt'] },
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
    let _documentTemplateId_decorators;
    let _documentTemplateId_initializers = [];
    let _documentTemplateId_extraInitializers = [];
    let _recipients_decorators;
    let _recipients_initializers = [];
    let _recipients_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _totalDocuments_decorators;
    let _totalDocuments_initializers = [];
    let _totalDocuments_extraInitializers = [];
    let _successCount_decorators;
    let _successCount_initializers = [];
    let _successCount_extraInitializers = [];
    let _failureCount_decorators;
    let _failureCount_initializers = [];
    let _failureCount_extraInitializers = [];
    let _startedAt_decorators;
    let _startedAt_initializers = [];
    let _startedAt_extraInitializers = [];
    let _completedAt_decorators;
    let _completedAt_initializers = [];
    let _completedAt_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var BulkSigningOperationModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.documentTemplateId = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _documentTemplateId_initializers, void 0));
            this.recipients = (__runInitializers(this, _documentTemplateId_extraInitializers), __runInitializers(this, _recipients_initializers, void 0));
            this.status = (__runInitializers(this, _recipients_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.totalDocuments = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _totalDocuments_initializers, void 0));
            this.successCount = (__runInitializers(this, _totalDocuments_extraInitializers), __runInitializers(this, _successCount_initializers, void 0));
            this.failureCount = (__runInitializers(this, _successCount_extraInitializers), __runInitializers(this, _failureCount_initializers, void 0));
            this.startedAt = (__runInitializers(this, _failureCount_extraInitializers), __runInitializers(this, _startedAt_initializers, void 0));
            this.completedAt = (__runInitializers(this, _startedAt_extraInitializers), __runInitializers(this, _completedAt_initializers, void 0));
            this.metadata = (__runInitializers(this, _completedAt_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "BulkSigningOperationModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique bulk operation identifier' })];
        _name_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiProperty)({ description: 'Operation name' })];
        _documentTemplateId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Document template ID' })];
        _recipients_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Bulk recipients', type: [Object] })];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(BulkSigningStatus))), (0, swagger_1.ApiProperty)({ enum: BulkSigningStatus, description: 'Operation status' })];
        _totalDocuments_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER), (0, swagger_1.ApiProperty)({ description: 'Total number of documents' })];
        _successCount_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER), (0, swagger_1.ApiProperty)({ description: 'Number of successful operations' })];
        _failureCount_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER), (0, swagger_1.ApiProperty)({ description: 'Number of failed operations' })];
        _startedAt_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiProperty)({ description: 'Operation start time' })];
        _completedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiPropertyOptional)({ description: 'Operation completion time' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _documentTemplateId_decorators, { kind: "field", name: "documentTemplateId", static: false, private: false, access: { has: obj => "documentTemplateId" in obj, get: obj => obj.documentTemplateId, set: (obj, value) => { obj.documentTemplateId = value; } }, metadata: _metadata }, _documentTemplateId_initializers, _documentTemplateId_extraInitializers);
        __esDecorate(null, null, _recipients_decorators, { kind: "field", name: "recipients", static: false, private: false, access: { has: obj => "recipients" in obj, get: obj => obj.recipients, set: (obj, value) => { obj.recipients = value; } }, metadata: _metadata }, _recipients_initializers, _recipients_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _totalDocuments_decorators, { kind: "field", name: "totalDocuments", static: false, private: false, access: { has: obj => "totalDocuments" in obj, get: obj => obj.totalDocuments, set: (obj, value) => { obj.totalDocuments = value; } }, metadata: _metadata }, _totalDocuments_initializers, _totalDocuments_extraInitializers);
        __esDecorate(null, null, _successCount_decorators, { kind: "field", name: "successCount", static: false, private: false, access: { has: obj => "successCount" in obj, get: obj => obj.successCount, set: (obj, value) => { obj.successCount = value; } }, metadata: _metadata }, _successCount_initializers, _successCount_extraInitializers);
        __esDecorate(null, null, _failureCount_decorators, { kind: "field", name: "failureCount", static: false, private: false, access: { has: obj => "failureCount" in obj, get: obj => obj.failureCount, set: (obj, value) => { obj.failureCount = value; } }, metadata: _metadata }, _failureCount_initializers, _failureCount_extraInitializers);
        __esDecorate(null, null, _startedAt_decorators, { kind: "field", name: "startedAt", static: false, private: false, access: { has: obj => "startedAt" in obj, get: obj => obj.startedAt, set: (obj, value) => { obj.startedAt = value; } }, metadata: _metadata }, _startedAt_initializers, _startedAt_extraInitializers);
        __esDecorate(null, null, _completedAt_decorators, { kind: "field", name: "completedAt", static: false, private: false, access: { has: obj => "completedAt" in obj, get: obj => obj.completedAt, set: (obj, value) => { obj.completedAt = value; } }, metadata: _metadata }, _completedAt_initializers, _completedAt_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BulkSigningOperationModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BulkSigningOperationModel = _classThis;
})();
exports.BulkSigningOperationModel = BulkSigningOperationModel;
// ============================================================================
// CORE SIGNING WORKFLOW FUNCTIONS
// ============================================================================
/**
 * Creates a new signing workflow configuration.
 *
 * @param {string} documentId - Document identifier
 * @param {WorkflowType} workflowType - Type of workflow
 * @param {SignerInfo[]} signers - List of signers
 * @param {Partial<SigningWorkflowConfig>} options - Additional options
 * @returns {SigningWorkflowConfig} Workflow configuration
 *
 * @example
 * ```typescript
 * const workflow = createSigningWorkflow('doc123', WorkflowType.SEQUENTIAL_APPROVAL, signers, {
 *   expirationDate: new Date('2025-12-31')
 * });
 * ```
 */
const createSigningWorkflow = (documentId, workflowType, signers, options) => {
    return {
        id: crypto.randomUUID(),
        name: options?.name || `Workflow for ${documentId}`,
        documentId,
        workflowType,
        routingOrder: options?.routingOrder || RoutingOrder.SEQUENTIAL,
        signers,
        approvers: options?.approvers,
        expirationDate: options?.expirationDate,
        reminderSchedule: options?.reminderSchedule || {
            enabled: true,
            firstReminderDays: 3,
            recurringReminderDays: 3,
            maxReminders: 5,
            remindersSent: 0,
        },
        authenticationMethod: options?.authenticationMethod || AuthenticationMethod.EMAIL,
        metadata: options?.metadata,
    };
};
exports.createSigningWorkflow = createSigningWorkflow;
/**
 * Adds a signer to an existing workflow.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow configuration
 * @param {SignerInfo} signer - Signer to add
 * @returns {SigningWorkflowConfig} Updated workflow
 *
 * @example
 * ```typescript
 * const updated = addSignerToWorkflow(workflow, newSigner);
 * ```
 */
const addSignerToWorkflow = (workflow, signer) => {
    return {
        ...workflow,
        signers: [...workflow.signers, signer],
    };
};
exports.addSignerToWorkflow = addSignerToWorkflow;
/**
 * Removes a signer from a workflow.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow configuration
 * @param {string} signerId - Signer ID to remove
 * @returns {SigningWorkflowConfig} Updated workflow
 *
 * @example
 * ```typescript
 * const updated = removeSignerFromWorkflow(workflow, 'signer123');
 * ```
 */
const removeSignerFromWorkflow = (workflow, signerId) => {
    return {
        ...workflow,
        signers: workflow.signers.filter((s) => s.id !== signerId),
    };
};
exports.removeSignerFromWorkflow = removeSignerFromWorkflow;
/**
 * Updates signer routing order for sequential workflows.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow configuration
 * @param {Array<{signerId: string, order: number}>} orderUpdates - Order updates
 * @returns {SigningWorkflowConfig} Updated workflow
 *
 * @example
 * ```typescript
 * const updated = updateSignerRoutingOrder(workflow, [{signerId: 's1', order: 1}, {signerId: 's2', order: 2}]);
 * ```
 */
const updateSignerRoutingOrder = (workflow, orderUpdates) => {
    const signerMap = new Map(orderUpdates.map((u) => [u.signerId, u.order]));
    return {
        ...workflow,
        signers: workflow.signers.map((signer) => ({
            ...signer,
            routingOrder: signerMap.get(signer.id) || signer.routingOrder,
        })),
    };
};
exports.updateSignerRoutingOrder = updateSignerRoutingOrder;
/**
 * Gets the next signer in sequential workflow.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow configuration
 * @returns {SignerInfo | null} Next signer or null if complete
 *
 * @example
 * ```typescript
 * const nextSigner = getNextSigner(workflow);
 * ```
 */
const getNextSigner = (workflow) => {
    const pendingSigners = workflow.signers
        .filter((s) => s.status === SignerStatus.PENDING || s.status === SignerStatus.SENT)
        .sort((a, b) => a.routingOrder - b.routingOrder);
    return pendingSigners[0] || null;
};
exports.getNextSigner = getNextSigner;
/**
 * Checks if all required signers have signed.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow configuration
 * @returns {boolean} True if all required signers have signed
 *
 * @example
 * ```typescript
 * const isComplete = areAllSignersComplete(workflow);
 * ```
 */
const areAllSignersComplete = (workflow) => {
    return workflow.signers
        .filter((s) => s.required)
        .every((s) => s.status === SignerStatus.SIGNED);
};
exports.areAllSignersComplete = areAllSignersComplete;
/**
 * Creates a signature field for a document.
 *
 * @param {FieldType} type - Field type
 * @param {number} pageNumber - Page number
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {Partial<SignatureField>} options - Additional options
 * @returns {SignatureField} Signature field
 *
 * @example
 * ```typescript
 * const field = createSignatureField(FieldType.SIGNATURE, 1, 100, 200, {width: 150, height: 50});
 * ```
 */
const createSignatureField = (type, pageNumber, x, y, options) => {
    return {
        id: crypto.randomUUID(),
        type,
        pageNumber,
        x,
        y,
        width: options?.width || 150,
        height: options?.height || 50,
        required: options?.required ?? true,
        label: options?.label,
        value: options?.value,
        signedAt: options?.signedAt,
        metadata: options?.metadata,
    };
};
exports.createSignatureField = createSignatureField;
/**
 * Validates signature field placement on document.
 *
 * @param {SignatureField} field - Signature field
 * @param {number} pageWidth - Page width
 * @param {number} pageHeight - Page height
 * @returns {boolean} True if placement is valid
 *
 * @example
 * ```typescript
 * const isValid = validateSignatureFieldPlacement(field, 612, 792);
 * ```
 */
const validateSignatureFieldPlacement = (field, pageWidth, pageHeight) => {
    return (field.x >= 0 &&
        field.y >= 0 &&
        field.x + field.width <= pageWidth &&
        field.y + field.height <= pageHeight);
};
exports.validateSignatureFieldPlacement = validateSignatureFieldPlacement;
/**
 * Generates a signing session token.
 *
 * @param {string} documentId - Document ID
 * @param {string} signerId - Signer ID
 * @param {number} expirationMinutes - Token expiration in minutes
 * @returns {SigningSession} Signing session
 *
 * @example
 * ```typescript
 * const session = generateSigningSession('doc123', 'signer456', 60);
 * ```
 */
const generateSigningSession = (documentId, signerId, expirationMinutes = 60) => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expirationMinutes * 60000);
    return {
        id: crypto.randomUUID(),
        documentId,
        signerId,
        sessionToken: crypto.randomBytes(32).toString('hex'),
        startedAt: now,
        expiresAt,
        ipAddress: '',
        userAgent: '',
        authenticated: false,
        completed: false,
    };
};
exports.generateSigningSession = generateSigningSession;
/**
 * Validates a signing session token.
 *
 * @param {SigningSession} session - Signing session
 * @param {string} token - Token to validate
 * @returns {boolean} True if token is valid
 *
 * @example
 * ```typescript
 * const isValid = validateSigningSession(session, submittedToken);
 * ```
 */
const validateSigningSession = (session, token) => {
    const now = new Date();
    return (session.sessionToken === token &&
        session.expiresAt > now &&
        !session.completed);
};
exports.validateSigningSession = validateSigningSession;
/**
 * Marks a signer as completed.
 *
 * @param {SignerInfo} signer - Signer information
 * @param {string} ipAddress - IP address of signer
 * @returns {SignerInfo} Updated signer
 *
 * @example
 * ```typescript
 * const updated = markSignerComplete(signer, '192.168.1.1');
 * ```
 */
const markSignerComplete = (signer, ipAddress) => {
    return {
        ...signer,
        status: SignerStatus.SIGNED,
        signedAt: new Date(),
        ipAddress,
    };
};
exports.markSignerComplete = markSignerComplete;
/**
 * Creates a reminder notification for pending signer.
 *
 * @param {SignerInfo} signer - Signer information
 * @param {string} documentName - Document name
 * @returns {NotificationConfig} Notification configuration
 *
 * @example
 * ```typescript
 * const reminder = createSigningReminder(signer, 'Patient Consent Form');
 * ```
 */
const createSigningReminder = (signer, documentName) => {
    return {
        id: crypto.randomUUID(),
        type: NotificationType.REMINDER,
        recipientEmail: signer.email,
        recipientPhone: signer.phoneNumber,
        subject: `Reminder: Please sign ${documentName}`,
        message: `This is a reminder to complete your signature for ${documentName}.`,
        deliveryStatus: DeliveryStatus.PENDING,
    };
};
exports.createSigningReminder = createSigningReminder;
/**
 * Schedules automatic reminders for unsigned documents.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow configuration
 * @param {string} documentName - Document name
 * @returns {NotificationConfig[]} Scheduled reminders
 *
 * @example
 * ```typescript
 * const reminders = scheduleAutomaticReminders(workflow, 'Insurance Authorization');
 * ```
 */
const scheduleAutomaticReminders = (workflow, documentName) => {
    const reminders = [];
    if (!workflow.reminderSchedule?.enabled)
        return reminders;
    const pendingSigners = workflow.signers.filter((s) => s.status === SignerStatus.SENT || s.status === SignerStatus.PENDING);
    pendingSigners.forEach((signer) => {
        reminders.push((0, exports.createSigningReminder)(signer, documentName));
    });
    return reminders;
};
exports.scheduleAutomaticReminders = scheduleAutomaticReminders;
/**
 * Sends signature request notification to signer.
 *
 * @param {SignerInfo} signer - Signer information
 * @param {string} documentName - Document name
 * @param {string} signingUrl - URL for signing
 * @returns {NotificationConfig} Notification configuration
 *
 * @example
 * ```typescript
 * const notification = sendSignatureRequest(signer, 'Contract', 'https://sign.example.com/abc');
 * ```
 */
const sendSignatureRequest = (signer, documentName, signingUrl) => {
    return {
        id: crypto.randomUUID(),
        type: NotificationType.SIGNATURE_REQUEST,
        recipientEmail: signer.email,
        recipientPhone: signer.phoneNumber,
        subject: `Action Required: Sign ${documentName}`,
        message: `Please sign ${documentName} by visiting: ${signingUrl}`,
        deliveryStatus: DeliveryStatus.PENDING,
    };
};
exports.sendSignatureRequest = sendSignatureRequest;
/**
 * Creates a bulk signing operation.
 *
 * @param {string} templateId - Document template ID
 * @param {BulkRecipient[]} recipients - List of recipients
 * @param {string} operationName - Operation name
 * @returns {BulkSigningOperation} Bulk signing operation
 *
 * @example
 * ```typescript
 * const bulkOp = createBulkSigningOperation('template123', recipients, 'Annual Consent Forms');
 * ```
 */
const createBulkSigningOperation = (templateId, recipients, operationName) => {
    return {
        id: crypto.randomUUID(),
        name: operationName,
        documentTemplateId: templateId,
        recipients,
        status: BulkSigningStatus.PREPARING,
        totalDocuments: recipients.length,
        successCount: 0,
        failureCount: 0,
        startedAt: new Date(),
    };
};
exports.createBulkSigningOperation = createBulkSigningOperation;
/**
 * Processes a single recipient in bulk signing operation.
 *
 * @param {BulkSigningOperation} operation - Bulk operation
 * @param {string} recipientId - Recipient ID
 * @returns {BulkSigningOperation} Updated operation
 *
 * @example
 * ```typescript
 * const updated = processBulkRecipient(bulkOp, 'recipient123');
 * ```
 */
const processBulkRecipient = (operation, recipientId) => {
    const recipients = operation.recipients.map((r) => r.id === recipientId ? { ...r, status: SignerStatus.SENT, sentAt: new Date() } : r);
    return {
        ...operation,
        recipients,
    };
};
exports.processBulkRecipient = processBulkRecipient;
/**
 * Checks bulk signing operation completion status.
 *
 * @param {BulkSigningOperation} operation - Bulk operation
 * @returns {boolean} True if operation is complete
 *
 * @example
 * ```typescript
 * const isComplete = isBulkOperationComplete(bulkOp);
 * ```
 */
const isBulkOperationComplete = (operation) => {
    return operation.successCount + operation.failureCount === operation.totalDocuments;
};
exports.isBulkOperationComplete = isBulkOperationComplete;
/**
 * Updates bulk operation statistics.
 *
 * @param {BulkSigningOperation} operation - Bulk operation
 * @param {boolean} success - Whether the operation was successful
 * @returns {BulkSigningOperation} Updated operation
 *
 * @example
 * ```typescript
 * const updated = updateBulkOperationStats(bulkOp, true);
 * ```
 */
const updateBulkOperationStats = (operation, success) => {
    const updated = {
        ...operation,
        successCount: success ? operation.successCount + 1 : operation.successCount,
        failureCount: !success ? operation.failureCount + 1 : operation.failureCount,
    };
    if ((0, exports.isBulkOperationComplete)(updated)) {
        updated.status = BulkSigningStatus.COMPLETED;
        updated.completedAt = new Date();
    }
    return updated;
};
exports.updateBulkOperationStats = updateBulkOperationStats;
/**
 * Creates an approval chain for document.
 *
 * @param {ApproverInfo[]} approvers - List of approvers
 * @param {RoutingOrder} routingOrder - Routing order
 * @returns {ApproverInfo[]} Configured approvers
 *
 * @example
 * ```typescript
 * const chain = createApprovalChain(approvers, RoutingOrder.SEQUENTIAL);
 * ```
 */
const createApprovalChain = (approvers, routingOrder) => {
    return approvers.map((approver, index) => ({
        ...approver,
        routingOrder: routingOrder === RoutingOrder.SEQUENTIAL ? index + 1 : 1,
    }));
};
exports.createApprovalChain = createApprovalChain;
/**
 * Gets the next approver in approval chain.
 *
 * @param {ApproverInfo[]} approvers - List of approvers
 * @returns {ApproverInfo | null} Next approver or null
 *
 * @example
 * ```typescript
 * const nextApprover = getNextApprover(approvalChain);
 * ```
 */
const getNextApprover = (approvers) => {
    const pending = approvers
        .filter((a) => a.approvalStatus === ApprovalStatus.PENDING)
        .sort((a, b) => a.routingOrder - b.routingOrder);
    return pending[0] || null;
};
exports.getNextApprover = getNextApprover;
/**
 * Marks an approver decision.
 *
 * @param {ApproverInfo} approver - Approver information
 * @param {ApprovalStatus} decision - Approval decision
 * @param {string} comments - Optional comments
 * @returns {ApproverInfo} Updated approver
 *
 * @example
 * ```typescript
 * const updated = markApproverDecision(approver, ApprovalStatus.APPROVED, 'Looks good');
 * ```
 */
const markApproverDecision = (approver, decision, comments) => {
    return {
        ...approver,
        approvalStatus: decision,
        approvedAt: new Date(),
        comments,
    };
};
exports.markApproverDecision = markApproverDecision;
/**
 * Checks if all approvers have approved.
 *
 * @param {ApproverInfo[]} approvers - List of approvers
 * @returns {boolean} True if all approved
 *
 * @example
 * ```typescript
 * const allApproved = areAllApproversApproved(approvers);
 * ```
 */
const areAllApproversApproved = (approvers) => {
    return approvers.every((a) => a.approvalStatus === ApprovalStatus.APPROVED);
};
exports.areAllApproversApproved = areAllApproversApproved;
/**
 * Delegates approval to another approver.
 *
 * @param {ApproverInfo} approver - Original approver
 * @param {ApproverInfo} delegate - Delegate approver
 * @returns {ApproverInfo} Delegated approver
 *
 * @example
 * ```typescript
 * const delegated = delegateApproval(originalApprover, delegateApprover);
 * ```
 */
const delegateApproval = (approver, delegate) => {
    return {
        ...delegate,
        routingOrder: approver.routingOrder,
        approvalStatus: ApprovalStatus.PENDING,
    };
};
exports.delegateApproval = delegateApproval;
/**
 * Authenticates a signer using access code.
 *
 * @param {string} providedCode - Code provided by signer
 * @param {string} expectedCode - Expected access code
 * @returns {boolean} True if authenticated
 *
 * @example
 * ```typescript
 * const isAuthenticated = authenticateSignerWithCode('123456', '123456');
 * ```
 */
const authenticateSignerWithCode = (providedCode, expectedCode) => {
    return providedCode === expectedCode;
};
exports.authenticateSignerWithCode = authenticateSignerWithCode;
/**
 * Generates an access code for signer authentication.
 *
 * @param {number} length - Code length
 * @returns {string} Generated access code
 *
 * @example
 * ```typescript
 * const code = generateAccessCode(6);
 * ```
 */
const generateAccessCode = (length = 6) => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};
exports.generateAccessCode = generateAccessCode;
/**
 * Validates signer email format.
 *
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateSignerEmail('user@example.com');
 * ```
 */
const validateSignerEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateSignerEmail = validateSignerEmail;
/**
 * Validates signer phone number format.
 *
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateSignerPhone('+1234567890');
 * ```
 */
const validateSignerPhone = (phone) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
};
exports.validateSignerPhone = validateSignerPhone;
/**
 * Calculates workflow completion percentage.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow configuration
 * @returns {number} Completion percentage (0-100)
 *
 * @example
 * ```typescript
 * const percentage = calculateWorkflowCompletionPercentage(workflow);
 * ```
 */
const calculateWorkflowCompletionPercentage = (workflow) => {
    const totalSigners = workflow.signers.length;
    const signedCount = workflow.signers.filter((s) => s.status === SignerStatus.SIGNED).length;
    return totalSigners > 0 ? (signedCount / totalSigners) * 100 : 0;
};
exports.calculateWorkflowCompletionPercentage = calculateWorkflowCompletionPercentage;
/**
 * Gets workflow execution status.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow configuration
 * @returns {WorkflowExecutionStatus} Execution status
 *
 * @example
 * ```typescript
 * const status = getWorkflowExecutionStatus(workflow);
 * ```
 */
const getWorkflowExecutionStatus = (workflow) => {
    const hasDeclined = workflow.signers.some((s) => s.status === SignerStatus.DECLINED);
    if (hasDeclined)
        return WorkflowExecutionStatus.FAILED;
    const hasExpired = workflow.expirationDate && new Date() > workflow.expirationDate;
    if (hasExpired)
        return WorkflowExecutionStatus.EXPIRED;
    const allSigned = (0, exports.areAllSignersComplete)(workflow);
    if (allSigned)
        return WorkflowExecutionStatus.COMPLETED;
    const hasStarted = workflow.signers.some((s) => s.status !== SignerStatus.PENDING);
    if (hasStarted)
        return WorkflowExecutionStatus.IN_PROGRESS;
    return WorkflowExecutionStatus.INITIATED;
};
exports.getWorkflowExecutionStatus = getWorkflowExecutionStatus;
/**
 * Creates a counter-signature workflow.
 *
 * @param {string} originalDocumentId - Original document ID
 * @param {SignerInfo} counterSigner - Counter-signer information
 * @returns {SigningWorkflowConfig} Counter-signature workflow
 *
 * @example
 * ```typescript
 * const counterWorkflow = createCounterSignatureWorkflow('doc123', counterSigner);
 * ```
 */
const createCounterSignatureWorkflow = (originalDocumentId, counterSigner) => {
    return (0, exports.createSigningWorkflow)(originalDocumentId, WorkflowType.COUNTER_SIGN, [counterSigner], { name: `Counter-signature for ${originalDocumentId}` });
};
exports.createCounterSignatureWorkflow = createCounterSignatureWorkflow;
/**
 * Voids a signing workflow and notifies all participants.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow to void
 * @param {string} reason - Reason for voiding
 * @returns {NotificationConfig[]} Void notifications
 *
 * @example
 * ```typescript
 * const notifications = voidSigningWorkflow(workflow, 'Document error');
 * ```
 */
const voidSigningWorkflow = (workflow, reason) => {
    const notifications = [];
    workflow.signers.forEach((signer) => {
        notifications.push({
            id: crypto.randomUUID(),
            type: NotificationType.VOIDED,
            recipientEmail: signer.email,
            recipientPhone: signer.phoneNumber,
            subject: 'Signing Request Voided',
            message: `The signing request has been voided. Reason: ${reason}`,
            deliveryStatus: DeliveryStatus.PENDING,
        });
    });
    return notifications;
};
exports.voidSigningWorkflow = voidSigningWorkflow;
/**
 * Exports workflow audit trail.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow configuration
 * @returns {Record<string, any>} Audit trail data
 *
 * @example
 * ```typescript
 * const auditTrail = exportWorkflowAuditTrail(workflow);
 * ```
 */
const exportWorkflowAuditTrail = (workflow) => {
    return {
        workflowId: workflow.id,
        documentId: workflow.documentId,
        workflowType: workflow.workflowType,
        createdAt: new Date(),
        signers: workflow.signers.map((s) => ({
            id: s.id,
            name: s.name,
            email: s.email,
            role: s.role,
            status: s.status,
            signedAt: s.signedAt,
            ipAddress: s.ipAddress,
        })),
        approvers: workflow.approvers?.map((a) => ({
            id: a.id,
            name: a.name,
            email: a.email,
            status: a.approvalStatus,
            approvedAt: a.approvedAt,
            comments: a.comments,
        })),
    };
};
exports.exportWorkflowAuditTrail = exportWorkflowAuditTrail;
/**
 * Checks if workflow has expired.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow configuration
 * @returns {boolean} True if expired
 *
 * @example
 * ```typescript
 * const expired = isWorkflowExpired(workflow);
 * ```
 */
const isWorkflowExpired = (workflow) => {
    if (!workflow.expirationDate)
        return false;
    return new Date() > workflow.expirationDate;
};
exports.isWorkflowExpired = isWorkflowExpired;
/**
 * Extends workflow expiration date.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow configuration
 * @param {number} extensionDays - Number of days to extend
 * @returns {SigningWorkflowConfig} Updated workflow
 *
 * @example
 * ```typescript
 * const extended = extendWorkflowExpiration(workflow, 7);
 * ```
 */
const extendWorkflowExpiration = (workflow, extensionDays) => {
    const currentExpiration = workflow.expirationDate || new Date();
    const newExpiration = new Date(currentExpiration.getTime() + extensionDays * 86400000);
    return {
        ...workflow,
        expirationDate: newExpiration,
    };
};
exports.extendWorkflowExpiration = extendWorkflowExpiration;
/**
 * Calculates time remaining until workflow expiration.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow configuration
 * @returns {number} Milliseconds until expiration
 *
 * @example
 * ```typescript
 * const timeLeft = calculateTimeUntilExpiration(workflow);
 * ```
 */
const calculateTimeUntilExpiration = (workflow) => {
    if (!workflow.expirationDate)
        return Infinity;
    return workflow.expirationDate.getTime() - Date.now();
};
exports.calculateTimeUntilExpiration = calculateTimeUntilExpiration;
/**
 * Generates workflow summary report.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow configuration
 * @returns {Record<string, any>} Workflow summary
 *
 * @example
 * ```typescript
 * const summary = generateWorkflowSummary(workflow);
 * ```
 */
const generateWorkflowSummary = (workflow) => {
    return {
        workflowId: workflow.id,
        workflowType: workflow.workflowType,
        totalSigners: workflow.signers.length,
        signedCount: workflow.signers.filter((s) => s.status === SignerStatus.SIGNED).length,
        pendingCount: workflow.signers.filter((s) => s.status === SignerStatus.PENDING || s.status === SignerStatus.SENT).length,
        declinedCount: workflow.signers.filter((s) => s.status === SignerStatus.DECLINED).length,
        completionPercentage: (0, exports.calculateWorkflowCompletionPercentage)(workflow),
        status: (0, exports.getWorkflowExecutionStatus)(workflow),
        expiresAt: workflow.expirationDate,
        isExpired: (0, exports.isWorkflowExpired)(workflow),
    };
};
exports.generateWorkflowSummary = generateWorkflowSummary;
/**
 * Validates workflow configuration.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow to validate
 * @returns {Array<string>} Validation errors
 *
 * @example
 * ```typescript
 * const errors = validateWorkflowConfiguration(workflow);
 * ```
 */
const validateWorkflowConfiguration = (workflow) => {
    const errors = [];
    if (!workflow.documentId) {
        errors.push('Document ID is required');
    }
    if (!workflow.signers || workflow.signers.length === 0) {
        errors.push('At least one signer is required');
    }
    workflow.signers.forEach((signer, index) => {
        if (!(0, exports.validateSignerEmail)(signer.email)) {
            errors.push(`Invalid email for signer ${index + 1}: ${signer.email}`);
        }
        if (signer.phoneNumber && !(0, exports.validateSignerPhone)(signer.phoneNumber)) {
            errors.push(`Invalid phone for signer ${index + 1}: ${signer.phoneNumber}`);
        }
    });
    if (workflow.routingOrder === RoutingOrder.SEQUENTIAL) {
        const orders = workflow.signers.map((s) => s.routingOrder);
        const uniqueOrders = new Set(orders);
        if (orders.length !== uniqueOrders.size) {
            errors.push('Duplicate routing orders found in sequential workflow');
        }
    }
    return errors;
};
exports.validateWorkflowConfiguration = validateWorkflowConfiguration;
/**
 * Clones a workflow for reuse.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow to clone
 * @param {string} newDocumentId - New document ID
 * @returns {SigningWorkflowConfig} Cloned workflow
 *
 * @example
 * ```typescript
 * const cloned = cloneWorkflow(originalWorkflow, 'newDoc123');
 * ```
 */
const cloneWorkflow = (workflow, newDocumentId) => {
    return {
        ...workflow,
        id: crypto.randomUUID(),
        documentId: newDocumentId,
        signers: workflow.signers.map((s) => ({
            ...s,
            id: crypto.randomUUID(),
            status: SignerStatus.PENDING,
            signedAt: undefined,
            ipAddress: undefined,
        })),
    };
};
exports.cloneWorkflow = cloneWorkflow;
/**
 * Merges multiple workflows into a single workflow.
 *
 * @param {SigningWorkflowConfig[]} workflows - Workflows to merge
 * @param {string} documentId - Target document ID
 * @returns {SigningWorkflowConfig} Merged workflow
 *
 * @example
 * ```typescript
 * const merged = mergeWorkflows([workflow1, workflow2], 'doc123');
 * ```
 */
const mergeWorkflows = (workflows, documentId) => {
    const allSigners = [];
    let routingOrder = 1;
    workflows.forEach((workflow) => {
        workflow.signers.forEach((signer) => {
            allSigners.push({
                ...signer,
                routingOrder: routingOrder++,
            });
        });
    });
    return (0, exports.createSigningWorkflow)(documentId, WorkflowType.SEQUENTIAL_APPROVAL, allSigners, { name: 'Merged Workflow' });
};
exports.mergeWorkflows = mergeWorkflows;
// ============================================================================
// NESTJS SERVICE EXAMPLE
// ============================================================================
/**
 * Signing Workflow Service
 * Production-ready NestJS service for document signing workflow operations
 */
let SigningWorkflowService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SigningWorkflowService = _classThis = class {
        /**
         * Initiates a new signing workflow
         */
        async initiateWorkflow(documentId, workflowType, signers) {
            const workflow = (0, exports.createSigningWorkflow)(documentId, workflowType, signers);
            // Validate configuration
            const errors = (0, exports.validateWorkflowConfiguration)(workflow);
            if (errors.length > 0) {
                throw new Error(`Workflow validation failed: ${errors.join(', ')}`);
            }
            // Send initial notifications
            const nextSigner = (0, exports.getNextSigner)(workflow);
            if (nextSigner) {
                (0, exports.sendSignatureRequest)(nextSigner, documentId, `https://sign.example.com/${workflow.id}`);
            }
            return workflow;
        }
        /**
         * Processes signer action
         */
        async processSignerAction(workflowId, signerId, action) {
            // Implementation would fetch workflow, update signer status, and check completion
            return WorkflowExecutionStatus.IN_PROGRESS;
        }
    };
    __setFunctionName(_classThis, "SigningWorkflowService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SigningWorkflowService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SigningWorkflowService = _classThis;
})();
exports.SigningWorkflowService = SigningWorkflowService;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    SigningWorkflowConfigModel,
    SigningSessionModel,
    BulkSigningOperationModel,
    // Core Functions
    createSigningWorkflow: exports.createSigningWorkflow,
    addSignerToWorkflow: exports.addSignerToWorkflow,
    removeSignerFromWorkflow: exports.removeSignerFromWorkflow,
    updateSignerRoutingOrder: exports.updateSignerRoutingOrder,
    getNextSigner: exports.getNextSigner,
    areAllSignersComplete: exports.areAllSignersComplete,
    createSignatureField: exports.createSignatureField,
    validateSignatureFieldPlacement: exports.validateSignatureFieldPlacement,
    generateSigningSession: exports.generateSigningSession,
    validateSigningSession: exports.validateSigningSession,
    markSignerComplete: exports.markSignerComplete,
    createSigningReminder: exports.createSigningReminder,
    scheduleAutomaticReminders: exports.scheduleAutomaticReminders,
    sendSignatureRequest: exports.sendSignatureRequest,
    createBulkSigningOperation: exports.createBulkSigningOperation,
    processBulkRecipient: exports.processBulkRecipient,
    isBulkOperationComplete: exports.isBulkOperationComplete,
    updateBulkOperationStats: exports.updateBulkOperationStats,
    createApprovalChain: exports.createApprovalChain,
    getNextApprover: exports.getNextApprover,
    markApproverDecision: exports.markApproverDecision,
    areAllApproversApproved: exports.areAllApproversApproved,
    delegateApproval: exports.delegateApproval,
    authenticateSignerWithCode: exports.authenticateSignerWithCode,
    generateAccessCode: exports.generateAccessCode,
    validateSignerEmail: exports.validateSignerEmail,
    validateSignerPhone: exports.validateSignerPhone,
    calculateWorkflowCompletionPercentage: exports.calculateWorkflowCompletionPercentage,
    getWorkflowExecutionStatus: exports.getWorkflowExecutionStatus,
    createCounterSignatureWorkflow: exports.createCounterSignatureWorkflow,
    voidSigningWorkflow: exports.voidSigningWorkflow,
    exportWorkflowAuditTrail: exports.exportWorkflowAuditTrail,
    isWorkflowExpired: exports.isWorkflowExpired,
    extendWorkflowExpiration: exports.extendWorkflowExpiration,
    calculateTimeUntilExpiration: exports.calculateTimeUntilExpiration,
    generateWorkflowSummary: exports.generateWorkflowSummary,
    validateWorkflowConfiguration: exports.validateWorkflowConfiguration,
    cloneWorkflow: exports.cloneWorkflow,
    mergeWorkflows: exports.mergeWorkflows,
    // Services
    SigningWorkflowService,
};
//# sourceMappingURL=document-signing-workflow-composite.js.map