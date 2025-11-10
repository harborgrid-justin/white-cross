"use strict";
/**
 * LOC: WC-ORD-ORCHWF-001
 * File: /reuse/order/order-orchestration-workflow-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Order controllers
 *   - Order workflow services
 *   - Order orchestration engines
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
exports.WorkflowApprovalRequest = exports.WorkflowEventLog = exports.WorkflowStepExecution = exports.WorkflowInstance = exports.CompensationStrategy = exports.RoutingStrategy = exports.ApprovalDecision = exports.ExecutionMode = exports.StepType = exports.WorkflowEvent = exports.StepStatus = exports.WorkflowStatus = void 0;
exports.initializeWorkflow = initializeWorkflow;
exports.startWorkflowExecution = startWorkflowExecution;
exports.transitionWorkflowState = transitionWorkflowState;
exports.pauseWorkflow = pauseWorkflow;
exports.resumeWorkflow = resumeWorkflow;
exports.cancelWorkflow = cancelWorkflow;
exports.executeWorkflowStep = executeWorkflowStep;
exports.retryFailedStep = retryFailedStep;
exports.skipWorkflowStep = skipWorkflowStep;
exports.executeStepsInParallel = executeStepsInParallel;
exports.executeStepsSequentially = executeStepsSequentially;
exports.waitForParallelSteps = waitForParallelSteps;
exports.evaluateCondition = evaluateCondition;
exports.determineNextSteps = determineNextSteps;
exports.executeConditionalBranch = executeConditionalBranch;
exports.handleStepError = handleStepError;
exports.triggerCompensation = triggerCompensation;
exports.executeCompensationSteps = executeCompensationSteps;
exports.rollbackWorkflow = rollbackWorkflow;
exports.routeOrderToFulfillment = routeOrderToFulfillment;
exports.createApprovalRequest = createApprovalRequest;
exports.processApprovalDecision = processApprovalDecision;
exports.escalateApproval = escalateApproval;
exports.callExternalIntegration = callExternalIntegration;
exports.orchestrateIntegrations = orchestrateIntegrations;
exports.emitWorkflowEvent = emitWorkflowEvent;
exports.subscribeToWorkflowEvents = subscribeToWorkflowEvents;
exports.triggerWorkflowFromEvent = triggerWorkflowFromEvent;
exports.getWorkflowMetrics = getWorkflowMetrics;
exports.monitorWorkflowExecution = monitorWorkflowExecution;
exports.getWorkflowExecutionHistory = getWorkflowExecutionHistory;
exports.detectWorkflowTimeout = detectWorkflowTimeout;
/**
 * File: /reuse/order/order-orchestration-workflow-kit.ts
 * Locator: WC-ORD-ORCHWF-001
 * Purpose: Order Orchestration & Workflow - Complete order workflow engine
 *
 * Upstream: Independent utility module for order workflow orchestration
 * Downstream: ../backend/order/*, Order workflow modules, Integration services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 38 utility functions for workflow orchestration, state machine, event-driven execution
 *
 * LLM Context: Enterprise-grade order workflow orchestration to compete with Oracle OMS.
 * Provides comprehensive workflow state machine, step execution, parallel workflows, branching logic,
 * error handling, rollback mechanisms, order routing, multi-step approvals, integration orchestration,
 * event-driven triggers, workflow monitoring, saga patterns, compensation transactions, workflow versioning,
 * dynamic workflow composition, and workflow analytics.
 */
const common_1 = require("@nestjs/common");
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================
/**
 * Workflow execution status
 */
var WorkflowStatus;
(function (WorkflowStatus) {
    WorkflowStatus["PENDING"] = "PENDING";
    WorkflowStatus["RUNNING"] = "RUNNING";
    WorkflowStatus["PAUSED"] = "PAUSED";
    WorkflowStatus["WAITING"] = "WAITING";
    WorkflowStatus["COMPLETED"] = "COMPLETED";
    WorkflowStatus["FAILED"] = "FAILED";
    WorkflowStatus["CANCELLED"] = "CANCELLED";
    WorkflowStatus["COMPENSATING"] = "COMPENSATING";
    WorkflowStatus["COMPENSATED"] = "COMPENSATED";
    WorkflowStatus["TIMEOUT"] = "TIMEOUT";
})(WorkflowStatus || (exports.WorkflowStatus = WorkflowStatus = {}));
/**
 * Workflow step status
 */
var StepStatus;
(function (StepStatus) {
    StepStatus["PENDING"] = "PENDING";
    StepStatus["RUNNING"] = "RUNNING";
    StepStatus["COMPLETED"] = "COMPLETED";
    StepStatus["FAILED"] = "FAILED";
    StepStatus["SKIPPED"] = "SKIPPED";
    StepStatus["RETRYING"] = "RETRYING";
    StepStatus["COMPENSATING"] = "COMPENSATING";
    StepStatus["COMPENSATED"] = "COMPENSATED";
})(StepStatus || (exports.StepStatus = StepStatus = {}));
/**
 * Workflow event types
 */
var WorkflowEvent;
(function (WorkflowEvent) {
    WorkflowEvent["WORKFLOW_STARTED"] = "WORKFLOW_STARTED";
    WorkflowEvent["WORKFLOW_COMPLETED"] = "WORKFLOW_COMPLETED";
    WorkflowEvent["WORKFLOW_FAILED"] = "WORKFLOW_FAILED";
    WorkflowEvent["WORKFLOW_CANCELLED"] = "WORKFLOW_CANCELLED";
    WorkflowEvent["STEP_STARTED"] = "STEP_STARTED";
    WorkflowEvent["STEP_COMPLETED"] = "STEP_COMPLETED";
    WorkflowEvent["STEP_FAILED"] = "STEP_FAILED";
    WorkflowEvent["APPROVAL_REQUESTED"] = "APPROVAL_REQUESTED";
    WorkflowEvent["APPROVAL_GRANTED"] = "APPROVAL_GRANTED";
    WorkflowEvent["APPROVAL_REJECTED"] = "APPROVAL_REJECTED";
    WorkflowEvent["INTEGRATION_CALLED"] = "INTEGRATION_CALLED";
    WorkflowEvent["INTEGRATION_RESPONSE"] = "INTEGRATION_RESPONSE";
    WorkflowEvent["COMPENSATION_TRIGGERED"] = "COMPENSATION_TRIGGERED";
    WorkflowEvent["TIMEOUT_TRIGGERED"] = "TIMEOUT_TRIGGERED";
})(WorkflowEvent || (exports.WorkflowEvent = WorkflowEvent = {}));
/**
 * Workflow step types
 */
var StepType;
(function (StepType) {
    StepType["TASK"] = "TASK";
    StepType["APPROVAL"] = "APPROVAL";
    StepType["INTEGRATION"] = "INTEGRATION";
    StepType["DECISION"] = "DECISION";
    StepType["PARALLEL"] = "PARALLEL";
    StepType["WAIT"] = "WAIT";
    StepType["COMPENSATION"] = "COMPENSATION";
    StepType["NOTIFICATION"] = "NOTIFICATION";
})(StepType || (exports.StepType = StepType = {}));
/**
 * Execution mode for parallel workflows
 */
var ExecutionMode;
(function (ExecutionMode) {
    ExecutionMode["SEQUENTIAL"] = "SEQUENTIAL";
    ExecutionMode["PARALLEL"] = "PARALLEL";
    ExecutionMode["CONDITIONAL"] = "CONDITIONAL";
})(ExecutionMode || (exports.ExecutionMode = ExecutionMode = {}));
/**
 * Approval decision
 */
var ApprovalDecision;
(function (ApprovalDecision) {
    ApprovalDecision["PENDING"] = "PENDING";
    ApprovalDecision["APPROVED"] = "APPROVED";
    ApprovalDecision["REJECTED"] = "REJECTED";
    ApprovalDecision["ESCALATED"] = "ESCALATED";
    ApprovalDecision["DELEGATED"] = "DELEGATED";
})(ApprovalDecision || (exports.ApprovalDecision = ApprovalDecision = {}));
/**
 * Routing strategy
 */
var RoutingStrategy;
(function (RoutingStrategy) {
    RoutingStrategy["ROUND_ROBIN"] = "ROUND_ROBIN";
    RoutingStrategy["LOAD_BASED"] = "LOAD_BASED";
    RoutingStrategy["PRIORITY_BASED"] = "PRIORITY_BASED";
    RoutingStrategy["RULE_BASED"] = "RULE_BASED";
    RoutingStrategy["GEOGRAPHY_BASED"] = "GEOGRAPHY_BASED";
})(RoutingStrategy || (exports.RoutingStrategy = RoutingStrategy = {}));
/**
 * Compensation strategy
 */
var CompensationStrategy;
(function (CompensationStrategy) {
    CompensationStrategy["AUTOMATIC"] = "AUTOMATIC";
    CompensationStrategy["MANUAL"] = "MANUAL";
    CompensationStrategy["PARTIAL"] = "PARTIAL";
    CompensationStrategy["SKIP"] = "SKIP";
})(CompensationStrategy || (exports.CompensationStrategy = CompensationStrategy = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Workflow instance model
 */
let WorkflowInstance = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'workflow_instances',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['workflowInstanceId'], unique: true },
                { fields: ['workflowId'] },
                { fields: ['orderId'] },
                { fields: ['status'] },
                { fields: ['startedAt'] },
                { fields: ['createdAt'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _workflowInstanceId_decorators;
    let _workflowInstanceId_initializers = [];
    let _workflowInstanceId_extraInitializers = [];
    let _workflowId_decorators;
    let _workflowId_initializers = [];
    let _workflowId_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _currentStep_decorators;
    let _currentStep_initializers = [];
    let _currentStep_extraInitializers = [];
    let _variables_decorators;
    let _variables_initializers = [];
    let _variables_extraInitializers = [];
    let _executionPath_decorators;
    let _executionPath_initializers = [];
    let _executionPath_extraInitializers = [];
    let _errorHistory_decorators;
    let _errorHistory_initializers = [];
    let _errorHistory_extraInitializers = [];
    let _startedAt_decorators;
    let _startedAt_initializers = [];
    let _startedAt_extraInitializers = [];
    let _completedAt_decorators;
    let _completedAt_initializers = [];
    let _completedAt_extraInitializers = [];
    let _duration_decorators;
    let _duration_initializers = [];
    let _duration_extraInitializers = [];
    let _retryCount_decorators;
    let _retryCount_initializers = [];
    let _retryCount_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _stepExecutions_decorators;
    let _stepExecutions_initializers = [];
    let _stepExecutions_extraInitializers = [];
    let _events_decorators;
    let _events_initializers = [];
    let _events_extraInitializers = [];
    var WorkflowInstance = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.workflowInstanceId = __runInitializers(this, _workflowInstanceId_initializers, void 0);
            this.workflowId = (__runInitializers(this, _workflowInstanceId_extraInitializers), __runInitializers(this, _workflowId_initializers, void 0));
            this.version = (__runInitializers(this, _workflowId_extraInitializers), __runInitializers(this, _version_initializers, void 0));
            this.orderId = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _orderId_initializers, void 0));
            this.status = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.currentStep = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _currentStep_initializers, void 0));
            this.variables = (__runInitializers(this, _currentStep_extraInitializers), __runInitializers(this, _variables_initializers, void 0));
            this.executionPath = (__runInitializers(this, _variables_extraInitializers), __runInitializers(this, _executionPath_initializers, void 0));
            this.errorHistory = (__runInitializers(this, _executionPath_extraInitializers), __runInitializers(this, _errorHistory_initializers, void 0));
            this.startedAt = (__runInitializers(this, _errorHistory_extraInitializers), __runInitializers(this, _startedAt_initializers, void 0));
            this.completedAt = (__runInitializers(this, _startedAt_extraInitializers), __runInitializers(this, _completedAt_initializers, void 0));
            this.duration = (__runInitializers(this, _completedAt_extraInitializers), __runInitializers(this, _duration_initializers, void 0));
            this.retryCount = (__runInitializers(this, _duration_extraInitializers), __runInitializers(this, _retryCount_initializers, void 0));
            this.metadata = (__runInitializers(this, _retryCount_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdBy = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.stepExecutions = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _stepExecutions_initializers, void 0));
            this.events = (__runInitializers(this, _stepExecutions_extraInitializers), __runInitializers(this, _events_initializers, void 0));
            __runInitializers(this, _events_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "WorkflowInstance");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _workflowInstanceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Workflow instance ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _workflowId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Workflow definition ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _version_decorators = [(0, swagger_1.ApiProperty)({ description: 'Workflow version' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(20),
                allowNull: false,
            })];
        _orderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Workflow status', enum: WorkflowStatus }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(WorkflowStatus)),
                allowNull: false,
                defaultValue: WorkflowStatus.PENDING,
            }), sequelize_typescript_1.Index];
        _currentStep_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current step ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
            })];
        _variables_decorators = [(0, swagger_1.ApiProperty)({ description: 'Workflow variables (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                defaultValue: {},
            })];
        _executionPath_decorators = [(0, swagger_1.ApiProperty)({ description: 'Execution path' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
                defaultValue: [],
            })];
        _errorHistory_decorators = [(0, swagger_1.ApiProperty)({ description: 'Error history (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                defaultValue: [],
            })];
        _startedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Started at timestamp' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            }), sequelize_typescript_1.Index];
        _completedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Completed at timestamp' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _duration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Duration in milliseconds' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
            })];
        _retryCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Retry count' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metadata (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _createdBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Created by user ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column];
        _stepExecutions_decorators = [(0, sequelize_typescript_1.HasMany)(() => WorkflowStepExecution)];
        _events_decorators = [(0, sequelize_typescript_1.HasMany)(() => WorkflowEventLog)];
        __esDecorate(null, null, _workflowInstanceId_decorators, { kind: "field", name: "workflowInstanceId", static: false, private: false, access: { has: obj => "workflowInstanceId" in obj, get: obj => obj.workflowInstanceId, set: (obj, value) => { obj.workflowInstanceId = value; } }, metadata: _metadata }, _workflowInstanceId_initializers, _workflowInstanceId_extraInitializers);
        __esDecorate(null, null, _workflowId_decorators, { kind: "field", name: "workflowId", static: false, private: false, access: { has: obj => "workflowId" in obj, get: obj => obj.workflowId, set: (obj, value) => { obj.workflowId = value; } }, metadata: _metadata }, _workflowId_initializers, _workflowId_extraInitializers);
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _currentStep_decorators, { kind: "field", name: "currentStep", static: false, private: false, access: { has: obj => "currentStep" in obj, get: obj => obj.currentStep, set: (obj, value) => { obj.currentStep = value; } }, metadata: _metadata }, _currentStep_initializers, _currentStep_extraInitializers);
        __esDecorate(null, null, _variables_decorators, { kind: "field", name: "variables", static: false, private: false, access: { has: obj => "variables" in obj, get: obj => obj.variables, set: (obj, value) => { obj.variables = value; } }, metadata: _metadata }, _variables_initializers, _variables_extraInitializers);
        __esDecorate(null, null, _executionPath_decorators, { kind: "field", name: "executionPath", static: false, private: false, access: { has: obj => "executionPath" in obj, get: obj => obj.executionPath, set: (obj, value) => { obj.executionPath = value; } }, metadata: _metadata }, _executionPath_initializers, _executionPath_extraInitializers);
        __esDecorate(null, null, _errorHistory_decorators, { kind: "field", name: "errorHistory", static: false, private: false, access: { has: obj => "errorHistory" in obj, get: obj => obj.errorHistory, set: (obj, value) => { obj.errorHistory = value; } }, metadata: _metadata }, _errorHistory_initializers, _errorHistory_extraInitializers);
        __esDecorate(null, null, _startedAt_decorators, { kind: "field", name: "startedAt", static: false, private: false, access: { has: obj => "startedAt" in obj, get: obj => obj.startedAt, set: (obj, value) => { obj.startedAt = value; } }, metadata: _metadata }, _startedAt_initializers, _startedAt_extraInitializers);
        __esDecorate(null, null, _completedAt_decorators, { kind: "field", name: "completedAt", static: false, private: false, access: { has: obj => "completedAt" in obj, get: obj => obj.completedAt, set: (obj, value) => { obj.completedAt = value; } }, metadata: _metadata }, _completedAt_initializers, _completedAt_extraInitializers);
        __esDecorate(null, null, _duration_decorators, { kind: "field", name: "duration", static: false, private: false, access: { has: obj => "duration" in obj, get: obj => obj.duration, set: (obj, value) => { obj.duration = value; } }, metadata: _metadata }, _duration_initializers, _duration_extraInitializers);
        __esDecorate(null, null, _retryCount_decorators, { kind: "field", name: "retryCount", static: false, private: false, access: { has: obj => "retryCount" in obj, get: obj => obj.retryCount, set: (obj, value) => { obj.retryCount = value; } }, metadata: _metadata }, _retryCount_initializers, _retryCount_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _stepExecutions_decorators, { kind: "field", name: "stepExecutions", static: false, private: false, access: { has: obj => "stepExecutions" in obj, get: obj => obj.stepExecutions, set: (obj, value) => { obj.stepExecutions = value; } }, metadata: _metadata }, _stepExecutions_initializers, _stepExecutions_extraInitializers);
        __esDecorate(null, null, _events_decorators, { kind: "field", name: "events", static: false, private: false, access: { has: obj => "events" in obj, get: obj => obj.events, set: (obj, value) => { obj.events = value; } }, metadata: _metadata }, _events_initializers, _events_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkflowInstance = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkflowInstance = _classThis;
})();
exports.WorkflowInstance = WorkflowInstance;
/**
 * Workflow step execution model
 */
let WorkflowStepExecution = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'workflow_step_executions',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['workflowInstanceId'] },
                { fields: ['stepId'] },
                { fields: ['status'] },
                { fields: ['startedAt'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _stepExecutionId_decorators;
    let _stepExecutionId_initializers = [];
    let _stepExecutionId_extraInitializers = [];
    let _workflowInstanceId_decorators;
    let _workflowInstanceId_initializers = [];
    let _workflowInstanceId_extraInitializers = [];
    let _workflowInstance_decorators;
    let _workflowInstance_initializers = [];
    let _workflowInstance_extraInitializers = [];
    let _stepId_decorators;
    let _stepId_initializers = [];
    let _stepId_extraInitializers = [];
    let _stepName_decorators;
    let _stepName_initializers = [];
    let _stepName_extraInitializers = [];
    let _stepType_decorators;
    let _stepType_initializers = [];
    let _stepType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _input_decorators;
    let _input_initializers = [];
    let _input_extraInitializers = [];
    let _output_decorators;
    let _output_initializers = [];
    let _output_extraInitializers = [];
    let _error_decorators;
    let _error_initializers = [];
    let _error_extraInitializers = [];
    let _startedAt_decorators;
    let _startedAt_initializers = [];
    let _startedAt_extraInitializers = [];
    let _completedAt_decorators;
    let _completedAt_initializers = [];
    let _completedAt_extraInitializers = [];
    let _duration_decorators;
    let _duration_initializers = [];
    let _duration_extraInitializers = [];
    let _retryCount_decorators;
    let _retryCount_initializers = [];
    let _retryCount_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var WorkflowStepExecution = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.stepExecutionId = __runInitializers(this, _stepExecutionId_initializers, void 0);
            this.workflowInstanceId = (__runInitializers(this, _stepExecutionId_extraInitializers), __runInitializers(this, _workflowInstanceId_initializers, void 0));
            this.workflowInstance = (__runInitializers(this, _workflowInstanceId_extraInitializers), __runInitializers(this, _workflowInstance_initializers, void 0));
            this.stepId = (__runInitializers(this, _workflowInstance_extraInitializers), __runInitializers(this, _stepId_initializers, void 0));
            this.stepName = (__runInitializers(this, _stepId_extraInitializers), __runInitializers(this, _stepName_initializers, void 0));
            this.stepType = (__runInitializers(this, _stepName_extraInitializers), __runInitializers(this, _stepType_initializers, void 0));
            this.status = (__runInitializers(this, _stepType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.input = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _input_initializers, void 0));
            this.output = (__runInitializers(this, _input_extraInitializers), __runInitializers(this, _output_initializers, void 0));
            this.error = (__runInitializers(this, _output_extraInitializers), __runInitializers(this, _error_initializers, void 0));
            this.startedAt = (__runInitializers(this, _error_extraInitializers), __runInitializers(this, _startedAt_initializers, void 0));
            this.completedAt = (__runInitializers(this, _startedAt_extraInitializers), __runInitializers(this, _completedAt_initializers, void 0));
            this.duration = (__runInitializers(this, _completedAt_extraInitializers), __runInitializers(this, _duration_initializers, void 0));
            this.retryCount = (__runInitializers(this, _duration_extraInitializers), __runInitializers(this, _retryCount_initializers, void 0));
            this.createdAt = (__runInitializers(this, _retryCount_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "WorkflowStepExecution");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _stepExecutionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Step execution ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _workflowInstanceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Workflow instance ID' }), (0, sequelize_typescript_1.ForeignKey)(() => WorkflowInstance), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _workflowInstance_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => WorkflowInstance)];
        _stepId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Step ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _stepName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Step name' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            })];
        _stepType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Step type', enum: StepType }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(StepType)),
                allowNull: false,
            })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Step status', enum: StepStatus }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(StepStatus)),
                allowNull: false,
                defaultValue: StepStatus.PENDING,
            }), sequelize_typescript_1.Index];
        _input_decorators = [(0, swagger_1.ApiProperty)({ description: 'Input data (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _output_decorators = [(0, swagger_1.ApiProperty)({ description: 'Output data (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _error_decorators = [(0, swagger_1.ApiProperty)({ description: 'Error details (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _startedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Started at timestamp' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            }), sequelize_typescript_1.Index];
        _completedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Completed at timestamp' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _duration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Duration in milliseconds' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
            })];
        _retryCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Retry count' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column];
        __esDecorate(null, null, _stepExecutionId_decorators, { kind: "field", name: "stepExecutionId", static: false, private: false, access: { has: obj => "stepExecutionId" in obj, get: obj => obj.stepExecutionId, set: (obj, value) => { obj.stepExecutionId = value; } }, metadata: _metadata }, _stepExecutionId_initializers, _stepExecutionId_extraInitializers);
        __esDecorate(null, null, _workflowInstanceId_decorators, { kind: "field", name: "workflowInstanceId", static: false, private: false, access: { has: obj => "workflowInstanceId" in obj, get: obj => obj.workflowInstanceId, set: (obj, value) => { obj.workflowInstanceId = value; } }, metadata: _metadata }, _workflowInstanceId_initializers, _workflowInstanceId_extraInitializers);
        __esDecorate(null, null, _workflowInstance_decorators, { kind: "field", name: "workflowInstance", static: false, private: false, access: { has: obj => "workflowInstance" in obj, get: obj => obj.workflowInstance, set: (obj, value) => { obj.workflowInstance = value; } }, metadata: _metadata }, _workflowInstance_initializers, _workflowInstance_extraInitializers);
        __esDecorate(null, null, _stepId_decorators, { kind: "field", name: "stepId", static: false, private: false, access: { has: obj => "stepId" in obj, get: obj => obj.stepId, set: (obj, value) => { obj.stepId = value; } }, metadata: _metadata }, _stepId_initializers, _stepId_extraInitializers);
        __esDecorate(null, null, _stepName_decorators, { kind: "field", name: "stepName", static: false, private: false, access: { has: obj => "stepName" in obj, get: obj => obj.stepName, set: (obj, value) => { obj.stepName = value; } }, metadata: _metadata }, _stepName_initializers, _stepName_extraInitializers);
        __esDecorate(null, null, _stepType_decorators, { kind: "field", name: "stepType", static: false, private: false, access: { has: obj => "stepType" in obj, get: obj => obj.stepType, set: (obj, value) => { obj.stepType = value; } }, metadata: _metadata }, _stepType_initializers, _stepType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _input_decorators, { kind: "field", name: "input", static: false, private: false, access: { has: obj => "input" in obj, get: obj => obj.input, set: (obj, value) => { obj.input = value; } }, metadata: _metadata }, _input_initializers, _input_extraInitializers);
        __esDecorate(null, null, _output_decorators, { kind: "field", name: "output", static: false, private: false, access: { has: obj => "output" in obj, get: obj => obj.output, set: (obj, value) => { obj.output = value; } }, metadata: _metadata }, _output_initializers, _output_extraInitializers);
        __esDecorate(null, null, _error_decorators, { kind: "field", name: "error", static: false, private: false, access: { has: obj => "error" in obj, get: obj => obj.error, set: (obj, value) => { obj.error = value; } }, metadata: _metadata }, _error_initializers, _error_extraInitializers);
        __esDecorate(null, null, _startedAt_decorators, { kind: "field", name: "startedAt", static: false, private: false, access: { has: obj => "startedAt" in obj, get: obj => obj.startedAt, set: (obj, value) => { obj.startedAt = value; } }, metadata: _metadata }, _startedAt_initializers, _startedAt_extraInitializers);
        __esDecorate(null, null, _completedAt_decorators, { kind: "field", name: "completedAt", static: false, private: false, access: { has: obj => "completedAt" in obj, get: obj => obj.completedAt, set: (obj, value) => { obj.completedAt = value; } }, metadata: _metadata }, _completedAt_initializers, _completedAt_extraInitializers);
        __esDecorate(null, null, _duration_decorators, { kind: "field", name: "duration", static: false, private: false, access: { has: obj => "duration" in obj, get: obj => obj.duration, set: (obj, value) => { obj.duration = value; } }, metadata: _metadata }, _duration_initializers, _duration_extraInitializers);
        __esDecorate(null, null, _retryCount_decorators, { kind: "field", name: "retryCount", static: false, private: false, access: { has: obj => "retryCount" in obj, get: obj => obj.retryCount, set: (obj, value) => { obj.retryCount = value; } }, metadata: _metadata }, _retryCount_initializers, _retryCount_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkflowStepExecution = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkflowStepExecution = _classThis;
})();
exports.WorkflowStepExecution = WorkflowStepExecution;
/**
 * Workflow event log model
 */
let WorkflowEventLog = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'workflow_event_logs',
            timestamps: true,
            indexes: [
                { fields: ['workflowInstanceId'] },
                { fields: ['eventType'] },
                { fields: ['timestamp'] },
                { fields: ['orderId'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _eventId_decorators;
    let _eventId_initializers = [];
    let _eventId_extraInitializers = [];
    let _workflowInstanceId_decorators;
    let _workflowInstanceId_initializers = [];
    let _workflowInstanceId_extraInitializers = [];
    let _workflowInstance_decorators;
    let _workflowInstance_initializers = [];
    let _workflowInstance_extraInitializers = [];
    let _eventType_decorators;
    let _eventType_initializers = [];
    let _eventType_extraInitializers = [];
    let _stepId_decorators;
    let _stepId_initializers = [];
    let _stepId_extraInitializers = [];
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _payload_decorators;
    let _payload_initializers = [];
    let _payload_extraInitializers = [];
    let _correlationId_decorators;
    let _correlationId_initializers = [];
    let _correlationId_extraInitializers = [];
    let _timestamp_decorators;
    let _timestamp_initializers = [];
    let _timestamp_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    var WorkflowEventLog = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.eventId = __runInitializers(this, _eventId_initializers, void 0);
            this.workflowInstanceId = (__runInitializers(this, _eventId_extraInitializers), __runInitializers(this, _workflowInstanceId_initializers, void 0));
            this.workflowInstance = (__runInitializers(this, _workflowInstanceId_extraInitializers), __runInitializers(this, _workflowInstance_initializers, void 0));
            this.eventType = (__runInitializers(this, _workflowInstance_extraInitializers), __runInitializers(this, _eventType_initializers, void 0));
            this.stepId = (__runInitializers(this, _eventType_extraInitializers), __runInitializers(this, _stepId_initializers, void 0));
            this.orderId = (__runInitializers(this, _stepId_extraInitializers), __runInitializers(this, _orderId_initializers, void 0));
            this.payload = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _payload_initializers, void 0));
            this.correlationId = (__runInitializers(this, _payload_extraInitializers), __runInitializers(this, _correlationId_initializers, void 0));
            this.timestamp = (__runInitializers(this, _correlationId_extraInitializers), __runInitializers(this, _timestamp_initializers, void 0));
            this.createdAt = (__runInitializers(this, _timestamp_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "WorkflowEventLog");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _eventId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Event ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _workflowInstanceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Workflow instance ID' }), (0, sequelize_typescript_1.ForeignKey)(() => WorkflowInstance), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _workflowInstance_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => WorkflowInstance)];
        _eventType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Event type', enum: WorkflowEvent }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(WorkflowEvent)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _stepId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Step ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
            })];
        _orderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _payload_decorators = [(0, swagger_1.ApiProperty)({ description: 'Event payload (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _correlationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Correlation ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
            })];
        _timestamp_decorators = [(0, swagger_1.ApiProperty)({ description: 'Event timestamp' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                defaultValue: sequelize_typescript_1.DataType.NOW,
            }), sequelize_typescript_1.Index];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column];
        __esDecorate(null, null, _eventId_decorators, { kind: "field", name: "eventId", static: false, private: false, access: { has: obj => "eventId" in obj, get: obj => obj.eventId, set: (obj, value) => { obj.eventId = value; } }, metadata: _metadata }, _eventId_initializers, _eventId_extraInitializers);
        __esDecorate(null, null, _workflowInstanceId_decorators, { kind: "field", name: "workflowInstanceId", static: false, private: false, access: { has: obj => "workflowInstanceId" in obj, get: obj => obj.workflowInstanceId, set: (obj, value) => { obj.workflowInstanceId = value; } }, metadata: _metadata }, _workflowInstanceId_initializers, _workflowInstanceId_extraInitializers);
        __esDecorate(null, null, _workflowInstance_decorators, { kind: "field", name: "workflowInstance", static: false, private: false, access: { has: obj => "workflowInstance" in obj, get: obj => obj.workflowInstance, set: (obj, value) => { obj.workflowInstance = value; } }, metadata: _metadata }, _workflowInstance_initializers, _workflowInstance_extraInitializers);
        __esDecorate(null, null, _eventType_decorators, { kind: "field", name: "eventType", static: false, private: false, access: { has: obj => "eventType" in obj, get: obj => obj.eventType, set: (obj, value) => { obj.eventType = value; } }, metadata: _metadata }, _eventType_initializers, _eventType_extraInitializers);
        __esDecorate(null, null, _stepId_decorators, { kind: "field", name: "stepId", static: false, private: false, access: { has: obj => "stepId" in obj, get: obj => obj.stepId, set: (obj, value) => { obj.stepId = value; } }, metadata: _metadata }, _stepId_initializers, _stepId_extraInitializers);
        __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
        __esDecorate(null, null, _payload_decorators, { kind: "field", name: "payload", static: false, private: false, access: { has: obj => "payload" in obj, get: obj => obj.payload, set: (obj, value) => { obj.payload = value; } }, metadata: _metadata }, _payload_initializers, _payload_extraInitializers);
        __esDecorate(null, null, _correlationId_decorators, { kind: "field", name: "correlationId", static: false, private: false, access: { has: obj => "correlationId" in obj, get: obj => obj.correlationId, set: (obj, value) => { obj.correlationId = value; } }, metadata: _metadata }, _correlationId_initializers, _correlationId_extraInitializers);
        __esDecorate(null, null, _timestamp_decorators, { kind: "field", name: "timestamp", static: false, private: false, access: { has: obj => "timestamp" in obj, get: obj => obj.timestamp, set: (obj, value) => { obj.timestamp = value; } }, metadata: _metadata }, _timestamp_initializers, _timestamp_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkflowEventLog = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkflowEventLog = _classThis;
})();
exports.WorkflowEventLog = WorkflowEventLog;
/**
 * Approval request model
 */
let WorkflowApprovalRequest = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'workflow_approval_requests',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['approvalId'], unique: true },
                { fields: ['workflowInstanceId'] },
                { fields: ['orderId'] },
                { fields: ['decision'] },
                { fields: ['requestedAt'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _approvalId_decorators;
    let _approvalId_initializers = [];
    let _approvalId_extraInitializers = [];
    let _workflowInstanceId_decorators;
    let _workflowInstanceId_initializers = [];
    let _workflowInstanceId_extraInitializers = [];
    let _stepId_decorators;
    let _stepId_initializers = [];
    let _stepId_extraInitializers = [];
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _requestedBy_decorators;
    let _requestedBy_initializers = [];
    let _requestedBy_extraInitializers = [];
    let _approvers_decorators;
    let _approvers_initializers = [];
    let _approvers_extraInitializers = [];
    let _approvalLevel_decorators;
    let _approvalLevel_initializers = [];
    let _approvalLevel_extraInitializers = [];
    let _decision_decorators;
    let _decision_initializers = [];
    let _decision_extraInitializers = [];
    let _decidedBy_decorators;
    let _decidedBy_initializers = [];
    let _decidedBy_extraInitializers = [];
    let _comments_decorators;
    let _comments_initializers = [];
    let _comments_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _requestedAt_decorators;
    let _requestedAt_initializers = [];
    let _requestedAt_extraInitializers = [];
    let _decidedAt_decorators;
    let _decidedAt_initializers = [];
    let _decidedAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var WorkflowApprovalRequest = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.approvalId = __runInitializers(this, _approvalId_initializers, void 0);
            this.workflowInstanceId = (__runInitializers(this, _approvalId_extraInitializers), __runInitializers(this, _workflowInstanceId_initializers, void 0));
            this.stepId = (__runInitializers(this, _workflowInstanceId_extraInitializers), __runInitializers(this, _stepId_initializers, void 0));
            this.orderId = (__runInitializers(this, _stepId_extraInitializers), __runInitializers(this, _orderId_initializers, void 0));
            this.requestedBy = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _requestedBy_initializers, void 0));
            this.approvers = (__runInitializers(this, _requestedBy_extraInitializers), __runInitializers(this, _approvers_initializers, void 0));
            this.approvalLevel = (__runInitializers(this, _approvers_extraInitializers), __runInitializers(this, _approvalLevel_initializers, void 0));
            this.decision = (__runInitializers(this, _approvalLevel_extraInitializers), __runInitializers(this, _decision_initializers, void 0));
            this.decidedBy = (__runInitializers(this, _decision_extraInitializers), __runInitializers(this, _decidedBy_initializers, void 0));
            this.comments = (__runInitializers(this, _decidedBy_extraInitializers), __runInitializers(this, _comments_initializers, void 0));
            this.metadata = (__runInitializers(this, _comments_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.requestedAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _requestedAt_initializers, void 0));
            this.decidedAt = (__runInitializers(this, _requestedAt_extraInitializers), __runInitializers(this, _decidedAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _decidedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "WorkflowApprovalRequest");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _approvalId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _workflowInstanceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Workflow instance ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _stepId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Step ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
            })];
        _orderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _requestedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requested by user ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            })];
        _approvers_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approvers list' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
            })];
        _approvalLevel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval level' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 1,
            })];
        _decision_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval decision', enum: ApprovalDecision }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ApprovalDecision)),
                allowNull: false,
                defaultValue: ApprovalDecision.PENDING,
            }), sequelize_typescript_1.Index];
        _decidedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Decided by user ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _comments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Comments' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metadata (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _requestedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requested at timestamp' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                defaultValue: sequelize_typescript_1.DataType.NOW,
            }), sequelize_typescript_1.Index];
        _decidedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Decided at timestamp' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column];
        __esDecorate(null, null, _approvalId_decorators, { kind: "field", name: "approvalId", static: false, private: false, access: { has: obj => "approvalId" in obj, get: obj => obj.approvalId, set: (obj, value) => { obj.approvalId = value; } }, metadata: _metadata }, _approvalId_initializers, _approvalId_extraInitializers);
        __esDecorate(null, null, _workflowInstanceId_decorators, { kind: "field", name: "workflowInstanceId", static: false, private: false, access: { has: obj => "workflowInstanceId" in obj, get: obj => obj.workflowInstanceId, set: (obj, value) => { obj.workflowInstanceId = value; } }, metadata: _metadata }, _workflowInstanceId_initializers, _workflowInstanceId_extraInitializers);
        __esDecorate(null, null, _stepId_decorators, { kind: "field", name: "stepId", static: false, private: false, access: { has: obj => "stepId" in obj, get: obj => obj.stepId, set: (obj, value) => { obj.stepId = value; } }, metadata: _metadata }, _stepId_initializers, _stepId_extraInitializers);
        __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
        __esDecorate(null, null, _requestedBy_decorators, { kind: "field", name: "requestedBy", static: false, private: false, access: { has: obj => "requestedBy" in obj, get: obj => obj.requestedBy, set: (obj, value) => { obj.requestedBy = value; } }, metadata: _metadata }, _requestedBy_initializers, _requestedBy_extraInitializers);
        __esDecorate(null, null, _approvers_decorators, { kind: "field", name: "approvers", static: false, private: false, access: { has: obj => "approvers" in obj, get: obj => obj.approvers, set: (obj, value) => { obj.approvers = value; } }, metadata: _metadata }, _approvers_initializers, _approvers_extraInitializers);
        __esDecorate(null, null, _approvalLevel_decorators, { kind: "field", name: "approvalLevel", static: false, private: false, access: { has: obj => "approvalLevel" in obj, get: obj => obj.approvalLevel, set: (obj, value) => { obj.approvalLevel = value; } }, metadata: _metadata }, _approvalLevel_initializers, _approvalLevel_extraInitializers);
        __esDecorate(null, null, _decision_decorators, { kind: "field", name: "decision", static: false, private: false, access: { has: obj => "decision" in obj, get: obj => obj.decision, set: (obj, value) => { obj.decision = value; } }, metadata: _metadata }, _decision_initializers, _decision_extraInitializers);
        __esDecorate(null, null, _decidedBy_decorators, { kind: "field", name: "decidedBy", static: false, private: false, access: { has: obj => "decidedBy" in obj, get: obj => obj.decidedBy, set: (obj, value) => { obj.decidedBy = value; } }, metadata: _metadata }, _decidedBy_initializers, _decidedBy_extraInitializers);
        __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: obj => "comments" in obj, get: obj => obj.comments, set: (obj, value) => { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _requestedAt_decorators, { kind: "field", name: "requestedAt", static: false, private: false, access: { has: obj => "requestedAt" in obj, get: obj => obj.requestedAt, set: (obj, value) => { obj.requestedAt = value; } }, metadata: _metadata }, _requestedAt_initializers, _requestedAt_extraInitializers);
        __esDecorate(null, null, _decidedAt_decorators, { kind: "field", name: "decidedAt", static: false, private: false, access: { has: obj => "decidedAt" in obj, get: obj => obj.decidedAt, set: (obj, value) => { obj.decidedAt = value; } }, metadata: _metadata }, _decidedAt_initializers, _decidedAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkflowApprovalRequest = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkflowApprovalRequest = _classThis;
})();
exports.WorkflowApprovalRequest = WorkflowApprovalRequest;
// ============================================================================
// UTILITY FUNCTIONS - WORKFLOW STATE MACHINE
// ============================================================================
/**
 * Initialize workflow instance from definition
 *
 * @param workflowDefinition - Workflow definition
 * @param orderId - Order ID
 * @param userId - User ID initiating workflow
 * @param initialVariables - Initial workflow variables
 * @returns Created workflow instance
 *
 * @example
 * const instance = await initializeWorkflow(definition, 'ORD-001', 'user-123', {});
 */
async function initializeWorkflow(workflowDefinition, orderId, userId, initialVariables = {}) {
    try {
        const instance = await WorkflowInstance.create({
            workflowId: workflowDefinition.workflowId,
            version: workflowDefinition.version,
            orderId,
            status: WorkflowStatus.PENDING,
            variables: { ...initialVariables, orderId },
            executionPath: [],
            errorHistory: [],
            retryCount: 0,
            metadata: workflowDefinition.metadata,
            createdBy: userId,
        });
        await emitWorkflowEvent({
            eventId: crypto.randomUUID(),
            eventType: WorkflowEvent.WORKFLOW_STARTED,
            workflowInstanceId: instance.workflowInstanceId,
            orderId,
            timestamp: new Date(),
            payload: { workflowId: workflowDefinition.workflowId, version: workflowDefinition.version },
        });
        return instance;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to initialize workflow: ${error.message}`);
    }
}
/**
 * Start workflow execution
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param workflowDefinition - Workflow definition
 * @returns Updated workflow instance
 *
 * @example
 * const instance = await startWorkflowExecution('wf-inst-123', definition);
 */
async function startWorkflowExecution(workflowInstanceId, workflowDefinition) {
    try {
        const instance = await WorkflowInstance.findByPk(workflowInstanceId);
        if (!instance) {
            throw new common_1.NotFoundException(`Workflow instance not found: ${workflowInstanceId}`);
        }
        if (instance.status !== WorkflowStatus.PENDING) {
            throw new common_1.ConflictException(`Workflow already started: ${workflowInstanceId}`);
        }
        const firstStep = workflowDefinition.steps[0];
        await instance.update({
            status: WorkflowStatus.RUNNING,
            currentStep: firstStep.stepId,
            startedAt: new Date(),
        });
        return instance;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to start workflow: ${error.message}`);
    }
}
/**
 * Transition workflow to next state
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param newStatus - New workflow status
 * @param currentStep - Current step ID
 * @returns Updated workflow instance
 *
 * @example
 * const instance = await transitionWorkflowState('wf-inst-123', WorkflowStatus.COMPLETED, null);
 */
async function transitionWorkflowState(workflowInstanceId, newStatus, currentStep) {
    try {
        const instance = await WorkflowInstance.findByPk(workflowInstanceId);
        if (!instance) {
            throw new common_1.NotFoundException(`Workflow instance not found: ${workflowInstanceId}`);
        }
        const updateData = { status: newStatus };
        if (currentStep) {
            updateData.currentStep = currentStep;
        }
        if (newStatus === WorkflowStatus.COMPLETED || newStatus === WorkflowStatus.FAILED || newStatus === WorkflowStatus.CANCELLED) {
            updateData.completedAt = new Date();
            updateData.duration = updateData.completedAt.getTime() - instance.startedAt.getTime();
        }
        await instance.update(updateData);
        return instance;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to transition workflow state: ${error.message}`);
    }
}
/**
 * Pause workflow execution
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param reason - Reason for pausing
 * @returns Updated workflow instance
 *
 * @example
 * const instance = await pauseWorkflow('wf-inst-123', 'Manual intervention required');
 */
async function pauseWorkflow(workflowInstanceId, reason) {
    try {
        const instance = await transitionWorkflowState(workflowInstanceId, WorkflowStatus.PAUSED, instance.currentStep);
        if (reason) {
            const variables = { ...instance.variables, pauseReason: reason };
            await instance.update({ variables });
        }
        return instance;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to pause workflow: ${error.message}`);
    }
}
/**
 * Resume paused workflow
 *
 * @param workflowInstanceId - Workflow instance ID
 * @returns Updated workflow instance
 *
 * @example
 * const instance = await resumeWorkflow('wf-inst-123');
 */
async function resumeWorkflow(workflowInstanceId) {
    try {
        const instance = await WorkflowInstance.findByPk(workflowInstanceId);
        if (!instance) {
            throw new common_1.NotFoundException(`Workflow instance not found: ${workflowInstanceId}`);
        }
        if (instance.status !== WorkflowStatus.PAUSED) {
            throw new common_1.ConflictException(`Workflow is not paused: ${workflowInstanceId}`);
        }
        await instance.update({ status: WorkflowStatus.RUNNING });
        return instance;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to resume workflow: ${error.message}`);
    }
}
/**
 * Cancel workflow execution
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param reason - Cancellation reason
 * @returns Updated workflow instance
 *
 * @example
 * const instance = await cancelWorkflow('wf-inst-123', 'User requested cancellation');
 */
async function cancelWorkflow(workflowInstanceId, reason) {
    try {
        const instance = await transitionWorkflowState(workflowInstanceId, WorkflowStatus.CANCELLED, null);
        await emitWorkflowEvent({
            eventId: crypto.randomUUID(),
            eventType: WorkflowEvent.WORKFLOW_CANCELLED,
            workflowInstanceId,
            orderId: instance.orderId,
            timestamp: new Date(),
            payload: { reason },
        });
        return instance;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to cancel workflow: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - WORKFLOW STEP EXECUTION
// ============================================================================
/**
 * Execute workflow step
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param step - Workflow step definition
 * @param context - Workflow context
 * @returns Step execution result
 *
 * @example
 * const result = await executeWorkflowStep('wf-inst-123', stepDef, context);
 */
async function executeWorkflowStep(workflowInstanceId, step, context) {
    const startTime = Date.now();
    try {
        const stepExecution = await WorkflowStepExecution.create({
            workflowInstanceId,
            stepId: step.stepId,
            stepName: step.name,
            stepType: step.type,
            status: StepStatus.RUNNING,
            input: step.input,
            retryCount: 0,
            startedAt: new Date(),
        });
        await emitWorkflowEvent({
            eventId: crypto.randomUUID(),
            eventType: WorkflowEvent.STEP_STARTED,
            workflowInstanceId,
            stepId: step.stepId,
            orderId: context.orderId,
            timestamp: new Date(),
            payload: { stepName: step.name, stepType: step.type },
        });
        // Execute step based on type
        let output = {};
        switch (step.type) {
            case StepType.TASK:
                output = await executeTaskStep(step, context);
                break;
            case StepType.APPROVAL:
                output = await executeApprovalStep(step, context);
                break;
            case StepType.INTEGRATION:
                output = await executeIntegrationStep(step, context);
                break;
            case StepType.DECISION:
                output = await executeDecisionStep(step, context);
                break;
            case StepType.WAIT:
                output = await executeWaitStep(step, context);
                break;
            default:
                throw new Error(`Unsupported step type: ${step.type}`);
        }
        const duration = Date.now() - startTime;
        await stepExecution.update({
            status: StepStatus.COMPLETED,
            output,
            completedAt: new Date(),
            duration,
        });
        await emitWorkflowEvent({
            eventId: crypto.randomUUID(),
            eventType: WorkflowEvent.STEP_COMPLETED,
            workflowInstanceId,
            stepId: step.stepId,
            orderId: context.orderId,
            timestamp: new Date(),
            payload: { output, duration },
        });
        return {
            stepId: step.stepId,
            status: StepStatus.COMPLETED,
            output,
            duration,
            retryCount: 0,
        };
    }
    catch (error) {
        const duration = Date.now() - startTime;
        const workflowError = {
            stepId: step.stepId,
            errorCode: error.code || 'STEP_EXECUTION_ERROR',
            errorMessage: error.message,
            timestamp: new Date(),
            retryCount: 0,
            stack: error.stack,
        };
        await emitWorkflowEvent({
            eventId: crypto.randomUUID(),
            eventType: WorkflowEvent.STEP_FAILED,
            workflowInstanceId,
            stepId: step.stepId,
            orderId: context.orderId,
            timestamp: new Date(),
            payload: { error: workflowError },
        });
        return {
            stepId: step.stepId,
            status: StepStatus.FAILED,
            error: workflowError,
            duration,
            retryCount: 0,
        };
    }
}
/**
 * Execute task step
 *
 * @param step - Workflow step
 * @param context - Workflow context
 * @returns Step output
 */
async function executeTaskStep(step, context) {
    // Implementation would call appropriate handler
    // This is a placeholder showing the pattern
    return {
        result: 'Task executed successfully',
        timestamp: new Date(),
    };
}
/**
 * Execute approval step
 *
 * @param step - Workflow step
 * @param context - Workflow context
 * @returns Step output
 */
async function executeApprovalStep(step, context) {
    const approvalRequest = await createApprovalRequest(context.workflowInstanceId, step.stepId, context.orderId, step.input?.approvers || [], step.input?.approvalLevel || 1, 'system');
    return {
        approvalId: approvalRequest.approvalId,
        status: 'PENDING_APPROVAL',
    };
}
/**
 * Execute integration step
 *
 * @param step - Workflow step
 * @param context - Workflow context
 * @returns Step output
 */
async function executeIntegrationStep(step, context) {
    const integrationCall = step.input;
    const response = await callExternalIntegration(integrationCall, context.workflowInstanceId);
    return {
        integrationId: response.integrationId,
        statusCode: response.statusCode,
        body: response.body,
    };
}
/**
 * Execute decision step
 *
 * @param step - Workflow step
 * @param context - Workflow context
 * @returns Step output
 */
async function executeDecisionStep(step, context) {
    const condition = step.condition || 'true';
    const result = evaluateCondition(condition, context.variables);
    return {
        decision: result,
        nextSteps: result ? step.nextSteps : step.errorSteps,
    };
}
/**
 * Execute wait step
 *
 * @param step - Workflow step
 * @param context - Workflow context
 * @returns Step output
 */
async function executeWaitStep(step, context) {
    const waitDuration = step.input?.duration || 1000;
    await new Promise(resolve => setTimeout(resolve, waitDuration));
    return {
        waitedMs: waitDuration,
        resumedAt: new Date(),
    };
}
/**
 * Retry failed step with exponential backoff
 *
 * @param stepExecutionId - Step execution ID
 * @param retryPolicy - Retry policy
 * @returns Updated step execution
 *
 * @example
 * const execution = await retryFailedStep('step-exec-123', retryPolicy);
 */
async function retryFailedStep(stepExecutionId, retryPolicy) {
    try {
        const stepExecution = await WorkflowStepExecution.findByPk(stepExecutionId);
        if (!stepExecution) {
            throw new common_1.NotFoundException(`Step execution not found: ${stepExecutionId}`);
        }
        if (stepExecution.retryCount >= retryPolicy.maxAttempts) {
            throw new common_1.ConflictException(`Max retry attempts reached: ${stepExecution.retryCount}`);
        }
        const delay = Math.min(retryPolicy.initialDelay * Math.pow(retryPolicy.backoffMultiplier, stepExecution.retryCount), retryPolicy.maxDelay);
        await new Promise(resolve => setTimeout(resolve, delay));
        await stepExecution.update({
            status: StepStatus.RETRYING,
            retryCount: stepExecution.retryCount + 1,
        });
        return stepExecution;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to retry step: ${error.message}`);
    }
}
/**
 * Skip workflow step
 *
 * @param stepExecutionId - Step execution ID
 * @param reason - Skip reason
 * @returns Updated step execution
 *
 * @example
 * const execution = await skipWorkflowStep('step-exec-123', 'Not applicable');
 */
async function skipWorkflowStep(stepExecutionId, reason) {
    try {
        const stepExecution = await WorkflowStepExecution.findByPk(stepExecutionId);
        if (!stepExecution) {
            throw new common_1.NotFoundException(`Step execution not found: ${stepExecutionId}`);
        }
        await stepExecution.update({
            status: StepStatus.SKIPPED,
            output: { skipReason: reason, skippedAt: new Date() },
            completedAt: new Date(),
        });
        return stepExecution;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to skip step: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - PARALLEL WORKFLOW EXECUTION
// ============================================================================
/**
 * Execute workflow steps in parallel
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param steps - Array of workflow steps
 * @param context - Workflow context
 * @returns Array of step execution results
 *
 * @example
 * const results = await executeStepsInParallel('wf-inst-123', steps, context);
 */
async function executeStepsInParallel(workflowInstanceId, steps, context) {
    try {
        const promises = steps.map(step => executeWorkflowStep(workflowInstanceId, step, context));
        const results = await Promise.allSettled(promises);
        return results.map((result, index) => {
            if (result.status === 'fulfilled') {
                return result.value;
            }
            else {
                return {
                    stepId: steps[index].stepId,
                    status: StepStatus.FAILED,
                    error: {
                        stepId: steps[index].stepId,
                        errorCode: 'PARALLEL_EXECUTION_ERROR',
                        errorMessage: result.reason.message,
                        timestamp: new Date(),
                        retryCount: 0,
                    },
                    duration: 0,
                    retryCount: 0,
                };
            }
        });
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to execute parallel steps: ${error.message}`);
    }
}
/**
 * Execute workflow steps sequentially
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param steps - Array of workflow steps
 * @param context - Workflow context
 * @returns Array of step execution results
 *
 * @example
 * const results = await executeStepsSequentially('wf-inst-123', steps, context);
 */
async function executeStepsSequentially(workflowInstanceId, steps, context) {
    const results = [];
    for (const step of steps) {
        const result = await executeWorkflowStep(workflowInstanceId, step, context);
        results.push(result);
        // Update context with step output
        if (result.output) {
            context.variables = { ...context.variables, ...result.output };
        }
        // Stop on failure if no error handling defined
        if (result.status === StepStatus.FAILED && !step.errorSteps) {
            break;
        }
    }
    return results;
}
/**
 * Wait for all parallel steps to complete
 *
 * @param stepExecutionIds - Array of step execution IDs
 * @param timeout - Timeout in milliseconds
 * @returns Boolean indicating if all completed
 *
 * @example
 * const completed = await waitForParallelSteps(['step-1', 'step-2'], 30000);
 */
async function waitForParallelSteps(stepExecutionIds, timeout = 60000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        const executions = await WorkflowStepExecution.findAll({
            where: { stepExecutionId: stepExecutionIds },
        });
        const allCompleted = executions.every(exec => exec.status === StepStatus.COMPLETED || exec.status === StepStatus.FAILED || exec.status === StepStatus.SKIPPED);
        if (allCompleted) {
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return false;
}
// ============================================================================
// UTILITY FUNCTIONS - WORKFLOW BRANCHING
// ============================================================================
/**
 * Evaluate branch condition
 *
 * @param condition - Condition expression
 * @param variables - Workflow variables
 * @returns Boolean result
 *
 * @example
 * const result = evaluateCondition('orderTotal > 1000', { orderTotal: 1500 });
 */
function evaluateCondition(condition, variables) {
    try {
        // Simple condition evaluator - in production use a safe expression evaluator
        const func = new Function(...Object.keys(variables), `return ${condition};`);
        return func(...Object.values(variables));
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to evaluate condition: ${error.message}`);
    }
}
/**
 * Determine next workflow steps based on decision
 *
 * @param currentStep - Current step
 * @param decision - Decision result
 * @param workflowDefinition - Workflow definition
 * @returns Array of next steps
 *
 * @example
 * const nextSteps = determineNextSteps(currentStep, true, definition);
 */
function determineNextSteps(currentStep, decision, workflowDefinition) {
    const nextStepIds = decision ? currentStep.nextSteps : currentStep.errorSteps;
    if (!nextStepIds || nextStepIds.length === 0) {
        return [];
    }
    return workflowDefinition.steps.filter(step => nextStepIds.includes(step.stepId));
}
/**
 * Execute conditional branch
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param branchSteps - Steps for true/false branches
 * @param condition - Condition to evaluate
 * @param context - Workflow context
 * @returns Step execution results
 *
 * @example
 * const results = await executeConditionalBranch('wf-inst-123', branches, 'amount > 100', context);
 */
async function executeConditionalBranch(workflowInstanceId, branchSteps, condition, context) {
    try {
        const conditionResult = evaluateCondition(condition, context.variables);
        const stepsToExecute = conditionResult ? branchSteps.true : branchSteps.false;
        return await executeStepsSequentially(workflowInstanceId, stepsToExecute, context);
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to execute conditional branch: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - WORKFLOW ERROR HANDLING & ROLLBACK
// ============================================================================
/**
 * Handle workflow step error
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param stepId - Step ID
 * @param error - Error details
 * @param retryPolicy - Retry policy
 * @returns Error handling result
 *
 * @example
 * await handleStepError('wf-inst-123', 'step-1', error, retryPolicy);
 */
async function handleStepError(workflowInstanceId, stepId, error, retryPolicy) {
    try {
        const instance = await WorkflowInstance.findByPk(workflowInstanceId);
        if (!instance) {
            throw new common_1.NotFoundException(`Workflow instance not found: ${workflowInstanceId}`);
        }
        // Add error to history
        const errorHistory = [...instance.errorHistory, error];
        await instance.update({ errorHistory });
        // Check if should retry
        const shouldRetry = retryPolicy && error.retryCount < retryPolicy.maxAttempts;
        // Check if should compensate
        const shouldCompensate = !shouldRetry;
        return { shouldRetry, shouldCompensate };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to handle step error: ${error.message}`);
    }
}
/**
 * Trigger workflow compensation (saga pattern)
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param failedStepId - Failed step ID
 * @returns Compensation transaction
 *
 * @example
 * const compensation = await triggerCompensation('wf-inst-123', 'step-3');
 */
async function triggerCompensation(workflowInstanceId, failedStepId) {
    try {
        const instance = await WorkflowInstance.findByPk(workflowInstanceId, {
            include: [{ model: WorkflowStepExecution, as: 'stepExecutions' }],
        });
        if (!instance) {
            throw new common_1.NotFoundException(`Workflow instance not found: ${workflowInstanceId}`);
        }
        await instance.update({ status: WorkflowStatus.COMPENSATING });
        await emitWorkflowEvent({
            eventId: crypto.randomUUID(),
            eventType: WorkflowEvent.COMPENSATION_TRIGGERED,
            workflowInstanceId,
            stepId: failedStepId,
            orderId: instance.orderId,
            timestamp: new Date(),
            payload: { failedStepId },
        });
        const compensation = {
            compensationId: crypto.randomUUID(),
            workflowInstanceId,
            stepId: failedStepId,
            compensationStepId: `${failedStepId}_compensation`,
            status: StepStatus.PENDING,
            startedAt: new Date(),
        };
        return compensation;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to trigger compensation: ${error.message}`);
    }
}
/**
 * Execute compensation steps for completed steps
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param compensationSteps - Compensation step definitions
 * @param context - Workflow context
 * @returns Compensation results
 *
 * @example
 * const results = await executeCompensationSteps('wf-inst-123', compSteps, context);
 */
async function executeCompensationSteps(workflowInstanceId, compensationSteps, context) {
    try {
        const results = [];
        // Execute compensation steps in reverse order
        for (const step of compensationSteps.reverse()) {
            const result = await executeWorkflowStep(workflowInstanceId, step, context);
            results.push(result);
        }
        const instance = await WorkflowInstance.findByPk(workflowInstanceId);
        await instance.update({ status: WorkflowStatus.COMPENSATED });
        return results;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to execute compensation steps: ${error.message}`);
    }
}
/**
 * Rollback workflow to previous state
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param targetStepId - Target step to rollback to
 * @returns Updated workflow instance
 *
 * @example
 * const instance = await rollbackWorkflow('wf-inst-123', 'step-1');
 */
async function rollbackWorkflow(workflowInstanceId, targetStepId) {
    try {
        const instance = await WorkflowInstance.findByPk(workflowInstanceId);
        if (!instance) {
            throw new common_1.NotFoundException(`Workflow instance not found: ${workflowInstanceId}`);
        }
        // Find target step in execution path
        const targetIndex = instance.executionPath.indexOf(targetStepId);
        if (targetIndex === -1) {
            throw new common_1.NotFoundException(`Target step not found in execution path: ${targetStepId}`);
        }
        // Truncate execution path
        const newExecutionPath = instance.executionPath.slice(0, targetIndex + 1);
        await instance.update({
            currentStep: targetStepId,
            executionPath: newExecutionPath,
            status: WorkflowStatus.RUNNING,
        });
        return instance;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to rollback workflow: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - ORDER ROUTING
// ============================================================================
/**
 * Route order to fulfillment center
 *
 * @param orderId - Order ID
 * @param routingConfig - Routing configuration
 * @param orderData - Order data for routing decision
 * @returns Selected routing target
 *
 * @example
 * const target = await routeOrderToFulfillment('ORD-001', config, orderData);
 */
async function routeOrderToFulfillment(orderId, routingConfig, orderData) {
    try {
        let selectedTarget;
        switch (routingConfig.strategy) {
            case RoutingStrategy.ROUND_ROBIN:
                selectedTarget = selectRoundRobinTarget(routingConfig.targets);
                break;
            case RoutingStrategy.LOAD_BASED:
                selectedTarget = selectLoadBasedTarget(routingConfig.targets);
                break;
            case RoutingStrategy.PRIORITY_BASED:
                selectedTarget = selectPriorityBasedTarget(routingConfig.targets);
                break;
            case RoutingStrategy.RULE_BASED:
                selectedTarget = selectRuleBasedTarget(routingConfig.targets, routingConfig.rules, orderData);
                break;
            case RoutingStrategy.GEOGRAPHY_BASED:
                selectedTarget = selectGeographyBasedTarget(routingConfig.targets, orderData);
                break;
            default:
                throw new Error(`Unsupported routing strategy: ${routingConfig.strategy}`);
        }
        return selectedTarget;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to route order: ${error.message}`);
    }
}
/**
 * Select target using round-robin strategy
 */
function selectRoundRobinTarget(targets) {
    const index = Math.floor(Math.random() * targets.length);
    return targets[index];
}
/**
 * Select target based on current load
 */
function selectLoadBasedTarget(targets) {
    return targets.reduce((lowest, current) => {
        const lowestUtilization = (lowest.currentLoad || 0) / (lowest.capacity || 1);
        const currentUtilization = (current.currentLoad || 0) / (current.capacity || 1);
        return currentUtilization < lowestUtilization ? current : lowest;
    });
}
/**
 * Select target based on priority
 */
function selectPriorityBasedTarget(targets) {
    return targets.reduce((highest, current) => {
        return (current.priority || 0) > (highest.priority || 0) ? current : highest;
    });
}
/**
 * Select target based on routing rules
 */
function selectRuleBasedTarget(targets, rules = [], orderData) {
    // Sort rules by priority
    const sortedRules = rules.sort((a, b) => b.priority - a.priority);
    for (const rule of sortedRules) {
        if (evaluateCondition(rule.condition, orderData)) {
            const target = targets.find(t => t.targetId === rule.targetId);
            if (target)
                return target;
        }
    }
    return targets[0]; // Default to first target
}
/**
 * Select target based on geography
 */
function selectGeographyBasedTarget(targets, orderData) {
    const orderRegion = orderData.region;
    const regionalTarget = targets.find(t => t.region === orderRegion);
    return regionalTarget || targets[0];
}
// ============================================================================
// UTILITY FUNCTIONS - MULTI-STEP APPROVALS
// ============================================================================
/**
 * Create approval request
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param stepId - Step ID
 * @param orderId - Order ID
 * @param approvers - List of approver user IDs
 * @param approvalLevel - Approval level
 * @param requestedBy - User ID requesting approval
 * @returns Created approval request
 *
 * @example
 * const request = await createApprovalRequest('wf-inst-123', 'step-1', 'ORD-001', ['user-1'], 1, 'system');
 */
async function createApprovalRequest(workflowInstanceId, stepId, orderId, approvers, approvalLevel, requestedBy) {
    try {
        const approval = await WorkflowApprovalRequest.create({
            workflowInstanceId,
            stepId,
            orderId,
            requestedBy,
            approvers,
            approvalLevel,
            decision: ApprovalDecision.PENDING,
            requestedAt: new Date(),
        });
        await emitWorkflowEvent({
            eventId: crypto.randomUUID(),
            eventType: WorkflowEvent.APPROVAL_REQUESTED,
            workflowInstanceId,
            stepId,
            orderId,
            timestamp: new Date(),
            payload: { approvalId: approval.approvalId, approvers, approvalLevel },
        });
        return approval;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create approval request: ${error.message}`);
    }
}
/**
 * Process approval decision
 *
 * @param approvalId - Approval ID
 * @param decision - Approval decision
 * @param decidedBy - User ID making decision
 * @param comments - Optional comments
 * @returns Updated approval request
 *
 * @example
 * const approval = await processApprovalDecision('appr-123', ApprovalDecision.APPROVED, 'user-1', 'Approved');
 */
async function processApprovalDecision(approvalId, decision, decidedBy, comments) {
    try {
        const approval = await WorkflowApprovalRequest.findByPk(approvalId);
        if (!approval) {
            throw new common_1.NotFoundException(`Approval request not found: ${approvalId}`);
        }
        if (approval.decision !== ApprovalDecision.PENDING) {
            throw new common_1.ConflictException(`Approval already decided: ${approvalId}`);
        }
        await approval.update({
            decision,
            decidedBy,
            decidedAt: new Date(),
            comments,
        });
        const eventType = decision === ApprovalDecision.APPROVED
            ? WorkflowEvent.APPROVAL_GRANTED
            : WorkflowEvent.APPROVAL_REJECTED;
        await emitWorkflowEvent({
            eventId: crypto.randomUUID(),
            eventType,
            workflowInstanceId: approval.workflowInstanceId,
            stepId: approval.stepId,
            orderId: approval.orderId,
            timestamp: new Date(),
            payload: { approvalId, decision, decidedBy, comments },
        });
        return approval;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to process approval decision: ${error.message}`);
    }
}
/**
 * Escalate approval to higher level
 *
 * @param approvalId - Approval ID
 * @param escalatedTo - User IDs to escalate to
 * @param reason - Escalation reason
 * @returns Updated approval request
 *
 * @example
 * const approval = await escalateApproval('appr-123', ['manager-1'], 'Requires higher approval');
 */
async function escalateApproval(approvalId, escalatedTo, reason) {
    try {
        const approval = await WorkflowApprovalRequest.findByPk(approvalId);
        if (!approval) {
            throw new common_1.NotFoundException(`Approval request not found: ${approvalId}`);
        }
        await approval.update({
            approvers: escalatedTo,
            approvalLevel: approval.approvalLevel + 1,
            metadata: { ...approval.metadata, escalationReason: reason },
        });
        return approval;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to escalate approval: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - INTEGRATION ORCHESTRATION
// ============================================================================
/**
 * Call external integration
 *
 * @param integrationCall - Integration call configuration
 * @param workflowInstanceId - Workflow instance ID
 * @returns Integration response
 *
 * @example
 * const response = await callExternalIntegration(callConfig, 'wf-inst-123');
 */
async function callExternalIntegration(integrationCall, workflowInstanceId) {
    const startTime = Date.now();
    try {
        await emitWorkflowEvent({
            eventId: crypto.randomUUID(),
            eventType: WorkflowEvent.INTEGRATION_CALLED,
            workflowInstanceId,
            orderId: '',
            timestamp: new Date(),
            payload: { integrationId: integrationCall.integrationId, endpoint: integrationCall.endpoint },
        });
        // Simulate HTTP call - in production use actual HTTP client
        const response = {
            integrationId: integrationCall.integrationId,
            statusCode: 200,
            body: { success: true },
            headers: {},
            duration: Date.now() - startTime,
            timestamp: new Date(),
        };
        await emitWorkflowEvent({
            eventId: crypto.randomUUID(),
            eventType: WorkflowEvent.INTEGRATION_RESPONSE,
            workflowInstanceId,
            orderId: '',
            timestamp: new Date(),
            payload: { integrationId: integrationCall.integrationId, statusCode: response.statusCode },
        });
        return response;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to call external integration: ${error.message}`);
    }
}
/**
 * Orchestrate multiple integrations
 *
 * @param integrationCalls - Array of integration calls
 * @param workflowInstanceId - Workflow instance ID
 * @param executionMode - Sequential or parallel
 * @returns Array of integration responses
 *
 * @example
 * const responses = await orchestrateIntegrations(calls, 'wf-inst-123', ExecutionMode.PARALLEL);
 */
async function orchestrateIntegrations(integrationCalls, workflowInstanceId, executionMode = ExecutionMode.SEQUENTIAL) {
    try {
        if (executionMode === ExecutionMode.PARALLEL) {
            const promises = integrationCalls.map(call => callExternalIntegration(call, workflowInstanceId));
            return await Promise.all(promises);
        }
        else {
            const responses = [];
            for (const call of integrationCalls) {
                const response = await callExternalIntegration(call, workflowInstanceId);
                responses.push(response);
            }
            return responses;
        }
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to orchestrate integrations: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - EVENT-DRIVEN TRIGGERS
// ============================================================================
/**
 * Emit workflow event
 *
 * @param event - Workflow event data
 * @returns Created event log
 *
 * @example
 * await emitWorkflowEvent({ eventType: WorkflowEvent.STEP_STARTED, ... });
 */
async function emitWorkflowEvent(event) {
    try {
        const eventLog = await WorkflowEventLog.create({
            eventId: event.eventId,
            workflowInstanceId: event.workflowInstanceId,
            eventType: event.eventType,
            stepId: event.stepId,
            orderId: event.orderId,
            payload: event.payload,
            correlationId: event.correlationId,
            timestamp: event.timestamp,
        });
        return eventLog;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to emit workflow event: ${error.message}`);
    }
}
/**
 * Subscribe to workflow events
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param eventTypes - Event types to subscribe to
 * @param callback - Callback function for events
 * @returns Subscription ID
 *
 * @example
 * const subId = subscribeToWorkflowEvents('wf-inst-123', [WorkflowEvent.STEP_COMPLETED], handler);
 */
function subscribeToWorkflowEvents(workflowInstanceId, eventTypes, callback) {
    // Implementation would use event emitter or message queue
    // This is a placeholder showing the pattern
    const subscriptionId = crypto.randomUUID();
    return subscriptionId;
}
/**
 * Trigger workflow based on external event
 *
 * @param eventType - External event type
 * @param eventData - Event data
 * @param workflowDefinition - Workflow to trigger
 * @param userId - User ID
 * @returns Created workflow instance
 *
 * @example
 * const instance = await triggerWorkflowFromEvent('ORDER_CREATED', data, definition, 'user-123');
 */
async function triggerWorkflowFromEvent(eventType, eventData, workflowDefinition, userId) {
    try {
        const orderId = eventData.orderId;
        const instance = await initializeWorkflow(workflowDefinition, orderId, userId, eventData);
        await startWorkflowExecution(instance.workflowInstanceId, workflowDefinition);
        return instance;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to trigger workflow from event: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - WORKFLOW MONITORING
// ============================================================================
/**
 * Get workflow execution metrics
 *
 * @param workflowId - Workflow ID
 * @param startDate - Start date for metrics
 * @param endDate - End date for metrics
 * @returns Workflow metrics
 *
 * @example
 * const metrics = await getWorkflowMetrics('workflow-1', startDate, endDate);
 */
async function getWorkflowMetrics(workflowId, startDate, endDate) {
    try {
        const instances = await WorkflowInstance.findAll({
            where: {
                workflowId,
                startedAt: { $between: [startDate, endDate] },
            },
        });
        const totalExecutions = instances.length;
        const successfulExecutions = instances.filter(i => i.status === WorkflowStatus.COMPLETED).length;
        const failedExecutions = instances.filter(i => i.status === WorkflowStatus.FAILED).length;
        const durations = instances
            .filter(i => i.duration)
            .map(i => i.duration);
        const metrics = {
            workflowId,
            totalExecutions,
            successfulExecutions,
            failedExecutions,
            averageDuration: durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0,
            minDuration: durations.length > 0 ? Math.min(...durations) : 0,
            maxDuration: durations.length > 0 ? Math.max(...durations) : 0,
            errorRate: totalExecutions > 0 ? failedExecutions / totalExecutions : 0,
            lastExecutedAt: instances.length > 0 ? instances[0].startedAt : undefined,
        };
        return metrics;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to get workflow metrics: ${error.message}`);
    }
}
/**
 * Monitor workflow execution in real-time
 *
 * @param workflowInstanceId - Workflow instance ID
 * @returns Current workflow status and progress
 *
 * @example
 * const status = await monitorWorkflowExecution('wf-inst-123');
 */
async function monitorWorkflowExecution(workflowInstanceId) {
    try {
        const instance = await WorkflowInstance.findByPk(workflowInstanceId, {
            include: [
                { model: WorkflowStepExecution, as: 'stepExecutions' },
                { model: WorkflowEventLog, as: 'events', limit: 10, order: [['timestamp', 'DESC']] },
            ],
        });
        if (!instance) {
            throw new common_1.NotFoundException(`Workflow instance not found: ${workflowInstanceId}`);
        }
        const completedSteps = instance.stepExecutions.filter(s => s.status === StepStatus.COMPLETED || s.status === StepStatus.SKIPPED).length;
        const totalSteps = instance.stepExecutions.length;
        const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
        return {
            instance,
            stepExecutions: instance.stepExecutions,
            recentEvents: instance.events,
            progress,
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to monitor workflow execution: ${error.message}`);
    }
}
/**
 * Get workflow execution history
 *
 * @param orderId - Order ID
 * @returns Array of workflow instances for order
 *
 * @example
 * const history = await getWorkflowExecutionHistory('ORD-001');
 */
async function getWorkflowExecutionHistory(orderId) {
    try {
        const instances = await WorkflowInstance.findAll({
            where: { orderId },
            include: [
                { model: WorkflowStepExecution, as: 'stepExecutions' },
                { model: WorkflowEventLog, as: 'events' },
            ],
            order: [['startedAt', 'DESC']],
        });
        return instances;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to get workflow execution history: ${error.message}`);
    }
}
/**
 * Detect workflow timeout
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param timeoutMs - Timeout in milliseconds
 * @returns Boolean indicating if workflow timed out
 *
 * @example
 * const timedOut = await detectWorkflowTimeout('wf-inst-123', 300000);
 */
async function detectWorkflowTimeout(workflowInstanceId, timeoutMs) {
    try {
        const instance = await WorkflowInstance.findByPk(workflowInstanceId);
        if (!instance) {
            throw new common_1.NotFoundException(`Workflow instance not found: ${workflowInstanceId}`);
        }
        if (!instance.startedAt || instance.status === WorkflowStatus.COMPLETED) {
            return false;
        }
        const elapsed = Date.now() - instance.startedAt.getTime();
        const timedOut = elapsed > timeoutMs;
        if (timedOut && instance.status === WorkflowStatus.RUNNING) {
            await instance.update({ status: WorkflowStatus.TIMEOUT });
            await emitWorkflowEvent({
                eventId: crypto.randomUUID(),
                eventType: WorkflowEvent.TIMEOUT_TRIGGERED,
                workflowInstanceId,
                orderId: instance.orderId,
                timestamp: new Date(),
                payload: { elapsed, timeout: timeoutMs },
            });
        }
        return timedOut;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to detect workflow timeout: ${error.message}`);
    }
}
//# sourceMappingURL=order-orchestration-workflow-kit.js.map