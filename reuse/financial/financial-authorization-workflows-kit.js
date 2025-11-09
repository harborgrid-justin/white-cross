"use strict";
/**
 * LOC: FINAUTH7890123
 * File: /reuse/financial/financial-authorization-workflows-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../auditing-utils.ts
 *   - ../authentication-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Authorization workflow services
 *   - Approval routing controllers
 *   - Financial audit services
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
exports.FinancialAuthorizationController = exports.ApprovalAuditInterceptor = exports.AuthorizationLimitGuard = exports.createWorkflowRuleModel = exports.createDelegationChainModel = exports.createAuthorizationLimitModel = exports.createApprovalActionModel = exports.createApprovalStepModel = exports.createApprovalRouteModel = exports.DelegationDto = exports.ApprovalActionDto = exports.ApprovalRouteDto = void 0;
exports.createApprovalRoute = createApprovalRoute;
exports.getApprovalMatrix = getApprovalMatrix;
exports.createApprovalSteps = createApprovalSteps;
exports.processApprovalAction = processApprovalAction;
exports.validateApproverAuthority = validateApproverAuthority;
exports.recordApprovalAction = recordApprovalAction;
exports.updateStepStatus = updateStepStatus;
exports.advanceRouteIfReady = advanceRouteIfReady;
exports.sendApprovalNotifications = sendApprovalNotifications;
exports.getNextApprovalStep = getNextApprovalStep;
exports.sendBatchNotifications = sendBatchNotifications;
exports.delegateApprovalAuthority = delegateApprovalAuthority;
exports.validateDelegationChain = validateDelegationChain;
exports.findActiveDelegation = findActiveDelegation;
exports.revokeDelegation = revokeDelegation;
exports.getDelegationById = getDelegationById;
exports.checkAuthorizationLimit = checkAuthorizationLimit;
exports.updateAuthorizationUsage = updateAuthorizationUsage;
exports.resetPeriodicLimits = resetPeriodicLimits;
exports.escalateApproval = escalateApproval;
exports.sendEscalationNotifications = sendEscalationNotifications;
exports.getApprovalStepById = getApprovalStepById;
exports.checkTimeoutsAndEscalate = checkTimeoutsAndEscalate;
exports.applyWorkflowRules = applyWorkflowRules;
exports.evaluateRuleConditions = evaluateRuleConditions;
exports.executeRuleActions = executeRuleActions;
exports.routeToApprovers = routeToApprovers;
exports.sendCustomNotification = sendCustomNotification;
exports.autoApproveRoute = autoApproveRoute;
exports.requireDualAuthentication = requireDualAuthentication;
exports.flagForManualReview = flagForManualReview;
exports.checkSegregationOfDuties = checkSegregationOfDuties;
exports.getApprovalHistory = getApprovalHistory;
exports.getPendingApprovalsForUser = getPendingApprovalsForUser;
exports.getApprovalStatistics = getApprovalStatistics;
exports.calculateExpiration = calculateExpiration;
exports.sendApprovalReminders = sendApprovalReminders;
exports.recallApprovalRoute = recallApprovalRoute;
exports.getApprovalRouteById = getApprovalRouteById;
exports.processParallelApproval = processParallelApproval;
exports.evaluateConditionalStep = evaluateConditionalStep;
exports.bulkApproveRoutes = bulkApproveRoutes;
exports.getDelegatedApprovals = getDelegatedApprovals;
exports.expireOldApprovals = expireOldApprovals;
exports.generateUUID = generateUUID;
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const operators_1 = require("rxjs/operators");
let ApprovalRouteDto = (() => {
    var _a;
    let _documentType_decorators;
    let _documentType_initializers = [];
    let _documentType_extraInitializers = [];
    let _documentId_decorators;
    let _documentId_initializers = [];
    let _documentId_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _costCenterId_decorators;
    let _costCenterId_initializers = [];
    let _costCenterId_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class ApprovalRouteDto {
            constructor() {
                this.documentType = __runInitializers(this, _documentType_initializers, void 0);
                this.documentId = (__runInitializers(this, _documentType_extraInitializers), __runInitializers(this, _documentId_initializers, void 0));
                this.amount = (__runInitializers(this, _documentId_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.currency = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                this.organizationId = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _organizationId_initializers, void 0));
                this.costCenterId = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _costCenterId_initializers, void 0));
                this.priority = (__runInitializers(this, _costCenterId_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.metadata = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _documentType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document type requiring approval' })];
            _documentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document ID' })];
            _amount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transaction amount' })];
            _currency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Currency code' })];
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' })];
            _costCenterId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost center ID' })];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority level', enum: ['low', 'normal', 'high', 'urgent'] })];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata' })];
            __esDecorate(null, null, _documentType_decorators, { kind: "field", name: "documentType", static: false, private: false, access: { has: obj => "documentType" in obj, get: obj => obj.documentType, set: (obj, value) => { obj.documentType = value; } }, metadata: _metadata }, _documentType_initializers, _documentType_extraInitializers);
            __esDecorate(null, null, _documentId_decorators, { kind: "field", name: "documentId", static: false, private: false, access: { has: obj => "documentId" in obj, get: obj => obj.documentId, set: (obj, value) => { obj.documentId = value; } }, metadata: _metadata }, _documentId_initializers, _documentId_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _costCenterId_decorators, { kind: "field", name: "costCenterId", static: false, private: false, access: { has: obj => "costCenterId" in obj, get: obj => obj.costCenterId, set: (obj, value) => { obj.costCenterId = value; } }, metadata: _metadata }, _costCenterId_initializers, _costCenterId_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ApprovalRouteDto = ApprovalRouteDto;
let ApprovalActionDto = (() => {
    var _a;
    let _action_decorators;
    let _action_initializers = [];
    let _action_extraInitializers = [];
    let _comments_decorators;
    let _comments_initializers = [];
    let _comments_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _delegatedTo_decorators;
    let _delegatedTo_initializers = [];
    let _delegatedTo_extraInitializers = [];
    return _a = class ApprovalActionDto {
            constructor() {
                this.action = __runInitializers(this, _action_initializers, void 0);
                this.comments = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _comments_initializers, void 0));
                this.attachments = (__runInitializers(this, _comments_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
                this.delegatedTo = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _delegatedTo_initializers, void 0));
                __runInitializers(this, _delegatedTo_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _action_decorators = [(0, swagger_1.ApiProperty)({ description: 'Action to perform', enum: ['approve', 'reject', 'delegate', 'recall', 'request_info'] })];
            _comments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Comments for the action' })];
            _attachments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Attachment URLs' })];
            _delegatedTo_decorators = [(0, swagger_1.ApiProperty)({ description: 'Delegate user ID (for delegation)' })];
            __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: obj => "action" in obj, get: obj => obj.action, set: (obj, value) => { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
            __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: obj => "comments" in obj, get: obj => obj.comments, set: (obj, value) => { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
            __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
            __esDecorate(null, null, _delegatedTo_decorators, { kind: "field", name: "delegatedTo", static: false, private: false, access: { has: obj => "delegatedTo" in obj, get: obj => obj.delegatedTo, set: (obj, value) => { obj.delegatedTo = value; } }, metadata: _metadata }, _delegatedTo_initializers, _delegatedTo_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ApprovalActionDto = ApprovalActionDto;
let DelegationDto = (() => {
    var _a;
    let _delegateId_decorators;
    let _delegateId_initializers = [];
    let _delegateId_extraInitializers = [];
    let _authority_decorators;
    let _authority_initializers = [];
    let _authority_extraInitializers = [];
    let _scope_decorators;
    let _scope_initializers = [];
    let _scope_extraInitializers = [];
    let _specificDocumentTypes_decorators;
    let _specificDocumentTypes_initializers = [];
    let _specificDocumentTypes_extraInitializers = [];
    let _maxAmount_decorators;
    let _maxAmount_initializers = [];
    let _maxAmount_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    return _a = class DelegationDto {
            constructor() {
                this.delegateId = __runInitializers(this, _delegateId_initializers, void 0);
                this.authority = (__runInitializers(this, _delegateId_extraInitializers), __runInitializers(this, _authority_initializers, void 0));
                this.scope = (__runInitializers(this, _authority_extraInitializers), __runInitializers(this, _scope_initializers, void 0));
                this.specificDocumentTypes = (__runInitializers(this, _scope_extraInitializers), __runInitializers(this, _specificDocumentTypes_initializers, void 0));
                this.maxAmount = (__runInitializers(this, _specificDocumentTypes_extraInitializers), __runInitializers(this, _maxAmount_initializers, void 0));
                this.startDate = (__runInitializers(this, _maxAmount_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.reason = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                __runInitializers(this, _reason_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _delegateId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID to delegate to' })];
            _authority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Authority being delegated' })];
            _scope_decorators = [(0, swagger_1.ApiProperty)({ description: 'Delegation scope', enum: ['all', 'specific'] })];
            _specificDocumentTypes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Specific document types (for specific scope)' })];
            _maxAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Maximum amount for delegation' })];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' })];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date' })];
            _reason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reason for delegation' })];
            __esDecorate(null, null, _delegateId_decorators, { kind: "field", name: "delegateId", static: false, private: false, access: { has: obj => "delegateId" in obj, get: obj => obj.delegateId, set: (obj, value) => { obj.delegateId = value; } }, metadata: _metadata }, _delegateId_initializers, _delegateId_extraInitializers);
            __esDecorate(null, null, _authority_decorators, { kind: "field", name: "authority", static: false, private: false, access: { has: obj => "authority" in obj, get: obj => obj.authority, set: (obj, value) => { obj.authority = value; } }, metadata: _metadata }, _authority_initializers, _authority_extraInitializers);
            __esDecorate(null, null, _scope_decorators, { kind: "field", name: "scope", static: false, private: false, access: { has: obj => "scope" in obj, get: obj => obj.scope, set: (obj, value) => { obj.scope = value; } }, metadata: _metadata }, _scope_initializers, _scope_extraInitializers);
            __esDecorate(null, null, _specificDocumentTypes_decorators, { kind: "field", name: "specificDocumentTypes", static: false, private: false, access: { has: obj => "specificDocumentTypes" in obj, get: obj => obj.specificDocumentTypes, set: (obj, value) => { obj.specificDocumentTypes = value; } }, metadata: _metadata }, _specificDocumentTypes_initializers, _specificDocumentTypes_extraInitializers);
            __esDecorate(null, null, _maxAmount_decorators, { kind: "field", name: "maxAmount", static: false, private: false, access: { has: obj => "maxAmount" in obj, get: obj => obj.maxAmount, set: (obj, value) => { obj.maxAmount = value; } }, metadata: _metadata }, _maxAmount_initializers, _maxAmount_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.DelegationDto = DelegationDto;
// ============================================================================
// SEQUELIZE MODELS (6 models)
// ============================================================================
/**
 * Sequelize model for Approval Routes - manages the complete approval workflow lifecycle
 */
const createApprovalRouteModel = (sequelize) => {
    class ApprovalRouteModel extends sequelize_1.Model {
    }
    ApprovalRouteModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        routeId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            unique: true,
            allowNull: false,
            comment: 'Unique route identifier',
        },
        documentType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Type of document (PO, Invoice, Payment, etc.)',
        },
        documentId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Reference to document ID',
        },
        amount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Transaction amount',
            validate: {
                min: 0,
            },
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'USD',
            comment: 'Currency code (ISO 4217)',
        },
        organizationId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Organization ID',
        },
        costCenterId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Cost center ID',
        },
        currentStepIndex: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Current approval step index',
        },
        totalSteps: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: 'Total number of approval steps',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'in_progress', 'approved', 'rejected', 'cancelled', 'expired'),
            allowNull: false,
            defaultValue: 'pending',
            comment: 'Overall route status',
        },
        priority: {
            type: sequelize_1.DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
            allowNull: false,
            defaultValue: 'normal',
            comment: 'Priority level',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created the route',
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Route expiration timestamp',
        },
        completedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Route completion timestamp',
        },
        completedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who completed the route',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'approval_routes',
        timestamps: true,
        indexes: [
            { fields: ['routeId'], unique: true },
            { fields: ['documentType', 'documentId'] },
            { fields: ['status'] },
            { fields: ['priority'] },
            { fields: ['organizationId'] },
            { fields: ['costCenterId'] },
            { fields: ['createdBy'] },
            { fields: ['createdAt'] },
            { fields: ['expiresAt'] },
        ],
    });
    return ApprovalRouteModel;
};
exports.createApprovalRouteModel = createApprovalRouteModel;
/**
 * Sequelize model for Approval Steps - individual approval steps within a route
 */
const createApprovalStepModel = (sequelize) => {
    class ApprovalStepModel extends sequelize_1.Model {
    }
    ApprovalStepModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        stepId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            unique: true,
            allowNull: false,
            comment: 'Unique step identifier',
        },
        routeId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to approval route',
        },
        stepIndex: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Step order index',
        },
        stepType: {
            type: sequelize_1.DataTypes.ENUM('serial', 'parallel', 'conditional', 'automatic'),
            allowNull: false,
            defaultValue: 'serial',
            comment: 'Type of approval step',
        },
        stepName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Descriptive step name',
        },
        approverType: {
            type: sequelize_1.DataTypes.ENUM('user', 'role', 'group', 'system'),
            allowNull: false,
            comment: 'Type of approver',
        },
        approverIds: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Array of approver identifiers',
        },
        requiredApprovals: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: 'Number of approvals required',
            validate: {
                min: 1,
            },
        },
        actualApprovals: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of approvals received',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'in_progress', 'approved', 'rejected', 'skipped'),
            allowNull: false,
            defaultValue: 'pending',
            comment: 'Step status',
        },
        condition: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'JSON logic for conditional step evaluation',
        },
        timeoutMinutes: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Timeout in minutes before escalation',
        },
        notificationsSent: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Count of notifications sent',
        },
        startedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Step start timestamp',
        },
        completedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Step completion timestamp',
        },
    }, {
        sequelize,
        tableName: 'approval_steps',
        timestamps: true,
        indexes: [
            { fields: ['stepId'], unique: true },
            { fields: ['routeId', 'stepIndex'] },
            { fields: ['status'] },
            { fields: ['approverType'] },
            { fields: ['startedAt'] },
        ],
    });
    return ApprovalStepModel;
};
exports.createApprovalStepModel = createApprovalStepModel;
/**
 * Sequelize model for Approval Actions - records all approval-related actions
 */
const createApprovalActionModel = (sequelize) => {
    class ApprovalActionModel extends sequelize_1.Model {
    }
    ApprovalActionModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        actionId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            unique: true,
            allowNull: false,
            comment: 'Unique action identifier',
        },
        routeId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to approval route',
        },
        stepId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to approval step',
        },
        approverId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who performed the action',
        },
        action: {
            type: sequelize_1.DataTypes.ENUM('approve', 'reject', 'delegate', 'recall', 'request_info', 'escalate'),
            allowNull: false,
            comment: 'Action performed',
        },
        comments: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Action comments',
        },
        attachments: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Attachment URLs',
        },
        delegatedTo: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User ID if action was delegated',
        },
        ipAddress: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: false,
            comment: 'IP address of action',
        },
        authMethod: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Authentication method used',
        },
        deviceInfo: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Device information',
        },
        actionTimestamp: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'When action was performed',
        },
    }, {
        sequelize,
        tableName: 'approval_actions',
        timestamps: true,
        indexes: [
            { fields: ['actionId'], unique: true },
            { fields: ['routeId'] },
            { fields: ['stepId'] },
            { fields: ['approverId'] },
            { fields: ['action'] },
            { fields: ['actionTimestamp'] },
        ],
    });
    return ApprovalActionModel;
};
exports.createApprovalActionModel = createApprovalActionModel;
/**
 * Sequelize model for Authorization Limits - defines spending and approval authority
 */
const createAuthorizationLimitModel = (sequelize) => {
    class AuthorizationLimitModel extends sequelize_1.Model {
    }
    AuthorizationLimitModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        limitId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            unique: true,
            allowNull: false,
            comment: 'Unique limit identifier',
        },
        userId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User ID for this limit',
        },
        roleId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Role ID if limit is role-based',
        },
        documentType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Document type this limit applies to',
        },
        accountCategory: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Account category (e.g., OPEX, CAPEX)',
        },
        maxAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Maximum authorization amount',
            validate: {
                min: 0,
            },
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'USD',
            comment: 'Currency code',
        },
        periodType: {
            type: sequelize_1.DataTypes.ENUM('transaction', 'daily', 'weekly', 'monthly', 'annual'),
            allowNull: false,
            defaultValue: 'transaction',
            comment: 'Period type for limit',
        },
        currentUsage: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Current usage in period',
        },
        resetDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date when usage resets',
        },
        effectiveFrom: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Effective from date',
        },
        effectiveTo: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Effective to date',
        },
        conditions: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional conditions',
        },
        requiresSecondApproval: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether second approval is required',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether limit is active',
        },
    }, {
        sequelize,
        tableName: 'authorization_limits',
        timestamps: true,
        indexes: [
            { fields: ['limitId'], unique: true },
            { fields: ['userId'] },
            { fields: ['roleId'] },
            { fields: ['documentType'] },
            { fields: ['isActive'] },
            { fields: ['effectiveFrom', 'effectiveTo'] },
        ],
    });
    return AuthorizationLimitModel;
};
exports.createAuthorizationLimitModel = createAuthorizationLimitModel;
/**
 * Sequelize model for Delegation Chains - manages delegation of authority
 */
const createDelegationChainModel = (sequelize) => {
    class DelegationChainModel extends sequelize_1.Model {
    }
    DelegationChainModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        delegationId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            unique: true,
            allowNull: false,
            comment: 'Unique delegation identifier',
        },
        delegatorId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User delegating authority',
        },
        delegateId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User receiving delegated authority',
        },
        authority: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Authority being delegated',
        },
        scope: {
            type: sequelize_1.DataTypes.ENUM('all', 'specific'),
            allowNull: false,
            defaultValue: 'all',
            comment: 'Delegation scope',
        },
        specificDocumentTypes: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Specific document types if scope is specific',
        },
        maxAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: true,
            comment: 'Maximum amount for delegation',
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Delegation start date',
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Delegation end date',
        },
        reason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Reason for delegation',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'expired', 'revoked'),
            allowNull: false,
            defaultValue: 'active',
            comment: 'Delegation status',
        },
        revokedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Revocation timestamp',
        },
        revokedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who revoked delegation',
        },
        autoExpire: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether delegation auto-expires',
        },
    }, {
        sequelize,
        tableName: 'delegation_chains',
        timestamps: true,
        indexes: [
            { fields: ['delegationId'], unique: true },
            { fields: ['delegatorId'] },
            { fields: ['delegateId'] },
            { fields: ['status'] },
            { fields: ['startDate', 'endDate'] },
        ],
    });
    return DelegationChainModel;
};
exports.createDelegationChainModel = createDelegationChainModel;
/**
 * Sequelize model for Workflow Rules - configurable business rules for routing
 */
const createWorkflowRuleModel = (sequelize) => {
    class WorkflowRuleModel extends sequelize_1.Model {
    }
    WorkflowRuleModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        ruleId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            unique: true,
            allowNull: false,
            comment: 'Unique rule identifier',
        },
        ruleName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Descriptive rule name',
        },
        documentType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Document type this rule applies to',
        },
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 100,
            comment: 'Rule priority (lower = higher priority)',
        },
        conditions: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Array of rule conditions',
        },
        actions: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Array of actions to execute',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether rule is active',
        },
        effectiveFrom: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Rule effective from date',
        },
        effectiveTo: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Rule effective to date',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Rule description',
        },
        executionCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of times rule has been executed',
        },
        lastExecuted: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last execution timestamp',
        },
    }, {
        sequelize,
        tableName: 'workflow_rules',
        timestamps: true,
        indexes: [
            { fields: ['ruleId'], unique: true },
            { fields: ['documentType'] },
            { fields: ['priority'] },
            { fields: ['isActive'] },
            { fields: ['effectiveFrom', 'effectiveTo'] },
        ],
    });
    return WorkflowRuleModel;
};
exports.createWorkflowRuleModel = createWorkflowRuleModel;
// ============================================================================
// NESTJS GUARDS & INTERCEPTORS
// ============================================================================
/**
 * Guard to verify user has authorization within limits
 */
let AuthorizationLimitGuard = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AuthorizationLimitGuard = _classThis = class {
        async canActivate(context) {
            const request = context.switchToHttp().getRequest();
            const user = request.user;
            const { amount, documentType } = request.body;
            if (!user || !amount || !documentType) {
                throw new common_1.BadRequestException('Missing required authorization parameters');
            }
            const hasAuthority = await this.checkAuthorizationLimit(user.id, documentType, amount);
            if (!hasAuthority) {
                throw new common_1.ForbiddenException('Amount exceeds authorization limit');
            }
            return true;
        }
        async checkAuthorizationLimit(userId, documentType, amount) {
            // Implementation would query authorization_limits table
            return true;
        }
    };
    __setFunctionName(_classThis, "AuthorizationLimitGuard");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthorizationLimitGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthorizationLimitGuard = _classThis;
})();
exports.AuthorizationLimitGuard = AuthorizationLimitGuard;
/**
 * Interceptor for audit logging of approval actions
 */
let ApprovalAuditInterceptor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ApprovalAuditInterceptor = _classThis = class {
        intercept(context, next) {
            const request = context.switchToHttp().getRequest();
            const user = request.user;
            const startTime = Date.now();
            return next.handle().pipe((0, operators_1.tap)({
                next: (data) => {
                    const duration = Date.now() - startTime;
                    this.logApprovalAction(request, user, data, 'success', duration);
                },
                error: (error) => {
                    const duration = Date.now() - startTime;
                    this.logApprovalAction(request, user, null, 'error', duration, error);
                },
            }));
        }
        logApprovalAction(request, user, data, status, duration, error) {
            const auditLog = {
                userId: user?.id,
                action: request.method,
                path: request.url,
                body: request.body,
                response: data,
                status,
                duration,
                error: error?.message,
                timestamp: new Date(),
                ipAddress: request.ip,
            };
            // Log to audit system
            console.log('Approval Audit:', auditLog);
        }
    };
    __setFunctionName(_classThis, "ApprovalAuditInterceptor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ApprovalAuditInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ApprovalAuditInterceptor = _classThis;
})();
exports.ApprovalAuditInterceptor = ApprovalAuditInterceptor;
// ============================================================================
// UTILITY FUNCTIONS (45 functions)
// ============================================================================
/**
 * 1. Create a new approval route based on document type and amount
 *
 * @param {ApprovalRoute} routeData - Approval route data
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalRoute>} Created approval route
 *
 * @example
 * ```typescript
 * const route = await createApprovalRoute({
 *   documentType: 'purchase_order',
 *   documentId: 'PO-12345',
 *   amount: 50000,
 *   currency: 'USD',
 *   organizationId: 'ORG-001',
 *   costCenterId: 'CC-100',
 *   priority: 'high',
 *   createdBy: 'user123',
 *   metadata: { vendor: 'ACME Corp' }
 * }, transaction);
 * ```
 */
async function createApprovalRoute(routeData, transaction) {
    try {
        // Determine approval steps based on amount and document type
        const approvalMatrix = await getApprovalMatrix(routeData.documentType, routeData.organizationId, routeData.amount);
        const route = {
            routeId: generateUUID(),
            documentType: routeData.documentType,
            documentId: routeData.documentId,
            amount: routeData.amount,
            currency: routeData.currency || 'USD',
            organizationId: routeData.organizationId,
            costCenterId: routeData.costCenterId,
            currentStepIndex: 0,
            status: 'pending',
            priority: routeData.priority || 'normal',
            createdBy: routeData.createdBy,
            createdAt: new Date(),
            metadata: routeData.metadata || {},
        };
        // Calculate expiration based on priority
        route.expiresAt = calculateExpiration(route.priority);
        // Create approval steps based on matrix
        await createApprovalSteps(route.routeId, approvalMatrix, transaction);
        return route;
    }
    catch (error) {
        throw new Error(`Failed to create approval route: ${error.message}`);
    }
}
/**
 * 2. Get approval matrix for document type and amount
 *
 * @param {string} documentType - Document type
 * @param {string} organizationId - Organization ID
 * @param {number} amount - Transaction amount
 * @returns {Promise<ApprovalMatrix>} Approval matrix configuration
 */
async function getApprovalMatrix(documentType, organizationId, amount) {
    // Implementation would query workflow rules and approval matrix
    const matrix = {
        matrixId: generateUUID(),
        organizationId,
        documentType,
        amountRanges: [
            {
                minAmount: 0,
                maxAmount: 10000,
                requiredApprovers: [
                    {
                        level: 1,
                        approverType: 'role',
                        approverIdentifiers: ['supervisor'],
                        minimumRequired: 1,
                        canDelegate: true,
                    },
                ],
                timeoutHours: 24,
                escalationEnabled: true,
            },
            {
                minAmount: 10000,
                maxAmount: 50000,
                requiredApprovers: [
                    {
                        level: 1,
                        approverType: 'role',
                        approverIdentifiers: ['supervisor'],
                        minimumRequired: 1,
                        canDelegate: true,
                    },
                    {
                        level: 2,
                        approverType: 'role',
                        approverIdentifiers: ['manager'],
                        minimumRequired: 1,
                        canDelegate: false,
                    },
                ],
                timeoutHours: 48,
                escalationEnabled: true,
            },
            {
                minAmount: 50000,
                maxAmount: Number.MAX_SAFE_INTEGER,
                requiredApprovers: [
                    {
                        level: 1,
                        approverType: 'role',
                        approverIdentifiers: ['supervisor'],
                        minimumRequired: 1,
                        canDelegate: true,
                    },
                    {
                        level: 2,
                        approverType: 'role',
                        approverIdentifiers: ['manager'],
                        minimumRequired: 1,
                        canDelegate: false,
                    },
                    {
                        level: 3,
                        approverType: 'role',
                        approverIdentifiers: ['director', 'cfo'],
                        minimumRequired: 1,
                        canDelegate: false,
                    },
                ],
                timeoutHours: 72,
                escalationEnabled: true,
            },
        ],
        approvalLevels: 3,
        parallelApprovals: false,
        requiresAllApprovals: true,
        version: 1,
        isActive: true,
        effectiveFrom: new Date('2024-01-01'),
    };
    return matrix;
}
/**
 * 3. Create approval steps for a route
 *
 * @param {string} routeId - Approval route ID
 * @param {ApprovalMatrix} matrix - Approval matrix
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalStep[]>} Created approval steps
 */
async function createApprovalSteps(routeId, matrix, transaction) {
    const steps = [];
    for (let i = 0; i < matrix.approvalLevels; i++) {
        const step = {
            stepId: generateUUID(),
            routeId,
            stepIndex: i,
            stepType: matrix.parallelApprovals ? 'parallel' : 'serial',
            approverType: 'role',
            approverIds: [],
            requiredApprovals: 1,
            actualApprovals: 0,
            status: 'pending',
            notificationsSent: 0,
        };
        steps.push(step);
    }
    return steps;
}
/**
 * 4. Process approval action (approve, reject, delegate)
 *
 * @param {string} routeId - Approval route ID
 * @param {string} stepId - Approval step ID
 * @param {ApprovalAction} action - Approval action
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalRoute>} Updated approval route
 */
async function processApprovalAction(routeId, stepId, action, transaction) {
    try {
        // Validate approver has authority
        await validateApproverAuthority(action.approverId, stepId);
        // Record the action
        await recordApprovalAction(action, transaction);
        // Update step status
        await updateStepStatus(stepId, action.action, transaction);
        // Check if route should advance or complete
        const route = await advanceRouteIfReady(routeId, transaction);
        // Send notifications
        await sendApprovalNotifications(routeId, action, transaction);
        return route;
    }
    catch (error) {
        throw new Error(`Failed to process approval action: ${error.message}`);
    }
}
/**
 * 5. Validate approver has authority for the step
 *
 * @param {string} approverId - Approver user ID
 * @param {string} stepId - Approval step ID
 * @returns {Promise<boolean>} Whether approver has authority
 */
async function validateApproverAuthority(approverId, stepId) {
    // Implementation would check if user is in approverIds list or has delegated authority
    return true;
}
/**
 * 6. Record approval action in audit trail
 *
 * @param {ApprovalAction} action - Approval action
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalAction>} Recorded action
 */
async function recordApprovalAction(action, transaction) {
    action.actionId = generateUUID();
    action.timestamp = new Date();
    // Save to database
    return action;
}
/**
 * 7. Update approval step status
 *
 * @param {string} stepId - Step ID
 * @param {string} action - Action performed
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalStep>} Updated step
 */
async function updateStepStatus(stepId, action, transaction) {
    // Implementation would update step status based on action
    const step = {
        stepId,
        routeId: '',
        stepIndex: 0,
        stepType: 'serial',
        approverType: 'user',
        approverIds: [],
        requiredApprovals: 1,
        actualApprovals: action === 'approve' ? 1 : 0,
        status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'pending',
        notificationsSent: 0,
        completedAt: action === 'approve' || action === 'reject' ? new Date() : undefined,
    };
    return step;
}
/**
 * 8. Advance route to next step if current step is complete
 *
 * @param {string} routeId - Route ID
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalRoute>} Updated route
 */
async function advanceRouteIfReady(routeId, transaction) {
    // Implementation would check if current step is complete and advance
    const route = {
        routeId,
        documentType: '',
        documentId: '',
        amount: 0,
        currency: 'USD',
        organizationId: '',
        costCenterId: '',
        currentStepIndex: 0,
        status: 'in_progress',
        priority: 'normal',
        createdBy: '',
        createdAt: new Date(),
        metadata: {},
    };
    return route;
}
/**
 * 9. Send approval notifications to approvers
 *
 * @param {string} routeId - Route ID
 * @param {ApprovalAction} action - Approval action
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<void>}
 */
async function sendApprovalNotifications(routeId, action, transaction) {
    const notifications = [];
    // Create notifications for next approvers
    const nextStep = await getNextApprovalStep(routeId);
    if (nextStep) {
        for (const approverId of nextStep.approverIds) {
            const notification = {
                notificationId: generateUUID(),
                routeId,
                stepId: nextStep.stepId,
                recipientIds: [approverId],
                notificationType: 'email',
                template: 'approval_request',
                priority: 'normal',
                status: 'pending',
                retryCount: 0,
                maxRetries: 3,
                metadata: {},
            };
            notifications.push(notification);
        }
    }
    // Send notifications
    await sendBatchNotifications(notifications);
}
/**
 * 10. Get next approval step for a route
 *
 * @param {string} routeId - Route ID
 * @returns {Promise<ApprovalStep | null>} Next approval step or null
 */
async function getNextApprovalStep(routeId) {
    // Implementation would query next pending step
    return null;
}
/**
 * 11. Send batch notifications
 *
 * @param {NotificationConfig[]} notifications - Notifications to send
 * @returns {Promise<void>}
 */
async function sendBatchNotifications(notifications) {
    // Implementation would send notifications via email, SMS, push, etc.
    console.log(`Sending ${notifications.length} notifications`);
}
/**
 * 12. Delegate approval authority to another user
 *
 * @param {DelegationChain} delegation - Delegation configuration
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<DelegationChain>} Created delegation
 */
async function delegateApprovalAuthority(delegation, transaction) {
    const chain = {
        delegationId: generateUUID(),
        delegatorId: delegation.delegatorId,
        delegateId: delegation.delegateId,
        authority: delegation.authority,
        scope: delegation.scope || 'all',
        specificDocumentTypes: delegation.specificDocumentTypes || [],
        maxAmount: delegation.maxAmount,
        startDate: delegation.startDate,
        endDate: delegation.endDate,
        reason: delegation.reason,
        status: 'active',
        createdAt: new Date(),
        autoExpire: delegation.autoExpire !== false,
    };
    // Validate delegation doesn't create circular chains
    await validateDelegationChain(chain);
    return chain;
}
/**
 * 13. Validate delegation chain doesn't create circular references
 *
 * @param {DelegationChain} delegation - Delegation to validate
 * @returns {Promise<boolean>} Whether delegation is valid
 */
async function validateDelegationChain(delegation) {
    // Check for circular delegation
    const visited = new Set();
    let currentUserId = delegation.delegateId;
    while (currentUserId) {
        if (visited.has(currentUserId)) {
            throw new Error('Circular delegation chain detected');
        }
        visited.add(currentUserId);
        // Check if current user has delegated to someone else
        const nextDelegation = await findActiveDelegation(currentUserId);
        if (!nextDelegation) {
            break;
        }
        if (nextDelegation.delegateId === delegation.delegatorId) {
            throw new Error('Circular delegation chain detected');
        }
        currentUserId = nextDelegation.delegateId;
    }
    return true;
}
/**
 * 14. Find active delegation for a user
 *
 * @param {string} userId - User ID
 * @returns {Promise<DelegationChain | null>} Active delegation or null
 */
async function findActiveDelegation(userId) {
    // Implementation would query active delegation
    return null;
}
/**
 * 15. Revoke delegation
 *
 * @param {string} delegationId - Delegation ID
 * @param {string} revokedBy - User revoking delegation
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<DelegationChain>} Revoked delegation
 */
async function revokeDelegation(delegationId, revokedBy, transaction) {
    const delegation = await getDelegationById(delegationId);
    if (!delegation) {
        throw new common_1.NotFoundException('Delegation not found');
    }
    delegation.status = 'revoked';
    delegation.revokedAt = new Date();
    delegation.revokedBy = revokedBy;
    return delegation;
}
/**
 * 16. Get delegation by ID
 *
 * @param {string} delegationId - Delegation ID
 * @returns {Promise<DelegationChain | null>} Delegation or null
 */
async function getDelegationById(delegationId) {
    // Implementation would query delegation
    return null;
}
/**
 * 17. Check authorization limits for user
 *
 * @param {string} userId - User ID
 * @param {string} documentType - Document type
 * @param {number} amount - Transaction amount
 * @returns {Promise<AuthorizationLimit>} Authorization limit
 */
async function checkAuthorizationLimit(userId, documentType, amount) {
    // Implementation would query user's authorization limits
    const limit = {
        limitId: generateUUID(),
        userId,
        documentType,
        accountCategory: 'OPEX',
        maxAmount: 100000,
        currency: 'USD',
        periodType: 'transaction',
        currentUsage: 0,
        effectiveFrom: new Date(),
        isActive: true,
        requiresSecondApproval: amount > 50000,
        conditions: {},
    };
    if (amount > limit.maxAmount) {
        throw new common_1.ForbiddenException('Amount exceeds authorization limit');
    }
    return limit;
}
/**
 * 18. Update authorization limit usage
 *
 * @param {string} limitId - Limit ID
 * @param {number} amount - Amount to add to usage
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<AuthorizationLimit>} Updated limit
 */
async function updateAuthorizationUsage(limitId, amount, transaction) {
    // Implementation would update current usage
    const limit = {
        limitId,
        userId: '',
        documentType: '',
        accountCategory: '',
        maxAmount: 0,
        currency: 'USD',
        periodType: 'transaction',
        currentUsage: amount,
        effectiveFrom: new Date(),
        isActive: true,
        requiresSecondApproval: false,
        conditions: {},
    };
    return limit;
}
/**
 * 19. Reset periodic authorization limits
 *
 * @param {string} periodType - Period type to reset
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<number>} Number of limits reset
 */
async function resetPeriodicLimits(periodType, transaction) {
    // Implementation would reset limits based on period type
    return 0;
}
/**
 * 20. Escalate approval to next level
 *
 * @param {string} routeId - Route ID
 * @param {string} stepId - Step ID
 * @param {EscalationConfig} escalation - Escalation configuration
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalStep>} Escalated step
 */
async function escalateApproval(routeId, stepId, escalation, transaction) {
    const step = await getApprovalStepById(stepId);
    if (!step) {
        throw new common_1.NotFoundException('Approval step not found');
    }
    // Update escalation count
    if (!step.escalationConfig) {
        step.escalationConfig = escalation;
    }
    step.escalationConfig.currentEscalation += 1;
    // Add escalation approvers
    step.approverIds = [...step.approverIds, ...escalation.escalateToIds];
    // Send escalation notifications
    await sendEscalationNotifications(routeId, stepId, escalation);
    return step;
}
/**
 * 21. Send escalation notifications
 *
 * @param {string} routeId - Route ID
 * @param {string} stepId - Step ID
 * @param {EscalationConfig} escalation - Escalation configuration
 * @returns {Promise<void>}
 */
async function sendEscalationNotifications(routeId, stepId, escalation) {
    const notifications = escalation.escalateToIds.map((recipientId) => ({
        notificationId: generateUUID(),
        routeId,
        stepId,
        recipientIds: [recipientId],
        notificationType: 'email',
        template: 'escalation_notification',
        priority: 'urgent',
        status: 'pending',
        retryCount: 0,
        maxRetries: 3,
        metadata: { escalationLevel: escalation.escalationLevel },
    }));
    await sendBatchNotifications(notifications);
}
/**
 * 22. Get approval step by ID
 *
 * @param {string} stepId - Step ID
 * @returns {Promise<ApprovalStep | null>} Approval step or null
 */
async function getApprovalStepById(stepId) {
    // Implementation would query step
    return null;
}
/**
 * 23. Check for timeout and auto-escalate
 *
 * @returns {Promise<number>} Number of escalations triggered
 */
async function checkTimeoutsAndEscalate() {
    // Implementation would find timed-out steps and escalate
    return 0;
}
/**
 * 24. Apply workflow rules to determine routing
 *
 * @param {ApprovalRoute} route - Approval route
 * @returns {Promise<WorkflowRule[]>} Matching workflow rules
 */
async function applyWorkflowRules(route) {
    // Implementation would evaluate rules and return matches
    return [];
}
/**
 * 25. Evaluate rule conditions
 *
 * @param {RuleCondition[]} conditions - Rule conditions
 * @param {Record<string, any>} context - Evaluation context
 * @returns {boolean} Whether conditions are met
 */
function evaluateRuleConditions(conditions, context) {
    for (const condition of conditions) {
        const fieldValue = context[condition.field];
        let conditionMet = false;
        switch (condition.operator) {
            case 'eq':
                conditionMet = fieldValue === condition.value;
                break;
            case 'ne':
                conditionMet = fieldValue !== condition.value;
                break;
            case 'gt':
                conditionMet = fieldValue > condition.value;
                break;
            case 'gte':
                conditionMet = fieldValue >= condition.value;
                break;
            case 'lt':
                conditionMet = fieldValue < condition.value;
                break;
            case 'lte':
                conditionMet = fieldValue <= condition.value;
                break;
            case 'in':
                conditionMet = Array.isArray(condition.value) && condition.value.includes(fieldValue);
                break;
            case 'nin':
                conditionMet = Array.isArray(condition.value) && !condition.value.includes(fieldValue);
                break;
            case 'contains':
                conditionMet = String(fieldValue).includes(String(condition.value));
                break;
            case 'regex':
                conditionMet = new RegExp(condition.value).test(String(fieldValue));
                break;
        }
        if (!conditionMet && condition.logicalOperator !== 'OR') {
            return false;
        }
        if (conditionMet && condition.logicalOperator === 'OR') {
            return true;
        }
    }
    return true;
}
/**
 * 26. Execute rule actions
 *
 * @param {RuleAction[]} actions - Actions to execute
 * @param {ApprovalRoute} route - Approval route
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<void>}
 */
async function executeRuleActions(actions, route, transaction) {
    for (const action of actions) {
        switch (action.actionType) {
            case 'route_to':
                await routeToApprovers(route.routeId, action.parameters.approverIds, transaction);
                break;
            case 'notify':
                await sendCustomNotification(route.routeId, action.parameters, transaction);
                break;
            case 'escalate':
                await escalateApproval(route.routeId, action.parameters.stepId, action.parameters.escalationConfig, transaction);
                break;
            case 'auto_approve':
                await autoApproveRoute(route.routeId, transaction);
                break;
            case 'require_dual_auth':
                await requireDualAuthentication(route.routeId, transaction);
                break;
            case 'flag_review':
                await flagForManualReview(route.routeId, action.parameters.reason, transaction);
                break;
        }
    }
}
/**
 * 27. Route approval to specific approvers
 *
 * @param {string} routeId - Route ID
 * @param {string[]} approverIds - Approver IDs
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<void>}
 */
async function routeToApprovers(routeId, approverIds, transaction) {
    // Implementation would create/update approval step with specific approvers
}
/**
 * 28. Send custom notification
 *
 * @param {string} routeId - Route ID
 * @param {Record<string, any>} parameters - Notification parameters
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<void>}
 */
async function sendCustomNotification(routeId, parameters, transaction) {
    // Implementation would send custom notification
}
/**
 * 29. Auto-approve route based on rules
 *
 * @param {string} routeId - Route ID
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalRoute>} Auto-approved route
 */
async function autoApproveRoute(routeId, transaction) {
    // Implementation would automatically approve all steps
    const route = {
        routeId,
        documentType: '',
        documentId: '',
        amount: 0,
        currency: 'USD',
        organizationId: '',
        costCenterId: '',
        currentStepIndex: 0,
        status: 'approved',
        priority: 'normal',
        createdBy: '',
        createdAt: new Date(),
        metadata: { autoApproved: true },
    };
    return route;
}
/**
 * 30. Require dual authentication for sensitive approval
 *
 * @param {string} routeId - Route ID
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<void>}
 */
async function requireDualAuthentication(routeId, transaction) {
    // Implementation would flag route to require MFA or dual approval
}
/**
 * 31. Flag route for manual review
 *
 * @param {string} routeId - Route ID
 * @param {string} reason - Reason for flagging
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<void>}
 */
async function flagForManualReview(routeId, reason, transaction) {
    // Implementation would flag route for manual review
}
/**
 * 32. Check segregation of duties violations
 *
 * @param {string} userId - User ID
 * @param {string[]} functions - Functions being performed
 * @returns {Promise<SegregationOfDuties[]>} SOD violations
 */
async function checkSegregationOfDuties(userId, functions) {
    const violations = [];
    // Implementation would check for SOD conflicts
    // For example: same user can't create and approve purchase orders
    return violations;
}
/**
 * 33. Get approval history for route
 *
 * @param {string} routeId - Route ID
 * @returns {Promise<ApprovalAction[]>} Approval actions
 */
async function getApprovalHistory(routeId) {
    // Implementation would query all actions for route
    return [];
}
/**
 * 34. Get pending approvals for user
 *
 * @param {string} userId - User ID
 * @param {Record<string, any>} filters - Optional filters
 * @returns {Promise<ApprovalRoute[]>} Pending approval routes
 */
async function getPendingApprovalsForUser(userId, filters) {
    // Implementation would query pending approvals for user
    return [];
}
/**
 * 35. Get approval statistics for organization
 *
 * @param {string} organizationId - Organization ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Record<string, any>>} Approval statistics
 */
async function getApprovalStatistics(organizationId, startDate, endDate) {
    return {
        totalRoutes: 0,
        approved: 0,
        rejected: 0,
        pending: 0,
        expired: 0,
        averageApprovalTime: 0,
        escalationRate: 0,
        delegationRate: 0,
    };
}
/**
 * 36. Calculate expiration date based on priority
 *
 * @param {string} priority - Priority level
 * @returns {Date} Expiration date
 */
function calculateExpiration(priority) {
    const now = new Date();
    const hours = {
        low: 168, // 7 days
        normal: 72, // 3 days
        high: 48, // 2 days
        urgent: 24, // 1 day
    };
    return new Date(now.getTime() + (hours[priority] || hours.normal) * 60 * 60 * 1000);
}
/**
 * 37. Send reminder notifications for pending approvals
 *
 * @param {number} hoursBeforeExpiration - Hours before expiration to send reminder
 * @returns {Promise<number>} Number of reminders sent
 */
async function sendApprovalReminders(hoursBeforeExpiration = 24) {
    // Implementation would find pending approvals near expiration and send reminders
    return 0;
}
/**
 * 38. Recall approval route
 *
 * @param {string} routeId - Route ID
 * @param {string} userId - User recalling route
 * @param {string} reason - Recall reason
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalRoute>} Recalled route
 */
async function recallApprovalRoute(routeId, userId, reason, transaction) {
    const route = await getApprovalRouteById(routeId);
    if (!route) {
        throw new common_1.NotFoundException('Approval route not found');
    }
    if (route.createdBy !== userId) {
        throw new common_1.ForbiddenException('Only route creator can recall');
    }
    if (route.status !== 'pending' && route.status !== 'in_progress') {
        throw new common_1.BadRequestException('Can only recall pending or in-progress routes');
    }
    route.status = 'cancelled';
    route.metadata = { ...route.metadata, recallReason: reason, recalledAt: new Date() };
    return route;
}
/**
 * 39. Get approval route by ID
 *
 * @param {string} routeId - Route ID
 * @returns {Promise<ApprovalRoute | null>} Approval route or null
 */
async function getApprovalRouteById(routeId) {
    // Implementation would query route
    return null;
}
/**
 * 40. Parallel approval processing
 *
 * @param {string} routeId - Route ID
 * @param {string} stepId - Step ID
 * @returns {Promise<boolean>} Whether step is complete
 */
async function processParallelApproval(routeId, stepId) {
    const step = await getApprovalStepById(stepId);
    if (!step) {
        throw new common_1.NotFoundException('Approval step not found');
    }
    if (step.stepType !== 'parallel') {
        throw new common_1.BadRequestException('Step is not parallel approval type');
    }
    // Check if required approvals are met
    return step.actualApprovals >= step.requiredApprovals;
}
/**
 * 41. Conditional approval evaluation
 *
 * @param {string} stepId - Step ID
 * @param {Record<string, any>} context - Evaluation context
 * @returns {Promise<boolean>} Whether step should be executed
 */
async function evaluateConditionalStep(stepId, context) {
    const step = await getApprovalStepById(stepId);
    if (!step || !step.condition) {
        return true;
    }
    const conditions = JSON.parse(step.condition);
    return evaluateRuleConditions(conditions, context);
}
/**
 * 42. Bulk approve routes
 *
 * @param {string[]} routeIds - Route IDs to approve
 * @param {string} approverId - Approver user ID
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalRoute[]>} Approved routes
 */
async function bulkApproveRoutes(routeIds, approverId, transaction) {
    const routes = [];
    for (const routeId of routeIds) {
        const route = await getApprovalRouteById(routeId);
        if (route) {
            // Get current step
            const currentStep = await getNextApprovalStep(routeId);
            if (currentStep) {
                const action = {
                    actionId: generateUUID(),
                    routeId,
                    stepId: currentStep.stepId,
                    approverId,
                    action: 'approve',
                    ipAddress: '0.0.0.0',
                    timestamp: new Date(),
                    authMethod: 'bulk',
                };
                const updatedRoute = await processApprovalAction(routeId, currentStep.stepId, action, transaction);
                routes.push(updatedRoute);
            }
        }
    }
    return routes;
}
/**
 * 43. Get delegated approvals for user
 *
 * @param {string} userId - User ID
 * @returns {Promise<DelegationChain[]>} Active delegations
 */
async function getDelegatedApprovals(userId) {
    // Implementation would query delegations where user is delegate
    return [];
}
/**
 * 44. Expire old approvals
 *
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<number>} Number of routes expired
 */
async function expireOldApprovals(transaction) {
    // Implementation would find and expire routes past expiration date
    return 0;
}
/**
 * 45. Generate UUID helper
 *
 * @returns {string} UUID v4
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
// ============================================================================
// NESTJS CONTROLLER
// ============================================================================
let FinancialAuthorizationController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('financial-authorization'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.Controller)('api/v1/financial/authorization'), (0, common_1.UseGuards)(AuthorizationLimitGuard), (0, common_1.UseInterceptors)(ApprovalAuditInterceptor)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createRoute_decorators;
    let _getRoute_decorators;
    let _processAction_decorators;
    let _getMyApprovals_decorators;
    let _createDelegation_decorators;
    let _revokeDelegation_decorators;
    let _getHistory_decorators;
    let _recallRoute_decorators;
    let _getStatistics_decorators;
    var FinancialAuthorizationController = _classThis = class {
        /**
         * Create new approval route
         */
        async createRoute(routeDto) {
            return await createApprovalRoute(routeDto);
        }
        /**
         * Get approval route by ID
         */
        async getRoute(routeId) {
            const route = await getApprovalRouteById(routeId);
            if (!route) {
                throw new common_1.NotFoundException('Approval route not found');
            }
            return route;
        }
        /**
         * Process approval action
         */
        async processAction(routeId, stepId, actionDto) {
            const action = {
                actionId: generateUUID(),
                routeId,
                stepId,
                approverId: 'current-user-id', // Would come from auth context
                action: actionDto.action,
                comments: actionDto.comments,
                attachments: actionDto.attachments,
                delegatedTo: actionDto.delegatedTo,
                ipAddress: '0.0.0.0', // Would come from request
                timestamp: new Date(),
                authMethod: 'bearer',
            };
            return await processApprovalAction(routeId, stepId, action);
        }
        /**
         * Get pending approvals for current user
         */
        async getMyApprovals(priority, documentType) {
            const userId = 'current-user-id'; // Would come from auth context
            const filters = { priority, documentType };
            return await getPendingApprovalsForUser(userId, filters);
        }
        /**
         * Delegate approval authority
         */
        async createDelegation(delegationDto) {
            const delegation = {
                delegatorId: 'current-user-id', // Would come from auth context
                delegateId: delegationDto.delegateId,
                authority: delegationDto.authority,
                scope: delegationDto.scope,
                specificDocumentTypes: delegationDto.specificDocumentTypes,
                maxAmount: delegationDto.maxAmount,
                startDate: delegationDto.startDate,
                endDate: delegationDto.endDate,
                reason: delegationDto.reason,
            };
            return await delegateApprovalAuthority(delegation);
        }
        /**
         * Revoke delegation
         */
        async revokeDelegation(delegationId) {
            const userId = 'current-user-id'; // Would come from auth context
            await revokeDelegation(delegationId, userId);
        }
        /**
         * Get approval history
         */
        async getHistory(routeId) {
            return await getApprovalHistory(routeId);
        }
        /**
         * Recall approval route
         */
        async recallRoute(routeId, reason) {
            const userId = 'current-user-id'; // Would come from auth context
            return await recallApprovalRoute(routeId, userId, reason);
        }
        /**
         * Get approval statistics
         */
        async getStatistics(startDate, endDate) {
            const organizationId = 'current-org-id'; // Would come from auth context
            return await getApprovalStatistics(organizationId, new Date(startDate), new Date(endDate));
        }
        constructor() {
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
    __setFunctionName(_classThis, "FinancialAuthorizationController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createRoute_decorators = [(0, common_1.Post)('routes'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create new approval route' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Approval route created successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request data' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient authorization' })];
        _getRoute_decorators = [(0, common_1.Get)('routes/:routeId'), (0, swagger_1.ApiOperation)({ summary: 'Get approval route details' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Approval route retrieved successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Approval route not found' })];
        _processAction_decorators = [(0, common_1.Post)('routes/:routeId/steps/:stepId/actions'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Process approval action (approve, reject, delegate)' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Action processed successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Route or step not found' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient authority' })];
        _getMyApprovals_decorators = [(0, common_1.Get)('my-approvals'), (0, swagger_1.ApiOperation)({ summary: 'Get pending approvals for current user' }), (0, swagger_1.ApiQuery)({ name: 'priority', required: false, enum: ['low', 'normal', 'high', 'urgent'] }), (0, swagger_1.ApiQuery)({ name: 'documentType', required: false }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending approvals retrieved successfully' })];
        _createDelegation_decorators = [(0, common_1.Post)('delegations'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Delegate approval authority to another user' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Delegation created successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid delegation data' })];
        _revokeDelegation_decorators = [(0, common_1.Delete)('delegations/:delegationId'), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT), (0, swagger_1.ApiOperation)({ summary: 'Revoke approval delegation' }), (0, swagger_1.ApiResponse)({ status: 204, description: 'Delegation revoked successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Delegation not found' })];
        _getHistory_decorators = [(0, common_1.Get)('routes/:routeId/history'), (0, swagger_1.ApiOperation)({ summary: 'Get complete approval history for route' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Approval history retrieved successfully' })];
        _recallRoute_decorators = [(0, common_1.Post)('routes/:routeId/recall'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Recall approval route' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Route recalled successfully' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Not authorized to recall' })];
        _getStatistics_decorators = [(0, common_1.Get)('statistics'), (0, swagger_1.ApiOperation)({ summary: 'Get approval statistics for organization' }), (0, swagger_1.ApiQuery)({ name: 'startDate', required: true }), (0, swagger_1.ApiQuery)({ name: 'endDate', required: true }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' })];
        __esDecorate(_classThis, null, _createRoute_decorators, { kind: "method", name: "createRoute", static: false, private: false, access: { has: obj => "createRoute" in obj, get: obj => obj.createRoute }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRoute_decorators, { kind: "method", name: "getRoute", static: false, private: false, access: { has: obj => "getRoute" in obj, get: obj => obj.getRoute }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _processAction_decorators, { kind: "method", name: "processAction", static: false, private: false, access: { has: obj => "processAction" in obj, get: obj => obj.processAction }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMyApprovals_decorators, { kind: "method", name: "getMyApprovals", static: false, private: false, access: { has: obj => "getMyApprovals" in obj, get: obj => obj.getMyApprovals }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createDelegation_decorators, { kind: "method", name: "createDelegation", static: false, private: false, access: { has: obj => "createDelegation" in obj, get: obj => obj.createDelegation }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _revokeDelegation_decorators, { kind: "method", name: "revokeDelegation", static: false, private: false, access: { has: obj => "revokeDelegation" in obj, get: obj => obj.revokeDelegation }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getHistory_decorators, { kind: "method", name: "getHistory", static: false, private: false, access: { has: obj => "getHistory" in obj, get: obj => obj.getHistory }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _recallRoute_decorators, { kind: "method", name: "recallRoute", static: false, private: false, access: { has: obj => "recallRoute" in obj, get: obj => obj.recallRoute }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStatistics_decorators, { kind: "method", name: "getStatistics", static: false, private: false, access: { has: obj => "getStatistics" in obj, get: obj => obj.getStatistics }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FinancialAuthorizationController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FinancialAuthorizationController = _classThis;
})();
exports.FinancialAuthorizationController = FinancialAuthorizationController;
//# sourceMappingURL=financial-authorization-workflows-kit.js.map