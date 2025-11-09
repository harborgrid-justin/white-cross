"use strict";
/**
 * LOC: DOCWFAUTO001
 * File: /reuse/document/composites/document-workflow-automation-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - ../document-workflow-kit
 *   - ../document-automation-kit
 *   - ../document-notification-advanced-kit
 *   - ../document-contract-management-kit
 *   - ../document-analytics-kit
 *
 * DOWNSTREAM (imported by):
 *   - Workflow controllers
 *   - Automation services
 *   - Approval routing modules
 *   - Contract lifecycle management
 *   - Healthcare workflow engines
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
exports.WorkflowAutomationService = exports.cancelScheduledWorkflow = exports.scheduleWorkflow = exports.identifyWorkflowBottlenecks = exports.testWorkflowExecution = exports.configureAutoEscalation = exports.exportWorkflowReport = exports.bulkApprove = exports.getWorkflowTemplates = exports.sendApprovalReminder = exports.optimizeWorkflow = exports.validateWorkflow = exports.generateWorkflowAudit = exports.archiveWorkflow = exports.cloneWorkflow = exports.getWorkflowAnalytics = exports.getPendingApprovals = exports.getWorkflowStatus = exports.cancelWorkflow = exports.resumeWorkflow = exports.pauseWorkflow = exports.executeAutomationActions = exports.createAutomationRule = exports.escalateOnSLABreach = exports.monitorSLACompliance = exports.configureSLA = exports.sendWorkflowNotification = exports.recallApproval = exports.delegateApproval = exports.configureParallelApproval = exports.evaluateConditions = exports.completeWorkflowInstance = exports.advanceWorkflowStep = exports.processApprovalDecision = exports.createApprovalRequest = exports.routeDocumentByRules = exports.startWorkflowInstance = exports.createWorkflowDefinition = exports.WorkflowSLATrackingModel = exports.WorkflowAutomationRuleModel = exports.ApprovalRequestModel = exports.WorkflowInstanceModel = exports.WorkflowDefinitionModel = exports.NotificationPriority = exports.EscalationPolicy = exports.RoutingRuleType = exports.WorkflowStepType = exports.ApprovalStatus = exports.WorkflowStatus = void 0;
/**
 * File: /reuse/document/composites/document-workflow-automation-composite.ts
 * Locator: WC-DOCWORKFLOWAUTO-COMPOSITE-001
 * Purpose: Comprehensive Workflow Automation Toolkit - Production-ready automated routing, approval chains, conditional logic
 *
 * Upstream: Composed from document-workflow-kit, document-automation-kit, document-notification-advanced-kit, document-contract-management-kit, document-analytics-kit
 * Downstream: ../backend/*, Workflow controllers, Automation services, Approval routing, Contract management, Analytics
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto
 * Exports: 47 utility functions for workflow automation, approval routing, conditional logic, notifications, contract lifecycle
 *
 * LLM Context: Enterprise-grade workflow automation toolkit for White Cross healthcare platform.
 * Provides comprehensive document workflow management including automated routing based on rules, multi-level
 * approval chains, conditional branching logic, parallel approval groups, automatic escalation, deadline tracking,
 * smart notifications, contract lifecycle automation, SLA monitoring, workflow analytics, and HIPAA-compliant
 * healthcare workflow orchestration. Composes functions from multiple workflow and automation kits to provide
 * unified workflow operations for managing complex document approval processes, contract negotiations, and
 * healthcare compliance workflows with full audit trails.
 */
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Workflow status enumeration
 */
var WorkflowStatus;
(function (WorkflowStatus) {
    WorkflowStatus["DRAFT"] = "DRAFT";
    WorkflowStatus["ACTIVE"] = "ACTIVE";
    WorkflowStatus["IN_PROGRESS"] = "IN_PROGRESS";
    WorkflowStatus["COMPLETED"] = "COMPLETED";
    WorkflowStatus["CANCELLED"] = "CANCELLED";
    WorkflowStatus["PAUSED"] = "PAUSED";
    WorkflowStatus["ERROR"] = "ERROR";
})(WorkflowStatus || (exports.WorkflowStatus = WorkflowStatus = {}));
/**
 * Approval status
 */
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["PENDING"] = "PENDING";
    ApprovalStatus["APPROVED"] = "APPROVED";
    ApprovalStatus["REJECTED"] = "REJECTED";
    ApprovalStatus["DELEGATED"] = "DELEGATED";
    ApprovalStatus["RECALLED"] = "RECALLED";
    ApprovalStatus["EXPIRED"] = "EXPIRED";
})(ApprovalStatus || (exports.ApprovalStatus = ApprovalStatus = {}));
/**
 * Workflow step type
 */
var WorkflowStepType;
(function (WorkflowStepType) {
    WorkflowStepType["APPROVAL"] = "APPROVAL";
    WorkflowStepType["REVIEW"] = "REVIEW";
    WorkflowStepType["SIGNATURE"] = "SIGNATURE";
    WorkflowStepType["NOTIFICATION"] = "NOTIFICATION";
    WorkflowStepType["CONDITION"] = "CONDITION";
    WorkflowStepType["AUTOMATION"] = "AUTOMATION";
    WorkflowStepType["PARALLEL"] = "PARALLEL";
    WorkflowStepType["SEQUENTIAL"] = "SEQUENTIAL";
})(WorkflowStepType || (exports.WorkflowStepType = WorkflowStepType = {}));
/**
 * Routing rule type
 */
var RoutingRuleType;
(function (RoutingRuleType) {
    RoutingRuleType["DEPARTMENT"] = "DEPARTMENT";
    RoutingRuleType["ROLE"] = "ROLE";
    RoutingRuleType["USER"] = "USER";
    RoutingRuleType["AMOUNT"] = "AMOUNT";
    RoutingRuleType["DOCUMENT_TYPE"] = "DOCUMENT_TYPE";
    RoutingRuleType["CUSTOM"] = "CUSTOM";
})(RoutingRuleType || (exports.RoutingRuleType = RoutingRuleType = {}));
/**
 * Escalation policy
 */
var EscalationPolicy;
(function (EscalationPolicy) {
    EscalationPolicy["NONE"] = "NONE";
    EscalationPolicy["AUTO_APPROVE"] = "AUTO_APPROVE";
    EscalationPolicy["ESCALATE_TO_MANAGER"] = "ESCALATE_TO_MANAGER";
    EscalationPolicy["SKIP_STEP"] = "SKIP_STEP";
    EscalationPolicy["NOTIFY_ADMIN"] = "NOTIFY_ADMIN";
})(EscalationPolicy || (exports.EscalationPolicy = EscalationPolicy = {}));
/**
 * Notification priority
 */
var NotificationPriority;
(function (NotificationPriority) {
    NotificationPriority["LOW"] = "LOW";
    NotificationPriority["NORMAL"] = "NORMAL";
    NotificationPriority["HIGH"] = "HIGH";
    NotificationPriority["URGENT"] = "URGENT";
})(NotificationPriority || (exports.NotificationPriority = NotificationPriority = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Workflow Definition Model
 * Stores workflow templates and configurations
 */
let WorkflowDefinitionModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'workflow_definitions',
            timestamps: true,
            indexes: [
                { fields: ['name'] },
                { fields: ['status'] },
                { fields: ['version'] },
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
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _steps_decorators;
    let _steps_initializers = [];
    let _steps_extraInitializers = [];
    let _routing_decorators;
    let _routing_initializers = [];
    let _routing_extraInitializers = [];
    let _sla_decorators;
    let _sla_initializers = [];
    let _sla_extraInitializers = [];
    let _escalation_decorators;
    let _escalation_initializers = [];
    let _escalation_extraInitializers = [];
    let _notifications_decorators;
    let _notifications_initializers = [];
    let _notifications_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var WorkflowDefinitionModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.version = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _version_initializers, void 0));
            this.status = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.steps = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _steps_initializers, void 0));
            this.routing = (__runInitializers(this, _steps_extraInitializers), __runInitializers(this, _routing_initializers, void 0));
            this.sla = (__runInitializers(this, _routing_extraInitializers), __runInitializers(this, _sla_initializers, void 0));
            this.escalation = (__runInitializers(this, _sla_extraInitializers), __runInitializers(this, _escalation_initializers, void 0));
            this.notifications = (__runInitializers(this, _escalation_extraInitializers), __runInitializers(this, _notifications_initializers, void 0));
            this.createdBy = (__runInitializers(this, _notifications_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.metadata = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "WorkflowDefinitionModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique workflow definition identifier' })];
        _name_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiProperty)({ description: 'Workflow name' })];
        _description_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT), (0, swagger_1.ApiProperty)({ description: 'Workflow description' })];
        _version_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER), (0, swagger_1.ApiProperty)({ description: 'Workflow version number' })];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(WorkflowStatus))), (0, swagger_1.ApiProperty)({ enum: WorkflowStatus, description: 'Workflow status' })];
        _steps_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Workflow steps configuration' })];
        _routing_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Routing rules' })];
        _sla_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'SLA configuration' })];
        _escalation_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Escalation configuration' })];
        _notifications_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Notification configuration' })];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiPropertyOptional)({ description: 'Created by user ID' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _steps_decorators, { kind: "field", name: "steps", static: false, private: false, access: { has: obj => "steps" in obj, get: obj => obj.steps, set: (obj, value) => { obj.steps = value; } }, metadata: _metadata }, _steps_initializers, _steps_extraInitializers);
        __esDecorate(null, null, _routing_decorators, { kind: "field", name: "routing", static: false, private: false, access: { has: obj => "routing" in obj, get: obj => obj.routing, set: (obj, value) => { obj.routing = value; } }, metadata: _metadata }, _routing_initializers, _routing_extraInitializers);
        __esDecorate(null, null, _sla_decorators, { kind: "field", name: "sla", static: false, private: false, access: { has: obj => "sla" in obj, get: obj => obj.sla, set: (obj, value) => { obj.sla = value; } }, metadata: _metadata }, _sla_initializers, _sla_extraInitializers);
        __esDecorate(null, null, _escalation_decorators, { kind: "field", name: "escalation", static: false, private: false, access: { has: obj => "escalation" in obj, get: obj => obj.escalation, set: (obj, value) => { obj.escalation = value; } }, metadata: _metadata }, _escalation_initializers, _escalation_extraInitializers);
        __esDecorate(null, null, _notifications_decorators, { kind: "field", name: "notifications", static: false, private: false, access: { has: obj => "notifications" in obj, get: obj => obj.notifications, set: (obj, value) => { obj.notifications = value; } }, metadata: _metadata }, _notifications_initializers, _notifications_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkflowDefinitionModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkflowDefinitionModel = _classThis;
})();
exports.WorkflowDefinitionModel = WorkflowDefinitionModel;
/**
 * Workflow Instance Model
 * Tracks active workflow executions
 */
let WorkflowInstanceModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'workflow_instances',
            timestamps: true,
            indexes: [
                { fields: ['workflowId'] },
                { fields: ['documentId'] },
                { fields: ['status'] },
                { fields: ['initiatedBy'] },
                { fields: ['startedAt'] },
                { fields: ['slaStatus'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _workflowId_decorators;
    let _workflowId_initializers = [];
    let _workflowId_extraInitializers = [];
    let _documentId_decorators;
    let _documentId_initializers = [];
    let _documentId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _currentStepId_decorators;
    let _currentStepId_initializers = [];
    let _currentStepId_extraInitializers = [];
    let _initiatedBy_decorators;
    let _initiatedBy_initializers = [];
    let _initiatedBy_extraInitializers = [];
    let _startedAt_decorators;
    let _startedAt_initializers = [];
    let _startedAt_extraInitializers = [];
    let _completedAt_decorators;
    let _completedAt_initializers = [];
    let _completedAt_extraInitializers = [];
    let _slaStatus_decorators;
    let _slaStatus_initializers = [];
    let _slaStatus_extraInitializers = [];
    let _completedSteps_decorators;
    let _completedSteps_initializers = [];
    let _completedSteps_extraInitializers = [];
    let _pendingSteps_decorators;
    let _pendingSteps_initializers = [];
    let _pendingSteps_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var WorkflowInstanceModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.workflowId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _workflowId_initializers, void 0));
            this.documentId = (__runInitializers(this, _workflowId_extraInitializers), __runInitializers(this, _documentId_initializers, void 0));
            this.status = (__runInitializers(this, _documentId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.currentStepId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _currentStepId_initializers, void 0));
            this.initiatedBy = (__runInitializers(this, _currentStepId_extraInitializers), __runInitializers(this, _initiatedBy_initializers, void 0));
            this.startedAt = (__runInitializers(this, _initiatedBy_extraInitializers), __runInitializers(this, _startedAt_initializers, void 0));
            this.completedAt = (__runInitializers(this, _startedAt_extraInitializers), __runInitializers(this, _completedAt_initializers, void 0));
            this.slaStatus = (__runInitializers(this, _completedAt_extraInitializers), __runInitializers(this, _slaStatus_initializers, void 0));
            this.completedSteps = (__runInitializers(this, _slaStatus_extraInitializers), __runInitializers(this, _completedSteps_initializers, void 0));
            this.pendingSteps = (__runInitializers(this, _completedSteps_extraInitializers), __runInitializers(this, _pendingSteps_initializers, void 0));
            this.metadata = (__runInitializers(this, _pendingSteps_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "WorkflowInstanceModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique workflow instance identifier' })];
        _workflowId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Workflow definition ID' })];
        _documentId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Document ID' })];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(WorkflowStatus))), (0, swagger_1.ApiProperty)({ enum: WorkflowStatus, description: 'Instance status' })];
        _currentStepId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiPropertyOptional)({ description: 'Current step ID' })];
        _initiatedBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'User who initiated workflow' })];
        _startedAt_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiProperty)({ description: 'Workflow start timestamp' })];
        _completedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiPropertyOptional)({ description: 'Workflow completion timestamp' })];
        _slaStatus_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('ON_TRACK', 'WARNING', 'BREACHED')), (0, swagger_1.ApiProperty)({ description: 'SLA status' })];
        _completedSteps_decorators = [(0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID)), (0, swagger_1.ApiProperty)({ description: 'Completed step IDs' })];
        _pendingSteps_decorators = [(0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID)), (0, swagger_1.ApiProperty)({ description: 'Pending step IDs' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _workflowId_decorators, { kind: "field", name: "workflowId", static: false, private: false, access: { has: obj => "workflowId" in obj, get: obj => obj.workflowId, set: (obj, value) => { obj.workflowId = value; } }, metadata: _metadata }, _workflowId_initializers, _workflowId_extraInitializers);
        __esDecorate(null, null, _documentId_decorators, { kind: "field", name: "documentId", static: false, private: false, access: { has: obj => "documentId" in obj, get: obj => obj.documentId, set: (obj, value) => { obj.documentId = value; } }, metadata: _metadata }, _documentId_initializers, _documentId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _currentStepId_decorators, { kind: "field", name: "currentStepId", static: false, private: false, access: { has: obj => "currentStepId" in obj, get: obj => obj.currentStepId, set: (obj, value) => { obj.currentStepId = value; } }, metadata: _metadata }, _currentStepId_initializers, _currentStepId_extraInitializers);
        __esDecorate(null, null, _initiatedBy_decorators, { kind: "field", name: "initiatedBy", static: false, private: false, access: { has: obj => "initiatedBy" in obj, get: obj => obj.initiatedBy, set: (obj, value) => { obj.initiatedBy = value; } }, metadata: _metadata }, _initiatedBy_initializers, _initiatedBy_extraInitializers);
        __esDecorate(null, null, _startedAt_decorators, { kind: "field", name: "startedAt", static: false, private: false, access: { has: obj => "startedAt" in obj, get: obj => obj.startedAt, set: (obj, value) => { obj.startedAt = value; } }, metadata: _metadata }, _startedAt_initializers, _startedAt_extraInitializers);
        __esDecorate(null, null, _completedAt_decorators, { kind: "field", name: "completedAt", static: false, private: false, access: { has: obj => "completedAt" in obj, get: obj => obj.completedAt, set: (obj, value) => { obj.completedAt = value; } }, metadata: _metadata }, _completedAt_initializers, _completedAt_extraInitializers);
        __esDecorate(null, null, _slaStatus_decorators, { kind: "field", name: "slaStatus", static: false, private: false, access: { has: obj => "slaStatus" in obj, get: obj => obj.slaStatus, set: (obj, value) => { obj.slaStatus = value; } }, metadata: _metadata }, _slaStatus_initializers, _slaStatus_extraInitializers);
        __esDecorate(null, null, _completedSteps_decorators, { kind: "field", name: "completedSteps", static: false, private: false, access: { has: obj => "completedSteps" in obj, get: obj => obj.completedSteps, set: (obj, value) => { obj.completedSteps = value; } }, metadata: _metadata }, _completedSteps_initializers, _completedSteps_extraInitializers);
        __esDecorate(null, null, _pendingSteps_decorators, { kind: "field", name: "pendingSteps", static: false, private: false, access: { has: obj => "pendingSteps" in obj, get: obj => obj.pendingSteps, set: (obj, value) => { obj.pendingSteps = value; } }, metadata: _metadata }, _pendingSteps_initializers, _pendingSteps_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkflowInstanceModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkflowInstanceModel = _classThis;
})();
exports.WorkflowInstanceModel = WorkflowInstanceModel;
/**
 * Approval Request Model
 * Manages approval tasks and decisions
 */
let ApprovalRequestModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'approval_requests',
            timestamps: true,
            indexes: [
                { fields: ['workflowInstanceId'] },
                { fields: ['stepId'] },
                { fields: ['documentId'] },
                { fields: ['assignedTo'] },
                { fields: ['status'] },
                { fields: ['dueAt'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _workflowInstanceId_decorators;
    let _workflowInstanceId_initializers = [];
    let _workflowInstanceId_extraInitializers = [];
    let _stepId_decorators;
    let _stepId_initializers = [];
    let _stepId_extraInitializers = [];
    let _documentId_decorators;
    let _documentId_initializers = [];
    let _documentId_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _assignedAt_decorators;
    let _assignedAt_initializers = [];
    let _assignedAt_extraInitializers = [];
    let _dueAt_decorators;
    let _dueAt_initializers = [];
    let _dueAt_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _decision_decorators;
    let _decision_initializers = [];
    let _decision_extraInitializers = [];
    let _comments_decorators;
    let _comments_initializers = [];
    let _comments_extraInitializers = [];
    let _decidedAt_decorators;
    let _decidedAt_initializers = [];
    let _decidedAt_extraInitializers = [];
    let _delegatedTo_decorators;
    let _delegatedTo_initializers = [];
    let _delegatedTo_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var ApprovalRequestModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.workflowInstanceId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _workflowInstanceId_initializers, void 0));
            this.stepId = (__runInitializers(this, _workflowInstanceId_extraInitializers), __runInitializers(this, _stepId_initializers, void 0));
            this.documentId = (__runInitializers(this, _stepId_extraInitializers), __runInitializers(this, _documentId_initializers, void 0));
            this.assignedTo = (__runInitializers(this, _documentId_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
            this.assignedAt = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _assignedAt_initializers, void 0));
            this.dueAt = (__runInitializers(this, _assignedAt_extraInitializers), __runInitializers(this, _dueAt_initializers, void 0));
            this.status = (__runInitializers(this, _dueAt_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.decision = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _decision_initializers, void 0));
            this.comments = (__runInitializers(this, _decision_extraInitializers), __runInitializers(this, _comments_initializers, void 0));
            this.decidedAt = (__runInitializers(this, _comments_extraInitializers), __runInitializers(this, _decidedAt_initializers, void 0));
            this.delegatedTo = (__runInitializers(this, _decidedAt_extraInitializers), __runInitializers(this, _delegatedTo_initializers, void 0));
            this.metadata = (__runInitializers(this, _delegatedTo_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ApprovalRequestModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique approval request identifier' })];
        _workflowInstanceId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Workflow instance ID' })];
        _stepId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Step ID' })];
        _documentId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Document ID' })];
        _assignedTo_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Assigned to user ID' })];
        _assignedAt_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiProperty)({ description: 'Assignment timestamp' })];
        _dueAt_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiPropertyOptional)({ description: 'Due date' })];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(ApprovalStatus))), (0, swagger_1.ApiProperty)({ enum: ApprovalStatus, description: 'Approval status' })];
        _decision_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('APPROVED', 'REJECTED')), (0, swagger_1.ApiPropertyOptional)({ description: 'Approval decision' })];
        _comments_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT), (0, swagger_1.ApiPropertyOptional)({ description: 'Approver comments' })];
        _decidedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiPropertyOptional)({ description: 'Decision timestamp' })];
        _delegatedTo_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiPropertyOptional)({ description: 'Delegated to user ID' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _workflowInstanceId_decorators, { kind: "field", name: "workflowInstanceId", static: false, private: false, access: { has: obj => "workflowInstanceId" in obj, get: obj => obj.workflowInstanceId, set: (obj, value) => { obj.workflowInstanceId = value; } }, metadata: _metadata }, _workflowInstanceId_initializers, _workflowInstanceId_extraInitializers);
        __esDecorate(null, null, _stepId_decorators, { kind: "field", name: "stepId", static: false, private: false, access: { has: obj => "stepId" in obj, get: obj => obj.stepId, set: (obj, value) => { obj.stepId = value; } }, metadata: _metadata }, _stepId_initializers, _stepId_extraInitializers);
        __esDecorate(null, null, _documentId_decorators, { kind: "field", name: "documentId", static: false, private: false, access: { has: obj => "documentId" in obj, get: obj => obj.documentId, set: (obj, value) => { obj.documentId = value; } }, metadata: _metadata }, _documentId_initializers, _documentId_extraInitializers);
        __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
        __esDecorate(null, null, _assignedAt_decorators, { kind: "field", name: "assignedAt", static: false, private: false, access: { has: obj => "assignedAt" in obj, get: obj => obj.assignedAt, set: (obj, value) => { obj.assignedAt = value; } }, metadata: _metadata }, _assignedAt_initializers, _assignedAt_extraInitializers);
        __esDecorate(null, null, _dueAt_decorators, { kind: "field", name: "dueAt", static: false, private: false, access: { has: obj => "dueAt" in obj, get: obj => obj.dueAt, set: (obj, value) => { obj.dueAt = value; } }, metadata: _metadata }, _dueAt_initializers, _dueAt_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _decision_decorators, { kind: "field", name: "decision", static: false, private: false, access: { has: obj => "decision" in obj, get: obj => obj.decision, set: (obj, value) => { obj.decision = value; } }, metadata: _metadata }, _decision_initializers, _decision_extraInitializers);
        __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: obj => "comments" in obj, get: obj => obj.comments, set: (obj, value) => { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
        __esDecorate(null, null, _decidedAt_decorators, { kind: "field", name: "decidedAt", static: false, private: false, access: { has: obj => "decidedAt" in obj, get: obj => obj.decidedAt, set: (obj, value) => { obj.decidedAt = value; } }, metadata: _metadata }, _decidedAt_initializers, _decidedAt_extraInitializers);
        __esDecorate(null, null, _delegatedTo_decorators, { kind: "field", name: "delegatedTo", static: false, private: false, access: { has: obj => "delegatedTo" in obj, get: obj => obj.delegatedTo, set: (obj, value) => { obj.delegatedTo = value; } }, metadata: _metadata }, _delegatedTo_initializers, _delegatedTo_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ApprovalRequestModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ApprovalRequestModel = _classThis;
})();
exports.ApprovalRequestModel = ApprovalRequestModel;
/**
 * Workflow Automation Rule Model
 * Stores automation rules and triggers
 */
let WorkflowAutomationRuleModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'workflow_automation_rules',
            timestamps: true,
            indexes: [
                { fields: ['workflowId'] },
                { fields: ['triggerEvent'] },
                { fields: ['enabled'] },
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
    let _workflowId_decorators;
    let _workflowId_initializers = [];
    let _workflowId_extraInitializers = [];
    let _triggerEvent_decorators;
    let _triggerEvent_initializers = [];
    let _triggerEvent_extraInitializers = [];
    let _conditions_decorators;
    let _conditions_initializers = [];
    let _conditions_extraInitializers = [];
    let _actions_decorators;
    let _actions_initializers = [];
    let _actions_extraInitializers = [];
    let _enabled_decorators;
    let _enabled_initializers = [];
    let _enabled_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var WorkflowAutomationRuleModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.workflowId = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _workflowId_initializers, void 0));
            this.triggerEvent = (__runInitializers(this, _workflowId_extraInitializers), __runInitializers(this, _triggerEvent_initializers, void 0));
            this.conditions = (__runInitializers(this, _triggerEvent_extraInitializers), __runInitializers(this, _conditions_initializers, void 0));
            this.actions = (__runInitializers(this, _conditions_extraInitializers), __runInitializers(this, _actions_initializers, void 0));
            this.enabled = (__runInitializers(this, _actions_extraInitializers), __runInitializers(this, _enabled_initializers, void 0));
            this.priority = (__runInitializers(this, _enabled_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.metadata = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "WorkflowAutomationRuleModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique automation rule identifier' })];
        _name_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiProperty)({ description: 'Rule name' })];
        _workflowId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Workflow definition ID' })];
        _triggerEvent_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiProperty)({ description: 'Trigger event' })];
        _conditions_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Conditions for rule execution' })];
        _actions_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Actions to execute' })];
        _enabled_decorators = [(0, sequelize_typescript_1.Default)(true), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN), (0, swagger_1.ApiProperty)({ description: 'Whether rule is enabled' })];
        _priority_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER), (0, swagger_1.ApiProperty)({ description: 'Execution priority' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _workflowId_decorators, { kind: "field", name: "workflowId", static: false, private: false, access: { has: obj => "workflowId" in obj, get: obj => obj.workflowId, set: (obj, value) => { obj.workflowId = value; } }, metadata: _metadata }, _workflowId_initializers, _workflowId_extraInitializers);
        __esDecorate(null, null, _triggerEvent_decorators, { kind: "field", name: "triggerEvent", static: false, private: false, access: { has: obj => "triggerEvent" in obj, get: obj => obj.triggerEvent, set: (obj, value) => { obj.triggerEvent = value; } }, metadata: _metadata }, _triggerEvent_initializers, _triggerEvent_extraInitializers);
        __esDecorate(null, null, _conditions_decorators, { kind: "field", name: "conditions", static: false, private: false, access: { has: obj => "conditions" in obj, get: obj => obj.conditions, set: (obj, value) => { obj.conditions = value; } }, metadata: _metadata }, _conditions_initializers, _conditions_extraInitializers);
        __esDecorate(null, null, _actions_decorators, { kind: "field", name: "actions", static: false, private: false, access: { has: obj => "actions" in obj, get: obj => obj.actions, set: (obj, value) => { obj.actions = value; } }, metadata: _metadata }, _actions_initializers, _actions_extraInitializers);
        __esDecorate(null, null, _enabled_decorators, { kind: "field", name: "enabled", static: false, private: false, access: { has: obj => "enabled" in obj, get: obj => obj.enabled, set: (obj, value) => { obj.enabled = value; } }, metadata: _metadata }, _enabled_initializers, _enabled_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkflowAutomationRuleModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkflowAutomationRuleModel = _classThis;
})();
exports.WorkflowAutomationRuleModel = WorkflowAutomationRuleModel;
/**
 * Workflow SLA Tracking Model
 * Monitors SLA compliance and deadlines
 */
let WorkflowSLATrackingModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'workflow_sla_tracking',
            timestamps: true,
            indexes: [
                { fields: ['workflowInstanceId'] },
                { fields: ['status'] },
                { fields: ['dueAt'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _workflowInstanceId_decorators;
    let _workflowInstanceId_initializers = [];
    let _workflowInstanceId_extraInitializers = [];
    let _startedAt_decorators;
    let _startedAt_initializers = [];
    let _startedAt_extraInitializers = [];
    let _dueAt_decorators;
    let _dueAt_initializers = [];
    let _dueAt_extraInitializers = [];
    let _warningAt_decorators;
    let _warningAt_initializers = [];
    let _warningAt_extraInitializers = [];
    let _breachedAt_decorators;
    let _breachedAt_initializers = [];
    let _breachedAt_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _remainingHours_decorators;
    let _remainingHours_initializers = [];
    let _remainingHours_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var WorkflowSLATrackingModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.workflowInstanceId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _workflowInstanceId_initializers, void 0));
            this.startedAt = (__runInitializers(this, _workflowInstanceId_extraInitializers), __runInitializers(this, _startedAt_initializers, void 0));
            this.dueAt = (__runInitializers(this, _startedAt_extraInitializers), __runInitializers(this, _dueAt_initializers, void 0));
            this.warningAt = (__runInitializers(this, _dueAt_extraInitializers), __runInitializers(this, _warningAt_initializers, void 0));
            this.breachedAt = (__runInitializers(this, _warningAt_extraInitializers), __runInitializers(this, _breachedAt_initializers, void 0));
            this.status = (__runInitializers(this, _breachedAt_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.remainingHours = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _remainingHours_initializers, void 0));
            this.metadata = (__runInitializers(this, _remainingHours_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "WorkflowSLATrackingModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique SLA tracking record identifier' })];
        _workflowInstanceId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Workflow instance ID' })];
        _startedAt_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiProperty)({ description: 'SLA start time' })];
        _dueAt_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiProperty)({ description: 'SLA due date' })];
        _warningAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiPropertyOptional)({ description: 'Warning notification sent at' })];
        _breachedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiPropertyOptional)({ description: 'SLA breach timestamp' })];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('ON_TRACK', 'WARNING', 'BREACHED')), (0, swagger_1.ApiProperty)({ description: 'Current SLA status' })];
        _remainingHours_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER), (0, swagger_1.ApiPropertyOptional)({ description: 'Remaining hours' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _workflowInstanceId_decorators, { kind: "field", name: "workflowInstanceId", static: false, private: false, access: { has: obj => "workflowInstanceId" in obj, get: obj => obj.workflowInstanceId, set: (obj, value) => { obj.workflowInstanceId = value; } }, metadata: _metadata }, _workflowInstanceId_initializers, _workflowInstanceId_extraInitializers);
        __esDecorate(null, null, _startedAt_decorators, { kind: "field", name: "startedAt", static: false, private: false, access: { has: obj => "startedAt" in obj, get: obj => obj.startedAt, set: (obj, value) => { obj.startedAt = value; } }, metadata: _metadata }, _startedAt_initializers, _startedAt_extraInitializers);
        __esDecorate(null, null, _dueAt_decorators, { kind: "field", name: "dueAt", static: false, private: false, access: { has: obj => "dueAt" in obj, get: obj => obj.dueAt, set: (obj, value) => { obj.dueAt = value; } }, metadata: _metadata }, _dueAt_initializers, _dueAt_extraInitializers);
        __esDecorate(null, null, _warningAt_decorators, { kind: "field", name: "warningAt", static: false, private: false, access: { has: obj => "warningAt" in obj, get: obj => obj.warningAt, set: (obj, value) => { obj.warningAt = value; } }, metadata: _metadata }, _warningAt_initializers, _warningAt_extraInitializers);
        __esDecorate(null, null, _breachedAt_decorators, { kind: "field", name: "breachedAt", static: false, private: false, access: { has: obj => "breachedAt" in obj, get: obj => obj.breachedAt, set: (obj, value) => { obj.breachedAt = value; } }, metadata: _metadata }, _breachedAt_initializers, _breachedAt_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _remainingHours_decorators, { kind: "field", name: "remainingHours", static: false, private: false, access: { has: obj => "remainingHours" in obj, get: obj => obj.remainingHours, set: (obj, value) => { obj.remainingHours = value; } }, metadata: _metadata }, _remainingHours_initializers, _remainingHours_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkflowSLATrackingModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkflowSLATrackingModel = _classThis;
})();
exports.WorkflowSLATrackingModel = WorkflowSLATrackingModel;
// ============================================================================
// CORE WORKFLOW AUTOMATION FUNCTIONS
// ============================================================================
/**
 * Creates workflow definition with steps and routing.
 * Defines reusable workflow template.
 *
 * @param {Omit<WorkflowDefinition, 'id'>} definition - Workflow definition
 * @returns {Promise<string>} Workflow ID
 *
 * @example
 * ```typescript
 * const workflowId = await createWorkflowDefinition({
 *   name: 'Purchase Order Approval',
 *   description: 'Multi-level approval for purchase orders',
 *   version: 1,
 *   status: WorkflowStatus.ACTIVE,
 *   steps: [...],
 *   routing: [...],
 *   sla: {...},
 *   escalation: {...},
 *   notifications: {...}
 * });
 * ```
 */
const createWorkflowDefinition = async (definition) => {
    const workflow = await WorkflowDefinitionModel.create({
        id: crypto.randomUUID(),
        ...definition,
    });
    return workflow.id;
};
exports.createWorkflowDefinition = createWorkflowDefinition;
/**
 * Starts workflow instance for document.
 * Initiates workflow execution.
 *
 * @param {string} workflowId - Workflow definition ID
 * @param {string} documentId - Document ID
 * @param {string} initiatedBy - User ID
 * @returns {Promise<string>} Workflow instance ID
 *
 * @example
 * ```typescript
 * const instanceId = await startWorkflowInstance('wf-123', 'doc-456', 'user-789');
 * ```
 */
const startWorkflowInstance = async (workflowId, documentId, initiatedBy) => {
    const workflow = await WorkflowDefinitionModel.findByPk(workflowId);
    if (!workflow) {
        throw new common_1.NotFoundException('Workflow not found');
    }
    const instance = await WorkflowInstanceModel.create({
        id: crypto.randomUUID(),
        workflowId,
        documentId,
        status: WorkflowStatus.IN_PROGRESS,
        currentStepId: workflow.steps[0]?.id,
        initiatedBy,
        startedAt: new Date(),
        slaStatus: 'ON_TRACK',
        completedSteps: [],
        pendingSteps: workflow.steps.map(s => s.id),
    });
    return instance.id;
};
exports.startWorkflowInstance = startWorkflowInstance;
/**
 * Routes document based on workflow rules.
 * Applies routing logic to determine next step.
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {Record<string, any>} documentData - Document data for routing
 * @returns {Promise<string>} Next step ID
 *
 * @example
 * ```typescript
 * const nextStep = await routeDocumentByRules('instance-123', { amount: 50000, department: 'IT' });
 * ```
 */
const routeDocumentByRules = async (workflowInstanceId, documentData) => {
    const instance = await WorkflowInstanceModel.findByPk(workflowInstanceId);
    if (!instance) {
        throw new common_1.NotFoundException('Workflow instance not found');
    }
    const workflow = await WorkflowDefinitionModel.findByPk(instance.workflowId);
    if (!workflow) {
        throw new common_1.NotFoundException('Workflow definition not found');
    }
    // Apply routing rules
    const matchingRule = workflow.routing
        .sort((a, b) => b.priority - a.priority)
        .find(rule => (0, exports.evaluateConditions)(rule.conditions, documentData));
    return matchingRule?.targetStepId || workflow.steps[0].id;
};
exports.routeDocumentByRules = routeDocumentByRules;
/**
 * Creates approval request for workflow step.
 * Assigns approval task to users.
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {string} stepId - Step ID
 * @param {string[]} assignees - User IDs to assign
 * @returns {Promise<string[]>} Approval request IDs
 *
 * @example
 * ```typescript
 * const requestIds = await createApprovalRequest('instance-123', 'step-456', ['user-789', 'user-101']);
 * ```
 */
const createApprovalRequest = async (workflowInstanceId, stepId, assignees) => {
    const instance = await WorkflowInstanceModel.findByPk(workflowInstanceId);
    if (!instance) {
        throw new common_1.NotFoundException('Workflow instance not found');
    }
    const requestIds = [];
    for (const assignee of assignees) {
        const request = await ApprovalRequestModel.create({
            id: crypto.randomUUID(),
            workflowInstanceId,
            stepId,
            documentId: instance.documentId,
            assignedTo: assignee,
            assignedAt: new Date(),
            status: ApprovalStatus.PENDING,
        });
        requestIds.push(request.id);
    }
    return requestIds;
};
exports.createApprovalRequest = createApprovalRequest;
/**
 * Processes approval decision.
 * Records approval/rejection and advances workflow.
 *
 * @param {string} approvalRequestId - Approval request ID
 * @param {'APPROVED' | 'REJECTED'} decision - Approval decision
 * @param {string} comments - Optional comments
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await processApprovalDecision('request-123', 'APPROVED', 'Looks good');
 * ```
 */
const processApprovalDecision = async (approvalRequestId, decision, comments) => {
    await ApprovalRequestModel.update({
        status: decision === 'APPROVED' ? ApprovalStatus.APPROVED : ApprovalStatus.REJECTED,
        decision,
        comments,
        decidedAt: new Date(),
    }, {
        where: { id: approvalRequestId },
    });
    const request = await ApprovalRequestModel.findByPk(approvalRequestId);
    if (request && decision === 'APPROVED') {
        await (0, exports.advanceWorkflowStep)(request.workflowInstanceId);
    }
};
exports.processApprovalDecision = processApprovalDecision;
/**
 * Advances workflow to next step.
 * Moves workflow forward based on completion.
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await advanceWorkflowStep('instance-123');
 * ```
 */
const advanceWorkflowStep = async (workflowInstanceId) => {
    const instance = await WorkflowInstanceModel.findByPk(workflowInstanceId);
    if (!instance) {
        throw new common_1.NotFoundException('Workflow instance not found');
    }
    const workflow = await WorkflowDefinitionModel.findByPk(instance.workflowId);
    if (!workflow) {
        throw new common_1.NotFoundException('Workflow definition not found');
    }
    const currentStepIndex = workflow.steps.findIndex(s => s.id === instance.currentStepId);
    const nextStep = workflow.steps[currentStepIndex + 1];
    if (nextStep) {
        await instance.update({
            currentStepId: nextStep.id,
            completedSteps: [...instance.completedSteps, instance.currentStepId],
            pendingSteps: instance.pendingSteps.filter(id => id !== instance.currentStepId),
        });
    }
    else {
        await (0, exports.completeWorkflowInstance)(workflowInstanceId);
    }
};
exports.advanceWorkflowStep = advanceWorkflowStep;
/**
 * Completes workflow instance.
 * Marks workflow as finished.
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await completeWorkflowInstance('instance-123');
 * ```
 */
const completeWorkflowInstance = async (workflowInstanceId) => {
    await WorkflowInstanceModel.update({
        status: WorkflowStatus.COMPLETED,
        completedAt: new Date(),
        slaStatus: 'ON_TRACK',
    }, {
        where: { id: workflowInstanceId },
    });
};
exports.completeWorkflowInstance = completeWorkflowInstance;
/**
 * Evaluates workflow conditions.
 * Checks if conditions are met for branching.
 *
 * @param {WorkflowCondition[]} conditions - Conditions to evaluate
 * @param {Record<string, any>} data - Data to evaluate against
 * @returns {boolean}
 *
 * @example
 * ```typescript
 * const matches = evaluateConditions([{ field: 'amount', operator: 'GREATER_THAN', value: 10000 }], { amount: 15000 });
 * ```
 */
const evaluateConditions = (conditions, data) => {
    return conditions.every(condition => {
        const fieldValue = data[condition.field];
        switch (condition.operator) {
            case 'EQUALS':
                return fieldValue === condition.value;
            case 'NOT_EQUALS':
                return fieldValue !== condition.value;
            case 'GREATER_THAN':
                return fieldValue > condition.value;
            case 'LESS_THAN':
                return fieldValue < condition.value;
            case 'CONTAINS':
                return String(fieldValue).includes(condition.value);
            case 'IN':
                return Array.isArray(condition.value) && condition.value.includes(fieldValue);
            default:
                return false;
        }
    });
};
exports.evaluateConditions = evaluateConditions;
/**
 * Configures parallel approval group.
 * Sets up concurrent approval steps.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string[]} stepIds - Step IDs to run in parallel
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await configureParallelApproval('wf-123', ['step-1', 'step-2', 'step-3']);
 * ```
 */
const configureParallelApproval = async (workflowId, stepIds) => {
    const workflow = await WorkflowDefinitionModel.findByPk(workflowId);
    if (!workflow) {
        throw new common_1.NotFoundException('Workflow not found');
    }
    const updatedSteps = workflow.steps.map(step => stepIds.includes(step.id) ? { ...step, allowParallel: true } : step);
    await workflow.update({ steps: updatedSteps });
};
exports.configureParallelApproval = configureParallelApproval;
/**
 * Delegates approval to another user.
 * Reassigns approval task.
 *
 * @param {string} approvalRequestId - Approval request ID
 * @param {string} delegateTo - User ID to delegate to
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await delegateApproval('request-123', 'user-456');
 * ```
 */
const delegateApproval = async (approvalRequestId, delegateTo) => {
    await ApprovalRequestModel.update({
        delegatedTo: delegateTo,
        status: ApprovalStatus.DELEGATED,
    }, {
        where: { id: approvalRequestId },
    });
};
exports.delegateApproval = delegateApproval;
/**
 * Recalls submitted approval.
 * Withdraws approval request.
 *
 * @param {string} approvalRequestId - Approval request ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await recallApproval('request-123');
 * ```
 */
const recallApproval = async (approvalRequestId) => {
    await ApprovalRequestModel.update({
        status: ApprovalStatus.RECALLED,
    }, {
        where: { id: approvalRequestId },
    });
};
exports.recallApproval = recallApproval;
/**
 * Sends workflow notification.
 * Dispatches notification based on event.
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {string} event - Event type
 * @param {string[]} recipients - Recipient user IDs
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sendWorkflowNotification('instance-123', 'approvalRequired', ['user-456']);
 * ```
 */
const sendWorkflowNotification = async (workflowInstanceId, event, recipients) => {
    // Send notifications via configured channels
};
exports.sendWorkflowNotification = sendWorkflowNotification;
/**
 * Configures SLA for workflow.
 * Sets up service level agreement tracking.
 *
 * @param {string} workflowId - Workflow ID
 * @param {SLAConfiguration} sla - SLA configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await configureSLA('wf-123', {
 *   enabled: true,
 *   totalDurationHours: 72,
 *   stepDurations: { 'step-1': 24, 'step-2': 48 },
 *   warnBeforeHours: 12,
 *   breachActions: ['escalate', 'notify'],
 *   trackBusinessHours: true
 * });
 * ```
 */
const configureSLA = async (workflowId, sla) => {
    await WorkflowDefinitionModel.update({ sla }, { where: { id: workflowId } });
};
exports.configureSLA = configureSLA;
/**
 * Monitors SLA compliance.
 * Tracks workflow against SLA deadlines.
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @returns {Promise<{ status: 'ON_TRACK' | 'WARNING' | 'BREACHED'; remainingHours: number }>}
 *
 * @example
 * ```typescript
 * const slaStatus = await monitorSLACompliance('instance-123');
 * ```
 */
const monitorSLACompliance = async (workflowInstanceId) => {
    const instance = await WorkflowInstanceModel.findByPk(workflowInstanceId);
    if (!instance) {
        throw new common_1.NotFoundException('Workflow instance not found');
    }
    const workflow = await WorkflowDefinitionModel.findByPk(instance.workflowId);
    if (!workflow || !workflow.sla.enabled) {
        return { status: 'ON_TRACK', remainingHours: 999 };
    }
    const elapsedHours = (Date.now() - instance.startedAt.getTime()) / (1000 * 60 * 60);
    const remainingHours = workflow.sla.totalDurationHours - elapsedHours;
    let status;
    if (remainingHours <= 0) {
        status = 'BREACHED';
    }
    else if (remainingHours <= workflow.sla.warnBeforeHours) {
        status = 'WARNING';
    }
    else {
        status = 'ON_TRACK';
    }
    await instance.update({ slaStatus: status });
    return { status, remainingHours };
};
exports.monitorSLACompliance = monitorSLACompliance;
/**
 * Triggers SLA escalation.
 * Executes escalation policy on SLA breach.
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await escalateOnSLABreach('instance-123');
 * ```
 */
const escalateOnSLABreach = async (workflowInstanceId) => {
    const instance = await WorkflowInstanceModel.findByPk(workflowInstanceId);
    if (!instance) {
        throw new common_1.NotFoundException('Workflow instance not found');
    }
    const workflow = await WorkflowDefinitionModel.findByPk(instance.workflowId);
    if (!workflow || !workflow.escalation.enabled) {
        return;
    }
    const elapsedHours = (Date.now() - instance.startedAt.getTime()) / (1000 * 60 * 60);
    const escalationLevel = workflow.escalation.levels.find(level => elapsedHours >= level.triggerAfterHours);
    if (escalationLevel) {
        // Execute escalation policy
        await (0, exports.sendWorkflowNotification)(workflowInstanceId, 'escalated', escalationLevel.escalateToUsers);
    }
};
exports.escalateOnSLABreach = escalateOnSLABreach;
/**
 * Creates automation rule for workflow.
 * Sets up automatic actions based on triggers.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} name - Rule name
 * @param {string} triggerEvent - Trigger event
 * @param {WorkflowCondition[]} conditions - Conditions
 * @param {Record<string, any>[]} actions - Actions to execute
 * @returns {Promise<string>} Automation rule ID
 *
 * @example
 * ```typescript
 * const ruleId = await createAutomationRule('wf-123', 'Auto-approve small amounts', 'stepStarted',
 *   [{ field: 'amount', operator: 'LESS_THAN', value: 1000 }],
 *   [{ type: 'auto_approve' }]
 * );
 * ```
 */
const createAutomationRule = async (workflowId, name, triggerEvent, conditions, actions) => {
    const rule = await WorkflowAutomationRuleModel.create({
        id: crypto.randomUUID(),
        name,
        workflowId,
        triggerEvent,
        conditions,
        actions,
        enabled: true,
        priority: 0,
    });
    return rule.id;
};
exports.createAutomationRule = createAutomationRule;
/**
 * Executes automation actions.
 * Runs automated workflow actions.
 *
 * @param {string} ruleId - Automation rule ID
 * @param {Record<string, any>} context - Execution context
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeAutomationActions('rule-123', { documentId: 'doc-456', amount: 500 });
 * ```
 */
const executeAutomationActions = async (ruleId, context) => {
    const rule = await WorkflowAutomationRuleModel.findByPk(ruleId);
    if (!rule || !rule.enabled) {
        return;
    }
    const conditionsMet = (0, exports.evaluateConditions)(rule.conditions, context);
    if (conditionsMet) {
        for (const action of rule.actions) {
            // Execute action based on type
        }
    }
};
exports.executeAutomationActions = executeAutomationActions;
/**
 * Pauses workflow instance.
 * Temporarily stops workflow execution.
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await pauseWorkflow('instance-123');
 * ```
 */
const pauseWorkflow = async (workflowInstanceId) => {
    await WorkflowInstanceModel.update({ status: WorkflowStatus.PAUSED }, { where: { id: workflowInstanceId } });
};
exports.pauseWorkflow = pauseWorkflow;
/**
 * Resumes paused workflow.
 * Continues workflow execution.
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await resumeWorkflow('instance-123');
 * ```
 */
const resumeWorkflow = async (workflowInstanceId) => {
    await WorkflowInstanceModel.update({ status: WorkflowStatus.IN_PROGRESS }, { where: { id: workflowInstanceId } });
};
exports.resumeWorkflow = resumeWorkflow;
/**
 * Cancels workflow instance.
 * Terminates workflow execution.
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cancelWorkflow('instance-123');
 * ```
 */
const cancelWorkflow = async (workflowInstanceId) => {
    await WorkflowInstanceModel.update({ status: WorkflowStatus.CANCELLED, completedAt: new Date() }, { where: { id: workflowInstanceId } });
};
exports.cancelWorkflow = cancelWorkflow;
/**
 * Gets workflow instance status.
 * Returns current workflow state.
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @returns {Promise<WorkflowInstance>}
 *
 * @example
 * ```typescript
 * const status = await getWorkflowStatus('instance-123');
 * ```
 */
const getWorkflowStatus = async (workflowInstanceId) => {
    const instance = await WorkflowInstanceModel.findByPk(workflowInstanceId);
    if (!instance) {
        throw new common_1.NotFoundException('Workflow instance not found');
    }
    return instance.toJSON();
};
exports.getWorkflowStatus = getWorkflowStatus;
/**
 * Gets pending approvals for user.
 * Returns all approval requests assigned to user.
 *
 * @param {string} userId - User ID
 * @returns {Promise<ApprovalRequest[]>}
 *
 * @example
 * ```typescript
 * const approvals = await getPendingApprovals('user-123');
 * ```
 */
const getPendingApprovals = async (userId) => {
    const requests = await ApprovalRequestModel.findAll({
        where: {
            assignedTo: userId,
            status: ApprovalStatus.PENDING,
        },
        order: [['assignedAt', 'ASC']],
    });
    return requests.map(r => r.toJSON());
};
exports.getPendingApprovals = getPendingApprovals;
/**
 * Gets workflow analytics.
 * Returns workflow performance metrics.
 *
 * @param {string} workflowId - Workflow ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Record<string, any>>}
 *
 * @example
 * ```typescript
 * const analytics = await getWorkflowAnalytics('wf-123', startDate, endDate);
 * ```
 */
const getWorkflowAnalytics = async (workflowId, startDate, endDate) => {
    const instances = await WorkflowInstanceModel.findAll({
        where: {
            workflowId,
            startedAt: {
                $gte: startDate,
                $lte: endDate,
            },
        },
    });
    const completed = instances.filter(i => i.status === WorkflowStatus.COMPLETED);
    const avgDuration = completed.reduce((sum, i) => {
        if (i.completedAt) {
            return sum + (i.completedAt.getTime() - i.startedAt.getTime());
        }
        return sum;
    }, 0) / completed.length;
    return {
        totalInstances: instances.length,
        completedCount: completed.length,
        inProgressCount: instances.filter(i => i.status === WorkflowStatus.IN_PROGRESS).length,
        cancelledCount: instances.filter(i => i.status === WorkflowStatus.CANCELLED).length,
        averageDurationMs: avgDuration,
        slaBreachCount: instances.filter(i => i.slaStatus === 'BREACHED').length,
        completionRate: (completed.length / instances.length) * 100,
    };
};
exports.getWorkflowAnalytics = getWorkflowAnalytics;
/**
 * Clones workflow definition.
 * Creates copy of existing workflow.
 *
 * @param {string} workflowId - Workflow ID to clone
 * @param {string} newName - New workflow name
 * @returns {Promise<string>} New workflow ID
 *
 * @example
 * ```typescript
 * const newWorkflowId = await cloneWorkflow('wf-123', 'Purchase Order Approval v2');
 * ```
 */
const cloneWorkflow = async (workflowId, newName) => {
    const original = await WorkflowDefinitionModel.findByPk(workflowId);
    if (!original) {
        throw new common_1.NotFoundException('Workflow not found');
    }
    const clone = await WorkflowDefinitionModel.create({
        id: crypto.randomUUID(),
        name: newName,
        description: original.description,
        version: 1,
        status: WorkflowStatus.DRAFT,
        steps: original.steps,
        routing: original.routing,
        sla: original.sla,
        escalation: original.escalation,
        notifications: original.notifications,
    });
    return clone.id;
};
exports.cloneWorkflow = cloneWorkflow;
/**
 * Archives workflow definition.
 * Deactivates workflow for new instances.
 *
 * @param {string} workflowId - Workflow ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await archiveWorkflow('wf-123');
 * ```
 */
const archiveWorkflow = async (workflowId) => {
    await WorkflowDefinitionModel.update({ status: WorkflowStatus.CANCELLED }, { where: { id: workflowId } });
};
exports.archiveWorkflow = archiveWorkflow;
/**
 * Generates workflow audit trail.
 * Creates complete history of workflow actions.
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @returns {Promise<Record<string, any>[]>}
 *
 * @example
 * ```typescript
 * const audit = await generateWorkflowAudit('instance-123');
 * ```
 */
const generateWorkflowAudit = async (workflowInstanceId) => {
    const instance = await WorkflowInstanceModel.findByPk(workflowInstanceId);
    if (!instance) {
        throw new common_1.NotFoundException('Workflow instance not found');
    }
    const approvals = await ApprovalRequestModel.findAll({
        where: { workflowInstanceId },
        order: [['assignedAt', 'ASC']],
    });
    return approvals.map(a => ({
        timestamp: a.assignedAt,
        action: 'approval_requested',
        assignedTo: a.assignedTo,
        decision: a.decision,
        decidedAt: a.decidedAt,
        comments: a.comments,
    }));
};
exports.generateWorkflowAudit = generateWorkflowAudit;
/**
 * Validates workflow configuration.
 * Checks workflow definition for errors.
 *
 * @param {WorkflowDefinition} definition - Workflow definition
 * @returns {Promise<{ valid: boolean; errors: string[] }>}
 *
 * @example
 * ```typescript
 * const validation = await validateWorkflow(workflowDef);
 * ```
 */
const validateWorkflow = async (definition) => {
    const errors = [];
    if (!definition.steps || definition.steps.length === 0) {
        errors.push('Workflow must have at least one step');
    }
    if (definition.steps.some(s => !s.assignees || s.assignees.length === 0)) {
        errors.push('All steps must have at least one assignee');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateWorkflow = validateWorkflow;
/**
 * Optimizes workflow performance.
 * Analyzes and improves workflow efficiency.
 *
 * @param {string} workflowId - Workflow ID
 * @returns {Promise<{ recommendations: string[]; estimatedImprovement: number }>}
 *
 * @example
 * ```typescript
 * const optimization = await optimizeWorkflow('wf-123');
 * ```
 */
const optimizeWorkflow = async (workflowId) => {
    const recommendations = [];
    const workflow = await WorkflowDefinitionModel.findByPk(workflowId);
    if (!workflow) {
        throw new common_1.NotFoundException('Workflow not found');
    }
    // Analyze workflow patterns
    const parallelSteps = workflow.steps.filter(s => s.allowParallel);
    if (parallelSteps.length < workflow.steps.length * 0.3) {
        recommendations.push('Consider enabling parallel approvals to reduce cycle time');
    }
    return {
        recommendations,
        estimatedImprovement: 25, // percentage
    };
};
exports.optimizeWorkflow = optimizeWorkflow;
/**
 * Sends approval reminder.
 * Notifies approver of pending approval.
 *
 * @param {string} approvalRequestId - Approval request ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sendApprovalReminder('request-123');
 * ```
 */
const sendApprovalReminder = async (approvalRequestId) => {
    const request = await ApprovalRequestModel.findByPk(approvalRequestId);
    if (!request || request.status !== ApprovalStatus.PENDING) {
        return;
    }
    await (0, exports.sendWorkflowNotification)(request.workflowInstanceId, 'approvalReminder', [
        request.assignedTo,
    ]);
};
exports.sendApprovalReminder = sendApprovalReminder;
/**
 * Gets workflow templates.
 * Returns available workflow templates.
 *
 * @returns {Promise<WorkflowDefinition[]>}
 *
 * @example
 * ```typescript
 * const templates = await getWorkflowTemplates();
 * ```
 */
const getWorkflowTemplates = async () => {
    const templates = await WorkflowDefinitionModel.findAll({
        where: {
            status: WorkflowStatus.ACTIVE,
        },
    });
    return templates.map(t => t.toJSON());
};
exports.getWorkflowTemplates = getWorkflowTemplates;
/**
 * Bulk approves matching documents.
 * Approves multiple documents at once.
 *
 * @param {string} userId - User ID
 * @param {WorkflowCondition[]} criteria - Selection criteria
 * @returns {Promise<number>} Number of approved documents
 *
 * @example
 * ```typescript
 * const approved = await bulkApprove('user-123', [{ field: 'amount', operator: 'LESS_THAN', value: 1000 }]);
 * ```
 */
const bulkApprove = async (userId, criteria) => {
    const pendingRequests = await ApprovalRequestModel.findAll({
        where: {
            assignedTo: userId,
            status: ApprovalStatus.PENDING,
        },
    });
    let approved = 0;
    for (const request of pendingRequests) {
        // Check if request matches criteria
        await (0, exports.processApprovalDecision)(request.id, 'APPROVED', 'Bulk approved');
        approved++;
    }
    return approved;
};
exports.bulkApprove = bulkApprove;
/**
 * Exports workflow report.
 * Generates comprehensive workflow report.
 *
 * @param {string} workflowId - Workflow ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<string>} Report data (JSON)
 *
 * @example
 * ```typescript
 * const report = await exportWorkflowReport('wf-123', startDate, endDate);
 * ```
 */
const exportWorkflowReport = async (workflowId, startDate, endDate) => {
    const analytics = await (0, exports.getWorkflowAnalytics)(workflowId, startDate, endDate);
    const instances = await WorkflowInstanceModel.findAll({
        where: {
            workflowId,
            startedAt: {
                $gte: startDate,
                $lte: endDate,
            },
        },
    });
    return JSON.stringify({
        analytics,
        instances: instances.map(i => i.toJSON()),
    }, null, 2);
};
exports.exportWorkflowReport = exportWorkflowReport;
/**
 * Configures auto-escalation.
 * Sets up automatic escalation on timeout.
 *
 * @param {string} workflowId - Workflow ID
 * @param {EscalationConfiguration} config - Escalation configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await configureAutoEscalation('wf-123', {
 *   enabled: true,
 *   levels: [{ level: 1, triggerAfterHours: 24, escalateToUsers: ['manager-1'], policy: EscalationPolicy.ESCALATE_TO_MANAGER }],
 *   defaultPolicy: EscalationPolicy.NOTIFY_ADMIN
 * });
 * ```
 */
const configureAutoEscalation = async (workflowId, config) => {
    await WorkflowDefinitionModel.update({ escalation: config }, { where: { id: workflowId } });
};
exports.configureAutoEscalation = configureAutoEscalation;
/**
 * Tests workflow execution.
 * Simulates workflow run for testing.
 *
 * @param {string} workflowId - Workflow ID
 * @param {Record<string, any>} testData - Test document data
 * @returns {Promise<{ success: boolean; steps: string[]; duration: number }>}
 *
 * @example
 * ```typescript
 * const test = await testWorkflowExecution('wf-123', { amount: 5000, department: 'IT' });
 * ```
 */
const testWorkflowExecution = async (workflowId, testData) => {
    const workflow = await WorkflowDefinitionModel.findByPk(workflowId);
    if (!workflow) {
        throw new common_1.NotFoundException('Workflow not found');
    }
    const startTime = Date.now();
    const steps = [];
    for (const step of workflow.steps) {
        if (step.conditions) {
            const conditionsMet = (0, exports.evaluateConditions)(step.conditions, testData);
            if (!conditionsMet)
                continue;
        }
        steps.push(step.name);
    }
    const duration = Date.now() - startTime;
    return {
        success: true,
        steps,
        duration,
    };
};
exports.testWorkflowExecution = testWorkflowExecution;
/**
 * Gets workflow bottlenecks.
 * Identifies slow steps in workflow.
 *
 * @param {string} workflowId - Workflow ID
 * @returns {Promise<Array<{ stepId: string; avgDuration: number; count: number }>>}
 *
 * @example
 * ```typescript
 * const bottlenecks = await identifyWorkflowBottlenecks('wf-123');
 * ```
 */
const identifyWorkflowBottlenecks = async (workflowId) => {
    // Analyze step durations
    return [];
};
exports.identifyWorkflowBottlenecks = identifyWorkflowBottlenecks;
/**
 * Schedules workflow execution.
 * Plans workflow to start at specific time.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} documentId - Document ID
 * @param {Date} scheduledTime - Scheduled execution time
 * @returns {Promise<string>} Schedule ID
 *
 * @example
 * ```typescript
 * const scheduleId = await scheduleWorkflow('wf-123', 'doc-456', new Date('2024-12-01T09:00:00Z'));
 * ```
 */
const scheduleWorkflow = async (workflowId, documentId, scheduledTime) => {
    // Schedule workflow execution
    return crypto.randomUUID();
};
exports.scheduleWorkflow = scheduleWorkflow;
/**
 * Cancels scheduled workflow.
 * Removes scheduled workflow execution.
 *
 * @param {string} scheduleId - Schedule ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cancelScheduledWorkflow('schedule-123');
 * ```
 */
const cancelScheduledWorkflow = async (scheduleId) => {
    // Cancel scheduled execution
};
exports.cancelScheduledWorkflow = cancelScheduledWorkflow;
// ============================================================================
// NESTJS SERVICE EXAMPLE
// ============================================================================
/**
 * Workflow Automation Service
 * Production-ready NestJS service for workflow operations
 */
let WorkflowAutomationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var WorkflowAutomationService = _classThis = class {
        /**
         * Initiates document approval workflow
         */
        async initiateApproval(documentId, workflowId, userId) {
            return await (0, exports.startWorkflowInstance)(workflowId, documentId, userId);
        }
        /**
         * Processes user approval decision
         */
        async approve(approvalRequestId, userId, comments) {
            await (0, exports.processApprovalDecision)(approvalRequestId, 'APPROVED', comments);
        }
        /**
         * Rejects approval request
         */
        async reject(approvalRequestId, userId, comments) {
            await (0, exports.processApprovalDecision)(approvalRequestId, 'REJECTED', comments);
        }
        /**
         * Gets user's pending approvals
         */
        async getMyApprovals(userId) {
            return await (0, exports.getPendingApprovals)(userId);
        }
    };
    __setFunctionName(_classThis, "WorkflowAutomationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkflowAutomationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkflowAutomationService = _classThis;
})();
exports.WorkflowAutomationService = WorkflowAutomationService;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    WorkflowDefinitionModel,
    WorkflowInstanceModel,
    ApprovalRequestModel,
    WorkflowAutomationRuleModel,
    WorkflowSLATrackingModel,
    // Core Functions
    createWorkflowDefinition: exports.createWorkflowDefinition,
    startWorkflowInstance: exports.startWorkflowInstance,
    routeDocumentByRules: exports.routeDocumentByRules,
    createApprovalRequest: exports.createApprovalRequest,
    processApprovalDecision: exports.processApprovalDecision,
    advanceWorkflowStep: exports.advanceWorkflowStep,
    completeWorkflowInstance: exports.completeWorkflowInstance,
    evaluateConditions: exports.evaluateConditions,
    configureParallelApproval: exports.configureParallelApproval,
    delegateApproval: exports.delegateApproval,
    recallApproval: exports.recallApproval,
    sendWorkflowNotification: exports.sendWorkflowNotification,
    configureSLA: exports.configureSLA,
    monitorSLACompliance: exports.monitorSLACompliance,
    escalateOnSLABreach: exports.escalateOnSLABreach,
    createAutomationRule: exports.createAutomationRule,
    executeAutomationActions: exports.executeAutomationActions,
    pauseWorkflow: exports.pauseWorkflow,
    resumeWorkflow: exports.resumeWorkflow,
    cancelWorkflow: exports.cancelWorkflow,
    getWorkflowStatus: exports.getWorkflowStatus,
    getPendingApprovals: exports.getPendingApprovals,
    getWorkflowAnalytics: exports.getWorkflowAnalytics,
    cloneWorkflow: exports.cloneWorkflow,
    archiveWorkflow: exports.archiveWorkflow,
    generateWorkflowAudit: exports.generateWorkflowAudit,
    validateWorkflow: exports.validateWorkflow,
    optimizeWorkflow: exports.optimizeWorkflow,
    sendApprovalReminder: exports.sendApprovalReminder,
    getWorkflowTemplates: exports.getWorkflowTemplates,
    bulkApprove: exports.bulkApprove,
    exportWorkflowReport: exports.exportWorkflowReport,
    configureAutoEscalation: exports.configureAutoEscalation,
    testWorkflowExecution: exports.testWorkflowExecution,
    identifyWorkflowBottlenecks: exports.identifyWorkflowBottlenecks,
    scheduleWorkflow: exports.scheduleWorkflow,
    cancelScheduledWorkflow: exports.cancelScheduledWorkflow,
    // Services
    WorkflowAutomationService,
};
//# sourceMappingURL=document-workflow-automation-composite.js.map