"use strict";
/**
 * LOC: LEGAL_PROJECT_MANAGEMENT_KIT_001
 * File: /reuse/legal/legal-project-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize-typescript
 *   - sequelize
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *
 * DOWNSTREAM (imported by):
 *   - Legal project modules
 *   - Matter management controllers
 *   - Project tracking services
 *   - Resource allocation services
 *   - Budget management services
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
exports.LegalProjectManagementModule = exports.LegalProjectManagementService = exports.ProjectTemplateModel = exports.StatusReportModel = exports.MatterBudgetModel = exports.ResourceAllocationModel = exports.MilestoneModel = exports.ProjectTaskModel = exports.LegalMatterModel = exports.CreateStatusReportDto = exports.UpdateBudgetDto = exports.CreateBudgetDto = exports.UpdateResourceAllocationDto = exports.CreateResourceAllocationDto = exports.UpdateMilestoneDto = exports.CreateMilestoneDto = exports.UpdateTaskDto = exports.CreateTaskDto = exports.UpdateMatterDto = exports.CreateMatterDto = exports.CreateStatusReportSchema = exports.UpdateBudgetSchema = exports.CreateBudgetSchema = exports.UpdateResourceAllocationSchema = exports.CreateResourceAllocationSchema = exports.UpdateMilestoneSchema = exports.CreateMilestoneSchema = exports.UpdateTaskSchema = exports.CreateTaskSchema = exports.UpdateMatterSchema = exports.CreateMatterSchema = exports.RiskLevel = exports.ReportType = exports.ExpenseType = exports.BudgetStatus = exports.ResourceAllocationStatus = exports.MilestoneStatus = exports.TaskPriority = exports.TaskStatus = exports.MatterType = exports.MatterPriority = exports.MatterStatus = void 0;
const common_1 = require("@nestjs/common");
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Matter status lifecycle
 */
var MatterStatus;
(function (MatterStatus) {
    MatterStatus["PROSPECTIVE"] = "prospective";
    MatterStatus["INTAKE"] = "intake";
    MatterStatus["OPEN"] = "open";
    MatterStatus["ACTIVE"] = "active";
    MatterStatus["ON_HOLD"] = "on_hold";
    MatterStatus["PENDING_CLOSE"] = "pending_close";
    MatterStatus["CLOSED"] = "closed";
    MatterStatus["ARCHIVED"] = "archived";
    MatterStatus["DECLINED"] = "declined";
})(MatterStatus || (exports.MatterStatus = MatterStatus = {}));
/**
 * Matter priority levels
 */
var MatterPriority;
(function (MatterPriority) {
    MatterPriority["LOW"] = "low";
    MatterPriority["MEDIUM"] = "medium";
    MatterPriority["HIGH"] = "high";
    MatterPriority["URGENT"] = "urgent";
    MatterPriority["CRITICAL"] = "critical";
})(MatterPriority || (exports.MatterPriority = MatterPriority = {}));
/**
 * Matter types
 */
var MatterType;
(function (MatterType) {
    MatterType["LITIGATION"] = "litigation";
    MatterType["TRANSACTIONAL"] = "transactional";
    MatterType["ADVISORY"] = "advisory";
    MatterType["COMPLIANCE"] = "compliance";
    MatterType["CORPORATE"] = "corporate";
    MatterType["REAL_ESTATE"] = "real_estate";
    MatterType["INTELLECTUAL_PROPERTY"] = "intellectual_property";
    MatterType["EMPLOYMENT"] = "employment";
    MatterType["MEDICAL_MALPRACTICE"] = "medical_malpractice";
    MatterType["REGULATORY"] = "regulatory";
    MatterType["OTHER"] = "other";
})(MatterType || (exports.MatterType = MatterType = {}));
/**
 * Task status lifecycle
 */
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["NOT_STARTED"] = "not_started";
    TaskStatus["IN_PROGRESS"] = "in_progress";
    TaskStatus["ON_HOLD"] = "on_hold";
    TaskStatus["BLOCKED"] = "blocked";
    TaskStatus["PENDING_REVIEW"] = "pending_review";
    TaskStatus["COMPLETED"] = "completed";
    TaskStatus["CANCELLED"] = "cancelled";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
/**
 * Task priority levels
 */
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["LOW"] = "low";
    TaskPriority["MEDIUM"] = "medium";
    TaskPriority["HIGH"] = "high";
    TaskPriority["URGENT"] = "urgent";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
/**
 * Milestone status
 */
var MilestoneStatus;
(function (MilestoneStatus) {
    MilestoneStatus["PENDING"] = "pending";
    MilestoneStatus["IN_PROGRESS"] = "in_progress";
    MilestoneStatus["COMPLETED"] = "completed";
    MilestoneStatus["DELAYED"] = "delayed";
    MilestoneStatus["AT_RISK"] = "at_risk";
    MilestoneStatus["MISSED"] = "missed";
})(MilestoneStatus || (exports.MilestoneStatus = MilestoneStatus = {}));
/**
 * Resource allocation status
 */
var ResourceAllocationStatus;
(function (ResourceAllocationStatus) {
    ResourceAllocationStatus["REQUESTED"] = "requested";
    ResourceAllocationStatus["APPROVED"] = "approved";
    ResourceAllocationStatus["ACTIVE"] = "active";
    ResourceAllocationStatus["COMPLETED"] = "completed";
    ResourceAllocationStatus["CANCELLED"] = "cancelled";
})(ResourceAllocationStatus || (exports.ResourceAllocationStatus = ResourceAllocationStatus = {}));
/**
 * Budget status
 */
var BudgetStatus;
(function (BudgetStatus) {
    BudgetStatus["DRAFT"] = "draft";
    BudgetStatus["PROPOSED"] = "proposed";
    BudgetStatus["APPROVED"] = "approved";
    BudgetStatus["ACTIVE"] = "active";
    BudgetStatus["EXCEEDED"] = "exceeded";
    BudgetStatus["CLOSED"] = "closed";
})(BudgetStatus || (exports.BudgetStatus = BudgetStatus = {}));
/**
 * Expense type
 */
var ExpenseType;
(function (ExpenseType) {
    ExpenseType["LABOR"] = "labor";
    ExpenseType["EXPERT_WITNESS"] = "expert_witness";
    ExpenseType["COURT_COSTS"] = "court_costs";
    ExpenseType["FILING_FEES"] = "filing_fees";
    ExpenseType["TRAVEL"] = "travel";
    ExpenseType["RESEARCH"] = "research";
    ExpenseType["TECHNOLOGY"] = "technology";
    ExpenseType["VENDOR"] = "vendor";
    ExpenseType["OTHER"] = "other";
})(ExpenseType || (exports.ExpenseType = ExpenseType = {}));
/**
 * Report type
 */
var ReportType;
(function (ReportType) {
    ReportType["STATUS"] = "status";
    ReportType["BUDGET_VARIANCE"] = "budget_variance";
    ReportType["RESOURCE_UTILIZATION"] = "resource_utilization";
    ReportType["MILESTONE_PROGRESS"] = "milestone_progress";
    ReportType["TASK_COMPLETION"] = "task_completion";
    ReportType["RISK_SUMMARY"] = "risk_summary";
    ReportType["EXECUTIVE_SUMMARY"] = "executive_summary";
})(ReportType || (exports.ReportType = ReportType = {}));
/**
 * Risk level
 */
var RiskLevel;
(function (RiskLevel) {
    RiskLevel["LOW"] = "low";
    RiskLevel["MEDIUM"] = "medium";
    RiskLevel["HIGH"] = "high";
    RiskLevel["CRITICAL"] = "critical";
})(RiskLevel || (exports.RiskLevel = RiskLevel = {}));
// ============================================================================
// ZOD SCHEMAS
// ============================================================================
exports.CreateMatterSchema = zod_1.z.object({
    matterNumber: zod_1.z.string().optional(),
    title: zod_1.z.string().min(1).max(500),
    description: zod_1.z.string(),
    matterType: zod_1.z.nativeEnum(MatterType),
    priority: zod_1.z.nativeEnum(MatterPriority).default(MatterPriority.MEDIUM),
    clientId: zod_1.z.string().uuid(),
    responsibleAttorneyId: zod_1.z.string().uuid(),
    practiceAreaId: zod_1.z.string().uuid().optional(),
    openDate: zod_1.z.coerce.date().default(() => new Date()),
    targetCloseDate: zod_1.z.coerce.date().optional(),
    budgetAmount: zod_1.z.number().positive().optional(),
    estimatedHours: zod_1.z.number().positive().optional(),
    currency: zod_1.z.string().default('USD'),
    billingArrangement: zod_1.z.string().optional(),
    objectives: zod_1.z.array(zod_1.z.string()).optional(),
    scope: zod_1.z.string().optional(),
    constraints: zod_1.z.array(zod_1.z.string()).optional(),
    assumptions: zod_1.z.array(zod_1.z.string()).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).default({}),
});
exports.UpdateMatterSchema = exports.CreateMatterSchema.partial();
exports.CreateTaskSchema = zod_1.z.object({
    matterId: zod_1.z.string().uuid(),
    title: zod_1.z.string().min(1).max(500),
    description: zod_1.z.string().optional(),
    status: zod_1.z.nativeEnum(TaskStatus).default(TaskStatus.NOT_STARTED),
    priority: zod_1.z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
    assignedToId: zod_1.z.string().uuid().optional(),
    parentTaskId: zod_1.z.string().uuid().optional(),
    startDate: zod_1.z.coerce.date().optional(),
    dueDate: zod_1.z.coerce.date().optional(),
    estimatedHours: zod_1.z.number().positive().optional(),
    dependencies: zod_1.z.array(zod_1.z.string().uuid()).optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).default({}),
});
exports.UpdateTaskSchema = exports.CreateTaskSchema.partial();
exports.CreateMilestoneSchema = zod_1.z.object({
    matterId: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1).max(500),
    description: zod_1.z.string().optional(),
    targetDate: zod_1.z.coerce.date(),
    deliverables: zod_1.z.array(zod_1.z.string()).optional(),
    dependencies: zod_1.z.array(zod_1.z.string().uuid()).optional(),
    criticalPath: zod_1.z.boolean().default(false),
    ownerId: zod_1.z.string().uuid().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).default({}),
});
exports.UpdateMilestoneSchema = exports.CreateMilestoneSchema.partial();
exports.CreateResourceAllocationSchema = zod_1.z.object({
    matterId: zod_1.z.string().uuid(),
    resourceId: zod_1.z.string().uuid(),
    resourceType: zod_1.z.enum(['attorney', 'paralegal', 'staff', 'expert', 'vendor']),
    roleOnMatter: zod_1.z.string(),
    allocationPercentage: zod_1.z.number().min(0).max(100).optional(),
    startDate: zod_1.z.coerce.date(),
    endDate: zod_1.z.coerce.date().optional(),
    estimatedHours: zod_1.z.number().positive().optional(),
    billableRate: zod_1.z.number().nonnegative().optional(),
    costRate: zod_1.z.number().nonnegative().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).default({}),
});
exports.UpdateResourceAllocationSchema = exports.CreateResourceAllocationSchema.partial();
exports.CreateBudgetSchema = zod_1.z.object({
    matterId: zod_1.z.string().uuid(),
    budgetType: zod_1.z.enum(['overall', 'phase', 'task', 'category']),
    totalBudget: zod_1.z.number().positive(),
    laborBudget: zod_1.z.number().nonnegative().optional(),
    expenseBudget: zod_1.z.number().nonnegative().optional(),
    currency: zod_1.z.string().default('USD'),
    periodStart: zod_1.z.coerce.date().optional(),
    periodEnd: zod_1.z.coerce.date().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).default({}),
});
exports.UpdateBudgetSchema = exports.CreateBudgetSchema.partial();
exports.CreateStatusReportSchema = zod_1.z.object({
    matterId: zod_1.z.string().uuid(),
    reportType: zod_1.z.nativeEnum(ReportType),
    periodStart: zod_1.z.coerce.date(),
    periodEnd: zod_1.z.coerce.date(),
    summary: zod_1.z.string(),
    accomplishments: zod_1.z.array(zod_1.z.string()).optional(),
    upcomingTasks: zod_1.z.array(zod_1.z.string()).optional(),
    issues: zod_1.z.array(zod_1.z.string()).optional(),
    recommendations: zod_1.z.array(zod_1.z.string()).optional(),
    recipientIds: zod_1.z.array(zod_1.z.string().uuid()).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).default({}),
});
// ============================================================================
// DTOs WITH SWAGGER DECORATORS
// ============================================================================
let CreateMatterDto = (() => {
    var _a;
    let _matterNumber_decorators;
    let _matterNumber_initializers = [];
    let _matterNumber_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _matterType_decorators;
    let _matterType_initializers = [];
    let _matterType_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _clientId_decorators;
    let _clientId_initializers = [];
    let _clientId_extraInitializers = [];
    let _responsibleAttorneyId_decorators;
    let _responsibleAttorneyId_initializers = [];
    let _responsibleAttorneyId_extraInitializers = [];
    let _practiceAreaId_decorators;
    let _practiceAreaId_initializers = [];
    let _practiceAreaId_extraInitializers = [];
    let _openDate_decorators;
    let _openDate_initializers = [];
    let _openDate_extraInitializers = [];
    let _targetCloseDate_decorators;
    let _targetCloseDate_initializers = [];
    let _targetCloseDate_extraInitializers = [];
    let _budgetAmount_decorators;
    let _budgetAmount_initializers = [];
    let _budgetAmount_extraInitializers = [];
    let _estimatedHours_decorators;
    let _estimatedHours_initializers = [];
    let _estimatedHours_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _billingArrangement_decorators;
    let _billingArrangement_initializers = [];
    let _billingArrangement_extraInitializers = [];
    let _objectives_decorators;
    let _objectives_initializers = [];
    let _objectives_extraInitializers = [];
    let _scope_decorators;
    let _scope_initializers = [];
    let _scope_extraInitializers = [];
    let _constraints_decorators;
    let _constraints_initializers = [];
    let _constraints_extraInitializers = [];
    let _assumptions_decorators;
    let _assumptions_initializers = [];
    let _assumptions_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateMatterDto {
            constructor() {
                this.matterNumber = __runInitializers(this, _matterNumber_initializers, void 0);
                this.title = (__runInitializers(this, _matterNumber_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.matterType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _matterType_initializers, void 0));
                this.priority = (__runInitializers(this, _matterType_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.clientId = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _clientId_initializers, void 0));
                this.responsibleAttorneyId = (__runInitializers(this, _clientId_extraInitializers), __runInitializers(this, _responsibleAttorneyId_initializers, void 0));
                this.practiceAreaId = (__runInitializers(this, _responsibleAttorneyId_extraInitializers), __runInitializers(this, _practiceAreaId_initializers, void 0));
                this.openDate = (__runInitializers(this, _practiceAreaId_extraInitializers), __runInitializers(this, _openDate_initializers, void 0));
                this.targetCloseDate = (__runInitializers(this, _openDate_extraInitializers), __runInitializers(this, _targetCloseDate_initializers, void 0));
                this.budgetAmount = (__runInitializers(this, _targetCloseDate_extraInitializers), __runInitializers(this, _budgetAmount_initializers, void 0));
                this.estimatedHours = (__runInitializers(this, _budgetAmount_extraInitializers), __runInitializers(this, _estimatedHours_initializers, void 0));
                this.currency = (__runInitializers(this, _estimatedHours_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                this.billingArrangement = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _billingArrangement_initializers, void 0));
                this.objectives = (__runInitializers(this, _billingArrangement_extraInitializers), __runInitializers(this, _objectives_initializers, void 0));
                this.scope = (__runInitializers(this, _objectives_extraInitializers), __runInitializers(this, _scope_initializers, void 0));
                this.constraints = (__runInitializers(this, _scope_extraInitializers), __runInitializers(this, _constraints_initializers, void 0));
                this.assumptions = (__runInitializers(this, _constraints_extraInitializers), __runInitializers(this, _assumptions_initializers, void 0));
                this.metadata = (__runInitializers(this, _assumptions_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _matterNumber_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Matter number (auto-generated if not provided)' })];
            _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Matter title' })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Matter description' })];
            _matterType_decorators = [(0, swagger_1.ApiProperty)({ enum: MatterType, description: 'Type of matter' })];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ enum: MatterPriority, default: MatterPriority.MEDIUM })];
            _clientId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Client UUID' })];
            _responsibleAttorneyId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Responsible attorney UUID' })];
            _practiceAreaId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Practice area UUID' })];
            _openDate_decorators = [(0, swagger_1.ApiProperty)({ type: Date, default: () => new Date() })];
            _targetCloseDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: Date })];
            _budgetAmount_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Budget amount' })];
            _estimatedHours_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Estimated hours' })];
            _currency_decorators = [(0, swagger_1.ApiProperty)({ default: 'USD' })];
            _billingArrangement_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Billing arrangement description' })];
            _objectives_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Matter objectives' })];
            _scope_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Matter scope' })];
            _constraints_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Constraints' })];
            _assumptions_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Assumptions' })];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: Object })];
            __esDecorate(null, null, _matterNumber_decorators, { kind: "field", name: "matterNumber", static: false, private: false, access: { has: obj => "matterNumber" in obj, get: obj => obj.matterNumber, set: (obj, value) => { obj.matterNumber = value; } }, metadata: _metadata }, _matterNumber_initializers, _matterNumber_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _matterType_decorators, { kind: "field", name: "matterType", static: false, private: false, access: { has: obj => "matterType" in obj, get: obj => obj.matterType, set: (obj, value) => { obj.matterType = value; } }, metadata: _metadata }, _matterType_initializers, _matterType_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _clientId_decorators, { kind: "field", name: "clientId", static: false, private: false, access: { has: obj => "clientId" in obj, get: obj => obj.clientId, set: (obj, value) => { obj.clientId = value; } }, metadata: _metadata }, _clientId_initializers, _clientId_extraInitializers);
            __esDecorate(null, null, _responsibleAttorneyId_decorators, { kind: "field", name: "responsibleAttorneyId", static: false, private: false, access: { has: obj => "responsibleAttorneyId" in obj, get: obj => obj.responsibleAttorneyId, set: (obj, value) => { obj.responsibleAttorneyId = value; } }, metadata: _metadata }, _responsibleAttorneyId_initializers, _responsibleAttorneyId_extraInitializers);
            __esDecorate(null, null, _practiceAreaId_decorators, { kind: "field", name: "practiceAreaId", static: false, private: false, access: { has: obj => "practiceAreaId" in obj, get: obj => obj.practiceAreaId, set: (obj, value) => { obj.practiceAreaId = value; } }, metadata: _metadata }, _practiceAreaId_initializers, _practiceAreaId_extraInitializers);
            __esDecorate(null, null, _openDate_decorators, { kind: "field", name: "openDate", static: false, private: false, access: { has: obj => "openDate" in obj, get: obj => obj.openDate, set: (obj, value) => { obj.openDate = value; } }, metadata: _metadata }, _openDate_initializers, _openDate_extraInitializers);
            __esDecorate(null, null, _targetCloseDate_decorators, { kind: "field", name: "targetCloseDate", static: false, private: false, access: { has: obj => "targetCloseDate" in obj, get: obj => obj.targetCloseDate, set: (obj, value) => { obj.targetCloseDate = value; } }, metadata: _metadata }, _targetCloseDate_initializers, _targetCloseDate_extraInitializers);
            __esDecorate(null, null, _budgetAmount_decorators, { kind: "field", name: "budgetAmount", static: false, private: false, access: { has: obj => "budgetAmount" in obj, get: obj => obj.budgetAmount, set: (obj, value) => { obj.budgetAmount = value; } }, metadata: _metadata }, _budgetAmount_initializers, _budgetAmount_extraInitializers);
            __esDecorate(null, null, _estimatedHours_decorators, { kind: "field", name: "estimatedHours", static: false, private: false, access: { has: obj => "estimatedHours" in obj, get: obj => obj.estimatedHours, set: (obj, value) => { obj.estimatedHours = value; } }, metadata: _metadata }, _estimatedHours_initializers, _estimatedHours_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _billingArrangement_decorators, { kind: "field", name: "billingArrangement", static: false, private: false, access: { has: obj => "billingArrangement" in obj, get: obj => obj.billingArrangement, set: (obj, value) => { obj.billingArrangement = value; } }, metadata: _metadata }, _billingArrangement_initializers, _billingArrangement_extraInitializers);
            __esDecorate(null, null, _objectives_decorators, { kind: "field", name: "objectives", static: false, private: false, access: { has: obj => "objectives" in obj, get: obj => obj.objectives, set: (obj, value) => { obj.objectives = value; } }, metadata: _metadata }, _objectives_initializers, _objectives_extraInitializers);
            __esDecorate(null, null, _scope_decorators, { kind: "field", name: "scope", static: false, private: false, access: { has: obj => "scope" in obj, get: obj => obj.scope, set: (obj, value) => { obj.scope = value; } }, metadata: _metadata }, _scope_initializers, _scope_extraInitializers);
            __esDecorate(null, null, _constraints_decorators, { kind: "field", name: "constraints", static: false, private: false, access: { has: obj => "constraints" in obj, get: obj => obj.constraints, set: (obj, value) => { obj.constraints = value; } }, metadata: _metadata }, _constraints_initializers, _constraints_extraInitializers);
            __esDecorate(null, null, _assumptions_decorators, { kind: "field", name: "assumptions", static: false, private: false, access: { has: obj => "assumptions" in obj, get: obj => obj.assumptions, set: (obj, value) => { obj.assumptions = value; } }, metadata: _metadata }, _assumptions_initializers, _assumptions_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateMatterDto = CreateMatterDto;
let UpdateMatterDto = (() => {
    var _a;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _matterType_decorators;
    let _matterType_initializers = [];
    let _matterType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _responsibleAttorneyId_decorators;
    let _responsibleAttorneyId_initializers = [];
    let _responsibleAttorneyId_extraInitializers = [];
    let _targetCloseDate_decorators;
    let _targetCloseDate_initializers = [];
    let _targetCloseDate_extraInitializers = [];
    let _budgetAmount_decorators;
    let _budgetAmount_initializers = [];
    let _budgetAmount_extraInitializers = [];
    let _estimatedHours_decorators;
    let _estimatedHours_initializers = [];
    let _estimatedHours_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class UpdateMatterDto {
            constructor() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.matterType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _matterType_initializers, void 0));
                this.status = (__runInitializers(this, _matterType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.priority = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.responsibleAttorneyId = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _responsibleAttorneyId_initializers, void 0));
                this.targetCloseDate = (__runInitializers(this, _responsibleAttorneyId_extraInitializers), __runInitializers(this, _targetCloseDate_initializers, void 0));
                this.budgetAmount = (__runInitializers(this, _targetCloseDate_extraInitializers), __runInitializers(this, _budgetAmount_initializers, void 0));
                this.estimatedHours = (__runInitializers(this, _budgetAmount_extraInitializers), __runInitializers(this, _estimatedHours_initializers, void 0));
                this.metadata = (__runInitializers(this, _estimatedHours_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _matterType_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: MatterType })];
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: MatterStatus })];
            _priority_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: MatterPriority })];
            _responsibleAttorneyId_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _targetCloseDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: Date })];
            _budgetAmount_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _estimatedHours_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: Object })];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _matterType_decorators, { kind: "field", name: "matterType", static: false, private: false, access: { has: obj => "matterType" in obj, get: obj => obj.matterType, set: (obj, value) => { obj.matterType = value; } }, metadata: _metadata }, _matterType_initializers, _matterType_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _responsibleAttorneyId_decorators, { kind: "field", name: "responsibleAttorneyId", static: false, private: false, access: { has: obj => "responsibleAttorneyId" in obj, get: obj => obj.responsibleAttorneyId, set: (obj, value) => { obj.responsibleAttorneyId = value; } }, metadata: _metadata }, _responsibleAttorneyId_initializers, _responsibleAttorneyId_extraInitializers);
            __esDecorate(null, null, _targetCloseDate_decorators, { kind: "field", name: "targetCloseDate", static: false, private: false, access: { has: obj => "targetCloseDate" in obj, get: obj => obj.targetCloseDate, set: (obj, value) => { obj.targetCloseDate = value; } }, metadata: _metadata }, _targetCloseDate_initializers, _targetCloseDate_extraInitializers);
            __esDecorate(null, null, _budgetAmount_decorators, { kind: "field", name: "budgetAmount", static: false, private: false, access: { has: obj => "budgetAmount" in obj, get: obj => obj.budgetAmount, set: (obj, value) => { obj.budgetAmount = value; } }, metadata: _metadata }, _budgetAmount_initializers, _budgetAmount_extraInitializers);
            __esDecorate(null, null, _estimatedHours_decorators, { kind: "field", name: "estimatedHours", static: false, private: false, access: { has: obj => "estimatedHours" in obj, get: obj => obj.estimatedHours, set: (obj, value) => { obj.estimatedHours = value; } }, metadata: _metadata }, _estimatedHours_initializers, _estimatedHours_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateMatterDto = UpdateMatterDto;
let CreateTaskDto = (() => {
    var _a;
    let _matterId_decorators;
    let _matterId_initializers = [];
    let _matterId_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _assignedToId_decorators;
    let _assignedToId_initializers = [];
    let _assignedToId_extraInitializers = [];
    let _parentTaskId_decorators;
    let _parentTaskId_initializers = [];
    let _parentTaskId_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _estimatedHours_decorators;
    let _estimatedHours_initializers = [];
    let _estimatedHours_extraInitializers = [];
    let _dependencies_decorators;
    let _dependencies_initializers = [];
    let _dependencies_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateTaskDto {
            constructor() {
                this.matterId = __runInitializers(this, _matterId_initializers, void 0);
                this.title = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.status = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.priority = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.assignedToId = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _assignedToId_initializers, void 0));
                this.parentTaskId = (__runInitializers(this, _assignedToId_extraInitializers), __runInitializers(this, _parentTaskId_initializers, void 0));
                this.startDate = (__runInitializers(this, _parentTaskId_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.dueDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
                this.estimatedHours = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _estimatedHours_initializers, void 0));
                this.dependencies = (__runInitializers(this, _estimatedHours_extraInitializers), __runInitializers(this, _dependencies_initializers, void 0));
                this.tags = (__runInitializers(this, _dependencies_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                this.metadata = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _matterId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Matter UUID' })];
            _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Task title' })];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Task description' })];
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: TaskStatus, default: TaskStatus.NOT_STARTED })];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ enum: TaskPriority, default: TaskPriority.MEDIUM })];
            _assignedToId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Assigned user UUID' })];
            _parentTaskId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Parent task UUID' })];
            _startDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: Date })];
            _dueDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: Date })];
            _estimatedHours_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Estimated hours' })];
            _dependencies_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Dependent task UUIDs' })];
            _tags_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String] })];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: Object })];
            __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _assignedToId_decorators, { kind: "field", name: "assignedToId", static: false, private: false, access: { has: obj => "assignedToId" in obj, get: obj => obj.assignedToId, set: (obj, value) => { obj.assignedToId = value; } }, metadata: _metadata }, _assignedToId_initializers, _assignedToId_extraInitializers);
            __esDecorate(null, null, _parentTaskId_decorators, { kind: "field", name: "parentTaskId", static: false, private: false, access: { has: obj => "parentTaskId" in obj, get: obj => obj.parentTaskId, set: (obj, value) => { obj.parentTaskId = value; } }, metadata: _metadata }, _parentTaskId_initializers, _parentTaskId_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
            __esDecorate(null, null, _estimatedHours_decorators, { kind: "field", name: "estimatedHours", static: false, private: false, access: { has: obj => "estimatedHours" in obj, get: obj => obj.estimatedHours, set: (obj, value) => { obj.estimatedHours = value; } }, metadata: _metadata }, _estimatedHours_initializers, _estimatedHours_extraInitializers);
            __esDecorate(null, null, _dependencies_decorators, { kind: "field", name: "dependencies", static: false, private: false, access: { has: obj => "dependencies" in obj, get: obj => obj.dependencies, set: (obj, value) => { obj.dependencies = value; } }, metadata: _metadata }, _dependencies_initializers, _dependencies_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateTaskDto = CreateTaskDto;
let UpdateTaskDto = (() => {
    var _a;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _assignedToId_decorators;
    let _assignedToId_initializers = [];
    let _assignedToId_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _estimatedHours_decorators;
    let _estimatedHours_initializers = [];
    let _estimatedHours_extraInitializers = [];
    let _actualHours_decorators;
    let _actualHours_initializers = [];
    let _actualHours_extraInitializers = [];
    let _percentComplete_decorators;
    let _percentComplete_initializers = [];
    let _percentComplete_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class UpdateTaskDto {
            constructor() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.status = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.priority = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.assignedToId = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _assignedToId_initializers, void 0));
                this.dueDate = (__runInitializers(this, _assignedToId_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
                this.estimatedHours = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _estimatedHours_initializers, void 0));
                this.actualHours = (__runInitializers(this, _estimatedHours_extraInitializers), __runInitializers(this, _actualHours_initializers, void 0));
                this.percentComplete = (__runInitializers(this, _actualHours_extraInitializers), __runInitializers(this, _percentComplete_initializers, void 0));
                this.metadata = (__runInitializers(this, _percentComplete_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: TaskStatus })];
            _priority_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: TaskPriority })];
            _assignedToId_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _dueDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: Date })];
            _estimatedHours_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _actualHours_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _percentComplete_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Percentage complete (0-100)' })];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: Object })];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _assignedToId_decorators, { kind: "field", name: "assignedToId", static: false, private: false, access: { has: obj => "assignedToId" in obj, get: obj => obj.assignedToId, set: (obj, value) => { obj.assignedToId = value; } }, metadata: _metadata }, _assignedToId_initializers, _assignedToId_extraInitializers);
            __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
            __esDecorate(null, null, _estimatedHours_decorators, { kind: "field", name: "estimatedHours", static: false, private: false, access: { has: obj => "estimatedHours" in obj, get: obj => obj.estimatedHours, set: (obj, value) => { obj.estimatedHours = value; } }, metadata: _metadata }, _estimatedHours_initializers, _estimatedHours_extraInitializers);
            __esDecorate(null, null, _actualHours_decorators, { kind: "field", name: "actualHours", static: false, private: false, access: { has: obj => "actualHours" in obj, get: obj => obj.actualHours, set: (obj, value) => { obj.actualHours = value; } }, metadata: _metadata }, _actualHours_initializers, _actualHours_extraInitializers);
            __esDecorate(null, null, _percentComplete_decorators, { kind: "field", name: "percentComplete", static: false, private: false, access: { has: obj => "percentComplete" in obj, get: obj => obj.percentComplete, set: (obj, value) => { obj.percentComplete = value; } }, metadata: _metadata }, _percentComplete_initializers, _percentComplete_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateTaskDto = UpdateTaskDto;
let CreateMilestoneDto = (() => {
    var _a;
    let _matterId_decorators;
    let _matterId_initializers = [];
    let _matterId_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _targetDate_decorators;
    let _targetDate_initializers = [];
    let _targetDate_extraInitializers = [];
    let _deliverables_decorators;
    let _deliverables_initializers = [];
    let _deliverables_extraInitializers = [];
    let _dependencies_decorators;
    let _dependencies_initializers = [];
    let _dependencies_extraInitializers = [];
    let _criticalPath_decorators;
    let _criticalPath_initializers = [];
    let _criticalPath_extraInitializers = [];
    let _ownerId_decorators;
    let _ownerId_initializers = [];
    let _ownerId_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateMilestoneDto {
            constructor() {
                this.matterId = __runInitializers(this, _matterId_initializers, void 0);
                this.name = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.targetDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _targetDate_initializers, void 0));
                this.deliverables = (__runInitializers(this, _targetDate_extraInitializers), __runInitializers(this, _deliverables_initializers, void 0));
                this.dependencies = (__runInitializers(this, _deliverables_extraInitializers), __runInitializers(this, _dependencies_initializers, void 0));
                this.criticalPath = (__runInitializers(this, _dependencies_extraInitializers), __runInitializers(this, _criticalPath_initializers, void 0));
                this.ownerId = (__runInitializers(this, _criticalPath_extraInitializers), __runInitializers(this, _ownerId_initializers, void 0));
                this.metadata = (__runInitializers(this, _ownerId_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _matterId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Matter UUID' })];
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Milestone name' })];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Milestone description' })];
            _targetDate_decorators = [(0, swagger_1.ApiProperty)({ type: Date, description: 'Target date' })];
            _deliverables_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Deliverables' })];
            _dependencies_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Dependent milestone UUIDs' })];
            _criticalPath_decorators = [(0, swagger_1.ApiProperty)({ default: false, description: 'Is on critical path' })];
            _ownerId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Owner UUID' })];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: Object })];
            __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _targetDate_decorators, { kind: "field", name: "targetDate", static: false, private: false, access: { has: obj => "targetDate" in obj, get: obj => obj.targetDate, set: (obj, value) => { obj.targetDate = value; } }, metadata: _metadata }, _targetDate_initializers, _targetDate_extraInitializers);
            __esDecorate(null, null, _deliverables_decorators, { kind: "field", name: "deliverables", static: false, private: false, access: { has: obj => "deliverables" in obj, get: obj => obj.deliverables, set: (obj, value) => { obj.deliverables = value; } }, metadata: _metadata }, _deliverables_initializers, _deliverables_extraInitializers);
            __esDecorate(null, null, _dependencies_decorators, { kind: "field", name: "dependencies", static: false, private: false, access: { has: obj => "dependencies" in obj, get: obj => obj.dependencies, set: (obj, value) => { obj.dependencies = value; } }, metadata: _metadata }, _dependencies_initializers, _dependencies_extraInitializers);
            __esDecorate(null, null, _criticalPath_decorators, { kind: "field", name: "criticalPath", static: false, private: false, access: { has: obj => "criticalPath" in obj, get: obj => obj.criticalPath, set: (obj, value) => { obj.criticalPath = value; } }, metadata: _metadata }, _criticalPath_initializers, _criticalPath_extraInitializers);
            __esDecorate(null, null, _ownerId_decorators, { kind: "field", name: "ownerId", static: false, private: false, access: { has: obj => "ownerId" in obj, get: obj => obj.ownerId, set: (obj, value) => { obj.ownerId = value; } }, metadata: _metadata }, _ownerId_initializers, _ownerId_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateMilestoneDto = CreateMilestoneDto;
let UpdateMilestoneDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _targetDate_decorators;
    let _targetDate_initializers = [];
    let _targetDate_extraInitializers = [];
    let _actualDate_decorators;
    let _actualDate_initializers = [];
    let _actualDate_extraInitializers = [];
    let _percentComplete_decorators;
    let _percentComplete_initializers = [];
    let _percentComplete_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class UpdateMilestoneDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.status = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.targetDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _targetDate_initializers, void 0));
                this.actualDate = (__runInitializers(this, _targetDate_extraInitializers), __runInitializers(this, _actualDate_initializers, void 0));
                this.percentComplete = (__runInitializers(this, _actualDate_extraInitializers), __runInitializers(this, _percentComplete_initializers, void 0));
                this.metadata = (__runInitializers(this, _percentComplete_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: MilestoneStatus })];
            _targetDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: Date })];
            _actualDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: Date })];
            _percentComplete_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Percentage complete (0-100)' })];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: Object })];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _targetDate_decorators, { kind: "field", name: "targetDate", static: false, private: false, access: { has: obj => "targetDate" in obj, get: obj => obj.targetDate, set: (obj, value) => { obj.targetDate = value; } }, metadata: _metadata }, _targetDate_initializers, _targetDate_extraInitializers);
            __esDecorate(null, null, _actualDate_decorators, { kind: "field", name: "actualDate", static: false, private: false, access: { has: obj => "actualDate" in obj, get: obj => obj.actualDate, set: (obj, value) => { obj.actualDate = value; } }, metadata: _metadata }, _actualDate_initializers, _actualDate_extraInitializers);
            __esDecorate(null, null, _percentComplete_decorators, { kind: "field", name: "percentComplete", static: false, private: false, access: { has: obj => "percentComplete" in obj, get: obj => obj.percentComplete, set: (obj, value) => { obj.percentComplete = value; } }, metadata: _metadata }, _percentComplete_initializers, _percentComplete_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateMilestoneDto = UpdateMilestoneDto;
let CreateResourceAllocationDto = (() => {
    var _a;
    let _matterId_decorators;
    let _matterId_initializers = [];
    let _matterId_extraInitializers = [];
    let _resourceId_decorators;
    let _resourceId_initializers = [];
    let _resourceId_extraInitializers = [];
    let _resourceType_decorators;
    let _resourceType_initializers = [];
    let _resourceType_extraInitializers = [];
    let _roleOnMatter_decorators;
    let _roleOnMatter_initializers = [];
    let _roleOnMatter_extraInitializers = [];
    let _allocationPercentage_decorators;
    let _allocationPercentage_initializers = [];
    let _allocationPercentage_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _estimatedHours_decorators;
    let _estimatedHours_initializers = [];
    let _estimatedHours_extraInitializers = [];
    let _billableRate_decorators;
    let _billableRate_initializers = [];
    let _billableRate_extraInitializers = [];
    let _costRate_decorators;
    let _costRate_initializers = [];
    let _costRate_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateResourceAllocationDto {
            constructor() {
                this.matterId = __runInitializers(this, _matterId_initializers, void 0);
                this.resourceId = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _resourceId_initializers, void 0));
                this.resourceType = (__runInitializers(this, _resourceId_extraInitializers), __runInitializers(this, _resourceType_initializers, void 0));
                this.roleOnMatter = (__runInitializers(this, _resourceType_extraInitializers), __runInitializers(this, _roleOnMatter_initializers, void 0));
                this.allocationPercentage = (__runInitializers(this, _roleOnMatter_extraInitializers), __runInitializers(this, _allocationPercentage_initializers, void 0));
                this.startDate = (__runInitializers(this, _allocationPercentage_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.estimatedHours = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _estimatedHours_initializers, void 0));
                this.billableRate = (__runInitializers(this, _estimatedHours_extraInitializers), __runInitializers(this, _billableRate_initializers, void 0));
                this.costRate = (__runInitializers(this, _billableRate_extraInitializers), __runInitializers(this, _costRate_initializers, void 0));
                this.metadata = (__runInitializers(this, _costRate_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _matterId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Matter UUID' })];
            _resourceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resource UUID' })];
            _resourceType_decorators = [(0, swagger_1.ApiProperty)({ enum: ['attorney', 'paralegal', 'staff', 'expert', 'vendor'] })];
            _roleOnMatter_decorators = [(0, swagger_1.ApiProperty)({ description: 'Role on matter' })];
            _allocationPercentage_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Allocation percentage (0-100)' })];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ type: Date })];
            _endDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: Date })];
            _estimatedHours_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Estimated hours' })];
            _billableRate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Billable rate' })];
            _costRate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Cost rate' })];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: Object })];
            __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
            __esDecorate(null, null, _resourceId_decorators, { kind: "field", name: "resourceId", static: false, private: false, access: { has: obj => "resourceId" in obj, get: obj => obj.resourceId, set: (obj, value) => { obj.resourceId = value; } }, metadata: _metadata }, _resourceId_initializers, _resourceId_extraInitializers);
            __esDecorate(null, null, _resourceType_decorators, { kind: "field", name: "resourceType", static: false, private: false, access: { has: obj => "resourceType" in obj, get: obj => obj.resourceType, set: (obj, value) => { obj.resourceType = value; } }, metadata: _metadata }, _resourceType_initializers, _resourceType_extraInitializers);
            __esDecorate(null, null, _roleOnMatter_decorators, { kind: "field", name: "roleOnMatter", static: false, private: false, access: { has: obj => "roleOnMatter" in obj, get: obj => obj.roleOnMatter, set: (obj, value) => { obj.roleOnMatter = value; } }, metadata: _metadata }, _roleOnMatter_initializers, _roleOnMatter_extraInitializers);
            __esDecorate(null, null, _allocationPercentage_decorators, { kind: "field", name: "allocationPercentage", static: false, private: false, access: { has: obj => "allocationPercentage" in obj, get: obj => obj.allocationPercentage, set: (obj, value) => { obj.allocationPercentage = value; } }, metadata: _metadata }, _allocationPercentage_initializers, _allocationPercentage_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _estimatedHours_decorators, { kind: "field", name: "estimatedHours", static: false, private: false, access: { has: obj => "estimatedHours" in obj, get: obj => obj.estimatedHours, set: (obj, value) => { obj.estimatedHours = value; } }, metadata: _metadata }, _estimatedHours_initializers, _estimatedHours_extraInitializers);
            __esDecorate(null, null, _billableRate_decorators, { kind: "field", name: "billableRate", static: false, private: false, access: { has: obj => "billableRate" in obj, get: obj => obj.billableRate, set: (obj, value) => { obj.billableRate = value; } }, metadata: _metadata }, _billableRate_initializers, _billableRate_extraInitializers);
            __esDecorate(null, null, _costRate_decorators, { kind: "field", name: "costRate", static: false, private: false, access: { has: obj => "costRate" in obj, get: obj => obj.costRate, set: (obj, value) => { obj.costRate = value; } }, metadata: _metadata }, _costRate_initializers, _costRate_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateResourceAllocationDto = CreateResourceAllocationDto;
let UpdateResourceAllocationDto = (() => {
    var _a;
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _allocationPercentage_decorators;
    let _allocationPercentage_initializers = [];
    let _allocationPercentage_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _actualHours_decorators;
    let _actualHours_initializers = [];
    let _actualHours_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class UpdateResourceAllocationDto {
            constructor() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.allocationPercentage = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _allocationPercentage_initializers, void 0));
                this.endDate = (__runInitializers(this, _allocationPercentage_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.actualHours = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _actualHours_initializers, void 0));
                this.metadata = (__runInitializers(this, _actualHours_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: ResourceAllocationStatus })];
            _allocationPercentage_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _endDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: Date })];
            _actualHours_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: Object })];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _allocationPercentage_decorators, { kind: "field", name: "allocationPercentage", static: false, private: false, access: { has: obj => "allocationPercentage" in obj, get: obj => obj.allocationPercentage, set: (obj, value) => { obj.allocationPercentage = value; } }, metadata: _metadata }, _allocationPercentage_initializers, _allocationPercentage_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _actualHours_decorators, { kind: "field", name: "actualHours", static: false, private: false, access: { has: obj => "actualHours" in obj, get: obj => obj.actualHours, set: (obj, value) => { obj.actualHours = value; } }, metadata: _metadata }, _actualHours_initializers, _actualHours_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateResourceAllocationDto = UpdateResourceAllocationDto;
let CreateBudgetDto = (() => {
    var _a;
    let _matterId_decorators;
    let _matterId_initializers = [];
    let _matterId_extraInitializers = [];
    let _budgetType_decorators;
    let _budgetType_initializers = [];
    let _budgetType_extraInitializers = [];
    let _totalBudget_decorators;
    let _totalBudget_initializers = [];
    let _totalBudget_extraInitializers = [];
    let _laborBudget_decorators;
    let _laborBudget_initializers = [];
    let _laborBudget_extraInitializers = [];
    let _expenseBudget_decorators;
    let _expenseBudget_initializers = [];
    let _expenseBudget_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _periodStart_decorators;
    let _periodStart_initializers = [];
    let _periodStart_extraInitializers = [];
    let _periodEnd_decorators;
    let _periodEnd_initializers = [];
    let _periodEnd_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateBudgetDto {
            constructor() {
                this.matterId = __runInitializers(this, _matterId_initializers, void 0);
                this.budgetType = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _budgetType_initializers, void 0));
                this.totalBudget = (__runInitializers(this, _budgetType_extraInitializers), __runInitializers(this, _totalBudget_initializers, void 0));
                this.laborBudget = (__runInitializers(this, _totalBudget_extraInitializers), __runInitializers(this, _laborBudget_initializers, void 0));
                this.expenseBudget = (__runInitializers(this, _laborBudget_extraInitializers), __runInitializers(this, _expenseBudget_initializers, void 0));
                this.currency = (__runInitializers(this, _expenseBudget_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                this.periodStart = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _periodStart_initializers, void 0));
                this.periodEnd = (__runInitializers(this, _periodStart_extraInitializers), __runInitializers(this, _periodEnd_initializers, void 0));
                this.metadata = (__runInitializers(this, _periodEnd_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _matterId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Matter UUID' })];
            _budgetType_decorators = [(0, swagger_1.ApiProperty)({ enum: ['overall', 'phase', 'task', 'category'] })];
            _totalBudget_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total budget amount' })];
            _laborBudget_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Labor budget' })];
            _expenseBudget_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Expense budget' })];
            _currency_decorators = [(0, swagger_1.ApiProperty)({ default: 'USD' })];
            _periodStart_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: Date })];
            _periodEnd_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: Date })];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: Object })];
            __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
            __esDecorate(null, null, _budgetType_decorators, { kind: "field", name: "budgetType", static: false, private: false, access: { has: obj => "budgetType" in obj, get: obj => obj.budgetType, set: (obj, value) => { obj.budgetType = value; } }, metadata: _metadata }, _budgetType_initializers, _budgetType_extraInitializers);
            __esDecorate(null, null, _totalBudget_decorators, { kind: "field", name: "totalBudget", static: false, private: false, access: { has: obj => "totalBudget" in obj, get: obj => obj.totalBudget, set: (obj, value) => { obj.totalBudget = value; } }, metadata: _metadata }, _totalBudget_initializers, _totalBudget_extraInitializers);
            __esDecorate(null, null, _laborBudget_decorators, { kind: "field", name: "laborBudget", static: false, private: false, access: { has: obj => "laborBudget" in obj, get: obj => obj.laborBudget, set: (obj, value) => { obj.laborBudget = value; } }, metadata: _metadata }, _laborBudget_initializers, _laborBudget_extraInitializers);
            __esDecorate(null, null, _expenseBudget_decorators, { kind: "field", name: "expenseBudget", static: false, private: false, access: { has: obj => "expenseBudget" in obj, get: obj => obj.expenseBudget, set: (obj, value) => { obj.expenseBudget = value; } }, metadata: _metadata }, _expenseBudget_initializers, _expenseBudget_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _periodStart_decorators, { kind: "field", name: "periodStart", static: false, private: false, access: { has: obj => "periodStart" in obj, get: obj => obj.periodStart, set: (obj, value) => { obj.periodStart = value; } }, metadata: _metadata }, _periodStart_initializers, _periodStart_extraInitializers);
            __esDecorate(null, null, _periodEnd_decorators, { kind: "field", name: "periodEnd", static: false, private: false, access: { has: obj => "periodEnd" in obj, get: obj => obj.periodEnd, set: (obj, value) => { obj.periodEnd = value; } }, metadata: _metadata }, _periodEnd_initializers, _periodEnd_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateBudgetDto = CreateBudgetDto;
let UpdateBudgetDto = (() => {
    var _a;
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _totalBudget_decorators;
    let _totalBudget_initializers = [];
    let _totalBudget_extraInitializers = [];
    let _laborBudget_decorators;
    let _laborBudget_initializers = [];
    let _laborBudget_extraInitializers = [];
    let _expenseBudget_decorators;
    let _expenseBudget_initializers = [];
    let _expenseBudget_extraInitializers = [];
    let _actualSpent_decorators;
    let _actualSpent_initializers = [];
    let _actualSpent_extraInitializers = [];
    let _committed_decorators;
    let _committed_initializers = [];
    let _committed_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class UpdateBudgetDto {
            constructor() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.totalBudget = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _totalBudget_initializers, void 0));
                this.laborBudget = (__runInitializers(this, _totalBudget_extraInitializers), __runInitializers(this, _laborBudget_initializers, void 0));
                this.expenseBudget = (__runInitializers(this, _laborBudget_extraInitializers), __runInitializers(this, _expenseBudget_initializers, void 0));
                this.actualSpent = (__runInitializers(this, _expenseBudget_extraInitializers), __runInitializers(this, _actualSpent_initializers, void 0));
                this.committed = (__runInitializers(this, _actualSpent_extraInitializers), __runInitializers(this, _committed_initializers, void 0));
                this.metadata = (__runInitializers(this, _committed_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: BudgetStatus })];
            _totalBudget_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _laborBudget_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _expenseBudget_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _actualSpent_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _committed_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: Object })];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _totalBudget_decorators, { kind: "field", name: "totalBudget", static: false, private: false, access: { has: obj => "totalBudget" in obj, get: obj => obj.totalBudget, set: (obj, value) => { obj.totalBudget = value; } }, metadata: _metadata }, _totalBudget_initializers, _totalBudget_extraInitializers);
            __esDecorate(null, null, _laborBudget_decorators, { kind: "field", name: "laborBudget", static: false, private: false, access: { has: obj => "laborBudget" in obj, get: obj => obj.laborBudget, set: (obj, value) => { obj.laborBudget = value; } }, metadata: _metadata }, _laborBudget_initializers, _laborBudget_extraInitializers);
            __esDecorate(null, null, _expenseBudget_decorators, { kind: "field", name: "expenseBudget", static: false, private: false, access: { has: obj => "expenseBudget" in obj, get: obj => obj.expenseBudget, set: (obj, value) => { obj.expenseBudget = value; } }, metadata: _metadata }, _expenseBudget_initializers, _expenseBudget_extraInitializers);
            __esDecorate(null, null, _actualSpent_decorators, { kind: "field", name: "actualSpent", static: false, private: false, access: { has: obj => "actualSpent" in obj, get: obj => obj.actualSpent, set: (obj, value) => { obj.actualSpent = value; } }, metadata: _metadata }, _actualSpent_initializers, _actualSpent_extraInitializers);
            __esDecorate(null, null, _committed_decorators, { kind: "field", name: "committed", static: false, private: false, access: { has: obj => "committed" in obj, get: obj => obj.committed, set: (obj, value) => { obj.committed = value; } }, metadata: _metadata }, _committed_initializers, _committed_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateBudgetDto = UpdateBudgetDto;
let CreateStatusReportDto = (() => {
    var _a;
    let _matterId_decorators;
    let _matterId_initializers = [];
    let _matterId_extraInitializers = [];
    let _reportType_decorators;
    let _reportType_initializers = [];
    let _reportType_extraInitializers = [];
    let _periodStart_decorators;
    let _periodStart_initializers = [];
    let _periodStart_extraInitializers = [];
    let _periodEnd_decorators;
    let _periodEnd_initializers = [];
    let _periodEnd_extraInitializers = [];
    let _summary_decorators;
    let _summary_initializers = [];
    let _summary_extraInitializers = [];
    let _accomplishments_decorators;
    let _accomplishments_initializers = [];
    let _accomplishments_extraInitializers = [];
    let _upcomingTasks_decorators;
    let _upcomingTasks_initializers = [];
    let _upcomingTasks_extraInitializers = [];
    let _issues_decorators;
    let _issues_initializers = [];
    let _issues_extraInitializers = [];
    let _recommendations_decorators;
    let _recommendations_initializers = [];
    let _recommendations_extraInitializers = [];
    let _recipientIds_decorators;
    let _recipientIds_initializers = [];
    let _recipientIds_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateStatusReportDto {
            constructor() {
                this.matterId = __runInitializers(this, _matterId_initializers, void 0);
                this.reportType = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _reportType_initializers, void 0));
                this.periodStart = (__runInitializers(this, _reportType_extraInitializers), __runInitializers(this, _periodStart_initializers, void 0));
                this.periodEnd = (__runInitializers(this, _periodStart_extraInitializers), __runInitializers(this, _periodEnd_initializers, void 0));
                this.summary = (__runInitializers(this, _periodEnd_extraInitializers), __runInitializers(this, _summary_initializers, void 0));
                this.accomplishments = (__runInitializers(this, _summary_extraInitializers), __runInitializers(this, _accomplishments_initializers, void 0));
                this.upcomingTasks = (__runInitializers(this, _accomplishments_extraInitializers), __runInitializers(this, _upcomingTasks_initializers, void 0));
                this.issues = (__runInitializers(this, _upcomingTasks_extraInitializers), __runInitializers(this, _issues_initializers, void 0));
                this.recommendations = (__runInitializers(this, _issues_extraInitializers), __runInitializers(this, _recommendations_initializers, void 0));
                this.recipientIds = (__runInitializers(this, _recommendations_extraInitializers), __runInitializers(this, _recipientIds_initializers, void 0));
                this.metadata = (__runInitializers(this, _recipientIds_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _matterId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Matter UUID' })];
            _reportType_decorators = [(0, swagger_1.ApiProperty)({ enum: ReportType })];
            _periodStart_decorators = [(0, swagger_1.ApiProperty)({ type: Date })];
            _periodEnd_decorators = [(0, swagger_1.ApiProperty)({ type: Date })];
            _summary_decorators = [(0, swagger_1.ApiProperty)({ description: 'Report summary' })];
            _accomplishments_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String] })];
            _upcomingTasks_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String] })];
            _issues_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String] })];
            _recommendations_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String] })];
            _recipientIds_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Recipient UUIDs' })];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: Object })];
            __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
            __esDecorate(null, null, _reportType_decorators, { kind: "field", name: "reportType", static: false, private: false, access: { has: obj => "reportType" in obj, get: obj => obj.reportType, set: (obj, value) => { obj.reportType = value; } }, metadata: _metadata }, _reportType_initializers, _reportType_extraInitializers);
            __esDecorate(null, null, _periodStart_decorators, { kind: "field", name: "periodStart", static: false, private: false, access: { has: obj => "periodStart" in obj, get: obj => obj.periodStart, set: (obj, value) => { obj.periodStart = value; } }, metadata: _metadata }, _periodStart_initializers, _periodStart_extraInitializers);
            __esDecorate(null, null, _periodEnd_decorators, { kind: "field", name: "periodEnd", static: false, private: false, access: { has: obj => "periodEnd" in obj, get: obj => obj.periodEnd, set: (obj, value) => { obj.periodEnd = value; } }, metadata: _metadata }, _periodEnd_initializers, _periodEnd_extraInitializers);
            __esDecorate(null, null, _summary_decorators, { kind: "field", name: "summary", static: false, private: false, access: { has: obj => "summary" in obj, get: obj => obj.summary, set: (obj, value) => { obj.summary = value; } }, metadata: _metadata }, _summary_initializers, _summary_extraInitializers);
            __esDecorate(null, null, _accomplishments_decorators, { kind: "field", name: "accomplishments", static: false, private: false, access: { has: obj => "accomplishments" in obj, get: obj => obj.accomplishments, set: (obj, value) => { obj.accomplishments = value; } }, metadata: _metadata }, _accomplishments_initializers, _accomplishments_extraInitializers);
            __esDecorate(null, null, _upcomingTasks_decorators, { kind: "field", name: "upcomingTasks", static: false, private: false, access: { has: obj => "upcomingTasks" in obj, get: obj => obj.upcomingTasks, set: (obj, value) => { obj.upcomingTasks = value; } }, metadata: _metadata }, _upcomingTasks_initializers, _upcomingTasks_extraInitializers);
            __esDecorate(null, null, _issues_decorators, { kind: "field", name: "issues", static: false, private: false, access: { has: obj => "issues" in obj, get: obj => obj.issues, set: (obj, value) => { obj.issues = value; } }, metadata: _metadata }, _issues_initializers, _issues_extraInitializers);
            __esDecorate(null, null, _recommendations_decorators, { kind: "field", name: "recommendations", static: false, private: false, access: { has: obj => "recommendations" in obj, get: obj => obj.recommendations, set: (obj, value) => { obj.recommendations = value; } }, metadata: _metadata }, _recommendations_initializers, _recommendations_extraInitializers);
            __esDecorate(null, null, _recipientIds_decorators, { kind: "field", name: "recipientIds", static: false, private: false, access: { has: obj => "recipientIds" in obj, get: obj => obj.recipientIds, set: (obj, value) => { obj.recipientIds = value; } }, metadata: _metadata }, _recipientIds_initializers, _recipientIds_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateStatusReportDto = CreateStatusReportDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
let LegalMatterModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'legal_matters', paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _matterNumber_decorators;
    let _matterNumber_initializers = [];
    let _matterNumber_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _matterType_decorators;
    let _matterType_initializers = [];
    let _matterType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _clientId_decorators;
    let _clientId_initializers = [];
    let _clientId_extraInitializers = [];
    let _responsibleAttorneyId_decorators;
    let _responsibleAttorneyId_initializers = [];
    let _responsibleAttorneyId_extraInitializers = [];
    let _practiceAreaId_decorators;
    let _practiceAreaId_initializers = [];
    let _practiceAreaId_extraInitializers = [];
    let _openDate_decorators;
    let _openDate_initializers = [];
    let _openDate_extraInitializers = [];
    let _closeDate_decorators;
    let _closeDate_initializers = [];
    let _closeDate_extraInitializers = [];
    let _targetCloseDate_decorators;
    let _targetCloseDate_initializers = [];
    let _targetCloseDate_extraInitializers = [];
    let _budgetAmount_decorators;
    let _budgetAmount_initializers = [];
    let _budgetAmount_extraInitializers = [];
    let _estimatedHours_decorators;
    let _estimatedHours_initializers = [];
    let _estimatedHours_extraInitializers = [];
    let _actualHours_decorators;
    let _actualHours_initializers = [];
    let _actualHours_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _conflictCheckStatus_decorators;
    let _conflictCheckStatus_initializers = [];
    let _conflictCheckStatus_extraInitializers = [];
    let _conflictCheckDate_decorators;
    let _conflictCheckDate_initializers = [];
    let _conflictCheckDate_extraInitializers = [];
    let _billingArrangement_decorators;
    let _billingArrangement_initializers = [];
    let _billingArrangement_extraInitializers = [];
    let _objectives_decorators;
    let _objectives_initializers = [];
    let _objectives_extraInitializers = [];
    let _scope_decorators;
    let _scope_initializers = [];
    let _scope_extraInitializers = [];
    let _constraints_decorators;
    let _constraints_initializers = [];
    let _constraints_extraInitializers = [];
    let _assumptions_decorators;
    let _assumptions_initializers = [];
    let _assumptions_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _updatedBy_decorators;
    let _updatedBy_initializers = [];
    let _updatedBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var LegalMatterModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.matterNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _matterNumber_initializers, void 0));
            this.title = (__runInitializers(this, _matterNumber_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.matterType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _matterType_initializers, void 0));
            this.status = (__runInitializers(this, _matterType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.priority = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.clientId = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _clientId_initializers, void 0));
            this.responsibleAttorneyId = (__runInitializers(this, _clientId_extraInitializers), __runInitializers(this, _responsibleAttorneyId_initializers, void 0));
            this.practiceAreaId = (__runInitializers(this, _responsibleAttorneyId_extraInitializers), __runInitializers(this, _practiceAreaId_initializers, void 0));
            this.openDate = (__runInitializers(this, _practiceAreaId_extraInitializers), __runInitializers(this, _openDate_initializers, void 0));
            this.closeDate = (__runInitializers(this, _openDate_extraInitializers), __runInitializers(this, _closeDate_initializers, void 0));
            this.targetCloseDate = (__runInitializers(this, _closeDate_extraInitializers), __runInitializers(this, _targetCloseDate_initializers, void 0));
            this.budgetAmount = (__runInitializers(this, _targetCloseDate_extraInitializers), __runInitializers(this, _budgetAmount_initializers, void 0));
            this.estimatedHours = (__runInitializers(this, _budgetAmount_extraInitializers), __runInitializers(this, _estimatedHours_initializers, void 0));
            this.actualHours = (__runInitializers(this, _estimatedHours_extraInitializers), __runInitializers(this, _actualHours_initializers, void 0));
            this.currency = (__runInitializers(this, _actualHours_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
            this.conflictCheckStatus = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _conflictCheckStatus_initializers, void 0));
            this.conflictCheckDate = (__runInitializers(this, _conflictCheckStatus_extraInitializers), __runInitializers(this, _conflictCheckDate_initializers, void 0));
            this.billingArrangement = (__runInitializers(this, _conflictCheckDate_extraInitializers), __runInitializers(this, _billingArrangement_initializers, void 0));
            this.objectives = (__runInitializers(this, _billingArrangement_extraInitializers), __runInitializers(this, _objectives_initializers, void 0));
            this.scope = (__runInitializers(this, _objectives_extraInitializers), __runInitializers(this, _scope_initializers, void 0));
            this.constraints = (__runInitializers(this, _scope_extraInitializers), __runInitializers(this, _constraints_initializers, void 0));
            this.assumptions = (__runInitializers(this, _constraints_extraInitializers), __runInitializers(this, _assumptions_initializers, void 0));
            this.metadata = (__runInitializers(this, _assumptions_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.tenantId = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.createdBy = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "LegalMatterModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _matterNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, unique: true })];
        _title_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _description_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _matterType_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(MatterType)))];
        _status_decorators = [(0, sequelize_typescript_1.Default)(MatterStatus.PROSPECTIVE), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(MatterStatus)))];
        _priority_decorators = [(0, sequelize_typescript_1.Default)(MatterPriority.MEDIUM), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(MatterPriority)))];
        _clientId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _responsibleAttorneyId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _practiceAreaId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _openDate_decorators = [(0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.NOW), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _closeDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _targetCloseDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _budgetAmount_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _estimatedHours_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _actualHours_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _currency_decorators = [(0, sequelize_typescript_1.Default)('USD'), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _conflictCheckStatus_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _conflictCheckDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _billingArrangement_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _objectives_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _scope_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _constraints_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _assumptions_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _metadata_decorators = [(0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _updatedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _matterNumber_decorators, { kind: "field", name: "matterNumber", static: false, private: false, access: { has: obj => "matterNumber" in obj, get: obj => obj.matterNumber, set: (obj, value) => { obj.matterNumber = value; } }, metadata: _metadata }, _matterNumber_initializers, _matterNumber_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _matterType_decorators, { kind: "field", name: "matterType", static: false, private: false, access: { has: obj => "matterType" in obj, get: obj => obj.matterType, set: (obj, value) => { obj.matterType = value; } }, metadata: _metadata }, _matterType_initializers, _matterType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _clientId_decorators, { kind: "field", name: "clientId", static: false, private: false, access: { has: obj => "clientId" in obj, get: obj => obj.clientId, set: (obj, value) => { obj.clientId = value; } }, metadata: _metadata }, _clientId_initializers, _clientId_extraInitializers);
        __esDecorate(null, null, _responsibleAttorneyId_decorators, { kind: "field", name: "responsibleAttorneyId", static: false, private: false, access: { has: obj => "responsibleAttorneyId" in obj, get: obj => obj.responsibleAttorneyId, set: (obj, value) => { obj.responsibleAttorneyId = value; } }, metadata: _metadata }, _responsibleAttorneyId_initializers, _responsibleAttorneyId_extraInitializers);
        __esDecorate(null, null, _practiceAreaId_decorators, { kind: "field", name: "practiceAreaId", static: false, private: false, access: { has: obj => "practiceAreaId" in obj, get: obj => obj.practiceAreaId, set: (obj, value) => { obj.practiceAreaId = value; } }, metadata: _metadata }, _practiceAreaId_initializers, _practiceAreaId_extraInitializers);
        __esDecorate(null, null, _openDate_decorators, { kind: "field", name: "openDate", static: false, private: false, access: { has: obj => "openDate" in obj, get: obj => obj.openDate, set: (obj, value) => { obj.openDate = value; } }, metadata: _metadata }, _openDate_initializers, _openDate_extraInitializers);
        __esDecorate(null, null, _closeDate_decorators, { kind: "field", name: "closeDate", static: false, private: false, access: { has: obj => "closeDate" in obj, get: obj => obj.closeDate, set: (obj, value) => { obj.closeDate = value; } }, metadata: _metadata }, _closeDate_initializers, _closeDate_extraInitializers);
        __esDecorate(null, null, _targetCloseDate_decorators, { kind: "field", name: "targetCloseDate", static: false, private: false, access: { has: obj => "targetCloseDate" in obj, get: obj => obj.targetCloseDate, set: (obj, value) => { obj.targetCloseDate = value; } }, metadata: _metadata }, _targetCloseDate_initializers, _targetCloseDate_extraInitializers);
        __esDecorate(null, null, _budgetAmount_decorators, { kind: "field", name: "budgetAmount", static: false, private: false, access: { has: obj => "budgetAmount" in obj, get: obj => obj.budgetAmount, set: (obj, value) => { obj.budgetAmount = value; } }, metadata: _metadata }, _budgetAmount_initializers, _budgetAmount_extraInitializers);
        __esDecorate(null, null, _estimatedHours_decorators, { kind: "field", name: "estimatedHours", static: false, private: false, access: { has: obj => "estimatedHours" in obj, get: obj => obj.estimatedHours, set: (obj, value) => { obj.estimatedHours = value; } }, metadata: _metadata }, _estimatedHours_initializers, _estimatedHours_extraInitializers);
        __esDecorate(null, null, _actualHours_decorators, { kind: "field", name: "actualHours", static: false, private: false, access: { has: obj => "actualHours" in obj, get: obj => obj.actualHours, set: (obj, value) => { obj.actualHours = value; } }, metadata: _metadata }, _actualHours_initializers, _actualHours_extraInitializers);
        __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
        __esDecorate(null, null, _conflictCheckStatus_decorators, { kind: "field", name: "conflictCheckStatus", static: false, private: false, access: { has: obj => "conflictCheckStatus" in obj, get: obj => obj.conflictCheckStatus, set: (obj, value) => { obj.conflictCheckStatus = value; } }, metadata: _metadata }, _conflictCheckStatus_initializers, _conflictCheckStatus_extraInitializers);
        __esDecorate(null, null, _conflictCheckDate_decorators, { kind: "field", name: "conflictCheckDate", static: false, private: false, access: { has: obj => "conflictCheckDate" in obj, get: obj => obj.conflictCheckDate, set: (obj, value) => { obj.conflictCheckDate = value; } }, metadata: _metadata }, _conflictCheckDate_initializers, _conflictCheckDate_extraInitializers);
        __esDecorate(null, null, _billingArrangement_decorators, { kind: "field", name: "billingArrangement", static: false, private: false, access: { has: obj => "billingArrangement" in obj, get: obj => obj.billingArrangement, set: (obj, value) => { obj.billingArrangement = value; } }, metadata: _metadata }, _billingArrangement_initializers, _billingArrangement_extraInitializers);
        __esDecorate(null, null, _objectives_decorators, { kind: "field", name: "objectives", static: false, private: false, access: { has: obj => "objectives" in obj, get: obj => obj.objectives, set: (obj, value) => { obj.objectives = value; } }, metadata: _metadata }, _objectives_initializers, _objectives_extraInitializers);
        __esDecorate(null, null, _scope_decorators, { kind: "field", name: "scope", static: false, private: false, access: { has: obj => "scope" in obj, get: obj => obj.scope, set: (obj, value) => { obj.scope = value; } }, metadata: _metadata }, _scope_initializers, _scope_extraInitializers);
        __esDecorate(null, null, _constraints_decorators, { kind: "field", name: "constraints", static: false, private: false, access: { has: obj => "constraints" in obj, get: obj => obj.constraints, set: (obj, value) => { obj.constraints = value; } }, metadata: _metadata }, _constraints_initializers, _constraints_extraInitializers);
        __esDecorate(null, null, _assumptions_decorators, { kind: "field", name: "assumptions", static: false, private: false, access: { has: obj => "assumptions" in obj, get: obj => obj.assumptions, set: (obj, value) => { obj.assumptions = value; } }, metadata: _metadata }, _assumptions_initializers, _assumptions_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LegalMatterModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LegalMatterModel = _classThis;
})();
exports.LegalMatterModel = LegalMatterModel;
let ProjectTaskModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'project_tasks', paranoid: true })];
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
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _assignedToId_decorators;
    let _assignedToId_initializers = [];
    let _assignedToId_extraInitializers = [];
    let _assignedById_decorators;
    let _assignedById_initializers = [];
    let _assignedById_extraInitializers = [];
    let _parentTaskId_decorators;
    let _parentTaskId_initializers = [];
    let _parentTaskId_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _completedDate_decorators;
    let _completedDate_initializers = [];
    let _completedDate_extraInitializers = [];
    let _estimatedHours_decorators;
    let _estimatedHours_initializers = [];
    let _estimatedHours_extraInitializers = [];
    let _actualHours_decorators;
    let _actualHours_initializers = [];
    let _actualHours_extraInitializers = [];
    let _percentComplete_decorators;
    let _percentComplete_initializers = [];
    let _percentComplete_extraInitializers = [];
    let _dependencies_decorators;
    let _dependencies_initializers = [];
    let _dependencies_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _checklistItems_decorators;
    let _checklistItems_initializers = [];
    let _checklistItems_extraInitializers = [];
    let _blockers_decorators;
    let _blockers_initializers = [];
    let _blockers_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _updatedBy_decorators;
    let _updatedBy_initializers = [];
    let _updatedBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _matter_decorators;
    let _matter_initializers = [];
    let _matter_extraInitializers = [];
    var ProjectTaskModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.matterId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _matterId_initializers, void 0));
            this.title = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.status = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.priority = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.assignedToId = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _assignedToId_initializers, void 0));
            this.assignedById = (__runInitializers(this, _assignedToId_extraInitializers), __runInitializers(this, _assignedById_initializers, void 0));
            this.parentTaskId = (__runInitializers(this, _assignedById_extraInitializers), __runInitializers(this, _parentTaskId_initializers, void 0));
            this.startDate = (__runInitializers(this, _parentTaskId_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.dueDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
            this.completedDate = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _completedDate_initializers, void 0));
            this.estimatedHours = (__runInitializers(this, _completedDate_extraInitializers), __runInitializers(this, _estimatedHours_initializers, void 0));
            this.actualHours = (__runInitializers(this, _estimatedHours_extraInitializers), __runInitializers(this, _actualHours_initializers, void 0));
            this.percentComplete = (__runInitializers(this, _actualHours_extraInitializers), __runInitializers(this, _percentComplete_initializers, void 0));
            this.dependencies = (__runInitializers(this, _percentComplete_extraInitializers), __runInitializers(this, _dependencies_initializers, void 0));
            this.tags = (__runInitializers(this, _dependencies_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.checklistItems = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _checklistItems_initializers, void 0));
            this.blockers = (__runInitializers(this, _checklistItems_extraInitializers), __runInitializers(this, _blockers_initializers, void 0));
            this.metadata = (__runInitializers(this, _blockers_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.tenantId = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.createdBy = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.matter = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _matter_initializers, void 0));
            __runInitializers(this, _matter_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ProjectTaskModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _matterId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => LegalMatterModel), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _title_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _description_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _status_decorators = [(0, sequelize_typescript_1.Default)(TaskStatus.NOT_STARTED), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(TaskStatus)))];
        _priority_decorators = [(0, sequelize_typescript_1.Default)(TaskPriority.MEDIUM), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(TaskPriority)))];
        _assignedToId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _assignedById_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _parentTaskId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _startDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _dueDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _completedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _estimatedHours_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _actualHours_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _percentComplete_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _dependencies_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _tags_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _checklistItems_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _blockers_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _metadata_decorators = [(0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _updatedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _matter_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => LegalMatterModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _assignedToId_decorators, { kind: "field", name: "assignedToId", static: false, private: false, access: { has: obj => "assignedToId" in obj, get: obj => obj.assignedToId, set: (obj, value) => { obj.assignedToId = value; } }, metadata: _metadata }, _assignedToId_initializers, _assignedToId_extraInitializers);
        __esDecorate(null, null, _assignedById_decorators, { kind: "field", name: "assignedById", static: false, private: false, access: { has: obj => "assignedById" in obj, get: obj => obj.assignedById, set: (obj, value) => { obj.assignedById = value; } }, metadata: _metadata }, _assignedById_initializers, _assignedById_extraInitializers);
        __esDecorate(null, null, _parentTaskId_decorators, { kind: "field", name: "parentTaskId", static: false, private: false, access: { has: obj => "parentTaskId" in obj, get: obj => obj.parentTaskId, set: (obj, value) => { obj.parentTaskId = value; } }, metadata: _metadata }, _parentTaskId_initializers, _parentTaskId_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
        __esDecorate(null, null, _completedDate_decorators, { kind: "field", name: "completedDate", static: false, private: false, access: { has: obj => "completedDate" in obj, get: obj => obj.completedDate, set: (obj, value) => { obj.completedDate = value; } }, metadata: _metadata }, _completedDate_initializers, _completedDate_extraInitializers);
        __esDecorate(null, null, _estimatedHours_decorators, { kind: "field", name: "estimatedHours", static: false, private: false, access: { has: obj => "estimatedHours" in obj, get: obj => obj.estimatedHours, set: (obj, value) => { obj.estimatedHours = value; } }, metadata: _metadata }, _estimatedHours_initializers, _estimatedHours_extraInitializers);
        __esDecorate(null, null, _actualHours_decorators, { kind: "field", name: "actualHours", static: false, private: false, access: { has: obj => "actualHours" in obj, get: obj => obj.actualHours, set: (obj, value) => { obj.actualHours = value; } }, metadata: _metadata }, _actualHours_initializers, _actualHours_extraInitializers);
        __esDecorate(null, null, _percentComplete_decorators, { kind: "field", name: "percentComplete", static: false, private: false, access: { has: obj => "percentComplete" in obj, get: obj => obj.percentComplete, set: (obj, value) => { obj.percentComplete = value; } }, metadata: _metadata }, _percentComplete_initializers, _percentComplete_extraInitializers);
        __esDecorate(null, null, _dependencies_decorators, { kind: "field", name: "dependencies", static: false, private: false, access: { has: obj => "dependencies" in obj, get: obj => obj.dependencies, set: (obj, value) => { obj.dependencies = value; } }, metadata: _metadata }, _dependencies_initializers, _dependencies_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _checklistItems_decorators, { kind: "field", name: "checklistItems", static: false, private: false, access: { has: obj => "checklistItems" in obj, get: obj => obj.checklistItems, set: (obj, value) => { obj.checklistItems = value; } }, metadata: _metadata }, _checklistItems_initializers, _checklistItems_extraInitializers);
        __esDecorate(null, null, _blockers_decorators, { kind: "field", name: "blockers", static: false, private: false, access: { has: obj => "blockers" in obj, get: obj => obj.blockers, set: (obj, value) => { obj.blockers = value; } }, metadata: _metadata }, _blockers_initializers, _blockers_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _matter_decorators, { kind: "field", name: "matter", static: false, private: false, access: { has: obj => "matter" in obj, get: obj => obj.matter, set: (obj, value) => { obj.matter = value; } }, metadata: _metadata }, _matter_initializers, _matter_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProjectTaskModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProjectTaskModel = _classThis;
})();
exports.ProjectTaskModel = ProjectTaskModel;
let MilestoneModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'milestones', paranoid: true })];
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
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _targetDate_decorators;
    let _targetDate_initializers = [];
    let _targetDate_extraInitializers = [];
    let _actualDate_decorators;
    let _actualDate_initializers = [];
    let _actualDate_extraInitializers = [];
    let _deliverables_decorators;
    let _deliverables_initializers = [];
    let _deliverables_extraInitializers = [];
    let _dependencies_decorators;
    let _dependencies_initializers = [];
    let _dependencies_extraInitializers = [];
    let _criticalPath_decorators;
    let _criticalPath_initializers = [];
    let _criticalPath_extraInitializers = [];
    let _percentComplete_decorators;
    let _percentComplete_initializers = [];
    let _percentComplete_extraInitializers = [];
    let _ownerId_decorators;
    let _ownerId_initializers = [];
    let _ownerId_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _updatedBy_decorators;
    let _updatedBy_initializers = [];
    let _updatedBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _matter_decorators;
    let _matter_initializers = [];
    let _matter_extraInitializers = [];
    var MilestoneModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.matterId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _matterId_initializers, void 0));
            this.name = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.status = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.targetDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _targetDate_initializers, void 0));
            this.actualDate = (__runInitializers(this, _targetDate_extraInitializers), __runInitializers(this, _actualDate_initializers, void 0));
            this.deliverables = (__runInitializers(this, _actualDate_extraInitializers), __runInitializers(this, _deliverables_initializers, void 0));
            this.dependencies = (__runInitializers(this, _deliverables_extraInitializers), __runInitializers(this, _dependencies_initializers, void 0));
            this.criticalPath = (__runInitializers(this, _dependencies_extraInitializers), __runInitializers(this, _criticalPath_initializers, void 0));
            this.percentComplete = (__runInitializers(this, _criticalPath_extraInitializers), __runInitializers(this, _percentComplete_initializers, void 0));
            this.ownerId = (__runInitializers(this, _percentComplete_extraInitializers), __runInitializers(this, _ownerId_initializers, void 0));
            this.metadata = (__runInitializers(this, _ownerId_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.tenantId = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.createdBy = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.matter = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _matter_initializers, void 0));
            __runInitializers(this, _matter_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "MilestoneModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _matterId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => LegalMatterModel), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _name_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _description_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _status_decorators = [(0, sequelize_typescript_1.Default)(MilestoneStatus.PENDING), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(MilestoneStatus)))];
        _targetDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _actualDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _deliverables_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _dependencies_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _criticalPath_decorators = [(0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _percentComplete_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _ownerId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _metadata_decorators = [(0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _updatedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _matter_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => LegalMatterModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _targetDate_decorators, { kind: "field", name: "targetDate", static: false, private: false, access: { has: obj => "targetDate" in obj, get: obj => obj.targetDate, set: (obj, value) => { obj.targetDate = value; } }, metadata: _metadata }, _targetDate_initializers, _targetDate_extraInitializers);
        __esDecorate(null, null, _actualDate_decorators, { kind: "field", name: "actualDate", static: false, private: false, access: { has: obj => "actualDate" in obj, get: obj => obj.actualDate, set: (obj, value) => { obj.actualDate = value; } }, metadata: _metadata }, _actualDate_initializers, _actualDate_extraInitializers);
        __esDecorate(null, null, _deliverables_decorators, { kind: "field", name: "deliverables", static: false, private: false, access: { has: obj => "deliverables" in obj, get: obj => obj.deliverables, set: (obj, value) => { obj.deliverables = value; } }, metadata: _metadata }, _deliverables_initializers, _deliverables_extraInitializers);
        __esDecorate(null, null, _dependencies_decorators, { kind: "field", name: "dependencies", static: false, private: false, access: { has: obj => "dependencies" in obj, get: obj => obj.dependencies, set: (obj, value) => { obj.dependencies = value; } }, metadata: _metadata }, _dependencies_initializers, _dependencies_extraInitializers);
        __esDecorate(null, null, _criticalPath_decorators, { kind: "field", name: "criticalPath", static: false, private: false, access: { has: obj => "criticalPath" in obj, get: obj => obj.criticalPath, set: (obj, value) => { obj.criticalPath = value; } }, metadata: _metadata }, _criticalPath_initializers, _criticalPath_extraInitializers);
        __esDecorate(null, null, _percentComplete_decorators, { kind: "field", name: "percentComplete", static: false, private: false, access: { has: obj => "percentComplete" in obj, get: obj => obj.percentComplete, set: (obj, value) => { obj.percentComplete = value; } }, metadata: _metadata }, _percentComplete_initializers, _percentComplete_extraInitializers);
        __esDecorate(null, null, _ownerId_decorators, { kind: "field", name: "ownerId", static: false, private: false, access: { has: obj => "ownerId" in obj, get: obj => obj.ownerId, set: (obj, value) => { obj.ownerId = value; } }, metadata: _metadata }, _ownerId_initializers, _ownerId_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _matter_decorators, { kind: "field", name: "matter", static: false, private: false, access: { has: obj => "matter" in obj, get: obj => obj.matter, set: (obj, value) => { obj.matter = value; } }, metadata: _metadata }, _matter_initializers, _matter_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MilestoneModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MilestoneModel = _classThis;
})();
exports.MilestoneModel = MilestoneModel;
let ResourceAllocationModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'resource_allocations', paranoid: true })];
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
    let _resourceId_decorators;
    let _resourceId_initializers = [];
    let _resourceId_extraInitializers = [];
    let _resourceType_decorators;
    let _resourceType_initializers = [];
    let _resourceType_extraInitializers = [];
    let _roleOnMatter_decorators;
    let _roleOnMatter_initializers = [];
    let _roleOnMatter_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _allocationPercentage_decorators;
    let _allocationPercentage_initializers = [];
    let _allocationPercentage_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _estimatedHours_decorators;
    let _estimatedHours_initializers = [];
    let _estimatedHours_extraInitializers = [];
    let _actualHours_decorators;
    let _actualHours_initializers = [];
    let _actualHours_extraInitializers = [];
    let _billableRate_decorators;
    let _billableRate_initializers = [];
    let _billableRate_extraInitializers = [];
    let _costRate_decorators;
    let _costRate_initializers = [];
    let _costRate_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _updatedBy_decorators;
    let _updatedBy_initializers = [];
    let _updatedBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _matter_decorators;
    let _matter_initializers = [];
    let _matter_extraInitializers = [];
    var ResourceAllocationModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.matterId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _matterId_initializers, void 0));
            this.resourceId = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _resourceId_initializers, void 0));
            this.resourceType = (__runInitializers(this, _resourceId_extraInitializers), __runInitializers(this, _resourceType_initializers, void 0));
            this.roleOnMatter = (__runInitializers(this, _resourceType_extraInitializers), __runInitializers(this, _roleOnMatter_initializers, void 0));
            this.status = (__runInitializers(this, _roleOnMatter_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.allocationPercentage = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _allocationPercentage_initializers, void 0));
            this.startDate = (__runInitializers(this, _allocationPercentage_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.estimatedHours = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _estimatedHours_initializers, void 0));
            this.actualHours = (__runInitializers(this, _estimatedHours_extraInitializers), __runInitializers(this, _actualHours_initializers, void 0));
            this.billableRate = (__runInitializers(this, _actualHours_extraInitializers), __runInitializers(this, _billableRate_initializers, void 0));
            this.costRate = (__runInitializers(this, _billableRate_extraInitializers), __runInitializers(this, _costRate_initializers, void 0));
            this.metadata = (__runInitializers(this, _costRate_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.tenantId = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.createdBy = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.matter = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _matter_initializers, void 0));
            __runInitializers(this, _matter_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ResourceAllocationModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _matterId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => LegalMatterModel), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _resourceId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _resourceType_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('attorney', 'paralegal', 'staff', 'expert', 'vendor'))];
        _roleOnMatter_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _status_decorators = [(0, sequelize_typescript_1.Default)(ResourceAllocationStatus.REQUESTED), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(ResourceAllocationStatus)))];
        _allocationPercentage_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2))];
        _startDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _endDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _estimatedHours_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _actualHours_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _billableRate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _costRate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _metadata_decorators = [(0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _updatedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _matter_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => LegalMatterModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
        __esDecorate(null, null, _resourceId_decorators, { kind: "field", name: "resourceId", static: false, private: false, access: { has: obj => "resourceId" in obj, get: obj => obj.resourceId, set: (obj, value) => { obj.resourceId = value; } }, metadata: _metadata }, _resourceId_initializers, _resourceId_extraInitializers);
        __esDecorate(null, null, _resourceType_decorators, { kind: "field", name: "resourceType", static: false, private: false, access: { has: obj => "resourceType" in obj, get: obj => obj.resourceType, set: (obj, value) => { obj.resourceType = value; } }, metadata: _metadata }, _resourceType_initializers, _resourceType_extraInitializers);
        __esDecorate(null, null, _roleOnMatter_decorators, { kind: "field", name: "roleOnMatter", static: false, private: false, access: { has: obj => "roleOnMatter" in obj, get: obj => obj.roleOnMatter, set: (obj, value) => { obj.roleOnMatter = value; } }, metadata: _metadata }, _roleOnMatter_initializers, _roleOnMatter_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _allocationPercentage_decorators, { kind: "field", name: "allocationPercentage", static: false, private: false, access: { has: obj => "allocationPercentage" in obj, get: obj => obj.allocationPercentage, set: (obj, value) => { obj.allocationPercentage = value; } }, metadata: _metadata }, _allocationPercentage_initializers, _allocationPercentage_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _estimatedHours_decorators, { kind: "field", name: "estimatedHours", static: false, private: false, access: { has: obj => "estimatedHours" in obj, get: obj => obj.estimatedHours, set: (obj, value) => { obj.estimatedHours = value; } }, metadata: _metadata }, _estimatedHours_initializers, _estimatedHours_extraInitializers);
        __esDecorate(null, null, _actualHours_decorators, { kind: "field", name: "actualHours", static: false, private: false, access: { has: obj => "actualHours" in obj, get: obj => obj.actualHours, set: (obj, value) => { obj.actualHours = value; } }, metadata: _metadata }, _actualHours_initializers, _actualHours_extraInitializers);
        __esDecorate(null, null, _billableRate_decorators, { kind: "field", name: "billableRate", static: false, private: false, access: { has: obj => "billableRate" in obj, get: obj => obj.billableRate, set: (obj, value) => { obj.billableRate = value; } }, metadata: _metadata }, _billableRate_initializers, _billableRate_extraInitializers);
        __esDecorate(null, null, _costRate_decorators, { kind: "field", name: "costRate", static: false, private: false, access: { has: obj => "costRate" in obj, get: obj => obj.costRate, set: (obj, value) => { obj.costRate = value; } }, metadata: _metadata }, _costRate_initializers, _costRate_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _matter_decorators, { kind: "field", name: "matter", static: false, private: false, access: { has: obj => "matter" in obj, get: obj => obj.matter, set: (obj, value) => { obj.matter = value; } }, metadata: _metadata }, _matter_initializers, _matter_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ResourceAllocationModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ResourceAllocationModel = _classThis;
})();
exports.ResourceAllocationModel = ResourceAllocationModel;
let MatterBudgetModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'matter_budgets', paranoid: true })];
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
    let _budgetType_decorators;
    let _budgetType_initializers = [];
    let _budgetType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _totalBudget_decorators;
    let _totalBudget_initializers = [];
    let _totalBudget_extraInitializers = [];
    let _laborBudget_decorators;
    let _laborBudget_initializers = [];
    let _laborBudget_extraInitializers = [];
    let _expenseBudget_decorators;
    let _expenseBudget_initializers = [];
    let _expenseBudget_extraInitializers = [];
    let _actualSpent_decorators;
    let _actualSpent_initializers = [];
    let _actualSpent_extraInitializers = [];
    let _committed_decorators;
    let _committed_initializers = [];
    let _committed_extraInitializers = [];
    let _remaining_decorators;
    let _remaining_initializers = [];
    let _remaining_extraInitializers = [];
    let _variance_decorators;
    let _variance_initializers = [];
    let _variance_extraInitializers = [];
    let _variancePercentage_decorators;
    let _variancePercentage_initializers = [];
    let _variancePercentage_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _periodStart_decorators;
    let _periodStart_initializers = [];
    let _periodStart_extraInitializers = [];
    let _periodEnd_decorators;
    let _periodEnd_initializers = [];
    let _periodEnd_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvedAt_decorators;
    let _approvedAt_initializers = [];
    let _approvedAt_extraInitializers = [];
    let _lastReviewDate_decorators;
    let _lastReviewDate_initializers = [];
    let _lastReviewDate_extraInitializers = [];
    let _forecastAtCompletion_decorators;
    let _forecastAtCompletion_initializers = [];
    let _forecastAtCompletion_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _updatedBy_decorators;
    let _updatedBy_initializers = [];
    let _updatedBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _matter_decorators;
    let _matter_initializers = [];
    let _matter_extraInitializers = [];
    var MatterBudgetModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.matterId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _matterId_initializers, void 0));
            this.budgetType = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _budgetType_initializers, void 0));
            this.status = (__runInitializers(this, _budgetType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.totalBudget = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _totalBudget_initializers, void 0));
            this.laborBudget = (__runInitializers(this, _totalBudget_extraInitializers), __runInitializers(this, _laborBudget_initializers, void 0));
            this.expenseBudget = (__runInitializers(this, _laborBudget_extraInitializers), __runInitializers(this, _expenseBudget_initializers, void 0));
            this.actualSpent = (__runInitializers(this, _expenseBudget_extraInitializers), __runInitializers(this, _actualSpent_initializers, void 0));
            this.committed = (__runInitializers(this, _actualSpent_extraInitializers), __runInitializers(this, _committed_initializers, void 0));
            this.remaining = (__runInitializers(this, _committed_extraInitializers), __runInitializers(this, _remaining_initializers, void 0));
            this.variance = (__runInitializers(this, _remaining_extraInitializers), __runInitializers(this, _variance_initializers, void 0));
            this.variancePercentage = (__runInitializers(this, _variance_extraInitializers), __runInitializers(this, _variancePercentage_initializers, void 0));
            this.currency = (__runInitializers(this, _variancePercentage_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
            this.periodStart = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _periodStart_initializers, void 0));
            this.periodEnd = (__runInitializers(this, _periodStart_extraInitializers), __runInitializers(this, _periodEnd_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _periodEnd_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvedAt = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvedAt_initializers, void 0));
            this.lastReviewDate = (__runInitializers(this, _approvedAt_extraInitializers), __runInitializers(this, _lastReviewDate_initializers, void 0));
            this.forecastAtCompletion = (__runInitializers(this, _lastReviewDate_extraInitializers), __runInitializers(this, _forecastAtCompletion_initializers, void 0));
            this.metadata = (__runInitializers(this, _forecastAtCompletion_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.tenantId = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.createdBy = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.matter = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _matter_initializers, void 0));
            __runInitializers(this, _matter_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "MatterBudgetModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _matterId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => LegalMatterModel), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _budgetType_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('overall', 'phase', 'task', 'category'))];
        _status_decorators = [(0, sequelize_typescript_1.Default)(BudgetStatus.DRAFT), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(BudgetStatus)))];
        _totalBudget_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _laborBudget_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _expenseBudget_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _actualSpent_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _committed_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _remaining_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _variance_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _variancePercentage_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2))];
        _currency_decorators = [(0, sequelize_typescript_1.Default)('USD'), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _periodStart_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _periodEnd_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _approvedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _lastReviewDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _forecastAtCompletion_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _metadata_decorators = [(0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _updatedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _matter_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => LegalMatterModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
        __esDecorate(null, null, _budgetType_decorators, { kind: "field", name: "budgetType", static: false, private: false, access: { has: obj => "budgetType" in obj, get: obj => obj.budgetType, set: (obj, value) => { obj.budgetType = value; } }, metadata: _metadata }, _budgetType_initializers, _budgetType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _totalBudget_decorators, { kind: "field", name: "totalBudget", static: false, private: false, access: { has: obj => "totalBudget" in obj, get: obj => obj.totalBudget, set: (obj, value) => { obj.totalBudget = value; } }, metadata: _metadata }, _totalBudget_initializers, _totalBudget_extraInitializers);
        __esDecorate(null, null, _laborBudget_decorators, { kind: "field", name: "laborBudget", static: false, private: false, access: { has: obj => "laborBudget" in obj, get: obj => obj.laborBudget, set: (obj, value) => { obj.laborBudget = value; } }, metadata: _metadata }, _laborBudget_initializers, _laborBudget_extraInitializers);
        __esDecorate(null, null, _expenseBudget_decorators, { kind: "field", name: "expenseBudget", static: false, private: false, access: { has: obj => "expenseBudget" in obj, get: obj => obj.expenseBudget, set: (obj, value) => { obj.expenseBudget = value; } }, metadata: _metadata }, _expenseBudget_initializers, _expenseBudget_extraInitializers);
        __esDecorate(null, null, _actualSpent_decorators, { kind: "field", name: "actualSpent", static: false, private: false, access: { has: obj => "actualSpent" in obj, get: obj => obj.actualSpent, set: (obj, value) => { obj.actualSpent = value; } }, metadata: _metadata }, _actualSpent_initializers, _actualSpent_extraInitializers);
        __esDecorate(null, null, _committed_decorators, { kind: "field", name: "committed", static: false, private: false, access: { has: obj => "committed" in obj, get: obj => obj.committed, set: (obj, value) => { obj.committed = value; } }, metadata: _metadata }, _committed_initializers, _committed_extraInitializers);
        __esDecorate(null, null, _remaining_decorators, { kind: "field", name: "remaining", static: false, private: false, access: { has: obj => "remaining" in obj, get: obj => obj.remaining, set: (obj, value) => { obj.remaining = value; } }, metadata: _metadata }, _remaining_initializers, _remaining_extraInitializers);
        __esDecorate(null, null, _variance_decorators, { kind: "field", name: "variance", static: false, private: false, access: { has: obj => "variance" in obj, get: obj => obj.variance, set: (obj, value) => { obj.variance = value; } }, metadata: _metadata }, _variance_initializers, _variance_extraInitializers);
        __esDecorate(null, null, _variancePercentage_decorators, { kind: "field", name: "variancePercentage", static: false, private: false, access: { has: obj => "variancePercentage" in obj, get: obj => obj.variancePercentage, set: (obj, value) => { obj.variancePercentage = value; } }, metadata: _metadata }, _variancePercentage_initializers, _variancePercentage_extraInitializers);
        __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
        __esDecorate(null, null, _periodStart_decorators, { kind: "field", name: "periodStart", static: false, private: false, access: { has: obj => "periodStart" in obj, get: obj => obj.periodStart, set: (obj, value) => { obj.periodStart = value; } }, metadata: _metadata }, _periodStart_initializers, _periodStart_extraInitializers);
        __esDecorate(null, null, _periodEnd_decorators, { kind: "field", name: "periodEnd", static: false, private: false, access: { has: obj => "periodEnd" in obj, get: obj => obj.periodEnd, set: (obj, value) => { obj.periodEnd = value; } }, metadata: _metadata }, _periodEnd_initializers, _periodEnd_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvedAt_decorators, { kind: "field", name: "approvedAt", static: false, private: false, access: { has: obj => "approvedAt" in obj, get: obj => obj.approvedAt, set: (obj, value) => { obj.approvedAt = value; } }, metadata: _metadata }, _approvedAt_initializers, _approvedAt_extraInitializers);
        __esDecorate(null, null, _lastReviewDate_decorators, { kind: "field", name: "lastReviewDate", static: false, private: false, access: { has: obj => "lastReviewDate" in obj, get: obj => obj.lastReviewDate, set: (obj, value) => { obj.lastReviewDate = value; } }, metadata: _metadata }, _lastReviewDate_initializers, _lastReviewDate_extraInitializers);
        __esDecorate(null, null, _forecastAtCompletion_decorators, { kind: "field", name: "forecastAtCompletion", static: false, private: false, access: { has: obj => "forecastAtCompletion" in obj, get: obj => obj.forecastAtCompletion, set: (obj, value) => { obj.forecastAtCompletion = value; } }, metadata: _metadata }, _forecastAtCompletion_initializers, _forecastAtCompletion_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _matter_decorators, { kind: "field", name: "matter", static: false, private: false, access: { has: obj => "matter" in obj, get: obj => obj.matter, set: (obj, value) => { obj.matter = value; } }, metadata: _metadata }, _matter_initializers, _matter_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MatterBudgetModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MatterBudgetModel = _classThis;
})();
exports.MatterBudgetModel = MatterBudgetModel;
let StatusReportModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'status_reports', paranoid: false })];
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
    let _reportType_decorators;
    let _reportType_initializers = [];
    let _reportType_extraInitializers = [];
    let _reportDate_decorators;
    let _reportDate_initializers = [];
    let _reportDate_extraInitializers = [];
    let _periodStart_decorators;
    let _periodStart_initializers = [];
    let _periodStart_extraInitializers = [];
    let _periodEnd_decorators;
    let _periodEnd_initializers = [];
    let _periodEnd_extraInitializers = [];
    let _summary_decorators;
    let _summary_initializers = [];
    let _summary_extraInitializers = [];
    let _accomplishments_decorators;
    let _accomplishments_initializers = [];
    let _accomplishments_extraInitializers = [];
    let _upcomingTasks_decorators;
    let _upcomingTasks_initializers = [];
    let _upcomingTasks_extraInitializers = [];
    let _issues_decorators;
    let _issues_initializers = [];
    let _issues_extraInitializers = [];
    let _risks_decorators;
    let _risks_initializers = [];
    let _risks_extraInitializers = [];
    let _budgetStatus_decorators;
    let _budgetStatus_initializers = [];
    let _budgetStatus_extraInitializers = [];
    let _scheduleStatus_decorators;
    let _scheduleStatus_initializers = [];
    let _scheduleStatus_extraInitializers = [];
    let _resourceStatus_decorators;
    let _resourceStatus_initializers = [];
    let _resourceStatus_extraInitializers = [];
    let _milestonesAchieved_decorators;
    let _milestonesAchieved_initializers = [];
    let _milestonesAchieved_extraInitializers = [];
    let _nextMilestones_decorators;
    let _nextMilestones_initializers = [];
    let _nextMilestones_extraInitializers = [];
    let _recommendations_decorators;
    let _recommendations_initializers = [];
    let _recommendations_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _recipientIds_decorators;
    let _recipientIds_initializers = [];
    let _recipientIds_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _matter_decorators;
    let _matter_initializers = [];
    let _matter_extraInitializers = [];
    var StatusReportModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.matterId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _matterId_initializers, void 0));
            this.reportType = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _reportType_initializers, void 0));
            this.reportDate = (__runInitializers(this, _reportType_extraInitializers), __runInitializers(this, _reportDate_initializers, void 0));
            this.periodStart = (__runInitializers(this, _reportDate_extraInitializers), __runInitializers(this, _periodStart_initializers, void 0));
            this.periodEnd = (__runInitializers(this, _periodStart_extraInitializers), __runInitializers(this, _periodEnd_initializers, void 0));
            this.summary = (__runInitializers(this, _periodEnd_extraInitializers), __runInitializers(this, _summary_initializers, void 0));
            this.accomplishments = (__runInitializers(this, _summary_extraInitializers), __runInitializers(this, _accomplishments_initializers, void 0));
            this.upcomingTasks = (__runInitializers(this, _accomplishments_extraInitializers), __runInitializers(this, _upcomingTasks_initializers, void 0));
            this.issues = (__runInitializers(this, _upcomingTasks_extraInitializers), __runInitializers(this, _issues_initializers, void 0));
            this.risks = (__runInitializers(this, _issues_extraInitializers), __runInitializers(this, _risks_initializers, void 0));
            this.budgetStatus = (__runInitializers(this, _risks_extraInitializers), __runInitializers(this, _budgetStatus_initializers, void 0));
            this.scheduleStatus = (__runInitializers(this, _budgetStatus_extraInitializers), __runInitializers(this, _scheduleStatus_initializers, void 0));
            this.resourceStatus = (__runInitializers(this, _scheduleStatus_extraInitializers), __runInitializers(this, _resourceStatus_initializers, void 0));
            this.milestonesAchieved = (__runInitializers(this, _resourceStatus_extraInitializers), __runInitializers(this, _milestonesAchieved_initializers, void 0));
            this.nextMilestones = (__runInitializers(this, _milestonesAchieved_extraInitializers), __runInitializers(this, _nextMilestones_initializers, void 0));
            this.recommendations = (__runInitializers(this, _nextMilestones_extraInitializers), __runInitializers(this, _recommendations_initializers, void 0));
            this.attachments = (__runInitializers(this, _recommendations_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.recipientIds = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _recipientIds_initializers, void 0));
            this.metadata = (__runInitializers(this, _recipientIds_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.tenantId = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.createdBy = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.matter = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _matter_initializers, void 0));
            __runInitializers(this, _matter_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "StatusReportModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _matterId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => LegalMatterModel), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _reportType_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(ReportType)))];
        _reportDate_decorators = [(0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.NOW), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _periodStart_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _periodEnd_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _summary_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _accomplishments_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _upcomingTasks_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _issues_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _risks_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _budgetStatus_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _scheduleStatus_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _resourceStatus_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _milestonesAchieved_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _nextMilestones_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _recommendations_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _attachments_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _recipientIds_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _metadata_decorators = [(0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _matter_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => LegalMatterModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
        __esDecorate(null, null, _reportType_decorators, { kind: "field", name: "reportType", static: false, private: false, access: { has: obj => "reportType" in obj, get: obj => obj.reportType, set: (obj, value) => { obj.reportType = value; } }, metadata: _metadata }, _reportType_initializers, _reportType_extraInitializers);
        __esDecorate(null, null, _reportDate_decorators, { kind: "field", name: "reportDate", static: false, private: false, access: { has: obj => "reportDate" in obj, get: obj => obj.reportDate, set: (obj, value) => { obj.reportDate = value; } }, metadata: _metadata }, _reportDate_initializers, _reportDate_extraInitializers);
        __esDecorate(null, null, _periodStart_decorators, { kind: "field", name: "periodStart", static: false, private: false, access: { has: obj => "periodStart" in obj, get: obj => obj.periodStart, set: (obj, value) => { obj.periodStart = value; } }, metadata: _metadata }, _periodStart_initializers, _periodStart_extraInitializers);
        __esDecorate(null, null, _periodEnd_decorators, { kind: "field", name: "periodEnd", static: false, private: false, access: { has: obj => "periodEnd" in obj, get: obj => obj.periodEnd, set: (obj, value) => { obj.periodEnd = value; } }, metadata: _metadata }, _periodEnd_initializers, _periodEnd_extraInitializers);
        __esDecorate(null, null, _summary_decorators, { kind: "field", name: "summary", static: false, private: false, access: { has: obj => "summary" in obj, get: obj => obj.summary, set: (obj, value) => { obj.summary = value; } }, metadata: _metadata }, _summary_initializers, _summary_extraInitializers);
        __esDecorate(null, null, _accomplishments_decorators, { kind: "field", name: "accomplishments", static: false, private: false, access: { has: obj => "accomplishments" in obj, get: obj => obj.accomplishments, set: (obj, value) => { obj.accomplishments = value; } }, metadata: _metadata }, _accomplishments_initializers, _accomplishments_extraInitializers);
        __esDecorate(null, null, _upcomingTasks_decorators, { kind: "field", name: "upcomingTasks", static: false, private: false, access: { has: obj => "upcomingTasks" in obj, get: obj => obj.upcomingTasks, set: (obj, value) => { obj.upcomingTasks = value; } }, metadata: _metadata }, _upcomingTasks_initializers, _upcomingTasks_extraInitializers);
        __esDecorate(null, null, _issues_decorators, { kind: "field", name: "issues", static: false, private: false, access: { has: obj => "issues" in obj, get: obj => obj.issues, set: (obj, value) => { obj.issues = value; } }, metadata: _metadata }, _issues_initializers, _issues_extraInitializers);
        __esDecorate(null, null, _risks_decorators, { kind: "field", name: "risks", static: false, private: false, access: { has: obj => "risks" in obj, get: obj => obj.risks, set: (obj, value) => { obj.risks = value; } }, metadata: _metadata }, _risks_initializers, _risks_extraInitializers);
        __esDecorate(null, null, _budgetStatus_decorators, { kind: "field", name: "budgetStatus", static: false, private: false, access: { has: obj => "budgetStatus" in obj, get: obj => obj.budgetStatus, set: (obj, value) => { obj.budgetStatus = value; } }, metadata: _metadata }, _budgetStatus_initializers, _budgetStatus_extraInitializers);
        __esDecorate(null, null, _scheduleStatus_decorators, { kind: "field", name: "scheduleStatus", static: false, private: false, access: { has: obj => "scheduleStatus" in obj, get: obj => obj.scheduleStatus, set: (obj, value) => { obj.scheduleStatus = value; } }, metadata: _metadata }, _scheduleStatus_initializers, _scheduleStatus_extraInitializers);
        __esDecorate(null, null, _resourceStatus_decorators, { kind: "field", name: "resourceStatus", static: false, private: false, access: { has: obj => "resourceStatus" in obj, get: obj => obj.resourceStatus, set: (obj, value) => { obj.resourceStatus = value; } }, metadata: _metadata }, _resourceStatus_initializers, _resourceStatus_extraInitializers);
        __esDecorate(null, null, _milestonesAchieved_decorators, { kind: "field", name: "milestonesAchieved", static: false, private: false, access: { has: obj => "milestonesAchieved" in obj, get: obj => obj.milestonesAchieved, set: (obj, value) => { obj.milestonesAchieved = value; } }, metadata: _metadata }, _milestonesAchieved_initializers, _milestonesAchieved_extraInitializers);
        __esDecorate(null, null, _nextMilestones_decorators, { kind: "field", name: "nextMilestones", static: false, private: false, access: { has: obj => "nextMilestones" in obj, get: obj => obj.nextMilestones, set: (obj, value) => { obj.nextMilestones = value; } }, metadata: _metadata }, _nextMilestones_initializers, _nextMilestones_extraInitializers);
        __esDecorate(null, null, _recommendations_decorators, { kind: "field", name: "recommendations", static: false, private: false, access: { has: obj => "recommendations" in obj, get: obj => obj.recommendations, set: (obj, value) => { obj.recommendations = value; } }, metadata: _metadata }, _recommendations_initializers, _recommendations_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _recipientIds_decorators, { kind: "field", name: "recipientIds", static: false, private: false, access: { has: obj => "recipientIds" in obj, get: obj => obj.recipientIds, set: (obj, value) => { obj.recipientIds = value; } }, metadata: _metadata }, _recipientIds_initializers, _recipientIds_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _matter_decorators, { kind: "field", name: "matter", static: false, private: false, access: { has: obj => "matter" in obj, get: obj => obj.matter, set: (obj, value) => { obj.matter = value; } }, metadata: _metadata }, _matter_initializers, _matter_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StatusReportModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StatusReportModel = _classThis;
})();
exports.StatusReportModel = StatusReportModel;
let ProjectTemplateModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'project_templates', paranoid: false })];
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
    let _matterType_decorators;
    let _matterType_initializers = [];
    let _matterType_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _defaultTasks_decorators;
    let _defaultTasks_initializers = [];
    let _defaultTasks_extraInitializers = [];
    let _defaultMilestones_decorators;
    let _defaultMilestones_initializers = [];
    let _defaultMilestones_extraInitializers = [];
    let _estimatedDuration_decorators;
    let _estimatedDuration_initializers = [];
    let _estimatedDuration_extraInitializers = [];
    let _estimatedBudget_decorators;
    let _estimatedBudget_initializers = [];
    let _estimatedBudget_extraInitializers = [];
    let _requiredRoles_decorators;
    let _requiredRoles_initializers = [];
    let _requiredRoles_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var ProjectTemplateModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.matterType = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _matterType_initializers, void 0));
            this.description = (__runInitializers(this, _matterType_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.defaultTasks = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _defaultTasks_initializers, void 0));
            this.defaultMilestones = (__runInitializers(this, _defaultTasks_extraInitializers), __runInitializers(this, _defaultMilestones_initializers, void 0));
            this.estimatedDuration = (__runInitializers(this, _defaultMilestones_extraInitializers), __runInitializers(this, _estimatedDuration_initializers, void 0));
            this.estimatedBudget = (__runInitializers(this, _estimatedDuration_extraInitializers), __runInitializers(this, _estimatedBudget_initializers, void 0));
            this.requiredRoles = (__runInitializers(this, _estimatedBudget_extraInitializers), __runInitializers(this, _requiredRoles_initializers, void 0));
            this.metadata = (__runInitializers(this, _requiredRoles_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.tenantId = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.isActive = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ProjectTemplateModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _name_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _matterType_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(MatterType)))];
        _description_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _defaultTasks_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _defaultMilestones_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _estimatedDuration_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _estimatedBudget_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _requiredRoles_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _metadata_decorators = [(0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _isActive_decorators = [(0, sequelize_typescript_1.Default)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _matterType_decorators, { kind: "field", name: "matterType", static: false, private: false, access: { has: obj => "matterType" in obj, get: obj => obj.matterType, set: (obj, value) => { obj.matterType = value; } }, metadata: _metadata }, _matterType_initializers, _matterType_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _defaultTasks_decorators, { kind: "field", name: "defaultTasks", static: false, private: false, access: { has: obj => "defaultTasks" in obj, get: obj => obj.defaultTasks, set: (obj, value) => { obj.defaultTasks = value; } }, metadata: _metadata }, _defaultTasks_initializers, _defaultTasks_extraInitializers);
        __esDecorate(null, null, _defaultMilestones_decorators, { kind: "field", name: "defaultMilestones", static: false, private: false, access: { has: obj => "defaultMilestones" in obj, get: obj => obj.defaultMilestones, set: (obj, value) => { obj.defaultMilestones = value; } }, metadata: _metadata }, _defaultMilestones_initializers, _defaultMilestones_extraInitializers);
        __esDecorate(null, null, _estimatedDuration_decorators, { kind: "field", name: "estimatedDuration", static: false, private: false, access: { has: obj => "estimatedDuration" in obj, get: obj => obj.estimatedDuration, set: (obj, value) => { obj.estimatedDuration = value; } }, metadata: _metadata }, _estimatedDuration_initializers, _estimatedDuration_extraInitializers);
        __esDecorate(null, null, _estimatedBudget_decorators, { kind: "field", name: "estimatedBudget", static: false, private: false, access: { has: obj => "estimatedBudget" in obj, get: obj => obj.estimatedBudget, set: (obj, value) => { obj.estimatedBudget = value; } }, metadata: _metadata }, _estimatedBudget_initializers, _estimatedBudget_extraInitializers);
        __esDecorate(null, null, _requiredRoles_decorators, { kind: "field", name: "requiredRoles", static: false, private: false, access: { has: obj => "requiredRoles" in obj, get: obj => obj.requiredRoles, set: (obj, value) => { obj.requiredRoles = value; } }, metadata: _metadata }, _requiredRoles_initializers, _requiredRoles_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProjectTemplateModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProjectTemplateModel = _classThis;
})();
exports.ProjectTemplateModel = ProjectTemplateModel;
// ============================================================================
// NESTJS SERVICE
// ============================================================================
let LegalProjectManagementService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var LegalProjectManagementService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
            this.logger = new common_1.Logger(LegalProjectManagementService.name);
        }
        // ========================================================================
        // MATTER PLANNING FUNCTIONS (Functions 1-7)
        // ========================================================================
        /**
         * Function 1: Create new legal matter
         */
        async createMatter(data, userId, tenantId) {
            const validated = exports.CreateMatterSchema.parse(data);
            // Generate matter number if not provided
            if (!validated.matterNumber) {
                validated.matterNumber = await this.generateMatterNumber(tenantId);
            }
            const matter = await LegalMatterModel.create({
                ...validated,
                status: MatterStatus.PROSPECTIVE,
                actualHours: 0,
                createdBy: userId,
                tenantId,
            });
            this.logger.log(`Matter created: ${matter.id} - ${matter.matterNumber}`);
            return matter.toJSON();
        }
        /**
         * Function 2: Update legal matter
         */
        async updateMatter(matterId, data, userId) {
            const validated = exports.UpdateMatterSchema.parse(data);
            const matter = await LegalMatterModel.findByPk(matterId);
            if (!matter) {
                throw new common_1.NotFoundException(`Matter ${matterId} not found`);
            }
            await matter.update({
                ...validated,
                updatedBy: userId,
            });
            this.logger.log(`Matter updated: ${matterId}`);
            return matter.toJSON();
        }
        /**
         * Function 3: Get matter details with related data
         */
        async getMatterDetails(matterId) {
            const matter = await LegalMatterModel.findByPk(matterId, {
                include: [
                    { model: ProjectTaskModel, as: 'tasks' },
                    { model: MilestoneModel, as: 'milestones' },
                    { model: ResourceAllocationModel, as: 'resources' },
                    { model: MatterBudgetModel, as: 'budget' },
                ],
            });
            if (!matter) {
                throw new common_1.NotFoundException(`Matter ${matterId} not found`);
            }
            return matter.toJSON();
        }
        /**
         * Function 4: Create matter from template
         */
        async createMatterFromTemplate(templateId, matterData, userId, tenantId) {
            const template = await ProjectTemplateModel.findByPk(templateId);
            if (!template) {
                throw new common_1.NotFoundException(`Template ${templateId} not found`);
            }
            const transaction = await this.sequelize.transaction();
            try {
                // Create matter
                const matter = await this.createMatter(matterData, userId, tenantId);
                // Create tasks from template
                if (template.defaultTasks && template.defaultTasks.length > 0) {
                    const startDate = matter.openDate;
                    for (const templateTask of template.defaultTasks) {
                        const taskStartDate = new Date(startDate);
                        if (templateTask.daysFromStart) {
                            taskStartDate.setDate(taskStartDate.getDate() + templateTask.daysFromStart);
                        }
                        await ProjectTaskModel.create({
                            matterId: matter.id,
                            title: templateTask.title,
                            description: templateTask.description,
                            status: TaskStatus.NOT_STARTED,
                            priority: TaskPriority.MEDIUM,
                            assignedById: userId,
                            startDate: taskStartDate,
                            estimatedHours: templateTask.estimatedHours,
                            dependencies: templateTask.dependencies,
                            percentComplete: 0,
                            metadata: {},
                            createdBy: userId,
                            tenantId,
                        }, { transaction });
                    }
                }
                // Create milestones from template
                if (template.defaultMilestones && template.defaultMilestones.length > 0) {
                    const startDate = matter.openDate;
                    for (const templateMilestone of template.defaultMilestones) {
                        const milestoneDate = new Date(startDate);
                        milestoneDate.setDate(milestoneDate.getDate() + templateMilestone.daysFromStart);
                        await MilestoneModel.create({
                            matterId: matter.id,
                            name: templateMilestone.name,
                            description: templateMilestone.description,
                            status: MilestoneStatus.PENDING,
                            targetDate: milestoneDate,
                            deliverables: templateMilestone.deliverables,
                            criticalPath: false,
                            percentComplete: 0,
                            metadata: {},
                            createdBy: userId,
                            tenantId,
                        }, { transaction });
                    }
                }
                await transaction.commit();
                this.logger.log(`Matter created from template: ${matter.id}`);
                return matter;
            }
            catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
        /**
         * Function 5: Define matter scope and objectives
         */
        async updateMatterScope(matterId, scope, objectives, constraints, assumptions, userId) {
            const matter = await LegalMatterModel.findByPk(matterId);
            if (!matter) {
                throw new common_1.NotFoundException(`Matter ${matterId} not found`);
            }
            await matter.update({
                scope,
                objectives,
                constraints,
                assumptions,
                updatedBy: userId,
            });
            this.logger.log(`Matter scope updated: ${matterId}`);
            return matter.toJSON();
        }
        /**
         * Function 6: List matters with filters
         */
        async listMatters(filters) {
            const where = {};
            if (filters.status)
                where['status'] = filters.status;
            if (filters.matterType)
                where['matterType'] = filters.matterType;
            if (filters.priority)
                where['priority'] = filters.priority;
            if (filters.clientId)
                where['clientId'] = filters.clientId;
            if (filters.responsibleAttorneyId)
                where['responsibleAttorneyId'] = filters.responsibleAttorneyId;
            if (filters.tenantId)
                where['tenantId'] = filters.tenantId;
            const { rows, count } = await LegalMatterModel.findAndCountAll({
                where,
                limit: filters.limit || 50,
                offset: filters.offset || 0,
                order: [['createdAt', 'DESC']],
            });
            return {
                matters: rows.map(r => r.toJSON()),
                total: count,
            };
        }
        /**
         * Function 7: Close matter
         */
        async closeMatter(matterId, userId) {
            const matter = await LegalMatterModel.findByPk(matterId);
            if (!matter) {
                throw new common_1.NotFoundException(`Matter ${matterId} not found`);
            }
            await matter.update({
                status: MatterStatus.CLOSED,
                closeDate: new Date(),
                updatedBy: userId,
            });
            this.logger.log(`Matter closed: ${matterId}`);
            return matter.toJSON();
        }
        // ========================================================================
        // BUDGETING FUNCTIONS (Functions 8-13)
        // ========================================================================
        /**
         * Function 8: Create matter budget
         */
        async createBudget(data, userId, tenantId) {
            const validated = exports.CreateBudgetSchema.parse(data);
            const budget = await MatterBudgetModel.create({
                ...validated,
                status: BudgetStatus.DRAFT,
                actualSpent: 0,
                committed: 0,
                remaining: validated.totalBudget,
                variance: 0,
                variancePercentage: 0,
                createdBy: userId,
                tenantId,
            });
            this.logger.log(`Budget created: ${budget.id} for matter ${data.matterId}`);
            return budget.toJSON();
        }
        /**
         * Function 9: Update budget actuals
         */
        async updateBudgetActuals(budgetId, actualSpent, committed, userId) {
            const budget = await MatterBudgetModel.findByPk(budgetId);
            if (!budget) {
                throw new common_1.NotFoundException(`Budget ${budgetId} not found`);
            }
            const remaining = budget.totalBudget - actualSpent - committed;
            const variance = budget.totalBudget - actualSpent;
            const variancePercentage = (variance / budget.totalBudget) * 100;
            await budget.update({
                actualSpent,
                committed,
                remaining,
                variance,
                variancePercentage,
                status: actualSpent > budget.totalBudget ? BudgetStatus.EXCEEDED : budget.status,
                lastReviewDate: new Date(),
                updatedBy: userId,
            });
            this.logger.log(`Budget actuals updated: ${budgetId}`);
            return budget.toJSON();
        }
        /**
         * Function 10: Get budget variance report
         */
        async getBudgetVarianceReport(matterId) {
            const budget = await MatterBudgetModel.findOne({
                where: { matterId, budgetType: 'overall' },
            });
            if (!budget) {
                throw new common_1.NotFoundException(`Budget for matter ${matterId} not found`);
            }
            const isOverBudget = budget.actualSpent > budget.totalBudget;
            const projectedOverrun = isOverBudget ? budget.actualSpent - budget.totalBudget : undefined;
            return {
                budget: budget.toJSON(),
                variance: budget.variance,
                variancePercentage: budget.variancePercentage,
                isOverBudget,
                projectedOverrun,
            };
        }
        /**
         * Function 11: Approve budget
         */
        async approveBudget(budgetId, approverId) {
            const budget = await MatterBudgetModel.findByPk(budgetId);
            if (!budget) {
                throw new common_1.NotFoundException(`Budget ${budgetId} not found`);
            }
            await budget.update({
                status: BudgetStatus.APPROVED,
                approvedBy: approverId,
                approvedAt: new Date(),
                updatedBy: approverId,
            });
            this.logger.log(`Budget approved: ${budgetId}`);
            return budget.toJSON();
        }
        /**
         * Function 12: Calculate forecast at completion
         */
        async calculateForecastAtCompletion(budgetId) {
            const budget = await MatterBudgetModel.findByPk(budgetId);
            if (!budget) {
                throw new common_1.NotFoundException(`Budget ${budgetId} not found`);
            }
            const matter = await LegalMatterModel.findByPk(budget.matterId);
            if (!matter || !matter.estimatedHours || matter.actualHours === 0) {
                return budget.actualSpent;
            }
            // Calculate cost performance index
            const earnedValue = (matter.actualHours / matter.estimatedHours) * budget.totalBudget;
            const cpi = earnedValue / budget.actualSpent;
            // Forecast at completion = Actual + (Remaining / CPI)
            const forecast = budget.actualSpent + ((budget.totalBudget - earnedValue) / cpi);
            await budget.update({ forecastAtCompletion: forecast });
            return forecast;
        }
        /**
         * Function 13: Get budget summary by category
         */
        async getBudgetSummaryByCategory(matterId) {
            const budgets = await MatterBudgetModel.findAll({
                where: { matterId },
            });
            const total = budgets.reduce((sum, b) => sum + b.totalBudget, 0);
            const byCategory = budgets.map(b => ({
                category: b.budgetType,
                budgeted: b.totalBudget,
                actual: b.actualSpent,
                variance: b.variance,
            }));
            return { total, byCategory };
        }
        // ========================================================================
        // TASK TRACKING FUNCTIONS (Functions 14-20)
        // ========================================================================
        /**
         * Function 14: Create project task
         */
        async createTask(data, userId, tenantId) {
            const validated = exports.CreateTaskSchema.parse(data);
            const task = await ProjectTaskModel.create({
                ...validated,
                assignedById: userId,
                percentComplete: 0,
                actualHours: 0,
                createdBy: userId,
                tenantId,
            });
            this.logger.log(`Task created: ${task.id} for matter ${data.matterId}`);
            return task.toJSON();
        }
        /**
         * Function 15: Update task status
         */
        async updateTaskStatus(taskId, status, percentComplete, userId) {
            const task = await ProjectTaskModel.findByPk(taskId);
            if (!task) {
                throw new common_1.NotFoundException(`Task ${taskId} not found`);
            }
            const updates = {
                status,
                updatedBy: userId,
            };
            if (percentComplete !== undefined) {
                updates.percentComplete = percentComplete;
            }
            if (status === TaskStatus.COMPLETED) {
                updates.completedDate = new Date();
                updates.percentComplete = 100;
            }
            await task.update(updates);
            this.logger.log(`Task status updated: ${taskId} -> ${status}`);
            return task.toJSON();
        }
        /**
         * Function 16: Assign task to user
         */
        async assignTask(taskId, assignedToId, assignedById) {
            const task = await ProjectTaskModel.findByPk(taskId);
            if (!task) {
                throw new common_1.NotFoundException(`Task ${taskId} not found`);
            }
            await task.update({
                assignedToId,
                assignedById,
                status: task.status === TaskStatus.NOT_STARTED ? TaskStatus.IN_PROGRESS : task.status,
                updatedBy: assignedById,
            });
            this.logger.log(`Task assigned: ${taskId} -> ${assignedToId}`);
            return task.toJSON();
        }
        /**
         * Function 17: Get task dependencies
         */
        async getTaskDependencies(taskId) {
            const task = await ProjectTaskModel.findByPk(taskId);
            if (!task || !task.dependencies || task.dependencies.length === 0) {
                return [];
            }
            const dependencies = await ProjectTaskModel.findAll({
                where: {
                    id: { [sequelize_1.Op.in]: task.dependencies },
                },
            });
            return dependencies.map(d => d.toJSON());
        }
        /**
         * Function 18: Update task progress
         */
        async updateTaskProgress(taskId, percentComplete, actualHours, userId) {
            const task = await ProjectTaskModel.findByPk(taskId);
            if (!task) {
                throw new common_1.NotFoundException(`Task ${taskId} not found`);
            }
            const updates = {
                percentComplete,
                updatedBy: userId,
            };
            if (actualHours !== undefined) {
                updates.actualHours = actualHours;
            }
            if (percentComplete === 100 && task.status !== TaskStatus.COMPLETED) {
                updates.status = TaskStatus.COMPLETED;
                updates.completedDate = new Date();
            }
            await task.update(updates);
            this.logger.log(`Task progress updated: ${taskId} -> ${percentComplete}%`);
            return task.toJSON();
        }
        /**
         * Function 19: Get tasks by matter
         */
        async getTasksByMatter(matterId, filters) {
            const where = { matterId };
            if (filters?.status)
                where['status'] = filters.status;
            if (filters?.assignedToId)
                where['assignedToId'] = filters.assignedToId;
            if (filters?.priority)
                where['priority'] = filters.priority;
            const tasks = await ProjectTaskModel.findAll({
                where,
                order: [['dueDate', 'ASC'], ['priority', 'DESC']],
            });
            return tasks.map(t => t.toJSON());
        }
        /**
         * Function 20: Get overdue tasks
         */
        async getOverdueTasks(tenantId) {
            const where = {
                dueDate: { [sequelize_1.Op.lt]: new Date() },
                status: { [sequelize_1.Op.notIn]: [TaskStatus.COMPLETED, TaskStatus.CANCELLED] },
            };
            if (tenantId)
                where['tenantId'] = tenantId;
            const tasks = await ProjectTaskModel.findAll({
                where,
                order: [['dueDate', 'ASC']],
            });
            return tasks.map(t => t.toJSON());
        }
        // ========================================================================
        // MILESTONE MANAGEMENT FUNCTIONS (Functions 21-25)
        // ========================================================================
        /**
         * Function 21: Create milestone
         */
        async createMilestone(data, userId, tenantId) {
            const validated = exports.CreateMilestoneSchema.parse(data);
            const milestone = await MilestoneModel.create({
                ...validated,
                status: MilestoneStatus.PENDING,
                percentComplete: 0,
                createdBy: userId,
                tenantId,
            });
            this.logger.log(`Milestone created: ${milestone.id} for matter ${data.matterId}`);
            return milestone.toJSON();
        }
        /**
         * Function 22: Update milestone status
         */
        async updateMilestoneStatus(milestoneId, status, actualDate, userId) {
            const milestone = await MilestoneModel.findByPk(milestoneId);
            if (!milestone) {
                throw new common_1.NotFoundException(`Milestone ${milestoneId} not found`);
            }
            const updates = {
                status,
                updatedBy: userId,
            };
            if (status === MilestoneStatus.COMPLETED) {
                updates.actualDate = actualDate || new Date();
                updates.percentComplete = 100;
            }
            await milestone.update(updates);
            this.logger.log(`Milestone status updated: ${milestoneId} -> ${status}`);
            return milestone.toJSON();
        }
        /**
         * Function 23: Get milestones by matter
         */
        async getMilestonesByMatter(matterId) {
            const milestones = await MilestoneModel.findAll({
                where: { matterId },
                order: [['targetDate', 'ASC']],
            });
            return milestones.map(m => m.toJSON());
        }
        /**
         * Function 24: Get critical path milestones
         */
        async getCriticalPathMilestones(matterId) {
            const milestones = await MilestoneModel.findAll({
                where: { matterId, criticalPath: true },
                order: [['targetDate', 'ASC']],
            });
            return milestones.map(m => m.toJSON());
        }
        /**
         * Function 25: Track milestone deliverables
         */
        async updateMilestoneDeliverables(milestoneId, deliverables, userId) {
            const milestone = await MilestoneModel.findByPk(milestoneId);
            if (!milestone) {
                throw new common_1.NotFoundException(`Milestone ${milestoneId} not found`);
            }
            await milestone.update({
                deliverables,
                updatedBy: userId,
            });
            this.logger.log(`Milestone deliverables updated: ${milestoneId}`);
            return milestone.toJSON();
        }
        // ========================================================================
        // RESOURCE ALLOCATION FUNCTIONS (Functions 26-30)
        // ========================================================================
        /**
         * Function 26: Allocate resource to matter
         */
        async allocateResource(data, userId, tenantId) {
            const validated = exports.CreateResourceAllocationSchema.parse(data);
            const allocation = await ResourceAllocationModel.create({
                ...validated,
                status: ResourceAllocationStatus.REQUESTED,
                actualHours: 0,
                createdBy: userId,
                tenantId,
            });
            this.logger.log(`Resource allocated: ${allocation.id} for matter ${data.matterId}`);
            return allocation.toJSON();
        }
        /**
         * Function 27: Update resource allocation
         */
        async updateResourceAllocation(allocationId, data, userId) {
            const validated = exports.UpdateResourceAllocationSchema.parse(data);
            const allocation = await ResourceAllocationModel.findByPk(allocationId);
            if (!allocation) {
                throw new common_1.NotFoundException(`Resource allocation ${allocationId} not found`);
            }
            await allocation.update({
                ...validated,
                updatedBy: userId,
            });
            this.logger.log(`Resource allocation updated: ${allocationId}`);
            return allocation.toJSON();
        }
        /**
         * Function 28: Get resource allocations by matter
         */
        async getResourceAllocationsByMatter(matterId) {
            const allocations = await ResourceAllocationModel.findAll({
                where: { matterId },
                order: [['startDate', 'ASC']],
            });
            return allocations.map(a => a.toJSON());
        }
        /**
         * Function 29: Calculate resource utilization
         */
        async calculateResourceUtilization(resourceId, periodStart, periodEnd) {
            const allocations = await ResourceAllocationModel.findAll({
                where: {
                    resourceId,
                    status: ResourceAllocationStatus.ACTIVE,
                    startDate: { [sequelize_1.Op.lte]: periodEnd },
                    [sequelize_1.Op.or]: [
                        { endDate: { [sequelize_1.Op.gte]: periodStart } },
                        { endDate: null },
                    ],
                },
            });
            const totalAllocated = allocations.reduce((sum, a) => sum + (a.estimatedHours || 0), 0);
            const totalActual = allocations.reduce((sum, a) => sum + (a.actualHours || 0), 0);
            const utilizationRate = totalAllocated > 0 ? (totalActual / totalAllocated) * 100 : 0;
            return {
                totalAllocated,
                totalActual,
                utilizationRate,
                activeMatters: allocations.length,
            };
        }
        /**
         * Function 30: Get resource capacity report
         */
        async getResourceCapacityReport(resourceIds, periodStart, periodEnd) {
            const assumedCapacity = 160; // hours per month
            const results = await Promise.all(resourceIds.map(async (resourceId) => {
                const allocations = await ResourceAllocationModel.findAll({
                    where: {
                        resourceId,
                        status: ResourceAllocationStatus.ACTIVE,
                        startDate: { [sequelize_1.Op.lte]: periodEnd },
                        [sequelize_1.Op.or]: [
                            { endDate: { [sequelize_1.Op.gte]: periodStart } },
                            { endDate: null },
                        ],
                    },
                });
                const allocated = allocations.reduce((sum, a) => sum + (a.estimatedHours || 0), 0);
                const available = assumedCapacity - allocated;
                return {
                    resourceId,
                    allocated,
                    available,
                    overallocated: allocated > assumedCapacity,
                };
            }));
            return results;
        }
        // ========================================================================
        // STATUS REPORTING FUNCTIONS (Functions 31-35)
        // ========================================================================
        /**
         * Function 31: Create status report
         */
        async createStatusReport(data, userId, tenantId) {
            const validated = exports.CreateStatusReportSchema.parse(data);
            const report = await StatusReportModel.create({
                ...validated,
                reportDate: new Date(),
                createdBy: userId,
                tenantId,
            });
            this.logger.log(`Status report created: ${report.id} for matter ${data.matterId}`);
            return report.toJSON();
        }
        /**
         * Function 32: Generate comprehensive status report
         */
        async generateComprehensiveStatusReport(matterId, periodStart, periodEnd, userId, tenantId) {
            // Get matter details
            const matter = await LegalMatterModel.findByPk(matterId);
            if (!matter) {
                throw new common_1.NotFoundException(`Matter ${matterId} not found`);
            }
            // Get tasks summary
            const tasks = await ProjectTaskModel.findAll({ where: { matterId } });
            const scheduleStatus = {
                totalTasks: tasks.length,
                completedTasks: tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
                inProgressTasks: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
                delayedTasks: tasks.filter(t => t.dueDate && t.dueDate < new Date() && t.status !== TaskStatus.COMPLETED).length,
                upcomingDeadlines: tasks.filter(t => {
                    if (!t.dueDate)
                        return false;
                    const daysUntilDue = Math.floor((t.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    return daysUntilDue >= 0 && daysUntilDue <= 7;
                }).length,
                criticalPathStatus: 'on_track',
            };
            // Get budget summary
            const budget = await MatterBudgetModel.findOne({
                where: { matterId, budgetType: 'overall' },
            });
            const budgetStatus = budget ? {
                budgeted: budget.totalBudget,
                spent: budget.actualSpent,
                committed: budget.committed,
                remaining: budget.remaining,
                variance: budget.variance,
                variancePercentage: budget.variancePercentage,
                atRisk: budget.actualSpent > budget.totalBudget * 0.9,
            } : undefined;
            // Get resource summary
            const resources = await ResourceAllocationModel.findAll({
                where: { matterId, status: ResourceAllocationStatus.ACTIVE },
            });
            const resourceStatus = {
                totalResources: resources.length,
                activeResources: resources.length,
                utilization: 0, // Would calculate based on actual vs estimated hours
                overallocated: 0,
                underutilized: 0,
            };
            // Create comprehensive report
            const report = await StatusReportModel.create({
                matterId,
                reportType: ReportType.EXECUTIVE_SUMMARY,
                reportDate: new Date(),
                periodStart,
                periodEnd,
                summary: `Status report for ${matter.title} (${matter.matterNumber})`,
                scheduleStatus,
                budgetStatus,
                resourceStatus,
                metadata: {},
                createdBy: userId,
                tenantId,
            });
            this.logger.log(`Comprehensive status report generated: ${report.id}`);
            return report.toJSON();
        }
        /**
         * Function 33: Get status reports by matter
         */
        async getStatusReportsByMatter(matterId, reportType) {
            const where = { matterId };
            if (reportType)
                where['reportType'] = reportType;
            const reports = await StatusReportModel.findAll({
                where,
                order: [['reportDate', 'DESC']],
            });
            return reports.map(r => r.toJSON());
        }
        /**
         * Function 34: Generate Gantt chart data
         */
        async generateGanttChartData(matterId) {
            const tasks = await ProjectTaskModel.findAll({
                where: { matterId },
                order: [['startDate', 'ASC']],
            });
            const milestones = await MilestoneModel.findAll({
                where: { matterId },
                order: [['targetDate', 'ASC']],
            });
            return {
                tasks: tasks.map(t => ({
                    id: t.id,
                    name: t.title,
                    start: t.startDate || t.createdAt,
                    end: t.dueDate || t.createdAt,
                    progress: t.percentComplete,
                    dependencies: t.dependencies || [],
                })),
                milestones: milestones.map(m => ({
                    id: m.id,
                    name: m.name,
                    date: m.targetDate,
                })),
            };
        }
        /**
         * Function 35: Calculate project health score
         */
        async calculateProjectHealthScore(matterId) {
            // Get tasks and calculate schedule health
            const tasks = await ProjectTaskModel.findAll({ where: { matterId } });
            const completedOnTime = tasks.filter(t => t.status === TaskStatus.COMPLETED &&
                (!t.dueDate || !t.completedDate || t.completedDate <= t.dueDate)).length;
            const scheduleHealth = tasks.length > 0 ? (completedOnTime / tasks.length) * 100 : 100;
            // Get budget and calculate budget health
            const budget = await MatterBudgetModel.findOne({
                where: { matterId, budgetType: 'overall' },
            });
            const budgetHealth = budget
                ? Math.max(0, 100 - Math.abs(budget.variancePercentage))
                : 100;
            // Calculate resource health (simplified)
            const resources = await ResourceAllocationModel.findAll({
                where: { matterId, status: ResourceAllocationStatus.ACTIVE },
            });
            const resourceHealth = resources.length > 0 ? 75 : 50; // Simplified calculation
            // Overall score
            const overallScore = (scheduleHealth + budgetHealth + resourceHealth) / 3;
            // Determine risk level
            let riskLevel;
            if (overallScore >= 80)
                riskLevel = RiskLevel.LOW;
            else if (overallScore >= 60)
                riskLevel = RiskLevel.MEDIUM;
            else if (overallScore >= 40)
                riskLevel = RiskLevel.HIGH;
            else
                riskLevel = RiskLevel.CRITICAL;
            return {
                overallScore,
                scheduleHealth,
                budgetHealth,
                resourceHealth,
                riskLevel,
            };
        }
        // ========================================================================
        // UTILITY FUNCTIONS (Functions 36-39)
        // ========================================================================
        /**
         * Function 36: Generate unique matter number
         */
        async generateMatterNumber(tenantId) {
            const year = new Date().getFullYear();
            const prefix = tenantId ? tenantId.substring(0, 4).toUpperCase() : 'MAT';
            // Count existing matters for this year
            const count = await LegalMatterModel.count({
                where: {
                    matterNumber: { [sequelize_1.Op.like]: `${prefix}-${year}-%` },
                    ...(tenantId ? { tenantId } : {}),
                },
            });
            const sequence = String(count + 1).padStart(6, '0');
            return `${prefix}-${year}-${sequence}`;
        }
        /**
         * Function 37: Validate task dependencies
         */
        async validateTaskDependencies(taskId) {
            const task = await ProjectTaskModel.findByPk(taskId);
            if (!task || !task.dependencies || task.dependencies.length === 0) {
                return { valid: true, blockedBy: [], canStart: true };
            }
            const dependencies = await ProjectTaskModel.findAll({
                where: { id: { [sequelize_1.Op.in]: task.dependencies } },
            });
            const blockedBy = dependencies
                .filter(d => d.status !== TaskStatus.COMPLETED)
                .map(d => d.id);
            return {
                valid: blockedBy.length === 0,
                blockedBy,
                canStart: blockedBy.length === 0,
            };
        }
        /**
         * Function 38: Archive closed matters
         */
        async archiveClosedMatters(closedBeforeDate, tenantId) {
            const where = {
                status: MatterStatus.CLOSED,
                closeDate: { [sequelize_1.Op.lt]: closedBeforeDate },
            };
            if (tenantId)
                where['tenantId'] = tenantId;
            const [affectedCount] = await LegalMatterModel.update({ status: MatterStatus.ARCHIVED }, { where });
            this.logger.log(`Archived ${affectedCount} closed matters`);
            return affectedCount;
        }
        /**
         * Function 39: Get matter statistics
         */
        async getMatterStatistics(tenantId) {
            const where = {};
            if (tenantId)
                where['tenantId'] = tenantId;
            const matters = await LegalMatterModel.findAll({ where });
            const byStatus = {};
            const byType = {};
            const byPriority = {};
            Object.values(MatterStatus).forEach(s => byStatus[s] = 0);
            Object.values(MatterType).forEach(t => byType[t] = 0);
            Object.values(MatterPriority).forEach(p => byPriority[p] = 0);
            let totalBudget = 0;
            let budgetCount = 0;
            matters.forEach(m => {
                byStatus[m.status]++;
                byType[m.matterType]++;
                byPriority[m.priority]++;
                if (m.budgetAmount) {
                    totalBudget += m.budgetAmount;
                    budgetCount++;
                }
            });
            return {
                totalMatters: matters.length,
                byStatus,
                byType,
                byPriority,
                averageBudget: budgetCount > 0 ? totalBudget / budgetCount : 0,
                totalBudget,
            };
        }
    };
    __setFunctionName(_classThis, "LegalProjectManagementService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LegalProjectManagementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LegalProjectManagementService = _classThis;
})();
exports.LegalProjectManagementService = LegalProjectManagementService;
// ============================================================================
// NESTJS MODULE
// ============================================================================
let LegalProjectManagementModule = (() => {
    let _classDecorators = [(0, common_1.Global)(), (0, common_1.Module)({
            providers: [LegalProjectManagementService],
            exports: [LegalProjectManagementService],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var LegalProjectManagementModule = _classThis = class {
        static forRoot() {
            return {
                module: LegalProjectManagementModule,
                providers: [LegalProjectManagementService],
                exports: [LegalProjectManagementService],
            };
        }
    };
    __setFunctionName(_classThis, "LegalProjectManagementModule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LegalProjectManagementModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LegalProjectManagementModule = _classThis;
})();
exports.LegalProjectManagementModule = LegalProjectManagementModule;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    LegalProjectManagementService,
    LegalProjectManagementModule,
    // Models
    LegalMatterModel,
    ProjectTaskModel,
    MilestoneModel,
    ResourceAllocationModel,
    MatterBudgetModel,
    StatusReportModel,
    ProjectTemplateModel,
    // DTOs
    CreateMatterDto,
    UpdateMatterDto,
    CreateTaskDto,
    UpdateTaskDto,
    CreateMilestoneDto,
    UpdateMilestoneDto,
    CreateResourceAllocationDto,
    UpdateResourceAllocationDto,
    CreateBudgetDto,
    UpdateBudgetDto,
    CreateStatusReportDto,
    // Schemas
    CreateMatterSchema: exports.CreateMatterSchema,
    UpdateMatterSchema: exports.UpdateMatterSchema,
    CreateTaskSchema: exports.CreateTaskSchema,
    UpdateTaskSchema: exports.UpdateTaskSchema,
    CreateMilestoneSchema: exports.CreateMilestoneSchema,
    UpdateMilestoneSchema: exports.UpdateMilestoneSchema,
    CreateResourceAllocationSchema: exports.CreateResourceAllocationSchema,
    UpdateResourceAllocationSchema: exports.UpdateResourceAllocationSchema,
    CreateBudgetSchema: exports.CreateBudgetSchema,
    UpdateBudgetSchema: exports.UpdateBudgetSchema,
    CreateStatusReportSchema: exports.CreateStatusReportSchema,
    // Enums
    MatterStatus,
    MatterPriority,
    MatterType,
    TaskStatus,
    TaskPriority,
    MilestoneStatus,
    ResourceAllocationStatus,
    BudgetStatus,
    ExpenseType,
    ReportType,
    RiskLevel,
};
//# sourceMappingURL=legal-project-management-kit.js.map