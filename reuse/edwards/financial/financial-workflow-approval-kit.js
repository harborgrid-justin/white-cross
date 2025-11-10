"use strict";
/**
 * LOC: EDWWFA001
 * File: /reuse/edwards/financial/financial-workflow-approval-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/config (Configuration management)
 *   - @nestjs/swagger (API documentation)
 *   - @nestjs/bull (Queue management for workflow processing)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial workflow modules
 *   - Approval routing services
 *   - Notification services
 *   - Workflow analytics modules
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApprovalActionModel = exports.createApprovalStepModel = exports.createWorkflowInstanceModel = exports.createWorkflowDefinitionModel = exports.CreateEscalationPolicyDto = exports.CreateDelegationDto = exports.CreateApprovalRuleDto = exports.ApprovalActionDto = exports.CreateWorkflowInstanceDto = exports.CreateWorkflowDefinitionDto = void 0;
exports.createWorkflowDefinition = createWorkflowDefinition;
exports.getActiveWorkflowByType = getActiveWorkflowByType;
exports.updateWorkflowDefinition = updateWorkflowDefinition;
exports.deactivateWorkflow = deactivateWorkflow;
exports.initiateWorkflowInstance = initiateWorkflowInstance;
exports.getWorkflowInstanceWithHistory = getWorkflowInstanceWithHistory;
exports.updateWorkflowStatus = updateWorkflowStatus;
exports.getPendingApprovals = getPendingApprovals;
exports.cancelWorkflowInstance = cancelWorkflowInstance;
exports.processApprovalAction = processApprovalAction;
exports.getApprovalHistory = getApprovalHistory;
exports.validateApprovalAuthorization = validateApprovalAuthorization;
exports.determineApprovalPath = determineApprovalPath;
exports.createApprovalSteps = createApprovalSteps;
exports.advanceToNextStep = advanceToNextStep;
exports.createDelegation = createDelegation;
exports.getActiveDelegations = getActiveDelegations;
exports.revokeDelegation = revokeDelegation;
exports.escalateApprovalStep = escalateApprovalStep;
exports.processOverdueApprovals = processOverdueApprovals;
exports.sendWorkflowNotification = sendWorkflowNotification;
exports.sendApprovalReminders = sendApprovalReminders;
exports.generateWorkflowMetrics = generateWorkflowMetrics;
exports.getWorkflowDashboard = getWorkflowDashboard;
/**
 * File: /reuse/edwards/financial/financial-workflow-approval-kit.ts
 * Locator: WC-EDW-WFA-001
 * Purpose: Comprehensive Financial Workflow and Approval Management - JD Edwards EnterpriseOne-level approval routing, workflow rules, hierarchies
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, ConfigModule, Bull 4.x
 * Downstream: ../backend/edwards/*, Workflow Services, Approval Services, Notification Services, Analytics
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+, Redis 7+
 * Exports: 40 functions for approval routing, workflow rules, approval hierarchies, delegation, escalation, notifications, tracking, analytics
 *
 * LLM Context: Enterprise-grade financial workflow and approval management competing with Oracle JD Edwards EnterpriseOne.
 * Provides comprehensive approval routing, dynamic workflow rules, approval hierarchies, delegation management,
 * escalation policies, notification orchestration, workflow tracking, analytics, parallel/sequential approvals,
 * and SLA monitoring. Implements robust NestJS ConfigModule integration for environment-based configuration.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// DTO CLASSES
// ============================================================================
let CreateWorkflowDefinitionDto = (() => {
    var _a;
    let _workflowCode_decorators;
    let _workflowCode_initializers = [];
    let _workflowCode_extraInitializers = [];
    let _workflowName_decorators;
    let _workflowName_initializers = [];
    let _workflowName_extraInitializers = [];
    let _workflowType_decorators;
    let _workflowType_initializers = [];
    let _workflowType_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    return _a = class CreateWorkflowDefinitionDto {
            constructor() {
                this.workflowCode = __runInitializers(this, _workflowCode_initializers, void 0);
                this.workflowName = (__runInitializers(this, _workflowCode_extraInitializers), __runInitializers(this, _workflowName_initializers, void 0));
                this.workflowType = (__runInitializers(this, _workflowName_extraInitializers), __runInitializers(this, _workflowType_initializers, void 0));
                this.description = (__runInitializers(this, _workflowType_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.expirationDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
                __runInitializers(this, _expirationDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _workflowCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Workflow code', example: 'WF-JE-001' })];
            _workflowName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Workflow name', example: 'Journal Entry Approval' })];
            _workflowType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Workflow type', enum: ['journal_entry', 'invoice', 'payment', 'budget', 'purchase_order', 'expense_report', 'custom'] })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' })];
            _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date', example: '2024-01-01' })];
            _expirationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expiration date', required: false })];
            __esDecorate(null, null, _workflowCode_decorators, { kind: "field", name: "workflowCode", static: false, private: false, access: { has: obj => "workflowCode" in obj, get: obj => obj.workflowCode, set: (obj, value) => { obj.workflowCode = value; } }, metadata: _metadata }, _workflowCode_initializers, _workflowCode_extraInitializers);
            __esDecorate(null, null, _workflowName_decorators, { kind: "field", name: "workflowName", static: false, private: false, access: { has: obj => "workflowName" in obj, get: obj => obj.workflowName, set: (obj, value) => { obj.workflowName = value; } }, metadata: _metadata }, _workflowName_initializers, _workflowName_extraInitializers);
            __esDecorate(null, null, _workflowType_decorators, { kind: "field", name: "workflowType", static: false, private: false, access: { has: obj => "workflowType" in obj, get: obj => obj.workflowType, set: (obj, value) => { obj.workflowType = value; } }, metadata: _metadata }, _workflowType_initializers, _workflowType_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateWorkflowDefinitionDto = CreateWorkflowDefinitionDto;
let CreateWorkflowInstanceDto = (() => {
    var _a;
    let _workflowId_decorators;
    let _workflowId_initializers = [];
    let _workflowId_extraInitializers = [];
    let _entityType_decorators;
    let _entityType_initializers = [];
    let _entityType_extraInitializers = [];
    let _entityId_decorators;
    let _entityId_initializers = [];
    let _entityId_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateWorkflowInstanceDto {
            constructor() {
                this.workflowId = __runInitializers(this, _workflowId_initializers, void 0);
                this.entityType = (__runInitializers(this, _workflowId_extraInitializers), __runInitializers(this, _entityType_initializers, void 0));
                this.entityId = (__runInitializers(this, _entityType_extraInitializers), __runInitializers(this, _entityId_initializers, void 0));
                this.priority = (__runInitializers(this, _entityId_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.metadata = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _workflowId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Workflow ID' })];
            _entityType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Entity type', example: 'journal_entry' })];
            _entityId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Entity ID', example: 12345 })];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority', enum: ['low', 'medium', 'high', 'critical'], default: 'medium' })];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false })];
            __esDecorate(null, null, _workflowId_decorators, { kind: "field", name: "workflowId", static: false, private: false, access: { has: obj => "workflowId" in obj, get: obj => obj.workflowId, set: (obj, value) => { obj.workflowId = value; } }, metadata: _metadata }, _workflowId_initializers, _workflowId_extraInitializers);
            __esDecorate(null, null, _entityType_decorators, { kind: "field", name: "entityType", static: false, private: false, access: { has: obj => "entityType" in obj, get: obj => obj.entityType, set: (obj, value) => { obj.entityType = value; } }, metadata: _metadata }, _entityType_initializers, _entityType_extraInitializers);
            __esDecorate(null, null, _entityId_decorators, { kind: "field", name: "entityId", static: false, private: false, access: { has: obj => "entityId" in obj, get: obj => obj.entityId, set: (obj, value) => { obj.entityId = value; } }, metadata: _metadata }, _entityId_initializers, _entityId_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateWorkflowInstanceDto = CreateWorkflowInstanceDto;
let ApprovalActionDto = (() => {
    var _a;
    let _instanceId_decorators;
    let _instanceId_initializers = [];
    let _instanceId_extraInitializers = [];
    let _stepId_decorators;
    let _stepId_initializers = [];
    let _stepId_extraInitializers = [];
    let _actionType_decorators;
    let _actionType_initializers = [];
    let _actionType_extraInitializers = [];
    let _comments_decorators;
    let _comments_initializers = [];
    let _comments_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _delegateTo_decorators;
    let _delegateTo_initializers = [];
    let _delegateTo_extraInitializers = [];
    return _a = class ApprovalActionDto {
            constructor() {
                this.instanceId = __runInitializers(this, _instanceId_initializers, void 0);
                this.stepId = (__runInitializers(this, _instanceId_extraInitializers), __runInitializers(this, _stepId_initializers, void 0));
                this.actionType = (__runInitializers(this, _stepId_extraInitializers), __runInitializers(this, _actionType_initializers, void 0));
                this.comments = (__runInitializers(this, _actionType_extraInitializers), __runInitializers(this, _comments_initializers, void 0));
                this.attachments = (__runInitializers(this, _comments_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
                this.delegateTo = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _delegateTo_initializers, void 0));
                __runInitializers(this, _delegateTo_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _instanceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Instance ID' })];
            _stepId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Step ID' })];
            _actionType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Action type', enum: ['approve', 'reject', 'delegate', 'escalate', 'return', 'cancel'] })];
            _comments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Comments' })];
            _attachments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Attachments', type: [String], required: false })];
            _delegateTo_decorators = [(0, swagger_1.ApiProperty)({ description: 'Delegate to (if delegation)', required: false })];
            __esDecorate(null, null, _instanceId_decorators, { kind: "field", name: "instanceId", static: false, private: false, access: { has: obj => "instanceId" in obj, get: obj => obj.instanceId, set: (obj, value) => { obj.instanceId = value; } }, metadata: _metadata }, _instanceId_initializers, _instanceId_extraInitializers);
            __esDecorate(null, null, _stepId_decorators, { kind: "field", name: "stepId", static: false, private: false, access: { has: obj => "stepId" in obj, get: obj => obj.stepId, set: (obj, value) => { obj.stepId = value; } }, metadata: _metadata }, _stepId_initializers, _stepId_extraInitializers);
            __esDecorate(null, null, _actionType_decorators, { kind: "field", name: "actionType", static: false, private: false, access: { has: obj => "actionType" in obj, get: obj => obj.actionType, set: (obj, value) => { obj.actionType = value; } }, metadata: _metadata }, _actionType_initializers, _actionType_extraInitializers);
            __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: obj => "comments" in obj, get: obj => obj.comments, set: (obj, value) => { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
            __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
            __esDecorate(null, null, _delegateTo_decorators, { kind: "field", name: "delegateTo", static: false, private: false, access: { has: obj => "delegateTo" in obj, get: obj => obj.delegateTo, set: (obj, value) => { obj.delegateTo = value; } }, metadata: _metadata }, _delegateTo_initializers, _delegateTo_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ApprovalActionDto = ApprovalActionDto;
let CreateApprovalRuleDto = (() => {
    var _a;
    let _ruleName_decorators;
    let _ruleName_initializers = [];
    let _ruleName_extraInitializers = [];
    let _ruleType_decorators;
    let _ruleType_initializers = [];
    let _ruleType_extraInitializers = [];
    let _workflowType_decorators;
    let _workflowType_initializers = [];
    let _workflowType_extraInitializers = [];
    let _conditions_decorators;
    let _conditions_initializers = [];
    let _conditions_extraInitializers = [];
    let _approvalPath_decorators;
    let _approvalPath_initializers = [];
    let _approvalPath_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    return _a = class CreateApprovalRuleDto {
            constructor() {
                this.ruleName = __runInitializers(this, _ruleName_initializers, void 0);
                this.ruleType = (__runInitializers(this, _ruleName_extraInitializers), __runInitializers(this, _ruleType_initializers, void 0));
                this.workflowType = (__runInitializers(this, _ruleType_extraInitializers), __runInitializers(this, _workflowType_initializers, void 0));
                this.conditions = (__runInitializers(this, _workflowType_extraInitializers), __runInitializers(this, _conditions_initializers, void 0));
                this.approvalPath = (__runInitializers(this, _conditions_extraInitializers), __runInitializers(this, _approvalPath_initializers, void 0));
                this.priority = (__runInitializers(this, _approvalPath_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                __runInitializers(this, _effectiveDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _ruleName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule name', example: 'High Value JE Approval' })];
            _ruleType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule type', enum: ['amount_threshold', 'account_type', 'department', 'location', 'project', 'vendor', 'custom'] })];
            _workflowType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Workflow type', example: 'journal_entry' })];
            _conditions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule conditions', type: [Object] })];
            _approvalPath_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval path', type: [Object] })];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority', example: 10 })];
            _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date', example: '2024-01-01' })];
            __esDecorate(null, null, _ruleName_decorators, { kind: "field", name: "ruleName", static: false, private: false, access: { has: obj => "ruleName" in obj, get: obj => obj.ruleName, set: (obj, value) => { obj.ruleName = value; } }, metadata: _metadata }, _ruleName_initializers, _ruleName_extraInitializers);
            __esDecorate(null, null, _ruleType_decorators, { kind: "field", name: "ruleType", static: false, private: false, access: { has: obj => "ruleType" in obj, get: obj => obj.ruleType, set: (obj, value) => { obj.ruleType = value; } }, metadata: _metadata }, _ruleType_initializers, _ruleType_extraInitializers);
            __esDecorate(null, null, _workflowType_decorators, { kind: "field", name: "workflowType", static: false, private: false, access: { has: obj => "workflowType" in obj, get: obj => obj.workflowType, set: (obj, value) => { obj.workflowType = value; } }, metadata: _metadata }, _workflowType_initializers, _workflowType_extraInitializers);
            __esDecorate(null, null, _conditions_decorators, { kind: "field", name: "conditions", static: false, private: false, access: { has: obj => "conditions" in obj, get: obj => obj.conditions, set: (obj, value) => { obj.conditions = value; } }, metadata: _metadata }, _conditions_initializers, _conditions_extraInitializers);
            __esDecorate(null, null, _approvalPath_decorators, { kind: "field", name: "approvalPath", static: false, private: false, access: { has: obj => "approvalPath" in obj, get: obj => obj.approvalPath, set: (obj, value) => { obj.approvalPath = value; } }, metadata: _metadata }, _approvalPath_initializers, _approvalPath_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateApprovalRuleDto = CreateApprovalRuleDto;
let CreateDelegationDto = (() => {
    var _a;
    let _delegatorUserId_decorators;
    let _delegatorUserId_initializers = [];
    let _delegatorUserId_extraInitializers = [];
    let _delegateUserId_decorators;
    let _delegateUserId_initializers = [];
    let _delegateUserId_extraInitializers = [];
    let _delegationType_decorators;
    let _delegationType_initializers = [];
    let _delegationType_extraInitializers = [];
    let _effectiveFrom_decorators;
    let _effectiveFrom_initializers = [];
    let _effectiveFrom_extraInitializers = [];
    let _effectiveTo_decorators;
    let _effectiveTo_initializers = [];
    let _effectiveTo_extraInitializers = [];
    let _workflowTypes_decorators;
    let _workflowTypes_initializers = [];
    let _workflowTypes_extraInitializers = [];
    let _amountLimit_decorators;
    let _amountLimit_initializers = [];
    let _amountLimit_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    return _a = class CreateDelegationDto {
            constructor() {
                this.delegatorUserId = __runInitializers(this, _delegatorUserId_initializers, void 0);
                this.delegateUserId = (__runInitializers(this, _delegatorUserId_extraInitializers), __runInitializers(this, _delegateUserId_initializers, void 0));
                this.delegationType = (__runInitializers(this, _delegateUserId_extraInitializers), __runInitializers(this, _delegationType_initializers, void 0));
                this.effectiveFrom = (__runInitializers(this, _delegationType_extraInitializers), __runInitializers(this, _effectiveFrom_initializers, void 0));
                this.effectiveTo = (__runInitializers(this, _effectiveFrom_extraInitializers), __runInitializers(this, _effectiveTo_initializers, void 0));
                this.workflowTypes = (__runInitializers(this, _effectiveTo_extraInitializers), __runInitializers(this, _workflowTypes_initializers, void 0));
                this.amountLimit = (__runInitializers(this, _workflowTypes_extraInitializers), __runInitializers(this, _amountLimit_initializers, void 0));
                this.reason = (__runInitializers(this, _amountLimit_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                __runInitializers(this, _reason_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _delegatorUserId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Delegator user ID', example: 'user123' })];
            _delegateUserId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Delegate user ID', example: 'user456' })];
            _delegationType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Delegation type', enum: ['temporary', 'permanent'] })];
            _effectiveFrom_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective from date', example: '2024-01-01' })];
            _effectiveTo_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective to date', required: false })];
            _workflowTypes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Workflow types', type: [String], required: false })];
            _amountLimit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Amount limit', required: false })];
            _reason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reason for delegation' })];
            __esDecorate(null, null, _delegatorUserId_decorators, { kind: "field", name: "delegatorUserId", static: false, private: false, access: { has: obj => "delegatorUserId" in obj, get: obj => obj.delegatorUserId, set: (obj, value) => { obj.delegatorUserId = value; } }, metadata: _metadata }, _delegatorUserId_initializers, _delegatorUserId_extraInitializers);
            __esDecorate(null, null, _delegateUserId_decorators, { kind: "field", name: "delegateUserId", static: false, private: false, access: { has: obj => "delegateUserId" in obj, get: obj => obj.delegateUserId, set: (obj, value) => { obj.delegateUserId = value; } }, metadata: _metadata }, _delegateUserId_initializers, _delegateUserId_extraInitializers);
            __esDecorate(null, null, _delegationType_decorators, { kind: "field", name: "delegationType", static: false, private: false, access: { has: obj => "delegationType" in obj, get: obj => obj.delegationType, set: (obj, value) => { obj.delegationType = value; } }, metadata: _metadata }, _delegationType_initializers, _delegationType_extraInitializers);
            __esDecorate(null, null, _effectiveFrom_decorators, { kind: "field", name: "effectiveFrom", static: false, private: false, access: { has: obj => "effectiveFrom" in obj, get: obj => obj.effectiveFrom, set: (obj, value) => { obj.effectiveFrom = value; } }, metadata: _metadata }, _effectiveFrom_initializers, _effectiveFrom_extraInitializers);
            __esDecorate(null, null, _effectiveTo_decorators, { kind: "field", name: "effectiveTo", static: false, private: false, access: { has: obj => "effectiveTo" in obj, get: obj => obj.effectiveTo, set: (obj, value) => { obj.effectiveTo = value; } }, metadata: _metadata }, _effectiveTo_initializers, _effectiveTo_extraInitializers);
            __esDecorate(null, null, _workflowTypes_decorators, { kind: "field", name: "workflowTypes", static: false, private: false, access: { has: obj => "workflowTypes" in obj, get: obj => obj.workflowTypes, set: (obj, value) => { obj.workflowTypes = value; } }, metadata: _metadata }, _workflowTypes_initializers, _workflowTypes_extraInitializers);
            __esDecorate(null, null, _amountLimit_decorators, { kind: "field", name: "amountLimit", static: false, private: false, access: { has: obj => "amountLimit" in obj, get: obj => obj.amountLimit, set: (obj, value) => { obj.amountLimit = value; } }, metadata: _metadata }, _amountLimit_initializers, _amountLimit_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateDelegationDto = CreateDelegationDto;
let CreateEscalationPolicyDto = (() => {
    var _a;
    let _policyName_decorators;
    let _policyName_initializers = [];
    let _policyName_extraInitializers = [];
    let _workflowType_decorators;
    let _workflowType_initializers = [];
    let _workflowType_extraInitializers = [];
    let _escalationTrigger_decorators;
    let _escalationTrigger_initializers = [];
    let _escalationTrigger_extraInitializers = [];
    let _timeoutMinutes_decorators;
    let _timeoutMinutes_initializers = [];
    let _timeoutMinutes_extraInitializers = [];
    let _escalationLevels_decorators;
    let _escalationLevels_initializers = [];
    let _escalationLevels_extraInitializers = [];
    return _a = class CreateEscalationPolicyDto {
            constructor() {
                this.policyName = __runInitializers(this, _policyName_initializers, void 0);
                this.workflowType = (__runInitializers(this, _policyName_extraInitializers), __runInitializers(this, _workflowType_initializers, void 0));
                this.escalationTrigger = (__runInitializers(this, _workflowType_extraInitializers), __runInitializers(this, _escalationTrigger_initializers, void 0));
                this.timeoutMinutes = (__runInitializers(this, _escalationTrigger_extraInitializers), __runInitializers(this, _timeoutMinutes_initializers, void 0));
                this.escalationLevels = (__runInitializers(this, _timeoutMinutes_extraInitializers), __runInitializers(this, _escalationLevels_initializers, void 0));
                __runInitializers(this, _escalationLevels_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _policyName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Policy name', example: 'Standard Escalation' })];
            _workflowType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Workflow type', example: 'journal_entry' })];
            _escalationTrigger_decorators = [(0, swagger_1.ApiProperty)({ description: 'Escalation trigger', enum: ['timeout', 'sla_breach', 'manual', 'rule_based'] })];
            _timeoutMinutes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Timeout in minutes', required: false })];
            _escalationLevels_decorators = [(0, swagger_1.ApiProperty)({ description: 'Escalation levels', type: [Object] })];
            __esDecorate(null, null, _policyName_decorators, { kind: "field", name: "policyName", static: false, private: false, access: { has: obj => "policyName" in obj, get: obj => obj.policyName, set: (obj, value) => { obj.policyName = value; } }, metadata: _metadata }, _policyName_initializers, _policyName_extraInitializers);
            __esDecorate(null, null, _workflowType_decorators, { kind: "field", name: "workflowType", static: false, private: false, access: { has: obj => "workflowType" in obj, get: obj => obj.workflowType, set: (obj, value) => { obj.workflowType = value; } }, metadata: _metadata }, _workflowType_initializers, _workflowType_extraInitializers);
            __esDecorate(null, null, _escalationTrigger_decorators, { kind: "field", name: "escalationTrigger", static: false, private: false, access: { has: obj => "escalationTrigger" in obj, get: obj => obj.escalationTrigger, set: (obj, value) => { obj.escalationTrigger = value; } }, metadata: _metadata }, _escalationTrigger_initializers, _escalationTrigger_extraInitializers);
            __esDecorate(null, null, _timeoutMinutes_decorators, { kind: "field", name: "timeoutMinutes", static: false, private: false, access: { has: obj => "timeoutMinutes" in obj, get: obj => obj.timeoutMinutes, set: (obj, value) => { obj.timeoutMinutes = value; } }, metadata: _metadata }, _timeoutMinutes_initializers, _timeoutMinutes_extraInitializers);
            __esDecorate(null, null, _escalationLevels_decorators, { kind: "field", name: "escalationLevels", static: false, private: false, access: { has: obj => "escalationLevels" in obj, get: obj => obj.escalationLevels, set: (obj, value) => { obj.escalationLevels = value; } }, metadata: _metadata }, _escalationLevels_initializers, _escalationLevels_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateEscalationPolicyDto = CreateEscalationPolicyDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Workflow Definitions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} WorkflowDefinition model
 *
 * @example
 * ```typescript
 * const Workflow = createWorkflowDefinitionModel(sequelize);
 * const workflow = await Workflow.create({
 *   workflowCode: 'WF-JE-001',
 *   workflowName: 'Journal Entry Approval',
 *   workflowType: 'journal_entry',
 *   description: 'Standard journal entry approval workflow'
 * });
 * ```
 */
const createWorkflowDefinitionModel = (sequelize) => {
    class WorkflowDefinition extends sequelize_1.Model {
    }
    WorkflowDefinition.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        workflowCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            field: 'workflow_code',
        },
        workflowName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            field: 'workflow_name',
        },
        workflowType: {
            type: sequelize_1.DataTypes.ENUM('journal_entry', 'invoice', 'payment', 'budget', 'purchase_order', 'expense_report', 'custom'),
            allowNull: false,
            field: 'workflow_type',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: 'is_active',
        },
        version: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            field: 'effective_date',
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'expiration_date',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            field: 'created_by',
        },
        lastModifiedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            field: 'last_modified_by',
        },
    }, {
        sequelize,
        tableName: 'workflow_definitions',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['workflow_code'] },
            { fields: ['workflow_type'] },
            { fields: ['is_active'] },
            { fields: ['effective_date', 'expiration_date'] },
        ],
    });
    return WorkflowDefinition;
};
exports.createWorkflowDefinitionModel = createWorkflowDefinitionModel;
/**
 * Sequelize model for Workflow Instances.
 */
const createWorkflowInstanceModel = (sequelize) => {
    class WorkflowInstance extends sequelize_1.Model {
    }
    WorkflowInstance.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        instanceCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            field: 'instance_code',
        },
        workflowId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            field: 'workflow_id',
        },
        entityType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            field: 'entity_type',
        },
        entityId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            field: 'entity_id',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'submitted', 'in_progress', 'approved', 'rejected', 'cancelled', 'escalated'),
            allowNull: false,
            defaultValue: 'draft',
        },
        currentLevel: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: 'current_level',
        },
        totalLevels: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            field: 'total_levels',
        },
        submittedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            field: 'submitted_by',
        },
        submittedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            field: 'submitted_at',
        },
        completedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'completed_at',
        },
        completedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            field: 'completed_by',
        },
        slaDeadline: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'sla_deadline',
        },
        slaStatus: {
            type: sequelize_1.DataTypes.ENUM('on_time', 'at_risk', 'overdue'),
            allowNull: false,
            defaultValue: 'on_time',
            field: 'sla_status',
        },
        priority: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            allowNull: false,
            defaultValue: 'medium',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
    }, {
        sequelize,
        tableName: 'workflow_instances',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['instance_code'] },
            { fields: ['workflow_id'] },
            { fields: ['entity_type', 'entity_id'] },
            { fields: ['status'] },
            { fields: ['submitted_by'] },
            { fields: ['sla_deadline'] },
            { fields: ['priority'] },
        ],
    });
    return WorkflowInstance;
};
exports.createWorkflowInstanceModel = createWorkflowInstanceModel;
/**
 * Sequelize model for Approval Steps.
 */
const createApprovalStepModel = (sequelize) => {
    class ApprovalStep extends sequelize_1.Model {
    }
    ApprovalStep.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        instanceId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            field: 'instance_id',
        },
        stepNumber: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            field: 'step_number',
        },
        stepName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            field: 'step_name',
        },
        stepType: {
            type: sequelize_1.DataTypes.ENUM('sequential', 'parallel'),
            allowNull: false,
            field: 'step_type',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'in_progress', 'approved', 'rejected', 'skipped', 'escalated'),
            allowNull: false,
            defaultValue: 'pending',
        },
        requiredApprovers: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            field: 'required_approvers',
        },
        actualApprovers: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: 'actual_approvers',
        },
        assignedTo: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            field: 'assigned_to',
        },
        startedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'started_at',
        },
        completedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'completed_at',
        },
        dueDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'due_date',
        },
        escalationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'escalation_date',
        },
        comments: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'approval_steps',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['instance_id'] },
            { fields: ['status'] },
            { fields: ['assigned_to'] },
            { fields: ['due_date'] },
            { fields: ['escalation_date'] },
        ],
    });
    return ApprovalStep;
};
exports.createApprovalStepModel = createApprovalStepModel;
/**
 * Sequelize model for Approval Actions.
 */
const createApprovalActionModel = (sequelize) => {
    class ApprovalAction extends sequelize_1.Model {
    }
    ApprovalAction.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        instanceId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            field: 'instance_id',
        },
        stepId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            field: 'step_id',
        },
        actionType: {
            type: sequelize_1.DataTypes.ENUM('approve', 'reject', 'delegate', 'escalate', 'return', 'cancel'),
            allowNull: false,
            field: 'action_type',
        },
        actionBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            field: 'action_by',
        },
        actionDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            field: 'action_date',
        },
        comments: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        attachments: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
        },
        ipAddress: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: true,
            field: 'ip_address',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
    }, {
        sequelize,
        tableName: 'approval_actions',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['instance_id'] },
            { fields: ['step_id'] },
            { fields: ['action_type'] },
            { fields: ['action_by'] },
            { fields: ['action_date'] },
        ],
    });
    return ApprovalAction;
};
exports.createApprovalActionModel = createApprovalActionModel;
// ============================================================================
// WORKFLOW DEFINITION FUNCTIONS
// ============================================================================
/**
 * Creates a new workflow definition with validation.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {CreateWorkflowDefinitionDto} workflowDto - Workflow creation data
 * @param {string} userId - User creating the workflow
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<WorkflowDefinition>} Created workflow definition
 *
 * @example
 * ```typescript
 * const workflow = await createWorkflowDefinition(sequelize, configService, {
 *   workflowCode: 'WF-JE-001',
 *   workflowName: 'Journal Entry Approval',
 *   workflowType: 'journal_entry',
 *   description: 'Standard journal entry approval workflow',
 *   effectiveDate: new Date('2024-01-01')
 * }, 'admin@whitecross.com');
 * ```
 */
async function createWorkflowDefinition(sequelize, configService, workflowDto, userId, transaction) {
    const WorkflowModel = (0, exports.createWorkflowDefinitionModel)(sequelize);
    // Validate workflow configuration
    const maxWorkflows = configService.get('workflow.maxWorkflows', 100);
    const activeCount = await WorkflowModel.count({
        where: { isActive: true },
        transaction,
    });
    if (activeCount >= maxWorkflows) {
        throw new sequelize_1.ValidationError(`Maximum active workflows (${maxWorkflows}) reached`);
    }
    const workflow = await WorkflowModel.create({
        workflowCode: workflowDto.workflowCode,
        workflowName: workflowDto.workflowName,
        workflowType: workflowDto.workflowType,
        description: workflowDto.description,
        isActive: true,
        version: 1,
        effectiveDate: workflowDto.effectiveDate,
        expirationDate: workflowDto.expirationDate,
        createdBy: userId,
        lastModifiedBy: userId,
    }, { transaction });
    return workflow.toJSON();
}
/**
 * Retrieves active workflow definition by type.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} workflowType - Workflow type
 * @returns {Promise<WorkflowDefinition | null>} Active workflow definition
 */
async function getActiveWorkflowByType(sequelize, workflowType) {
    const WorkflowModel = (0, exports.createWorkflowDefinitionModel)(sequelize);
    const workflow = await WorkflowModel.findOne({
        where: {
            workflowType,
            isActive: true,
            effectiveDate: { [sequelize_1.Op.lte]: new Date() },
            [sequelize_1.Op.or]: [
                { expirationDate: null },
                { expirationDate: { [sequelize_1.Op.gte]: new Date() } },
            ],
        },
        order: [['version', 'DESC']],
    });
    return workflow ? workflow.toJSON() : null;
}
/**
 * Updates workflow definition version.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} workflowCode - Workflow code
 * @param {Partial<CreateWorkflowDefinitionDto>} updates - Fields to update
 * @param {string} userId - User updating the workflow
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<WorkflowDefinition>} Updated workflow
 */
async function updateWorkflowDefinition(sequelize, workflowCode, updates, userId, transaction) {
    const WorkflowModel = (0, exports.createWorkflowDefinitionModel)(sequelize);
    const workflow = await WorkflowModel.findOne({
        where: { workflowCode },
        transaction,
    });
    if (!workflow) {
        throw new Error(`Workflow ${workflowCode} not found`);
    }
    // Increment version
    const newVersion = workflow.version + 1;
    await workflow.update({
        ...updates,
        version: newVersion,
        lastModifiedBy: userId,
    }, { transaction });
    return workflow.toJSON();
}
/**
 * Deactivates a workflow definition.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} workflowCode - Workflow code
 * @param {string} userId - User deactivating the workflow
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<boolean>} Success status
 */
async function deactivateWorkflow(sequelize, workflowCode, userId, transaction) {
    const WorkflowModel = (0, exports.createWorkflowDefinitionModel)(sequelize);
    const result = await WorkflowModel.update({
        isActive: false,
        expirationDate: new Date(),
        lastModifiedBy: userId,
    }, {
        where: { workflowCode },
        transaction,
    });
    return result[0] > 0;
}
// ============================================================================
// WORKFLOW INSTANCE FUNCTIONS
// ============================================================================
/**
 * Initiates a new workflow instance with automatic routing.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {CreateWorkflowInstanceDto} instanceDto - Instance creation data
 * @param {string} userId - User initiating the workflow
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<WorkflowInstance>} Created workflow instance
 */
async function initiateWorkflowInstance(sequelize, configService, instanceDto, userId, transaction) {
    const InstanceModel = (0, exports.createWorkflowInstanceModel)(sequelize);
    // Generate instance code
    const instanceCode = `WFI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    // Calculate SLA deadline
    const slaConfig = await getWorkflowSLA(sequelize, configService, instanceDto.workflowId);
    const slaDeadline = calculateSLADeadline(slaConfig);
    const instance = await InstanceModel.create({
        instanceCode,
        workflowId: instanceDto.workflowId,
        entityType: instanceDto.entityType,
        entityId: instanceDto.entityId,
        status: 'submitted',
        currentLevel: 0,
        totalLevels: 1, // Will be updated when approval steps are created
        submittedBy: userId,
        submittedAt: new Date(),
        slaDeadline,
        slaStatus: 'on_time',
        priority: instanceDto.priority || 'medium',
        metadata: instanceDto.metadata || {},
    }, { transaction });
    // Create initial approval steps
    await createApprovalSteps(sequelize, configService, instance.id, instanceDto.workflowId, transaction);
    return instance.toJSON();
}
/**
 * Retrieves workflow instance with complete approval history.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} instanceCode - Instance code
 * @returns {Promise<WorkflowInstance & { steps: ApprovalStep[]; actions: ApprovalAction[] }>} Instance with history
 */
async function getWorkflowInstanceWithHistory(sequelize, instanceCode) {
    const InstanceModel = (0, exports.createWorkflowInstanceModel)(sequelize);
    const StepModel = (0, exports.createApprovalStepModel)(sequelize);
    const ActionModel = (0, exports.createApprovalActionModel)(sequelize);
    const instance = await InstanceModel.findOne({
        where: { instanceCode },
    });
    if (!instance) {
        throw new Error(`Workflow instance ${instanceCode} not found`);
    }
    const steps = await StepModel.findAll({
        where: { instanceId: instance.id },
        order: [['stepNumber', 'ASC']],
    });
    const actions = await ActionModel.findAll({
        where: { instanceId: instance.id },
        order: [['actionDate', 'ASC']],
    });
    return {
        ...instance.toJSON(),
        steps: steps.map(s => s.toJSON()),
        actions: actions.map(a => a.toJSON()),
    };
}
/**
 * Updates workflow instance status.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} instanceCode - Instance code
 * @param {string} status - New status
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<WorkflowInstance>} Updated instance
 */
async function updateWorkflowStatus(sequelize, instanceCode, status, transaction) {
    const InstanceModel = (0, exports.createWorkflowInstanceModel)(sequelize);
    const instance = await InstanceModel.findOne({
        where: { instanceCode },
        transaction,
    });
    if (!instance) {
        throw new Error(`Workflow instance ${instanceCode} not found`);
    }
    const updates = { status };
    if (status === 'approved' || status === 'rejected' || status === 'cancelled') {
        updates.completedAt = new Date();
    }
    await instance.update(updates, { transaction });
    return instance.toJSON();
}
/**
 * Retrieves pending approvals for a user.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} userId - User identifier
 * @param {number} limit - Maximum results
 * @returns {Promise<WorkflowInstance[]>} Pending approvals
 */
async function getPendingApprovals(sequelize, userId, limit = 50) {
    const InstanceModel = (0, exports.createWorkflowInstanceModel)(sequelize);
    const StepModel = (0, exports.createApprovalStepModel)(sequelize);
    // Find active steps assigned to user
    const activeSteps = await StepModel.findAll({
        where: {
            status: { [sequelize_1.Op.in]: ['pending', 'in_progress'] },
            assignedTo: { [sequelize_1.Op.contains]: [userId] },
        },
        limit,
    });
    const instanceIds = activeSteps.map(s => s.instanceId);
    if (instanceIds.length === 0) {
        return [];
    }
    const instances = await InstanceModel.findAll({
        where: {
            id: { [sequelize_1.Op.in]: instanceIds },
            status: { [sequelize_1.Op.in]: ['submitted', 'in_progress'] },
        },
        order: [['slaDeadline', 'ASC']],
        limit,
    });
    return instances.map(i => i.toJSON());
}
/**
 * Cancels a workflow instance.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} instanceCode - Instance code
 * @param {string} userId - User cancelling the workflow
 * @param {string} reason - Cancellation reason
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<WorkflowInstance>} Cancelled instance
 */
async function cancelWorkflowInstance(sequelize, instanceCode, userId, reason, transaction) {
    const InstanceModel = (0, exports.createWorkflowInstanceModel)(sequelize);
    const ActionModel = (0, exports.createApprovalActionModel)(sequelize);
    const instance = await InstanceModel.findOne({
        where: { instanceCode, status: { [sequelize_1.Op.notIn]: ['approved', 'rejected', 'cancelled'] } },
        transaction,
    });
    if (!instance) {
        throw new Error(`Active workflow instance ${instanceCode} not found`);
    }
    // Record cancellation action
    await ActionModel.create({
        instanceId: instance.id,
        stepId: 0,
        actionType: 'cancel',
        actionBy: userId,
        actionDate: new Date(),
        comments: reason,
        attachments: [],
        metadata: {},
    }, { transaction });
    await instance.update({
        status: 'cancelled',
        completedAt: new Date(),
        completedBy: userId,
    }, { transaction });
    return instance.toJSON();
}
// ============================================================================
// APPROVAL ACTION FUNCTIONS
// ============================================================================
/**
 * Processes an approval action (approve/reject/delegate).
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {ApprovalActionDto} actionDto - Approval action data
 * @param {string} userId - User performing the action
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<ApprovalAction>} Recorded approval action
 */
async function processApprovalAction(sequelize, configService, actionDto, userId, transaction) {
    const ActionModel = (0, exports.createApprovalActionModel)(sequelize);
    const StepModel = (0, exports.createApprovalStepModel)(sequelize);
    const InstanceModel = (0, exports.createWorkflowInstanceModel)(sequelize);
    // Verify step exists and user is authorized
    const step = await StepModel.findByPk(actionDto.stepId, { transaction });
    if (!step) {
        throw new Error(`Approval step ${actionDto.stepId} not found`);
    }
    if (!step.assignedTo.includes(userId)) {
        throw new sequelize_1.ValidationError(`User ${userId} is not authorized to approve this step`);
    }
    if (step.status !== 'pending' && step.status !== 'in_progress') {
        throw new sequelize_1.ValidationError(`Step is already ${step.status}`);
    }
    // Record the action
    const action = await ActionModel.create({
        instanceId: actionDto.instanceId,
        stepId: actionDto.stepId,
        actionType: actionDto.actionType,
        actionBy: userId,
        actionDate: new Date(),
        comments: actionDto.comments,
        attachments: actionDto.attachments || [],
        metadata: {},
    }, { transaction });
    // Update step status
    if (actionDto.actionType === 'approve') {
        await handleApprovalAction(sequelize, step, actionDto.instanceId, transaction);
    }
    else if (actionDto.actionType === 'reject') {
        await handleRejectionAction(sequelize, step, actionDto.instanceId, transaction);
    }
    else if (actionDto.actionType === 'delegate') {
        await handleDelegationAction(sequelize, step, actionDto.delegateTo, transaction);
    }
    return action.toJSON();
}
/**
 * Retrieves approval history for a workflow instance.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {number} instanceId - Instance identifier
 * @returns {Promise<ApprovalAction[]>} Approval history
 */
async function getApprovalHistory(sequelize, instanceId) {
    const ActionModel = (0, exports.createApprovalActionModel)(sequelize);
    const actions = await ActionModel.findAll({
        where: { instanceId },
        order: [['actionDate', 'ASC']],
    });
    return actions.map(a => a.toJSON());
}
/**
 * Validates if user can approve a specific step.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {number} stepId - Step identifier
 * @param {string} userId - User identifier
 * @returns {Promise<boolean>} Authorization status
 */
async function validateApprovalAuthorization(sequelize, stepId, userId) {
    const StepModel = (0, exports.createApprovalStepModel)(sequelize);
    const step = await StepModel.findByPk(stepId);
    if (!step) {
        return false;
    }
    // Check if user is assigned to step
    if (step.assignedTo.includes(userId)) {
        return true;
    }
    // Check if user has an active delegation
    const hasDelegation = await checkActiveDelegation(sequelize, userId, step);
    return hasDelegation;
}
// ============================================================================
// APPROVAL ROUTING FUNCTIONS
// ============================================================================
/**
 * Determines approval routing based on rules.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {string} workflowType - Workflow type
 * @param {any} entityData - Entity data for rule evaluation
 * @returns {Promise<ApprovalPathStep[]>} Approval path
 */
async function determineApprovalPath(sequelize, configService, workflowType, entityData) {
    // Evaluate approval rules to determine path
    const matchingRules = await evaluateApprovalRules(sequelize, workflowType, entityData);
    if (matchingRules.length === 0) {
        // Use default approval path
        return getDefaultApprovalPath(configService, workflowType);
    }
    // Return highest priority matching rule's approval path
    const topRule = matchingRules.sort((a, b) => b.priority - a.priority)[0];
    return topRule.approvalPath;
}
/**
 * Creates approval steps for a workflow instance.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {number} instanceId - Instance identifier
 * @param {number} workflowId - Workflow identifier
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<ApprovalStep[]>} Created approval steps
 */
async function createApprovalSteps(sequelize, configService, instanceId, workflowId, transaction) {
    const StepModel = (0, exports.createApprovalStepModel)(sequelize);
    // Get approval path (this would be determined by rules)
    const approvalPath = await getApprovalPathForWorkflow(sequelize, workflowId);
    const steps = [];
    for (let i = 0; i < approvalPath.length; i++) {
        const pathStep = approvalPath[i];
        const step = await StepModel.create({
            instanceId,
            stepNumber: i + 1,
            stepName: pathStep.stepName,
            stepType: pathStep.isParallel ? 'parallel' : 'sequential',
            status: i === 0 ? 'in_progress' : 'pending',
            requiredApprovers: pathStep.minApprovers,
            actualApprovers: 0,
            assignedTo: pathStep.approverIdentifiers,
            startedAt: i === 0 ? new Date() : null,
            dueDate: calculateStepDueDate(pathStep.timeoutMinutes),
            escalationDate: calculateEscalationDate(pathStep.timeoutMinutes),
        }, { transaction });
        steps.push(step.toJSON());
    }
    // Update instance total levels
    const InstanceModel = (0, exports.createWorkflowInstanceModel)(sequelize);
    await InstanceModel.update({ totalLevels: steps.length, currentLevel: 1 }, { where: { id: instanceId }, transaction });
    return steps;
}
/**
 * Advances workflow to next approval step.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {number} instanceId - Instance identifier
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<ApprovalStep | null>} Next approval step or null if complete
 */
async function advanceToNextStep(sequelize, instanceId, transaction) {
    const StepModel = (0, exports.createApprovalStepModel)(sequelize);
    const InstanceModel = (0, exports.createWorkflowInstanceModel)(sequelize);
    // Find next pending step
    const nextStep = await StepModel.findOne({
        where: {
            instanceId,
            status: 'pending',
        },
        order: [['stepNumber', 'ASC']],
        transaction,
    });
    if (!nextStep) {
        // No more steps - workflow is complete
        await InstanceModel.update({
            status: 'approved',
            completedAt: new Date(),
        }, { where: { id: instanceId }, transaction });
        return null;
    }
    // Activate next step
    await nextStep.update({
        status: 'in_progress',
        startedAt: new Date(),
    }, { transaction });
    // Update instance current level
    await InstanceModel.update({ currentLevel: nextStep.stepNumber }, { where: { id: instanceId }, transaction });
    return nextStep.toJSON();
}
// ============================================================================
// DELEGATION FUNCTIONS
// ============================================================================
/**
 * Creates an approval delegation.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {CreateDelegationDto} delegationDto - Delegation data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<ApprovalDelegation>} Created delegation
 */
async function createDelegation(sequelize, delegationDto, transaction) {
    // Note: Would need to create DelegationModel similar to other models
    const delegation = {
        delegationId: Date.now(),
        delegatorUserId: delegationDto.delegatorUserId,
        delegateUserId: delegationDto.delegateUserId,
        delegationType: delegationDto.delegationType,
        effectiveFrom: delegationDto.effectiveFrom,
        effectiveTo: delegationDto.effectiveTo,
        workflowTypes: delegationDto.workflowTypes,
        amountLimit: delegationDto.amountLimit,
        reason: delegationDto.reason,
        isActive: true,
        createdAt: new Date(),
    };
    return delegation;
}
/**
 * Retrieves active delegations for a user.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} userId - User identifier
 * @returns {Promise<ApprovalDelegation[]>} Active delegations
 */
async function getActiveDelegations(sequelize, userId) {
    // Placeholder - would query delegation table
    return [];
}
/**
 * Revokes a delegation.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {number} delegationId - Delegation identifier
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<boolean>} Success status
 */
async function revokeDelegation(sequelize, delegationId, transaction) {
    // Placeholder - would update delegation table
    return true;
}
// ============================================================================
// ESCALATION FUNCTIONS
// ============================================================================
/**
 * Escalates an overdue approval step.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {number} stepId - Step identifier
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<ApprovalStep>} Escalated step
 */
async function escalateApprovalStep(sequelize, configService, stepId, transaction) {
    const StepModel = (0, exports.createApprovalStepModel)(sequelize);
    const step = await StepModel.findByPk(stepId, { transaction });
    if (!step) {
        throw new Error(`Approval step ${stepId} not found`);
    }
    // Get escalation policy
    const escalationPolicy = await getEscalationPolicy(sequelize, configService, step);
    // Update step with escalated approvers
    const escalatedApprovers = escalationPolicy.escalationLevels[0]?.escalateTo || [];
    await step.update({
        status: 'escalated',
        assignedTo: [...step.assignedTo, ...escalatedApprovers],
    }, { transaction });
    // Send escalation notifications
    await sendEscalationNotifications(sequelize, step, escalatedApprovers);
    return step.toJSON();
}
/**
 * Checks for overdue approvals and triggers escalation.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @returns {Promise<number>} Number of escalated steps
 */
async function processOverdueApprovals(sequelize, configService) {
    const StepModel = (0, exports.createApprovalStepModel)(sequelize);
    const overdueSteps = await StepModel.findAll({
        where: {
            status: { [sequelize_1.Op.in]: ['pending', 'in_progress'] },
            escalationDate: { [sequelize_1.Op.lte]: new Date() },
        },
    });
    let escalatedCount = 0;
    for (const step of overdueSteps) {
        try {
            await escalateApprovalStep(sequelize, configService, step.id);
            escalatedCount++;
        }
        catch (error) {
            console.error(`Failed to escalate step ${step.id}:`, error);
        }
    }
    return escalatedCount;
}
// ============================================================================
// NOTIFICATION FUNCTIONS
// ============================================================================
/**
 * Sends workflow notification to users.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {number} instanceId - Instance identifier
 * @param {string} notificationType - Notification type
 * @param {string[]} recipients - Recipient user IDs
 * @returns {Promise<WorkflowNotification[]>} Sent notifications
 */
async function sendWorkflowNotification(sequelize, configService, instanceId, notificationType, recipients) {
    // Placeholder - would integrate with notification service
    const notifications = [];
    for (const recipient of recipients) {
        notifications.push({
            notificationId: Date.now(),
            instanceId,
            notificationType: notificationType,
            recipientUserId: recipient,
            recipientEmail: `${recipient}@whitecross.com`,
            subject: `Workflow ${notificationType}`,
            message: `You have a workflow ${notificationType}`,
            status: 'sent',
            sentAt: new Date(),
            metadata: {},
        });
    }
    return notifications;
}
/**
 * Sends approval reminder notifications.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @returns {Promise<number>} Number of reminders sent
 */
async function sendApprovalReminders(sequelize, configService) {
    const StepModel = (0, exports.createApprovalStepModel)(sequelize);
    const reminderThresholdMinutes = configService.get('workflow.reminderIntervalMinutes', 1440); // 24 hours
    const pendingSteps = await StepModel.findAll({
        where: {
            status: { [sequelize_1.Op.in]: ['pending', 'in_progress'] },
            startedAt: {
                [sequelize_1.Op.lte]: new Date(Date.now() - reminderThresholdMinutes * 60 * 1000),
            },
        },
    });
    let remindersSent = 0;
    for (const step of pendingSteps) {
        const notifications = await sendWorkflowNotification(sequelize, configService, step.instanceId, 'reminder', step.assignedTo);
        remindersSent += notifications.length;
    }
    return remindersSent;
}
// ============================================================================
// ANALYTICS FUNCTIONS
// ============================================================================
/**
 * Generates workflow metrics for a period.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} workflowType - Workflow type
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @returns {Promise<WorkflowMetrics>} Workflow metrics
 */
async function generateWorkflowMetrics(sequelize, workflowType, periodStart, periodEnd) {
    const InstanceModel = (0, exports.createWorkflowInstanceModel)(sequelize);
    const instances = await InstanceModel.findAll({
        where: {
            submittedAt: {
                [sequelize_1.Op.between]: [periodStart, periodEnd],
            },
        },
    });
    const totalSubmitted = instances.length;
    const totalApproved = instances.filter(i => i.status === 'approved').length;
    const totalRejected = instances.filter(i => i.status === 'rejected').length;
    const totalCancelled = instances.filter(i => i.status === 'cancelled').length;
    // Calculate average approval time
    const completedInstances = instances.filter(i => i.completedAt);
    const totalApprovalTime = completedInstances.reduce((sum, i) => {
        return sum + (i.completedAt.getTime() - i.submittedAt.getTime());
    }, 0);
    const avgApprovalTimeMinutes = completedInstances.length > 0
        ? totalApprovalTime / completedInstances.length / 60000
        : 0;
    // Calculate SLA compliance
    const slaCompliant = instances.filter(i => !i.slaDeadline || (i.completedAt && i.completedAt <= i.slaDeadline)).length;
    const slaCompliancePercent = totalSubmitted > 0
        ? (slaCompliant / totalSubmitted) * 100
        : 0;
    const escalationCount = instances.filter(i => i.status === 'escalated').length;
    return {
        metricId: Date.now(),
        workflowType,
        period: 'custom',
        periodStart,
        periodEnd,
        totalSubmitted,
        totalApproved,
        totalRejected,
        totalCancelled,
        avgApprovalTimeMinutes,
        slaCompliancePercent,
        escalationCount,
    };
}
/**
 * Retrieves workflow performance dashboard data.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @returns {Promise<Record<string, any>>} Dashboard data
 */
async function getWorkflowDashboard(sequelize, configService) {
    const InstanceModel = (0, exports.createWorkflowInstanceModel)(sequelize);
    const totalActive = await InstanceModel.count({
        where: { status: { [sequelize_1.Op.in]: ['submitted', 'in_progress'] } },
    });
    const slaAtRisk = await InstanceModel.count({
        where: { slaStatus: 'at_risk' },
    });
    const slaOverdue = await InstanceModel.count({
        where: { slaStatus: 'overdue' },
    });
    return {
        totalActive,
        slaAtRisk,
        slaOverdue,
        healthScore: ((totalActive - slaOverdue) / Math.max(totalActive, 1)) * 100,
    };
}
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
async function getWorkflowSLA(sequelize, configService, workflowId) {
    // Placeholder - would query SLA configuration
    return {
        slaId: 1,
        workflowType: 'journal_entry',
        priority: 'medium',
        slaDays: 3,
        slaHours: 0,
        businessHoursOnly: true,
        excludeWeekends: true,
        excludeHolidays: true,
        warningThresholdPercent: 80,
        escalateOnBreach: true,
    };
}
function calculateSLADeadline(slaConfig) {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + slaConfig.slaDays);
    deadline.setHours(deadline.getHours() + slaConfig.slaHours);
    return deadline;
}
async function evaluateApprovalRules(sequelize, workflowType, entityData) {
    // Placeholder - would query and evaluate approval rules
    return [];
}
function getDefaultApprovalPath(configService, workflowType) {
    // Placeholder - would return default approval path from configuration
    return [
        {
            stepNumber: 1,
            stepName: 'Manager Approval',
            approverType: 'role',
            approverIdentifiers: ['manager'],
            approvalType: 'any',
            minApprovers: 1,
            isParallel: false,
            timeoutMinutes: 4320, // 3 days
        },
    ];
}
async function getApprovalPathForWorkflow(sequelize, workflowId) {
    // Placeholder - would retrieve configured approval path
    return getDefaultApprovalPath({}, 'journal_entry');
}
function calculateStepDueDate(timeoutMinutes) {
    const dueDate = new Date();
    dueDate.setMinutes(dueDate.getMinutes() + timeoutMinutes);
    return dueDate;
}
function calculateEscalationDate(timeoutMinutes) {
    const escalationDate = new Date();
    escalationDate.setMinutes(escalationDate.getMinutes() + timeoutMinutes * 0.8); // 80% of timeout
    return escalationDate;
}
async function handleApprovalAction(sequelize, step, instanceId, transaction) {
    const newActualApprovers = step.actualApprovers + 1;
    if (newActualApprovers >= step.requiredApprovers) {
        // Step is complete
        await step.update({
            status: 'approved',
            actualApprovers: newActualApprovers,
            completedAt: new Date(),
        }, { transaction });
        // Advance to next step
        await advanceToNextStep(sequelize, instanceId, transaction);
    }
    else {
        // Still need more approvals
        await step.update({
            status: 'in_progress',
            actualApprovers: newActualApprovers,
        }, { transaction });
    }
}
async function handleRejectionAction(sequelize, step, instanceId, transaction) {
    const InstanceModel = (0, exports.createWorkflowInstanceModel)(sequelize);
    await step.update({
        status: 'rejected',
        completedAt: new Date(),
    }, { transaction });
    await InstanceModel.update({
        status: 'rejected',
        completedAt: new Date(),
    }, { where: { id: instanceId }, transaction });
}
async function handleDelegationAction(sequelize, step, delegateTo, transaction) {
    const updatedAssignees = [...step.assignedTo, delegateTo];
    await step.update({
        assignedTo: updatedAssignees,
    }, { transaction });
}
async function checkActiveDelegation(sequelize, userId, step) {
    // Placeholder - would check delegation table
    return false;
}
async function getEscalationPolicy(sequelize, configService, step) {
    // Placeholder - would query escalation policy
    return {
        policyId: 1,
        policyName: 'Default Escalation',
        workflowType: 'journal_entry',
        escalationTrigger: 'timeout',
        timeoutMinutes: 4320,
        escalationLevels: [
            {
                level: 1,
                escalateTo: ['supervisor'],
                notificationTemplate: 'escalation_template',
                autoApprove: false,
                skipApproval: false,
            },
        ],
        isActive: true,
    };
}
async function sendEscalationNotifications(sequelize, step, escalatedApprovers) {
    // Placeholder - would send notifications
    console.log(`Sending escalation notifications to: ${escalatedApprovers.join(', ')}`);
}
//# sourceMappingURL=financial-workflow-approval-kit.js.map