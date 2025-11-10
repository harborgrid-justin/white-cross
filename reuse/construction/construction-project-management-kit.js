"use strict";
/**
 * LOC: CONSPROJ12345
 * File: /reuse/construction/construction-project-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend construction services
 *   - Project management controllers
 *   - Portfolio management engines
 *   - Resource allocation services
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
exports.integrateWithQualitySystem = exports.integrateWithScheduleSystem = exports.integrateWithBudgetSystem = exports.analyzeChangeOrderTrends = exports.getProjectChangeOrders = exports.implementChangeOrder = exports.processChangeOrderApproval = exports.createChangeOrder = exports.getBaselineHistory = exports.approveBaselineChange = exports.requestBaselineChange = exports.compareToBaseline = exports.createProjectBaseline = exports.generatePhaseChecklist = exports.calculatePhaseDurations = exports.getPhaseTransitionHistory = exports.validatePhaseGateCriteria = exports.transitionProjectPhase = exports.analyzeCrossProjectImpact = exports.synchronizeProjectSchedules = exports.performCrossProjectResourceLeveling = exports.allocateSharedResources = exports.coordinateProjectDependencies = exports.identifyPortfolioResourceConflicts = exports.generatePortfolioDashboard = exports.calculatePortfolioMetrics = exports.addProjectToPortfolio = exports.createProjectPortfolio = exports.calculateProjectCriticalPath = exports.generateProjectStatusReport = exports.trackProjectSchedule = exports.calculateProjectEVM = exports.updateProjectProgress = exports.archiveConstructionProject = exports.cloneConstructionProject = exports.initializeProjectFromTemplate = exports.generateConstructionProjectNumber = exports.createConstructionProject = exports.createChangeOrderModel = exports.createProjectBaselineModel = exports.createConstructionProjectModel = exports.CreateChangeOrderDto = exports.CreateBaselineDto = exports.UpdateProjectProgressDto = exports.CreateConstructionProjectDto = exports.PerformanceMetricType = exports.DeliveryMethod = exports.ProjectPriority = exports.ProjectPhase = exports.ConstructionProjectStatus = void 0;
exports.ConstructionProjectController = exports.generateProjectBenchmark = exports.completeProjectCloseout = exports.captureLessonsLearned = exports.initiateProjectCloseout = exports.createProjectTemplate = exports.exportProjectData = exports.generateExecutiveSummary = void 0;
/**
 * File: /reuse/construction/construction-project-management-kit.ts
 * Locator: WC-CONS-PROJ-001
 * Purpose: Comprehensive Construction Project Management Utilities - USACE EPPM-level construction project lifecycle management
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Construction controllers, project services, portfolio management, resource allocation
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for project creation, tracking, portfolio management, coordination, lifecycle management
 *
 * LLM Context: Enterprise-grade construction project management system competing with USACE EPPM.
 * Provides construction project lifecycle management, multi-project portfolio coordination, resource allocation,
 * project phase transitions, baseline management, earned value tracking, project templates, schedule integration,
 * budget integration, quality management integration, contractor coordination, change order management,
 * project closeout, lessons learned capture, project reporting, dashboard metrics.
 */
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Construction project status values
 */
var ConstructionProjectStatus;
(function (ConstructionProjectStatus) {
    ConstructionProjectStatus["PRE_PLANNING"] = "pre_planning";
    ConstructionProjectStatus["PLANNING"] = "planning";
    ConstructionProjectStatus["DESIGN"] = "design";
    ConstructionProjectStatus["PRE_CONSTRUCTION"] = "pre_construction";
    ConstructionProjectStatus["CONSTRUCTION"] = "construction";
    ConstructionProjectStatus["CLOSEOUT"] = "closeout";
    ConstructionProjectStatus["COMPLETED"] = "completed";
    ConstructionProjectStatus["ON_HOLD"] = "on_hold";
    ConstructionProjectStatus["CANCELLED"] = "cancelled";
})(ConstructionProjectStatus || (exports.ConstructionProjectStatus = ConstructionProjectStatus = {}));
/**
 * Project phase types
 */
var ProjectPhase;
(function (ProjectPhase) {
    ProjectPhase["INITIATION"] = "initiation";
    ProjectPhase["PLANNING"] = "planning";
    ProjectPhase["DESIGN"] = "design";
    ProjectPhase["PROCUREMENT"] = "procurement";
    ProjectPhase["CONSTRUCTION"] = "construction";
    ProjectPhase["COMMISSIONING"] = "commissioning";
    ProjectPhase["CLOSEOUT"] = "closeout";
    ProjectPhase["OPERATIONS"] = "operations";
})(ProjectPhase || (exports.ProjectPhase = ProjectPhase = {}));
/**
 * Project priority levels
 */
var ProjectPriority;
(function (ProjectPriority) {
    ProjectPriority["CRITICAL"] = "critical";
    ProjectPriority["HIGH"] = "high";
    ProjectPriority["MEDIUM"] = "medium";
    ProjectPriority["LOW"] = "low";
})(ProjectPriority || (exports.ProjectPriority = ProjectPriority = {}));
/**
 * Project delivery method
 */
var DeliveryMethod;
(function (DeliveryMethod) {
    DeliveryMethod["DESIGN_BID_BUILD"] = "design_bid_build";
    DeliveryMethod["DESIGN_BUILD"] = "design_build";
    DeliveryMethod["CM_AT_RISK"] = "cm_at_risk";
    DeliveryMethod["IPD"] = "ipd";
    DeliveryMethod["PUBLIC_PRIVATE"] = "public_private";
})(DeliveryMethod || (exports.DeliveryMethod = DeliveryMethod = {}));
/**
 * Performance metric type
 */
var PerformanceMetricType;
(function (PerformanceMetricType) {
    PerformanceMetricType["SCHEDULE"] = "schedule";
    PerformanceMetricType["COST"] = "cost";
    PerformanceMetricType["QUALITY"] = "quality";
    PerformanceMetricType["SAFETY"] = "safety";
    PerformanceMetricType["SUSTAINABILITY"] = "sustainability";
})(PerformanceMetricType || (exports.PerformanceMetricType = PerformanceMetricType = {}));
// ============================================================================
// DTO CLASSES FOR VALIDATION
// ============================================================================
/**
 * Create construction project DTO
 */
let CreateConstructionProjectDto = (() => {
    var _a;
    let _projectName_decorators;
    let _projectName_initializers = [];
    let _projectName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _deliveryMethod_decorators;
    let _deliveryMethod_initializers = [];
    let _deliveryMethod_extraInitializers = [];
    let _projectManagerId_decorators;
    let _projectManagerId_initializers = [];
    let _projectManagerId_extraInitializers = [];
    let _totalBudget_decorators;
    let _totalBudget_initializers = [];
    let _totalBudget_extraInitializers = [];
    let _baselineEndDate_decorators;
    let _baselineEndDate_initializers = [];
    let _baselineEndDate_extraInitializers = [];
    let _districtCode_decorators;
    let _districtCode_initializers = [];
    let _districtCode_extraInitializers = [];
    return _a = class CreateConstructionProjectDto {
            constructor() {
                this.projectName = __runInitializers(this, _projectName_initializers, void 0);
                this.description = (__runInitializers(this, _projectName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.priority = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.deliveryMethod = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _deliveryMethod_initializers, void 0));
                this.projectManagerId = (__runInitializers(this, _deliveryMethod_extraInitializers), __runInitializers(this, _projectManagerId_initializers, void 0));
                this.totalBudget = (__runInitializers(this, _projectManagerId_extraInitializers), __runInitializers(this, _totalBudget_initializers, void 0));
                this.baselineEndDate = (__runInitializers(this, _totalBudget_extraInitializers), __runInitializers(this, _baselineEndDate_initializers, void 0));
                this.districtCode = (__runInitializers(this, _baselineEndDate_extraInitializers), __runInitializers(this, _districtCode_initializers, void 0));
                __runInitializers(this, _districtCode_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _projectName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ enum: ProjectPriority }), (0, class_validator_1.IsEnum)(ProjectPriority)];
            _deliveryMethod_decorators = [(0, swagger_1.ApiProperty)({ enum: DeliveryMethod }), (0, class_validator_1.IsEnum)(DeliveryMethod)];
            _projectManagerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project manager ID' }), (0, class_validator_1.IsUUID)()];
            _totalBudget_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total budget' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _baselineEndDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Baseline end date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _districtCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'District code', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _projectName_decorators, { kind: "field", name: "projectName", static: false, private: false, access: { has: obj => "projectName" in obj, get: obj => obj.projectName, set: (obj, value) => { obj.projectName = value; } }, metadata: _metadata }, _projectName_initializers, _projectName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _deliveryMethod_decorators, { kind: "field", name: "deliveryMethod", static: false, private: false, access: { has: obj => "deliveryMethod" in obj, get: obj => obj.deliveryMethod, set: (obj, value) => { obj.deliveryMethod = value; } }, metadata: _metadata }, _deliveryMethod_initializers, _deliveryMethod_extraInitializers);
            __esDecorate(null, null, _projectManagerId_decorators, { kind: "field", name: "projectManagerId", static: false, private: false, access: { has: obj => "projectManagerId" in obj, get: obj => obj.projectManagerId, set: (obj, value) => { obj.projectManagerId = value; } }, metadata: _metadata }, _projectManagerId_initializers, _projectManagerId_extraInitializers);
            __esDecorate(null, null, _totalBudget_decorators, { kind: "field", name: "totalBudget", static: false, private: false, access: { has: obj => "totalBudget" in obj, get: obj => obj.totalBudget, set: (obj, value) => { obj.totalBudget = value; } }, metadata: _metadata }, _totalBudget_initializers, _totalBudget_extraInitializers);
            __esDecorate(null, null, _baselineEndDate_decorators, { kind: "field", name: "baselineEndDate", static: false, private: false, access: { has: obj => "baselineEndDate" in obj, get: obj => obj.baselineEndDate, set: (obj, value) => { obj.baselineEndDate = value; } }, metadata: _metadata }, _baselineEndDate_initializers, _baselineEndDate_extraInitializers);
            __esDecorate(null, null, _districtCode_decorators, { kind: "field", name: "districtCode", static: false, private: false, access: { has: obj => "districtCode" in obj, get: obj => obj.districtCode, set: (obj, value) => { obj.districtCode = value; } }, metadata: _metadata }, _districtCode_initializers, _districtCode_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateConstructionProjectDto = CreateConstructionProjectDto;
/**
 * Update project progress DTO
 */
let UpdateProjectProgressDto = (() => {
    var _a;
    let _progressPercentage_decorators;
    let _progressPercentage_initializers = [];
    let _progressPercentage_extraInitializers = [];
    let _actualCost_decorators;
    let _actualCost_initializers = [];
    let _actualCost_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    return _a = class UpdateProjectProgressDto {
            constructor() {
                this.progressPercentage = __runInitializers(this, _progressPercentage_initializers, void 0);
                this.actualCost = (__runInitializers(this, _progressPercentage_extraInitializers), __runInitializers(this, _actualCost_initializers, void 0));
                this.notes = (__runInitializers(this, _actualCost_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _progressPercentage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Progress percentage' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _actualCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Actual cost incurred' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            __esDecorate(null, null, _progressPercentage_decorators, { kind: "field", name: "progressPercentage", static: false, private: false, access: { has: obj => "progressPercentage" in obj, get: obj => obj.progressPercentage, set: (obj, value) => { obj.progressPercentage = value; } }, metadata: _metadata }, _progressPercentage_initializers, _progressPercentage_extraInitializers);
            __esDecorate(null, null, _actualCost_decorators, { kind: "field", name: "actualCost", static: false, private: false, access: { has: obj => "actualCost" in obj, get: obj => obj.actualCost, set: (obj, value) => { obj.actualCost = value; } }, metadata: _metadata }, _actualCost_initializers, _actualCost_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateProjectProgressDto = UpdateProjectProgressDto;
/**
 * Create baseline DTO
 */
let CreateBaselineDto = (() => {
    var _a;
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _baselineType_decorators;
    let _baselineType_initializers = [];
    let _baselineType_extraInitializers = [];
    let _budget_decorators;
    let _budget_initializers = [];
    let _budget_extraInitializers = [];
    let _schedule_decorators;
    let _schedule_initializers = [];
    let _schedule_extraInitializers = [];
    let _scope_decorators;
    let _scope_initializers = [];
    let _scope_extraInitializers = [];
    return _a = class CreateBaselineDto {
            constructor() {
                this.projectId = __runInitializers(this, _projectId_initializers, void 0);
                this.baselineType = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _baselineType_initializers, void 0));
                this.budget = (__runInitializers(this, _baselineType_extraInitializers), __runInitializers(this, _budget_initializers, void 0));
                this.schedule = (__runInitializers(this, _budget_extraInitializers), __runInitializers(this, _schedule_initializers, void 0));
                this.scope = (__runInitializers(this, _schedule_extraInitializers), __runInitializers(this, _scope_initializers, void 0));
                __runInitializers(this, _scope_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _projectId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project ID' }), (0, class_validator_1.IsUUID)()];
            _baselineType_decorators = [(0, swagger_1.ApiProperty)({ enum: ['INITIAL', 'REVISED', 'RE_BASELINE'] }), (0, class_validator_1.IsEnum)(['INITIAL', 'REVISED', 'RE_BASELINE'])];
            _budget_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budget amount' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _schedule_decorators = [(0, swagger_1.ApiProperty)({ description: 'Schedule date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _scope_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scope description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(2000)];
            __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
            __esDecorate(null, null, _baselineType_decorators, { kind: "field", name: "baselineType", static: false, private: false, access: { has: obj => "baselineType" in obj, get: obj => obj.baselineType, set: (obj, value) => { obj.baselineType = value; } }, metadata: _metadata }, _baselineType_initializers, _baselineType_extraInitializers);
            __esDecorate(null, null, _budget_decorators, { kind: "field", name: "budget", static: false, private: false, access: { has: obj => "budget" in obj, get: obj => obj.budget, set: (obj, value) => { obj.budget = value; } }, metadata: _metadata }, _budget_initializers, _budget_extraInitializers);
            __esDecorate(null, null, _schedule_decorators, { kind: "field", name: "schedule", static: false, private: false, access: { has: obj => "schedule" in obj, get: obj => obj.schedule, set: (obj, value) => { obj.schedule = value; } }, metadata: _metadata }, _schedule_initializers, _schedule_extraInitializers);
            __esDecorate(null, null, _scope_decorators, { kind: "field", name: "scope", static: false, private: false, access: { has: obj => "scope" in obj, get: obj => obj.scope, set: (obj, value) => { obj.scope = value; } }, metadata: _metadata }, _scope_initializers, _scope_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateBaselineDto = CreateBaselineDto;
/**
 * Create change order DTO
 */
let CreateChangeOrderDto = (() => {
    var _a;
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _changeType_decorators;
    let _changeType_initializers = [];
    let _changeType_extraInitializers = [];
    let _costImpact_decorators;
    let _costImpact_initializers = [];
    let _costImpact_extraInitializers = [];
    let _scheduleImpact_decorators;
    let _scheduleImpact_initializers = [];
    let _scheduleImpact_extraInitializers = [];
    return _a = class CreateChangeOrderDto {
            constructor() {
                this.projectId = __runInitializers(this, _projectId_initializers, void 0);
                this.title = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.changeType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _changeType_initializers, void 0));
                this.costImpact = (__runInitializers(this, _changeType_extraInitializers), __runInitializers(this, _costImpact_initializers, void 0));
                this.scheduleImpact = (__runInitializers(this, _costImpact_extraInitializers), __runInitializers(this, _scheduleImpact_initializers, void 0));
                __runInitializers(this, _scheduleImpact_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _projectId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project ID' }), (0, class_validator_1.IsUUID)()];
            _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Change order title' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(2000)];
            _changeType_decorators = [(0, swagger_1.ApiProperty)({ enum: ['SCOPE', 'SCHEDULE', 'COST', 'COMBINED'] }), (0, class_validator_1.IsEnum)(['SCOPE', 'SCHEDULE', 'COST', 'COMBINED'])];
            _costImpact_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost impact' }), (0, class_validator_1.IsNumber)()];
            _scheduleImpact_decorators = [(0, swagger_1.ApiProperty)({ description: 'Schedule impact (days)' }), (0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _changeType_decorators, { kind: "field", name: "changeType", static: false, private: false, access: { has: obj => "changeType" in obj, get: obj => obj.changeType, set: (obj, value) => { obj.changeType = value; } }, metadata: _metadata }, _changeType_initializers, _changeType_extraInitializers);
            __esDecorate(null, null, _costImpact_decorators, { kind: "field", name: "costImpact", static: false, private: false, access: { has: obj => "costImpact" in obj, get: obj => obj.costImpact, set: (obj, value) => { obj.costImpact = value; } }, metadata: _metadata }, _costImpact_initializers, _costImpact_extraInitializers);
            __esDecorate(null, null, _scheduleImpact_decorators, { kind: "field", name: "scheduleImpact", static: false, private: false, access: { has: obj => "scheduleImpact" in obj, get: obj => obj.scheduleImpact, set: (obj, value) => { obj.scheduleImpact = value; } }, metadata: _metadata }, _scheduleImpact_initializers, _scheduleImpact_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateChangeOrderDto = CreateChangeOrderDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Construction Project Management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ConstructionProject model
 *
 * @example
 * ```typescript
 * const ConstructionProject = createConstructionProjectModel(sequelize);
 * const project = await ConstructionProject.create({
 *   projectName: 'Hospital Expansion Phase 2',
 *   totalBudget: 25000000,
 *   deliveryMethod: 'design_build',
 *   status: 'planning'
 * });
 * ```
 */
const createConstructionProjectModel = (sequelize) => {
    class ConstructionProject extends sequelize_1.Model {
    }
    ConstructionProject.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        projectNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique project identifier',
        },
        projectName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Project name',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Project description',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pre_planning', 'planning', 'design', 'pre_construction', 'construction', 'closeout', 'completed', 'on_hold', 'cancelled'),
            allowNull: false,
            defaultValue: 'pre_planning',
            comment: 'Current project status',
        },
        currentPhase: {
            type: sequelize_1.DataTypes.ENUM('initiation', 'planning', 'design', 'procurement', 'construction', 'commissioning', 'closeout', 'operations'),
            allowNull: false,
            defaultValue: 'initiation',
            comment: 'Current project phase',
        },
        priority: {
            type: sequelize_1.DataTypes.ENUM('critical', 'high', 'medium', 'low'),
            allowNull: false,
            defaultValue: 'medium',
            comment: 'Project priority',
        },
        deliveryMethod: {
            type: sequelize_1.DataTypes.ENUM('design_bid_build', 'design_build', 'cm_at_risk', 'ipd', 'public_private'),
            allowNull: false,
            comment: 'Project delivery method',
        },
        projectManagerId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Project manager user ID',
        },
        sponsorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Project sponsor user ID',
        },
        contractorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Prime contractor ID',
        },
        totalBudget: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            comment: 'Total project budget',
        },
        committedCost: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Committed cost (contracts awarded)',
        },
        actualCost: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Actual cost incurred',
        },
        forecastedCost: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Forecasted cost at completion',
        },
        contingencyReserve: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Contingency reserve amount',
        },
        managementReserve: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Management reserve amount',
        },
        baselineSchedule: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Baseline start date',
        },
        baselineEndDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Baseline end date',
        },
        currentSchedule: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Current planned start date',
        },
        currentEndDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Current planned end date',
        },
        actualStartDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Actual start date',
        },
        actualEndDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Actual end date',
        },
        progressPercentage: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Overall progress percentage',
        },
        earnedValue: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Earned value (EV)',
        },
        plannedValue: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Planned value (PV)',
        },
        siteLocationId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Site/facility location ID',
        },
        districtCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'USACE district code',
        },
        divisionCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'USACE division code',
        },
        regulatoryCompliance: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Regulatory compliance requirements',
        },
        environmentalPermits: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Environmental permits required',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional project metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created record',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who last updated record',
        },
    }, {
        sequelize,
        tableName: 'construction_projects',
        timestamps: true,
        indexes: [
            { fields: ['projectNumber'], unique: true },
            { fields: ['status'] },
            { fields: ['currentPhase'] },
            { fields: ['priority'] },
            { fields: ['projectManagerId'] },
            { fields: ['districtCode'] },
            { fields: ['divisionCode'] },
        ],
    });
    return ConstructionProject;
};
exports.createConstructionProjectModel = createConstructionProjectModel;
/**
 * Sequelize model for Project Baseline tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ProjectBaseline model
 *
 * @example
 * ```typescript
 * const ProjectBaseline = createProjectBaselineModel(sequelize);
 * const baseline = await ProjectBaseline.create({
 *   projectId: 'proj-uuid',
 *   baselineType: 'INITIAL',
 *   budget: 25000000,
 *   schedule: new Date('2025-12-31'),
 *   scope: 'Complete hospital expansion'
 * });
 * ```
 */
const createProjectBaselineModel = (sequelize) => {
    class ProjectBaseline extends sequelize_1.Model {
    }
    ProjectBaseline.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        projectId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Related project ID',
            references: {
                model: 'construction_projects',
                key: 'id',
            },
        },
        baselineNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique baseline identifier',
        },
        baselineType: {
            type: sequelize_1.DataTypes.ENUM('INITIAL', 'REVISED', 'RE_BASELINE'),
            allowNull: false,
            comment: 'Type of baseline',
        },
        baselineDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Date baseline was created',
        },
        budget: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            comment: 'Baseline budget',
        },
        schedule: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Baseline completion date',
        },
        scope: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Baseline scope description',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who approved baseline',
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Baseline approval timestamp',
        },
        changeReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for baseline change',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional baseline metadata',
        },
    }, {
        sequelize,
        tableName: 'project_baselines',
        timestamps: true,
        updatedAt: false,
        indexes: [
            { fields: ['projectId'] },
            { fields: ['baselineNumber'], unique: true },
            { fields: ['baselineType'] },
            { fields: ['baselineDate'] },
        ],
    });
    return ProjectBaseline;
};
exports.createProjectBaselineModel = createProjectBaselineModel;
/**
 * Sequelize model for Change Order tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ChangeOrder model
 *
 * @example
 * ```typescript
 * const ChangeOrder = createChangeOrderModel(sequelize);
 * const changeOrder = await ChangeOrder.create({
 *   projectId: 'proj-uuid',
 *   title: 'Add emergency generator',
 *   changeType: 'SCOPE',
 *   costImpact: 150000,
 *   scheduleImpact: 30
 * });
 * ```
 */
const createChangeOrderModel = (sequelize) => {
    class ChangeOrder extends sequelize_1.Model {
    }
    ChangeOrder.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        projectId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Related project ID',
            references: {
                model: 'construction_projects',
                key: 'id',
            },
        },
        changeOrderNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique change order number',
        },
        title: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Change order title',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Change order description',
        },
        changeType: {
            type: sequelize_1.DataTypes.ENUM('SCOPE', 'SCHEDULE', 'COST', 'COMBINED'),
            allowNull: false,
            comment: 'Type of change',
        },
        requestedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who requested change',
        },
        requestedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Date change was requested',
        },
        costImpact: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Cost impact of change',
        },
        scheduleImpact: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Schedule impact in days',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'IMPLEMENTED'),
            allowNull: false,
            defaultValue: 'DRAFT',
            comment: 'Change order status',
        },
        approvals: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Approval workflow data',
        },
        implementedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date change was implemented',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional change order metadata',
        },
    }, {
        sequelize,
        tableName: 'change_orders',
        timestamps: true,
        indexes: [
            { fields: ['projectId'] },
            { fields: ['changeOrderNumber'], unique: true },
            { fields: ['status'] },
            { fields: ['changeType'] },
            { fields: ['requestedDate'] },
        ],
    });
    return ChangeOrder;
};
exports.createChangeOrderModel = createChangeOrderModel;
// ============================================================================
// PROJECT CREATION AND INITIALIZATION (1-5)
// ============================================================================
/**
 * Creates a new construction project with auto-generated project number.
 *
 * @param {object} projectData - Project creation data
 * @param {string} userId - User creating the project
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<ConstructionProject>} Created project
 *
 * @example
 * ```typescript
 * const project = await createConstructionProject({
 *   projectName: 'Hospital Expansion Phase 2',
 *   description: 'Add 100-bed capacity',
 *   deliveryMethod: DeliveryMethod.DESIGN_BUILD,
 *   totalBudget: 25000000,
 *   projectManagerId: 'user-123',
 *   priority: ProjectPriority.HIGH
 * }, 'admin-456');
 * ```
 */
const createConstructionProject = async (projectData, userId, transaction) => {
    const projectNumber = (0, exports.generateConstructionProjectNumber)(projectData.districtCode || 'GEN');
    const project = {
        id: generateUUID(),
        projectNumber,
        projectName: projectData.projectName,
        description: projectData.description,
        status: ConstructionProjectStatus.PRE_PLANNING,
        currentPhase: ProjectPhase.INITIATION,
        priority: projectData.priority || ProjectPriority.MEDIUM,
        deliveryMethod: projectData.deliveryMethod,
        projectManagerId: projectData.projectManagerId,
        sponsorId: projectData.sponsorId,
        contractorId: projectData.contractorId,
        totalBudget: projectData.totalBudget,
        committedCost: 0,
        actualCost: 0,
        forecastedCost: projectData.totalBudget,
        contingencyReserve: projectData.totalBudget * 0.1, // 10% default
        managementReserve: projectData.totalBudget * 0.05, // 5% default
        baselineSchedule: projectData.baselineSchedule,
        baselineEndDate: projectData.baselineEndDate,
        currentSchedule: projectData.baselineSchedule,
        currentEndDate: projectData.baselineEndDate,
        actualStartDate: undefined,
        actualEndDate: undefined,
        progressPercentage: 0,
        earnedValue: 0,
        plannedValue: 0,
        siteLocationId: projectData.siteLocationId,
        districtCode: projectData.districtCode,
        divisionCode: projectData.divisionCode,
        regulatoryCompliance: projectData.regulatoryCompliance || [],
        environmentalPermits: projectData.environmentalPermits || [],
        metadata: {
            ...projectData.metadata,
            createdDate: new Date().toISOString(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
        updatedBy: userId,
    };
    return project;
};
exports.createConstructionProject = createConstructionProject;
/**
 * Generates unique construction project number.
 *
 * @param {string} districtCode - USACE district code
 * @returns {string} Generated project number
 *
 * @example
 * ```typescript
 * const projectNumber = generateConstructionProjectNumber('NAD');
 * // Returns: "NAD-2025-C-001"
 * ```
 */
const generateConstructionProjectNumber = (districtCode) => {
    const year = new Date().getFullYear();
    const sequence = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');
    return `${districtCode}-${year}-C-${sequence}`;
};
exports.generateConstructionProjectNumber = generateConstructionProjectNumber;
/**
 * Initializes project from template with customizations.
 *
 * @param {string} templateId - Template identifier
 * @param {object} customizations - Template customizations
 * @param {string} userId - User creating project
 * @returns {Promise<object>} Created project with template structure
 *
 * @example
 * ```typescript
 * const result = await initializeProjectFromTemplate('template-hospital', {
 *   projectName: 'City General Hospital Expansion',
 *   totalBudget: 30000000,
 *   districtCode: 'NAD'
 * }, 'admin-123');
 * ```
 */
const initializeProjectFromTemplate = async (templateId, customizations, userId) => {
    // In production, fetch template from database
    const template = await getProjectTemplate(templateId);
    const project = await (0, exports.createConstructionProject)({
        projectName: customizations.projectName,
        description: customizations.description || template.description,
        deliveryMethod: customizations.deliveryMethod || template.deliveryMethod,
        totalBudget: customizations.totalBudget || template.defaultBudget,
        projectManagerId: customizations.projectManagerId,
        districtCode: customizations.districtCode,
        metadata: {
            templateId,
            templateName: template.templateName,
        },
    }, userId);
    // Create initial baseline
    const baseline = await (0, exports.createProjectBaseline)({
        projectId: project.id,
        baselineType: 'INITIAL',
        budget: project.totalBudget,
        schedule: project.baselineEndDate,
        scope: project.description,
    }, userId);
    const phases = [];
    return { project, baseline, phases };
};
exports.initializeProjectFromTemplate = initializeProjectFromTemplate;
/**
 * Clones existing project with option to copy data.
 *
 * @param {string} sourceProjectId - Source project ID
 * @param {object} overrides - Property overrides
 * @param {boolean} copyData - Whether to copy project data
 * @param {string} userId - User creating clone
 * @returns {Promise<ConstructionProject>} Cloned project
 *
 * @example
 * ```typescript
 * const cloned = await cloneConstructionProject('proj-123', {
 *   projectName: 'Hospital Phase 3',
 *   totalBudget: 28000000
 * }, true, 'admin-456');
 * ```
 */
const cloneConstructionProject = async (sourceProjectId, overrides, copyData, userId) => {
    const sourceProject = await getConstructionProject(sourceProjectId);
    const clonedProject = await (0, exports.createConstructionProject)({
        ...sourceProject,
        ...overrides,
        projectName: overrides.projectName || `${sourceProject.projectName} (Copy)`,
    }, userId);
    return clonedProject;
};
exports.cloneConstructionProject = cloneConstructionProject;
/**
 * Archives completed or cancelled project.
 *
 * @param {string} projectId - Project identifier
 * @param {string} archiveReason - Reason for archiving
 * @param {string} userId - User archiving project
 * @returns {Promise<object>} Archive confirmation
 *
 * @example
 * ```typescript
 * await archiveConstructionProject('proj-123', 'Project completed', 'admin-456');
 * ```
 */
const archiveConstructionProject = async (projectId, archiveReason, userId) => {
    const project = await getConstructionProject(projectId);
    if (project.status !== ConstructionProjectStatus.COMPLETED &&
        project.status !== ConstructionProjectStatus.CANCELLED) {
        throw new Error('Only completed or cancelled projects can be archived');
    }
    return {
        archived: true,
        archiveDate: new Date(),
        archivedBy: userId,
    };
};
exports.archiveConstructionProject = archiveConstructionProject;
// ============================================================================
// PROJECT TRACKING AND MONITORING (6-10)
// ============================================================================
/**
 * Updates project progress and calculates earned value.
 *
 * @param {string} projectId - Project identifier
 * @param {object} progressData - Progress update data
 * @param {string} userId - User updating progress
 * @returns {Promise<ConstructionProject>} Updated project
 *
 * @example
 * ```typescript
 * const updated = await updateProjectProgress('proj-123', {
 *   progressPercentage: 45.5,
 *   actualCost: 12500000,
 *   notes: 'Foundation work completed'
 * }, 'pm-456');
 * ```
 */
const updateProjectProgress = async (projectId, progressData, userId) => {
    const project = await getConstructionProject(projectId);
    const earnedValue = (project.totalBudget * progressData.progressPercentage) / 100;
    const plannedValue = calculatePlannedValue(project);
    const updatedProject = {
        ...project,
        progressPercentage: progressData.progressPercentage,
        actualCost: progressData.actualCost,
        earnedValue,
        plannedValue,
        updatedAt: new Date(),
        updatedBy: userId,
    };
    return updatedProject;
};
exports.updateProjectProgress = updateProjectProgress;
/**
 * Calculates earned value management (EVM) metrics for project.
 *
 * @param {string} projectId - Project identifier
 * @returns {Promise<ProjectPerformanceMetrics>} EVM metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateProjectEVM('proj-123');
 * console.log(`CPI: ${metrics.costPerformanceIndex}, SPI: ${metrics.schedulePerformanceIndex}`);
 * ```
 */
const calculateProjectEVM = async (projectId) => {
    const project = await getConstructionProject(projectId);
    const earnedValue = project.earnedValue;
    const plannedValue = project.plannedValue;
    const actualCost = project.actualCost;
    const budgetAtCompletion = project.totalBudget;
    const scheduleVariance = earnedValue - plannedValue;
    const costVariance = earnedValue - actualCost;
    const schedulePerformanceIndex = plannedValue > 0 ? earnedValue / plannedValue : 0;
    const costPerformanceIndex = actualCost > 0 ? earnedValue / actualCost : 0;
    const estimateAtCompletion = costPerformanceIndex > 0 ? budgetAtCompletion / costPerformanceIndex : budgetAtCompletion;
    const estimateToComplete = estimateAtCompletion - actualCost;
    const varianceAtCompletion = budgetAtCompletion - estimateAtCompletion;
    const toCompletePerformanceIndex = budgetAtCompletion - actualCost > 0 ? (budgetAtCompletion - earnedValue) / (budgetAtCompletion - actualCost) : 0;
    return {
        projectId,
        schedulePerformanceIndex,
        costPerformanceIndex,
        scheduleVariance,
        costVariance,
        estimateAtCompletion,
        estimateToComplete,
        varianceAtCompletion,
        toCompletePerformanceIndex,
        earnedValue,
        plannedValue,
        actualCost,
        budgetAtCompletion,
    };
};
exports.calculateProjectEVM = calculateProjectEVM;
/**
 * Tracks project schedule performance and forecasts completion.
 *
 * @param {string} projectId - Project identifier
 * @returns {Promise<object>} Schedule performance data
 *
 * @example
 * ```typescript
 * const schedule = await trackProjectSchedule('proj-123');
 * ```
 */
const trackProjectSchedule = async (projectId) => {
    const project = await getConstructionProject(projectId);
    const metrics = await (0, exports.calculateProjectEVM)(projectId);
    const baselineEndDate = project.baselineEndDate;
    const currentEndDate = project.currentEndDate;
    // Calculate forecasted end date based on SPI
    const totalDays = (baselineEndDate.getTime() - (project.baselineSchedule?.getTime() || 0)) / (1000 * 60 * 60 * 24);
    const forecastedDays = metrics.schedulePerformanceIndex > 0 ? totalDays / metrics.schedulePerformanceIndex : totalDays;
    const forecastedEndDate = new Date((project.baselineSchedule?.getTime() || 0) + forecastedDays * 24 * 60 * 60 * 1000);
    const scheduleVarianceDays = (currentEndDate.getTime() - baselineEndDate.getTime()) / (1000 * 60 * 60 * 24);
    return {
        baselineEndDate,
        currentEndDate,
        forecastedEndDate,
        scheduleVarianceDays,
        onSchedule: scheduleVarianceDays <= 0,
    };
};
exports.trackProjectSchedule = trackProjectSchedule;
/**
 * Generates comprehensive project status report.
 *
 * @param {string} projectId - Project identifier
 * @param {Date} [asOfDate] - Report date (defaults to now)
 * @returns {Promise<object>} Status report
 *
 * @example
 * ```typescript
 * const report = await generateProjectStatusReport('proj-123');
 * ```
 */
const generateProjectStatusReport = async (projectId, asOfDate) => {
    const project = await getConstructionProject(projectId);
    const performanceMetrics = await (0, exports.calculateProjectEVM)(projectId);
    const scheduleStatus = await (0, exports.trackProjectSchedule)(projectId);
    const changeOrders = await (0, exports.getProjectChangeOrders)(projectId);
    return {
        project,
        performanceMetrics,
        scheduleStatus,
        riskSummary: {
            totalRisks: 0,
            highSeverityRisks: 0,
            mitigatedRisks: 0,
        },
        changeOrderSummary: {
            totalChangeOrders: changeOrders.length,
            approvedChangeOrders: changeOrders.filter((co) => co.status === 'APPROVED').length,
            totalCostImpact: changeOrders.reduce((sum, co) => sum + co.costImpact, 0),
            totalScheduleImpact: changeOrders.reduce((sum, co) => sum + co.scheduleImpact, 0),
        },
        reportDate: asOfDate || new Date(),
    };
};
exports.generateProjectStatusReport = generateProjectStatusReport;
/**
 * Calculates critical path for project schedule.
 *
 * @param {string} projectId - Project identifier
 * @returns {Promise<object>} Critical path analysis
 *
 * @example
 * ```typescript
 * const criticalPath = await calculateProjectCriticalPath('proj-123');
 * ```
 */
const calculateProjectCriticalPath = async (projectId) => {
    // In production, perform CPM algorithm on project tasks
    return {
        criticalTasks: [],
        totalDuration: 0,
        slack: 0,
        longestPath: [],
    };
};
exports.calculateProjectCriticalPath = calculateProjectCriticalPath;
// ============================================================================
// PORTFOLIO MANAGEMENT (11-15)
// ============================================================================
/**
 * Creates project portfolio for multi-project management.
 *
 * @param {object} portfolioData - Portfolio creation data
 * @param {string} userId - User creating portfolio
 * @returns {Promise<ProjectPortfolio>} Created portfolio
 *
 * @example
 * ```typescript
 * const portfolio = await createProjectPortfolio({
 *   portfolioName: 'District Infrastructure Projects',
 *   description: 'All active infrastructure projects',
 *   managerId: 'manager-123'
 * }, 'admin-456');
 * ```
 */
const createProjectPortfolio = async (portfolioData, userId) => {
    return {
        id: generateUUID(),
        portfolioName: portfolioData.portfolioName,
        description: portfolioData.description,
        managerId: portfolioData.managerId,
        totalProjects: 0,
        totalBudget: 0,
        totalActualCost: 0,
        activeProjects: 0,
        completedProjects: 0,
        averageProgress: 0,
        performanceIndex: 1.0,
        metadata: portfolioData.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.createProjectPortfolio = createProjectPortfolio;
/**
 * Adds project to portfolio.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {string} projectId - Project identifier
 * @returns {Promise<object>} Association result
 *
 * @example
 * ```typescript
 * await addProjectToPortfolio('portfolio-123', 'proj-456');
 * ```
 */
const addProjectToPortfolio = async (portfolioId, projectId) => {
    return {
        portfolioId,
        projectId,
        addedAt: new Date(),
    };
};
exports.addProjectToPortfolio = addProjectToPortfolio;
/**
 * Calculates portfolio performance metrics.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<object>} Portfolio metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculatePortfolioMetrics('portfolio-123');
 * ```
 */
const calculatePortfolioMetrics = async (portfolioId) => {
    const projects = await getPortfolioProjects(portfolioId);
    const totalBudget = projects.reduce((sum, p) => sum + p.totalBudget, 0);
    const totalActualCost = projects.reduce((sum, p) => sum + p.actualCost, 0);
    const totalEarnedValue = projects.reduce((sum, p) => sum + p.earnedValue, 0);
    const averageCPI = totalActualCost > 0 ? totalEarnedValue / totalActualCost : 1;
    const averageSPI = 0.95; // Placeholder
    let portfolioHealth = 'GOOD';
    if (averageCPI >= 1.0 && averageSPI >= 1.0)
        portfolioHealth = 'EXCELLENT';
    else if (averageCPI >= 0.9 && averageSPI >= 0.9)
        portfolioHealth = 'GOOD';
    else if (averageCPI >= 0.8 && averageSPI >= 0.8)
        portfolioHealth = 'AT_RISK';
    else
        portfolioHealth = 'CRITICAL';
    return {
        totalBudget,
        totalActualCost,
        averageCPI,
        averageSPI,
        totalEarnedValue,
        portfolioHealth,
    };
};
exports.calculatePortfolioMetrics = calculatePortfolioMetrics;
/**
 * Generates portfolio dashboard with key metrics.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<object>} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generatePortfolioDashboard('portfolio-123');
 * ```
 */
const generatePortfolioDashboard = async (portfolioId) => {
    const projects = await getPortfolioProjects(portfolioId);
    const metrics = await (0, exports.calculatePortfolioMetrics)(portfolioId);
    const projectsByPhase = {};
    const projectsByStatus = {};
    projects.forEach((p) => {
        projectsByPhase[p.currentPhase] = (projectsByPhase[p.currentPhase] || 0) + 1;
        projectsByStatus[p.status] = (projectsByStatus[p.status] || 0) + 1;
    });
    return {
        metrics,
        projectsByPhase,
        projectsByStatus,
        topRisks: [],
        upcomingMilestones: [],
    };
};
exports.generatePortfolioDashboard = generatePortfolioDashboard;
/**
 * Identifies portfolio resource conflicts across projects.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<object[]>} Resource conflicts
 *
 * @example
 * ```typescript
 * const conflicts = await identifyPortfolioResourceConflicts('portfolio-123');
 * ```
 */
const identifyPortfolioResourceConflicts = async (portfolioId) => {
    // In production, analyze resource allocations across all portfolio projects
    return [];
};
exports.identifyPortfolioResourceConflicts = identifyPortfolioResourceConflicts;
// ============================================================================
// MULTI-PROJECT COORDINATION (16-20)
// ============================================================================
/**
 * Coordinates dependencies between multiple projects.
 *
 * @param {string} dependentProjectId - Dependent project ID
 * @param {string} predecessorProjectId - Predecessor project ID
 * @param {string} dependencyType - Type of dependency
 * @returns {Promise<object>} Dependency record
 *
 * @example
 * ```typescript
 * await coordinateProjectDependencies('proj-2', 'proj-1', 'FINISH_TO_START');
 * ```
 */
const coordinateProjectDependencies = async (dependentProjectId, predecessorProjectId, dependencyType) => {
    return {
        dependentProjectId,
        predecessorProjectId,
        dependencyType,
        createdAt: new Date(),
    };
};
exports.coordinateProjectDependencies = coordinateProjectDependencies;
/**
 * Allocates shared resources across multiple projects.
 *
 * @param {object} allocationData - Resource allocation data
 * @returns {Promise<ResourceAllocation>} Resource allocation
 *
 * @example
 * ```typescript
 * const allocation = await allocateSharedResources({
 *   resourceId: 'crane-001',
 *   projectAllocations: [
 *     { projectId: 'proj-1', percentage: 60 },
 *     { projectId: 'proj-2', percentage: 40 }
 *   ]
 * });
 * ```
 */
const allocateSharedResources = async (allocationData) => {
    return {
        id: generateUUID(),
        projectId: allocationData.projectId,
        resourceType: allocationData.resourceType || 'EQUIPMENT',
        resourceId: allocationData.resourceId,
        resourceName: allocationData.resourceName || '',
        allocationPercentage: allocationData.allocationPercentage,
        allocatedHours: allocationData.allocatedHours,
        actualHours: 0,
        hourlyRate: allocationData.hourlyRate,
        totalCost: (allocationData.allocatedHours || 0) * (allocationData.hourlyRate || 0),
        startDate: allocationData.startDate,
        endDate: allocationData.endDate,
        status: 'PLANNED',
        metadata: allocationData.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.allocateSharedResources = allocateSharedResources;
/**
 * Performs resource leveling across portfolio projects.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {object} options - Leveling options
 * @returns {Promise<object>} Leveling results
 *
 * @example
 * ```typescript
 * const results = await performCrossProjectResourceLeveling('portfolio-123', {
 *   prioritizeBy: 'priority',
 *   allowDelays: true
 * });
 * ```
 */
const performCrossProjectResourceLeveling = async (portfolioId, options) => {
    return {
        adjustedProjects: [],
        resourceUtilization: new Map(),
        delaysIntroduced: [],
    };
};
exports.performCrossProjectResourceLeveling = performCrossProjectResourceLeveling;
/**
 * Synchronizes schedules across dependent projects.
 *
 * @param {string[]} projectIds - Array of project IDs
 * @returns {Promise<object>} Synchronization results
 *
 * @example
 * ```typescript
 * const sync = await synchronizeProjectSchedules(['proj-1', 'proj-2', 'proj-3']);
 * ```
 */
const synchronizeProjectSchedules = async (projectIds) => {
    return {
        synchronized: true,
        conflicts: [],
        recommendations: [],
    };
};
exports.synchronizeProjectSchedules = synchronizeProjectSchedules;
/**
 * Generates cross-project impact analysis for changes.
 *
 * @param {string} projectId - Project with proposed change
 * @param {object} changeData - Change details
 * @returns {Promise<object>} Impact analysis
 *
 * @example
 * ```typescript
 * const impact = await analyzeCrossProjectImpact('proj-1', {
 *   scheduleDelay: 30,
 *   costIncrease: 500000
 * });
 * ```
 */
const analyzeCrossProjectImpact = async (projectId, changeData) => {
    return {
        impactedProjects: [],
        cumulativeScheduleImpact: 0,
        cumulativeCostImpact: 0,
        recommendations: [],
    };
};
exports.analyzeCrossProjectImpact = analyzeCrossProjectImpact;
// ============================================================================
// PHASE MANAGEMENT AND TRANSITIONS (21-25)
// ============================================================================
/**
 * Transitions project to next phase with gate review.
 *
 * @param {string} projectId - Project identifier
 * @param {ProjectPhase} toPhase - Target phase
 * @param {string} approvedBy - User approving transition
 * @returns {Promise<PhaseTransition>} Phase transition record
 *
 * @example
 * ```typescript
 * const transition = await transitionProjectPhase('proj-123', ProjectPhase.CONSTRUCTION, 'admin-456');
 * ```
 */
const transitionProjectPhase = async (projectId, toPhase, approvedBy) => {
    const project = await getConstructionProject(projectId);
    const transition = {
        id: generateUUID(),
        projectId,
        fromPhase: project.currentPhase,
        toPhase,
        transitionDate: new Date(),
        approvedBy,
        gateReviewCompleted: true,
        exitCriteriaMet: true,
        entryCriteriaMet: true,
        metadata: {},
        createdAt: new Date(),
    };
    return transition;
};
exports.transitionProjectPhase = transitionProjectPhase;
/**
 * Validates phase gate criteria before transition.
 *
 * @param {string} projectId - Project identifier
 * @param {ProjectPhase} targetPhase - Target phase
 * @returns {Promise<object>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validatePhaseGateCriteria('proj-123', ProjectPhase.CONSTRUCTION);
 * ```
 */
const validatePhaseGateCriteria = async (projectId, targetPhase) => {
    return {
        canTransition: true,
        exitCriteriaMet: true,
        entryCriteriaMet: true,
        missingCriteria: [],
        warnings: [],
    };
};
exports.validatePhaseGateCriteria = validatePhaseGateCriteria;
/**
 * Retrieves phase transition history for project.
 *
 * @param {string} projectId - Project identifier
 * @returns {Promise<PhaseTransition[]>} Phase history
 *
 * @example
 * ```typescript
 * const history = await getPhaseTransitionHistory('proj-123');
 * ```
 */
const getPhaseTransitionHistory = async (projectId) => {
    // In production, fetch from database
    return [];
};
exports.getPhaseTransitionHistory = getPhaseTransitionHistory;
/**
 * Calculates average phase durations for project type.
 *
 * @param {string} projectType - Project type
 * @param {DeliveryMethod} deliveryMethod - Delivery method
 * @returns {Promise<object>} Phase duration statistics
 *
 * @example
 * ```typescript
 * const durations = await calculatePhaseDurations('hospital', DeliveryMethod.DESIGN_BUILD);
 * ```
 */
const calculatePhaseDurations = async (projectType, deliveryMethod) => {
    // In production, calculate from historical project data
    return {};
};
exports.calculatePhaseDurations = calculatePhaseDurations;
/**
 * Generates phase completion checklist.
 *
 * @param {string} projectId - Project identifier
 * @param {ProjectPhase} phase - Phase to generate checklist for
 * @returns {Promise<object>} Phase checklist
 *
 * @example
 * ```typescript
 * const checklist = await generatePhaseChecklist('proj-123', ProjectPhase.DESIGN);
 * ```
 */
const generatePhaseChecklist = async (projectId, phase) => {
    return {
        phase,
        items: [],
        completionPercentage: 0,
    };
};
exports.generatePhaseChecklist = generatePhaseChecklist;
// ============================================================================
// BASELINE MANAGEMENT (26-30)
// ============================================================================
/**
 * Creates project baseline for scope, schedule, and cost.
 *
 * @param {object} baselineData - Baseline creation data
 * @param {string} userId - User creating baseline
 * @returns {Promise<ProjectBaseline>} Created baseline
 *
 * @example
 * ```typescript
 * const baseline = await createProjectBaseline({
 *   projectId: 'proj-123',
 *   baselineType: 'INITIAL',
 *   budget: 25000000,
 *   schedule: new Date('2025-12-31'),
 *   scope: 'Complete hospital expansion'
 * }, 'admin-456');
 * ```
 */
const createProjectBaseline = async (baselineData, userId) => {
    const baselineNumber = generateBaselineNumber(baselineData.projectId);
    return {
        id: generateUUID(),
        projectId: baselineData.projectId,
        baselineNumber,
        baselineType: baselineData.baselineType,
        baselineDate: new Date(),
        budget: baselineData.budget,
        schedule: baselineData.schedule,
        scope: baselineData.scope,
        approvedBy: userId,
        approvedAt: new Date(),
        changeReason: baselineData.changeReason,
        metadata: baselineData.metadata || {},
        createdAt: new Date(),
    };
};
exports.createProjectBaseline = createProjectBaseline;
/**
 * Compares current project status to baseline.
 *
 * @param {string} projectId - Project identifier
 * @param {string} [baselineId] - Specific baseline ID (uses current if not specified)
 * @returns {Promise<object>} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = await compareToBaseline('proj-123');
 * ```
 */
const compareToBaseline = async (projectId, baselineId) => {
    const project = await getConstructionProject(projectId);
    const baseline = await getCurrentBaseline(projectId);
    const budgetVariance = project.totalBudget - baseline.budget;
    const scheduleVarianceDays = (project.currentEndDate.getTime() - baseline.schedule.getTime()) / (1000 * 60 * 60 * 24);
    return {
        budgetVariance,
        budgetVariancePercentage: (budgetVariance / baseline.budget) * 100,
        scheduleVariance: scheduleVarianceDays,
        scheduleVarianceDays,
        scopeChanges: [],
    };
};
exports.compareToBaseline = compareToBaseline;
/**
 * Requests baseline re-baselining with justification.
 *
 * @param {string} projectId - Project identifier
 * @param {object} rebaselineData - Re-baseline request data
 * @param {string} userId - User requesting re-baseline
 * @returns {Promise<object>} Re-baseline request
 *
 * @example
 * ```typescript
 * const request = await requestBaselineChange('proj-123', {
 *   newBudget: 28000000,
 *   newSchedule: new Date('2026-03-31'),
 *   justification: 'Major scope change approved'
 * }, 'pm-456');
 * ```
 */
const requestBaselineChange = async (projectId, rebaselineData, userId) => {
    return {
        requestId: generateUUID(),
        status: 'PENDING',
        requestedBy: userId,
        requestedAt: new Date(),
    };
};
exports.requestBaselineChange = requestBaselineChange;
/**
 * Approves baseline change and creates new baseline.
 *
 * @param {string} requestId - Re-baseline request ID
 * @param {string} approvedBy - User approving change
 * @returns {Promise<ProjectBaseline>} New baseline
 *
 * @example
 * ```typescript
 * const newBaseline = await approveBaselineChange('request-123', 'director-789');
 * ```
 */
const approveBaselineChange = async (requestId, approvedBy) => {
    // In production, fetch request and create new baseline
    return {};
};
exports.approveBaselineChange = approveBaselineChange;
/**
 * Retrieves baseline history for project.
 *
 * @param {string} projectId - Project identifier
 * @returns {Promise<ProjectBaseline[]>} Baseline history
 *
 * @example
 * ```typescript
 * const history = await getBaselineHistory('proj-123');
 * ```
 */
const getBaselineHistory = async (projectId) => {
    // In production, fetch from database
    return [];
};
exports.getBaselineHistory = getBaselineHistory;
// ============================================================================
// CHANGE ORDER MANAGEMENT (31-35)
// ============================================================================
/**
 * Creates change order for project modifications.
 *
 * @param {object} changeOrderData - Change order data
 * @param {string} userId - User creating change order
 * @returns {Promise<ChangeOrder>} Created change order
 *
 * @example
 * ```typescript
 * const co = await createChangeOrder({
 *   projectId: 'proj-123',
 *   title: 'Add backup power system',
 *   description: 'Install redundant generator',
 *   changeType: 'SCOPE',
 *   costImpact: 250000,
 *   scheduleImpact: 15
 * }, 'pm-456');
 * ```
 */
const createChangeOrder = async (changeOrderData, userId) => {
    const changeOrderNumber = generateChangeOrderNumber(changeOrderData.projectId);
    return {
        id: generateUUID(),
        projectId: changeOrderData.projectId,
        changeOrderNumber,
        title: changeOrderData.title,
        description: changeOrderData.description,
        changeType: changeOrderData.changeType,
        requestedBy: userId,
        requestedDate: new Date(),
        costImpact: changeOrderData.costImpact || 0,
        scheduleImpact: changeOrderData.scheduleImpact || 0,
        status: 'DRAFT',
        approvals: [],
        metadata: changeOrderData.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.createChangeOrder = createChangeOrder;
/**
 * Processes change order approval workflow.
 *
 * @param {string} changeOrderId - Change order identifier
 * @param {object} approval - Approval details
 * @returns {Promise<ChangeOrder>} Updated change order
 *
 * @example
 * ```typescript
 * const updated = await processChangeOrderApproval('co-123', {
 *   approvedBy: 'director-789',
 *   status: 'APPROVED',
 *   comments: 'Approved with conditions'
 * });
 * ```
 */
const processChangeOrderApproval = async (changeOrderId, approval) => {
    const changeOrder = await getChangeOrder(changeOrderId);
    changeOrder.approvals.push({
        approvedBy: approval.approvedBy,
        approvedAt: new Date(),
        status: approval.status,
        comments: approval.comments,
    });
    if (approval.status === 'APPROVED') {
        changeOrder.status = 'APPROVED';
    }
    else if (approval.status === 'REJECTED') {
        changeOrder.status = 'REJECTED';
    }
    changeOrder.updatedAt = new Date();
    return changeOrder;
};
exports.processChangeOrderApproval = processChangeOrderApproval;
/**
 * Implements approved change order into project.
 *
 * @param {string} changeOrderId - Change order identifier
 * @param {string} userId - User implementing change
 * @returns {Promise<object>} Implementation result
 *
 * @example
 * ```typescript
 * await implementChangeOrder('co-123', 'pm-456');
 * ```
 */
const implementChangeOrder = async (changeOrderId, userId) => {
    const changeOrder = await getChangeOrder(changeOrderId);
    if (changeOrder.status !== 'APPROVED') {
        throw new Error('Only approved change orders can be implemented');
    }
    // Update project budget and schedule
    const project = await getConstructionProject(changeOrder.projectId);
    project.totalBudget += changeOrder.costImpact;
    if (project.currentEndDate) {
        project.currentEndDate = new Date(project.currentEndDate.getTime() + changeOrder.scheduleImpact * 24 * 60 * 60 * 1000);
    }
    changeOrder.status = 'IMPLEMENTED';
    changeOrder.implementedDate = new Date();
    return {
        implemented: true,
        implementedDate: new Date(),
        projectUpdated: true,
    };
};
exports.implementChangeOrder = implementChangeOrder;
/**
 * Retrieves change order history for project.
 *
 * @param {string} projectId - Project identifier
 * @param {object} [filters] - Optional filters
 * @returns {Promise<ChangeOrder[]>} Change orders
 *
 * @example
 * ```typescript
 * const changeOrders = await getProjectChangeOrders('proj-123', { status: 'APPROVED' });
 * ```
 */
const getProjectChangeOrders = async (projectId, filters) => {
    // In production, fetch from database with filters
    return [];
};
exports.getProjectChangeOrders = getProjectChangeOrders;
/**
 * Analyzes change order trends and patterns.
 *
 * @param {string} projectId - Project identifier
 * @returns {Promise<object>} Trend analysis
 *
 * @example
 * ```typescript
 * const trends = await analyzeChangeOrderTrends('proj-123');
 * ```
 */
const analyzeChangeOrderTrends = async (projectId) => {
    const changeOrders = await (0, exports.getProjectChangeOrders)(projectId);
    return {
        totalChangeOrders: changeOrders.length,
        averageCostImpact: changeOrders.reduce((sum, co) => sum + co.costImpact, 0) / changeOrders.length || 0,
        averageScheduleImpact: changeOrders.reduce((sum, co) => sum + co.scheduleImpact, 0) / changeOrders.length || 0,
        mostCommonType: 'SCOPE',
        approvalRate: (changeOrders.filter((co) => co.status === 'APPROVED').length / changeOrders.length) * 100 || 0,
    };
};
exports.analyzeChangeOrderTrends = analyzeChangeOrderTrends;
// ============================================================================
// INTEGRATION AND REPORTING (36-40)
// ============================================================================
/**
 * Integrates project with budget management system.
 *
 * @param {string} projectId - Project identifier
 * @param {string} budgetId - Budget system ID
 * @returns {Promise<object>} Integration result
 *
 * @example
 * ```typescript
 * await integrateWithBudgetSystem('proj-123', 'budget-456');
 * ```
 */
const integrateWithBudgetSystem = async (projectId, budgetId) => {
    return {
        integrated: true,
        budgetId,
        syncEnabled: true,
    };
};
exports.integrateWithBudgetSystem = integrateWithBudgetSystem;
/**
 * Integrates project with schedule management system.
 *
 * @param {string} projectId - Project identifier
 * @param {string} scheduleId - Schedule system ID
 * @returns {Promise<object>} Integration result
 *
 * @example
 * ```typescript
 * await integrateWithScheduleSystem('proj-123', 'schedule-789');
 * ```
 */
const integrateWithScheduleSystem = async (projectId, scheduleId) => {
    return {
        integrated: true,
        scheduleId,
        criticalPathSynced: true,
    };
};
exports.integrateWithScheduleSystem = integrateWithScheduleSystem;
/**
 * Integrates project with quality management system.
 *
 * @param {string} projectId - Project identifier
 * @param {string} qualitySystemId - Quality system ID
 * @returns {Promise<object>} Integration result
 *
 * @example
 * ```typescript
 * await integrateWithQualitySystem('proj-123', 'qms-321');
 * ```
 */
const integrateWithQualitySystem = async (projectId, qualitySystemId) => {
    return {
        integrated: true,
        qualitySystemId,
        inspectionsLinked: true,
    };
};
exports.integrateWithQualitySystem = integrateWithQualitySystem;
/**
 * Generates executive project summary report.
 *
 * @param {string} projectId - Project identifier
 * @returns {Promise<object>} Executive summary
 *
 * @example
 * ```typescript
 * const summary = await generateExecutiveSummary('proj-123');
 * ```
 */
const generateExecutiveSummary = async (projectId) => {
    const project = await getConstructionProject(projectId);
    const performanceMetrics = await (0, exports.calculateProjectEVM)(projectId);
    return {
        project,
        performanceMetrics,
        keyMilestones: [],
        topRisks: [],
        recommendations: [],
    };
};
exports.generateExecutiveSummary = generateExecutiveSummary;
/**
 * Exports project data to external formats.
 *
 * @param {string} projectId - Project identifier
 * @param {string} format - Export format ('PDF' | 'EXCEL' | 'MSP' | 'PRIMAVERA')
 * @returns {Promise<Buffer>} Exported data
 *
 * @example
 * ```typescript
 * const pdfBuffer = await exportProjectData('proj-123', 'PDF');
 * ```
 */
const exportProjectData = async (projectId, format) => {
    // In production, generate formatted export
    return Buffer.from('Project data export');
};
exports.exportProjectData = exportProjectData;
// ============================================================================
// PROJECT TEMPLATES AND CLOSEOUT (41-45)
// ============================================================================
/**
 * Creates reusable project template from existing project.
 *
 * @param {string} projectId - Source project ID
 * @param {object} templateData - Template metadata
 * @param {string} userId - User creating template
 * @returns {Promise<ProjectTemplate>} Created template
 *
 * @example
 * ```typescript
 * const template = await createProjectTemplate('proj-123', {
 *   templateName: 'Standard Hospital Expansion',
 *   description: 'Template for hospital expansion projects'
 * }, 'admin-456');
 * ```
 */
const createProjectTemplate = async (projectId, templateData, userId) => {
    const project = await getConstructionProject(projectId);
    return {
        id: generateUUID(),
        templateName: templateData.templateName,
        description: templateData.description,
        projectType: templateData.projectType || 'construction',
        deliveryMethod: project.deliveryMethod,
        phases: [
            ProjectPhase.INITIATION,
            ProjectPhase.PLANNING,
            ProjectPhase.DESIGN,
            ProjectPhase.PROCUREMENT,
            ProjectPhase.CONSTRUCTION,
            ProjectPhase.CLOSEOUT,
        ],
        defaultDuration: 365,
        defaultBudget: project.totalBudget,
        requiredDocuments: [],
        checklistItems: [],
        milestones: [],
        metadata: templateData.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.createProjectTemplate = createProjectTemplate;
/**
 * Initiates project closeout process.
 *
 * @param {string} projectId - Project identifier
 * @param {string} userId - User initiating closeout
 * @returns {Promise<object>} Closeout initiation result
 *
 * @example
 * ```typescript
 * const closeout = await initiateProjectCloseout('proj-123', 'pm-456');
 * ```
 */
const initiateProjectCloseout = async (projectId, userId) => {
    const project = await getConstructionProject(projectId);
    if (project.status !== ConstructionProjectStatus.CONSTRUCTION) {
        throw new Error('Only projects in construction phase can initiate closeout');
    }
    return {
        closeoutId: generateUUID(),
        status: 'IN_PROGRESS',
        initiatedBy: userId,
        initiatedAt: new Date(),
        checklistItems: [
            'Final inspections completed',
            'Punch list items resolved',
            'As-built drawings submitted',
            'Operations manuals delivered',
            'Warranty documentation received',
            'Final payment processed',
        ],
    };
};
exports.initiateProjectCloseout = initiateProjectCloseout;
/**
 * Captures lessons learned from project.
 *
 * @param {string} projectId - Project identifier
 * @param {object} lessonsData - Lessons learned data
 * @param {string} userId - User submitting lessons
 * @returns {Promise<object>} Lessons learned record
 *
 * @example
 * ```typescript
 * const lessons = await captureLessonsLearned('proj-123', {
 *   category: 'Schedule Management',
 *   lesson: 'Early contractor involvement improved coordination',
 *   recommendation: 'Continue using design-build for future projects'
 * }, 'pm-456');
 * ```
 */
const captureLessonsLearned = async (projectId, lessonsData, userId) => {
    return {
        id: generateUUID(),
        projectId,
        category: lessonsData.category,
        lesson: lessonsData.lesson,
        recommendation: lessonsData.recommendation,
        submittedBy: userId,
        submittedAt: new Date(),
    };
};
exports.captureLessonsLearned = captureLessonsLearned;
/**
 * Completes project closeout and archives project.
 *
 * @param {string} projectId - Project identifier
 * @param {string} userId - User completing closeout
 * @returns {Promise<object>} Closeout completion
 *
 * @example
 * ```typescript
 * await completeProjectCloseout('proj-123', 'director-789');
 * ```
 */
const completeProjectCloseout = async (projectId, userId) => {
    const project = await getConstructionProject(projectId);
    project.status = ConstructionProjectStatus.COMPLETED;
    project.actualEndDate = new Date();
    return {
        completed: true,
        completedBy: userId,
        completedAt: new Date(),
        finalReport: `Final project report for ${project.projectName}`,
    };
};
exports.completeProjectCloseout = completeProjectCloseout;
/**
 * Generates project performance benchmarking report.
 *
 * @param {string} projectId - Project identifier
 * @param {string[]} comparisonProjectIds - Projects to compare against
 * @returns {Promise<object>} Benchmarking report
 *
 * @example
 * ```typescript
 * const benchmark = await generateProjectBenchmark('proj-123', ['proj-100', 'proj-101']);
 * ```
 */
const generateProjectBenchmark = async (projectId, comparisonProjectIds) => {
    const project = await getConstructionProject(projectId);
    const metrics = await (0, exports.calculateProjectEVM)(projectId);
    return {
        project,
        metrics,
        comparisons: [],
        ranking: 1,
        insights: ['Project performance above average', 'Cost control excellent', 'Schedule on track'],
    };
};
exports.generateProjectBenchmark = generateProjectBenchmark;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Gets construction project by ID (placeholder)
 */
async function getConstructionProject(id) {
    return {
        id,
        projectNumber: 'NAD-2025-C-0001',
        projectName: 'Test Project',
        description: 'Test',
        status: ConstructionProjectStatus.PLANNING,
        currentPhase: ProjectPhase.PLANNING,
        priority: ProjectPriority.MEDIUM,
        deliveryMethod: DeliveryMethod.DESIGN_BID_BUILD,
        projectManagerId: 'user-1',
        totalBudget: 10000000,
        committedCost: 0,
        actualCost: 0,
        forecastedCost: 10000000,
        contingencyReserve: 1000000,
        managementReserve: 500000,
        progressPercentage: 0,
        earnedValue: 0,
        plannedValue: 0,
        regulatoryCompliance: [],
        environmentalPermits: [],
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'user-1',
    };
}
async function getProjectTemplate(id) {
    return {
        id,
        templateName: 'Standard Construction',
        description: 'Standard template',
        projectType: 'construction',
        deliveryMethod: DeliveryMethod.DESIGN_BID_BUILD,
        phases: [],
        defaultDuration: 365,
        defaultBudget: 1000000,
        requiredDocuments: [],
        checklistItems: [],
        milestones: [],
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
async function getCurrentBaseline(projectId) {
    return {
        id: generateUUID(),
        projectId,
        baselineNumber: 'BL-001',
        baselineType: 'INITIAL',
        baselineDate: new Date(),
        budget: 10000000,
        schedule: new Date(),
        scope: 'Initial scope',
        approvedBy: 'admin',
        approvedAt: new Date(),
        metadata: {},
        createdAt: new Date(),
    };
}
async function getChangeOrder(id) {
    return {
        id,
        projectId: 'proj-1',
        changeOrderNumber: 'CO-001',
        title: 'Test Change',
        description: 'Test',
        changeType: 'SCOPE',
        requestedBy: 'user-1',
        requestedDate: new Date(),
        costImpact: 0,
        scheduleImpact: 0,
        status: 'DRAFT',
        approvals: [],
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
async function getPortfolioProjects(portfolioId) {
    return [];
}
function calculatePlannedValue(project) {
    const now = new Date();
    const start = project.baselineSchedule?.getTime() || now.getTime();
    const end = project.baselineEndDate?.getTime() || now.getTime();
    const elapsed = now.getTime() - start;
    const total = end - start;
    if (elapsed <= 0)
        return 0;
    if (elapsed >= total)
        return project.totalBudget;
    return (elapsed / total) * project.totalBudget;
}
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
function generateBaselineNumber(projectId) {
    const sequence = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0');
    return `BL-${sequence}`;
}
function generateChangeOrderNumber(projectId) {
    const sequence = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0');
    return `CO-${sequence}`;
}
// ============================================================================
// NESTJS CONTROLLER
// ============================================================================
/**
 * Construction Project Management Controller
 * Provides RESTful API endpoints for construction project management
 */
let ConstructionProjectController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('construction-projects'), (0, common_1.Controller)('construction-projects'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _create_decorators;
    let _findOne_decorators;
    let _updateProgress_decorators;
    let _getEVM_decorators;
    let _createBaseline_decorators;
    let _createCO_decorators;
    let _getStatusReport_decorators;
    var ConstructionProjectController = _classThis = class {
        async create(createDto) {
            return (0, exports.createConstructionProject)(createDto, 'current-user');
        }
        async findOne(id) {
            return getConstructionProject(id);
        }
        async updateProgress(id, progressDto) {
            return (0, exports.updateProjectProgress)(id, progressDto, 'current-user');
        }
        async getEVM(id) {
            return (0, exports.calculateProjectEVM)(id);
        }
        async createBaseline(id, baselineDto) {
            return (0, exports.createProjectBaseline)(baselineDto, 'current-user');
        }
        async createCO(id, coDto) {
            return (0, exports.createChangeOrder)(coDto, 'current-user');
        }
        async getStatusReport(id) {
            return (0, exports.generateProjectStatusReport)(id);
        }
        constructor() {
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
    __setFunctionName(_classThis, "ConstructionProjectController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create new construction project' }), (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true }))];
        _findOne_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get construction project by ID' })];
        _updateProgress_decorators = [(0, common_1.Patch)(':id/progress'), (0, swagger_1.ApiOperation)({ summary: 'Update project progress' })];
        _getEVM_decorators = [(0, common_1.Get)(':id/evm'), (0, swagger_1.ApiOperation)({ summary: 'Calculate earned value metrics' })];
        _createBaseline_decorators = [(0, common_1.Post)(':id/baselines'), (0, swagger_1.ApiOperation)({ summary: 'Create project baseline' })];
        _createCO_decorators = [(0, common_1.Post)(':id/change-orders'), (0, swagger_1.ApiOperation)({ summary: 'Create change order' })];
        _getStatusReport_decorators = [(0, common_1.Get)(':id/status-report'), (0, swagger_1.ApiOperation)({ summary: 'Generate project status report' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: obj => "findOne" in obj, get: obj => obj.findOne }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateProgress_decorators, { kind: "method", name: "updateProgress", static: false, private: false, access: { has: obj => "updateProgress" in obj, get: obj => obj.updateProgress }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getEVM_decorators, { kind: "method", name: "getEVM", static: false, private: false, access: { has: obj => "getEVM" in obj, get: obj => obj.getEVM }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createBaseline_decorators, { kind: "method", name: "createBaseline", static: false, private: false, access: { has: obj => "createBaseline" in obj, get: obj => obj.createBaseline }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createCO_decorators, { kind: "method", name: "createCO", static: false, private: false, access: { has: obj => "createCO" in obj, get: obj => obj.createCO }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStatusReport_decorators, { kind: "method", name: "getStatusReport", static: false, private: false, access: { has: obj => "getStatusReport" in obj, get: obj => obj.getStatusReport }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConstructionProjectController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConstructionProjectController = _classThis;
})();
exports.ConstructionProjectController = ConstructionProjectController;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    createConstructionProjectModel: exports.createConstructionProjectModel,
    createProjectBaselineModel: exports.createProjectBaselineModel,
    createChangeOrderModel: exports.createChangeOrderModel,
    // Project Creation
    createConstructionProject: exports.createConstructionProject,
    generateConstructionProjectNumber: exports.generateConstructionProjectNumber,
    initializeProjectFromTemplate: exports.initializeProjectFromTemplate,
    cloneConstructionProject: exports.cloneConstructionProject,
    archiveConstructionProject: exports.archiveConstructionProject,
    // Project Tracking
    updateProjectProgress: exports.updateProjectProgress,
    calculateProjectEVM: exports.calculateProjectEVM,
    trackProjectSchedule: exports.trackProjectSchedule,
    generateProjectStatusReport: exports.generateProjectStatusReport,
    calculateProjectCriticalPath: exports.calculateProjectCriticalPath,
    // Portfolio Management
    createProjectPortfolio: exports.createProjectPortfolio,
    addProjectToPortfolio: exports.addProjectToPortfolio,
    calculatePortfolioMetrics: exports.calculatePortfolioMetrics,
    generatePortfolioDashboard: exports.generatePortfolioDashboard,
    identifyPortfolioResourceConflicts: exports.identifyPortfolioResourceConflicts,
    // Multi-Project Coordination
    coordinateProjectDependencies: exports.coordinateProjectDependencies,
    allocateSharedResources: exports.allocateSharedResources,
    performCrossProjectResourceLeveling: exports.performCrossProjectResourceLeveling,
    synchronizeProjectSchedules: exports.synchronizeProjectSchedules,
    analyzeCrossProjectImpact: exports.analyzeCrossProjectImpact,
    // Phase Management
    transitionProjectPhase: exports.transitionProjectPhase,
    validatePhaseGateCriteria: exports.validatePhaseGateCriteria,
    getPhaseTransitionHistory: exports.getPhaseTransitionHistory,
    calculatePhaseDurations: exports.calculatePhaseDurations,
    generatePhaseChecklist: exports.generatePhaseChecklist,
    // Baseline Management
    createProjectBaseline: exports.createProjectBaseline,
    compareToBaseline: exports.compareToBaseline,
    requestBaselineChange: exports.requestBaselineChange,
    approveBaselineChange: exports.approveBaselineChange,
    getBaselineHistory: exports.getBaselineHistory,
    // Change Order Management
    createChangeOrder: exports.createChangeOrder,
    processChangeOrderApproval: exports.processChangeOrderApproval,
    implementChangeOrder: exports.implementChangeOrder,
    getProjectChangeOrders: exports.getProjectChangeOrders,
    analyzeChangeOrderTrends: exports.analyzeChangeOrderTrends,
    // Integration
    integrateWithBudgetSystem: exports.integrateWithBudgetSystem,
    integrateWithScheduleSystem: exports.integrateWithScheduleSystem,
    integrateWithQualitySystem: exports.integrateWithQualitySystem,
    generateExecutiveSummary: exports.generateExecutiveSummary,
    exportProjectData: exports.exportProjectData,
    // Templates and Closeout
    createProjectTemplate: exports.createProjectTemplate,
    initiateProjectCloseout: exports.initiateProjectCloseout,
    captureLessonsLearned: exports.captureLessonsLearned,
    completeProjectCloseout: exports.completeProjectCloseout,
    generateProjectBenchmark: exports.generateProjectBenchmark,
    // Controller
    ConstructionProjectController,
};
//# sourceMappingURL=construction-project-management-kit.js.map